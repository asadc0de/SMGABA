import type { ComponentConfig } from "@puckeditor/core";
import {
  PartnerBannerRender,
  type PartnerBannerProps,
  type PartnerBannerButtonVariant,
  type PartnerBannerButtonAlign,
  defaultPartnerBannerProps,
} from "./PartnerBanner";
import { createImagePickerField } from "../fields/ImagePicker";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createColorPickerField } from "../fields/ColorPicker";
import { createSegmentedField } from "../fields/SegmentedControl";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const PartnerBannerBlock: ComponentConfig<PartnerBannerProps> = {
  label: "Partner Banner",
  defaultProps: defaultPartnerBannerProps,
  fields: {
    heading: {
      type: "text",
      label: "Heading (Line 1)",
    },
    subheading: {
      type: "text",
      label: "Subheading (Line 2)",
    },
    description: {
      type: "textarea",
      label: "Description Paragraph",
    },
    features: {
      type: "array",
      label: "Checklist Features (Right Column)",
      getItemSummary: (item) => item.text || "Checklist item",
      arrayFields: {
        text: {
          type: "text",
          label: "Feature Text",
        },
      },
      defaultItemProps: {
        text: "New Feature / Benefit",
      },
    },
    showButton: {
      type: "radio",
      label: "Show Button Inside Banner",
      options: [
        { label: "Visible", value: true },
        { label: "Hidden", value: false },
      ],
    },
    buttonLabel: {
      type: "text",
      label: "Button Label",
    },
    buttonUrl: createLinkPickerField({
      label: "Button Destination Link",
      placeholder: "/contact or https://...",
    }),
    buttonVariant: createSegmentedField<PartnerBannerButtonVariant>({
      label: "Button Color Style",
      options: [
        { label: "Navy Pill", value: "navy", description: "Dark Navy with White Border" },
        { label: "White Solid", value: "white", description: "Solid White with Dark Text" },
        { label: "Blue Gradient", value: "gradient", description: "Vibrant Blue Gradient" },
      ],
      defaultValue: "navy",
    }),
    buttonAlign: createSegmentedField<PartnerBannerButtonAlign>({
      label: "Button Position Inside Container",
      options: [
        { label: "Left", value: "left", description: "Align to left" },
        { label: "Center", value: "center", description: "Center horizontally inside container" },
        { label: "Right", value: "right", description: "Align to right" },
      ],
      defaultValue: "center",
      fullWidth: true,
    }),
    backgroundImage: createImagePickerField({
      label: "Skyline / Background Image",
      placeholder: "https://... or select image",
      description: "Appears behind the navy gradient on the right side of the banner.",
    }),
    backgroundColor: createColorPickerField({
      label: "Banner Background Color",
      description: "Default: #0f2142 (Navy brand color)",
    }),
    animation: createAnimationControlsField({
      label: "Entrance Animation",
    }),
    marginTop: createResponsiveSpaceField("Margin Top", "lg"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "lg"),
  },
  render: PartnerBannerRender,
};

export default PartnerBannerBlock;

