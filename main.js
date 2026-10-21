// Tabletop landing page: six languages (English in the HTML, the rest from i18n.js), the App Store link, and the
// two things that move (the screenshot gallery and the iPhone Duo video), each with a Pause the visitor controls.
(function () {
  // The App Store listing (Tabletop Interpreter, id6821405972). The buttons carry it in the HTML too, so they
  // work before this script runs.
  var STORE_URL = "https://apps.apple.com/app/tabletop-interpreter/id6821405972";
  var LANGS = ["en", "vi", "ja", "ko", "zh-Hans", "zh-Hant"];
  // Each language is its own page (built by tools/build-locales.mjs), so search engines index every one.
  var PATHS = { en: "/", vi: "/vi/", ja: "/ja/", ko: "/ko/", "zh-Hans": "/zh-hans/", "zh-Hant": "/zh-hant/" };
  var pageLang = LANGS.indexOf(document.documentElement.lang) >= 0 ? document.documentElement.lang : "en";

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

    // The hero and the screenshots are the app itself in this language, with its own language pair.
    document.querySelectorAll(".js-hero").forEach(function (img) {
      var src = "/assets/hero/" + current + ".webp";
      if (img.getAttribute("src") !== src) img.src = src;
    });
    // Apple's own badge, in the page's language.
    document.querySelectorAll(".js-badge").forEach(function (img) { img.src = "/assets/badges/" + current + ".svg"; });
    document.querySelectorAll(".js-shot").forEach(function (img) {
      img.src = "/assets/shots/" + current + "-" + img.dataset.shot + ".webp";
    });
    // The support, privacy and terms pages show one language at a time, chosen by its anchor (#en, #vi, #ja…).
    document.querySelectorAll(".js-privacy, .js-support, .js-terms").forEach(function (a) {
      a.href = a.href.split("#")[0] + "#" + current;
    });
    if (select) select.value = current;
    document.dispatchEvent(new CustomEvent("tabletop:lang"));
  }

  function fromTag(tag) {
    var c = (tag || "").toLowerCase();
    if (c.indexOf("zh") === 0) return /hant|tw|hk|mo/.test(c) ? "zh-Hant" : "zh-Hans";
    var base = c.split("-")[0];
    return LANGS.indexOf(base) >= 0 ? base : null;
  }

  // The language the visitor asked for: an old ?lang= link, the anchor the support, privacy and terms pages
  // once linked home with (index.html#vi), and on the English home page only, a choice made in the menu, else the
  // browser's languages. Search engines crawl in English with nothing saved, so they stay on each page.
  function wantedLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) >= 0) return q;
    var h = location.hash.slice(1);
    if (LANGS.indexOf(h) >= 0) return h;
    // A language's own page is what was linked or searched for: it stays.
    if (pageLang !== "en") return pageLang;
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

  function go(lang) {
    var hash = LANGS.indexOf(location.hash.slice(1)) >= 0 ? "" : location.hash;
    location.replace(PATHS[lang] + hash);
  }

  if (select) {
    select.addEventListener("change", function () {
      try { localStorage.setItem("tabletop.lang", select.value); } catch (e) {}
      go(select.value);
    });
  }

  document.querySelectorAll(".js-store").forEach(function (a) {
    a.href = STORE_URL;
    a.rel = "noopener";
  });

  var lang = wantedLang();
  if (lang !== pageLang) { go(lang); return; }
  if (location.search || LANGS.indexOf(location.hash.slice(1)) >= 0) {
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
  }
  apply(pageLang);
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

// One conversation, scrolled: the device on the table receives the app's own taxi scene in the page language's pair.
// On load it delivers the first two lines (under five seconds, then it stops); each chapter, as it reaches the middle of
// the screen, takes the conversation to its step. Steps: 1-4 the four lines, 5 a line that could not be confirmed,
// 6 offline, 7 the conversation kept as a letter with its minutes. Under Reduce Motion lines arrive without typing.
// Without JavaScript the HTML shows the four lines delivered.
(function () {
  var device = document.querySelector(".js-device");
  if (!device || !window.matchMedia) return;
  document.documentElement.classList.add("js");
  // The table sticks flush under the header: its height measured, not assumed, so nothing shows between them.
  var header = document.querySelector(".top");
  function measureBar() { if (header) document.documentElement.style.setProperty("--bar", header.offsetHeight + "px"); }
  measureBar();
  window.addEventListener("resize", measureBar);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var L = {
    airport: { en: "Please take me to the airport.", vi: "Cho tôi đến sân bay.", ja: "空港までお願いします。", ko: "공항까지 가 주세요.", "zh-Hans": "请送我去机场。", "zh-Hant": "請送我去機場。" },
    highway: { en: "Shall I take the highway?", vi: "Mình đi đường cao tốc nhé?", ja: "高速道路を使いますか？", ko: "고속도로로 갈까요?", "zh-Hans": "要走高速吗？", "zh-Hant": "要走高速公路嗎？" },
    howLong: { en: "Yes, please. How long will it take?", vi: "Vâng, đi cao tốc. Mất bao lâu ạ?", ja: "はい、お願いします。どのくらいかかりますか？", ko: "네, 그렇게 해 주세요. 얼마나 걸려요?", "zh-Hans": "好的，麻烦了。要多长时间？", "zh-Hant": "好的，麻煩了。要多久？" },
    anHour: { en: "About an hour.", vi: "Khoảng một tiếng.", ja: "一時間ほどです。", ko: "한 시간 정도요.", "zh-Hans": "大约一个小时。", "zh-Hant": "大約一個小時。" },
    toll: { en: "Is there a toll?", vi: "Có mất phí cầu đường không?", ja: "有料道路ですか？", ko: "통행료가 있나요?", "zh-Hans": "要付过路费吗？", "zh-Hant": "要付過路費嗎？" },
    // The other person's cue, in their language, as their half shows it.
    cue: { en: "[Listening — speak any time]", vi: "[Đang nghe — xin mời nói]", ja: "［聞き取り中 — いつでもお話しください］", ko: "[듣고 있어요 — 언제든 말씀하세요]", "zh-Hans": "［正在收听 — 随时可以说］", "zh-Hant": "［聆聽中 — 隨時都可以說］" },
    wait: { en: "[One moment, please]", vi: "[Xin chờ một chút]", ja: "［少々お待ちください］", ko: "[잠시만 기다려 주세요]", "zh-Hans": "［请稍等］", "zh-Hant": "［請稍候］" }
  };
  // The owner's side, in the page's language (the app's own words), and the language they are talking with.
  var OWNER = {
    en: { cv: "Conversation", kk: "KEPT", kno: "No. 12", them: "vi", you: "YOU", lang: "VIETNAMESE", pair: "English ↔ Vietnamese", end: "End", pause: "Pause", listen: "[Listening]",
          off: "Offline · on this device", note: "Not translated. Please say it again.", lt: "No. 12 · To the airport", lh: "Minutes", nx: "Next",
          p1: "You asked to go to the airport.", p2: "They suggested the highway: about an hour.", p3: "→ Ask about the toll again." },
    vi: { cv: "Cuộc trò chuyện", kk: "ĐÃ LƯU", kno: "Số 12", them: "ja", you: "BẠN", lang: "TIẾNG NHẬT", pair: "Việt ↔ Nhật", end: "Kết thúc", pause: "Tạm dừng", listen: "[Đang nghe]",
          off: "Ngoại tuyến · ngay trên máy", note: "Chưa dịch được. Xin nói lại.", lt: "Số 12 · Ra sân bay", lh: "Biên bản", nx: "Kế tiếp",
          p1: "Bạn nhờ đưa đến sân bay.", p2: "Tài xế đề nghị đi cao tốc: khoảng một tiếng.", p3: "→ Hỏi lại về phí cầu đường." },
    ja: { cv: "会話", kk: "保存", kno: "No. 12", them: "en", you: "自分", lang: "英語", pair: "日本語 ↔ 英語", end: "終了", pause: "一時停止", listen: "［聞き取り中］",
          off: "オフライン · この端末で", note: "翻訳できませんでした。もう一度お話しください。", lt: "No. 12 · 空港まで", lh: "議事メモ", nx: "次",
          p1: "空港までお願いしました。", p2: "高速道路を提案されました。約1時間です。", p3: "→ 通行料についてもう一度聞く。" },
    ko: { cv: "대화", kk: "보관", kno: "No. 12", them: "ja", you: "나", lang: "일본어", pair: "한국어 ↔ 일본어", end: "종료", pause: "일시 정지", listen: "[듣는 중]",
          off: "오프라인 · 이 기기에서", note: "번역되지 않았어요. 다시 말씀해 주세요.", lt: "No. 12 · 공항까지", lh: "회의록", nx: "다음",
          p1: "공항까지 가 달라고 했습니다.", p2: "고속도로를 제안받았습니다. 약 한 시간입니다.", p3: "→ 통행료를 다시 묻기." },
    "zh-Hans": { cv: "对话", kk: "已保存", kno: "第 12 号", them: "en", you: "我", lang: "英语", pair: "简体中文 ↔ 英语", end: "结束", pause: "暂停", listen: "［正在收听］",
          off: "离线 · 在本机上", note: "未能翻译，请再说一遍。", lt: "第 12 号 · 去机场", lh: "纪要", nx: "下一步",
          p1: "你请司机送你去机场。", p2: "司机建议走高速，大约一小时。", p3: "→ 再问一次过路费。" },
    "zh-Hant": { cv: "對話", kk: "已儲存", kno: "第 12 號", them: "ja", you: "我", lang: "日文", pair: "繁體中文 ↔ 日文", end: "結束", pause: "暫停", listen: "［聆聽中］",
          off: "離線 · 在本機上", note: "未能翻譯，請再說一遍。", lt: "第 12 號 · 去機場", lh: "會議紀錄", nx: "下一步",
          p1: "你請司機送你去機場。", p2: "司機建議走高速公路，大約一小時。", p3: "→ 再問一次過路費。" }
  };
  var SCRIPT = [["me", "airport"], ["them", "highway"], ["me", "howLong"], ["them", "anHour"]];
  var mine = "en", o = OWNER.en, step = 0, typing = null;
  var $ = function (sel) { return device.querySelector(sel); };
  var lines = device.querySelectorAll(".dv__line");

  function render() {
    mine = document.documentElement.lang in OWNER ? document.documentElement.lang : "en";
    o = OWNER[mine];
    var them = o.them;
    $(".dv__theirs").lang = them;
    $(".js-dv-pair").textContent = o.pair; $(".js-dv-end").textContent = o.end; $(".js-dv-pause").textContent = o.pause;
    $(".js-dv-listen").textContent = o.listen; $(".js-dv-off").textContent = o.off;
    $(".js-dv-lt").textContent = o.lt; $(".js-dv-lh").textContent = o.lh; $(".js-dv-nx").textContent = o.nx;
    $(".js-dv-p1").textContent = o.p1; $(".js-dv-p2").textContent = o.p2; $(".js-dv-p3").textContent = o.p3;
    $(".js-dv-cv").textContent = o.cv; $(".js-dv-kk").textContent = o.kk; $(".js-dv-kno").textContent = o.kno;
    $(".js-dv-c1").textContent = L.airport[mine]; $(".js-dv-c2").textContent = L.highway[mine];
    $(".js-dv-c3").textContent = L.howLong[mine]; $(".js-dv-c4").textContent = L.anHour[mine]; $(".js-dv-c5").textContent = L.toll[mine];
    SCRIPT.forEach(function (s, i) {
      var li = lines[i];
      li.querySelector("b").textContent = s[0] === "me" ? o.you : o.lang;
      li.querySelector(".dv__text").textContent = L[s[1]][mine];
      li.querySelector(".dv__text").lang = mine;
      li.querySelector(".dv__gloss").textContent = L[s[1]][them];
      li.querySelector(".dv__gloss").lang = them;
    });
    lines[4].querySelector("b").textContent = o.you;
    $(".js-dv-rtext").textContent = L.toll[mine];
    $(".js-dv-rnote").textContent = o.note;
    show(step, false);
  }

  // Their half: the newest line in their language, large; the one before it small; the cue above.
  function theirHalf(n) {
    var them = o.them;
    var last = Math.min(n, 4);
    $(".js-dv-tcue").textContent = n === 5 ? L.wait[them] : L.cue[them];
    $(".js-dv-tbig").textContent = last ? L[SCRIPT[last - 1][1]][them] : "";
    $(".js-dv-tprev").textContent = last > 1 ? L[SCRIPT[last - 2][1]][them] : "";
  }

  function show(n, animate) {
    if (typing) { clearInterval(typing); typing = null; }
    var from = step;
    step = n;
    device.dataset.step = String(n);
    document.querySelectorAll(".chapter").forEach(function (c) { c.classList.toggle("is-on", Number(c.dataset.step) === n); });
    lines.forEach(function (li) {
      var k = Number(li.dataset.n);
      li.classList.toggle("is-in", k <= n);
      li.classList.remove("is-new");
      li.querySelector(".dv__text").textContent = k === 5 ? L.toll[mine] : L[SCRIPT[k - 1][1]][mine];
    });
    theirHalf(n);
    fit();
    // A line arriving one step forward types in, then is postmarked; anything else lands at once.
    if (animate && !reduce.matches && n === from + 1 && n <= 5) {
      var li = lines[n - 1], text = li.querySelector(".dv__text"), full = text.textContent, i = 0;
      li.classList.add("is-new");
      text.textContent = "";
      var chars = Array.from(full), per = Math.max(18, Math.min(40, 900 / chars.length));
      typing = setInterval(function () {
        i += 1;
        text.textContent = chars.slice(0, i).join("");
        if (i >= chars.length) { clearInterval(typing); typing = null; li.classList.remove("is-new"); }
      }, per);
    }
  }

  // Only whole lines: set aside the oldest delivered lines until the newest fit.
  var list = device.querySelector(".js-dv-lines");
  function fit() {
    lines.forEach(function (li) { li.classList.remove("is-gone"); });
    var shown = Array.prototype.filter.call(lines, function (li) { return li.classList.contains("is-in"); });
    // A bottom-anchored list doesn't report what spills over its top, so add the lines' own heights.
    var room = list.clientHeight, total = 0;
    for (var i = shown.length - 1; i >= 0; i--) {
      total += shown[i].offsetHeight;
      if (total > room + 1 && i < shown.length - 1) { for (var j = i; j >= 0; j--) shown[j].classList.add("is-gone"); break; }
    }
  }
  window.addEventListener("resize", fit);

  document.addEventListener("tabletop:lang", render);
  render();
  show(0, false);

  // The opening: two lines within five seconds, once, when the device is first seen.
  var opened = false;
  function open() {
    if (opened) return;
    opened = true;
    if (reduce.matches) { show(2, false); return; }
    setTimeout(function () { if (step === 0) show(1, true); }, 400);
    setTimeout(function () { if (step === 1) show(2, true); }, 2200);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) open(); }, { threshold: 0.4 }).observe(device);
    // Each chapter takes the conversation to its step as it crosses the middle of the screen; above the first
    // chapter, the opening's two lines.
    var chapters = document.querySelectorAll(".chapter");
    var copy = document.querySelector(".story__copy");
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var target = e.target === copy ? 2 : Number(e.target.dataset.step);
        if (target !== step) show(target, true);
      });
    }, { rootMargin: "-45% 0px -45% 0px" }).observe(copy);
    // A chapter counts when it reaches the readable band: the middle of the screen beside the table on a wide
    // screen; on a phone, the band below the sticky table (measured, and measured again when the size changes),
    // so the device never shows a chapter whose words are hidden under it.
    var stage = document.querySelector(".story__stage"), watchers = [];
    function watch() {
      watchers.forEach(function (w) { w.disconnect(); });
      var phone = window.matchMedia("(max-width: 900px)").matches;
      var below = phone ? Math.round(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar")) + stage.offsetHeight) : 0;
      var band = phone ? "-" + (below + 24) + "px 0px -12% 0px" : "-45% 0px -45% 0px";
      watchers = Array.prototype.map.call(chapters, function (c) {
        var w = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && Number(c.dataset.step) !== step) show(Number(c.dataset.step), true);
          });
        }, { rootMargin: band });
        w.observe(c);
        return w;
      });
    }
    watch();
    var resized;
    window.addEventListener("resize", function () { clearTimeout(resized); resized = setTimeout(watch, 200); });
  } else {
    show(4, false);
  }
})();
