import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = fs.readFileSync(path.join(__dirname, '../scraped_data/our_team_raw.html'), 'utf8');

// Let's find all occurrences of team member sections
// On the live WordPress site, team members are usually structured with images, names, roles, emails, and bios.

const teamMembers = [];

// Split by team member or let's search for image tags and surrounding text
// In WordPress themes (e.g. Salient, Elementor, Divi, WPBakery), team members often have classes like `team-member`, `team_member`, `vc_custom`, or similar.
// Let's write a regex to find all <h3 or <h4 or <h2 with name, followed by role, email, bio, image.

// Let's find all images in wp-content/uploads:
const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log('All image URLs found:', imgMatches);

// Let's search for email addresses (mailto:...)
const emails = [...html.matchAll(/mailto:([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)].map(m => m[1]);
console.log('Emails found:', [...new Set(emails)]);

// Let's print snippets around each email to see the full person's info!
emails.forEach(email => {
  const idx = html.indexOf(email);
  if (idx !== -1) {
    const start = Math.max(0, idx - 400);
    const end = Math.min(html.length, idx + 1200);
    console.log('-----------------------------------------');
    console.log('SNIPPET FOR', email);
    console.log(html.slice(start, end).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  }
});
