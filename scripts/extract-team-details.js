import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '../scraped_data/our_team_full.html'), 'utf8');

// Let's inspect the exact HTML structure
// Search for each email in html to extract full details
const emails = [
  'Gregory@smgaba.com',
  'Wesley@smgaba.com',
  'David@smgaba.com',
  'Marc@smgaba.com',
  'Erin@smgaba.com',
  'Marianne@smgaba.com',
  'MAruanna@smgaba.com',
  'LShalom@smgaba.com',
  'KLevine@smgaba.com',
  'MSyed@smgaba.com',
  'CAdams@smgaba.com',
  'KSharma@smgaba.com',
  'CCortes@smgaba.com',
  'JFleming@smgaba.com',
  'DSavino@smgaba.com',
  'agarcia@smgaba.com',
  'csantiago@smgaba.com'
];

const teamData = [];

emails.forEach(email => {
  const emailIdx = html.indexOf(email);
  if (emailIdx === -1) return;

  // Search backward for the member start container or image
  const startChunk = html.slice(Math.max(0, emailIdx - 2000), emailIdx);
  const endChunk = html.slice(emailIdx, Math.min(html.length, emailIdx + 3000));
  const fullChunk = startChunk + endChunk;

  // Let's find images in startChunk or endChunk
  const imgMatches = [...fullChunk.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1])
    .filter(u => u.includes('/uploads/'));
  const avatar = imgMatches[0] || '';

  // Extract all text elements in the chunk
  // Let's find headings and paragraphs around email
  console.log('====================================================');
  console.log('EMAIL:', email);
  console.log('AVATAR:', avatar);
  
  // Find headings in startChunk
  const hMatches = [...startChunk.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)];
  const headings = hMatches.map(m => m[2].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('HEADINGS BEFORE EMAIL:', headings);

  // Find paragraphs in endChunk
  const pMatches = [...endChunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const paragraphs = pMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(t => t.length > 20);
  console.log('PARAGRAPHS AFTER EMAIL:', paragraphs.slice(0, 3));
});
