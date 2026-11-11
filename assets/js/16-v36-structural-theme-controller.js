/* ==============================================================
   JS 17/28 · Themes & store · kashkool-v36-structural-theme-controller · 1.4 KB
   ============================================================== */
(function () {
  'use strict';
  var root = document.documentElement,
    wrap = document.querySelector('.wrap');
  if (!root || !wrap) return;
  var timer = 0,
    last = '';
  function motionAllowed() {
    if (
      document.body &&
      (document.body.classList.contains('reduce-motion') || document.body.classList.contains('motion-ultra'))
    )
      return false;
    return !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function applyStructure(animate) {
    var theme = root.getAttribute('data-store-theme') || 'classic';
    if (!/^(classic|school|football|galaxy|cyber|nature|academia|ocean|sunset|mono)$/.test(theme))
      theme = 'classic';
    root.setAttribute('data-layout-theme', theme);
    if (theme === last) return;
    last = theme;
    if (!animate || !motionAllowed()) return;
    wrap.classList.remove('kk-structure-enter');
    void wrap.offsetWidth;
    wrap.classList.add('kk-structure-enter');
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      wrap.classList.remove('kk-structure-enter');
      timer = 0;
    }, 560);
  }
  applyStructure(false);
  if (window.MutationObserver) {
    var observer = new MutationObserver(function (records) {
      if (
        records.some(function (r) {
          return r.attributeName === 'data-store-theme';
        })
      )
        applyStructure(true);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
  }
  window.KashkoolStructuralThemes = {
    refresh: function () {
      applyStructure(false);
    },
    getActive: function () {
      return last;
    },
  };
})();
