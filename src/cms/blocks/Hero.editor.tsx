import type { ComponentConfig } from "@puckeditor/core";
import { HeroRender, type HeroProps, defaultHeroProps } from "./Hero";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const HeroBlock: ComponentConfig<HeroProps> = {
  label: "Hero / Banner",
  defaultProps: defaultHeroProps,
  fields: {
    headline: {
      type: "textarea",
      label: "Headline",
    },
    subheadline: {
      type: "textarea",
      label: "Subheadline / Description",
    },
    eyebrow: {
      type: "text",
      label: "Eyebrow Badge (Optional)",
    },
    sizePercent: createSizeSliderField({
      label: "Hero Content Width / Scale",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the hero content container width.",
    }),
    backgroundImage: {
      type: "text",
      label: "Background Image URL",
    },
    overlay: {
      type: "select",
      label: "Overlay Shade",
      options: [
        { label: "Navy Glass (Brand Default)", value: "navy" },
        { label: "Dark Subtle (40%)", value: "dark-subtle" },
        { label: "Dark Heavy (75%)", value: "dark-heavy" },
        { label: "Gradient Vignette", value: "gradient" },
        { label: "None (Clean Image)", value: "none" },
      ],
    },
    minHeight: {
      type: "select",
      label: "Section Height",
      options: [
        { label: "Compact (360px)", value: "compact" },
        { label: "Medium (500px - Default)", value: "medium" },
        { label: "Full Viewport (85vh)", value: "screen" },
        { label: "Auto (Content Height)", value: "auto" },
      ],
    },
    primaryCta: {
      type: "object",
      label: "Primary CTA Button",
      objectFields: {
        enabled: {
          type: "radio",
          label: "Enable Primary Button",
          options: [
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
          ],
        },
        label: {
          type: "text",
          label: "Button Label",
        },
        href: {
          type: "text",
          label: "Link URL (/path or https://...)",
        },
        variant: {
          type: "select",
          label: "Button Style",
          options: [
            { label: "Primary Blue", value: "primary" },
            { label: "Sky Secondary", value: "secondary" },
            { label: "Solid White", value: "white" },
            { label: "Outlined Glass", value: "outline" },
          ],
        },
      },
    },
    secondaryCta: {
      type: "object",
      label: "Secondary CTA Button",
      objectFields: {
        enabled: {
          type: "radio",
          label: "Enable Secondary Button",
          options: [
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
          ],
        },
        label: {
          type: "text",
          label: "Button Label",
        },
        href: {
          type: "text",
          label: "Link URL (/path or https://...)",
        },
        variant: {
          type: "select",
          label: "Button Style",
          options: [
            { label: "Outlined Glass", value: "outline" },
            { label: "Solid White", value: "white" },
            { label: "Sky Secondary", value: "secondary" },
            { label: "Primary Blue", value: "primary" },
          ],
        },
      },
    },
    align: createResponsiveAlignField("Content Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "none"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "lg"),
    paddingTop: createResponsiveSpaceField("Padding Top", "lg"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "lg"),
  },
  render: HeroRender,
};

export default HeroBlock;
