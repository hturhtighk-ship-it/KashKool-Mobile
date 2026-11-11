/* ==============================================================
   JS 23/28 · Themes & store · kashkool-theme-secrets-js · 19.7 KB
   ============================================================== */
(function () {
  'use strict';
  var ROOT = document.documentElement,
    STORE_ID = 'kashkool.theme.secrets.v1';
  var ROOMS = {
    classic: {
      icon: '📎',
      placeAr: 'درج الكشكول',
      placeEn: 'Notebook Drawer',
      titleAr: 'رسالة على الهامش',
      titleEn: 'A Note in the Margin',
      introAr:
        'بين صفحات الكشكول درج صغير لا يفتحه إلا من ينتبه للتفاصيل. حرّك المشبك لتعرف ما الذي تُرك هنا.',
      introEn:
        'A tiny drawer is hidden between the notebook pages. Move the paperclip to discover what was left behind.',
      actionAr: 'حرّك المشبك',
      actionEn: 'Move the paperclip',
      steps: 3,
      artifact: '📝',
      rewardAr: 'ورقة المذاكرة الأولى',
      rewardEn: 'The First Study Note',
      storyAr: '«كل فكرة عظيمة بدأت بملاحظة صغيرة.»',
      storyEn: '“Every great idea began as a small note.”',
    },
    school: {
      icon: '🔖',
      placeAr: 'خزانة الفصل',
      placeEn: 'Classroom Cabinet',
      titleAr: 'الخزانة رقم ٧',
      titleEn: 'Locker No. 7',
      introAr: 'هناك خزانة قديمة لا تحمل اسم طالب. رتّب الأدوات الثلاث حتى يظهر ما بداخلها.',
      introEn: 'An old locker has no student name. Arrange the three school tools to reveal what is inside.',
      actionAr: 'رتّب أداة',
      actionEn: 'Arrange a tool',
      steps: 3,
      artifact: '🏅',
      rewardAr: 'شارة الطالب الدقيق',
      rewardEn: 'The Detail-Minded Student Badge',
      storyAr: '«النظام لا يعني الكمال؛ بل أن تعرف أين تجد ما تحتاجه.»',
      storyEn: '“Organization is knowing where to find what you need.”',
    },
    football: {
      icon: '⚽',
      placeAr: 'غرفة الملابس',
      placeEn: 'The Locker Room',
      titleAr: 'اللقطة الأخيرة',
      titleEn: 'The Final Play',
      introAr: 'المباراة لم تنتهِ بعد. أمامك ثلاث تسديدات لتفتح الخزانة وتكشف شعار الفريق السري.',
      introEn: 'The match is not over. You have three shots to open the locker and reveal the team emblem.',
      actionAr: 'سدّد الكرة',
      actionEn: 'Take the shot',
      steps: 3,
      artifact: '🏆',
      rewardAr: 'شارة الهداف',
      rewardEn: 'Top Scorer Emblem',
      storyAr: '«الفريق القوي يراجع خطته، ثم يلعب بثقة.»',
      storyEn: '“A strong team reviews its plan, then plays with confidence.”',
    },
    galaxy: {
      icon: '✦',
      placeAr: 'مرصد النجوم',
      placeEn: 'The Star Observatory',
      titleAr: 'الكوكبة التي تشقّ السماء',
      titleEn: 'The Constellation That Cuts the Sky',
      introAr:
        'في أبعد نقطة من المرصد تختبئ خمس شظايا من نجم مرسوم بالحبر. اجمعها بالترتيب لتفتح هوية سرية لم تظهر في أي سجل: ثيم الأنمي «شقّ السماء».',
      introEn:
        'At the far edge of the observatory, five fragments of an ink-drawn star are hidden. Gather them to unlock a secret identity absent from every catalogue: the Skybreaker Anime theme.',
      actionAr: 'اربط شظية نجميّة',
      actionEn: 'Connect a star fragment',
      steps: 5,
      artifact: '⚔️',
      rewardAr: 'ثيم الأنمي السري · شقّ السماء',
      rewardEn: 'Secret Anime Theme · Skybreaker',
      storyAr: '«حين تكتمل الكوكبة، يتحوّل الضوء إلى ضربة حبر تشقّ صفحة جديدة.»',
      storyEn: '“When the constellation is complete, light becomes an ink slash that cuts open a new page.”',
    },
    cyber: {
      icon: '⌘',
      placeAr: 'المحطة 404',
      placeEn: 'Terminal 404',
      titleAr: 'الملف الذي اختفى',
      titleEn: 'The Missing File',
      introAr: 'تم العثور على ملف غير مفهرس. أعد تشغيل وحدات فك التشفير الأربع لفتح السجل المخفي.',
      introEn:
        'An unindexed file has been found. Restart the four decryption nodes to access the hidden log.',
      actionAr: 'شغّل وحدة فك التشفير',
      actionEn: 'Run a decoder node',
      steps: 4,
      artifact: '💾',
      rewardAr: 'ملف 404 السري',
      rewardEn: 'Secret File 404',
      storyAr: 'SYSTEM NOTE: the most useful shortcut is a clear plan.',
      storyEn: 'SYSTEM NOTE: the most useful shortcut is a clear plan.',
    },
    nature: {
      icon: '🍃',
      placeAr: 'بيت البذور',
      placeEn: 'The Seed House',
      titleAr: 'البذرة النائمة',
      titleEn: 'The Sleeping Seed',
      introAr: 'بذرة صغيرة تنتظر بعض العناية. اسقِها ثلاث مرات وشاهد ما كانت تخبئه.',
      introEn:
        'A tiny seed is waiting for a little care. Water it three times to see what it has been hiding.',
      actionAr: 'اسقِ البذرة',
      actionEn: 'Water the seed',
      steps: 3,
      artifact: '🌱',
      rewardAr: 'زهرة كشكول النادرة',
      rewardEn: 'The Rare Kashkool Bloom',
      storyAr: '«النمو الهادئ يظل نموًا، حتى لو لم يلاحظه أحد.»',
      storyEn: '“Quiet growth is still growth, even when no one notices.”',
    },
    academia: {
      icon: '🗝️',
      placeAr: 'الأرشيف المقفول',
      placeEn: 'The Locked Archive',
      titleAr: 'مخطوطة الحبر الذهبي',
      titleEn: 'The Golden-Ink Manuscript',
      introAr: 'داخل المكتبة أرشيف لا يُفتح إلا بعد تقليب صفحاته الثلاث. كل صفحة تحمل جزءًا من الحكاية.',
      introEn:
        'The library holds an archive that opens only after its three pages are turned. Each page holds part of the story.',
      actionAr: 'اقلب الصفحة',
      actionEn: 'Turn the page',
      steps: 3,
      artifact: '📜',
      rewardAr: 'مفتاح الأرشيف القديم',
      rewardEn: 'The Old Archive Key',
      storyAr: '«المعرفة التي تبحث عنها قد تكون في الصفحة التالية.»',
      storyEn: '“The knowledge you seek may be on the next page.”',
    },
    ocean: {
      icon: '🫧',
      placeAr: 'كهف اللؤلؤ',
      placeEn: 'The Pearl Cave',
      titleAr: 'سر اللؤلؤة الزرقاء',
      titleEn: 'The Blue Pearl Secret',
      introAr: 'فقاعات مضيئة تقود إلى عمق الكهف. أطلق أربع فقاعات حتى تظهر اللؤلؤة.',
      introEn: 'Glowing bubbles lead into the cave. Release four bubbles to reveal the pearl.',
      actionAr: 'أطلق فقاعة',
      actionEn: 'Release a bubble',
      steps: 4,
      artifact: '🦪',
      rewardAr: 'لؤلؤة الأعماق',
      rewardEn: 'Pearl of the Deep',
      storyAr: '«الهدوء ليس فراغًا؛ أحيانًا يخفي عالَمًا كاملًا.»',
      storyEn: '“Calm is not empty; sometimes it hides an entire world.”',
    },
    sunset: {
      icon: '☀️',
      placeAr: 'مرصد الغروب',
      placeEn: 'The Sunset Observatory',
      titleAr: 'بوصلة الشفق',
      titleEn: 'The Twilight Compass',
      introAr: 'المزولة توقفت قبل آخر شعاع. حرّكها ثلاث درجات لتستعيد البوصلة اتجاهها.',
      introEn:
        'The sundial stopped before the final ray. Move it through three positions to restore the compass.',
      actionAr: 'حرّك المزولة',
      actionEn: 'Move the sundial',
      steps: 3,
      artifact: '🧭',
      rewardAr: 'بوصلة الشفق الذهبية',
      rewardEn: 'The Golden Twilight Compass',
      storyAr: '«لكل نهاية ضوء صغير يدلّك على بداية جديدة.»',
      storyEn: '“Every ending leaves a little light pointing toward a new beginning.”',
    },
    mono: {
      icon: '◧',
      placeAr: 'الغرفة 0/1',
      placeEn: 'Room 0/1',
      titleAr: 'النمط الناقص',
      titleEn: 'The Missing Pattern',
      introAr: 'ثلاث خانات غير متوازنة. اضبط مفاتيح النمط حتى تكتمل الصورة بالأبيض والأسود.',
      introEn:
        'Three unbalanced tiles remain. Set the pattern switches to complete the black-and-white picture.',
      actionAr: 'اضبط المفتاح',
      actionEn: 'Set a switch',
      steps: 3,
      artifact: '◈',
      rewardAr: 'ختم الصفر والواحد',
      rewardEn: 'The Zero-One Seal',
      storyAr: '«أحيانًا تكفي أبسط القواعد لصنع نظام كامل.»',
      storyEn: '“Sometimes the simplest rules create a complete system.”',
    },
    frost: {
      icon: '❄️',
      placeAr: 'كهف الجليد',
      placeEn: 'The Ice Cave',
      titleAr: 'بلّورة الصقيع',
      titleEn: 'The Frost Crystal',
      introAr: 'طبقة رقيقة من الجليد تغطي بلّورة صغيرة. ادفئها أربع مرات لتظهر صافية.',
      introEn: 'A thin layer of ice covers a small crystal. Warm it four times until it clears.',
      actionAr: 'ادفئ الجليد',
      actionEn: 'Warm the ice',
      steps: 4,
      artifact: '💎',
      rewardAr: 'بلّورة الصقيع الصافية',
      rewardEn: 'The Clear Frost Crystal',
      storyAr: '«الوضوح يأتي بعد صبر قصير ودفء ثابت.»',
      storyEn: '“Clarity comes after a little patience and steady warmth.”',
    },
    rose: {
      icon: '🏜️',
      placeAr: 'حديقة الكثبان',
      placeEn: 'The Dune Garden',
      titleAr: 'وردة الصحراء',
      titleEn: 'The Desert Rose',
      introAr: 'بين الكثبان وردة من بلّور الرمل لا يراها إلا من يمرّ بهدوء. امسح الرمل ثلاث مرات.',
      introEn:
        'Between the dunes sits a rose of sand crystal that only the patient can see. Brush the sand away three times.',
      actionAr: 'امسح الرمل',
      actionEn: 'Brush the sand',
      steps: 3,
      artifact: '🌹',
      rewardAr: 'وردة الرمل النادرة',
      rewardEn: 'The Rare Sand Rose',
      storyAr: '«أجمل الأشياء تنمو في الأماكن الهادئة.»',
      storyEn: '“The loveliest things grow in quiet places.”',
    },
    golden: {
      icon: '🪞',
      placeAr: 'شرفة الغروب',
      placeEn: 'The Golden Balcony',
      titleAr: 'الشعاع الأخير',
      titleEn: 'The Last Ray',
      introAr: 'الشمس على وشك الغياب. أدِر المرآة ثلاث مرات لتلتقط آخر شعاع.',
      introEn: 'The sun is about to set. Turn the mirror three times to catch the last ray.',
      actionAr: 'أدِر المرآة',
      actionEn: 'Turn the mirror',
      steps: 3,
      artifact: '✨',
      rewardAr: 'قطرة الضوء الذهبية',
      rewardEn: 'The Golden Drop of Light',
      storyAr: '«الساعة الذهبية قصيرة، فاستثمرها بتركيز.»',
      storyEn: '“The golden hour is short, so spend it with focus.”',
    },
  };
  var MARKERS = {
    classic: '⌁',
    school: '▰',
    football: '⚽',
    galaxy: '✦',
    cyber: '⌘',
    nature: '❧',
    academia: '⚿',
    ocean: '◌',
    sunset: '☼',
    mono: '◧',
    frost: '❅',
    rose: '✿',
    golden: '◎',
  };
  var state = { visited: [], completed: [], progress: {} };
  var layer = null,
    previousOverflow = '';
  function lang() {
    return ROOT.lang === 'en' ? 'en' : 'ar';
  }
  function tr(ar, en) {
    return lang() === 'en' ? en : ar;
  }
  function theme() {
    return ROOT.getAttribute('data-store-theme') || 'classic';
  }
  function account() {
    try {
      return localStorage.getItem('kashkool.active.account.v1') || 'default';
    } catch (e) {
      return 'default';
    }
  }
  function key() {
    return STORE_ID + '.' + account();
  }
  function load() {
    try {
      var x = JSON.parse(localStorage.getItem(key()) || 'null');
      if (x && typeof x === 'object') {
        state.visited = Array.isArray(x.visited) ? x.visited : [];
        state.completed = Array.isArray(x.completed) ? x.completed : [];
        state.progress = x.progress && typeof x.progress === 'object' ? x.progress : {};
      }
    } catch (e) {
      /* Keep the in-memory discovery state if storage is unavailable. */
    }
  }
  function save() {
    try {
      localStorage.setItem(key(), JSON.stringify(state));
    } catch (e) {}
  }
  function safeProgress(id) {
    var n = Number(state.progress[id]) || 0;
    return Math.max(0, Math.min(ROOMS[id].steps, n));
  }
  function awake(id) {
    return state.completed.indexOf(id) !== -1;
  }
  /* No visible button anywhere: a room opens only from a hidden gesture. */
  var HOT = {
    classic: { l: 14, b: '19%' },
    school: { l: 39, t: '38%' },
    football: { r: 15, b: '18%' },
    galaxy: { r: '2%', t: '62%' },
    cyber: { c: 1, b: 13 },
    nature: { r: 13, b: '17%' },
    academia: { l: 14, t: 14 },
    ocean: { c: 1, b: 18 },
    sunset: { r: 13, t: '43%' },
    mono: { r: 13, b: 13 },
    frost: { r: 12, t: '36%' },
    rose: { l: 12, b: '22%' },
    golden: { l: 14, t: '40%' },
  };
  var tapsHot = [],
    tapsBrand = [];
  function px(v, total) {
    return typeof v === 'string' ? (parseFloat(v) / 100) * total : v;
  }
  function hotPoint(id) {
    var h = HOT[id];
    if (!h) return null;
    var W = window.innerWidth,
      H = window.innerHeight,
      S = 48;
    var x = h.l != null ? px(h.l, W) + S / 2 : h.r != null ? W - px(h.r, W) - S / 2 : W / 2;
    var y = h.t != null ? px(h.t, H) + S / 2 : H - px(h.b, H) - S / 2;
    return { x: x, y: y };
  }
  function interactive(el) {
    return !!(
      el &&
      el.closest &&
      el.closest(
        'button,a,input,select,textarea,label,summary,[role="tab"],[role="button"],[contenteditable="true"],.kk-secret-backdrop',
      )
    );
  }
  function burst(list, n, ms) {
    var now = Date.now();
    list.push(now);
    while (list.length && now - list[0] > ms) list.shift();
    if (list.length >= n) {
      list.length = 0;
      return true;
    }
    return false;
  }
  function reveal(id) {
    try {
      if (navigator.vibrate) navigator.vibrate(18);
    } catch (e) {}
    openRoom(id);
  }
  function makeSpot() {}
  function syncSpot() {
    var old = document.getElementById('kkThemeSecretSpot');
    if (old) old.remove();
    var hint = document.getElementById('kk-anime-constellation-hint');
    if (hint) hint.remove();
    ROOT.removeAttribute('data-secret-awake');
    if (theme() === 'galaxy' && !awake('galaxy')) {
      hint = document.createElement('i');
      hint.id = 'kk-anime-constellation-hint';
      hint.className = 'kk-anime-constellation-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.title = tr('وميض صغير عند حافة المرصد', 'A small glimmer at the observatory edge');
      document.body.appendChild(hint);
    }
  }
  document.addEventListener(
    'pointerup',
    function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (layer && !layer.hidden) return;
      if (document.body && document.body.classList.contains('focus-active')) return;
      var id = theme();
      if (!ROOMS[id] || interactive(e.target)) return;
      var p = hotPoint(id);
      if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) <= 34) {
        tapsBrand.length = 0;
        if (burst(tapsHot, 3, 2200)) reveal(id);
        return;
      }
      tapsHot.length = 0;
      if (e.target.closest && e.target.closest('.brand')) {
        if (burst(tapsBrand, 7, 4500)) reveal(id);
      } else tapsBrand.length = 0;
    },
    true,
  );
  function ensureLayer() {
    if (layer) return;
    layer = document.createElement('div');
    layer.className = 'kk-secret-backdrop';
    layer.id = 'kkThemeSecretRoom';
    layer.hidden = true;
    layer.innerHTML =
      '<section class="kk-secret-room" role="dialog" aria-modal="true" aria-labelledby="kkSecretTitle"><div class="kk-secret-head"><span class="kk-secret-mark" id="kkSecretIcon" aria-hidden="true"></span><button type="button" class="kk-secret-close" id="kkSecretClose" aria-label="Close">×</button></div><div class="kk-secret-eyebrow" id="kkSecretPlace"></div><h2 id="kkSecretTitle"></h2><p class="kk-secret-intro" id="kkSecretIntro"></p><div class="kk-secret-scene"><div class="kk-secret-artifact" id="kkSecretArtifact" aria-hidden="true"></div><div class="kk-secret-pips" id="kkSecretPips"></div><div class="kk-secret-progress" id="kkSecretProgress"></div><button type="button" class="kk-secret-action" id="kkSecretAction"></button><div class="kk-secret-reward" id="kkSecretReward" hidden></div></div><div class="kk-secret-foot"><span id="kkSecretStory"></span><span class="kk-secret-counter"><span id="kkSecretCount"></span><i><b id="kkSecretCountBar"></b></i></span></div></section>';
    layer.addEventListener('click', function (e) {
      if (e.target === layer) closeRoom();
    });
    layer.querySelector('#kkSecretClose').addEventListener('click', closeRoom);
    layer.querySelector('#kkSecretAction').addEventListener('click', advanceRoom);
    document.addEventListener('keydown', function (e) {
      if (!layer.hidden && e.key === 'Escape') {
        e.preventDefault();
        closeRoom();
      }
    });
    document.body.appendChild(layer);
  }
  var openedId = '';
  function openRoom(id) {
    var cfg = ROOMS[id];
    if (!cfg) return;
    load();
    ensureLayer();
    openedId = id;
    if (state.visited.indexOf(id) === -1) state.visited.push(id);
    save();
    syncStoreCounter();
    var card = layer.querySelector('.kk-secret-room');
    card.className = 'kk-secret-room kk-secret--' + id;
    var p = safeProgress(id),
      done = awake(id),
      en = lang() === 'en';
    layer.querySelector('#kkSecretIcon').textContent = cfg.icon;
    layer.querySelector('#kkSecretClose').setAttribute('aria-label', tr('إغلاق', 'Close'));
    layer.querySelector('#kkSecretPlace').textContent = tr(
      'موقع سري · ' + cfg.placeAr,
      'HIDDEN LOCATION · ' + cfg.placeEn,
    );
    layer.querySelector('#kkSecretTitle').textContent = tr(cfg.titleAr, cfg.titleEn);
    layer.querySelector('#kkSecretIntro').textContent = tr(cfg.introAr, cfg.introEn);
    layer.querySelector('#kkSecretStory').textContent = done
      ? tr(
          'اكتمل الاكتشاف. احتفظ بهذه الذكرى داخل هذا الثيم.',
          'Discovery complete. This keepsake belongs to this theme.',
        )
      : tr(cfg.storyAr, cfg.storyEn);
    layer.querySelector('#kkSecretArtifact').textContent = done ? cfg.artifact : cfg.icon;
    layer.querySelector('#kkSecretArtifact').classList.toggle('is-revealed', done);
    layer.querySelector('#kkSecretPips').innerHTML = Array.from({ length: cfg.steps }, function (_, i) {
      return '<i class="' + (i < p ? 'is-done' : '') + '"></i>';
    }).join('');
    layer.querySelector('#kkSecretProgress').textContent = tr(
      'خطوات الاكتشاف: ' + p + ' / ' + cfg.steps,
      'Discovery steps: ' + p + ' / ' + cfg.steps,
    );
    var action = layer.querySelector('#kkSecretAction');
    action.disabled = done;
    action.textContent = done
      ? tr('تم كشف السر ✓', 'Secret revealed ✓')
      : tr(
          cfg.actionAr + ' · ' + (p + 1) + '/' + cfg.steps,
          cfg.actionEn + ' · ' + (p + 1) + '/' + cfg.steps,
        );
    var reward = layer.querySelector('#kkSecretReward');
    reward.hidden = !done;
    reward.innerHTML = done
      ? '<strong>' +
        tr('تم العثور على القطعة النادرة!', 'Rare item discovered!') +
        '</strong>' +
        tr(cfg.rewardAr, cfg.rewardEn)
      : '';
    updateCount();
    previousOverflow = document.body.style.overflow;
    layer.hidden = false;
    document.body.style.overflow = 'hidden';
    window.setTimeout(function () {
      var c = layer && layer.querySelector('#kkSecretClose');
      if (c) c.focus();
    }, 40);
  }
  function refreshOpenRoomLanguage() {
    var cfg = ROOMS[openedId];
    if (!cfg || !layer || layer.hidden) return;
    var p = safeProgress(openedId),
      done = awake(openedId),
      action = layer.querySelector('#kkSecretAction');
    layer.querySelector('#kkSecretClose').setAttribute('aria-label', tr('إغلاق', 'Close'));
    layer.querySelector('#kkSecretPlace').textContent = tr(
      'موقع سري · ' + cfg.placeAr,
      'HIDDEN LOCATION · ' + cfg.placeEn,
    );
    layer.querySelector('#kkSecretTitle').textContent = tr(cfg.titleAr, cfg.titleEn);
    layer.querySelector('#kkSecretIntro').textContent = tr(cfg.introAr, cfg.introEn);
    layer.querySelector('#kkSecretStory').textContent = done
      ? tr(
          'اكتمل الاكتشاف. احتفظ بهذه الذكرى داخل هذا الثيم.',
          'Discovery complete. This keepsake belongs to this theme.',
        )
      : tr(cfg.storyAr, cfg.storyEn);
    layer.querySelector('#kkSecretProgress').textContent = tr(
      'خطوات الاكتشاف: ' + p + ' / ' + cfg.steps,
      'Discovery steps: ' + p + ' / ' + cfg.steps,
    );
    action.disabled = done;
    action.textContent = done
      ? tr('تم كشف السر ✓', 'Secret revealed ✓')
      : tr(
          cfg.actionAr + ' · ' + (p + 1) + '/' + cfg.steps,
          cfg.actionEn + ' · ' + (p + 1) + '/' + cfg.steps,
        );
    var reward = layer.querySelector('#kkSecretReward');
    reward.hidden = !done;
    reward.innerHTML = done
      ? '<strong>' +
        tr('تم العثور على القطعة النادرة!', 'Rare item discovered!') +
        '</strong>' +
        tr(cfg.rewardAr, cfg.rewardEn)
      : '';
    updateCount();
  }
  function updateCount() {
    if (!layer) return;
    load();
    var found = state.visited.length,
      total = Object.keys(ROOMS).length;
    layer.querySelector('#kkSecretCount').textContent = tr(
      'أماكن مكتشفة ' + found + '/' + total,
      'Places found ' + found + '/' + total,
    );
    layer.querySelector('#kkSecretCountBar').style.width = (found / total) * 100 + '%';
  }
  function advanceRoom() {
    if (!openedId || awake(openedId)) return;
    var cfg = ROOMS[openedId];
    load();
    var p = safeProgress(openedId) + 1;
    state.progress[openedId] = p;
    if (p >= cfg.steps && state.completed.indexOf(openedId) === -1) state.completed.push(openedId);
    save();
    if (openedId === 'galaxy' && typeof window.KK_UNLOCK_ANIME_THEME === 'function')
      window.KK_UNLOCK_ANIME_THEME();
    syncSpot();
    var done = awake(openedId),
      action = layer.querySelector('#kkSecretAction');
    layer.querySelector('#kkSecretPips').innerHTML = Array.from({ length: cfg.steps }, function (_, i) {
      return '<i class="' + (i < p ? 'is-done' : '') + '"></i>';
    }).join('');
    layer.querySelector('#kkSecretProgress').textContent = tr(
      'خطوات الاكتشاف: ' + p + ' / ' + cfg.steps,
      'Discovery steps: ' + p + ' / ' + cfg.steps,
    );
    if (done) {
      layer.querySelector('#kkSecretArtifact').textContent = cfg.artifact;
      layer.querySelector('#kkSecretArtifact').classList.add('is-revealed');
      action.disabled = true;
      action.textContent = tr('تم كشف السر ✓', 'Secret revealed ✓');
      var reward = layer.querySelector('#kkSecretReward');
      reward.hidden = false;
      reward.innerHTML =
        '<strong>' +
        tr('تم العثور على القطعة النادرة!', 'Rare item discovered!') +
        '</strong>' +
        tr(cfg.rewardAr, cfg.rewardEn);
      layer.querySelector('#kkSecretStory').textContent = tr(
        'اكتمل الاكتشاف. احتفظ بهذه الذكرى داخل هذا الثيم.',
        'Discovery complete. This keepsake belongs to this theme.',
      );
      try {
        if (navigator.vibrate) navigator.vibrate([20, 35, 20]);
      } catch (e) {}
    } else {
      action.textContent = tr(
        cfg.actionAr + ' · ' + (p + 1) + '/' + cfg.steps,
        cfg.actionEn + ' · ' + (p + 1) + '/' + cfg.steps,
      );
    }
    updateCount();
    syncStoreCounter();
  }
  function closeRoom() {
    if (!layer || layer.hidden) return;
    layer.hidden = true;
    document.body.style.overflow = previousOverflow;
  }
  function syncStoreCounter() {
    var host = document.getElementById('storeGrid');
    if (!host) return;
    load();
    var old = host.querySelector('.kk-secret-counter-panel');
    if (!state.visited.length) {
      if (old) old.remove();
      return;
    }
    var cards = host.querySelector('.storeThemeGrid');
    if (!cards) return;
    if (!old) {
      old = document.createElement('div');
      old.className = 'kk-secret-counter-panel';
      cards.after(old);
    }
    var n = state.visited.length,
      total = Object.keys(ROOMS).length,
      complete = state.completed.length;
    var signature = n + ':' + complete + ':' + lang();
    if (old.getAttribute('data-state') === signature) return;
    old.setAttribute('data-state', signature);
    old.innerHTML =
      '<span class="kk-secret-counter-icon">✧</span><div><b>' +
      tr('دفتر الاكتشافات', 'Discovery Log') +
      '</b><small>' +
      tr(
        'اكتشفت ' + n + ' من ' + total + ' أماكن مخفية · ' + complete + ' أسرار مكتملة',
        'Found ' + n + ' of ' + total + ' hidden places · ' + complete + ' secrets completed',
      ) +
      '</small><i><b style="width:' +
      (n / total) * 100 +
      '%"></b></i></div>';
  }
  function init() {
    load();
    syncSpot();
    syncStoreCounter();
  }
  var store = document.getElementById('storeGrid');
  if (store)
    new MutationObserver(function () {
      syncStoreCounter();
    }).observe(store, { childList: true, subtree: true });
  new MutationObserver(function (mutations) {
    var languageChanged = mutations.some(function (m) {
      return m.attributeName === 'lang';
    });
    syncSpot();
    if (languageChanged) {
      syncStoreCounter();
      if (layer && !layer.hidden && openedId) refreshOpenRoomLanguage();
    }
  }).observe(ROOT, { attributes: true, attributeFilter: ['data-store-theme', 'lang'] });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) syncSpot();
  });
  init();
})();
