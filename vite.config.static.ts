import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

function generateStaticDist(root: string) {
  const publicDir = path.resolve(root, ".output/public");
  const targetDir = path.resolve(root, "static-dist");

  if (!fs.existsSync(publicDir)) {
    console.warn(`[build:static] .output/public not found at ${publicDir}`);
    return;
  }

  // 1. Prepare clean static-dist/ directory
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDir, { recursive: true });

  // 2. Recursively copy all files from .output/public into static-dist
  fs.cpSync(publicDir, targetDir, { recursive: true });

  // 3. Locate compiled asset bundles in static-dist/assets
  const assetsDir = path.resolve(targetDir, "assets");
  let indexJs = "";
  const cssFiles: string[] = [];

  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir);
    for (const f of assetFiles) {
      if (f.startsWith("index-") && f.endsWith(".js")) {
        indexJs = f;
      }
      if (f.endsWith(".css")) {
        cssFiles.push(f);
      }
    }
  }

  // 4. Generate static entry index.html for GoDaddy cPanel
  const cssLinks = cssFiles
    .map((css) => `    <link rel="stylesheet" href="/assets/${css}" />`)
    .join("\n");
  const jsScript = indexJs
    ? `    <script type="module" src="/assets/${indexJs}"></script>`
    : "";

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SMG ABA | Accounting, Bookkeeping & Advisory</title>
    <meta
      name="description"
      content="SMG is a full-service accounting, bookkeeping, and advisory firm serving hospitality, real estate, and small business owners across NY and FL."
    />
    <meta name="author" content="SMG ABA" />
    <meta property="og:title" content="SMG ABA | Accounting, Bookkeeping & Advisory" />
    <meta
      property="og:description"
      content="Building relationships with passion, care & responsiveness. Outsourced bookkeeping, CFO advisory, tax services and back office support."
    />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/images/blog/smg-wallpaper.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@SMGABALLC" />
    <meta name="twitter:image" content="/images/blog/smg-wallpaper.jpg" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon.svg" />
    <link
      rel="preload"
      href="/fonts/PlayfairDisplay-700-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin="anonymous"
    />
    <!-- Google Tag Manager -->
    <script>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-NM3WDPXD');
    </script>
${cssLinks}
  </head>
  <body suppressHydrationWarning>
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-NM3WDPXD"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      ></iframe>
    </noscript>
    <div id="root"></div>
${jsScript}
  </body>
</html>
`;

  fs.writeFileSync(path.resolve(targetDir, "index.html"), indexHtml, "utf-8");

  // 5. Write .htaccess for Apache / GoDaddy cPanel SPA fallback
  const htaccess = `Options -MultiViews

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule ^(.*)$ index.html [L]
</IfModule>
`;
  fs.writeFileSync(path.resolve(targetDir, ".htaccess"), htaccess, "utf-8");

  console.log(`\n\x1b[32m✔ [build:static] Generated static-dist/ successfully for GoDaddy cPanel.\x1b[0m`);
  console.log(`  - Entry: static-dist/index.html`);
  console.log(`  - Server Config: static-dist/.htaccess`);
  console.log(`  - Assets: static-dist/assets/ (${fs.readdirSync(assetsDir).length} files)\n`);
}

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    routeRules: {
      "/assets/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/fonts/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      "/images/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
    },
    hooks: {
      compiled: async () => {
        generateStaticDist(process.cwd());
      },
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

