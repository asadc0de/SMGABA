import type { ComponentConfig } from "@puckeditor/core";
import { StatsRender, type StatsProps, defaultStatsProps } from "./Stats";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField, createToggleField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const StatsBlock: ComponentConfig<StatsProps> = {
  label: "Stats",
  defaultProps: defaultStatsProps,
  fields: {
    heading: {
      type: "text",
      label: "Heading (Optional)",
    },
    description: {
      type: "textarea",
      label: "Description (Optional)",
    },
    numberTypography: createTypographyField({
      label: "Stat Numbers Typography",
    }),
    labelTypography: createTypographyField({
      label: "Stat Subtitle Labels Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Cards/Container)",
      showApplyToChildren: true,
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance & Stagger)",
      showStaggerToggle: true,
    }),
    columns: {
      type: "select",
      label: "Grid Columns (Desktop)",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns (Default)", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    },
    theme: {
      type: "select",
      label: "Visual Theme Preset",
      options: [
        { label: "Navy Dark Brand (#0f2142)", value: "navy" },
        { label: "Light Slate Card", value: "light" },
      ],
    },
    backgroundColor: createColorPickerField({
      label: "Custom Container Background Color",
    }),
    textColor: createColorPickerField({
      label: "Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Border Color",
    }),
    sizeControls: createSizeControlsField({
      label: "Container Dimensions (Width & Height)",
      showMultiItemControls: true,
      showEqualHeightToggle: true,
    }),
    sameItemSize: createToggleField({
      label: "Apply same size to all items",
      description: "Force all stat items to have equal width and height.",
    }),
    equalHeightCards: createToggleField({
      label: "Equal height cards",
      description: "Ensure all stats items stretch to equal matching height.",
      defaultValue: true,
    }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "grid" }),
    items: {
      type: "array",
      label: "Stat Items",
      min: 1,
      getItemSummary: (item, idx) => item?.label ? `${item.prefix || ""}${item.value || "0"}${item.suffix || ""} - ${item.label}` : `Stat #${(idx ?? 0) + 1}`,
      arrayFields: {
        value: {
          type: "text",
          label: "Value (e.g. 40, 2500, or text like Decades)",
        },
        prefix: {
          type: "text",
          label: "Prefix (Optional, e.g. $)",
        },
        suffix: {
          type: "text",
          label: "Suffix (Optional, e.g. + or %)",
        },
        label: {
          type: "text",
          label: "Stat Label (e.g. Clients Served)",
        },
      },
      defaultItemProps: {
        value: "100",
        suffix: "%",
        label: "Client Retention",
      },
    },
    sizePercent: createSizeSliderField({
      label: "Container Width",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [60, 75, 90, 100],
    }),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: StatsRender,
};

export default StatsBlock;
