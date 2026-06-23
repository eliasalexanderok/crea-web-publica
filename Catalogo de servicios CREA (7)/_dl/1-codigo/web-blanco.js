/* ═══════════════════════════════════════════════════════════
   CREA — WEB · BLANCO PREMIUM · JS
   Splash del peluche: animación grande de 2s antes de abrir
   el chat. Debe cargarse ANTES de web-extra.js para poder
   interceptar el click del FAB.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var fab = document.getElementById('chatFab');
  var splash = document.getElementById('buddySplash');
  var msgEl = document.getElementById('buddySplashMsg');
  if (!fab || !splash || !msgEl) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; /* sin splash: el chat abre directo */

  var MSGS = [
    'Hablemos ✦',
    'Te saco todas las dudas',
    'Contame tu idea',
    'Tu marca puede más',
    '¿Arrancamos?'
  ];
  var i = 0;
  var bypass = false;
  var busy = false;

  /* se registra ANTES que el handler de apertura del chat (web-extra.js) */
  fab.addEventListener('click', function (e) {
    if (bypass) { bypass = false; return; } /* segunda pasada: dejar abrir el chat */
    e.preventDefault();
    e.stopImmediatePropagation();
    if (busy) return;
    busy = true;

    msgEl.textContent = MSGS[i % MSGS.length];
    i++;
    splash.classList.add('on');

    setTimeout(function () { splash.classList.remove('on'); }, 1850);
    setTimeout(function () {
      busy = false;
      bypass = true;
      fab.click(); /* ahora sí: abre el chat */
    }, 2000);
  });
})();
