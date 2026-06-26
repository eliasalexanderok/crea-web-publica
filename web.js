/* ═══════════════════════════════════════════════════════════
   CREA — WEB · interacciones
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  document.body.classList.add('anim');

  /* ── scroll reveal (con fallback robusto: nunca dejar texto oculto) ── */
  var reveals = [].slice.call(document.querySelectorAll('.reveal, .stagger'));
  function doReveal(el) { el.classList.add('in'); }
  function inView(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh * 0.94 && r.bottom > 0;
  }
  function checkReveals() {
    for (var i = reveals.length - 1; i >= 0; i--) {
      if (inView(reveals[i])) { doReveal(reveals[i]); reveals.splice(i, 1); }
    }
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          doReveal(e.target); io.unobserve(e.target);
          var idx = reveals.indexOf(e.target); if (idx > -1) reveals.splice(idx, 1);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
    reveals.slice().forEach(function (el) { io.observe(el); });
  }
  /* fallback: chequeo manual en scroll/resize + failsafe definitivo */
  window.addEventListener('scroll', checkReveals, { passive: true });
  window.addEventListener('resize', checkReveals);
  checkReveals();
  requestAnimationFrame(checkReveals);
  setTimeout(checkReveals, 200);
  setTimeout(function () { reveals.forEach(doReveal); reveals.length = 0; }, 1500);

  /* ── ads bars fill when visible ── */
  var ioBar = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.mk-bar i').forEach(function (i) {
          i.style.width = (i.dataset.w || '70') + '%';
        });
        ioBar.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.mk-ads').forEach(function (el) { ioBar.observe(el); });

  /* ── nav scrolled + progress + wa-float ── */
  var nav = document.getElementById('nav');
  var prog = document.getElementById('progress');
  var wa = document.getElementById('waFloat');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (wa) wa.classList.toggle('show', y > 600);
    if (prog) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── mobile menu ── */
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    var closeMnav = function () {
      mnav.classList.remove('open');
      burger.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMnav);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mnav.classList.contains('open')) closeMnav();
    });
  }

  /* ── servicios: sidebar + tabs ── */
  function selectSrv(key) {
    document.querySelectorAll('[data-srv-btn]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.srvBtn === key);
    });
    document.querySelectorAll('[data-srv-tab]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.srvTab === key);
    });
    document.querySelectorAll('[data-srv-panel]').forEach(function (p) {
      p.classList.toggle('on', p.dataset.srvPanel === key);
    });
  }
  document.querySelectorAll('[data-srv-btn],[data-srv-tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      selectSrv(b.dataset.srvBtn || b.dataset.srvTab);
    });
  });

  /* ── manifiesto: fondo interactivo (parallax de scroll + spotlight con el cursor) ── */
  var mBg = document.getElementById('manifestoBg');
  if (mBg) {
    var mSec = document.getElementById('manifesto') || mBg;
    var grid = mBg.querySelector('.manifesto__grid');
    var o1 = mBg.querySelector('.manifesto__orb--1');
    var o2 = mBg.querySelector('.manifesto__orb--2');
    var mReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* spotlight que sigue al puntero */
    var glow = document.createElement('div');
    glow.className = 'manifesto__glow';
    mBg.appendChild(glow);

    var sOff = 0;             // offset de scroll (-1..1)
    var px = 0.5, py = 0.4;   // posición del puntero dentro de la sección (0..1)

    function applyM() {
      var mxp = (px - 0.5) * 2, myp = (py - 0.5) * 2;
      if (grid) grid.style.transform = 'translate(' + (mxp * 14) + 'px,' + (sOff * 40 + myp * 10) + 'px)';
      if (o1) o1.style.transform = 'translate(' + (sOff * 30 + mxp * 48) + 'px,' + (sOff * 50 + myp * 42) + 'px)';
      if (o2) o2.style.transform = 'translate(' + (sOff * -34 - mxp * 42) + 'px,' + (sOff * -42 - myp * 36) + 'px)';
      glow.style.left = (px * 100) + '%';
      glow.style.top = (py * 100) + '%';
    }
    var rafM = null;
    function queueM() { if (!rafM) rafM = requestAnimationFrame(function () { rafM = null; applyM(); }); }

    window.addEventListener('scroll', function () {
      var r = mBg.getBoundingClientRect();
      sOff = ((window.innerHeight - r.top) / (window.innerHeight + r.height) - 0.5) * 2;
      queueM();
    }, { passive: true });

    if (!mReduce && window.matchMedia('(pointer: fine)').matches) {
      mSec.addEventListener('mousemove', function (e) {
        var r = mSec.getBoundingClientRect();
        px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        mBg.classList.add('is-live');
        queueM();
      });
      mSec.addEventListener('mouseleave', function () {
        px = 0.5; py = 0.4; mBg.classList.remove('is-live'); queueM();
      });
    }
    applyM();
  }

  /* ── editorial: parallax de la foto al scrollear ── */
  var eImg = document.getElementById('editorialImg');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (eImg && !reduce) {
    var eHost = eImg.closest('.editorial') || eImg.parentElement;
    var eTick = false;
    function eParallax() {
      if (eTick) return;
      eTick = true;
      requestAnimationFrame(function () {
        var r = eHost.getBoundingClientRect();
        var p = (window.innerHeight - r.top) / (window.innerHeight + r.height); // 0..1
        var off = Math.max(-1, Math.min(1, (p - 0.5) * 2));
        eImg.style.transform = 'translate3d(0,' + (off * -56) + 'px,0) scale(1.12)';
        eTick = false;
      });
    }
    window.addEventListener('scroll', eParallax, { passive: true });
    eParallax();
  }

  /* ── marquee: duplicate for seamless loop ── */
  document.querySelectorAll('.marquee__track').forEach(function (tr) {
    tr.innerHTML += tr.innerHTML;
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq__item');
      var a = item.querySelector('.faq__a');
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(function (it) {
        it.classList.remove('open');
        it.querySelector('.faq__a').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ── hero video: graceful fallback (poster shows if it can't play) ── */
  var hv = document.getElementById('heroVideo');
  if (hv) { var pr = hv.play(); if (pr && pr.catch) pr.catch(function () {}); }

  /* ── hero: profundidad 3D con el cursor (solo la imagen + papeles, el texto queda fijo) ──
        El zoom lento hacia el rostro lo maneja la animación CSS sobre la imagen;
        acá sólo inclinamos el fondo y los papeles en 3D según el cursor. ── */
  var heroEl = document.getElementById('top');
  var heroBg = document.getElementById('heroBg');
  var hDepth = document.getElementById('heroDepth');
  var hReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroEl && heroBg && !hReduce && window.matchMedia('(pointer: fine)').matches) {
    var tmx = 0, tmy = 0, cmx = 0, cmy = 0, hraf = null;
    function hLoop() {
      cmx += (tmx - cmx) * 0.07;
      cmy += (tmy - cmy) * 0.07;
      heroBg.style.transform = 'rotateY(' + (cmx * -1.6) + 'deg) rotateX(' + (cmy * 1.3) + 'deg) translate3d(' + (cmx * -12) + 'px,' + (cmy * -9) + 'px,0)';
      if (hDepth) hDepth.style.transform = 'translate3d(' + (cmx * -50) + 'px,' + (cmy * -38) + 'px,0)';
      if (Math.abs(tmx - cmx) > 0.0005 || Math.abs(tmy - cmy) > 0.0005) { hraf = requestAnimationFrame(hLoop); }
      else { hraf = null; }
    }
    function hKick() { if (!hraf) hraf = requestAnimationFrame(hLoop); }
    heroEl.addEventListener('mousemove', function (e) {
      var r = heroEl.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hKick();
    });
    heroEl.addEventListener('mouseleave', function () { tmx = 0; tmy = 0; hKick(); });
    heroEl.classList.add('is-parallax');
  }

  /* ── cards de proyecto con video: reproducir sólo cuando se ven (mudo + loop) ── */
  var wkVideos = [].slice.call(document.querySelectorAll('.wk__video, .cm3d__video'));
  if (wkVideos.length) {
    wkVideos.forEach(function (v) { v.muted = true; v.setAttribute('playsinline', ''); });
    var ioWk = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { try { v.pause(); } catch (err) {} }
      });
    }, { threshold: 0.25 });
    wkVideos.forEach(function (v) { ioWk.observe(v); });
  }
})();
