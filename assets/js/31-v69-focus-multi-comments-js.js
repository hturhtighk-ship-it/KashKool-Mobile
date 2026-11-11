/* ================================================================
   KASHKOOL v69 — MULTI CHARACTER MANGA COMMENTS
   Character comments can coexist. During Focus Mode the dock is moved
   inside #focusOverlay so body.focus-active cannot hide it.
   ================================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var body = document.body;
  if (!root || !body || window.__KKMangaMultiCommentsV69) return;
  window.__KKMangaMultiCommentsV69 = true;

  var dock = null;
  var nextId = 0;
  var MAX_VISIBLE = 3;
  var MOMENT_LIFETIME = 8500;
  var characters = {
    naruto: {
      image: 'https://www.tv-tokyo.co.jp/anime/naruto/sp/images/chara/chara_01_1.png',
      index: '01', name: 'Naruto Uzumaki', glyph: '忍', series: 'NARUTO', sfx: 'ドンッ',
      ar: 'جاهز؟ اختر خطوة واحدة وابدأ. الاستمرار أهم من السرعة، وكل إنجاز كبير يبدأ من هنا.',
      en: 'Ready? Choose one step and begin. Consistency matters more than speed; every big achievement starts here.',
      url: 'https://naruto-official.com/en/anime/naruto1'
    },
    yuji: {
      image: 'https://jujutsukaisen.jp/images/chara_detail1.png',
      index: '02', name: 'Yuji Itadori', glyph: '悠', series: 'JUJUTSU KAISEN', sfx: 'よし！',
      ar: 'رائع! خطوة أخرى أصبحت خلفك. خذ نفساً، ثم واجه الخطوة التالية بنفس العزيمة.',
      en: 'Nice! Another step is behind you. Take a breath, then face the next one with the same determination.',
      url: 'https://jujutsukaisen.jp/character/index_1st.php'
    },
    gojo: {
      image: 'https://jujutsukaisen.jp/images/chara_detail4.png',
      index: '03', name: 'Satoru Gojo', glyph: '悟', series: 'JUJUTSU KAISEN', sfx: 'バンッ',
      ar: 'انتهت جولة التركيز. أحسنت! استرح قليلاً، ثم ارجع بخطة واضحة.',
      en: 'Focus round complete. Well done! Rest for a moment, then return with a clear plan.',
      url: 'https://jujutsukaisen.jp/character/index_1st.php'
    },
    tsukasa: {
      image: 'https://tonikawa.com/assets/images/sp/character/img_tsukasa-yuzaki.png',
      index: '04', name: 'Tsukasa Yuzaki', glyph: '司', series: 'TONIKAKU KAWAII', sfx: 'キラッ',
      ar: 'أحسنت! خطوة جديدة اكتملت. لا تنسَ أن تمنح نفسك استراحة صغيرة قبل التالية.',
      en: 'Nicely done! Another step is complete. Remember to take a small break before the next one.',
      url: 'https://tonikawa.com/character/tsukasa-yuzaki/'
    }
  };

  function isManga() { return root.getAttribute('data-store-theme') === 'manga'; }
  function isFocusActive() { return body.classList.contains('focus-active'); }
  function lang() {
    try { return localStorage.getItem('kashkool.lang') === 'en' ? 'en' : 'ar'; }
    catch (e) { return root.lang === 'en' ? 'en' : 'ar'; }
  }
  function ensureDock() {
    if (!dock || !dock.isConnected) {
      dock = document.createElement('aside');
      dock.className = 'kk-manga-moment-dock';
      dock.id = 'kkMangaMomentDock';
      dock.setAttribute('aria-label', lang() === 'en' ? 'Manga character comments' : 'تعليقات شخصيات المانجا');
      dock.setAttribute('aria-live', 'polite');
      dock.setAttribute('aria-relevant', 'additions text');
    }
    moveDockToCurrentLayer();
    return dock;
  }
  function moveDockToCurrentLayer() {
    if (!dock) return;
    var overlay = document.getElementById('focusOverlay');
    var target = isFocusActive() && overlay ? overlay : body;
    if (dock.parentNode !== target) target.appendChild(dock);
  }
  function removeMoment(card, immediate) {
    if (!card || !card.parentNode) return;
    window.clearTimeout(card.__kkTimer || 0);
    if (immediate) {
      card.remove();
      return;
    }
    card.classList.add('is-leaving');
    window.setTimeout(function () { if (card.parentNode) card.remove(); }, 330);
  }
  function portraitMarkup(id, c) {
    var safeName = String(c.name || id).replace(/[&<>"']/g, '');
    var safeGlyph = String(c.glyph || '漫').replace(/[&<>"']/g, '');
    return '<div class="kk-manga-moment__portrait-frame" data-character="' + id + '">' +
      '<img class="kk-manga-moment__portrait" src="' + c.image + '" alt="' + safeName + '" loading="eager" decoding="async" referrerpolicy="no-referrer">' +
      '<span class="kk-manga-moment__portrait-index">' + c.index + '</span>' +
      '<b class="kk-manga-moment__portrait-fallback" aria-hidden="true">' + safeGlyph + '</b>' +
      '</div>';
  }
  function sourceMessage(id, source, c, language) {
    if (source === 'focus-enter' && id === 'naruto') {
      return language === 'en' ? 'Ready? Pick one clear goal and give it your full attention.' : 'جاهز؟ اختَر هدفاً واضحاً وامنحه تركيزك بالكامل.';
    }
    if (source === 'focus-step' && id === 'yuji') {
      return language === 'en' ? 'One more step cleared! Keep your momentum going.' : 'خطوة أخرى أُنجزت! حافظ على حماسك واستمر.';
    }
    if (source === 'focus-session' && id === 'gojo') {
      return language === 'en' ? 'That was a solid round. Take a short break before the next one.' : 'كانت جولة قوية. خذ استراحة قصيرة قبل الجولة التالية.';
    }
    return language === 'en' ? c.en : c.ar;
  }
  function showMoment(id, source) {
    if (!isManga()) return null;
    var c = characters[id];
    if (!c) return null;
    var language = lang();
    var host = ensureDock();
    var card = document.createElement('article');
    card.className = 'kk-manga-moment';
    card.dataset.character = id;
    card.dataset.source = source || 'general';
    card.dataset.momentId = String(++nextId);
    card.innerHTML = portraitMarkup(id, c) +
      '<div class="kk-manga-moment__copy">' +
        '<small class="kk-manga-moment__eyebrow">' + c.series + ' · ' + (language === 'en' ? 'FOCUS CHAPTER' : 'لقطة من فصل التركيز') + '</small>' +
        '<div class="kk-manga-moment__balloon" role="group" aria-label="' + (language === 'en' ? 'Character comment' : 'تعليق الشخصية') + '">' +
          '<span class="kk-manga-moment__sfx" aria-hidden="true">' + c.sfx + '</span>' +
          '<strong class="kk-manga-moment__name">' + c.name + '</strong>' +
          '<p class="kk-manga-moment__message">' + sourceMessage(id, source, c, language) + '</p>' +
        '</div>' +
        '<a class="kk-manga-moment__link" href="' + c.url + '" target="_blank" rel="noopener noreferrer">' +
          (language === 'en' ? 'Character reference ↗' : 'مرجع الشخصية ↗') + '</a>' +
      '</div>' +
      '<button type="button" class="kk-manga-moment__close" aria-label="' + (language === 'en' ? 'Close comment' : 'إغلاق التعليق') + '">×</button>';
    card.querySelector('.kk-manga-moment__close').addEventListener('click', function () { removeMoment(card, false); });
    var img = card.querySelector('.kk-manga-moment__portrait');
    img.addEventListener('error', function () {
      var frame = img.parentElement;
      if (frame) frame.classList.add('is-image-unavailable');
      img.hidden = true;
    }, { once: true });

    host.appendChild(card);
    /* Keep multiple independent character comments visible together without covering the whole focus screen. */
    while (host.querySelectorAll('.kk-manga-moment').length > MAX_VISIBLE) {
      var oldest = host.querySelector('.kk-manga-moment');
      if (!oldest || oldest === card) break;
      removeMoment(oldest, true);
    }
    card.__kkTimer = window.setTimeout(function () { removeMoment(card, false); }, MOMENT_LIFETIME);
    return card;
  }
  window.KKMangaCharacterMoment = function (id, source) { return showMoment(id, source); };

  /* Move the exact same dock into the focus overlay: body.focus-active hides its other direct children. */
  var focusObserver = new MutationObserver(moveDockToCurrentLayer);
  focusObserver.observe(body, { attributes: true, attributeFilter: ['class'] });
  moveDockToCurrentLayer();

  /* Progress page companion remains available outside Focus Mode. */
  var progressVisit = 0;
  document.addEventListener('click', function (ev) {
    var tab = ev.target && ev.target.closest ? ev.target.closest('[data-view="stats"]') : null;
    if (!tab || !isManga()) return;
    var stamp = Date.now();
    if (stamp - progressVisit < 1600) return;
    progressVisit = stamp;
    window.setTimeout(function () { showMoment('naruto', 'progress'); }, 520);
  }, true);

  function clearAll() {
    if (!dock) return;
    dock.querySelectorAll('.kk-manga-moment').forEach(function (card) { removeMoment(card, true); });
  }
  new MutationObserver(function () { if (!isManga()) clearAll(); }).observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearAll(); });
  window.addEventListener('pagehide', clearAll);
})();
