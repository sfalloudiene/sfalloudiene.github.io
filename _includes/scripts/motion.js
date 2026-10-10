(function () {
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll(fn) {
    var ticking = false;
    function run() { ticking = false; fn(); }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
    window.addEventListener('resize', fn);
    fn();
  }

  // Timeline "A propos" : la ligne se dessine au fil du scroll (jusqu'au
  // milieu de l'ecran) et chaque point s'allume quand la ligne l'atteint.
  (function () {
    if (reducedMotion) { return; }
    var timelines = document.querySelectorAll('.timeline');
    if (!timelines.length) { return; }

    timelines.forEach(function (tl) { tl.classList.add('timeline--animated'); });

    onScroll(function () {
      var mark = window.innerHeight * 0.6;
      timelines.forEach(function (tl) {
        var rect = tl.getBoundingClientRect();
        var progress = rect.height > 0 ? (mark - rect.top) / rect.height : 0;
        progress = Math.min(Math.max(progress, 0), 1);
        tl.style.setProperty('--progress', progress.toFixed(4));
        var reached = rect.top + progress * rect.height;
        tl.querySelectorAll('.timeline__item').forEach(function (item) {
          var dot = item.getBoundingClientRect().top + 10;
          item.classList.toggle('is-lit', dot <= reached + 1);
        });
      });
    });
  })();

  // Titres de section : un trait orange se trace sous le titre a son apparition.
  (function () {
    if (reducedMotion || !('IntersectionObserver' in window)) { return; }
    var headings = document.querySelectorAll('.timeline-section__heading');
    if (!headings.length) { return; }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    headings.forEach(function (h) {
      h.classList.add('heading-draw');
      observer.observe(h);
    });
  })();

  // Menu : une pastille unique glisse sous le lien survole puis revient sous
  // la page active, au lieu de fonds qui apparaissent/disparaissent.
  (function () {
    var list = document.querySelector('.header .js-navigation > ul');
    if (!list || !window.matchMedia) { return; }
    var wide = window.matchMedia('(min-width: 500px)');
    var links = list.querySelectorAll('.navigation__item a');
    if (!links.length) { return; }

    var pill = document.createElement('span');
    pill.className = 'navigation__pill';
    pill.setAttribute('aria-hidden', 'true');
    list.insertBefore(pill, list.firstChild);

    var active = list.querySelector('.navigation__item--active a');
    var current = active;

    function place(link, instant) {
      if (!wide.matches || !link) {
        pill.style.opacity = '0';
        return;
      }
      var listRect = list.getBoundingClientRect();
      var r = link.getBoundingClientRect();
      if (instant) { pill.style.transition = 'none'; }
      pill.style.width = r.width + 'px';
      pill.style.height = r.height + 'px';
      pill.style.transform = 'translate(' + (r.left - listRect.left) + 'px,' + (r.top - listRect.top) + 'px)';
      pill.style.opacity = '1';
      if (instant) {
        void pill.offsetWidth;
        pill.style.transition = '';
      }
    }

    function sync() {
      list.classList.toggle('navigation--pill', wide.matches);
      place(current, true);
    }

    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () { current = link; place(link); });
      link.addEventListener('focus', function () { current = link; place(link); });
    });
    list.addEventListener('mouseleave', function () {
      current = active;
      if (active) { place(active); } else { pill.style.opacity = '0'; }
    });

    if (window.ResizeObserver) {
      new ResizeObserver(function () { place(current, true); }).observe(list);
    }
    if (wide.addEventListener) { wide.addEventListener('change', sync); }
    window.addEventListener('resize', sync);
    sync();
  })();

  // Formulaire newsletter : le bouton se transforme en coche animee avant que
  // le formulaire parte vers Buttondown (l'envoi reste un POST classique).
  (function () {
    document.querySelectorAll('.newsletter-subscribe__form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var button = form.querySelector('button[type="submit"]');
        if (!button || form.classList.contains('is-sending')) { return; }
        if (reducedMotion) { return; }
        e.preventDefault();
        button.style.width = button.offsetWidth + 'px';
        button.style.height = button.offsetHeight + 'px';
        form.classList.add('is-sending');
        button.setAttribute('aria-label', 'Inscription envoyée');
        button.innerHTML = '<svg class="newsletter-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
        setTimeout(function () { form.submit(); }, 700);
      });
    });
  })();

  // Bouton retour en haut, avec un anneau qui se remplit selon la progression
  // de lecture. Uniquement sur les pages assez longues pour en avoir besoin.
  (function () {
    var button = document.querySelector('.back-to-top');
    if (!button) { return; }
    var ring = button.querySelector('.back-to-top__progress');
    var length = ring ? ring.getTotalLength() : 0;
    if (ring) {
      ring.style.strokeDasharray = length;
      ring.style.strokeDashoffset = length;
    }

    onScroll(function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var y = window.pageYOffset || doc.scrollTop;
      var longEnough = doc.scrollHeight > window.innerHeight * 2;
      button.classList.toggle('is-visible', longEnough && y > window.innerHeight * 0.6);
      if (ring && max > 0) {
        ring.style.strokeDashoffset = length * (1 - Math.min(y / max, 1));
      }
    });

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  })();
})();
