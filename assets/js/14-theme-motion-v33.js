/* ==============================================================
   JS 15/28 · Themes & store · kashkool-theme-motion-v33 · 10.2 KB
   ============================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var motionTimer = null,
    storeCleanupTimer = 0,
    particleTimer = null,
    particleLayer = null,
    replayDebounce = 0,
    lastTheme = root.getAttribute('data-store-theme') || 'classic',
    currentView = null;
  // Motion runs by default on PC and mobile. The in-app setting is the explicit opt-out.
  function reduced() {
    return !!(
      document.body &&
      (document.body.classList.contains('reduce-motion') || document.body.classList.contains('motion-ultra'))
    );
  }
  function activeTheme() {
    return root.getAttribute('data-store-theme') || 'classic';
  }
  function makeParticleLayer() {
    if (particleLayer && particleLayer.isConnected) return particleLayer;
    particleLayer = document.querySelector('.kk-theme-motion-particles');
    if (!particleLayer) {
      particleLayer = document.createElement('div');
      particleLayer.className = 'kk-theme-motion-particles';
      particleLayer.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(particleLayer, document.body.firstChild || null);
    }
    return particleLayer;
  }
  function stopParticles() {
    if (particleTimer) {
      clearTimeout(particleTimer);
      particleTimer = null;
    }
    if (particleLayer) {
      particleLayer.replaceChildren();
      particleLayer.removeAttribute('data-theme');
    }
  }
  function particleProfile(theme) {
    var p = {
      classic: { life: 9000, start: 'top' },
      school: { life: 8000, start: 'random' },
      football: { life: 4800, start: 'bottom' },
      galaxy: { life: 7000, start: 'random' },
      cyber: { life: 3500, start: 'random' },
      nature: { life: 8000, start: 'top' },
      academia: { life: 9000, start: 'bottom' },
      ocean: { life: 6000, start: 'bottom' },
      sunset: { life: 5500, start: 'random' },
      mono: { life: 4000, start: 'random' },
      frost: { life: 9000, start: 'top' },
      rose: { life: 10000, start: 'top' },
      golden: { life: 8000, start: 'bottom' },
    };
    return p[theme] || p.classic;
  }
  function spawnParticle(theme) {
    if (
      reduced() ||
      (document.body && document.body.classList.contains('motion-particles-off')) ||
      document.hidden ||
      !particleLayer ||
      theme !== activeTheme()
    )
      return;
    var items = particleLayer.children;
    if (items.length >= (lowPowerDevice() ? 2 : 5)) return;
    var profile = particleProfile(theme),
      el = document.createElement('span');
    el.className = 'kk-theme-particle';
    el.setAttribute('aria-hidden', 'true');
    var x = Math.round(Math.random() * Math.max(1, window.innerWidth));
    var y =
      profile.start === 'top'
        ? -12
        : profile.start === 'bottom'
          ? window.innerHeight + 12
          : Math.round(Math.random() * Math.max(1, window.innerHeight));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.animationDuration = ((profile.life / 1000) * (0.74 + Math.random() * 0.52)).toFixed(2) + 's';
    if (theme === 'galaxy' || theme === 'cyber' || theme === 'mono' || theme === 'school')
      el.style.animationDelay = (Math.random() * 0.8).toFixed(2) + 's';
    particleLayer.appendChild(el);
    var done = false;
    function remove() {
      if (done) return;
      done = true;
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    el.addEventListener('animationend', remove, { once: true });
    window.setTimeout(remove, profile.life + 1400);
  }
  function lowPowerDevice() {
    var nav = window.navigator || {},
      conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};
    if (document.body && document.body.classList.contains('motion-performance')) return true;
    if (document.body && document.body.classList.contains('motion-rich')) return false;
    return (
      (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) ||
      (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 8) ||
      !!conn.saveData
    );
  }
  function startParticles(theme) {
    stopParticles();
    if (
      reduced() ||
      (document.body && document.body.classList.contains('motion-performance')) ||
      (document.body && document.body.classList.contains('motion-particles-off')) ||
      document.hidden
    )
      return;
    particleLayer = makeParticleLayer();
    particleLayer.setAttribute('data-theme', theme);
    // Keep one timer only, and do not wake the particle system while the tab is hidden.
    spawnParticle(theme);
    if (!lowPowerDevice())
      window.setTimeout(function () {
        if (!document.hidden && theme === activeTheme()) spawnParticle(theme);
      }, 520);
    var delay = lowPowerDevice()
      ? 5200
      : theme === 'cyber'
        ? 3000
        : theme === 'ocean'
          ? 3200
          : theme === 'sunset'
            ? 3100
            : 3600;
    function scheduleNext() {
      if (
        document.hidden ||
        theme !== activeTheme() ||
        reduced() ||
        (document.body && document.body.classList.contains('motion-particles-off'))
      )
        return;
      particleTimer = window.setTimeout(function () {
        particleTimer = null;
        if (!document.hidden && theme === activeTheme()) spawnParticle(theme);
        scheduleNext();
      }, delay);
    }
    scheduleNext();
  }
  function themeWipe(theme) {
    if (reduced() || !document.body) return;
    var overlay = document.createElement('div');
    overlay.className = 'kk-theme-transition kk-theme-transition--' + theme;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    // Force a style boundary before starting the theme-specific animation.
    void overlay.offsetWidth;
    overlay.classList.add('kk-theme-transition-run');
    var removed = false;
    function remove() {
      if (removed) return;
      removed = true;
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    overlay.addEventListener('animationend', remove, { once: true });
    window.setTimeout(remove, 1250);
  }
  function animateView(view) {
    if (!view || view.hidden || reduced()) return;
    if (currentView && currentView !== view) currentView.classList.remove('kk-theme-view-enter');
    currentView = view;
    view.classList.remove('kk-theme-view-enter');
    var cards = view.querySelectorAll(
      '.dashMetric,.dashCard,.statCard,.settingCard,.studyStep,.studyProgress,.notecard,.sub,.linkitem,.progressWeekStrip',
    );
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.setProperty('--kk-theme-stagger', String(Math.min(i, 6)));
    }
    void view.offsetWidth;
    view.classList.add('kk-theme-view-enter');
    if (motionTimer) clearTimeout(motionTimer);
    motionTimer = window.setTimeout(function () {
      view.classList.remove('kk-theme-view-enter');
      for (var j = 0; j < cards.length; j++) cards[j].style.removeProperty('--kk-theme-stagger');
    }, 1450);
  }
  function visibleView() {
    return document.querySelector('.view:not([hidden])');
  }
  function replayStoreCards() {
    if (reduced() || document.hidden) return;
    var grid = document.querySelector('.storeThemeGrid');
    var cards = grid
      ? grid.querySelectorAll('.storeCard')
      : document.querySelectorAll('.storeThemeGrid .storeCard');
    if (!cards || !cards.length) return;
    // Reset all cards, perform one layout boundary, then start the sequence together.
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('kk-theme-store-arrive');
      cards[i].style.setProperty('--kk-theme-stagger', String(Math.min(i, 6)));
    }
    void grid.offsetWidth;
    for (var j = 0; j < cards.length; j++) cards[j].classList.add('kk-theme-store-arrive');
    if (storeCleanupTimer) clearTimeout(storeCleanupTimer);
    storeCleanupTimer = window.setTimeout(function () {
      for (var k = 0; k < cards.length; k++) {
        cards[k].classList.remove('kk-theme-store-arrive');
        cards[k].style.removeProperty('--kk-theme-stagger');
      }
    }, 1050);
  }
  function scheduleReplayStoreCards() {
    if (replayDebounce) clearTimeout(replayDebounce);
    replayDebounce = window.setTimeout(function () {
      replayDebounce = 0;
      replayStoreCards();
    }, 140);
  }
  function syncThemeMotion(theme, doWipe) {
    if (!theme) theme = 'classic';
    if (doWipe) themeWipe(theme);
    startParticles(theme);
    if (doWipe)
      window.setTimeout(function () {
        animateView(visibleView());
      }, 170);
  }
  var viewObserver = new MutationObserver(function (records) {
    records.forEach(function (r) {
      if (r.type === 'attributes' && r.attributeName === 'hidden' && !r.target.hidden) animateView(r.target);
    });
  });
  document.querySelectorAll('.view').forEach(function (v) {
    viewObserver.observe(v, { attributes: true, attributeFilter: ['hidden'] });
  });
  var themeObserver = new MutationObserver(function () {
    var now = activeTheme();
    if (now === lastTheme) return;
    lastTheme = now;
    syncThemeMotion(now, true);
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
  var gridObserver = new MutationObserver(function () {
    if (document.querySelector('.storeThemeGrid .storeCard')) scheduleReplayStoreCards();
  });
  var storeGrid = document.getElementById('storeGrid');
  if (storeGrid) gridObserver.observe(storeGrid, { childList: true, subtree: true });
  document.addEventListener('click', function (e) {
    var filter = e.target.closest && e.target.closest('.themeFilter');
    var storeAction = e.target.closest && e.target.closest('[data-store-use],[data-store-buy]');
    if (filter || storeAction) window.setTimeout(scheduleReplayStoreCards, 90);
  });
  function handleReducedChange() {
    if (reduced()) {
      stopParticles();
      document.querySelectorAll('.kk-theme-transition').forEach(function (x) {
        if (x.parentNode) x.parentNode.removeChild(x);
      });
      document.querySelectorAll('.kk-theme-view-enter').forEach(function (x) {
        x.classList.remove('kk-theme-view-enter');
      });
      document.querySelectorAll('.kk-theme-store-arrive').forEach(function (x) {
        x.classList.remove('kk-theme-store-arrive');
      });
    } else {
      startParticles(activeTheme());
      window.setTimeout(function () {
        animateView(visibleView());
      }, 60);
      window.setTimeout(scheduleReplayStoreCards, 120);
    }
  }
  // React to the app's own Reduce Motion checkbox without relying on OS animation settings.
  if (document.body) {
    var wasReduced = reduced();
    var wasProfile = document.body.classList.contains('motion-performance')
      ? 'performance'
      : document.body.classList.contains('motion-rich')
        ? 'rich'
        : 'ultra';
    var wasParticlesOff = document.body.classList.contains('motion-particles-off');
    var bodyMotionObserver = new MutationObserver(function () {
      var now = reduced(),
        profile = document.body.classList.contains('motion-performance')
          ? 'performance'
          : document.body.classList.contains('motion-rich')
            ? 'rich'
            : 'ultra',
        particlesOff = document.body.classList.contains('motion-particles-off');
      if (now !== wasReduced) {
        wasReduced = now;
        handleReducedChange();
      } else if (profile !== wasProfile || particlesOff !== wasParticlesOff) {
        if (particleTimer) clearInterval(particleTimer);
        particleTimer = null;
        startParticles(activeTheme());
      }
      wasProfile = profile;
      wasParticlesOff = particlesOff;
    });
    bodyMotionObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopParticles();
        if (replayDebounce) {
          clearTimeout(replayDebounce);
          replayDebounce = 0;
        }
      } else if (!reduced()) {
        startParticles(activeTheme());
        scheduleReplayStoreCards();
      }
    });
    startParticles(lastTheme);
    window.setTimeout(scheduleReplayStoreCards, 250);
  }
})();
