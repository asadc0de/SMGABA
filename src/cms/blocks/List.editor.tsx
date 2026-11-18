import type { ComponentConfig } from "@puckeditor/core";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createColorPickerField } from "../fields/ColorPicker";
import { createResponsiveAlignField, createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeControlsField } from "../fields/SizeControls";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createStyleControlsField } from "../fields/StyleControls";
import { createTypographyField } from "../fields/TextFormatting";
import { defaultListProps, ListRender, type ListProps } from "./List";

export const ListBlock: ComponentConfig<ListProps> = {
  label: "Bullet / Numbered List",
  defaultProps: defaultListProps,
  fields: {
    heading: {
      type: "text",
      label: "Heading (Optional)",
    },
    content: {
      type: "textarea",
      label: "List Items (one item per line)",
    },
    markerStyle: {
      type: "select",
      label: "Marker Style",
      options: [
        { label: "Bullet", value: "bullet" },
        { label: "Numbered", value: "number" },
        { label: "Checkmarks", value: "check" },
        { label: "Arrows", value: "arrow" },
      ],
    },
    design: {
      type: "select",
      label: "List Design",
      options: [
        { label: "Simple", value: "plain" },
        { label: "Cards", value: "cards" },
        { label: "Highlighted", value: "highlighted" },
        { label: "Dividers", value: "dividers" },
      ],
    },
    columns: {
      type: "select",
      label: "Card Columns",
      options: [
        { label: "One Column", value: "1" },
        { label: "Two Columns", value: "2" },
      ],
    },
    typography: createTypographyField({ label: "List Text Typography" }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance",
      showApplyToChildren: true,
    }),
    animation: createAnimationControlsField({ label: "Micro Animations" }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
    sizeControls: createSizeControlsField({ label: "Container Dimensions" }),
    sizePercent: createSizeSliderField({
      label: "Container Width Scale (%)",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [60, 75, 90, 100],
    }),
    textColor: createColorPickerField({ label: "Text Color" }),
    backgroundColor: createColorPickerField({ label: "Background Color" }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ListRender,
};

export default ListBlock;
