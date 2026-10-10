import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Eye,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layers,
  Heading,
  AlignLeft,
  List,
  Quote,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Loader2,
  CalendarClock,
  Filter,
  Check,
  FileText,
  Lock,
  Unlock,
  Globe,
  Settings,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  getAdminBlogs,
  saveBlogPost,
  deleteBlogPost,
  type ExtendedBlogPost,
} from "@/lib/blogs.server";
import { uploadCmsImage } from "@/lib/cms.server";
import { BlogPostView } from "@/components/site/BlogPostView";
import { type ContentBlock } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/blogs-editor")({
  head: () => ({
    meta: [
      { title: "Blog Studio & Future Post Creator | SMG ABA" },
      {
        name: "description",
        content: "Create, schedule, and edit future blog posts for SMG ABA with instant live preview.",
      },
    ],
  }),
  loader: async () => {
    const data = await getAdminBlogs();
    return data;
  },
  component: BlogsEditorPage,
});

const POSTS_PER_PAGE = 18;

const DEFAULT_AUTHORS = [
  "SMG Advisory Team",
  "Gregory Scotto",
  "Marc Melchiorre",
  "David K.",
  "SMG Tax Practice",
];

const DEFAULT_CATEGORIES = [
  "Bookkeeping",
  "CFO Advisory",
  "Tax",
  "Hospitality",
  "Real Estate",
  "Business Strategy",
  "Community & Events",
];

const SAMPLE_IMAGES = [
  {
    label: "Accounting & Financial Advisory",
    url: "/images/stock/unsplash-photo-1554224155-8d04cb21cd6c.jpg",
  },
  {
    label: "Executive Strategic Planning",
    url: "/images/stock/unsplash-photo-1454165804606-c3d57bc86b40.jpg",
  },
  {
    label: "Financial Analytics & Charts",
    url: "/images/stock/unsplash-photo-1460925895917-afdab827c52f.jpg",
  },
  {
    label: "Hospitality & Restaurant Finance",
    url: "/images/stock/unsplash-photo-1517248135467-4c7edcad34c4.jpg",
  },
  {
    label: "Corporate Office & Real Estate",
    url: "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.jpg",
  },
  {
    label: "Tax Planning & Compliance",
    url: "/images/stock/unsplash-photo-1586486855514-8c633cc6fd38.jpg",
  },
];

function createBlankPost(): ExtendedBlogPost {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const nextWeekIso = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16);

  return {
    id: `blog-${Date.now()}`,
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    h1: "",
    date: dateFormatted,
    publishDate: nextWeekIso,
    author: "SMG Advisory Team",
    category: "Bookkeeping",
    image: SAMPLE_IMAGES[0].url,
    readTime: "4 min read",
    excerpt: "",
    status: "published",
    archived: false,
    isCustom: true,
    blocks: [
      {
        type: "p",
        text: "Introduce the key strategic topic or financial challenge your clients are facing. Explain why this insight is critical for proactive business leadership.",
      },
      {
        type: "h2",
        text: "1. Key Industry Insights & Strategic Analysis",
      },
      {
        type: "p",
        text: "Dive into the actionable details. Provide data, real-world benchmarks, and clear explanations that assist business owners in making informed financial decisions.",
      },
      {
        type: "ul",
        items: [
          "Strategic compliance checkpoints and regulatory advantages",
          "Cash flow optimization tips and outsourced CFO guidance",
          "Quarterly tax mitigation planning cadence",
        ],
      },
      {
        type: "blockquote",
        text: "Proactive financial advisory isn't just about reviewing historical numbers—it's about anticipating upcoming market shifts and positioning your business for sustainable profitability.",
      },
      {
        type: "h2",
        text: "Conclusion & Strategic Next Steps",
      },
      {
        type: "p",
        text: "Summarize the key takeaways and invite readers to schedule a consultation with the SMG Advisory Team.",
      },
    ],
  };
}

function BlogsEditorPage() {
  const initialData = Route.useLoaderData();
  const [blogsList, setBlogsList] = useState<ExtendedBlogPost[]>(initialData?.blogs || []);
  const [activeTab, setActiveTab] = useState<"list" | "edit" | "preview">("list");
  const [editorSubTab, setEditorSubTab] = useState<"write" | "settings">("write");
  const [currentPost, setCurrentPost] = useState<ExtendedBlogPost>(createBlankPost);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [listPage, setListPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isCustomSlugUnlocked, setIsCustomSlugUnlocked] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverImageTab, setCoverImageTab] = useState<"upload" | "presets" | "url">("upload");
  const [isCoverDraggingOver, setIsCoverDraggingOver] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const settingsFileInputRef = useRef<HTMLInputElement>(null);

  async function handleCoverFileUpload(file: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP, SVG, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB.");
      return;
    }

    setIsUploadingCover(true);
    const toastId = toast.loading(`Uploading "${file.name}" from your computer...`);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
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
            setCurrentPost((prev) => ({ ...prev, image: res.url }));
            toast.dismiss(toastId);
            toast.success("Cover image uploaded and updated!");
            setIsImagePickerOpen(false);
          } else {
            // Offline/fallback to data URL so user is never blocked
            const dataUrl = reader.result as string;
            setCurrentPost((prev) => ({ ...prev, image: dataUrl }));
            toast.dismiss(toastId);
            toast.success("Cover image selected from your computer!");
            setIsImagePickerOpen(false);
          }
        } catch (err: any) {
          const dataUrl = reader.result as string;
          setCurrentPost((prev) => ({ ...prev, image: dataUrl }));
          toast.dismiss(toastId);
          toast.success("Cover image selected from your computer!");
          setIsImagePickerOpen(false);
        } finally {
          setIsUploadingCover(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.message || "Failed to read image file.");
      setIsUploadingCover(false);
    }
  }

  // Derived stats
  const stats = useMemo(() => {
    const total = blogsList.length;
    let published = 0;
    let scheduled = 0;
    let drafts = 0;

    for (const b of blogsList) {
      if (b.status === "draft") drafts++;
      else if (b.status === "scheduled") scheduled++;
      else published++;
    }

    return { total, published, scheduled, drafts };
  }, [blogsList]);

  // Categories list
  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    for (const b of blogsList) {
      if (b.category?.trim()) set.add(b.category.trim());
    }
    return ["all", ...Array.from(set)];
  }, [blogsList]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogsList.filter((b) => {
      const matchesSearch =
        !searchTerm ||
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && (b.status === "published" || !b.status)) ||
        (statusFilter === "scheduled" && b.status === "scheduled") ||
        (statusFilter === "draft" && b.status === "draft") ||
        (statusFilter === "custom" && b.isCustom) ||
        (statusFilter === "static" && !b.isCustom);

      const matchesCategory =
        categoryFilter === "all" || b.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogsList, searchTerm, statusFilter, categoryFilter]);

  const totalListPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

  const paginatedBlogs = useMemo(() => {
    const start = (listPage - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
  }, [filteredBlogs, listPage]);

  // Handler: Start New Post
  const handleStartNew = () => {
    setCurrentPost(createBlankPost());
    setIsCustomSlugUnlocked(false);
    setEditorSubTab("write");
    setActiveTab("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Edit Post
  const handleEditPost = (post: ExtendedBlogPost) => {
    setCurrentPost(JSON.parse(JSON.stringify(post)));
    setIsCustomSlugUnlocked(true);
    setEditorSubTab("write");
    setActiveTab("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Duplicate Post
  const handleDuplicatePost = (post: ExtendedBlogPost) => {
    const duplicated: ExtendedBlogPost = {
      ...JSON.parse(JSON.stringify(post)),
      id: `blog-${Date.now()}`,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy`,
      isCustom: true,
      status: "draft",
    };
    setCurrentPost(duplicated);
    setIsCustomSlugUnlocked(true);
    setEditorSubTab("write");
    setActiveTab("edit");
    toast.info("Created a duplicate draft. You can customize and save it.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Delete Post
  const handleDeletePost = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete the blog post "${slug}"?`)) {
      return;
    }

    try {
      const res = await deleteBlogPost({ data: slug });
      if (res.success) {
        setBlogsList((prev) => prev.filter((b) => b.slug !== slug));
        toast.success("Blog post deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete post.");
      }
    } catch {
      toast.error("Error communicating with server.");
    }
  };

  // Handler: Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setCurrentPost((prev) => ({
      ...prev,
      title: newTitle,
      h1: prev.h1 === prev.title || !prev.h1 ? newTitle : prev.h1,
      metaTitle: prev.metaTitle === prev.title || !prev.metaTitle ? `${newTitle} | SMG ABA` : prev.metaTitle,
      slug: !isCustomSlugUnlocked ? autoSlug : prev.slug,
    }));
  };

  // Content Block Management
  const handleAddBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock =
      type === "ul"
        ? { type, items: ["First actionable checkpoint", "Second key takeaway"] }
        : type === "blockquote"
        ? { type, text: "Highlight a pivotal takeaway, executive quote, or industry advisory principle here." }
        : type === "h2"
        ? { type, text: "New Section Heading" }
        : type === "h3"
        ? { type, text: "Sub-section Heading" }
        : { type: "p", text: "Write your article paragraph here. Explain the key financial concepts in clear, client-friendly terms." };

    setCurrentPost((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    toast.success(`Added ${type === "h2" ? "Heading" : type === "p" ? "Paragraph" : type === "ul" ? "Bullet List" : "Quote"} block`);
  };

  const handleUpdateBlock = (index: number, updated: Partial<ContentBlock>) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      nextBlocks[index] = { ...nextBlocks[index], ...updated };
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleMoveBlock = (index: number, direction: "up" | "down") => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= nextBlocks.length) return prev;
      const temp = nextBlocks[index];
      nextBlocks[index] = nextBlocks[targetIndex];
      nextBlocks[targetIndex] = temp;
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleDeleteBlock = (index: number) => {
    setCurrentPost((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  // Handler: Save Post
  const handleSave = async (forceStatus?: "published" | "scheduled" | "draft") => {
    if (!currentPost.title.trim()) {
      toast.error("Please enter an article title.");
      return;
    }

    const effectiveStatus = forceStatus || currentPost.status || "published";
    setIsSaving(true);

    try {
      const postToSave: ExtendedBlogPost = {
        ...currentPost,
        status: effectiveStatus,
        slug:
          currentPost.slug.trim() ||
          currentPost.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      };

      const res = await saveBlogPost({ data: postToSave });
      if (res.success && res.slug) {
        if (effectiveStatus === "scheduled") {
          toast.success(
            `Article scheduled successfully for ${new Date(currentPost.publishDate || "").toLocaleString()}!`
          );
        } else if (effectiveStatus === "draft") {
          toast.success("Draft saved successfully!");
        } else {
          toast.success("Blog post published live to /blog!");
        }

        // Update local list
        setBlogsList((prev) => {
          const filtered = prev.filter((b) => b.slug !== postToSave.slug);
          return [postToSave, ...filtered];
        });

        setCurrentPost(postToSave);
      } else {
        toast.error(res.error || "Failed to save blog post.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans antialiased">
      {/* Global Site Header */}
      <Header />

      <main className="flex-1 pt-28 sm:pt-34 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* VIEW 1: ARTICLES DASHBOARD LIST */}
        {/* ========================================================================= */}
        {activeTab === "list" && (
          <div className="space-y-6">
            {/* Top Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  <span className="inline-block size-2 rounded-full bg-primary" />
                  SMG Editorial &bull; Article Studio
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-hero text-navy">
                  Blog &amp; Article Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Create, draft, and schedule future articles for your website with zero complexity.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full text-navy bg-white border-slate-200 hover:bg-slate-100 h-9 text-xs font-semibold"
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-3.5" />
                    Dashboard
                  </Link>
                </Button>

                <Button
                  onClick={handleStartNew}
                  size="sm"
                  className="rounded-full bg-navy text-white hover:bg-navy/90 gap-1.5 shadow-md shadow-navy/20 h-9 px-4 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="size-4" /> Create New Article
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full text-slate-700 border-slate-200 hover:bg-slate-100 h-9 text-xs"
                >
                  <a href="/blog" target="_blank" rel="noreferrer">
                    <Globe className="size-3.5" /> View Public Blog
                    <ExternalLink className="size-3 text-slate-400" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif-hero text-navy">{stats.total}</div>
                  <div className="text-xs font-medium text-slate-500">Total Articles</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif-hero text-emerald-700">{stats.published}</div>
                  <div className="text-xs font-medium text-slate-500">Live Published</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <CalendarClock className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif-hero text-blue-700">{stats.scheduled}</div>
                  <div className="text-xs font-medium text-slate-500">Future Scheduled</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <FileText className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif-hero text-amber-700">{stats.drafts}</div>
                  <div className="text-xs font-medium text-slate-500">Drafts</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setListPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "all"
                      ? "bg-white text-navy shadow-xs font-bold"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("published");
                    setListPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "published"
                      ? "bg-white text-emerald-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-emerald-700"
                  }`}
                >
                  Published ({stats.published})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("scheduled");
                    setListPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "scheduled"
                      ? "bg-white text-blue-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-blue-700"
                  }`}
                >
                  Scheduled ({stats.scheduled})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("draft");
                    setListPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === "draft"
                      ? "bg-white text-amber-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-amber-700"
                  }`}
                >
                  Drafts ({stats.drafts})
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setListPage(1);
                  }}
                  className="w-full sm:w-auto h-9 px-3 text-xs font-medium rounded-full border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy/20"
                >
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setListPage(1);
                    }}
                    className="pl-9 h-9 text-xs rounded-full border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-navy"
                  />
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            {filteredBlogs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="mx-auto size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <BookOpen className="size-6" />
                </div>
                <h3 className="text-base font-bold font-serif-hero text-navy">No articles found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No articles matched your search. Click below to start creating a new post.
                </p>
                <Button
                  onClick={handleStartNew}
                  size="sm"
                  className="mt-4 rounded-full bg-navy text-white hover:bg-navy/90 text-xs font-semibold gap-1.5"
                >
                  <Plus className="size-4" /> Create New Article
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedBlogs.map((post) => {
                    const isScheduled = post.status === "scheduled";
                    const isDraft = post.status === "draft";
                    const isPublished = !isScheduled && !isDraft;

                    return (
                      <div
                        key={post.slug}
                        className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-navy/30 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                      >
                        {/* Image Header */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="size-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center bg-gradient-to-br from-navy/10 to-primary/10 text-navy/40">
                              <BookOpen className="size-10" />
                            </div>
                          )}

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-navy shadow-xs backdrop-blur-xs">
                              {post.category}
                            </span>

                            {isScheduled && (
                              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs flex items-center gap-1">
                                <CalendarClock className="size-3" /> Scheduled
                              </span>
                            )}
                            {isDraft && (
                              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                                Draft
                              </span>
                            )}
                            {isPublished && (
                              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                                <CheckCircle2 className="size-3" /> Live
                              </span>
                            )}
                          </div>

                          {/* Schedule Date Banner if scheduled */}
                          {isScheduled && post.publishDate && (
                            <div className="absolute bottom-0 inset-x-0 bg-blue-950/90 text-blue-100 px-3 py-1.5 text-[11px] font-medium flex items-center justify-between backdrop-blur-xs">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3 text-blue-300" /> Releases on:
                              </span>
                              <span className="font-semibold text-white">
                                {new Date(post.publishDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" /> {post.date}
                              </span>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" /> {post.readTime || "4 min read"}
                              </span>
                            </div>

                            <h3 className="font-serif-hero text-lg font-bold text-navy group-hover:text-primary transition line-clamp-2 leading-snug">
                              {post.title}
                            </h3>

                            {post.excerpt && (
                              <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}
                          </div>

                          {/* Author & Footer Bar */}
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="size-6 rounded-full bg-navy/10 text-navy flex items-center justify-center text-[10px] font-bold">
                                {post.author ? post.author[0] : "S"}
                              </div>
                              <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                                {post.author}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditPost(post)}
                                title="Edit Article"
                                className="size-8 rounded-lg border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-100 flex items-center justify-center transition"
                              >
                                <Edit3 className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDuplicatePost(post)}
                                title="Duplicate as Draft"
                                className="size-8 rounded-lg border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-100 flex items-center justify-center transition"
                              >
                                <Copy className="size-3.5" />
                              </button>

                              {post.isCustom && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePost(post.slug)}
                                  title="Delete Article"
                                  className="size-8 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}

                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                title="View Public Page"
                                className="size-8 rounded-lg border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-100 flex items-center justify-center transition"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls (18 blogs per page) */}
                {totalListPages > 1 && (
                  <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 font-medium">
                      Showing{" "}
                      <span className="font-semibold text-slate-800">
                        {(listPage - 1) * POSTS_PER_PAGE + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-slate-800">
                        {Math.min(listPage * POSTS_PER_PAGE, filteredBlogs.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-slate-800">
                        {filteredBlogs.length}
                      </span>{" "}
                      articles
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={listPage === 1}
                        onClick={() => {
                          setListPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 150, behavior: "smooth" });
                        }}
                        className="rounded-full gap-1 text-xs font-semibold text-navy border-slate-200 hover:bg-slate-100 disabled:opacity-30 h-8 px-3"
                      >
                        <ChevronLeft className="size-3.5" /> Prev
                      </Button>

                      <div className="flex items-center gap-1 mx-1">
                        {Array.from({ length: totalListPages }, (_, i) => i + 1).map((pNum) => (
                          <button
                            key={pNum}
                            type="button"
                            onClick={() => {
                              setListPage(pNum);
                              window.scrollTo({ top: 150, behavior: "smooth" });
                            }}
                            className={`size-8 rounded-full text-xs font-bold transition ${
                              pNum === listPage
                                ? "bg-navy text-white shadow-xs"
                                : "text-slate-700 hover:bg-slate-100 border border-slate-200"
                            }`}
                          >
                            {pNum}
                          </button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={listPage === totalListPages}
                        onClick={() => {
                          setListPage((p) => Math.min(totalListPages, p + 1));
                          window.scrollTo({ top: 150, behavior: "smooth" });
                        }}
                        className="rounded-full gap-1 text-xs font-semibold text-navy border-slate-200 hover:bg-slate-100 disabled:opacity-30 h-8 px-3"
                      >
                        Next <ChevronRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ARTICLE CREATOR & CLEAN DOCUMENT WORKSPACE */}
        {/* ========================================================================= */}
        {activeTab === "edit" && (
          <div className="space-y-6">
            {/* Top Workspace Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-20 z-40 backdrop-blur-md bg-white/95">
              {/* Left Back & Title info */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("list")}
                  className="rounded-full text-slate-600 hover:text-navy hover:bg-slate-100 h-8 px-3 text-xs"
                >
                  <ArrowLeft className="size-3.5 mr-1" /> All Articles
                </Button>
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                {/* Sub-Tabs: Write vs Settings */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEditorSubTab("write")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      editorSubTab === "write"
                        ? "bg-white text-navy font-bold shadow-xs"
                        : "text-slate-600 hover:text-navy"
                    }`}
                  >
                    ✍️ Article Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorSubTab("settings")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      editorSubTab === "settings"
                        ? "bg-white text-navy font-bold shadow-xs"
                        : "text-slate-600 hover:text-navy"
                    }`}
                  >
                    <Settings className="size-3.5" />
                    <span>Publish &amp; SEO</span>
                    {currentPost.status === "scheduled" && (
                      <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("preview")}
                  className="rounded-full gap-1.5 bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100 h-8 px-3.5 text-xs font-semibold"
                >
                  <Eye className="size-3.5" /> Live Preview
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleSave("draft")}
                  className="rounded-full gap-1.5 text-slate-700 border-slate-200 hover:bg-slate-100 h-8 px-3.5 text-xs font-semibold"
                >
                  {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  Save Draft
                </Button>

                {currentPost.status === "scheduled" ? (
                  <Button
                    size="sm"
                    disabled={isSaving}
                    onClick={() => handleSave("scheduled")}
                    className="rounded-full gap-1.5 bg-blue-700 text-white hover:bg-blue-800 h-8 px-4 text-xs font-semibold shadow-xs"
                  >
                    {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <CalendarClock className="size-3.5" />}
                    Schedule Post
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={isSaving}
                    onClick={() => handleSave("published")}
                    className="rounded-full gap-1.5 bg-navy text-white hover:bg-navy/90 h-8 px-4 text-xs font-semibold shadow-md shadow-navy/20"
                  >
                    {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                    Publish Live
                  </Button>
                )}
              </div>
            </div>

            {/* TAB CONTENT: 1. WRITE ARTICLE (CLEAN DOCUMENT CANVAS) */}
            {editorSubTab === "write" && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Article Header Document Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-10 space-y-6">
                  {/* Featured Cover Image Banner with Drag & Drop & Upload from Computer */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsCoverDraggingOver(true);
                    }}
                    onDragLeave={() => setIsCoverDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsCoverDraggingOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleCoverFileUpload(file);
                    }}
                    className={`relative rounded-2xl overflow-hidden bg-slate-100 h-52 sm:h-64 border transition-all duration-200 group ${
                      isCoverDraggingOver
                        ? "border-2 border-dashed border-primary ring-4 ring-primary/20 bg-blue-50/50"
                        : "border-slate-200"
                    }`}
                  >
                    {currentPost.image ? (
                      <img
                        src={currentPost.image}
                        alt="Article Cover"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-6 text-center">
                        <div className="size-12 rounded-full bg-slate-200/70 flex items-center justify-center mb-2 text-slate-400">
                          <ImageIcon className="size-6" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">No cover image selected</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Drag &amp; drop an image here or click below to select from your computer
                        </span>
                      </div>
                    )}

                    {/* Drag-over indicator banner */}
                    {isCoverDraggingOver && (
                      <div className="absolute inset-0 bg-blue-600/85 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-150">
                        <Upload className="size-10 mb-2 animate-bounce" />
                        <p className="text-sm font-bold">Drop image here to set cover photo</p>
                        <p className="text-xs opacity-90">PNG, JPG, WebP, SVG up to 10MB</p>
                      </div>
                    )}

                    {/* Hover Action Overlay */}
                    {!isCoverDraggingOver && (
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-4">
                        <Button
                          type="button"
                          onClick={() => coverFileInputRef.current?.click()}
                          size="sm"
                          className="rounded-full bg-white text-navy hover:bg-slate-100 font-semibold shadow-lg text-xs gap-1.5"
                        >
                          <Upload className="size-3.5 text-primary" /> Select from Computer
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setCustomCoverUrl(currentPost.image || "");
                            setIsImagePickerOpen(true);
                          }}
                          size="sm"
                          variant="secondary"
                          className="rounded-full bg-white/95 text-slate-800 hover:bg-white font-semibold shadow-lg text-xs gap-1.5"
                        >
                          <Sparkles className="size-3.5 text-amber-500" /> Presets &amp; URL
                        </Button>
                        {currentPost.image && (
                          <Button
                            type="button"
                            onClick={() => {
                              setCurrentPost((prev) => ({ ...prev, image: "" }));
                              toast.success("Cover image removed");
                            }}
                            size="sm"
                            variant="destructive"
                            className="rounded-full bg-red-600/90 text-white hover:bg-red-700 font-semibold shadow-lg text-xs gap-1.5"
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Quick persistent button at bottom right */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => coverFileInputRef.current?.click()}
                        className="rounded-full bg-white/95 text-navy font-semibold px-3 py-1.5 text-xs shadow-md border border-slate-200/80 flex items-center gap-1.5 hover:bg-white transition hover:shadow-lg"
                      >
                        <Upload className="size-3.5 text-primary" /> Select from Computer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomCoverUrl(currentPost.image || "");
                          setIsImagePickerOpen(true);
                        }}
                        className="rounded-full bg-white/95 text-slate-700 font-semibold px-2.5 py-1.5 text-xs shadow-md border border-slate-200/80 flex items-center gap-1.5 hover:bg-white transition"
                        title="Browse All Options"
                      >
                        <ImageIcon className="size-3.5 text-slate-600" /> Options
                      </button>
                    </div>
                  </div>

                  {/* Hidden file input for native computer file selection */}
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverFileUpload(file);
                      e.target.value = "";
                    }}
                  />

                  {/* Tabbed Image Picker Drawer (if open) */}
                  {isImagePickerOpen && (
                    <div className="p-5 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4 animate-in fade-in duration-200 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                            <ImageIcon className="size-3.5 text-primary" /> Cover Photo Selector
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Upload a photo from your computer, choose from curated stock images, or enter a web link.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsImagePickerOpen(false)}
                          className="size-7 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
                        >
                          <X className="size-4" />
                        </button>
                      </div>

                      {/* Tab Navigation */}
                      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl w-fit">
                        <button
                          type="button"
                          onClick={() => setCoverImageTab("upload")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            coverImageTab === "upload"
                              ? "bg-white text-navy shadow-xs"
                              : "text-slate-600 hover:text-navy"
                          }`}
                        >
                          <Upload className="size-3.5" /> From Computer
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImageTab("presets")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            coverImageTab === "presets"
                              ? "bg-white text-navy shadow-xs"
                              : "text-slate-600 hover:text-navy"
                          }`}
                        >
                          <Sparkles className="size-3.5" /> Curated Photos
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverImageTab("url")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            coverImageTab === "url"
                              ? "bg-white text-navy shadow-xs"
                              : "text-slate-600 hover:text-navy"
                          }`}
                        >
                          <Globe className="size-3.5" /> Custom URL
                        </button>
                      </div>

                      {/* Tab 1: Upload from Computer */}
                      {coverImageTab === "upload" && (
                        <div className="space-y-3">
                          <div
                            onClick={() => coverFileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleCoverFileUpload(file);
                            }}
                            className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-navy hover:bg-white transition rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center group bg-white/60"
                          >
                            {isUploadingCover ? (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="size-8 text-primary animate-spin" />
                                <span className="text-xs font-semibold text-navy">Uploading image from computer...</span>
                              </div>
                            ) : (
                              <>
                                <div className="size-12 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                                  <Upload className="size-5" />
                                </div>
                                <span className="text-xs font-bold text-navy">
                                  Click here to browse files or drag &amp; drop an image
                                </span>
                                <span className="text-[11px] text-slate-500 mt-1">
                                  Supports PNG, JPG, JPEG, WebP, SVG, and GIF (up to 10MB)
                                </span>
                                <Button
                                  type="button"
                                  size="sm"
                                  className="mt-3.5 rounded-full bg-navy text-white hover:bg-navy/90 text-xs px-5 shadow-xs"
                                >
                                  Browse from Computer
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Curated Photos Grid */}
                      {coverImageTab === "presets" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {SAMPLE_IMAGES.map((img, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setCurrentPost((prev) => ({ ...prev, image: img.url }));
                                  setIsImagePickerOpen(false);
                                  toast.success("Cover image updated");
                                }}
                                className={`group relative h-20 rounded-xl overflow-hidden border transition ${
                                  currentPost.image === img.url
                                    ? "border-navy ring-2 ring-navy/30"
                                    : "border-slate-200 hover:border-navy/50"
                                }`}
                              >
                                <img src={img.url} alt={img.label} className="size-full object-cover group-hover:scale-105 transition" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition">
                                  <span className="text-[9px] text-white font-medium line-clamp-1">{img.label}</span>
                                </div>
                                {currentPost.image === img.url && (
                                  <div className="absolute top-1 right-1 bg-navy text-white rounded-full p-0.5 shadow">
                                    <Check className="size-2.5" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Custom URL Field */}
                      {coverImageTab === "url" && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="url"
                              placeholder="Paste any custom image URL (e.g. https://...)"
                              value={customCoverUrl}
                              onChange={(e) => setCustomCoverUrl(e.target.value)}
                              className="text-xs h-9 bg-white flex-1"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                if (customCoverUrl.trim()) {
                                  setCurrentPost((prev) => ({ ...prev, image: customCoverUrl.trim() }));
                                  toast.success("Cover image updated");
                                  setIsImagePickerOpen(false);
                                } else {
                                  toast.error("Please enter a valid image URL.");
                                }
                              }}
                              className="rounded-full bg-navy text-white text-xs h-9 px-4 shrink-0"
                            >
                              Apply URL
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Bottom action controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 text-xs">
                        <div>
                          {currentPost.image ? (
                            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                              <Check className="size-3 text-emerald-600" /> Active cover image selected
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">No cover image currently assigned</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {currentPost.image && (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentPost((prev) => ({ ...prev, image: "" }));
                                toast.success("Cover image removed");
                              }}
                              className="text-xs text-red-600 hover:underline flex items-center gap-1 mr-2"
                            >
                              <Trash2 className="size-3" /> Remove Cover
                            </button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setIsImagePickerOpen(false)}
                            className="rounded-full text-xs h-8 px-4"
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category Pills & Read Time Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Category:
                      </span>
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCurrentPost((prev) => ({ ...prev, category: cat }))}
                          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition ${
                            currentPost.category === cat
                              ? "bg-navy text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="size-3.5 text-primary" />
                      <input
                        type="text"
                        value={currentPost.readTime}
                        onChange={(e) => setCurrentPost((prev) => ({ ...prev, readTime: e.target.value }))}
                        className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs text-center font-medium text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Clean Big Article Title */}
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Enter your article title here..."
                      value={currentPost.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full font-serif-hero text-2xl sm:text-3xl lg:text-4xl font-bold text-navy placeholder:text-slate-300 border-none outline-none focus:ring-0 bg-transparent resize-none leading-tight"
                    />
                  </div>

                  {/* Subtitle / Excerpt Textarea */}
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Write a clear 1-2 sentence introduction or summary for your readers..."
                      value={currentPost.excerpt}
                      onChange={(e) =>
                        setCurrentPost((prev) => ({
                          ...prev,
                          excerpt: e.target.value,
                          metaDescription: e.target.value,
                        }))
                      }
                      className="w-full text-sm sm:text-base text-slate-600 placeholder:text-slate-300 border-none outline-none focus:ring-0 bg-transparent resize-none leading-relaxed border-t border-slate-100 pt-3"
                    />
                  </div>
                </div>

                {/* Article Content Story Canvas */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Article Body
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentPost.blocks.length} sections
                    </span>
                  </div>

                  {/* Blocks List */}
                  <div className="space-y-6">
                    {currentPost.blocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-2xl p-4 transition-all duration-150 border border-transparent hover:border-slate-200 hover:bg-slate-50/60"
                      >
                        {/* Hover Action Toolbar */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs z-10">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveBlock(idx, "up")}
                            title="Move Up"
                            className="size-6 rounded hover:bg-slate-100 text-slate-500 hover:text-navy disabled:opacity-25 flex items-center justify-center"
                          >
                            <ArrowUp className="size-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentPost.blocks.length - 1}
                            onClick={() => handleMoveBlock(idx, "down")}
                            title="Move Down"
                            className="size-6 rounded hover:bg-slate-100 text-slate-500 hover:text-navy disabled:opacity-25 flex items-center justify-center"
                          >
                            <ArrowDown className="size-3" />
                          </button>
                          <div className="h-3 w-px bg-slate-200" />
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(idx)}
                            title="Delete Block"
                            className="size-6 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>

                        {/* Block Type Badge */}
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {block.type === "h2" && "📌 Section Heading (H2)"}
                          {block.type === "h3" && "📎 Subheading (H3)"}
                          {block.type === "p" && "✍️ Paragraph"}
                          {block.type === "ul" && "📋 Bullet Points"}
                          {block.type === "blockquote" && "💬 Highlight Quote"}
                        </div>

                        {/* Block Editor Input */}
                        {block.type === "h2" ? (
                          <input
                            type="text"
                            placeholder="Section Heading..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="w-full font-serif-hero text-xl sm:text-2xl font-bold text-navy bg-transparent border-b border-transparent focus:border-navy focus:outline-none py-1"
                          />
                        ) : block.type === "h3" ? (
                          <input
                            type="text"
                            placeholder="Subheading..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="w-full font-serif-hero text-lg sm:text-xl font-bold text-navy bg-transparent border-b border-transparent focus:border-navy focus:outline-none py-1"
                          />
                        ) : block.type === "blockquote" ? (
                          <div className="pl-4 border-l-4 border-primary bg-blue-50/40 p-3 rounded-r-xl">
                            <textarea
                              rows={2}
                              placeholder="Type your quote or highlighted key insight..."
                              value={block.text || ""}
                              onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                              className="w-full italic font-serif-hero text-base sm:text-lg text-navy bg-transparent border-none outline-none focus:ring-0 resize-none leading-relaxed"
                            />
                          </div>
                        ) : block.type === "ul" ? (
                          <div className="space-y-2">
                            {(block.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const nextItems = [...(block.items || [])];
                                    nextItems[itemIdx] = e.target.value;
                                    handleUpdateBlock(idx, { items: nextItems });
                                  }}
                                  className="w-full text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-navy focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextItems = (block.items || []).filter((_, i) => i !== itemIdx);
                                    handleUpdateBlock(idx, { items: nextItems });
                                  }}
                                  className="size-7 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const nextItems = [...(block.items || []), "New bullet point"];
                                handleUpdateBlock(idx, { items: nextItems });
                              }}
                              className="text-xs font-semibold text-navy hover:underline mt-1 inline-flex items-center gap-1"
                            >
                              <Plus className="size-3" /> Add bullet point
                            </button>
                          </div>
                        ) : (
                          <textarea
                            rows={3}
                            placeholder="Write your paragraph content..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="w-full text-sm sm:text-base text-slate-800 bg-transparent border-none outline-none focus:ring-0 resize-none leading-relaxed"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Clean Floating In-line Add Bar */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 mr-2">
                        + Add Section:
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("p")}
                        className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <AlignLeft className="size-3.5 mr-1 text-primary" /> Paragraph
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("h2")}
                        className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <Heading className="size-3.5 mr-1 text-primary" /> Section Heading
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("ul")}
                        className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <List className="size-3.5 mr-1 text-primary" /> Bullet List
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("blockquote")}
                        className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <Quote className="size-3.5 mr-1 text-primary" /> Quote Highlight
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. PUBLISHING & SEO SETTINGS */}
            {editorSubTab === "settings" && (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* 1. Release Schedule Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-bold font-serif-hero text-navy flex items-center gap-2">
                      <CalendarClock className="size-4 text-primary" /> When Should This Article Go Live?
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose immediate publication, future scheduled release, or save as draft.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Option 1: Publish Now */}
                    <button
                      type="button"
                      onClick={() => setCurrentPost((prev) => ({ ...prev, status: "published" }))}
                      className={`p-4 rounded-2xl border text-left transition ${
                        currentPost.status === "published" || !currentPost.status
                          ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <CheckCircle2 className="size-5 text-emerald-600 mb-2" />
                      <div className="text-xs font-bold text-slate-900">Publish Immediately</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Live on /blog right away
                      </div>
                    </button>

                    {/* Option 2: Future Schedule */}
                    <button
                      type="button"
                      onClick={() => setCurrentPost((prev) => ({ ...prev, status: "scheduled" }))}
                      className={`p-4 rounded-2xl border text-left transition ${
                        currentPost.status === "scheduled"
                          ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <CalendarClock className="size-5 text-blue-600 mb-2" />
                      <div className="text-xs font-bold text-slate-900">Future Schedule</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Auto-releases at chosen date
                      </div>
                    </button>

                    {/* Option 3: Draft */}
                    <button
                      type="button"
                      onClick={() => setCurrentPost((prev) => ({ ...prev, status: "draft" }))}
                      className={`p-4 rounded-2xl border text-left transition ${
                        currentPost.status === "draft"
                          ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <FileText className="size-5 text-amber-600 mb-2" />
                      <div className="text-xs font-bold text-slate-900">Save as Draft</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Private in studio only
                      </div>
                    </button>
                  </div>

                  {/* Future Datetime Picker if Scheduled */}
                  {currentPost.status === "scheduled" && (
                    <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
                      <label className="block text-xs font-bold text-blue-950">
                        Select Automatic Release Date &amp; Time:
                      </label>
                      <Input
                        type="datetime-local"
                        value={currentPost.publishDate || ""}
                        onChange={(e) => setCurrentPost((prev) => ({ ...prev, publishDate: e.target.value }))}
                        className="h-10 text-xs bg-white border-blue-300 focus-visible:ring-blue-500 text-blue-950 font-medium"
                      />
                      <p className="text-[11px] text-blue-700">
                        &bull; Once this date/time arrives, this article will automatically appear on the live blog and search feeds.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Featured Cover Image Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-serif-hero text-navy flex items-center gap-2">
                        <ImageIcon className="size-4 text-primary" /> Featured Article Cover Image
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Select an image from your computer to display at the top of the article and in blog card previews.
                      </p>
                    </div>
                    {currentPost.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPost((prev) => ({ ...prev, image: "" }));
                          toast.success("Cover image removed");
                        }}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="size-3" /> Remove Image
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    {/* Cover Preview */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 h-32 border border-slate-200 sm:col-span-1 group">
                      {currentPost.image ? (
                        <img
                          src={currentPost.image}
                          alt="Cover Preview"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-2 text-center">
                          <ImageIcon className="size-6 mb-1 text-slate-300" />
                          <span className="text-[10px]">No image selected</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="sm:col-span-2 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => settingsFileInputRef.current?.click()}
                          size="sm"
                          className="rounded-full bg-navy text-white hover:bg-navy/90 text-xs px-4 gap-1.5 shadow-xs"
                        >
                          <Upload className="size-3.5" /> Select from Computer
                        </Button>
                        <input
                          ref={settingsFileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCoverFileUpload(file);
                            e.target.value = "";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditorSubTab("write");
                            setCoverImageTab("presets");
                            setIsImagePickerOpen(true);
                          }}
                          className="rounded-full text-xs px-3.5 gap-1.5 border-slate-200"
                        >
                          <Sparkles className="size-3.5 text-amber-500" /> Stock Presets
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Input
                          type="url"
                          placeholder="Or paste external image URL..."
                          value={currentPost.image}
                          onChange={(e) => setCurrentPost((prev) => ({ ...prev, image: e.target.value }))}
                          className="h-8 text-xs bg-white border-slate-200"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Recommended size: 1200 &times; 630px JPG, PNG, or WebP.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Author & Category Settings */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold font-serif-hero text-navy flex items-center gap-2">
                    <User className="size-4 text-primary" /> Author &amp; Publication Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Author Name
                      </label>
                      <select
                        value={currentPost.author}
                        onChange={(e) => setCurrentPost((prev) => ({ ...prev, author: e.target.value }))}
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy/20"
                      >
                        {DEFAULT_AUTHORS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Display Date Label
                      </label>
                      <Input
                        type="text"
                        value={currentPost.date}
                        onChange={(e) => setCurrentPost((prev) => ({ ...prev, date: e.target.value }))}
                        className="h-10 text-xs bg-white border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. URL Slug Settings */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold font-serif-hero text-navy flex items-center gap-2">
                    <Globe className="size-4 text-primary" /> URL Web Address
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">https://smgaba.com/blog/</span>
                    <Input
                      type="text"
                      disabled={!isCustomSlugUnlocked}
                      value={currentPost.slug}
                      onChange={(e) =>
                        setCurrentPost((prev) => ({
                          ...prev,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
                        }))
                      }
                      className="h-9 text-xs font-mono bg-white border-slate-200 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomSlugUnlocked(!isCustomSlugUnlocked)}
                      className="text-xs h-9 px-3 shrink-0"
                    >
                      {isCustomSlugUnlocked ? <Lock className="size-3.5 mr-1" /> : <Unlock className="size-3.5 mr-1" />}
                      {isCustomSlugUnlocked ? "Lock" : "Customize"}
                    </Button>
                  </div>
                </div>

                {/* 4. Google SEO Preview Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-base font-bold font-serif-hero text-navy flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" /> Google Search Result Simulation
                  </h3>

                  {/* Visual Google Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="size-4 rounded-full bg-navy text-white text-[9px] font-bold flex items-center justify-center">S</span>
                      <span>smgaba.com &rsaquo; blog &rsaquo; {currentPost.slug || "article-url"}</span>
                    </div>
                    <div className="text-base font-medium text-blue-800 line-clamp-1 hover:underline cursor-pointer">
                      {currentPost.metaTitle || currentPost.title || "Article Title"}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {currentPost.metaDescription || currentPost.excerpt || "Article summary will appear here on Google search results."}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Meta Title
                      </label>
                      <Input
                        type="text"
                        value={currentPost.metaTitle}
                        onChange={(e) => setCurrentPost((prev) => ({ ...prev, metaTitle: e.target.value }))}
                        className="h-9 text-xs bg-white border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={currentPost.metaDescription}
                        onChange={(e) => setCurrentPost((prev) => ({ ...prev, metaDescription: e.target.value }))}
                        className="w-full p-2.5 text-xs text-slate-800 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: EXACT 1-CLICK LIVE PREVIEW */}
        {/* ========================================================================= */}
        {activeTab === "preview" && (
          <div className="space-y-6">
            {/* Top Preview Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("edit")}
                className="gap-1.5 rounded-full text-navy border-slate-200 hover:bg-slate-100 h-8 text-xs font-semibold"
              >
                <Edit3 className="size-3.5" /> Back to Editor
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Previewing exact website layout:
                </span>
                <Button
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleSave()}
                  className="rounded-full gap-1.5 bg-navy text-white hover:bg-navy/90 h-8 px-4 text-xs font-semibold shadow-md shadow-navy/20"
                >
                  {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Render Exact BlogPostView */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <BlogPostView post={currentPost} />
            </div>
          </div>
        )}
      </main>

      {/* Global Site Footer */}
      <Footer />
    </div>
  );
}
