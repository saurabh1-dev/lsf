/**
 * LEOPARD SECURITY FORCE — Cinematic Loader Controller
 * 
 * Orchestrates: progress bar, percentage display, brand text reveal,
 * logo light-painting reveal, ambient glow, and final fade transition.
 * 
 * Reads progress from window.__leopard_runtime (exposed by leopard.js).
 */
(function () {
  'use strict';

  /* ── DOM References ── */
  const loader = document.getElementById('loader-screen');
  const mainContent = document.getElementById('main-site');
  const progressFill = document.getElementById('loader-progress-fill');
  const progressGlow = document.getElementById('loader-progress-glow');
  const progressPercent = document.getElementById('loader-percent');
  const brandText = document.getElementById('loader-brand-text');
  const brandLetters = document.getElementById('loader-brand-letters');
  const logoContainer = document.getElementById('loader-logo-svg');
  const ambientGlow = document.getElementById('loader-ambient');
  const vignette = document.getElementById('loader-vignette');

  if (!loader || !mainContent) return;

  /* ── Initialize brand text with individual letter spans ── */
  const brandString = 'LEOPARD SECURITY FORCE';
  brandLetters.innerHTML = '';
  for (let i = 0; i < brandString.length; i++) {
    const span = document.createElement('span');
    span.className = 'brand-letter';
    span.textContent = brandString[i] === ' ' ? '\u00A0' : brandString[i];
    span.style.opacity = '0';
    span.style.transform = 'translateY(8px)';
    span.style.transition = `opacity 0.4s cubic-bezier(0.2, 0.9, 0.2, 1) ${i * 0.03}s, transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1) ${i * 0.03}s`;
    brandLetters.appendChild(span);
  }

  /* ── Initialize logo SVG with stroke-dash reveal ── */
  (async function loadLogo() {
    try {
      const resp = await fetch('logo.svg');
      const svgText = await resp.text();
      logoContainer.innerHTML = svgText;

      // Prepare all paths for stroke-dash animation
      const paths = logoContainer.querySelectorAll('path, line, circle, ellipse, rect');
      paths.forEach((p, i) => {
        try {
          const len = p.getTotalLength ? p.getTotalLength() : 300;
          p.style.stroke = 'url(#logo-grad)';
          p.style.fill = 'none';
          p.style.strokeWidth = '2';
          p.style.strokeLinecap = 'round';
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          p.style.transition = `stroke-dashoffset 1.5s cubic-bezier(0.2, 0.9, 0.2, 1) ${i * 0.08}s`;
          p.dataset.pathLen = len;
        } catch (e) { }
      });

      // Text elements need different treatment
      const texts = logoContainer.querySelectorAll('text');
      texts.forEach(t => {
        t.style.opacity = '0';
        t.style.transition = 'opacity 1.2s cubic-bezier(0.2, 0.9, 0.2, 1) 0.5s';
      });
    } catch (e) {
      console.warn('Logo SVG load failed:', e);
    }
  })();

  /* ── Smooth progress interpolation ── */
  let smoothProgress = 0;
  let logoRevealed = false;
  let brandRevealed = false;
  let glowIntensity = 0;
  let fadeStarted = false;

  function update() {
    const rt = window.__leopard_runtime || { progress: 0, speed: 0, finished: false };
    const rawProgress = rt.progress || 0;

    // Smooth interpolation with cubic easing
    const lerp = rawProgress > smoothProgress ? 0.06 : 0.04;
    smoothProgress += (rawProgress - smoothProgress) * lerp;
    smoothProgress = Math.min(1, Math.max(0, smoothProgress));

    const percent = Math.round(smoothProgress * 100);

    /* ── Progress Bar ── */
    progressFill.style.width = `${smoothProgress * 100}%`;
    if (progressGlow) {
      progressGlow.style.left = `${smoothProgress * 100}%`;
      progressGlow.style.opacity = smoothProgress > 0.02 ? '1' : '0';
    }
    progressPercent.textContent = `${percent}%`;

    /* ── Brand Text Reveal (letters reveal based on progress) ── */
    if (!brandRevealed && smoothProgress > 0.08) {
      const letters = brandLetters.querySelectorAll('.brand-letter');
      const revealCount = Math.floor(smoothProgress * letters.length * 1.2);
      letters.forEach((span, i) => {
        if (i < revealCount) {
          span.style.opacity = '0.95';
          span.style.transform = 'translateY(0)';
        }
      });

      // Text glow pulse
      if (smoothProgress > 0.3) {
        brandText.classList.add('glow-active');
      }

      if (revealCount >= letters.length) {
        brandRevealed = true;
      }
    }

    /* ── Logo Stroke Reveal (painted by light) ── */
    if (!logoRevealed && smoothProgress > 0.15) {
      const paths = logoContainer.querySelectorAll('path, line, circle, ellipse, rect');
      paths.forEach((p, i) => {
        const len = parseFloat(p.dataset.pathLen || 300);
        const revealProgress = Math.min(1, (smoothProgress - 0.15) / 0.7);
        const offset = len * (1 - revealProgress);
        p.style.strokeDashoffset = Math.max(0, offset);
      });

      // When nearly done, fill in the shapes
      if (smoothProgress > 0.92) {
        const texts = logoContainer.querySelectorAll('text');
        texts.forEach(t => {
          t.style.opacity = '0.9';
          t.style.fill = '#fff';
        });

        paths.forEach(p => {
          p.style.transition = 'fill 0.8s ease, stroke-opacity 0.8s ease';
          if (p.tagName === 'path' || p.tagName === 'line') {
            p.style.strokeOpacity = '0.8';
          }
        });

        logoRevealed = true;
      }
    }

    /* ── Ambient Glow ── */
    if (ambientGlow) {
      glowIntensity += (smoothProgress * 0.15 - glowIntensity) * 0.02;
      ambientGlow.style.opacity = glowIntensity;
    }

    /* ── Vignette fade ── */
    if (vignette) {
      vignette.style.opacity = 0.6 + smoothProgress * 0.3;
    }

    /* ── Final Fade & Transition ── */
    if (rt.finished && !fadeStarted) {
      fadeStarted = true;

      // Brief pause to admire the final frame
      setTimeout(() => {
        // Add glow pulse to brand
        brandText.classList.add('final-glow');
        logoContainer.classList.add('final-glow');

        // Wait, then fade
        setTimeout(() => {
          loader.classList.add('fade-out');

          setTimeout(() => {
            loader.style.display = 'none';
            loader.setAttribute('aria-hidden', 'true');
            mainContent.style.display = '';
            mainContent.classList.add('reveal');

            // Clean up canvases
            const canvases = loader.querySelectorAll('canvas');
            canvases.forEach(c => {
              c.width = 0;
              c.height = 0;
            });
          }, 1200);
        }, 600);
      }, 800);
    }

    if (!fadeStarted) {
      requestAnimationFrame(update);
    }
  }

  // Start the update loop
  requestAnimationFrame(update);
})();
