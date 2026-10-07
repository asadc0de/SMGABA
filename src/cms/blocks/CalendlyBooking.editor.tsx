import type { ComponentConfig } from "@puckeditor/core";
import { CalendlyBookingRender, type CalendlyBookingProps, defaultCalendlyBookingProps } from "./CalendlyBooking";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createSizeControlsField } from "../fields/SizeControls";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const CalendlyBookingBlock: ComponentConfig<CalendlyBookingProps> = {
  label: "Calendly Calendar",
  defaultProps: defaultCalendlyBookingProps,
  fields: {
    heading: {
      type: "text",
      label: "Heading (Optional)",
    },
    description: {
      type: "textarea",
      label: "Description (Optional)",
    },
    url: {
      type: "text",
      label: "Calendly Link (Must start with https://calendly.com/...)",
    },
    height: {
      type: "select",
      label: "Widget Height",
      options: [
        { label: "Standard (700px - Recommended)", value: "700px" },
        { label: "Compact (600px)", value: "600px" },
        { label: "Tall (800px)", value: "800px" },
        { label: "Extra Tall (900px)", value: "900px" },
      ],
    },
    sizeControls: createSizeControlsField({
      label: "Calendly Box Dimensions (W/H)",
    }),
    sizePercent: createSizeSliderField({
      label: "Container Width Scale (%)",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [60, 75, 90, 100],
    }),
    styleControls: createStyleControlsField({
      label: "Block Styles & Background",
    }),
    animation: createAnimationControlsField({
      label: "Animation & Motion",
    }),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: CalendlyBookingRender,
};
