/* ==============================================================
   JS 14/28 · Search & language · kashkool-v29-search-language · 7.5 KB
   ============================================================== */
(function () {
  'use strict';
  var root = document.documentElement,
    searchKey = 'kashkool.search.visible.v1';
  function searchVisible() {
    try {
      return localStorage.getItem(searchKey) !== '0';
    } catch (e) {
      return true;
    }
  }
  function applySearchVisible() {
    var visible = searchVisible();
    root.classList.toggle('search-hidden', !visible);
    var input = document.getElementById('searchVisibilitySetting');
    if (input) input.checked = visible;
    // Closing the native dialog matters: display:none alone may leave an open dialog in the top layer.
    if (!visible) {
      var dlg = document.getElementById('dlgSearch');
      if (dlg && dlg.open) {
        try {
          dlg.close();
        } catch (e) {}
      }
    }
  }
  function setSearchVisible(visible) {
    try {
      localStorage.setItem(searchKey, visible ? '1' : '0');
    } catch (e) {}
    applySearchVisible();
  }
  function localize() {
    var en = root.lang === 'en';
    var words = {
      todayHomeworkHeading: ['الواجبات القادمة', 'Upcoming homework'],
      todayHomeworkAdd: ['+ واجب', '+ Homework'],
      'ts-heading': ['🎨 استوديو الثيمات', '🎨 Theme Studio'],
      'ts-subheading': ['خصص ألوان واجهة التطبيق حسب رغبتك', 'Customize the look and feel of Kashkool'],
      'ts-preview-kicker': ['معاينة مباشرة', 'LIVE PREVIEW'],
      'ts-live-badge': ['مباشر', 'LIVE'],
      'ts-preview-title': ['شكل الكشكول بعد تطبيق الثيم', 'How Kashkool will look with this theme'],
      'ts-preview-copy': [
        'غيّر الألوان وشاهد تأثيرها فورًا على البطاقات والأزرار والنصوص.',
        'Change the colors and preview their effect on cards, buttons, and text.',
      ],
      'ts-preview-primary': ['زر أساسي', 'Primary button'],
      'ts-preview-secondary': ['زر ثانوي', 'Secondary button'],
      'ts-components-eyebrow': ['مكونات الواجهة', 'UI COMPONENTS'],
      'ts-components-title': ['مش مجرد ألوان', 'More than colors'],
      'ts-components-hint': ['معاينة حية', 'Live preview'],
      'ts-metric-one-label': ['وقت المذاكرة', 'Study time'],
      'ts-metric-two-label': ['الواجبات', 'Homework'],
      'ts-metric-three-label': ['الستريك', 'Streak'],
      'ts-metric-three-hint': ['أيام متتالية', 'Days in a row'],
      'ts-schedule-title': ['جلسة المذاكرة القادمة', 'Next study session'],
      'ts-schedule-subtitle': ['رياضيات · ٤:٣٠ م', 'Math · 4:30 PM'],
      'ts-schedule-state': ['قريبًا', 'Upcoming'],
      'ts-sample-progress-label': ['التقدم اليومي', 'Daily progress'],
      'ts-timer-eyebrow': ['وضع التركيز', 'FOCUS MODE'],
      'ts-timer-caption': ['وقت للتركيز، بعيدًا عن المشتتات', 'Time to focus, away from distractions'],
      'ts-contrast-title': ['وضوح النص', 'Text readability'],
      'ts-contrast-desc': [
        'نحسب التباين بين النص وخلفية البطاقة.',
        'Contrast between text and card background.',
      ],
      'ts-store-note-text': [
        'تخصيص الألوان يعمل مع الثيم الافتراضي؛ ثيمات المتجر تحتفظ بهويتها وألوانها.',
        'Custom colors apply to the default theme; store themes keep their own identity and palette.',
      ],
      'ts-apply': ['تطبيق الثيم', 'Apply theme'],
      'ts-reset': ['إعادة تعيين', 'Reset'],
      'ts-export': ['تصدير', 'Export'],
      'ts-import': ['استيراد', 'Import'],
      'ts-basic-title': ['الألوان الأساسية', 'Base colors'],
      'ts-paper-label': ['الخلفية الرئيسية', 'Page background'],
      'ts-sheet-label': ['خلفية البطاقات', 'Card background'],
      'ts-ink-label': ['لون النص', 'Text color'],
      'ts-ink-soft-label': ['لون النص الثانوي', 'Secondary text'],
      'ts-ink-faint-label': ['لون النص الهادئ', 'Muted text'],
      'ts-accent-title': ['ألوان التمييز', 'Accent colors'],
      'ts-mark-label': ['اللون الرئيسي', 'Primary accent'],
      'ts-mark-bg-label': ['خلفية التمييز', 'Accent background'],
      'ts-margin-label': ['لون التنبيه', 'Alert color'],
      'ts-ok-label': ['لون النجاح', 'Success color'],
      'ts-borders-title': ['الحدود والخطوط', 'Borders and lines'],
      'ts-line-label': ['لون الحدود', 'Border color'],
      'ts-line-soft-label': ['لون الفواصل', 'Divider color'],
      'ts-grid-label': ['خط الشبكة', 'Grid lines'],
      'ts-hover-label': ['خلفية التفاعل', 'Hover background'],
      'ts-field-label': ['خلفية حقول الإدخال', 'Input background'],
      'ts-control-tip': ['يمكنك تجربة كل تعديل مباشرة قبل حفظه.', 'Preview each change before saving.'],
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
      'ts-motion-preview': ['▶ معاينة حركة الثيم', '▶ Preview theme motion'],
      'ts-motion-preview-playing': ['جاري عرض حركة الثيم…', 'Playing theme motion…'],
      'ts-motion-preview-done': ['تمت المعاينة', 'Preview finished'],
      'ts-motion-preview-disabled': [
        'الحركة متوقفة في وضع الأداء الحالي.',
        'Motion is disabled by the current performance mode.',
      ],
      'ts-presets-title': ['ثيمات جاهزة', 'Ready-made palettes'],
      'ts-preset-default-label': ['الافتراضي', 'Default'],
      'ts-preset-ocean-label': ['محيط', 'Ocean'],
      'ts-preset-forest-label': ['غابة', 'Forest'],
      'ts-preset-sunset-label': ['غروب', 'Sunset'],
      'ts-preset-lavender-label': ['خزامى', 'Lavender'],
      'ts-metric-one-value': ['2س 35د', '2h 35m'],
      settingsPersonalizationSection: ['التخصيص', 'Personalization'],
      storeEyebrow: ['متجر الكشكول', 'Kashkool Store'],
      storeHeading: ['ثيمات المتجر', 'Store themes'],
      storeHint: [
        'حوّل وقت مذاكرتك لشكل جديد للكشكول.',
        'Turn your study time into a fresh new look for Kashkool.',
      ],
      storeBalanceLabel: ['رصيد المذاكرة', 'Study balance'],
      storeNote: [
        'كل 60 دقيقة مذاكرة مكتملة = ساعة واحدة قابلة للإنفاق. مشترياتك محفوظة داخل حسابك.',
        'Every 60 completed minutes of study = 1 spendable hour. Your purchases are saved inside your account.',
      ],
    };
    Object.keys(words).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = words[id][en ? 1 : 0];
    });
    var sr = document.getElementById('searchVisibilityLabel'),
      sd = document.getElementById('searchVisibilityDesc');
    var removeBtn = document.getElementById('disableSearchBtn');
    if (removeBtn) removeBtn.textContent = en ? 'Remove search from site' : 'إزالة البحث من الواجهة';
    if (sr) sr.textContent = en ? 'Show search' : 'إظهار البحث';
    if (sd)
      sd.textContent = en
        ? 'Permanently hide or restore the search button, search window, and search actions.'
        : 'إخفاء زر البحث ونافذته وخياراته من الموقع أو استعادتها من هنا.';
    var motionPreviewBtn = document.getElementById('ts-motion-preview');
    if (motionPreviewBtn) motionPreviewBtn.textContent = words['ts-motion-preview'][en ? 1 : 0];
    var speed = document.getElementById('ts-motion-speed');
    if (speed && speed.options.length === 3) {
      speed.options[0].textContent = en ? 'Fast' : 'سريع';
      speed.options[1].textContent = en ? 'Balanced' : 'متوازن';
      speed.options[2].textContent = en ? 'Cinematic' : 'سينمائي';
    }
    var motionProfile = document.getElementById('motionProfileSetting');
    if (motionProfile && motionProfile.options.length === 4) {
      motionProfile.options[0].textContent = en ? 'Auto (recommended)' : 'تلقائي (موصى به)';
      motionProfile.options[1].textContent = en ? 'Full visual effects' : 'مؤثرات كاملة';
      motionProfile.options[2].textContent = en ? 'Balanced performance' : 'أداء متوازن';
      motionProfile.options[3].textContent = en ? 'Maximum performance' : 'أقصى أداء';
    }
    if (window.KashkoolThemeStudioRefreshMode) window.KashkoolThemeStudioRefreshMode();
  }
  applySearchVisible();
  var searchToggle = document.getElementById('searchVisibilitySetting');
  if (searchToggle)
    searchToggle.addEventListener('change', function () {
      setSearchVisible(this.checked);
    });
  var disableSearchBtn = document.getElementById('disableSearchBtn');
  if (disableSearchBtn)
    disableSearchBtn.addEventListener('click', function () {
      setSearchVisible(false);
    });
  localize();
  if (window.MutationObserver)
    new MutationObserver(function () {
      localize();
      applySearchVisible();
    }).observe(root, { attributes: true, attributeFilter: ['lang', 'data-theme', 'data-store-theme'] });
  if (window.KashkoolThemeStudioRefreshMode) window.KashkoolThemeStudioRefreshMode();
})();
