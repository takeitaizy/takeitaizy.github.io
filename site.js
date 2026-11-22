/* takeitaizy.dev: the behaviour shared by every page.
   Each block checks that its part of the page is there, so one script serves
   the home page, the projects page and the workshops page alike. */

/* Old links to the workshops section of the home page now open the workshops page. */
if (location.pathname === "/" && location.hash === "#workshops") location.replace("/workshops");

/* The intake form's origin (Studio OS). Used by the language switch and the form bridge below. */
var INTAKE_ORIGIN = "https://os.takeitaizy.dev";

/* ---------------- language: Hebrew in the markup, English in data-en* ----------------
   Every page carries its English title on <title data-en> and its English
   description on <meta name="description" data-en-content>. */
var currentLang = "he";
var heText = new WeakMap();

function swap(attr, apply) {
  document.querySelectorAll("[" + attr + "]").forEach(function (el) {
    var cache = heText.get(el) || {};
    if (!(attr in cache)) { cache[attr] = apply(el, null); heText.set(el, cache); }
    var value = currentLang === "en" ? el.getAttribute(attr) : cache[attr];
    apply(el, value);
  });
}

function setLang(lang) {
  currentLang = lang;
  swap("data-en", function (el, v) { if (v === null) return el.textContent; el.textContent = v; });
  swap("data-en-html", function (el, v) { if (v === null) return el.innerHTML; el.innerHTML = v; });
  swap("data-en-title", function (el, v) { if (v === null) return el.getAttribute("title"); el.setAttribute("title", v); });
  swap("data-en-label", function (el, v) { if (v === null) return el.getAttribute("aria-label"); el.setAttribute("aria-label", v); });
  swap("data-en-href", function (el, v) { if (v === null) return el.getAttribute("href"); el.setAttribute("href", v); });
  swap("data-en-alt", function (el, v) { if (v === null) return el.getAttribute("alt"); el.setAttribute("alt", v); });
  swap("data-en-content", function (el, v) { if (v === null) return el.getAttribute("content"); el.setAttribute("content", v); });
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  document.getElementById("langToggle").textContent = lang === "en" ? "עב" : "EN";
  document.getElementById("langToggle").setAttribute("aria-label", lang === "en" ? "מעבר לעברית" : "Switch language");
  syncIntakeFrame(lang);
  if (typeof calc !== "undefined" && calc) renderCalc();
  if (typeof refreshRails === "function") refreshRails(true);
  try { localStorage.setItem("taizy-lang", lang); } catch (e) {}
}

/* Motion is off when the system asks for it or when the visitor stopped it in the accessibility menu. */
function motionOff() {
  return document.documentElement.classList.contains("a11y-still") ||
    (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

document.getElementById("langToggle").addEventListener("click", function () {
  var next = currentLang === "he" ? "en" : "he";
  // A cross-fade between the two languages where the browser has view transitions.
  if (document.startViewTransition && !motionOff()) document.startViewTransition(function () { setLang(next); });
  else setLang(next);
});
try { if (localStorage.getItem("taizy-lang") === "en") setLang("en"); } catch (e) {}

/* ---------------- side menu ----------------
   A modal <dialog>: the browser keeps focus inside it and closes it on Escape.
   A click on the dimmed area or on any link closes it too (a link to a section
   of the same page would otherwise leave it open). */
var menu = document.getElementById("menu");
var menuOpen = document.getElementById("menuOpen");
function closeMenu() { if (menu.open) menu.close(); }
var menuOpener = null;
function openMenu(btn) {
  menuOpener = btn;
  if (typeof menu.showModal === "function") { menu.showModal(); btn.setAttribute("aria-expanded", "true"); }
  else { location.href = "/work"; }
}
menuOpen.addEventListener("click", function () { openMenu(menuOpen); });
document.getElementById("tabMenu").addEventListener("click", function () { openMenu(this); });
menu.addEventListener("close", function () {
  if (menuOpener) { menuOpener.setAttribute("aria-expanded", "false"); menuOpener.focus(); }
});
document.getElementById("menuClose").addEventListener("click", closeMenu);
menu.addEventListener("click", function (e) {
  if (e.target === menu) closeMenu();
  if (e.target.closest && e.target.closest("a")) closeMenu();
});

/* ---------------- reveal on scroll ---------------- */
var STAGGER = ".faq-list";
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, parent = el.parentElement;
      // Cards of one row arrive one after another, not all at once.
      if (parent && parent.matches(STAGGER) && !motionOff()) {
        var delay = (Array.prototype.indexOf.call(parent.children, el) % 4) * 90;
        el.style.transitionDelay = delay + "ms";
        setTimeout(function () { el.style.transitionDelay = ""; }, delay + 900);
      }
      el.classList.add("in");
      if (el.classList.contains("rail")) setTimeout(function () { el.classList.add("settled"); }, 1300);
      io.unobserve(el);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
} else {
  document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
}

/* ---------------- time calculator (home page) ---------------- */
var calc = document.getElementById("calc") ? { people: 3, hours: 2, rate: 80 } : null;
var limits = { people: [1, 50], hours: [1, 8], rate: [30, 400] };
function fmt(n) { return n.toLocaleString("en-US"); }
function renderCalc() {
  var yearHours = calc.people * calc.hours * 22 * 12;
  document.getElementById("vPeople").textContent = calc.people;
  document.getElementById("vHours").textContent = calc.hours;
  document.getElementById("vRate").textContent = calc.rate;
  document.getElementById("oHours").textContent = fmt(yearHours);
  var cost = "₪" + fmt(yearHours * calc.rate);
  document.getElementById("oCost").textContent = cost;
  var cta = document.getElementById("calcCta");
  cta.textContent = currentLang === "en" ? "Let’s check your " + cost : "בואו נבדוק את ה-" + cost + " שלכם";
  cta.setAttribute("dir", "auto");
}
/* The visitor's estimate goes to the form with them, so the needs call
   starts from their number. Only after they choose to follow it. */
var calcSent = null;
if (calc) {
  document.getElementById("calcCta").addEventListener("click", function () {
    calcSent = { calc_people: calc.people, calc_hours: calc.hours, calc_rate: calc.rate,
                 calc_year_ils: calc.people * calc.hours * 22 * 12 * calc.rate };
    syncIntakeFrame(currentLang);
  });
  document.querySelectorAll("[data-calc]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-calc"), d = Number(b.getAttribute("data-d"));
      calc[k] = Math.max(limits[k][0], Math.min(limits[k][1], calc[k] + d));
      renderCalc();
      ["oHours", "oCost"].forEach(function (id) {
        var el = document.getElementById(id);
        el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
      });
    });
  });
  renderCalc();
}

/* ---------------- bottom tab bar (phone and tablet) ----------------
   A tab for another page carries aria-current="page" from the build. A tab for
   a section of this page is marked aria-current="true" while that section is on screen. */
var sectionTabs = Array.prototype.filter.call(document.querySelectorAll(".tabbar a[href*='#']"), function (t) {
  var url = new URL(t.href, location.href);
  return url.pathname === location.pathname && url.hash.length > 1 && document.getElementById(url.hash.slice(1));
});
if ("IntersectionObserver" in window && sectionTabs.length) {
  var tabIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      sectionTabs.forEach(function (t) {
        if (new URL(t.href, location.href).hash.slice(1) !== e.target.id) return;
        if (e.isIntersecting) t.setAttribute("aria-current", "true");
        else t.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sectionTabs.forEach(function (t) { tabIo.observe(document.getElementById(new URL(t.href, location.href).hash.slice(1))); });
}

/* ---------------- rails (horizontal carousels) ----------------
   Arrows move one card; the bar shows where you are. The arrows and the bar
   show only when the cards don't fit. In RTL the scroll position runs
   negative, so the direction is read from the track each time.
   A rail also moves on its own, one card every few seconds, and goes back to
   the first card at the end. It waits while the pointer or keyboard focus is
   on it, for a few seconds after the visitor scrolls it, while it is off
   screen, and always when motion is off. Its pause button stops it for good. */
var RAIL_EVERY = 4200, RAIL_REST = 7000;
var railUpdates = [];
function refreshRails(reset) { (railUpdates || []).forEach(function (f) { f(reset); }); }
document.querySelectorAll("[data-rail]").forEach(function (rail) {
  var track = rail.querySelector(".rail-track"), nav = rail.querySelector(".rail-nav");
  var prev = rail.querySelector(".rail-prev"), next = rail.querySelector(".rail-next"), bar = rail.querySelector(".rail-bar i");
  function rtl() { return getComputedStyle(track).direction === "rtl"; }
  function step() {
    var first = track.firstElementChild;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
  }
  function update() {
    var max = track.scrollWidth - track.clientWidth;
    var overflow = max > 4;
    var pos = Math.min(max, Math.abs(track.scrollLeft));
    nav.hidden = !overflow;
    if (overflow) track.setAttribute("tabindex", "0"); else track.removeAttribute("tabindex");
    prev.disabled = !overflow || pos < 4;
    next.disabled = !overflow || pos > max - 4;
    var shown = track.clientWidth / track.scrollWidth;
    if (bar) bar.style.transform = "scaleX(" + (overflow ? shown + (1 - shown) * (pos / max) : 1).toFixed(3) + ")";
  }
  function go(d) {
    track.scrollBy({ left: d * (rtl() ? -1 : 1) * step(), behavior: motionOff() ? "auto" : "smooth" });
  }
  var auto = rail.querySelector(".rail-auto");
  var hover = false, focused = false, onScreen = false, lastUser = 0;
  prev.addEventListener("click", function () { lastUser = Date.now(); go(-1); });
  next.addEventListener("click", function () { lastUser = Date.now(); go(1); });
  auto.addEventListener("click", function () {
    auto.setAttribute("aria-pressed", auto.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });
  rail.addEventListener("mouseenter", function () { hover = true; });
  rail.addEventListener("mouseleave", function () { hover = false; });
  rail.addEventListener("focusin", function () { focused = true; });
  rail.addEventListener("focusout", function (e) { focused = rail.contains(e.relatedTarget); });
  ["pointerdown", "wheel", "touchstart", "keydown"].forEach(function (ev) {
    track.addEventListener(ev, function () { lastUser = Date.now(); }, { passive: true });
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }, { threshold: 0.35 }).observe(track);
  }
  setInterval(function () {
    if (motionOff() || document.hidden || !onScreen || hover || focused) return;
    if (auto.getAttribute("aria-pressed") === "true" || Date.now() - lastUser < RAIL_REST) return;
    var max = track.scrollWidth - track.clientWidth;
    if (max <= 4) return;
    if (Math.abs(track.scrollLeft) >= max - 4) track.scrollTo({ left: 0, behavior: "smooth" });
    else go(1);
  }, RAIL_EVERY);
  track.addEventListener("scroll", update, { passive: true });
  railUpdates.push(function (reset) { if (reset) track.scrollLeft = 0; update(); });
  update();
});
window.addEventListener("resize", function () { refreshRails(false); });

/* ---------------- demo clips (projects page) ----------------
   Silent illustrations with sample data. Each has one play/pause button
   (aria-pressed="true" while the clip is stopped, like the rails' pause button).
   A clip plays on its own only while it is on screen and motion is on; once
   the visitor stops it, it stays stopped. "Stop animations" stops them all. */
var clips = document.querySelectorAll("video[data-autoplay]");
if (clips.length) {
  var clipUserPaused = new WeakSet();
  var pauseClip = function (v) { if (!v.paused) v.pause(); };
  var playClip = function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
  clips.forEach(function (v) {
    var btn = v.parentElement.querySelector(".clip-btn");
    if (!btn) return;
    var sync = function () { btn.setAttribute("aria-pressed", v.paused ? "true" : "false"); };
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    btn.addEventListener("click", function () {
      if (v.paused) { clipUserPaused.delete(v); playClip(v); }
      else { clipUserPaused.add(v); pauseClip(v); }
    });
  });
  if ("IntersectionObserver" in window) {
    var clipIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !motionOff() && !clipUserPaused.has(v)) playClip(v);
        else if (!e.isIntersecting) pauseClip(v);
      });
    }, { threshold: 0.5 });
    clips.forEach(function (v) { clipIo.observe(v); });
  }
  new MutationObserver(function () { if (motionOff()) clips.forEach(pauseClip); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
}

/* ---------------- clients marquee: hover pauses it, the button stops it ---------------- */
var marquee = document.getElementById("marquee"), marqueeToggle = document.getElementById("marqueeToggle");
if (marquee && marqueeToggle) {
  marqueeToggle.addEventListener("click", function () {
    var paused = marquee.classList.toggle("paused");
    marqueeToggle.setAttribute("aria-pressed", paused ? "true" : "false");
  });
}

/* ---------------- FAQ: the rest of the questions ---------------- */
var faqMore = document.getElementById("faqMore");
if (faqMore) {
  faqMore.addEventListener("click", function () {
    var list = document.getElementById("faqList");
    list.classList.remove("collapsed");
    faqMore.setAttribute("aria-expanded", "true");
    faqMore.hidden = true;
    var first = list.querySelector(".faq-more summary");
    if (first) first.focus();
  });
}

/* ---------------- nav capsule ---------------- */
var navShell = document.querySelector(".nav-shell");
function onScroll() { navShell.classList.toggle("scrolled", window.scrollY > 24); }
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------------- storage notice ----------------
   The site sets no cookies. The notice says so once; closing it is remembered. */
var note = document.getElementById("storageNote");
var seen = false;
try { seen = localStorage.getItem("taizy-storage-ok") === "1"; } catch (e) {}
if (!seen) note.hidden = false;
document.getElementById("storageOk").addEventListener("click", function () {
  note.hidden = true;
  try { localStorage.setItem("taizy-storage-ok", "1"); } catch (e) {}
});

/* ---------------- intake form (os.takeitaizy.dev, Studio OS P34) ----------------
   The iframe src carries embed=1, the theme, the site's current language and
   the visitor's own utm_* tags (the fixed site tags only when there are none;
   utm_content then names the page the form sits on, from <body data-form>).
   The form posts {type: "takeitaizy:intake", event: "height"|"submitted"} to
   https://takeitaizy.dev only; anything else is ignored. */
function intakeSrc(lang) {
  var params = new URLSearchParams({ embed: "1", theme: "light", lang: lang === "en" ? "en" : "he" });
  var own = new URLSearchParams(location.search);
  var tagged = false;
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (key) {
    var value = own.get(key);
    if (value) { params.set(key, value); tagged = true; }
  });
  if (!tagged) {
    params.set("utm_source", "takeitaizy.dev");
    params.set("utm_medium", "website");
    params.set("utm_content", document.body.getAttribute("data-form") || "embed");
  }
  if (typeof calcSent !== "undefined" && calcSent) {
    Object.keys(calcSent).forEach(function (key) { params.set(key, String(calcSent[key])); });
  }
  return INTAKE_ORIGIN + "/intake?" + params.toString();
}

function syncIntakeFrame(lang) {
  var frame = document.getElementById("intakeFrame");
  if (!frame) return;
  var src = intakeSrc(lang);
  if (frame.src !== src) frame.src = src;
}
syncIntakeFrame(currentLang);

/* A conversion is reported only to a tag that is on the page; there is none today. */
function reportLead() {
  if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { form: "intake" });
  if (typeof window.fbq === "function") window.fbq("track", "Lead");
}

window.addEventListener("message", function (e) {
  if (e.origin !== INTAKE_ORIGIN || !e.data || e.data.type !== "takeitaizy:intake") return;
  var frame = document.getElementById("intakeFrame");
  if (!frame) return;
  if (e.data.event === "height") {
    var height = Number(e.data.height);
    if (height > 0 && height < 5000) frame.style.height = Math.ceil(height) + "px";
  } else if (e.data.event === "submitted") {
    reportLead();
    // The form shrinks to its thank-you message; keep that message in view.
    if (frame.getBoundingClientRect().top < 0) frame.scrollIntoView({ block: "start" });
  }
});
