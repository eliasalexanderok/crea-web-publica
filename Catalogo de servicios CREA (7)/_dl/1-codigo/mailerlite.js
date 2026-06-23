/* ════════════════════════════════════════════════════════════
   CREA · MailerLite Integration  v1.0
   Maneja suscripciones al newsletter en toda la web.
   Archivos que lo usan: index.html · Recursos.html
════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────
     La suscripción pasa por subscribe.php (mismo dominio). La API
     key vive SOLO en ese archivo del servidor, nunca acá. */
  var ENDPOINT = 'subscribe.php';

  /* ── 1. Alta de suscriptor (vía proxy server-side) ───────── */
  function mlSubscribe(email, nombre, cb) {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, nombre: nombre })
    })
    .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
    .then(function (d) { cb(!!(d && d.ok)); })
    .catch(function (err) {
      console.warn('[CREA·ML] Error de red:', err);
      cb(false);
    });
  }

  /* ── 2. Binder genérico de formulario ───────────────────── */
  function bindForm(form, onDone) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl  = form.querySelector('[name="email"]');
      var nombreEl = form.querySelector('[name="nombre"]');
      var btn      = form.querySelector('[type="submit"]');
      var email    = emailEl  ? emailEl.value.trim()  : '';
      var nombre   = nombreEl ? nombreEl.value.trim() : '';
      if (!email) return;

      if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }

      mlSubscribe(email, nombre, function (ok) {
        if (!ok) console.warn('[CREA·ML] Verificá la API key o revisá la consola de MailerLite.');
        // Guardar estado aunque haya error de red (UX sin fricción)
        try { localStorage.setItem('crea_suscripto', '1'); } catch (_) {}
        onDone();
      });
    });
  }

  /* ── 3. Helpers de estado ───────────────────────────────── */
  function isSub()     { try { return !!localStorage.getItem('crea_suscripto'); }  catch (_) { return false; } }
  function wasClosed() { try { return !!sessionStorage.getItem('crea_lc_closed'); } catch (_) { return false; } }

  /* ══════════════════════════════════════════════════════════
     4. LEADCAP POPUP — index.html
  ══════════════════════════════════════════════════════════ */
  var lc = document.getElementById('leadcap');
  if (lc) {

    function openLC() {
      if (isSub() || wasClosed()) return;
      lc.classList.add('open');
      lc.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeLC() {
      lc.classList.remove('open');
      lc.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      try { sessionStorage.setItem('crea_lc_closed', '1'); } catch (_) {}
    }

    // Disparar: a los 10s ó cuando el usuario llega al 50% de la página
    if (!isSub()) {
      var timer     = setTimeout(openLC, 10000);
      var triggered = false;
      window.addEventListener('scroll', function () {
        if (triggered) return;
        var pct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
        if (pct > 0.5) { triggered = true; clearTimeout(timer); openLC(); }
      }, { passive: true });
    }

    // Cerrar con X, overlay y Escape
    lc.querySelectorAll('[data-leadcap-close]').forEach(function (el) {
      el.addEventListener('click', closeLC);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lc.classList.contains('open')) closeLC();
    });

    // Formulario leadcap
    bindForm(document.getElementById('leadcapForm'), function () {
      var frm  = lc.querySelector('.leadcap__form');
      var fine = lc.querySelector('.leadcap__fine');
      var ok   = lc.querySelector('.leadcap__ok');
      if (frm)  frm.hidden  = true;
      if (fine) fine.hidden = true;
      if (ok)   ok.hidden   = false;
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. NEWSLETTER SECTION — Recursos.html
  ══════════════════════════════════════════════════════════ */
  var rf = document.getElementById('rnewsForm');
  if (rf) {
    var rnewsOk = document.querySelector('.rnews__ok');
    // Si ya estaba suscripto → mostrar estado OK directamente
    if (isSub() && rnewsOk) {
      rf.style.display   = 'none';
      rnewsOk.style.display = 'block';
    }
    bindForm(rf, function () {
      rf.style.display   = 'none';
      if (rnewsOk) rnewsOk.style.display = 'block';
    });
  }

}());
