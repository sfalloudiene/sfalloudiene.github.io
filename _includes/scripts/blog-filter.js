(function () {
  var tagsRoot = document.querySelector('.js-tags');
  var result = document.querySelector('.js-result');
  if (!tagsRoot || !result) { return; }

  var buttons = Array.prototype.slice.call(tagsRoot.querySelectorAll('button'));
  var showAllButton = tagsRoot.querySelector('.tag-button--all');
  var sections = Array.prototype.slice.call(result.querySelectorAll('section'));

  function setUrlQuery(query) {
    var baseUrl = window.location.href.split('?')[0];
    history.replaceState(null, '', query ? baseUrl + query : baseUrl);
  }

  function focusButton(target) {
    buttons.forEach(function (button) { button.classList.remove('focus'); });
    target.classList.add('focus');
  }

  function findButtonByTag(tag) {
    if (!tag) { return showAllButton; }
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute('data-encode') === tag) { return buttons[i]; }
    }
    return showAllButton;
  }

  function selectTag(tag, target) {
    sections.forEach(function (section) {
      var cards = section.querySelectorAll('.recent-post-card');
      var visibleCount = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(',');
        var visible = !tag || tags.indexOf(tag) !== -1;
        card.classList.toggle('d-none', !visible);
        if (visible) { visibleCount += 1; }
      });
      section.classList.toggle('d-none', visibleCount === 0);
    });

    if (target) {
      focusButton(target);
      var encoded = target.getAttribute('data-encode');
      setUrlQuery(encoded ? '?tag=' + encoded : null);
    }
  }

  tagsRoot.addEventListener('click', function (e) {
    var button = e.target.closest('button');
    if (!button) { return; }
    selectTag(button.getAttribute('data-encode'), button);
  });

  var initialTag = new URLSearchParams(window.location.search).get('tag');
  selectTag(initialTag, findButtonByTag(initialTag));
})();
