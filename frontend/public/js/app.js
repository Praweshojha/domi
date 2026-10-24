// Navigation Menu Toggle (Mobile Viewport)
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

// Background Video Controller (40px Sand Button, 10px Radius)
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
