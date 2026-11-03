import { createFileRoute } from "@tanstack/react-router";
import { getBlogPost } from "@/lib/blogs.server";
import { isPublicBlogVisible } from "@/lib/blog-visibility";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

function toPublicBlogPost(post: Awaited<ReturnType<typeof getBlogPost>>) {
  if (!post) return null;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    h1: post.h1,
    date: post.date,
    publishDate: post.publishDate,
    author: post.author,
    category: post.category,
    image: post.image,
    readTime: post.readTime,
    excerpt: post.excerpt,
    status: "published" as const,
    isCustom: post.isCustom,
    archived: false,
    blocks: post.blocks,
  };
}

export const Route = createFileRoute("/api/public/blogs/$slug")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request, params }) => {
        const post = await getBlogPost({ data: params.slug });
        if (!post || !isPublicBlogVisible(post)) {
          return publicJson(request, { post: null }, { status: 404 });
        }

        return publicJson(request, { post: toPublicBlogPost(post) });
      },
    },
  },
});
