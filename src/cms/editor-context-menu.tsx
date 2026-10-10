import React, { useState, useEffect, useRef } from "react";
import { usePuck, type ComponentData, type Data } from "@puckeditor/core";
import {
  Image as ImageIcon,
  Type,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Palette,
  LayoutGrid,
  Sparkles,
  ExternalLink,
  Upload,
  Check,
  X,
  SlidersHorizontal,
  Layers,
  Heading as HeadingIcon,
  AlignLeft,
  RectangleHorizontal,
  Minus,
  MoveVertical,
  CheckCircle2,
  RefreshCw,
  Search,
} from "lucide-react";
import { getBlockIcon, getFriendlyBlockName } from "./editor-overlay";
import { uploadCmsImage, listCmsImages } from "@/lib/cms.server";
import { defaultSectionProps } from "./blocks/Section";

// Curated stock & site presets for quick selection
const CURATED_IMAGE_PRESETS = [
  {
    name: "SMG Logo (Primary Dark)",
    url: "/smg-logo.svg",
    category: "Logos",
  },
  {
    name: "SMG Logo (White Monochrome)",
    url: "/smg-logo-white.svg",
    category: "Logos",
  },
  {
    name: "Modern Executive Office & City Skyline",
    url: "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.jpg",
    category: "Corporate & Hero",
  },
  {
    name: "Financial Data & Analytics Growth",
    url: "/images/stock/unsplash-photo-1551836022-d5d88e9218df.jpg",
    category: "Finance & Analytics",
  },
  {
    name: "Executive Leadership Advisory Session",
    url: "/images/stock/unsplash-photo-1573496359142-b8d87734a5a2.jpg",
    category: "Team & Advisory",
  },
  {
    name: "Professional Executive Portrait (Marcus)",
    url: "/images/stock/unsplash-photo-1507003211169-0a1dd7228f2d.jpg",
    category: "Portraits",
  },
  {
    name: "Professional Financial Director (Elena)",
    url: "/images/stock/unsplash-photo-1573497019940-1c28c88b4f3e.jpg",
    category: "Portraits",
  },
  {
    name: "Modern Conference & Boardroom",
    url: "/images/stock/unsplash-photo-1497366216548-37526070297c.jpg",
    category: "Office & Culture",
  },
];

const COLOR_SWATCHES = [
  { name: "White", value: "#ffffff", border: "border-slate-300", bg: "bg-white" },
  { name: "Light Slate", value: "#f8fafc", border: "border-slate-300", bg: "bg-slate-50" },
  { name: "Navy Brand", value: "#0f2142", border: "border-[#0f2142]", bg: "bg-[#0f2142]" },
  { name: "Soft Blue", value: "#eff6ff", border: "border-blue-200", bg: "bg-blue-50" },
  { name: "Soft Amber", value: "#fffbeb", border: "border-amber-200", bg: "bg-amber-50" },
  { name: "Soft Emerald", value: "#f0fdf4", border: "border-emerald-200", bg: "bg-emerald-50" },
  { name: "Dark Slate", value: "#0b1329", border: "border-slate-800", bg: "bg-slate-900" },
];

/**
 * Finds a component in Puck data by ID
 */
export function findComponentInPuckData(
  data: Data,
  id: string
): { item: ComponentData; index: number; zone?: string } | null {
  if (data.content) {
    const idx = data.content.findIndex((c) => c.props?.id === id);
    if (idx !== -1) {
      return { item: data.content[idx], index: idx, zone: undefined };
    }
  }

  if (data.zones) {
    for (const [zoneKey, items] of Object.entries(data.zones)) {
      if (Array.isArray(items)) {
        const idx = items.findIndex((c) => c.props?.id === id);
        if (idx !== -1) {
          return { item: items[idx], index: idx, zone: zoneKey };
        }
      }
    }
  }

  return null;
}

/**
 * Detects whether a component has an image field and returns field metadata
 */
export function getComponentImageField(type: string, props: any): { fieldName: string; currentValue: string } | null {
  if (!props) return null;
  if (type === "Image" || "src" in props) {
    return { fieldName: "src", currentValue: props.src || "" };
  }
  if (type === "Hero" || "image" in props) {
    return { fieldName: "image", currentValue: props.image || "" };
  }
  if (type === "Section" || "backgroundImage" in props) {
    return { fieldName: "backgroundImage", currentValue: props.backgroundImage || "" };
  }
  if (type === "CTABanner" && "backgroundImage" in props) {
    return { fieldName: "backgroundImage", currentValue: props.backgroundImage || "" };
  }
  if (type === "Testimonial" && "authorImage" in props) {
    return { fieldName: "authorImage", currentValue: props.authorImage || "" };
  }
  return null;
}

/**
 * Detects whether a component has an editable text title / content field
 */
export function getComponentTextField(type: string, props: any): { fieldName: string; label: string; currentValue: string } | null {
  if (!props) return null;
  if (type === "Heading" && "title" in props) {
    return { fieldName: "title", label: "Heading Text", currentValue: props.title || "" };
  }
  if (type === "Button" && "text" in props) {
    return { fieldName: "text", label: "Button Label", currentValue: props.text || "" };
  }
  if (type === "RichText" && "content" in props) {
    return { fieldName: "content", label: "Text Paragraph", currentValue: props.content || "" };
  }
  if (type === "Hero" && "title" in props) {
    return { fieldName: "title", label: "Hero Title", currentValue: props.title || "" };
  }
  if (type === "CTABanner" && "title" in props) {
    return { fieldName: "title", label: "Banner Title", currentValue: props.title || "" };
  }
  if (type === "Callout" && "title" in props) {
    return { fieldName: "title", label: "Callout Title", currentValue: props.title || "" };
  }
  return null;
}

/**
 * Right-Click Context Menu & Quick Image/Property Manager
 */
export function CmsCanvasContextMenu() {
  const { appState, dispatch } = usePuck();

  const [menuState, setMenuState] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    componentId?: string;
    componentType?: string;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const [imageModalState, setImageModalState] = useState<{
    isOpen: boolean;
    componentId: string;
    componentType: string;
    fieldName: string;
    currentUrl: string;
  }>({
    isOpen: false,
    componentId: "",
    componentType: "",
    fieldName: "src",
    currentUrl: "",
  });

  const [textModalState, setTextModalState] = useState<{
    isOpen: boolean;
    componentId: string;
    componentType: string;
    fieldName: string;
    label: string;
    currentText: string;
  }>({
    isOpen: false,
    componentId: "",
    componentType: "",
    fieldName: "title",
    label: "Edit Text",
    currentText: "",
  });

  const menuRef = useRef<HTMLDivElement>(null);

  // Global right-click listener inside the canvas iframe
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Allow default right-click if inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      e.preventDefault();

      // Find nearest puck component overlay or block element
      const puckOverlayEl = target.closest("[data-puck-component-id]") as HTMLElement | null;
      const puckComponentEl = target.closest("[data-puck-component]") as HTMLElement | null;

      let foundId: string | undefined;
      let foundType: string | undefined;

      if (puckOverlayEl) {
        foundId = puckOverlayEl.getAttribute("data-puck-component-id") || undefined;
        foundType = puckOverlayEl.getAttribute("data-puck-component-type") || undefined;
      } else if (puckComponentEl) {
        const nestedOverlay = puckComponentEl.querySelector("[data-puck-component-id]");
        if (nestedOverlay) {
          foundId = nestedOverlay.getAttribute("data-puck-component-id") || undefined;
          foundType = nestedOverlay.getAttribute("data-puck-component-type") || undefined;
        }
      }

      // If we found a component, select it in Puck
      if (foundId) {
        const found = findComponentInPuckData(appState.data, foundId);
        if (found) {
          foundType = found.item.type;
          dispatch({
            type: "setUi",
            ui: {
              itemSelector: {
                index: found.index,
                zone: found.zone,
              },
            },
          });
        }
      }

      // Clamp coordinates to stay within window viewport
      const menuWidth = 230;
      const menuHeight = 310;
      const posX = e.clientX + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 12 : e.clientX;
      const posY = e.clientY + menuHeight > window.innerHeight ? Math.max(12, window.innerHeight - menuHeight - 12) : e.clientY;

      setMenuState({
        isOpen: true,
        x: posX,
        y: posY,
        componentId: foundId,
        componentType: foundType,
      });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [appState.data, dispatch]);

  const closeMenu = () => setMenuState((prev) => ({ ...prev, isOpen: false }));

  // Retrieve current active component data
  const currentComponent = menuState.componentId
    ? findComponentInPuckData(appState.data, menuState.componentId)
    : null;

  const compType = currentComponent?.item.type || menuState.componentType || "Section";
  const compProps = currentComponent?.item.props || {};
  const imageFieldMeta = getComponentImageField(compType, compProps);
  const textFieldMeta = getComponentTextField(compType, compProps);

  const isInline =
    compProps.advancedLayout?.display === "inline" ||
    compProps.advancedLayout?.display === "inline-block" ||
    compProps.display === "inline";

  // Actions
  const handleOpenImagePicker = () => {
    closeMenu();
    if (!menuState.componentId || !imageFieldMeta) return;
    setImageModalState({
      isOpen: true,
      componentId: menuState.componentId,
      componentType: compType,
      fieldName: imageFieldMeta.fieldName,
      currentUrl: imageFieldMeta.currentValue,
    });
  };

  const handleOpenTextEditor = () => {
    closeMenu();
    if (!menuState.componentId || !textFieldMeta) return;
    setTextModalState({
      isOpen: true,
      componentId: menuState.componentId,
      componentType: compType,
      fieldName: textFieldMeta.fieldName,
      label: textFieldMeta.label,
      currentText: textFieldMeta.currentValue,
    });
  };

  const handleToggleDisplayMode = () => {
    closeMenu();
    if (!menuState.componentId) return;
    const targetId = menuState.componentId;
    const newDisplay = isInline ? "block" : "inline";

    dispatch({
      type: "setData",
      data: (prevData) => {
        const updateProps = (item: ComponentData) => {
          if (item.props?.id === targetId) {
            return {
              ...item,
              props: {
                ...item.props,
                display: newDisplay,
                advancedLayout: {
                  ...(item.props.advancedLayout || {}),
                  display: newDisplay,
                },
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
  };

  const handleChangeBgColor = (color: string) => {
    closeMenu();
    if (!menuState.componentId) return;
    const targetId = menuState.componentId;

    dispatch({
      type: "setData",
      data: (prevData) => {
        const updateProps = (item: ComponentData) => {
          if (item.props?.id === targetId) {
            return {
              ...item,
              props: {
                ...item.props,
                backgroundColor: color,
                background: color === "#0f2142" ? "navy" : color === "#f8fafc" ? "light" : color === "#ffffff" ? "white" : "custom",
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
  };

  const handleDuplicate = () => {
    closeMenu();
    if (!menuState.componentId) return;
    const targetId = menuState.componentId;

    dispatch({
      type: "setData",
      data: (prevData) => {
        const cloneWithNewId = (item: ComponentData) => ({
          ...item,
          props: {
            ...item.props,
            id: `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          },
        });

        // Search content
        const contentIdx = (prevData.content || []).findIndex((c) => c.props?.id === targetId);
        if (contentIdx !== -1) {
          const newContent = [...(prevData.content || [])];
          newContent.splice(contentIdx + 1, 0, cloneWithNewId(newContent[contentIdx]));
          return { ...prevData, content: newContent };
        }

        // Search zones
        if (prevData.zones) {
          const newZones = { ...prevData.zones };
          for (const [zoneKey, items] of Object.entries(newZones)) {
            if (Array.isArray(items)) {
              const zoneIdx = items.findIndex((c) => c.props?.id === targetId);
              if (zoneIdx !== -1) {
                const newItems = [...items];
                newItems.splice(zoneIdx + 1, 0, cloneWithNewId(newItems[zoneIdx]));
                newZones[zoneKey] = newItems;
                return { ...prevData, zones: newZones };
              }
            }
          }
        }

        return prevData;
      },
    });
  };

  const handleMove = (direction: "up" | "down") => {
    closeMenu();
    if (!menuState.componentId) return;
    const targetId = menuState.componentId;

    dispatch({
      type: "setData",
      data: (prevData) => {
        const moveInArray = (arr: ComponentData[]) => {
          const idx = arr.findIndex((c) => c.props?.id === targetId);
          if (idx === -1) return arr;
          const targetIdx = direction === "up" ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= arr.length) return arr;
          const updated = [...arr];
          const [moved] = updated.splice(idx, 1);
          updated.splice(targetIdx, 0, moved);
          return updated;
        };

        return {
          ...prevData,
          content: moveInArray(prevData.content || []),
          zones: prevData.zones
            ? Object.fromEntries(
                Object.entries(prevData.zones).map(([k, list]) => [
                  k,
                  Array.isArray(list) ? moveInArray(list) : list,
                ])
              )
            : prevData.zones,
        };
      },
    });
  };

  const handleDelete = () => {
    closeMenu();
    if (!menuState.componentId) return;
    const targetId = menuState.componentId;

    dispatch({
      type: "setData",
      data: (prevData) => {
        const filterArray = (arr: ComponentData[]) => arr.filter((c) => c.props?.id !== targetId);

        return {
          ...prevData,
          content: filterArray(prevData.content || []),
          zones: prevData.zones
            ? Object.fromEntries(
                Object.entries(prevData.zones).map(([k, list]) => [
                  k,
                  Array.isArray(list) ? filterArray(list) : list,
                ])
              )
            : prevData.zones,
        };
      },
    });
  };

  const handleAddBlockBelow = (type: string) => {
    closeMenu();
    const newId = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newBlock: ComponentData = {
      type,
      props: {
        id: newId,
        ...(type === "Section"
          ? defaultSectionProps
          : type === "Heading"
          ? { title: "New Heading", level: "h2", align: { base: "left" } }
          : type === "Image"
          ? { src: "", alt: "Image", width: "full", widthPercent: 100 }
          : type === "Button"
          ? { text: "Click Here", variant: "default" }
          : type === "RichText"
          ? { content: "Enter your text content here..." }
          : type === "Divider"
          ? { thickness: "1px", style: "solid" }
          : {}),
      },
    };

    dispatch({
      type: "setData",
      data: (prevData) => {
        if (!menuState.componentId) {
          return {
            ...prevData,
            content: [...(prevData.content || []), newBlock],
          };
        }

        const targetId = menuState.componentId;
        const contentIdx = (prevData.content || []).findIndex((c) => c.props?.id === targetId);
        if (contentIdx !== -1) {
          const newContent = [...(prevData.content || [])];
          newContent.splice(contentIdx + 1, 0, newBlock);
          return { ...prevData, content: newContent };
        }

        if (prevData.zones) {
          const newZones = { ...prevData.zones };
          for (const [zoneKey, items] of Object.entries(newZones)) {
            if (Array.isArray(items)) {
              const zoneIdx = items.findIndex((c) => c.props?.id === targetId);
              if (zoneIdx !== -1) {
                const newItems = [...items];
                newItems.splice(zoneIdx + 1, 0, newBlock);
                newZones[zoneKey] = newItems;
                return { ...prevData, zones: newZones };
              }
            }
          }
        }

        return {
          ...prevData,
          content: [...(prevData.content || []), newBlock],
        };
      },
    });
  };

  const Icon = getBlockIcon(compType);
  const friendlyName = getFriendlyBlockName(compType);

  return (
    <>
      {/* Floating Right-Click Context Menu */}
      {menuState.isOpen && (
        <div
          ref={menuRef}
          style={{ top: menuState.y, left: menuState.x }}
          className="fixed z-5000 min-w-[210px] max-w-[260px] bg-white rounded-xl shadow-2xl border border-slate-200/90 py-1.5 text-xs select-none backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 font-sans text-slate-800"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 mb-1 bg-slate-50/70 rounded-t-xl">
            <div className="flex items-center gap-1.5 min-w-0">
              <Icon className="size-3.5 text-navy shrink-0" />
              <span className="font-bold text-[11px] text-navy truncate">{friendlyName}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded shrink-0">
              {isInline ? "Inline" : "Block"}
            </span>
          </div>

          {/* Quick Change Image Action (Prominent) */}
          {imageFieldMeta && (
            <button
              type="button"
              onClick={handleOpenImagePicker}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 text-blue-700 font-semibold cursor-pointer transition-colors"
            >
              <ImageIcon className="size-3.5 text-blue-600 shrink-0" />
              <span>Change Image...</span>
            </button>
          )}

          {/* Quick Edit Text Action */}
          {textFieldMeta && (
            <button
              type="button"
              onClick={handleOpenTextEditor}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
            >
              <Type className="size-3.5 text-slate-500 shrink-0" />
              <span>Edit Text / Title...</span>
            </button>
          )}

          {/* Switch Display Mode (Inline vs Block) */}
          <button
            type="button"
            onClick={handleToggleDisplayMode}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="size-3.5 text-slate-500 shrink-0" />
            <span>{isInline ? "Switch to Full Width" : "Switch to Inline (Side-by-Side)"}</span>
          </button>

          {/* Quick Background Color Palette for Sections / Containers */}
          {(compType === "Section" || compType === "Hero" || compType === "CTABanner" || compType === "Callout") && (
            <div className="px-3 py-1.5 border-t border-slate-100 my-1">
              <div className="flex items-center gap-1 text-[10.5px] font-semibold text-slate-500 mb-1.5">
                <Palette className="size-3" />
                <span>Background Color</span>
              </div>
              <div className="flex items-center gap-1.5">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    onClick={() => handleChangeBgColor(swatch.value)}
                    title={swatch.name}
                    className={`size-4.5 rounded-full border ${swatch.border} ${swatch.bg} shadow-2xs hover:scale-125 transition-transform cursor-pointer`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-slate-100 my-1" />

          {/* Structural Actions */}
          <button
            type="button"
            onClick={handleDuplicate}
            className="w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Copy className="size-3.5 text-slate-500 shrink-0" />
              <span>Duplicate</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ctrl+D</span>
          </button>

          <div className="flex items-center px-1">
            <button
              type="button"
              onClick={() => handleMove("up")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1 text-slate-600 hover:bg-slate-100 rounded cursor-pointer transition-colors text-[11px]"
            >
              <ArrowUp className="size-3" />
              <span>Move Up</span>
            </button>
            <button
              type="button"
              onClick={() => handleMove("down")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1 text-slate-600 hover:bg-slate-100 rounded cursor-pointer transition-colors text-[11px]"
            >
              <ArrowDown className="size-3" />
              <span>Move Down</span>
            </button>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          {/* Quick Insert Submenu */}
          <div className="px-3 py-1">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Plus className="size-3" />
              <span>+ Add Block Below</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleAddBlockBelow("Heading")}
                className="px-1.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded text-[10.5px] font-medium transition-colors text-center"
              >
                Heading
              </button>
              <button
                type="button"
                onClick={() => handleAddBlockBelow("Image")}
                className="px-1.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded text-[10.5px] font-medium transition-colors text-center"
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => handleAddBlockBelow("Button")}
                className="px-1.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded text-[10.5px] font-medium transition-colors text-center"
              >
                Button
              </button>
              <button
                type="button"
                onClick={() => handleAddBlockBelow("RichText")}
                className="px-1.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded text-[10.5px] font-medium transition-colors text-center"
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => handleAddBlockBelow("Section")}
                className="px-1.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded text-[10.5px] font-medium transition-colors text-center"
              >
                Section
              </button>
              <button
                type="button"
                onClick={() => handleAddBlockBelow("Divider")}
                className="px-1.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded text-[10.5px] font-medium transition-colors text-center"
              >
                Divider
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          {/* Delete Action */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-red-50 text-red-600 font-medium cursor-pointer transition-colors"
          >
            <Trash2 className="size-3.5 text-red-500 shrink-0" />
            <span>Delete Block</span>
          </button>
        </div>
      )}

      {/* Quick Image Picker Modal */}
      {imageModalState.isOpen && (
        <QuickImageModal
          isOpen={imageModalState.isOpen}
          currentUrl={imageModalState.currentUrl}
          onClose={() => setImageModalState((prev) => ({ ...prev, isOpen: false }))}
          onApplyImage={(url) => {
            const targetId = imageModalState.componentId;
            const targetField = imageModalState.fieldName;

            dispatch({
              type: "setData",
              data: (prevData) => {
                const updateProps = (item: ComponentData) => {
                  if (item.props?.id === targetId) {
                    return {
                      ...item,
                      props: {
                        ...item.props,
                        [targetField]: url,
                        ...(item.type === "Section" ? { background: "image" } : {}),
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

            setImageModalState((prev) => ({ ...prev, isOpen: false }));
          }}
        />
      )}

      {/* Quick Text Editor Modal */}
      {textModalState.isOpen && (
        <QuickTextModal
          isOpen={textModalState.isOpen}
          label={textModalState.label}
          currentText={textModalState.currentText}
          onClose={() => setTextModalState((prev) => ({ ...prev, isOpen: false }))}
          onApplyText={(text) => {
            const targetId = textModalState.componentId;
            const targetField = textModalState.fieldName;

            dispatch({
              type: "setData",
              data: (prevData) => {
                const updateProps = (item: ComponentData) => {
                  if (item.props?.id === targetId) {
                    return {
                      ...item,
                      props: {
                        ...item.props,
                        [targetField]: text,
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

            setTextModalState((prev) => ({ ...prev, isOpen: false }));
          }}
        />
      )}
    </>
  );
}

/**
 * Quick Image Selection / Upload Dialog
 */
function QuickImageModal({
  isOpen,
  currentUrl,
  onClose,
  onApplyImage,
}: {
  isOpen: boolean;
  currentUrl: string;
  onClose: () => void;
  onApplyImage: (url: string) => void;
}) {
  const [selectedUrl, setSelectedUrl] = useState(currentUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const result = await uploadCmsImage({
            data: {
              fileData: base64Data,
              fileName: file.name,
              contentType: file.type,
            },
          });

          if (result && result.url) {
            setSelectedUrl(result.url);
          } else {
            setUploadError("Failed to get uploaded image URL.");
          }
        } catch (err: any) {
          setUploadError(err.message || "Failed to upload image.");
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || "Failed to read file.");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-6000 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2 text-navy font-bold text-sm">
            <ImageIcon className="size-4 text-blue-600" />
            <span>Change Image</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Image URL Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Image URL or Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or /assets/photo.jpg"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-navy focus:ring-1 focus:ring-navy outline-none"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-navy text-white hover:bg-navy/90 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isUploading ? <RefreshCw className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
          </div>

          {/* Image Preview */}
          {selectedUrl && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 flex items-center gap-3">
              <img
                src={selectedUrl}
                alt="Preview"
                className="size-16 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-800 block truncate">Selected Image Preview</span>
                <span className="text-[11px] text-slate-400 font-mono truncate block">{selectedUrl}</span>
              </div>
            </div>
          )}

          {/* Quick Presets Gallery */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">⚡ Quick Curated Presets</span>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {CURATED_IMAGE_PRESETS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setSelectedUrl(preset.url)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="size-9 rounded object-cover border border-slate-200 bg-white shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-semibold text-slate-800 truncate block">
                        {preset.name}
                      </span>
                      <span className="text-[9.5px] text-slate-400 block">{preset.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApplyImage(selectedUrl)}
            disabled={!selectedUrl}
            className="px-5 py-1.5 rounded-full bg-navy text-white text-xs font-bold hover:bg-navy/90 cursor-pointer shadow-xs disabled:opacity-50"
          >
            Apply Image
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Quick Text Editor Modal
 */
function QuickTextModal({
  isOpen,
  label,
  currentText,
  onClose,
  onApplyText,
}: {
  isOpen: boolean;
  label: string;
  currentText: string;
  onClose: () => void;
  onApplyText: (text: string) => void;
}) {
  const [textVal, setTextVal] = useState(currentText || "");

  return (
    <div className="fixed inset-0 z-6000 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col font-sans">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2 text-navy font-bold text-sm">
            <Type className="size-4 text-blue-600" />
            <span>{label}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5">
          <label className="text-xs font-bold text-slate-700 block mb-1">Enter Content</label>
          <textarea
            rows={4}
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-navy focus:ring-1 focus:ring-navy outline-none"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApplyText(textVal)}
            className="px-5 py-1.5 rounded-full bg-navy text-white text-xs font-bold hover:bg-navy/90 cursor-pointer shadow-xs"
          >
            Update Content
          </button>
        </div>
      </div>
    </div>
  );
}
