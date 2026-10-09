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
import { createTypographyField, createFontSizePixelField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createSegmentedField } from "../fields/SegmentedControl";

export const ButtonBlock: ComponentConfig<ButtonBlockProps> = {
  label: "Button",
  defaultProps: {
    label: "Learn More",
    url: "/contact",
    variant: "primary",
    size: "md",
    align: { base: "left" },
    marginTop: { base: "none" },
    marginBottom: { base: "none" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
    advancedLayout: { display: "inline" },
  },
  fields: {
    label: {
      type: "text",
      label: "Button Label",
    },
    fontSizePx: createFontSizePixelField({
      label: "Explicit Button Font Size (px)",
      description: "Set explicit font size in pixels (e.g. 14px, 16px, 18px).",
      min: 10,
      max: 36,
    }),
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
    variant: createSegmentedField<ButtonVariant>({
      label: "Button Style",
      options: [
        { label: "Navy", value: "primary", description: "Brand Navy Solid" },
        { label: "Gradient", value: "gradient", description: "Blue Gradient" },
        { label: "Slate", value: "secondary", description: "Light Slate" },
        { label: "Outline", value: "outline", description: "Navy Outline" },
        { label: "White", value: "white", description: "White Solid" },
      ],
      defaultValue: "primary",
      fullWidth: true,
    }),
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
    size: createSegmentedField<ButtonSize>({
      label: "Button Size",
      options: [
        { label: "Small", value: "sm", description: "Compact" },
        { label: "Medium", value: "md", description: "Standard" },
        { label: "Large", value: "lg", description: "Prominent" },
      ],
      defaultValue: "md",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ButtonRender,
};

export default ButtonBlock;
