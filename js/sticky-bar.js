/* ============================================================
   GOLDEOR — Sticky Bar JS
   sticky-bar.js
   Renforce l'opacité du fond glassmorphique au scroll
   ============================================================ */

const stickyBar = document.getElementById('stickyBar');

if (stickyBar) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 10) {
      stickyBar.style.background = 'rgba(0, 0, 0, 0.72)';
      stickyBar.style.backdropFilter = 'blur(20px)';
      stickyBar.style.webkitBackdropFilter = 'blur(20px)';
      stickyBar.style.border = '1px solid rgba(255, 255, 255, 0.10)';
    } else {
      stickyBar.style.background = 'rgba(255, 255, 255, 0.05)';
      stickyBar.style.backdropFilter = 'blur(16px)';
      stickyBar.style.webkitBackdropFilter = 'blur(16px)';
      stickyBar.style.border = '1px solid rgba(255, 255, 255, 0.10)';
    }
  });
}
