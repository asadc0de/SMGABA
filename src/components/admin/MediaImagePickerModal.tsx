import { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload,
  Image as ImageIcon,
  Link2,
  Search,
  Check,
  X,
  Loader2,
  Trash2,
  Sparkles,
  Users,
  Building,
  TrendingUp,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadCmsImage, listCmsImages } from "@/lib/cms.server";

export interface GalleryItem {
  label: string;
  url: string;
  category: "team" | "stock" | "curated" | "uploaded";
}

const TEAM_AVATARS: GalleryItem[] = [
  { label: "Gregory Scotto (Partner)", url: "/images/team/greg.webp", category: "team" },
  { label: "Amanda Scotto", url: "/images/team/dsc.webp", category: "team" },
  { label: "Alejandro", url: "/images/team/alejandro.webp", category: "team" },
  { label: "Corey", url: "/images/team/corey-1.webp", category: "team" },
  { label: "Courtney", url: "/images/team/courtney.webp", category: "team" },
  { label: "Cynthia", url: "/images/team/cynthia.webp", category: "team" },
  { label: "Dave", url: "/images/team/dave.webp", category: "team" },
  { label: "Dominic", url: "/images/team/dominic.webp", category: "team" },
  { label: "Erin", url: "/images/team/erin.webp", category: "team" },
  { label: "James", url: "/images/team/jamed.webp", category: "team" },
  { label: "Kevin", url: "/images/team/kevin.webp", category: "team" },
  { label: "Kin", url: "/images/team/kin.webp", category: "team" },
  { label: "Leeat", url: "/images/team/leeat.webp", category: "team" },
  { label: "Maria", url: "/images/team/maria.webp", category: "team" },
  { label: "Marine", url: "/images/team/marine.webp", category: "team" },
  { label: "Muhammad", url: "/images/team/muhammad.webp", category: "team" },
  { label: "Wes", url: "/images/team/wes.webp", category: "team" },
];

const LOCAL_STOCK: GalleryItem[] = [
  { label: "Financial Analysis & Balance Sheets", url: "/images/stock/unsplash-photo-1454165804606-c3d57bc86b40.webp", category: "stock" },
  { label: "Executive Advisory Meeting", url: "/images/stock/unsplash-photo-1522071820081-009f0129c71c.webp", category: "stock" },
  { label: "Modern Corporate Architecture", url: "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.webp", category: "stock" },
  { label: "Data Analytics & Market Growth", url: "/images/stock/unsplash-photo-1460925895917-afdab827c52f.webp", category: "stock" },
  { label: "Executive Planning & Collaboration", url: "/images/stock/unsplash-photo-1517245386807-bb43f82c33c4.webp", category: "stock" },
  { label: "Boardroom Strategic Consultation", url: "/images/stock/unsplash-photo-1517248135467-4c7edcad34c4.webp", category: "stock" },
  { label: "Business Contracts & Legal Review", url: "/images/stock/unsplash-photo-1450101499163-c8848c66ca85.webp", category: "stock" },
  { label: "Hospitality & Restaurant Operations", url: "/images/stock/unsplash-photo-1441986300917-64674bd600d8.webp", category: "stock" },
  { label: "Modern Office Workspace", url: "/images/stock/unsplash-photo-1497366216548-37526070297c.webp", category: "stock" },
  { label: "Professional CPA Advisory", url: "/images/stock/unsplash-photo-1573496359142-b8d87734a5a2.webp", category: "stock" },
  { label: "Tax Calculation & Fiscal Strategy", url: "/images/stock/unsplash-photo-1554224155-8d04cb21cd6c.webp", category: "stock" },
  { label: "Executive Leadership & Consultation", url: "/images/stock/unsplash-photo-1573497019940-1c28c88b4f3e.webp", category: "stock" },
  { label: "Real Estate & Construction Strategy", url: "/images/stock/unsplash-photo-1504307651254-35680f356dfd.webp", category: "stock" },
  { label: "Investment & Wealth Management", url: "/images/stock/unsplash-photo-1579532537598-459ecdaf39cc.webp", category: "stock" },
  { label: "Industrial & Manufacturing Review", url: "/images/stock/unsplash-photo-1581091226825-a6a2a5aee158.webp", category: "stock" },
  { label: "Corporate Legal Advisory", url: "/images/stock/unsplash-photo-1589829545856-d10d557cf95f.webp", category: "stock" },
];

const CURATED_PRESETS: GalleryItem[] = [
  { label: "Bookkeeping & Financial Spreadsheets", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80", category: "curated" },
  { label: "CFO Advisory & Performance Dashboard", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", category: "curated" },
  { label: "Executive Client Strategy Session", url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80", category: "curated" },
  { label: "Modern Advisory Headquarters", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", category: "curated" },
  { label: "Hospitality & Dining Prime Costs", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", category: "curated" },
  { label: "Leadership Collaboration & Growth", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", category: "curated" },
];

interface MediaImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
  title?: string;
  defaultTab?: "device" | "gallery" | "url";
}

export function MediaImagePickerModal({
  isOpen,
  onClose,
  onSelect,
  currentValue = "",
  title = "Select or Upload Image",
  defaultTab = "device",
}: MediaImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<"device" | "gallery" | "url">(defaultTab);
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customUrl, setCustomUrl] = useState(currentValue);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<GalleryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded images from Supabase Storage on open
  useEffect(() => {
    if (!isOpen) return;
    setCustomUrl(currentValue);

    const adminPw =
      typeof window !== "undefined"
        ? localStorage.getItem("smg_tools_admin_pw") || sessionStorage.getItem("smg_tools_admin_pw") || ""
        : "";

    listCmsImages({ data: { adminPassword: adminPw } })
      .then((res: any) => {
        if (res?.success && Array.isArray(res?.images)) {
          const items: GalleryItem[] = res.images.map((img: any) => ({
            label: img.name || "Uploaded Image",
            url: img.url,
            category: "uploaded",
          }));
          setUploadedImages(items);
        }
      })
      .catch(() => {});
  }, [isOpen, currentValue]);

  // Combined gallery
  const allGalleryItems = useMemo(() => {
    return [...uploadedImages, ...TEAM_AVATARS, ...LOCAL_STOCK, ...CURATED_PRESETS];
  }, [uploadedImages]);

  // Filtered gallery items
  const filteredGallery = useMemo(() => {
    return allGalleryItems.filter((item) => {
      const matchesCategory =
        galleryFilter === "all" || item.category === galleryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [allGalleryItems, galleryFilter, searchQuery]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP, SVG, GIF)");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading "${file.name}"...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(",")[1];
          const adminPw =
            typeof window !== "undefined"
              ? localStorage.getItem("smg_tools_admin_pw") || sessionStorage.getItem("smg_tools_admin_pw") || ""
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
            onSelect(res.url);
            toast.dismiss(toastId);
            toast.success("Image uploaded successfully!");
            onClose();
          } else {
            // Fallback to data URL so the user is never blocked
            const dataUrl = reader.result as string;
            onSelect(dataUrl);
            toast.dismiss(toastId);
            toast.success("Image selected from your computer!");
            onClose();
          }
        } catch {
          const dataUrl = reader.result as string;
          onSelect(dataUrl);
          toast.dismiss(toastId);
          toast.success("Image selected from your computer!");
          onClose();
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || "Failed to process image file.");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-navy text-white flex items-center justify-center shadow-xs">
              <ImageIcon className="size-4" />
            </div>
            <div>
              <h3 className="font-serif-hero text-base font-bold text-navy">{title}</h3>
              <p className="text-[11px] text-slate-500">
                Upload from your device, pick from the photo gallery, or paste an image URL.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Top Tab Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("device")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "device"
                ? "bg-navy text-white shadow-xs"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Upload className="size-3.5" />
            <span>Upload from Device</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "gallery"
                ? "bg-navy text-white shadow-xs"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Sparkles className="size-3.5 text-amber-500" />
            <span>Photo Gallery ({allGalleryItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "url"
                ? "bg-navy text-white shadow-xs"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Link2 className="size-3.5" />
            <span>Web URL</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 min-h-[340px]">
          {/* TAB 1: UPLOAD FROM DEVICE */}
          {activeTab === "device" && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center transition-all ${
                  isDraggingOver
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-slate-300 hover:border-navy hover:bg-slate-50/60 bg-slate-50/30"
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-10 text-primary animate-spin" />
                    <span className="text-sm font-bold text-navy">
                      Uploading image from your device...
                    </span>
                    <span className="text-xs text-slate-500">
                      Processing high-resolution image upload
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="size-16 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-4 shadow-xs">
                      <Upload className="size-7" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-navy">
                      Click to choose an image from your computer or phone
                    </span>
                    <span className="text-xs text-slate-500 mt-1 max-w-sm">
                      Or drag and drop an image file here. Supports JPG, PNG, WebP, SVG, and GIF up to 10MB.
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      className="mt-5 rounded-full bg-navy text-white hover:bg-navy/90 text-xs px-6 font-semibold shadow-md shadow-navy/10 pointer-events-none"
                    >
                      Browse Device Files
                    </Button>
                  </>
                )}
              </div>

              {/* Current Image Info */}
              {currentValue && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={currentValue}
                      alt="Current preview"
                      className="size-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-700 block truncate">
                        Currently Selected:
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block font-mono">
                        {currentValue}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onSelect("");
                      toast.success("Image removed");
                      onClose();
                    }}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PHOTO GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              {/* Category Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "all", label: "All Images", icon: Sparkles },
                    { id: "team", label: "Team Headshots", icon: Users },
                    { id: "stock", label: "Stock & Office", icon: Building },
                    { id: "curated", label: "Finance & Advisory", icon: TrendingUp },
                    ...(uploadedImages.length > 0
                      ? [{ id: "uploaded", label: `Uploads (${uploadedImages.length})`, icon: FolderOpen }]
                      : []),
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setGalleryFilter(tab.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                        galleryFilter === tab.id
                          ? "bg-navy text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
                      }`}
                    >
                      <tab.icon className="size-3" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search gallery..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs rounded-full bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              {/* Gallery Grid */}
              {filteredGallery.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
                  No images found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredGallery.map((item, idx) => {
                    const isSelected = currentValue === item.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onSelect(item.url);
                          toast.success(`Selected "${item.label}"`);
                          onClose();
                        }}
                        className={`group relative rounded-2xl overflow-hidden border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-navy ring-3 ring-navy/30 scale-[1.02] shadow-md"
                            : "border-slate-200 hover:border-navy hover:shadow-md"
                        }`}
                      >
                        <div className="aspect-4/3 w-full overflow-hidden bg-slate-100">
                          <img
                            src={item.url}
                            alt={item.label}
                            loading="lazy"
                            className="size-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        <div className="p-2 bg-white border-t border-slate-100">
                          <p className="text-[11px] font-bold text-navy truncate">
                            {item.label}
                          </p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">
                            {item.category}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-navy text-white rounded-full p-1 shadow-md">
                            <Check className="size-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WEB URL */}
          {activeTab === "url" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Image Web Address / Path
                </label>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://images.unsplash.com/... or /images/..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="text-xs h-10 rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (!customUrl.trim()) {
                        toast.error("Please enter a valid image URL");
                        return;
                      }
                      onSelect(customUrl.trim());
                      toast.success("Image URL applied!");
                      onClose();
                    }}
                    className="rounded-xl bg-navy text-white hover:bg-navy/90 text-xs px-5 shrink-0"
                  >
                    Apply URL
                  </Button>
                </div>
              </div>

              {/* Preview */}
              {customUrl ? (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                  <span className="text-xs font-semibold text-slate-600 block">
                    Live Preview:
                  </span>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white max-h-64 flex items-center justify-center">
                    <img
                      src={customUrl}
                      alt="Preview"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed rounded-2xl text-center text-xs text-slate-400">
                  Enter an image URL above to preview it here
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Clean inline input helper that includes a preview thumbnail, URL text,
 * and a "Choose from Gallery / Device" button that opens MediaImagePickerModal.
 */
interface MediaImageInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function MediaImageInput({
  value,
  onChange,
  label,
  placeholder = "/images/team/greg.webp or https://...",
  className = "",
}: MediaImageInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="text-xs font-bold text-slate-700 block">{label}</label>}

      <div className="flex items-center gap-2">
        {/* Preview Thumbnail */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="size-10 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 cursor-pointer hover:border-navy transition flex items-center justify-center group relative shadow-2xs"
          title="Click to change image"
        >
          {value ? (
            <img
              src={value}
              alt="Thumbnail"
              className="size-full object-cover group-hover:scale-105 transition"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <ImageIcon className="size-4 text-slate-400 group-hover:text-navy" />
          )}
        </div>

        {/* Path / URL input */}
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 text-xs rounded-xl flex-1 bg-white font-mono"
        />

        {/* Gallery / Device Trigger Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-3.5 rounded-xl text-xs font-bold text-navy hover:bg-slate-100 border-slate-200 gap-1.5 shrink-0 shadow-2xs cursor-pointer"
        >
          <Upload className="size-3.5 text-primary" />
          <span>Choose Image</span>
        </Button>

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="Clear Image"
            className="size-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition shrink-0 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Modal */}
      <MediaImagePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(newUrl) => onChange(newUrl)}
        currentValue={value}
        title={label ? `Select ${label}` : "Choose Image"}
      />
    </div>
  );
}

