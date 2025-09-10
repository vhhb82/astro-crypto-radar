// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',         // <- asta e cheia
  // site: 'https://<subdomeniu-tau>.pages.dev', // poți adăuga după ce ai URL-ul de la Cloudflare
  integrations: [react(), sitemap(), tailwind()],
});






