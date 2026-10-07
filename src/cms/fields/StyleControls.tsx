import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import {
  Palette,
  Box,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Sliders,
  Maximize,
  SlidersHorizontal,
} from "lucide-react";
import { useEditorMode } from "../editor-mode";
import { ColorPickerInput } from "./ColorPicker";

export interface ShadowConfig {
  preset?: "none" | "soft" | "medium" | "strong" | "custom";
  x?: number;
  y?: number;
  blur?: number;
  spread?: number;
  color?: string;
}

export interface CornerRadiusConfig {
  preset?: "none" | "sm" | "md" | "lg" | "full" | "custom";
  customPx?: number;
  topLeft?: number;
  topRight?: number;
  bottomRight?: number;
  bottomLeft?: number;
  separateCorners?: boolean;
}

export interface BorderConfig {
  style?: "none" | "solid" | "dashed" | "dotted";
  width?: number;
  color?: string;
}

export interface SpacingPresetConfig {
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "custom";
  paddingCustom?: { top?: number; right?: number; bottom?: number; left?: number };
  margin?: "none" | "sm" | "md" | "lg" | "xl" | "custom";
  marginCustom?: { top?: number; right?: number; bottom?: number; left?: number };
}

export interface StyleControlConfig {
  backgroundColor?: string;
  shadow?: ShadowConfig;
  borderRadius?: CornerRadiusConfig;
  border?: BorderConfig;
  spacing?: SpacingPresetConfig;
  opacity?: number; // 0 to 100
  applyStyleToChildren?: boolean;
}

export const SHADOW_PRESETS = {
  none: "none",
  soft: "0 2px 15px -3px rgba(15, 33, 66, 0.07), 0 4px 6px -2px rgba(15, 33, 66, 0.04)",
  medium: "0 10px 25px -5px rgba(15, 33, 66, 0.12), 0 8px 10px -6px rgba(15, 33, 66, 0.08)",
  strong: "0 20px 35px -5px rgba(15, 33, 66, 0.22), 0 10px 15px -5px rgba(15, 33, 66, 0.12)",
};

export const RADIUS_PRESETS = {
  none: "0px",
  sm: "6px",
  md: "12px",
  lg: "20px",
  full: "9999px",
};

export const SPACING_PRESETS = {
  none: "0px",
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "2rem", // 32px
  xl: "3rem", // 48px
};

/**
 * Computes React inline CSS properties from StyleControlConfig
 */
export function buildElementStyleObject(config?: StyleControlConfig): React.CSSProperties {
  if (!config) return {};

  const styles: React.CSSProperties = {};

  // 1. Background Color
  if (config.backgroundColor && config.backgroundColor !== "transparent") {
    styles.backgroundColor = config.backgroundColor;
  }

  // 2. Box Shadow
  if (config.shadow) {
    if (config.shadow.preset && config.shadow.preset !== "none") {
      if (config.shadow.preset === "custom") {
        const x = config.shadow.x || 0;
        const y = config.shadow.y || 4;
        const blur = config.shadow.blur || 12;
        const spread = config.shadow.spread || 0;
        const color = config.shadow.color || "rgba(15, 33, 66, 0.15)";
        styles.boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
      } else if (config.shadow.preset in SHADOW_PRESETS) {
        styles.boxShadow = SHADOW_PRESETS[config.shadow.preset as keyof typeof SHADOW_PRESETS];
      }
    }
  }

  // 3. Border Radius
  if (config.borderRadius) {
    if (config.borderRadius.separateCorners) {
      const tl = config.borderRadius.topLeft ?? 0;
      const tr = config.borderRadius.topRight ?? 0;
      const br = config.borderRadius.bottomRight ?? 0;
      const bl = config.borderRadius.bottomLeft ?? 0;
      styles.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
    } else if (config.borderRadius.preset) {
      if (config.borderRadius.preset === "custom" && typeof config.borderRadius.customPx === "number") {
        styles.borderRadius = `${config.borderRadius.customPx}px`;
      } else if (config.borderRadius.preset in RADIUS_PRESETS) {
        styles.borderRadius = RADIUS_PRESETS[config.borderRadius.preset as keyof typeof RADIUS_PRESETS];
      }
    }
  }

  // 4. Border
  if (config.border && config.border.style && config.border.style !== "none") {
    styles.borderStyle = config.border.style;
    styles.borderWidth = `${config.border.width || 1}px`;
    styles.borderColor = config.border.color || "rgba(15, 33, 66, 0.15)";
  }

  // 5. Padding & Margin
  if (config.spacing) {
    // Padding
    if (config.spacing.padding) {
      if (config.spacing.padding === "custom" && config.spacing.paddingCustom) {
        const p = config.spacing.paddingCustom;
        styles.padding = `${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px`;
      } else if (config.spacing.padding in SPACING_PRESETS) {
        styles.padding = SPACING_PRESETS[config.spacing.padding as keyof typeof SPACING_PRESETS];
      }
    }
    // Margin
    if (config.spacing.margin) {
      if (config.spacing.margin === "custom" && config.spacing.marginCustom) {
        const m = config.spacing.marginCustom;
        styles.margin = `${m.top || 0}px ${m.right || 0}px ${m.bottom || 0}px ${m.left || 0}px`;
      } else if (config.spacing.margin in SPACING_PRESETS) {
        styles.margin = SPACING_PRESETS[config.spacing.margin as keyof typeof SPACING_PRESETS];
      }
    }
  }

  // 6. Opacity
  if (typeof config.opacity === "number" && config.opacity >= 0 && config.opacity < 100) {
    styles.opacity = config.opacity / 100;
  }

  return styles;
}

/**
 * Computes child card/item styles when applyStyleToChildren is enabled
 */
export function buildElementCardStyleObject(config?: StyleControlConfig): React.CSSProperties {
  if (!config || !config.applyStyleToChildren) return {};

  const styles: React.CSSProperties = {};

  if (config.backgroundColor && config.backgroundColor !== "transparent") {
    styles.backgroundColor = config.backgroundColor;
  }

  if (config.shadow?.preset && config.shadow.preset !== "none") {
    if (config.shadow.preset === "custom") {
      const x = config.shadow.x || 0;
      const y = config.shadow.y || 4;
      const blur = config.shadow.blur || 12;
      const spread = config.shadow.spread || 0;
      const color = config.shadow.color || "rgba(15, 33, 66, 0.15)";
      styles.boxShadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
    } else if (config.shadow.preset in SHADOW_PRESETS) {
      styles.boxShadow = SHADOW_PRESETS[config.shadow.preset as keyof typeof SHADOW_PRESETS];
    }
  }

  if (config.borderRadius) {
    if (config.borderRadius.separateCorners) {
      const tl = config.borderRadius.topLeft ?? 0;
      const tr = config.borderRadius.topRight ?? 0;
      const br = config.borderRadius.bottomRight ?? 0;
      const bl = config.borderRadius.bottomLeft ?? 0;
      styles.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
    } else if (config.borderRadius.preset) {
      if (config.borderRadius.preset === "custom" && typeof config.borderRadius.customPx === "number") {
        styles.borderRadius = `${config.borderRadius.customPx}px`;
      } else if (config.borderRadius.preset in RADIUS_PRESETS) {
        styles.borderRadius = RADIUS_PRESETS[config.borderRadius.preset as keyof typeof RADIUS_PRESETS];
      }
    }
  }

  if (config.border && config.border.style && config.border.style !== "none") {
    styles.borderStyle = config.border.style;
    styles.borderWidth = `${config.border.width || 1}px`;
    styles.borderColor = config.border.color || "rgba(15, 33, 66, 0.15)";
  }

  return styles;
}

export function StyleControlsInput({
  value,
  onChange,
  readOnly = false,
  label = "Style & Appearance",
  showApplyToChildren = false,
}: {
  value?: StyleControlConfig;
  onChange: (val: StyleControlConfig) => void;
  readOnly?: boolean;
  label?: string;
  showApplyToChildren?: boolean;
}) {
  const [mode] = useEditorMode();
  const [isOpen, setIsOpen] = React.useState(false);

  const cfg: StyleControlConfig = value || {};

  const update = (patch: Partial<StyleControlConfig>) => {
    onChange({
      ...cfg,
      ...patch,
    });
  };

  const updateShadow = (patch: Partial<ShadowConfig>) => {
    update({ shadow: { ...(cfg.shadow || {}), ...patch } });
  };

  const updateRadius = (patch: Partial<CornerRadiusConfig>) => {
    update({ borderRadius: { ...(cfg.borderRadius || {}), ...patch } });
  };

  const updateBorder = (patch: Partial<BorderConfig>) => {
    update({ border: { ...(cfg.border || {}), ...patch } });
  };

  const updateSpacing = (patch: Partial<SpacingPresetConfig>) => {
    update({ spacing: { ...(cfg.spacing || {}), ...patch } });
  };

  const hasCustomStyles =
    Boolean(cfg.backgroundColor) ||
    Boolean(cfg.shadow?.preset && cfg.shadow.preset !== "none") ||
    Boolean(cfg.borderRadius?.preset && cfg.borderRadius.preset !== "none") ||
    Boolean(cfg.border?.style && cfg.border.style !== "none") ||
    Boolean(cfg.spacing?.padding && cfg.spacing.padding !== "none") ||
    Boolean(cfg.spacing?.margin && cfg.spacing.margin !== "none") ||
    Boolean(typeof cfg.opacity === "number" && cfg.opacity < 100);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden my-2 transition-all duration-150">
      {/* Accordion Header */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 text-left transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Palette className="size-4 text-navy" />
          <span className="text-xs font-bold text-navy">{label}</span>
          {hasCustomStyles && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Styled
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

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-3.5 space-y-4 border-t border-slate-200 bg-white text-xs">
          {/* Multi-Item Container Toggle */}
          {showApplyToChildren && (
            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy block">Apply style to all items</span>
                <span className="text-[10px] text-slate-600 block">
                  Every child card/item inherits background, shadow and radius.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={readOnly}
                checked={Boolean(cfg.applyStyleToChildren)}
                onChange={(e) => update({ applyStyleToChildren: e.target.checked })}
                className="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer"
              />
            </div>
          )}

          {/* 1. Background Color */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
              Background Color
            </span>
            <ColorPickerInput
              value={cfg.backgroundColor}
              onChange={(color) => update({ backgroundColor: color })}
              readOnly={readOnly}
              label="Background Color"
            />
          </div>

          {/* 2. Box Shadow */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Box Shadow
              </span>
              <span className="text-[10px] font-mono text-slate-500 capitalize">
                {cfg.shadow?.preset || "none"}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {[
                { label: "None", value: "none" },
                { label: "Soft", value: "soft" },
                { label: "Medium", value: "medium" },
                { label: "Strong", value: "strong" },
                { label: "Custom", value: "custom" },
              ].map((s) => {
                const isSelected = (cfg.shadow?.preset || "none") === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => updateShadow({ preset: s.value as any })}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy text-white border-navy shadow-xs font-bold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Shadow Inputs in Advanced Mode */}
            {cfg.shadow?.preset === "custom" && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-600 block">X Offset (px)</label>
                    <input
                      type="number"
                      value={cfg.shadow?.x ?? 0}
                      onChange={(e) => updateShadow({ x: Number(e.target.value) })}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">Y Offset (px)</label>
                    <input
                      type="number"
                      value={cfg.shadow?.y ?? 4}
                      onChange={(e) => updateShadow({ y: Number(e.target.value) })}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">Blur (px)</label>
                    <input
                      type="number"
                      value={cfg.shadow?.blur ?? 12}
                      onChange={(e) => updateShadow({ blur: Number(e.target.value) })}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block">Spread (px)</label>
                    <input
                      type="number"
                      value={cfg.shadow?.spread ?? 0}
                      onChange={(e) => updateShadow({ spread: Number(e.target.value) })}
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Corner Radius */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Corner Radius
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {cfg.borderRadius?.preset === "custom"
                  ? `${cfg.borderRadius?.customPx || 12}px`
                  : cfg.borderRadius?.preset || "none"}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1">
              {[
                { label: "0", value: "none" },
                { label: "SM (6px)", value: "sm" },
                { label: "MD (12px)", value: "md" },
                { label: "LG (20px)", value: "lg" },
                { label: "Full", value: "full" },
                { label: "Px", value: "custom" },
              ].map((r) => {
                const isSelected = (cfg.borderRadius?.preset || "none") === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => updateRadius({ preset: r.value as any })}
                    className={`py-1.5 px-0.5 rounded-lg text-[11px] font-semibold border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy text-white border-navy shadow-xs font-bold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {cfg.borderRadius?.preset === "custom" && (
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="2"
                  value={cfg.borderRadius?.customPx || 12}
                  onChange={(e) => updateRadius({ customPx: Number(e.target.value) })}
                  className="flex-1 accent-navy cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={cfg.borderRadius?.customPx || 12}
                    onChange={(e) => updateRadius({ customPx: Number(e.target.value) })}
                    className="w-14 rounded-md border border-slate-300 px-1.5 py-1 text-xs text-center text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">px</span>
                </div>
              </div>
            )}

            {mode === "advanced" && (
              <div className="pt-1">
                <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(cfg.borderRadius?.separateCorners)}
                    onChange={(e) => updateRadius({ separateCorners: e.target.checked })}
                    className="size-3.5 rounded border-slate-300 text-navy"
                  />
                  <span>Set each corner separately</span>
                </label>

                {cfg.borderRadius?.separateCorners && (
                  <div className="grid grid-cols-4 gap-1.5 pt-2">
                    {([
                      { label: "Top Left", key: "topLeft" },
                      { label: "Top Right", key: "topRight" },
                      { label: "Bottom Right", key: "bottomRight" },
                      { label: "Bottom Left", key: "bottomLeft" },
                    ] as const).map(({ label, key }) => (
                      <div key={key}>
                        <label className="text-[9px] text-slate-500 block truncate">{label}</label>
                        <input
                          type="number"
                          min="0"
                          max="80"
                          value={cfg.borderRadius?.[key] ?? 12}
                          onChange={(e) => updateRadius({ [key]: Number(e.target.value) })}
                          className="w-full rounded border border-slate-300 px-1.5 py-1 text-xs text-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Border (Style, Thickness & Color) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
              Border Outline
            </span>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: "None", value: "none" },
                { label: "Solid", value: "solid" },
                { label: "Dashed", value: "dashed" },
                { label: "Dotted", value: "dotted" },
              ].map((b) => {
                const isSelected = (cfg.border?.style || "none") === b.value;
                return (
                  <button
                    key={b.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => updateBorder({ style: b.value as any })}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy text-white border-navy shadow-xs font-bold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>

            {cfg.border?.style && cfg.border.style !== "none" && (
              <div className="space-y-2.5 pt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-600">Border Thickness</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 8].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => updateBorder({ width: w })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          (cfg.border?.width || 1) === w
                            ? "bg-navy text-white border-navy"
                            : "bg-white text-slate-700 border-slate-300"
                        }`}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-600 block mb-1">Border Color</span>
                  <ColorPickerInput
                    value={cfg.border?.color || "#e2e8f0"}
                    onChange={(c) => updateBorder({ color: c })}
                    readOnly={readOnly}
                    label="Border Color"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Padding & Margin Presets */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
              Inner Padding & Outer Spacing
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Inner Padding
                </label>
                <select
                  disabled={readOnly}
                  value={cfg.spacing?.padding || "none"}
                  onChange={(e) => updateSpacing({ padding: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                >
                  <option value="none">None (0)</option>
                  <option value="sm">Small (8px)</option>
                  <option value="md">Medium (16px)</option>
                  <option value="lg">Large (32px)</option>
                  <option value="xl">Extra Large (48px)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Outer Margin
                </label>
                <select
                  disabled={readOnly}
                  value={cfg.spacing?.margin || "none"}
                  onChange={(e) => updateSpacing({ margin: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                >
                  <option value="none">None (0)</option>
                  <option value="sm">Small (8px)</option>
                  <option value="md">Medium (16px)</option>
                  <option value="lg">Large (32px)</option>
                  <option value="xl">Extra Large (48px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. Opacity Slider */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Opacity</span>
              <span className="font-mono text-slate-600">{cfg.opacity ?? 100}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              disabled={readOnly}
              value={cfg.opacity ?? 100}
              onChange={(e) => update({ opacity: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-navy"
            />
          </div>

          {/* One-Click Reset Style Button */}
          {hasCustomStyles && (
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange({})}
                className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-red-600 font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset Style to Default</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Creates a Puck custom field for Universal Element Styling.
 */
export function createStyleControlsField(options: {
  label?: string;
  showApplyToChildren?: boolean;
} = {}): CustomField<StyleControlConfig> {
  return {
    type: "custom",
    label: options.label || "Style & Appearance",
    render: ({ value, onChange, readOnly }) => (
      <StyleControlsInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={options.label}
        showApplyToChildren={options.showApplyToChildren}
      />
    ),
  };
}

export default createStyleControlsField;
