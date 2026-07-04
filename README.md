# Shopify Builder Framework Theme

Modular Shopify Online Store 2.0 theme implementing the Builder Framework specification.

## Documentation

- **Development plan:** `DEVELOPMENT_PLAN.md`
- **Full specification:** `../md-files/` (docs 01–24)

## Structure

```
assets/          CSS, JS
blocks/          Widget & column theme blocks
config/          Theme settings
layout/          theme.liquid, password.liquid
locales/         Translations
sections/        Builder container, header, footer
snippets/        helper-*, engine-*, widget-wrapper (flat — Shopify requirement)
templates/       JSON templates
```

## Local development

```bash
npm install -g @shopify/cli @shopify/theme
shopify auth login
shopify theme dev --store YOUR_STORE.myshopify.com
```

## Architecture

Container → Column → Widget, with shared engines for styling, responsive, and animation.
