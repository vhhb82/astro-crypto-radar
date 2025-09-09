// src/pages/rss.xml.js
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog', (entry) => !entry.data.draft);

  return rss({
    title: 'Crypto Radar – Blog',
    description: 'Ultimele articole din blog',
    site: import.meta.env.SITE || 'https://astro-crypto-radar.vercel.app',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.slug}/`,
    })),
    stylesheet: true,
  });
}
