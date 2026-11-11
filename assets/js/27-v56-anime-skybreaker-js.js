/* ==============================================================
   JS 28/28 · Themes & store · kashkool-v56-anime-skybreaker-js · 12.8 KB
   ============================================================== */
(function () {
  'use strict';
  var root = document.documentElement,
    main = document.getElementById('kashkool-main') || document.querySelector('main') || document.body;
  var layer = null,
    finishTimer = 0,
    coverTimer = 0,
    serial = 0,
    pending = false,
    replaying = false,
    skipObserver = false;
  function account() {
    try {
      return localStorage.getItem('kashkool.active.account.v1') || 'default';
    } catch (e) {
      return 'default';
    }
  }
  function unlockKey() {
    return 'kashkool.secret.anime-theme.unlocked.v1.' + account();
  }
  function isUnlocked() {
    try {
      return localStorage.getItem(unlockKey()) === '1';
    } catch (e) {
      return false;
    }
  }
  try {
    Object.defineProperty(window, 'KK_ANIME_UNLOCKED', { configurable: true, get: isUnlocked });
  } catch (e) {
    window.KK_ANIME_UNLOCKED = isUnlocked();
  }
  function saveUnlock() {
    try {
      localStorage.setItem(unlockKey(), '1');
    } catch (e) {}
    try {
      var k = 'kashkool.store.v1.' + account(),
        data = JSON.parse(localStorage.getItem(k) || '{}');
      if (!Array.isArray(data.owned)) data.owned = ['classic'];
      if (data.owned.indexOf('anime') < 0) data.owned.push('anime');
      if (data.owned.indexOf('classic') < 0) data.owned.unshift('classic');
      if (!Number.isFinite(+data.spentMinutes)) data.spentMinutes = 0;
      if (!data.active) data.active = 'classic';
      localStorage.setItem(k, JSON.stringify(data));
    } catch (e) {}
    if (typeof window.KK_REFRESH_THEME_STORE === 'function') {
      try {
        window.KK_REFRESH_THEME_STORE();
      } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent('kk-anime-theme-unlocked'));
  }
  window.KK_UNLOCK_ANIME_THEME = saveUnlock;
  /* Older saves may already have completed the Galaxy discovery. Grant the new reward fairly. */
  try {
    var secret = JSON.parse(localStorage.getItem('kashkool.theme.secrets.v1.' + account()) || 'null');
    if (secret && Array.isArray(secret.completed) && secret.completed.indexOf('galaxy') !== -1) saveUnlock();
  } catch (e) {}
  /* Refresh after all original application scripts have finished their first render. */
  window.setTimeout(function () {
    if (isUnlocked() && typeof window.KK_REFRESH_THEME_STORE === 'function') window.KK_REFRESH_THEME_STORE();
  }, 0);

  function isAnime() {
    return root.getAttribute('data-store-theme') === 'anime';
  }
  function reduced() {
    var desktopThemeMotion = root.getAttribute('data-kk-desktop-theme-motion') === 'full';
    return !desktopThemeMotion && (
      !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      document.body.classList.contains('reduce-motion') ||
      document.body.classList.contains('motion-ultra')
    );
  }
  /* ===== v60 SKYBREAKER ENGINE — 60 logical frames / second, three rotating manga cuts ===== */
  var FPS = 60,
    NF = 60,
    COVER = 23,
    OUT0 = 34,
    CIN = [0, 0.008, 0.02, 0.038, 0.065, 0.105, 0.16, 0.23, 0.32, 0.43, 0.55, 0.68, 0.79, 0.88, 0.94, 0.975, 0.992, 1, 1, 1, 1, 1, 1],
    COUT = [0, 0.01, 0.03, 0.06, 0.10, 0.16, 0.23, 0.32, 0.43, 0.54, 0.65, 0.75, 0.83, 0.89, 0.94, 0.975, 0.993, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  var cv = null,
    cx = null,
    W = 0,
    H = 0,
    tone = null,
    vi = -1,
    flip = -1,
    raf = 0,
    lastPaint = -Infinity,
    glyph = '\u65AC',
    GL = ['\u65AC', '\u9583', '\u7834', '\u5203', '\u7A81'];
  function rnd(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function ensureLayer() {
    if (cv) return cv;
    cv = document.createElement('canvas');
    cv.className = 'kk-fx60';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    cx = cv.getContext('2d');
    var p = document.createElement('canvas');
    p.width = p.height = 9;
    var g = p.getContext('2d');
    g.fillStyle = '#E85A70';
    g.beginPath();
    g.arc(4.5, 4.5, 2, 0, 7);
    g.fill();
    tone = cx.createPattern(p, 'repeat');
    return cv;
  }
  function fit() {
    var d = Math.min(window.devicePixelRatio || 1, innerWidth < 680 ? 1.15 : 1.5);
    W = Math.max(1, innerWidth);
    H = Math.max(1, innerHeight);
    cv.width = Math.max(1, Math.round(W * d));
    cv.height = Math.max(1, Math.round(H * d));
    cx.setTransform(d, 0, 0, d, 0, 0);
  }
  function ink(x, y, w, h) {
    cx.fillStyle = '#0A0D16';
    cx.fillRect(x, y, w, h);
    cx.globalAlpha = 0.16;
    cx.fillStyle = tone;
    cx.fillRect(x, y, w, h);
    cx.globalAlpha = 1;
  }
  function edge(y, h, col, blur) {
    cx.shadowColor = '#72D9F6';
    cx.shadowBlur = blur;
    cx.fillStyle = col;
    cx.fillRect(-9999, y, 19998, h);
    cx.shadowBlur = 0;
  }
  function half(s, gx, gy, r, L) {
    cx.save();
    cx.translate(s * gx, s * gy);
    cx.rotate(-r);
    ink(-L, s < 0 ? -L : 0, 2 * L, L);
    cx.shadowColor = '#72D9F6';
    cx.shadowBlur = 18;
    cx.fillStyle = '#F6F8FF';
    cx.fillRect(-L, s < 0 ? -5 : 0, 2 * L, 5);
    cx.shadowBlur = 0;
    cx.fillStyle = '#E85A70';
    cx.fillRect(-L, s < 0 ? -12 : 6, 2 * L, 6);
    cx.restore();
  }
  function radial(f, col, r0) {
    var R = Math.hypot(W, H) / 2;
    cx.strokeStyle = col;
    for (var i = 0; i < 46; i++) {
      var a = rnd(f * 71 + i) * 6.2832,
        l0 = r0 * (0.7 + rnd(f * 3 + i) * 0.7),
        l1 = l0 + R * (0.25 + rnd(f * 5 + i) * 0.75),
        co = Math.cos(a),
        si = Math.sin(a);
      cx.lineWidth = 1 + rnd(i + f * 9) * 2.6;
      cx.beginPath();
      cx.moveTo(W / 2 + co * l0, H / 2 + si * l0);
      cx.lineTo(W / 2 + co * l1, H / 2 + si * l1);
      cx.stroke();
    }
  }
  /* CUT 1 — Blade: a white blade streaks across, the frame is split along the cut line, halves slide in, then peel apart */
  function vSlash(f, c, o) {
    var L = Math.hypot(W, H),
      gx = (1 - c) * L * 1.1,
      gy = o * H * 0.8,
      r = o * 0.07 * flip,
      i;
    cx.save();
    cx.translate(W / 2, H / 2);
    cx.rotate(-0.52 * flip);
    half(-1, gx, gy, r, L);
    half(1, gx, gy, r, L);
    if (f > 0 && f < 5) {
      var hx = -L + ((FF - 0.3) / 3.7) * 2 * L,
        g = cx.createLinearGradient(hx - L * 0.9, 0, hx, 0);
      g.addColorStop(0, 'rgba(114,217,246,0)');
      g.addColorStop(0.75, 'rgba(246,248,255,.9)');
      g.addColorStop(1, '#fff');
      cx.fillStyle = g;
      cx.fillRect(hx - L * 0.9, -3, L * 0.9, 6);
      cx.globalAlpha = 0.3;
      cx.fillStyle = '#72D9F6';
      cx.fillRect(hx - L * 0.5, -12, L * 0.5, 24);
      cx.globalAlpha = 1;
    }
    if (f >= 5 && f <= 12) {
      for (i = 0; i < 22; i++) {
        var k = f * 131 + i * 17,
          d = (f - 4) * (26 + rnd(k + 1) * 46),
          s = rnd(k + 2) < 0.5 ? -1 : 1,
          x = (rnd(k) - 0.5) * L * 0.9,
          l = 14 + rnd(k + 3) * 56;
        cx.strokeStyle = rnd(k + 4) < 0.5 ? '#F6F8FF' : '#72D9F6';
        cx.lineWidth = 1 + rnd(k + 5) * 2;
        cx.beginPath();
        cx.moveTo(x, s * d);
        cx.lineTo(x + l * 0.5, s * (d + l));
        cx.stroke();
      }
    }
    if (o > 0) {
      cx.strokeStyle = 'rgba(246,248,255,.75)';
      for (i = 0; i < 26; i++) {
        var q = f * 57 + i * 7,
          y = (rnd(q) - 0.5) * H * 1.4,
          x0 = (rnd(q + 1) - 0.5) * L,
          ln = L * (0.18 + rnd(q + 2) * 0.5);
        cx.lineWidth = 1 + rnd(q + 3) * 2;
        cx.beginPath();
        cx.moveTo(x0, y);
        cx.lineTo(x0 + ln, y);
        cx.stroke();
      }
    }
    cx.restore();
  }
  /* CUT 2 — X-Cross: two diagonal slashes, the frame shatters into four shards that slam in and fly out */
  function vCross(f, c, o) {
    var mx = W / 2,
      my = H / 2,
      P = [
        [0, 0],
        [W, 0],
        [W, H],
        [0, H],
      ],
      D = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ],
      t = (1 - c) * 1.05 + o * 1.05;
    for (var i = 0; i < 4; i++) {
      var a = P[i],
        b = P[(i + 1) % 4],
        dist = (D[i][0] ? W : H) * t;
      cx.save();
      cx.translate(D[i][0] * dist, D[i][1] * dist);
      cx.translate(mx, my);
      cx.rotate(o * (i % 2 ? 0.12 : -0.12) * flip);
      cx.translate(-mx, -my);
      cx.beginPath();
      cx.moveTo(mx, my);
      cx.lineTo(a[0], a[1]);
      cx.lineTo(b[0], b[1]);
      cx.closePath();
      cx.save();
      cx.clip();
      ink(0, 0, W, H);
      cx.restore();
      cx.strokeStyle = '#F6F8FF';
      cx.lineWidth = 4;
      cx.shadowColor = '#E85A70';
      cx.shadowBlur = 16;
      cx.stroke();
      cx.shadowBlur = 0;
      cx.restore();
    }
    if (f > 0 && f < 6) {
      [
        [0, 0, W, H],
        [W, 0, 0, H],
      ].forEach(function (d, j) {
        var p = Math.min(1, (f - j * 0.8) / 2.2);
        if (p <= 0) return;
        cx.strokeStyle = '#fff';
        cx.lineWidth = 7;
        cx.shadowColor = '#72D9F6';
        cx.shadowBlur = 18;
        cx.beginPath();
        cx.moveTo(d[0], d[1]);
        cx.lineTo(d[0] + (d[2] - d[0]) * p, d[1] + (d[3] - d[1]) * p);
        cx.stroke();
        cx.shadowBlur = 0;
      });
    }
  }
  /* CUT 3 — Burst: ragged ink iris closes on the centre with "boiling" speed lines, then blows open */
  function vBurst(f, c, o) {
    var R = (Math.hypot(W, H) / 2) * 1.25;
    function blob(r, k, keep) {
      if (!keep) cx.beginPath();
      for (var i = 0; i <= 40; i++) {
        var a = (i / 40) * 6.2832,
          rr = r * (i % 2 ? 0.9 : 1) * (0.96 + rnd(k + i) * 0.08),
          x = W / 2 + Math.cos(a) * rr,
          y = H / 2 + Math.sin(a) * rr;
        if (i) cx.lineTo(x, y);
        else cx.moveTo(x, y);
      }
      cx.closePath();
    }
    cx.strokeStyle = '#F6F8FF';
    cx.lineWidth = 5;
    if (o <= 0) {
      blob(R * c, f * 53);
      cx.save();
      cx.clip();
      ink(0, 0, W, H);
      cx.restore();
      blob(R * c, f * 53);
      cx.stroke();
    } else {
      cx.beginPath();
      cx.rect(0, 0, W, H);
      blob(R * o, f * 53, true);
      cx.save();
      cx.clip('evenodd');
      ink(0, 0, W, H);
      cx.restore();
      blob(R * o, f * 53);
      cx.stroke();
    }
    if (f > 0 && f < 11) radial(f, '#F6F8FF', Math.min(W, H) * 0.14);
  }
  /* Impact frame — one-frame negative flash (white sheet, black slash band + black speed lines), the classic anime hit */
  function impact(f) {
    cx.fillStyle = '#F4F7FF';
    cx.fillRect(0, 0, W, H);
    cx.save();
    cx.translate(W / 2, H / 2);
    cx.rotate(-0.5 * flip);
    var L = Math.hypot(W, H);
    cx.fillStyle = '#000';
    cx.beginPath();
    cx.moveTo(-L, -8);
    cx.lineTo(0, -36);
    cx.lineTo(L, -4);
    cx.lineTo(L, 10);
    cx.lineTo(0, 34);
    cx.lineTo(-L, 6);
    cx.fill();
    cx.restore();
    radial(f, '#000', Math.min(W, H) * 0.1);
  }
  function kanji(f) {
    var s = Math.min(W, H) * (0.34 + (f < 5 ? (5 - f) * 0.12 : 0) + (f - 3) * 0.01);
    cx.save();
    cx.translate(W / 2 + (rnd(f) - 0.5) * 10, H / 2 + (rnd(f + 9) - 0.5) * 10);
    cx.rotate(-0.12 * flip);
    cx.font = '900 ' + s + 'px "Yu Mincho","Noto Serif JP","MS Mincho",serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillStyle = '#E85A70';
    cx.fillText(glyph, 6, 6);
    cx.fillStyle = '#F6F8FF';
    cx.fillText(glyph, 0, 0);
    cx.restore();
  }
  /* v60: the transition is timed as 60 frames over one second and sampled at no more than 60 paints/sec;
     elapsed-time interpolation and a fading destination-out trail create an anime smear / blur-frame pass. */
  var FF = 0;
  function tbl(a, x) { var i = Math.min(Math.floor(x), a.length - 1), n = Math.min(i + 1, a.length - 1); return a[i] + (a[n] - a[i]) * (x - Math.floor(x)); }
  function draw(ff) {
    FF = ff; var f = Math.floor(ff);
    cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = 'rgba(0,0,0,.48)'; cx.fillRect(0, 0, W, H); cx.globalCompositeOperation = 'source-over';
    if (f === 10) { impact(f); return; }
    var c = ff < COVER ? tbl(CIN, ff) : 1, o = ff >= OUT0 ? tbl(COUT, ff - OUT0) : 0;
    [vSlash, vCross, vBurst][vi](f, c, o);
    if (f > 3 && f < 15) kanji(f);
  }
  function end() {
    cancelAnimationFrame(raf);
    clearTimeout(finishTimer);
    clearTimeout(coverTimer);
    if (cv) {
      cv.classList.remove('is-running');
      cx.clearRect(0, 0, W, H);
    }
  }
  function enter() {
    var v = main && main.querySelector('.view:not([hidden])');
    if (!v || !isAnime()) return;
    v.classList.remove('kk-enter');
    void v.offsetWidth;
    v.classList.add('kk-enter');
    setTimeout(function () {
      v.classList.remove('kk-enter');
    }, 900);
  }
  function play(onCovered, force) {
    if ((!isAnime() && !force) || reduced() || document.visibilityState === 'hidden') { if (typeof onCovered === 'function') onCovered(); return; }
    var el = ensureLayer(), run = ++serial, t0 = performance.now(), fired = false;
    cancelAnimationFrame(raf); clearTimeout(finishTimer); clearTimeout(coverTimer);
    fit(); cx.clearRect(0, 0, W, H); vi = (vi + 1) % 3; flip = -flip; glyph = GL[Math.floor(Math.random() * GL.length)]; el.classList.add('is-running');
    function cover() { if (fired) return; fired = true; if (typeof onCovered === 'function') onCovered(); enter(); }
    function tick(now) {
      if (run !== serial) return;
      var ff = (now - t0) * FPS / 1000;
      if (ff >= NF) { cover(); end(); return; }
      if (ff >= COVER) cover();
      /* requestAnimationFrame follows the display; this gate caps drawing at 60 samples/sec
         on 90/120/144Hz panels while still using the exact elapsed-time position. */
      if (lastPaint === -Infinity || now - lastPaint >= (1000 / FPS) - 0.35) {
        lastPaint = now;
        draw(ff);
      }
      raf = requestAnimationFrame(tick);
    }
    lastPaint = -Infinity;
    tick(t0);
    coverTimer = setTimeout(function () { if (run === serial) { cover(); end(); } }, NF * 1000 / FPS + 350);
  }
  /* v60: newly rendered cards receive a hand-inked slash reveal. Hidden dialogs and focus sheets
     use the same entry treatment; the observer is theme-gated and capped to avoid DOM storms. */
  var INK = '.panel,.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.notecard,.linkitem,.tkTaskCard,.storeCard,.sub,.row,.hw,.exrow,.slot,.focusStep,.focusLayer__card,.kkfc-stat,.kkfc-card-face,[role="dialog"],.modal,.toast';
  function inkIn(node, delay) {
    if (!node || node.nodeType !== 1 || !node.matches || !node.matches(INK) || node.classList.contains('kk-enter')) return;
    node.style.setProperty('--kk-ink-delay', delay + 'ms');
    node.classList.remove('kk-ink');
    void node.offsetWidth;
    node.classList.add('kk-ink');
    var done = function () {
      node.classList.remove('kk-ink');
      node.style.removeProperty('--kk-ink-delay');
    };
    node.addEventListener('animationend', done, { once: true });
    setTimeout(done, 900 + delay);
  }
  new MutationObserver(function (rs) {
    if (!isAnime() || reduced()) return;
    var k = 0;
    rs.forEach(function (r) {
      r.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1 || k > 13 || (n.closest && n.closest('.kk-enter'))) return;
        if (n.matches && n.matches(INK)) inkIn(n, k++ * 36);
        if (n.querySelectorAll && k < 14) {
          Array.prototype.forEach.call(n.querySelectorAll(INK), function (child) {
            if (k > 13) return;
            inkIn(child, k++ * 36);
          });
        }
      });
      if (r.type === 'attributes' && r.target.nodeType === 1 && !r.target.hidden && r.target.open !== false) {
        if (r.target.matches(INK)) inkIn(r.target, 0);
        if (r.target.querySelectorAll) r.target.querySelectorAll(INK).forEach(function (child, i) { if (i < 8) inkIn(child, i * 28); });
      }
    });
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open'] });

  /* Deleted list rows/cards leave a brief cut-out afterimage. The real application action
     still runs immediately; the inert visual clone is only a 460ms decoration. */
  function isDestructive(button) {
    if (!button || !button.matches) return false;
    if (button.matches('[data-delete],[data-action*="delete" i],[data-action*="remove" i],.delete,.remove,.danger,.is-delete')) return true;
    var label = [button.textContent, button.getAttribute('aria-label'), button.title, button.getAttribute('data-action')].join(' ').toLowerCase();
    return /delete|remove|trash|حذف|امسح|مسح|إزالة|ازالة/.test(label);
  }
  document.addEventListener('pointerdown', function (ev) {
    if (!isAnime() || reduced() || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
    var button = ev.target.closest && ev.target.closest('button,[role="button"]');
    if (!isDestructive(button)) return;
    var card = button.closest('.row,.hw,.exrow,.slot,.notecard,.sub,.linkitem,.studyStep,.focusStep,.tkTaskCard,.kkfc-item');
    if (!card || card.classList.contains('kk-shatter-ghost')) return;
    var box = card.getBoundingClientRect();
    if (box.width < 8 || box.height < 8 || box.width * box.height > innerWidth * innerHeight * .62) return;
    var ghost = card.cloneNode(true);
    ghost.removeAttribute('id');
    if (ghost.querySelectorAll) ghost.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    ghost.classList.add('kk-shatter-ghost');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.inert = true;
    ghost.style.left = box.left + 'px';
    ghost.style.top = box.top + 'px';
    ghost.style.width = box.width + 'px';
    ghost.style.height = box.height + 'px';
    ghost.style.maxWidth = 'none';
    document.body.appendChild(ghost);
    setTimeout(function () { if (ghost.isConnected) ghost.remove(); }, 520);
  }, true);
  /* Sync the timer's illustrated aura to the real Pomodoro running state. */
  var pomoBox = document.getElementById('pomoBox');
  var pomoToggle = document.getElementById('pomoToggle');
  if (pomoBox && pomoToggle) {
    var syncPomoMotion = function () {
      pomoBox.classList.toggle('is-running', pomoToggle.getAttribute('data-running') === '1');
    };
    new MutationObserver(syncPomoMotion).observe(pomoToggle, {
      attributes: true,
      attributeFilter: ['data-running'],
      childList: true,
      characterData: true,
      subtree: true
    });
    syncPomoMotion();
  }

  var wasFocus = document.body.classList.contains('focus-active');
  new MutationObserver(function () {
    var on = document.body.classList.contains('focus-active');
    if (on !== wasFocus) { wasFocus = on; play(); }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  /* Click sparks — three stepped blade-glints at the pointer */
  document.addEventListener(
    'pointerdown',
    function (e) {
      if (!isAnime() || reduced()) return;
      if (!(
        e.target.closest && e.target.closest('button,.tab,.ghost,.add,.iconbtn,.fchip,.primary,.linkbtn')
      ))
        return;
      for (var i = 0; i < 3; i++) {
        var s = document.createElement('i');
        s.className = 'kk-spark';
        s.style.left = e.clientX + 'px';
        s.style.top = e.clientY + 'px';
        s.style.setProperty('--r', -70 + i * 62 + Math.random() * 26 + 'deg');
        document.body.appendChild(s);
        setTimeout(
          (function (n) {
            return function () {
              n.remove();
            };
          })(s),
          320,
        );
      }
    },
    { passive: true, capture: true },
  );
  function activeView() {
    var node = main && main.querySelector('.view:not([hidden])');
    return node ? node.id.replace(/^view-/, '') : '';
  }
  function request(button, event) {
    if (replaying || !isAnime() || reduced()) return false;
    if (pending) {
      if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      return true;
    }
    var target = button.dataset.view || button.dataset.dashView || button.getAttribute('data-dash-view');
    if (!target || target === activeView()) return false;
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    pending = true;
    play(function () {
      if (!button.isConnected) {
        pending = false;
        return;
      }
      replaying = true;
      skipObserver = true;
      try {
        button.click();
      } finally {
        replaying = false;
      }
      pending = false;
      setTimeout(function () {
        skipObserver = false;
      }, 0);
    });
    return true;
  }
  document.addEventListener(
    'click',
    function (ev) {
      if (replaying || !isAnime()) return;
      var nav = ev.target.closest && ev.target.closest('.tab[data-view],[data-dash-view]');
      if (nav) request(nav, ev);
    },
    true,
  );
  document.addEventListener(
    'keydown',
    function (ev) {
      if (replaying || !isAnime() || reduced()) return;
      var current = ev.target.closest && ev.target.closest('nav.tabs .tab[role="tab"][data-view]');
      if (!current) return;
      var keys = ['Home', 'End', 'ArrowRight', 'ArrowLeft'];
      if (keys.indexOf(ev.key) < 0) return;
      var nav = document.querySelector('nav.tabs');
      var tabs = nav
        ? Array.prototype.filter.call(nav.querySelectorAll('.tab[role="tab"][data-view]'), function (t) {
            return !t.hidden;
          })
        : [];
      if (tabs.length < 2) return;
      var index = tabs.indexOf(current),
        next = index,
        rtl = root.dir === 'rtl';
      if (ev.key === 'Home') next = 0;
      else if (ev.key === 'End') next = tabs.length - 1;
      else {
        var step = (ev.key === 'ArrowRight') !== rtl ? 1 : -1;
        next = (index + step + tabs.length) % tabs.length;
      }
      if (next === index) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      tabs[next].focus();
      request(tabs[next], null);
    },
    true,
  );
  if (main && window.MutationObserver) {
    var last = activeView();
    new MutationObserver(function (records) {
      var changed = records.some(function (r) {
        return r.target.classList && r.target.classList.contains('view') && !r.target.hidden;
      });
      if (!changed) return;
      var now = activeView();
      if (!now || now === last) return;
      last = now;
      if (skipObserver) {
        skipObserver = false;
        return;
      }
      play();
    }).observe(main, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }
  var lastTheme = root.getAttribute('data-store-theme') || 'classic';
  new MutationObserver(function () {
    var next = root.getAttribute('data-store-theme') || 'classic';
    if (next === lastTheme) return;
    if (next === 'anime' || lastTheme === 'anime') play(null, true);
    if (next !== 'anime' && cv)
      setTimeout(function () {
        if (cv) cv.classList.remove('is-running');
      }, 1080);
    lastTheme = next;
  }).observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
})();
