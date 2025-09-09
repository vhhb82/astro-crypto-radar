// astro.config.mjs
import { defineConfig } from 'astro/config'

// Integrations
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

// Adapter Vercel (compatibil Astro 4.x)
import vercel from '@astrojs/vercel/serverless'

export default defineConfig({
  // la build pe Vercel nu folosi localhost la `site`
  // site: 'https://crypto-radar.vercel.app',

  output: 'server',     // necesar pentru endpoint /api/news.json
  adapter: vercel(),    // conectează la Vercel

  integrations: [react(), sitemap(), tailwind()],

  // doar pentru dev local
  server: { port: 4321 }
})


