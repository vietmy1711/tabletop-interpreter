// Writes the home page in each language as its own page (/vi/, /ja/, /ko/, /zh-hans/, /zh-hant/), so search engines
// index every language: the copy from i18n.js baked into the HTML, with its own lang, title, description,
// canonical and Open Graph locale. The English index.html is the template; edit it and i18n.js, never the output.
// Run from the site folder after any change to either:  node _build/build-locales.mjs
// (Folders starting with "_" are left out of the published site.)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const SITE = "https://trytabletop.app";
const LANGS = {
  vi: { dir: "vi", og: "vi_VN" },
  ja: { dir: "ja", og: "ja_JP" },
  ko: { dir: "ko", og: "ko_KR" },
  "zh-Hans": { dir: "zh-hans", og: "zh_CN" },
  "zh-Hant": { dir: "zh-hant", og: "zh_TW" },
};

const template = readFileSync("index.html", "utf8");
const win = {};
vm.runInNewContext(readFileSync("i18n.js", "utf8"), { window: win });
const DICT = win.TABLETOP_I18N;

const text = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const getAttr = (attrs, name) => (attrs.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const setAttr = (attrs, name, value) => {
  const re = new RegExp(`(\\s${name}=")[^"]*(")`);
  if (!re.test(attrs)) throw new Error(`no ${name} in <${attrs}>`);
  return attrs.replace(re, (_, a, b) => a + attr(value) + b);
};

function localize(lang) {
  const { dir, og } = LANGS[lang];
  const dict = DICT[lang];
  const url = `${SITE}/${dir}/`;
  let missing = 0;
  const t = (key, fallback) => {
    if (dict[key] != null) return dict[key];
    missing++;
    return fallback;
  };

  // The body: every data-i18n* element, in document order.
  let out = "", pos = 0, done = 0;
  const tag = /<([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*?)?(\/?)>/g;
  let m;
  while ((m = tag.exec(template))) {
    let [whole, name, attrs = "", selfClose] = m;
    if (!/\sdata-i18n/.test(attrs)) continue;
    out += template.slice(pos, m.index);
    pos = m.index + whole.length;
    let k;
    if ((k = getAttr(attrs, "data-i18n-alt"))) attrs = setAttr(attrs, "alt", t(k, getAttr(attrs, "alt")));
    if ((k = getAttr(attrs, "data-i18n-aria"))) attrs = setAttr(attrs, "aria-label", t(k, getAttr(attrs, "aria-label")));
    if ((k = getAttr(attrs, "data-i18n-lang"))) attrs = setAttr(attrs, "lang", t(k, getAttr(attrs, "lang")));
    out += `<${name}${attrs}${selfClose}>`;
    const textKey = getAttr(attrs, "data-i18n"), htmlKey = getAttr(attrs, "data-i18n-html");
    if (textKey || htmlKey) {
      const close = template.indexOf(`</${name}>`, pos);
      const inner = template.slice(pos, close);
      if (textKey && inner.includes("<")) throw new Error(`data-i18n="${textKey}" holds markup`);
      if (htmlKey && inner.includes(`<${name}`)) throw new Error(`data-i18n-html="${htmlKey}" is nested`);
      out += textKey ? text(t(textKey, inner)) : t(htmlKey, inner);
      pos = close;
      tag.lastIndex = close;
    }
    done++;
  }
  out += template.slice(pos);

  // What the script would otherwise swap at load: the badges and screenshots in this language, the policy pages
  // opened at this language, the brand home to this page, the menu on this language.
  out = out
    .replace(/\/assets\/badges\/en\.svg/g, `/assets/badges/${lang}.svg`)
    .replace(/\/assets\/shots\/en-(\d)\.webp/g, `/assets/shots/${lang}-$1.webp`)
    .replace(/href="\/(privacy|support|terms|whats-coming)\.html"/g, `href="/$1.html#${lang}"`)
    .replace('<a class="brand" href="/"', `<a class="brand" href="/${dir}/"`)
    .replace(`<option value="${lang}" lang="${lang}">`, `<option value="${lang}" lang="${lang}" selected>`);

  // The head.
  const title = t("meta.title", ""), description = t("meta.description", "");
  const head = [
    [/<html lang="en">/, `<html lang="${lang}">`],
    [/<title>[^<]*<\/title>/, `<title>${text(title)}</title>`],
    [/(<meta name="description" content=")[^"]*/, `$1${attr(description)}`],
    [/(<meta property="og:title" content=")[^"]*/, `$1${attr(title)}`],
    [/(<meta property="og:description" content=")[^"]*/, `$1${attr(description)}`],
    [/(<meta property="og:locale" content=")[^"]*/, `$1${og}`],
    [/(<meta property="og:url" content=")[^"]*/, `$1${url}`],
    [/(<link rel="canonical" href=")[^"]*/, `$1${url}`],
    [/("url": ")https:\/\/trytabletop\.app\/(")/, `$1${url}$2`],
    [/(<script type="application\/ld\+json">\s*\{)/, `$1\n    "inLanguage": "${lang}",`],
    [/<!doctype html>\n/, `<!doctype html>\n<!-- Generated from /index.html and /i18n.js by _build/build-locales.mjs: edit those, not this page. -->\n`],
  ];
  for (const [re, to] of head) {
    if (!re.test(out)) throw new Error(`${lang}: head pattern ${re} not found`);
    out = out.replace(re, to);
  }

  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, out);
  console.log(`${dir}/index.html: ${done} elements, ${missing} falling back to English`);
}

for (const lang of Object.keys(LANGS)) localize(lang);
