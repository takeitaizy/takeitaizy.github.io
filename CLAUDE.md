# takeitaizy.dev

Landing page for Take It AIzy, served by GitHub Pages from `main`. A single
static `index.html` with no build step. See `README.md` for DNS and Pages setup.

## Brand: always use the official logo

The official logo files and brand rules are in `brand/` (`brand/BRAND.md`).
Use them everywhere the company appears: the site, favicon, OG image,
proposals, specs, decks and docs. Never redraw, trace, retype or recolor the logo;
copy the files from `brand/logo/` and `brand/favicon/`.

- Navy `#0E1C30` and white are the official colors.
- SVG on the web, PNG (2400 px) in documents.
- In running text the name is "Take It AIzy" (Osher and Razi, 2026-10-18); the logo itself reads TAKE IT AIZY. `takeitaizy` only for the domain and handles.

## Accessibility menu

`a11y-widget.js` is our own floating accessibility menu (text size, contrast,
links, font, greyscale, stop animations). Load it on every page, and keep the
"Personal adjustments" paragraph of `accessibility.html` in step with what it
offers. Every animation must start from the visible state, so that "stop
animations" and `prefers-reduced-motion` leave nothing hidden. A page has to
pass `toolkit/accessibility/a11y-check.mjs` with the menu closed.

## Writing

- Site copy is bilingual: Hebrew first (RTL), English secondary.
- Hebrew copy must read natural: no em-dashes and no AI-sounding phrasing.
- Don't invent stats, logos or testimonials. Use a visible `[placeholder]` until there's real data.
