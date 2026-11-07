import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "./supabase.server";
import { BLOG_POSTS, type BlogPost, type ContentBlock } from "@/data/blogPosts";
import { RESOURCE_POSTS, type ResourcePost } from "@/data/resourcePosts";
import { isPublicBlogVisible } from "./blog-visibility";

export interface ExtendedBlogPost extends BlogPost {
  id?: string;
  status?: "draft" | "published" | "scheduled";
  publishDate?: string; // ISO string for scheduled future publishing
  isCustom?: boolean;
  destination?: "blog" | "resource" | "both";
  createdAt?: string;
  updatedAt?: string;
}

// In-memory fallback map for dynamic custom blogs
const localFallbackBlogs = new Map<string, ExtendedBlogPost>();

async function getFsModule() {
  if (typeof window !== "undefined") return null;
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    return { fs: fs.default || fs, path: path.default || path };
  } catch {
    return null;
  }
}

// Load destinations map from Supabase cms_settings
async function getDestinationsMap(supabase: any): Promise<Record<string, "blog" | "resource" | "both">> {
  if (!supabase) return {};
  try {
    const { data } = await supabase.from("cms_settings").select("data").eq("key", "blog_destinations").maybeSingle();
    if (data?.data && typeof data.data === "object") {
      return data.data;
    }
  } catch (err) {
    // ignore
  }
  return {};
}

// Save destination mapping to Supabase cms_settings
async function saveDestination(supabase: any, slug: string, destination: "blog" | "resource" | "both") {
  if (!supabase) return;
  try {
    const map = await getDestinationsMap(supabase);
    map[slug] = destination;
    await supabase.from("cms_settings").upsert({
      key: "blog_destinations",
      data: map,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("[blogs.server] Could not save destination to cms_settings:", err);
  }
}

// Load local fallback blogs from disk if present
async function loadDiskFallbackBlogs() {
  const mod = await getFsModule();
  if (!mod) return;
  try {
    const fallbackDir = mod.path.resolve(process.cwd(), ".data");
    const fallbackFile = mod.path.resolve(fallbackDir, "custom_blogs.json");
    if (mod.fs.existsSync(fallbackFile)) {
      const raw = mod.fs.readFileSync(fallbackFile, "utf8");
      const list: ExtendedBlogPost[] = JSON.parse(raw);
      for (const item of list) {
        localFallbackBlogs.set(item.slug.toLowerCase(), item);
      }
    }
  } catch (err) {
    console.warn("[blogs.server] Could not load disk custom blogs fallback:", err);
  }
}

// Save local fallback blogs to disk
async function saveDiskFallbackBlogs() {
  const mod = await getFsModule();
  if (!mod) return;
  try {
    const fallbackDir = mod.path.resolve(process.cwd(), ".data");
    const fallbackFile = mod.path.resolve(fallbackDir, "custom_blogs.json");
    if (!mod.fs.existsSync(fallbackDir)) {
      mod.fs.mkdirSync(fallbackDir, { recursive: true });
    }
    const list = Array.from(localFallbackBlogs.values());
    mod.fs.writeFileSync(fallbackFile, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.warn("[blogs.server] Could not save disk custom blogs fallback:", err);
  }
}

// Initialize disk storage
if (typeof window === "undefined") {
  loadDiskFallbackBlogs();
}

/**
 * Normalizes a slug to be URL-safe.
 */
export function normalizeBlogSlug(raw: string): string {
  return (raw || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Checks if a scheduled post should be considered live for public view.
 */
export const isBlogLive = isPublicBlogVisible;

/**
 * Fetches all dynamic blogs from Supabase or fallback.
 */
async function fetchDynamicBlogs(): Promise<ExtendedBlogPost[]> {
  // Always ensure disk fallback is loaded into memory
  await loadDiskFallbackBlogs();

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const destMap = await getDestinationsMap(supabase);
        return data.map((row) => {
          const fallback = localFallbackBlogs.get(row.slug.toLowerCase());
          const destination =
            destMap[row.slug] || fallback?.destination || (row as any).destination || "blog";
          return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            metaTitle: row.meta_title || row.title,
            metaDescription: row.meta_description || row.excerpt || "",
            h1: row.h1 || row.title,
            date:
              row.date ||
              new Date(row.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            publishDate: row.publish_date || undefined,
            author: row.author || "SMG Advisory Team",
            category: row.category || "General",
            image: row.image || "",
            readTime: row.read_time || "4 min read",
            excerpt: row.excerpt || "",
            status: (row.status as "draft" | "published" | "scheduled") || "published",
            archived: Boolean(row.archived),
            destination,
            blocks: (row.blocks as ContentBlock[]) || [],
            isCustom: true,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
        });
      }
      if (error) {
        console.warn("[blogs.server] Supabase fetch error (falling back to disk):", error.message);
      }
    } catch (err) {
      console.warn("[blogs.server] Supabase fetch exception:", err);
    }
  }

  return Array.from(localFallbackBlogs.values());
}

/**
 * Public Server Function: Returns all publicly eligible blogs.
 */
export const getPublicBlogs = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExtendedBlogPost[]> => {
    const dynamicBlogs = await fetchDynamicBlogs();
    
    // Exclude drafts, archived posts, and posts that are not yet published.
    // Also only include blogs designated for Blog or Both (not Resource-only)
    const liveDynamic = dynamicBlogs.filter(
      (b) =>
        isPublicBlogVisible(b) &&
        (b.destination === "blog" || b.destination === "both" || !b.destination)
    );
    
    // Map static blogs with metadata
    const staticBlogs: ExtendedBlogPost[] = BLOG_POSTS.map((p) => ({
      ...p,
      status: "published",
      destination: "blog",
      isCustom: false,
    }));

    // Dynamic posts take precedence if slug conflicts
    const map = new Map<string, ExtendedBlogPost>();
    for (const post of staticBlogs) {
      map.set(post.slug.toLowerCase(), post);
    }
    for (const post of liveDynamic) {
      map.set(post.slug.toLowerCase(), post);
    }

    return Array.from(map.values()).filter(isPublicBlogVisible).sort((a, b) => {
      const timeA = a.publishDate ? new Date(a.publishDate).getTime() : new Date(a.date).getTime() || 0;
      const timeB = b.publishDate ? new Date(b.publishDate).getTime() : new Date(b.date).getTime() || 0;
      return timeB - timeA;
    });
  },
);

/**
 * Public Server Function: Returns all publicly eligible resources.
 * Combines static RESOURCE_POSTS and any dynamic custom articles where destination is "resource" or "both".
 */
export const getPublicResources = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExtendedBlogPost[]> => {
    const dynamicBlogs = await fetchDynamicBlogs();

    // Dynamic articles designated for Resources that are live and visible
    const liveDynamic = dynamicBlogs.filter(
      (b) =>
        isPublicBlogVisible(b) &&
        (b.destination === "resource" || b.destination === "both")
    );

    // Map static resources
    const staticResources: ExtendedBlogPost[] = RESOURCE_POSTS.filter(
      (p) => !p.archived && p.slug !== "obbba-summary"
    ).map((p) => ({
      ...p,
      status: "published",
      destination: "resource",
      isCustom: false,
    }));

    const map = new Map<string, ExtendedBlogPost>();
    for (const post of staticResources) {
      map.set(post.slug.toLowerCase(), post);
    }
    for (const post of liveDynamic) {
      map.set(post.slug.toLowerCase(), post);
    }

    return Array.from(map.values()).sort((a, b) => {
      const timeA = a.publishDate ? new Date(a.publishDate).getTime() : new Date(a.date).getTime() || 0;
      const timeB = b.publishDate ? new Date(b.publishDate).getTime() : new Date(b.date).getTime() || 0;
      return timeB - timeA;
    });
  },
);

/**
 * Admin Server Function: Returns ALL blogs (including drafts and future scheduled posts) for the Blog Editor Studio.
 */
export const getAdminBlogs = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ blogs: ExtendedBlogPost[]; categories: string[] }> => {
    const dynamicBlogs = await fetchDynamicBlogs();

    const staticBlogs: ExtendedBlogPost[] = BLOG_POSTS.map((p) => ({
      ...p,
      status: "published",
      destination: "blog",
      isCustom: false,
    }));

    const map = new Map<string, ExtendedBlogPost>();
    for (const post of staticBlogs) {
      map.set(post.slug.toLowerCase(), post);
    }
    for (const post of dynamicBlogs) {
      map.set(post.slug.toLowerCase(), post);
    }

    const allBlogs = Array.from(map.values()).sort((a, b) => {
      const timeA = a.publishDate ? new Date(a.publishDate).getTime() : new Date(a.date).getTime() || 0;
      const timeB = b.publishDate ? new Date(b.publishDate).getTime() : new Date(b.date).getTime() || 0;
      return timeB - timeA;
    });

    const categorySet = new Set<string>();
    for (const b of allBlogs) {
      if (b.category?.trim()) categorySet.add(b.category.trim());
    }

    return {
      blogs: allBlogs,
      categories: Array.from(categorySet),
    };
  },
);

/**
 * Server Function: Looks up a single blog post by slug (supports previewing future/draft posts).
 */
export const getBlogPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: rawSlug }): Promise<ExtendedBlogPost | null> => {
    const slug = normalizeBlogSlug(rawSlug);
    if (!slug) return null;

    // 1. Check Supabase / fallback custom blogs first
    const dynamicBlogs = await fetchDynamicBlogs();
    const customMatch = dynamicBlogs.find((b) => b.slug.toLowerCase() === slug);
    if (customMatch) {
      return customMatch;
    }

    // 2. Check static blogs
    const staticMatch = BLOG_POSTS.find((b) => b.slug.toLowerCase() === slug);
    if (staticMatch) {
      return {
        ...staticMatch,
        status: "published",
        destination: "blog",
        isCustom: false,
      };
    }

    return null;
  });

/**
 * Server Function: Looks up a resource post by slug for /resources/$slug.
 */
export const getUnifiedResourcePost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: rawSlug }): Promise<ExtendedBlogPost | null> => {
    const slug = normalizeBlogSlug(rawSlug);
    if (!slug) return null;

    // 1. Check dynamic blogs designated for resources or both
    const dynamicBlogs = await fetchDynamicBlogs();
    const customMatch = dynamicBlogs.find(
      (b) =>
        b.slug.toLowerCase() === slug &&
        (b.destination === "resource" || b.destination === "both")
    );
    if (customMatch) {
      return customMatch;
    }

    // 2. Check static resources
    const staticMatch = RESOURCE_POSTS.find((b) => b.slug.toLowerCase() === slug);
    if (staticMatch) {
      return {
        ...staticMatch,
        status: "published",
        destination: "resource",
        isCustom: false,
      };
    }

    // 3. Fallback: check any dynamic blog with this slug
    const anyDynamic = dynamicBlogs.find((b) => b.slug.toLowerCase() === slug);
    if (anyDynamic) {
      return anyDynamic;
    }

    return null;
  });

/**
 * Server Function: Saves or updates a dynamic blog post.
 */
export const saveBlogPost = createServerFn({ method: "POST" })
  .validator((post: Partial<ExtendedBlogPost>) => post)
  .handler(async ({ data: input }): Promise<{ success: boolean; slug?: string; error?: string }> => {
    if (!input.title || !input.title.trim()) {
      return { success: false, error: "Blog post title is required." };
    }

    const slug = normalizeBlogSlug(input.slug || input.title);
    if (!slug) {
      return { success: false, error: "A valid URL slug is required." };
    }

    const status = input.status || "published";
    const nowIso = new Date().toISOString();
    const formattedDate =
      input.date?.trim() ||
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    const destination = input.destination || "blog";
    const record: ExtendedBlogPost = {
      id: input.id || `blog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      slug,
      title: input.title.trim(),
      metaTitle: (input.metaTitle || input.title).trim(),
      metaDescription: (input.metaDescription || input.excerpt || "").trim(),
      h1: (input.h1 || input.title).trim(),
      date: formattedDate,
      publishDate: input.publishDate || (status === "scheduled" ? nowIso : undefined),
      author: (input.author || "SMG Advisory Team").trim(),
      category: (input.category || "General").trim(),
      image: (input.image || "").trim(),
      readTime: (input.readTime || "4 min read").trim(),
      excerpt: (input.excerpt || "").trim(),
      status,
      archived: Boolean(input.archived),
      destination,
      blocks: Array.isArray(input.blocks) ? input.blocks : [],
      isCustom: true,
      createdAt: input.createdAt || nowIso,
      updatedAt: nowIso,
    };

    // Save to local fallback store & disk immediately
    localFallbackBlogs.set(slug, record);
    await saveDiskFallbackBlogs();

    // Persist to Supabase if configured
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        const payload = {
          slug: record.slug,
          title: record.title,
          meta_title: record.metaTitle,
          meta_description: record.metaDescription,
          h1: record.h1,
          date: record.date,
          publish_date: record.publishDate || null,
          author: record.author,
          category: record.category,
          image: record.image,
          read_time: record.readTime,
          excerpt: record.excerpt,
          status: record.status,
          archived: record.archived,
          blocks: record.blocks,
          updated_at: nowIso,
        };

        const { error: upsertError } = await supabase
          .from("blog_posts")
          .upsert(payload, { onConflict: "slug" });

        if (upsertError) {
          console.warn("[blogs.server] Supabase upsert error (using local fallback):", upsertError.message);
        }

        // Also save destination mapping to cms_settings
        await saveDestination(supabase, slug, destination);
      } catch (err) {
        console.warn("[blogs.server] Supabase write exception:", err);
      }
    }

    return { success: true, slug };
  });

/**
 * Server Function: Deletes a custom dynamic blog post.
 */
export const deleteBlogPost = createServerFn({ method: "POST" })
  .validator((slug: string) => slug)
  .handler(async ({ data: rawSlug }): Promise<{ success: boolean; error?: string }> => {
    const slug = normalizeBlogSlug(rawSlug);
    if (!slug) return { success: false, error: "Invalid slug." };

    localFallbackBlogs.delete(slug);
    await saveDiskFallbackBlogs();

    const supabase = await getSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.from("blog_posts").delete().eq("slug", slug);
        const map = await getDestinationsMap(supabase);
        if (map[slug]) {
          delete map[slug];
          await supabase.from("cms_settings").upsert({
            key: "blog_destinations",
            data: map,
            updated_at: new Date().toISOString(),
          });
        }
      } catch {
        // ignore
      }
    }

    return { success: true };
  });

/**
 * Helper to fetch a blog post for router loaders (used in $slug.tsx and blog/$slug.tsx).
 */
export async function getUnifiedBlogPost(rawSlug: string): Promise<ExtendedBlogPost | null> {
  const slug = normalizeBlogSlug(rawSlug);
  if (!slug) return null;

  // 1. Check custom / dynamic blogs
  const dynamicBlogs = await fetchDynamicBlogs();
  const custom = dynamicBlogs.find((b) => b.slug.toLowerCase() === slug);
  if (custom) {
    return custom;
  }

  // 2. Check static blogs
  const staticPost = BLOG_POSTS.find((b) => b.slug.toLowerCase() === slug);
  if (staticPost) {
    return {
      ...staticPost,
      status: "published",
      isCustom: false,
    };
  }

  return null;
}
