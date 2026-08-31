import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '../scraped_data/our_team_full.html'), 'utf8');

// In WordPress theme fixology/webflow, let's find the content container
console.log('HTML Length:', html.length);

// Let's find all images inside wp-content/uploads/
const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log('All image URLs:', imgMatches.filter(u => !u.includes('logo') && !u.includes('icon')));

// Let's find email links
const emailMatches = [...html.matchAll(/mailto:([^"'>\s]+)/gi)].map(m => m[1]);
console.log('All email addresses:', [...new Set(emailMatches)]);

// Let's write a parser for each member block
// Let's look for headings
const regex = /<(h[1-6]|p|div)[^>]*>([\s\S]*?)<\/\1>/gi;

// Let's dump the body content of the team section to inspect
const contentStart = html.indexOf('class="entry-content"') !== -1 ? html.indexOf('class="entry-content"') : html.indexOf('id="content"');
const contentEnd = html.indexOf('id="footer"') !== -1 ? html.indexOf('id="footer"') : html.indexOf('class="footer"');

const teamBody = html.slice(contentStart, contentEnd !== -1 ? contentEnd : html.length);
fs.writeFileSync(path.join(__dirname, '../scraped_data/our_team_body.html'), teamBody);
console.log('Saved team body, length:', teamBody.length);
