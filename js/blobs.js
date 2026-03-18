/* ============================================================
   GOLDEOR — Animated Blobs
   blobs.js
   Anime les blobs de fond via mousemove (effet parallax doux)
   ============================================================ */

(function () {
  const blob1 = document.querySelector('.hero__blob--1');
  const blob2 = document.querySelector('.hero__blob--2');
  const blob3 = document.querySelector('.hero__blob--3');

  if (!blob1 && !blob2 && !blob3) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    targetX = (e.clientX / innerWidth - 0.5) * 40;
    targetY = (e.clientY / innerHeight - 0.5) * 30;
  });

  function animateBlobs() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    if (blob1) blob1.style.transform =
      `translate(${currentX * 0.6}px, ${currentY * 0.6}px)`;
    if (blob2) blob2.style.transform =
      `translate(${-currentX * 0.4}px, ${-currentY * 0.4}px)`;
    if (blob3) blob3.style.transform =
      `translate(calc(-50% + ${currentX * 0.3}px), calc(-50% + ${currentY * 0.3}px))`;

    requestAnimationFrame(animateBlobs);
  }

  animateBlobs();
})();
