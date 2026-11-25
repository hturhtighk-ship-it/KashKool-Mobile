/* ================================================================
   KASHKOOL v71 — CINEMATIC THEME LAYER
   Every store theme now gets the same hand-crafted, illustrated
   backdrop that Emberfire, Skybreaker and The Lost Chapter already
   had: layered art, one real light source, film grain, a vignette
   and a living foreground.

   How it works
   ------------
   • One canvas, mounted as the first child of <body>. It paints
     above the theme background and underneath the interface, so the
     interface never loses contrast and the theme never loses depth.
   • One bespoke scene per theme. Nothing is reused between themes,
     the way the secret themes each own their own engine.
   • Mobile, low-power and reduced-motion builds stay cheap:
     lower frame rate, fewer particles, a smaller backing store and
     a single painted frame when motion is switched off.
   • The secret themes (fire / anime / manga) and frost keep their
     own dedicated engines. This layer stands down for them.
   ================================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  if (!root || !body) return;

  var TAU = Math.PI * 2;

  /* Themes this layer is responsible for. */
  var OWNED = {
    classic: 1,
    school: 1,
    football: 1,
    galaxy: 1,
    cyber: 1,
    nature: 1,
    academia: 1,
    ocean: 1,
    sunset: 1,
    mono: 1,
    rose: 1,
    golden: 1,
    metro: 1,
    blueprint: 1,
    swiss: 1,
  };

  /* Themes that already own a dedicated cinematic engine. */
  var EXTERNAL = { fire: 1, anime: 1, manga: 1, frost: 1 };

  /* ------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------ */
  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function rnd(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function hash2(a, b) {
    return rnd(a * 157.31 + b * 311.7);
  }
  function rgba(hex, alpha) {
    var h = String(hex || '#000').replace('#', '');
    if (h.length === 3)
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var num = parseInt(h, 16);
    if (isNaN(num)) num = 0;
    return 'rgba(' + ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255) + ',' + alpha + ')';
  }
  function mix(hexA, hexB, t) {
    function part(hex, shift) {
      var h = String(hex || '#000').replace('#', '');
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var num = parseInt(h, 16);
      if (isNaN(num)) num = 0;
      return (num >> shift) & 255;
    }
    var r = Math.round(lerp(part(hexA, 16), part(hexB, 16), t));
    var g = Math.round(lerp(part(hexA, 8), part(hexB, 8), t));
    var b = Math.round(lerp(part(hexA, 0), part(hexB, 0), t));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function isDark() {
    var mode = root.getAttribute('data-theme');
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------
     Quality profile — one place that decides how expensive the scene is
     ------------------------------------------------------------------ */
  function profile() {
    var mobile = (window.innerWidth || 0) < 760;
    var coarse = false;
    try {
      coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    } catch (e) {}
    var ultra = body.classList.contains('motion-ultra');
    var perf = body.classList.contains('motion-performance');
    var compact = mobile || coarse;
    var dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.3 : 1.6);
    return {
      compact: compact,
      low: perf || ultra,
      ultra: ultra,
      dpr: dpr,
      fps: ultra ? 12 : perf ? 24 : compact ? 30 : 60,
      /* Internal render scale. A slightly softer image reads as filmic
         and keeps phones comfortably ahead of the frame budget. */
      scale: compact ? 0.7 : 1,
      particles: ultra ? 0.25 : perf ? 0.45 : compact ? 0.55 : 1,
    };
  }

  /* The Windows build is the home of the cinematic themes, so it always
     shows them at full strength, exactly like Emberfire, Skybreaker and
     The Lost Chapter already do. A phone or tablet keeps following the
     operating system and the in-app motion setting. */
  function desktopRuntime() {
    var ua = (window.navigator && window.navigator.userAgent) || '';
    if (/Electron\//i.test(ua)) return true;
    if (window.process && window.process.versions && window.process.versions.electron) return true;
    try {
      var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (fine && (window.innerWidth || 0) >= 820) return true;
    } catch (e) {}
    return false;
  }
  function motionMode() {
    if (root.getAttribute('data-kk-desktop-theme-motion') === 'full') return 'full';
    if (desktopRuntime()) return 'full';
    if (body.classList.contains('reduce-motion')) return 'reduced';
    if (body.classList.contains('motion-ultra')) return 'reduced';
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced';
    } catch (e) {}
    return 'full';
  }
  var lastMode = '';
  function applyMotionMode() {
    var mode = motionMode();
    if (mode === lastMode) return mode;
    lastMode = mode;
    try {
      root.setAttribute('data-kk-cinematic-motion', mode);
    } catch (e) {}
    return mode;
  }
  function reduced() {
    return applyMotionMode() === 'reduced';
  }

  /* ------------------------------------------------------------------
     Film grain — one small noise tile, reused as a pattern
     ------------------------------------------------------------------ */
  var grainTile = null;
  function ensureGrain() {
    if (grainTile) return grainTile;
    var size = 128;
    var tile = document.createElement('canvas');
    tile.width = size;
    tile.height = size;
    var g = tile.getContext('2d');
    if (!g) return null;
    var img = g.createImageData(size, size);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = 120 + Math.random() * 135;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    grainTile = tile;
    return tile;
  }

  function paintGrain(c, w, h, amount, time) {
    if (amount <= 0) return;
    var tile = ensureGrain();
    if (!tile) return;
    var pat = c.createPattern(tile, 'repeat');
    if (!pat) return;
    c.save();
    c.globalAlpha = amount;
    c.globalCompositeOperation = 'overlay';
    var jitter = Math.floor((time * 24) % 8);
    c.translate(-jitter, -Math.floor((time * 17) % 8));
    c.fillStyle = pat;
    c.fillRect(0, 0, w + 8, h + 8);
    c.restore();
  }

  function paintVignette(c, w, h, amount, color) {
    if (amount <= 0) return;
    var g = c.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.18, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.62, 'rgba(0,0,0,' + amount * 0.28 + ')');
    g.addColorStop(1, (color || 'rgba(0,0,0,') + amount + ')');
    c.save();
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.restore();
  }

  function paintLight(c, w, h, light, time) {
    if (!light) return;
    var pulse = 1 + Math.sin(time * (light.speed || 0.35)) * (light.pulse || 0.05);
    var cx = w * light.x;
    var cy = h * light.y;
    var r = Math.max(w, h) * (light.r || 0.8) * pulse;
    var g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, light.color || 'rgba(255,255,255,0.3)');
    g.addColorStop(0.45, light.color2 || 'rgba(255,255,255,0.08)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.save();
    c.globalCompositeOperation = 'screen';
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.restore();
  }

  function paintWash(c, w, h, stops, angle) {
    var g = c.createLinearGradient(0, 0, angle === 'v' ? 0 : w, angle === 'v' ? h : 0);
    for (var i = 0; i < stops.length; i++) g.addColorStop(i / (stops.length - 1), stops[i]);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  }

  /* ------------------------------------------------------------------
     Particles — one shared pool, re-seeded whenever the theme changes
     ------------------------------------------------------------------ */
  var particles = [];
  function seedParticles(count, kind, w, h) {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.2,
        s: 0.25 + Math.random() * 1.1,
        p: Math.random() * TAU,
        d: Math.random() * TAU,
        a: 0.15 + Math.random() * 0.5,
        k: kind,
      });
    }
  }
  function stepParticles(dt, w, h, kind) {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.p += dt * 0.6;
      if (kind === 'rise') {
        p.y -= p.s * 26 * dt;
        p.x += Math.sin(p.p) * 12 * dt;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
      } else if (kind === 'fall') {
        p.y += p.s * 26 * dt;
        p.x += Math.sin(p.p * 1.4) * 16 * dt;
        if (p.y > h + 12) {
          p.y = -12;
          p.x = Math.random() * w;
        }
      } else if (kind === 'drift') {
        p.x += p.s * 18 * dt;
        p.y += Math.sin(p.p) * 10 * dt;
        if (p.x > w + 12) p.x = -12;
      } else {
        p.x += Math.sin(p.p) * 10 * dt;
        p.y += Math.cos(p.p * 0.8) * 8 * dt;
      }
    }
  }
  function paintParticles(c, kind, color, time) {
    if (!particles.length) return;
    c.save();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var alpha = p.a * (0.55 + 0.45 * Math.sin(p.p * 1.6 + p.d));
      c.globalAlpha = clamp(alpha, 0, 1);
      c.fillStyle = color;
      if (kind === 'dot') {
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, TAU);
        c.fill();
      } else if (kind === 'leaf') {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.p * 0.9);
        c.beginPath();
        c.ellipse(0, 0, p.r * 3.4, p.r * 1.4, 0, 0, TAU);
        c.fill();
        c.restore();
      } else if (kind === 'petal') {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.p);
        c.beginPath();
        c.moveTo(0, -p.r * 3);
        c.quadraticCurveTo(p.r * 2.4, 0, 0, p.r * 3);
        c.quadraticCurveTo(-p.r * 2.4, 0, 0, -p.r * 3);
        c.fill();
        c.restore();
      } else if (kind === 'bubble') {
        c.globalAlpha = clamp(alpha * 0.8, 0, 1);
        c.strokeStyle = color;
        c.lineWidth = 1;
        c.beginPath();
        c.arc(p.x, p.y, p.r * 2.4, 0, TAU);
        c.stroke();
      } else {
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, TAU);
        c.fill();
      }
    }
    c.restore();
  }

  /* ==================================================================
     THE SCENES
     Each scene paints one complete illustrated backdrop for one theme.
     ================================================================== */

  /* ---------- CLASSIC — the notebook page, a lamp, drifting ink ----- */
  function sceneClassic(c, w, h, t, q) {
    var dark = isDark();
    paintWash(c, w, h, dark ? ['#161A22', '#0E1117'] : ['#FBF6E9', '#EFE5D0'], 'v');
    /* ruled paper */
    c.save();
    c.strokeStyle = dark ? 'rgba(150,168,196,0.14)' : 'rgba(94,120,150,0.16)';
    c.lineWidth = 1;
    var gap = 34;
    var off = (t * 5) % gap;
    for (var y = -gap + off; y < h + gap; y += gap) {
      c.beginPath();
      c.moveTo(0, Math.round(y) + 0.5);
      c.lineTo(w, Math.round(y) + 0.5);
      c.stroke();
    }
    /* red margin */
    c.strokeStyle = dark ? 'rgba(226,104,104,0.34)' : 'rgba(196,64,64,0.34)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(w * 0.88, 0);
    c.lineTo(w * 0.88, h);
    c.stroke();
    c.restore();
    /* ink blooms */
    c.save();
    for (var i = 0; i < 4; i++) {
      var bx = w * (0.12 + hash2(i, 3) * 0.76);
      var by = h * (0.1 + hash2(i, 7) * 0.8);
      var br = Math.min(w, h) * (0.09 + hash2(i, 11) * 0.12);
      var g = c.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, dark ? 'rgba(120,146,190,0.10)' : 'rgba(70,96,140,0.10)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g;
      c.fillRect(bx - br, by - br, br * 2, br * 2);
    }
    c.restore();
    paintParticles(c, 'dot', dark ? 'rgba(214,226,246,0.9)' : 'rgba(60,48,32,0.9)', t);
  }

  /* ---------- SCHOOL — spiral notebook, ruled page, pencil ticks ------ */
  function sceneSchool(c, w, h, t, q) {
    paintWash(c, w, h, ['#FDFBF3', '#F0E9D6'], 'v');
    c.save();
    c.strokeStyle = 'rgba(90,120,150,0.18)';
    c.lineWidth = 1;
    var gap = 32;
    for (var y = 0; y < h + gap; y += gap) {
      c.beginPath();
      c.moveTo(0, Math.round(y) + 0.5);
      c.lineTo(w, Math.round(y) + 0.5);
      c.stroke();
    }
    /* spiral binding on the right (RTL page) */
    var railX = w - Math.min(46, w * 0.1);
    for (var i = 0; i * 26 < h + 26; i++) {
      var cy = i * 26 + 12;
      c.strokeStyle = 'rgba(70,86,110,0.5)';
      c.lineWidth = 3;
      c.beginPath();
      c.ellipse(railX, cy, 11, 8, 0, Math.PI * 0.15, Math.PI * 1.5);
      c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.55)';
      c.lineWidth = 1;
      c.beginPath();
      c.ellipse(railX, cy - 1, 11, 8, 0, Math.PI * 0.2, Math.PI * 1.4);
      c.stroke();
    }
    /* folder tabs */
    var tabs = ['#C79222', '#B2472E', '#2D7A4B', '#1677D2'];
    for (var k = 0; k < tabs.length; k++) {
      var ty = h * (0.16 + k * 0.21);
      c.fillStyle = rgba(tabs[k], 0.5);
      c.fillRect(w - 8, ty, 7, 46);
    }
    c.restore();
    paintParticles(c, 'dot', 'rgba(40,32,20,0.85)', t);
  }

  /* ---------- FOOTBALL — match day under floodlights ------------------ */
  function sceneFootball(c, w, h, t, q) {
    paintWash(c, w, h, ['#173D2B', '#0B2018'], 'v');
    /* mowing stripes */
    c.save();
    for (var i = 0; i < 14; i++) {
      c.fillStyle = i % 2 ? 'rgba(255,255,255,0.026)' : 'rgba(0,0,0,0.05)';
      c.fillRect(0, (i * h) / 14, w, h / 14);
    }
    c.restore();
    /* pitch markings */
    c.save();
    c.strokeStyle = 'rgba(235,245,255,0.26)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, h * 0.72);
    c.lineTo(w, h * 0.72);
    c.stroke();
    c.beginPath();
    c.ellipse(w * 0.5, h * 0.72, Math.min(w, h) * 0.16, Math.min(w, h) * 0.1, 0, 0, TAU);
    c.stroke();
    c.strokeStyle = 'rgba(235,245,255,0.16)';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(w * 0.12, h * 0.72);
    c.lineTo(w * 0.12, h * 0.9);
    c.lineTo(w * 0.3, h * 0.9);
    c.lineTo(w * 0.3, h * 0.72);
    c.stroke();
    c.restore();
    /* floodlights */
    c.save();
    c.globalCompositeOperation = 'screen';
    var cones = [
      { x: w * 0.08, y: -h * 0.1, col: 'rgba(214,236,255,0.16)' },
      { x: w * 0.92, y: -h * 0.1, col: 'rgba(255,238,198,0.13)' },
    ];
    for (var c2 = 0; c2 < cones.length; c2++) {
      var cn = cones[c2];
      var g = c.createLinearGradient(cn.x, cn.y, cn.x, h * 0.9);
      g.addColorStop(0, cn.col);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(cn.x - 26, cn.y);
      c.lineTo(cn.x + 26, cn.y);
      c.lineTo(cn.x + w * 0.34, h * 0.9);
      c.lineTo(cn.x - w * 0.34, h * 0.9);
      c.closePath();
      c.fill();
    }
    c.restore();
    /* the ball rolls along the touchline */
    var bx = ((t * 62) % (w + 120)) - 60;
    var by = h * 0.855 + Math.sin(t * 2.4) * 6;
    c.save();
    c.translate(bx, by);
    c.rotate(t * 2.2);
    c.fillStyle = 'rgba(248,252,255,0.92)';
    c.beginPath();
    c.arc(0, 0, 9, 0, TAU);
    c.fill();
    c.fillStyle = 'rgba(24,40,32,0.9)';
    c.beginPath();
    c.arc(0, 0, 3.6, 0, TAU);
    c.fill();
    c.strokeStyle = 'rgba(24,40,32,0.55)';
    c.lineWidth = 1.2;
    for (var p = 0; p < 5; p++) {
      var ang = (p / 5) * TAU;
      c.beginPath();
      c.arc(Math.cos(ang) * 6.6, Math.sin(ang) * 6.6, 1.8, 0, TAU);
      c.stroke();
    }
    c.restore();
    paintParticles(c, 'dot', 'rgba(236,248,255,0.8)', t);
  }

  /* ---------- GALAXY — nebula, starfield, a shooting star ------------ */
  function sceneGalaxy(c, w, h, t, q) {
    paintWash(c, w, h, ['#0A0D28', '#05060F'], 'v');
    /* nebula clouds */
    c.save();
    c.globalCompositeOperation = 'screen';
    var clouds = [
      { x: 0.28, y: 0.34, r: 0.62, col: '#3C2F86' },
      { x: 0.68, y: 0.24, r: 0.52, col: '#6B2E7A' },
      { x: 0.5, y: 0.72, r: 0.58, col: '#134A72' },
    ];
    for (var i = 0; i < clouds.length; i++) {
      var cl = clouds[i];
      var cx = w * (cl.x + Math.sin(t * 0.07 + i) * 0.04);
      var cy = h * (cl.y + Math.cos(t * 0.06 + i * 1.7) * 0.035);
      var r = Math.max(w, h) * cl.r;
      var g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, rgba(cl.col, 0.42));
      g.addColorStop(0.45, rgba(cl.col, 0.14));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = g;
      c.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    c.restore();
    /* stars */
    c.save();
    var count = Math.round(150 * clamp(q.particles + 0.35, 0.4, 1.25));
    for (var s = 0; s < count; s++) {
      var sx = hash2(s, 1) * w;
      var sy = hash2(s, 2) * h;
      var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1.1 + hash2(s, 3) * 2.2) + s));
      var sr = 0.5 + hash2(s, 4) * 1.5;
      c.globalAlpha = tw * 0.9;
      c.fillStyle = hash2(s, 5) > 0.86 ? '#C9D6FF' : '#FFFFFF';
      c.beginPath();
      c.arc(sx, sy, sr, 0, TAU);
      c.fill();
    }
    c.restore();
    /* shooting star */
    var cycle = 7.5;
    var tp = (t % cycle) / cycle;
    if (tp < 0.22) {
      var k = tp / 0.22;
      var x0 = w * 0.82;
      var y0 = h * 0.08;
      var x1 = w * (0.82 - k * 0.55);
      var y1 = h * (0.08 + k * 0.32);
      c.save();
      c.globalCompositeOperation = 'screen';
      var sg = c.createLinearGradient(x0, y0, x1, y1);
      sg.addColorStop(0, 'rgba(255,255,255,0)');
      sg.addColorStop(1, 'rgba(214,226,255,0.85)');
      c.strokeStyle = sg;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(x1, y1);
      c.stroke();
      c.restore();
    }
  }

  /* ---------- CYBER — HUD grid, horizon, scan sweep ------------------ */
  function sceneCyber(c, w, h, t, q) {
    paintWash(c, w, h, ['#081213', '#04090B'], 'v');
    var horizon = h * 0.62;
    c.save();
    /* horizon glow */
    var hg = c.createLinearGradient(0, horizon - h * 0.22, 0, horizon + h * 0.05);
    hg.addColorStop(0, 'rgba(28,89,96,0)');
    hg.addColorStop(1, 'rgba(49,242,194,0.16)');
    c.fillStyle = hg;
    c.fillRect(0, horizon - h * 0.22, w, h * 0.27);
    /* perspective floor */
    c.strokeStyle = 'rgba(49,242,194,0.17)';
    c.lineWidth = 1;
    for (var i = 1; i <= 14; i++) {
      var z = i / 14;
      var yy = horizon + Math.pow(z, 2.3) * (h - horizon);
      c.globalAlpha = 0.12 + z * 0.3;
      c.beginPath();
      c.moveTo(0, yy);
      c.lineTo(w, yy);
      c.stroke();
    }
    for (var v = -8; v <= 8; v++) {
      c.globalAlpha = 0.14;
      c.beginPath();
      c.moveTo(w * 0.5 + v * w * 0.03, horizon);
      c.lineTo(w * 0.5 + v * w * 0.32, h);
      c.stroke();
    }
    c.restore();
    /* scan sweep */
    c.save();
    c.globalCompositeOperation = 'screen';
    var sweep = ((t * 0.22) % 1) * h;
    var sg = c.createLinearGradient(0, sweep - h * 0.16, 0, sweep + h * 0.02);
    sg.addColorStop(0, 'rgba(49,242,194,0)');
    sg.addColorStop(1, 'rgba(49,242,194,0.14)');
    c.fillStyle = sg;
    c.fillRect(0, sweep - h * 0.16, w, h * 0.18);
    c.restore();
    /* HUD brackets */
    c.save();
    c.strokeStyle = 'rgba(49,242,194,0.28)';
    c.lineWidth = 1.6;
    var m = 18;
    var arm = 34;
    var corners = [
      [m, m, 1, 1],
      [w - m, m, -1, 1],
      [m, h - m, 1, -1],
      [w - m, h - m, -1, -1],
    ];
    for (var k = 0; k < corners.length; k++) {
      var p = corners[k];
      c.beginPath();
      c.moveTo(p[0] + arm * p[2], p[1]);
      c.lineTo(p[0], p[1]);
      c.lineTo(p[0], p[1] + arm * p[3]);
      c.stroke();
    }
    c.restore();
    paintParticles(c, 'dot', 'rgba(49,242,194,0.85)', t);
  }

  /* ---------- NATURE — hills, light shafts, drifting leaves ----------- */
  function sceneNature(c, w, h, t, q) {
    paintWash(c, w, h, ['#E7F0E0', '#C9DCC0'], 'v');
    /* sun shafts */
    c.save();
    c.globalCompositeOperation = 'screen';
    for (var s = 0; s < 4; s++) {
      var base = w * (0.12 + s * 0.24);
      var sway = Math.sin(t * 0.18 + s) * w * 0.02;
      var g = c.createLinearGradient(base, -h * 0.05, base + sway, h * 0.95);
      g.addColorStop(0, 'rgba(255,252,214,0.30)');
      g.addColorStop(0.55, 'rgba(255,250,205,0.10)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(base - 26, -20);
      c.lineTo(base + 26, -20);
      c.lineTo(base + w * 0.09 + sway, h);
      c.lineTo(base - w * 0.05 + sway, h);
      c.closePath();
      c.fill();
    }
    c.restore();
    /* layered hills */
    var layers = [
      { y: 0.68, amp: 0.05, col: 'rgba(91,138,81,0.32)', sp: 0.11 },
      { y: 0.78, amp: 0.06, col: 'rgba(70,112,63,0.42)', sp: 0.09 },
      { y: 0.88, amp: 0.07, col: 'rgba(35,55,42,0.5)', sp: 0.07 },
    ];
    c.save();
    for (var i = 0; i < layers.length; i++) {
      var L = layers[i];
      c.fillStyle = L.col;
      c.beginPath();
      c.moveTo(0, h);
      c.lineTo(0, h * L.y);
      for (var x = 0; x <= w; x += Math.max(18, w / 60)) {
        var yy =
          h * L.y +
          Math.sin(x * 0.0042 + t * L.sp + i * 1.9) * h * L.amp +
          Math.sin(x * 0.0013 - t * L.sp * 0.6) * h * L.amp * 0.6;
        c.lineTo(x, yy);
      }
      c.lineTo(w, h);
      c.closePath();
      c.fill();
    }
    c.restore();
    paintParticles(c, 'leaf', 'rgba(91,138,81,0.85)', t);
  }

  /* ---------- ACADEMIA — library shelves, candle light, dust ---------- */
  function sceneAcademia(c, w, h, t, q) {
    paintWash(c, w, h, ['#2A211B', '#181310'], 'v');
    /* shelves */
    c.save();
    var shelfTop = h * 0.16;
    var shelfBottom = h * 0.78;
    var shelfH = (shelfBottom - shelfTop) / 4;
    for (var r = 0; r < 4; r++) {
      var sy = shelfTop + r * shelfH;
      c.fillStyle = 'rgba(24,18,14,0.85)';
      c.fillRect(0, sy + shelfH - 14, w, 14);
      var bx = 0;
      var idx = r * 37;
      while (bx < w) {
        var bw = 8 + hash2(idx, 1) * 16;
        var bh = shelfH * (0.5 + hash2(idx, 2) * 0.32);
        var tone = hash2(idx, 3);
        c.fillStyle =
          tone > 0.66
            ? 'rgba(146,110,66,0.55)'
            : tone > 0.33
              ? 'rgba(103,81,61,0.6)'
              : 'rgba(178,135,80,0.42)';
        c.fillRect(bx, sy + shelfH - 14 - bh, bw - 2, bh);
        bx += bw;
        idx++;
      }
    }
    c.restore();
    /* candle glow */
    c.save();
    c.globalCompositeOperation = 'screen';
    var gx = w * 0.82;
    var gy = h * 0.88;
    var flick = 1 + Math.sin(t * 5.2) * 0.04 + Math.sin(t * 11.7) * 0.02;
    var g = c.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.55 * flick);
    g.addColorStop(0, 'rgba(255,196,110,0.32)');
    g.addColorStop(0.35, 'rgba(220,150,70,0.12)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.restore();
    paintParticles(c, 'dot', 'rgba(255,224,170,0.9)', t);
  }

  /* ---------- OCEAN — caustics, god rays, bubbles, a wave line ------- */
  function sceneOcean(c, w, h, t, q) {
    paintWash(c, w, h, ['#0B3A4C', '#04141F'], 'v');
    /* god rays */
    c.save();
    c.globalCompositeOperation = 'screen';
    for (var s = 0; s < 5; s++) {
      var bx = w * (0.08 + s * 0.2);
      var sway = Math.sin(t * 0.22 + s * 1.4) * w * 0.03;
      var g = c.createLinearGradient(bx, -10, bx + sway, h);
      g.addColorStop(0, 'rgba(150,228,255,0.16)');
      g.addColorStop(0.5, 'rgba(120,210,255,0.06)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(bx - 16, -20);
      c.lineTo(bx + 16, -20);
      c.lineTo(bx + w * 0.07 + sway, h);
      c.lineTo(bx - w * 0.05 + sway, h);
      c.closePath();
      c.fill();
    }
    c.restore();
    /* caustic net */
    c.save();
    c.globalCompositeOperation = 'screen';
    c.lineWidth = 1.4;
    var lines = 7;
    for (var i = 0; i < lines; i++) {
      var ph = i * 1.3;
      c.strokeStyle = 'rgba(140,230,255,' + (0.05 + (i % 3) * 0.035) + ')';
      c.beginPath();
      for (var x = 0; x <= w; x += Math.max(14, w / 90)) {
        var y =
          h * (0.12 + i * 0.09) +
          Math.sin(x * 0.011 + t * 0.9 + ph) * 16 +
          Math.sin(x * 0.027 - t * 0.6 + ph * 2) * 7;
        if (x === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
    c.restore();
    /* sea floor wave */
    c.save();
    c.strokeStyle = 'rgba(180,240,255,0.2)';
    c.lineWidth = 2;
    c.beginPath();
    for (var fx = 0; fx <= w; fx += Math.max(14, w / 80)) {
      var fy = h * 0.93 + Math.sin(fx * 0.012 + t * 1.4) * 10;
      if (fx === 0) c.moveTo(fx, fy);
      else c.lineTo(fx, fy);
    }
    c.stroke();
    c.restore();
    paintParticles(c, 'bubble', 'rgba(190,244,255,0.9)', t);
  }

  /* ---------- SUNSET — the sun sinks, rays, fireflies ------------------ */
  function sceneSunset(c, w, h, t, q) {
    paintWash(c, w, h, ['#3A1626', '#7A3524', '#E0894A'], 'v');
    var sunY = h * (0.72 + Math.sin(t * 0.06) * 0.03);
    var sunX = w * 0.5;
    var sunR = Math.min(w, h) * 0.17;
    c.save();
    c.globalCompositeOperation = 'screen';
    var g = c.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 5);
    g.addColorStop(0, 'rgba(255,214,140,0.55)');
    g.addColorStop(0.22, 'rgba(255,160,80,0.24)');
    g.addColorStop(1, 'rgba(255,120,60,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.restore();
    /* sun disc */
    c.save();
    var dg = c.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
    dg.addColorStop(0, 'rgba(255,236,190,0.95)');
    dg.addColorStop(1, 'rgba(255,138,70,0.95)');
    c.fillStyle = dg;
    c.beginPath();
    c.arc(sunX, sunY, sunR, 0, TAU);
    c.fill();
    c.restore();
    /* cloud bands */
    c.save();
    for (var i = 0; i < 6; i++) {
      var cy = h * (0.18 + i * 0.11);
      var cw = w * (0.3 + hash2(i, 5) * 0.5);
      var cx = ((t * (6 + i * 2)) % (w + cw * 2)) - cw;
      c.fillStyle = 'rgba(60,22,40,' + (0.14 + i * 0.03) + ')';
      c.beginPath();
      c.ellipse(cx, cy, cw, h * 0.022, 0, 0, TAU);
      c.fill();
    }
    c.restore();
    /* rays */
    c.save();
    c.globalCompositeOperation = 'screen';
    for (var r = 0; r < 9; r++) {
      var ang = -Math.PI / 2 + (r - 4) * 0.19 + Math.sin(t * 0.1 + r) * 0.02;
      c.save();
      c.translate(sunX, sunY);
      c.rotate(ang);
      var rg = c.createLinearGradient(0, 0, 0, -h);
      rg.addColorStop(0, 'rgba(255,200,130,0.16)');
      rg.addColorStop(1, 'rgba(255,200,130,0)');
      c.fillStyle = rg;
      c.beginPath();
      c.moveTo(-8, 0);
      c.lineTo(8, 0);
      c.lineTo(38, -h);
      c.lineTo(-38, -h);
      c.closePath();
      c.fill();
      c.restore();
    }
    c.restore();
    paintParticles(c, 'dot', 'rgba(255,224,150,0.95)', t);
  }

  /* ---------- MONO — a poster, hard blocks, halftone ------------------ */
  function sceneMono(c, w, h, t, q) {
    paintWash(c, w, h, ['#F4F4F4', '#DCDCDC'], 'v');
    /* hard blocks */
    c.save();
    c.fillStyle = 'rgba(20,20,20,0.92)';
    var bx = w * 0.08;
    var by = h * 0.12;
    c.fillRect(bx, by, w * 0.26, h * 0.2);
    c.fillStyle = 'rgba(20,20,20,0.16)';
    c.fillRect(w * 0.4, h * 0.12, w * 0.52, h * 0.06);
    c.fillRect(w * 0.4, h * 0.22, w * 0.34, h * 0.1);
    c.fillStyle = 'rgba(20,20,20,0.88)';
    c.fillRect(w * 0.62, h * 0.62, w * 0.3, h * 0.24);
    c.restore();
    /* halftone */
    c.save();
    c.fillStyle = 'rgba(30,30,30,0.3)';
    var step = Math.max(11, Math.min(w, h) / 34);
    for (var y = h * 0.42; y < h * 0.98; y += step) {
      for (var x = w * 0.02; x < w * 0.55; x += step) {
        var rad = (Math.sin(x * 0.01 + t * 0.5) * 0.5 + 0.5) * step * 0.42;
        if (rad < 0.3) continue;
        c.beginPath();
        c.arc(x, y, rad, 0, TAU);
        c.fill();
      }
    }
    c.restore();
    /* sliding bar */
    c.save();
    c.fillStyle = 'rgba(20,20,20,0.95)';
    var slide = ((t * 0.09) % 1) * (w + 300) - 150;
    c.fillRect(slide, h * 0.44, 190, 10);
    c.restore();
  }

  /* ---------- ROSE — dune arches, haze, drifting petals --------------- */
  function sceneRose(c, w, h, t, q) {
    paintWash(c, w, h, ['#3B1A2E', '#6B3A44', '#C08A82'], 'v');
    /* haze */
    c.save();
    c.globalCompositeOperation = 'screen';
    var g = c.createRadialGradient(w * 0.5, h * 0.82, 0, w * 0.5, h * 0.82, Math.max(w, h) * 0.7);
    g.addColorStop(0, 'rgba(255,214,196,0.24)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.restore();
    /* arches */
    var arches = [
      { x: 0.2, s: 0.30, c: 'rgba(59,26,46,0.55)' },
      { x: 0.52, s: 0.42, c: 'rgba(45,19,34,0.6)' },
      { x: 0.84, s: 0.34, c: 'rgba(35,14,27,0.66)' },
    ];
    c.save();
    for (var i = 0; i < arches.length; i++) {
      var a = arches[i];
      var ax = w * a.x;
      var aw = w * a.s;
      var top = h * (0.42 - a.s * 0.16);
      var bottom = h * 1.05;
      c.fillStyle = a.c;
      c.beginPath();
      c.moveTo(ax - aw / 2, bottom);
      c.lineTo(ax - aw / 2, top + aw / 2);
      c.arc(ax, top + aw / 2, aw / 2, Math.PI, 0);
      c.lineTo(ax + aw / 2, bottom);
      c.closePath();
      c.fill();
    }
    c.restore();
    paintParticles(c, 'petal', 'rgba(240,196,196,0.9)', t);
  }

  /* ---------- GOLDEN — golden hour, long shafts, warm bloom ----------- */
  function sceneGolden(c, w, h, t, q) {
    paintWash(c, w, h, ['#2B241F', '#3A312B', '#6A5848'], 'v');
    /* long light shafts */
    c.save();
    c.globalCompositeOperation = 'screen';
    for (var s = 0; s < 5; s++) {
      var bx = w * (0.2 + s * 0.18);
      var sway = Math.sin(t * 0.13 + s * 0.9) * w * 0.015;
      var g = c.createLinearGradient(bx, -h * 0.1, bx + sway, h);
      g.addColorStop(0, 'rgba(255,214,120,0.30)');
      g.addColorStop(0.55, 'rgba(244,169,0,0.10)');
      g.addColorStop(1, 'rgba(244,169,0,0)');
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(bx - 20, -20);
      c.lineTo(bx + 20, -20);
      c.lineTo(bx + w * 0.08 + sway, h);
      c.lineTo(bx - w * 0.06 + sway, h);
      c.closePath();
      c.fill();
    }
    c.restore();
    /* long shadows on the floor */
    c.save();
    c.fillStyle = 'rgba(30,22,18,0.42)';
    c.beginPath();
    c.moveTo(0, h);
    c.lineTo(w * 0.1, h * 0.86);
    c.lineTo(w * 0.9, h * 0.9);
    c.lineTo(w, h);
    c.closePath();
    c.fill();
    c.restore();
    paintParticles(c, 'dot', 'rgba(255,226,160,0.95)', t);
  }

  /* ---------- METRO — a transit map with a moving train --------------- */
  function sceneMetro(c, w, h, t, q) {
    paintWash(c, w, h, ['#F2F6FB', '#E1E9F3'], 'v');
    var routes = [
      { col: '#1677D2', pts: [[0.05, 0.28], [0.32, 0.28], [0.46, 0.46], [0.78, 0.46]] },
      { col: '#C0392B', pts: [[0.12, 0.72], [0.38, 0.72], [0.52, 0.54], [0.9, 0.54]] },
      { col: '#1E8E5A', pts: [[0.08, 0.56], [0.26, 0.4], [0.62, 0.4], [0.74, 0.22]] },
    ];
    c.save();
    c.lineCap = 'round';
    c.lineJoin = 'round';
    for (var i = 0; i < routes.length; i++) {
      var r = routes[i];
      c.strokeStyle = rgba(r.col, 0.55);
      c.lineWidth = Math.max(5, Math.min(w, h) * 0.011);
      c.beginPath();
      for (var p = 0; p < r.pts.length; p++) {
        var px = w * r.pts[p][0];
        var py = h * r.pts[p][1];
        if (p === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.stroke();
      /* stations */
      for (var q2 = 0; q2 < r.pts.length; q2++) {
        c.fillStyle = '#FFFFFF';
        c.beginPath();
        c.arc(w * r.pts[q2][0], h * r.pts[q2][1], Math.max(4, Math.min(w, h) * 0.008), 0, TAU);
        c.fill();
        c.strokeStyle = r.col;
        c.lineWidth = 2;
        c.stroke();
      }
    }
    c.restore();
    /* the train runs along the blue line */
    c.save();
    var seg = t * 0.16;
    var line = routes[0];
    var total = 0;
    var segs = [];
    for (var a = 0; a < line.pts.length - 1; a++) {
      var dx = (line.pts[a + 1][0] - line.pts[a][0]) * w;
      var dy = (line.pts[a + 1][1] - line.pts[a][1]) * h;
      var len = Math.sqrt(dx * dx + dy * dy);
      segs.push(len);
      total += len;
    }
    var travel = (seg % 1) * total;
    var tx = 0;
    var ty = 0;
    for (var s2 = 0; s2 < segs.length; s2++) {
      if (travel <= segs[s2] || s2 === segs.length - 1) {
        var k = travel / segs[s2];
        tx = w * (line.pts[s2][0] + (line.pts[s2 + 1][0] - line.pts[s2][0]) * k);
        ty = h * (line.pts[s2][1] + (line.pts[s2 + 1][1] - line.pts[s2][1]) * k);
        break;
      }
      travel -= segs[s2];
    }
    c.fillStyle = '#1677D2';
    c.beginPath();
    c.arc(tx, ty, Math.max(6, Math.min(w, h) * 0.013), 0, TAU);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.beginPath();
    c.arc(tx, ty, Math.max(2.5, Math.min(w, h) * 0.005), 0, TAU);
    c.fill();
    c.restore();
  }

  /* ---------- BLUEPRINT — drafting grid and measurements ------------- */
  function sceneBlueprint(c, w, h, t, q) {
    paintWash(c, w, h, ['#081B33', '#102B4B'], 'v');
    /* minor grid */
    c.save();
    c.strokeStyle = 'rgba(85,214,255,0.09)';
    c.lineWidth = 1;
    var minor = Math.max(16, Math.min(w, h) / 26);
    for (var x = 0; x < w; x += minor) {
      c.beginPath();
      c.moveTo(Math.round(x) + 0.5, 0);
      c.lineTo(Math.round(x) + 0.5, h);
      c.stroke();
    }
    for (var y = 0; y < h; y += minor) {
      c.beginPath();
      c.moveTo(0, Math.round(y) + 0.5);
      c.lineTo(w, Math.round(y) + 0.5);
      c.stroke();
    }
    /* major grid */
    c.strokeStyle = 'rgba(85,214,255,0.2)';
    var major = minor * 5;
    for (var x2 = 0; x2 < w; x2 += major) {
      c.beginPath();
      c.moveTo(Math.round(x2) + 0.5, 0);
      c.lineTo(Math.round(x2) + 0.5, h);
      c.stroke();
    }
    for (var y2 = 0; y2 < h; y2 += major) {
      c.beginPath();
      c.moveTo(0, Math.round(y2) + 0.5);
      c.lineTo(w, Math.round(y2) + 0.5);
      c.stroke();
    }
    c.restore();
    /* dimension line */
    c.save();
    c.strokeStyle = 'rgba(190,235,255,0.5)';
    c.fillStyle = 'rgba(190,235,255,0.75)';
    c.lineWidth = 1.4;
    var dy = h * 0.28;
    var dx0 = w * 0.14;
    var dx1 = w * 0.74;
    c.beginPath();
    c.moveTo(dx0, dy);
    c.lineTo(dx1, dy);
    c.stroke();
    for (var e = 0; e < 2; e++) {
      var ex = e ? dx1 : dx0;
      c.beginPath();
      c.moveTo(ex, dy - 9);
      c.lineTo(ex, dy + 9);
      c.stroke();
    }
    c.font = '600 ' + Math.max(9, Math.min(w, h) * 0.018) + 'px system-ui, sans-serif';
    c.textAlign = 'center';
    c.fillText('2400', (dx0 + dx1) / 2, dy - 12);
    c.restore();
    /* crosshair */
    c.save();
    c.strokeStyle = 'rgba(85,214,255,0.32)';
    c.lineWidth = 1;
    var cx = w * 0.72;
    var cy = h * 0.66;
    var rr = Math.min(w, h) * 0.09;
    c.beginPath();
    c.arc(cx, cy, rr, 0, TAU);
    c.stroke();
    c.beginPath();
    c.arc(cx, cy, rr * 0.34, 0, TAU);
    c.stroke();
    c.beginPath();
    c.moveTo(cx - rr * 1.5, cy);
    c.lineTo(cx + rr * 1.5, cy);
    c.moveTo(cx, cy - rr * 1.5);
    c.lineTo(cx, cy + rr * 1.5);
    c.stroke();
    c.restore();
    /* slow drafting sweep */
    c.save();
    c.globalCompositeOperation = 'screen';
    var sw = ((t * 0.08) % 1.2) * w - w * 0.1;
    var sg = c.createLinearGradient(sw - w * 0.12, 0, sw + w * 0.12, 0);
    sg.addColorStop(0, 'rgba(85,214,255,0)');
    sg.addColorStop(0.5, 'rgba(85,214,255,0.09)');
    sg.addColorStop(1, 'rgba(85,214,255,0)');
    c.fillStyle = sg;
    c.fillRect(sw - w * 0.12, 0, w * 0.24, h);
    c.restore();
  }

  /* ---------- SWISS — strict column grid and one red rule ------------- */
  function sceneSwiss(c, w, h, t, q) {
    paintWash(c, w, h, ['#F7F6F2', '#E6E4DE'], 'v');
    /* column grid */
    c.save();
    c.strokeStyle = 'rgba(23,23,23,0.10)';
    c.lineWidth = 1;
    var cols = 6;
    for (var i = 1; i < cols; i++) {
      var x = (w * i) / cols;
      c.beginPath();
      c.moveTo(Math.round(x) + 0.5, 0);
      c.lineTo(Math.round(x) + 0.5, h);
      c.stroke();
    }
    c.restore();
    /* the red rule */
    c.save();
    c.fillStyle = '#E53935';
    c.fillRect(w * 0.08, h * 0.18, w * 0.22, Math.max(4, h * 0.012));
    c.restore();
    /* black poster blocks */
    c.save();
    c.fillStyle = 'rgba(23,23,23,0.92)';
    c.fillRect(w * 0.08, h * 0.3, w * 0.38, h * 0.07);
    c.fillRect(w * 0.08, h * 0.4, w * 0.22, h * 0.05);
    c.fillStyle = 'rgba(23,23,23,0.12)';
    c.fillRect(w * 0.56, h * 0.3, w * 0.36, h * 0.28);
    c.restore();
    /* registration marks */
    c.save();
    c.strokeStyle = 'rgba(23,23,23,0.4)';
    c.lineWidth = 1.2;
    var marks = [
      [w * 0.05, h * 0.06],
      [w * 0.95, h * 0.06],
      [w * 0.05, h * 0.94],
      [w * 0.95, h * 0.94],
    ];
    for (var m = 0; m < marks.length; m++) {
      var mx = marks[m][0];
      var my = marks[m][1];
      c.beginPath();
      c.moveTo(mx - 9, my);
      c.lineTo(mx + 9, my);
      c.moveTo(mx, my - 9);
      c.lineTo(mx, my + 9);
      c.stroke();
    }
    c.restore();
    /* sliding black bar */
    c.save();
    c.fillStyle = 'rgba(23,23,23,0.95)';
    var slide = ((t * 0.12) % 1) * (w + 400) - 200;
    c.fillRect(slide, h * 0.72, 260, 8);
    c.restore();
  }

  /* ==================================================================
     Scene table
     ================================================================== */
  var SCENES = {
    classic: { draw: sceneClassic, grain: 0.05, vignette: 0.26, particle: 'dot', particleCount: 46, particleColor: 'rgba(60,48,32,0.9)', light: { x: 0.78, y: 0.05, r: 0.75, color: 'rgba(255,246,214,0.30)' } },
    school: { draw: sceneSchool, grain: 0.045, vignette: 0.22, particle: 'dot', particleCount: 40, particleColor: 'rgba(40,32,20,0.85)', light: { x: 0.2, y: 0.06, r: 0.7, color: 'rgba(255,252,232,0.26)' } },
    football: { draw: sceneFootball, grain: 0.05, vignette: 0.42, particle: 'dot', particleCount: 34, particleColor: 'rgba(236,248,255,0.8)', light: { x: 0.5, y: 0.12, r: 0.9, color: 'rgba(220,240,255,0.16)' } },
    galaxy: { draw: sceneGalaxy, grain: 0.06, vignette: 0.52, particle: 'dot', particleCount: 0, particleColor: 'rgba(255,255,255,0.9)', light: { x: 0.5, y: 0.45, r: 1, color: 'rgba(120,110,255,0.10)' } },
    cyber: { draw: sceneCyber, grain: 0.055, vignette: 0.5, particle: 'dot', particleCount: 30, particleColor: 'rgba(49,242,194,0.85)', light: { x: 0.5, y: 0.6, r: 0.85, color: 'rgba(49,242,194,0.12)' } },
    nature: { draw: sceneNature, grain: 0.04, vignette: 0.24, particle: 'leaf', particleCount: 26, particleColor: 'rgba(91,138,81,0.85)', light: { x: 0.3, y: 0.02, r: 0.8, color: 'rgba(255,252,214,0.22)' } },
    academia: { draw: sceneAcademia, grain: 0.06, vignette: 0.46, particle: 'dot', particleCount: 44, particleColor: 'rgba(255,224,170,0.9)', light: { x: 0.82, y: 0.86, r: 0.7, color: 'rgba(255,190,100,0.16)' } },
    ocean: { draw: sceneOcean, grain: 0.045, vignette: 0.46, particle: 'bubble', particleCount: 32, particleColor: 'rgba(190,244,255,0.9)', light: { x: 0.42, y: 0.0, r: 0.95, color: 'rgba(150,228,255,0.16)' } },
    sunset: { draw: sceneSunset, grain: 0.05, vignette: 0.4, particle: 'dot', particleCount: 40, particleColor: 'rgba(255,224,150,0.95)', light: { x: 0.5, y: 0.72, r: 0.85, color: 'rgba(255,170,90,0.18)' } },
    mono: { draw: sceneMono, grain: 0.05, vignette: 0.3, particle: 'dot', particleCount: 0, particleColor: 'rgba(30,30,30,0.4)', light: null },
    rose: { draw: sceneRose, grain: 0.05, vignette: 0.38, particle: 'petal', particleCount: 28, particleColor: 'rgba(240,196,196,0.9)', light: { x: 0.5, y: 0.82, r: 0.8, color: 'rgba(255,214,196,0.16)' } },
    golden: { draw: sceneGolden, grain: 0.055, vignette: 0.44, particle: 'dot', particleCount: 40, particleColor: 'rgba(255,226,160,0.95)', light: { x: 0.72, y: 0.05, r: 0.85, color: 'rgba(255,214,120,0.2)' } },
    metro: { draw: sceneMetro, grain: 0.03, vignette: 0.18, particle: 'dot', particleCount: 0, particleColor: 'rgba(22,119,210,0.6)', light: null },
    blueprint: { draw: sceneBlueprint, grain: 0.045, vignette: 0.4, particle: 'dot', particleCount: 0, particleColor: 'rgba(85,214,255,0.8)', light: { x: 0.25, y: 0.08, r: 0.8, color: 'rgba(85,214,255,0.1)' } },
    swiss: { draw: sceneSwiss, grain: 0.04, vignette: 0.26, particle: 'dot', particleCount: 0, particleColor: 'rgba(23,23,23,0.5)', light: null },
  };

  /* Particle behaviour per scene. */
  var PARTICLE_KIND = {
    classic: 'drift',
    school: 'drift',
    football: 'drift',
    galaxy: 'drift',
    cyber: 'drift',
    nature: 'fall',
    academia: 'rise',
    ocean: 'rise',
    sunset: 'drift',
    mono: 'drift',
    rose: 'fall',
    golden: 'rise',
    metro: 'drift',
    blueprint: 'drift',
    swiss: 'drift',
  };

  /* ------------------------------------------------------------------
     The layer
     ------------------------------------------------------------------ */
  var layer = null;
  var canvas = null;
  var ctx = null;
  var raf = 0;
  var running = false;
  var currentTheme = '';
  var startTime = 0;
  var lastFrame = 0;
  var acc = 0;
  var frameInterval = 1000 / 60;
  var scene = null;
  var spec = null;
  var quality = profile();
  var visible = true;
  var resizeTimer = 0;

  function activeTheme() {
    return root.getAttribute('data-store-theme') || 'classic';
  }

  function buildLayer() {
    if (layer && layer.isConnected) return layer;
    layer = document.createElement('div');
    layer.className = 'kk-cinematic-scene';
    layer.setAttribute('aria-hidden', 'true');
    canvas = document.createElement('canvas');
    canvas.className = 'kk-cinematic-scene__canvas';
    layer.appendChild(canvas);
    /* Sit in front of the theme background, behind the interface, and in
       front of the older particle layer so nothing is hidden by the art. */
    var particles = document.querySelector('.kk-theme-motion-particles');
    if (particles && particles.parentNode === body) body.insertBefore(layer, particles);
    else body.insertBefore(layer, body.firstChild);
    ctx = canvas.getContext('2d');
    try {
      root.classList.add('has-cinematic-scene');
    } catch (e) {}
    lastMode = '';
    applyMotionMode();
    return layer;
  }

  function removeLayer() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    running = false;
    if (layer && layer.isConnected) layer.parentNode.removeChild(layer);
    layer = null;
    canvas = null;
    ctx = null;
    scene = null;
    spec = null;
    currentTheme = '';
    try {
      root.classList.remove('has-cinematic-scene');
      root.removeAttribute('data-kk-cinematic-motion');
    } catch (e) {}
    lastMode = '';
  }

  function fit() {
    if (!canvas) return;
    quality = profile();
    var vw = window.innerWidth || document.documentElement.clientWidth || 1;
    var vh = window.innerHeight || document.documentElement.clientHeight || 1;
    var dpr = quality.dpr;
    var cw = Math.max(1, Math.round(vw * dpr * quality.scale));
    var ch = Math.max(1, Math.round(vh * dpr * quality.scale));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    frameInterval = 1000 / quality.fps;
    if (spec && spec.particleCount) {
      seedParticles(Math.max(6, Math.round(spec.particleCount * quality.particles)), PARTICLE_KIND[currentTheme] || 'drift', vw, vh);
    }
  }

  function render(t) {
    if (!ctx || !spec || !scene) return;
    var w = canvas.width;
    var h = canvas.height;
    var vw = window.innerWidth || 1;
    var vh = window.innerHeight || 1;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.scale(w / vw, h / vh);
    try {
      scene(ctx, vw, vh, t, quality);
      if (spec.particleCount) {
        stepParticles(1 / quality.fps, vw, vh, PARTICLE_KIND[currentTheme] || 'drift');
        paintParticles(ctx, spec.particle, spec.particleColor, t);
      }
      paintLight(ctx, vw, vh, spec.light, t);
      paintGrain(ctx, vw, vh, spec.grain, t);
      paintVignette(ctx, vw, vh, spec.vignette);
    } catch (e) {
      /* A broken scene must never take the application down. */
    }
    ctx.restore();
  }

  function paintOnce() {
    if (!spec || !scene) return;
    render(reduced() ? 4.5 : (startTime ? (Date.now() - startTime) / 1000 : 0));
  }

  function loop(now) {
    raf = 0;
    if (!running) return;
    if (!lastFrame) lastFrame = now;
    var dt = now - lastFrame;
    lastFrame = now;
    acc += dt;
    if (acc >= frameInterval) {
      acc = acc % frameInterval;
      render((now - startTime) / 1000);
    }
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = Date.now();
    lastFrame = 0;
    acc = 0;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function applyTheme(theme) {
    var next = theme || 'classic';
    if (next === currentTheme) {
      /* Same theme. Only the motion profile can have changed, so the
         running state is refreshed without rebuilding the artwork. */
      if (spec) {
        if (reduced()) {
          stop();
          paintOnce();
        } else if (!running) {
          fit();
          start();
        }
      }
      return;
    }
    currentTheme = next;
    if (EXTERNAL[next] || !SCENES[next]) {
      removeLayer();
      return;
    }
    spec = SCENES[next];
    scene = spec.draw;
    buildLayer();
    fit();
    if (reduced()) {
      stop();
      paintOnce();
    } else {
      start();
    }
  }

  /* ------------------------------------------------------------------
     Wiring
     ------------------------------------------------------------------ */
  var themeObserver = null;
  try {
    themeObserver = new MutationObserver(function () {
      applyTheme(activeTheme());
    });
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ['data-store-theme', 'data-kk-desktop-theme-motion'],
    });
  } catch (e) {}

  window.addEventListener(
    'resize',
    function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!spec) return;
        fit();
        if (reduced()) paintOnce();
      }, 180);
    },
    { passive: true },
  );

  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden;
    if (!spec) return;
    if (!visible) {
      stop();
    } else if (reduced()) {
      paintOnce();
    } else {
      start();
    }
  });

  /* Motion preferences can change while the page is open. */
  try {
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', function () {
        if (!spec) return;
        if (reduced()) {
          stop();
          paintOnce();
        } else {
          start();
        }
      });
    }
  } catch (e) {}

  /* The in-app motion profile also changes at runtime. */
  var lastReduced = reduced();
  try {
    var bodyObserver = new MutationObserver(function () {
      if (!spec) return;
      var wasReduced = lastReduced;
      lastReduced = reduced();
      if (wasReduced !== lastReduced) {
        if (lastReduced) {
          stop();
          paintOnce();
        } else {
          fit();
          start();
        }
      } else if (!running && !lastReduced) {
        fit();
        start();
      }
    });
    bodyObserver.observe(body, { attributes: true, attributeFilter: ['class'] });
  } catch (e) {}

  /* Boot */
  applyTheme(activeTheme());

  window.KashKoolCinematicThemes = {
    refresh: function () {
      /* Force a rebuild so a changed motion profile takes effect at once. */
      currentTheme = '';
      applyTheme(activeTheme());
    },
    isActive: function () {
      return !!(spec && running);
    },
  };
})();
