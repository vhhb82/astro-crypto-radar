// astro.config.mjs
import { defineConfig } from 'astro/config'

// Integrations
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

// Adapter Vercel (compatibil Astro 4.x -> @astrojs/vercel@^7)
import vercel from '@astrojs/vercel/serverless'

export default defineConfig({
  // nu seta localhost la build pe Vercel; poți pune domeniul când îl ai:
  // site: 'https://crypto-radar.vercel.app',

  output: 'server',     // avem /api/news.json -> SSR
  adapter: vercel(),    // conectează la Vercel

  integrations: [react(), sitemap(), tailwind()],

  // doar pentru development local
  server: { port: 4321 }
})



