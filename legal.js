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

/* "Delete my choice" on the privacy page: forget the consent choice and remove
   the cookies the ad tools set, the same as "no" in the site's banner.
   Keep the key and the cookie names in step with site.js. */
(function () {
  document.querySelectorAll("[data-consent-reset]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      try { localStorage.removeItem("taizy-ads-consent"); } catch (e) {}
      document.cookie.split(";").forEach(function (c) {
        var name = c.split("=")[0].trim();
        if (!/^(_gcl_|_fbp$|_fbc$)/.test(name)) return;
        var host = location.hostname, parts = host.split(".");
        ["", host, "." + parts.slice(-2).join(".")].forEach(function (d) {
          document.cookie = name + "=; Max-Age=0; path=/" + (d ? "; domain=" + d : "");
        });
      });
      var done = btn.parentElement.querySelector(".consent-done");
      if (done) done.hidden = false;
    });
  });
})();
