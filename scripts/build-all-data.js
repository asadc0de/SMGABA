import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = JSON.parse(fs.readFileSync(path.join(__dirname, '../scraped_data/scraped_pages.json'), 'utf8'));

// Helper to clean HTML entities and strip unwanted tags
function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHtmlTags(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/data-[a-zA-Z0-9_-]+="[^"]*"/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '');
}

// 1. Process 29 Blog Posts
const blogSlugs = [
  '2024-golf-outing',
  '7-signs-your-business-has-outgrown-diy-bookkeeping',
  'bookkeeping-cleanup-7-red-flags-your-financials-need-attention',
  'corporate-transparency-act-filing-deadline-january-1-2025',
  'eidl-loan-payment-reminder',
  'everything-you-need-to-know-about-outsourced-bookkeeping',
  'exciting-firm-news',
  'exciting-news-our-st-petersburg-office-is-relocating',
  'golf-outing-2024',
  'gov-hochul-announces-seed-funding-grant',
  'how-to-know-if-your-business-is-profitable',
  'information-regarding-1099-for-2022',
  'monthly-bookkeeping-financial-visibility',
  'nys-tax-treatment-of-unemployment-compensation',
  'obbba-summary',
  'outsourced-accounting-services-vs-in-house-accounting',
  'ppp-application-extension',
  'restaurant-grant-sam-gov-registration',
  'restaurant-revitalization-fund-2021',
  'restaurant-revitalization-fund-use-of-funds',
  'social-security-deferral',
  'the-2023-inaugural-golf-outing',
  'the-3-financial-reports-every-business-owner-should-review-monthly',
  'the-inflation-reduction-act',
  'time-to-file-your-2022-taxes',
  'upcoming-holiday-office-closures',
  'we-made-the-inc-5000-list',
  'welcoming-our-newest-partners-marc-valente-and-thomas-batsilas',
  'year-end-tax-planning-before-december'
];

function extractCleanArticleBlocks(html) {
  if (!html) return [];

  // Strip SVG, header, nav, footer, script, form before extracting
  let cleanHtml = html
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');

  let body = '';
  // Locate main content container
  const markers = [
    'class="single-content-hc"',
    'class="entry-content"',
    'class="tm-single-post-content"',
    'id="content"',
    '<article'
  ];

  for (const m of markers) {
    const idx = cleanHtml.indexOf(m);
    if (idx !== -1) {
      body = cleanHtml.slice(idx);
      break;
    }
  }
  if (!body) body = cleanHtml;

  // Cut off at footer / comments / next links
  const endMarkers = [
    '</div><!-- .entry-content -->',
    '<div class="tm-post-prev-next-links',
    '<div id="comments"',
    '<div class="footer"',
    '<div class="bottom-footer-text"'
  ];
  for (const marker of endMarkers) {
    const idx = body.indexOf(marker);
    if (idx !== -1) {
      body = body.slice(0, idx);
    }
  }

  // Parse HTML elements
  const blocks = [];
  const regex = /<(h[2-4]|p|ul|ol|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = regex.exec(body)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];

    if (tag.startsWith('h')) {
      const text = cleanText(inner.replace(/<[^>]+>/g, ''));
      if (
        text &&
        !text.toLowerCase().includes("let's talk") &&
        !text.toLowerCase().includes("how can we help") &&
        !text.toLowerCase().includes("about us") &&
        !text.toLowerCase().includes("navigation")
      ) {
        blocks.push({ type: tag, text });
      }
    } else if (tag === 'p') {
      const text = cleanText(inner.replace(/<[^>]+>/g, ''));
      // Filter out form fields, nav artifacts, empty paragraphs
      if (
        text &&
        text.length > 5 &&
        !text.includes('Opt In to receive automated') &&
        !text.includes('This is a mobile phone') &&
        !text.includes('Best Time to Contact') &&
        !text.includes('Timezone') &&
        !text.includes('How Can we help?') &&
        !text.includes('Read More') &&
        !text.includes('Islandia, NY') &&
        !text.includes('linearGradient')
      ) {
        const formattedHtml = inner
          .replace(/<span[^>]*>/gi, '')
          .replace(/<\/span>/gi, '')
          .replace(/<font[^>]*>/gi, '')
          .replace(/<\/font>/gi, '')
          .trim();
        blocks.push({ type: 'p', text, html: cleanText(formattedHtml) });
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const items = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(inner)) !== null) {
        const itemText = cleanText(liMatch[1].replace(/<[^>]+>/g, ''));
        if (
          itemText &&
          !itemText.includes('About') &&
          !itemText.includes('Solutions') &&
          !itemText.includes('Privacy Policy') &&
          !itemText.includes('Industries') &&
          !itemText.includes('Contact Us') &&
          !itemText.includes('Our Team') &&
          !itemText.includes('Newsletters')
        ) {
          items.push(itemText);
        }
      }
      if (items.length > 0) {
        blocks.push({ type: tag, items });
      }
    } else if (tag === 'blockquote') {
      const text = cleanText(inner.replace(/<[^>]+>/g, ''));
      if (text) {
        blocks.push({ type: 'blockquote', text });
      }
    }
  }

  return blocks;
}

const blogPosts = [];

for (const slug of blogSlugs) {
  const p = pages[slug];
  if (!p) {
    console.error(`Page ${slug} missing in scraped_pages.json`);
    continue;
  }

  const rawHtml = p.rawCleanHtml || '';
  
  // Date
  let date = '2024';
  const dateMatch = rawHtml.match(/<time[^>]*class=["'][^"']*(?:entry-date|published)[^"']*["'][^>]*>([^<]+)<\/time>/i) ||
                    rawHtml.match(/"datePublished":\s*"([^"T]+)/i) ||
                    rawHtml.match(/article:published_time["']\s+content=["']([^"T]+)/i);
  if (dateMatch) {
    const rawDate = dateMatch[1].trim();
    // Format YYYY-MM-DD or readable
    if (rawDate.includes('-')) {
      const parts = rawDate.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(parts[1], 10) - 1;
        date = `${months[m] || parts[1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
      } else {
        date = rawDate;
      }
    } else {
      date = rawDate;
    }
  }

  // Author
  let author = 'SMG ABA Advisory Team';
  const authorMatch = rawHtml.match(/rel=["']author["'][^>]*>([^<]+)<\/a>/i) ||
                      rawHtml.match(/name=["']author["']\s+content=["']([^"']+)["']/i);
  if (authorMatch && authorMatch[1].trim()) {
    const name = authorMatch[1].trim();
    if (name.toLowerCase() === 'ana odiver') author = 'SMG Advisory Team';
    else author = name;
  }

  // Category
  let category = 'Advisory';
  if (slug.includes('tax')) category = 'Tax & Compliance';
  else if (slug.includes('bookkeeping')) category = 'Bookkeeping';
  else if (slug.includes('golf')) category = 'Community & Events';
  else if (slug.includes('grant') || slug.includes('ppp') || slug.includes('eidl') || slug.includes('fund') || slug.includes('act')) category = 'Government Grants & Legislation';
  else if (slug.includes('partner') || slug.includes('office') || slug.includes('5000') || slug.includes('news')) category = 'Firm News';
  else if (slug.includes('profitable') || slug.includes('financial-reports') || slug.includes('outsourced')) category = 'Financial Strategy';

  // Image
  let image = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80';
  const imgMatch = rawHtml.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && !imgMatch[1].includes('favicon')) {
    image = imgMatch[1];
  } else {
    if (category === 'Community & Events') image = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80';
    else if (category === 'Tax & Compliance') image = 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80';
    else if (category === 'Bookkeeping') image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
    else if (category === 'Government Grants & Legislation') image = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80';
    else if (category === 'Firm News') image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  }

  const blocks = extractCleanArticleBlocks(rawHtml);
  
  let title = cleanText(p.h1 || p.title.replace(/\s*[-|]\s*SMG.*$/i, ''));
  if (!title) title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  let excerpt = cleanText(p.description || '');
  if (!excerpt || excerpt.length < 30) {
    const firstP = blocks.find(b => b.type === 'p');
    if (firstP) excerpt = firstP.text.slice(0, 160) + '...';
  }

  const wordCount = blocks.reduce((acc, b) => acc + (b.text || (b.items ? b.items.join(' ') : '')).split(' ').length, 0);
  const readTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

  blogPosts.push({
    slug,
    title,
    metaTitle: cleanText(p.title) || `${title} | SMG ABA`,
    metaDescription: excerpt,
    h1: title,
    date,
    author,
    category,
    image,
    readTime,
    excerpt,
    blocks
  });
}

console.log(`Successfully structured ${blogPosts.length} blog posts.`);

// Write src/data/blogPosts.ts
const blogTs = `// Structured real blog posts from smgaba.com
export interface ContentBlock {
  type: 'h2' | 'h3' | 'h4' | 'p' | 'ul' | 'ol' | 'blockquote';
  text?: string;
  html?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  excerpt: string;
  blocks: ContentBlock[];
}

export const BLOG_POSTS: BlogPost[] = ${JSON.stringify(blogPosts, null, 2)};

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const clean = slug.replace(/^\\/+/, '').replace(/\\/+$/, '');
  return BLOG_POSTS.find((p) => p.slug === clean);
}

export function getAllBlogCategories(): string[] {
  const categories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
  return ['All', ...categories];
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/blogPosts.ts'), blogTs);

// 2. Extract and structure Solutions pages
const solutions = {
  bookkeeping: pages['solutions/bookkeeping'],
  cfo: pages['solutions/cfo-advisory-services'],
  tax: pages['solutions/tax'],
  wealth: pages['solutions/wealth-management']
};

console.log('Solutions fetched keys:', Object.keys(solutions));

// 3. Extract and structure Standalone pages
const privacyPolicy = pages['privacy-policy-2'];
const bookAnAppointment = pages['bookanappointment'];
const floridaLocation = pages['florida-location'];

console.log('Standalone pages fetched.');
