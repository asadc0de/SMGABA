-- ==============================================================================
-- Supabase Schema Migration: Create `cms_pages` table
-- Project: smgaba-internal
-- Description: Stores custom CMS pages created via the internal Puck visual editor.
-- ==============================================================================

-- 1. Create the `cms_pages` table
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{"content": [], "root": {}}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Automatically update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.set_cms_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_cms_pages_updated_at ON public.cms_pages;
CREATE TRIGGER tr_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_cms_pages_updated_at();

-- 3. Row Level Security (RLS)
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published pages:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_pages' AND policyname = 'Allow public read on published cms_pages'
  ) THEN
    CREATE POLICY "Allow public read on published cms_pages"
      ON public.cms_pages
      FOR SELECT
      USING (status = 'published');
  END IF;
END
$$;

-- Allow service role full access (for server functions / admin operations):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_pages' AND policyname = 'Allow service role full access on cms_pages'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_pages"
      ON public.cms_pages
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- 4. Create indexes for quick slug lookup and listing
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON public.cms_pages (slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON public.cms_pages (status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_updated_at ON public.cms_pages (updated_at DESC);
