import type { ComponentConfig } from "@puckeditor/core";
import { StepsRender, type StepsProps, defaultStepsProps } from "./Steps";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const StepsBlock: ComponentConfig<StepsProps> = {
  label: "Steps & Process Flow",
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
    description: {
      type: "textarea",
      label: "Description (Optional)",
    },
    layout: {
      type: "select",
      label: "Layout Orientation",
      options: [
        { label: "Horizontal Grid (Responsive)", value: "horizontal" },
        { label: "Vertical Cards", value: "vertical" },
        { label: "Connected Timeline", value: "timeline" },
      ],
    },
    items: {
      type: "array",
      label: "Process Steps",
      getItemSummary: (item) => item?.title || "New Step",
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
