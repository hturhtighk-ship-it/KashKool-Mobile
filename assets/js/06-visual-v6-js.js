/* ==============================================================
   JS 07/28 · Visual refinement · kashkool-visual-v6-js · 2.9 KB
   ============================================================== */
(function () {
  var root = document.documentElement;
  function reduced() {
    return (
      document.body.classList.contains('reduce-motion') || document.body.classList.contains('motion-ultra')
    );
  }

  /* Directional section entrance + reveal choreography. */
  var main = document.querySelector('main');
  var lastView = null;
  function revealView(view) {
    if (!view || reduced()) {
      if (view)
        view.querySelectorAll('.kk-reveal').forEach(function (el) {
          el.classList.add('is-visible');
        });
      return;
    }
    view.classList.remove('kk-view-enter', 'kk-forward', 'kk-back');
    void view.offsetWidth;
    var idx = Array.prototype.indexOf.call(
      document.querySelectorAll('.tab[data-view]'),
      document.querySelector('.tab[data-view="' + view.id.replace('view-', '') + '"]'),
    );
    var prev = lastView;
    view.classList.add('kk-view-enter');
    if (prev !== null) view.classList.add(idx >= prev ? 'kk-forward' : 'kk-back');
    lastView = idx;
    var targets = view.querySelectorAll(
      '.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.studyProgress,.progressInsight,.notecard,.sub,.examHero',
    );
    if (targets.length) {
      targets.forEach(function (el) {
        el.classList.add('kk-reveal');
      });
      requestAnimationFrame(function () {
        targets.forEach(function (el, i) {
          setTimeout(
            function () {
              el.classList.add('is-visible');
            },
            Math.min(i * 34, 260),
          );
        });
      });
    }
  }
  if (main) {
    var initial = main.querySelector('.view:not([hidden])');
    if (initial) {
      lastView = Array.prototype.indexOf.call(
        document.querySelectorAll('.tab[data-view]'),
        document.querySelector('.tab[data-view="' + initial.id.replace('view-', '') + '"]'),
      );
      revealView(initial);
    }
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type !== 'attributes' || m.attributeName !== 'hidden') return;
        var v = m.target;
        if (v.classList && v.classList.contains('view') && !v.hidden) revealView(v);
      });
    }).observe(main, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }

  /* Small ripple on tactile controls. */
  document.addEventListener(
    'pointerdown',
    function (e) {
      if (reduced() || (e.pointerType === 'mouse' && e.button !== 0)) return;
      var b = e.target.closest && e.target.closest('button,.tab,.fchip,.linkbtn,.day__add');
      if (!b || b.disabled || b.classList.contains('kk-ripple-host')) return;
      b.classList.add('kk-ripple-host');
      var r = b.getBoundingClientRect(),
        x = e.clientX - r.left,
        y = e.clientY - r.top;
      var rip = document.createElement('i');
      rip.className = 'kk-ripple';
      rip.style.left = x + 'px';
      rip.style.top = y + 'px';
      b.appendChild(rip);
      setTimeout(function () {
        rip.remove();
        b.classList.remove('kk-ripple-host');
      }, 620);
    },
    { passive: true },
  );

  /* Keep the ambient blobs slightly alive as the user scrolls. */
  var raf = 0;
  addEventListener(
    'scroll',
    function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var y = scrollY || 0;
        root.style.setProperty('--kk-scroll', Math.min(1, y / 900));
        document.body.style.setProperty('--kk-float', Math.min(18, y * 0.025) + 'px');
      });
    },
    { passive: true },
  );
})();
