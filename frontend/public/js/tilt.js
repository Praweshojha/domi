/**
 * Card3DTilt — Zero-dependency 3D perspective mouse physics
 * Ported from template's react-parallax-tilt to vanilla JS
 * Adheres strictly to Terrain Tokens and reduced-motion preferences
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function attachTilt(el) {
    if (el._hasTilt) return;
    el._hasTilt = true;

    // Ensure parent styling allows 3D transform
    el.classList.add('paper-panel-tilt');

    // Create glare overlay if not present
    let glare = el.querySelector('.tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      el.appendChild(glare);
    }

    let rect = null;
    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;

    // Configurable tilt parameters
    const MAX_TILT = parseFloat(el.getAttribute('data-tilt-max') || '10'); // degrees
    const PERSPECTIVE = el.getAttribute('data-tilt-perspective') || '1000px';
    const SCALE = parseFloat(el.getAttribute('data-tilt-scale') || '1.018');

    function update() {
      if (!isHovered) {
        // Smoothly interpolate back to center
        currentX += (0 - currentX) * 0.15;
        currentY += (0 - currentY) * 0.15;

        if (Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
          currentX = 0;
          currentY = 0;
          el.style.transform = '';
          el.classList.remove('is-tilting');
          rafId = null;
          return;
        }
      } else {
        // Smoothly follow mouse
        currentX += (targetX - currentX) * 0.2;
        currentY += (targetY - currentY) * 0.2;
      }

      const rotateX = (-currentY * MAX_TILT).toFixed(2);
      const rotateY = (currentX * MAX_TILT).toFixed(2);

      el.style.transform = `perspective(${PERSPECTIVE}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${SCALE}, ${SCALE}, ${SCALE})`;

      rafId = requestAnimationFrame(update);
    }

    el.addEventListener('mouseenter', () => {
      rect = el.getBoundingClientRect();
      isHovered = true;
      el.classList.add('is-tilting');
      if (!rafId) rafId = requestAnimationFrame(update);
    });

    el.addEventListener('mousemove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates (-1 to 1)
      targetX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

      // Glare position percentage
      const glareX = ((x / rect.width) * 100).toFixed(1);
      const glareY = ((y / rect.height) * 100).toFixed(1);
      el.style.setProperty('--glare-x', `${glareX}%`);
      el.style.setProperty('--glare-y', `${glareY}%`);
    });

    el.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      rect = null;
    });
  }

  function initTilt() {
    const targets = document.querySelectorAll('.plate-card, .strip-cell, .about-panel, .tech-ball-card');
    targets.forEach(attachTilt);
  }

  // Export to global scope
  window.initTilt = initTilt;
  window.attachTilt = attachTilt;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }
})();
