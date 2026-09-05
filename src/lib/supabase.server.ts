import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface WebinarRedirect {
  slug: string;
  target_url: string;
  created_at: string;
}

/**
 * Normalizes a slug to ensure uniform formatting:
 * - Removes leading and trailing slashes
 * - Trims whitespace
 * - Converts to lowercase
 */
export function cleanSlug(rawSlug: string): string {
  if (!rawSlug) return "";
  return rawSlug
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

/**
 * Normalizes a target URL:
 * - Trims whitespace
 * - Ensures valid URL or internal path
 */
export function cleanTargetUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();
  // If it starts with http://, https://, or /, keep it as is; otherwise default to https://
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

import fs from "node:fs";
import path from "node:path";

let diskEnvCache: Record<string, string> | null = null;
let lastDiskRead = 0;

/**
 * Dynamically retrieves an environment variable from .env on disk or process.env.
 * Prioritizes disk reading to ensure live updates take immediate effect without server restart
 * and to prevent Vite from stripping unquoted hash '#' characters in passwords.
 */
export function getEnvVar(key: string): string {
  const now = Date.now();
  if (!diskEnvCache || now - lastDiskRead > 1000) {
    diskEnvCache = {};
    lastDiskRead = now;
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8");
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const k = trimmed.slice(0, eqIdx).trim();
            let v = trimmed.slice(eqIdx + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            }
            diskEnvCache[k] = v;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (diskEnvCache && diskEnvCache[key] !== undefined) {
    return diskEnvCache[key];
  }
  if (diskEnvCache && diskEnvCache[`VITE_${key}`] !== undefined) {
    return diskEnvCache[`VITE_${key}`];
  }

  // Fallback to process.env
  const fromEnv = process.env[key] || process.env[`VITE_${key}`];
  if (fromEnv) {
    return fromEnv.trim();
  }

  return "";
}

/**
 * Creates or returns the server-side Supabase client with the service role key.
 * This ensures full write permissions and bypasses RLS on the server.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = getEnvVar("SUPABASE_URL");
  const supabaseServiceKey =
    getEnvVar("SUPABASE_SERVICE_ROLE_KEY") ||
    getEnvVar("SUPABASE_SERVICE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

import { WEBINAR_REDIRECTS } from "../data/webinarRedirects";
import { LEGACY_BLOG_SLUGS, STALE_SITEMAP_REDIRECTS } from "../data/legacyRedirects";

// In-memory fallback store for local testing/dev
const localFallbackRedirects = new Map<string, WebinarRedirect>();

/**
 * Returns all predefined static redirects across the codebase
 */
export function getAllStaticRedirects(): WebinarRedirect[] {
  const list: WebinarRedirect[] = [];

  // 1. Webinar shortlinks
  for (const [slug, target_url] of Object.entries(WEBINAR_REDIRECTS)) {
    list.push({
      slug,
      target_url,
      created_at: "2024-01-01T00:00:00.000Z",
    });
  }

  // 2. Legacy blog slugs
  for (const slug of LEGACY_BLOG_SLUGS) {
    list.push({
      slug,
      target_url: `/blog/${slug}`,
      created_at: "2024-01-01T00:00:00.000Z",
    });
  }

  // 3. Stale sitemap redirects
  for (const [slug, target_url] of Object.entries(STALE_SITEMAP_REDIRECTS)) {
    list.push({
      slug,
      target_url,
      created_at: "2024-01-01T00:00:00.000Z",
    });
  }

  // 4. Utility / alias routes
  const extraAliases: Record<string, string> = {
    "contact-us": "/islandia-location",
    "contact": "/islandia-location",
    "tierra-verde-fl": "/florida-location",
    "internal/webinar-links": "/tools/redirections",
  };
  for (const [slug, target_url] of Object.entries(extraAliases)) {
    list.push({
      slug,
      target_url,
      created_at: "2024-01-01T00:00:00.000Z",
    });
  }

  return list;
}

/**
 * Fetches all webinar & static redirects, merging database records with static links.
 */
export async function fetchAllWebinarRedirects(): Promise<WebinarRedirect[]> {
  const mergedMap = new Map<string, WebinarRedirect>();

  // 1. Populate all static links first
  const staticList = getAllStaticRedirects();
  for (const item of staticList) {
    mergedMap.set(item.slug.toLowerCase(), item);
  }

  // 2. Populate from local in-memory fallback
  for (const [slug, item] of localFallbackRedirects.entries()) {
    mergedMap.set(slug.toLowerCase(), item);
  }

  // 3. Fetch from Supabase database if connected
  const client = getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("webinar_redirects")
        .select("slug, target_url, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Supabase] Error fetching webinar_redirects:", error.message);
      } else if (data) {
        // Dynamic entries overwrite/supplement static entries
        for (const item of data as WebinarRedirect[]) {
          mergedMap.set(item.slug.toLowerCase(), item);
        }
      }
    } catch (err: any) {
      console.error("[Supabase] Exception fetching webinar_redirects:", err.message);
    }
  }

  // Sort: dynamic custom items first (newer timestamps), then static items alphabetically
  return Array.from(mergedMap.values()).sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Looks up a single webinar redirect by slug.
 */
export async function lookupWebinarRedirect(rawSlug: string): Promise<string | null> {
  const slug = cleanSlug(rawSlug);
  if (!slug) return null;

  const client = getSupabaseServerClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("webinar_redirects")
        .select("target_url")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data?.target_url) {
        return data.target_url;
      }
    } catch (e) {
      console.error(`[Supabase] Error resolving slug "${slug}":`, e);
    }
  }

  // Fallback to static webinar redirects or local memory
  if (WEBINAR_REDIRECTS[slug]) {
    return WEBINAR_REDIRECTS[slug];
  }

  const fallback = localFallbackRedirects.get(slug);
  return fallback ? fallback.target_url : null;
}

/**
 * Inserts or updates a webinar redirect in the webinar_redirects table.
 */
export async function upsertWebinarRedirectRecord(
  rawSlug: string,
  rawTargetUrl: string,
): Promise<{ success: boolean; data?: WebinarRedirect; error?: string }> {
  const slug = cleanSlug(rawSlug);
  const target_url = cleanTargetUrl(rawTargetUrl);

  if (!slug) {
    return { success: false, error: "Slug is required." };
  }
  if (!target_url) {
    return { success: false, error: "Target URL is required." };
  }

  const client = getSupabaseServerClient();

  if (!client) {
    const record: WebinarRedirect = {
      slug,
      target_url,
      created_at: new Date().toISOString(),
    };
    localFallbackRedirects.set(slug, record);
    return {
      success: true,
      data: record,
      error: "Note: Running in local memory mode because SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set in environment.",
    };
  }

  const payload = {
    slug,
    target_url,
  };

  const { data, error } = await client
    .from("webinar_redirects")
    .upsert(payload, { onConflict: "slug" })
    .select()
    .single();

  if (error) {
    console.error(`[Supabase] Error upserting redirect for slug "${slug}":`, error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as WebinarRedirect };
}

/**
 * Deletes a webinar redirect by slug from the webinar_redirects table.
 */
export async function deleteWebinarRedirectRecord(
  rawSlug: string,
): Promise<{ success: boolean; error?: string }> {
  const slug = cleanSlug(rawSlug);
  if (!slug) return { success: false, error: "Slug is required." };

  const client = getSupabaseServerClient();

  if (!client) {
    localFallbackRedirects.delete(slug);
    return { success: true };
  }

  const { error } = await client.from("webinar_redirects").delete().eq("slug", slug);

  if (error) {
    console.error(`[Supabase] Error deleting redirect for slug "${slug}":`, error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
