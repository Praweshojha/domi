/**
 * 3D Floating Polyhedral Tech Badges (Ported BallCanvas)
 * Mobile-Optimized:
 *  - On Mobile/Android/Touch: Renders high-performance 3D-styled faceted badges
 *    with interactive touch tilt and 0 WebGL context overhead (prevents mobile context loss)
 *  - On Desktop: Uses Three.js 3D icosahedrons with IntersectionObserver to only render visible cards
 * Adheres strictly to Terrain Tokens: Sand, Sand-2, Forest, Ochre & Ink
 */

(function () {
  'use strict';

  const TECH_ITEMS = [
    { name: 'Python', role: 'geoprocessing · ml', icon: 'img/tech/python.svg' },
    { name: 'QGIS', role: 'spatial analysis', icon: 'img/tech/qgis.svg' },
    { name: 'PyTorch', role: 'geoai · deep learning', icon: 'img/tech/pytorch.svg' },
    { name: 'Three.js', role: '3d webgl · mapping', icon: 'img/tech/threejs.svg' },
    { name: 'React', role: 'interface systems', icon: 'img/tech/reactjs.png' },
    { name: 'TypeScript', role: 'type-safe pipelines', icon: 'img/tech/typescript.png' },
    { name: 'Docker', role: 'geo containers', icon: 'img/tech/docker.png' },
    { name: 'Git', role: 'version control', icon: 'img/tech/git.png' },
  ];

  const isMobile = (window.innerWidth < 768) || (navigator.maxTouchPoints > 0) || ('ontouchstart' in window);

  // Desktop WebGL Ball Initializer
  function initBallDesktop(canvas, tech, index) {
    if (typeof THREE === 'undefined') return;

    const parent = canvas.parentElement;
    let width = parent.clientWidth || 110;
    let height = parent.clientHeight || 110;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
    } catch (e) {
      console.warn('WebGL initialization skipped for badge:', tech.name);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.z = 3.65;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.25);
    sunLight.position.set(3, 4, 3);
    scene.add(sunLight);

    const forestRim = new THREE.DirectionalLight(0x166534, 0.6);
    forestRim.position.set(-3, -2, -2);
    scene.add(forestRim);

    const ochreWarm = new THREE.DirectionalLight(0xd97706, 0.35);
    ochreWarm.position.set(2, -3, 2);
    scene.add(ochreWarm);

    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    ballGroup.rotation.x = 0.2 + (index % 3) * 0.15;
    ballGroup.rotation.y = index * 0.8;

    // 1. Faceted Icosahedron in --sand token
    const geom = new THREE.IcosahedronGeometry(1.15, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xFAF7F0,
      roughness: 0.35,
      metalness: 0.1,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    const icosaMesh = new THREE.Mesh(geom, mat);
    ballGroup.add(icosaMesh);

    // 2. Wireframe in --contour green
    const wireGeom = new THREE.WireframeGeometry(geom);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x166534,
      transparent: true,
      opacity: 0.18
    });
    const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
    ballGroup.add(wireMesh);

    // 3. Tech Decal Disc
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(tech.icon, (tex) => {
      tex.anisotropy = 4;
      const discGeom = new THREE.CircleGeometry(0.68, 32);
      const backMat = new THREE.MeshBasicMaterial({
        color: 0xF0EADB,
        side: THREE.DoubleSide
      });
      const backMesh = new THREE.Mesh(discGeom, backMat);
      backMesh.position.z = 1.16;
      ballGroup.add(backMesh);

      const decalMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide
      });
      const decalMesh = new THREE.Mesh(discGeom, decalMat);
      decalMesh.position.z = 1.165;
      ballGroup.add(decalMesh);
    });

    // IntersectionObserver: Only animate and render when visible on screen
    let isVisible = false;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      io.observe(canvas);
    } else {
      isVisible = true;
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      if (!isDragging) {
        ballGroup.rotation.y += 0.005;
        ballGroup.rotation.x = 0.2 + Math.sin(Date.now() * 0.001 + index) * 0.08;
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);

    // Mouse drag
    function onMouseDown(e) {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    }
    function onMouseMove(e) {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      ballGroup.rotation.y += deltaX * 0.015;
      ballGroup.rotation.x += deltaY * 0.015;
      prevMouse = { x: e.clientX, y: e.clientY };
    }
    function onMouseUp() {
      isDragging = false;
    }

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('WebGL context lost for badge:', tech.name);
    }, false);
  }

  function renderTechBalls() {
    const container = document.getElementById('tech-balls-container');
    if (!container) return;

    container.innerHTML = '';

    TECH_ITEMS.forEach((tech, index) => {
      const card = document.createElement('div');
      card.className = 'tech-ball-card paper-panel reveal-on-scroll';
      card.setAttribute('data-tilt-max', '12');
      card.setAttribute('data-tilt-scale', '1.04');

      if (isMobile) {
        // High-Performance Mobile 3D Badge (Zero WebGL context consumption)
        card.innerHTML = `
          <div class="ball-crop-tl"></div><div class="ball-crop-tr"></div>
          <div class="ball-canvas-wrap mobile-badge-wrap">
            <div class="mobile-polyhedron-disc">
              <img src="${tech.icon}" alt="${tech.name} logo" class="mobile-tech-icon" loading="lazy">
            </div>
          </div>
          <div class="ball-info">
            <div class="ball-title mono">${tech.name}</div>
            <div class="ball-role mono">${tech.role}</div>
          </div>
        `;
      } else {
        // Desktop 3D WebGL Canvas
        card.innerHTML = `
          <div class="ball-crop-tl"></div><div class="ball-crop-tr"></div>
          <div class="ball-canvas-wrap">
            <canvas class="ball-canvas" aria-label="3D model of ${tech.name}"></canvas>
          </div>
          <div class="ball-info">
            <div class="ball-title mono">${tech.name}</div>
            <div class="ball-role mono">${tech.role}</div>
          </div>
        `;
        const canvas = card.querySelector('.ball-canvas');
        if (canvas) {
          initBallDesktop(canvas, tech, index);
        }
      }

      container.appendChild(card);

      if (!isMobile && window.attachTilt) {
        window.attachTilt(card);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTechBalls);
  } else {
    renderTechBalls();
  }
})();
