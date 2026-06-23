/* ═══════════════════════════════════════════════════════════
   CREA — WEB · CAPA MÁGICA · comportamiento
   ojos del peluche que siguen el cursor · modo "pensando"
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── ojos que siguen el cursor ─────────────────────────── */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var raf = null, mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(aim);
    }, { passive: true });

    function aim() {
      raf = null;
      if (document.body.classList.contains('plush-think')) return;
      var plushes = document.querySelectorAll('.plush');
      for (var i = 0; i < plushes.length; i++) {
        var p = plushes[i];
        var r = p.getBoundingClientRect();
        if (!r.width) continue;
        var dx = mx - (r.left + r.width / 2);
        var dy = my - (r.top + r.height / 2);
        var d = Math.max(1, Math.hypot(dx, dy));
        var k = Math.min(1, d / 160);
        p.style.setProperty('--ex', (dx / d * 1.8 * k).toFixed(2) + 'px');
        p.style.setProperty('--ey', (dy / d * 1.6 * k).toFixed(2) + 'px');
      }
    }
  }

  /* ── modo "pensando" cuando el bot tipea ───────────────── */
  var chatBody = document.getElementById('chatBody');
  var chatStatus = document.querySelector('.chat__id span');
  var statusOriginal = chatStatus ? chatStatus.textContent : '';

  if (chatBody) {
    var mo = new MutationObserver(function () {
      var thinking = !!chatBody.querySelector('.msg--typing');
      document.body.classList.toggle('plush-think', thinking);
      if (chatStatus) chatStatus.textContent = thinking ? 'Pensando…' : statusOriginal;
    });
    mo.observe(chatBody, { childList: true, subtree: true });
  }

  /* ── compañero de viaje: salta y habla por sección ──────── */
  var buddy = document.getElementById('chatFab');
  var bubble = document.getElementById('buddyBubble');
  if (buddy && bubble) {
    var MSGS = [
      ['top',          '¡Hola! Soy el asistente de CREA ✦'],
      ['manifesto',    'Esto es lo que creemos.'],
      ['servicios',    'Cada servicio tiene su plan. Tocá uno.'],
      ['proyectos',    'Marcas reales, sistemas reales.'],
      ['producciones', 'Esto lo grabamos nosotros ✦'],
      ['about',        'Diez años haciendo esto.'],
      ['combos',       'El sistema completo vive acá.'],
      ['metodo',       'Tres pasos. Sin vueltas.'],
      ['casos',        'No lo decimos nosotros…'],
      ['founder',      'Él es Elías, el de la idea ✦'],
      ['faq',          '¿Dudas? Tocame y te respondo.'],
      ['contacto',     '¿Hablamos? Es gratis ✦']
    ];
    var seen = {};
    var current = '';
    var bubbleTimer = null;
    var defaultMsg = '¿Hablamos? ✦';

    function say(text, ms) {
      bubble.textContent = text;
      buddy.classList.add('say');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () {
        buddy.classList.remove('say');
        setTimeout(function () { bubble.textContent = defaultMsg; }, 350);
      }, ms || 3200);
    }
    function hop() {
      if (reduce) return;
      buddy.classList.remove('hop');
      void buddy.offsetWidth;
      buddy.classList.add('hop');
      setTimeout(function () { buddy.classList.remove('hop'); }, 750);
    }

    var secEls = MSGS.map(function (m) { return [document.getElementById(m[0]), m[0], m[1]]; })
                     .filter(function (m) { return !!m[0]; });
    var sRaf = null;
    function watchSections() {
      sRaf = null;
      var mid = window.innerHeight * 0.5;
      var found = null;
      for (var i = 0; i < secEls.length; i++) {
        var r = secEls[i][0].getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) { found = secEls[i]; break; }
      }
      if (found && found[1] !== current) {
        current = found[1];
        if (buddy.style.display !== 'none' && buddy.classList.contains('show')) {
          hop();
          if (!seen[current]) { seen[current] = 1; say(found[2], 3400); }
        }
      }
    }
    window.addEventListener('scroll', function () {
      if (!sRaf) sRaf = requestAnimationFrame(watchSections);
    }, { passive: true });

    /* nudge ocasional si nadie le habla */
    var nudges = 0;
    setInterval(function () {
      if (nudges >= 3) return;
      if (buddy.style.display === 'none' || !buddy.classList.contains('show')) return;
      if (buddy.classList.contains('say')) return;
      nudges++;
      hop();
      say(defaultMsg, 2800);
    }, 32000);
  }
})();
