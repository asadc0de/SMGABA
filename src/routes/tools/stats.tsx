import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getFirmStatsAdmin,
  saveFirmStatsAdmin,
  resetSiteContentSectionAdmin,
  verifyAdminPassword,
} from "@/lib/site-content-admin";
import { type FirmStats, FIRM_STATS } from "@/data/firmStats";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BarChart3,
  Users,
  Building2,
  Award,
  MapPin,
  Save,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/tools/stats")({
  head: () => ({
    meta: [
      { title: "Firm Statistics Editor | SMG ABA Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getFirmStatsAdmin();
      return { stats: data?.stats || FIRM_STATS };
    } catch {
      return { stats: FIRM_STATS };
    }
  },
  component: FirmStatsEditorPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function FirmStatsEditorPage() {
  const loaderData = Route.useLoaderData();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [stats, setStats] = useState<FirmStats>(loaderData?.stats || FIRM_STATS);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY)
        : null;

    if (saved) {
      setPassword(saved);
      checkAuth(saved);
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  async function checkAuth(pwd: string) {
    setIsCheckingAuth(true);
    setAuthError("");
    try {
      const res = await verifyAdminPassword({ data: { password: pwd } });
      if (res?.authorized) {
        setIsAuthenticated(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, pwd);
          sessionStorage.setItem(AUTH_STORAGE_KEY, pwd);
        }
      } else {
        setIsAuthenticated(false);
        setAuthError("Invalid admin password");
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError("Failed to verify credentials");
    } finally {
      setIsCheckingAuth(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    checkAuth(password);
  }

  async function refreshStats() {
    setIsRefreshing(true);
    try {
      const res = await getFirmStatsAdmin();
      if (res?.stats) {
        setStats(res.stats);
        toast.success("Firm stats reloaded");
      }
    } catch {
      toast.error("Failed to refresh stats");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function saveChanges() {
    setIsSaving(true);
    try {
      const res = await saveFirmStatsAdmin({
        data: {
          password,
          stats,
        },
      });
      if (res?.success) {
        toast.success("Firm statistics updated live across the site!");
      } else {
        toast.error(res?.error || "Failed to save stats");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function resetToDefaults() {
    if (!window.confirm("Restore default firm statistics (40+ Professionals, 2500+ Clients, Decades, 3 Offices)?")) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await resetSiteContentSectionAdmin({
        data: {
          password,
          section: "stats",
        },
      });
      if (res?.success) {
        setStats({ ...FIRM_STATS });
        toast.success("Default statistics restored");
      } else {
        toast.error(res?.error || "Failed to reset");
      }
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
          <RefreshCw className="size-5 animate-spin text-[#0f2142]" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="size-14 mx-auto rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center">
                <BarChart3 className="size-7" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2142]">Firm Statistics Admin</h1>
              <p className="text-xs text-slate-500">
                Enter your administrative password to edit headline performance metrics.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Admin Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="pr-10 text-xs rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {authError && <p className="text-xs text-red-600 font-medium">{authError}</p>}
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-[#0f2142] hover:bg-[#0f2142]/90 text-white font-bold h-10 text-xs uppercase tracking-wider"
              >
                Unlock Statistics Editor
              </Button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0f2142] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-semibold gap-1.5 h-8 bg-white"
          >
            <a href="/our-story" target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5 text-rose-600" />
              <span>Live Story Page</span>
            </a>
          </Button>
        </div>

        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="size-3.5" />
                <span>Headline Numbers</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2142] tracking-tight">
                Firm Statistics Editor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Update headline numbers (40+ Professionals, 2,500+ Clients, Decades of Experience, 3 Offices) displayed across homepage, Our Story, Our Team, and solution pages.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={saveChanges}
                disabled={isSaving}
                size="sm"
                className="rounded-full bg-[#0f2142] hover:bg-rose-700 text-white font-bold text-xs gap-1.5 h-9 px-5 cursor-pointer"
              >
                <Save className="size-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>

              <Button
                onClick={refreshStats}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold gap-1.5 h-9 bg-white cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>

              <Button
                onClick={resetToDefaults}
                variant="ghost"
                size="sm"
                className="rounded-full text-xs font-semibold text-slate-500 hover:text-red-600 h-9 cursor-pointer"
              >
                <RotateCcw className="size-3.5 mr-1" />
                <span>Reset Defaults</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Live Preview Cards Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#0f2142] uppercase tracking-wider">
            Live Preview Across Site
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="size-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
                <Users className="size-5" />
              </div>
              <div className="text-2xl font-black text-[#0f2142]">{stats.professionals}+</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Professionals</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="size-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2">
                <Building2 className="size-5" />
              </div>
              <div className="text-2xl font-black text-[#0f2142]">{stats.clients.toLocaleString()}+</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Clients Served</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="size-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                <Award className="size-5" />
              </div>
              <div className="text-2xl font-black text-[#0f2142]">{stats.experienceText}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{stats.experienceLabel}</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                <MapPin className="size-5" />
              </div>
              <div className="text-2xl font-black text-[#0f2142]">{stats.offices}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Office Locations</div>
            </div>
          </div>
        </div>

        {/* Metric Form Inputs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0f2142]">Edit Headline Numbers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Professionals */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-blue-600" />
                <Label className="text-xs font-bold text-slate-800">Professionals Count</Label>
              </div>
              <p className="text-[11px] text-slate-500">
                Number of CPAs, EAs, CFPs, and advisors on the team (e.g. 40).
              </p>
              <Input
                type="number"
                value={stats.professionals}
                onChange={(e) => setStats({ ...stats, professionals: Number(e.target.value) || 0 })}
                className="text-sm font-bold bg-white rounded-xl"
              />
            </div>

            {/* 2. Clients */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-purple-600" />
                <Label className="text-xs font-bold text-slate-800">Total Clients Empowered</Label>
              </div>
              <p className="text-[11px] text-slate-500">
                Total businesses and high-net-worth clients served (e.g. 2500).
              </p>
              <Input
                type="number"
                value={stats.clients}
                onChange={(e) => setStats({ ...stats, clients: Number(e.target.value) || 0 })}
                className="text-sm font-bold bg-white rounded-xl"
              />
            </div>

            {/* 3. Experience Headline */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-amber-600" />
                <Label className="text-xs font-bold text-slate-800">Experience Headline Text</Label>
              </div>
              <p className="text-[11px] text-slate-500">
                Text or number of years (e.g. "Decades" or "25+ Yrs").
              </p>
              <Input
                value={stats.experienceText}
                onChange={(e) =>
                  setStats({
                    ...stats,
                    experienceText: e.target.value,
                    yearsExperience: e.target.value,
                  })
                }
                className="text-sm font-bold bg-white rounded-xl"
              />
            </div>

            {/* 4. Experience Sub-label */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-amber-600" />
                <Label className="text-xs font-bold text-slate-800">Experience Label</Label>
              </div>
              <p className="text-[11px] text-slate-500">
                Sub-text under the headline (e.g. "of Experience").
              </p>
              <Input
                value={stats.experienceLabel}
                onChange={(e) => setStats({ ...stats, experienceLabel: e.target.value })}
                className="text-sm font-bold bg-white rounded-xl"
              />
            </div>

            {/* 5. Offices Count */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 md:col-span-2">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-emerald-600" />
                <Label className="text-xs font-bold text-slate-800">Total Offices Count</Label>
              </div>
              <p className="text-[11px] text-slate-500">
                Total physical office locations (Long Island HQ, Manhattan, Florida - currently 3).
              </p>
              <Input
                type="number"
                value={stats.offices}
                onChange={(e) => setStats({ ...stats, offices: Number(e.target.value) || 0 })}
                className="text-sm font-bold bg-white rounded-xl max-w-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              onClick={saveChanges}
              disabled={isSaving}
              className="rounded-full bg-[#0f2142] hover:bg-rose-700 text-white text-xs font-bold px-6 h-10 shadow-sm"
            >
              <Save className="size-4 mr-1.5" />
              <span>{isSaving ? "Saving..." : "Save Statistics"}</span>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

