/* ════════════════════════════════════════════════════════════
   CREA · Lazy-load de videos
   - Mantiene "eager" solo los videos arriba del pliegue (hero).
   - Al resto le saca el src + autoplay y lo carga recién cuando
     está por entrar en pantalla. Pausa cuando sale.
   - Corta el autoplay simultáneo que disparaba ~60MB en la home.
   ════════════════════════════════════════════════════════════ */
(function () {
  function init() {
    var vids = [].slice.call(document.querySelectorAll('video'));
    if (!vids.length) return;
    var vh = window.innerHeight || 800;

    vids.forEach(function (v) {
      v.muted = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('webkit-playsinline', '');

      var rect = v.getBoundingClientRect();
      var aboveFold = rect.top < vh * 1.15 && rect.bottom > -10 && rect.width > 0;

      if (aboveFold) {
        /* Hero / arriba del pliegue: lo dejamos cargar y reproducir ya. */
        if (v.preload === 'none') v.preload = 'auto';
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
        v.setAttribute('data-lazy-eager', '1');
        return;
      }

      /* Resto: lo desconectamos hasta que se acerque. */
      var src = v.getAttribute('src');
      if (src) {
        v.setAttribute('data-src', src);
        v.removeAttribute('src');
      }
      v.removeAttribute('autoplay');
      v.preload = 'none';
      try { v.load(); } catch (e) {}
    });

    function ensure(v) {
      if (!v.getAttribute('src') && v.getAttribute('data-src')) {
        v.setAttribute('src', v.getAttribute('data-src'));
        try { v.load(); } catch (e) {}
      }
    }

    if (!('IntersectionObserver' in window)) {
      vids.forEach(function (v) {
        if (v.getAttribute('data-lazy-eager')) return;
        ensure(v);
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          ensure(v);
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else {
          try { v.pause(); } catch (err) {}
        }
      });
    }, { rootMargin: '250px 0px', threshold: 0.01 });

    vids.forEach(function (v) {
      if (v.getAttribute('data-lazy-eager')) return;
      io.observe(v);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
