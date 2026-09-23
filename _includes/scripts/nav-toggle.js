(function () {
  var toggle = document.querySelector('.js-nav-toggle');
  if (!toggle) { return; }

  var header = toggle.closest('.header');
  if (!header) { return; }

  toggle.addEventListener('click', function () {
    header.classList.toggle('header--nav-open');
  });

  document.querySelectorAll('.js-navigation a').forEach(function (link) {
    link.addEventListener('click', function () {
      header.classList.remove('header--nav-open');
    });
  });
})();
