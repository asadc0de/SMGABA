import type { ComponentConfig } from "@puckeditor/core";
import { CTABannerRender, type CTABannerProps, defaultCTABannerProps } from "./CTABanner";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createSegmentedField } from "../fields/SegmentedControl";

export const CTABannerBlock: ComponentConfig<CTABannerProps> = {
  label: "Call to Action Strip",
  defaultProps: defaultCTABannerProps,
  fields: {
    eyebrow: {
      type: "text",
      label: "Eyebrow Badge (Optional)",
    },
    heading: {
      type: "text",
      label: "Main Heading",
    },
    headlineTypography: createTypographyField({
      label: "Main Heading Typography",
    }),
    description: {
      type: "textarea",
      label: "Description (Optional)",
    },
    bodyTypography: createTypographyField({
      label: "Description Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Background, Shadow, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Scroll & Hover)",
    }),
    theme: createSegmentedField({
      label: "Theme",
      options: [
        { label: "Navy", value: "navy", description: "Navy Dark Brand" },
        { label: "Light", value: "light", description: "Light Slate Card" },
        { label: "Gradient", value: "blue-gradient", description: "Blue Gradient Brand" },
      ],
      defaultValue: "navy",
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
    alignment: createSegmentedField({
      label: "Alignment",
      options: [
        { label: "Center", value: "center", description: "Centered" },
        { label: "Left", value: "left", description: "Left Aligned" },
      ],
      defaultValue: "center",
    }),
    layout: createSegmentedField({
      label: "Shape",
      options: [
        { label: "Card", value: "card", description: "Rounded Card Box" },
        { label: "Full Strip", value: "full-width", description: "Full Width Strip" },
      ],
      defaultValue: "card",
    }),
    primaryButton: {
      type: "object",
      label: "Primary Button",
      objectFields: {
        label: { type: "text", label: "Button Text" },
        href: createLinkPickerField({
          label: "Destination Link",
          placeholder: "Select page or enter link",
        }),
      },
    },
    secondaryButton: {
      type: "object",
      label: "Secondary Button (Optional)",
      objectFields: {
        enabled: {
          type: "radio",
          label: "Show Secondary Button",
          options: [
            { label: "Yes, show button", value: true },
            { label: "Hide button", value: false },
          ],
        },
        label: { type: "text", label: "Button Text" },
        href: createLinkPickerField({
          label: "Destination Link",
          placeholder: "Select page or enter link",
        }),
      },
    },
    sizeControls: createSizeControlsField({
      label: "Banner Box Dimensions (W/H)",
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
  render: CTABannerRender,
};

export default CTABannerBlock;
