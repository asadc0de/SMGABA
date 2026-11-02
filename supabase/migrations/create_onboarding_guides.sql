-- ==============================================================================
-- Supabase Schema Migration: Create `onboarding_guides` & `onboarding_guide_versions`
-- Project: smgaba-internal
-- ==============================================================================

-- 1. Create the `onboarding_guides` table
CREATE TABLE IF NOT EXISTS public.onboarding_guides (
  office TEXT PRIMARY KEY CHECK (office IN ('ny', 'fl')),
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Automatically update `updated_at` on row modification for onboarding_guides
CREATE OR REPLACE FUNCTION public.set_onboarding_guides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_onboarding_guides_updated_at ON public.onboarding_guides;
CREATE TRIGGER tr_onboarding_guides_updated_at
  BEFORE UPDATE ON public.onboarding_guides
  FOR EACH ROW
  EXECUTE FUNCTION public.set_onboarding_guides_updated_at();

-- 3. Create the `onboarding_guide_versions` table for rollback / audit history
CREATE TABLE IF NOT EXISTS public.onboarding_guide_versions (
  id BIGSERIAL PRIMARY KEY,
  office TEXT NOT NULL CHECK (office IN ('ny', 'fl')),
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create index on office + created_at for fast version queries and pruning
CREATE INDEX IF NOT EXISTS idx_onboarding_guide_versions_office_created_at
  ON public.onboarding_guide_versions (office, created_at DESC);

-- 4. Enable Row Level Security (RLS)
-- NOTE: We intentionally DO NOT add public/anon read or write policies.
-- All access is gated through server functions executing with the Supabase service role key.
ALTER TABLE public.onboarding_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_guide_versions ENABLE ROW LEVEL SECURITY;

