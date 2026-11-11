/* ================================================================
   KASHKOOL v64 — DESKTOP THEME MOTION PARITY
   Re-enable the same Emberfire / Skybreaker engines used by the mobile build.
   Windows reduced-motion and automatic low-power profiles must not silently
   remove these theme effects on a desktop runtime. Other themes are untouched.
   ================================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var body = document.body;
  if (!root || !body) return;

  function isDesktopRuntime() {
    var ua = (window.navigator && window.navigator.userAgent) || '';
    var electron = /Electron\//i.test(ua) ||
      !!(window.process && window.process.versions && window.process.versions.electron);
    if (electron) return true;
    var finePointer = false;
    try {
      finePointer = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    } catch (e) {}
    return finePointer && (window.innerWidth || 0) >= 820;
  }

  if (!isDesktopRuntime()) return;

  var activeThemes = { fire: true, anime: true, manga: true };
  var saved = null;
  var syncing = false;

  function isTargetTheme() {
    return !!activeThemes[root.getAttribute('data-store-theme') || ''];
  }
  function rememberCurrentProfile() {
    saved = {
      reduceMotion: body.classList.contains('reduce-motion'),
      rich: body.classList.contains('motion-rich'),
      performance: body.classList.contains('motion-performance'),
      ultra: body.classList.contains('motion-ultra'),
      profile: root.getAttribute('data-motion-profile')
    };
  }
  function setClass(name, on) {
    if (body.classList.contains(name) !== on) body.classList.toggle(name, on);
  }
  function forceFullMotion() {
    if (!saved) rememberCurrentProfile();
    root.setAttribute('data-kk-desktop-theme-motion', 'full');
    setClass('reduce-motion', false);
    setClass('motion-performance', false);
    setClass('motion-ultra', false);
    setClass('motion-rich', true);
    if (root.getAttribute('data-motion-profile') !== 'rich') {
      root.setAttribute('data-motion-profile', 'rich');
    }
  }
  function restoreProfile() {
    if (!saved) {
      root.removeAttribute('data-kk-desktop-theme-motion');
      return;
    }
    root.removeAttribute('data-kk-desktop-theme-motion');
    setClass('reduce-motion', saved.reduceMotion);
    setClass('motion-rich', saved.rich);
    setClass('motion-performance', saved.performance);
    setClass('motion-ultra', saved.ultra);
    if (saved.profile) root.setAttribute('data-motion-profile', saved.profile);
    else root.removeAttribute('data-motion-profile');
    saved = null;
  }
  function sync() {
    if (syncing) return;
    syncing = true;
    try {
      if (isTargetTheme()) forceFullMotion();
      else restoreProfile();
    } finally {
      syncing = false;
    }
  }

  var themeObserver = new MutationObserver(sync);
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-store-theme'] });
  var profileObserver = new MutationObserver(function () {
    if (isTargetTheme()) sync();
  });
  profileObserver.observe(body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', sync, { passive: true });
  sync();
})();
