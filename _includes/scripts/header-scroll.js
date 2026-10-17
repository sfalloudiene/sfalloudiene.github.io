(function () {
  var wrap = document.querySelector('.page__header');
  if (!wrap) { return; }

  // .is-scrolled : barre compacte. Seuils differents a l'aller et au retour
  // pour eviter que la classe clignote autour d'une seule valeur.
  // .is-hidden : la barre s'efface quand on descend et revient des qu'on
  // remonte (jamais pendant que le menu mobile est ouvert).
  var scrolled = false;
  var lastY = window.scrollY || window.pageYOffset;

  function update() {
    var y = window.scrollY || window.pageYOffset;
    if (!scrolled && y > 40) {
      scrolled = true;
      wrap.classList.add('is-scrolled');
    } else if (scrolled && y < 10) {
      scrolled = false;
      wrap.classList.remove('is-scrolled');
    }

    var delta = y - lastY;
    if (document.documentElement.classList.contains('nav-open') || y < 200) {
      wrap.classList.remove('is-hidden');
    } else if (delta > 6) {
      wrap.classList.add('is-hidden');
    } else if (delta < -6) {
      wrap.classList.remove('is-hidden');
    }
    if (Math.abs(delta) > 6) { lastY = y; }
  }

  // Un lien ou bouton du header qui prend le focus au clavier ramene la barre.
  wrap.addEventListener('focusin', function () { wrap.classList.remove('is-hidden'); });

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
