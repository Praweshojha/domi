/**
 * 3D Floating Polyhedral Tech Badges (Ported BallCanvas)
 * Pure Three.js implementation matching reactjs18-3d-portfolio-main
 * Adheres strictly to Terrain Tokens: Sand, Sand-2, Forest, Ochre & Ink
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

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

  const textureLoader = new THREE.TextureLoader();

  function initBall(canvas, tech, index) {
    const parent = canvas.parentElement;
    let width = parent.clientWidth || 110;
    let height = parent.clientHeight || 110;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.z = 3.65;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Terrain Lighting (Sun, Forest rim, Ochre warm fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.25);
    sunLight.position.set(3, 4, 3);
    scene.add(sunLight);

    const forestRim = new THREE.DirectionalLight(0x166534, 0.6); // --forest rim
    forestRim.position.set(-3, -2, -2);
    scene.add(forestRim);

    const ochreWarm = new THREE.DirectionalLight(0xd97706, 0.35); // --ochre fill
    ochreWarm.position.set(2, -3, 2);
    scene.add(ochreWarm);

    // Root Group for 3D Icosahedron & Decal
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // Initial orientation variance so balls look dynamic
    ballGroup.rotation.x = 0.2 + (index % 3) * 0.15;
    ballGroup.rotation.y = (index * 0.8);

    // 1. Faceted Icosahedron in --sand token (#FAF7F0)
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

    // 2. Geodesic cartographic wireframe in --contour green
    const wireGeom = new THREE.WireframeGeometry(geom);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x166534,
      transparent: true,
      opacity: 0.18
    });
    const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
    ballGroup.add(wireMesh);

    // 3. Tech Decal / Disc Front Plane
    textureLoader.load(tech.icon, (tex) => {
      tex.anisotropy = 4;
      const discGeom = new THREE.CircleGeometry(0.68, 32);
      
      // Backing disk for maximum logo legibility
      const backMat = new THREE.MeshBasicMaterial({
        color: 0xF0EADB, // --sand-2
        side: THREE.DoubleSide
      });
      const backMesh = new THREE.Mesh(discGeom, backMat);
      backMesh.position.set(0, 0, 1.08);
      ballGroup.add(backMesh);

      // Icon plane
      const iconMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        side: THREE.DoubleSide
      });
      const iconMesh = new THREE.Mesh(discGeom, iconMat);
      iconMesh.position.set(0, 0, 1.09);
      ballGroup.add(iconMesh);
    });

    // Interaction & Animation Physics
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let velX = 0;
    let velY = 0;
    const timeOffset = index * 1.35;
    let isVisible = true;
    let animId = null;

    canvas.style.cursor = 'grab';

    function onPointerDown(e) {
      isDragging = true;
      canvas.style.cursor = 'grabbing';
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevMousePos = { x: clientX, y: clientY };
      velX = 0;
      velY = 0;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMousePos.x;
      const deltaY = clientY - prevMousePos.y;

      velX = deltaX * 0.012;
      velY = deltaY * 0.012;

      ballGroup.rotation.y += velX;
      ballGroup.rotation.x += velY;

      prevMousePos = { x: clientX, y: clientY };
    }

    function onPointerUp() {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = 'grab';
      }
    }

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Render loop with float wobble & momentum inertia
    let clock = new THREE.Clock();

    function animate() {
      if (!isVisible) {
        animId = null;
        return;
      }

      const elapsed = clock.getElapsedTime() + timeOffset;

      if (!isDragging) {
        // Floating wobble
        ballGroup.position.y = Math.sin(elapsed * 1.7) * 0.06;
        ballGroup.position.x = Math.cos(elapsed * 1.3) * 0.03;

        // Inertia or natural gentle spin
        if (Math.abs(velX) > 0.001 || Math.abs(velY) > 0.001) {
          ballGroup.rotation.y += velX;
          ballGroup.rotation.x += velY;
          velX *= 0.94; // friction
          velY *= 0.94;
        } else {
          ballGroup.rotation.y += 0.008; // ambient idle turn
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }

    // Visibility Observer to save CPU when scrolled away
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            clock.start();
            animate();
          }
        });
      }, { threshold: 0.1 });
      observer.observe(parent);
    } else {
      animate();
    }

    // Resize Handler
    function onResize() {
      width = parent.clientWidth || 110;
      height = parent.clientHeight || 110;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);
  }

  function renderTechBalls() {
    const container = document.getElementById('tech-balls-container');
    if (!container) return;

    container.innerHTML = '';

    TECH_ITEMS.forEach((tech, index) => {
      const card = document.createElement('div');
      card.className = 'tech-ball-card paper-panel reveal-on-scroll';
      card.setAttribute('data-tilt-max', '14');
      card.setAttribute('data-tilt-scale', '1.04');

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

      container.appendChild(card);

      const canvas = card.querySelector('.ball-canvas');
      initBall(canvas, tech, index);

      // Attach 3D tilt to this newly created card
      if (window.attachTilt) {
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
