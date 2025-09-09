// astro.config.mjs
import { defineConfig } from 'astro/config'

// Integrations
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

// Vercel adapter (compatibil Astro 4.x -> @astrojs/vercel@^7)
import vercel from '@astrojs/vercel/serverless'

// IMPORTANT: la build pe Vercel, nu seta localhost ca site.
// Poți pune domeniul tău când îl ai (ex: 'https://crypto-radar.vercel.app').
export default defineConfig({
  // scoate 'http://localhost:4321' din site; lasă gol sau pune domeniul public când e gata
  // site: 'https://crypto-radar.vercel.app',

  output: 'server',     // avem endpoint /api/news.json -> SSR/Server output
  adapter: vercel(),    // conectează proiectul la platforma Vercel

  integrations: [
    react(),
    sitemap(),
    tailwind(),
  ],

  // Setări locale de dev (opțional): portul pentru `npm run dev`
  server: { port: 4321 },
})

