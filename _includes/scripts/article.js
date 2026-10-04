(function () {
  var content = document.querySelector('.js-article-content');
  if (!content) { return; }

  content.querySelectorAll('.highlight').forEach(function (block) {
    var code = block.querySelector('code');
    var lang = code && code.getAttribute('data-lang');
    if (lang) { block.setAttribute('data-lang', lang); }
  });

  content.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(function (heading) {
    var anchor = document.createElement('a');
    anchor.className = 'anchor d-print-none';
    anchor.setAttribute('aria-hidden', 'true');
    anchor.innerHTML = '<i class="fas fa-anchor"></i>';
    heading.appendChild(anchor);
  });

  content.addEventListener('click', function (e) {
    var anchor = e.target.closest('.anchor');
    if (!anchor) { return; }
    var heading = anchor.parentElement;
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', window.location.href.split('#')[0] + '#' + heading.id);
  });
})();
