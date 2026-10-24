# SMG ABA Client Dashboard Guide & Supabase Architecture

> **Audience:** Client, Stakeholders, Non-Technical Administrators  
> **Backend Database:** Supabase (PostgreSQL & Storage)

---

## 1. Executive Dashboard Overview & Access

The **Admin Command Center** (located at `/dashboard`) is the central control room for the entire SMG ABA website. It allows non-technical business managers, marketing personnel, and staff to manage pages, articles, short redirect links, webinars, and website navigation without touching code.

### Step-by-Step: How to Access and Use the Dashboard
1. **Navigate to the Admin URL:**  
   Go to `smgaba.com/dashboard` in any web browser.
2. **Enter the Administrator Password:**  
   Type your organization's administrative password and click **Unlock Dashboard**. Your session is securely remembered in your browser so you do not have to re-enter it repeatedly.
3. **Review Real-Time Metrics:**  
   At the top of the screen, four live metric cards immediately display:
   - **CMS Pages:** Total visual pages built, with live vs. draft count.
   - **Blog Studio:** Total published articles and scheduled guides.
   - **Short Links:** Active vanity redirects and click counts.
   - **Events & Seminars:** Upcoming workshops and scheduled webinars.
4. **Use Universal Search:**  
   Quickly find any page, blog post, event, or redirect by typing into the central search bar.

### Data Flow (Where Does the Data Go?)
- **User Action:** Admin enters password on `/dashboard`.
- **Server Verification:** The server compares the password against the secure `ADMIN_PASSWORD` environment secret.
- **Client Storage:** Upon success, an authentication token is safely stored in browser `localStorage` / `sessionStorage`.
- **Result:** The dashboard unlocks and loads real-time database counts from Supabase.

---

## 2. Visual CMS Page Builder (Drag-and-Drop)

The **CMS Visual Page Builder** (accessible at `/cms`) empowers staff to build custom landing pages, industry overviews, campaign pages, and service offerings using visual blocks.

### Step-by-Step: How to Create and Publish a Webpage
1. **Create a New Page:**  
   Click the **+ New Page** button at `/cms`. Enter the page title (for example, *Private Client Wealth Advisory*). Choose one of 6 starting templates (Blank, About Us, Services, Events, FAQ, or Contact).
2. **Drag Blocks from the Left Drawer:**  
   Select from 20+ pre-designed responsive blocks:
   - **Top Banner (Hero):** Full-width headline, background image, and call-to-action buttons.
   - **Cards Grid:** 2, 3, or 4 column feature cards with icons and descriptions.
   - **FAQ Accordion:** Expandable question-and-answer lists.
   - **Testimonials & Reviews:** Single customer spotlights or multi-slide quote sliders.
   - **Video & Calendly:** Embedded video players and discovery call calendar widgets.
3. **Customize Content & Styling on the Right Panel:**  
   Click any block on the canvas to open its settings. You can edit text, choose brand colors (Navy, Blue, Emerald, Gold), adjust padding/margins, and configure button destinations.
4. **Preview on Multiple Devices:**  
   Use the viewport switcher at the top (Desktop 100%, Tablet 768px, Mobile 375px) to confirm the page looks great on smartphones.
5. **Save Draft or Publish Live:**  
   Click **Save Draft** to store work privately, or **Publish** to run the pre-publish safety scanner and push the page live.

### Data Flow (Where Does the Data Go?)
1. **Admin Action:** Visual blocks and properties are edited on the screen.
2. **Database Storage:** Clicking "Save Draft" or "Publish" sends a JSON payload to Supabase table **`public.cms_pages`**:
   - `slug`: The clean URL address (e.g., `private-wealth`).
   - `title`: The internal title.
   - `data`: A structured JSON tree storing every block, text snippet, image link, and styling rule.
   - `status`: Marked as `'draft'` or `'published'`.
3. **Revision History:** Every save also writes an immutable snapshot into **`public.cms_page_versions`** with a `version_number` and timestamp. If an error is made, click **Versions** to restore any prior version with one click.
4. **Public Live Website:** When visitors go to `smgaba.com/{slug}`, the server loads the record from `cms_pages` where `status = 'published'`, generates SEO tags, and serves the fast visual webpage.

---

## 3. Blog Studio & Post Creator

The **Blog Studio** (accessible at `/blogs-editor`) allows the organization to write and publish news, tax advisory articles, and educational guides.

### Step-by-Step: How to Write and Publish an Article
1. **Enter Headline & URL:**  
   Type the article title (e.g., *"2026 Year-End Corporate Tax Planning"*). A clean URL slug (`/blog/2026-tax-planning`) is generated automatically.
2. **Add Metadata:**  
   Set the Author name (e.g., *Corey Adams, CPA*), category (e.g., *Tax Strategy*), and estimated reading time (e.g., *5 min read*).
3. **Add Structured Content Blocks:**  
   Stack modular blocks for Subheadings (H2, H3), Paragraphs, Bulleted Lists, Highlight Quotes, and Images.
4. **Publish or Schedule:**  
   Choose **Published** to go live immediately, or set a future date/time for scheduled release.

### Data Flow (Where Does the Data Go?)
1. **Admin Action:** Staff writes the article and clicks **Publish**.
2. **Database Storage:** The post is saved in Supabase table **`public.blog_posts`**:
   - `slug`, `title`, `meta_title`, `meta_description`, `author`, `category`, `read_time`, `blocks` (JSON array of content).
   - `status`: `'published'`, `'draft'`, or `'scheduled'`.
3. **Public Live Website:**
   - The article immediately appears in the directory at `smgaba.com/blog`.
   - The full article is accessible at `smgaba.com/blog/{slug}`.

---

## 4. Webinar Shortlinks & Fast Redirections

The **Webinar Links Manager** (accessible at `/tools/links`) transforms long, complex meeting URLs (such as Zoom or Google Meet links) into clean, memorable vanity URLs.

### Step-by-Step: How to Create a Short Link
1. **Choose a Short Slug:**  
   Enter a short keyword like `webinar` or `tax-briefing` to create `smgaba.com/webinar`.
2. **Paste Destination URL:**  
   Enter the full meeting link (e.g., `https://zoom.us/j/9847291823?pwd=...`).
3. **Select HTTP Status:**  
   Pick **301 Permanent** for long-term marketing links or **302 Temporary** for monthly recurring links.
4. **Track Performance:**  
   The dashboard displays a live **Hits Counter** tracking how many times each short link has been clicked.

### Data Flow (Where Does the Data Go?)
1. **Admin Action:** Link mapping is saved in the dashboard.
2. **Database Storage:** Saved in Supabase table **`public.cms_redirects`** (and **`public.webinar_redirects`**) with `from_path`, `to_url`, `status_code`, and `hits`.
3. **Public Redirection:** When a user visits `smgaba.com/webinar`, the server intercepts the URL, increments `hits = hits + 1` in Supabase, and immediately redirects the user to Zoom in milliseconds.

---

## 5. Events & Workshops Manager

The **Events & Seminar Manager** (accessible at `/tools/events`) promotes upcoming webinars, educational workshops, and archives on-demand video replays.

### Step-by-Step: How to Schedule an Event
1. **Enter Title, Date & Time:**  
   Add the event title, calendar date, and start/end time (e.g., *2:30 - 3:30 PM EST*).
2. **Specify Host & Guest Speakers:**  
   Enter the primary host name (e.g., *Gregory M. Scotto, CPA*) and optional guest speaker names.
3. **Upload Banner Thumbnail:**  
   Upload a promotional image. It is automatically stored in the Supabase Storage bucket **`event-images`** and linked to the event.
4. **Add Registration Link:**  
   Paste your Zoom registration, Eventbrite, or RSVP page link.
5. **Add Recording Link After the Event:**  
   Once the live event concludes, paste the YouTube or Vimeo recording URL. The live website automatically displays a "Watch Replay" button for visitors.

### Data Flow (Where Does the Data Go?)
1. **Image Asset:** Uploaded directly to Supabase Storage Bucket **`event-images`** (public CDN URL generated).
2. **Event Details:** Stored in Supabase table **`public.events`** with `event_date`, `time_range`, `host`, `registration_link`, `recording_link`, and `thumbnail_url`.
3. **Public Live Website:** Automatically rendered on `smgaba.com/events`, sorted into Upcoming Events and Past Webinar Recordings.

---

## 6. Site Settings & Global Navigation

The **Site Settings Editor** (accessible at `/internal/settings`) manages top header menus, dropdowns, footer columns, and social links.

### Step-by-Step: How to Customize Navigation
1. **Build Navigation Menus:** Add top menu items (Solutions, Industries, About Us) and nest dropdown sub-links.
2. **Customize Header Call-to-Action:** Toggle and update the top button (e.g., *"Book Consultation"* linking to `/bookanappointment`).
3. **Manage Footer Links:** Group links into columns (Offices, Practice Areas, Legal) and update the copyright year.
4. **Update Social Profiles:** Enter URLs for LinkedIn, Twitter, Facebook, and Instagram.

### Data Flow (Where Does the Data Go?)
- **Database Storage:** Stored in Supabase table **`public.cms_settings`** under keys `'navigation'` and `'footer'`.
- **Public Live Website:** Injected dynamically into every page's header and footer across the entire site.

---

## 7. Customer Leads & Inquiries Data Flow

When prospective clients submit contact forms or book appointments on `smgaba.com/contact` or `smgaba.com/bookanappointment`:
1. **Submission:** Visitor submits name, work email, phone, company, and message.
2. **Anti-Spam Filter:** Server silently validates honeypot fields and client IP to eliminate bot spam.
3. **Instant Email Alert:** The server dispatches an email notification via the **Resend API** directly to the organization's staff inbox.
4. **Client Confirmation:** The prospect receives an instant on-screen confirmation and friendly thank-you message.

---

## 8. Master Data Flow Architecture Matrix

| Dashboard Feature | Admin Route | Supabase Storage Target | Public Website Route | Access Policy |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Command Center** | `/dashboard` | Session memory & password hash check | Admin Only | Password Protected |
| **CMS Visual Pages** | `/cms` & `/cms/$id/edit` | Table: `public.cms_pages` | `smgaba.com/{slug}` | Public Read (Published) |
| **Page Revisions** | Editor &rarr; `Versions` | Table: `public.cms_page_versions` | Admin Only | Service Role Only |
| **Blog Studio** | `/blogs-editor` | Table: `public.blog_posts` | `smgaba.com/blog` | Public Read (Published) |
| **Short Links & Redirects** | `/tools/links` | Table: `public.cms_redirects` & `webinar_redirects` | `smgaba.com/{slug}` &rarr; Target | Public 301/302 Redirect |
| **Events & Seminars** | `/tools/events` | Table: `public.events` | `smgaba.com/events` | Public Read |
| **Event Thumbnails** | `/tools/events` | Bucket: `event-images` | CDN Image URL | Public CDN Access |
| **Header & Footer Menus** | `/internal/settings` | Table: `public.cms_settings` | Global Header & Footer | Public Read |
| **Customer Contact Leads** | `/contact` | Resend API Email Notification | Staff Email Inbox | Protected Notification |

---

## 9. Complete Supabase SQL Script (Production Ready)

Run the following SQL script directly inside the **Supabase SQL Editor** to create all tables, triggers, indexes, Row Level Security policies, storage buckets, and seed data:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE: cms_pages
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{"content": [], "root": {}}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION public.set_cms_pages_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_cms_pages_updated_at ON public.cms_pages;
CREATE TRIGGER tr_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_cms_pages_updated_at();

CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON public.cms_pages (slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON public.cms_pages (status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_updated_at ON public.cms_pages (updated_at DESC);

ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_pages' AND policyname = 'Allow public read on published cms_pages'
  ) THEN
    CREATE POLICY "Allow public read on published cms_pages"
      ON public.cms_pages FOR SELECT USING (status = 'published');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_pages' AND policyname = 'Allow service role full access on cms_pages'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_pages"
      ON public.cms_pages FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END \$\$;

-- 2. TABLE: cms_page_versions
CREATE TABLE IF NOT EXISTS public.cms_page_versions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  page_id TEXT NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by TEXT DEFAULT 'admin'
);

CREATE INDEX IF NOT EXISTS idx_cms_page_versions_page_id ON public.cms_page_versions (page_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_page_versions_version_num ON public.cms_page_versions (page_id, version_number DESC);

ALTER TABLE public.cms_page_versions ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_page_versions' AND policyname = 'Allow service role full access on cms_page_versions'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_page_versions"
      ON public.cms_page_versions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END \$\$;

-- 3. TABLE: blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  h1 TEXT,
  date TEXT NOT NULL,
  publish_date TIMESTAMPTZ,
  author TEXT NOT NULL DEFAULT 'SMG Advisory Team',
  category TEXT NOT NULL DEFAULT 'General',
  image TEXT,
  read_time TEXT DEFAULT '4 min read',
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
  archived BOOLEAN DEFAULT false,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON public.blog_posts(publish_date);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' AND policyname = 'Allow public read on published blog posts'
  ) THEN
    CREATE POLICY "Allow public read on published blog posts"
      ON public.blog_posts FOR SELECT
      USING (status = 'published' OR (status = 'scheduled' AND (publish_date IS NULL OR publish_date <= now())));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' AND policyname = 'Allow service role full access on blog posts'
  ) THEN
    CREATE POLICY "Allow service role full access on blog posts"
      ON public.blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END \$\$;

-- 4. TABLE: cms_redirects
CREATE TABLE IF NOT EXISTS public.cms_redirects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  from_path TEXT UNIQUE NOT NULL,
  to_url TEXT NOT NULL,
  status_code INT NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
  enabled BOOLEAN NOT NULL DEFAULT true,
  note TEXT,
  hits BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION public.set_cms_redirects_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_cms_redirects_updated_at ON public.cms_redirects;
CREATE TRIGGER tr_cms_redirects_updated_at
  BEFORE UPDATE ON public.cms_redirects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_cms_redirects_updated_at();

CREATE INDEX IF NOT EXISTS idx_cms_redirects_from_path ON public.cms_redirects (from_path);
CREATE INDEX IF NOT EXISTS idx_cms_redirects_enabled ON public.cms_redirects (enabled);
CREATE INDEX IF NOT EXISTS idx_cms_redirects_updated_at ON public.cms_redirects (updated_at DESC);

ALTER TABLE public.cms_redirects ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_redirects' AND policyname = 'Allow public read on enabled cms_redirects'
  ) THEN
    CREATE POLICY "Allow public read on enabled cms_redirects"
      ON public.cms_redirects FOR SELECT USING (enabled = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_redirects' AND policyname = 'Allow service role full access on cms_redirects'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_redirects"
      ON public.cms_redirects FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END \$\$;

-- 5. TABLE: webinar_redirects
CREATE TABLE IF NOT EXISTS public.webinar_redirects (
  slug TEXT PRIMARY KEY,
  target_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.webinar_redirects ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'webinar_redirects' AND policyname = 'Allow public read on webinar_redirects'
  ) THEN
    CREATE POLICY "Allow public read on webinar_redirects"
      ON public.webinar_redirects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'webinar_redirects' AND policyname = 'Allow service role full access on webinar_redirects'
  ) THEN
    CREATE POLICY "Allow service role full access on webinar_redirects"
      ON public.webinar_redirects FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END \$\$;

-- 6. TABLE: events
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  host TEXT NOT NULL,
  host_title TEXT,
  guest_role TEXT,
  guest_name TEXT,
  guest_title TEXT,
  event_date DATE NOT NULL,
  time_range TEXT NOT NULL,
  description TEXT NOT NULL,
  registration_link TEXT NOT NULL,
  recording_link TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION public.set_events_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_events_updated_at ON public.events;
CREATE TRIGGER tr_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_events_updated_at();

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' AND policyname = 'Allow public read on events'
  ) THEN
    CREATE POLICY "Allow public read on events"
      ON public.events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' AND policyname = 'Allow service role full access on events'
  ) THEN
    CREATE POLICY "Allow service role full access on events"
      ON public.events FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END \$\$;

-- 7. TABLE: cms_settings
CREATE TABLE IF NOT EXISTS public.cms_settings (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_settings' AND policyname = 'Allow public read on cms_settings'
  ) THEN
    CREATE POLICY "Allow public read on cms_settings"
      ON public.cms_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_settings' AND policyname = 'Allow service role full access on cms_settings'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_settings"
      ON public.cms_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END \$\$;

-- 8. STORAGE BUCKET: event-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DO \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access on event-images'
  ) THEN
    CREATE POLICY "Public Access on event-images"
      ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Service Role Access on event-images'
  ) THEN
    CREATE POLICY "Service Role Access on event-images"
      ON storage.objects FOR ALL TO service_role USING (bucket_id = 'event-images') WITH CHECK (bucket_id = 'event-images');
  END IF;
END \$\$;

-- 9. INITIAL SEED DATA
INSERT INTO public.events (
  id, title, subtitle, host, host_title, event_date, time_range, description, registration_link
)
VALUES
(
  'dress-your-business-webinar',
  'DRESS your Business for Success',
  'For Business Owners and CEOs',
  'Gregory M. Scotto',
  'CPA',
  '2026-09-10',
  '2:30 - 3:30 PM',
  'Join Managing Partner Gregory M. Scotto, CPA for an in-depth session detailing the crucial legal and accounting structures modern businesses need.',
  'https://www.smgaba.com/dress-your-business-webinar'
),
(
  'accounts-payable-webinar',
  'Accounts Payable',
  'Bill Pay and Software Integration',
  'Kinshuk Sharma',
  NULL,
  '2026-09-17',
  '2:30 - 3:30 PM',
  'Accounting Manager Kinshuk Sharma breaks down the modern AP tech stack and automation strategies.',
  'https://www.smgaba.com/accounts-payable-webinar'
),
(
  'business-structure-webinar',
  'Business Structure Decisions',
  'What Every Owner Should Consider',
  'Marc Valente',
  'CPA',
  '2026-09-24',
  '10:00 - 11:00 AM',
  'Partner Marc Valente, CPA guides business owners through the nuances of entity formation and tax savings.',
  'https://www.smgaba.com/business-structure-webinar'
),
(
  'year-end-tax-planning-webinar',
  'Year End Tax Planning',
  'and Strategies for Business Owners',
  'Corey Adams',
  'CPA, CFP',
  '2026-09-30',
  '2:00 - 3:00 PM',
  'Senior Tax Manager Corey Adams, CPA, CFP shares proactive tax strategies to implement before December 31st.',
  'https://www.smgaba.com/year-end-tax-planning-webinar'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  host = EXCLUDED.host,
  host_title = EXCLUDED.host_title,
  event_date = EXCLUDED.event_date,
  time_range = EXCLUDED.time_range,
  description = EXCLUDED.description,
  registration_link = EXCLUDED.registration_link;
\`\`\`
