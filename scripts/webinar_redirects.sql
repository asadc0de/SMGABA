-- ==============================================================================
-- Supabase Schema: webinar_redirects
-- ==============================================================================
-- Run this script in the Supabase SQL Editor if creating the table manually.

CREATE TABLE IF NOT EXISTS public.webinar_redirects (
  slug TEXT PRIMARY KEY,
  target_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.webinar_redirects ENABLE ROW LEVEL SECURITY;

-- Note: The service role key automatically bypasses RLS for server-side writes.
-- Allow read-only access for authenticated/anon clients if direct client read is ever needed:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'webinar_redirects' AND policyname = 'Allow public read on webinar_redirects'
  ) THEN
    CREATE POLICY "Allow public read on webinar_redirects"
      ON public.webinar_redirects
      FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Create an index for fast slug lookups (primary key already indexes slug)
CREATE INDEX IF NOT EXISTS idx_webinar_redirects_created_at ON public.webinar_redirects (created_at DESC);
