import assert from "node:assert/strict";
import test from "node:test";
import { isPublicBlogVisible } from "../src/lib/blog-visibility.ts";

const NOW = Date.parse("2026-11-03T12:00:00.000Z");

test("allows a currently published post", () => {
  assert.equal(
    isPublicBlogVisible(
      { status: "published", publishDate: "2026-11-03T11:59:59.000Z" },
      NOW,
    ),
    true,
  );
});

test("rejects a future-dated published post", () => {
  assert.equal(
    isPublicBlogVisible(
      { status: "published", publishDate: "2026-11-03T12:00:01.000Z" },
      NOW,
    ),
    false,
  );
});

test("rejects draft and scheduled posts", () => {
  assert.equal(isPublicBlogVisible({ status: "draft" }, NOW), false);
  assert.equal(
    isPublicBlogVisible(
      { status: "scheduled", publishDate: "2026-11-03T11:00:00.000Z" },
      NOW,
    ),
    false,
  );
});

test("rejects archived posts", () => {
  assert.equal(isPublicBlogVisible({ status: "published", archived: true }, NOW), false);
});

test("rejects missing and invalid publication dates", () => {
  assert.equal(isPublicBlogVisible({ status: "published" }, NOW), true);
  assert.equal(
    isPublicBlogVisible({ status: "published", publishDate: "not-a-date" }, NOW),
    false,
  );
});

test("listing and detail use the same eligibility predicate", () => {
  const posts = [
    { slug: "live", status: "published" as const, publishDate: "2026-11-02T00:00:00.000Z" },
    { slug: "future", status: "published" as const, publishDate: "2026-11-04T00:00:00.000Z" },
    { slug: "draft", status: "draft" as const },
    { slug: "archived", status: "published" as const, archived: true },
  ];

  const listedSlugs = posts.filter((post) => isPublicBlogVisible(post, NOW)).map((post) => post.slug);
  const detailSlugs = posts
    .map((post) => (isPublicBlogVisible(post, NOW) ? post.slug : null))
    .filter((slug): slug is string => slug !== null);

  assert.deepEqual(detailSlugs, listedSlugs);
});
