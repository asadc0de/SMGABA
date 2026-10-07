import type { ComponentConfig } from "@puckeditor/core";
import { HeroRender, type HeroProps, defaultHeroProps } from "./Hero";
import { createImagePickerField } from "../fields/ImagePicker";
import { createLinkPickerField } from "../fields/LinkPicker";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const HeroBlock: ComponentConfig<HeroProps> = {
  label: "Top Banner",
  defaultProps: defaultHeroProps,
  fields: {
    headline: {
      type: "textarea",
      label: "Main Headline",
    },
    subheadline: {
      type: "textarea",
      label: "Subheadline / Description",
    },
    headlineTypography: createTypographyField({
      label: "Main Headline Typography",
    }),
    bodyTypography: createTypographyField({
      label: "Subheadline Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Background, Shadow, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance Effects)",
    }),
    eyebrow: {
      type: "text",
      label: "Eyebrow Badge (Optional)",
    },
    backgroundColor: createColorPickerField({
      label: "Banner Background Color",
    }),
    textColor: createColorPickerField({
      label: "Banner Text Color",
    }),
    sizeControls: createSizeControlsField({
      label: "Hero Box Dimensions (W/H)",
    }),
    sizePercent: createSizeSliderField({
      label: "Banner Content Width Scale (%)",
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
      label: "Background Dark Tint",
      options: [
        { label: "Site Style (SMG Brand Gradient)", value: "site" },
        { label: "Navy Glass (Brand Default)", value: "navy" },
        { label: "Dark Subtle (40%)", value: "dark-subtle" },
        { label: "Dark Heavy (75%)", value: "dark-heavy" },
        { label: "Gradient Vignette", value: "gradient" },
        { label: "None (Clean Image)", value: "none" },
      ],
    },
    minHeight: {
      type: "select",
      label: "Banner Height",
      options: [
        { label: "Medium (Standard Default)", value: "medium" },
        { label: "Full Screen (75vh)", value: "screen" },
        { label: "Compact (360px)", value: "compact" },
        { label: "Auto (Fits Content)", value: "auto" },
      ],
    },
    primaryCta: {
      type: "object",
      label: "Primary Button",
      objectFields: {
        enabled: {
          type: "radio",
          label: "Show Primary Button",
          options: [
            { label: "Yes, show button", value: true },
            { label: "Hide button", value: false },
          ],
        },
        label: {
          type: "text",
          label: "Button Text",
        },
        href: createLinkPickerField({
          label: "Button Link",
          placeholder: "Select page or enter link",
        }),
        variant: {
          type: "select",
          label: "Button Style",
          options: [
            { label: "Solid White Pill", value: "white" },
            { label: "Outlined White Glass", value: "outline" },
            { label: "Primary Blue", value: "primary" },
            { label: "Sky Secondary", value: "secondary" },
          ],
        },
      },
    },
    secondaryCta: {
      type: "object",
      label: "Secondary Button",
      objectFields: {
        enabled: {
          type: "radio",
          label: "Show Secondary Button",
          options: [
            { label: "Yes, show button", value: true },
            { label: "Hide button", value: false },
          ],
        },
        label: {
          type: "text",
          label: "Button Text",
        },
        href: createLinkPickerField({
          label: "Button Link",
          placeholder: "Select page or enter link",
        }),
        variant: {
          type: "select",
          label: "Button Style",
          options: [
            { label: "Outlined White Glass", value: "outline" },
            { label: "Solid White Pill", value: "white" },
            { label: "Primary Blue", value: "primary" },
            { label: "Sky Secondary", value: "secondary" },
          ],
        },
      },
    },
    align: createResponsiveAlignField("Text Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "none"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "none"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: HeroRender,
};

export default HeroBlock;
