# Schema Fragments

Canonical setting definitions for the Builder Framework. Shopify `{% schema %}` cannot include Liquid — copy from these JSON files into section/block schemas and keep IDs in sync.

| File | Engine consumer |
|------|-----------------|
| `spacing.json` | `engine-spacing` |
| `background.json` | `engine-background` |
| `border.json` | `engine-border` |
| `typography.json` | `engine-typography` |
| `animation.json` | `engine-animation` + `helper-animation-classes` |
| `visibility.json` | `helper-visibility-classes` |
| `advanced.json` | `helper-class-builder`, `helper-attribute-builder` |
| `registry.json` | Setting ID → engine mapping |

## CSS variable output

Engines output **CSS custom properties only** (never `padding-top: 40px`).

Variables are applied on each element via inline `style`:

```html
<section class="builder-container builder-container--a1b2c" style="--pt: 40px; --gap: 24px;">
```

Global `engine.css` applies behavior: `padding-top: var(--pt)`.

Setting reads use `helper-setting-value.liquid` (dot notation) — not `settings[key]`.
