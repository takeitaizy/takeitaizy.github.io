# takeitaizy.dev

Landing page for **takeitaizy** — served via GitHub Pages at [takeitaizy.dev](https://takeitaizy.dev).

## How it works

- `index.html` (home), `work.html` (`/work`, all the projects with demo clips)
  and `workshops.html` (`/workshops`) — generated pages. Edit their sources in
  `_src/` and run `python3 _src/build.py` (standard-library Python, no install);
  `_src/build.py` explains the page format. Hebrew in the markup, English in
  `data-en*` attributes, swapped by the language toggle.
- `site.css`, `site.js` — the styles and behaviour shared by every page. The
  contact form is the Studio OS intake form (`os.takeitaizy.dev/intake`) in an
  iframe on every page; the contract with that app is in `site.js`. The form
  reports the page it sits on as `utm_content` (`embed`, `work`, `workshops`).
- `media/` — the demo clips and screenshots on `/work` (sample data only).
- `brand/` — the official logo, favicon set and share image (`brand/BRAND.md`).
- `privacy.html`, `accessibility.html` — the privacy policy and the accessibility
  statement (served at `/privacy` and `/accessibility`), linked from the footer.
  Hebrew and English in one file each, shown by the same language toggle; they
  share `legal.css` and `legal.js`. What the privacy policy says about the form
  must match what Studio OS stores (`IntakeSubmission`): change one, check the other.
- `404.html` — the not-found page.
- `CNAME` — tells GitHub Pages to serve this site on the custom domain `takeitaizy.dev`.
- Pushing to `main` publishes automatically (org site repo: `takeitaizy.github.io`).

## DNS (at the domain registrar)

| Type  | Host | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | takeitaizy.github.io     |

`.dev` is an HTTPS-only TLD — make sure **Enforce HTTPS** is checked in
repo Settings → Pages once the certificate is issued.
