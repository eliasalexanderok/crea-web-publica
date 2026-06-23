/* ═══════════ CREA — LANDING · interacciones ═══════════ */
(function () {
  'use strict';

  /* habilitar transiciones recién después del primer paint */
  requestAnimationFrame(function () { document.body.classList.add('anim'); });

  /* ── Nav: fondo al hacer scroll ── */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    var waf = document.getElementById('waFloat');
    if (waf) { if (window.scrollY > 640) waf.classList.add('show'); else waf.classList.remove('show'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Reveal on scroll (con fallback robusto) ── */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  function reveal(el) { el.classList.add('in'); }
  function inView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh * 0.92 && r.bottom > 0;
  }
  function checkAll() {
    for (var i = reveals.length - 1; i >= 0; i--) {
      if (inView(reveals[i])) { reveal(reveals[i]); reveals.splice(i, 1); }
    }
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          reveal(e.target); io.unobserve(e.target);
          var idx = reveals.indexOf(e.target); if (idx > -1) reveals.splice(idx, 1);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
  /* fallback: chequeo manual en scroll/resize + al cargar, por si el observer no dispara */
  window.addEventListener('scroll', checkAll, { passive: true });
  window.addEventListener('resize', checkAll);
  checkAll();
  requestAnimationFrame(checkAll);
  setTimeout(checkAll, 200);
  /* failsafe definitivo: nunca dejar contenido oculto */
  setTimeout(function () { reveals.forEach(reveal); reveals.length = 0; }, 1400);

  /* ── Marquee: duplicar para loop sin corte ── */
  var track = document.getElementById('marquee');
  if (track) { track.innerHTML += track.innerHTML; }

  /* ── Video del hero ── */
  /* Cuando tengas el video: poné el archivo en assets/ y seteá data-video
     en #heroVideo (ej: data-video="assets/elias.mp4"), o un embed de YouTube
     con data-embed="https://www.youtube.com/embed/XXXX". */
  var vid = document.getElementById('heroVideo');
  if (vid) {
    vid.addEventListener('click', function () {
      if (vid.classList.contains('is-playing')) return;
      var file = vid.getAttribute('data-video');
      var embed = vid.getAttribute('data-embed');
      if (file) {
        var v = document.createElement('video');
        v.className = 'video__frame'; v.src = file; v.controls = true; v.autoplay = true; v.playsInline = true;
        vid.appendChild(v); vid.classList.add('is-playing');
      } else if (embed) {
        var f = document.createElement('iframe');
        f.className = 'video__frame'; f.src = embed + (embed.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1';
        f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
        vid.appendChild(f); vid.classList.add('is-playing');
      } else {
        /* Sin video todavía: avisamos suavemente */
        var play = vid.querySelector('.video__play');
        if (play && !play.dataset.note) {
          play.dataset.note = '1';
          var cap = vid.querySelector('.video__cap-txt span');
          if (cap) { var prev = cap.textContent; cap.textContent = 'Video próximamente 🎬'; setTimeout(function(){ cap.textContent = prev; }, 2200); }
        }
      }
    });
  }

  /* ── Smooth scroll con offset del nav (fallback si el browser no respeta scroll-padding) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ── Calendario de reserva: días y horarios seleccionables ── */
  var cal = document.getElementById('cal');
  if (cal) {
    var confirmBtn = cal.querySelector('.cal__ph-foot .btn');
    var days = [].slice.call(cal.querySelectorAll('.cal__ph-day')).filter(function (d) { return !d.classList.contains('muted'); });
    var slots = [].slice.call(cal.querySelectorAll('.cal__ph-slot'));
    function curDay() { var a = cal.querySelector('.cal__ph-day.on'); return a ? a.textContent.trim() : '5'; }
    function curSlot() { var a = cal.querySelector('.cal__ph-slot.on'); return a ? a.textContent.trim() : '10:00'; }
    function syncCal() {
      if (!confirmBtn) return;
      var msg = 'Hola CREA, quiero reservar una Sesión Estratégica el ' + curDay() + ' de junio a las ' + curSlot() + ' hs';
      confirmBtn.href = 'https://wa.me/5491139261873?text=' + encodeURIComponent(msg);
    }
    days.forEach(function (d) {
      d.style.cursor = 'pointer';
      d.addEventListener('click', function () {
        days.forEach(function (x) { x.classList.remove('on'); });
        d.classList.add('on'); syncCal();
      });
    });
    slots.forEach(function (s) {
      s.style.cursor = 'pointer';
      s.addEventListener('click', function () {
        slots.forEach(function (x) { x.classList.remove('on'); });
        s.classList.add('on'); syncCal();
      });
    });
    syncCal();
  }

})();
