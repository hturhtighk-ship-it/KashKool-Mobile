/* ==============================================================
   JS 05/28 · Motion · kashkool-motion-v4-js · 5.6 KB
   ============================================================== */
(function () {
  function reduced() {
    return (
      document.body.classList.contains('reduce-motion') || document.body.classList.contains('motion-ultra')
    );
  }
  var nav = document.querySelector('nav.tabs'),
    main = document.querySelector('main');

  /* 1) gliding ring on the active tab */
  if (nav) {
    var pill = document.createElement('div');
    pill.className = 'kk-pill';
    pill.setAttribute('aria-hidden', 'true');
    nav.appendChild(pill);
    var placed = false;
    var place = function () {
      if (innerWidth <= 700 || reduced()) {
        pill.style.opacity = '0';
        return;
      }
      var t = nav.querySelector('.tab[aria-selected="true"]');
      if (!t) {
        pill.style.opacity = '0';
        return;
      }
      var el = t.closest('.navMore__menu') ? nav.querySelector('.navMore__btn') : t;
      if (!el || !el.offsetWidth) {
        pill.style.opacity = '0';
        return;
      }
      var x = el.offsetLeft,
        y = el.offsetTop,
        op = el.offsetParent;
      if (op && op !== nav) {
        x += op.offsetLeft;
        y += op.offsetTop;
      }
      pill.style.width = el.offsetWidth + 'px';
      pill.style.height = el.offsetHeight + 'px';
      pill.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      pill.style.opacity = '1';
      if (!placed) {
        placed = true;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            pill.classList.add('is-ready');
          });
        });
      }
    };
    new MutationObserver(function () {
      requestAnimationFrame(place);
    }).observe(nav, {
      attributes: true,
      attributeFilter: ['aria-selected'],
      subtree: true,
      childList: true,
      characterData: true,
    });
    addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    setTimeout(place, 300);
    setTimeout(place, 1200);
    place();
  }

  /* 2) direction-aware slide between sections */
  var views = Array.prototype.map.call(document.querySelectorAll('.tab[data-view]'), function (t) {
    return t.dataset.view;
  });
  var cur = main && main.querySelector('.view:not([hidden])');
  var last = cur ? views.indexOf(cur.id.replace('view-', '')) : 0;
  if (main)
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        var el = m.target;
        if (!el.classList || !el.classList.contains('view') || el.hidden || m.oldValue === null) return;
        var i = views.indexOf(el.id.replace('view-', ''));
        el.style.setProperty('--kk-fwd', i >= last ? 1 : -1);
        last = i;
      });
    }).observe(main, {
      attributes: true,
      attributeFilter: ['hidden'],
      attributeOldValue: true,
      subtree: true,
    });

  /* 3) 3D tilt on hover (mouse only) */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var TILT = '.dashMetric,.notecard,.sub,.studySystemCard,.examHero,.progressInsight,.statCard.wide',
      on = null,
      pendingEvent = null,
      tiltRaf = 0;
    function clearTilt() {
      if (on) {
        on.classList.remove('kk-tilt');
        on.style.removeProperty('--rx');
        on.style.removeProperty('--ry');
        on = null;
      }
    }
    function updateTilt() {
      tiltRaf = 0;
      var ev = pendingEvent;
      pendingEvent = null;
      if (!ev || reduced()) return;
      var el = ev.target.closest && ev.target.closest(TILT);
      if (on && on !== el) clearTilt();
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var px = (ev.clientX - r.left) / r.width - 0.5,
        py = (ev.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', (-py * 4).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (px * 4).toFixed(2) + 'deg');
      if (on !== el) el.classList.add('kk-tilt');
      on = el;
    }
    document.addEventListener(
      'pointermove',
      function (ev) {
        if (reduced() || ev.pointerType === 'touch') return;
        pendingEvent = ev;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
      },
      { passive: true },
    );
    document.addEventListener(
      'pointerleave',
      function () {
        pendingEvent = null;
        if (tiltRaf) {
          cancelAnimationFrame(tiltRaf);
          tiltRaf = 0;
        }
        clearTilt();
      },
      true,
    );
  }

  /* 4) dialogs animate out as well as in */
  try {
    var oClose = HTMLDialogElement.prototype.close,
      oShow = HTMLDialogElement.prototype.showModal;
    HTMLDialogElement.prototype.close = function (rv) {
      var d = this;
      if (!d.open || reduced() || d.classList.contains('kk-closing')) return oClose.call(d, rv);
      d.classList.add('kk-closing');
      d._kkT = setTimeout(function () {
        d.classList.remove('kk-closing');
        oClose.call(d, rv);
      }, 200);
    };
    HTMLDialogElement.prototype.showModal = function () {
      if (this._kkT) {
        clearTimeout(this._kkT);
        this._kkT = 0;
      }
      if (this.classList.contains('kk-closing')) {
        this.classList.remove('kk-closing');
        oClose.call(this);
      }
      return oShow.call(this);
    };
    document.addEventListener(
      'cancel',
      function (ev) {
        var d = ev.target;
        if (d && d.tagName === 'DIALOG' && !reduced() && !d.classList.contains('kk-closing')) {
          ev.preventDefault();
          d.close();
        }
      },
      true,
    );
  } catch (e) {}

  /* 5) theme / language switch with a circular reveal */
  var bypass = false;
  document.addEventListener(
    'click',
    function (ev) {
      if (bypass || !document.startViewTransition || reduced()) return;
      var b = ev.target.closest && ev.target.closest('#themeBtn,#langBtn');
      if (!b) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      var r = b.getBoundingClientRect(),
        x = r.left + r.width / 2,
        y = r.top + r.height / 2,
        R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)),
        rs = document.documentElement.style;
      rs.setProperty('--vx', x + 'px');
      rs.setProperty('--vy', y + 'px');
      rs.setProperty('--vr', R + 'px');
      document.startViewTransition(function () {
        bypass = true;
        try {
          b.click();
        } finally {
          bypass = false;
        }
      });
    },
    true,
  );

  /* 6) scroll progress bar + sticky-nav depth */
  var bar = document.createElement('div');
  bar.className = 'kk-sbar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var tick = false;
  addEventListener(
    'scroll',
    function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var h = document.documentElement,
          max = h.scrollHeight - h.clientHeight,
          y = h.scrollTop || document.body.scrollTop;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
        document.body.classList.toggle('kk-scrolled', y > 12);
      });
    },
    { passive: true },
  );
})();
