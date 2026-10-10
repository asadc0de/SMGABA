import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RESOURCE_POSTS, type ResourcePost } from "@/data/resourcePosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { QuoteForm } from "@/components/site/QuoteForm";

const POSTS_PER_PAGE = 12;

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Newsletters | SMG Advisory Insights" },
      {
        name: "description",
        content:
          "Stay up to date with the latest hospitality legislation, restaurant grants, tax updates, firm news, and business insights from SMG ABA.",
      },
    ],
  }),
  component: ResourcesPage,
});

// Strategic Executive Briefings
const STRATEGIC_GUIDES = [
  {
    title: "Mastering Restaurant Prime Costs: How to Stay Below the 60% Benchmark",
    category: "Hospitality Strategy",
    date: "Aug 2026",
    summary:
      "A step-by-step breakdown of managing COGS and labor costs in high-volume dining establishments to protect bottom-line operating margins.",
    readTime: "5 min read",
    href: "/contact",
  },
  {
    title: "Maximizing the FICA Tip Tax Credit (Section 45B) for Food & Beverage Operators",
    category: "Tax Planning",
    date: "Jul 2026",
    summary:
      "Are you leaving substantial tax credits on the table? Learn how to calculate and claim your employer FICA tip credits accurately.",
    readTime: "4 min read",
    href: "/contact",
  },
  {
    title: "13-Week Cash Flow Forecasting: The Executive CFO's Secret Weapon",
    category: "Financial Advisory",
    date: "Jun 2026",
    summary:
      "Why standard monthly budgets fail during growth phases, and how rolling 13-week forecasts give business owners unprecedented runway clarity.",
    readTime: "6 min read",
    href: "/contact",
  },
  {
    title: "Real Estate 1031 Exchange Timelines & Entity Structuring Guidelines",
    category: "Real Estate",
    date: "May 2026",
    summary:
      "Key rules and deadlines property investors must follow to defer capital gains and maintain pristine capital accounts across partnerships.",
    readTime: "7 min read",
    href: "/contact",
  },
];

function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Normalize categories for filter bar
  const categories = useMemo(() => {
    const rawCategories = Array.from(
      new Set(RESOURCE_POSTS.map((p) => p.category).filter(Boolean))
    );
    // Ensure "News & Updates" is prominently available as a sensible category
    return ["All", "News & Updates", ...rawCategories.filter((c) => c !== "News & Updates")];
  }, []);

  // Filter resource posts
  const filteredPosts = useMemo(() => {
    return RESOURCE_POSTS.filter((post) => {
      let matchesCategory = true;
      if (activeCategory === "News & Updates") {
        matchesCategory =
          post.category === "Firm News" ||
          post.category === "News & Updates" ||
          post.category === "Community & Events" ||
          post.category === "Advisory";
      } else if (activeCategory !== "All") {
        matchesCategory = post.category === activeCategory;
      }

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.category?.toLowerCase().includes(query) ||
        post.blocks.some((b) => b.text?.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
    const el = document.getElementById("resources-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Page Hero */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1920&q=80"
          eyebrow="SMG Insights & Updates"
          title="Resources & Newsletters"
          description="Discover practical strategies, legislative updates, firm news, and executive financial frameworks to help your business thrive."
          buttonText="SUBSCRIBE"
          buttonHref="#newsletter"
        />

        {/* Newsletter Subscription Strip */}
        <section id="newsletter" className="border-b border-border/80 bg-navy text-white py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300">
                  <Mail className="size-4" />
                  <span>SMG Executive Briefing</span>
                </div>
                <h2 className="mt-2 font-serif-hero text-2xl sm:text-3xl font-bold text-white">
                  Get Industry Insights Delivered Monthly
                </h2>
                <p className="mt-2 text-sm text-slate-200 sm:text-base">
                  Join hundreds of restaurateurs, developers, and business owners who receive our curated hospitality, grant, and tax analysis.
                </p>
              </div>

              <div className="lg:col-span-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Thank you for subscribing to the SMG Newsletter!");
                  }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
                  />
                  <Button type="submit" size="lg" className="shrink-0 bg-white text-navy hover:bg-slate-100 font-bold">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

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
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 rounded-full border-border/80 bg-background text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Resources Post Grid (16 Moved Posts, Newest First) */}
        <section id="resources-grid" className="section-y">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow text-xs">Knowledge Base & News</span>
                <h2 className="mt-1 font-serif-hero text-2xl sm:text-3xl font-bold text-navy">
                  {activeCategory === "All" ? "All Resources & Updates" : `${activeCategory}`}
                  <span className="ml-3 text-sm font-normal text-muted-foreground">
                    ({filteredPosts.length} {filteredPosts.length === 1 ? "entry" : "entries"})
                  </span>
                </h2>
              </div>

              {totalPages > 1 && (
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                <BookOpen className="mx-auto size-10 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-bold text-navy">No resources found</h3>
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
                        {post.image ? (
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
                        ) : (
                          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground mb-4">
                            <span className="rounded-full bg-navy/10 px-3 py-1 font-bold uppercase tracking-wider text-navy">
                              {post.category}
                            </span>
                          </div>
                        )}

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
                          <a href={`/resources/${post.slug}`}>
                            {post.title}
                          </a>
                        </h3>

                        <p className="mt-2.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/80">{post.author}</span>
                        <a
                          href={`/resources/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                        >
                          <span>Read Resource</span>
                          <ArrowRight className="size-3.5" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
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
                      resources
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="rounded-full gap-1 text-xs font-semibold text-navy border-border/80 hover:bg-muted disabled:opacity-30 h-9 px-3.5"
                      >
                        <ChevronLeft className="size-4" /> Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={`page-${pageNum}`}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`size-9 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                            pageNum === currentPage
                              ? "bg-navy text-white shadow-md shadow-navy/20 scale-105"
                              : "text-foreground/80 hover:bg-muted border border-border/60"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

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

        {/* Strategic Executive Guides Section */}
        <section className="section-y bg-mist/20 border-t border-border/80">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="eyebrow">Strategic Toolkits</span>
              <h2 className="mt-2 font-serif-hero text-2xl sm:text-3xl font-bold text-navy">
                Executive Guides & Financial Frameworks
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                In-depth blueprints and operational benchmarks tailored for hospitality groups, developers, and corporate founders.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {STRATEGIC_GUIDES.map((article) => (
                <div
                  key={article.title}
                  className="card-surface flex flex-col justify-between p-8 transition-all hover:-translate-y-1 hover:shadow-xl sm:p-10"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
                      <span className="rounded-full bg-navy/10 px-3 py-1 font-bold uppercase tracking-wider text-navy">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {article.date}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif-hero text-xl sm:text-2xl font-bold text-navy">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4 text-xs font-bold text-primary">
                    <span>{article.readTime}</span>
                    <a
                      href={article.href}
                      className="inline-flex items-center gap-1 transition-colors hover:text-navy"
                    >
                      <span>Discuss with an Advisor</span>
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
