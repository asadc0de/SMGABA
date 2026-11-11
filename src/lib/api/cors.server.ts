const defaultAllowedOrigins = new Set([
   "http://localhost:4173",
  "http://localhost:5173",
  "https://smgaba.com",
  "https://www.smgaba.com",
  "https://smgaba.vercel.app",
  "https://smgaba-olive.vercel.app",
]);

function getAllowedOrigins(): Set<string> {
  const configuredOrigins = process.env["CORS_ALLOWED_ORIGINS"]
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set(configuredOrigins?.length ? configuredOrigins : defaultAllowedOrigins);
}

export function getPublicCorsHeaders(request: Request, methods = "GET, OPTIONS"): Headers {
  const headers = new Headers();
  const origin = request.headers.get("origin");

  if (origin && getAllowedOrigins().has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Methods", methods);
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }

  return headers;
}

export function publicJson(
  request: Request,
  body: unknown,
  init?: ResponseInit,
): Response {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  const corsHeaders = getPublicCorsHeaders(request);
  corsHeaders.forEach((value, key) => headers.set(key, value));
  return Response.json(body, { ...init, headers });
}

export function publicOptions(request: Request, methods = "GET, OPTIONS"): Response {
  const headers = getPublicCorsHeaders(request, methods);
  if (!headers.has("Access-Control-Allow-Origin")) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, { status: 204, headers });
}
