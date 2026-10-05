import { useState } from "react";
import type { ComponentConfig } from "@puckeditor/core";
import { CmsRoot, isValidCanonicalUrl, type CmsRootProps } from "./root";
import { isValidImageUrl } from "./blocks/Image";
import { uploadCmsImage } from "@/lib/cms.server";

export const rootEditorConfig: ComponentConfig<CmsRootProps> = {
  render: CmsRoot,
  fields: {
    title: {
      type: "text",
      label: "Page Heading / Internal Title",
    },
    seoTitle: {
      type: "text",
      label: "SEO Title (<title> Tag)",
    },
    metaDescription: {
      type: "textarea",
      label: "Meta Description (Search Snippet)",
    },
    canonicalUrl: {
      type: "custom",
      label: "Canonical URL (optional)",
      render: ({ value, onChange, readOnly }) => {
        const strVal = typeof value === "string" ? value : "";
        const isValid = !strVal || isValidCanonicalUrl(strVal);

        return (
          <div className="flex flex-col gap-1 w-full">
            <input
              type="text"
              value={strVal}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://smgaba.com/your-canonical-slug"
              className={`w-full rounded-md border px-3 py-2 text-xs outline-none transition-colors ${
                !isValid
                  ? "border-destructive bg-destructive/10 text-destructive focus:ring-1 focus:ring-destructive"
                  : "border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring"
              }`}
            />
            {!isValid && (
              <span className="text-xs text-destructive">
                Invalid Canonical URL. Allowed: https://, http://, or / (relative).
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">
              Overrides default self-referencing canonical URL if specified.
            </span>
          </div>
        );
      },
    },
    ogTitle: {
      type: "text",
      label: "Open Graph Title (Social Share)",
    },
    ogDescription: {
      type: "textarea",
      label: "Open Graph Description (Social Share)",
    },
    ogImage: {
      type: "custom",
      label: "Open Graph Image (Upload or URL)",
      render: ({ value, onChange, readOnly }) => {
        const [isUploading, setIsUploading] = useState(false);
        const [uploadError, setUploadError] = useState<string | null>(null);
        const strVal = typeof value === "string" ? value : "";
        const isValid = !strVal || isValidImageUrl(strVal);

        async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
          const file = e.target.files?.[0];
          if (!file) return;

          if (!file.type.startsWith("image/")) {
            setUploadError("Please select a valid image file (PNG, JPG, WebP).");
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
              const adminPw =
                typeof window !== "undefined"
                  ? sessionStorage.getItem("smg_tools_admin_pw") || ""
                  : "";
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
                setUploadError(res?.error || "Failed to upload social image.");
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
              placeholder="https://... or upload social share image"
              className={`w-full rounded-md border px-3 py-2 text-xs outline-none transition-colors ${
                !isValid
                  ? "border-destructive bg-destructive/10 text-destructive focus:ring-1 focus:ring-destructive"
                  : "border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring"
              }`}
            />
            {!isValid && (
              <span className="text-xs text-destructive">
                Invalid Image URL. data: and javascript: URLs are rejected.
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
                  {isUploading ? "Uploading..." : "📁 Upload Social Image"}
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
              <div className="mt-1 relative rounded-md overflow-hidden border border-slate-200 bg-slate-50 h-20 flex items-center justify-center">
                <img src={strVal} alt="OG Preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>
        );
      },
    },
  },
};
