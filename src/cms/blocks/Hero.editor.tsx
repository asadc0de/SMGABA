import type { ComponentConfig } from "@puckeditor/core";
import { HeroRender, type HeroProps, defaultHeroProps } from "./Hero";
import { createImagePickerField } from "../fields/ImagePicker";
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
    backgroundImage: createImagePickerField({
      label: "Background Image (Upload, Gallery, or URL)",
      placeholder: "https://..., /assets/hero.jpg, or pick from gallery",
    }),
    overlay: {
      type: "select",
      label: "Overlay Shade",
      options: [
        { label: "Site Style (SMG Brand)", value: "site" },
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
        { label: "Medium (Subpage Hero Default)", value: "medium" },
        { label: "Full Viewport (75vh)", value: "screen" },
        { label: "Compact (360px)", value: "compact" },
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
            { label: "Solid White Pill (Site Style)", value: "white" },
            { label: "Outlined White Glass", value: "outline" },
            { label: "Primary Blue", value: "primary" },
            { label: "Sky Secondary", value: "secondary" },
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
            { label: "Outlined White Glass (Site Style)", value: "outline" },
            { label: "Solid White Pill", value: "white" },
            { label: "Primary Blue", value: "primary" },
            { label: "Sky Secondary", value: "secondary" },
          ],
        },
      },
    },
    align: createResponsiveAlignField("Content Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "none"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "none"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: HeroRender,
};

export default HeroBlock;
