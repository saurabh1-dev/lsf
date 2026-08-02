/* ===== LEOPARD SECURITY FORCE — MAIN SCRIPT ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Cinematic Preloader Controller ── */
  const preloader = document.getElementById('preloader');
  const fillEl = document.getElementById('preloader-fill');
  const glowEl = document.getElementById('preloader-glow');

  if (preloader) {
    /* ── Gold Spark Canvas Animation ── */
    const canvas = document.getElementById('preloader-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let W, H;

      function sizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }
      sizeCanvas();
      window.addEventListener('resize', sizeCanvas);

      /* Spark particles radiating from center */
      const sparks = Array.from({ length: 50 }, () => newSpark());

      function newSpark() {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.6;
        const colors = ['255,200,50', '255,140,0', '225,68,28', '255,220,80', '255,80,0'];
        return {
          x: 0.5,             // normalized centre-x
          y: 0.48,            // normalized centre-y
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 2.2 + 0.5,
          a: Math.random() * 0.7 + 0.3,
          life: Math.random() * 0.6 + 0.4, // 0-1 remaining life
          decay: Math.random() * 0.008 + 0.004,
          c: colors[Math.floor(Math.random() * colors.length)]
        };
      }

      function drawSparks() {
        ctx.clearRect(0, 0, W, H);

        sparks.forEach((s, i) => {
          /* Respawn dead sparks */
          if (s.life <= 0) { sparks[i] = newSpark(); return; }

          s.x += s.vx / W;
          s.y += s.vy / H;
          s.vy += 0.04 / H; // tiny gravity drift
          s.a -= 0.008;
          s.life -= s.decay;

          if (s.a <= 0 || s.x < -0.05 || s.x > 1.05 || s.y < -0.05 || s.y > 1.1) {
            sparks[i] = newSpark(); return;
          }

          ctx.save();
          ctx.globalAlpha = Math.max(0, s.a);
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
          ctx.shadowBlur = s.r * 6;
          ctx.shadowColor = `rgba(${s.c},0.9)`;
          ctx.fillStyle = `rgba(${s.c},1)`;
          ctx.fill();
          ctx.restore();
        });

        requestAnimationFrame(drawSparks);
      }
      drawSparks();
    }

    /* ── Progress bar ── */
    let smoothPct = 0, pageLoaded = false, hidden = false, startTime = null;
    const MIN_MS = 4500; // Guaranteed 4.5 second display time for full cinematic video experience

    function setProgress(pct) {
      pct = Math.min(100, Math.max(0, pct));
      if (fillEl) fillEl.style.width = pct + '%';
      if (glowEl) { glowEl.style.left = pct + '%'; glowEl.style.opacity = pct > 1 ? '1' : '0'; }
      const pctEl = document.getElementById('preloader-pct');
      if (pctEl) pctEl.textContent = Math.floor(pct) + '%';
    }

    function tryHide() {
      if (hidden) return;
      hidden = true;
      setProgress(100);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('hide');
          window.dispatchEvent(new CustomEvent('preloaderHidden'));
          setTimeout(() => { if (preloader && preloader.parentNode) preloader.remove(); }, 600);
        }
      }, 300);
    }

    function tick(ts) {
      if (hidden) return;
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      let target = Math.min(99, (elapsed / MIN_MS) * 100);

      smoothPct += (target - smoothPct) * 0.1;
      if (smoothPct < target) smoothPct = Math.min(target, smoothPct + 0.8);

      setProgress(smoothPct);

      if (elapsed >= MIN_MS && (pageLoaded || elapsed >= MIN_MS + 500)) {
        tryHide();
      } else {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);

    function onLoad() { pageLoaded = true; }
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
  }



  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          if (hamburger) hamburger.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  });

  /* ---------- Back to Top ---------- */
  // Handled by new back-to-top script below

  /* ---------- Active Nav Link ---------- */
  const path = window.location.pathname.toLowerCase();
  const isHomePage = path.endsWith('index.html') || path.endsWith('/') || path === '';

  if (isHomePage) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    function setActiveLink() {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) current = section.getAttribute('id');
      });
      if (current) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }
    window.addEventListener('scroll', setActiveLink);
  }

  /* ---------- About Secondary Navigation Scroll Spy ---------- */
  const aboutSecondaryLinks = document.querySelectorAll('.about-secondary-nav a');
  const aboutTargets = document.querySelectorAll('.about-section-target');

  function setAboutSecondaryActive(linkId) {
    aboutSecondaryLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${linkId}`);
    });
  }

  function updateAboutScrollSpy() {
    const viewportMid = window.scrollY + window.innerHeight * 0.35;
    let currentSection = 'overview';

    aboutTargets.forEach(section => {
      if (viewportMid >= section.offsetTop) {
        currentSection = section.getAttribute('id');
      }
    });

    setAboutSecondaryActive(currentSection);
  }

  if (aboutSecondaryLinks.length && aboutTargets.length) {
    aboutSecondaryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setAboutSecondaryActive(target.getAttribute('id'));
        }
      });
    });

    window.addEventListener('scroll', updateAboutScrollSpy, { passive: true });
    updateAboutScrollSpy();
  }

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Photo Slideshow ---------- */
  const slideshowImages = document.querySelectorAll('.photo-slideshow img');
  let slideshowIndex = 0;

  if (slideshowImages.length > 1) {
    setInterval(() => {
      slideshowImages[slideshowIndex].classList.remove('active');
      slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
      slideshowImages[slideshowIndex].classList.add('active');
    }, 4000);
  }

  /* ---------- Gallery Rotator Boxes ---------- */
  const galleryRotatorBoxes = document.querySelectorAll('.gallery-rotator-box');

  galleryRotatorBoxes.forEach((box) => {
    const slides = box.querySelectorAll('.gallery-rotator-slide');
    let activeSlide = 0;
    const delayAttr = parseInt(box.getAttribute('data-rotate-delay'), 10);
    const delay = Number.isFinite(delayAttr) && delayAttr > 0 ? delayAttr : 4000;

    if (slides.length > 1) {
      setInterval(() => {
        slides[activeSlide].classList.remove('active');
        activeSlide = (activeSlide + 1) % slides.length;
        slides[activeSlide].classList.add('active');
      }, delay);
    }
  });

  /* ---------- Testimonial Auto Scroll ---------- */
  const testimonialsSlider = document.querySelector('.testimonials-slider');
  if (testimonialsSlider) {
    const testimonialCards = testimonialsSlider.querySelectorAll('.testimonial-card');
    const cardGap = parseFloat(getComputedStyle(testimonialsSlider).gap || 30);
    const cardWidth = testimonialCards.length ? testimonialCards[0].getBoundingClientRect().width + cardGap : 0;

    setInterval(() => {
      const maxScroll = testimonialsSlider.scrollWidth - testimonialsSlider.clientWidth;
      if (maxScroll <= 0 || !cardWidth) return;

      const nextScroll = testimonialsSlider.scrollLeft + cardWidth;

      if (nextScroll >= maxScroll) {
        testimonialsSlider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        testimonialsSlider.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 8000);
  }

  /* ---------- Scroll Reveal Animations ---------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animations
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('.counter');
  let counterDone = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterDone) {
        counterDone = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            counter.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }
          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsBanner = document.querySelector('.stats-banner');
  if (statsBanner) counterObserver.observe(statsBanner);

  /* ---------- Contact Form ---------- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const footerSubscribeForm = document.getElementById('footerSubscribeForm');
  const footerSuccessMessage = document.getElementById('footerSuccessMessage');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!name || !phone || !email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Sending...';

      setTimeout(() => {
        showNotification('Thank you! We will contact you within 24 hours.', 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚀 Send Inquiry';
      }, 1500);
    });
  }

  if (footerSubscribeForm) {
    footerSubscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const mobileInput = document.getElementById('footerMobileNumber');
      if (mobileInput && mobileInput.value.trim() !== '') {
        footerSubscribeForm.style.display = 'none';
        if (footerSuccessMessage) footerSuccessMessage.style.display = 'block';
      }
    });
  }

  /* ---------- Notification Toast ---------- */
  function showNotification(message, type = 'success') {
    // Remove existing
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : '⚠️'}</span>
      <span>${message}</span>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: type === 'success' ? '#111' : '#331111',
      color: '#fff',
      padding: '16px 28px',
      borderRadius: '12px',
      border: `1px solid ${type === 'success' ? 'rgba(230,0,18,.5)' : 'rgba(255,100,100,.5)'}`,
      boxShadow: '0 10px 40px rgba(0,0,0,.5)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '.95rem',
      fontFamily: "'Outfit', sans-serif",
      opacity: '0',
      transition: 'all .4s ease'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* ---------- Parallax on Hero (subtle) ---------- */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1.05)`;
      }
    });
  }

  /* ---------- Typing Effect for Hero Badge ---------- */
  // Already handled via CSS animation — optional JS version

  /* ---------- Gallery Lightbox ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const title = item.querySelector('h4')?.textContent || '';

      const lightbox = document.createElement('div');
      Object.assign(lightbox.style, {
        position: 'fixed',
        inset: '0',
        background: 'rgba(0,0,0,.93)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        opacity: '0',
        transition: 'opacity .3s ease',
        cursor: 'pointer'
      });

      lightbox.innerHTML = `
        <img src="${imgSrc}" style="max-width:90%; max-height:75vh; border-radius:12px; box-shadow: 0 20px 60px rgba(0,0,0,.5);" alt="${title}">
        <p style="font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:3px; color:#fff;">${title}</p>
        <p style="font-size:.8rem; color:#888; letter-spacing:2px;">CLICK ANYWHERE TO CLOSE</p>
      `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => { lightbox.style.opacity = '1'; });

      lightbox.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        document.body.style.overflow = '';
        setTimeout(() => lightbox.remove(), 300);
      });
    });
  });

  /* ---------- FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* ---------- Career Form ---------- */
  const careerForm = document.getElementById('careerForm');
  const appSubmitBtn = document.getElementById('appSubmitBtn');

  if (careerForm && appSubmitBtn) {
    careerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('appFullName').value.trim();
      const phone = document.getElementById('appPhone').value.trim();
      const email = document.getElementById('appEmail').value.trim();
      const position = document.getElementById('appPosition').value;

      if (!name || !phone || !email || !position) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      appSubmitBtn.disabled = true;
      appSubmitBtn.innerHTML = '⏳ Submitting Profile...';

      setTimeout(() => {
        showNotification('Profile submitted successfully! Our HR team will reach out soon.', 'success');
        careerForm.reset();
        appSubmitBtn.disabled = false;
        appSubmitBtn.innerHTML = '🚀 Submit Application';
      }, 1500);
    });
  }

  /* ---------- Stats Banner Spark Particles ---------- */
  const statsCanvas = document.getElementById('statsCanvas');
  if (statsCanvas) {
    const ctx = statsCanvas.getContext('2d');
    let width = statsCanvas.width = statsCanvas.offsetWidth;
    let height = statsCanvas.height = statsCanvas.offsetHeight;

    // Handle resize
    window.addEventListener('resize', () => {
      if (statsCanvas.offsetWidth && statsCanvas.offsetHeight) {
        width = statsCanvas.width = statsCanvas.offsetWidth;
        height = statsCanvas.height = statsCanvas.offsetHeight;
      }
    });

    const particles = [];
    const maxParticles = 30;

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // Distribute particles initially
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 2 + 0.6; // Amber specs
        this.speedY = -(Math.random() * 1.2 + 0.3); // Upward float
        this.speedX = Math.random() * 0.8 - 0.4; // Subtle drift
        this.alpha = Math.random() * 0.4 + 0.2; // Opacity
        const colors = [
          'rgba(255, 69, 0, ',   // OrangeRed
          'rgba(255, 120, 0, ',  // Amber
          'rgba(230, 0, 18, ',   // Custom Brand Red
          'rgba(255, 180, 0, '   // Gold
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Spark flickering
        this.alpha += (Math.random() * 0.08 - 0.04);
        if (this.alpha < 0) this.alpha = 0.05;
        if (this.alpha > 0.7) this.alpha = 0.7;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.shadowBlur = this.size * 2.5;
        ctx.shadowColor = 'rgba(255, 69, 0, 0.7)';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorBase + this.alpha + ')';
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ---------- Global Star Background Animation ---------- */
  const globalCanvas = document.createElement('canvas');
  globalCanvas.id = 'globalStarCanvas';
  Object.assign(globalCanvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '0',
    pointerEvents: 'none'
  });
  document.body.prepend(globalCanvas);

  const gCtx = globalCanvas.getContext('2d');
  let gWidth, gHeight;
  const globalStars = [];

  function initGlobalCanvas() {
    gWidth = globalCanvas.width = window.innerWidth;
    gHeight = globalCanvas.height = window.innerHeight;
  }

  window.addEventListener('resize', initGlobalCanvas);
  initGlobalCanvas();

  class GlobalStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * gWidth;
      this.y = Math.random() * gHeight;
      const rand = Math.random();
      if (rand < 0.90) {
        this.size = Math.random() * 1.5 + 0.5;
        this.isSquare = false;
        this.color = '#ffffff';
      } else {
        this.size = Math.random() * 3 + 2;
        this.isSquare = true;
        this.color = '#aaaaaa';
      }
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0) this.x = gWidth;
      if (this.x > gWidth) this.x = 0;
      if (this.y < 0) this.y = gHeight;
      if (this.y > gHeight) this.y = 0;
    }
    draw() {
      gCtx.globalAlpha = this.alpha;
      gCtx.fillStyle = this.color;
      if (this.isSquare) {
        gCtx.fillRect(this.x, this.y, this.size, this.size);
      } else {
        gCtx.beginPath();
        gCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        gCtx.fill();
      }
    }
  }

  for (let i = 0; i < 80; i++) {
    globalStars.push(new GlobalStar());
  }

  function animateGlobalStars() {
    gCtx.clearRect(0, 0, gWidth, gHeight);
    for (let i = 0; i < globalStars.length; i++) {
      globalStars[i].update();
      globalStars[i].draw();
    }
    requestAnimationFrame(animateGlobalStars);
  }
  animateGlobalStars();

});
