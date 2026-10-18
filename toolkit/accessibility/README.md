# Accessibility toolkit

What every public site or app Take It AIzy builds gets:

| File | What it is |
|---|---|
| `statement-template.md` | Hebrew + English accessibility statement with `{{fields}}` and a **לוודא** note per section saying what to check before a line stays in. |
| `a11y-check.mjs` | One script for every project: axe-core (WCAG 2.1 A + AA) at desktop and phone size, plus a Tab walk (skip link first, visible focus, no traps). Exit 1 on any failure. |
| `contract-clause.md` | Clause for client agreements: we build and test to IS 5568 / WCAG 2.1 AA and supply the template; the client approves and publishes the statement and owns the content it uploads. Approved by Razi, 2026-10-18; 30-day free-fix window. |

## Running the check

```bash
# in a project that has playwright and axe-core installed
node a11y-check.mjs https://site/ https://site/contact --json a11y-$(date +%F).json

# in a Claude cloud session, with paths from elsewhere
PW=/path/to/node_modules/playwright \
AXE=/path/to/node_modules/axe-core/axe.min.js \
CHROME_PATH=/opt/pw-browsers/chromium \
node a11y-check.mjs https://site/
```

Run it on every page (or one page per template), after login for pages
behind a login. An embedded form or widget from another origin stops the Tab
walk at the iframe; check that page on its own URL. `--no-skip-link` is for
apps where the first focus stop is deliberately something else; say why.

Keep the JSON output with the date in the project. It is the evidence behind
"How we tested" in the statement.

## Before a statement goes live

- Every page passes the check, desktop and phone.
- A person read each alt text and the statement itself.
- Every line in "features" was checked; the rest were deleted.
- "Known limitations" lists anything not tested (third-party widgets, PDFs, videos).
- The client approved the text and the contact details.
