import fs from 'node:fs';
import path from 'node:path';

// Import data dictionaries
import { INDUSTRIES_DATA } from '../src/data/industries.ts';
import { SOLUTIONS_DATA } from '../src/data/solutions.ts';

const routesDir = path.resolve('src/routes');

const publicRoutes = [
  { file: 'index.tsx', path: '/' },
  { file: 'about-us.tsx', path: '/about-us' },
  { file: 'contact.tsx', path: '/contact' },
  { file: 'careers.tsx', path: '/careers' },
  { file: 'events.tsx', path: '/events' },
  { file: 'testimonials.tsx', path: '/testimonials' },
  { file: 'bookanappointment.tsx', path: '/bookanappointment' },
  { file: 'privacy-policy.tsx', path: '/privacy-policy' },
  { file: 'new-york-city-location.tsx', path: '/new-york-city-location' },
  { file: 'islandia-location.tsx', path: '/islandia-location' },
  { file: 'florida-location.tsx', path: '/florida-location' },
  { file: 'industries.tsx', path: '/industries' },
  { file: 'construction.tsx', path: '/construction', industryKey: 'construction' },
  { file: 'healthcare.tsx', path: '/healthcare', industryKey: 'healthcare' },
  { file: 'hospitality.tsx', path: '/hospitality', industryKey: 'hospitality' },
  { file: 'legal-professionals.tsx', path: '/legal-professionals', industryKey: 'legal-professionals' },
  { file: 'manufacturers.tsx', path: '/manufacturers', industryKey: 'manufacturers' },
  { file: 'real-estate.tsx', path: '/real-estate', industryKey: 'real-estate' },
  { file: 'retail.tsx', path: '/retail', industryKey: 'retail' },
  { file: 'automotive.tsx', path: '/automotive', industryKey: 'automotive' },
  { file: 'solutions/index.tsx', path: '/solutions' },
  { file: 'solutions/bookkeeping.tsx', path: '/solutions/bookkeeping', solutionKey: 'bookkeeping' },
  { file: 'solutions/cfo-advisory-services.tsx', path: '/solutions/cfo-advisory-services', solutionKey: 'cfo-advisory-services' },
  { file: 'solutions/tax.tsx', path: '/solutions/tax', solutionKey: 'tax' },
  { file: 'solutions/wealth-management.tsx', path: '/solutions/wealth-management', solutionKey: 'wealth-management' },
  { file: 'blog/index.tsx', path: '/blog' },
  { file: 'resources/index.tsx', path: '/resources' },
  { file: 'our-team.tsx', path: '/our-team' },
];

console.log('=== FULL METADATA & H1 AUDIT ===\n');

const auditResults = [];

for (const route of publicRoutes) {
  const filePath = path.join(routesDir, route.file);
  const code = fs.readFileSync(filePath, 'utf8');

  let title = '';
  let description = '';

  if (route.industryKey && INDUSTRIES_DATA[route.industryKey]) {
    title = INDUSTRIES_DATA[route.industryKey].metaTitle || '';
    description = INDUSTRIES_DATA[route.industryKey].metaDescription || '';
  } else if (route.solutionKey && SOLUTIONS_DATA[route.solutionKey]) {
    title = SOLUTIONS_DATA[route.solutionKey].metaTitle || '';
    description = SOLUTIONS_DATA[route.solutionKey].metaDescription || '';
  }

  // Check code override
  const titleMatches = [...code.matchAll(/title:\s*["`]([^"`]+)["`]/g)];
  if (titleMatches.length > 0) {
    title = titleMatches[0][1];
  }

  const descMatches = [...code.matchAll(/content:\s*\n?\s*["`]([\s\S]*?)["`]/g)];
  if (descMatches.length > 0) {
    description = descMatches[0][1].replace(/\s+/g, ' ').trim();
  }

  // Count H1s: count <h1 elements in JSX, plus SubpageHero, LandingPageLayout, SolutionPageLayout, Hero (each renders 1 H1)
  let h1Count = 0;
  const directH1 = code.match(/<h1[\s>]/g);
  if (directH1) h1Count += directH1.length;
  if (code.includes('<SubpageHero') && !code.includes('<LandingPageLayout') && !code.includes('<SolutionPageLayout')) {
    h1Count += 1;
  }
  if (code.includes('<LandingPageLayout')) h1Count += 1;
  if (code.includes('<SolutionPageLayout')) h1Count += 1;
  if (route.file === 'index.tsx' && code.includes('<Hero')) h1Count += 1;

  auditResults.push({
    file: route.file,
    path: route.path,
    title,
    titleLen: title.length,
    description,
    descLen: description.length,
    h1Count,
  });
}

console.log('| Route | Path | Title (len) | Description (len) | H1 | Issues |');
console.log('|---|---|---|---|:---:|---|');

for (const r of auditResults) {
  const issues = [];
  if (!r.title) issues.push('Missing title');
  else if (r.titleLen > 65) issues.push(`Title long (${r.titleLen})`);
  else if (r.titleLen < 25) issues.push(`Title short (${r.titleLen})`);

  if (!r.description) issues.push('Missing desc');
  else if (r.descLen > 165) issues.push(`Desc long (${r.descLen})`);
  else if (r.descLen < 115) issues.push(`Desc short (${r.descLen})`);

  if (r.h1Count !== 1) issues.push(`H1 count: ${r.h1Count}`);

  console.log(`| ${r.file} | ${r.path} | ${r.title} (${r.titleLen}) | ${r.description.slice(0, 40)}... (${r.descLen}) | ${r.h1Count} | ${issues.length ? issues.join(', ') : 'OK'} |`);
}
