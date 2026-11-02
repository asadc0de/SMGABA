import { createServerFn } from "@tanstack/react-start";
import { getEnvVar } from "./supabase.server";
import { verifyAdminPassword } from "./webinar-redirects";
import {
  getOnboardingGuide,
  saveGuideRecord,
  listGuideVersions,
  restoreGuideVersion,
  resetGuideToDefault,
  type OnboardingVersionSummary,
} from "./onboarding-guides.server";
import {
  type OfficeKey,
  type OnboardingGuide,
  type OnboardingProvider,
  isOfficeKey,
} from "../data/onboardingGuides";

export { verifyAdminPassword };

/**
 * Helper to safely extract string values from nested TanStack Start parameters.
 */
function extractString(val: any): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    if (typeof val.password === "string") return val.password;
    if (typeof val.adminPassword === "string") return val.adminPassword;
    if (typeof val.data === "string") return val.data;
    if (val.data && typeof val.data === "object") {
      if (typeof val.data.adminPassword === "string") return val.data.adminPassword;
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

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aLen = a.length;
  const bLen = b.length;
  let result = aLen ^ bLen;
  for (let i = 0; i < Math.max(aLen, bLen); i++) {
    const charA = i < aLen ? a.charCodeAt(i) : 0;
    const charB = i < bLen ? b.charCodeAt(i) : 0;
    result |= charA ^ charB;
  }
  return result === 0;
}

/**
 * Strict fail-closed authorization check.
 * If INTERNAL_ADMIN_PASSWORD is missing or unset, ALWAYS returns false.
 */
function isAuthorized(inputPw?: string, expectedPw?: string): boolean {
  if (!expectedPw) return false; // FAIL CLOSED
  const cleanInput = cleanPw(inputPw || "");
  const cleanExpected = cleanPw(expectedPw);
  if (!cleanInput || !cleanExpected) return false;
  return constantTimeEqual(cleanInput, cleanExpected);
}

/**
 * Validates the OnboardingGuide payload structure and content.
 */
function validateGuidePayload(data: any): { valid: boolean; error?: string; guide?: OnboardingGuide } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Guide payload is missing or invalid." };
  }

  const office = String(data.office || "").toLowerCase();
  if (office !== "ny" && office !== "fl") {
    return { valid: false, error: "Office must be 'ny' or 'fl'." };
  }

  const welcomeTitle = String(data.welcomeTitle || "").trim();
  if (!welcomeTitle || welcomeTitle.length > 200) {
    return { valid: false, error: "Welcome title must be between 1 and 200 characters." };
  }

  const pageTitle = String(data.pageTitle || "").trim();
  if (!pageTitle || pageTitle.length > 200) {
    return { valid: false, error: "Page title must be between 1 and 200 characters." };
  }

  const subtitle = String(data.subtitle || "").trim();
  if (!subtitle || subtitle.length > 500) {
    return { valid: false, error: "Subtitle must be between 1 and 500 characters." };
  }

  const label = String(data.label || (office === "ny" ? "New York" : "Florida")).trim();

  // Validate intro paragraphs
  if (!Array.isArray(data.introParagraphs) || data.introParagraphs.length === 0) {
    return { valid: false, error: "At least one intro paragraph is required." };
  }
  const introParagraphs = data.introParagraphs
    .map((p: any) => String(p || "").trim())
    .filter(Boolean);
  if (introParagraphs.length === 0) {
    return { valid: false, error: "Intro paragraphs cannot be blank." };
  }

  // Validate before you begin
  if (!Array.isArray(data.beforeYouBegin)) {
    return { valid: false, error: "Before You Begin must be an array of instructions." };
  }
  const beforeYouBegin = data.beforeYouBegin
    .map((b: any) => String(b || "").trim())
    .filter(Boolean);

  // Validate guest info
  const guestInfo = data.guestInfo || {};
  if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
    return { valid: false, error: "Guest name, email, and phone are required." };
  }

  // Validate sections: bank, payroll, pos
  if (!data.sections || typeof data.sections !== "object") {
    return { valid: false, error: "Sections object is required." };
  }

  const allowedSectionIds = ["bank", "payroll", "pos"] as const;
  const sections: any = {};
  const allProviderSlugs = new Set<string>();

  for (const sId of allowedSectionIds) {
    const section = data.sections[sId];
    if (!section || typeof section !== "object") {
      return { valid: false, error: `Section '${sId}' is missing.` };
    }

    const title = String(section.title || "").trim();
    const shortTitle = String(section.shortTitle || "").trim();
    if (!title || !shortTitle) {
      return { valid: false, error: `Section '${sId}' requires title and shortTitle.` };
    }

    if (!Array.isArray(section.providers)) {
      return { valid: false, error: `Section '${sId}' providers must be an array.` };
    }

    const validatedProviders: OnboardingProvider[] = [];

    for (let i = 0; i < section.providers.length; i++) {
      const p = section.providers[i];
      if (!p || typeof p !== "object") {
        return { valid: false, error: `Invalid provider item in section '${sId}' at index ${i}.` };
      }

      const id = String(p.id || "")
        .toLowerCase()
        .trim();
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!id || !slugRegex.test(id)) {
        return {
          valid: false,
          error: `Provider ID '${id}' in section '${sId}' must be a valid lowercase URL-safe slug (e.g. 'chase-bank').`,
        };
      }

      if (allProviderSlugs.has(id)) {
        return {
          valid: false,
          error: `Duplicate provider ID '${id}' found in section '${sId}'. Provider IDs must be unique.`,
        };
      }
      allProviderSlugs.add(id);

      const name = String(p.name || "").trim();
      if (!name || name.length > 150) {
        return {
          valid: false,
          error: `Provider name '${name}' must be between 1 and 150 characters.`,
        };
      }

      if (!Array.isArray(p.steps) || p.steps.length === 0) {
        return {
          valid: false,
          error: `Provider '${name}' must have at least one step.`,
        };
      }

      const steps = p.steps
        .map((step: any) => String(step || "").trim())
        .filter(Boolean);
      if (steps.length === 0) {
        return {
          valid: false,
          error: `Provider '${name}' steps cannot be empty.`,
        };
      }

      const notes = Array.isArray(p.notes)
        ? p.notes.map((n: any) => String(n || "").trim()).filter(Boolean)
        : undefined;

      const requiredAccess = Array.isArray(p.requiredAccess)
        ? p.requiredAccess.map((a: any) => String(a || "").trim()).filter(Boolean)
        : undefined;

      validatedProviders.push({
        id,
        name,
        steps,
        ...(notes && notes.length > 0 ? { notes } : {}),
        ...(requiredAccess && requiredAccess.length > 0 ? { requiredAccess } : {}),
      });
    }

    sections[sId] = {
      id: sId,
      title,
      shortTitle,
      ...(section.intro ? { intro: String(section.intro).trim() } : {}),
      providers: validatedProviders,
    };
  }

  const completionNote = String(data.completionNote || "").trim();

  const validatedGuide: OnboardingGuide = {
    office: office as OfficeKey,
    label,
    welcomeTitle,
    pageTitle,
    subtitle,
    introParagraphs,
    beforeYouBegin,
    guestInfo: {
      name: String(guestInfo.name || "").trim(),
      email: String(guestInfo.email || "").trim(),
      phone: String(guestInfo.phone || "").trim(),
      usernameHint: String(guestInfo.usernameHint || "").trim(),
      quickBooksOnline: String(guestInfo.quickBooksOnline || "").trim(),
      qboEmail: guestInfo.qboEmail ? String(guestInfo.qboEmail).trim() : undefined,
      helpfulTip: guestInfo.helpfulTip ? String(guestInfo.helpfulTip).trim() : undefined,
    },
    sections,
    completionNote,
  };

  return { valid: true, guide: validatedGuide };
}

/**
 * Public server function to fetch an onboarding guide by office.
 */
export const getPublicOnboardingGuide = createServerFn({ method: "POST" })
  .validator((input: any) => {
    const office = typeof input === "string" ? input : input?.office || input?.data?.office || input?.data;
    return String(office || "ny").toLowerCase();
  })
  .handler(async ({ data: office }) => {
    const validOffice: OfficeKey = isOfficeKey(office) ? (office as OfficeKey) : "ny";
    const guide = await getOnboardingGuide(validOffice);
    return { office: validOffice, guide };
  });

/**
 * Admin server function to fetch both NY & FL onboarding guides.
 */
export const getOnboardingAdminData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    guides: Record<OfficeKey, OnboardingGuide>;
    isConfigured: boolean;
  }> => {
    const ny = await getOnboardingGuide("ny");
    const fl = await getOnboardingGuide("fl");
    const isConfigured = Boolean(
      getEnvVar("SUPABASE_URL") &&
      (getEnvVar("SUPABASE_SERVICE_ROLE_KEY") || getEnvVar("SUPABASE_SERVICE_KEY")),
    );
    return {
      guides: { ny, fl },
      isConfigured,
    };
  },
);

/**
 * Admin server function to save an onboarding guide (password-gated, fail-closed).
 */
export const saveOnboardingGuideAdmin = createServerFn({ method: "POST" })
  .validator((data: any) => {
    const payload = data && typeof data === "object" && data.data ? data.data : data;
    return payload;
  })
  .handler(async ({ data }) => {
    const payload = data || {};
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractString(payload.adminPassword);

    if (!expectedPassword) {
      return { success: false, error: "Unauthorized: Admin password not configured on server." };
    }
    if (!isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const { valid, error, guide } = validateGuidePayload(payload.guide);
    if (!valid || !guide) {
      return { success: false, error: error || "Invalid guide payload." };
    }

    const saveRes = await saveGuideRecord(guide.office, guide);
    return saveRes;
  });

/**
 * Admin server function to list the last 20 saved versions of a guide (password-gated).
 */
export const listOnboardingVersionsAdmin = createServerFn({ method: "POST" })
  .validator((data: any) => {
    const payload = data && typeof data === "object" && data.data ? data.data : data;
    return payload;
  })
  .handler(async ({ data }) => {
    const payload = data || {};
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractString(payload.adminPassword);

    if (!expectedPassword || !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized.", versions: [] };
    }

    const office = String(payload.office || "").toLowerCase() as OfficeKey;
    if (!isOfficeKey(office)) {
      return { success: false, error: "Invalid office key.", versions: [] };
    }

    const res = await listGuideVersions(office);
    return { success: true, versions: res.versions };
  });

/**
 * Admin server function to restore an onboarding guide to an earlier version (password-gated).
 */
export const restoreOnboardingVersionAdmin = createServerFn({ method: "POST" })
  .validator((data: any) => {
    const payload = data && typeof data === "object" && data.data ? data.data : data;
    return payload;
  })
  .handler(async ({ data }) => {
    const payload = data || {};
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractString(payload.adminPassword);

    if (!expectedPassword || !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized." };
    }

    const office = String(payload.office || "").toLowerCase() as OfficeKey;
    const versionId = Number(payload.versionId);
    if (!isOfficeKey(office) || !versionId || isNaN(versionId)) {
      return { success: false, error: "Invalid office or version ID." };
    }

    const res = await restoreGuideVersion(office, versionId);
    return res;
  });

/**
 * Admin server function to reset an onboarding guide back to the static file defaults (password-gated).
 */
export const resetOnboardingToDefaultAdmin = createServerFn({ method: "POST" })
  .validator((data: any) => {
    const payload = data && typeof data === "object" && data.data ? data.data : data;
    return payload;
  })
  .handler(async ({ data }) => {
    const payload = data || {};
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractString(payload.adminPassword);

    if (!expectedPassword || !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized." };
    }

    const office = String(payload.office || "").toLowerCase() as OfficeKey;
    if (!isOfficeKey(office)) {
      return { success: false, error: "Invalid office key." };
    }

    const res = await resetGuideToDefault(office);
    return res;
  });

