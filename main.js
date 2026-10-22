// Tabletop landing page: six languages (English in the HTML, the rest from i18n.js), the App Store link, and the
// two things that move (the screenshot gallery and the iPhone Duo video), each with a Pause the visitor controls.
(function () {
  // The App Store listing (Tabletop Interpreter, id6821405972). The buttons carry it in the HTML too, so they
  // work before this script runs.
  var STORE_URL = "https://apps.apple.com/app/tabletop-interpreter/id6821405972";
  var LANGS = ["en", "vi", "ja", "ko", "zh-Hans", "zh-Hant"];
  // Each language is its own page (built by _build/build-locales.mjs), so search engines index every one.
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
    // The support, privacy, terms and What's Coming pages show one language at a time, chosen by its anchor (#en, #vi, #ja…).
    document.querySelectorAll(".js-privacy, .js-support, .js-terms, .js-coming").forEach(function (a) {
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


// The page is the app, used once. The device on the table opens on Tabletop's Quick Start in the page's language:
// I speak / They speak (any two of the 19), Swap and Start Conversation. Start, or scrolling to the next chapter,
// begins the app's taxi conversation in that pair; each chapter, as it reaches the reading band, sets the device to
// its view (quick, talk, cam, kept) and brackets what it is about (the captioning brackets glide between regions).
// The stamps in Languages put their language on the phone as the other person's. Under Reduce Motion lines arrive
// without typing and nothing glides. Without JavaScript the HTML shows the conversation delivered.
(function () {
  var device = document.querySelector(".js-device");
  if (!device || !window.matchMedia) return;
  document.documentElement.classList.add("js");
  var header = document.querySelector(".top");
  function measureBar() { if (header) document.documentElement.style.setProperty("--bar", header.offsetHeight + "px"); }
  measureBar();
  window.addEventListener("resize", measureBar);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  var CODES = ["en", "vi", "ja", "ko", "zh-Hans", "zh-Hant", "th", "id", "hi", "ar", "es", "fr", "de", "it", "pt", "ru", "tr", "nl", "pl"];
  // The app's languages are regional (en-US, pt-BR, ar-SA…); the flag is that region's. The two Chinese are shown as
  // 简 and 繁 seals, never a flag.
  var FLAG = { en: "us", vi: "vn", ja: "jp", ko: "kr", th: "th", id: "id", hi: "in", ar: "sa", es: "es", fr: "fr",
               de: "de", it: "it", pt: "br", ru: "ru", tr: "tr", nl: "nl", pl: "pl" };
  var SEAL = { "zh-Hans": "简", "zh-Hant": "繁" };
  // The taxi scene (the App Store's, assets/appstore/source/phrasebook.json) in all 19, the other person's cue, and a
  // printed sign for the camera. Lines beyond the app's own six interface languages are drafts awaiting native review.
  var L = {
    airport: { en: "Please take me to the airport.", vi: "Cho tôi đến sân bay.", ja: "空港までお願いします。", ko: "공항까지 가 주세요.", "zh-Hans": "请送我去机场。", "zh-Hant": "請送我去機場。",
      th: "ช่วยไปส่งที่สนามบินหน่อย", id: "Tolong antar saya ke bandara.", hi: "कृपया मुझे एयरपोर्ट ले चलिए।", ar: "إلى المطار من فضلك.", es: "Al aeropuerto, por favor.", fr: "À l'aéroport, s'il vous plaît.",
      de: "Zum Flughafen, bitte.", it: "All'aeroporto, per favore.", pt: "Para o aeroporto, por favor.", ru: "В аэропорт, пожалуйста.", tr: "Havalimanına, lütfen.", nl: "Naar het vliegveld, alstublieft.", pl: "Na lotnisko, poproszę." },
    highway: { en: "Shall I take the highway?", vi: "Mình đi đường cao tốc nhé?", ja: "高速道路を使いますか？", ko: "고속도로로 갈까요?", "zh-Hans": "要走高速吗？", "zh-Hant": "要走高速公路嗎？",
      th: "ขึ้นทางด่วนไหมครับ", id: "Lewat jalan tol, ya?", hi: "हाईवे से चलूँ?", ar: "هل أسلك الطريق السريع؟", es: "¿Vamos por la autopista?", fr: "Je prends l'autoroute ?",
      de: "Soll ich über die Autobahn fahren?", it: "Prendo l'autostrada?", pt: "Posso ir pela rodovia?", ru: "Поедем по трассе?", tr: "Otoyoldan gidelim mi?", nl: "Zal ik de snelweg nemen?", pl: "Pojedziemy autostradą?" },
    howLong: { en: "Yes, please. How long will it take?", vi: "Vâng, đi cao tốc. Mất bao lâu ạ?", ja: "はい、お願いします。どのくらいかかりますか？", ko: "네, 그렇게 해 주세요. 얼마나 걸려요?", "zh-Hans": "好的，麻烦了。要多长时间？", "zh-Hant": "好的，麻煩了。要多久？",
      th: "ได้เลย ใช้เวลานานเท่าไหร่", id: "Ya, boleh. Berapa lama?", hi: "हाँ, ज़रूर। कितना समय लगेगा?", ar: "نعم، من فضلك. كم يستغرق ذلك؟", es: "Sí, por favor. ¿Cuánto se tarda?", fr: "Oui, s'il vous plaît. Il faut combien de temps ?",
      de: "Ja, bitte. Wie lange dauert es?", it: "Sì, grazie. Quanto ci vuole?", pt: "Sim, por favor. Quanto tempo leva?", ru: "Да, пожалуйста. Сколько ехать?", tr: "Evet, lütfen. Ne kadar sürer?", nl: "Ja, graag. Hoe lang duurt het?", pl: "Tak, poproszę. Ile to potrwa?" },
    anHour: { en: "About an hour.", vi: "Khoảng một tiếng.", ja: "一時間ほどです。", ko: "한 시간 정도요.", "zh-Hans": "大约一个小时。", "zh-Hant": "大約一個小時。",
      th: "ประมาณหนึ่งชั่วโมงครับ", id: "Sekitar satu jam.", hi: "लगभग एक घंटा।", ar: "حوالي ساعة.", es: "Más o menos una hora.", fr: "Environ une heure.",
      de: "Etwa eine Stunde.", it: "Circa un'ora.", pt: "Mais ou menos uma hora.", ru: "Около часа.", tr: "Yaklaşık bir saat.", nl: "Ongeveer een uur.", pl: "Około godziny." },
    cue: { en: "[Listening — speak any time]", vi: "[Đang nghe — xin mời nói]", ja: "［聞き取り中 — いつでもお話しください］", ko: "[듣고 있어요 — 언제든 말씀하세요]", "zh-Hans": "［正在收听 — 随时可以说］", "zh-Hant": "［聆聽中 — 隨時都可以說］",
      th: "[กำลังฟัง — พูดได้เลย]", id: "[Mendengarkan — silakan bicara]", hi: "[सुन रहा है — कभी भी बोलिए]", ar: "[أستمع — تحدّث في أي وقت]", es: "[Escuchando: hable cuando quiera]", fr: "[À l'écoute : parlez quand vous voulez]",
      de: "[Hört zu – sprechen Sie jederzeit]", it: "[In ascolto: parli quando vuole]", pt: "[Ouvindo: fale quando quiser]", ru: "[Слушаю — говорите в любой момент]", tr: "[Dinliyor — istediğiniz zaman konuşun]", nl: "[Luistert — spreek wanneer u wilt]", pl: "[Słucham — proszę mówić]" },
    s1: { en: "AIRPORT TAXI", vi: "TAXI SÂN BAY", ja: "空港タクシー", ko: "공항 택시", "zh-Hans": "机场出租车", "zh-Hant": "機場計程車",
      th: "แท็กซี่สนามบิน", id: "TAKSI BANDARA", hi: "एयरपोर्ट टैक्सी", ar: "تاكسي المطار", es: "TAXI AL AEROPUERTO", fr: "TAXI AÉROPORT",
      de: "FLUGHAFEN-TAXI", it: "TAXI PER L'AEROPORTO", pt: "TÁXI PARA O AEROPORTO", ru: "ТАКСИ В АЭРОПОРТ", tr: "HAVALİMANI TAKSİSİ", nl: "LUCHTHAVENTAXI", pl: "TAKSÓWKA NA LOTNISKO" },
    s2: { en: "Tolls are paid in cash.", vi: "Phí cầu đường trả bằng tiền mặt.", ja: "有料道路の料金は現金でお支払いください。", ko: "통행료는 현금으로 내 주세요.", "zh-Hans": "过路费请付现金。", "zh-Hant": "過路費請付現金。",
      th: "ค่าทางด่วนชำระเป็นเงินสด", id: "Biaya tol dibayar tunai.", hi: "टोल का भुगतान नकद में करें।", ar: "تُدفع رسوم الطريق نقدًا.", es: "Los peajes se pagan en efectivo.", fr: "Les péages se paient en espèces.",
      de: "Maut wird bar bezahlt.", it: "Il pedaggio si paga in contanti.", pt: "O pedágio é pago em dinheiro.", ru: "Плата за проезд — наличными.", tr: "Otoyol ücreti nakit ödenir.", nl: "Tol betaalt u contant.", pl: "Opłatę za autostradę płaci się gotówką." }
  };
  // The owner's side in the page's language (the app's own words); its default partner.
  var OWNER = {
    en: { them: "vi", you: "YOU", end: "End", pause: "Pause", listen: "[Listening]", priv1: "ON THIS PHONE", priv2: "NO ACCOUNT", read: "Read This Page",
          lt: "No. 12 · To the airport", lh: "Minutes", cv: "Conversation", kk: "KEPT", kno: "No. 12",
          p1: "You asked to go to the airport.", p2: "They suggested the highway: about an hour." },
    vi: { them: "ja", you: "BẠN", end: "Kết thúc", pause: "Tạm dừng", listen: "[Đang nghe]", priv1: "TRÊN MÁY NÀY", priv2: "KHÔNG TÀI KHOẢN", read: "Đọc trang này",
          lt: "Số 12 · Ra sân bay", lh: "Biên bản", cv: "Cuộc trò chuyện", kk: "ĐÃ LƯU", kno: "Số 12",
          p1: "Bạn nhờ đưa đến sân bay.", p2: "Tài xế đề nghị đi cao tốc: khoảng một tiếng." },
    ja: { them: "vi", you: "自分", end: "終了", pause: "一時停止", listen: "［聞き取り中］", priv1: "この端末で", priv2: "アカウント不要", read: "このページを読む",
          lt: "No. 12 · 空港まで", lh: "議事メモ", cv: "会話", kk: "保存", kno: "No. 12",
          p1: "空港までお願いしました。", p2: "高速道路を提案されました。約1時間です。" },
    ko: { them: "vi", you: "나", end: "종료", pause: "일시 정지", listen: "[듣는 중]", priv1: "이 휴대폰에서", priv2: "계정 없음", read: "이 페이지 읽기",
          lt: "No. 12 · 공항까지", lh: "회의록", cv: "대화", kk: "보관", kno: "No. 12",
          p1: "공항까지 가 달라고 했습니다.", p2: "고속도로를 제안받았습니다. 약 한 시간입니다." },
    "zh-Hans": { them: "vi", you: "我", end: "结束", pause: "暂停", listen: "［正在收听］", priv1: "仅在本机", priv2: "无需账号", read: "读这一页",
          lt: "第 12 号 · 去机场", lh: "纪要", cv: "对话", kk: "已保存", kno: "第 12 号",
          p1: "你请司机送你去机场。", p2: "司机建议走高速，大约一小时。" },
    "zh-Hant": { them: "vi", you: "我", end: "結束", pause: "暫停", listen: "［聆聽中］", priv1: "僅在本機", priv2: "不需帳號", read: "讀這一頁",
          lt: "第 12 號 · 去機場", lh: "會議紀錄", cv: "對話", kk: "已儲存", kno: "第 12 號",
          p1: "你請司機送你去機場。", p2: "司機建議走高速公路，大約一小時。" }
  };
  var SCRIPT = [["me", "airport"], ["them", "highway"], ["me", "howLong"], ["them", "anHour"]];
  var page = document.documentElement.lang in OWNER ? document.documentElement.lang : "en";
  var o = OWNER[page];
  var mine = page, them = o.them;
  var view = "quick", step = 0, focus = "pick", started = false, typing = null;
  var $ = function (sel) { return device.querySelector(sel); };
  var lines = device.querySelectorAll(".dv__line");
  var dirOf = function (code) { return code === "ar" ? "rtl" : "ltr"; };

  // Language names: in the page's language for the app's words, in their own for the stamps.
  var local = null;
  try { local = new Intl.DisplayNames([page], { type: "language" }); } catch (e) {}
  function nameOf(code) { var n = local && local.of(code); return n ? n.charAt(0).toLocaleUpperCase(page) + n.slice(1) : code; }
  function nativeOf(code) {
    try { var n = new Intl.DisplayNames([code], { type: "language" }).of(code); return n.charAt(0).toLocaleUpperCase(code) + n.slice(1); } catch (e) { return code; }
  }
  function flagInto(el, code) {
    el.textContent = "";
    if (SEAL[code]) {
      var s = document.createElement("span"); s.className = "seal"; s.lang = code; s.textContent = SEAL[code]; el.appendChild(s);
    } else {
      var img = document.createElement("img"); img.src = "/assets/flags/" + FLAG[code] + ".svg"; img.alt = ""; img.width = 48; img.height = 36; el.appendChild(img);
    }
  }

  var pickMe = $(".js-pick-me"), pickThem = $(".js-pick-them");
  [pickMe, pickThem].forEach(function (sel) {
    CODES.forEach(function (code) {
      var opt = document.createElement("option");
      var n = nameOf(code), nat = nativeOf(code);
      opt.value = code;
      opt.textContent = n === nat ? n : n + " · " + nat;
      sel.appendChild(opt);
    });
  });

  function text(sel, value, code) {
    var el = typeof sel === "string" ? $(sel) : sel;
    el.textContent = value;
    if (code) { el.lang = code; el.dir = dirOf(code); }
  }

  function render() {
    pickMe.value = mine; pickThem.value = them;
    flagInto($(".js-flag-me"), mine); flagInto($(".js-flag-them"), them);
    text(".js-name-me", nameOf(mine)); text(".js-name-them", nameOf(them));
    document.querySelector(".js-side-them").textContent = nameOf(them);
    document.querySelector(".js-side-you").textContent = nameOf(mine);
    var theirs = $(".dv__theirs"); theirs.lang = them; theirs.dir = dirOf(them);
    text(".js-dv-pair", nameOf(mine) + " ↔ " + nameOf(them));
    text(".js-dv-end", o.end); text(".js-dv-pause", o.pause); text(".js-dv-listen", o.listen);
    text(".js-dv-priv1", o.priv1); text(".js-dv-priv2", o.priv2);
    text(".js-dv-lt", o.lt); text(".js-dv-lh", o.lh); text(".js-dv-cv", o.cv); text(".js-dv-kk", o.kk); text(".js-dv-kno", o.kno);
    text(".js-dv-p1", o.p1); text(".js-dv-p2", o.p2);
    text(".js-cam-s1", L.s1[them], them); text(".js-cam-s2", L.s2[them], them);
    text(".js-cam-t1", L.s1[mine], mine); text(".js-cam-t2", L.s2[mine], mine);
    text(".js-cam-btn", o.read);
    ["airport", "highway", "howLong", "anHour"].forEach(function (k, i) { text(".js-dv-c" + (i + 1), L[k][mine], mine); });
    var them_tag = nameOf(them).toLocaleUpperCase(page);
    SCRIPT.forEach(function (s, i) {
      var li = lines[i];
      li.querySelector("b").textContent = s[0] === "me" ? o.you : them_tag;
      text(li.querySelector(".dv__gloss"), L[s[1]][them], them);
      li.querySelector(".dv__text").lang = mine; li.querySelector(".dv__text").dir = dirOf(mine);
    });
    document.querySelectorAll(".lstamp").forEach(function (b) {
      var code = b.dataset.code, l = b.querySelector(".lstamp__l"), n = nameOf(code);
      l.textContent = n === nativeOf(code) ? "" : n;
      b.setAttribute("aria-pressed", String(code === them));
    });
    show(view, step, focus, false);
  }

  // Their half: the newest line in their language, large; the one before it small; the cue at the far edge.
  function theirHalf(n) {
    $(".js-dv-tcue").textContent = L.cue[them];
    $(".js-dv-tbig").textContent = n ? L[SCRIPT[n - 1][1]][them] : "";
    $(".js-dv-tprev").textContent = n > 1 ? L[SCRIPT[n - 2][1]][them] : "";
  }

  function show(v, n, f, animate) {
    if (typing) { clearInterval(typing); typing = null; }
    var from = step;
    view = v; step = n; focus = f;
    device.dataset.view = v; device.dataset.step = String(n); device.dataset.focus = f;
    lines.forEach(function (li) {
      var k = Number(li.dataset.n);
      li.classList.toggle("is-in", k <= n);
      li.classList.remove("is-new");
      li.querySelector(".dv__text").textContent = L[SCRIPT[k - 1][1]][mine];
    });
    theirHalf(n);
    fit();
    place();
    // A line arriving one step forward types in, then is postmarked; anything else lands at once.
    if (animate && !reduce.matches && v === "talk" && n === from + 1) {
      var li = lines[n - 1], el = li.querySelector(".dv__text"), full = el.textContent, i = 0;
      li.classList.add("is-new");
      el.textContent = "";
      var chars = Array.from(full), per = Math.max(18, Math.min(40, 900 / chars.length));
      typing = setInterval(function () {
        i += 1;
        el.textContent = chars.slice(0, i).join("");
        if (i >= chars.length) { clearInterval(typing); typing = null; li.classList.remove("is-new"); fit(); place(); }
      }, per);
    }
  }

  // The conversation runs up to a step: one line at a time from where it is, then stops.
  var queue = [];
  function talkTo(target, f) {
    queue.forEach(clearTimeout); queue = [];
    if (!started) started = true;
    if (view !== "talk" || reduce.matches || target <= step) { show("talk", target, f, false); return; }
    show("talk", step, f, false);
    for (var k = step + 1, d = 350; k <= target; k++, d += 1700) {
      (function (k, d) { queue.push(setTimeout(function () { show("talk", k, focus, true); }, d)); })(k, d);
    }
  }

  // Only whole lines: set aside the oldest delivered lines until the newest fit.
  var list = $(".js-dv-lines");
  function fit() {
    lines.forEach(function (li) { li.classList.remove("is-gone"); });
    var shown = Array.prototype.filter.call(lines, function (li) { return li.classList.contains("is-in"); });
    var room = list.clientHeight, total = 0;
    for (var i = shown.length - 1; i >= 0; i--) {
      total += shown[i].offsetHeight;
      if (total > room + 1 && i < shown.length - 1) { for (var j = i; j >= 0; j--) shown[j].classList.add("is-gone"); break; }
    }
  }

  // The brackets: measured around the region the chapter is about, so they hold at every size.
  var dv = $(".dv"), brackets = device.querySelectorAll(".dv__focus");
  // One set of brackets per region: "both" frames their newest line and your delivered lines apart.
  var TARGETS = { pick: [[".dv__quick .pick"]], both: [[".dv__big"], [".dv__line.is-in:not(.is-gone)"]], theirs: [[".dv__big", ".dv__prev"]],
                  cam: [[".cam__slip"]], air: [[".dv__private"]], letter: [[".dv__lt", ".dv__pt"]] };
  // Where an element sits in the screen, from layout (not the transition in progress). Their half is turned 180°,
  // so a box inside it is mirrored within it.
  var theirs = $(".dv__theirs");
  function box(el) {
    var x = 0, y = 0, e = el;
    while (e && e !== dv) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    var b = { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
    if (el !== theirs && theirs.contains(el)) {
      var t = box(theirs);
      b.x = t.x + t.w - (b.x - t.x) - b.w; b.y = t.y + t.h - (b.y - t.y) - b.h;
    }
    return b;
  }
  function frame(bracket, sels) {
    var x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    (sels || []).forEach(function (sel) {
      device.querySelectorAll(sel).forEach(function (el) {
        if (!el.offsetWidth) return;
        var b = box(el);
        x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.w); y2 = Math.max(y2, b.y + b.h);
      });
    });
    if (x1 === Infinity) { bracket.classList.remove("is-on"); return; }
    var pad = Math.round(dv.clientWidth * 0.03), W = dv.clientWidth, H = dv.clientHeight;
    x1 = Math.max(x1 - pad, pad * 0.5); y1 = Math.max(y1 - pad, pad * 0.5);
    x2 = Math.min(x2 + pad, W - pad * 0.5); y2 = Math.min(y2 + pad, H - pad * 0.5);
    // Your lines' brackets stop above the listening cue, clear of the screen's rounded corners.
    var cue = $(".dv__listen");
    if (cue.offsetWidth && y1 < box(cue).y) y2 = Math.min(y2, box(cue).y - 2);
    bracket.style.transform = "translate(" + x1 + "px," + y1 + "px)";
    bracket.style.width = (x2 - x1) + "px"; bracket.style.height = (y2 - y1) + "px";
    bracket.classList.add("is-on");
  }
  function place() {
    var groups = TARGETS[focus] || [];
    brackets.forEach(function (b, i) { frame(b, groups[i]); });
  }
  window.addEventListener("resize", function () { fit(); place(); });

  // Quick Start's controls.
  function pick(which, code) {
    if (which === "me") { if (code === them) them = mine; mine = code; }
    else { if (code === mine) mine = them; them = code; }
    render();
  }
  pickMe.addEventListener("change", function () { pick("me", pickMe.value); });
  pickThem.addEventListener("change", function () { pick("them", pickThem.value); });
  $(".js-swap").addEventListener("click", function () { var m = mine; mine = them; them = m; render(); });
  $(".js-start").addEventListener("click", function () { talkTo(2, "both"); });

  // The stamps: their language onto the phone, Quick Start ready. The visitor stays where they are: a line by the
  // stamps says so, and "See it on the phone" takes them up only if they choose.
  var story = document.querySelector(".story");
  var note = document.querySelector(".js-stamp-note");
  document.querySelectorAll(".lstamp").forEach(function (b) {
    b.addEventListener("click", function () {
      pick("them", b.dataset.code);
      show("quick", step, "pick", false);
      if (note) {
        var tpl = note.querySelector(".js-stamp-tpl").textContent;
        note.querySelector(".js-stamp-msg").textContent = tpl.replace("{lang}", nameOf(b.dataset.code));
        note.hidden = false;
      }
    });
  });
  if (note) note.querySelector(".js-stamp-see").addEventListener("click", function (e) {
    e.preventDefault();
    story.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth" });
    $(".js-start").focus({ preventScroll: true });
  });

  render();
  show("quick", 0, "pick", false);

  // Each chapter sets the device as it reaches the reading band: the middle of the screen beside the table on a wide
  // screen; on a phone, the band below the sticky table (measured, and again when the size changes).
  var chapters = document.querySelectorAll(".chapter");
  function activate(c) {
    chapters.forEach(function (x) { x.classList.toggle("is-on", x === c); });
    var v = c ? c.dataset.view : "quick", f = c ? c.dataset.focus : "pick";
    if (v === "talk") talkTo(Number(c.dataset.step), f);
    else { queue.forEach(clearTimeout); queue = []; show(v, v === "kept" || v === "cam" ? 4 : step, f, false); }
  }
  if ("IntersectionObserver" in window) {
    var copy = document.querySelector(".story__copy");
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(null); });
    }, { rootMargin: "-45% 0px -45% 0px" }).observe(copy);
    var stage = document.querySelector(".story__stage"), watchers = [];
    function watch() {
      watchers.forEach(function (w) { w.disconnect(); });
      var phone = window.matchMedia("(max-width: 900px)").matches;
      var below = phone ? Math.round(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar")) + stage.offsetHeight) : 0;
      var band = phone ? "-" + (below + 24) + "px 0px -12% 0px" : "-45% 0px -45% 0px";
      watchers = Array.prototype.map.call(chapters, function (c) {
        var w = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting && !c.classList.contains("is-on")) activate(c); });
        }, { rootMargin: band });
        w.observe(c);
        return w;
      });
    }
    watch();
    var resized;
    window.addEventListener("resize", function () { clearTimeout(resized); resized = setTimeout(watch, 200); });
  }
})();

// The live Aa in "For every reader": each press is a step larger, the fourth back to the first, as in the app. The
// button names its step for screen readers ("Their text size, 2 of 4"), in the page's language.
(function () {
  var demo = document.querySelector(".js-aa");
  if (!demo) return;
  var button = demo.querySelector(".js-aa-button");
  var base = button.getAttribute("aria-label");
  var step = 0;
  function show() {
    demo.dataset.step = String(step);
    button.setAttribute("aria-label", base + ", " + (step + 1) + " / 4");
  }
  button.addEventListener("click", function () { step = (step + 1) % 4; show(); });
  show();
})();
