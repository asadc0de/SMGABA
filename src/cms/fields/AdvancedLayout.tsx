import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { ChevronDown, ChevronRight, LayoutGrid, Rows3, Columns3, AlignHorizontalDistributeCenter, Layers } from "lucide-react";

export interface AdvancedLayoutConfig {
  display?: "inline" | "block" | "flex" | "grid";
  // Flex options
  flexDirection?: "row" | "column";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
  alignItems?: "start" | "center" | "end" | "stretch";
  flexWrap?: boolean;
  flexGap?: "none" | "sm" | "md" | "lg" | "xl";
  // Grid options
  gridColumnsDesktop?: "1" | "2" | "3" | "4" | "5" | "6";
  gridColumnsTablet?: "1" | "2" | "3" | "4";
  gridColumnsMobile?: "1" | "2";
  gridGap?: "none" | "sm" | "md" | "lg" | "xl";
  gridAlignItems?: "start" | "center" | "end" | "stretch";
}

export const DEFAULT_ADVANCED_LAYOUT: AdvancedLayoutConfig = {
  display: "block",
  flexDirection: "row",
  justifyContent: "start",
  alignItems: "stretch",
  flexWrap: true,
  flexGap: "md",
  gridColumnsDesktop: "3",
  gridColumnsTablet: "2",
  gridColumnsMobile: "1",
  gridGap: "md",
  gridAlignItems: "stretch",
};

/**
 * Helper to compute responsive Tailwind classes from AdvancedLayoutConfig
 */
export function buildAdvancedLayoutClasses(config?: AdvancedLayoutConfig): string {
  if (!config || !config.display) return "";

  const classes: string[] = [];

  switch (config.display) {
    case "inline":
      classes.push("inline-flex items-center");
      break;

    case "block":
      classes.push("block w-full");
      break;

    case "flex": {
      classes.push("flex");

      // Direction
      if (config.flexDirection === "column") {
        classes.push("flex-col");
      } else {
        classes.push("flex-row");
      }

      // Wrap
      if (config.flexWrap) {
        classes.push("flex-wrap");
      } else {
        classes.push("flex-nowrap");
      }

      // Justify Content
      switch (config.justifyContent) {
        case "center":
          classes.push("justify-center");
          break;
        case "end":
          classes.push("justify-end");
          break;
        case "between":
          classes.push("justify-between");
          break;
        case "around":
          classes.push("justify-around");
          break;
        case "start":
        default:
          classes.push("justify-start");
          break;
      }

      // Align Items
      switch (config.alignItems) {
        case "start":
          classes.push("items-start");
          break;
        case "center":
          classes.push("items-center");
          break;
        case "end":
          classes.push("items-end");
          break;
        case "stretch":
        default:
          classes.push("items-stretch");
          break;
      }

      // Flex Gap
      switch (config.flexGap) {
        case "none":
          classes.push("gap-0");
          break;
        case "sm":
          classes.push("gap-2 sm:gap-3");
          break;
        case "lg":
          classes.push("gap-6 sm:gap-8");
          break;
        case "xl":
          classes.push("gap-8 sm:gap-12");
          break;
        case "md":
        default:
          classes.push("gap-4 sm:gap-6");
          break;
      }
      break;
    }

    case "grid": {
      classes.push("grid");

      // Mobile columns
      if (config.gridColumnsMobile === "2") {
        classes.push("grid-cols-2");
      } else {
        classes.push("grid-cols-1");
      }

      // Tablet columns
      switch (config.gridColumnsTablet) {
        case "1":
          classes.push("md:grid-cols-1");
          break;
        case "3":
          classes.push("md:grid-cols-3");
          break;
        case "4":
          classes.push("md:grid-cols-4");
          break;
        case "2":
        default:
          classes.push("md:grid-cols-2");
          break;
      }

      // Desktop columns
      switch (config.gridColumnsDesktop) {
        case "1":
          classes.push("lg:grid-cols-1");
          break;
        case "2":
          classes.push("lg:grid-cols-2");
          break;
        case "4":
          classes.push("lg:grid-cols-4");
          break;
        case "5":
          classes.push("lg:grid-cols-5");
          break;
        case "6":
          classes.push("lg:grid-cols-6");
          break;
        case "3":
        default:
          classes.push("lg:grid-cols-3");
          break;
      }

      // Grid Gap
      switch (config.gridGap) {
        case "none":
          classes.push("gap-0");
          break;
        case "sm":
          classes.push("gap-3 sm:gap-4");
          break;
        case "lg":
          classes.push("gap-6 sm:gap-8");
          break;
        case "xl":
          classes.push("gap-8 sm:gap-12");
          break;
        case "md":
        default:
          classes.push("gap-4 sm:gap-6");
          break;
      }

      // Grid Align Items
      switch (config.gridAlignItems) {
        case "start":
          classes.push("items-start");
          break;
        case "center":
          classes.push("items-center");
          break;
        case "end":
          classes.push("items-end");
          break;
        case "stretch":
        default:
          classes.push("items-stretch");
          break;
      }
      break;
    }
  }

  return classes.join(" ");
}

export interface AdvancedLayoutFieldProps {
  value?: AdvancedLayoutConfig;
  onChange: (value: AdvancedLayoutConfig) => void;
  readOnly?: boolean;
  defaultDisplay?: "inline" | "block" | "flex" | "grid";
}

import { useEditorMode } from "../editor-mode";

export function AdvancedLayoutInput({
  value,
  onChange,
  readOnly = false,
  defaultDisplay = "block",
}: AdvancedLayoutFieldProps) {
  const [mode, setMode] = useEditorMode();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const cfg: AdvancedLayoutConfig = {
    ...DEFAULT_ADVANCED_LAYOUT,
    display: defaultDisplay,
    ...(value || {}),
  };

  const update = (patch: Partial<AdvancedLayoutConfig>) => {
    onChange({
      ...cfg,
      ...patch,
    });
  };

  const isCustomized = Boolean(value && value.display && value.display !== defaultDisplay);

  return (
    <div
      data-cms-advanced-field="true"
      className="border border-slate-200 rounded-xl bg-white overflow-hidden my-2 shadow-2xs"
    >
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left select-none cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Layers className="size-3.5 text-navy" />
          <span className="text-xs font-bold text-slate-800">Advanced Layout</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold uppercase">
            {cfg.display}
          </span>
          {mode === "simple" && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Advanced
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {isOpen ? (
            <ChevronDown className="size-4 text-slate-500" />
          ) : (
            <ChevronRight className="size-4 text-slate-500" />
          )}
        </div>
      </button>

      {/* Expanded Controls */}
      {isOpen && (
        <div className="p-3.5 space-y-3.5 border-t border-slate-200 text-xs bg-white animate-in fade-in-50 duration-150">
          {/* Display Mode Selector with Human Plain English Descriptions */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
              Container Display Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => update({ display: "block" })}
                className={`flex flex-col p-2 rounded-lg border text-left transition-all ${
                  cfg.display === "block"
                    ? "bg-navy text-white border-navy shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Rows3 className="size-3.5" />
                  <span>Block</span>
                </div>
                <span className={`text-[10px] mt-0.5 ${cfg.display === "block" ? "text-slate-200" : "text-slate-500"}`}>
                  Full row (stacked)
                </span>
              </button>

              <button
                type="button"
                disabled={readOnly}
                onClick={() => update({ display: "flex" })}
                className={`flex flex-col p-2 rounded-lg border text-left transition-all ${
                  cfg.display === "flex"
                    ? "bg-navy text-white border-navy shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Columns3 className="size-3.5" />
                  <span>Flex</span>
                </div>
                <span className={`text-[10px] mt-0.5 ${cfg.display === "flex" ? "text-slate-200" : "text-slate-500"}`}>
                  Flexible row / column
                </span>
              </button>

              <button
                type="button"
                disabled={readOnly}
                onClick={() => update({ display: "grid" })}
                className={`flex flex-col p-2 rounded-lg border text-left transition-all ${
                  cfg.display === "grid"
                    ? "bg-navy text-white border-navy shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <LayoutGrid className="size-3.5" />
                  <span>Grid</span>
                </div>
                <span className={`text-[10px] mt-0.5 ${cfg.display === "grid" ? "text-slate-200" : "text-slate-500"}`}>
                  Rows and columns
                </span>
              </button>

              <button
                type="button"
                disabled={readOnly}
                onClick={() => update({ display: "inline" })}
                className={`flex flex-col p-2 rounded-lg border text-left transition-all ${
                  cfg.display === "inline"
                    ? "bg-navy text-white border-navy shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <AlignHorizontalDistributeCenter className="size-3.5" />
                  <span>Inline</span>
                </div>
                <span className={`text-[10px] mt-0.5 ${cfg.display === "inline" ? "text-slate-200" : "text-slate-500"}`}>
                  Side by side with text
                </span>
              </button>
            </div>
          </div>

          {/* Flex Options Panel */}
          {cfg.display === "flex" && (
            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-navy block uppercase tracking-wider">
                Flexbox Configuration
              </span>

              {/* Direction */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Direction
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => update({ flexDirection: "row" })}
                    className={`py-1 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      cfg.flexDirection === "row"
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Row (Horizontal)
                  </button>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => update({ flexDirection: "column" })}
                    className={`py-1 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      cfg.flexDirection === "column"
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Column (Vertical)
                  </button>
                </div>
              </div>

              {/* Justify Content */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Horizontal Justification (justify-content)
                </label>
                <select
                  disabled={readOnly}
                  value={cfg.justifyContent || "start"}
                  onChange={(e) => update({ justifyContent: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                >
                  <option value="start">Start (Left / Top)</option>
                  <option value="center">Center</option>
                  <option value="end">End (Right / Bottom)</option>
                  <option value="between">Space Between (Spread to edges)</option>
                  <option value="around">Space Around (Equal margins)</option>
                </select>
              </div>

              {/* Align Items */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Cross-Axis Alignment (align-items)
                </label>
                <select
                  disabled={readOnly}
                  value={cfg.alignItems || "stretch"}
                  onChange={(e) => update({ alignItems: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                >
                  <option value="stretch">Stretch (Fill container height)</option>
                  <option value="start">Start (Top)</option>
                  <option value="center">Center (Middle)</option>
                  <option value="end">End (Bottom)</option>
                </select>
              </div>

              {/* Gap Spacing & Wrap */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Spacing Gap
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.flexGap || "md"}
                    onChange={(e) => update({ flexGap: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="none">None (0px)</option>
                    <option value="sm">Small (8px)</option>
                    <option value="md">Medium (16px)</option>
                    <option value="lg">Large (24px)</option>
                    <option value="xl">Extra Large (32px)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Wrap Items
                  </label>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => update({ flexWrap: !cfg.flexWrap })}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      cfg.flexWrap
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {cfg.flexWrap ? "Wrap (On)" : "Single Line (Off)"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid Options Panel */}
          {cfg.display === "grid" && (
            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-navy block uppercase tracking-wider">
                Grid Columns & Alignment
              </span>

              {/* Responsive Columns */}
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    Desktop
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.gridColumnsDesktop || "3"}
                    onChange={(e) => update({ gridColumnsDesktop: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="1">1 Col</option>
                    <option value="2">2 Cols</option>
                    <option value="3">3 Cols</option>
                    <option value="4">4 Cols</option>
                    <option value="5">5 Cols</option>
                    <option value="6">6 Cols</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    Tablet
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.gridColumnsTablet || "2"}
                    onChange={(e) => update({ gridColumnsTablet: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="1">1 Col</option>
                    <option value="2">2 Cols</option>
                    <option value="3">3 Cols</option>
                    <option value="4">4 Cols</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                    Phone
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.gridColumnsMobile || "1"}
                    onChange={(e) => update({ gridColumnsMobile: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="1">1 Col</option>
                    <option value="2">2 Cols</option>
                  </select>
                </div>
              </div>

              {/* Grid Gap & Align Items */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Grid Gap
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.gridGap || "md"}
                    onChange={(e) => update({ gridGap: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="none">None (0px)</option>
                    <option value="sm">Small (12px)</option>
                    <option value="md">Medium (20px)</option>
                    <option value="lg">Large (32px)</option>
                    <option value="xl">Extra Large (48px)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Align Items
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.gridAlignItems || "stretch"}
                    onChange={(e) => update({ gridAlignItems: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="stretch">Stretch (Equal height)</option>
                    <option value="start">Start (Top)</option>
                    <option value="center">Center (Middle)</option>
                    <option value="end">End (Bottom)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Creates a Puck custom field for Advanced Layout configuration.
 */
export function createAdvancedLayoutField(options: {
  defaultDisplay?: "inline" | "block" | "flex" | "grid";
} = {}): CustomField<AdvancedLayoutConfig> {
  return {
    type: "custom",
    label: "Advanced Layout",
    render: ({ value, onChange, readOnly }) => (
      <AdvancedLayoutInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        defaultDisplay={options.defaultDisplay}
      />
    ),
  };
}

export default createAdvancedLayoutField;
