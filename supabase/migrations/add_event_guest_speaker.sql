-- ==============================================================================
-- Supabase Schema Migration: Add guest speaker / co-presenter columns to `events` table
-- ==============================================================================

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS guest_role TEXT,
  ADD COLUMN IF NOT EXISTS guest_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_title TEXT;
