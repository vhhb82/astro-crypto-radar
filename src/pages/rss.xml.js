// src/pages/rss.xml.js
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const posts = await getCollection('blog', (entry) => !entry.data.draft)

  return rss({
    title: 'Crypto Radar — Blog',
    description: 'Ultimele articole din blog',
    site: context.site, // preluat din astro.config.mjs -> site
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.slug}/`,   // <<— backticks!
    })),
    stylesheet: true,
  })
}
