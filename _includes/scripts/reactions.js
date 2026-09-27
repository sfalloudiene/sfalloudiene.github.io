(function () {
  var LIKES_KEY = 'blog-likes';
  var RATINGS_KEY = 'blog-ratings';

  function readStore(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      return {};
    }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  var el = document.querySelector('.js-reactions');
  if (!el) { return; }
  var id = el.getAttribute('data-reactions-id');

  // Like button
  var likeBtn = el.querySelector('.js-reactions-like');
  var likeCountEl = el.querySelector('.js-reactions-like-count');
  var likes = readStore(LIKES_KEY);

  var likeIcon = likeBtn.querySelector('i');

  function renderLike(justToggled) {
    var entry = likes[id] || { liked: false, count: 0 };
    likeCountEl.textContent = entry.count;
    likeBtn.classList.toggle('reactions__like--active', !!entry.liked);
    if (justToggled && entry.liked && likeIcon) {
      likeIcon.classList.remove('pop');
      void likeIcon.offsetWidth; // force le reflow pour pouvoir rejouer l'animation
      likeIcon.classList.add('pop');
    }
  }

  likeBtn.addEventListener('click', function () {
    var entry = likes[id] || { liked: false, count: 0 };
    entry.liked = !entry.liked;
    entry.count = entry.count + (entry.liked ? 1 : -1);
    if (entry.count < 0) { entry.count = 0; }
    likes[id] = entry;
    writeStore(LIKES_KEY, likes);
    renderLike(true);
  });

  renderLike();

  // Star rating
  var stars = el.querySelectorAll('.js-reactions-star');
  var label = el.querySelector('.js-reactions-stars-label');
  var ratings = readStore(RATINGS_KEY);

  function renderStars(justSet) {
    var value = ratings[id] || 0;
    stars.forEach(function (star, index) {
      var starValue = parseInt(star.getAttribute('data-value'), 10);
      var active = starValue <= value;
      star.classList.toggle('reactions__star--active', active);
      if (justSet && active) {
        star.classList.remove('pop');
        void star.offsetWidth; // force le reflow pour pouvoir rejouer l'animation
        star.style.animationDelay = (index * 40) + 'ms';
        star.classList.add('pop');
      }
    });
    label.textContent = value ? 'Ta note : ' + value + '/5' : 'Note cet article';
  }

  stars.forEach(function (star) {
    star.addEventListener('click', function () {
      var value = parseInt(star.getAttribute('data-value'), 10);
      ratings[id] = ratings[id] === value ? 0 : value;
      writeStore(RATINGS_KEY, ratings);
      renderStars(true);
    });
  });

  renderStars();
})();
