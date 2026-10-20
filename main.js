// Tabletop landing page: language switch (EN in the HTML, VI from i18n.js) and the App Store link.
(function () {
  // The App Store listing (Tabletop Interpreter, id6821405972). The buttons carry it in the HTML too, so they
  // work before this script runs.
  var STORE_URL = "https://apps.apple.com/app/tabletop-interpreter/id6821405972";

  var dict = window.TABLETOP_I18N || {};
  var en = {};
  var nodes = {
    text: document.querySelectorAll("[data-i18n]"),
    html: document.querySelectorAll("[data-i18n-html]"),
    alt: document.querySelectorAll("[data-i18n-alt]"),
    lang: document.querySelectorAll("[data-i18n-lang]")
  };
  var metaDesc = document.querySelector('meta[name="description"]');

  // Read the English copy from the page so switching back needs no second dictionary.
  nodes.text.forEach(function (el) { en[el.dataset.i18n] = el.textContent; });
  nodes.html.forEach(function (el) { en[el.dataset.i18nHtml] = el.innerHTML; });
  nodes.alt.forEach(function (el) { en[el.dataset.i18nAlt] = el.alt; });
  nodes.lang.forEach(function (el) { en[el.dataset.i18nLang] = el.lang; });
  en["meta.title"] = document.title;
  en["meta.description"] = metaDesc ? metaDesc.content : "";

  function t(lang, key) {
    var table = lang === "en" ? en : dict[lang] || {};
    return table[key] != null ? table[key] : en[key];
  }

  function apply(lang) {
    if (lang !== "en" && !dict[lang]) lang = "en";
    document.documentElement.lang = lang;
    nodes.text.forEach(function (el) { el.textContent = t(lang, el.dataset.i18n); });
    nodes.html.forEach(function (el) { el.innerHTML = t(lang, el.dataset.i18nHtml); });
    nodes.alt.forEach(function (el) { el.alt = t(lang, el.dataset.i18nAlt); });
    nodes.lang.forEach(function (el) { el.lang = t(lang, el.dataset.i18nLang); });
    document.title = t(lang, "meta.title");
    if (metaDesc) metaDesc.content = t(lang, "meta.description");

    // Screenshots exist in English and Vietnamese.
    document.querySelectorAll(".js-shot").forEach(function (img) {
      img.src = "assets/shots/" + (lang === "vi" ? "vi" : "en") + "-" + img.dataset.shot + ".webp";
    });
    // The support, privacy and terms pages show one language at a time, chosen by its anchor (#en, #vi).
    document.querySelectorAll(".js-privacy, .js-support, .js-terms").forEach(function (a) {
      a.href = a.href.split("#")[0] + (lang === "vi" ? "#vi" : "#en");
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem("tabletop.lang", lang); } catch (e) {}
  }

  function initialLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q) return q;
    // The support, privacy and terms pages link home with their language as the anchor (index.html#vi).
    var h = location.hash.slice(1);
    if (h === "vi" || h === "en") return h;
    try {
      var saved = localStorage.getItem("tabletop.lang");
      if (saved) return saved;
    } catch (e) {}
    return (navigator.language || "en").toLowerCase().indexOf("vi") === 0 ? "vi" : "en";
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      apply(b.dataset.lang);
      var url = new URL(location.href);
      url.searchParams.set("lang", b.dataset.lang);
      try { history.replaceState(null, "", url); } catch (e) {}
    });
  });

  document.querySelectorAll(".js-store").forEach(function (a) {
    a.href = STORE_URL;
    a.rel = "noopener";
  });

  apply(initialLang());
})();
