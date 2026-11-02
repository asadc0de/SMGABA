import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useMemo } from "react";
import {
  verifyAdminPassword,
  getOnboardingAdminData,
  saveOnboardingGuideAdmin,
  listOnboardingVersionsAdmin,
  restoreOnboardingVersionAdmin,
  resetOnboardingToDefaultAdmin,
} from "@/lib/onboarding-admin";
import {
  ONBOARDING_GUIDES,
  type OfficeKey,
  type OnboardingGuide,
  type OnboardingProvider,
  type OnboardingSection,
} from "@/data/onboardingGuides";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Lock,
  Unlock,
  Save,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  History,
  RotateCcw,
  Check,
  Copy,
  Building,
  CreditCard,
  Users,
  Terminal,
  Info,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";

export const Route = createFileRoute("/tools/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding Guides Admin | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getOnboardingAdminData();
      return data;
    } catch (err) {
      console.error("Failed to load onboarding admin data:", err);
      return {
        guides: { ny: ONBOARDING_GUIDES.ny, fl: ONBOARDING_GUIDES.fl },
        isConfigured: false,
      };
    }
  },
  component: OnboardingAdminPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function cleanSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SecretMatch {
  location: string;
  match: string;
  preview: string;
}

function scanGuideForSecrets(guide: OnboardingGuide): SecretMatch[] {
  const matches: SecretMatch[] = [];

  function checkText(text: string, location: string) {
    if (!text || typeof text !== "string") return;

    // 1. Password/Passcode/PIN keywords
    const pwRegex = /\b(password|passcode|pin)\b/gi;
    let m: RegExpExecArray | null;
    while ((m = pwRegex.exec(text)) !== null) {
      matches.push({
        location,
        match: m[0],
        preview: text.length > 80 ? text.slice(0, 80) + "..." : text,
      });
    }

    // 2. "code:" or "code :" pattern
    const codeRegex = /\bcode\s*:/gi;
    while ((m = codeRegex.exec(text)) !== null) {
      matches.push({
        location,
        match: m[0],
        preview: text.length > 80 ? text.slice(0, 80) + "..." : text,
      });
    }

    // 3. Standalone 4-8 digit numbers (excluding phone numbers like 631-804-8257 or common years)
    const digitRegex = /(?<![0-9\-\(\)])\b\d{4,8}\b(?![0-9\-\(\)])/g;
    while ((m = digitRegex.exec(text)) !== null) {
      const num = m[0];
      // Skip known years or phone area prefixes
      if (num === "2024" || num === "2025" || num === "2026" || num === "2027") continue;
      matches.push({
        location,
        match: num,
        preview: text.length > 80 ? text.slice(0, 80) + "..." : text,
      });
    }
  }

  // Scan Intro & checklist
  guide.introParagraphs?.forEach((p, idx) => checkText(p, `Intro Paragraph #${idx + 1}`));
  guide.beforeYouBegin?.forEach((b, idx) => checkText(b, `Before You Begin #${idx + 1}`));

  // Scan Guest Info
  checkText(guide.guestInfo.usernameHint, "Guest Info: Username Hint");
  checkText(guide.guestInfo.quickBooksOnline, "Guest Info: QuickBooks Setup");
  if (guide.guestInfo.helpfulTip) {
    checkText(guide.guestInfo.helpfulTip, "Guest Info: Helpful Tip");
  }

  // Scan Sections & Providers
  const sectionKeys: Array<"bank" | "payroll" | "pos"> = ["bank", "payroll", "pos"];
  for (const sKey of sectionKeys) {
    const s = guide.sections[sKey];
    if (!s) continue;
    if (s.intro) checkText(s.intro, `Section '${s.shortTitle}' Intro`);

    for (const p of s.providers) {
      p.steps.forEach((step, idx) => {
        checkText(step, `${p.name} - Step #${idx + 1}`);
      });
      p.notes?.forEach((note, idx) => {
        checkText(note, `${p.name} - Note #${idx + 1}`);
      });
    }
  }

  checkText(guide.completionNote, "Completion Note");
  return matches;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function OnboardingAdminPage() {
  const initialData = Route.useLoaderData();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) || "";
    }
    return "";
  });
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Office Tabs: "ny" | "fl"
  const [activeOffice, setActiveOffice] = useState<OfficeKey>("ny");

  // Data State
  const [guides, setGuides] = useState<Record<OfficeKey, OnboardingGuide>>({
    ny: initialData?.guides?.ny || ONBOARDING_GUIDES.ny,
    fl: initialData?.guides?.fl || ONBOARDING_GUIDES.fl,
  });
  const [savedGuidesSnapshot, setSavedGuidesSnapshot] = useState<Record<OfficeKey, string>>({
    ny: JSON.stringify(initialData?.guides?.ny || ONBOARDING_GUIDES.ny),
    fl: JSON.stringify(initialData?.guides?.fl || ONBOARDING_GUIDES.fl),
  });

  const [isConfigured] = useState<boolean>(initialData?.isConfigured ?? false);
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Active section tab in the editor
  const [activeSectionId, setActiveSectionId] = useState<"general" | "bank" | "payroll" | "pos">("general");

  // Secret guard modal state
  const [secretMatches, setSecretMatches] = useState<SecretMatch[]>([]);
  const [showSecretModal, setShowSecretModal] = useState<boolean>(false);
  const [secretBypassConfirmed, setSecretBypassConfirmed] = useState<boolean>(false);

  // Versions history state
  const [showVersionHistory, setShowVersionHistory] = useState<boolean>(false);
  const [versions, setVersions] = useState<Array<{ id: number; office: OfficeKey; created_at: string }>>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState<boolean>(false);
  const [restoringVersionId, setRestoringVersionId] = useState<number | null>(null);

  // Provider delete confirmation
  const [deletingProvider, setDeletingProvider] = useState<{
    sectionId: "bank" | "payroll" | "pos";
    providerId: string;
    name: string;
  } | null>(null);

  // Reset confirmation
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Check if active office has unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(guides[activeOffice]) !== savedGuidesSnapshot[activeOffice];
  }, [guides, savedGuidesSnapshot, activeOffice]);

  // Unsaved changes beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

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
    if (!isAutoCheck) setAuthError("");

    try {
      const res = await verifyAdminPassword({ data: pwd.trim() });
      if (res.authorized) {
        setIsAuthenticated(true);
        setAdminPassword(pwd.trim());
        sessionStorage.setItem(AUTH_STORAGE_KEY, pwd.trim());
        if (showToast) {
          toast.success("Authenticated successfully");
        }
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

  // Load versions
  async function loadVersions() {
    setIsLoadingVersions(true);
    try {
      const res = await listOnboardingVersionsAdmin({
        data: {
          adminPassword,
          office: activeOffice,
        },
      });
      if (res.success && res.versions) {
        setVersions(res.versions);
      } else {
        toast.error(res.error || "Failed to load versions.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load versions.");
    } finally {
      setIsLoadingVersions(false);
    }
  }

  // Handle Restore
  async function handleRestore(versionId: number) {
    setRestoringVersionId(versionId);
    try {
      const res = await restoreOnboardingVersionAdmin({
        data: {
          adminPassword,
          office: activeOffice,
          versionId,
        },
      });
      if (res.success && res.guide) {
        setGuides((prev) => ({
          ...prev,
          [activeOffice]: res.guide!,
        }));
        setSavedGuidesSnapshot((prev) => ({
          ...prev,
          [activeOffice]: JSON.stringify(res.guide),
        }));
        toast.success(`Successfully restored version #${versionId}`);
        setShowVersionHistory(false);
      } else {
        toast.error(res.error || "Failed to restore version.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to restore version.");
    } finally {
      setRestoringVersionId(null);
    }
  }

  // Handle Reset to Default
  async function handleResetToDefault() {
    setIsSaving(true);
    try {
      const res = await resetOnboardingToDefaultAdmin({
        data: {
          adminPassword,
          office: activeOffice,
        },
      });
      if (res.success && res.guide) {
        setGuides((prev) => ({
          ...prev,
          [activeOffice]: res.guide,
        }));
        setSavedGuidesSnapshot((prev) => ({
          ...prev,
          [activeOffice]: JSON.stringify(res.guide),
        }));
        toast.success(`Reset ${activeOffice.toUpperCase()} guide to default configuration.`);
        setShowResetConfirm(false);
      } else {
        toast.error(res.error || "Failed to reset to default.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset to default.");
    } finally {
      setIsSaving(false);
    }
  }

  // Pre-save check including Secret Guard
  function handleInitiateSave() {
    const currentGuide = guides[activeOffice];
    const detected = scanGuideForSecrets(currentGuide);

    if (detected.length > 0 && !secretBypassConfirmed) {
      setSecretMatches(detected);
      setShowSecretModal(true);
      return;
    }

    executeSave();
  }

  async function executeSave() {
    setIsSaving(true);
    setShowSecretModal(false);
    setSecretBypassConfirmed(false);

    try {
      const res = await saveOnboardingGuideAdmin({
        data: {
          adminPassword,
          guide: guides[activeOffice],
        },
      });

      if (res.success) {
        toast.success(`Saved ${activeOffice.toUpperCase()} Onboarding Guide successfully!`);
        setSavedGuidesSnapshot((prev) => ({
          ...prev,
          [activeOffice]: JSON.stringify(guides[activeOffice]),
        }));
      } else {
        toast.error(res.error || "Failed to save guide.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save guide.");
    } finally {
      setIsSaving(false);
    }
  }

  // Update Active Guide helper
  function updateGuide(updater: (draft: OnboardingGuide) => void) {
    setGuides((prev) => {
      const clone = deepClone(prev[activeOffice]);
      updater(clone);
      return {
        ...prev,
        [activeOffice]: clone,
      };
    });
  }

  // Copy provider to other office
  function handleCopyProviderToOtherOffice(
    sectionId: "bank" | "payroll" | "pos",
    provider: OnboardingProvider,
  ) {
    const targetOffice: OfficeKey = activeOffice === "ny" ? "fl" : "ny";
    setGuides((prev) => {
      const targetGuide = deepClone(prev[targetOffice]);
      const section = targetGuide.sections[sectionId];
      if (!section) return prev;

      // Check if already exists in target
      const existingIdx = section.providers.findIndex((p: OnboardingProvider) => p.id === provider.id);
      if (existingIdx >= 0) {
        section.providers[existingIdx] = deepClone(provider);
      } else {
        section.providers.push(deepClone(provider));
      }

      toast.success(
        `Copied "${provider.name}" to ${targetOffice.toUpperCase()} ${section.shortTitle}. Remember to save ${targetOffice.toUpperCase()}!`,
      );

      return {
        ...prev,
        [targetOffice]: targetGuide,
      };
    });
  }

  const currentGuide = guides[activeOffice];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-semibold text-blue-600">Onboarding Admin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2142] tracking-tight flex items-center gap-2.5">
                <span>Client Account Access Guides</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wide">
                  Live Editor
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage onboarding instructions, credentials, and supported bank/payroll/POS providers for New York and Florida.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs font-semibold border-slate-200 hover:bg-slate-100"
              >
                <a
                  href={`/onboarding/${activeOffice}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <span>Open Live Page</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowVersionHistory(true);
                  loadVersions();
                }}
                className="text-xs font-semibold border-slate-200 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <History className="h-3.5 w-3.5 text-slate-600" />
                <span>Version History</span>
              </Button>

              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Log out
                </Button>
              )}
            </div>
          </div>

          {/* Unconfigured Alert Banner if applicable */}
          {!isConfigured && (
            <div className="mt-4 p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> Supabase credentials are not detected in the environment. Edits will be maintained in the server memory cache and fallback files.
              </div>
            </div>
          )}

          {/* PERMANENT SECRET GUARD NOTICE */}
          <div className="mt-4 p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-900 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-blue-700 shrink-0" />
              <span>
                <strong>Security Guard:</strong> Never enter client or staff passwords or access codes here. Clients are instructed to share them securely through ShareFile.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full shrink-0">
              Zero Passwords Policy
            </span>
          </div>

          {/* Password Gate Prompt if Not Authenticated */}
          {!isAuthenticated ? (
            <div className="mt-8 max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-[#0f2142]">Admin Password Required</h2>
              <p className="text-xs text-slate-500 mt-1.5 mb-6">
                Enter the internal admin password to edit client onboarding guides.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyPassword(passwordInput);
                }}
                className="space-y-4 text-left"
              >
                <div>
                  <Label htmlFor="admin-pw" className="text-xs font-semibold text-slate-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="admin-pw"
                      type={showPassword ? "text" : "password"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter admin password..."
                      className="pr-10 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {authError && <p className="text-xs text-red-600 mt-1.5 font-medium">{authError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-[#0f2142] hover:bg-blue-700 text-white font-bold text-xs"
                >
                  {isVerifying ? "Verifying..." : "Unlock Editor"}
                </Button>
              </form>
            </div>
          ) : (
            /* Main Authenticated Editor Container */
            <div className="mt-6 space-y-6">
              {/* Office Selector Tabs & Save Header */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveOffice("ny")}
                    className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeOffice === "ny"
                        ? "bg-white text-[#0f2142] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🗽 New York (NY)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveOffice("fl")}
                    className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeOffice === "fl"
                        ? "bg-white text-[#0f2142] shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🌴 Florida (FL)
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {hasUnsavedChanges && (
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5 animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
                      Unsaved changes
                    </span>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowResetConfirm(true)}
                    className="text-xs font-semibold text-slate-600 hover:text-red-700 hover:border-red-200"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    Reset to Default
                  </Button>

                  <Button
                    type="button"
                    disabled={isSaving}
                    onClick={handleInitiateSave}
                    className="bg-[#0f2142] hover:bg-blue-700 text-white font-bold text-xs px-5 shadow-xs flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? "Saving..." : `Save ${activeOffice.toUpperCase()} Guide`}
                  </Button>
                </div>
              </div>

              {/* Editor Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveSectionId("general")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSectionId === "general"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  General & Guest Info
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionId("bank")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSectionId === "bank"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Bank & Cards ({currentGuide.sections.bank.providers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionId("payroll")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSectionId === "payroll"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  Payroll ({currentGuide.sections.payroll.providers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionId("pos")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeSectionId === "pos"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  POS Systems ({currentGuide.sections.pos.providers.length})
                </button>
              </div>

              {/* Tab 1: General & Guest Info */}
              {activeSectionId === "general" && (
                <div className="space-y-6">
                  {/* Hero & Intro Settings */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                    <h2 className="text-base font-bold text-[#0f2142] border-b border-slate-100 pb-2">
                      Page Titles & Descriptions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Welcome Title (Hero H1)</Label>
                        <Input
                          value={currentGuide.welcomeTitle}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.welcomeTitle = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Page Subheading</Label>
                        <Input
                          value={currentGuide.pageTitle}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.pageTitle = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs font-bold text-slate-700">Subtitle Description</Label>
                        <Input
                          value={currentGuide.subtitle}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.subtitle = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>

                    {/* Intro Paragraphs */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-bold text-slate-700">Introductory Paragraphs</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateGuide((draft) => {
                              draft.introParagraphs.push("");
                            })
                          }
                          className="text-xs text-blue-600 hover:text-blue-800 h-7"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Paragraph
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {currentGuide.introParagraphs.map((p, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <textarea
                              rows={2}
                              value={p}
                              onChange={(e) =>
                                updateGuide((draft) => {
                                  draft.introParagraphs[idx] = e.target.value;
                                })
                              }
                              className="w-full text-xs sm:text-sm p-2 rounded-lg border border-slate-200 focus:outline-blue-500"
                              placeholder={`Paragraph #${idx + 1}`}
                            />
                            {currentGuide.introParagraphs.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateGuide((draft) => {
                                    draft.introParagraphs.splice(idx, 1);
                                  })
                                }
                                className="text-slate-400 hover:text-red-600 h-8 w-8 p-0 shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Before You Begin Bullets */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs font-bold text-slate-700">
                          "Before You Begin" Checklist Items
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateGuide((draft) => {
                              draft.beforeYouBegin.push("");
                            })
                          }
                          className="text-xs text-blue-600 hover:text-blue-800 h-7"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Checklist Item
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {currentGuide.beforeYouBegin.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                            <Input
                              value={item}
                              onChange={(e) =>
                                updateGuide((draft) => {
                                  draft.beforeYouBegin[idx] = e.target.value;
                                })
                              }
                              className="text-xs sm:text-sm"
                              placeholder={`Instruction #${idx + 1}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateGuide((draft) => {
                                  draft.beforeYouBegin.splice(idx, 1);
                                })
                              }
                              className="text-slate-400 hover:text-red-600 h-8 w-8 p-0 shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Guest Information Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h2 className="text-base font-bold text-[#0f2142]">Guest Access Credentials</h2>
                        <p className="text-xs text-slate-500">
                          Official user details clients copy and paste when creating account access.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Official Guest Name</Label>
                        <Input
                          value={currentGuide.guestInfo.name}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.guestInfo.name = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Guest Email Address</Label>
                        <Input
                          value={currentGuide.guestInfo.email}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.guestInfo.email = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Guest Phone Number</Label>
                        <Input
                          value={currentGuide.guestInfo.phone}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.guestInfo.phone = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Label className="text-xs font-bold text-slate-700">Username Hint / Example</Label>
                        <Input
                          value={currentGuide.guestInfo.usernameHint}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.guestInfo.usernameHint = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="text-xs font-bold text-slate-700">
                          QuickBooks Online Display Instructions
                        </Label>
                        <Input
                          value={currentGuide.guestInfo.quickBooksOnline}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.guestInfo.quickBooksOnline = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold text-slate-700">QuickBooks Copy Email</Label>
                        <Input
                          value={currentGuide.guestInfo.qboEmail || "Onboarding@smgaba.com"}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.guestInfo.qboEmail = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                          placeholder="Onboarding@smgaba.com"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <Label className="text-xs font-bold text-slate-700">Helpful Tip Box (Optional)</Label>
                        <textarea
                          rows={2}
                          value={currentGuide.guestInfo.helpfulTip || ""}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.guestInfo.helpfulTip = e.target.value;
                            })
                          }
                          className="mt-1 w-full text-xs sm:text-sm p-2 rounded-lg border border-slate-200 focus:outline-blue-500"
                          placeholder="Callout tip shown under guest access..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Completion Note */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Completion Note (Page Footer)</Label>
                    <textarea
                      rows={3}
                      value={currentGuide.completionNote}
                      onChange={(e) =>
                        updateGuide((draft) => {
                          draft.completionNote = e.target.value;
                        })
                      }
                      className="w-full text-xs sm:text-sm p-2 rounded-lg border border-slate-200 focus:outline-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Tabs 2, 3, 4: Section Providers Editor */}
              {activeSectionId !== "general" && (
                <div className="space-y-6">
                  {/* Section Settings */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Section Header Title</Label>
                        <Input
                          value={currentGuide.sections[activeSectionId].title}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.sections[activeSectionId].title = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Short Title (Nav)</Label>
                        <Input
                          value={currentGuide.sections[activeSectionId].shortTitle}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.sections[activeSectionId].shortTitle = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-700">Section Intro Note</Label>
                        <Input
                          value={currentGuide.sections[activeSectionId].intro || ""}
                          onChange={(e) =>
                            updateGuide((draft) => {
                              draft.sections[activeSectionId].intro = e.target.value;
                            })
                          }
                          className="mt-1 text-sm"
                          placeholder="Instructions above providers list..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Providers Header & Add Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#0f2142]">
                        {currentGuide.sections[activeSectionId].shortTitle} Providers
                      </h2>
                      <p className="text-xs text-slate-500">
                        {currentGuide.sections[activeSectionId].providers.length} platforms configured
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() =>
                        updateGuide((draft) => {
                          const newProvider: OnboardingProvider = {
                            id: `new-provider-${Date.now()}`,
                            name: "New Provider",
                            steps: ["Open platform settings and select Add User."],
                          };
                          draft.sections[activeSectionId].providers.push(newProvider);
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Provider
                    </Button>
                  </div>

                  {/* Providers List */}
                  <div className="space-y-4">
                    {currentGuide.sections[activeSectionId].providers.map((provider, pIndex) => (
                      <div
                        key={provider.id || pIndex}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
                      >
                        {/* Provider Header Bar */}
                        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                              #{pIndex + 1}
                            </span>
                            <span className="text-sm font-bold text-[#0f2142]">{provider.name}</span>
                            <code className="text-[11px] font-mono text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                              #{provider.id}
                            </code>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Move Up */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={pIndex === 0}
                              onClick={() =>
                                updateGuide((draft) => {
                                  const list = draft.sections[activeSectionId].providers;
                                  const temp = list[pIndex - 1];
                                  list[pIndex - 1] = list[pIndex];
                                  list[pIndex] = temp;
                                })
                              }
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                              title="Move up"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>

                            {/* Move Down */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              disabled={pIndex === currentGuide.sections[activeSectionId].providers.length - 1}
                              onClick={() =>
                                updateGuide((draft) => {
                                  const list = draft.sections[activeSectionId].providers;
                                  const temp = list[pIndex + 1];
                                  list[pIndex + 1] = list[pIndex];
                                  list[pIndex] = temp;
                                })
                              }
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                              title="Move down"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>

                            {/* Copy to other office */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleCopyProviderToOtherOffice(activeSectionId, provider)
                              }
                              className="text-[11px] font-semibold h-8 text-blue-700 hover:bg-blue-50 border-blue-200 flex items-center gap-1"
                              title={`Copy this provider to ${activeOffice === "ny" ? "Florida" : "New York"}`}
                            >
                              <Copy className="h-3 w-3" />
                              <span>Copy to {activeOffice === "ny" ? "FL" : "NY"}</span>
                            </Button>

                            {/* Delete Provider */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeletingProvider({
                                  sectionId: activeSectionId,
                                  providerId: provider.id,
                                  name: provider.name,
                                })
                              }
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                              title="Delete provider"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Provider Content Fields */}
                        <div className="p-5 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs font-bold text-slate-700">Provider Name</Label>
                              <Input
                                value={provider.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateGuide((draft) => {
                                    const p = draft.sections[activeSectionId].providers[pIndex];
                                    p.name = val;
                                  });
                                }}
                                className="mt-1 text-sm font-medium"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                <span>URL Anchor Slug (id)</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateGuide((draft) => {
                                      const p = draft.sections[activeSectionId].providers[pIndex];
                                      p.id = cleanSlug(p.name);
                                    })
                                  }
                                  className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                                >
                                  Regenerate from Name
                                </button>
                              </Label>
                              <Input
                                value={provider.id}
                                onChange={(e) => {
                                  const val = cleanSlug(e.target.value);
                                  updateGuide((draft) => {
                                    const p = draft.sections[activeSectionId].providers[pIndex];
                                    p.id = val;
                                  });
                                }}
                                className="mt-1 text-sm font-mono"
                              />
                            </div>
                          </div>

                          {/* Required Access Badges */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <Label className="text-xs font-bold text-slate-700">
                                Required Access Badges (Optional tags)
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateGuide((draft) => {
                                    const p = draft.sections[activeSectionId].providers[pIndex];
                                    if (!p.requiredAccess) p.requiredAccess = [];
                                    p.requiredAccess.push("New Badge");
                                  })
                                }
                                className="text-[11px] text-blue-600 hover:text-blue-800 h-6"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Badge
                              </Button>
                            </div>

                            {provider.requiredAccess && provider.requiredAccess.length > 0 ? (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {provider.requiredAccess.map((badge, bIdx) => (
                                  <div
                                    key={bIdx}
                                    className="flex items-center gap-1 bg-slate-100 rounded-full pl-3 pr-1 py-0.5 border border-slate-200"
                                  >
                                    <input
                                      value={badge}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateGuide((draft) => {
                                          draft.sections[activeSectionId].providers[pIndex].requiredAccess![bIdx] = val;
                                        });
                                      }}
                                      className="text-xs font-semibold bg-transparent focus:outline-none w-28"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateGuide((draft) => {
                                          draft.sections[activeSectionId].providers[pIndex].requiredAccess!.splice(bIdx, 1);
                                        })
                                      }
                                      className="h-4 w-4 rounded-full text-slate-400 hover:text-red-600 flex items-center justify-center cursor-pointer"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic">No badges added.</p>
                            )}
                          </div>

                          {/* Ordered Steps */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-xs font-bold text-slate-700">
                                Step-by-Step Instructions ({provider.steps.length} steps)
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateGuide((draft) => {
                                    draft.sections[activeSectionId].providers[pIndex].steps.push("");
                                  })
                                }
                                className="text-xs text-blue-600 hover:text-blue-800 h-7"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Step
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {provider.steps.map((step, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-400 w-6 shrink-0">
                                    {sIdx + 1}.
                                  </span>
                                  <Input
                                    value={step}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateGuide((draft) => {
                                        draft.sections[activeSectionId].providers[pIndex].steps[sIdx] = val;
                                      });
                                    }}
                                    className="text-xs sm:text-sm"
                                    placeholder={`Step #${sIdx + 1}`}
                                  />

                                  {/* Step Up / Down / Remove */}
                                  <div className="flex items-center gap-0.5 shrink-0">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={sIdx === 0}
                                      onClick={() =>
                                        updateGuide((draft) => {
                                          const steps = draft.sections[activeSectionId].providers[pIndex].steps;
                                          const temp = steps[sIdx - 1];
                                          steps[sIdx - 1] = steps[sIdx];
                                          steps[sIdx] = temp;
                                        })
                                      }
                                      className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                                    >
                                      <ChevronUp className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={sIdx === provider.steps.length - 1}
                                      onClick={() =>
                                        updateGuide((draft) => {
                                          const steps = draft.sections[activeSectionId].providers[pIndex].steps;
                                          const temp = steps[sIdx + 1];
                                          steps[sIdx + 1] = steps[sIdx];
                                          steps[sIdx] = temp;
                                        })
                                      }
                                      className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                                    >
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={provider.steps.length === 1}
                                      onClick={() =>
                                        updateGuide((draft) => {
                                          draft.sections[activeSectionId].providers[pIndex].steps.splice(sIdx, 1);
                                        })
                                      }
                                      className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 disabled:opacity-20"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Notes (Callout Boxes) */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-xs font-bold text-slate-700">
                                Callout Notes (Displayed in blue info banner)
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateGuide((draft) => {
                                    const p = draft.sections[activeSectionId].providers[pIndex];
                                    if (!p.notes) p.notes = [];
                                    p.notes.push("");
                                  })
                                }
                                className="text-xs text-blue-600 hover:text-blue-800 h-7"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Callout Note
                              </Button>
                            </div>

                            {provider.notes && provider.notes.length > 0 ? (
                              <div className="space-y-2">
                                {provider.notes.map((note, nIdx) => (
                                  <div key={nIdx} className="flex items-start gap-2">
                                    <textarea
                                      rows={2}
                                      value={note}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        updateGuide((draft) => {
                                          draft.sections[activeSectionId].providers[pIndex].notes![nIdx] = val;
                                        });
                                      }}
                                      className="w-full text-xs sm:text-sm p-2 rounded-lg border border-slate-200 focus:outline-blue-500"
                                      placeholder="Callout note text..."
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        updateGuide((draft) => {
                                          draft.sections[activeSectionId].providers[pIndex].notes!.splice(nIdx, 1);
                                        })
                                      }
                                      className="text-slate-400 hover:text-red-600 h-8 w-8 p-0 shrink-0"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic">No notes added.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* SECRET GUARD WARNING MODAL */}
      {showSecretModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Security Warning: Possible Secrets Detected</h3>
                <p className="text-xs text-slate-500">
                  Our security guard detected terms that look like passwords, PINs, or codes.
                </p>
              </div>
            </div>

            <div className="bg-red-50/60 rounded-xl border border-red-100 p-3 max-h-56 overflow-y-auto space-y-2">
              {secretMatches.map((item, idx) => (
                <div key={idx} className="text-xs border-b border-red-100/80 pb-2 last:border-b-0">
                  <div className="font-bold text-red-800">{item.location}</div>
                  <div className="text-slate-600 mt-0.5">
                    Offending term:{" "}
                    <span className="font-mono font-bold bg-red-200/80 px-1 py-0.5 rounded text-red-900">
                      {item.match}
                    </span>
                  </div>
                  <div className="text-slate-500 italic mt-0.5 truncate">"{item.preview}"</div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong>Reminder:</strong> If any of these are actual credentials, delete them immediately.
              Clients must share passwords and verification codes only through our secure ShareFile portal.
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={secretBypassConfirmed}
                onChange={(e) => setSecretBypassConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-700 leading-snug">
                I have inspected the listed items and certify they are instructions/placeholders, not actual private credentials.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSecretModal(false);
                  setSecretBypassConfirmed(false);
                }}
                className="text-xs"
              >
                Cancel & Review
              </Button>
              <Button
                disabled={!secretBypassConfirmed || isSaving}
                onClick={executeSave}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Confirm & Save Anyway
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VERSION HISTORY MODAL */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-[#0f2142]">
                  Version History ({activeOffice.toUpperCase()})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVersionHistory(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Roll back to any of the last 20 saved versions of the {activeOffice.toUpperCase()} guide.
            </p>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {isLoadingVersions ? (
                <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading version snapshots...
                </div>
              ) : versions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No version history recorded yet. Saves will appear here.
                </div>
              ) : (
                versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Version #{ver.id}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(ver.created_at).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={restoringVersionId === ver.id}
                      onClick={() => handleRestore(ver.id)}
                      className="text-xs font-semibold h-8 text-blue-700 hover:bg-blue-50 border-blue-200"
                    >
                      {restoringVersionId === ver.id ? "Restoring..." : "Restore this version"}
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(false)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PROVIDER CONFIRMATION MODAL */}
      {deletingProvider && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Provider?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone unless restored.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong>"{deletingProvider.name}"</strong> from the {activeOffice.toUpperCase()} guide?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingProvider(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  updateGuide((draft) => {
                    const list = draft.sections[deletingProvider.sectionId].providers;
                    const idx = list.findIndex((p) => p.id === deletingProvider.providerId);
                    if (idx >= 0) list.splice(idx, 1);
                  });
                  toast.success(`Removed "${deletingProvider.name}".`);
                  setDeletingProvider(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Delete Provider
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* RESET TO DEFAULT CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <RotateCcw className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset to Default Seed?</h3>
                <p className="text-xs text-slate-500">Restore the original codebase configuration.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              This will overwrite the current {activeOffice.toUpperCase()} guide with the original static seed data from <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">onboardingGuides.ts</code>. A version snapshot of your current state will be created before resetting.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSaving}
                onClick={handleResetToDefault}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                {isSaving ? "Resetting..." : "Yes, Reset to Default"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

