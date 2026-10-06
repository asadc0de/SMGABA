import type { ComponentConfig } from "@puckeditor/core";
import { CalendlyBookingRender, type CalendlyBookingProps, defaultCalendlyBookingProps } from "./CalendlyBooking";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const CalendlyBookingBlock: ComponentConfig<CalendlyBookingProps> = {
  label: "Calendly Booking Embed",
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
  render: CalendlyBookingRender,
};
