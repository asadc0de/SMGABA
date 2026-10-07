import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useMemo } from "react";
import {
  getAllCmsPages,
  deleteCmsPage,
  duplicateCmsPage,
  unpublishCmsPage,
  publishCmsPage,
  getCmsSiteSettings,
  type CmsPage,
} from "@/lib/cms.server";
import { type CmsSiteSettings } from "@/lib/cms-settings";
import { findPageNavigationLinks, type PageNavLinkLocation } from "@/lib/cms-nav-helpers";
import { AddToNavigationDialog } from "@/components/cms/AddToNavigationDialog";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Lock,
  Unlock,
  FileText,
  PlusCircle,
  RefreshCw,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Search,
  Copy,
  Globe,
  ArrowUpDown,
  Filter,
  AlertTriangle,
  Menu,
} from "lucide-react";

export const Route = createFileRoute("/cms/")({
  head: () => ({
    meta: [
      { title: "CMS Pages Admin | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CmsPagesListPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

type StatusFilter = "all" | "published" | "draft";
type SortOption = "updated_desc" | "updated_asc" | "title_asc";

function CmsPagesListPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [pages, setPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Settings & Navigation link state
  const [siteSettings, setSiteSettings] = useState<CmsSiteSettings | null>(null);
  const [addToNavTargetPage, setAddToNavTargetPage] = useState<CmsPage | null>(null);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated_desc");

  // Deletion Safeguard Modal State
  const [deleteTargetPage, setDeleteTargetPage] = useState<CmsPage | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Unpublish Confirmation Modal State (for pages linked in nav)
  const [unpublishTargetPage, setUnpublishTargetPage] = useState<CmsPage | null>(null);
  const [isUnpublishing, setIsUnpublishing] = useState<boolean>(false);

  const [, startTransition] = useTransition();

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
    setAuthError("");

    try {
      const res = await verifyAdminPassword({ data: pwd });
      if (res.authorized) {
        setIsAuthenticated(true);
        setAdminPassword(pwd);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(AUTH_STORAGE_KEY, pwd);
        }
        if (showToast) {
          toast.success("Admin access granted");
        }
        fetchPages(pwd);
      } else {
        setIsAuthenticated(false);
        setAuthError(res.error || "Incorrect password. Please try again.");
        if (showToast) {
          toast.error(res.error || "Incorrect password");
        }
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      setAuthError("Failed to verify password. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function fetchPages(pwd: string) {
    setIsLoading(true);
    try {
      const [res, settingsRes] = await Promise.all([
        getAllCmsPages({ data: { adminPassword: pwd } }),
        getCmsSiteSettings(),
      ]);

      if (res.success) {
        setPages(res.pages);
      } else {
        toast.error(res.error || "Failed to load CMS pages");
      }

      if (settingsRes?.settings) {
        setSiteSettings(settingsRes.settings);
      }
    } catch (err) {
      console.error("Error fetching pages:", err);
      toast.error("Failed to load CMS pages");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAdminPassword("");
    setPasswordInput("");
    setPages([]);
    setSiteSettings(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
    toast.info("Logged out from admin tools");
  }

  async function handleDuplicate(page: CmsPage) {
    setActionLoadingId(`dup-${page.id}`);
    try {
      const res = await duplicateCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        toast.success(`Duplicated "${page.title}" as "${res.page.title}"`);
        startTransition(() => {
          setPages((prev) => [res.page!, ...prev]);
        });
      } else {
        toast.error(res.error || "Failed to duplicate page.");
      }
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error("Failed to duplicate page.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function executeUnpublish(page: CmsPage) {
    setActionLoadingId(`pub-${page.id}`);
    try {
      const res = await unpublishCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        toast.success(`Unpublished "${page.title}". Status is now Draft.`);
        startTransition(() => {
          setPages((prev) =>
            prev.map((p) => (p.id === page.id ? { ...p, status: "draft", updated_at: res.page!.updated_at } : p))
          );
        });
        setUnpublishTargetPage(null);
      } else {
        toast.error(res.error || "Failed to unpublish page.");
      }
    } catch (err) {
      console.error("Unpublish error:", err);
      toast.error("Failed to unpublish page.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleTogglePublish(page: CmsPage) {
    const isCurrentlyPublished = page.status === "published";

    if (isCurrentlyPublished) {
      const navLinks = findPageNavigationLinks(page.slug, siteSettings);
      if (navLinks.length > 0) {
        // Page is linked in navigation; prompt with non-blocking warning modal
        setUnpublishTargetPage(page);
        return;
      }
      await executeUnpublish(page);
      return;
    }

    // Publish
    setActionLoadingId(`pub-${page.id}`);
    try {
      const res = await publishCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        toast.success(`Published "${page.title}"! Live at /${res.page.slug}`);
        startTransition(() => {
          setPages((prev) =>
            prev.map((p) => (p.id === page.id ? { ...p, status: "published", updated_at: res.page!.updated_at } : p))
          );
        });
      } else {
        toast.error(res.error || "Failed to publish page.");
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
      toast.error("Failed to update page publish status.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTargetPage) return;
    setIsDeleting(true);
    try {
      const res = await deleteCmsPage({
        data: {
          id: deleteTargetPage.id,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(`Page "${deleteTargetPage.title}" deleted.`);
        startTransition(() => {
          setPages((prev) => prev.filter((p) => p.id !== deleteTargetPage.id));
        });
        setDeleteTargetPage(null);
      } else {
        toast.error(res.error || "Failed to delete page.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("An error occurred while deleting the page.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Filtered & Sorted Pages
  const filteredPages = useMemo(() => {
    let result = [...pages];

    // Status Filter
    if (statusFilter === "published") {
      result = result.filter((p) => p.status === "published");
    } else if (statusFilter === "draft") {
      result = result.filter((p) => p.status === "draft");
    }

    // Search Query (title or slug)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "updated_desc") {
      result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (sortBy === "updated_asc") {
      result.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
    } else if (sortBy === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [pages, statusFilter, searchQuery, sortBy]);

  const publishedCount = useMemo(() => pages.filter((p) => p.status === "published").length, [pages]);
  const draftCount = useMemo(() => pages.filter((p) => p.status === "draft").length, [pages]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-block size-2 rounded-full bg-primary" />
              Internal Admin
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-hero text-navy">
              CMS Pages Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Create, edit, duplicate, version, and publish custom visual CMS pages.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPages(adminPassword)}
                disabled={isLoading}
                className="gap-1.5 h-8 text-xs"
              >
                <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-navy hover:bg-navy/5 h-8 text-xs">
                <Link to="/internal/redirects">
                  <ArrowUpDown className="size-3.5" />
                  Redirects
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-navy hover:bg-navy/5 h-8 text-xs">
                <Link to="/internal/settings">
                  <Settings className="size-3.5" />
                  Site Settings &amp; Nav
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-navy text-white hover:bg-navy/90 gap-1.5 rounded-full h-8 text-xs font-semibold">
                <Link to="/cms/new">
                  <PlusCircle className="size-3.5" />
                  New Page
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-slate-800 text-xs h-8"
              >
                <Lock className="size-3.5 mr-1" />
                Lock
              </Button>
            </div>
          )}
        </div>

        {/* Authentication Modal / Box */}
        {!isAuthenticated ? (
          <div className="mt-12 max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="size-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mx-auto mb-4">
              <Lock className="size-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-navy">Admin Access Required</h2>
            <p className="text-xs text-center text-slate-500 mt-1 mb-6">
              Enter your internal admin password to manage visual CMS pages.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyPassword(passwordInput);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="admin-pw" className="text-xs font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="admin-pw"
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password..."
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <AlertCircle className="size-3.5" />
                    {authError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-navy text-white hover:bg-navy/90 rounded-full"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Unlock className="size-4 mr-2" />
                    Unlock Dashboard
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* Pages List View & Filters */
          <div className="mt-6 space-y-4">
            {/* Search, Status Tabs, and Sort Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "all"
                      ? "bg-white text-navy shadow-xs"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  All Pages ({pages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("published")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "published"
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Published ({publishedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("draft")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "draft"
                      ? "bg-white text-amber-700 shadow-xs"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Drafts ({draftCount})
                </button>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or slug..."
                    className="pl-8 text-xs h-8 rounded-lg bg-slate-50 border-slate-200 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <ArrowUpDown className="size-3.5 text-slate-400 hidden sm:inline" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label="Sort pages"
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none focus:border-navy"
                  >
                    <option value="updated_desc">Recently Updated</option>
                    <option value="updated_asc">Oldest First</option>
                    <option value="title_asc">Alphabetical (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table or Empty States */}
            {pages.length === 0 && !isLoading ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <FileText className="size-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-navy">No CMS Pages Yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                  Get started by creating your first landing page with the visual editor.
                </p>
                <Button asChild className="bg-navy text-white hover:bg-navy/90 rounded-full">
                  <Link to="/cms/new">
                    <PlusCircle className="size-4 mr-2" />
                    Create First Page
                  </Link>
                </Button>
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                <Filter className="size-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-semibold text-navy">No Matching Pages Found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
                  No pages match your current search query or filter selection.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="text-xs rounded-full"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5">Page Title</th>
                        <th className="px-5 py-3.5">Slug / URL</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Last Updated</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPages.map((page) => (
                        <tr key={page.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-navy">
                            <div className="flex items-center gap-2">
                              <FileText className="size-4 text-slate-400 shrink-0" />
                              <span className="font-semibold text-xs sm:text-sm">{page.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                            /{page.slug}
                          </td>
                          <td className="px-5 py-3.5">
                            {page.status === "published" ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="size-1.5 rounded-full bg-amber-500" />
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <Calendar className="size-3.5 text-slate-400" />
                              {new Date(page.updated_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Draft */}
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-7 px-2 text-xs text-slate-600 hover:text-navy"
                                title="Preview Draft with full site layout"
                              >
                                <Link to="/cms/$id/preview" params={{ id: page.id }} target="_blank">
                                  <Eye className="size-3.5 mr-1" />
                                  Preview
                                </Link>
                              </Button>

                              {/* Live URL if published */}
                              {page.status === "published" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-7 px-2 text-xs text-emerald-700 hover:text-emerald-900"
                                    title="View published page on main site"
                                  >
                                    <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="size-3.5 mr-1" />
                                      Live
                                    </a>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setAddToNavTargetPage(page)}
                                    className="h-7 px-2 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                                    title="Add page to Header or Footer navigation"
                                  >
                                    <Menu className="size-3.5 mr-1" />
                                    Add to Nav
                                  </Button>
                                </>
                              )}

                              {/* Quick Publish / Unpublish Toggle */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTogglePublish(page)}
                                disabled={actionLoadingId === `pub-${page.id}`}
                                className={`h-7 px-2 text-xs ${
                                  page.status === "published"
                                    ? "text-amber-700 hover:bg-amber-50"
                                    : "text-emerald-700 hover:bg-emerald-50"
                                }`}
                                title={page.status === "published" ? "Unpublish page to draft" : "Publish page to live"}
                              >
                                {actionLoadingId === `pub-${page.id}` ? (
                                  <RefreshCw className="size-3.5 animate-spin" />
                                ) : page.status === "published" ? (
                                  <>
                                    <EyeOff className="size-3.5 mr-1" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Globe className="size-3.5 mr-1" />
                                    Publish
                                  </>
                                )}
                              </Button>

                              {/* Duplicate Page */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicate(page)}
                                disabled={actionLoadingId === `dup-${page.id}`}
                                className="h-7 px-2 text-xs text-slate-600 hover:text-navy"
                                title="Duplicate page with all blocks and settings"
                              >
                                <Copy className={`size-3.5 ${actionLoadingId === `dup-${page.id}` ? "animate-spin" : ""}`} />
                              </Button>

                              {/* Edit Page */}
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-7 px-2.5 text-xs text-navy hover:bg-navy hover:text-white rounded-full font-medium"
                              >
                                <Link to="/cms/$id/edit" params={{ id: page.id }}>
                                  <Edit className="size-3.5 mr-1" />
                                  Edit
                                </Link>
                              </Button>

                              {/* Delete Page */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTargetPage(page)}
                                className="h-7 px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                title="Delete page"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Styled Deletion Safeguard Dialog */}
      <Dialog open={Boolean(deleteTargetPage)} onOpenChange={(open) => !open && setDeleteTargetPage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-rose-700">
              <AlertTriangle className="size-5 text-rose-600" />
              Delete Page Confirmation
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              Are you sure you want to permanently delete the page:
              <br />
              <strong className="text-navy font-semibold text-sm mt-1 block">
                &ldquo;{deleteTargetPage?.title}&rdquo; (/{deleteTargetPage?.slug})
              </strong>
            </DialogDescription>
          </DialogHeader>

          {/* Linked Navigation Warning */}
          {deleteTargetPage && findPageNavigationLinks(deleteTargetPage.slug, siteSettings).length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1 my-2">
              <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                Warning: This page is currently linked in navigation:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
                {findPageNavigationLinks(deleteTargetPage.slug, siteSettings).map((loc, i) => (
                  <li key={i}>{loc.location}</li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-700 pt-1">
                Deleting this page will leave broken links on the site until they are removed in Site Settings.
              </p>
            </div>
          )}

          {deleteTargetPage?.status === "published" && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2 my-2">
              <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Warning:</strong> This page is currently <strong>Published</strong>. Deleting it will immediately cause visitors to receive a 404 Not Found error at <code className="font-mono">/{deleteTargetPage.slug}</code>.
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500">
            This action cannot be undone and will delete all associated revision history snapshots.
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteTargetPage(null)}
              disabled={isDeleting}
              className="text-xs rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-xs rounded-full bg-rose-600 hover:bg-rose-700"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unpublish Safeguard Dialog (when page is linked in navigation) */}
      <Dialog open={Boolean(unpublishTargetPage)} onOpenChange={(open) => !open && setUnpublishTargetPage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-amber-700">
              <AlertTriangle className="size-5 text-amber-600" />
              Unpublish Page Warning
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-2">
              Are you sure you want to unpublish:
              <br />
              <strong className="text-navy font-semibold text-sm mt-1 block">
                &ldquo;{unpublishTargetPage?.title}&rdquo; (/{unpublishTargetPage?.slug})
              </strong>
            </DialogDescription>
          </DialogHeader>

          {unpublishTargetPage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1 my-2">
              <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                This page is currently linked in navigation:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
                {findPageNavigationLinks(unpublishTargetPage.slug, siteSettings).map((loc, i) => (
                  <li key={i}>{loc.location}</li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-700 pt-1">
                Visitors clicking those navigation links will receive a 404 Not Found error until the page is republished or the links are removed in Site Settings.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUnpublishTargetPage(null)}
              disabled={isUnpublishing}
              className="text-xs rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => unpublishTargetPage && executeUnpublish(unpublishTargetPage)}
              disabled={isUnpublishing}
              className="text-xs rounded-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isUnpublishing ? "Unpublishing..." : "Proceed & Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Navigation Dialog */}
      <AddToNavigationDialog
        page={addToNavTargetPage}
        isOpen={Boolean(addToNavTargetPage)}
        onClose={() => setAddToNavTargetPage(null)}
        adminPassword={adminPassword}
        onSuccess={() => fetchPages(adminPassword)}
      />

      <Footer />
    </div>
  );
}
