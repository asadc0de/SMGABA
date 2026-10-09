# SMG ABA Visual CMS: Complete Staff & Volunteer Guide

```yaml
Version: v1.0
Date: 2026-10-09
Based on code: 18afd2e
Status: Draft
```

---

## Table of Contents

1. [Welcome to the CMS](#1-welcome-to-the-cms)
2. [Quick Start: Build Your First Page in 10 Minutes](#2-quick-start-build-your-first-page-in-10-minutes)
3. [Screen Tour: Understanding the Workspace](#3-screen-tour-understanding-the-workspace)
4. [Blocks Library Guide](#4-blocks-library-guide)
5. [Common Day-to-Day Tasks](#5-common-day-to-day-tasks)
6. [Links and Buttons Guide](#6-links-and-buttons-guide)
7. [Brand Colors, Fonts, and Style Rules](#7-brand-colors-fonts-and-style-rules)
8. [Publishing and Safety Guide](#8-publishing-and-safety-guide)
9. [Pre-Publish Checklist](#9-pre-publish-checklist)
10. [Troubleshooting FAQ](#10-troubleshooting-faq)
11. [Glossary of Terms](#11-glossary-of-terms)
12. [Appendix: Features Not Yet Available](#12-appendix-features-not-yet-available)

---

## 1. Welcome to the CMS

In this section, you will learn what the Visual Content Management System (CMS) is and how you can use it to build and maintain pages without writing code.

The SMG ABA Content Management System is a visual website builder designed specifically for your organization. You do not need technical knowledge or programming experience to create pages, update text, upload images, or announce events.

### What you can do with this system
- Create full visual web pages using simple drag-and-drop building blocks.
- Edit headlines, paragraphs, button links, client quotes, and team information in real time.
- Switch between desktop, tablet, and mobile phone views to make sure pages look sharp on all screens.
- Publish changes immediately to your website or save drafts to finish later.
- Revert back to earlier saved versions if you make a mistake.
- Write and publish articles using the built-in **Blog Studio**.
- Manage **Webinar Shortlinks** and **Event Schedules**.

> NOTE: All changes are safely isolated in draft mode until you explicitly click the **Publish** button. You can freely practice and test layouts without affecting the live website.

[SCREENSHOT SS-001: Admin Command Center Overview]
<!-- SCREENSHOT-REQUEST
ID: SS-001
FILE: docs/screenshots/SS-001_dashboard-overview.png
PAGE/ROUTE: /dashboard
BEFORE CAPTURE (setup): Unlock dashboard with admin password, ensure CMS pages, blogs, and short links are populated.
WHAT TO SHOW: Full overview of the Admin Command Center showing workspace module cards and quick statistics.
HIGHLIGHT: Red highlight box around the "CMS Visual Page Builder" module card.
CROP: full screen
VIEWPORT: desktop 1440
ALT TEXT: Admin Command Center showing overview statistics and workspace cards
USED IN: Section 1. Welcome to the CMS
-->

---

## 2. Quick Start: Build Your First Page in 10 Minutes

In this section, you will learn the 5 basic steps to create a new page, customize its content, and publish it live on the website.

### Step 1: Open the Admin Command Center
1. Navigate to `/dashboard` in your browser.
2. Enter your administrator password into the **Admin Password** field.
3. Click **Unlock Dashboard**.

### Step 2: Create a New Page
1. Click the **CMS Visual Page Builder** card or go to `/cms`.

[SCREENSHOT SS-002: CMS Page Management Directory]
<!-- SCREENSHOT-REQUEST
ID: SS-002
FILE: docs/screenshots/SS-002_cms-pages-list.png
PAGE/ROUTE: /cms
BEFORE CAPTURE (setup): Unlock CMS, ensure list displays 3-5 pages with published and draft badges.
WHAT TO SHOW: Page management directory showing search bar, status badges, and top-right action buttons.
HIGHLIGHT: Red highlight box around the "+ New Page" button.
CROP: full screen
VIEWPORT: desktop 1440
ALT TEXT: CMS page directory showing list of pages and New Page button
USED IN: Section 2. Quick Start
-->

2. Click the **+ New Page** button in the top right corner.
3. Enter your page title (for example, `Annual Charity Golf Outing`).
4. Choose a starting template (such as **Event Registration** or **Blank Page**).
5. Click **Create Page**. The visual editor will open immediately.

[SCREENSHOT SS-003: Create New Page Template Selection]
<!-- SCREENSHOT-REQUEST
ID: SS-003
FILE: docs/screenshots/SS-003_create-new-page-templates.png
PAGE/ROUTE: /cms/new
BEFORE CAPTURE (setup): Open /cms/new with title "Annual Charity Golf Outing" typed into the title box.
WHAT TO SHOW: Template selection grid displaying template preview cards and the Create Page button.
HIGHLIGHT: Red arrow pointing to the "Event Registration" template card.
CROP: full screen
VIEWPORT: desktop 1440
ALT TEXT: Create new page modal with title input and template cards
USED IN: Section 2. Quick Start
-->

### Step 3: Add and Edit Blocks
1. On the left side of your screen, look for the block list (under **Basics** and **Sections**).
2. Click and drag a block (for example, **Top Banner** or **Cards Grid**) onto the canvas in the center.
3. Click on the block you just dropped. A blue outline will highlight it.
4. On the right side panel, edit the text, headline, or button links.

### Step 4: Check Mobile View
1. Look at the top bar in the center.
2. Click the mobile phone icon labeled **375px**.
3. Verify that your headlines, buttons, and pictures fit neatly on mobile screens.
4. Click the desktop monitor icon labeled **100%** to return to desktop view.

### Step 5: Save and Publish
1. Click **Save Draft** at any time to save your progress.
2. When your page is ready, click **Publish**.
3. The system will run a safety scan. If everything is clear, click **Publish Page Anyway**.
4. Your page is now live on the website.

---

## 3. Screen Tour: Understanding the Workspace

In this section, you will learn about the four main areas of the Visual Editor: the Top Bar, the Left Block Drawer, the Center Canvas, and the Right Settings Panel.

[SCREENSHOT SS-004: Visual Editor Workspace Tour]
<!-- SCREENSHOT-REQUEST
ID: SS-004
FILE: docs/screenshots/SS-004_visual-editor-layout.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Open an active page with Top Banner, Text, and CardGrid blocks loaded.
WHAT TO SHOW: Complete visual editor window showing Top Bar, Left Block Drawer, Center Canvas, and Right Settings Panel.
HIGHLIGHT: Four numbered callout badges: 1 on Top Bar, 2 on Left Drawer, 3 on Canvas, 4 on Right Settings Panel.
CROP: full screen
VIEWPORT: desktop 1440
ALT TEXT: Four main sections of the visual page builder
USED IN: Section 3. Screen Tour
-->

### 3.1 The Top Bar
The sticky bar at the very top of your screen contains your primary page controls:

[SCREENSHOT SS-005: Top Bar Controls Close-Up]
<!-- SCREENSHOT-REQUEST
ID: SS-005
FILE: docs/screenshots/SS-005_top-bar-controls.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Load any page in the editor.
WHAT TO SHOW: Detailed view of the sticky top bar from left to right.
HIGHLIGHT: Red highlight box around the Undo, Device Viewports, SEO, and Publish buttons.
CROP: top bar only
VIEWPORT: desktop 1440
ALT TEXT: Top bar showing navigation, undo/redo, device viewports, and publish actions
USED IN: Section 3.1 The Top Bar
-->

- **< Pages**: Returns to the main CMS page list.
- **Page Title**: Shows the title of the page you are currently working on.
- **Saved Indicator**: Shows when the page was last saved (for example, `Saved just now`).
- **Undo (<)** / **Redo (>)**: Steps backward or forward through your edits. Shortcut: `Ctrl+Z` (Undo) and `Ctrl+Y` (Redo).
- **Device Viewports (100% / 768px / 375px)**: Switches the canvas between desktop, tablet, and mobile views.
- **Animations**: Toggles scroll animations on or off while editing so elements stay visible.
- **Versions**: Opens your saved version history to view or restore previous versions.
- **SEO**: Opens search engine and social media sharing card settings.
- **Duplicate**: Makes an exact clone of the current page as a new draft.
- **Add to Nav**: Adds this page directly into the website's top header dropdown or footer links.
- **Save Draft**: Saves your current work to the cloud without publishing it live.
- **Publish**: Performs a pre-publish safety scan and makes the page live on the website.

### 3.2 The Left Panel (Blocks Drawer)
The left panel contains all the building blocks you can add to your page.

[SCREENSHOT SS-006: Left Block Drawer]
<!-- SCREENSHOT-REQUEST
ID: SS-006
FILE: docs/screenshots/SS-006_left-blocks-drawer.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Open visual editor, ensure left drawer is open and search box is empty.
WHAT TO SHOW: Left panel drawer displaying search box and the three collapsible categories (Basics, Sections, Advanced).
HIGHLIGHT: Red highlight on the search input box and category header bars.
CROP: left panel only
VIEWPORT: desktop 1440
ALT TEXT: Left panel block drawer showing searchable block categories
USED IN: Section 3.2 The Left Panel
-->

- **Search box**: Type any block name (such as `Button`, `Gallery`, `FAQ`) to filter the list instantly.
- **Basics**: Core elements including **Heading**, **Text**, **Image**, **Button**, **Spacer**, and **Divider**.
- **Sections**: Pre-styled content blocks including **Top Banner**, **Cards Grid**, **Photo Gallery**, **FAQ Accordion**, **Call to Action**, **Stats**, **Feature List**, **Process Steps**, **Testimonial Quote**, and **Testimonial Carousel**.
- **Advanced**: Structural components including **Columns Layout**, **Container Section**, **Video Player**, **Calendly Calendar**, and **Notice Box** (collapsed by default).

### 3.3 The Center Canvas
The center canvas is your live interactive preview area:
- Hovering your mouse over any block displays a dashed outline with the block's name.
- Clicking any block highlights it with a solid blue outline and opens its settings on the right panel.
- Above a selected block, a floating action toolbar appears with **Move Up**, **Move Down**, **Duplicate**, and **Delete** buttons.
- Hovering between sections displays a dashed line with a **+ Add Section** button to insert new content directly between existing blocks.
- At the very bottom of the page, click **+ Add Blank Section Beneath** to append a clean container to the end of the page.

[SCREENSHOT SS-007: Canvas Selection and Action Toolbar]
<!-- SCREENSHOT-REQUEST
ID: SS-007
FILE: docs/screenshots/SS-007_canvas-selection-toolbar.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Select a Button or CardGrid block on the canvas.
WHAT TO SHOW: Selected block with solid blue border, floating action toolbar above it, and hover divider below it.
HIGHLIGHT: Floating action toolbar buttons (Move Up, Move Down, Duplicate, Delete).
CROP: canvas only
VIEWPORT: desktop 1440
ALT TEXT: Canvas view showing selected block action toolbar and hover insertion divider
USED IN: Section 3.3 The Center Canvas
-->

### 3.4 The Right Settings Panel
The right panel contains the customizable properties of whichever block is selected.

[SCREENSHOT SS-008: Right Settings Panel Tabs]
<!-- SCREENSHOT-REQUEST
ID: SS-008
FILE: docs/screenshots/SS-008_right-settings-panel.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Select a Button block to reveal all 4 settings tabs.
WHAT TO SHOW: Right panel showing Breadcrumbs, Action icons, Search box, Simple/Adv toggle, and the 4 tabs (Content, Style, Layout, Motion).
HIGHLIGHT: Red box around the 4 tab buttons (Content, Style, Layout, Motion).
CROP: right panel only
VIEWPORT: desktop 1440
ALT TEXT: Right settings panel showing tabs and property controls
USED IN: Section 3.4 The Right Settings Panel
-->

- **Breadcrumb Navigation**: Shows the path to your element (for example, `Page > Container Section > Button`). Click any item in the breadcrumb to select the parent section.
- **Search Settings**: Type keywords like `color`, `font`, `shadow`, or `link` to find specific settings instantly.
- **Simple | Adv Mode**:
  - **Simple Mode** (Default): Keeps controls straightforward, hiding complex layout options.
  - **Adv Mode**: Reveals advanced controls such as custom padding pixels and display options.
- **Tabs**:
  1. **Content**: Text copy, headlines, media links, and button destinations.
  2. **Style**: Colors, background tints, font sizes, corner shapes, and shadows.
  3. **Layout**: Width, height, margin spacing, and alignment (Left, Center, Right).
  4. **Motion**: Scroll entrance effects and hover animations.
- **Collapse Arrow**: Click the arrow button on the left edge of the panel (or press `Ctrl + \`) to collapse the panel and maximize your canvas view.

### 3.5 The Empty State (Page-Level Settings)
When no block on the canvas is selected, the right panel automatically shows page-level settings:

[SCREENSHOT SS-009: Right Panel Empty State]
<!-- SCREENSHOT-REQUEST
ID: SS-009
FILE: docs/screenshots/SS-009_empty-state-page-settings.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Deselect all blocks by clicking outside or pressing Escape key.
WHAT TO SHOW: Right settings panel in empty state showing "No Element Selected" message and 3 quick page cards.
HIGHLIGHT: Red highlight on Page Title, SEO & Social Metadata, and Header Banner cards.
CROP: right panel only
VIEWPORT: desktop 1440
ALT TEXT: Right settings panel empty state with page title, SEO, and banner controls
USED IN: Section 3.5 The Empty State
-->

1. **Page Title**: View and edit the internal name of your page. Click **Edit**, change the text, and click **Save**.
2. **SEO & Social Metadata**: Click this card to open the SEO drawer and configure Google snippets and social share images.
3. **Header Banner**: Toggle the top photographic background hero banner on or off with one click.

---

## 4. Blocks Library Guide

In this section, you will learn about all 21 blocks available in the CMS, when to use each one, and how to configure them.

---

### 4.1 Basics Category

#### Heading
- **When to use**: For major section titles, subheadings, and topic dividers.
- **How to add**: Drag **Heading** from the **Basics** category onto your canvas.
- **What you can edit**:
  - Text copy.
  - Heading Level: `H1` (Page main title), `H2` (Major sections), `H3` (Card titles), `H4`, `H5`, `H6`.
  - Text Alignment: `Left`, `Center`, `Right`.
  - Color, top margin, and bottom margin.
- **Mobile appearance**: Heading sizes scale down automatically so long words do not break off the screen.

#### Text (Rich Text)
- **When to use**: For paragraphs, descriptions, announcements, and narrative body copy.
- **How to add**: Drag **Text** from the **Basics** category onto your canvas.
- **What you can edit**: Text copy with full formatting (Bold, Italic, Bullet points, Numbered lists, and Links).
- **Mobile appearance**: Text wraps cleanly with comfortable reading line heights.

#### Image
- **When to use**: For photographs, flyers, partner logos, or event banners.
- **How to add**: Drag **Image** from the **Basics** category onto your canvas.
- **What you can edit**:
  - Image Source: Upload from your computer, choose from the site media library, or paste a URL.
  - Alt Text: Descriptive text for search engines and screen readers.
  - Corner Rounding: `None`, `Small`, `Medium`, `Large`, or `Pill`.
  - Image Caption and Lightbox click zoom.
- **Mobile appearance**: Resizes to 100% of the screen width with aspect ratio preserved.

#### Button
- **When to use**: For calls to action such as `Register Now`, `Donate Today`, `Download Guide`, or `Contact Us`.
- **How to add**: Drag **Button** from the **Basics** category onto your canvas.
- **What you can edit**:
  - Label text.
  - Destination Link: Select an internal page, external web URL, email address, or phone number.
  - Variant Style: `Solid Navy`, `Emerald Green`, `Outline`, or `Ghost`.
  - Button Size: `Small`, `Medium`, or `Large`.
  - Alignment: `Left`, `Center`, or `Right`.
- **Mobile appearance**: Centered or full-width buttons that are easy to tap with a thumb.

#### Spacer
- **When to use**: To add clean breathing room between sections.
- **How to add**: Drag **Spacer** from the **Basics** category.
- **What you can edit**: Vertical height (`None`, `Small`, `Medium`, `Large`, `Extra Large`).
- **Mobile appearance**: Automatically shrinks slightly on mobile to avoid excessive scrolling.

#### Divider
- **When to use**: To place a thin horizontal separator line between topics.
- **How to add**: Drag **Divider** from the **Basics** category.
- **What you can edit**: Line style (`Solid`, `Dashed`, `Dotted`), line thickness, and line color.

---

### 4.2 Sections Category

#### Top Banner (Hero)
- **When to use**: At the top of your page to create an engaging visual introduction.
- **What you can edit**:
  - Eyebrow badge text (e.g. `Annual Charity Event`).
  - Main headline and description text.
  - Background photographic image and dark gradient overlay tint.
  - Primary button label and link.
  - Secondary button label and link.

[SCREENSHOT SS-010: Top Banner Block Settings]
<!-- SCREENSHOT-REQUEST
ID: SS-010
FILE: docs/screenshots/SS-010_hero-banner-settings.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Select a Top Banner (Hero) block on the canvas.
WHAT TO SHOW: Top Banner block in canvas alongside the Content tab in the right settings panel.
HIGHLIGHT: Headline, Eyebrow, and Primary Button fields in the right panel.
CROP: full screen
VIEWPORT: desktop 1440
ALT TEXT: Top Banner block configuration in visual editor
USED IN: Section 4.2 Sections Category
-->

#### Cards Grid
- **When to use**: To showcase services, sponsors, speaker bios, or program highlights side-by-side.
- **What you can edit**:
  - Columns: `2 Columns`, `3 Columns`, or `4 Columns`.
  - Individual Cards: Click **Add Card** to add a new card. For each card, edit title, icon, description, badge, and button link.
  - Card Appearance: `Bordered White`, `Muted Gray`, or `Elevated Shadow`.

#### Photo Gallery
- **When to use**: For photo galleries of past events, golf outings, or team photos.
- **What you can edit**:
  - Add or remove images.
  - Column count (2, 3, or 4 columns).
  - Captions and clickable lightbox popup previews.

#### FAQ Accordion
- **When to use**: For frequently asked questions where visitors can click a question to expand the answer.
- **What you can edit**: Add new FAQ items with question titles and answer text.

#### Call to Action (CTA Strip)
- **When to use**: At the middle or end of a page to encourage visitors to take immediate action.
- **What you can edit**: Catchy headline, supporting sentence, background color (e.g. Navy or Blue), and action button.

#### Stats
- **When to use**: To highlight key metrics (such as `$500K+ Raised`, `2,500+ Donors`, `100% Volunteer Driven`).
- **What you can edit**: Number value, descriptive label, and icon for each stat item.

#### Feature List
- **When to use**: To list key benefits, schedule highlights, or organization values with colored icons.
- **What you can edit**: 2 to 4 items with icon picker, item title, and short explanation.

#### Process Steps
- **When to use**: To guide visitors through a step-by-step process (e.g. `Step 1: Register`, `Step 2: Get Confirmation`, `Step 3: Attend`).
- **What you can edit**: Step number (`01`, `02`, `03`), step title, and step description.

#### Testimonial Quote
- **When to use**: To display a quote from a donor, sponsor, client, or community leader.
- **What you can edit**: Quote text, author name, author title or company, star rating (1 to 5 stars), and avatar photo.

#### Testimonial Carousel
- **When to use**: To show multiple testimonials in a slider format that visitors can swipe through.
- **What you can edit**: Multiple review slides with navigation arrows and dot indicators.

---

### 4.3 Advanced Category

#### Columns Layout
- **When to use**: To create custom side-by-side layouts (e.g. text on the left, an image on the right).
- **What you can edit**: Column distribution (`50/50`, `33/33/33`, `30/70`, `70/30`). You can drop any basic block directly into each column.

#### Container Section
- **When to use**: To create a custom background container box with special padding or background colors.
- **What you can edit**: Background color, background image, container width (`Boxed` or `Full Width`), and padding.

#### Video Player
- **When to use**: To embed an introductory video, event recording, or sponsor message.
- **What you can edit**: YouTube URL, Vimeo URL, or MP4 video link. The player automatically maintains correct proportions.

#### Calendly Calendar
- **When to use**: To allow visitors to schedule appointments or discovery calls directly on the page.
- **What you can edit**: Calendly scheduling URL and widget height.

#### Notice Box (Callout)
- **When to use**: For urgent notices, registration deadlines, or special announcements.
- **What you can edit**: Alert style (`Info Blue`, `Success Green`, `Warning Amber`, `Neutral Gray`), icon, and message.

---

## 5. Common Day-to-Day Tasks

In this section, you will learn step-by-step instructions for the most common updates you will perform on the website.

### 5.1 How to Change Text and Headlines
1. Click on the text or headline you want to edit on the canvas.
2. In the right settings panel under the **Content** tab, locate the **Text** or **Headline** box.
3. Type your new wording. The canvas updates immediately.
4. Click **Save Draft** in the top right corner.

### 5.2 How to Upload and Replace an Image
1. Click on the image you want to change.
2. In the right settings panel under **Media & Assets**, click **Upload & Media Gallery**.
3. A popup window will open with three options:
   - **Upload New**: Click **Choose File** and select a photo from your computer.
   - **Site Media Library**: Click on any previously uploaded image.
   - **External URL**: Paste a link to an image hosted elsewhere.
4. Click on the photo you want. The window will close and the image will update on your page.

[SCREENSHOT SS-011: Media Gallery and Image Upload Popup]
<!-- SCREENSHOT-REQUEST
ID: SS-011
FILE: docs/screenshots/SS-011_media-gallery-picker.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Select an Image block and click the "Upload & Media Gallery" button to open the modal.
WHAT TO SHOW: Open Media Gallery modal showing Upload tab, Site Assets grid, and Select button.
HIGHLIGHT: Upload drop area and image asset thumbnails.
CROP: full screen
VIEWPORT: desktop 1440
ALT TEXT: Media Gallery picker modal showing uploaded images and site assets
USED IN: Section 5.2 How to Upload and Replace an Image
-->

### 5.3 How to Add or Remove a Card in a Grid
1. Click on the **Cards Grid** block on the canvas.
2. In the right settings panel under **Collection & Items**, scroll down to the card list.
3. **To add a card**: Click **+ Add Card Item**. A new card appears with sample text.
4. **To remove a card**: Click the red trash icon next to the card you want to delete.
5. **To reorder cards**: Use the up and down arrow buttons next to the card.

### 5.4 How to Duplicate, Move, or Delete a Block
1. Click on the block on the canvas.
2. Look at the small floating toolbar directly above the block:
   - Click the **Up Arrow** or **Down Arrow** to move the block up or down.
   - Click the **Duplicate** icon (two overlapping squares) to create an exact copy.
   - Click the **Trash** icon to delete the block.
   - Alternatively, right-click on the block to open the context menu.

### 5.5 How to Preview on Mobile and Tablet
1. Look at the top bar.
2. Click **768px** to preview the tablet layout.
3. Click **375px** to preview the mobile phone layout.
4. Verify that buttons are easy to click and text sizes are comfortable to read.
5. Click **100%** to return to the full desktop view.

[SCREENSHOT SS-012: Mobile Viewport 375px Preview]
<!-- SCREENSHOT-REQUEST
ID: SS-012
FILE: docs/screenshots/SS-012_mobile-viewport-preview.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Click the 375px mobile phone icon in the top bar.
WHAT TO SHOW: Editor canvas resized to 375px mobile phone width showing responsive layout.
HIGHLIGHT: Red highlight box around the 375px button in the top bar.
CROP: canvas and top bar
VIEWPORT: desktop 1440
ALT TEXT: Visual editor in 375px mobile device preview mode
USED IN: Section 5.5 How to Preview on Mobile and Tablet
-->

### 5.6 How to Restore an Earlier Version
If you made changes that you want to undo completely:
1. Click **Versions** in the top bar.
2. A slide-out drawer will appear on the right listing all saved snapshots with dates and times.
3. Find the version you want and click **Restore Version**.
4. The canvas will immediately revert to that saved point in time.

[SCREENSHOT SS-013: Version History Slide-Out Drawer]
<!-- SCREENSHOT-REQUEST
ID: SS-013
FILE: docs/screenshots/SS-013_version-history-drawer.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Click the "Versions" button in the top bar to open the version history list.
WHAT TO SHOW: Slide-out drawer on right listing version numbers, save dates, and Restore buttons.
HIGHLIGHT: Red highlight on the "Restore Version" button of a previous snapshot.
CROP: right panel and canvas
VIEWPORT: desktop 1440
ALT TEXT: Version history drawer with list of snapshots and restore buttons
USED IN: Section 5.6 How to Restore an Earlier Version
-->

### 5.7 How to Update the Annual Charity Golf Page Each Year
When preparing for a new annual event (such as the Golf Outing or Gala):
1. Go to `/cms`.
2. Find the previous year's page (e.g. `annual-golf-outing-2025`).
3. Click the **Duplicate** icon next to the page.
4. Name the new duplicate `Annual Golf Outing 2026` with slug `annual-golf-outing-2026`.
5. Click **Edit** on the new page.
6. Update the date, location, ticket prices, and schedule.
7. Replace past sponsor logos with current sponsors in the **Cards Grid** or **Photo Gallery**.
8. Click **Publish** when ready.
9. Click **Add to Nav** to update the top menu link.

---

## 6. Links and Buttons Guide

In this section, you will learn how to configure buttons and links so visitors always land on the right destination.

Whenever you edit a button or link field in the CMS, you will see a simple segmented selector:

[SCREENSHOT SS-014: Link Destination Picker]
<!-- SCREENSHOT-REQUEST
ID: SS-014
FILE: docs/screenshots/SS-014_link-picker-segmented.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Select any Button block and expand the Links & Buttons subgroup in the right panel.
WHAT TO SHOW: The 4-segment Link Picker control (Page, External, Email, Phone) and the destination field.
HIGHLIGHT: Red highlight box around the Page dropdown selector.
CROP: right panel only
VIEWPORT: desktop 1440
ALT TEXT: Segmented link destination selector with Page, External, Email, and Phone options
USED IN: Section 6. Links and Buttons Guide
-->

### Link Destination Types

1. **Page (Internal Page)**:
   - Use this to link to any page on your website (such as `/about-us`, `/contact`, `/blog`, or another CMS page).
   - Select the page title from the dropdown menu. You do not need to type URLs manually.

2. **External (Outside Website)**:
   - Use this to link to an outside website (such as a ticketing portal, sponsor website, or news article).
   - Enter the complete web address starting with `https://` (for example, `https://eventbrite.com/your-event`).

3. **Email**:
   - Use this so that clicking the button automatically opens the visitor's email program.
   - Enter the target email address (for example, `info@smgaba.com`).

4. **Phone**:
   - Use this so that mobile phone users can tap the button to call your office directly.
   - Enter the phone number (for example, `+1 (631) 555-0100`).

---

## 7. Brand Colors, Fonts, and Style Rules

In this section, you will learn the official brand palette and styling rules used across the website.

To keep the website looking clean and professional, the CMS includes preset brand color swatches:

[SCREENSHOT SS-015: Brand Color Swatches in Right Panel]
<!-- SCREENSHOT-REQUEST
ID: SS-015
FILE: docs/screenshots/SS-015_color-swatches-palette.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Select a Button or Section block and expand the Colors & Swatches group in the Style tab.
WHAT TO SHOW: The 6 circular brand color swatch dots and the "+" custom color picker button.
HIGHLIGHT: Red highlight around the 6 brand color dots.
CROP: right panel only
VIEWPORT: desktop 1440
ALT TEXT: Brand color swatch selector in the Style tab
USED IN: Section 7. Brand Colors and Fonts
-->

### Official Brand Color Palette

| Color Name | Hex Code | Best Used For |
| :--- | :--- | :--- |
| **Deep Navy (Primary)** | `#0f2142` | Primary buttons, main titles, top header banners, footer background. |
| **Royal Blue (Accent)** | `#2563eb` | Links, active tab indicators, informational highlights. |
| **Emerald Green (Action)** | `#059669` | Donation buttons, success notices, registration confirmations. |
| **Amber Gold (Warm)** | `#d97706` | Warning badges, upcoming date highlights, important reminders. |
| **Slate Gray (Muted)** | `#64748b` | Subtitles, helper descriptions, divider lines, secondary text. |
| **Pure White** | `#ffffff` | Card surfaces, clean section backgrounds, light button text. |

### Typography Guidelines
- **Headings**: Clean serif/sans typography automatically applied from site theme.
- **Body Text**: Sans-serif typography optimized for reading clarity on mobile screens.

---

## 8. Publishing and Safety Guide

In this section, you will learn how the publishing process works, how safety checks protect your live website, and how to unpublish a page if needed.

### 8.1 How Publishing Works
1. When working in the editor, your edits are saved as a **Draft**.
2. Visitors on the live website will not see your changes until you click **Publish**.
3. When you click **Publish**, the CMS automatically executes a **Pre-Publish Safety Check**.

[SCREENSHOT SS-016: Pre-Publish Safety Scan Dialog]
<!-- SCREENSHOT-REQUEST
ID: SS-016
FILE: docs/screenshots/SS-016_publish-safety-check.png
PAGE/ROUTE: /cms/$id/edit
BEFORE CAPTURE (setup): Create a test page with one unconfigured button link and click the Publish button.
WHAT TO SHOW: Safety Check dialog window listing detected warnings (e.g. empty link, placeholder text) and action buttons.
HIGHLIGHT: Warning item and the "Publish Page Anyway" button.
CROP: full screen
VIEWPORT: desktop 1440
ALT TEXT: Pre-Publish Safety Check dialog scanner showing issue list
USED IN: Section 8. Publishing and Safety Guide
-->

### 8.2 What the Safety Scan Checks
The safety scanner reviews your page for common oversights before going live:
- **Empty Button Links**: Buttons that have not been assigned a destination link.
- **Missing Images**: Image blocks that have no photo selected.
- **Empty Headlines**: Major banner headlines that are blank.
- **Placeholder Text**: Remaining `Lorem ipsum` or dummy placeholder filler text.

> TIP: If the scan finds warnings, click **Back to Fix Issues** to correct them, or click **Publish Page Anyway** if you intend to publish as-is.

### 8.3 How to Unpublish a Page
If an event has passed or a page needs to be temporarily taken offline:
1. Open the page in the editor.
2. Click **Unpublish** in the top bar.
3. The page status changes back to **Draft**. Visitors trying to access the URL will see a clean `404 - Page Not Found` message until you republish it.

---

## 9. Pre-Publish Checklist

In this section, use this quick 8-point checklist before making any page public.

- [ ] **Title Check**: Is the page headline clear, descriptive, and free of typos?
- [ ] **Button Links**: Have all buttons been tested to make sure they open the correct page or external site?
- [ ] **Image Quality**: Are all uploaded photos clear and properly oriented?
- [ ] **Mobile Preview**: Have you clicked the **375px** button in the top bar to verify the mobile phone view?
- [ ] **Dates & Times**: Are all event dates, locations, and deadlines up to date?
- [ ] **Contact Info**: Are phone numbers and email addresses accurate?
- [ ] **SEO Title & Description**: Did you click **SEO** in the top bar and write a 1-sentence summary for Google?
- [ ] **Navigation**: If visitors should find this page from the menu, did you click **Add to Nav**?

---

## 10. Troubleshooting FAQ

In this section, you will find answers to the most common questions and issues.

### Why is my page not appearing on Google yet?
New pages take time for search engines to index. Make sure you clicked **SEO** in the top bar, entered a clear **SEO Title** and **Meta Description**, and published the page.

### I made changes but they are not showing on my phone.
Make sure you clicked the **Publish** button in the top right corner. Saving a draft only updates your internal editor, not the public website. Also try refreshing your mobile browser.

### Can I undo a deletion if I accidentally deleted a block?
Yes. Immediately click the **Undo (<)** button in the top bar or press `Ctrl + Z` on your keyboard. Alternatively, click **Versions** and restore your last saved snapshot.

### My image looks blurry on the page.
Use original high-resolution JPG or PNG images (recommended width: 1200px to 2000px). Avoid uploading small thumbnails.

### How do I add a new article to the blog?
Go to `/dashboard` and click **Blog Studio** (or go to `/blogs-editor`). Click **Create New Article**, write your content, and click **Publish**.

---

## 11. Glossary of Terms

In this section, common website and CMS terms are defined in plain language.

- **Block**: A modular piece of content (like a Heading, Image, Button, or Card Grid) that you can drag onto the canvas.
- **Canvas**: The middle area of the editor where your webpage is displayed and edited.
- **Draft**: A saved version of your page that is only visible to team members inside the CMS.
- **Published**: A page that is live on the internet and accessible to all website visitors.
- **Slug**: The URL path of a page (for example, in `smgaba.com/golf-outing`, `golf-outing` is the slug).
- **SEO (Search Engine Optimization)**: Information (like title and description) that search engines use when displaying your page in search results.
- **Hero / Top Banner**: The large introductory banner at the very top of a web page.
- **Lightbox**: A popup window that enlarges an image when a visitor clicks on it.
- **Drawer**: The collapsible left panel containing the block library.

---

## 12. Appendix: Features Not Yet Available

In this section, features that are not currently part of the CMS are listed for reference.

- **Real-Time Multi-User Simultaneous Editing**: Multiple users cannot edit the exact same page at the exact same second (like Google Docs). Edits are saved on a per-version basis.
- **Custom Credit Card Payment Gateway Blocks**: Direct credit card processing blocks are not built into the visual canvas. Use button links to your organization's secure donation or registration portal.
- **Custom SQL Database Builder**: The CMS is designed for visual layout and content management, not arbitrary database schema creation.
