(function () {
  var toggle = document.querySelector('.js-nav-toggle');
  if (!toggle) { return; }

  var header = toggle.closest('.header');
  if (!header) { return; }

  // Menu mobile plein ecran : on bloque le scroll de la page derriere tant
  // qu'il est ouvert.
  function setOpen(open) {
    header.classList.toggle('header--nav-open', open);
    document.documentElement.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setOpen(!header.classList.contains('header--nav-open'));
  });

  document.querySelectorAll('.js-navigation a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setOpen(false); }
  });
})();
