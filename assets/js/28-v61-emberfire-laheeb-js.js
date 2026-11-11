/* ================================================================
   JS 29/29 · Themes & store · kashkool-v61-emberfire-laheeb
   Ambient canvas is active only while Emberfire is selected.
   ================================================================ */
(function () {
  'use strict';
  if (window.__KK_EMBERFIRE_V61) return;
  window.__KK_EMBERFIRE_V61 = true;

  var root = document.documentElement;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext && canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  canvas.className = 'kk-fire-ambience';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('role', 'presentation');
  document.body.insertBefore(canvas, document.body.firstChild);

  var width = 0, height = 0, dpr = 1, rafId = 0, active = false, last = 0;
  var tongues = [], embers = [];
  function readReduceMotion() {
    var desktopThemeMotion = root.getAttribute('data-kk-desktop-theme-motion') === 'full';
    return !desktopThemeMotion && (
      !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      document.body.classList.contains('reduce-motion') ||
      document.body.classList.contains('motion-ultra')
    );
  }
  var reduceMotion = readReduceMotion();
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function rand(seed) {
    var v = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return v - Math.floor(v);
  }
  function resize() {
    width = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    height = Math.max(110, Math.min(275, Math.round(window.innerHeight * (width < 700 ? .21 : .25))));
    dpr = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tongues = [];
    var count = Math.max(22, Math.min(54, Math.round(width / 25)));
    for (var i = 0; i < count; i++) {
      tongues.push({
        x: (i + .5) / count,
        w: 9 + rand(i + 4) * (width < 700 ? 25 : 42),
        h: 42 + rand(i + 29) * (width < 700 ? 76 : 125),
        phase: rand(i + 67) * Math.PI * 2,
        speed: .0013 + rand(i + 91) * .0019,
        skew: (rand(i + 113) - .5) * 25
      });
    }
    embers = [];
    for (var j = 0; j < 34; j++) {
      embers.push({ x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0, age: 1, life: 1, size: 1.2 + Math.random() * 2.5 });
    }
  }
  function flamePath(x, base, w, h, lean, t) {
    ctx.beginPath();
    ctx.moveTo(x - w * .52, base);
    ctx.bezierCurveTo(x - w * .78 + lean * .2, base - h * .28, x - w * .2 - lean, base - h * .63, x + lean, base - h);
    ctx.bezierCurveTo(x + w * .08 + lean * .5, base - h * .64, x + w * .78 + lean, base - h * .32, x + w * .5, base);
    ctx.closePath();
  }
  function paint(now) {
    if (!width || !height) return;
    var seconds = now || 0;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    var baseGlow = ctx.createLinearGradient(0, height, 0, height - 112);
    baseGlow.addColorStop(0, 'rgba(220,61,23,.28)');
    baseGlow.addColorStop(.35, 'rgba(193,53,24,.15)');
    baseGlow.addColorStop(1, 'rgba(150,40,20,0)');
    ctx.fillStyle = baseGlow;
    ctx.fillRect(0, height - 112, width, 112);

    for (var i = 0; i < tongues.length; i++) {
      var f = tongues[i];
      var wave = Math.sin(seconds * f.speed + f.phase);
      var flicker = .68 + .32 * Math.sin(seconds * (f.speed * 1.7) + f.phase * 1.4);
      var x = f.x * width + wave * 9;
      var h = f.h * flicker;
      var w = f.w * (.78 + .22 * Math.cos(seconds * f.speed * 1.2 + f.phase));
      var lean = wave * 15 + f.skew;
      flamePath(x, height + 6, w, h, lean, seconds);
      var grad = ctx.createLinearGradient(x, height + 4, x + lean, height - h);
      grad.addColorStop(0, 'rgba(255,190,104,.02)');
      grad.addColorStop(.12, 'rgba(255,128,48,.72)');
      grad.addColorStop(.48, 'rgba(235,69,26,.54)');
      grad.addColorStop(1, 'rgba(205,54,24,0)');
      ctx.fillStyle = grad;
      ctx.globalAlpha = .48 + .34 * flicker;
      ctx.shadowColor = 'rgba(245,82,31,.30)';
      ctx.shadowBlur = 8;
      ctx.fill();

      /* A smaller gold core gives the flame its layered, hand-painted look. */
      if (i % 2 === 0) {
        flamePath(x + lean * .08, height + 3, w * .36, h * .56, lean * .34, seconds);
        var core = ctx.createLinearGradient(x, height, x + lean * .3, height - h * .56);
        core.addColorStop(0, 'rgba(255,207,128,.0)');
        core.addColorStop(.18, 'rgba(255,173,82,.52)');
        core.addColorStop(1, 'rgba(255,197,126,0)');
        ctx.fillStyle = core;
        ctx.globalAlpha = .6;
        ctx.shadowBlur = 3;
        ctx.fill();
      }
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    for (var e = 0; e < embers.length; e++) {
      var p = embers[e];
      if (p.age >= p.life) {
        p.x = Math.random() * width;
        p.y = height - Math.random() * 10;
        p.vx = (Math.random() - .5) * 20;
        p.vy = -(24 + Math.random() * 68);
        p.age = 0;
        p.life = 1.1 + Math.random() * 2.3;
        p.size = 1 + Math.random() * 2.5;
      }
      var dt = Math.min(.034, last ? Math.max(0, (now - last) / 1000) : .016);
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      var alpha = Math.max(0, 1 - p.age / p.life);
      ctx.globalAlpha = alpha * .76;
      ctx.fillStyle = e % 3 === 0 ? '#ffe0a3' : '#ff8b49';
      ctx.shadowColor = '#f35d2b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (.55 + alpha * .45), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  function frame(now) {
    if (!active || document.visibilityState === 'hidden') {
      rafId = 0;
      return;
    }
    paint(now);
    last = now;
    rafId = window.requestAnimationFrame(frame);
  }
  function isFire() { return root.getAttribute('data-store-theme') === 'fire'; }
  function sync() {
    var shouldRun = isFire() && document.visibilityState !== 'hidden';
    canvas.hidden = !isFire();
    if (shouldRun && !active) {
      active = true;
      resize();
      if (reduceMotion) {
        paint(0);
        active = false;
        return;
      }
      last = 0;
      if (!rafId) rafId = window.requestAnimationFrame(frame);
    } else if (!shouldRun) {
      active = false;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      last = 0;
    } else if (shouldRun && reduceMotion) {
      paint(0);
    }
  }
  var observer = new MutationObserver(sync);
  observer.observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
  window.addEventListener('resize', function () { if (isFire()) { resize(); if (reduceMotion) paint(0); } }, { passive: true });
  document.addEventListener('visibilitychange', sync);
  if (motionQuery) {
    var motionChange = function () { reduceMotion = readReduceMotion(); sync(); };
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', motionChange);
    else if (motionQuery.addListener) motionQuery.addListener(motionChange);
  }
  /* Observe app motion settings and the desktop-only parity switch. */
  var motionClassObserver = new MutationObserver(function () {
    var next = readReduceMotion();
    if (next !== reduceMotion) { reduceMotion = next; sync(); }
  });
  motionClassObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  var motionBridgeObserver = new MutationObserver(function () {
    var next = readReduceMotion();
    if (next !== reduceMotion) { reduceMotion = next; sync(); }
  });
  motionBridgeObserver.observe(root, { attributes: true, attributeFilter: ['data-kk-desktop-theme-motion'] });
  sync();

  /* Short flame bursts are visual-only and never intercept input. */
  function getControl(target) {
    if (!target || !target.closest) return null;
    return target.closest('button:not(:disabled),[role="button"],.linkbtn,.fchip,.day__add,a[href]');
  }
  function burst(button) {
    if (!isFire() || reduceMotion || !button || !button.isConnected) return;
    var rect = button.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var w = Math.min(190, Math.max(100, rect.width + 54));
    var h = Math.min(138, Math.max(88, rect.height + 56));
    var layer = document.createElement('span');
    layer.className = 'kk-fire-button-burst';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.left = (rect.left + rect.width / 2 - w / 2) + 'px';
    layer.style.top = (rect.top + rect.height / 2 - h / 2) + 'px';
    layer.style.width = w + 'px';
    layer.style.height = h + 'px';
    var count = window.innerWidth < 600 ? 6 : 9;
    for (var i = 0; i < count; i++) {
      var tongue = document.createElement('i');
      tongue.className = 'kk-fire-button-tongue';
      tongue.style.setProperty('--fx', (4 + i * (90 / Math.max(1, count - 1))) + '%');
      tongue.style.setProperty('--fw', (10 + Math.random() * 12) + '%');
      tongue.style.setProperty('--fh', (54 + Math.random() * 44) + '%');
      tongue.style.setProperty('--fr', ((Math.random() - .5) * 34) + 'deg');
      tongue.style.setProperty('--fd', (Math.random() * 90) + 'ms');
      layer.appendChild(tongue);
    }
    document.body.appendChild(layer);
    window.setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 980);
  }
  document.addEventListener('pointerdown', function (ev) {
    if (!isFire() || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
    burst(getControl(ev.target));
  }, true);
  document.addEventListener('click', function (ev) {
    if (ev.detail !== 0 || !isFire()) return; /* Keyboard / assistive-technology activation. */
    burst(getControl(ev.target));
  }, true);
})();
