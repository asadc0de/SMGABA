import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import {
  Sparkles,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  MousePointer,
  ArrowUpRight,
  Eye,
  Zap,
} from "lucide-react";

export type ScrollAnimationType =
  | "none"
  | "fade-in"
  | "slide-up"
  | "slide-left"
  | "slide-right"
  | "zoom-in";

export type HoverAnimationType =
  | "none"
  | "lift"
  | "grow"
  | "color-shift"
  | "underline-slide";

export type ClickFeedbackType = "none" | "press";

export type AnimationSpeed = "fast" | "normal" | "slow";
export type AnimationDelay = "none" | "short" | "medium" | "long";
export type AnimationPlayMode = "once" | "always";

export interface AnimationConfig {
  scroll?: ScrollAnimationType;
  hover?: HoverAnimationType;
  click?: ClickFeedbackType;
  speed?: AnimationSpeed;
  delay?: AnimationDelay;
  playMode?: AnimationPlayMode;
  staggerChildren?: boolean;
}

export const SPEED_MAP: Record<AnimationSpeed, string> = {
  fast: "250ms",
  normal: "400ms",
  slow: "600ms",
};

export const DELAY_MAP: Record<AnimationDelay, string> = {
  none: "0ms",
  short: "150ms",
  medium: "300ms",
  long: "500ms",
};

/**
 * Builds CSS class names and inline style tokens for animation execution
 */
export function buildAnimationClasses(config?: AnimationConfig): string {
  if (!config) return "";

  const classes: string[] = ["cms-animate-target"];

  // Scroll entrance animation class
  if (config.scroll && config.scroll !== "none") {
    classes.push(`cms-anim-${config.scroll}`);
  }

  // Hover animation class (guarded by hover media query in CSS)
  if (config.hover && config.hover !== "none") {
    classes.push(`cms-hover-${config.hover}`);
  }

  // Click feedback class
  if (config.click && config.click !== "none") {
    classes.push("cms-click-press");
  }

  return classes.join(" ");
}

/**
 * Builds inline CSS variables and transition styles for animation execution
 */
export function buildAnimationStyles(
  config?: AnimationConfig,
  childIndex?: number
): React.CSSProperties {
  if (!config) return {};

  const styles: React.CSSProperties = {};

  const speed = config.speed ? SPEED_MAP[config.speed] : "400ms";
  let delay = config.delay ? DELAY_MAP[config.delay] : "0ms";

  // If staggering children, add increment
  if (config.staggerChildren && typeof childIndex === "number" && childIndex > 0) {
    const baseDelayMs = parseInt(delay, 10) || 0;
    const staggerDelayMs = baseDelayMs + childIndex * 80;
    delay = `${staggerDelayMs}ms`;
  }

  styles.transitionDuration = speed;
  styles.transitionDelay = delay;

  return styles;
}

export function AnimationControlsInput({
  value,
  onChange,
  readOnly = false,
  label = "Micro Animations",
  showStaggerToggle = false,
}: {
  value?: AnimationConfig;
  onChange: (val: AnimationConfig) => void;
  readOnly?: boolean;
  label?: string;
  showStaggerToggle?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [previewKey, setPreviewKey] = React.useState(0);

  const cfg: AnimationConfig = value || {};

  const update = (patch: Partial<AnimationConfig>) => {
    onChange({
      ...cfg,
      ...patch,
    });
  };

  const hasAnimation =
    Boolean(cfg.scroll && cfg.scroll !== "none") ||
    Boolean(cfg.hover && cfg.hover !== "none") ||
    Boolean(cfg.click && cfg.click !== "none");

  const summary = [
    cfg.scroll && cfg.scroll !== "none" ? cfg.scroll : null,
    cfg.hover && cfg.hover !== "none" ? `hover:${cfg.hover}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

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
          <Sparkles className="size-4 text-navy" />
          <span className="text-xs font-bold text-navy">{label}</span>
          {hasAnimation && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {summary || "Active"}
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
        <div className="p-3.5 space-y-3.5 border-t border-slate-200 bg-white text-xs">
          {/* 1. On Scroll Entrance Animation */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
              On Scroll (Page Entrance)
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: "None", value: "none" },
                { label: "Fade In", value: "fade-in" },
                { label: "Slide Up", value: "slide-up" },
                { label: "Slide Left", value: "slide-left" },
                { label: "Slide Right", value: "slide-right" },
                { label: "Zoom In", value: "zoom-in" },
              ].map((s) => {
                const isSelected = (cfg.scroll || "none") === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => update({ scroll: s.value as any })}
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
          </div>

          {/* 2. On Hover Interactive Effect */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider flex items-center gap-1">
              <MousePointer className="size-3 text-slate-500" />
              On Hover (Cursor Effect)
            </span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: "None", value: "none" },
                { label: "Lift (Up + Shadow)", value: "lift" },
                { label: "Grow Slightly", value: "grow" },
                { label: "Color Shift", value: "color-shift" },
                { label: "Underline Slide", value: "underline-slide" },
              ].map((h) => {
                const isSelected = (cfg.hover || "none") === h.value;
                return (
                  <button
                    key={h.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => update({ hover: h.value as any })}
                    className={`py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy text-white border-navy shadow-xs font-bold"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {h.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Click / Tap Feedback */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Zap className="size-3 text-slate-500" />
                Click / Press Feedback
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  checked={cfg.click === "press"}
                  onChange={(e) => update({ click: e.target.checked ? "press" : "none" })}
                  className="size-3.5 rounded border-slate-300 text-navy focus:ring-navy"
                />
                <span>Press Down Effect</span>
              </label>
            </div>
          </div>

          {/* 4. Speed & Delay Controls */}
          {hasAnimation && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Speed
                </label>
                <select
                  disabled={readOnly}
                  value={cfg.speed || "normal"}
                  onChange={(e) => update({ speed: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                >
                  <option value="fast">Fast (250ms)</option>
                  <option value="normal">Normal (400ms)</option>
                  <option value="slow">Slow (600ms)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Delay
                </label>
                <select
                  disabled={readOnly}
                  value={cfg.delay || "none"}
                  onChange={(e) => update({ delay: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-navy"
                >
                  <option value="none">None (0ms)</option>
                  <option value="short">Short (150ms)</option>
                  <option value="medium">Medium (300ms)</option>
                  <option value="long">Long (500ms)</option>
                </select>
              </div>
            </div>
          )}

          {/* 5. Stagger Children (for Containers) */}
          {showStaggerToggle && (
            <div className="p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy block">Stagger child items</span>
                <span className="text-[10px] text-slate-600 block">
                  Cards appear one after another with smooth cascade.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={readOnly}
                checked={Boolean(cfg.staggerChildren)}
                onChange={(e) => update({ staggerChildren: e.target.checked })}
                className="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer"
              />
            </div>
          )}

          {/* 6. Preview Animation Live Test Box */}
          {hasAnimation && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all cursor-pointer"
                >
                  <Play className="size-3 fill-blue-700" />
                  <span>Preview Animation</span>
                </button>

                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => onChange({})}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-600 font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Visual preview box that re-triggers animation on previewKey change */}
              <div className="overflow-hidden p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-center justify-center min-h-[52px]">
                <div
                  key={previewKey}
                  style={buildAnimationStyles(cfg)}
                  className={`px-4 py-2 bg-white text-navy font-bold text-xs rounded-lg shadow-xs border border-slate-200 text-center ${buildAnimationClasses(cfg)}`}
                >
                  Motion Preview Sample
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
 * Creates a Puck custom field for Micro Animations
 */
export function createAnimationControlsField(options: {
  label?: string;
  showStaggerToggle?: boolean;
} = {}): CustomField<AnimationConfig> {
  return {
    type: "custom",
    label: options.label || "Micro Animations",
    render: ({ value, onChange, readOnly }) => (
      <AnimationControlsInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={options.label}
        showStaggerToggle={options.showStaggerToggle}
      />
    ),
  };
}

export default createAnimationControlsField;
