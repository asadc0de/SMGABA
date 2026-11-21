import type { ComponentConfig } from "@puckeditor/core";
import { ColumnsRender, type ColumnsProps } from "./Columns";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField, createToggleField } from "../fields/SizeControls";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createSegmentedField } from "../fields/SegmentedControl";
import { createImagePickerField } from "../fields/ImagePicker";

export const ColumnsBlock: ComponentConfig<ColumnsProps> = {
  label: "Columns Layout",
  defaultProps: {
    columns: "2",
    gap: "md",
    sizePercent: 100,
    background: "white",
    overlayStrength: "medium",
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    columns: createSegmentedField({
      label: "Columns",
      options: [
        { label: "2 Cols", value: "2" },
        { label: "3 Cols", value: "3" },
      ],
      defaultValue: "2",
    }),
    gap: createSegmentedField({
      label: "Gap",
      options: [
        { label: "S", value: "sm", description: "Small (16px)" },
        { label: "M", value: "md", description: "Medium (24px)" },
        { label: "L", value: "lg", description: "Large (32px)" },
        { label: "XL", value: "xl", description: "Extra Large (48px)" },
      ],
      defaultValue: "md",
    }),
    background: createSegmentedField({
      label: "Background Style",
      options: [
        { label: "White", value: "white", description: "Clean white card (Default)" },
        { label: "Image", value: "image", description: "Background photo" },
        { label: "Color", value: "color", description: "Custom background color" },
        { label: "Slate", value: "light", description: "Light slate (#f8fafc)" },
        { label: "Navy", value: "navy", description: "Navy brand (#0f2142)" },
        { label: "None", value: "none", description: "Transparent" },
      ],
      defaultValue: "white",
    }),
    backgroundImage: createImagePickerField({
      label: "Background Image (when Image selected)",
      placeholder: "Select image or enter URL",
    }),
    overlayStrength: createSegmentedField({
      label: "Image Dark Overlay",
      options: [
        { label: "None", value: "none" },
        { label: "Subtle", value: "subtle" },
        { label: "Medium", value: "medium" },
        { label: "Heavy", value: "heavy" },
        { label: "Navy", value: "navy" },
      ],
      defaultValue: "medium",
    }),
    backgroundColor: createColorPickerField({
      label: "Custom Background Color",
      description: "Pick color swatch or enter hex color",
    }),
    textColor: createColorPickerField({
      label: "Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Border Color",
    }),
    sizeControls: createSizeControlsField({
      label: "Columns Container Dimensions (W/H)",
      showEqualHeightToggle: true,
    }),
    equalHeightCards: createToggleField({
      label: "Equal column height",
      description: "Stretch columns to match each other's height.",
      defaultValue: true,
    }),
    sizePercent: createSizeSliderField({
      label: "Columns Container Width Scale (%)",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Constrain the maximum grid container width.",
    }),
    styleControls: createStyleControlsField({
      label: "Block Styles & Background",
    }),
    animation: createAnimationControlsField({
      label: "Animation & Motion",
    }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "grid" }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ColumnsRender,
};
