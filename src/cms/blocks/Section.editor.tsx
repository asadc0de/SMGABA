import type { ComponentConfig } from "@puckeditor/core";
import { SectionRender, type SectionProps } from "./Section";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const SectionBlock: ComponentConfig<SectionProps> = {
  label: "Section",
  defaultProps: {
    sizePercent: 100,
    align: { base: "left" },
    marginTop: { base: "none" },
    marginBottom: { base: "none" },
    paddingTop: { base: "lg" },
    paddingBottom: { base: "lg" },
  },
  fields: {
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
