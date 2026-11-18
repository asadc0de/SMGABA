import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getHomePageAdmin,
  saveHomePageAdmin,
  getAboutPageAdmin,
  saveAboutPageAdmin,
  getStoryPageAdmin,
  saveStoryPageAdmin,
  getSolutionsPageAdmin,
  saveSolutionsPageAdmin,
  getIndustriesPageAdmin,
  saveIndustriesPageAdmin,
  getCareersPageAdmin,
  saveCareersPageAdmin,
  getContactPageAdmin,
  saveContactPageAdmin,
  getFooterAdmin,
  saveFooterAdmin,
  getHeaderAdmin,
  saveHeaderAdmin,
  resetSiteContentSectionAdmin,
  verifyAdminPassword,
} from "@/lib/site-content-admin";
import {
  DEFAULT_HOME_PAGE_CONTENT,
  DEFAULT_ABOUT_PAGE_CONTENT,
  DEFAULT_STORY_PAGE_CONTENT,
  DEFAULT_SOLUTIONS_PAGE_CONTENT,
  DEFAULT_INDUSTRIES_PAGE_CONTENT,
  DEFAULT_CAREERS_PAGE_CONTENT,
  DEFAULT_CONTACT_PAGE_CONTENT,
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_HEADER_CONTENT,
  DEFAULT_INTEGRATION_LOGOS,
  type HomePageContent,
  type AboutPageContent,
  type StoryPageContent,
  type SolutionsPageContent,
  type IndustriesPageContent,
  type CareersPageContent,
  type ContactPageContent,
  type FooterContent,
  type HeaderContent,
  type IntegrationLogoItem,
} from "@/data/pageContent";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MediaImageInput } from "@/components/admin/MediaImagePickerModal";
import {
  FileText,
  Home,
  Users,
  Compass,
  Briefcase,
  Building2,
  GraduationCap,
  Save,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  CheckCircle2,
  PhoneCall,
  Phone,
  Mail,
  Globe,
  PanelTop,
  Footprints,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/tools/pages")({
  head: () => ({
    meta: [
      { title: "Site Pages & Content Editor | SMG ABA Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const [homeRes, aboutRes, storyRes, solutionsRes, industriesRes, careersRes, contactRes, footerRes, headerRes] = await Promise.all([
        getHomePageAdmin().catch(() => ({ content: DEFAULT_HOME_PAGE_CONTENT })),
        getAboutPageAdmin().catch(() => ({ content: DEFAULT_ABOUT_PAGE_CONTENT })),
        getStoryPageAdmin().catch(() => ({ content: DEFAULT_STORY_PAGE_CONTENT })),
        getSolutionsPageAdmin().catch(() => ({ content: DEFAULT_SOLUTIONS_PAGE_CONTENT })),
        getIndustriesPageAdmin().catch(() => ({ content: DEFAULT_INDUSTRIES_PAGE_CONTENT })),
        getCareersPageAdmin().catch(() => ({ content: DEFAULT_CAREERS_PAGE_CONTENT })),
        getContactPageAdmin().catch(() => ({ content: DEFAULT_CONTACT_PAGE_CONTENT })),
        getFooterAdmin().catch(() => ({ content: DEFAULT_FOOTER_CONTENT })),
        getHeaderAdmin().catch(() => ({ content: DEFAULT_HEADER_CONTENT })),
      ]);

      return {
        home: homeRes?.content || DEFAULT_HOME_PAGE_CONTENT,
        about: aboutRes?.content || DEFAULT_ABOUT_PAGE_CONTENT,
        story: storyRes?.content || DEFAULT_STORY_PAGE_CONTENT,
        solutions: solutionsRes?.content || DEFAULT_SOLUTIONS_PAGE_CONTENT,
        industries: industriesRes?.content || DEFAULT_INDUSTRIES_PAGE_CONTENT,
        careers: careersRes?.content || DEFAULT_CAREERS_PAGE_CONTENT,
        contact: contactRes?.content || DEFAULT_CONTACT_PAGE_CONTENT,
        footer: footerRes?.content || DEFAULT_FOOTER_CONTENT,
        header: headerRes?.content || DEFAULT_HEADER_CONTENT,
      };
    } catch {
      return {
        home: DEFAULT_HOME_PAGE_CONTENT,
        about: DEFAULT_ABOUT_PAGE_CONTENT,
        story: DEFAULT_STORY_PAGE_CONTENT,
        solutions: DEFAULT_SOLUTIONS_PAGE_CONTENT,
        industries: DEFAULT_INDUSTRIES_PAGE_CONTENT,
        careers: DEFAULT_CAREERS_PAGE_CONTENT,
        contact: DEFAULT_CONTACT_PAGE_CONTENT,
        footer: DEFAULT_FOOTER_CONTENT,
        header: DEFAULT_HEADER_CONTENT,
      };
    }
  },
  component: SitePagesEditorPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

type TabKey = "home" | "about" | "story" | "solutions" | "industries" | "careers" | "contact" | "footer" | "header";

function SitePagesEditorPage() {
  const loaderData = Route.useLoaderData();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form states
  const [home, setHome] = useState<HomePageContent>(loaderData?.home || DEFAULT_HOME_PAGE_CONTENT);
  const [about, setAbout] = useState<AboutPageContent>(() => {
    const raw = loaderData?.about || DEFAULT_ABOUT_PAGE_CONTENT;
    return {
      ...DEFAULT_ABOUT_PAGE_CONTENT,
      ...raw,
      coreValues: {
        ...DEFAULT_ABOUT_PAGE_CONTENT.coreValues,
        ...(raw.coreValues || {}),
      },
      integrations: {
        ...DEFAULT_ABOUT_PAGE_CONTENT.integrations,
        ...(raw.integrations || {}),
        logos: raw.integrations?.logos && raw.integrations.logos.length > 0
          ? raw.integrations.logos
          : (DEFAULT_ABOUT_PAGE_CONTENT.integrations?.logos || DEFAULT_INTEGRATION_LOGOS),
      },
      whyWorkWithUs: {
        ...DEFAULT_ABOUT_PAGE_CONTENT.whyWorkWithUs,
        ...(raw.whyWorkWithUs || {}),
      },
    };
  });
  const [story, setStory] = useState<StoryPageContent>(loaderData?.story || DEFAULT_STORY_PAGE_CONTENT);
  const [solutions, setSolutions] = useState<SolutionsPageContent>(loaderData?.solutions || DEFAULT_SOLUTIONS_PAGE_CONTENT);
  const [industries, setIndustries] = useState<IndustriesPageContent>(loaderData?.industries || DEFAULT_INDUSTRIES_PAGE_CONTENT);
  const [careers, setCareers] = useState<CareersPageContent>(loaderData?.careers || DEFAULT_CAREERS_PAGE_CONTENT);
  const [contact, setContact] = useState<ContactPageContent>(loaderData?.contact || DEFAULT_CONTACT_PAGE_CONTENT);
  const [footer, setFooter] = useState<FooterContent>(loaderData?.footer || DEFAULT_FOOTER_CONTENT);
  const [header, setHeader] = useState<HeaderContent>(loaderData?.header || DEFAULT_HEADER_CONTENT);

  // Sub-selectors
  const [selectedSolutionKey, setSelectedSolutionKey] = useState<string>("bookkeeping");
  const [selectedIndustryKey, setSelectedIndustryKey] = useState<string>("automotive");

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY)
        : null;

    if (saved) {
      verifyAdminPassword({ data: saved })
        .then((res: any) => {
          if (res?.authorized || res?.valid) {
            setPassword(saved);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {})
        .finally(() => setIsCheckingAuth(false));
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const cleanInput = password.trim();
    if (!cleanInput) {
      setAuthError("Please enter your administrator password");
      return;
    }

    try {
      const res: any = await verifyAdminPassword({ data: cleanInput });
      if (res?.authorized || res?.valid) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, cleanInput);
          sessionStorage.setItem(AUTH_STORAGE_KEY, cleanInput);
        } catch {}
        toast.success("Authenticated as Administrator");
      } else {
        setAuthError(res?.error || "Incorrect password");
      }
    } catch {
      setAuthError("Authentication check failed");
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const [h, a, s, sol, ind, car, con, foot, head] = await Promise.all([
        getHomePageAdmin(),
        getAboutPageAdmin(),
        getStoryPageAdmin(),
        getSolutionsPageAdmin(),
        getIndustriesPageAdmin(),
        getCareersPageAdmin(),
        getContactPageAdmin(),
        getFooterAdmin(),
        getHeaderAdmin(),
      ]);
      if (h?.content) setHome(h.content);
      if (a?.content) setAbout(a.content);
      if (s?.content) setStory(s.content);
      if (sol?.content) setSolutions(sol.content);
      if (ind?.content) setIndustries(ind.content);
      if (car?.content) setCareers(car.content);
      if (con?.content) setContact(con.content);
      if (foot?.content) setFooter(foot.content);
      if (head?.content) setHeader(head.content);
      toast.success("Page content refreshed from Supabase");
    } catch {
      toast.error("Failed to refresh content");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleSaveCurrentTab() {
    setIsSaving(true);
    try {
      if (activeTab === "home") {
        const res = await saveHomePageAdmin({ data: { password, content: home } });
        if (res.success) toast.success("Home page saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "about") {
        const res = await saveAboutPageAdmin({ data: { password, content: about } });
        if (res.success) toast.success("About page saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "story") {
        const res = await saveStoryPageAdmin({ data: { password, content: story } });
        if (res.success) toast.success("Our Story & Milestones saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "solutions") {
        const res = await saveSolutionsPageAdmin({ data: { password, content: solutions } });
        if (res.success) toast.success("Solutions pages saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "industries") {
        const res = await saveIndustriesPageAdmin({ data: { password, content: industries } });
        if (res.success) toast.success("Industries pages saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "careers") {
        const res = await saveCareersPageAdmin({ data: { password, content: careers } });
        if (res.success) toast.success("Careers page saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "contact") {
        const res = await saveContactPageAdmin({ data: { password, content: contact } });
        if (res.success) toast.success("Contact page saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "footer") {
        const res = await saveFooterAdmin({ data: { password, content: footer } });
        if (res.success) toast.success("Footer & Socials saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      } else if (activeTab === "header") {
        const res = await saveHeaderAdmin({ data: { password, content: header } });
        if (res.success) toast.success("Header & Banner saved to Supabase & disk backup!");
        else toast.error(res.error || "Save failed");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving content");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResetCurrentTab() {
    if (!confirm(`Are you sure you want to reset the ${activeTab.toUpperCase()} section to factory default content?`)) {
      return;
    }
    try {
      await resetSiteContentSectionAdmin({ data: { password, section: activeTab } });
      await handleRefresh();
      toast.success(`${activeTab.toUpperCase()} reset to factory defaults`);
    } catch {
      toast.error("Failed to reset defaults");
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="size-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col items-center text-center space-y-2.5">
              <div className="size-14 rounded-2xl bg-[#0f2142] text-white flex items-center justify-center shadow-lg">
                <Lock className="size-7" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2142]">Site Pages & Content Editor</h1>
              <p className="text-xs text-slate-500 max-w-xs">
                Enter your administrator password to edit all website pages (Home, About, Our Story, Solutions, Industries, Careers).
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-pw" className="text-xs font-bold text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-pw"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className="pr-10 h-11 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {authError && <p className="text-xs text-rose-600 font-semibold">{authError}</p>}
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl bg-[#0f2142] hover:bg-blue-700 font-bold text-sm">
                Unlock Page Editor
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentSolution = solutions?.solutions?.[selectedSolutionKey] || DEFAULT_SOLUTIONS_PAGE_CONTENT.solutions[selectedSolutionKey];
  const currentIndustry = industries?.industries?.[selectedIndustryKey] || DEFAULT_INDUSTRIES_PAGE_CONTENT.industries[selectedIndustryKey];

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button asChild variant="ghost" size="sm" className="h-8 rounded-full text-xs font-bold text-slate-600">
                <Link to="/dashboard">
                  <ArrowLeft className="size-3.5 mr-1" />
                  <span>Command Center</span>
                </Link>
              </Button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Live Supabase CMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2142] tracking-tight">
              Site Pages &amp; Content Editor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Edit headlines, text, imagery, and structured service cards across every page of your website. All changes update Supabase in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-full text-xs font-bold h-9"
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetCurrentTab}
              className="rounded-full text-xs font-bold h-9"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              <span>Reset Tab</span>
            </Button>

            <Button
              onClick={handleSaveCurrentTab}
              disabled={isSaving}
              className="rounded-full text-xs font-bold h-9 bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20 px-5"
            >
              <Save className="size-3.5 mr-1.5" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>

        {/* Quick Hub Navigation */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-3.5 mb-6 text-white shadow-md flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-200">Other CMS Management Hubs:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Link
              to="/tools/team"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all inline-flex items-center gap-1"
            >
              <Users className="size-3" />
              <span>Team Members</span>
            </Link>
            <Link
              to="/tools/testimonials"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all inline-flex items-center gap-1"
            >
              <Sparkles className="size-3" />
              <span>Testimonials</span>
            </Link>
            <Link
              to="/tools/offices"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all inline-flex items-center gap-1"
            >
              <Building2 className="size-3" />
              <span>Office Locations</span>
            </Link>
            <Link
              to="/tools/stats"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all inline-flex items-center gap-1"
            >
              <Layers className="size-3" />
              <span>Key Stats</span>
            </Link>
            <Link
              to="/tools/events"
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all inline-flex items-center gap-1"
            >
              <Calendar className="size-3" />
              <span>Events & Webinars</span>
            </Link>
            <Link
              to="/blogs-editor"
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all inline-flex items-center gap-1 shadow-sm"
            >
              <FileText className="size-3" />
              <span>Blog Studio</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs mb-8 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: "home", label: "Home Page", icon: Home, href: "/" },
              { id: "about", label: "About Us", icon: Users, href: "/about-us" },
              { id: "story", label: "Our Story & Milestones", icon: Calendar, href: "/our-story" },
              { id: "solutions", label: "Solutions Pages", icon: Compass, href: "/solutions" },
              { id: "industries", label: "Industries Pages", icon: Building2, href: "/industries" },
              { id: "careers", label: "Careers Page", icon: GraduationCap, href: "/careers" },
              { id: "contact", label: "Contact Page", icon: PhoneCall, href: "/contact" },
              { id: "footer", label: "Footer & Socials", icon: Footprints, href: "/" },
              { id: "header", label: "Header & Banner", icon: PanelTop, href: "/" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#0f2142] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: HOME PAGE */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Home Page (/)</h3>
                <p className="text-xs text-blue-700">Changes update the main hero, welcome block, and hospitality section.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white text-xs font-bold">
                <a href="/" target="_blank" rel="noreferrer">
                  <span>View Live</span>
                  <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">1. Hero Section</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Main Headline</Label>
                  <Input
                    value={home.hero.headline}
                    onChange={(e) => setHome({ ...home, hero: { ...home.hero, headline: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Subheading</Label>
                  <Textarea
                    rows={2}
                    value={home.hero.subheading}
                    onChange={(e) => setHome({ ...home, hero: { ...home.hero, subheading: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">CTA Button Text</Label>
                  <Input
                    value={home.hero.ctaText}
                    onChange={(e) => setHome({ ...home, hero: { ...home.hero, ctaText: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">CTA Button Link</Label>
                  <Input
                    value={home.hero.ctaLink}
                    onChange={(e) => setHome({ ...home, hero: { ...home.hero, ctaLink: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaImageInput
                    label="Hero Background Wallpaper Image (Upload from Device or Gallery)"
                    value={home.hero.bgImage}
                    onChange={(url) => setHome({ ...home, hero: { ...home.hero, bgImage: url } })}
                    placeholder="/images/hero-wallpaper.jpg or https://..."
                  />
                </div>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">2. Welcome / Intro Block</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Eyebrow Tag</Label>
                  <Input
                    value={home.welcome.eyebrow}
                    onChange={(e) => setHome({ ...home, welcome: { ...home.welcome, eyebrow: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Welcome Title</Label>
                  <Input
                    value={home.welcome.title}
                    onChange={(e) => setHome({ ...home, welcome: { ...home.welcome, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Welcome Body Paragraph</Label>
                  <Textarea
                    rows={4}
                    value={home.welcome.paragraph}
                    onChange={(e) => setHome({ ...home, welcome: { ...home.welcome, paragraph: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Button Label</Label>
                  <Input
                    value={home.welcome.ctaText}
                    onChange={(e) => setHome({ ...home, welcome: { ...home.welcome, ctaText: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Button Link</Label>
                  <Input
                    value={home.welcome.ctaLink}
                    onChange={(e) => setHome({ ...home, welcome: { ...home.welcome, ctaLink: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaImageInput
                    label="Featured Image (Upload from Device or Gallery)"
                    value={home.welcome.image}
                    onChange={(url) => setHome({ ...home, welcome: { ...home.welcome, image: url } })}
                    placeholder="/images/welcome.jpg or https://..."
                  />
                </div>
              </div>
            </div>

            {/* Hospitality Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">3. Hospitality Feature Section</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                  <Input
                    value={home.hospitalitySection.eyebrow}
                    onChange={(e) => setHome({ ...home, hospitalitySection: { ...home.hospitalitySection, eyebrow: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Title</Label>
                  <Input
                    value={home.hospitalitySection.title}
                    onChange={(e) => setHome({ ...home, hospitalitySection: { ...home.hospitalitySection, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <Label className="text-xs font-bold text-slate-700">Paragraphs</Label>
                  {home.hospitalitySection.paragraphs.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold text-slate-400 mt-2">#{idx + 1}</span>
                      <Textarea
                        rows={2}
                        value={p}
                        onChange={(e) => {
                          const updated = [...home.hospitalitySection.paragraphs];
                          updated[idx] = e.target.value;
                          setHome({ ...home, hospitalitySection: { ...home.hospitalitySection, paragraphs: updated } });
                        }}
                        className="rounded-xl flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Solution Cards Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-black text-[#0f2142]">4. "What We Do" / Solutions Section ({home.solutionCards?.length || 0})</h2>
                  <p className="text-xs text-slate-500">Edit the section heading and add as many solution cards as you like.</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const currentCards = home.solutionCards || [];
                    const newCard = {
                      title: "New Solution",
                      href: "/solutions",
                      img: "/images/solutions/smg-bookkeeping-1.webp",
                    };
                    setHome({ ...home, solutionCards: [...currentCards, newCard] });
                  }}
                  className="rounded-full text-xs font-bold bg-[#0f2142] hover:bg-blue-700 text-white"
                >
                  <Plus className="size-3.5 mr-1" />
                  <span>Add Solution Card</span>
                </Button>
              </div>

              {/* Header texts */}
              <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Section Eyebrow</Label>
                  <Input
                    value={home.solutionsSection?.eyebrow || "What we do"}
                    onChange={(e) =>
                      setHome({
                        ...home,
                        solutionsSection: {
                          ...(home.solutionsSection || { eyebrow: "What we do", title: "Our Solutions", description: "" }),
                          eyebrow: e.target.value,
                        },
                      })
                    }
                    className="h-10 rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Section Title</Label>
                  <Input
                    value={home.solutionsSection?.title || "Our Solutions"}
                    onChange={(e) =>
                      setHome({
                        ...home,
                        solutionsSection: {
                          ...(home.solutionsSection || { eyebrow: "What we do", title: "Our Solutions", description: "" }),
                          title: e.target.value,
                        },
                      })
                    }
                    className="h-10 rounded-xl bg-white"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Section Description</Label>
                  <Textarea
                    rows={2}
                    value={home.solutionsSection?.description || ""}
                    onChange={(e) =>
                      setHome({
                        ...home,
                        solutionsSection: {
                          ...(home.solutionsSection || { eyebrow: "What we do", title: "Our Solutions", description: "" }),
                          description: e.target.value,
                        },
                      })
                    }
                    className="rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {(home.solutionCards || []).map((card, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-600 uppercase">Solution Card #{idx + 1}: {card.title || "Untitled"}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = (home.solutionCards || []).filter((_, i) => i !== idx);
                          setHome({ ...home, solutionCards: updated });
                        }}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        <span className="text-xs font-semibold">Delete Card</span>
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Card Title</Label>
                        <Input
                          value={card.title}
                          onChange={(e) => {
                            const updated = [...(home.solutionCards || [])];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setHome({ ...home, solutionCards: updated });
                          }}
                          className="h-10 rounded-xl bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Link (href)</Label>
                        <Input
                          value={card.href}
                          onChange={(e) => {
                            const updated = [...(home.solutionCards || [])];
                            updated[idx] = { ...updated[idx], href: e.target.value };
                            setHome({ ...home, solutionCards: updated });
                          }}
                          className="h-10 rounded-xl bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <MediaImageInput
                          label="Card Image"
                          value={card.img}
                          onChange={(url) => {
                            const updated = [...(home.solutionCards || [])];
                            updated[idx] = { ...updated[idx], img: url };
                            setHome({ ...home, solutionCards: updated });
                          }}
                          placeholder="/images/solutions/solution-card.webp or https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">5. Newsletter Section</h2>
              <div className="grid gap-4 sm:grid-cols-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Newsletter Headline</Label>
                  <Input
                    value={home.newsletter.title}
                    onChange={(e) => setHome({ ...home, newsletter: { ...home.newsletter, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Newsletter Description</Label>
                  <Textarea
                    rows={3}
                    value={home.newsletter.description}
                    onChange={(e) => setHome({ ...home, newsletter: { ...home.newsletter, description: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Recognition / As Featured In Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-black text-[#0f2142]">6. Recognition / "As Featured In" Logos ({home.recognition?.logos?.length || 0})</h2>
                  <p className="text-xs text-slate-500">Manage the scrolling logo marquee banner of media features, awards, and affiliations.</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const currentLogos = home.recognition?.logos || [];
                    const newLogo = {
                      src: "/images/awards/1413842518-entrepreneur-logo.jpg",
                      alt: "Brand or Feature Name",
                    };
                    setHome({
                      ...home,
                      recognition: {
                        eyebrow: home.recognition?.eyebrow || "Recognition",
                        title: home.recognition?.title || "As Featured In...",
                        logos: [...currentLogos, newLogo],
                      },
                    });
                  }}
                  className="rounded-full text-xs font-bold bg-[#0f2142] hover:bg-blue-700 text-white"
                >
                  <Plus className="size-3.5 mr-1" />
                  <span>Add Recognition Logo</span>
                </Button>
              </div>

              {/* Recognition Header */}
              <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                  <Input
                    value={home.recognition?.eyebrow || "Recognition"}
                    onChange={(e) =>
                      setHome({
                        ...home,
                        recognition: {
                          eyebrow: e.target.value,
                          title: home.recognition?.title || "As Featured In...",
                          logos: home.recognition?.logos || [],
                        },
                      })
                    }
                    className="h-10 rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Title</Label>
                  <Input
                    value={home.recognition?.title || "As Featured In..."}
                    onChange={(e) =>
                      setHome({
                        ...home,
                        recognition: {
                          eyebrow: home.recognition?.eyebrow || "Recognition",
                          title: e.target.value,
                          logos: home.recognition?.logos || [],
                        },
                      })
                    }
                    className="h-10 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Logos List */}
              <div className="space-y-3">
                {(home.recognition?.logos || []).map((logo, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Logo #{idx + 1}: {logo.alt || "Unnamed"}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = (home.recognition?.logos || []).filter((_, i) => i !== idx);
                          setHome({
                            ...home,
                            recognition: {
                              eyebrow: home.recognition?.eyebrow || "Recognition",
                              title: home.recognition?.title || "As Featured In...",
                              logos: updated,
                            },
                          });
                        }}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        <span className="text-xs font-semibold">Delete</span>
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Brand / Feature Alt Text</Label>
                        <Input
                          value={logo.alt}
                          onChange={(e) => {
                            const updated = [...(home.recognition?.logos || [])];
                            updated[idx] = { ...updated[idx], alt: e.target.value };
                            setHome({
                              ...home,
                              recognition: {
                                eyebrow: home.recognition?.eyebrow || "Recognition",
                                title: home.recognition?.title || "As Featured In...",
                                logos: updated,
                              },
                            });
                          }}
                          placeholder="e.g. Inc. 5000, Forbes, NYC Hospitality Alliance"
                          className="h-9 rounded-xl bg-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <MediaImageInput
                          label="Logo Image (Upload or select from gallery)"
                          value={logo.src}
                          onChange={(url) => {
                            const updated = [...(home.recognition?.logos || [])];
                            updated[idx] = { ...updated[idx], src: url };
                            setHome({
                              ...home,
                              recognition: {
                                eyebrow: home.recognition?.eyebrow || "Recognition",
                                title: home.recognition?.title || "As Featured In...",
                                logos: updated,
                              },
                            });
                          }}
                          placeholder="/images/awards/logo.png or https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT US PAGE */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing About Us Page (/about-us)</h3>
                <p className="text-xs text-blue-700">Manage hero copy, The SMG Advantage narrative, mission statement, and 5 benefits.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white text-xs font-bold">
                <a href="/about-us" target="_blank" rel="noreferrer">
                  <span>View Live</span>
                  <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>

            {/* Hero */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">1. Subpage Hero</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Title</Label>
                  <Input
                    value={about.hero.title}
                    onChange={(e) => setAbout({ ...about, hero: { ...about.hero, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Button Text</Label>
                  <Input
                    value={about.hero.buttonText}
                    onChange={(e) => setAbout({ ...about, hero: { ...about.hero, buttonText: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Description</Label>
                  <Textarea
                    rows={2}
                    value={about.hero.description}
                    onChange={(e) => setAbout({ ...about, hero: { ...about.hero, description: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Button Link</Label>
                  <Input
                    value={about.hero.buttonHref}
                    onChange={(e) => setAbout({ ...about, hero: { ...about.hero, buttonHref: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaImageInput
                    label="Background Image (Upload from Device or Gallery)"
                    value={about.hero.bgImage}
                    onChange={(url) => setAbout({ ...about, hero: { ...about.hero, bgImage: url } })}
                    placeholder="/images/about-hero.jpg or https://..."
                  />
                </div>
              </div>
            </div>

            {/* The SMG Advantage */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">2. The SMG Advantage Narrative</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                  <Input
                    value={about.advantage.eyebrow}
                    onChange={(e) => setAbout({ ...about, advantage: { ...about.advantage, eyebrow: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Headline</Label>
                  <Input
                    value={about.advantage.headline}
                    onChange={(e) => setAbout({ ...about, advantage: { ...about.advantage, headline: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <Label className="text-xs font-bold text-slate-700">Advantage Paragraphs</Label>
                  {about.advantage.paragraphs.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold text-slate-400 mt-2">#{idx + 1}</span>
                      <Textarea
                        rows={2}
                        value={p}
                        onChange={(e) => {
                          const updated = [...about.advantage.paragraphs];
                          updated[idx] = e.target.value;
                          setAbout({ ...about, advantage: { ...about.advantage, paragraphs: updated } });
                        }}
                        className="rounded-xl flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Integrations Marquee & Partner Logos */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-black text-[#0f2142]">3. Integrations &amp; Partner Logos Slider</h2>
                  <p className="text-xs text-slate-500">Edit headline, logos, and partners displayed on the marquee ticker.</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const currentLogos = about.integrations?.logos || DEFAULT_INTEGRATION_LOGOS;
                    const newLogo: IntegrationLogoItem = {
                      src: "/Slider Logos/Intuit_QuickBooks_logo-removebg-preview.png",
                      alt: "New Integration Partner",
                    };
                    setAbout({
                      ...about,
                      integrations: {
                        eyebrow: about.integrations?.eyebrow || "Integrations",
                        headline: about.integrations?.headline || "We Work With the Tools You Already Use",
                        logos: [...currentLogos, newLogo],
                      },
                    });
                    toast.success("New logo slot added!");
                  }}
                  className="rounded-xl h-8 text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="size-3.5 mr-1" /> Add Logo
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                  <Input
                    value={about.integrations?.eyebrow ?? "Integrations"}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        integrations: {
                          eyebrow: e.target.value,
                          headline: about.integrations?.headline || "We Work With the Tools You Already Use",
                          logos: about.integrations?.logos || DEFAULT_INTEGRATION_LOGOS,
                        },
                      })
                    }
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Headline</Label>
                  <Input
                    value={about.integrations?.headline ?? "We Work With the Tools You Already Use"}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        integrations: {
                          eyebrow: about.integrations?.eyebrow || "Integrations",
                          headline: e.target.value,
                          logos: about.integrations?.logos || DEFAULT_INTEGRATION_LOGOS,
                        },
                      })
                    }
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Logos List */}
              <div className="space-y-3 pt-2">
                <Label className="text-xs font-bold text-slate-700">
                  Partner Logos ({about.integrations?.logos?.length || DEFAULT_INTEGRATION_LOGOS.length})
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(about.integrations?.logos || DEFAULT_INTEGRATION_LOGOS).map((logo, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Logo #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = (about.integrations?.logos || DEFAULT_INTEGRATION_LOGOS).filter(
                              (_, i) => i !== idx
                            );
                            setAbout({
                              ...about,
                              integrations: {
                                eyebrow: about.integrations?.eyebrow || "Integrations",
                                headline: about.integrations?.headline || "We Work With the Tools You Already Use",
                                logos: updated,
                              },
                            });
                          }}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
                        >
                          <Trash2 className="size-3 mr-1" />
                          <span className="text-xs font-semibold">Delete</span>
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-bold text-slate-600">Partner / Brand Alt Text</Label>
                          <Input
                            value={logo.alt}
                            onChange={(e) => {
                              const updated = [...(about.integrations?.logos || DEFAULT_INTEGRATION_LOGOS)];
                              updated[idx] = { ...updated[idx], alt: e.target.value };
                              setAbout({
                                ...about,
                                integrations: {
                                  eyebrow: about.integrations?.eyebrow || "Integrations",
                                  headline: about.integrations?.headline || "We Work With the Tools You Already Use",
                                  logos: updated,
                                },
                              });
                            }}
                            placeholder="e.g. Intuit QuickBooks, ADP, Bill.com"
                            className="h-8 rounded-lg bg-white text-xs"
                          />
                        </div>

                        <div>
                          <MediaImageInput
                            label="Logo Image (Upload or select from gallery)"
                            value={logo.src}
                            onChange={(url) => {
                              const updated = [...(about.integrations?.logos || DEFAULT_INTEGRATION_LOGOS)];
                              updated[idx] = { ...updated[idx], src: url };
                              setAbout({
                                ...about,
                                integrations: {
                                  eyebrow: about.integrations?.eyebrow || "Integrations",
                                  headline: about.integrations?.headline || "We Work With the Tools You Already Use",
                                  logos: updated,
                                },
                              });
                            }}
                            placeholder="/Slider Logos/logo.png or https://..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Core Values Graphic & Motto Banner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">4. Our Core Values Graphic &amp; Banner</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Section Accessible Title</Label>
                  <Input
                    value={about.coreValues?.title ?? "Our Core Values - The Principles That Drive Us"}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        coreValues: {
                          title: e.target.value,
                          image: about.coreValues?.image || "/core-values-drive.webp",
                          bottomBannerText: about.coreValues?.bottomBannerText || "STRONG VALUES & STRONG PARTNERSHIPS",
                          bottomBannerSubtext: about.coreValues?.bottomBannerSubtext || "smgaba.com",
                        },
                      })
                    }
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <MediaImageInput
                    label="Core Values DRIVE Diagram Graphic (Upload from Device or Gallery)"
                    value={about.coreValues?.image || "/core-values-drive.webp"}
                    onChange={(url) =>
                      setAbout({
                        ...about,
                        coreValues: {
                          title: about.coreValues?.title || "Our Core Values - The Principles That Drive Us",
                          image: url,
                          bottomBannerText: about.coreValues?.bottomBannerText || "STRONG VALUES & STRONG PARTNERSHIPS",
                          bottomBannerSubtext: about.coreValues?.bottomBannerSubtext || "smgaba.com",
                        },
                      })
                    }
                    placeholder="/core-values-drive.webp or https://..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Bottom Motto Banner Headline</Label>
                  <Input
                    value={about.coreValues?.bottomBannerText ?? "STRONG VALUES & STRONG PARTNERSHIPS"}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        coreValues: {
                          title: about.coreValues?.title || "Our Core Values - The Principles That Drive Us",
                          image: about.coreValues?.image || "/core-values-drive.webp",
                          bottomBannerText: e.target.value,
                          bottomBannerSubtext: about.coreValues?.bottomBannerSubtext || "smgaba.com",
                        },
                      })
                    }
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Bottom Banner Subtext</Label>
                  <Input
                    value={about.coreValues?.bottomBannerSubtext ?? "smgaba.com"}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        coreValues: {
                          title: about.coreValues?.title || "Our Core Values - The Principles That Drive Us",
                          image: about.coreValues?.image || "/core-values-drive.webp",
                          bottomBannerText: about.coreValues?.bottomBannerText || "STRONG VALUES & STRONG PARTNERSHIPS",
                          bottomBannerSubtext: e.target.value,
                        },
                      })
                    }
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 5. Mission Banner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">5. Mission Blue Banner</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Banner Heading</Label>
                  <Input
                    value={about.mission.headline}
                    onChange={(e) => setAbout({ ...about, mission: { ...about.mission, headline: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Banner Subheading</Label>
                  <Input
                    value={about.mission.subheading}
                    onChange={(e) => setAbout({ ...about, mission: { ...about.mission, subheading: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Button Text</Label>
                  <Input
                    value={about.mission.buttonText}
                    onChange={(e) => setAbout({ ...about, mission: { ...about.mission, buttonText: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Button Link</Label>
                  <Input
                    value={about.mission.buttonHref}
                    onChange={(e) => setAbout({ ...about, mission: { ...about.mission, buttonHref: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 6. Why Work With Us & 5 Benefits */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">6. Why Work With Us &amp; Five Benefits</h2>
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Section Title</Label>
                  <Input
                    value={about.whyWorkWithUs.title}
                    onChange={(e) => setAbout({ ...about, whyWorkWithUs: { ...about.whyWorkWithUs, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Benefits Heading</Label>
                  <Input
                    value={about.whyWorkWithUs.benefitsHeading}
                    onChange={(e) => setAbout({ ...about, whyWorkWithUs: { ...about.whyWorkWithUs, benefitsHeading: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaImageInput
                    label="Circular Feature Image (Upload from Device or Gallery)"
                    value={about.whyWorkWithUs.image || "/images/solutions/home-feature-hospitality.jpg"}
                    onChange={(url) => setAbout({ ...about, whyWorkWithUs: { ...about.whyWorkWithUs, image: url } })}
                    placeholder="/images/solutions/home-feature-hospitality.jpg or https://..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-700">Benefits Checklist</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = [...(about.whyWorkWithUs.benefits || []), "New Benefit"];
                      setAbout({ ...about, whyWorkWithUs: { ...about.whyWorkWithUs, benefits: updated } });
                    }}
                    className="h-7 text-xs font-semibold rounded-lg"
                  >
                    <Plus className="size-3.5 mr-1" /> Add Benefit
                  </Button>
                </div>
                {about.whyWorkWithUs.benefits.map((b, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 size-6 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Input
                      value={b}
                      onChange={(e) => {
                        const updated = [...about.whyWorkWithUs.benefits];
                        updated[idx] = e.target.value;
                        setAbout({ ...about, whyWorkWithUs: { ...about.whyWorkWithUs, benefits: updated } });
                      }}
                      className="h-10 rounded-xl flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = about.whyWorkWithUs.benefits.filter((_, i) => i !== idx);
                        setAbout({ ...about, whyWorkWithUs: { ...about.whyWorkWithUs, benefits: updated } });
                      }}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-9 px-2"
                      title="Remove Benefit"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OUR STORY & MILESTONES */}
        {activeTab === "story" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Our Story (/our-story)</h3>
                <p className="text-xs text-blue-700">Add, reorder, or edit timeline milestones and headline copy.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white text-xs font-bold">
                <a href="/our-story" target="_blank" rel="noreferrer">
                  <span>View Live</span>
                  <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>

            {/* Timeline Intro */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">Timeline Header</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                  <Input
                    value={story.intro.eyebrow}
                    onChange={(e) => setStory({ ...story, intro: { ...story.intro, eyebrow: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Heading</Label>
                  <Input
                    value={story.intro.heading}
                    onChange={(e) => setStory({ ...story, intro: { ...story.intro, heading: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Subheading</Label>
                  <Input
                    value={story.intro.subheading}
                    onChange={(e) => setStory({ ...story, intro: { ...story.intro, subheading: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Milestones List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-base font-black text-[#0f2142]">Milestones ({story.milestones.length})</h2>
                  <p className="text-xs text-slate-500">Displayed in chronological order along the alternating roadmap.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setStory({
                      ...story,
                      milestones: [
                        ...story.milestones,
                        {
                          dateLabel: "NEW 2026",
                          isoDate: "2026",
                          title: "New Strategic Milestone",
                          description: "Milestone description goes here...",
                        },
                      ],
                    });
                  }}
                  className="rounded-full text-xs font-bold bg-[#0f2142] hover:bg-blue-700 text-white"
                >
                  <Plus className="size-3.5 mr-1" />
                  <span>Add Milestone</span>
                </Button>
              </div>

              <div className="space-y-4">
                {story.milestones.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                        #{idx + 1} Milestone
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = story.milestones.filter((_, i) => i !== idx);
                          setStory({ ...story, milestones: updated });
                        }}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        <span className="text-xs font-semibold">Delete</span>
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-600">Date Label (e.g. OCT 2015)</Label>
                        <Input
                          value={item.dateLabel}
                          onChange={(e) => {
                            const updated = [...story.milestones];
                            updated[idx] = { ...updated[idx], dateLabel: e.target.value };
                            setStory({ ...story, milestones: updated });
                          }}
                          className="h-9 rounded-xl bg-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-600">ISO Date (YYYY-MM)</Label>
                        <Input
                          value={item.isoDate}
                          onChange={(e) => {
                            const updated = [...story.milestones];
                            updated[idx] = { ...updated[idx], isoDate: e.target.value };
                            setStory({ ...story, milestones: updated });
                          }}
                          className="h-9 rounded-xl bg-white text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-slate-600">Title</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...story.milestones];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setStory({ ...story, milestones: updated });
                          }}
                          className="h-9 rounded-xl bg-white text-xs"
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-1">
                        <Label className="text-[11px] font-bold text-slate-600">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...story.milestones];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setStory({ ...story, milestones: updated });
                          }}
                          className="h-9 rounded-xl bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SOLUTIONS PAGES */}
        {activeTab === "solutions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Solutions Pages (/solutions/*)</h3>
                <p className="text-xs text-blue-700">Select a solution below to edit its hero, services, and value propositions.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white text-xs font-bold">
                <a href={`/solutions/${selectedSolutionKey}`} target="_blank" rel="noreferrer">
                  <span>View Live Solution</span>
                  <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>

            {/* Solution Selector */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">Select Solution:</span>
              {[
                { id: "bookkeeping", label: "Bookkeeping" },
                { id: "cfo-advisory-services", label: "CFO Advisory" },
                { id: "tax", label: "Tax Services" },
                { id: "wealth-management", label: "Wealth Management" },
              ].map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setSelectedSolutionKey(sol.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSolutionKey === sol.id
                      ? "bg-blue-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {sol.label}
                </button>
              ))}
            </div>

            {currentSolution && (
              <div className="space-y-6">
                {/* Hero / Header */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-base font-black text-[#0f2142] border-b pb-3">Hero &amp; Meta</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                      <Input
                        value={currentSolution.eyebrow}
                        onChange={(e) => {
                          const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, eyebrow: e.target.value } };
                          setSolutions({ ...solutions, solutions: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Hero Title</Label>
                      <Input
                        value={currentSolution.heroTitle}
                        onChange={(e) => {
                          const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, heroTitle: e.target.value } };
                          setSolutions({ ...solutions, solutions: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Hero Description</Label>
                      <Textarea
                        rows={2}
                        value={currentSolution.heroDescription}
                        onChange={(e) => {
                          const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, heroDescription: e.target.value } };
                          setSolutions({ ...solutions, solutions: updated });
                        }}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Meta Title</Label>
                      <Input
                        value={currentSolution.metaTitle}
                        onChange={(e) => {
                          const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, metaTitle: e.target.value } };
                          setSolutions({ ...solutions, solutions: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Button Text</Label>
                      <Input
                        value={currentSolution.buttonText}
                        onChange={(e) => {
                          const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, buttonText: e.target.value } };
                          setSolutions({ ...solutions, solutions: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-base font-black text-[#0f2142]">Services Offered ({currentSolution.services.length})</h2>
                      <p className="text-xs text-slate-500">Service cards displayed on this solution's page.</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        const updatedList = [
                          ...currentSolution.services,
                          { title: "New Service", desc: "Service description goes here...", iconName: "Target" },
                        ];
                        const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, services: updatedList } };
                        setSolutions({ ...solutions, solutions: updated });
                      }}
                      className="rounded-full text-xs font-bold bg-[#0f2142] hover:bg-blue-700 text-white"
                    >
                      <Plus className="size-3.5 mr-1" />
                      <span>Add Service</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {currentSolution.services.map((srv, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">Service #{idx + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedList = currentSolution.services.filter((_, i) => i !== idx);
                              const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, services: updatedList } };
                              setSolutions({ ...solutions, solutions: updated });
                            }}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
                          >
                            <Trash2 className="size-3.5 mr-1" />
                            <span className="text-xs font-semibold">Delete</span>
                          </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            placeholder="Title..."
                            value={srv.title}
                            onChange={(e) => {
                              const updatedList = [...currentSolution.services];
                              updatedList[idx] = { ...updatedList[idx], title: e.target.value };
                              const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, services: updatedList } };
                              setSolutions({ ...solutions, solutions: updated });
                            }}
                            className="h-9 rounded-xl bg-white text-xs font-bold"
                          />
                          <Input
                            placeholder="Description..."
                            value={srv.desc}
                            onChange={(e) => {
                              const updatedList = [...currentSolution.services];
                              updatedList[idx] = { ...updatedList[idx], desc: e.target.value };
                              const updated = { ...solutions.solutions, [selectedSolutionKey]: { ...currentSolution, services: updatedList } };
                              setSolutions({ ...solutions, solutions: updated });
                            }}
                            className="h-9 rounded-xl bg-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INDUSTRIES PAGES */}
        {activeTab === "industries" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Industries Practice Pages</h3>
                <p className="text-xs text-blue-700">Select an industry vertical below to edit its hero copy, deep expertise text, and tailored services.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white text-xs font-bold">
                <a href={`/${selectedIndustryKey}`} target="_blank" rel="noreferrer">
                  <span>View Live Page</span>
                  <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>

            {/* Industry Selector */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">Sector:</span>
              {[
                { id: "automotive", label: "Automotive" },
                { id: "construction", label: "Construction" },
                { id: "healthcare", label: "Healthcare" },
                { id: "hospitality", label: "Hospitality" },
                { id: "legal-professionals", label: "Legal" },
                { id: "manufacturers", label: "Manufacturing" },
                { id: "real-estate", label: "Real Estate" },
                { id: "retail", label: "Retail" },
              ].map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustryKey(ind.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedIndustryKey === ind.id
                      ? "bg-blue-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>

            {currentIndustry && (
              <div className="space-y-6">
                {/* Hero / Meta */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-base font-black text-[#0f2142] border-b pb-3">Hero &amp; Meta ({currentIndustry.title})</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Page Title</Label>
                      <Input
                        value={currentIndustry.title}
                        onChange={(e) => {
                          const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, title: e.target.value } };
                          setIndustries({ ...industries, industries: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                      <Input
                        value={currentIndustry.eyebrow}
                        onChange={(e) => {
                          const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, eyebrow: e.target.value } };
                          setIndustries({ ...industries, industries: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Hero Headline</Label>
                      <Input
                        value={currentIndustry.heroTitle}
                        onChange={(e) => {
                          const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, heroTitle: e.target.value } };
                          setIndustries({ ...industries, industries: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Hero Description</Label>
                      <Textarea
                        rows={2}
                        value={currentIndustry.heroDescription}
                        onChange={(e) => {
                          const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, heroDescription: e.target.value } };
                          setIndustries({ ...industries, industries: updated });
                        }}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Deep Expertise Narrative */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-base font-black text-[#0f2142] border-b pb-3">Expertise Narrative</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Expertise Heading</Label>
                      <Input
                        value={currentIndustry.expertise.heading}
                        onChange={(e) => {
                          const updated = {
                            ...industries.industries,
                            [selectedIndustryKey]: {
                              ...currentIndustry,
                              expertise: { ...currentIndustry.expertise, heading: e.target.value },
                            },
                          };
                          setIndustries({ ...industries, industries: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Subheading</Label>
                      <Input
                        value={currentIndustry.expertise.subheading}
                        onChange={(e) => {
                          const updated = {
                            ...industries.industries,
                            [selectedIndustryKey]: {
                              ...currentIndustry,
                              expertise: { ...currentIndustry.expertise, subheading: e.target.value },
                            },
                          };
                          setIndustries({ ...industries, industries: updated });
                        }}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <Label className="text-xs font-bold text-slate-700">Paragraphs</Label>
                      {currentIndustry.expertise.paragraphs.map((p, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-xs font-bold text-slate-400 mt-2">#{idx + 1}</span>
                          <Textarea
                            rows={2}
                            value={p}
                            onChange={(e) => {
                              const updatedPars = [...currentIndustry.expertise.paragraphs];
                              updatedPars[idx] = e.target.value;
                              const updated = {
                                ...industries.industries,
                                [selectedIndustryKey]: {
                                  ...currentIndustry,
                                  expertise: { ...currentIndustry.expertise, paragraphs: updatedPars },
                                },
                              };
                              setIndustries({ ...industries, industries: updated });
                            }}
                            className="rounded-xl flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Services List */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-base font-black text-[#0f2142]">Industry Services ({currentIndustry.services.length})</h2>
                      <p className="text-xs text-slate-500">Service cards displayed on the {currentIndustry.title} page.</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        const updatedList = [
                          ...currentIndustry.services,
                          { title: "New Specialized Service", desc: "Service description details..." },
                        ];
                        const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, services: updatedList } };
                        setIndustries({ ...industries, industries: updated });
                      }}
                      className="rounded-full text-xs font-bold bg-[#0f2142] hover:bg-blue-700 text-white"
                    >
                      <Plus className="size-3.5 mr-1" />
                      <span>Add Service</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {currentIndustry.services.map((srv, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">Service #{idx + 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedList = currentIndustry.services.filter((_, i) => i !== idx);
                              const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, services: updatedList } };
                              setIndustries({ ...industries, industries: updated });
                            }}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
                          >
                            <Trash2 className="size-3.5 mr-1" />
                            <span className="text-xs font-semibold">Delete</span>
                          </Button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            placeholder="Title..."
                            value={srv.title}
                            onChange={(e) => {
                              const updatedList = [...currentIndustry.services];
                              updatedList[idx] = { ...updatedList[idx], title: e.target.value };
                              const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, services: updatedList } };
                              setIndustries({ ...industries, industries: updated });
                            }}
                            className="h-9 rounded-xl bg-white text-xs font-bold"
                          />
                          <Input
                            placeholder="Description..."
                            value={srv.desc}
                            onChange={(e) => {
                              const updatedList = [...currentIndustry.services];
                              updatedList[idx] = { ...updatedList[idx], desc: e.target.value };
                              const updated = { ...industries.industries, [selectedIndustryKey]: { ...currentIndustry, services: updatedList } };
                              setIndustries({ ...industries, industries: updated });
                            }}
                            className="h-9 rounded-xl bg-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CAREERS PAGE */}
        {activeTab === "careers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Careers Page (/careers)</h3>
                <p className="text-xs text-blue-700">Update hero headline, subtitle, and wallpaper image.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white text-xs font-bold">
                <a href="/careers" target="_blank" rel="noreferrer">
                  <span>View Live</span>
                  <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">Hero Header</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Eyebrow</Label>
                  <Input
                    value={careers.hero.eyebrow}
                    onChange={(e) => setCareers({ ...careers, hero: { ...careers.hero, eyebrow: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Title</Label>
                  <Input
                    value={careers.hero.title}
                    onChange={(e) => setCareers({ ...careers, hero: { ...careers.hero, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Description</Label>
                  <Textarea
                    rows={2}
                    value={careers.hero.description}
                    onChange={(e) => setCareers({ ...careers, hero: { ...careers.hero, description: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaImageInput
                    label="Background Image (Upload from Device or Gallery)"
                    value={careers.hero.bgImage}
                    onChange={(url) => setCareers({ ...careers, hero: { ...careers.hero, bgImage: url } })}
                    placeholder="/images/careers-hero.jpg or https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT PAGE */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Contact Page (/contact)</h3>
                <p className="text-xs text-blue-700">Manage the hero, inquiry form text, and fast-track booking card.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white text-xs font-bold">
                <a href="/contact" target="_blank" rel="noreferrer">
                  <span>View Live</span>
                  <ExternalLink className="size-3 ml-1" />
                </a>
              </Button>
            </div>

            {/* Contact Hero */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">1. Hero Section</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Title</Label>
                  <Input
                    value={contact.hero.title}
                    onChange={(e) => setContact({ ...contact, hero: { ...contact.hero, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Hero Description</Label>
                  <Textarea
                    rows={2}
                    value={contact.hero.description}
                    onChange={(e) => setContact({ ...contact, hero: { ...contact.hero, description: e.target.value } })}
                    className="rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <MediaImageInput
                    label="Background Image"
                    value={contact.hero.bgImage}
                    onChange={(url) => setContact({ ...contact, hero: { ...contact.hero, bgImage: url } })}
                    placeholder="/images/contact-hero.jpg or https://..."
                  />
                </div>
              </div>
            </div>

            {/* Inquiry Form Text */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">2. Inquiry Form Text</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Form Title</Label>
                  <Input
                    value={contact.inquiry.title}
                    onChange={(e) => setContact({ ...contact, inquiry: { ...contact.inquiry, title: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Form Subtitle</Label>
                  <Input
                    value={contact.inquiry.subtitle}
                    onChange={(e) => setContact({ ...contact, inquiry: { ...contact.inquiry, subtitle: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Response Promise</Label>
                  <Input
                    value={contact.inquiry.responsePromise}
                    onChange={(e) => setContact({ ...contact, inquiry: { ...contact.inquiry, responsePromise: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Fast Track Booking Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">3. Fast Track Booking Card</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Headquarters Title</Label>
                  <Input
                    value={contact.directCards.headquartersTitle}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, headquartersTitle: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Headquarters Description</Label>
                  <Input
                    value={contact.directCards.headquartersDesc}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, headquartersDesc: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Direct Line Title</Label>
                  <Input
                    value={contact.directCards.directLineTitle}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, directLineTitle: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Direct Line Phone</Label>
                  <Input
                    value={contact.directCards.directLinePhone}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, directLinePhone: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Consultation Title</Label>
                  <Input
                    value={contact.directCards.consultationTitle}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, consultationTitle: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Consultation Description</Label>
                  <Input
                    value={contact.directCards.consultationDesc}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, consultationDesc: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">CTA Button Text</Label>
                  <Input
                    value={contact.directCards.consultationCtaText}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, consultationCtaText: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">CTA Button Link</Label>
                  <Input
                    value={contact.directCards.consultationCtaLink}
                    onChange={(e) => setContact({ ...contact, directCards: { ...contact.directCards, consultationCtaLink: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: FOOTER & SOCIALS */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Footer & Social Media Links</h3>
                <p className="text-xs text-blue-700">Manage tagline, disclaimer, copyright, phone, email, and all social media URLs.</p>
              </div>
            </div>

            {/* Brand & Legal */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">1. Brand & Legal</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Footer Tagline</Label>
                  <Textarea
                    rows={2}
                    value={footer.tagline}
                    onChange={(e) => setFooter({ ...footer, tagline: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Legal Disclaimer</Label>
                  <Textarea
                    rows={3}
                    value={footer.disclaimer}
                    onChange={(e) => setFooter({ ...footer, disclaimer: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Copyright Text</Label>
                  <Input
                    value={footer.copyrightText}
                    onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    <Phone className="size-3.5 inline mr-1" />Primary Phone
                  </Label>
                  <Input
                    value={footer.primaryPhone}
                    onChange={(e) => setFooter({ ...footer, primaryPhone: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    <Mail className="size-3.5 inline mr-1" />Primary Email
                  </Label>
                  <Input
                    value={footer.primaryEmail}
                    onChange={(e) => setFooter({ ...footer, primaryEmail: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">
                <Share2 className="size-4 inline mr-2" />2. Social Media Links
              </h2>
              <div className="space-y-3">
                {(footer.socials || []).map((social, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Globe className="size-4 text-slate-500" />
                      <span className="text-xs font-black text-slate-700 uppercase">{social.platform}</span>
                    </div>
                    <Input
                      value={social.href}
                      onChange={(e) => {
                        const updated = [...footer.socials];
                        updated[idx] = { ...updated[idx], href: e.target.value };
                        setFooter({ ...footer, socials: updated });
                      }}
                      placeholder={`https://${social.platform}.com/...`}
                      className="h-9 rounded-xl flex-1 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: HEADER & BANNER */}
        {activeTab === "header" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div>
                <h3 className="text-sm font-bold text-blue-900">Editing Header & Announcement Banner</h3>
                <p className="text-xs text-blue-700">Manage the top announcement banner, phone number, and CTA button in the site header.</p>
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">1. Announcement Banner</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={header.announcementBanner.enabled}
                      onChange={(e) => setHeader({ ...header, announcementBanner: { ...header.announcementBanner, enabled: e.target.checked } })}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Show Announcement Banner on Site</span>
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${header.announcementBanner.enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {header.announcementBanner.enabled ? "LIVE" : "HIDDEN"}
                  </span>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Banner Text</Label>
                  <Input
                    value={header.announcementBanner.text}
                    onChange={(e) => setHeader({ ...header, announcementBanner: { ...header.announcementBanner, text: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Link Text</Label>
                  <Input
                    value={header.announcementBanner.linkText}
                    onChange={(e) => setHeader({ ...header, announcementBanner: { ...header.announcementBanner, linkText: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Link URL</Label>
                  <Input
                    value={header.announcementBanner.linkHref}
                    onChange={(e) => setHeader({ ...header, announcementBanner: { ...header.announcementBanner, linkHref: e.target.value } })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Quick Contact & CTA */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#0f2142] border-b pb-3">2. Quick Contact & CTA Button</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    <Phone className="size-3.5 inline mr-1" />Contact Phone
                  </Label>
                  <Input
                    value={header.contactPhone}
                    onChange={(e) => setHeader({ ...header, contactPhone: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">CTA Button Text</Label>
                  <Input
                    value={header.ctaButtonText}
                    onChange={(e) => setHeader({ ...header, ctaButtonText: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">CTA Button Link</Label>
                  <Input
                    value={header.ctaButtonHref}
                    onChange={(e) => setHeader({ ...header, ctaButtonHref: e.target.value })}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

