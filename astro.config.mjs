import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: process.env.SITE_URL || 'https://astro-crypto-radar.vercel.app',
  integrations: [react(), sitemap(), tailwind()],
});




