import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { Maximize2, MoveHorizontal, MoveVertical, ChevronDown, ChevronRight } from "lucide-react";

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
        // default auto
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

import { useEditorMode } from "../editor-mode";

export function SizeControlsInput({
  value,
  onChange,
  readOnly = false,
  label = "Size Controls (Width & Height)",
  defaultWidthType = "full",
  defaultHeightType = "auto",
  showMultiItemControls = false,
  showEqualHeightToggle = false,
}: SizeControlsInputProps) {
  const [mode, setMode] = useEditorMode();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [showAdvancedInputs, setShowAdvancedInputs] = React.useState<boolean>(false);

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

  const widthSummary =
    cfg.widthType === "full"
      ? "100% (Full)"
      : cfg.widthType === "auto"
      ? "Auto"
      : cfg.widthType === "percent"
      ? `${cfg.widthValue || 100}%`
      : `${cfg.widthValue || 320}px`;

  const heightSummary =
    cfg.heightType === "auto"
      ? "Auto"
      : cfg.heightType === "full"
      ? "100%"
      : cfg.heightType === "screen"
      ? "75vh"
      : cfg.heightType === "percent"
      ? `${cfg.heightValue || 100}%`
      : `${cfg.heightValue || 300}px`;

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden my-2 shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left select-none cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Maximize2 className="size-3.5 text-navy" />
          <span className="text-xs font-bold text-slate-800">{label}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
            {widthSummary} × {heightSummary}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="size-4 text-slate-500" />
        ) : (
          <ChevronRight className="size-4 text-slate-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-3.5 space-y-3.5 border-t border-slate-200 text-xs bg-white animate-in fade-in-50 duration-150">
          {/* Width Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <MoveHorizontal className="size-3 text-slate-500" />
                Width
              </span>
              <span className="text-[10px] font-mono font-bold text-navy bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {widthSummary}
              </span>
            </div>

            {/* Width Unit Selector */}
            <div className="grid grid-cols-4 gap-1">
              {(["full", "percent", "px", "auto"] as const).map((unit) => {
                const isSelected = cfg.widthType === unit;
                const unitLabels: Record<string, string> = {
                  full: "Full",
                  percent: "%",
                  px: "px",
                  auto: "Auto",
                };

                return (
                  <button
                    key={unit}
                    type="button"
                    disabled={readOnly}
                    onClick={() => {
                      update({
                        widthType: unit,
                        widthValue:
                          unit === "percent"
                            ? cfg.widthValue && cfg.widthValue <= 100 ? cfg.widthValue : 100
                            : unit === "px"
                            ? cfg.widthValue && cfg.widthValue > 100 ? cfg.widthValue : 480
                            : cfg.widthValue,
                      });
                    }}
                    className={`py-1 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy text-white border-navy shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {unitLabels[unit]}
                  </button>
                );
              })}
            </div>

            {/* Custom Width Value Input / Slider */}
            {cfg.widthType === "percent" && (
              <div className="space-y-1 pt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Percentage Value</span>
                  <span className="font-bold font-mono text-navy">{cfg.widthValue || 100}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  disabled={readOnly}
                  value={cfg.widthValue || 100}
                  onChange={(e) => update({ widthValue: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-navy"
                />
                <div className="flex items-center gap-1 justify-between pt-1">
                  {[25, 33, 50, 66, 75, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={readOnly}
                      onClick={() => update({ widthValue: preset })}
                      className="px-1 py-0.5 rounded text-[9px] font-semibold bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cfg.widthType === "px" && (
              <div className="space-y-1 pt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Pixel Width</span>
                  <input
                    type="number"
                    min={40}
                    max={1920}
                    step={10}
                    disabled={readOnly}
                    value={cfg.widthValue || 480}
                    onChange={(e) => update({ widthValue: Number(e.target.value) })}
                    className="w-20 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-mono text-right"
                  />
                </div>
                <div className="flex items-center gap-1 justify-between pt-1">
                  {[280, 360, 480, 640, 800, 1024].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={readOnly}
                      onClick={() => update({ widthValue: preset })}
                      className="px-1 py-0.5 rounded text-[9px] font-semibold bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                    >
                      {preset}px
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Height Section */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <MoveVertical className="size-3 text-slate-500" />
                Height
              </span>
              <span className="text-[10px] font-mono font-bold text-navy bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {heightSummary}
              </span>
            </div>

            {/* Height Unit Selector */}
            <div className="grid grid-cols-4 gap-1">
              {(["auto", "px", "full", "screen"] as const).map((unit) => {
                const isSelected = cfg.heightType === unit;
                const unitLabels: Record<string, string> = {
                  auto: "Auto",
                  px: "px",
                  full: "100%",
                  screen: "75vh",
                };

                return (
                  <button
                    key={unit}
                    type="button"
                    disabled={readOnly}
                    onClick={() => {
                      update({
                        heightType: unit,
                        heightValue:
                          unit === "px"
                            ? cfg.heightValue && cfg.heightValue > 0 ? cfg.heightValue : 360
                            : cfg.heightValue,
                      });
                    }}
                    className={`py-1 px-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy text-white border-navy shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {unitLabels[unit]}
                  </button>
                );
              })}
            </div>

            {/* Custom Height Value Input */}
            {cfg.heightType === "px" && (
              <div className="space-y-1 pt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Pixel Height (min-height)</span>
                  <input
                    type="number"
                    min={20}
                    max={1600}
                    step={10}
                    disabled={readOnly}
                    value={cfg.heightValue || 360}
                    onChange={(e) => update({ heightValue: Number(e.target.value) })}
                    className="w-20 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-mono text-right"
                  />
                </div>
                <div className="flex items-center gap-1 justify-between pt-1">
                  {[120, 240, 360, 480, 600, 800].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      disabled={readOnly}
                      onClick={() => update({ heightValue: preset })}
                      className="px-1 py-0.5 rounded text-[9px] font-semibold bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                    >
                      {preset}px
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Optional Multi-Item Sizing Toggles */}
          {(showMultiItemControls || showEqualHeightToggle) && (
            <div className="space-y-2 pt-2 border-t border-slate-200 bg-slate-50/80 p-2.5 rounded-lg border">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Child Items Sizing
              </div>

              {showMultiItemControls && (
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(cfg.sameItemSize)}
                    disabled={readOnly}
                    onChange={(e) => update({ sameItemSize: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-slate-300 text-navy focus:ring-navy accent-navy cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Apply same size to all items</div>
                    <div className="text-[10px] text-slate-500">Every child item gets equal width and height.</div>
                  </div>
                </label>
              )}

              {showEqualHeightToggle && (
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={cfg.equalHeightCards !== false}
                    disabled={readOnly}
                    onChange={(e) => update({ equalHeightCards: e.target.checked })}
                    className="mt-0.5 size-4 rounded border-slate-300 text-navy focus:ring-navy accent-navy cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Equal height cards</div>
                    <div className="text-[10px] text-slate-500">Stretch all cards to match the tallest item.</div>
                  </div>
                </label>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Puck Custom Field Creator for Boolean Toggle
 */
export function createToggleField(options: {
  label: string;
  description?: string;
  defaultValue?: boolean;
}): CustomField<boolean> {
  return {
    type: "custom",
    label: options.label,
    render: ({ value, onChange, readOnly }) => {
      const isChecked = value !== undefined ? Boolean(value) : (options.defaultValue ?? false);
      return (
        <div className="my-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isChecked}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.checked)}
              className="mt-0.5 size-4 rounded border-slate-300 text-navy focus:ring-navy accent-navy cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800">{options.label}</span>
              {options.description && (
                <p className="text-[11px] text-slate-500 mt-0.5">{options.description}</p>
              )}
            </div>
          </label>
        </div>
      );
    },
  };
}

/**
 * Creates a Puck custom field for width and height size controls
 */
export function createSizeControlsField(options: {
  label?: string;
  defaultWidthType?: SizeControlConfig["widthType"];
  defaultHeightType?: SizeControlConfig["heightType"];
  showMultiItemControls?: boolean;
  showEqualHeightToggle?: boolean;
} = {}): CustomField<SizeControlConfig> {
  return {
    type: "custom",
    label: options.label || "Dimensions & Size (W/H)",
    render: ({ value, onChange, readOnly }) => (
      <SizeControlsInput
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={options.label}
        defaultWidthType={options.defaultWidthType}
        defaultHeightType={options.defaultHeightType}
        showMultiItemControls={options.showMultiItemControls}
        showEqualHeightToggle={options.showEqualHeightToggle}
      />
    ),
  };
}

export default createSizeControlsField;
