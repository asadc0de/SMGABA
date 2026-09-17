import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useTransition, useMemo } from "react";
import {
  verifyAdminPassword,
  getEventsAdminList,
  saveEvent,
  removeEvent,
  uploadEventThumbnail,
  type EventItem,
} from "@/lib/events-admin";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import {
  Lock,
  Unlock,
  Calendar,
  Clock,
  User,
  PlusCircle,
  RefreshCw,
  Search,
  AlertCircle,
  ShieldAlert,
  Edit2,
  Trash2,
  Video,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Link2,
  FileText,
  X,
  Play,
  Film,
} from "lucide-react";

export const Route = createFileRoute("/tools/events")({
  head: () => ({
    meta: [
      { title: "Events & Webinars Admin | SMG ABA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: async () => {
    try {
      const data = await getEventsAdminList();
      return data;
    } catch (err) {
      console.error("Failed to load events admin list:", err);
      return { events: [], isConfigured: false };
    }
  },
  component: EventsAdminPage,
});

const AUTH_STORAGE_KEY = "smg_tools_admin_pw";

function cleanSlugId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function EventsAdminPage() {
  const initialData = Route.useLoaderData();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Data State
  const [events, setEvents] = useState<EventItem[]>(initialData?.events || []);
  const [isConfigured, setIsConfigured] = useState<boolean>(initialData?.isConfigured ?? false);
  const [isPending, startTransition] = useTransition();

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "past">("all");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [slugId, setSlugId] = useState<string>("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [host, setHost] = useState<string>("");
  const [hostTitle, setHostTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [registrationLink, setRegistrationLink] = useState<string>("");
  const [recordingLink, setRecordingLink] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  // Quick Recording Link Modal State
  const [quickRecordingEvent, setQuickRecordingEvent] = useState<EventItem | null>(null);
  const [quickRecordingValue, setQuickRecordingValue] = useState<string>("");
  const [isSavingQuickRecording, setIsSavingQuickRecording] = useState<boolean>(false);

  // Auto-verify on mount if stored in sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        verifyPassword(stored, false, true);
      }
    }
  }, []);

  async function verifyPassword(pwd: string, showToast = true, isAutoCheck = false) {
    if (!pwd.trim()) {
      if (!isAutoCheck) {
        setAuthError("Please enter the admin password.");
      }
      return;
    }

    setIsVerifying(true);
    if (!isAutoCheck) setAuthError("");

    try {
      const res = await verifyAdminPassword({ data: pwd.trim() });
      if (res.authorized) {
        setIsAuthenticated(true);
        setAdminPassword(pwd.trim());
        sessionStorage.setItem(AUTH_STORAGE_KEY, pwd.trim());
        if (showToast) {
          toast.success("Authenticated successfully");
        }
        refreshList();
      } else {
        setIsAuthenticated(false);
        if (!isAutoCheck) {
          setAuthError(res.error || "Incorrect password.");
        }
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err: any) {
      if (!isAutoCheck) {
        setAuthError(err.message || "Authentication error occurred.");
      }
    } finally {
      setIsVerifying(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAdminPassword("");
    setPasswordInput("");
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    toast.info("Logged out from admin panel");
  }

  async function refreshList() {
    startTransition(async () => {
      try {
        const data = await getEventsAdminList();
        setEvents(data.events);
        setIsConfigured(data.isConfigured);
      } catch (err) {
        toast.error("Failed to refresh events list");
      }
    });
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isSlugManuallyEdited && !editingEventId) {
      setSlugId(cleanSlugId(val));
    }
  }

  function resetForm() {
    setEditingEventId(null);
    setSlugId("");
    setIsSlugManuallyEdited(false);
    setTitle("");
    setSubtitle("");
    setHost("");
    setHostTitle("");
    setEventDate("");
    setTimeRange("");
    setDescription("");
    setRegistrationLink("");
    setRecordingLink("");
    setThumbnailUrl("");
    setIsFormOpen(false);
  }

  function startEdit(event: EventItem) {
    setEditingEventId(event.id);
    setSlugId(event.id);
    setIsSlugManuallyEdited(true);
    setTitle(event.title);
    setSubtitle(event.subtitle || "");
    setHost(event.host);
    setHostTitle(event.host_title || "");
    setEventDate(event.event_date ? event.event_date.slice(0, 10) : "");
    setTimeRange(event.time_range);
    setDescription(event.description);
    setRegistrationLink(event.registration_link);
    setRecordingLink(event.recording_link || "");
    setThumbnailUrl(event.thumbnail_url || "");
    setIsFormOpen(true);
    window.scrollTo({ top: 180, behavior: "smooth" });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5 MB.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(",")[1];
          const res = await uploadEventThumbnail({
            data: {
              fileName: file.name,
              contentType: file.type,
              base64Data,
              adminPassword,
            },
          });

          if (res.success && res.url) {
            setThumbnailUrl(res.url);
            toast.success("Thumbnail uploaded to Supabase Storage!");
          } else {
            toast.error(res.error || "Failed to upload thumbnail.");
          }
        } catch (uploadErr: any) {
          toast.error(uploadErr.message || "Failed to upload image.");
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingImage(false);
      toast.error(err.message || "Error reading file.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const finalSlug = slugId.trim() ? cleanSlugId(slugId) : cleanSlugId(title);
    if (!finalSlug) {
      toast.error("Event Slug ID is required.");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!host.trim()) {
      toast.error("Host name is required.");
      return;
    }
    if (!eventDate.trim()) {
      toast.error("Event date is required.");
      return;
    }
    if (!timeRange.trim()) {
      toast.error("Time range is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!registrationLink.trim()) {
      toast.error("Registration link is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveEvent({
        data: {
          id: finalSlug,
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          host: host.trim(),
          host_title: hostTitle.trim() || null,
          event_date: eventDate.trim(),
          time_range: timeRange.trim(),
          description: description.trim(),
          registration_link: registrationLink.trim(),
          recording_link: recordingLink.trim() || null,
          thumbnail_url: thumbnailUrl.trim() || null,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(
          editingEventId
            ? `Updated event "${title}"`
            : `Created event "${title}"`
        );
        resetForm();
        await refreshList();
      } else {
        toast.error(res.error || "Failed to save event.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string, eventTitle: string) {
    if (!confirm(`Are you sure you want to delete the event "${eventTitle}" (${id})?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await removeEvent({
        data: {
          id,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(`Deleted event: ${eventTitle}`);
        await refreshList();
      } else {
        toast.error(res.error || "Failed to delete event.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting event.");
    } finally {
      setDeletingId(null);
    }
  }

  // Quick Recording Link Update
  function openQuickRecording(event: EventItem) {
    setQuickRecordingEvent(event);
    setQuickRecordingValue(event.recording_link || "");
  }

  async function saveQuickRecording() {
    if (!quickRecordingEvent) return;
    setIsSavingQuickRecording(true);
    try {
      const res = await saveEvent({
        data: {
          id: quickRecordingEvent.id,
          recording_link: quickRecordingValue.trim() || null,
          adminPassword,
        },
      });

      if (res.success) {
        toast.success(`Updated recording link for "${quickRecordingEvent.title}"`);
        setQuickRecordingEvent(null);
        await refreshList();
      } else {
        toast.error(res.error || "Failed to update recording link.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving recording link.");
    } finally {
      setIsSavingQuickRecording(false);
    }
  }

  // Filtered Events
  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredEvents = useMemo(() => {
    let list = events;
    if (statusFilter === "upcoming") {
      list = list.filter((e) => e.event_date.slice(0, 10) >= todayStr);
    } else if (statusFilter === "past") {
      list = list.filter((e) => e.event_date.slice(0, 10) < todayStr);
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.host.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q))
    );
  }, [events, searchQuery, statusFilter, todayStr]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between selection:bg-primary/20">
      <Toaster position="top-right" richColors />
      <Header />

      <main className="flex-1 py-28 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* =================================================================== */}
        {/* VIEW 1: PASSWORD GATE (WHEN LOCKED)                                */}
        {/* =================================================================== */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12">
            <div className="card-surface p-8 sm:p-10 text-center border-border/80 shadow-lg">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-navy/10 text-navy mb-5 shadow-xs">
                <Lock className="size-7 stroke-[2]" />
              </div>

              <h1 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy tracking-tight">
                Events & Webinars Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                This portal is restricted to SMG administrators. Please enter the internal admin password to continue.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyPassword(passwordInput);
                }}
                className="mt-6 space-y-4 text-left"
              >
                <div>
                  <Label htmlFor="admin-pass" className="text-xs font-semibold text-navy">
                    Admin Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="admin-pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (authError) setAuthError("");
                      }}
                      className="rounded-xl pr-10 focus-visible:ring-primary font-mono text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-navy transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs leading-tight">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold py-5 transition-transform active:scale-[0.99]"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 size-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 size-4" /> Unlock Events Portal
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-border/60 text-[11.5px] text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldAlert className="size-3.5" />
                <span>
                  Gated via <code className="font-mono text-navy font-bold">INTERNAL_ADMIN_PASSWORD</code>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* VIEW 2: AUTHENTICATED EVENTS ADMIN DASHBOARD                       */
          /* =================================================================== */
          <div className="space-y-8">
            {/* Top Navigation Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="eyebrow bg-navy/10 text-navy px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    Internal Management
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Supabase: {isConfigured ? "Connected" : "Local Memory"}
                  </span>
                </div>
                <h1 className="font-serif-hero text-2xl sm:text-3xl font-bold text-navy mt-1">
                  Events & Webinars Manager
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Create, edit, upload thumbnails, and manage webinar recording links without code changes.
                </p>
              </div>

              {/* Action & Tools Links */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-navy/20 text-navy hover:bg-navy hover:text-white text-xs"
                >
                  <Link to="/events" target="_blank">
                    <ExternalLink className="mr-1.5 size-3.5" />
                    View Live /events
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-navy/20 text-navy hover:bg-navy hover:text-white text-xs"
                >
                  <Link to="/tools/links">
                    <Link2 className="mr-1.5 size-3.5" />
                    Webinar Shortlinks
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshList}
                  disabled={isPending}
                  className="rounded-xl border-navy/20 text-navy hover:bg-navy hover:text-white text-xs"
                >
                  <RefreshCw className={`mr-1.5 size-3.5 ${isPending ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Lock className="mr-1.5 size-3.5" />
                  Lock
                </Button>
              </div>
            </div>

            {/* Event Form Banner Toggle */}
            {!isFormOpen && (
              <div className="card-surface p-6 border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div>
                  <h3 className="font-bold text-navy text-base flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    Schedule a New Event or Webinar
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Add upcoming webinars with date, speaker credentials, registration link, and thumbnail upload.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(true);
                  }}
                  className="rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold shrink-0 shadow-xs"
                >
                  <PlusCircle className="mr-2 size-4" />
                  Add New Event
                </Button>
              </div>
            )}

            {/* =============================================================== */}
            {/* ADD / EDIT EVENT FORM                                            */}
            {/* =============================================================== */}
            {isFormOpen && (
              <div className="card-surface p-6 sm:p-8 border-border/80 shadow-md rounded-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-navy text-white text-sm shadow-xs">
                      {editingEventId ? <Edit2 className="size-5" /> : <PlusCircle className="size-5" />}
                    </div>
                    <div>
                      <h2 className="font-bold text-navy text-lg">
                        {editingEventId ? `Editing Event: "${title}"` : "Create New Event / Webinar"}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {editingEventId
                          ? `Updating slug: /${slugId}`
                          : "Fill out the event details. Slug ID will auto-generate from the title."}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                  >
                    <X className="size-4 mr-1" /> Close Form
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Title & Subtitle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-title" className="text-xs font-semibold text-navy">
                        Event Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="event-title"
                        type="text"
                        placeholder="e.g. Year-End Tax Planning Strategies"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-subtitle" className="text-xs font-semibold text-navy">
                        Subtitle / Tagline <span className="text-muted-foreground font-normal">(Optional)</span>
                      </Label>
                      <Input
                        id="event-subtitle"
                        type="text"
                        placeholder="e.g. Maximize deductions and navigate sunsetting provisions"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 2: Slug ID */}
                  <div>
                    <Label htmlFor="event-slug" className="text-xs font-semibold text-navy">
                      Event Slug (URL ID) <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-1.5 flex rounded-xl border border-input bg-background overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-primary">
                      <span className="inline-flex items-center px-3.5 bg-secondary text-xs text-muted-foreground border-r font-mono">
                        events/
                      </span>
                      <Input
                        id="event-slug"
                        type="text"
                        placeholder="e.g. dress-your-business-webinar"
                        value={slugId}
                        onChange={(e) => {
                          setIsSlugManuallyEdited(true);
                          setSlugId(cleanSlugId(e.target.value));
                        }}
                        className="border-0 focus-visible:ring-0 rounded-none font-mono text-sm h-10"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Unique identifier for this event. Lowercase letters, numbers, and hyphens.
                    </p>
                  </div>

                  {/* Row 3: Host & Host Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-host" className="text-xs font-semibold text-navy">
                        Host / Presenter Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="event-host"
                        type="text"
                        placeholder="e.g. Gregory M. Scotto"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-host-title" className="text-xs font-semibold text-navy">
                        Host Title / Credentials <span className="text-muted-foreground font-normal">(e.g. CPA, CFP)</span>
                      </Label>
                      <Input
                        id="event-host-title"
                        type="text"
                        placeholder="e.g. CPA, CFP or Partner"
                        value={hostTitle}
                        onChange={(e) => setHostTitle(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  {/* Row 4: Date & Time Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-date" className="text-xs font-semibold text-navy">
                        Event Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm font-mono"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="event-time" className="text-xs font-semibold text-navy">
                        Time Range <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="event-time"
                        type="text"
                        placeholder="e.g. 2:30 - 3:30 PM EST"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="event-description" className="text-xs font-semibold text-navy">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <textarea
                      id="event-description"
                      rows={4}
                      placeholder="Detailed overview of webinar topics, learning outcomes, and intended audience..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
                      required
                    />
                  </div>

                  {/* Row 5: Registration Link & Recording Link */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-reg-link" className="text-xs font-semibold text-navy">
                        Registration Link (Before Event) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="event-reg-link"
                        type="text"
                        placeholder="https://events.teams.microsoft.com/... or https://zoom.us/..."
                        value={registrationLink}
                        onChange={(e) => setRegistrationLink(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm font-mono"
                        required
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Button says "Register Now" and directs here until the event date passes.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60">
                      <Label htmlFor="event-rec-link" className="text-xs font-semibold text-navy flex items-center gap-1.5">
                        <Video className="size-3.5 text-primary" />
                        Recording Link (After Event)
                      </Label>
                      <Input
                        id="event-rec-link"
                        type="text"
                        placeholder="https://youtube.com/watch?v=... or Loom / Vimeo"
                        value={recordingLink}
                        onChange={(e) => setRecordingLink(e.target.value)}
                        className="mt-1.5 rounded-xl text-sm font-mono bg-background"
                      />
                      <p className="text-[11px] text-primary mt-1 font-medium">
                        Add once the event has happened and recording is published. Switches button to "Watch Recording".
                      </p>
                    </div>
                  </div>

                  {/* Thumbnail Image Upload */}
                  <div>
                    <Label className="text-xs font-semibold text-navy">
                      Event Thumbnail Image <span className="text-muted-foreground font-normal">(Supabase Storage)</span>
                    </Label>
                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-secondary/50 hover:bg-secondary cursor-pointer text-xs font-semibold text-navy transition-colors">
                        <UploadCloud className="size-4" />
                        {isUploadingImage ? "Uploading to Supabase..." : "Choose Image (PNG/JPG/WEBP)"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>

                      {thumbnailUrl && (
                        <div className="flex items-center gap-3">
                          <img
                            src={thumbnailUrl}
                            alt="Event thumbnail preview"
                            className="size-12 rounded-lg object-cover border border-border shadow-xs"
                          />
                          <div className="text-xs">
                            <span className="font-mono text-green-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" /> Uploaded
                            </span>
                            <button
                              type="button"
                              onClick={() => setThumbnailUrl("")}
                              className="text-[11px] text-destructive hover:underline mt-0.5"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3 border-t border-border/60">
                    <Button
                      type="submit"
                      disabled={isSubmitting || isUploadingImage}
                      className="flex-1 rounded-xl bg-navy text-white hover:bg-navy/90 font-semibold py-5 transition-transform active:scale-[0.99] text-sm shadow-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="mr-2 size-4 animate-spin" /> Saving Event...
                        </>
                      ) : editingEventId ? (
                        <>
                          <CheckCircle2 className="mr-2 size-4" /> Update Event
                        </>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 size-4" /> Publish Event
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="rounded-xl py-5 px-6 font-medium border-navy/20 text-navy hover:bg-navy hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* =============================================================== */}
            {/* EVENTS DIRECTORY LIST & FILTER                                  */}
            {/* =============================================================== */}
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="card-surface p-4 border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search events, topics, or hosts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-sm rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-xl bg-secondary/70 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        statusFilter === "all" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All ({events.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("upcoming")}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        statusFilter === "upcoming" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Upcoming
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("past")}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        statusFilter === "past" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Past
                    </button>
                  </div>
                </div>
              </div>

              {/* Events Table / Card List */}
              <div className="card-surface border-border/80 overflow-hidden shadow-xs">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-16 px-4 space-y-3">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                      <Calendar className="size-6" />
                    </div>
                    <h3 className="text-sm font-bold text-navy">No matching events found</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      {searchQuery
                        ? `No events match "${searchQuery}". Try clearing search keyword.`
                        : "No events in this category yet. Click 'Add New Event' above to create one."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-border/70 bg-secondary/50 text-[11px] font-bold text-navy uppercase tracking-wider">
                          <th className="py-3 px-4 sm:px-6">Status & Date</th>
                          <th className="py-3 px-4 sm:px-6">Event & Host</th>
                          <th className="py-3 px-4 hidden md:table-cell">Recording Status</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredEvents.map((item) => {
                          const isPast = item.event_date.slice(0, 10) < todayStr;
                          const hasRecording = Boolean(item.recording_link);
                          const isDeleting = deletingId === item.id;

                          return (
                            <tr key={item.id} className="hover:bg-secondary/30 transition-colors group">
                              {/* Date & Status */}
                              <td className="py-4 px-4 sm:px-6 align-top whitespace-nowrap">
                                <div className="space-y-1.5">
                                  {isPast ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                      Past Event
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300">
                                      Upcoming
                                    </span>
                                  )}
                                  <div className="font-mono text-xs font-semibold text-navy">
                                    {item.event_date}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {item.time_range}
                                  </div>
                                </div>
                              </td>

                              {/* Title & Host */}
                              <td className="py-4 px-4 sm:px-6 align-top max-w-sm sm:max-w-md">
                                <div className="space-y-1">
                                  <div className="font-bold text-navy text-sm sm:text-base leading-snug">
                                    {item.title}
                                  </div>
                                  {item.subtitle && (
                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                      {item.subtitle}
                                    </div>
                                  )}
                                  <div className="text-xs text-navy/80 font-medium flex items-center gap-1.5 pt-0.5">
                                    <User className="size-3 text-primary" />
                                    <span>
                                      {item.host}
                                      {item.host_title && (
                                        <span className="text-muted-foreground">, {item.host_title}</span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-mono text-muted-foreground truncate pt-0.5">
                                    Slug: <code className="text-navy font-semibold">{item.id}</code>
                                  </div>
                                </div>
                              </td>

                              {/* Recording Flag */}
                              <td className="py-4 px-4 align-top hidden md:table-cell">
                                {isPast ? (
                                  hasRecording ? (
                                    <div className="space-y-1">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        <Play className="size-3 fill-current" />
                                        Recording Available
                                      </span>
                                      <div className="max-w-xs truncate">
                                        <a
                                          href={item.recording_link!}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[11px] text-primary hover:underline font-mono truncate inline-flex items-center gap-1"
                                        >
                                          <ExternalLink className="size-2.5" />
                                          View Video
                                        </a>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                                        <Film className="size-3" />
                                        Missing Recording
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => openQuickRecording(item)}
                                        className="text-[11px] text-primary font-semibold hover:underline block"
                                      >
                                        + Add Video Link
                                      </button>
                                    </div>
                                  )
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    Awaits live event
                                  </span>
                                )}
                              </td>

                              {/* Action Buttons */}
                              <td className="py-4 px-4 sm:px-6 align-top text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  {isPast && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openQuickRecording(item)}
                                      className="h-7 px-2.5 rounded-lg text-xs border-primary/30 text-primary hover:bg-primary hover:text-white"
                                      title="Quick update recording link"
                                    >
                                      <Video className="size-3 mr-1" />
                                      {hasRecording ? "Edit Video" : "Add Video"}
                                    </Button>
                                  )}

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(item)}
                                    className="h-7 px-2.5 rounded-lg text-xs border-navy/20 text-navy hover:bg-navy hover:text-white"
                                    title="Edit all fields"
                                  >
                                    <Edit2 className="size-3 mr-1" />
                                    Edit
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(item.id, item.title)}
                                    disabled={isDeleting}
                                    className="h-7 px-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    title="Delete event"
                                  >
                                    {isDeleting ? (
                                      <RefreshCw className="size-3 animate-spin" />
                                    ) : (
                                      <Trash2 className="size-3" />
                                    )}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Recording Link Modal */}
            {quickRecordingEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
                <div className="card-surface p-6 sm:p-8 max-w-lg w-full rounded-2xl shadow-2xl border-border space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <div className="flex items-center gap-2 text-navy font-bold text-base">
                      <Video className="size-5 text-primary" />
                      <h3>Update Recording Link</h3>
                    </div>
                    <button
                      onClick={() => setQuickRecordingEvent(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    For past event: <strong className="text-navy">{quickRecordingEvent.title}</strong>
                  </p>

                  <div>
                    <Label htmlFor="quick-rec-input" className="text-xs font-semibold text-navy">
                      Recording Video URL (YouTube, Vimeo, Teams recording, etc.)
                    </Label>
                    <Input
                      id="quick-rec-input"
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={quickRecordingValue}
                      onChange={(e) => setQuickRecordingValue(e.target.value)}
                      className="mt-1.5 rounded-xl font-mono text-sm"
                      autoFocus
                    />
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Leave blank if video is not ready yet. Once saved, the public event card automatically switches to "Watch Recording".
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickRecordingEvent(null)}
                      className="rounded-xl text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveQuickRecording}
                      disabled={isSavingQuickRecording}
                      className="rounded-xl bg-navy text-white hover:bg-navy/90 text-xs font-semibold"
                    >
                      {isSavingQuickRecording ? (
                        <>
                          <RefreshCw className="mr-1.5 size-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Recording Link"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
