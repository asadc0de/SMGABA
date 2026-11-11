const configuredApiBaseUrl = import.meta.env["VITE_API_BASE_URL"]?.trim() ?? "";

export const API_BASE_URL = (
  configuredApiBaseUrl || "https://smgaba.vercel.app"
).replace(/\/+$/, "");

export function apiUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`, window.location.origin);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}
