/* ═══════════════════════════════════════════════════════════
   CREA — WEB · web-game.js
   EL DESAFÍO CREA — 10 retos sobre creación de contenido.
   5 motores (precisión, quiz, arcade, memoria, secuencia) con
   contenido aleatorio: cada partida es distinta.
   También maneja el selector Chatear/Jugar del FAB del bot.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var fab    = document.getElementById('chatFab');
  var choice = document.getElementById('fabChoice');
  var game   = document.getElementById('game');
  if (!fab || !choice || !game) return;

  var $ = function (id) { return document.getElementById(id); };
  var scrStart = $('gameStart'), scrPlay = $('gamePlay'), scrEnd = $('gameEnd');
  var zone = $('gameZone');
  var elLvl = $('gameLvl'), elLives = $('gameLives'), elScore = $('gameScore');
  var elTask = $('gameTask'), elMsg = $('gameMsg'), elBest = $('gameBest');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Utilidades ── */
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(pool, n) { return shuffle(pool).slice(0, n); }
  function getBest() { try { return parseInt(localStorage.getItem('crea_game_best') || '0', 10); } catch (e) { return 0; } }
  function setBest(v) { try { localStorage.setItem('crea_game_best', String(v)); } catch (e) {} }

  /* ═══════════════ CONTENIDO (pools aleatorios) ═══════════════ */

  /* Verdadero o Falso — mitos del contenido */
  var VF = [
    ['Publicar todos los días garantiza crecer.', false, 'La constancia sin estrategia es ruido.'],
    ['La mayoría de los videos en redes se miran sin sonido.', true, 'Por eso los subtítulos venden.'],
    ['Un logo lindo alcanza para tener una marca.', false, 'La marca es percepción: voz, sistema, criterio.'],
    ['Los primeros 3 segundos definen si siguen mirando.', true, 'El hook es la mitad del video.'],
    ['Comprar seguidores mejora tu alcance.', false, 'El algoritmo detecta cuentas frías y te entierra.'],
    ['Conviene estar en todas las redes a la vez.', false, 'Mejor dominar una que ser tibio en cinco.'],
    ['Las historias desaparecen, pero venden.', true, 'Cercanía diaria = confianza = ventas.'],
    ['El mejor contenido es el que más te gusta a vos.', false, 'Es el que le sirve a tu cliente.'],
    ['Responder comentarios mejora tu alcance.', true, 'La conversación es señal para el algoritmo.'],
    ['La pauta reemplaza al contenido orgánico.', false, 'La pauta amplifica; sin contenido, amplifica la nada.'],
    ['Un reel puede traer clientes meses después de publicado.', true, 'El buen contenido trabaja mientras dormís.'],
    ['Hay una hora mágica para publicar que sirve para todos.', false, 'Cada audiencia tiene su ritmo: se mide.'],
    ['El carrusel es de los formatos con más retención.', true, 'Cada slide es una razón para quedarse.'],
    ['Si no vendés online, no necesitás web.', false, 'Te googlean antes de comprarte. Siempre.'],
    ['Los subtítulos aumentan la retención de un video.', true, 'Nadie activa el audio en el colectivo.'],
    ['Borrar y volver a subir un post lo hace viral.', false, 'Solo confunde al algoritmo (y a tu audiencia).']
  ];

  /* Trivia — multiple choice: [pregunta, [opciones], idxCorrecta, explicación] */
  var TRIVIA = [
    ['¿Qué es un "hook"?', ['El gancho de los primeros segundos', 'Un tipo de hashtag', 'El link de la bio'], 0, 'Sin gancho no hay video que aguante.'],
    ['¿Qué formato premia más Instagram hoy?', ['Reels', 'Fotos sueltas', 'Links externos'], 0, 'El video corto manda.'],
    ['¿Qué es el CTA?', ['El llamado a la acción', 'Una métrica de video', 'El costo por anuncio'], 0, 'Si no pedís, no pasa nada.'],
    ['¿Qué mide el "alcance"?', ['Cuántas personas vieron tu contenido', 'Cuántos te siguieron', 'Cuánto gastaste'], 0, 'Personas únicas que te vieron.'],
    ['¿Qué es el "engagement"?', ['La interacción real con tu contenido', 'La cantidad de posteos', 'Los seguidores nuevos'], 0, 'Likes, guardados, compartidos: eso vale.'],
    ['Una marca personal fuerte se construye con…', ['Constancia y voz propia', 'Suerte y viralidad', 'Muchos hashtags'], 0, 'La viralidad pasa; la voz queda.'],
    ['¿Para qué sirve un calendario de contenido?', ['Planificar con estrategia', 'Llenar el feed', 'Ganar sorteos'], 0, 'Cada posteo con un rol y un porqué.'],
    ['¿Qué es el storytelling?', ['Contar historias que conectan', 'Subir stories todos los días', 'Un filtro de video'], 0, 'La gente compra historias, no productos.'],
    ['¿Qué red usan cada vez más como buscador?', ['TikTok', 'X (Twitter)', 'Snapchat'], 0, 'Las nuevas generaciones buscan ahí.'],
    ['El "copy" de un posteo es…', ['El texto que acompaña y vende', 'La imagen de portada', 'El pie de foto legal'], 0, 'Las palabras correctas convierten.']
  ];

  /* El intruso — [consigna, [4 opciones], idxIntruso, explicación] */
  var INTRUSO = [
    ['¿Cuál NO es una métrica?', ['Alcance', 'Engagement', 'Impresiones', 'Logotipo'], 3, 'El logo es identidad, no medición.'],
    ['¿Cuál NO va en una bio?', ['Qué hacés', 'Un CTA con link', 'Tu ubicación', 'Tu clave de WiFi'], 3, 'La bio vende en 3 líneas.'],
    ['¿Cuál NO es un formato de contenido?', ['Reel', 'Carrusel', 'Historia', 'Membrete'], 3, 'El membrete quedó en los 90.'],
    ['¿Cuál NO es una red social?', ['TikTok', 'Pinterest', 'LinkedIn', 'Photoshop'], 3, 'Photoshop es herramienta, no red.'],
    ['¿Cuál NO ayuda al SEO local?', ['Las reseñas', 'La ficha de Google', 'La web con tu zona', 'Comprar likes'], 3, 'Google premia lo real.'],
    ['¿Cuál NO es parte del branding?', ['La paleta de color', 'El tono de voz', 'La tipografía', 'El CUIT'], 3, 'Importante, pero no es marca.'],
    ['¿Cuál NO es un objetivo de pauta?', ['Alcance', 'Conversiones', 'Tráfico', 'Marca de agua'], 3, 'La marca de agua no convierte.'],
    ['¿Cuál NO mejora un reel?', ['Un buen hook', 'Los subtítulos', 'Buena luz', 'Audio saturado'], 3, 'Si duele el oído, deslizan.']
  ];

  /* ¿Cuál convierte más? — [contexto, copy plano, copy que vende, explicación] */
  var COPYS = [
    ['Una panadería', 'Vendemos pan artesanal', 'El pan que se termina antes de las 10am', 'La escasez y el deseo venden más que la descripción.'],
    ['Un gimnasio', 'Promo en planes trimestrales', '¿Y si en 3 meses no te reconocés?', 'La transformación vende más que el precio.'],
    ['Un dentista', 'Turnos disponibles esta semana', 'Sonreí en todas las fotos de este verano', 'Vendé el resultado, no el trámite.'],
    ['Una tienda de ropa', 'Nueva colección disponible', 'Volvieron los que se agotaron en 48 horas', 'La prueba social es el mejor vendedor.'],
    ['Un café', 'Café de especialidad', 'El café por el que llegan tarde al trabajo', 'Una imagen concreta vale más que una categoría.'],
    ['Una inmobiliaria', 'Vendemos propiedades', 'Mudate antes de fin de año', 'Lo concreto con plazo mueve a la acción.'],
    ['Una veterinaria', 'Atención veterinaria integral', 'Tu perro ya eligió su veterinaria', 'El humor y la emoción se recuerdan.'],
    ['Una agencia', 'Hacemos marketing digital', 'Tu competencia ya está publicando', 'La urgencia real gana a la autodescripción.']
  ];

  /* Secuencias — [título, [4 pasos en orden correcto]] */
  var SECUENCIAS = [
    ['Lanzar una marca', ['Estrategia', 'Identidad', 'Contenido', 'Pauta']],
    ['Un reel que funciona', ['Idea', 'Grabación', 'Edición', 'Publicación']],
    ['Un embudo que vende', ['Atraer', 'Interesar', 'Convencer', 'Convertir']],
    ['Un posteo con criterio', ['Objetivo', 'Copy', 'Diseño', 'CTA']],
    ['Crecer con datos', ['Publicar', 'Medir', 'Aprender', 'Ajustar']],
    ['Atender a un cliente', ['Escuchar', 'Entender', 'Resolver', 'Fidelizar']]
  ];

  /* Arcade — palabras buenas y malas */
  var GOOD = ['IDEA', 'HOOK', 'CTA', 'STORY', 'REEL', 'MARCA', 'VOZ', 'DATO'];
  var BAD  = ['SPAM', 'HUMO', 'RUIDO', 'BOT', 'CRINGE', 'RELLENO'];

  /* Tareas del motor de precisión: [texto, velocidad, anchoZona] */
  var BAR_TASKS = [
    ['Centrá el logo', 0.55, 0.24],
    ['Cortá el reel en el beat', 0.85, 0.15],
    ['El píxel perfecto', 1.15, 0.09]
  ];

  /* ── Los 10 retos (orden fijo, contenido aleatorio) ── */
  var LEVELS = [
    { type: 'bar',    bar: 0 },
    { type: 'quiz',   mode: 'vf',      rounds: 2, title: 'Verdadero o falso' },
    { type: 'catch',  title: 'Cazá las ideas' },
    { type: 'quiz',   mode: 'trivia',  rounds: 2, title: 'Trivia del contenido' },
    { type: 'memory', title: 'Memoria de marca' },
    { type: 'bar',    bar: 1 },
    { type: 'quiz',   mode: 'intruso', rounds: 2, title: 'Encontrá al intruso' },
    { type: 'seq',    title: 'Ordená el proceso' },
    { type: 'quiz',   mode: 'copys',   rounds: 2, title: '¿Cuál convierte más?' },
    { type: 'bar',    bar: 2 }
  ];

  /* ═══════════════ Selector Chatear / Jugar ═══════════════ */
  document.addEventListener('click', function (e) {
    var onFab = e.target.closest && e.target.closest('#chatFab');
    if (onFab) {
      if (e._creaChat) { hideChoice(); return; }
      e.preventDefault();
      e.stopPropagation();
      if (choice.hidden || !choice.classList.contains('open')) showChoice();
      else hideChoice();
      return;
    }
    if (!(e.target.closest && e.target.closest('#fabChoice'))) hideChoice();
  }, true);

  function showChoice() {
    choice.hidden = false;
    var r = fab.getBoundingClientRect();
    var cw = choice.offsetWidth, ch = choice.offsetHeight;
    choice.style.top  = Math.max(8, r.top - ch - 12) + 'px';
    choice.style.left = Math.min(window.innerWidth - cw - 8, Math.max(8, r.right - cw)) + 'px';
    void choice.offsetWidth;
    choice.classList.add('open');
  }
  function hideChoice() {
    if (choice.hidden) return;
    choice.classList.remove('open');
    setTimeout(function () { choice.hidden = true; }, 280);
  }

  $('chooseChat').addEventListener('click', function () {
    hideChoice();
    if (window.creaChatOpen) { window.creaChatOpen(); }
    else {
      var ev = new MouseEvent('click', { bubbles: true, cancelable: true });
      ev._creaChat = true;
      fab.dispatchEvent(ev);
    }
  });
  $('chooseGame').addEventListener('click', function () { hideChoice(); openGame(); });

  /* ═══════════════ Modal ═══════════════ */
  function openGame() {
    game.hidden = false;
    document.body.classList.add('game-open');
    void game.offsetWidth;
    game.classList.add('open');
    showScreen('start');
    var best = getBest();
    if (best > 0) { elBest.hidden = false; elBest.textContent = 'Tu récord: ' + best + ' pts'; }
  }
  function closeGame() {
    stopEngine();
    game.classList.remove('open');
    document.body.classList.remove('game-open');
    setTimeout(function () { game.hidden = true; }, 320);
  }
  $('gameClose').addEventListener('click', closeGame);
  $('gameOverlay').addEventListener('click', closeGame);
  document.addEventListener('keydown', function (e) {
    if (game.hidden) return;
    if (e.key === 'Escape') closeGame();
  });

  function showScreen(which) {
    scrStart.hidden = which !== 'start';
    scrPlay.hidden  = which !== 'play';
    scrEnd.hidden   = which !== 'end';
  }

  /* ═══════════════ Estado de la partida ═══════════════ */
  var lvl = 0, lives = 3, score = 0;
  var engineTimers = [], engineRaf = 0, engineAlive = false;

  function tm(fn, ms) { var t = setTimeout(fn, ms); engineTimers.push(t); return t; }
  function stopEngine() {
    engineAlive = false;
    engineTimers.forEach(clearTimeout); engineTimers = [];
    if (engineRaf) cancelAnimationFrame(engineRaf);
  }

  $('gameGo').addEventListener('click', startRun);
  $('gameAgain').addEventListener('click', startRun);

  function startRun() {
    lvl = 0; lives = 3; score = 0;
    showScreen('play');
    startLevel();
  }

  function hud() {
    elLvl.textContent = 'Reto ' + (lvl + 1) + '/' + LEVELS.length;
    elScore.textContent = String(score);
    var dots = elLives.children;
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('off', i >= lives);
  }
  function setMsg(txt, cls) { elMsg.textContent = txt || ' '; elMsg.className = 'game__msg' + (cls ? ' ' + cls : ''); }
  function addScore(pts) { score += pts; elScore.textContent = String(score); }

  function loseLife() {
    lives--;
    hud();
    return lives > 0;
  }

  function startLevel() {
    stopEngine();
    engineAlive = true;
    hud();
    setMsg('');
    zone.innerHTML = '';
    var cfg = LEVELS[lvl];
    ENGINES[cfg.type](cfg);
  }

  function levelDone(bonusMsg) {
    stopEngine();
    if (bonusMsg) setMsg(bonusMsg, 'ok');
    tm(function () {
      lvl++;
      if (lvl >= LEVELS.length) endRun(true);
      else startLevel();
    }, 950);
  }
  function levelFail() {
    stopEngine();
    tm(function () {
      if (lives <= 0) endRun(false);
      else startLevel(); /* reintenta el mismo reto con contenido nuevo */
    }, 950);
  }

  /* ═══════════════ MOTORES ═══════════════ */
  var ENGINES = {};

  /* ── 1. Precisión: frená la aguja en la zona ── */
  ENGINES.bar = function (cfg) {
    var t = BAR_TASKS[cfg.bar];
    elTask.textContent = t[0];
    var speed = reduce ? t[1] * 0.7 : t[1];
    var tW = t[2];
    var tL = 0.05 + Math.random() * (0.90 - tW);

    zone.innerHTML =
      '<div class="game__bar" id="gBar">' +
        '<div class="game__target" style="left:' + (tL * 100) + '%;width:' + (tW * 100) + '%"><i class="game__tcenter"></i></div>' +
        '<div class="game__needle" id="gNeedle"></div>' +
      '</div>' +
      '<button class="game__tap" id="gTap">Tocá para frenar</button>';

    var needle = $('gNeedle'), bar = $('gBar'), target = bar.querySelector('.game__target');
    var elapsed = 0, lastTs = 0, playing = true;

    function pos() { var x = (elapsed / 1000) * speed % 2; return x < 1 ? x : 2 - x; }
    function loop(ts) {
      if (!playing || !engineAlive) return;
      if (lastTs) elapsed += Math.min(ts - lastTs, 50);
      lastTs = ts;
      needle.style.left = (pos() * 100) + '%';
      engineRaf = requestAnimationFrame(loop);
    }
    engineRaf = requestAnimationFrame(loop);

    function tap(e) {
      e.preventDefault();
      if (!playing) return;
      playing = false;
      var p = pos();
      needle.style.left = (p * 100) + '%';
      var center = tL + tW / 2;
      if (p >= tL && p <= tL + tW) {
        var prec = 1 - Math.abs(p - center) / (tW / 2);
        var pts = 80 + Math.round(120 * prec);
        addScore(pts);
        target.classList.add('hit');
        levelDone(prec > 0.82 ? '¡Píxel perfecto! +' + pts : 'Aprobado. +' + pts);
      } else {
        setMsg('Se corrió un píxel…', 'bad');
        bar.classList.add('shake');
        loseLife();
        levelFail();
      }
    }
    bar.addEventListener('pointerdown', tap);
    $('gTap').addEventListener('pointerdown', tap);
  };

  /* ── 2. Quiz: V/F, trivia, intruso y copys (con timer) ── */
  ENGINES.quiz = function (cfg) {
    elTask.textContent = cfg.title;
    var rounds;
    if (cfg.mode === 'vf')      rounds = pick(VF, cfg.rounds);
    if (cfg.mode === 'trivia')  rounds = pick(TRIVIA, cfg.rounds);
    if (cfg.mode === 'intruso') rounds = pick(INTRUSO, cfg.rounds);
    if (cfg.mode === 'copys')   rounds = pick(COPYS, cfg.rounds);
    var i = 0, TIME = 9000;

    function ask() {
      if (!engineAlive) return;
      setMsg('');
      var r = rounds[i], q, opts, correctTxt, explain;

      if (cfg.mode === 'vf') {
        q = r[0]; explain = r[2];
        opts = [['Verdadero', r[1] === true], ['Falso', r[1] === false]];
      } else if (cfg.mode === 'copys') {
        q = r[0] + ' quiere vender más. ¿Qué copy publicás?';
        explain = r[3];
        opts = shuffle([[r[1], false], [r[2], true]]);
      } else {
        q = r[0]; explain = r[3];
        var correctIdx = r[2];
        opts = shuffle(r[1].map(function (o, idx) { return [o, idx === correctIdx]; }));
      }

      var html = '<div class="gq">' +
        '<div class="gq__timer"><i id="gqFill"></i></div>' +
        '<p class="gq__q">' + q + '</p>' +
        '<div class="gq__opts">';
      opts.forEach(function (o, idx) {
        html += '<button class="gq__opt" data-ok="' + (o[1] ? '1' : '0') + '">' + o[0] + '</button>';
      });
      html += '</div></div>';
      zone.innerHTML = html;

      /* timer */
      var fill = $('gqFill');
      fill.style.transitionDuration = TIME + 'ms';
      void fill.offsetWidth;
      fill.style.transform = 'scaleX(0)';
      var timeout = tm(function () { answer(null, explain); }, TIME);

      function answer(btn, explainTxt) {
        if (!engineAlive) return;
        clearTimeout(timeout);
        var opts2 = zone.querySelectorAll('.gq__opt');
        opts2.forEach(function (b) {
          b.disabled = true;
          if (b.dataset.ok === '1') b.classList.add('is-right');
        });
        var ok = btn && btn.dataset.ok === '1';
        if (ok) {
          btn.classList.add('picked');
          var remaining = fill.getBoundingClientRect().width / fill.parentNode.getBoundingClientRect().width;
          var pts = 90 + Math.round(90 * remaining); /* rapidez = más puntos */
          addScore(pts);
          setMsg(explainTxt + ' +' + pts, 'ok');
        } else {
          if (btn) btn.classList.add('is-wrong');
          setMsg(btn ? explainTxt : 'Se acabó el tiempo. ' + explainTxt, 'bad');
          if (!loseLife()) { tm(function () { endRun(false); }, 1100); return; }
        }
        tm(function () {
          i++;
          if (i >= rounds.length) levelDone();
          else ask();
        }, 1350);
      }

      zone.querySelectorAll('.gq__opt').forEach(function (b) {
        b.addEventListener('click', function () { answer(b, explain); });
      });
    }
    ask();
  };

  /* ── 3. Arcade: cazá las ideas, evitá el humo ── */
  ENGINES.catch = function (cfg) {
    elTask.textContent = cfg.title;
    var DURATION = 14000, SPAWN_MS = reduce ? 1300 : 950, LIFE_MS = reduce ? 1900 : 1500;
    var hits = 0, spawned = 0, maxGood = 8;

    zone.innerHTML =
      '<p class="gc__hint">Tocá las <b>ideas</b> · esquivá el <i>humo</i></p>' +
      '<div class="gc" id="gcField"></div>' +
      '<div class="gq__timer gc__timer"><i id="gcFill"></i></div>';
    var field = $('gcField');

    var fill = $('gcFill');
    fill.style.transitionDuration = DURATION + 'ms';
    void fill.offsetWidth;
    fill.style.transform = 'scaleX(0)';

    function spawn() {
      if (!engineAlive) return;
      var isGood = Math.random() < 0.62 && spawned < maxGood ? true : Math.random() < 0.45;
      var word = isGood ? GOOD[Math.floor(Math.random() * GOOD.length)] : BAD[Math.floor(Math.random() * BAD.length)];
      if (isGood) spawned++;
      var chip = document.createElement('button');
      chip.className = 'gc__chip ' + (isGood ? 'gc__chip--good' : 'gc__chip--bad');
      chip.textContent = word;
      chip.style.left = (6 + Math.random() * 66) + '%';
      chip.style.top  = (8 + Math.random() * 62) + '%';
      chip.style.setProperty('--rot', (Math.random() * 10 - 5).toFixed(1) + 'deg');
      field.appendChild(chip);
      var gone = tm(function () { chip.remove(); }, LIFE_MS);
      chip.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        clearTimeout(gone);
        if (isGood) {
          hits++;
          addScore(45);
          chip.classList.add('pop');
          setMsg('+45', 'ok');
        } else {
          addScore(-40);
          if (score < 0) { score = 0; elScore.textContent = '0'; }
          chip.classList.add('bad-pop');
          setMsg('Eso era humo. −40', 'bad');
        }
        tm(function () { chip.remove(); }, 220);
      });
      tm(spawn, SPAWN_MS * (0.75 + Math.random() * 0.5));
    }
    spawn();

    tm(function () {
      if (!engineAlive) return;
      var bonus = hits >= 5 ? 60 : 0;
      if (bonus) addScore(bonus);
      levelDone(hits >= 5 ? 'Cazador de ideas. Bonus +' + bonus : 'Cazaste ' + hits + ' ideas.');
    }, DURATION);
  };

  /* ── 4. Memoria: encontrá los 3 pares ── */
  ENGINES.memory = function (cfg) {
    elTask.textContent = cfg.title;
    var words = pick(['LOGO', 'VOZ', 'COLOR', 'FEED', 'REEL', 'HOOK', 'COPY', 'CTA'], 3);
    var deck = shuffle(words.concat(words));
    var html = '<p class="gc__hint">Encontrá los <b>3 pares</b> — menos intentos, más puntos</p><div class="gm">';
    deck.forEach(function (w, idx) {
      html += '<button class="gm__card" data-w="' + w + '"><span class="gm__inner"><span class="gm__front">✦</span><span class="gm__back">' + w + '</span></span></button>';
    });
    html += '</div>';
    zone.innerHTML = html;

    var open = [], found = 0, tries = 0, lock = false;
    zone.querySelectorAll('.gm__card').forEach(function (c) {
      c.addEventListener('click', function () {
        if (lock || c.classList.contains('flip') || !engineAlive) return;
        c.classList.add('flip');
        open.push(c);
        if (open.length === 2) {
          tries++;
          lock = true;
          var a = open[0], b = open[1];
          open = [];
          if (a.dataset.w === b.dataset.w) {
            a.classList.add('found'); b.classList.add('found');
            found++;
            lock = false;
            if (found === 3) {
              var pts = Math.max(90, 240 - (tries - 3) * 30);
              addScore(pts);
              levelDone('Memoria de elefante. +' + pts);
            }
          } else {
            tm(function () { a.classList.remove('flip'); b.classList.remove('flip'); lock = false; }, 750);
          }
        }
      });
    });
  };

  /* ── 5. Secuencia: tocá los pasos en orden ── */
  ENGINES.seq = function (cfg) {
    var s = pick(SECUENCIAS, 1)[0];
    elTask.textContent = cfg.title + ': ' + s[0].toLowerCase();
    var steps = s[1];
    var html = '<p class="gc__hint">Tocá los pasos <b>en orden</b></p><div class="gs">';
    shuffle(steps.map(function (st, i) { return [st, i]; })).forEach(function (pair) {
      html += '<button class="gs__step" data-i="' + pair[1] + '"><span class="gs__n"></span>' + pair[0] + '</button>';
    });
    html += '</div>';
    zone.innerHTML = html;

    var next = 0;
    zone.querySelectorAll('.gs__step').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('done') || !engineAlive) return;
        if (parseInt(b.dataset.i, 10) === next) {
          b.classList.add('done');
          b.querySelector('.gs__n').textContent = String(next + 1);
          next++;
          if (next === steps.length) {
            addScore(180);
            levelDone('Proceso impecable. +180');
          }
        } else {
          setMsg('Ese paso va después…', 'bad');
          zone.querySelector('.gs').classList.add('shake');
          if (!loseLife()) { tm(function () { endRun(false); }, 900); return; }
          tm(function () {
            zone.querySelectorAll('.gs__step').forEach(function (x) { x.classList.remove('done'); x.querySelector('.gs__n').textContent = ''; });
            zone.querySelector('.gs').classList.remove('shake');
            next = 0;
          }, 900);
        }
      });
    });
  };

  /* ═══════════════ Final ═══════════════ */
  function endRun(finished) {
    stopEngine();
    var best = getBest();
    var isRecord = score > best;
    if (isRecord) setBest(score);

    var title, kick;
    if (finished && score >= 1500) { title = 'Director creativo';    kick = 'Nivel dios'; }
    else if (score >= 1000)        { title = 'Ojo CREA';             kick = finished ? 'Completaste los 10 retos' : 'Te faltó poco'; }
    else if (score >= 550)         { title = 'Creador en ascenso';   kick = 'Vas bien'; }
    else                           { title = 'Cliente ideal';        kick = 'Con cariño'; }

    $('gameEndKick').textContent  = kick;
    $('gameEndTitle').textContent = title;
    $('gameEndDesc').textContent  = score + ' puntos' +
      (isRecord ? ' — nuevo récord personal.' : (best ? ' — tu récord sigue en ' + best + '.' : '.')) +
      (finished ? ' Cada reto de este juego es una decisión que tomamos a diario por las marcas que manejamos.'
                : ' El cliente se fue en el reto ' + (lvl + 1) + '. Cada partida trae retos distintos: probá de nuevo.');

    var shareTxt = 'Hice ' + score + ' puntos en El Desafío CREA ✦ 10 retos de creación de contenido. ¿Me superás? https://creatucontenido.com.ar/#jugar';
    $('gameShare').href = 'https://wa.me/?text=' + encodeURIComponent(shareTxt);

    showScreen('end');
  }

  /* ── Deep link: /#jugar abre el juego ── */
  if (location.hash === '#jugar') setTimeout(openGame, 1200);
})();
