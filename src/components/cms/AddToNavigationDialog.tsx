import { useState, useEffect } from "react";
import { getCmsSiteSettings, saveCmsSiteSettings } from "@/lib/cms.server";
import { type CmsSiteSettings } from "@/lib/cms-settings";
import { insertPageIntoSettings, findPageNavigationLinks } from "@/lib/cms-nav-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Menu,
  PanelTop,
  PanelBottom,
  FolderTree,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface AddToNavigationDialogProps {
  page: { title: string; slug: string } | null;
  isOpen: boolean;
  onClose: () => void;
  adminPassword: string;
  onSuccess?: () => void;
}

export function AddToNavigationDialog({
  page,
  isOpen,
  onClose,
  adminPassword,
  onSuccess,
}: AddToNavigationDialogProps) {
  const [settings, setSettings] = useState<CmsSiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [navType, setNavType] = useState<"header_top" | "header_sub" | "footer">("header_top");
  const [parentId, setParentId] = useState<string>("");
  const [groupId, setGroupId] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [href, setHref] = useState<string>("");

  // Existing links for current page
  const [existingLinks, setExistingLinks] = useState<ReturnType<typeof findPageNavigationLinks>>([]);

  // Fetch settings whenever dialog opens
  useEffect(() => {
    if (isOpen && page) {
      setLabel(page.title || "");
      const cleanSlug = page.slug.replace(/^\/+/, "");
      setHref(`/${cleanSlug}`);
      fetchSettings();
    }
  }, [isOpen, page]);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const res = await getCmsSiteSettings();
      if (res?.settings) {
        setSettings(res.settings);
        const links = findPageNavigationLinks(page?.slug || "", res.settings);
        setExistingLinks(links);

        // Set default parent dropdown or footer group if available
        const firstHeader = res.settings.header?.navItems?.[0]?.id || "";
        setParentId(firstHeader);

        const firstFooterGroup = res.settings.footer?.linkGroups?.[0]?.id || "";
        setGroupId(firstFooterGroup);
      }
    } catch (err) {
      console.error("Failed to load CMS settings for Add to Nav:", err);
      toast.error("Failed to load navigation configuration.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAdd() {
    if (!label.trim()) {
      toast.error("Please enter a link label.");
      return;
    }
    if (!href.trim()) {
      toast.error("Please enter a destination URL.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Fetch freshest settings immediately before saving to prevent overwriting concurrent edits
      const freshRes = await getCmsSiteSettings();
      const currentSettings = freshRes?.settings || settings;
      if (!currentSettings) {
        toast.error("Unable to load latest site settings.");
        setIsSaving(false);
        return;
      }

      // 2. Insert into settings structure
      const insertOptions: Parameters<typeof insertPageIntoSettings>[1] = {
        target: navType,
        label,
        href,
      };
      if (navType === "header_sub") insertOptions.parentId = parentId;
      if (navType === "footer") insertOptions.groupId = groupId;
      const insertResult = insertPageIntoSettings(currentSettings, insertOptions);

      if (!insertResult.success) {
        if (insertResult.skipped) {
          toast.info(insertResult.message || "This URL is already in the navigation.");
          onClose();
        } else {
          toast.error(insertResult.message || "Failed to add to navigation.");
        }
        setIsSaving(false);
        return;
      }

      // 3. Save updated settings
      const saveRes = await saveCmsSiteSettings({
        data: {
          settings: insertResult.updatedSettings,
          adminPassword,
        },
      });

      if (saveRes.success) {
        toast.success(insertResult.message || `Added "${label}" to navigation!`);
        onSuccess?.();
        onClose();
      } else {
        toast.error(saveRes.error || "Failed to save navigation changes.");
      }
    } catch (err: any) {
      console.error("Add to navigation error:", err);
      toast.error(err?.message || "An error occurred while updating navigation.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen || !page) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-navy">
            <Menu className="size-5 text-navy" />
            Add &ldquo;{page.title}&rdquo; to Navigation
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Quickly add a link to this published page in the main site header or footer navigation.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="size-5 animate-spin text-navy" />
            <span className="text-xs">Loading navigation configuration...</span>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Existing links warning / status */}
            {existingLinks.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-blue-800">
                  <CheckCircle2 className="size-3.5 text-blue-600" />
                  Currently linked in {existingLinks.length} location{existingLinks.length > 1 ? "s" : ""}:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-blue-700 pl-1">
                  {existingLinks.map((loc, i) => (
                    <li key={i}>{loc.location}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Target Location Selector */}
            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Destination Placement
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNavType("header_top")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    navType === "header_top"
                      ? "border-navy bg-navy/5 text-navy font-bold shadow-xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <PanelTop className="size-4 mb-1 text-navy" />
                  <span>Header Top</span>
                  <span className="text-[10px] text-slate-400 font-normal">Main menu item</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNavType("header_sub")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    navType === "header_sub"
                      ? "border-navy bg-navy/5 text-navy font-bold shadow-xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <FolderTree className="size-4 mb-1 text-navy" />
                  <span>Header Submenu</span>
                  <span className="text-[10px] text-slate-400 font-normal">Inside dropdown</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNavType("footer")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    navType === "footer"
                      ? "border-navy bg-navy/5 text-navy font-bold shadow-xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <PanelBottom className="size-4 mb-1 text-navy" />
                  <span>Footer Column</span>
                  <span className="text-[10px] text-slate-400 font-normal">Footer link list</span>
                </button>
              </div>
            </div>

            {/* Parent Dropdown Selection (if header_sub) */}
            {navType === "header_sub" && (
              <div>
                <Label htmlFor="parent-nav-select" className="text-xs font-medium text-slate-700">
                  Select Parent Menu Item
                </Label>
                <select
                  id="parent-nav-select"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="mt-1 w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-navy"
                >
                  {(settings?.header?.navItems || []).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label} ({item.children?.length || 0} sub-items)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Footer Group Selection (if footer) */}
            {navType === "footer" && (
              <div>
                <Label htmlFor="footer-group-select" className="text-xs font-medium text-slate-700">
                  Select Footer Link Column
                </Label>
                <select
                  id="footer-group-select"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="mt-1 w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 outline-none focus:border-navy"
                >
                  {(settings?.footer?.linkGroups || []).map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.title} ({group.links?.length || 0} links)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Link Label */}
            <div>
              <Label htmlFor="link-label" className="text-xs font-medium text-slate-700">
                Navigation Link Label
              </Label>
              <Input
                id="link-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Accounting Services"
                className="mt-1 text-xs"
              />
            </div>

            {/* Link URL / Href */}
            <div>
              <Label htmlFor="link-href" className="text-xs font-medium text-slate-700">
                Destination URL / Slug
              </Label>
              <Input
                id="link-href"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="/page-slug"
                className="mt-1 text-xs font-mono"
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="text-xs rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAdd}
            disabled={isLoading || isSaving}
            className="text-xs rounded-full bg-navy text-white hover:bg-navy/90 gap-1.5"
          >
            {isSaving ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                Adding to Nav...
              </>
            ) : (
              <>
                <PlusCircle className="size-3.5" />
                Add to Navigation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
