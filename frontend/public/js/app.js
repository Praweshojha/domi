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

// Interactive Parallax on Hero Section
const heroSection = document.querySelector('.hero');
const globeWrapper = document.querySelector('.globe-wrapper');
if (heroSection && globeWrapper) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    globeWrapper.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    globeWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
    globeWrapper.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  });
  heroSection.addEventListener('mouseenter', () => {
    globeWrapper.style.transition = 'none';
  });
}

// --- 3D INTERACTIVE HOLOGRAPHIC GLOBE ---
const globeCanvas = document.getElementById('cobe-globe');
if (globeCanvas && typeof window.createGlobe === 'function') {
  let phi = 1.2; // Start oriented towards South Asia / Nepal
  let theta = 0.28; // Slightly tilted to display northern hemisphere
  let pointerInteracting = null;
  let pointerInteractionMovement = 0;

  try {
    const globe = window.createGlobe(globeCanvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: 1000,
      height: 1000,
      phi: 1.2,
      theta: 0.28,
      dark: 1,
      diffuse: 1.3,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 5.5,
      baseColor: [0.11, 0.05, 0.17], // Deep Aubergine (#1c0e2a)
      markerColor: [0.96, 0.62, 0.04], // Marigold (#f59e0b)
      glowColor: [0.06, 0.65, 0.91], // Cerulean Blue (#0ea5e9)
      offset: [0, 0],
      markers: [
        { location: [27.6195, 85.5385], size: 0.11, color: [0.96, 0.62, 0.04] }, // Nepal (Dhulikhel / KU)
        { location: [51.5074, -0.1278], size: 0.04, color: [0.77, 0.71, 0.99] }, // London / ESA
        { location: [37.7749, -122.4194], size: 0.04, color: [0.06, 0.65, 0.91] }, // San Francisco
        { location: [35.6762, 139.6503], size: 0.04, color: [0.06, 0.65, 0.91] }, // Tokyo / JAXA
      ],
      arcs: [
        { from: [27.6195, 85.5385], to: [51.5074, -0.1278] },
        { from: [27.6195, 85.5385], to: [37.7749, -122.4194] },
        { from: [27.6195, 85.5385], to: [35.6762, 139.6503] },
      ],
      arcColor: [0.77, 0.71, 0.99], // Pale Lavender (#c4b5fd)
      arcWidth: 0.6,
      arcHeight: 0.28,
      onRender: (state) => {
        if (!pointerInteracting) {
          phi += 0.004; // Smooth auto-rotation when not interacting
        }
        state.phi = phi + pointerInteractionMovement;
        state.theta = theta;
      },
    });

    // Mouse & Touch Drag-to-Rotate Interaction
    globeCanvas.addEventListener('pointerdown', (e) => {
      pointerInteracting = e.clientX - pointerInteractionMovement;
      globeCanvas.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (pointerInteracting !== null) {
        const delta = e.clientX - pointerInteracting;
        pointerInteractionMovement = delta * 0.005;
      }
    });

    window.addEventListener('pointerup', () => {
      if (pointerInteracting !== null) {
        phi += pointerInteractionMovement;
        pointerInteractionMovement = 0;
        pointerInteracting = null;
        globeCanvas.style.cursor = 'grab';
      }
    });
  } catch (err) {
    console.warn('WebGL Globe initialization fallback:', err);
  }
}

// Avatar dismiss handler (compliant with Content Security Policy)
const avatarDismiss = document.getElementById('avatar-dismiss');
if (avatarDismiss) {
  avatarDismiss.addEventListener('click', () => {
    const avatarDrop = document.getElementById('avatar-drop');
    if (avatarDrop) avatarDrop.style.display = 'none';
  });
}
