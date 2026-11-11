/* ==============================================================
   JS 24/28 · Planner & learning OS · kashkool-learning-os-v50-js · 66.6 KB
   ============================================================== */
/*
 * KashKool v50 — Learning OS enhancement layer
 * Expects KashKoolCore from the v49 core. Kept as a separate source module;
 * the build process inlines this file for the single-file HTML distribution.
 */
(function () {
  'use strict';
  if (window.__KASHKOOL_LEARNING_OS_V50__) return;
  window.__KASHKOOL_LEARNING_OS_V50__ = true;

  var $ = function (id) {
    return document.getElementById(id);
  };
  var root = document.documentElement;
  var selectedPanel = 'overview';
  var selectedBudget = 30;
  var selectedNode = null;
  var lastTrackSnapshot = null;
  var lastDataSnapshot = null;
  var lastCardSnapshot = null;
  var replayFilter = 'all';
  var pendingReview = null;
  var storageEstimate = null;
  var panels = [
    ['overview', 'نظرة عامة', 'Overview', '◈'],
    ['map', 'خريطة المعرفة', 'Knowledge map', '✧'],
    ['dependencies', 'اعتماد المهام', 'Dependencies', '⇢'],
    ['time', 'الوقت المتاح', 'Time available', '◷'],
    ['exams', 'استعداد الامتحانات', 'Exam readiness', '⚑'],
    ['replay', 'سجل الرحلة', 'Study replay', '⌁'],
    ['sync', 'صحة البيانات', 'Sync health', '☁'],
  ];

  function isEn() {
    return root.lang === 'en' || root.dir === 'ltr';
  }
  function T(ar, en) {
    return isEn() ? en : ar;
  }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  }
  function core() {
    return window.KashKoolCore || null;
  }
  function accountId() {
    try {
      return core() && core().getAccountId
        ? core().getAccountId()
        : localStorage.getItem('kashkool.active.account.v1') || 'default';
    } catch (e) {
      return 'default';
    }
  }
  function storeKey() {
    return 'kashkool.learningos.v1.' + accountId();
  }
  function getStore() {
    var raw = safeJson(localStorage.getItem(storeKey()) || 'null', null);
    if (!raw || typeof raw !== 'object') raw = {};
    if (!Array.isArray(raw.events)) raw.events = [];
    raw.schemaVersion = 1;
    return raw;
  }
  function saveStore(value) {
    try {
      localStorage.setItem(storeKey(), JSON.stringify(value));
      return true;
    } catch (e) {
      notify(
        T(
          'مساحة التخزين غير كافية لحفظ سجل النشاط.',
          'Storage is full; the activity history could not be saved.',
        ),
      );
      return false;
    }
  }
  function notify(message) {
    var old = $('kkLosToast');
    if (old) old.remove();
    var box = document.createElement('div');
    box.id = 'kkLosToast';
    box.className = 'kk-los-toast';
    box.innerHTML =
      '<span>' +
      esc(message) +
      '</span><button type="button" class="los-action" data-los-dismiss>' +
      esc(T('إغلاق', 'Dismiss')) +
      '</button>';
    document.body.appendChild(box);
    window.setTimeout(function () {
      if (box.isConnected) box.remove();
    }, 6500);
  }
  function nowStamp() {
    return Date.now();
  }
  function dateKey(value) {
    var d = value instanceof Date ? value : new Date(value || Date.now());
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }
  function dateLabel(value) {
    var d = new Date(value || Date.now());
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString(isEn() ? 'en-US' : 'ar-EG', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
  }
  function timeLabel(value) {
    var d = new Date(value || Date.now());
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleTimeString(isEn() ? 'en-US' : 'ar-EG', { hour: '2-digit', minute: '2-digit' });
  }
  function minutesLabel(value) {
    var n = Math.max(0, Math.round(Number(value) || 0));
    var h = Math.floor(n / 60),
      m = n % 60;
    if (!h) return n + T(' د', ' min');
    return h + T(' س', ' h') + (m ? ' ' + m + T(' د', ' min') : '');
  }
  function clone(value) {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }
  function getData() {
    return core() && core().getData ? core().getData() : {};
  }
  function getTrack() {
    return core() && core().getTrackData
      ? core().getTrackData()
      : { tracks: [], milestones: [], tasks: [], items: [] };
  }
  function getCards() {
    return core() && core().getFlashcards
      ? core().getFlashcards()
      : safeJson(localStorage.getItem('kashkool.flashcards.v1.' + accountId()) || '[]', []);
  }
  function getStats() {
    return core() && core().getStudyStats
      ? core().getStudyStats()
      : safeJson(localStorage.getItem('kashkool.study.stats.v1.' + accountId()) || '[]', []);
  }
  function taskMap(track) {
    var map = Object.create(null);
    (track.tasks || []).forEach(function (t) {
      map[t.id] = t;
    });
    return map;
  }
  function blockedBy(task, track) {
    var map = taskMap(track);
    return (Array.isArray(task && task.dependsOn) ? task.dependsOn : [])
      .map(function (id) {
        return map[id];
      })
      .filter(function (t) {
        return t && t.status !== 'done';
      });
  }
  function isEligible(task, track) {
    return !!task && task.status !== 'done' && blockedBy(task, track).length === 0;
  }
  function trackForTask(task, track) {
    return (
      (track.tracks || []).filter(function (x) {
        return x.id === task.trackId;
      })[0] || null
    );
  }
  function milestoneForTask(task, track) {
    return (
      (track.milestones || []).filter(function (x) {
        return x.id === task.milestoneId;
      })[0] || null
    );
  }
  function subjectForTask(task, data) {
    return (
      (data.subjects || []).filter(function (x) {
        return x.id === task.subjectId;
      })[0] || null
    );
  }
  function findTask(id, track) {
    return (
      (track.tasks || []).filter(function (x) {
        return x.id === id;
      })[0] || null
    );
  }

  function recordEvent(type, title, detail, meta) {
    var s = getStore();
    s.events.unshift({
      id: nowStamp().toString(36) + Math.random().toString(36).slice(2, 7),
      type: type,
      title: String(title || '').slice(0, 140),
      detail: String(detail || '').slice(0, 280),
      at: nowStamp(),
      meta: meta && typeof meta === 'object' ? meta : {},
    });
    if (s.events.length > 600) s.events.length = 600;
    saveStore(s);
  }
  function taskSnapshot(track) {
    var out = Object.create(null);
    (track.tasks || []).forEach(function (t) {
      out[t.id] = {
        title: t.title,
        status: t.status,
        dueDate: t.dueDate,
        trackId: t.trackId,
        dependsOn: (t.dependsOn || []).slice(),
      };
    });
    return out;
  }
  function onTrackSave(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.tasks)) return;
    var current = taskSnapshot(snapshot);
    if (!lastTrackSnapshot) {
      lastTrackSnapshot = current;
      return;
    }
    Object.keys(current).forEach(function (id) {
      var t = current[id],
        old = lastTrackSnapshot[id];
      if (!old)
        recordEvent('task_created', T('إضافة مهمة', 'Task created'), t.title, {
          taskId: id,
          trackId: t.trackId,
        });
      else if (old.status !== t.status)
        recordEvent(
          t.status === 'done' ? 'task_completed' : 'task_status',
          t.status === 'done'
            ? T('إكمال مهمة', 'Task completed')
            : T('تحديث حالة مهمة', 'Task status updated'),
          t.title + ' · ' + t.status,
          { taskId: id, trackId: t.trackId, status: t.status },
        );
      else if (
        old.dueDate !== t.dueDate ||
        old.title !== t.title ||
        JSON.stringify(old.dependsOn) !== JSON.stringify(t.dependsOn)
      )
        recordEvent('task_updated', T('تحديث مهمة', 'Task updated'), t.title, {
          taskId: id,
          trackId: t.trackId,
        });
    });
    Object.keys(lastTrackSnapshot).forEach(function (id) {
      if (!current[id])
        recordEvent('task_deleted', T('حذف مهمة', 'Task deleted'), lastTrackSnapshot[id].title, {
          taskId: id,
        });
    });
    lastTrackSnapshot = current;
  }
  function dataSnapshot(data) {
    var out = Object.create(null);
    ['subjects', 'entries', 'homework', 'links', 'notes', 'exams'].forEach(function (key) {
      out[key] = Object.create(null);
      (data[key] || []).forEach(function (item) {
        out[key][item.id] = {
          title: item.title || item.name || '',
          done: !!item.done,
          date: item.date || item.due || '',
          subjectId: item.subjectId || '',
        };
      });
    });
    return out;
  }
  function onDataSaved(data) {
    if (!data || typeof data !== 'object') return;
    var current = dataSnapshot(data);
    if (!lastDataSnapshot) {
      lastDataSnapshot = current;
      return;
    }
    ['exams', 'homework', 'notes', 'subjects', 'entries', 'links'].forEach(function (key) {
      var oldItems = lastDataSnapshot[key] || {},
        newItems = current[key] || {};
      Object.keys(newItems).forEach(function (id) {
        var x = newItems[id],
          old = oldItems[id];
        if (!old)
          recordEvent(key + '_created', T('إضافة عنصر', 'Item added'), x.title || T(key, key), {
            collection: key,
            id: id,
            subjectId: x.subjectId,
          });
        else if (JSON.stringify(x) !== JSON.stringify(old))
          recordEvent(key + '_updated', T('تحديث عنصر', 'Item updated'), x.title || T(key, key), {
            collection: key,
            id: id,
            subjectId: x.subjectId,
          });
      });
      Object.keys(oldItems).forEach(function (id) {
        if (!newItems[id])
          recordEvent(key + '_deleted', T('حذف عنصر', 'Item deleted'), oldItems[id].title || key, {
            collection: key,
            id: id,
          });
      });
    });
    lastDataSnapshot = current;
  }
  function onStudySession(minutes, subjectId, taskId) {
    var data = getData(),
      subject = (data.subjects || []).filter(function (s) {
        return s.id === subjectId;
      })[0];
    recordEvent(
      'study_session',
      T('جلسة مذاكرة', 'Study session'),
      minutesLabel(minutes) +
        (subject ? ' · ' + subject.name : '') +
        (taskId ? ' · ' + T('مرتبطة بمهمة', 'linked to task') : ''),
      { minutes: Math.max(1, Math.round(minutes || 0)), subjectId: subjectId || '', taskId: taskId || '' },
    );
  }
  function onFlashcardsSave(cards) {
    if (!Array.isArray(cards)) return;
    var current = Object.create(null);
    cards.forEach(function (c) {
      var reviews = Array.isArray(c.reviews) ? c.reviews : [];
      current[c.id] = {
        front: c.front || '',
        subject: c.subject || '',
        count: reviews.length,
        last: reviews.length ? reviews[reviews.length - 1] : 0,
      };
      var old = lastCardSnapshot && lastCardSnapshot[c.id];
      if (old && reviews.length > old.count)
        recordEvent(
          'flashcard_review',
          T('مراجعة بطاقة', 'Flashcard reviewed'),
          c.front || T('بطاقة تعليمية', 'Flashcard'),
          { cardId: c.id, subject: c.subject || '', count: reviews.length - old.count },
        );
    });
    lastCardSnapshot = current;
  }
  function onTaskSessionFinished(taskId, minutes) {
    var track = getTrack(),
      task = findTask(taskId, track);
    if (!task) return;
    recordEvent(
      'task_session_finished',
      T('انتهاء جلسة مهمة', 'Task session finished'),
      task.title + ' · ' + minutesLabel(minutes),
      { taskId: taskId, minutes: minutes },
    );
    showReviewNudge(taskId, minutes);
  }

  function computeCriticalPath(track, onlyTrackId) {
    var tasks = (track.tasks || []).filter(function (t) {
      return t.status !== 'done' && (!onlyTrackId || t.trackId === onlyTrackId);
    });
    var all = taskMap(track),
      memo = Object.create(null),
      visiting = Object.create(null),
      hasCycle = false;
    function visit(id) {
      if (memo[id]) return memo[id];
      if (visiting[id]) {
        hasCycle = true;
        return { minutes: 0, path: [] };
      }
      visiting[id] = true;
      var task = all[id];
      if (!task || task.status === 'done') {
        var finished = { minutes: 0, path: [] };
        delete visiting[id];
        memo[id] = finished;
        return finished;
      }
      var best = { minutes: 0, path: [] };
      (task.dependsOn || []).forEach(function (depId) {
        var dep = all[depId];
        if (!dep || dep.trackId !== task.trackId) return;
        var candidate = visit(depId);
        if (candidate.minutes > best.minutes) best = candidate;
      });
      var remaining = Math.max(0, (Number(task.estimateMinutes) || 15) - (Number(task.actualMinutes) || 0));
      var result = { minutes: best.minutes + remaining, path: best.path.concat([id]) };
      delete visiting[id];
      memo[id] = result;
      return result;
    }
    var longest = { minutes: 0, path: [] };
    tasks.forEach(function (task) {
      var r = visit(task.id);
      if (r.minutes > longest.minutes) longest = r;
    });
    return {
      minutes: longest.minutes,
      path: longest.path,
      hasCycle: hasCycle,
      tasks: longest.path
        .map(function (id) {
          return all[id];
        })
        .filter(Boolean),
      blocked: tasks.filter(function (t) {
        return blockedBy(t, track).length > 0;
      }),
    };
  }

  function renderOverview(track, data, cards, events) {
    var tasks = (track.tasks || []).filter(function (t) {
      var tr = trackForTask(t, track);
      return tr && !tr.archived;
    });
    var open = tasks.filter(function (t) {
      return t.status !== 'done';
    });
    var done = tasks.length - open.length;
    var blocked = tasks.filter(function (t) {
      return blockedBy(t, track).length > 0;
    });
    var dueCards = cards.filter(function (c) {
      return (+c.nextReview || 0) <= Date.now();
    }).length;
    var upcoming = (data.exams || [])
      .filter(function (x) {
        return x.date && x.date >= dateKey(new Date());
      })
      .sort(function (a, b) {
        return String(a.date).localeCompare(String(b.date));
      })[0];
    var recent = events.slice(0, 4);
    var cp = computeCriticalPath(track);
    var pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    return (
      '<div class="los-grid">' +
      '<article class="los-card los-card--wide"><div class="los-card__head"><h3>' +
      esc(T('الصورة الكاملة', 'The whole picture')) +
      '</h3><span class="los-pill">' +
      esc(T('مبني على بياناتك المحلية', 'Built from your saved data')) +
      '</span></div>' +
      '<div class="los-kpi-grid"><div class="los-kpi"><b>' +
      tasks.length +
      '</b><span>' +
      esc(T('إجمالي المهام', 'Total tasks')) +
      '</span></div><div class="los-kpi"><b>' +
      done +
      '/' +
      tasks.length +
      '</b><span>' +
      esc(T('المهام المكتملة', 'Tasks completed')) +
      '</span></div><div class="los-kpi"><b>' +
      blocked.length +
      '</b><span>' +
      esc(T('مهام تنتظر متطلبًا', 'Waiting on a dependency')) +
      '</span></div><div class="los-kpi"><b>' +
      dueCards +
      '</b><span>' +
      esc(T('بطاقات مستحقة', 'Cards due')) +
      '</span></div><div class="los-kpi"><b>' +
      esc(minutesLabel(cp.minutes)) +
      '</b><span>' +
      esc(T('أطول سلسلة متبقية', 'Longest remaining chain')) +
      '</span></div><div class="los-kpi"><b>' +
      (upcoming ? esc(upcoming.date) : '—') +
      '</b><span>' +
      esc(T('الامتحان القادم', 'Next exam')) +
      '</span></div></div>' +
      '<div class="los-progress"><i style="width:' +
      pct +
      '%"></i></div><div class="los-muted">' +
      pct +
      '% · ' +
      esc(T('إنجاز المهام النشطة', 'completion of active tasks')) +
      '</div>' +
      '<div class="los-actions"><button class="los-action los-action--primary" type="button" data-los-panel="time">' +
      esc(T('ماذا أستطيع إنجازه الآن؟', 'What can I do right now?')) +
      '</button><button class="los-action" type="button" data-los-panel="map">' +
      esc(T('استكشف خريطة المعرفة', 'Explore knowledge map')) +
      '</button><button class="los-action" type="button" data-los-panel="sync">' +
      esc(T('فحص صحة البيانات', 'Check data health')) +
      '</button></div></article>' +
      '<article class="los-card"><div class="los-card__head"><h3>' +
      esc(T('مسار التنفيذ الحرج', 'Critical execution path')) +
      '</h3></div>' +
      (cp.path.length
        ? '<div class="los-chain">' +
          cp.tasks
            .map(function (t, i) {
              return (i ? '<i>→</i>' : '') + '<span>' + esc(t.title) + '</span>';
            })
            .join('') +
          '</div><p class="los-muted">' +
          esc(T('المدة التقديرية لهذه السلسلة: ', 'Estimated duration of this chain: ')) +
          esc(minutesLabel(cp.minutes)) +
          '</p>'
        : '<div class="los-empty">' +
          esc(
            T(
              'أضف مهامًا مع تقدير زمني لتظهر سلسلة التنفيذ.',
              'Add tasks with time estimates to calculate the critical chain.',
            ),
          ) +
          '</div>') +
      '</article>' +
      '<article class="los-card"><div class="los-card__head"><h3>' +
      esc(T('آخر النشاطات', 'Recent activity')) +
      '</h3><button class="los-action" type="button" data-los-panel="replay">' +
      esc(T('عرض السجل', 'View replay')) +
      '</button></div>' +
      (recent.length
        ? '<div class="los-list">' + recent.map(eventRow).join('') + '</div>'
        : '<div class="los-empty">' +
          esc(
            T(
              'سيظهر نشاطك هنا بعد استخدام المسار أو المؤقت أو البطاقات.',
              'Your activity will appear here as you use Track, Timer, and Flashcards.',
            ),
          ) +
          '</div>') +
      '</article>' +
      '</div>'
    );
  }
  function mapNodeMarkup(node) {
    return (
      '<button type="button" class="los-node los-node--' +
      node.type +
      '" data-los-node="' +
      esc(node.type) +
      '|' +
      esc(node.id) +
      '" style="--node-color:' +
      esc(node.color || 'var(--mark)') +
      '"><b>' +
      esc(node.label) +
      '</b><small>' +
      esc(node.meta || '') +
      '</small></button>'
    );
  }
  function renderKnowledgeMap(track, data, cards) {
    var subjects = (data.subjects || []).slice(0, 9).map(function (s) {
      return {
        type: 'subject',
        id: s.id,
        label: s.name,
        meta: T('مادة', 'Subject'),
        color: s.color || '#5380B8',
      };
    });
    var tracks = (track.tracks || [])
      .filter(function (t) {
        return !t.archived;
      })
      .slice(0, 7)
      .map(function (t) {
        return {
          type: 'track',
          id: t.id,
          label: t.name,
          meta: t.goal || T('مسار', 'Track'),
          color: t.color || '#B68C36',
        };
      });
    var milestones = (track.milestones || []).slice(0, 8).map(function (m) {
      return {
        type: 'milestone',
        id: m.id,
        label: m.title,
        meta: T('مرحلة', 'Milestone'),
        color: '#B68C36',
        trackId: m.trackId,
      };
    });
    var tasks = (track.tasks || [])
      .filter(function (t) {
        return t.status !== 'done';
      })
      .slice(0, 10)
      .map(function (t) {
        return {
          type: 'task',
          id: t.id,
          label: t.title,
          meta: t.status === 'doing' ? T('قيد التنفيذ', 'In progress') : T('مهمة', 'Task'),
          color: '#2F8B70',
          trackId: t.trackId,
          subjectId: t.subjectId,
          milestoneId: t.milestoneId,
        };
      });
    var notes = (data.notes || []).slice(0, 7).map(function (n) {
      return {
        type: 'note',
        id: n.id,
        label: n.title || T('ملاحظة بدون عنوان', 'Untitled note'),
        meta: T('ملاحظة', 'Note'),
        subjectId: n.subjectId,
      };
    });
    var subjectNames = Object.create(null);
    (data.subjects || []).forEach(function (s) {
      subjectNames[String(s.name || '').toLowerCase()] = s.id;
    });
    var flashNodes = cards.slice(0, 7).map(function (c) {
      return {
        type: 'card',
        id: c.id,
        label: c.front || T('بطاقة', 'Card'),
        meta: c.subject || T('بطاقة تعليمية', 'Flashcard'),
        subjectId: subjectNames[String(c.subject || '').toLowerCase()] || '',
      };
    });
    var exams = (data.exams || []).slice(0, 7).map(function (e) {
      return {
        type: 'exam',
        id: e.id,
        label: e.title || T('امتحان', 'Exam'),
        meta: e.date || T('بدون تاريخ', 'No date'),
        subjectId: e.subjectId || '',
      };
    });
    var columns = [subjects, tracks.concat(milestones), tasks, notes.concat(flashNodes), exams];
    var types = [
      T('المواد', 'Subjects'),
      T('المسارات والمراحل', 'Tracks & stages'),
      T('المهام', 'Tasks'),
      T('المعرفة', 'Knowledge'),
      T('الامتحانات', 'Exams'),
    ];
    var width = 1180,
      gapY = 70,
      maxCount = Math.max.apply(
        null,
        columns
          .map(function (c) {
            return c.length;
          })
          .concat([5]),
      );
    var height = Math.max(470, maxCount * gapY + 90);
    var x = [118, 355, 592, 829, 1066],
      positions = Object.create(null);
    columns.forEach(function (col, ci) {
      col.forEach(function (node, idx) {
        positions[node.type + '|' + node.id] = { x: x[ci], y: 58 + idx * gapY };
      });
    });
    var edges = [];
    tasks.forEach(function (task) {
      if (task.subjectId && positions['subject|' + task.subjectId])
        edges.push(['subject|' + task.subjectId, 'task|' + task.id, false]);
      if (task.trackId && positions['track|' + task.trackId])
        edges.push(['track|' + task.trackId, 'task|' + task.id, true]);
      if (task.milestoneId && positions['milestone|' + task.milestoneId])
        edges.push(['milestone|' + task.milestoneId, 'task|' + task.id, true]);
    });
    function connectSubject(node) {
      if (node.subjectId && positions['subject|' + node.subjectId])
        edges.push(['subject|' + node.subjectId, node.type + '|' + node.id, false]);
    }
    notes.concat(flashNodes, exams).forEach(connectSubject);
    var svg =
      '<svg viewBox="0 0 ' +
      width +
      ' ' +
      height +
      '" role="img" aria-label="' +
      esc(
        T(
          'روابط المواد والمسارات والمهام والمراجعات والامتحانات',
          'Connections between subjects, tracks, tasks, notes, flashcards and exams',
        ),
      ) +
      '">';
    edges.forEach(function (edge) {
      var a = positions[edge[0]],
        b = positions[edge[1]];
      if (!a || !b) return;
      var sx = a.x + 88,
        ex = b.x - 88,
        mid = (sx + ex) / 2;
      svg +=
        '<path class="' +
        (edge[2] ? 'is-track' : '') +
        '" d="M ' +
        sx +
        ' ' +
        (a.y + 23) +
        ' C ' +
        mid +
        ' ' +
        (a.y + 23) +
        ', ' +
        mid +
        ' ' +
        (b.y + 23) +
        ', ' +
        ex +
        ' ' +
        (b.y + 23) +
        '"></path>';
    });
    svg += '</svg>';
    var html =
      '<article class="los-card"><div class="los-card__head"><h3>' +
      esc(T('خريطة المعرفة المترابطة', 'Connected knowledge map')) +
      '</h3><span class="los-pill">' +
      esc(
        subjects.length +
          tracks.length +
          milestones.length +
          tasks.length +
          notes.length +
          flashNodes.length +
          exams.length +
          ' ' +
          T('عنصر ظاهر', 'visible nodes'),
      ) +
      '</span></div><p class="los-muted">' +
      esc(
        T(
          'الخريطة تربط المادة بالمسارات والمهام والملاحظات والبطاقات والامتحانات باستخدام العلاقات المحفوظة. اضغط على أي عقدة لعرض تفاصيلها.',
          'The map connects subjects to tracks, tasks, notes, flashcards, and exams using saved relationships. Select any node to inspect it.',
        ),
      ) +
      '</p><div class="los-map-scroll"><div class="los-map" style="height:' +
      height +
      'px;width:' +
      width +
      'px">' +
      svg +
      '<div class="los-map-cols">';
    columns.forEach(function (col, i) {
      html +=
        '<section class="los-map-col"><h4>' +
        esc(types[i]) +
        '</h4>' +
        (col.map(mapNodeMarkup).join('') || '<div class="los-empty">—</div>') +
        '</section>';
    });
    html +=
      '</div></div></div><div class="los-map-detail" id="losMapDetail"><h4>' +
      esc(T('اختر عقدة من الخريطة', 'Select a node from the map')) +
      '</h4><p>' +
      esc(
        T(
          'ستظهر هنا علاقاتها والمكان الذي يمكنك متابعة العمل منه.',
          'Its relationships and the place to continue working will appear here.',
        ),
      ) +
      '</p></div></article>';
    return html;
  }
  function renderDependencies(track) {
    var active = (track.tasks || []).filter(function (t) {
      return t.status !== 'done';
    });
    var cp = computeCriticalPath(track);
    var blocked = active.filter(function (t) {
      return blockedBy(t, track).length > 0;
    });
    var list = active
      .map(function (t) {
        var deps = (t.dependsOn || [])
          .map(function (id) {
            return findTask(id, track);
          })
          .filter(Boolean);
        var unmet = blockedBy(t, track);
        return (
          '<article class="los-row"><div class="los-row__body"><b>' +
          esc(t.title) +
          '</b><small>' +
          esc((trackForTask(t, track) || {}).name || '') +
          ' · ' +
          esc(t.dueDate || T('بدون موعد', 'No due date')) +
          '</small><small>' +
          esc(
            deps.length
              ? T('يعتمد على: ', 'Depends on: ') +
                  deps
                    .map(function (d) {
                      return d.title;
                    })
                    .join('، ')
              : T('لا توجد متطلبات سابقة', 'No prerequisites'),
          ) +
          '</small>' +
          (unmet.length
            ? '<span class="los-pill is-warn">' +
              esc(
                T('ينتظر: ', 'Waiting for: ') +
                  unmet
                    .map(function (d) {
                      return d.title;
                    })
                    .join('، '),
              ) +
              '</span>'
            : '<span class="los-pill is-good">' + esc(T('جاهزة للبدء', 'Ready to start')) + '</span>') +
          '</div><button class="los-action" type="button" data-los-edit-deps="' +
          esc(t.id) +
          '">' +
          esc(T('تعديل العلاقات', 'Edit dependencies')) +
          '</button></article>'
        );
      })
      .join('');
    return (
      '<div class="los-grid"><article class="los-card los-card--wide"><div class="los-card__head"><h3>' +
      esc(T('العلاقات بين المهام', 'Task dependencies')) +
      '</h3><span class="los-pill">' +
      esc(blocked.length + ' ' + T('محجوبة', 'blocked')) +
      '</span></div><p class="los-muted">' +
      esc(
        T(
          'حدد المهام التي يجب إنجازها أولًا. KashKool يمنع بدء المهمة أو إكمالها قبل إنهاء متطلباتها، ويرفض إنشاء علاقة دائرية.',
          'Set which tasks must be completed first. KashKool prevents starting or completing a task before its prerequisites are finished, and rejects circular dependencies.',
        ),
      ) +
      '</p>' +
      (list
        ? '<div class="los-list">' + list + '</div>'
        : '<div class="los-empty">' +
          esc(T('لا توجد مهام نشطة لإدارة علاقاتها.', 'There are no active tasks to manage.')) +
          '</div>') +
      '</article>' +
      '<article class="los-card los-card--wide"><div class="los-card__head"><h3>' +
      esc(T('المسار الحرج', 'Critical path')) +
      '</h3><span class="los-pill">' +
      esc(minutesLabel(cp.minutes)) +
      '</span></div>' +
      (cp.hasCycle
        ? '<div class="los-empty">' +
          esc(
            T(
              'تم اكتشاف علاقة دائرية في البيانات. راجع المتطلبات قبل الاعتماد على التحليل.',
              'A dependency cycle was detected. Review the relationships before relying on this analysis.',
            ),
          ) +
          '</div>'
        : cp.path.length
          ? '<div class="los-chain">' +
            cp.tasks
              .map(function (t, i) {
                return (i ? '<i>→</i>' : '') + '<span>' + esc(t.title) + '</span>';
              })
              .join('') +
            '</div><p class="los-muted">' +
            esc(
              T(
                'هذه أطول سلسلة مهام مفتوحة حسب تقديرات الوقت المتبقية. هي تقدير تخطيطي وليست موعدًا مضمونًا.',
                'This is the longest open task chain by remaining estimates. It is a planning estimate, not a guaranteed finish date.',
              ),
            ) +
            '</p>'
          : '<div class="los-empty">' +
            esc(
              T(
                'أضف تقديرات زمنية وعلاقات بين المهام لحساب المسار الحرج.',
                'Add time estimates and dependencies to calculate a critical path.',
              ),
            ) +
            '</div>') +
      '</article></div>'
    );
  }
  function recommendTasks(track, data, cards, budget) {
    var candidates = (track.tasks || []).filter(function (t) {
      return isEligible(t, track);
    });
    var rank = { urgent: 0, high: 1, normal: 2, low: 3 };
    candidates.sort(function (a, b) {
      var ad = a.dueDate || '9999-12-31',
        bd = b.dueDate || '9999-12-31';
      return (
        (rank[a.priority] == null ? 2 : rank[a.priority]) -
          (rank[b.priority] == null ? 2 : rank[b.priority]) ||
        ad.localeCompare(bd) ||
        (Number(b.estimateMinutes) || 15) - (Number(a.estimateMinutes) || 15)
      );
    });
    var chosen = [],
      used = 0;
    candidates.forEach(function (task) {
      if (chosen.length >= 3) return;
      var estimate = Math.max(0, Number(task.estimateMinutes) || 0);
      var actual = Math.max(0, Number(task.actualMinutes) || 0);
      // Tasks without estimates use a 15-minute planning placeholder. If measured
      // work already meets an explicit estimate, do not invent more time for it.
      var remaining = estimate > 0 ? Math.max(0, estimate - actual) : 15;
      if (estimate > 0 && remaining === 0) return;
      if (used + remaining <= budget) {
        chosen.push({ task: task, minutes: remaining, partial: false });
        used += remaining;
      } else if (!chosen.length && budget >= 10) {
        chosen.push({ task: task, minutes: budget, partial: true });
        used = budget;
      }
    });
    var dueCards = cards.filter(function (c) {
      return (+c.nextReview || 0) <= Date.now();
    });
    var subjectNames = Object.create(null);
    (data.subjects || []).forEach(function (s) {
      subjectNames[s.id] = s.name;
    });
    return {
      chosen: chosen,
      used: used,
      dueCards: dueCards.length,
      subjectNames: subjectNames,
      candidates: candidates.length,
    };
  }
  function renderTime(track, data, cards) {
    var rec = recommendTasks(track, data, cards, selectedBudget);
    var options = [10, 20, 30, 45, 60, 90]
      .map(function (n) {
        return (
          '<button type="button" class="los-budget" data-los-budget="' +
          n +
          '" aria-pressed="' +
          (selectedBudget === n) +
          '">' +
          n +
          '<small>' +
          esc(T('دقيقة', 'minutes')) +
          '</small></button>'
        );
      })
      .join('');
    var picks = rec.chosen
      .map(function (x) {
        var sub = subjectForTask(x.task, data),
          trackInfo = trackForTask(x.task, track);
        return (
          '<article class="los-recommendation"><div><span class="los-pill ' +
          (x.task.priority === 'urgent' ? 'is-warn' : '') +
          '">' +
          esc(T('أولوية ', 'Priority ') + (x.task.priority || 'normal')) +
          '</span><h4>' +
          esc(x.task.title) +
          '</h4><p>' +
          esc(
            (trackInfo ? trackInfo.name : '') +
              (sub ? ' · ' + sub.name : '') +
              (x.task.dueDate ? ' · ' + x.task.dueDate : ''),
          ) +
          '</p><p>' +
          esc(
            x.partial
              ? T('جلسة جزئية مقترحة', 'Suggested partial session')
              : T('الوقت المتبقي التقديري', 'Estimated remaining'),
          ) +
          ': ' +
          esc(minutesLabel(x.minutes)) +
          '</p></div><button type="button" class="los-action los-action--primary" data-los-study="' +
          esc(x.task.id) +
          '">' +
          esc(T('ابدأ', 'Start')) +
          '</button></article>'
        );
      })
      .join('');
    var cardText = rec.dueCards
      ? '<article class="los-row"><div class="los-row__body"><b>' +
        rec.dueCards +
        ' ' +
        esc(T('بطاقة مستحقة للمراجعة', 'cards due for review')) +
        '</b><small>' +
        esc(
          T(
            'مناسبة لوقت قصير أو كجزء من جلسة أطول.',
            'Useful for a short break or as part of a longer session.',
          ),
        ) +
        '</small></div><button class="los-action" type="button" data-los-open="flashcards">' +
        esc(T('افتح البطاقات', 'Open cards')) +
        '</button></article>'
      : '';
    return (
      '<div class="los-grid"><article class="los-card los-card--wide"><div class="los-card__head"><h3>' +
      esc(T('كم من الوقت لديك الآن؟', 'How much time do you have?')) +
      '</h3><span class="los-pill">' +
      esc(T('اقتراحات محلية قابلة للتفسير', 'Transparent local recommendations')) +
      '</span></div><p class="los-muted">' +
      esc(
        T(
          'حدد الوقت المتاح. سيختار النظام مهامًا جاهزة للبدء وفق المتطلبات والأولوية والموعد والتقدير الزمني. لن يغير جدولك تلقائيًا.',
          'Choose your available time. The system will suggest eligible tasks using dependencies, priority, deadlines, and estimates. It will not change your schedule automatically.',
        ),
      ) +
      '</p><div class="los-budget-grid">' +
      options +
      '</div><div class="los-card__head" style="margin-top:18px"><h3>' +
      esc(T('اقتراحاتك لهذه الفترة', 'Suggestions for this time window')) +
      '</h3><span class="los-pill">' +
      esc(minutesLabel(rec.used) + ' / ' + minutesLabel(selectedBudget)) +
      '</span></div>' +
      (picks
        ? '<div class="los-list">' + picks + '</div>'
        : '<div class="los-empty">' +
          esc(
            T(
              'لا توجد مهام جاهزة بهذه المدة. راجع المتطلبات السابقة أو أضف تقديرات زمنية للمهام.',
              'No eligible task fits this time window. Review prerequisites or add task time estimates.',
            ),
          ) +
          '</div>') +
      cardText +
      '<p class="los-muted">' +
      esc(
        T(
          'المهام التي لا تملك تقديرًا زمنيًا تحصل على تقدير افتراضي قدره 15 دقيقة لأغراض الاقتراح فقط.',
          'Tasks without an estimate use a 15-minute planning placeholder for suggestions only.',
        ),
      ) +
      '</p></article></div>'
    );
  }
  function examReadiness(exam, track, data, cards, stats) {
    var subject =
      (data.subjects || []).filter(function (s) {
        return s.id === exam.subjectId;
      })[0] || null;
    var tasks = (track.tasks || []).filter(function (t) {
      return !!exam.subjectId && t.subjectId === exam.subjectId;
    });
    var taskMetric = tasks.length
      ? tasks.filter(function (t) {
          return t.status === 'done';
        }).length / tasks.length
      : null;
    var subjectName = subject ? String(subject.name || '').toLowerCase() : '';
    var subjectCards = subjectName
      ? cards.filter(function (c) {
          return String(c.subject || '').toLowerCase() === subjectName;
        })
      : [];
    var cardMetric = subjectCards.length
      ? subjectCards.filter(function (c) {
          return (+c.nextReview || 0) > Date.now();
        }).length / subjectCards.length
      : null;
    var sevenDays = Date.now() - 7 * 86400000;
    var subjectSessions = stats.filter(function (s) {
      return !!exam.subjectId && s.subjectId === exam.subjectId;
    });
    var hasStudyHistory = subjectSessions.length > 0;
    var minutes7 = subjectSessions
      .filter(function (s) {
        return (+s.at || 0) >= sevenDays;
      })
      .reduce(function (a, s) {
        return a + (Number(s.minutes) || 0);
      }, 0);
    var studyMetric = hasStudyHistory ? Math.min(1, minutes7 / 180) : null;
    var weighted = 0,
      weight = 0;
    if (taskMetric !== null) {
      weighted += taskMetric * 60;
      weight += 60;
    }
    if (cardMetric !== null) {
      weighted += cardMetric * 25;
      weight += 25;
    }
    if (studyMetric !== null) {
      weighted += studyMetric * 15;
      weight += 15;
    }
    var score = weight ? Math.round((weighted / weight) * 100) : null;
    return {
      subject: subject,
      tasks: tasks.length,
      taskMetric: taskMetric,
      cards: subjectCards.length,
      dueCards: subjectCards.filter(function (c) {
        return (+c.nextReview || 0) <= Date.now();
      }).length,
      minutes7: minutes7,
      score: score,
      confidence: weight >= 90 ? 'high' : weight >= 60 ? 'medium' : weight > 0 ? 'low' : 'none',
    };
  }
  function renderExams(track, data, cards, stats) {
    var list = (data.exams || []).slice().sort(function (a, b) {
      return String(a.date || '9999').localeCompare(String(b.date || '9999'));
    });
    if (!list.length)
      return (
        '<div class="los-empty">' +
        esc(
          T(
            'أضف امتحانًا من صفحة الامتحانات، واربطه بمادة ليظهر مؤشر المتابعة.',
            'Add an exam in the Exams page and link it to a subject to see its readiness indicators.',
          ),
        ) +
        '<div class="los-actions"><button class="los-action" data-los-open="exams">' +
        esc(T('فتح الامتحانات', 'Open exams')) +
        '</button></div></div>'
      );
    return (
      '<div class="los-grid">' +
      list
        .map(function (exam) {
          var r = examReadiness(exam, track, data, cards, stats),
            score = r.score;
          var confidenceText =
            r.confidence === 'high'
              ? T('أدلة متعددة', 'Multiple signals')
              : r.confidence === 'medium'
                ? T('أدلة متوسطة', 'Some signals')
                : r.confidence === 'low'
                  ? T('بيانات محدودة', 'Limited data')
                  : T('بيانات غير كافية', 'Insufficient data');
          return (
            '<article class="los-exam"><div><span class="los-pill">' +
            esc(r.subject ? r.subject.name : T('غير مربوط بمادة', 'No linked subject')) +
            '</span><h3 style="margin:7px 0 3px;font-size:1rem">' +
            esc(exam.title || T('امتحان', 'Exam')) +
            '</h3><p class="los-muted">' +
            esc(exam.date || T('لم يحدد موعد', 'No date set')) +
            ' · ' +
            esc(confidenceText) +
            '</p><div class="los-exam__evidence"><span>' +
            esc(T('المهام', 'Tasks')) +
            ': ' +
            (r.taskMetric === null ? '—' : Math.round(r.taskMetric * 100) + '%') +
            ' (' +
            r.tasks +
            ')</span><span>' +
            esc(T('بطاقات غير مستحقة', 'Cards not due')) +
            ': ' +
            (r.cards ? r.cards - r.dueCards + '/' + r.cards : '—') +
            '</span><span>' +
            esc(T('مذاكرة آخر 7 أيام', 'Study last 7 days')) +
            ': ' +
            esc(minutesLabel(r.minutes7)) +
            '</span></div><div class="los-actions"><button class="los-action" type="button" data-los-open="exams">' +
            esc(T('تفاصيل الامتحان', 'Exam details')) +
            '</button>' +
            (r.subject
              ? '<button class="los-action" type="button" data-los-subject="' +
                esc(r.subject.id) +
                '">' +
                esc(T('افتح المادة', 'Open subject')) +
                '</button>'
              : '') +
            '</div></div><div class="los-exam__score">' +
            (score === null ? '<b>—</b>' : '<b>' + score + '%</b>') +
            '<small>' +
            esc(T('مؤشر متابعة', 'Study signal')) +
            '</small></div></article>'
          );
        })
        .join('') +
      '<article class="los-card los-card--wide"><p class="los-muted">' +
      esc(
        T(
          'تنبيه منهجي: هذه النسبة مؤشر لتغطية النشاط المسجل فقط، وليست توقعًا للدرجة أو قياسًا مضمونًا لفهمك. تُحسب من إنجاز مهام المادة، وحالة بطاقاتها، ووقت المذاكرة المسجل خلال آخر 7 أيام. اربط المهام والبطاقات بالمادة لتحسين جودة المؤشر.',
          'Method note: this is an indicator of recorded study activity, not a grade prediction or a guaranteed measure of understanding. It uses completed subject tasks, flashcard review status, and logged study time over the last 7 days. Link tasks and cards to the subject to improve the signal.',
        ),
      ) +
      '</p></article></div>'
    );
  }
  function eventLabel(event) {
    var map = {
      task_created: ['إنشاء مهمة', 'Task created'],
      task_completed: ['إكمال مهمة', 'Task completed'],
      task_status: ['تغيير حالة مهمة', 'Task status changed'],
      task_updated: ['تعديل مهمة', 'Task updated'],
      task_deleted: ['حذف مهمة', 'Task deleted'],
      study_session: ['جلسة مذاكرة', 'Study session'],
      task_session_finished: ['انتهاء جلسة مهمة', 'Task session finished'],
      flashcard_review: ['مراجعة بطاقة', 'Flashcard reviewed'],
      exams_created: ['إضافة امتحان', 'Exam added'],
      exams_updated: ['تعديل امتحان', 'Exam updated'],
      exams_deleted: ['حذف امتحان', 'Exam deleted'],
      homework_created: ['إضافة واجب', 'Homework added'],
      homework_updated: ['تعديل واجب', 'Homework updated'],
      homework_deleted: ['حذف واجب', 'Homework deleted'],
      notes_created: ['إضافة ملاحظة', 'Note added'],
      notes_updated: ['تعديل ملاحظة', 'Note updated'],
      notes_deleted: ['حذف ملاحظة', 'Note deleted'],
      subjects_created: ['إضافة مادة', 'Subject added'],
      subjects_updated: ['تعديل مادة', 'Subject updated'],
      subjects_deleted: ['حذف مادة', 'Subject deleted'],
    };
    return map[event.type] ? T(map[event.type][0], map[event.type][1]) : event.title || T('نشاط', 'Activity');
  }
  function eventRow(event) {
    return (
      '<article class="los-event"><b>' +
      esc(eventLabel(event)) +
      '</b><small>' +
      esc(event.detail || '') +
      ' · ' +
      esc(timeLabel(event.at)) +
      '</small></article>'
    );
  }
  function renderReplay() {
    var events = getStore().events;
    if (replayFilter !== 'all')
      events = events.filter(function (e) {
        return e.type === replayFilter;
      });
    var groups = Object.create(null);
    events.forEach(function (e) {
      var k = dateKey(e.at);
      (groups[k] || (groups[k] = [])).push(e);
    });
    var keys = Object.keys(groups).sort().reverse();
    var filters = [
      ['all', T('الكل', 'All')],
      ['study_session', T('المذاكرة', 'Study')],
      ['task_completed', T('إنجاز المهام', 'Completions')],
      ['flashcard_review', T('البطاقات', 'Flashcards')],
    ];
    return (
      '<article class="los-card"><div class="los-card__head"><h3>' +
      esc(T('سجل نشاطك', 'Your activity timeline')) +
      '</h3><span class="los-pill">' +
      getStore().events.length +
      ' ' +
      esc(T('حدث محفوظ', 'saved events')) +
      '</span></div><div class="los-actions" style="margin-top:0;margin-bottom:12px">' +
      filters
        .map(function (f) {
          return (
            '<button class="los-action" type="button" data-los-replay-filter="' +
            f[0] +
            '" aria-pressed="' +
            (replayFilter === f[0]) +
            '">' +
            esc(f[1]) +
            '</button>'
          );
        })
        .join('') +
      '<button class="los-action" type="button" data-los-export-history>' +
      esc(T('تصدير السجل', 'Export history')) +
      '</button></div>' +
      (keys.length
        ? '<div class="los-replay">' +
          keys
            .map(function (k) {
              return (
                '<section class="los-replay-day"><div class="los-replay-date">' +
                esc(dateLabel(k + 'T12:00:00')) +
                '</div><div class="los-replay-events">' +
                groups[k].map(eventRow).join('') +
                '</div></section>'
              );
            })
            .join('') +
          '</div>'
        : '<div class="los-empty">' +
          esc(T('لا توجد أحداث مطابقة بعد.', 'No matching events yet.')) +
          '</div>') +
      '</article>'
    );
  }
  function storageBytes() {
    var total = 0,
      keys = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || '';
        if (k.indexOf('.' + accountId()) >= 0 || k === 'kashkool.accounts.v1') {
          var v = localStorage.getItem(k) || '';
          total += (k.length + v.length) * 2;
          keys++;
        }
      }
    } catch (e) {}
    return { bytes: total, keys: keys };
  }
  function humanBytes(value) {
    var n = Math.max(0, Number(value) || 0);
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(2) + ' MB';
  }
  function renderSync() {
    var cloud =
      window.KashKoolCloudStatus && window.KashKoolCloudStatus.getStatus
        ? window.KashKoolCloudStatus.getStatus()
        : null;
    var local = storageBytes(),
      online = navigator.onLine !== false;
    var connected = !!(cloud && cloud.signedIn && cloud.syncReady);
    var pending = cloud ? cloud.pendingWrites : 0;
    var status = connected
      ? pending
        ? T('هناك تغييرات تنتظر الرفع', 'Changes waiting to upload')
        : T('المزامنة متصلة', 'Sync connected')
      : T('تخزين محلي فقط', 'Local storage only');
    var lastSync =
      cloud && cloud.lastSyncAt
        ? dateLabel(cloud.lastSyncAt) + ' · ' + timeLabel(cloud.lastSyncAt)
        : T('لا توجد مزامنة ناجحة مسجلة', 'No successful sync recorded');
    var conflicts = cloud && Array.isArray(cloud.conflicts) ? cloud.conflicts : [];
    var html =
      '<div class="los-grid"><article class="los-card los-card--wide"><div class="los-card__head"><h3>' +
      esc(T('مركز صحة البيانات', 'Data health center')) +
      '</h3><span class="los-pill ' +
      (connected && !pending ? 'is-good' : 'is-warn') +
      '">' +
      esc(status) +
      '</span></div><div class="los-sync-grid"><div class="los-sync-item"><span>' +
      esc(T('الاتصال بالإنترنت', 'Internet connection')) +
      '</span><b>' +
      esc(online ? T('متصل', 'Online') : T('غير متصل', 'Offline')) +
      '</b></div><div class="los-sync-item"><span>' +
      esc(T('حساب السحابة', 'Cloud account')) +
      '</span><b>' +
      esc(
        cloud && cloud.signedIn
          ? cloud.username || T('مسجل الدخول', 'Signed in')
          : T('غير مسجل الدخول', 'Not signed in'),
      ) +
      '</b></div><div class="los-sync-item"><span>' +
      esc(T('حالة Firebase', 'Firebase status')) +
      '</span><b>' +
      esc(
        cloud && cloud.configured
          ? connected
            ? T('جاهز للمزامنة', 'Ready to sync')
            : T('الإعداد محفوظ، الاتصال غير مكتمل', 'Configured, connection not ready')
          : T('غير مهيأ', 'Not configured'),
      ) +
      '</b></div><div class="los-sync-item"><span>' +
      esc(T('تغييرات تنتظر الرفع', 'Pending uploads')) +
      '</span><b>' +
      pending +
      '</b></div><div class="los-sync-item"><span>' +
      esc(T('آخر مزامنة ناجحة', 'Last successful sync')) +
      '</span><b>' +
      esc(lastSync) +
      '</b></div><div class="los-sync-item"><span>' +
      esc(T('معرّف الحساب المحلي', 'Local account ID')) +
      '</span><b>' +
      esc(accountId()) +
      '</b></div></div><div class="los-actions"><button class="los-action los-action--primary" type="button" data-los-sync-now ' +
      (!connected || !online ? 'disabled' : '') +
      '>' +
      esc(T('مزامنة الآن', 'Sync now')) +
      '</button><button class="los-action" type="button" data-los-account>' +
      esc(T('إعداد الحساب السحابي', 'Cloud account settings')) +
      '</button><button class="los-action" type="button" data-los-export-history>' +
      esc(T('تصدير سجل النشاط', 'Export activity log')) +
      '</button></div><p class="los-muted">' +
      esc(
        T(
          'لا يقرأ هذا المركز محتوى كلمة المرور ولا يعرض مفاتيح Firebase السرية. بيانات المسارات والملاحظات والبطاقات تظل محفوظة محليًا أيضًا، ويُعرض وضع السحابة بوضوح حتى لا يُفهم التخزين المحلي على أنه مزامنة.',
          'This center never reads or displays passwords or private Firebase credentials. Track, notes, and flashcards remain locally stored too; local-only mode is shown explicitly so it is not mistaken for cloud sync.',
        ),
      ) +
      '</p></article><article class="los-card"><div class="los-card__head"><h3>' +
      esc(T('التخزين المحلي', 'Local storage')) +
      '</h3></div><div class="los-kpi-grid"><div class="los-kpi"><b>' +
      esc(humanBytes(local.bytes)) +
      '</b><span>' +
      esc(T('حجم تقريبي للحساب', 'Approx. account data size')) +
      '</span></div><div class="los-kpi"><b>' +
      local.keys +
      '</b><span>' +
      esc(T('مفاتيح تخزين', 'Storage keys')) +
      '</span></div></div><div class="los-muted" id="losStorageEstimate">' +
      esc(T('جارٍ فحص حصة تخزين المتصفح…', 'Checking browser storage quota…')) +
      '</div></article><article class="los-card"><div class="los-card__head"><h3>' +
      esc(T('فحص السلامة', 'Integrity checks')) +
      '</h3></div><div class="los-list"><div class="los-row"><div class="los-row__body"><b>' +
      esc(T('سجل النشاط', 'Activity history')) +
      '</b><small>' +
      esc(getStore().events.length + ' / 600 ' + T('حدث محفوظ', 'events stored')) +
      '</small></div><span class="los-pill is-good">' +
      esc(T('سليم', 'OK')) +
      '</span></div><div class="los-row"><div class="los-row__body"><b>' +
      esc(T('بيانات المسار', 'Track data')) +
      '</b><small>' +
      esc(T('تُحفظ منفصلة لكل حساب', 'Scoped to the active account')) +
      '</small></div><span class="los-pill is-good">' +
      esc(T('محلي', 'Local')) +
      '</span></div><div class="los-row"><div class="los-row__body"><b>' +
      esc(T('حالة الشبكة', 'Network state')) +
      '</b><small>' +
      esc(
        online
          ? T('يمكن طلب المزامنة', 'Sync can be requested')
          : T('ستنتظر المزامنة عودة الاتصال', 'Sync waits for connectivity'),
      ) +
      '</small></div><span class="los-pill ' +
      (online ? 'is-good' : 'is-warn') +
      '">' +
      esc(online ? T('متصل', 'Online') : T('غير متصل', 'Offline')) +
      '</span></div></div></article></div>';
    if (conflicts.length) {
      var conflictRows = conflicts
        .map(function (c) {
          var localIsLoser = c.winner === 'remote';
          var remoteIsLoser = c.winner === 'local';
          return (
            '<article class="los-row los-conflict-row"><div class="los-row__body"><b>' +
            esc(c.key || T('سجل بيانات', 'Data record')) +
            '</b><small>' +
            esc(
              T('النسخة الأحدث حاليًا: ', 'Current winning version: ') +
                (c.winner === 'local' ? T('الجهاز', 'This device') : T('السحابة', 'Cloud')) +
                ' · ' +
                dateLabel(c.detectedAt),
            ) +
            '</small><small>' +
            esc(
              c.snapshotSaved
                ? T(
                    'تم الاحتفاظ بنسخة من التعديل الآخر محليًا.',
                    'A copy of the other version was preserved locally.',
                  )
                : T(
                    'النسخة الأقدم كبيرة جدًا ولم يمكن حفظ نسخة منها.',
                    'The older version was too large to preserve.',
                  ),
            ) +
            '</small></div><div class="los-conflict-actions"><button class="los-action" type="button" data-los-conflict-resolve="' +
            esc(c.id) +
            '" data-los-conflict-choice="local" ' +
            (localIsLoser && !c.snapshotSaved ? 'disabled' : '') +
            '>' +
            esc(T('احتفظ بنسخة الجهاز', 'Keep device copy')) +
            '</button><button class="los-action" type="button" data-los-conflict-resolve="' +
            esc(c.id) +
            '" data-los-conflict-choice="remote" ' +
            (remoteIsLoser && !c.snapshotSaved ? 'disabled' : '') +
            '>' +
            esc(T('احتفظ بنسخة السحابة', 'Keep cloud copy')) +
            '</button></div></article>'
          );
        })
        .join('');
      var conflictCard =
        '<article class="los-card los-card--wide los-conflict-card"><div class="los-card__head"><h3>' +
        esc(T('تعارضات تحتاج قرارًا', 'Conflicts to review')) +
        '</h3><span class="los-pill is-warn">' +
        conflicts.length +
        '</span></div><p class="los-muted">' +
        esc(
          T(
            'تم العثور على نسختين مختلفتين للمفتاح نفسه. يمكنك الاحتفاظ بنسخة الجهاز أو السحابة. لو تغيّرت البيانات منذ اكتشاف التعارض، سيطلب منك النظام إعادة الفحص بدل الكتابة فوق تعديل أحدث.',
            'Two different versions of the same record were detected. Keep either the device or cloud version. If the record changed after detection, the system asks you to refresh rather than overwrite newer work.',
          ),
        ) +
        '</p><div class="los-list">' +
        conflictRows +
        '</div></article>';
      html = html.replace('<div class="los-grid">', '<div class="los-grid">' + conflictCard);
    }
    window.setTimeout(function () {
      if (!navigator.storage || !navigator.storage.estimate) return;
      navigator.storage
        .estimate()
        .then(function (estimate) {
          storageEstimate = estimate;
          var el = $('losStorageEstimate');
          if (el && el.isConnected)
            el.textContent =
              T('استخدام الأصل: ', 'Origin usage: ') +
              humanBytes(estimate.usage) +
              ' / ' +
              humanBytes(estimate.quota) +
              (estimate.quota
                ? ' (' + Math.round(((estimate.usage || 0) / estimate.quota) * 100) + '%)'
                : '');
        })
        .catch(function () {
          var el = $('losStorageEstimate');
          if (el)
            el.textContent = T('تعذر قراءة حصة التخزين من المتصفح.', 'Browser storage quota is unavailable.');
        });
    }, 0);
    return html;
  }
  function getPanelMarkup(track, data, cards, stats, events) {
    if (selectedPanel === 'map') return renderKnowledgeMap(track, data, cards);
    if (selectedPanel === 'dependencies') return renderDependencies(track);
    if (selectedPanel === 'time') return renderTime(track, data, cards);
    if (selectedPanel === 'exams') return renderExams(track, data, cards, stats);
    if (selectedPanel === 'replay') return renderReplay();
    if (selectedPanel === 'sync') return renderSync();
    return renderOverview(track, data, cards, events);
  }
  function renderPage() {
    var host = $('view-learning');
    if (!host || !core()) return;
    var track = getTrack(),
      data = getData(),
      cards = getCards(),
      stats = getStats(),
      events = getStore().events;
    var visibleTrackIds = Object.create(null);
    (track.tracks || []).forEach(function (t) {
      if (!t.archived) visibleTrackIds[t.id] = true;
    });
    var activeTasks = (track.tasks || []).filter(function (t) {
      return !!visibleTrackIds[t.trackId];
    });
    var tasks = activeTasks.filter(function (t) {
      return t.status !== 'done';
    });
    var completed = activeTasks.filter(function (t) {
      return t.status === 'done';
    }).length;
    var due = cards.filter(function (c) {
      return (+c.nextReview || 0) <= Date.now();
    }).length;
    var pct = activeTasks.length ? Math.round((completed / activeTasks.length) * 100) : 0;
    host.innerHTML =
      '<div class="los-shell"><header class="los-hero"><span class="los-hero__eyebrow">KASHKOOL · LEARNING OS · V50</span><h2>' +
      esc(T('من التخطيط إلى الفهم والإنجاز', 'From planning to understanding and execution')) +
      '</h2><p>' +
      esc(
        T(
          'مساحة واحدة تربط أهدافك ومهامك ومصادرك وجلساتك ومراجعاتك وبياناتك. لا يوجد ذكاء اصطناعي خارجي هنا؛ كل المؤشرات مبنية على البيانات التي سجلتها بنفسك.',
          'One workspace connecting goals, tasks, resources, sessions, reviews, and data health. No external AI is used here; every indicator is derived from information you have recorded.',
        ),
      ) +
      '</p><div class="los-hero__stats"><div class="los-stat"><span>' +
      esc(T('المهام المفتوحة', 'Open tasks')) +
      '</span><b>' +
      tasks.length +
      '</b></div><div class="los-stat"><span>' +
      esc(T('معدل الإنجاز', 'Completion rate')) +
      '</span><b>' +
      pct +
      '%</b></div><div class="los-stat"><span>' +
      esc(T('بطاقات مستحقة', 'Cards due')) +
      '</span><b>' +
      due +
      '</b></div><div class="los-stat"><span>' +
      esc(T('أحداث في السجل', 'Replay events')) +
      '</span><b>' +
      events.length +
      '</b></div></div></header><nav class="los-tabs" aria-label="' +
      esc(T('أقسام Learning OS', 'Learning OS sections')) +
      '">' +
      panels
        .map(function (p) {
          return (
            '<button type="button" class="los-tab" data-los-panel="' +
            p[0] +
            '" aria-pressed="' +
            (selectedPanel === p[0]) +
            '"><span aria-hidden="true">' +
            p[3] +
            '</span> ' +
            esc(T(p[1], p[2])) +
            '</button>'
          );
        })
        .join('') +
      '</nav><div id="losPanelHost">' +
      getPanelMarkup(track, data, cards, stats, events) +
      '</div></div>';
    highlightSelectedNode();
  }
  function highlightSelectedNode() {
    if (!selectedNode) return;
    var node = document.querySelector('[data-los-node="' + CSS.escape(selectedNode) + '"]');
    if (node) node.classList.add('is-selected');
  }
  function openNode(type, id) {
    var track = getTrack(),
      data = getData(),
      cards = getCards(),
      item = null,
      label = '',
      detail = '',
      action = '';
    if (type === 'subject') {
      item = (data.subjects || []).filter(function (x) {
        return x.id === id;
      })[0];
      if (item) {
        label = item.name;
        detail = item.teacher || T('مادة دراسية', 'Study subject');
        action = 'subjects';
      }
    } else if (type === 'track') {
      item = (track.tracks || []).filter(function (x) {
        return x.id === id;
      })[0];
      if (item) {
        label = item.name;
        detail = item.goal || T('مسار', 'Track');
        action = 'track';
      }
    } else if (type === 'milestone') {
      item = (track.milestones || []).filter(function (x) {
        return x.id === id;
      })[0];
      if (item) {
        label = item.title;
        detail = item.description || T('مرحلة', 'Milestone');
        action = 'track';
      }
    } else if (type === 'task') {
      item = findTask(id, track);
      if (item) {
        label = item.title;
        detail = (trackForTask(item, track) || {}).name || T('مهمة', 'Task');
        action = 'track';
      }
    } else if (type === 'note') {
      item = (data.notes || []).filter(function (x) {
        return x.id === id;
      })[0];
      if (item) {
        label = item.title;
        detail = item.body || item.text || T('ملاحظة', 'Note');
        action = 'notes';
      }
    } else if (type === 'card') {
      item = cards.filter(function (x) {
        return x.id === id;
      })[0];
      if (item) {
        label = item.front;
        detail = item.back;
        action = 'flashcards';
      }
    } else if (type === 'exam') {
      item = (data.exams || []).filter(function (x) {
        return x.id === id;
      })[0];
      if (item) {
        label = item.title || T('امتحان', 'Exam');
        detail = item.date || T('بدون تاريخ', 'No date');
        action = 'exams';
      }
    }
    if (!item) return;
    selectedNode = type + '|' + id;
    var box = $('losMapDetail');
    if (box)
      box.innerHTML =
        '<h4>' +
        esc(label) +
        '</h4><p>' +
        esc(detail) +
        '</p><div class="los-actions"><button class="los-action los-action--primary" type="button" data-los-node-open="' +
        esc(action) +
        '">' +
        esc(T('افتح القسم المرتبط', 'Open related section')) +
        '</button>' +
        (type === 'task'
          ? '<button class="los-action" type="button" data-los-study="' +
            esc(id) +
            '">' +
            esc(T('ابدأ المهمة', 'Start task')) +
            '</button>'
          : '') +
        '</div>';
    document.querySelectorAll('.los-node.is-selected').forEach(function (x) {
      x.classList.remove('is-selected');
    });
    var el = document.querySelector('[data-los-node="' + CSS.escape(selectedNode) + '"]');
    if (el) el.classList.add('is-selected');
  }
  function showOverlay(html) {
    var old = $('kkLosBackdrop');
    if (old) old.remove();
    var layer = document.createElement('div');
    layer.id = 'kkLosBackdrop';
    layer.className = 'kk-los-backdrop';
    layer.innerHTML = html;
    layer.addEventListener('click', function (e) {
      if (e.target === layer || e.target.closest('[data-los-close]')) layer.remove();
    });
    document.body.appendChild(layer);
    var focus = layer.querySelector('button,input,textarea,select');
    if (focus) focus.focus();
    return layer;
  }
  function openDependencies(taskId) {
    var track = getTrack(),
      task = findTask(taskId, track);
    if (!task) return;
    var candidates = (track.tasks || []).filter(function (t) {
      return t.id !== taskId && t.trackId === task.trackId;
    });
    var checked = Object.create(null);
    (task.dependsOn || []).forEach(function (id) {
      checked[id] = true;
    });
    var options = candidates
      .map(function (t) {
        return (
          '<label class="los-dep-option"><input type="checkbox" value="' +
          esc(t.id) +
          '" ' +
          (checked[t.id] ? 'checked' : '') +
          '><span><b>' +
          esc(t.title) +
          '</b><small> · ' +
          esc(t.status) +
          (t.status === 'done' ? ' ✓' : '') +
          '</small></span></label>'
        );
      })
      .join('');
    var layer = showOverlay(
      '<section class="kk-los-dialog" role="dialog" aria-modal="true" aria-labelledby="losDepsTitle"><h3 id="losDepsTitle">' +
        esc(T('المتطلبات السابقة للمهمة', 'Task prerequisites')) +
        '</h3><p>' +
        esc(task.title) +
        '<br>' +
        esc(
          T(
            'حدد المهام التي يجب أن تكتمل قبل هذه المهمة. لا يمكن ربط مهمة من مسار آخر، ولا يمكن إنشاء علاقة دائرية.',
            'Select tasks that must be completed before this one. Tasks from another track cannot be linked, and circular dependencies are rejected.',
          ),
        ) +
        '</p><div class="los-dep-editor">' +
        (options ||
          '<div class="los-empty">' +
            esc(T('لا توجد مهام أخرى داخل هذا المسار.', 'There are no other tasks in this track.')) +
            '</div>') +
        '</div><p id="losDepsError" class="los-muted" role="status"></p><div class="kk-los-dialog__foot"><button type="button" class="los-action" data-los-close>' +
        esc(T('إلغاء', 'Cancel')) +
        '</button><button type="button" class="los-action los-action--primary" data-los-save-deps="' +
        esc(taskId) +
        '">' +
        esc(T('حفظ العلاقات', 'Save dependencies')) +
        '</button></div></section>',
    );
    return layer;
  }
  function openStudyBrief(taskId) {
    var track = getTrack(),
      data = getData(),
      cards = getCards(),
      task = findTask(taskId, track);
    if (!task) return;
    var unmet = blockedBy(task, track),
      trackInfo = trackForTask(task, track),
      milestone = milestoneForTask(task, track),
      subject = subjectForTask(task, data);
    var subjectCards = subject
      ? cards.filter(function (c) {
          return String(c.subject || '').toLowerCase() === String(subject.name || '').toLowerCase();
        })
      : [];
    var dueCards = subjectCards.filter(function (c) {
      return (+c.nextReview || 0) <= Date.now();
    }).length;
    var notes = subject
      ? (data.notes || []).filter(function (n) {
          return n.subjectId === subject.id;
        })
      : [];
    var resources = subject
      ? (data.links || []).filter(function (x) {
          return x.subjectId === subject.id;
        })
      : [];
    var blockerMarkup = unmet.length
      ? '<div class="los-empty">' +
        esc(T('لا يمكن بدء المهمة قبل إنهاء:', 'This task is waiting for:')) +
        '<br>' +
        unmet
          .map(function (x) {
            return '• ' + esc(x.title);
          })
          .join('<br>') +
        '</div>'
      : '';
    var layer = showOverlay(
      '<section class="kk-los-dialog" role="dialog" aria-modal="true" aria-labelledby="losBriefTitle"><span class="los-pill">' +
        esc(T('ملخص ما قبل الجلسة', 'Pre-session brief')) +
        '</span><h3 id="losBriefTitle">' +
        esc(task.title) +
        '</h3><p>' +
        esc(
          (trackInfo ? trackInfo.name : '') +
            (milestone ? ' · ' + milestone.title : '') +
            (subject ? ' · ' + subject.name : ''),
        ) +
        '</p>' +
        blockerMarkup +
        '<div class="los-sync-grid"><div class="los-sync-item"><span>' +
        esc(T('الوقت المتوقع', 'Estimated time')) +
        '</span><b>' +
        esc(
          minutesLabel(Math.max(0, (Number(task.estimateMinutes) || 15) - (Number(task.actualMinutes) || 0))),
        ) +
        '</b></div><div class="los-sync-item"><span>' +
        esc(T('الموعد', 'Deadline')) +
        '</span><b>' +
        esc(task.dueDate || T('غير محدد', 'Not set')) +
        '</b></div><div class="los-sync-item"><span>' +
        esc(T('ملاحظات مرتبطة', 'Related notes')) +
        '</span><b>' +
        notes.length +
        '</b></div><div class="los-sync-item"><span>' +
        esc(T('بطاقات مستحقة', 'Due flashcards')) +
        '</span><b>' +
        dueCards +
        '</b></div><div class="los-sync-item"><span>' +
        esc(T('مصادر محفوظة', 'Saved resources')) +
        '</span><b>' +
        resources.length +
        '</b></div><div class="los-sync-item"><span>' +
        esc(T('الوقت الفعلي حتى الآن', 'Actual time so far')) +
        '</span><b>' +
        esc(minutesLabel(task.actualMinutes || 0)) +
        '</b></div></div>' +
        (task.notes
          ? '<p style="margin-top:12px"><b>' +
            esc(T('ملاحظات المهمة', 'Task notes')) +
            ':</b><br>' +
            esc(task.notes) +
            '</p>'
          : '') +
        '<div class="kk-los-dialog__foot"><button type="button" class="los-action" data-los-close>' +
        esc(T('لاحقًا', 'Later')) +
        '</button>' +
        (unmet.length
          ? '<button type="button" class="los-action los-action--primary" data-los-show-deps="' +
            esc(taskId) +
            '">' +
            esc(T('مراجعة المتطلبات', 'Review prerequisites')) +
            '</button>'
          : '<button type="button" class="los-action los-action--primary" data-los-start-confirm="' +
            esc(taskId) +
            '">' +
            esc(T('ابدأ جلسة المهمة', 'Start task session')) +
            '</button>') +
        '</div></section>',
    );
    return layer;
  }
  function showReviewNudge(taskId, minutes) {
    pendingReview = { taskId: taskId, minutes: minutes, at: Date.now() };
    var task = findTask(taskId, getTrack());
    var old = $('kkLosToast');
    if (old) old.remove();
    var box = document.createElement('div');
    box.id = 'kkLosToast';
    box.className = 'kk-los-toast';
    box.innerHTML =
      '<span>' +
      esc(
        T('انتهت جلسة ', 'Finished session: ') +
          (task ? task.title : T('المهمة', 'task')) +
          ' · ' +
          minutesLabel(minutes),
      ) +
      '</span><button type="button" class="los-action los-action--primary" data-los-open-review>' +
      esc(T('أضف مراجعة', 'Add review')) +
      '</button>';
    document.body.appendChild(box);
    window.setTimeout(function () {
      if (box.isConnected) box.remove();
    }, 12000);
  }
  function openSessionReview() {
    if (!pendingReview) return;
    var task = findTask(pendingReview.taskId, getTrack());
    var layer = showOverlay(
      '<section class="kk-los-dialog" role="dialog" aria-modal="true" aria-labelledby="losReviewTitle"><h3 id="losReviewTitle">' +
        esc(T('مراجعة الجلسة', 'Session review')) +
        '</h3><p>' +
        esc((task ? task.title : T('مهمة', 'Task')) + ' · ' + minutesLabel(pendingReview.minutes)) +
        '</p><label>' +
        esc(T('ماذا أنجزت؟', 'What did you accomplish?')) +
        '<select id="losReviewOutcome"><option value="completed">' +
        esc(T('أنجزت الهدف', 'Completed the goal')) +
        '</option><option value="partial">' +
        esc(T('أنجزت جزءًا منه', 'Made partial progress')) +
        '</option><option value="difficult">' +
        esc(T('واجهت صعوبة', 'I got stuck')) +
        '</option></select></label><label>' +
        esc(T('ماذا تعلمت أو ما الذي عطلّك؟', 'What did you learn or what got in the way?')) +
        '<textarea id="losReviewNote" maxlength="1200" placeholder="' +
        esc(T('اكتب ملاحظة قصيرة…', 'Write a short note…')) +
        '"></textarea></label><label>' +
        esc(T('الخطوة التالية (اختياري)', 'Next step (optional)')) +
        '<input id="losReviewNext" maxlength="140" placeholder="' +
        esc(T('مثلاً: حل 5 أسئلة إضافية', 'e.g. Solve 5 more questions')) +
        '"></label><div class="kk-los-dialog__foot"><button type="button" class="los-action" data-los-close>' +
        esc(T('إغلاق', 'Close')) +
        '</button><button type="button" class="los-action los-action--primary" data-los-save-review>' +
        esc(T('حفظ المراجعة', 'Save review')) +
        '</button></div></section>',
    );
    var save = layer.querySelector('[data-los-save-review]');
    save.addEventListener('click', function () {
      var review = {
        outcome: $('losReviewOutcome').value,
        note: $('losReviewNote').value.trim(),
        nextStep: $('losReviewNext').value.trim(),
        minutes: pendingReview.minutes,
        at: pendingReview.at,
      };
      var api = core();
      if (api && api.saveTaskReview && !api.saveTaskReview(pendingReview.taskId, review)) {
        notify(T('تعذر حفظ مراجعة المهمة.', 'Could not save the task review.'));
        return;
      }
      recordEvent(
        'session_review',
        T('حفظ مراجعة جلسة', 'Session review saved'),
        (task ? task.title : '') + ' · ' + review.outcome,
        { taskId: pendingReview.taskId, outcome: review.outcome },
      );
      pendingReview = null;
      layer.remove();
      renderPage();
      notify(T('تم حفظ مراجعة الجلسة.', 'Session review saved.'));
    });
  }
  function openExportHistory() {
    var payload = {
      schemaVersion: 1,
      accountId: accountId(),
      exportedAt: new Date().toISOString(),
      events: getStore().events,
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = 'kashkool-learning-history-' + dateKey(new Date()) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1200);
  }
  function navigate(view) {
    var api = core();
    if (view === 'track' && api && api.goTo) api.goTo('track');
    else if (view === 'subjects' && api && api.goTo) api.goTo('subjects');
    else if (view === 'notes' && api && api.goTo) api.goTo('notes');
    else if (view === 'flashcards' && api && api.goTo) api.goTo('flashcards');
    else if (view === 'exams' && api && api.goTo) api.goTo('exams');
  }

  document.addEventListener(
    'click',
    function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var start = target.closest('[data-task-start]');
      if (start) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        openStudyBrief(start.dataset.taskStart);
        return;
      }
      var deps = target.closest('[data-kk-deps]');
      if (deps) {
        event.preventDefault();
        event.stopPropagation();
        openDependencies(deps.dataset.kkDeps);
        return;
      }
      var panel = target.closest('[data-los-panel]');
      if (panel) {
        selectedPanel = panel.dataset.losPanel;
        renderPage();
        return;
      }
      var budget = target.closest('[data-los-budget]');
      if (budget) {
        selectedBudget = Number(budget.dataset.losBudget) || 30;
        renderPage();
        return;
      }
      var editDeps = target.closest('[data-los-edit-deps]');
      if (editDeps) {
        openDependencies(editDeps.dataset.losEditDeps);
        return;
      }
      var saveDeps = target.closest('[data-los-save-deps]');
      if (saveDeps) {
        var layer = $('kkLosBackdrop'),
          checks = layer
            ? Array.from(layer.querySelectorAll('.los-dep-editor input[type="checkbox"]:checked')).map(
                function (x) {
                  return x.value;
                },
              )
            : [];
        var api = core(),
          ok =
            api && api.setTaskDependencies && api.setTaskDependencies(saveDeps.dataset.losSaveDeps, checks);
        if (!ok) {
          var error = $('losDepsError');
          if (error)
            error.textContent = T(
              'العلاقة غير صالحة أو ستنشئ دورة. اختَر مهامًا سابقة من المسار نفسه.',
              'The relationship is invalid or would create a cycle. Choose prerequisites from the same track.',
            );
          return;
        }
        if (layer) layer.remove();
        recordEvent(
          'dependencies_updated',
          T('تعديل متطلبات مهمة', 'Task dependencies updated'),
          findTask(saveDeps.dataset.losSaveDeps, getTrack()).title,
          { taskId: saveDeps.dataset.losSaveDeps, dependencies: checks },
        );
        renderPage();
        return;
      }
      var showDeps = target.closest('[data-los-show-deps]');
      if (showDeps) {
        var id = showDeps.dataset.losShowDeps;
        var current = $('kkLosBackdrop');
        if (current) current.remove();
        openDependencies(id);
        return;
      }
      var confirmStart = target.closest('[data-los-start-confirm]');
      if (confirmStart) {
        var taskId = confirmStart.dataset.losStartConfirm,
          layer2 = $('kkLosBackdrop');
        if (layer2) layer2.remove();
        var api2 = core();
        if (api2 && api2.startTask && api2.startTask(taskId)) {
          recordEvent(
            'task_session_started',
            T('بدء جلسة مهمة', 'Task session started'),
            (findTask(taskId, getTrack()) || {}).title || '',
            { taskId: taskId },
          );
        } else
          notify(
            T(
              'لا يمكن بدء المهمة الآن. تحقق من المتطلبات والمؤقّت الحالي.',
              'This task cannot start yet. Check prerequisites and the running timer.',
            ),
          );
        return;
      }
      var study = target.closest('[data-los-study]');
      if (study) {
        openStudyBrief(study.dataset.losStudy);
        return;
      }
      var open = target.closest('[data-los-open]');
      if (open) {
        navigate(open.dataset.losOpen);
        return;
      }
      var node = target.closest('[data-los-node]');
      if (node) {
        var bits = node.dataset.losNode.split('|');
        openNode(bits[0], bits.slice(1).join('|'));
        return;
      }
      var nodeOpen = target.closest('[data-los-node-open]');
      if (nodeOpen) {
        navigate(nodeOpen.dataset.losNodeOpen);
        return;
      }
      var subject = target.closest('[data-los-subject]');
      if (subject) {
        navigate('subjects');
        return;
      }
      var review = target.closest('[data-los-open-review]');
      if (review) {
        openSessionReview();
        return;
      }
      var saveReview = target.closest('[data-los-save-review]');
      if (saveReview) return;
      var conflict = target.closest('[data-los-conflict-resolve]');
      if (conflict) {
        var cloudResolver = window.KashKoolCloudStatus;
        if (
          !cloudResolver ||
          !cloudResolver.resolveConflict ||
          !cloudResolver.resolveConflict(
            conflict.dataset.losConflictResolve,
            conflict.dataset.losConflictChoice,
          )
        ) {
          notify(
            T(
              'لم يتم تطبيق الاختيار لأن السجل تغيّر أو لأن النسخة القديمة غير متاحة. حدّث الصفحة وافحص الحالة مرة أخرى.',
              'The choice was not applied because the record changed or the older snapshot is unavailable. Refresh and review the current state.',
            ),
          );
        } else {
          recordEvent(
            'sync_conflict_resolved',
            T('حسم تعارض مزامنة', 'Sync conflict resolved'),
            conflict.dataset.losConflictChoice,
            { conflictId: conflict.dataset.losConflictResolve, choice: conflict.dataset.losConflictChoice },
          );
          renderPage();
          notify(T('تم حسم التعارض.', 'Conflict resolved.'));
        }
        return;
      }
      var sync = target.closest('[data-los-sync-now]');
      if (sync) {
        var cloud = window.KashKoolCloudStatus;
        if (cloud && cloud.syncNow) {
          Promise.resolve(cloud.syncNow())
            .then(function () {
              renderPage();
            })
            .catch(function () {
              notify(
                T(
                  'تعذرت المزامنة. تحقق من الحساب والاتصال.',
                  'Sync failed. Check the account and connection.',
                ),
              );
            });
        } else notify(T('المزامنة السحابية غير مهيأة.', 'Cloud sync is not configured.'));
        return;
      }
      var account = target.closest('[data-los-account]');
      if (account) {
        if (window.KashkoolCloudAccounts && window.KashkoolCloudAccounts.open)
          window.KashkoolCloudAccounts.open();
        else navigate('settings');
        return;
      }
      var exportHistory = target.closest('[data-los-export-history]');
      if (exportHistory) {
        openExportHistory();
        return;
      }
      var replay = target.closest('[data-los-replay-filter]');
      if (replay) {
        replayFilter = replay.dataset.losReplayFilter;
        renderPage();
        return;
      }
      var dismiss = target.closest('[data-los-dismiss]');
      if (dismiss) {
        var box = $('kkLosToast');
        if (box) box.remove();
        return;
      }
    },
    true,
  );

  function init() {
    var api = core();
    if (api) {
      try {
        lastTrackSnapshot = taskSnapshot(api.getTrackData());
      } catch (e) {
        lastTrackSnapshot = null;
      }
      try {
        lastDataSnapshot = dataSnapshot(api.getData());
      } catch (e) {
        lastDataSnapshot = null;
      }
      try {
        var cards = api.getFlashcards ? api.getFlashcards() : getCards();
        lastCardSnapshot = Object.create(null);
        cards.forEach(function (c) {
          lastCardSnapshot[c.id] = { count: (c.reviews || []).length };
        });
      } catch (e) {
        lastCardSnapshot = Object.create(null);
      }
    }
    var nav = document.querySelector('.navMore__menu');
    if (nav && !nav.querySelector('[data-view="learning"]')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab';
      btn.setAttribute('role', 'menuitem');
      btn.tabIndex = -1;
      btn.dataset.view = 'learning';
      btn.setAttribute('aria-selected', 'false');
      btn.textContent = '✧ ' + T('Learning OS', 'Learning OS');
      var settings = nav.querySelector('[data-view="settings"]');
      if (settings) nav.insertBefore(btn, settings);
      else nav.appendChild(btn);
    }
    var view = $('view-learning');
    if (view && !view.hasAttribute('data-los-ready')) view.setAttribute('data-los-ready', 'true');
    renderPage();
  }

  window.KashKoolLearningOS = {
    onTrackSave: onTrackSave,
    onDataSaved: onDataSaved,
    onStudySession: onStudySession,
    onFlashcardsSave: onFlashcardsSave,
    onTaskSessionFinished: onTaskSessionFinished,
    render: renderPage,
    getEvents: function () {
      return clone(getStore().events);
    },
    exportEvents: openExportHistory,
  };
  window.KashKoolLearningOSRender = renderPage;
  window.addEventListener('online', function () {
    if (selectedPanel === 'sync') renderPage();
  });
  window.addEventListener('offline', function () {
    if (selectedPanel === 'sync') renderPage();
  });
  window.addEventListener('storage', function (e) {
    if (e.key === 'kashkool.active.account.v1') {
      lastTrackSnapshot = null;
      lastDataSnapshot = null;
      lastCardSnapshot = null;
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
