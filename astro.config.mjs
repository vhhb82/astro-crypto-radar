import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://<numele-proiectului>.pages.dev', // poți ajusta după primul deploy
  output: 'static',
  integrations: [react(), tailwind(), sitemap()],
});







