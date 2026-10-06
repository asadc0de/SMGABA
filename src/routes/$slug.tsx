import { createFileRoute, redirect, notFound, isRedirect } from "@tanstack/react-router";
import { getBlogPostBySlug, type BlogPost } from "@/data/blogPosts";
import { LEGACY_BLOG_SLUGS, STALE_SITEMAP_REDIRECTS } from "@/data/legacyRedirects";
import { WEBINAR_REDIRECTS } from "@/data/webinarRedirects";
import { resolveWebinarSlug } from "@/lib/webinar-redirects";
import { lookupPublishedCmsPage, getCmsSiteSettings, type CmsPage } from "@/lib/cms.server";
import { type CmsSiteSettings } from "@/lib/cms-settings";
import { type CmsRootProps, isValidCanonicalUrl } from "@/cms/root";
import { isValidImageUrl } from "@/cms/blocks/Image";
import { Render } from "@puckeditor/core/rsc";
import { puckRenderConfig } from "@/cms/render.config";
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

    // 5. Check dynamic webinar redirect from Supabase
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
      if (isRedirect(err)) {
        throw err;
      }
      console.warn(`[webinar-redirect] lookup skipped for "${params.slug}":`, err);
    }
  },
  head: ({ loaderData }) => {
    if (loaderData?.post) {
      const post = loaderData.post;
      return {
        meta: [
          { title: post.metaTitle },
          { name: "description", content: post.metaDescription },
          { property: "og:title", content: post.metaTitle },
          { property: "og:description", content: post.metaDescription },
          { property: "og:image", content: post.image },
        ],
      };
    }

    if (loaderData?.cmsPage) {
      const page = loaderData.cmsPage;
      const rootProps = (page.data?.root?.props as CmsRootProps) || {};

      const baseTitle = page.title?.trim() || "SMG ABA";
      const title = rootProps.seoTitle?.trim() || `${baseTitle} | SMG ABA`;
      const metaDescription = rootProps.metaDescription?.trim();
      const ogTitle = rootProps.ogTitle?.trim() || title;
      const ogDescription = rootProps.ogDescription?.trim() || metaDescription;
      const ogImage = rootProps.ogImage?.trim();
      const canonicalUrl = rootProps.canonicalUrl?.trim();

      const meta: Array<{ title?: string; name?: string; property?: string; content?: string }> = [
        { title },
        { property: "og:title", content: ogTitle },
        { property: "og:type", content: "website" },
      ];

      if (metaDescription) {
        meta.push({ name: "description", content: metaDescription });
      }

      if (ogDescription) {
        meta.push({ property: "og:description", content: ogDescription });
      }

      if (ogImage && isValidImageUrl(ogImage)) {
        meta.push({ property: "og:image", content: ogImage });
      }

      const links: Array<{ rel: string; href: string }> = [];
      if (canonicalUrl && isValidCanonicalUrl(canonicalUrl)) {
        links.push({ rel: "canonical", href: canonicalUrl });
      }

      return {
        meta,
        links,
      };
    }

    return {
      meta: [{ title: "Page Not Found | SMG ABA" }],
    };
  },
  loader: async ({ params }): Promise<{ post: BlogPost | null; cmsPage: CmsPage | null; settings?: CmsSiteSettings }> => {
    // 1. Check static blog posts first
    const post = getBlogPostBySlug(params.slug);
    if (post) {
      return { post, cmsPage: null };
    }

    // 2. Check published CMS pages
    const result = await lookupPublishedCmsPage({ data: params.slug });
    if (result?.error) {
      console.error(`[CMS] Server lookup error for "${params.slug}":`, result.error);
      throw new Error("Failed to load page");
    }

    if (result?.page) {
      const settingsRes = await getCmsSiteSettings();
      return { post: null, cmsPage: result.page, settings: settingsRes.settings };
    }

    // 3. Clean not found -> 404
    throw notFound();
  },
  component: DynamicSlugPage,
  notFoundComponent: DynamicNotFoundPage,
});

function DynamicSlugPage() {
  const { post, cmsPage, settings } = Route.useLoaderData();

  if (post) {
    return <BlogPostView post={post} />;
  }

  if (cmsPage) {
    const rootProps = cmsPage.data?.root?.props as CmsRootProps | undefined;
    const showPageHero = Boolean(rootProps?.showPageHero);
    const firstBlock = cmsPage.data?.content?.[0];
    const hasFirstBlockHero = firstBlock?.type === "Hero";
    const hasHero = showPageHero || hasFirstBlockHero;

    // Avoid a double H1: when the automatic hero is on, render a first-block Heading of level h1 as h2
    let preparedData = cmsPage.data;
    if (showPageHero && firstBlock?.type === "Heading" && (firstBlock.props as any)?.level === "h1") {
      preparedData = {
        ...cmsPage.data,
        content: [
          {
            ...firstBlock,
            props: {
              ...firstBlock.props,
              level: "h2",
            },
          },
          ...(cmsPage.data.content || []).slice(1),
        ],
      };
    }

    if (hasFirstBlockHero) {
      preparedData = {
        ...preparedData,
        root: {
          ...preparedData.root,
          props: {
            ...preparedData.root?.props,
            _hasFirstBlockHero: true,
          },
        },
      };
    }

    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Header settings={settings} />
        <main className={`flex-1 overflow-x-clip ${hasHero ? "pb-16" : "pt-28 sm:pt-36 pb-16"}`}>
          <Render config={puckRenderConfig} data={preparedData} />
        </main>
        <Footer settings={settings} />
      </div>
    );
  }

  return <DynamicNotFoundPage />;
}

function DynamicNotFoundPage() {
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
