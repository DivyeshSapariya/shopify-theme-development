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

Group order: Content → Layout → Spacing → Background → Border → Animation → Visibility → Advanced
