import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getOfficesAdmin,
  saveOfficesAdmin,
  resetSiteContentSectionAdmin,
  verifyAdminPassword,
} from "@/lib/site-content-admin";
import { type OfficeItem, OFFICES } from "@/data/offices";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MapPin,
  Building2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  Clock,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/tools/offices")({
  head: () => ({
    meta: [
      { title: "Office Locations Manager | SMG ABA Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getOfficesAdmin();
      return { offices: data?.offices || OFFICES };
    } catch {
      return { offices: OFFICES };
    }
  },
  component: OfficesManagerPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function OfficesManagerPage() {
  const loaderData = Route.useLoaderData();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [offices, setOffices] = useState<OfficeItem[]>(loaderData?.offices || OFFICES);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  async function refreshList() {
    setIsRefreshing(true);
    try {
      const res = await getOfficesAdmin();
      if (res?.offices) {
        setOffices(res.offices);
        toast.success("Office locations refreshed");
      }
    } catch {
      toast.error("Failed to refresh offices");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function saveChanges() {
    setIsSaving(true);
    try {
      const res = await saveOfficesAdmin({
        data: {
          password,
          offices,
        },
      });
      if (res?.success) {
        toast.success("Offices updated successfully!");
      } else {
        toast.error(res?.error || "Failed to save offices");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving changes");
    } finally {
      setIsSaving(false);
    }
  }

  async function resetToDefaults() {
    if (!window.confirm("Are you sure you want to restore the default 3 offices?")) return;
    setIsSaving(true);
    try {
      const res = await resetSiteContentSectionAdmin({
        data: {
          password,
          section: "offices",
        },
      });
      if (res?.success) {
        setOffices([...OFFICES]);
        toast.success("Reset to default offices successfully");
      } else {
        toast.error(res?.error || "Failed to reset");
      }
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setIsSaving(false);
    }
  }

  function addNewOffice() {
    const newOffice: OfficeItem = {
      id: `office-${Date.now()}`,
      name: "New Regional Office",
      eyebrow: "Regional Practice",
      addressLine1: "100 Main Street, Suite 400",
      addressLine2: "City, ST 00000",
      phone: "(800) 555-0199",
      phoneRaw: "8005550199",
      fax: "(800) 555-0198",
      hours: "Mon – Fri: 9:00am – 5:00pm",
      taxHours: null,
      href: "/contact",
      mapUrl: "https://maps.google.com",
    };
    setOffices([...offices, newOffice]);
    setEditingIndex(offices.length);
    toast.info("New office added. Update details and click Save Changes.");
  }

  function updateOffice(idx: number, patch: Partial<OfficeItem>) {
    setOffices((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  function removeOffice(idx: number) {
    if (!window.confirm(`Delete office "${offices[idx].name}"?`)) return;
    setOffices((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
    toast.success("Office removed. Remember to Save Changes.");
  }

  function moveOffice(idx: number, dir: -1 | 1) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= offices.length) return;
    setOffices((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
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
              <div className="size-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <MapPin className="size-7" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2142]">Office Locations Admin</h1>
              <p className="text-xs text-slate-500">
                Enter your administrative password to manage firm locations, hours, and addresses.
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
                Unlock Offices Manager
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
            <a href="/contact" target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5 text-emerald-600" />
              <span>Live Contact Page</span>
            </a>
          </Button>
        </div>

        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <MapPin className="size-3.5" />
                <span>Regional Footprint</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2142] tracking-tight">
                Office Locations Manager
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Edit office names, addresses, phone numbers, hours, maps, and display order across Header, Footer, Contact, Location pages, and the homepage.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={addNewOffice}
                size="sm"
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 h-9 px-4 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Office</span>
              </Button>

              <Button
                onClick={saveChanges}
                disabled={isSaving}
                size="sm"
                className="rounded-full bg-[#0f2142] hover:bg-[#0f2142]/90 text-white font-bold text-xs gap-1.5 h-9 px-4 cursor-pointer"
              >
                <Save className="size-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>

              <Button
                onClick={refreshList}
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

        {/* Offices Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Managing <strong className="text-slate-800">{offices.length}</strong> firm locations
            </span>
            <span className="text-slate-400">Order controls sequence in Header, Footer, and Contact page</span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {offices.map((office, idx) => {
              const isEditing = editingIndex === idx;

              return (
                <div
                  key={office.id || idx}
                  className={`bg-white rounded-2xl border transition-all ${
                    isEditing
                      ? "border-emerald-400 shadow-md ring-2 ring-emerald-500/10"
                      : "border-slate-200/80 hover:border-slate-300 shadow-xs"
                  } p-6`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start md:items-center gap-4 flex-1">
                      <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                        <Building2 className="size-6" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-[#0f2142]">{office.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                            {office.eyebrow}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {office.addressLine1}, {office.addressLine2}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="size-3" /> {office.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" /> {office.hours}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveOffice(idx, -1)}
                        disabled={idx === 0}
                        className="size-8 p-0 rounded-lg text-slate-500 hover:text-[#0f2142]"
                        title="Move Up"
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveOffice(idx, 1)}
                        disabled={idx === offices.length - 1}
                        className="size-8 p-0 rounded-lg text-slate-500 hover:text-[#0f2142]"
                        title="Move Down"
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingIndex(isEditing ? null : idx)}
                        className={`text-xs font-semibold rounded-lg h-8 px-3 ${
                          isEditing ? "bg-emerald-50 text-emerald-700 border-emerald-300" : ""
                        }`}
                      >
                        {isEditing ? "Close Editor" : "Edit Office"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOffice(idx)}
                        className="size-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Office Title Name</Label>
                        <Input
                          value={office.name}
                          onChange={(e) => updateOffice(idx, { name: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Eyebrow / Sub-badge</Label>
                        <Input
                          value={office.eyebrow}
                          onChange={(e) => updateOffice(idx, { eyebrow: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Address Line 1 (Street)</Label>
                        <Input
                          value={office.addressLine1}
                          onChange={(e) => updateOffice(idx, { addressLine1: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Address Line 2 (City, ST Zip)</Label>
                        <Input
                          value={office.addressLine2}
                          onChange={(e) => updateOffice(idx, { addressLine2: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Formatted Phone Number</Label>
                        <Input
                          value={office.phone}
                          onChange={(e) => updateOffice(idx, { phone: e.target.value, phoneRaw: e.target.value.replace(/\D/g, "") })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Fax Number</Label>
                        <Input
                          value={office.fax}
                          onChange={(e) => updateOffice(idx, { fax: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Regular Operating Hours</Label>
                        <Input
                          value={office.hours}
                          onChange={(e) => updateOffice(idx, { hours: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Tax Season Hours (Optional)</Label>
                        <Input
                          value={office.taxHours || ""}
                          onChange={(e) => updateOffice(idx, { taxHours: e.target.value || null })}
                          placeholder="e.g. Sat*: 9:00am – 5:00pm (*Jan 1 – Apr 15)"
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Target Page Link</Label>
                        <Input
                          value={office.href}
                          onChange={(e) => updateOffice(idx, { href: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Google Maps Direction URL</Label>
                        <Input
                          value={office.mapUrl || ""}
                          onChange={(e) => updateOffice(idx, { mapUrl: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setEditingIndex(null)}
                          variant="outline"
                          className="rounded-xl text-xs font-semibold"
                        >
                          Done Editing
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={saveChanges}
                          className="rounded-xl bg-[#0f2142] hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

