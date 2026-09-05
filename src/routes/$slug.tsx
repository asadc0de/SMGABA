import { createFileRoute, redirect, notFound, isRedirect } from "@tanstack/react-router";
import { getBlogPostBySlug, BLOG_POSTS } from "@/data/blogPosts";
import { LEGACY_BLOG_SLUGS, STALE_SITEMAP_REDIRECTS } from "@/data/legacyRedirects";
import { WEBINAR_REDIRECTS } from "@/data/webinarRedirects";
import { resolveWebinarSlug } from "@/lib/webinar-redirects";
import { BlogPostView } from "@/components/site/BlogPostView";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

export const Route = createFileRoute("/$slug")({
  beforeLoad: async ({ params }) => {
    // 1. Skip static assets, favicon, system paths
    if (params.slug.includes(".") || params.slug === "internal" || params.slug === "tools") {
      return;
    }

    // 2. If this slug is a known legacy blog post, 301 to the canonical /blog/<slug> URL.
    // Old WordPress site served posts at root level; new site serves them under /blog/.
    if (LEGACY_BLOG_SLUGS.has(params.slug)) {
      throw redirect({ to: `/blog/${params.slug}`, statusCode: 301 });
    }

    // 3. Check stale sitemap static fallback redirects if any
    if (STALE_SITEMAP_REDIRECTS && STALE_SITEMAP_REDIRECTS[params.slug]) {
      throw redirect({ to: STALE_SITEMAP_REDIRECTS[params.slug], statusCode: 301 });
    }

    // 4. Check static webinar redirect fallback
    if (WEBINAR_REDIRECTS && WEBINAR_REDIRECTS[params.slug]) {
      throw redirect({ href: WEBINAR_REDIRECTS[params.slug], statusCode: 301 });
    }

    // 3. Check dynamic webinar redirect from Supabase
    try {
      const webinarTarget = await resolveWebinarSlug({ data: params.slug });
      if (webinarTarget) {
        if (webinarTarget.startsWith("http://") || webinarTarget.startsWith("https://")) {
          throw redirect({ href: webinarTarget, statusCode: 301 });
        } else {
          throw redirect({ to: webinarTarget, statusCode: 301 });
        }
      }
    } catch (err) {
      // If it's a redirect, rethrow it
      if (isRedirect(err)) {
        throw err;
      }
      // Otherwise log and allow falling through to blog/not found
      console.warn(`[webinar-redirect] lookup skipped for "${params.slug}":`, err);
    }
  },
  head: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) {
      return {
        meta: [{ title: "Page Not Found | SMG ABA" }],
      };
    }
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:image", content: post.image },
      ],
    };
  },
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    return { post };
  },
  component: DynamicSlugPage,
});

function DynamicSlugPage() {
  const { post } = Route.useLoaderData();

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header />
        <main className="py-32 px-6 text-center">
          <div className="mx-auto max-w-md card-surface p-10">
            <BookOpen className="mx-auto size-12 text-muted-foreground" />
            <h1 className="mt-4 font-serif-hero text-2xl font-bold text-navy">Page Not Found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The article or page you are looking for does not exist or has been moved.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <a href="/blog">
                  <ArrowLeft className="mr-2 size-4" /> View Blog
                </a>
              </Button>
              <Button asChild className="rounded-full bg-navy text-white hover:bg-navy/90">
                <a href="/">Go to Homepage</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <BlogPostView post={post} />;
}
