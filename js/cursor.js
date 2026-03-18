/* ============================================================
   GOLDEOR — Curseur fusée
   cursor.js
   Transforme le curseur en 🚀 au survol de tous les boutons CTA
   ============================================================ */

(function () {
  'use strict';

  // Pas de curseur custom sur mobile / tactile
  if (window.matchMedia('(hover: none)').matches) return;

  /* ── Création de l'élément curseur ─────────────────────── */
  const rocket = document.createElement('div');
  rocket.id = 'rocket-cursor';
  rocket.textContent = '🚀';
  document.body.appendChild(rocket);

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // requestAnimationFrame pour fluidité maximale
    requestAnimationFrame(() => {
      rocket.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
  }, { passive: true });

  /* ── Sélecteur de tous les boutons CTA du site ─────────── */
  const CTA_SELECTOR = [
    '.sticky-bar__cta',
    '.hero__cta-btn',
    '.prog-card__cta',
    '.btn-primary',
    '[data-cta]',
    '.cta-final__btn',
  ].join(', ');

  /* ── Délégation d'événements — plus performant ─────────── */
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(CTA_SELECTOR)) {
      rocket.classList.add('rocket-cursor--visible');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(CTA_SELECTOR)) {
      rocket.classList.remove('rocket-cursor--visible');
    }
  });
})();
