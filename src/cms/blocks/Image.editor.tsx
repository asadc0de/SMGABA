import type { ComponentConfig } from "@puckeditor/core";
import { useState } from "react";
import { ImageRender, isValidImageUrl, type ImageBlockProps } from "./Image";
import { isValidButtonUrl } from "./Button";
import { uploadCmsImage } from "@/lib/cms.server";
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
    src: {
      type: "custom",
      label: "Image Source (Upload or URL)",
      render: ({ value, onChange, readOnly }) => {
        const [isUploading, setIsUploading] = useState(false);
        const [uploadError, setUploadError] = useState<string | null>(null);
        const strVal = typeof value === "string" ? value : "";
        const isValid = !strVal || isValidImageUrl(strVal);

        async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
          const file = e.target.files?.[0];
          if (!file) return;

          if (!file.type.startsWith("image/")) {
            setUploadError("Please select a valid image file (PNG, JPG, WebP, SVG).");
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            setUploadError("Image file size must be less than 5MB.");
            return;
          }

          setIsUploading(true);
          setUploadError(null);

          try {
            const reader = new FileReader();
            reader.onload = async () => {
              const base64Data = (reader.result as string).split(",")[1];
              const adminPw = typeof window !== "undefined" ? sessionStorage.getItem("smg_tools_admin_pw") || "" : "";
              const res = await uploadCmsImage({
                data: {
                  fileName: file.name,
                  contentType: file.type,
                  base64Data,
                  adminPassword: adminPw,
                },
              });

              if (res?.success && res.url) {
                onChange(res.url);
              } else {
                setUploadError(res?.error || "Failed to upload image.");
              }
              setIsUploading(false);
            };
            reader.readAsDataURL(file);
          } catch (err: any) {
            setUploadError(err?.message || "Failed to read image file.");
            setIsUploading(false);
          }
        }

        return (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={strVal}
              disabled={readOnly || isUploading}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..., /assets/image.jpg, or upload below"
              className={`w-full rounded-md border px-3 py-2 text-xs outline-none transition-colors ${
                !isValid
                  ? "border-destructive bg-destructive/10 text-destructive focus:ring-1 focus:ring-destructive"
                  : "border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring"
              }`}
            />
            {!isValid && (
              <span className="text-xs text-destructive">
                Invalid Image URL. Allowed: https://, http://, / (relative). data: and javascript: are rejected.
              </span>
            )}
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  disabled={readOnly || isUploading}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                  {isUploading ? "Uploading to Storage..." : "📁 Upload from Computer"}
                </span>
              </label>
              {strVal && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-destructive border border-slate-200 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
            {uploadError && (
              <span className="text-xs text-destructive">{uploadError}</span>
            )}
            {strVal && isValid && (
              <div className="mt-1 relative rounded-md overflow-hidden border border-slate-200 bg-slate-50 h-24 flex items-center justify-center">
                <img src={strVal} alt="Preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>
        );
      },
    },
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
