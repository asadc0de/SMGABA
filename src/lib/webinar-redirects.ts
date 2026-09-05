import { createServerFn } from "@tanstack/react-start";
import {
  fetchAllWebinarRedirects,
  lookupWebinarRedirect,
  upsertWebinarRedirectRecord,
  deleteWebinarRedirectRecord,
  cleanSlug,
  cleanTargetUrl,
  getEnvVar,
  type WebinarRedirect,
} from "./supabase.server";

export type { WebinarRedirect };

/**
 * Robust helper to extract a string value regardless of whether TanStack Start
 * passes a raw string, `{ data: string }`, or `{ password: string }`.
 */
function extractStringValue(val: any): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    if (typeof val.password === "string") return val.password;
    if (typeof val.data === "string") return val.data;
    if (typeof val.slug === "string") return val.slug;
    if (typeof val.target_url === "string") return val.target_url;
    if (val.data && typeof val.data === "object") {
      if (typeof val.data.password === "string") return val.data.password;
      if (typeof val.data.data === "string") return val.data.data;
    }
  }
  return typeof val === "string" ? val : "";
}

function cleanPw(str: string): string {
  let s = (str || "").replace(/[\r\n]/g, "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

function isAuthorized(inputPw?: string, expectedPw?: string): boolean {
  if (!expectedPw) return true;
  return cleanPw(inputPw || "") === cleanPw(expectedPw);
}

/**
 * Validates whether the submitted password matches INTERNAL_ADMIN_PASSWORD.
 */
export const verifyAdminPassword = createServerFn({ method: "POST" })
  .validator((input: any) => {
    return extractStringValue(input);
  })
  .handler(async ({ data: inputPassword }) => {
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");

    // If no password set yet in environment, notify that configuration is required
    if (!expectedPassword) {
      return {
        authorized: false,
        error: "INTERNAL_ADMIN_PASSWORD is not configured in environment variables. Please set it in your .env file.",
      };
    }

    const rawInput = extractStringValue(inputPassword);
    const isMatch = isAuthorized(rawInput, expectedPassword);

    if (isMatch) {
      console.log("[Auth] Admin password verified successfully.");
      return { authorized: true };
    }

    const cleanInput = cleanPw(rawInput);
    const cleanExpected = cleanPw(expectedPassword);
    console.warn(
      `[Auth] Password mismatch (received length: ${cleanInput.length}, expected length: ${cleanExpected.length})`,
    );
    return { authorized: false, error: "Incorrect admin password." };
  });

/**
 * Server function to fetch all redirects.
 */
export const getWebinarRedirectsList = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ redirects: WebinarRedirect[]; isConfigured: boolean }> => {
    const redirects = await fetchAllWebinarRedirects();
    const isConfigured = Boolean(
      getEnvVar("SUPABASE_URL") &&
        (getEnvVar("SUPABASE_SERVICE_ROLE_KEY") || getEnvVar("SUPABASE_SERVICE_KEY")),
    );
    return { redirects, isConfigured };
  },
);

/**
 * Server function to create or update a webinar redirect record.
 */
export const saveWebinarRedirect = createServerFn({ method: "POST" })
  .validator((data: any) => {
    if (data && typeof data === "object") {
      const payload = data.data && typeof data.data === "object" ? data.data : data;
      return {
        slug: String(payload.slug || ""),
        target_url: String(payload.target_url || ""),
        adminPassword: extractStringValue(payload.adminPassword),
      };
    }
    return data;
  })
  .handler(async ({ data }) => {
    const payload = (data && data.slug !== undefined) ? data : (data?.data || {});
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractStringValue(payload.adminPassword);

    // Verify password if set
    if (expectedPassword && !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const slug = cleanSlug(payload.slug);
    const target_url = cleanTargetUrl(payload.target_url);

    if (!slug) {
      return { success: false, error: "Slug cannot be empty." };
    }
    if (!target_url) {
      return { success: false, error: "Target URL cannot be empty." };
    }

    return await upsertWebinarRedirectRecord(slug, target_url);
  });

/**
 * Server function to delete a redirect by slug.
 */
export const deleteWebinarRedirect = createServerFn({ method: "POST" })
  .validator((data: any) => {
    if (data && typeof data === "object") {
      const payload = data.data && typeof data.data === "object" ? data.data : data;
      return {
        slug: String(payload.slug || ""),
        adminPassword: extractStringValue(payload.adminPassword),
      };
    }
    return data;
  })
  .handler(async ({ data }) => {
    const payload = (data && data.slug !== undefined) ? data : (data?.data || {});
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractStringValue(payload.adminPassword);

    if (expectedPassword && !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const slug = cleanSlug(payload.slug);
    if (!slug) {
      return { success: false, error: "Slug cannot be empty." };
    }

    return await deleteWebinarRedirectRecord(slug);
  });

/**
 * Fast slug resolver for incoming SSR and routing requests.
 */
export const resolveWebinarSlug = createServerFn({ method: "GET" })
  .validator((slug: any) => {
    return extractStringValue(slug);
  })
  .handler(async ({ data: slug }) => {
    const rawSlug = extractStringValue(slug);
    return await lookupWebinarRedirect(rawSlug);
  });

