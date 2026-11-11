/* ==============================================================
   JS 25/28 · Themes & store · kashkool-frost-theme-v2-js · 1.8 KB
   ============================================================== */
(function () {
  'use strict';
  var root = document.documentElement,
    active = false,
    timer = null,
    layer = null;
  var symbols = ['❄', '✧', '❅', '·'];
  function clear() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (layer) {
      layer.remove();
      layer = null;
    }
    active = false;
  }
  function spawn() {
    if (!layer || document.hidden || !root.isConnected) return;
    var flake = document.createElement('span');
    flake.className = 'kk-frost-flake';
    flake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.fontSize = 8 + Math.random() * 12 + 'px';
    flake.style.setProperty('--fall-time', 10 + Math.random() * 9 + 's');
    flake.style.setProperty('--fall-delay', '0s');
    flake.style.setProperty('--drift', -35 + Math.random() * 70 + 'px');
    layer.appendChild(flake);
    flake.addEventListener(
      'animationend',
      function () {
        flake.remove();
      },
      { once: true },
    );
  }
  function sync() {
    var wants =
      root.getAttribute('data-store-theme') === 'frost' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (wants && !active) {
      active = true;
      layer = document.createElement('div');
      layer.id = 'kk-frost-snow-layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = 'position:fixed;inset:0;z-index:29;pointer-events:none;overflow:hidden';
      document.body.appendChild(layer);
      for (var i = 0; i < 5; i++) setTimeout(spawn, i * 420);
      timer = setInterval(spawn, 1800);
    } else if (!wants && active) {
      clear();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync, { once: true });
  else sync();
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) sync();
  });
})();
