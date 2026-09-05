import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useMemo } from "react";
import {
  verifyAdminPassword,
  getWebinarRedirectsList,
  deleteWebinarRedirect,
} from "@/lib/webinar-redirects";
import type { WebinarRedirect } from "@/lib/supabase.server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import {
  Lock,
  Unlock,
  Link2,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  PlusCircle,
  RefreshCw,
  Search,
  AlertCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/tools/links")({
  head: () => ({
    meta: [
      { title: "All Webinar Links | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getWebinarRedirectsList();
      return data;
    } catch (err) {
      console.error("Failed to load redirects list:", err);
      return { redirects: [], isConfigured: false };
    }
  },
  component: AllLinksPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";
const ITEMS_PER_PAGE = 25;

function AllLinksPage() {
  const initialData = Route.useLoaderData();
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Data State
  const [redirects, setRedirects] = useState<WebinarRedirect[]>(initialData?.redirects || []);
  const [isConfigured, setIsConfigured] = useState<boolean>(initialData?.isConfigured ?? false);
  const [isPending, startTransition] = useTransition();

  // UI / Search & Pagination State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  // Auto-verify on mount if stored in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        verifyPassword(stored, false, true);
      }
    }
  }, []);

  async function verifyPassword(pwd: string, showToast = true, isAutoCheck = false) {
    if (!pwd.trim()) {
      if (!isAutoCheck) {
        setAuthError("Please enter the admin password.");
      }
      return;
    }

    setIsVerifying(true);
    if (!isAutoCheck) {
      setAuthError("");
    }

    try {
      const res = await verifyAdminPassword({ data: pwd.trim() });
      if (res.authorized) {
        setIsAuthenticated(true);
        setAdminPassword(pwd.trim());
        sessionStorage.setItem(AUTH_STORAGE_KEY, pwd.trim());
        if (showToast) {
          toast.success("Authenticated successfully");
        }
        refreshList();
      } else {
        setIsAuthenticated(false);
        if (!isAutoCheck) {
          setAuthError(res.error || "Incorrect password.");
        }
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err: any) {
      if (!isAutoCheck) {
        setAuthError(err.message || "Authentication error occurred.");
      }
    } finally {
      setIsVerifying(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAdminPassword("");
    setPasswordInput("");
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    toast.info("Logged out from admin panel");
  }

  async function refreshList() {
    startTransition(async () => {
      try {
        const data = await getWebinarRedirectsList();
        setRedirects(data.redirects);
        setIsConfigured(data.isConfigured);
      } catch (err) {
        toast.error("Failed to refresh link list");
      }
    });
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Are you sure you want to delete the redirect for "/${slug}"?`)) {
      return;
    }

    setDeletingSlug(slug);
    try {
      const res = await deleteWebinarRedirect({
        data: {
          slug,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(`Deleted redirect /${slug}`);
        await refreshList();
      } else {
        toast.error(res.error || "Failed to delete redirect");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting");
    } finally {
      setDeletingSlug(null);
    }
  }

  function copyToClipboard(slug: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://smgaba.com";
    const fullUrl = `${origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    toast.success(`Copied: ${fullUrl}`);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  // Filtered dataset based on search query
  const filteredRedirects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return redirects;
    return redirects.filter(
      (r) =>
        r.slug.toLowerCase().includes(query) ||
        r.target_url.toLowerCase().includes(query),
    );
  }, [redirects, searchQuery]);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination calculation
  const totalItems = filteredRedirects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedRedirects = useMemo(() => {
    const startIdx = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredRedirects.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredRedirects, validCurrentPage]);

  const startRange = totalItems === 0 ? 0 : (validCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(validCurrentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/20">
      <Toaster position="top-right" richColors />
      <Header />

      <main className="flex-1 py-28 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* =================================================================== */}
        {/* VIEW 1: PASSWORD GATE (WHEN LOCKED)                                */}
        {/* =================================================================== */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12">
            <div className="card-surface p-8 sm:p-10 text-center border-border/80 shadow-lg">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-navy/10 text-navy mb-5 shadow-xs">
                <Lock className="size-7 stroke-[2]" />
              </div>

              <h1 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy tracking-tight">
                Webinar Links Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                This link directory is restricted. Please enter the internal administrator password to continue.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyPassword(passwordInput);
                }}
                className="mt-6 space-y-4 text-left"
              >
                <div>
                  <Label htmlFor="admin-pass" className="text-xs font-semibold text-navy">
                    Admin Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="admin-pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="webinar admin password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (authError) setAuthError("");
                      }}
                      className="rounded-xl pr-10 focus-visible:ring-primary font-mono text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-navy transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs leading-tight">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold py-5 transition-transform active:scale-[0.99]"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 size-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 size-4" /> Unlock Link Directory
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-border/60 text-[11.5px] text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldAlert className="size-3.5" />
                <span>
                  Gated via <code className="font-mono text-navy font-bold">INTERNAL_ADMIN_PASSWORD</code>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* VIEW 2: PAGINATED LINKS DIRECTORY (MINIMAL DESIGN)                 */
          /* =================================================================== */
          <div className="space-y-6">
            {/* Top Bar Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/70">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="eyebrow bg-navy/10 text-navy px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    Directory
                  </span>
                </div>
                <h1 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy mt-1">
                  All Webinar & Redirect Links
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Browse, search, copy, or manage all configured shortlinks (25 items per page).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <Button
                  asChild
                  className="rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold shadow-xs"
                >
                  <Link to="/tools/redirections">
                    <PlusCircle className="mr-2 size-4" />
                    Create Another Link
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshList}
                  disabled={isPending}
                  className="rounded-xl border-navy/20 text-navy hover:bg-navy hover:text-white text-xs transition-colors"
                >
                  <RefreshCw className={`mr-1.5 size-3.5 ${isPending ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Lock className="mr-1.5 size-3.5" />
                  Lock
                </Button>
              </div>
            </div>

            {/* Filter & Summary Bar */}
            <div className="card-surface p-4 border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search slug or target URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm rounded-xl focus-visible:ring-primary font-mono"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Showing <strong className="text-navy">{startRange}–{endRange}</strong> of{" "}
                  <strong className="text-navy">{totalItems}</strong> {totalItems === 1 ? "link" : "links"}
                </span>
                {totalPages > 1 && (
                  <span className="px-2 py-0.5 rounded bg-secondary text-[11px] font-mono">
                    Page {validCurrentPage} of {totalPages}
                  </span>
                )}
              </div>
            </div>

            {/* Minimal Links Table / List */}
            <div className="card-surface border-border/80 overflow-hidden shadow-xs">
              {paginatedRedirects.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <Link2 className="size-6" />
                  </div>
                  <h3 className="text-sm font-bold text-navy">
                    {searchQuery ? "No matching links found" : "No links created yet"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                      ? `No links matched "${searchQuery}". Try clearing the search keyword.`
                      : "You haven't added any redirect links yet. Click the button below to create one."}
                  </p>
                  <Button asChild size="sm" className="rounded-xl bg-navy text-white hover:bg-navy/90 mt-2">
                    <Link to="/tools/redirections">
                      <PlusCircle className="mr-1.5 size-4" />
                      Create New Link
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-border/70 bg-secondary/50 text-[11px] font-bold text-navy uppercase tracking-wider">
                        <th className="py-3 px-4 sm:px-6">Shortlink (Slug)</th>
                        <th className="py-3 px-4 sm:px-6">Destination (Target URL)</th>
                        <th className="py-3 px-4 hidden md:table-cell">Created</th>
                        <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {paginatedRedirects.map((item) => {
                        const isDeleting = deletingSlug === item.slug;
                        return (
                          <tr
                            key={item.slug}
                            className="hover:bg-secondary/30 transition-colors group"
                          >
                            {/* Shortlink Slug */}
                            <td className="py-3.5 px-4 sm:px-6 align-middle font-mono">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-navy bg-navy/5 px-2 py-1 rounded-md text-xs sm:text-sm">
                                  /{item.slug}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(item.slug)}
                                  title="Copy shortlink to clipboard"
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-navy/70 hover:text-navy px-2 py-1 rounded hover:bg-navy/10 border border-border/40 hover:border-border transition-colors"
                                >
                                  {copiedSlug === item.slug ? (
                                    <>
                                      <Check className="size-3 text-green-600" />
                                      <span className="text-green-600 font-semibold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Destination URL */}
                            <td className="py-3.5 px-4 sm:px-6 align-middle max-w-xs sm:max-w-md">
                              <div className="flex items-center gap-1.5 truncate">
                                <ArrowRight className="size-3.5 text-primary shrink-0 opacity-70" />
                                <a
                                  href={item.target_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={item.target_url}
                                  className="truncate hover:text-primary hover:underline font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors"
                                >
                                  {item.target_url}
                                </a>
                                <ExternalLink className="size-3 shrink-0 opacity-40 group-hover:opacity-80" />
                              </div>
                            </td>

                            {/* Created Date */}
                            <td className="py-3.5 px-4 align-middle text-muted-foreground text-[11px] hidden md:table-cell font-mono">
                              {item.created_at ? (
                                <>
                                  <div>{new Date(item.created_at).toLocaleDateString()}</div>
                                  <div className="text-[10px] opacity-70">
                                    {new Date(item.created_at).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </>
                              ) : (
                                "—"
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 sm:px-6 align-middle text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    navigate({
                                      to: "/tools/redirections",
                                      search: { slug: item.slug },
                                    });
                                  }}
                                  className="h-7 px-2.5 rounded-lg text-xs border-navy/20 text-navy hover:bg-navy hover:text-white transition-colors"
                                  title="Edit this redirect"
                                >
                                  <Edit2 className="size-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(item.slug)}
                                  disabled={isDeleting}
                                  className="h-7 px-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                                  title="Delete this redirect"
                                >
                                  {isDeleting ? (
                                    <RefreshCw className="size-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-3" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls (25 items per page) */}
              {totalPages > 1 && (
                <div className="py-4 px-4 sm:px-6 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-secondary/20">
                  <div className="text-xs text-muted-foreground">
                    Page <strong className="text-navy">{validCurrentPage}</strong> of{" "}
                    <strong className="text-navy">{totalPages}</strong> ({totalItems} total links)
                  </div>

                  <div className="flex items-center gap-1.5 self-center sm:self-auto">
                    {/* Prev Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={validCurrentPage <= 1}
                      className="h-8 px-2.5 rounded-lg text-xs border-navy/20 text-navy hover:bg-navy hover:text-white disabled:hover:bg-transparent disabled:hover:text-navy disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="size-3.5 mr-1" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((pageNum) => {
                          return (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            Math.abs(pageNum - validCurrentPage) <= 1
                          );
                        })
                        .map((pageNum, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev && pageNum - prev > 1;
                          return (
                            <span key={pageNum} className="flex items-center">
                              {showEllipsis && (
                                <span className="px-1 text-muted-foreground text-xs font-mono">
                                  ...
                                </span>
                              )}
                              <Button
                                variant={pageNum === validCurrentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={`h-8 w-8 p-0 rounded-lg text-xs font-mono transition-colors ${
                                  pageNum === validCurrentPage
                                    ? "bg-navy text-white hover:bg-navy"
                                    : "border-navy/20 text-navy hover:bg-navy hover:text-white"
                                }`}
                              >
                                {pageNum}
                              </Button>
                            </span>
                          );
                        })}
                    </div>

                    {/* Next Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={validCurrentPage >= totalPages}
                      className="h-8 px-2.5 rounded-lg text-xs border-navy/20 text-navy hover:bg-navy hover:text-white disabled:hover:bg-transparent disabled:hover:text-navy disabled:opacity-40 transition-colors"
                    >
                      Next
                      <ChevronRight className="size-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom helper card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/70 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-navy">Need to text a link?</span>
                <span>Click the "Copy" button next to any shortlink to paste it into your SMS app.</span>
              </div>
              <Button asChild size="sm" className="rounded-xl shrink-0 font-semibold bg-navy text-white hover:bg-navy/90 transition-colors">
                <Link to="/tools/redirections">
                  <PlusCircle className="mr-1.5 size-3.5" />
                  Create New Link
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
