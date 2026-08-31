import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = JSON.parse(fs.readFileSync(path.join(__dirname, '../scraped_data/scraped_pages.json'), 'utf8'));

const solutions = [
  'solutions/bookkeeping',
  'solutions/cfo-advisory-services',
  'solutions/tax',
  'solutions/wealth-management'
];

for (const key of solutions) {
  const page = pages[key];
  if (!page) {
    console.log('Missing key:', key);
    continue;
  }
  const html = page.rawCleanHtml || '';
  
  // Extract all headings, paragraphs, lists
  const items = [];
  const regex = /<(h[1-6]|p|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const text = match[2]
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    if (text && text.length > 2) {
      if (text.includes('SMG ABA LLC ©') || text.includes('All rights reserved') || text.includes('Cookie Policy') || text.includes('nav-parent-link') || text.includes('linearGradient')) {
        continue;
      }
      items.push({ tag, text });
    }
  }

  const outPath = path.join(__dirname, `../scraped_data/${key.replace('/', '_')}_parsed.json`);
  fs.writeFileSync(outPath, JSON.stringify({ key, title: page.title, metaDesc: page.metaDesc, h1: page.h1, items }, null, 2));
  console.log(`Wrote ${outPath} with ${items.length} items`);
}
