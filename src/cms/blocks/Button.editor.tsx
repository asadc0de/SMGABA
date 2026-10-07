import * as React from "react";
import type { ComponentConfig } from "@puckeditor/core";
import { ButtonRender, type ButtonBlockProps, type ButtonVariant, type ButtonSize } from "./Button";
import { createLinkPickerField } from "../fields/LinkPicker";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { Check } from "lucide-react";

const BUTTON_VARIANTS: { id: ButtonVariant; label: string; bgClass: string; textClass: string; borderClass: string }[] = [
  { id: "primary", label: "Navy Brand", bgClass: "bg-[#0f2142]", textClass: "text-white", borderClass: "border-[#0f2142]" },
  { id: "gradient", label: "Blue Gradient", bgClass: "bg-gradient-to-r from-[#1e40af] to-[#2563eb]", textClass: "text-white", borderClass: "border-blue-600" },
  { id: "secondary", label: "Light Slate", bgClass: "bg-slate-100", textClass: "text-slate-800", borderClass: "border-slate-300" },
  { id: "outline", label: "Navy Outline", bgClass: "bg-transparent", textClass: "text-[#0f2142]", borderClass: "border-2 border-[#0f2142]" },
  { id: "white", label: "White Solid", bgClass: "bg-white", textClass: "text-[#0f2142]", borderClass: "border-slate-300 shadow-2xs" },
];

const BUTTON_SIZES: { id: ButtonSize; label: string; desc: string }[] = [
  { id: "sm", label: "Small", desc: "Compact" },
  { id: "md", label: "Medium", desc: "Standard" },
  { id: "lg", label: "Large", desc: "Prominent" },
];

import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const ButtonBlock: ComponentConfig<ButtonBlockProps> = {
  label: "Button",
  defaultProps: {
    label: "Learn More",
    url: "/contact",
    variant: "primary",
    size: "md",
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    label: {
      type: "text",
      label: "Button Label",
    },
    typography: createTypographyField({
      label: "Button Label Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Background, Shadow, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Hover, Click & Scroll)",
    }),
    url: createLinkPickerField({
      label: "Button Destination Link",
      placeholder: "Select site page or enter link",
    }),
    variant: {
      type: "custom",
      label: "Button Style & Color",
      render: ({ value, onChange, readOnly }) => {
        const currentVariant = (value as ButtonVariant) || "primary";
        return (
          <div className="flex flex-col gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl my-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Color Style Swatch
            </span>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {BUTTON_VARIANTS.map((v) => {
                const isSelected = currentVariant === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onChange(v.id)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                      isSelected
                        ? "ring-2 ring-navy border-navy bg-white shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-6 w-14 rounded-full flex items-center justify-center text-[10px] font-semibold px-2 ${v.bgClass} ${v.textClass} ${v.borderClass}`}>
                        Btn
                      </div>
                      <span className="text-xs font-medium text-slate-800">{v.label}</span>
                    </div>
                    {isSelected && (
                      <div className="size-4 rounded-full bg-navy text-white flex items-center justify-center shrink-0">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      },
    },
    backgroundColor: createColorPickerField({
      label: "Custom Background Color",
      description: "Overrides default button background",
    }),
    textColor: createColorPickerField({
      label: "Custom Text Color",
      description: "Overrides button text color",
    }),
    borderColor: createColorPickerField({
      label: "Custom Border Color",
      description: "Overrides button outline/border color",
    }),
    sizeControls: createSizeControlsField({
      label: "Button Dimensions (Width & Height)",
      defaultWidthType: "auto",
      defaultHeightType: "auto",
    }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "inline" }),
    size: {
      type: "custom",
      label: "Button Size",
      render: ({ value, onChange, readOnly }) => {
        const currentSize = (value as ButtonSize) || "md";
        return (
          <div className="flex flex-col gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-xl my-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Button Size
            </span>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {BUTTON_SIZES.map((s) => {
                const isSelected = currentSize === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onChange(s.id)}
                    className={`py-2 px-1 text-center rounded-lg border transition-all ${
                      isSelected
                        ? "bg-navy text-white border-navy font-bold shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div className="text-xs">{s.label}</div>
                    <div className={`text-[10px] ${isSelected ? "text-blue-200" : "text-slate-400"}`}>
                      {s.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      },
    },
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ButtonRender,
};

export default ButtonBlock;
