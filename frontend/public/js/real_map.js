/**
 * Real Interactive Map for Dhulikhel City & Kathmandu University (KU)
 * Powered by Leaflet with high-res Satellite Imagery & OpenStreetMap network
 * Features:
 *  - Real map zoom up to local level (Zoom 11 to 19) like in Google Maps
 *  - Default focus on Dhulikhel city (27.6195°N, 85.5385°E)
 *  - Smooth scroll wheel, pinch, and drag controls to explore Dhulikhel & locate KU
 *  - Layer toggle: High-res Satellite Imagery vs. OpenStreetMap road/building names
 *  - Styled cleanly to match Terrain Tokens without visual clutter
 */

(function () {
  'use strict';

  if (typeof L === 'undefined') return;

  const mapContainer = document.getElementById('interactive-map');
  const earthCanvas = document.getElementById('earth-canvas');
  const workstationCanvas = document.getElementById('workstation-canvas');
  const pinCallout = document.getElementById('dial-pin-callout');
  const captionText = document.getElementById('dial-mode-text');

  if (!mapContainer) return;

  const DHULIKHEL_COORDS = [27.6195, 85.5385]; // Kathmandu University, Dhulikhel
  const DEFAULT_ZOOM = 14; // Default view showing Dhulikhel city and university valley

  // 1. Initialize Leaflet Map (Optimized for Android & Touchscreens)
  const map = L.map('interactive-map', {
    center: DHULIKHEL_COORDS,
    zoom: DEFAULT_ZOOM,
    minZoom: 11,
    maxZoom: 19,
    zoomControl: false, // We use custom styled bezel controls
    attributionControl: false,
    tap: false, // Critical for fast, responsive pointer events on Android
    scrollWheelZoom: true,
    smoothWheelZoom: true,
    smoothSensitivity: 1.5,
  });

  // 2. High-Resolution Satellite Layer (Esri World Imagery, sub-meter aerial resolution)
  const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    maxNativeZoom: 19,
  });

  // 3. OpenStreetMap / Carto Street Network Layer (Real streets, buildings, departments & labels)
  const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    maxNativeZoom: 19,
  });

  // Add Satellite Layer by default
  satLayer.addTo(map);
  let currentLayer = 'sat';

  // 4. Custom Surveyor Landmark Marker for Kathmandu University
  const kuIcon = L.divIcon({
    className: 'ku-map-pin-wrap',
    html: '<div class="ku-map-pin"><span>kathmandu university</span></div>',
    iconSize: [140, 26],
    iconAnchor: [70, 13]
  });

  const kuMarker = L.marker(DHULIKHEL_COORDS, { icon: kuIcon }).addTo(map);

  // 5. Minimal Bezel Zoom Controls (+ / - / Reset to Dhulikhel)
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');

  let isMapActive = false;

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', (e) => {
      if (!isMapActive) return;
      e.stopPropagation();
      map.zoomIn();
    });
  }
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', (e) => {
      if (!isMapActive) return;
      e.stopPropagation();
      map.zoomOut();
    });
  }
  if (btnZoomReset) {
    btnZoomReset.addEventListener('click', (e) => {
      if (!isMapActive) return;
      e.stopPropagation();
      map.flyTo(DHULIKHEL_COORDS, DEFAULT_ZOOM, { duration: 0.8 });
    });
  }

  // 6. Real-Time Zoom Caption Telemetry
  function updateCaption() {
    if (!isMapActive) return;
    const z = map.getZoom();
    let desc = 'dhulikhel city · [scroll to zoom into ku]';
    if (z >= 17) desc = 'kathmandu university campus · local building level';
    else if (z >= 15) desc = 'dhulikhel valley & kathmandu university';

    if (captionText) {
      captionText.innerHTML = `fig. 1 · ${DHULIKHEL_COORDS[0]}°N ${DHULIKHEL_COORDS[1]}°E · ${desc}`;
    }
  }

  map.on('zoomend', updateCaption);
  map.on('moveend', updateCaption);

  // 7. Mode Transitions: 3D Globe Orbit <-> Real Dhulikhel Map
  function showDhulikhelMap() {
    isMapActive = true;
    mapContainer.classList.remove('is-hidden');
    if (earthCanvas) earthCanvas.classList.add('is-hidden');
    if (workstationCanvas) workstationCanvas.classList.add('is-hidden');
    if (pinCallout) pinCallout.style.opacity = '0';

    // Update switcher buttons
    const btnGlobe = document.getElementById('btn-mode-globe');
    const btnMap = document.getElementById('btn-mode-map');
    const btnPc = document.getElementById('btn-mode-pc');
    if (btnMap) btnMap.classList.add('is-active');
    if (btnGlobe) btnGlobe.classList.remove('is-active');
    if (btnPc) btnPc.classList.remove('is-active');

    // Trigger Leaflet viewport recalculation after becoming visible
    setTimeout(() => {
      map.invalidateSize();
      map.setView(DHULIKHEL_COORDS, DEFAULT_ZOOM);
      updateCaption();
    }, 50);
  }

  function showGlobeOrbit() {
    isMapActive = false;
    mapContainer.classList.add('is-hidden');
    if (earthCanvas) earthCanvas.classList.remove('is-hidden');
    if (workstationCanvas) workstationCanvas.classList.add('is-hidden');
    if (pinCallout) pinCallout.style.opacity = '1';

    const btnGlobe = document.getElementById('btn-mode-globe');
    const btnMap = document.getElementById('btn-mode-map');
    const btnPc = document.getElementById('btn-mode-pc');
    if (btnGlobe) btnGlobe.classList.add('is-active');
    if (btnMap) btnMap.classList.remove('is-active');
    if (btnPc) btnPc.classList.remove('is-active');

    if (captionText) {
      captionText.innerHTML = 'fig. 1 · 3d geodetic earth globe · [click globe to zoom into dhulikhel map]';
    }
  }

  function setLayer(type) {
    if (type === 'osm' && currentLayer !== 'osm') {
      map.removeLayer(satLayer);
      streetLayer.addTo(map);
      currentLayer = 'osm';
    } else if (type === 'sat' && currentLayer !== 'sat') {
      map.removeLayer(streetLayer);
      satLayer.addTo(map);
      currentLayer = 'sat';
    }
    const btnSat = document.getElementById('btn-layer-sat');
    const btnOsm = document.getElementById('btn-layer-osm');
    if (type === 'sat') {
      if (btnSat) btnSat.classList.add('is-active');
      if (btnOsm) btnOsm.classList.remove('is-active');
    } else {
      if (btnOsm) btnOsm.classList.add('is-active');
      if (btnSat) btnSat.classList.remove('is-active');
    }
  }

  // Export to window for dial controls
  window.isRealMapActive = function () { return isMapActive; };
  window.showDhulikhelMap = showDhulikhelMap;
  window.showGlobeOrbit = showGlobeOrbit;
  window.setRealMapLayer = setLayer;
  window.zoomToKU = function () {
    showDhulikhelMap();
    map.flyTo(DHULIKHEL_COORDS, 17, { duration: 1.2 });
  };

  // Bind Buttons
  const btnGlobe = document.getElementById('btn-mode-globe');
  const btnMap = document.getElementById('btn-mode-map');
  const btnSat = document.getElementById('btn-layer-sat');
  const btnOsm = document.getElementById('btn-layer-osm');

  if (btnGlobe) btnGlobe.addEventListener('click', showGlobeOrbit);
  if (btnMap) btnMap.addEventListener('click', showDhulikhelMap);
  if (btnSat) btnSat.addEventListener('click', () => {
    if (!isMapActive) showDhulikhelMap();
    setLayer('sat');
  });
  if (btnOsm) btnOsm.addEventListener('click', () => {
    if (!isMapActive) showDhulikhelMap();
    setLayer('osm');
  });
})();
