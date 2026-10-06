import type { ComponentConfig } from "@puckeditor/core";
import { CTABannerRender, type CTABannerProps, defaultCTABannerProps } from "./CTABanner";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const CTABannerBlock: ComponentConfig<CTABannerProps> = {
  label: "CTA Banner",
  defaultProps: defaultCTABannerProps,
  fields: {
    eyebrow: {
      type: "text",
      label: "Eyebrow Pill (Optional)",
    },
    heading: {
      type: "text",
      label: "Main Heading",
    },
    description: {
      type: "textarea",
      label: "Description (Optional)",
    },
    theme: {
      type: "select",
      label: "Visual Theme",
      options: [
        { label: "Navy Dark Brand (#0f2142)", value: "navy" },
        { label: "Light Slate Card", value: "light" },
        { label: "Blue Gradient Brand", value: "blue-gradient" },
      ],
    },
    alignment: {
      type: "select",
      label: "Content Alignment",
      options: [
        { label: "Centered (Default)", value: "center" },
        { label: "Left Aligned", value: "left" },
      ],
    },
    layout: {
      type: "select",
      label: "Card Format",
      options: [
        { label: "Rounded 3XL Card (Default)", value: "card" },
        { label: "Full Width Band", value: "full-width" },
      ],
    },
    primaryButton: {
      type: "object",
      label: "Primary Button",
      objectFields: {
        label: { type: "text", label: "Button Label" },
        href: { type: "text", label: "Button URL (/bookanappointment, https://...)" },
      },
    },
    secondaryButton: {
      type: "object",
      label: "Secondary Button (Optional)",
      objectFields: {
        enabled: {
          type: "radio",
          label: "Enable Button",
          options: [
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
          ],
        },
        label: { type: "text", label: "Button Label" },
        href: { type: "text", label: "Button URL (/contact, https://...)" },
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
  render: CTABannerRender,
};
