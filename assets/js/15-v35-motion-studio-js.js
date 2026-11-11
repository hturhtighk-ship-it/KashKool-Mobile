/* ==============================================================
   JS 16/28 · Motion · kashkool-v35-motion-studio-js · 4.3 KB
   ============================================================== */
(function () {
  'use strict';
  var root = document.documentElement,
    body = document.body,
    key = 'kashkool.theme.motion.settings.v1';
  var speeds = {
    fast: { page: '0.42s', card: '0.34s', wipe: '0.48s', stagger: '12ms' },
    smooth: { page: '0.68s', card: '0.52s', wipe: '0.78s', stagger: '28ms' },
    cinematic: { page: '0.92s', card: '0.68s', wipe: '1.08s', stagger: '42ms' },
  };
  var prefs = { speed: 'smooth', particles: true };
  function getLang() {
    return root.lang === 'en' ? 'en' : 'ar';
  }
  function text(ar, en) {
    return getLang() === 'en' ? en : ar;
  }
  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(key) || 'null');
      if (v && typeof v === 'object') {
        if (speeds[v.speed]) prefs.speed = v.speed;
        if (typeof v.particles === 'boolean') prefs.particles = v.particles;
      }
    } catch (e) {}
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(prefs));
    } catch (e) {}
  }
  function apply() {
    var speed = speeds[prefs.speed] || speeds.smooth;
    root.style.setProperty('--kk-motion-page-duration', speed.page);
    root.style.setProperty('--kk-motion-card-duration', speed.card);
    root.style.setProperty('--kk-motion-wipe-duration', speed.wipe);
    root.style.setProperty('--kk-motion-stagger', speed.stagger);
    body.classList.toggle('motion-particles-off', !prefs.particles);
    var speedEl = document.getElementById('ts-motion-speed'),
      particlesEl = document.getElementById('ts-motion-particles');
    if (speedEl) speedEl.value = prefs.speed;
    if (particlesEl) particlesEl.checked = prefs.particles;
  }
  function localize() {
    var en = getLang() === 'en',
      speedEl = document.getElementById('ts-motion-speed'),
      button = document.getElementById('ts-motion-preview');
    var map = {
      'ts-motion-title': ['الحركة والمؤثرات', 'Motion & effects'],
      'ts-motion-desc': [
        'خصّص سرعة الانتقالات والمؤثرات المحيطة مع الحفاظ على شخصية كل ثيم.',
        'Tune transition speed and ambient effects while keeping every theme’s unique motion style.',
      ],
      'ts-motion-speed-label': ['سرعة الانتقالات', 'Transition speed'],
      'ts-motion-particles-label': ['المؤثرات المحيطة', 'Ambient effects'],
      'ts-motion-particles-desc': [
        'إظهار الجسيمات الخفيفة الخاصة بالثيم.',
        'Show lightweight theme particles.',
      ],
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = map[id][en ? 1 : 0];
    });
    if (speedEl && speedEl.options.length === 3) {
      speedEl.options[0].textContent = en ? 'Fast' : 'سريع';
      speedEl.options[1].textContent = en ? 'Balanced' : 'متوازن';
      speedEl.options[2].textContent = en ? 'Cinematic' : 'سينمائي';
    }
    if (button && !button.classList.contains('is-playing'))
      button.textContent = en ? '▶ Preview theme motion' : '▶ معاينة حركة الثيم';
  }
  function preview() {
    var card = document.querySelector('#view-themeStudio .themeStudio__card'),
      status = document.getElementById('ts-motion-status'),
      button = document.getElementById('ts-motion-preview');
    if (!card) return;
    if (body.classList.contains('reduce-motion') || body.classList.contains('motion-ultra')) {
      if (status)
        status.textContent = text(
          'الحركة متوقفة في وضع الأداء الحالي.',
          'Motion is disabled by the current performance mode.',
        );
      return;
    }
    card.classList.remove('ts-motion-demo');
    void card.offsetWidth;
    card.classList.add('ts-motion-demo');
    if (status) status.textContent = text('جاري عرض حركة الثيم…', 'Playing theme motion…');
    if (button) {
      button.classList.add('is-playing');
      button.textContent = text('جاري المعاينة…', 'Previewing…');
    }
    window.setTimeout(
      function () {
        card.classList.remove('ts-motion-demo');
        if (status) status.textContent = text('تمت المعاينة', 'Preview finished');
        if (button) {
          button.classList.remove('is-playing');
          button.textContent = text('▶ معاينة حركة الثيم', '▶ Preview theme motion');
        }
      },
      Math.min(1300, parseFloat((speeds[prefs.speed] || speeds.smooth).page) * 1000 + 120),
    );
  }
  read();
  apply();
  localize();
  var speed = document.getElementById('ts-motion-speed'),
    particles = document.getElementById('ts-motion-particles'),
    previewButton = document.getElementById('ts-motion-preview');
  if (speed)
    speed.addEventListener('change', function () {
      prefs.speed = speeds[this.value] ? this.value : 'smooth';
      save();
      apply();
    });
  if (particles)
    particles.addEventListener('change', function () {
      prefs.particles = this.checked;
      save();
      apply();
    });
  if (previewButton) previewButton.addEventListener('click', preview);
  if (window.MutationObserver)
    new MutationObserver(function () {
      localize();
    }).observe(root, { attributes: true, attributeFilter: ['lang', 'data-store-theme'] });
  window.KashkoolMotionV35 = { apply: apply, preview: preview };
})();
