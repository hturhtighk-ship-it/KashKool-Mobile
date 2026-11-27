/* ================================================================
   KASHKOOL v74 — THE PAGE TRANSITION ENGINE

   Moving between pages used to slide the same way in every theme.
   This engine gives each theme its own crossing:

     1. a curtain in the theme's own colour and shape covers the page
     2. the page changes underneath it, through KashKool's own
        navigation, so nothing is bypassed
     3. the curtain leaves in the language of the theme

   The change of page is made by KashKoolCore.goTo(), the same
   function the interface itself uses, so the tab state, the menu,
   the focus and the saved view stay exactly as the application
   expects them.

   When the system asks for less movement, the curtain never appears
   and the page simply changes.
   ================================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  if (!root || !body) return;

  var layer = null;
  var busy = false;
  var ownChange = false;
  var pendingView = null;
  var timer = 0;

  function theme() {
    return root.getAttribute('data-store-theme') || 'classic';
  }
  /* The motion gate is the one the rest of the application uses. The
     setting behind it already starts from the system preference and
     stays under the user's own hand in the settings, so the curtain
     answers to the same switch as every other movement in KashKool. */
  function reduced() {
    return !!(
      body &&
      (body.classList.contains('reduce-motion') || body.classList.contains('motion-ultra'))
    );
  }
  function compact() {
    return (window.innerWidth || 0) < 760;
  }
  function visibleViewId() {
    var v = document.querySelector('.view:not([hidden])');
    return v ? v.id : '';
  }

  /* ------------------------------------------------------------------
     The layer
     ------------------------------------------------------------------ */
  function ensureLayer() {
    if (layer && layer.isConnected) return layer;
    layer = document.createElement('div');
    layer.className = 'kk-page-transition-layer';
    layer.setAttribute('aria-hidden', 'true');
    body.appendChild(layer);
    return layer;
  }

  function makeCurtain(th) {
    var el = document.createElement('div');
    el.className = 'kk-page-transition kk-page-transition--' + th;
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  function dropCurtain() {
    if (!layer) return;
    while (layer.firstChild) layer.removeChild(layer.firstChild);
  }

  /* The cover brings the curtain over the page. */
  function cover(th, done) {
    ensureLayer();
    var el = makeCurtain(th);
    layer.appendChild(el);
    void el.offsetWidth;
    el.classList.add('is-cover');
    var finished = false;
    function fin() {
      if (finished) return;
      finished = true;
      done(el);
    }
    el.addEventListener('animationend', fin, { once: true });
    window.setTimeout(fin, compact() ? 420 : 620);
  }

  /* The reveal takes the curtain away and shows the page behind it. */
  function reveal(el, th, done) {
    if (!el) {
      if (done) done();
      return;
    }
    el.classList.remove('is-cover');
    void el.offsetWidth;
    el.classList.add('is-reveal');
    var finished = false;
    function fin() {
      if (finished) return;
      finished = true;
      if (el.parentNode) el.parentNode.removeChild(el);
      if (done) done();
    }
    el.addEventListener('animationend', fin, { once: true });
    window.setTimeout(fin, compact() ? 700 : 900);
  }

  /* A page change that came from somewhere else — a keyboard arrow, a
     command, a shortcut. The curtain appears already covering and
     then leaves, so the change is still hidden behind it. */
  function crossingOnly(th) {
    if (busy || reduced()) return;
    ensureLayer();
    var el = makeCurtain(th);
    layer.appendChild(el);
    void el.offsetWidth;
    el.classList.add('is-reveal');
    var finished = false;
    function fin() {
      if (finished) return;
      finished = true;
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    el.addEventListener('animationend', fin, { once: true });
    window.setTimeout(fin, compact() ? 700 : 900);
  }

  /* ------------------------------------------------------------------
     The crossing
     ------------------------------------------------------------------ */
  function crossTo(viewId) {
    if (busy || reduced() || !viewId) return;
    var core = window.KashKoolCore;
    if (!core || typeof core.goTo !== 'function') return;
    if (visibleViewId() === 'view-' + viewId) return;

    busy = true;
    ownChange = true;
    cover(theme(), function (curtain) {
      core.goTo(viewId);
      /* Give the new page one frame to lay out before the curtain
         starts to leave it. */
      window.requestAnimationFrame(function () {
        window.setTimeout(function () {
          reveal(curtain, theme(), function () {
            busy = false;
            ownChange = false;
            if (pendingView) {
              var next = pendingView;
              pendingView = null;
              window.setTimeout(function () {
                crossTo(next);
              }, 40);
            }
          });
        }, 30);
      });
    });
  }

  /* The more-menu closes itself when a section is chosen. The click
     that starts the crossing is held back, so the menu is closed here
     with the same result the interface would have had. */
  function closeMoreMenu() {
    var m = document.getElementById('moreNavMenu');
    var b = document.getElementById('moreNavBtn');
    if (m) m.hidden = true;
    if (b) b.setAttribute('aria-expanded', 'false');
  }

  /* ------------------------------------------------------------------
     Holding the click until the curtain has covered the page
     ------------------------------------------------------------------ */
  document.addEventListener(
    'click',
    function (e) {
      if (reduced() || !e.isTrusted) return;
      var tab = e.target && e.target.closest ? e.target.closest('.tab[data-view]') : null;
      if (!tab) return;
      var viewId = tab.getAttribute('data-view');
      if (!viewId) return;
      if (busy) {
        /* A crossing is already on its way. Remember where the user
           wanted to go and let the current crossing finish first. */
        if (viewId !== visibleViewId().replace('view-', '')) pendingView = viewId;
        return;
      }
      if (viewId === visibleViewId().replace('view-', '')) return;
      if (!window.KashKoolCore || typeof window.KashKoolCore.goTo !== 'function') return;
      e.preventDefault();
      e.stopPropagation();
      closeMoreMenu();
      crossTo(viewId);
    },
    true,
  );

  /* ------------------------------------------------------------------
     Any other way of changing the page still gets the crossing
     ------------------------------------------------------------------ */
  function watchViews() {
    var main = document.querySelector('main');
    if (!main) return;
    var observer = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var r = records[i];
        if (r.type !== 'attributes' || r.attributeName !== 'hidden') continue;
        var v = r.target;
        if (!v || !v.classList || !v.classList.contains('view') || v.hidden) continue;
        if (ownChange) continue;
        crossingOnly(theme());
      }
    });
    observer.observe(main, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  }

  function boot() {
    watchViews();
    window.addEventListener(
      'beforeunload',
      function () {
        if (timer) clearTimeout(timer);
      },
      { once: true },
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  /* A small handle for the rest of the application. */
  window.KashKoolPageTransitions = {
    crossTo: function (viewId) {
      crossTo(viewId);
    },
    isRunning: function () {
      return busy;
    },
  };
})();
