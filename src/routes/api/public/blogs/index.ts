import { createFileRoute } from "@tanstack/react-router";
import { getPublicBlogs } from "@/lib/blogs.server";
import { publicJson, publicOptions } from "@/lib/api/cors.server";

function toPublicBlogPost(post: Awaited<ReturnType<typeof getPublicBlogs>>[number]) {
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

export const Route = createFileRoute("/api/public/blogs/")({
  server: {
    handlers: {
      OPTIONS: ({ request }) => publicOptions(request),
      GET: async ({ request }) => {
        const posts = await getPublicBlogs();
        return publicJson(request, { posts: posts.map(toPublicBlogPost) });
      },
    },
  },
});
