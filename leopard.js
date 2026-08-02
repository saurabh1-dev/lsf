/**
 * LEOPARD SECURITY FORCE — Cinematic Front-Facing Leopard Engine (Masterpiece Edition)
 * 
 * Handcrafted 60 FPS Canvas-based skeletal & anatomical renderer of a front-facing
 * running leopard, designed to match high-end luxury automotive commercial aesthetics.
 * 
 * Features:
 *  - Anatomical feline geometry (head stabilization, muscular scapula, flexed pasterns)
 *  - 3D gradient muscle contouring & dramatic orange rim light (#FF7A00)
 *  - Realistic gaze: intense glowing amber eyes with catchlight & black tear-stripes
 *  - True gallop gait biomechanics: alternating shoulder thrusts, spinal flex, tail wave
 *  - Detailed 2-color rosette fur patterns & motion blur
 */
(function () {
  'use strict';

  const CONFIG = {
    duration: 5.0,          // seconds to traverse screen
    accelTime: 0.8,
    decelTime: 1.2,
    strideFreq: 5.2,        // Hz gallop cycle
    startX: -0.22,
    endX: 0.84,
    groundY: 0.58,
  };

  const canvas = document.getElementById('leopard-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dpr;
  let time = 0;
  let finished = false;

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

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /* ── Masterpiece Anatomical Leopard Renderer ── */
  function drawMasterpieceLeopard(cx, cy, scale, phase, speed, headTurnAngle, breatheFactor) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const p = phase * Math.PI * 2;
    const s = speed;

    // Biomechanical gallop parameters
    const bodyBounce = -Math.abs(Math.sin(p)) * 18 * s;
    const swayX = Math.sin(p) * 12 * s;
    const shoulderL_Y = Math.sin(p) * 26 * s;
    const shoulderR_Y = Math.sin(p + Math.PI) * 26 * s;
    const spinalArchY = Math.cos(p) * 14 * s;
    const headNodY = Math.sin(p * 2) * 3.5 * s;

    // Leg stride extensions & paw lift
    const legL_Reach = Math.sin(p) * 48 * s;
    const legL_Lift = Math.max(0, Math.sin(p) * 32 * s);
    const legR_Reach = Math.sin(p + Math.PI) * 48 * s;
    const legR_Lift = Math.max(0, Math.sin(p + Math.PI) * 32 * s);

    // Tail wave physics
    const tailX = Math.sin(p - 0.6) * 36 * s;
    const tailY = Math.cos(p * 2) * 12 * s;

    ctx.translate(swayX * 0.35, bodyBounce);

    // Luxury Color Palette
    const cGoldenBase = '#d99738';
    const cGoldenLight = '#f5cb7a';
    const cGoldenShadow = '#8a5416';
    const cCreamBelly = '#f7ebdb';
    const cSpotDark = '#120c06';
    const cSpotRosette = '#6e3f11';
    const cGlowOrange = '#FF7A00';

    /* ── 1. TAIL (Curving high up & right behind back) ── */
    ctx.save();
    ctx.translate(28, -90 + spinalArchY * 0.4);

    // Outer glow trail
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      25 + tailX * 0.4, -40 + tailY,
      60 + tailX * 0.9, -85 - tailY,
      95 + tailX * 1.4 + (state === STATE.BREATHING ? Math.sin(breatheTime * 2) * 10 : 0), -50
    );
    ctx.strokeStyle = 'rgba(255,122,0,0.4)';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Main tail body
    ctx.strokeStyle = cGoldenShadow;
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.strokeStyle = cGoldenBase;
    ctx.lineWidth = 11;
    ctx.stroke();

    // Tail spot rings
    ctx.strokeStyle = cSpotDark;
    ctx.lineWidth = 9;
    ctx.setLineDash([7, 11]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Black tip
    ctx.beginPath();
    ctx.arc(
      95 + tailX * 1.4 + (state === STATE.BREATHING ? Math.sin(breatheTime * 2) * 10 : 0),
      -50,
      6.5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#0a0603';
    ctx.fill();
    ctx.restore();

    /* ── 2. HIGH ARCHED SPINE & HIND QUARTERS ── */
    ctx.save();
    const backGrad = ctx.createLinearGradient(-40, -120, 40, -20);
    backGrad.addColorStop(0, cGoldenShadow);
    backGrad.addColorStop(0.5, cGoldenBase);
    backGrad.addColorStop(1, cGoldenLight);

    ctx.beginPath();
    ctx.moveTo(-50, -25);
    ctx.bezierCurveTo(-65, -95 + spinalArchY, 45, -120 + spinalArchY, 70, -30);
    ctx.bezierCurveTo(50, 0, -30, 0, -50, -25);
    ctx.closePath();
    ctx.fillStyle = backGrad;
    ctx.fill();

    // Spine rosettes
    [[-18, -80, 8], [12, -92, 9], [38, -75, 8], [-38, -60, 9], [22, -52, 8]].forEach(([bx, by, br]) => {
      ctx.beginPath();
      ctx.arc(bx, by + spinalArchY * 0.4, br, 0, Math.PI * 2);
      ctx.fillStyle = cSpotDark;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx + 1, by + spinalArchY * 0.4, br * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = cSpotRosette;
      ctx.fill();
    });
    ctx.restore();

    /* ── 3. HIND LEGS (In perspective depth) ── */
    // Left Hind
    ctx.save();
    ctx.translate(-58, -15);
    ctx.beginPath();
    ctx.ellipse(-10, 40 + legR_Reach * 0.25, 14, 42, 0.18, 0, Math.PI * 2);
    ctx.fillStyle = cGoldenShadow;
    ctx.fill();
    ctx.restore();

    // Right Hind
    ctx.save();
    ctx.translate(58, -15);
    ctx.beginPath();
    ctx.ellipse(10, 40 + legL_Reach * 0.25, 14, 42, -0.18, 0, Math.PI * 2);
    ctx.fillStyle = cGoldenShadow;
    ctx.fill();
    ctx.restore();

    /* ── 4. MUSCULAR SHOULDERS & SCAPULA MASS ── */
    // Left Shoulder Mass
    ctx.save();
    ctx.translate(-45, -25 - shoulderL_Y);
    const shoulderLGrad = ctx.createRadialGradient(-12, -12, 4, 0, 0, 48);
    shoulderLGrad.addColorStop(0, cGoldenLight);
    shoulderLGrad.addColorStop(0.65, cGoldenBase);
    shoulderLGrad.addColorStop(1, cGoldenShadow);

    ctx.beginPath();
    ctx.moveTo(-10, -45);
    ctx.bezierCurveTo(-38, -30, -42, 25, -15, 42);
    ctx.bezierCurveTo(15, 40, 20, -10, -10, -45);
    ctx.closePath();
    ctx.fillStyle = shoulderLGrad;
    ctx.fill();

    // Orange rim light
    ctx.strokeStyle = 'rgba(255,122,0,0.45)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Shoulder rosettes
    [[-16, -18, 7], [-24, 5, 8], [-4, 15, 6], [-14, 25, 6.5]].forEach(([sx, sy, sr]) => {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fillStyle = cSpotDark; ctx.fill();
      ctx.beginPath(); ctx.arc(sx + 1, sy, sr * 0.45, 0, Math.PI * 2); ctx.fillStyle = cSpotRosette; ctx.fill();
    });
    ctx.restore();

    // Right Shoulder Mass
    ctx.save();
    ctx.translate(45, -25 - shoulderR_Y);
    const shoulderRGrad = ctx.createRadialGradient(12, -12, 4, 0, 0, 48);
    shoulderRGrad.addColorStop(0, cGoldenLight);
    shoulderRGrad.addColorStop(0.65, cGoldenBase);
    shoulderRGrad.addColorStop(1, cGoldenShadow);

    ctx.beginPath();
    ctx.moveTo(10, -45);
    ctx.bezierCurveTo(38, -30, 42, 25, 15, 42);
    ctx.bezierCurveTo(-15, 40, -20, -10, 10, -45);
    ctx.closePath();
    ctx.fillStyle = shoulderRGrad;
    ctx.fill();

    // Orange rim light
    ctx.strokeStyle = 'rgba(255,122,0,0.45)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Shoulder rosettes
    [[16, -18, 7], [24, 5, 8], [4, 15, 6], [14, 25, 6.5]].forEach(([sx, sy, sr]) => {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fillStyle = cSpotDark; ctx.fill();
      ctx.beginPath(); ctx.arc(sx - 1, sy, sr * 0.45, 0, Math.PI * 2); ctx.fillStyle = cSpotRosette; ctx.fill();
    });
    ctx.restore();

    /* ── 5. CHEST & STERNUM ── */
    ctx.save();
    const breatheScale = 1 + (breatheFactor || 0) * 0.04;
    ctx.scale(breatheScale, breatheScale);

    const chestGrad = ctx.createLinearGradient(0, -35, 0, 45);
    chestGrad.addColorStop(0, cGoldenLight);
    chestGrad.addColorStop(0.5, cGoldenBase);
    chestGrad.addColorStop(1, cGoldenShadow);

    ctx.beginPath();
    ctx.moveTo(-38, -32);
    ctx.bezierCurveTo(-48, 2, -40, 48, 0, 52);
    ctx.bezierCurveTo(40, 48, 48, 2, 38, -32);
    ctx.closePath();
    ctx.fillStyle = chestGrad;
    ctx.fill();

    // Cream chest patch
    ctx.beginPath();
    ctx.ellipse(0, 16, 22, 34, 0, 0, Math.PI * 2);
    ctx.fillStyle = cCreamBelly;
    ctx.fill();

    // Chest spots
    [[-14, -8, 4.5], [14, -8, 4.5], [-22, 12, 5.5], [22, 12, 5.5], [-10, 28, 4.5], [10, 28, 4.5], [0, 40, 4]].forEach(([cx2, cy2, cr]) => {
      ctx.beginPath(); ctx.arc(cx2, cy2, cr, 0, Math.PI * 2); ctx.fillStyle = cSpotDark; ctx.fill();
    });
    ctx.restore();

    /* ── 6. FORELIMBS (LEGS & ANATOMICAL PAWS) ── */
    // Left Leg
    ctx.save();
    const leftLegY = 42 + legL_Reach * 0.45 - legL_Lift;
    ctx.translate(-36, leftLegY);

    // Upper arm & forearm
    const legLGrad = ctx.createLinearGradient(-14, 0, 14, 0);
    legLGrad.addColorStop(0, cGoldenShadow);
    legLGrad.addColorStop(0.5, cGoldenBase);
    legLGrad.addColorStop(1, cGoldenLight);

    ctx.beginPath();
    ctx.moveTo(-15, -35);
    ctx.lineTo(15, -35);
    ctx.lineTo(12, 42);
    ctx.lineTo(-12, 42);
    ctx.closePath();
    ctx.fillStyle = legLGrad;
    ctx.fill();

    // Spots on forearm
    [[-5, -18, 3.5], [5, -8, 4], [-4, 12, 3.5], [4, 24, 3.5]].forEach(([lx, ly, lr]) => {
      ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.fillStyle = cSpotDark; ctx.fill();
    });

    // Pastern & Paw
    ctx.beginPath();
    ctx.ellipse(0, 46, 17, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = cCreamBelly;
    ctx.fill();

    // Toes & Claws
    [-8, -3, 3, 8].forEach(tx => {
      ctx.beginPath(); ctx.arc(tx, 48, 3.8, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.beginPath(); ctx.arc(tx, 50, 1.4, 0, Math.PI * 2); ctx.fillStyle = '#0a0603'; ctx.fill();
    });
    ctx.restore();

    // Right Leg
    ctx.save();
    const rightLegY = 42 + legR_Reach * 0.45 - legR_Lift;
    ctx.translate(36, rightLegY);

    const legRGrad = ctx.createLinearGradient(-14, 0, 14, 0);
    legRGrad.addColorStop(0, cGoldenLight);
    legRGrad.addColorStop(0.5, cGoldenBase);
    legRGrad.addColorStop(1, cGoldenShadow);

    ctx.beginPath();
    ctx.moveTo(-15, -35);
    ctx.lineTo(15, -35);
    ctx.lineTo(12, 42);
    ctx.lineTo(-12, 42);
    ctx.closePath();
    ctx.fillStyle = legRGrad;
    ctx.fill();

    // Spots on forearm
    [[5, -18, 3.5], [-5, -8, 4], [4, 12, 3.5], [-4, 24, 3.5]].forEach(([lx, ly, lr]) => {
      ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.fillStyle = cSpotDark; ctx.fill();
    });

    // Pastern & Paw
    ctx.beginPath();
    ctx.ellipse(0, 46, 17, 11, 0, 0, Math.PI * 2);
    ctx.fillStyle = cCreamBelly;
    ctx.fill();

    // Toes & Claws
    [-8, -3, 3, 8].forEach(tx => {
      ctx.beginPath(); ctx.arc(tx, 48, 3.8, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.beginPath(); ctx.arc(tx, 50, 1.4, 0, Math.PI * 2); ctx.fillStyle = '#0a0603'; ctx.fill();
    });
    ctx.restore();

    /* ── 7. ICONIC STABILIZED HEAD (LOCKED GAZE INTO CAMERA) ── */
    ctx.save();
    ctx.translate(0, -72 + headNodY);
    ctx.rotate((headTurnAngle || 0) * Math.PI / 180);

    // Neck muscle base
    ctx.beginPath();
    ctx.ellipse(0, 16, 26, 19, 0, 0, Math.PI * 2);
    ctx.fillStyle = cGoldenBase;
    ctx.fill();

    // EARS
    // Left Ear
    ctx.beginPath();
    ctx.moveTo(-22, -20);
    ctx.quadraticCurveTo(-42, -48, -12, -38);
    ctx.closePath();
    ctx.fillStyle = cGoldenShadow;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-20, -22);
    ctx.quadraticCurveTo(-34, -44, -14, -36);
    ctx.fillStyle = cCreamBelly;
    ctx.fill();

    // Right Ear
    ctx.beginPath();
    ctx.moveTo(22, -20);
    ctx.quadraticCurveTo(42, -48, 12, -38);
    ctx.closePath();
    ctx.fillStyle = cGoldenShadow;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(20, -22);
    ctx.quadraticCurveTo(34, -44, 14, -36);
    ctx.fillStyle = cCreamBelly;
    ctx.fill();

    // Skull Contour (Sleek aerodynamic cat contour)
    const headGrad = ctx.createRadialGradient(0, -12, 6, 0, 0, 38);
    headGrad.addColorStop(0, cGoldenLight);
    headGrad.addColorStop(0.7, cGoldenBase);
    headGrad.addColorStop(1, cGoldenShadow);

    ctx.beginPath();
    ctx.moveTo(-30, -24);
    ctx.quadraticCurveTo(0, -34, 30, -24);
    ctx.quadraticCurveTo(36, 0, 26, 16);
    ctx.quadraticCurveTo(0, 28, -26, 16);
    ctx.quadraticCurveTo(-36, 0, -30, -24);
    ctx.closePath();
    ctx.fillStyle = headGrad;
    ctx.fill();

    // Cream Muzzle & Chin
    ctx.beginPath();
    ctx.ellipse(0, 12, 16, 13, 0, 0, Math.PI * 2);
    ctx.fillStyle = cCreamBelly;
    ctx.fill();

    // Tawny nose bridge
    ctx.beginPath();
    ctx.moveTo(-5.5, -18);
    ctx.lineTo(5.5, -18);
    ctx.lineTo(7.5, 4);
    ctx.lineTo(-7.5, 4);
    ctx.closePath();
    ctx.fillStyle = cGoldenBase;
    ctx.fill();

    // Black nose pad
    ctx.beginPath();
    ctx.moveTo(-6, 2);
    ctx.lineTo(6, 2);
    ctx.lineTo(4, 9.5);
    ctx.lineTo(0, 11.5);
    ctx.lineTo(-4, 9.5);
    ctx.closePath();
    ctx.fillStyle = '#100a04';
    ctx.fill();

    // BLACK TEAR STRIPES (Iconic cheetah/leopard stripes from eye to mouth)
    ctx.beginPath();
    ctx.moveTo(-11, -6); ctx.quadraticCurveTo(-15, 2, -10, 15);
    ctx.moveTo(11, -6); ctx.quadraticCurveTo(15, 2, 10, 15);
    ctx.strokeStyle = '#0e0803';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    // Forehead spots & stripes
    [[-12, -24, 2], [0, -27, 2.5], [12, -24, 2], [-6, -20, 2], [6, -20, 2], [-20, -14, 2.5], [20, -14, 2.5]].forEach(([fx, fy, fr]) => {
      ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI * 2); ctx.fillStyle = cSpotDark; ctx.fill();
    });

    /* ── EYES (INTENSE GLOWING AMBER ORANGE) ── */
    // Left Eye
    ctx.save();
    ctx.translate(-15, -9);
    ctx.rotate(-0.08);
    ctx.beginPath(); ctx.ellipse(0, 0, 8.5, 5.5, 0, 0, Math.PI * 2); ctx.fillStyle = '#0a0502'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 7, 4.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = cGlowOrange;
    ctx.shadowColor = cGlowOrange;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.ellipse(0, 0, 2.4, 4, 0, 0, Math.PI * 2); ctx.fillStyle = '#000'; ctx.fill();
    ctx.beginPath(); ctx.arc(-2, -1.6, 1.2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();

    // Right Eye
    ctx.save();
    ctx.translate(15, -9);
    ctx.rotate(0.08);
    ctx.beginPath(); ctx.ellipse(0, 0, 8.5, 5.5, 0, 0, Math.PI * 2); ctx.fillStyle = '#0a0502'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 7, 4.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = cGlowOrange;
    ctx.shadowColor = cGlowOrange;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.ellipse(0, 0, 2.4, 4, 0, 0, Math.PI * 2); ctx.fillStyle = '#000'; ctx.fill();
    ctx.beginPath(); ctx.arc(-2, -1.6, 1.2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();

    // Whiskers
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.8;
    [
      [-10, 10, -38, 6], [-10, 12, -40, 14], [-10, 14, -36, 22],
      [10, 10, 38, 6], [10, 12, 40, 14], [10, 14, 36, 22]
    ].forEach(([wx1, wy1, wx2, wy2]) => {
      ctx.beginPath(); ctx.moveTo(wx1, wy1); ctx.lineTo(wx2, wy2); ctx.stroke();
    });

    ctx.restore(); // end head

    ctx.restore(); // end main transform
  }

  /* ── State Machine ── */
  const STATE = {
    RUNNING: 'running',
    MICRO_STEPS: 'micro_steps',
    BREATHING: 'breathing',
    DONE: 'done',
  };

  let state = STATE.RUNNING;
  let microStepTime = 0;
  let breatheTime = 0;
  let currentX = CONFIG.startX;
  let currentSpeed = 0;
  let stridePhase = 0;
  let headTurnAngle = 0;
  let breatheFactor = 0;
  let lastTimestamp = null;

  function update(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, W, H);

    const leopardScreenX = currentX * W;
    const leopardScreenY = H * CONFIG.groundY;
    const scale = Math.min(W / 1100, H / 550) * 1.25;

    if (state === STATE.RUNNING) {
      time += dt;
      const tNorm = Math.min(1, time / CONFIG.duration);

      const accelEnd = CONFIG.accelTime / CONFIG.duration;
      const decelStart = 1 - CONFIG.decelTime / CONFIG.duration;

      if (tNorm < accelEnd) {
        currentSpeed = easeOutQuart(tNorm / accelEnd);
      } else if (tNorm > decelStart) {
        currentSpeed = easeOutQuart((1 - tNorm) / (1 - decelStart));
        currentSpeed = Math.max(0.06, currentSpeed);
      } else {
        currentSpeed = 1;
      }

      currentX = CONFIG.startX + (CONFIG.endX - CONFIG.startX) * easeInOutCubic(tNorm);

      stridePhase += dt * CONFIG.strideFreq * currentSpeed;
      stridePhase %= 1;

      drawMasterpieceLeopard(leopardScreenX, leopardScreenY, scale, stridePhase, currentSpeed, 0, 0);

      window.__leopard_runtime = {
        progress: tNorm,
        x: leopardScreenX,
        y: leopardScreenY,
        speed: currentSpeed,
        finished: false,
      };

      if (tNorm >= 1) {
        state = STATE.MICRO_STEPS;
        microStepTime = 0;
        currentX = CONFIG.endX;
      }
    }

    else if (state === STATE.MICRO_STEPS) {
      microStepTime += dt;
      const microDuration = 1.1;
      const microPhase = Math.min(1, microStepTime / microDuration);

      currentSpeed = Math.max(0, 0.22 * (1 - easeOutQuart(microPhase)));
      currentX = CONFIG.endX + microPhase * 0.015;

      stridePhase += dt * CONFIG.strideFreq * currentSpeed * 0.4;
      stridePhase %= 1;

      headTurnAngle = Math.sin(microPhase * Math.PI) * 5;

      const screenX = currentX * W;
      drawMasterpieceLeopard(screenX, leopardScreenY, scale, stridePhase, currentSpeed, headTurnAngle, 0);

      window.__leopard_runtime = {
        progress: 1,
        x: screenX,
        y: leopardScreenY,
        speed: currentSpeed,
        finished: false,
      };

      if (microPhase >= 1) {
        state = STATE.BREATHING;
        breatheTime = 0;
      }
    }

    else if (state === STATE.BREATHING) {
      breatheTime += dt;
      const breathDuration = 1.4;
      const breathPhase = Math.min(1, breatheTime / breathDuration);

      currentSpeed = 0;
      breatheFactor = Math.sin(breatheTime * 3.5) * (1 - breathPhase * 0.5);
      headTurnAngle = Math.sin(breatheTime * 1.2) * 3;

      const screenX = currentX * W;
      drawMasterpieceLeopard(screenX, leopardScreenY, scale, 0, 0, headTurnAngle, breatheFactor);

      window.__leopard_runtime = {
        progress: 1,
        x: screenX,
        y: leopardScreenY,
        speed: 0,
        finished: false,
      };

      if (breathPhase >= 1) {
        state = STATE.DONE;
        finished = true;
        window.__leopard_runtime = {
          progress: 1,
          x: currentX * W,
          y: leopardScreenY,
          speed: 0,
          finished: true,
        };
      }
    }

    else if (state === STATE.DONE) {
      const screenX = currentX * W;
      drawMasterpieceLeopard(screenX, leopardScreenY, scale, 0, 0, 0, 0);
    }

    if (!finished || state === STATE.DONE) {
      requestAnimationFrame(update);
    }
  }

  setTimeout(() => {
    requestAnimationFrame(update);
  }, 700);

  window.__leopard_runtime = { progress: 0, x: 0, y: 0, speed: 0, finished: false };
})();
