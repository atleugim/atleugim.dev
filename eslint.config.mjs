import eslintPluginAstro from "eslint-plugin-astro";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    ignores: [
      "node_modules/",
      ".astro/",
      ".vercel/",
      "public/",
      "pnpm-lock.yaml",
    ],
  },
];
