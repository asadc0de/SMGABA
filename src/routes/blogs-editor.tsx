import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  ChevronRight,
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
];

function createBlankPost(): ExtendedBlogPost {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    id: `blog-${Date.now()}`,
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    h1: "",
    date: dateFormatted,
    publishDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16), // default 1 week future for scheduled
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
        text: "Conclusion & Next Steps",
      },
      {
        type: "p",
        text: "Summarize the takeaways and invite readers to schedule a consultation with the SMG advisory team.",
      },
    ],
  };
}

function BlogsEditorPage() {
  const initialData = Route.useLoaderData();
  const [blogsList, setBlogsList] = useState<ExtendedBlogPost[]>(initialData?.blogs || []);
  const [activeTab, setActiveTab] = useState<"list" | "edit" | "preview">("list");
  const [currentPost, setCurrentPost] = useState<ExtendedBlogPost>(createBlankPost);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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

  // Handler: Start New Post
  const handleStartNew = () => {
    setCurrentPost(createBlankPost());
    setActiveTab("edit");
  };

  // Handler: Edit Post
  const handleEditPost = (post: ExtendedBlogPost) => {
    setCurrentPost(JSON.parse(JSON.stringify(post)));
    setActiveTab("edit");
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
    setActiveTab("edit");
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
        setToastMessage({ type: "success", text: "Blog post deleted successfully." });
      } else {
        setToastMessage({ type: "error", text: res.error || "Failed to delete post." });
      }
    } catch {
      setToastMessage({ type: "error", text: "Error communicating with server." });
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
      slug: prev.isCustom && (!prev.slug || prev.slug === autoSlug.slice(0, -1)) ? autoSlug : prev.slug,
    }));
  };

  // Content Block Management
  const handleAddBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock =
      type === "ul" || type === "ol"
        ? { type, items: ["New bullet point item"] }
        : type === "blockquote"
        ? { type, text: "Important callout quote or advisory summary." }
        : type === "h2"
        ? { type, text: "New Section Heading" }
        : type === "h3"
        ? { type, text: "Sub-section Heading" }
        : { type: "p", text: "Write your paragraph content here..." };

    setCurrentPost((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
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
      setToastMessage({ type: "error", text: "Please enter a blog post title." });
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
        setToastMessage({
          type: "success",
          text:
            effectiveStatus === "scheduled"
              ? `Blog post scheduled successfully for ${new Date(currentPost.publishDate || "").toLocaleString()}!`
              : effectiveStatus === "draft"
              ? "Draft saved successfully!"
              : "Blog post published successfully!",
        });

        // Update local list
        setBlogsList((prev) => {
          const filtered = prev.filter((b) => b.slug !== postToSave.slug);
          return [postToSave, ...filtered];
        });

        setCurrentPost(postToSave);
      } else {
        setToastMessage({ type: "error", text: res.error || "Failed to save blog post." });
      }
    } catch (err: any) {
      setToastMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e1c] text-white font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b172e]/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 group">
              <div className="size-9 rounded-full border border-blue-400/40 bg-gradient-to-br from-[#1b3a70] to-[#0f2142] p-1.5 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <img src="/favicon.svg" alt="SMG Logo" className="size-full object-contain" />
              </div>
              <div>
                <span className="font-serif-hero text-lg font-bold text-white tracking-wide">
                  SMG Blog Studio
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-blue-300">
                  Future Post Creator
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {activeTab !== "list" && (
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/20 transition"
              >
                <ArrowLeft className="size-3.5" /> Back to List
              </button>
            )}

            {activeTab === "edit" && (
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className="flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-blue-600/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-200 hover:bg-blue-600/50 transition"
              >
                <Eye className="size-3.5" /> Live Preview
              </button>
            )}

            {activeTab === "preview" && (
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className="flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-blue-600/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-200 hover:bg-blue-600/50 transition"
              >
                <Edit3 className="size-3.5" /> Back to Editor
              </button>
            )}

            {activeTab === "list" && (
              <Button
                onClick={handleStartNew}
                className="rounded-full bg-blue-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition"
              >
                <Plus className="mr-1.5 size-4" /> Create New Blog
              </Button>
            )}

            <a
              href="/blog"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <span>View Public Blog</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-bottom-3 ${
            toastMessage.type === "success"
              ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-200 backdrop-blur-md"
              : "border-rose-500/30 bg-rose-950/90 text-rose-200 backdrop-blur-md"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* TAB 1: ALL BLOGS LIST / DASHBOARD */}
      {activeTab === "list" && (
        <main className="mx-auto max-w-7xl px-6 py-10">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Posts</div>
              <div className="mt-2 text-3xl font-extrabold text-white font-serif-hero">{stats.total}</div>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Live / Published</div>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400 font-serif-hero">{stats.published}</div>
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-300">Future Scheduled</div>
              <div className="mt-2 text-3xl font-extrabold text-blue-400 font-serif-hero">{stats.scheduled}</div>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Drafts</div>
              <div className="mt-2 text-3xl font-extrabold text-amber-400 font-serif-hero">{stats.drafts}</div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title, author, slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-slate-400 text-sm focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl border border-white/15 bg-[#142340] px-3.5 text-xs font-bold uppercase tracking-wider text-slate-200 focus:outline-none"
              >
                <option value="all">All Statuses ({blogsList.length})</option>
                <option value="published">Published Only</option>
                <option value="scheduled">Future Scheduled</option>
                <option value="draft">Drafts</option>
                <option value="custom">Custom Added Only</option>
                <option value="static">Built-in Static</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 rounded-xl border border-white/15 bg-[#142340] px-3.5 text-xs font-bold uppercase tracking-wider text-slate-200 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {initialData?.categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Blog Posts Grid / Cards */}
          {filteredBlogs.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-sm">
              <BookOpen className="mx-auto size-12 text-slate-500 mb-3" />
              <h3 className="text-xl font-bold font-serif-hero text-white">No blog posts found</h3>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search terms or create a new blog post.</p>
              <Button onClick={handleStartNew} className="mt-6 rounded-full bg-blue-600 text-white font-bold">
                <Plus className="mr-1.5 size-4" /> Create First Blog
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((post) => {
                const isScheduled = post.status === "scheduled";
                const isDraft = post.status === "draft";
                const isLive = !isDraft && (!isScheduled || new Date(post.publishDate || "").getTime() <= Date.now());

                return (
                  <div
                    key={post.slug}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition duration-200 hover:border-blue-400/50 hover:bg-white/[0.07] hover:shadow-xl"
                  >
                    <div>
                      {/* Post Thumbnail */}
                      <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="size-full object-cover" />
                        ) : (
                          <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 text-slate-500">
                            <ImageIcon className="size-10 opacity-40" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          {isDraft ? (
                            <span className="rounded-full bg-amber-500/90 text-slate-950 font-black px-2.5 py-0.5 text-[10px] uppercase tracking-wider shadow">
                              Draft
                            </span>
                          ) : isScheduled && !isLive ? (
                            <span className="rounded-full bg-blue-500 text-white font-black px-2.5 py-0.5 text-[10px] uppercase tracking-wider shadow flex items-center gap-1">
                              <CalendarClock className="size-3" /> Future Scheduled
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-500 text-white font-black px-2.5 py-0.5 text-[10px] uppercase tracking-wider shadow">
                              Published
                            </span>
                          )}

                          {post.isCustom && (
                            <span className="rounded-full bg-purple-500/80 text-white font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">
                              Custom
                            </span>
                          )}
                        </div>

                        {/* Category */}
                        <div className="absolute bottom-3 left-3">
                          <span className="rounded-md bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-blue-200">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Post Details */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3 text-blue-400" />
                            {post.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-blue-400" />
                            {post.readTime}
                          </span>
                        </div>

                        <h4 className="font-serif-hero text-lg font-bold text-white line-clamp-2 leading-snug">
                          {post.title}
                        </h4>

                        {post.excerpt && (
                          <p className="mt-2 text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        {isScheduled && post.publishDate && (
                          <div className="mt-3 rounded-lg border border-blue-400/20 bg-blue-950/40 px-2.5 py-1.5 text-[11px] text-blue-300 flex items-center gap-1.5">
                            <CalendarClock className="size-3.5 text-blue-400 shrink-0" />
                            <span>Scheduled: {new Date(post.publishDate).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="border-t border-white/10 bg-black/20 px-5 py-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditPost(post)}
                          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                          title="Edit Post"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPost(post);
                            setActiveTab("preview");
                          }}
                          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                          title="Preview Post"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicatePost(post)}
                          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition"
                          title="Duplicate Post"
                        >
                          <Copy className="size-4" />
                        </button>
                        {post.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.slug)}
                            className="rounded-lg p-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
                            title="Delete Post"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>

                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* TAB 2: BLOG EDITOR */}
      {activeTab === "edit" && (
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Post Settings & Metadata */}
            <div className="lg:col-span-5 space-y-6">
              {/* Publishing & Scheduling Box */}
              <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0c1c38] to-[#081326] p-6 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300 mb-4">
                  <CalendarClock className="size-4 text-blue-400" />
                  <span>Publishing &amp; Schedule Settings</span>
                </div>

                <div className="space-y-4">
                  {/* Status Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Release Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPost((p) => ({ ...p, status: "published" }))}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition flex flex-col items-center gap-1 ${
                          currentPost.status === "published"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <span className="size-2 rounded-full bg-emerald-400" />
                        <span>Publish Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentPost((p) => ({ ...p, status: "scheduled" }))}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition flex flex-col items-center gap-1 ${
                          currentPost.status === "scheduled"
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <CalendarClock className="size-3.5 text-blue-400" />
                        <span>Schedule</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentPost((p) => ({ ...p, status: "draft" }))}
                        className={`rounded-xl border p-2.5 text-xs font-bold transition flex flex-col items-center gap-1 ${
                          currentPost.status === "draft"
                            ? "border-amber-500 bg-amber-500/20 text-amber-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        <span className="size-2 rounded-full bg-amber-400" />
                        <span>Draft</span>
                      </button>
                    </div>
                  </div>

                  {/* Future Schedule Date & Time Picker */}
                  {currentPost.status === "scheduled" && (
                    <div className="rounded-2xl border border-blue-400/30 bg-blue-950/40 p-4 animate-in fade-in">
                      <label className="block text-xs font-bold text-blue-200 mb-1.5">
                        Automatic Release Date &amp; Time
                      </label>
                      <input
                        type="datetime-local"
                        value={currentPost.publishDate || ""}
                        onChange={(e) => setCurrentPost((p) => ({ ...p, publishDate: e.target.value }))}
                        className="w-full rounded-xl border border-white/20 bg-[#071328] px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                      />
                      <p className="mt-2 text-[11px] text-blue-300/80 leading-relaxed">
                        This article will automatically become visible to all public visitors once this date &amp; time arrives.
                      </p>
                    </div>
                  )}

                  {/* Formatted Display Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Display Date (Shown on Blog Header)
                    </label>
                    <input
                      type="text"
                      value={currentPost.date}
                      onChange={(e) => setCurrentPost((p) => ({ ...p, date: e.target.value }))}
                      placeholder="e.g. Oct 25, 2026"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* General Metadata Box */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Article Details
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <div className="flex gap-2">
                    <select
                      value={DEFAULT_CATEGORIES.includes(currentPost.category) ? currentPost.category : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          setCurrentPost((p) => ({ ...p, category: e.target.value }));
                        }
                      }}
                      className="w-full rounded-xl border border-white/15 bg-[#142340] px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                    >
                      {DEFAULT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="custom">Other / Custom</option>
                    </select>
                  </div>
                  {!DEFAULT_CATEGORIES.includes(currentPost.category) && (
                    <input
                      type="text"
                      placeholder="Enter custom category name"
                      value={currentPost.category}
                      onChange={(e) => setCurrentPost((p) => ({ ...p, category: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author</label>
                  <select
                    value={DEFAULT_AUTHORS.includes(currentPost.author) ? currentPost.author : "custom"}
                    onChange={(e) => {
                      if (e.target.value !== "custom") {
                        setCurrentPost((p) => ({ ...p, author: e.target.value }));
                      }
                    }}
                    className="w-full rounded-xl border border-white/15 bg-[#142340] px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    {DEFAULT_AUTHORS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                    <option value="custom">Custom Author</option>
                  </select>
                  {!DEFAULT_AUTHORS.includes(currentPost.author) && (
                    <input
                      type="text"
                      placeholder="Enter author name"
                      value={currentPost.author}
                      onChange={(e) => setCurrentPost((p) => ({ ...p, author: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={currentPost.readTime}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, readTime: e.target.value }))}
                    placeholder="e.g. 5 min read"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Excerpt / Summary</label>
                  <textarea
                    rows={3}
                    value={currentPost.excerpt}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, excerpt: e.target.value }))}
                    placeholder="Short engaging summary shown on cards and under header..."
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Featured Image Box */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Featured Image
                </div>

                <div>
                  <input
                    type="text"
                    value={currentPost.image}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, image: e.target.value }))}
                    placeholder="Image URL (https://...)"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {currentPost.image && (
                  <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/15">
                    <img src={currentPost.image} alt="Preview" className="size-full object-cover" />
                  </div>
                )}

                <div>
                  <span className="block text-[11px] text-slate-400 mb-1.5">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_IMAGES.map((img) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => setCurrentPost((p) => ({ ...p, image: img.url }))}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-white/15 hover:text-white transition"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO & Meta Tag Box */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  SEO &amp; Meta Tags
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={currentPost.metaTitle || ""}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, metaTitle: e.target.value }))}
                    placeholder="e.g. 7 Signs Your Business Has Outgrown DIY Bookkeeping | SMG"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={currentPost.metaDescription || ""}
                    onChange={(e) => setCurrentPost((p) => ({ ...p, metaDescription: e.target.value }))}
                    placeholder="Search engine snippet..."
                    className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Title, Slug & Content Blocks Builder */}
            <div className="lg:col-span-7 space-y-6">
              {/* Title & Slug Header */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-300 mb-1.5">
                    Blog Post Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentPost.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Year-End Tax Planning Strategies for Multi-State Businesses"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-lg sm:text-xl font-serif-hero font-bold text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-slate-300">
                    <span className="text-slate-500 mr-1 select-none">/blog/</span>
                    <input
                      type="text"
                      value={currentPost.slug}
                      onChange={(e) => setCurrentPost((p) => ({ ...p, slug: e.target.value }))}
                      placeholder="year-end-tax-planning-strategies"
                      className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Content Blocks Builder */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif-hero text-lg font-bold text-white">Article Content Blocks</h3>
                    <p className="text-xs text-slate-400">
                      Construct your blog story section by section matching the existing SMG style.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300">
                    {currentPost.blocks.length} Blocks
                  </span>
                </div>

                {/* Blocks List */}
                <div className="space-y-4">
                  {currentPost.blocks.map((block, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-[#0c182e] p-4 shadow-sm transition hover:border-white/20"
                    >
                      {/* Block Controls Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-6 items-center justify-center rounded-md bg-blue-600/30 text-xs font-bold text-blue-300">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            {block.type === "h2" && "Heading 2 (Major Section)"}
                            {block.type === "h3" && "Heading 3 (Sub-section)"}
                            {block.type === "h4" && "Heading 4 (Minor Title)"}
                            {block.type === "p" && "Paragraph / Story Text"}
                            {block.type === "ul" && "Bullet Points List"}
                            {block.type === "ol" && "Numbered Steps List"}
                            {block.type === "blockquote" && "Callout Quote Box"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveBlock(idx, "up")}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentPost.blocks.length - 1}
                            onClick={() => handleMoveBlock(idx, "down")}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlock(idx)}
                            className="rounded-md p-1.5 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            title="Delete Block"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block Input Content */}
                      {block.type === "h2" || block.type === "h3" || block.type === "h4" ? (
                        <input
                          type="text"
                          value={block.text || ""}
                          onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                          placeholder="Heading text..."
                          className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 font-serif-hero text-base font-bold text-white focus:border-blue-400 focus:outline-none"
                        />
                      ) : block.type === "blockquote" ? (
                        <textarea
                          rows={3}
                          value={block.text || ""}
                          onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                          placeholder="Quote or featured key takeaway..."
                          className="w-full rounded-xl border border-blue-400/30 bg-blue-950/20 p-3 italic text-sm text-blue-100 placeholder:text-blue-300/40 focus:border-blue-400 focus:outline-none"
                        />
                      ) : block.type === "ul" || block.type === "ol" ? (
                        <div className="space-y-2">
                          {block.items?.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-blue-400 shrink-0" />
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const nextItems = [...(block.items || [])];
                                  nextItems[itemIdx] = e.target.value;
                                  handleUpdateBlock(idx, { items: nextItems });
                                }}
                                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-blue-400 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const nextItems = block.items?.filter((_, i) => i !== itemIdx);
                                  handleUpdateBlock(idx, { items: nextItems });
                                }}
                                className="rounded-md p-1.5 text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const nextItems = [...(block.items || []), "New list point"];
                              handleUpdateBlock(idx, { items: nextItems });
                            }}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-1"
                          >
                            <Plus className="size-3" /> Add List Item
                          </button>
                        </div>
                      ) : (
                        <textarea
                          rows={4}
                          value={block.text || ""}
                          onChange={(e) => handleUpdateBlock(idx, { text: e.target.value, html: undefined })}
                          placeholder="Paragraph text..."
                          className="w-full rounded-xl border border-white/15 bg-white/5 p-3.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none leading-relaxed"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Block Toolbar */}
                <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-4 text-center">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    + Add Content Block
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddBlock("p")}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15 hover:text-white transition"
                    >
                      <AlignLeft className="size-3.5 text-blue-400" /> Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("h2")}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15 hover:text-white transition"
                    >
                      <Heading className="size-3.5 text-blue-400" /> Heading 2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("h3")}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15 hover:text-white transition"
                    >
                      <Heading className="size-3.5 text-blue-400" /> Heading 3
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("ul")}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15 hover:text-white transition"
                    >
                      <List className="size-3.5 text-blue-400" /> Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBlock("blockquote")}
                      className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15 hover:text-white transition"
                    >
                      <Quote className="size-3.5 text-blue-400" /> Callout Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Save Bar */}
              <div className="sticky bottom-6 z-40 rounded-2xl border border-white/20 bg-[#0f2142]/95 backdrop-blur-xl p-4 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/20 transition"
                  >
                    <Eye className="size-4" /> Live Preview
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {currentPost.status === "scheduled" ? (
                    <Button
                      onClick={() => handleSave("scheduled")}
                      disabled={isSaving}
                      className="rounded-full bg-blue-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition gap-2"
                    >
                      {isSaving ? <Loader2 className="size-4 animate-spin" /> : <CalendarClock className="size-4" />}
                      <span>Save &amp; Schedule Post</span>
                    </Button>
                  ) : currentPost.status === "draft" ? (
                    <Button
                      onClick={() => handleSave("draft")}
                      disabled={isSaving}
                      className="rounded-full bg-amber-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-amber-500 hover:scale-105 transition gap-2"
                    >
                      {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                      <span>Save Draft</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSave("published")}
                      disabled={isSaving}
                      className="rounded-full bg-emerald-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-emerald-500 hover:scale-105 transition gap-2"
                    >
                      {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                      <span>Publish Blog Post</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* TAB 3: LIVE PREVIEW */}
      {activeTab === "preview" && (
        <div className="bg-white text-[#1c2d42]">
          {/* Top Preview Status Bar */}
          <div className="bg-[#0b172e] text-white border-b border-white/10 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-full bg-blue-500/20 border border-blue-400/40 px-3 py-1 font-bold uppercase tracking-wider text-blue-300">
                Live Preview Mode
              </span>
              <span className="text-slate-400">
                {currentPost.status === "scheduled"
                  ? `Scheduled for: ${new Date(currentPost.publishDate || "").toLocaleString()}`
                  : currentPost.status === "draft"
                  ? "Draft (Not Live)"
                  : "Status: Published"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setActiveTab("edit")}
                size="sm"
                className="rounded-full bg-white text-[#0b172e] hover:bg-slate-100 font-bold text-xs"
              >
                <Edit3 className="mr-1.5 size-3.5" /> Return to Editor
              </Button>
            </div>
          </div>

          {/* Exact SMG BlogPostView Component */}
          <BlogPostView post={currentPost} />
        </div>
      )}
    </div>
  );
}
