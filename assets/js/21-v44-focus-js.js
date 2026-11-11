/* ==============================================================
   JS 22/28 · Focus mode · kashkool-v44-focus-js · 1.5 KB
   ============================================================== */
(function () {
  var O = document.getElementById('focusOverlay'),
    B = document.getElementById('focusProgressBar'),
    S = document.getElementById('focusSummary'),
    R = document.documentElement;
  if (!O) return;
  function sync() {
    var s = B ? B.style : {},
      w = parseFloat(s.width),
      m = /scaleX\(([\d.]+)\)/.exec(s.transform || ''),
      p = isNaN(w) ? (m ? parseFloat(m[1]) : 0) : w / 100;
    O.style.setProperty('--kk44-p', Math.max(0, Math.min(1, p || 0)));
  }
  if (B) {
    new MutationObserver(sync).observe(B, { attributes: true, attributeFilter: ['style'] });
    sync();
  }
  var G = {
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
  if (S)
    new MutationObserver(function () {
      var g = G[R.getAttribute('data-store-theme')];
      if (S.hidden || !g || calm()) return;
      for (var i = 0; i < 16; i++) {
        var s = document.createElement('span'),
          a = (Math.PI * 2 * i) / 16 + Math.random() * 0.4,
          d = 90 + Math.random() * 90;
        s.className = 'kk43-b';
        s.style.zIndex = 10001;
        s.textContent = g[i % g.length];
        s.style.cssText +=
          ';left:' +
          innerWidth / 2 +
          'px;top:' +
          innerHeight * 0.4 +
          'px;--dx:' +
          Math.cos(a) * d +
          'px;--dy:' +
          (Math.sin(a) * d - 40) +
          'px;--r:' +
          (Math.random() * 300 - 150) +
          'deg;font-size:20px';
        document.body.appendChild(s);
        setTimeout(
          function (el) {
            el.remove();
          }.bind(null, s),
          800,
        );
      }
    }).observe(S, { attributes: true, attributeFilter: ['hidden'] });
})();
