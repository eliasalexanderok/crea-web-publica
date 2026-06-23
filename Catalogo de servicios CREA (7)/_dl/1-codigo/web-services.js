/* ═══════════════════════════════════════════════════════════
   CREA — WEB · servicios puntuales (panel flotante con planes)
   Datos: catálogo oficial · sin precios exactos —
   el presupuesto se cierra en la Sesión Estratégica.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WA = '5491139261873';

  /* Cada plan:
     name · mod (modalidad) · pop (recomendado)
     ideal: para quién es / qué problema resuelve
     feats: entregables concretos (lista)
     best:  línea de remate opcional (resultado) */
  var SVC = {
    cm: {
      eyebrow: 'Servicio · 01',
      name: 'Community Manager',
      tag: 'Tu marca presente y profesional todos los días — con estrategia, no improvisando.',
      intro: 'Elegí según cuánta presencia necesitás cada mes. Todos incluyen copy, calendario y reporte; cambia el volumen y la capa de optimización.',
      plans: [
        { name: 'Pack Crea', mod: 'Mensual · entrada', ideal: 'Recién ordenás tu presencia y querés dejar de improvisar.',
          feats: ['8 posteos de feed al mes', '30 historias', 'Copy estratégico + calendario editorial', 'Reporte mensual de resultados'] },
        { name: 'Pack Expande', mod: 'Mensual · crecimiento', ideal: 'Ya publicás seguido y querés ganar alcance y ritmo.',
          feats: ['10 posteos de feed al mes', '50 historias', 'Copy + calendario editorial', 'Reporte mensual de resultados'] },
        { name: 'Pack Posiciona', pop: true, mod: 'Mensual · recomendado', ideal: 'Querés convertir la presencia en posicionamiento real de marca.',
          feats: ['12 posteos de feed + 60 historias', 'Copy + calendario editorial', 'Reporte mensual', 'Optimización continua con datos'],
          best: 'El plan completo: presencia, constancia y mejora mes a mes.' }
      ]
    },
    contenido: {
      eyebrow: 'Servicio · 02',
      name: 'Contenido + Producción',
      tag: 'Desde editar lo que grabás vos, hasta que vayamos, grabemos y dirijamos todo por vos.',
      intro: 'Dos caminos: nos pasás tu material y lo editamos, o producimos todo nosotros — vos solo aparecés.',
      plans: [
        { name: 'Edición · Plan Inicia', mod: 'Mensual · vos grabás', ideal: 'Grabás vos y necesitás edición profesional y prolija.',
          feats: ['8 videos editados al mes', '2 reuniones de seguimiento', 'Seguimiento creativo'] },
        { name: 'Edición · Plan Impulsa', mod: 'Mensual · vos grabás', ideal: 'Querés volumen y una línea editorial clara y constante.',
          feats: ['12 videos editados al mes', '4 reuniones de seguimiento', 'Estrategia de contenido'] },
        { name: 'Crea Studio', pop: true, mod: 'Mensual · llave en mano', ideal: 'No querés ni grabar: que vayamos, dirijamos y editemos por vos.',
          feats: ['8 videos producidos y editados', 'Grabación + dirección en estudio', 'Planificación de contenido', 'Dirección creativa'],
          best: 'Producción completa sin que muevas un dedo.' },
        { name: 'Crea Boost', mod: 'Mensual · tope', ideal: 'Buscás el máximo volumen con dirección integral.',
          feats: ['16 videos producidos y editados', 'Estrategia + dirección creativa', 'Optimización continua'] }
      ]
    },
    paid: {
      eyebrow: 'Servicio · 03',
      name: 'Paid Media',
      tag: 'Tu inversión publicitaria gestionada por expertos. Que cada peso trabaje.',
      intro: 'Elegí la plataforma donde está tu cliente — o combinalas en una sola estrategia.',
      plans: [
        { name: 'Meta Ads · Pack Impulso', mod: 'Mensual', ideal: 'Querés empezar a pautar en Instagram y Facebook con criterio.',
          feats: ['Estrategia + estructura de campañas', 'Segmentación + optimización', 'Reporte mensual', '1 call de revisión'] },
        { name: 'Google Ads · Pack Escala', mod: 'Mensual', ideal: 'Tu cliente te busca activamente y querés aparecer primero.',
          feats: ['Estrategia de palabras clave', 'Campañas en buscador', 'Optimización + reporte', '2 calls de revisión'] },
        { name: 'Mercado Ads', mod: 'Mensual · nuevo', ideal: 'Vendés en Mercado Libre y querés más visibilidad y ventas.',
          feats: ['Product Ads dentro de Mercado Libre', 'Segmentación + optimización de ACOS', 'Reporte mensual', 'Usa tus publicaciones — sin creativos'] },
        { name: 'Combo Ads · Meta + Google', pop: true, mod: 'Mensual · recomendado', ideal: 'Querés cubrir todo el recorrido: descubrimiento y búsqueda.',
          feats: ['Redes + buscadores en una sola estrategia', 'Gestión combinada de campañas', 'Reporte completo + insights'],
          best: 'La estrategia integral: te encuentran y te buscan.' }
      ],
      note: 'La gestión no incluye la inversión publicitaria ni los creativos — esos los sumás con un combo o una producción.'
    },
    branding: {
      eyebrow: 'Servicio · 04',
      name: 'Branding + Identidad',
      tag: 'Que tu marca transmita lo que vale, en todos los canales.',
      intro: 'Desde ordenar la estética de tus redes hasta construir la identidad completa de tu marca.',
      plans: [
        { name: 'Social Media Branding', mod: 'Proyecto · único', ideal: 'Querés ordenar y profesionalizar la estética de tus redes.',
          feats: ['Manual visual para redes', 'Paleta + tipografías', 'Estilo fotográfico', '7 aplicaciones + piezas IG'] },
        { name: 'Pack Crea Marca', pop: true, mod: 'Proyecto · recomendado', ideal: 'Estás creando o relanzando tu marca desde la estrategia.',
          feats: ['Investigación + competencia + FODA', 'Buyer persona + moodboard', 'Tono de marca + slogan opcional', '3 propuestas de logo'],
          best: 'La base estratégica y visual de toda tu marca.' },
        { name: 'Pack Premium Crea', mod: 'Proyecto · multicanal', ideal: 'Querés una identidad completa, lista para aplicar en todo.',
          feats: ['Todo lo del Pack Crea Marca', 'Manual completo + archivos finales', 'Mockups + banner web', 'Animación de logo 2D'] }
      ]
    },
    produccion: {
      eyebrow: 'Servicio · 05',
      name: 'Producción Visual',
      tag: 'Una jornada de producción profesional, llave en mano: foto y video que venden.',
      intro: 'Jornadas y producciones puntuales según lo que tu marca necesite mostrar.',
      plans: [
        { name: 'Producción interior CABA', pop: true, mod: 'Jornada · a cotizar', ideal: 'Necesitás material profesional para todo el mes en un día.',
          feats: ['4 horas de producción', 'Dirección creativa + iluminación', 'Asistencia + retoque', '30 fotos + 3 reels + backstage'],
          best: 'Un día de rodaje, contenido para semanas.' },
        { name: 'Producción exterior CABA', mod: 'Jornada · a cotizar', ideal: 'Querés grabar en tu local, showroom o a cielo abierto.',
          feats: ['Misma producción en tu locación', 'Dirección + iluminación + asistencia', 'Retoque + selección final', 'Viáticos fuera de CABA aparte'] },
        { name: 'Fotoproducto', mod: 'Único · a cotizar', ideal: 'Vendés productos y necesitás fotos que vendan por vos.',
          feats: ['Dirección creativa + iluminación', '4 perfiles por producto', 'Retoque + selección'] },
        { name: 'Gastronomía', mod: 'Único · a cotizar', ideal: 'Tenés un negocio gastronómico y querés dar hambre con la vista.',
          feats: ['Dirección creativa + iluminación', 'Modelo de manos', '100 fotos editadas', 'Retoque profesional'] }
      ]
    },
    web: {
      eyebrow: 'Servicio · 06',
      name: 'Web & E-commerce',
      tag: 'Desde una landing que convierte hasta tu Tienda Nube y tu Mercado Libre vendiendo desde el día uno.',
      intro: 'Elegí según dónde querés cerrar la venta: una página, una web institucional o una tienda completa.',
      plans: [
        { name: 'Landing Page', mod: 'Proyecto · a cotizar', ideal: 'Necesitás una página que convierta visitas en consultas.',
          feats: ['UX/UI a medida + hero + beneficios', 'Testimonios + CTA', 'Mobile + formulario', 'Integración con WhatsApp'] },
        { name: 'Web Institucional', mod: 'Proyecto · recomendado', ideal: 'Querés una web seria que represente a todo tu negocio.',
          feats: ['Arquitectura + UX/UI', 'Hasta 5 secciones', 'Mobile + SEO básico', 'WhatsApp + autogestión'] },
        { name: 'Tienda Nube llave en mano', pop: true, mod: 'Proyecto · empezá a vender', ideal: 'Querés empezar a vender online cuanto antes, sin vueltas.',
          feats: ['Diseño con tu identidad', 'Pagos y envíos configurados', 'Hasta 30 productos cargados', 'Capacitación para autogestionarla'],
          best: 'Tu tienda lista para facturar desde el día uno.' },
        { name: 'Mercado Libre + Mercado Ads', mod: 'Proyecto + mensual', ideal: 'Querés profesionalizar y potenciar tu cuenta de Mercado Libre.',
          feats: ['Hasta 20 publicaciones optimizadas', 'Trabajo de reputación', 'Pauta con Product Ads gestionada mes a mes'] },
        { name: 'E-commerce a medida', mod: 'Proyecto · a cotizar', ideal: 'Tu negocio necesita una tienda propia, hecha a medida.',
          feats: ['Tienda + categorías + productos base', 'Pagos + envíos', 'Analytics + pixel', 'SEO básico'] },
        { name: 'Gestión & mantenimiento', mod: 'Mensual', ideal: 'Ya tenés tienda o web y la querés siempre al día.',
          feats: ['Carga de productos', 'Precios y stock actualizados', 'Banners y campañas', 'Soporte + actualizaciones'] }
      ],
      note: 'Plan de plataforma (Tienda Nube), dominio, comisiones de Mercado Libre y pasarelas corren por cuenta del cliente. El presupuesto exacto se cierra en la Sesión Estratégica.'
    },
    email: {
      eyebrow: 'Servicio · 07',
      name: 'Email Marketing',
      tag: 'El canal que el algoritmo no controla — directo a la bandeja de tus clientes.',
      intro: 'Montá el canal, gestionalo todos los meses o automatizá los emails que más venden.',
      plans: [
        { name: 'Setup inicial', mod: 'Único', ideal: 'Querés montar tu canal de email desde cero, bien hecho.',
          feats: ['Configuración de plataforma', 'Plantilla base de marca', 'Segmentos de contactos', 'Primer envío'] },
        { name: 'Gestión mensual', pop: true, mod: 'Mensual · recomendado', ideal: 'Querés venderle a tu base con constancia y estrategia.',
          feats: ['Estrategia + copy + diseño', 'Envío + medición', 'Optimización continua', '2 a 4 envíos por mes'],
          best: 'Tu lista trabajando para vos todos los meses.' },
        { name: 'Flujo automatizado', mod: 'Por flujo', ideal: 'Querés que el email venda solo, en piloto automático.',
          feats: ['Email de bienvenida', 'Carrito abandonado', 'Recuperación de clientes', 'Post-compra'] }
      ]
    },
    ia: {
      eyebrow: 'Servicio · 08 · el diferencial 2026',
      name: 'Posicionamiento en IA',
      tag: 'Que ChatGPT, Gemini y los buscadores con IA te recomienden a vos — no a tu competencia.',
      intro: 'El recorrido para que la inteligencia artificial entienda, confíe y recomiende tu marca.',
      plans: [
        { name: 'Auditoría GEO + AEO', mod: 'Único · a cotizar', ideal: 'Querés saber cómo te ve hoy la IA y por dónde empezar.',
          feats: ['Diagnóstico en motores de IA', 'Oportunidades detectadas', 'Roadmap de acción priorizado'] },
        { name: 'Implementación', mod: 'Proyecto · a cotizar', ideal: 'Querés que la IA entienda y cite tu marca correctamente.',
          feats: ['Estructura semántica + entidades', 'FAQs + schema', 'Activos optimizados para IA'] },
        { name: 'Retainer mensual', pop: true, mod: 'Mensual · premium', ideal: 'Querés crecer en visibilidad dentro de la IA, mes a mes.',
          feats: ['Seguimiento continuo', 'Contenidos optimizados', 'Optimización + reporte mensual'],
          best: 'Tu marca, cada vez más recomendada por la IA.' }
      ]
    }
  };

  var modal = document.getElementById('svcModal');
  if (!modal) return;
  var elEyebrow = document.getElementById('svcEyebrow');
  var elTitle = document.getElementById('svcTitle');
  var elTag = document.getElementById('svcTag');
  var elPlans = document.getElementById('svcPlans');
  var elWa = document.getElementById('svcWa');
  var elNote = modal.querySelector('.svc__note');
  var elCard = modal.querySelector('.svc__card');
  var elIntro = document.getElementById('svcIntro');
  var elCount = document.getElementById('svcCount');
  var lastFocus = null;

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function waLink(text) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
  }

  function render(key) {
    var s = SVC[key];
    if (!s) return;
    elEyebrow.textContent = s.eyebrow;
    elTitle.textContent = s.name;
    elTag.textContent = s.tag;
    if (elIntro) elIntro.textContent = s.intro || '';
    if (elCount) elCount.textContent = s.plans.length + (s.plans.length === 1 ? ' plan' : ' planes');
    elNote.textContent = s.note || 'El presupuesto exacto se arma a tu medida en la Sesión Estratégica — depende del alcance.';
    elWa.href = waLink('Hola CREA! Me interesa ' + s.name + '. ¿Me ayudás a elegir el plan?');

    /* layout: 1 columna si hay pocos planes, 2 si hay 3+ */
    elPlans.classList.toggle('svc__plans--multi', s.plans.length >= 3);

    elPlans.innerHTML = '';
    s.plans.forEach(function (p, i) {
      var card = document.createElement('article');
      card.className = 'splan' + (p.pop ? ' splan--pop' : '');
      card.style.setProperty('--i', i);

      var html = '';
      html += '<div class="splan__top">';
      html += '<span class="splan__num">' + String(i + 1).padStart(2, '0') + '</span>';
      html += '<span class="splan__name">' + esc(p.name) + '</span>';
      if (p.pop) html += '<span class="splan__badge">★ Recomendado</span>';
      html += '</div>';

      html += '<span class="splan__mod">' + esc(p.mod) + '</span>';

      if (p.ideal) {
        html += '<p class="splan__ideal"><b>Ideal si:</b> ' + esc(p.ideal) + '</p>';
      }

      var feats = p.feats || (p.inc ? [p.inc] : []);
      if (feats.length) {
        html += '<ul class="splan__feats">';
        feats.forEach(function (f) {
          html += '<li>' + CHECK + '<span>' + esc(f) + '</span></li>';
        });
        html += '</ul>';
      }

      if (p.best) {
        html += '<p class="splan__best">' + esc(p.best) + '</p>';
      }

      html += '<a class="splan__cta" target="_blank" rel="noopener" href="' +
        waLink('Hola CREA! Me interesa el plan ' + p.name + ' (' + s.name + ').') +
        '">Lo quiero <span class="arrow">→</span></a>';

      card.innerHTML = html;
      elPlans.appendChild(card);
    });
  }

  function openModal(key, trigger) {
    render(key);
    lastFocus = trigger || null;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (elCard) elCard.scrollTop = 0;
    var c = modal.querySelector('.svc__close');
    if (c) setTimeout(function () { c.focus(); }, 60);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('.cat[data-svc], .nav__drop-item[data-svc]').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.dataset.svc, btn); });
  });
  modal.querySelectorAll('[data-svc-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
