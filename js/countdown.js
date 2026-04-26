/* ============================================================
   GOLDEOR — Countdown Timer
   countdown.js
   Compte à rebours vers le 7 mai 2026 à 20h00 (Paris)
   ============================================================ */

(function () {
  // Date cible : 7 mai 2026 à 20h00 heure de Paris
  const TARGET_DATE = new Date('2026-05-07T20:00:00+02:00');

  const elWeeks   = document.getElementById('cd-weeks');
  const elDays    = document.getElementById('cd-days');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elWeeks && !elDays) return;

  function pad(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, '0');
  }

  function update() {
    const now  = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      if (elWeeks)   elWeeks.textContent   = '0';
      if (elDays)    elDays.textContent    = '0';
      if (elMinutes) elMinutes.textContent = '00';
      if (elSeconds) elSeconds.textContent = '00';
      return;
    }

    const totalSeconds = diff / 1000;
    const totalMinutes = totalSeconds / 60;
    const totalHours   = totalMinutes / 60;
    const totalDays    = totalHours / 24;
    const weeks        = Math.floor(totalDays / 7);
    const days         = Math.floor(totalDays % 7);
    const hours        = Math.floor(totalHours % 24);
    const minutes      = Math.floor(totalMinutes % 60);
    const seconds      = Math.floor(totalSeconds % 60);

    if (elWeeks)   elWeeks.textContent   = weeks;
    if (elDays)    elDays.textContent    = days;

    // Si on a un élément heures
    const elHours = document.getElementById('cd-hours');
    if (elHours)   elHours.textContent   = pad(hours);

    if (elMinutes) elMinutes.textContent = pad(minutes);
    if (elSeconds) elSeconds.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
})();
