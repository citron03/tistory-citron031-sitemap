import fs from 'fs';
import Parser from 'rss-parser';

const parser = new Parser({
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RSSBot/1.0)',
      'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
    }
  }
});

const rssUrl = 'https://citron031.tistory.com/rss';

const genSitemap = async () => {
  const feed = await parser.parseURL(rssUrl);

  const urls = feed.items.map(item => {
    const pubDate = new Date(item.pubDate).toISOString();
    return `
  <url>
    <loc>${item.link}</loc>
    <lastmod>${pubDate}</lastmod>
    <priority>0.80</priority>
  </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

  fs.writeFileSync('sitemap.xml', xml.trim());
};

genSitemap();
