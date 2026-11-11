/* ==============================================================
   JS 13/28 · Themes & store · theme-studio-js · 15.9 KB
   ============================================================== */
(function () {
  'use strict';

  var themePresets = {
    default: {
      paper: '#F3EEE4',
      sheet: '#FCF9F2',
      grid: '#E2DACB',
      ink: '#1F2733',
      inkSoft: '#485568',
      inkFaint: '#657182',
      line: '#D7CCB9',
      lineSoft: '#E8E0D4',
      hover: '#EEE7DA',
      field: '#FFFDF9',
      mark: '#C79222',
      markBg: '#F4E9C8',
      margin: '#A83B31',
      ok: '#2F765B',
    },
    ocean: {
      paper: '#E8F4F8',
      sheet: '#F0FAFC',
      grid: '#D4E8ED',
      ink: '#1A2E35',
      inkSoft: '#3D5A63',
      inkFaint: '#5A7A85',
      line: '#CDE4EA',
      lineSoft: '#D9F0F5',
      hover: '#E3F5F8',
      field: '#F8FDFF',
      mark: '#0097A7',
      markBg: '#E0F7FA',
      margin: '#E53935',
      ok: '#00897B',
    },
    forest: {
      paper: '#E8F5E9',
      sheet: '#F1F8E9',
      grid: '#C8E6C9',
      ink: '#1B3320',
      inkSoft: '#2E5A36',
      inkFaint: '#4A7A52',
      line: '#C5E1A5',
      lineSoft: '#DCEDC8',
      hover: '#F1F8E9',
      field: '#FAFFFA',
      mark: '#558B2F',
      markBg: '#F1F8E9',
      margin: '#D32F2F',
      ok: '#388E3C',
    },
    sunset: {
      paper: '#FFF3E0',
      sheet: '#FFF8E1',
      grid: '#FFE0B2',
      ink: '#2D1B10',
      inkSoft: '#5D4037',
      inkFaint: '#795548',
      line: '#FFCC80',
      lineSoft: '#FFE0B2',
      hover: '#FFE8B0',
      field: '#FFFBF0',
      mark: '#FF6F00',
      markBg: '#FFF3E0',
      margin: '#D84315',
      ok: '#F57C00',
    },
    lavender: {
      paper: '#F3E5F5',
      sheet: '#FAFAFA',
      grid: '#E1BEE7',
      ink: '#2A1B36',
      inkSoft: '#4A2C5A',
      inkFaint: '#6A4C7A',
      line: '#CE93D8',
      lineSoft: '#E1BEE7',
      hover: '#F3E5F5',
      field: '#FFFFFF',
      mark: '#7B1FA2',
      markBg: '#F3E5F5',
      margin: '#C62828',
      ok: '#8E24AA',
    },
    midnight: {
      paper: '#1A1A2E',
      sheet: '#16213E',
      grid: '#0F3460',
      ink: '#E6E6E6',
      inkSoft: '#B8B8B8',
      inkFaint: '#8A8A8A',
      line: '#533483',
      lineSoft: '#16213E',
      hover: '#1F1F3A',
      field: '#0D0D1A',
      mark: '#E94560',
      markBg: '#2A2A4A',
      margin: '#FF6B6B',
      ok: '#00D9FF',
    },
    darkProfessional: {
      paper: '#0D1117',
      sheet: '#161B22',
      grid: '#21262D',
      ink: '#C9D1D9',
      inkSoft: '#8B949E',
      inkFaint: '#6E7681',
      line: '#30363D',
      lineSoft: '#21262D',
      hover: '#1C2128',
      field: '#0D1117',
      mark: '#58A6FF',
      markBg: '#1F6FEB',
      margin: '#F85149',
      ok: '#3FB950',
    },
    softDark: {
      paper: '#1E1E2E',
      sheet: '#282840',
      grid: '#3E3E5E',
      ink: '#E0E0E0',
      inkSoft: '#B0B0C0',
      inkFaint: '#808090',
      line: '#4E4E6E',
      lineSoft: '#383858',
      hover: '#2E2E4E',
      field: '#1A1A2E',
      mark: '#FF79C6',
      markBg: '#44475A',
      margin: '#FF5555',
      ok: '#50FA7B',
    },
  };

  function initThemeStudio() {
    var applyBtn = document.getElementById('ts-apply');
    var resetBtn = document.getElementById('ts-reset');
    var exportBtn = document.getElementById('ts-export');
    var importBtn = document.getElementById('ts-import');

    if (!applyBtn) return;
    var studioView = document.getElementById('view-themeStudio');
    if (studioView && studioView.dataset.themeStudioBound === '1') return;
    if (studioView) studioView.dataset.themeStudioBound = '1';

    // Color inputs
    var colorInputs = {
      'ts-paper': 'paper',
      'ts-sheet': 'sheet',
      'ts-ink': 'ink',
      'ts-ink-soft': 'inkSoft',
      'ts-ink-faint': 'inkFaint',
      'ts-line-soft': 'lineSoft',
      'ts-hover': 'hover',
      'ts-field': 'field',
      'ts-mark': 'mark',
      'ts-mark-bg': 'markBg',
      'ts-margin': 'margin',
      'ts-ok': 'ok',
      'ts-line': 'line',
      'ts-grid': 'grid',
    };

    // Load saved theme
    var savedTheme = localStorage.getItem('kashkool-custom-theme');
    if (savedTheme) {
      try {
        var theme = JSON.parse(savedTheme);
        if (isStudioDefaultTheme()) applyTheme(theme);
        updateColorInputs(theme);
      } catch (e) {
        console.error('Failed to load saved theme:', e);
      }
    }

    // Apply button
    applyBtn.addEventListener('click', function (e) {
      var rect = this.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;

      var theme = {};
      for (var id in colorInputs) {
        var input = document.getElementById(id);
        if (input) {
          theme[colorInputs[id]] = input.value;
        }
      }

      // Add applying animation
      this.classList.add('applying');
      var self = this;
      setTimeout(function () {
        self.classList.remove('applying');
      }, 600);

      // Create ripple effect
      createThemeRipple(x, y, theme.mark || theme.paper);

      // Apply theme with transition
      document.body.classList.add('theme-transition-active');

      setTimeout(function () {
        if (!applyTheme(theme)) {
          document.body.classList.remove('theme-transition-active');
          return;
        }
        localStorage.setItem('kashkool-custom-theme', JSON.stringify(theme));

        setTimeout(function () {
          document.body.classList.remove('theme-transition-active');
          notice(studioText('تم تطبيق الثيم بنجاح! ✓', 'Theme applied successfully! ✓'), true);
        }, 600);
      }, 50);
    });

    // Reset button
    resetBtn.addEventListener('click', function (e) {
      var rect = this.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;

      createThemeRipple(x, y, themePresets.default.paper);

      document.body.classList.add('theme-transition-active');

      setTimeout(function () {
        applyTheme(themePresets.default);
        updateColorInputs(themePresets.default);
        localStorage.removeItem('kashkool-custom-theme');

        setTimeout(function () {
          document.body.classList.remove('theme-transition-active');
          notice(studioText('تم إعادة تعيين الثيم', 'Theme reset'), true);
        }, 600);
      }, 50);
    });

    // Export button
    exportBtn.addEventListener('click', function () {
      var theme = {};
      for (var id in colorInputs) {
        var input = document.getElementById(id);
        if (input) {
          theme[colorInputs[id]] = input.value;
        }
      }
      var dataStr = JSON.stringify(theme, null, 2);
      var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      var exportFileDefaultName = 'kashkool-theme.json';
      var linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    });

    // Import button
    importBtn.addEventListener('click', function () {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
          try {
            var theme = JSON.parse(e.target.result);
            if (!applyTheme(theme)) return;
            updateColorInputs(theme);
            localStorage.setItem('kashkool-custom-theme', JSON.stringify(theme));
            notice(studioText('تم استيراد الثيم بنجاح! ✓', 'Theme imported successfully! ✓'));
          } catch (err) {
            notice('خطأ في قراءة ملف الثيم');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    });

    // Preset buttons
    document.querySelectorAll('.themeStudio__preset').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var presetName = this.getAttribute('data-theme');
        if (themePresets[presetName]) {
          var rect = this.getBoundingClientRect();
          var x = rect.left + rect.width / 2;
          var y = rect.top + rect.height / 2;

          createThemeRipple(x, y, themePresets[presetName].paper);

          document.body.classList.add('theme-transition-active');

          setTimeout(function () {
            if (!isStudioDefaultTheme()) {
              document.body.classList.remove('theme-transition-active');
              return;
            }
            applyTheme(themePresets[presetName]);
            updateColorInputs(themePresets[presetName]);
            localStorage.setItem('kashkool-custom-theme', JSON.stringify(themePresets[presetName]));

            setTimeout(function () {
              document.body.classList.remove('theme-transition-active');
              notice(studioText('تم تطبيق الثيم: ', 'Applied theme: ') + btn.textContent.trim(), true);
            }, 600);
          }, 50);
        }
      });
    });

    // Live preview on color change
    for (var id in colorInputs) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', function () {
          document.body.classList.add('theme-transition-active');

          var theme = {};
          for (var i in colorInputs) {
            var inp = document.getElementById(i);
            if (inp) {
              theme[colorInputs[i]] = inp.value;
            }
          }
          applyTheme(theme);
          studioContrast(theme);

          // Debounce the transition removal
          clearTimeout(this._transitionTimer);
          this._transitionTimer = setTimeout(function () {
            document.body.classList.remove('theme-transition-active');
          }, 100);
        });
      }
    }
  }

  function isStudioDefaultTheme() {
    var active = document.documentElement.getAttribute('data-store-theme');
    return !active || active === 'classic';
  }
  function isStudioDark() {
    var mode = document.documentElement.getAttribute('data-theme');
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function studioText(ar, en) {
    return document.documentElement.lang === 'en' ? en : ar;
  }
  function studioDarkPalette(theme) {
    var t = Object.assign({}, theme || {});
    t.paper = '#111720';
    t.sheet = '#1A2330';
    t.grid = '#222D3A';
    t.ink = '#F1F5F9';
    t.inkSoft = '#CED7E2';
    t.inkFaint = '#A5B1C1';
    t.line = '#354355';
    t.lineSoft = '#293544';
    t.hover = '#242F3D';
    t.field = '#141D28';
    if (t.markBg && /^#[0-9a-f]{6}$/i.test(t.markBg)) {
      var c = t.markBg.slice(1),
        r = parseInt(c.slice(0, 2), 16),
        g = parseInt(c.slice(2, 4), 16),
        b = parseInt(c.slice(4, 6), 16);
      t.markBg =
        '#' +
        [r, g, b]
          .map(function (v) {
            return Math.round(v * 0.24 + 15)
              .toString(16)
              .padStart(2, '0');
          })
          .join('');
    } else t.markBg = '#3C3420';
    return t;
  }
  function clearStudioInlinePalette(clearAccent) {
    var root = document.documentElement;
    [
      '--paper',
      '--sheet',
      '--grid',
      '--ink',
      '--ink-soft',
      '--ink-faint',
      '--line',
      '--line-soft',
      '--hover',
      '--field',
      '--margin',
      '--ok',
    ].forEach(function (k) {
      root.style.removeProperty(k);
    });
    if (clearAccent) {
      root.style.removeProperty('--mark');
      root.style.removeProperty('--mark-bg');
    }
  }
  function studioContrast(theme) {
    var el = document.getElementById('ts-contrast-value');
    if (!el) return;
    var ink =
      (theme && theme.ink) ||
      getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() ||
      '#202020';
    var bg =
      (theme && theme.sheet) ||
      getComputedStyle(document.documentElement).getPropertyValue('--sheet').trim() ||
      '#ffffff';
    function lum(hex) {
      var m = String(hex).match(/[0-9a-f]{2}/gi);
      if (!m || m.length < 3) return 0;
      return m
        .slice(0, 3)
        .map(function (x) {
          var v = parseInt(x, 16) / 255;
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        })
        .reduce(function (a, v, i) {
          return a + v * [0.2126, 0.7152, 0.0722][i];
        }, 0);
    }
    var ratio = (Math.max(lum(ink), lum(bg)) + 0.05) / (Math.min(lum(ink), lum(bg)) + 0.05),
      good = ratio >= 4.5;
    el.textContent = ratio.toFixed(1) + ':1';
    var title = document.getElementById('ts-contrast-title'),
      desc = document.getElementById('ts-contrast-desc'),
      icon = document.getElementById('ts-contrast-icon'),
      host = document.getElementById('ts-contrast');
    if (title)
      title.textContent = studioText(
        good ? 'وضوح جيد' : 'يحتاج تحسينًا',
        good ? 'Good readability' : 'Improve readability',
      );
    if (desc)
      desc.textContent = studioText(
        good ? 'تباين النص مناسب للقراءة.' : 'جرّب تغميق النص أو تفتيح خلفية البطاقة.',
        good ? 'Text contrast is suitable for reading.' : 'Try darker text or a lighter card background.',
      );
    if (icon) icon.textContent = good ? '✓' : '!';
    if (host) host.classList.toggle('is-warning', !good);
    el.style.color = good ? 'var(--ok)' : 'var(--margin)';
  }
  function applyTheme(theme) {
    if (!isStudioDefaultTheme()) {
      clearStudioInlinePalette(true);
      return false;
    }
    var root = document.documentElement,
      palette = isStudioDark() ? studioDarkPalette(theme) : Object.assign({}, theme || {});
    var vars = {
      paper: '--paper',
      sheet: '--sheet',
      grid: '--grid',
      ink: '--ink',
      inkSoft: '--ink-soft',
      inkFaint: '--ink-faint',
      line: '--line',
      lineSoft: '--line-soft',
      hover: '--hover',
      field: '--field',
      mark: '--mark',
      markBg: '--mark-bg',
      margin: '--margin',
      ok: '--ok',
    };
    Object.keys(vars).forEach(function (k) {
      if (palette[k]) root.style.setProperty(vars[k], palette[k], 'important');
    });
    studioContrast(palette);
    var previewCard = document.querySelector('.themeStudio__card');
    if (previewCard) {
      previewCard.classList.add('updating');
      setTimeout(function () {
        previewCard.classList.remove('updating');
      }, 400);
    }
    return true;
  }
  function syncStudioControls() {
    var disabled = !isStudioDefaultTheme();
    document
      .querySelectorAll(
        '#view-themeStudio input[type="color"],#view-themeStudio .themeStudio__preset,#ts-apply,#ts-reset,#ts-import',
      )
      .forEach(function (el) {
        el.disabled = disabled;
      });
    var note = document.getElementById('ts-store-note');
    if (note) note.classList.toggle('is-store-locked', disabled);
  }
  window.KashkoolThemeStudioRefreshMode = function () {
    syncStudioControls();
    if (!isStudioDefaultTheme()) {
      clearStudioInlinePalette(true);
      return;
    }
    var saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('kashkool-custom-theme') || 'null');
    } catch (e) {}
    if (saved) applyTheme(saved);
    else {
      clearStudioInlinePalette(false);
      studioContrast(null);
    }
  };
  if (window.matchMedia) {
    var q = window.matchMedia('(prefers-color-scheme: dark)');
    var modeRefresh = function () {
      if (!document.documentElement.hasAttribute('data-theme')) window.KashkoolThemeStudioRefreshMode();
    };
    if (q.addEventListener) q.addEventListener('change', modeRefresh);
    else if (q.addListener) q.addListener(modeRefresh);
  }

  function createThemeRipple(x, y, color) {
    var overlay = document.createElement('div');
    overlay.className = 'theme-ripple-overlay';
    overlay.style.setProperty('--ripple-x', x + 'px');
    overlay.style.setProperty('--ripple-y', y + 'px');
    overlay.style.setProperty('--ripple-color', color);
    document.body.appendChild(overlay);

    setTimeout(function () {
      overlay.remove();
    }, 800);
  }

  function updateColorInputs(theme) {
    for (var key in theme) {
      var id = 'ts-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
      var input = document.getElementById(id);
      if (input) {
        input.value = theme[key];
      }
    }
  }

  function notice(msg, isThemeChange) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast' + (isThemeChange ? ' theme-change' : '');
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, 3000);
  }

  // Initialize when Theme Studio view is shown
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === 'hidden') {
        var view = document.getElementById('view-themeStudio');
        if (view && !view.hidden) {
          initThemeStudio();
        }
      }
    });
  });

  var themeStudioView = document.getElementById('view-themeStudio');
  if (themeStudioView) {
    observer.observe(themeStudioView, { attributes: true });
  }

  // Also try to initialize immediately
  if (themeStudioView && !themeStudioView.hidden) {
    initThemeStudio();
  }
})();
