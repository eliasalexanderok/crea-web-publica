/* ═══════════════════════════════════════════════════════════
   CREA · RECURSOS — COVER STORY ROTATIVO
   Rota notas destacadas y, cada tanto, promociona servicios.
   Autoplay con pausa al hover, dots + teclado, respeta reduce-motion.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var grid = document.getElementById('cover');
  if (!grid) return;

  var elKicker = document.getElementById('covKicker');
  var elTitle  = document.getElementById('covTitle');
  var elDeck   = document.getElementById('covDeck');
  var elByline = document.getElementById('covByline');
  var elLink   = document.getElementById('covLink');
  var elRead   = document.getElementById('covRead');
  var elMedia  = document.getElementById('covMedia');
  var elTag    = document.getElementById('covTag');
  var elIc     = document.getElementById('covIc');
  var elPhLab  = document.getElementById('covPhLab');
  var elDots   = document.getElementById('covDots');
  var lead     = grid.querySelector('.ecover__lead');

  var icCamera = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2.5"></rect><circle cx="8.5" cy="9.5" r="1.6"></circle><path d="M21 16l-5-5L5 20"></path></svg>';
  var icSystem = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="6" r="2.5"></circle><circle cx="18" cy="6" r="2.5"></circle><circle cx="12" cy="18" r="2.5"></circle><path d="M8 7l3 9M16 7l-3 9M8.5 6h7"></path></svg>';

  function bylineNote(av, name, role, date, read) {
    var avatar = av
      ? '<img class="avatar avatar--lg" src="' + av + '" alt="' + name + '">'
      : '<span class="avatar avatar--lg avatar--mono avatar--red">' + name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('') + '</span>';
    return avatar +
      '<span class="ecover__who"><b>' + name + '</b><span>' + role + '</span></span>' +
      '<span class="bdot"></span><span class="bmeta">' + date + '</span>' +
      '<span class="bdot"></span><span class="bmeta">' + read + '</span>';
  }
  function bylineService() {
    return '<span class="avatar avatar--lg avatar--mono">★</span>' +
      '<span class="ecover__who"><b>CREA</b><span>Trabajá con nosotros</span></span>' +
      '<span class="bdot"></span><span class="bmeta">El sistema completo</span>';
  }

  var slides = [
    {
      kicker: '<b>Historia de tapa</b> · IA & GEO',
      title: 'Que <span class="ac">ChatGPT</span> recomiende tu marca',
      deck: 'El SEO clásico ya no alcanza. Cada vez más gente le pregunta a una IA “¿qué agencia me conviene?” en lugar de googlear. Qué es el GEO y cómo empezar a aparecer en esas respuestas — el diferencial real de 2026.',
      byline: bylineNote('assets/elias-plano-medio.png', 'Elías Alexander', 'Estrategia & IA', '28 May 2026', '9 min de lectura'),
      href: 'recurso-posicionamiento-ia-geo.html', linkText: 'Leer la guía', read: 'Guía · Nivel intermedio',
      tag: 'Nuevo · 2026', ic: icCamera, phLab: 'Imagen de tapa<br><b>1600 × 1200 · GEO / IA</b>',
      img: 'assets/recursos/geo-featured.png', alt: 'Que ChatGPT recomiende tu marca'
    },
    {
      kicker: '<b>Opinión</b> · IA & Trabajo',
      title: '¿La IA nos va a dejar sin <span class="ac">trabajo</span>?',
      deck: 'La pregunta del año, sin humo ni catástrofe. Qué reemplaza la IA, qué se vuelve más valioso y qué hacer al respecto si vivís de crear o de tu marca.',
      byline: bylineNote('assets/elias-plano-medio.png', 'Elías Alexander', 'Founder de CREA', '20 Jun 2026', '8 min de lectura'),
      href: 'recurso-ia-sin-trabajo.html', linkText: 'Leer la nota', read: 'Opinión · 8 min',
      tag: 'Nota destacada', ic: icCamera, phLab: 'Imagen de tapa<br><b>IA y trabajo</b>',
      img: 'assets/recursos/ia-sin-trabajo.png', alt: '¿La IA nos va a dejar sin trabajo?'
    },
    {
      service: true,
      kicker: '<b>Trabajá con CREA</b> · Servicios',
      title: 'No son piezas sueltas.<br>Es un <span class="ac">sistema</span>.',
      deck: 'Estrategia, contenido, marca, pauta y web — bajo una sola dirección. Dejá de coordinar tres proveedores: somos uno, y todo conversa entre sí.',
      byline: bylineService(),
      href: 'index.html#servicios', linkText: 'Conocé los servicios', read: 'El sistema CREA',
      tag: 'Trabajá con nosotros', ic: icSystem, phLab: 'Imagen<br><b>El sistema CREA</b>'
    },
    {
      kicker: '<b>Estrategia</b> · Emprender',
      title: 'Emprender con poco <span class="ac">presupuesto</span>',
      deck: 'No necesitás plata para empezar: necesitás foco. Doce movimientos concretos para arrancar tu negocio con lo mínimo y crecer con criterio.',
      byline: bylineNote('assets/lucas-plano-medio.png', 'Lucas Iván Rodríguez', 'Paid Media', '18 Jun 2026', '8 min de lectura'),
      href: 'recurso-emprender-poco-presupuesto.html', linkText: 'Leer la guía', read: 'Guía · 8 min',
      tag: 'Guía práctica', ic: icCamera, phLab: 'Imagen de tapa<br><b>Poco presupuesto</b>',
      img: 'assets/recursos/emprender-poco-presupuesto.png', alt: 'Emprender con poco presupuesto'
    },
    {
      kicker: '<b>Contenido</b> · Narrativa',
      title: 'Contá la <span class="ac">historia</span> de tu marca',
      deck: 'Los datos informan; las historias venden. La estructura para que tu marca conecte, se recuerde y te elijan — sin sonar a folleto.',
      byline: bylineNote('assets/elias-plano-medio.png', 'Elías Alexander', 'Estrategia & Contenido', '5 Jun 2026', '7 min de lectura'),
      href: 'recurso-storytelling-marcas.html', linkText: 'Leer la guía', read: 'Guía · 7 min',
      tag: 'Storytelling', ic: icCamera, phLab: 'Imagen de tapa<br><b>Storytelling</b>',
      img: 'assets/recursos/storytelling-marcas.png', alt: 'Contá la historia de tu marca'
    }
  ];

  // construir dots
  slides.forEach(function (s, i) {
    var d = document.createElement('button');
    d.type = 'button';
    d.className = 'ecover__dot' + (i === 0 ? ' on' : '');
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Destacado ' + (i + 1));
    d.addEventListener('click', function () { go(i, true); });
    elDots.appendChild(d);
  });
  var dots = elDots.querySelectorAll('.ecover__dot');

  // imagen de tapa real (se superpone al placeholder cuando existe)
  var elImg = document.createElement('img');
  elImg.className = 'ecover__img';
  elImg.setAttribute('loading', 'eager');
  elImg.setAttribute('decoding', 'async');
  elMedia.insertBefore(elImg, elMedia.firstChild);

  var cur = 0;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function paint(i) {
    var s = slides[i];
    elKicker.innerHTML = s.kicker;
    elTitle.innerHTML = s.title;
    elDeck.textContent = s.deck;
    elByline.innerHTML = s.byline;
    elLink.setAttribute('href', s.href);
    elLink.innerHTML = s.linkText + ' <span class="arrow">→</span>';
    elRead.textContent = s.read;
    elMedia.setAttribute('href', s.href);
    elTag.textContent = s.tag;
    elIc.innerHTML = s.ic;
    elPhLab.innerHTML = s.phLab;
    if (s.img) {
      elImg.src = s.img;
      elImg.alt = s.alt || '';
      elMedia.classList.add('has-img');
    } else {
      elImg.removeAttribute('src');
      elImg.alt = '';
      elMedia.classList.remove('has-img');
    }
    grid.classList.toggle('is-service', !!s.service);
    dots.forEach(function (d, di) { d.classList.toggle('on', di === i); });
  }

  function go(i, userAction) {
    if (i === cur) return;
    cur = (i + slides.length) % slides.length;
    if (reduce) { paint(cur); }
    else {
      lead.classList.add('is-fading');
      elMedia.classList.add('is-fading');
      setTimeout(function () {
        paint(cur);
        lead.classList.remove('is-fading');
        elMedia.classList.remove('is-fading');
      }, 300);
    }
    if (userAction) restart();
  }

  // autoplay
  var timer = null;
  function start() { if (!reduce && !timer) timer = setInterval(function () { go(cur + 1); }, 6500); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  grid.addEventListener('mouseenter', stop);
  grid.addEventListener('mouseleave', start);
  // pausar si la pestaña no está visible
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  paint(0);
  start();
})();
