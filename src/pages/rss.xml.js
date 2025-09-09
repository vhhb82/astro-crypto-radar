import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET({ site }) {
  // ia postările publice (fără draft)
  const posts = await getCollection('blog', (entry) => !entry.data.draft);

  // fallback dacă site nu e setat în astro.config.mjs
  const siteUrl =
    site?.toString() ??
    import.meta.env.SITE_URL ??
    'https://astro-crypto-radar.vercel.app';

  return rss({
    title: 'Crypto Radar — Blog',
    description: 'Ultimele articole din blog',
    site: siteUrl,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.slug}/`,   // <-- BACKTICKS, nu ghilimele
    })),
    // NU folosim `stylesheet` aici
  });
}

