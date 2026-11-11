/* ==============================================================
   JS 12/28 · Visual refinement · kashkool-v27-js · 8.8 KB
   ============================================================== */
(function () {
  'use strict';
  if (window.__kashkoolV27) return;
  window.__kashkoolV27 = true;

  var pulse = document.getElementById('kkV27Pulse');
  var pulseIcon = document.getElementById('kkV27PulseIcon');
  var pulseTitle = document.getElementById('kkV27PulseTitle');
  var pulseText = document.getElementById('kkV27PulseText');
  var pulsePrimary = document.getElementById('kkV27PulsePrimary');
  var pulseDismiss = document.getElementById('kkV27PulseDismiss');
  var tabs = document.querySelector('nav.tabs');
  var pulseHidden = false;
  var lastPulseKey = '';

  function isEn() {
    return document.documentElement.lang === 'en' || document.documentElement.dir === 'ltr';
  }
  function T(ar, en) {
    return isEn() ? en : ar;
  }
  function qs(s) {
    return document.querySelector(s);
  }
  function click(s) {
    var el = qs(s);
    if (el && typeof el.click === 'function') {
      el.click();
      return true;
    }
    return false;
  }
  function activeView() {
    var a = document.querySelector('.tab[data-view][aria-selected="true"]');
    return a ? a.getAttribute('data-view') : '';
  }
  function text(id) {
    var el = document.getElementById(id);
    return el ? String(el.textContent || '').trim() : '';
  }
  function setPulse(icon, ar, en, subAr, subEn, actionAr, actionEn, selector, key) {
    if (!pulse || pulseHidden) return;
    var same = key === lastPulseKey;
    pulseIcon.textContent = icon;
    pulseTitle.textContent = T(ar, en);
    pulseText.textContent = T(subAr, subEn);
    pulsePrimary.textContent = T(actionAr, actionEn);
    pulsePrimary.hidden = !selector;
    pulse.dataset.action = selector || '';
    if (!same) pulse.classList.remove('kk27-pulse-refresh');
    lastPulseKey = key;
    pulse.hidden = false;
  }
  function updatePulse() {
    if (!pulse || document.body.classList.contains('focus-active')) {
      if (pulse) pulse.hidden = true;
      return;
    }
    var view = activeView();
    var hwCount = text('hwCount').replace(/[()]/g, '').trim();
    var clock = text('pomoClock');
    var toggle = text('pomoToggle');
    var running = /^(pause|إيقاف|إيقاف مؤقت)$/i.test(toggle);
    if (view === 'pomo') {
      if (running) {
        setPulse(
          '◉',
          'الجلسة شغالة',
          'Session in progress',
          'المؤقّت شغّال. خلّي الشاشة قدامك أو ادخل وضع التركيز.',
          'The timer is running. Keep your focus or enter Focus Mode.',
          'وضع التركيز',
          'Focus',
          '#openFocusFromSettings',
          'timer-running',
        );
      } else {
        setPulse(
          '◷',
          'جاهز لجلسة جديدة',
          'Ready for a new session',
          clock ? 'المؤقّت ' + clock + ' — اختار المادة وابدأ.' : 'اختار المادة وابدأ جلسة مذاكرة.',
          clock
            ? 'Timer ' + clock + ' — choose a subject and start.'
            : 'Choose a subject and start a study session.',
          'ابدأ',
          'Start',
          '#pomoToggle',
          'timer-ready',
        );
      }
    } else if (view === 'hw') {
      var c = hwCount || '0';
      setPulse(
        '✓',
        'الواجبات قدامك',
        'Homework is in view',
        'عندك ' + c + ' واجب مفتوح. رتّب الأصعب أو الأقرب أولًا.',
        'You have ' + c + ' open homework. Tackle the hardest or nearest first.',
        'إضافة واجب',
        'Add homework',
        '[data-add="hw"]',
        'hw-' + c,
      );
    } else if (view === 'stats') {
      var insight = text('progressInsightText');
      setPulse(
        '↗',
        'حوّل التقدّم لخطوة',
        'Turn progress into a next step',
        insight || 'مؤشراتك الأسبوعية جاهزة للمراجعة.',
        'Your weekly indicators are ready to review.',
        'مذاكرة',
        'Study',
        '.tab[data-view="pomo"]',
        'stats',
      );
    } else if (view === 'studyplan') {
      setPulse(
        '✓',
        'خطوة واحدة الآن',
        'One step now',
        'كمّل المرحلة الحالية بدل ما تحاول تخلص النظام كله مرة واحدة.',
        'Finish the current stage instead of tackling the whole system at once.',
        'وضع التركيز',
        'Focus Mode',
        '#openFocusFromSettings',
        'studyplan',
      );
    } else if (view === 'today') {
      var summary = text('todaySummary');
      setPulse(
        '☀',
        'خطة اليوم',
        'Today’s plan',
        summary || 'نفّذ أول شيء قريب عليك، وبعدها خلّي الجدول يقودك.',
        'Start with the nearest task, then let the schedule guide you.',
        'المؤقّت',
        'Timer',
        '.tab[data-view="pomo"]',
        'today',
      );
    } else if (view === 'dashboard') {
      var sv = text('dashStudyValue'),
        hv = text('dashHwValue');
      setPulse(
        '✦',
        'لوحة القيادة',
        'Control center',
        (sv || '0 دقيقة') + ' مذاكرة اليوم · ' + (hv || '0') + ' واجب مفتوح.',
        (sv || '0 min') + ' studied today · ' + (hv || '0') + ' open homework.',
        'ابدأ مذاكرة',
        'Start studying',
        '.tab[data-view="pomo"]',
        'dashboard-' + sv + '-' + hv,
      );
    } else {
      setPulse(
        '🧠',
        'مسار سريع',
        'Fast route',
        'استخدم مركز الأوامر للوصول لأي وظيفة من غير ما تدور في القوائم.',
        'Use Command Center to reach any feature without hunting through menus.',
        'مركز الأوامر',
        'Command Center',
        '#kkCommandBtn',
        'generic',
      );
    }
    pulsePrimary.onclick = function () {
      var sel = pulse.dataset.action;
      if (!sel) return;
      if (sel === '#openFocusFromSettings' && !qs(sel)) sel = '#focusExit';
      if (sel === '#focusExit') {
        return;
      }
      click(sel);
    };
  }

  function scrollTopOnViewChange() {
    try {
      window.scrollTo({
        top: 0,
        behavior: document.body.classList.contains('reduce-motion') ? 'auto' : 'smooth',
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }
  function animateVisibleView() {
    var view = document.querySelector('.view:not([hidden])');
    if (!view) return;
    view.classList.remove('kk27-enter');
    void view.offsetWidth;
    view.classList.add('kk27-enter');
    window.setTimeout(function () {
      view.classList.remove('kk27-enter');
    }, 500);
  }

  document.addEventListener(
    'click',
    function (e) {
      var tab = e.target && e.target.closest ? e.target.closest('.tab[data-view]') : null;
      if (tab) {
        window.setTimeout(function () {
          scrollTopOnViewChange();
          animateVisibleView();
          updatePulse();
        }, 30);
      }
    },
    true,
  );

  if (tabs) {
    var updateNavShadow = function () {
      tabs.classList.toggle('kk27-scrolled', (window.scrollY || 0) > 6);
    };
    addEventListener('scroll', updateNavShadow, { passive: true });
    updateNavShadow();
  }

  if (pulseDismiss) {
    pulseDismiss.addEventListener('click', function () {
      pulseHidden = true;
      pulse.hidden = true;
      window.setTimeout(function () {
        pulseHidden = false;
        updatePulse();
      }, 45000);
    });
  }

  /* Update the tab title and contextual pulse only when their source nodes change. */
  var pulseFrame = 0;
  function syncTimerTitle() {
    var clock = text('pomoClock'),
      toggle = text('pomoToggle');
    var running = /^(pause|إيقاف|إيقاف مؤقت)$/i.test(toggle);
    if (running && clock) {
      document.title = clock + ' · ' + T('الكشكول', 'Kashkool');
    } else {
      var idleTitle =
        document.documentElement.lang === 'en'
          ? 'Kashkool — Lessons, Homework and Weekly Schedule'
          : 'الكشكول — دروسي وواجباتي وجدول الأسبوع';
      if (document.title !== idleTitle) document.title = idleTitle;
    }
  }
  function queuePulseRefresh() {
    if (pulseFrame) return;
    pulseFrame = requestAnimationFrame(function () {
      pulseFrame = 0;
      syncTimerTitle();
      updatePulse();
    });
  }
  if ('MutationObserver' in window) {
    var liveObserver = new MutationObserver(queuePulseRefresh);
    var clockNode = document.getElementById('pomoClock'),
      toggleNode = document.getElementById('pomoToggle');
    if (clockNode) liveObserver.observe(clockNode, { childList: true, subtree: true, characterData: true });
    if (toggleNode) liveObserver.observe(toggleNode, { childList: true, subtree: true, characterData: true });
    if (tabs)
      liveObserver.observe(tabs, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
    liveObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
    liveObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  } else {
    /* Legacy fallback for older embedded browsers. */
    setInterval(queuePulseRefresh, 1200);
  }
  queuePulseRefresh();

  /* Better command-center keyboard ergonomics: Home/End + simple focus trap. */
  var overlay = document.getElementById('kkCommandOverlay');
  var search = document.getElementById('kkCommandSearch');
  if (overlay) {
    document.addEventListener(
      'keydown',
      function (e) {
        if (overlay.hidden) return;
        if (e.key === 'Home' && document.activeElement === search) {
          var first = overlay.querySelector('.kkCommandItem[data-kk-cmd]');
          if (first) {
            e.preventDefault();
            first.focus();
          }
        }
        if (e.key === 'Tab') {
          var focusables = overlay.querySelectorAll(
            'button,input,[href],select,textarea,[tabindex]:not([tabindex="-1"])',
          );
          if (!focusables.length) return;
          var first = focusables[0],
            last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      true,
    );
  }

  /* Accessibility: keep aria-selected meaningful on command items. */
  if (window.MutationObserver) {
    var grid = document.getElementById('kkCommandGrid');
    if (grid) {
      var mo = new MutationObserver(function () {
        grid.querySelectorAll('.kkCommandItem[data-kk-cmd]').forEach(function (b) {
          b.setAttribute('aria-selected', b.classList.contains('is-active') ? 'true' : 'false');
        });
      });
      mo.observe(grid, { childList: true, subtree: true });
    }
  }

  /* When focus mode opens, hide the pulse so it never competes for attention. */
  var bodyObserver = window.MutationObserver
    ? new MutationObserver(function () {
        if (document.body.classList.contains('focus-active')) {
          if (pulse) pulse.hidden = true;
        } else if (pulse && !pulseHidden) {
          updatePulse();
        }
      })
    : null;
  if (bodyObserver) bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  window.setTimeout(updatePulse, 450);
})();
