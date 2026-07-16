/* ═══════════════════════════════════════════════════════════
   CREA — WEB · driver de los mockups animados de Servicios
   Reproduce la animación de cada mockup al entrar en vista
   y cada vez que se cambia de servicio (tab / sidebar).
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(val, dec, prefix, suffix) {
    var n;
    if (dec > 0) {
      n = val.toFixed(dec);
    } else {
      n = Math.round(val);
      if (n >= 1000) n = n.toLocaleString('es-AR');
    }
    return (prefix || '') + n + (suffix || '');
  }

  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var dec = parseInt(el.dataset.dec || '0', 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = fmt(target, dec, prefix, suffix); return; }
    var dur = 1300, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, dec, prefix, suffix);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target, dec, prefix, suffix);
    }
    requestAnimationFrame(step);
  }

  function clearTimers(el) {
    if (el._mkTimers) { el._mkTimers.forEach(clearTimeout); }
    el._mkTimers = [];
  }

  function play(mock) {
    if (!mock) return;
    // reinicia la animación CSS
    clearTimers(mock);
    mock.classList.remove('play');
    mock.querySelectorAll('.mk-pstage.lit').forEach(function (s) { s.classList.remove('lit'); });
    void mock.offsetWidth; // reflow
    mock.classList.add('play');

    // contadores
    mock.querySelectorAll('[data-count]').forEach(animateCount);

    // pipeline de producción: encender etapas en secuencia
    var stages = mock.querySelectorAll('.mk-prodpipe .mk-pstage');
    if (stages.length) {
      var delays = [450, 1050, 1650, 2200];
      stages.forEach(function (st, i) {
        if (reduce) { st.classList.add('lit'); return; }
        mock._mkTimers.push(setTimeout(function () { st.classList.add('lit'); }, delays[i] || 450));
      });
    }

    // video real de producción: arrancarlo al reproducir
    var pv = mock.querySelector('.mk-prodvid video');
    if (pv) {
      if (!pv.getAttribute('src') && pv.getAttribute('data-src')) {
        pv.setAttribute('src', pv.getAttribute('data-src'));
        try { pv.load(); } catch (e) {}
      }
      var pr = pv.play(); if (pr && pr.catch) pr.catch(function () {});
    }

    // tienda web: demo de compra — el producto "vuela" al carrito y suma
    var cartN = mock.querySelector('.mk-web-cart__n');
    var cart  = mock.querySelector('.mk-web-cart');
    var cards = mock.querySelectorAll('.mk-pcard');
    if (cartN && cards.length) {
      cartN.textContent = '0';
      if (reduce) { cartN.textContent = String(cards.length); }
      else {
        var frame = mock.querySelector('.mk-web-frame') || mock;
        cards.forEach(function (c, i) {
          mock._mkTimers.push(setTimeout(function () {
            // pulso en el producto
            c.classList.add('adding');
            setTimeout(function () { c.classList.remove('adding'); }, 500);
            // punto que vuela del producto al carrito
            if (cart && frame.getBoundingClientRect) {
              var fr = frame.getBoundingClientRect();
              var cr = c.getBoundingClientRect();
              var tr = cart.getBoundingClientRect();
              var dot = document.createElement('span');
              dot.className = 'mk-flydot';
              dot.style.left = (cr.left - fr.left + cr.width / 2 - 5) + 'px';
              dot.style.top  = (cr.top  - fr.top  + cr.height / 2 - 5) + 'px';
              frame.appendChild(dot);
              requestAnimationFrame(function () {
                dot.style.transform = 'translate(' +
                  (tr.left - cr.left + (tr.width - cr.width) / 2) + 'px,' +
                  (tr.top  - cr.top  + (tr.height - cr.height) / 2) + 'px) scale(0.4)';
                dot.style.opacity = '0.15';
              });
              setTimeout(function () { dot.remove(); }, 620);
            }
            // sumar y rebotar el contador
            setTimeout(function () {
              cartN.textContent = String(i + 1);
              if (cart) {
                cart.classList.remove('bump');
                void cart.offsetWidth;
                cart.classList.add('bump');
              }
            }, 480);
          }, 900 + i * 620));
        });
      }
    }
  }

  function mockFor(key) {
    var panel = document.querySelector('[data-srv-panel="' + key + '"]');
    return panel ? panel.querySelector('.mock .mk-ads, .mock .mk-brand, .mock .mk-prod, .mock .mk-web') : null;
  }

  // al cambiar de servicio
  document.querySelectorAll('[data-srv-btn],[data-srv-tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      var key = b.dataset.srvBtn || b.dataset.srvTab;
      setTimeout(function () { play(mockFor(key)); }, 40);
    });
  });

  // primera reproducción cuando la sección entra en vista
  var sec = document.getElementById('servicios');
  if (sec) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var active = document.querySelector('.srv__panel.on');
          if (active) play(mockFor(active.dataset.srvPanel));
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(sec);
  }
})();
