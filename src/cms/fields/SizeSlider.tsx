import * as React from "react";
import type { CustomField } from "@puckeditor/core";
import { Info, RotateCcw } from "lucide-react";

export interface SizeSliderProps {
  value?: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  presets?: number[];
  description?: string;
}

/**
 * Compact Single-row Slider with numeric input
 */
export function SizeSlider({
  value,
  onChange,
  readOnly,
  label = "Scale",
  min = 10,
  max = 150,
  step = 1,
  unit = "%",
  defaultValue = 100,
  description,
}: SizeSliderProps) {
  const numVal = typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;
  const clampedVal = Math.min(max, Math.max(min, numVal));

  return (
    <div className="w-full space-y-1 text-[13px]">
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        {/* Left: Label with tooltip info */}
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

        {/* Right: Slider + Number Input alongside */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            disabled={readOnly}
            value={clampedVal}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0f2142] focus:outline-none"
          />

          <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-[#0f2142] focus-within:ring-1 focus-within:ring-[#0f2142]">
            <input
              type="number"
              min={min}
              max={max}
              disabled={readOnly}
              value={clampedVal}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-12 px-1.5 py-1 text-[12px] font-mono text-slate-800 outline-none text-right"
            />
            <span className="bg-slate-50 border-l border-slate-200 px-1 py-1 text-[11px] font-medium text-slate-500 select-none">
              {unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper to generate a Puck custom field config for a size slider.
 */
export function createSizeSliderField(options: {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  presets?: number[];
  description?: string;
} = {}): CustomField<number> {
  const {
    label = "Scale",
    min = 10,
    max = 150,
    step = 1,
    unit = "%",
    defaultValue = 100,
    presets = [50, 75, 100, 125, 150],
    description,
  } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <SizeSlider
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
        min={min}
        max={max}
        step={step}
        unit={unit}
        defaultValue={defaultValue}
        presets={presets}
        description={description}
      />
    ),
  };
}

export default createSizeSliderField;
