/**
 * LEOPARD SECURITY FORCE — Cinematic Particle & Trail System
 * 
 * Renders luxurious glowing orange energy trails behind the leopard.
 * Uses Canvas 2D with radial gradients and 'lighter' composite for bloom.
 * 
 * Trail style: Elegant glowing light streaks with soft bloom and subtle particles.
 * NO flames, smoke, fire, or sparks.
 * 
 * Reads position from window.__leopard_runtime (exposed by leopard.js).
 */
(function () {
  'use strict';

  const canvas = document.getElementById('trail-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  /* ── Particle types ── */
  // 1. Trail cores: large, soft, short-lived glowing orbs along the path
  // 2. Trail streaks: elongated soft lines
  // 3. Micro particles: tiny floating sparkles

  const particles = [];
  const MAX_PARTICLES = 500;
  const TRAIL_HISTORY = []; // stores recent positions for streak rendering
  const MAX_TRAIL_POINTS = 80;

  /* ── Particle class ── */
  class Particle {
    constructor(x, y, type, intensity) {
      this.x = x;
      this.y = y;
      this.type = type; // 'core', 'streak', 'micro'
      this.intensity = intensity;
      this.age = 0;
      this.alpha = 0;

      if (type === 'core') {
        this.life = 50 + Math.random() * 40;
        this.r = 10 + Math.random() * 15;
        this.vx = (Math.random() - 0.6) * 1.5;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.maxAlpha = 0.4 + Math.random() * 0.3;
      } else if (type === 'streak') {
        this.life = 30 + Math.random() * 20;
        this.r = 4 + Math.random() * 6;
        this.vx = -1 - Math.random() * 2;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.length = 15 + Math.random() * 25;
        this.maxAlpha = 0.25 + Math.random() * 0.2;
      } else { // micro
        this.life = 60 + Math.random() * 60;
        this.r = 1.5 + Math.random() * 2.5;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = -0.5 - Math.random() * 1.5;
        this.maxAlpha = 0.5 + Math.random() * 0.4;
        this.drift = Math.random() * Math.PI * 2;
        this.driftSpeed = 0.02 + Math.random() * 0.03;
      }
    }

    update() {
      this.age++;
      const lifeRatio = this.age / this.life;

      // Smooth fade in / fade out
      if (lifeRatio < 0.15) {
        this.alpha = this.maxAlpha * (lifeRatio / 0.15) * this.intensity;
      } else if (lifeRatio > 0.6) {
        this.alpha = this.maxAlpha * (1 - (lifeRatio - 0.6) / 0.4) * this.intensity;
      } else {
        this.alpha = this.maxAlpha * this.intensity;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Damping
      this.vx *= 0.985;
      this.vy *= 0.985;

      // Micro particles float
      if (this.type === 'micro') {
        this.x += Math.sin(this.drift) * 0.3;
        this.drift += this.driftSpeed;
        this.vy -= 0.005; // slight upward drift
      }

      return this.age < this.life;
    }

    draw() {
      if (this.alpha <= 0.005) return;

      if (this.type === 'core') {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        g.addColorStop(0, `rgba(255, 140, 20, ${this.alpha * 0.9})`);
        g.addColorStop(0.3, `rgba(255, 122, 0, ${this.alpha * 0.5})`);
        g.addColorStop(0.7, `rgba(255, 90, 0, ${this.alpha * 0.15})`);
        g.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }

      else if (this.type === 'streak') {
        const angle = Math.atan2(this.vy, this.vx);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        const g = ctx.createLinearGradient(-this.length, 0, this.r, 0);
        g.addColorStop(0, 'rgba(0, 0, 0, 0)');
        g.addColorStop(0.4, `rgba(255, 122, 0, ${this.alpha * 0.3})`);
        g.addColorStop(1, `rgba(255, 140, 20, ${this.alpha * 0.7})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = this.r * 0.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-this.length, 0);
        ctx.lineTo(this.r, 0);
        ctx.stroke();
        ctx.restore();
      }

      else { // micro
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 160, 40, ${this.alpha})`;
        ctx.fill();

        // Tiny glow
        if (this.alpha > 0.2) {
          const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
          g.addColorStop(0, `rgba(255, 122, 0, ${this.alpha * 0.3})`);
          g.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  /* ── Trail path rendering (continuous glowing line) ── */
  function drawTrailPath() {
    if (TRAIL_HISTORY.length < 2) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Multiple passes for bloom effect
    const passes = [
      { width: 18, alpha: 0.04 },
      { width: 10, alpha: 0.08 },
      { width: 5, alpha: 0.15 },
      { width: 2, alpha: 0.3 },
    ];

    passes.forEach(pass => {
      ctx.beginPath();
      ctx.moveTo(TRAIL_HISTORY[0].x, TRAIL_HISTORY[0].y);

      for (let i = 1; i < TRAIL_HISTORY.length; i++) {
        const prev = TRAIL_HISTORY[i - 1];
        const curr = TRAIL_HISTORY[i];
        const cpx = (prev.x + curr.x) / 2;
        const cpy = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
      }

      const fadeRatio = TRAIL_HISTORY.length / MAX_TRAIL_POINTS;
      ctx.strokeStyle = `rgba(255, 122, 0, ${pass.alpha * Math.min(1, fadeRatio)})`;
      ctx.lineWidth = pass.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    ctx.restore();
  }

  /* ── Spawn particles at leopard position ── */
  let spawnAccum = 0;

  function spawnTrailParticles(x, y, speed) {
    if (speed < 0.01) return;

    const intensity = Math.min(1, speed);
    spawnAccum += speed * 3;

    while (spawnAccum > 1 && particles.length < MAX_PARTICLES) {
      spawnAccum--;

      // Core glow (2 per cycle)
      if (Math.random() < 0.4) {
        particles.push(new Particle(
          x - 10 + Math.random() * 20,
          y - 8 + Math.random() * 16,
          'core',
          intensity * (0.6 + Math.random() * 0.4)
        ));
      }

      // Streaks
      if (Math.random() < 0.3) {
        particles.push(new Particle(
          x - 5 + Math.random() * 10,
          y - 6 + Math.random() * 12,
          'streak',
          intensity * (0.5 + Math.random() * 0.5)
        ));
      }

      // Micro sparkles
      if (Math.random() < 0.5) {
        particles.push(new Particle(
          x - 15 + Math.random() * 30,
          y - 12 + Math.random() * 24,
          'micro',
          intensity * (0.3 + Math.random() * 0.7)
        ));
      }
    }

    // Add to trail history
    TRAIL_HISTORY.push({ x, y, time: performance.now() });
    if (TRAIL_HISTORY.length > MAX_TRAIL_POINTS) {
      TRAIL_HISTORY.shift();
    }
  }

  /* ── Main render loop ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Read runtime data from leopard.js
    const rt = window.__leopard_runtime;
    if (rt && rt.speed !== undefined && rt.x !== undefined) {
      spawnTrailParticles(rt.x, rt.y, rt.speed || 0);
    }

    // Draw trail path
    ctx.globalCompositeOperation = 'lighter';
    drawTrailPath();

    // Update & draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) {
        particles.splice(i, 1);
        continue;
      }
      particles[i].draw();
    }

    ctx.globalCompositeOperation = 'source-over';

    // Ambient glow at leopard position
    if (rt && rt.x && rt.speed > 0.05) {
      const g = ctx.createRadialGradient(rt.x, rt.y, 0, rt.x, rt.y, 60);
      g.addColorStop(0, `rgba(255, 122, 0, ${0.06 * rt.speed})`);
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(rt.x, rt.y, 60, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  // Start with delay matching leopard start
  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 600);
})();
