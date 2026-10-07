import type { ComponentConfig } from "@puckeditor/core";
import { CalloutRender, type CalloutProps, defaultCalloutProps } from "./Callout";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";

export const CalloutBlock: ComponentConfig<CalloutProps> = {
  label: "Notice Box",
  defaultProps: defaultCalloutProps,
  fields: {
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Background, Shadow, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance Effects)",
    }),
    variant: {
      type: "select",
      label: "Notice Type Preset",
      options: [
        { label: "Information (Blue)", value: "info" },
        { label: "Success (Green)", value: "success" },
        { label: "Warning (Amber)", value: "warning" },
        { label: "Important (Navy)", value: "important" },
      ],
    },
    title: {
      type: "text",
      label: "Notice Title (Optional)",
    },
    titleTypography: createTypographyField({
      label: "Notice Title Typography",
    }),
    text: {
      type: "textarea",
      label: "Notice Text",
    },
    bodyTypography: createTypographyField({
      label: "Notice Body Typography",
    }),
    backgroundColor: createColorPickerField({
      label: "Custom Background Color",
    }),
    textColor: createColorPickerField({
      label: "Custom Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Custom Border Color",
    }),
    buttonLabel: {
      type: "text",
      label: "Button Text (Optional)",
    },
    buttonHref: createLinkPickerField({
      label: "Button Link",
      placeholder: "Select page or enter link",
    }),
    sizeControls: createSizeControlsField({
      label: "Notice Box Dimensions (W/H)",
    }),
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

export default CalloutBlock;
