import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getCmsSiteSettings, saveCmsSiteSettings, uploadCmsImage } from "@/lib/cms.server";
import {
  type CmsSiteSettings,
  type NavItem,
  type NavSubItem,
  type FooterLinkGroup,
  type SocialLink,
  DEFAULT_SITE_SETTINGS,
  isValidNavigationUrl,
} from "@/lib/cms-settings";
import { isValidImageUrl } from "@/cms/blocks/Image";
import { verifyAdminPassword } from "@/lib/webinar-redirects";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import {
  Lock,
  Unlock,
  ArrowLeft,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Globe,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Menu as MenuIcon,
  Share2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/internal/settings")({
  head: () => ({
    meta: [
      { title: "Navigation & Global Site Settings | SMG ABA Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CmsSettingsManagerRoute,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function CmsSettingsManagerRoute() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<CmsSiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"header" | "footer" | "preview">("header");

  // Logo upload state
  const [isUploadingHeaderLogo, setIsUploadingHeaderLogo] = useState<boolean>(false);
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState<boolean>(false);

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
        loadSettings();
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

  async function loadSettings() {
    setIsLoading(true);
    try {
      const res = await getCmsSiteSettings();
      if (res.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      toast.error("Failed to load site settings.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      const res = await saveCmsSiteSettings({
        data: {
          settings,
          adminPassword,
        },
      });

      if (res.success && res.settings) {
        setSettings(res.settings);
        toast.success("Site navigation and settings saved successfully!");
      } else {
        toast.error(res.error || "Failed to save site settings.");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      toast.error("An error occurred while saving site settings.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogoUpload(file: File, target: "header" | "footer") {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    if (target === "header") setIsUploadingHeaderLogo(true);
    else setIsUploadingFooterLogo(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(",")[1];
        const res = await uploadCmsImage({
          data: {
            fileName: file.name,
            contentType: file.type,
            base64Data,
            adminPassword,
          },
        });

        if (res?.success && res.url) {
          if (target === "header") {
            setSettings((prev) => ({
              ...prev,
              header: { ...prev.header, logoUrl: res.url },
            }));
          } else {
            setSettings((prev) => ({
              ...prev,
              footer: { ...prev.footer, logoUrl: res.url },
            }));
          }
          toast.success("Logo uploaded successfully!");
        } else {
          toast.error(res?.error || "Failed to upload logo.");
        }
        if (target === "header") setIsUploadingHeaderLogo(false);
        else setIsUploadingFooterLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error(err?.message || "Failed to read image.");
      if (target === "header") setIsUploadingHeaderLogo(false);
      else setIsUploadingFooterLogo(false);
    }
  }

  // Navigation Items Helpers
  function addNavItem() {
    const newItem: NavItem = {
      id: `nav-${Date.now()}`,
      label: "NEW ITEM",
      href: "/services",
      enabled: true,
      children: [],
    };
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navItems: [...prev.header.navItems, newItem],
      },
    }));
  }

  function updateNavItem(index: number, updates: Partial<NavItem>) {
    setSettings((prev) => {
      const items = [...prev.header.navItems];
      items[index] = { ...items[index], ...updates };
      return {
        ...prev,
        header: { ...prev.header, navItems: items },
      };
    });
  }

  function removeNavItem(index: number) {
    setSettings((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        navItems: prev.header.navItems.filter((_, i) => i !== index),
      },
    }));
  }

  function moveNavItem(index: number, direction: "up" | "down") {
    setSettings((prev) => {
      const items = [...prev.header.navItems];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return {
        ...prev,
        header: { ...prev.header, navItems: items },
      };
    });
  }

  function addSubItem(parentIndex: number) {
    const newSub: NavSubItem = {
      id: `sub-${Date.now()}`,
      label: "New Sub-Service",
      href: "/solutions/new-service",
      desc: "Short description of this service",
      enabled: true,
    };
    setSettings((prev) => {
      const items = [...prev.header.navItems];
      const parent = items[parentIndex];
      items[parentIndex] = {
        ...parent,
        children: [...(parent.children || []), newSub],
      };
      return {
        ...prev,
        header: { ...prev.header, navItems: items },
      };
    });
  }

  function updateSubItem(parentIndex: number, subIndex: number, updates: Partial<NavSubItem>) {
    setSettings((prev) => {
      const items = [...prev.header.navItems];
      const parent = items[parentIndex];
      const children = [...(parent.children || [])];
      children[subIndex] = { ...children[subIndex], ...updates };
      items[parentIndex] = { ...parent, children };
      return {
        ...prev,
        header: { ...prev.header, navItems: items },
      };
    });
  }

  function removeSubItem(parentIndex: number, subIndex: number) {
    setSettings((prev) => {
      const items = [...prev.header.navItems];
      const parent = items[parentIndex];
      items[parentIndex] = {
        ...parent,
        children: (parent.children || []).filter((_, i) => i !== subIndex),
      };
      return {
        ...prev,
        header: { ...prev.header, navItems: items },
      };
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      <Toaster position="top-right" richColors />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-navy">
              <Link to="/internal/pages">
                <ArrowLeft className="size-4" />
                CMS Pages
              </Link>
            </Button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-navy/10 flex items-center justify-center text-navy">
                <SettingsIcon className="size-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-navy">Global Site & Navigation Settings</h1>
                <p className="text-xs text-slate-500">Manage header, footer, menus & branding</p>
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSettings}
                disabled={isLoading || isSaving}
                className="gap-1.5 text-xs rounded-full border-slate-300"
              >
                <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Reload
              </Button>
              <Button
                size="sm"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-navy text-white hover:bg-navy/90 gap-1.5 text-xs rounded-full"
              >
                <Save className={`size-3.5 ${isSaving ? "animate-spin" : ""}`} />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 my-12">
            <div className="size-12 rounded-full bg-navy/5 text-navy flex items-center justify-center mx-auto mb-4">
              <Lock className="size-6" />
            </div>
            <h2 className="text-xl font-bold text-center text-navy">Admin Access Required</h2>
            <p className="text-xs text-center text-slate-500 mt-1 mb-6">
              Enter your internal admin password to manage site settings.
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
                    className="pr-10 text-xs"
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
                    Unlock Settings
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("header")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "header"
                    ? "bg-navy text-white shadow-xs"
                    : "text-slate-600 hover:text-navy hover:bg-slate-50"
                }`}
              >
                <MenuIcon className="size-4" />
                Header & Navigation Menu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("footer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "footer"
                    ? "bg-navy text-white shadow-xs"
                    : "text-slate-600 hover:text-navy hover:bg-slate-50"
                }`}
              >
                <Share2 className="size-4" />
                Footer & Social Links
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === "preview"
                    ? "bg-navy text-white shadow-xs"
                    : "text-slate-600 hover:text-navy hover:bg-slate-50"
                }`}
              >
                <Eye className="size-4" />
                Live Preview
              </button>
            </div>

            {/* TAB 1: HEADER & NAVIGATION */}
            {activeTab === "header" && (
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Header Branding Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                  <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                    <ImageIcon className="size-4 text-navy" />
                    Logo & CTA Button
                  </h2>

                  <div>
                    <Label htmlFor="hdr-logo" className="text-xs font-medium text-slate-700">
                      Header Logo URL
                    </Label>
                    <Input
                      id="hdr-logo"
                      value={settings.header.logoUrl || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          header: { ...prev.header, logoUrl: e.target.value },
                        }))
                      }
                      placeholder="Leave empty for default SMG logo SVG"
                      className="mt-1 text-xs"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingHeaderLogo}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleLogoUpload(f, "header");
                          }}
                          className="hidden"
                        />
                        <span className="inline-flex items-center justify-center w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                          {isUploadingHeaderLogo ? "Uploading..." : "Upload Logo Image"}
                        </span>
                      </label>
                      {settings.header.logoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              header: { ...prev.header, logoUrl: "" },
                            }))
                          }
                          className="px-2 py-1.5 text-xs text-slate-500 hover:text-destructive border border-slate-200 rounded-md"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hdr-alt" className="text-xs font-medium text-slate-700">
                      Logo Alt Text
                    </Label>
                    <Input
                      id="hdr-alt"
                      value={settings.header.logoAlt || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          header: { ...prev.header, logoAlt: e.target.value },
                        }))
                      }
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cta-enable" className="text-xs font-medium text-slate-700 cursor-pointer">
                        Enable CTA Button
                      </Label>
                      <input
                        id="cta-enable"
                        type="checkbox"
                        checked={settings.header.ctaButton?.enabled !== false}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              ctaButton: {
                                ...prev.header.ctaButton,
                                enabled: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="size-4 text-navy rounded border-slate-300 focus:ring-navy cursor-pointer"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta-label" className="text-xs font-medium text-slate-700">
                        CTA Label
                      </Label>
                      <Input
                        id="cta-label"
                        value={settings.header.ctaButton?.label || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              ctaButton: {
                                ...prev.header.ctaButton,
                                label: e.target.value,
                              },
                            },
                          }))
                        }
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta-href" className="text-xs font-medium text-slate-700">
                        CTA Link URL
                      </Label>
                      <Input
                        id="cta-href"
                        value={settings.header.ctaButton?.href || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            header: {
                              ...prev.header,
                              ctaButton: {
                                ...prev.header.ctaButton,
                                href: e.target.value,
                              },
                            },
                          }))
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Items Manager */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                        <MenuIcon className="size-4 text-navy" />
                        Main Navigation Menu Items
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Configure top-level items and dropdown submenus
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addNavItem}
                      className="bg-navy text-white hover:bg-navy/90 text-xs rounded-full gap-1"
                    >
                      <Plus className="size-3.5" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-3 mt-4">
                    {settings.header.navItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="checkbox"
                              checked={item.enabled !== false}
                              onChange={(e) => updateNavItem(idx, { enabled: e.target.checked })}
                              title="Enable / Disable Item"
                              className="size-4 text-navy rounded border-slate-300 focus:ring-navy cursor-pointer"
                            />
                            <Input
                              value={item.label}
                              onChange={(e) => updateNavItem(idx, { label: e.target.value })}
                              placeholder="MENU LABEL"
                              className="font-bold text-xs max-w-xs bg-white"
                            />
                            <Input
                              value={item.href}
                              onChange={(e) => updateNavItem(idx, { href: e.target.value })}
                              placeholder="/path or https://..."
                              className="text-xs flex-1 bg-white font-mono"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveNavItem(idx, "up")}
                              className="p-1 text-slate-400 hover:text-navy disabled:opacity-30"
                              title="Move Up"
                            >
                              <ChevronUp className="size-4" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === settings.header.navItems.length - 1}
                              onClick={() => moveNavItem(idx, "down")}
                              className="p-1 text-slate-400 hover:text-navy disabled:opacity-30"
                              title="Move Down"
                            >
                              <ChevronDown className="size-4" />
                            </button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addSubItem(idx)}
                              className="text-xs text-navy hover:bg-navy/10 px-2 py-1 h-auto"
                            >
                              + Submenu
                            </Button>
                            <button
                              type="button"
                              onClick={() => removeNavItem(idx)}
                              className="p-1 text-slate-400 hover:text-destructive"
                              title="Delete Item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Submenu items */}
                        {item.children && item.children.length > 0 && (
                          <div className="pl-6 border-l-2 border-slate-200 space-y-2 mt-2">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                              Dropdown Submenu Items:
                            </span>
                            {item.children.map((sub, sIdx) => (
                              <div
                                key={sub.id || sIdx}
                                className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200"
                              >
                                <input
                                  type="checkbox"
                                  checked={sub.enabled !== false}
                                  onChange={(e) =>
                                    updateSubItem(idx, sIdx, { enabled: e.target.checked })
                                  }
                                  className="size-3.5 text-navy rounded border-slate-300"
                                />
                                <Input
                                  value={sub.label}
                                  onChange={(e) =>
                                    updateSubItem(idx, sIdx, { label: e.target.value })
                                  }
                                  placeholder="Sub-item Label"
                                  className="text-xs font-semibold max-w-[160px]"
                                />
                                <Input
                                  value={sub.href}
                                  onChange={(e) =>
                                    updateSubItem(idx, sIdx, { href: e.target.value })
                                  }
                                  placeholder="/solutions/service"
                                  className="text-xs font-mono flex-1"
                                />
                                <Input
                                  value={sub.desc || ""}
                                  onChange={(e) =>
                                    updateSubItem(idx, sIdx, { desc: e.target.value })
                                  }
                                  placeholder="Short description"
                                  className="text-xs flex-1 text-slate-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSubItem(idx, sIdx)}
                                  className="p-1 text-slate-400 hover:text-destructive"
                                  title="Delete Sub-item"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FOOTER & SOCIAL LINKS */}
            {activeTab === "footer" && (
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Footer Brand & CTA Banner */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                  <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                    <ImageIcon className="size-4 text-navy" />
                    Footer Brand & CTA Banner
                  </h2>

                  <div>
                    <Label htmlFor="ftr-logo" className="text-xs font-medium text-slate-700">
                      Footer Logo URL
                    </Label>
                    <Input
                      id="ftr-logo"
                      value={settings.footer.logoUrl || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, logoUrl: e.target.value },
                        }))
                      }
                      placeholder="Leave empty for default SVG"
                      className="mt-1 text-xs"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploadingFooterLogo}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleLogoUpload(f, "footer");
                          }}
                          className="hidden"
                        />
                        <span className="inline-flex items-center justify-center w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                          {isUploadingFooterLogo ? "Uploading..." : "Upload Footer Logo"}
                        </span>
                      </label>
                      {settings.footer.logoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setSettings((prev) => ({
                              ...prev,
                              footer: { ...prev.footer, logoUrl: "" },
                            }))
                          }
                          className="px-2 py-1.5 text-xs text-slate-500 hover:text-destructive border border-slate-200 rounded-md"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ftr-about" className="text-xs font-medium text-slate-700">
                      About Description Text
                    </Label>
                    <textarea
                      id="ftr-about"
                      rows={3}
                      value={settings.footer.aboutText || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, aboutText: e.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ftr-cr" className="text-xs font-medium text-slate-700">
                      Copyright Notice Text
                    </Label>
                    <Input
                      id="ftr-cr"
                      value={settings.footer.copyrightText || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          footer: { ...prev.footer, copyrightText: e.target.value },
                        }))
                      }
                      className="mt-1 text-xs"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ftr-cta-enable" className="text-xs font-medium text-slate-700 cursor-pointer">
                        Enable Footer CTA Banner
                      </Label>
                      <input
                        id="ftr-cta-enable"
                        type="checkbox"
                        checked={settings.footer.ctaBanner?.enabled !== false}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              ctaBanner: {
                                ...prev.footer.ctaBanner,
                                enabled: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="size-4 text-navy rounded border-slate-300 focus:ring-navy cursor-pointer"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ftr-cta-t" className="text-xs font-medium text-slate-700">
                        Banner Title
                      </Label>
                      <Input
                        id="ftr-cta-t"
                        value={settings.footer.ctaBanner?.title || ""}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            footer: {
                              ...prev.footer,
                              ctaBanner: {
                                ...prev.footer.ctaBanner,
                                title: e.target.value,
                              },
                            },
                          }))
                        }
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ftr-cta-btn" className="text-xs font-medium text-slate-700">
                        Button Label & URL
                      </Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Input
                          value={settings.footer.ctaBanner?.buttonLabel || ""}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                ctaBanner: {
                                  ...prev.footer.ctaBanner,
                                  buttonLabel: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="Button text"
                          className="text-xs"
                        />
                        <Input
                          value={settings.footer.ctaBanner?.buttonHref || ""}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                ctaBanner: {
                                  ...prev.footer.ctaBanner,
                                  buttonHref: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="/booking or https://..."
                          className="text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Link Columns & Social Links */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Link Groups */}
                  <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                    <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                      <MenuIcon className="size-4 text-navy" />
                      Footer Link Columns
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {settings.footer.linkGroups.map((group, gIdx) => (
                        <div key={group.id || gIdx} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
                          <Input
                            value={group.title}
                            onChange={(e) => {
                              const newGroups = [...settings.footer.linkGroups];
                              newGroups[gIdx] = { ...newGroups[gIdx], title: e.target.value };
                              setSettings((prev) => ({
                                ...prev,
                                footer: { ...prev.footer, linkGroups: newGroups },
                              }));
                            }}
                            className="font-bold text-xs bg-white"
                          />

                          <div className="space-y-2">
                            {group.links.map((link, lIdx) => (
                              <div key={link.id || lIdx} className="flex items-center gap-2">
                                <Input
                                  value={link.label}
                                  onChange={(e) => {
                                    const newGroups = [...settings.footer.linkGroups];
                                    const links = [...newGroups[gIdx].links];
                                    links[lIdx] = { ...links[lIdx], label: e.target.value };
                                    newGroups[gIdx] = { ...newGroups[gIdx], links };
                                    setSettings((prev) => ({
                                      ...prev,
                                      footer: { ...prev.footer, linkGroups: newGroups },
                                    }));
                                  }}
                                  placeholder="Label"
                                  className="text-xs bg-white"
                                />
                                <Input
                                  value={link.href}
                                  onChange={(e) => {
                                    const newGroups = [...settings.footer.linkGroups];
                                    const links = [...newGroups[gIdx].links];
                                    links[lIdx] = { ...links[lIdx], href: e.target.value };
                                    newGroups[gIdx] = { ...newGroups[gIdx], links };
                                    setSettings((prev) => ({
                                      ...prev,
                                      footer: { ...prev.footer, linkGroups: newGroups },
                                    }));
                                  }}
                                  placeholder="/path"
                                  className="text-xs bg-white font-mono"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                    <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                      <Share2 className="size-4 text-navy" />
                      Social Media Links
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {settings.footer.socialLinks.map((soc, sIdx) => (
                        <div key={soc.id || sIdx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-xs font-bold text-navy capitalize w-20 truncate">
                            {soc.platform}
                          </span>
                          <Input
                            value={soc.href}
                            onChange={(e) => {
                              const newSocial = [...settings.footer.socialLinks];
                              newSocial[sIdx] = { ...newSocial[sIdx], href: e.target.value };
                              setSettings((prev) => ({
                                ...prev,
                                footer: { ...prev.footer, socialLinks: newSocial },
                              }));
                            }}
                            placeholder="https://..."
                            className="text-xs bg-white font-mono flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE PREVIEW */}
            {activeTab === "preview" && (
              <div className="space-y-8 bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Eye className="size-4 text-blue-400" />
                    Live Header & Footer Simulation
                  </h3>
                  <span className="text-xs text-slate-400">
                    Renders with your currently configured site settings
                  </span>
                </div>

                {/* Header Preview Container */}
                <div className="relative h-28">
                  <Header settings={settings} />
                </div>

                {/* Placeholder page body */}
                <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center text-slate-400 text-xs">
                  [ Page Content Body Area ]
                </div>

                {/* Footer Preview Container */}
                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <Footer settings={settings} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
