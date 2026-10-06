-- ==============================================================================
-- Supabase Schema Migration: Create `cms_redirects` table
-- Project: smgaba-internal
-- Description: Stores 301/302/307/308 URL redirects for the CMS with hit tracking.
-- ==============================================================================

-- 1. Create the `cms_redirects` table
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

-- 2. Automatically update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.set_cms_redirects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_cms_redirects_updated_at ON public.cms_redirects;
CREATE TRIGGER tr_cms_redirects_updated_at
  BEFORE UPDATE ON public.cms_redirects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_cms_redirects_updated_at();

-- 3. Row Level Security (RLS)
ALTER TABLE public.cms_redirects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to enabled redirects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_redirects' AND policyname = 'Allow public read on enabled cms_redirects'
  ) THEN
    CREATE POLICY "Allow public read on enabled cms_redirects"
      ON public.cms_redirects
      FOR SELECT
      USING (enabled = true);
  END IF;
END
$$;

-- Allow service role full access (for server functions / admin operations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_redirects' AND policyname = 'Allow service role full access on cms_redirects'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_redirects"
      ON public.cms_redirects
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- 4. Create indexes for high-speed resolution and management
CREATE INDEX IF NOT EXISTS idx_cms_redirects_from_path ON public.cms_redirects (from_path);
CREATE INDEX IF NOT EXISTS idx_cms_redirects_enabled ON public.cms_redirects (enabled);
CREATE INDEX IF NOT EXISTS idx_cms_redirects_updated_at ON public.cms_redirects (updated_at DESC);
