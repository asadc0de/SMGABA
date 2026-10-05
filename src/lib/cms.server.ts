import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import type { Data } from "@puckeditor/core";
import { getSupabaseServerClient, getEnvVar } from "./supabase.server";
import { validateSlug, cleanSlug } from "./cms-slugs";
import { isValidButtonUrl } from "@/cms/blocks/Button";
import { validateBlockStyle } from "@/cms/style";

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  data?: Data;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

const isDev = process.env.NODE_ENV !== "production";

// In-memory fallback store for local development ONLY (NODE_ENV !== "production")
const localFallbackPages = new Map<string, CmsPage>();

// In-memory cache for public page lookups with 45s TTL (caches both positive and negative results)
// Capped at 500 entries; evicts oldest entry when full.
interface CachedPageLookup {
  page: CmsPage | null;
  cachedAt: number;
}
const MAX_CACHE_ENTRIES = 500;
const pageLookupCache = new Map<string, CachedPageLookup>();
const CACHE_TTL_MS = 45 * 1000; // 45 seconds

function setInLookupCache(slug: string, page: CmsPage | null) {
  const key = slug.toLowerCase();
  if (pageLookupCache.size >= MAX_CACHE_ENTRIES && !pageLookupCache.has(key)) {
    const oldestKey = pageLookupCache.keys().next().value;
    if (oldestKey !== undefined) {
      pageLookupCache.delete(oldestKey);
    }
  }
  pageLookupCache.set(key, { page, cachedAt: Date.now() });
}

function invalidateLookupCache(slug?: string) {
  if (slug) {
    pageLookupCache.delete(slug.toLowerCase());
  } else {
    pageLookupCache.clear();
  }
}

/**
 * Extracts ONLY the adminPassword string.
 * Never falls back to id, slug, data, or other unrelated fields.
 */
function extractAdminPassword(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if (typeof obj.adminPassword === "string") return obj.adminPassword;
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as Record<string, unknown>;
      if (typeof nested.adminPassword === "string") return nested.adminPassword;
    }
  }
  return "";
}

function cleanPw(str: string): string {
  let s = (str || "").replace(/[\r\n]/g, "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

/**
 * Constant-time comparison using SHA256 + crypto.timingSafeEqual.
 * Fails CLOSED: If INTERNAL_ADMIN_PASSWORD is missing/empty, returns false in production.
 * In local dev (NODE_ENV !== "production"), permits empty password for developer convenience.
 */
function isAuthorized(inputPw?: string, expectedPw?: string): boolean {
  const trimmedExpected = cleanPw(expectedPw || "");
  const trimmedInput = cleanPw(inputPw || "");

  if (!trimmedExpected) {
    if (isDev) {
      return true; // Local dev convenience only
    }
    return false; // Fail CLOSED in production
  }

  if (!trimmedInput) {
    return false;
  }

  try {
    const hashA = crypto.createHash("sha256").update(trimmedInput).digest();
    const hashB = crypto.createHash("sha256").update(trimmedExpected).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

/**
 * Recursively walks the Puck data tree (content, zones, root, props, slots)
 * and validates:
 * 1. Any property whose key ends with "url", "href", or "link" (case-insensitive)
 * 2. Any block style properties (paddingTop, paddingBottom, marginTop, marginBottom, align)
 * Runs strictly server-side on every save and publish action.
 */
export function validatePuckUrlsAndStyles(puckData: unknown): { valid: boolean; error?: string } {
  if (!puckData || typeof puckData !== "object") {
    return { valid: true };
  }

  function walk(node: unknown): { valid: boolean; error?: string } {
    if (!node || typeof node !== "object") {
      return { valid: true };
    }

    if (Array.isArray(node)) {
      for (const item of node) {
        const res = walk(item);
        if (!res.valid) return res;
      }
      return { valid: true };
    }

    const obj = node as Record<string, unknown>;

    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      const val = obj[key];

      // 1. Validate any property ending in url, href, or link
      if (
        (lowerKey === "url" ||
          lowerKey.endsWith("url") ||
          lowerKey === "href" ||
          lowerKey.endsWith("href") ||
          lowerKey === "link" ||
          lowerKey.endsWith("link")) &&
        typeof val === "string" &&
        val.trim().length > 0
      ) {
        if (!isValidButtonUrl(val)) {
          return {
            valid: false,
            error: `Invalid URL "${val}" in property "${key}". Only https://, http://, / (relative), mailto:, and tel: are allowed. Protocol-relative ("//...") and javascript URLs are rejected.`,
          };
        }
      }

      // 2. Validate style properties
      if (
        (lowerKey === "props" || lowerKey === "style" || lowerKey === "root") &&
        val &&
        typeof val === "object"
      ) {
        const styleRes = validateBlockStyle(val);
        if (!styleRes.valid) return styleRes;
      }

      const childRes = walk(val);
      if (!childRes.valid) return childRes;
    }

    return { valid: true };
  }

  return walk(puckData);
}

/**
 * Server function to fetch all CMS pages (Admin only - password gated).
 * Does NOT select the large `data` column.
 */
export const getAllCmsPages = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return {
      adminPassword: extractAdminPassword(data),
    };
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      pages: CmsPage[];
      error?: string;
    }> => {
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      const inputPassword = data.adminPassword;

      if (!isAuthorized(inputPassword, expectedPassword)) {
        return { success: false, pages: [], error: "Unauthorized: Invalid admin password." };
      }

      const client = getSupabaseServerClient();

      if (!client) {
        if (isDev) {
          const pages = Array.from(localFallbackPages.values())
            .map(({ id, slug, title, status, created_at, updated_at }) => ({
              id,
              slug,
              title,
              status,
              created_at,
              updated_at,
            }))
            .sort((a, b) => {
              return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            });
          return { success: true, pages };
        }
        return {
          success: false,
          pages: [],
          error: "Database configuration error: Supabase client unavailable.",
        };
      }

      try {
        const { data: records, error } = await client
          .from("cms_pages")
          .select("id, slug, title, status, created_at, updated_at")
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("[CMS] Error fetching pages:", error.message);
          return { success: false, pages: [], error: error.message };
        }

        return { success: true, pages: (records || []) as CmsPage[] };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[CMS] Exception fetching pages:", message);
        return { success: false, pages: [], error: message };
      }
    },
  );

/**
 * Server function to fetch a single CMS page by ID (Admin only - password gated).
 */
export const getCmsPageById = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const payload = (data && typeof data === "object" && "data" in data ? (data as { data: unknown }).data : data) as Record<string, unknown>;
    return {
      id: String(payload?.id || ""),
      adminPassword: extractAdminPassword(payload?.adminPassword || data),
    };
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      error?: string;
    }> => {
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(data.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = data.id.trim();
      if (!id) {
        return { success: false, error: "Page ID is required." };
      }

      const client = getSupabaseServerClient();

      if (!client) {
        if (isDev) {
          const fallback = Array.from(localFallbackPages.values()).find((p) => p.id === id);
          if (!fallback) {
            return { success: false, error: "Page not found." };
          }
          return { success: true, page: fallback };
        }
        return {
          success: false,
          error: "Database configuration error: Supabase client unavailable.",
        };
      }

      try {
        const { data: record, error } = await client
          .from("cms_pages")
          .select("id, slug, title, data, status, created_at, updated_at")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          return { success: false, error: error.message };
        }

        if (!record) {
          return { success: false, error: "Page not found." };
        }

        return { success: true, page: record as CmsPage };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: message };
      }
    },
  );

export interface SaveCmsPageInput {
  id?: string;
  title: string;
  slug: string;
  data?: Data;
  status: "draft" | "published";
  adminPassword?: string;
}

/**
 * Server function to create or save a CMS page (Admin only - password gated).
 * Invalidates lookup cache ONLY after the DB write succeeds.
 * If slug changed during update, invalidates both old and new slug.
 */
export const saveCmsPage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const payload = (input && typeof input === "object" && "data" in input ? (input as { data: unknown }).data : input) as Record<string, unknown>;
    return {
      id: payload?.id ? String(payload.id) : undefined,
      title: String(payload?.title || ""),
      slug: String(payload?.slug || ""),
      data: (payload?.data || { content: [], root: {} }) as Data,
      status: (payload?.status === "published" ? "published" : "draft") as "draft" | "published",
      adminPassword: extractAdminPassword(payload?.adminPassword || input),
    };
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      error?: string;
    }> => {
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(data.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const title = data.title.trim();
      if (!title) {
        return { success: false, error: "Page title is required." };
      }

      // Validate slug
      const slugValidation = validateSlug(data.slug);
      if (!slugValidation.valid) {
        return { success: false, error: slugValidation.error || "Invalid slug." };
      }
      const slug = slugValidation.normalizedSlug;

      // Validate URLs and Style properties across entire Puck data tree
      const treeValidation = validatePuckUrlsAndStyles(data.data);
      if (!treeValidation.valid) {
        return { success: false, error: treeValidation.error };
      }

      const now = new Date().toISOString();
      const client = getSupabaseServerClient();

      if (!client) {
        if (isDev) {
          const existing = data.id
            ? Array.from(localFallbackPages.values()).find((p) => p.id === data.id)
            : null;

          const oldSlug = existing?.slug;
          const pageId = existing ? existing.id : data.id || `local-${Date.now()}`;
          const record: CmsPage = {
            id: pageId,
            title,
            slug,
            data: data.data,
            status: data.status,
            created_at: existing ? existing.created_at : now,
            updated_at: now,
          };

          localFallbackPages.set(pageId, record);
          // Invalidate cache after write succeeds
          invalidateLookupCache(slug);
          if (oldSlug && oldSlug.toLowerCase() !== slug.toLowerCase()) {
            invalidateLookupCache(oldSlug);
          }
          return { success: true, page: record };
        }
        return {
          success: false,
          error: "Database configuration error: Supabase client unavailable.",
        };
      }

      try {
        // If updating, find previous slug to invalidate if changed
        let oldSlug: string | undefined;
        if (data.id) {
          const { data: existingRecord } = await client
            .from("cms_pages")
            .select("slug")
            .eq("id", data.id)
            .maybeSingle();
          oldSlug = existingRecord?.slug;
        }

        const payload: Record<string, unknown> = {
          title,
          slug,
          data: data.data,
          status: data.status,
          updated_at: now,
        };

        let result;
        if (data.id) {
          result = await client
            .from("cms_pages")
            .update(payload)
            .eq("id", data.id)
            .select()
            .single();
        } else {
          result = await client
            .from("cms_pages")
            .insert(payload)
            .select()
            .single();
        }

        if (result.error) {
          if (result.error.code === "23505") {
            return { success: false, error: `A page with slug "${slug}" already exists.` };
          }
          return { success: false, error: result.error.message };
        }

        // Invalidate lookup cache AFTER DB write succeeds
        invalidateLookupCache(slug);
        if (oldSlug && oldSlug.toLowerCase() !== slug.toLowerCase()) {
          invalidateLookupCache(oldSlug);
        }

        return { success: true, page: result.data as CmsPage };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: message };
      }
    },
  );

/**
 * Server function to delete a CMS page (Admin only - password gated).
 * Invalidates lookup cache AFTER DB delete succeeds.
 */
export const deleteCmsPage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const payload = (input && typeof input === "object" && "data" in input ? (input as { data: unknown }).data : input) as Record<string, unknown>;
    return {
      id: String(payload?.id || ""),
      adminPassword: extractAdminPassword(payload?.adminPassword || input),
    };
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      error?: string;
    }> => {
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(data.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = data.id.trim();
      if (!id) {
        return { success: false, error: "Page ID is required." };
      }

      const client = getSupabaseServerClient();

      if (!client) {
        if (isDev) {
          const fallback = localFallbackPages.get(id);
          const oldSlug = fallback?.slug;
          localFallbackPages.delete(id);
          if (oldSlug) {
            invalidateLookupCache(oldSlug);
          } else {
            invalidateLookupCache();
          }
          return { success: true };
        }
        return {
          success: false,
          error: "Database configuration error: Supabase client unavailable.",
        };
      }

      try {
        // Fetch slug before deleting to invalidate exact cache entry
        const { data: pageToDelete } = await client
          .from("cms_pages")
          .select("slug")
          .eq("id", id)
          .maybeSingle();
        const deletedSlug = pageToDelete?.slug;

        const { error } = await client.from("cms_pages").delete().eq("id", id);
        if (error) {
          return { success: false, error: error.message };
        }

        // Invalidate cache AFTER DB delete succeeds
        if (deletedSlug) {
          invalidateLookupCache(deletedSlug);
        } else {
          invalidateLookupCache();
        }

        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: message };
      }
    },
  );

/**
 * Public Server function to lookup a published CMS page by slug for SSR.
 * No password needed, only returns pages where status = 'published'.
 * Includes 45s in-memory caching capped at 500 entries (caches both positive and negative results).
 */
export const lookupPublishedCmsPage = createServerFn({ method: "GET" })
  .validator((slugInput: unknown) => {
    return cleanSlug(typeof slugInput === "string" ? slugInput : "");
  })
  .handler(
    async ({
      data: slug,
    }): Promise<{
      page: CmsPage | null;
      error?: string | null;
    }> => {
      if (!slug) {
        return { page: null, error: null };
      }

      const now = Date.now();
      const cached = pageLookupCache.get(slug.toLowerCase());
      if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
        return { page: cached.page, error: null };
      }

      const client = getSupabaseServerClient();

      if (!client) {
        if (isDev) {
          const match = Array.from(localFallbackPages.values()).find(
            (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.status === "published",
          );
          const resultPage = match || null;
          setInLookupCache(slug, resultPage);
          return { page: resultPage, error: null };
        }
        return {
          page: null,
          error: "Database configuration error: Supabase client unavailable.",
        };
      }

      try {
        const { data, error } = await client
          .from("cms_pages")
          .select("id, slug, title, data, status, created_at, updated_at")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (error) {
          console.error(`[CMS] Database error resolving public page "${slug}":`, error.message);
          return { page: null, error: error.message };
        }

        const foundPage = (data as CmsPage) || null;
        setInLookupCache(slug, foundPage);
        return { page: foundPage, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Database connection error";
        console.error(`[CMS] Exception resolving public page "${slug}":`, message);
        return { page: null, error: message };
      }
    },
  );
