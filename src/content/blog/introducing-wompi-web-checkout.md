---
title: "Introducing wompi_web_checkout"
description: "wompi_web_checkout builds integrity-signed Wompi checkout URLs from Dart or Flutter, with the validation that turns a silently rejected checkout into an error you can read."
publishedAt: 2026-08-28
tags: ["Dart", "Flutter", "Payments", "Open Source"]
---

If you build apps in Colombia, sooner or later you have to take a payment, and sooner or later that means [Wompi](https://wompi.co), Bancolombia's payment gateway. It is well documented and it works.

There are two documented ways into it from a client: a JavaScript widget, which is not an option in Flutter, and the **Web Checkout**, a page Wompi hosts that you send the payer to with everything encoded in the URL. The second one is the practical path. You build a URL, you open it in a webview or the system browser, Wompi handles the cards and the PSE flow and the 3DS challenges, and the payer comes back to your `redirectUrl` when it's over.

So the whole integration reduces to *building a URL correctly*. Which sounds like nothing, and then you get to the signature.

That's what [`wompi_web_checkout`](https://pub.dev/packages/wompi_web_checkout) is for. It's a pure Dart package (no Flutter dependency, two small ones) that builds those URLs, signs them, and validates everything before you ever hit the network.

## The signature

Wompi requires an **integrity signature** on the checkout URL: a SHA-256 hash of the payment's own values concatenated with a secret only you and Wompi know.

```
<Reference><AmountInCents><Currency>[<ExpirationTime>]<IntegritySecret>
```

The point is that the URL is a client-side artifact. Without a signature, anyone could take the checkout link for a COP $200.000 order, change `amount-in-cents` to `100`, and pay COP $1 instead. The hash covers the values that matter, so tampering with any of them invalidates the URL.

## Where the secret lives

Wompi's own docs are unambiguous: [hash on your server, never on your frontend](https://docs.wompi.co/docs/colombia/widget-checkout-web/#paso-3-genera-una-firma-de-integridad), because a frontend exposes the integration secret to whoever wants it. They're right, and the reason is worth spelling out: an app binary is not a secret store. Anyone can pull the strings out of an APK. If the integrity secret ships inside your app, an attacker has everything they need to sign a URL for any amount they like, and the signature that was supposed to stop them will validate perfectly.

So there is no default way to build a client. There are two named constructors, and the only thing that separates them is where the secret lives.

```dart
// The secret stays on your backend. The app only ever sees the hash.
final wompi = WompiWebCheckout.fromServer(
  publicKey: '<YOUR_PUBLIC_KEY>',
  integritySignature: '<SIGNATURE_FROM_YOUR_BACKEND>',
);

// The secret ships in the app, which hashes locally.
final wompi = WompiWebCheckout.fromClient(
  publicKey: '<YOUR_PUBLIC_KEY>',
  integrityKey: '<YOUR_INTEGRITY_SECRET>',
);
```

`fromServer` is the one to reach for from an app. `fromClient` is not there for people who couldn't be bothered: this is pure Dart, so the code holding the secret is not always a client. In a Dart backend that builds checkout links, in a CLI, or in an internal tool running on a machine the merchant controls, the secret is already where it belongs, and calling out to another service to hash four strings would be theatre. The same goes for a sandbox integration signing with a `test_integrity_` key.

The risk is narrower than "don't sign locally" suggests: it is a secret inside a binary you hand to strangers. So neither constructor is the default one. You name the trade-off you are making, and `wompi.signsLocally` tells the two apart at runtime. The public key is a different matter: Wompi puts it in the URL itself, so keeping it in the app is fine.

One consequence of `fromServer` catches people: **one signature, one payment.** The hash covers the reference, the amount and the expiration, so a client built for one payment cannot be reused for another.

And your signing endpoint should take everything it signs, the amount, the reference and the expiration, from the order in your database, never from what the app sends it. Signing whatever the client asks for gives away the exact protection the signature exists to provide.

## Making disagreement impossible

Most of the API follows from one question: which mismatches can be made unrepresentable?

**Currency.** It appears in the signed string and in the URL, so there are two places for it to drift apart. The fix is to delete the choice: it isn't a parameter at all, it belongs to the country. `WompiCountry.colombia` always means `COP` and `WompiCountry.panama` always means `USD`, so both places read from one source.

**Expiration time.** Wompi documents millisecond precision, and Dart's `DateTime` carries microseconds, so `toIso8601String()` would put three extra digits into both the hash and the URL. `WompiCheckoutData` normalizes to UTC milliseconds on construction and exposes the result.

**Whitespace.** A trailing newline on a key or a signature, whether from an `.env` file, an HTTP response body or a dashboard copy-paste, renders as nothing in a debugger and gets hashed like any other character. Keys and signatures are trimmed on the way in, and a value that is only whitespace is reported as empty, which is what it is.

## Errors you can actually read

Every field validates on construction, so a `WompiCheckoutData` can never hold a malformed value. And it doesn't stop at the first problem:

```dart
try {
  final data = WompiCheckoutData(amountInCents: 0, reference: '');
  final uri = wompi.getCheckoutUri(data);
} on WompiValidationException catch (e) {
  for (final error in e.errors) {
    print('${error.field}: ${error.message}');
  }
  // amountInCents: Amount in cents must be greater than 0.
  // reference: Reference cannot be empty.
}
```

Fixing a checkout form one exception at a time is miserable. Fixing it once, with the full list, is not. Everything the package throws extends `WompiException`.

Validation happens at two moments, split by what the rule depends on. Amount, reference format and the phone/prefix and legal ID/type pairings are properties of the data, checked when you construct it. Whether `NIT` is an acceptable document type, whether a consumption tax may be sent, whether the expiration is still in the future: those depend on the merchant's country and on the clock, so `getCheckoutUri` checks them. Which means the same `WompiCheckoutData` is safe to build, store and reuse, and can be handed to a Colombian client and a Panamanian one, and each will tell you what doesn't apply to it.

## Colombia and Panama

Both checkouts are supported: `checkout.wompi.co` in COP and `checkout.wompi.pa` in USD. The documented catalogs differ in a handful of country-specific parameters, and each difference is a flag on `WompiCountry` that `getCheckoutUri` enforces. A consumption tax or a payment method reference on a Panamanian checkout is rejected before it becomes a URL, as is a checkout language on a Colombian one, or a Colombian-only document type like `NIT` on a Panamanian merchant.

Everything else behaves identically in both countries, so none of it is gated. The [README](https://github.com/atleugim/wompi_web_checkout#readme) has the parameter-by-parameter breakdown.

## Putting it together

Your backend decides what the payment is and signs it. The app turns that into a URL:

```dart
// The backend decides amount, reference and expiration, signs them,
// and returns all of it.
final payment = await myApi.createWompiPayment(orderId);

final wompi = WompiWebCheckout.fromServer(
  publicKey: '<YOUR_PUBLIC_KEY>',
  integritySignature: payment.signature,
);

final uri = wompi.getCheckoutUri(
  WompiCheckoutData(
    amountInCents: payment.amountInCents, // 4950000, COP $49.500
    reference: payment.reference,
    // '2030-06-09T20:28:50.000Z', already UTC with millisecond
    // precision, so normalizing leaves it untouched.
    expirationTime: DateTime.parse(payment.expiresAt),
    redirectUrl: 'https://mystore.com/payments/result',
  ),
);
```

Only `amountInCents` and `reference` are required, everything else is optional and there to pre-fill the checkout so the payer types less: `customerData`, `shippingAddress`, `taxes`, `expirationTime`, `collectShipping`, `collectCustomerLegalId`. Every model has a strictly typed `copyWith` and a `clear` for removing optional fields, and `clear` still validates, so it won't let you break a pair Wompi requires together.

Open `uri` in a webview or the system browser and Wompi takes it from there.

One last thing, and it's the mistake I'd most like to save someone: **the redirect is not a payment confirmation.** It is a client-side navigation that can be closed, backgrounded, lost to a dead battery, or replayed. Use [Wompi's events](https://docs.wompi.co/docs/colombia/eventos/) to learn when a transaction actually reaches a final state, and the `id` Wompi appends to your `redirectUrl` to [look the transaction up](https://docs.wompi.co/docs/colombia/transacciones/) server-side. Never mark an order paid because the user came back to your success screen.

## Try it

Pure Dart, two small dependencies (`crypto`, `meta`), no Flutter requirement, so it works in a server, a CLI or an app. MIT licensed.

```yaml
dependencies:
  wompi_web_checkout: ^3.0.0
```

- [pub.dev/packages/wompi_web_checkout](https://pub.dev/packages/wompi_web_checkout)
- [github.com/atleugim/wompi_web_checkout](https://github.com/atleugim/wompi_web_checkout), including a complete Flutter example with `webview_flutter`

Bugs, suggestions and pull requests are all welcome.
