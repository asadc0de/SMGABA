-- ==============================================================================
-- Supabase Schema Migration: Create `cms_settings` table
-- Project: smgaba-internal
-- Description: Stores global site settings (Header, Footer, Navigation) for the CMS.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.cms_settings (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS)
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site settings:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_settings' AND policyname = 'Allow public read on cms_settings'
  ) THEN
    CREATE POLICY "Allow public read on cms_settings"
      ON public.cms_settings
      FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Allow service role full access (for server functions / admin operations):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cms_settings' AND policyname = 'Allow service role full access on cms_settings'
  ) THEN
    CREATE POLICY "Allow service role full access on cms_settings"
      ON public.cms_settings
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;
