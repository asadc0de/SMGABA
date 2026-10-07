import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { Check, RotateCcw, Palette } from "lucide-react";

export interface ColorSwatch {
  label: string;
  value: string;
  border?: boolean;
}

export const BRAND_COLOR_SWATCHES: ColorSwatch[] = [
  { label: "Navy Dark Brand", value: "#0f2142" },
  { label: "Slate Charcoal", value: "#1e293b" },
  { label: "Pure White", value: "#ffffff", border: true },
  { label: "Light Surface", value: "#f8fafc", border: true },
  { label: "Subtle Slate", value: "#e2e8f0", border: true },
  { label: "Slate Muted", value: "#64748b" },
  { label: "Amber Gold", value: "#f59e0b" },
  { label: "Emerald Green", value: "#10b981" },
  { label: "Sky Blue", value: "#0284c7" },
  { label: "Transparent", value: "transparent", border: true },
];

export interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  label?: string;
  defaultValue?: string;
  swatches?: ColorSwatch[];
  description?: string;
}

export function ColorPickerInput({
  value = "",
  onChange,
  readOnly = false,
  label = "Color",
  defaultValue = "",
  swatches = BRAND_COLOR_SWATCHES,
  description,
}: ColorPickerProps) {
  const [customHex, setCustomHex] = React.useState<string>(value || defaultValue || "");
  const [isCustomOpen, setIsCustomOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    setCustomHex(value || defaultValue || "");
  }, [value, defaultValue]);

  const handleSelectSwatch = (val: string) => {
    setCustomHex(val);
    onChange(val);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val) || val === "" || val === "transparent") {
      onChange(val);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    onChange(val);
  };

  const isMatchedSwatch = swatches.some(
    (s) => s.value.toLowerCase() === (value || defaultValue || "").toLowerCase()
  );

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl my-1 text-xs">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="size-3 text-slate-500" />
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {value && value !== "transparent" && (
            <div className="flex items-center gap-1">
              <span
                className="size-3.5 rounded-full border border-slate-300 shadow-2xs inline-block"
                style={{ backgroundColor: value }}
              />
              <span className="text-[10px] font-mono text-slate-500 uppercase">{value}</span>
            </div>
          )}
          {value && value !== defaultValue && !readOnly && (
            <button
              type="button"
              onClick={() => {
                setCustomHex(defaultValue);
                onChange(defaultValue);
              }}
              className="text-[10px] text-slate-400 hover:text-navy underline flex items-center gap-0.5 cursor-pointer ml-1"
              title="Reset to default"
            >
              <RotateCcw className="size-2.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {description && (
        <p className="text-[10px] text-slate-500 -mt-0.5 leading-tight">{description}</p>
      )}

      {/* Brand Color Swatches Palette */}
      <div className="flex flex-wrap gap-1.5 pt-0.5 items-center">
        {swatches.map((swatch) => {
          const isSelected =
            (value || defaultValue || "").toLowerCase() === swatch.value.toLowerCase();
          const isTransparent = swatch.value === "transparent";

          return (
            <button
              key={swatch.label}
              type="button"
              disabled={readOnly}
              onClick={() => handleSelectSwatch(swatch.value)}
              title={`${swatch.label} (${swatch.value})`}
              className={`size-6 rounded-lg transition-all duration-150 relative flex items-center justify-center cursor-pointer shadow-2xs hover:scale-110 active:scale-95 ${
                swatch.border ? "border border-slate-300" : ""
              } ${isSelected ? "ring-2 ring-navy ring-offset-1 scale-105" : "hover:border-slate-400"}`}
              style={{
                backgroundColor: isTransparent ? "transparent" : swatch.value,
                backgroundImage: isTransparent
                  ? "repeating-linear-gradient(45deg, #cbd5e1 0, #cbd5e1 2px, #f8fafc 0, #f8fafc 6px)"
                  : "none",
              }}
            >
              {isSelected && (
                <Check
                  className={`size-3 stroke-[3] ${
                    swatch.value === "#ffffff" || swatch.value === "#f8fafc" || isTransparent
                      ? "text-slate-900"
                      : "text-white"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Color Picker & Hex Input */}
      <div className="pt-1 flex items-center gap-2">
        <div className="relative flex items-center size-7 rounded-lg border border-slate-300 overflow-hidden shrink-0 shadow-2xs cursor-pointer hover:border-navy">
          <input
            type="color"
            disabled={readOnly}
            value={
              customHex && customHex.startsWith("#") && customHex.length >= 4
                ? customHex
                : "#0f2142"
            }
            onChange={handleColorInputChange}
            className="absolute -top-2 -left-2 size-11 cursor-pointer border-0 p-0"
            title="Open color wheel"
          />
        </div>

        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            disabled={readOnly}
            value={customHex}
            onChange={handleHexChange}
            placeholder="#HEX or transparent"
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-mono text-slate-800 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Creates a Puck custom field configured with ColorPickerInput.
 */
export function createColorPickerField(options: {
  label?: string;
  defaultValue?: string;
  description?: string;
  swatches?: ColorSwatch[];
} = {}): CustomField<string> {
  const {
    label = "Color",
    defaultValue = "",
    description,
    swatches = BRAND_COLOR_SWATCHES,
  } = options;

  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <ColorPickerInput
        value={typeof value === "string" ? value : defaultValue}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
        defaultValue={defaultValue}
        swatches={swatches}
        description={description}
      />
    ),
  };
}

export default createColorPickerField;
