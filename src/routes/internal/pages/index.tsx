import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition } from "react";
import { getAllCmsPages, deleteCmsPage, type CmsPage } from "@/lib/cms.server";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
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
} from "lucide-react";

export const Route = createFileRoute("/internal/pages/")({
  head: () => ({
    meta: [
      { title: "CMS Pages Admin | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CmsPagesListPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function CmsPagesListPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [pages, setPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      const res = await getAllCmsPages({ data: { adminPassword: pwd } });
      if (res.success) {
        setPages(res.pages);
      } else {
        toast.error(res.error || "Failed to load CMS pages");
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
    toast.info("Logged out from admin tools");
  }

  async function handleDelete(page: CmsPage) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the page "${page.title}" (/${page.slug})? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    setDeletingId(page.id);
    try {
      const res = await deleteCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(`Page "${page.title}" deleted.`);
        startTransition(() => {
          setPages((prev) => prev.filter((p) => p.id !== page.id));
        });
      } else {
        toast.error(res.error || "Failed to delete page.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("An error occurred while deleting the page.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />
      <Toaster position="top-right" richColors />

      <main className="flex-1 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-block size-2 rounded-full bg-primary" />
              Internal Admin
            </div>
            <h1 className="text-3xl font-bold font-serif-hero text-navy">
              CMS Pages Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Create, edit, and publish custom landing pages with visual blocks.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPages(adminPassword)}
                disabled={isLoading}
                className="gap-1.5"
              >
                <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button asChild size="sm" className="bg-navy text-white hover:bg-navy/90 gap-1.5 rounded-full">
                <Link to="/internal/pages/new">
                  <PlusCircle className="size-4" />
                  New Page
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-slate-800 text-xs"
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
          /* Pages List View */
          <div className="mt-8 space-y-6">
            {pages.length === 0 && !isLoading ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <FileText className="size-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-navy">No CMS Pages Yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                  Get started by creating your first landing page with the visual editor.
                </p>
                <Button asChild className="bg-navy text-white hover:bg-navy/90 rounded-full">
                  <Link to="/internal/pages/new">
                    <PlusCircle className="size-4 mr-2" />
                    Create First Page
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Page Title</th>
                        <th className="px-6 py-4">Slug / URL</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Last Updated</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pages.map((page) => (
                        <tr key={page.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 font-medium text-navy">
                            <div className="flex items-center gap-2">
                              <FileText className="size-4 text-slate-400 shrink-0" />
                              <span>{page.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">
                            /{page.slug}
                          </td>
                          <td className="px-6 py-4">
                            {page.status === "published" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="size-1.5 rounded-full bg-amber-500" />
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
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
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {page.status === "published" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="h-8 px-2 text-slate-600 hover:text-navy"
                                >
                                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="size-3.5 mr-1" />
                                    View
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-8 px-2.5 text-navy hover:bg-navy hover:text-white"
                              >
                                <Link to="/internal/pages/$id/edit" params={{ id: page.id }}>
                                  <Edit className="size-3.5 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(page)}
                                disabled={deletingId === page.id}
                                className="h-8 px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
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

      <Footer />
    </div>
  );
}
