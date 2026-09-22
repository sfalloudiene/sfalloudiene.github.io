(function () {
  var STORAGE_KEY = 'theme-skin';
  var link = document.getElementById('theme-css');
  var toggle = document.querySelector('.js-theme-toggle');
  if (!link || !toggle) { return; }

  var icon = toggle.querySelector('i');

  function setIcon(theme) {
    if (!icon) { return; }
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  function syncGiscusTheme(theme) {
    var iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) { return; }
    iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: theme } } }, 'https://giscus.app');
  }

  function applyTheme(theme) {
    link.setAttribute('href', theme === 'dark' ? link.getAttribute('data-dark-href') : link.getAttribute('data-light-href'));
    document.documentElement.setAttribute('data-theme', theme);
    setIcon(theme);
    syncGiscusTheme(theme);
  }

  setIcon(document.documentElement.getAttribute('data-theme') || 'light');

  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    applyTheme(next);
  });
})();
