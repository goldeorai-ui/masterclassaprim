/* ============================================================
   GOLDEOR — Exit Intent Popup
   popup-exit.js
   - Affiche un popup glassmorphique au moment où l'utilisateur
     s'apprête à quitter la page (desktop) ou après inactivité
     prolongée / scroll 90% (mobile).
   - 1 seule fois par session (sessionStorage).
   - Délai d'armement de 120s après le chargement.
   ============================================================ */

(function () {
  'use strict';

  if (sessionStorage.getItem('goldeor_popup_shown') === 'true') return;

  var ARM_DELAY = 120000;       // 120s avant que les triggers s'arment
  var INACTIVITY_DELAY = 45000; // 45s d'inactivité (mobile)
  var SCROLL_THRESHOLD = 0.9;   // 90% de la page (mobile)
  var TARGET_DATE = new Date('2026-05-07T20:00:00+02:00');

  var armed = false;
  var triggered = false;
  var inactivityTimer = null;
  var countdownInterval = null;
  var popupEl = null;

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches ||
      ('ontouchstart' in window && window.innerWidth < 1024);
  }

  function injectStyles() {
    var css = ''
      + '.gdr-popup-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.75);'
      + 'display:flex;align-items:center;justify-content:center;padding:24px;'
      + 'opacity:0;visibility:hidden;transition:opacity 0.3s ease,visibility 0.3s ease;}'
      + '.gdr-popup-overlay.is-open{opacity:1;visibility:visible;}'
      + '.gdr-popup-card{position:relative;width:100%;max-width:480px;'
      + 'background:rgba(255,255,255,0.05);backdrop-filter:blur(24px) saturate(180%);'
      + '-webkit-backdrop-filter:blur(24px) saturate(180%);'
      + 'border:1px solid rgba(255,255,255,0.15);border-radius:24px;padding:40px 36px;'
      + 'box-shadow:0 8px 32px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.1);'
      + 'transform:scale(0.9);transition:transform 0.3s ease-out;'
      + 'font-family:Inter,sans-serif;color:#fff;}'
      + '.gdr-popup-overlay.is-open .gdr-popup-card{transform:scale(1);}'
      + '.gdr-popup-overlay.is-closing{opacity:0;transition:opacity 0.2s ease;}'
      + '.gdr-popup-overlay.is-closing .gdr-popup-card{transform:scale(0.9);transition:transform 0.2s ease;}'
      + '.gdr-popup-close{position:absolute;top:16px;right:16px;width:32px;height:32px;'
      + 'background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer;'
      + 'display:flex;align-items:center;justify-content:center;line-height:1;padding:0;'
      + 'border-radius:50%;transition:background 0.2s ease;}'
      + '.gdr-popup-close:hover{background:rgba(255,255,255,0.1);}'
      + '.gdr-popup-cd{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:24px;}'
      + '.gdr-popup-cd-item{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.08);'
      + 'border-radius:12px;padding:12px 6px;text-align:center;}'
      + '.gdr-popup-cd-num{display:block;font-size:24px;font-weight:700;color:#fff;line-height:1;'
      + 'font-variant-numeric:tabular-nums;}'
      + '.gdr-popup-cd-lbl{display:block;font-size:10px;color:#AAAAAA;margin-top:4px;'
      + 'text-transform:uppercase;letter-spacing:0.5px;}'
      + '.gdr-popup-title{font-size:22px;font-weight:700;color:#fff;text-align:center;'
      + 'margin:0 0 12px;line-height:1.3;}'
      + '.gdr-popup-sub{font-size:14px;color:#CCCCCC;text-align:center;line-height:1.6;'
      + 'margin:0 0 24px;}'
      + '.gdr-popup-cta{display:block;width:100%;padding:16px 32px;text-align:center;'
      + 'background:linear-gradient(135deg,#F5C88A 0%,#ECA0C0 35%,#C4A8E8 65%,#A0B8F0 100%);'
      + 'color:#1a1a1a;font-weight:600;font-size:16px;border-radius:14px;border:none;'
      + 'cursor:pointer;text-decoration:none;font-family:Inter,sans-serif;'
      + 'transition:transform 0.2s ease,box-shadow 0.2s ease;'
      + 'box-shadow:0 4px 24px rgba(236,160,192,0.28);}'
      + '.gdr-popup-cta:hover{transform:translateY(-2px);'
      + 'box-shadow:0 12px 36px rgba(196,168,232,0.45);}'
      + '.gdr-popup-decline{display:block;width:100%;background:transparent;border:none;'
      + 'color:#666666;font-size:12px;text-align:center;cursor:pointer;margin-top:16px;'
      + 'font-family:Inter,sans-serif;padding:6px;transition:color 0.2s ease;}'
      + '.gdr-popup-decline:hover{color:#AAAAAA;}'
      + '@media (max-width:480px){.gdr-popup-card{padding:32px 24px;}'
      + '.gdr-popup-title{font-size:19px;}.gdr-popup-cd-num{font-size:20px;}}';

    var style = document.createElement('style');
    style.id = 'gdr-popup-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildPopup() {
    var overlay = document.createElement('div');
    overlay.className = 'gdr-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'gdrPopupTitle');
    overlay.innerHTML =
      '<div class="gdr-popup-card">'
      +   '<button type="button" class="gdr-popup-close" aria-label="Fermer">'
      +     '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      +   '</button>'
      +   '<div class="gdr-popup-cd">'
      +     '<div class="gdr-popup-cd-item"><span class="gdr-popup-cd-num" data-cd="d">00</span><span class="gdr-popup-cd-lbl">Jours</span></div>'
      +     '<div class="gdr-popup-cd-item"><span class="gdr-popup-cd-num" data-cd="h">00</span><span class="gdr-popup-cd-lbl">Heures</span></div>'
      +     '<div class="gdr-popup-cd-item"><span class="gdr-popup-cd-num" data-cd="m">00</span><span class="gdr-popup-cd-lbl">Minutes</span></div>'
      +     '<div class="gdr-popup-cd-item"><span class="gdr-popup-cd-num" data-cd="s">00</span><span class="gdr-popup-cd-lbl">Secondes</span></div>'
      +   '</div>'
      +   '<h2 class="gdr-popup-title" id="gdrPopupTitle">Attends, ta place n\'est pas encore réservée.</h2>'
      +   '<p class="gdr-popup-sub">12 799 EUR de bonus offerts. 2 soirées. 8 modules. Gratuit, tout inclus.</p>'
      +   '<a href="inscription.html" class="gdr-popup-cta">Je réserve ma place gratuitement</a>'
      +   '<button type="button" class="gdr-popup-decline">Non merci, je préfère rater ça</button>'
      + '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function updateCountdown() {
    if (!popupEl) return;
    var now = new Date();
    var diff = TARGET_DATE - now;
    if (diff <= 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff / 3600000) % 24);
    var m = Math.floor((diff / 60000) % 60);
    var s = Math.floor((diff / 1000) % 60);
    var dEl = popupEl.querySelector('[data-cd="d"]');
    var hEl = popupEl.querySelector('[data-cd="h"]');
    var mEl = popupEl.querySelector('[data-cd="m"]');
    var sEl = popupEl.querySelector('[data-cd="s"]');
    if (dEl) dEl.textContent = pad(d);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }

  function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function stopCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
  }

  function dismiss() {
    sessionStorage.setItem('goldeor_popup_shown', 'true');
    if (!popupEl) return;
    popupEl.classList.remove('is-open');
    popupEl.classList.add('is-closing');
    stopCountdown();
    setTimeout(function () {
      if (popupEl && popupEl.parentNode) popupEl.parentNode.removeChild(popupEl);
      popupEl = null;
    }, 220);
  }

  function show() {
    if (triggered) return;
    if (sessionStorage.getItem('goldeor_popup_shown') === 'true') return;
    triggered = true;
    armed = false;

    injectStyles();
    popupEl = buildPopup();
    startCountdown();

    // Force reflow then add is-open for the transition
    // eslint-disable-next-line no-unused-expressions
    popupEl.offsetHeight;
    requestAnimationFrame(function () {
      popupEl.classList.add('is-open');
    });

    // Wire events
    popupEl.querySelector('.gdr-popup-close').addEventListener('click', dismiss);
    popupEl.querySelector('.gdr-popup-decline').addEventListener('click', dismiss);

    // Close on overlay click (not on card)
    popupEl.addEventListener('click', function (e) {
      if (e.target === popupEl) dismiss();
    });

    // Close on Escape
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        dismiss();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  // ── Triggers ────────────────────────────────────────────────
  function onMouseLeave(e) {
    if (!armed) return;
    if (e.clientY <= 0) show();
  }

  function onScroll() {
    if (!armed) return;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    var pct = window.scrollY / docH;
    if (pct >= SCROLL_THRESHOLD) show();
  }

  function resetInactivity() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(function () {
      if (armed) show();
    }, INACTIVITY_DELAY);
  }

  function armTriggers() {
    armed = true;
    if (isMobile()) {
      window.addEventListener('scroll', onScroll, { passive: true });
      ['touchstart', 'touchmove', 'click', 'scroll'].forEach(function (ev) {
        document.addEventListener(ev, resetInactivity, { passive: true });
      });
      resetInactivity();
    } else {
      document.addEventListener('mouseleave', onMouseLeave);
    }
  }

  // Wait for DOM ready then arm after delay
  function init() {
    setTimeout(armTriggers, ARM_DELAY);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
