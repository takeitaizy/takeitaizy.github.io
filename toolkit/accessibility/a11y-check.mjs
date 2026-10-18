#!/usr/bin/env node
// Accessibility check for any page we ship: axe-core (WCAG 2.1 A + AA) at a
// desktop and a phone viewport, then a keyboard walk with Tab.
//
//   node a11y-check.mjs https://example.com/ https://example.com/contact
//
// Env:
//   PW           path to the playwright package (default: "playwright")
//   AXE          path to axe.min.js (default: resolved from "axe-core")
//   CHROME_PATH  Chromium executable (optional; /opt/pw-browsers/chromium in cloud sessions)
// Flags:
//   --tabs N           max Tab presses per page (default 80)
//   --no-skip-link     don't require the first Tab stop to be a skip link
//   --json FILE        also write the full report as JSON
//
// Exit code 1 when any page has an axe violation or a keyboard failure.
// Passing this is evidence, not compliance: a person still has to check
// reading order, alt text quality, captions and the statement's claims.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const opt = { tabs: 80, skipLink: true, json: null, urls: [] };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--tabs') opt.tabs = Number(args[++i]);
  else if (a === '--no-skip-link') opt.skipLink = false;
  else if (a === '--json') opt.json = args[++i];
  else opt.urls.push(a);
}
if (!opt.urls.length) {
  console.error('usage: node a11y-check.mjs [--tabs N] [--no-skip-link] [--json FILE] URL...');
  process.exit(2);
}

const { chromium } = require(process.env.PW || 'playwright');
const axeSource = readFileSync(process.env.AXE || require.resolve('axe-core/axe.min.js'), 'utf8');

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function runAxe(page) {
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(
    (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
    TAGS,
  );
}

async function pageBasics(page) {
  return page.evaluate(() => ({
    lang: document.documentElement.getAttribute('lang') || '',
    dir: document.documentElement.getAttribute('dir') || '',
    title: document.title.trim(),
  }));
}

// Style of the focused element that changes when focus is shown.
const FOCUS_PROPS = ['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow',
  'borderColor', 'backgroundColor', 'color', 'textDecorationLine'];

async function keyboardWalk(page) {
  const stops = [];
  const failures = [];
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
  let first = null;
  for (let i = 0; i < opt.tabs; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate((props) => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      // Two links can share a tag and href; number each element once so identity is exact.
      if (!el.__a11yStop) el.__a11yStop = (window.__a11yStops = (window.__a11yStops || 0) + 1);
      const key = el.__a11yStop;
      const id = el.tagName + (el.id ? '#' + el.id : '') +
        (el.getAttribute('href') ? `[href="${el.getAttribute('href')}"]` : '');
      const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '')
        .trim().replace(/\s+/g, ' ').slice(0, 60);
      if (el.tagName === 'IFRAME') return { key, id, label, iframe: true };
      const r = el.getBoundingClientRect();
      const pick = () => { const s = getComputedStyle(el); return props.map((p) => s[p]); };
      const focused = pick();
      el.blur();
      const blurred = pick();
      el.focus();
      const visible = focused.some((v, k) => v !== blurred[k]);
      const onScreen = r.width > 0 && r.height > 0;
      const skip = /^#/.test(el.getAttribute('href') || '') &&
        /skip|דלג|main|content|תוכן/i.test(label + ' ' + el.className);
      return { key, id, label, visible, onScreen, skip };
    }, FOCUS_PROPS);
    if (!stop) break;
    if (first && stop.key === first.key && stops.length > 1) break; // wrapped around
    if (!first) first = stop;
    stops.push(stop);
    if (stop.iframe) break; // focus moved into an embedded document; check that page on its own
  }
  if (!stops.length) failures.push('nothing on the page takes keyboard focus');
  if (opt.skipLink && stops.length && !stops[0].skip) {
    failures.push(`first Tab stop is not a skip link: ${stops[0].id} "${stops[0].label}"`);
  }
  for (const s of stops) {
    if (s.iframe) continue;
    if (!s.onScreen) failures.push(`focus lands on an invisible element: ${s.id} "${s.label}"`);
    else if (!s.visible) failures.push(`no visible focus indicator: ${s.id} "${s.label}"`);
  }
  // Same element twice in a row means Tab can't leave it.
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].key === stops[i - 1].key && !stops[i].iframe) {
      failures.push(`possible keyboard trap at ${stops[i].id}`);
      break;
    }
  }
  return { stops, failures };
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
});
const report = [];
let failed = false;

for (const url of opt.urls) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: !!vp.isMobile,
      hasTouch: !!vp.hasTouch,
    });
    const page = await ctx.newPage();
    const entry = { url, viewport: vp.name, problems: [] };
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      const basics = await pageBasics(page);
      if (!basics.lang) entry.problems.push('<html> has no lang');
      if (/^(he|ar)/i.test(basics.lang) && basics.dir !== 'rtl') {
        entry.problems.push(`lang="${basics.lang}" without dir="rtl"`);
      }
      if (!basics.title) entry.problems.push('page has no <title>');
      const axe = await runAxe(page);
      entry.axe = axe.violations.map((v) => ({
        id: v.id, impact: v.impact, help: v.help,
        targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
        count: v.nodes.length,
      }));
      if (vp.name === 'desktop') entry.keyboard = await keyboardWalk(page);
    } catch (err) {
      entry.problems.push(`could not load: ${err.message.split('\n')[0]}`);
    }
    await ctx.close();

    const kb = entry.keyboard?.failures || [];
    const bad = entry.problems.length + (entry.axe?.length || 0) + kb.length;
    if (bad) failed = true;
    console.log(`\n${bad ? 'FAIL' : 'PASS'}  ${url}  [${vp.name}]`);
    for (const p of entry.problems) console.log(`  page: ${p}`);
    for (const v of entry.axe || []) {
      console.log(`  axe ${v.impact}: ${v.id} (${v.count}) ${v.help}`);
      for (const t of v.targets) console.log(`      ${t}`);
    }
    if (entry.keyboard) {
      console.log(`  keyboard: ${entry.keyboard.stops.length} Tab stops`);
      for (const f of kb) console.log(`  keyboard: ${f}`);
    }
    report.push(entry);
  }
}

await browser.close();
if (opt.json) writeFileSync(opt.json, JSON.stringify(report, null, 2));
console.log(failed ? '\nFAILED' : '\nALL PASSED');
process.exit(failed ? 1 : 0);
