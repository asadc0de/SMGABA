import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { usePuck, type ComponentData, type ItemSelector } from "@puckeditor/core";
import {
  FileText,
  Palette,
  LayoutGrid,
  Sparkles,
  Copy,
  Trash2,
  RotateCcw,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Globe,
  SlidersHorizontal,
  Sliders,
  Layers,
  X,
  Type,
  Image as ImageIcon,
  Link,
  List,
  Box,
  Maximize2,
  MoveVertical,
  MousePointerClick,
  Code,
  ArrowRight,
  ExternalLink,
  PanelRightClose,
  PanelRightOpen,
  Check,
} from "lucide-react";
import { getBlockIcon, getFriendlyBlockName } from "./editor-overlay";
import { puckEditorConfig } from "./puck.config";
import { useEditorMode, type EditorMode } from "./editor-mode";
import { toast } from "sonner";

export type SettingTabId = "content" | "style" | "layout" | "motion";

export interface SubgroupDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAdvanced?: boolean;
}

interface TabDefinition {
  id: SettingTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ALL_TABS: TabDefinition[] = [
  { id: "content", label: "Content", icon: FileText },
  { id: "style", label: "Style", icon: Palette },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "motion", label: "Motion", icon: Sparkles },
];

/**
 * Subgroup definitions organized by Tab
 */
export const SUBGROUPS_BY_TAB: Record<SettingTabId, SubgroupDefinition[]> = {
  content: [
    { id: "content_main", label: "Text & Copy", icon: Type },
    { id: "content_media", label: "Media & Assets", icon: ImageIcon },
    { id: "content_links", label: "Links & Buttons", icon: Link },
    { id: "content_items", label: "Collection & Items", icon: List },
  ],
  style: [
    { id: "style_colors", label: "Colors & Swatches", icon: Palette },
    { id: "style_typography", label: "Typography & Text", icon: Type },
    { id: "style_box", label: "Shadow, Corners & Borders", icon: Box },
    { id: "style_appearance", label: "Style Controls", icon: Sliders },
    { id: "style_advanced", label: "Advanced Styling", icon: SlidersHorizontal, isAdvanced: true },
  ],
  layout: [
    { id: "layout_dimensions", label: "Dimensions & Sizing", icon: Maximize2 },
    { id: "layout_structure", label: "Columns & Grid", icon: LayoutGrid },
    { id: "layout_spacing", label: "Spacing & Alignment", icon: MoveVertical },
    { id: "layout_advanced", label: "Advanced Flex & Display", icon: Code, isAdvanced: true },
  ],
  motion: [
    { id: "motion_entrance", label: "Entrance & Scroll Effects", icon: Sparkles },
    { id: "motion_interactive", label: "Hover & Transitions", icon: MousePointerClick },
  ],
};

/**
 * Mapping of known field names to their respective Tab and Subgroup
 */
interface FieldMeta {
  tab: SettingTabId;
  subgroup: string;
  isAdvanced?: boolean;
}

const FIELD_META_MAP: Record<string, FieldMeta> = {
  // Content Tab Fields
  label: { tab: "content", subgroup: "content_main" },
  text: { tab: "content", subgroup: "content_main" },
  title: { tab: "content", subgroup: "content_main" },
  content: { tab: "content", subgroup: "content_main" },
  heading: { tab: "content", subgroup: "content_main" },
  subheading: { tab: "content", subgroup: "content_main" },
  headline: { tab: "content", subgroup: "content_main" },
  subheadline: { tab: "content", subgroup: "content_main" },
  eyebrow: { tab: "content", subgroup: "content_main" },
  badge: { tab: "content", subgroup: "content_main" },
  quote: { tab: "content", subgroup: "content_main" },
  authorName: { tab: "content", subgroup: "content_main" },
  authorRole: { tab: "content", subgroup: "content_main" },
  authorCompany: { tab: "content", subgroup: "content_main" },
  rating: { tab: "content", subgroup: "content_main" },
  showPageHero: { tab: "content", subgroup: "content_main" },
  heroEyebrow: { tab: "content", subgroup: "content_main" },
  heroDescription: { tab: "content", subgroup: "content_main" },
  seoTitle: { tab: "content", subgroup: "content_main" },
  metaDescription: { tab: "content", subgroup: "content_main" },
  canonicalUrl: { tab: "content", subgroup: "content_main" },
  ogTitle: { tab: "content", subgroup: "content_main" },
  ogDescription: { tab: "content", subgroup: "content_main" },

  // Media & Assets
  src: { tab: "content", subgroup: "content_media" },
  avatarUrl: { tab: "content", subgroup: "content_media" },
  imageUrl: { tab: "content", subgroup: "content_media" },
  backgroundImage: { tab: "content", subgroup: "content_media" },
  heroImage: { tab: "content", subgroup: "content_media" },
  ogImage: { tab: "content", subgroup: "content_media" },
  videoUrl: { tab: "content", subgroup: "content_media" },
  embedUrl: { tab: "content", subgroup: "content_media" },
  youtubeUrl: { tab: "content", subgroup: "content_media" },
  vimeoUrl: { tab: "content", subgroup: "content_media" },
  alt: { tab: "content", subgroup: "content_media" },
  caption: { tab: "content", subgroup: "content_media" },
  calendlyUrl: { tab: "content", subgroup: "content_media" },
  icon: { tab: "content", subgroup: "content_media" },

  // Links & Buttons
  url: { tab: "content", subgroup: "content_links" },
  linkUrl: { tab: "content", subgroup: "content_links" },
  ctaText: { tab: "content", subgroup: "content_links" },
  ctaHref: { tab: "content", subgroup: "content_links" },
  primaryCta: { tab: "content", subgroup: "content_links" },
  secondaryCta: { tab: "content", subgroup: "content_links" },
  primaryButton: { tab: "content", subgroup: "content_links" },
  secondaryButton: { tab: "content", subgroup: "content_links" },
  heroPrimaryCtaText: { tab: "content", subgroup: "content_links" },
  heroPrimaryCtaHref: { tab: "content", subgroup: "content_links" },
  heroSecondaryCtaText: { tab: "content", subgroup: "content_links" },
  heroSecondaryCtaHref: { tab: "content", subgroup: "content_links" },

  // Items & Collection
  items: { tab: "content", subgroup: "content_items" },
  statItems: { tab: "content", subgroup: "content_items" },
  stepItems: { tab: "content", subgroup: "content_items" },
  featureItems: { tab: "content", subgroup: "content_items" },
  accordionItems: { tab: "content", subgroup: "content_items" },
  enableLightbox: { tab: "content", subgroup: "content_items" },
  showCaptions: { tab: "content", subgroup: "content_items" },

  // Style Tab Fields
  variant: { tab: "style", subgroup: "style_colors" },
  color: { tab: "style", subgroup: "style_colors" },
  textColor: { tab: "style", subgroup: "style_colors" },
  backgroundColor: { tab: "style", subgroup: "style_colors" },
  borderColor: { tab: "style", subgroup: "style_colors" },
  theme: { tab: "style", subgroup: "style_colors" },
  cardStyle: { tab: "style", subgroup: "style_colors" },
  overlayStrength: { tab: "style", subgroup: "style_colors" },
  overlay: { tab: "style", subgroup: "style_colors" },

  typography: { tab: "style", subgroup: "style_typography" },
  titleTypography: { tab: "style", subgroup: "style_typography" },
  bodyTypography: { tab: "style", subgroup: "style_typography" },
  headlineTypography: { tab: "style", subgroup: "style_typography" },
  quoteTypography: { tab: "style", subgroup: "style_typography" },
  authorTypography: { tab: "style", subgroup: "style_typography" },
  fontSizePx: { tab: "style", subgroup: "style_typography", isAdvanced: true },
  level: { tab: "style", subgroup: "style_typography" },

  rounded: { tab: "style", subgroup: "style_box" },
  aspectRatio: { tab: "style", subgroup: "style_box" },
  objectFit: { tab: "style", subgroup: "style_box" },
  thickness: { tab: "style", subgroup: "style_box" },
  styleVariant: { tab: "style", subgroup: "style_box" },
  layout: { tab: "style", subgroup: "style_box" },

  styleControls: { tab: "style", subgroup: "style_appearance" },

  // Layout Tab Fields
  size: { tab: "layout", subgroup: "layout_dimensions" },
  sizePercent: { tab: "layout", subgroup: "layout_dimensions" },
  sizeControls: { tab: "layout", subgroup: "layout_dimensions" },
  width: { tab: "layout", subgroup: "layout_dimensions" },
  height: { tab: "layout", subgroup: "layout_dimensions" },
  minHeight: { tab: "layout", subgroup: "layout_dimensions" },
  spacerHeight: { tab: "layout", subgroup: "layout_dimensions" },
  dividerWidth: { tab: "layout", subgroup: "layout_dimensions" },

  columns: { tab: "layout", subgroup: "layout_structure" },
  gap: { tab: "layout", subgroup: "layout_structure" },
  sameItemSize: { tab: "layout", subgroup: "layout_structure" },
  equalHeightCards: { tab: "layout", subgroup: "layout_structure" },

  align: { tab: "layout", subgroup: "layout_spacing" },
  marginTop: { tab: "layout", subgroup: "layout_spacing" },
  marginBottom: { tab: "layout", subgroup: "layout_spacing" },
  paddingTop: { tab: "layout", subgroup: "layout_spacing" },
  paddingBottom: { tab: "layout", subgroup: "layout_spacing" },
  paddingVertical: { tab: "layout", subgroup: "layout_spacing" },

  advancedLayout: { tab: "layout", subgroup: "layout_advanced", isAdvanced: true },

  // Motion Tab Fields
  animation: { tab: "motion", subgroup: "motion_entrance" },
  hoverEffect: { tab: "motion", subgroup: "motion_interactive" },
  transition: { tab: "motion", subgroup: "motion_interactive" },
};

/**
 * Look up or infer field metadata
 */
export function getFieldMeta(fieldName: string): FieldMeta {
  if (FIELD_META_MAP[fieldName]) {
    return FIELD_META_MAP[fieldName];
  }

  const lower = fieldName.toLowerCase();
  if (lower.includes("anim") || lower.includes("motion")) {
    return { tab: "motion", subgroup: "motion_entrance" };
  }
  if (lower.includes("hover") || lower.includes("effect")) {
    return { tab: "motion", subgroup: "motion_interactive" };
  }
  if (lower.includes("advanced") || lower.includes("flex") || lower.includes("grid")) {
    return { tab: "layout", subgroup: "layout_advanced", isAdvanced: true };
  }
  if (lower.includes("size") || lower.includes("width") || lower.includes("height")) {
    return { tab: "layout", subgroup: "layout_dimensions" };
  }
  if (lower.includes("margin") || lower.includes("padding") || lower.includes("align") || lower.includes("space")) {
    return { tab: "layout", subgroup: "layout_spacing" };
  }
  if (lower.includes("column") || lower.includes("gap")) {
    return { tab: "layout", subgroup: "layout_structure" };
  }
  if (lower.includes("color") || lower.includes("bg") || lower.includes("variant") || lower.includes("theme")) {
    return { tab: "style", subgroup: "style_colors" };
  }
  if (lower.includes("font") || lower.includes("text") || lower.includes("type")) {
    return { tab: "style", subgroup: "style_typography" };
  }
  if (lower.includes("radius") || lower.includes("rounded") || lower.includes("border") || lower.includes("shadow")) {
    return { tab: "style", subgroup: "style_box" };
  }
  if (lower.includes("style")) {
    return { tab: "style", subgroup: "style_appearance" };
  }

  return { tab: "content", subgroup: "content_main" };
}

/**
 * Generate human-readable summary badge when a subgroup is closed
 */
function getSubgroupSummary(subgroupId: string, props: any): string | null {
  if (!props) return null;

  switch (subgroupId) {
    case "style_colors": {
      const parts: string[] = [];
      if (props.variant) parts.push(`Variant: ${props.variant}`);
      if (props.theme) parts.push(`Theme: ${props.theme}`);
      if (props.cardStyle) parts.push(`Style: ${props.cardStyle}`);
      if (props.backgroundColor) parts.push(`Bg: ${props.backgroundColor}`);
      if (props.textColor) parts.push(`Text: ${props.textColor}`);
      if (props.color) parts.push(`Color: ${props.color}`);
      return parts.slice(0, 2).join(" • ") || "Default theme colors";
    }
    case "style_typography": {
      const parts: string[] = [];
      if (props.level) parts.push(String(props.level).toUpperCase());
      if (props.fontSizePx) parts.push(`${props.fontSizePx}px`);
      if (props.typography?.fontSize) parts.push(`Size: ${props.typography.fontSize}`);
      return parts.join(" • ") || "Standard typography";
    }
    case "style_box": {
      const parts: string[] = [];
      if (props.rounded && props.rounded !== "none") parts.push(`Rounded: ${props.rounded}`);
      if (props.aspectRatio && props.aspectRatio !== "auto") parts.push(`Ratio: ${props.aspectRatio}`);
      if (props.thickness) parts.push(`Thickness: ${props.thickness}`);
      return parts.join(" • ") || "Standard box shape";
    }
    case "style_appearance": {
      if (props.styleControls?.shadow?.preset && props.styleControls.shadow.preset !== "none") {
        return `Shadow: ${props.styleControls.shadow.preset}`;
      }
      return "Default appearance";
    }
    case "layout_dimensions": {
      const parts: string[] = [];
      if (props.size) parts.push(`Size: ${props.size}`);
      if (props.sizePercent && props.sizePercent !== 100) parts.push(`Scale: ${props.sizePercent}%`);
      if (props.width) parts.push(`Width: ${props.width}`);
      if (props.height) parts.push(`Height: ${props.height}`);
      return parts.join(" • ") || "Auto dimensions (100%)";
    }
    case "layout_structure": {
      const parts: string[] = [];
      if (props.columns) parts.push(`${props.columns} Columns`);
      if (props.gap) parts.push(`Gap: ${props.gap}`);
      return parts.join(" • ") || "Standard structure";
    }
    case "layout_spacing": {
      const align = typeof props.align === "object" ? props.align?.base : props.align;
      const parts: string[] = [];
      if (align && align !== "left") parts.push(`Align: ${align}`);
      const mTop = typeof props.marginTop === "object" ? props.marginTop?.base : props.marginTop;
      const mBtm = typeof props.marginBottom === "object" ? props.marginBottom?.base : props.marginBottom;
      if (mTop || mBtm) parts.push(`Margin: ${mTop || "md"}/${mBtm || "md"}`);
      return parts.join(" • ") || "Align: Left • Margin: Medium";
    }
    case "layout_advanced": {
      if (props.advancedLayout?.display) {
        return `Display: ${props.advancedLayout.display}`;
      }
      return "Flexbox & Grid layout controls";
    }
    case "motion_entrance": {
      if (props.animation?.type && props.animation.type !== "none") {
        return `Preset: ${props.animation.type}`;
      }
      return "Entrance active";
    }
    case "motion_interactive": {
      if (props.hoverEffect && props.hoverEffect !== "none") {
        return `Hover: ${props.hoverEffect}`;
      }
      return "Subtle hover transitions";
    }
    case "content_main": {
      const text = props.label || props.title || props.headline || props.text || props.content || props.quote || props.heading;
      if (text && typeof text === "string") {
        const clean = text.trim();
        return clean.length > 26 ? `“${clean.slice(0, 24)}...”` : `“${clean}”`;
      }
      return "Configured text content";
    }
    case "content_media": {
      const src = props.src || props.avatarUrl || props.imageUrl || props.backgroundImage || props.heroImage;
      if (src && typeof src === "string") {
        const filename = src.split("/").pop()?.slice(0, 18);
        return filename ? `Media: ${filename}` : "Media source set";
      }
      return "No media selected";
    }
    case "content_links": {
      const href = props.url || props.linkUrl || props.ctaHref || props.primaryCta?.href || props.primaryButton?.href;
      if (href && typeof href === "string") {
        return `Link: ${href.slice(0, 20)}`;
      }
      return "Destination link";
    }
    case "content_items": {
      const items = props.items || props.statItems || props.stepItems || props.featureItems || props.accordionItems;
      if (Array.isArray(items)) {
        return `${items.length} ${items.length === 1 ? "item" : "items"} configured`;
      }
      return "Collection items";
    }
    default:
      return null;
  }
}

// Global variable to remember last active tab across element selections
let rememberedActiveTab: SettingTabId = "content";

/**
 * Modern Redesigned Right Settings Panel for Puck Editor
 * Specifications:
 * - Fixed Width: 300px to 320px (no resize)
 * - 8px consistent grid spacing (16px between groups, 8px between controls)
 * - 13px labels, 12px helper text
 * - Brand navy #0f2142 accent
 * - Flat clean 1px border without heavy box shadows
 */
export function RedesignedSettingsPanel({
  children,
  isLoading,
  itemSelector,
  onOpenSeo,
}: {
  children?: React.ReactNode;
  isLoading?: boolean;
  itemSelector?: ItemSelector | null;
  onOpenSeo?: () => void;
}) {
  const { selectedItem, appState, dispatch, getParentById, getSelectorForId } = usePuck();
  const [editorMode, setEditorMode] = useEditorMode();

  // Panel Collapse state (Persisted in localStorage)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("cms_panel_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("cms_panel_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  // Search filter query state
  const [searchQuery, setSearchQuery] = useState("");

  // Active Tab state
  const [activeTab, setActiveTab] = useState<SettingTabId>(rememberedActiveTab);

  // Accordion open subgroups state (Array of open subgroup IDs: min 1, max 2)
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // State for empty-state direct page title editing & root accordion
  const [isRootAccordionOpen, setIsRootAccordionOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const selectedId = selectedItem?.props?.id;
  const blockType = selectedItem?.type;
  const BlockIcon = getBlockIcon(blockType);
  const friendlyName = selectedItem ? getFriendlyBlockName(blockType) : "Page Settings";
  const currentProps = selectedItem?.props || (appState.data?.root?.props as any) || {};

  // Find parent component if nested inside Columns, Section, etc.
  const parentComponent = selectedId ? getParentById(selectedId) : undefined;
  const ParentIcon = parentComponent ? getBlockIcon(parentComponent.type) : null;
  const friendlyParentName = parentComponent ? getFriendlyBlockName(parentComponent.type) : null;

  // Categorize child elements into Tabs and Subgroups
  const childArray = React.Children.toArray(children);

  const categorizedData = useMemo(() => {
    const tabMap: Record<
      SettingTabId,
      Record<string, { key: string; element: React.ReactNode; isAdvanced?: boolean }[]>
    > = {
      content: {},
      style: {},
      layout: {},
      motion: {},
    };

    childArray.forEach((child) => {
      if (React.isValidElement(child)) {
        const rawKey = String(child.key || "");
        // Puck keys are usually ".$fieldName" or "fieldName"
        const fieldName = rawKey.replace(/^\.\$/, "");
        const meta = getFieldMeta(fieldName);

        if (!tabMap[meta.tab][meta.subgroup]) {
          tabMap[meta.tab][meta.subgroup] = [];
        }

        tabMap[meta.tab][meta.subgroup].push({
          key: fieldName,
          element: child,
          isAdvanced: meta.isAdvanced,
        });
      }
    });

    return tabMap;
  }, [children]);

  // Determine available tabs (only tabs that have at least 1 field)
  const availableTabs = useMemo(() => {
    return ALL_TABS.filter((tab) => {
      const subgroups = categorizedData[tab.id];
      const totalFields = Object.values(subgroups).reduce((acc, list) => acc + list.length, 0);
      return totalFields > 0;
    });
  }, [categorizedData]);

  // Ensure active tab is valid for the currently selected block
  useEffect(() => {
    if (availableTabs.length === 0) return;
    const isRememberedValid = availableTabs.some((t) => t.id === rememberedActiveTab);
    if (isRememberedValid) {
      setActiveTab(rememberedActiveTab);
    } else {
      setActiveTab(availableTabs[0].id);
      rememberedActiveTab = availableTabs[0].id;
    }
  }, [selectedId, blockType, availableTabs]);

  // Retrieve visible subgroups for active tab based on Simple/Advanced mode
  const currentTabSubgroups = useMemo(() => {
    const defs = SUBGROUPS_BY_TAB[activeTab] || [];
    return defs.filter((sub) => {
      const fields = categorizedData[activeTab]?.[sub.id] || [];
      if (fields.length === 0) return false;

      // In Simple mode, hide advanced subgroups
      if (editorMode === "simple" && sub.isAdvanced) {
        return false;
      }

      return true;
    });
  }, [activeTab, categorizedData, editorMode]);

  // Reset open groups when tab or selected block changes: default only 1st group open
  useEffect(() => {
    if (currentTabSubgroups.length > 0) {
      setOpenGroups([currentTabSubgroups[0].id]);
    } else {
      setOpenGroups([]);
    }
  }, [activeTab, selectedId, editorMode]);

  const handleTabChange = (newTab: SettingTabId) => {
    setActiveTab(newTab);
    rememberedActiveTab = newTab;
  };

  // Global Keyboard Shortcuts (Esc to deselect, Tab 1-4 switches, Ctrl+\ toggle panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable);

      // Toggle panel collapse (Ctrl+\ or Meta+\)
      if ((e.ctrlKey || e.metaKey) && e.key === "\\") {
        e.preventDefault();
        toggleCollapsed();
        return;
      }

      // Escape key to deselect back to page level
      if (e.key === "Escape") {
        if (selectedItem) {
          e.preventDefault();
          dispatch({
            type: "setUi",
            ui: { itemSelector: null },
          });
        }
        return;
      }

      // Tab switching shortcuts (Alt+1/2/3/4 or number 1/2/3/4 when not typing in input)
      if (!isInput && selectedItem) {
        if (e.key === "1" || (e.altKey && e.key === "1")) {
          if (availableTabs.some((t) => t.id === "content")) {
            e.preventDefault();
            handleTabChange("content");
          }
        } else if (e.key === "2" || (e.altKey && e.key === "2")) {
          if (availableTabs.some((t) => t.id === "style")) {
            e.preventDefault();
            handleTabChange("style");
          }
        } else if (e.key === "3" || (e.altKey && e.key === "3")) {
          if (availableTabs.some((t) => t.id === "layout")) {
            e.preventDefault();
            handleTabChange("layout");
          }
        } else if (e.key === "4" || (e.altKey && e.key === "4")) {
          if (availableTabs.some((t) => t.id === "motion")) {
            e.preventDefault();
            handleTabChange("motion");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, availableTabs, dispatch]);

  /**
   * Accordion Toggle Handler: Max 2 open, min 1 open rule
   */
  const handleToggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      if (prev.includes(groupId)) {
        if (prev.length > 1) {
          return prev.filter((id) => id !== groupId);
        }
        return [];
      } else {
        if (prev.length >= 2) {
          return [prev[prev.length - 1], groupId];
        }
        return [...prev, groupId];
      }
    });
  };

  // Actions
  const handleSelectParent = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!parentComponent) return;
    const parentSelector = getSelectorForId(parentComponent.props.id);
    if (parentSelector) {
      dispatch({
        type: "setUi",
        ui: { itemSelector: parentSelector },
      });
    }
  };

  const handleDeselectToPage = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({
      type: "setUi",
      ui: { itemSelector: null },
    });
  };

  const handleDuplicate = () => {
    if (!selectedItem || !selectedId) return;
    const cloneId = `${selectedItem.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const clonedItem: ComponentData = {
      ...selectedItem,
      props: {
        ...selectedItem.props,
        id: cloneId,
      },
    };

    dispatch({
      type: "setData",
      data: (prevData) => {
        const contentIdx = (prevData.content || []).findIndex((c) => c.props?.id === selectedId);
        if (contentIdx !== -1) {
          const newContent = [...(prevData.content || [])];
          newContent.splice(contentIdx + 1, 0, clonedItem);
          return { ...prevData, content: newContent };
        }

        if (prevData.zones) {
          const newZones = { ...prevData.zones };
          for (const [zoneKey, list] of Object.entries(newZones)) {
            if (Array.isArray(list)) {
              const zoneIdx = list.findIndex((c) => c.props?.id === selectedId);
              if (zoneIdx !== -1) {
                const newList = [...list];
                newList.splice(zoneIdx + 1, 0, clonedItem);
                newZones[zoneKey] = newList;
                return { ...prevData, zones: newZones };
              }
            }
          }
        }

        return prevData;
      },
    });

    toast.success(`Copied ${friendlyName}`);
  };

  const handleDelete = () => {
    if (!selectedItem || !selectedId) return;
    const targetType = friendlyName;

    dispatch({
      type: "setData",
      data: (prevData) => {
        const filterItem = (list: ComponentData[]) => list.filter((c) => c.props?.id !== selectedId);

        return {
          ...prevData,
          content: filterItem(prevData.content || []),
          zones: prevData.zones
            ? Object.fromEntries(
                Object.entries(prevData.zones).map(([k, list]) => [
                  k,
                  Array.isArray(list) ? filterItem(list) : list,
                ])
              )
            : prevData.zones,
        };
      },
    });

    dispatch({
      type: "setUi",
      ui: { itemSelector: null },
    });

    toast.success(`Removed ${targetType}`);
  };

  const handleResetStyle = () => {
    if (!selectedItem || !selectedId || !blockType) return;
    const blockConfig = (puckEditorConfig.components as any)[blockType];
    const defaultProps = blockConfig?.defaultProps || {};

    const confirmReset = window.confirm(
      `Reset styles for "${friendlyName}"? This will return colors, sizes, and spacing to default values.`
    );
    if (!confirmReset) return;

    dispatch({
      type: "setData",
      data: (prevData) => {
        const updateProps = (item: ComponentData) => {
          if (item.props?.id === selectedId) {
            return {
              ...item,
              props: {
                ...item.props,
                backgroundColor: defaultProps.backgroundColor || "",
                textColor: defaultProps.textColor || "",
                borderColor: defaultProps.borderColor || "",
                styleControls: defaultProps.styleControls || undefined,
                advancedLayout: defaultProps.advancedLayout || undefined,
                sizeControls: defaultProps.sizeControls || undefined,
                animation: defaultProps.animation || undefined,
                variant: defaultProps.variant || item.props.variant,
                cardStyle: defaultProps.cardStyle || item.props.cardStyle,
                theme: defaultProps.theme || item.props.theme,
                rounded: defaultProps.rounded || item.props.rounded,
                align: defaultProps.align || { base: "left" },
                marginTop: defaultProps.marginTop || { base: "md" },
                marginBottom: defaultProps.marginBottom || { base: "md" },
                paddingTop: defaultProps.paddingTop || { base: "none" },
                paddingBottom: defaultProps.paddingBottom || { base: "none" },
              },
            };
          }
          return item;
        };

        return {
          ...prevData,
          content: (prevData.content || []).map(updateProps),
          zones: prevData.zones
            ? Object.fromEntries(
                Object.entries(prevData.zones).map(([k, list]) => [
                  k,
                  Array.isArray(list) ? list.map(updateProps) : list,
                ])
              )
            : prevData.zones,
        };
      },
    });

    toast.success(`Styles reset to default for ${friendlyName}`);
  };

const FIELD_SEARCH_KEYWORDS: Record<string, string[]> = {
  styleControls: ["color", "colors", "background", "text", "border", "shadow", "corner", "radius", "font", "typography", "padding", "margin", "swatch", "preset"],
  backgroundColor: ["color", "colors", "background", "bg", "swatch"],
  textColor: ["color", "colors", "text", "font", "swatch"],
  borderColor: ["color", "colors", "border", "stroke", "swatch"],
  sizeControls: ["size", "width", "height", "scale", "dimension", "percent"],
  advancedLayout: ["layout", "flex", "grid", "display", "margin", "padding", "align", "direction"],
  animation: ["animation", "motion", "entrance", "scroll", "effect", "fade", "slide", "zoom"],
  hoverEffect: ["hover", "interaction", "motion", "scale", "lift", "glow"],
  url: ["link", "url", "href", "button", "destination"],
  linkUrl: ["link", "url", "href", "destination"],
  ctaHref: ["link", "url", "href", "destination"],
  src: ["image", "photo", "picture", "media", "asset", "upload"],
  avatarUrl: ["image", "photo", "avatar", "picture"],
  imageUrl: ["image", "photo", "picture", "media"],
  heroImage: ["image", "photo", "background", "hero", "banner"],
  backgroundImage: ["image", "background", "bg", "photo"],
  align: ["align", "alignment", "center", "left", "right", "justify"],
  marginTop: ["spacing", "margin", "top", "space", "padding"],
  marginBottom: ["spacing", "margin", "bottom", "space", "padding"],
  paddingTop: ["spacing", "padding", "top", "space", "margin"],
  paddingBottom: ["spacing", "padding", "bottom", "space", "margin"],
  rounded: ["corner", "radius", "round", "border", "shape"],
  cardStyle: ["card", "shadow", "border", "style", "appearance"],
  variant: ["variant", "style", "theme", "color", "look"],
};

  // Search matching logic with keyword expansion
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!trimmedSearch) return [];

    const matches: { key: string; element: React.ReactNode; tab: SettingTabId; subgroup: string }[] = [];
    const seen = new Set<string>();

    (Object.keys(categorizedData) as SettingTabId[]).forEach((tab) => {
      Object.entries(categorizedData[tab]).forEach(([subgroupId, items]) => {
        items.forEach((item) => {
          if (seen.has(item.key)) return;
          const keyLower = item.key.toLowerCase();
          const keywords = FIELD_SEARCH_KEYWORDS[item.key] || [];
          const matchesKey = keyLower.includes(trimmedSearch);
          const matchesKeyword = keywords.some((kw) => kw.includes(trimmedSearch) || trimmedSearch.includes(kw));
          const matchesSubgroup = subgroupId.toLowerCase().includes(trimmedSearch);
          const matchesTab = tab.toLowerCase().includes(trimmedSearch);

          if (matchesKey || matchesKeyword || matchesSubgroup || matchesTab) {
            seen.add(item.key);
            matches.push({ ...item, tab, subgroup: subgroupId });
          }
        });
      });
    });

    return matches;
  }, [trimmedSearch, categorizedData]);

  if (isCollapsed) {
    return (
      <div className="relative flex flex-col items-center justify-between h-full w-[36px] min-w-[36px] bg-white border-l border-slate-200 py-3 select-none text-slate-700 shadow-2xs hover:bg-slate-50/80 transition-all duration-200">
        {/* Edge Arrow Expand Button */}
        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
            try {
              localStorage.setItem("cms_panel_collapsed", "false");
            } catch {}
          }}
          className="absolute -left-3 top-10 z-30 size-6 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0f2142] hover:bg-slate-50 transition-all cursor-pointer hover:scale-110"
          title="Expand Settings Panel (Ctrl+\)"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
            try {
              localStorage.setItem("cms_panel_collapsed", "false");
            } catch {}
          }}
          className="p-1.5 rounded-lg text-slate-600 hover:text-[#0f2142] hover:bg-slate-100 transition-all cursor-pointer"
          title="Expand Settings Panel (Ctrl+\)"
        >
          <ChevronLeft className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
            try {
              localStorage.setItem("cms_panel_collapsed", "false");
            } catch {}
          }}
          className="flex flex-col items-center gap-2 cursor-pointer group py-2"
          title="Expand Settings Panel"
        >
          <SlidersHorizontal className="size-3.5 text-slate-400 group-hover:text-[#0f2142] transition-colors" />
          <span className="[writing-mode:vertical-lr] rotate-180 text-[11px] font-bold text-slate-500 group-hover:text-[#0f2142] tracking-widest uppercase transition-colors">
            Settings
          </span>
        </button>

        <div className="w-4 h-px bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full w-[310px] min-w-[300px] max-w-[320px] bg-white select-none text-slate-800 font-sans border-l border-slate-200">
      {/* Edge Arrow Collapse Button */}
      <button
        type="button"
        onClick={toggleCollapsed}
        className="absolute -left-3 top-10 z-30 size-6 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0f2142] hover:bg-slate-50 transition-all cursor-pointer hover:scale-110"
        title="Collapse Panel (Ctrl+\)"
      >
        <ChevronRight className="size-3.5" />
      </button>

      {/* 1. STICKY PANEL HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        {/* Header Top Row: Icon + Name + Breadcrumb + Actions + Collapse */}
        <div className="px-3 pt-3 pb-2 flex items-center justify-between gap-2">
          {/* Left: Element Icon & Name + Breadcrumb */}
          <div className="min-w-0 flex-1">
            {/* Breadcrumb row */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-0.5 overflow-hidden">
              <button
                type="button"
                onClick={handleDeselectToPage}
                className="hover:text-[#0f2142] hover:underline transition-colors truncate cursor-pointer flex items-center gap-1"
                title="View Page Global Settings"
              >
                <Globe className="size-3 shrink-0 text-slate-400" />
                <span>Page</span>
              </button>

              {parentComponent && (
                <>
                  <ChevronRight className="size-3 text-slate-300 shrink-0" />
                  <button
                    type="button"
                    onClick={handleSelectParent}
                    className="hover:text-[#0f2142] hover:underline transition-colors truncate cursor-pointer flex items-center gap-1"
                    title={`Select parent: ${friendlyParentName}`}
                  >
                    {ParentIcon && <ParentIcon className="size-3 shrink-0 text-slate-400" />}
                    <span className="truncate max-w-[75px]">{friendlyParentName}</span>
                  </button>
                </>
              )}

              {selectedItem && (
                <>
                  <ChevronRight className="size-3 text-slate-300 shrink-0" />
                  <span className="text-slate-700 font-semibold truncate max-w-[80px]">{friendlyName}</span>
                </>
              )}
            </div>

            {/* Element Title & Icon */}
            <div className="flex items-center gap-1.5">
              <div className="size-5 rounded bg-[#0f2142]/5 border border-[#0f2142]/10 flex items-center justify-center text-[#0f2142] shrink-0">
                <BlockIcon className="size-3" />
              </div>
              <h3 className="text-[13px] font-bold text-[#0f2142] truncate">
                {friendlyName}
              </h3>
            </div>
          </div>

          {/* Right: Actions + Panel Collapse Button */}
          <div className="flex items-center gap-1 shrink-0">
            {selectedItem && (
              <div className="flex items-center gap-0.5 shrink-0 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={!selectedItem}
                  title="Duplicate element"
                  className="p-1 rounded text-slate-600 hover:text-[#0f2142] hover:bg-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Copy className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleResetStyle}
                  disabled={!selectedItem}
                  title="Reset styling to default"
                  className="p-1 rounded text-slate-600 hover:text-amber-700 hover:bg-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <RotateCcw className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!selectedItem}
                  title="Delete element"
                  className="p-1 rounded text-slate-600 hover:text-red-600 hover:bg-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            )}

            {/* Collapse Panel Button */}
            <button
              type="button"
              onClick={toggleCollapsed}
              title="Collapse Panel (Ctrl+\)"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200"
            >
              <PanelRightClose className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Header Middle Row: Search Box & Simple/Advanced Segmented Toggle (when element selected) */}
        {selectedItem && (
          <div className="px-3 pb-2 flex items-center gap-1.5">
            {/* Search Box */}
            <div className="relative flex-1 flex items-center">
              <Search className="size-3.5 absolute left-2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings..."
                className="w-full pl-7 pr-6 py-1 text-[12px] rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142] outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Simple | Advanced Mode Segmented Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditorMode("simple");
                  toast.info("⚡ Simple Mode active");
                }}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  editorMode === "simple"
                    ? "bg-white text-[#0f2142] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Simple Mode"
              >
                <Sparkles className="size-3 text-amber-500" />
                <span>Simple</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditorMode("advanced");
                  toast.info("🛠️ Advanced Mode active");
                }}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  editorMode === "advanced"
                    ? "bg-white text-[#0f2142] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Advanced Mode"
              >
                <SlidersHorizontal className="size-3 text-blue-600" />
                <span>Adv</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. TABS BAR (Max 4 tabs: Content, Style, Layout, Motion) */}
        {selectedItem && !trimmedSearch && availableTabs.length > 1 && (
          <div className="flex border-t border-slate-200 bg-slate-50/70 px-2 pt-1 gap-0.5">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-t-lg text-[12px] font-semibold transition-all cursor-pointer border-t border-x ${
                    isActive
                      ? "bg-white text-[#0f2142] border-slate-200 border-b-transparent font-bold -mb-px z-10"
                      : "bg-transparent text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-[#0f2142]" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. EMPTY STATE VIEW (when nothing is selected on canvas) */}
      {!selectedItem ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-white">
          {/* Main Empty State Alert Banner */}
          <div className="p-4 flex flex-col items-center text-center bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="size-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#0f2142] shadow-2xs">
              <MousePointerClick className="size-5 text-[#0f2142]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-slate-800">
                No Element Selected
              </h4>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed max-w-[230px] mx-auto">
                Click any element on the page to edit it
              </p>
            </div>
          </div>

          {/* 3 Page-Level Settings Quick Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Page Level Settings</span>
            </div>

            {/* 1. Page Title */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">Page Title</span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {currentProps.title || "Set page title"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingTitle(currentProps.title || "");
                    setIsEditingTitle(!isEditingTitle);
                  }}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold text-[#0f2142] bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {isEditingTitle ? "Done" : "Edit"}
                </button>
              </div>

              {isEditingTitle && (
                <div className="pt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="Enter page title..."
                    className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({
                        type: "setData",
                        data: (prev) => ({
                          ...prev,
                          root: {
                            ...prev.root,
                            props: {
                              ...(prev.root?.props || {}),
                              title: editingTitle,
                            },
                          },
                        }),
                      });
                      setIsEditingTitle(false);
                      toast.success("Page title updated");
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#0f2142] text-white font-bold hover:bg-[#0f2142]/90 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* 2. SEO & Metadata */}
            <button
              type="button"
              onClick={() => {
                if (onOpenSeo) {
                  onOpenSeo();
                } else {
                  toast.info("Open Settings > SEO from top bar");
                }
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 transition-all flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Globe className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-[#0f2142]">SEO & Social Metadata</span>
                  <span className="text-[11px] text-slate-400 truncate block">
                    Google title, snippet & OG social cards
                  </span>
                </div>
              </div>
              <ArrowRight className="size-3.5 text-slate-400 group-hover:text-[#0f2142] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 3. Page Background & Header Hero */}
            <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Palette className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">Header Banner</span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {currentProps.showPageHero ? "Header Banner: Enabled" : "Header Banner: Hidden"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !currentProps.showPageHero;
                    dispatch({
                      type: "setData",
                      data: (prev) => ({
                        ...prev,
                        root: {
                          ...prev.root,
                          props: {
                            ...(prev.root?.props || {}),
                            showPageHero: next,
                          },
                        },
                      }),
                    });
                    toast.success(next ? "Header banner enabled" : "Header banner hidden");
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    currentProps.showPageHero ? "bg-[#0f2142]" : "bg-slate-300"
                  }`}
                  title={currentProps.showPageHero ? "Click to disable header banner" : "Click to enable header banner"}
                >
                  <span
                    className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      currentProps.showPageHero ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Root page fields full accordion toggle */}
          {childArray.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRootAccordionOpen(!isRootAccordionOpen)}
                className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition-all cursor-pointer"
              >
                <span>Advanced Page Properties ({childArray.length} fields)</span>
                <ChevronDown className={`size-3.5 transition-transform duration-200 ${isRootAccordionOpen ? "rotate-180" : ""}`} />
              </button>

              {isRootAccordionOpen && (
                <div className="mt-2 space-y-3 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                  {childArray.map((child, i) => (
                    <div key={i} className="puck-field-container">
                      {child}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 4. SETTINGS FIELDS CONTENT BODY FOR SELECTED ELEMENT */
        <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-white">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="size-5 border-2 border-[#0f2142] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Updating settings...</span>
            </div>
          ) : trimmedSearch ? (
            /* Live Search Filter Results Mode */
            <div className="space-y-3 bg-white">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                <span>Matching Settings ({searchResults.length})</span>
                <span className="text-[10px] text-slate-400">for &quot;{trimmedSearch}&quot;</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Search className="size-6 mx-auto mb-1.5 opacity-40" />
                  <p className="text-xs">No settings found matching &quot;{searchQuery}&quot;.</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-xs text-[#0f2142] hover:underline font-semibold cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                searchResults.map((item) => (
                  <div key={item.key} className="space-y-1.5 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="font-mono text-slate-600">{item.key}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                        {item.tab}
                      </span>
                    </div>
                    <div>{item.element}</div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Tabbed Accordion Groups Mode */
            <div className="space-y-3">
              {currentTabSubgroups.length === 0 ? (
                <div className="py-12 text-center text-slate-400 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs">No {activeTab} settings available for this element in {editorMode} mode.</p>
                </div>
              ) : (
                currentTabSubgroups.map((subgroup) => {
                  const SubIcon = subgroup.icon;
                  const fields = categorizedData[activeTab]?.[subgroup.id] || [];
                  const isOpen = openGroups.includes(subgroup.id);
                  const summary = getSubgroupSummary(subgroup.id, currentProps);

                  return (
                    <div
                      key={subgroup.id}
                      className="rounded-lg border border-slate-200 overflow-hidden bg-white"
                    >
                      {/* Accordion Group Header: 12px uppercase / 13px bold */}
                      <button
                        type="button"
                        onClick={() => handleToggleGroup(subgroup.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                          isOpen ? "bg-slate-50 border-b border-slate-200" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                          <SubIcon className={`size-3.5 shrink-0 ${isOpen ? "text-[#0f2142]" : "text-slate-400"}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wider truncate">
                                {subgroup.label}
                              </span>
                              {subgroup.isAdvanced && (
                                <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  ADV
                                </span>
                              )}
                            </div>

                            {/* Summary row when collapsed */}
                            {!isOpen && summary && (
                              <span className="text-[11px] text-slate-400 truncate block mt-0.5 font-normal">
                                {summary}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {fields.length}
                          </span>
                          <ChevronDown
                            className={`size-3.5 text-slate-400 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-slate-600" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Accordion Group Fields Body (8px grid spacing between controls) */}
                      {isOpen && (
                        <div className="p-3 space-y-2.5 bg-white">
                          {fields.map((item) => (
                            <div key={item.key} className="puck-field-container">
                              {item.element}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Modern Field Overrides CSS styling */}
      <style>{`
        /* Puck input field labels */
        [class*="_FieldLabel_"] {
          margin-bottom: 2px !important;
        }

        [class*="_FieldLabel-label_"] {
          font-size: 13px !important;
          font-weight: 500 !important;
          color: #334155 !important;
          letter-spacing: 0em !important;
        }

        [class*="_FieldLabel-readOnly_"] {
          opacity: 0.6 !important;
        }

        /* Puck Text / Select / Textarea inputs */
        [class*="_Input_"],
        [class*="_Select_"],
        [class*="_Textarea_"] {
          font-size: 12px !important;
          border-radius: 6px !important;
          border-color: #cbd5e1 !important;
          background-color: #ffffff !important;
          padding: 4px 8px !important;
          transition: all 0.15s ease !important;
        }

        [class*="_Input_"]:focus,
        [class*="_Select_"]:focus,
        [class*="_Textarea_"]:focus {
          border-color: #0f2142 !important;
          box-shadow: 0 0 0 1px #0f2142 !important;
          outline: none !important;
        }
      `}</style>
    </div>
  );
}

export default RedesignedSettingsPanel;
