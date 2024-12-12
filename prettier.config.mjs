/** @type {import("prettier").Config} */
export default {
  endOfLine: "lf",
  semi: true,
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "none",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro"
      }
    }
  ],
  importOrder: [
    "^astro",
    "^@astrojs",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@",
    "",
    "^~/layouts/",
    "",
    "^~/assets/",
    "",
    "^~/queries/",
    "^~/utils/",
    "",
    "^~/components/",
    "^~/",
    "",
    "^[./]"
  ],
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports"
  ]
};
