import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Render } from "@puckeditor/core/rsc";
import { puckRenderConfig } from "@/cms/render.config";
import { type CmsRootProps } from "@/cms/root";
import { getCmsPageDraftPreview, publishCmsPage, type CmsPage } from "@/lib/cms.server";
import { type CmsSiteSettings } from "@/lib/cms-settings";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Lock,
  Unlock,
  Globe,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/cms/$id/preview")({
  head: () => ({
    meta: [
      { title: "Draft Preview | SMG ABA Internal CMS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CmsDraftPreviewRoute,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function CmsDraftPreviewRoute() {
  const { id } = useParams({ from: "/cms/$id/preview" });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [page, setPage] = useState<CmsPage | null>(null);
  const [settings, setSettings] = useState<CmsSiteSettings | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

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
        loadDraft(pwd);
      } else {
        setIsAuthenticated(false);
        setAuthError(res.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError("Failed to verify password.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function loadDraft(pwd: string) {
    setIsLoading(true);
    try {
      const res = await getCmsPageDraftPreview({
        data: {
          id,
          adminPassword: pwd,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        setSettings(res.settings);
      } else {
        toast.error(res.error || "Failed to load draft preview.");
      }
    } catch (err) {
      console.error("Preview load error:", err);
      toast.error("An error occurred while loading preview.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePublish() {
    if (!page) return;
    setIsPublishing(true);
    try {
      const res = await publishCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        toast.success(`Page published! Live at /${res.page.slug}`);
      } else {
        toast.error(res.error || "Failed to publish page.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Failed to publish page.");
    } finally {
      setIsPublishing(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="size-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mx-auto mb-4">
              <Lock className="size-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-navy">Admin Preview Access Required</h2>
            <p className="text-xs text-center text-slate-500 mt-1 mb-6">
              Enter your internal admin password to preview this draft page.
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
                    Unlock Preview
                  </>
                )}
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading || !page) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 text-navy animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading draft preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative">
      {/* Sticky Top Preview Mode Banner */}
      <div className="sticky top-0 z-[60] bg-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-4 text-xs font-medium">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-white text-amber-800 font-bold uppercase tracking-wider text-[10px]">
            Preview Mode
          </span>
          <span className="hidden sm:inline text-amber-50">
            {page.status === "published"
              ? "This page is currently Published to the public."
              : "Draft • Not published to the public • Robots cannot index"}
          </span>
          <span className="font-mono text-amber-100 hidden md:inline">/{page.slug}</span>
        </div>

        <div className="flex items-center gap-2">
          {page.status === "published" && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full"
            >
              <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3 mr-1" />
                Live URL
              </a>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full"
          >
            <Link to="/cms/$id/edit" params={{ id: page.id }}>
              <Edit className="size-3 mr-1" />
              Edit Page
            </Link>
          </Button>

          {page.status !== "published" && (
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              size="sm"
              className="h-7 text-xs bg-white text-amber-900 hover:bg-amber-50 rounded-full font-semibold shadow-xs"
            >
              <Globe className={`size-3 mr-1 ${isPublishing ? "animate-spin" : ""}`} />
              {isPublishing ? "Publishing..." : "Publish Now"}
            </Button>
          )}
        </div>
      </div>

      <Header settings={settings} />

      {(() => {
        const rootProps = page.data?.root?.props as CmsRootProps | undefined;
        const showPageHero = Boolean(rootProps?.showPageHero);
        const firstBlock = page.data?.content?.[0];
        const hasFirstBlockHero = firstBlock?.type === "Hero";
        const hasHero = showPageHero || hasFirstBlockHero;

        let preparedData = page.data || { content: [], root: {} };
        if (showPageHero && firstBlock?.type === "Heading" && (firstBlock.props as any)?.level === "h1") {
          preparedData = {
            ...preparedData,
            content: [
              {
                ...firstBlock,
                props: {
                  ...firstBlock.props,
                  level: "h2",
                },
              },
              ...(preparedData.content || []).slice(1),
            ],
          };
        }

        if (hasFirstBlockHero) {
          preparedData = {
            ...preparedData,
            root: {
              ...preparedData.root,
              props: {
                ...preparedData.root?.props,
                _hasFirstBlockHero: true,
              },
            },
          };
        }

        return (
          <main className={`flex-1 overflow-x-clip ${hasHero ? "pb-16" : "pt-28 sm:pt-36 pb-16"}`}>
            <Render config={puckRenderConfig} data={preparedData} />
          </main>
        );
      })()}

      <Footer settings={settings} />
    </div>
  );
}
