// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

// alege UNA dintre variantele de adapter în funcție de nevoi:
import vercel from '@astrojs/vercel/serverless'   // recomandat (Serverless Functions)
// import vercel from '@astrojs/vercel/edge'      // Edge Functions
// import vercel from '@astrojs/vercel/node'      // Node.js runtime

export default defineConfig({
  // setează domeniul tău final aici dacă vrei canonicale corecte
  site: 'https://astro-crypto-radar.vercel.app',

  output: 'server',
  adapter: vercel(),           // <<--- ESENȚIAL

  integrations: [
    react(),
    sitemap(),
    tailwind(),
  ],
})




