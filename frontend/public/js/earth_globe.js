// Practical 3D Real Earth Globe powered by Three.js
// Features: NASA Blue Marble texture, realistic oceans & continents, 
// atmospheric clouds, geographic coordinate grid (lat/lon), and GPS pinpoint on Nepal.

(function () {
  const container = document.getElementById('globe-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  const width = container.clientWidth || 460;
  const height = container.clientHeight || 460;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 2.8;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('earth-canvas'),
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Lighting - Sun illumination & atmospheric rim glow
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x0ea5e9, 0.6);
  rimLight.position.set(-5, -2, -3);
  scene.add(rimLight);

  // Group holding Earth, clouds, graticules, and markers for unified rotation
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Initial tilt: Earth axial tilt ~23.4 degrees
  globeGroup.rotation.x = 0.28;
  // Rotate to orient towards Nepal (85.5° E longitude)
  globeGroup.rotation.y = -Math.PI * 0.45;

  const RADIUS = 0.92;

  // 1. REAL EARTH SPHERE with NASA Blue Marble Texture
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('img/earth_atmos_2048.jpg');
  earthTexture.anisotropy = 8;

  const earthGeometry = new THREE.SphereGeometry(RADIUS, 64, 64);
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.7,
    metalness: 0.1,
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  globeGroup.add(earthMesh);

  // 2. REALISTIC CLOUD LAYER
  const cloudsTexture = textureLoader.load('img/earth_clouds_1024.png');
  const cloudsGeometry = new THREE.SphereGeometry(RADIUS * 1.018, 64, 64);
  const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  globeGroup.add(cloudsMesh);

  // 3. GEOGRAPHIC COORDINATE GRATICULE (Real Lat/Lon Grid Lines)
  const gridGroup = new THREE.Group();
  const gridMaterial = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.22,
  });
  const equatorMaterial = new THREE.LineBasicMaterial({
    color: 0xf59e0b, // Marigold for Equator & Prime Meridian
    transparent: true,
    opacity: 0.45,
  });

  // Parallels (Latitude lines at 15° intervals)
  for (let lat = -75; lat <= 75; lat += 15) {
    const latRad = (lat * Math.PI) / 180;
    const r = RADIUS * 1.004 * Math.cos(latRad);
    const y = RADIUS * 1.004 * Math.sin(latRad);
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const lonRad = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(r * Math.cos(lonRad), y, r * Math.sin(lonRad)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geom, lat === 0 ? equatorMaterial : gridMaterial);
    gridGroup.add(line);
  }

  // Meridians (Longitude lines at 30° intervals)
  for (let lon = 0; lon < 360; lon += 30) {
    const lonRad = (lon * Math.PI) / 180;
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const latRad = (i / 64) * Math.PI - Math.PI / 2;
      const r = RADIUS * 1.004 * Math.cos(latRad);
      const y = RADIUS * 1.004 * Math.sin(latRad);
      points.push(new THREE.Vector3(r * Math.sin(lonRad), y, r * Math.cos(lonRad)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geom, lon === 0 || lon === 180 ? equatorMaterial : gridMaterial);
    gridGroup.add(line);
  }
  globeGroup.add(gridGroup);

  // 4. REAL GEOGRAPHIC PINPOINT ON NEPAL (Kathmandu / Dhulikhel: 27.6195° N, 85.5385° E)
  function latLonToVector3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  const NEPAL_LAT = 27.6195;
  const NEPAL_LON = 85.5385;
  const nepalPos = latLonToVector3(NEPAL_LAT, NEPAL_LON, RADIUS * 1.015);

  // 3D Pin Beacon
  const pinGroup = new THREE.Group();
  pinGroup.position.copy(nepalPos);
  pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), nepalPos.clone().normalize());

  // Glowing beacon point
  const pinHeadGeom = new THREE.SphereGeometry(0.024, 16, 16);
  const pinHeadMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Marigold
  const pinHead = new THREE.Mesh(pinHeadGeom, pinHeadMat);
  pinHead.position.y = 0.05;
  pinGroup.add(pinHead);

  // Pin needle / stalk
  const pinStalkGeom = new THREE.CylinderGeometry(0.004, 0.004, 0.05, 8);
  const pinStalkMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const pinStalk = new THREE.Mesh(pinStalkGeom, pinStalkMat);
  pinStalk.position.y = 0.025;
  pinGroup.add(pinStalk);

  // Pulsing ground radar ring
  const ringGeom = new THREE.RingGeometry(0.015, 0.045, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x0ea5e9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const radarRing = new THREE.Mesh(ringGeom, ringMat);
  radarRing.rotation.x = Math.PI / 2;
  pinGroup.add(radarRing);

  globeGroup.add(pinGroup);

  // 5. ORBITING SATELLITE (Sentinel-2A in realistic polar orbit)
  const satelliteGroup = new THREE.Group();
  const satOrbitRadius = RADIUS * 1.35;

  const satGeom = new THREE.BoxGeometry(0.025, 0.015, 0.035);
  const satMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8 });
  const satellite = new THREE.Mesh(satGeom, satMat);

  // Solar panel wings
  const panelGeom = new THREE.BoxGeometry(0.07, 0.002, 0.02);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.9 });
  const panels = new THREE.Mesh(panelGeom, panelMat);
  satellite.add(panels);

  satelliteGroup.add(satellite);
  globeGroup.add(satelliteGroup);

  // Satellite orbit track
  const orbitPoints = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    orbitPoints.push(new THREE.Vector3(Math.cos(angle) * satOrbitRadius, Math.sin(angle) * satOrbitRadius * 0.4, Math.sin(angle) * satOrbitRadius));
  }
  const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitLine = new THREE.Line(
    orbitGeom,
    new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.05, gapSize: 0.03, transparent: true, opacity: 0.4 })
  );
  globeGroup.add(orbitLine);

  // 6. DRAG & TOUCH TO ROTATE INTERACTIVITY
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let autoRotate = true;
  let autoRotateSpeed = 0.002;

  const canvas = renderer.domElement;

  function onPointerDown(e) {
    isDragging = true;
    autoRotate = false;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    globeGroup.rotation.y += deltaX * 0.006;
    globeGroup.rotation.x += deltaY * 0.006;

    // Clamp vertical tilt to avoid flipping upside down
    globeGroup.rotation.x = Math.max(-0.8, Math.min(0.8, globeGroup.rotation.x));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp() {
    isDragging = false;
    canvas.style.cursor = 'grab';
    // Resume slow auto-spin after 3 seconds of inactivity
    setTimeout(() => {
      autoRotate = true;
    }, 3000);
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // Animation Loop
  let ringScale = 1;
  let satAngle = 0;

  function animate() {
    requestAnimationFrame(animate);

    // Auto-spin Earth
    if (autoRotate) {
      globeGroup.rotation.y += autoRotateSpeed;
    }

    // Clouds rotate independently
    cloudsMesh.rotation.y += 0.0004;

    // Pulse radar ring around Nepal
    ringScale += 0.02;
    if (ringScale > 2.2) ringScale = 0.8;
    radarRing.scale.set(ringScale, ringScale, 1);
    ringMat.opacity = Math.max(0, 1 - ringScale / 2.2);

    // Orbit satellite
    satAngle += 0.015;
    satellite.position.set(
      Math.cos(satAngle) * satOrbitRadius,
      Math.sin(satAngle) * satOrbitRadius * 0.4,
      Math.sin(satAngle) * satOrbitRadius
    );
    satellite.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth || 460;
    const newHeight = container.clientHeight || 460;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
})();
