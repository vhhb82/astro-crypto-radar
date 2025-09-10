import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  // Pune aici domeniul tău de producție, COMPLET, cu https://
  // Pentru Cloudflare Pages: https://astro-crypto-radar.pages.dev
  // (sau domeniul tău custom dacă îl setezi)
  site: 'https://astro-crypto-radar.pages.dev',
  // la Cloudflare nu mai ai nevoie de "base" pentru subfolder
  // poți să-l elimini sau să-l lași 'base: "/"'
  // base: '/',
  output: 'static',
  integrations: [react(), sitemap(), tailwind()],
})








