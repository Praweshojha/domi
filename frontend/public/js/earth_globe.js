/**
 * Practical 3D Real Earth & Dhulikhel City Map Instrument (Three.js)
 * Clean, uncluttered, real GIS exploration:
 *  - Real Geodetic alignment: Kathmandu University, Dhulikhel (27.6195°N, 85.5385°E)
 *  - Continuous manual scroll-wheel zoom & pinch-to-zoom (from Earth down to Dhulikhel city)
 *  - Real local map data: Satellite aerial orthomosaic & OpenStreetMap street network
 *  - Manual drag to pan around Dhulikhel city and locate Kathmandu University
 *  - Zero messy text overlays covering the map
 *  - Dial bezel zoom buttons (+ / - / reset)
 *  - Strictly styled to Terrain Tokens: Forest (#166534), Ochre (#D97706), Ink (#14261C), Sand (#FAF7F0)
 */

(function () {
  'use strict';

  const container = document.getElementById('globe-container');
  if (!container || typeof THREE === 'undefined') return;

  const canvas = document.getElementById('earth-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  let width = container.clientWidth || 420;
  let height = container.clientHeight || 420;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  const MAX_ORBIT_Z = 2.85;
  const MIN_LOCAL_Z = 1.05; // Macro zoom right above Dhulikhel streets & KU campus
  let targetCamZ = MAX_ORBIT_Z;
  camera.position.z = MAX_ORBIT_Z;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Terrain Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.96);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.25);
  sunLight.position.set(5, 4, 5);
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x166534, 0.55); // --forest rim
  rimLight.position.set(-5, -2, -3);
  scene.add(rimLight);

  const ochreLight = new THREE.DirectionalLight(0xd97706, 0.32); // --ochre accent
  ochreLight.position.set(2, -4, 2);
  scene.add(ochreLight);

  // Globe Root Group
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const RADIUS = 0.92;
  const KU_LAT = 27.6195;
  const KU_LON = 85.5385;

  // 1. Math: WGS84 Lat/Lon to Sphere 3D Vector
  function latLonToVector3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  // 2. Base Earth Sphere (NASA Blue Marble)
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('img/earth_atmos_2048.jpg');
  earthTexture.anisotropy = 8;

  const earthGeometry = new THREE.SphereGeometry(RADIUS, 64, 64);
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.68,
    metalness: 0.1,
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  globeGroup.add(earthMesh);

  // 3. Clouds Layer
  const cloudsTexture = textureLoader.load('img/earth_clouds_1024.png');
  const cloudsGeometry = new THREE.SphereGeometry(RADIUS * 1.015, 64, 64);
  const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  globeGroup.add(cloudsMesh);

  // 4. Geodetic Coordinate Graticules (Contour Green & Ochre Equator)
  const gridGroup = new THREE.Group();
  const gridMaterial = new THREE.LineBasicMaterial({
    color: 0x2D6A4F,
    transparent: true,
    opacity: 0.28,
  });
  const equatorMaterial = new THREE.LineBasicMaterial({
    color: 0xD97706,
    transparent: true,
    opacity: 0.7,
  });

  for (let lat = -75; lat <= 75; lat += 15) {
    const latRad = (lat * Math.PI) / 180;
    const r = RADIUS * 1.003 * Math.cos(latRad);
    const y = RADIUS * 1.003 * Math.sin(latRad);
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const lonRad = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(r * Math.cos(lonRad), y, r * Math.sin(lonRad)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    gridGroup.add(new THREE.Line(geom, lat === 0 ? equatorMaterial : gridMaterial));
  }

  for (let lon = 0; lon < 360; lon += 30) {
    const lonRad = (lon * Math.PI) / 180;
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const latRad = (i / 64) * Math.PI - Math.PI / 2;
      const r = RADIUS * 1.003 * Math.cos(latRad);
      const y = RADIUS * 1.003 * Math.sin(latRad);
      pts.push(new THREE.Vector3(r * Math.sin(lonRad), y, r * Math.cos(lonRad)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    gridGroup.add(new THREE.Line(geom, lon === 0 || lon === 180 ? equatorMaterial : gridMaterial));
  }
  globeGroup.add(gridGroup);

  // 5. Kathmandu University Exact Vector & Conformal Map Patch
  const kuLocalPos = latLonToVector3(KU_LAT, KU_LON, RADIUS * 1.004);
  const kuNormal = kuLocalPos.clone().normalize();

  // Coordinates covering Banepa through Dhulikhel & KU:
  const lonMin = 85.517578;
  const lonMax = 85.561523;
  const latMin = 27.605671;
  const latMax = 27.644997;

  const phiStart = (lonMin + 180) * Math.PI / 180;
  const phiLength = (lonMax - lonMin) * Math.PI / 180;
  const thetaStart = (90 - latMax) * Math.PI / 180;
  const thetaLength = (latMax - latMin) * Math.PI / 180;

  // Conformal spherical patch that exactly curves with the Earth at Dhulikhel
  const dhulikhelGeom = new THREE.SphereGeometry(RADIUS * 1.003, 32, 32, phiStart, phiLength, thetaStart, thetaLength);

  // Dynamic Multi-Tile Texture Stitching for Satellite & OpenStreetMap layers
  let satTexture = null;
  let osmTexture = null;

  function loadStitchedTexture(prefix, ext, cb) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    const tiles = [
      { src: `img/dhulikhel/${prefix}_0_0.${ext}`, x: 0, y: 0 },
      { src: `img/dhulikhel/${prefix}_1_0.${ext}`, x: 256, y: 0 },
      { src: `img/dhulikhel/${prefix}_0_1.${ext}`, x: 0, y: 256 },
      { src: `img/dhulikhel/${prefix}_1_1.${ext}`, x: 256, y: 256 }
    ];
    let loaded = 0;
    tiles.forEach(t => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, t.x, t.y, 256, 256);
        loaded++;
        if (loaded === 4) {
          const tex = new THREE.CanvasTexture(c);
          tex.anisotropy = 8;
          cb(tex);
        }
      };
      img.src = t.src;
    });
  }

  const dhulikhelMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const dhulikhelMesh = new THREE.Mesh(dhulikhelGeom, dhulikhelMat);
  globeGroup.add(dhulikhelMesh);

  // Load Satellite Tiles by default
  loadStitchedTexture('sat', 'jpg', (tex) => {
    satTexture = tex;
    dhulikhelMat.map = satTexture;
    dhulikhelMat.needsUpdate = true;
  });

  // Preload OSM Map Tiles
  loadStitchedTexture('osm', 'png', (tex) => {
    osmTexture = tex;
  });

  // Layer Switch API
  window.setGlobeLayer = function (mode) {
    if (mode === 'osm' && osmTexture) {
      dhulikhelMat.map = osmTexture;
      dhulikhelMat.needsUpdate = true;
      if (captionText) captionText.innerHTML = 'fig. 1 · dhulikhel & kathmandu university · openstreetmap network · [scroll to zoom]';
    } else if (mode === 'sat' && satTexture) {
      dhulikhelMat.map = satTexture;
      dhulikhelMat.needsUpdate = true;
      if (captionText) captionText.innerHTML = 'fig. 1 · dhulikhel & kathmandu university · satellite aerial orthomosaic · [scroll to zoom]';
    }
  };

  // 6. Dhulikhel & KU Survey Beacon Marker
  const pinGroup = new THREE.Group();
  pinGroup.position.copy(kuLocalPos);
  pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), kuNormal);

  const pinHeadGeom = new THREE.SphereGeometry(0.012, 16, 16);
  const pinHeadMat = new THREE.MeshBasicMaterial({ color: 0xD97706 });
  const pinHead = new THREE.Mesh(pinHeadGeom, pinHeadMat);
  pinHead.position.y = 0.026;
  pinGroup.add(pinHead);

  const pinStalkGeom = new THREE.CylinderGeometry(0.002, 0.002, 0.026, 8);
  const pinStalkMat = new THREE.MeshBasicMaterial({ color: 0x14261C });
  const pinStalk = new THREE.Mesh(pinStalkGeom, pinStalkMat);
  pinStalk.position.y = 0.013;
  pinGroup.add(pinStalk);

  const radarRingGeom = new THREE.RingGeometry(0.008, 0.026, 32);
  const radarRingMat = new THREE.MeshBasicMaterial({
    color: 0xD97706,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const radarRing = new THREE.Mesh(radarRingGeom, radarRingMat);
  radarRing.rotation.x = Math.PI / 2;
  pinGroup.add(radarRing);

  globeGroup.add(pinGroup);

  // 7. Polar Orbiting Satellite
  const satGroup = new THREE.Group();
  const satOrbitRadius = RADIUS * 1.34;
  const satGeom = new THREE.BoxGeometry(0.026, 0.016, 0.036);
  const satMat = new THREE.MeshStandardMaterial({ color: 0xFAF7F0, metalness: 0.6 });
  const satellite = new THREE.Mesh(satGeom, satMat);
  const panelGeom = new THREE.BoxGeometry(0.072, 0.002, 0.02);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.5 });
  satellite.add(new THREE.Mesh(panelGeom, panelMat));
  satGroup.add(satellite);
  globeGroup.add(satGroup);

  const orbitPts = [];
  for (let i = 0; i <= 90; i++) {
    const a = (i / 90) * Math.PI * 2;
    orbitPts.push(new THREE.Vector3(Math.cos(a) * satOrbitRadius, Math.sin(a) * satOrbitRadius * 0.45, Math.sin(a) * satOrbitRadius));
  }
  const orbitLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orbitPts),
    new THREE.LineDashedMaterial({ color: 0xD97706, dashSize: 0.05, gapSize: 0.03, transparent: true, opacity: 0.35 })
  );
  globeGroup.add(orbitLine);

  // 8. Quaternion Orientation: Nepal Facing Forward
  const forwardTarget = new THREE.Vector3(0, 0, 1);
  const kuCenterQuat = new THREE.Quaternion().setFromUnitVectors(kuNormal, forwardTarget);
  const orbitInitialQuat = kuCenterQuat.clone().multiply(
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.14)
  );
  globeGroup.quaternion.copy(orbitInitialQuat);

  // 9. Manual Zoom Mechanics (Scroll Wheel & Touch Pinch)
  const captionText = document.getElementById('dial-mode-text');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoRotate = !prefersReducedMotion;

  function onWheel(e) {
    e.preventDefault();
    autoRotate = false;
    const zoomDelta = e.deltaY * 0.0022;
    targetCamZ = Math.max(MIN_LOCAL_Z, Math.min(MAX_ORBIT_Z, targetCamZ + zoomDelta));
  }
  canvas.addEventListener('wheel', onWheel, { passive: false });

  // Bezel Buttons Zoom (+ / - / Reset)
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', (e) => {
      if (window.isRealMapActive && window.isRealMapActive()) return;
      e.stopPropagation();
      autoRotate = false;
      targetCamZ = Math.max(MIN_LOCAL_Z, targetCamZ - 0.32);
    });
  }
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', (e) => {
      if (window.isRealMapActive && window.isRealMapActive()) return;
      e.stopPropagation();
      autoRotate = false;
      targetCamZ = Math.min(MAX_ORBIT_Z, targetCamZ + 0.32);
    });
  }
  if (btnZoomReset) {
    btnZoomReset.addEventListener('click', (e) => {
      if (window.isRealMapActive && window.isRealMapActive()) return;
      e.stopPropagation();
      targetCamZ = MAX_ORBIT_Z;
      globeGroup.quaternion.copy(orbitInitialQuat);
      autoRotate = !prefersReducedMotion;
    });
  }

  // 10. Drag, Pan & Click-To-Zoom Controls
  let isDragging = false;
  let prevPointerPos = { x: 0, y: 0 };
  let pointerDownPos = { x: 0, y: 0 };
  let pointerDownTime = 0;
  let touchStartDist = 0;

  function onPointerDown(e) {
    isDragging = true;
    autoRotate = false;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    prevPointerPos = { x: clientX, y: clientY };
    pointerDownPos = { x: clientX, y: clientY };
    pointerDownTime = Date.now();
    canvas.style.cursor = 'grabbing';

    if (e.touches && e.touches.length === 2) {
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    // Handle 2-finger pinch zoom on mobile
    if (e.touches && e.touches.length === 2 && touchStartDist > 0) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const pinchDelta = (touchStartDist - currentDist) * 0.005;
      targetCamZ = Math.max(MIN_LOCAL_Z, Math.min(MAX_ORBIT_Z, targetCamZ + pinchDelta));
      touchStartDist = currentDist;
      return;
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - prevPointerPos.x;
    const deltaY = clientY - prevPointerPos.y;

    // Adaptive sensitivity: finer control when zoomed in
    const zoomFactor = (camera.position.z - 0.95) / (MAX_ORBIT_Z - 0.95);
    const sens = Math.max(0.001, 0.005 * zoomFactor);

    const rotY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * sens);
    const rotX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * sens);

    globeGroup.quaternion.multiplyQuaternions(rotY, globeGroup.quaternion);
    globeGroup.quaternion.multiplyQuaternions(rotX, globeGroup.quaternion);

    prevPointerPos = { x: clientX, y: clientY };
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    touchStartDist = 0;
    canvas.style.cursor = 'grab';

    const clientX = (e && e.changedTouches) ? e.changedTouches[0].clientX : (e ? e.clientX : prevPointerPos.x);
    const clientY = (e && e.changedTouches) ? e.changedTouches[0].clientY : (e ? e.clientY : prevPointerPos.y);
    const dist = Math.hypot(clientX - pointerDownPos.x, clientY - pointerDownPos.y);
    const elapsed = Date.now() - pointerDownTime;

    // Click detected (minimal drag distance & short duration):
    // Smoothly fly into Dhulikhel city and transition to real interactive Leaflet map!
    if (dist < 8 && elapsed < 450) {
      // Rotate to Nepal center orientation
      globeGroup.quaternion.copy(orbitInitialQuat);
      targetCamZ = 1.3;
      setTimeout(() => {
        if (typeof window.showDhulikhelMap === 'function') {
          window.showDhulikhelMap();
        }
      }, 200);
    }
  }

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // 11. Animation Loop: Smooth Damped Zoom & Local Map Crossfade
  let radarScale = 1;
  let satAngle = 0;

  function animate() {
    requestAnimationFrame(animate);

    // Smooth camera zoom interpolation
    camera.position.z += (targetCamZ - camera.position.z) * 0.12;

    // Seamless crossfade: when zoomed in close (z < 2.1), Dhulikhel city & KU map smoothly fades in
    const t = Math.max(0, Math.min(1, (2.1 - camera.position.z) / 0.95));
    dhulikhelMat.opacity = t * 0.98;
    cloudsMesh.material.opacity = Math.max(0.05, 0.42 * (1 - t * 0.85));

    // When at planetary orbit and idle, rotate gently
    if (autoRotate && camera.position.z > 2.2 && !isDragging) {
      const slowTurn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.0006);
      globeGroup.quaternion.multiplyQuaternions(slowTurn, globeGroup.quaternion);
      cloudsMesh.rotation.y += 0.00015;
    }

    // Radar pulse on Kathmandu University
    radarScale += 0.018;
    if (radarScale > 2.4) radarScale = 0.8;
    radarRing.scale.set(radarScale, radarScale, 1);
    radarRingMat.opacity = Math.max(0, 1 - radarScale / 2.4);

    // Satellite Orbit
    if (!prefersReducedMotion) {
      satAngle += 0.01;
      satellite.position.set(
        Math.cos(satAngle) * satOrbitRadius,
        Math.sin(satAngle) * satOrbitRadius * 0.45,
        Math.sin(satAngle) * satOrbitRadius
      );
      satellite.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
  }
  animate();

  // Responsive Resize
  window.addEventListener('resize', () => {
    width = container.clientWidth || 400;
    height = container.clientHeight || 400;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
})();
