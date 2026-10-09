import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { Maximize2, Info } from "lucide-react";

export interface SizeControlConfig {
  widthType?: "auto" | "full" | "percent" | "px";
  widthValue?: number;
  heightType?: "auto" | "full" | "px" | "percent" | "screen";
  heightValue?: number;
  sameItemSize?: boolean;
  equalHeightCards?: boolean;
}

export const DEFAULT_SIZE_CONFIG: SizeControlConfig = {
  widthType: "full",
  widthValue: 100,
  heightType: "auto",
  heightValue: 0,
  sameItemSize: false,
  equalHeightCards: true,
};

/**
 * Computes React inline CSS styles from SizeControlConfig
 */
export function buildSizeStyles(
  config?: SizeControlConfig,
  legacySizePercent?: number,
): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (config) {
    // Compute Width
    switch (config.widthType) {
      case "auto":
        styles.width = "auto";
        break;
      case "full":
        styles.width = "100%";
        styles.maxWidth = "100%";
        break;
      case "percent":
        if (typeof config.widthValue === "number" && config.widthValue > 0) {
          const val = Math.min(100, Math.max(1, config.widthValue));
          styles.width = `${val}%`;
          styles.maxWidth = `${val}%`;
        }
        break;
      case "px":
        if (typeof config.widthValue === "number" && config.widthValue > 0) {
          styles.width = `${config.widthValue}px`;
          styles.maxWidth = "100%";
        }
        break;
    }

    // Compute Height
    switch (config.heightType) {
      case "auto":
        break;
      case "full":
        styles.height = "100%";
        break;
      case "px":
        if (typeof config.heightValue === "number" && config.heightValue > 0) {
          styles.minHeight = `${config.heightValue}px`;
        }
        break;
      case "percent":
        if (typeof config.heightValue === "number" && config.heightValue > 0) {
          styles.height = `${config.heightValue}%`;
        }
        break;
      case "screen":
        styles.minHeight = "75vh";
        break;
    }
  } else if (typeof legacySizePercent === "number" && legacySizePercent < 100 && legacySizePercent > 0) {
    styles.maxWidth = `${legacySizePercent}%`;
  }

  return styles;
}

export interface SizeControlsInputProps {
  value?: SizeControlConfig;
  onChange: (value: SizeControlConfig) => void;
  readOnly?: boolean;
  label?: string;
  defaultWidthType?: SizeControlConfig["widthType"];
  defaultHeightType?: SizeControlConfig["heightType"];
  showMultiItemControls?: boolean;
  showEqualHeightToggle?: boolean;
}

/**
 * Compact dual-input row for Width & Height with inline unit selectors
 */
export function SizeControlsInput({
  value,
  onChange,
  readOnly = false,
  label = "Dimensions",
  defaultWidthType = "full",
  defaultHeightType = "auto",
  showMultiItemControls = false,
  showEqualHeightToggle = false,
}: SizeControlsInputProps) {
  const cfg: SizeControlConfig = {
    ...DEFAULT_SIZE_CONFIG,
    widthType: defaultWidthType,
    heightType: defaultHeightType,
    ...(value || {}),
  };

  const update = (patch: Partial<SizeControlConfig>) => {
    onChange({
      ...cfg,
      ...patch,
    });
  };

  return (
    <div className="w-full space-y-2 text-[13px]">
      {/* Dual Inputs Row: Width on Left, Height on Right */}
      <div className="grid grid-cols-2 gap-2">
        {/* Width Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11.5px] font-medium text-slate-600">
            <span>Width</span>
            <span className="font-mono text-[10.5px] text-slate-400 uppercase">{cfg.widthType}</span>
          </div>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-[#0f2142] focus-within:ring-1 focus-within:ring-[#0f2142]">
            <input
              type="number"
              disabled={readOnly || cfg.widthType === "auto" || cfg.widthType === "full"}
              value={
                cfg.widthType === "full"
                  ? 100
                  : cfg.widthType === "auto"
                  ? ""
                  : cfg.widthValue || (cfg.widthType === "percent" ? 100 : 320)
              }
              onChange={(e) => update({ widthValue: Number(e.target.value) })}
              placeholder={cfg.widthType === "auto" ? "Auto" : "100"}
              className="w-full px-2 py-1 text-[12px] font-mono text-slate-800 outline-none bg-transparent disabled:text-slate-400"
            />
            <select
              disabled={readOnly}
              value={cfg.widthType || "full"}
              onChange={(e) => update({ widthType: e.target.value as any })}
              className="bg-slate-50 border-l border-slate-200 px-1 py-1 text-[11px] font-medium text-slate-600 outline-none cursor-pointer"
            >
              <option value="full">100%</option>
              <option value="auto">Auto</option>
              <option value="percent">%</option>
              <option value="px">px</option>
            </select>
          </div>
        </div>

        {/* Height Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11.5px] font-medium text-slate-600">
            <span>Height</span>
            <span className="font-mono text-[10.5px] text-slate-400 uppercase">{cfg.heightType}</span>
          </div>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-[#0f2142] focus-within:ring-1 focus-within:ring-[#0f2142]">
            <input
              type="number"
              disabled={readOnly || cfg.heightType === "auto" || cfg.heightType === "full" || cfg.heightType === "screen"}
              value={
                cfg.heightType === "full"
                  ? 100
                  : cfg.heightType === "auto" || cfg.heightType === "screen"
                  ? ""
                  : cfg.heightValue || (cfg.heightType === "percent" ? 100 : 300)
              }
              onChange={(e) => update({ heightValue: Number(e.target.value) })}
              placeholder={cfg.heightType === "screen" ? "75vh" : "Auto"}
              className="w-full px-2 py-1 text-[12px] font-mono text-slate-800 outline-none bg-transparent disabled:text-slate-400"
            />
            <select
              disabled={readOnly}
              value={cfg.heightType || "auto"}
              onChange={(e) => update({ heightType: e.target.value as any })}
              className="bg-slate-50 border-l border-slate-200 px-1 py-1 text-[11px] font-medium text-slate-600 outline-none cursor-pointer"
            >
              <option value="auto">Auto</option>
              <option value="px">px</option>
              <option value="percent">%</option>
              <option value="full">100%</option>
              <option value="screen">Screen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Multi-item Equal Heights Toggles (when enabled) */}
      {(showMultiItemControls || showEqualHeightToggle) && (
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-slate-600">Equal card heights</span>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => update({ equalHeightCards: !cfg.equalHeightCards })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              cfg.equalHeightCards !== false ? "bg-[#0f2142]" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                cfg.equalHeightCards !== false ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Creates a Puck custom field for SizeControls.
 */
export function createSizeControlsField(options: {
  label?: string;
  defaultWidthType?: SizeControlConfig["widthType"];
  defaultHeightType?: SizeControlConfig["heightType"];
  showMultiItemControls?: boolean;
  showEqualHeightToggle?: boolean;
} = {}): CustomField<SizeControlConfig> {
  const {
    label = "Dimensions",
    defaultWidthType = "full",
    defaultHeightType = "auto",
    showMultiItemControls = false,
    showEqualHeightToggle = false,
  } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <SizeControlsInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
        defaultWidthType={defaultWidthType}
        defaultHeightType={defaultHeightType}
        showMultiItemControls={showMultiItemControls}
        showEqualHeightToggle={showEqualHeightToggle}
      />
    ),
  };
}

/**
 * Creates a simple toggle field with switch UI
 */
export function createToggleField(options: {
  label: string;
  description?: string;
  defaultValue?: boolean;
}): CustomField<boolean> {
  const { label, description, defaultValue = false } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => {
      const isChecked = value !== undefined ? Boolean(value) : defaultValue;
      return (
        <div className="flex items-center justify-between gap-2 py-1 min-h-[32px]">
          <div className="flex items-center gap-1 min-w-0 pr-1">
            <span className="text-[13px] font-medium text-slate-700 truncate" title={label}>
              {label}
            </span>
            {description && (
              <span className="text-slate-400 hover:text-slate-600 cursor-help" title={description}>
                <Info className="size-3" />
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => onChange(!isChecked)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isChecked ? "bg-[#0f2142]" : "bg-slate-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                isChecked ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      );
    },
  };
}

export default createSizeControlsField;
