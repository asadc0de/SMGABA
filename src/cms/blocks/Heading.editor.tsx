import type { ComponentConfig } from "@puckeditor/core";
import { HeadingRender, type HeadingProps } from "./Heading";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createTypographyField, createFontSizePixelField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";

export const HeadingBlock: ComponentConfig<HeadingProps> = {
  label: "Heading",
  defaultProps: {
    text: "Your Heading Title",
    level: "h2",
    sizePercent: 100,
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    text: {
      type: "text",
      label: "Heading Text",
    },
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
    level: {
      type: "select",
      label: "Heading Level",
      options: [
        { label: "H1 - Primary Heading", value: "h1" },
        { label: "H2 - Section Heading", value: "h2" },
        { label: "H3 - Subheading", value: "h3" },
      ],
    },
    fontSizePx: createFontSizePixelField({
      label: "Explicit Font Size (px)",
      description: "Set direct pixel font size (e.g. 36px, 48px, 64px).",
      min: 12,
      max: 120,
    }),
    typography: createTypographyField({
      label: "Heading Typography & Text Formatting",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Background, Shadow, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Scroll & Hover)",
    }),
    textColor: createColorPickerField({
      label: "Heading Text Color",
    }),
    backgroundColor: createColorPickerField({
      label: "Background Highlight Color (Optional)",
    }),
    borderColor: createColorPickerField({
      label: "Border Color (Optional)",
    }),
    sizeControls: createSizeControlsField({
      label: "Heading Box Dimensions (W/H)",
    }),
    sizePercent: createSizeSliderField({
      label: "Heading Font Size Scale (%)",
      min: 50,
      max: 200,
      step: 5,
      defaultValue: 100,
      presets: [50, 75, 100, 125, 150, 200],
      description: "Adjust the visual font size scale of this heading.",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: HeadingRender,
};

export default HeadingBlock;
