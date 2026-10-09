import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useTransition } from "react";
import {
  verifyAdminPassword,
  getWebinarRedirectsList,
  type WebinarRedirect,
} from "@/lib/webinar-redirects";
import { getEventsAdminList, type EventItem } from "@/lib/events-admin";
import { getAllCmsPages, type CmsPage } from "@/lib/cms.server";
import { getAdminBlogs, type ExtendedBlogPost } from "@/lib/blogs.server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Link2,
  Calendar,
  Settings,
  Plus,
  Search,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  Globe,
  Sliders,
  Compass,
  ArrowUpRight,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Command Center | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const [cmsRes, blogsRes, redirectsRes, eventsRes] = await Promise.all([
        getAllCmsPages().catch(() => ({ pages: [] })),
        getAdminBlogs().catch(() => ({ posts: [] })),
        getWebinarRedirectsList().catch(() => ({ redirects: [], isConfigured: false })),
        getEventsAdminList().catch(() => ({ events: [], isConfigured: false })),
      ]);

      return {
        cmsPages: cmsRes.pages || [],
        blogs: blogsRes.posts || [],
        redirects: redirectsRes.redirects || [],
        events: eventsRes.events || [],
      };
    } catch (err) {
      console.error("Dashboard loader error:", err);
      return {
        cmsPages: [],
        blogs: [],
        redirects: [],
        events: [],
      };
    }
  },
  component: DashboardPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function DashboardPage() {
  const loaderData = Route.useLoaderData();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Search filter across all sections
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "cms" | "blogs" | "redirects" | "events">("all");

  // Local state initialized with loader data
  const [cmsPages, setCmsPages] = useState<CmsPage[]>(loaderData.cmsPages || []);
  const [blogs, setBlogs] = useState<ExtendedBlogPost[]>(loaderData.blogs || []);
  const [redirects, setRedirects] = useState<WebinarRedirect[]>(loaderData.redirects || []);
  const [events, setEvents] = useState<EventItem[]>(loaderData.events || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check saved admin password on mount
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      verifyPassword(saved, false);
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  async function verifyPassword(pwdToVerify: string, showToast = true) {
    setIsCheckingAuth(true);
    setAuthError("");

    try {
      const res = await verifyAdminPassword({ data: { password: pwdToVerify } });
      if (res?.authorized) {
        setIsAuthenticated(true);
        localStorage.setItem(AUTH_STORAGE_KEY, pwdToVerify);
        if (showToast) {
          toast.success("Access granted to Admin Dashboard");
        }
      } else {
        setIsAuthenticated(false);
        setAuthError(res?.error || "Invalid administrator password");
        if (showToast) {
          toast.error("Incorrect administrator password");
        }
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError("Failed to verify password with server");
    } finally {
      setIsCheckingAuth(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setAuthError("Please enter your administrator password");
      return;
    }
    verifyPassword(password, true);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setPassword("");
    toast.info("Logged out of Admin Dashboard");
  }

  async function refreshData() {
    setIsRefreshing(true);
    try {
      const [cmsRes, blogsRes, redirectsRes, eventsRes] = await Promise.all([
        getAllCmsPages(),
        getAdminBlogs(),
        getWebinarRedirectsList(),
        getEventsAdminList(),
      ]);

      if (cmsRes?.pages) setCmsPages(cmsRes.pages);
      if (blogsRes?.posts) setBlogs(blogsRes.posts);
      if (redirectsRes?.redirects) setRedirects(redirectsRes.redirects);
      if (eventsRes?.events) setEvents(eventsRes.events);

      toast.success("Dashboard data refreshed");
    } catch (err) {
      console.error("Refresh error:", err);
      toast.error("Failed to refresh dashboard data");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Statistics
  const stats = useMemo(() => {
    const publishedCms = cmsPages.filter((p) => p.status === "published").length;
    const draftCms = cmsPages.filter((p) => p.status === "draft").length;

    const publishedBlogs = blogs.filter((b) => b.published).length;
    const draftBlogs = blogs.filter((b) => !b.published).length;

    const activeRedirects = redirects.filter((r) => r.is_active !== false).length;
    const totalEvents = events.length;

    return {
      totalCms: cmsPages.length,
      publishedCms,
      draftCms,
      totalBlogs: blogs.length,
      publishedBlogs,
      draftBlogs,
      totalRedirects: redirects.length,
      activeRedirects,
      totalEvents,
    };
  }, [cmsPages, blogs, redirects, events]);

  // Global search filtering
  const filteredCms = useMemo(() => {
    if (!globalSearch.trim()) return cmsPages;
    const q = globalSearch.toLowerCase();
    return cmsPages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [cmsPages, globalSearch]);

  const filteredBlogs = useMemo(() => {
    if (!globalSearch.trim()) return blogs;
    const q = globalSearch.toLowerCase();
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [blogs, globalSearch]);

  const filteredRedirects = useMemo(() => {
    if (!globalSearch.trim()) return redirects;
    const q = globalSearch.toLowerCase();
    return redirects.filter(
      (r) =>
        r.slug.toLowerCase().includes(q) ||
        r.target_url.toLowerCase().includes(q) ||
        (r.title && r.title.toLowerCase().includes(q))
    );
  }, [redirects, globalSearch]);

  const filteredEvents = useMemo(() => {
    if (!globalSearch.trim()) return events;
    const q = globalSearch.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.speaker.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }, [events, globalSearch]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <RefreshCw className="size-6 animate-spin text-[#0f2142]" />
            <p className="text-xs font-semibold tracking-wide uppercase">
              Verifying Authorization...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2.5">
              <div className="size-14 rounded-2xl bg-[#0f2142] text-white flex items-center justify-center shadow-lg shadow-[#0f2142]/20">
                <Lock className="size-7" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2142] tracking-tight">
                Admin Command Center
              </h1>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Enter your administrator password to access CMS, Blog Studio, Webinar Links, and Events.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-pw" className="text-xs font-bold text-slate-700">
                  Admin Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-pw"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password..."
                    className="pr-10 rounded-xl border-slate-200 focus:border-[#0f2142] focus:ring-[#0f2142]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-[11px] font-medium text-red-600 mt-1">
                    {authError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-[#0f2142] hover:bg-[#0f2142]/90 text-white font-bold h-11 text-xs uppercase tracking-wider transition-all shadow-md shadow-[#0f2142]/10 cursor-pointer"
              >
                Unlock Dashboard
              </Button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Secure Admin Access
              </span>
              <span>SMG ABA Advisory</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="size-3.5" />
                <span>Central Management Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2142] tracking-tight">
                Admin Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Manage your Visual CMS Pages, Blog Articles, Webinar Redirect Links, Events, and Global Site Navigation all in one unified workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold gap-1.5 h-9 bg-white hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-200 cursor-pointer"
              >
                <Link to="/docs">
                  <BookOpen className="size-3.5 text-blue-600" />
                  <span>CMS Guide</span>
                </Link>
              </Button>

              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold gap-1.5 h-9 bg-white hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="rounded-full text-xs font-semibold text-slate-500 hover:text-red-600 h-9 cursor-pointer"
              >
                <Unlock className="size-3.5 mr-1" />
                <span>Lock Dashboard</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-slate-100">
            {/* 1. CMS Pages */}
            <Link
              to="/cms"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/70 hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-700">CMS Pages</span>
                <Layers className="size-4 text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0f2142]">{stats.totalCms}</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  {stats.publishedCms} Live
                </span>
              </div>
            </Link>

            {/* 2. Blog Posts */}
            <Link
              to="/blogs-editor"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/40 border border-slate-200/70 hover:border-purple-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 group-hover:text-purple-700">Blog Studio</span>
                <BookOpen className="size-4 text-purple-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0f2142]">{stats.totalBlogs}</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  {stats.publishedBlogs} Live
                </span>
              </div>
            </Link>

            {/* 3. Webinar Links */}
            <Link
              to="/tools/links"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-700">Short Links</span>
                <Link2 className="size-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0f2142]">{stats.totalRedirects}</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                  {stats.activeRedirects} Active
                </span>
              </div>
            </Link>

            {/* 4. Events */}
            <Link
              to="/tools/events"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-amber-50/40 border border-slate-200/70 hover:border-amber-200 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 group-hover:text-amber-700">Events & Webinars</span>
                <Calendar className="size-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#0f2142]">{stats.totalEvents}</span>
                <span className="text-[11px] font-semibold text-slate-500">Scheduled</span>
              </div>
            </Link>
          </div>
        </div>

        {/* 4 Primary Workspace Modules */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-[#0f2142] tracking-tight flex items-center gap-2">
              <Zap className="size-5 text-amber-500" />
              <span>Workspace Modules</span>
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Choose an application
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Module 1: CMS Visual Page Builder */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-200 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                    {stats.totalCms} Pages
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0f2142] group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                    <span>CMS Visual Page Builder</span>
                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Drag-and-drop page builder with 20+ responsive blocks (Top Banner, Cards Grid, FAQs, Process Steps, Video, Testimonials) and live style controls.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button asChild size="sm" className="rounded-full bg-[#0f2142] hover:bg-blue-700 text-white font-bold text-xs px-4">
                  <Link to="/cms">
                    <span>Open CMS Builder</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                    <Link to="/cms/new">
                      <Plus className="size-3.5 mr-1" />
                      <span>New Page</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-slate-500">
                    <Link to="/internal/settings">
                      <Settings className="size-3.5 mr-1" />
                      <span>Navigation</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Module 2: Blog Studio & Post Creator */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-200 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                    {stats.totalBlogs} Articles
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0f2142] group-hover:text-purple-700 transition-colors flex items-center gap-1.5">
                    <span>Blog Studio & Post Creator</span>
                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Write rich multi-block articles with headings, quotes, bullet lists, custom authors, reading times, SEO titles, and publish directly to /blog.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button asChild size="sm" className="rounded-full bg-[#0f2142] hover:bg-purple-700 text-white font-bold text-xs px-4">
                  <Link to="/blogs-editor">
                    <span>Open Blog Studio</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                    <Link to="/blogs-editor">
                      <Plus className="size-3.5 mr-1" />
                      <span>Write New Post</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-slate-500">
                    <Link to="/blog">
                      <Globe className="size-3.5 mr-1" />
                      <span>Live Blog</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Module 3: Webinar & Short Redirect Links */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-200 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Link2 className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {stats.totalRedirects} Short Links
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0f2142] group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                    <span>Webinar & Fast Short Links</span>
                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Create dynamic vanity URLs (e.g. smgaba.com/webinar) that seamlessly forward to Zoom, Calendly, YouTube, Google Meet, or landing pages.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button asChild size="sm" className="rounded-full bg-[#0f2142] hover:bg-emerald-700 text-white font-bold text-xs px-4">
                  <Link to="/tools/links">
                    <span>Manage Links</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                  <Link to="/tools/redirections">
                    <Plus className="size-3.5 mr-1" />
                    <span>Create Redirect</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Module 4: Events & Workshops Admin */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-200 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="size-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar className="size-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                    {stats.totalEvents} Events
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0f2142] group-hover:text-amber-700 transition-colors flex items-center gap-1.5">
                    <span>Events & Seminar Manager</span>
                    <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Schedule upcoming workshops, webinars, speaking sessions, guest speakers, agendas, and video recording links published to /events.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button asChild size="sm" className="rounded-full bg-[#0f2142] hover:bg-amber-700 text-white font-bold text-xs px-4">
                  <Link to="/tools/events">
                    <span>Manage Events</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Link>
                </Button>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                    <Link to="/tools/events">
                      <Plus className="size-3.5 mr-1" />
                      <span>Add Event</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-semibold text-slate-500">
                    <Link to="/events">
                      <Globe className="size-3.5 mr-1" />
                      <span>Live Events</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Universal Search & Quick Jump Feed */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0f2142] tracking-tight">
                Quick Jump & Recent Content
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Search across all CMS pages, blog articles, and short redirect links in real-time.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search across all tools..."
                className="pl-9 text-xs rounded-full border-slate-200 focus:border-[#0f2142] focus:ring-[#0f2142]"
              />
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#0f2142] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => setActiveTab("cms")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "cms"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              CMS Pages ({filteredCms.length})
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "blogs"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Blog Posts ({filteredBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab("redirects")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "redirects"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Webinar Links ({filteredRedirects.length})
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "events"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Events ({filteredEvents.length})
            </button>
          </div>

          {/* Feed Content */}
          <div className="space-y-3">
            {/* CMS Pages List */}
            {(activeTab === "all" || activeTab === "cms") && filteredCms.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>CMS Pages</span>
                  <Link to="/cms" className="hover:text-blue-600 font-semibold">View All ({cmsPages.length}) &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredCms.slice(0, activeTab === "all" ? 3 : 12).map((page) => (
                    <div
                      key={page.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              page.status === "published"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {page.status === "published" ? "Live" : "Draft"}
                          </span>
                          <span className="text-[10px] text-slate-400">/{page.slug}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0f2142] truncate group-hover:text-blue-700">
                          {page.title}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to="/cms/$id/edit"
                          params={{ id: page.id }}
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Edit in CMS</span>
                          <ArrowRight className="size-3" />
                        </Link>
                        {page.status === "published" && (
                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-slate-400 hover:text-slate-700"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Posts List */}
            {(activeTab === "all" || activeTab === "blogs") && filteredBlogs.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Blog Articles</span>
                  <Link to="/blogs-editor" className="hover:text-purple-600 font-semibold">View All ({blogs.length}) &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredBlogs.slice(0, activeTab === "all" ? 3 : 12).map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              post.published
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                          <span className="text-[10px] text-slate-400">{post.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0f2142] truncate group-hover:text-purple-700">
                          {post.title}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to="/blogs-editor"
                          className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1"
                        >
                          <span>Edit Article</span>
                          <ArrowRight className="size-3" />
                        </Link>
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-slate-400 hover:text-slate-700"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Webinar Redirect Links List */}
            {(activeTab === "all" || activeTab === "redirects") && filteredRedirects.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Webinar & Fast Short Links</span>
                  <Link to="/tools/links" className="hover:text-emerald-600 font-semibold">View All ({redirects.length}) &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredRedirects.slice(0, activeTab === "all" ? 3 : 12).map((redir) => (
                    <div
                      key={redir.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700 font-mono">/{redir.slug}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {redir.click_count || 0} clicks
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {redir.target_url}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to="/tools/links"
                          className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                        >
                          <span>Manage Link</span>
                          <ArrowRight className="size-3" />
                        </Link>
                        <a
                          href={`/${redir.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-slate-400 hover:text-slate-700"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events List */}
            {(activeTab === "all" || activeTab === "events") && filteredEvents.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Upcoming Events & Webinars</span>
                  <Link to="/tools/events" className="hover:text-amber-600 font-semibold">View All ({events.length}) &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredEvents.slice(0, activeTab === "all" ? 3 : 12).map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-amber-200 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-amber-700 font-bold">
                          <span>{ev.date}</span>
                          <span className="text-slate-400">{ev.time}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0f2142] truncate group-hover:text-amber-700">
                          {ev.title}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to="/tools/events"
                          className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
                        >
                          <span>Edit Event</span>
                          <ArrowRight className="size-3" />
                        </Link>
                        <Link to="/events" className="text-[11px] text-slate-400 hover:text-slate-700">
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
