/* ============================================================
   GOLDEOR — Sticky Bar JS
   sticky-bar.js
   Renforce l'opacité du fond glassmorphique au scroll
   ============================================================ */

(function () {
  var stickyBar = document.getElementById('stickyBar');
  if (!stickyBar) return;

  var isScrolled = null;
  var ticking = false;

  function update() {
    var scrolled = window.scrollY > 10;
    if (scrolled !== isScrolled) {
      isScrolled = scrolled;
      stickyBar.classList.toggle('sticky-bar--scrolled', scrolled);
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();
