import { getSupabaseServerClient } from "./supabase.server";
import {
  ONBOARDING_GUIDES,
  type OfficeKey,
  type OnboardingGuide,
  isOfficeKey,
} from "../data/onboardingGuides";

export interface OnboardingVersionSummary {
  id: number;
  office: OfficeKey;
  created_at: string;
}

// In-memory fallback cache for development or when Supabase is temporarily unreachable
const localFallbackGuides = new Map<OfficeKey, OnboardingGuide>();
const localFallbackVersions = new Map<OfficeKey, Array<{ id: number; office: OfficeKey; content: OnboardingGuide; created_at: string }>>();

/**
 * Fetches an onboarding guide by office ('ny' or 'fl').
 * Attempts to read from Supabase; falls back gracefully to in-memory or static file.
 * Guaranteed to never crash or return empty for a valid office key.
 */
export async function getOnboardingGuide(office: string): Promise<OnboardingGuide> {
  const normalizedOffice: OfficeKey = isOfficeKey(office) ? (office as OfficeKey) : "ny";

  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("onboarding_guides")
        .select("content")
        .eq("office", normalizedOffice)
        .maybeSingle();

      if (!error && data?.content && typeof data.content === "object") {
        return data.content as OnboardingGuide;
      }
      if (error) {
        console.warn(`[Onboarding] Error reading guide for '${normalizedOffice}' from Supabase:`, error.message);
      }
    } catch (err) {
      console.warn(`[Onboarding] Exception reading guide for '${normalizedOffice}':`, err);
    }
  }

  // Check in-memory fallback
  if (localFallbackGuides.has(normalizedOffice)) {
    return localFallbackGuides.get(normalizedOffice)!;
  }

  // Fallback to static seed
  return ONBOARDING_GUIDES[normalizedOffice];
}

/**
 * Saves an onboarding guide to Supabase, creates a version snapshot,
 * and maintains the last 20 versions per office.
 */
export async function saveGuideRecord(
  office: OfficeKey,
  content: OnboardingGuide,
): Promise<{ success: boolean; error?: string }> {
  // Always update in-memory store
  localFallbackGuides.set(office, content);

  const fallbackList = localFallbackVersions.get(office) || [];
  const nextId = fallbackList.length > 0 ? Math.max(...fallbackList.map((v) => v.id)) + 1 : 1;
  fallbackList.unshift({
    id: nextId,
    office,
    content,
    created_at: new Date().toISOString(),
  });
  if (fallbackList.length > 20) {
    fallbackList.splice(20);
  }
  localFallbackVersions.set(office, fallbackList);

  const client = await getSupabaseServerClient();
  if (!client) {
    return {
      success: true,
      error: "Saved locally (Supabase is not configured or offline).",
    };
  }

  try {
    // 1. Upsert into onboarding_guides
    const { error: upsertError } = await client
      .from("onboarding_guides")
      .upsert(
        {
          office,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "office" },
      );

    if (upsertError) {
      console.error("[Onboarding] Error upserting guide:", upsertError.message);
      return { success: false, error: upsertError.message };
    }

    // 2. Insert into onboarding_guide_versions
    const { error: versionError } = await client
      .from("onboarding_guide_versions")
      .insert({
        office,
        content,
        created_at: new Date().toISOString(),
      });

    if (versionError) {
      console.warn("[Onboarding] Warning: Failed to record version history:", versionError.message);
    }

    // 3. Prune old versions (keep only latest 20)
    try {
      const { data: excessVersions } = await client
        .from("onboarding_guide_versions")
        .select("id")
        .eq("office", office)
        .order("created_at", { ascending: false })
        .range(20, 100);

      if (excessVersions && excessVersions.length > 0) {
        const idsToRemove = excessVersions.map((v) => v.id);
        await client
          .from("onboarding_guide_versions")
          .delete()
          .in("id", idsToRemove);
      }
    } catch (pruneErr) {
      console.warn("[Onboarding] Version pruning error (ignored):", pruneErr);
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Onboarding] Exception in saveGuideRecord:", err);
    return { success: false, error: err.message || "Failed to save guide." };
  }
}

/**
 * Lists the latest 20 versions for the given office.
 */
export async function listGuideVersions(
  office: OfficeKey,
): Promise<{ versions: OnboardingVersionSummary[]; error?: string }> {
  const client = await getSupabaseServerClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("onboarding_guide_versions")
        .select("id, office, created_at")
        .eq("office", office)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        return { versions: data as OnboardingVersionSummary[] };
      }
      if (error) {
        console.warn("[Onboarding] Error listing versions:", error.message);
      }
    } catch (err: any) {
      console.warn("[Onboarding] Exception listing versions:", err);
    }
  }

  // Fallback to in-memory versions
  const fallback = localFallbackVersions.get(office) || [];
  return {
    versions: fallback.map((v) => ({
      id: v.id,
      office: v.office,
      created_at: v.created_at,
    })),
  };
}

/**
 * Restores a specific version of a guide.
 */
export async function restoreGuideVersion(
  office: OfficeKey,
  versionId: number,
): Promise<{ success: boolean; guide?: OnboardingGuide; error?: string }> {
  const client = await getSupabaseServerClient();
  let restoredContent: OnboardingGuide | null = null;

  if (client) {
    try {
      const { data, error } = await client
        .from("onboarding_guide_versions")
        .select("content")
        .eq("id", versionId)
        .eq("office", office)
        .maybeSingle();

      if (!error && data?.content) {
        restoredContent = data.content as OnboardingGuide;
      }
    } catch (err: any) {
      console.error("[Onboarding] Error restoring version from Supabase:", err);
    }
  }

  if (!restoredContent) {
    // Check fallback
    const fallbackList = localFallbackVersions.get(office) || [];
    const item = fallbackList.find((v) => v.id === versionId);
    if (item) {
      restoredContent = item.content;
    }
  }

  if (!restoredContent) {
    return { success: false, error: "Version not found." };
  }

  const saveRes = await saveGuideRecord(office, restoredContent);
  if (!saveRes.success) {
    return { success: false, error: saveRes.error };
  }

  return { success: true, guide: restoredContent };
}

/**
 * Resets a guide to the static default seed file.
 */
export async function resetGuideToDefault(
  office: OfficeKey,
): Promise<{ success: boolean; guide: OnboardingGuide; error?: string }> {
  const defaultGuide = ONBOARDING_GUIDES[office];
  const saveRes = await saveGuideRecord(office, defaultGuide);
  if (!saveRes.success) {
    return { success: false, guide: defaultGuide, error: saveRes.error };
  }
  return { success: true, guide: defaultGuide };
}

