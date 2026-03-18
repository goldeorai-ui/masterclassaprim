/* ============================================================
   GOLDEOR — Carousel Logos
   carousel-logos.js
   Duplique les cartes pour créer un scroll infini parfait.
   La piste se met en pause si une carte est survolée.
   ============================================================ */

(function () {
  const track = document.querySelector('.logos__track');
  if (!track) return;

  // Duplique toutes les cartes pour le loop sans-couture
  const cards = Array.from(track.querySelectorAll('.logos__card'));
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Pause individuelle sur chaque carte (y compris les clones)
  track.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.logos__card');
    if (card) track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();
