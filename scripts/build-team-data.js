import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '../scraped_data/our_team_full.html'), 'utf8');

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

const team = [];

emails.forEach(email => {
  const emailIdx = html.indexOf(email);
  if (emailIdx === -1) return;

  const startChunk = html.slice(Math.max(0, emailIdx - 1500), emailIdx);
  const endChunk = html.slice(emailIdx, Math.min(html.length, emailIdx + 3000));
  const fullChunk = startChunk + endChunk;

  // Avatar
  const imgMatches = [...fullChunk.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1])
    .filter(u => u.includes('/uploads/'));
  const avatar = imgMatches[0] || '';

  // Headings
  const hMatches = [...startChunk.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)];
  const headings = hMatches.map(m => m[2].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  
  // Last heading is usually Name, second to last is Title/Role
  let role = headings[headings.length - 2] || 'Team Member';
  let name = headings[headings.length - 1] || 'SMG Professional';
  if (role === 'Partners' || role === 'Our Team') {
    role = 'Partner';
  }

  // Paragraphs
  const pMatches = [...endChunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const paragraphs = pMatches
    .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim())
    .filter(t => t.length > 25 && !t.includes('All rights reserved') && !t.includes('Opt In'));

  // Bio
  const bio = paragraphs.join('\n\n');

  // Department / Category classification
  let category = 'Leadership';
  if (role.toLowerCase().includes('partner')) category = 'Partners';
  else if (role.toLowerCase().includes('director') || role.toLowerCase().includes('cfo')) category = 'Directors & Executive Advisory';
  else if (role.toLowerCase().includes('tax')) category = 'Tax & Compliance';
  else if (role.toLowerCase().includes('accounting') || role.toLowerCase().includes('bookkeeping') || role.toLowerCase().includes('onboarding') || role.toLowerCase().includes('supervisor')) category = 'Accounting & Client Services';
  else if (role.toLowerCase().includes('human resources') || role.toLowerCase().includes('operations')) category = 'Operations & HR';

  team.push({
    name,
    role,
    category,
    email,
    avatar,
    bio
  });
});

console.log(JSON.stringify(team, null, 2));
fs.writeFileSync(path.join(__dirname, '../src/data/teamMembers.ts'), `export interface TeamMember {
  name: string;
  role: string;
  category: string;
  email: string;
  avatar: string;
  bio: string;
  credentials?: string[];
}

export const TEAM_MEMBERS: TeamMember[] = ${JSON.stringify(team, null, 2)};
`);

console.log('Saved src/data/teamMembers.ts with', team.length, 'members.');
