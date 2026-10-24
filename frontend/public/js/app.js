// Navigation Menu Toggle
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

// Avatar dismiss handler (instant, CSP-compliant, works on any click/touch on the avatar)
document.addEventListener('click', (e) => {
  const avatarWrapper = document.getElementById('avatar-drop');
  if (avatarWrapper && (avatarWrapper.contains(e.target) || e.target.closest('#avatar-drop') || e.target.closest('#avatar-dismiss'))) {
    avatarWrapper.style.display = 'none';
  }
});

// Mouse-tracking Spotlight Glow on Cards
const spotlightElements = document.querySelectorAll(
  '.project-card, .journey-card, .floating-card, .contact-details > a'
);
spotlightElements.forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Interactive Parallax on Hero Section
const heroSection = document.querySelector('.hero');
const globeWrapper = document.querySelector('.globe-wrapper');
if (heroSection && globeWrapper) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    globeWrapper.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    globeWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
    globeWrapper.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });
  heroSection.addEventListener('mouseenter', () => {
    globeWrapper.style.transition = 'none';
  });
}

// Background Ambient Video Controller
const bgVideo = document.getElementById('bg-video');
const motionToggle = document.getElementById('video-motion-toggle');

if (bgVideo && motionToggle) {
  const statusSpan = motionToggle.querySelector('.motion-status');
  let userPaused = false;

  const playVideo = () => {
    bgVideo.muted = true;
    bgVideo.defaultMuted = true;
    bgVideo.playsInline = true;
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        motionToggle.classList.remove('paused');
        if (statusSpan) statusSpan.textContent = 'LIVE STREAM';
      }).catch(() => {
        motionToggle.classList.add('paused');
        if (statusSpan) statusSpan.textContent = 'PAUSED';
      });
    }
  };

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    userPaused = true;
    bgVideo.pause();
    motionToggle.classList.add('paused');
    if (statusSpan) statusSpan.textContent = 'PAUSED';
  } else {
    playVideo();
  }

  // Resume on first user touch/click/scroll if browser blocked initial autoplay
  const resumeOnInteraction = () => {
    if (bgVideo.paused && !userPaused) {
      playVideo();
    }
  };
  ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
    window.addEventListener(evt, resumeOnInteraction, { once: true, passive: true });
  });

  // Manual toggle button
  motionToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgVideo.paused) {
      userPaused = false;
      playVideo();
    } else {
      userPaused = true;
      bgVideo.pause();
      motionToggle.classList.add('paused');
      if (statusSpan) statusSpan.textContent = 'PAUSED';
    }
  });
}
