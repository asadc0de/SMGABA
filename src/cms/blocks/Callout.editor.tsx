import type { ComponentConfig } from "@puckeditor/core";
import { CalloutRender, type CalloutProps, defaultCalloutProps } from "./Callout";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const CalloutBlock: ComponentConfig<CalloutProps> = {
  label: "Callout / Notice",
  defaultProps: defaultCalloutProps,
  fields: {
    variant: {
      type: "select",
      label: "Callout Variant / Mood",
      options: [
        { label: "Information (Brand Blue)", value: "info" },
        { label: "Success / Positive (Emerald)", value: "success" },
        { label: "Warning / Attention (Amber)", value: "warning" },
        { label: "Important / Priority (Navy)", value: "important" },
      ],
    },
    title: {
      type: "text",
      label: "Notice Title (Optional)",
    },
    text: {
      type: "textarea",
      label: "Notice Message (Multi-line supported)",
    },
    buttonLabel: {
      type: "text",
      label: "Button Label (Optional)",
    },
    buttonHref: {
      type: "text",
      label: "Button URL (/solutions, https://...)",
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
  render: CalloutRender,
};
