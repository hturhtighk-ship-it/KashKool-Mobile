/* ==============================================================
   JS 01/28 · Head bootstrap · 0.2 KB
   ============================================================== */
(function () {
  var d = document.documentElement;
  try {
    var en = localStorage.getItem('kashkool.lang') === 'en';
    d.lang = en ? 'en' : 'ar';
    d.dir = en ? 'ltr' : 'rtl';
  } catch (e) {}
})();
