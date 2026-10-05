import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import type { Data } from "@puckeditor/core";
import { getSupabaseServerClient, getEnvVar } from "./supabase.server";
import { validateSlug, cleanSlug } from "./cms-slugs";
import { isValidButtonUrl } from "@/cms/blocks/Button";
import { isValidImageUrl } from "@/cms/blocks/Image";
import { isValidCanonicalUrl } from "@/cms/root";
import { validateBlockStyle } from "@/cms/style";
import {
  type CmsSiteSettings,
  validateSiteSettings,
  DEFAULT_SITE_SETTINGS,
} from "./cms-settings";

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  data?: Data;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface CmsPageVersion {
  id: string;
  page_id: string;
  version_number: number;
  title: string;
  slug: string;
  data: Data;
  status: "draft" | "published";
  change_summary?: string;
  created_at: string;
  created_by?: string;
}

const isDev = process.env.NODE_ENV !== "production";

// In-memory fallback stores for local development ONLY (NODE_ENV !== "production")
const localFallbackPages = new Map<string, CmsPage>();
const localFallbackVersions = new Map<string, CmsPageVersion[]>();

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

      // 1. Validate image properties (src, image, avatarurl, imageurl)
      if (
        (lowerKey === "src" ||
          lowerKey.endsWith("src") ||
          lowerKey === "image" ||
          lowerKey.endsWith("image") ||
          lowerKey.endsWith("avatarurl") ||
          lowerKey.endsWith("imageurl")) &&
        typeof val === "string" &&
        val.trim().length > 0
      ) {
        if (!isValidImageUrl(val)) {
          return {
            valid: false,
            error: `Invalid image URL "${val}" in property "${key}". Only https://, http://, and / (relative) are allowed. Data URLs (data:) and javascript: URLs are rejected.`,
          };
        }
      }

      // 2. Validate canonical URLs specifically
      if (
        lowerKey === "canonicalurl" &&
        typeof val === "string" &&
        val.trim().length > 0
      ) {
        if (!isValidCanonicalUrl(val)) {
          return {
            valid: false,
            error: `Invalid canonical URL "${val}". Only https://, http://, and / (relative) are allowed. Protocol-relative ("//..."), data:, and javascript: URLs are rejected.`,
          };
        }
      }

      // 3. Validate generic destination URLs (url, href, link)
      if (
        (lowerKey === "url" ||
          lowerKey.endsWith("url") ||
          lowerKey === "href" ||
          lowerKey.endsWith("href") ||
          lowerKey === "link" ||
          lowerKey.endsWith("link")) &&
        lowerKey !== "canonicalurl" &&
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

      // 3. Validate style properties
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

function formatDbError(error: { message?: string; code?: string } | null | undefined): string {
  if (!error) return "An unexpected database error occurred.";
  const msg = error.message || "";
  if (
    msg.includes("schema cache") ||
    msg.includes("cms_pages") ||
    error.code === "PGRST205" ||
    error.code === "42P01"
  ) {
    return "The 'cms_pages' table does not exist in Supabase yet. Please run the SQL migration in your Supabase SQL Editor (found in supabase/migrations/create_cms_pages_table.sql).";
  }
  if (error.code === "23505") {
    return "A page with this URL slug already exists. Please choose a different slug.";
  }
  return msg || "Database error occurred.";
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
          return { success: false, pages: [], error: formatDbError(error) };
        }

        return { success: true, pages: (records || []) as CmsPage[] };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[CMS] Exception fetching pages:", message);
        return { success: false, pages: [], error: formatDbError({ message }) };
      }
    },
  );

function parseIdInput(input: unknown): { id: string; adminPassword: string } {
  if (!input || typeof input !== "object") {
    return { id: "", adminPassword: "" };
  }
  const obj = input as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && "id" in (obj.data as Record<string, unknown>)) {
    const nested = obj.data as Record<string, unknown>;
    return {
      id: String(nested.id || "").trim(),
      adminPassword: extractAdminPassword(nested.adminPassword || obj.adminPassword || obj),
    };
  }
  return {
    id: String(obj.id || "").trim(),
    adminPassword: extractAdminPassword(obj.adminPassword || obj),
  };
}

function parseSaveCmsPageInput(input: unknown): SaveCmsPageInput {
  if (!input || typeof input !== "object") {
    return { title: "", slug: "", status: "draft" };
  }
  const obj = input as Record<string, unknown>;
  // If TanStack Start wrapped { data: { title: "...", slug: "...", data: {...} } }
  if (
    obj.data &&
    typeof obj.data === "object" &&
    ("title" in (obj.data as Record<string, unknown>) || "slug" in (obj.data as Record<string, unknown>))
  ) {
    const nested = obj.data as Record<string, unknown>;
    return {
      id: nested.id ? String(nested.id) : undefined,
      title: String(nested.title || "").trim(),
      slug: String(nested.slug || "").trim(),
      data: (nested.data || { content: [], root: {} }) as Data,
      status: nested.status === "published" ? "published" : "draft",
      adminPassword: extractAdminPassword(nested.adminPassword || obj.adminPassword || obj),
    };
  }
  // Standard unwrapped object
  return {
    id: obj.id ? String(obj.id) : undefined,
    title: String(obj.title || "").trim(),
    slug: String(obj.slug || "").trim(),
    data: (obj.data || { content: [], root: {} }) as Data,
    status: obj.status === "published" ? "published" : "draft",
    adminPassword: extractAdminPassword(obj.adminPassword || obj),
  };
}

/**
 * Server function to fetch a single CMS page by ID (Admin only - password gated).
 */
export const getCmsPageById = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    return parseIdInput(data);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      error?: string;
    }> => {
      const parsed = parseIdInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = parsed.id;
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
          return { success: false, error: formatDbError(error) };
        }

        if (!record) {
          return { success: false, error: "Page not found." };
        }

        return { success: true, page: record as CmsPage };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: formatDbError({ message }) };
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

const MAX_VERSIONS_PER_PAGE = 25;

async function recordVersionSnapshot(
  pageId: string,
  title: string,
  slug: string,
  data: Data | undefined,
  status: "draft" | "published",
  changeSummary?: string,
  createdBy: string = "admin"
): Promise<void> {
  if (!pageId || !data) return;
  const now = new Date().toISOString();
  const client = getSupabaseServerClient();

  if (isDev && !client) {
    const pageVersions = localFallbackVersions.get(pageId) || [];
    const lastVersion = pageVersions[0];
    if (
      lastVersion &&
      lastVersion.status === status &&
      lastVersion.title === title &&
      JSON.stringify(lastVersion.data) === JSON.stringify(data)
    ) {
      return;
    }

    const nextVerNum = lastVersion ? lastVersion.version_number + 1 : 1;
    const newVer: CmsPageVersion = {
      id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      page_id: pageId,
      version_number: nextVerNum,
      title,
      slug,
      data,
      status,
      change_summary: changeSummary || (status === "published" ? "Published" : "Draft saved"),
      created_at: now,
      created_by: createdBy,
    };
    pageVersions.unshift(newVer);
    if (pageVersions.length > MAX_VERSIONS_PER_PAGE) {
      pageVersions.splice(MAX_VERSIONS_PER_PAGE);
    }
    localFallbackVersions.set(pageId, pageVersions);
    return;
  }

  if (client) {
    try {
      const { data: latestRows } = await client
        .from("cms_page_versions")
        .select("id, version_number, title, slug, data, status")
        .eq("page_id", pageId)
        .order("version_number", { ascending: false })
        .limit(1);

      const lastVer = latestRows?.[0];
      if (
        lastVer &&
        lastVer.status === status &&
        lastVer.title === title &&
        JSON.stringify(lastVer.data) === JSON.stringify(data)
      ) {
        return;
      }

      const nextVerNum = lastVer ? Number(lastVer.version_number) + 1 : 1;
      const newVersionPayload = {
        page_id: pageId,
        version_number: nextVerNum,
        title,
        slug,
        data,
        status,
        change_summary: changeSummary || (status === "published" ? "Published" : "Draft saved"),
        created_at: now,
        created_by: createdBy,
      };

      await client.from("cms_page_versions").insert(newVersionPayload);

      const { data: allVersions } = await client
        .from("cms_page_versions")
        .select("id, created_at")
        .eq("page_id", pageId)
        .order("version_number", { ascending: false });

      if (allVersions && allVersions.length > MAX_VERSIONS_PER_PAGE) {
        const excessIds = allVersions.slice(MAX_VERSIONS_PER_PAGE).map((v) => v.id);
        if (excessIds.length > 0) {
          await client.from("cms_page_versions").delete().in("id", excessIds);
        }
      }
    } catch (err: any) {
      console.warn("[CMS Versioning] Failed to record snapshot in Supabase:", err.message);
    }
  }
}

/**
 * Server function to create or save a CMS page (Admin only - password gated).
 * Invalidates lookup cache ONLY after the DB write succeeds.
 * If slug changed during update, invalidates both old and new slug.
 * Automatically records revision history snapshot.
 */
export const saveCmsPage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return parseSaveCmsPageInput(input);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      error?: string;
    }> => {
      const parsed = parseSaveCmsPageInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const title = parsed.title;
      if (!title) {
        return {
          success: false,
          error: "Please enter a page title (e.g. 'Special Advisory Services').",
        };
      }

      // Validate slug
      const slugValidation = validateSlug(parsed.slug);
      if (!slugValidation.valid) {
        return { success: false, error: slugValidation.error || "Please enter a valid URL slug." };
      }
      const slug = slugValidation.normalizedSlug;

      // Validate URLs and Style properties across entire Puck data tree
      const treeValidation = validatePuckUrlsAndStyles(parsed.data);
      if (!treeValidation.valid) {
        return { success: false, error: treeValidation.error };
      }

      const now = new Date().toISOString();
      const client = getSupabaseServerClient();

      if (!client) {
        if (isDev) {
          const existing = parsed.id
            ? Array.from(localFallbackPages.values()).find((p) => p.id === parsed.id)
            : null;

          const oldSlug = existing?.slug;
          const pageId = existing ? existing.id : parsed.id || `local-${Date.now()}`;
          const record: CmsPage = {
            id: pageId,
            title,
            slug,
            data: parsed.data,
            status: parsed.status,
            created_at: existing ? existing.created_at : now,
            updated_at: now,
          };

          localFallbackPages.set(pageId, record);
          invalidateLookupCache(slug);
          if (oldSlug && oldSlug.toLowerCase() !== slug.toLowerCase()) {
            invalidateLookupCache(oldSlug);
          }

          await recordVersionSnapshot(
            pageId,
            title,
            slug,
            parsed.data,
            parsed.status,
            parsed.status === "published" ? "Published page update" : "Saved draft update"
          );

          return { success: true, page: record };
        }
        return {
          success: false,
          error: "Database configuration error: Supabase client unavailable.",
        };
      }

      try {
        let oldSlug: string | undefined;
        if (parsed.id) {
          const { data: existingRecord } = await client
            .from("cms_pages")
            .select("slug")
            .eq("id", parsed.id)
            .maybeSingle();
          oldSlug = existingRecord?.slug;
        }

        const payload: Record<string, unknown> = {
          title,
          slug,
          data: parsed.data,
          status: parsed.status,
          updated_at: now,
        };

        let result;
        if (parsed.id) {
          result = await client
            .from("cms_pages")
            .update(payload)
            .eq("id", parsed.id)
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
          return { success: false, error: formatDbError(result.error) };
        }

        invalidateLookupCache(slug);
        if (oldSlug && oldSlug.toLowerCase() !== slug.toLowerCase()) {
          invalidateLookupCache(oldSlug);
        }

        const savedPage = result.data as CmsPage;
        await recordVersionSnapshot(
          savedPage.id,
          savedPage.title,
          savedPage.slug,
          savedPage.data,
          savedPage.status,
          savedPage.status === "published" ? "Published page update" : "Saved draft update"
        );

        return { success: true, page: savedPage };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { success: false, error: formatDbError({ message }) };
      }
    },
  );

/**
 * Server function to duplicate / clone a CMS page (Admin only - password gated).
 * Clones all blocks, DropZones, SEO, OG settings, and creates in draft mode with unique slug.
 */
export const duplicateCmsPage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return parseIdInput(input);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      error?: string;
    }> => {
      const parsed = parseIdInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = parsed.id;
      if (!id) {
        return { success: false, error: "Source page ID is required." };
      }

      const client = getSupabaseServerClient();
      let sourcePage: CmsPage | null = null;

      if (!client) {
        if (isDev) {
          sourcePage = localFallbackPages.get(id) || null;
        } else {
          return { success: false, error: "Database client unavailable." };
        }
      } else {
        const { data: rec, error } = await client
          .from("cms_pages")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error || !rec) {
          return { success: false, error: error?.message || "Source page not found." };
        }
        sourcePage = rec as CmsPage;
      }

      if (!sourcePage) {
        return { success: false, error: "Source page not found." };
      }

      if (sourcePage.slug === "__site_settings__") {
        return { success: false, error: "System settings pages cannot be duplicated." };
      }

      // Generate unique slug
      const baseSlug = `${sourcePage.slug}-copy`;
      let targetSlug = baseSlug;
      let counter = 1;

      // Helper to check if slug exists
      async function slugExists(testSlug: string): Promise<boolean> {
        if (!validateSlug(testSlug).valid) return true;
        if (!client && isDev) {
          return Array.from(localFallbackPages.values()).some((p) => p.slug.toLowerCase() === testSlug.toLowerCase());
        }
        if (client) {
          const { data: existing } = await client
            .from("cms_pages")
            .select("id")
            .eq("slug", testSlug)
            .maybeSingle();
          return Boolean(existing);
        }
        return false;
      }

      while (await slugExists(targetSlug)) {
        counter++;
        targetSlug = `${baseSlug}-${counter}`;
      }

      const newTitle = `${sourcePage.title} (Copy)`;
      const clonedData: Data = JSON.parse(JSON.stringify(sourcePage.data || { content: [], root: {} }));
      if (clonedData.root?.props) {
        clonedData.root.props.title = newTitle;
        if (clonedData.root.props.seoTitle) {
          clonedData.root.props.seoTitle = `${newTitle} | SMG ABA`;
        }
      }

      const treeValidation = validatePuckUrlsAndStyles(clonedData);
      if (!treeValidation.valid) {
        return { success: false, error: treeValidation.error };
      }

      const now = new Date().toISOString();

      if (!client && isDev) {
        const newId = `local-${Date.now()}`;
        const newRecord: CmsPage = {
          id: newId,
          title: newTitle,
          slug: targetSlug,
          data: clonedData,
          status: "draft",
          created_at: now,
          updated_at: now,
        };
        localFallbackPages.set(newId, newRecord);
        await recordVersionSnapshot(newId, newTitle, targetSlug, clonedData, "draft", `Duplicated from /${sourcePage.slug}`);
        return { success: true, page: newRecord };
      }

      if (client) {
        const { data: newRow, error: insErr } = await client
          .from("cms_pages")
          .insert({
            title: newTitle,
            slug: targetSlug,
            data: clonedData,
            status: "draft",
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        if (insErr || !newRow) {
          return { success: false, error: formatDbError(insErr) };
        }

        const createdPage = newRow as CmsPage;
        await recordVersionSnapshot(
          createdPage.id,
          createdPage.title,
          createdPage.slug,
          createdPage.data,
          "draft",
          `Duplicated from /${sourcePage.slug}`
        );
        return { success: true, page: createdPage };
      }

      return { success: false, error: "Database unavailable." };
    },
  );

/**
 * Server function to Unpublish a CMS page (Admin only - password gated).
 * Sets status = 'draft' and invalidates cache so public /$slug returns 404.
 */
export const unpublishCmsPage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return parseIdInput(input);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      error?: string;
    }> => {
      const parsed = parseIdInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = parsed.id;
      if (!id) {
        return { success: false, error: "Page ID is required." };
      }

      const client = getSupabaseServerClient();
      const now = new Date().toISOString();

      if (!client && isDev) {
        const page = localFallbackPages.get(id);
        if (!page) {
          return { success: false, error: "Page not found." };
        }
        page.status = "draft";
        page.updated_at = now;
        localFallbackPages.set(id, page);
        invalidateLookupCache(page.slug);
        await recordVersionSnapshot(page.id, page.title, page.slug, page.data, "draft", "Unpublished page to draft");
        return { success: true, page };
      }

      if (client) {
        const { data: updated, error } = await client
          .from("cms_pages")
          .update({ status: "draft", updated_at: now })
          .eq("id", id)
          .select()
          .single();

        if (error || !updated) {
          return { success: false, error: formatDbError(error) };
        }

        const page = updated as CmsPage;
        invalidateLookupCache(page.slug);
        await recordVersionSnapshot(page.id, page.title, page.slug, page.data, "draft", "Unpublished page to draft");
        return { success: true, page };
      }

      return { success: false, error: "Database unavailable." };
    },
  );

/**
 * Server function to Publish a CMS page (Admin only - password gated).
 * Validates payload, sets status = 'published' and updates cache.
 */
export const publishCmsPage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return parseIdInput(input);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      error?: string;
    }> => {
      const parsed = parseIdInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = parsed.id;
      if (!id) {
        return { success: false, error: "Page ID is required." };
      }

      const client = getSupabaseServerClient();
      const now = new Date().toISOString();

      if (!client && isDev) {
        const page = localFallbackPages.get(id);
        if (!page) {
          return { success: false, error: "Page not found." };
        }
        const val = validatePuckUrlsAndStyles(page.data);
        if (!val.valid) {
          return { success: false, error: val.error };
        }
        page.status = "published";
        page.updated_at = now;
        localFallbackPages.set(id, page);
        invalidateLookupCache(page.slug);
        await recordVersionSnapshot(page.id, page.title, page.slug, page.data, "published", "Published page to live");
        return { success: true, page };
      }

      if (client) {
        const { data: existing } = await client
          .from("cms_pages")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (!existing) {
          return { success: false, error: "Page not found." };
        }

        const val = validatePuckUrlsAndStyles(existing.data);
        if (!val.valid) {
          return { success: false, error: val.error };
        }

        const { data: updated, error } = await client
          .from("cms_pages")
          .update({ status: "published", updated_at: now })
          .eq("id", id)
          .select()
          .single();

        if (error || !updated) {
          return { success: false, error: formatDbError(error) };
        }

        const page = updated as CmsPage;
        invalidateLookupCache(page.slug);
        await recordVersionSnapshot(page.id, page.title, page.slug, page.data, "published", "Published page to live");
        return { success: true, page };
      }

      return { success: false, error: "Database unavailable." };
    },
  );

/**
 * Server function to delete a CMS page (Admin only - password gated).
 * Also safeguards internal system records (__site_settings__).
 * Invalidates cache on delete.
 */
export const deleteCmsPage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return parseIdInput(input);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      error?: string;
    }> => {
      const parsed = parseIdInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = parsed.id;
      if (!id) {
        return { success: false, error: "Page ID is required." };
      }

      const client = getSupabaseServerClient();

      if (!client) {
        if (isDev) {
          const page = localFallbackPages.get(id);
          if (page?.slug === "__site_settings__") {
            return { success: false, error: "System settings records cannot be deleted." };
          }
          if (page?.slug) {
            invalidateLookupCache(page.slug);
          }
          localFallbackPages.delete(id);
          localFallbackVersions.delete(id);
          return { success: true };
        }
        return { success: false, error: "Database client unavailable." };
      }

      // Check if system settings page
      const { data: pageRecord } = await client
        .from("cms_pages")
        .select("slug")
        .eq("id", id)
        .maybeSingle();

      if (pageRecord?.slug === "__site_settings__") {
        return { success: false, error: "System settings records cannot be deleted." };
      }

      const { error: delError } = await client.from("cms_pages").delete().eq("id", id);
      if (delError) {
        return { success: false, error: formatDbError(delError) };
      }

      if (pageRecord?.slug) {
        invalidateLookupCache(pageRecord.slug);
      }

      return { success: true };
    },
  );

/**
 * Server function to fetch revision history snapshots for a CMS page (Admin only - password gated).
 */
export const getCmsPageVersions = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return parseIdInput(input);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      versions: CmsPageVersion[];
      error?: string;
    }> => {
      const parsed = parseIdInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, versions: [], error: "Unauthorized: Invalid admin password." };
      }

      const id = parsed.id;
      if (!id) {
        return { success: false, versions: [], error: "Page ID is required." };
      }

      const client = getSupabaseServerClient();

      if (!client && isDev) {
        const versions = localFallbackVersions.get(id) || [];
        return { success: true, versions };
      }

      if (client) {
        try {
          const { data: rows, error } = await client
            .from("cms_page_versions")
            .select("*")
            .eq("page_id", id)
            .order("version_number", { ascending: false });

          if (error) {
            console.warn("[CMS Versions] DB query warning:", error.message);
            const local = localFallbackVersions.get(id) || [];
            return { success: true, versions: local };
          }

          return { success: true, versions: (rows || []) as CmsPageVersion[] };
        } catch (err: any) {
          const local = localFallbackVersions.get(id) || [];
          return { success: true, versions: local };
        }
      }

      return { success: true, versions: [] };
    },
  );

/**
 * Server function to restore a specific historical version of a CMS page (Admin only - password gated).
 * Re-validates historical data, updates active page, and creates a new revision snapshot.
 */
export const restoreCmsPageVersion = createServerFn({ method: "POST" })
  .validator((input: unknown): { pageId: string; versionId: string; adminPassword: string } => {
    if (!input || typeof input !== "object") {
      return { pageId: "", versionId: "", adminPassword: "" };
    }
    const obj = input as Record<string, unknown>;
    const data = (obj.data && typeof obj.data === "object" ? obj.data : obj) as Record<string, unknown>;
    return {
      pageId: String(data.pageId || "").trim(),
      versionId: String(data.versionId || "").trim(),
      adminPassword: extractAdminPassword(data.adminPassword || obj.adminPassword || data),
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

      const { pageId, versionId } = data;
      if (!pageId || !versionId) {
        return { success: false, error: "Page ID and Version ID are required." };
      }

      const client = getSupabaseServerClient();
      let targetVersion: CmsPageVersion | null = null;

      if (!client && isDev) {
        const versions = localFallbackVersions.get(pageId) || [];
        targetVersion = versions.find((v) => v.id === versionId) || null;
      } else if (client) {
        const { data: verRow } = await client
          .from("cms_page_versions")
          .select("*")
          .eq("id", versionId)
          .maybeSingle();
        targetVersion = verRow as CmsPageVersion | null;
      }

      if (!targetVersion) {
        // Check local memory as secondary fallback
        const versions = localFallbackVersions.get(pageId) || [];
        targetVersion = versions.find((v) => v.id === versionId) || null;
      }

      if (!targetVersion) {
        return { success: false, error: "Selected historical version not found." };
      }

      // Re-validate historical data strictly before applying
      const treeValidation = validatePuckUrlsAndStyles(targetVersion.data);
      if (!treeValidation.valid) {
        return {
          success: false,
          error: `Cannot restore version: Historical data failed security validation (${treeValidation.error}).`,
        };
      }

      const now = new Date().toISOString();

      if (!client && isDev) {
        const page = localFallbackPages.get(pageId);
        if (!page) {
          return { success: false, error: "Active page not found." };
        }
        page.title = targetVersion.title;
        page.data = targetVersion.data;
        page.updated_at = now;
        localFallbackPages.set(pageId, page);
        invalidateLookupCache(page.slug);
        await recordVersionSnapshot(
          pageId,
          page.title,
          page.slug,
          targetVersion.data,
          page.status,
          `Restored from Version #${targetVersion.version_number}`
        );
        return { success: true, page };
      }

      if (client) {
        const { data: updated, error } = await client
          .from("cms_pages")
          .update({
            title: targetVersion.title,
            data: targetVersion.data,
            updated_at: now,
          })
          .eq("id", pageId)
          .select()
          .single();

        if (error || !updated) {
          return { success: false, error: formatDbError(error) };
        }

        const restoredPage = updated as CmsPage;
        invalidateLookupCache(restoredPage.slug);
        await recordVersionSnapshot(
          restoredPage.id,
          restoredPage.title,
          restoredPage.slug,
          restoredPage.data,
          restoredPage.status,
          `Restored from Version #${targetVersion.version_number}`
        );
        return { success: true, page: restoredPage };
      }

      return { success: false, error: "Database unavailable." };
    },
  );

/**
 * Server function to get Draft Preview page data (Admin only - password gated).
 * Allows previewing unpublished drafts with identical layout/settings.
 */
export const getCmsPageDraftPreview = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    return parseIdInput(input);
  })
  .handler(
    async ({
      data,
    }): Promise<{
      success: boolean;
      page?: CmsPage;
      settings?: CmsSiteSettings;
      error?: string;
    }> => {
      const parsed = parseIdInput(data);
      const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
      if (!isAuthorized(parsed.adminPassword, expectedPassword)) {
        return { success: false, error: "Unauthorized: Invalid admin password." };
      }

      const id = parsed.id;
      if (!id) {
        return { success: false, error: "Page ID is required." };
      }

      const client = getSupabaseServerClient();
      let page: CmsPage | null = null;

      if (!client && isDev) {
        page = localFallbackPages.get(id) || null;
      } else if (client) {
        const { data: rec, error } = await client
          .from("cms_pages")
          .select("id, slug, title, data, status, created_at, updated_at")
          .eq("id", id)
          .maybeSingle();

        if (!error && rec) {
          page = rec as CmsPage;
        }
      }

      if (!page) {
        return { success: false, error: "Page not found." };
      }

      const settingsRes = await getCmsSiteSettings();
      return { success: true, page, settings: settingsRes.settings };
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

/**
 * Server function to upload a CMS image to Supabase Storage (Admin only - password gated).
 */
export const uploadCmsImage = createServerFn({ method: "POST" })
  .validator(
    (data: unknown): {
      fileName: string;
      contentType: string;
      base64Data: string;
      adminPassword?: string;
    } => {
      if (!data || typeof data !== "object") {
        throw new Error("Invalid request payload.");
      }
      const d = data as Record<string, unknown>;
      return {
        fileName: String(d.fileName || "image.jpg"),
        contentType: String(d.contentType || "image/jpeg"),
        base64Data: String(d.base64Data || ""),
        adminPassword: typeof d.adminPassword === "string" ? d.adminPassword : "",
      };
    },
  )
  .handler(async ({ data: payload }) => {
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractAdminPassword(payload.adminPassword);

    if (!isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const { fileName, contentType, base64Data } = payload;
    if (!base64Data) {
      return { success: false, error: "No image file data provided." };
    }

    const client = getSupabaseServerClient();
    if (!client) {
      if (isDev) {
        return {
          success: true,
          url: `/assets/placeholder-${Date.now()}.jpg`,
        };
      }
      return {
        success: false,
        error: "Supabase client is not configured for file uploads.",
      };
    }

    try {
      const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const uniquePath = `cms/${Date.now()}-${cleanName}`;
      const buffer = Buffer.from(base64Data, "base64");

      const bucketName = "event-images";
      const { error: uploadError } = await client.storage
        .from(bucketName)
        .upload(uniquePath, buffer, {
          contentType: contentType || "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("[Supabase Storage] CMS Image upload error:", uploadError.message);
        return { success: false, error: uploadError.message };
      }

      const { data } = client.storage.from(bucketName).getPublicUrl(uniquePath);
      return { success: true, url: data.publicUrl };
    } catch (err: any) {
      console.error("[Supabase Storage] CMS Image upload exception:", err.message);
      return { success: false, error: err.message || "Failed to upload image." };
    }
  });

// In-memory cache for site settings
let cachedSiteSettings: { settings: CmsSiteSettings; cachedAt: number } | null = null;
const SETTINGS_CACHE_TTL_MS = 45 * 1000;

export function invalidateSiteSettingsCache() {
  cachedSiteSettings = null;
}

/**
 * Public Server Function to get Global Site Settings (Header, Footer, Navigation).
 * Usable on public SSR pages.
 */
export const getCmsSiteSettings = createServerFn({ method: "GET" })
  .handler(async (): Promise<{ settings: CmsSiteSettings; error?: string | null }> => {
    const now = Date.now();
    if (cachedSiteSettings && now - cachedSiteSettings.cachedAt < SETTINGS_CACHE_TTL_MS) {
      return { settings: cachedSiteSettings.settings, error: null };
    }

    const client = getSupabaseServerClient();
    if (!client) {
      return { settings: DEFAULT_SITE_SETTINGS, error: null };
    }

    try {
      // 1. Try reading from cms_settings table
      const { data: sData, error: sErr } = await client
        .from("cms_settings")
        .select("data")
        .eq("key", "global_site_settings")
        .maybeSingle();

      if (sData?.data && typeof sData.data === "object" && Object.keys(sData.data).length > 0) {
        const settings = sData.data as CmsSiteSettings;
        cachedSiteSettings = { settings, cachedAt: now };
        return { settings, error: null };
      }

      // 2. Try reading from cms_pages table fallback (slug = '__site_settings__')
      const { data: pData } = await client
        .from("cms_pages")
        .select("data")
        .eq("slug", "__site_settings__")
        .maybeSingle();

      if (pData?.data && typeof pData.data === "object" && (pData.data as any).settings) {
        const settings = (pData.data as any).settings as CmsSiteSettings;
        cachedSiteSettings = { settings, cachedAt: now };
        return { settings, error: null };
      }

      // 3. Fallback to rich default site settings
      cachedSiteSettings = { settings: DEFAULT_SITE_SETTINGS, cachedAt: now };
      return { settings: DEFAULT_SITE_SETTINGS, error: null };
    } catch (err: any) {
      console.warn("[CMS Settings] Failed to load settings from DB, using defaults:", err.message);
      return { settings: DEFAULT_SITE_SETTINGS, error: null };
    }
  });

/**
 * Server Function to Save Global Site Settings (Admin only - password gated).
 */
export const saveCmsSiteSettings = createServerFn({ method: "POST" })
  .validator((data: unknown): { settings: CmsSiteSettings; adminPassword?: string } => {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid request payload.");
    }
    const d = data as Record<string, unknown>;
    return {
      settings: d.settings as CmsSiteSettings,
      adminPassword: extractAdminPassword(d.adminPassword || d),
    };
  })
  .handler(async ({ data: payload }): Promise<{ success: boolean; error?: string; settings?: CmsSiteSettings }> => {
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = payload.adminPassword;

    if (!isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const validation = validateSiteSettings(payload.settings);
    if (!validation.valid) {
      return { success: false, error: validation.error || "Invalid settings payload." };
    }

    const client = getSupabaseServerClient();
    if (!client) {
      if (isDev) {
        cachedSiteSettings = { settings: payload.settings, cachedAt: Date.now() };
        return { success: true, settings: payload.settings };
      }
      return { success: false, error: "Database client unavailable." };
    }

    try {
      const now = new Date().toISOString();

      // Save to cms_settings table if available
      try {
        await client
          .from("cms_settings")
          .upsert({
            key: "global_site_settings",
            data: payload.settings,
            updated_at: now,
          });
      } catch (e) {
        // Table may not exist yet, fallback to cms_pages
      }

      // Mirror to cms_pages table where slug = '__site_settings__' for guaranteed persistence
      await client
        .from("cms_pages")
        .upsert(
          {
            slug: "__site_settings__",
            title: "Global Site Settings",
            data: { settings: payload.settings },
            status: "published",
            updated_at: now,
          },
          { onConflict: "slug" }
        );

      invalidateSiteSettingsCache();
      cachedSiteSettings = { settings: payload.settings, cachedAt: Date.now() };
      return { success: true, settings: payload.settings };
    } catch (err: any) {
      console.error("[CMS Settings] Save exception:", err.message);
      return { success: false, error: err.message || "Failed to save site settings." };
    }
  });


