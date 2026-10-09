import type { ComponentConfig } from "@puckeditor/core";
import { DividerRender, type DividerProps, defaultDividerProps } from "./Divider";
import { createColorPickerField } from "../fields/ColorPicker";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSegmentedField } from "../fields/SegmentedControl";

export const DividerBlock: ComponentConfig<DividerProps> = {
  label: "Thin Line",
  defaultProps: defaultDividerProps,
  fields: {
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
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
    thickness: createSegmentedField({
      label: "Thickness",
      options: [
        { label: "1px", value: "1px" },
        { label: "2px", value: "2px" },
        { label: "4px", value: "4px" },
        { label: "6px", value: "6px" },
      ],
      defaultValue: "1px",
    }),
    styleVariant: createSegmentedField({
      label: "Style",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
        { label: "Dotted", value: "dotted" },
        { label: "Grad", value: "gradient" },
      ],
      defaultValue: "solid",
    }),
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
