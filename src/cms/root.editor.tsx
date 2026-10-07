import * as React from "react";
import type { ComponentConfig } from "@puckeditor/core";
import { usePuck } from "@puckeditor/core";
import { Plus } from "lucide-react";
import { CmsRoot, isValidCanonicalUrl, type CmsRootProps } from "./root";
import { createImagePickerField } from "./fields/ImagePicker";
import { createLinkPickerField } from "./fields/LinkPicker";
import { defaultSectionProps } from "./blocks/Section";
import { CmsCanvasContextMenu } from "./editor-context-menu";

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

        /* Clean single-line outline on hover */
        [data-puck-component] {
          transition: outline 0.12s ease;
          position: relative;
        }

        [data-puck-component]:hover:not([data-puck-selected="true"]):not(.puck-component--selected) {
          outline: 1.5px dashed #2563eb !important;
          outline-offset: -1px !important;
          cursor: pointer;
        }

        /* Clean single-line outline on selection */
        [data-puck-selected="true"],
        .puck-component--selected {
          outline: 2px solid #2563eb !important;
          outline-offset: -1px !important;
          box-shadow: none !important;
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

        /* Smooth DropZone highlight and flex flow for inline elements */
        [data-puck-drop-zone],
        .puck-drop-zone {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: wrap !important;
          align-items: flex-start !important;
          align-content: flex-start !important;
          width: 100% !important;
        }

        /* Default block components take full width */
        [data-puck-component] {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        /* Inline Puck components shrink and sit side-by-side like real CSS */
        [data-puck-component]:has([data-cms-display="inline"]),
        [data-puck-component]:has([data-cms-inline="true"]),
        [data-puck-component]:has(.cms-inline-element) {
          display: inline-flex !important;
          width: auto !important;
          max-width: 100% !important;
          vertical-align: top !important;
          flex-grow: 0 !important;
          flex-shrink: 0 !important;
        }

        /* Percentage and preset widths on Puck components */
        [data-puck-component]:has([data-cms-width="20%"]) { width: 20% !important; }
        [data-puck-component]:has([data-cms-width="25%"]) { width: 25% !important; }
        [data-puck-component]:has([data-cms-width="30%"]) { width: 30% !important; }
        [data-puck-component]:has([data-cms-width="33%"]) { width: 33.333% !important; }
        [data-puck-component]:has([data-cms-width="35%"]) { width: 35% !important; }
        [data-puck-component]:has([data-cms-width="40%"]) { width: 40% !important; }
        [data-puck-component]:has([data-cms-width="45%"]) { width: 45% !important; }
        [data-puck-component]:has([data-cms-width="50%"]) { width: 50% !important; }
        [data-puck-component]:has([data-cms-width="55%"]) { width: 55% !important; }
        [data-puck-component]:has([data-cms-width="60%"]) { width: 60% !important; }
        [data-puck-component]:has([data-cms-width="65%"]) { width: 65% !important; }
        [data-puck-component]:has([data-cms-width="66%"]) { width: 66.666% !important; }
        [data-puck-component]:has([data-cms-width="70%"]) { width: 70% !important; }
        [data-puck-component]:has([data-cms-width="75%"]) { width: 75% !important; }
        [data-puck-component]:has([data-cms-width="80%"]) { width: 80% !important; }
        [data-puck-component]:has([data-cms-width="85%"]) { width: 85% !important; }
        [data-puck-component]:has([data-cms-width="90%"]) { width: 90% !important; }
        [data-puck-component]:has([data-cms-width="auto"]) { width: max-content !important; max-width: 100% !important; }
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

      {/* Right-Click Context Menu & Quick Property Manager */}
      <CmsCanvasContextMenu />
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
