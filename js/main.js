/* ============================================================
   GOLDEOR — Main JS
   main.js
   Point d'entrée — initialise tous les modules au chargement
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Smooth scroll pour les liens ancres internes ──────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Active state sur la sticky bar ────────────────────────
  // (géré par sticky-bar.js)

  // ── Carousel logos (duplication) ─────────────────────────
  // (géré par carousel-logos.js)

  // ── Carousel profils ─────────────────────────────────────
  // (géré par carousel-profils.js)

  // ── Animations scroll ────────────────────────────────────
  // (géré par scroll-animations.js)

  // ── Compteur footer ──────────────────────────────────────
  // (géré par counter.js)

  // ── Countdown ────────────────────────────────────────────
  // (géré par countdown.js)

  // ── Témoignages ──────────────────────────────────────────
  // (géré par temoignages.js)

  // ── Blobs parallax ───────────────────────────────────────
  // (géré par blobs.js)

  console.log('%c✦ Goldeor — MasterClass Mai 2026',
    'color: #47FFEE; font-weight: bold; font-size: 14px;');
});
