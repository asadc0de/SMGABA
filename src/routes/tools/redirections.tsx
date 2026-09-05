import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useTransition } from "react";
import { z } from "zod";
import {
  verifyAdminPassword,
  getWebinarRedirectsList,
  saveWebinarRedirect,
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
  PlusCircle,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Database,
  Eye,
  EyeOff,
  ListFilter,
  Sparkles,
} from "lucide-react";

const searchSchema = z.object({
  slug: z.string().optional(),
});

export const Route = createFileRoute("/tools/redirections")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Create Webinar Links | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getWebinarRedirectsList();
      return data;
    } catch (err) {
      console.error("Failed to load initial redirects:", err);
      return { redirects: [], isConfigured: false };
    }
  },
  component: CreateRedirectPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function CreateRedirectPage() {
  const initialData = Route.useLoaderData();
  const search = Route.useSearch();
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

  // Form State
  const [slugInput, setSlugInput] = useState<string>("");
  const [targetUrlInput, setTargetUrlInput] = useState<string>("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastCreated, setLastCreated] = useState<{ slug: string; target_url: string } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Auto-verify on mount if stored in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        verifyPassword(stored, false, true);
      }
    }
  }, []);

  // Check if a slug was passed via query parameter (e.g., from the links table Edit button)
  useEffect(() => {
    if (search.slug && redirects.length > 0) {
      const targetItem = redirects.find(
        (r) => r.slug.toLowerCase() === search.slug?.toLowerCase(),
      );
      if (targetItem) {
        setEditingSlug(targetItem.slug);
        setSlugInput(targetItem.slug);
        setTargetUrlInput(targetItem.target_url);
      } else {
        setSlugInput(search.slug);
      }
    }
  }, [search.slug, redirects]);

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
        toast.error("Failed to refresh redirect list");
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slugInput.trim() || !targetUrlInput.trim()) {
      toast.error("Both Slug and Target URL are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveWebinarRedirect({
        data: {
          slug: slugInput,
          target_url: targetUrlInput,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(
          editingSlug
            ? `Updated redirect for /${slugInput}`
            : `Created redirect: /${slugInput} → ${targetUrlInput}`,
        );
        if (res.error) {
          toast.info(res.error, { duration: 6000 });
        }
        setLastCreated({
          slug: slugInput,
          target_url: targetUrlInput,
        });
        setSlugInput("");
        setTargetUrlInput("");
        setEditingSlug(null);
        // Clear search param if present
        if (search.slug) {
          navigate({ to: "/tools/redirections", search: {} });
        }
        await refreshList();
      } else {
        toast.error(res.error || "Failed to save redirect");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  function cancelEdit() {
    setEditingSlug(null);
    setSlugInput("");
    setTargetUrlInput("");
    if (search.slug) {
      navigate({ to: "/tools/redirections", search: {} });
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

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/20">
      <Toaster position="top-right" richColors />
      <Header />

      <main className="flex-1 py-28 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
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
                Create Redirects Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                This portal is restricted. Please enter the internal administrator password to continue.
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
                      <Unlock className="mr-2 size-4" /> Unlock Creation Portal
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
          /* VIEW 2: DEDICATED LINK CREATION VIEW                              */
          /* =================================================================== */
          <div className="space-y-8">
            {/* Top Bar / Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="eyebrow bg-navy/10 text-navy px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    Link Creator
                  </span>
                </div>
                <h1 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy mt-1">
                  Create Webinar & Redirect Link
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Generate branded shortlinks for texting or sharing with clients.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <Button
                  asChild
                  className="rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold shadow-xs transition-colors"
                >
                  <Link to="/tools/links">
                    <ListFilter className="mr-2 size-4 text-white" />
                    See Webinar Links
                    <span className="ml-2 font-mono text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                      {redirects.length}
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Lock className="mr-1.5 size-3.5" />
                  Lock Portal
                </Button>
              </div>
            </div>

            {/* Last Created Success Banner */}
            {lastCreated && (
              <div className="card-surface p-5 border-green-500/30 bg-green-500/5 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold text-sm">
                    <Sparkles className="size-4" />
                    <span>Link created successfully and ready to text!</span>
                  </div>
                  <button
                    onClick={() => setLastCreated(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-background border border-border/80">
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-mono font-bold text-sm text-navy truncate">
                      https://smgaba.com/{lastCreated.slug}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      &rarr; {lastCreated.target_url}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(lastCreated.slug)}
                      className="rounded-xl bg-navy text-white hover:bg-navy/90 text-xs font-semibold"
                    >
                      {copiedSlug === lastCreated.slug ? (
                        <>
                          <Check className="mr-1.5 size-3.5 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 size-3.5" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs border-navy/20 text-navy hover:bg-navy hover:text-white transition-colors"
                    >
                      <Link to="/tools/links">View in Directory</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* MAIN CREATION / EDIT FORM                                       */}
            {/* =============================================================== */}
            <div className="card-surface p-6 sm:p-8 border-border/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-navy text-white text-sm shadow-xs">
                    {editingSlug ? <Edit2 className="size-5" /> : <PlusCircle className="size-5" />}
                  </div>
                  <div>
                    <h2 className="font-bold text-navy text-lg">
                      {editingSlug ? `Editing "/${editingSlug}"` : "New Redirect Shortlink"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {editingSlug
                        ? "Update the destination URL for this existing slug"
                        : "Enter the slug and the webinar or destination URL"}
                    </p>
                  </div>
                </div>

                {editingSlug && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Slug Input */}
                <div>
                  <Label htmlFor="slug-input" className="text-xs font-semibold text-navy">
                    Shortlink Slug (Path) <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1.5 flex rounded-xl border border-input focus-within:ring-2 focus-within:ring-primary bg-background overflow-hidden shadow-xs">
                    <span className="inline-flex items-center px-3.5 bg-secondary text-xs text-muted-foreground border-r font-mono font-medium">
                      smgaba.com/
                    </span>
                    <Input
                      id="slug-input"
                      type="text"
                      placeholder="e.g. spring-tax-planning-webinar"
                      value={slugInput}
                      onChange={(e) =>
                        setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                      }
                      className="border-0 focus-visible:ring-0 rounded-none font-mono text-sm h-11"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1.5 text-[11.5px] text-muted-foreground">
                    <span>
                      Live Shortlink:{" "}
                      <code className="font-mono text-primary font-bold">
                        smgaba.com/{slugInput || "your-slug"}
                      </code>
                    </span>
                    <span className="text-[11px] opacity-80">Lowercase letters, numbers, hyphens</span>
                  </div>
                </div>

                {/* Target URL Input */}
                <div>
                  <Label htmlFor="target-input" className="text-xs font-semibold text-navy">
                    Target Destination URL <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1.5">
                    <Input
                      id="target-input"
                      type="text"
                      placeholder="https://events.teams.microsoft.com/... or https://zoom.us/j/..."
                      value={targetUrlInput}
                      onChange={(e) => setTargetUrlInput(e.target.value)}
                      className="rounded-xl font-mono text-sm focus-visible:ring-primary h-11 shadow-xs"
                      required
                    />
                  </div>
                  <p className="text-[11.5px] text-muted-foreground mt-1.5 leading-relaxed">
                    Paste the full Microsoft Teams Events registration URL, Zoom invite, YouTube stream, or internal path (e.g. <code className="font-mono text-navy font-semibold">/contact</code>).
                  </p>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold py-6 transition-transform active:scale-[0.99] text-sm shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 size-4 animate-spin" /> Saving Shortlink...
                      </>
                    ) : editingSlug ? (
                      <>
                        <Check className="mr-2 size-4" /> Update Shortlink
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 size-4" /> Save & Create Shortlink
                      </>
                    )}
                  </Button>

                  {editingSlug && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      className="rounded-xl py-6 px-6 font-medium border-navy/20 text-navy hover:bg-navy hover:text-white transition-colors"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Directory Navigation Quick Banner */}
            <div className="card-surface p-6 border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-navy text-base flex items-center gap-2">
                  <ListFilter className="size-4 text-primary" />
                  Looking for existing webinar links?
                </h3>
                <p className="text-xs text-muted-foreground">
                  View, search, copy, or delete from all {redirects.length} configured shortlinks in the paginated directory.
                </p>
              </div>

              <Button
                asChild
                className="rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold shrink-0"
              >
                <Link to="/tools/links">
                  See Webinar Links ({redirects.length})
                  <ArrowRight className="ml-2 size-4" />
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
