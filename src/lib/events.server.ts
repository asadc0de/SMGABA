import {
  getSupabaseServerClient,
  cleanSlug,
  cleanTargetUrl,
} from "./supabase.server";
import { EVENTS, type EventItem } from "../data/events";

export type { EventItem };

// In-memory fallback store for local testing/dev when Supabase is offline or unconfigured
const localFallbackEvents = new Map<string, EventItem>();

/**
 * Normalizes an event payload to ensure standard casing and trimmed fields.
 */
export function normalizeEventInput(event: Partial<EventItem>): Partial<EventItem> {
  const normalized: Partial<EventItem> = { ...event };
  if (normalized.id) {
    normalized.id = cleanSlug(normalized.id);
  }
  if (normalized.title) {
    normalized.title = normalized.title.trim();
  }
  if (normalized.subtitle !== undefined) {
    normalized.subtitle = normalized.subtitle ? normalized.subtitle.trim() : null;
  }
  if (normalized.host) {
    normalized.host = normalized.host.trim();
  }
  if (normalized.host_title !== undefined) {
    normalized.host_title = normalized.host_title ? normalized.host_title.trim() : null;
  }
  if (normalized.event_date) {
    normalized.event_date = normalized.event_date.trim();
  }
  if (normalized.time_range) {
    normalized.time_range = normalized.time_range.trim();
  }
  if (normalized.description) {
    normalized.description = normalized.description.trim();
  }
  if (normalized.registration_link) {
    normalized.registration_link = cleanTargetUrl(normalized.registration_link);
  }
  if (normalized.recording_link !== undefined) {
    normalized.recording_link = normalized.recording_link
      ? cleanTargetUrl(normalized.recording_link)
      : null;
  }
  if (normalized.thumbnail_url !== undefined) {
    normalized.thumbnail_url = normalized.thumbnail_url
      ? normalized.thumbnail_url.trim()
      : null;
  }
  return normalized;
}

/**
 * Fetches all events, merging static seed events with dynamic records from Supabase.
 * Database rows take priority if an event with the same ID exists in both.
 */
export async function fetchAllEvents(): Promise<EventItem[]> {
  const mergedMap = new Map<string, EventItem>();

  // 1. Populate all static seed events first
  for (const item of EVENTS) {
    mergedMap.set(item.id.toLowerCase(), { ...item });
  }

  // 2. Populate from local in-memory fallback (for local dev)
  for (const [id, item] of localFallbackEvents.entries()) {
    mergedMap.set(id.toLowerCase(), { ...item });
  }

  // 3. Fetch from Supabase database if connected
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("events")
        .select(
          "id, title, subtitle, host, host_title, event_date, time_range, description, registration_link, recording_link, thumbnail_url, created_at, updated_at"
        )
        .order("event_date", { ascending: true });

      if (error) {
        console.error("[Supabase] Error fetching events:", error.message);
      } else if (data) {
        for (const item of data as EventItem[]) {
          mergedMap.set(item.id.toLowerCase(), item);
        }
      }
    } catch (err: any) {
      console.error("[Supabase] Exception fetching events:", err.message);
    }
  }

  // Return sorted by event_date (soonest / upcoming first)
  return Array.from(mergedMap.values()).sort((a, b) => {
    return a.event_date.localeCompare(b.event_date);
  });
}

/**
 * Looks up a single event by slug ID.
 */
export async function lookupEventById(rawId: string): Promise<EventItem | null> {
  const id = cleanSlug(rawId);
  if (!id) return null;

  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return data as EventItem;
      }
    } catch (e) {
      console.error(`[Supabase] Error resolving event "${id}":`, e);
    }
  }

  // Fallback to local memory or static seeds
  const fallback = localFallbackEvents.get(id);
  if (fallback) return fallback;

  const staticEvent = EVENTS.find((e) => e.id.toLowerCase() === id.toLowerCase());
  return staticEvent || null;
}

/**
 * Inserts or updates an event record.
 * Supports partial updates (e.g. updating just recording_link for a past event)
 * by merging with existing data.
 */
export async function upsertEventRecord(
  rawEvent: Partial<EventItem> & { id: string }
): Promise<{ success: boolean; data?: EventItem; error?: string }> {
  const normalized = normalizeEventInput(rawEvent);
  const id = normalized.id;

  if (!id) {
    return { success: false, error: "Event slug ID is required." };
  }

  // If this is a partial update, retrieve existing record to preserve other fields
  const existing = await lookupEventById(id);

  const mergedRecord: EventItem = {
    id,
    title: normalized.title || existing?.title || "",
    subtitle: normalized.subtitle !== undefined ? normalized.subtitle : existing?.subtitle || null,
    host: normalized.host || existing?.host || "",
    host_title:
      normalized.host_title !== undefined ? normalized.host_title : existing?.host_title || null,
    event_date: normalized.event_date || existing?.event_date || "",
    time_range: normalized.time_range || existing?.time_range || "",
    description: normalized.description || existing?.description || "",
    registration_link:
      normalized.registration_link || existing?.registration_link || "",
    recording_link:
      normalized.recording_link !== undefined
        ? normalized.recording_link
        : existing?.recording_link || null,
    thumbnail_url:
      normalized.thumbnail_url !== undefined
        ? normalized.thumbnail_url
        : existing?.thumbnail_url || null,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Validate mandatory fields
  if (!mergedRecord.title) return { success: false, error: "Title is required." };
  if (!mergedRecord.host) return { success: false, error: "Host is required." };
  if (!mergedRecord.event_date) return { success: false, error: "Event date is required." };
  if (!mergedRecord.time_range) return { success: false, error: "Time range is required." };
  if (!mergedRecord.description) return { success: false, error: "Description is required." };
  if (!mergedRecord.registration_link) {
    return { success: false, error: "Registration link is required." };
  }

  const client = getSupabaseServerClient();
  if (!client) {
    localFallbackEvents.set(id, mergedRecord);
    return {
      success: true,
      data: mergedRecord,
      error:
        "Note: Running in local memory mode because SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured.",
    };
  }

  const { data, error } = await client
    .from("events")
    .upsert(mergedRecord, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error(`[Supabase] Error upserting event "${id}":`, error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as EventItem };
}

/**
 * Deletes an event by slug ID.
 */
export async function deleteEventRecord(
  rawId: string
): Promise<{ success: boolean; error?: string }> {
  const id = cleanSlug(rawId);
  if (!id) return { success: false, error: "Event ID is required." };

  const client = getSupabaseServerClient();
  if (!client) {
    localFallbackEvents.delete(id);
    return { success: true };
  }

  const { error } = await client.from("events").delete().eq("id", id);
  if (error) {
    console.error(`[Supabase] Error deleting event "${id}":`, error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Uploads an event image to the `event-images` storage bucket and returns its public URL.
 */
export async function uploadEventImage(
  fileName: string,
  contentType: string,
  base64Data: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Supabase client is not configured for file uploads.",
    };
  }

  try {
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePath = `events/${Date.now()}-${cleanName}`;
    const buffer = Buffer.from(base64Data, "base64");

    const { error: uploadError } = await client.storage
      .from("event-images")
      .upload(uniquePath, buffer, {
        contentType: contentType || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("[Supabase Storage] Upload error:", uploadError.message);
      return { success: false, error: uploadError.message };
    }

    const { data } = client.storage.from("event-images").getPublicUrl(uniquePath);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    console.error("[Supabase Storage] Upload exception:", err.message);
    return { success: false, error: err.message || "Failed to upload image." };
  }
}
