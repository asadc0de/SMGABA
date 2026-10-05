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
  } catch {
    // Graceful fallback outside Puck context
  }
  return "base";
}

export function ResponsiveSelect<T extends string>({
  value,
  onChange,
  readOnly,
  options,
  defaultValue,
}: ResponsiveSelectProps<T>) {
  const autoDevice = useActiveViewportDevice();
  const [activeTab, setActiveTab] = useState<Device>(autoDevice);

  // Normalize legacy string value (e.g. "left") to { base: "left" }
  const normalizedValue: Responsive<T> =
    typeof value === "string" ? { base: value as T } : (value || {});

  // Sync active tab with Puck viewport switcher changes
  useEffect(() => {
    setActiveTab(autoDevice);
  }, [autoDevice]);

  const currentDeviceValue = normalizedValue[activeTab];

  function handleSelect(newVal: string) {
    if (readOnly) return;

    const next: Responsive<T> = { ...normalizedValue };
    if (newVal === "__inherit__" || newVal === "") {
      delete next[activeTab];
    } else {
      next[activeTab] = newVal as T;
    }
    onChange(next);
  }

  // Resolve what value cascades down to tablet / desktop when unset
  const resolvedBase = normalizedValue.base || defaultValue || options[0]?.value;
  const resolvedMd = normalizedValue.md || resolvedBase;

  const inheritLabel =
    activeTab === "md"
      ? `Inherit from Mobile (${options.find((o) => o.value === resolvedBase)?.label || resolvedBase})`
      : activeTab === "lg"
        ? `Inherit from Tablet (${options.find((o) => o.value === resolvedMd)?.label || resolvedMd})`
        : "";

  return (
    <div className="flex flex-col gap-2 w-full pt-1 pb-2">
      {/* Device Switcher Tabs */}
      <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("base")}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
            activeTab === "base"
              ? "bg-white text-navy shadow-xs font-semibold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Mobile
          {normalizedValue.base && <span className="ml-1 text-[10px] text-primary">●</span>}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("md")}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
            activeTab === "md"
              ? "bg-white text-navy shadow-xs font-semibold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Tablet
          {normalizedValue.md && <span className="ml-1 text-[10px] text-primary">●</span>}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("lg")}
          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
            activeTab === "lg"
              ? "bg-white text-navy shadow-xs font-semibold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Desktop
          {normalizedValue.lg && <span className="ml-1 text-[10px] text-primary">●</span>}
        </button>
      </div>

      {/* Value Selector for Active Device */}
      <select
        value={currentDeviceValue || (activeTab === "base" ? defaultValue || "" : "__inherit__")}
        disabled={readOnly}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        {activeTab !== "base" && (
          <option value="__inherit__" className="text-slate-400 font-medium">
            {inheritLabel}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
      />
    ),
  };
}
