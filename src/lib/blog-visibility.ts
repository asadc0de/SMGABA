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
  now?: number,
): boolean {
  if (!post || post.status !== "published" || post.archived) {
    return false;
  }

  if (!post.publishDate) {
    return true;
  }

  // Guard against Array.prototype.filter passing (item, index) where index (0, 1, 2) overwrites now
  const effectiveNow = typeof now === "number" && now > 1000000000 ? now : Date.now();
  const publishTime = new Date(post.publishDate).getTime();
  return Number.isFinite(publishTime) && publishTime <= effectiveNow;
}
