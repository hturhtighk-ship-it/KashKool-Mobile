/* ==============================================================
   JS 10/28 · Visual refinement · kashkool-visual-v9-js · 2.3 KB
   ============================================================== */
(function () {
  if (window.__kashkoolV9) return;
  window.__kashkoolV9 = true;
  function reduced() {
    return (
      document.body.classList.contains('reduce-motion') || document.body.classList.contains('motion-ultra')
    );
  }

  /* Reading progress uses transform so it stays cheap during scroll. */
  var track = document.createElement('div');
  track.className = 'kk9-scrollTrack';
  track.setAttribute('aria-hidden', 'true');
  var fill = document.createElement('div');
  fill.className = 'kk9-scrollFill';
  track.appendChild(fill);
  document.body.appendChild(track);
  var raf = 0;
  function updateScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      var doc = document.documentElement,
        max = Math.max(1, doc.scrollHeight - window.innerHeight);
      var p = Math.max(0, Math.min(1, (window.scrollY || window.pageYOffset || 0) / max));
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    });
  }
  addEventListener('scroll', updateScroll, { passive: true });
  addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  /* Pointer tilt: one shared listener, only when the user actually hovers a card. */
  if (!reduced() && matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var selector =
      '.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.studyProgress,.progressInsight,.notecard,.sub,.linkitem,.notice';
    var active = null;
    document.addEventListener(
      'pointermove',
      function (e) {
        var el = e.target.closest && e.target.closest(selector);
        if (active && active !== el) {
          active.style.setProperty('--kk9-rx', '0deg');
          active.style.setProperty('--kk9-ry', '0deg');
        }
        active = el || null;
        if (!el) return;
        var r = el.getBoundingClientRect();
        var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        var ry = (nx * 3.4).toFixed(2),
          rx = (-ny * 3.0).toFixed(2);
        el.style.setProperty('--kk9-rx', rx + 'deg');
        el.style.setProperty('--kk9-ry', ry + 'deg');
      },
      { passive: true },
    );
    document.addEventListener(
      'pointerleave',
      function (e) {
        var el = e.target.closest && e.target.closest(selector);
        if (el) {
          el.style.setProperty('--kk9-rx', '0deg');
          el.style.setProperty('--kk9-ry', '0deg');
        }
      },
      true,
    );
  }

  /* Re-run progress when content changes (tasks added, notes loaded, etc.). */
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(updateScroll);
    ro.observe(document.body);
  }
})();
