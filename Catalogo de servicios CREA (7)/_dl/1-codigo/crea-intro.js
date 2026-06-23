/* ═══════════════════════════════════════════════════════════
   CREA — INTRO CINEMÁTICA · controlador (compartido)
   Una vez por sesión. Skip con click / Esc / Enter / Space.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'creaIntroV3';
  var el = document.getElementById('creaIntro');
  if (!el) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = !!sessionStorage.getItem(KEY); } catch (e) {}

  function markDone() { document.body.classList.add('intro-done'); }

  if (reduce || seen) {
    el.classList.add('is-gone');
    markDone();
    return;
  }

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    document.body.classList.remove('crea-intro-lock');
    el.classList.add('is-leaving');
    markDone();
    setTimeout(function () { el.classList.add('is-gone'); }, 1150);
  }

  document.body.classList.add('crea-intro-lock');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { el.classList.add('is-playing'); });
  });

  /* sale solo a los 3 s — o cuando el usuario lo saltea */
  setTimeout(finish, 3000);
  el.addEventListener('click', finish);
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      finish();
      document.removeEventListener('keydown', onKey);
    }
  });
})();
