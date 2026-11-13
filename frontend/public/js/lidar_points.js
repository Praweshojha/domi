/**
 * Geodetic 3D LiDAR & GNSS Point Cloud (Ported StarsCanvas)
 * Transforms template's neon starfield into a surveyor LiDAR point cloud
 * Preserves Banepa ambient video and Terrain Tokens: Forest (#166534) & Ochre (#D97706)
 */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('lidar-canvas');
  if (!canvas) return;

  const container = canvas.parentElement || document.body;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.z = 2.4;

  const isMobile = window.innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5));

  // Geodetic LiDAR Point Cloud Generation (Scaled for mobile efficiency)
  const POINT_COUNT = isMobile ? 750 : 2400;
  const positions = new Float32Array(POINT_COUNT * 3);
  const colors = new Float32Array(POINT_COUNT * 3);

  const forestColor = new THREE.Color(0x166534); // --forest (#166534)
  const ochreColor = new THREE.Color(0xD97706);  // --ochre benchmark (#D97706)
  const contourColor = new THREE.Color(0x2D6A4F);// --contour green

  // Generate an orbital terrain / LiDAR scan lattice
  for (let i = 0; i < POINT_COUNT; i++) {
    const i3 = i * 3;
    
    // Spherical distribution with geodetic layering
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    
    // Terrain elevation perturbation (simulating DEM point cloud)
    const baseRadius = 1.35 + Math.random() * 0.45;
    const elevationNoise = Math.sin(theta * 4) * Math.cos(phi * 4) * 0.08;
    const r = baseRadius + elevationNoise;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75; // flatten like geoid
    positions[i3 + 2] = r * Math.cos(phi);

    // Color distribution: ~82% Forest/Contour green, ~18% Ochre survey stations
    const isBenchmark = Math.random() < 0.18;
    const chosenColor = isBenchmark ? ochreColor : (Math.random() < 0.5 ? forestColor : contourColor);

    colors[i3] = chosenColor.r;
    colors[i3 + 1] = chosenColor.g;
    colors[i3 + 2] = chosenColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Subtle circular point texture via dynamic canvas for soft anti-aliased dots
  const circleCanvas = document.createElement('canvas');
  circleCanvas.width = 16;
  circleCanvas.height = 16;
  const ctx = circleCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(8, 8, 8, 0, Math.PI * 2);
  ctx.fill();
  const pointTexture = new THREE.CanvasTexture(circleCanvas);

  const material = new THREE.PointsMaterial({
    size: 0.024,
    vertexColors: true,
    transparent: true,
    opacity: 0.52,
    map: pointTexture,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const pointsGroup = new THREE.Group();
  const pointCloud = new THREE.Points(geometry, material);
  pointsGroup.add(pointCloud);
  scene.add(pointsGroup);

  // Subtle survey geodetic equator ring
  const ringGeom = new THREE.BufferGeometry();
  const ringPts = [];
  for (let a = 0; a <= 64; a++) {
    const rad = (a / 64) * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(rad) * 1.5, 0, Math.sin(rad) * 1.5));
  }
  ringGeom.setFromPoints(ringPts);
  const ringMat = new THREE.LineBasicMaterial({
    color: 0x166534,
    transparent: true,
    opacity: 0.15
  });
  const ringLine = new THREE.Line(ringGeom, ringMat);
  ringLine.rotation.x = 0.35;
  pointsGroup.add(ringLine);

  // Cursor Parallax Tracker
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = normX * 0.15;
    targetRotX = normY * 0.15;
  }, { passive: true });

  // Animation Loop with low footprint
  let clock = new THREE.Clock();
  let isRunning = true;

  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) clock.start();
  });

  function animate() {
    if (isRunning) {
      const delta = clock.getDelta();
      
      // Gentle orbital celestial spin
      pointsGroup.rotation.y += delta * 0.035;
      pointsGroup.rotation.x += delta * 0.015;

      // Smooth mouse parallax damping
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      camera.position.x = currentRotY * 0.5;
      camera.position.y = -currentRotX * 0.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Responsive Resizing
  function onResize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);
})();
