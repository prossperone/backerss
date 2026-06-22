// Finance Backdrop Particles Canvas Animation Effect
(function () {
  var canvas = document.getElementById('financeCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var symbols = ['$', '↗', '✓', '%'];
  var colors = [
    'rgba(16,185,129,', // green
    'rgba(201,162,39,', // gold
    'rgba(156,152,141,' // ink dim
  ];

  var particles = [];
  var hero, w, h, dpr;

  function resize() {
    hero = canvas.parentElement;
    w = hero.offsetWidth;
    h = hero.offsetHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function seed() {
    var count = w < 640 ? 14 : 26;
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(makeParticle(true));
    }
  }

  function makeParticle(initial) {
    var colorIdx = Math.random() < 0.45 ? 0 : (Math.random() < 0.7 ? 1 : 2);
    return {
      x: rand(0, w),
      y: initial ? rand(0, h) : h + rand(10, 60),
      size: rand(11, 22),
      speed: rand(6, 16) / 100,
      drift: rand(-0.12, 0.12),
      symbol: symbols[Math.floor(rand(0, symbols.length))],
      color: colors[colorIdx],
      alphaBase: rand(0.12, 0.34),
      phase: rand(0, Math.PI * 2),
      flicker: rand(0.002, 0.006)
    };
  }

  var t = 0;
  function tick() {
    t += 1;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.speed;
      p.x += p.drift;
      var alpha = p.alphaBase + Math.sin(t * p.flicker + p.phase) * 0.08;
      if (alpha < 0) alpha = 0;
      ctx.font = (p.size) + 'px JetBrains Mono, monospace';
      ctx.fillStyle = p.color + alpha.toFixed(3) + ')';
      ctx.fillText(p.symbol, p.x, p.y);

      if (p.y < -30) {
        particles[i] = makeParticle(false);
        particles[i].x = rand(0, w);
      }
    }
    if (!reduceMotion) {
      requestAnimationFrame(tick);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  if (reduceMotion) {
    tick();
  } else {
    requestAnimationFrame(tick);
  }
})();
