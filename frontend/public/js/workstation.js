/**
 * 3D Survey Workstation Model Viewer (Ported ComputersCanvas)
 * Pure Three.js + GLTFLoader implementation matching reactjs18-3d-portfolio-main
 * Adheres strictly to Terrain Tokens: Sand, Forest, Ochre & Ink
 */

(function initWorkstation() {
  if (typeof THREE === 'undefined' || !THREE.GLTFLoader || !THREE.OrbitControls) return;

  const canvas = document.getElementById('workstation-canvas');
  const container = document.getElementById('globe-container');
  if (!canvas || !container) return;

  let width = container.clientWidth || 420;
  let height = container.clientHeight || 420;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
  camera.position.set(20, 3, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Terrain Studio Lighting (Preserving Terrain Tokens, strictly NO cyber purple)
  const hemiLight = new THREE.HemisphereLight(0xFAF7F0, 0x14261C, 0.65);
  scene.add(hemiLight);

  const spotLight = new THREE.SpotLight(0xfffaf0, 1.25);
  spotLight.position.set(-15, 35, 15);
  spotLight.angle = 0.18;
  spotLight.penumbra = 1;
  spotLight.castShadow = true;
  scene.add(spotLight);

  const forestRim = new THREE.DirectionalLight(0x166534, 0.7); // --forest rim
  forestRim.position.set(10, 5, -10);
  scene.add(forestRim);

  const ochreAccent = new THREE.PointLight(0xD97706, 0.8, 20); // --ochre accent
  ochreAccent.position.set(0, 3, 3);
  scene.add(ochreAccent);

  // Constrained OrbitControls (exactly like Computers.tsx in template)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  // Lock polar angle to keep the PC level on desk
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 2;

  let isLoaded = false;
  let modelGroup = null;
  const isMobile = window.innerWidth <= 600;

  // Load GLTF Model from local models directory
  const loader = new THREE.GLTFLoader();
  loader.load(
    'models/desktop_pc/scene.gltf',
    (gltf) => {
      modelGroup = gltf.scene;

      // Scale and position matching Computers.tsx
      const scale = isMobile ? 0.68 : 0.76;
      modelGroup.scale.set(scale, scale, scale);
      modelGroup.position.set(0, isMobile ? -1.8 : -2.4, -0.6);
      modelGroup.rotation.set(-0.01, -0.2, -0.08);

      modelGroup.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(modelGroup);
      isLoaded = true;
    },
    undefined,
    (err) => {
      console.warn('GLTF loading info:', err);
    }
  );

  // Render Loop
  let isVisible = false;

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  // Mode Switcher Controls
  const btnSat = document.getElementById('btn-mode-sat');
  const btnOsm = document.getElementById('btn-mode-osm');
  const btnPc = document.getElementById('btn-mode-pc');
  const earthCanvas = document.getElementById('earth-canvas');
  const pinCallout = document.getElementById('dial-pin-callout');
  const zoomControls = document.querySelector('.dial-zoom-controls');
  const captionText = document.getElementById('dial-mode-text');

  function showPc() {
    isVisible = true;
    if (btnPc) btnPc.classList.add('is-active');
    if (btnSat) btnSat.classList.remove('is-active');
    if (btnOsm) btnOsm.classList.remove('is-active');
    if (canvas) canvas.classList.remove('is-hidden');
    if (earthCanvas) earthCanvas.classList.add('is-hidden');
    if (pinCallout) pinCallout.style.opacity = '0';
    if (zoomControls) zoomControls.style.display = 'none';
    if (captionText) {
      captionText.innerHTML = 'fig. 1c · geospatial 3d workstation · interactive horizontal orbit';
    }
    controls.autoRotate = true;
  }

  function hidePc() {
    isVisible = false;
    if (btnPc) btnPc.classList.remove('is-active');
    if (canvas) canvas.classList.add('is-hidden');
    if (earthCanvas) earthCanvas.classList.remove('is-hidden');
    if (pinCallout) pinCallout.style.opacity = '1';
    if (zoomControls) zoomControls.style.display = 'flex';
  }

  if (btnPc) {
    btnPc.addEventListener('click', showPc);
  }
  if (btnSat) {
    btnSat.addEventListener('click', () => {
      hidePc();
      if (btnSat) btnSat.classList.add('is-active');
      if (btnOsm) btnOsm.classList.remove('is-active');
      if (window.setGlobeLayer) window.setGlobeLayer('sat');
    });
  }
  if (btnOsm) {
    btnOsm.addEventListener('click', () => {
      hidePc();
      if (btnOsm) btnOsm.classList.add('is-active');
      if (btnSat) btnSat.classList.remove('is-active');
      if (window.setGlobeLayer) window.setGlobeLayer('osm');
    });
  }

  // Responsive Resize
  function onResize() {
    width = container.clientWidth || 420;
    height = container.clientHeight || 420;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);
})();
