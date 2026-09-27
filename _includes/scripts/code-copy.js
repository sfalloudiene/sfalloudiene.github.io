(function () {
  var blocks = document.querySelectorAll('.article__content .highlighter-rouge, .article__content figure.highlight');
  if (!blocks.length) { return; }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(textarea);
  }

  for (var i = 0; i < blocks.length; i++) {
    (function (block) {
      var code = block.querySelector('code');
      if (!code) { return; }

      block.classList.add('code-copy-wrap');

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy-btn';
      button.setAttribute('aria-label', 'Copier le code');
      button.innerHTML = '<i class="far fa-copy"></i>';
      block.appendChild(button);

      button.addEventListener('click', function () {
        var text = code.innerText || code.textContent;

        function showDone() {
          button.classList.remove('code-copy-btn--done');
          void button.offsetWidth; // force le reflow pour pouvoir rejouer l'animation
          button.innerHTML = '<i class="fas fa-check"></i>';
          button.classList.add('code-copy-btn--done');
          setTimeout(function () {
            button.classList.remove('code-copy-btn--done');
            button.innerHTML = '<i class="far fa-copy"></i>';
          }, 1500);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(showDone, showDone);
        } else {
          fallbackCopy(text);
          showDone();
        }
      });
    })(blocks[i]);
  }
})();
