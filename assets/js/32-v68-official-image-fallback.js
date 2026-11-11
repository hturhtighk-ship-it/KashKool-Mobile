(function () {
  var fallback = { naruto: '忍', yuji: '悠', gojo: '悟', tsukasa: '司' };
  document.querySelectorAll('.kk-manga-character[data-manga-character] .kk-manga-character__official-image').forEach(function (img) {
    img.addEventListener('error', function () {
      var card = img.closest('[data-manga-character]');
      var portrait = img.closest('.kk-manga-portrait');
      if (!card || !portrait) return;
      var id = card.getAttribute('data-manga-character');
      portrait.classList.add('is-image-unavailable');
      portrait.setAttribute('data-fallback', fallback[id] || '漫');
      img.hidden = true;
    }, { once: true });
  });
})();
