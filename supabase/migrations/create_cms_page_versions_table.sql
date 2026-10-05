-- ==============================================================================
-- Supabase Schema Migration: Create `cms_page_versions` table
-- Project: smgaba-internal
-- Description: Stores revision history snapshots for CMS pages (Phases 1-7).
-- ==============================================================================

-- 1. Create the `cms_page_versions` table
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

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_cms_page_versions_page_id ON public.cms_page_versions (page_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_page_versions_version_num ON public.cms_page_versions (page_id, version_number DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.cms_page_versions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for server functions / admin operations):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_page_versions' AND policyname = 'Allow service role full access on cms_page_versions'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_page_versions"
      ON public.cms_page_versions
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;
