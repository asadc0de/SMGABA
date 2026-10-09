# SMG ABA Visual CMS: Master Screenshot Manifest

```yaml
Version: v1.0
Date: 2026-10-09
Based on code: ebc61f0
Status: Draft
```

---

## Overview

This manifest catalogs all required screenshots for the **SMG ABA Visual CMS User Guide** (`CMS_User_Guide.md`).
Every screenshot ID matches the machine-readable request comments embedded throughout the documentation.

### Summary Statistics
- **Total Screenshots Requested**: 16
- **Must-Have (Critical Workflow)**: 12
- **Nice-to-Have (Supplementary Visuals)**: 4
- **Current Status**: All Pending capture

---

## Master Screenshot Table

| ID | Title | Route / Screen | Setup Steps | Highlight Element | Crop Region | Viewport | Guide Section | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SS-001** | Admin Command Center Overview | `/dashboard` | Unlock dashboard with admin password, ensure CMS pages, blogs, and short links are populated. | Red highlight box around the "CMS Visual Page Builder" module card. | Full Screen | Desktop 1440 | Section 1. Welcome | **Must** | `Pending` |
| **SS-002** | CMS Page Management Directory | `/cms` | Unlock CMS, ensure list displays 3-5 pages with published and draft badges. | Red highlight box around the "+ New Page" button. | Full Screen | Desktop 1440 | Section 2. Quick Start | **Must** | `Pending` |
| **SS-003** | Create New Page Template Selection | `/cms/new` | Open `/cms/new` with title "Annual Charity Golf Outing" typed into the title box. | Red arrow pointing to the "Event Registration" template card. | Full Screen | Desktop 1440 | Section 2. Quick Start | **Must** | `Pending` |
| **SS-004** | Visual Editor Workspace Tour | `/cms/$id/edit` | Open an active page with Top Banner, Text, and CardGrid blocks loaded. | Four numbered callout badges: 1 on Top Bar, 2 on Left Drawer, 3 on Canvas, 4 on Right Settings Panel. | Full Screen | Desktop 1440 | Section 3. Screen Tour | **Must** | `Pending` |
| **SS-005** | Top Bar Controls Close-Up | `/cms/$id/edit` | Load any page in the editor with changes made. | Red highlight box around Undo, Device Viewports, SEO, and Publish buttons. | Top Bar Only | Desktop 1440 | Section 3.1 The Top Bar | **Must** | `Pending` |
| **SS-006** | Left Block Drawer | `/cms/$id/edit` | Open visual editor, ensure left drawer is open and search box is empty. | Red highlight on search input box and category header bars. | Left Panel Only | Desktop 1440 | Section 3.2 The Left Panel | **Must** | `Pending` |
| **SS-007** | Canvas Selection and Action Toolbar | `/cms/$id/edit` | Select a Button or CardGrid block on the canvas. | Floating action toolbar buttons (Move Up, Move Down, Duplicate, Delete). | Canvas Only | Desktop 1440 | Section 3.3 The Center Canvas | **Must** | `Pending` |
| **SS-008** | Right Settings Panel Tabs | `/cms/$id/edit` | Select a Button block to reveal all 4 settings tabs. | Red box around the 4 tab buttons (Content, Style, Layout, Motion). | Right Panel Only | Desktop 1440 | Section 3.4 Right Settings Panel | **Must** | `Pending` |
| **SS-009** | Right Panel Empty State | `/cms/$id/edit` | Deselect all blocks by clicking outside or pressing Escape key. | Red highlight on Page Title, SEO & Social Metadata, and Header Banner cards. | Right Panel Only | Desktop 1440 | Section 3.5 The Empty State | Nice | `Pending` |
| **SS-010** | Top Banner Block Settings | `/cms/$id/edit` | Select a Top Banner (Hero) block on the canvas. | Headline, Eyebrow, and Primary Button fields in the right panel. | Full Screen | Desktop 1440 | Section 4.2 Sections Category | Nice | `Pending` |
| **SS-011** | Media Gallery and Image Upload Popup | `/cms/$id/edit` | Select an Image block and click the "Upload & Media Gallery" button to open modal. | Upload drop area and image asset thumbnails. | Full Screen | Desktop 1440 | Section 5.2 Upload Image | **Must** | `Pending` |
| **SS-012** | Mobile Viewport 375px Preview | `/cms/$id/edit` | Click the 375px mobile phone icon in the top bar. | Red highlight box around the 375px button in the top bar. | Canvas & Top Bar | Desktop 1440 | Section 5.5 Mobile Preview | **Must** | `Pending` |
| **SS-013** | Version History Slide-Out Drawer | `/cms/$id/edit` | Click the "Versions" button in the top bar to open the version history list. | Red highlight on the "Restore Version" button of a previous snapshot. | Right Panel & Canvas | Desktop 1440 | Section 5.6 Restore Version | **Must** | `Pending` |
| **SS-014** | Link Destination Picker | `/cms/$id/edit` | Select any Button block and expand the Links & Buttons subgroup in the right panel. | Red highlight box around the Page dropdown selector. | Right Panel Only | Desktop 1440 | Section 6. Links and Buttons | **Must** | `Pending` |
| **SS-015** | Brand Color Swatches in Right Panel | `/cms/$id/edit` | Select a Button or Section block and expand Colors & Swatches group in Style tab. | Red highlight around the 6 brand color dots. | Right Panel Only | Desktop 1440 | Section 7. Brand Colors | Nice | `Pending` |
| **SS-016** | Pre-Publish Safety Scan Dialog | `/cms/$id/edit` | Create a test page with one unconfigured button link and click Publish button. | Warning item and the "Publish Page Anyway" button. | Full Screen | Desktop 1440 | Section 8. Publishing Guide | **Must** | `Pending` |

---

## Optimized Capture Workflow (Batch Order)

To minimize screen setup time, capture screenshots in the following 5 logical batches:

### Batch 1: Administrative Navigation (2 screenshots)
1. **SS-001**: Open `/dashboard` -> Unlock -> Full screen capture of Command Center.
2. **SS-002**: Navigate to `/cms` -> Full screen capture of Page Management directory.

### Batch 2: Page Creation Flow (1 screenshot)
3. **SS-003**: Navigate to `/cms/new` -> Type title `Annual Charity Golf Outing` -> Full screen capture showing template picker.

### Batch 3: Visual Editor Workspace & Core Panels (6 screenshots)
*Setup: Open a sample page in `/cms/$id/edit` with Top Banner, Text, and CardGrid blocks.*
4. **SS-004**: Full screen workspace tour with 4 numbered callouts.
5. **SS-005**: Crop sticky top bar showing undo, viewports, versions, publish.
6. **SS-006**: Crop left block drawer showing search box and collapsible categories.
7. **SS-007**: Click a button or card -> Crop canvas showing active selection outline and floating action toolbar.
8. **SS-008**: Crop right panel showing breadcrumb, search, simple/advanced toggle, and the 4 tabs.
9. **SS-010**: Select Top Banner block -> Full screen view showing canvas and Content settings tab.

### Batch 4: Right Panel Specialized Controls & Empty State (3 screenshots)
*Setup: Stay in editor `/cms/$id/edit`.*
10. **SS-009**: Press `Esc` to deselect everything -> Crop right panel showing Page Title, SEO, and Banner quick cards.
11. **SS-014**: Select a Button block -> Expand Links group -> Crop segmented picker (Page, External, Email, Phone).
12. **SS-015**: Switch to Style tab -> Expand Colors group -> Crop 6 brand color dots and custom color button.

### Batch 5: Modals, Drawers & Responsive Views (4 screenshots)
*Setup: Stay in editor `/cms/$id/edit`.*
13. **SS-011**: Select an Image block -> Click **Upload & Media Gallery** -> Full screen capture of media picker modal.
14. **SS-012**: Click **375px** mobile viewport in top bar -> Crop canvas and top bar showing responsive view.
15. **SS-013**: Click **Versions** in top bar -> Capture right slide-out version history drawer.
16. **SS-016**: Add a dummy button without a URL -> Click **Publish** -> Full screen capture of the Pre-Publish Safety Scan alert modal.

---

## Replacement Instructions for Muse.ai

When screenshots have been captured and saved to `docs/screenshots/`:
1. Save each image file matching the exact path listed in the request comment (e.g. `docs/screenshots/SS-001_dashboard-overview.png`).
2. Replace each `[SCREENSHOT SS-XXX: ...]` block and its accompanying `<!-- SCREENSHOT-REQUEST ... -->` comment in `CMS_User_Guide.md` with standard markdown image syntax:
   ```markdown
   ![Alt text describing the screenshot](screenshots/SS-001_dashboard-overview.png)
   ```
