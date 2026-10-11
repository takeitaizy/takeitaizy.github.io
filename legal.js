/* Language toggle for the legal pages. Same storage key and behaviour as index.html. */
(function () {
  var current = "he";
  var toggle = document.getElementById("langToggle");
  function setLang(lang) {
    current = lang;
    document.querySelectorAll("[data-doc]").forEach(function (el) { el.hidden = el.getAttribute("data-doc") !== lang; });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    document.title = document.body.getAttribute(lang === "en" ? "data-title-en" : "data-title-he");
    toggle.textContent = lang === "en" ? "עב" : "EN";
    toggle.setAttribute("aria-label", lang === "en" ? "מעבר לעברית" : "Switch language");
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (!el.hasAttribute("data-he")) el.setAttribute("data-he", el.textContent);
      el.textContent = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-he");
    });
    try { localStorage.setItem("taizy-lang", lang); } catch (e) {}
  }
  toggle.addEventListener("click", function () { setLang(current === "he" ? "en" : "he"); });
  try { if (localStorage.getItem("taizy-lang") === "en") setLang("en"); } catch (e) {}
})();
