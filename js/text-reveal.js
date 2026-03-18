/* ============================================================
   GOLDEOR — Text Reveal on Scroll
   text-reveal.js
   Effet lumière progressive sur les paragraphes de la
   section problème — s'allume au scroll, se tamise après
   ============================================================ */

(function () {
  'use strict';

  function updateReveal() {
    var paras = document.querySelectorAll('.probleme__p, .probleme__quote');
    if (!paras.length) return;

    var viewH  = window.innerHeight;
    var focus  = viewH * 0.42; // point de lumière : 42 % depuis le haut

    paras.forEach(function (p) {
      var rect = p.getBoundingClientRect();
      var mid  = (rect.top + rect.bottom) / 2;
      var opacity;

      if (mid > viewH + 60) {
        // Pas encore atteint
        opacity = 0.12;
      } else if (mid < -60) {
        // Déjà passé
        opacity = 0.28;
      } else {
        var dist = Math.abs(mid - focus);
        var zone = viewH * 0.52;
        opacity  = 1 - (dist / zone) * 0.88;
        opacity  = Math.max(0.12, Math.min(1, opacity));

        // Paragraphes déjà au-dessus du focus : plancher plus haut
        if (mid < focus) {
          opacity = Math.max(0.28, opacity);
        }
      }

      p.style.opacity = opacity.toFixed(3);
    });
  }

  // Lance au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateReveal);
  } else {
    updateReveal();
  }

  window.addEventListener('scroll',  updateReveal, { passive: true });
  window.addEventListener('resize',  updateReveal, { passive: true });
})();
