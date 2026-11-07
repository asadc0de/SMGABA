import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  getTestimonialsAdmin,
  saveTestimonialsAdmin,
  resetSiteContentSectionAdmin,
  verifyAdminPassword,
} from "@/lib/site-content-admin";
import { type TestimonialItem, ALL_TESTIMONIALS, DEFAULT_TESTIMONIAL_CATEGORIES } from "@/data/testimonials";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Quote,
  Star,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  RefreshCw,
  Search,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/tools/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Testimonials & Endorsements | SMG ABA Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getTestimonialsAdmin();
      return { testimonials: data?.testimonials || ALL_TESTIMONIALS };
    } catch {
      return { testimonials: ALL_TESTIMONIALS };
    }
  },
  component: TestimonialsManagerPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

interface EditableTestimonialItem extends TestimonialItem {
  _uid?: string;
}

function ensureTestimonialUids(list: TestimonialItem[]): EditableTestimonialItem[] {
  return list.map((t, idx) => ({
    ...t,
    _uid: (t as EditableTestimonialItem)._uid || `testi_${idx}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  }));
}

function TestimonialsManagerPage() {
  const loaderData = Route.useLoaderData();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [testimonials, setTestimonials] = useState<EditableTestimonialItem[]>(() =>
    ensureTestimonialUids(loaderData?.testimonials || ALL_TESTIMONIALS),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newGlobalCategory, setNewGlobalCategory] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Auth on mount
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

  // Refresh
  async function refreshList() {
    setIsRefreshing(true);
    try {
      const res = await getTestimonialsAdmin();
      if (res?.testimonials) {
        setTestimonials(ensureTestimonialUids(res.testimonials));
        toast.success("Testimonials refreshed");
      }
    } catch {
      toast.error("Failed to refresh testimonials");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Save
  async function saveChanges() {
    setIsSaving(true);
    try {
      const cleanTestimonials: TestimonialItem[] = testimonials.map(({ _uid, ...rest }) => rest);
      const res = await saveTestimonialsAdmin({
        data: {
          password,
          testimonials: cleanTestimonials,
        },
      });
      if (res?.success) {
        toast.success("Testimonials updated successfully!");
      } else {
        toast.error(res?.error || "Failed to save testimonials");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving changes");
    } finally {
      setIsSaving(false);
    }
  }

  // Reset defaults
  async function resetToDefaults() {
    if (!window.confirm("Are you sure you want to restore the default 22 testimonials?")) return;
    setIsSaving(true);
    try {
      const res = await resetSiteContentSectionAdmin({
        data: {
          password,
          section: "testimonials",
        },
      });
      if (res?.success) {
        setTestimonials(ensureTestimonialUids([...ALL_TESTIMONIALS]));
        toast.success("Reset to default testimonials successfully");
      } else {
        toast.error(res?.error || "Failed to reset");
      }
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setIsSaving(false);
    }
  }

  // Add new
  function addNewTestimonial() {
    const newItem: EditableTestimonialItem = {
      _uid: `testi_new_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: "New Client Partner",
      category: "hospitality",
      logoText: "CLIENT",
      logoBg: "#ffffff",
      logoColor: "#0f2142",
      quote: "SMG provides unparalleled accounting and advisory service that has streamlined our operations and boosted profitability.",
      author: "Alex Morgan",
      role: "Managing Director",
      location: "New York, NY",
      stars: 5,
      hidden: false,
    };
    const updated = [newItem, ...testimonials];
    setTestimonials(updated);
    setEditingIndex(0);
    toast.info("New testimonial added. Edit details and click Save Changes.");
  }

  // Update
  function updateItem(idx: number, patch: Partial<TestimonialItem>) {
    setTestimonials((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  // Add a new testimonial category globally
  function handleAddGlobalCategory() {
    const cat = newGlobalCategory.trim().toLowerCase();
    if (!cat) return;
    if (!customCategories.includes(cat) && !DEFAULT_TESTIMONIAL_CATEGORIES.includes(cat)) {
      setCustomCategories((prev) => [...prev, cat]);
    }
    setNewGlobalCategory("");
    toast.success(`Category "${cat}" added!`);
  }

  // Remove
  function removeItem(idx: number) {
    if (!window.confirm(`Delete review for ${testimonials[idx].name}?`)) return;
    setTestimonials((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
    toast.success("Review deleted. Remember to click Save Changes.");
  }

  // Move
  function moveItem(idx: number, dir: -1 | 1) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= testimonials.length) return;
    setTestimonials((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  }

  const allCategories = useMemo(() => {
    const set = new Set([
      ...DEFAULT_TESTIMONIAL_CATEGORIES,
      ...customCategories,
      ...testimonials.map((t) => t.category).filter(Boolean),
    ]);
    return Array.from(set);
  }, [testimonials, customCategories]);

  const filteredTestimonials = useMemo(() => {
    return testimonials.map((t, originalIdx) => ({ item: t, originalIdx })).filter(({ item }) => {
      const matchCat = categoryFilter === "all" || item.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.quote.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [testimonials, categoryFilter, searchQuery]);

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
              <div className="size-14 mx-auto rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                <Quote className="size-7" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2142]">Testimonials Admin</h1>
              <p className="text-xs text-slate-500">
                Enter your administrative password to manage client quotes and reviews.
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
                Unlock Testimonials
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
            <a href="/testimonials" target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5 text-amber-600" />
              <span>Live Testimonials Page</span>
            </a>
          </Button>
        </div>

        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <Quote className="size-3.5" />
                <span>Reviews & Endorsements</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2142] tracking-tight">
                Client Testimonials & Endorsements
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Manage client quotes, company logo styling, star ratings, and display order published on <span className="font-semibold text-slate-700">/testimonials</span> and homepage carousels with real-time preview.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={addNewTestimonial}
                size="sm"
                className="rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 h-9 px-4 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Review</span>
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

          {/* Filter & Category Management Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                <span className="text-xs font-bold text-slate-400 mr-1">Category:</span>
                <button
                  type="button"
                  onClick={() => setCategoryFilter("all")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    categoryFilter === "all"
                      ? "bg-[#0f2142] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({testimonials.length})
                </button>
                {allCategories.map((cat) => {
                  const count = testimonials.filter((t) => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                        categoryFilter === cat
                          ? "bg-[#0f2142] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quote, author, company..."
                  className="pl-8 text-xs rounded-full h-8 bg-slate-50/80"
                />
              </div>
            </div>

            {/* Quick Add Industry Category */}
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 w-full sm:w-fit">
              <span className="text-xs font-bold text-navy flex items-center gap-1.5 shrink-0 pl-1">
                <Sparkles className="size-3.5 text-amber-500" /> + Add Category:
              </span>
              <Input
                placeholder="e.g. hospitality, dental..."
                value={newGlobalCategory}
                onChange={(e) => setNewGlobalCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddGlobalCategory();
                  }
                }}
                className="text-xs rounded-xl h-8 bg-white w-48 sm:w-56"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddGlobalCategory}
                className="rounded-xl h-8 text-xs font-bold bg-[#0f2142] hover:bg-[#0f2142]/90 text-white shrink-0 cursor-pointer"
              >
                <Plus className="size-3.5 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-800">{filteredTestimonials.length}</strong> of {testimonials.length} reviews
            </span>
            <span className="text-slate-400">Reorder with arrows, edit logos, and toggle visibility</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTestimonials.map(({ item, originalIdx }) => {
              const isEditing = editingIndex === originalIdx;

              return (
                <div
                  key={item._uid || `testi-${originalIdx}`}
                  className={`bg-white rounded-2xl border transition-all ${
                    item.hidden ? "opacity-60 bg-slate-50/50" : ""
                  } ${
                    isEditing
                      ? "border-amber-400 shadow-md ring-2 ring-amber-500/10"
                      : "border-slate-200/80 hover:border-slate-300 shadow-xs"
                  } p-5`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Brand Pill + Details */}
                    <div className="flex items-start md:items-center gap-3.5 flex-1 min-w-0">
                      <div
                        className="px-3 py-1.5 rounded-xl font-black text-xs tracking-wider uppercase border border-black/10 shrink-0 shadow-xs flex items-center justify-center min-w-[90px]"
                        style={{
                          backgroundColor: item.logoBg || "#ffffff",
                          color: item.logoColor || "#0f2142",
                        }}
                      >
                        {item.logoText || item.name}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0f2142]">{item.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50 capitalize">
                            {item.category}
                          </span>
                          {item.hidden && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                              Hidden (Draft)
                            </span>
                          )}
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: item.stars || 5 }).map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 italic line-clamp-1 mt-1">"{item.quote}"</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.author} • {item.role} • {item.location}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveItem(originalIdx, -1)}
                        disabled={originalIdx === 0}
                        className="size-8 p-0 rounded-lg text-slate-500 hover:text-[#0f2142]"
                        title="Move Up"
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveItem(originalIdx, 1)}
                        disabled={originalIdx === testimonials.length - 1}
                        className="size-8 p-0 rounded-lg text-slate-500 hover:text-[#0f2142]"
                        title="Move Down"
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateItem(originalIdx, { hidden: !item.hidden })}
                        className="size-8 p-0 rounded-lg text-slate-500 hover:text-[#0f2142]"
                        title={item.hidden ? "Make Live" : "Hide"}
                      >
                        {item.hidden ? <EyeOff className="size-4 text-slate-400" /> : <Eye className="size-4 text-emerald-600" />}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingIndex(isEditing ? null : originalIdx)}
                        className={`text-xs font-semibold rounded-lg h-8 px-3 ${
                          isEditing ? "bg-amber-50 text-amber-700 border-amber-300" : ""
                        }`}
                      >
                        {isEditing ? "Close Editor" : "Edit Review"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(originalIdx)}
                        className="size-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Form */}
                  {isEditing && (
                    <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Client / Company Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(originalIdx, { name: e.target.value })}
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold text-slate-700">Industry Category</Label>
                          <span className="text-[10px] text-slate-400">Select or enter below</span>
                        </div>
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(originalIdx, { category: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 bg-white h-9 px-3 capitalize focus:outline-none focus:ring-2 focus:ring-[#0f2142]"
                        >
                          {allCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            placeholder="Add custom category..."
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = newCategoryInput.trim().toLowerCase();
                                if (val) {
                                  updateItem(originalIdx, { category: val });
                                  if (!customCategories.includes(val) && !DEFAULT_TESTIMONIAL_CATEGORIES.includes(val)) {
                                    setCustomCategories((prev) => [...prev, val]);
                                  }
                                  setNewCategoryInput("");
                                  toast.success(`Assigned category "${val}"`);
                                }
                              }
                            }}
                            className="text-xs rounded-xl h-8"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const val = newCategoryInput.trim().toLowerCase();
                              if (val) {
                                updateItem(originalIdx, { category: val });
                                if (!customCategories.includes(val) && !DEFAULT_TESTIMONIAL_CATEGORIES.includes(val)) {
                                  setCustomCategories((prev) => [...prev, val]);
                                }
                                setNewCategoryInput("");
                                toast.success(`Assigned category "${val}"`);
                              }
                            }}
                            className="rounded-xl h-8 text-xs font-semibold shrink-0 cursor-pointer"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Star Rating (1 - 5)</Label>
                        <select
                          value={item.stars || 5}
                          onChange={(e) => updateItem(originalIdx, { stars: Number(e.target.value) })}
                          className="w-full text-xs rounded-xl border border-slate-200 bg-white h-9 px-3 focus:outline-none focus:ring-2 focus:ring-[#0f2142]"
                        >
                          <option value={5}>5 Stars ★★★★★</option>
                          <option value={4}>4 Stars ★★★★☆</option>
                          <option value={3}>3 Stars ★★★☆☆</option>
                        </select>
                      </div>

                      {/* Logo Badge Styling */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Logo Badge Text</Label>
                        <Input
                          value={item.logoText}
                          onChange={(e) => updateItem(originalIdx, { logoText: e.target.value })}
                          placeholder="e.g. GLAZE"
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Logo Background Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={item.logoBg?.startsWith("#") ? item.logoBg : "#ffffff"}
                            onChange={(e) => updateItem(originalIdx, { logoBg: e.target.value })}
                            className="size-8 rounded-lg cursor-pointer border p-0.5"
                          />
                          <Input
                            value={item.logoBg}
                            onChange={(e) => updateItem(originalIdx, { logoBg: e.target.value })}
                            placeholder="#ffffff"
                            className="text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Logo Font Color</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={item.logoColor?.startsWith("#") ? item.logoColor : "#0f2142"}
                            onChange={(e) => updateItem(originalIdx, { logoColor: e.target.value })}
                            className="size-8 rounded-lg cursor-pointer border p-0.5"
                          />
                          <Input
                            value={item.logoColor}
                            onChange={(e) => updateItem(originalIdx, { logoColor: e.target.value })}
                            placeholder="#0f2142"
                            className="text-xs rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Author Details */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Author Name</Label>
                        <Input
                          value={item.author}
                          onChange={(e) => updateItem(originalIdx, { author: e.target.value })}
                          placeholder="e.g. Paul B."
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Author Role / Title</Label>
                        <Input
                          value={item.role}
                          onChange={(e) => updateItem(originalIdx, { role: e.target.value })}
                          placeholder="e.g. Founder & CEO"
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Location / Territory</Label>
                        <Input
                          value={item.location}
                          onChange={(e) => updateItem(originalIdx, { location: e.target.value })}
                          placeholder="e.g. New York, NY"
                          className="text-xs rounded-xl"
                        />
                      </div>

                      {/* Full Quote */}
                      <div className="space-y-1.5 md:col-span-3">
                        <Label className="text-xs font-bold text-slate-700">Client Endorsement Quote</Label>
                        <Textarea
                          value={item.quote}
                          onChange={(e) => updateItem(originalIdx, { quote: e.target.value })}
                          rows={3}
                          placeholder="Enter complete quote statement..."
                          className="text-xs rounded-xl leading-relaxed"
                        />
                      </div>

                      <div className="md:col-span-3 flex justify-end gap-2 pt-2">
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
                          className="rounded-xl bg-[#0f2142] hover:bg-amber-700 text-white text-xs font-bold"
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

