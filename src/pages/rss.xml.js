export const prerender = true;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', (e) => !e.data.draft);
  return rss({
    title: 'Crypto Radar — Blog',
    description: 'Ultimele articole din blog',
    site: context.site?.toString() || import.meta.env.SITE_URL || 'https://example.pages.dev',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.slug}/`,
    })),
  });
}

