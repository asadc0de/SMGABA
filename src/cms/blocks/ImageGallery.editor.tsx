import type { ComponentConfig } from "@puckeditor/core";
import {
  ImageGalleryRender,
  type ImageGalleryProps,
  defaultImageGalleryProps,
} from "./ImageGallery";
import { createImagePickerField } from "../fields/ImagePicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

export const ImageGalleryBlock: ComponentConfig<ImageGalleryProps> = {
  label: "Image Gallery / Showcase",
  defaultProps: defaultImageGalleryProps,
  fields: {
    heading: {
      type: "text",
      label: "Section Heading (Optional)",
    },
    subheading: {
      type: "textarea",
      label: "Section Subheading (Optional)",
    },
    layout: {
      type: "select",
      label: "Gallery Presentation Layout",
      options: [
        { label: "Responsive Grid (Default)", value: "grid" },
        { label: "Masonry (Staggered Heights)", value: "masonry" },
        { label: "Carousel / Horizontal Scroll", value: "carousel" },
        { label: "Featured Hero Spotlight", value: "featured" },
      ],
    },
    columns: {
      type: "select",
      label: "Grid Columns (Desktop)",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns (Default)", value: "3" },
        { label: "4 Columns", value: "4" },
      ],
    },
    aspectRatio: {
      type: "select",
      label: "Image Aspect Ratio",
      options: [
        { label: "4:3 (Standard Photo)", value: "4/3" },
        { label: "16:9 (Widescreen Landscape)", value: "16/9" },
        { label: "1:1 (Square)", value: "1/1" },
        { label: "3:2 (Classic 35mm)", value: "3/2" },
        { label: "Auto / Natural Dimensions", value: "auto" },
      ],
    },
    gap: {
      type: "select",
      label: "Grid Spacing Gap",
      options: [
        { label: "Small (12px)", value: "sm" },
        { label: "Medium (20px - Default)", value: "md" },
        { label: "Large (32px)", value: "lg" },
        { label: "Seamless (0px)", value: "none" },
      ],
    },
    rounded: {
      type: "select",
      label: "Corner Radius",
      options: [
        { label: "Large (12px - Default)", value: "xl" },
        { label: "Medium (8px)", value: "lg" },
        { label: "Small (4px)", value: "sm" },
        { label: "Extra Large (16px)", value: "2xl" },
        { label: "None (Square)", value: "none" },
      ],
    },
    enableLightbox: {
      type: "radio",
      label: "Click-to-Enlarge Lightbox",
      options: [
        { label: "Enabled (Open Full Image)", value: true },
        { label: "Disabled", value: false },
      ],
    },
    showCaptions: {
      type: "radio",
      label: "Show Image Titles & Captions",
      options: [
        { label: "Show Captions", value: true },
        { label: "Hide Captions", value: false },
      ],
    },
    hoverEffect: {
      type: "select",
      label: "Hover Animation Effect",
      options: [
        { label: "Smooth Zoom (Default)", value: "zoom" },
        { label: "Card Lift", value: "lift" },
        { label: "None", value: "none" },
      ],
    },
    sizePercent: createSizeSliderField({
      label: "Gallery Container Width / Scale",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
      description: "Scale the maximum width of the image gallery container.",
    }),
    items: {
      type: "array",
      label: "Gallery Images",
      getItemSummary: (item) => item?.title || item?.url?.split("/").pop() || "Gallery Image",
      arrayFields: {
        url: createImagePickerField({
          label: "Photo Source (Upload, Gallery, or URL)",
          placeholder: "https://..., /assets/photo.jpg, or pick from library",
        }),
        title: {
          type: "text",
          label: "Photo Title / Caption Headline",
        },
        caption: {
          type: "textarea",
          label: "Photo Subcaption / Details",
        },
        alt: {
          type: "text",
          label: "Alt Text (Accessibility)",
        },
        linkUrl: {
          type: "text",
          label: "Optional Click Link URL (/path or https://...)",
        },
      },
      defaultItemProps: {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        title: "New Showcase Photo",
        caption: "High-resolution corporate advisory visual.",
        alt: "Showcase photography",
      },
    },
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "xl"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ImageGalleryRender,
};

export default ImageGalleryBlock;
