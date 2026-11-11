import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useTransition } from "react";
import {
  getTeamMembersAdmin,
  saveTeamMembersAdmin,
  resetSiteContentSectionAdmin,
  verifyAdminPassword,
} from "@/lib/site-content-admin";
import { type TeamMember, TEAM_MEMBERS } from "@/data/teamMembers";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MediaImageInput } from "@/components/admin/MediaImagePickerModal";
import {
  Users,
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
  Mail,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ShieldCheck,
  Building2,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/tools/team")({
  head: () => ({
    meta: [
      { title: "Team Directory & Roster Manager | SMG ABA Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getTeamMembersAdmin();
      return { members: data?.members || TEAM_MEMBERS };
    } catch {
      return { members: TEAM_MEMBERS };
    }
  },
  component: TeamManagerPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

const DEFAULT_CATEGORIES = [
  "Partners",
  "Directors & Executive Advisory",
  "Tax & Compliance",
  "Accounting & Client Services",
  "Operations & HR",
  "Bookkeeping & Payroll",
  "Audit & Assurance",
  "CFO Advisory",
  "Business Development",
];

interface EditableTeamMember extends TeamMember {
  _uid?: string;
}

function ensureUids(list: TeamMember[]): EditableTeamMember[] {
  return list.map((m, idx) => ({
    ...m,
    _uid: (m as EditableTeamMember)._uid || `tm_${idx}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  }));
}

function TeamManagerPage() {
  const loaderData = Route.useLoaderData();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [members, setMembers] = useState<EditableTeamMember[]>(() =>
    ensureUids(loaderData?.members || TEAM_MEMBERS),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newGlobalCategory, setNewGlobalCategory] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");

  // Check stored auth
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

  // Reload data
  async function refreshList() {
    setIsRefreshing(true);
    try {
      const res = await getTeamMembersAdmin();
      if (res?.members) {
        setMembers(ensureUids(res.members));
        toast.success("Team roster refreshed");
      }
    } catch {
      toast.error("Failed to refresh team roster");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Save changes
  async function saveChanges() {
    setIsSaving(true);
    try {
      const cleanMembers: TeamMember[] = members.map(({ _uid, ...rest }) => rest);
      const res = await saveTeamMembersAdmin({
        data: {
          password,
          members: cleanMembers,
        },
      });
      if (res?.success) {
        toast.success("Team members saved successfully!");
      } else {
        toast.error(res?.error || "Failed to save team members");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving changes");
    } finally {
      setIsSaving(false);
    }
  }

  // Reset to default
  async function resetToDefaults() {
    if (!window.confirm("Are you sure you want to reset the team roster to the default seed list?")) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await resetSiteContentSectionAdmin({
        data: {
          password,
          section: "team",
        },
      });
      if (res?.success) {
        setMembers(ensureUids([...TEAM_MEMBERS]));
        toast.success("Reset to default team members successfully");
      } else {
        toast.error(res?.error || "Failed to reset");
      }
    } catch (err: any) {
      toast.error(err?.message || "Reset failed");
    } finally {
      setIsSaving(false);
    }
  }

  // Add new member
  function addNewMember() {
    const newMember: EditableTeamMember = {
      _uid: `tm_new_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name: "New Team Member",
      role: "Advisor",
      category: "Partners",
      email: "contact@smgaba.com",
      avatar: "/images/team/greg.webp",
      bio: "Enter full biography here...",
      credentials: ["CPA"],
    };
    const updated = [newMember, ...members];
    setMembers(updated);
    setEditingIndex(0);
    toast.info("New member added. Fill out details and click Save Changes.");
  }

  // Update member
  function updateMember(idx: number, patch: Partial<TeamMember>) {
    setMembers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  }

  // Add a new department category globally
  function handleAddGlobalCategory() {
    const cat = newGlobalCategory.trim();
    if (!cat) return;
    if (!customCategories.includes(cat) && !DEFAULT_CATEGORIES.includes(cat)) {
      setCustomCategories((prev) => [...prev, cat]);
    }
    setNewGlobalCategory("");
    toast.success(`Department "${cat}" added!`);
  }

  // Remove member
  function removeMember(idx: number) {
    if (!window.confirm(`Delete ${members[idx].name}?`)) return;
    setMembers((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
    toast.success("Member removed from list. Remember to Save Changes.");
  }

  // Reorder
  function moveMember(idx: number, dir: -1 | 1) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= members.length) return;
    setMembers((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  }

  const allCategories = useMemo(() => {
    const set = new Set([
      ...DEFAULT_CATEGORIES,
      ...customCategories,
      ...members.map((m) => m.category).filter(Boolean),
    ]);
    return Array.from(set);
  }, [members, customCategories]);

  const filteredMembers = useMemo(() => {
    return members.map((m, originalIdx) => ({ member: m, originalIdx })).filter(({ member }) => {
      const matchCat = categoryFilter === "All" || member.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [members, categoryFilter, searchQuery]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
          <RefreshCw className="size-5 animate-spin text-[#0f2142]" />
          <span>Verifying admin session...</span>
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
              <div className="size-14 mx-auto rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                <Users className="size-7" />
              </div>
              <h1 className="text-2xl font-black text-[#0f2142]">Team Directory Admin</h1>
              <p className="text-xs text-slate-500">
                Enter your administrative password to manage firm team members and roster bios.
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
                    placeholder="Enter admin password..."
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
                Unlock Team Manager
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

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-semibold gap-1.5 h-8 bg-white"
            >
              <a href="/our-team" target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5 text-blue-600" />
                <span>View Live Page</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Users className="size-3.5" />
                <span>Roster & Bios Manager</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0f2142] tracking-tight">
                Team Directory & Roster Manager
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Add, edit, reorder, and curate partner bios, roles, email contacts, avatar pictures, credentials, and department filter categories published on <span className="font-semibold text-slate-700">/our-team</span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={addNewMember}
                size="sm"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 h-9 px-4 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Add Member</span>
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

          {/* Quick Filter & Department Management Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                <span className="text-xs font-bold text-slate-400 mr-1">Filter Department:</span>
                <button
                  type="button"
                  onClick={() => setCategoryFilter("All")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    categoryFilter === "All"
                      ? "bg-[#0f2142] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({members.length})
                </button>
                {allCategories.map((cat) => {
                  const count = members.filter((m) => m.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
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
                  placeholder="Search name, role, email..."
                  className="pl-8 text-xs rounded-full h-8 bg-slate-50/80"
                />
              </div>
            </div>

            {/* Quick Add Department Bar */}
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 w-full sm:w-fit">
              <span className="text-xs font-bold text-navy flex items-center gap-1.5 shrink-0 pl-1">
                <Building2 className="size-3.5 text-primary" /> + Add Department Category:
              </span>
              <Input
                placeholder="e.g. Wealth Management..."
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

        {/* Member Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-800">{filteredMembers.length}</strong> of {members.length} team members
            </span>
            <span className="text-slate-400">Drag or use arrow buttons to adjust priority ordering</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredMembers.map(({ member, originalIdx }) => {
              const isEditing = editingIndex === originalIdx;

              return (
                <div
                  key={member._uid || `team-member-${originalIdx}`}
                  className={`bg-white rounded-2xl border transition-all ${
                    isEditing
                      ? "border-blue-400 shadow-md ring-2 ring-blue-500/10"
                      : "border-slate-200/80 hover:border-slate-300 shadow-xs"
                  } p-5`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Member Summary Header */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <img
                        src={member.avatar || "/images/team/greg.webp"}
                        alt={member.name}
                        className="size-14 rounded-2xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/team/greg.webp";
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-[#0f2142] truncate">{member.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/50">
                            {member.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{member.role}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="size-3 text-slate-400" />
                          <span>{member.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveMember(originalIdx, -1)}
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
                        onClick={() => moveMember(originalIdx, 1)}
                        disabled={originalIdx === members.length - 1}
                        className="size-8 p-0 rounded-lg text-slate-500 hover:text-[#0f2142]"
                        title="Move Down"
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingIndex(isEditing ? null : originalIdx)}
                        className={`text-xs font-semibold rounded-lg h-8 px-3 ${
                          isEditing ? "bg-blue-50 text-blue-700 border-blue-300" : ""
                        }`}
                      >
                        {isEditing ? "Close Editor" : "Edit Details"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(originalIdx)}
                        className="size-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Editor Form */}
                  {isEditing && (
                    <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Full Name & Suffix</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => updateMember(originalIdx, { name: e.target.value })}
                          placeholder="e.g. Gregory M. Scotto, CPA"
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Role / Position Title</Label>
                        <Input
                          value={member.role}
                          onChange={(e) => updateMember(originalIdx, { role: e.target.value })}
                          placeholder="e.g. Managing Partner"
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold text-slate-700">Department Category</Label>
                          <span className="text-[10px] text-slate-400">Select or enter below</span>
                        </div>
                        <select
                          value={member.category}
                          onChange={(e) => updateMember(originalIdx, { category: e.target.value })}
                          className="w-full text-xs rounded-xl border border-slate-200 bg-white h-9 px-3 focus:outline-none focus:ring-2 focus:ring-[#0f2142]"
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
                                const val = newCategoryInput.trim();
                                if (val) {
                                  updateMember(originalIdx, { category: val });
                                  if (!customCategories.includes(val) && !DEFAULT_CATEGORIES.includes(val)) {
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
                              const val = newCategoryInput.trim();
                              if (val) {
                                updateMember(originalIdx, { category: val });
                                if (!customCategories.includes(val) && !DEFAULT_CATEGORIES.includes(val)) {
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
                        <Label className="text-xs font-bold text-slate-700">Email Address</Label>
                        <Input
                          value={member.email}
                          onChange={(e) => updateMember(originalIdx, { email: e.target.value })}
                          placeholder="name@smgaba.com"
                          className="text-xs rounded-xl"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <MediaImageInput
                          label="Member Headshot / Avatar (Upload from Device or Gallery)"
                          value={member.avatar}
                          onChange={(url) => updateMember(originalIdx, { avatar: url })}
                          placeholder="/images/team/greg.webp or https://..."
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-bold text-slate-700">Professional Biography</Label>
                        <Textarea
                          value={member.bio}
                          onChange={(e) => updateMember(originalIdx, { bio: e.target.value })}
                          rows={4}
                          placeholder="Describe background, education, and credentials..."
                          className="text-xs rounded-xl leading-relaxed"
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
                          className="rounded-xl bg-[#0f2142] hover:bg-blue-700 text-white text-xs font-bold"
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

