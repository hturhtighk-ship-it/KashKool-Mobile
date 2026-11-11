/* ==============================================================
   JS 26/28 · Themes & store · kashkool-v53-frost-ember-cinematic-js · 11.0 KB
   ============================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var ACCOUNT_KEY = 'kashkool.active.account.v1';
  function activeAccount() {
    try {
      return localStorage.getItem(ACCOUNT_KEY) || 'default';
    } catch (e) {
      return 'default';
    }
  }
  function unlockKey() {
    return 'kashkool.secret.fire-theme.unlocked.v1.' + activeAccount();
  }
  function isFireUnlocked() {
    try {
      return localStorage.getItem(unlockKey()) === '1';
    } catch (e) {
      return false;
    }
  }
  try {
    Object.defineProperty(window, 'KK_FIRE_UNLOCKED', { configurable: true, get: isFireUnlocked });
  } catch (e) {
    window.KK_FIRE_UNLOCKED = isFireUnlocked();
  }
  function tr(ar, en) {
    return root.lang === 'en' ? en : ar;
  }
  function reduced() {
    return (
      !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      document.body.classList.contains('reduce-motion') ||
      document.body.classList.contains('motion-ultra')
    );
  }

  /* Timer-room hidden hotspot: a discreet star embedded in the icy Pomodoro ring. */
  var ring = document.getElementById('pomoRing');
  var seal = null,
    taps = 0,
    tapTimer = 0;
  if (ring) {
    ring.style.position = 'relative';
    seal = document.createElement('button');
    seal.type = 'button';
    seal.className = 'kk-ember-seal';
    seal.textContent = '✧';
    seal.setAttribute('aria-label', tr('نجمة صغيرة محبوسة في الجليد', 'A tiny star trapped in the ice'));
    seal.title = tr('هناك شيء دافئ خلف الجليد', 'Something warm is trapped behind the ice');
    ring.appendChild(seal);
    seal.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (root.getAttribute('data-store-theme') !== 'frost') return;
      if (isFireUnlocked()) {
        openPortal(true);
        return;
      }
      if (tapTimer) clearTimeout(tapTimer);
      tapTimer = setTimeout(function () {
        taps = 0;
        seal.classList.remove('is-charging');
      }, 4200);
      taps++;
      seal.classList.add('is-charging');
      seal.textContent = taps < 5 ? '✦' : '✹';
      seal.style.setProperty('--tap-count', String(taps));
      if (taps >= 5) {
        taps = 0;
        clearTimeout(tapTimer);
        seal.textContent = '✧';
        seal.classList.remove('is-charging');
        openPortal(false);
      }
    });
  }

  var portal = null,
    stage = 0,
    wasUnlocked = false;
  function ensurePortal() {
    if (portal) return;
    portal = document.createElement('div');
    portal.className = 'kk-ember-portal';
    portal.id = 'kkEmberPortal';
    portal.hidden = true;
    portal.innerHTML =
      '<section class="kk-ember-card" role="dialog" aria-modal="true" aria-labelledby="kkEmberTitle">' +
      '<button class="kk-ember-close" type="button" aria-label="Close">×</button>' +
      '<div class="kk-ember-kicker">KASHKOOL · HIDDEN CHAMBER</div>' +
      '<h2 class="kk-ember-title" id="kkEmberTitle"></h2>' +
      '<p class="kk-ember-copy" id="kkEmberCopy"></p>' +
      '<div class="kk-ember-art" id="kkEmberArt" aria-hidden="true">❄</div>' +
      '<div class="kk-ember-pips" id="kkEmberPips"><i></i><i></i><i></i></div>' +
      '<div class="kk-ember-status" id="kkEmberStatus"></div>' +
      '<button class="kk-ember-action" type="button" id="kkEmberAction"></button>' +
      '<button class="kk-ember-later" type="button" id="kkEmberLater"></button>' +
      '</section>';
    portal.addEventListener('click', function (e) {
      if (e.target === portal) closePortal();
    });
    portal.querySelector('.kk-ember-close').addEventListener('click', closePortal);
    portal.querySelector('#kkEmberLater').addEventListener('click', closePortal);
    portal.querySelector('#kkEmberAction').addEventListener('click', portalAction);
    document.addEventListener('keydown', function (e) {
      if (!portal.hidden && e.key === 'Escape') {
        e.preventDefault();
        closePortal();
      }
    });
    document.body.appendChild(portal);
  }
  function openPortal(already) {
    ensurePortal();
    wasUnlocked = !!already || isFireUnlocked();
    stage = 0;
    var art = portal.querySelector('#kkEmberArt'),
      pips = portal.querySelector('#kkEmberPips');
    art.className = 'kk-ember-art' + (wasUnlocked ? ' is-free' : '');
    art.textContent = wasUnlocked ? '🔥' : '❄';
    Array.prototype.forEach.call(pips.children, function (x) {
      x.classList.remove('is-on');
    });
    portal.querySelector('#kkEmberTitle').textContent = wasUnlocked
      ? tr('بوابة لهيب الجمر', 'The Emberfire Portal')
      : tr('الجمرة المحبوسة', 'The Ember Sealed in Ice');
    portal.querySelector('#kkEmberCopy').textContent = wasUnlocked
      ? tr(
          'لقد عثرت على الشرارة بالفعل. يمكنك تفعيل هوية النار الآن، أو العودة إلى الصقيع من استوديو الثيمات.',
          'You have already found the ember. Activate the Fire identity now, or return to Frost from the Theme Studio.',
        )
      : tr(
          'داخل حلقة المؤقّت شرارة قديمة. حرّرها بثلاث لمسات؛ كل لمسة تذيب طبقة من الجليد.',
          'An ancient ember is sealed inside the timer ring. Free it with three touches; each one melts another layer of ice.',
        );
    portal.querySelector('#kkEmberStatus').textContent = wasUnlocked
      ? tr(
          'الثيم السري متاح في استوديو الثيمات مجانًا.',
          'The secret theme is now available in the Theme Studio for free.',
        )
      : tr('المرحلة ٠ من ٣ · اقتربت من كشف السر.', 'Stage 0 of 3 · The secret is close.');
    portal.querySelector('#kkEmberAction').textContent = wasUnlocked
      ? tr('🔥 تفعيل ثيم النار', '🔥 Activate Fire theme')
      : tr('أذب طبقة الجليد', 'Melt an ice layer');
    portal.querySelector('#kkEmberLater').textContent = tr('لاحقًا', 'Later');
    portal.hidden = false;
    setTimeout(function () {
      var b = portal && portal.querySelector('#kkEmberAction');
      if (b) b.focus();
    }, 30);
  }
  function closePortal() {
    if (portal && !portal.hidden) portal.hidden = true;
  }
  function saveFireUnlock() {
    try {
      localStorage.setItem(unlockKey(), '1');
    } catch (e) {}
    /* Mark it as owned in the existing theme wallet without changing its balance. */
    try {
      var k = 'kashkool.store.v1.' + activeAccount(),
        data = JSON.parse(localStorage.getItem(k) || '{}');
      if (!Array.isArray(data.owned)) data.owned = ['classic'];
      if (data.owned.indexOf('classic') < 0) data.owned.unshift('classic');
      if (data.owned.indexOf('fire') < 0) data.owned.push('fire');
      if (!Number.isFinite(+data.spentMinutes)) data.spentMinutes = 0;
      if (!data.active) data.active = 'classic';
      localStorage.setItem(k, JSON.stringify(data));
    } catch (e) {}
  }
  function activateFire() {
    saveFireUnlock();
    try {
      var k = 'kashkool.store.v1.' + activeAccount(),
        data = JSON.parse(localStorage.getItem(k) || '{}');
      if (!Array.isArray(data.owned)) data.owned = ['classic'];
      if (data.owned.indexOf('fire') < 0) data.owned.push('fire');
      data.active = 'fire';
      if (!Number.isFinite(+data.spentMinutes)) data.spentMinutes = 0;
      localStorage.setItem(k, JSON.stringify(data));
    } catch (e) {}
    closePortal();
    root.setAttribute('data-theme', 'dark');
    root.classList.add('has-store-theme');
    root.setAttribute('data-store-theme', 'fire');
    if (navigator.vibrate)
      try {
        navigator.vibrate([24, 40, 32]);
      } catch (e) {}
  }
  function portalAction() {
    if (wasUnlocked || isFireUnlocked()) {
      if (root.getAttribute('data-store-theme') === 'fire') {
        try {
          var k = 'kashkool.store.v1.' + activeAccount(),
            d = JSON.parse(localStorage.getItem(k) || '{}');
          d.active = 'frost';
          localStorage.setItem(k, JSON.stringify(d));
        } catch (e) {}
        closePortal();
        root.setAttribute('data-store-theme', 'frost');
        root.setAttribute('data-theme', 'light');
        return;
      }
      activateFire();
      return;
    }
    stage = Math.min(3, stage + 1);
    var pips = portal.querySelector('#kkEmberPips'),
      art = portal.querySelector('#kkEmberArt');
    Array.prototype.forEach.call(pips.children, function (x, i) {
      x.classList.toggle('is-on', i < stage);
    });
    art.classList.remove('is-cracking');
    void art.offsetWidth;
    art.classList.add('is-cracking');
    if (stage < 3) {
      art.textContent = stage === 1 ? '❄️' : '💠';
      portal.querySelector('#kkEmberStatus').textContent = tr(
        'طبقة الجليد المتبقية: ' + (3 - stage),
        'Ice layers remaining: ' + (3 - stage),
      );
      portal.querySelector('#kkEmberAction').textContent = tr('حرّر الشرارة التالية', 'Free the next spark');
    } else {
      saveFireUnlock();
      wasUnlocked = true;
      art.classList.add('is-free');
      art.textContent = '🔥';
      portal.querySelector('#kkEmberTitle').textContent = tr('اشتعلت الجمرة!', 'The Ember Has Awakened!');
      portal.querySelector('#kkEmberCopy').textContent = tr(
        'اكتشفت ثيمًا سريًا جديدًا: لهيب الجمر. أُضيف مجانًا إلى استوديو الثيمات، ويمكنك تفعيله الآن.',
        'You discovered a new secret theme: Emberfire. It has been added to your Theme Studio for free, and you can activate it now.',
      );
      portal.querySelector('#kkEmberStatus').textContent = tr(
        'تم فتح الثيم السري · محفوظ في هذا الحساب',
        'Secret theme unlocked · Saved to this account',
      );
      portal.querySelector('#kkEmberAction').textContent = tr('🔥 تفعيل ثيم النار', '🔥 Activate Fire theme');
      portal.querySelector('#kkEmberLater').textContent = tr('أكمل على الثلج', 'Stay with Frost');
      if (navigator.vibrate)
        try {
          navigator.vibrate([20, 35, 20, 60, 35]);
        } catch (e) {}
    }
  }

  /* Cinematic ice/fire transition when either signature theme is entered or left. */
  var tx = null,
    txTimer = 0,
    lastTheme = root.getAttribute('data-store-theme') || 'classic';
  function runTransition(next) {
    if (reduced()) return;
    if (tx) {
      tx.remove();
      tx = null;
    }
    if (txTimer) clearTimeout(txTimer);
    tx = document.createElement('div');
    tx.className = 'kk-cinematic-transition ' + (next === 'fire' ? 'is-fire' : 'is-frost');
    tx.setAttribute('aria-hidden', 'true');
    tx.innerHTML =
      '<div class="kk-tx-swipe"></div><div class="kk-tx-swipe s2"></div>' +
      '<svg viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="kk-tx-stroke" d="M-120 610 C180 420 280 520 470 370 S790 190 940 370 S1190 570 1570 230"/>' +
      '<path class="kk-tx-stroke thin" d="M-80 290 C210 440 310 120 520 260 S850 680 1020 420 S1280 270 1540 490"/>' +
      '<path class="kk-tx-stroke thin" d="M180 980 Q460 590 720 455 T1320 -80"/></svg>' +
      '<div class="kk-tx-seal">' +
      (next === 'fire' ? '🔥' : '❄') +
      '</div>';
    for (var i = 0; i < 22; i++) {
      var p = document.createElement('i');
      p.className = 'kk-tx-particle';
      var angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.32,
        dist = 90 + Math.random() * Math.min(innerWidth, innerHeight) * 0.46;
      p.style.setProperty('--x', 25 + Math.random() * 50 + '%');
      p.style.setProperty('--y', 22 + Math.random() * 56 + '%');
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      p.style.setProperty('--s', 2 + Math.random() * 5 + 'px');
      p.style.setProperty('--d', 520 + Math.random() * 440 + 'ms');
      p.style.setProperty('--delay', 80 + Math.random() * 210 + 'ms');
      tx.appendChild(p);
    }
    document.body.appendChild(tx);
    txTimer = setTimeout(function () {
      if (tx) {
        tx.remove();
        tx = null;
      }
    }, 1320);
  }
  var observer = new MutationObserver(function (records) {
    records.forEach(function (m) {
      if (m.attributeName !== 'data-store-theme') return;
      var next = root.getAttribute('data-store-theme') || 'classic';
      if (
        next !== lastTheme &&
        (next === 'fire' || next === 'frost' || lastTheme === 'fire' || lastTheme === 'frost')
      )
        runTransition(next);
      lastTheme = next;
    });
  });
  observer.observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });

  /* Keep the hidden portal available in English and Arabic after language changes. */
  new MutationObserver(function (records) {
    if (!portal || portal.hidden) return;
    if (
      records.some(function (m) {
        return m.attributeName === 'lang';
      })
    ) {
      portal.querySelector('.kk-ember-close').setAttribute('aria-label', tr('إغلاق', 'Close'));
      portal.querySelector('#kkEmberLater').textContent = tr('لاحقًا', 'Later');
    }
  }).observe(root, { attributes: true, attributeFilter: ['lang'] });
})();
