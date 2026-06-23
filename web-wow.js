/* ═══════════════════════════════════════════════════════════
   CREA — WEB · WOW LAYER · interacciones
   count-ups · botones magnéticos · dock de conversión
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── count-up: anima el primer nodo numérico dentro de un elemento ── */
  function countUp(el, dur) {
    var nodes = el.childNodes, target = null;
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].textContent;
      if (/\d/.test(t)) { target = nodes[i]; break; }
    }
    if (!target) return;
    var raw = target.textContent;
    var m = raw.match(/\d+/);
    if (!m) return;
    var num = parseInt(m[0], 10);
    var pre = raw.slice(0, m.index), post = raw.slice(m.index + m[0].length);
    if (reduce || num <= 1) return;
    var t0 = null;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      var val = Math.round(num * e);
      if (target.nodeType === 3) target.textContent = pre + val + post;
      else target.textContent = pre + val + post;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var ioCount = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      ioCount.unobserve(e.target);
      countUp(e.target, 1400);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat__v, .voice--metric .v').forEach(function (el) { ioCount.observe(el); });

  /* ── botones magnéticos (solo cursor fino) ── */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      var raf = null;
      btn.addEventListener('pointermove', function (ev) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = btn.getBoundingClientRect();
          var dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
          var dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
          btn.style.transform = 'translate(' + (dx * 6).toFixed(1) + 'px,' + (dy * 5 - 2).toFixed(1) + 'px)';
          raf = null;
        });
      });
      btn.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        btn.style.transform = '';
      });
    });
  }

  /* ── dock de conversión: aparece tras el hero, se esconde en contacto ── */
  var dock = document.getElementById('dock');
  if (dock) {
    var nearContact = false;
    var contacto = document.getElementById('contacto');
    var footer = document.querySelector('.footer');
    var ioHide = new IntersectionObserver(function (entries) {
      nearContact = entries.some(function (e) { return e.isIntersecting; }) ||
        (contacto && contacto.getBoundingClientRect().top < window.innerHeight) ||
        (footer && footer.getBoundingClientRect().top < window.innerHeight);
      update();
    }, { threshold: 0 });
    if (contacto) ioHide.observe(contacto);
    if (footer) ioHide.observe(footer);

    var ticking = false;
    function update() {
      var y = window.scrollY || window.pageYOffset;
      var show = y > window.innerHeight * 1.1 && !nearContact;
      dock.classList.toggle('show', show);
      dock.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        if (contacto) nearContact = contacto.getBoundingClientRect().top < window.innerHeight;
        update();
        ticking = false;
      });
    }, { passive: true });
    update();
  }
})();
