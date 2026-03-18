/* ============================================================
   GOLDEOR — Carousel Profils
   carousel-profils.js
   Drag + boutons prev/next + dots
   ============================================================ */

(function () {
  const wrapper = document.querySelector('.profils__track-wrapper');
  const track   = document.querySelector('.profils__track');
  const prevBtn = document.querySelector('.profils__nav-btn--prev');
  const nextBtn = document.querySelector('.profils__nav-btn--next');
  const dotsContainer = document.querySelector('.profils__dots');

  if (!track) return;

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let dragOffset = 0;

  const cards = track.querySelectorAll('.profils__card');
  const total = cards.length;

  // Compute cards per view
  function getCardsPerView() {
    const ww = window.innerWidth;
    if (ww >= 1024) return 3;
    if (ww >= 640)  return 2;
    return 1;
  }

  function getCardWidth() {
    if (!cards[0]) return 280;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.gap) || 20;
    return cards[0].offsetWidth + gap;
  }

  function maxIndex() {
    return Math.max(0, total - getCardsPerView());
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  // Dots
  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'profils__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.profils__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  // Buttons
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Drag
  if (wrapper) {
    wrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      track.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      dragOffset = e.clientX - startX;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = '';
      if (dragOffset < -60) goTo(currentIndex + 1);
      else if (dragOffset > 60) goTo(currentIndex - 1);
      else goTo(currentIndex);
      dragOffset = 0;
    });

    // Touch
    wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (diff < -50) goTo(currentIndex + 1);
      else if (diff > 50) goTo(currentIndex - 1);
    });
  }

  // Init
  buildDots();
  goTo(0);

  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(currentIndex, maxIndex()));
  });
})();
