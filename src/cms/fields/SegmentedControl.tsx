import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { Info } from "lucide-react";

export interface SegmentedOption<T extends string | number = string> {
  label: string;
  value: T;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface SegmentedControlProps<T extends string | number = string> {
  value?: T;
  onChange: (value: T) => void;
  readOnly?: boolean;
  options: SegmentedOption<T>[];
  defaultValue?: T;
  label?: string;
  description?: string;
  fullWidth?: boolean;
}

/**
 * Compact Single-Row Segmented Button Control
 * Replaces dropdowns when 2 to 4 (or 5) options exist.
 */
export function SegmentedControl<T extends string | number = string>({
  value,
  onChange,
  readOnly = false,
  options,
  defaultValue,
  label,
  description,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  const currentVal = value !== undefined ? value : defaultValue ?? options[0]?.value;

  // Determine if labels are short enough to fit horizontally on the right
  const isCompactRow = !fullWidth && options.length <= 4 && options.every((o) => o.label.length <= 8);

  if (isCompactRow && label) {
    return (
      <div className="w-full text-[13px]">
        <div className="flex items-center justify-between gap-2 min-h-[32px]">
          {/* Left: Compact Label */}
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

          {/* Right: Segmented Buttons */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
            {options.map((opt) => {
              const isSelected = String(currentVal) === String(opt.value);
              const Icon = opt.icon;

              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  disabled={readOnly}
                  onClick={() => onChange(opt.value)}
                  title={opt.description || opt.label}
                  className={`flex items-center justify-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#0f2142] shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {Icon && <Icon className="size-3 shrink-0" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Full-width layout for longer option labels or when no label is provided
  return (
    <div className="w-full space-y-1.5 text-[13px]">
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[13px] font-medium text-slate-700 truncate" title={label}>
              {label}
            </span>
            {description && (
              <span className="text-slate-400 hover:text-slate-600 cursor-help" title={description}>
                <Info className="size-3" />
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid bg-slate-100 p-0.5 rounded-lg border border-slate-200" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((opt) => {
          const isSelected = String(currentVal) === String(opt.value);
          const Icon = opt.icon;

          return (
            <button
              key={String(opt.value)}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(opt.value)}
              title={opt.description || opt.label}
              className={`flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer truncate ${
                isSelected
                  ? "bg-white text-[#0f2142] shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {Icon && <Icon className="size-3 shrink-0" />}
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Creates a Puck custom field for segmented buttons.
 */
export function createSegmentedField<T extends string | number = string>(options: {
  label?: string;
  options: SegmentedOption<T>[];
  defaultValue?: T;
  description?: string;
  fullWidth?: boolean;
}): CustomField<T> {
  const { label, options: opts, defaultValue, description, fullWidth } = options;

  return {
    type: "custom",
    label: label || "Option",
    render: ({ value, onChange, readOnly }) => (
      <SegmentedControl<T>
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        options={opts}
        defaultValue={defaultValue}
        label={label}
        description={description}
        fullWidth={fullWidth}
      />
    ),
  };
}

export default createSegmentedField;
