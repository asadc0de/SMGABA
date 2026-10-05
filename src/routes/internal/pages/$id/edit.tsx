import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Puck, type Data } from "@puckeditor/core";
import puckCssUrl from "@puckeditor/core/dist/index.css?url";
import { puckConfig } from "@/cms/puck.config";
import {
  getCmsPageById,
  saveCmsPage,
  duplicateCmsPage,
  unpublishCmsPage,
  publishCmsPage,
  getCmsPageVersions,
  restoreCmsPageVersion,
  uploadCmsImage,
  type CmsPage,
  type CmsPageVersion,
} from "@/lib/cms.server";
import { isValidCanonicalUrl, type CmsRootProps } from "@/cms/root";
import { isValidImageUrl } from "@/cms/blocks/Image";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Settings,
  Image as ImageIcon,
  Share2,
  Search,
  History,
  Copy,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileCode,
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
  const navigate = useNavigate();

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
  const [isDuplicating, setIsDuplicating] = useState<boolean>(false);
  const [isUnpublishing, setIsUnpublishing] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Version History State
  const [isVersionsOpen, setIsVersionsOpen] = useState<boolean>(false);
  const [versions, setVersions] = useState<CmsPageVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState<boolean>(false);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  // SEO & Page Settings Modal State
  const [isSeoOpen, setIsSeoOpen] = useState<boolean>(false);
  const [seoTab, setSeoTab] = useState<"search" | "social">("search");
  const [seoTitle, setSeoTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [canonicalUrl, setCanonicalUrl] = useState<string>("");
  const [ogTitle, setOgTitle] = useState<string>("");
  const [ogDescription, setOgDescription] = useState<string>("");
  const [ogImage, setOgImage] = useState<string>("");
  const [isUploadingOg, setIsUploadingOg] = useState<boolean>(false);
  const [ogUploadError, setOgUploadError] = useState<string | null>(null);

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

  function syncSeoStateFromData(data?: Data) {
    const rootProps = (data?.root?.props as CmsRootProps) || {};
    setSeoTitle(rootProps.seoTitle || "");
    setMetaDescription(rootProps.metaDescription || "");
    setCanonicalUrl(rootProps.canonicalUrl || "");
    setOgTitle(rootProps.ogTitle || "");
    setOgDescription(rootProps.ogDescription || "");
    setOgImage(rootProps.ogImage || "");
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
        syncSeoStateFromData(res.page.data);
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

  function openSeoSettings() {
    syncSeoStateFromData(currentDataRef.current);
    setIsSeoOpen(true);
  }

  async function handleOpenVersions() {
    setIsVersionsOpen(true);
    setIsLoadingVersions(true);
    try {
      const res = await getCmsPageVersions({
        data: {
          id,
          adminPassword,
        },
      });
      if (res.success) {
        setVersions(res.versions);
      } else {
        toast.error(res.error || "Failed to load version history.");
      }
    } catch (err) {
      console.error("Error loading versions:", err);
      toast.error("Failed to load version history.");
    } finally {
      setIsLoadingVersions(false);
    }
  }

  async function handleRestoreVersion(version: CmsPageVersion) {
    if (!page) return;
    const confirmRestore = window.confirm(
      `Are you sure you want to restore Version #${version.version_number} saved on ${new Date(version.created_at).toLocaleString()}? This will update the editor with this version's content.`
    );
    if (!confirmRestore) return;

    setRestoringVersionId(version.id);
    try {
      const res = await restoreCmsPageVersion({
        data: {
          pageId: page.id,
          versionId: version.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data || { content: [], root: {} };
        syncSeoStateFromData(res.page.data);
        setLastSavedTime(new Date().toLocaleTimeString());
        toast.success(`Restored Version #${version.version_number} successfully!`);
        setIsVersionsOpen(false);
      } else {
        toast.error(res.error || "Failed to restore version.");
      }
    } catch (err) {
      console.error("Restore error:", err);
      toast.error("An error occurred while restoring version.");
    } finally {
      setRestoringVersionId(null);
    }
  }

  async function handleDuplicate() {
    if (!page) return;
    setIsDuplicating(true);
    try {
      const res = await duplicateCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        toast.success(`Page duplicated as "${res.page.title}" (/${res.page.slug})`);
        navigate({ to: "/internal/pages/$id/edit", params: { id: res.page.id } });
      } else {
        toast.error(res.error || "Failed to duplicate page.");
      }
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error("Failed to duplicate page.");
    } finally {
      setIsDuplicating(false);
    }
  }

  async function handleUnpublish() {
    if (!page) return;
    const confirmUnpublish = window.confirm(
      `Are you sure you want to unpublish "${page.title}"? The public URL /${page.slug} will return a 404 until published again.`
    );
    if (!confirmUnpublish) return;

    setIsUnpublishing(true);
    try {
      const res = await unpublishCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        toast.success(`Page unpublished. Status is now Draft.`);
      } else {
        toast.error(res.error || "Failed to unpublish page.");
      }
    } catch (err) {
      console.error("Unpublish error:", err);
      toast.error("Failed to unpublish page.");
    } finally {
      setIsUnpublishing(false);
    }
  }

  async function handleSaveSeoSettings() {
    if (canonicalUrl && !isValidCanonicalUrl(canonicalUrl)) {
      toast.error("Invalid canonical URL. Please enter a valid URL starting with https://, http://, or /");
      return;
    }

    if (ogImage && !isValidImageUrl(ogImage)) {
      toast.error("Invalid Open Graph image URL. data: and javascript: URLs are rejected.");
      return;
    }

    const updatedRootProps: CmsRootProps = {
      ...(currentDataRef.current.root?.props || {}),
      title: page?.title,
      seoTitle: seoTitle.trim(),
      metaDescription: metaDescription.trim(),
      canonicalUrl: canonicalUrl.trim(),
      ogTitle: ogTitle.trim(),
      ogDescription: ogDescription.trim(),
      ogImage: ogImage.trim(),
    };

    const updatedData: Data = {
      ...currentDataRef.current,
      root: {
        ...currentDataRef.current.root,
        props: updatedRootProps,
      },
    };

    currentDataRef.current = updatedData;
    setIsSeoOpen(false);
    await handleSaveDraft(updatedData);
  }

  async function handleOgFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setOgUploadError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setOgUploadError("Image file size must be less than 5MB.");
      return;
    }

    setIsUploadingOg(true);
    setOgUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(",")[1];
        const res = await uploadCmsImage({
          data: {
            fileName: file.name,
            contentType: file.type,
            base64Data,
            adminPassword,
          },
        });

        if (res?.success && res.url) {
          setOgImage(res.url);
          toast.success("Social image uploaded!");
        } else {
          setOgUploadError(res?.error || "Failed to upload image.");
        }
        setIsUploadingOg(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setOgUploadError(err?.message || "Failed to read image file.");
      setIsUploadingOg(false);
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
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-navy h-8">
              <Link to="/internal/pages">
                <ArrowLeft className="size-4" />
                Pages
              </Link>
            </Button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            {page && (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-navy truncate max-w-xs sm:max-w-md">
                    {page.title}
                  </h1>
                  {page.status === "published" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-500">/{page.slug}</div>
              </div>
            )}
          </div>

          {isAuthenticated && page && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {lastSavedTime && (
                <span className="text-[11px] text-slate-400 hidden lg:inline mr-1">
                  Saved {lastSavedTime}
                </span>
              )}

              {/* Preview Button */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-1 text-xs rounded-full border-slate-300 text-slate-700 hover:text-navy h-8"
              >
                <Link to="/internal/pages/$id/preview" params={{ id: page.id }} target="_blank">
                  <Eye className="size-3.5" />
                  Preview
                </Link>
              </Button>

              {/* Version History Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenVersions}
                className="gap-1 text-xs rounded-full border-slate-300 text-slate-700 hover:text-navy h-8"
              >
                <History className="size-3.5" />
                History
              </Button>

              {/* Duplicate Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicate}
                disabled={isDuplicating}
                className="gap-1 text-xs rounded-full border-slate-300 text-slate-700 hover:text-navy h-8"
              >
                <Copy className={`size-3.5 ${isDuplicating ? "animate-spin" : ""}`} />
                {isDuplicating ? "Cloning..." : "Duplicate"}
              </Button>

              {/* SEO & Settings */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSeoOpen(true)}
                className="gap-1 text-xs rounded-full border-slate-300 text-slate-700 hover:text-navy h-8"
              >
                <Settings className="size-3.5" />
                SEO
              </Button>

              {/* Save Draft Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveDraft()}
                disabled={isSaving || isPublishing}
                className="gap-1 text-xs rounded-full border-slate-300 h-8 font-medium"
              >
                <Save className={`size-3.5 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>

              {/* Unpublish or Publish Button */}
              {page.status === "published" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnpublish}
                  disabled={isUnpublishing}
                  className="gap-1 text-xs rounded-full border-amber-300 text-amber-800 hover:bg-amber-50 h-8"
                >
                  <EyeOff className={`size-3.5 ${isUnpublishing ? "animate-spin" : ""}`} />
                  {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                </Button>
              ) : null}

              <Button
                size="sm"
                onClick={() => handlePublish(currentDataRef.current)}
                disabled={isSaving || isPublishing}
                className="bg-navy text-white hover:bg-navy/90 gap-1 text-xs rounded-full h-8 font-semibold shadow-xs"
              >
                <Globe className={`size-3.5 ${isPublishing ? "animate-spin" : ""}`} />
                {isPublishing ? "Publishing..." : page.status === "published" ? "Update Live" : "Publish Page"}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Version History Dialog */}
      <Dialog open={isVersionsOpen} onOpenChange={setIsVersionsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-navy">
              <History className="size-5 text-navy" />
              Revision History
            </DialogTitle>
          </DialogHeader>

          <div className="text-xs text-slate-500 pb-2 border-b border-slate-100">
            Past saved versions of this page (up to 25 latest snapshots retained). You can safely restore any previous version.
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {isLoadingVersions ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
                <RefreshCw className="size-6 animate-spin text-navy" />
                <span className="text-xs">Loading revision snapshots...</span>
              </div>
            ) : versions.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Clock className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No version snapshots recorded yet. Versions are created on every save and publish.</p>
              </div>
            ) : (
              versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-navy/5 text-navy flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      v{ver.version_number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-navy">{ver.title}</span>
                        {ver.status === "published" ? (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Draft
                          </span>
                        )}
                        {idx === 0 && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span>{new Date(ver.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        <span>•</span>
                        <span>{ver.change_summary || "Snapshot"}</span>
                        <span>•</span>
                        <span>{ver.data?.content?.length || 0} blocks</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreVersion(ver)}
                    disabled={restoringVersionId === ver.id}
                    className="h-7 text-xs rounded-full border-slate-300 text-navy hover:bg-navy hover:text-white shrink-0"
                  >
                    <RotateCcw className={`size-3 mr-1 ${restoringVersionId === ver.id ? "animate-spin" : ""}`} />
                    {restoringVersionId === ver.id ? "Restoring..." : "Restore"}
                  </Button>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="border-t border-slate-100 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVersionsOpen(false)}
              className="text-xs rounded-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Settings & SEO Metadata Dialog */}
      <Dialog open={isSeoOpen} onOpenChange={setIsSeoOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-navy">
              <Settings className="size-5 text-navy" />
              Page Settings & SEO Metadata
            </DialogTitle>
          </DialogHeader>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 mt-2">
            <button
              type="button"
              onClick={() => setSeoTab("search")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                seoTab === "search"
                  ? "border-navy text-navy"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Search className="size-3.5" />
              Google Search (SEO)
            </button>
            <button
              type="button"
              onClick={() => setSeoTab("social")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                seoTab === "social"
                  ? "border-navy text-navy"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Share2 className="size-3.5" />
              Social Sharing (Open Graph)
            </button>
          </div>

          <div className="py-4 space-y-4">
            {seoTab === "search" ? (
              <>
                {/* Search Engine Optimization */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seo-title" className="text-xs font-semibold text-slate-700">
                      SEO Title (<code className="text-[11px]">&lt;title&gt;</code>)
                    </Label>
                    <span className={`text-[11px] ${seoTitle.length > 60 ? "text-amber-600" : "text-slate-400"}`}>
                      {seoTitle.length}/60 chars
                    </span>
                  </div>
                  <Input
                    id="seo-title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={`${page?.title || "Page Title"} | SMG ABA`}
                    className="mt-1 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Defaults to &quot;{page?.title || "Page Title"} | SMG ABA&quot; if left empty.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meta-desc" className="text-xs font-semibold text-slate-700">
                      Meta Description
                    </Label>
                    <span className={`text-[11px] ${metaDescription.length > 160 ? "text-amber-600" : "text-slate-400"}`}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    id="meta-desc"
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Brief summary of the page for search engine snippets..."
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <Label htmlFor="canonical-url" className="text-xs font-semibold text-slate-700">
                    Canonical URL (Optional)
                  </Label>
                  <Input
                    id="canonical-url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://smgaba.com/services"
                    className="mt-1 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Only specify if this page is duplicated or republished from another URL.
                  </p>
                </div>

                {/* Google Search Result Preview */}
                <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Google Search Snippet Preview
                  </span>
                  <div className="mt-2 font-sans space-y-1">
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      https://smgaba.com › {page?.slug || "page-slug"}
                    </div>
                    <div className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
                      {seoTitle.trim() || `${page?.title || "Page Title"} | SMG ABA`}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {metaDescription.trim() || "Discover comprehensive ABA therapy services and individualized behavioral health solutions tailored for your child at SMG ABA."}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Social Sharing (Open Graph) */}
                <div>
                  <Label htmlFor="og-title" className="text-xs font-semibold text-slate-700">
                    Open Graph Title
                  </Label>
                  <Input
                    id="og-title"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder={seoTitle.trim() || `${page?.title || "Page Title"} | SMG ABA`}
                    className="mt-1 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Defaults to SEO title if left blank.
                  </p>
                </div>

                <div>
                  <Label htmlFor="og-desc" className="text-xs font-semibold text-slate-700">
                    Open Graph Description
                  </Label>
                  <textarea
                    id="og-desc"
                    rows={2}
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    placeholder={metaDescription.trim() || "Description for LinkedIn, Twitter, Facebook social cards..."}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <Label htmlFor="og-image" className="text-xs font-semibold text-slate-700">
                    Open Graph Image (1200x630 recommended)
                  </Label>
                  <div className="mt-1 flex flex-col gap-2">
                    <Input
                      id="og-image"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://... or upload image below"
                      className="text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingOg}
                          onChange={handleOgFileUpload}
                          className="hidden"
                        />
                        <span className="inline-flex items-center justify-center w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                          <ImageIcon className="size-3.5 mr-1.5 text-slate-500" />
                          {isUploadingOg ? "Uploading Image..." : "Upload Social Image to Supabase"}
                        </span>
                      </label>
                      {ogImage && (
                        <button
                          type="button"
                          onClick={() => setOgImage("")}
                          className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-destructive border border-slate-200 rounded-md bg-white"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {ogUploadError && (
                      <span className="text-xs text-destructive">{ogUploadError}</span>
                    )}
                  </div>
                </div>

                {/* Social Card Preview */}
                <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Social Card Share Preview
                  </span>
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs max-w-sm">
                    {ogImage && isValidImageUrl(ogImage) ? (
                      <div className="h-36 w-full bg-slate-100 overflow-hidden">
                        <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-32 w-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="size-8 stroke-1" />
                        <span className="text-[11px] mt-1">No Social Image Set</span>
                      </div>
                    )}
                    <div className="p-3 space-y-1">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400">smgaba.com</div>
                      <div className="text-xs font-bold text-navy truncate">
                        {ogTitle.trim() || seoTitle.trim() || `${page?.title || "Page Title"} | SMG ABA`}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-2">
                        {ogDescription.trim() || metaDescription.trim() || "Discover individualized ABA therapy and behavioral health services at SMG ABA."}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSeoOpen(false)}
              className="text-xs rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveSeoSettings}
              className="bg-navy text-white hover:bg-navy/90 text-xs rounded-full"
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
