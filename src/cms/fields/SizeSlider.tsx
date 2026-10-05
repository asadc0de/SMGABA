import * as React from "react";
import type { CustomField } from "@puckeditor/core";

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

export function SizeSlider({
  value,
  onChange,
  readOnly,
  label = "Element Size / Scale",
  min = 50,
  max = 150,
  step = 1,
  unit = "%",
  defaultValue = 100,
  presets = [50, 75, 100, 125, 150],
  description,
}: SizeSliderProps) {
  const numVal = typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;
  const clampedVal = Math.min(max, Math.max(min, numVal));

  return (
    <div className="flex flex-col gap-2 w-full bg-slate-50 p-3 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-navy text-white font-mono text-[11px] font-bold shadow-2xs">
            {clampedVal}
            {unit}
          </span>
          {clampedVal !== defaultValue && !readOnly && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className="text-[10px] text-slate-400 hover:text-navy underline cursor-pointer"
              title="Reset to default"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 leading-tight -mt-0.5">{description}</p>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        disabled={readOnly}
        value={clampedVal}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy focus:outline-none"
      />

      <div className="flex items-center justify-between gap-1 pt-0.5">
        <span className="text-[10px] text-slate-400">
          {min}
          {unit}
        </span>
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(preset)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                clampedVal === preset
                  ? "bg-navy text-white shadow-2xs scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {preset}
              {unit}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-400">
          {max}
          {unit}
        </span>
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
    label = "Element Size / Scale",
    min = 50,
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
