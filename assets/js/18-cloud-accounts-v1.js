/* ==============================================================
   JS 19/28 · Accounts & cloud sync · kashkool-cloud-accounts-v1 · 33.5 KB
   ============================================================== */
(function () {
  'use strict';
  var $ = function (id) {
    return document.getElementById(id);
  };
  var CONFIG_KEY = 'kashkool.firebase.config.v1';
  // Optional: embed the same Firebase Web config here before publishing a shared hosted copy.
  // Public Firebase Web config is not a password; protect the project with Authentication and Firestore rules.
  // Shared Web configuration for the KashKool cloud project.
  // This object is public client configuration, not a private credential.
  var EMBEDDED_FIREBASE_CONFIG = {
    apiKey: 'AIzaSyAtO4nHCQNO0uw70t2UUB6s2q8gMzEVTQU',
    authDomain: 'kashkool-cloud.firebaseapp.com',
    projectId: 'kashkool-cloud',
    storageBucket: 'kashkool-cloud.firebasestorage.app',
    messagingSenderId: '1044246708324',
    appId: '1:1044246708324:web:c656da387dd2bb32d75f71',
    measurementId: 'G-SKSQ6GZC8X',
  };
  var ACTIVE_KEY = 'kashkool.active.account.v1';
  var ACCOUNTS_KEY = 'kashkool.accounts.v1';
  var SNAP_PREFIX = 'kashkool.autosnapshots.v1.';
  var GLOBAL_SYNC_KEYS = {
    'kashkool.theme': true,
    'kashkool.lang': true,
    'kashkool-custom-theme': true,
    'kashkool.theme.motion.settings.v1': true,
    'kashkool.sound': true,
    'kashkool.sound.type': true,
    'kashkool.sound.volume': true,
  };
  var firebaseApp = null,
    auth = null,
    firestore = null,
    currentUser = null;
  var unsubscribeRecords = null,
    listeningUid = '',
    syncReady = false,
    syncApplying = false;
  var authActionInProgress = false,
    remoteReloadPending = false,
    syncTimer = null;
  var pendingWrites = new Map(),
    localVersions = Object.create(null),
    lastSyncAt = 0;
  var nativeSetItem = Storage.prototype.setItem;
  var nativeRemoveItem = Storage.prototype.removeItem;

  function ar() {
    return document.documentElement.lang !== 'en' && document.documentElement.dir !== 'ltr';
  }
  function T(a, e) {
    return ar() ? a : e;
  }
  function activeId() {
    try {
      return localStorage.getItem(ACTIVE_KEY) || 'default';
    } catch (e) {
      return 'default';
    }
  }
  function usernameFromUser(user) {
    var email = (user && user.email) || '';
    var name = email.split('@')[0] || '';
    return name.replace(/^u_/, '') || 'account';
  }
  function safeJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  }
  function setBanner(message, kind) {
    var el = $('cloudAccountBanner');
    if (!el) return;
    el.textContent = message;
    el.classList.toggle('is-ok', kind === 'ok');
    el.classList.toggle('is-error', kind === 'error');
  }
  function setAuthUi() {
    var signed = !!(currentUser && currentUser.uid);
    var login = $('cloudAuthFields'),
      panel = $('cloudSignedInPanel');
    if (login) login.hidden = signed;
    if (panel) panel.hidden = !signed;
    if (signed) {
      var name = usernameFromUser(currentUser);
      if ($('cloudSignedInName')) $('cloudSignedInName').textContent = name;
      if ($('accountName')) $('accountName').textContent = name + ' ☁';
      setBanner(
        T('الحساب متصل؛ المزامنة السحابية مفعّلة.', 'Account connected; cloud sync is enabled.'),
        'ok',
      );
    } else {
      if ($('accountName')) $('accountName').textContent = T('حسابي', 'My account');
      var config = loadConfig();
      setBanner(
        config
          ? T(
              'الإعدادات موجودة. سجّل الدخول أو أنشئ حسابًا.',
              'Cloud configuration is saved. Sign in or create an account.',
            )
          : T(
              'التطبيق يعمل محليًا الآن. أعد إعداد Firebase لتفعيل الحسابات والمزامنة بين الأجهزة.',
              'The app is currently local-only. Configure Firebase to enable accounts and cross-device sync.',
            ),
        config ? '' : 'error',
      );
    }
  }
  function syncLanguage() {
    var map = {
      accountsTitle: ['الحساب والمزامنة', 'Account & sync'],
      cloudUsernameLabel: ['اسم المستخدم', 'Username'],
      cloudPasswordLabel: ['كلمة المرور', 'Password'],
      cloudLoginBtn: ['تسجيل الدخول', 'Sign in'],
      cloudRegisterBtn: ['إنشاء حساب', 'Create account'],
      cloudSignedInLabel: ['متصل باسم', 'Signed in as'],
      cloudSyncNowBtn: ['مزامنة الآن', 'Sync now'],
      cloudLogoutBtn: ['تسجيل الخروج', 'Sign out'],
      cloudPasswordNotice: [
        'استخدم كلمة مرور قوية واحتفظ بها؛ حساب اسم المستخدم فقط لا يوفّر استعادة كلمة المرور بالبريد.',
        'Use a strong password and keep it safe. Username-only accounts cannot reset a forgotten password by email.',
      ],
      cloudConfigSummary: ['إعداد المزامنة السحابية (أول مرة فقط)', 'Set up cloud sync (one-time setup)'],
      cloudConfigIntro: [
        'يلزم ربط الكشكول بمشروع Firebase خاص بك. إعداد المشروع مرة واحدة، ثم استخدم نفس إعداداته على كل جهاز.',
        'Connect Kashkool to your own Firebase project. Set up the project once, then use the same configuration on every device.',
      ],
      firebaseConfigLabel: ['إعدادات Firebase Web App بصيغة JSON', 'Firebase Web App config (JSON)'],
      saveFirebaseConfigBtn: ['حفظ الإعدادات والاتصال', 'Save config and connect'],
      cloudRulesSummary: ['قواعد Firestore الآمنة المطلوبة', 'Required Firestore security rules'],
      copyCloudRulesBtn: ['نسخ القواعد', 'Copy rules'],
      cloudDataNotice: [
        'بيانات المذاكرة والملاحظات والبطاقات والإعدادات ستُحفظ في قاعدة البيانات السحابية لهذا المشروع. كلمة المرور لا تُحفظ في تخزين الكشكول المحلي.',
        'Study data, notes, flashcards, and settings will be stored in this project’s cloud database. Your password is not stored in Kashkool local storage.',
      ],
    };
    Object.keys(map).forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = map[id][ar() ? 0 : 1];
    });
    var intro = $('cloudSetupSteps');
    if (intro)
      intro.innerHTML = ar()
        ? '<b>خطوات تجهيز الخدمة</b><ol><li>أنشئ مشروعًا في Firebase وأضف تطبيق Web، ثم انسخ كائن الإعدادات.</li><li>من Authentication فعّل Email/Password وأضف نطاق الموقع المنشور إلى Authorized domains.</li><li>أنشئ Firestore Database، ثم ضع القواعد الموجودة بالأسفل.</li><li>استخدم HTTPS (مثل GitHub Pages)، والصق إعدادات Web نفسها على كل جهاز؛ أو ضمّنها في نسخة HTML المنشورة.</li></ol>'
        : '<b>Setup steps</b><ol><li>Create a Firebase project and add a Web app, then copy its config object.</li><li>In Authentication, enable Email/Password and add your published site domain under Authorized domains.</li><li>Create a Firestore database and paste the security rules shown below.</li><li>Use HTTPS (such as GitHub Pages) and enter the same Web config on each device, or embed it in the published HTML file.</li></ol>';
    if ($('cloudUsername'))
      $('cloudUsername').placeholder = ar() ? 'من 3 إلى 24 حرفًا أو رقمًا' : '3–24 letters or numbers';
    if ($('cloudPassword'))
      $('cloudPassword').placeholder = ar() ? '6 أحرف على الأقل' : 'At least 6 characters';
  }
  function loadConfig() {
    // The shared project settings take priority over any older device-local value.
    return EMBEDDED_FIREBASE_CONFIG || safeJson(localStorage.getItem(CONFIG_KEY) || 'null', null);
  }
  function parseConfig(text) {
    var v = String(text || '').trim();
    v = v.replace(/^\s*(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*/, '').replace(/;\s*$/, '');
    var obj = JSON.parse(v);
    if (!obj || typeof obj !== 'object' || !obj.apiKey || !obj.authDomain || !obj.projectId || !obj.appId)
      throw new Error('bad-config');
    return obj;
  }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = Array.prototype.slice.call(document.scripts).some(function (x) {
        return x.src === src;
      });
      if (existing) {
        if (window.firebase) resolve();
        else reject(new Error('sdk-already-loading'));
        return;
      }
      var sc = document.createElement('script');
      sc.src = src;
      sc.async = true;
      sc.onload = function () {
        resolve();
      };
      sc.onerror = function () {
        reject(new Error('sdk-load-failed'));
      };
      document.head.appendChild(sc);
    });
  }
  function loadFirebaseSdk() {
    var ver = '13.1.0',
      base = 'https://www.gstatic.com/firebasejs/' + ver + '/';
    return loadScript(base + 'firebase-app-compat.js')
      .then(function () {
        return loadScript(base + 'firebase-auth-compat.js');
      })
      .then(function () {
        return loadScript(base + 'firebase-firestore-compat.js');
      });
  }
  function emailForUsername(username) {
    return 'u_' + username.toLowerCase() + '@accounts.kashkool.invalid';
  }
  function normalizeUsername(value) {
    var v = String(value || '')
      .trim()
      .toLowerCase();
    if (!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(v) || v.indexOf('..') !== -1 || v.endsWith('.')) return '';
    return v;
  }
  function authError(err, action) {
    var code = (err && err.code) || '';
    var messages = {
      'auth/email-already-in-use': [
        'اسم المستخدم ده مستخدم بالفعل. جرّب اسمًا آخر أو سجّل الدخول.',
        'That username is already in use. Try another or sign in.',
      ],
      'auth/invalid-email': [
        'اسم المستخدم غير صالح. استخدم حروفًا إنجليزية وأرقامًا وشرطة سفلية أو نقطة أو شرطة.',
        'Invalid username. Use English letters, numbers, underscores, dots, or hyphens.',
      ],
      'auth/invalid-credential': [
        'اسم المستخدم أو كلمة المرور غير صحيحة.',
        'Incorrect username or password.',
      ],
      'auth/user-not-found': [
        'الحساب غير موجود. تأكد من اسم المستخدم أو أنشئ حسابًا.',
        'Account not found. Check the username or create an account.',
      ],
      'auth/wrong-password': ['كلمة المرور غير صحيحة.', 'Incorrect password.'],
      'auth/weak-password': [
        'كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل إن أمكن.',
        'Password is too weak. Use at least 8 characters if possible.',
      ],
      'auth/operation-not-allowed': [
        'فعّل Email/Password من إعدادات Authentication في Firebase.',
        'Enable Email/Password in Firebase Authentication settings.',
      ],
      'auth/network-request-failed': [
        'تعذّر الاتصال. تحقق من الإنترنت ثم أعد المحاولة.',
        'Network error. Check your connection and try again.',
      ],
      'permission-denied': [
        'رفض Firestore العملية. راجع قواعد الأمان المطلوبة داخل إعداد المزامنة.',
        'Firestore denied the request. Check the required security rules in the sync setup panel.',
      ],
      'failed-precondition': [
        'قاعدة Firestore غير جاهزة أو لم يتم إنشاء قاعدة البيانات.',
        'Firestore is not ready or the database has not been created.',
      ],
    };
    if (messages[code]) return messages[code][ar() ? 0 : 1];
    var msg = String((err && err.message) || '');
    if (/permission|insufficient permissions/i.test(msg)) return messages['permission-denied'][ar() ? 0 : 1];
    return ar()
      ? 'تعذّر إكمال العملية.' + (msg ? ' (' + msg + ')' : '')
      : 'Could not complete the operation.' + (msg ? ' (' + msg + ')' : '');
  }
  function scopedSyncKey(key, uid) {
    if (!key || typeof key !== 'string' || key.indexOf('kashkool.') !== 0) return false;
    if (key.indexOf(SNAP_PREFIX) === 0) return false;
    if (GLOBAL_SYNC_KEYS[key]) return true;
    return !!uid && key.slice(-(uid.length + 1)) === '.' + uid;
  }
  function localConflictKey(uid) {
    return 'kk.local.sync.conflicts.v1.' + String(uid || 'default');
  }
  function readLocalConflicts(uid) {
    try {
      var a = JSON.parse(localStorage.getItem(localConflictKey(uid)) || '[]');
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }
  function writeLocalConflicts(uid, list) {
    try {
      nativeSetItem.call(localStorage, localConflictKey(uid), JSON.stringify(list.slice(0, 8)));
      return true;
    } catch (e) {
      return false;
    }
  }
  function conflictHash(value) {
    if (value === null) return 'deleted';
    var s = String(value),
      h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36) + ':' + s.length;
  }
  function rememberSyncConflict(
    uid,
    key,
    winner,
    loserValue,
    loserDeleted,
    winnerValue,
    localStamp,
    remoteStamp,
  ) {
    var list = readLocalConflicts(uid),
      existing = list.filter(function (x) {
        return x.key === key && x.localStamp === localStamp && x.remoteStamp === remoteStamp;
      })[0];
    if (existing) return;
    var value = loserDeleted ? null : String(loserValue == null ? '' : loserValue),
      canSave = loserDeleted || value.length <= 200000;
    list.unshift({
      id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      key: key,
      winner: winner,
      loser: winner === 'local' ? 'remote' : 'local',
      loserDeleted: !!loserDeleted,
      loserValue: canSave && !loserDeleted ? value : null,
      snapshotSaved: canSave,
      winnerHash: conflictHash(winnerValue),
      localStamp: Number(localStamp) || 0,
      remoteStamp: Number(remoteStamp) || 0,
      detectedAt: Date.now(),
    });
    writeLocalConflicts(uid, list);
  }
  function getSyncConflictSummaries(uid) {
    return readLocalConflicts(uid).map(function (c) {
      return {
        id: c.id,
        key: c.key,
        winner: c.winner,
        loser: c.loser,
        snapshotSaved: !!c.snapshotSaved,
        detectedAt: c.detectedAt,
      };
    });
  }
  function resolveSyncConflict(uid, id, choice) {
    var list = readLocalConflicts(uid),
      index = list.findIndex(function (c) {
        return c.id === id;
      });
    if (index < 0) return false;
    var c = list[index];
    if (choice !== 'local' && choice !== 'remote') return false;
    if (choice !== c.winner) {
      if (choice !== c.loser || !c.snapshotSaved || !scopedSyncKey(c.key, uid)) return false;
      var current = null;
      try {
        current = localStorage.getItem(c.key);
      } catch (e) {}
      if (conflictHash(current) !== c.winnerHash) return false;
      try {
        if (c.loserDeleted) localStorage.removeItem(c.key);
        else localStorage.setItem(c.key, String(c.loserValue == null ? '' : c.loserValue));
      } catch (e) {
        return false;
      }
    }
    list.splice(index, 1);
    return writeLocalConflicts(uid, list);
  }
  function recordCollection(uid) {
    return firestore.collection('kashkoolUsers').doc(uid).collection('records');
  }
  function recordId(key) {
    return encodeURIComponent(key);
  }
  function readLocalPairs(uid) {
    var out = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (scopedSyncKey(key, uid)) {
          var value = localStorage.getItem(key);
          if (value !== null) out.push([key, value]);
        }
      }
    } catch (e) {}
    return out;
  }
  function setAccountLocally(uid, username) {
    var all = safeJson(localStorage.getItem(ACCOUNTS_KEY) || '[]', []);
    if (!Array.isArray(all)) all = [];
    if (
      !all.some(function (a) {
        return a && a.id === 'default';
      })
    )
      all.unshift({ id: 'default', name: 'حسابي' });
    var found = false;
    all = all.map(function (a) {
      if (a && a.id === uid) {
        found = true;
        return Object.assign({}, a, { id: uid, name: username, username: username, cloud: true });
      }
      return a;
    });
    if (!found) all.push({ id: uid, name: username, username: username, cloud: true });
    try {
      nativeSetItem.call(localStorage, ACCOUNTS_KEY, JSON.stringify(all));
      nativeSetItem.call(localStorage, ACTIVE_KEY, uid);
    } catch (e) {}
  }
  function setSignedOutLocally() {
    var all = safeJson(localStorage.getItem(ACCOUNTS_KEY) || '[]', []);
    if (!Array.isArray(all)) all = [];
    if (
      !all.some(function (a) {
        return a && a.id === 'default';
      })
    )
      all.unshift({ id: 'default', name: 'حسابي' });
    try {
      nativeSetItem.call(localStorage, ACCOUNTS_KEY, JSON.stringify(all));
      nativeSetItem.call(localStorage, ACTIVE_KEY, 'default');
    } catch (e) {}
  }
  function migrateLocalAccount(fromId, toUid) {
    if (!fromId || fromId === toUid || fromId === '') return;
    syncApplying = true;
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (
          k &&
          k.indexOf('kashkool.') === 0 &&
          k.indexOf(SNAP_PREFIX) !== 0 &&
          k.slice(-(fromId.length + 1)) === '.' + fromId
        )
          keys.push(k);
      }
      keys.forEach(function (k) {
        var next = k.slice(0, -fromId.length) + toUid;
        if (localStorage.getItem(next) === null) {
          var value = localStorage.getItem(k);
          if (value !== null) nativeSetItem.call(localStorage, next, value);
        }
      });
      // Very old versions may have stored the main dataset without an account suffix.
      if (fromId === 'default' && localStorage.getItem('kashkool.data.v1.' + toUid) === null) {
        var legacyData = localStorage.getItem('kashkool.data.v1');
        if (legacyData !== null) nativeSetItem.call(localStorage, 'kashkool.data.v1.' + toUid, legacyData);
      }
    } catch (e) {
    } finally {
      syncApplying = false;
    }
  }
  function applyRemoteRecord(rec, uid) {
    if (!rec || !scopedSyncKey(rec.key, uid)) return false;
    var key = rec.key,
      before = null;
    try {
      before = localStorage.getItem(key);
    } catch (e) {}
    var deleted = rec.deleted === true;
    var after = deleted ? null : String(rec.value == null ? '' : rec.value);
    localVersions[key] = Number(rec.updatedAt) || Date.now();
    if (before === after) return false;
    syncApplying = true;
    try {
      if (deleted) nativeRemoveItem.call(localStorage, key);
      else nativeSetItem.call(localStorage, key, after);
    } catch (e) {
    } finally {
      syncApplying = false;
    }
    return true;
  }
  function queueRecordWrite(key, value, deleted) {
    if (!currentUser || !syncReady || syncApplying || !scopedSyncKey(key, currentUser.uid)) return;
    var stamp = Date.now();
    localVersions[key] = stamp;
    pendingWrites.set(key, {
      key: key,
      value: deleted ? null : String(value == null ? '' : value),
      deleted: !!deleted,
      updatedAt: stamp,
    });
    if ($('cloudAccountBanner'))
      setBanner(
        T('تغييراتك محفوظة محليًا وجاري رفعها للسحابة…', 'Changes saved locally; uploading to the cloud…'),
        '',
      );
    clearTimeout(syncTimer);
    syncTimer = setTimeout(flushPendingWrites, 850);
  }
  var CLOUD_CHUNK_SIZE = 100000;
  function makeChunkVersion() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }
  async function cleanupOldChunks(col, key, keepVersion) {
    try {
      var old = await col.where('key', '==', key).get();
      var deletes = old.docs.filter(function (d) {
        var r = d.data() || {};
        return r.chunkedPart === true && r.chunkVersion !== keepVersion;
      });
      await Promise.all(
        deletes.map(function (d) {
          return d.ref.delete();
        }),
      );
    } catch (e) {}
  }
  async function writeCloudRecord(col, item) {
    var value = item.deleted ? null : String(item.value == null ? '' : item.value),
      stamp = Number(item.updatedAt) || Date.now();
    var manifestRef = col.doc(recordId(item.key)),
      base = {
        key: item.key,
        deleted: !!item.deleted,
        updatedAt: stamp,
        deviceId: deviceId(),
        chunked: false,
        chunkCount: 0,
        chunkVersion: '',
      };
    if (item.deleted || value.length <= CLOUD_CHUNK_SIZE) {
      base.value = value;
      await manifestRef.set(base, { merge: true });
      // Old chunk documents are ignored by a non-chunked/deleted manifest; they are cleaned on the next large write.
      return;
    }
    var version = makeChunkVersion(),
      parts = [];
    for (var i = 0; i < value.length; i += CLOUD_CHUNK_SIZE) parts.push(value.slice(i, i + CLOUD_CHUNK_SIZE));
    // Upload versioned chunks first, then atomically point the manifest at the complete set.
    await Promise.all(
      parts.map(function (part, index) {
        var id = recordId(item.key) + '__chunk__' + version + '__' + index;
        return col
          .doc(id)
          .set(
            {
              key: item.key,
              chunkedPart: true,
              chunkVersion: version,
              chunkIndex: index,
              chunkValue: part,
              updatedAt: stamp,
              deviceId: deviceId(),
            },
            { merge: true },
          );
      }),
    );
    await manifestRef.set(
      {
        key: item.key,
        value: null,
        deleted: false,
        updatedAt: stamp,
        deviceId: deviceId(),
        chunked: true,
        chunkCount: parts.length,
        chunkVersion: version,
      },
      { merge: true },
    );
    await cleanupOldChunks(col, item.key, version);
  }
  async function flushPendingWrites() {
    if (!currentUser || !firestore || !syncReady || !pendingWrites.size) return;
    var uid = currentUser.uid,
      batch = Array.from(pendingWrites.values());
    pendingWrites.clear();
    try {
      await Promise.all(
        batch.map(function (item) {
          return writeCloudRecord(recordCollection(uid), item);
        }),
      );
      lastSyncAt = Date.now();
      setBanner(
        T(
          'المزامنة تعمل بنجاح · آخر حفظ ' + new Date(lastSyncAt).toLocaleTimeString('ar-EG'),
          'Sync is working · last save ' + new Date(lastSyncAt).toLocaleTimeString(),
        ),
        'ok',
      );
    } catch (err) {
      batch.forEach(function (item) {
        pendingWrites.set(item.key, item);
      });
      setBanner(authError(err, 'رفع البيانات'), 'error');
    }
  }
  function unpackCloudSnapshot(snapshot, uid) {
    var manifests = Object.create(null),
      chunks = Object.create(null),
      manifestKeys = Object.create(null);
    snapshot.forEach(function (doc) {
      var r = doc.data();
      if (!r || !scopedSyncKey(r.key, uid)) return;
      if (r.chunkedPart === true) {
        var ck = r.key + '\u0000' + String(r.chunkVersion || '');
        if (!chunks[ck]) chunks[ck] = Object.create(null);
        chunks[ck][Number(r.chunkIndex)] = String(r.chunkValue || '');
      } else {
        manifests[r.key] = r;
        manifestKeys[r.key] = true;
      }
    });
    var records = [],
      incomplete = [];
    Object.keys(manifests).forEach(function (key) {
      var r = manifests[key];
      if (r.chunked === true && r.deleted !== true) {
        var set = chunks[key + '\u0000' + String(r.chunkVersion || '')] || [],
          parts = [],
          ok = Number(r.chunkCount) > 0;
        for (var i = 0; i < Number(r.chunkCount); i++) {
          if (typeof set[i] !== 'string') {
            ok = false;
            break;
          }
          parts.push(set[i]);
        }
        if (!ok) {
          incomplete.push(key);
          return;
        }
        r = Object.assign({}, r, { value: parts.join(''), chunked: false });
      }
      records.push(r);
    });
    return { records: records, manifestKeys: manifestKeys, incompleteKeys: incomplete };
  }
  function deviceId() {
    var key = 'kashkool.sync.device.v1',
      id = '';
    try {
      id = localStorage.getItem(key) || '';
      if (!id) {
        id = 'd-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
        nativeSetItem.call(localStorage, key, id);
      }
    } catch (e) {
      id = 'device';
    }
    return id;
  }
  function installStorageHooks() {
    try {
      Storage.prototype.setItem = function (key, value) {
        nativeSetItem.call(this, key, value);
        if (
          this === window.localStorage &&
          !syncApplying &&
          currentUser &&
          typeof key === 'string' &&
          scopedSyncKey(key, currentUser.uid)
        )
          queueRecordWrite(key, String(value), false);
      };
      Storage.prototype.removeItem = function (key) {
        nativeRemoveItem.call(this, key);
        if (
          this === window.localStorage &&
          !syncApplying &&
          currentUser &&
          typeof key === 'string' &&
          scopedSyncKey(key, currentUser.uid)
        )
          queueRecordWrite(key, null, true);
      };
    } catch (e) {}
  }
  function reloadWhenSafe() {
    if (!remoteReloadPending) return;
    var active = document.activeElement;
    var editing = !!(
      document.querySelector('dialog[open]') ||
      (active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable))
    );
    if (editing) {
      setBanner(
        T(
          'وصل تحديث من جهاز آخر. سيُطبّق بعد إنهاء التعديل أو تحديث الصفحة.',
          'An update arrived from another device. It will apply after editing finishes or the page is refreshed.',
        ),
        '',
      );
      return;
    }
    remoteReloadPending = false;
    setTimeout(function () {
      location.reload();
    }, 180);
  }
  function requestRemoteReload() {
    remoteReloadPending = true;
    if (document.querySelector('dialog[open]')) {
      setBanner(
        T(
          'وصل تحديث من جهاز آخر. اقفل النوافذ المفتوحة لحفظه وعرضه.',
          'An update arrived from another device. Close open dialogs to apply it.',
        ),
        '',
      );
      return;
    }
    reloadWhenSafe();
  }
  async function bootstrapCloud(uid) {
    if (!firestore) throw new Error('Cloud database is not initialized.');
    var col = recordCollection(uid),
      snap = await col.get(),
      parsed = unpackCloudSnapshot(snap, uid),
      changed = false;
    parsed.records.forEach(function (rec) {
      var localValue = null;
      try {
        localValue = localStorage.getItem(rec.key);
      } catch (e) {}
      var remoteValue = rec.deleted === true ? null : String(rec.value == null ? '' : rec.value),
        remoteStamp = Number(rec.updatedAt) || 0;
      if (localValue !== null && localValue !== remoteValue && remoteStamp > 0) {
        rememberSyncConflict(uid, rec.key, 'remote', localValue, false, remoteValue, 0, remoteStamp);
      }
      if (applyRemoteRecord(rec, uid)) changed = true;
    });
    var locals = readLocalPairs(uid),
      missing = [];
    locals.forEach(function (pair) {
      if (!parsed.manifestKeys[pair[0]]) missing.push(pair);
    });
    // Missing local-only keys are uploaded; data already in the cloud wins on matching keys.
    if (missing.length) {
      await Promise.all(
        missing.map(function (pair) {
          var stamp = Date.now();
          localVersions[pair[0]] = stamp;
          return writeCloudRecord(col, { key: pair[0], value: pair[1], deleted: false, updatedAt: stamp });
        }),
      );
    }
    // If a previous large upload was interrupted, repair it from this device's intact local copy.
    for (var j = 0; j < parsed.incompleteKeys.length; j++) {
      var key = parsed.incompleteKeys[j],
        localValue = null;
      try {
        localValue = localStorage.getItem(key);
      } catch (e) {}
      if (localValue !== null) {
        var repairStamp = Date.now();
        localVersions[key] = repairStamp;
        await writeCloudRecord(col, { key: key, value: localValue, deleted: false, updatedAt: repairStamp });
      } else
        setBanner(
          T(
            'تعذّر تجميع جزء من بيانات سحابية كبيرة. احتفظ بنسخة احتياطية وافتح جهازًا يحتوي على نسخة كاملة.',
            'A large cloud data item is incomplete. Keep a backup and open a device that still has a complete local copy.',
          ),
          'error',
        );
    }
    return changed;
  }
  function listenForCloudChanges(uid) {
    if (unsubscribeRecords && listeningUid === uid) {
      syncReady = true;
      return;
    }
    if (unsubscribeRecords) {
      try {
        unsubscribeRecords();
      } catch (e) {}
      unsubscribeRecords = null;
    }
    listeningUid = uid;
    syncReady = true;
    unsubscribeRecords = recordCollection(uid).onSnapshot(
      function (snapshot) {
        var parsed = unpackCloudSnapshot(snapshot, uid),
          changed = false;
        parsed.records.forEach(function (rec) {
          var localStamp = localVersions[rec.key] || 0,
            remoteStamp = Number(rec.updatedAt) || 0,
            localValue = null;
          try {
            localValue = localStorage.getItem(rec.key);
          } catch (e) {}
          var remoteValue = rec.deleted === true ? null : String(rec.value == null ? '' : rec.value);
          if (localStamp > 0 && remoteStamp > 0 && localValue !== remoteValue) {
            if (localStamp > remoteStamp)
              rememberSyncConflict(
                uid,
                rec.key,
                'local',
                remoteValue,
                remoteValue === null,
                localValue,
                localStamp,
                remoteStamp,
              );
            else
              rememberSyncConflict(
                uid,
                rec.key,
                'remote',
                localValue,
                localValue === null,
                remoteValue,
                localStamp,
                remoteStamp,
              );
          }
          if (localStamp > remoteStamp) {
            if (localValue !== null) queueRecordWrite(rec.key, localValue, false);
            else queueRecordWrite(rec.key, null, true);
            return;
          }
          if (applyRemoteRecord(rec, uid)) changed = true;
        });
        if (changed) requestRemoteReload();
      },
      function (err) {
        setBanner(authError(err, 'مزامنة البيانات'), 'error');
      },
    );
  }
  async function connectUser(user, options) {
    options = options || {};
    if (!user || !user.uid) return false;
    var uid = user.uid,
      oldId = activeId(),
      name = options.username || usernameFromUser(user);
    currentUser = user;
    syncReady = false;
    if (options.migrateFrom && options.migrateFrom !== uid) migrateLocalAccount(options.migrateFrom, uid);
    setAccountLocally(uid, name);
    setAuthUi();
    var changed = await bootstrapCloud(uid);
    listenForCloudChanges(uid);
    setAuthUi();
    return { accountChanged: oldId !== uid, dataChanged: changed };
  }
  function localAccountChanged() {
    if (!currentUser) return;
    var uid = currentUser.uid;
    if (activeId() !== uid) {
      setAccountLocally(uid, usernameFromUser(currentUser));
      location.reload();
      return;
    }
  }
  function initFirebase(config) {
    return loadFirebaseSdk().then(function () {
      if (!window.firebase || !firebase.auth || !firebase.firestore)
        throw new Error('Firebase SDK failed to initialize.');
      if (firebase.apps && firebase.apps.length) {
        firebaseApp = firebase.app();
        if (firebaseApp.options.projectId !== config.projectId)
          throw new Error(
            'A different Firebase project is already initialized. Reload the page after changing project settings.',
          );
      } else firebaseApp = firebase.initializeApp(config);
      auth = firebaseApp.auth();
      firestore = firebaseApp.firestore();
      return auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
        auth.onAuthStateChanged(async function (user) {
          if (authActionInProgress) return;
          if (!user) {
            currentUser = null;
            syncReady = false;
            if (unsubscribeRecords) {
              try {
                unsubscribeRecords();
              } catch (e) {}
              unsubscribeRecords = null;
            }
            listeningUid = '';
            setAuthUi();
            return;
          }
          if (currentUser && currentUser.uid === user.uid && syncReady) {
            setAuthUi();
            return;
          }
          try {
            var result = await connectUser(user, {});
            if (result.accountChanged || result.dataChanged) {
              location.reload();
              return;
            }
          } catch (err) {
            setBanner(authError(err, 'تحميل بيانات الحساب'), 'error');
          }
        });
      });
    });
  }
  async function ensureInitialized() {
    var config = loadConfig();
    if (!config) {
      setAuthUi();
      return false;
    }
    setBanner(T('جاري الاتصال بخدمة الحسابات…', 'Connecting to account services…'), '');
    try {
      await initFirebase(config);
      return true;
    } catch (err) {
      setBanner(authError(err, 'الاتصال بخدمة الحسابات'), 'error');
      return false;
    }
  }
  function migrateOldLocalAccountBeforeSignup() {
    // The currently open local account is transferred only on account creation, never on an ordinary sign-in.
    return activeId();
  }
  async function register() {
    if (!auth) {
      setBanner(
        T(
          'أكمل إعداد Firebase أولًا من القسم الموجود بالأسفل.',
          'Configure Firebase first using the setup section below.',
        ),
        'error',
      );
      return;
    }
    var username = normalizeUsername($('cloudUsername').value),
      password = String($('cloudPassword').value || '');
    if (!username) {
      setBanner(
        T(
          'اسم المستخدم يجب أن يكون من 3 إلى 24 حرفًا إنجليزيًا أو رقمًا، ويمكن استخدام . _ -',
          'Username must be 3–24 characters using English letters, numbers, . _ or -.',
        ),
        'error',
      );
      return;
    }
    if (password.length < 6) {
      setBanner(
        T(
          'كلمة المرور يجب أن تكون 6 أحرف على الأقل. استخدم 8 أحرف أو أكثر إن أمكن.',
          'Password must be at least 6 characters. Use 8 or more if possible.',
        ),
        'error',
      );
      return;
    }
    var fromId = migrateOldLocalAccountBeforeSignup();
    authActionInProgress = true;
    var b = $('cloudRegisterBtn');
    if (b) b.disabled = true;
    try {
      var cred = await auth.createUserWithEmailAndPassword(emailForUsername(username), password);
      $('cloudPassword').value = '';
      var result = await connectUser(cred.user, { username: username, migrateFrom: fromId });
      authActionInProgress = false;
      setBanner(
        T(
          'تم إنشاء الحساب ونقل بيانات هذا الجهاز. جاري فتح الكشكول بالمزامنة الجديدة…',
          'Account created and this device’s data transferred. Opening Kashkool with sync…',
        ),
        'ok',
      );
      location.reload();
    } catch (err) {
      authActionInProgress = false;
      setBanner(authError(err, 'إنشاء الحساب'), 'error');
    } finally {
      if (b) b.disabled = false;
    }
  }
  async function login() {
    if (!auth) {
      setBanner(
        T(
          'أكمل إعداد Firebase أولًا من القسم الموجود بالأسفل.',
          'Configure Firebase first using the setup section below.',
        ),
        'error',
      );
      return;
    }
    var username = normalizeUsername($('cloudUsername').value),
      password = String($('cloudPassword').value || '');
    if (!username || !password) {
      setBanner(
        T('اكتب اسم المستخدم وكلمة المرور أولًا.', 'Enter your username and password first.'),
        'error',
      );
      return;
    }
    authActionInProgress = true;
    var b = $('cloudLoginBtn');
    if (b) b.disabled = true;
    try {
      var cred = await auth.signInWithEmailAndPassword(emailForUsername(username), password);
      $('cloudPassword').value = '';
      await connectUser(cred.user, { username: username });
      authActionInProgress = false;
      setBanner(T('تم تسجيل الدخول ومزامنة بيانات الحساب.', 'Signed in and synced this account.'), 'ok');
      location.reload();
    } catch (err) {
      authActionInProgress = false;
      setBanner(authError(err, 'تسجيل الدخول'), 'error');
    } finally {
      if (b) b.disabled = false;
    }
  }
  async function logout() {
    if (!auth) return;
    if (
      !confirm(
        T(
          'تسجيل الخروج من هذا الجهاز؟ ستظل بياناتك محفوظة محليًا وفي السحابة.',
          'Sign out on this device? Your data will remain stored locally and in the cloud.',
        ),
      )
    )
      return;
    authActionInProgress = true;
    try {
      await flushPendingWrites();
      if (unsubscribeRecords) {
        try {
          unsubscribeRecords();
        } catch (e) {}
        unsubscribeRecords = null;
      }
      unsubscribeRecords = null;
      listeningUid = '';
      syncReady = false;
      currentUser = null;
      await auth.signOut();
      setSignedOutLocally();
      authActionInProgress = false;
      location.reload();
    } catch (err) {
      authActionInProgress = false;
      setBanner(authError(err, 'تسجيل الخروج'), 'error');
    }
  }
  async function syncNow() {
    if (!currentUser) return;
    var b = $('cloudSyncNowBtn');
    if (b) b.disabled = true;
    try {
      await flushPendingWrites();
      var uid = currentUser.uid,
        col = recordCollection(uid),
        snap = await col.get(),
        exists = Object.create(null);
      snap.forEach(function (d) {
        var r = d.data();
        if (r && r.key) exists[r.key] = true;
      });
      var local = readLocalPairs(uid).filter(function (pair) {
        return !exists[pair[0]];
      });
      if (local.length)
        await Promise.all(
          local.map(function (pair) {
            var stamp = Date.now();
            return writeCloudRecord(col, { key: pair[0], value: pair[1], deleted: false, updatedAt: stamp });
          }),
        );
      lastSyncAt = Date.now();
      setBanner(
        T('اكتملت المزامنة. بيانات هذا الحساب محدثة.', 'Sync complete. This account’s data is up to date.'),
        'ok',
      );
    } catch (err) {
      setBanner(authError(err, 'مزامنة البيانات'), 'error');
    } finally {
      if (b) b.disabled = false;
    }
  }
  function saveConfig() {
    var obj;
    try {
      obj = parseConfig($('firebaseConfigInput').value);
    } catch (err) {
      setBanner(
        T(
          'إعدادات JSON غير صحيحة. الصق كائن إعدادات Web كما هو من Firebase.',
          'Invalid JSON config. Paste the Web config object from Firebase.',
        ),
        'error',
      );
      return;
    }
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(obj));
      setBanner(
        T(
          'تم حفظ إعدادات Firebase. سيتم إعادة فتح الصفحة للاتصال.',
          'Firebase config saved. The page will reload to connect.',
        ),
        'ok',
      );
      location.reload();
    } catch (err) {
      setBanner(
        T('تعذّر حفظ الإعدادات على هذا الجهاز.', 'Could not save the config on this device.'),
        'error',
      );
    }
  }
  async function copyRules() {
    var text = $('cloudRulesText') ? $('cloudRulesText').textContent : '';
    try {
      await navigator.clipboard.writeText(text);
      setBanner(T('تم نسخ قواعد Firestore.', 'Firestore rules copied.'), 'ok');
    } catch (e) {
      setBanner(
        T(
          'تعذّر النسخ التلقائي؛ حدّد النص داخل المربع وانسخه يدويًا.',
          'Could not auto-copy. Select the rules text and copy it manually.',
        ),
        'error',
      );
    }
  }
  function open() {
    syncLanguage();
    var cfg = loadConfig();
    if (cfg && $('firebaseConfigInput') && !$('firebaseConfigInput').value)
      $('firebaseConfigInput').value = JSON.stringify(cfg, null, 2);
    setAuthUi();
    var d = $('dlgAccounts');
    if (d && !d.open) d.showModal();
  }

  installStorageHooks();
  window.KashkoolCloudAccounts = { open: open, syncNow: syncNow };
  window.KashKoolCloudStatus = {
    getStatus: function () {
      return {
        configured: !!loadConfig(),
        signedIn: !!currentUser,
        username: currentUser ? usernameFromUser(currentUser) : '',
        syncReady: !!syncReady,
        connected: !!(firestore && currentUser && syncReady),
        pendingWrites: pendingWrites.size,
        lastSyncAt: lastSyncAt,
        conflicts: currentUser ? getSyncConflictSummaries(currentUser.uid) : [],
      };
    },
    syncNow: syncNow,
    resolveConflict: function (id, choice) {
      return currentUser ? resolveSyncConflict(currentUser.uid, String(id || ''), choice) : false;
    },
  };
  if ($('cloudLoginBtn')) $('cloudLoginBtn').addEventListener('click', login);
  if ($('cloudRegisterBtn')) $('cloudRegisterBtn').addEventListener('click', register);
  if ($('cloudLogoutBtn')) $('cloudLogoutBtn').addEventListener('click', logout);
  if ($('cloudSyncNowBtn')) $('cloudSyncNowBtn').addEventListener('click', syncNow);
  if ($('saveFirebaseConfigBtn')) $('saveFirebaseConfigBtn').addEventListener('click', saveConfig);
  if ($('copyCloudRulesBtn')) $('copyCloudRulesBtn').addEventListener('click', copyRules);
  if ($('cloudPassword'))
    $('cloudPassword').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') login();
    });
  if ($('cloudUsername'))
    $('cloudUsername').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') login();
    });
  document.addEventListener('focusout', function () {
    setTimeout(reloadWhenSafe, 50);
  });
  document.addEventListener(
    'close',
    function () {
      setTimeout(reloadWhenSafe, 50);
    },
    true,
  );
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) reloadWhenSafe();
  });
  try {
    new MutationObserver(function (records) {
      if (
        records.some(function (r) {
          return r.attributeName === 'lang' || r.attributeName === 'dir';
        })
      )
        syncLanguage();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  } catch (e) {}
  syncLanguage();
  var savedConfig = loadConfig();
  if ($('firebaseConfigInput') && savedConfig)
    $('firebaseConfigInput').value = JSON.stringify(savedConfig, null, 2);
  ensureInitialized().catch(function (err) {
    setBanner(authError(err, 'تشغيل المزامنة'), 'error');
  });
})();
