import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Puck, usePuck, type Data } from "@puckeditor/core";
import puckCssUrl from "@puckeditor/core/dist/index.css?url";
import { puckConfig } from "@/cms/puck.config";
import {
  getCmsPageById,
  saveCmsPage,
  duplicateCmsPage,
  unpublishCmsPage,
  publishCmsPage,
  getCmsPageVersions,
  restoreCmsPageVersion,
  uploadCmsImage,
  getCmsSiteSettings,
  type CmsPage,
  type CmsPageVersion,
} from "@/lib/cms.server";
import { type CmsSiteSettings } from "@/lib/cms-settings";
import { findPageNavigationLinks } from "@/lib/cms-nav-helpers";
import { AddToNavigationDialog } from "@/components/cms/AddToNavigationDialog";
import { isValidCanonicalUrl, type CmsRootProps } from "@/cms/root";
import { isValidImageUrl } from "@/cms/blocks/Image";
import { ImagePickerInput } from "@/cms/fields/ImagePicker";
import { CustomActionBar, CustomComponentOverlay, getBlockIcon, getFriendlyBlockName } from "@/cms/editor-overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEditorMode } from "@/cms/editor-mode";
import {
  Lock,
  Unlock,
  ArrowLeft,
  Save,
  Globe,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Image as ImageIcon,
  Share2,
  Search,
  History,
  Copy,
  RotateCcw,
  Clock,
  Menu,
  AlertTriangle,
  Undo2,
  Redo2,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  FileCheck,
  Play,
  Pause,
} from "lucide-react";

export const Route = createFileRoute("/cms/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Page | SMG ABA Visual Builder" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "stylesheet", href: puckCssUrl },
    ],
  }),
  component: CmsPageEditorRoute,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

const editorViewports = [
  { width: 390, height: "auto" as const, label: "Phone", icon: "Smartphone" as const },
  { width: 820, height: "auto" as const, label: "Tablet", icon: "Tablet" as const },
  { width: 1280, height: "auto" as const, label: "Desktop", icon: "Monitor" as const },
];

interface SafetyIssue {
  type: "error" | "warning";
  blockType: string;
  blockTitle: string;
  message: string;
}

/**
 * Pre-publish safety scanner:
 * Checks for placeholder text, empty image URLs, unconfigured buttons, and broken links.
 */
function runPrePublishCheck(data?: Data): SafetyIssue[] {
  const issues: SafetyIssue[] = [];
  if (!data) return issues;

  const content = data.content || [];
  if (content.length === 0) {
    issues.push({
      type: "warning",
      blockType: "Page",
      blockTitle: "Empty Page",
      message: "This page has no content blocks yet.",
    });
    return issues;
  }

  content.forEach((block, idx) => {
    const props = (block.props || {}) as Record<string, any>;
    const bType = block.type || "Block";

    // 1. Button Block checks
    if (bType === "Button") {
      if (!props.label || !String(props.label).trim()) {
        issues.push({
          type: "warning",
          blockType: "Button",
          blockTitle: `Button #${idx + 1}`,
          message: "Button text label is empty.",
        });
      }
      if (!props.url || !String(props.url).trim() || props.url === "#") {
        issues.push({
          type: "error",
          blockType: "Button",
          blockTitle: `Button "${props.label || `#${idx + 1}`}"`,
          message: "Button does not have a destination link set.",
        });
      }
    }

    // 2. Image Block checks
    if (bType === "Image") {
      if (!props.src || !String(props.src).trim()) {
        issues.push({
          type: "warning",
          blockType: "Image",
          blockTitle: `Image #${idx + 1}`,
          message: "No image source has been selected.",
        });
      }
    }

    // 3. Top Banner (Hero) checks
    if (bType === "Hero") {
      if (!props.headline || !String(props.headline).trim()) {
        issues.push({
          type: "warning",
          blockType: "Top Banner",
          blockTitle: "Top Banner",
          message: "Main headline is empty.",
        });
      }
      if (props.primaryCta?.enabled && (!props.primaryCta?.href || props.primaryCta.href === "#")) {
        issues.push({
          type: "error",
          blockType: "Top Banner",
          blockTitle: `Primary Button "${props.primaryCta.label || "Button"}"`,
          message: "Primary button has an unconfigured destination link.",
        });
      }
    }

    // 4. CTA Banner checks
    if (bType === "CTABanner") {
      if (props.primaryButton?.label && (!props.primaryButton?.href || props.primaryButton.href === "#")) {
        issues.push({
          type: "error",
          blockType: "Call to Action Strip",
          blockTitle: `CTA Button "${props.primaryButton.label}"`,
          message: "Button has an empty destination link.",
        });
      }
    }

    // 5. Placeholder text checks
    const jsonStr = JSON.stringify(props).toLowerCase();
    if (jsonStr.includes("lorem ipsum") || jsonStr.includes("dummy text") || jsonStr.includes("placeholder description")) {
      issues.push({
        type: "warning",
        blockType: bType,
        blockTitle: `${bType} #${idx + 1}`,
        message: "Contains placeholder 'Lorem ipsum' filler text.",
      });
    }
  });

  return issues;
}

/**
 * Custom Drawer Wrapper with Real-time Block Search Filter and 2-Column Grid Layout
 */
function CustomDrawerWrapper({ children }: { children?: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Search Filter Box */}
      <div className="p-3 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-2xs">
        <div className="relative flex items-center">
          <Search className="size-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blocks (e.g. Button, Text, Image)..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto px-2.5 py-2 ${searchTerm ? "puck-drawer-searching" : ""}`}>
        {children}
      </div>

      {/* 2-Column Grid Layout & Sleek Block Cards Styling */}
      <style>{`
        /* 2 in 1 line (2-column grid layout for drawer items) */
        [class*="_Drawer_"],
        [class*="ComponentList-content"] > div,
        [class*="ComponentList-content"] > ul {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 6px !important;
          padding: 4px 0 8px 0 !important;
        }

        /* Category section spacing */
        [class*="_ComponentList_"] {
          margin-bottom: 8px !important;
        }

        [class*="_ComponentList-title_"] {
          font-size: 10.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
          color: #64748b !important;
          padding: 6px 4px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          text-transform: uppercase !important;
          border-radius: 6px !important;
        }

        [class*="_ComponentList-title_"]:hover {
          color: #0f2142 !important;
          background-color: #f1f5f9 !important;
        }

        /* Each item card container */
        [data-puck-component-item] {
          min-width: 0 !important;
          width: 100% !important;
          position: relative !important;
        }

        /* Puck draggable card */
        [data-puck-component-item] [class*="_DrawerItem-draggable_"] {
          padding: 8px 6px 8px 30px !important;
          min-height: 42px !important;
          border-radius: 8px !important;
          border: 1px solid #e2e8f0 !important;
          background-color: #ffffff !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03) !important;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          position: relative !important;
          cursor: grab !important;
        }

        [data-puck-component-item]:hover [class*="_DrawerItem-draggable_"] {
          border-color: #93c5fd !important;
          background-color: #f8fafc !important;
          box-shadow: 0 2px 5px -1px rgba(37, 99, 235, 0.12) !important;
          transform: translateY(-1px) !important;
        }

        /* Block label text inside card */
        [data-puck-component-item] [class*="_DrawerItem-name_"] {
          font-size: 11px !important;
          font-weight: 600 !important;
          color: #1e293b !important;
          line-height: 1.2 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          padding-right: 2px !important;
          flex: 1 !important;
        }

        [data-puck-component-item]:hover [class*="_DrawerItem-name_"] {
          color: #0f2142 !important;
        }

        /* Drag grip handle */
        [data-puck-component-item] [class*="_DrawerItem-draggable_"] svg {
          opacity: 0.4 !important;
          flex-shrink: 0 !important;
          width: 11px !important;
          height: 11px !important;
        }

        [data-puck-component-item]:hover [class*="_DrawerItem-draggable_"] svg {
          opacity: 0.85 !important;
          color: #2563eb !important;
        }

        /* Search filtering */
        .puck-drawer-searching [data-puck-component-item]:not([data-block-title*="${searchTerm.toLowerCase()}"]):not([data-block-name*="${searchTerm.toLowerCase()}"]) {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

/**
 * Single Unified Editor Top Bar
 */
function UnifiedEditorHeader({
  page,
  relativeSavedTime,
  isSaving,
  isPublishing,
  onSaveDraft,
  onOpenPublishSafety,
  onOpenPreview,
  onOpenVersions,
  onOpenSeo,
  onDuplicate,
  onAddToNav,
  onUnpublish,
  isAnimationsPaused,
  onToggleAnimations,
}: {
  page: CmsPage;
  relativeSavedTime: string;
  isSaving: boolean;
  isPublishing: boolean;
  onSaveDraft: () => void;
  onOpenPublishSafety: () => void;
  onOpenPreview: () => void;
  onOpenVersions: () => void;
  onOpenSeo: () => void;
  onDuplicate: () => void;
  onAddToNav: () => void;
  onUnpublish: () => void;
  isAnimationsPaused?: boolean;
  onToggleAnimations?: () => void;
}) {
  const { history, dispatch, appState } = usePuck();
  const currentViewportWidth = appState.ui.viewports.current.width;
  const [mode, setMode] = useEditorMode();

  // Global Undo / Redo keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (!modifier) return;

      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable);

      if (isInput) return;

      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (history.hasPast) {
          e.preventDefault();
          history.back();
        }
      } else if (
        (e.key.toLowerCase() === "z" && e.shiftKey) ||
        e.key.toLowerCase() === "y"
      ) {
        if (history.hasFuture) {
          e.preventDefault();
          history.forward();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history]);

  const setViewport = (width: number | "100%") => {
    dispatch({
      type: "setUi",
      ui: {
        viewports: {
          ...appState.ui.viewports,
          current: {
            width,
            height: "auto",
          },
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-3 sm:px-5 py-2 shadow-xs flex items-center justify-between gap-2 select-none w-full">
      {/* Left Section: Back, Title & Slug */}
      <div className="flex items-center gap-2.5 min-w-0">
        <Button asChild variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-navy h-8 px-2">
          <Link to="/cms">
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Pages</span>
          </Link>
        </Button>
        <div className="h-4 w-px bg-slate-200" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-navy truncate max-w-[140px] sm:max-w-xs md:max-w-sm">
              {page.title}
            </h1>
            {page.status === "published" ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                Live
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                Draft
              </span>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">/{page.slug}</div>
        </div>
      </div>

      {/* Center Section: Device Viewport Switcher with Labels */}
      <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onClick={() => setViewport(390)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            currentViewportWidth === 390
              ? "bg-white text-navy shadow-xs"
              : "text-slate-600 hover:text-navy"
          }`}
          title="Mobile Phone View (390px)"
        >
          <Smartphone className="size-3.5" />
          <span>Phone</span>
        </button>

        <button
          type="button"
          onClick={() => setViewport(820)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            currentViewportWidth === 820
              ? "bg-white text-navy shadow-xs"
              : "text-slate-600 hover:text-navy"
          }`}
          title="Tablet View (820px)"
        >
          <Tablet className="size-3.5" />
          <span>Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => setViewport(1280)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            currentViewportWidth === 1280 || currentViewportWidth === "100%"
              ? "bg-white text-navy shadow-xs"
              : "text-slate-600 hover:text-navy"
          }`}
          title="Desktop Monitor View (1280px)"
        >
          <Monitor className="size-3.5" />
          <span>Desktop</span>
        </button>
      </div>

      {/* Editor Mode Switcher: Simple Mode vs Advanced Mode */}
      <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setMode("simple");
            toast.info("⚡ Simple Mode active: Streamlined controls & essentials.");
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            mode === "simple"
              ? "bg-white text-navy shadow-xs"
              : "text-slate-600 hover:text-navy"
          }`}
          title="Simple Mode: Essential controls, colors, content & basic sizes"
        >
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Simple</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("advanced");
            toast.info("🛠️ Advanced Mode active: Full flex/grid & exact dimensions unlocked.");
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            mode === "advanced"
              ? "bg-white text-navy shadow-xs"
              : "text-slate-600 hover:text-navy"
          }`}
          title="Advanced Mode: Flex/grid layout options, exact px controls & typography"
        >
          <SlidersHorizontal className="size-3.5 text-blue-600" />
          <span>Advanced</span>
        </button>
      </div>

      {/* Animation Play/Pause Toggle for Canvas Stability */}
      <button
        type="button"
        onClick={() => {
          onToggleAnimations?.();
          if (isAnimationsPaused) {
            toast.success("▶️ Canvas animations enabled.");
          } else {
            toast.info("⏸️ Canvas animations paused for stable editing.");
          }
        }}
        className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
          isAnimationsPaused
            ? "bg-amber-50 text-amber-800 border-amber-300"
            : "bg-slate-50 text-slate-600 border-slate-200 hover:text-navy hover:bg-slate-100"
        }`}
        title={isAnimationsPaused ? "Animations are paused. Click to enable canvas animations." : "Pause animations while editing to keep canvas stable."}
      >
        {isAnimationsPaused ? (
          <>
            <Pause className="size-3.5 text-amber-600" />
            <span>Motion Paused</span>
          </>
        ) : (
          <>
            <Play className="size-3.5 text-slate-500" />
            <span>Motion Active</span>
          </>
        )}
      </button>

      {/* Right Section: Undo/Redo, Autosave, Actions & Publish */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Autosave Status Indicator */}
        <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-400 mr-1 font-medium">
          {isSaving ? (
            <>
              <RefreshCw className="size-3 animate-spin text-blue-600" />
              <span className="text-blue-600">Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="size-3 text-emerald-500" />
              <span>{relativeSavedTime}</span>
            </>
          )}
        </div>

        {/* Undo & Redo Toolbar Icons */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => history.back()}
            disabled={!history.hasPast}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md text-slate-700 hover:text-navy hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center"
          >
            <Undo2 className="size-3.5" />
          </button>
          <div className="h-3.5 w-px bg-slate-200" />
          <button
            type="button"
            onClick={() => history.forward()}
            disabled={!history.hasFuture}
            title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
            className="p-1.5 rounded-md text-slate-700 hover:text-navy hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center justify-center"
          >
            <Redo2 className="size-3.5" />
          </button>
        </div>

        {/* Save Draft Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSaveDraft}
          disabled={isSaving || isPublishing}
          className="gap-1.5 text-xs rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-navy h-8 font-medium px-3 shadow-2xs transition-colors"
        >
          <Save className={`size-3.5 ${isSaving ? "animate-spin text-navy" : "text-slate-600"}`} />
          <span>{isSaving ? "Saving..." : "Save Draft"}</span>
        </Button>

        {/* Page Settings & SEO Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSeo}
          className="gap-1.5 text-xs rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-navy h-8 px-2.5 shadow-2xs transition-colors"
          title="Page Settings & SEO"
        >
          <Settings className="size-3.5 text-slate-600" />
          <span className="hidden lg:inline">Settings</span>
        </Button>

        {/* Preview Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenPreview}
          className="gap-1.5 text-xs rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-navy h-8 px-2.5 shadow-2xs hidden sm:inline-flex transition-colors"
          title="Preview Page"
        >
          <Eye className="size-3.5 text-slate-600" />
          <span className="hidden lg:inline">Preview</span>
        </Button>

        {/* Revisions Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenVersions}
          className="gap-1 text-xs rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-navy h-8 px-2.5 shadow-2xs hidden sm:inline-flex transition-colors"
          title="Revision History"
        >
          <History className="size-3.5 text-slate-600" />
        </Button>

        {/* Add to Navigation - published pages only */}
        {page.status === "published" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddToNav}
            className="gap-1.5 text-xs rounded-full border border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-900 h-8 px-2.5 shadow-2xs hidden md:inline-flex transition-colors"
            title="Add to Navigation"
          >
            <Menu className="size-3.5" />
            <span className="hidden lg:inline">Add to Nav</span>
          </Button>
        )}

        {/* Single Primary Publish Button */}
        <Button
          size="sm"
          onClick={onOpenPublishSafety}
          disabled={isSaving || isPublishing}
          className="bg-navy text-white hover:bg-navy/90 gap-1.5 text-xs rounded-full h-8 font-bold px-3.5 shadow-xs transition-all hover:scale-105 active:scale-95"
        >
          <Globe className={`size-3.5 ${isPublishing ? "animate-spin" : ""}`} />
          <span>{isPublishing ? "Publishing..." : page.status === "published" ? "Update Live" : "Publish Page"}</span>
        </Button>
      </div>
    </header>
  );
}

function CmsPageEditorRoute() {
  const { id } = useParams({ from: "/cms/$id/edit" });
  const navigate = useNavigate();

  // Auth State (Bypassed)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Page & Editor State
  const [page, setPage] = useState<CmsPage | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isDuplicating, setIsDuplicating] = useState<boolean>(false);
  const [isUnpublishing, setIsUnpublishing] = useState<boolean>(false);

  // Autosave State
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [relativeSavedTime, setRelativeSavedTime] = useState<string>("Saved just now");
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safety Check & Publish Dialog State
  const [isSafetyCheckOpen, setIsSafetyCheckOpen] = useState<boolean>(false);
  const [safetyIssues, setSafetyIssues] = useState<SafetyIssue[]>([]);
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState<boolean>(false);

  // Add to Navigation state
  const [isAddToNavOpen, setIsAddToNavOpen] = useState<boolean>(false);
  const [showUnpublishWarning, setShowUnpublishWarning] = useState<boolean>(false);
  const [siteSettings, setSiteSettings] = useState<CmsSiteSettings | null>(null);

  // Version History State
  const [isVersionsOpen, setIsVersionsOpen] = useState<boolean>(false);
  const [versions, setVersions] = useState<CmsPageVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState<boolean>(false);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  // Global Animation Pause Toggle State (for editor stability)
  const [isAnimationsPaused, setIsAnimationsPaused] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("cms_animations_paused") === "true";
    } catch {
      return false;
    }
  });

  const toggleAnimations = () => {
    setIsAnimationsPaused((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("cms_animations_paused", String(next));
      } catch {}
      return next;
    });
  };

  // SEO & Page Settings Modal State
  const [isSeoOpen, setIsSeoOpen] = useState<boolean>(false);
  const [seoTab, setSeoTab] = useState<"search" | "social" | "banner">("banner");
  const [showPageHero, setShowPageHero] = useState<boolean>(false);
  const [heroEyebrow, setHeroEyebrow] = useState<string>("");
  const [heroDescription, setHeroDescription] = useState<string>("");
  const [heroImage, setHeroImage] = useState<string>("");
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState<string>("");
  const [heroPrimaryCtaHref, setHeroPrimaryCtaHref] = useState<string>("");
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState<string>("");
  const [heroSecondaryCtaHref, setHeroSecondaryCtaHref] = useState<string>("");
  const [seoTitle, setSeoTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [canonicalUrl, setCanonicalUrl] = useState<string>("");
  const [ogTitle, setOgTitle] = useState<string>("");
  const [ogDescription, setOgDescription] = useState<string>("");
  const [ogImage, setOgImage] = useState<string>("");

  // Keep a reference to latest editor data
  const currentDataRef = useRef<Data>({ content: [], root: {} });

  // Direct load on mount
  useEffect(() => {
    loadPage("");
  }, [id]);

  // Periodic updater for relative time string
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastSavedAt) return;
      const secondsAgo = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
      if (secondsAgo < 45) {
        setRelativeSavedTime("Saved just now");
      } else if (secondsAgo < 90) {
        setRelativeSavedTime("Saved 1 min ago");
      } else {
        const mins = Math.floor(secondsAgo / 60);
        setRelativeSavedTime(`Saved ${mins} min ago`);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

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
        loadPage(pwd);
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

  function syncSeoStateFromData(data?: Data) {
    const rootProps = (data?.root?.props as CmsRootProps) || {};
    setShowPageHero(Boolean(rootProps.showPageHero));
    setHeroEyebrow(rootProps.heroEyebrow || "");
    setHeroDescription(rootProps.heroDescription || "");
    setHeroImage(rootProps.heroImage || "");
    setHeroPrimaryCtaText(rootProps.heroPrimaryCtaText || "");
    setHeroPrimaryCtaHref(rootProps.heroPrimaryCtaHref || "");
    setHeroSecondaryCtaText(rootProps.heroSecondaryCtaText || "");
    setHeroSecondaryCtaHref(rootProps.heroSecondaryCtaHref || "");
    setSeoTitle(rootProps.seoTitle || "");
    setMetaDescription(rootProps.metaDescription || "");
    setCanonicalUrl(rootProps.canonicalUrl || "");
    setOgTitle(rootProps.ogTitle || "");
    setOgDescription(rootProps.ogDescription || "");
    setOgImage(rootProps.ogImage || "");
  }

  async function loadPage(pwd: string) {
    setIsLoadingPage(true);
    try {
      const res = await getCmsPageById({
        data: {
          id,
          adminPassword: pwd,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data || { content: [], root: {} };
        syncSeoStateFromData(res.page.data);
        setLastSavedAt(new Date(res.page.updated_at || Date.now()));
      } else {
        toast.error(res.error || "Failed to load page details.");
      }
    } catch (err) {
      console.error("Error loading page:", err);
      toast.error("Failed to load page data.");
    } finally {
      setIsLoadingPage(false);
    }
  }

  function openSeoSettings() {
    syncSeoStateFromData(currentDataRef.current);
    setIsSeoOpen(true);
  }

  async function handleOpenVersions() {
    setIsVersionsOpen(true);
    setIsLoadingVersions(true);
    try {
      const res = await getCmsPageVersions({
        data: {
          id,
          adminPassword,
        },
      });
      if (res.success) {
        setVersions(res.versions);
      } else {
        toast.error(res.error || "Failed to load version history.");
      }
    } catch (err) {
      console.error("Error loading versions:", err);
      toast.error("Failed to load version history.");
    } finally {
      setIsLoadingVersions(false);
    }
  }

  async function handleRestoreVersion(version: CmsPageVersion) {
    if (!page) return;
    const confirmRestore = window.confirm(
      `Are you sure you want to restore Version #${version.version_number} saved on ${new Date(version.created_at).toLocaleString()}? This will update the editor with this version's content.`
    );
    if (!confirmRestore) return;

    setRestoringVersionId(version.id);
    try {
      const res = await restoreCmsPageVersion({
        data: {
          pageId: page.id,
          versionId: version.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data || { content: [], root: {} };
        syncSeoStateFromData(res.page.data);
        setLastSavedAt(new Date());
        setRelativeSavedTime("Saved just now");
        toast.success(`Restored Version #${version.version_number} successfully!`);
        setIsVersionsOpen(false);
      } else {
        toast.error(res.error || "Failed to restore version.");
      }
    } catch (err) {
      console.error("Restore error:", err);
      toast.error("An error occurred while restoring version.");
    } finally {
      setRestoringVersionId(null);
    }
  }

  async function handleDuplicate() {
    if (!page) return;
    setIsDuplicating(true);
    try {
      const res = await duplicateCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        toast.success(`Page duplicated as "${res.page.title}" (/${res.page.slug})`);
        navigate({ to: "/cms/$id/edit", params: { id: res.page.id } });
      } else {
        toast.error(res.error || "Failed to duplicate page.");
      }
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error("Failed to duplicate page.");
    } finally {
      setIsDuplicating(false);
    }
  }

  async function handleUnpublish() {
    if (!page) return;

    // Check if the page is linked in navigation first
    try {
      const settingsRes = await getCmsSiteSettings();
      if (settingsRes?.settings) {
        setSiteSettings(settingsRes.settings);
        const navLinks = findPageNavigationLinks(page.slug, settingsRes.settings);
        if (navLinks.length > 0) {
          setShowUnpublishWarning(true);
          return;
        }
      }
    } catch (_) {}

    await executeUnpublish();
  }

  async function executeUnpublish() {
    if (!page) return;
    setShowUnpublishWarning(false);
    setIsUnpublishing(true);
    try {
      const res = await unpublishCmsPage({
        data: {
          id: page.id,
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        toast.success(`Page unpublished. Status is now Draft.`);
      } else {
        toast.error(res.error || "Failed to unpublish page.");
      }
    } catch (err) {
      console.error("Unpublish error:", err);
      toast.error("Failed to unpublish page.");
    } finally {
      setIsUnpublishing(false);
    }
  }

  async function handleSaveSeoSettings() {
    if (canonicalUrl && !isValidCanonicalUrl(canonicalUrl)) {
      toast.error("Invalid canonical URL. Please enter a valid URL starting with https://, http://, or /");
      return;
    }

    if (ogImage && !isValidImageUrl(ogImage)) {
      toast.error("Invalid Open Graph image URL. data: and javascript: URLs are rejected.");
      return;
    }

    const updatedRootProps: CmsRootProps = {
      ...(currentDataRef.current.root?.props || {}),
      title: page?.title,
      showPageHero,
      heroEyebrow: heroEyebrow.trim() || undefined,
      heroDescription: heroDescription.trim() || undefined,
      heroImage: heroImage.trim() || undefined,
      heroPrimaryCtaText: heroPrimaryCtaText.trim() || undefined,
      heroPrimaryCtaHref: heroPrimaryCtaHref.trim() || undefined,
      heroSecondaryCtaText: heroSecondaryCtaText.trim() || undefined,
      heroSecondaryCtaHref: heroSecondaryCtaHref.trim() || undefined,
      seoTitle: seoTitle.trim(),
      metaDescription: metaDescription.trim(),
      canonicalUrl: canonicalUrl.trim(),
      ogTitle: ogTitle.trim(),
      ogDescription: ogDescription.trim(),
      ogImage: ogImage.trim(),
    };

    const updatedData: Data = {
      ...currentDataRef.current,
      root: {
        ...currentDataRef.current.root,
        props: updatedRootProps,
      },
    };

    currentDataRef.current = updatedData;
    setIsSeoOpen(false);
    await handleSaveDraft(updatedData);
  }

  // Silent background autosave
  async function triggerSilentAutosave(dataToSave: Data) {
    if (!page || !adminPassword || isSaving || isPublishing) return;
    try {
      const res = await saveCmsPage({
        data: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          data: dataToSave,
          status: "draft",
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        setLastSavedAt(new Date());
        setRelativeSavedTime("Saved just now");
      }
    } catch (err) {
      console.warn("Silent autosave failed:", err);
    }
  }

  async function handleSaveDraft(dataToSave?: Data) {
    if (!page) return;
    const payloadData = dataToSave || currentDataRef.current;

    setIsSaving(true);
    try {
      const res = await saveCmsPage({
        data: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          data: payloadData,
          status: "draft",
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data;
        setLastSavedAt(new Date());
        setRelativeSavedTime("Saved just now");
        toast.success("Draft saved successfully.");
      } else {
        toast.error(res.error || "Failed to save draft.");
      }
    } catch (err) {
      console.error("Save draft error:", err);
      toast.error("An error occurred while saving draft.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenPublishSafety() {
    const issues = runPrePublishCheck(currentDataRef.current);
    if (issues.length > 0) {
      setSafetyIssues(issues);
      setIsSafetyCheckOpen(true);
    } else {
      setIsConfirmPublishOpen(true);
    }
  }

  async function executePublish() {
    if (!page) return;
    setIsSafetyCheckOpen(false);
    setIsConfirmPublishOpen(false);
    setIsPublishing(true);

    try {
      const res = await saveCmsPage({
        data: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          data: currentDataRef.current,
          status: "published",
          adminPassword,
        },
      });

      if (res.success && res.page) {
        setPage(res.page);
        currentDataRef.current = res.page.data;
        setLastSavedAt(new Date());
        setRelativeSavedTime("Saved just now");
        toast.success(`🎉 Page published! Available live at /${res.page.slug}`);
      } else {
        toast.error(res.error || "Failed to publish page.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("An error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  }

  const handleEditorChange = (newData: Data) => {
    currentDataRef.current = newData;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Debounce background autosave (15s)
    autosaveTimerRef.current = setTimeout(() => {
      triggerSilentAutosave(newData);
    }, 15000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {isLoadingPage || !page ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="size-8 text-navy animate-spin" />
              <p className="text-sm font-medium text-slate-600">Loading page in visual editor...</p>
            </div>
          </div>
        ) : (
          /* Visual Puck Editor Container with Unified Single Toolbar */
          <div className={`flex-1 bg-white min-h-[calc(100vh-65px)] relative flex flex-col ${isAnimationsPaused ? "cms-pause-animations" : ""}`}>
            <Puck
              config={puckConfig}
              data={page.data || { content: [], root: {} }}
              viewports={editorViewports}
              iframe={{ enabled: true, syncHostStyles: true }}
              onPublish={executePublish}
              onChange={handleEditorChange}
              overrides={{
                header: () => (
                  <UnifiedEditorHeader
                    page={page}
                    relativeSavedTime={relativeSavedTime}
                    isSaving={isSaving}
                    isPublishing={isPublishing}
                    onSaveDraft={() => handleSaveDraft()}
                    onOpenPublishSafety={handleOpenPublishSafety}
                    onOpenPreview={() => window.open(`/cms/${page.id}/preview`, "_blank")}
                    onOpenVersions={handleOpenVersions}
                    onOpenSeo={openSeoSettings}
                    onDuplicate={handleDuplicate}
                    onAddToNav={() => setIsAddToNavOpen(true)}
                    onUnpublish={handleUnpublish}
                    isAnimationsPaused={isAnimationsPaused}
                    onToggleAnimations={toggleAnimations}
                  />
                ),
                drawer: ({ children }) => (
                  <CustomDrawerWrapper>{children}</CustomDrawerWrapper>
                ),
                drawerItem: ({ name, children }) => {
                  const Icon = getBlockIcon(name);
                  const friendlyName = getFriendlyBlockName(name);

                  return (
                    <div
                      data-puck-component-item=""
                      data-block-title={`${name} ${friendlyName}`.toLowerCase()}
                      data-block-name={name.toLowerCase()}
                      className="puck-custom-drawer-item group relative w-full min-w-0"
                    >
                      <div className="relative w-full">
                        {children}
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-600 size-4 flex items-center justify-center transition-colors">
                          <Icon className="size-3.5 shrink-0" />
                        </div>
                      </div>
                    </div>
                  );
                },
                actionBar: ({ label, children, parentAction }) => (
                  <CustomActionBar label={label} parentAction={parentAction}>
                    {children}
                  </CustomActionBar>
                ),
                componentOverlay: ({ componentId, componentType, hover, isSelected, children }) => (
                  <CustomComponentOverlay
                    componentId={componentId}
                    componentType={componentType}
                    hover={hover}
                    isSelected={isSelected}
                  >
                    {children}
                  </CustomComponentOverlay>
                ),
              }}
            />
          </div>
        )}
      </main>

      {/* Pre-Publish Safety Check Modal */}
      <Dialog open={isSafetyCheckOpen} onOpenChange={setIsSafetyCheckOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-navy">
              <FileCheck className="size-5 text-navy" />
              Pre-Publish Safety Check
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs text-slate-600">
              We reviewed your page for potential issues before going live on <strong className="text-navy">smgaba.com/{page?.slug}</strong>:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
              {safetyIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs ${
                    issue.type === "error"
                      ? "bg-red-50/80 border-red-200 text-red-900"
                      : "bg-amber-50/80 border-amber-200 text-amber-900"
                  }`}
                >
                  {issue.type === "error" ? (
                    <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">{issue.blockTitle}</span>
                    <span className="text-[11px] opacity-90">{issue.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSafetyCheckOpen(false)}
              className="text-xs rounded-full"
            >
              Back to Fix Issues
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={executePublish}
              disabled={isPublishing}
              className="text-xs rounded-full bg-navy text-white hover:bg-navy/90 font-bold"
            >
              {isPublishing ? "Publishing..." : "Publish Page Anyway"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation on Publish Modal */}
      <Dialog open={isConfirmPublishOpen} onOpenChange={setIsConfirmPublishOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-navy">
              <Globe className="size-5 text-navy" />
              Publish Page Live
            </DialogTitle>
          </DialogHeader>

          {page && (
            <div className="space-y-3 py-2">
              <p className="text-xs text-slate-600">
                This will make <strong className="text-navy">&ldquo;{page.title}&rdquo;</strong> live on the public website at:
              </p>
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-950 font-mono flex items-center justify-between">
                <span>smgaba.com/{page.slug}</span>
                <CheckCircle2 className="size-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500">
                All changes will be publicly viewable immediately. You can unpublish or update at any time.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmPublishOpen(false)}
              className="text-xs rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={executePublish}
              disabled={isPublishing}
              className="text-xs rounded-full bg-navy text-white hover:bg-navy/90 font-bold"
            >
              {isPublishing ? "Publishing..." : "Confirm & Go Live"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={isVersionsOpen} onOpenChange={setIsVersionsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-navy">
              <History className="size-5 text-navy" />
              Revision History
            </DialogTitle>
          </DialogHeader>

          <div className="text-xs text-slate-500 pb-2 border-b border-slate-100">
            Past saved snapshots of this page. You can safely restore any previous version.
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {isLoadingVersions ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
                <RefreshCw className="size-6 animate-spin text-navy" />
                <span className="text-xs">Loading revision snapshots...</span>
              </div>
            ) : versions.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Clock className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No version snapshots recorded yet. Versions are created on every save and publish.</p>
              </div>
            ) : (
              versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-navy/5 text-navy flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      v{ver.version_number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-navy">{ver.title}</span>
                        {ver.status === "published" ? (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Draft
                          </span>
                        )}
                        {idx === 0 && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span>{new Date(ver.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        <span>•</span>
                        <span>{ver.change_summary || "Snapshot"}</span>
                        <span>•</span>
                        <span>{ver.data?.content?.length || 0} blocks</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreVersion(ver)}
                    disabled={restoringVersionId === ver.id}
                    className="h-7 text-xs rounded-full border-slate-300 text-navy hover:bg-navy hover:text-white shrink-0"
                  >
                    <RotateCcw className={`size-3 mr-1 ${restoringVersionId === ver.id ? "animate-spin" : ""}`} />
                    {restoringVersionId === ver.id ? "Restoring..." : "Restore"}
                  </Button>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="border-t border-slate-100 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVersionsOpen(false)}
              className="text-xs rounded-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Settings & SEO Metadata Dialog */}
      <Dialog open={isSeoOpen} onOpenChange={setIsSeoOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-navy">
              <Settings className="size-5 text-navy" />
              Page Settings & SEO Metadata
            </DialogTitle>
          </DialogHeader>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 mt-2">
            <button
              type="button"
              onClick={() => setSeoTab("banner")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                seoTab === "banner"
                  ? "border-navy text-navy"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <ImageIcon className="size-3.5" />
              Header Banner ({showPageHero ? "Enabled" : "Off"})
            </button>
            <button
              type="button"
              onClick={() => setSeoTab("search")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                seoTab === "search"
                  ? "border-navy text-navy"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Search className="size-3.5" />
              Google Search (SEO)
            </button>
            <button
              type="button"
              onClick={() => setSeoTab("social")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                seoTab === "social"
                  ? "border-navy text-navy"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Share2 className="size-3.5" />
              Social Sharing (Open Graph)
            </button>
          </div>

          <div className="py-4 space-y-4">
            {seoTab === "banner" ? (
              <div className="space-y-4">
                {/* Header Banner Toggle */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-navy">Top Header Image Banner</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {showPageHero
                          ? "Header banner is currently VISIBLE at the top of the page."
                          : "Header banner is currently HIDDEN (clean blank canvas)."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPageHero(!showPageHero)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showPageHero ? "bg-navy" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          showPageHero ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={showPageHero ? "default" : "outline"}
                      onClick={() => setShowPageHero(true)}
                      className={`h-8 text-xs rounded-full ${showPageHero ? "bg-navy text-white" : ""}`}
                    >
                      Show Banner
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={!showPageHero ? "default" : "outline"}
                      onClick={() => setShowPageHero(false)}
                      className={`h-8 text-xs rounded-full ${!showPageHero ? "bg-navy text-white" : ""}`}
                    >
                      Hide / Remove Banner
                    </Button>
                  </div>
                </div>

                {showPageHero ? (
                  <div className="space-y-3 border-t border-slate-100 pt-3">
                    <div>
                      <Label htmlFor="banner-eyebrow" className="text-xs font-semibold text-slate-700">
                        Eyebrow Badge (Optional)
                      </Label>
                      <Input
                        id="banner-eyebrow"
                        value={heroEyebrow}
                        onChange={(e) => setHeroEyebrow(e.target.value)}
                        placeholder="e.g. Strategic Financial Leadership"
                        className="mt-1 text-xs"
                      />
                    </div>

                    <div>
                      <Label htmlFor="banner-desc" className="text-xs font-semibold text-slate-700">
                        Banner Subheadline / Description
                      </Label>
                      <textarea
                        id="banner-desc"
                        rows={2}
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        placeholder="Brief summary displayed under the page title in the header banner..."
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                        Banner Background Image
                      </Label>
                      <ImagePickerInput
                        value={heroImage}
                        onChange={setHeroImage}
                        placeholder="https://..., /assets/hero.jpg, or pick from gallery"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                          Primary Button
                        </span>
                        <div>
                          <Label htmlFor="banner-pri-lbl" className="text-[11px] text-slate-600">Label</Label>
                          <Input
                            id="banner-pri-lbl"
                            value={heroPrimaryCtaText}
                            onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                            placeholder="Contact Us"
                            className="mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="banner-pri-href" className="text-[11px] text-slate-600">Link Destination</Label>
                          <Input
                            id="banner-pri-href"
                            value={heroPrimaryCtaHref}
                            onChange={(e) => setHeroPrimaryCtaHref(e.target.value)}
                            placeholder="/contact"
                            className="mt-1 text-xs"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                          Secondary Button
                        </span>
                        <div>
                          <Label htmlFor="banner-sec-lbl" className="text-[11px] text-slate-600">Label</Label>
                          <Input
                            id="banner-sec-lbl"
                            value={heroSecondaryCtaText}
                            onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                            placeholder="Explore Solutions"
                            className="mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="banner-sec-href" className="text-[11px] text-slate-600">Link Destination</Label>
                          <Input
                            id="banner-sec-href"
                            value={heroSecondaryCtaHref}
                            onChange={(e) => setHeroSecondaryCtaHref(e.target.value)}
                            placeholder="/solutions"
                            className="mt-1 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center text-slate-500">
                    <p className="text-xs">
                      The top image banner is currently <strong>hidden</strong>. You can drag and drop any blocks (including the &quot;Top Banner&quot; block) from the left panel onto your page canvas.
                    </p>
                  </div>
                )}
              </div>
            ) : seoTab === "search" ? (
              <>
                {/* Search Engine Optimization */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seo-title" className="text-xs font-semibold text-slate-700">
                      SEO Title (<code className="text-[11px]">&lt;title&gt;</code>)
                    </Label>
                    <span className={`text-[11px] ${seoTitle.length > 60 ? "text-amber-600" : "text-slate-400"}`}>
                      {seoTitle.length}/60 chars
                    </span>
                  </div>
                  <Input
                    id="seo-title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={`${page?.title || "Page Title"} | SMG ABA`}
                    className="mt-1 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Defaults to &quot;{page?.title || "Page Title"} | SMG ABA&quot; if left empty.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meta-desc" className="text-xs font-semibold text-slate-700">
                      Meta Description
                    </Label>
                    <span className={`text-[11px] ${metaDescription.length > 160 ? "text-amber-600" : "text-slate-400"}`}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    id="meta-desc"
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Brief summary of the page for search engine snippets..."
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <Label htmlFor="canonical-url" className="text-xs font-semibold text-slate-700">
                    Canonical URL (Optional)
                  </Label>
                  <Input
                    id="canonical-url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://smgaba.com/services"
                    className="mt-1 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Only specify if this page is duplicated or republished from another URL.
                  </p>
                </div>

                {/* Google Search Result Preview */}
                <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Google Search Snippet Preview
                  </span>
                  <div className="mt-2 font-sans space-y-1">
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      https://smgaba.com › {page?.slug || "page-slug"}
                    </div>
                    <div className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">
                      {seoTitle.trim() || `${page?.title || "Page Title"} | SMG ABA`}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {metaDescription.trim() || "Discover comprehensive ABA therapy services and individualized behavioral health solutions tailored for your child at SMG ABA."}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Social Sharing (Open Graph) */}
                <div>
                  <Label htmlFor="og-title" className="text-xs font-semibold text-slate-700">
                    Open Graph Title
                  </Label>
                  <Input
                    id="og-title"
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    placeholder={seoTitle.trim() || `${page?.title || "Page Title"} | SMG ABA`}
                    className="mt-1 text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Defaults to SEO title if left blank.
                  </p>
                </div>

                <div>
                  <Label htmlFor="og-desc" className="text-xs font-semibold text-slate-700">
                    Open Graph Description
                  </Label>
                  <textarea
                    id="og-desc"
                    rows={2}
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    placeholder={metaDescription.trim() || "Description for LinkedIn, Twitter, Facebook social cards..."}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Open Graph Image (1200x630 recommended)
                  </Label>
                  <ImagePickerInput
                    value={ogImage}
                    onChange={setOgImage}
                    placeholder="https://... or upload/pick social share image"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSeoOpen(false)}
              className="text-xs rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveSeoSettings}
              className="bg-navy text-white hover:bg-navy/90 text-xs rounded-full font-bold"
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unpublish Warning Dialog (for pages linked in navigation) */}
      <Dialog open={showUnpublishWarning} onOpenChange={(open) => !open && setShowUnpublishWarning(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-amber-700">
              <AlertTriangle className="size-5 text-amber-600" />
              Unpublish Page Warning
            </DialogTitle>
          </DialogHeader>

          {page && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Are you sure you want to unpublish <strong className="text-navy">&ldquo;{page.title}&rdquo;</strong>?
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="size-4 shrink-0 text-amber-600" />
                  This page is currently linked in navigation:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
                  {findPageNavigationLinks(page.slug, siteSettings).map((loc, i) => (
                    <li key={i}>{loc.location}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-amber-700 pt-1">
                  Visitors clicking those navigation links will receive a 404 error until the page is republished or the links are removed in Site Settings.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUnpublishWarning(false)}
              disabled={isUnpublishing}
              className="text-xs rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={executeUnpublish}
              disabled={isUnpublishing}
              className="text-xs rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {isUnpublishing ? "Unpublishing..." : "Proceed & Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Navigation Dialog */}
      {page && (
        <AddToNavigationDialog
          page={page}
          isOpen={isAddToNavOpen}
          onClose={() => setIsAddToNavOpen(false)}
          adminPassword={adminPassword}
        />
      )}
    </div>
  );
}
