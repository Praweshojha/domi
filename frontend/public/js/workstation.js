/**
 * 3D Survey Workstation Model Viewer (Ported ComputersCanvas)
 * Pure Three.js + GLTFLoader implementation matching reactjs18-3d-portfolio-main
 * Optimized for Mobile/Android: Lazy loads heavy 18MB GLTF model only on demand
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
    powerPreference: 'low-power'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = false; // Disabled shadow maps for mobile performance

  // Terrain Studio Lighting (Preserving Terrain Tokens, strictly NO cyber purple)
  const hemiLight = new THREE.HemisphereLight(0xFAF7F0, 0x14261C, 0.65);
  scene.add(hemiLight);

  const spotLight = new THREE.SpotLight(0xfffaf0, 1.25);
  spotLight.position.set(-15, 35, 15);
  spotLight.angle = 0.18;
  spotLight.penumbra = 1;
  scene.add(spotLight);

  const forestRim = new THREE.DirectionalLight(0x166534, 0.7); // --forest rim
  forestRim.position.set(10, 5, -10);
  scene.add(forestRim);

  const ochreAccent = new THREE.PointLight(0xD97706, 0.8, 20); // --ochre accent
  ochreAccent.position.set(0, 3, 3);
  scene.add(ochreAccent);

  // Constrained OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 2;

  let isLoaded = false;
  let isLoading = false;
  let modelGroup = null;
  let isVisible = false;

  // Lazy Load GLTF Model on User Request (Saves 18MB on initial page load for mobile)
  function loadModel(onComplete) {
    if (isLoaded || isLoading) {
      if (onComplete) onComplete();
      return;
    }
    isLoading = true;
    const isMobile = window.innerWidth <= 600;

    const loader = new THREE.GLTFLoader();
    loader.load(
      'models/desktop_pc/scene.gltf',
      (gltf) => {
        modelGroup = gltf.scene;
        const scale = isMobile ? 0.68 : 0.76;
        modelGroup.scale.set(scale, scale, scale);
        modelGroup.position.set(0, isMobile ? -1.8 : -2.4, -0.6);
        modelGroup.rotation.set(-0.01, -0.2, -0.08);

        scene.add(modelGroup);
        isLoaded = true;
        isLoading = false;
        if (onComplete) onComplete();
      },
      undefined,
      (err) => {
        console.warn('Workstation model load notice:', err);
        isLoading = false;
      }
    );
  }

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  // Mode Switcher Controls
  const btnGlobe = document.getElementById('btn-mode-globe');
  const btnMap = document.getElementById('btn-mode-map');
  const btnPc = document.getElementById('btn-mode-pc');
  const earthCanvas = document.getElementById('earth-canvas');
  const interactiveMap = document.getElementById('interactive-map');
  const pinCallout = document.getElementById('dial-pin-callout');
  const zoomControls = document.querySelector('.dial-zoom-controls');
  const captionText = document.getElementById('dial-mode-text');

  function showPc() {
    isVisible = true;
    if (btnPc) btnPc.classList.add('is-active');
    if (btnGlobe) btnGlobe.classList.remove('is-active');
    if (btnMap) btnMap.classList.remove('is-active');
    if (canvas) canvas.classList.remove('is-hidden');
    if (earthCanvas) earthCanvas.classList.add('is-hidden');
    if (interactiveMap) interactiveMap.classList.add('is-hidden');
    if (pinCallout) pinCallout.style.opacity = '0';
    if (zoomControls) zoomControls.style.display = 'none';

    if (!isLoaded) {
      if (captionText) {
        captionText.innerHTML = 'fig. 1 · loading 3d survey workstation...';
      }
      loadModel(() => {
        if (isVisible && captionText) {
          captionText.innerHTML = 'fig. 1 · 3d geomatics survey workstation · [drag to rotate terminal]';
        }
      });
    } else {
      if (captionText) {
        captionText.innerHTML = 'fig. 1 · 3d geomatics survey workstation · [drag to rotate terminal]';
      }
    }
    controls.autoRotate = true;
  }

  function hidePc() {
    isVisible = false;
    if (btnPc) btnPc.classList.remove('is-active');
    if (canvas) canvas.classList.add('is-hidden');
    if (zoomControls) zoomControls.style.display = 'flex';
  }

  if (btnPc) btnPc.addEventListener('click', showPc);
  if (btnGlobe) btnGlobe.addEventListener('click', hidePc);
  if (btnMap) btnMap.addEventListener('click', hidePc);

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
