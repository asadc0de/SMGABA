export interface DocSubsection {
  id: string;
  title: string;
  level?: 3 | 4;
}

export interface DocSection {
  id: string;
  number: number;
  title: string;
  summary: string;
  subsections?: DocSubsection[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "welcome",
    number: 1,
    title: "Welcome to the CMS",
    summary: "Learn what the Visual CMS is and how to build pages safely in draft mode.",
  },
  {
    id: "quick-start",
    number: 2,
    title: "Quick Start: Build Your First Page in 10 Minutes",
    summary: "5 simple steps to create a page, customize content, preview on mobile, and publish.",
  },
  {
    id: "screen-tour",
    number: 3,
    title: "Screen Tour: Understanding the Workspace",
    summary: "Explore the Top Bar, Left Block Drawer, Center Canvas, and Right Settings Panel.",
    subsections: [
      { id: "top-bar", title: "3.1 The Top Bar", level: 3 },
      { id: "left-panel", title: "3.2 The Left Panel (Blocks Drawer)", level: 3 },
      { id: "center-canvas", title: "3.3 The Center Canvas", level: 3 },
      { id: "right-panel", title: "3.4 The Right Settings Panel", level: 3 },
      { id: "empty-state", title: "3.5 The Empty State (Page Settings)", level: 3 },
    ],
  },
  {
    id: "blocks-library",
    number: 4,
    title: "Blocks Library Guide",
    summary: "Complete guide to all 21 building blocks, their settings, and mobile behavior.",
    subsections: [
      { id: "basics-category", title: "4.1 Basics Category (Heading, Text, Image, Button, Spacer, Divider)", level: 3 },
      { id: "sections-category", title: "4.2 Sections Category (Hero, Cards, Gallery, FAQ, CTA, Stats, etc.)", level: 3 },
      { id: "advanced-category", title: "4.3 Advanced Category (Columns, Container, Video, Calendly, Notice)", level: 3 },
    ],
  },
  {
    id: "common-tasks",
    number: 5,
    title: "Common Day-to-Day Tasks",
    summary: "Step-by-step guides for editing text, replacing images, mobile preview, and version restore.",
    subsections: [
      { id: "task-text", title: "5.1 How to Change Text and Headlines", level: 3 },
      { id: "task-image", title: "5.2 How to Upload and Replace an Image", level: 3 },
      { id: "task-cards", title: "5.3 How to Add or Remove a Card in a Grid", level: 3 },
      { id: "task-blocks", title: "5.4 How to Duplicate, Move, or Delete a Block", level: 3 },
      { id: "task-mobile", title: "5.5 How to Preview on Mobile and Tablet", level: 3 },
      { id: "task-restore", title: "5.6 How to Restore an Earlier Version", level: 3 },
      { id: "task-golf", title: "5.7 How to Update the Annual Charity Golf Page", level: 3 },
    ],
  },
  {
    id: "links-and-buttons",
    number: 6,
    title: "Links and Buttons Guide",
    summary: "How to configure buttons for internal pages, outside websites, email, and phone calls.",
  },
  {
    id: "brand-colors",
    number: 7,
    title: "Brand Colors, Fonts, and Style Rules",
    summary: "Official organization color palette hex codes and typography rules.",
  },
  {
    id: "publishing-guide",
    number: 8,
    title: "Publishing Guide",
    summary: "How drafts work, the pre-publish confirmation flow, and how to unpublish pages.",
  },
  {
    id: "pre-publish-checklist",
    number: 9,
    title: "Pre-Publish Checklist",
    summary: "8-point pre-launch quality checklist before making any page public.",
  },
  {
    id: "troubleshooting-faq",
    number: 10,
    title: "Troubleshooting FAQ",
    summary: "Answers to common questions about Google indexing, mobile updates, and drafts.",
  },
  {
    id: "glossary",
    number: 11,
    title: "Glossary of Terms",
    summary: "Plain-language explanations of website builder terminology.",
  },
  {
    id: "not-yet-available",
    number: 12,
    title: "Appendix: Features Not Yet Available",
    summary: "Overview of features currently out-of-scope for the visual CMS.",
  },
];

export interface BrandColorItem {
  name: string;
  hex: string;
  usage: string;
  textDark?: boolean;
}

export const BRAND_COLORS: BrandColorItem[] = [
  {
    name: "Deep Navy (Primary)",
    hex: "#0f2142",
    usage: "Primary buttons, main titles, top header banners, footer background.",
  },
  {
    name: "Royal Blue (Accent)",
    hex: "#2563eb",
    usage: "Links, active tab indicators, informational highlights.",
  },
  {
    name: "Emerald Green (Action)",
    hex: "#059669",
    usage: "Donation buttons, success notices, registration confirmations.",
  },
  {
    name: "Amber Gold (Warm)",
    hex: "#d97706",
    usage: "Warning badges, upcoming date highlights, important reminders.",
  },
  {
    name: "Slate Gray (Muted)",
    hex: "#64748b",
    usage: "Subtitles, helper descriptions, divider lines, secondary text.",
  },
  {
    name: "Pure White",
    hex: "#ffffff",
    usage: "Card surfaces, clean section backgrounds, light button text.",
    textDark: true,
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Why is my page not appearing on Google yet?",
    answer: "New pages take time for search engines to index. Make sure you clicked SEO in the top bar, entered a clear SEO Title and Meta Description, and published the page.",
  },
  {
    question: "I made changes but they are not showing on my phone.",
    answer: "Make sure you clicked the Publish button in the top right corner. Saving a draft only updates your internal editor, not the public website. Also try refreshing your mobile browser.",
  },
  {
    question: "Can I undo a deletion if I accidentally deleted a block?",
    answer: "Yes. Immediately click the Undo (<) button in the top bar or press Ctrl + Z on your keyboard. Alternatively, click Revision History (clock icon) and restore your last saved snapshot.",
  },
  {
    question: "My image looks blurry on the page.",
    answer: "Use original high-resolution JPG or PNG images (recommended width: 1200px to 2000px). Avoid uploading small thumbnails.",
  },
  {
    question: "How do I add a new article to the blog?",
    answer: "Go to /dashboard and click Blog Studio (or go to /blogs-editor). Click Create New Article, write your content, and click Publish.",
  },
];

export interface GlossaryItem {
  term: string;
  definition: string;
}

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "Block",
    definition: "A modular piece of content (like a Heading, Image, Button, or Card Grid) that you can drag onto the canvas.",
  },
  {
    term: "Canvas",
    definition: "The middle area of the editor where your webpage is displayed and edited in real time.",
  },
  {
    term: "Draft",
    definition: "A saved version of your page that is only visible to team members inside the CMS.",
  },
  {
    term: "Published",
    definition: "A page that is live on the internet and accessible to all website visitors.",
  },
  {
    term: "Slug",
    definition: "The URL path of a page (for example, in smgaba.com/golf-outing, golf-outing is the slug).",
  },
  {
    term: "SEO (Search Engine Optimization)",
    definition: "Information (like title and description) that search engines use when displaying your page in search results.",
  },
  {
    term: "Hero / Top Banner",
    definition: "The large introductory banner at the very top of a web page.",
  },
  {
    term: "Lightbox",
    definition: "A popup window that enlarges an image when a visitor clicks on it.",
  },
  {
    term: "Drawer",
    definition: "The collapsible left panel containing the block library.",
  },
];
