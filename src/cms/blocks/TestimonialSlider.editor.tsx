import type { ComponentConfig } from "@puckeditor/core";
import {
  TestimonialSliderRender,
  type TestimonialSliderProps,
  defaultTestimonialSliderProps,
} from "./TestimonialSlider";
import { createImagePickerField } from "../fields/ImagePicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const TestimonialSliderBlock: ComponentConfig<TestimonialSliderProps> = {
  label: "Testimonial Slider / Carousel",
  defaultProps: defaultTestimonialSliderProps,
  fields: {
    eyebrow: {
      type: "text",
      label: "Section Eyebrow (Optional)",
    },
    heading: {
      type: "text",
      label: "Section Heading",
    },
    subheading: {
      type: "textarea",
      label: "Section Subheading (Optional)",
    },
    theme: {
      type: "select",
      label: "Container Theme & Surface",
      options: [
        { label: "Site Warm Gray (Default)", value: "secondary" },
        { label: "Navy Dark Brand", value: "navy" },
        { label: "Pure White Card", value: "light" },
        { label: "Transparent / Seamless", value: "transparent" },
      ],
    },
    autoplay: {
      type: "radio",
      label: "Autoplay Slideshow",
      options: [
        { label: "Enabled", value: true },
        { label: "Disabled", value: false },
      ],
    },
    autoplayInterval: {
      type: "select",
      label: "Autoplay Duration",
      options: [
        { label: "5 Seconds", value: "5" },
        { label: "7 Seconds", value: "7" },
        { label: "9 Seconds (Default)", value: "9" },
        { label: "12 Seconds", value: "12" },
      ],
    },
    showDots: {
      type: "radio",
      label: "Show Pagination Pill Indicators",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    showArrows: {
      type: "radio",
      label: "Show Previous/Next Arrow Buttons",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    showRating: {
      type: "radio",
      label: "Show Star Rating Icons",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    ctaText: {
      type: "text",
      label: "Bottom CTA Button Label (Optional)",
    },
    ctaHref: {
      type: "text",
      label: "Bottom CTA Button Link (/path or https://...)",
    },
    sizePercent: createSizeSliderField({
      label: "Slider Container Width / Scale",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the testimonial slider.",
    }),
    testimonials: {
      type: "array",
      label: "Testimonials List",
      getItemSummary: (item) => item?.authorName || item?.quote?.slice(0, 30) || "Testimonial",
      arrayFields: {
        quote: {
          type: "textarea",
          label: "Quote Text",
        },
        authorName: {
          type: "text",
          label: "Author Name / Entity",
        },
        authorRole: {
          type: "text",
          label: "Author Role / Title (Optional)",
        },
        authorCompany: {
          type: "text",
          label: "Company / Group (Optional)",
        },
        avatarUrl: createImagePickerField({
          label: "Author Avatar Photo (Optional)",
          placeholder: "https://..., /assets/author.jpg, or pick from gallery",
        }),
        rating: {
          type: "select",
          label: "Rating",
          options: [
            { label: "5 Stars (★★★★★)", value: "5" },
            { label: "4 Stars (★★★★☆)", value: "4" },
            { label: "3 Stars (★★★☆☆)", value: "3" },
            { label: "None", value: "0" },
          ],
        },
      },
      defaultItemProps: {
        quote: "SMG has handled our business accounting for years with exceptional responsiveness and strategic care.",
        authorName: "Marcus Vance",
        authorRole: "Managing Director",
        authorCompany: "Vance Hospitality Group",
        rating: "5",
      },
    },
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "xl"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: TestimonialSliderRender,
};

export default TestimonialSliderBlock;
