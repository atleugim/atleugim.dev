/** @type {import("prettier").Config} */
export default {
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  importOrder: [
    "^astro",
    "^@astrojs",
    "<THIRD_PARTY_MODULES>",
    "^@",
    "",
    "^~/layouts/",
    "",
    "^~/queries/",
    "^~/lib/",
    "",
    "^~/components/",
    "^~/",
    "",
    "^[./]",
  ],
};
