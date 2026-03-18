/* ============================================================
   GOLDEOR — Témoignages
   temoignages.js
   Carrousel infini droite→gauche avec drag et touch support
   ============================================================ */

(function () {
  'use strict';

  const wrapper = document.querySelector('.temoignages__track-wrapper');
  const track   = document.querySelector('.temoignages__track');
  if (!track || !wrapper) return;

  /* ── Clonage pour la boucle sans-couture ────────────────── */
  const cards = Array.from(track.querySelectorAll('.temoignage-card'));
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  /* ── Variables d'état ───────────────────────────────────── */
  const SPEED    = 0.55; // px/frame
  let pos        = 0;
  let halfWidth  = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartPos = 0;
  let lastX      = 0;
  let velocity   = 0;

  function measure() {
    halfWidth = track.scrollWidth / 2;
  }

  function loop(pos) {
    if (pos <= -halfWidth) return pos + halfWidth;
    if (pos > 0)           return pos - halfWidth;
    return pos;
  }

  /* ── Animation principale ───────────────────────────────── */
  function tick() {
    if (!isDragging) {
      pos -= SPEED;
      pos  = loop(pos);
    }
    track.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(tick);
  }

  /* ── Drag — souris ──────────────────────────────────────── */
  wrapper.addEventListener('mousedown', (e) => {
    isDragging   = true;
    dragStartX   = e.clientX;
    dragStartPos = pos;
    lastX        = e.clientX;
    velocity     = 0;
    wrapper.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    velocity = e.clientX - lastX;
    lastX    = e.clientX;
    pos = loop(dragStartPos + (e.clientX - dragStartX));
    track.style.transform = `translateX(${pos}px)`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';
    // Inertie légère au relâchement
    let v = velocity;
    (function inertia() {
      if (Math.abs(v) < 0.3) return;
      pos = loop(pos + v);
      v  *= 0.92;
      track.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(inertia);
    })();
  });

  /* ── Drag — touch ───────────────────────────────────────── */
  wrapper.addEventListener('touchstart', (e) => {
    dragStartX   = e.touches[0].clientX;
    dragStartPos = pos;
    lastX        = e.touches[0].clientX;
    velocity     = 0;
    isDragging   = true;
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    velocity = e.touches[0].clientX - lastX;
    lastX    = e.touches[0].clientX;
    pos = loop(dragStartPos + (e.touches[0].clientX - dragStartX));
    track.style.transform = `translateX(${pos}px)`;
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    isDragging = false;
  });

  /* ── Démarrage ──────────────────────────────────────────── */
  measure();
  requestAnimationFrame(tick);
})();

/* ── Animation du score de rating (0 → 4.9) ──────────────────── */
(function () {
  const scoreEl = document.querySelector('.temoignages__rating-score');
  if (!scoreEl) return;

  // Réinitialise à 0 pour l'animation
  scoreEl.textContent = '0.0';

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          observer.unobserve(entry.target);
          animateRating();
        }
      });
    },
    { threshold: 0.6 }
  );

  observer.observe(scoreEl);

  function animateRating() {
    const TARGET   = 4.9;
    const DURATION = 2800; // ms
    const start    = performance.now();

    function easeInQuart(t) {
      // Lent au début, très rapide à la fin
      return t * t * t * t;
    }

    function step(now) {
      const elapsed  = Math.min(now - start, DURATION);
      const progress = elapsed / DURATION;
      const eased    = easeInQuart(progress);
      const value    = eased * TARGET;

      scoreEl.textContent = value.toFixed(1);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        scoreEl.textContent = TARGET.toFixed(1);
      }
    }

    requestAnimationFrame(step);
  }
})();
