import React, { useState, useEffect, useId } from "react";
import type { CustomField } from "@puckeditor/core";
import { uploadCmsImage, listCmsImages } from "@/lib/cms.server";
import { isValidImageUrl } from "../blocks/Image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Upload,
  Image as ImageIcon,
  Check,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

export interface ImagePickerFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
}

// Curated stock & site presets for fast selection
const SITE_ASSETS = [
  {
    name: "SMG Logo (Primary Dark)",
    url: "/smg-logo.svg",
    category: "Logos",
  },
  {
    name: "SMG Logo (White Monochrome)",
    url: "/smg-logo-white.svg",
    category: "Logos",
  },
  {
    name: "Core Values / Team Drive",
    url: "/core-values-drive.jpg",
    category: "Site Photos",
  },
  {
    name: "QuickBooks Partner Logo",
    url: "/Slider Logos/Intuit_QuickBooks_logo-removebg-preview.png",
    category: "Partner Logos",
  },
  {
    name: "ADP Partner Logo",
    url: "/Slider Logos/adp.png",
    category: "Partner Logos",
  },
  {
    name: "Bill.com Partner Logo",
    url: "/Slider Logos/bill.png",
    category: "Partner Logos",
  },
  {
    name: "GoTab Partner Logo",
    url: "/Slider Logos/gotab.png",
    category: "Partner Logos",
  },
];

const CURATED_STOCK_PHOTOS = [
  {
    name: "Modern Executive Office & City View",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate & Hero",
  },
  {
    name: "Financial Data & Analytics Dashboard",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    category: "Finance & Analytics",
  },
  {
    name: "Executive Leadership Strategy Session",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    category: "Team & Advisory",
  },
  {
    name: "Professional Executive Portrait (Marcus)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    category: "Portraits",
  },
  {
    name: "Professional Financial Director Portrait (Elena)",
    url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    category: "Portraits",
  },
  {
    name: "Senior Advisor Portrait (David)",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    category: "Portraits",
  },
  {
    name: "Modern Glass Architecture / Skyline",
    url: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80",
    category: "Corporate & Hero",
  },
  {
    name: "Financial Planning & Tax Consultation",
    url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    category: "Finance & Analytics",
  },
  {
    name: "Collaborative Team Working on Growth",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    category: "Team & Advisory",
  },
];

interface UploadedImageItem {
  name: string;
  url: string;
  size?: number;
  createdAt?: string;
}

export function ImagePickerInput({
  value,
  onChange,
  readOnly,
  label = "Image",
  placeholder = "https://..., /assets/photo.jpg, or pick below",
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  label?: string;
  placeholder?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [libraryImages, setLibraryImages] = useState<UploadedImageItem[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"uploaded" | "site" | "stock">("uploaded");
  const fileInputId = useId();

  const strVal = typeof value === "string" ? value : "";
  const isValid = !strVal || isValidImageUrl(strVal);

  async function loadLibrary() {
    setIsLoadingLibrary(true);
    try {
      const adminPw =
        typeof window !== "undefined"
          ? sessionStorage.getItem("smg_tools_admin_pw") || ""
          : "";
      const res = await listCmsImages({ data: { adminPassword: adminPw } });
      if (res && res.success && Array.isArray(res.images)) {
        setLibraryImages(res.images);
      }
    } catch (err: any) {
      console.warn("Failed to load library images:", err);
    } finally {
      setIsLoadingLibrary(false);
    }
  }

  function handleOpenGallery() {
    setIsGalleryOpen(true);
    loadLibrary();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
          // If modal open, refresh library
          if (isGalleryOpen) {
            loadLibrary();
          }
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

  // Filter gallery items by search
  const filteredUploaded = libraryImages.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSiteAssets = SITE_ASSETS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredStock = CURATED_STOCK_PHOTOS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={strVal}
          disabled={readOnly || isUploading}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border px-3 py-1.5 text-xs outline-none transition-colors ${
            !isValid
              ? "border-destructive bg-destructive/10 text-destructive focus:ring-1 focus:ring-destructive"
              : "border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring"
          }`}
        />
        {strVal && (
          <button
            type="button"
            title="Clear image URL"
            onClick={() => onChange("")}
            className="p-1.5 text-slate-400 hover:text-destructive hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {!isValid && (
        <span className="text-[11px] text-destructive">
          Invalid image URL. Allowed: https://, http://, / (relative). data: and javascript: are rejected.
        </span>
      )}

      {/* Action Buttons: Direct Upload + Media Gallery Modal */}
      <div className="grid grid-cols-2 gap-1.5">
        <label
          htmlFor={fileInputId}
          className={`flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 cursor-pointer transition-colors ${
            isUploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="size-3.5 text-slate-500" />
          <span>{isUploading ? "Uploading..." : "Upload File"}</span>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            disabled={readOnly || isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={handleOpenGallery}
          className="flex items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1.5 text-xs font-medium text-blue-700 transition-colors cursor-pointer"
        >
          <Layers className="size-3.5 text-blue-600" />
          <span>Media Library</span>
        </button>
      </div>

      {uploadError && (
        <span className="text-[11px] text-destructive bg-destructive/10 p-1.5 rounded">
          {uploadError}
        </span>
      )}

      {/* Thumbnail Preview */}
      {strVal && isValid && (
        <div className="relative rounded-md overflow-hidden border border-slate-200 bg-slate-50 p-1 flex items-center justify-between gap-2">
          <div className="h-14 w-20 shrink-0 rounded overflow-hidden bg-slate-200 flex items-center justify-center">
            <img
              src={strVal}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-[11px] font-mono text-slate-600 truncate">{strVal}</p>
            <a
              href={strVal}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5 mt-0.5"
            >
              <span>Open in new tab</span>
              <ExternalLink className="size-2.5" />
            </a>
          </div>
        </div>
      )}

      {/* Media Library Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-5 pb-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold text-navy flex items-center gap-2">
                  <ImageIcon className="size-5 text-primary" />
                  Media Library & Gallery
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Select an image from your storage, site assets, or high-res photography presets.
                </DialogDescription>
              </div>
              <label className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 cursor-pointer transition-colors">
                <Upload className="size-3.5" />
                <span>Upload New</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Navigation Tabs & Search */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("uploaded")}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === "uploaded"
                      ? "bg-white text-navy shadow-xs font-semibold"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Uploaded Storage ({libraryImages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("site")}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === "site"
                      ? "bg-white text-navy shadow-xs font-semibold"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  Site Logos & Assets ({SITE_ASSETS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("stock")}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === "stock"
                      ? "bg-white text-navy shadow-xs font-semibold"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  <Sparkles className="size-3 inline mr-1 text-amber-500" />
                  Curated Stock ({CURATED_STOCK_PHOTOS.length})
                </button>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter images..."
                  className="w-full rounded-md border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </DialogHeader>

          {/* Gallery Grid Content */}
          <div className="flex-1 overflow-y-auto p-5 min-h-[320px] max-h-[50vh]">
            {activeTab === "uploaded" && (
              <>
                {isLoadingLibrary ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                    <RefreshCw className="size-6 animate-spin text-primary" />
                    <span className="text-xs">Loading storage images...</span>
                  </div>
                ) : filteredUploaded.length === 0 ? (
                  <div className="text-center py-14 border-2 border-dashed border-slate-200 rounded-xl">
                    <ImageIcon className="size-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-600">No uploaded images found</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Upload your first file using the button above or browse site assets.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                    {filteredUploaded.map((img) => {
                      const isSelected = strVal === img.url;
                      return (
                        <div
                          key={img.url}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            onChange(img.url);
                            setIsGalleryOpen(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              onChange(img.url);
                              setIsGalleryOpen(false);
                            }
                          }}
                          className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-slate-50 transition-all hover:shadow-md hover:border-primary/50 text-left ${
                            isSelected
                              ? "ring-2 ring-primary border-primary bg-primary/5"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center relative">
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 rounded-full bg-primary text-white p-1 shadow-md">
                                <Check className="size-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-medium text-slate-800 truncate" title={img.name}>
                              {img.name.replace(/^cms\/\d+-/, "")}
                            </p>
                            {img.createdAt && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(img.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === "site" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredSiteAssets.map((asset) => {
                  const isSelected = strVal === asset.url;
                  return (
                    <div
                      key={asset.url}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onChange(asset.url);
                        setIsGalleryOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onChange(asset.url);
                          setIsGalleryOpen(false);
                        }
                      }}
                      className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-slate-50 transition-all hover:shadow-md hover:border-primary/50 text-left ${
                        isSelected
                          ? "ring-2 ring-primary border-primary bg-primary/5"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="aspect-4/3 w-full bg-slate-100 p-4 flex items-center justify-center relative">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 rounded-full bg-primary text-white p-1 shadow-md">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-slate-800 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-200/70 text-slate-600">
                          {asset.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "stock" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredStock.map((stock) => {
                  const isSelected = strVal === stock.url;
                  return (
                    <div
                      key={stock.url}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onChange(stock.url);
                        setIsGalleryOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onChange(stock.url);
                          setIsGalleryOpen(false);
                        }
                      }}
                      className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-slate-50 transition-all hover:shadow-md hover:border-primary/50 text-left ${
                        isSelected
                          ? "ring-2 ring-primary border-primary bg-primary/5"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                        <img
                          src={stock.url}
                          alt={stock.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 rounded-full bg-primary text-white p-1 shadow-md">
                            <Check className="size-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-slate-800 truncate" title={stock.name}>
                          {stock.name}
                        </p>
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-700">
                          {stock.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 truncate max-w-sm">
              {strVal ? `Selected: ${strVal}` : "No image selected"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Creates a Puck CustomField for Image Selection with Upload & Media Gallery Picker.
 */
export function createImagePickerField({
  label = "Image Source",
  description,
  placeholder,
}: ImagePickerFieldProps = {}): CustomField<any> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <ImagePickerInput
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        readOnly={readOnly}
        label={label}
        placeholder={placeholder}
      />
    ),
  };
}
