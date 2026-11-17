// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "x-content-type-options": "nosniff",
          "x-frame-options": "SAMEORIGIN",
          "referrer-policy": "strict-origin-when-cross-origin",
          "permissions-policy": "camera=(), microphone=(), geolocation=()",
          "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
          "content-security-policy":
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.chatbase.co https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss:; frame-src 'self' https://calendly.com https://*.calendly.com https://www.chatbase.co https://*.chatbase.co; object-src 'none'; base-uri 'self';",
        },
      },
      "/assets/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/fonts/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/images/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
    },
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, "/");
            if (normalizedId.includes("/data/blogPosts")) {
              return "blog-posts-data";
            }
            if (normalizedId.includes("/data/resourcePosts")) {
              return "resource-posts-data";
            }
          },
        },
      },
    },
  },
});
