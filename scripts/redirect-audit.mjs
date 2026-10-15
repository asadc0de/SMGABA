import fs from 'node:fs';
import path from 'node:path';

import {
  LEGACY_RESOURCE_SLUGS,
  LEGACY_BLOG_SLUGS,
  STALE_SITEMAP_REDIRECTS,
} from '../src/data/legacyRedirects.ts';
import { BLOG_POSTS } from '../src/data/blogPosts.ts';
import { RESOURCE_POSTS } from '../src/data/resourcePosts.ts';

// Extract all smgaba.com URLs from scraped_data
const scrapedDir = path.resolve('scraped_data');
const files = fs.readdirSync(scrapedDir);

const urlsFound = new Set();
const urlRegex = /https?:\/\/(?:www\.)?smgaba\.com(\/[a-zA-Z0-9_\-\/.]*)?/g;

for (const file of files) {
  const filePath = path.join(scrapedDir, file);
  const stat = fs.statSync(filePath);
  if (stat.size > 10 * 1024 * 1024) continue; // skip massive files
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    let p = match[1] || '/';
    // Clean up trailing slash and query params/hashes
    p = p.split('?')[0].split('#')[0];
    // Filter out asset files (.jpg, .png, .pdf, .css, .js, .svg, wp-content, wp-includes, feed, xmlrpc)
    if (
      !/\.(jpg|jpeg|png|gif|svg|webp|pdf|css|js|ico|xml)$/i.test(p) &&
      !p.includes('wp-content') &&
      !p.includes('wp-includes') &&
      !p.includes('wp-json') &&
      !p.includes('xmlrpc') &&
      !p.includes('/feed')
    ) {
      // normalize
      const normalized = p.replace(/\/+$/, '') || '/';
      urlsFound.add(normalized);
    }
  }
}

// Known live static paths in new site
const liveStaticPaths = new Set([
  '/',
  '/about-us',
  '/contact',
  '/careers',
  '/events',
  '/testimonials',
  '/bookanappointment',
  '/privacy-policy',
  '/new-york-city-location',
  '/islandia-location',
  '/florida-location',
  '/industries',
  '/construction',
  '/healthcare',
  '/hospitality',
  '/legal-professionals',
  '/manufacturers',
  '/real-estate',
  '/retail',
  '/automotive',
  '/solutions',
  '/solutions/bookkeeping',
  '/solutions/cfo-advisory-services',
  '/solutions/tax',
  '/solutions/wealth-management',
  '/wealth-management',
  '/blog',
  '/resources',
  '/our-team',
]);

const liveBlogSlugs = new Set(BLOG_POSTS.map((b) => b.slug));
const liveResourceSlugs = new Set(RESOURCE_POSTS.map((r) => r.slug));

const results = {
  live: [],
  redirected: [],
  would404: [],
};

for (const urlPath of [...urlsFound].sort()) {
  const slug = urlPath.replace(/^\/+/, '');

  // 1. Check live route
  if (liveStaticPaths.has(urlPath)) {
    results.live.push({ url: urlPath, reason: 'Live static route' });
    continue;
  }
  if (urlPath.startsWith('/blog/') && liveBlogSlugs.has(urlPath.replace('/blog/', ''))) {
    results.live.push({ url: urlPath, reason: 'Live blog route' });
    continue;
  }
  if (urlPath.startsWith('/resources/') && liveResourceSlugs.has(urlPath.replace('/resources/', ''))) {
    results.live.push({ url: urlPath, reason: 'Live resource route' });
    continue;
  }

  // 2. Check legacy redirects
  if (LEGACY_RESOURCE_SLUGS.has(slug)) {
    results.redirected.push({ url: urlPath, target: `/resources/${slug}`, reason: 'LEGACY_RESOURCE_SLUGS' });
    continue;
  }
  if (LEGACY_BLOG_SLUGS.has(slug)) {
    results.redirected.push({ url: urlPath, target: `/blog/${slug}`, reason: 'LEGACY_BLOG_SLUGS' });
    continue;
  }
  if (liveBlogSlugs.has(slug)) {
    results.redirected.push({ url: urlPath, target: `/blog/${slug}`, reason: 'Matched live blog slug at root' });
    continue;
  }
  if (liveResourceSlugs.has(slug)) {
    results.redirected.push({ url: urlPath, target: `/resources/${slug}`, reason: 'Matched live resource slug at root' });
    continue;
  }
  if (STALE_SITEMAP_REDIRECTS[slug]) {
    results.redirected.push({ url: urlPath, target: STALE_SITEMAP_REDIRECTS[slug], reason: 'STALE_SITEMAP_REDIRECTS' });
    continue;
  }
  if (urlPath === '/privacy-policy-2') {
    results.redirected.push({ url: urlPath, target: '/privacy-policy', reason: 'Flat 301 route' });
    continue;
  }

  // 3. Otherwise, would 404
  results.would404.push(urlPath);
}

console.log('=== REDIRECT AUDIT RESULTS ===');
console.log(`Total unique scraped URLs checked: ${urlsFound.size}`);
console.log(`(a) Maps to a live route: ${results.live.length}`);
console.log(`(b) Covered by redirect: ${results.redirected.length}`);
console.log(`(c) Would 404: ${results.would404.length}`);

console.log('\n--- (c) LIST OF URLS THAT WOULD 404 ---');
for (const u of results.would404) {
  console.log(`- ${u}`);
}
