(function () {
  var targets = document.querySelectorAll('.recent-post-card, .skill-badge, .timeline__item, .certifications__item');
  if (!targets.length) { return; }

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    for (var i = 0; i < targets.length; i++) { targets[i].classList.add('reveal', 'is-visible'); }
    return;
  }

  var counters = [];
  function nextIndex(parent) {
    for (var i = 0; i < counters.length; i++) {
      if (counters[i].el === parent) { return counters[i].count++; }
    }
    counters.push({ el: parent, count: 1 });
    return 0;
  }

  for (var j = 0; j < targets.length; j++) {
    var el = targets[j];
    el.classList.add('reveal');
    el.style.transitionDelay = (Math.min(nextIndex(el.parentElement), 8) * 70) + 'ms';
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  for (var k = 0; k < targets.length; k++) { observer.observe(targets[k]); }
})();
