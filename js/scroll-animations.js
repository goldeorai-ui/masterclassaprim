/* ============================================================
   GOLDEOR — Scroll Animations
   scroll-animations.js
   Utilise IntersectionObserver pour animer les éléments
   au scroll avec la classe .reveal
   ============================================================ */

(function () {
  const REVEAL_CLASS = 'reveal';
  const VISIBLE_CLASS = 'reveal--visible';

  // Tous les éléments avec .reveal
  const elements = document.querySelectorAll('.' + REVEAL_CLASS);

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(VISIBLE_CLASS);
          // Une fois animé, on peut arrêter d'observer
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));

  // ── Problem blocks scroll animation ──
  const problemCards = document.querySelectorAll('.problem-card');
  if (problemCards.length) {
    const pbObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pb-visible');
            pbObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );
    problemCards.forEach((card) => pbObserver.observe(card));
  }
})();
