export interface PublicBlogVisibilityFields {
  status?: "draft" | "published" | "scheduled";
  publishDate?: string;
  archived?: boolean;
}

/**
 * Returns whether a blog is eligible for public publication at the supplied time.
 * The clock is injectable so publication boundaries can be tested deterministically.
 */
export function isPublicBlogVisible(
  post: PublicBlogVisibilityFields,
  now = Date.now(),
): boolean {
  if (post.status !== "published" || post.archived) {
    return false;
  }

  if (!post.publishDate) {
    return true;
  }

  const publishTime = new Date(post.publishDate).getTime();
  return Number.isFinite(publishTime) && publishTime <= now;
}
