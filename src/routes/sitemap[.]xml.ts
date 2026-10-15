import { createFileRoute } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/data/blogPosts";
import { RESOURCE_POSTS } from "@/data/resourcePosts";
import { getCmsPagesList } from "@/lib/cms.server";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const siteUrl = (process.env.SITE_URL || "https://www.smgaba.com").replace(/\/+$/, "");

        const staticRoutes = [
          "",
          "/about-us",
          "/contact",
          "/careers",
          "/events",
          "/testimonials",
          "/bookanappointment",
          "/privacy-policy",
          "/new-york-city-location",
          "/islandia-location",
          "/florida-location",
          "/industries",
          "/construction",
          "/healthcare",
          "/hospitality",
          "/legal-professionals",
          "/manufacturers",
          "/real-estate",
          "/retail",
          "/automotive",
          "/solutions",
          "/solutions/bookkeeping",
          "/solutions/cfo-advisory-services",
          "/solutions/tax",
          "/wealth-management",
          "/blog",
          "/resources",
        ];

        const urls: Array<{ loc: string; changefreq: string; priority: string }> = [];

        // 1. Static Core Pages
        for (const route of staticRoutes) {
          const loc = `${siteUrl}${route}`;
          let priority = "0.8";
          if (route === "") priority = "1.0";
          else if (route.startsWith("/solutions") || route === "/wealth-management") priority = "0.9";
          else if (route === "/privacy-policy") priority = "0.3";

          urls.push({
            loc,
            changefreq: route === "" || route.startsWith("/solutions") ? "weekly" : "monthly",
            priority,
          });
        }

        // 2. Blog Posts
        for (const post of BLOG_POSTS) {
          if (!post.archived && post.slug) {
            urls.push({
              loc: `${siteUrl}/blog/${post.slug}`,
              changefreq: "monthly",
              priority: "0.7",
            });
          }
        }

        // 3. Resource Posts
        for (const post of RESOURCE_POSTS) {
          if (!post.archived && post.slug) {
            urls.push({
              loc: `${siteUrl}/resources/${post.slug}`,
              changefreq: "monthly",
              priority: "0.6",
            });
          }
        }

        // 4. Published CMS Pages
        try {
          const cmsData = await getCmsPagesList();
          if (cmsData?.pages) {
            for (const page of cmsData.pages) {
              if (page.status === "published" && page.slug && !page.slug.startsWith("__")) {
                const clean = page.slug.replace(/^\/+/, "");
                // Ensure it's not one of our static routes or reserved paths
                if (!staticRoutes.includes(`/${clean}`)) {
                  urls.push({
                    loc: `${siteUrl}/${clean}`,
                    changefreq: "weekly",
                    priority: "0.8",
                  });
                }
              }
            }
          }
        } catch (err) {
          console.warn("[sitemap.xml] Error fetching CMS pages:", err);
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`.trim();

        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
