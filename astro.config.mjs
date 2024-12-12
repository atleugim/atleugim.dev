// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import metaTags from 'astro-meta-tags';

// https://astro.build/config
export default defineConfig({
  site: 'https://atleugim.dev',
  integrations: [tailwind(), sitemap(), metaTags()]
});