import type { ComponentConfig } from "@puckeditor/core";
import { SectionRender, type SectionProps, defaultSectionProps } from "./Section";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField } from "../fields/SizeControls";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createImagePickerField } from "../fields/ImagePicker";
import { createSegmentedField } from "../fields/SegmentedControl";

export const SectionBlock: ComponentConfig<SectionProps> = {
  label: "Container Section",
  defaultProps: defaultSectionProps,
  fields: {
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Background, Shadow, Borders, Spacing)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance Effects)",
    }),
    background: {
      type: "select",
      label: "Background Theme Preset",
      options: [
        { label: "None (Transparent / Custom)", value: "none" },
        { label: "Pure White", value: "white" },
        { label: "Light Slate (#f8fafc)", value: "light" },
        { label: "Navy Dark Brand (#0f2142)", value: "navy" },
        { label: "Background Image", value: "image" },
      ],
    },
    backgroundColor: createColorPickerField({
      label: "Custom Background Color",
      description: "Pick a brand swatch or enter custom hex color.",
    }),
    textColor: createColorPickerField({
      label: "Custom Text Color",
      description: "Applies custom font color to elements inside section.",
    }),
    borderColor: createColorPickerField({
      label: "Border Color",
      description: "Adds top and bottom divider border color.",
    }),
    backgroundImage: createImagePickerField({
      label: "Background Image (when image theme selected)",
      placeholder: "https://... or select from media library",
    }),
    overlayStrength: createSegmentedField({
      label: "Image Overlay",
      options: [
        { label: "None", value: "none" },
        { label: "Subtle", value: "subtle" },
        { label: "Med", value: "medium" },
        { label: "Heavy", value: "heavy" },
      ],
      defaultValue: "none",
    }),
    paddingVertical: createSegmentedField({
      label: "Padding",
      options: [
        { label: "0", value: "none", description: "Flush (0px)" },
        { label: "S", value: "compact", description: "Compact" },
        { label: "M", value: "normal", description: "Normal" },
        { label: "L", value: "spacious", description: "Spacious" },
      ],
      defaultValue: "normal",
    }),
    sizeControls: createSizeControlsField({
      label: "Section Container Dimensions (W/H)",
    }),
    sizePercent: createSizeSliderField({
      label: "Section Container Width Scale (%)",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Constrain the maximum inner container width of this section.",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
    marginTop: createResponsiveSpaceField("Margin Top", "none"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "none"),
    paddingTop: createResponsiveSpaceField("Padding Top", "lg"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "lg"),
  },
  render: SectionRender,
};

export default SectionBlock;
