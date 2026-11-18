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
  // в самом верху прозрачная; листаем по первому экрану — тёмное стекло (заголовок не попадает под текст шапки); ниже — светлая
  function upd() { h.classList.toggle('is-over', hero.getBoundingClientRect().bottom > h.offsetHeight); h.classList.toggle('is-top', scrollY < 4); }
  addEventListener('scroll', upd, { passive: true }); upd();
})();

// чипы плана. Десктоп: каждый ищет свободное место — над точкой, выше на длинной ножке, под точкой, со сдвигом.
// Телефон (до 768): BSO и Space City видны всегда, места сменяются группами по 3 раз в 3 с; в группе никто ни на кого не налезает.
(function () {
  var plan = document.querySelector('.plan'); if (!plan) return;
  var chips = [].slice.call(plan.querySelectorAll('.pchip')), lastW = 0;
  var P = ['luna', 'school', 'rest', 'aurora', 'gallery', 'retreat', 'cave', 'shop', 'alpaca'];
  var isProj = function (c) { return c.classList.contains('pchip-unit') || c.classList.contains('pchip-bso'); };
  var rank = function (c) { return isProj(c) ? -1 : P.indexOf(c.dataset.k); };
  var order = chips.slice().sort(function (a, b) { return rank(a) - rank(b); });
  var phone = matchMedia('(max-width:767px)'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var groups = [], gi = 0, timer = 0, seen = false;

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

  function mobile() {
    var g = measure(), fixed = [], short = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]];
    groups = [];
    g.list.forEach(function (o) {
      if (!o.w) return;
      if (isProj(o.c)) { var b = find(o, g.pr, fixed, short); if (b) fixed.push(put(o, b)); return; }
      // в первую группу, где хватает места и меньше 3 меток; иначе новая группа
      for (var i = 0; i <= groups.length; i++) {
        if (!groups[i]) groups[i] = { items: [], rects: [] };
        var G = groups[i]; if (G.items.length >= 3) continue;
        var best = find(o, g.pr, fixed.concat(G.rects), short);
        if (best) { G.items.push({ o: o, best: best }); G.rects.push({ l: best.L, t: best.T, r: best.L + o.w, b: best.T + o.h }); return; }
        if (!G.items.length) { groups.pop(); o.c.classList.add('is-off'); return; } // места нет даже в пустой группе
      }
    });
    groups = groups.filter(function (G) { return G.items.length; });
    groups.forEach(function (G, i) { G.items.forEach(function (it) { put(it.o, it.best); it.o.c.dataset.g = i; it.o.c.classList.add('is-hid'); }); });
    gi = 0; show();
  }
  function show() {
    groups.forEach(function (G, i) { G.items.forEach(function (it) { it.o.c.classList.toggle('is-hid', i !== gi); }); });
  }
  // сначала гаснет текущая группа, потом проявляется следующая — полупрозрачные метки не встречаются
  function tick() { if (groups.length < 2) return; groups[gi].items.forEach(function (it) { it.o.c.classList.add('is-hid'); }); gi = (gi + 1) % groups.length; setTimeout(show, 550); }
  function run() {
    clearInterval(timer); timer = 0;
    if (!phone.matches || still || document.hidden || !seen || groups.length < 2) return;
    timer = setInterval(tick, 3000);
  }
  function fit() { if (phone.matches) mobile(); else { groups = []; desktop(); } run(); }

  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { seen = e[0].isIntersecting; run(); }).observe(plan);
  else seen = true;
  document.addEventListener('visibilitychange', run);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  addEventListener('load', fit);
  addEventListener('resize', function () { if (innerWidth !== lastW) { lastW = innerWidth; requestAnimationFrame(fit); } });
})();
