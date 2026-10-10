import { createFileRoute } from "@tanstack/react-router";
import { getResourcePostBySlug } from "@/data/resourcePosts";
import { BlogPostView } from "@/components/site/BlogPostView";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/resources/$slug")({
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Resource Not Found | SMG ABA" }],
        links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
      };
    }
    return {
      meta: [
        { title: post.metaTitle || `${post.title} | SMG Resources` },
        { name: "description", content: post.metaDescription || post.excerpt || "" },
        { property: "og:title", content: post.metaTitle || post.title },
        { property: "og:description", content: post.metaDescription || post.excerpt || "" },
        { property: "og:image", content: post.image },
      ],
      links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    };
  },
  loader: async ({ params }) => {
    const post = getResourcePostBySlug(params.slug);
    return { post: post || null };
  },
  component: ResourceSlugPage,
});

function ResourceSlugPage() {
  const { post } = Route.useLoaderData();

  if (!post) {
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

  return <BlogPostView post={post} isResource={true} />;
}
