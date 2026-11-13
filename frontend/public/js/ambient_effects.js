/**
 * Ambient Effects Suite for Prawesh Ojha Geomatics Portfolio
 * Features:
 *  1. Floating Sand-Colored Particles (tsParticles) - 60fps, disabled on mobile & reduced motion
 *  2. Soft Cursor-Following Glow - Silky lerped tracking, disabled on touch/mobile
 *  3. Magnetic Proximity Buttons - Subtle elastic attraction, disabled on touch/mobile
 *  4. Universal Staggered Scroll-Reveal Observer
 * Strictly preserves Banepa background video and Terrain Tokens (#FAF7F0, #14261C, #166534, #D97706)
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 768;

  /* ==========================================================================
     1. FLOATING SAND-COLORED PARTICLES (tsParticles)
     ========================================================================== */
  function initAmbientParticles() {
    if (isReducedMotion || isTouchDevice || typeof tsParticles === 'undefined') return;

    const particlesContainer = document.getElementById('tsparticles');
    if (!particlesContainer) return;

    tsParticles.load('tsparticles', {
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: {
          value: 32, // Minimal count for silky smooth 60fps and readable background
          density: {
            enable: true,
            area: 900
          }
        },
        color: {
          value: ['#FAF7F0', '#F0EADB', '#D97706', '#E2D9C5']
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: { min: 0.12, max: 0.38 },
          animation: {
            enable: true,
            speed: 0.8,
            minimumValue: 0.08,
            sync: false
          }
        },
        size: {
          value: { min: 1.5, max: 3.2 }
        },
        move: {
          enable: true,
          speed: 0.55, // Gentle, slow floating ambient drift
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out'
          }
        }
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: true,
            mode: 'bubble'
          },
          resize: true
        },
        modes: {
          bubble: {
            distance: 140,
            size: 4.5,
            duration: 1.2,
            opacity: 0.6
          }
        }
      },
      detectRetina: true
    }).catch(err => {
      console.warn('Particles initialization info:', err);
    });
  }

  /* ==========================================================================
     2. SOFT CURSOR-FOLLOWING GLOW (Silky Lerp at 60fps)
     ========================================================================== */
  function initCursorGlow() {
    if (isTouchDevice || isReducedMotion) return;

    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isMoving = false;
    let hasMoved = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        glow.style.opacity = '1';
      }
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(renderGlow);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (hasMoved) glow.style.opacity = '1';
    });

    function renderGlow() {
      // 0.12 lerp factor for butter-smooth trailing
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        requestAnimationFrame(renderGlow);
      } else {
        isMoving = false;
      }
    }
  }

  /* ==========================================================================
     3. MAGNETIC BUTTONS (Subtle Elastic Proximity Pull)
     ========================================================================== */
  function initMagneticButtons() {
    if (isTouchDevice || isReducedMotion) return;

    const magneticElements = document.querySelectorAll('.btn-survey, .nav-signal-btn, .menu-toggle, .dial-zoom-btn, .dial-mode-btn, .survey-video-btn');

    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.28; // Subtle 28% magnetic pull
        const deltaY = (e.clientY - centerY) * 0.28;

        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  /* ==========================================================================
     4. UNIVERSAL STAGGERED SCROLL-REVEAL ANIMATIONS
     ========================================================================== */
  function initScrollReveal() {
    // Add reveal-on-scroll to key sections and cards if not already present
    const targets = document.querySelectorAll('.plate-card, .journey-item, .strip-cell, .tech-toolkit-block, .contact-block, .reveal-on-scroll');

    if (isReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach((el, index) => {
      el.classList.add('reveal-on-scroll');
      // Assign subtle stagger delay to grid siblings
      const siblingIndex = Array.from(el.parentElement ? el.parentElement.children : []).indexOf(el);
      if (siblingIndex > 0 && siblingIndex <= 6) {
        el.style.transitionDelay = `${siblingIndex * 70}ms`;
      }
      observer.observe(el);
    });
  }

  // Initialize all ambient modules when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAmbientParticles();
      initCursorGlow();
      initMagneticButtons();
      initScrollReveal();
    });
  } else {
    initAmbientParticles();
    initCursorGlow();
    initMagneticButtons();
    initScrollReveal();
  }
})();
