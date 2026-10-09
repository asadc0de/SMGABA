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
