import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { saveCmsPage } from "@/lib/cms.server";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { generateSlugFromTitle, validateSlug } from "@/lib/cms-slugs";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { ImagePickerInput } from "@/cms/fields/ImagePicker";
import {
  Lock,
  Unlock,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

export const Route = createFileRoute("/internal/pages/new")({
  head: () => ({
    meta: [
      { title: "Create New Page | SMG ABA Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NewCmsPageForm,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function NewCmsPageForm() {
  const navigate = useNavigate();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isCustomSlug, setIsCustomSlug] = useState<boolean>(false);
  const [slugError, setSlugError] = useState<string>("");
  const [showPageHero, setShowPageHero] = useState<boolean>(true);
  const [heroEyebrow, setHeroEyebrow] = useState<string>("");
  const [heroDescription, setHeroDescription] = useState<string>("");
  const [heroImage, setHeroImage] = useState<string>("");
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState<string>("Contact Us");
  const [heroPrimaryCtaHref, setHeroPrimaryCtaHref] = useState<string>("/contact");
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState<string>("");
  const [heroSecondaryCtaHref, setHeroSecondaryCtaHref] = useState<string>("/solutions");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-verify on mount
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

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    if (newTitle.trim()) {
      setTitleError("");
    }
    if (!isCustomSlug) {
      const autoSlug = generateSlugFromTitle(newTitle);
      setSlug(autoSlug);
      if (autoSlug) {
        const val = validateSlug(autoSlug);
        setSlugError(val.valid ? "" : val.error || "");
      } else {
        setSlugError("");
      }
    }
  }

  function handleSlugChange(newSlug: string) {
    setIsCustomSlug(true);
    setSlug(newSlug);
    if (newSlug) {
      const val = validateSlug(newSlug);
      setSlugError(val.valid ? "" : val.error || "");
    } else {
      setSlugError("");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Please enter a page title (e.g. 'Special Advisory Services').");
      toast.error("Please enter a title for your page.");
      return;
    }

    const validation = validateSlug(slug);
    if (!validation.valid) {
      setSlugError(validation.error || "Invalid slug.");
      toast.error(validation.error || "Invalid slug.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveCmsPage({
        data: {
          title: title.trim(),
          slug: validation.normalizedSlug,
          data: {
            content: [],
            root: {
              props: {
                title: title.trim(),
                seoTitle: `${title.trim()} | SMG ABA`,
                showPageHero,
                heroEyebrow: heroEyebrow.trim() || undefined,
                heroDescription: heroDescription.trim() || undefined,
                heroImage: heroImage.trim() || undefined,
                heroPrimaryCtaText: heroPrimaryCtaText.trim() || undefined,
                heroPrimaryCtaHref: heroPrimaryCtaHref.trim() || undefined,
                heroSecondaryCtaText: heroSecondaryCtaText.trim() || undefined,
                heroSecondaryCtaHref: heroSecondaryCtaHref.trim() || undefined,
              },
            },
          },
          status: "draft",
          adminPassword,
        },
      });

      if (res.success && res.page) {
        toast.success("Page draft created successfully!");
        navigate({ to: "/internal/pages/$id/edit", params: { id: res.page.id } });
      } else {
        toast.error(res.error || "Failed to create page.");
      }
    } catch (err) {
      console.error("Create page error:", err);
      toast.error("An error occurred while creating the page.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />
      <Toaster position="top-right" richColors />

      <main className="flex-1 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-navy">
            <Link to="/internal/pages">
              <ArrowLeft className="size-4" />
              Back to Pages List
            </Link>
          </Button>
        </div>

        {/* Authentication Box */}
        {!isAuthenticated ? (
          <div className="mt-8 max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="size-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mx-auto mb-4">
              <Lock className="size-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-navy">Admin Access Required</h2>
            <p className="text-xs text-center text-slate-500 mt-1 mb-6">
              Enter your internal admin password to create new CMS pages.
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
                    Unlock
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* Page Creation Form */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="border-b border-slate-100 pb-6 mb-6">
              <h1 className="text-2xl font-bold font-serif-hero text-navy">Create New CMS Page</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter a title and URL slug to initialize your new page in the visual builder.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <Label htmlFor="page-title" className="text-sm font-semibold text-navy">
                  Page Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="page-title"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Special Advisory Services"
                  className={`mt-1.5 text-base ${titleError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  autoFocus
                  required
                />
                {titleError ? (
                  <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <AlertCircle className="size-3.5" />
                    {titleError}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    Used as the internal page name and public page &lt;title&gt;.
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="page-slug" className="text-sm font-semibold text-navy">
                    URL Slug <span className="text-destructive">*</span>
                  </Label>
                  {isCustomSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomSlug(false);
                        const autoSlug = generateSlugFromTitle(title);
                        setSlug(autoSlug);
                        if (autoSlug) {
                          const val = validateSlug(autoSlug);
                          setSlugError(val.valid ? "" : val.error || "");
                        }
                      }}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="size-3" />
                      Reset to auto-generated
                    </button>
                  )}
                </div>

                <div className="flex items-center mt-1.5">
                  <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-input bg-slate-100 text-slate-500 text-sm select-none">
                    smgaba.com/
                  </span>
                  <Input
                    id="page-slug"
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="special-advisory-services"
                    className="rounded-l-none font-mono text-sm"
                    required
                  />
                </div>

                {slug && !slugError && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    Slug is valid and available.
                  </p>
                )}

                {slugError && (
                  <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                    <AlertCircle className="size-3.5" />
                    {slugError}
                  </p>
                )}

                <p className="text-xs text-slate-500 mt-1">
                  Only lowercase letters, numbers, and single hyphens. Cannot collide with existing static routes, redirects, or blog posts.
                </p>
              </div>

              {/* Page Hero Banner Section */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="hero-toggle" className="text-sm font-semibold text-navy cursor-pointer">
                      Automatic Page Hero
                    </Label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Renders a branded full-bleed header with page title at the top of the page.
                    </p>
                  </div>
                  <input
                    id="hero-toggle"
                    type="checkbox"
                    checked={showPageHero}
                    onChange={(e) => setShowPageHero(e.target.checked)}
                    className="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer"
                  />
                </div>

                {showPageHero && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div>
                      <Label htmlFor="hero-eyebrow" className="text-xs font-semibold text-slate-700">
                        Hero Eyebrow Badge (Optional)
                      </Label>
                      <Input
                        id="hero-eyebrow"
                        type="text"
                        value={heroEyebrow}
                        onChange={(e) => setHeroEyebrow(e.target.value)}
                        placeholder="e.g. Strategic Financial Leadership"
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hero-description" className="text-xs font-semibold text-slate-700">
                        Hero Description (Optional)
                      </Label>
                      <textarea
                        id="hero-description"
                        rows={2}
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        placeholder="Brief summary for the hero section (defaults to meta description if empty)..."
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                        Hero Background Image (Optional)
                      </Label>
                      <ImagePickerInput
                        value={heroImage}
                        onChange={setHeroImage}
                        placeholder="https://... (defaults to SMG wallpaper)"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-navy block mb-2">
                        Hero CTA Buttons (Optional)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                          <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                            Primary CTA Button (Solid White)
                          </span>
                          <div>
                            <Label htmlFor="hero-pri-label" className="text-[11px] text-slate-600">
                              Button Label
                            </Label>
                            <Input
                              id="hero-pri-label"
                              type="text"
                              value={heroPrimaryCtaText}
                              onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                              placeholder="e.g. Contact Us, Get Started"
                              className="mt-0.5 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="hero-pri-href" className="text-[11px] text-slate-600">
                              Link URL
                            </Label>
                            <Input
                              id="hero-pri-href"
                              type="text"
                              value={heroPrimaryCtaHref}
                              onChange={(e) => setHeroPrimaryCtaHref(e.target.value)}
                              placeholder="e.g. /contact or https://..."
                              className="mt-0.5 text-xs bg-white"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                          <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                            Secondary CTA Button (Outlined Glass)
                          </span>
                          <div>
                            <Label htmlFor="hero-sec-label" className="text-[11px] text-slate-600">
                              Button Label (Optional)
                            </Label>
                            <Input
                              id="hero-sec-label"
                              type="text"
                              value={heroSecondaryCtaText}
                              onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                              placeholder="e.g. Explore Solutions (or empty)"
                              className="mt-0.5 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="hero-sec-href" className="text-[11px] text-slate-600">
                              Link URL
                            </Label>
                            <Input
                              id="hero-sec-href"
                              type="text"
                              value={heroSecondaryCtaHref}
                              onChange={(e) => setHeroSecondaryCtaHref(e.target.value)}
                              placeholder="e.g. /solutions or https://..."
                              className="mt-0.5 text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/internal/pages">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || Boolean(slugError) || !title.trim() || !slug.trim()}
                  className="bg-navy text-white hover:bg-navy/90 rounded-full min-w-36"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="size-4 mr-2" />
                      Create &amp; Open Editor
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
