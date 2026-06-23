/* ═══════════════════════════════════════════════════════════
   CREA — CEREBRO LOCAL DEL CHAT
   Base de conocimiento + buscador por coincidencia de temas.
   Funciona 100% sin servidor ni IA externa (apto Hostinger / GitHub).
   El chat (web-extra.js) lo usa como motor de respuestas cuando
   no hay una IA disponible en el entorno.

   ▸ CÓMO EDITARLO: cada bloque es un "tema". Cambiá el texto de
     `reply`, agregá formas de preguntar en `keys`, y los botones
     sugeridos en `sugs`. Nada más.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WA = 'https://wa.me/5491139261873?text=';
  function wa(msg) { return WA + encodeURIComponent(msg); }

  /* normaliza: minúsculas, sin acentos, sin signos */
  function norm(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9ñ\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ── BASE DE CONOCIMIENTO ──────────────────────────────────
     keys  : disparadores (se comparan normalizados; las frases
             de 2+ palabras puntúan más alto que las sueltas)
     reply : respuesta (admite **negrita** y [texto](archivo.html))
     sugs  : botones de respuesta rápida (en primera persona)
  ─────────────────────────────────────────────────────────── */
  var KB = [
    {
      id: 'saludo',
      keys: ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'hey', 'holis', 'que tal', 'como va', 'como estas'],
      reply: '¡Hola! 👋 Encantado, soy del equipo de **CREA**. Contame, ¿en qué andás con tu marca? ¿Tenés algo en marcha o estás arrancando?',
      sugs: ['Estoy arrancando', 'Ya tengo redes', 'Quiero ver servicios']
    },
    {
      id: 'gracias',
      keys: ['gracias', 'genial gracias', 'muchas gracias', 'buenisimo gracias', 'perfecto gracias'],
      reply: '¡De nada! 🙌 Cualquier cosa que necesites, acá estoy. ¿Querés que te ayude a dar el primer paso?',
      sugs: ['Agendar una sesión', 'Tengo otra duda', 'Ver servicios']
    },
    {
      id: 'que_hacen',
      keys: ['que hacen', 'que es crea', 'a que se dedican', 'que ofrecen', 'de que se trata', 'que servicios', 'servicios', 'que pueden hacer', 'en que me pueden ayudar'],
      reply: 'En **CREA** no hacemos posteos sueltos: armamos el sistema de comunicación de tu marca — estrategia, contenido, branding, pauta y web, bajo una sola dirección. Para no marearte, ¿qué es lo que más te está costando hoy?',
      sugs: ['Contenido para redes', 'Quiero más clientes', 'Mi marca / branding', 'Necesito una web']
    },
    {
      id: 'community',
      keys: ['community', 'community manager', 'redes', 'redes sociales', 'social media', 'manejo de redes', 'gestion de redes', 'me manejen las redes', 'instagram', 'posteos', 'feed', 'historias', 'no se que publicar'],
      reply: '**Community Manager** es tu marca presente y profesional todos los días: estrategia de contenido, diseño, copy, calendario y reportes mensuales. Lo básico es contenido — la respuesta de mensajes y la producción de video van en los planes Full o se suman aparte. ¿Hoy llevás las redes vos o nadie las toca?',
      sugs: ['¿Cuánto cuesta?', '¿Incluye videos?', 'Quiero esto']
    },
    {
      id: 'contenido',
      keys: ['edicion', 'editar', 'editar video', 'edicion de video', 'editan videos', 'reels', 'reel', 'tiktok', 'contenido', 'crear contenido', 'me editen'],
      reply: 'Hacemos **edición y creación de contenido** pensada para convertir, no solo para que quede lindo: reels, videos cortos, copys y acompañamiento creativo. Si querés, también producimos el material de cero. ¿Ya tenés material crudo o arrancarías de cero?',
      sugs: ['Tengo material', 'Arranco de cero', '¿Cuánto cuesta?']
    },
    {
      id: 'produccion',
      keys: ['produccion', 'grabar', 'grabacion', 'rodaje', 'fotos', 'foto y video', 'fotografia', 'filmar', 'estudio', 'producir', 'producto'],
      reply: 'Producimos **fotos y videos reales** de tu marca o tus productos, con dirección de arte. Las grabaciones presenciales son en **CABA**, o nos enviás los productos al estudio. ¿Qué necesitarías mostrar: producto, servicio o tu cara de marca?',
      sugs: ['Producto', 'Marca personal', 'Quiero coordinar']
    },
    {
      id: 'pauta',
      keys: ['pauta', 'publicidad', 'anuncios', 'ads', 'paid media', 'meta ads', 'google ads', 'campañas', 'campana', 'invertir en publicidad', 'mas clientes', 'mas ventas', 'pautar', 'meta', 'google'],
      reply: '**Paid Media**: gestionamos tus campañas en Meta, Google y TikTok — auditoría, segmentación, estructura, optimización y reportes. Dos cosas a tener claras: el plan base de pauta no incluye los creativos (van aparte o en un combo), y la inversión que se le paga a Meta/Google no está dentro de nuestros honorarios. ¿Ya pautaste antes o sería tu primera vez?',
      sugs: ['Primera vez', 'Ya pauté', '¿Meta o Google?']
    },
    {
      id: 'meta_vs_google',
      keys: ['meta vs google', 'meta o google', 'que conviene meta', 'diferencia meta google', 'instagram o google'],
      reply: 'La diferencia de fondo: en **Google** tu cliente ya está buscando lo que vendés (demanda que existe); en **Meta** todavía no sabe que te necesita (demanda que se crea). No compiten, resuelven momentos distintos — lo ideal suele ser combinarlas. Te dejo el detalle acá: [Meta Ads vs Google Ads](recurso-meta-vs-google-ads.html). ¿Querés que veamos cuál te conviene a vos?',
      sugs: ['¿Cuál me conviene?', 'Quiero pautar', 'Agendar sesión']
    },
    {
      id: 'branding',
      keys: ['branding', 'identidad', 'identidad visual', 'logo', 'rebranding', 'manual de marca', 'paleta', 'imagen de marca', 'diseño de marca', 'marca desde cero', 'crear marca'],
      reply: 'En **Branding** no diseñamos solo un logo: construimos la identidad completa — estrategia, manual de marca, logo, paleta, tipografías y aplicaciones. El logo es apenas una capa de las 5 que tiene una marca que vende. Te dejo esto: [Branding no es tu logo](recurso-branding-no-es-tu-logo.html). ¿Arrancás una marca nueva o querés renovar una que ya existe?',
      sugs: ['Marca nueva', 'Renovar la mía', '¿Cuánto cuesta?']
    },
    {
      id: 'web',
      keys: ['web', 'pagina', 'pagina web', 'sitio', 'sitio web', 'landing', 'ecommerce', 'tienda', 'tienda online', 'tienda nube', 'tiendanube', 'mercado libre', 'mi web no vende', 'sitio no vende'],
      reply: 'Hacemos **web y e-commerce** centrados en conversión: landing pages, sitios institucionales y tiendas online (Tienda Nube / Mercado Libre) llave en mano. Si sentís que tu web actual no vende, suele ser por fugas concretas — te dejo esto: [Tu web no vende: 7 razones](recurso-web-no-vende.html). ¿Qué necesitás: una landing, una web institucional o una tienda?',
      sugs: ['Una landing', 'Web institucional', 'Una tienda online']
    },
    {
      id: 'email',
      keys: ['email', 'mail marketing', 'email marketing', 'newsletter', 'mailing'],
      reply: 'Sí, hacemos **email marketing**: diseño de newsletters y campañas para el canal que sí controlás (tu lista). Funciona muy bien combinado con el contenido de redes. ¿Ya tenés una base de contactos o arrancás a construirla?',
      sugs: ['Tengo lista', 'Arranco de cero', 'Ver combos']
    },
    {
      id: 'ia_geo',
      keys: ['ia', 'inteligencia artificial', 'chatgpt', 'gemini', 'geo', 'aeo', 'seo', 'posicionamiento en ia', 'que me recomiende', 'aparecer en chatgpt'],
      reply: '**Posicionamiento en IA (GEO)** es optimizar tu marca para que ChatGPT, Gemini y demás la entiendan, confíen y la recomienden. El buscador te lista; la IA te elige — y la ventana para ganar ese lugar está abierta ahora. Más acá: [Posicionamiento en IA (GEO)](recurso-posicionamiento-ia-geo.html). ¿Tu cliente ya te busca por nombre o te descubren de cero?',
      sugs: ['Quiero esto', '¿Cómo funciona?', 'Agendar sesión']
    },
    {
      id: 'combos',
      keys: ['combo', 'combos', 'pack', 'packs', 'plan completo', 'todo junto', 'ecosistema', 'sistema completo', 'varios servicios', 'juntar servicios', 'todo el paquete'],
      reply: 'Esa es la idea fuerte de CREA: en vez de contratar piezas sueltas (un CM por acá, un editor por allá), **combinás servicios bajo una sola dirección** y rinde más — ej. Redes + Pauta, o Branding + Web. Un solo equipo, un solo reporte. ¿Dónde sentís que estás hoy: arrancando, vendiendo poco o queriendo escalar?',
      sugs: ['Estoy arrancando', 'Quiero vender más', 'Quiero escalar']
    },
    {
      id: 'precios',
      keys: ['precio', 'precios', 'cuanto sale', 'cuanto cuesta', 'cuanto vale', 'valores', 'tarifa', 'tarifas', 'presupuesto', 'cotizacion', 'cuanto cobran', 'que precio'],
      reply: 'Buena pregunta. En CREA no manejamos paquetes genéricos: armamos la solución **a medida** según el diagnóstico de tu negocio, así no pagás por lo que no necesitás. Para darte un número real lo vemos en una **llamada de descubrimiento gratuita**. ¿Te gustaría que la agendemos? Mientras tanto, esto te puede servir: [¿Cuánto cuesta una marca profesional?](recurso-cuanto-cuesta-marca.html).',
      sugs: ['Agendar la llamada', 'Hablar por WhatsApp', '¿Cómo se paga?']
    },
    {
      id: 'pago',
      keys: ['como se paga', 'formas de pago', 'medios de pago', 'se paga en pesos', 'en dolares', 'pago en pesos', 'pago en dolares', 'usd', 'facturan', 'factura'],
      reply: 'Trabajamos con valores de referencia en **USD**. Si estás en Argentina, pagás en **pesos** al cambio del día; si estás en el exterior, en USD. El detalle fino de cada plan te lo pasamos después de la sesión, ya ajustado a tu marca. ¿Querés que coordinemos esa charla?',
      sugs: ['Agendar sesión', 'Ver servicios', 'Hablar por WhatsApp']
    },
    {
      id: 'permanencia',
      keys: ['permanencia', 'contrato', 'me ato', 'atadura', 'dar de baja', 'cancelar', 'minimo de meses', 'cuanto tiempo me comprometo'],
      reply: 'Tranqui: los servicios mensuales van **mes a mes**, con un aviso de 30 días para dar de baja. Sin ataduras eternas — te quedás porque funciona, no porque firmaste algo. ¿Hay algo puntual que te preocupa antes de arrancar?',
      sugs: ['No, está claro', '¿Cómo empiezo?', 'Agendar sesión']
    },
    {
      id: 'garantias',
      keys: ['garantia', 'garantias', 'garantizan', 'aseguran resultados', 'cuantos seguidores', 'aseguran ventas', 'prometen', 'resultados asegurados'],
      reply: 'Soy honesto: no prometemos un número mágico de seguidores ni de ventas, porque el marketing depende de muchas variables. Lo que sí garantizamos es **trabajo estratégico, honesto y orientado a conversión**, medido mes a mes. ¿Qué resultado sería un éxito para vos?',
      sugs: ['Más ventas', 'Más visibilidad', 'Ordenar mi marca']
    },
    {
      id: 'empezar',
      keys: ['como empiezo', 'por donde empiezo', 'por donde arranco', 'como arranco', 'primer paso', 'como es el proceso', 'como trabajan', 'onboarding', 'metodo', 'como sigo'],
      reply: 'Simple: arrancamos con una **Sesión Estratégica de 30 minutos** (gratis, sin compromiso). Diagnosticamos tu comunicación, vemos el cuello de botella real y te mostramos el camino — empieces o no a trabajar con nosotros. ¿Te gustaría agendarla?',
      sugs: ['Agendar la sesión', '¿Qué me preguntan?', 'Hablar por WhatsApp']
    },
    {
      id: 'agendar',
      keys: ['agendar', 'turno', 'reservar', 'sesion', 'sesion estrategica', 'llamada', 'reunion', 'quiero hablar con alguien', 'hablar con una persona', 'consultoria', 'asesoria', 'mentoria'],
      reply: '¡Genial! La forma más rápida es por WhatsApp y coordinamos ahí mismo el horario. 👉 [Reservá tu Sesión Estratégica](' + wa('Hola CREA, quiero reservar una Sesión Estratégica') + '). ¿Querés contarme algo de tu proyecto antes así llego con contexto?',
      sugs: ['Te cuento', 'Mejor coordino por WhatsApp', 'Ver servicios']
    },
    {
      id: 'quienes',
      keys: ['quienes son', 'quien es elias', 'elias', 'fundador', 'founder', 'equipo', 'historia', 'desde cuando', 'donde estan', 'donde quedan', 'ubicacion', 'son de', 'caba', 'buenos aires'],
      reply: 'CREA es un estudio creativo de **Buenos Aires (CABA)**, fundado por **Elías Alexander**, con más de 10 años y +100 marcas trabajadas. Somos estrategas, creativos y editores bajo una sola dirección. ¿Te interesa por cercanía o por el tipo de trabajo que hacemos?',
      sugs: ['Ver su trabajo', 'Quiero trabajar con ustedes', 'Agendar sesión']
    },
    {
      id: 'contacto',
      keys: ['whatsapp', 'wsp', 'telefono', 'numero', 'mail', 'correo', 'instagram', 'contacto', 'como los contacto', 'redes de ustedes'],
      reply: 'Nos escribís cuando quieras 👇\n• WhatsApp: **+54 9 11 3926-1873**\n• Instagram: **@creatucontenidook**\n• Mail: creatucontenido.contacto@gmail.com\n¿Querés que te derive directo al WhatsApp?',
      sugs: ['Sí, al WhatsApp', 'Agendar sesión', 'Tengo una duda']
    },
    {
      id: 'calendario',
      keys: ['calendario', 'que publicar', 'plantilla de contenido', 'planificar contenido', 'organizar contenido', 'plan de contenido'],
      reply: 'El secreto no es publicar más, es publicar **con criterio y de forma sostenida**: definí 4-5 pilares de contenido y asignalos a una estructura semanal para no decidir cada día. Te dejo una plantilla de 30 días: [Calendario de contenido](recurso-calendario-contenido.html). ¿Querés que lo armemos para tu marca?',
      sugs: ['Sí, ayúdenme', 'Ver Community Manager', 'Agendar sesión']
    }
  ];

  /* pre-normalizo las keys una sola vez */
  KB.forEach(function (item) {
    item._keys = item.keys.map(function (k) {
      var n = norm(k);
      return { t: n, w: n.indexOf(' ') > -1 ? n.split(' ').length : 1 };
    });
  });

  function bestMatch(text) {
    var q = ' ' + norm(text) + ' ';
    var best = null, bestScore = 0;
    KB.forEach(function (item) {
      var score = 0;
      item._keys.forEach(function (k) {
        /* coincidencia como palabra/frase COMPLETA (evita que "ia"
           matchee dentro de "permanencia", etc.) */
        if (q.indexOf(' ' + k.t + ' ') > -1) {
          score += k.w; /* las frases largas pesan más */
        }
      });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return { item: best, score: bestScore };
  }

  /* fallback cuando no entendió: ofrece temas y deriva a WhatsApp */
  var FALLBACK = {
    reply: 'Mmm, eso prefiero que te lo responda bien una persona del equipo 🙂. Escribime por acá de qué se trata, o si querés lo vemos al toque por [WhatsApp](' + wa('Hola CREA, tengo una consulta') + '). ¿Sobre qué tema te puedo ayudar?',
    sugs: ['Servicios', 'Precios', 'Agendar una sesión']
  };

  window.CREA_BRAIN = {
    /* devuelve { reply, sugs } o null si no hay match decente */
    answer: function (text) {
      var m = bestMatch(text);
      if (m.item && m.score >= 1) {
        return { reply: m.item.reply, sugs: m.item.sugs ? m.item.sugs.slice() : [] };
      }
      return { reply: FALLBACK.reply, sugs: FALLBACK.sugs.slice() };
    },
    _kb: KB /* expuesto por si querés inspeccionarlo */
  };
})();
