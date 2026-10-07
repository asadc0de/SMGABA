import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useMemo } from "react";
import {
  listCmsRedirects,
  createCmsRedirect,
  updateCmsRedirect,
  deleteCmsRedirect,
  toggleCmsRedirect,
  type CmsRedirect,
} from "@/lib/redirects.server";
import {
  validateRedirectInput,
  normalizeFromPath,
  normalizeToUrl,
  ALLOWED_STATUS_CODES,
  type RedirectStatusCode,
} from "@/lib/cms-redirects-validator";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Search,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Radio,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/internal/redirects")({
  head: () => ({
    meta: [
      { title: "CMS Redirects Manager | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CmsRedirectsAdminPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

type StatusCodeFilter = "all" | "301" | "302" | "307" | "308";

function CmsRedirectsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [redirects, setRedirects] = useState<CmsRedirect[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusCodeFilter>("all");

  // Create / Edit Modal State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRedirect, setEditingRedirect] = useState<CmsRedirect | null>(null);
  const [formData, setFormData] = useState<{
    from_path: string;
    to_url: string;
    status_code: RedirectStatusCode;
    enabled: boolean;
    note: string;
  }>({
    from_path: "",
    to_url: "",
    status_code: 301,
    enabled: true,
    note: "",
  });
  const [formError, setFormError] = useState<string>("");
  const [formWarning, setFormWarning] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Deletion Modal State
  const [deleteTarget, setDeleteTarget] = useState<CmsRedirect | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
          toast.success("Admin dashboard unlocked.");
        }
        fetchRedirects(pwd);
      } else {
        setIsAuthenticated(false);
        setAuthError(res.error || "Incorrect password. Access denied.");
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError("Failed to verify password. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAdminPassword("");
    setPasswordInput("");
    setRedirects([]);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
    toast.info("Dashboard locked.");
  }

  async function fetchRedirects(pwd?: string) {
    const passwordToUse = pwd || adminPassword;
    if (!passwordToUse) return;

    setIsLoading(true);
    try {
      const res = await listCmsRedirects({ data: { adminPassword: passwordToUse } });
      if (res.success && res.redirects) {
        startTransition(() => {
          setRedirects(res.redirects || []);
        });
      } else {
        toast.error(res.error || "Failed to load redirects.");
      }
    } catch {
      toast.error("An error occurred while loading redirects.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenCreateModal() {
    setEditingRedirect(null);
    setFormData({
      from_path: "",
      to_url: "",
      status_code: 301,
      enabled: true,
      note: "",
    });
    setFormError("");
    setFormWarning("");
    setIsFormOpen(true);
  }

  function handleOpenEditModal(redirect: CmsRedirect) {
    setEditingRedirect(redirect);
    setFormData({
      from_path: redirect.from_path,
      to_url: redirect.to_url,
      status_code: redirect.status_code,
      enabled: redirect.enabled,
      note: redirect.note || "",
    });
    setFormError("");
    setFormWarning("");
    setIsFormOpen(true);
  }

  // Live validation on form inputs
  function handleFormChange(field: string, value: any) {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      const val = validateRedirectInput(next.from_path, next.to_url, next.status_code);
      setFormError(val.valid ? "" : (val.error || ""));
      setFormWarning(val.warning || "");
      return next;
    });
  }

  async function handleSaveRedirect(e: React.FormEvent) {
    e.preventDefault();
    const val = validateRedirectInput(formData.from_path, formData.to_url, formData.status_code);
    if (!val.valid) {
      setFormError(val.error || "Please correct the errors in the form.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      if (editingRedirect) {
        // Update
        const res = await updateCmsRedirect({
          data: {
            id: editingRedirect.id,
            from_path: formData.from_path,
            to_url: formData.to_url,
            status_code: formData.status_code,
            enabled: formData.enabled,
            note: formData.note,
            adminPassword,
          },
        });

        if (res.success && res.redirect) {
          toast.success(`Updated redirect "${res.redirect.from_path}" -> "${res.redirect.to_url}"`);
          if (res.warning) {
            toast.info(res.warning);
          }
          startTransition(() => {
            setRedirects((prev) =>
              prev.map((r) => (r.id === editingRedirect.id ? res.redirect! : r))
            );
          });
          setIsFormOpen(false);
        } else {
          setFormError(res.error || "Failed to update redirect.");
        }
      } else {
        // Create
        const res = await createCmsRedirect({
          data: {
            from_path: formData.from_path,
            to_url: formData.to_url,
            status_code: formData.status_code,
            enabled: formData.enabled,
            note: formData.note,
            adminPassword,
          },
        });

        if (res.success && res.redirect) {
          toast.success(`Created redirect "${res.redirect.from_path}" -> "${res.redirect.to_url}"`);
          if (res.warning) {
            toast.info(res.warning);
          }
          startTransition(() => {
            setRedirects((prev) => [res.redirect!, ...prev]);
          });
          setIsFormOpen(false);
        } else {
          setFormError(res.error || "Failed to create redirect.");
        }
      }
    } catch (err: any) {
      setFormError(err?.message || "An error occurred while saving the redirect.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleEnabled(redirect: CmsRedirect) {
    setActionLoadingId(redirect.id);
    const newEnabled = !redirect.enabled;

    try {
      const res = await toggleCmsRedirect({
        data: {
          id: redirect.id,
          enabled: newEnabled,
          adminPassword,
        },
      });

      if (res.success && res.redirect) {
        toast.success(
          newEnabled
            ? `Enabled redirect for ${redirect.from_path}`
            : `Disabled redirect for ${redirect.from_path}`
        );
        startTransition(() => {
          setRedirects((prev) =>
            prev.map((r) => (r.id === redirect.id ? res.redirect! : r))
          );
        });
      } else {
        toast.error(res.error || "Failed to update redirect status.");
      }
    } catch {
      toast.error("Failed to toggle redirect status.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await deleteCmsRedirect({
        data: {
          id: deleteTarget.id,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(`Deleted redirect "${deleteTarget.from_path}"`);
        startTransition(() => {
          setRedirects((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        });
        setDeleteTarget(null);
      } else {
        toast.error(res.error || "Failed to delete redirect.");
      }
    } catch {
      toast.error("An error occurred while deleting the redirect.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Filtered Redirects
  const filteredRedirects = useMemo(() => {
    let result = [...redirects];

    if (statusFilter !== "all") {
      result = result.filter((r) => String(r.status_code) === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.from_path.toLowerCase().includes(q) ||
          r.to_url.toLowerCase().includes(q) ||
          (r.note && r.note.toLowerCase().includes(q))
      );
    }

    return result;
  }, [redirects, statusFilter, searchQuery]);

  const totalHits = useMemo(
    () => redirects.reduce((sum, r) => sum + (Number(r.hits) || 0), 0),
    [redirects]
  );

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
              Redirects Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Configure 301/302 redirects, preserve SEO traffic, and monitor hit counts.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchRedirects(adminPassword)}
                disabled={isLoading}
                className="gap-1.5 h-8 text-xs"
              >
                <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-navy hover:bg-navy/5 h-8 text-xs">
                <Link to="/cms">
                  <FileText className="size-3.5" />
                  CMS Pages
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-navy hover:bg-navy/5 h-8 text-xs">
                <Link to="/internal/settings">
                  <Settings className="size-3.5" />
                  Site Settings &amp; Nav
                </Link>
              </Button>
              <Button
                onClick={handleOpenCreateModal}
                size="sm"
                className="bg-navy text-white hover:bg-navy/90 gap-1.5 rounded-full h-8 text-xs font-semibold"
              >
                <PlusCircle className="size-3.5" />
                Add Redirect
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
              Enter your internal admin password to manage site redirects.
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
          /* Redirects Content Area */
          <div className="mt-6 space-y-4">
            {/* Quick Metrics & Search/Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
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
                  All ({redirects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("301")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "301"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  301 Permanent ({redirects.filter((r) => r.status_code === 301).length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("302")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "302"
                      ? "bg-white text-amber-700 shadow-xs"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  302 Temporary ({redirects.filter((r) => r.status_code === 302).length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search from, to, or note..."
                    className="pl-8 h-8 text-xs rounded-xl bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50/80 border border-blue-100 text-xs font-medium text-blue-900 shrink-0">
                  <TrendingUp className="size-3.5 text-blue-600" />
                  <span>Total Hits: {totalHits.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Redirects Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {isLoading ? (
                <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
                  <RefreshCw className="size-6 animate-spin text-navy" />
                  <p className="text-xs">Loading redirect rules...</p>
                </div>
              ) : filteredRedirects.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <ArrowRight className="size-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No redirect rules found</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? "No redirects match your search filter."
                      : "Create your first 301 or 302 redirect to ensure smooth URL transitions."}
                  </p>
                  {!searchQuery && (
                    <Button
                      onClick={handleOpenCreateModal}
                      size="sm"
                      className="mt-4 bg-navy text-white hover:bg-navy/90 rounded-full text-xs font-semibold"
                    >
                      <PlusCircle className="size-3.5 mr-1.5" />
                      Add First Redirect
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-4">From Path</th>
                        <th className="py-3 px-4">To Destination</th>
                        <th className="py-3 px-3 text-center">Type</th>
                        <th className="py-3 px-3 text-center">Active</th>
                        <th className="py-3 px-3 text-center">Hits</th>
                        <th className="py-3 px-4">Note</th>
                        <th className="py-3 px-4">Updated</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRedirects.map((r) => {
                        const isExternal = r.to_url.startsWith("http://") || r.to_url.startsWith("https://");
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-navy">
                              <a
                                href={r.from_path}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline flex items-center gap-1 text-[#1b4e94]"
                                title="Test redirect"
                              >
                                <span>{r.from_path}</span>
                                <ExternalLink className="size-2.5 opacity-60" />
                              </a>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate font-mono text-slate-600">
                              <span title={r.to_url}>{r.to_url}</span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.status_code === 301
                                    ? "bg-blue-100 text-blue-800"
                                    : r.status_code === 302
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {r.status_code}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                disabled={actionLoadingId === r.id}
                                onClick={() => handleToggleEnabled(r)}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                  r.enabled
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                }`}
                              >
                                {r.enabled ? "Active" : "Disabled"}
                              </button>
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                              {Number(r.hits || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-slate-500 max-w-[180px] truncate" title={r.note || ""}>
                              {r.note || "—"}
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                              {new Date(r.updated_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditModal(r)}
                                  className="size-7 p-0 text-slate-600 hover:text-navy hover:bg-slate-100"
                                  title="Edit Redirect"
                                >
                                  <Edit className="size-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteTarget(r)}
                                  className="size-7 p-0 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                                  title="Delete Redirect"
                                >
                                  <Trash2 className="size-3.5" />
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
            </div>
          </div>
        )}

        {/* Add / Edit Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-lg bg-white p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-navy flex items-center gap-2">
                <ArrowRight className="size-5 text-[#1b4e94]" />
                {editingRedirect ? "Edit Redirect Rule" : "Add New URL Redirect"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1">
                Configure source paths and target URLs. Redirects apply automatically to incoming requests.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveRedirect} className="space-y-4 mt-3">
              <div>
                <Label htmlFor="from_path" className="text-xs font-semibold text-slate-700">
                  Source Path (From)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="from_path"
                    value={formData.from_path}
                    onChange={(e) => handleFormChange("from_path", e.target.value)}
                    placeholder="/old-service-page"
                    className="font-mono text-xs"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Must start with <code>/</code> (e.g., <code>/old-tax-page</code>). Single-segment paths are resolved instantly.
                </p>
              </div>

              <div>
                <Label htmlFor="to_url" className="text-xs font-semibold text-slate-700">
                  Destination Target (To)
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="to_url"
                    value={formData.to_url}
                    onChange={(e) => handleFormChange("to_url", e.target.value)}
                    placeholder="/solutions/tax or https://..."
                    className="font-mono text-xs"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Use an internal path like <code>/solutions/tax</code> or external <code>https://...</code>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status_code" className="text-xs font-semibold text-slate-700">
                    HTTP Redirect Type
                  </Label>
                  <select
                    id="status_code"
                    value={formData.status_code}
                    onChange={(e) => handleFormChange("status_code", Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={301}>301 — Moved Permanently (SEO Standard)</option>
                    <option value={302}>302 — Found / Temporary</option>
                    <option value={307}>307 — Temporary Redirect</option>
                    <option value={308}>308 — Permanent Redirect</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="enabled" className="text-xs font-semibold text-slate-700">
                    Rule Status
                  </Label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={formData.enabled}
                      onChange={(e) => handleFormChange("enabled", e.target.checked)}
                      className="size-4 rounded border-slate-300 text-navy focus:ring-navy"
                    />
                    <label htmlFor="enabled" className="text-xs font-medium text-slate-700 cursor-pointer">
                      Enabled &amp; Active
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="note" className="text-xs font-semibold text-slate-700">
                  Internal Note (Optional)
                </Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={(e) => handleFormChange("note", e.target.value)}
                  placeholder="e.g. Renamed Q3 service campaign page"
                  className="mt-1 text-xs"
                />
              </div>

              {/* Warnings and Errors */}
              {formWarning && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
                  <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{formWarning}</span>
                </div>
              )}

              {formError && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSaving}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving || Boolean(formError)}
                  className="bg-navy text-white hover:bg-navy/90 text-xs font-semibold"
                >
                  {isSaving ? "Saving..." : editingRedirect ? "Save Changes" : "Create Redirect"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <DialogContent className="max-w-md bg-white p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
                <Trash2 className="size-5" />
                Delete Redirect Rule
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 mt-2">
                Are you sure you want to delete the redirect from{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-navy">
                  {deleteTarget?.from_path}
                </code>{" "}
                to{" "}
                <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-navy">
                  {deleteTarget?.to_url}
                </code>
                ? Traffic hitting this path will no longer be redirected.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-semibold"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
