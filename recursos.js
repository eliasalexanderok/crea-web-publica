/* CREA · Recursos & Blog — interacciones */
(function () {
  'use strict';
  document.body.classList.add('anim');

  /* ── FECHAS RELATIVAS (no se desactualizan al subir) ── */
  (function () {
    var els = document.querySelectorAll('[data-date]');
    if (!els.length) return;
    var now = new Date();
    function rel(str) {
      var d = new Date(str + 'T12:00:00');
      if (isNaN(d)) return null;
      var days = Math.round((now - d) / 86400000);
      if (days <= 0) return 'Hoy';
      if (days === 1) return 'Ayer';
      if (days < 7) return 'Hace ' + days + ' días';
      if (days < 14) return 'Hace 1 semana';
      if (days < 30) return 'Hace ' + Math.floor(days / 7) + ' semanas';
      if (days < 60) return 'Hace 1 mes';
      if (days < 365) return 'Hace ' + Math.floor(days / 30) + ' meses';
      var y = Math.floor(days / 365);
      return 'Hace ' + y + (y === 1 ? ' año' : ' años');
    }
    els.forEach(function (el) {
      var txt = rel(el.getAttribute('data-date'));
      if (txt) { el.textContent = txt; el.setAttribute('datetime', el.getAttribute('data-date')); }
    });
  })();

  /* ── FONDOS DE VIDEO: asegurar reproducción ── */
  var bgVideos = document.querySelectorAll('video.crea-video');
  bgVideos.forEach(function (v) {
    v.muted = true;
    var p = v.play();
    if (p && p.catch) { p.catch(function () {}); }
  });
  // reintento al primer gesto/visibilidad por si el navegador lo bloqueó
  var kick = function () {
    bgVideos.forEach(function (v) { if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
  };
  document.addEventListener('visibilitychange', kick);
  window.addEventListener('pointerdown', kick, { once: true });

  /* ── BARRA DE PROGRESO DE LECTURA ── */
  var progress = document.getElementById('progress');
  if (progress) {
    var updateProgress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── SPOTLIGHT DE CURSOR (Apple / Linear) ── */
  var spotEls = document.querySelectorAll('.post, .fcard');
  spotEls.forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ── NAV: estado scrolled ── */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    var bw = document.getElementById('backweb');
    if (bw) bw.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MENÚ MÓVIL ── */
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mnav.classList.remove('open');
        burger.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── REVEAL on scroll ── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .stagger'));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function (el) { io.observe(el); });
  // Fallback 1: revelar de inmediato lo que ya está en viewport (por si el observer tarda)
  var revealInView = function () {
    var h = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.95 && r.bottom > 0) { el.classList.add('in'); io.unobserve(el); }
    });
  };
  revealInView();
  requestAnimationFrame(revealInView);
  window.addEventListener('load', revealInView);
  // Fallback 2: nada queda invisible nunca (estilos inline, inmunes al throttling de transición)
  var forceShow = function () {
    revealEls.forEach(function (el) {
      el.classList.add('in');
      if (getComputedStyle(el).opacity !== '1') {
        el.style.transition = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
      Array.prototype.forEach.call(el.children, function (c) {
        if (el.classList.contains('stagger') && getComputedStyle(c).opacity !== '1') {
          c.style.transition = 'none'; c.style.opacity = '1'; c.style.transform = 'none';
        }
      });
    });
  };
  setTimeout(forceShow, 1600);

  /* ── FILTRO DE CATEGORÍAS (hub) ── */
  var cats = document.querySelectorAll('.rcat');
  var posts = document.querySelectorAll('.post[data-cat]');
  var empty = document.querySelector('.posts-empty');
  if (cats.length) {
    cats.forEach(function (btn) {
      btn.addEventListener('click', function () {
        cats.forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        var f = btn.getAttribute('data-filter');
        var shown = 0;
        posts.forEach(function (p) {
          var match = f === 'all' || (p.getAttribute('data-cat') || '').split(' ').indexOf(f) !== -1;
          p.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        if (empty) empty.classList.toggle('show', shown === 0);
      });
    });
  }

  /* ── NEWSLETTER ── */
  var nform = document.getElementById('rnewsForm');
  if (nform) {
    nform.addEventListener('submit', function (e) {
      e.preventDefault();
      var wrap = nform.closest('.rnews__col') || nform.parentNode;
      nform.style.display = 'none';
      var ok = wrap.querySelector('.rnews__ok');
      if (ok) ok.classList.add('show');
    });
  }

  /* ── TOC SCROLLSPY (artículo) ── */
  var tocLinks = document.querySelectorAll('.toc__list a');
  if (tocLinks.length) {
    var heads = [];
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var h = document.getElementById(id);
      if (h) heads.push({ a: a, h: h });
    });
    var spy = function () {
      var y = window.scrollY + 120;
      var cur = heads[0];
      heads.forEach(function (o) { if (o.h.offsetTop <= y) cur = o; });
      tocLinks.forEach(function (a) { a.classList.remove('on'); });
      if (cur) cur.a.classList.add('on');
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  /* ── AUTORES: enlazar el nombre a su página de perfil ── */
  var authorPages = { 'Elías Alexander': 'autor-elias-alexander.html', 'Lucas Iván Rodríguez': 'autor-lucas-rodriguez.html' };
  document.querySelectorAll('.authorbox__name, .ahero__who b').forEach(function (el) {
    var name = (el.textContent || '').trim();
    var href = authorPages[name];
    if (href && !el.querySelector('a')) {
      var la = document.createElement('a');
      la.href = href; la.className = 'author-link'; la.textContent = name;
      el.textContent = ''; el.appendChild(la);
    }
  });

  /* ── ¿TE SIRVIÓ? feedback al pie de la nota ── */
  var proseEl = document.querySelector('.article .prose');
  var authorbox = document.querySelector('.authorbox');
  if (proseEl && authorbox && !document.querySelector('.feedback')) {
    var fbKey = 'crea-fb-' + (location.pathname.split('/').pop() || 'nota');
    var fb = document.createElement('div');
    fb.className = 'feedback';
    var already = null;
    try { already = localStorage.getItem(fbKey); } catch (e) {}
    var thanks = function (m) {
      fb.innerHTML = '<span class="feedback__q">¿Te sirvió esta nota?</span><span class="feedback__thanks">' + m + '</span>';
    };
    if (already) {
      thanks('¡Gracias por tu voto!');
    } else {
      fb.innerHTML = '<span class="feedback__q">¿Te sirvió esta nota?</span><div class="feedback__btns"><button class="feedback__btn" type="button" data-v="si">Sí, mucho</button><button class="feedback__btn" type="button" data-v="no">Más o menos</button></div>';
    }
    authorbox.parentNode.insertBefore(fb, authorbox);
    fb.addEventListener('click', function (e) {
      var b = e.target.closest('.feedback__btn');
      if (!b) return;
      try { localStorage.setItem(fbKey, b.getAttribute('data-v')); } catch (e2) {}
      thanks(b.getAttribute('data-v') === 'si' ? '¡Gracias! Nos motiva a seguir.' : '¡Gracias! Lo tendremos en cuenta.');
    });
  }
})();
