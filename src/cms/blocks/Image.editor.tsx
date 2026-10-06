import type { ComponentConfig } from "@puckeditor/core";
import { ImageRender, type ImageBlockProps } from "./Image";
import { isValidButtonUrl } from "./Button";
import { createImagePickerField } from "../fields/ImagePicker";
import {
  createResponsiveSpaceField,
  createResponsiveAlignField,
} from "../fields/ResponsiveSelect";
import { createSizeSliderField } from "../fields/SizeSlider";

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
      label: "Image Source (Upload, Gallery, or URL)",
      placeholder: "https://..., /assets/photo.jpg, or upload/pick",
    }),
    alt: {
      type: "text",
      label: "Alt Text (Accessibility)",
    },
    widthPercent: createSizeSliderField({
      label: "Image Size / Width",
      min: 10,
      max: 100,
      step: 1,
      defaultValue: 100,
      presets: [25, 33, 50, 75, 100],
      description: "Scale the image display width percentage.",
    }),
    width: {
      type: "select",
      label: "Width Preset (Legacy)",
      options: [
        { label: "Full Width (100%)", value: "full" },
        { label: "Auto / Natural Width", value: "auto" },
        { label: "Three Quarters (75%)", value: "3/4" },
        { label: "Half Width (50%)", value: "1/2" },
        { label: "One Third (33%)", value: "1/3" },
        { label: "One Quarter (25%)", value: "1/4" },
      ],
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      options: [
        { label: "Auto / Natural", value: "auto" },
        { label: "16:9 (Widescreen)", value: "16/9" },
        { label: "4:3 (Standard)", value: "4/3" },
        { label: "1:1 (Square)", value: "1/1" },
        { label: "3:2 (Classic Photo)", value: "3/2" },
        { label: "21:9 (Ultrawide Banner)", value: "21/9" },
      ],
    },
    objectFit: {
      type: "select",
      label: "Object Fit",
      options: [
        { label: "Cover (Crop to Fit)", value: "cover" },
        { label: "Contain (Show Full Image)", value: "contain" },
        { label: "Fill (Stretch)", value: "fill" },
      ],
    },
    rounded: {
      type: "select",
      label: "Corner Radius",
      options: [
        { label: "None (Square)", value: "none" },
        { label: "Small (4px)", value: "sm" },
        { label: "Medium (6px)", value: "md" },
        { label: "Large (8px)", value: "lg" },
        { label: "Extra Large (12px)", value: "xl" },
        { label: "2XL (16px)", value: "2xl" },
        { label: "Full (Pill/Circle)", value: "full" },
      ],
    },
    linkUrl: {
      type: "custom",
      label: "Optional Click Link URL",
      render: ({ value, onChange, readOnly }) => {
        const strVal = typeof value === "string" ? value : "";
        const isValid = !strVal || isValidButtonUrl(strVal);
        return (
          <div className="flex flex-col gap-1 w-full">
            <input
              type="text"
              value={strVal}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..., /services, or leave blank"
              className={`w-full rounded-md border px-3 py-2 text-xs outline-none transition-colors ${
                !isValid
                  ? "border-destructive bg-destructive/10 text-destructive focus:ring-1 focus:ring-destructive"
                  : "border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring"
              }`}
            />
            {!isValid && (
              <span className="text-xs text-destructive">
                Invalid link URL. Allowed: https://, http://, / (relative), mailto:, tel:
              </span>
            )}
          </div>
        );
      },
    },
    align: createResponsiveAlignField("Alignment", "left"),
    marginTop: createResponsiveSpaceField("Margin Top", "md"),
    marginBottom: createResponsiveSpaceField("Margin Bottom", "md"),
    paddingTop: createResponsiveSpaceField("Padding Top", "none"),
    paddingBottom: createResponsiveSpaceField("Padding Bottom", "none"),
  },
  render: ImageRender,
};
