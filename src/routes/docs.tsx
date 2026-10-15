import { useState, useEffect, lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";
import { verifyAdminPassword } from "@/lib/webinar-redirects";

/**
 * DocsContent is imported lazily so its ~120 KB JS chunk is a SEPARATE bundle
 * that is NEVER included in the initial page load. The browser only requests it
 * after the user successfully authenticates.
 */
const LazyDocsContent = lazy(() => import("@/components/docs/DocsContent"));

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Visual CMS User Guide & Documentation | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Comprehensive user guide for the SMG ABA Visual CMS page builder. Step-by-step instructions, block library, screenshot walkthroughs, and publishing checklist.",
      },
    ],
  }),
  component: DocsPageWrapper,
});

/**
 * Auth storage key — sessionStorage ONLY. Never localStorage.
 * The raw password is never persisted beyond the current browser tab.
 */
const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

export function DocsPageWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Auto-verify on client mount if stored in sessionStorage (tab-scoped only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        verify(stored, false);
      }
    }
  }, []);

  async function verify(pwd: string, showToast = true) {
    if (!pwd.trim()) {
      setAuthError("Please enter your administrator password.");
      return;
    }
    setIsVerifying(true);
    setAuthError("");
    try {
      const res = await verifyAdminPassword({ data: pwd.trim() });
      if (res?.authorized) {
        setIsAuthenticated(true);
        // sessionStorage only — clears when the tab closes
        if (typeof window !== "undefined") {
          sessionStorage.setItem(AUTH_STORAGE_KEY, pwd.trim());
        }
        if (showToast) {
          toast.success("Documentation unlocked successfully.");
        }
      } else {
        setIsAuthenticated(false);
        setAuthError(res?.error || "Incorrect administrator password.");
        if (showToast) {
          toast.error("Incorrect administrator password.");
        }
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError("Failed to verify password with server.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    verify(passwordInput, true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setPasswordInput("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
    toast.info("Logged out from CMS Documentation.");
  }

  // When unauthenticated, render ONLY the lock screen — no docs content in DOM
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary/20">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-28 sm:py-36">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-2.5">
              <div className="size-14 rounded-2xl bg-[#0f2142] text-white flex items-center justify-center shadow-lg shadow-[#0f2142]/20">
                <Lock className="size-7" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2142] tracking-tight">
                Visual CMS Documentation
              </h1>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Enter your administrator password to access the CMS user guide and block library.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="docs-admin-pw" className="text-xs font-bold text-slate-700">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    id="docs-admin-pw"
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm outline-none transition focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
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

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full rounded-xl bg-[#0f2142] hover:bg-[#0f2142]/90 text-white font-bold h-11 text-xs uppercase tracking-wider transition-all shadow-md shadow-[#0f2142]/10 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Unlock Documentation"}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Only after auth: dynamically load the heavy docs chunk
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
          <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
            <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
            Loading documentation…
          </div>
        </div>
      }
    >
      <LazyDocsContent onLogout={handleLogout} />
    </Suspense>
  );
}

export function DocsPage() {
  return <DocsPageWrapper />;
}
