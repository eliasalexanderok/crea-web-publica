/* ═══════════════════════════════════════════════════════════
   CREA — WEB · PROYECTOS
   Filtro por categoría + "Ver más" (galería compacta, sin links).
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var grid = document.getElementById('wkGrid');
  var bar = document.getElementById('wkFilter');
  var more = document.getElementById('wkMore');
  if (!grid || !bar || !more) return;

  var COLLAPSED = 6;
  var cards = [].slice.call(grid.querySelectorAll('.wk'));
  var filter = 'all';
  var expanded = false;

  function matches(card) {
    if (filter === 'all') return true;
    var cat = (card.getAttribute('data-cat') || '').split(/\s+/);
    return cat.indexOf(filter) !== -1;
  }

  function apply() {
    var shown = 0, matching = 0;
    cards.forEach(function (card) {
      if (!matches(card)) { card.classList.add('hide'); return; }
      matching++;
      if (expanded || shown < COLLAPSED) { card.classList.remove('hide'); shown++; }
      else card.classList.add('hide');
    });
    if (matching > COLLAPSED) {
      more.hidden = false;
      more.classList.toggle('is-open', expanded);
      more.firstChild.nodeValue = expanded ? 'Ver menos ' : 'Ver más proyectos ';
    } else {
      more.hidden = true;
    }
  }

  bar.addEventListener('click', function (e) {
    var chip = e.target.closest('.wkfilter__chip');
    if (!chip) return;
    filter = chip.getAttribute('data-filter') || 'all';
    expanded = false;
    bar.querySelectorAll('.wkfilter__chip').forEach(function (c) {
      var on = c === chip;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    apply();
  });

  more.addEventListener('click', function () { expanded = !expanded; apply(); });

  apply();
})();
