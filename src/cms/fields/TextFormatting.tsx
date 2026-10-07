import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Sparkles,
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
    label: "Brand Sans (Inter / Modern)",
    css: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    className: "font-sans",
  },
  serif: {
    label: "Editorial Serif (Playfair / Georgia)",
    css: "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif",
    className: "font-serif",
  },
  outfit: {
    label: "Outfit Sans (Display)",
    css: "'Outfit', ui-sans-serif, system-ui, sans-serif",
    className: "font-sans",
  },
  poppins: {
    label: "Poppins (Clean Geometric)",
    css: "'Poppins', ui-sans-serif, system-ui, sans-serif",
    className: "font-sans",
  },
  mono: {
    label: "Monospace (Code / Data)",
    css: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    className: "font-mono",
  },
  inherit: {
    label: "Default (Inherit)",
    css: "inherit",
    className: "",
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

export const LINE_HEIGHT_MAP = {
  tight: "1.15",
  snug: "1.3",
  normal: "1.5",
  relaxed: "1.65",
  loose: "1.85",
};

export const LETTER_SPACING_MAP = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
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

  // Font size: supports explicit pixel values or presets
  if (
    typeof config.customFontSizePx === "number" &&
    config.customFontSizePx > 0 &&
    (config.fontSize === "custom" || config.fontSizeMode === "pixel" || !config.fontSize)
  ) {
    styles.fontSize = `${config.customFontSizePx}px`;
  } else if (config.fontSize && config.fontSize !== "custom" && config.fontSize in FONT_SIZE_MAP) {
    styles.fontSize = FONT_SIZE_MAP[config.fontSize as keyof typeof FONT_SIZE_MAP];
  }

  // Font weight
  if (config.fontWeight && config.fontWeight in FONT_WEIGHT_MAP) {
    styles.fontWeight = FONT_WEIGHT_MAP[config.fontWeight];
  }

  // Italic
  if (config.italic) {
    styles.fontStyle = "italic";
  }

  // Underline
  if (config.underline) {
    styles.textDecoration = "underline";
    styles.textUnderlineOffset = "4px";
  }

  // Line height
  if (config.lineHeight && config.lineHeight in LINE_HEIGHT_MAP) {
    styles.lineHeight = LINE_HEIGHT_MAP[config.lineHeight];
  }

  // Letter spacing
  if (config.letterSpacing && config.letterSpacing in LETTER_SPACING_MAP) {
    styles.letterSpacing = LETTER_SPACING_MAP[config.letterSpacing];
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

export function TextFormattingInput({
  value,
  onChange,
  readOnly,
  label = "Typography & Text Formatting",
}: {
  value?: TypographyConfig;
  onChange: (val: TypographyConfig) => void;
  readOnly?: boolean;
  label?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const cfg: TypographyConfig = value || {};
  const isPixelMode = cfg.fontSizeMode === "pixel" || cfg.fontSize === "custom";

  const update = (patch: Partial<TypographyConfig>) => {
    onChange({ ...cfg, ...patch });
  };

  const hasCustomizations =
    Boolean(cfg.fontFamily && cfg.fontFamily !== "inherit") ||
    Boolean(cfg.fontSize) ||
    Boolean(typeof cfg.customFontSizePx === "number" && cfg.customFontSizePx > 0) ||
    Boolean(cfg.fontWeight) ||
    Boolean(cfg.italic) ||
    Boolean(cfg.underline) ||
    Boolean(cfg.lineHeight) ||
    Boolean(cfg.letterSpacing) ||
    Boolean(cfg.textAlign) ||
    Boolean(cfg.textTransform && cfg.textTransform !== "none");

  const currentSizeSummary = isPixelMode
    ? `${cfg.customFontSizePx || 16}px`
    : cfg.fontSize && cfg.fontSize !== "custom"
      ? cfg.fontSize.toUpperCase()
      : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all duration-150">
      {/* Accordion Header */}
      <button
        type="button"
        disabled={readOnly}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 text-left transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Type className="size-4 text-navy" />
          <span className="text-xs font-bold text-navy">{label}</span>
          {currentSizeSummary && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              {currentSizeSummary}
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
        <div className="p-3 space-y-3.5 border-t border-slate-200 bg-white">
          {/* 1. Font Family */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Font Family
            </label>
            <select
              disabled={readOnly}
              value={cfg.fontFamily || "inherit"}
              onChange={(e) => update({ fontFamily: e.target.value as any })}
              className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            >
              <option value="inherit">Default (Inherit Site Font)</option>
              <option value="sans">Brand Sans (Inter / Modern)</option>
              <option value="serif">Editorial Serif (Playfair / Georgia)</option>
              <option value="outfit">Outfit (Clean Bold Sans)</option>
              <option value="poppins">Poppins (Friendly Geometric)</option>
              <option value="mono">Monospace (Code / Numbers)</option>
            </select>
          </div>

          {/* 2. Font Size (Presets vs Exact Pixels) */}
          <div className="space-y-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-navy flex items-center gap-1">
                <span>Font Size</span>
                {isPixelMode && typeof cfg.customFontSizePx === "number" && (
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {cfg.customFontSizePx}px
                  </span>
                )}
              </label>

              {/* Sizing Mode Switcher */}
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    update({
                      fontSizeMode: "preset",
                      fontSize: cfg.fontSize === "custom" ? "base" : cfg.fontSize || "base",
                    });
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    !isPixelMode
                      ? "bg-navy text-white shadow-2xs font-bold"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => {
                    const fallbackPx =
                      cfg.customFontSizePx ||
                      (cfg.fontSize === "xs"
                        ? 12
                        : cfg.fontSize === "sm"
                        ? 14
                        : cfg.fontSize === "base"
                        ? 16
                        : cfg.fontSize === "lg"
                        ? 18
                        : cfg.fontSize === "xl"
                        ? 20
                        : cfg.fontSize === "2xl"
                        ? 24
                        : cfg.fontSize === "3xl"
                        ? 30
                        : cfg.fontSize === "4xl"
                        ? 36
                        : cfg.fontSize === "5xl"
                        ? 48
                        : cfg.fontSize === "6xl"
                        ? 60
                        : 16);
                    update({
                      fontSizeMode: "pixel",
                      fontSize: "custom",
                      customFontSizePx: fallbackPx,
                    });
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    isPixelMode
                      ? "bg-navy text-white shadow-2xs font-bold"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Exact (px)
                </button>
              </div>
            </div>

            {/* Mode 1: Preset T-Shirt Sizes */}
            {!isPixelMode && (
              <div className="space-y-1.5">
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { label: "XS (12px)", value: "xs" },
                    { label: "SM (14px)", value: "sm" },
                    { label: "Base (16px)", value: "base" },
                    { label: "LG (18px)", value: "lg" },
                    { label: "XL (20px)", value: "xl" },
                    { label: "2XL (24px)", value: "2xl" },
                    { label: "3XL (30px)", value: "3xl" },
                    { label: "4XL (36px)", value: "4xl" },
                    { label: "5XL (48px)", value: "5xl" },
                    { label: "6XL (60px)", value: "6xl" },
                  ].map((s) => {
                    const isSelected = (cfg.fontSize || "base") === s.value;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        disabled={readOnly}
                        onClick={() => update({ fontSize: s.value as any, fontSizeMode: "preset" })}
                        className={`py-1 rounded-md text-[10px] font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-navy text-white border-navy shadow-xs font-bold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                        title={s.label}
                      >
                        {s.value.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Exact Custom Pixel Size (px) */}
            {isPixelMode && (
              <div className="space-y-2 pt-1">
                {/* Numeric Input with Steppers */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white rounded-lg border border-slate-300 shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      disabled={readOnly || (cfg.customFontSizePx || 16) <= 8}
                      onClick={() => {
                        const cur = cfg.customFontSizePx || 16;
                        update({ fontSize: "custom", fontSizeMode: "pixel", customFontSizePx: Math.max(8, cur - 1) });
                      }}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 hover:text-navy font-bold text-xs cursor-pointer select-none"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="8"
                      max="180"
                      step="1"
                      disabled={readOnly}
                      value={cfg.customFontSizePx || 16}
                      onChange={(e) => {
                        const val = Math.max(8, Math.min(180, Number(e.target.value) || 16));
                        update({ fontSize: "custom", fontSizeMode: "pixel", customFontSizePx: val });
                      }}
                      className="w-16 py-1 text-xs font-mono font-bold text-center text-navy outline-none border-x border-slate-200"
                    />
                    <button
                      type="button"
                      disabled={readOnly || (cfg.customFontSizePx || 16) >= 180}
                      onClick={() => {
                        const cur = cfg.customFontSizePx || 16;
                        update({ fontSize: "custom", fontSizeMode: "pixel", customFontSizePx: Math.min(180, cur + 1) });
                      }}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 hover:text-navy font-bold text-xs cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">px</span>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min="8"
                    max="100"
                    step="1"
                    disabled={readOnly}
                    value={cfg.customFontSizePx || 16}
                    onChange={(e) =>
                      update({
                        fontSize: "custom",
                        fontSizeMode: "pixel",
                        customFontSizePx: Number(e.target.value),
                      })
                    }
                    className="flex-1 accent-navy cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* Quick Pixel Chips */}
                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72].map((px) => {
                    const isChipSelected = cfg.customFontSizePx === px;
                    return (
                      <button
                        key={px}
                        type="button"
                        disabled={readOnly}
                        onClick={() =>
                          update({
                            fontSize: "custom",
                            fontSizeMode: "pixel",
                            customFontSizePx: px,
                          })
                        }
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                          isChipSelected
                            ? "bg-navy text-white shadow-2xs font-bold"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-navy"
                        }`}
                      >
                        {px}px
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Font Weight */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Font Weight
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[
                { label: "Regular", value: "normal" },
                { label: "Medium", value: "medium" },
                { label: "Semi", value: "semibold" },
                { label: "Bold", value: "bold" },
                { label: "Black", value: "extrabold" },
              ].map((w) => {
                const isSelected = (cfg.fontWeight || "normal") === w.value;
                return (
                  <button
                    key={w.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => update({ fontWeight: w.value as any })}
                    className={`py-1 rounded-md text-[10px] font-medium border transition-all ${
                      isSelected
                        ? "bg-navy text-white border-navy shadow-xs font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Text Styling & Alignment Toolbar */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Style & Transform */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Style & Case
              </label>
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                {/* Italic */}
                <button
                  type="button"
                  title="Italic"
                  disabled={readOnly}
                  onClick={() => update({ italic: !cfg.italic })}
                  className={`flex-1 py-1 rounded-md flex items-center justify-center transition-all ${
                    cfg.italic
                      ? "bg-navy text-white shadow-xs"
                      : "text-slate-700 hover:bg-white"
                  }`}
                >
                  <ItalicIcon className="size-3.5" />
                </button>

                {/* Underline */}
                <button
                  type="button"
                  title="Underline"
                  disabled={readOnly}
                  onClick={() => update({ underline: !cfg.underline })}
                  className={`flex-1 py-1 rounded-md flex items-center justify-center transition-all ${
                    cfg.underline
                      ? "bg-navy text-white shadow-xs"
                      : "text-slate-700 hover:bg-white"
                  }`}
                >
                  <UnderlineIcon className="size-3.5" />
                </button>

                {/* Uppercase Toggle */}
                <button
                  type="button"
                  title="Uppercase"
                  disabled={readOnly}
                  onClick={() =>
                    update({
                      textTransform: cfg.textTransform === "uppercase" ? "none" : "uppercase",
                    })
                  }
                  className={`flex-1 py-1 rounded-md text-[10px] font-bold flex items-center justify-center transition-all ${
                    cfg.textTransform === "uppercase"
                      ? "bg-navy text-white shadow-xs"
                      : "text-slate-700 hover:bg-white"
                  }`}
                >
                  AA
                </button>
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Alignment
              </label>
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                {[
                  { align: "left", icon: AlignLeft, title: "Left" },
                  { align: "center", icon: AlignCenter, title: "Center" },
                  { align: "right", icon: AlignRight, title: "Right" },
                  { align: "justify", icon: AlignJustify, title: "Justify" },
                ].map(({ align, icon: Icon, title }) => {
                  const isSelected = (cfg.textAlign || "left") === align;
                  return (
                    <button
                      key={align}
                      type="button"
                      title={title}
                      disabled={readOnly}
                      onClick={() => update({ textAlign: align as any })}
                      className={`flex-1 py-1 rounded-md flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-navy text-white shadow-xs"
                          : "text-slate-700 hover:bg-white"
                      }`}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Advanced Spacing & Leading (Collapsible) */}
          <div className="pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full py-1 text-[11px] font-semibold text-slate-600 hover:text-navy"
            >
              <span>Line Height & Letter Spacing</span>
              {showAdvanced ? (
                <ChevronDown className="size-3 text-slate-400" />
              ) : (
                <ChevronRight className="size-3 text-slate-400" />
              )}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-600 block mb-1">
                    Line Height
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.lineHeight || "normal"}
                    onChange={(e) => update({ lineHeight: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="tight">Tight (1.15)</option>
                    <option value="snug">Snug (1.3)</option>
                    <option value="normal">Normal (1.5)</option>
                    <option value="relaxed">Relaxed (1.65)</option>
                    <option value="loose">Loose (1.85)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-600 block mb-1">
                    Letter Spacing
                  </label>
                  <select
                    disabled={readOnly}
                    value={cfg.letterSpacing || "normal"}
                    onChange={(e) => update({ letterSpacing: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-navy"
                  >
                    <option value="tighter">Tighter (-0.05em)</option>
                    <option value="tight">Tight (-0.025em)</option>
                    <option value="normal">Normal (0)</option>
                    <option value="wide">Wide (+0.025em)</option>
                    <option value="wider">Wider (+0.05em)</option>
                    <option value="widest">Widest (+0.1em)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          {hasCustomizations && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange({})}
                className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-600 font-medium transition-colors"
              >
                <RotateCcw className="size-3" />
                <span>Reset Typography</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Creates a Puck custom field for Typography configuration.
 */
export function createTypographyField(options: {
  label?: string;
  description?: string;
} = {}): CustomField<TypographyConfig> {
  return {
    type: "custom",
    label: options.label || "Typography & Text Formatting",
    render: ({ value, onChange, readOnly }) => (
      <TextFormattingInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={options.label}
      />
    ),
  };
}

/**
 * Creates a standalone Puck custom field for explicit Font Size in pixels
 */
export function createFontSizePixelField(options: {
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
} = {}): CustomField<number | undefined> {
  const {
    label = "Explicit Font Size (px)",
    description = "Set explicit font size in exact pixels.",
    min = 8,
    max = 140,
    step = 1,
    defaultValue,
  } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => {
      const currentVal = typeof value === "number" && value > 0 ? value : defaultValue;
      return (
        <div className="flex flex-col gap-2 w-full bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>{label}</span>
            <div className="flex items-center gap-1.5">
              {currentVal ? (
                <span className="px-2 py-0.5 rounded-full bg-navy text-white font-mono text-[11px] font-bold shadow-2xs">
                  {currentVal}px
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Auto / Inherit</span>
              )}
              {currentVal && !readOnly && (
                <button
                  type="button"
                  onClick={() => onChange(undefined)}
                  className="text-[10px] text-slate-400 hover:text-red-600 underline cursor-pointer ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {description && (
            <p className="text-[11px] text-slate-500 leading-tight -mt-0.5">{description}</p>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg border border-slate-300 shadow-2xs overflow-hidden">
              <button
                type="button"
                disabled={readOnly || !currentVal || currentVal <= min}
                onClick={() => {
                  const cur = currentVal || min;
                  onChange(Math.max(min, cur - 1));
                }}
                className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 hover:text-navy font-bold text-xs cursor-pointer select-none"
              >
                -
              </button>
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                disabled={readOnly}
                value={currentVal || ""}
                placeholder="Auto"
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : undefined;
                  onChange(val !== undefined ? Math.max(min, Math.min(max, val)) : undefined);
                }}
                className="w-16 py-1 text-xs font-mono font-bold text-center text-navy outline-none border-x border-slate-200"
              />
              <button
                type="button"
                disabled={readOnly || (Boolean(currentVal) && (currentVal ?? 0) >= max)}
                onClick={() => {
                  const cur = currentVal || min;
                  onChange(Math.min(max, cur + 1));
                }}
                className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 hover:text-navy font-bold text-xs cursor-pointer select-none"
              >
                +
              </button>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">px</span>

            <input
              type="range"
              min={min}
              max={max}
              step={step}
              disabled={readOnly}
              value={currentVal || min}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 accent-navy cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72].map((px) => (
              <button
                key={px}
                type="button"
                disabled={readOnly}
                onClick={() => onChange(px)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                  currentVal === px
                    ? "bg-navy text-white shadow-2xs font-bold"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-navy"
                }`}
              >
                {px}px
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

export default createTypographyField;
