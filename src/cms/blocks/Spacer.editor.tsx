import type { ComponentConfig } from "@puckeditor/core";
import { SpacerRender, type SpacerProps, defaultSpacerProps } from "./Spacer";
import { createSizeSliderField } from "../fields/SizeSlider";

export const SpacerBlock: ComponentConfig<SpacerProps> = {
  label: "Spacer & Divider",
  defaultProps: defaultSpacerProps,
  fields: {
    size: {
      type: "select",
      label: "Vertical Spacing Height",
      options: [
        { label: "Extra Small (8px)", value: "xs" },
        { label: "Small (16px)", value: "sm" },
        { label: "Medium (32px - Default)", value: "md" },
        { label: "Large (64px)", value: "lg" },
        { label: "Extra Large (96px)", value: "xl" },
        { label: "Custom Height (px)", value: "custom" },
      ],
    },
    customPx: createSizeSliderField({
      label: "Custom Height (8px - 240px)",
      min: 8,
      max: 240,
      step: 4,
      defaultValue: 40,
      presets: [16, 32, 48, 64, 96, 128, 160, 200, 240],
      description: "Applies when 'Custom Height' is selected above.",
    }),
    divider: {
      type: "select",
      label: "Optional Divider Line",
      options: [
        { label: "None (Empty Space)", value: "none" },
        { label: "Solid Line", value: "line" },
        { label: "Dotted Line", value: "dotted" },
        { label: "Brand Blue Gradient Line", value: "gradient" },
      ],
    },
    dividerWidth: {
      type: "select",
      label: "Divider Width",
      options: [
        { label: "Standard Container (Max 6XL)", value: "container" },
        { label: "Full Width (Edge-to-Edge)", value: "full" },
        { label: "Short Accent (Centered 160px)", value: "short" },
      ],
    },
  },
  render: SpacerRender,
};
