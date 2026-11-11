/* ==============================================================
   JS 20/28 · Themes & store · kashkool-v42-theme-interactions · 1.4 KB
   ============================================================== */
(function () {
  var R = document.documentElement,
    CARD = '.panel,.dashMetric,.dashCard,.statCard,.settingCard,.notecard,.sub,.linkitem,.studyStep',
    BTN = '.tab,.ghost,.add,.iconbtn,.fchip,.storeUse,.storeBuy,.themeFilter',
    GLOW = { galaxy: 1, ocean: 1, sunset: 1 },
    RIP = { galaxy: 1, ocean: 1, sunset: 1, nature: 1 },
    raf = 0,
    ev;
  function calm() {
    return (
      matchMedia('(prefers-reduced-motion:reduce)').matches ||
      document.body.classList.contains('motion-performance')
    );
  }
  document.addEventListener(
    'pointermove',
    function (e) {
      if (!GLOW[R.dataset.storeTheme] || e.pointerType === 'touch' || calm()) return;
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var c = ev.target.closest && ev.target.closest(CARD);
        if (!c) return;
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ev.clientX - r.left + 'px');
        c.style.setProperty('--my', ev.clientY - r.top + 'px');
      });
    },
    { passive: true },
  );
  document.addEventListener(
    'pointerdown',
    function (e) {
      if (!RIP[R.dataset.storeTheme] || calm()) return;
      var h = e.target.closest && e.target.closest(BTN);
      if (!h) return;
      var r = h.getBoundingClientRect(),
        d = Math.max(r.width, r.height) * 2,
        s = document.createElement('span');
      s.className = 'kk42-rip';
      s.style.cssText =
        'width:' +
        d +
        'px;height:' +
        d +
        'px;left:' +
        (e.clientX - r.left - d / 2) +
        'px;top:' +
        (e.clientY - r.top - d / 2) +
        'px';
      h.classList.add('kk42-host');
      h.appendChild(s);
      setTimeout(function () {
        s.remove();
        if (!h.querySelector('.kk42-rip')) h.classList.remove('kk42-host');
      }, 700);
    },
    { passive: true },
  );
})();
