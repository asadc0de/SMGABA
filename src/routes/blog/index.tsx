import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Calendar, Clock, ArrowRight, Search, Tag, BookOpen, Sparkles } from "lucide-react";
import { BLOG_POSTS, getAllBlogCategories } from "@/data/blogPosts";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => getAllBlogCategories(), []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

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
                    onClick={() => setActiveCategory(cat)}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-full border-border/80 bg-background text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post Spotlight (shown when no search filter active) */}
        {activeCategory === "All" && searchQuery === "" && featuredPost && (
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
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy">
                {activeCategory === "All" ? "All Published Articles" : `${activeCategory} Articles`}
                <span className="ml-3 text-sm font-normal text-muted-foreground">
                  ({filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"})
                </span>
              </h2>
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
                  }}
                  variant="outline"
                  className="mt-4 rounded-full"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
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
            )}
          </div>
        </section>

        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
