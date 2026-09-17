import { createServerFn } from "@tanstack/react-start";
import {
  fetchAllEvents,
  upsertEventRecord,
  deleteEventRecord,
  uploadEventImage,
  type EventItem,
} from "./events.server";
import { getEnvVar } from "./supabase.server";
import { verifyAdminPassword } from "./webinar-redirects";

export type { EventItem };
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
 * Server function to fetch all events for the admin panel.
 */
export const getEventsAdminList = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ events: EventItem[]; isConfigured: boolean }> => {
    const events = await fetchAllEvents();
    const isConfigured = Boolean(
      getEnvVar("SUPABASE_URL") &&
        (getEnvVar("SUPABASE_SERVICE_ROLE_KEY") || getEnvVar("SUPABASE_SERVICE_KEY"))
    );
    return { events, isConfigured };
  }
);

/**
 * Server function to save or update an event (password gated).
 */
export const saveEvent = createServerFn({ method: "POST" })
  .validator((data: any) => {
    const payload = data && typeof data === "object" && data.data ? data.data : data;
    return payload;
  })
  .handler(async ({ data }) => {
    const payload = data || {};
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractString(payload.adminPassword);

    if (expectedPassword && !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const eventData: Partial<EventItem> & { id: string } = {
      id: String(payload.id || ""),
      title: String(payload.title || ""),
      subtitle: payload.subtitle ? String(payload.subtitle) : null,
      host: String(payload.host || ""),
      host_title: payload.host_title ? String(payload.host_title) : null,
      event_date: String(payload.event_date || ""),
      time_range: String(payload.time_range || ""),
      description: String(payload.description || ""),
      registration_link: String(payload.registration_link || ""),
      recording_link:
        payload.recording_link !== undefined
          ? payload.recording_link
            ? String(payload.recording_link)
            : null
          : undefined,
      thumbnail_url:
        payload.thumbnail_url !== undefined
          ? payload.thumbnail_url
            ? String(payload.thumbnail_url)
            : null
          : undefined,
    };

    return await upsertEventRecord(eventData);
  });

/**
 * Server function to delete an event by ID (password gated).
 */
export const removeEvent = createServerFn({ method: "POST" })
  .validator((data: any) => {
    const payload = data && typeof data === "object" && data.data ? data.data : data;
    return payload;
  })
  .handler(async ({ data }) => {
    const payload = data || {};
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractString(payload.adminPassword);

    if (expectedPassword && !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const id = String(payload.id || "");
    return await deleteEventRecord(id);
  });

/**
 * Server function to upload an event thumbnail image (password gated).
 */
export const uploadEventThumbnail = createServerFn({ method: "POST" })
  .validator((data: any) => {
    const payload = data && typeof data === "object" && data.data ? data.data : data;
    return payload;
  })
  .handler(async ({ data }) => {
    const payload = data || {};
    const expectedPassword = getEnvVar("INTERNAL_ADMIN_PASSWORD");
    const inputPassword = extractString(payload.adminPassword);

    if (expectedPassword && !isAuthorized(inputPassword, expectedPassword)) {
      return { success: false, error: "Unauthorized: Invalid admin password." };
    }

    const fileName = String(payload.fileName || "thumbnail.jpg");
    const contentType = String(payload.contentType || "image/jpeg");
    const base64Data = String(payload.base64Data || "");

    if (!base64Data) {
      return { success: false, error: "No image file data provided." };
    }

    return await uploadEventImage(fileName, contentType, base64Data);
  });

/**
 * Public server function to fetch events for the /events route (no password required).
 */
export const getPublicEventsFeed = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ events: EventItem[] }> => {
    const events = await fetchAllEvents();
    return { events };
  }
);
