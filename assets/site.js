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

// план на телефоне листается вбок: стартуем с середины, где основные локации
(function () {
  var p = document.querySelector('.plan');
  if (!p || p.scrollWidth <= p.clientWidth) return;
  p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2;
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
  function upd() { h.classList.toggle('is-over', hero.getBoundingClientRect().bottom > h.offsetHeight); }
  addEventListener('scroll', upd, { passive: true }); upd();
})();

// чипы плана не выходят за края: сдвигаем подпись внутрь, ножка остаётся на точке
(function () {
  var plan = document.querySelector('.plan'); if (!plan) return;
  var chips = [].slice.call(plan.querySelectorAll('.pchip')), lastW = 0, raf = 0;
  var P = ['luna', 'school', 'rest', 'aurora', 'gallery', 'retreat', 'cave', 'shop', 'alpaca'];
  var rank = function (c) { return c.classList.contains('pchip-unit') ? -1 : P.indexOf(c.dataset.k); };
  var order = chips.slice().sort(function (a, b) { return rank(a) - rank(b); });
  function fit() {
    raf = 0;
    var pr = plan.getBoundingClientRect(), m = 8;
    chips.forEach(function (c) { c.style.setProperty('--dx', '0px'); c.style.visibility = ''; });
    var dx = chips.map(function (c) {
      var r = c.getBoundingClientRect(); if (!r.width) return 0;
      var s = 0, lim = r.width / 2 - 14;
      if (r.left < pr.left + m) s = pr.left + m - r.left; else if (r.right > pr.right - m) s = pr.right - m - r.right;
      return Math.max(-lim, Math.min(lim, s));
    });
    chips.forEach(function (c, i) { if (dx[i]) c.style.setProperty('--dx', dx[i].toFixed(1) + 'px'); });
    // налезающие друг на друга: остаётся более важный, второй прячется
    var kept = [];
    order.forEach(function (c) {
      var r = c.getBoundingClientRect(); if (!r.width) return;
      var hit = kept.some(function (q) { return r.left < q.right + 4 && q.left < r.right + 4 && r.top < q.bottom + 2 && q.top < r.bottom + 2; });
      c.style.visibility = hit ? 'hidden' : '';
      if (!hit) kept.push(r);
    });
  }
  function later() { if (!raf) raf = requestAnimationFrame(fit); }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  addEventListener('resize', function () { if (innerWidth !== lastW) { lastW = innerWidth; later(); } });
  plan.addEventListener('scroll', later, { passive: true });
})();
