import { createFileRoute, notFound } from "@tanstack/react-router";
import { getBlogPostBySlug, BLOG_POSTS } from "@/data/blogPosts";
import { BlogPostView } from "@/components/site/BlogPostView";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

export const Route = createFileRoute("/$slug")({
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
            <h1 className="mt-4 font-serif-hero text-2xl font-bold text-navy">
              Page Not Found
            </h1>
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
