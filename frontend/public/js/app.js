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

// Interactive Parallax on Hero Globe
const heroSection = document.querySelector('.hero');
const globeWrapper = document.querySelector('.globe-wrapper');
if (heroSection && globeWrapper) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    globeWrapper.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    globeWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
    globeWrapper.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });
  heroSection.addEventListener('mouseenter', () => {
    globeWrapper.style.transition = 'none';
  });
}
