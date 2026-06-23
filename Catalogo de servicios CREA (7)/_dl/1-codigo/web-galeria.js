/* ═══════════════════════════════════════════════════════════
   CREA — Galería de proyectos · carruseles con crossfade
═══════════════════════════════════════════════════════════ */
(function () {
  var cars = [].slice.call(document.querySelectorAll('[data-carousel]'));
  if (!cars.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  cars.forEach(function (car, idx) {
    var slides = [].slice.call(car.querySelectorAll('.wk__slide'));
    var dots = [].slice.call(car.querySelectorAll('.wk__cardots i'));
    if (slides.length < 2) return;
    var i = 0;

    function advance() {
      slides[i].classList.remove('is-on');
      if (dots[i]) dots[i].classList.remove('is-on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
      if (dots[i]) dots[i].classList.add('is-on');
    }

    // arranque escalonado para que los carruseles no cambien todos a la vez
    setTimeout(function () {
      setInterval(advance, 3000);
    }, idx * 750);
  });
})();
