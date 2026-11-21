/* Accessibility menu for every page of takeitaizy.dev.
   Our own code: no third-party script, no cookies, no requests. The choices
   are kept in this browser only (localStorage key "taizy-a11y").

   It adds a floating button and a small dialog with: text size, high contrast,
   underlined links, a plain readable font, greyscale and "stop animations".
   Each choice is a class on <html>; the page's own CSS and the rules below do
   the rest. The menu is a help on top of the page, not a replacement for the
   fixes in the markup: the page has to pass a11y-check.mjs with it closed. */
(function () {
  "use strict";
  var KEY = "taizy-a11y";
  var ZOOMS = [1, 1.15, 1.3, 1.5];
  var OPTS = ["contrast", "links", "font", "gray", "still"];
  var root = document.documentElement;
  var state = { z: 0, contrast: false, links: false, font: false, gray: false, still: false };

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved === "object") {
      if (saved.z >= 0 && saved.z < ZOOMS.length) state.z = Math.floor(saved.z);
      OPTS.forEach(function (k) { state[k] = saved[k] === true; });
    }
  } catch (e) {}

  function apply() {
    OPTS.forEach(function (k) { root.classList.toggle("a11y-" + k, state[k]); });
    root.style.setProperty("--a11y-zoom", String(ZOOMS[state.z]));
    root.classList.toggle("a11y-zoomed", state.z > 0);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  apply();

  var T = {
    he: { open: "תפריט נגישות", title: "נגישות", close: "סגירת תפריט הנגישות", size: "גודל הטקסט",
          smaller: "הקטנת הטקסט", bigger: "הגדלת הטקסט", contrast: "ניגודיות גבוהה", links: "הדגשת קישורים",
          font: "גופן קריא", gray: "גווני אפור", still: "עצירת אנימציות", reset: "איפוס", statement: "הצהרת נגישות",
          note: "הבחירות נשמרות בדפדפן שלכם בלבד." },
    en: { open: "Accessibility menu", title: "Accessibility", close: "Close the accessibility menu", size: "Text size",
          smaller: "Smaller text", bigger: "Larger text", contrast: "High contrast", links: "Underline links",
          font: "Readable font", gray: "Greyscale", still: "Stop animations", reset: "Reset", statement: "Accessibility statement",
          note: "Your choices are kept in this browser only." }
  };
  function lang() { return root.lang === "en" ? "en" : "he"; }

  var CSS = [
    ".a11y-btn{position:fixed;z-index:70;inset-inline-end:20px;inset-block-end:20px;inline-size:54px;block-size:54px;border-radius:50%;border:2px solid #fff;cursor:pointer;display:grid;place-items:center;background:#0E1C30;color:#fff;box-shadow:0 12px 28px -10px rgba(14,28,48,.6);transition:transform .15s ease-out}",
    ".a11y-btn:hover{transform:scale(1.06)}",
    ".a11y-btn svg{inline-size:30px;block-size:30px}",
    ".a11y-btn:focus-visible{outline:3px solid #0E1C30;outline-offset:3px;border-radius:50%}",
    "@media (max-width:1060px){.a11y-btn{inset-inline-end:0;inset-block-end:auto;inset-block-start:42%;inline-size:46px;block-size:48px;border-inline-end:0;border-radius:14px 0 0 14px}[dir=rtl] .a11y-btn{border-radius:0 14px 14px 0}.a11y-btn:focus-visible{border-radius:14px}.a11y-btn svg{inline-size:26px;block-size:26px}}",
    "dialog.a11y-panel{position:fixed;inset:auto;inset-inline-end:20px;inset-block-end:86px;margin:0;inline-size:min(340px,calc(100vw - 24px));max-block-size:calc(100dvh - 110px);overflow:auto;padding:18px;border:1px solid #0E1C30;border-radius:22px;background:#fff;color:#0E1C30;font-family:Heebo,system-ui,sans-serif;font-size:16px;line-height:1.4;box-shadow:0 30px 60px -20px rgba(14,28,48,.45)}",
    "dialog.a11y-panel::backdrop{background:rgba(14,28,48,.18)}",
    "@media (max-width:1060px){dialog.a11y-panel{inset:0;margin:auto;block-size:fit-content}}",
    ".a11y-head{display:flex;align-items:center;justify-content:space-between;gap:12px}",
    ".a11y-head h2{font-size:20px;font-weight:800;margin:0;line-height:1.2}",
    ".a11y-x{inline-size:44px;block-size:44px;border-radius:50%;border:1px solid #0E1C30;background:#fff;color:#0E1C30;cursor:pointer;font-size:22px;line-height:1}",
    ".a11y-size{margin-block-start:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #C9CFD8;border-radius:14px;padding-block:6px;padding-inline:14px 6px}",
    ".a11y-size .ctl{display:flex;align-items:center;gap:8px}",
    ".a11y-size button{inline-size:44px;block-size:44px;border-radius:50%;border:1px solid #0E1C30;background:#fff;color:#0E1C30;cursor:pointer;font-size:22px;font-weight:700;line-height:1}",
    ".a11y-size button:disabled{opacity:.4;cursor:default}",
    ".a11y-size output{min-inline-size:54px;text-align:center;font-weight:700;direction:ltr}",
    ".a11y-opts{margin-block-start:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".a11y-opts button{min-block-size:52px;padding:8px 10px;border-radius:14px;border:1px solid #C9CFD8;background:#fff;color:#0E1C30;cursor:pointer;font:inherit;font-weight:600;text-align:center}",
    ".a11y-opts button[aria-pressed=true]{background:#0E1C30;color:#fff;border-color:#0E1C30}",
    ".a11y-opts button:last-child:nth-child(odd){grid-column:1/-1}",
    ".a11y-foot{margin-block-start:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}",
    ".a11y-foot button{min-block-size:44px;padding:8px 18px;border-radius:999px;border:1px solid #0E1C30;background:#fff;color:#0E1C30;cursor:pointer;font:inherit;font-weight:600}",
    ".a11y-foot a{color:#0E1C30;font-weight:600;padding:10px 2px}",
    ".a11y-note{margin-block-start:8px;font-size:14px;color:#4A5668}",
    ".a11y-panel button:focus-visible,.a11y-panel a:focus-visible{outline:3px solid #0E1C30;outline-offset:2px}",
    /* text size: the page content grows, the fixed bars stay put */
    "html.a11y-zoomed main,html.a11y-zoomed footer{zoom:var(--a11y-zoom,1)}",
    "@media (max-width:520px){html.a11y-zoomed main,html.a11y-zoomed footer{zoom:min(var(--a11y-zoom,1),1.3)}}",
    /* underlined links */
    "html.a11y-links a{text-decoration:underline!important;text-underline-offset:3px;text-decoration-thickness:2px}",
    /* readable font */
    "html.a11y-font body,html.a11y-font body *{font-family:Arial,'Arial Hebrew',Helvetica,sans-serif!important;letter-spacing:0!important}",
    "html.a11y-font body{line-height:1.8}",
    /* greyscale: on each bar and on the content, never on <body>, which would move the fixed bars */
    "html.a11y-gray main,html.a11y-gray footer,html.a11y-gray .nav-shell,html.a11y-gray header.top,html.a11y-gray .tabbar,html.a11y-gray .storage-note{filter:grayscale(1)}",
    /* stop animations */
    "html.a11y-still *,html.a11y-still *::before,html.a11y-still *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}",
    "html.a11y-still .reveal{opacity:1!important;transform:none!important}",
    /* high contrast: dark ink on white, white on navy, solid surfaces, visible borders */
    "html.a11y-contrast{--body:#0E1C30;--muted:#0E1C30;--subtle:#0E1C30;--sand-ink:#0E1C30;--line:#0E1C30;--mist:#fff;--glass-bg:#fff;--glass-strong:#fff;--glass-line:#0E1C30}",
    "html.a11y-contrast .glass,html.a11y-contrast .drawer-panel,html.a11y-contrast .storage-note,html.a11y-contrast header.top{background:#fff!important;border-color:#0E1C30;-webkit-backdrop-filter:none;backdrop-filter:none}",
    "html.a11y-contrast .glass-dark{background:#0E1C30;border-color:#fff;-webkit-backdrop-filter:none;backdrop-filter:none}",
    "html.a11y-contrast .aurora{background:#0E1C30}",
    "html.a11y-contrast .aurora::before,html.a11y-contrast .aurora::after{display:none}",
    "html.a11y-contrast .mesh{background:#fff}",
    "html.a11y-contrast .aurora p,html.a11y-contrast .aurora li,html.a11y-contrast .on-dark p,html.a11y-contrast .on-dark li{color:#fff}",
    "html.a11y-contrast .free-tag{color:#0E1C30}",
    "html.a11y-contrast .stage .shot p,html.a11y-contrast .stage .shot li,html.a11y-contrast .stage .shot span,html.a11y-contrast .stage .shot small,html.a11y-contrast .stage .shot time{color:#0E1C30}",
    "html.a11y-contrast .hero h1 .h1-main span{color:#0E1C30}",
    "html.a11y-contrast .btn-ghost,html.a11y-contrast .icon-btn,html.a11y-contrast details,html.a11y-contrast .tile,html.a11y-contrast .step,html.a11y-contrast .sector-row li{border:1px solid #0E1C30}",
    "html.a11y-contrast a:not(.btn):not(.nav-logo){text-decoration:underline}"
  ].join("\n");

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html) n.innerHTML = html;
    return n;
  }

  function build() {
    var style = el("style"); style.textContent = CSS; document.head.appendChild(style);

    var btn = el("button", { type: "button", "class": "a11y-btn", id: "a11yBtn", "aria-haspopup": "dialog", "aria-expanded": "false", "aria-controls": "a11yPanel" },
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.4" r="1.9" fill="currentColor" stroke="none"/><path d="M4.8 8.3c2.3.8 4.7 1.1 7.2 1.1s4.9-.3 7.2-1.1M12 9.4v5.2M12 14.6l-3.1 6M12 14.6l3.1 6"/></svg>');
    var panel = el("dialog", { "class": "a11y-panel", id: "a11yPanel", "aria-labelledby": "a11yTitle" },
      '<div class="a11y-head"><h2 id="a11yTitle"></h2><button type="button" class="a11y-x" data-a="close" autofocus>×</button></div>' +
      '<div class="a11y-size"><span data-t="size"></span><span class="ctl"><button type="button" data-a="smaller">−</button><output></output><button type="button" data-a="bigger">+</button></span></div>' +
      '<div class="a11y-opts">' + OPTS.map(function (k) { return '<button type="button" data-opt="' + k + '" aria-pressed="false"></button>'; }).join("") + "</div>" +
      '<div class="a11y-foot"><button type="button" data-a="reset"></button><a href="/accessibility" data-t="statement"></a></div>' +
      '<p class="a11y-note" data-t="note"></p>');

    // Right after the skip link, so a keyboard user reaches it second, not last.
    var skip = document.querySelector(".skip");
    if (skip) skip.insertAdjacentElement("afterend", btn); else document.body.insertBefore(btn, document.body.firstChild);
    document.body.appendChild(panel);

    function render() {
      var t = T[lang()];
      panel.setAttribute("dir", lang() === "en" ? "ltr" : "rtl");
      btn.setAttribute("aria-label", t.open);
      panel.querySelector("#a11yTitle").textContent = t.title;
      panel.querySelector('[data-a="close"]').setAttribute("aria-label", t.close);
      panel.querySelector('[data-a="smaller"]').setAttribute("aria-label", t.smaller);
      panel.querySelector('[data-a="bigger"]').setAttribute("aria-label", t.bigger);
      panel.querySelector('[data-a="reset"]').textContent = t.reset;
      panel.querySelectorAll("[data-t]").forEach(function (n) { n.textContent = t[n.getAttribute("data-t")]; });
      panel.querySelectorAll("[data-opt]").forEach(function (b) {
        var k = b.getAttribute("data-opt");
        b.textContent = t[k];
        b.setAttribute("aria-pressed", state[k] ? "true" : "false");
      });
      panel.querySelector("output").textContent = Math.round(ZOOMS[state.z] * 100) + "%";
      panel.querySelector('[data-a="smaller"]').disabled = state.z === 0;
      panel.querySelector('[data-a="bigger"]').disabled = state.z === ZOOMS.length - 1;
    }
    function change() { apply(); save(); render(); }

    btn.addEventListener("click", function () {
      render();
      if (typeof panel.showModal === "function") { panel.showModal(); btn.setAttribute("aria-expanded", "true"); }
      else { location.href = "/accessibility"; }
    });
    panel.addEventListener("close", function () { btn.setAttribute("aria-expanded", "false"); btn.focus(); });
    panel.addEventListener("click", function (e) {
      if (e.target === panel) { panel.close(); return; }
      var b = e.target.closest ? e.target.closest("button") : null;
      if (!b) return;
      var a = b.getAttribute("data-a"), k = b.getAttribute("data-opt");
      if (a === "close") panel.close();
      else if (a === "smaller" && state.z > 0) { state.z--; change(); }
      else if (a === "bigger" && state.z < ZOOMS.length - 1) { state.z++; change(); }
      else if (a === "reset") { state.z = 0; OPTS.forEach(function (o) { state[o] = false; }); change(); }
      else if (k) { state[k] = !state[k]; change(); }
    });
    // The page switches language by changing <html lang>; follow it.
    if ("MutationObserver" in window) {
      new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ["lang"] });
    }
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
