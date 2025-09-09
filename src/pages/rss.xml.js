```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';


export async function GET(context) {
const posts = (await getCollection('blog'))
.filter((p) => !p.data.draft)
.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
return rss({
title: 'Crypto Radar — Blog',
description: 'Strategii, idei și analize pentru crypto.',
site: context.site,
items: posts.map((p) => ({
title: p.data.title,
description: p.data.description,
pubDate: p.data.pubDate,
link: `/blog/${p.slug}/`,
})),
stylesheet: true,
});
}
```


---