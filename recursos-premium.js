/* ═══════════════════════════════════════════════════════════
   CREA · RECURSOS — CAPA PREMIUM v2 (JS)
   Parallax con scroll · titular palabra a palabra · tilt 3D ·
   botones magnéticos · indicador deslizante de categorías ·
   re-entrada al filtrar · cortina en imágenes.
   Complementa recursos.js — no lo reemplaza.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noHover = window.matchMedia('(hover: none)').matches;
  var SPRING = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /* ───────── 1 · TITULAR PALABRA A PALABRA (blur-in escalonado) ───────── */
  function splitWords(title) {
    if (!title || title.dataset.split) return;
    title.dataset.split = '1';
    title.classList.remove('reveal'); // que el control lo lleven las palabras
    var nodes = Array.prototype.slice.call(title.childNodes);
    var frag = document.createDocumentFragment();
    var i = 0, lastWord = null;
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (part === '') return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          // puntuación suelta (".", "," …): se pega a la palabra anterior
          if (lastWord && !/[\p{L}\p{N}]/u.test(part)) { lastWord.textContent += part; return; }
          var s = document.createElement('span');
          s.className = 'word'; s.textContent = part;
          s.style.setProperty('--i', i++);
          frag.appendChild(s);
          lastWord = s;
        });
      } else if (node.nodeName === 'BR') {
        frag.appendChild(node);
      } else { // span.ac u otros inline
        node.classList.add('word');
        node.style.setProperty('--i', i++);
        frag.appendChild(node);
        lastWord = node;
      }
    });
    title.innerHTML = '';
    title.appendChild(frag);
    title.classList.add('split');
  }

  var heroTitle = document.querySelector('.rhero__title');
  var newsTitle = document.querySelector('.rnews__title.reveal');
  if (!reduce) { splitWords(heroTitle); splitWords(newsTitle); }

  // revelar al entrar en viewport
  var wio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); wio.unobserve(e.target); } });
  }, { threshold: 0.2 });
  [heroTitle, newsTitle].forEach(function (t) { if (t && t.classList.contains('split')) wio.observe(t); });
  // hero visible de entrada
  requestAnimationFrame(function () { if (heroTitle && heroTitle.classList.contains('split')) heroTitle.classList.add('in'); });

  /* ───────── 2 · PARALLAX DEL HERO Y NEWSLETTER ───────── */
  var rhero = document.querySelector('.rhero');
  var rnews = document.querySelector('.rnews');
  var parTicking = false;
  function parallax() {
    parTicking = false;
    if (rhero) {
      var r = rhero.getBoundingClientRect();
      var h = rhero.offsetHeight || 1;
      var p = Math.min(1, Math.max(0, -r.top / h));
      rhero.style.setProperty('--p', p.toFixed(4));
    }
    if (rnews) {
      var r2 = rnews.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var pn = Math.min(1, Math.max(0, (vh - r2.top) / (vh + r2.height)));
      rnews.style.setProperty('--pn', pn.toFixed(4));
    }
  }
  function onScrollPar() { if (!parTicking) { parTicking = true; requestAnimationFrame(parallax); } }
  if (!reduce && (rhero || rnews)) {
    window.addEventListener('scroll', onScrollPar, { passive: true });
    window.addEventListener('resize', parallax, { passive: true });
    parallax();
  }

  /* ───────── 3 · LUZ QUE SIGUE AL CURSOR (secciones navy) ───────── */
  [rhero, rnews].forEach(function (sec) {
    if (!sec || noHover) return;
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      sec.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      sec.style.setProperty('--cy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
    sec.addEventListener('pointerenter', function () { sec.classList.add('lit'); });
    sec.addEventListener('pointerleave', function () { sec.classList.remove('lit'); });
  });

  /* ───────── 4 · TILT 3D EN TARJETAS ───────── */
  if (!noHover && !reduce) {
    document.querySelectorAll('.feat__card, .post, .fcard').forEach(function (el) {
      var max = el.classList.contains('feat__card') ? 4.5 : 6.5;
      var rafId = null, nx = 0, ny = 0;
      function apply() {
        rafId = null;
        el.style.setProperty('--ry', (nx * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-ny * max).toFixed(2) + 'deg');
      }
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        nx = (e.clientX - r.left) / r.width - 0.5;
        ny = (e.clientY - r.top) / r.height - 0.5;
        if (!rafId) rafId = requestAnimationFrame(apply);
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ───────── 5 · BOTONES MAGNÉTICOS ───────── */
  if (!noHover && !reduce) {
    document.querySelectorAll('.funnel__cta .btn, .rnews__form .btn').forEach(function (btn) {
      btn.classList.add('magnetic');
      var label = document.createElement('span');
      label.className = 'btn__label';
      while (btn.firstChild) label.appendChild(btn.firstChild);
      btn.appendChild(label);
      var rafId = null, tx = 0, ty = 0;
      function apply() {
        rafId = null;
        btn.style.transform = 'translate(' + (tx * 0.22).toFixed(1) + 'px,' + (ty * 0.3).toFixed(1) + 'px)';
        label.style.transform = 'translate(' + (tx * 0.1).toFixed(1) + 'px,' + (ty * 0.14).toFixed(1) + 'px)';
      }
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        tx = e.clientX - r.left - r.width / 2;
        ty = e.clientY - r.top - r.height / 2;
        if (!rafId) rafId = requestAnimationFrame(apply);
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
        label.style.transform = '';
      });
    });
  }

  /* ───────── 6 · CATEGORÍAS: indicador deslizante + re-entrada ───────── */
  var wrap = document.querySelector('.rcats__wrap');
  if (wrap) {
    var ind = document.createElement('span');
    ind.className = 'rcat__ind';
    wrap.insertBefore(ind, wrap.firstChild);
    var cats = wrap.querySelectorAll('.rcat');

    function moveInd(btn, instant) {
      if (!btn) return;
      if (instant) ind.style.transition = 'none';
      ind.style.setProperty('--ind-x', btn.offsetLeft + 'px');
      ind.style.setProperty('--ind-y', btn.offsetTop + 'px');
      ind.style.setProperty('--ind-w', btn.offsetWidth + 'px');
      ind.style.setProperty('--ind-h', btn.offsetHeight + 'px');
      if (instant) requestAnimationFrame(function () { ind.style.transition = ''; });
    }
    var current = wrap.querySelector('.rcat.on') || cats[0];
    moveInd(current, true);

    cats.forEach(function (btn) {
      btn.addEventListener('click', function () {
        current = btn;
        moveInd(btn);
        // re-entrada escalonada de las tarjetas visibles
        if (reduce) return;
        var vis = document.querySelectorAll('.post:not(.is-hidden)');
        vis.forEach(function (p, i) {
          p.animate(
            [{ opacity: 0, transform: 'translateY(16px) scale(.985)' }, { opacity: 1, transform: 'none' }],
            { duration: 460, delay: i * 45, easing: SPRING, fill: 'backwards' }
          );
        });
      });
    });
    window.addEventListener('resize', function () { moveInd(current, true); }, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { moveInd(current, true); });
    }
    window.addEventListener('load', function () { moveInd(current, true); });
  }

  /* ───────── 7 · BARRA STICKY: estado “pinned” ───────── */
  var rcats = document.querySelector('.rcats');
  if (rcats && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (e) {
      rcats.classList.toggle('stuck', e[0].intersectionRatio < 1);
    }, { threshold: [1] });
    so.observe(rcats);
  }

  /* ───────── 8 · CORTINA EN IMÁGENES DE LAS TARJETAS ───────── */
  if (!reduce) {
    var imgObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-img'); imgObs.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.post').forEach(function (p) { imgObs.observe(p); });
  } else {
    document.querySelectorAll('.post').forEach(function (p) { p.classList.add('in-img'); });
  }
})();
