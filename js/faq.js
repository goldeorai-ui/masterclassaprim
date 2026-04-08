/* ============================================================
   GOLDEOR — FAQ Accordion
   faq.js
   ============================================================ */

(function () {
  var items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.faq__question');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Fermer tous les autres
      items.forEach(function (other) {
        other.classList.remove('is-open');
        var otherBtn = other.querySelector('.faq__question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle celui-ci
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
