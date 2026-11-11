/* ==============================================================
   JS 08/28 · Visual refinement · kashkool-visual-v7-js · 2.4 KB
   ============================================================== */
(function () {
  if (window.__kashkoolV7) return;
  window.__kashkoolV7 = true;
  var reduce = function () {
    return document.body.classList.contains('reduce-motion');
  };

  /* Pointer light on desktop cards. */
  if (!reduce() && matchMedia('(pointer:fine)').matches) {
    var sel =
      '.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.studyProgress,.hero,.dashboardTop,.pomo,.progressWeekStrip,.notecard,.sub';
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add('kk-light');
    });
    var lightFrame = 0,
      lastPointer = null;
    document.addEventListener(
      'pointermove',
      function (e) {
        lastPointer = { target: e.target, x: e.clientX, y: e.clientY };
        if (lightFrame) return;
        lightFrame = requestAnimationFrame(function () {
          lightFrame = 0;
          var point = lastPointer;
          lastPointer = null;
          if (!point) return;
          var el = point.target && point.target.closest ? point.target.closest(sel) : null;
          if (!el) return;
          var r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          el.style.setProperty('--kk-px', ((point.x - r.left) / r.width) * 100 + '%');
          el.style.setProperty('--kk-py', ((point.y - r.top) / r.height) * 100 + '%');
        });
      },
      { passive: true },
    );
  }

  /* Delayed sweep makes section changes feel like a real app transition. */
  document.addEventListener(
    'click',
    function (e) {
      var b = e.target.closest && e.target.closest('.tab[data-view]');
      if (!b || reduce()) return;
      document.body.classList.remove('kk-page-sweep');
      void document.body.offsetWidth;
      document.body.classList.add('kk-page-sweep');
      setTimeout(function () {
        document.body.classList.remove('kk-page-sweep');
      }, 620);
    },
    true,
  );

  /* Intersection reveals for cards that enter the viewport after scrolling. */
  if (!reduce() && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (x) {
          if (x.isIntersecting) {
            x.target.classList.add('kk-seen');
            io.unobserve(x.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );
    document
      .querySelectorAll('.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.notecard,.sub,.linkitem')
      .forEach(function (el) {
        io.observe(el);
      });
  }

  /* Tiny haptic-like press state for keyboard / touch controls. */
  document.addEventListener(
    'keydown',
    function (e) {
      if (reduce() || (e.key !== 'Enter' && e.key !== ' ')) return;
      var b = e.target.closest && e.target.closest('button,.tab,.fchip,.linkbtn');
      if (!b) return;
      b.classList.add('kk-keypress');
      setTimeout(function () {
        b.classList.remove('kk-keypress');
      }, 180);
    },
    true,
  );
})();
