/* ═══════════════════════════════════════════════════════════
   CREA · RECURSOS — CAPA EDITORIAL (JS)
   Fecha viva en el masthead · contadores por categoría ·
   count-up de métricas. Complementa recursos.js / premium.js.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1 · FECHA VIVA EN EL MASTHEAD ── */
  var dateEl = document.getElementById('mastDate');
  if (dateEl) {
    try {
      var d = new Date();
      var s = d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      // Capitalizar primera letra (es-AR lo da en minúscula)
      dateEl.textContent = s.charAt(0).toUpperCase() + s.slice(1);
    } catch (e) { /* fallback estático ya en el HTML */ }
  }

  /* ── 2 · CONTADORES POR CATEGORÍA ── */
  var cats = document.querySelectorAll('.rcat');
  var posts = document.querySelectorAll('.post[data-cat]');
  if (cats.length && posts.length) {
    cats.forEach(function (btn) {
      var f = btn.getAttribute('data-filter');
      var n = 0;
      posts.forEach(function (p) {
        var c = (p.getAttribute('data-cat') || '').split(' ');
        if (f === 'all' || c.indexOf(f) !== -1) n++;
      });
      if (n > 0) {
        var ct = document.createElement('i');
        ct.className = 'rcat__ct';
        ct.textContent = n;
        btn.appendChild(ct);
      }
    });
  }

  /* ── 3 · COUNT-UP DE MÉTRICAS ── */
  var counters = document.querySelectorAll('.count-up[data-count]');
  if (counters.length) {
    if (reduce) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          cio.unobserve(el);
          var target = parseInt(el.getAttribute('data-count'), 10) || 0;
          var start = null, dur = 1100;
          function tick(ts) {
            if (start === null) start = ts;
            var p = Math.min(1, (ts - start) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ── 4 · BUSCADOR DEL ARCHIVO (combina con la categoría activa) ── */
  var searchEl = document.getElementById('gridSearch');
  var allPosts = document.querySelectorAll('.post[data-cat]');
  var emptyEl = document.querySelector('.posts-empty');
  if (searchEl && allPosts.length) {
    var applyFilter = function () {
      var q = (searchEl.value || '').trim().toLowerCase();
      var on = document.querySelector('.rcat.on');
      var cat = on ? on.getAttribute('data-filter') : 'all';
      var shown = 0;
      allPosts.forEach(function (p) {
        var inCat = cat === 'all' || (p.getAttribute('data-cat') || '').split(' ').indexOf(cat) !== -1;
        var inText = !q || (p.textContent || '').toLowerCase().indexOf(q) !== -1;
        var show = inCat && inText;
        p.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });
      if (emptyEl) emptyEl.classList.toggle('show', shown === 0);
    };
    searchEl.addEventListener('input', applyFilter);
    document.querySelectorAll('.rcat').forEach(function (b) {
      b.addEventListener('click', function () { requestAnimationFrame(applyFilter); });
    });
  }
})();
