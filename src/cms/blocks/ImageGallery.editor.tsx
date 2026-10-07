import type { ComponentConfig } from "@puckeditor/core";
import {
  ImageGalleryRender,
  type ImageGalleryProps,
  defaultImageGalleryProps,
} from "./ImageGallery";
import { createImagePickerField } from "../fields/ImagePicker";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

import { createColorPickerField } from "../fields/ColorPicker";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSizeControlsField, createToggleField } from "../fields/SizeControls";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";

export const ImageGalleryBlock: ComponentConfig<ImageGalleryProps> = {
  label: "Photo Gallery",
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
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Gallery/Items)",
      showApplyToChildren: true,
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Entrance & Stagger)",
      showStaggerToggle: true,
    }),
    layout: {
      type: "select",
      label: "Gallery Layout",
      options: [
        { label: "Responsive Grid (Default)", value: "grid" },
        { label: "Masonry (Staggered Heights)", value: "masonry" },
        { label: "Carousel (Horizontal Scroll)", value: "carousel" },
        { label: "Featured Spotlight", value: "featured" },
      ],
    },
    columns: {
      type: "select",
      label: "Columns (Desktop)",
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
        { label: "16:9 (Widescreen)", value: "16/9" },
        { label: "1:1 (Square)", value: "1/1" },
        { label: "3:2 (Classic)", value: "3/2" },
        { label: "Auto (Natural Dimensions)", value: "auto" },
      ],
    },
    gap: {
      type: "select",
      label: "Spacing Gap",
      options: [
        { label: "Small (12px)", value: "sm" },
        { label: "Medium (20px - Default)", value: "md" },
        { label: "Large (32px)", value: "lg" },
        { label: "Seamless (0px)", value: "none" },
      ],
    },
    rounded: {
      type: "select",
      label: "Corner Roundedness",
      options: [
        { label: "Large (12px - Default)", value: "xl" },
        { label: "Medium (8px)", value: "lg" },
        { label: "Small (4px)", value: "sm" },
        { label: "Extra Large (16px)", value: "2xl" },
        { label: "None (Square)", value: "none" },
      ],
    },
    backgroundColor: createColorPickerField({
      label: "Section Background Color",
    }),
    textColor: createColorPickerField({
      label: "Text Color",
    }),
    borderColor: createColorPickerField({
      label: "Border Color",
    }),
    sizeControls: createSizeControlsField({
      label: "Container Dimensions (Width & Height)",
      showMultiItemControls: true,
      showEqualHeightToggle: true,
    }),
    sameItemSize: createToggleField({
      label: "Apply same size to all items",
      description: "Force all image tiles to have equal dimensions.",
    }),
    equalHeightCards: createToggleField({
      label: "Equal height cards",
      description: "Ensure all gallery image cards stretch to equal matching height.",
      defaultValue: true,
    }),
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "grid" }),
    enableLightbox: {
      type: "radio",
      label: "Click to Enlarge (Lightbox)",
      options: [
        { label: "Enabled", value: true },
        { label: "Disabled", value: false },
      ],
    },
    showCaptions: {
      type: "radio",
      label: "Show Titles & Captions",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    hoverEffect: {
      type: "select",
      label: "Hover Animation",
      options: [
        { label: "Smooth Zoom (Default)", value: "zoom" },
        { label: "Card Lift", value: "lift" },
        { label: "None", value: "none" },
      ],
    },
    sizePercent: createSizeSliderField({
      label: "Container Width",
      min: 50,
      max: 100,
      step: 5,
      defaultValue: 100,
      presets: [50, 65, 80, 90, 100],
    }),
    items: {
      type: "array",
      label: "Photos List",
      min: 1,
      getItemSummary: (item, idx) => item?.title || (item?.url ? item.url.split("/").pop()?.slice(0, 25) : "") || `Photo #${(idx ?? 0) + 1}`,
      arrayFields: {
        url: createImagePickerField({
          label: "Photo Source (Upload or Pick from Library)",
          placeholder: "https://..., /assets/photo.jpg, or pick from library",
        }),
        title: {
          type: "text",
          label: "Photo Title",
        },
        caption: {
          type: "textarea",
          label: "Caption / Description",
        },
        alt: {
          type: "text",
          label: "Image Description (Alt Text for Accessibility)",
        },
        linkUrl: createLinkPickerField({
          label: "Click Destination Link (Optional)",
          placeholder: "Select page or enter link",
        }),
      },
      defaultItemProps: {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        title: "Showcase Photo",
        caption: "Corporate advisory and team highlights.",
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
