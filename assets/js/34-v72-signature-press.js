/* ================================================================
   KASHKOOL v72 — THE PRESS MARK

   Every theme in KashKool answers a click in its own language.
   Skybreaker answers with a slash, The Lost Chapter with a printed
   ink splash, Emberfire with a burst of embers. This file gives the
   remaining themes the same answer.

   A press anywhere in the interface paints one short mark on a
   canvas that sits above the interface and below the toasts. The
   shape of the mark belongs to the theme; its colour is the theme's
   own signature colour published by kashkool-v73.css as
   --kk-signature, so the mark always speaks with the identity of
   the theme you are wearing.

   The mark is drawn, never simulated: no sprites, no images, no
   network. It costs one canvas and one rAF loop that stops the
   moment the last mark fades out.
   ================================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  if (!root || !body) return;

  /* Fallback identity colours, used only if the stylesheet has not
     loaded yet. They match kashkool-v73.css exactly. */
  var FALLBACK = {
    classic: '#a8791f',
    school: '#b2472e',
    football: '#4fae6a',
    galaxy: '#8b7cff',
    cyber: '#31f2c2',
    nature: '#5b8a51',
    academia: '#a7753e',
    ocean: '#2e9fb8',
    sunset: '#ffad5b',
    mono: '#232326',
    frost: '#4a7a93',
    rose: '#9c5a4c',
    golden: '#f4a900',
    metro: '#1677d2',
    blueprint: '#55d6ff',
    swiss: '#e53935',
    fire: '#ef7138',
    anime: '#ff5576',
    manga: '#9a4033',
  };

  var layer = null;
  var canvas = null;
  var ctx = null;
  var dpr = 1;
  var raf = 0;
  var running = false;
  var bursts = [];
  var uid = 0;

  function rand(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function clamp(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }
  function rgba(hex, a) {
    var h = String(hex || '#888888').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var num = parseInt(h, 16);
    if (isNaN(num)) num = 0x888888;
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  function currentTheme() {
    return root.getAttribute('data-store-theme') || 'classic';
  }
  function signature(theme) {
    try {
      var v = getComputedStyle(root).getPropertyValue('--kk-signature');
      if (v && v.trim()) return v.trim();
    } catch (e) {}
    return FALLBACK[theme] || '#a8791f';
  }
  function compact() {
    return (window.innerWidth || 0) < 760;
  }
  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------
     The layer
     ------------------------------------------------------------------ */
  function ensureLayer() {
    if (layer && layer.isConnected) return layer;
    layer = document.createElement('div');
    layer.className = 'kk-signature-layer';
    layer.setAttribute('aria-hidden', 'true');
    canvas = document.createElement('canvas');
    canvas.className = 'kk-signature-layer__canvas';
    layer.appendChild(canvas);
    body.appendChild(layer);
    ctx = canvas.getContext('2d');
    resize();
    return layer;
  }

  function resize() {
    if (!canvas) return;
    var vw = window.innerWidth || document.documentElement.clientWidth || 1;
    var vh = window.innerHeight || document.documentElement.clientHeight || 1;
    dpr = Math.min(window.devicePixelRatio || 1, compact() ? 1.5 : 2);
    var cw = Math.max(1, Math.round(vw * dpr));
    var ch = Math.max(1, Math.round(vh * dpr));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }

  /* ------------------------------------------------------------------
     The marks — one shape per theme
     Each function receives the context, the press point, the radius,
     the progress of the mark (0 → 1) and the signature colour.
     ------------------------------------------------------------------ */
  var MARKS = {
    /* CLASSIC — a drop of fountain-pen ink, then a brass ring */
    classic: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.globalCompositeOperation = 'multiply';
      for (var i = 0; i < 7; i++) {
        var a = (i / 7) * Math.PI * 2 + 0.4;
        var d = r * 0.16 * (1 - p);
        var rr = r * (0.16 + 0.13 * Math.sin(p * Math.PI)) * (0.7 + rand(i * 3.1) * 0.6);
        c.beginPath();
        c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, rr, 0, Math.PI * 2);
        c.fillStyle = rgba('#262c38', 0.16 * fade);
        c.fill();
      }
      c.restore();
      c.beginPath();
      c.arc(x, y, r * (0.2 + p * 0.75), 0, Math.PI * 2);
      c.strokeStyle = rgba(col, 0.5 * fade);
      c.lineWidth = Math.max(1, r * 0.035);
      c.stroke();
    },

    /* SCHOOL — the red margin rule with a blue pen tick */
    school: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.strokeStyle = rgba(col, 0.6 * fade);
      c.lineWidth = Math.max(1.5, r * 0.05);
      c.setLineDash([r * 0.18, r * 0.12]);
      c.beginPath();
      c.moveTo(x, y - r * 0.95);
      c.lineTo(x, y + r * 0.95);
      c.stroke();
      c.restore();
      c.beginPath();
      c.moveTo(x - r * 0.55, y + r * 0.42);
      c.lineTo(x + r * 0.3, y + r * 0.42);
      c.strokeStyle = rgba('#2f6ba8', 0.55 * fade);
      c.lineWidth = Math.max(1.5, r * 0.055);
      c.stroke();
      c.beginPath();
      c.arc(x, y, r * 0.1 * (1 - p), 0, Math.PI * 2);
      c.fillStyle = rgba(col, 0.35 * fade);
      c.fill();
    },

    /* FOOTBALL — the shock of a struck ball and a spray of turf */
    football: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.beginPath();
      c.arc(x, y, r * (0.18 + p * 0.8), 0, Math.PI * 2);
      c.strokeStyle = rgba(col, 0.62 * fade);
      c.lineWidth = Math.max(1.5, r * 0.06 * fade + 1);
      c.stroke();
      for (var i = 0; i < 14; i++) {
        var a = (i / 14) * Math.PI * 2 + rand(i) * 0.6;
        var d = r * (0.2 + p * 0.85);
        c.beginPath();
        c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.035 * fade + 0.6, 0, Math.PI * 2);
        c.fillStyle = rgba('#e9f7ee', 0.65 * fade);
        c.fill();
      }
    },

    /* GALAXY — a small nebula turning open */
    galaxy: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.translate(x, y);
      c.rotate(p * 1.5);
      for (var i = 0; i < 46; i++) {
        var a = (i / 46) * Math.PI * 4 + p * 2.4;
        var d = r * 0.85 * ((i / 46) * (0.25 + p * 0.85));
        var s = 0.03 * r * fade * (1.6 - i / 46);
        c.beginPath();
        c.arc(Math.cos(a) * d, Math.sin(a) * d * 0.62, Math.max(0.5, s), 0, Math.PI * 2);
        c.fillStyle = rgba(i % 7 === 0 ? '#ff6db5' : col, 0.7 * fade);
        c.fill();
      }
      c.restore();
    },

    /* CYBER — a frame that tears itself apart */
    cyber: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      for (var i = 0; i < 6; i++) {
        var h = r * (0.05 + rand(i * 5.7) * 0.1);
        var w = r * (0.5 + rand(i * 2.3) * 0.9);
        var off = (rand(i * 9.1) - 0.5) * r * 1.4 * p;
        var yy = y + (i - 2.5) * r * 0.19;
        c.fillStyle = rgba(i % 3 === 0 ? '#ff4f9a' : col, 0.5 * fade);
        c.fillRect(x - w / 2 + off, yy, w, h);
      }
      c.strokeStyle = rgba(col, 0.45 * fade);
      c.lineWidth = 1;
      c.strokeRect(x - r * 0.6, y - r * 0.5, r * 1.2, r);
    },

    /* NATURE — leaves let go of the branch */
    nature: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      for (var i = 0; i < 11; i++) {
        var a = (i / 11) * Math.PI * 2 + rand(i) * 0.7;
        var d = r * (0.15 + p * 0.95);
        var lx = x + Math.cos(a) * d;
        var ly = y + Math.sin(a) * d + p * p * r * 0.35;
        var rot = a + p * 4;
        c.save();
        c.translate(lx, ly);
        c.rotate(rot);
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(r * 0.1, -r * 0.13, 0, -r * 0.26);
        c.quadraticCurveTo(-r * 0.1, -r * 0.13, 0, 0);
        c.fillStyle = rgba(col, 0.6 * fade);
        c.fill();
        c.restore();
      }
    },

    /* ACADEMIA — ink from the nib and the wax of a seal */
    academia: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.beginPath();
      c.arc(x, y, r * (0.1 + p * 0.55), 0, Math.PI * 2);
      c.fillStyle = rgba('#2f241c', 0.3 * fade);
      c.fill();
      c.restore();
      c.beginPath();
      var spikes = 16;
      for (var i = 0; i <= spikes; i++) {
        var a = (i / spikes) * Math.PI * 2;
        var rr = r * (0.42 + 0.05 * Math.sin(a * 5)) * (0.6 + p * 0.6);
        var px = x + Math.cos(a) * rr;
        var py = y + Math.sin(a) * rr;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.strokeStyle = rgba('#8d443a', 0.7 * fade);
      c.lineWidth = Math.max(1.5, r * 0.05);
      c.stroke();
      c.beginPath();
      c.arc(x, y, r * 0.2 * (1 - p * 0.6), 0, Math.PI * 2);
      c.fillStyle = rgba(col, 0.55 * fade);
      c.fill();
    },

    /* OCEAN — air that breaks the surface */
    ocean: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      for (var i = 0; i < 13; i++) {
        var ox = (rand(i * 3.7) - 0.5) * r * 1.1;
        var oy = (rand(i * 8.2) - 0.5) * r * 0.8;
        var rise = p * r * 0.8;
        var rad = r * (0.05 + rand(i * 5.3) * 0.09) * (1 + p * 0.5);
        var bx = x + ox + Math.sin(p * 5 + i) * r * 0.08;
        var by = y + oy - rise;
        c.beginPath();
        c.arc(bx, by, rad, 0, Math.PI * 2);
        c.strokeStyle = rgba(i % 4 === 0 ? '#6fd6c4' : col, 0.55 * fade);
        c.lineWidth = Math.max(1, rad * 0.22);
        c.stroke();
      }
      c.beginPath();
      c.arc(x, y, r * (0.2 + p * 0.55), 0, Math.PI * 2);
      c.strokeStyle = rgba(col, 0.3 * fade);
      c.lineWidth = 1.5;
      c.stroke();
    },

    /* SUNSET — embers rising off the page */
    sunset: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      for (var i = 0; i < 26; i++) {
        var a = -Math.PI / 2 + (rand(i * 2.9) - 0.5) * 2.4;
        var d = r * (0.1 + rand(i * 4.4) * 0.5) + p * r * 0.7;
        var ex = x + Math.cos(a) * d;
        var ey = y + Math.sin(a) * d - p * p * r * 0.4;
        var s = r * 0.028 * fade * (0.5 + rand(i));
        c.beginPath();
        c.arc(ex, ey, Math.max(0.5, s), 0, Math.PI * 2);
        c.fillStyle = rgba(i % 5 === 0 ? '#ff6f8e' : col, 0.75 * fade);
        c.fill();
      }
    },

    /* MONO — carbon smudge and the red stamp of the studio */
    mono: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      var g = c.createRadialGradient(x, y, 0, x, y, r * 0.9);
      g.addColorStop(0, rgba('#232326', 0.34 * fade));
      g.addColorStop(1, rgba('#232326', 0));
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, r * 0.9, 0, Math.PI * 2);
      c.fill();
      var s = r * (0.18 + 0.5 * Math.sin(Math.min(1, p * 2.2) * Math.PI * 0.5));
      c.strokeStyle = rgba('#d93b32', 0.8 * fade);
      c.lineWidth = Math.max(1.5, r * 0.06);
      c.strokeRect(x - s, y - s, s * 2, s * 2);
      c.beginPath();
      c.arc(x, y, r * 0.06 * fade, 0, Math.PI * 2);
      c.fillStyle = rgba(col, 0.8 * fade);
      c.fill();
    },

    /* FROST — a crystal that grows in the cold */
    frost: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      var grow = Math.min(1, p * 1.8);
      c.save();
      c.translate(x, y);
      c.strokeStyle = rgba(col, 0.7 * fade);
      c.lineWidth = Math.max(1, r * 0.03);
      for (var i = 0; i < 6; i++) {
        var a = (i / 6) * Math.PI * 2;
        var ex = Math.cos(a) * r * 0.85 * grow;
        var ey = Math.sin(a) * r * 0.85 * grow;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(ex, ey);
        c.stroke();
        c.beginPath();
        c.moveTo(ex * 0.62, ey * 0.62);
        c.lineTo(ex * 0.62 - Math.cos(a - 0.6) * r * 0.2 * grow, ey * 0.62 - Math.sin(a - 0.6) * r * 0.2 * grow);
        c.stroke();
      }
      c.restore();
    },

    /* ROSE — petals that let go */
    rose: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      for (var i = 0; i < 10; i++) {
        var a = (i / 10) * Math.PI * 2 + rand(i) * 0.5;
        var d = r * (0.12 + p * 0.95);
        var px = x + Math.cos(a) * d;
        var py = y + Math.sin(a) * d * 0.9 + p * p * r * 0.3;
        c.save();
        c.translate(px, py);
        c.rotate(a + p * 3.4);
        c.beginPath();
        c.ellipse(0, 0, r * 0.16 * fade, r * 0.09 * fade, 0, 0, Math.PI * 2);
        c.fillStyle = rgba(i % 3 === 0 ? '#c98f88' : col, 0.65 * fade);
        c.fill();
        c.restore();
      }
    },

    /* GOLDEN — dust in a shaft of late light */
    golden: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      for (var i = 0; i < 32; i++) {
        var a = (rand(i * 3.3) - 0.5) * 2.2;
        var d = r * rand(i * 7.1) * 0.9;
        var dx = x + Math.cos(a) * d;
        var dy = y + Math.sin(a) * d - p * r * 0.9;
        var s = r * 0.02 * fade * (0.4 + rand(i * 2.2) * 1.4);
        c.beginPath();
        c.arc(dx, dy, Math.max(0.5, s), 0, Math.PI * 2);
        c.fillStyle = rgba(col, 0.8 * fade);
        c.fill();
      }
      c.save();
      c.globalCompositeOperation = 'lighter';
      var g = c.createRadialGradient(x, y, 0, x, y, r * 0.8);
      g.addColorStop(0, rgba(col, 0.22 * fade));
      g.addColorStop(1, rgba(col, 0));
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, r * 0.8, 0, Math.PI * 2);
      c.fill();
      c.restore();
    },

    /* METRO — the platform ping and the line that runs through it */
    metro: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      for (var k = 0; k < 2; k++) {
        c.beginPath();
        c.arc(x, y, r * (0.2 + p * 0.8 + k * 0.18), 0, Math.PI * 2);
        c.strokeStyle = rgba(k === 0 ? '#d9503f' : col, (0.55 - k * 0.18) * fade);
        c.lineWidth = Math.max(1.5, r * 0.05);
        c.stroke();
      }
      c.beginPath();
      c.moveTo(x - r, y);
      c.lineTo(x + r, y);
      c.strokeStyle = rgba(col, 0.6 * fade);
      c.lineWidth = Math.max(2, r * 0.06);
      c.stroke();
      c.beginPath();
      c.arc(x, y, r * 0.1, 0, Math.PI * 2);
      c.fillStyle = rgba('#f6f8fb', 0.9 * fade);
      c.fill();
      c.strokeStyle = rgba('#d9503f', 0.9 * fade);
      c.lineWidth = Math.max(1.5, r * 0.045);
      c.stroke();
    },

    /* BLUEPRINT — the drafting marks around the point */
    blueprint: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.strokeStyle = rgba(col, 0.65 * fade);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x - r, y);
      c.lineTo(x + r, y);
      c.moveTo(x, y - r);
      c.lineTo(x, y + r);
      c.stroke();
      c.setLineDash([r * 0.1, r * 0.09]);
      c.beginPath();
      c.arc(x, y, r * (0.2 + p * 0.65), 0, Math.PI * 2);
      c.stroke();
      c.setLineDash([]);
      for (var i = 0; i < 8; i++) {
        var a = (i / 8) * Math.PI * 2;
        var rr = r * (0.2 + p * 0.65);
        c.beginPath();
        c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        c.lineTo(x + Math.cos(a) * (rr + r * 0.12), y + Math.sin(a) * (rr + r * 0.12));
        c.stroke();
      }
    },

    /* SWISS — one bold slash and one black rule */
    swiss: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.strokeStyle = rgba(col, 0.8 * fade);
      c.lineWidth = Math.max(3, r * 0.12);
      c.lineCap = 'square';
      var len = r * (0.4 + p * 0.8);
      c.beginPath();
      c.moveTo(x - len * 0.6, y + len * 0.6);
      c.lineTo(x + len * 0.6, y - len * 0.6);
      c.stroke();
      c.restore();
      c.beginPath();
      c.moveTo(x - r * 0.85, y + r * 0.75);
      c.lineTo(x + r * 0.85 * (0.2 + p * 0.8), y + r * 0.75);
      c.strokeStyle = rgba('#1a1a1e', 0.65 * fade);
      c.lineWidth = Math.max(2, r * 0.08);
      c.stroke();
    },

    /* FIRE — embers bursting out of the charcoal */
    fire: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.globalCompositeOperation = 'lighter';
      var g = c.createRadialGradient(x, y, 0, x, y, r * 0.8);
      g.addColorStop(0, rgba('#ffc17a', 0.4 * fade));
      g.addColorStop(0.5, rgba(col, 0.18 * fade));
      g.addColorStop(1, rgba(col, 0));
      c.fillStyle = g;
      c.beginPath();
      c.arc(x, y, r * 0.8, 0, Math.PI * 2);
      c.fill();
      c.restore();
      for (var i = 0; i < 22; i++) {
        var a = -Math.PI / 2 + (rand(i * 2.7) - 0.5) * 3;
        var d = r * (0.12 + p * 1.05);
        var ex = x + Math.cos(a) * d;
        var ey = y + Math.sin(a) * d - p * p * r * 0.25;
        var s = r * 0.035 * fade * (0.4 + rand(i * 5.5));
        c.beginPath();
        c.arc(ex, ey, Math.max(0.5, s), 0, Math.PI * 2);
        c.fillStyle = rgba(i % 4 === 0 ? '#ffc17a' : col, 0.8 * fade);
        c.fill();
      }
    },

    /* ANIME — speed lines converging on the strike */
    anime: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.strokeStyle = rgba(col, 0.55 * fade);
      c.lineCap = 'round';
      for (var i = 0; i < 16; i++) {
        var a = (i / 16) * Math.PI * 2 + rand(i) * 0.2;
        var inner = r * (0.5 + rand(i * 3.1) * 0.4) * p;
        var outer = inner + r * (0.2 + rand(i * 6.3) * 0.65);
        c.lineWidth = Math.max(1, r * 0.035 * fade);
        c.beginPath();
        c.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
        c.lineTo(x + Math.cos(a) * outer, y + Math.sin(a) * outer);
        c.stroke();
      }
      c.restore();
      c.beginPath();
      c.arc(x, y, r * (0.1 + p * 0.55), 0, Math.PI * 2);
      c.strokeStyle = rgba('#ffffff', 0.6 * fade);
      c.lineWidth = Math.max(1.5, r * 0.05);
      c.stroke();
    },

    /* MANGA — printed ink thrown across the page */
    manga: function (c, x, y, r, p, col) {
      var fade = 1 - p;
      c.save();
      c.beginPath();
      var pts = 11;
      for (var i = 0; i <= pts; i++) {
        var a = (i / pts) * Math.PI * 2;
        var rr = r * (0.3 + rand(i * 4.9) * 0.42) * (0.5 + p * 0.8);
        var px = x + Math.cos(a) * rr;
        var py = y + Math.sin(a) * rr * 0.86;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fillStyle = rgba(col, 0.32 * fade);
      c.fill();
      c.strokeStyle = rgba('#2b2a30', 0.55 * fade);
      c.lineWidth = Math.max(1, r * 0.03);
      c.stroke();
      c.restore();
      for (var k = 0; k < 18; k++) {
        var ang = rand(k * 7.7) * Math.PI * 2;
        var dist = r * (0.45 + rand(k * 3.3) * 0.7) * (0.4 + p * 0.8);
        c.beginPath();
        c.arc(x + Math.cos(ang) * dist, y + Math.sin(ang) * dist * 0.9, r * 0.022 * fade + 0.5, 0, Math.PI * 2);
        c.fillStyle = rgba('#2b2a30', 0.55 * fade);
        c.fill();
      }
    },
  };

  /* ------------------------------------------------------------------
     The loop
     ------------------------------------------------------------------ */
  function frame(now) {
    if (!ctx) return;
    var w = canvas.width;
    var h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var alive = [];
    for (var i = 0; i < bursts.length; i++) {
      var b = bursts[i];
      var p = clamp((now - b.t0) / b.dur, 0, 1);
      if (p < 1) alive.push(b);
      var mark = MARKS[b.theme];
      if (!mark) continue;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.globalAlpha = 1;
      try {
        mark(ctx, b.x, b.y, b.r, p, b.col);
      } catch (e) {}
      ctx.restore();
    }
    bursts = alive;
    if (bursts.length) {
      raf = requestAnimationFrame(frame);
    } else {
      raf = 0;
      running = false;
      if (ctx) ctx.clearRect(0, 0, w, h);
    }
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function paint(x, y) {
    if (reducedMotion()) {
      /* A single quiet ring instead of a full mark. */
      ensureLayer();
      var th = currentTheme();
      bursts.push({
        theme: th,
        x: x,
        y: y,
        r: compact() ? 30 : 44,
        t0: performance.now(),
        dur: 420,
        col: signature(th),
        static: true,
      });
      start();
      return;
    }
    ensureLayer();
    var theme = currentTheme();
    var col = signature(theme);
    var now = performance.now();
    for (var i = 0; i < bursts.length; i++) {
      if (now - bursts[i].t0 < 90) bursts.splice(i, 1);
    }
    bursts.push({
      theme: theme,
      x: x,
      y: y,
      r: compact() ? 58 : 92,
      t0: now,
      dur: compact() ? 540 : 820,
      col: col,
    });
    start();
  }

  function onPointerDown(e) {
    if (!e.isTrusted) return;
    var t = e.target;
    if (t && t.closest && t.closest('.kk-signature-layer')) return;
    var x = e.clientX;
    var y = e.clientY;
    if (typeof x !== 'number' || typeof y !== 'number') return;
    /* The store and the theme picker are dense with small targets; the
       mark is welcome there too, so no target is excluded. */
    paint(x, y);
  }

  function onResize() {
    resize();
  }

  function onVisibility() {
    if (document.hidden) {
      bursts = [];
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      running = false;
    }
  }

  function boot() {
    if (layer) return;
    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
