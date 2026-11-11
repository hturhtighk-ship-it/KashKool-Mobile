/*
 * KashKool notifications
 * ----------------------
 * Handles system alerts for timer sessions, lessons, homework and exams.
 * Preferences are stored on this device because operating-system permission is device-specific.
 */
(function () {
  'use strict';

  var ENABLED_KEY = 'kashkool.notifications.enabled.v1';
  var SEEN_KEY = 'kashkool.notifications.seen.v1';
  var CHECK_EVERY_MS = 30000;
  var LESSON_LEAD_MS = 10 * 60 * 1000;
  var LESSON_GRACE_MS = 2 * 60 * 1000;

  var $ = function (id) { return document.getElementById(id); };
  var language = function () {
    return document.documentElement.lang === 'en' ? 'en' : 'ar';
  };
  var isEnglish = function () { return language() === 'en'; };
  var say = function (ar, en) { return isEnglish() ? en : ar; };

  function accountId() {
    try {
      return localStorage.getItem('kashkool.active.account.v1') || 'default';
    } catch (e) {
      return 'default';
    }
  }

  function preferenceKey() {
    return ENABLED_KEY + '.' + accountId();
  }

  function getEnabled() {
    try { return localStorage.getItem(preferenceKey()) === '1'; }
    catch (e) { return false; }
  }

  function setEnabled(value) {
    try { localStorage.setItem(preferenceKey(), value ? '1' : '0'); }
    catch (e) {}
    syncControls();
  }

  function getSeen() {
    try {
      var value = JSON.parse(localStorage.getItem(SEEN_KEY + '.' + accountId()) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (e) {
      return [];
    }
  }

  function hasSeen(key) {
    return getSeen().indexOf(key) !== -1;
  }

  function markSeen(key) {
    try {
      var list = getSeen();
      list.push(key);
      localStorage.setItem(SEEN_KEY + '.' + accountId(), JSON.stringify(list.slice(-500)));
    } catch (e) {}
  }

  function showSystemNotification(title, body, tag) {
    if (!getEnabled()) return false;

    var payload = {
      title: String(title || 'KashKool'),
      body: String(body || ''),
      tag: String(tag || 'kashkool-notice')
    };

    // Electron keeps the app alive in the tray and shows notifications through Windows.
    if (window.kashkoolDesktop && typeof window.kashkoolDesktop.notify === 'function') {
      try {
        return Promise.resolve(window.kashkoolDesktop.notify(payload)).then(function (shown) {
          return shown !== false;
        }).catch(function () { return false; });
      } catch (e) {
        return false;
      }
    }

    if (!('Notification' in window) || Notification.permission !== 'granted') return false;
    try {
      var notification = new Notification(payload.title, {
        body: payload.body,
        tag: payload.tag,
        icon: './assets/icons/kashkool.png'
      });
      notification.onclick = function () { window.focus(); };
      return true;
    } catch (e) {
      return false;
    }
  }

  function sendOnce(key, title, body) {
    if (!getEnabled() || hasSeen(key)) return;
    var result = showSystemNotification(title, body, key);
    Promise.resolve(result).then(function (shown) {
      if (shown) markSeen(key);
    });
  }

  function getAppData() {
    try {
      var id = accountId();
      var raw = localStorage.getItem('kashkool.data.v1.' + id);
      if (!raw && id === 'default') raw = localStorage.getItem('kashkool.data.v1');
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function dateKey(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }

  function timeOnDate(date, time, fallbackHour) {
    var copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var parts = String(time || '').split(':');
    copy.setHours(parts.length > 1 ? (+parts[0] || 0) : (fallbackHour || 0),
      parts.length > 1 ? (+parts[1] || 0) : 0, 0, 0);
    return copy;
  }

  function subjectName(data, subjectId) {
    var subjects = Array.isArray(data.subjects) ? data.subjects : [];
    var subject = subjects.find(function (item) { return item && item.id === subjectId; });
    return subject && subject.name ? ' · ' + subject.name : '';
  }

  function checkLessonReminders(data, now) {
    var entries = Array.isArray(data.entries) ? data.entries : [];
    var todayIndex = (now.getDay() + 1) % 7; // KashKool stores Saturday as day 0.
    var today = dateKey(now);

    entries.forEach(function (entry) {
      if (!entry || entry.noTime || !entry.from || Number(entry.day) !== todayIndex) return;
      var start = timeOnDate(now, entry.from, 8);
      var delta = start.getTime() - now.getTime();
      if (delta > LESSON_LEAD_MS || delta < -LESSON_GRACE_MS) return;
      var key = 'lesson:' + String(entry.id || entry.title || 'item') + ':' + today;
      sendOnce(key,
        say('ميعاد درس قريب', 'Lesson coming up'),
        (entry.title || say('عندك درس في جدولك', 'A scheduled lesson')) +
          say(' بعد حوالي 10 دقايق.', ' starts in about 10 minutes.') +
          subjectName(data, entry.subjectId));
    });
  }

  function checkHomeworkReminders(data, now) {
    var homework = Array.isArray(data.homework) ? data.homework : [];
    var today = dateKey(now);
    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var tomorrowKey = dateKey(tomorrow);
    var afterEight = now.getHours() >= 8;
    var afterSix = now.getHours() >= 18;

    homework.forEach(function (item) {
      if (!item || item.done || !item.due) return;
      var title = item.title || say('واجب', 'Homework');
      if (item.due === today && afterEight) {
        sendOnce('homework:today:' + item.id + ':' + today,
          say('واجب مطلوب النهارده', 'Homework due today'),
          title + subjectName(data, item.subjectId));
      } else if (item.due === tomorrowKey && afterSix) {
        sendOnce('homework:tomorrow:' + item.id + ':' + tomorrowKey,
          say('تذكير بواجب بكرة', 'Homework due tomorrow'),
          title + subjectName(data, item.subjectId));
      }
    });
  }

  function checkExamReminders(data, now) {
    var exams = Array.isArray(data.exams) ? data.exams : [];
    exams.forEach(function (exam) {
      if (!exam || !exam.date) return;
      var targetDate = new Date(String(exam.date) + 'T00:00:00');
      if (isNaN(targetDate.getTime())) return;
      var target = timeOnDate(targetDate, exam.time, exam.time ? 0 : 9);
      var delta = target.getTime() - now.getTime();
      if (delta <= 0 || delta > 60 * 60 * 1000) return;
      var key = 'exam:hour:' + String(exam.id || exam.title || 'exam') + ':' + exam.date;
      sendOnce(key,
        say('امتحانك قرب', 'Exam coming up'),
        (exam.title || say('موعد امتحان', 'Exam')) + say(' خلال ساعة.', ' starts within an hour.'));
    });
  }

  function checkReminders() {
    if (!getEnabled()) return;
    var data = getAppData();
    if (!data) return;
    var now = new Date();
    checkLessonReminders(data, now);
    checkHomeworkReminders(data, now);
    checkExamReminders(data, now);
  }

  function timerFinished(mode) {
    var title = mode === 'work'
      ? say('انتهت جلسة المذاكرة', 'Study session finished')
      : say('انتهت الاستراحة', 'Break finished');
    var body = mode === 'work'
      ? say('أحسنت. خذ استراحتك أو ابدأ الجولة التالية.', 'Nice work. Take a break or start the next round.')
      : say('وقت الرجوع للمذاكرة لما تكون جاهز.', 'It is time to get back to studying when you are ready.');
    showSystemNotification(title, body, 'pomodoro:' + Date.now());
  }

  function setStatus(message) {
    var status = $('notificationsStatus');
    if (status) status.textContent = message;
  }

  function syncLanguage() {
    var labels = {
      settingsNotificationsSection: ['الإشعارات', 'Notifications'],
      notificationsTitle: ['إشعارات الكشكول', 'KashKool notifications'],
      notificationsDesc: [
        'استقبل تنبيهًا عند انتهاء المؤقّت، وقبل مواعيد الدروس، وعند اقتراب تسليم الواجبات.',
        'Get alerts when a timer ends, before scheduled lessons, and when homework deadlines are near.'
      ],
      notificationsToggleLabel: ['تشغيل إشعارات النظام', 'Enable system notifications'],
      testNotificationBtn: ['إرسال إشعار تجريبي', 'Send a test notification']
    };
    Object.keys(labels).forEach(function (id) {
      var element = $(id);
      if (element) element.textContent = labels[id][isEnglish() ? 1 : 0];
    });
    syncControls();
  }

  function syncControls() {
    var toggle = $('notificationsToggle');
    if (toggle) toggle.checked = getEnabled();
    if (getEnabled()) {
      setStatus(say('الإشعارات مفعّلة على هذا الجهاز.', 'Notifications are enabled on this device.'));
      return;
    }
    if (!window.kashkoolDesktop && 'Notification' in window && Notification.permission === 'denied') {
      setStatus(say(
        'المتصفح منع الإشعارات. اسمح بها من إعدادات الموقع في المتصفح.',
        'Notifications are blocked by the browser. Allow them in this site’s browser settings.'
      ));
      return;
    }
    setStatus(say('الإشعارات متوقفة حاليًا.', 'Notifications are currently off.'));
  }

  async function enableNotifications() {
    if (window.kashkoolDesktop) {
      try {
        var supported = await window.kashkoolDesktop.notificationsSupported();
        if (!supported) {
          setEnabled(false);
          setStatus(say('إشعارات النظام غير مدعومة على هذا الجهاز.', 'System notifications are not supported on this device.'));
          return;
        }
        setEnabled(true);
        showSystemNotification(say('تم تفعيل الإشعارات', 'Notifications enabled'),
          say('سيظل الكشكول يعمل في الخلفية عند تصغير النافذة إلى شريط النظام.', 'KashKool will keep running when its window is hidden to the system tray.'),
          'notifications-enabled');
        return;
      } catch (e) {
        setStatus(say('تعذّر تفعيل الإشعارات. أعد المحاولة.', 'Could not enable notifications. Please try again.'));
        return;
      }
    }

    if (!('Notification' in window)) {
      setEnabled(false);
      setStatus(say('هذا المتصفح لا يدعم إشعارات النظام.', 'This browser does not support system notifications.'));
      return;
    }
    try {
      var permission = Notification.permission;
      if (permission !== 'granted') permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setEnabled(true);
        showSystemNotification(say('تم تفعيل الإشعارات', 'Notifications enabled'),
          say('سيصلك تنبيه بالمواعيد المهمة.', 'You will receive reminders for important events.'),
          'notifications-enabled');
      } else {
        setEnabled(false);
        syncControls();
      }
    } catch (e) {
      setEnabled(false);
      setStatus(say('تعذّر طلب إذن الإشعارات.', 'Could not request notification permission.'));
    }
  }

  function bindControls() {
    var toggle = $('notificationsToggle');
    var test = $('testNotificationBtn');
    if (toggle) toggle.addEventListener('change', function () {
      if (toggle.checked) enableNotifications();
      else setEnabled(false);
    });
    if (test) test.addEventListener('click', function () {
      if (!getEnabled()) {
        enableNotifications();
        return;
      }
      showSystemNotification(say('إشعار تجريبي', 'Test notification'),
        say('كده الإشعارات شغالة تمام.', 'Your system notifications are working.'),
        'notification-test:' + Date.now());
    });
  }

  window.KashKoolNotifications = { timerFinished: timerFinished, checkNow: checkReminders };
  bindControls();
  syncLanguage();
  try {
    new MutationObserver(function (changes) {
      if (changes.some(function (change) { return change.attributeName === 'lang'; })) syncLanguage();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  } catch (e) {}

  checkReminders();
  window.setInterval(checkReminders, CHECK_EVERY_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) checkReminders(); });
  window.addEventListener('focus', checkReminders);
})();
