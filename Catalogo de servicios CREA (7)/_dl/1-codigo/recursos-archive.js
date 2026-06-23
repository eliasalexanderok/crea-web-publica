/* ═══════════════════════════════════════════════════════════
   CREA · RECURSOS — ARCHIVO (banners de servicio en el feed)
   Oculta los house-ads cuando hay una categoría filtrada o una
   búsqueda activa, para que no floten entre pocas notas.
   No interfiere con el filtro/buscador (recursos.js / editorial).
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var grid = document.querySelector('.posts');
  if (!grid) return;
  var ads = grid.querySelectorAll('[data-feedad]');
  if (!ads.length) return;
  var search = document.getElementById('gridSearch');

  function update() {
    var on = document.querySelector('.rcat.on');
    var cat = on ? on.getAttribute('data-filter') : 'all';
    var hasQuery = !!(search && (search.value || '').trim());
    var hide = (cat !== 'all') || hasQuery;
    ads.forEach(function (a) { a.classList.toggle('is-hidden', hide); });
  }

  document.querySelectorAll('.rcat').forEach(function (b) {
    b.addEventListener('click', function () { requestAnimationFrame(update); });
  });
  if (search) search.addEventListener('input', update);
  update();
})();
