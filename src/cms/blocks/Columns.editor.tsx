import type { ComponentConfig } from "@puckeditor/core";
import { ColumnsRender, type ColumnsProps } from "./Columns";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const ColumnsBlock: ComponentConfig<ColumnsProps> = {
  label: "Columns",
  defaultProps: {
    columns: "2",
    gap: "md",
    sizePercent: 100,
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    columns: {
      type: "select",
      label: "Number of Columns",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
      ],
    },
    gap: {
      type: "select",
      label: "Column Spacing / Gap",
      options: [
        { label: "Small (16px)", value: "sm" },
        { label: "Medium (24-32px)", value: "md" },
        { label: "Large (32-48px)", value: "lg" },
        { label: "Extra Large (48-64px)", value: "xl" },
      ],
    },
    sizePercent: createSizeSliderField({
      label: "Columns Container Width",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Constrain the maximum grid container width.",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ColumnsRender,
};
