// Сборка nuanu.city: корень на английском, остальные языки в /<код>/, текст вписан в HTML.
// У каждой версии свои canonical и hreflang, title и description английские (правило Босса 23.10).
// На github.io noindex; при сборке с доменом (node _build/build.mjs https://домен/) индексация открывается и пишется robots.txt.
// Запуск из site/:  node _build/build.mjs [https://nuanu.city/]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LANGS, NATIVE, LOCALE, T } from './i18n-texts.mjs';
import { glue } from './glue.mjs';
import { CAPS, GAL, ARR } from './caps.mjs';
import { PINS, UNIT_PIN, BSO_PIN, PT } from './plan.mjs';

// выбор языка по куки: отдельным файлом, чтобы CSP обходилась без inline-скриптов
const REDIR = `(function(){var L=/^(${LANGS.join('|')})$/;if(/bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(navigator.userAgent))return;var w=(location.search.match(/[?&]lang=([a-z]{2})/)||[])[1];if(!w){var m=document.cookie.match(/(?:^|;\\s*)unit_lang=([a-z]{2})/);w=m&&m[1]}if(!w||w==='en'||!L.test(w))return;location.replace(location.pathname.replace(/[^/]*$/,'')+w+'/'+location.hash)})();`;
const INDEX = !/github\.io/.test(process.argv[2] || 'https://turbo1507.github.io/');
const OG_W = 1200, OG_H = 630; // размер hero.jpg для превью ссылок
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.argv[2] || 'https://turbo1507.github.io/nuanu-city/').replace(/\/?$/, '/');
const TITLE = 'Nuanu: a city of the future by the ocean in Bali';
const DESC = 'Nuanu is a cultural cluster on Bali’s west coast. Explore UNIT. projects in Nuanu: Black Sands Oasis villas, UNIT. Space City retreat and direct rentals on unit.now.';
const V = Date.now().toString(36);
const url = l => SITE + (l === 'en' ? '' : l + '/');
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plain = s => String(s).replace(/<[^>]+>/g, '');
const U = '<i class="u5">UNIT.</i>';
const BRAND = `${U} in Nuanu`;

function page(l) {
  const d = Object.fromEntries(Object.entries(T[l]).map(([k, v]) => [k, glue(v, l)]));
  const R = l === 'en' ? '' : '../';
  const caps = CAPS[l].map(c => glue(c, l));
  const langs = LANGS.map(x => `<li><a href="${R}${x === 'en' ? '' : x + '/'}" hreflang="${x}" lang="${x}"${x === l ? ' aria-current="true"' : ''}>${NATIVE[x]}</a></li>`).join('');
  const prj = [
    ['https://blacksandsoasis.com', 'blacksandsoasis.com', 'p-bso', 585, 'Black Sands Oasis', 'bso'],
    ['https://unitspace.city', 'unitspace.city', 'p-space', 600, `${U} Space City`, 'space'],
    ['https://unit.now', 'unit.now', 'p-now', 600, d.now_t, 'now']
  ];
  return `<!doctype html>
<html lang="${l}"${l === 'en' ? '' : ' data-root="../"'}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="${INDEX ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://unitdeveloper.com; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#0433ff">
<title>${attr(TITLE)}</title>
<meta name="description" content="${attr(DESC)}">
<link rel="canonical" href="${url(l)}">
${LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${url(x)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${url('en')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="UNIT. in Nuanu">
<meta property="og:url" content="${url(l)}">
<meta property="og:title" content="Nuanu: a city of the future by the ocean">
<meta property="og:description" content="${attr(DESC)}">
<meta property="og:image" content="${SITE}assets/img/og.jpg">
<meta property="og:image:width" content="${OG_W}">
<meta property="og:image:height" content="${OG_H}">
<meta property="og:image:alt" content="${attr(plain(T.en.hero_alt))}">
<meta property="og:locale" content="${LOCALE[l]}">
${LANGS.filter(x => x !== l).map(x => `<meta property="og:locale:alternate" content="${LOCALE[x]}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebSite', name: "UNIT. in Nuanu", url: SITE, inLanguage: LANGS }, { '@type': 'Organization', name: 'UNIT.', url: 'https://unitdeveloper.com', sameAs: ['https://blacksandsoasis.com', 'https://unitspace.city', 'https://unit.now'] }] }).replace(/</g, '\\u003c')}</script>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%230433ff%27/%3E%3Ccircle cx=%2722%27 cy=%2722%27 r=%273%27 fill=%27%23fff%27/%3E%3C/svg%3E">
<link rel="preload" href="${R}assets/fonts/hn-medium.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${R}assets/fonts/hn-roman.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${R}assets/site.css?v=${V}">
${l === 'en' ? `<script src="assets/redir.js?v=${V}"></script>` : ''}
</head>
<body>
<header class="hdr">
  <div class="container hdr-in">
    <a class="wordmark" href="#top">${BRAND}</a>
    <nav class="nav" aria-label="${attr(d.nav_label)}">
      <a href="#about">${d.nav_about}</a>
      <a href="#projects">${d.nav_projects}</a>
      <a href="#subscribe">${d.nav_sub}</a>
    </nav>
    <div class="lang-dd">
      <button type="button" class="lang-dd-btn" aria-expanded="false" aria-controls="langList" aria-label="${attr(d.lang_label)}: ${NATIVE[l]}"><span>${l.toUpperCase()}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></button>
      <ul class="lang-dd-list" id="langList" hidden>${langs}</ul>
    </div>
    <a class="btn btn-sm hdr-cta" href="#subscribe">${d.cta}</a>
  </div>
</header>

<main id="top">
  <section class="hero">
    <div class="hero-media">
${['hero', 'hero2', 'hero3'].map((h, i) => `      <div class="hero-slide${i ? '' : ' on'}"><picture>
        <source media="(max-width:599px)" srcset="${R}assets/img/${h}-m.webp" type="image/webp">
        <img src="${R}assets/img/${h}.webp" alt="${attr(plain(i ? caps[i] : d.hero_alt))}"${i ? ' loading="lazy"' : ' fetchpriority="high"'} width="2200" height="1467">
      </picture></div>`).join('\n')}
    </div>
    <div class="container hero-in">
      <h1 class="t">Nuanu</h1>
      <p class="t h1-sub">${d.h1_sub}</p>
      <p class="t hero-p">${d.hero_p}</p>
      <div class="btns">
        <a class="btn btn-blue" href="#projects"><span>${d.hero_cta1}</span></a>
        <a class="btn btn-ghost" href="#subscribe">${d.hero_cta2}</a>
      </div>
    </div>
    <div class="hero-caps">${caps.map((c, i) => `<p class="hero-cap${i ? '' : ' on'}"${i ? ' aria-hidden="true"' : ''}>${c}</p>`).join('')}</div>
    <div class="hero-dots" role="group" aria-label="${attr(GAL[l])}"></div>
  </section>

  <section class="sec" id="about">
    <div class="container">
      <div class="about">
        <h2 class="t h2">${d.about_h2.replace(/^(.+?,)[  ](.+)$/, '<span class="ln">$1</span> <span class="ln">$2</span>')}</h2>
        <p class="t">${d.about_p}</p>
      </div>
      <div class="plan"><div class="plan-canvas">
        <img src="${R}assets/img/plan.webp" srcset="${R}assets/img/plan-s.webp 1200w, ${R}assets/img/plan.webp 2400w" sizes="(max-width:1599px) 100vw, 1600px" alt="${attr(plain(d.plan_alt))}" width="2400" height="1200" loading="lazy">
        <ul class="pchips" aria-label="${attr(PT[l].label)}">
${PINS.map(p => `          <li class="pchip${p.m ? '' : ' pchip-d'}${p.w ? ' pchip-w' : ''}" data-k="${p.k}" style="--x:${p.x};--y:${p.y}">${glue(PT[l][p.k], l)}</li>`).join('\n')}
          <li class="pchip pchip-unit" style="--x:${BSO_PIN.x};--y:${BSO_PIN.y}">Black Sands Oasis</li>
          <li class="pchip pchip-unit" style="--x:${UNIT_PIN.x};--y:${UNIT_PIN.y}">${U} Space City</li>
        </ul>
      </div></div>
    </div>
  </section>

  <section class="sec prj-sec" id="projects">
    <div class="container">
      <h2 class="t h2">${d.prj_h2}</h2>
      <div class="prj-list">
${prj.map(([href, dom, img, h, title, k]) => `        <article class="prj">
          <div class="prj-photo prj-gal">
            <div class="gal-track"><img src="${R}assets/img/${img}.webp" alt="${attr(plain(d[k + '_alt']))}" width="900" height="${h}" loading="lazy"><img src="${R}assets/img/${img}-2.webp" alt="" width="900" height="640" loading="lazy"><img src="${R}assets/img/${img}-3.webp" alt="" width="900" height="640" loading="lazy"></div>
            <button class="gal-arr gal-prev" type="button" aria-label="${attr(ARR[l][0])}"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="gal-arr gal-next" type="button" aria-label="${attr(ARR[l][1])}"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            <div class="gal-dots" role="group" aria-label="${attr(GAL[l])}"></div>
          </div>
          <div class="prj-body">
            <span class="t prj-dom">${dom}</span>
            <h3 class="t">${title}</h3>
            <p class="t">${d[k + '_p']}</p>
            <a class="btn btn-blue" href="${href}">${d[k + '_cta']}</a>
          </div>
        </article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="sec sec-last" id="subscribe">
    <div class="container">
      <div class="sub">
        <div class="sub-bg" aria-hidden="true"><span class="sub-blobs"><i></i><i></i><i></i><i></i><i></i></span><span class="sub-grain"></span></div>
        <h2 class="t h2">${d.sub_h2}</h2>
        <p class="t sub-p">${d.sub_p}</p>
        <ul class="chips" aria-label="${attr(d.chips_label)}"><li>${d.chip1}</li><li>${d.chip2}</li><li>${d.chip3}</li></ul>
        <form class="form" id="subForm" data-endpoint="https://unitdeveloper.com/wp-json/unit/v1/nuanu-sub" data-ok="${attr(d.ok)}" data-off="${attr(d.off)}" data-fail="${attr(d.fail)}" data-bad="${attr(d.bad)}" novalidate>
          <label class="sr" for="subEmail">${d.sub_label}</label>
          <input id="subEmail" name="email" type="email" autocomplete="email" required placeholder="${attr(d.sub_ph)}">
          <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="btn btn-white" type="submit">${d.sub_btn}</button>
        </form>
        <p class="form-note" id="subNote" role="status" aria-live="polite"></p>
      </div>
    </div>
  </section>
</main>

<footer class="ftr">
  <div class="container ftr-in">
    <span class="t wordmark">${BRAND}</span>
    <nav class="ftr-links" aria-label="${attr(plain(d.eco_label))}">
      <a class="t" href="https://blacksandsoasis.com">blacksandsoasis.com</a>
      <a class="t" href="https://unitspace.city">unitspace.city</a>
      <a class="t" href="https://unit.now">unit.now</a>
      <span class="t">© 2026 ${U}</span>
    </nav>
  </div>
</footer>
<script src="${R}assets/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

for (const l of LANGS) {
  const dir = l === 'en' ? ROOT : path.join(ROOT, l);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(l));
}
const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(l => `  <url><loc>${url(l)}</loc>${LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${url(x)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${url('en')}"/></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
fs.writeFileSync(path.join(ROOT, 'assets', 'redir.js'), REDIR + '\n');
if (INDEX) fs.writeFileSync(path.join(ROOT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + 'sitemap.xml\n');
else if (fs.existsSync(path.join(ROOT, 'robots.txt'))) fs.rmSync(path.join(ROOT, 'robots.txt'));
console.log('build:', LANGS.join(' '), SITE);
