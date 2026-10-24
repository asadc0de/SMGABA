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
            if (id.includes("blogPosts")) {
              return "blog-posts-data";
            }
            if (id.includes("resourcePosts")) {
              return "resource-posts-data";
            }
            if (id.includes("node_modules")) {
              if (id.includes("@puckeditor")) {
                return "puck-vendor";
              }
              if (id.includes("lucide-react")) {
                return "icons-vendor";
              }
              if (id.includes("@radix-ui")) {
                return "ui-vendor";
              }
              if (id.includes("recharts")) {
                return "charts-vendor";
              }
            }
          },
        },
      },
    },
  },
});
