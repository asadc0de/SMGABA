import type { ComponentConfig } from "@puckeditor/core";
import { StepsRender, type StepsProps, defaultStepsProps } from "./Steps";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField, createToggleField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const StepsBlock: ComponentConfig<StepsProps> = {
  label: "Process Steps",
  defaultProps: defaultStepsProps,
  fields: {
    eyebrow: {
      type: "text",
      label: "Eyebrow (Optional)",
    },
    heading: {
      type: "text",
      label: "Main Heading (Optional)",
    },
    titleTypography: createTypographyField({
      label: "Step Titles Typography",
    }),
    description: {
      type: "textarea",
      label: "Description (Optional)",
    },
    bodyTypography: createTypographyField({
      label: "Step Descriptions Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Steps/Container)",
      showApplyToChildren: true,
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance & Stagger)",
      showStaggerToggle: true,
    }),
    layout: {
      type: "select",
      label: "Layout Orientation",
      options: [
        { label: "Horizontal Grid (Responsive)", value: "horizontal" },
        { label: "Vertical Cards", value: "vertical" },
        { label: "Connected Timeline", value: "timeline" },
      ],
    },
    backgroundColor: createColorPickerField({
      label: "Card Background Color",
      description: "Background color for individual step cards",
    }),
    textColor: createColorPickerField({
      label: "Text Color",
      description: "Custom text color for step cards",
    }),
    borderColor: createColorPickerField({
      label: "Border Color",
      description: "Custom border color for step cards",
    }),
    sizeControls: createSizeControlsField({
      label: "Container Dimensions (Width & Height)",
      showMultiItemControls: true,
      showEqualHeightToggle: true,
    }),
    sameItemSize: createToggleField({
      label: "Apply same size to all items",
      description: "Force all step cards to have equal width and height.",
    }),
    equalHeightCards: createToggleField({
      label: "Equal height cards",
      description: "Ensure all step cards stretch to equal matching height.",
      defaultValue: true,
    }),
    advancedLayout: createAdvancedLayoutField({
      defaultDisplay: "grid",
    }),
    items: {
      type: "array",
      label: "Process Steps",
      min: 1,
      getItemSummary: (item, idx) => item?.title ? `Step ${(item.stepNumber || (idx ?? 0) + 1)}: ${item.title}` : `Step #${(idx ?? 0) + 1}`,
      arrayFields: {
        stepNumber: {
          type: "text",
          label: "Step Badge (e.g. 01, A, Step 1 - Optional)",
        },
        title: {
          type: "text",
          label: "Step Title",
        },
        text: {
          type: "textarea",
          label: "Step Description",
        },
      },
      defaultItemProps: {
        stepNumber: "01",
        title: "Step Title",
        text: "Describe the specific actions and outcomes for this step.",
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
  render: StepsRender,
};
