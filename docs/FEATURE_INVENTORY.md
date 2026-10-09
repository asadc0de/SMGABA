# CMS Feature Inventory & System Scan

```yaml
Version: v1.0
Date: 2026-10-09
Based on code: 18afd2e
Status: Draft
```

---

## 1. Executive Summary

This inventory is generated from an exhaustive scan of the SMG ABA Visual CMS codebase. Every feature, route, toolbar control, block library item, settings field, and canvas action listed below exists in the production codebase.

---

## 2. Route & Screen Inventory

| Feature / Screen | Route | UI Location | Description & Capabilities | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Command Center** | `/dashboard` | Main URL / Redirect from `/tools` | Central launcher for all management apps (CMS, Blogs, Webinar Links, Events, Site Settings), real-time counters, search, quick action cards. | **Working** |
| **CMS Pages Index** | `/cms` | Navigation / Dashboard card | Browse, search, filter (All/Published/Draft), preview, duplicate, unpublish, delete CMS pages. Pre-publish safety scanner. | **Working** |
| **Create New Page** | `/cms/new` | Top Bar `+ New Page` button | Title input, URL slug generator, 6 ready-made templates (Blank, About, Services, Events, FAQs, Contact) with instant preview. | **Working** |
| **Visual Puck Editor** | `/cms/$id/edit` | Click "Edit" on any page | Full visual drag-and-drop builder with responsive iframe canvas, sticky header toolbar, left block drawer, and right settings panel. | **Working** |
| **Live Page Preview** | `/cms/$id/preview` | Top Bar `Preview` button | Clean full-screen interactive preview in new browser tab without editor frames or overlays. | **Working** |
| **Site Settings & Navigation** | `/internal/settings` | Dashboard / Top Bar `Navigation` | Custom dropdown navbar builder, top navigation items, footer columns, and global social media URLs. | **Working** |
| **Blog Studio & Editor** | `/blogs-editor` | Dashboard / Header button | Multi-block article creator (Headings, Paragraphs, Quotes, Lists, Media), featured images, tags, read times, future scheduling. | **Working** |
| **Webinar Shortlinks** | `/tools/links` | Dashboard / Header button | Vanity URL redirect forwarder (`/webinar` -> Zoom / Meet), click tracking, destination manager, pagination. | **Working** |
| **Create Redirection** | `/tools/redirections` | `/tools/links` `Create Another Link` | Simple modal / page form to add a new redirect slug and target URL. | **Working** |
| **Events & Seminars Manager** | `/tools/events` | Dashboard / Header button | Schedule workshops, webinars, speaker info, dates, times, recording links, thumbnail uploads to Supabase Storage. | **Working** |

---

## 3. Editor Top Bar Controls (`/cms/$id/edit`)

| Button / Control | UI Location | Exact Label / Icon | Action & Functionality | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Back to Pages** | Top Left | `< ArrowLeft Pages` | Returns to `/cms` pages list without losing saved work. | **Working** |
| **Page Title Display** | Top Left | Page title heading | Displays current internal page title and live/draft badge. | **Working** |
| **Save Status Indicator** | Top Left | `Saved just now` / Clock | Shows timestamp of last cloud save or auto-save. | **Working** |
| **Undo** | Top Middle | `< Undo` / `Ctrl+Z` | Rolls back the last canvas action or property change. | **Working** |
| **Redo** | Top Middle | `Redo >` / `Ctrl+Y` | Reapplies previously undone changes. | **Working** |
| **Desktop Viewport** | Top Middle | Monitor icon `100%` | Switched canvas iframe to full-width desktop layout. | **Working** |
| **Tablet Viewport** | Top Middle | Tablet icon `768px` | Sets canvas iframe width to 768px tablet portrait view. | **Working** |
| **Mobile Viewport** | Top Middle | Smartphone icon `375px` | Sets canvas iframe width to 375px mobile phone view. | **Working** |
| **Animations Toggle** | Top Right | Sparkles icon `Animations` | Toggles CSS scroll entrance animations on/off for easy editing. | **Working** |
| **Version History** | Top Right | History icon `Versions` | Opens slide-out drawer showing all saved snapshots with 1-click restore. | **Working** |
| **SEO Settings** | Top Right | Globe icon `SEO` | Opens SEO modal (Page title, Meta description, OG social image, canonical URL). | **Working** |
| **Duplicate Page** | Top Right | Copy icon `Duplicate` | Clones entire page data into a new draft with `-copy` slug. | **Working** |
| **Add to Navigation** | Top Right | Menu icon `Add to Nav` | Links the page directly into site header dropdown or footer column. | **Working** |
| **Unpublish** | Top Right | EyeOff icon `Unpublish` | Reverts live published page back to draft mode. | **Working** |
| **Save Draft** | Top Right | Save icon `Save Draft` | Manually saves current state as cloud draft. | **Working** |
| **Publish Page** | Top Right | Rocket icon `Publish` | Runs pre-publish safety scan and makes page live at `smgaba.com/{slug}`. | **Working** |

---

## 4. Left Panel Block Library (Drawer)

| Category | Block Name | Internal Type | What It Does & Where Used | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Basics** | **Heading** | `Heading` | Titles (H1, H2, H3, H4, H5, H6) with responsive sizing, colors, alignment. | **Working** |
| **Basics** | **Text** | `RichText` | Formatted body text, bold, italics, paragraphs, subtitles, links. | **Working** |
| **Basics** | **Image** | `Image` | Single image with media gallery picker, upload, aspect ratio, caption, lightbox zoom. | **Working** |
| **Basics** | **Button** | `Button` | Clickable CTA button (Solid navy, Emerald, Outline, Ghost), link destination picker. | **Working** |
| **Basics** | **Spacer** | `Spacer` | Responsive vertical empty space (None, Small, Medium, Large, Extra Large). | **Working** |
| **Basics** | **Divider** | `Divider` | Subtle horizontal dividing rule (Solid, Dashed, Dotted) with customizable opacity. | **Working** |
| **Sections** | **Top Banner** | `Hero` | Full-width hero section with photographic background, badge, headline, CTA buttons. | **Working** |
| **Sections** | **Cards Grid** | `CardGrid` | Multi-card grid (2, 3, or 4 columns) with icons, badges, titles, descriptions, and CTA links. | **Working** |
| **Sections** | **Photo Gallery** | `ImageGallery` | Multi-photo masonry / grid gallery with upload manager, captions, interactive modal lightbox. | **Working** |
| **Sections** | **FAQ Accordion** | `Accordion` | Expandable question & answer collapsible accordion list with multiple themes. | **Working** |
| **Sections** | **Call to Action** | `CTABanner` | High-conversion attention strip with headline, background styling, and primary button. | **Working** |
| **Sections** | **Stats** | `Stats` | Key numerical achievements grid (e.g. "$120M+ Managed", "99% Retention"). | **Working** |
| **Sections** | **Feature List** | `IconFeatures` | 2 to 4 column benefit grid with colored icon badges and descriptive text. | **Working** |
| **Sections** | **Process Steps** | `Steps` | Numbered sequential workflow timeline (01, 02, 03, 04) for onboarding or process stages. | **Working** |
| **Sections** | **Testimonial Quote** | `Testimonial` | Large single quote spotlight with star rating, client avatar, name, and role. | **Working** |
| **Sections** | **Testimonial Carousel**| `TestimonialSlider` | Interactive multi-slide customer review carousel with left/right arrows and dots. | **Working** |
| **Advanced** | **Columns Layout** | `Columns` | Responsive multi-column drop container (2 equal, 3 equal, 1/3 + 2/3, 2/3 + 1/3). | **Working** |
| **Advanced** | **Container Section** | `Section` | Full-width or boxed section container with custom background color/image and padding. | **Working** |
| **Advanced** | **Video Player** | `VideoEmbed` | Embedded YouTube, Vimeo, MP4, or Wistia video player with responsive aspect ratio. | **Working** |
| **Advanced** | **Calendly Calendar** | `CalendlyBooking` | Embedded appointment booking widget for scheduling discovery calls. | **Working** |
| **Advanced** | **Notice Box** | `Callout` | Highlighted info alert box (Info Blue, Success Green, Warning Amber, Neutral Gray). | **Working** |

---

## 5. Right Settings Panel Controls

| Tab / Subgroup | Control Label | Type | Capabilities & Options | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Header** | **Breadcrumbs** | Navigation | `Page > Section > Button` clickable hierarchy to select parent element. | **Working** |
| **Header** | **Duplicate** | Button | Clones selected element immediately beneath. | **Working** |
| **Header** | **Reset Styles** | Button | Restores default appearance and spacing without losing text content. | **Working** |
| **Header** | **Delete** | Button | Removes element with confirm state. | **Working** |
| **Header** | **Collapse Toggle** | Arrow / Icon | Collapses right panel to 36px vertical tab; auto-expands canvas. | **Working** |
| **Header** | **Search Settings** | Input box | Semantic instant search (`color`, `font`, `shadow`, `spacing`, `link`, etc.). | **Working** |
| **Header** | **Simple / Adv Mode** | Segmented | `Simple` mode hides raw CSS flex/grid; `Adv` mode reveals technical layout. | **Working** |
| **Content** | **Text & Copy** | Inputs / Textareas | Label, Headline, Subheading, Eyebrow, Badge, Quote, Author, Rating. | **Working** |
| **Content** | **Media & Assets** | Image Picker | Upload file, select from stock/site gallery, enter external URL, alt text. | **Working** |
| **Content** | **Links & Buttons** | Link Picker | Segmented: `Page` (internal dropdown), `External` (URL), `Email`, `Phone`. | **Working** |
| **Content** | **Collection Items** | Item List | Add item, remove item, edit item title, icon, description, and links. | **Working** |
| **Style** | **Colors & Swatches** | Color Swatches | 6 Brand color dots (Navy `#0f2142`, Blue `#2563eb`, Emerald `#059669`, Amber `#d97706`, Slate `#64748b`, White `#ffffff`) + Custom picker `+`. | **Working** |
| **Style** | **Typography** | Segmented / Select | Font family (Sans, Serif, Mono), Weight (Regular, Semibold, Bold), Alignment. | **Working** |
| **Style** | **Shadow & Corners** | Segmented | Corners: `None`, `Small`, `Medium`, `Large`, `Full (Pill)`; Shadow: `None`, `Subtle`, `Medium`, `Elevated`. | **Working** |
| **Style** | **Borders** | Controls | Border width, border style (Solid, Dashed), border color swatches. | **Working** |
| **Layout** | **Dimensions** | Inputs / Sizing | Width presets (`Auto`, `25%`, `50%`, `75%`, `100%`), Height, Scale slider (50%-150%). | **Working** |
| **Layout** | **Spacing** | Responsive Select | Margin Top / Bottom (`None`, `Small`, `Medium`, `Large`, `XL`), Alignment (`Left`, `Center`, `Right`). | **Working** |
| **Layout** | **Advanced (Adv)** | Selects | Display mode (`Block`, `Inline-Flex`, `Flex`), Flex Direction, Gap. | **Working** |
| **Motion** | **Entrance Effects** | Presets | `None`, `Fade In Up`, `Fade In Down`, `Slide In Left`, `Zoom In`, `Subtle Glow`. | **Working** |
| **Motion** | **Hover Transitions**| Presets | `None`, `Lift (-4px)`, `Scale (1.03x)`, `Glow`, `Subtle Shadow Increase`. | **Working** |
| **Empty State** | **Page Title** | Inline Edit | Shows current page title with inline `Edit` / `Save` buttons. | **Working** |
| **Empty State** | **SEO & Social** | Action Card | Opens full SEO & Social Metadata configuration drawer. | **Working** |
| **Empty State** | **Header Banner** | Switch Toggle | 1-click toggle to show/hide the top photographic background hero header. | **Working** |

---

## 6. Canvas & Interaction Controls

| Interaction | How to Trigger | Result | Status |
| :--- | :--- | :--- | :--- |
| **Select Element** | Click on element in canvas | Highlights element with solid blue border; loads right settings panel. | **Working** |
| **Hover Outline** | Move cursor over block | Shows dashed blue border and friendly block type badge. | **Working** |
| **Floating Action Bar** | Top of selected block | Move Up, Move Down, Duplicate, Delete, Block name badge. | **Working** |
| **Hover '+' Section Divider** | Hover between sections | Dashed divider with `+ Add Section` button appears to insert section in-between. | **Working** |
| **Bottom Add Section** | Bottom of canvas | `+ Add Blank Section Beneath` button creates new clean section at page end. | **Working** |
| **Right-Click Context Menu**| Right click on element | Opens custom menu: Duplicate, Copy, Reset Styles, Delete, Move Up/Down. | **Working** |
| **Deselect to Empty State** | Press `Escape` or click `Page` | Deselects active block and returns right panel to Page-Level Empty State. | **Working** |
| **Keyboard Undo / Redo** | `Ctrl+Z` / `Ctrl+Y` | Reverts or restores changes in canvas or iframe. | **Working** |
| **Keyboard Tab Switch** | Press `1`, `2`, `3`, `4` | Switches settings panel tab (1=Content, 2=Style, 3=Layout, 4=Motion). | **Working** |
| **Keyboard Panel Toggle** | Press `Ctrl + \` | Collapses or expands the right settings panel. | **Working** |

---

## 7. Features Not Yet Available / Missing

The following features were evaluated during the scan and are categorized as **Not Yet Available**:
- **Real-Time Multiplayer Co-editing**: Concurrent live typing cursors (Google Docs style) are not implemented; changes are saved via snapshots and draft versions.
- **Role-Based Granular Permissions**: Multi-tier permission levels (e.g. Author vs Reviewer vs SuperAdmin) are not enabled; the system uses single-password administrator authentication.
- **Embedded E-Commerce Stripe Payments**: Custom credit card payment block is not built-in (payments use linked donation forms or external URLs).
- **Custom SQL Schema Builder**: Custom database tables cannot be constructed inside the CMS; data is stored as structured page JSON.
