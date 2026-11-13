/**
 * 3D Survey Workstation Model Viewer (Ported ComputersCanvas)
 * Pure Three.js + GLTFLoader implementation matching reactjs18-3d-portfolio-main
 * Adheres strictly to Terrain Tokens: Sand, Forest, Ochre & Ink
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';

(function initWorkstation() {
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
  const controls = new OrbitControls(camera, renderer.domElement);
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
  const loader = new GLTFLoader();
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
  const btnGlobe = document.getElementById('btn-mode-globe');
  const btnPc = document.getElementById('btn-mode-pc');
  const earthCanvas = document.getElementById('earth-canvas');
  const pinCallout = document.getElementById('dial-pin-callout');
  const globeHud = document.getElementById('globe-hud');
  const kuCallout = document.getElementById('ku-campus-callout');
  const captionText = document.getElementById('dial-mode-text');

  function setMode(mode) {
    if (mode === 'pc') {
      isVisible = true;
      if (btnPc) btnPc.classList.add('is-active');
      if (btnGlobe) btnGlobe.classList.remove('is-active');
      if (canvas) canvas.classList.remove('is-hidden');
      if (earthCanvas) earthCanvas.classList.add('is-hidden');
      if (pinCallout) pinCallout.style.opacity = '0';
      if (globeHud) globeHud.style.display = 'none';
      if (kuCallout) kuCallout.classList.add('is-hidden');
      if (captionText) {
        captionText.innerHTML = 'fig. 1b · geospatial 3d workstation · interactive horizontal orbit';
      }
      controls.autoRotate = true;
    } else {
      isVisible = false;
      if (btnGlobe) btnGlobe.classList.add('is-active');
      if (btnPc) btnPc.classList.remove('is-active');
      if (canvas) canvas.classList.add('is-hidden');
      if (earthCanvas) earthCanvas.classList.remove('is-hidden');
      if (pinCallout) pinCallout.style.opacity = '1';
      if (globeHud) globeHud.style.display = 'flex';
      if (captionText) {
        captionText.innerHTML = 'fig. 1 · banepa 3d drone model · 27.62°N 85.54°E · wgs84';
      }
    }
  }

  if (btnGlobe && btnPc) {
    btnGlobe.addEventListener('click', () => setMode('globe'));
    btnPc.addEventListener('click', () => setMode('pc'));
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
