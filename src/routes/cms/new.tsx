import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { saveCmsPage } from "@/lib/cms.server";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { generateSlugFromTitle, validateSlug } from "@/lib/cms-slugs";
import { PAGE_TEMPLATES, type CmsTemplate } from "@/cms/templates";
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
  LayoutTemplate,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/cms/new")({
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

  // Template State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("blank");

  // Form State
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isCustomSlug, setIsCustomSlug] = useState<boolean>(false);
  const [slugError, setSlugError] = useState<string>("");
  const [showPageHero, setShowPageHero] = useState<boolean>(false);
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

  function handleSelectTemplate(template: CmsTemplate) {
    setSelectedTemplateId(template.id);
    if (template.hasFirstBlockHero) {
      setShowPageHero(false);
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
      const chosenTemplate =
        PAGE_TEMPLATES.find((t) => t.id === selectedTemplateId) || PAGE_TEMPLATES[0];

      let initialData = chosenTemplate.getInitialData(title.trim());

      // If Blank, configure standard root hero options
      if (chosenTemplate.id === "blank") {
        initialData = {
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
        };
      } else {
        // Starter template: update root props
        initialData.root = {
          ...initialData.root,
          props: {
            ...initialData.root?.props,
            title: title.trim(),
            seoTitle: `${title.trim()} | SMG ABA`,
            showPageHero: showPageHero && !chosenTemplate.hasFirstBlockHero,
          },
        };
      }

      const res = await saveCmsPage({
        data: {
          title: title.trim(),
          slug: validation.normalizedSlug,
          data: initialData,
          status: "draft",
          adminPassword,
        },
      });

      if (res.success && res.page) {
        toast.success(`Page "${title.trim()}" created successfully!`);
        navigate({ to: "/cms/$id/edit", params: { id: res.page.id } });
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

      <main className="flex-1 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-navy">
            <Link to="/cms">
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
          /* Page Creation Form with Template Picker */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                <LayoutTemplate className="size-3.5 text-primary" />
                Page Builder Setup
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-hero text-navy">Create New CMS Page</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select a starter layout template or start from scratch, then customize in the visual Puck editor.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-8">
              {/* 1. Starter Template Picker */}
              <div>
                <Label className="text-sm font-bold text-navy block mb-3">
                  Choose a Starter Layout Template
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {PAGE_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectTemplate(tmpl)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleSelectTemplate(tmpl);
                          }
                        }}
                        className={`group relative rounded-2xl border p-4 text-left cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-navy ring-2 ring-navy/20 bg-navy/[0.02] shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSelected
                                ? "bg-navy text-white"
                                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                            }`}
                          >
                            {tmpl.badge || "Template"}
                          </span>
                          {isSelected && (
                            <div className="size-5 rounded-full bg-navy text-white flex items-center justify-center shrink-0">
                              <Check className="size-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-serif-hero text-sm font-bold text-navy group-hover:text-primary transition-colors">
                          {tmpl.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">
                          {tmpl.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Page Name & Slug */}
              <div className="space-y-5 pt-4 border-t border-slate-100">
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
              </div>

              {/* 3. Automatic Page Hero Option (Active only if Blank is selected or user enables) */}
              {selectedTemplateId === "blank" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="hero-toggle" className="text-sm font-semibold text-navy cursor-pointer">
                        Include Top Header Image Banner (Optional)
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Off by default for a clean blank canvas. Check this box if you want a branded header banner at the top of your page.
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
                                placeholder="Contact Us"
                                className="mt-1 text-xs"
                              />
                            </div>
                            <div>
                              <Label htmlFor="hero-pri-href" className="text-[11px] text-slate-600">
                                Destination URL
                              </Label>
                              <Input
                                id="hero-pri-href"
                                type="text"
                                value={heroPrimaryCtaHref}
                                onChange={(e) => setHeroPrimaryCtaHref(e.target.value)}
                                placeholder="/contact"
                                className="mt-1 text-xs"
                              />
                            </div>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                            <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                              Secondary CTA Button (Outline)
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
                                placeholder="Explore Solutions"
                                className="mt-1 text-xs"
                              />
                            </div>
                            <div>
                              <Label htmlFor="hero-sec-href" className="text-[11px] text-slate-600">
                                Destination URL
                              </Label>
                              <Input
                                id="hero-sec-href"
                                type="text"
                                value={heroSecondaryCtaHref}
                                onChange={(e) => setHeroSecondaryCtaHref(e.target.value)}
                                placeholder="/solutions"
                                className="mt-1 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to="/cms">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || Boolean(slugError) || !title.trim()}
                  className="bg-navy text-white hover:bg-navy/90 rounded-full px-6 text-sm font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Creating Page...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="size-4 mr-2" />
                      Create &amp; Open in Editor
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
