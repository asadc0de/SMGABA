import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPublicBlogs, type ExtendedBlogPost } from "@/lib/blogs.server";
import { BLOG_POSTS } from "@/data/blogPosts";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 18;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog - Accounting Resources | Business Finance Insights | SMG ABA" },
      {
        name: "description",
        content:
          "Explore the latest financial strategies, tax laws, outsourced bookkeeping tips, and firm news from the expert team at SMG ABA.",
      },
    ],
  }),
  loader: async () => {
    const posts = await getPublicBlogs();
    return { posts };
  },
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const loaderData = Route.useLoaderData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const activePosts = useMemo(() => {
    const raw = loaderData?.posts && loaderData.posts.length > 0 ? loaderData.posts : BLOG_POSTS;
    return raw.filter((p) => !p.archived);
  }, [loaderData]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(activePosts.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats];
  }, [activePosts]);

  const filteredPosts = useMemo(() => {
    return activePosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activePosts, activeCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById("articles-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Generate pagination items with smart ellipsis
  const paginationItems = useMemo(() => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  const featuredPost = activePosts[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Financial Intelligence"
          title="Insights & Advisory Blog"
          description="Actionable guidance, tax regulations, outsourced bookkeeping strategies, and financial insights to propel your business forward."
        />

        {/* Filters & Search Toolbar */}
        <section className="border-b border-border/80 bg-card/60 py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-navy text-white shadow-md shadow-navy/20"
                        : "bg-mist/40 text-muted-foreground hover:bg-mist hover:text-navy"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 rounded-full border-border/80 bg-background text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post Spotlight (shown when on page 1 with no search filter active) */}
        {activeCategory === "All" && searchQuery === "" && currentPage === 1 && featuredPost && (
          <section className="pt-12 lg:pt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="overflow-hidden rounded-3xl border border-navy/15 bg-gradient-to-br from-[#0e1b36] via-[#162d5c] to-[#0f2040] text-white shadow-2xl">
                <div className="grid lg:grid-cols-12">
                  <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                        <Sparkles className="size-3.5 text-blue-400" />
                        <span>Featured Story</span>
                        <span>•</span>
                        <span>{featuredPost.category}</span>
                      </div>
                      <h2 className="mt-4 font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-4 text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-2xl">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
                      <div className="flex items-center gap-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-blue-400" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-blue-400" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>

                      <Button asChild className="rounded-full bg-blue-600 text-white hover:bg-blue-500 font-bold gap-2">
                        <a href={`/${featuredPost.slug}/`}>
                          Read Full Article <ArrowRight className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="size-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Post Grid */}
        <section id="articles-section" className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy">
                {activeCategory === "All" ? "All Published Articles" : `${activeCategory} Articles`}
                <span className="ml-3 text-sm font-normal text-muted-foreground">
                  ({filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"})
                </span>
              </h2>

              {totalPages > 1 && (
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <BookOpen className="mx-auto size-10 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-bold text-navy">No articles found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search query or selecting a different category filter.
                </p>
                <Button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  className="mt-4 rounded-full"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
                    >
                      <div>
                        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-muted mb-5">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute top-3.5 left-3.5 rounded-full bg-navy/85 backdrop-blur-md px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-white shadow-xs">
                            {post.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3 text-primary" />
                            <span>{post.date}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="size-3 text-primary" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <h3 className="mt-3 font-serif-hero text-xl font-bold text-navy leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="mt-2.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/80">{post.author}</span>
                        <a
                          href={`/${post.slug}/`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                        >
                          <span>Read More</span>
                          <ArrowRight className="size-3.5" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls (18 blogs per page) */}
                {totalPages > 1 && (
                  <div className="mt-14 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-muted-foreground font-medium">
                      Showing{" "}
                      <span className="font-semibold text-foreground">
                        {(currentPage - 1) * POSTS_PER_PAGE + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-foreground">
                        {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-foreground">
                        {filteredPosts.length}
                      </span>{" "}
                      articles
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Previous Page Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-full gap-1 text-xs font-semibold text-navy border-border/80 hover:bg-muted disabled:opacity-30 h-9 px-3.5"
                      >
                        <ChevronLeft className="size-4" /> Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1 mx-1">
                        {paginationItems.map((item, idx) => {
                          if (item === "...") {
                            return (
                              <span
                                key={`ellipsis-${idx}`}
                                className="px-2 text-xs font-bold text-muted-foreground"
                              >
                                ...
                              </span>
                            );
                          }

                          const pageNumber = item as number;
                          const isActive = pageNumber === currentPage;

                          return (
                            <button
                              key={`page-${pageNumber}`}
                              type="button"
                              onClick={() => handlePageChange(pageNumber)}
                              className={`size-9 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                                isActive
                                  ? "bg-navy text-white shadow-md shadow-navy/20 scale-105"
                                  : "text-foreground/80 hover:bg-muted border border-border/60"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Page Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="rounded-full gap-1 text-xs font-semibold text-navy border-border/80 hover:bg-muted disabled:opacity-30 h-9 px-3.5"
                      >
                        Next <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
