/* ═══════════════════════════════════════════════════════════
   CREA — WEB · SONIDO DEL CHAT
   Sonidos sintetizados (Web Audio) al estilo asistente de voz:
   · abrir el chat   · "pensando" mientras escribe   · respuesta
   Sin archivos externos. Se respeta el silencio del usuario.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'crea-chat-sound';
  var muted = false;
  try { muted = localStorage.getItem(KEY) === 'off'; } catch (e) {}

  var ICON_ON  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a4 4 0 0 1 0 7"/><path d="M19 6a8 8 0 0 1 0 12"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M22 9l-5 6M17 9l5 6"/></svg>';

  /* ── motor de audio ──────────────────────────────────────── */
  var ctx = null;
  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  }
  function resume() { var c = audio(); if (c && c.state === 'suspended') c.resume(); }
  var masterGain = null;
  function master() {
    var c = audio(); if (!c) return null;
    if (!masterGain) { masterGain = c.createGain(); masterGain.gain.value = 0.5; masterGain.connect(c.destination); }
    return masterGain;
  }

  /* un tono con envolvente suave */
  function tone(opts) {
    var c = audio(); if (!c || muted) return;
    var out = master(); if (!out) return;
    var t0 = c.currentTime + (opts.delay || 0);
    var dur = opts.dur || 0.15;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.f0, t0);
    if (opts.f1) osc.frequency.exponentialRampToValueAtTime(opts.f1, t0 + dur);
    var peak = (opts.gain == null) ? 0.2 : opts.gain;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (opts.attack || 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(out);
    osc.start(t0); osc.stop(t0 + dur + 0.03);
  }

  var SND = {
    open: function () {            /* bip ascendente al activar el asistente */
      tone({ f0: 523.25, f1: 659.25, dur: 0.12, gain: 0.17 });
      tone({ f0: 783.99, dur: 0.17, gain: 0.15, delay: 0.10 });
    },
    send: function () {            /* tick breve al enviar */
      tone({ f0: 880, f1: 620, dur: 0.08, type: 'triangle', gain: 0.10 });
    },
    reply: function () {           /* dos notas cálidas al recibir respuesta */
      tone({ f0: 659.25, dur: 0.13, gain: 0.17 });
      tone({ f0: 987.77, dur: 0.22, gain: 0.15, delay: 0.10 });
    }
  };

  /* pulso suave continuo mientras "piensa" */
  var thinkTimer = null;
  function startThinking() {
    if (thinkTimer || muted) return;
    function pulse() { tone({ f0: 246.94, f1: 277.18, dur: 0.5, gain: 0.055, attack: 0.18 }); }
    pulse();
    thinkTimer = setInterval(pulse, 760);
  }
  function stopThinking() { if (thinkTimer) { clearInterval(thinkTimer); thinkTimer = null; } }

  /* ── enganche con el chat existente ──────────────────────── */
  var chat  = document.getElementById('chat');
  var fab   = document.getElementById('chatFab');
  var body  = document.getElementById('chatBody');
  var send  = document.getElementById('chatSend');
  var input = document.getElementById('chatInput');

  if (fab)  fab.addEventListener('click', function () { resume(); SND.open(); });
  if (send) send.addEventListener('click', function () { resume(); if (input && input.value.trim()) SND.send(); });
  if (input) input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && input.value.trim()) { resume(); SND.send(); }
  });
  if (chat) chat.querySelectorAll('.chat__chip').forEach(function (c) {
    c.addEventListener('click', function () { resume(); SND.send(); });
  });

  /* observar el cuerpo del chat: typing → pensar · mensaje bot → respuesta */
  if (body) {
    var mo = new MutationObserver(function (muts) {
      var typing = !!body.querySelector('.msg--typing');
      if (typing) startThinking(); else stopThinking();
      muts.forEach(function (m) {
        for (var i = 0; i < m.addedNodes.length; i++) {
          var n = m.addedNodes[i];
          if (n.nodeType === 1 && n.classList && n.classList.contains('msg--bot') && !n.classList.contains('msg--typing')) {
            SND.reply();
          }
        }
      });
    });
    mo.observe(body, { childList: true });
  }

  /* ── toggle de silencio en la cabecera del chat ──────────── */
  var head = chat && chat.querySelector('.chat__head');
  var closeBtn = document.getElementById('chatClose');
  if (head && closeBtn) {
    var btn = document.createElement('button');
    btn.className = 'chat__sound';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Activar o silenciar los sonidos del chat');
    function render() {
      btn.innerHTML = muted ? ICON_OFF : ICON_ON;
      btn.classList.toggle('is-muted', muted);
      btn.title = muted ? 'Sonidos silenciados' : 'Sonidos activados';
    }
    btn.addEventListener('click', function () {
      muted = !muted;
      try { localStorage.setItem(KEY, muted ? 'off' : 'on'); } catch (e) {}
      if (muted) { stopThinking(); }
      else { resume(); SND.open(); }
      render();
    });
    head.insertBefore(btn, closeBtn);
    render();
  }
})();
