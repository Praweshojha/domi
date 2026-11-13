/**
 * Practical 3D Real Earth Geodetic Instrument powered by Three.js
 * Features:
 *  - Real Geodetic WGS84 & UTM Zone 45N coordinate projection engine
 *  - Default focus on Kathmandu University (KU / Dhulikhel / Banepa: 27.6195°N, 85.5385°E)
 *  - Live cursor raycasting: hover anywhere on Earth to read live Lat/Lon & UTM Easting/Northing
 *  - Cinematic "Fly-To" zoom: click the globe to fly smoothly down into Kathmandu University
 *  - Double-click or [reset orbit] to return to planetary overview
 *  - Strictly styled to Terrain Tokens: Forest (#166534), Ochre (#D97706), Ink (#14261C), Sand (#FAF7F0)
 */

(function () {
  'use strict';

  const container = document.getElementById('globe-container');
  if (!container || typeof THREE === 'undefined') return;

  const canvas = document.getElementById('earth-canvas');
  if (!canvas) return;

  // Scene & Camera
  const scene = new THREE.Scene();
  let width = container.clientWidth || 420;
  let height = container.clientHeight || 420;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  const ORBIT_ZOOM = 2.8;
  const KU_ZOOM = 1.28;
  camera.position.z = ORBIT_ZOOM;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Terrain Lighting (Warm Sun, Forest Rim, Ochre Accent — Zero blue)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.25);
  sunLight.position.set(5, 4, 5);
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x166534, 0.55); // --forest rim
  rimLight.position.set(-5, -2, -3);
  scene.add(rimLight);

  const ochreLight = new THREE.DirectionalLight(0xd97706, 0.3); // --ochre accent
  ochreLight.position.set(2, -4, 2);
  scene.add(ochreLight);

  // Globe Root Group
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const RADIUS = 0.92;
  const KU_LAT = 27.6195;
  const KU_LON = 85.5385;

  // 1. Math: WGS84 Lat/Lon to Sphere Vector3
  function latLonToVector3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  // 2. Math: Vector3 on sphere to WGS84 Lat/Lon
  function vector3ToLatLon(v) {
    const p = v.clone().normalize();
    const lat = Math.asin(Math.max(-1, Math.min(1, p.y))) * (180 / Math.PI);
    const theta = Math.atan2(p.z, -p.x);
    let lon = (theta * (180 / Math.PI)) - 180;
    while (lon < -180) lon += 360;
    while (lon > 180) lon -= 360;
    return { lat, lon };
  }

  // 3. Math: WGS84 to UTM Zone 45N (EPSG:32645 - Standard for Central/Eastern Nepal)
  function latLonToUTM45N(lat, lon) {
    const a = 6378137.0;
    const f = 1 / 298.257223563;
    const k0 = 0.9996;
    const lon0 = 87.0; // Central meridian for UTM Zone 45
    const latRad = (lat * Math.PI) / 180;
    const lonRad = ((lon - lon0) * Math.PI) / 180;

    const e2 = 2 * f - f * f;
    const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
    const T = Math.tan(latRad) * Math.tan(latRad);
    const C = (e2 / (1 - e2)) * Math.cos(latRad) * Math.cos(latRad);
    const A = Math.cos(latRad) * lonRad;

    const M = a * (
      (1 - e2 / 4 - (3 * e2 * e2) / 64) * latRad -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32) * Math.sin(2 * latRad) +
      ((15 * e2 * e2) / 256) * Math.sin(4 * latRad)
    );

    const easting = 500000 + k0 * N * (
      A +
      ((1 - T + C) * Math.pow(A, 3)) / 6 +
      ((5 - 18 * T + T * T + 72 * C) * Math.pow(A, 5)) / 120
    );

    const northing = k0 * (
      M +
      N * Math.tan(latRad) * (
        (A * A) / 2 +
        ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24
      )
    );

    return {
      zone: '45N',
      easting: Math.round(easting),
      northing: Math.round(northing)
    };
  }

  // 4. Earth Sphere with NASA Blue Marble Texture
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

  // 5. Cloud Layer
  const cloudsTexture = textureLoader.load('img/earth_clouds_1024.png');
  const cloudsGeometry = new THREE.SphereGeometry(RADIUS * 1.018, 64, 64);
  const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
  });
  const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  globeGroup.add(cloudsMesh);

  // 6. Geodetic Coordinate Graticules (Contour Green & Ochre Equator)
  const gridGroup = new THREE.Group();
  const gridMaterial = new THREE.LineBasicMaterial({
    color: 0x2D6A4F, // --contour green
    transparent: true,
    opacity: 0.3,
  });
  const equatorMaterial = new THREE.LineBasicMaterial({
    color: 0xD97706, // --ochre
    transparent: true,
    opacity: 0.75,
  });

  // Parallels (Latitude: 15° intervals)
  for (let lat = -75; lat <= 75; lat += 15) {
    const latRad = (lat * Math.PI) / 180;
    const r = RADIUS * 1.004 * Math.cos(latRad);
    const y = RADIUS * 1.004 * Math.sin(latRad);
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const lonRad = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(r * Math.cos(lonRad), y, r * Math.sin(lonRad)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geom, lat === 0 ? equatorMaterial : gridMaterial);
    gridGroup.add(line);
  }

  // Meridians (Longitude: 30° intervals)
  for (let lon = 0; lon < 360; lon += 30) {
    const lonRad = (lon * Math.PI) / 180;
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const latRad = (i / 64) * Math.PI - Math.PI / 2;
      const r = RADIUS * 1.004 * Math.cos(latRad);
      const y = RADIUS * 1.004 * Math.sin(latRad);
      pts.push(new THREE.Vector3(r * Math.sin(lonRad), y, r * Math.cos(lonRad)));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geom, lon === 0 || lon === 180 ? equatorMaterial : gridMaterial);
    gridGroup.add(line);
  }
  globeGroup.add(gridGroup);

  // 7. Kathmandu University (KU / Dhulikhel / Banepa) 3D Surveyor Pinpoint
  const kuLocalPos = latLonToVector3(KU_LAT, KU_LON, RADIUS * 1.012);

  const pinGroup = new THREE.Group();
  pinGroup.position.copy(kuLocalPos);
  pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), kuLocalPos.clone().normalize());

  // Ochre Beacon Sphere
  const pinHeadGeom = new THREE.SphereGeometry(0.022, 16, 16);
  const pinHeadMat = new THREE.MeshBasicMaterial({ color: 0xD97706 });
  const pinHead = new THREE.Mesh(pinHeadGeom, pinHeadMat);
  pinHead.position.y = 0.045;
  pinGroup.add(pinHead);

  // Surveyor Stalk in Ink
  const pinStalkGeom = new THREE.CylinderGeometry(0.0035, 0.0035, 0.045, 8);
  const pinStalkMat = new THREE.MeshBasicMaterial({ color: 0x14261C });
  const pinStalk = new THREE.Mesh(pinStalkGeom, pinStalkMat);
  pinStalk.position.y = 0.022;
  pinGroup.add(pinStalk);

  // Pulsing Survey Radar Rings
  const radarRingGeom = new THREE.RingGeometry(0.015, 0.048, 32);
  const radarRingMat = new THREE.MeshBasicMaterial({
    color: 0xD97706,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const radarRing = new THREE.Mesh(radarRingGeom, radarRingMat);
  radarRing.rotation.x = Math.PI / 2;
  pinGroup.add(radarRing);

  // Campus Geodetic Boundary Ring (KU Dhulikhel footprint indicator)
  const kuBoundaryGeom = new THREE.RingGeometry(0.055, 0.062, 32);
  const kuBoundaryMat = new THREE.MeshBasicMaterial({
    color: 0x166534, // --forest
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65
  });
  const kuBoundary = new THREE.Mesh(kuBoundaryGeom, kuBoundaryMat);
  kuBoundary.rotation.x = Math.PI / 2;
  pinGroup.add(kuBoundary);

  globeGroup.add(pinGroup);

  // 8. Orbiting Sentinel-2A Satellite in Polar Sun-Synchronous Orbit
  const satGroup = new THREE.Group();
  const satOrbitRadius = RADIUS * 1.34;

  const satGeom = new THREE.BoxGeometry(0.026, 0.016, 0.036);
  const satMat = new THREE.MeshStandardMaterial({ color: 0xFAF7F0, metalness: 0.6 });
  const satellite = new THREE.Mesh(satGeom, satMat);

  const panelGeom = new THREE.BoxGeometry(0.072, 0.002, 0.02);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x166534, metalness: 0.5 });
  const panels = new THREE.Mesh(panelGeom, panelMat);
  satellite.add(panels);

  satGroup.add(satellite);
  globeGroup.add(satGroup);

  // Satellite orbit track in faint Ochre
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

  // 9. Initial Orientation: Target Kathmandu University squarely at center
  const TARGET_ROT_X = 0.26;
  const TARGET_ROT_Y = -Math.PI * 0.472;

  globeGroup.rotation.x = TARGET_ROT_X;
  globeGroup.rotation.y = TARGET_ROT_Y;

  // 10. Geodetic State & Animation Variables
  let isZoomed = false;
  let isAnimatingTransition = false;
  let animStartTime = 0;
  const ANIM_DURATION = 1200; // ms

  let startCamZ = ORBIT_ZOOM;
  let targetCamZ = ORBIT_ZOOM;
  let startRotX = TARGET_ROT_X;
  let targetRotX = TARGET_ROT_X;
  let startRotY = TARGET_ROT_Y;
  let targetRotY = TARGET_ROT_Y;

  // 11. Live HUD Elements
  const hudLatLon = document.getElementById('hud-latlon');
  const hudUtm = document.getElementById('hud-utm');
  const hudStatus = document.getElementById('hud-status');
  const kuCallout = document.getElementById('ku-campus-callout');
  const btnResetGlobe = document.getElementById('btn-reset-globe');
  const captionText = document.getElementById('dial-mode-text');

  function updateHUD(lat, lon, isTargetKU = false) {
    if (hudLatLon) {
      hudLatLon.textContent = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(4)}°${lon >= 0 ? 'E' : 'W'}`;
    }
    if (hudUtm) {
      const utm = latLonToUTM45N(lat, lon);
      hudUtm.textContent = `${utm.easting}m E ${utm.northing}m N`;
    }
    if (hudStatus && !isZoomed) {
      hudStatus.textContent = isTargetKU ? '● TARGET: KU / BANEPA' : '● GPS TRACKING';
    }
  }

  // Initialize HUD with Kathmandu University coordinates
  updateHUD(KU_LAT, KU_LON, true);

  // 11. Raycaster for Live Cursor Lat/Lon Scanning
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerMoveHUD(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earthMesh);

    if (intersects.length > 0) {
      // Convert intersection point from world to globe local coordinate space
      const localIntersect = globeGroup.worldToLocal(intersects[0].point.clone());
      const coords = vector3ToLatLon(localIntersect);
      updateHUD(coords.lat, coords.lon, false);
      canvas.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    } else {
      if (!isDragging) {
        updateHUD(KU_LAT, KU_LON, true);
        canvas.style.cursor = isZoomed ? 'zoom-out' : 'grab';
      }
    }
  }
  canvas.addEventListener('mousemove', onPointerMoveHUD, { passive: true });

  // 12. Cinematic Fly-To Zoom Functions
  function flyToKathmanduUniversity() {
    isZoomed = true;
    isAnimatingTransition = true;
    animStartTime = performance.now();

    startCamZ = camera.position.z;
    targetCamZ = KU_ZOOM;

    startRotX = globeGroup.rotation.x;
    targetRotX = TARGET_ROT_X;

    startRotY = globeGroup.rotation.y;
    // Align closest 360 wrap to targetRotY
    const twoPi = Math.PI * 2;
    let diff = (TARGET_ROT_Y - startRotY) % twoPi;
    if (diff < -Math.PI) diff += twoPi;
    if (diff > Math.PI) diff -= twoPi;
    targetRotY = startRotY + diff;

    if (kuCallout) kuCallout.classList.remove('is-hidden');
    if (hudStatus) {
      hudStatus.textContent = '● KU / BANEPA LOCKED [ZOOM 1.25x]';
      hudStatus.style.color = 'var(--ochre-text)';
    }
    if (captionText) {
      captionText.innerHTML = 'fig. 1a · kathmandu university (ku) · geomatics engineering · dhulikhel · utm 45n';
    }
  }

  function resetOrbit() {
    isZoomed = false;
    isAnimatingTransition = true;
    animStartTime = performance.now();

    startCamZ = camera.position.z;
    targetCamZ = ORBIT_ZOOM;

    startRotX = globeGroup.rotation.x;
    targetRotX = TARGET_ROT_X;

    startRotY = globeGroup.rotation.y;
    targetRotY = TARGET_ROT_Y;

    if (kuCallout) kuCallout.classList.add('is-hidden');
    if (hudStatus) {
      hudStatus.textContent = '● GLOBAL ORBIT [WGS84]';
      hudStatus.style.color = '';
    }
    if (captionText) {
      captionText.innerHTML = 'fig. 1 · banepa 3d drone model · 27.62°N 85.54°E · wgs84';
    }
    updateHUD(KU_LAT, KU_LON, true);
  }

  if (btnResetGlobe) {
    btnResetGlobe.addEventListener('click', (e) => {
      e.stopPropagation();
      resetOrbit();
    });
  }

  // 13. Drag & Interaction
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isDragging = false;
  let prevPointerPos = { x: 0, y: 0 };
  let hasMoved = false;
  let autoRotate = !prefersReducedMotion;

  function onPointerDown(e) {
    isDragging = true;
    hasMoved = false;
    autoRotate = false;
    prevPointerPos = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - prevPointerPos.x;
    const deltaY = e.clientY - prevPointerPos.y;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      hasMoved = true;
    }

    globeGroup.rotation.y += deltaX * (isZoomed ? 0.002 : 0.005);
    globeGroup.rotation.x += deltaY * (isZoomed ? 0.002 : 0.005);

    // Limit pitch so poles don't flip
    globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x));

    prevPointerPos = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp() {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = isZoomed ? 'zoom-out' : 'grab';

      // If user clicked without dragging, toggle zoom!
      if (!hasMoved && !isAnimatingTransition) {
        if (!isZoomed) {
          flyToKathmanduUniversity();
        } else {
          resetOrbit();
        }
      }

      // Resume gentle spin after 5s if idle and not zoomed
      if (!prefersReducedMotion && !isZoomed) {
        setTimeout(() => {
          if (!isDragging && !isZoomed) autoRotate = true;
        }, 5000);
      }
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // Double click anywhere on canvas resets
  canvas.addEventListener('dblclick', () => {
    if (isZoomed) resetOrbit();
    else flyToKathmanduUniversity();
  });

  // 14. Smooth Animation Loop
  let radarScale = 1;
  let satAngle = 0;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animate() {
    requestAnimationFrame(animate);

    // Handle Cinematic Fly-To transition
    if (isAnimatingTransition) {
      const now = performance.now();
      const elapsed = now - animStartTime;
      const progress = Math.min(1, elapsed / ANIM_DURATION);
      const eased = easeInOutCubic(progress);

      camera.position.z = startCamZ + (targetCamZ - startCamZ) * eased;
      globeGroup.rotation.x = startRotX + (targetRotX - startRotX) * eased;
      globeGroup.rotation.y = startRotY + (targetRotY - startRotY) * eased;

      if (progress >= 1) {
        isAnimatingTransition = false;
      }
    } else if (autoRotate && !isZoomed && !prefersReducedMotion) {
      globeGroup.rotation.y += 0.0006;
      cloudsMesh.rotation.y += 0.00015;
    }

    // Pulse radar ring around Kathmandu University
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

  // Export controls for external UI hooks if needed
  window.flyToKU = flyToKathmanduUniversity;
  window.resetGlobe = resetOrbit;
})();
