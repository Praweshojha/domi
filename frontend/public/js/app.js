// Navigation Menu Toggle (Lowercase Mono Nav)
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Dynamic Footer Year
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Avatar Dismiss Handler (Instant, CSP-compliant, click & keyboard)
const avatarWrapper = document.getElementById('avatar-drop');
const dismissAvatar = () => {
  if (avatarWrapper) {
    avatarWrapper.style.display = 'none';
  }
};

document.addEventListener('click', (e) => {
  if (avatarWrapper && (avatarWrapper.contains(e.target) || e.target.closest('#avatar-drop') || e.target.closest('#avatar-dismiss'))) {
    dismissAvatar();
  }
});

const avatarDismissBtn = document.getElementById('avatar-dismiss');
if (avatarDismissBtn) {
  avatarDismissBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      dismissAvatar();
    }
  });
}

// Signature Element 5: Reticle Cursor (Fine pointer only; decorative readout)
const reticleCursor = document.getElementById('reticle-cursor');
const reticleCoords = document.getElementById('reticle-coords');

if (reticleCursor && window.matchMedia && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const renderReticle = () => {
    currentX += (mouseX - currentX) * 0.25;
    currentY += (mouseY - currentY) * 0.25;
    reticleCursor.style.left = `${currentX}px`;
    reticleCursor.style.top = `${currentY}px`;

    // Decorative cartographic grid coordinate readout calculated from screen position
    if (reticleCoords) {
      const lonFrac = (currentX / window.innerWidth * 0.45).toFixed(2);
      const latFrac = ((window.innerHeight - currentY) / window.innerHeight * 0.38).toFixed(2);
      reticleCoords.textContent = `e 85°32.${lonFrac}' n 27°37.${latFrac}'`;
    }

    requestAnimationFrame(renderReticle);
  };
  requestAnimationFrame(renderReticle);

  // Turn signal-colored when hovering links or buttons
  const interactiveSelector = 'a, button, input, [role="button"], .plate-card, .btn-survey';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      reticleCursor.classList.add('is-signal');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      reticleCursor.classList.remove('is-signal');
    }
  });
}

// Signature Element 1: Neatline Scroll Progress Pointer & Dynamic Graticules
const neatlinePointer = document.getElementById('neatline-pointer');
const neatlineLat = document.getElementById('neatline-lat');
const neatlineLon = document.getElementById('neatline-lon');

const updateNeatline = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

  if (neatlinePointer) {
    const trackHeight = window.innerHeight - 36;
    neatlinePointer.style.transform = `translateY(${progress * trackHeight}px)`;
  }

  // Advance decorative graticules slightly as user scrolls through the survey sheet
  if (neatlineLat && neatlineLon) {
    const secOffset = Math.floor(progress * 45);
    neatlineLat.textContent = `27°37'${10 + secOffset}"N · 27°37'${25 + secOffset}"N · 27°37'${40 + secOffset}"N · 27°38'${(secOffset % 60)}"N`;
    neatlineLon.textContent = `85°32'${(secOffset % 60)}"E · 85°32'${15 + (secOffset % 45)}"E · 85°33'${30 + (secOffset % 30)}"E`;
  }
};

window.addEventListener('scroll', updateNeatline, { passive: true });
window.addEventListener('resize', updateNeatline, { passive: true });
updateNeatline();

// Background Video Controller (40px Square Paper Button)
const bgVideo = document.getElementById('bg-video');
const videoToggleBtn = document.getElementById('video-motion-toggle');

if (bgVideo && videoToggleBtn) {
  let userPaused = false;

  const updateBtnState = (isPaused) => {
    if (isPaused) {
      videoToggleBtn.classList.add('paused');
      videoToggleBtn.setAttribute('aria-label', 'Play background video');
      videoToggleBtn.setAttribute('title', 'Play background video');
    } else {
      videoToggleBtn.classList.remove('paused');
      videoToggleBtn.setAttribute('aria-label', 'Pause background video');
      videoToggleBtn.setAttribute('title', 'Pause background video');
    }
  };

  const playVideo = () => {
    bgVideo.muted = true;
    bgVideo.defaultMuted = true;
    bgVideo.playsInline = true;
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateBtnState(false);
      }).catch(() => {
        updateBtnState(true);
      });
    }
  };

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    userPaused = true;
    bgVideo.pause();
    updateBtnState(true);
  } else {
    playVideo();
  }

  const resumeOnInteraction = () => {
    if (bgVideo.paused && !userPaused) {
      playVideo();
    }
  };
  ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
    window.addEventListener(evt, resumeOnInteraction, { once: true, passive: true });
  });

  videoToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgVideo.paused) {
      userPaused = false;
      playVideo();
    } else {
      userPaused = true;
      bgVideo.pause();
      updateBtnState(true);
    }
  });
}

// Scroll Reveal Animation (Panels fade up 12px, 450ms, once)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.classList.add('is-revealed');
  });
}
