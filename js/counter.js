/* ============================================================
   GOLDEOR — Counter Animation
   counter.js
   Anime les compteurs numériques au scroll (ex: "250+ clients")
   ============================================================ */

(function () {
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el, target, duration) {
    const start = performance.now();
    const initial = parseInt(el.textContent) || 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(initial + (target - initial) * eased);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  if (counters.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const duration = parseInt(el.dataset.duration) || 1500;
            animateCounter(el, target, duration);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  // ── Accelerating counters (ease-in: slow start → fast end) ──
  var accelCounters = document.querySelectorAll('[data-count-accel]');

  function animateAccel(el, target, duration, isDecimal, suffix) {
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease-in cubic: starts slow, accelerates
      var eased = progress * progress * progress;
      var current = eased * target;

      if (isDecimal) {
        el.textContent = (current / 10).toFixed(1).replace('.', ',') + suffix;
      } else {
        var num = Math.round(current);
        el.textContent = num.toLocaleString('fr-FR') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (isDecimal) {
          el.textContent = (target / 10).toFixed(1).replace('.', ',') + suffix;
        } else {
          el.textContent = target.toLocaleString('fr-FR') + suffix;
        }
      }
    }

    requestAnimationFrame(step);
  }

  if (accelCounters.length) {
    var accelObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.dataset.countAccel);
            var duration = parseInt(el.dataset.duration) || 2500;
            var isDecimal = el.dataset.decimal === 'true';
            var suffix = el.dataset.suffix || '';
            animateAccel(el, target, duration, isDecimal, suffix);
            accelObs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    accelCounters.forEach(function (el) { accelObs.observe(el); });
  }
})();
