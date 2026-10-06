import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient, getEnvVar } from "./supabase.server";
import {
  normalizeFromPath,
  normalizeToUrl,
  validateRedirectInput,
  detectRedirectLoopOrLongChain,
  type RedirectStatusCode,
} from "./cms-redirects-validator";

export interface CmsRedirect {
  id: string;
  from_path: string;
  to_url: string;
  status_code: RedirectStatusCode;
  enabled: boolean;
  note?: string | null;
  hits: number;
  created_at: string;
  updated_at: string;
}

const isDev = process.env.NODE_ENV !== "production";

// In-memory fallback store for local development when table is not yet migrated in Supabase
const localFallbackRedirects = new Map<string, CmsRedirect>();

// In-memory cache for public redirect lookups with 60s TTL
interface CachedRedirectLookup {
  redirect: { target: string; statusCode: RedirectStatusCode } | null;
  cachedAt: number;
}
const MAX_CACHE_ENTRIES = 500;
const redirectLookupCache = new Map<string, CachedRedirectLookup>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function setInLookupCache(
  fromPath: string,
  result: { target: string; statusCode: RedirectStatusCode } | null
) {
  const key = fromPath.toLowerCase();
  if (redirectLookupCache.size >= MAX_CACHE_ENTRIES && !redirectLookupCache.has(key)) {
    const oldestKey = redirectLookupCache.keys().next().value;
    if (oldestKey !== undefined) {
      redirectLookupCache.delete(oldestKey);
    }
  }
  redirectLookupCache.set(key, { redirect: result, cachedAt: Date.now() });
}

export function invalidateRedirectCache(fromPath?: string) {
  if (fromPath) {
    redirectLookupCache.delete(fromPath.toLowerCase());
  } else {
    redirectLookupCache.clear();
  }
}

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

function checkAdminAuth(pwd: string): { authorized: boolean; error?: string } {
  const configuredPassword =
    getEnvVar("INTERNAL_ADMIN_PASSWORD") ||
    getEnvVar("VITE_INTERNAL_ADMIN_PASSWORD") ||
    "smgaba123@#";

  const cleanInput = cleanPw(pwd);
  const cleanConfig = cleanPw(configuredPassword);

  if (!cleanInput) {
    return { authorized: false, error: "Admin password is required." };
  }

  const inputBuf = Buffer.from(cleanInput);
  const configBuf = Buffer.from(cleanConfig);

  const isLengthMatch = inputBuf.length === configBuf.length;
  const targetBuf = isLengthMatch ? configBuf : inputBuf;
  const isMatch = crypto.timingSafeEqual(inputBuf, targetBuf) && isLengthMatch;

  if (!isMatch) {
    return { authorized: false, error: "Invalid admin password." };
  }

  return { authorized: true };
}

/**
 * Public Server Function: Resolve a redirect rule for a given path.
 * Fails safely on any error (never throws, returns null if no match or error).
 * Automatically increments hits count in a fire-and-forget task.
 */
export const resolveCmsRedirect = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    if (typeof input === "string") return input;
    if (input && typeof input === "object" && "data" in input && typeof (input as any).data === "string") {
      return (input as any).data;
    }
    return "";
  })
  .handler(async ({ data: rawPath }): Promise<{ target: string; statusCode: RedirectStatusCode } | null> => {
    try {
      if (!rawPath) return null;
      const normalized = normalizeFromPath(rawPath);
      if (!normalized || normalized === "/") return null;

      // Check in-memory cache
      const cached = redirectLookupCache.get(normalized);
      if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        return cached.redirect;
      }

      // Check fallback store in dev first
      if (isDev && localFallbackRedirects.size > 0) {
        const found = localFallbackRedirects.get(normalized);
        if (found && found.enabled) {
          found.hits = (found.hits || 0) + 1;
          const result = { target: found.to_url, statusCode: found.status_code };
          setInLookupCache(normalized, result);
          return result;
        }
      }

      // Query Supabase
      const supabase = await getSupabaseServerClient();
      const { data, error } = await supabase
        .from("cms_redirects")
        .select("id, from_path, to_url, status_code, enabled, hits")
        .eq("from_path", normalized)
        .eq("enabled", true)
        .maybeSingle();

      if (error) {
        console.warn(`[CMS Redirects] Lookup error for "${normalized}":`, error.message);
        setInLookupCache(normalized, null);
        return null;
      }

      if (!data) {
        setInLookupCache(normalized, null);
        return null;
      }

      const result = {
        target: data.to_url,
        statusCode: (data.status_code as RedirectStatusCode) || 301,
      };

      setInLookupCache(normalized, result);

      // Fire-and-forget hit counter increment
      (async () => {
        try {
          const client = await getSupabaseServerClient();
          await client
            .from("cms_redirects")
            .update({ hits: (data.hits || 0) + 1 })
            .eq("id", data.id);
        } catch {
          // Ignore hit counter errors
        }
      })();

      return result;
    } catch (err) {
      console.warn("[CMS Redirects] resolveCmsRedirect unexpected error:", err);
      return null;
    }
  });

/**
 * Admin Server Function: List all CMS redirects.
 */
export const listCmsRedirects = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return { adminPassword: extractAdminPassword(input) };
  })
  .handler(async ({ data: { adminPassword } }): Promise<{ success: boolean; redirects?: CmsRedirect[]; error?: string }> => {
    try {
      const auth = checkAdminAuth(adminPassword);
      if (!auth.authorized) {
        return { success: false, error: auth.error || "Unauthorized." };
      }

      const supabase = await getSupabaseServerClient();
      const { data, error } = await supabase
        .from("cms_redirects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        if (isDev) {
          console.warn("[CMS Redirects] Supabase query failed, returning fallback store:", error.message);
          return {
            success: true,
            redirects: Array.from(localFallbackRedirects.values()).sort(
              (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            ),
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true, redirects: (data as CmsRedirect[]) || [] };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to fetch redirects." };
    }
  });

/**
 * Admin Server Function: Create a new CMS redirect.
 */
export const createCmsRedirect = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw = (input && typeof input === "object" && "data" in input ? (input as any).data : input) || {};
    return {
      from_path: String(raw.from_path || ""),
      to_url: String(raw.to_url || ""),
      status_code: Number(raw.status_code || 301),
      enabled: raw.enabled !== false,
      note: raw.note ? String(raw.note) : undefined,
      adminPassword: extractAdminPassword(input),
    };
  })
  .handler(
    async ({
      data: { from_path, to_url, status_code, enabled, note, adminPassword },
    }): Promise<{ success: boolean; redirect?: CmsRedirect; error?: string; warning?: string }> => {
      try {
        const auth = checkAdminAuth(adminPassword);
        if (!auth.authorized) {
          return { success: false, error: auth.error || "Unauthorized." };
        }

        const normFrom = normalizeFromPath(from_path);
        const normTo = normalizeToUrl(to_url);

        const validation = validateRedirectInput(normFrom, normTo, status_code);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }

        const supabase = await getSupabaseServerClient();

        // Check loop/chain against existing active redirects
        const { data: existingRows } = await supabase
          .from("cms_redirects")
          .select("id, from_path, to_url, enabled");

        const existingList = (existingRows as any[]) || Array.from(localFallbackRedirects.values());
        const loopCheck = detectRedirectLoopOrLongChain(normFrom, normTo, existingList);
        if (!loopCheck.valid) {
          return { success: false, error: loopCheck.error };
        }

        const newRecord: CmsRedirect = {
          id: crypto.randomUUID(),
          from_path: normFrom,
          to_url: normTo,
          status_code: status_code as RedirectStatusCode,
          enabled,
          note: note?.trim() || null,
          hits: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("cms_redirects")
          .insert({
            id: newRecord.id,
            from_path: newRecord.from_path,
            to_url: newRecord.to_url,
            status_code: newRecord.status_code,
            enabled: newRecord.enabled,
            note: newRecord.note,
            hits: 0,
          })
          .select()
          .single();

        if (error) {
          if (error.code === "23505" || error.message.includes("unique")) {
            return { success: false, error: `A redirect for path "${normFrom}" already exists.` };
          }
          if (isDev) {
            console.warn("[CMS Redirects] Supabase insert failed, saving in memory fallback:", error.message);
            localFallbackRedirects.set(normFrom, newRecord);
            invalidateRedirectCache(normFrom);
            return { success: true, redirect: newRecord, warning: validation.warning };
          }
          return { success: false, error: error.message };
        }

        invalidateRedirectCache(normFrom);
        return { success: true, redirect: data as CmsRedirect, warning: validation.warning };
      } catch (err: any) {
        return { success: false, error: err?.message || "Failed to create redirect." };
      }
    }
  );

/**
 * Admin Server Function: Update an existing CMS redirect.
 */
export const updateCmsRedirect = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw = (input && typeof input === "object" && "data" in input ? (input as any).data : input) || {};
    return {
      id: String(raw.id || ""),
      from_path: String(raw.from_path || ""),
      to_url: String(raw.to_url || ""),
      status_code: Number(raw.status_code || 301),
      enabled: Boolean(raw.enabled),
      note: raw.note ? String(raw.note) : undefined,
      adminPassword: extractAdminPassword(input),
    };
  })
  .handler(
    async ({
      data: { id, from_path, to_url, status_code, enabled, note, adminPassword },
    }): Promise<{ success: boolean; redirect?: CmsRedirect; error?: string; warning?: string }> => {
      try {
        const auth = checkAdminAuth(adminPassword);
        if (!auth.authorized) {
          return { success: false, error: auth.error || "Unauthorized." };
        }

        if (!id) {
          return { success: false, error: "Redirect ID is required." };
        }

        const normFrom = normalizeFromPath(from_path);
        const normTo = normalizeToUrl(to_url);

        const validation = validateRedirectInput(normFrom, normTo, status_code);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }

        const supabase = await getSupabaseServerClient();

        // Check loop/chain against existing active redirects
        const { data: existingRows } = await supabase
          .from("cms_redirects")
          .select("id, from_path, to_url, enabled");

        const existingList = (existingRows as any[]) || Array.from(localFallbackRedirects.values());
        const loopCheck = detectRedirectLoopOrLongChain(normFrom, normTo, existingList, id);
        if (!loopCheck.valid) {
          return { success: false, error: loopCheck.error };
        }

        const updated_at = new Date().toISOString();

        const { data, error } = await supabase
          .from("cms_redirects")
          .update({
            from_path: normFrom,
            to_url: normTo,
            status_code,
            enabled,
            note: note?.trim() || null,
            updated_at,
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          if (error.code === "23505" || error.message.includes("unique")) {
            return { success: false, error: `Another redirect with path "${normFrom}" already exists.` };
          }
          if (isDev) {
            console.warn("[CMS Redirects] Supabase update failed, updating memory fallback:", error.message);
            const fallback = Array.from(localFallbackRedirects.values()).find((r) => r.id === id);
            if (fallback) {
              localFallbackRedirects.delete(fallback.from_path);
              fallback.from_path = normFrom;
              fallback.to_url = normTo;
              fallback.status_code = status_code as RedirectStatusCode;
              fallback.enabled = enabled;
              fallback.note = note?.trim() || null;
              fallback.updated_at = updated_at;
              localFallbackRedirects.set(normFrom, fallback);
              invalidateRedirectCache();
              return { success: true, redirect: fallback, warning: validation.warning };
            }
          }
          return { success: false, error: error.message };
        }

        invalidateRedirectCache();
        return { success: true, redirect: data as CmsRedirect, warning: validation.warning };
      } catch (err: any) {
        return { success: false, error: err?.message || "Failed to update redirect." };
      }
    }
  );

/**
 * Admin Server Function: Delete a redirect.
 */
export const deleteCmsRedirect = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw = (input && typeof input === "object" && "data" in input ? (input as any).data : input) || {};
    return {
      id: String(raw.id || ""),
      adminPassword: extractAdminPassword(input),
    };
  })
  .handler(async ({ data: { id, adminPassword } }): Promise<{ success: boolean; error?: string }> => {
    try {
      const auth = checkAdminAuth(adminPassword);
      if (!auth.authorized) {
        return { success: false, error: auth.error || "Unauthorized." };
      }

      if (!id) {
        return { success: false, error: "Redirect ID is required." };
      }

      const supabase = await getSupabaseServerClient();
      const { error } = await supabase.from("cms_redirects").delete().eq("id", id);

      if (error && isDev) {
        const keyToDelete = Array.from(localFallbackRedirects.entries()).find(([_, r]) => r.id === id)?.[0];
        if (keyToDelete) {
          localFallbackRedirects.delete(keyToDelete);
        }
      }

      invalidateRedirectCache();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to delete redirect." };
    }
  });

/**
 * Admin Server Function: Toggle redirect enabled state.
 */
export const toggleCmsRedirect = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw = (input && typeof input === "object" && "data" in input ? (input as any).data : input) || {};
    return {
      id: String(raw.id || ""),
      enabled: Boolean(raw.enabled),
      adminPassword: extractAdminPassword(input),
    };
  })
  .handler(
    async ({ data: { id, enabled, adminPassword } }): Promise<{ success: boolean; redirect?: CmsRedirect; error?: string }> => {
      try {
        const auth = checkAdminAuth(adminPassword);
        if (!auth.authorized) {
          return { success: false, error: auth.error || "Unauthorized." };
        }

        const supabase = await getSupabaseServerClient();
        const { data, error } = await supabase
          .from("cms_redirects")
          .update({ enabled, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          if (isDev) {
            const fallback = Array.from(localFallbackRedirects.values()).find((r) => r.id === id);
            if (fallback) {
              fallback.enabled = enabled;
              fallback.updated_at = new Date().toISOString();
              invalidateRedirectCache();
              return { success: true, redirect: fallback };
            }
          }
          return { success: false, error: error.message };
        }

        invalidateRedirectCache();
        return { success: true, redirect: data as CmsRedirect };
      } catch (err: any) {
        return { success: false, error: err?.message || "Failed to toggle redirect status." };
      }
    }
  );
