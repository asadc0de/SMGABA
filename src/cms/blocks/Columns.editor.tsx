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

export const ColumnsBlock: ComponentConfig<ColumnsProps> = {
  label: "Columns Layout",
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
    backgroundColor: createColorPickerField({
      label: "Container Background Color",
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
