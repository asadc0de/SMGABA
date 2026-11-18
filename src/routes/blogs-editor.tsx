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
  Table as TableIcon,
  Columns3,
  Rows3,
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
  Link2,
  ListOrdered,
  Lightbulb,
  AlertTriangle,
  Bookmark,
  TrendingUp,
  Minus,
  Library,
  Pilcrow,
  HelpCircle,
  BarChart3,
  Palette,
  Highlighter,
  RotateCcw,
} from "lucide-react";
import {
  getAdminBlogs,
  saveBlogPost,
  deleteBlogPost,
  type ExtendedBlogPost,
} from "@/lib/blogs.server";
import { uploadCmsImage } from "@/lib/cms.server";
import { BlogPostView } from "@/components/site/BlogPostView";
import { linksToHtml, htmlToLinks, markdownToHtml, escapeHtml, cleanWordHtml } from "@/lib/blogLinks";
import { type ContentBlock } from "@/data/blogPosts";
import { MediaImageInput, MediaImagePickerModal } from "@/components/admin/MediaImagePickerModal";
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
    url: "/images/stock/unsplash-photo-1554224155-8d04cb21cd6c.webp",
  },
  {
    label: "Executive Strategic Planning",
    url: "/images/stock/unsplash-photo-1454165804606-c3d57bc86b40.webp",
  },
  {
    label: "Financial Analytics & Charts",
    url: "/images/stock/unsplash-photo-1460925895917-afdab827c52f.webp",
  },
  {
    label: "Hospitality & Restaurant Finance",
    url: "/images/stock/unsplash-photo-1517248135467-4c7edcad34c4.webp",
  },
  {
    label: "Corporate Office & Real Estate",
    url: "/images/stock/unsplash-photo-1486406146926-c627a92ad1ab.webp",
  },
  {
    label: "Tax Planning & Compliance",
    url: "/images/stock/unsplash-photo-1586486855514-8c633cc6fd38.webp",
  },
];

function preparePostForEditor(post: ExtendedBlogPost): ExtendedBlogPost {
  const cloned: ExtendedBlogPost = JSON.parse(JSON.stringify(post));
  if (Array.isArray(cloned.blocks)) {
    cloned.blocks = cloned.blocks.map((block) => {
      if (block.type === "p") {
        let text = block.text || "";
        // Clean out any raw HTML tags from text
        if (/<[a-z][\s\S]*>/i.test(text)) {
          text = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        }
        text = text.replace(/&#39;|&amp;#39;/g, "'");

        let html = block.html || "";
        if (html && html.includes("<")) {
          html = cleanWordHtml(html);
        } else if (text) {
          html = linksToHtml(text);
        }
        html = html.replace(/&#39;|&amp;#39;/g, "'");

        return {
          ...block,
          text,
          html,
        };
      }
      if (block.type === "ul" || block.type === "ol") {
        const items = (block.items || []).map((item) => {
          let cleaned = cleanWordHtml(item).replace(/&#39;|&amp;#39;/g, "'");
          return htmlToLinks(cleaned);
        });
        return { ...block, items };
      }
      if (block.type === "table") {
        const headers = (block.headers || []).map((h) => htmlToLinks(cleanWordHtml(h).replace(/&#39;|&amp;#39;/g, "'")));
        const rows = (block.rows || []).map((row) => row.map((cell) => htmlToLinks(cleanWordHtml(cell).replace(/&#39;|&amp;#39;/g, "'"))));
        return { ...block, headers, rows };
      }
      return block;
    });
  }
  return cloned;
}

function createBlankPost(): ExtendedBlogPost {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const nextWeekIso = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16);

  const introText = "Introduce the key strategic topic or financial challenge your clients are facing. Explain why this insight is critical for proactive business leadership.";
  const detailsText = "Dive into the actionable details. Provide data, real-world benchmarks, and clear explanations that assist business owners in making informed financial decisions.";

  return {
    id: `blog-${Date.now()}`,
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    h1: "",
    date: dateFormatted,
    publishDate: undefined,
    author: "SMG Advisory Team",
    category: "Bookkeeping",
    image: SAMPLE_IMAGES[0].url,
    readTime: "4 min read",
    excerpt: "",
    status: "published",
    destination: "blog",
    archived: false,
    isCustom: true,
    blocks: [
      {
        type: "p",
        text: introText,
        html: linksToHtml(introText),
      },
      {
        type: "h2",
        text: "1. Key Industry Insights & Strategic Analysis",
      },
      {
        type: "p",
        text: detailsText,
        html: linksToHtml(detailsText),
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

function parseFullArticleText(
  rawText: string,
  mode: "smart" | "single"
): ContentBlock[] {
  if (!rawText || !rawText.trim()) return [];

  const trimmed = rawText.trim();
  if (mode === "single") {
    return [
      {
        type: "p",
        text: trimmed,
        html: linksToHtml(trimmed),
      },
    ];
  }

  // Smart Mode: split into sections separated by blank line(s)
  const rawSections = trimmed
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const blocks: ContentBlock[] = [];

  for (const section of rawSections) {
    const lines = section.split("\n").map((l) => l.trim()).filter(Boolean);

    // 1. Check if all lines are bullet points (*, -, •)
    if (lines.length > 0 && lines.every((l) => /^[-*•]\s+/.test(l))) {
      blocks.push({
        type: "ul",
        items: lines.map((l) => htmlToLinks(l.replace(/^[-*•]\s+/, ""))),
      });
      continue;
    }

    // 2. Check if all lines are numbered list items (1., 2., 1))
    if (lines.length > 0 && lines.every((l) => /^\d+[\.\)]\s+/.test(l))) {
      blocks.push({
        type: "ol",
        items: lines.map((l) => htmlToLinks(l.replace(/^\d+[\.\)]\s+/, ""))),
      });
      continue;
    }

    // 3. Single line checks
    if (lines.length === 1) {
      const line = lines[0];

      if (line.startsWith("### ")) {
        blocks.push({
          type: "h3",
          text: line.replace(/^###\s+/, "").replace(/^[#\s]+/, ""),
        });
        continue;
      }

      if (line.startsWith("## ") || line.startsWith("# ")) {
        blocks.push({
          type: "h2",
          text: line.replace(/^#{1,2}\s+/, "").replace(/^[#\s]+/, ""),
        });
        continue;
      }

      if (line.startsWith("#### ")) {
        blocks.push({
          type: "h4",
          text: line.replace(/^####\s+/, ""),
        });
        continue;
      }

      if (line.startsWith("> ")) {
        blocks.push({
          type: "blockquote",
          text: line.replace(/^>\s+/, ""),
        });
        continue;
      }

      // Check for standalone headings like "1. Introduction" or short capitalized lines
      if (
        line.length <= 90 &&
        (/^(\d+[\.\)]|[A-Z][\.\)])\s+[A-Za-z0-9]/.test(line) ||
          (!/[.?!;:]$/.test(line) && /^[A-Z0-9]/.test(line) && line.split(" ").length <= 10))
      ) {
        blocks.push({
          type: "h2",
          text: line,
        });
        continue;
      }
    }

    // 4. Blockquote block with multiple lines
    if (lines.every((l) => l.startsWith("> "))) {
      blocks.push({
        type: "blockquote",
        text: lines.map((l) => l.replace(/^>\s*/, "")).join(" "),
      });
      continue;
    }

    // 5. Standard paragraph (multi-line or single line)
    blocks.push({
      type: "p",
      text: section,
      html: linksToHtml(section),
    });
  }

  return blocks;
}

function blocksToHtml(blocks: ContentBlock[]): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "<p><br></p>";

  const htmlChunks: string[] = [];

  for (const block of blocks) {
    if (block.type === "h2") {
      htmlChunks.push(`<h2>${escapeHtml(block.text || "")}</h2>`);
    } else if (block.type === "h3") {
      htmlChunks.push(`<h3>${escapeHtml(block.text || "")}</h3>`);
    } else if (block.type === "h4") {
      htmlChunks.push(`<h4>${escapeHtml(block.text || "")}</h4>`);
    } else if (block.type === "blockquote") {
      htmlChunks.push(`<blockquote>${escapeHtml(block.text || "")}</blockquote>`);
    } else if (block.type === "divider") {
      htmlChunks.push(`<hr>`);
    } else if (block.type === "ul") {
      const lis = (block.items || []).map((item) => `<li>${markdownToHtml(item)}</li>`).join("");
      htmlChunks.push(`<ul>${lis}</ul>`);
    } else if (block.type === "ol") {
      const lis = (block.items || []).map((item) => `<li>${markdownToHtml(item)}</li>`).join("");
      htmlChunks.push(`<ol>${lis}</ol>`);
    } else if (block.type === "image") {
      htmlChunks.push(`
        <figure class="article-image group relative my-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 text-center" contenteditable="false" data-block-type="image">
          <div class="component-controls absolute top-4 right-4 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
            <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-bold shadow-sm transition cursor-pointer" title="Delete Image">
              <span>✕ Delete Image</span>
            </button>
          </div>
          <img src="${escapeHtml(block.url || "")}" alt="${escapeHtml(block.alt || "")}" class="rounded-xl w-full max-h-96 object-cover mx-auto" />
          <figcaption class="mt-2 text-xs text-slate-500 font-medium italic cursor-text" contenteditable="true">${escapeHtml(block.caption || "Click to add caption...")}</figcaption>
        </figure><p><br></p>
      `);
    } else if (block.type === "callout") {
      htmlChunks.push(`
        <div class="article-callout group relative my-6 p-4 rounded-2xl border border-blue-200 bg-blue-50/70" data-block-type="callout">
          <div class="component-controls absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/90 px-2 py-0.5 rounded-md">Advisory Box</span>
            <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-semibold shadow-2xs transition cursor-pointer" title="Delete Advisory Box">
              <span>✕ Delete</span>
            </button>
          </div>
          <h4 class="callout-title font-bold text-sm text-[#0f2142] flex items-center gap-1.5 mb-1 cursor-text pr-28" contenteditable="true">💡 ${escapeHtml(block.title || "Advisory Note")}</h4>
          <p class="callout-text text-xs sm:text-sm text-slate-700 leading-relaxed cursor-text" contenteditable="true">${escapeHtml(block.text || "")}</p>
        </div><p><br></p>
      `);
    } else if (block.type === "stat") {
      htmlChunks.push(`
        <div class="article-stat group relative my-6 p-5 rounded-2xl border border-indigo-200 bg-indigo-50/60" data-block-type="stat">
          <div class="component-controls absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/90 px-2 py-0.5 rounded-md">Metric Card</span>
            <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-semibold shadow-2xs transition cursor-pointer" title="Delete Metric Card">
              <span>✕ Delete</span>
            </button>
          </div>
          <span class="stat-number font-serif-hero text-2xl sm:text-3xl font-bold text-navy block mb-1 cursor-text" contenteditable="true">${escapeHtml(block.statNumber || "")}</span>
          <span class="stat-label text-xs sm:text-sm text-slate-600 block cursor-text" contenteditable="true">${escapeHtml(block.statLabel || "")}</span>
        </div><p><br></p>
      `);
    } else if (block.type === "table") {
      const headers = (block.headers || []).map((h) => `<th class="p-2.5 border border-slate-300 bg-[#0e1b36] text-white text-xs font-semibold cursor-text" contenteditable="true">${escapeHtml(h)}</th>`).join("");
      const rows = (block.rows || []).map((row) => `<tr>${row.map((cell) => `<td class="p-2.5 border border-slate-200 text-xs text-slate-800 cursor-text" contenteditable="true">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
      htmlChunks.push(`
        <div class="article-table-container group relative my-6 rounded-xl border border-slate-200 overflow-hidden shadow-2xs" data-block-type="table">
          <div class="component-controls flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-2 px-3 border-b border-slate-200 select-none text-xs" contenteditable="false">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1 mr-1">📊 Table:</span>
              <span class="table-active-cell-badge inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200">
                Click a cell to target
              </span>

              <!-- ROW BY-CELL ACTIONS -->
              <div class="inline-flex items-center gap-1 bg-white p-0.5 px-1.5 rounded-lg border border-slate-300 shadow-2xs">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Row:</span>
                <button type="button" class="table-add-row-above-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Row ABOVE the selected cell">
                  + Above
                </button>
                <button type="button" class="table-add-row-below-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Row BELOW the selected cell">
                  + Below
                </button>
                <button type="button" class="table-del-this-row-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-[11px] font-bold border border-red-200 transition cursor-pointer" title="DELETE this specific row">
                  ✕ Del Row
                </button>
              </div>

              <!-- COL BY-CELL ACTIONS -->
              <div class="inline-flex items-center gap-1 bg-white p-0.5 px-1.5 rounded-lg border border-slate-300 shadow-2xs">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Col:</span>
                <button type="button" class="table-add-col-left-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Column to the LEFT of the selected cell">
                  + Left
                </button>
                <button type="button" class="table-add-col-right-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Column to the RIGHT of the selected cell">
                  + Right
                </button>
                <button type="button" class="table-del-this-col-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-[11px] font-bold border border-red-200 transition cursor-pointer" title="DELETE this specific column">
                  ✕ Del Col
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-semibold shadow-2xs transition cursor-pointer" title="Delete Entire Table">
                <span>🗑️ Delete Table</span>
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-left">
              <thead><tr>${headers}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div><p><br></p>
      `);
    } else if (block.type === "divider") {
      htmlChunks.push(`
        <div class="article-divider-wrap group relative my-8 py-2 text-center" data-block-type="divider">
          <div class="component-controls absolute right-2 -top-3.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
            <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-[11px] font-semibold shadow-2xs transition cursor-pointer" title="Delete Divider">
              <span>✕ Delete Divider</span>
            </button>
          </div>
          <hr class="border-t-2 border-dashed border-slate-300" />
        </div><p><br></p>
      `);
    } else {
      // p or richtext: prioritize rich HTML if present to preserve <a>, <strong>, <em>, <i>, <u>
      if (block.html && block.html.includes("<")) {
        const cleaned = cleanWordHtml(block.html);
        if (/^<(p|div|blockquote|h[1-6])/i.test(cleaned.trim())) {
          htmlChunks.push(cleaned);
        } else {
          htmlChunks.push(`<p>${cleaned}</p>`);
        }
      } else {
        const rawText = block.text || "";
        const paras = rawText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
        if (paras.length > 1) {
          for (const p of paras) {
            htmlChunks.push(`<p>${markdownToHtml(p)}</p>`);
          }
        } else {
          htmlChunks.push(`<p>${markdownToHtml(rawText || "<br>")}</p>`);
        }
      }
    }
  }

  return htmlChunks.join("");
}

function parseHtmlToBlocks(html: string): ContentBlock[] {
  if (typeof window === "undefined" || !html) {
    return [{ type: "p", text: html || "", html: html || "" }];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html");
  // Remove editor-only controls (like Delete buttons and badges) before parsing
  doc.body.querySelectorAll(".component-controls, .delete-component-btn").forEach((el) => el.remove());
  doc.body.querySelectorAll(".active-table-cell").forEach((el) => el.classList.remove("active-table-cell"));
  const nodes = Array.from(doc.body.childNodes);
  const blocks: ContentBlock[] = [];

  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({
          type: "p",
          text,
          html: linksToHtml(text),
        });
      }
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // Skip empty dummy elements like <p><br></p>
    if ((tagName === "p" || tagName === "div") && (!el.textContent?.trim() && !el.querySelector("img, table, hr"))) {
      continue;
    }

    if (tagName === "h2") {
      blocks.push({ type: "h2", text: el.textContent?.trim() || "" });
    } else if (tagName === "h3") {
      blocks.push({ type: "h3", text: el.textContent?.trim() || "" });
    } else if (tagName === "h4") {
      blocks.push({ type: "h4", text: el.textContent?.trim() || "" });
    } else if (tagName === "blockquote") {
      blocks.push({ type: "blockquote", text: el.textContent?.trim() || "" });
    } else if (tagName === "hr" || el.getAttribute("data-block-type") === "divider" || el.querySelector("hr")) {
      blocks.push({ type: "divider" });
    } else if (tagName === "ul") {
      const items = Array.from(el.querySelectorAll("li"))
        .map((li) => li.innerHTML.trim())
        .filter(Boolean);
      if (items.length > 0) {
        blocks.push({ type: "ul", items });
      }
    } else if (tagName === "ol") {
      const items = Array.from(el.querySelectorAll("li"))
        .map((li) => li.innerHTML.trim())
        .filter(Boolean);
      if (items.length > 0) {
        blocks.push({ type: "ol", items });
      }
    } else if (tagName === "figure" || el.classList.contains("article-image") || tagName === "img" || el.querySelector("img")) {
      const img = tagName === "img" ? (el as HTMLImageElement) : el.querySelector("img");
      const caption = el.querySelector("figcaption")?.textContent?.trim() || "";
      if (img?.getAttribute("src")) {
        blocks.push({
          type: "image",
          url: img.getAttribute("src") || "",
          alt: img.getAttribute("alt") || "",
          caption: caption || undefined,
          size: "full",
        });
      }
    } else if (el.classList.contains("article-callout") || el.getAttribute("data-block-type") === "callout") {
      const title = el.querySelector("h4, strong, .callout-title")?.textContent?.replace(/^[💡\s]+/, "").trim() || "Advisory Note";
      const text = el.querySelector("p, .callout-text")?.textContent?.trim() || el.textContent?.trim() || "";
      blocks.push({
        type: "callout",
        calloutType: "tip",
        title,
        text,
      });
    } else if (el.classList.contains("article-stat") || el.getAttribute("data-block-type") === "stat") {
      const statNumber = el.querySelector(".stat-number")?.textContent?.trim() || "85%";
      const statLabel = el.querySelector(".stat-label")?.textContent?.trim() || "";
      blocks.push({
        type: "stat",
        statNumber,
        statLabel,
      });
    } else if (tagName === "table" || el.querySelector("table")) {
      const table = tagName === "table" ? (el as HTMLTableElement) : el.querySelector("table")!;
      const headerThs = Array.from(table.querySelectorAll("thead th, tr:first-child th"));
      const headers = headerThs.map((th) => th.textContent?.trim() || "");
      const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
      const effectiveRows = bodyRows.length > 0 ? bodyRows : Array.from(table.querySelectorAll("tr")).slice(headers.length > 0 ? 1 : 0);
      const rows = effectiveRows.map((tr) => Array.from(tr.querySelectorAll("td")).map((td) => td.textContent?.trim() || ""));
      blocks.push({
        type: "table",
        hasHeader: headers.length > 0,
        headers: headers.length > 0 ? headers : ["Column 1", "Column 2"],
        rows: rows.length > 0 ? rows : [["Data 1", "Data 2"]],
      });
    } else {
      // General paragraph or div
      const innerHtml = cleanWordHtml(el.innerHTML.trim());
      const textContent = (el.textContent?.trim() || "").replace(/&#39;|&amp;#39;/g, "'");
      if (textContent || innerHtml) {
        blocks.push({
          type: "p",
          text: textContent,
          html: innerHtml,
        });
      }
    }
  }

  return blocks.length > 0 ? blocks : [{ type: "p", text: "" }];
}

function blocksToDocumentText(blocks: ContentBlock[]): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";

  const sections: string[] = [];

  for (const block of blocks) {
    if (block.type === "h2") {
      if (block.text?.trim()) sections.push(`## ${block.text.trim()}`);
    } else if (block.type === "h3") {
      if (block.text?.trim()) sections.push(`### ${block.text.trim()}`);
    } else if (block.type === "h4") {
      if (block.text?.trim()) sections.push(`#### ${block.text.trim()}`);
    } else if (block.type === "blockquote") {
      if (block.text?.trim()) sections.push(`> ${block.text.trim()}`);
    } else if (block.type === "ul") {
      const listText = (block.items || [])
        .map((item) => `* ${htmlToLinks(item)}`)
        .filter(Boolean)
        .join("\n");
      if (listText) sections.push(listText);
    } else if (block.type === "ol") {
      const listText = (block.items || [])
        .map((item, i) => `${i + 1}. ${htmlToLinks(item)}`)
        .filter(Boolean)
        .join("\n");
      if (listText) sections.push(listText);
    } else if (block.type === "callout") {
      if (block.text?.trim()) {
        sections.push(`> **${block.title || "Advisory Note"}:** ${block.text.trim()}`);
      }
    } else if (block.type === "stat") {
      if (block.statNumber || block.statLabel) {
        sections.push(`**${block.statNumber || ""}** - ${block.statLabel || ""}`);
      }
    } else if (block.type === "divider") {
      sections.push(`---`);
    } else if (block.type === "p") {
      const text = (block.text || htmlToLinks(block.html || "")).trim();
      if (text) sections.push(text);
    }
  }

  return sections.join("\n\n");
}

function BlogsEditorPage() {
  const initialData = Route.useLoaderData();
  const [blogsList, setBlogsList] = useState<ExtendedBlogPost[]>(initialData?.blogs || []);

  // Client-side refresh: Always fetch the latest posts from Supabase on mount
  useEffect(() => {
    getAdminBlogs()
      .then((data) => {
        if (data?.blogs && Array.isArray(data.blogs) && data.blogs.length > 0) {
          setBlogsList(data.blogs);
        }
      })
      .catch((err) => {
        console.warn("Could not client-refresh blogs list:", err);
      });
  }, []);

  const [activeTab, setActiveTab] = useState<"list" | "edit" | "preview">("list");
  const [editorSubTab, setEditorSubTab] = useState<"write" | "settings">("write");
  const [currentPost, setCurrentPost] = useState<ExtendedBlogPost>(createBlankPost);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [listPage, setListPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isCustomSlugUnlocked, setIsCustomSlugUnlocked] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [isCoverGalleryModalOpen, setIsCoverGalleryModalOpen] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverImageTab, setCoverImageTab] = useState<"upload" | "presets" | "url">("upload");
  const [isCoverDraggingOver, setIsCoverDraggingOver] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState("");
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const settingsFileInputRef = useRef<HTMLInputElement>(null);

  // Full Article Paste Modal State
  const [isPasteArticleModalOpen, setIsPasteArticleModalOpen] = useState(false);
  const [pasteArticleInput, setPasteArticleInput] = useState("");
  const [pasteMode, setPasteMode] = useState<"smart" | "single">("smart");
  const [pasteAction, setPasteAction] = useState<"append" | "replace">("append");

  // Canvas Mode: "document" (Easy, single visual editor like Word/Medium) vs "blocks" (Custom modular blocks)
  const [canvasMode, setCanvasMode] = useState<"document" | "blocks">("document");
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInlineImageModalOpen, setIsInlineImageModalOpen] = useState(false);
  const [editorWordCount, setEditorWordCount] = useState(0);
  const [editorParagraphCount, setEditorParagraphCount] = useState(0);
  const [lastWysiwygSelection, setLastWysiwygSelection] = useState<Range | null>(null);

  // Text Color & Background Highlight State
  const [activeTextColor, setActiveTextColor] = useState("#0f2142");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isHighlightPickerOpen, setIsHighlightPickerOpen] = useState(false);

  // Table Cell Operations & Context Menu State
  const [activeCellTarget, setActiveCellTarget] = useState<{
    rowIndex: number;
    colIndex: number;
    cell: HTMLElement;
    tr: HTMLTableRowElement;
    table: HTMLTableElement;
  } | null>(null);

  const [tableContextMenu, setTableContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    cell: HTMLElement | null;
    tr: HTMLTableRowElement | null;
    table: HTMLTableElement | null;
    rowIndex: number;
    colIndex: number;
    isHeader: boolean;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    cell: null,
    tr: null,
    table: null,
    rowIndex: 0,
    colIndex: 0,
    isHeader: false,
  });

  const applyTextColor = (color: string) => {
    setActiveTextColor(color);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (typeof window !== "undefined" && lastWysiwygSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(lastWysiwygSelection);
      }
    }
    if (color === "inherit" || !color) {
      try {
        document.execCommand("removeFormat", false);
      } catch {}
    } else {
      try {
        document.execCommand("styleWithCSS", false, "true");
      } catch {}
      document.execCommand("foreColor", false, color);
    }
    handleWysiwygInput();
    setIsColorPickerOpen(false);
  };

  const applyHighlightColor = (color: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (typeof window !== "undefined" && lastWysiwygSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(lastWysiwygSelection);
      }
    }
    if (!color || color === "transparent") {
      try {
        document.execCommand("styleWithCSS", false, "true");
      } catch {}
      try {
        document.execCommand("hiliteColor", false, "transparent");
        document.execCommand("backColor", false, "transparent");
      } catch {}
    } else {
      try {
        document.execCommand("styleWithCSS", false, "true");
      } catch {}
      const ok = document.execCommand("hiliteColor", false, color);
      if (!ok) {
        document.execCommand("backColor", false, color);
      }
    }
    handleWysiwygInput();
    setIsHighlightPickerOpen(false);
  };

  const handleWysiwygInput = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paras = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    setEditorWordCount(words);
    setEditorParagraphCount(paras);
  };

  // Restore editor DOM content whenever switching to 'edit' view or 'write' tab
  useEffect(() => {
    if (activeTab === "edit" && editorSubTab === "write" && canvasMode === "document") {
      const timer = setTimeout(() => {
        if (editorRef.current) {
          const currentHtml = editorRef.current.innerHTML.trim();
          if (
            !currentHtml ||
            currentHtml === "<p><br></p>" ||
            currentHtml === "<br>" ||
            currentHtml === "<p></p>"
          ) {
            if (currentPost.blocks && currentPost.blocks.length > 0) {
              const htmlToSet = blocksToHtml(currentPost.blocks);
              if (htmlToSet && htmlToSet !== "<p><br></p>") {
                editorRef.current.innerHTML = htmlToSet;
                handleWysiwygInput();
              }
            }
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, editorSubTab, canvasMode, currentPost.id]);

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleWysiwygInput();
  };

  const insertHtmlAtCursor = (htmlSnippet: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand("insertHTML", false, htmlSnippet);
    handleWysiwygInput();
  };

  const openInsertLinkForDocument = () => {
    let selectedText = "";
    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setLastWysiwygSelection(selection.getRangeAt(0).cloneRange());
        selectedText = selection.toString();
      }
    }
    setLinkModal({
      isOpen: true,
      blockIndex: -1,
      subType: "document",
      linkText: selectedText || "link text",
      linkUrl: "",
    });
  };

  const deleteCurrentBlockAtCursor = () => {
    if (typeof window === "undefined" || !editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      toast.error("Click inside the paragraph or block you want to delete.");
      return;
    }

    let node: Node | null = selection.anchorNode;
    if (!node) return;

    // Check if inside a component (table, callout, stat, figure, divider)
    const elNode = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement) as HTMLElement | null;
    const component = elNode?.closest?.("[data-block-type], figure, .article-divider-wrap, .article-table-container");
    if (component && editorRef.current.contains(component)) {
      component.remove();
      handleWysiwygInput();
      toast.success("Component deleted successfully!");
      return;
    }

    // Check if inside an LI
    const li = elNode?.closest?.("li");
    if (li && editorRef.current.contains(li)) {
      const parentList = li.parentElement;
      if (parentList && parentList.children.length > 1) {
        li.remove();
        handleWysiwygInput();
        toast.success("Bullet item deleted!");
        return;
      }
    }

    // Walk up to find the immediate child inside editorRef.current
    while (node && node.parentNode && node.parentNode !== editorRef.current) {
      node = node.parentNode;
    }

    if (node && node.parentNode === editorRef.current) {
      const el = node as HTMLElement;
      el.remove();
      handleWysiwygInput();
      toast.success("Deleted paragraph / section!");
    } else {
      toast.error("Click inside the paragraph or section you want to delete.");
    }
  };

  const insertRowAbove = (targetTr: HTMLTableRowElement, targetTable: HTMLTableElement) => {
    const colCount = targetTable.querySelectorAll("thead th").length || targetTr.children.length || 3;
    const newTr = document.createElement("tr");
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.className = "p-2.5 border border-slate-200 text-xs cursor-text";
      td.contentEditable = "true";
      td.textContent = "New cell";
      newTr.appendChild(td);
    }
    targetTr.before(newTr);
    handleWysiwygInput();
    toast.success("Row inserted above!");
  };

  const insertRowBelow = (targetTr: HTMLTableRowElement, targetTable: HTMLTableElement) => {
    const colCount = targetTable.querySelectorAll("thead th").length || targetTr.children.length || 3;
    const newTr = document.createElement("tr");
    for (let i = 0; i < colCount; i++) {
      const td = document.createElement("td");
      td.className = "p-2.5 border border-slate-200 text-xs cursor-text";
      td.contentEditable = "true";
      td.textContent = "New cell";
      newTr.appendChild(td);
    }
    targetTr.after(newTr);
    handleWysiwygInput();
    toast.success("Row inserted below!");
  };

  const deleteSpecificRow = (targetTr: HTMLTableRowElement, targetTable: HTMLTableElement) => {
    const tbody = targetTable.querySelector("tbody") || targetTable;
    const rows = tbody.querySelectorAll("tr");
    if (rows.length > 1) {
      targetTr.remove();
      setActiveCellTarget(null);
      handleWysiwygInput();
      toast.success("Row deleted!");
    } else {
      toast.error("Table must have at least one row.");
    }
  };

  const insertColumnLeft = (colIdx: number, targetTable: HTMLTableElement) => {
    const theadRow = targetTable.querySelector("thead tr");
    if (theadRow) {
      const th = document.createElement("th");
      th.className = "p-2.5 border border-slate-300 text-xs font-semibold cursor-text bg-[#0e1b36] text-white";
      th.contentEditable = "true";
      th.textContent = `Header`;
      const refTh = theadRow.children[colIdx];
      if (refTh) theadRow.insertBefore(th, refTh);
      else theadRow.appendChild(th);
    }
    const tbodyRows = targetTable.querySelectorAll("tbody tr");
    tbodyRows.forEach((tr) => {
      const td = document.createElement("td");
      td.className = "p-2.5 border border-slate-200 text-xs cursor-text";
      td.contentEditable = "true";
      td.textContent = "Cell";
      const refTd = tr.children[colIdx];
      if (refTd) tr.insertBefore(td, refTd);
      else tr.appendChild(td);
    });
    handleWysiwygInput();
    toast.success("Column inserted on left!");
  };

  const insertColumnRight = (colIdx: number, targetTable: HTMLTableElement) => {
    const theadRow = targetTable.querySelector("thead tr");
    if (theadRow) {
      const th = document.createElement("th");
      th.className = "p-2.5 border border-slate-300 text-xs font-semibold cursor-text bg-[#0e1b36] text-white";
      th.contentEditable = "true";
      th.textContent = `Header`;
      const refTh = theadRow.children[colIdx];
      if (refTh && refTh.nextSibling) theadRow.insertBefore(th, refTh.nextSibling);
      else theadRow.appendChild(th);
    }
    const tbodyRows = targetTable.querySelectorAll("tbody tr");
    tbodyRows.forEach((tr) => {
      const td = document.createElement("td");
      td.className = "p-2.5 border border-slate-200 text-xs cursor-text";
      td.contentEditable = "true";
      td.textContent = "Cell";
      const refTd = tr.children[colIdx];
      if (refTd && refTd.nextSibling) tr.insertBefore(td, refTd.nextSibling);
      else tr.appendChild(td);
    });
    handleWysiwygInput();
    toast.success("Column inserted on right!");
  };

  const deleteSpecificColumn = (colIdx: number, targetTable: HTMLTableElement) => {
    const theadRow = targetTable.querySelector("thead tr");
    const colCount = theadRow ? theadRow.children.length : targetTable.querySelector("tr")?.children.length || 0;
    if (colCount > 1) {
      if (theadRow && theadRow.children[colIdx]) {
        theadRow.children[colIdx].remove();
      }
      const tbodyRows = targetTable.querySelectorAll("tbody tr");
      tbodyRows.forEach((tr) => {
        if (tr.children[colIdx]) tr.children[colIdx].remove();
      });
      setActiveCellTarget(null);
      handleWysiwygInput();
      toast.success("Column deleted!");
    } else {
      toast.error("Table must have at least one column.");
    }
  };

  const handleEditorContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const cell = target.closest("td, th") as HTMLElement | null;
    if (cell && editorRef.current?.contains(cell)) {
      e.preventDefault();
      const tr = cell.closest("tr") as HTMLTableRowElement;
      const table = cell.closest("table") as HTMLTableElement;
      if (!tr || !table) return;

      const isHeader = cell.tagName.toLowerCase() === "th";
      const colIndex = Array.from(tr.children).indexOf(cell);
      const allTrs = Array.from(table.querySelectorAll("tbody tr"));
      const rowIndex = isHeader ? -1 : allTrs.indexOf(tr);

      setActiveCellTarget({ rowIndex, colIndex, cell, tr, table });
      setTableContextMenu({
        isOpen: true,
        x: Math.min(e.clientX, typeof window !== "undefined" ? window.innerWidth - 230 : e.clientX),
        y: Math.min(e.clientY, typeof window !== "undefined" ? window.innerHeight - 320 : e.clientY),
        cell,
        tr,
        table,
        rowIndex,
        colIndex,
        isHeader,
      });
    } else {
      setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsColorPickerOpen(false);
    setIsHighlightPickerOpen(false);
    setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
    const target = e.target as HTMLElement;

    // Detect cell click for active cell indicator/toolbar
    const cell = target.closest("td, th") as HTMLElement | null;
    if (cell && editorRef.current?.contains(cell)) {
      // Clear previous active cells
      editorRef.current.querySelectorAll(".active-table-cell").forEach((el) => {
        el.classList.remove("active-table-cell");
      });
      cell.classList.add("active-table-cell");

      const tr = cell.closest("tr") as HTMLTableRowElement;
      const table = cell.closest("table") as HTMLTableElement;
      if (tr && table) {
        const isHeader = cell.tagName.toLowerCase() === "th";
        const colIndex = Array.from(tr.children).indexOf(cell);
        const allTrs = Array.from(table.querySelectorAll("tbody tr"));
        const rowIndex = isHeader ? -1 : allTrs.indexOf(tr);
        setActiveCellTarget({ rowIndex, colIndex, cell, tr, table });

        const container = table.closest(".article-table-container");
        const badge = container?.querySelector(".table-active-cell-badge");
        if (badge) {
          const rowName = isHeader ? "Header" : `Row ${rowIndex + 1}`;
          const colName = `Col ${colIndex + 1}`;
          badge.textContent = `🎯 ${rowName}, ${colName} selected`;
          (badge as HTMLElement).className = "table-active-cell-badge inline-flex items-center px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold shadow-xs";
        }
      }
    } else if (!target.closest(".table-cell-action-btn, .table-context-menu, .table-action-pill, .component-controls")) {
      // Clicked outside table
    }

    // 1. Table: Add Row Above
    const addRowAboveBtn = target.closest(".table-add-row-above-btn");
    if (addRowAboveBtn) {
      e.preventDefault();
      e.stopPropagation();
      const container = addRowAboveBtn.closest(".article-table-container");
      const table = container?.querySelector("table");
      if (table) {
        const activeCell = container?.querySelector(".active-table-cell") || editorRef.current?.querySelector(".active-table-cell");
        const targetTr = (activeCell ? activeCell.closest("tr") : null) as HTMLTableRowElement || table.querySelector("tbody tr") as HTMLTableRowElement || table.querySelector("tr") as HTMLTableRowElement;
        if (targetTr) {
          insertRowAbove(targetTr, table);
        }
      }
      return;
    }

    // 2. Table: Add Row Below (or standard Add Row)
    const addRowBelowBtn = target.closest(".table-add-row-below-btn, .table-add-row-btn");
    if (addRowBelowBtn) {
      e.preventDefault();
      e.stopPropagation();
      const container = addRowBelowBtn.closest(".article-table-container");
      const table = container?.querySelector("table");
      if (table) {
        const activeCell = container?.querySelector(".active-table-cell") || editorRef.current?.querySelector(".active-table-cell");
        const targetTr = (activeCell ? activeCell.closest("tr") : null) as HTMLTableRowElement || table.querySelector("tbody tr:last-child") as HTMLTableRowElement || table.querySelector("tr:last-child") as HTMLTableRowElement;
        if (targetTr) {
          insertRowBelow(targetTr, table);
        }
      }
      return;
    }

    // 3. Table: Delete Row (Specific or Last)
    const delRowBtn = target.closest(".table-del-this-row-btn, .table-del-row-btn");
    if (delRowBtn) {
      e.preventDefault();
      e.stopPropagation();
      const container = delRowBtn.closest(".article-table-container");
      const table = container?.querySelector("table");
      if (table) {
        const activeCell = container?.querySelector(".active-table-cell") || editorRef.current?.querySelector(".active-table-cell");
        let targetTr = (activeCell ? activeCell.closest("tr") : null) as HTMLTableRowElement | null;
        if (targetTr && targetTr.parentElement?.tagName.toLowerCase() === "thead") {
          toast.error("Header row cannot be deleted. Click a data row in the table to delete it.");
          return;
        }
        if (!targetTr) {
          targetTr = (table.querySelector("tbody tr:last-child") || table.querySelector("tr:last-child")) as HTMLTableRowElement | null;
        }
        if (targetTr) {
          deleteSpecificRow(targetTr, table);
        }
      }
      return;
    }

    // 4. Table: Add Column Left
    const addColLeftBtn = target.closest(".table-add-col-left-btn");
    if (addColLeftBtn) {
      e.preventDefault();
      e.stopPropagation();
      const container = addColLeftBtn.closest(".article-table-container");
      const table = container?.querySelector("table");
      if (table) {
        const activeCell = container?.querySelector(".active-table-cell") || editorRef.current?.querySelector(".active-table-cell");
        const colIdx = activeCell ? Array.from(activeCell.parentElement?.children || []).indexOf(activeCell) : 0;
        insertColumnLeft(Math.max(0, colIdx), table);
      }
      return;
    }

    // 5. Table: Add Column Right (or standard Add Col)
    const addColRightBtn = target.closest(".table-add-col-right-btn, .table-add-col-btn");
    if (addColRightBtn) {
      e.preventDefault();
      e.stopPropagation();
      const container = addColRightBtn.closest(".article-table-container");
      const table = container?.querySelector("table");
      if (table) {
        const activeCell = container?.querySelector(".active-table-cell") || editorRef.current?.querySelector(".active-table-cell");
        const lastIdx = (table.querySelector("thead tr")?.children.length || 1) - 1;
        const colIdx = activeCell ? Array.from(activeCell.parentElement?.children || []).indexOf(activeCell) : lastIdx;
        insertColumnRight(Math.max(0, colIdx), table);
      }
      return;
    }

    // 6. Table: Delete Column (Specific or Last)
    const delColBtn = target.closest(".table-del-this-col-btn, .table-del-col-btn");
    if (delColBtn) {
      e.preventDefault();
      e.stopPropagation();
      const container = delColBtn.closest(".article-table-container");
      const table = container?.querySelector("table");
      if (table) {
        const activeCell = container?.querySelector(".active-table-cell") || editorRef.current?.querySelector(".active-table-cell");
        const lastIdx = (table.querySelector("thead tr")?.children.length || 1) - 1;
        const colIdx = activeCell ? Array.from(activeCell.parentElement?.children || []).indexOf(activeCell) : lastIdx;
        deleteSpecificColumn(Math.max(0, colIdx), table);
      }
      return;
    }

    // 5. Delete Component (Table, Callout, Stat, Image, Divider)
    const deleteBtn = target.closest(".delete-component-btn");
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const component = deleteBtn.closest("[data-block-type], figure, .article-divider-wrap, .article-table-container");
      if (component) {
        component.remove();
        handleWysiwygInput();
        toast.success("Component deleted successfully!");
      }
      return;
    }
  };

  const insertParagraphIntoEditor = () => {
    insertHtmlAtCursor("<p>New paragraph text... Click here to type.</p><p><br></p>");
    toast.success("Paragraph added!");
  };

  const insertBulletListIntoEditor = () => {
    insertHtmlAtCursor("<ul><li>Bullet point item 1</li><li>Bullet point item 2</li></ul><p><br></p>");
    toast.success("Bullet list added!");
  };

  const insertNumberedListIntoEditor = () => {
    insertHtmlAtCursor("<ol><li>Step 1 description</li><li>Step 2 description</li></ol><p><br></p>");
    toast.success("Numbered list added!");
  };

  const insertImageIntoEditor = (url: string, alt: string = "Article image", caption: string = "") => {
    const snippet = `
      <figure class="article-image group relative my-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 text-center" contenteditable="false" data-block-type="image">
        <div class="component-controls absolute top-4 right-4 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
          <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-bold shadow-sm transition cursor-pointer" title="Delete Image">
            <span>✕ Delete Image</span>
          </button>
        </div>
        <img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" class="rounded-xl w-full max-h-96 object-cover mx-auto" />
        <figcaption class="mt-2 text-xs text-slate-500 font-medium italic cursor-text" contenteditable="true">${escapeHtml(caption || "Click to add caption...")}</figcaption>
      </figure><p><br></p>
    `;
    insertHtmlAtCursor(snippet);
    toast.success("Image added to article!");
  };

  const insertCalloutIntoEditor = () => {
    const snippet = `
      <div class="article-callout group relative my-6 p-4 rounded-2xl border border-blue-200 bg-blue-50/80" data-block-type="callout">
        <div class="component-controls absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
          <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/90 px-2 py-0.5 rounded-md">Advisory Box</span>
          <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-semibold shadow-2xs transition cursor-pointer" title="Delete Advisory Box">
            <span>✕ Delete</span>
          </button>
        </div>
        <h4 class="callout-title font-bold text-sm text-[#0f2142] flex items-center gap-1.5 mb-1 cursor-text pr-28" contenteditable="true">💡 Advisory Note</h4>
        <p class="callout-text text-xs sm:text-sm text-slate-700 leading-relaxed cursor-text" contenteditable="true">Enter your key advisory recommendation or guidance here...</p>
      </div><p><br></p>
    `;
    insertHtmlAtCursor(snippet);
    toast.success("Advisory callout added! Click inside to edit, or click ✕ Delete to remove.");
  };

  const insertStatIntoEditor = () => {
    const snippet = `
      <div class="article-stat group relative my-6 p-5 rounded-2xl border border-indigo-200 bg-indigo-50/70" data-block-type="stat">
        <div class="component-controls absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
          <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/90 px-2 py-0.5 rounded-md">Metric Card</span>
          <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-semibold shadow-2xs transition cursor-pointer" title="Delete Metric Card">
            <span>✕ Delete</span>
          </button>
        </div>
        <span class="stat-number font-serif-hero text-3xl font-bold text-navy block mb-1 cursor-text" contenteditable="true">85%</span>
        <span class="stat-label text-xs sm:text-sm text-slate-600 block cursor-text" contenteditable="true">Of businesses improve cash flow with proactive advisory planning.</span>
      </div><p><br></p>
    `;
    insertHtmlAtCursor(snippet);
    toast.success("Key metric card added! Click number or text to edit, or click ✕ Delete to remove.");
  };

  const insertTableIntoEditor = () => {
    const snippet = `
      <div class="article-table-container group relative my-6 rounded-xl border border-slate-200 overflow-hidden shadow-2xs" data-block-type="table">
        <div class="component-controls flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-2 px-3 border-b border-slate-200 select-none text-xs" contenteditable="false">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1 mr-1">📊 Table:</span>
            <span class="table-active-cell-badge inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200">
              Click a cell to target
            </span>

            <!-- ROW BY-CELL ACTIONS -->
            <div class="inline-flex items-center gap-1 bg-white p-0.5 px-1.5 rounded-lg border border-slate-300 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Row:</span>
              <button type="button" class="table-add-row-above-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Row ABOVE the selected cell">
                + Above
              </button>
              <button type="button" class="table-add-row-below-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Row BELOW the selected cell">
                + Below
              </button>
              <button type="button" class="table-del-this-row-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-[11px] font-bold border border-red-200 transition cursor-pointer" title="DELETE this specific row">
                ✕ Del Row
              </button>
            </div>

            <!-- COL BY-CELL ACTIONS -->
            <div class="inline-flex items-center gap-1 bg-white p-0.5 px-1.5 rounded-lg border border-slate-300 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Col:</span>
              <button type="button" class="table-add-col-left-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Column to the LEFT of the selected cell">
                + Left
              </button>
              <button type="button" class="table-add-col-right-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer" title="Add Column to the RIGHT of the selected cell">
                + Right
              </button>
              <button type="button" class="table-del-this-col-btn inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-[11px] font-bold border border-red-200 transition cursor-pointer" title="DELETE this specific column">
                ✕ Del Col
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-semibold shadow-2xs transition cursor-pointer" title="Delete Entire Table">
              <span>🗑️ Delete Table</span>
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead class="bg-[#0e1b36] text-white">
              <tr>
                <th class="p-2.5 border border-slate-300 text-xs font-semibold cursor-text" contenteditable="true">Service Metric</th>
                <th class="p-2.5 border border-slate-300 text-xs font-semibold cursor-text" contenteditable="true">Industry Benchmark</th>
                <th class="p-2.5 border border-slate-300 text-xs font-semibold cursor-text" contenteditable="true">SMG Advisory Standard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2.5 border border-slate-200 text-xs cursor-text" contenteditable="true">Monthly Close Speed</td>
                <td class="p-2.5 border border-slate-200 text-xs cursor-text" contenteditable="true">20-25 days</td>
                <td class="p-2.5 border border-slate-200 text-xs font-semibold text-emerald-700 cursor-text" contenteditable="true">5-7 business days</td>
              </tr>
              <tr>
                <td class="p-2.5 border border-slate-200 text-xs cursor-text" contenteditable="true">Prime Cost Audit</td>
                <td class="p-2.5 border border-slate-200 text-xs cursor-text" contenteditable="true">Annual / Reactive</td>
                <td class="p-2.5 border border-slate-200 text-xs font-semibold text-emerald-700 cursor-text" contenteditable="true">Weekly &amp; Monthly Review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div><p><br></p>
    `;
    insertHtmlAtCursor(snippet);
    toast.success("Data table added! Click any cell to edit, or click ✕ Delete Table to remove.");
  };

  const insertDividerIntoEditor = () => {
    const snippet = `
      <div class="article-divider-wrap group relative my-8 py-2 text-center" data-block-type="divider">
        <div class="component-controls absolute right-2 -top-3.5 opacity-90 hover:opacity-100 transition-opacity z-10" contenteditable="false">
          <button type="button" class="delete-component-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-[11px] font-semibold shadow-2xs transition cursor-pointer" title="Delete Divider">
            <span>✕ Delete Divider</span>
          </button>
        </div>
        <hr class="border-t-2 border-dashed border-slate-300" />
      </div><p><br></p>
    `;
    insertHtmlAtCursor(snippet);
    toast.success("Section divider added!");
  };

  // Link Insertion Modal State
  const [linkModal, setLinkModal] = useState<{
    isOpen: boolean;
    blockIndex: number;
    subType: "p" | "ul" | "ol" | "callout" | "table" | "table-header" | "document";
    itemIndex?: number;
    rowIndex?: number;
    colIndex?: number;
    linkText: string;
    linkUrl: string;
    selectionStart?: number;
    selectionEnd?: number;
  }>({
    isOpen: false,
    blockIndex: -1,
    subType: "p",
    linkText: "",
    linkUrl: "",
  });

  const openInsertLinkForParagraph = (blockIdx: number, textareaEl: HTMLTextAreaElement | null) => {
    let selected = "";
    let start: number | undefined;
    let end: number | undefined;
    if (textareaEl) {
      start = textareaEl.selectionStart;
      end = textareaEl.selectionEnd;
      if (start !== undefined && end !== undefined && start !== end) {
        selected = textareaEl.value.substring(start, end);
      }
    }
    setLinkModal({
      isOpen: true,
      blockIndex: blockIdx,
      subType: "p",
      linkText: selected,
      linkUrl: "",
      selectionStart: start,
      selectionEnd: end,
    });
  };

  const openInsertLinkForBullet = (blockIdx: number, itemIdx: number, inputEl: HTMLInputElement | null) => {
    let selected = "";
    let start: number | undefined;
    let end: number | undefined;
    if (inputEl) {
      start = inputEl.selectionStart ?? undefined;
      end = inputEl.selectionEnd ?? undefined;
      if (start !== undefined && end !== undefined && start !== end) {
        selected = inputEl.value.substring(start, end);
      }
    }
    setLinkModal({
      isOpen: true,
      blockIndex: blockIdx,
      subType: "ul",
      itemIndex: itemIdx,
      linkText: selected,
      linkUrl: "",
      selectionStart: start,
      selectionEnd: end,
    });
  };

  const openInsertLinkForNumberedList = (blockIdx: number, itemIdx: number, inputEl: HTMLInputElement | null) => {
    let selected = "";
    let start: number | undefined;
    let end: number | undefined;
    if (inputEl) {
      start = inputEl.selectionStart ?? undefined;
      end = inputEl.selectionEnd ?? undefined;
      if (start !== undefined && end !== undefined && start !== end) {
        selected = inputEl.value.substring(start, end);
      }
    }
    setLinkModal({
      isOpen: true,
      blockIndex: blockIdx,
      subType: "ol",
      itemIndex: itemIdx,
      linkText: selected,
      linkUrl: "",
      selectionStart: start,
      selectionEnd: end,
    });
  };

  const openInsertLinkForCallout = (blockIdx: number, textareaEl: HTMLTextAreaElement | null) => {
    let selected = "";
    let start: number | undefined;
    let end: number | undefined;
    if (textareaEl) {
      start = textareaEl.selectionStart;
      end = textareaEl.selectionEnd;
      if (start !== undefined && end !== undefined && start !== end) {
        selected = textareaEl.value.substring(start, end);
      }
    }
    setLinkModal({
      isOpen: true,
      blockIndex: blockIdx,
      subType: "callout",
      linkText: selected,
      linkUrl: "",
      selectionStart: start,
      selectionEnd: end,
    });
  };

  const openInsertLinkForTableCell = (
    blockIdx: number,
    rowIdx: number,
    colIdx: number,
    textareaEl: HTMLTextAreaElement | null,
  ) => {
    let selected = "";
    let start: number | undefined;
    let end: number | undefined;
    if (textareaEl) {
      start = textareaEl.selectionStart;
      end = textareaEl.selectionEnd;
      if (start !== undefined && end !== undefined && start !== end) {
        selected = textareaEl.value.substring(start, end);
      }
    }
    setLinkModal({
      isOpen: true,
      blockIndex: blockIdx,
      subType: "table",
      rowIndex: rowIdx,
      colIndex: colIdx,
      linkText: selected,
      linkUrl: "",
      selectionStart: start,
      selectionEnd: end,
    });
  };

  const openInsertLinkForTableHeader = (
    blockIdx: number,
    colIdx: number,
    inputEl: HTMLInputElement | null,
  ) => {
    let selected = "";
    let start: number | undefined;
    let end: number | undefined;
    if (inputEl) {
      start = inputEl.selectionStart ?? undefined;
      end = inputEl.selectionEnd ?? undefined;
      if (start !== undefined && end !== undefined && start !== end) {
        selected = inputEl.value.substring(start, end);
      }
    }
    setLinkModal({
      isOpen: true,
      blockIndex: blockIdx,
      subType: "table-header",
      colIndex: colIdx,
      linkText: selected,
      linkUrl: "",
      selectionStart: start,
      selectionEnd: end,
    });
  };

  const handleApplyLink = () => {
    const {
      blockIndex,
      subType,
      itemIndex,
      rowIndex,
      colIndex,
      linkText,
      linkUrl,
      selectionStart,
      selectionEnd,
    } = linkModal;

    const url = linkUrl.trim();
    if (!url) {
      toast.error("Please enter a link URL (e.g. /solutions/tax or https://...)");
      return;
    }

    const label = linkText.trim() || url;
    const markdownLink = `[${label}](${url})`;

    if (subType === "document") {
      if (editorRef.current) {
        editorRef.current.focus();
      }
      if (typeof window !== "undefined" && lastWysiwygSelection) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(lastWysiwygSelection);
        }
      }
      if (lastWysiwygSelection && !lastWysiwygSelection.collapsed) {
        document.execCommand("createLink", false, url);
      } else {
        insertHtmlAtCursor(`<a href="${escapeHtml(url)}" class="text-blue-600 underline font-medium hover:text-blue-800">${escapeHtml(label)}</a>&nbsp;`);
      }
      handleWysiwygInput();
      setLinkModal((prev) => ({ ...prev, isOpen: false }));
      toast.success("Link added to article!");
      return;
    }

    if (subType === "p") {
      const currentText = currentPost.blocks[blockIndex]?.text || "";
      let newText = "";
      if (selectionStart !== undefined && selectionEnd !== undefined && selectionStart !== selectionEnd) {
        newText = currentText.substring(0, selectionStart) + markdownLink + currentText.substring(selectionEnd);
      } else if (selectionStart !== undefined) {
        newText = currentText.substring(0, selectionStart) + markdownLink + currentText.substring(selectionStart);
      } else {
        newText = currentText ? `${currentText} ${markdownLink}` : markdownLink;
      }
      handleUpdateBlock(blockIndex, { text: newText, html: linksToHtml(newText) });
    } else if (subType === "ul" && itemIndex !== undefined) {
      const block = currentPost.blocks[blockIndex];
      const nextItems = [...(block.items || [])];
      const currentItem = nextItems[itemIndex] || "";
      let newItem = "";
      if (selectionStart !== undefined && selectionEnd !== undefined && selectionStart !== selectionEnd) {
        newItem = currentItem.substring(0, selectionStart) + markdownLink + currentItem.substring(selectionEnd);
      } else if (selectionStart !== undefined) {
        newItem = currentItem.substring(0, selectionStart) + markdownLink + currentItem.substring(selectionStart);
      } else {
        newItem = currentItem ? `${currentItem} ${markdownLink}` : markdownLink;
      }
      nextItems[itemIndex] = newItem;
      handleUpdateBlock(blockIndex, { items: nextItems });
    } else if (subType === "ol" && itemIndex !== undefined) {
      const block = currentPost.blocks[blockIndex];
      const nextItems = [...(block.items || [])];
      const currentItem = nextItems[itemIndex] || "";
      let newItem = "";
      if (selectionStart !== undefined && selectionEnd !== undefined && selectionStart !== selectionEnd) {
        newItem = currentItem.substring(0, selectionStart) + markdownLink + currentItem.substring(selectionEnd);
      } else if (selectionStart !== undefined) {
        newItem = currentItem.substring(0, selectionStart) + markdownLink + currentItem.substring(selectionStart);
      } else {
        newItem = currentItem ? `${currentItem} ${markdownLink}` : markdownLink;
      }
      nextItems[itemIndex] = newItem;
      handleUpdateBlock(blockIndex, { items: nextItems });
    } else if (subType === "callout") {
      const currentText = currentPost.blocks[blockIndex]?.text || "";
      let newText = "";
      if (selectionStart !== undefined && selectionEnd !== undefined && selectionStart !== selectionEnd) {
        newText = currentText.substring(0, selectionStart) + markdownLink + currentText.substring(selectionEnd);
      } else if (selectionStart !== undefined) {
        newText = currentText.substring(0, selectionStart) + markdownLink + currentText.substring(selectionStart);
      } else {
        newText = currentText ? `${currentText} ${markdownLink}` : markdownLink;
      }
      handleUpdateBlock(blockIndex, { text: newText });
    } else if (subType === "table" && rowIndex !== undefined && colIndex !== undefined) {
      const block = currentPost.blocks[blockIndex];
      const currentCell = block.rows?.[rowIndex]?.[colIndex] || "";
      let newCell = "";
      if (selectionStart !== undefined && selectionEnd !== undefined && selectionStart !== selectionEnd) {
        newCell = currentCell.substring(0, selectionStart) + markdownLink + currentCell.substring(selectionEnd);
      } else if (selectionStart !== undefined) {
        newCell = currentCell.substring(0, selectionStart) + markdownLink + currentCell.substring(selectionStart);
      } else {
        newCell = currentCell ? `${currentCell} ${markdownLink}` : markdownLink;
      }
      handleUpdateTableCell(blockIndex, rowIndex, colIndex, newCell);
    } else if (subType === "table-header" && colIndex !== undefined) {
      const block = currentPost.blocks[blockIndex];
      const currentHeader = block.headers?.[colIndex] || "";
      let newHeader = "";
      if (selectionStart !== undefined && selectionEnd !== undefined && selectionStart !== selectionEnd) {
        newHeader = currentHeader.substring(0, selectionStart) + markdownLink + currentHeader.substring(selectionEnd);
      } else if (selectionStart !== undefined) {
        newHeader = currentHeader.substring(0, selectionStart) + markdownLink + currentHeader.substring(selectionStart);
      } else {
        newHeader = currentHeader ? `${currentHeader} ${markdownLink}` : markdownLink;
      }
      handleUpdateTableHeader(blockIndex, colIndex, newHeader);
    }

    setLinkModal((prev) => ({ ...prev, isOpen: false }));
    toast.success("Hyperlink inserted successfully!");
  };

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

      const matchesDestination =
        destinationFilter === "all" ||
        (destinationFilter === "blog" && (b.destination === "blog" || b.destination === "both" || !b.destination)) ||
        (destinationFilter === "resource" && (b.destination === "resource" || b.destination === "both"));

      return matchesSearch && matchesStatus && matchesCategory && matchesDestination;
    });
  }, [blogsList, searchTerm, statusFilter, categoryFilter, destinationFilter]);

  const totalListPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

  const paginatedBlogs = useMemo(() => {
    const start = (listPage - 1) * POSTS_PER_PAGE;
    return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
  }, [filteredBlogs, listPage]);

  // Handler: Start New Post
  const handleStartNew = () => {
    const blank = createBlankPost();
    setCurrentPost(blank);
    setIsCustomSlugUnlocked(false);
    setCanvasMode("document");
    setEditorSubTab("write");
    setActiveTab("edit");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = blocksToHtml(blank.blocks);
        handleWysiwygInput();
      }
    }, 50);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Edit Post
  const handleEditPost = (post: ExtendedBlogPost) => {
    const prepared = preparePostForEditor(post);
    setCurrentPost(prepared);
    setIsCustomSlugUnlocked(true);
    setCanvasMode("document");
    setEditorSubTab("write");
    setActiveTab("edit");
    if (typeof window !== "undefined" && post.slug) {
      window.history.replaceState(null, "", `?slug=${post.slug}`);
    }
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = blocksToHtml(prepared.blocks);
        handleWysiwygInput();
      }
    }, 50);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Duplicate Post
  const handleDuplicatePost = (post: ExtendedBlogPost) => {
    const prepared = preparePostForEditor(post);
    const duplicated: ExtendedBlogPost = {
      ...prepared,
      id: `blog-${Date.now()}`,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy`,
      isCustom: true,
      status: "draft",
    };
    setCurrentPost(duplicated);
    setIsCustomSlugUnlocked(true);
    setCanvasMode("document");
    setEditorSubTab("write");
    setActiveTab("edit");
    if (typeof window !== "undefined" && duplicated.slug) {
      window.history.replaceState(null, "", `?slug=${duplicated.slug}`);
    }
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = blocksToHtml(duplicated.blocks);
        handleWysiwygInput();
      }
    }, 50);
    toast.info("Created a duplicate draft. You can customize and save it.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auto-restore draft from URL ?slug= on initial load or browser back
  useEffect(() => {
    if (typeof window === "undefined" || blogsList.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get("slug");
    if (slugParam && activeTab === "list") {
      const match = blogsList.find((b) => b.slug === slugParam);
      if (match) {
        handleEditPost(match);
      }
    }
  }, [blogsList]);

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
    let newBlock: ContentBlock;
    if (type === "ul") {
      newBlock = { type, items: ["First actionable checkpoint", "Second key takeaway"] };
    } else if (type === "ol") {
      newBlock = {
        type: "ol",
        items: [
          "Step 1: Review current monthly financial statements",
          "Step 2: Reconcile discrepancies with advisory lead",
        ],
      };
    } else if (type === "blockquote") {
      newBlock = {
        type,
        text: "Highlight a pivotal takeaway, executive quote, or industry advisory principle here.",
      };
    } else if (type === "h2") {
      newBlock = { type, text: "Section Heading (H2)" };
    } else if (type === "h3") {
      newBlock = { type, text: "Subheading (H3)" };
    } else if (type === "h4") {
      newBlock = { type, text: "Minor Topic Heading (H4)" };
    } else if (type === "image") {
      newBlock = {
        type: "image",
        url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
        alt: "Financial balance sheet and advisory review",
        caption: "Figure 1: Strategic fiscal review and cash flow forecasting.",
        size: "full",
      };
    } else if (type === "callout") {
      newBlock = {
        type: "callout",
        calloutType: "tip",
        title: "SMG Advisory Pro-Tip",
        text: "Regularly auditing prime costs allows multi-unit restaurant operators to protect 3-5% in operating margin every quarter.",
      };
    } else if (type === "stat") {
      newBlock = {
        type: "stat",
        statNumber: "85%",
        statLabel:
          "Of hospitality and growth businesses achieve improved cash flow visibility within their first 90 days of CFO advisory.",
      };
    } else if (type === "divider") {
      newBlock = { type: "divider" };
    } else if (type === "table") {
      newBlock = {
        type: "table",
        hasHeader: true,
        headers: ["Column 1", "Column 2", "Column 3"],
        rows: [
          ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
          ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
        ],
      };
    } else {
      newBlock = {
        type: "p",
        text: "Write your article paragraph here. Explain the key financial concepts in clear, client-friendly terms.",
      };
    }

    setCurrentPost((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));

    const typeLabels: Record<string, string> = {
      h2: "Section Heading (H2)",
      h3: "Subheading (H3)",
      h4: "Minor Heading (H4)",
      p: "Paragraph",
      image: "Image Visual",
      ul: "Bullet List",
      ol: "Numbered List",
      blockquote: "Quote",
      callout: "Advisory Callout",
      stat: "Key Statistic",
      table: "Data Table",
      divider: "Section Divider",
    };
    toast.success(`Added ${typeLabels[type] || "Content"} block`);
  };

  const handleUpdateBlock = (index: number, updated: Partial<ContentBlock>) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const targetBlock = nextBlocks[index];
      let nextUpdated = { ...updated };
      if (targetBlock?.type === "p" && typeof updated.text === "string") {
        nextUpdated.html = linksToHtml(updated.text);
      }
      nextBlocks[index] = { ...targetBlock, ...nextUpdated };
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

  // Split a multi-paragraph block into individual blocks
  const handleSplitParagraph = (index: number) => {
    const targetBlock = currentPost.blocks[index];
    if (!targetBlock || !targetBlock.text) return;

    const parsed = parseFullArticleText(targetBlock.text, "smart");
    if (parsed.length <= 1) {
      toast.info("No multiple sections found to split.");
      return;
    }

    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      nextBlocks.splice(index, 1, ...parsed);
      return { ...prev, blocks: nextBlocks };
    });
    toast.success(`Split into ${parsed.length} individual blocks!`);
  };

  // Merge all paragraph blocks into one continuous content block
  const handleMergeAllParagraphs = () => {
    const paraIndices = currentPost.blocks
      .map((b, i) => (b.type === "p" ? i : -1))
      .filter((i) => i !== -1);

    if (paraIndices.length <= 1) {
      toast.info("Need more than 1 paragraph block to merge.");
      return;
    }

    const mergedText = currentPost.blocks
      .filter((b) => b.type === "p")
      .map((b) => (b.text || "").trim())
      .filter(Boolean)
      .join("\n\n");

    const mergedBlock: ContentBlock = {
      type: "p",
      text: mergedText,
      html: linksToHtml(mergedText),
    };

    const firstIdx = paraIndices[0];
    const otherParaIndices = new Set(paraIndices.slice(1));

    setCurrentPost((prev) => {
      const nextBlocks = prev.blocks
        .filter((_, idx) => !otherParaIndices.has(idx))
        .map((b, idx) => (idx === firstIdx ? mergedBlock : b));
      return { ...prev, blocks: nextBlocks };
    });
    toast.success("Merged paragraphs into a single content block!");
  };

  // Execute full article import
  const handleExecuteFullArticleImport = () => {
    if (!pasteArticleInput.trim()) {
      toast.error("Please paste some article text first.");
      return;
    }

    const newBlocks = parseFullArticleText(pasteArticleInput, pasteMode);
    if (!newBlocks.length) {
      toast.error("No content detected to import.");
      return;
    }

    let titleToSet = currentPost.title;
    if (!titleToSet) {
      const firstLine = pasteArticleInput.trim().split("\n")[0].trim();
      if (firstLine.startsWith("# ")) {
        titleToSet = firstLine.replace(/^#\s+/, "");
      }
    }

    const combinedBlocks = pasteAction === "replace" ? newBlocks : [...currentPost.blocks, ...newBlocks];
    setCurrentPost((prev) => ({
      ...prev,
      title: titleToSet || prev.title,
      blocks: combinedBlocks,
    }));

    if (editorRef.current) {
      editorRef.current.innerHTML = blocksToHtml(combinedBlocks);
      handleWysiwygInput();
    }

    setIsPasteArticleModalOpen(false);
    setPasteArticleInput("");
    toast.success(
      `Successfully imported ${newBlocks.length} ${pasteMode === "single" ? "unified content block" : "structured blocks"}!`
    );
  };

  const handleSwitchToBlocks = () => {
    let newBlocks = currentPost.blocks;
    if (editorRef.current) {
      const parsed = parseHtmlToBlocks(editorRef.current.innerHTML);
      if (parsed.length > 0) newBlocks = parsed;
    }
    setCurrentPost((prev) => ({
      ...prev,
      blocks: newBlocks,
    }));
    setCanvasMode("blocks");
    toast.info("Switched to Advanced Blocks mode");
  };

  const handleSwitchToDocument = () => {
    setCanvasMode("document");
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = blocksToHtml(currentPost.blocks);
        handleWysiwygInput();
      }
    }, 50);
    toast.info("Switched to Easy Document mode");
  };

  // Table Block Management Helpers
  const handleToggleTableHeader = (blockIdx: number) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIdx];
      if (block && block.type === "table") {
        const currentHasHeader = block.hasHeader !== false;
        nextBlocks[blockIdx] = {
          ...block,
          hasHeader: !currentHasHeader,
        };
      }
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleUpdateTableHeader = (blockIdx: number, colIdx: number, value: string) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIdx];
      if (block && block.type === "table") {
        const nextHeaders = [...(block.headers || [])];
        nextHeaders[colIdx] = value;
        nextBlocks[blockIdx] = { ...block, headers: nextHeaders };
      }
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleUpdateTableCell = (
    blockIdx: number,
    rowIdx: number,
    colIdx: number,
    value: string
  ) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIdx];
      if (block && block.type === "table") {
        const nextRows = (block.rows || []).map((r, rI) => {
          if (rI !== rowIdx) return r;
          const nextRow = [...r];
          nextRow[colIdx] = value;
          return nextRow;
        });
        nextBlocks[blockIdx] = { ...block, rows: nextRows };
      }
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleAddTableRow = (blockIdx: number) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIdx];
      if (block && block.type === "table") {
        const colCount = block.headers?.length || block.rows?.[0]?.length || 2;
        const newRow = new Array(colCount).fill("");
        nextBlocks[blockIdx] = {
          ...block,
          rows: [...(block.rows || []), newRow],
        };
      }
      return { ...prev, blocks: nextBlocks };
    });
    toast.success("Added table row");
  };

  const handleDeleteTableRow = (blockIdx: number, rowIdx: number) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIdx];
      if (block && block.type === "table") {
        const nextRows = (block.rows || []).filter((_, i) => i !== rowIdx);
        if (nextRows.length === 0) return prev;
        nextBlocks[blockIdx] = { ...block, rows: nextRows };
      }
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleAddTableColumn = (blockIdx: number) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIdx];
      if (block && block.type === "table") {
        const nextHeaders = [...(block.headers || [])];
        const newColIndex = nextHeaders.length + 1;
        nextHeaders.push(`Column ${newColIndex}`);
        const nextRows = (block.rows || []).map((row) => [...row, ""]);
        nextBlocks[blockIdx] = {
          ...block,
          headers: nextHeaders,
          rows: nextRows,
        };
      }
      return { ...prev, blocks: nextBlocks };
    });
    toast.success("Added table column");
  };

  const handleDeleteTableColumn = (blockIdx: number, colIdx: number) => {
    setCurrentPost((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIdx];
      if (block && block.type === "table") {
        if ((block.headers || []).length <= 1) return prev;
        const nextHeaders = (block.headers || []).filter((_, i) => i !== colIdx);
        const nextRows = (block.rows || []).map((row) => row.filter((_, i) => i !== colIdx));
        nextBlocks[blockIdx] = {
          ...block,
          headers: nextHeaders,
          rows: nextRows,
        };
      }
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleOpenPreview = () => {
    if (canvasMode === "document" && editorRef.current) {
      const wysiwygHtml = editorRef.current.innerHTML || "";
      const parsed = parseHtmlToBlocks(wysiwygHtml);
      if (parsed.length > 0 && parsed.some((b) => (b.text && b.text.trim()) || (b.html && b.html.trim()))) {
        setCurrentPost((prev) => ({ ...prev, blocks: parsed }));
      }
    }
    setActiveTab("preview");
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
      let activeBlocks = currentPost.blocks;
      if (canvasMode === "document" && editorRef.current) {
        const wysiwygHtml = editorRef.current.innerHTML || "";
        const parsed = parseHtmlToBlocks(wysiwygHtml);
        if (parsed.length > 0 && parsed.some((b) => (b.text && b.text.trim()) || (b.html && b.html.trim()))) {
          activeBlocks = parsed;
        }
      }

      const normalizedBlocks = (activeBlocks || []).map((block) => {
        if (block.type === "p") {
          let text = block.text || "";
          if (/<[a-z][\s\S]*>/i.test(text)) {
            text = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          }
          text = text.replace(/&#39;|&amp;#39;/g, "'");

          let html =
            block.html && block.html.includes("<")
              ? cleanWordHtml(block.html)
              : text
              ? markdownToHtml(text)
              : "";
          html = cleanWordHtml(html).replace(/&#39;|&amp;#39;/g, "'");

          return {
            ...block,
            text,
            html,
          };
        }
        if (block.type === "ul" || block.type === "ol") {
          return {
            ...block,
            items: (block.items || []).map((item) => {
              const cleaned = cleanWordHtml(item).replace(/&#39;|&amp;#39;/g, "'");
              return cleaned;
            }),
          };
        }
        if (block.type === "table") {
          return {
            ...block,
            headers: (block.headers || []).map((h) => cleanWordHtml(h).replace(/&#39;|&amp;#39;/g, "'")),
            rows: (block.rows || []).map((row) => row.map((cell) => cleanWordHtml(cell).replace(/&#39;|&amp;#39;/g, "'"))),
          };
        }
        return block;
      });

      const postToSave: ExtendedBlogPost = {
        ...currentPost,
        status: effectiveStatus,
        publishDate:
          effectiveStatus === "published"
            ? (currentPost.publishDate && new Date(currentPost.publishDate).getTime() <= Date.now()
                ? currentPost.publishDate
                : undefined)
            : currentPost.publishDate,
        slug:
          currentPost.slug.trim() ||
          currentPost.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
        blocks: normalizedBlocks,
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

        setCurrentPost(preparePostForEditor(postToSave));

        if (typeof window !== "undefined" && postToSave.slug) {
          window.history.replaceState(null, "", `?slug=${postToSave.slug}`);
        }
      } else {
        toast.error(res.error || "Failed to save blog post.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingsCards = (isSidebar: boolean = false) => (
    <div className={`space-y-5 ${isSidebar ? "" : "max-w-3xl mx-auto"}`}>
      {/* 0. Publishing Channel & Destination Card */}
      <div className={`bg-white ${isSidebar ? "p-4 sm:p-5 rounded-2xl" : "p-6 sm:p-8 rounded-3xl"} border border-slate-200/80 shadow-xs space-y-3.5`}>
        <div>
          <h3 className="text-sm font-bold font-serif-hero text-navy flex items-center gap-2">
            <Globe className="size-4 text-primary" /> Publishing Channel
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Choose which website section this article belongs to.
          </p>
        </div>

        <div className={`grid ${isSidebar ? "grid-cols-1 gap-2" : "grid-cols-1 sm:grid-cols-3 gap-3"}`}>
          <button
            type="button"
            onClick={() => setCurrentPost((prev) => ({ ...prev, destination: "blog" }))}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              currentPost.destination === "blog" || !currentPost.destination
                ? "border-navy bg-navy/5 ring-2 ring-navy/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-navy shrink-0" />
              <div className="text-xs font-bold text-slate-900">Blog Article</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Published to /blog/ and Insights
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPost((prev) => ({ ...prev, destination: "resource" }))}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              currentPost.destination === "resource"
                ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Library className="size-4 text-purple-600 shrink-0" />
              <div className="text-xs font-bold text-slate-900">Resource Guide</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Published to /resources/ library
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPost((prev) => ({ ...prev, destination: "both" }))}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              currentPost.destination === "both"
                ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-indigo-600 shrink-0" />
              <div className="text-xs font-bold text-slate-900">Both Libraries</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Listed in Blog and Resources
            </div>
          </button>
        </div>
      </div>

      {/* 1. Release Schedule Card */}
      <div className={`bg-white ${isSidebar ? "p-4 sm:p-5 rounded-2xl" : "p-6 sm:p-8 rounded-3xl"} border border-slate-200/80 shadow-xs space-y-4`}>
        <div>
          <h3 className="text-sm font-bold font-serif-hero text-navy flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" /> Release Schedule
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Publication timing and visibility.
          </p>
        </div>

        <div className={`grid ${isSidebar ? "grid-cols-1 gap-2" : "grid-cols-1 sm:grid-cols-3 gap-3"}`}>
          <button
            type="button"
            onClick={() => setCurrentPost((prev) => ({ ...prev, status: "published" }))}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              currentPost.status === "published" || !currentPost.status
                ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <div className="text-xs font-bold text-slate-900">Publish Immediately</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Live on website right away
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPost((prev) => ({ ...prev, status: "scheduled" }))}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              currentPost.status === "scheduled"
                ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-blue-600 shrink-0" />
              <div className="text-xs font-bold text-slate-900">Future Schedule</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Auto-releases at chosen date
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPost((prev) => ({ ...prev, status: "draft" }))}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              currentPost.status === "draft"
                ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-amber-600 shrink-0" />
              <div className="text-xs font-bold text-slate-900">Save as Draft</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Private in studio only
            </div>
          </button>
        </div>

        {currentPost.status === "scheduled" && (
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-1.5">
            <label className="block text-xs font-bold text-blue-950">
              Release Date &amp; Time:
            </label>
            <Input
              type="datetime-local"
              value={currentPost.publishDate || ""}
              onChange={(e) => setCurrentPost((prev) => ({ ...prev, publishDate: e.target.value }))}
              className="h-9 text-xs bg-white border-blue-300 focus-visible:ring-blue-500 text-blue-950 font-medium"
            />
            <p className="text-[10px] text-blue-700">
              &bull; Once reached, this article will automatically appear on the live website.
            </p>
          </div>
        )}
      </div>

      {/* 2. URL Web Address */}
      <div className={`bg-white ${isSidebar ? "p-4 sm:p-5 rounded-2xl" : "p-6 sm:p-8 rounded-3xl"} border border-slate-200/80 shadow-xs space-y-3`}>
        <h3 className="text-sm font-bold font-serif-hero text-navy flex items-center gap-2">
          <Globe className="size-4 text-primary" /> URL Web Address
        </h3>
        <p className="text-[11px] text-slate-500">
          Permanent link on the website:
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
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
              placeholder="article-slug"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCustomSlugUnlocked(!isCustomSlugUnlocked)}
              className="text-xs h-9 px-2.5 shrink-0"
            >
              {isCustomSlugUnlocked ? <Lock className="size-3.5 mr-1" /> : <Unlock className="size-3.5 mr-1" />}
              {isCustomSlugUnlocked ? "Lock" : "Edit"}
            </Button>
          </div>
          <div className="text-[11px] text-slate-500 font-mono break-all bg-slate-50 p-2 rounded-lg border border-slate-100">
            smgaba.com/{currentPost.destination === "resource" ? "resources" : "blog"}/{currentPost.slug || "..."}
          </div>
        </div>
      </div>

      {/* 3. Author & Publication Date */}
      <div className={`bg-white ${isSidebar ? "p-4 sm:p-5 rounded-2xl" : "p-6 sm:p-8 rounded-3xl"} border border-slate-200/80 shadow-xs space-y-3.5`}>
        <h3 className="text-sm font-bold font-serif-hero text-navy flex items-center gap-2">
          <User className="size-4 text-primary" /> Author &amp; Details
        </h3>

        <div className={`grid ${isSidebar ? "grid-cols-1 gap-3" : "grid-cols-1 sm:grid-cols-2 gap-4"}`}>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
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

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Date Label
            </label>
            <Input
              type="text"
              value={currentPost.date}
              onChange={(e) => setCurrentPost((prev) => ({ ...prev, date: e.target.value }))}
              className="h-9 text-xs bg-white border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* 4. Google SEO Preview Card */}
      <div className={`bg-white ${isSidebar ? "p-4 sm:p-5 rounded-2xl" : "p-6 sm:p-8 rounded-3xl"} border border-slate-200/80 shadow-xs space-y-3.5`}>
        <h3 className="text-sm font-bold font-serif-hero text-navy flex items-center gap-2">
          <Sparkles className="size-4 text-primary" /> Google Search Preview
        </h3>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <span className="size-3.5 rounded-full bg-navy text-white text-[8px] font-bold flex items-center justify-center">S</span>
            <span className="truncate">smgaba.com &rsaquo; blog &rsaquo; {currentPost.slug || "url"}</span>
          </div>
          <div className="text-xs font-semibold text-blue-800 line-clamp-1">
            {currentPost.metaTitle || currentPost.title || "Article Title"}
          </div>
          <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {currentPost.metaDescription || currentPost.excerpt || "Article summary will appear here on Google search results."}
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Meta Title
            </label>
            <Input
              type="text"
              value={currentPost.metaTitle || ""}
              onChange={(e) => setCurrentPost((prev) => ({ ...prev, metaTitle: e.target.value }))}
              className="h-8 text-xs bg-white border-slate-200"
              placeholder={currentPost.title || "Article Title"}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={currentPost.metaDescription || ""}
              onChange={(e) => setCurrentPost((prev) => ({ ...prev, metaDescription: e.target.value }))}
              className="w-full p-2 text-xs text-slate-800 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
              placeholder="Brief summary for Google..."
            />
          </div>
        </div>
      </div>
    </div>
  );

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
                  value={destinationFilter}
                  onChange={(e) => {
                    setDestinationFilter(e.target.value);
                    setListPage(1);
                  }}
                  className="w-full sm:w-auto h-9 px-3 text-xs font-semibold rounded-full border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy/20 cursor-pointer"
                >
                  <option value="all">🌐 All Channels</option>
                  <option value="blog">📝 Blog (/blog)</option>
                  <option value="resource">📚 Resources (/resources)</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setListPage(1);
                  }}
                  className="w-full sm:w-auto h-9 px-3 text-xs font-medium rounded-full border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy/20 cursor-pointer"
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
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-navy shadow-xs backdrop-blur-xs">
                                {post.category}
                              </span>
                              {post.destination === "resource" ? (
                                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-purple-600 text-white shadow-xs">
                                  📚 Resource
                                </span>
                              ) : post.destination === "both" ? (
                                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                                  🌐 Both
                                </span>
                              ) : (
                                <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-white shadow-xs">
                                  📝 Blog
                                </span>
                              )}
                            </div>

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
                  onClick={() => {
                    setActiveTab("list");
                    if (typeof window !== "undefined") {
                      window.history.replaceState(null, "", window.location.pathname);
                    }
                  }}
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      editorSubTab === "write"
                        ? "bg-white text-navy font-bold shadow-xs"
                        : "text-slate-600 hover:text-navy"
                    }`}
                  >
                    <FileText className="size-3.5 text-blue-600" />
                    <span>Article Content</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorSubTab("settings")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
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
                  onClick={handleOpenPreview}
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
                          onClick={() => setIsCoverGalleryModalOpen(true)}
                          size="sm"
                          className="rounded-full bg-white text-navy hover:bg-slate-100 font-semibold shadow-lg text-xs gap-1.5"
                        >
                          <ImageIcon className="size-3.5 text-primary" /> Choose from Gallery or Device
                        </Button>
                        <Button
                          type="button"
                          onClick={() => coverFileInputRef.current?.click()}
                          size="sm"
                          variant="secondary"
                          className="rounded-full bg-white/95 text-navy hover:bg-white font-semibold shadow-lg text-xs gap-1.5"
                        >
                          <Upload className="size-3.5 text-primary" /> Quick Device Upload
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
                        onClick={() => setIsCoverGalleryModalOpen(true)}
                        className="rounded-full bg-white/95 text-navy font-semibold px-3 py-1.5 text-xs shadow-md border border-slate-200/80 flex items-center gap-1.5 hover:bg-white transition hover:shadow-lg"
                      >
                        <ImageIcon className="size-3.5 text-primary" /> Choose from Gallery / Device
                      </button>
                    </div>
                  </div>

                  {/* Media Image Picker Modal for Cover */}
                  <MediaImagePickerModal
                    isOpen={isCoverGalleryModalOpen}
                    onClose={() => setIsCoverGalleryModalOpen(false)}
                    onSelect={(url) => {
                      setCurrentPost((prev) => ({ ...prev, image: url }));
                      toast.success("Cover photo updated");
                    }}
                    currentValue={currentPost.image}
                    title="Choose Article Cover Photo"
                  />

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

                  {/* Destination Channel Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Globe className="size-3.5 text-primary" /> Destination:
                      </span>
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setCurrentPost((prev) => ({ ...prev, destination: "blog" }))}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            currentPost.destination === "blog" || !currentPost.destination
                              ? "bg-navy text-white shadow-xs"
                              : "text-slate-600 hover:text-navy"
                          }`}
                        >
                          <span>📝 Blog Only</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentPost((prev) => ({ ...prev, destination: "resource" }))}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            currentPost.destination === "resource"
                              ? "bg-purple-700 text-white shadow-xs"
                              : "text-slate-600 hover:text-purple-700"
                          }`}
                        >
                          <span>📚 Resources Only</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentPost((prev) => ({ ...prev, destination: "both" }))}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            currentPost.destination === "both"
                              ? "bg-indigo-700 text-white shadow-xs"
                              : "text-slate-600 hover:text-indigo-700"
                          }`}
                        >
                          <span>🌐 Both Blog &amp; Resources</span>
                        </button>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {currentPost.destination === "resource"
                        ? "Publishes to /resources/ library"
                        : currentPost.destination === "both"
                        ? "Publishes to both /blog/ & /resources/"
                        : "Publishes to /blog/ and Insights"}
                    </span>
                  </div>

                  {/* Category Pills & Read Time Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                        Category:
                      </span>
                      {allCategories
                        .filter((cat) => cat !== "all")
                        .map((cat) => (
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

                      {showNewCategoryInput ? (
                        <div className="inline-flex items-center gap-1.5 bg-white border border-slate-300 rounded-full pl-3 pr-1 py-0.5">
                          <input
                            type="text"
                            placeholder="New category..."
                            value={customCategoryText}
                            onChange={(e) => setCustomCategoryText(e.target.value)}
                            className="text-[11px] font-semibold text-slate-800 focus:outline-none w-28"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && customCategoryText.trim()) {
                                const newCat = customCategoryText.trim();
                                setCurrentPost((prev) => ({ ...prev, category: newCat }));
                                setCustomCategoryText("");
                                setShowNewCategoryInput(false);
                                toast.success(`Category "${newCat}" applied!`);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customCategoryText.trim()) {
                                const newCat = customCategoryText.trim();
                                setCurrentPost((prev) => ({ ...prev, category: newCat }));
                                setCustomCategoryText("");
                                setShowNewCategoryInput(false);
                                toast.success(`Category "${newCat}" applied!`);
                              }
                            }}
                            className="rounded-full bg-[#0f2142] text-white px-2 py-0.5 text-[10px] font-bold uppercase hover:bg-navy/90"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowNewCategoryInput(false)}
                            className="text-slate-400 hover:text-slate-600 px-1 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowNewCategoryInput(true)}
                          className="rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:border-[#0f2142] hover:text-[#0f2142] transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="size-3" />
                          <span>+ Category</span>
                        </button>
                      )}
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
                  {/* Mode Switch Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        <button
                          type="button"
                          onClick={handleSwitchToDocument}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            canvasMode === "document"
                              ? "bg-white text-navy shadow-xs"
                              : "text-slate-600 hover:text-navy"
                          }`}
                        >
                          <FileText className="size-3.5 text-blue-600" />
                          <span>📄 Visual Document (All-in-One)</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSwitchToBlocks}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                            canvasMode === "blocks"
                              ? "bg-white text-navy shadow-xs font-bold"
                              : "text-slate-500 hover:text-navy"
                          }`}
                        >
                          <Layers className="size-3.5 text-slate-400" />
                          <span>🧱 Raw Blocks ({currentPost.blocks.length})</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canvasMode === "blocks" && currentPost.blocks.filter((b) => b.type === "p").length > 1 && (
                        <button
                          type="button"
                          onClick={handleMergeAllParagraphs}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                          title="Merge all paragraph blocks into one single continuous block"
                        >
                          <Layers className="size-3" />
                          <span>Merge paragraphs</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setPasteArticleInput("");
                          setIsPasteArticleModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#1b4e94] text-white hover:bg-[#153e77] transition shadow-xs cursor-pointer"
                      >
                        <Sparkles className="size-3.5" />
                        <span>⚡ Paste Word / Docs</span>
                      </button>
                    </div>
                  </div>

                  {/* DOCUMENT MODE (VISUAL WYSIWYG - WORD / GOOGLE DOCS STYLE) */}
                  {canvasMode === "document" ? (
                    <div className="space-y-4">
                      {/* Top Visual Formatting Toolbar - Sticky below the workspace bar */}
                      <div className="sticky top-[11.5rem] md:top-[8.75rem] z-30 bg-white/98 backdrop-blur-md border border-slate-200/95 rounded-2xl shadow-md p-2.5 space-y-2">
                        {/* Row 1: Headings & Text Styles */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1">
                            {/* Headings */}
                            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("formatBlock", "<h2>");
                                }}
                                className="h-7 px-2.5 rounded-lg hover:bg-white text-navy text-xs font-bold font-serif-hero transition flex items-center gap-1 cursor-pointer"
                                title="Primary Section Heading (H2)"
                              >
                                <Heading className="size-3.5 text-primary" />
                                <span>Heading 2</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("formatBlock", "<h3>");
                                }}
                                className="h-7 px-2.5 rounded-lg hover:bg-white text-navy text-xs font-semibold font-serif-hero transition flex items-center gap-1 cursor-pointer"
                                title="Subheading (H3)"
                              >
                                <Heading className="size-3 text-slate-500" />
                                <span>Heading 3</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("formatBlock", "<h4>");
                                }}
                                className="h-7 px-2 rounded-lg hover:bg-white text-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                                title="Minor Topic (H4)"
                              >
                                <Heading className="size-2.5 text-slate-400" />
                                <span>H4</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("formatBlock", "<p>");
                                }}
                                className="h-7 px-2 rounded-lg hover:bg-white text-slate-600 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                                title="Normal Paragraph Text"
                              >
                                <Pilcrow className="size-3 text-slate-400" />
                                <span>Normal</span>
                              </button>
                            </div>

                            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

                            {/* Bold / Italic / Underline / Strike */}
                            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("bold");
                                }}
                                className="size-7 rounded-lg hover:bg-white text-slate-800 text-xs font-extrabold flex items-center justify-center transition cursor-pointer"
                                title="Bold (Ctrl+B)"
                              >
                                <span>B</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("italic");
                                }}
                                className="size-7 rounded-lg hover:bg-white text-slate-800 text-xs italic font-serif flex items-center justify-center transition cursor-pointer"
                                title="Italic (Ctrl+I)"
                              >
                                <span>I</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("underline");
                                }}
                                className="size-7 rounded-lg hover:bg-white text-slate-800 text-xs underline flex items-center justify-center transition cursor-pointer"
                                title="Underline (Ctrl+U)"
                              >
                                <span className="font-semibold underline">U</span>
                              </button>
                            </div>

                            {/* Text Color & Highlight Picker */}
                            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200 relative">
                              {/* Text Color Dropdown */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    if (typeof window !== "undefined") {
                                      const sel = window.getSelection();
                                      if (sel && sel.rangeCount > 0) {
                                        setLastWysiwygSelection(sel.getRangeAt(0).cloneRange());
                                      }
                                    }
                                    setIsColorPickerOpen((prev) => !prev);
                                    setIsHighlightPickerOpen(false);
                                  }}
                                  className="h-7 px-2 rounded-lg hover:bg-white text-slate-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                  title="Text Color"
                                >
                                  <span className="flex flex-col items-center">
                                    <span className="text-[11px] leading-tight font-black">A</span>
                                    <span
                                      className="w-3.5 h-[2.5px] rounded-full"
                                      style={{ backgroundColor: activeTextColor }}
                                    />
                                  </span>
                                  <Palette className="size-2.5 text-slate-400" />
                                </button>

                                {isColorPickerOpen && (
                                  <div
                                    className="absolute top-full left-0 mt-1.5 p-3 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 w-56 space-y-2.5 shadow-slate-300"
                                    onMouseDown={(e) => e.stopPropagation()}
                                  >
                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                      <span>Text Color</span>
                                      <button
                                        type="button"
                                        onClick={() => applyTextColor("inherit")}
                                        className="text-[10px] text-slate-400 hover:text-red-600 transition"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1.5">
                                      {[
                                        { name: "Navy Dark", hex: "#0f2142" },
                                        { name: "Brand Blue", hex: "#1b4e94" },
                                        { name: "Sky Blue", hex: "#0284c7" },
                                        { name: "Emerald", hex: "#059669" },
                                        { name: "Crimson", hex: "#dc2626" },
                                        { name: "Amber Gold", hex: "#d97706" },
                                        { name: "Purple", hex: "#7c3aed" },
                                        { name: "Charcoal", hex: "#334155" },
                                        { name: "Muted Gray", hex: "#64748b" },
                                        { name: "Black", hex: "#000000" },
                                      ].map((c) => (
                                        <button
                                          key={c.hex}
                                          type="button"
                                          title={c.name}
                                          onClick={() => applyTextColor(c.hex)}
                                          className="size-7 rounded-lg border border-slate-200 hover:scale-110 transition flex items-center justify-center shadow-2xs cursor-pointer"
                                          style={{ backgroundColor: c.hex }}
                                        >
                                          {activeTextColor.toLowerCase() === c.hex.toLowerCase() && (
                                            <Check className="size-3 text-white" />
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                      <span className="text-[11px] text-slate-600 font-medium">Custom HEX:</span>
                                      <input
                                        type="color"
                                        value={activeTextColor}
                                        onChange={(e) => applyTextColor(e.target.value)}
                                        className="size-6 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Highlight Color Dropdown */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    if (typeof window !== "undefined") {
                                      const sel = window.getSelection();
                                      if (sel && sel.rangeCount > 0) {
                                        setLastWysiwygSelection(sel.getRangeAt(0).cloneRange());
                                      }
                                    }
                                    setIsHighlightPickerOpen((prev) => !prev);
                                    setIsColorPickerOpen(false);
                                  }}
                                  className="h-7 px-2 rounded-lg hover:bg-white text-slate-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                  title="Highlight / Background Color"
                                >
                                  <Highlighter className="size-3 text-amber-500" />
                                </button>

                                {isHighlightPickerOpen && (
                                  <div
                                    className="absolute top-full left-0 mt-1.5 p-3 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 w-52 space-y-2.5 shadow-slate-300"
                                    onMouseDown={(e) => e.stopPropagation()}
                                  >
                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                      <span>Highlight</span>
                                      <button
                                        type="button"
                                        onClick={() => applyHighlightColor("transparent")}
                                        className="text-[10px] text-slate-400 hover:text-red-600 transition"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1.5">
                                      {[
                                        { name: "Yellow", hex: "#fef08a" },
                                        { name: "Soft Blue", hex: "#dbeafe" },
                                        { name: "Soft Green", hex: "#dcfce7" },
                                        { name: "Soft Orange", hex: "#ffedd5" },
                                        { name: "Soft Pink", hex: "#ffe4e6" },
                                      ].map((c) => (
                                        <button
                                          key={c.hex}
                                          type="button"
                                          title={c.name}
                                          onClick={() => applyHighlightColor(c.hex)}
                                          className="size-7 rounded-lg border border-slate-200 hover:scale-110 transition shadow-2xs cursor-pointer"
                                          style={{ backgroundColor: c.hex }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

                            {/* Lists & Quote & Link */}
                            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("insertUnorderedList");
                                }}
                                className="h-7 px-2 rounded-lg hover:bg-white text-slate-700 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                                title="Bullet List"
                              >
                                <List className="size-3.5 text-blue-600" />
                                <span className="hidden md:inline">Bullet</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("insertOrderedList");
                                }}
                                className="h-7 px-2 rounded-lg hover:bg-white text-slate-700 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                                title="Numbered Steps List"
                              >
                                <ListOrdered className="size-3.5 text-blue-600" />
                                <span className="hidden md:inline">Numbered</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  executeCommand("formatBlock", "<blockquote>");
                                }}
                                className="h-7 px-2 rounded-lg hover:bg-white text-slate-700 text-xs font-serif flex items-center gap-1 transition cursor-pointer"
                                title="Quote Highlight"
                              >
                                <Quote className="size-3 text-slate-500" />
                                <span className="hidden md:inline">Quote</span>
                              </button>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  openInsertLinkForDocument();
                                }}
                                className="h-7 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                title="Insert Link"
                              >
                                <Link2 className="size-3.5 text-blue-600" />
                                <span>Link</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Paste Full Article Button */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPasteArticleInput("");
                                setIsPasteArticleModalOpen(true);
                              }}
                              className="h-8 px-3 rounded-full bg-[#1b4e94] text-white hover:bg-[#153e77] text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                              title="Paste your full article from Word or Google Docs"
                            >
                              <Sparkles className="size-3.5" />
                              <span>Paste Word / Docs</span>
                            </button>
                          </div>
                        </div>

                        {/* Row 2: Rich Visual Additions (Paragraphs, Bullets, Tables, Images, Callouts, Metrics, Dividers) */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100 text-xs">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                            <span>Insert:</span>
                          </span>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              insertParagraphIntoEditor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold flex items-center gap-1 transition cursor-pointer"
                            title="Insert a new paragraph block at cursor"
                          >
                            <AlignLeft className="size-3 text-slate-600" />
                            <span>+ Paragraph</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              insertBulletListIntoEditor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold flex items-center gap-1 transition cursor-pointer"
                            title="Insert a bullet list at cursor"
                          >
                            <List className="size-3 text-blue-600" />
                            <span>+ Bullet</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              insertNumberedListIntoEditor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold flex items-center gap-1 transition cursor-pointer"
                            title="Insert a numbered steps list at cursor"
                          >
                            <ListOrdered className="size-3 text-blue-600" />
                            <span>+ Numbered</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              insertTableIntoEditor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/80 font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Insert an interactive comparison table with Add/Del Rows & Columns"
                          >
                            <TableIcon className="size-3.5 text-indigo-600" />
                            <span>+ Data Table</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIsInlineImageModalOpen(true);
                            }}
                            className="h-7 px-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-semibold flex items-center gap-1 transition cursor-pointer"
                            title="Insert an image with caption into the article text"
                          >
                            <ImageIcon className="size-3.5 text-emerald-600" />
                            <span>+ Image</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              insertCalloutIntoEditor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 font-semibold flex items-center gap-1 transition cursor-pointer"
                            title="Insert an advisory note / insight box"
                          >
                            <HelpCircle className="size-3.5 text-blue-600" />
                            <span>Advisory Box</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              insertStatIntoEditor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/80 font-semibold flex items-center gap-1 transition cursor-pointer"
                            title="Insert a bold metric / stat highlight"
                          >
                            <BarChart3 className="size-3.5 text-purple-600" />
                            <span>Metric Card</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              insertDividerIntoEditor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium flex items-center gap-1 transition cursor-pointer"
                            title="Insert a visual horizontal divider"
                          >
                            <Minus className="size-3.5 text-slate-500" />
                            <span>Divider</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              deleteCurrentBlockAtCursor();
                            }}
                            className="h-7 px-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer ml-auto"
                            title="Delete the paragraph, heading, list item, or component where your cursor currently is"
                          >
                            <Trash2 className="size-3 text-red-600" />
                            <span>Delete Current Block</span>
                          </button>

                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              executeCommand("removeFormat");
                            }}
                            className="h-7 px-2 rounded-full hover:bg-slate-100 text-slate-500 text-[11px] font-medium transition cursor-pointer"
                            title="Clear formatting on selected text"
                          >
                            Clear Format
                          </button>
                        </div>
                      </div>

                      {/* Visual WYSIWYG Document Editor Canvas */}
                      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs p-6 sm:p-10 focus-within:border-[#1b4e94] focus-within:ring-2 focus-within:ring-[#1b4e94]/10 transition">
                        <style>{`
                          #wysiwyg-document-editor {
                            outline: none;
                            min-height: 480px;
                            font-size: 1.0625rem;
                            line-height: 1.8;
                            color: #1e293b;
                          }
                          #wysiwyg-document-editor:empty:before {
                            content: "Start typing your article here, or click 'Paste Word / Docs' above to import an entire document...\\A\\A• Format headings, bold, italic, or lists with instant visual results\\A• Add images, advisory callouts, metric cards, or tables anywhere\\A• Click 'Live Preview' at any time to see the published article!";
                            white-space: pre-wrap;
                            color: #94a3b8;
                            pointer-events: none;
                          }
                          #wysiwyg-document-editor h2 {
                            font-family: inherit;
                            font-size: 1.75rem;
                            font-weight: 800;
                            color: #0f2142;
                            margin-top: 2rem;
                            margin-bottom: 0.75rem;
                            line-height: 1.3;
                          }
                          #wysiwyg-document-editor h3 {
                            font-family: inherit;
                            font-size: 1.35rem;
                            font-weight: 700;
                            color: #0f2142;
                            margin-top: 1.5rem;
                            margin-bottom: 0.5rem;
                            line-height: 1.35;
                          }
                          #wysiwyg-document-editor h4 {
                            font-size: 1.125rem;
                            font-weight: 600;
                            color: #334155;
                            margin-top: 1.25rem;
                            margin-bottom: 0.5rem;
                          }
                          #wysiwyg-document-editor p {
                            margin-bottom: 1.15rem;
                          }
                          #wysiwyg-document-editor ul {
                            list-style-type: disc;
                            margin-left: 1.5rem;
                            margin-bottom: 1.25rem;
                          }
                          #wysiwyg-document-editor ol {
                            list-style-type: decimal;
                            margin-left: 1.5rem;
                            margin-bottom: 1.25rem;
                          }
                          #wysiwyg-document-editor li {
                            margin-bottom: 0.35rem;
                          }
                          #wysiwyg-document-editor blockquote {
                            border-left: 4px solid #1b4e94;
                            background-color: #f8fafc;
                            padding: 0.85rem 1.25rem;
                            margin: 1.5rem 0;
                            border-radius: 0 0.75rem 0.75rem 0;
                            font-style: italic;
                            color: #334155;
                          }
                          #wysiwyg-document-editor hr {
                            border: 0;
                            border-top: 2px dashed #cbd5e1;
                            margin: 2.25rem 0;
                          }
                          #wysiwyg-document-editor a {
                            color: #1b4e94;
                            text-decoration: underline;
                            font-weight: 600;
                          }
                          #wysiwyg-document-editor .article-image {
                            user-select: none;
                          }
                          #wysiwyg-document-editor .article-callout,
                          #wysiwyg-document-editor .article-stat {
                            user-select: text;
                            transition: all 0.15s ease;
                          }
                          #wysiwyg-document-editor .article-callout:hover {
                            border-color: #93c5fd;
                            box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.12);
                          }
                          #wysiwyg-document-editor .article-stat:hover {
                            border-color: #a5b4fc;
                            box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.12);
                          }
                          #wysiwyg-document-editor .callout-title:focus,
                          #wysiwyg-document-editor .callout-text:focus,
                          #wysiwyg-document-editor .stat-number:focus,
                          #wysiwyg-document-editor .stat-label:focus,
                          #wysiwyg-document-editor th:focus,
                          #wysiwyg-document-editor td:focus {
                            outline: 2px solid #1b4e94;
                            outline-offset: 1px;
                            background-color: rgba(255, 255, 255, 0.95);
                            border-radius: 4px;
                          }
                          #wysiwyg-document-editor table th,
                          #wysiwyg-document-editor table td {
                            min-width: 80px;
                            transition: background-color 0.1s ease;
                          }
                          #wysiwyg-document-editor table td:hover {
                            background-color: rgba(27, 78, 148, 0.05);
                          }
                          #wysiwyg-document-editor table th:hover {
                            background-color: #1e3a6a;
                          }
                          #wysiwyg-document-editor .active-table-cell {
                            outline: 2px solid #2563eb !important;
                            outline-offset: -2px;
                            background-color: #eff6ff !important;
                          }
                        `}</style>

                        {/* Active Table Cell Context Toolbar */}
                        {activeCellTarget && (
                          <div className="mb-4 p-2.5 px-3.5 rounded-xl bg-blue-50/95 border border-blue-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs text-blue-950 animate-in fade-in-50 table-action-pill">
                            <div className="flex items-center gap-1.5 font-bold">
                              <TableIcon className="size-3.5 text-blue-700" />
                              <span>
                                Active Cell: {activeCellTarget.rowIndex === -1 ? "Header" : `Row ${activeCellTarget.rowIndex + 1}`}, Column {activeCellTarget.colIndex + 1}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                              <button
                                type="button"
                                onClick={() => insertRowAbove(activeCellTarget.tr, activeCellTarget.table)}
                                className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-semibold transition cursor-pointer table-cell-action-btn"
                                title="Insert row directly above this cell"
                              >
                                + Row Above
                              </button>
                              <button
                                type="button"
                                onClick={() => insertRowBelow(activeCellTarget.tr, activeCellTarget.table)}
                                className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-semibold transition cursor-pointer table-cell-action-btn"
                                title="Insert row directly below this cell"
                              >
                                + Row Below
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteSpecificRow(activeCellTarget.tr, activeCellTarget.table)}
                                className="px-2 py-0.5 rounded bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold transition cursor-pointer table-cell-action-btn"
                                title="Delete this row"
                              >
                                🗑️ Del Row
                              </button>

                              <span className="text-blue-200 mx-0.5">|</span>

                              <button
                                type="button"
                                onClick={() => insertColumnLeft(activeCellTarget.colIndex, activeCellTarget.table)}
                                className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-semibold transition cursor-pointer table-cell-action-btn"
                                title="Insert column to the left of this cell"
                              >
                                + Col Left
                              </button>
                              <button
                                type="button"
                                onClick={() => insertColumnRight(activeCellTarget.colIndex, activeCellTarget.table)}
                                className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-semibold transition cursor-pointer table-cell-action-btn"
                                title="Insert column to the right of this cell"
                              >
                                + Col Right
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteSpecificColumn(activeCellTarget.colIndex, activeCellTarget.table)}
                                className="px-2 py-0.5 rounded bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold transition cursor-pointer table-cell-action-btn"
                                title="Delete this column"
                              >
                                🗑️ Del Col
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveCellTarget(null)}
                                className="size-5 rounded-full hover:bg-blue-200/60 text-slate-400 hover:text-slate-700 flex items-center justify-center ml-1 cursor-pointer"
                                title="Dismiss cell bar"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          </div>
                        )}

                        <div
                          id="wysiwyg-document-editor"
                          ref={editorRef}
                          contentEditable="true"
                          suppressContentEditableWarning
                          onInput={handleWysiwygInput}
                          onClick={handleEditorClick}
                          onContextMenu={handleEditorContextMenu}
                          onPaste={(e) => {
                            const html = e.clipboardData?.getData("text/html");
                            if (
                              html &&
                              (html.includes("class=\"Paragraph") ||
                                html.includes("SCXW") ||
                                html.includes("data-contrast") ||
                                html.includes("MsoNormal") ||
                                html.includes("<span") ||
                                html.includes("style="))
                            ) {
                              e.preventDefault();
                              const cleaned = cleanWordHtml(html);
                              try {
                                document.execCommand("insertHTML", false, cleaned);
                              } catch {
                                const selection = window.getSelection();
                                if (selection && selection.rangeCount > 0) {
                                  const range = selection.getRangeAt(0);
                                  range.deleteContents();
                                  const div = document.createElement("div");
                                  div.innerHTML = cleaned;
                                  const frag = document.createDocumentFragment();
                                  let node;
                                  while ((node = div.firstChild)) {
                                    frag.appendChild(node);
                                  }
                                  range.insertNode(frag);
                                }
                              }
                              handleWysiwygInput();
                            }
                          }}
                          className="w-full prose prose-slate max-w-none focus:outline-none"
                        />

                        {/* Document stats footer */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-6 border-t border-slate-100 text-xs text-slate-400">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-700">
                              {editorWordCount} words
                            </span>
                            <span>•</span>
                            <span>
                              {editorParagraphCount} paragraphs
                            </span>
                            <span>•</span>
                            <span>
                              ~{Math.max(1, Math.ceil(editorWordCount / 200))} min read
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                            Visual WYSIWYG mode active — format shows instantly
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* BLOCKS MODE (ADVANCED) */
                    <div className="space-y-6">
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
                          {block.type === "h4" && "🏷️ Minor Topic (H4)"}
                          {block.type === "p" && "✍️ Paragraph"}
                          {block.type === "image" && "🖼️ Image Visual"}
                          {block.type === "ul" && "📋 Bullet Points"}
                          {block.type === "ol" && "🔢 Numbered List (Steps)"}
                          {block.type === "blockquote" && "💬 Highlight Quote"}
                          {block.type === "callout" && "💡 Advisory Callout Box"}
                          {block.type === "stat" && "📈 Key Metric / Statistic Highlight"}
                          {block.type === "table" && "📊 Data Table"}
                          {block.type === "divider" && "✦ Section Divider"}
                        </div>

                        {/* Block Editor Input */}
                        {block.type === "h2" ? (
                          <input
                            type="text"
                            placeholder="Section Heading (H2)..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="w-full font-serif-hero text-xl sm:text-2xl font-bold text-navy bg-transparent border-b border-transparent focus:border-navy focus:outline-none py-1"
                          />
                        ) : block.type === "h3" ? (
                          <input
                            type="text"
                            placeholder="Subheading (H3)..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="w-full font-serif-hero text-lg sm:text-xl font-bold text-navy bg-transparent border-b border-transparent focus:border-navy focus:outline-none py-1"
                          />
                        ) : block.type === "h4" ? (
                          <input
                            type="text"
                            placeholder="Minor Topic Heading (H4)..."
                            value={block.text || ""}
                            onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                            className="w-full font-serif-hero text-base sm:text-lg font-bold text-navy bg-transparent border-b border-transparent focus:border-navy focus:outline-none py-1"
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
                        ) : block.type === "image" ? (
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                              <div className="sm:col-span-2">
                                <MediaImageInput
                                  label="Article Image (Upload from Device or Select from Gallery)"
                                  value={block.url || ""}
                                  onChange={(url) => handleUpdateBlock(idx, { url })}
                                  placeholder="https://... or /images/..."
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                                  Display Layout
                                </label>
                                <div className="grid grid-cols-2 gap-1.5 h-10">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBlock(idx, { size: "full" })}
                                    className={`px-2 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer flex items-center justify-center ${
                                      block.size !== "contained"
                                        ? "bg-navy text-white border-navy shadow-xs"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    Full Width
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBlock(idx, { size: "contained" })}
                                    className={`px-2 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer flex items-center justify-center ${
                                      block.size === "contained"
                                        ? "bg-navy text-white border-navy shadow-xs"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    Centered
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-slate-500">
                                  Alt Text (SEO &amp; Accessibility)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Brief description of visual..."
                                  value={block.alt || ""}
                                  onChange={(e) => handleUpdateBlock(idx, { alt: e.target.value })}
                                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:border-navy focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-slate-500">
                                  Caption (Text below image)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Figure 1: Explanation or source..."
                                  value={block.caption || ""}
                                  onChange={(e) => handleUpdateBlock(idx, { caption: e.target.value })}
                                  className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:border-navy focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Live Thumbnail Preview */}
                            {block.url ? (
                              <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 max-h-56 relative group">
                                <img
                                  src={block.url}
                                  alt={block.alt || "Preview"}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                  className="w-full h-auto max-h-56 object-cover"
                                />
                                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium">
                                  Live Image Preview
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                                Enter an image URL above to see live preview
                              </div>
                            )}
                          </div>
                        ) : block.type === "callout" ? (
                          <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Callout Style:
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {(["tip", "warning", "important", "success"] as const).map((cType) => {
                                  const info = {
                                    tip: { label: "💡 Advisory Tip" },
                                    warning: { label: "⚠️ Precaution" },
                                    important: { label: "📌 Key Takeaway" },
                                    success: { label: "✅ Best Practice" },
                                  }[cType];
                                  const isSelected = (block.calloutType || "tip") === cType;
                                  return (
                                    <button
                                      key={cType}
                                      type="button"
                                      onClick={() => handleUpdateBlock(idx, { calloutType: cType })}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                                        isSelected
                                          ? "bg-navy text-white border-navy shadow-xs"
                                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                      }`}
                                    >
                                      {info.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <input
                              type="text"
                              placeholder="Callout Headline (e.g. Advisory Note from Our CPAs)..."
                              value={block.title || ""}
                              onChange={(e) => handleUpdateBlock(idx, { title: e.target.value })}
                              className="w-full text-xs sm:text-sm font-bold text-navy bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:border-navy focus:outline-none"
                            />

                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">
                                  Callout guidance text (markdown links supported):
                                </span>
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    const textarea = document.getElementById(`block-callout-${idx}`) as HTMLTextAreaElement | null;
                                    openInsertLinkForCallout(idx, textarea);
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-md px-2 py-0.5 transition cursor-pointer"
                                >
                                  <Link2 className="size-3" />
                                  <span>Insert link</span>
                                </button>
                              </div>
                              <textarea
                                id={`block-callout-${idx}`}
                                rows={2}
                                placeholder="Type your advice, industry rule-of-thumb, or key principle..."
                                value={block.text || ""}
                                onChange={(e) => handleUpdateBlock(idx, { text: e.target.value })}
                                className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:border-navy focus:outline-none leading-relaxed resize-y"
                              />
                            </div>
                          </div>
                        ) : block.type === "stat" ? (
                          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                  Metric / Number
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 85% or $2.4M or 15+"
                                  value={block.statNumber || ""}
                                  onChange={(e) => handleUpdateBlock(idx, { statNumber: e.target.value })}
                                  className="w-full font-serif-hero text-xl sm:text-2xl font-bold text-navy bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:border-navy focus:outline-none"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                  Metric Context / Explanation
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Of restaurant operators reduce prime cost with proactive advisory..."
                                  value={block.statLabel || ""}
                                  onChange={(e) => handleUpdateBlock(idx, { statLabel: e.target.value })}
                                  className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus:bg-white focus:border-navy focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ) : block.type === "divider" ? (
                          <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl flex items-center justify-center gap-3">
                            <div className="h-px w-full bg-slate-300" />
                            <span className="text-xs text-slate-400 font-serif select-none">✦ Section Divider ✦</span>
                            <div className="h-px w-full bg-slate-300" />
                          </div>
                        ) : block.type === "ul" ? (
                          <div className="space-y-2">
                            {(block.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                                <input
                                  id={`block-ul-${idx}-${itemIdx}`}
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
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    const input = document.getElementById(`block-ul-${idx}-${itemIdx}`) as HTMLInputElement | null;
                                    openInsertLinkForBullet(idx, itemIdx, input);
                                  }}
                                  title="Insert link into bullet point"
                                  className="size-7 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center shrink-0 border border-slate-200 transition cursor-pointer"
                                >
                                  <Link2 className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextItems = (block.items || []).filter((_, i) => i !== itemIdx);
                                    handleUpdateBlock(idx, { items: nextItems });
                                  }}
                                  className="size-7 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0 cursor-pointer"
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
                              className="text-xs font-semibold text-navy hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="size-3" /> Add bullet point
                            </button>
                          </div>
                        ) : block.type === "ol" ? (
                          <div className="space-y-2">
                            {(block.items || []).map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <span className="size-6 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                                  {itemIdx + 1}
                                </span>
                                <input
                                  id={`block-ol-${idx}-${itemIdx}`}
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
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    const input = document.getElementById(`block-ol-${idx}-${itemIdx}`) as HTMLInputElement | null;
                                    openInsertLinkForNumberedList(idx, itemIdx, input);
                                  }}
                                  title="Insert link into numbered step"
                                  className="size-7 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center shrink-0 border border-slate-200 transition cursor-pointer"
                                >
                                  <Link2 className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextItems = (block.items || []).filter((_, i) => i !== itemIdx);
                                    handleUpdateBlock(idx, { items: nextItems });
                                  }}
                                  className="size-7 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0 cursor-pointer"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const nextItems = [
                                  ...(block.items || []),
                                  `Step ${(block.items?.length || 0) + 1} description`,
                                ];
                                handleUpdateBlock(idx, { items: nextItems });
                              }}
                              className="text-xs font-semibold text-navy hover:underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="size-3" /> Add numbered step
                            </button>
                          </div>
                        ) : block.type === "table" ? (
                          <div className="space-y-3">
                            {/* Table Control Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100/90 p-2.5 rounded-xl border border-slate-200">
                              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={block.hasHeader !== false}
                                  onChange={() => handleToggleTableHeader(idx)}
                                  className="size-4 rounded border-slate-300 text-navy focus:ring-navy"
                                />
                                <span>Include Header Row</span>
                              </label>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAddTableColumn(idx)}
                                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-navy transition shadow-2xs cursor-pointer"
                                >
                                  <Columns3 className="size-3 text-primary" /> + Add Column
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddTableRow(idx)}
                                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-navy transition shadow-2xs cursor-pointer"
                                >
                                  <Rows3 className="size-3 text-primary" /> + Add Row
                                </button>
                              </div>
                            </div>

                            {/* Horizontally Scrollable Table Canvas Styled to Match Site */}
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs -webkit-overflow-scrolling-touch">
                              <table className="w-full min-w-[500px] border-collapse text-left text-xs sm:text-sm">
                                {block.hasHeader !== false && (
                                  <thead className="bg-[#0e1b36] text-white">
                                    <tr>
                                      {(block.headers || []).map((header, colIdx) => (
                                        <th
                                          key={colIdx}
                                          className="p-2 border-r border-slate-700/60 last:border-r-0 relative group/th"
                                        >
                                          <div className="flex items-center gap-1">
                                            <input
                                              id={`block-table-header-${idx}-${colIdx}`}
                                              type="text"
                                              value={header}
                                              placeholder={`Column ${colIdx + 1}`}
                                              onChange={(e) =>
                                                handleUpdateTableHeader(idx, colIdx, e.target.value)
                                              }
                                              className="w-full bg-transparent font-serif-hero text-xs sm:text-sm font-semibold text-white placeholder:text-slate-400 border border-transparent focus:border-blue-400 rounded px-2 py-1 outline-none"
                                            />
                                            <button
                                              type="button"
                                              onMouseDown={(e) => e.preventDefault()}
                                              onClick={() => {
                                                const input = document.getElementById(`block-table-header-${idx}-${colIdx}`) as HTMLInputElement | null;
                                                openInsertLinkForTableHeader(idx, colIdx, input);
                                              }}
                                              title="Insert link into header"
                                              className="opacity-0 group-hover/th:opacity-100 size-5 rounded text-slate-300 hover:text-blue-300 hover:bg-slate-800 flex items-center justify-center shrink-0 transition cursor-pointer"
                                            >
                                              <Link2 className="size-3" />
                                            </button>
                                            {(block.headers || []).length > 1 && (
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteTableColumn(idx, colIdx)}
                                                title="Delete Column"
                                                className="opacity-0 group-hover/th:opacity-100 size-5 rounded text-slate-300 hover:text-red-400 hover:bg-slate-800 flex items-center justify-center shrink-0 transition cursor-pointer"
                                              >
                                                <X className="size-3" />
                                              </button>
                                            )}
                                          </div>
                                        </th>
                                      ))}
                                      <th className="w-8 p-1"></th>
                                    </tr>
                                  </thead>
                                )}
                                <tbody className="divide-y divide-slate-100">
                                  {(block.rows || []).map((row, rowIdx) => (
                                    <tr
                                      key={rowIdx}
                                      className="hover:bg-slate-50/60 transition group/tr"
                                    >
                                      {row.map((cell, colIdx) => (
                                        <td
                                          key={colIdx}
                                          className="p-2 border-r border-slate-100 last:border-r-0 relative group/cell"
                                        >
                                          <div className="flex items-start gap-1">
                                            <textarea
                                              id={`block-table-${idx}-${rowIdx}-${colIdx}`}
                                              rows={1}
                                              value={cell}
                                              placeholder="Enter text..."
                                              onChange={(e) =>
                                                handleUpdateTableCell(
                                                  idx,
                                                  rowIdx,
                                                  colIdx,
                                                  e.target.value
                                                )
                                              }
                                              className="w-full text-xs sm:text-sm text-slate-800 bg-transparent border border-transparent focus:border-navy focus:bg-white rounded px-2 py-1 outline-none resize-y"
                                            />
                                            <button
                                              type="button"
                                              onMouseDown={(e) => e.preventDefault()}
                                              onClick={() => {
                                                const textarea = document.getElementById(`block-table-${idx}-${rowIdx}-${colIdx}`) as HTMLTextAreaElement | null;
                                                openInsertLinkForTableCell(idx, rowIdx, colIdx, textarea);
                                              }}
                                              title="Insert link into cell"
                                              className="size-6 opacity-0 group-hover/cell:opacity-100 focus:opacity-100 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center shrink-0 transition cursor-pointer"
                                            >
                                              <Link2 className="size-3" />
                                            </button>
                                          </div>
                                        </td>
                                      ))}
                                      <td className="w-8 p-1 text-center align-middle">
                                        {(block.rows || []).length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteTableRow(idx, rowIdx)}
                                            title="Delete Row"
                                            className="opacity-0 group-hover/tr:opacity-100 size-6 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 inline-flex items-center justify-center transition cursor-pointer"
                                          >
                                            <Trash2 className="size-3" />
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Optional Caption */}
                            <input
                              type="text"
                              value={block.caption || ""}
                              placeholder="Optional table caption or source note..."
                              onChange={(e) => handleUpdateBlock(idx, { caption: e.target.value })}
                              className="w-full text-xs italic text-slate-500 bg-transparent border-b border-dashed border-slate-200 focus:border-navy outline-none px-1 py-1"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Use markdown <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[10px]">[text](url)</code> or click Insert link:
                                </span>
                                {(() => {
                                  const count = (block.text || "")
                                    .split(/\n\s*\n/)
                                    .filter((p) => p.trim().length > 0).length;
                                  if (count > 1) {
                                    return (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                                        <FileText className="size-3" />
                                        <span>Multi-paragraph ({count} paragraphs)</span>
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>

                              <div className="flex items-center gap-1.5">
                                {(() => {
                                  const count = (block.text || "")
                                    .split(/\n\s*\n/)
                                    .filter((p) => p.trim().length > 0).length;
                                  if (count > 1) {
                                    return (
                                      <button
                                        type="button"
                                        onClick={() => handleSplitParagraph(idx)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-md px-2 py-0.5 transition cursor-pointer"
                                        title="Split this multi-paragraph block into individual blocks"
                                      >
                                        <Sparkles className="size-3" />
                                        <span>Split into blocks</span>
                                      </button>
                                    );
                                  }
                                  return null;
                                })()}

                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    const textarea = document.getElementById(`block-p-${idx}`) as HTMLTextAreaElement | null;
                                    openInsertLinkForParagraph(idx, textarea);
                                  }}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-md px-2 py-0.5 transition cursor-pointer"
                                  title="Insert hyperlink into paragraph"
                                >
                                  <Link2 className="size-3" />
                                  <span>Insert link</span>
                                </button>
                              </div>
                            </div>
                            <textarea
                              id={`block-p-${idx}`}
                              rows={Math.max(3, Math.min(16, (block.text || "").split("\n").length + 1))}
                              placeholder="Write or paste your paragraph content (supports pasting multiple paragraphs)..."
                              value={block.text || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleUpdateBlock(idx, { text: val, html: linksToHtml(val) });
                              }}
                              className="w-full text-sm sm:text-base text-slate-800 bg-transparent border-none outline-none focus:ring-0 resize-y leading-relaxed"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Clean Floating In-line Add Bar */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200/80 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                          <Plus className="size-3.5 text-primary" /> Add Section to Article:
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          Click any block below to insert into your story
                        </span>
                      </div>

                      {/* Headings & Text */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full sm:w-auto sm:mr-1">
                          Headings:
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("h2")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 font-bold font-serif-hero cursor-pointer shadow-2xs"
                        >
                          <Heading className="size-3.5 mr-1 text-primary" /> H2 Section Heading
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("h3")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 font-semibold font-serif-hero cursor-pointer shadow-2xs"
                        >
                          <Heading className="size-3 mr-1 text-indigo-600" /> H3 Subheading
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("h4")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 font-medium cursor-pointer shadow-2xs"
                        >
                          <Heading className="size-3 mr-1 text-slate-600" /> H4 Minor Topic
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("p")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <AlignLeft className="size-3.5 mr-1 text-primary" /> Paragraph
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPasteArticleInput("");
                            setIsPasteArticleModalOpen(true);
                          }}
                          className="rounded-full text-xs h-8 px-3.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 font-semibold cursor-pointer shadow-2xs"
                        >
                          <Sparkles className="size-3.5 mr-1 text-blue-600" /> ⚡ Paste Full Article
                        </Button>
                      </div>

                      {/* Media & Visuals */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full sm:w-auto sm:mr-1">
                          Visuals &amp; Media:
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("image")}
                          className="rounded-full text-xs h-8 px-3.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300 font-semibold cursor-pointer shadow-2xs"
                        >
                          <ImageIcon className="size-3.5 mr-1.5 text-emerald-600" /> Insert Image
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("callout")}
                          className="rounded-full text-xs h-8 px-3.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-300 font-semibold cursor-pointer shadow-2xs"
                        >
                          <Lightbulb className="size-3.5 mr-1.5 text-blue-600" /> Advisory Callout
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("stat")}
                          className="rounded-full text-xs h-8 px-3.5 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border-indigo-300 font-semibold cursor-pointer shadow-2xs"
                        >
                          <TrendingUp className="size-3.5 mr-1.5 text-indigo-600" /> Key Metric Card
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("table")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <TableIcon className="size-3.5 mr-1 text-primary" /> Data Table
                        </Button>
                      </div>

                      {/* Lists & Accents */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full sm:w-auto sm:mr-1">
                          Lists &amp; Structure:
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("ul")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <List className="size-3.5 mr-1 text-primary" /> Bullet List
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("ol")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <ListOrdered className="size-3.5 mr-1 text-primary" /> Numbered Steps
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("blockquote")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <Quote className="size-3.5 mr-1 text-primary" /> Quote Highlight
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddBlock("divider")}
                          className="rounded-full text-xs h-8 px-3.5 bg-white text-slate-800 hover:bg-slate-100 border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <Minus className="size-3.5 mr-1 text-slate-400" /> Section Divider
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

            {/* TAB CONTENT: 2. PUBLISHING & SEO SETTINGS */}
            {editorSubTab === "settings" && (
              <div className="max-w-3xl mx-auto space-y-6">
                {renderSettingsCards(false)}
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab("edit");
                    setEditorSubTab("write");
                    setTimeout(() => {
                      if (editorRef.current) {
                        editorRef.current.innerHTML = blocksToHtml(currentPost.blocks);
                        handleWysiwygInput();
                      }
                    }, 50);
                  }}
                  className="gap-1.5 rounded-full text-navy border-slate-200 hover:bg-slate-100 h-8 text-xs font-semibold"
                >
                  <Edit3 className="size-3.5" /> Back to Editor
                </Button>

                {currentPost.slug && (
                  <a
                    href={`/${currentPost.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-3 h-8 text-xs font-semibold text-slate-700 shadow-2xs transition"
                  >
                    <ExternalLink className="size-3.5 text-blue-600" />
                    <span className="hidden sm:inline">Open in New Tab</span>
                  </a>
                )}
              </div>

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
              <BlogPostView
                post={currentPost}
                isResource={currentPost.destination === "resource"}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LINK INSERTION MODAL */}
        {/* ========================================================================= */}
        {linkModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Link2 className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0f2142]">Insert Hyperlink</h3>
                    <p className="text-[11px] text-slate-400">
                      Add an internal page or external web link
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLinkModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleApplyLink();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Display Text
                  </label>
                  <Input
                    value={linkModal.linkText}
                    onChange={(e) =>
                      setLinkModal((prev) => ({ ...prev, linkText: e.target.value }))
                    }
                    placeholder="Text to display (e.g. Tax Advisory Services)"
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Link Destination (URL)
                  </label>
                  <Input
                    value={linkModal.linkUrl}
                    onChange={(e) =>
                      setLinkModal((prev) => ({ ...prev, linkUrl: e.target.value }))
                    }
                    placeholder="/solutions/tax or https://..."
                    className="text-xs font-mono"
                    autoFocus
                  />
                  <div className="mt-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-[#142340] space-y-1">
                    <div className="font-semibold text-blue-700">Quick URL Guidelines:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      <li>
                        <strong>Internal:</strong> Use <code className="bg-white px-1 py-0.5 rounded text-blue-800 font-mono text-[10px]">/solutions/tax</code>, <code className="bg-white px-1 py-0.5 rounded text-blue-800 font-mono text-[10px]">/contact</code>, etc. (opens in same tab).
                      </li>
                      <li>
                        <strong>External:</strong> Use full URL <code className="bg-white px-1 py-0.5 rounded text-blue-800 font-mono text-[10px]">https://...</code> (opens securely in new tab).
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setLinkModal((prev) => ({ ...prev, isOpen: false }))}
                    className="text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#0f2142] hover:bg-blue-700 text-white font-bold text-xs h-8 px-4"
                  >
                    Insert Link
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FULL ARTICLE BULK PASTE / IMPORTER MODAL */}
        {/* ========================================================================= */}
        {isPasteArticleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-blue-50 text-[#1b4e94] flex items-center justify-center shadow-2xs">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-hero text-lg sm:text-xl font-bold text-navy">
                      Paste Full Article / Bulk Importer
                    </h3>
                    <p className="text-xs text-slate-500">
                      Paste your entire draft from Word, Google Docs, or ChatGPT in one quick step.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasteArticleModalOpen(false)}
                  className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Import Mode Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPasteMode("smart")}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    pasteMode === "smart"
                      ? "border-[#1b4e94] bg-blue-50/50 text-[#1b4e94] ring-2 ring-[#1b4e94]/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1 text-navy">
                    <Sparkles className="size-3.5 text-[#1b4e94]" />
                    <span>Smart Structured Blocks (Recommended)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Automatically detects Headings (H2/H3), bullet points, numbered lists, and paragraphs.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPasteMode("single")}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    pasteMode === "single"
                      ? "border-[#1b4e94] bg-blue-50/50 text-[#1b4e94] ring-2 ring-[#1b4e94]/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1 text-navy">
                    <FileText className="size-3.5 text-[#1b4e94]" />
                    <span>Single Continuous Content Block</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Keeps the entire article inside one continuous block, preserving all paragraphs on the live site.
                  </p>
                </button>
              </div>

              {/* Paste Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Paste Article Content:
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {pasteArticleInput.trim()
                      ? `${pasteArticleInput.trim().split(/\s+/).length} words • ${
                          pasteArticleInput.split(/\n\s*\n/).filter(Boolean).length
                        } sections`
                      : "Word, Google Docs, ChatGPT & Markdown supported"}
                  </span>
                </div>
                <textarea
                  rows={11}
                  value={pasteArticleInput}
                  onChange={(e) => setPasteArticleInput(e.target.value)}
                  placeholder={`Paste your complete article draft here...\n\nExample:\n## 1. Executive Summary\nProactive financial advisory is critical for scaling businesses.\n\n## 2. Key Action Items\n* Reconcile accounts weekly\n* Monitor gross margins closely\n\nWhen ready, click "Convert & Import Article" below!`}
                  className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:bg-white focus:border-[#1b4e94] focus:outline-none leading-relaxed resize-y font-mono"
                />
              </div>

              {/* Destination Action & Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="pasteAction"
                      checked={pasteAction === "append"}
                      onChange={() => setPasteAction("append")}
                      className="text-[#1b4e94] focus:ring-[#1b4e94]"
                    />
                    <span>Add to existing content</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="pasteAction"
                      checked={pasteAction === "replace"}
                      onChange={() => setPasteAction("replace")}
                      className="text-[#1b4e94] focus:ring-[#1b4e94]"
                    />
                    <span>Replace current content</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPasteArticleModalOpen(false)}
                    className="rounded-full text-xs font-semibold px-4 h-9 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={!pasteArticleInput.trim()}
                    onClick={() => handleExecuteFullArticleImport()}
                    className="rounded-full bg-[#1b4e94] hover:bg-[#153e77] text-white text-xs font-bold px-5 h-9 gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Convert &amp; Import Article</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inline Image Picker Modal for Document WYSIWYG */}
        <MediaImagePickerModal
          isOpen={isInlineImageModalOpen}
          onClose={() => setIsInlineImageModalOpen(false)}
          onSelect={(url) => {
            insertImageIntoEditor(url);
            setIsInlineImageModalOpen(false);
          }}
          title="Insert Image into Document"
        />

        {/* Table Cell Right-Click Context Menu */}
        {tableContextMenu.isOpen && (
          <div
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 w-52 text-xs font-medium text-slate-700 animate-in fade-in-50 zoom-in-95 table-context-menu"
            style={{ top: `${tableContextMenu.y}px`, left: `${tableContextMenu.x}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
              <span>Cell ({tableContextMenu.isHeader ? "Header" : `Row ${tableContextMenu.rowIndex + 1}`}, Col {tableContextMenu.colIndex + 1})</span>
              <button
                type="button"
                onClick={() => setTableContextMenu((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (tableContextMenu.tr && tableContextMenu.table) {
                  insertRowAbove(tableContextMenu.tr, tableContextMenu.table);
                }
                setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 cursor-pointer transition"
            >
              <ArrowUp className="size-3.5 text-blue-600" />
              <span>Insert Row Above</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (tableContextMenu.tr && tableContextMenu.table) {
                  insertRowBelow(tableContextMenu.tr, tableContextMenu.table);
                }
                setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 cursor-pointer transition"
            >
              <ArrowDown className="size-3.5 text-blue-600" />
              <span>Insert Row Below</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (tableContextMenu.tr && tableContextMenu.table) {
                  deleteSpecificRow(tableContextMenu.tr, tableContextMenu.table);
                }
                setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer transition"
            >
              <Trash2 className="size-3.5 text-red-500" />
              <span>Delete This Row</span>
            </button>

            <div className="h-px bg-slate-100 my-1" />

            <button
              type="button"
              onClick={() => {
                if (tableContextMenu.table) {
                  insertColumnLeft(tableContextMenu.colIndex, tableContextMenu.table);
                }
                setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 cursor-pointer transition"
            >
              <ArrowLeft className="size-3.5 text-blue-600" />
              <span>Insert Column Left</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (tableContextMenu.table) {
                  insertColumnRight(tableContextMenu.colIndex, tableContextMenu.table);
                }
                setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 cursor-pointer transition"
            >
              <ArrowRight className="size-3.5 text-blue-600" />
              <span>Insert Column Right</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (tableContextMenu.table) {
                  deleteSpecificColumn(tableContextMenu.colIndex, tableContextMenu.table);
                }
                setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer transition"
            >
              <Trash2 className="size-3.5 text-red-500" />
              <span>Delete This Column</span>
            </button>

            <div className="h-px bg-slate-100 my-1" />

            <button
              type="button"
              onClick={() => {
                if (tableContextMenu.cell) {
                  tableContextMenu.cell.textContent = "";
                  handleWysiwygInput();
                }
                setTableContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-600 flex items-center gap-2 cursor-pointer transition"
            >
              <RotateCcw className="size-3.5 text-slate-400" />
              <span>Clear Cell Content</span>
            </button>
          </div>
        )}
      </main>

      {/* Global Site Footer */}
      <Footer />
    </div>
  );
}
