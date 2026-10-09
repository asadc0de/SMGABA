import type { ComponentConfig } from "@puckeditor/core";
import {
  TestimonialRender,
  type TestimonialProps,
  defaultTestimonialProps,
} from "./Testimonial";
import { createImagePickerField } from "../fields/ImagePicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createTypographyField } from "../fields/TextFormatting";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createSegmentedField } from "../fields/SegmentedControl";

export const TestimonialBlock: ComponentConfig<TestimonialProps> = {
  label: "Testimonial Quote",
  defaultProps: defaultTestimonialProps,
  fields: {
    quote: {
      type: "textarea",
      label: "Client Quote Text",
    },
    quoteTypography: createTypographyField({
      label: "Quote Text Typography",
    }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Card Background, Shadow, Borders)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Scroll & Hover)",
    }),
    authorName: {
      type: "text",
      label: "Author Name",
    },
    authorTypography: createTypographyField({
      label: "Author Name Typography",
    }),
    authorRole: {
      type: "text",
      label: "Author Title / Role (Optional)",
    },
    authorCompany: {
      type: "text",
      label: "Company / Organization (Optional)",
    },
    avatarUrl: createImagePickerField({
      label: "Avatar / Author Photo (Upload, Gallery, or URL)",
      placeholder: "https://..., /assets/author.jpg, or pick from library",
    }),
    rating: createSegmentedField({
      label: "Star Rating",
      options: [
        { label: "5★", value: "5", description: "5 Stars" },
        { label: "4★", value: "4", description: "4 Stars" },
        { label: "3★", value: "3", description: "3 Stars" },
        { label: "Off", value: "0", description: "Hide Rating" },
      ],
      defaultValue: "5",
    }),
    layout: createSegmentedField({
      label: "Quote Design",
      options: [
        { label: "Signature (A)", value: "site-card", description: "Editorial signature layout" },
        { label: "Card (B)", value: "card", description: "Elevated card layout" },
      ],
      defaultValue: "site-card",
    }),
    theme: createSegmentedField({
      label: "Theme",
      options: [
        { label: "Light", value: "secondary", description: "Site light surface" },
        { label: "Navy", value: "navy", description: "Navy dark brand" },
        { label: "White", value: "light", description: "Pure white card" },
        { label: "Subtle", value: "subtle", description: "Subtle gray" },
      ],
      defaultValue: "secondary",
      fullWidth: true,
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
    sizeControls: createSizeControlsField({
      label: "Testimonial Dimensions (W/H)",
    }),
    sizePercent: createSizeSliderField({
      label: "Testimonial Width / Scale (%)",
      min: 40,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the testimonial card.",
    }),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "xl"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: TestimonialRender,
};

export default TestimonialBlock;
