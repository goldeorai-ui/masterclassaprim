/* ============================================================
   GOLDEOR — Hero Stardust Effect
   stars.js
   ~100 scintillating particles around the central glow
   ============================================================ */

(function () {
  var canvas = document.getElementById('heroStars');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var stars = [];
  var STAR_COUNT = 100;
  var colors = [
    [160, 184, 240],  // #A0B8F0
    [196, 168, 232],  // #C4A8E8
    [255, 255, 255]   // #ffffff
  ];

  function resize() {
    var hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createStar() {
    // Center of the glow: horizontally centered, ~120px from top
    var cx = canvas.width / 2;
    var cy = 120;

    // Random angle and distance — denser near center
    var angle = Math.random() * Math.PI * 2;
    var dist = Math.pow(Math.random(), 0.6) * 500;

    var x = cx + Math.cos(angle) * dist;
    var y = cy + Math.sin(angle) * dist * 0.7; // elliptical spread

    // Closer to center = brighter, farther = dimmer
    var proximity = 1 - Math.min(dist / 500, 1);
    var maxOpacity = 0.15 + proximity * 0.65; // 0.15 at edge, 0.8 at center
    maxOpacity = Math.min(maxOpacity, 0.8);

    var color = colors[Math.floor(Math.random() * colors.length)];
    var radius = 0.5 + Math.random() * 2; // 0.5px to 2.5px
    if (proximity > 0.7) radius = Math.min(radius + 0.5, 3);

    var cycleDuration = 1.5 + Math.random() * 2.5; // 1.5s to 4s
    var phase = Math.random() * Math.PI * 2; // random start phase
    var hasRotation = Math.random() < 0.2;
    var rotSpeed = (Math.random() - 0.5) * 0.8;

    return {
      x: x,
      y: y,
      radius: radius,
      color: color,
      maxOpacity: maxOpacity,
      cycleDuration: cycleDuration,
      phase: phase,
      hasRotation: hasRotation,
      rotSpeed: rotSpeed,
      rotation: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar());
    }
  }

  var lastTime = 0;

  function draw(timestamp) {
    if (!lastTime) lastTime = timestamp;
    var dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      // Skip stars outside canvas
      if (s.x < -10 || s.x > canvas.width + 10 || s.y < -10 || s.y > canvas.height + 10) continue;

      // Scintillation: sine wave for smooth pulse
      s.phase += (dt * Math.PI * 2) / s.cycleDuration;
      var opacity = s.maxOpacity * (0.5 + 0.5 * Math.sin(s.phase));

      if (s.hasRotation) {
        s.rotation += s.rotSpeed * dt;
      }

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(s.x, s.y);

      if (s.hasRotation) {
        ctx.rotate(s.rotation);
      }

      // Draw star as a soft circle
      ctx.beginPath();
      ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ')';
      ctx.fill();

      // Subtle glow for brighter stars
      if (s.maxOpacity > 0.5 && s.radius > 1.5) {
        ctx.beginPath();
        ctx.arc(0, 0, s.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0.15)';
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  init();
  requestAnimationFrame(draw);

  // Recalculate on resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();
