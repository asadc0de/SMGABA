import type { ComponentConfig } from "@puckeditor/core";
import { RichTextRender, type RichTextProps } from "./RichText";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const RichTextBlock: ComponentConfig<RichTextProps> = {
  label: "Rich Text",
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
    sizePercent: createSizeSliderField({
      label: "Text Size / Scale",
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

