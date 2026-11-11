/* ==============================================================
   JS 18/28 · Visual refinement · kashkool-v37-complete · 25.3 KB
   ============================================================== */
(function () {
  'use strict';
  var $ = function (id) {
    return document.getElementById(id);
  };
  var nativeSet = Storage.prototype.setItem;
  var backupBusy = false;
  function accountId() {
    try {
      return localStorage.getItem('kashkool.active.account.v1') || 'default';
    } catch (e) {
      return 'default';
    }
  }
  function scoped(base) {
    return base + '.' + accountId();
  }
  function ar() {
    return !(document.documentElement.lang === 'en' || document.documentElement.dir === 'ltr');
  }
  function T(a, e) {
    return ar() ? a : e;
  }
  function safeJson(text, fallback) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return fallback;
    }
  }
  function escapeHtml(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function localDateKey(ts) {
    var d = new Date(ts);
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  /* Step 1 — rotating local safety snapshots, taken before core account data is overwritten. */
  var SNAP_KEY_PREFIX = 'kashkool.autosnapshots.v1.';
  function belongsToActiveAccount(key, id) {
    if (!key) return false;
    if (key === 'kashkool-custom-theme' || key === 'kashkool.theme.motion.settings.v1') return true;
    if (key.indexOf('kashkool.') !== 0) return false;
    if (key.indexOf('kashkool.autosnapshots.v1.') === 0) return false;
    if (key.indexOf('kashkool.recycle.v1.') === 0) return false;
    return key.endsWith('.' + id);
  }
  function collectAccountValues() {
    var id = accountId(),
      out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (belongsToActiveAccount(k, id)) {
          var v = localStorage.getItem(k);
          if (v !== null) out.push([k, v]);
        }
      }
    } catch (e) {}
    return out;
  }
  function snapshotAccount(reason) {
    if (backupBusy) return false;
    var values = collectAccountValues();
    if (!values.length) return false;
    var key = SNAP_KEY_PREFIX + accountId(),
      list = safeJson(localStorage.getItem(key) || '[]', []);
    if (!Array.isArray(list)) list = [];
    var fingerprint = '';
    try {
      fingerprint = JSON.stringify(values);
    } catch (e) {}
    var previous = list[0],
      prevFingerprint = '';
    try {
      prevFingerprint = previous ? JSON.stringify(previous.values) : '';
    } catch (e) {}
    if (previous && prevFingerprint === fingerprint) {
      updateBackupStatus();
      return false;
    }
    list.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      at: Date.now(),
      reason: reason || 'automatic',
      values: values,
    });
    list = list.slice(0, 5);
    try {
      backupBusy = true;
      nativeSet.call(localStorage, key, JSON.stringify(list));
      backupBusy = false;
      updateBackupStatus();
      return true;
    } catch (e) {
      backupBusy = false;
      return false;
    }
  }
  try {
    Storage.prototype.setItem = function (key, value) {
      if (
        this === window.localStorage &&
        !backupBusy &&
        typeof key === 'string' &&
        key === 'kashkool.data.v1.' + accountId()
      )
        snapshotAccount('before-save');
      return nativeSet.call(this, key, value);
    };
  } catch (e) {}
  function ensureInitialSnapshot() {
    var key = SNAP_KEY_PREFIX + accountId(),
      list = safeJson(localStorage.getItem(key) || '[]', []);
    if (!Array.isArray(list) || !list.length) snapshotAccount('initial');
    updateBackupStatus();
  }
  function updateBackupStatus() {
    var host = $('kk-recovery-status');
    if (!host) return;
    var list = safeJson(localStorage.getItem(SNAP_KEY_PREFIX + accountId()) || '[]', []);
    if (!Array.isArray(list)) list = [];
    var latest = list[0],
      date = latest
        ? new Date(latest.at).toLocaleString(ar() ? 'ar-EG' : 'en-US')
        : T('لا توجد نسخة تلقائية بعد', 'No automatic snapshot yet');
    host.textContent = list.length
      ? T('عدد النسخ المحفوظة: ', 'Saved snapshots: ') +
        list.length +
        ' · ' +
        T('أحدث نسخة: ', 'Latest: ') +
        date
      : T(
          'لم تُنشأ نسخة تلقائية بعد. اضغط «إنشاء نسخة الآن».',
          'No automatic snapshot yet. Select “Create backup now”.',
        );
    var del = $('kk-restore-deleted');
    if (del) {
      var bin = safeJson(localStorage.getItem('kashkool.recycle.v1.' + accountId()) || '[]', []);
      del.disabled = !Array.isArray(bin) || !bin.length;
    }
    var b = $('kk-restore-backup');
    if (b) b.disabled = !list.length;
  }
  function restoreLatestSnapshot() {
    var key = SNAP_KEY_PREFIX + accountId(),
      list = safeJson(localStorage.getItem(key) || '[]', []);
    if (!Array.isArray(list) || !list.length) {
      updateBackupStatus();
      return;
    }
    if (
      !confirm(
        T(
          'سيتم استبدال بيانات الحساب الحالية بآخر نسخة محفوظة. هل أنشأت نسخة حديثة لو محتاج ترجع للحالة الحالية؟',
          'Current account data will be replaced with the latest snapshot. Create a backup first if you may need the current state. Continue?',
        ),
      )
    )
      return;
    var snap = list[0];
    if (!snap || !Array.isArray(snap.values)) return;
    try {
      backupBusy = true;
      var id = accountId(),
        remove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (belongsToActiveAccount(k, id)) remove.push(k);
      }
      remove.forEach(function (k) {
        localStorage.removeItem(k);
      });
      snap.values.forEach(function (pair) {
        if (Array.isArray(pair) && pair.length === 2) nativeSet.call(localStorage, pair[0], pair[1]);
      });
      backupBusy = false;
      location.reload();
    } catch (e) {
      backupBusy = false;
      alert(
        T(
          'تعذرت الاستعادة. نزّل نسخة كاملة قبل أي محاولة أخرى.',
          'Could not restore this snapshot. Download a full backup before trying again.',
        ),
      );
    }
  }
  function doManualBackup() {
    var made = snapshotAccount('manual'),
      list = safeJson(localStorage.getItem(SNAP_KEY_PREFIX + accountId()) || '[]', []);
    updateBackupStatus();
    if (made) alert(T('تم حفظ نسخة محلية من بيانات الحساب.', 'A local account snapshot has been saved.'));
    else if (Array.isArray(list) && list.length)
      alert(
        T(
          'النسخة الأخيرة تحتوي بالفعل على أحدث البيانات.',
          'The latest snapshot already contains the current data.',
        ),
      );
    else
      alert(
        T(
          'لم توجد بيانات لحفظها أو تعذر إنشاء النسخة.',
          'No account data was found or the snapshot could not be created.',
        ),
      );
  }
  var btnBackup = $('kk-backup-now');
  if (btnBackup) btnBackup.addEventListener('click', doManualBackup);
  var btnRestore = $('kk-restore-backup');
  if (btnRestore) btnRestore.addEventListener('click', restoreLatestSnapshot);
  var btnFull = $('kk-download-full-backup');
  if (btnFull)
    btnFull.addEventListener('click', function () {
      var b = $('exportDataBtn');
      if (b) b.click();
    });
  ensureInitialSnapshot();

  /* Step 2 — active-recall flashcards with bounded local scheduling. */
  var FC_KEY = 'kashkool.flashcards.v1.' + accountId();
  var cards = safeJson(localStorage.getItem(FC_KEY) || '[]', []);
  if (!Array.isArray(cards)) cards = [];
  cards = cards
    .filter(function (c) {
      return c && typeof c === 'object' && c.id && typeof c.front === 'string' && typeof c.back === 'string';
    })
    .slice(0, 5000);
  var editingId = null,
    queue = [],
    revealed = false,
    currentCard = null,
    reviewSessionTotal = 0,
    reviewSessionDone = 0;
  function saveCards() {
    try {
      localStorage.setItem(FC_KEY, JSON.stringify(cards));
    } catch (e) {
      alert(
        T(
          'مساحة التخزين ممتلئة؛ صدّر نسخة كاملة ثم احذف بعض البطاقات.',
          'Storage is full; export a full backup and remove some cards.',
        ),
      );
    }
    try {
      if (window.KashKoolLearningOS && window.KashKoolLearningOS.onFlashcardsSave)
        window.KashKoolLearningOS.onFlashcardsSave(cards);
    } catch (e) {}
    renderFlashcards();
  }
  function dayMs() {
    return 86400000;
  }
  function isDue(c) {
    return (+c.nextReview || 0) <= Date.now();
  }
  function reviewedToday() {
    var today = localDateKey(Date.now());
    return cards.reduce(function (n, c) {
      return (
        n +
        (Array.isArray(c.reviews)
          ? c.reviews.filter(function (ts) {
              return localDateKey(ts) === today;
            }).length
          : 0)
      );
    }, 0);
  }
  function updateFlashLabels() {
    var labels = {
      'kkfc-title': ['بطاقات المراجعة', 'Revision flashcards'],
      'kkfc-subtitle': [
        'استرجع المعلومة من ذاكرتك، ثم اكشف الإجابة وقيّم صعوبتها.',
        'Recall the answer first, reveal it, then rate how difficult it was.',
      ],
      'kkfc-new': ['+ بطاقة جديدة', '+ New card'],
      'kkfc-total-label': ['إجمالي البطاقات', 'Total cards'],
      'kkfc-due-label': ['مستحقة للمراجعة', 'Due for review'],
      'kkfc-reviewed-label': ['مراجعات اليوم', 'Reviews today'],
      'kkfc-practice-kicker': ['جلسة استرجاع نشط', 'Active recall session'],
      'kkfc-practice-title': ['اختبر ذاكرتك', 'Test your memory'],
      'kkfc-practice-help': [
        'اقرأ السؤال وحاول الإجابة قبل الضغط على كشف الإجابة.',
        'Read the prompt and try to answer before revealing it.',
      ],
      'kkfc-face-label': ['السؤال', 'Question'],
      'kkfc-answer-label': ['الإجابة', 'Answer'],
      'kkfc-reveal': ['كشف الإجابة', 'Reveal answer'],
      'kkfc-next': ['التالي', 'Next'],
      'kkfc-all-due': ['مراجعة كل البطاقات', 'Review all cards'],
      'kkfc-rate-hint': ['قيّم مدى سهولة التذكر:', 'Rate how easy recall felt:'],
      'kkfc-library-title': ['مكتبة البطاقات', 'Card library'],
      'kkfc-library-hint': [
        'تُحفظ على هذا الجهاز مع بيانات الحساب الحالي.',
        'Cards are stored on this device for the active account.',
      ],
      'kkfc-filter': ['ابحث في البطاقات…', 'Search flashcards…'],
      'kkfc-dialog-title': ['بطاقة جديدة', 'New flashcard'],
      'kkfc-subject-label': ['المادة أو التصنيف', 'Subject or category'],
      'kkfc-front-label': ['السؤال / وجه البطاقة', 'Prompt / front'],
      'kkfc-back-label': ['الإجابة / ظهر البطاقة', 'Answer / back'],
      'kkfc-form-hint': [
        'نصيحة: اكتب سؤالًا يساعدك على استرجاع الفكرة بدل حفظ فقرة طويلة.',
        'Tip: write a prompt that makes you recall an idea instead of memorizing a long paragraph.',
      ],
      'kkfc-save': ['حفظ البطاقة', 'Save card'],
      'kkfc-cancel': ['إلغاء', 'Cancel'],
    };
    Object.keys(labels).forEach(function (id) {
      var el = $(id);
      if (!el) return;
      var v = labels[id];
      if (id === 'kkfc-filter') {
        el.placeholder = ar() ? v[0] : v[1];
        el.setAttribute('aria-label', ar() ? 'البحث في البطاقات' : 'Search flashcards');
      } else el.textContent = ar() ? v[0] : v[1];
    });
    var subject = $('kkfc-subject-input'),
      front = $('kkfc-front-input'),
      back = $('kkfc-back-input');
    if (subject) subject.placeholder = ar() ? 'مثال: علوم' : 'e.g. Science';
    if (front) front.placeholder = ar() ? 'اكتب سؤالًا واضحًا' : 'Write a clear question';
    if (back) back.placeholder = ar() ? 'اكتب الإجابة أو الشرح' : 'Write the answer or explanation';
    document.querySelectorAll('[data-kkfc-rate]').forEach(function (b) {
      var id = b.dataset.kkfcRate;
      b.textContent = ar()
        ? { again: 'مرة أخرى', hard: 'صعبة', good: 'جيدة', easy: 'سهلة' }[id]
        : { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' }[id];
    });
  }
  function renderQueue() {
    var q = $('kkfc-queue');
    if (q)
      q.textContent =
        (currentCard ? Math.min(reviewSessionDone + 1, reviewSessionTotal) : reviewSessionDone) +
        ' / ' +
        reviewSessionTotal;
    var front = $('kkfc-front-text'),
      back = $('kkfc-back-text'),
      answer = $('kkfc-answer'),
      reveal = $('kkfc-reveal'),
      next = $('kkfc-next'),
      ratings = $('kkfc-ratings'),
      faceLabel = $('kkfc-face-label');
    if (!currentCard) {
      if (front)
        front.textContent = cards.length
          ? ar()
            ? 'لا توجد بطاقات مستحقة الآن. يمكنك مراجعة المكتبة أو تحميل كل البطاقات للمراجعة.'
            : 'No cards are due right now. Browse the library or load all cards to review.'
          : ar()
            ? 'أضف بطاقتك الأولى لتبدأ المراجعة.'
            : 'Add your first card to begin reviewing.';
      if (back) back.textContent = '';
      if (answer) answer.hidden = true;
      if (reveal) reveal.hidden = true;
      if (next) next.hidden = true;
      if (ratings) ratings.hidden = true;
      if (faceLabel) faceLabel.textContent = ar() ? 'السؤال' : 'Question';
      if (q) q.textContent = reviewSessionDone + ' / ' + reviewSessionTotal;
      return;
    }
    if (front) front.textContent = currentCard.front;
    if (back) back.textContent = currentCard.back;
    if (faceLabel)
      faceLabel.textContent =
        (ar() ? 'السؤال' : 'Question') + (currentCard.subject ? ' · ' + currentCard.subject : '');
    if (answer) answer.hidden = !revealed;
    if (reveal) reveal.hidden = revealed;
    if (next) next.hidden = !revealed;
    if (ratings) ratings.hidden = !revealed;
    if (q) q.textContent = (Number(currentCard._position) || 1) + ' / ' + (Number(currentCard._total) || 1);
  }
  function loadQueue(all) {
    var due = cards
      .filter(function (c) {
        return all || isDue(c);
      })
      .sort(function (a, b) {
        return (+a.nextReview || 0) - (+b.nextReview || 0);
      })
      .slice(0, 60);
    queue = due.map(function (c) {
      return c.id;
    });
    reviewSessionTotal = queue.length;
    reviewSessionDone = 0;
    revealed = false;
    currentCard = null;
    nextCard();
  }
  function nextCard() {
    revealed = false;
    currentCard = null;
    while (queue.length) {
      var id = queue.shift();
      var c = cards.filter(function (x) {
        return x.id === id;
      })[0];
      if (c) {
        currentCard = c;
        break;
      }
    }
    if (currentCard) {
      currentCard._position = reviewSessionDone + 1;
      currentCard._total = reviewSessionTotal;
    }
    renderQueue();
  }
  function scheduleRating(rating) {
    if (!currentCard) return;
    var c = cards.filter(function (x) {
      return x.id === currentCard.id;
    })[0];
    if (!c) return;
    var old = Math.max(0, +c.intervalDays || 0),
      reps = Math.max(0, +c.repetitions || 0),
      now = Date.now();
    if (rating === 'again') {
      c.intervalDays = 0;
      c.nextReview = now + 10 * 60 * 1000;
      c.repetitions = 0;
    } else if (rating === 'hard') {
      c.intervalDays = Math.max(1, Math.round(old ? old * 1.2 : 1));
      c.nextReview = now + c.intervalDays * dayMs();
      c.repetitions = reps + 1;
    } else if (rating === 'good') {
      c.intervalDays = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(4, Math.round((old || 3) * 2.1));
      c.nextReview = now + c.intervalDays * dayMs();
      c.repetitions = reps + 1;
    } else {
      c.intervalDays = Math.max(4, Math.round((old || 1) * 3));
      c.nextReview = now + c.intervalDays * dayMs();
      c.repetitions = reps + 1;
    }
    c.lastReview = now;
    c.reviews = Array.isArray(c.reviews) ? c.reviews : [];
    c.reviews.push(now);
    c.reviews = c.reviews.slice(-200);
    reviewSessionDone = Math.min(reviewSessionTotal, reviewSessionDone + 1);
    saveCards();
    nextCard();
  }
  function renderFlashcards() {
    updateFlashLabels();
    var total = $('kkfc-total'),
      due = $('kkfc-due'),
      rev = $('kkfc-reviewed');
    if (total) total.textContent = cards.length;
    if (due) due.textContent = cards.filter(isDue).length;
    if (rev) rev.textContent = reviewedToday();
    var list = $('kkfc-list'),
      filter = String(($('kkfc-filter') || {}).value || '')
        .trim()
        .toLocaleLowerCase();
    if (!list) return;
    var visible = cards
      .filter(function (c) {
        return (
          !filter ||
          (c.front + ' ' + c.back + ' ' + (c.subject || '')).toLocaleLowerCase().indexOf(filter) >= 0
        );
      })
      .sort(function (a, b) {
        return (+a.createdAt || 0) - (+b.createdAt || 0);
      })
      .slice(0, 300);
    if (!visible.length) {
      list.innerHTML =
        '<div class="kkfc-list-empty">' +
        escapeHtml(
          cards.length
            ? ar()
              ? 'لا توجد نتائج مطابقة.'
              : 'No matching cards.'
            : ar()
              ? 'مكتبتك فارغة. اضغط «بطاقة جديدة» وأضف سؤالًا وإجابته.'
              : 'Your library is empty. Select “New card” to add a prompt and answer.',
        ) +
        '</div>';
    } else
      list.innerHTML = visible
        .map(function (c) {
          var dueText = isDue(c)
            ? ar()
              ? 'مستحقة الآن'
              : 'Due now'
            : (ar() ? 'موعدها ' : 'Due ') +
              new Date(c.nextReview).toLocaleDateString(ar() ? 'ar-EG' : 'en-US');
          return (
            '<article class="kkfc-item" data-card-id="' +
            escapeHtml(c.id) +
            '"><div class="kkfc-item-top"><span class="kkfc-item-subject">' +
            escapeHtml(c.subject || (ar() ? 'بدون تصنيف' : 'Uncategorized')) +
            '</span><span class="kkfc-item-subject">' +
            escapeHtml(dueText) +
            '</span></div><div class="kkfc-item-front">' +
            escapeHtml(c.front) +
            '</div><details><summary>' +
            escapeHtml(ar() ? 'عرض الإجابة' : 'Show answer') +
            '</summary><div class="kkfc-item-back">' +
            escapeHtml(c.back) +
            '</div></details><div class="kkfc-item-actions"><button type="button" class="ghost" data-kkfc-edit="' +
            escapeHtml(c.id) +
            '">' +
            escapeHtml(ar() ? 'تعديل' : 'Edit') +
            '</button><button type="button" class="ghost" data-kkfc-study="' +
            escapeHtml(c.id) +
            '">' +
            escapeHtml(ar() ? 'راجع الآن' : 'Review now') +
            '</button><button type="button" class="ghost" data-kkfc-delete="' +
            escapeHtml(c.id) +
            '">' +
            escapeHtml(ar() ? 'حذف' : 'Delete') +
            '</button></div></article>'
          );
        })
        .join('');
  }
  window.KashkoolFlashcardsRender = renderFlashcards;
  window.KashkoolFlashcardsImport = function (imported) {
    cards = Array.isArray(imported)
      ? imported
          .filter(function (c) {
            return c && typeof c.front === 'string' && typeof c.back === 'string' && c.id;
          })
          .slice(0, 5000)
      : [];
    queue = [];
    currentCard = null;
    reviewSessionDone = 0;
    reviewSessionTotal = 0;
    saveCards();
    loadQueue(false);
  };
  function openCardDialog(card) {
    editingId = card ? card.id : null;
    $('kkfc-dialog-title').textContent = card
      ? ar()
        ? 'تعديل البطاقة'
        : 'Edit flashcard'
      : ar()
        ? 'بطاقة جديدة'
        : 'New flashcard';
    $('kkfc-subject-input').value = card ? card.subject || '' : '';
    $('kkfc-front-input').value = card ? card.front : '';
    $('kkfc-back-input').value = card ? card.back : '';
    $('kkfc-save').textContent = ar() ? 'حفظ البطاقة' : 'Save card';
    var dlg = $('kkfc-dialog');
    if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
    else if (dlg) dlg.setAttribute('open', '');
  }
  function closeCardDialog() {
    var d = $('kkfc-dialog');
    if (d && d.open) d.close();
    else if (d) d.removeAttribute('open');
  }
  var newBtn = $('kkfc-new');
  if (newBtn)
    newBtn.addEventListener('click', function () {
      openCardDialog(null);
    });
  var cancelBtn = $('kkfc-cancel'),
    closeBtn = $('kkfc-close');
  if (cancelBtn) cancelBtn.addEventListener('click', closeCardDialog);
  if (closeBtn) closeBtn.addEventListener('click', closeCardDialog);
  var form = $('kkfc-form');
  if (form)
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var front = String($('kkfc-front-input').value || '').trim(),
        back = String($('kkfc-back-input').value || '').trim(),
        subject = String($('kkfc-subject-input').value || '').trim();
      if (!front || !back) {
        alert(ar() ? 'اكتب السؤال والإجابة أولًا.' : 'Enter both a prompt and an answer.');
        return;
      }
      var now = Date.now();
      if (editingId) {
        var c = cards.filter(function (x) {
          return x.id === editingId;
        })[0];
        if (c) {
          c.front = front;
          c.back = back;
          c.subject = subject;
          c.updatedAt = now;
        }
      } else {
        cards.unshift({
          id: now.toString(36) + Math.random().toString(36).slice(2, 8),
          front: front,
          back: back,
          subject: subject,
          createdAt: now,
          nextReview: now,
          intervalDays: 0,
          repetitions: 0,
          reviews: [],
        });
      }
      saveCards();
      closeCardDialog();
      if (!editingId) loadQueue(false);
      editingId = null;
      renderFlashcards();
    });
  var listHost = $('kkfc-list');
  if (listHost)
    listHost.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var id = b.dataset.kkfcEdit || b.dataset.kkfcStudy || b.dataset.kkfcDelete;
      if (!id) return;
      var c = cards.filter(function (x) {
        return x.id === id;
      })[0];
      if (!c) return;
      if (b.dataset.kkfcEdit) openCardDialog(c);
      else if (b.dataset.kkfcStudy) {
        queue = cards
          .filter(function (x) {
            return isDue(x) && x.id !== id;
          })
          .map(function (x) {
            return x.id;
          });
        reviewSessionDone = 0;
        reviewSessionTotal = 1 + queue.length;
        currentCard = c;
        revealed = false;
        c._position = 1;
        c._total = reviewSessionTotal;
        renderQueue();
        document
          .querySelector('.kkfc-practice')
          .scrollIntoView({
            behavior:
              document.body.classList.contains('reduce-motion') ||
              (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
                ? 'auto'
                : 'smooth',
            block: 'start',
          });
      } else if (b.dataset.kkfcDelete) {
        if (confirm(ar() ? 'حذف البطاقة دي؟' : 'Delete this flashcard?')) {
          cards = cards.filter(function (x) {
            return x.id !== id;
          });
          queue = queue.filter(function (x) {
            return x !== id;
          });
          if (currentCard && currentCard.id === id) nextCard();
          saveCards();
        }
      }
    });
  var filter = $('kkfc-filter');
  if (filter) filter.addEventListener('input', renderFlashcards);
  var revealBtn = $('kkfc-reveal');
  if (revealBtn)
    revealBtn.addEventListener('click', function () {
      if (currentCard) {
        revealed = true;
        renderQueue();
      }
    });
  var nextBtn = $('kkfc-next');
  if (nextBtn)
    nextBtn.addEventListener('click', function () {
      if (currentCard) reviewSessionDone = Math.min(reviewSessionTotal, reviewSessionDone + 1);
      nextCard();
    });
  var dueBtn = $('kkfc-all-due');
  if (dueBtn)
    dueBtn.addEventListener('click', function () {
      loadQueue(true);
    });
  var rates = $('kkfc-ratings');
  if (rates)
    rates.addEventListener('click', function (e) {
      var b = e.target.closest('[data-kkfc-rate]');
      if (b) scheduleRating(b.dataset.kkfcRate);
    });
  /* Reload safely if the account changes in-app; each account uses a separate card deck. */
  var lastCardAccount = accountId();
  window.addEventListener('storage', function (e) {
    if (e.key === 'kashkool.active.account.v1' && accountId() !== lastCardAccount) location.reload();
  });
  renderFlashcards();
  loadQueue(false);

  /* Step 3 — progress priorities from the actual account data and due dates. */
  function renderInsights() {
    var view = $('view-stats');
    if (!view) return;
    var host = $('kk-insights-grid');
    if (!host) return;
    var data = safeJson(localStorage.getItem('kashkool.data.v1.' + accountId()) || '{}', {}),
      hw = Array.isArray(data.homework) ? data.homework : [],
      subjects = Array.isArray(data.subjects) ? data.subjects : [];
    var active = hw
      .filter(function (h) {
        return !h.done;
      })
      .map(function (h) {
        var due = h.due ? new Date(h.due + 'T12:00:00') : null;
        return { h: h, due: due, late: !!(due && due < new Date(new Date().toDateString())) };
      })
      .sort(function (a, b) {
        if (a.late !== b.late) return a.late ? -1 : 1;
        if (a.due && b.due) return a.due - b.due;
        if (a.due) return -1;
        if (b.due) return 1;
        return 0;
      });
    var dueCards = cards.filter(isDue).length;
    var title = T('أقرب أولوياتك', 'Your next priorities');
    var hint = T(
      'قائمة مبنية على مواعيد الواجبات والبطاقات المستحقة المسجلة فعلًا.',
      'Based on your saved homework deadlines and due flashcards.',
    );
    var html =
      '<section class="kk-insights-section"><div class="block__head"><div><h3>' +
      title +
      '</h3><span class="hint">' +
      hint +
      '</span></div></div><div class="kk-insights-grid">';
    var tasks = active.slice(0, 2);
    tasks.forEach(function (x) {
      var sid =
        (
          subjects.filter(function (s) {
            return s.id === x.h.subjectId;
          })[0] || {}
        ).name || T('بدون مادة', 'No subject');
      var dt = x.due ? x.due.toLocaleDateString(ar() ? 'ar-EG' : 'en-US') : T('بدون موعد', 'No due date');
      html +=
        '<article class="kk-insight-task"><span class="kk-insight-pill ' +
        (x.late ? 'is-late' : '') +
        '">' +
        escapeHtml(x.late ? T('متأخر', 'Overdue') : T('واجب مفتوح', 'Open homework')) +
        '</span><strong>' +
        escapeHtml(x.h.title || T('واجب', 'Homework')) +
        '</strong><small>' +
        escapeHtml(sid) +
        ' · ' +
        escapeHtml(dt) +
        '</small></article>';
    });
    html +=
      '<article class="kk-insight-task"><span class="kk-insight-pill">' +
      escapeHtml(T('مراجعة نشطة', 'Active recall')) +
      '</span><strong>' +
      dueCards +
      ' ' +
      escapeHtml(T('بطاقة مستحقة', 'cards due')) +
      '</strong><small>' +
      escapeHtml(
        dueCards
          ? T('افتح البطاقات التعليمية لجلسة مراجعة قصيرة.', 'Open Flashcards for a short review session.')
          : T('لا توجد بطاقات مستحقة الآن.', 'No flashcards due right now.'),
      ) +
      '</small><div style="margin-top:8px"><button type="button" class="ghost" data-kk-open-flashcards>' +
      escapeHtml(T('افتح البطاقات', 'Open flashcards')) +
      '</button></div></article>';
    if (tasks.length === 0)
      html +=
        '<article class="kk-insight-task"><span class="kk-insight-pill">' +
        escapeHtml(T('ممتاز', 'Clear schedule')) +
        '</span><strong>' +
        escapeHtml(T('لا توجد واجبات مفتوحة مسجلة', 'No open homework recorded')) +
        '</strong><small>' +
        escapeHtml(
          T(
            'أضف الواجبات التي تريد متابعتها لتظهر أولوياتك هنا.',
            'Add homework to see due-date priorities here.',
          ),
        ) +
        '</small></article>';
    html += '</div></section>';
    host.innerHTML = html;
  }
  window.KashkoolInsightsRender = renderInsights;
  var statsView = $('view-stats');
  if (statsView) {
    var box = document.createElement('div');
    box.id = 'kk-insights-grid';
    var subjectGrid = statsView.querySelector('.subjectStudyGrid');
    var insertAt = subjectGrid && subjectGrid.closest('.statCard');
    if (insertAt && insertAt.parentNode) insertAt.parentNode.insertBefore(box, insertAt.nextSibling);
    else statsView.appendChild(box);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-kk-open-flashcards]');
    if (b) {
      var tab = document.querySelector('.tab[data-view="flashcards"]');
      if (tab) tab.click();
    }
  });

  /* Step 4 — UI language stays matched even though this layer is appended after the app. */
  function syncAddonLanguage() {
    var id = $('flashcardsNav');
    if (id) id.textContent = '🧠 ' + T('البطاقات التعليمية', 'Flashcards');
    var recoverLabels = {
      'kk-recovery-title': ['النسخ الاحتياطي والاستعادة', 'Backups & recovery'],
      'kk-recovery-desc': [
        'يحتفظ التطبيق بنسخ محلية دورية من بيانات الحساب حتى يمكن الرجوع لنسخة سابقة عند الحاجة.',
        'The app keeps rotating local snapshots of account data so you can recover an earlier version.',
      ],
      'kk-backup-now': ['إنشاء نسخة الآن', 'Create backup now'],
      'kk-restore-backup': ['استعادة آخر نسخة تلقائية', 'Restore latest snapshot'],
      'kk-download-full-backup': ['تنزيل نسخة كاملة', 'Download full backup'],
      'kk-restore-deleted': ['استعادة آخر عنصر محذوف', 'Restore last deleted item'],
      'kk-recovery-note': [
        'النسخ التلقائية تبقى على الجهاز نفسه؛ للتنقل بين الأجهزة استخدم تنزيل النسخة الكاملة ثم استيرادها على الجهاز الآخر.',
        'Automatic snapshots stay on this device. To move between devices, download a full backup and import it on the other device.',
      ],
      'kk-diagnostics-title': ['فحص سلاسة الموقع', 'Motion smoothness check'],
      'kk-diagnostics-desc': [
        'اختبار قصير لزمن إطارات الرسم في التبويب الحالي. لا يرسل بيانات للخارج ولا يختبر أداء الجهاز كله.',
        'A short check of frame timing in this tab. It sends no data and does not benchmark the whole device.',
      ],
      'kk-run-frame-test': ['اختبار السلاسة · 3 ثوانٍ', 'Run smoothness test · 3 seconds'],
    };
    Object.keys(recoverLabels).forEach(function (k) {
      var el = $(k);
      if (el) el.textContent = ar() ? recoverLabels[k][0] : recoverLabels[k][1];
    });
    var ds = $('kk-diagnostics-device');
    if (ds) {
      var cores = navigator.hardwareConcurrency || null;
      var memory = navigator.deviceMemory || null;
      ds.textContent =
        T('معلومات الجهاز: ', 'Device hints: ') +
        (cores ? cores + ' CPU threads' : 'CPU: —') +
        (memory ? ' · ~' + memory + ' GB RAM' : '') +
        (navigator.connection && navigator.connection.saveData
          ? ' · ' + T('توفير البيانات مفعّل', 'data saver on')
          : '');
    }
    var result = $('kk-diagnostics-result');
    if (result && !result.dataset.ran)
      result.textContent = T('لم يبدأ الاختبار بعد.', 'Test has not run yet.');
    updateBackupStatus();
    renderFlashcards();
    if ($('view-stats') && !$('view-stats').hidden) renderInsights();
  }
  syncAddonLanguage();
  try {
    new MutationObserver(function (records) {
      if (
        records.some(function (r) {
          return r.attributeName === 'lang' || r.attributeName === 'dir';
        })
      )
        syncAddonLanguage();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  } catch (e) {}

  /* Step 5 — short on-demand frame timing test, never runs in the background. */
  var testBtn = $('kk-run-frame-test');
  if (testBtn)
    testBtn.addEventListener('click', function () {
      if (testBtn.disabled) return;
      testBtn.disabled = true;
      var samples = [],
        start = performance.now(),
        last = start,
        deadline = start + 3000;
      function frame(now) {
        var gap = now - last;
        if (gap > 0) samples.push(gap);
        last = now;
        if (now < deadline) {
          requestAnimationFrame(frame);
          return;
        }
        var total = now - start,
          avg = samples.length ? total / samples.length : 0,
          fps = avg ? Math.round(1000 / avg) : 0,
          slow = samples.filter(function (x) {
            return x > 33.4;
          }).length;
        var r = $('kk-diagnostics-result');
        if (r) {
          r.dataset.ran = '1';
          r.textContent =
            T('متوسط تقريبي: ', 'Approx. average: ') +
            fps +
            ' FPS · ' +
            T('إطارات أبطأ من 33ms: ', 'frames slower than 33ms: ') +
            slow +
            ' · ' +
            T(
              'هذه قراءة للتبويب الحالي وليست تشخيصًا شاملًا للجهاز.',
              'This is a tab-only reading, not a full device benchmark.',
            );
        }
        testBtn.disabled = false;
      }
      requestAnimationFrame(frame);
    });

  /* Step 6 — Progressive web app shell: active only on HTTPS or localhost. */
  if (
    'serviceWorker' in navigator &&
    (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ) {
    navigator.serviceWorker.register('./kashkool-sw.js').catch(function () {});
  }
})();
