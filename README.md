# takeitaizy.dev

Landing page for **takeitaizy** — served via GitHub Pages at [takeitaizy.dev](https://takeitaizy.dev).

## How it works

- `index.html` — the coming-soon page (single file, no build step).
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
