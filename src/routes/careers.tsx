import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SubpageHero } from "@/components/site/SubpageHero";
import { getCareersFeed, type JobPosting } from "@/lib/careers.server";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ExternalLink,
  RotateCcw,
  Building2,
  AlertCircle,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers | SMG ABA" },
      {
        name: "description",
        content:
          "Explore career opportunities at SMG ABA. Join our team of accountants, bookkeepers, and advisors.",
      },
      { property: "og:title", content: "Careers | SMG ABA" },
      {
        property: "og:description",
        content:
          "Explore career opportunities at SMG ABA. Join our team of accountants, bookkeepers, and advisors.",
      },
    ],
  }),
  loader: async () => {
    return await getCareersFeed();
  },
  pendingComponent: CareersLoading,
  errorComponent: CareersErrorFallback,
  component: CareersPage,
});

/**
 * Format ISO / feed date string to human-readable format e.g. "Aug 24, 2026"
 */
function formatPostedDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const datePart = dateStr.split(" ")[0];
    const parts = datePart.split("-").map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Truncate description text to ~150 characters
 */
function truncateDescription(text: string, maxLen = 150): string {
  if (!text) return "";
  const clean = text
    .replace(/\\r\\n|\\n|\\r|\\t/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen).trim() + "...";
}

function CareersPage() {
  const loaderData = Route.useLoaderData();
  const rawJobs = loaderData?.jobs;
  const jobs: JobPosting[] = useMemo(() => rawJobs || [], [rawJobs]);
  const error: string | null = loaderData?.error || null;

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedState, setSelectedState] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");

  // Dynamic filter options derived from live job data
  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.city?.trim()) set.add(j.city.trim());
    });
    return Array.from(set).sort();
  }, [jobs]);

  const stateOptions = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.state?.trim()) set.add(j.state.trim());
    });
    return Array.from(set).sort();
  }, [jobs]);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.employmentType?.trim()) set.add(j.employmentType.trim());
    });
    return Array.from(set).sort();
  }, [jobs]);

  // Client-side filtering and sorting
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Search text against title, city, or state
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = job.title.toLowerCase().includes(q);
          const matchesCity = job.city?.toLowerCase().includes(q);
          const matchesState = job.state?.toLowerCase().includes(q);
          const matchesDept = job.department?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCity && !matchesState && !matchesDept) {
            return false;
          }
        }

        // City filter
        if (selectedCity !== "ALL" && job.city !== selectedCity) {
          return false;
        }

        // State filter
        if (selectedState !== "ALL" && job.state !== selectedState) {
          return false;
        }

        // Employment type filter
        if (selectedType !== "ALL" && job.employmentType !== selectedType) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        // "newest" by default (lastUpdated descending)
        const dateA = new Date(a.lastUpdated.replace(" ", "T")).getTime() || 0;
        const dateB = new Date(b.lastUpdated.replace(" ", "T")).getTime() || 0;
        return dateB - dateA;
      });
  }, [jobs, searchQuery, selectedCity, selectedState, selectedType, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCity !== "ALL" ||
    selectedState !== "ALL" ||
    selectedType !== "ALL" ||
    sortBy !== "newest";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("ALL");
    setSelectedState("ALL");
    setSelectedType("ALL");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* Page Hero Header */}
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Join Our Team"
          title="Careers at SMG"
          description="Explore open positions and join our team."
        />

        {/* Main Careers Content Area */}
        <section className="section-y py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
            {/* Error fallback state */}
            {error && jobs.length === 0 ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 sm:p-12 text-center">
                <div className="mx-auto size-14 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                  <AlertCircle className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Unable to load current openings, please check back shortly
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  We are experiencing a temporary issue connecting to our talent portal. Please
                  check back soon or contact our office directly.
                </p>
                <div className="mt-6">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-[#1b2d4f] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#243c68]"
                  >
                    Contact Our Team
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {/* Search and Filter Card */}
                <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs mb-8 sm:mb-10">
                  <div className="space-y-4">
                    {/* Top row: Search input */}
                    <div className="relative w-full">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by job title, city, or state..."
                        aria-label="Search jobs"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>

                    {/* Second row: Dropdown filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* City Filter */}
                      <div>
                        <label htmlFor="city-filter" className="sr-only">
                          Filter by City
                        </label>
                        <select
                          id="city-filter"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                        >
                          <option value="ALL">All Cities</option>
                          {cityOptions.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* State Filter */}
                      <div>
                        <label htmlFor="state-filter" className="sr-only">
                          Filter by State
                        </label>
                        <select
                          id="state-filter"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                        >
                          <option value="ALL">All States</option>
                          {stateOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Employment Type Filter */}
                      <div>
                        <label htmlFor="type-filter" className="sr-only">
                          Filter by Employment Type
                        </label>
                        <select
                          id="type-filter"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                        >
                          <option value="ALL">All Employment Types</option>
                          {typeOptions.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sort Dropdown */}
                      <div>
                        <label htmlFor="sort-filter" className="sr-only">
                          Sort Jobs
                        </label>
                        <select
                          id="sort-filter"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as "newest" | "title")}
                          className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer font-medium"
                        >
                          <option value="newest">Sort: Newest</option>
                          <option value="title">Sort: Job Title A-Z</option>
                        </select>
                      </div>
                    </div>

                    {/* Filter Summary & Count Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          <Briefcase className="size-3.5" />
                          Number of Jobs: {filteredJobs.length}
                        </span>
                        {hasActiveFilters && (
                          <span className="text-xs text-muted-foreground">
                            (filtered from {jobs.length} total)
                          </span>
                        )}
                      </div>

                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <RotateCcw className="size-3.5" />
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job List Cards or Empty State */}
                {filteredJobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-10 sm:p-16 text-center bg-card/50">
                    <div className="mx-auto size-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                      <Filter className="size-6" />
                    </div>
                    <h3 className="font-serif-hero text-xl sm:text-2xl font-bold text-foreground">
                      No positions match your search
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                      We couldn't find any job openings matching your current search or filter
                      criteria.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 rounded-full bg-[#1b2d4f] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#243c68] cursor-pointer"
                      >
                        <RotateCcw className="size-4" />
                        Clear Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredJobs.map((job) => {
                      const locationParts = [job.city, job.state, job.country]
                        .filter(Boolean)
                        .join(", ");
                      const locationAndType = [locationParts, job.employmentType]
                        .filter(Boolean)
                        .join(" | ");
                      const postedDate = formatPostedDate(job.lastUpdated);
                      const descriptionPreview = truncateDescription(job.plainDescription, 150);

                      return (
                        <article
                          key={job.referenceNumber}
                          className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            {/* Left Side: Job Info */}
                            <div className="flex-1 min-w-0 space-y-3">
                              {/* Badges row */}
                              <div className="flex flex-wrap items-center gap-2">
                                {job.department && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                                    <Building2 className="size-3" />
                                    {job.department}
                                  </span>
                                )}
                                {job.category && job.category !== job.department && (
                                  <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                    {job.category}
                                  </span>
                                )}
                                {postedDate && (
                                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="size-3" />
                                    Posted: {postedDate}
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h2 className="font-serif-hero text-xl sm:text-2xl font-bold text-[#142340] group-hover:text-primary transition-colors">
                                <a
                                  href={job.url || job.applyurl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="focus:outline-hidden hover:underline"
                                >
                                  {job.title}
                                </a>
                              </h2>

                              {/* Location line: "{city}, {state}, {country} | {employmentType}" */}
                              {locationAndType && (
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                  <MapPin className="size-4 text-primary shrink-0" />
                                  <span>{locationAndType}</span>
                                </div>
                              )}

                              {/* Salary line if present */}
                              {job.salary && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs sm:text-sm font-semibold">
                                  <DollarSign className="size-3.5 shrink-0 text-emerald-600" />
                                  <span>{job.salary}</span>
                                </div>
                              )}

                              {/* Truncated description preview */}
                              {descriptionPreview && (
                                <p className="text-sm leading-relaxed text-slate-600 pt-1">
                                  {descriptionPreview}
                                </p>
                              )}
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div className="flex flex-row sm:flex-row lg:flex-col items-center sm:items-stretch gap-2.5 shrink-0 pt-2 lg:pt-0">
                              <a
                                href={job.applyurl || job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#1b2d4f] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xs transition-all duration-150 hover:bg-[#243c68] hover:scale-102 active:scale-98 text-center min-w-[130px]"
                              >
                                Apply Now
                                <ArrowUpRight className="size-4 shrink-0" />
                              </a>

                              <a
                                href={job.url || job.applyurl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-wider text-slate-700 shadow-xs transition-all duration-150 hover:bg-secondary hover:text-foreground text-center min-w-[130px]"
                              >
                                View Job
                                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                              </a>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Skeleton loading view while jobs feed is loading
 */
function CareersLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Join Our Team"
          title="Careers at SMG"
          description="Explore open positions and join our team."
        />
        <section className="section-y py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full space-y-6">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/**
 * Fallback component if loader encounters fatal exception
 */
function CareersErrorFallback() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <SubpageHero
          bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          eyebrow="Join Our Team"
          title="Careers at SMG"
          description="Explore open positions and join our team."
        />
        <section className="section-y py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 sm:p-12 text-center">
              <div className="mx-auto size-14 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                <AlertCircle className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Unable to load current openings, please check back shortly
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Please check back in a few minutes or contact our office directly.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
