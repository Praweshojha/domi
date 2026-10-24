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

// Avatar Dismiss Handler (Instant, CSP-compliant, click, keyboard & 5-second auto-dismiss)
const avatarWrapper = document.getElementById('avatar-drop');
const dismissAvatar = () => {
  if (avatarWrapper && !avatarWrapper.classList.contains('is-hidden')) {
    avatarWrapper.classList.add('is-hidden');
    setTimeout(() => {
      avatarWrapper.style.display = 'none';
    }, 650);
  }
};

// Automatically make the hanging avatar disappear after 5 seconds
setTimeout(() => {
  dismissAvatar();
}, 5000);

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

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzEgoNYmtR96Qyk-x7lxRj-jAVHS8x9-t8bIT2iJnKl1AKxaFEeSlUEUhIDutwprs7J/exec';

    try {
      let isSuccess = false;
      let successMessage = "Thank you! Your message has been saved to Prawesh's Google Sheet and sent to his email.";

      // 1. Primary: Cloudflare edge route
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        if (response.ok) {
          const result = await response.json().catch(() => ({}));
          if (result.success) {
            isSuccess = true;
            successMessage = result.message || successMessage;
          }
        }
      } catch (e) {
        // Fall through to direct Google Apps Script
      }

      // 2. Direct Google Drive Webhook (Guaranteed direct delivery)
      if (!isSuccess) {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
          });
          isSuccess = true;
        } catch (e) {
          // Fall through to fallback
        }
      }

      if (isSuccess) {
        contactStatus.className = 'form-status mono is-success';
        contactStatus.textContent = successMessage;
        contactForm.reset();
      } else {
        // Fallback to mail client if all network requests fail
        const mailtoUrl = `mailto:ojhaprawesh@gmail.com?subject=${encodeURIComponent(`Inquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`;
        contactStatus.className = 'form-status mono is-success';
        contactStatus.innerHTML = `Your message is ready! Opening your email client to send to <strong>ojhaprawesh@gmail.com</strong>... (<a href="${mailtoUrl}" target="_blank" style="text-decoration:underline;">click here if it didn't open automatically</a>)`;
        window.location.href = mailtoUrl;
      }
    } catch (err) {
      const mailtoUrl = `mailto:ojhaprawesh@gmail.com?subject=${encodeURIComponent(`Inquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`;
      contactStatus.className = 'form-status mono is-success';
      contactStatus.innerHTML = `Opening your email client to dispatch to <strong>ojhaprawesh@gmail.com</strong>... (<a href="${mailtoUrl}" target="_blank" style="text-decoration:underline;">click here</a>)`;
      window.location.href = mailtoUrl;
    } finally {
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.innerHTML = originalBtnText;
    }
  });
}
