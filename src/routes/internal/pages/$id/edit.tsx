import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Puck, type Data } from "@puckeditor/core";
import puckCssUrl from "@puckeditor/core/dist/index.css?url";
import { puckConfig } from "@/cms/puck.config";
import { getCmsPageById, saveCmsPage, type CmsPage } from "@/lib/cms.server";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import {
  Lock,
  Unlock,
  ArrowLeft,
  Save,
  Globe,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/internal/pages/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Page | SMG ABA Visual Builder" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "stylesheet", href: puckCssUrl },
    ],
  }),
  component: CmsPageEditorRoute,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

const editorViewports = [
  { width: 390, height: "auto" as const, label: "Mobile", icon: "Smartphone" as const },
  { width: 820, height: "auto" as const, label: "Tablet", icon: "Tablet" as const },
  { width: 1280, height: "auto" as const, label: "Desktop", icon: "Monitor" as const },
];

function CmsPageEditorRoute() {
  const { id } = useParams({ from: "/internal/pages/$id/edit" });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Page & Editor State
  const [page, setPage] = useState<CmsPage | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Keep a reference to latest editor data
  const currentDataRef = useRef<Data>({ content: [], root: {} });

  // Auto-verify on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        verifyPassword(stored, false, true);
      }
    }
  }, [id]);

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
        loadPage(pwd);
      } else {
        setIsAuthenticated(false);
        setAuthError(res.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      setAuthError("Failed to verify password.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function loadPage(pwd: string) {
    setIsLoadingPage(true);
    try {
      const res = await getCmsPageById({
        data: {
          id,
          adminPassword: pwd,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data || { content: [], root: {} };
      } else {
        toast.error(res.error || "Failed to load page details.");
      }
    } catch (err) {
      console.error("Error loading page:", err);
      toast.error("Failed to load page data.");
    } finally {
      setIsLoadingPage(false);
    }
  }

  async function handleSaveDraft(dataToSave?: Data) {
    if (!page) return;
    const payloadData = dataToSave || currentDataRef.current;

    setIsSaving(true);
    try {
      const res = await saveCmsPage({
        data: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          data: payloadData,
          status: "draft",
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data;
        setLastSavedTime(new Date().toLocaleTimeString());
        toast.success("Draft saved successfully.");
      } else {
        toast.error(res.error || "Failed to save draft.");
      }
    } catch (err) {
      console.error("Save draft error:", err);
      toast.error("An error occurred while saving draft.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish(publishedData: Data) {
    if (!page) return;
    currentDataRef.current = publishedData;

    setIsPublishing(true);
    try {
      const res = await saveCmsPage({
        data: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          data: publishedData,
          status: "published",
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data;
        setLastSavedTime(new Date().toLocaleTimeString());
        toast.success(`Page published! Available at /${res.page.slug}`);
      } else {
        toast.error(res.error || "Failed to publish page.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("An error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      <Toaster position="top-right" richColors />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-navy">
              <Link to="/internal/pages">
                <ArrowLeft className="size-4" />
                Pages
              </Link>
            </Button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            {page && (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-navy truncate max-w-xs sm:max-w-md">
                    {page.title}
                  </h1>
                  {page.status === "published" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-500">/{page.slug}</div>
              </div>
            )}
          </div>

          {isAuthenticated && page && (
            <div className="flex items-center gap-2">
              {lastSavedTime && (
                <span className="text-xs text-slate-400 hidden md:inline">
                  Saved at {lastSavedTime}
                </span>
              )}
              {page.status === "published" && (
                <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-slate-600">
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    View Live
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveDraft()}
                disabled={isSaving || isPublishing}
                className="gap-1.5 text-xs rounded-full border-slate-300"
              >
                <Save className={`size-3.5 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                size="sm"
                onClick={() => handlePublish(currentDataRef.current)}
                disabled={isSaving || isPublishing}
                className="bg-navy text-white hover:bg-navy/90 gap-1.5 text-xs rounded-full"
              >
                <Globe className={`size-3.5 ${isPublishing ? "animate-spin" : ""}`} />
                {isPublishing ? "Publishing..." : "Publish Page"}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="size-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mx-auto mb-4">
                <Lock className="size-6" />
              </div>
              <h2 className="text-xl font-bold text-center text-navy">Admin Access Required</h2>
              <p className="text-xs text-center text-slate-500 mt-1 mb-6">
                Enter your internal admin password to edit this page.
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
                      Unlock Editor
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : isLoadingPage || !page ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="size-8 text-navy animate-spin" />
              <p className="text-sm font-medium text-slate-600">Loading page in visual editor...</p>
            </div>
          </div>
        ) : (
          /* Visual Puck Editor Container */
          <div className="flex-1 bg-white min-h-[calc(100vh-65px)]">
            <Puck
              config={puckConfig}
              data={page.data || { content: [], root: {} }}
              viewports={editorViewports}
              iframe={{ enabled: true, syncHostStyles: true }}
              onPublish={handlePublish}
              onChange={(newData) => {
                currentDataRef.current = newData;
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
