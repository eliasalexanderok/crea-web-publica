/* ═══════════════════════════════════════════════════════════
   CREA — WEB · CAPA CINE · comportamiento
   1) intro de bienvenida (una vez por sesión)
   2) rail de producciones ligado al scroll (estilo vitrina)
   3) scrub de palabras del manifiesto
   4) captura de email (una vez por visitante)
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ════ 1 · INTRO DE BIENVENIDA ════ */
  var INTRO_KEY = 'creaIntroV2';
  var intro = document.getElementById('intro');
  var introDone = false;

  function finishIntro() {
    if (introDone) return;
    introDone = true;
    document.body.classList.remove('intro-lock');
    document.body.classList.add('intro-done');
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) {}
    if (intro) {
      intro.classList.add('lift');
      setTimeout(function () { intro.classList.add('gone'); }, 980);
    }
    startLeadTimers();
  }

  (function initIntro() {
    var seen = false;
    try { seen = !!sessionStorage.getItem(INTRO_KEY); } catch (e) {}
    if (!intro || reduce || seen) {
      if (intro) intro.classList.add('gone');
      introDone = true;
      document.body.classList.add('intro-done');
      startLeadTimers();
      return;
    }
    document.body.classList.add('intro-lock');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { intro.classList.add('play'); });
    });
    setTimeout(finishIntro, 3500);
    intro.addEventListener('click', finishIntro);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        finishIntro();
        document.removeEventListener('keydown', onKey);
      }
    });
  })();

  /* ════ 2 · RAIL DE PRODUCCIONES ════ */
  var reel = document.getElementById('producciones');
  var rail = document.getElementById('reelRail');
  if (reel && rail) {
    var mqStatic = window.matchMedia('(max-width: 859px), (pointer: coarse)');
    var maxShift = 0, current = 0, target = 0, raf = null;

    function measure() {
      if (mqStatic.matches) {
        reel.style.height = '';
        rail.style.transform = '';
        return;
      }
      var styles = getComputedStyle(rail);
      var padR = parseFloat(styles.paddingRight) || 0;
      var w = rail.getBoundingClientRect().width;
      maxShift = Math.max(0, w - window.innerWidth);
      reel.style.height = Math.round(maxShift + window.innerHeight * 1.6) + 'px';
    }

    function frame() {
      raf = null;
      if (mqStatic.matches) return;
      var rect = reel.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom < -200 || rect.top > vh + 200) { current = target; applyShift(); return; }
      var total = reel.offsetHeight - vh;
      var p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      target = -maxShift * p;
      reel.classList.toggle('scrubbing', p > 0.03);
      current += (target - current) * (reduce ? 1 : 0.16);
      if (Math.abs(target - current) < 0.4) current = target;
      applyShift();
      if (current !== target) queue();
    }
    function applyShift() {
      rail.style.transform = 'translate3d(' + current.toFixed(1) + 'px,0,0)';
    }
    function queue() { if (!raf) raf = requestAnimationFrame(frame); }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', function () { measure(); queue(); }, { passive: true });
    if (mqStatic.addEventListener) mqStatic.addEventListener('change', function () { measure(); queue(); });
    window.addEventListener('load', function () { measure(); queue(); });
    measure(); queue();

    /* videos del rail: play / pause según visibilidad (todos) */
    var vids = [].slice.call(reel.querySelectorAll('video'));
    if (vids.length) {
      vids.forEach(function (vid) {
        var trimEnd = parseFloat(vid.getAttribute('data-trim-end')) || 0;
        if (trimEnd > 0) {
          vid.loop = false;
          vid.addEventListener('timeupdate', function () {
            if (vid.duration && vid.currentTime >= vid.duration - trimEnd) {
              vid.currentTime = 0;
              var pp = vid.play(); if (pp && pp.catch) pp.catch(function () {});
            }
          });
        }
      });
      var ioVid = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
          else e.target.pause();
        });
      }, { threshold: 0.25 });
      vids.forEach(function (vid) { ioVid.observe(vid); });
    }
  }

  /* ════ 3 · MANIFIESTO · SCRUB DE PALABRAS ════ */
  var mTitle = document.querySelector('.manifesto__title');
  if (mTitle && !reduce) {
    (function wrapWords(node) {
      var children = Array.prototype.slice.call(node.childNodes);
      children.forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span');
            s.className = 'mw';
            s.textContent = part;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR' && !child.classList.contains('mw')) {
          wrapWords(child);
        }
      });
    })(mTitle);

    var words = mTitle.querySelectorAll('.mw');
    var mTick = false;
    function scrub() {
      if (mTick) return;
      mTick = true;
      requestAnimationFrame(function () {
        mTick = false;
        var rect = mTitle.getBoundingClientRect();
        var vh = window.innerHeight;
        var start = vh * 0.9, end = vh * 0.3;
        var p = clamp((start - rect.top) / (start - end), 0, 1);
        var lit = p * words.length;
        for (var i = 0; i < words.length; i++) {
          var o = clamp(lit - i, 0, 1);
          words[i].style.setProperty('--wo', (0.16 + 0.84 * o).toFixed(3));
        }
      });
    }
    window.addEventListener('scroll', scrub, { passive: true });
    scrub();
  }

  /* ════ 4 · CAPTURA DE EMAIL ════ */
  /* Para conectar con tu herramienta (Mailchimp, Brevo, Google Sheets…):
     pegá acá la URL del webhook / form action y listo. Mientras esté vacío,
     los datos quedan registrados en el navegador (localStorage: creaLeadsLog). */
  var LEAD_ENDPOINT = '';
  var LEAD_KEY = 'creaLeadV2';
  var leadcap = document.getElementById('leadcap');
  var leadShown = false;

  function leadStatus() {
    try { return localStorage.getItem(LEAD_KEY) || ''; } catch (e) { return ''; }
  }
  function openLead() {
    if (!leadcap || leadShown || leadStatus()) return;
    leadShown = true;
    leadcap.classList.add('open');
    leadcap.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var first = leadcap.querySelector('input');
    if (first) setTimeout(function () { first.focus(); }, 350);
  }
  function closeLead(markDismissed) {
    if (!leadcap) return;
    leadcap.classList.remove('open');
    leadcap.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (markDismissed) { try { localStorage.setItem(LEAD_KEY, 'dismissed'); } catch (e) {} }
  }

  function startLeadTimers() {
    if (!leadcap || leadStatus()) return;
    /* aparece a los 18 s o al 45 % de scroll — lo que pase primero */
    setTimeout(openLead, 18000);
    var onScroll = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && (window.scrollY || window.pageYOffset) / h > 0.45) {
        openLead();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (leadcap) {
    leadcap.querySelectorAll('[data-leadcap-close]').forEach(function (el) {
      el.addEventListener('click', function () { closeLead(true); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && leadcap.classList.contains('open')) closeLead(true);
    });

    var form = document.getElementById('leadcapForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = {
          nombre: (form.querySelector('[name="nombre"]') || {}).value || '',
          email: (form.querySelector('[name="email"]') || {}).value || '',
          fecha: new Date().toISOString(),
          origen: 'web'
        };
        if (!data.email) return;
        try {
          var log = JSON.parse(localStorage.getItem('creaLeadsLog') || '[]');
          log.push(data);
          localStorage.setItem('creaLeadsLog', JSON.stringify(log));
          localStorage.setItem(LEAD_KEY, 'subscribed');
        } catch (err) {}
        if (LEAD_ENDPOINT) {
          try {
            fetch(LEAD_ENDPOINT, {
              method: 'POST', mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }).catch(function () {});
          } catch (err) {}
        }
        var ok = leadcap.querySelector('.leadcap__ok');
        var formWrap = leadcap.querySelectorAll('.leadcap__eyebrow, .leadcap__title, .leadcap__sub, .leadcap__form, .leadcap__fine');
        formWrap.forEach(function (el) { el.style.display = 'none'; });
        if (ok) ok.hidden = false;
      });
    }
  }
})();
