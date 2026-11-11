/* ==============================================================
   JS 09/28 · Visual refinement · kashkool-visual-v8-js · 3.7 KB
   ============================================================== */
(function () {
  if (window.__kashkoolV8) return;
  window.__kashkoolV8 = true;
  function reduce() {
    return document.body.classList.contains('reduce-motion');
  }

  /* Global pointer light: gives the page a soft, premium depth without moving layout. */
  if (!reduce() && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.addEventListener(
      'pointermove',
      function (e) {
        document.body.style.setProperty('--kk8mx', e.clientX + 'px');
        document.body.style.setProperty('--kk8my', e.clientY + 'px');
        var el =
          e.target.closest &&
          e.target.closest(
            '.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.studyProgress,.examHero,.hero,.dashboardTop,.pomo,.progressWeekStrip,.notecard,.sub,.linkitem,.notice',
          );
        if (el) {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--kk8x', ((e.clientX - r.left) / r.width) * 100 + '%');
          el.style.setProperty('--kk8y', ((e.clientY - r.top) / r.height) * 100 + '%');
        }
      },
      { passive: true },
    );
    var glow = document.createElement('div');
    glow.className = 'kk8-cursorGlow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
  }

  /* Add a very small magnetic response to icon/primary controls. */
  if (!reduce() && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.iconbtn,.primary,.danger').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect(),
          dx = (e.clientX - (r.left + r.width / 2)) / r.width,
          dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.setProperty('--mag-x', (dx * 4).toFixed(2) + 'px');
        btn.style.setProperty('--mag-y', (dy * 4).toFixed(2) + 'px');
        btn.style.transform = 'translate(var(--mag-x),var(--mag-y))';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.removeProperty('transform');
        btn.style.removeProperty('--mag-x');
        btn.style.removeProperty('--mag-y');
      });
    });
  }

  /* One-time visual boot sequence: avoids the feeling of a static template loading all at once. */
  requestAnimationFrame(function () {
    if (reduce()) return;
    document.body.classList.add('kk8-ready');
    setTimeout(function () {
      document.body.classList.add('kk8-settled');
    }, 900);
  });

  /* Keep reveal animation reliable for dynamically inserted cards too. */
  if (!reduce() && 'MutationObserver' in window && 'IntersectionObserver' in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          entry.target.classList.add('kk-seen');
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -25px 0px' },
    );
    var KK8_SEL =
      '.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.studyProgress,.notecard,.sub,.linkitem,.notice';
    function kk8Watch(el) {
      if (!el.dataset.kk8Observed) {
        el.dataset.kk8Observed = '1';
        io.observe(el);
      }
    }
    function scan(root) {
      if (root.matches && root.matches(KK8_SEL)) kk8Watch(root);
      root.querySelectorAll(KK8_SEL).forEach(kk8Watch);
    }
    scan(document);
    new MutationObserver(function (recs) {
      recs.forEach(function (r) {
        r.addedNodes.forEach(function (n) {
          if (n.nodeType === 1) scan(n);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* Smoothly close the More menu when moving to another section. */
  document.addEventListener(
    'click',
    function (e) {
      var tab = e.target.closest && e.target.closest('.tab[data-view]');
      if (tab) {
        var menu = document.querySelector('.navMore__menu:not([hidden])');
        var more = tab.closest('.navMore__menu');
        if (menu && !more) {
          var close = document.querySelector('.navMore__btn[aria-expanded="true"]');
          if (close) close.click();
        }
      }
    },
    true,
  );

  /* Theme-specific effects are handled dynamically by the v32 motion engine. */
})();
