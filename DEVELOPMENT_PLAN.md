# Shopify Builder Framework — Development Plan

**Project:** `shopify-theme-development`  
**Source of truth:** `../md-files/` (docs 01–24)  
**Status:** Phase 0 — not started  
**Engineer workflow:** One task at a time → implement → verify → fix → next task

---

## 1. Objective

Build a production-ready **Shopify Online Store 2.0 theme** that implements the **Shopify Builder Framework**:

- Elementor-like layout building inside the **native Theme Editor**
- Strict separation: **Containers (layout) → Columns (grouping) → Widgets (content)**
- Shared **engines** for styling, responsive, animation, and accessibility
- **CSS variables for values**, global CSS for behavior
- **ES modules**, lazy-loaded, no jQuery
- Lighthouse targets: Performance 95+, Accessibility 95+, Best Practices 100, SEO 100

---

## 2. Current Project State

| Item | Status |
|------|--------|
| `shopify-theme-development/` theme files | **Empty** (README only) |
| Git remote | `github.com/DivyeshSapariya/shopify-theme-development` |
| Specification docs | **Complete** (24 MD files in `md-files/`) |
| Shopify CLI / dev store | **To be configured in Phase 0** |

**Conclusion:** Greenfield implementation. No legacy code to migrate.

---

## 3. Architecture Decisions (Locked for v1)

These decisions unblock implementation. They follow the MD specs and Shopify OS 2.0 constraints.

### 3.1 Shopify mapping

| Framework layer | Shopify artifact | Location |
|-----------------|------------------|----------|
| Builder Container | Section | `sections/builder-container.liquid` |
| Child Container (Column) | Theme block (nested) | `blocks/column.liquid` |
| Widget | Theme block (nested inside column) | `blocks/heading.liquid`, etc. |
| Engines | Liquid snippets | `snippets/engines/*.liquid` |
| Helpers | Liquid snippets | `snippets/helpers/*.liquid` |
| Widget wrappers | Liquid snippets | `snippets/widgets/*.liquid` |
| Schema fragments | JSON reference + Liquid includes | `snippets/schema/*.liquid` |

> **Note:** Nested theme blocks (column → widgets) are required. Column block schema must declare allowed child block types.

### 3.2 Scoped CSS output

Per component instance:

1. Generate unique class: `builder-container--{id}`, `builder-column--{id}`, `builder-widget--{id}`
2. Variable engine outputs scoped rules in a single `<style>` block per section render (batched, not per-widget)
3. Global behavior lives in `assets/engine.css` — never duplicated

### 3.3 Schema strategy

Shopify requires `{% schema %}` in section/block files. Reusable groups are maintained as:

- `snippets/schema/spacing.liquid` → outputs JSON fragment via `capture`
- Included into block/section schemas to avoid duplication

Group order (all components): **Content → Layout → Style → Animation → Responsive → Advanced**

### 3.4 JavaScript loading

- `assets/builder.js` — entry, lazy-loads modules
- `assets/core/` — app, events, loader, observer
- `assets/modules/` — accordion, tabs, slider, etc.
- Modules initialize only when matching `[data-builder-widget]` exists on page

### 3.5 Naming conventions (enforced)

| Type | Prefix | Example |
|------|--------|---------|
| Framework CSS | `builder-` | `.builder-container` |
| Utilities | `u-` | `.u-flex` |
| JS hooks | `js-` / `data-builder-*` | `data-builder-type="accordion"` |
| CSS variables | short names | `--pt`, `--fs`, `--bg` |

---

## 4. Development Phases

Each phase ends with a **Verification Gate** (Section 6). Do not start the next phase until the gate passes.

---

### Phase 0 — Environment & Skeleton

**Goal:** Runnable empty Shopify theme with tooling.

| Task | Deliverable |
|------|-------------|
| 0.1 | Install Shopify CLI, link dev store |
| 0.2 | Create folder structure per doc 04 |
| 0.3 | `layout/theme.liquid` — minimal shell, asset slots |
| 0.4 | `layout/password.liquid` |
| 0.5 | `config/settings_schema.json` — global theme settings stub |
| 0.6 | `config/settings_data.json` |
| 0.7 | `locales/en.default.json` — base translations |
| 0.8 | Placeholder `templates/index.json` |
| 0.9 | `.shopifyignore`, theme metadata in README |
| 0.10 | `shopify theme dev` runs without errors |

**Gate 0:** Theme uploads, preview loads, Theme Check passes (no errors).

---

### Phase 1 — CSS Foundation & Design Tokens

**Goal:** Global CSS architecture (docs 05, 17, 19 partial).

| Task | Deliverable |
|------|-------------|
| 1.1 | `assets/variables.css` — `:root` design tokens |
| 1.2 | `assets/engine.css` — layout, flex, grid, spacing behavior via vars |
| 1.3 | `assets/utilities.css` — `u-*` classes |
| 1.4 | `assets/responsive.css` — breakpoint definitions |
| 1.5 | `assets/animations.css` — keyframes + motion behavior |
| 1.6 | `assets/widgets.css` — minimal widget shells |
| 1.7 | Load order in `theme.liquid`: variables → engine → utilities → responsive → animations → widgets |

**Gate 1:** All CSS files exist, valid syntax, no widget-specific rules in engine.css.

---

### Phase 2 — Liquid Helpers & Variable Engine

**Goal:** Convert settings → scoped CSS variables (docs 14, 17).

| Task | Deliverable |
|------|-------------|
| 2.1 | `snippets/helpers/unique-id.liquid` |
| 2.2 | `snippets/helpers/class-builder.liquid` |
| 2.3 | `snippets/helpers/responsive-values.liquid` |
| 2.4 | `snippets/helpers/sanitize-value.liquid` |
| 2.5 | `snippets/helpers/style-builder.liquid` |
| 2.6 | `snippets/engines/variable-engine.liquid` |
| 2.7 | `snippets/engines/spacing-engine.liquid` |
| 2.8 | Unit test fixtures (static setting objects → expected CSS output) |

**Gate 2:** Given mock settings, variable engine outputs correct scoped `--pt`, `--fs`, etc.

---

### Phase 3 — Style, Responsive & Layout Engines

**Goal:** Complete engine core before any UI (docs 09, 10).

| Task | Deliverable |
|------|-------------|
| 3.1 | `snippets/engines/layout-engine.liquid` |
| 3.2 | `snippets/engines/typography-engine.liquid` |
| 3.3 | `snippets/engines/background-engine.liquid` |
| 3.4 | `snippets/engines/border-engine.liquid` |
| 3.5 | `snippets/engines/shadow-engine.liquid` |
| 3.6 | `snippets/engines/position-engine.liquid` |
| 3.7 | `snippets/engines/visibility-engine.liquid` |
| 3.8 | `snippets/engines/responsive-engine.liquid` |
| 3.9 | `snippets/engines/advanced-engine.liquid` (class, id, aria, attrs) |

**Gate 3:** Engines compose without duplication; each file has single responsibility.

---

### Phase 4 — Schema System & Reusable Control Groups

**Goal:** Standardized editor settings (docs 15, 16, 23).

| Task | Deliverable |
|------|-------------|
| 4.1 | `snippets/schema/spacing.liquid` |
| 4.2 | `snippets/schema/typography.liquid` |
| 4.3 | `snippets/schema/background.liquid` |
| 4.4 | `snippets/schema/border.liquid` |
| 4.5 | `snippets/schema/shadow.liquid` |
| 4.6 | `snippets/schema/animation.liquid` |
| 4.7 | `snippets/schema/responsive.liquid` |
| 4.8 | `snippets/schema/advanced.liquid` |
| 4.9 | `snippets/schema/layout.liquid` |
| 4.10 | Document setting ID → engine mapping |

**Gate 4:** Schema fragments render valid JSON; group order consistent across all fragments.

---

### Phase 5 — Builder Container & Column System

**Goal:** Core layout section working in Theme Editor (doc 07).

| Task | Deliverable |
|------|-------------|
| 5.1 | `sections/builder-container.liquid` — HTML structure per spec |
| 5.2 | `blocks/column.liquid` — nested block, accepts widgets |
| 5.3 | Container schema: layout, spacing, background, responsive |
| 5.4 | Column schema: width, order, flex-grow, spacing |
| 5.5 | Wire all engines into container + column render pipeline |
| 5.6 | `templates/page.builder.json` — blank builder page template |

**Gate 5:** In Theme Editor: add container → add columns → reorder → settings preview live. No direct widgets in container.

---

### Phase 6 — Widget System Foundation

**Goal:** Shared widget lifecycle (doc 08).

| Task | Deliverable |
|------|-------------|
| 6.1 | `snippets/widgets/widget-start.liquid` |
| 6.2 | `snippets/widgets/widget-end.liquid` |
| 6.3 | `snippets/widgets/widget-wrapper.liquid` |
| 6.4 | Widget contract: `data-builder-id`, `data-builder-type`, `data-builder-widget` |
| 6.5 | Base widget schema mixin (content + inherited groups) |
| 6.6 | Animation engine snippet (`snippets/engines/animation-engine.liquid`) |

**Gate 6:** Empty widget block renders correct wrapper HTML with scoped variables and advanced panel settings.

---

### Phase 7 — Basic Widgets (MVP Content)

**Goal:** First usable page-building blocks (doc 18 — Basic category).

| Widget | Block file | JS | Priority |
|--------|-----------|-----|----------|
| Heading | `blocks/heading.liquid` | No | P0 |
| Text / Paragraph | `blocks/paragraph.liquid` | No | P0 |
| Button | `blocks/button.liquid` | No | P0 |
| Image | `blocks/image.liquid` | No | P0 |
| Icon | `blocks/icon.liquid` | No | P1 |
| Divider | `blocks/divider.liquid` | No | P1 |
| Spacer | `blocks/spacer.liquid` | No | P1 |
| HTML | `blocks/html.liquid` | No | P2 |
| Video | `blocks/video.liquid` | No | P1 |

**Gate 7:** Build a 2-column hero layout (image + heading + text + button) entirely in Theme Editor. Responsive padding works on desktop/tablet/mobile.

---

### Phase 8 — JavaScript Core & Interactive Widgets

**Goal:** Modular JS architecture (doc 06).

| Task | Deliverable |
|------|-------------|
| 8.1 | `assets/builder.js` + `assets/core/app.js` |
| 8.2 | `assets/core/loader.js` — conditional module loading |
| 8.3 | `assets/core/events.js`, `assets/core/observer.js` |
| 8.4 | `assets/helpers/debounce.js`, `dom.js` |
| 8.5 | `BuilderModule` base class (init/destroy contract per doc 14) |
| 8.6 | `assets/modules/accordion.js` → `blocks/accordion.liquid` |
| 8.7 | `assets/modules/tabs.js` → `blocks/tabs.liquid` |
| 8.8 | `assets/modules/counter.js` → `blocks/counter.liquid` |
| 8.9 | `assets/modules/countdown.js` → `blocks/countdown.liquid` |

**Gate 8:** Interactive widgets work with keyboard navigation; JS not loaded on pages without those widgets.

---

### Phase 9 — Theme Shell (Header, Footer, Templates)

**Goal:** Complete storefront, not just builder pages.

| Task | Deliverable |
|------|-------------|
| 9.1 | `sections/header.liquid` |
| 9.2 | `sections/footer.liquid` |
| 9.3 | `sections/announcement-bar.liquid` |
| 9.4 | `templates/product.json`, `collection.json`, `cart.json` |
| 9.5 | `templates/blog.json`, `article.json`, `search.json` |
| 9.6 | `templates/index.json` — demo homepage with builder sections |

**Gate 9:** Full storefront navigable; builder sections work on index and page templates.

---

### Phase 10 — Shopify Commerce Widgets

**Goal:** E-commerce blocks (doc 18 — Shopify category).

| Widget | Priority |
|--------|----------|
| Product Card | P0 |
| Product Grid | P0 |
| Collection Grid | P0 |
| Featured Product | P1 |
| Related Products | P1 |
| Buy Button / Variant Picker | P1 |
| Cart Icon / Cart Drawer | P2 |

**Gate 10:** Product page and collection page render with builder + native Shopify objects; cart flow works.

---

### Phase 11 — Marketing & Media Widgets

**Goal:** Landing page capability (doc 18).

| Category | Widgets |
|----------|---------|
| Marketing | CTA, Testimonial, Pricing Table, Logo Grid, Feature Box, Progress Bar |
| Media | Gallery, Slider, Carousel, Before/After |

**Gate 11:** Marketing landing page template demonstrable with 5+ widget types.

---

### Phase 12 — Global Systems (Tokens, Presets, Registry)

**Goal:** Docs 19, 20, 17 full integration.

| Task | Deliverable |
|------|-------------|
| 12.1 | Global design token settings in `settings_schema.json` |
| 12.2 | Token → CSS variable propagation at `:root` |
| 12.3 | Theme preset JSON structure + preset picker |
| 12.4 | CSS Variable Registry doc synced with implementation |
| 12.5 | Preset applies across containers/widgets |

**Gate 12:** Change primary color in theme settings → all components inherit.

---

### Phase 13 — Advanced Systems

**Goal:** Docs 21, 22 — post-MVP platform features.

| Task | Deliverable |
|------|-------------|
| 13.1 | Dynamic data system (metafields, metaobjects) |
| 13.2 | Import/export section JSON |
| 13.3 | Editor component library polish (doc 23) |
| 13.4 | Nested container support (container inside column) — if Shopify limits allow |

**Gate 13:** Export builder section → import on fresh page → identical render.

---

### Phase 14 — QA, Performance & Release Hardening

**Goal:** Doc 24 requirements met for v1.0.0 release.

| Task | Deliverable |
|------|-------------|
| 14.1 | Theme Check — zero errors |
| 14.2 | Lighthouse audit on index, product, builder page |
| 14.3 | WCAG 2.2 AA audit (keyboard, screen reader, contrast) |
| 14.4 | Cross-browser smoke test (Chrome, Safari, Firefox, Edge) |
| 14.5 | Responsive matrix (desktop → small mobile) |
| 14.6 | Theme Editor regression (duplicate, delete, reorder blocks) |
| 14.7 | Performance budget: CSS < 50KB gzipped core, JS lazy chunks < 15KB each |
| 14.8 | README + widget changelog |

**Gate 14 (Release):** All targets in Section 6 met.

---

## 5. Task Execution Protocol

For **every task**, follow this loop:

```
1. Read relevant MD doc section
2. Inspect existing files (no assumptions)
3. Implement smallest complete unit
4. Run verification (Theme Check / CLI / manual editor test)
5. If fail → fix immediately → re-verify
6. Mark task done in this file
7. Proceed to next task
```

**Git commits:** One logical unit per task, format per doc 03:

```
feat: add variable engine
fix: correct tablet spacing inheritance
refactor: extract spacing schema fragment
```

---

## 6. Verification Gates (Definition of Done)

### Per-task checklist

- [ ] Matches architecture (layout ≠ content ≠ styling)
- [ ] No duplicated logic (reuse engines)
- [ ] Naming conventions followed
- [ ] Responsive: desktop / tablet / mobile
- [ ] Accessibility: semantic HTML, focus, ARIA where needed
- [ ] No inline CSS / no inline JS
- [ ] Theme Check passes
- [ ] Works in Theme Editor live preview

### Per-phase checklist

- [ ] All phase tasks complete
- [ ] Gate criteria met
- [ ] No console errors in browser
- [ ] Documentation updated if contracts changed

### Release checklist (v1.0.0)

- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices = 100
- [ ] Lighthouse SEO = 100
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Phase 7 basic widgets + Phase 5 container complete
- [ ] Phase 9 templates complete

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Nested block depth limits** in Shopify | Column → widget nesting may break | Use theme blocks API; test early in Phase 5; fallback: flat block list with `block.type` grouping |
| **Schema size limits** per section/block | Advanced panel may exceed JSON limit | Split schema fragments; defer rare controls to v1.1; monitor byte size |
| **Scoped `<style>` bloat** with many instances | Performance / HTML size | Batch variables per section into one `<style>` block; deduplicate identical value sets |
| **Liquid logic complexity** | Unmaintainable engines | Strict single-responsibility snippets; helpers for shared logic; no business logic in templates |
| **No dev store configured** | Cannot verify in editor | Phase 0 task 0.1 — configure before Phase 5 |
| **100+ widgets in spec** | Scope creep | MVP = Phase 7 + 9 + 10 core only; remaining widgets versioned (v1.1, v1.2) |
| **Responsive setting UX** in native editor | Cluttered sidebar | Use headers + collapsible groups; responsive suffix pattern `_tablet`, `_mobile` on setting IDs |
| **CSS variable naming collisions** | Style bugs | Enforce registry (doc 17); code review every new variable |
| **Animation + reduced motion** | A11y failure | `prefers-reduced-motion` in animations.css from Phase 1 |
| **Doc 14 filename mismatch** | Confusion | File named `Development_Roadmap.md` contains API contracts — this plan supersedes for execution order |

---

## 8. MVP vs Full Framework

### v1.0.0 MVP (ship first)

- Phases 0–9 complete
- Phase 7 basic widgets (P0 + P1)
- Phase 10: Product Grid, Collection Grid, Product Card
- Phase 14 release gate

### v1.1

- Phase 8 interactive widgets (full)
- Phase 10 remaining commerce widgets
- Phase 11 marketing widgets (priority subset)

### v1.2

- Phase 12 global tokens & presets
- Phase 13 import/export + dynamic data

### v2.0

- Remaining widget library (navigation, forms, blog, dynamic)
- Mega menu, popup builder, form builder
- AI-assisted layout (future doc reference)

---

## 9. Immediate Next Actions

**Starting now — Phase 0, Task 0.2** (folder skeleton; CLI/store setup runs in parallel when credentials available):

1. Create complete theme folder structure per doc 04
2. Scaffold `layout/theme.liquid` with asset loading
3. Add minimal `config/`, `locales/`, `templates/index.json`
4. Verify with `shopify theme check` (or CLI equivalent)

---

## 10. Progress Tracker

| Phase | Name | Status |
|-------|------|--------|
| 0 | Environment & Skeleton | ✅ Complete (CLI installed, Theme Check passes) |
| 1 | CSS Foundation | ✅ Complete |
| 2 | Helpers & Variable Engine | ✅ Complete |
| 3 | Style/Responsive/Layout Engines | ⬜ Not started (partial in engine.css) |
| 4 | Schema System | ⬜ Not started |
| 5 | Builder Container & Columns | 🟡 Wired with engines; editor test pending |
| 6 | Widget System Foundation | ✅ widget-wrapper + 4 basic widgets |
| 7 | Basic Widgets | 🟡 Heading, Paragraph, Button, Image done |
| 8 | JavaScript & Interactive Widgets | ⬜ Not started |
| 9 | Theme Shell & Templates | ⬜ Not started |
| 10 | Shopify Commerce Widgets | ⬜ Not started |
| 11 | Marketing & Media Widgets | ⬜ Not started |
| 12 | Global Tokens & Presets | ⬜ Not started |
| 13 | Advanced Systems | ⬜ Not started |
| 14 | QA & Release | ⬜ Not started |

---

*This plan is the execution authority for development. MD files in `md-files/` remain the specification authority for behavior and contracts.*
