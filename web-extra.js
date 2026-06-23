/* ═══════════════════════════════════════════════════════════
   CREA — WEB · extra (proyectos · form · chat IA)
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── filtros de proyectos ── */
  var filters = document.querySelectorAll('.filter');
  var projs = document.querySelectorAll('.wk');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (x) { x.classList.remove('on'); });
      f.classList.add('on');
      var cat = f.dataset.filter;
      projs.forEach(function (p) {
        var match = cat === 'all' || (p.dataset.cat || '').split(' ').indexOf(cat) > -1;
        p.classList.toggle('hide', !match);
      });
    });
  });

  /* ── formulario contacto → WhatsApp ── */
  var form = document.getElementById('cform');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var nombre = (d.get('nombre') || '').toString().trim();
      var email = (d.get('email') || '').toString().trim();
      var wa = (d.get('whatsapp') || '').toString().trim();
      var interes = (d.get('interes') || '').toString();
      var tamano = (d.get('tamano') || '').toString();
      var presu = (d.get('presupuesto') || '').toString();
      var mensaje = (d.get('mensaje') || '').toString().trim();
      var txt = 'Hola CREA! Soy ' + (nombre || '...') + '.' +
        ' Estoy buscando: ' + (interes || 'orientación') + '.' +
        (tamano ? ' Mi negocio: ' + tamano + '.' : '') +
        (presu ? ' Presupuesto: ' + presu + '.' : '') +
        (email ? ' Email: ' + email + '.' : '') +
        (wa ? ' Tel: ' + wa + '.' : '') +
        (mensaje ? ' ' + mensaje : '');
      window.open('https://wa.me/5491139261873?text=' + encodeURIComponent(txt), '_blank', 'noopener');
    });
  }

  /* ── dock: el subtítulo rota mensajes (más vivo / interactivo) ── */
  (function () {
    var dockTxt = document.querySelector('.dock__txt span');
    if (!dockTxt) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var MSGS = [
      'Gratis · sin compromiso · respondemos hoy',
      'Diagnóstico real de tu comunicación',
      '30 min que cambian cómo te ven',
      'Respondemos hoy mismo ✦'
    ];
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      var dock = document.getElementById('dock');
      if (dock && !dock.classList.contains('show')) return;
      i = (i + 1) % MSGS.length;
      dockTxt.classList.add('is-swap');
      setTimeout(function () {
        dockTxt.textContent = MSGS[i];
        dockTxt.classList.remove('is-swap');
      }, 320);
    }, 3800);
  })();

  /* ═══════════ CHAT IA ═══════════ */
  var fab = document.getElementById('chatFab');
  var chat = document.getElementById('chat');
  var closeBtn = document.getElementById('chatClose');
  var body = document.getElementById('chatBody');
  var input = document.getElementById('chatInput');
  var send = document.getElementById('chatSend');
  var chips = document.getElementById('chatChips');
  if (!fab || !chat) return;

  /* mostrar el FAB cuando el usuario ya scrolleó un poco */
  function maybeShowFab() {
    if (window.scrollY > 480) { fab.classList.add('show'); }
  }
  window.addEventListener('scroll', maybeShowFab, { passive: true });
  setTimeout(function () { fab.classList.add('show'); }, 2600);

  var history = [];
  var greeted = false;

  var SYSTEM = `Sos "Asistente CREA", el asistente virtual de Crea Tu Contenido (también llamada CTC o CREA), una agencia creativa de contenido estratégico y ejecución fundada por Elías Alexander, con base en Buenos Aires (CABA), Argentina.

MISIÓN DE CREA: Ayudar a marcas y personas a comunicarse con autenticidad estratégica. No es "una agencia más que hace posteos" — es un ecosistema creativo que combina estrategia, estética, producción y acompañamiento.
Eslogan: "Creamos marcas que se ven como lo que valen".

CÓMO CONVERSÁS (MUY IMPORTANTE — sos una persona del equipo, no un bot):
- Hablás como una persona real del equipo de CREA por WhatsApp: cercano, con calidez, en español rioplatense (vos/voseo). Nada de respuestas robóticas, listas largas ni discursos.
- Respuestas CORTAS y livianas: 1 a 3 frases. Es una charla, no un mail. Si algo es largo, lo vas soltando de a poco y preguntás si quiere que profundices.
- SIEMPRE que tenga sentido, terminá con una pregunta para entender mejor a la persona: ¿qué tipo de negocio tenés?, ¿hace cuánto arrancaste?, ¿qué es lo que más te está costando hoy?, ¿ya estás con redes o arrancás de cero? Mostrá curiosidad genuina por su proyecto.
- Reaccioná a lo que dice la persona ANTES de responder: "Buenísimo", "Te entiendo", "Mirá, eso es súper común", "Qué bueno que preguntes eso". Que se sienta escuchada.
- Adaptá tu energía a la de la persona. Si te tira un emoji, podés usar uno. Si es seca y directa, andá al grano.
- No repitas "En CREA hacemos…" en cada mensaje. Conversá. A veces una sola línea con una repregunta es la mejor respuesta.
- Honesto y directo, sin lenguaje "gurú" ni promesas vacías. Si no es para ellos, decilo con onda.

---
CATÁLOGO COMPLETO DE SERVICIOS:

A. SOCIAL MEDIA MANAGEMENT (Gestión de Redes Sociales)
Incluye: estrategia de contenido, diseño, redacción creativa (copy), gestión de la comunidad, análisis, reportes y optimización mensual.
Variantes: desde gestión básica (alcance inicial) hasta Gestión Expert/Full CREA (dirección creativa + equipo de fotografía + asistencia en producción).
ACLARACIÓN IMPORTANTE: el plan básico NO incluye producción audiovisual ni respuesta a mensajes de clientes, salvo que se contrate el plan Full o se cotice la producción aparte.

B. CREACIÓN Y EDICIÓN DE CONTENIDO
Edición profesional de videos para Instagram y TikTok con foco en conversión, no solo estética.
Incluye: planificación adaptada a objetivos, edición de videos cortos, copys, acompañamiento creativo y, si el cliente lo desea, producción audiovisual completa.

C. PRODUCCIÓN AUDIOVISUAL (Product Content & Studio)
Producción de fotos y videos reales y estéticos para mostrar productos o marcas con impacto.
ACLARACIÓN: para grabaciones presenciales, el equipo trabaja en CABA o el cliente debe enviar sus productos al estudio.

D. PAID MEDIA (Publicidad Online)
Gestión de campañas en Meta Ads, Google Ads y TikTok Ads.
Incluye: auditoría inicial, segmentación, diseño de estructura de campaña, optimización mensual y reportes.
DOS ACLARACIONES CRÍTICAS:
1. El plan base de pauta NO incluye el diseño de las piezas gráficas o creativos — el cliente debe entregarlas o contratar un combo que las incluya.
2. La inversión publicitaria (lo que se le paga a Meta/Google/TikTok) NO está incluida en los honorarios de la agencia.

E. BRANDING E IDENTIDAD VISUAL
Construcción o redefinición de la esencia y estética de una marca.
Incluye: workshops de descubrimiento, manual de marca, diseño de logo, paleta de colores, tipografías y aplicaciones para redes. Opciones para crear marcas desde cero o hacer Rebranding para marcas que necesitan evolucionar.

F. DISEÑO WEB Y E-COMMERCE
Desarrollo de sitios web centrados en UX/UI y conversión.
Opciones: landing pages (para campañas), sitios corporativos y tiendas online (e-commerce).

G. ASESORÍAS 1:1 (Mentoría con Elías Alexander)
Consultoría estratégica personalizada de 1 hora y 30 minutos por videollamada.
Para quién: emprendedores o dueños de negocio que están trabados, no saben por dónde arrancar o necesitan una hoja de ruta antes de ejecutar.
Incluye: diagnóstico de marca, revisión de redes, plan de acción y grabación de la sesión.

H. SERVICIOS ADICIONALES
- UGC Production: contenido generado por usuarios (testimonios reales) para potenciar anuncios.
- Email marketing (diseño de newsletters).
- SEO/AEO, automatizaciones para negocios y Business Apps.
- Soluciones a medida: se arman combos personalizados según la necesidad.

---
METODOLOGÍA DE TRABAJO (Método IDEASA):
CREA no publica por publicar. Hace diagnósticos antes de ejecutar.
1. Identidad: entender quién es la marca realmente.
2. Diagnóstico: identificar el problema real, auditar y analizar.
3. Estrategia: definir pilares, narrativa y plataformas.
4. Acción: ejecución pura (creación, diseño, pauta).
5. Seguimiento: medición de datos e insights.
6. Aprendizaje: mejora continua e iteración.

PROCESO DE INGRESO (Onboarding): llamada de descubrimiento → brief de marca → propuesta estratégica personalizada → aprobación → producción con calendarios y reportes mensuales.

---
CLIENTE IDEAL DE CREA: emprendedores, marcas personales, profesionales (odontólogos, contadores, asesores de seguros), e-commerce y Pymes en transformación digital que buscan escalar y entienden el valor de la estrategia.
NO son clientes de CREA: marcas que solo buscan "volumen barato", clientes que quieren viralidad sin estrategia, o quienes buscan resultados mágicos.

---
BLOG / RECURSOS DE CREA (podés responder dudas sobre estos temas y recomendar el artículo que corresponda; el link va con el formato [texto](archivo.html)):

1. "¿Cuánto cuesta tener una marca profesional en 2026?" → recurso-cuanto-cuesta-marca.html
   Idea: contratar por piezas sueltas (un logo acá, un community allá) parece más barato pero sale más caro: clientes que no te toman en serio, precios que no podés subir, tiempo coordinando. Un sistema de marca pensado por una sola dirección rinde más. No mires el precio aislado, mirá cuánto vale un cliente nuevo para vos. No es un gasto, es una palanca.

2. "Calendario de contenido: plantilla de 30 días" → recurso-calendario-contenido.html
   Idea: primero definí 4-5 pilares de contenido (los temas de los que tu marca siempre habla), asignalos a una estructura semanal para no decidir cada día, y trabajá el copy (gancho que frena el scroll, valor, llamado a la acción). El secreto no es publicar más, es publicar con criterio de forma sostenida.

3. "Tu web no vende: 7 razones" → recurso-web-no-vende.html
   Las 7 fugas: (1) no se entiende qué hacés en 5 segundos, (2) habla de vos y no del cliente, (3) no hay un próximo paso claro, (4) carga lenta, (5) no está pensada para el celular, (6) no genera confianza (sin testimonios/casos), (7) no medís nada. La web es una inversión, no un gasto.

4. "Posicionamiento en IA (GEO): que ChatGPT y Gemini recomienden tu marca" → recurso-posicionamiento-ia-geo.html
   GEO = optimizar para que la IA generativa entienda, confíe y recomiende tu marca. El buscador te lista; la IA te elige. 5 pasos: definí tu marca en una frase, respondé las preguntas reales de tu cliente, construí menciones de terceros, ordená tus datos (NAP consistente), probá y ajustá. La ventana está abierta ahora. CREA tiene un servicio dedicado (GEO + AEO).

5. "Branding no es tu logo: las 5 capas" → recurso-branding-no-es-tu-logo.html
   Las 5 capas de una marca que vende: (1) Estrategia (qué sos y para quién), (2) Verbal (cómo hablás), (3) Visual (cómo te ves — acá entra el logo, como una pieza más), (4) Experiencia (cómo se siente tratar con vos), (5) Reputación (qué dicen de vos cuando no estás). El logo es solo la punta del iceberg.

6. "Meta Ads vs Google Ads: cuál conviene" → recurso-meta-vs-google-ads.html
   La diferencia de fondo: ¿tu cliente ya busca lo que vendés (Google = demanda existente) o todavía no sabe que lo necesita (Meta = demanda a crear)? No compiten, resuelven momentos distintos. Lo ideal suele ser combinarlas. El canal no es la estrategia.

Si alguien pregunta por uno de estos temas, respondé lo esencial en 1-3 frases con tus palabras y ofrecé el artículo completo con un link. Para ver todo: [Recursos & Blog](Recursos.html).

---
REGLAS IMPORTANTES:

1. PRECIOS: NUNCA inventes cifras. Si preguntan cuánto cuesta, respondé algo como: "En CREA no manejamos paquetes genéricos. Armamos soluciones a medida según el diagnóstico de tu negocio. Para darte un presupuesto exacto, te invito a agendar una llamada de descubrimiento gratuita con nuestro equipo." Luego derivá a WhatsApp o a agendar.

2. COMBOS: mencioná que combinar servicios (ej. Redes + Pauta, o Branding + Web) genera mejores resultados y optimiza la inversión.

3. GARANTÍAS: CREA no promete ni garantiza cantidad de seguidores o ventas — el marketing depende de múltiples variables. Se garantiza trabajo honesto, estratégico y orientado a la conversión.

4. Si no sabés algo puntual, ofrecé que un humano lo responda por WhatsApp.

5. No inventes datos, casos ni números que no estén en este contexto.

6. FORMATO DE TUS RESPUESTAS:
   - Para enlaces, usá SIEMPRE el formato markdown [texto del link](archivo.html). Ej: [Mirá el artículo completo](recurso-web-no-vende.html). Nunca pegues una URL pelada ni inventes links que no estén en este contexto.
   - Podés usar **negrita** para resaltar 1-2 palabras clave, con moderación.

7. SUGERENCIAS DE RESPUESTA (obligatorio): al FINAL de CADA mensaje agregá, en una sola línea, 2 o 3 respuestas cortas que la persona podría querer decir a continuación, con este formato exacto: [[sug: opción una | opción dos | opción tres]]. Deben estar escritas EN PRIMERA PERSONA como si las dijera el cliente (ej: "Quiero ver Branding", "¿Cuánto tardan?", "Agendar una sesión"), ser bien cortas (2-5 palabras) y avanzar la charla hacia entender su negocio o agendar. Este bloque no se muestra como texto, se convierte en botones.

Objetivo final de cada conversación: entender a la persona y su negocio con preguntas, recomendar el servicio o combo adecuado, resolver dudas (incluidas las del blog) y derivarla a la llamada de descubrimiento o WhatsApp — pero sin apurar: primero generá una buena charla.`;


  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function renderRich(text) {
    var html = escapeHtml(text);
    html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, u) {
      var safe = u.replace(/"/g, '%22');
      return '<a class="msg__link" href="' + safe + '" target="_blank" rel="noopener">' + t + '</a>';
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return html;
  }

  function addMsg(role, text) {
    var el = document.createElement('div');
    el.className = 'msg msg--' + (role === 'user' ? 'user' : 'bot');
    if (role === 'user') { el.textContent = text; }
    else { el.innerHTML = renderRich(text); }
    body.appendChild(el);
    scrollDown();
    return el;
  }

  /* chips de respuesta rápida (dinámicos, los sugiere el propio asistente) */
  function renderChips(list) {
    if (!chips) return;
    chips.innerHTML = '';
    if (!list || !list.length) { chips.style.display = 'none'; return; }
    chips.style.display = 'flex';
    list.slice(0, 3).forEach(function (t) {
      var b = document.createElement('button');
      b.className = 'chat__chip';
      b.type = 'button';
      b.textContent = t;
      b.addEventListener('click', function () { ask(t); });
      chips.appendChild(b);
    });
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'msg msg--bot msg--typing';
    el.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(el);
    scrollDown();
    return el;
  }

  function buildPrompt(userText) {
    var convo = history.map(function (m) {
      return (m.role === 'user' ? 'Cliente' : 'Asistente') + ': ' + m.text;
    }).join('\n');
    return SYSTEM + '\n\n--- Conversación ---\n' + convo +
      '\nCliente: ' + userText + '\nAsistente:';
  }

  function open() {
    chat.classList.add('open');
    fab.style.display = 'none';
    if (!greeted) {
      greeted = true;
      setTimeout(function () {
        addMsg('bot', '¡Hola! 👋 Soy del equipo de CREA, encantado. Contame, ¿en qué andás con tu marca? ¿Tenés un proyecto en marcha o estás arrancando?');
      }, 250);
    }
    setTimeout(function () { input.focus(); }, 350);
  }
  function close() { chat.classList.remove('open'); fab.style.display = ''; }

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  async function ask(userText) {
    userText = (userText || '').trim();
    if (!userText) return;
    addMsg('user', userText);
    history.push({ role: 'user', text: userText });
    input.value = '';
    input.style.height = 'auto';
    send.disabled = true;
    var typing = showTyping();

    var reply = null;
    var sugs = [];

    /* 1) Si hay una IA disponible en el entorno, la usamos (mejor UX). */
    try {
      if (window.claude && window.claude.complete) {
        reply = await window.claude.complete(buildPrompt(userText));
      }
    } catch (err) {
      reply = null;
    }

    /* extraer sugerencias que la propia IA propone: [[sug: a | b | c]] */
    if (reply && reply.trim()) {
      var sm = reply.match(/\[\[\s*sug\s*:([^\]]*)\]\]/i);
      if (sm) {
        sugs = sm[1].split('|').map(function (s) { return s.trim(); }).filter(Boolean);
        reply = reply.replace(sm[0], '').trim();
      }
    }

    /* 2) Sin IA (hosting estático): respondemos desde el CEREBRO local. */
    if ((!reply || !reply.trim()) && window.CREA_BRAIN) {
      var local = window.CREA_BRAIN.answer(userText);
      if (local) { reply = local.reply; sugs = local.sugs || []; }
    }

    typing.remove();

    /* 3) Último recurso: derivar a WhatsApp. */
    if (!reply || !reply.trim()) {
      reply = 'Justo no puedo responderte por acá en este momento. Escribinos por WhatsApp y te contestamos al toque 👇';
    }
    reply = reply.trim();

    addMsg('bot', reply);
    history.push({ role: 'assistant', text: reply });
    renderChips(sugs);
    send.disabled = false;
    input.focus();
  }

  send.addEventListener('click', function () { ask(input.value); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); }
  });
  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });
  if (chips) {
    chips.querySelectorAll('.chat__chip').forEach(function (c) {
      c.addEventListener('click', function () { ask(c.textContent); });
    });
  }
})();
