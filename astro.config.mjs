import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://astro-crypto-radar.pages.dev', // domeniul Cloudflare Pages (sau custom dacă ai)
  output: 'static',
  integrations: [react(), sitemap(), tailwind()],
})









