/* ==============================================================
   JS 27/28 · Themes & store · kashkool-v55-fire-anime-overhaul-js · 9.9 KB
   ============================================================== */
(function () {
  'use strict';
  if (window.__KK_FIRE_ANIME_V55) return;
  window.__KK_FIRE_ANIME_V55 = true;
  var root = document.documentElement;
  var main = document.getElementById('kashkool-main');
  var transition = null,
    transitionTimer = 0,
    coverTimer = 0,
    serial = 0,
    pendingNavigation = false,
    replaying = false,
    skipNextObserver = false;
  var styleBackups = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function isFire() {
    return root.getAttribute('data-store-theme') === 'fire';
  }
  function reduced() {
    var desktopThemeMotion = root.getAttribute('data-kk-desktop-theme-motion') === 'full';
    return !desktopThemeMotion && (
      !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
      document.body.classList.contains('reduce-motion') ||
      document.body.classList.contains('motion-ultra')
    );
  }
  function getButton(target) {
    if (!target || !target.closest) return null;
    return target.closest('button:not(:disabled),[role="button"],.linkbtn,.fchip,.day__add');
  }
  function addAura(button) {
    if (!button) return;
    if (!button.querySelector('.kk-fire-aura')) {
      var aura = document.createElement('span');
      aura.className = 'kk-fire-aura';
      aura.setAttribute('aria-hidden', 'true');
      button.insertBefore(aura, button.firstChild);
    }
    if (styleBackups && !styleBackups.has(button))
      styleBackups.set(button, { position: button.style.position, isolation: button.style.isolation });
    if (getComputedStyle(button).position === 'static') button.style.position = 'relative';
    button.style.isolation = 'isolate';
  }
  function spark(button, x, y, count) {
    if (!button || reduced()) return;
    addAura(button);
    var rect = button.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var px = Number.isFinite(x) ? x - rect.left : rect.width * 0.5;
    var py = Number.isFinite(y) ? y - rect.top : rect.height * 0.65;
    for (var i = 0; i < (count || 4); i++) {
      var el = document.createElement('i');
      el.className = 'kk-fire-spark';
      el.setAttribute('aria-hidden', 'true');
      el.style.setProperty('--sx', px + (Math.random() - 0.5) * Math.min(24, rect.width * 0.3) + 'px');
      el.style.setProperty('--sy', py + (Math.random() - 0.5) * Math.min(10, rect.height * 0.25) + 'px');
      el.style.setProperty('--ss', 2 + Math.random() * 3.2 + 'px');
      el.style.setProperty('--sxd', (Math.random() - 0.5) * 36 + 'px');
      el.style.setProperty('--syd', -(14 + Math.random() * 34) + 'px');
      el.style.setProperty('--sd', 390 + Math.random() * 300 + 'ms');
      el.style.setProperty('--tail', 8 + Math.random() * 8 + 'px');
      button.appendChild(el);
      window.setTimeout(
        function (node) {
          if (node && node.parentNode) node.parentNode.removeChild(node);
        },
        760,
        el,
      );
    }
  }
  function hot(button) {
    if (!button) return;
    addAura(button);
    button.classList.add('kk-fire-hot');
  }
  function cool(button) {
    if (button && !button.matches(':hover') && !button.contains(document.activeElement))
      button.classList.remove('kk-fire-hot');
  }

  document.addEventListener(
    'pointerover',
    function (ev) {
      if (!isFire()) return;
      var b = getButton(ev.target);
      if (!b) return;
      if (ev.relatedTarget && b.contains(ev.relatedTarget)) return;
      hot(b);
    },
    true,
  );
  document.addEventListener(
    'pointerout',
    function (ev) {
      var b = getButton(ev.target);
      if (!b) return;
      if (ev.relatedTarget && b.contains(ev.relatedTarget)) return;
      b.classList.remove('kk-fire-hot');
    },
    true,
  );
  document.addEventListener(
    'focusin',
    function (ev) {
      if (isFire()) hot(getButton(ev.target));
    },
    true,
  );
  document.addEventListener(
    'focusout',
    function (ev) {
      var b = getButton(ev.target);
      if (!b) return;
      if (ev.relatedTarget && b.contains(ev.relatedTarget)) return;
      b.classList.remove('kk-fire-hot');
    },
    true,
  );
  document.addEventListener(
    'pointerdown',
    function (ev) {
      if (!isFire() || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
      var b = getButton(ev.target);
      if (!b) return;
      hot(b);
      spark(b, ev.clientX, ev.clientY, ev.pointerType === 'touch' ? 3 : 5);
    },
    true,
  );
  document.addEventListener(
    'click',
    function (ev) {
      if (!isFire() || ev.detail !== 0) return;
      var b = getButton(ev.target);
      if (!b) return;
      hot(b);
      spark(b, NaN, NaN, 3);
      window.setTimeout(function () {
        cool(b);
      }, 720);
    },
    true,
  );

  function ensureTransition() {
    if (transition) return transition;
    transition = document.createElement('div');
    transition.className = 'kk-fire-page-transition';
    transition.setAttribute('aria-hidden', 'true');
    transition.innerHTML =
      '<div class="kk-fire-curtain"></div>' +
      '<svg class="kk-fire-brushes" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M-120 820 C80 610 150 720 330 500 S560 170 740 380 S1030 640 1220 340 S1390 220 1570 80"/>' +
      '<path d="M-80 500 C170 370 230 560 430 310 S760 100 900 420 S1160 660 1510 360"/>' +
      '<path d="M-50 890 Q240 630 400 700 T760 390 T1110 450 T1490 120"/></svg>' +
      '<div class="kk-fire-sidefront"></div><div class="kk-fire-flash"></div><div class="kk-fire-title">' + (root.lang === 'en' ? 'EMBER / ASCENT' : 'لهيب الجمر') + '</div>';
    document.body.appendChild(transition);
    return transition;
  }
  function playPageTransition(onCovered) {
    if (!isFire() || reduced() || document.visibilityState === 'hidden') {
      if (typeof onCovered === 'function') onCovered();
      return;
    }
    var layer = ensureTransition();
    serial++;
    var thisRun = serial;
    if (transitionTimer) clearTimeout(transitionTimer);
    if (coverTimer) clearTimeout(coverTimer);
    layer.querySelectorAll('.kk-fire-ember').forEach(function (x) {
      x.remove();
    });
    var total = window.innerWidth < 600 ? 17 : 31;
    for (var i = 0; i < total; i++) {
      var ember = document.createElement('i');
      ember.className = 'kk-fire-ember';
      ember.setAttribute('aria-hidden', 'true');
      ember.style.setProperty('--ex', Math.random() * 100 + '%');
      ember.style.setProperty('--ey', 48 + Math.random() * 58 + '%');
      ember.style.setProperty('--esz', 2 + Math.random() * 4.5 + 'px');
      ember.style.setProperty('--ed', 560 + Math.random() * 690 + 'ms');
      ember.style.setProperty('--edel', Math.random() * 290 + 'ms');
      ember.style.setProperty('--edx', (Math.random() - 0.5) * 110 + 'px');
      ember.style.setProperty('--edy', -100 - Math.random() * innerHeight * 0.72 + 'px');
      layer.appendChild(ember);
    }
    layer.classList.remove('is-running');
    void layer.offsetWidth;
    layer.classList.add('is-running');
    if (typeof onCovered === 'function') {
      coverTimer = window.setTimeout(function () {
        if (thisRun === serial) onCovered();
      }, 650);
    }
    transitionTimer = window.setTimeout(function () {
      if (thisRun === serial) layer.classList.remove('is-running');
    }, 1830);
  }

  function activeViewId() {
    var active = main && main.querySelector('.view:not([hidden])');
    return active ? active.id.replace(/^view-/, '') : '';
  }
  function requestNavigation(button, event) {
    if (replaying || !isFire() || reduced()) return false;
    if (pendingNavigation) {
      if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      return true;
    }
    var target = button.dataset.view || button.dataset.dashView || button.getAttribute('data-dash-view');
    if (!target || target === activeViewId()) return false;
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    pendingNavigation = true;
    hot(button);
    spark(button, NaN, NaN, 4);
    playPageTransition(function () {
      if (!button.isConnected) {
        pendingNavigation = false;
        return;
      }
      replaying = true;
      skipNextObserver = true;
      try {
        button.click();
      } finally {
        replaying = false;
      }
      pendingNavigation = false;
      /* MutationObserver runs at the next microtask; clear the guard only after it. */
      window.setTimeout(function () {
        skipNextObserver = false;
      }, 0);
    });
    return true;
  }

  /* Delay clicked page changes until the flame sheet has covered the old page.
     Then the new page is swapped underneath the fire and revealed as it burns away. */
  document.addEventListener(
    'click',
    function (ev) {
      if (replaying || !isFire()) return;
      var nav = ev.target.closest && ev.target.closest('.tab[data-view],[data-dash-view]');
      if (!nav) return;
      requestNavigation(nav, ev);
    },
    true,
  );

  /* Arrow/Home/End navigation gets the same consume-then-reveal treatment. */
  document.addEventListener(
    'keydown',
    function (ev) {
      if (replaying || !isFire() || reduced()) return;
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
      requestNavigation(tabs[next], null);
    },
    true,
  );

  /* Fallback for programmatic view changes. */
  if (main && window.MutationObserver) {
    var lastView = activeViewId();
    var viewObserver = new MutationObserver(function (records) {
      var changed = false;
      for (var i = 0; i < records.length; i++) {
        var target = records[i].target;
        if (target.classList && target.classList.contains('view') && !target.hidden) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      var id = activeViewId();
      if (!id || id === lastView) return;
      lastView = id;
      if (skipNextObserver) {
        skipNextObserver = false;
        return;
      }
      playPageTransition();
    });
    viewObserver.observe(main, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }

  var themeObserver = new MutationObserver(function () {
    if (!isFire()) {
      if (transition) transition.classList.remove('is-running');
      document.querySelectorAll('.kk-fire-hot').forEach(function (b) {
        b.classList.remove('kk-fire-hot');
      });
      document.querySelectorAll('.kk-fire-aura').forEach(function (a) {
        var b = a.parentElement;
        if (!b) return;
        a.remove();
        if (styleBackups && styleBackups.has(b)) {
          var old = styleBackups.get(b);
          b.style.position = old.position;
          b.style.isolation = old.isolation;
          styleBackups.delete(b);
        }
      });
      document.querySelectorAll('.kk-fire-spark').forEach(function (x) {
        x.remove();
      });
    }
  });
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
})();
