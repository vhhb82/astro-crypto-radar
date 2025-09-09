import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://astro-crypto-radar.vercel.app', // pune domeniul tău
  output: 'static',                               // important pe Vercel ca să nu ceară adapter SSR
  integrations: [react(), sitemap(), tailwind()],
  server: { port: 4321 },
})




