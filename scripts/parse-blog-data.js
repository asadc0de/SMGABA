import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = JSON.parse(fs.readFileSync(path.join(__dirname, '../scraped_data/scraped_pages.json'), 'utf8'));

// List of blog slugs
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

function extractArticleBody(html) {
  if (!html) return '';

  // Extract from entry-content or tm-single-post-content or vc_column-inner
  let content = '';
  
  // Try WordPress post content matches
  const entryMatch = html.match(/<div[^>]*class=["'][^"']*(?:entry-content|tm-single-post-content|post-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<!--/i) ||
                     html.match(/<div[^>]*class=["'][^"']*(?:entry-content|tm-single-post-content|post-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/article>/i) ||
                     html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);

  if (entryMatch) {
    content = entryMatch[1];
  } else {
    content = html;
  }

  // Remove nav, comments, related posts widgets, share buttons, footer
  content = content
    .replace(/<div class=["']tm-post-prev-next-links[\s\S]*$/i, '')
    .replace(/<div id=["']comments[\s\S]*$/i, '')
    .replace(/<div class=["']sharedaddy[\s\S]*$/i, '')
    .replace(/<div class=["']tm-social-share-wrapper[\s\S]*$/i, '');

  return content;
}

function htmlToCleanStructured(html) {
  // Extract paragraphs, h2s, h3s, lists, blockquotes, images
  // Let's create an array of sections / blocks
  const blocks = [];
  
  // Simple regex parser for major tags
  const tagRegex = /<(h[2-4]|p|ul|ol|blockquote|div class=["']wp-block-image["'])[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  
  // Clean comments
  const clean = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // If regex matches clean blocks
  while ((match = tagRegex.exec(clean)) !== null) {
    const tag = match[1].toLowerCase();
    let inner = match[2].trim();
    if (!inner) continue;
    
    // Remove unwanted inner tags but keep strong/em/a/br
    if (tag.startsWith('h')) {
      const text = inner.replace(/<[^>]+>/g, '').trim();
      if (text) blocks.push({ type: tag, text });
    } else if (tag === 'p') {
      const text = inner.replace(/<(?!\/?(strong|b|em|i|a|br)\b)[^>]+>/gi, '').trim();
      if (text && !text.includes('Share this:') && !text.includes('Related Posts')) {
        blocks.push({ type: 'p', html: text, text: inner.replace(/<[^>]+>/g, '').trim() });
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const items = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(inner)) !== null) {
        const liText = liMatch[1].replace(/<(?!\/?(strong|b|em|i|a)\b)[^>]+>/gi, '').trim();
        if (liText) items.push(liText);
      }
      if (items.length > 0) {
        blocks.push({ type: tag, items });
      }
    } else if (tag === 'blockquote') {
      const text = inner.replace(/<[^>]+>/g, '').trim();
      if (text) blocks.push({ type: 'blockquote', text });
    }
  }

  return blocks;
}

// Build the posts list
const blogData = [];

for (const slug of blogSlugs) {
  const p = pages[slug];
  if (!p) {
    console.warn(`Missing page data for ${slug}`);
    continue;
  }

  const rawHtml = p.rawCleanHtml || '';
  
  // Extract date
  let date = '2024';
  const dateMatch = rawHtml.match(/<time[^>]*class=["'][^"']*(?:entry-date|published)[^"']*["'][^>]*>([^<]+)<\/time>/i) ||
                    rawHtml.match(/"datePublished":\s*"([^"T]+)/i) ||
                    rawHtml.match(/class=["'][^"']*tm-meta-line tm-meta-date[^"']*["'][^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
  if (dateMatch) date = dateMatch[1].trim();

  // Extract author
  let author = 'SMG Team';
  const authorMatch = rawHtml.match(/rel=["']author["'][^>]*>([^<]+)<\/a>/i) ||
                      rawHtml.match(/class=["'][^"']*author[^"']*["'][^>]*>([^<]+)<\//i);
  if (authorMatch) author = authorMatch[1].trim();

  // Extract category
  let category = 'Advisory';
  const catMatch = rawHtml.match(/rel=["']category tag["'][^>]*>([^<]+)<\/a>/i);
  if (catMatch) category = catMatch[1].trim();

  // Extract featured image
  let image = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80';
  const imgMatch = rawHtml.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i) ||
                   rawHtml.match(/<img[^>]+class=["'][^"']*(?:wp-post-image|attachment-post-thumbnail)[^"']*["'][^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1] && !imgMatch[1].includes('favicon')) {
    image = imgMatch[1];
  }

  // Fallback hero images by category
  if (slug.includes('golf')) {
    image = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80';
  } else if (slug.includes('restaurant')) {
    image = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
  } else if (slug.includes('tax')) {
    image = 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80';
  } else if (slug.includes('bookkeeping')) {
    image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
  } else if (slug.includes('partner') || slug.includes('news') || slug.includes('office')) {
    image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
  }

  const rawArticle = extractArticleBody(rawHtml);
  const blocks = htmlToCleanStructured(rawArticle);

  // Calculate excerpt
  let excerpt = p.description || '';
  if (!excerpt || excerpt.length < 20) {
    const firstP = blocks.find(b => b.type === 'p');
    if (firstP) excerpt = firstP.text.slice(0, 160) + '...';
  }

  // Clean title
  let title = p.h1 || p.title.replace(/\s*[-|]\s*SMG.*$/i, '').trim();
  if (title.includes('&#8211;')) title = title.replace(/&#8211;/g, '–');
  if (title.includes('&amp;')) title = title.replace(/&amp;/g, '&');

  blogData.push({
    slug,
    title,
    metaTitle: p.title,
    metaDescription: p.description,
    h1: p.h1 || title,
    date,
    author,
    category,
    image,
    readTime: `${Math.max(3, Math.ceil(blocks.reduce((acc, b) => acc + (b.text || '').length, 0) / 800))} min read`,
    excerpt,
    blocks
  });
}

console.log(`Processed ${blogData.length} blog articles.`);
fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../src/data/blogPosts.json'), JSON.stringify(blogData, null, 2));

// Generate TypeScript data file
const tsContent = `// Auto-generated real content from smgaba.com
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

export const BLOG_POSTS: BlogPost[] = ${JSON.stringify(blogData, null, 2)};

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const cleanSlug = slug.replace(/^\\/+/, '').replace(/\\/+$/, '');
  return BLOG_POSTS.find((p) => p.slug === cleanSlug);
}

export function getAllBlogCategories(): string[] {
  const set = new Set<string>();
  BLOG_POSTS.forEach((p) => set.add(p.category));
  return Array.from(set);
}
`;

fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../src/data/blogPosts.ts'), tsContent);
console.log('Successfully wrote src/data/blogPosts.ts');
