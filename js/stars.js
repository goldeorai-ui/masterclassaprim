/* ============================================================
   GOLDEOR — Hero Stardust Effect
   stars.js
   ~80 scintillating particles around the central glow
   - Throttled to ~30fps
   - Pauses when the hero is offscreen (saves battery & CPU)
   - Skips on prefers-reduced-motion
   ============================================================ */

(function () {
  var canvas = document.getElementById('heroStars');
  if (!canvas) return;

  // Respecte la préférence utilisateur "réduire les animations"
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  var stars = [];
  // Réduit sur mobile pour préserver les perfs
  var STAR_COUNT = window.innerWidth < 768 ? 50 : 80;
  var TARGET_FPS = 30;
  var FRAME_INTERVAL = 1000 / TARGET_FPS;

  var colors = [
    [160, 184, 240],  // #A0B8F0
    [196, 168, 232],  // #C4A8E8
    [255, 255, 255]   // #ffffff
  ];

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var heroEl = canvas.parentElement;
  var isVisible = true;
  var isRunning = false;
  var rafId = null;

  function resize() {
    var w = heroEl.offsetWidth;
    var h = heroEl.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createStar() {
    var w = canvas.width / dpr;
    var cx = w / 2;
    var cy = 120;

    var angle = Math.random() * Math.PI * 2;
    var dist = Math.pow(Math.random(), 0.6) * 500;

    var x = cx + Math.cos(angle) * dist;
    var y = cy + Math.sin(angle) * dist * 0.7;

    var proximity = 1 - Math.min(dist / 500, 1);
    var maxOpacity = 0.15 + proximity * 0.65;
    maxOpacity = Math.min(maxOpacity, 0.8);

    var color = colors[Math.floor(Math.random() * colors.length)];
    var radius = 0.5 + Math.random() * 2;
    if (proximity > 0.7) radius = Math.min(radius + 0.5, 3);

    var cycleDuration = 1.5 + Math.random() * 2.5;
    var phase = Math.random() * Math.PI * 2;
    var hasRotation = Math.random() < 0.2;
    var rotSpeed = (Math.random() - 0.5) * 0.8;

    return {
      x: x, y: y, radius: radius, color: color,
      maxOpacity: maxOpacity, cycleDuration: cycleDuration,
      phase: phase, hasRotation: hasRotation,
      rotSpeed: rotSpeed,
      rotation: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) stars.push(createStar());
  }

  var lastTime = 0;
  var lastFrame = 0;

  function draw(timestamp) {
    if (!isVisible) {
      isRunning = false;
      return;
    }

    // Throttle à 30fps
    if (timestamp - lastFrame < FRAME_INTERVAL) {
      rafId = requestAnimationFrame(draw);
      return;
    }
    var dt = (timestamp - lastTime) / 1000 || 0;
    lastTime = timestamp;
    lastFrame = timestamp;

    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (s.x < -10 || s.x > w + 10 || s.y < -10 || s.y > h + 10) continue;

      s.phase += (dt * Math.PI * 2) / s.cycleDuration;
      var opacity = s.maxOpacity * (0.5 + 0.5 * Math.sin(s.phase));

      if (s.hasRotation) s.rotation += s.rotSpeed * dt;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(s.x, s.y);
      if (s.hasRotation) ctx.rotate(s.rotation);

      ctx.beginPath();
      ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ')';
      ctx.fill();

      if (s.maxOpacity > 0.5 && s.radius > 1.5) {
        ctx.beginPath();
        ctx.arc(0, 0, s.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0.15)';
        ctx.fill();
      }

      ctx.restore();
    }

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    lastTime = 0;
    lastFrame = 0;
    rafId = requestAnimationFrame(draw);
  }

  function stop() {
    isRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  init();

  // Pause l'animation quand le hero n'est plus visible
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      });
    }, { threshold: 0 });
    io.observe(heroEl);
  } else {
    start();
  }

  // Pause l'animation si l'onglet n'est pas visible
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (isVisible) start();
  });

  // Recalculate on resize (debounced)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();
