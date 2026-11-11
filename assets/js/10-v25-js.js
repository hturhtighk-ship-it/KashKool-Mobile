/* ==============================================================
   JS 11/28 · Visual refinement · kashkool-v25-js · 9.4 KB
   ============================================================== */
(function () {
  'use strict';
  var overlay = document.getElementById('kkCommandOverlay');
  var search = document.getElementById('kkCommandSearch');
  var grid = document.getElementById('kkCommandGrid');
  var closeBtn = document.getElementById('kkCommandClose');
  var cmdBtn = document.getElementById('kkCommandBtn');
  var quickDock = document.getElementById('kkQuickDock');
  var quickMain = document.getElementById('kkQuickMain');
  if (!overlay || !search || !grid || !cmdBtn || !quickDock) return;

  var previousFocus = null,
    activeIndex = 0,
    actions = [];
  function en() {
    return document.documentElement.lang === 'en' || document.documentElement.dir === 'ltr';
  }
  function T(ar, eng) {
    return en() ? eng : ar;
  }
  function syncLocale() {
    var isEn = en();
    document.querySelectorAll('[data-ar][data-en]').forEach(function (el) {
      el.textContent = isEn ? el.getAttribute('data-en') : el.getAttribute('data-ar');
    });
    if (quickMain) {
      quickMain.setAttribute('aria-label', T('إجراءات سريعة', 'Quick actions'));
    }
    cmdBtn.setAttribute('aria-label', T('مركز الأوامر', 'Command center'));
    var title = document.getElementById('kkCommandTitle'),
      hint = document.getElementById('kkCommandHint'),
      tip = document.getElementById('kkCommandTip'),
      input = search;
    if (title) title.textContent = T('مركز الأوامر', 'Command Center');
    if (hint)
      hint.textContent = T(
        'انتقل لأي جزء أو أضف شيئًا بدون ما تدور في القوائم.',
        'Jump anywhere or add something without hunting through menus.',
      );
    if (tip)
      tip.textContent = T(
        '↑ ↓ للتنقل · Enter للفتح · Esc للإغلاق',
        '↑ ↓ to move · Enter to open · Esc to close',
      );
    if (input) input.placeholder = T('ابحث في الإجراءات…', 'Search actions…');
  }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clickFirst(selector) {
    var el = document.querySelector(selector);
    if (el && typeof el.click === 'function') {
      el.click();
      return true;
    }
    return false;
  }
  function getActions() {
    return [
      {
        id: 'dashboard',
        icon: '⌂',
        ar: 'لوحة التحكم',
        en: 'Dashboard',
        metaAr: 'ملخص يومك',
        metaEn: 'Your day at a glance',
        kind: 'view',
        sel: '.tab[data-view="dashboard"]',
      },
      {
        id: 'today',
        icon: '☀',
        ar: 'اليوم',
        en: 'Today',
        metaAr: 'جدول اليوم والواجبات القريبة',
        metaEn: 'Today’s schedule and homework',
        kind: 'view',
        sel: '.tab[data-view="today"]',
      },
      {
        id: 'timer',
        icon: '◷',
        ar: 'المؤقّت',
        en: 'Timer',
        metaAr: 'ابدأ جلسة مذاكرة',
        metaEn: 'Start a study session',
        kind: 'view',
        sel: '.tab[data-view="pomo"]',
      },
      {
        id: 'focus',
        icon: '◉',
        ar: 'وضع التركيز',
        en: 'Focus Mode',
        metaAr: 'اعزل التشتيت وابدأ التركيز',
        metaEn: 'Remove distractions and focus',
        kind: 'focus',
      },
      {
        id: 'studyplan',
        icon: '✓',
        ar: 'نظام المذاكرة',
        en: 'Study system',
        metaAr: 'المراحل والخطوات',
        metaEn: 'Stages and steps',
        kind: 'view',
        sel: '.tab[data-view="studyplan"]',
      },
      {
        id: 'stats',
        icon: '▥',
        ar: 'التقدّم',
        en: 'Progress',
        metaAr: 'إحصائيات وقت المذاكرة',
        metaEn: 'Study-time analytics',
        kind: 'view',
        sel: '.tab[data-view="stats"]',
      },
      {
        id: 'week',
        icon: '▦',
        ar: 'الأسبوع',
        en: 'Week',
        metaAr: 'الجدول الأسبوعي',
        metaEn: 'Weekly schedule',
        kind: 'view',
        sel: '.tab[data-view="week"]',
      },
      {
        id: 'hw',
        icon: '✓',
        ar: 'الواجبات',
        en: 'Homework',
        metaAr: 'المهام والمواعيد',
        metaEn: 'Tasks and due dates',
        kind: 'view',
        sel: '.tab[data-view="hw"]',
      },
      {
        id: 'exams',
        icon: '⚑',
        ar: 'الامتحانات',
        en: 'Exams',
        metaAr: 'مواعيد الامتحانات',
        metaEn: 'Exam schedule',
        kind: 'view',
        sel: '.tab[data-view="exams"]',
      },
      {
        id: 'notes',
        icon: '✎',
        ar: 'الملاحظات',
        en: 'Notes',
        metaAr: 'نوت سريعة',
        metaEn: 'Quick notes',
        kind: 'view',
        sel: '.tab[data-view="notes"]',
      },
      {
        id: 'flashcards',
        icon: '▤',
        ar: 'البطاقات التعليمية',
        en: 'Flashcards',
        metaAr: 'استرجاع نشط ومراجعة متباعدة',
        metaEn: 'Active recall and spaced repetition',
        kind: 'view',
        sel: '.tab[data-view="flashcards"]',
      },
      {
        id: 'subjects',
        icon: '●',
        ar: 'المواد',
        en: 'Subjects',
        metaAr: 'إدارة المواد والمدرسين',
        metaEn: 'Subjects and teachers',
        kind: 'view',
        sel: '.tab[data-view="subjects"]',
      },
      {
        id: 'settings',
        icon: '⚙',
        ar: 'الإعدادات',
        en: 'Settings',
        metaAr: 'الثيم واللغة والتخصيص',
        metaEn: 'Theme, language and preferences',
        kind: 'view',
        sel: '.tab[data-view="settings"]',
      },
      {
        id: 'entry',
        icon: '＋',
        ar: 'إضافة حصة',
        en: 'Add lesson',
        metaAr: 'أضف حصة أو حدث',
        metaEn: 'Add a lesson or event',
        kind: 'add',
        sel: '[data-add="entry"]',
      },
      {
        id: 'homework',
        icon: '✓',
        ar: 'إضافة واجب',
        en: 'Add homework',
        metaAr: 'أضف واجب جديد',
        metaEn: 'Add new homework',
        kind: 'add',
        sel: '[data-add="hw"]',
      },
      {
        id: 'note',
        icon: '✎',
        ar: 'إضافة نوتة',
        en: 'Add note',
        metaAr: 'اكتب نوتة سريعة',
        metaEn: 'Write a quick note',
        kind: 'add',
        sel: '[data-add="note"]',
      },
      {
        id: 'search',
        icon: '⌕',
        ar: 'البحث',
        en: 'Search',
        metaAr: 'ابحث في كشكول',
        metaEn: 'Search Kashkool',
        kind: 'search',
      },
    ];
  }
  function actionText(a) {
    return { title: T(a.ar, a.en), meta: T(a.metaAr, a.metaEn) };
  }
  function render() {
    actions = getActions();
    var q = String(search.value || '')
      .trim()
      .toLocaleLowerCase();
    var filtered = actions.filter(function (a) {
      var tx = actionText(a);
      return !q || (tx.title + ' ' + tx.meta).toLocaleLowerCase().indexOf(q) >= 0;
    });
    if (activeIndex >= filtered.length) activeIndex = Math.max(0, filtered.length - 1);
    grid.innerHTML = filtered.length
      ? filtered
          .map(function (a, i) {
            var tx = actionText(a);
            return (
              '<button type="button" class="kkCommandItem ' +
              (i === activeIndex ? 'is-active' : '') +
              '" data-kk-cmd="' +
              esc(a.id) +
              '"><span class="kkCommandItem__icon">' +
              a.icon +
              '</span><span><span class="kkCommandItem__title">' +
              esc(tx.title) +
              '</span><span class="kkCommandItem__meta">' +
              esc(tx.meta) +
              '</span></span><kbd>' +
              esc(a.kind === 'add' ? '+' : a.kind === 'view' ? 'Open' : 'Run') +
              '</kbd></button>'
            );
          })
          .join('')
      : '<div class="kkCommandItem"><span class="kkCommandItem__icon">⌁</span><span><span class="kkCommandItem__title">' +
        esc(T('مفيش نتيجة', 'No matching action')) +
        '</span><span class="kkCommandItem__meta">' +
        esc(T('جرّب كلمة أبسط.', 'Try a simpler search.')) +
        '</span></span></div>';
    var status = document.getElementById('kkCommandStatus');
    if (status)
      status.textContent = filtered.length
        ? en()
          ? filtered.length + ' actions'
          : filtered.length + ' اختصار'
        : '';
  }
  function open() {
    previousFocus = document.activeElement;
    activeIndex = 0;
    search.value = '';
    syncLocale();
    render();
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('kk-command-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      search.focus();
    }, 0);
  }
  function close() {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('kk-command-open');
    document.body.style.overflow = '';
    if (previousFocus && document.contains(previousFocus) && previousFocus.focus) previousFocus.focus();
  }
  function run(id) {
    var a = getActions().filter(function (x) {
      return x.id === id;
    })[0];
    if (!a) return;
    close();
    setTimeout(function () {
      if (a.kind === 'view' || a.kind === 'add') {
        clickFirst(a.sel);
      } else if (a.kind === 'search') {
        clickFirst('#searchBtn');
      } else if (a.kind === 'focus') {
        clickFirst('#openFocusFromSettings');
      }
    }, 30);
  }
  cmdBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  search.addEventListener('input', function () {
    activeIndex = 0;
    render();
  });
  grid.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-kk-cmd]');
    if (b) run(b.dataset.kkCmd);
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.hidden ? open() : close();
      return;
    }
    if (!overlay.hidden) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      var items = grid.querySelectorAll('.kkCommandItem[data-kk-cmd]');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(items.length - 1, activeIndex + 1);
        render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(0, activeIndex - 1);
        render();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[activeIndex]) run(items[activeIndex].dataset.kkCmd);
      }
      return;
    }
    var target = e.target,
      tag = target && target.tagName ? target.tagName.toLowerCase() : '';
    if (
      e.key === '/' &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      tag !== 'input' &&
      tag !== 'textarea' &&
      tag !== 'select'
    ) {
      e.preventDefault();
      open();
    }
  });
  quickMain.addEventListener('click', function () {
    var openState = quickDock.classList.toggle('is-open');
    quickMain.setAttribute('aria-expanded', openState ? 'true' : 'false');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && quickDock.classList.contains('is-open')) {
      quickDock.classList.remove('is-open');
      quickMain.setAttribute('aria-expanded', 'false');
    }
  });
  quickDock.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-kk-action]');
    if (!b) return;
    quickDock.classList.remove('is-open');
    quickMain.setAttribute('aria-expanded', 'false');
    var kind = b.dataset.kkAction;
    setTimeout(function () {
      if (kind === 'timer') clickFirst('.tab[data-view="pomo"]');
      if (kind === 'entry') clickFirst('[data-add="entry"]');
      if (kind === 'hw') clickFirst('[data-add="hw"]');
      if (kind === 'note') clickFirst('[data-add="note"]');
    }, 20);
  });
  document.addEventListener('click', function (e) {
    if (quickDock.classList.contains('is-open') && !quickDock.contains(e.target)) {
      quickDock.classList.remove('is-open');
      quickMain.setAttribute('aria-expanded', 'false');
    }
  });
  /* Keep the command center copy aligned with the selected locale without touching app internals. */
  syncLocale();
  try {
    new MutationObserver(function (records) {
      if (
        records.some(function (r) {
          return r.attributeName === 'lang' || r.attributeName === 'dir';
        })
      ) {
        syncLocale();
        if (!overlay.hidden) render();
      }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  } catch (e) {}
})();
