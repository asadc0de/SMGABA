-- ==============================================================================
-- Supabase Schema Migration: Create `events` table & `event-images` storage bucket
-- Project: smgaba-internal (oaqzbhappuzujlsxbqls.supabase.co)
-- ==============================================================================

-- 1. Create the `events` table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,                       -- slug identifier, e.g. 'dress-your-business-webinar'
  title TEXT NOT NULL,
  subtitle TEXT,
  host TEXT NOT NULL,
  host_title TEXT,                           -- e.g. 'CPA', 'CPA, CFP'
  event_date DATE NOT NULL,                  -- ISO date, e.g. '2026-09-17'
  time_range TEXT NOT NULL,                  -- e.g. '2:30 - 3:30 PM'
  description TEXT NOT NULL,
  registration_link TEXT NOT NULL,
  recording_link TEXT,                       -- nullable, populated after the event has occurred
  thumbnail_url TEXT,                        -- public URL of image in Supabase Storage
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Automatically update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.set_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_events_updated_at ON public.events;
CREATE TRIGGER tr_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_events_updated_at();

-- 3. Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Note: The service role key bypasses RLS for server-side writes and admin operations.
-- Allow read access for public clients / feed:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' AND policyname = 'Allow public read on events'
  ) THEN
    CREATE POLICY "Allow public read on events"
      ON public.events
      FOR SELECT
      USING (true);
  END IF;
END
$$;

-- Allow service role full access (for clarity, though service_role bypasses by default):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' AND policyname = 'Allow service role full access on events'
  ) THEN
    CREATE POLICY "Allow service role full access on events"
      ON public.events
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Create indexes for fast querying and ordering
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);

-- ==============================================================================
-- 4. Supabase Storage Bucket: `event-images`
-- ==============================================================================
-- Create the public bucket for event thumbnail uploads if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow public read access on event-images storage objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access on event-images'
  ) THEN
    CREATE POLICY "Public Access on event-images"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'event-images');
  END IF;
END
$$;

-- Allow service role to upload / manage objects in event-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Service Role Access on event-images'
  ) THEN
    CREATE POLICY "Service Role Access on event-images"
      ON storage.objects
      FOR ALL
      TO service_role
      USING (bucket_id = 'event-images')
      WITH CHECK (bucket_id = 'event-images');
  END IF;
END
$$;

-- ==============================================================================
-- 5. Seed Data (The 4 verified seed events with exact host mappings)
-- ==============================================================================
INSERT INTO public.events (
  id,
  title,
  subtitle,
  host,
  host_title,
  event_date,
  time_range,
  description,
  registration_link,
  recording_link,
  thumbnail_url
)
VALUES
(
  'dress-your-business-webinar',
  'DRESS your Business for Success',
  'For Business Owners and CEO''s',
  'Gregory M. Scotto',
  'CPA',
  '2026-09-10',
  '2:30 - 3:30 PM',
  'Join Managing Partner Gregory M. Scotto, CPA for an in-depth session detailing the crucial legal and accounting structures modern businesses need. Learn compliance checklists, risk mitigation strategies, and how to present your company to lenders and investors with institutional confidence.',
  'https://www.smgaba.com/dress-your-business-webinar',
  NULL,
  NULL
),
(
  'accounts-payable-webinar',
  'Accounts Payable',
  'Bill Pay and Software Integration',
  'Kinshuk Sharma',
  NULL,
  '2026-09-17',
  '2:30 - 3:30 PM',
  'Accounting Manager Kinshuk Sharma breaks down the modern AP tech stack. Discover how automated three-way matching, secure payment gateways, and real-time ledger sync eliminate bottlenecks and protect your business against supplier payment fraud.',
  'https://www.smgaba.com/accounts-payable-webinar',
  NULL,
  NULL
),
(
  'business-structure-webinar',
  'Business Structure Decisions',
  'What Every Owner Should Consider',
  'Marc Valente',
  'CPA',
  '2026-09-24',
  '10:00 - 11:00 AM',
  'Partner Marc Valente, CPA guides business owners through the nuances of entity formation. Understand pass-through taxation, reasonable compensation guidelines, state franchise taxes, and when restructuring your business saves thousands in annual tax liability.',
  'https://www.smgaba.com/business-structure-webinar',
  NULL,
  NULL
),
(
  'year-end-tax-planning-webinar',
  'Year End Tax Planning',
  'and Strategies for Business Owners',
  'Corey Adams',
  'CPA, CFP',
  '2026-09-30',
  '2:00 - 3:00 PM',
  'Senior Tax Manager Corey Adams, CPA, CFP shares proactive tax strategies to implement before December 31st. Topics include Section 179 depreciation acceleration, retirement plan contributions, timing income and expenses, and wealth transfer planning.',
  'https://www.smgaba.com/year-end-tax-planning-webinar',
  NULL,
  NULL
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
