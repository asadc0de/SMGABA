import type { ComponentConfig } from "@puckeditor/core";
import { ImageRender, type ImageBlockProps } from "./Image";
import { createImagePickerField } from "../fields/ImagePicker";
import { createLinkPickerField } from "../fields/LinkPicker";
import { createResponsiveSpaceField, createResponsiveAlignField } from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";
import { createColorPickerField } from "../fields/ColorPicker";
import { createSizeControlsField } from "../fields/SizeControls";
import { createStyleControlsField } from "../fields/StyleControls";
import { createAnimationControlsField } from "../fields/AnimationControls";
import { createAdvancedLayoutField } from "../fields/AdvancedLayout";
import { createSegmentedField } from "../fields/SegmentedControl";

export const ImageBlock: ComponentConfig<ImageBlockProps> = {
  label: "Image",
  defaultProps: {
    src: "",
    alt: "Image description",
    width: "full",
    widthPercent: 100,
    aspectRatio: "auto",
    objectFit: "cover",
    rounded: "2xl",
    align: { base: "left" },
    marginTop: { base: "md" },
    marginBottom: { base: "md" },
    paddingTop: { base: "none" },
    paddingBottom: { base: "none" },
  },
  fields: {
    src: createImagePickerField({
      label: "Image Source (Upload or Pick from Library)",
      placeholder: "https://..., /assets/photo.jpg, or upload/pick",
    }),
    alt: {
      type: "text",
      label: "Image Description (Alt Text for Accessibility)",
    },
    advancedLayout: createAdvancedLayoutField({ defaultDisplay: "block" }),
    styleControls: createStyleControlsField({
      label: "Style & Appearance (Borders, Shadows, Radius, Spacing)",
    }),
    animation: createAnimationControlsField({
      label: "Micro Animations (Scroll & Hover)",
    }),
    sizeControls: createSizeControlsField({
      label: "Image Dimensions (Width & Height)",
      defaultWidthType: "full",
      defaultHeightType: "auto",
    }),
    widthPercent: createSizeSliderField({
      label: "Image Size / Width (%)",
      min: 10,
      max: 100,
      step: 1,
      defaultValue: 100,
      presets: [25, 33, 50, 75, 100],
      description: "Scale the image display width percentage.",
    }),
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      options: [
        { label: "Auto (Natural Dimensions)", value: "auto" },
        { label: "16:9 (Widescreen)", value: "16/9" },
        { label: "4:3 (Standard)", value: "4/3" },
        { label: "1:1 (Square)", value: "1/1" },
        { label: "3:2 (Classic Photo)", value: "3/2" },
        { label: "21:9 (Ultrawide Banner)", value: "21/9" },
      ],
    },
    objectFit: createSegmentedField({
      label: "Object Fit",
      options: [
        { label: "Cover", value: "cover", description: "Crop to Fit" },
        { label: "Contain", value: "contain", description: "Show Full Image" },
        { label: "Fill", value: "fill", description: "Stretch" },
      ],
      defaultValue: "cover",
    }),
    rounded: createSegmentedField({
      label: "Corners",
      options: [
        { label: "0", value: "none", description: "Square (0px)" },
        { label: "S", value: "sm", description: "Small (4px)" },
        { label: "M", value: "md", description: "Medium (8px)" },
        { label: "L", value: "lg", description: "Large (16px)" },
        { label: "Full", value: "full", description: "Circle / Pill" },
      ],
      defaultValue: "none",
    }),
    borderColor: createColorPickerField({
      label: "Border / Frame Color",
    }),
    backgroundColor: createColorPickerField({
      label: "Background Color (Under Transparent Images)",
    }),
    linkUrl: createLinkPickerField({
      label: "Click Destination Link (Optional)",
      placeholder: "Select page or enter link",
    }),
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ImageRender,
};

export default ImageBlock;
