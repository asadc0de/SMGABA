import * as React from "react";
import { type CustomField } from "@puckeditor/core";
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
  soft: "0 2px 8px -2px rgba(15, 33, 66, 0.08), 0 1px 4px -1px rgba(15, 33, 66, 0.04)",
  medium: "0 10px 25px -5px rgba(15, 33, 66, 0.12), 0 8px 10px -6px rgba(15, 33, 66, 0.08)",
  strong: "0 20px 35px -5px rgba(15, 33, 66, 0.2), 0 10px 15px -5px rgba(15, 33, 66, 0.1)",
  custom: "",
};

export const RADIUS_PRESETS = {
  none: "0px",
  sm: "6px",
  md: "12px",
  lg: "20px",
  full: "9999px",
  custom: "",
};

export const SPACING_PRESETS = {
  none: "0px",
  sm: "12px",
  md: "24px",
  lg: "48px",
  xl: "80px",
  custom: "",
};

/**
 * Computes React inline CSS styles from StyleControlConfig
 */
export function buildStyleControlsObject(config?: StyleControlConfig): React.CSSProperties {
  if (!config) return {};

  const styles: React.CSSProperties = {};

  // 1. Background Color
  if (config.backgroundColor && config.backgroundColor !== "transparent") {
    styles.backgroundColor = config.backgroundColor;
  }

  // 2. Box Shadow
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
    if (config.spacing.padding && config.spacing.padding in SPACING_PRESETS) {
      styles.padding = SPACING_PRESETS[config.spacing.padding as keyof typeof SPACING_PRESETS];
    }
    if (config.spacing.margin && config.spacing.margin in SPACING_PRESETS) {
      styles.margin = SPACING_PRESETS[config.spacing.margin as keyof typeof SPACING_PRESETS];
    }
  }

  // 6. Opacity
  if (typeof config.opacity === "number" && config.opacity >= 0 && config.opacity < 100) {
    styles.opacity = config.opacity / 100;
  }

  return styles;
}

export function buildElementCardStyleObject(config?: StyleControlConfig): React.CSSProperties {
  if (!config || !config.applyStyleToChildren) return {};
  return buildStyleControlsObject(config);
}

export const buildElementStyleObject = buildStyleControlsObject;

/**
 * Ultra-clean, flat StyleControls input matching the 8px grid and segmented button standards
 */
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

  return (
    <div className="w-full space-y-3 text-[13px]">
      {/* 1. Background Color Swatches Row */}
      <ColorPickerInput
        value={cfg.backgroundColor}
        onChange={(color) => update({ backgroundColor: color })}
        readOnly={readOnly}
        label="Card Background"
      />

      {/* 2. Shadow Segmented Control */}
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        <span className="text-[13px] font-medium text-slate-700">Shadow</span>
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {[
            { label: "None", value: "none" },
            { label: "Soft", value: "soft" },
            { label: "Med", value: "medium" },
            { label: "Strong", value: "strong" },
          ].map((s) => {
            const isSelected = (cfg.shadow?.preset || "none") === s.value;
            return (
              <button
                key={s.value}
                type="button"
                disabled={readOnly}
                onClick={() => updateShadow({ preset: s.value as any })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-[#0f2142] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Corner Radius Segmented Control */}
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        <span className="text-[13px] font-medium text-slate-700">Corners</span>
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {[
            { label: "0", value: "none" },
            { label: "S", value: "sm" },
            { label: "M", value: "md" },
            { label: "L", value: "lg" },
            { label: "Full", value: "full" },
          ].map((r) => {
            const isSelected = (cfg.borderRadius?.preset || "none") === r.value;
            return (
              <button
                key={r.value}
                type="button"
                disabled={readOnly}
                onClick={() => updateRadius({ preset: r.value as any })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-[#0f2142] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Border Segmented Control */}
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        <span className="text-[13px] font-medium text-slate-700">Border</span>
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
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
                className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-[#0f2142] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Opacity Slider + Numeric Input Row */}
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        <span className="text-[13px] font-medium text-slate-700">Opacity</span>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            disabled={readOnly}
            value={typeof cfg.opacity === "number" ? cfg.opacity : 100}
            onChange={(e) => update({ opacity: Number(e.target.value) })}
            className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0f2142]"
          />
          <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden">
            <input
              type="number"
              min={0}
              max={100}
              disabled={readOnly}
              value={typeof cfg.opacity === "number" ? cfg.opacity : 100}
              onChange={(e) => update({ opacity: Number(e.target.value) })}
              className="w-10 px-1 py-0.5 text-[12px] font-mono text-slate-800 outline-none text-right"
            />
            <span className="bg-slate-50 border-l border-slate-200 px-1 py-0.5 text-[11px] font-medium text-slate-500">
              %
            </span>
          </div>
        </div>
      </div>

      {/* Optional: Apply style to children toggle */}
      {showApplyToChildren && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-slate-600">Apply to all child items</span>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ applyStyleToChildren: !cfg.applyStyleToChildren })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              cfg.applyStyleToChildren ? "bg-[#0f2142]" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                cfg.applyStyleToChildren ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export function createStyleControlsField(options: {
  label?: string;
  showApplyToChildren?: boolean;
} = {}): CustomField<StyleControlConfig> {
  const { label = "Style & Appearance", showApplyToChildren = false } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <StyleControlsInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
        showApplyToChildren={showApplyToChildren}
      />
    ),
  };
}

export default createStyleControlsField;
