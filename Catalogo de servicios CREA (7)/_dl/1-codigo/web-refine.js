/* ═══════════════════════════════════════════════════════════
   CREA — WEB · REFINE LAYER (interacción)
   · spotlight que sigue el cursor en combos, categorías y testimonios
   · tilt 3D en las tarjetas de categoría (“se deslizan con el mouse”)
═══════════════════════════════════════════════════════════ */
(function () {
  function init() {
    // 1 · inyectar el spotlight en cada tarjeta
    document.querySelectorAll('.combo, .cat, .casos .voice').forEach(function (el) {
      if (el.querySelector(':scope > .rf-spot')) return;
      var s = document.createElement('span');
      s.className = 'rf-spot';
      s.setAttribute('aria-hidden', 'true');
      el.insertBefore(s, el.firstChild);
    });

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return;

    function track(el, opts) {
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--sx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--sy', (py * 100).toFixed(1) + '%');
        if (opts.tilt) {
          if (raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(function () {
            var rx = (0.5 - py) * opts.tilt;
            var ry = (px - 0.5) * opts.tilt;
            el.style.transform =
              'perspective(720px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' +
              ry.toFixed(2) + 'deg) translateY(' + opts.lift + 'px)';
          });
        }
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--sx', '50%');
        el.style.setProperty('--sy', '50%');
        if (opts.tilt) el.style.transform = '';
      });
    }

    // categorías: tilt + spotlight (lo que pidió el comentario)
    document.querySelectorAll('.cat').forEach(function (el) {
      track(el, { tilt: 7, lift: -5 });
    });
    // combos y testimonios: solo spotlight (sus transforms ya están coreografiados)
    document.querySelectorAll('.combo').forEach(function (el) { track(el, {}); });
    document.querySelectorAll('.casos .voice:not(.voice--metric)').forEach(function (el) { track(el, {}); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
