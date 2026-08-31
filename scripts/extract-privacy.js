import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = JSON.parse(fs.readFileSync(path.join(__dirname, '../scraped_data/scraped_pages.json'), 'utf8'));
const pp = pages['privacy-policy-2'];
const html = pp.rawCleanHtml || '';

// Find entry-content
const entryMarker = 'class="entry-content"';
const entryStart = html.indexOf(entryMarker);
let body = '';
if (entryStart !== -1) {
  const searchFrom = entryStart + entryMarker.length;
  // Find matching closing
  const endMarkers = ['<!-- .entry-content -->', '<footer', '<div class="tm-post-prev-next'];
  let endPos = html.length;
  for (const em of endMarkers) {
    const idx = html.indexOf(em, searchFrom);
    if (idx !== -1 && idx < endPos) endPos = idx;
  }
  body = html.slice(searchFrom, endPos);
} else {
  // Try single-content-hc
  const altStart = html.indexOf('id="content"');
  if (altStart !== -1) {
    body = html.slice(altStart);
  }
}

// Extract paragraphs, headings, lists
const blocks = [];
const regex = /<(h[1-4]|p|ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
let match;
while ((match = regex.exec(body)) !== null) {
  const tag = match[1].toLowerCase();
  const inner = match[2];
  const text = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8211;/g, '–').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  
  if (!text) continue;
  if (text.includes('nav-parent-link') || text.includes('linearGradient')) continue;
  
  if (tag.startsWith('h')) {
    blocks.push({ type: tag, text });
  } else if (tag === 'p') {
    if (text.length > 3) blocks.push({ type: 'p', text });
  } else if (tag === 'ul' || tag === 'ol') {
    const items = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(inner)) !== null) {
      const itemText = liMatch[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
      if (itemText && !itemText.includes('nav-parent-link')) items.push(itemText);
    }
    if (items.length > 0) blocks.push({ type: tag, items });
  }
}

console.log(JSON.stringify(blocks.slice(0, 5), null, 2));
console.log('Total blocks:', blocks.length);

fs.writeFileSync(path.join(__dirname, '../scraped_data/privacy_blocks.json'), JSON.stringify(blocks, null, 2));
console.log('Saved privacy_blocks.json');
