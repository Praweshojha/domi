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

// Avatar Dismiss Handler (Auto-dismisses with smooth retraction after 5 seconds)
let avatarDismissed = false;

const dismissAvatar = () => {
  const avatarEl = document.getElementById('avatar-drop');
  if (avatarEl && !avatarDismissed) {
    avatarDismissed = true;
    avatarEl.classList.add('is-hidden');
    setTimeout(() => {
      avatarEl.style.display = 'none';
    }, 950);
  }
};

// Automatically make the hanging avatar disappear after 5 seconds
setTimeout(() => {
  dismissAvatar();
}, 5000);

document.addEventListener('click', (e) => {
  const avatarEl = document.getElementById('avatar-drop');
  if (avatarEl && (avatarEl.contains(e.target) || e.target.closest('#avatar-drop') || e.target.closest('#avatar-dismiss'))) {
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

// Security Sanitizer: Defends against XSS, Control Characters & Spreadsheet Formula Injection
const sanitizeField = (str, maxLen = 3000) => {
  if (typeof str !== 'string') return '';
  // Strip control characters & null bytes
  let clean = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLen);
  // Defend against CSV / Google Sheets Formula Injection (=, +, -, @, \t, \r)
  if (/^[=+\-@\t\r]/.test(clean)) {
    clean = "'" + clean;
  }
  return clean;
};

if (contactForm && contactStatus && contactSubmitBtn) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    contactStatus.className = 'form-status mono';
    contactStatus.textContent = '';

    // 1. Anti-Spam Honeypot Check (Silently drop automated bot attacks)
    const honeypot = (document.getElementById('contact-website')?.value || '').trim();
    if (honeypot) {
      contactStatus.className = 'form-status mono is-success';
      contactStatus.textContent = 'Thank you! Your message has been received.';
      contactForm.reset();
      return;
    }

    // 2. Client-Side Rate Limiting (45-second submission cooldown)
    const LAST_SUBMIT_KEY = 'po_contact_last_submit';
    const COOLDOWN_MS = 45000;
    const lastSubmitTime = sessionStorage.getItem(LAST_SUBMIT_KEY);
    if (lastSubmitTime && (Date.now() - parseInt(lastSubmitTime, 10)) < COOLDOWN_MS) {
      const remainingSec = Math.ceil((COOLDOWN_MS - (Date.now() - parseInt(lastSubmitTime, 10))) / 1000);
      contactStatus.className = 'form-status mono is-error';
      contactStatus.textContent = `Please wait ${remainingSec} seconds before sending another message.`;
      return;
    }

    const rawName = (document.getElementById('contact-name')?.value || '').trim();
    const rawEmail = (document.getElementById('contact-email')?.value || '').trim();
    const rawMessage = (document.getElementById('contact-message')?.value || '').trim();

    if (!rawName || !rawEmail || !rawMessage) {
      contactStatus.className = 'form-status mono is-error';
      contactStatus.textContent = 'Please fill in all fields (name, email, and message).';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(rawEmail) || rawEmail.length > 254) {
      contactStatus.className = 'form-status mono is-error';
      contactStatus.textContent = 'Please provide a valid email address.';
      return;
    }

    // Sanitize values
    const name = sanitizeField(rawName, 100);
    const email = rawEmail.toLowerCase().slice(0, 254);
    const message = sanitizeField(rawMessage, 3000);

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
        sessionStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());
        contactStatus.className = 'form-status mono is-success';
        contactStatus.textContent = successMessage;
        contactForm.reset();
      } else {
        // Fallback to mail client if all network requests fail
        const mailtoUrl = `mailto:ojhaprawesh@gmail.com?subject=${encodeURIComponent(`Inquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`;
        contactStatus.className = 'form-status mono is-success';
        contactStatus.textContent = 'Opening your email client to send to ojhaprawesh@gmail.com...';
        window.location.href = mailtoUrl;
      }
    } catch (err) {
      const mailtoUrl = `mailto:ojhaprawesh@gmail.com?subject=${encodeURIComponent(`Inquiry from ${name}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)}`;
      contactStatus.className = 'form-status mono is-success';
      contactStatus.textContent = 'Opening your email client to dispatch to ojhaprawesh@gmail.com...';
      window.location.href = mailtoUrl;
    } finally {
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.innerHTML = originalBtnText;
    }
  });
}
