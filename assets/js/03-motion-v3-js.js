/* ==============================================================
   JS 04/28 · Motion · kashkool-motion-v3-js · 2.8 KB
   ============================================================== */
(function () {
  function reduced() {
    return (
      document.body.classList.contains('reduce-motion') || document.body.classList.contains('motion-ultra')
    );
  }
  /* ripple on press */
  var RIP =
    '.tab,.add,.primary,.ghost,.danger,.iconbtn,.navMore__btn,.fchip,.daypick button,.studySystemCard,.sub,.notecard,.linkitem__body,.pomo__controls button,.focusControls button';
  document.addEventListener(
    'pointerdown',
    function (ev) {
      if (reduced() || !ev.target.closest) return;
      var el = ev.target.closest(RIP);
      if (
        !el ||
        el.disabled ||
        el.classList.contains('searchClear') ||
        el.classList.contains('pomo__sound') ||
        el.classList.contains('dlgClose')
      )
        return;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.classList.add('kk-rip');
      var r = el.getBoundingClientRect(),
        d = Math.max(r.width, r.height) * 2.2,
        s = document.createElement('span');
      s.className = 'kk-ripple';
      s.style.cssText =
        'width:' +
        d +
        'px;height:' +
        d +
        'px;left:' +
        (ev.clientX - r.left - d / 2) +
        'px;top:' +
        (ev.clientY - r.top - d / 2) +
        'px';
      el.appendChild(s);
      setTimeout(function () {
        s.remove();
      }, 760);
    },
    { passive: true },
  );
  /* count-up for headline numbers when a section opens */
  var NUM =
    '.dashMetric__value,.dashStreak__num,.dashExam__count,.metric b,.progressRing__inner b,#todayStreakValue';
  function countUp(view) {
    if (reduced()) return;
    Array.prototype.forEach.call(view.querySelectorAll(NUM), function (el) {
      var txt = el.textContent,
        m = txt.match(/^(\D*?)(\d+)(\D*)$/);
      if (!m || el.children.length) return;
      var to = parseInt(m[2], 10);
      if (!to || to > 99999) return;
      var t0 = null,
        dur = Math.min(1100, 500 + to * 8);
      function step(t) {
        if (t0 === null) t0 = t;
        if (el.textContent !== txt && t0 !== t && !/^\D*\d+\D*$/.test(el.textContent)) return;
        var k = Math.min(1, (t - t0) / dur),
          e = 1 - Math.pow(1 - k, 3);
        el.textContent = m[1] + Math.round(to * e) + m[3];
        if (k < 1) requestAnimationFrame(step);
        else el.textContent = txt;
      }
      el.textContent = m[1] + '0' + m[3];
      requestAnimationFrame(step);
    });
  }
  var main = document.querySelector('main');
  if (main) {
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        var el = m.target;
        if (el.classList && el.classList.contains('view') && !el.hidden && m.oldValue !== null) countUp(el);
      });
    }).observe(main, {
      attributes: true,
      attributeFilter: ['hidden'],
      attributeOldValue: true,
      subtree: true,
    });
  }
  /* pomodoro running state for the ring glow */
  var pomo = document.querySelector('.pomo'),
    tg = document.getElementById('pomoToggle');
  if (pomo && tg) {
    var sync = function () {
      var r = tg.getAttribute('data-running');
      pomo.classList.toggle(
        'is-running',
        r === null ? /pause|إيقاف|ايقاف|وقف/i.test(tg.textContent) : r === '1',
      );
    };
    new MutationObserver(sync).observe(tg, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-running'],
    });
    sync();
  }
})();
