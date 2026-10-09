import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Info,
  AlertTriangle,
  Layers,
  Layout,
  Smartphone,
  History,
  Palette,
  Send,
  HelpCircle,
  FileCode2,
  Menu,
  RotateCcw,
  Zap,
  Bookmark,
  Hash,
  ShieldCheck,
  MousePointerClick,
  Sliders,
  CornerDownRight,
  Terminal,
  Grid,
  Image as ImageIcon,
  Type,
  Maximize,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";
import {
  DOC_SECTIONS,
  BRAND_COLORS,
  FAQ_ITEMS,
  GLOSSARY_ITEMS,
  type DocSection,
} from "@/data/docsContent";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Visual CMS User Guide & Documentation | SMG ABA" },
      {
        name: "description",
        content:
          "Comprehensive user guide for the SMG ABA Visual CMS page builder. Step-by-step instructions, block library, screenshot walkthroughs, and publishing checklist.",
      },
    ],
  }),
  component: DocsPage,
});

export function DocsPage() {
  const [activeSectionId, setActiveSectionId] = useState<string>("welcome");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerFilter, setDrawerFilter] = useState("");
  const [inPageTocExpanded, setInPageTocExpanded] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>({});

  // Initial hash scroll on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSectionId(hash);
        }, 150);
      }
    }
  }, []);

  // Keyboard shortcut for search (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        if (lightboxImage) setLightboxImage(null);
        if (isSearchOpen) setIsSearchOpen(false);
        if (mobileDrawerOpen) setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage, isSearchOpen, mobileDrawerOpen]);

  // Scroll-spy observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // pick the topmost visible section
          const sorted = visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveSectionId(sorted[0].target.id);
        }
      },
      {
        rootMargin: "-90px 0px -60% 0px",
        threshold: 0,
      }
    );

    const sectionElements = document.querySelectorAll("section[data-doc-section]");
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Copy Color Hex
  const handleCopyHex = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`Copied ${name} (${hex}) to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Copy Direct Section Anchor Link
  const handleCopySectionLink = (id: string, title: string) => {
    const url = `${window.location.origin}/docs#${id}`;
    navigator.clipboard.writeText(url);
    toast.success(`Copied direct link to "${title}"`);
  };

  // Toggle Checklist Item
  const toggleChecklistItem = (idx: number) => {
    setChecklistState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedChecksCount = Object.values(checklistState).filter(Boolean).length;

  // Search Results indexing
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    const results: {
      id: string;
      title: string;
      category: string;
      snippet: string;
      targetId: string;
    }[] = [];

    // Search Sections
    DOC_SECTIONS.forEach((sec) => {
      if (sec.title.toLowerCase().includes(q) || sec.summary.toLowerCase().includes(q)) {
        results.push({
          id: `sec-${sec.id}`,
          title: `${sec.number}. ${sec.title}`,
          category: "Guide Section",
          snippet: sec.summary,
          targetId: sec.id,
        });
      }
      sec.subsections?.forEach((sub) => {
        if (sub.title.toLowerCase().includes(q)) {
          results.push({
            id: `sub-${sub.id}`,
            title: sub.title,
            category: `Section ${sec.number}`,
            snippet: `Jump directly to ${sub.title}`,
            targetId: sub.id,
          });
        }
      });
    });

    // Search FAQs
    FAQ_ITEMS.forEach((faq, idx) => {
      if (faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)) {
        results.push({
          id: `faq-${idx}`,
          title: faq.question,
          category: "FAQ",
          snippet: faq.answer,
          targetId: "troubleshooting-faq",
        });
      }
    });

    // Search Brand Colors
    BRAND_COLORS.forEach((color) => {
      if (
        color.name.toLowerCase().includes(q) ||
        color.hex.toLowerCase().includes(q) ||
        color.usage.toLowerCase().includes(q)
      ) {
        results.push({
          id: `color-${color.hex}`,
          title: `${color.name} (${color.hex})`,
          category: "Brand Color",
          snippet: color.usage,
          targetId: "brand-colors",
        });
      }
    });

    // Search Glossary
    GLOSSARY_ITEMS.forEach((item, idx) => {
      if (item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q)) {
        results.push({
          id: `glossary-${idx}`,
          title: item.term,
          category: "Glossary Term",
          snippet: item.definition,
          targetId: "glossary",
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery]);

  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(targetId);
      window.history.pushState(null, "", `#${targetId}`);
    }
    setIsSearchOpen(false);
    setMobileDrawerOpen(false);
  };

  // Find active section object
  const activeSectionIndex = DOC_SECTIONS.findIndex((s) => s.id === activeSectionId || s.subsections?.some((sub) => sub.id === activeSectionId));
  const currentSection = DOC_SECTIONS[activeSectionIndex >= 0 ? activeSectionIndex : 0];
  const prevSection = activeSectionIndex > 0 ? DOC_SECTIONS[activeSectionIndex - 1] : null;
  const nextSection = activeSectionIndex >= 0 && activeSectionIndex < DOC_SECTIONS.length - 1 ? DOC_SECTIONS[activeSectionIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] text-[#0f2142] antialiased">
      <Header />

      {/* Sub-Header / Quick Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/70 text-[#0f2142] text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              aria-label="Open Table of Contents"
            >
              <BookOpen className="w-4 h-4 text-[#2563eb]" />
              <span className="max-w-[130px] sm:max-w-[190px] truncate">
                {currentSection.number}. {currentSection.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#0f2142] text-white font-bold text-xs shadow-sm">
                DOCS
              </span>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Visual CMS Manual
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                v1.0 (Live)
              </span>
            </div>
          </div>

          {/* Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-md flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-500 text-sm transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span className="text-slate-500 text-xs sm:text-sm">Search documentation...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono text-slate-500 shadow-2xs">
              <span className="text-xs">Ctrl</span> K
            </kbd>
          </button>

          {/* Quick Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0f2142] hover:bg-slate-100 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              to="/cms"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0f2142] text-white hover:bg-[#1b3668] transition-all shadow-xs"
            >
              <Layout className="w-3.5 h-3.5" />
              Open CMS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 items-start">
          
          {/* ================= DESKTOP STICKY SIDEBAR ================= */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-3 py-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Table of Contents
                </h3>
                <nav className="space-y-1">
                  {DOC_SECTIONS.map((section) => {
                    const isSectionActive =
                      activeSectionId === section.id ||
                      section.subsections?.some((sub) => sub.id === activeSectionId);

                    return (
                      <div key={section.id} className="space-y-1">
                        <button
                          onClick={() => scrollToTarget(section.id)}
                          className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                            isSectionActive
                              ? "bg-[#0f2142] text-white shadow-xs font-semibold"
                              : "text-slate-600 hover:text-[#0f2142] hover:bg-slate-100/80"
                          }`}
                        >
                          <span
                            className={`shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                              isSectionActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                            }`}
                          >
                            {section.number}
                          </span>
                          <span className="leading-snug pt-0.5">{section.title}</span>
                        </button>

                        {/* Nested Subsections */}
                        {section.subsections && (
                          <div className="ml-7 pl-2 border-l border-slate-200 space-y-0.5 my-1">
                            {section.subsections.map((sub) => {
                              const isSubActive = activeSectionId === sub.id;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => scrollToTarget(sub.id)}
                                  className={`w-full text-left block px-2 py-1 rounded text-[11px] transition-colors ${
                                    isSubActive
                                      ? "text-[#2563eb] font-semibold bg-blue-50/70"
                                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                  }`}
                                >
                                  {sub.title}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Version & Help Info Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
                  Need Live Assistance?
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Have a question not covered in this guide? Check the Troubleshooting FAQ or contact your web team.
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Version: v1.0</span>
                  <span>Commit: 18afd2e</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= MAIN CONTENT AREA ================= */}
          <main className="flex-1 min-w-0 max-w-4xl bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
            
            {/* Breadcrumb Header */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 pb-4 border-b border-slate-100">
              <Link to="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-700">Documentation</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#2563eb] font-semibold truncate">
                {currentSection.title}
              </span>
            </nav>

            {/* Document Title Banner */}
            <div className="mb-8 pb-6 border-b border-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563eb] text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Official SMG ABA Manual
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2142] tracking-tight mb-3">
                SMG ABA Visual CMS: Complete Staff & Volunteer Guide
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                A simple, non-technical guide to creating, updating, and publishing web pages safely using the drag-and-drop visual page builder.
              </p>
            </div>

            {/* In-Page Table of Contents (Mobile & Desktop Friendly) */}
            <div className="mb-12 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#0f2142]">
                      Table of Contents
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      12 Guide Sections · Click any topic to jump directly
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInPageTocExpanded(!inPageTocExpanded)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                  aria-expanded={inPageTocExpanded}
                >
                  <span>{inPageTocExpanded ? "Hide" : "Show All"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${inPageTocExpanded ? "rotate-180" : ""}`} />
                </button>
              </div>

              {inPageTocExpanded && (
                <nav aria-label="Table of Contents Quick Jump" className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-200">
                  {DOC_SECTIONS.map((sec) => {
                    const isSecActive = activeSectionId === sec.id || sec.subsections?.some((sub) => sub.id === activeSectionId);
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollToTarget(sec.id)}
                        className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 group ${
                          isSecActive
                            ? "bg-blue-50/80 border-blue-300 text-[#0f2142] shadow-2xs"
                            : "bg-white border-slate-200/80 text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isSecActive ? "bg-[#2563eb] text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        }`}>
                          {sec.number}
                        </span>
                        <div className="overflow-hidden flex-1">
                          <div className={`text-xs font-bold truncate ${isSecActive ? "text-[#2563eb]" : "text-slate-900 group-hover:text-[#2563eb]"}`}>
                            {sec.title}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {sec.summary}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Content Sections */}
            <div className="space-y-16">

              {/* ================= 1. WELCOME ================= */}
              <section id="welcome" data-doc-section className="scroll-mt-24 space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      01
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      1. Welcome to the CMS
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("welcome", "1. Welcome to the CMS")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    title="Copy section link"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn what the Visual Content Management System (CMS) is and how you can use it to build and maintain pages without writing code.
                </p>

                <p className="text-slate-700 leading-relaxed">
                  The SMG ABA Content Management System is a visual website builder designed specifically for your organization. You do not need technical knowledge or programming experience to create pages, update text, upload images, or announce events.
                </p>

                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> What you can do with this system:
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Create full visual pages with drag-and-drop building blocks.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Edit headlines, paragraphs, button links, and team info in real time.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Switch between desktop, tablet, and mobile views instantly.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Publish changes immediately or save drafts to finish later.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Revert back to earlier saved versions if you make a mistake.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Write and publish articles using the built-in <strong>Blog Studio</strong>.</span>
                    </li>
                  </ul>
                </div>

                {/* Callout Note */}
                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs leading-relaxed">
                  <Info className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-sm mb-0.5">Draft Isolation Protection:</strong>
                    All changes are safely isolated in draft mode until you explicitly click the <strong>Publish</strong> button. You can freely practice and test layouts without affecting the live website.
                  </div>
                </div>

                {/* Screenshot SS-001 */}
                <figure className="space-y-2">
                  <div
                    onClick={() =>
                      setLightboxImage({
                        src: "/docs-screenshots/SS-001_dashboard-overview.png",
                        alt: "Admin Command Center showing quick stats and workspace module cards",
                        caption: "Screenshot SS-001: Admin Command Center with CMS Visual Page Builder card highlighted.",
                      })
                    }
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                  >
                    <img
                      src="/docs-screenshots/SS-001_dashboard-overview.png"
                      alt="Admin Command Center showing quick stats and workspace module cards"
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-xs font-semibold text-slate-800 shadow-md">
                        <Maximize2 className="w-3.5 h-3.5 text-[#2563eb]" /> Click to zoom screenshot
                      </span>
                    </div>
                  </div>
                  <figcaption className="text-xs text-center text-slate-500 italic">
                    Figure 1.1: Admin Command Center showing quick stats and workspace module cards.
                  </figcaption>
                </figure>
              </section>

              {/* ================= 2. QUICK START ================= */}
              <section id="quick-start" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      02
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      2. Quick Start: Build Your First Page in 10 Minutes
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("quick-start", "2. Quick Start")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn the 5 basic steps to create a new page, customize its content, and publish it live on the website.
                </p>

                {/* Steps Cards */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                      Open the Admin Command Center
                    </h3>
                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-2">
                      <li>Navigate to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">/dashboard</code> in your browser.</li>
                      <li>Enter your administrator password into the <strong>Admin Password</strong> field.</li>
                      <li>Click <strong>Unlock Dashboard</strong>.</li>
                    </ol>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                      Create a New Page
                    </h3>
                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1.5 pl-2">
                      <li>Click the <strong>CMS Visual Page Builder</strong> card or navigate directly to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">/cms</code>.</li>
                      <li>Click the <strong>+ New Page</strong> button in the top right corner.</li>
                      <li>Enter your page title (for example, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">Annual Charity Golf Outing</code>).</li>
                      <li>
                        Choose a starting template (such as <strong>Events & Webinar Page</strong> or <strong>Blank Page</strong>). Available starters include:
                        <div className="mt-1 flex flex-wrap gap-1.5 pl-2">
                          {["Blank Page", "About Page", "Services & Solutions", "Events & Webinar", "Photo Gallery", "Contact & Consultation"].map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-white border border-slate-300 text-[11px] font-medium text-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </li>
                      <li>Click <strong>Create Page</strong>. The visual editor will open immediately.</li>
                    </ol>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <figure>
                        <div
                          onClick={() =>
                            setLightboxImage({
                              src: "/docs-screenshots/SS-002_cms-pages-list.png",
                              alt: "CMS page directory showing list of pages with draft and published badges",
                              caption: "Screenshot SS-002: CMS page directory showing list of pages with draft and published badges.",
                            })
                          }
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white"
                        >
                          <img
                            src="/docs-screenshots/SS-002_cms-pages-list.png"
                            alt="CMS page directory"
                            loading="lazy"
                            className="w-full h-36 object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2 py-1 rounded bg-white text-[11px] font-medium text-slate-800 shadow">
                              Zoom SS-002
                            </span>
                          </div>
                        </div>
                        <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 2.1: CMS Page Directory</figcaption>
                      </figure>

                      <figure>
                        <div
                          onClick={() =>
                            setLightboxImage({
                              src: "/docs-screenshots/SS-003_create-new-page-templates.png",
                              alt: "Create new page screen with title input, URL slug, and starter template cards",
                              caption: "Screenshot SS-003: Create new page screen with title input, URL slug, and starter template cards.",
                            })
                          }
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white"
                        >
                          <img
                            src="/docs-screenshots/SS-003_create-new-page-templates.png"
                            alt="Create new page templates"
                            loading="lazy"
                            className="w-full h-36 object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2 py-1 rounded bg-white text-[11px] font-medium text-slate-800 shadow">
                              Zoom SS-003
                            </span>
                          </div>
                        </div>
                        <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 2.2: Page Starter Templates</figcaption>
                      </figure>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                      Add and Edit Blocks
                    </h3>
                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-2">
                      <li>On the left side of your screen, look for the block list (under <strong>Basics</strong> and <strong>Sections</strong>).</li>
                      <li>Click and drag a block (for example, <strong>Top Banner</strong> or <strong>Cards Grid</strong>) onto the canvas in the center.</li>
                      <li>Click on the block you just dropped. A blue outline will highlight it.</li>
                      <li>On the right side panel, edit the text, headline, or button links.</li>
                    </ol>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white text-[11px] flex items-center justify-center font-bold">4</span>
                      Check Mobile View
                    </h3>
                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-2">
                      <li>Look at the top bar in the center.</li>
                      <li>Click the <strong>Phone</strong> button in the top bar to switch to the 390px mobile view.</li>
                      <li>Verify that your headlines, buttons, and pictures fit neatly on mobile screens.</li>
                      <li>Click the <strong>Desktop</strong> button to return to the full desktop view (1280px).</li>
                    </ol>
                  </div>

                  {/* Step 5 */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-emerald-950">
                    <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">5</span>
                      Save and Publish
                    </h3>
                    <ol className="list-decimal list-inside text-xs text-emerald-900 space-y-1 pl-2">
                      <li>Click <strong>Save Draft</strong> at any time to save your progress.</li>
                      <li>When your page is ready, click <strong>Publish Page</strong> in the top bar.</li>
                      <li>A <strong>Publish Page Live</strong> confirmation dialog opens, showing the exact URL your page will go live at.</li>
                      <li>Click <strong>Confirm & Go Live</strong>. Your page is now live on the website!</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* ================= 3. SCREEN TOUR ================= */}
              <section id="screen-tour" data-doc-section className="scroll-mt-24 space-y-8 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      03
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      3. Screen Tour: Understanding the Workspace
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("screen-tour", "3. Screen Tour")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn about the four main areas of the Visual Editor: the Top Bar, the Left Block Drawer, the Center Canvas, and the Right Settings Panel.
                </p>

                {/* Screenshot SS-004 Overview */}
                <figure className="space-y-2">
                  <div
                    onClick={() =>
                      setLightboxImage({
                        src: "/docs-screenshots/SS-004_visual-editor-layout.png",
                        alt: "Visual editor showing top bar, left block drawer, canvas, and right settings panel",
                        caption: "Screenshot SS-004: Visual Editor layout with numbered badges 1–4 (top bar, drawer, canvas, panel).",
                      })
                    }
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-all hover:border-blue-400"
                  >
                    <img
                      src="/docs-screenshots/SS-004_visual-editor-layout.png"
                      alt="Visual editor showing top bar, left block drawer, canvas, and right settings panel"
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-slate-800 shadow">
                        Zoom SS-004 Workspace Layout
                      </span>
                    </div>
                  </div>
                  <figcaption className="text-xs text-center text-slate-500 italic">
                    Figure 3.1: Visual Editor workspace layout with 4 core zones.
                  </figcaption>
                </figure>

                {/* 3.1 The Top Bar */}
                <div id="top-bar" className="scroll-mt-24 space-y-4 pl-4 border-l-2 border-[#2563eb]">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    3.1 The Top Bar
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    The sticky bar at the very top of your screen contains your primary page controls:
                  </p>

                  <figure className="space-y-1">
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: "/docs-screenshots/SS-005_top-bar-controls.png",
                          alt: "Top bar with device viewports, undo/redo, save draft, and publish controls",
                          caption: "Screenshot SS-005: Top bar close-up with device viewports, undo/redo, save draft, and publish controls.",
                        })
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                    >
                      <img
                        src="/docs-screenshots/SS-005_top-bar-controls.png"
                        alt="Top bar controls"
                        loading="lazy"
                        className="w-full h-auto"
                      />
                    </div>
                    <figcaption className="text-[11px] text-slate-500 text-center">Fig 3.2: Top Bar Controls</figcaption>
                  </figure>

                  <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>&lt; Pages</strong>: Returns to the main CMS page list.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Page Title</strong>: Shows the current page title.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Saved Indicator</strong>: Shows when the page was last saved.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Undo / Redo</strong>: Quick steps back/forward (<code className="font-mono text-[10px]">Ctrl+Z</code> / <code className="font-mono text-[10px]">Ctrl+Y</code>).
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Device Viewports</strong>: Desktop (1280px), Tablet (820px), Phone (390px).
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Animations Toggle</strong>: Toggles scroll animations on/off while editing.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Revision History</strong>: Clock icon to open snapshots and restore points.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>SEO & Social</strong>: Configures meta title, description, and social share card.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Duplicate</strong>: Clones the current page into a fresh draft.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Add to Nav</strong>: Adds the page to website header menu or footer.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Save Draft</strong>: Saves work safely to cloud storage.
                    </li>
                    <li className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Publish</strong>: Runs confirmation check and makes page live.
                    </li>
                  </ul>
                </div>

                {/* 3.2 The Left Panel */}
                <div id="left-panel" className="scroll-mt-24 space-y-4 pl-4 border-l-2 border-[#2563eb]">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    3.2 The Left Panel (Blocks Drawer)
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    The left panel contains all the building blocks you can drag and drop onto your page.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 items-center">
                    <figure>
                      <div
                        onClick={() =>
                          setLightboxImage({
                            src: "/docs-screenshots/SS-006_left-blocks-drawer.png",
                            alt: "Left block drawer with search box and block categories",
                            caption: "Screenshot SS-006: Left block drawer with search box and block categories.",
                          })
                        }
                        className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img
                          src="/docs-screenshots/SS-006_left-blocks-drawer.png"
                          alt="Left block drawer"
                          loading="lazy"
                          className="w-full h-auto max-h-64 object-cover object-top"
                        />
                      </div>
                      <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 3.3: Left Blocks Drawer</figcaption>
                    </figure>

                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block mb-0.5">Search Box:</strong>
                        Type any block name (such as <code className="font-mono text-[10px] bg-slate-200 px-1 py-0.5 rounded">Button</code>, <code className="font-mono text-[10px] bg-slate-200 px-1 py-0.5 rounded">Gallery</code>, <code className="font-mono text-[10px] bg-slate-200 px-1 py-0.5 rounded">FAQ</code>) to filter instantly.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block mb-0.5">Basics Category:</strong>
                        Core elements: Heading, Text, Image, Button, Spacer, and Divider.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block mb-0.5">Sections Category:</strong>
                        Pre-styled rich blocks: Top Banner, Cards Grid, Photo Gallery, FAQ, CTA, Stats, Steps, and Testimonials.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block mb-0.5">Advanced Category:</strong>
                        Columns Layout, Container Section, Video Player, Calendly, and Notice Box.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3.3 The Center Canvas */}
                <div id="center-canvas" className="scroll-mt-24 space-y-4 pl-4 border-l-2 border-[#2563eb]">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    3.3 The Center Canvas
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    The center canvas is your live interactive preview area:
                  </p>

                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5 pl-1">
                    <li>Hovering your mouse over any block displays a dashed outline with the block's name.</li>
                    <li>Clicking any block highlights it with a solid blue outline and opens its settings on the right panel.</li>
                    <li>Above a selected block, a floating action toolbar appears with <strong>Move Up</strong>, <strong>Move Down</strong>, <strong>Duplicate</strong>, and <strong>Delete</strong> buttons.</li>
                    <li>Hovering between sections displays a dashed line with a <strong>+ Add Section</strong> button to insert new content directly between existing blocks.</li>
                    <li>At the very bottom of the page, click <strong>+ Add Blank Section Beneath</strong> to append a clean container.</li>
                  </ul>

                  <figure className="space-y-1 pt-1">
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: "/docs-screenshots/SS-007_canvas-selection-toolbar.png",
                          alt: "Canvas showing selected Cards Grid block with floating action toolbar",
                          caption: "Screenshot SS-007: Selected block on the canvas with floating action toolbar.",
                        })
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                    >
                      <img
                        src="/docs-screenshots/SS-007_canvas-selection-toolbar.png"
                        alt="Canvas selection toolbar"
                        loading="lazy"
                        className="w-full h-auto"
                      />
                    </div>
                    <figcaption className="text-[11px] text-slate-500 text-center">Fig 3.4: Floating Block Action Toolbar on Canvas</figcaption>
                  </figure>
                </div>

                {/* 3.4 The Right Settings Panel */}
                <div id="right-panel" className="scroll-mt-24 space-y-4 pl-4 border-l-2 border-[#2563eb]">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    3.4 The Right Settings Panel
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    The right panel contains customizable properties of whichever block is currently selected on the canvas.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 items-center">
                    <figure>
                      <div
                        onClick={() =>
                          setLightboxImage({
                            src: "/docs-screenshots/SS-008_right-settings-panel.png",
                            alt: "Right settings panel showing Content, Style, Layout, and Motion tabs",
                            caption: "Screenshot SS-008: Right settings panel with tabs for Content, Style, Layout, and Motion.",
                          })
                        }
                        className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img
                          src="/docs-screenshots/SS-008_right-settings-panel.png"
                          alt="Right settings panel"
                          loading="lazy"
                          className="w-full h-auto max-h-72 object-cover object-top"
                        />
                      </div>
                      <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 3.5: Right Settings Panel</figcaption>
                    </figure>

                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block">Breadcrumb Navigation:</strong>
                        Shows element hierarchy (e.g. <code className="text-[11px]">Page &gt; Container &gt; Button</code>). Click any item to select the parent section.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block">Search Settings:</strong>
                        Type keywords like <code className="text-[11px]">color</code>, <code className="text-[11px]">font</code>, <code className="text-[11px]">shadow</code>, or <code className="text-[11px]">link</code> to find settings instantly.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900 block">4 Main Tabs:</strong>
                        <ol className="list-decimal list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                          <li><strong>Content:</strong> Text, headlines, images, button links.</li>
                          <li><strong>Style:</strong> Colors, fonts, shadows, corner curves.</li>
                          <li><strong>Layout:</strong> Width, height, margin spacing, alignment.</li>
                          <li><strong>Motion:</strong> Entrance effects and hover animations.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3.5 The Empty State */}
                <div id="empty-state" className="scroll-mt-24 space-y-4 pl-4 border-l-2 border-[#2563eb]">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    3.5 The Empty State (Page-Level Settings)
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    When no block on the canvas is selected, the right panel automatically shows page-level settings:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 items-center">
                    <figure>
                      <div
                        onClick={() =>
                          setLightboxImage({
                            src: "/docs-screenshots/SS-009_empty-state-page-settings.png",
                            alt: "Right panel empty state showing page-level settings",
                            caption: "Screenshot SS-009: Right panel empty state with Page Title, SEO Metadata, and Header Banner settings.",
                          })
                        }
                        className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img
                          src="/docs-screenshots/SS-009_empty-state-page-settings.png"
                          alt="Empty state page settings"
                          loading="lazy"
                          className="w-full h-auto max-h-64 object-cover object-top"
                        />
                      </div>
                      <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 3.6: Page-Level Settings Empty State</figcaption>
                    </figure>

                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-2">
                      <li className="p-2 rounded bg-slate-50 border border-slate-200">
                        <strong>Page Title:</strong> View and edit the internal name of your page. Click <strong>Edit</strong>, change the text, and click <strong>Save</strong>.
                      </li>
                      <li className="p-2 rounded bg-slate-50 border border-slate-200">
                        <strong>SEO & Social Metadata:</strong> Click this card to open the SEO drawer and configure Google search snippets and social share images.
                      </li>
                      <li className="p-2 rounded bg-slate-50 border border-slate-200">
                        <strong>Header Banner:</strong> Toggle the top photographic background hero banner on or off with one click.
                      </li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* ================= 4. BLOCKS LIBRARY GUIDE ================= */}
              <section id="blocks-library" data-doc-section className="scroll-mt-24 space-y-8 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      04
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      4. Blocks Library Guide
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("blocks-library", "4. Blocks Library Guide")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn about all 21 blocks available in the CMS, when to use each one, and how to configure them.
                </p>

                {/* 4.1 Basics Category */}
                <div id="basics-category" className="scroll-mt-24 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Type className="w-4 h-4 text-[#2563eb]" /> 4.1 Basics Category
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Heading */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <h4 className="font-bold text-sm text-[#0f2142]">Heading</h4>
                      <p><strong>When to use:</strong> For major section titles, subheadings, and topic dividers.</p>
                      <p><strong>What you can edit:</strong> Text copy, Heading Level (<code className="text-[11px]">H1</code> to <code className="text-[11px]">H6</code>), Alignment (Left, Center, Right), color, and margins.</p>
                      <p className="text-slate-500"><strong>Mobile:</strong> Automatically scales down to avoid overflow.</p>
                    </div>

                    {/* Text */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <h4 className="font-bold text-sm text-[#0f2142]">Text (Rich Text)</h4>
                      <p><strong>When to use:</strong> For paragraphs, descriptions, announcements, and narrative copy.</p>
                      <p><strong>What you can edit:</strong> Text with full formatting (Bold, Italic, Bullet points, Numbered lists, Links).</p>
                      <p className="text-slate-500"><strong>Mobile:</strong> Wraps cleanly with comfortable reading line heights.</p>
                    </div>

                    {/* Image */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <h4 className="font-bold text-sm text-[#0f2142]">Image</h4>
                      <p><strong>When to use:</strong> For photos, flyers, partner logos, or event banners.</p>
                      <p><strong>What you can edit:</strong> Upload from computer, media library, Alt text, Corner rounding (None, Small, Medium, Large, Pill), and Lightbox zoom.</p>
                      <p className="text-slate-500"><strong>Mobile:</strong> 100% width with aspect ratio preserved.</p>
                    </div>

                    {/* Button */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <h4 className="font-bold text-sm text-[#0f2142]">Button</h4>
                      <p><strong>When to use:</strong> For calls to action (e.g. <em>Register Now</em>, <em>Donate Today</em>, <em>Contact Us</em>).</p>
                      <p><strong>What you can edit:</strong> Label, Link destination, Style (Solid Navy, Emerald Green, Outline, Ghost), Size, and Alignment.</p>
                      <p className="text-slate-500"><strong>Mobile:</strong> Easy thumb-tappable targets.</p>
                    </div>

                    {/* Spacer */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <h4 className="font-bold text-sm text-[#0f2142]">Spacer</h4>
                      <p><strong>When to use:</strong> To add clean breathing room between sections.</p>
                      <p><strong>What you can edit:</strong> Vertical height (None, Small, Medium, Large, Extra Large).</p>
                    </div>

                    {/* Divider */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <h4 className="font-bold text-sm text-[#0f2142]">Divider</h4>
                      <p><strong>When to use:</strong> To place a thin separator line between topics.</p>
                      <p><strong>What you can edit:</strong> Line style (Solid, Dashed, Dotted), thickness, and color.</p>
                    </div>
                  </div>
                </div>

                {/* 4.2 Sections Category */}
                <div id="sections-category" className="scroll-mt-24 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Grid className="w-4 h-4 text-[#2563eb]" /> 4.2 Sections Category
                  </h3>

                  {/* Top Banner Hero Feature */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="space-y-2 flex-1 text-xs">
                        <h4 className="font-bold text-sm text-[#0f2142]">Top Banner (Hero Section)</h4>
                        <p><strong>When to use:</strong> At the top of your page to create an engaging visual introduction.</p>
                        <p><strong>What you can edit:</strong> Eyebrow badge text, main headline, description, photographic background with dark gradient overlay, and primary/secondary action buttons.</p>
                      </div>
                      <div className="w-full sm:w-56 shrink-0">
                        <div
                          onClick={() =>
                            setLightboxImage({
                              src: "/docs-screenshots/SS-010_hero-banner-settings.png",
                              alt: "Top Banner block selected with Content settings in the right panel",
                              caption: "Screenshot SS-010: Top Banner block settings in the right panel.",
                            })
                          }
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-300 bg-white"
                        >
                          <img
                            src="/docs-screenshots/SS-010_hero-banner-settings.png"
                            alt="Hero banner settings"
                            loading="lazy"
                            className="w-full h-28 object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-slate-800 shadow">Zoom SS-010</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 text-center mt-1">Fig 4.1: Top Banner Settings</p>
                      </div>
                    </div>
                  </div>

                  {/* Other Section Blocks */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <h4 className="font-bold text-slate-900">Cards Grid</h4>
                      <p><strong>When to use:</strong> Showcase services, sponsors, speaker bios, or program highlights side-by-side (2, 3, or 4 columns).</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <h4 className="font-bold text-slate-900">Photo Gallery</h4>
                      <p><strong>When to use:</strong> Display photo galleries of past events, golf outings, or team photos with lightbox zoom.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <h4 className="font-bold text-slate-900">FAQ Accordion</h4>
                      <p><strong>When to use:</strong> Frequently asked questions where visitors can click a question to expand the answer.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <h4 className="font-bold text-slate-900">Call to Action (CTA Strip)</h4>
                      <p><strong>When to use:</strong> Encourage visitors to take immediate action with a headline, sentence, and prominent button.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <h4 className="font-bold text-slate-900">Stats Counter</h4>
                      <p><strong>When to use:</strong> Highlight key metrics (e.g. <em>$500K+ Raised</em>, <em>2,500+ Donors</em>, <em>100% Volunteer Driven</em>).</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <h4 className="font-bold text-slate-900">Feature List & Process Steps</h4>
                      <p><strong>When to use:</strong> List core benefits with colored icons or guide visitors through step-by-step instructions.</p>
                    </div>
                  </div>
                </div>

                {/* 4.3 Advanced Category */}
                <div id="advanced-category" className="scroll-mt-24 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Sliders className="w-4 h-4 text-[#2563eb]" /> 4.3 Advanced Category
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-bold text-slate-900">Columns Layout</h4>
                      <p>Custom side-by-side distributions (50/50, 33/33/33, 30/70, 70/30) where you can drop any basic block inside.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-bold text-slate-900">Container Section</h4>
                      <p>Custom background container box with custom padding, background image, and Boxed/Full-width toggle.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-bold text-slate-900">Video Player</h4>
                      <p>Embed YouTube, Vimeo, or MP4 video links with automatic responsive aspect ratio preservation.</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <h4 className="font-bold text-slate-900">Calendly & Notice Box</h4>
                      <p>Embed Calendly appointment booking forms or show colored announcement alert boxes (Info, Success, Warning).</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= 5. COMMON DAY-TO-DAY TASKS ================= */}
              <section id="common-tasks" data-doc-section className="scroll-mt-24 space-y-8 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      05
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      5. Common Day-to-Day Tasks
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("common-tasks", "5. Common Day-to-Day Tasks")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn step-by-step instructions for the most common updates you will perform on the website.
                </p>

                {/* 5.1 Change Text */}
                <div id="task-text" className="scroll-mt-24 space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    5.1 How to Change Text and Headlines
                  </h3>
                  <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-2">
                    <li>Click on the text or headline you want to edit on the canvas.</li>
                    <li>In the right settings panel under the <strong>Content</strong> tab, locate the <strong>Text</strong> or <strong>Headline</strong> box.</li>
                    <li>Type your new wording. The canvas updates immediately.</li>
                    <li>Click <strong>Save Draft</strong> in the top right corner.</li>
                  </ol>
                </div>

                {/* 5.2 Upload Image */}
                <div id="task-image" className="scroll-mt-24 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    5.2 How to Upload and Replace an Image
                  </h3>
                  <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-2">
                    <li>Click on the image you want to change on the canvas.</li>
                    <li>In the right settings panel under <strong>Media & Assets</strong>, click <strong>Upload & Media Gallery</strong>.</li>
                    <li>
                      A popup window will open with three options:
                      <ul className="list-disc list-inside pl-4 text-slate-600 mt-1 space-y-0.5">
                        <li><strong>Upload New:</strong> Click <em>Choose File</em> and select a photo from your computer.</li>
                        <li><strong>Site Media Library:</strong> Click on any previously uploaded image.</li>
                        <li><strong>External URL:</strong> Paste a link to an image hosted elsewhere.</li>
                      </ul>
                    </li>
                    <li>Click on the photo you want. The window closes and the image updates on your page.</li>
                  </ol>

                  <figure className="pt-2">
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: "/docs-screenshots/SS-011_media-gallery-picker.png",
                          alt: "Media Library and Gallery picker modal",
                          caption: "Screenshot SS-011: Media Library modal with Upload New and thumbnail picker highlighted.",
                        })
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-300 bg-white"
                    >
                      <img
                        src="/docs-screenshots/SS-011_media-gallery-picker.png"
                        alt="Media gallery picker modal"
                        loading="lazy"
                        className="w-full h-auto"
                      />
                    </div>
                    <figcaption className="text-[11px] text-slate-500 text-center mt-1">Fig 5.1: Media Library & Asset Picker</figcaption>
                  </figure>
                </div>

                {/* 5.3 & 5.4 Tasks */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div id="task-cards" className="scroll-mt-24 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">5.3 Add or Remove a Card in a Grid</h3>
                    <ol className="list-decimal list-inside text-slate-700 space-y-1">
                      <li>Click the <strong>Cards Grid</strong> block on the canvas.</li>
                      <li>In the right panel under <strong>Collection & Items</strong>, scroll to the card list.</li>
                      <li><strong>Add:</strong> Click <em>+ Add Card Item</em>.</li>
                      <li><strong>Delete:</strong> Click the red trash icon.</li>
                      <li><strong>Reorder:</strong> Use the up/down arrows.</li>
                    </ol>
                  </div>

                  <div id="task-blocks" className="scroll-mt-24 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">5.4 Duplicate, Move, or Delete a Block</h3>
                    <p className="text-slate-700">Click on any block on the canvas to display its floating action toolbar:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
                      <li><strong>Up / Down Arrows:</strong> Reorder position.</li>
                      <li><strong>Duplicate Icon:</strong> Create an exact clone.</li>
                      <li><strong>Trash Icon:</strong> Delete the element.</li>
                    </ul>
                  </div>
                </div>

                {/* 5.5 Mobile Preview */}
                <div id="task-mobile" className="scroll-mt-24 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#2563eb]" /> 5.5 How to Preview on Mobile and Tablet
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Always test your page across different device viewports before publishing:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 items-center">
                    <figure>
                      <div
                        onClick={() =>
                          setLightboxImage({
                            src: "/docs-screenshots/SS-012_mobile-viewport-preview.png",
                            alt: "Editor in Phone (390px) mobile preview mode",
                            caption: "Screenshot SS-012: Phone (390px) preview mode with Phone button highlighted.",
                          })
                        }
                        className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img
                          src="/docs-screenshots/SS-012_mobile-viewport-preview.png"
                          alt="Mobile preview mode"
                          loading="lazy"
                          className="w-full h-auto max-h-60 object-cover object-top"
                        />
                      </div>
                      <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 5.2: Mobile Phone (390px) Preview</figcaption>
                    </figure>

                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1.5">
                      <li>Click <strong>Tablet</strong> in the top bar to inspect 820px view.</li>
                      <li>Click <strong>Phone</strong> to inspect 390px mobile layout.</li>
                      <li>Verify button targets are large enough to tap comfortably.</li>
                      <li>Click <strong>Desktop</strong> to return to full screen (1280px).</li>
                    </ol>
                  </div>
                </div>

                {/* 5.6 Restore Version */}
                <div id="task-restore" className="scroll-mt-24 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-[#2563eb]" /> 5.6 How to Restore an Earlier Version
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    If you made mistakes or want to roll back to a previously saved snapshot:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 items-center">
                    <figure>
                      <div
                        onClick={() =>
                          setLightboxImage({
                            src: "/docs-screenshots/SS-013_version-history-drawer.png",
                            alt: "Revision History modal with snapshots and Restore buttons",
                            caption: "Screenshot SS-013: Revision History modal with Restore button highlighted.",
                          })
                        }
                        className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                      >
                        <img
                          src="/docs-screenshots/SS-013_version-history-drawer.png"
                          alt="Revision History modal"
                          loading="lazy"
                          className="w-full h-auto max-h-56 object-cover object-top"
                        />
                      </div>
                      <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 5.3: Revision History Modal</figcaption>
                    </figure>

                    <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1.5">
                      <li>Click the <strong>Revision History</strong> (clock) icon in the top bar.</li>
                      <li>Browse through the list of saved timestamps and version notes.</li>
                      <li>Click <strong>Restore</strong> on your preferred version.</li>
                      <li>The canvas immediately reverts to that snapshot point.</li>
                    </ol>
                  </div>
                </div>

                {/* 5.7 Update Golf Page */}
                <div id="task-golf" className="scroll-mt-24 p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                  <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" /> 5.7 How to Update the Annual Charity Golf Page Each Year
                  </h3>
                  <p className="text-slate-700">When preparing for a new annual event (such as the Golf Outing or Gala):</p>
                  <ol className="list-decimal list-inside text-slate-800 space-y-1 pl-2">
                    <li>Go to <code className="font-mono text-[11px] bg-white px-1 rounded">/cms</code> and find the previous year's page (e.g. <code className="font-mono text-[11px] bg-white px-1 rounded">annual-golf-outing-2025</code>).</li>
                    <li>Click the <strong>Duplicate</strong> icon next to the page.</li>
                    <li>Name the new duplicate <code className="font-mono text-[11px] bg-white px-1 rounded">Annual Golf Outing 2026</code> with slug <code className="font-mono text-[11px] bg-white px-1 rounded">annual-golf-outing-2026</code>.</li>
                    <li>Click <strong>Edit</strong> on the new page.</li>
                    <li>Update the date, location, ticket prices, and schedule.</li>
                    <li>Replace sponsor logos in the <strong>Cards Grid</strong> or <strong>Photo Gallery</strong>.</li>
                    <li>Click <strong>Publish</strong> when ready.</li>
                    <li>Click <strong>Add to Nav</strong> to update the website's top menu link.</li>
                  </ol>
                </div>
              </section>

              {/* ================= 6. LINKS AND BUTTONS ================= */}
              <section id="links-and-buttons" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      06
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      6. Links and Buttons Guide
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("links-and-buttons", "6. Links and Buttons Guide")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn how to configure buttons and links so visitors always land on the right destination.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 items-center">
                  <figure>
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: "/docs-screenshots/SS-014_link-picker-segmented.png",
                          alt: "Link destination picker with Page, Website, and Email options",
                          caption: "Screenshot SS-014: Link destination picker with Page, Website, Email, and Phone options.",
                        })
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                    >
                      <img
                        src="/docs-screenshots/SS-014_link-picker-segmented.png"
                        alt="Link picker segmented"
                        loading="lazy"
                        className="w-full h-auto"
                      />
                    </div>
                    <figcaption className="text-[11px] text-slate-500 mt-1 text-center">Fig 6.1: Segmented Link Destination Selector</figcaption>
                  </figure>

                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <strong className="text-[#0f2142] block">1. Page (Internal Page):</strong>
                      Select any existing website page from the dropdown menu without typing URLs manually.
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <strong className="text-[#0f2142] block">2. External (Outside Website):</strong>
                      Link to outside ticketing portals, sponsors, or news articles (e.g. <code className="font-mono text-[10px]">https://eventbrite.com/your-event</code>).
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <strong className="text-[#0f2142] block">3. Email & Phone:</strong>
                      Automatically launches visitor's email client (<code className="font-mono text-[10px]">mailto:info@smgaba.com</code>) or triggers direct mobile phone dialing.
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= 7. BRAND COLORS & STYLES ================= */}
              <section id="brand-colors" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      07
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      7. Brand Colors, Fonts, and Style Rules
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("brand-colors", "7. Brand Colors")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn the official brand palette and styling rules used across the website. Click any color card to copy its hex code directly!
                </p>

                {/* Screenshot SS-015 */}
                <figure className="space-y-1">
                  <div
                    onClick={() =>
                      setLightboxImage({
                        src: "/docs-screenshots/SS-015_color-swatches-palette.png",
                        alt: "Brand color swatches in the Style tab",
                        caption: "Screenshot SS-015: Brand color swatches in the Style tab.",
                      })
                    }
                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                  >
                    <img
                      src="/docs-screenshots/SS-015_color-swatches-palette.png"
                      alt="Brand color swatches"
                      loading="lazy"
                      className="w-full h-auto max-h-48 object-cover object-top"
                    />
                  </div>
                  <figcaption className="text-[11px] text-slate-500 text-center">Fig 7.1: Color Palette Swatches in Editor</figcaption>
                </figure>

                {/* Interactive Color Palette Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {BRAND_COLORS.map((color) => {
                    const isCopied = copiedHex === color.hex;
                    return (
                      <button
                        key={color.hex}
                        onClick={() => handleCopyHex(color.hex, color.name)}
                        className="group relative text-left p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between h-36"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className="w-6 h-6 rounded-lg border border-black/10 shadow-2xs shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1 group-hover:bg-blue-50 group-hover:text-[#2563eb]">
                              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                              {color.hex}
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900 leading-tight">
                            {color.name}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                          {color.usage}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Typography Guidelines */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                  <h3 className="font-bold text-sm text-slate-900">Typography Guidelines</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li><strong>Headings:</strong> Clean serif/sans typography automatically applied from site theme.</li>
                    <li><strong>Body Text:</strong> Sans-serif typography optimized for reading clarity on mobile screens.</li>
                  </ul>
                </div>
              </section>

              {/* ================= 8. PUBLISHING GUIDE ================= */}
              <section id="publishing-guide" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      08
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      8. Publishing Guide
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("publishing-guide", "8. Publishing Guide")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will learn how the publishing process works, how safety checks protect your live website, and how to unpublish a page if needed.
                </p>

                {/* 8.1 How Publishing Works */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">8.1 How Publishing Works</h3>
                  <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1.5 pl-2">
                    <li>When working in the editor, your edits are saved as a <strong>Draft</strong>.</li>
                    <li>Visitors on the live website will not see your changes until you click <strong>Publish Page</strong>.</li>
                    <li>A <strong>Publish Page Live</strong> confirmation dialog opens, displaying the exact URL the page will go live at.</li>
                    <li>Click <strong>Confirm & Go Live</strong> to publish, or <strong>Cancel</strong> to keep working in draft mode.</li>
                  </ol>

                  <figure className="pt-2">
                    <div
                      onClick={() =>
                        setLightboxImage({
                          src: "/docs-screenshots/SS-016_publish-safety-check.png",
                          alt: "Publish Page Live confirmation dialog",
                          caption: "Screenshot SS-016: Publish Page Live dialog with Confirm & Go Live button highlighted.",
                        })
                      }
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200"
                    >
                      <img
                        src="/docs-screenshots/SS-016_publish-safety-check.png"
                        alt="Publish confirmation dialog"
                        loading="lazy"
                        className="w-full h-auto max-h-72 object-cover object-top"
                      />
                    </div>
                    <figcaption className="text-[11px] text-slate-500 text-center mt-1">Fig 8.1: Publish Confirmation Modal</figcaption>
                  </figure>
                </div>

                {/* 8.2 Pre-Publish Checks & 8.3 Unpublish */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900">8.2 Before You Hit Publish</h3>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      <li><strong>Button Links:</strong> Ensure buttons link to real URLs (avoid empty <code className="text-[10px]">https://</code>).</li>
                      <li><strong>Images:</strong> Check that photos are selected, not blank boxes.</li>
                      <li><strong>Headlines:</strong> Main headlines are filled in.</li>
                      <li><strong>No Filler Text:</strong> Remove any leftover dummy placeholder copy.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900">8.3 How to Unpublish a Page</h3>
                    <ol className="list-decimal list-inside text-slate-700 space-y-1">
                      <li>Open the page in the editor.</li>
                      <li>Click <strong>Unpublish</strong> in the top bar.</li>
                      <li>The status reverts to <strong>Draft</strong>. Visitors will see a clean 404 until you republish.</li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-sm mb-0.5">Quick Pro-Tip:</strong>
                    Use the interactive <strong>Pre-Publish Checklist</strong> below in Section 9 as your standard routine before taking any new page live!
                  </div>
                </div>
              </section>

              {/* ================= 9. PRE-PUBLISH CHECKLIST ================= */}
              <section id="pre-publish-checklist" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      09
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      9. Pre-Publish Checklist
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("pre-publish-checklist", "9. Pre-Publish Checklist")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  Use this interactive 8-point checklist before making any page public. You can check off items as you go!
                </p>

                {/* Progress Bar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Checklist Progress: {completedChecksCount} of 8 completed
                    </span>
                    {completedChecksCount > 0 && (
                      <button
                        onClick={() => setChecklistState({})}
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[11px]"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset checklist
                      </button>
                    )}
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300"
                      style={{ width: `${(completedChecksCount / 8) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-2.5">
                  {[
                    { title: "Title Check", desc: "Is the page headline clear, descriptive, and free of typos?" },
                    { title: "Button Links", desc: "Have all buttons been tested to make sure they open the correct page or external site?" },
                    { title: "Image Quality", desc: "Are all uploaded photos clear, high-resolution, and properly oriented?" },
                    { title: "Mobile Preview", desc: "Have you clicked the Phone button in the top bar to verify the 390px mobile view?" },
                    { title: "Dates & Times", desc: "Are all event dates, locations, schedules, and registration deadlines up to date?" },
                    { title: "Contact Info", desc: "Are phone numbers, email addresses, and form destinations accurate?" },
                    { title: "SEO Title & Description", desc: "Did you click SEO in the top bar and write a 1-sentence summary for search engines?" },
                    { title: "Navigation", desc: "If visitors should find this page from the menu, did you click Add to Nav?" },
                  ].map((item, idx) => {
                    const isChecked = !!checklistState[idx];
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                            : "bg-white border-slate-200/90 text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecklistItem(idx)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                        />
                        <div className="text-xs">
                          <strong className={isChecked ? "text-emerald-900" : "text-slate-900"}>
                            {item.title}:
                          </strong>{" "}
                          <span className={isChecked ? "text-emerald-800" : "text-slate-600"}>
                            {item.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* ================= 10. TROUBLESHOOTING FAQ ================= */}
              <section id="troubleshooting-faq" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      10
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      10. Troubleshooting FAQ
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("troubleshooting-faq", "10. Troubleshooting FAQ")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, you will find answers to the most common questions and issues encountered when building pages.
                </p>

                <div className="space-y-3">
                  {FAQ_ITEMS.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs">
                      <h3 className="font-bold text-sm text-[#0f2142] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#2563eb] shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-slate-600 leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= 11. GLOSSARY ================= */}
              <section id="glossary" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      11
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      11. Glossary of Terms
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("glossary", "11. Glossary of Terms")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, common website and CMS terms are defined in plain language.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {GLOSSARY_ITEMS.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <strong className="font-bold text-[#0f2142] text-sm block">
                        {item.term}
                      </strong>
                      <p className="text-slate-600 leading-relaxed">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= 12. APPENDIX ================= */}
              <section id="not-yet-available" data-doc-section className="scroll-mt-24 space-y-6 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0f2142] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      12
                    </span>
                    <h2 className="text-2xl font-bold text-[#0f2142] tracking-tight">
                      12. Appendix: Features Not Yet Available
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopySectionLink("not-yet-available", "12. Appendix")}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Hash className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  In this section, features that are not currently part of the CMS are listed for reference.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">Real-Time Multi-User Simultaneous Editing</h3>
                    <p className="text-slate-600">Multiple users cannot edit the exact same page at the exact same second (like Google Docs). Edits are saved on a per-version snapshot basis.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">Custom Credit Card Payment Gateway Blocks</h3>
                    <p className="text-slate-600">Direct credit card input forms are not embedded on the visual canvas. Use button links to your organization's official secure donation portal or ticketing platform.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <h3 className="font-bold text-sm text-slate-900">Custom SQL Database Builder</h3>
                    <p className="text-slate-600">The CMS is designed for visual layout and content management, not arbitrary backend database schema creation.</p>
                  </div>
                </div>
              </section>

            </div>

            {/* Prev / Next Bottom Pager Navigation */}
            <div className="mt-16 pt-8 border-t border-slate-200 grid sm:grid-cols-2 gap-4">
              {prevSection ? (
                <button
                  onClick={() => scrollToTarget(prevSection.id)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-left transition-all group flex items-center gap-3"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-[#2563eb] transition-colors shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Previous</div>
                    <div className="text-xs font-bold text-slate-900 truncate group-hover:text-[#2563eb] transition-colors">
                      {prevSection.number}. {prevSection.title}
                    </div>
                  </div>
                </button>
              ) : <div />}

              {nextSection ? (
                <button
                  onClick={() => scrollToTarget(nextSection.id)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-right transition-all group flex items-center justify-end gap-3"
                >
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Next</div>
                    <div className="text-xs font-bold text-slate-900 truncate group-hover:text-[#2563eb] transition-colors">
                      {nextSection.number}. {nextSection.title}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563eb] transition-colors shrink-0" />
                </button>
              ) : <div />}
            </div>

          </main>
        </div>
      </div>

      {/* ================= SEARCH MODAL (Ctrl+K) ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Box */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 12 guide sections, FAQs, and terms..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
              {searchQuery.trim() === "" ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                  <p>Type keywords to search (e.g. <em>publish, button, color, revision, golf</em>)...</p>
                  <p className="text-[11px] text-slate-400">Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Esc</kbd> to close</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No matching results found for "{searchQuery}".
                </div>
              ) : (
                searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => scrollToTarget(res.targetId)}
                    className="w-full text-left p-3 rounded-lg hover:bg-blue-50/60 transition-colors flex flex-col gap-1 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-900 group-hover:text-[#2563eb] transition-colors">
                        {res.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-[#2563eb]">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {res.snippet}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Mobile Table of Contents Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4 duration-200">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0f2142] text-white text-xs font-bold shadow-xl shadow-slate-900/30 border border-white/20 hover:bg-[#1b3668] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          aria-label="Open Table of Contents Navigation"
        >
          <BookOpen className="w-4 h-4 text-blue-300" />
          <span>Contents</span>
          <span className="w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-[10px] font-bold">
            {currentSection.number}
          </span>
        </button>
      </div>

      {/* ================= MOBILE SLIDE-IN DRAWER ================= */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Table of Contents Navigation"
          className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-84 max-w-[88vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5 font-bold text-sm text-[#0f2142]">
                <span className="w-7 h-7 rounded-md bg-[#0f2142] text-white flex items-center justify-center text-xs font-bold">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <div>Table of Contents</div>
                  <div className="text-[10px] text-slate-500 font-normal">12 Guide Sections</div>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 transition-colors"
                aria-label="Close Table of Contents"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Drawer Filter Box */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={drawerFilter}
                  onChange={(e) => setDrawerFilter(e.target.value)}
                  placeholder="Filter sections..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            {/* Section List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
              {DOC_SECTIONS.filter(
                (sec) =>
                  !drawerFilter.trim() ||
                  sec.title.toLowerCase().includes(drawerFilter.toLowerCase()) ||
                  sec.subsections?.some((sub) =>
                    sub.title.toLowerCase().includes(drawerFilter.toLowerCase())
                  )
              ).map((section) => {
                const isSectionActive =
                  activeSectionId === section.id ||
                  section.subsections?.some((sub) => sub.id === activeSectionId);

                return (
                  <div key={section.id} className="space-y-1">
                    <button
                      onClick={() => scrollToTarget(section.id)}
                      className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isSectionActive
                          ? "bg-[#0f2142] text-white shadow-xs"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                          isSectionActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {section.number}
                      </span>
                      <span className="leading-snug pt-0.5">{section.title}</span>
                    </button>

                    {/* Subsections in Drawer */}
                    {section.subsections && (
                      <div className="ml-7 pl-2 border-l border-slate-200 space-y-1 my-1">
                        {section.subsections.map((sub) => {
                          const isSubActive = activeSectionId === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => scrollToTarget(sub.id)}
                              className={`w-full text-left block py-1 px-2 rounded text-[11px] transition-colors ${
                                isSubActive
                                  ? "text-[#2563eb] font-bold bg-blue-50"
                                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                              }`}
                            >
                              {sub.title}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Quick Search Jump in Drawer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search Guide</span>
              </button>
              <Link
                to="/cms"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0f2142] text-white text-xs font-medium hover:bg-[#1b3668]"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>CMS</span>
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* ================= LIGHTBOX MODAL ================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 sm:top-2 sm:right-2 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors focus:outline-none"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl border border-white/20 bg-slate-900"
            />
            {lightboxImage.caption && (
              <p className="mt-3 text-xs text-white/90 text-center max-w-2xl px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-xs">
                {lightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
