import type { ComponentConfig } from "@puckeditor/core";
import { DividerRender, type DividerProps, defaultDividerProps } from "./Divider";
import { createColorPickerField } from "../fields/ColorPicker";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const DividerBlock: ComponentConfig<DividerProps> = {
  label: "Thin Line",
  defaultProps: defaultDividerProps,
  fields: {
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Colors, Shadows, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Scroll Fade/Slide)",
    }),
    width: {
      type: "select",
      label: "Line Width",
      options: [
        { label: "100% Full Width (Default)", value: "100%" },
        { label: "75% Three Quarters", value: "75%" },
        { label: "50% Half Width", value: "50%" },
        { label: "33% One Third", value: "33%" },
        { label: "25% Quarter Width", value: "25%" },
        { label: "120px Accent Bar", value: "120px" },
        { label: "60px Small Notch", value: "60px" },
      ],
    },
    thickness: {
      type: "select",
      label: "Line Thickness",
      options: [
        { label: "1px Hairline (Default)", value: "1px" },
        { label: "2px Subtle", value: "2px" },
        { label: "3px Medium", value: "3px" },
        { label: "4px Bold", value: "4px" },
        { label: "6px Heavy", value: "6px" },
        { label: "8px Extra Heavy", value: "8px" },
      ],
    },
    styleVariant: {
      type: "select",
      label: "Line Style Pattern",
      options: [
        { label: "Solid Continuous (Default)", value: "solid" },
        { label: "Dashed Line", value: "dashed" },
        { label: "Dotted Line", value: "dotted" },
        { label: "Soft Gradient Fade", value: "gradient" },
      ],
    },
    color: createColorPickerField({
      label: "Line Color",
      defaultValue: "#e2e8f0",
      description: "Default: Light slate gray (#e2e8f0)",
    }),
    align: createResponsiveAlignField("Alignment", "center"),
    marginTop: createResponsiveSpaceField("Margin Top (Spacing Above)", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom (Spacing Below)", "md"),
  },
  render: DividerRender,
};

export default DividerBlock;
