import * as React from "react";
import { useState, useEffect } from "react";
import { createUsePuck, type CustomField } from "@puckeditor/core";
import {
  type Device,
  type Responsive,
  type Space,
  type Align,
  SPACE_OPTIONS,
  ALIGN_OPTIONS,
} from "../style";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smartphone,
  Tablet,
  Monitor,
  Info,
} from "lucide-react";

export interface ResponsiveOption<T> {
  label: string;
  value: T;
}

export interface ResponsiveSelectProps<T extends string> {
  value?: Responsive<T> | T;
  onChange: (value: Responsive<T>) => void;
  readOnly?: boolean;
  options: ResponsiveOption<T>[];
  defaultValue?: T;
  label?: string;
  isAlignField?: boolean;
}

const usePuckSelected = createUsePuck();

function useActiveViewportDevice(): Device {
  try {
    const currentWidth = usePuckSelected((api) => api.appState?.ui?.viewports?.current?.width);
    if (typeof currentWidth === "number") {
      if (currentWidth <= 500) return "base";
      if (currentWidth <= 950) return "md";
      return "lg";
    }
  } catch {}
  return "base";
}

const SPACE_SHORT_LABELS: Record<string, string> = {
  none: "0",
  sm: "S",
  md: "M",
  lg: "L",
  xl: "XL",
};

/**
 * Compact single-line segmented control for Alignment and Spacing
 */
export function ResponsiveSelect<T extends string>({
  value,
  onChange,
  readOnly,
  options,
  defaultValue,
  label = "Control",
  isAlignField = false,
}: ResponsiveSelectProps<T>) {
  const autoDevice = useActiveViewportDevice();
  const [activeDevice, setActiveDevice] = useState<Device>(autoDevice);

  // Normalize legacy string value
  const normalizedValue: Responsive<T> =
    typeof value === "string" ? { base: value as T } : value || {};

  useEffect(() => {
    setActiveDevice(autoDevice);
  }, [autoDevice]);

  const currentDeviceValue =
    normalizedValue[activeDevice] || (activeDevice === "base" ? defaultValue || options[0]?.value : undefined);

  const handleSelect = (val: string) => {
    if (readOnly) return;
    const next: Responsive<T> = { ...normalizedValue };
    next[activeDevice] = val as T;
    onChange(next);
  };

  return (
    <div className="w-full text-[13px]">
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        {/* Left: Compact Label */}
        <div className="flex items-center gap-1 min-w-0 pr-1">
          <span className="text-[13px] font-medium text-slate-700 truncate" title={label}>
            {label}
          </span>
        </div>

        {/* Right: Segmented Button Control */}
        <div className="flex items-center gap-1 shrink-0">
          {isAlignField ? (
            /* Segmented Align Icons: Left | Center | Right */
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect("left")}
                title="Align Left"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  (currentDeviceValue || "left") === "left"
                    ? "bg-white text-[#0f2142] shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <AlignLeft className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect("center")}
                title="Align Center"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  currentDeviceValue === "center"
                    ? "bg-white text-[#0f2142] shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <AlignCenter className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect("right")}
                title="Align Right"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  currentDeviceValue === "right"
                    ? "bg-white text-[#0f2142] shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <AlignRight className="size-3.5" />
              </button>
            </div>
          ) : (
            /* Segmented Space Pills: 0 | S | M | L | XL */
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {options.map((opt) => {
                const isSelected = (currentDeviceValue || defaultValue) === opt.value;
                const shortLabel = SPACE_SHORT_LABELS[opt.value] || opt.label;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleSelect(opt.value)}
                    title={opt.label}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-[#0f2142] shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Creates a Puck custom field for responsive space selection.
 */
export function createResponsiveSpaceField(
  label: string,
  defaultValue: Space = "none",
): CustomField<Responsive<Space>> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <ResponsiveSelect<Space>
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        options={SPACE_OPTIONS}
        defaultValue={defaultValue}
        label={label}
        isAlignField={false}
      />
    ),
  };
}

/**
 * Creates a Puck custom field for responsive alignment selection.
 */
export function createResponsiveAlignField(
  label: string = "Alignment",
  defaultValue: Align = "left",
): CustomField<Responsive<Align>> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <ResponsiveSelect<Align>
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        options={ALIGN_OPTIONS}
        defaultValue={defaultValue}
        label={label}
        isAlignField={true}
      />
    ),
  };
}

export default ResponsiveSelect;
