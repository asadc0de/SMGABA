import type { ComponentConfig } from "@puckeditor/core";
import { CmsRoot, isValidCanonicalUrl, type CmsRootProps } from "./root";
import { createImagePickerField } from "./fields/ImagePicker";

export const rootEditorConfig: ComponentConfig<CmsRootProps> = {
  render: CmsRoot,
  fields: {
    title: {
      type: "text",
      label: "Page Heading / Internal Title",
    },
    showPageHero: {
      type: "radio",
      label: "Automatic Page Hero Header",
      options: [
        { label: "Show Hero Header", value: true },
        { label: "Hide Hero Header", value: false },
      ],
    },
    heroEyebrow: {
      type: "text",
      label: "Hero Eyebrow Badge (Optional)",
    },
    heroDescription: {
      type: "textarea",
      label: "Hero Description (Optional, falls back to Meta Description)",
    },
    heroImage: createImagePickerField({
      label: "Hero Background Image (Upload, Gallery, or URL)",
      placeholder: "https://..., /assets/hero.jpg, or pick from gallery",
    }),
    heroPrimaryCtaText: {
      type: "text",
      label: "Hero Primary Button Label (Optional)",
    },
    heroPrimaryCtaHref: {
      type: "text",
      label: "Hero Primary Button Link (/path or https://...)",
    },
    heroSecondaryCtaText: {
      type: "text",
      label: "Hero Secondary Button Label (Optional)",
    },
    heroSecondaryCtaHref: {
      type: "text",
      label: "Hero Secondary Button Link (/path or https://...)",
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
    ogImage: createImagePickerField({
      label: "Open Graph Image (Upload, Gallery, or URL)",
      placeholder: "https://... or upload/pick social share image",
    }),
  },
};

