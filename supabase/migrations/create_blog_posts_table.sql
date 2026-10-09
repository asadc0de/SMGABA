-- =============================================================================
-- Migration: Create blog_posts table for dynamic & scheduled blog management
-- =============================================================================

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

-- Index for high performance lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_date ON public.blog_posts(publish_date);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published & scheduled-ready blog posts
CREATE POLICY "Allow public read on published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (
    status = 'published' OR 
    (status = 'scheduled' AND (publish_date IS NULL OR publish_date <= now()))
  );

-- Allow service role full management
CREATE POLICY "Allow service role full access on blog posts"
  ON public.blog_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);
