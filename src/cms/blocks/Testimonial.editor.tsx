import type { ComponentConfig } from "@puckeditor/core";
import {
  TestimonialRender,
  type TestimonialProps,
  defaultTestimonialProps,
} from "./Testimonial";
import { createImagePickerField } from "../fields/ImagePicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const TestimonialBlock: ComponentConfig<TestimonialProps> = {
  label: "Testimonial / Quote",
  defaultProps: defaultTestimonialProps,
  fields: {
    quote: {
      type: "textarea",
      label: "Client Quote Text",
    },
    authorName: {
      type: "text",
      label: "Author Name",
    },
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
    rating: {
      type: "select",
      label: "Star Rating",
      options: [
        { label: "5 Stars (★★★★★)", value: "5" },
        { label: "4 Stars (★★★★☆)", value: "4" },
        { label: "3 Stars (★★★☆☆)", value: "3" },
        { label: "Hide Rating", value: "0" },
      ],
    },
    layout: {
      type: "select",
      label: "Layout Presentation",
      options: [
        { label: "Site Signature Card (Default)", value: "site-card" },
        { label: "Classic Card Container", value: "card" },
        { label: "Centered Minimal", value: "centered" },
        { label: "Split (2-Column)", value: "split" },
        { label: "Quote Left Accent", value: "quote-left" },
      ],
    },
    theme: {
      type: "select",
      label: "Color Theme",
      options: [
        { label: "Site Light Surface (Default)", value: "secondary" },
        { label: "Navy Brand (Dark)", value: "navy" },
        { label: "Pure White Card", value: "light" },
        { label: "Subtle Gray", value: "subtle" },
      ],
    },
    sizePercent: createSizeSliderField({
      label: "Testimonial Width / Scale",
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
