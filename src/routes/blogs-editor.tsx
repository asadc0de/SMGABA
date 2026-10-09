import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
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
  AlertCircle,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layers,
  Heading,
  AlignLeft,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Loader2,
  CalendarClock,
  Filter,
  Check,
  Share2,
  FileText,
  Lock,
  Unlock,
  RefreshCw,
  Globe,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getAdminBlogs,
  saveBlogPost,
  deleteBlogPost,
  type ExtendedBlogPost,
} from "@/lib/blogs.server";
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
    label: "Accounting & Desk",
    url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Business Advisory",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Finance & Charts",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Hospitality & Dining",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Corporate Office",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Tax Planning",
    url: "https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&w=1200&q=80",
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
        text: "1. Key Industry Insights & Analysis",
      },
      {
        type: "p",
        text: "Dive into the actionable details. Provide data, real-world benchmarks, and clear explanations that assist business owners in making informed financial decisions.",
      },
      {
        type: "ul",
        items: [
          "Strategic benefit or compliance consideration",
          "Operational efficiency tip or cash flow checkpoint",
          "Recommended cadence with your CFO advisor",
        ],
      },
      {
        type: "blockquote",
        text: "Proactive financial management isn't just about reviewing past numbers—it's about anticipating upcoming market shifts and positioning your business for sustainable profitability.",
      },
      {
        type: "h2",
        text: "Conclusion & Strategic Next Steps",
      },
      {
        type: "p",
        text: "Summarize the takeaways and invite readers to schedule a consultation with the SMG advisory team.",
      },
    ],
  };
}

const POSTS_PER_PAGE = 18;

function BlogsEditorPage() {
  const initialData = Route.useLoaderData();
  const [blogsList, setBlogsList] = useState<ExtendedBlogPost[]>(initialData?.blogs || []);
  const [activeTab, setActiveTab] = useState<"list" | "edit" | "preview">("list");
  const [currentPost, setCurrentPost] = useState<ExtendedBlogPost>(createBlankPost);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [listPage, setListPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isCustomSlugUnlocked, setIsCustomSlugUnlocked] = useState(false);

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
    setActiveTab("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Edit Post
  const handleEditPost = (post: ExtendedBlogPost) => {
    setCurrentPost(JSON.parse(JSON.stringify(post)));
    setIsCustomSlugUnlocked(true);
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
      type === "ul" || type === "ol"
        ? { type, items: ["New bullet point item", "Second point item"] }
        : type === "blockquote"
        ? { type, text: "Important callout quote or strategic takeaway for your clients." }
        : type === "h2"
        ? { type, text: "New Section Heading" }
        : type === "h3"
        ? { type, text: "Sub-section Heading" }
        : { type: "p", text: "Write your article paragraph content here. Explain the key financial and advisory concepts clearly." };

    setCurrentPost((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    toast.success(`Added ${type.toUpperCase()} block`);
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
      toast.error("Please enter a blog post title.");
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

      <main className="flex-1 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-block size-2 rounded-full bg-primary" />
              SMG Editorial &bull; Financial Advisory
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-hero text-navy">
              Blog Studio &amp; Article Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Create, draft, and schedule future blog posts matching the exact SMG website design and typography.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {activeTab !== "list" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("list")}
                className="gap-1.5 rounded-full text-navy border-slate-200 hover:bg-slate-100 h-9 text-xs font-semibold"
              >
                <ArrowLeft className="size-3.5" /> Back to Articles
              </Button>
            )}

            {activeTab === "edit" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("preview")}
                className="gap-1.5 rounded-full bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100 h-9 text-xs font-semibold"
              >
                <Eye className="size-3.5" /> Live Preview
              </Button>
            )}

            {activeTab === "preview" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("edit")}
                className="gap-1.5 rounded-full bg-blue-50/80 text-blue-700 border-blue-200 hover:bg-blue-100 h-9 text-xs font-semibold"
              >
                <Edit3 className="size-3.5" /> Back to Editor
              </Button>
            )}

            {activeTab === "list" && (
              <Button
                onClick={handleStartNew}
                size="sm"
                className="rounded-full bg-navy text-white hover:bg-navy/90 gap-1.5 shadow-md shadow-navy/20 h-9 text-xs font-semibold"
              >
                <Plus className="size-4" /> New Article
              </Button>
            )}

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

        {/* TAB 1: ARTICLES LIST DASHBOARD */}
        {activeTab === "list" && (
          <div className="mt-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-12 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <BookOpen className="size-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif-hero text-navy">{stats.total}</div>
                  <div className="text-xs font-medium text-slate-500">Total Articles</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif-hero text-emerald-700">{stats.published}</div>
                  <div className="text-xs font-medium text-slate-500">Live Published</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <CalendarClock className="size-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif-hero text-blue-700">{stats.scheduled}</div>
                  <div className="text-xs font-medium text-slate-500">Future Scheduled</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="size-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <FileText className="size-6" />
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
                  No articles matched your search or filter criteria. Try adjusting your filters or create a new blog.
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

        {/* TAB 2: ARTICLE EDITOR FORM */}
        {activeTab === "edit" && (
          <div className="mt-8">
            {/* Sticky Action Subheader */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-20 z-40 backdrop-blur-md bg-white/95">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("list")}
                  className="rounded-full text-slate-600 hover:text-navy hover:bg-slate-100 h-8 px-3 text-xs"
                >
                  <ArrowLeft className="size-3.5 mr-1" /> All Articles
                </Button>
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Editing: <span className="text-navy">{currentPost.title || "Untitled Article"}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("preview")}
                  className="rounded-full gap-1.5 text-navy border-slate-200 hover:bg-slate-100 h-8 px-4 text-xs font-semibold"
                >
                  <Eye className="size-3.5" /> Preview Article
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => handleSave("draft")}
                  className="rounded-full gap-1.5 text-slate-700 border-slate-200 hover:bg-slate-100 h-8 px-4 text-xs font-semibold"
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
                    Save Schedule
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Main Column: Content & Blocks */}
              <div className="lg:col-span-8 space-y-6">
                {/* Title & Core Details Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Article Title *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 5 Strategic Tax Planning Strategies for 2027"
                      value={currentPost.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="font-serif-hero text-xl sm:text-2xl font-bold text-navy h-14 rounded-xl border-slate-200 focus-visible:ring-navy"
                    />
                  </div>

                  {/* Slug & URL preview */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600 flex-1">
                      <Globe className="size-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-500">Live URL:</span>
                      <span className="text-navy font-mono truncate">
                        /blog/
                        {isCustomSlugUnlocked ? (
                          <input
                            type="text"
                            value={currentPost.slug}
                            onChange={(e) =>
                              setCurrentPost((prev) => ({
                                ...prev,
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
                              }))
                            }
                            className="bg-white px-2 py-0.5 border border-slate-300 rounded font-mono text-xs text-navy focus:outline-none"
                          />
                        ) : (
                          currentPost.slug || "your-slug-here"
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCustomSlugUnlocked(!isCustomSlugUnlocked)}
                      className="text-[11px] font-semibold text-navy hover:underline flex items-center gap-1 shrink-0"
                    >
                      {isCustomSlugUnlocked ? (
                        <>
                          <Lock className="size-3" /> Lock Slug
                        </>
                      ) : (
                        <>
                          <Unlock className="size-3" /> Custom Slug
                        </>
                      )}
                    </button>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Excerpt / Summary (Appears in article cards &amp; SEO)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write a compelling 2-sentence summary of what readers will learn..."
                      value={currentPost.excerpt}
                      onChange={(e) =>
                        setCurrentPost((prev) => ({ ...prev, excerpt: e.target.value, metaDescription: e.target.value }))
                      }
                      className="w-full p-3.5 text-xs sm:text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                    />
                  </div>
                </div>

                {/* Structured Content Blocks Builder */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold font-serif-hero text-navy flex items-center gap-2">
                        <Layers className="size-4 text-primary" /> Content Blocks Builder
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Build your article using standardized layout blocks identical to existing SMG blogs.
                      </p>
                    </div>

                    {/* Quick Add Block Bar */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("p")}
                        className="rounded-full text-xs h-7 px-2.5 text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <AlignLeft className="size-3 mr-1" /> + Paragraph
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("h2")}
                        className="rounded-full text-xs h-7 px-2.5 text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <Heading className="size-3 mr-1" /> + Heading
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("ul")}
                        className="rounded-full text-xs h-7 px-2.5 text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <List className="size-3 mr-1" /> + Bullets
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddBlock("blockquote")}
                        className="rounded-full text-xs h-7 px-2.5 text-slate-700 hover:bg-slate-100 border-slate-200"
                      >
                        <Quote className="size-3 mr-1" /> + Quote
                      </Button>
                    </div>
                  </div>

                  {/* Blocks List */}
                  <div className="space-y-4">
                    {currentPost.blocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/70 p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-navy/30 transition duration-150 relative group"
                      >
                        {/* Block Header Toolbar */}
                        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-navy/10 text-navy font-mono">
                              Block {idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                              {block.type === "p" && "Paragraph"}
                              {block.type === "h2" && "Section Heading (H2)"}
                              {block.type === "h3" && "Subheading (H3)"}
                              {block.type === "ul" && "Bullet List"}
                              {block.type === "ol" && "Numbered List"}
                              {block.type === "blockquote" && "Pull Quote / Callout"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveBlock(idx, "up")}
                              className="size-7 rounded border border-slate-200 bg-white text-slate-600 hover:text-navy hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center transition"
                            >
                              <ArrowUp className="size-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === currentPost.blocks.length - 1}
                              onClick={() => handleMoveBlock(idx, "down")}
                              className="size-7 rounded border border-slate-200 bg-white text-slate-600 hover:text-navy hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center transition"
                            >
                              <ArrowDown className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlock(idx)}
                              className="size-7 rounded border border-slate-200 bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>

                        {/* Block Editor Content */}
                        {block.type === "h2" || block.type === "h3" || block.type === "h4" ? (
                          <Input
                            type="text"
                            placeholder="Heading text..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="font-serif-hero text-lg font-bold text-navy bg-white border-slate-200"
                          />
                        ) : block.type === "blockquote" ? (
                          <div className="space-y-2">
                            <textarea
                              rows={3}
                              placeholder="Quote or highlighted insight..."
                              value={block.text || ""}
                              onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                              className="w-full p-3 text-xs sm:text-sm italic font-serif-hero text-navy bg-blue-50/40 rounded-lg border border-blue-200/80 focus:outline-none focus:ring-2 focus:ring-navy/20"
                            />
                            <p className="text-[11px] text-slate-400">
                              This will render with a luxury sapphire highlight bar and italic styling.
                            </p>
                          </div>
                        ) : block.type === "ul" || block.type === "ol" ? (
                          <div className="space-y-2">
                            {(block.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <span className="size-5 rounded-full bg-navy/10 text-navy font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {block.type === "ol" ? itemIdx + 1 : "&bull;"}
                                </span>
                                <Input
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const nextItems = [...(block.items || [])];
                                    nextItems[itemIdx] = e.target.value;
                                    handleUpdateBlock(idx, { items: nextItems });
                                  }}
                                  className="h-9 text-xs bg-white border-slate-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextItems = (block.items || []).filter((_, i) => i !== itemIdx);
                                    handleUpdateBlock(idx, { items: nextItems });
                                  }}
                                  className="size-8 text-slate-400 hover:text-red-600 rounded flex items-center justify-center"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              </div>
                            ))}

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const nextItems = [...(block.items || []), "New list item"];
                                handleUpdateBlock(idx, { items: nextItems });
                              }}
                              className="text-xs text-navy font-semibold h-7 hover:bg-white"
                            >
                              + Add List Item
                            </Button>
                          </div>
                        ) : (
                          <textarea
                            rows={4}
                            placeholder="Write your paragraph content..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="w-full p-3 text-xs sm:text-sm text-slate-800 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Block Bottom Action */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xs font-medium text-slate-500 mr-2">Insert next block:</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlock("p")}
                      className="rounded-full text-xs h-8 px-3 text-slate-700 hover:bg-slate-100 border-slate-200"
                    >
                      <AlignLeft className="size-3.5 mr-1 text-primary" /> Paragraph
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlock("h2")}
                      className="rounded-full text-xs h-8 px-3 text-slate-700 hover:bg-slate-100 border-slate-200"
                    >
                      <Heading className="size-3.5 mr-1 text-primary" /> Section Heading
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlock("ul")}
                      className="rounded-full text-xs h-8 px-3 text-slate-700 hover:bg-slate-100 border-slate-200"
                    >
                      <List className="size-3.5 mr-1 text-primary" /> Bullet List
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBlock("blockquote")}
                      className="rounded-full text-xs h-8 px-3 text-slate-700 hover:bg-slate-100 border-slate-200"
                    >
                      <Quote className="size-3.5 mr-1 text-primary" /> Pull Quote
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Publishing, Category, Author & Featured Image */}
              <div className="lg:col-span-4 space-y-6">
                {/* Release & Schedule Settings */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-2">
                    <CalendarClock className="size-4 text-primary" /> Release &amp; Schedule
                  </h3>

                  {/* Status Mode Radio Options */}
                  <div className="space-y-2">
                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        currentPost.status === "published"
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-950"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="post_status"
                        checked={currentPost.status === "published" || !currentPost.status}
                        onChange={() => setCurrentPost((prev) => ({ ...prev, status: "published" }))}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-600" /> Publish Now (Live)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Article will be live immediately on /blog for visitors.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        currentPost.status === "scheduled"
                          ? "border-blue-500 bg-blue-50/50 text-blue-950"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="post_status"
                        checked={currentPost.status === "scheduled"}
                        onChange={() => setCurrentPost((prev) => ({ ...prev, status: "scheduled" }))}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5 text-blue-900">
                          <CalendarClock className="size-3.5 text-blue-600" /> Schedule for Future Date
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Automatically goes live when the chosen date/time arrives.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        currentPost.status === "draft"
                          ? "border-amber-500 bg-amber-50/50 text-amber-950"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="post_status"
                        checked={currentPost.status === "draft"}
                        onChange={() => setCurrentPost((prev) => ({ ...prev, status: "draft" }))}
                        className="mt-0.5 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5 text-amber-900">
                          <FileText className="size-3.5 text-amber-600" /> Save as Draft
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Private draft only visible within this Blog Studio.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Future Schedule Date Picker (Shown when Scheduled) */}
                  {currentPost.status === "scheduled" && (
                    <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2">
                      <label className="block text-xs font-bold text-blue-950">
                        Select Future Release Date &amp; Time
                      </label>
                      <Input
                        type="datetime-local"
                        value={currentPost.publishDate || ""}
                        onChange={(e) => setCurrentPost((prev) => ({ ...prev, publishDate: e.target.value }))}
                        className="h-10 text-xs bg-white border-blue-300 focus-visible:ring-blue-500 text-blue-950 font-medium"
                      />
                      <p className="text-[10px] text-blue-700 leading-tight">
                        &bull; Once this timestamp is reached, the post automatically appears on the public blog and RSS feeds without requiring manual publishing.
                      </p>
                    </div>
                  )}

                  {/* Display Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Display Date Label
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Oct 15, 2026"
                      value={currentPost.date}
                      onChange={(e) => setCurrentPost((prev) => ({ ...prev, date: e.target.value }))}
                      className="h-9 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Article Metadata (Category, Author, Read Time) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-2">
                    <User className="size-4 text-primary" /> Article Metadata
                  </h3>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Category
                    </label>
                    <select
                      value={currentPost.category}
                      onChange={(e) => setCurrentPost((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy/20"
                    >
                      {DEFAULT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Author
                    </label>
                    <select
                      value={currentPost.author}
                      onChange={(e) => setCurrentPost((prev) => ({ ...prev, author: e.target.value }))}
                      className="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy/20"
                    >
                      {DEFAULT_AUTHORS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Read Time */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Reading Time
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 5 min read"
                      value={currentPost.readTime}
                      onChange={(e) => setCurrentPost((prev) => ({ ...prev, readTime: e.target.value }))}
                      className="h-9 text-xs border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-2">
                    <ImageIcon className="size-4 text-primary" /> Featured Image
                  </h3>

                  {/* Preview Image */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    {currentPost.image ? (
                      <img
                        src={currentPost.image}
                        alt="Featured Preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-slate-400 text-xs">
                        No image selected
                      </div>
                    )}
                  </div>

                  {/* Preset Image Options */}
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 mb-2">
                      Select a Curated Business Photo:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {SAMPLE_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentPost((prev) => ({ ...prev, image: img.url }))}
                          className={`relative h-14 rounded-lg overflow-hidden border transition ${
                            currentPost.image === img.url
                              ? "border-navy ring-2 ring-navy/30"
                              : "border-slate-200 hover:border-navy/50"
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="size-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Custom Image URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={currentPost.image}
                      onChange={(e) => setCurrentPost((prev) => ({ ...prev, image: e.target.value }))}
                      className="h-9 text-xs border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* SEO Metadata Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" /> Search Engine Optimization (SEO)
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      SEO Meta Title
                    </label>
                    <Input
                      type="text"
                      placeholder="Article Title | SMG ABA"
                      value={currentPost.metaTitle}
                      onChange={(e) => setCurrentPost((prev) => ({ ...prev, metaTitle: e.target.value }))}
                      className="h-9 text-xs border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Custom description for Google search snippets..."
                      value={currentPost.metaDescription}
                      onChange={(e) => setCurrentPost((prev) => ({ ...prev, metaDescription: e.target.value }))}
                      className="w-full p-2.5 text-xs text-slate-800 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE PREVIEW VIEW */}
        {activeTab === "preview" && (
          <div className="mt-8 space-y-6">
            {/* Top Toolbar */}
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
                  Previewing exact live layout:
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
