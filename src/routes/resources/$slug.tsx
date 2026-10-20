import { createFileRoute, notFound } from "@tanstack/react-router";
import { getResourcePostBySlug } from "@/data/resourcePosts";
import { BlogPostView } from "@/components/site/BlogPostView";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/resources/$slug")({
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const isObbba = params.slug === "obbba-summary" || post?.slug === "obbba-summary";
    const isProduction =
      (typeof import.meta !== "undefined" && Boolean(import.meta.env?.PROD)) ||
      (typeof process !== "undefined" && process.env?.NODE_ENV === "production");

    if (!post || (isObbba && isProduction)) {
      return {
        meta: [
          { title: "Resource Not Found | SMG ABA" },
          { name: "robots", content: "noindex, nofollow" },
        ],
        links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      };
    }
    return {
      meta: [
        { title: post.metaTitle || `${post.title} | SMG Resources` },
        { name: "description", content: post.metaDescription || post.excerpt || "" },
        ...(isObbba || post.archived ? [{ name: "robots", content: "noindex, nofollow" }] : []),
        { property: "og:title", content: post.metaTitle || post.title },
        { property: "og:description", content: post.metaDescription || post.excerpt || "" },
        { property: "og:image", content: post.image },
      ],
      links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    };
  },
  loader: async ({ params }) => {
    const isProduction =
      (typeof import.meta !== "undefined" && Boolean(import.meta.env?.PROD)) ||
      (typeof process !== "undefined" && process.env?.NODE_ENV === "production");

    if (params.slug === "obbba-summary" && isProduction) {
      throw notFound();
    }

    const post = getResourcePostBySlug(params.slug);
    if (!post) {
      throw notFound();
    }
    return { post: post || null };
  },
  notFoundComponent: ResourceNotFoundComponent,
  component: ResourceSlugPage,
});

function ResourceNotFoundComponent() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      <main className="py-32 px-6 text-center">
        <div className="mx-auto max-w-md card-surface p-10">
          <Sparkles className="mx-auto size-12 text-muted-foreground" />
          <h1 className="mt-4 font-serif-hero text-2xl font-bold text-navy">
            Resource Not Found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The resource or article you are looking for does not exist or has been moved.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <a href="/resources">
                <ArrowLeft className="mr-2 size-4" /> Back to Resources
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

function ResourceSlugPage() {
  const data = Route.useLoaderData();
  const post = data?.post;

  if (!post) {
    return <ResourceNotFoundComponent />;
  }

  return <BlogPostView post={post} isResource={true} />;
}
