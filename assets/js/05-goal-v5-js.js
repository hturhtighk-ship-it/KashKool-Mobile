/* ==============================================================
   JS 06/28 · Planner & learning OS · kashkool-goal-v5-js · 3.2 KB
   ============================================================== */
(function () {
  var dlg = document.getElementById('dlgGoal'),
    inp = document.getElementById('goalMinutesInput'),
    save = document.getElementById('goalSaveBtn'),
    hint = document.getElementById('goalDialogHint');
  if (!dlg || !inp || !save) return;
  var MIN = 30,
    MAX = 6000,
    STEP = 15;
  var en = function () {
    return document.documentElement.lang === 'en' || document.documentElement.dir === 'ltr';
  };
  function fmt(m) {
    var h = Math.floor(m / 60),
      r = m % 60;
    return en()
      ? (h ? h + 'h ' : '') + (r || !h ? r + 'm' : '').trim()
      : (h ? h + ' س ' : '') + (r || !h ? r + ' د' : '');
  }
  /* stepper around the number input */
  var wrap = document.createElement('div');
  wrap.className = 'goalStepper';
  var minus = document.createElement('button'),
    plus = document.createElement('button');
  minus.type = plus.type = 'button';
  minus.textContent = '\u2212';
  plus.textContent = '+';
  minus.setAttribute('aria-label', '-15');
  plus.setAttribute('aria-label', '+15');
  inp.parentNode.insertBefore(wrap, inp);
  wrap.append(minus, inp, plus);
  var sum = document.createElement('div');
  sum.className = 'goalSummary';
  sum.setAttribute('aria-live', 'polite');
  wrap.after(sum);
  function value() {
    var n = Math.round(+inp.value);
    return isFinite(n) && inp.value !== '' ? n : NaN;
  }
  function sync() {
    var n = value(),
      ok = n >= MIN && n <= MAX;
    inp.setAttribute('aria-invalid', ok ? 'false' : 'true');
    save.disabled = !ok;
    if (hint) {
      hint.classList.toggle('is-error', !ok);
      if (!ok)
        hint.textContent = en()
          ? 'Enter a value between ' + MIN + ' and ' + MAX + ' minutes.'
          : 'اكتب رقم بين ' + MIN + ' و ' + MAX + ' دقيقة.';
      else
        hint.textContent = en()
          ? 'Choose a preset or enter your own target.'
          : 'اختار هدف جاهز أو اكتب هدفك بنفسك.';
    }
    document.querySelectorAll('.goalPreset').forEach(function (b) {
      b.classList.toggle('is-selected', ok && +b.dataset.goal === n);
    });
    sum.innerHTML = ok
      ? en()
        ? '<span>Total: <b>' +
          fmt(n) +
          '</b></span><span>Daily average: <b>' +
          fmt(Math.ceil(n / 7)) +
          '</b></span>'
        : '<span>الإجمالي: <b>' +
          fmt(n) +
          '</b></span><span>المتوسط اليومي: <b>' +
          fmt(Math.ceil(n / 7)) +
          '</b></span>'
      : '';
  }
  function bump(d) {
    var n = value();
    if (!isFinite(n)) n = 600;
    inp.value = Math.max(MIN, Math.min(MAX, Math.round((n + d) / STEP) * STEP));
    sync();
  }
  minus.addEventListener('click', function () {
    bump(-STEP);
  });
  plus.addEventListener('click', function () {
    bump(STEP);
  });
  inp.addEventListener('input', sync);
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!save.disabled) save.click();
      else sync();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      bump(STEP);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      bump(-STEP);
    }
  });
  document.querySelectorAll('.goalPreset').forEach(function (b) {
    b.addEventListener('click', sync);
  });
  /* re-sync every time the dialog opens (the original handler fills the value first) */
  new MutationObserver(function () {
    if (dlg.open) {
      save.disabled = false;
      sync();
      setTimeout(function () {
        inp.focus();
        inp.select();
      }, 60);
    }
  }).observe(dlg, { attributes: true, attributeFilter: ['open'] });
  /* localise the preset captions */
  new MutationObserver(function () {
    if (!dlg.open) return;
    [
      ['goal5h', 5],
      ['goal10h', 10],
      ['goal15h', 15],
    ].forEach(function (a) {
      var el = document.getElementById(a[0]);
      if (el) el.textContent = en() ? a[1] + ' hours' : a[1] + ' ساعات';
    });
  }).observe(dlg, { attributes: true, attributeFilter: ['open'] });
})();
