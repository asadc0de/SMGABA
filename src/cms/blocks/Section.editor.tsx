import type { ComponentConfig } from "@puckeditor/core";
import { SectionRender, type SectionProps, defaultSectionProps } from "./Section";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createImagePickerField } from "../fields/ImagePicker";

export const SectionBlock: ComponentConfig<SectionProps> = {
  label: "Section",
  defaultProps: defaultSectionProps,
  fields: {
    background: {
      type: "select",
      label: "Background Theme",
      options: [
        { label: "None (Transparent)", value: "none" },
        { label: "Pure White", value: "white" },
        { label: "Light Slate (#f8fafc)", value: "light" },
        { label: "Navy Dark Brand (#0f2142)", value: "navy" },
        { label: "Background Image", value: "image" },
      ],
    },
    backgroundImage: createImagePickerField({
      label: "Background Image (when image theme selected)",
      placeholder: "https://... or select from media library",
    }),
    overlayStrength: {
      type: "select",
      label: "Image Overlay Strength",
      options: [
        { label: "Medium Dark (60%)", value: "medium" },
        { label: "Subtle Dark (40%)", value: "subtle" },
        { label: "Heavy Dark (80%)", value: "heavy" },
        { label: "Navy Brand Tint", value: "navy" },
        { label: "None (Transparent)", value: "none" },
      ],
    },
    paddingVertical: {
      type: "select",
      label: "Vertical Padding Preset",
      options: [
        { label: "Standard Spacing (from Spacing controls below)", value: "" },
        { label: "Compact (32px - 40px)", value: "compact" },
        { label: "Normal (48px - 80px)", value: "normal" },
        { label: "Spacious (64px - 128px)", value: "spacious" },
        { label: "Flush / None (0px)", value: "none" },
      ],
    },
    sizePercent: createSizeSliderField({
      label: "Section Container Width",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Constrain the maximum inner container width of this section.",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "none"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "none"),
    paddingTop: createResponsiveSpaceField("Padding Top", "lg"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "lg"),
  },
  render: SectionRender,
};
