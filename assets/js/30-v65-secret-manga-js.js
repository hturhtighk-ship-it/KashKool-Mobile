/* ================================================================
   KASHKOOL v65 — SECRET MANGA CHAPTER
   Unlocked only from the Progress page while the hidden Skybreaker theme
   is active. Uses account-scoped persistence and does not alter study data.
   ================================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var body = document.body;
  var progress = document.getElementById('view-stats');
  var stain = document.getElementById('kkMangaSecretStain');
  var whisper = document.getElementById('kkMangaSecretWhisper');
  if (!root || !body || !progress || !stain) return;

  var mangaActive = false;
  var tapCount = 0;
  var tapTimer = 0;
  var whisperTimer = 0;
  var themeObserver = null;
  var thoughtField = null;
  var revealLayer = null;
  var flipBusy = false;
  var lang = (function () {
    try { return localStorage.getItem('kashkool.lang') === 'en' ? 'en' : 'ar'; }
    catch (e) { return root.lang === 'en' ? 'en' : 'ar'; }
  })();
  function tr(ar, en) {
    try { lang = localStorage.getItem('kashkool.lang') === 'en' ? 'en' : 'ar'; }
    catch (e) { lang = root.lang === 'en' ? 'en' : 'ar'; }
    return lang === 'en' ? en : ar;
  }
  function account() {
    try { return localStorage.getItem('kashkool.active.account.v1') || 'default'; }
    catch (e) { return 'default'; }
  }
  function key(name) { return 'kashkool.secret.manga.' + name + '.v1.' + account(); }
  function readFlag(name) {
    try { return localStorage.getItem(key(name)) === '1'; }
    catch (e) { return false; }
  }
  function writeFlag(name, value) {
    try { localStorage.setItem(key(name), value ? '1' : '0'); }
    catch (e) {}
  }
  function animeUnlocked() {
    try {
      if (window.KK_ANIME_UNLOCKED === true) return true;
      if (localStorage.getItem('kashkool.secret.anime-theme.unlocked.v1.' + account()) === '1') return true;
      var secrets = JSON.parse(localStorage.getItem('kashkool.theme.secrets.v1.' + account()) || 'null');
      return !!(secrets && Array.isArray(secrets.completed) && secrets.completed.indexOf('galaxy') !== -1);
    } catch (e) { return false; }
  }
  function mangaUnlocked() { return readFlag('unlocked'); }
  function isAnimeTheme() { return root.getAttribute('data-store-theme') === 'anime'; }
  function isMangaTheme() { return root.getAttribute('data-store-theme') === 'manga'; }
  function setStoreActive(theme) {
    try {
      var k = 'kashkool.store.v1.' + account();
      var data = JSON.parse(localStorage.getItem(k) || '{}');
      if (!data || typeof data !== 'object') data = {};
      if (!Array.isArray(data.owned)) data.owned = ['classic'];
      if (data.owned.indexOf('classic') < 0) data.owned.unshift('classic');
      if (mangaUnlocked() && data.owned.indexOf('manga') < 0) data.owned.push('manga');
      data.active = theme || 'anime';
      localStorage.setItem(k, JSON.stringify(data));
    } catch (e) {}
  }
  function persistMangaOwnership() {
    try {
      var k = 'kashkool.store.v1.' + account();
      var data = JSON.parse(localStorage.getItem(k) || '{}');
      if (!data || typeof data !== 'object') data = {};
      if (!Array.isArray(data.owned)) data.owned = ['classic'];
      if (data.owned.indexOf('classic') < 0) data.owned.unshift('classic');
      if (data.owned.indexOf('manga') < 0) data.owned.push('manga');
      if (!data.active) data.active = 'classic';
      localStorage.setItem(k, JSON.stringify(data));
    } catch (e) {}
    window.KK_MANGA_UNLOCKED = true;
    if (typeof window.KK_REFRESH_THEME_STORE === 'function') window.KK_REFRESH_THEME_STORE();
    document.dispatchEvent(new CustomEvent('kk-manga-unlocked'));
  }
  function reduced() {
    /* The desktop motion bridge explicitly opts the Manga engine back into full motion. */
    if (root.getAttribute('data-kk-desktop-theme-motion') === 'full') return false;
    return body.classList.contains('reduce-motion') || body.classList.contains('motion-ultra');
  }
  function pageFlip(callback) {
    if (flipBusy) { if (typeof callback === 'function') callback(); return; }
    if (reduced()) { if (typeof callback === 'function') callback(); return; }
    flipBusy = true;
    var layer = document.createElement('div');
    layer.className = 'kk-manga-turn';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<div class="kk-manga-turn__shade"></div>' +
      '<div class="kk-manga-turn__spread" aria-hidden="true">' +
        '<i class="kk-manga-turn__spread-page kk-manga-turn__spread-page--left"></i>' +
        '<i class="kk-manga-turn__spread-page kk-manga-turn__spread-page--right"></i>' +
        '<i class="kk-manga-turn__gutter"></i>' +
      '</div>' +
      '<div class="kk-manga-turn__speed"></div>' +
      '<div class="kk-manga-turn__page" aria-hidden="true">' +
        '<div class="kk-manga-turn__face kk-manga-turn__face--front"><span class="kk-manga-turn__folio">第 零 話 · الفصل التالي</span><b class="kk-manga-turn__sfx">パラッ</b><i class="kk-manga-turn__panel"></i></div>' +
        '<div class="kk-manga-turn__face kk-manga-turn__face--back"><span class="kk-manga-turn__folio">INK / PAPER / STORY</span><b class="kk-manga-turn__sfx">めくる</b><i class="kk-manga-turn__panel"></i></div>' +
        '<i class="kk-manga-turn__curl"></i>' +
      '</div>';
    body.appendChild(layer);
    window.setTimeout(function () {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
      flipBusy = false;
      if (typeof callback === 'function') callback();
    }, 1040);
  }
  function ensureThoughtField() {
    if (thoughtField && thoughtField.isConnected) return;
    thoughtField = document.createElement('div');
    thoughtField.className = 'kk-manga-thoughtfield';
    thoughtField.setAttribute('aria-hidden', 'true');
    thoughtField.innerHTML = '<i class="kk-manga-thought kk-manga-thought--one"><span>…</span></i><i class="kk-manga-thought kk-manga-thought--two"><span>!!</span></i><i class="kk-manga-thought kk-manga-thought--three"><span>キラッ</span></i>';
    body.appendChild(thoughtField);
  }
  function removeThoughtField() {
    if (thoughtField && thoughtField.parentNode) thoughtField.parentNode.removeChild(thoughtField);
    thoughtField = null;
  }
  function syncMangaRuntime() {
    var active = mangaUnlocked() && isMangaTheme();
    mangaActive = active;
    body.classList.toggle('kk-manga-active', active);
    if (active) {
      writeFlag('active', true);
      ensureThoughtField();
    } else {
      writeFlag('active', false);
      removeThoughtField();
    }
    syncMarker();
  }
  function setMangaMode(animate) {
    if (!mangaUnlocked()) return;
    function apply() {
      setStoreActive('manga');
      if (typeof window.KK_REFRESH_THEME_STORE === 'function') window.KK_REFRESH_THEME_STORE();
      root.setAttribute('data-store-theme', 'manga');
      root.setAttribute('data-theme', 'light');
      root.classList.add('has-store-theme');
      syncMangaRuntime();
      renderCharacterNote();
    }
    if (animate) pageFlip(apply); else apply();
  }
  function showWhisper(message) {
    whisper.textContent = message;
    whisper.hidden = false;
    window.clearTimeout(whisperTimer);
    whisperTimer = window.setTimeout(function () { whisper.hidden = true; }, 2500);
  }
  function showDiscoveryCover() {
    if (revealLayer && revealLayer.isConnected) return;
    revealLayer = document.createElement('div');
    revealLayer.className = 'kk-manga-reveal';
    revealLayer.setAttribute('role', 'dialog');
    revealLayer.setAttribute('aria-modal', 'true');
    revealLayer.setAttribute('aria-labelledby', 'kkMangaRevealTitle');
    revealLayer.innerHTML =
      '<div class="kk-manga-reveal__book">' +
        '<div class="kk-manga-reveal__top"><span>' + tr('تم اكتشافها · أُضيفت إلى المتجر', 'DISCOVERED · ADDED TO STORE') + '</span><span>秘密のページ · 00</span></div>' +
        '<div class="kk-manga-reveal__cover"><div class="kk-manga-reveal__symbol" aria-hidden="true">漫</div>' +
          '<h2 id="kkMangaRevealTitle">' + tr('الفصل المفقود', 'The Lost Chapter') + '</h2>' +
          '<p>' + tr('صفحة ثانية مخبأة خلف شقّ السماء. ورق دافئ، حبر، وظلال تتحرك مع كل قلبة.', 'A second secret behind Skybreaker: warm paper, ink, and motion with every page turn.') + '</p>' +
        '</div>' +
        '<div class="kk-manga-reveal__cast"><span>Naruto</span><span>Jujutsu Kaisen</span><span>Tsukasa Yuzaki</span></div>' +
        '<div class="kk-manga-reveal__bottom"><span>' + tr('حبر / ورق / ذاكرة', 'INK / PAPER / MEMORY') + '</span><span>' + tr('من اليمين إلى اليسار', 'READ RIGHT TO LEFT') + '</span></div>' +
        '<div class="kk-manga-reveal__actions"><button type="button" data-manga-open>' + tr('فعّل الثيم الآن', 'Activate theme now') + '</button><button type="button" class="secondary" data-manga-store>' + tr('اعرضه في المتجر', 'View it in Store') + '</button><button type="button" class="secondary" data-manga-close>' + tr('لاحقًا', 'Later') + '</button></div>' +
      '</div>';
    body.appendChild(revealLayer);
    var open = revealLayer.querySelector('[data-manga-open]');
    var store = revealLayer.querySelector('[data-manga-store]');
    var close = revealLayer.querySelector('[data-manga-close]');
    open.addEventListener('click', function () {
      if (revealLayer && revealLayer.parentNode) revealLayer.parentNode.removeChild(revealLayer);
      revealLayer = null;
      setMangaMode(true);
    });
    store.addEventListener('click', function () {
      if (revealLayer && revealLayer.parentNode) revealLayer.parentNode.removeChild(revealLayer);
      revealLayer = null;
      var storeTab = document.querySelector('.tab[data-view="store"]');
      if (storeTab) storeTab.click();
    });
    close.addEventListener('click', function () {
      if (revealLayer && revealLayer.parentNode) revealLayer.parentNode.removeChild(revealLayer);
      revealLayer = null;
    });
    revealLayer.addEventListener('click', function (ev) {
      if (ev.target === revealLayer) close.click();
    });
  }
  function discover() {
    writeFlag('unlocked', true);
    persistMangaOwnership();
    syncMarker();
    stain.classList.add('is-discovered');
    stain.title = tr('صفحة المانجا السرية', 'Secret Manga Page');
    stain.setAttribute('aria-label', tr('افتح ثيم المانجا السري', 'Open secret Manga theme'));
    showWhisper(tr('وجدت أثر الحبر… صفحة لم تكن في الفهرس.', 'An ink trace… a page missing from the index.'));
    pageFlip(showDiscoveryCover);
  }
  function syncMarker() {
    var visible = animeUnlocked() && isAnimeTheme() && !mangaActive && !progress.hidden;
    stain.hidden = !visible;
    if (visible && mangaUnlocked()) {
      stain.classList.add('is-discovered');
      stain.title = tr('تم اكتشافها — افتح ثيم المانجا أو استخدمه من المتجر', 'Discovered — open Manga or activate it from Store');
      stain.setAttribute('aria-label', tr('افتح ثيم المانجا المملوك', 'Open your unlocked Manga theme'));
      stain.querySelector('span').textContent = '漫';
    } else if (visible) {
      stain.querySelector('span').textContent = '墨';
      stain.title = '...';
    }
  }
  stain.addEventListener('click', function () {
    if (!animeUnlocked() || !isAnimeTheme()) return;
    if (mangaUnlocked()) { setMangaMode(true); return; }
    tapCount += 1;
    stain.classList.add('is-tapped');
    window.clearTimeout(tapTimer);
    tapTimer = window.setTimeout(function () { tapCount = 0; stain.classList.remove('is-tapped'); }, 4200);
    if (tapCount === 1) showWhisper(tr('بقعة حبر؟ ربما تخفي شيئًا…', 'An ink stain? Maybe it hides something…'));
    else if (tapCount === 2) showWhisper(tr('هناك صفحة ثانية خلف هذا الفصل.', 'There is another page behind this chapter.'));
    else if (tapCount >= 3) {
      tapCount = 0;
      stain.classList.remove('is-tapped');
      window.clearTimeout(tapTimer);
      discover();
    }
  });

  var characterNotes = {
    naruto: ['Naruto Uzumaki', 'شخصية ترتبط بالإصرار، الصداقة، وعدم الاستسلام.', 'A character defined by persistence, friendship, and refusing to give up.'],
    yuji: ['Yuji Itadori', 'شخصية تواجه عالمًا قاسيًا بقلب إنساني وشجاعة.', 'A brave, compassionate person facing a harsh world.'],
    gojo: ['Satoru Gojo', 'حضور واثق، هدوء لافت، وقوة يصعب تجاهلها.', 'A confident presence, striking calm, and formidable strength.'],
    tsukasa: ['Tsukasa Yuzaki', 'بطلة Tonikaku Kawaii؛ هادئة، ذكية، ولها حضور دافئ.', 'The heroine of Tonikaku Kawaii: calm, clever, and warmly memorable.']
  };
  var characterOfficialRefs = {
    naruto: 'https://naruto-official.com/en/anime/naruto1',
    yuji: 'https://jujutsukaisen.jp/character/index_1st.php',
    gojo: 'https://jujutsukaisen.jp/character/index_1st.php',
    tsukasa: 'https://tonikawa.com/character/tsukasa-yuzaki/'
  };
  function renderCharacterNote(id) {
    var note = document.getElementById('kkMangaCharacterNote');
    if (!note) return;
    var chosen = id && characterNotes[id] ? characterNotes[id] : null;
    if (!chosen) {
      note.innerHTML = '<span>余白</span><p>' + tr('اختر صفحة لفتح ملاحظة الشخصية.', 'Choose a page to reveal its character note.') + '</p>';
      return;
    }
    var ref = characterOfficialRefs[id];
    note.innerHTML = '<span>余白</span><div class="kk-manga-character-note__copy"><p><b>' + chosen[0] + '</b> — ' + tr(chosen[1], chosen[2]) + '</p>' +
      (ref ? '<a class="kk-manga-official-link" href="' + ref + '" target="_blank" rel="noopener noreferrer">' + tr('شاهد التصميم الرسمي للشخصية ↗', 'View official character artwork ↗') + '</a>' : '') +
      '</div>';
  }
  function applyLocalizedCopy() {
    var isEn = false;
    try { isEn = localStorage.getItem('kashkool.lang') === 'en'; } catch (e) { isEn = root.lang === 'en'; }
    lang = isEn ? 'en' : 'ar';
    var title = document.getElementById('kkMangaLibraryTitle');
    var kicker = document.querySelector('.kk-manga-kicker');
    var intro = document.querySelector('.kk-manga-library__mast p');
    var seal = document.querySelector('.kk-manga-library__seal small');
    var foot = document.querySelectorAll('.kk-manga-library__foot span');
    if (title) title.textContent = tr('مكتبة الشخصيات', 'Character Archive');
    if (kicker) kicker.textContent = tr('第零話 · الفصل المفقود', '第零話 · THE LOST CHAPTER');
    if (intro) intro.textContent = tr('أربع صفحات جانبية من عوالم مختلفة، مرسومة بروح الحبر والورق.', 'Four character pages from different worlds, framed with ink-and-paper manga craft.');
    if (seal) seal.textContent = tr('فهرس ٠٠', 'INDEX 00');
    if (foot[0]) foot[0].textContent = tr('حبر / ورق / ذاكرة', 'INK / PAPER / MEMORY');
    if (foot[1]) foot[1].textContent = tr('右から左へ · من اليمين إلى اليسار', '右から左へ · READ RIGHT TO LEFT');
    var tags = document.querySelectorAll('.kk-manga-character__meta small');
    var labels = isEn ? [
      'NARUTO · ARCHIVE 01', 'JUJUTSU KAISEN · ARCHIVE 02', 'JUJUTSU KAISEN · ARCHIVE 03', 'TONIKAKU KAWAII · ARCHIVE 04'
    ] : [
      'NARUTO · الأرشيف ٠١', 'JUJUTSU KAISEN · الأرشيف ٠٢', 'JUJUTSU KAISEN · الأرشيف ٠٣', 'TONIKAKU KAWAII · الأرشيف ٠٤'
    ];
    tags.forEach(function (tag, i) { if (labels[i]) tag.textContent = labels[i]; });
    var descriptions = isEn ? [
      'A determined ninja spirit', 'A brave heart in a world of curses', 'Calm presence and extraordinary power', 'Tonikaku Kawaii heroine · moonlight'
    ] : [
      'نينجا الإرادة', 'قلب شجاع في عالم اللعنات', 'حضور هادئ وقوة استثنائية', 'بطلة Tonikaku Kawaii · ضوء القمر'
    ];
    document.querySelectorAll('.kk-manga-character__meta em').forEach(function (el, i) { if (descriptions[i]) el.textContent = descriptions[i]; });
    var selected = document.querySelector('[data-manga-character].is-selected');
    renderCharacterNote(selected ? selected.getAttribute('data-manga-character') : null);
  }

  document.querySelectorAll('[data-manga-character]').forEach(function (card) {
    card.addEventListener('click', function () {
      var id = card.getAttribute('data-manga-character');
      document.querySelectorAll('[data-manga-character]').forEach(function (other) {
        var selected = other === card;
        other.classList.toggle('is-selected', selected);
        other.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      renderCharacterNote(id);
    });
  });

  /* Japanese right-to-left page turns accompany in-theme navigation. */
  document.addEventListener('click', function (ev) {
    if (!mangaActive) return;
    var target = ev.target && ev.target.closest ? ev.target.closest('[data-view],[data-dash-view]') : null;
    if (!target || target.disabled || target.closest('.kk-manga-exit')) return;
    pageFlip();
  }, true);

  /* Manga is a permanent store theme. A Store activation gets the same page-turn
     as direct discovery; switching away only removes its ambience and keeps ownership. */
  themeObserver = new MutationObserver(function () {
    if (isMangaTheme() && mangaUnlocked() && !mangaActive) pageFlip(syncMangaRuntime);
    else syncMangaRuntime();
  });
  themeObserver.observe(root, { attributes:true, attributeFilter:['data-store-theme'] });
  var progressObserver = new MutationObserver(syncMarker);
  progressObserver.observe(progress, { attributes:true, attributeFilter:['hidden'] });
  document.addEventListener('kk-anime-theme-unlocked', syncMarker);
  document.addEventListener('kk-manga-unlocked', function () { window.KK_MANGA_UNLOCKED = mangaUnlocked(); syncMarker(); });
  var languageObserver = new MutationObserver(applyLocalizedCopy);
  languageObserver.observe(root, { attributes:true, attributeFilter:['lang'] });
  applyLocalizedCopy();
  window.addEventListener('storage', function () { window.KK_MANGA_UNLOCKED = mangaUnlocked(); syncMangaRuntime(); applyLocalizedCopy(); });
  document.addEventListener('visibilitychange', syncMarker);
  window.addEventListener('resize', syncMarker, { passive:true });

  /* Restore only the theme runtime. Selection/ownership are restored by the normal store. */
  window.KK_MANGA_UNLOCKED = mangaUnlocked();
  if (mangaUnlocked() && isMangaTheme()) syncMangaRuntime();
  else syncMarker();
})();
