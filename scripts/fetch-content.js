import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
  // Solutions
  'https://www.smgaba.com/solutions/bookkeeping/',
  'https://www.smgaba.com/solutions/cfo-advisory-services/',
  'https://www.smgaba.com/solutions/tax/',
  'https://www.smgaba.com/solutions/wealth-management/',
  
  // Standalone
  'https://www.smgaba.com/bookanappointment/',
  'https://www.smgaba.com/privacy-policy-2/',
  'https://www.smgaba.com/florida-location/',
  'https://www.smgaba.com/blog/',

  // Blog posts
  'https://www.smgaba.com/2024-golf-outing/',
  'https://www.smgaba.com/7-signs-your-business-has-outgrown-diy-bookkeeping/',
  'https://www.smgaba.com/bookkeeping-cleanup-7-red-flags-your-financials-need-attention/',
  'https://www.smgaba.com/corporate-transparency-act-filing-deadline-january-1-2025/',
  'https://www.smgaba.com/eidl-loan-payment-reminder/',
  'https://www.smgaba.com/everything-you-need-to-know-about-outsourced-bookkeeping/',
  'https://www.smgaba.com/exciting-firm-news/',
  'https://www.smgaba.com/exciting-news-our-st-petersburg-office-is-relocating/',
  'https://www.smgaba.com/golf-outing-2024/',
  'https://www.smgaba.com/gov-hochul-announces-seed-funding-grant/',
  'https://www.smgaba.com/how-to-know-if-your-business-is-profitable/',
  'https://www.smgaba.com/information-regarding-1099-for-2022/',
  'https://www.smgaba.com/monthly-bookkeeping-financial-visibility/',
  'https://www.smgaba.com/nys-tax-treatment-of-unemployment-compensation/',
  'https://www.smgaba.com/obbba-summary/',
  'https://www.smgaba.com/outsourced-accounting-services-vs-in-house-accounting/',
  'https://www.smgaba.com/ppp-application-extension/',
  'https://www.smgaba.com/restaurant-grant-sam-gov-registration/',
  'https://www.smgaba.com/restaurant-revitalization-fund-2021/',
  'https://www.smgaba.com/restaurant-revitalization-fund-use-of-funds/',
  'https://www.smgaba.com/social-security-deferral/',
  'https://www.smgaba.com/the-2023-inaugural-golf-outing/',
  'https://www.smgaba.com/the-3-financial-reports-every-business-owner-should-review-monthly/',
  'https://www.smgaba.com/the-inflation-reduction-act/',
  'https://www.smgaba.com/time-to-file-your-2022-taxes/',
  'https://www.smgaba.com/upcoming-holiday-office-closures/',
  'https://www.smgaba.com/we-made-the-inc-5000-list/',
  'https://www.smgaba.com/welcoming-our-newest-partners-marc-valente-and-thomas-batsilas/',
  'https://www.smgaba.com/year-end-tax-planning-before-december/'
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Redirect ${url} -> ${res.headers.location}`);
        return fetchUrl(res.headers.location).then(resolve);
      }
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, status: res.statusCode, html: data }));
    }).on('error', (err) => {
      console.error(`Error fetching ${url}:`, err.message);
      resolve({ url, status: 500, error: err.message });
    });
  });
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
}

function extractMeta(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  const dateMatch = html.match(/class=["'][^"']*published[^"']*["'][^>]*>([^<]+)<\/time>/i) ||
                    html.match(/class=["'][^"']*post-date[^"']*["'][^>]*>([^<]+)<\//i) ||
                    html.match(/<time\s+class=["']entry-date[^"']*["'][^>]*>([^<]+)<\/time>/i) ||
                    html.match(/"datePublished":\s*"([^"]+)"/i);
  const date = dateMatch ? dateMatch[1].trim() : '';

  const authorMatch = html.match(/class=["'][^"']*author[^"']*["'][^>]*>([\s\S]*?)<\//i) ||
                      html.match(/"author":\s*{\s*"@type":\s*"Person",\s*"name":\s*"([^"]+)"/i);
  const author = authorMatch ? authorMatch[1].replace(/<[^>]+>/g, '').trim() : 'SMG ABA Team';

  // Extract main article content inside WordPress standard containers
  let articleContent = '';
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i) ||
                       html.match(/<div class=["'][^"']*(?:entry-content|post-content|tm-single-post-content|main-content)[^"']*["']>([\s\S]*?)<\/div>\s*<!--/i) ||
                       html.match(/<div class=["'][^"']*(?:entry-content|post-content)[^"']*["']>([\s\S]*?)<\/div>/i);

  if (articleMatch) {
    articleContent = articleMatch[0];
  }

  return {
    title,
    description,
    h1,
    date,
    author,
    articleContent
  };
}

async function run() {
  const outDir = path.join(__dirname, '../scraped_data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const results = {};
  for (const url of urls) {
    console.log(`Fetching ${url}...`);
    const res = await fetchUrl(url);
    if (res.html) {
      const meta = extractMeta(res.html);
      const slug = url.replace('https://www.smgaba.com/', '').replace(/\/$/, '') || 'home';
      results[slug] = {
        url,
        ...meta,
        rawCleanHtml: cleanHtml(res.html)
      };
      console.log(`✓ Fetched ${slug}: "${meta.title}" | H1: "${meta.h1}"`);
    }
  }

  fs.writeFileSync(path.join(outDir, 'scraped_pages.json'), JSON.stringify(results, null, 2));
  console.log(`Saved all scraped content to ${path.join(outDir, 'scraped_pages.json')}`);
}

run();
