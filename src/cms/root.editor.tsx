import * as React from "react";
import type { ComponentConfig } from "@puckeditor/core";
import { usePuck } from "@puckeditor/core";
import { Plus } from "lucide-react";
import { CmsRoot, isValidCanonicalUrl, type CmsRootProps } from "./root";
import { createImagePickerField } from "./fields/ImagePicker";
import { createLinkPickerField } from "./fields/LinkPicker";
import { defaultSectionProps } from "./blocks/Section";

export function CmsRootEditor(props: CmsRootProps) {
  const { dispatch, appState } = usePuck();

  const handleAddBlankSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSectionId = `Section-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    dispatch({
      type: "setData",
      data: (prevData) => ({
        ...prevData,
        content: [
          ...(prevData.content || []),
          {
            type: "Section",
            props: {
              id: newSectionId,
              ...defaultSectionProps,
            },
          },
        ],
      }),
    });
  };

  return (
    <div className="w-full relative pb-20">
      {/* Visual selection and hover outline styles injected directly into canvas iframe */}
      <style>{`
        :root {
          --puck-color-selection-border: #2563eb;
          --puck-color-interactive: #0f2142;
        }

        /* Hover outline on any element inside canvas */
        [data-puck-component] {
          transition: outline 0.15s ease, box-shadow 0.15s ease;
          position: relative;
        }

        [data-puck-component]:hover:not([data-puck-selected="true"]):not(.puck-component--selected) {
          outline: 2px dashed #3b82f6 !important;
          outline-offset: 2px !important;
          cursor: pointer;
        }

        /* Selected element outline */
        [data-puck-selected="true"],
        .puck-component--selected {
          outline: 2.5px solid #2563eb !important;
          outline-offset: 2.5px !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2) !important;
        }

        /* Puck overlay action buttons */
        [data-puck-overlay] button {
          cursor: pointer;
          transition: all 0.15s ease;
        }

        [data-puck-overlay] button:hover {
          transform: scale(1.08);
        }

        [data-puck-overlay] button:active {
          transform: scale(0.95);
        }

        /* Smooth DropZone highlight */
        [data-puck-drop-zone] {
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
      `}</style>

      <CmsRoot {...props}>
        {props.children}
      </CmsRoot>

      {/* Prominent + Add Blank Section button placed at the bottom of the canvas */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={handleAddBlankSection}
          className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-[#0f2142] text-[#0f2142] hover:text-white border-2 border-dashed border-slate-300 hover:border-[#0f2142] shadow-sm hover:shadow-md transition-all duration-200 text-xs font-bold cursor-pointer"
        >
          <div className="size-5 rounded-full bg-[#0f2142]/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <Plus className="size-3.5 stroke-[3]" />
          </div>
          <span>+ Add Blank Section Beneath</span>
        </button>
      </div>
    </div>
  );
}

export const rootEditorConfig: ComponentConfig<CmsRootProps> = {
  render: CmsRootEditor,
  fields: {
    title: {
      type: "text",
      label: "Page Heading / Internal Title",
    },
    showPageHero: {
      type: "custom",
      label: "Top Header Banner (Image Section)",
      render: ({ value, onChange, readOnly }) => {
        const isEnabled = Boolean(value);
        return (
          <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl my-1">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Top Header Banner</span>
                <span className="text-[11px] text-slate-500">
                  {isEnabled ? "Banner is VISIBLE at top of page" : "Banner is HIDDEN (clean page)"}
                </span>
              </div>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange(!isEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isEnabled ? "bg-navy" : "bg-slate-300"
                }`}
                title={isEnabled ? "Click to remove/hide header banner" : "Click to add/show header banner"}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="flex gap-1.5 pt-1">
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange(true)}
                className={`flex-1 py-1 px-2 text-xs font-semibold rounded-md border transition-all ${
                  isEnabled
                    ? "bg-navy text-white border-navy shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Show Banner
              </button>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => onChange(false)}
                className={`flex-1 py-1 px-2 text-xs font-semibold rounded-md border transition-all ${
                  !isEnabled
                    ? "bg-navy text-white border-navy shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Hide / Remove Banner
              </button>
            </div>
            {!isEnabled && (
              <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100 leading-relaxed">
                💡 Header banner is hidden. You can build your page freely using blocks (such as the &quot;Top Banner&quot; block from the left panel).
              </p>
            )}
          </div>
        );
      },
    },
    heroEyebrow: {
      type: "text",
      label: "Banner Eyebrow Badge (Optional)",
    },
    heroDescription: {
      type: "textarea",
      label: "Banner Description (Optional, falls back to Meta Description)",
    },
    heroImage: createImagePickerField({
      label: "Banner Background Image (Upload, Gallery, or URL)",
      placeholder: "https://..., /assets/hero.jpg, or pick from gallery",
    }),
    heroPrimaryCtaText: {
      type: "text",
      label: "Banner Primary Button Label (Optional)",
    },
    heroPrimaryCtaHref: createLinkPickerField({
      label: "Banner Primary Button Link",
      placeholder: "Select page or enter link",
    }),
    heroSecondaryCtaText: {
      type: "text",
      label: "Banner Secondary Button Label (Optional)",
    },
    heroSecondaryCtaHref: createLinkPickerField({
      label: "Banner Secondary Button Link",
      placeholder: "Select page or enter link",
    }),
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

export default rootEditorConfig;
