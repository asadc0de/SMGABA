import type { ComponentConfig } from "@puckeditor/core";
import { RichTextRender, type RichTextProps } from "./RichText";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";

export const RichTextBlock: ComponentConfig<RichTextProps> = {
  label: "Text",
  defaultProps: {
    content:
      "Craft compelling stories and share information with your audience. This section supports multiple paragraphs and responsive typography.",
    sizePercent: 100,
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    content: {
      type: "textarea",
      label: "Text Content",
    },
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Background, Shadow, Borders, Padding)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Scroll & Hover)",
    }),
    fontSizePx: createFontSizePixelField({
      label: "Explicit Font Size (px)",
      description: "Set direct paragraph text size in pixels (e.g. 16px, 18px, 20px).",
      min: 10,
      max: 48,
    }),
    typography: createTypographyField({
      label: "Text Typography & Formatting",
    }),
    textColor: createColorPickerField({
      label: "Text Color",
    }),
    backgroundColor: createColorPickerField({
      label: "Background Color (Optional)",
    }),
    borderColor: createColorPickerField({
      label: "Border Color (Optional)",
    }),
    sizeControls: createSizeControlsField({
      label: "Text Block Dimensions (W/H)",
    }),
    sizePercent: createSizeSliderField({
      label: "Text Font Size Scale (%)",
      min: 60,
      max: 160,
      step: 5,
      defaultValue: 100,
      presets: [70, 85, 100, 115, 130, 150],
      description: "Adjust the visual reading scale of this paragraph text.",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: RichTextRender,
};

export default RichTextBlock;

