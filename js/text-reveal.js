/* ============================================================
   GOLDEOR — Text Reveal on Scroll
   text-reveal.js
   Effet lumière progressive sur les paragraphes de la
   section problème — s'allume au scroll, se tamise après
   - rAF-throttled pour éviter les jank
   ============================================================ */

(function () {
  'use strict';

  var paras = document.querySelectorAll('.probleme__p, .probleme__quote');
  if (!paras.length) return;

  var ticking = false;

  function updateReveal() {
    var viewH = window.innerHeight;
    var focus = viewH * 0.42;

    for (var i = 0; i < paras.length; i++) {
      var p = paras[i];
      var rect = p.getBoundingClientRect();
      var mid = (rect.top + rect.bottom) / 2;
      var opacity;

      if (mid > viewH + 60) {
        opacity = 0.12;
      } else if (mid < -60) {
        opacity = 0.28;
      } else {
        var dist = Math.abs(mid - focus);
        var zone = viewH * 0.52;
        opacity = 1 - (dist / zone) * 0.88;
        opacity = Math.max(0.12, Math.min(1, opacity));
        if (mid < focus) opacity = Math.max(0.28, opacity);
      }

      p.style.opacity = opacity.toFixed(3);
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateReveal);
      ticking = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateReveal);
  } else {
    updateReveal();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();
