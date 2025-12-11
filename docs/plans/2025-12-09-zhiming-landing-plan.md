# 知命达理容易斋单页原型 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a high-fidelity static single page for「知命达理容易斋」per `docs/zhiming-website-design.md`, with images represented via prompts and ready for later framework migration.

**Architecture:** Static Vite (vanilla) app serving `index.html` with split CSS/JS. Use CSS variables for theme, grid/flex for layout, and light JS for smooth scroll/CTA interactions. Keep assets in `public/` for easy reuse when migrating to React/Vue.

**Tech Stack:** Vite (vanilla), HTML5 semantic structure, CSS3 (variables, grid/flex, animations), minimal ES modules.

### Task 1: Scaffold Vite vanilla workspace

**Files:**
- Create: `package.json`, `index.html`, `style.css`, `main.js`, `vite.config.js`

**Step 1: Initialize Vite vanilla project**

```bash
npm create vite@latest . -- --template vanilla
```

**Step 2: Install deps**

```bash
npm install
```

**Step 3: Verify dev server boots**

```bash
npm run dev -- --host
# Expect: Vite dev server ready on localhost
```

### Task 2: Implement theme tokens and global layout

**Files:**
- Modify: `style.css`
- Modify: `index.html`

**Step 1: Define CSS variables for palette, spacing, typography**

Add `:root` tokens for primary dark/gold/bg-cream/accent-red, text colors, radii, shadows.

**Step 2: Import fonts & base styles**

Load Noto Serif SC + Noto Sans SC, set body defaults, anchors, buttons, container widths, sections spacing, sticky header base.

### Task 3: Build page sections per design

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Step 1: Header + nav**

Create sticky header with logo text and nav links that anchor to sections.

**Step 2: Hero with background and CTA**

Add hero section with starry gradient background + taiji watermark via CSS, main/sub title, CTA button.

**Step 3: About, Featured Articles, Services, VIP, Footer**

Implement semantic sections with cards/grids matching the doc: about card with gold border, articles grid (3 cards), services dark block with 3 service cards, VIP gradient card with red border, footer with links and disclaimer.

### Task 4: Animations, responsiveness, and interactions

**Files:**
- Modify: `style.css`
- Modify: `main.js`

**Step 1: Keyframes + transition states**

Add fadeInUp/fadeInDown, pulse, hover transforms for nav links/cards/buttons per spec.

**Step 2: Responsive adjustments**

Media query at 768px to stack grids, adjust font sizes/margins, make nav mobile friendly (wrap/stack simple).

**Step 3: Smooth scrolling**

In `main.js`, hook nav link clicks to `scrollIntoView({behavior:'smooth'})`; ensure CTA scrolls to services/VIP.

### Task 5: Image prompt inventory

**Files:**
- Create: `docs/image-prompts.md`

**Step 1: Write prompts and filenames**

List needed illustrative assets (hero background, article thumbnails, service icons) with: filename, scene description, style cues, aspect ratio. Keep Chinese prompt text.

### Task 6: Run and verify

**Files:**
- N/A

**Step 1: Start dev server and smoke test UI**

```bash
npm run dev -- --host
```

Verify layout, hover/scroll behaviors, responsive wrap (manually resize). Ensure no console errors.

**Step 2: Prepare for preview**

If needed for static preview: `npm run build` and `npm run preview`.

**Step 3: Summarize changes**

Note key files modified and prompts prepared.
