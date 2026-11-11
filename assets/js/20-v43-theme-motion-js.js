/* ==============================================================
   JS 21/28 · Themes & store · kashkool-v43-theme-motion-js · 1.5 KB
   ============================================================== */
(function () {
  var R = document.documentElement,
    born = Date.now(),
    prev = R.getAttribute('data-store-theme'),
    G = {
      football: ['⚽', '🟨', '🟩'],
      school: ['⭐', '✏️', '📎'],
      galaxy: ['✦', '✧', '★'],
      cyber: ['▪', '▫', '◆'],
      nature: ['🍃', '🌿', '🌸'],
      academia: ['✦', '❦', '✧'],
      ocean: ['○', '◯', '•'],
      sunset: ['✦', '☀', '•'],
      mono: ['■', '▪', '●'],
      frost: ['❄', '✦', '•'],
      rose: ['❀', '✿', '•'],
      golden: ['✦', '◦', '•'],
    };
  function calm() {
    return (
      matchMedia('(prefers-reduced-motion:reduce)').matches ||
      document.body.classList.contains('motion-performance')
    );
  }
  document.addEventListener(
    'pointerdown',
    function (e) {
      var t = R.getAttribute('data-store-theme'),
        g = G[t];
      if (!g || calm()) return;
      var b = e.target.closest && e.target.closest('.add,.storeUse,.storeBuy,.iconbtn');
      if (!b) return;
      for (var i = 0; i < 7; i++) {
        var s = document.createElement('span'),
          a = (Math.PI * 2 * i) / 7 + Math.random() * 0.6,
          d = 34 + Math.random() * 34;
        s.className = 'kk43-b';
        s.textContent = g[i % g.length];
        s.style.cssText =
          'left:' +
          e.clientX +
          'px;top:' +
          e.clientY +
          'px;--dx:' +
          Math.cos(a) * d +
          'px;--dy:' +
          (Math.sin(a) * d - 26) +
          'px;--r:' +
          (Math.random() * 240 - 120) +
          'deg';
        document.body.appendChild(s);
        setTimeout(
          function (el) {
            el.remove();
          }.bind(null, s),
          800,
        );
      }
    },
    { passive: true },
  );
  new MutationObserver(function () {
    var t = R.getAttribute('data-store-theme'),
      old = prev;
    if (t === old) return;
    prev = t;
    if (!old || !t || Date.now() - born < 2500 || calm()) return;
    var w = document.createElement('div');
    w.className = 'kk43-wipe';
    w.setAttribute('data-t', t);
    document.body.appendChild(w);
    setTimeout(function () {
      w.remove();
    }, 1100);
  }).observe(R, { attributes: true, attributeFilter: ['data-store-theme'] });
})();
