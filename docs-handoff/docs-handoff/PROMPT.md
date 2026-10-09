# Build Brief: Interactive `/docs` Page for SMG ABA Visual CMS

> Paste this entire file into Antigravity as your task prompt. Everything it references
> (`CMS_User_Guide.md`, `screenshots/`) sits in this same folder.

---

## 1. Mission

Build a polished, interactive documentation website for the **SMG ABA Visual CMS**
(a visual page-builder CMS for a charity organization's staff and volunteers) and serve it
at the **`/docs`** route of the existing site.

## 2. Repo context

- The site is built with **TanStack Start (React)** and deployed on **Vercel**
  (`smgaba.vercel.app`). Follow the repo's existing conventions: file-based routing,
  existing Tailwind setup, shared components, and code style.
- Do not break or modify any existing route. Add only what `/docs` needs
  (route file, components, styles, assets).
- The CMS itself lives at `/dashboard`, `/cms`, etc. — this task is docs-only.

## 3. Assets provided (in this folder)

- **`CMS_User_Guide.md`** — the complete guide content: 12 sections, ~450 lines,
  including tables, checklists, callouts (`> NOTE:` / `> TIP:`), and 16 embedded images.
- **`screenshots/SS-001_dashboard-overview.png` … `SS-016_publish-safety-check.png`**
  — 16 annotated screenshots (red highlight boxes, one arrow callout, numbered badges).
  In the markdown they are referenced as `screenshots/SS-XXX_*.png`.

### Screenshot → section map

| File | Guide section | What it shows |
|---|---|---|
| `SS-001_dashboard-overview.png` | 1. Welcome | Admin Command Center, CMS Visual Page Builder card highlighted |
| `SS-002_cms-pages-list.png` | 2. Quick Start | CMS page directory, New Page button highlighted |
| `SS-003_create-new-page-templates.png` | 2. Quick Start | Create-page screen, arrow to Events & Webinar template |
| `SS-004_visual-editor-layout.png` | 3. Screen Tour | Full editor, numbered badges 1–4 (top bar, drawer, canvas, panel) |
| `SS-005_top-bar-controls.png` | 3.1 The Top Bar | Top bar close-up, viewports + Publish highlighted |
| `SS-006_left-blocks-drawer.png` | 3.2 The Left Panel | Block drawer, search + BASICS header highlighted |
| `SS-007_canvas-selection-toolbar.png` | 3.3 The Center Canvas | Selected block, floating action toolbar highlighted |
| `SS-008_right-settings-panel.png` | 3.4 Right Settings Panel | Settings panel, Content/Style/Layout/Motion tabs highlighted |
| `SS-009_empty-state-page-settings.png` | 3.5 The Empty State | Page-level settings cards highlighted |
| `SS-010_hero-banner-settings.png` | 4.2 Sections Category | Top Banner block settings highlighted |
| `SS-011_media-gallery-picker.png` | 5.2 Upload Image | Media Library modal, Upload New + thumbnails highlighted |
| `SS-012_mobile-viewport-preview.png` | 5.5 Mobile Preview | Phone (390px) preview, Phone button highlighted |
| `SS-013_version-history-drawer.png` | 5.6 Restore Version | Revision History modal, Restore button highlighted |
| `SS-014_link-picker-segmented.png` | 6. Links and Buttons | Link destination picker highlighted |
| `SS-015_color-swatches-palette.png` | 7. Brand Colors | Brand color swatches highlighted |
| `SS-016_publish-safety-check.png` | 8. Publishing Guide | Publish Page Live dialog, Confirm & Go Live highlighted |

### The 12 sections (sidebar order)

1. Welcome to the CMS
2. Quick Start: Build Your First Page in 10 Minutes
3. Screen Tour: Understanding the Workspace
4. Blocks Library Guide
5. Common Day-to-Day Tasks
6. Links and Buttons Guide
7. Brand Colors, Fonts, and Style Rules
8. Publishing Guide
9. Pre-Publish Checklist
10. Troubleshooting FAQ
11. Glossary of Terms
12. Appendix: Features Not Yet Available

## 4. Functional requirements

1. **Route**: serve at `/docs`. Support deep links to sections (e.g. `/docs#publishing-guide`).
2. **Sidebar navigation**: sticky left sidebar listing all 12 sections (with subsections
   for 3.1–3.5, 4.1–4.3, 5.1–5.7). Scroll-spy highlights the active section.
   On mobile it becomes a slide-in drawer behind a hamburger button.
3. **Search**: client-side full-text search over the entire guide, with match highlighting
   and a keyboard shortcut (`Ctrl+K` or `/`). Show a results dropdown that jumps to the match.
4. **Content rendering**: render from `CMS_User_Guide.md` (via a markdown renderer or a
   build-time conversion — your choice). Must preserve: headings, nested lists, tables
   (brand colors, feature inventory), task-list checkboxes (Section 9), and styled
   callouts for `> NOTE:` and `> TIP:`.
5. **Images**: place the 16 screenshots under `public/` (e.g. `public/docs-screenshots/`),
   rewrite the markdown image paths accordingly, lazy-load them, and open a
   click-to-zoom lightbox on click.
6. **Prev/Next navigation**: bottom-of-page pager between the 12 sections.
7. **Breadcrumb**: Home / Docs / <Section> at the top of the content area.
8. **SEO**: meaningful `<title>` and meta description for `/docs`.
9. **No backend**: everything static/client-side. No new dependencies unless the repo
   already uses them (prefer what's installed).

## 5. Design requirements

- Clean documentation aesthetic (think Stripe/Vercel docs): generous whitespace,
  readable measure (~70ch), clear heading hierarchy.
- Brand palette: Deep Navy `#0f2142` (primary), Royal Blue `#2563eb` (accents/links),
  Emerald `#059669`, Amber `#d97706`, Slate Gray `#64748b`, white surfaces.
- Typography: system sans stack or the repo's existing font setup; code/checklist
  elements in monospace where appropriate.
- Responsive: sidebar → drawer under ~1024px; images scale to container; tables scroll
  horizontally on small screens.
- Accessible: semantic landmarks, focus states, `alt` text from the markdown image
  captions, keyboard-operable drawer and lightbox.

## 6. Acceptance criteria

- [ ] Production build passes with no errors or new warnings.
- [ ] `/docs` loads and shows all 12 sections in the sidebar in the order above.
- [ ] All 16 screenshots render in their correct sections (spot-check against the map).
- [ ] Search finds terms like "publish", "button", "revision" and jumps to matches.
- [ ] Scroll-spy, prev/next pager, and mobile drawer all work.
- [ ] No existing route regressed.

## 7. Constraints

- Read-only with respect to the CMS and its data: do not touch `/dashboard`, `/cms`,
  or any API/database code.
- Keep the diff focused: new route + docs components + assets + minimal wiring
  (e.g. nav link to `/docs` if the site has an obvious place for it — otherwise skip).
- If any asset or instruction is ambiguous, make the most reasonable choice and note
  it in your summary.
