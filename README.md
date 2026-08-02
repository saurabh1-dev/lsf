# LEOPARD SECURITY FORCE — Cinematic Website Loader

A luxury, high-end 60 FPS cinematic website loading animation handcrafted using HTML5, CSS3, Vanilla JavaScript, SVG, and HTML5 Canvas.

## Features

- **Custom Skeletal Leopard Engine (`leopard.js`)**: 
  - Real-time inverse-kinematics-inspired joint animation for big-cat gallop gait.
  - Anatomical movement: stride cycle, torso stretch & compression, shoulder/hip rotation, head stabilization with counter-bob, and tail physics.
  - Realistic velocity profile: acceleration, cruise, deceleration, finishing micro-steps, breathing, head turn, and tail sway.
- **Luxurious Energy Trail (`particles.js`)**:
  - Soft glowing light streaks (#FF7A00) with bloom effect.
  - 3 particle types: core radial glows, streak vectors, and floating micro-sparkles.
  - 100% custom canvas rendering with lighter blend modes — zero fire, smoke, or sparks.
- **Light-Painted Logo Reveal (`loader.js`)**:
  - Animated SVG stroke-dash reveal following the leopard's path across the screen.
  - Dynamic letter-by-letter brand text illumination with soft pulsing ambient glow.
- **Synchronized Glass Progress Bar**:
  - Thin, glassmorphism progress bar with leading glow dot synchronized perfectly to the leopard's position.
- **Responsive & Performance Optimized**:
  - Target 60 FPS using `requestAnimationFrame`, `translate3d`, `will-change`, and GPU acceleration.
  - Works seamlessly across Desktop, Laptop, Tablet, Mobile, Ultra-wide screens, and Retina displays.

## File Structure

- `index.html`: Production HTML structure integrating the loader screen and main website wrapper.
- `style.css`: Core site stylesheet.
- `animations.css`: Keyframes, loader layout, typography, glassmorphism, and cinematic transitions.
- `responsive.css`: Breakpoints for mobile, tablet, desktop, ultra-wide, retina, and reduced motion.
- `leopard.js`: Canvas-based skeletal leopard animation engine.
- `particles.js`: Canvas-based glowing light streak & particle trail system.
- `loader.js`: Master loader controller (progress, reveals, ambient glow, page transition).
- `leopard.svg`: Vector source asset for leopard graphics & skeletal components.
- `logo.svg`: Brand logo mark & typography with SVG gradient defs.
- `README.md`: Project documentation.
