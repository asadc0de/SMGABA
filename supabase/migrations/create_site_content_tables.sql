-- ==============================================================================
-- Supabase Schema Migration: Create `site_content` & `site_content_versions`
-- Project: smgaba-internal
-- Supports dynamic client editing for Team, Testimonials, Offices, Stats & Categories
-- ==============================================================================

-- 1. Create the `site_content` table
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Automatically update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.set_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_site_content_updated_at ON public.site_content;
CREATE TRIGGER tr_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.set_site_content_updated_at();

-- 3. Create the `site_content_versions` table for rollback / audit history
CREATE TABLE IF NOT EXISTS public.site_content_versions (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create index on key + created_at for fast version queries
CREATE INDEX IF NOT EXISTS idx_site_content_versions_key_created_at
  ON public.site_content_versions (key, created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content_versions ENABLE ROW LEVEL SECURITY;

