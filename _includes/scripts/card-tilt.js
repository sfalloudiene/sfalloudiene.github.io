(function () {
  if (!window.matchMedia) { return; }
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) { return; }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

  var MAX_DEG = 7;

  document.querySelectorAll('.recent-post-card, .project-card').forEach(function (card) {
    var frame = null;

    card.addEventListener('mouseenter', function () {
      // scroll-reveal.js pose un transitionDelay de cascade : sans ce reset,
      // l'inclinaison suivrait la souris avec ce retard.
      card.style.transitionDelay = '0ms';
      card.classList.add('is-tilting');
    });

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      if (frame) { cancelAnimationFrame(frame); }
      frame = requestAnimationFrame(function () {
        card.style.transform = 'perspective(900px) rotateX(' + (-py * MAX_DEG).toFixed(2) +
          'deg) rotateY(' + (px * MAX_DEG).toFixed(2) + 'deg) translateY(-4px)';
        card.style.setProperty('--glare-x', ((px + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--glare-y', ((py + 0.5) * 100).toFixed(1) + '%');
      });
    });

    card.addEventListener('mouseleave', function () {
      if (frame) { cancelAnimationFrame(frame); }
      card.classList.remove('is-tilting');
      card.style.transform = '';
    });
  });
})();
