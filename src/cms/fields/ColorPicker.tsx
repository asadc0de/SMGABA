import * as React from "react";
import { type CustomField } from "@puckeditor/core";
import { Check, Plus, RotateCcw, X, Info } from "lucide-react";

export interface ColorSwatch {
  label: string;
  value: string;
  border?: boolean;
}

// 6 Curated primary brand dots + transparent
export const BRAND_COLOR_SWATCHES: ColorSwatch[] = [
  { label: "Navy Dark Brand", value: "#0f2142" },
  { label: "Slate Charcoal", value: "#1e293b" },
  { label: "Slate Muted", value: "#64748b" },
  { label: "Light Slate", value: "#f1f5f9", border: true },
  { label: "Pure White", value: "#ffffff", border: true },
  { label: "Amber Accent", value: "#f59e0b" },
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

/**
 * Ultra-compact single-row Color Picker with 6 round dots + '+' custom picker
 */
export function ColorPickerInput({
  value = "",
  onChange,
  readOnly = false,
  label = "Color",
  defaultValue = "",
  swatches = BRAND_COLOR_SWATCHES,
  description,
}: ColorPickerProps) {
  const [isCustomOpen, setIsCustomOpen] = React.useState<boolean>(false);
  const [customHex, setCustomHex] = React.useState<string>(value || defaultValue || "");

  React.useEffect(() => {
    setCustomHex(value || defaultValue || "");
  }, [value, defaultValue]);

  const handleSelectSwatch = (val: string) => {
    setCustomHex(val);
    onChange(val);
    setIsCustomOpen(false);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val) || val === "" || val === "transparent") {
      onChange(val);
    }
  };

  const handleColorWheelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    onChange(val);
  };

  const currentValLower = (value || defaultValue || "").toLowerCase();
  const isPresetSelected = swatches.some((s) => s.value.toLowerCase() === currentValLower);
  const isCustomActive = Boolean(value && !isPresetSelected && value !== "transparent");

  return (
    <div className="w-full text-[13px]">
      {/* Single Compact Row: Label on Left, 6 Swatches + '+' on Right */}
      <div className="flex items-center justify-between gap-2 min-h-[32px]">
        {/* Left: Label with optional tooltip info icon */}
        <div className="flex items-center gap-1 min-w-0 pr-1">
          <span className="text-[13px] font-medium text-slate-700 truncate" title={label}>
            {label}
          </span>
          {description && (
            <span
              className="text-slate-400 hover:text-slate-600 cursor-help"
              title={description}
            >
              <Info className="size-3" />
            </span>
          )}
        </div>

        {/* Right: 6 Round Swatch Dots + '+' Custom button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {swatches.map((swatch) => {
            const isSelected = currentValLower === swatch.value.toLowerCase();
            const isLight = swatch.value === "#ffffff" || swatch.value === "#f1f5f9";

            return (
              <button
                key={swatch.value}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectSwatch(swatch.value)}
                title={`${swatch.label} (${swatch.value})`}
                className={`size-5 rounded-full transition-all duration-150 relative flex items-center justify-center cursor-pointer ${
                  swatch.border ? "border border-slate-300" : "border border-transparent"
                } ${
                  isSelected
                    ? "ring-2 ring-[#0f2142] ring-offset-1 scale-110 shadow-2xs z-10"
                    : "hover:scale-110 hover:border-slate-400 opacity-90 hover:opacity-100"
                }`}
                style={{ backgroundColor: swatch.value }}
              >
                {isSelected && (
                  <Check
                    className={`size-2.5 stroke-[3] ${isLight ? "text-slate-900" : "text-white"}`}
                  />
                )}
              </button>
            );
          })}

          {/* '+' Button for Custom Color / Hex Popover */}
          <div className="relative">
            <button
              type="button"
              disabled={readOnly}
              onClick={() => setIsCustomOpen(!isCustomOpen)}
              title={isCustomActive ? `Custom: ${value}` : "Pick custom color"}
              className={`size-5 rounded-full border transition-all flex items-center justify-center cursor-pointer text-xs ${
                isCustomActive
                  ? "ring-2 ring-[#0f2142] ring-offset-1 shadow-2xs"
                  : isCustomOpen
                  ? "border-[#0f2142] bg-slate-100 text-[#0f2142]"
                  : "border-slate-300 hover:border-slate-400 bg-white text-slate-500 hover:text-slate-800"
              }`}
              style={{
                backgroundColor: isCustomActive ? value : undefined,
              }}
            >
              {isCustomActive ? (
                <Check className="size-2.5 text-white stroke-[3]" />
              ) : (
                <Plus className="size-3 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Custom Color Picker Bar (Only opens when '+' is pressed) */}
      {isCustomOpen && (
        <div className="mt-2 p-2 rounded-lg border border-slate-200 bg-slate-50/90 flex items-center gap-2 animate-in fade-in duration-100">
          {/* Native Color Wheel Swatch */}
          <div className="relative size-6 rounded-md border border-slate-300 overflow-hidden shrink-0 shadow-2xs cursor-pointer">
            <input
              type="color"
              disabled={readOnly}
              value={customHex && customHex.startsWith("#") && customHex.length >= 4 ? customHex : "#0f2142"}
              onChange={handleColorWheelChange}
              className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0"
              title="Open native color wheel"
            />
          </div>

          {/* Direct Hex Input */}
          <input
            type="text"
            disabled={readOnly}
            value={customHex}
            onChange={handleHexChange}
            placeholder="#HEX or transparent"
            className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[12px] font-mono text-slate-800 outline-none focus:border-[#0f2142] focus:ring-1 focus:ring-[#0f2142]"
            autoFocus
          />

          {/* Clear / Reset button */}
          {value && value !== defaultValue && (
            <button
              type="button"
              onClick={() => {
                setCustomHex(defaultValue);
                onChange(defaultValue);
                setIsCustomOpen(false);
              }}
              title="Reset to default"
              className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <RotateCcw className="size-3" />
            </button>
          )}

          {/* Close custom popup button */}
          <button
            type="button"
            onClick={() => setIsCustomOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
            title="Done"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
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
