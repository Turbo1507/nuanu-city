(function () {
  // :active на iOS срабатывает только при слушателе касаний
  document.addEventListener('touchstart', function () {}, { passive: true });
  var root = document.documentElement;
  // высота экрана в px один раз и только при смене ширины: в Telegram и Safari страница не дёргается
  function setVh() { root.style.setProperty('--vh', innerHeight / 100 + 'px'); }
  setVh();
  var lastW = innerWidth;
  addEventListener('resize', function () { if (innerWidth !== lastW) { lastW = innerWidth; setVh(); } });

  // выбор языка: список по кнопке, выбор запоминаем в куки на год
  var dd = document.querySelector('.lang-dd');
  if (!dd) return;
  var btn = dd.querySelector('.lang-dd-btn'), list = dd.querySelector('.lang-dd-list');
  var links = [].slice.call(list.querySelectorAll('a'));
  function open(on, kbd) {
    btn.setAttribute('aria-expanded', on ? 'true' : 'false'); list.hidden = !on;
    if (on && kbd) (list.querySelector('[aria-current]') || links[0]).focus();
  }
  btn.addEventListener('click', function (e) { open(list.hidden, e.detail === 0); });
  document.addEventListener('click', function (e) { if (!list.hidden && !dd.contains(e.target)) open(false); });
  dd.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !list.hidden) { open(false); btn.focus(); return; }
    if (e.key === 'ArrowDown' && list.hidden && e.target === btn) { e.preventDefault(); open(true, true); return; }
    var i = links.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); links[(i + (e.key === 'ArrowDown' ? 1 : links.length - 1)) % links.length].focus(); }
  });
  list.addEventListener('click', function (e) {
    var a = e.target.closest('a[hreflang]');
    if (!a) return;
    document.cookie = 'unit_lang=' + a.hreflang + '; path=/; max-age=31536000; SameSite=Lax';
    a.href = a.href.split('#')[0] + location.hash;
  });
})();

// подписка: адрес приёма ещё не задан (data-endpoint пустой), форма честно говорит, что заработает скоро
(function () {
  var form = document.getElementById('subForm');
  if (!form) return;
  var note = document.getElementById('subNote'), inp = form.querySelector('#subEmail'), hp = form.querySelector('.hp'), btn = form.querySelector('button[type=submit]'), d = form.dataset;
  inp.setAttribute('aria-describedby', 'subNote');
  function say(t, err) { note.textContent = t; note.classList.toggle('is-err', !!err); }
  function bad() { inp.setAttribute('aria-invalid', 'true'); say(d.bad, true); inp.focus(); }
  inp.addEventListener('input', function () { if (inp.hasAttribute('aria-invalid')) { inp.removeAttribute('aria-invalid'); say(''); } });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = inp.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return bad();
    inp.removeAttribute('aria-invalid');
    if (!d.endpoint) return say(d.off);
    btn.disabled = true; say('');
    var body = new URLSearchParams({ email: v, website: hp ? hp.value : '', lang: document.documentElement.lang, page: location.pathname });
    fetch(d.endpoint, { method: 'POST', body: body })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (x) { if (r.status === 400 && x.error === 'email') throw 'email'; if (!r.ok) throw 0; }); })
      .then(function () { say(d.ok); form.reset(); })
      .catch(function (err) { if (err === 'email') bad(); else say(d.fail, true); })
      .then(function () { btn.disabled = false; });
  });
})();

// галерея первого экрана: смена раз в 5,5 с, точки переключают, пауза при скрытой вкладке и при «меньше движения»
(function () {
  var slides = [].slice.call(document.querySelectorAll('.hero-slide'));
  var caps = [].slice.call(document.querySelectorAll('.hero-cap'));
  var dots = document.querySelector('.hero-dots');
  if (slides.length < 2 || !dots) return;
  var label = dots.getAttribute('aria-label') || '';
  dots.innerHTML = slides.map(function (_, i) { return '<button type="button" data-i="' + i + '" aria-label="' + label + ' ' + (i + 1) + ' / ' + slides.length + '"' + (i ? '' : ' aria-current="true"') + '></button>'; }).join('');
  var idx = 0, timer, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(i) {
    idx = i;
    slides.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    caps.forEach(function (c, k) { c.classList.toggle('on', k === i); if (k === i) c.removeAttribute('aria-hidden'); else c.setAttribute('aria-hidden', 'true'); });
    [].forEach.call(dots.children, function (b, k) { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  }
  function run() { clearInterval(timer); if (still || document.hidden) return; timer = setInterval(function () { show((idx + 1) % slides.length); }, 5500); }
  dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { show(+b.dataset.i); run(); } });
  document.addEventListener('visibilitychange', run);
  run();
})();


// «Экосистема»: блок текста ужимается по самой длинной строке, чтобы её край совпал с правым краем плана (≥1200)
(function () {
  var p = document.querySelector('.about p'); if (!p) return;
  var mq = matchMedia('(min-width:1200px)'), lastW = 0;
  function fit() {
    p.style.width = '';
    if (!mq.matches) return;
    var r = document.createRange(); r.selectNodeContents(p);
    var box = p.getBoundingClientRect(), right = 0;
    [].forEach.call(r.getClientRects(), function (x) { if (x.right > right) right = x.right; });
    if (right) p.style.width = Math.ceil(right - box.left) + 'px';
  }
  function onW() { if (innerWidth !== lastW) { lastW = innerWidth; fit(); } }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(onW);
  addEventListener('resize', onW);
})();

// слайдер фото в карточках проектов: свайп и трекпад — нативная прокрутка, точки и стрелки — прокрутка к кадру
(function () {
  [].forEach.call(document.querySelectorAll('.prj-gal'), function (g) {
    var t = g.querySelector('.gal-track'), n = t.children.length, dots = g.querySelector('.gal-dots');
    var prev = g.querySelector('.gal-prev'), next = g.querySelector('.gal-next');
    var label = dots.getAttribute('aria-label') || '', cur = -1;
    dots.innerHTML = [].map.call(t.children, function (_, i) { return '<button type="button" data-i="' + i + '" aria-label="' + label + ' ' + (i + 1) + ' / ' + n + '"></button>'; }).join('');
    function go(i) { t.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * t.clientWidth, behavior: 'smooth' }); }
    function sync() {
      var i = Math.round(t.scrollLeft / (t.clientWidth || 1));
      if (i === cur) return; cur = i;
      [].forEach.call(dots.children, function (b, k) { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      prev.disabled = i <= 0; next.disabled = i >= n - 1;
    }
    t.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
    dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) go(+b.dataset.i); });
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    sync();
  });
})();

// шапка липкая, как у фурнитуры: над первым экраном прозрачная, дальше светлая подложка
(function () {
  var h = document.querySelector('.hdr'), hero = document.querySelector('.hero');
  if (!h || !hero) return;
  // прозрачная только в самом верху; чуть прокрутили — светлая, иначе белый заголовок сливается с белым текстом шапки
  function upd() { h.classList.toggle('is-over', scrollY < 4); }
  addEventListener('scroll', upd, { passive: true }); upd();
})();

// чипы плана. Десктоп: каждый ищет свободное место — над точкой, выше на длинной ножке, под точкой, со сдвигом.
// Телефон (до 768): места появляются и гаснут по одному в случайное время, до 5 сразу, без наложений.
(function () {
  var plan = document.querySelector('.plan'); if (!plan) return;
  var chips = [].slice.call(plan.querySelectorAll('.pchip')), lastW = 0;
  var P = ['luna', 'school', 'rest', 'aurora', 'gallery', 'retreat', 'cave', 'shop', 'alpaca', 'club', 'thk', 'music', 'beer', 'venue', 'wedding'];
  var isProj = function (c) { return c.classList.contains('pchip-unit') || c.classList.contains('pchip-bso'); };
  var rank = function (c) { return isProj(c) ? -1 : P.indexOf(c.dataset.k); };
  var order = chips.slice().sort(function (a, b) { return rank(a) - rank(b); });
  var phone = matchMedia('(max-width:767px)'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = 0, seen = false;

  function measure() {
    chips.forEach(function (c) { c.style.setProperty('--dx', '0px'); c.style.setProperty('--lift', '0px'); c.classList.remove('is-below', 'is-off', 'is-hid'); });
    var pr = plan.getBoundingClientRect(), box = plan.querySelector('.pchips').getBoundingClientRect();
    return { pr: pr, list: order.map(function (c) {
      var r = c.getBoundingClientRect(), cs = getComputedStyle(c);
      return { c: c, ax: box.left + parseFloat(cs.left), ay: box.top + parseFloat(cs.top), stem: (box.top + parseFloat(cs.top)) - r.bottom, w: r.width, h: r.height };
    }) };
  }
  function inside(pr, L, T, w, h, m) { return L >= pr.left + m && L + w <= pr.right - m && T >= pr.top + m && T + h <= pr.bottom - m; }
  function clash(kept, L, T, w, h, gap) { return kept.some(function (q) { return L < q.r + gap && q.l < L + w + gap && T < q.b + gap && q.t < T + h + gap; }); }
  function put(o, best) {
    o.c.classList.toggle('is-below', !!best.below);
    o.c.style.setProperty('--lift', best.lift + 'px');
    o.c.style.setProperty('--dx', best.dx.toFixed(1) + 'px');
    return { l: best.L, t: best.T, r: best.L + o.w, b: best.T + o.h };
  }
  // место для подписи: перебор вариантов, первый свободный
  function find(o, pr, kept, tries) {
    var step = o.h + 4, lim = o.w / 2 - 7, dxs = [0, -o.w * .3, o.w * .3, -lim, lim];
    for (var t = 0; t < tries.length; t++) {
      var below = tries[t][0], lift = tries[t][1] * step, T = below ? o.ay + o.stem + lift : o.ay - o.stem - lift - o.h;
      for (var k = 0; k < dxs.length; k++) {
        var L = o.ax - o.w / 2 + dxs[k];
        if (inside(pr, L, T, o.w, o.h, 6) && !clash(kept, L, T, o.w, o.h, 4)) return { below: below, lift: lift, dx: dxs[k], L: L, T: T };
      }
    }
    return null;
  }

  function desktop() {
    var g = measure(), kept = [];
    g.list.forEach(function (o) {
      if (!o.w) return;
      var best = find(o, g.pr, kept, [[0, 0], [0, 1], [1, 0], [0, 2], [1, 1], [0, 3], [1, 2], [0, 4], [0, 5], [1, 3]]);
      if (!best) { o.c.classList.add('is-off'); return; }
      kept.push(put(o, best));
    });
  }

  // телефон: места живут по одному — каждое гаснет и появляется в своё время, на экране до 5, без наложений
  var pool = [], vis = [], g0 = null, fixed = [], lastOff = null, short = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]];
  function mobile() {
    g0 = measure(); fixed = []; pool = []; vis = [];
    g0.list.forEach(function (o) {
      if (!o.w) return;
      if (isProj(o.c)) { var b = find(o, g0.pr, fixed, short); if (b) fixed.push(put(o, b)); return; }
      // спрятанное место тоже стоит внутри плана: своё место без учёта соседей
      var own = find(o, g0.pr, fixed, short); if (!own) { o.c.classList.add('is-off'); return; }
      put(o, own); o.c.classList.add('is-hid'); pool.push(o);
    });
  }
  function rect(o, b) { return { l: b.L, t: b.T, r: b.L + o.w, b: b.T + o.h }; }
  function showOne() {
    var cand = pool.filter(function (o) { return o !== lastOff && !vis.some(function (v) { return v.o === o; }); });
    cand.sort(function () { return Math.random() - .5; });
    for (var k = 0; k < cand.length; k++) {
      var o = cand[k], b = find(o, g0.pr, fixed.concat(vis.map(function (v) { return v.r; })), short);
      if (b) { put(o, b); o.c.classList.remove('is-hid'); vis.push({ o: o, r: rect(o, b) }); return true; }
    }
    return false;
  }
  function hideOne() { var v = vis.shift(); if (v) { v.o.c.classList.add('is-hid'); lastOff = v.o; } }
  function step() {
    // чаще гасим, когда меток уже 5; иногда гасим и при четырёх, чтобы ритм не повторялся
    if (vis.length >= 5 || (vis.length > 3 && Math.random() < .3)) hideOne(); else if (!showOne()) hideOne();
    timer = setTimeout(step, 600 + Math.random() * 1200);
  }
  // десктоп: при первом показе плана метки проявляются вразнобой
  var revealed = false;
  function reveal() {
    if (revealed || phone.matches) return; revealed = true;
    if (still) return;
    chips.forEach(function (c) {
      if (c.classList.contains('is-off')) return;
      c.classList.add('is-hid');
      setTimeout(function () { c.classList.remove('is-hid'); }, (isProj(c) ? 0 : 250) + Math.random() * 1400);
    });
  }
  function run() {
    clearTimeout(timer); timer = 0;
    if (seen) reveal();
    if (!phone.matches || !g0) return;
    if (still) { while (vis.length < 5 && showOne()); return; }
    if (document.hidden || !seen) return;
    timer = setTimeout(step, 300 + Math.random() * 500);
  }
  function fit() { if (phone.matches) mobile(); else { g0 = null; desktop(); } run(); }

  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { seen = e[0].isIntersecting; run(); }).observe(plan);
  else seen = true;
  document.addEventListener('visibilitychange', run);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  addEventListener('load', fit);
  addEventListener('resize', function () { if (innerWidth !== lastW) { lastW = innerWidth; requestAnimationFrame(fit); } });
})();

/* переход по якорю: блок, который влезает в экран, встаёт целиком, ближе к середине, но не выше своего фона;
   высокий блок встаёт заголовком под шапку с отступом 40 (на телефоне 24) */
(function () {
  var hdr = document.querySelector('.hdr');
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');

  function spot(el) {
    var box = el.querySelector(':scope > .container') || el;
    var top0 = hdr ? hdr.offsetHeight : 0;
    var gap = innerWidth < 600 ? 24 : 40;
    var r = box.getBoundingClientRect();
    var free = innerHeight - top0;
    // не выше своего фона: сверху не должен выглядывать соседний блок
    var cs = getComputedStyle(el), room = r.top - el.getBoundingClientRect().top;
    var prev = el.previousElementSibling;
    if (parseFloat(cs.paddingTop) < gap && prev) room += parseFloat(getComputedStyle(prev).paddingBottom) || 0;
    var y = scrollY + r.top - top0 - (r.height + gap * 2 <= free ? Math.max(gap, Math.min((free - r.height) / 2, room)) : gap);
    return Math.max(0, Math.min(Math.round(y), document.documentElement.scrollHeight - innerHeight));
  }
  function target(hash) {
    if (!hash || hash === '#' || hash === '#top') return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { return null; }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var hash = a.getAttribute('href'), el = target(hash);
    if (!el && hash !== '#top' && hash !== '#') return;
    e.preventDefault();
    var top = el ? spot(el) : 0;
    scrollTo({ top: top, behavior: calm && calm.matches ? 'auto' : 'smooth' });
    if (history.pushState) history.pushState(null, '', el ? hash : location.pathname + location.search);
    if (el) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  });

  /* открыли ссылку с #якорем или вернулись «назад»: ставим блок так же, без анимации */
  var touched = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    addEventListener(ev, function () { touched = true; }, { once: true, passive: true });
  });
  function place() {
    var el = target(location.hash);
    if (el && !touched) scrollTo({ top: spot(el), behavior: 'auto' });
  }
  if (location.hash.length > 1) addEventListener('load', function () { place(); setTimeout(place, 500); });
  addEventListener('popstate', function () { touched = false; place(); });
})();
