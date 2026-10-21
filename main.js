// Tabletop landing page: six languages (English in the HTML, the rest from i18n.js), the App Store link, and the
// two things that move (the screenshot gallery and the iPhone Duo video), each with a Pause the visitor controls.
(function () {
  // The App Store listing (Tabletop Interpreter, id6821405972). The buttons carry it in the HTML too, so they
  // work before this script runs.
  var STORE_URL = "https://apps.apple.com/app/tabletop-interpreter/id6821405972";
  var LANGS = ["en", "vi", "ja", "ko", "zh-Hans", "zh-Hant"];

  var dict = window.TABLETOP_I18N || {};
  // English for the words this script writes itself (the rest is read from the page).
  var en = { "motion.pause": "Pause", "motion.play": "Play",
             "motion.gallery.play": "Play the screenshots", "motion.video.play": "Play the video" };
  var nodes = {
    text: document.querySelectorAll("[data-i18n]"),
    html: document.querySelectorAll("[data-i18n-html]"),
    alt: document.querySelectorAll("[data-i18n-alt]"),
    lang: document.querySelectorAll("[data-i18n-lang]"),
    aria: document.querySelectorAll("[data-i18n-aria]")
  };
  var metaDesc = document.querySelector('meta[name="description"]');
  var canonical = document.querySelector('link[rel="canonical"]');
  var select = document.querySelector(".js-lang");
  var current = "en";

  // Read the English copy from the page so switching back needs no second dictionary.
  nodes.text.forEach(function (el) { en[el.dataset.i18n] = el.textContent; });
  nodes.html.forEach(function (el) { en[el.dataset.i18nHtml] = el.innerHTML; });
  nodes.alt.forEach(function (el) { en[el.dataset.i18nAlt] = el.alt; });
  nodes.lang.forEach(function (el) { en[el.dataset.i18nLang] = el.lang; });
  nodes.aria.forEach(function (el) { en[el.dataset.i18nAria] = el.getAttribute("aria-label"); });
  en["meta.title"] = document.title;
  en["meta.description"] = metaDesc ? metaDesc.content : "";

  function t(key) {
    var table = current === "en" ? en : dict[current] || {};
    return table[key] != null ? table[key] : en[key];
  }
  window.TABLETOP_T = t;

  function apply(lang) {
    current = LANGS.indexOf(lang) >= 0 && (lang === "en" || dict[lang]) ? lang : "en";
    document.documentElement.lang = current;
    nodes.text.forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    nodes.html.forEach(function (el) { el.innerHTML = t(el.dataset.i18nHtml); });
    nodes.alt.forEach(function (el) { el.alt = t(el.dataset.i18nAlt); });
    nodes.lang.forEach(function (el) { el.lang = t(el.dataset.i18nLang); });
    nodes.aria.forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.title = t("meta.title");
    if (metaDesc) metaDesc.content = t("meta.description");
    if (canonical) canonical.href = "https://trytabletop.app/" + (current === "en" ? "" : "?lang=" + current);

    // The hero and the screenshots are the app itself in this language, with its own language pair.
    document.querySelectorAll(".js-hero").forEach(function (img) {
      var src = "assets/hero/" + current + ".webp";
      if (img.getAttribute("src") !== src) img.src = src;
    });
    // Apple's own badge, in the page's language.
    document.querySelectorAll(".js-badge").forEach(function (img) { img.src = "assets/badges/" + current + ".svg"; });
    document.querySelectorAll(".js-shot").forEach(function (img) {
      img.src = "assets/shots/" + current + "-" + img.dataset.shot + ".webp";
    });
    // The support, privacy and terms pages show one language at a time, chosen by its anchor (#en, #vi, #ja…).
    document.querySelectorAll(".js-privacy, .js-support, .js-terms").forEach(function (a) {
      a.href = a.href.split("#")[0] + "#" + current;
    });
    if (select) select.value = current;
    document.dispatchEvent(new CustomEvent("tabletop:lang"));
    try { localStorage.setItem("tabletop.lang", current); } catch (e) {}
  }

  function fromTag(tag) {
    var c = (tag || "").toLowerCase();
    if (c.indexOf("zh") === 0) return /hant|tw|hk|mo/.test(c) ? "zh-Hant" : "zh-Hans";
    var base = c.split("-")[0];
    return LANGS.indexOf(base) >= 0 ? base : null;
  }

  function initialLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) >= 0) return q;
    // The support, privacy and terms pages link home with their language as the anchor (index.html#vi).
    var h = location.hash.slice(1);
    if (LANGS.indexOf(h) >= 0) return h;
    try {
      var saved = localStorage.getItem("tabletop.lang");
      if (LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    var wanted = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < wanted.length; i++) {
      var found = fromTag(wanted[i]);
      if (found) return found;
    }
    return "en";
  }

  if (select) {
    select.addEventListener("change", function () {
      apply(select.value);
      var url = new URL(location.href);
      url.searchParams.set("lang", current);
      url.hash = "";
      try { history.replaceState(null, "", url); } catch (e) {}
    });
  }

  document.querySelectorAll(".js-store").forEach(function (a) {
    a.href = STORE_URL;
    a.rel = "noopener";
  });

  apply(initialLang());
})();

// A Pause button's words follow its state, in the page's language: "Pause" or "Play" on the button, and what it
// pauses for a screen reader ("Pause the video"). The words carry the state, so there is no pressed state as well.
function tabletopLabelPause(button, paused, what) {
  var span = button.querySelector("span");
  span.dataset.i18n = paused ? "motion.play" : "motion.pause";
  span.textContent = window.TABLETOP_T(span.dataset.i18n);
  button.dataset.i18nAria = "motion." + what + (paused ? ".play" : ".pause");
  button.setAttribute("aria-label", window.TABLETOP_T(button.dataset.i18nAria));
}

// The screenshot gallery moves on by itself: one screenshot every 3.5 s, back to the first after the last.
// Pause stops it for good; Previous and Next step by hand. It also waits while someone points at, touches, scrolls
// or tabs into it (and for 15 s after), runs only while it is on screen and the tab is visible, and never under
// Reduce Motion (where Pause, with nothing to stop, is hidden).
(function () {
  var gallery = document.querySelector(".gallery");
  if (!gallery || !window.matchMedia) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var pauseButton = document.querySelector(".js-gallery-pause");
  var onScreen = false, pointerInside = false, holdUntil = 0, paused = false;

  // After a touch it waits long enough to read a screenshot, not to have it moved from under the thumb.
  function hold() { holdUntil = Date.now() + 15000; }
  gallery.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") pointerInside = true; });
  gallery.addEventListener("pointerleave", function () { pointerInside = false; hold(); });
  ["pointerdown", "touchstart", "wheel", "keydown", "focusin"].forEach(function (type) {
    gallery.addEventListener(type, hold, { passive: true });
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
    }, { threshold: 0.4 }).observe(gallery);
  } else {
    onScreen = true;
  }

  function stepBy(direction) {
    var shot = gallery.querySelector("img");
    var end = gallery.scrollWidth - gallery.clientWidth;
    if (!shot || end <= 2) return;
    var smooth = reduce.matches ? "auto" : "smooth";
    var gap = parseFloat(getComputedStyle(gallery).columnGap) || 20;
    var width = shot.getBoundingClientRect().width + gap;
    if (direction > 0 && gallery.scrollLeft >= end - 4) {
      gallery.scrollTo({ left: 0, behavior: smooth });
    } else if (direction < 0 && gallery.scrollLeft <= 4) {
      gallery.scrollTo({ left: end, behavior: smooth });
    } else {
      gallery.scrollBy({ left: direction * width, behavior: smooth });
    }
  }

  var prev = document.querySelector(".js-prev"), next = document.querySelector(".js-next");
  if (prev) prev.addEventListener("click", function () { hold(); stepBy(-1); });
  if (next) next.addEventListener("click", function () { hold(); stepBy(1); });

  function showPause() { if (pauseButton) pauseButton.hidden = reduce.matches; }
  showPause();
  if (reduce.addEventListener) reduce.addEventListener("change", showPause);
  if (pauseButton) {
    pauseButton.addEventListener("click", function () {
      paused = !paused;
      tabletopLabelPause(pauseButton, paused, "gallery");
    });
    document.addEventListener("tabletop:lang", function () { tabletopLabelPause(pauseButton, paused, "gallery"); });
  }

  // Where you are: "3 / 7", beside the controls.
  var count = document.querySelector(".js-count");
  var shots = gallery.querySelectorAll("img").length;
  function showCount() {
    if (!count) return;
    var shot = gallery.querySelector("img");
    var gap = parseFloat(getComputedStyle(gallery).columnGap) || 20;
    var at = shot ? Math.round(gallery.scrollLeft / (shot.getBoundingClientRect().width + gap)) + 1 : 1;
    if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 4) at = shots;
    count.textContent = Math.min(Math.max(at, 1), shots) + " / " + shots;
  }
  gallery.addEventListener("scroll", function () { window.requestAnimationFrame(showCount); }, { passive: true });
  showCount();

  setInterval(function () {
    if (paused || reduce.matches || !onScreen || pointerInside || document.hidden || Date.now() < holdUntil) return;
    stepBy(1);
  }, 3500);
})();

// The iPhone Duo video: nothing is downloaded until it comes on screen; it plays while on screen, stops when it
// leaves, and Pause stops it for good. Under Reduce Motion the still shows instead and Pause is hidden.
(function () {
  var video = document.querySelector(".js-duo-video");
  var button = document.querySelector(".js-video-pause");
  if (!video || !window.matchMedia) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var paused = false, onScreen = false;

  function update() {
    if (button) button.hidden = reduce.matches;
    if (!paused && onScreen && !reduce.matches) {
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () {});
    } else {
      video.pause();
    }
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      update();
    }, { threshold: 0.3 }).observe(video);
  } else {
    onScreen = true;
  }
  if (reduce.addEventListener) reduce.addEventListener("change", update);
  if (button) {
    button.addEventListener("click", function () {
      paused = !paused;
      tabletopLabelPause(button, paused, "video");
      update();
    });
    document.addEventListener("tabletop:lang", function () { tabletopLabelPause(button, paused, "video"); });
  }
  update();
})();
