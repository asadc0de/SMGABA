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
  Globe,
  SlidersHorizontal,
  Layers,
  HelpCircle,
  X,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { getBlockIcon, getFriendlyBlockName } from "./editor-overlay";
import { puckEditorConfig } from "./puck.config";
import { toast } from "sonner";

export type SettingTabId = "content" | "style" | "layout" | "motion";

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
 * Mapping of known field names to their respective tabs
 */
const FIELD_TAB_MAP: Record<string, SettingTabId> = {
  // Content Tab Fields
  label: "content",
  text: "content",
  title: "content",
  content: "content",
  heading: "content",
  subheading: "content",
  headline: "content",
  subheadline: "content",
  eyebrow: "content",
  badge: "content",
  quote: "content",
  authorName: "content",
  authorRole: "content",
  authorCompany: "content",
  rating: "content",
  items: "content",
  src: "content",
  url: "content",
  linkUrl: "content",
  ctaText: "content",
  ctaHref: "content",
  primaryCta: "content",
  secondaryCta: "content",
  primaryButton: "content",
  secondaryButton: "content",
  avatarUrl: "content",
  imageUrl: "content",
  backgroundImage: "content",
  icon: "content",
  calendlyUrl: "content",
  videoUrl: "content",
  embedUrl: "content",
  youtubeUrl: "content",
  vimeoUrl: "content",
  enableLightbox: "content",
  showCaptions: "content",
  alt: "content",
  caption: "content",
  statItems: "content",
  stepItems: "content",
  featureItems: "content",
  accordionItems: "content",
  showPageHero: "content",
  heroEyebrow: "content",
  heroDescription: "content",
  heroImage: "content",
  heroPrimaryCtaText: "content",
  heroPrimaryCtaHref: "content",
  heroSecondaryCtaText: "content",
  heroSecondaryCtaHref: "content",
  seoTitle: "content",
  metaDescription: "content",
  canonicalUrl: "content",
  ogTitle: "content",
  ogDescription: "content",
  ogImage: "content",

  // Style Tab Fields
  styleControls: "style",
  variant: "style",
  color: "style",
  textColor: "style",
  backgroundColor: "style",
  borderColor: "style",
  theme: "style",
  cardStyle: "style",
  overlayStrength: "style",
  overlay: "style",
  styleVariant: "style",
  rounded: "style",
  aspectRatio: "style",
  objectFit: "style",
  typography: "style",
  titleTypography: "style",
  bodyTypography: "style",
  headlineTypography: "style",
  quoteTypography: "style",
  authorTypography: "style",
  fontSizePx: "style",
  level: "style",
  thickness: "style",
  layout: "style", // For Testimonial (Design A vs B presentation)

  // Layout Tab Fields
  advancedLayout: "layout",
  sizeControls: "layout",
  sizePercent: "layout",
  size: "layout",
  width: "layout",
  height: "layout",
  minHeight: "layout",
  columns: "layout",
  gap: "layout",
  sameItemSize: "layout",
  equalHeightCards: "layout",
  align: "layout",
  marginTop: "layout",
  marginBottom: "layout",
  paddingTop: "layout",
  paddingBottom: "layout",
  paddingVertical: "layout",
  spacerHeight: "layout",
  dividerWidth: "layout",

  // Motion Tab Fields
  animation: "motion",
  hoverEffect: "motion",
  transition: "motion",
};

/**
 * Categorize a field name into one of 4 tabs
 */
export function getFieldCategory(fieldName: string): SettingTabId {
  if (FIELD_TAB_MAP[fieldName]) {
    return FIELD_TAB_MAP[fieldName];
  }

  const lower = fieldName.toLowerCase();
  if (
    lower.includes("anim") ||
    lower.includes("motion") ||
    lower.includes("hover") ||
    lower.includes("effect")
  ) {
    return "motion";
  }

  if (
    lower.includes("layout") ||
    lower.includes("size") ||
    lower.includes("width") ||
    lower.includes("height") ||
    lower.includes("margin") ||
    lower.includes("padding") ||
    lower.includes("space") ||
    lower.includes("gap") ||
    lower.includes("column") ||
    lower.includes("align") ||
    lower.includes("grid") ||
    lower.includes("flex")
  ) {
    return "layout";
  }

  if (
    lower.includes("style") ||
    lower.includes("color") ||
    lower.includes("bg") ||
    lower.includes("font") ||
    lower.includes("text") ||
    lower.includes("border") ||
    lower.includes("radius") ||
    lower.includes("shadow") ||
    lower.includes("theme") ||
    lower.includes("opacity")
  ) {
    return "style";
  }

  return "content";
}

// Global variable to remember last active tab across element selections
let rememberedActiveTab: SettingTabId = "content";

/**
 * Modern Redesigned Right Settings Panel for Puck Editor
 */
export function RedesignedSettingsPanel({
  children,
  isLoading,
  itemSelector,
}: {
  children?: React.ReactNode;
  isLoading?: boolean;
  itemSelector?: ItemSelector | null;
}) {
  const { selectedItem, appState, dispatch, getParentById, getSelectorForId } = usePuck();

  // Search filter query state
  const [searchQuery, setSearchQuery] = useState("");

  // Active Tab state
  const [activeTab, setActiveTab] = useState<SettingTabId>(rememberedActiveTab);

  const selectedId = selectedItem?.props?.id;
  const blockType = selectedItem?.type;
  const BlockIcon = getBlockIcon(blockType);
  const friendlyName = selectedItem ? getFriendlyBlockName(blockType) : "Page Root Settings";

  // Find parent component if nested inside Columns, Section, etc.
  const parentComponent = selectedId ? getParentById(selectedId) : undefined;
  const ParentIcon = parentComponent ? getBlockIcon(parentComponent.type) : null;
  const friendlyParentName = parentComponent ? getFriendlyBlockName(parentComponent.type) : null;

  // Categorize child elements (each child corresponds to a field with key === fieldName)
  const childArray = React.Children.toArray(children);

  const categorizedFields = useMemo(() => {
    const buckets: Record<SettingTabId, { key: string; element: React.ReactNode }[]> = {
      content: [],
      style: [],
      layout: [],
      motion: [],
    };

    childArray.forEach((child) => {
      if (React.isValidElement(child)) {
        const rawKey = String(child.key || "");
        // Puck keys are usually ".$fieldName" or "fieldName"
        const fieldName = rawKey.replace(/^\.\$/, "");
        const category = getFieldCategory(fieldName);
        buckets[category].push({ key: fieldName, element: child });
      }
    });

    return buckets;
  }, [children]);

  // Determine available tabs (only tabs that have at least 1 field)
  const availableTabs = useMemo(() => {
    return ALL_TABS.filter((tab) => categorizedFields[tab.id].length > 0);
  }, [categorizedFields]);

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

  const handleTabChange = (newTab: SettingTabId) => {
    setActiveTab(newTab);
    rememberedActiveTab = newTab;
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
        // Search in content
        const contentIdx = (prevData.content || []).findIndex((c) => c.props?.id === selectedId);
        if (contentIdx !== -1) {
          const newContent = [...(prevData.content || [])];
          newContent.splice(contentIdx + 1, 0, clonedItem);
          return { ...prevData, content: newContent };
        }

        // Search in zones
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

  // Search matching logic
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!trimmedSearch) return [];

    const matches: { key: string; element: React.ReactNode; category: SettingTabId }[] = [];

    (Object.keys(categorizedFields) as SettingTabId[]).forEach((cat) => {
      categorizedFields[cat].forEach((item) => {
        const keyLower = item.key.toLowerCase();
        if (keyLower.includes(trimmedSearch)) {
          matches.push({ ...item, category: cat });
        }
      });
    });

    return matches;
  }, [trimmedSearch, categorizedFields]);

  return (
    <div className="flex flex-col h-full w-full bg-white select-none text-slate-800 font-sans">
      {/* 1. STICKY PANEL HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-2xs">
        {/* Header Top Row: Icon + Name + Breadcrumb + Actions */}
        <div className="px-3.5 pt-3 pb-2.5 flex items-center justify-between gap-2">
          {/* Left: Element Icon & Name + Breadcrumb */}
          <div className="min-w-0 flex-1">
            {/* Breadcrumb row */}
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-1 overflow-hidden">
              <button
                type="button"
                onClick={handleDeselectToPage}
                className="hover:text-navy hover:underline transition-colors truncate cursor-pointer flex items-center gap-1"
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
                    className="hover:text-navy hover:underline transition-colors truncate cursor-pointer flex items-center gap-1"
                    title={`Select parent container: ${friendlyParentName}`}
                  >
                    {ParentIcon && <ParentIcon className="size-3 shrink-0 text-slate-400" />}
                    <span className="truncate max-w-[80px]">{friendlyParentName}</span>
                  </button>
                </>
              )}

              {selectedItem && (
                <>
                  <ChevronRight className="size-3 text-slate-300 shrink-0" />
                  <span className="text-slate-700 font-semibold truncate">{friendlyName}</span>
                </>
              )}
            </div>

            {/* Element Title & Icon Badge */}
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-[#0f2142]/5 border border-[#0f2142]/10 flex items-center justify-center text-[#0f2142] shrink-0">
                <BlockIcon className="size-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-navy truncate">
                {friendlyName}
              </h3>
            </div>
          </div>

          {/* Right: 3 Action Icon Buttons */}
          <div className="flex items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {/* Duplicate Button */}
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={!selectedItem}
              title="Duplicate element"
              className="p-1.5 rounded-md text-slate-600 hover:text-navy hover:bg-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <Copy className="size-3.5" />
            </button>

            {/* Reset Style Button */}
            <button
              type="button"
              onClick={handleResetStyle}
              disabled={!selectedItem}
              title="Reset styling to default"
              className="p-1.5 rounded-md text-slate-600 hover:text-amber-700 hover:bg-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <RotateCcw className="size-3.5" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={!selectedItem}
              title="Delete element"
              className="p-1.5 rounded-md text-slate-600 hover:text-red-600 hover:bg-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Header Search Filter Box */}
        <div className="px-3 pb-2.5">
          <div className="relative flex items-center">
            <Search className="size-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings (e.g. color, padding, font)..."
              className="w-full pl-8 pr-7 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* 2. TABS BAR (Max 4 tabs: Content, Style, Layout, Motion) */}
        {!trimmedSearch && availableTabs.length > 1 && (
          <div className="flex border-t border-slate-200 bg-slate-50/70 px-2 pt-1 gap-1">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = categorizedFields[tab.id].length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer border-t border-x ${
                    isActive
                      ? "bg-white text-navy border-slate-200 border-b-transparent shadow-xs -mb-px z-10"
                      : "bg-transparent text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SETTINGS FIELDS CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-white">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <div className="size-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Updating settings...</span>
          </div>
        ) : trimmedSearch ? (
          /* Live Search Filter Results Mode */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
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
                  className="mt-2 text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              searchResults.map((item) => (
                <div key={item.key} className="space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="font-mono text-slate-600">{item.key}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {item.category}
                    </span>
                  </div>
                  <div className="pt-1">{item.element}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Tabbed Fields Mode */
          <div className="space-y-3">
            {categorizedFields[activeTab]?.length > 0 ? (
              categorizedFields[activeTab].map((item) => (
                <div key={item.key} className="puck-field-container">
                  {item.element}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400">
                <p className="text-xs">No {activeTab} settings available for this element.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modern Field Overrides CSS styling */}
      <style>{`
        .puck-field-container {
          margin-bottom: 8px;
        }

        /* Sleek Puck input fields */
        [class*="_FieldLabel_"] {
          margin-bottom: 4px !important;
        }

        [class*="_FieldLabel-label_"] {
          font-size: 11.5px !important;
          font-weight: 700 !important;
          color: #1e293b !important;
          letter-spacing: 0.01em !important;
        }

        [class*="_FieldLabel-readOnly_"] {
          opacity: 0.6 !important;
        }

        /* Puck Text / Select / Textarea inputs */
        [class*="_Input_"],
        [class*="_Select_"],
        [class*="_Textarea_"] {
          font-size: 12px !important;
          border-radius: 8px !important;
          border-color: #e2e8f0 !important;
          background-color: #f8fafc !important;
          transition: all 0.15s ease !important;
        }

        [class*="_Input_"]:focus,
        [class*="_Select_"]:focus,
        [class*="_Textarea_"]:focus {
          background-color: #ffffff !important;
          border-color: #0f2142 !important;
          box-shadow: 0 0 0 1px #0f2142 !important;
          outline: none !important;
        }
      `}</style>
    </div>
  );
}

export default RedesignedSettingsPanel;
