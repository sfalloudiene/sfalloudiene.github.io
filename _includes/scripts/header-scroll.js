(function () {
  var wrap = document.querySelector('.page__header');
  if (!wrap) { return; }

  // Seuils differents a l'aller et au retour pour eviter que la classe
  // clignote quand on s'arrete pile autour d'une seule valeur.
  var scrolled = false;
  function update() {
    var y = window.scrollY || window.pageYOffset;
    if (!scrolled && y > 40) {
      scrolled = true;
      wrap.classList.add('is-scrolled');
    } else if (scrolled && y < 10) {
      scrolled = false;
      wrap.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
