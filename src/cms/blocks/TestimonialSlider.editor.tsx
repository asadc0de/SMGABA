import type { ComponentConfig } from "@puckeditor/core";
import {
  TestimonialSliderRender,
  type TestimonialSliderProps,
  defaultTestimonialSliderProps,
} from "./TestimonialSlider";
import { createImagePickerField } from "../fields/ImagePicker";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const TestimonialSliderBlock: ComponentConfig<TestimonialSliderProps> = {
  label: "Testimonial Carousel",
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
      label: "Container Theme Preset",
      options: [
        { label: "Site Warm Gray (Default)", value: "secondary" },
        { label: "Navy Dark Brand", value: "navy" },
        { label: "Pure White Card", value: "light" },
        { label: "Transparent / Seamless", value: "transparent" },
      ],
    },
    backgroundColor: createColorPickerField({
      label: "Custom Background Color",
    }),
    textColor: createColorPickerField({
      label: "Custom Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Custom Border Color",
    }),
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
      label: "Bottom Button Text (Optional)",
    },
    ctaHref: createLinkPickerField({
      label: "Bottom Button Link",
      placeholder: "Select page or enter link",
    }),
    sizeControls: createSizeControlsField({
      label: "Carousel Dimensions (Width & Height)",
    }),
    sizePercent: createSizeSliderField({
      label: "Container Width Scale (%)",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the testimonial carousel.",
    }),
    testimonials: {
      type: "array",
      label: "Testimonials List",
      min: 1,
      getItemSummary: (item, idx) => item?.authorName ? `${item.authorName} (${item.authorCompany || item.authorRole || "Client"})` : `Testimonial #${(idx ?? 0) + 1}`,
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
    styleControls: createStyleControlsField({
      label: "Block Styles & Background",
    }),
    animation: createAnimationControlsField({
      label: "Animation & Motion",
    }),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "xl"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: TestimonialSliderRender,
};

export default TestimonialSliderBlock;
