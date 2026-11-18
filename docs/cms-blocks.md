# SMG Page Builder (Puck CMS) Blocks Guide

This guide explains all available page-builder blocks and Section background options in plain English for editors and non-developers.

---

## 1. Section (Layout Container)

The **Section** is the foundational layout container. It lets you create full-bleed (edge-to-edge) background strips while keeping all text, cards, and media aligned within a clean, centered container.

### Background Themes

- **None (Transparent)**: Default transparent background.
- **Pure White (`#ffffff`)**: Clean, bright white background.
- **Light Slate (`#f8fafc`)**: Soft off-white / light slate background with subtle top and bottom borders.
- **Navy Dark Brand (`#0f2142`)**: High-contrast dark navy brand theme. Automatically makes child headings, paragraphs, and list items bright white and light slate for readability.
- **Background Image**: Allows picking or uploading any photo from your media library.
  - **Image Overlay Strength**: Choose how dark the overlay tint is over your photo (`Subtle 40%`, `Medium 60%`, `Heavy 80%`, or `Navy Brand Tint`) so text always remains legible.

### Vertical Padding Presets

- **Compact (32px - 40px)**: Great for tight separators, notices, and small CTA strips.
- **Normal (48px - 80px)**: Recommended for standard marketing sections.
- **Spacious (64px - 128px)**: Extra breathing room for heroes, flagship feature grids, and closing CTAs.
- **None (0px)**: Removes vertical padding for flush edge-to-edge layouts.

---

## 2. CTA Banner (Marketing)

A high-impact call-to-action banner styled to match SMG's website design.

### Key Fields & Options

- **Eyebrow Pill**: Small uppercase badge above the heading (e.g., _"Strategic Financial Advisory"_).
- **Main Heading**: Bold title in the site's hero serif font.
- **Description**: Supporting paragraph explaining the value proposition.
- **Visual Theme**: Choose between **Navy Dark**, **Light Slate Card**, or **Blue Gradient Brand**.
- **Content Alignment**: Center (default) or Left-aligned.
- **Card Format**: Rounded 3XL Card (default) or Full Width Band.
- **Primary & Secondary Action Buttons**: Customize button text and destination URL (e.g., `/bookanappointment`, `/contact`, or external link).

---

## 3. Stats & Milestones (Marketing)

Display numeric achievements, client counts, and firm metrics that automatically count up smoothly when scrolled into view.

### Key Fields & Options

- **Heading & Description**: Optional section title and intro.
- **Grid Columns**: 2, 3, or 4 columns across desktop screens.
- **Visual Theme**: Navy Dark or Light Slate.
- **Stat Items**:
  - **Value**: Numbers (e.g. `40`, `2500`) will animate. Non-numeric text (e.g. `Decades`) displays cleanly as text without errors.
  - **Prefix & Suffix**: Optional characters (e.g. `$` prefix or `+` / `%` suffix).
  - **Label**: Description of the metric (e.g. _"Dedicated Professionals"_, _"Clients Served"_).

---

## 4. Icon Features Grid (Marketing)

A versatile 2, 3, or 4 column grid of features with curated icons and optional links.

### Key Fields & Options

- **Heading & Subheading**: Section header.
- **Grid Columns**: 2, 3, or 4 columns on desktop.
- **Visual Card Style**:
  - **White Elevated Cards**: Cards with borders and soft hover shadows.
  - **Plain Minimal**: Clean borderless grid.
  - **Centered**: Center-aligned icons and text.
- **Curated Icon List**: Choose from ~24 financial & business icons including _Shield, TrendingUp, Calculator, Users, FileText, Building2, Briefcase, Landmark, Handshake, Award_, and more.
- **Custom Icon Image**: Upload or select an icon image, including `.ico`, for each feature item. If selected, it replaces the curated icon.
- **Icon Position (all cards)**: Choose **Top Left**, **Top Center**, **Left**, or **Right** once to apply the same position to every feature card.
- **Feature Items**: Use the list controls to add or remove cards. The title, description, and link are optional; clear a field to hide that part of the card.
- **Optional Link**: Add an action link (e.g., _"Explore CFO Services"_ -> `/solutions/cfo-advisory-services`).

---

## 5. Bullet / Numbered List (Basics)

Add a dedicated list block for short points, steps, or requirements.

### Key Fields & Options

- **List Items**: Enter one item per line. You can paste selected multi-line text and each non-empty line becomes a separate point.
- **Marker Style**: Choose bullets, numbering, checkmarks, or arrows.
- **List Design**: Choose a simple list, cards, highlighted items, or divider-separated rows.
- **Card Columns**: Display card items in one or two columns.
- **Optional Heading & Typography**: Add a heading and customize list text and spacing.

---

## 6. Form (Lead Capture)

Add a working contact, quote, newsletter, or other lead-capture form to a page. Submissions use the website's existing contact processing, CRM, and email notification workflow.

### Key Fields & Options

- **Form Design**: Choose an elevated card, bordered panel, or minimal presentation.
- **Field Layout**: Choose stacked fields or a responsive two-column layout.
- **Custom Fields**: Add, remove, and reorder short text, email, phone, number, date, long text, dropdown, and checkbox fields. Set labels, field names, placeholders, required status, width, and dropdown options.
- **Email Field**: At least one Email field is required to submit the form.
- **Notifications**: Set an optional email subject. Submissions go to the site's configured notification recipient.
- **Submission Feedback**: Customize the submit button and success message.

---

## 7. Quote Hero + Form (Lead Generation)

Create a split landing-page hero with editable headline and background image beside a compact, two-column quote form.

### Key Fields & Options

- **Hero Content**: Edit the eyebrow, headline, description, background image, and trust points.
- **Quote Form**: Customize its heading, submission type, submit button, success message, and field list.
- **Form Fields**: Add, remove, reorder, and configure the same field types supported by the standalone Form block.
- **Starter Page**: The **Bookkeeping Lead Generation** template combines this hero with service features, a process section, FAQs, and calls to action.

---

## 8. Steps & Process Flow (Marketing)

Showcase step-by-step onboarding, advisory roadmaps, or proven methodologies.

### Key Fields & Options

- **Eyebrow, Heading & Description**: Section header.
- **Layout Orientation**:
  - **Horizontal Grid**: Horizontal connected flow on desktop, automatically transitioning to a clean vertical stack on mobile.
  - **Vertical Cards**: Stacked cards with a continuous connector line.
  - **Connected Timeline**: Vertical chronological line with numbered badges.
- **Items**: Customize step badges (`01`, `02`), step titles, and descriptions.

---

## 9. Calendly Booking Embed (Media)

Embed an interactive appointment scheduling calendar directly into the page.

### Key Fields & Options

- **Heading & Description**: Optional header above the calendar.
- **Calendly Link**: Must start with `https://calendly.com/...`. Non-Calendly links are rejected for safety and fall back to the default discovery call calendar.
- **Widget Height**: Choose between 600px, 700px (standard), 800px, or 900px.
- **Editor Canvas Placeholder**: In the Puck editor, a static placeholder card is displayed for quick editing without loading external iframes. On published public pages, the live interactive calendar renders seamlessly.

---

## 10. Video Embed (Media)

Securely embed YouTube and Vimeo videos with accessibility and performance optimizations.

### Key Fields & Options

- **Video URL**: Paste any YouTube (`youtube.com/watch`, `youtu.be/...`, `youtube.com/shorts`) or Vimeo URL. Unverified third-party hosts are blocked for security.
- **Video Title**: Required for accessibility and screen readers.
- **Aspect Ratio**: 16:9 Widescreen (default) or 4:3 Classic.
- **Caption**: Optional italic text below the video player.
- **Performance**: Loads lazily with privacy-enhanced YouTube domains (`youtube-nocookie.com`).

---

## 11. Spacer & Divider (Layout)

Add precise vertical breathing room and optional divider lines between sections or blocks.

### Key Fields & Options

- **Vertical Spacing Height**: Preset heights from Extra Small (8px) to Extra Large (96px), or custom height from 8px to 240px.
- **Optional Divider Line**:
  - **None**: Invisible blank space (shows a subtle dotted outline in the editor so you can select and reorder it).
  - **Solid Line**: Subtle gray divider.
  - **Dotted Line**: Dotted border divider.
  - **Brand Blue Gradient Line**: Elegant blue gradient accent line.
- **Divider Width**: Standard container (max-6xl), full edge-to-edge width, or short centered accent.

---

## 12. Callout / Notice (Typography / Content)

Highlight important updates, tax deadlines, advisory notes, or success messages.

### Key Fields & Options

- **Variant / Mood**:
  - **Information (Brand Blue)**: Blue accent with Info icon.
  - **Success (Emerald)**: Green accent with checkmark icon.
  - **Warning (Amber)**: Yellow/amber accent with alert triangle.
  - **Important (Navy)**: Dark navy accent for high-priority notices.
- **Title & Text**: Supports multi-line announcements and clean formatting.
- **Optional Action Button**: Add a pill button directly inside the callout (e.g., _"View Tax Guidance"_).
