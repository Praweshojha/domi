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

// 1-Click Email Copy Handler
const copyEmailBtn = document.getElementById('copy-email-btn');
const copyEmailText = document.getElementById('copy-email-text');

if (copyEmailBtn && copyEmailText) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'ojhaprawesh@gmail.com';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      copyEmailText.textContent = 'copied to clipboard! ✓';
      copyEmailBtn.classList.add('is-copied');
      setTimeout(() => {
        copyEmailText.textContent = 'copy email';
        copyEmailBtn.classList.remove('is-copied');
      }, 2500);
    } catch (err) {
      copyEmailText.textContent = 'ojhaprawesh@gmail.com';
    }
  });
}

// Direct Message Contact Form (Cloudflare Pages API: /api/contact)
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactSubmitBtn = document.getElementById('contact-submit-btn');

if (contactForm && contactStatus && contactSubmitBtn) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    contactStatus.className = 'form-status mono';
    contactStatus.textContent = '';

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const name = (nameInput ? nameInput.value : '').trim();
    const email = (emailInput ? emailInput.value : '').trim();
    const message = (messageInput ? messageInput.value : '').trim();

    if (!name || !email || !message) {
      contactStatus.className = 'form-status mono is-error';
      contactStatus.textContent = 'Please fill in all fields (name, email, and message).';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) {
      contactStatus.className = 'form-status mono is-error';
      contactStatus.textContent = 'Please provide a valid email address.';
      return;
    }

    contactSubmitBtn.disabled = true;
    const originalBtnText = contactSubmitBtn.innerHTML;
    contactSubmitBtn.innerHTML = '<span>sending message...</span>';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        contactStatus.className = 'form-status mono is-success';
        contactStatus.textContent = result.message || 'Thank you! Your message has been received successfully.';
        contactForm.reset();
      } else {
        contactStatus.className = 'form-status mono is-error';
        contactStatus.textContent = result.message || 'Unable to send message right now. Please email directly at ojhaprawesh@gmail.com.';
      }
    } catch (err) {
      contactStatus.className = 'form-status mono is-error';
      contactStatus.textContent = 'Network error. Please email directly at ojhaprawesh@gmail.com.';
    } finally {
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.innerHTML = originalBtnText;
    }
  });
}
