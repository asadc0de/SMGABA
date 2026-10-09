import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  Info,
} from "lucide-react";

export interface TypographyConfig {
  fontFamily?: "sans" | "serif" | "outfit" | "poppins" | "mono" | "inherit";
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "custom";
  fontSizeMode?: "preset" | "pixel";
  customFontSizePx?: number;
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  italic?: boolean;
  underline?: boolean;
  lineHeight?: "tight" | "snug" | "normal" | "relaxed" | "loose";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  textAlign?: "left" | "center" | "right" | "justify";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}

export const FONT_FAMILY_MAP = {
  sans: {
    label: "Brand Sans (Inter)",
    css: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  serif: {
    label: "Editorial Serif",
    css: "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif",
  },
  outfit: {
    label: "Outfit Sans",
    css: "'Outfit', ui-sans-serif, system-ui, sans-serif",
  },
  poppins: {
    label: "Poppins Clean",
    css: "'Poppins', ui-sans-serif, system-ui, sans-serif",
  },
  mono: {
    label: "Monospace",
    css: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  inherit: {
    label: "Inherit Font",
    css: "inherit",
  },
};

export const FONT_SIZE_MAP = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
};

export const FONT_WEIGHT_MAP = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

/**
 * Converts TypographyConfig into inline CSS styles.
 */
export function buildTypographyStyles(config?: TypographyConfig): React.CSSProperties {
  if (!config) return {};

  const styles: React.CSSProperties = {};

  // Font family
  if (config.fontFamily && config.fontFamily !== "inherit") {
    styles.fontFamily = FONT_FAMILY_MAP[config.fontFamily]?.css || undefined;
  }

  // Font size
  if (
    typeof config.customFontSizePx === "number" &&
    config.customFontSizePx > 0 &&
    (config.fontSize === "custom" || config.fontSizeMode === "pixel" || !config.fontSize)
  ) {
    styles.fontSize = `${config.customFontSizePx}px`;
  } else if (config.fontSize && config.fontSize !== "custom") {
    styles.fontSize = FONT_SIZE_MAP[config.fontSize] || undefined;
  }

  // Font weight
  if (config.fontWeight) {
    styles.fontWeight = FONT_WEIGHT_MAP[config.fontWeight] || undefined;
  }

  // Italic
  if (config.italic) {
    styles.fontStyle = "italic";
  }

  // Underline
  if (config.underline) {
    styles.textDecoration = "underline";
  }

  // Text align
  if (config.textAlign) {
    styles.textAlign = config.textAlign;
  }

  // Text transform
  if (config.textTransform && config.textTransform !== "none") {
    styles.textTransform = config.textTransform;
  }

  return styles;
}

export interface TypographyInputProps {
  value?: TypographyConfig;
  onChange: (value: TypographyConfig) => void;
  readOnly?: boolean;
  label?: string;
}

/**
 * Compact, single-panel Typography control with segmented style icon buttons & clean inputs
 */
export function TypographyInput({
  value = {},
  onChange,
  readOnly = false,
  label = "Typography",
}: TypographyInputProps) {
  const cfg = value || {};

  const update = (patch: Partial<TypographyConfig>) => {
    onChange({
      ...cfg,
      ...patch,
    });
  };

  const isBold = cfg.fontWeight === "bold" || cfg.fontWeight === "extrabold";

  return (
    <div className="w-full space-y-2 text-[13px]">
      {/* 1. Font Family & Font Weight Row */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11.5px] font-medium text-slate-600 block mb-1">Font Family</label>
          <select
            disabled={readOnly}
            value={cfg.fontFamily || "sans"}
            onChange={(e) => update({ fontFamily: e.target.value as any })}
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
          >
            <option value="sans">Brand Sans (Inter)</option>
            <option value="serif">Editorial Serif</option>
            <option value="outfit">Outfit Display</option>
            <option value="poppins">Poppins Clean</option>
            <option value="mono">Monospace</option>
          </select>
        </div>

        <div>
          <label className="text-[11.5px] font-medium text-slate-600 block mb-1">Weight</label>
          <select
            disabled={readOnly}
            value={cfg.fontWeight || "normal"}
            onChange={(e) => update({ fontWeight: e.target.value as any })}
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-[12px] text-slate-800 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
          >
            <option value="normal">Normal (400)</option>
            <option value="medium">Medium (500)</option>
            <option value="semibold">Semibold (600)</option>
            <option value="bold">Bold (700)</option>
            <option value="extrabold">Extra Bold (800)</option>
          </select>
        </div>
      </div>

      {/* 2. Text Style & Alignment Icons Row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
        {/* Style Icon Buttons: Bold, Italic, Underline, Uppercase */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ fontWeight: isBold ? "normal" : "bold" })}
            title="Bold"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              isBold
                ? "bg-white text-[#0f2142] shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bold className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ italic: !cfg.italic })}
            title="Italic"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              cfg.italic
                ? "bg-white text-[#0f2142] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Italic className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ underline: !cfg.underline })}
            title="Underline"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              cfg.underline
                ? "bg-white text-[#0f2142] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Underline className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ textTransform: cfg.textTransform === "uppercase" ? "none" : "uppercase" })}
            title="Uppercase (ALL CAPS)"
            className={`px-1.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              cfg.textTransform === "uppercase"
                ? "bg-white text-[#0f2142] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            TT
          </button>
        </div>

        {/* Alignment Segmented Icons: Left, Center, Right */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ textAlign: "left" })}
            title="Align Left"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              (cfg.textAlign || "left") === "left"
                ? "bg-white text-[#0f2142] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlignLeft className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ textAlign: "center" })}
            title="Align Center"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              cfg.textAlign === "center"
                ? "bg-white text-[#0f2142] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlignCenter className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ textAlign: "right" })}
            title="Align Right"
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              cfg.textAlign === "right"
                ? "bg-white text-[#0f2142] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlignRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact explicit Font Size in pixels
 */
export function FontSizePixelInput({
  value,
  onChange,
  readOnly = false,
  label = "Font Size",
  min = 10,
  max = 96,
  defaultValue = 16,
}: {
  value?: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
  label?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
}) {
  const currentVal = typeof value === "number" && value > 0 ? value : defaultValue;

  return (
    <div className="w-full flex items-center justify-between gap-2 min-h-[32px] text-[13px]">
      <span className="text-[13px] font-medium text-slate-700 truncate" title={label}>
        {label}
      </span>

      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-[#0f2142] focus-within:ring-1 focus-within:ring-[#0f2142]">
          <input
            type="number"
            min={min}
            max={max}
            disabled={readOnly}
            value={currentVal}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 px-2 py-1 text-[12px] font-mono text-slate-800 outline-none"
          />
          <span className="bg-slate-50 border-l border-slate-200 px-1.5 py-1 text-[11px] font-medium text-slate-500 select-none">
            px
          </span>
        </div>
      </div>
    </div>
  );
}

export function createTypographyField(options: {
  label?: string;
} = {}): CustomField<TypographyConfig> {
  const { label = "Typography" } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <TypographyInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
      />
    ),
  };
}

export function createFontSizePixelField(options: {
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
} = {}): CustomField<number> {
  const {
    label = "Font Size (px)",
    min = 10,
    max = 96,
    defaultValue = 16,
  } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <FontSizePixelInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
        min={min}
        max={max}
        defaultValue={defaultValue}
      />
    ),
  };
}

export default createTypographyField;
