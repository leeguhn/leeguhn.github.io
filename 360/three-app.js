(() => {
  "use strict";

  const T = window.THREE;
  if (!T) return;

  const $ = (id) => document.getElementById(id);
  const viewport = $("viewport");
  const radar = $("radar");
  const radarCtx = radar.getContext("2d");
  const sweepLine = $("sweepLine");
  const worldCard = document.querySelector(".world-card");
  const VOICE_DEFAULT = Object.freeze({ low: 500, high: 5000 });
  const HRTF_DEFAULT = Object.freeze({ low: 260, high: 1200 });
  const defaults = {
    voiceLow: VOICE_DEFAULT.low, voiceHigh: VOICE_DEFAULT.high, hrtfLow: HRTF_DEFAULT.low, hrtfHigh: HRTF_DEFAULT.high,
    listener: { x: 0, z: 0, heading: 0 },
    obstacles: [{ id: "A", label: "A", shape: "circle", x: 0, z: 4, heading: 0, width: 1, depth: 1, height: 1, audible: true, motion: "stationary", centerX: 0, centerZ: 0, radius: 3, degrees: 20 }]
  };
  const state = { mode: "baseline", paused: false, editing: false, selected: "A", voiceLow: defaults.voiceLow, voiceHigh: defaults.voiceHigh, hrtfLow: defaults.hrtfLow, hrtfHigh: defaults.hrtfHigh, listener: { ...defaults.listener }, obstacles: structuredClone(defaults.obstacles), startedAt: performance.now() };
  const RADAR_RANGE = 12;
  let radarDrag = null;
  const logs = [];
  const renderer = new T.WebGLRenderer({ canvas: viewport, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0xffffff, 1);
  const scene = new T.Scene();
  scene.background = new T.Color(0xffffff);
  const camera = new T.PerspectiveCamera(60, 1, 0.05, 100);
  const voiCamera = new T.PerspectiveCamera(60, 176 / 64, 0.05, 100);
  // Three.js uses the opposite horizontal screen sign for a +Z-facing camera.
  // Mirroring the camera keeps visual left/right consistent with the radar and HRTF.
  camera.scale.x = -1;
  voiCamera.scale.x = -1;
  const floor = new T.Mesh(new T.PlaneGeometry(24, 24), new T.MeshBasicMaterial({ color: 0xffffff }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const grid = new T.GridHelper(24, 24, 0xd8d8d8, 0xe8e8e8);
  grid.position.y = 0.002;
  scene.add(grid);
  const meshes = new Map();
  const black = () => new T.MeshBasicMaterial({ color: 0x111111 });
  const white = () => new T.MeshBasicMaterial({ color: 0xffffff });

  function primitive(group, geometry, material, x, y, z) {
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
  }

  function makeObstacle(o) {
    const group = new T.Group();
    group.userData.shape = o.shape;
    const w = Math.max(0.1, o.width), d = Math.max(0.1, o.depth), h = Math.max(0.1, o.height);
    if (o.shape === "circle") {
      primitive(group, new T.CylinderGeometry(w / 2, w / 2, h, 24), black(), 0, h / 2, 0);
    } else if (o.shape === "person") {
      primitive(group, new T.SphereGeometry(Math.min(w, d) * 0.22, 16, 12), black(), 0, h * 0.86, 0);
      primitive(group, new T.BoxGeometry(w * 0.62, h * 0.46, d * 0.42), black(), 0, h * 0.55, 0);
      primitive(group, new T.BoxGeometry(w * 0.18, h * 0.45, d * 0.18), black(), -w * 0.3, h * 0.53, 0);
      primitive(group, new T.BoxGeometry(w * 0.18, h * 0.45, d * 0.18), black(), w * 0.3, h * 0.53, 0);
      primitive(group, new T.BoxGeometry(w * 0.2, h * 0.48, d * 0.2), black(), -w * 0.16, h * 0.2, 0);
      primitive(group, new T.BoxGeometry(w * 0.2, h * 0.48, d * 0.2), black(), w * 0.16, h * 0.2, 0);
    } else if (o.shape === "car") {
      primitive(group, new T.BoxGeometry(w, h * 0.42, d), black(), 0, h * 0.27, 0);
      primitive(group, new T.BoxGeometry(w * 0.66, h * 0.34, d * 0.74), black(), 0, h * 0.62, 0);
      [-1, 1].forEach((x) => [-1, 1].forEach((z) => {
        const wheel = new T.Mesh(new T.CylinderGeometry(h * 0.16, h * 0.16, h * 0.12, 16), black());
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x * w * 0.38, h * 0.16, z * d * 0.36);
        group.add(wheel);
      }));
    } else {
      primitive(group, new T.BoxGeometry(w, h, d), black(), 0, h / 2, 0);
    }
    scene.add(group);
    meshes.set(o.id, group);
    return group;
  }

  function syncMeshes() {
    const ids = new Set(state.obstacles.map((o) => o.id));
    meshes.forEach((mesh, id) => { if (!ids.has(id)) { scene.remove(mesh); meshes.delete(id); } });
    state.obstacles.forEach((o) => {
      let mesh = meshes.get(o.id);
      if (!mesh || mesh.userData.shape !== o.shape) { if (mesh) scene.remove(mesh); mesh = makeObstacle(o); }
      mesh.position.set(o.x, 0, o.z);
      mesh.rotation.y = (o.heading * Math.PI) / 180;
    });
  }

  function forward() { return new T.Vector3(Math.sin(state.listener.heading), 0, Math.cos(state.listener.heading)); }
  function updateCameras() {
    const pos = new T.Vector3(state.listener.x, 1.62, state.listener.z);
    const target = pos.clone().add(forward());
    camera.position.copy(pos); camera.lookAt(target);
    voiCamera.position.copy(pos); voiCamera.lookAt(target);
  }

  function moveListener(dx, dz, turn) {
    state.listener.heading += turn || 0;
    const c = Math.cos(state.listener.heading), s = Math.sin(state.listener.heading);
    state.listener.x += dx * c + dz * s;
    state.listener.z += dz * c - dx * s;
    updateCameras();
    syncAudioPositions();
  }

  function applyMotion(o, t) {
    if (state.editing || state.paused || o.motion === "stationary") return;
    if (o.motion === "orbit") { const a = (o.phase || 0) + t * o.degrees * Math.PI / 180; o.centerX = state.listener.x; o.centerZ = state.listener.z; o.x = o.centerX + Math.cos(a) * o.radius; o.z = o.centerZ + Math.sin(a) * o.radius; }
    if (o.motion === "patrol") { const p = (Math.sin(t * o.degrees * Math.PI / 180) + 1) / 2; if (o.path === "vertical") { o.x = o.centerX; o.z = o.centerZ + (p * 2 - 1) * o.radius; } else { o.x = o.centerX + (p * 2 - 1) * o.radius; o.z = o.centerZ; } }
    if (o.motion === "approach") { const dx = state.listener.x - o.x, dz = state.listener.z - o.z, len = Math.hypot(dx, dz) || 1; o.x += dx / len * 0.018; o.z += dz / len * 0.018; }
  }

  function relative(o) {
    const dx = o.x - state.listener.x, dz = o.z - state.listener.z;
    const c = Math.cos(state.listener.heading), s = Math.sin(state.listener.heading);
    return { x: dx * c - dz * s, z: dx * s + dz * c, distance: Math.hypot(dx, dz), angle: Math.atan2(dx * c - dz * s, dx * s + dz * c) };
  }

  function drawArrow(x1, y1, x2, y2) { const angle = Math.atan2(y2 - y1, x2 - x1), size = 7; radarCtx.beginPath(); radarCtx.moveTo(x2, y2); radarCtx.lineTo(x2 - Math.cos(angle - 0.45) * size, y2 - Math.sin(angle - 0.45) * size); radarCtx.moveTo(x2, y2); radarCtx.lineTo(x2 - Math.cos(angle + 0.45) * size, y2 - Math.sin(angle + 0.45) * size); radarCtx.stroke(); }
  function drawMotion(o, cx, cy, scale) {
    if (!state.editing || o.id !== state.selected || o.motion === "stationary") return;
    radarCtx.save(); radarCtx.strokeStyle = "#b82424"; radarCtx.fillStyle = "#b82424"; radarCtx.lineWidth = 2;
    if (o.motion === "orbit") { const x = cx, y = cy; radarCtx.beginPath(); radarCtx.arc(x, y, Math.max(8, o.radius * scale), 0, Math.PI * 2); radarCtx.stroke(); const sx = x + Math.cos(o.phase || 0) * o.radius * scale, sy = y - Math.sin(o.phase || 0) * o.radius * scale; drawArrow(x, y, sx, sy); }
    else if (o.motion === "approach") { const x = cx + (o.x - state.listener.x) * scale, y = cy - (o.z - state.listener.z) * scale; radarCtx.beginPath(); radarCtx.moveTo(x, y); radarCtx.lineTo(cx, cy); radarCtx.stroke(); drawArrow(x, y, cx, cy); }
    else { const x = cx + (o.centerX - state.listener.x) * scale, y = cy - (o.centerZ - state.listener.z) * scale; const horizontal = o.path !== "vertical"; const ax = horizontal ? o.radius * scale : 0, ay = horizontal ? 0 : o.radius * scale; radarCtx.beginPath(); radarCtx.moveTo(x - ax, y + ay); radarCtx.lineTo(x + ax, y - ay); radarCtx.stroke(); drawArrow(x - ax, y + ay, x + ax, y - ay); drawArrow(x + ax, y - ay, x - ax, y + ay); }
    radarCtx.restore();
  }
  function drawRadar() {
    const w = radar.width, h = radar.height, cx = w / 2, cy = h / 2, scale = w / (RADAR_RANGE * 2);
    radarCtx.clearRect(0, 0, w, h); radarCtx.strokeStyle = "#dedede"; radarCtx.lineWidth = 1;
    for (let r = 1; r <= RADAR_RANGE; r++) { radarCtx.beginPath(); radarCtx.arc(cx, cy, r * scale, 0, Math.PI * 2); radarCtx.stroke(); }
    radarCtx.beginPath(); radarCtx.moveTo(cx, 0); radarCtx.lineTo(cx, h); radarCtx.moveTo(0, cy); radarCtx.lineTo(w, cy); radarCtx.stroke();
    state.obstacles.forEach((o) => { drawMotion(o, cx, cy, scale); const dx = o.x - state.listener.x, dz = o.z - state.listener.z, x = cx + dx * scale, y = cy - dz * scale; if (x < -20 || x > w + 20 || y < -20 || y > h + 20) return; radarCtx.fillStyle = o.id === state.selected && state.editing ? "#b82424" : "#111"; radarCtx.beginPath(); radarCtx.arc(x, y, Math.max(7, Math.min(15, o.width * scale * 0.5)), 0, Math.PI * 2); radarCtx.fill(); radarCtx.fillStyle = "#111"; radarCtx.font = `${state.editing ? 14 : 10}px monospace`; radarCtx.fillText(o.label, x + 10, y - 9); });
    radarCtx.strokeStyle = "#111"; radarCtx.lineWidth = 2; radarCtx.beginPath(); radarCtx.arc(cx, cy, state.editing ? 10 : 7, 0, Math.PI * 2); radarCtx.stroke(); const f = forward(); radarCtx.beginPath(); radarCtx.moveTo(cx, cy); radarCtx.lineTo(cx + f.x * (state.editing ? 30 : 18), cy - f.z * (state.editing ? 30 : 18)); radarCtx.stroke();
  }

  function resize() { const rect = viewport.getBoundingClientRect(); renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / Math.max(1, rect.height); camera.updateProjectionMatrix(); }

  const audio = { ctx: null, master: null, voices: new Map(), sweepStart: 0, sweepDuration: 1.05, active: false, renderTarget: null };
  function setParam(p, value) { if (p) p.setTargetAtTime(value, audio.ctx.currentTime, 0.03); }
  function syncListener() {
    if (!audio.ctx) return; const l = audio.ctx.listener, f = forward();
    setParam(l.positionX, state.listener.x); setParam(l.positionY, 1.62); setParam(l.positionZ, -state.listener.z);
    if (l.forwardX) { setParam(l.forwardX, f.x); setParam(l.forwardY, 0); setParam(l.forwardZ, -f.z); setParam(l.upX, 0); setParam(l.upY, 1); setParam(l.upZ, 0); } else if (l.setOrientation) l.setOrientation(f.x, 0, -f.z, 0, 1, 0);
  }
  function syncAudioPositions() {
    if (!audio.ctx) return;
    syncListener();
    const audible = new Set(state.obstacles.filter((o) => o.audible).map((o) => o.id));
    audio.voices.forEach((v, id) => { if (!audible.has(id)) { try { v.osc.stop(); } catch {} audio.voices.delete(id); } });
    state.obstacles.forEach((o) => {
      if (o.audible && !audio.voices.has(o.id)) {
        const osc = audio.ctx.createOscillator(), gain = audio.ctx.createGain(), panner = audio.ctx.createPanner();
        panner.panningModel = "HRTF"; panner.distanceModel = "inverse"; panner.refDistance = 1; panner.maxDistance = 30; osc.type = "sine"; osc.frequency.value = state.hrtfLow; gain.gain.value = 0.0001;
        osc.connect(gain).connect(panner).connect(audio.master); osc.start(); audio.voices.set(o.id, { osc, gain, panner });
      }
      const v = audio.voices.get(o.id); if (!v) return;
      const r = relative(o), count = Math.max(1, state.obstacles.filter((x) => x.audible).length), level = state.mode === "hrtf" && audio.active && o.audible ? (1 / Math.sqrt(count)) * Math.max(0.03, Math.min(0.8, 1 / (0.5 + r.distance))) : 0.0001;
      const azimuthT = Math.max(0, Math.min(1, (Math.cos(Math.atan2(r.x, r.z)) + 1) / 2));
      setParam(v.panner.positionX, o.x); setParam(v.panner.positionY, Math.max(0.5, o.height * 0.5)); setParam(v.panner.positionZ, -o.z); setParam(v.osc.frequency, state.hrtfLow * Math.pow(state.hrtfHigh / state.hrtfLow, azimuthT)); setParam(v.gain.gain, level);
    });
  }
  function makeVoiBuffer(image) {
    const sr = audio.ctx.sampleRate || 44100, length = Math.floor(sr * audio.sweepDuration), buffer = audio.ctx.createBuffer(2, length, sr), left = buffer.getChannelData(0), right = buffer.getChannelData(1), low = state.voiceLow, high = state.voiceHigh;
    const phases = Array.from({ length: 64 }, (_, row) => row * 0.71), frequencies = Array.from({ length: 64 }, (_, row) => 2 * Math.PI * high * Math.pow(low / high, row / 63));
    for (let i = 0; i < length; i++) { const column = Math.min(175, Math.floor(i / length * 176)), pan = column / 175 * 2 - 1, time = i / sr; let sample = 0; for (let row = 0; row < 64; row++) { const brightness = (255 - image[row * 176 + column]) / 255; if (brightness > 0) sample += brightness * 0.018 * Math.sin(frequencies[row] * time + phases[row]); } left[i] = sample * (1 - pan * 0.45); right[i] = sample * (1 + pan * 0.45); }
    return buffer;
  }
  function captureVoi() {
    const target = audio.renderTarget || (audio.renderTarget = new T.WebGLRenderTarget(176, 64, { depthBuffer: true })); const pixels = new Uint8Array(176 * 64 * 4); const floorWasVisible = floor.visible, gridWasVisible = grid.visible; floor.visible = false; grid.visible = false; renderer.setRenderTarget(target); renderer.render(scene, voiCamera); renderer.readRenderTargetPixels(target, 0, 0, 176, 64, pixels); renderer.setRenderTarget(null); floor.visible = floorWasVisible; grid.visible = gridWasVisible; const image = new Uint8Array(176 * 64); for (let i = 0; i < image.length; i++) image[i] = pixels[i * 4]; return image;
  }
  function createAudio() {
    if (audio.ctx) return; audio.ctx = new (window.AudioContext || window.webkitAudioContext)(); audio.master = audio.ctx.createGain(); audio.master.gain.value = 0.72; audio.master.connect(audio.ctx.destination); state.obstacles.filter((o) => o.audible).forEach((o) => { const osc = audio.ctx.createOscillator(), gain = audio.ctx.createGain(), panner = audio.ctx.createPanner(); panner.panningModel = "HRTF"; panner.distanceModel = "inverse"; panner.refDistance = 1; panner.maxDistance = 30; panner.rolloffFactor = 1; osc.type = "sine"; gain.gain.value = 0.0001; osc.connect(gain).connect(panner).connect(audio.master); osc.start(); audio.voices.set(o.id, { osc, gain, panner }); }); syncAudioPositions(); }
  function startSweep() { if (!audio.ctx || !audio.active || state.mode !== "baseline") return; const source = audio.ctx.createBufferSource(); source.buffer = makeVoiBuffer(captureVoi()); source.connect(audio.master); audio.sweepStart = audio.ctx.currentTime; audio.baseline = source; source.start(); source.onended = () => { if (audio.baseline === source) audio.baseline = null; }; }
  function startAudio() { leaveEditMode(); createAudio(); audio.ctx.resume(); audio.active = true; $("startAudio").dataset.audioState = "playing"; $("startAudio").textContent = "Stop Audio"; syncAudioPositions(); startSweep(); log("audio started"); }
  function stopAudio() { if (audio.ctx) { if (audio.baseline) { try { audio.baseline.stop(); } catch {} audio.baseline = null; } audio.ctx.suspend(); } audio.active = false; syncAudioPositions(); $("startAudio").dataset.audioState = "stopped"; $("startAudio").textContent = "Start Audio"; leaveEditMode(); }

  function log(message) { logs.unshift(`${new Date().toLocaleTimeString()}  ${message}`); if (logs.length > 30) logs.pop(); $("eventLog").textContent = logs.join("\n"); }
  function updateSweep() { if (!audio.active || state.mode !== "baseline" || !audio.ctx) { sweepLine.style.display = "none"; return; } sweepLine.style.display = "block"; const phase = ((audio.ctx.currentTime - audio.sweepStart) % audio.sweepDuration) / audio.sweepDuration; sweepLine.style.left = `${Math.max(0, phase) * 100}%`; }
  function updateTelemetry() { const o = state.obstacles.find((x) => x.id === state.selected); const r = o ? relative(o) : null; $("telemetry").textContent = `mode: ${state.mode}\naudio: ${audio.active ? "started" : "locked"}\nlistener: x=${state.listener.x.toFixed(2)} z=${state.listener.z.toFixed(2)} heading=${(state.listener.heading * 180 / Math.PI).toFixed(1)}deg\nobstacles: ${state.obstacles.length}\nvOICe: ${state.voiceLow}-${state.voiceHigh}Hz\nHRTF: ${state.hrtfLow}-${state.hrtfHigh}Hz${o && r ? `\n\n${o.label}: ${o.shape} az=${(Math.atan2(r.x, r.z) * 180 / Math.PI).toFixed(1)}deg d=${r.distance.toFixed(2)}m` : ""}`; }

  function renderEditor() {
    const o = state.obstacles.find((x) => x.id === state.selected); $("editor").hidden = !o; if (!o) return; $("editorTitle").textContent = `Obstacle ${o.label}`;
    [["obLabel", "label"], ["obShape", "shape"], ["obX", "x"], ["obZ", "z"], ["obHeading", "heading"], ["obWidth", "width"], ["obDepth", "depth"], ["obHeight", "height"], ["obMotion", "motion"]].forEach(([id, key]) => { $(id).value = o[key]; }); $("obAudible").checked = o.audible; renderMotion(o); }
  function renderMotion(o) { const fields = $("motionFields"); fields.innerHTML = ""; [["Center X", "centerX"], ["Center Z", "centerZ"], ["Radius", "radius"], ["Degrees/s", "degrees"]].forEach(([label, key]) => { const el = document.createElement("label"); el.textContent = label; const input = document.createElement("input"); input.type = "number"; input.step = "0.1"; input.value = o[key] ?? 0; input.dataset.motionKey = key; el.appendChild(input); fields.appendChild(el); }); }
  function renderList() { const list = $("obstacleList"); list.innerHTML = ""; state.obstacles.forEach((o) => { const row = document.createElement("div"); row.className = `obstacle-row${o.id === state.selected ? " selected" : ""}`; row.innerHTML = `<span class="shape-glyph">${o.shape[0].toUpperCase()}</span><span>${o.id} ${o.label}</span><span class="row-state">${o.motion}</span>`; row.onclick = () => { state.selected = o.id; renderList(); renderEditor(); }; list.appendChild(row); }); }
  function syncEditUi() { worldCard.classList.toggle("editing", state.editing); $("editPalette").hidden = !state.editing; $("motionPanel").hidden = !state.editing || !state.obstacles.some((o) => o.id === state.selected); const o = state.obstacles.find((x) => x.id === state.selected); if (o) { $("motionObjectLabel").textContent = `Obstacle ${o.label}`; $("motionPanel").querySelectorAll("[data-motion-tool]").forEach((button) => button.setAttribute("aria-pressed", (button.dataset.motionTool === (o.motion === "patrol" ? o.path : o.motion)) ? "true" : "false")); $("motionHint").textContent = o.motion === "stationary" ? "Drag this obstacle to place it." : "Drag the red path or obstacle to adjust it."; } }
  function enterEditMode() { if (audio.active) return; state.editing = true; syncEditUi(); drawRadar(); }
  function leaveEditMode() { state.editing = false; radarDrag = null; syncEditUi(); drawRadar(); }
  function radarWorldPoint(event) { const rect = radar.getBoundingClientRect(), px = (event.clientX - rect.left) * radar.width / rect.width, py = (event.clientY - rect.top) * radar.height / rect.height, scale = radar.width / (RADAR_RANGE * 2); return { x: Math.max(-RADAR_RANGE, Math.min(RADAR_RANGE, state.listener.x + (px - radar.width / 2) / scale)), z: Math.max(-RADAR_RANGE, Math.min(RADAR_RANGE, state.listener.z + (radar.height / 2 - py) / scale)) }; }
  function radarObstacleAt(event) { const p = radarWorldPoint(event), tolerance = Math.max(0.35, RADAR_RANGE / 28); return state.obstacles.find((o) => Math.hypot(o.x - p.x, o.z - p.z) <= tolerance); }
  function setMotionTool(tool) { const o = state.obstacles.find((x) => x.id === state.selected); if (!o) return; if (tool === "stationary") { o.motion = "stationary"; } else if (tool === "horizontal" || tool === "vertical") { o.motion = "patrol"; o.path = tool; o.centerX = o.x; o.centerZ = o.z; o.radius = Math.max(1, o.radius || 2); } else if (tool === "orbit") { o.motion = "orbit"; o.centerX = state.listener.x; o.centerZ = state.listener.z; o.radius = Math.max(0.5, Math.hypot(o.x - state.listener.x, o.z - state.listener.z)); o.phase = Math.atan2(o.z - state.listener.z, o.x - state.listener.x); } else if (tool === "approach") { o.motion = "approach"; o.centerX = o.x; o.centerZ = o.z; o.radius = 1; } syncEditUi(); syncMeshes(); renderList(); drawRadar(); }
  function addObstacleAt(shape, point) { const index = state.obstacles.length, id = String.fromCharCode(65 + index); const base = structuredClone(defaults.obstacles[0]); const o = { ...base, id, label: id, shape, x: point.x, z: point.z, motion: "stationary" }; if (shape === "person") Object.assign(o, { width: 0.7, depth: 0.5, height: 1.8 }); if (shape === "car") Object.assign(o, { width: 1.8, depth: 4, height: 1.4 }); state.obstacles.push(o); state.selected = id; syncMeshes(); renderList(); renderEditor(); syncEditUi(); }
  function bindRadarEditing() { const overlay = document.querySelector(".radar-overlay"); const open = () => { if (!audio.active) enterEditMode(); }; overlay.addEventListener("click", open); overlay.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }); radar.addEventListener("pointerdown", (e) => { if (!state.editing) return; const o = radarObstacleAt(e); if (o) { state.selected = o.id; radarDrag = { type: "obstacle", id: o.id }; renderList(); renderEditor(); syncEditUi(); } radar.setPointerCapture(e.pointerId); }); radar.addEventListener("pointermove", (e) => { if (!radarDrag) return; const o = state.obstacles.find((x) => x.id === radarDrag.id); if (!o) return; const p = radarWorldPoint(e); o.x = p.x; o.z = p.z; if (o.motion === "orbit") { o.radius = Math.max(0.5, Math.hypot(o.x - state.listener.x, o.z - state.listener.z)); o.phase = Math.atan2(o.z - state.listener.z, o.x - state.listener.x); } else if (o.motion === "patrol") { o.centerX = o.x; o.centerZ = o.z; } syncMeshes(); renderEditor(); drawRadar(); }); window.addEventListener("pointerup", () => { radarDrag = null; }); radar.addEventListener("dragover", (e) => { if (state.editing) e.preventDefault(); }); radar.addEventListener("drop", (e) => { if (!state.editing) return; e.preventDefault(); const shape = e.dataTransfer.getData("text/plain"); if (shape) addObstacleAt(shape, radarWorldPoint(e)); }); document.querySelectorAll(".shape-tool").forEach((tool) => { tool.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", tool.dataset.shape)); tool.addEventListener("click", () => { if (!state.editing) return; addObstacleAt(tool.dataset.shape, { x: state.listener.x, z: state.listener.z + 3 }); }); }); document.querySelectorAll("[data-motion-tool]").forEach((button) => button.addEventListener("click", () => setMotionTool(button.dataset.motionTool))); $("closeMotionPanel").onclick = () => { state.selected = null; syncEditUi(); renderList(); drawRadar(); }; }
  function bindEditor() { const keys = [["obLabel", "label"], ["obShape", "shape"], ["obX", "x"], ["obZ", "z"], ["obHeading", "heading"], ["obWidth", "width"], ["obDepth", "depth"], ["obHeight", "height"], ["obMotion", "motion"]]; keys.forEach(([id, key]) => $(id).addEventListener("input", () => { const o = state.obstacles.find((x) => x.id === state.selected); if (!o) return; o[key] = $(id).type === "number" ? Number($(id).value) : $(id).value; syncMeshes(); renderList(); renderEditor(); })); $("obAudible").onchange = () => { const o = state.obstacles.find((x) => x.id === state.selected); if (o) o.audible = $("obAudible").checked; }; $("motionFields").addEventListener("input", (e) => { const o = state.obstacles.find((x) => x.id === state.selected), key = e.target.dataset.motionKey; if (o && key) o[key] = Number(e.target.value); }); }
  function resetScene() { Object.assign(state, { mode: "baseline", paused: false, editing: false, selected: "A", voiceLow: defaults.voiceLow, voiceHigh: defaults.voiceHigh, hrtfLow: defaults.hrtfLow, hrtfHigh: defaults.hrtfHigh, listener: { ...defaults.listener }, obstacles: structuredClone(defaults.obstacles) }); $("modeBaseline").setAttribute("aria-pressed", "true"); $("modeHrtf").setAttribute("aria-pressed", "false"); $("pauseMotion").textContent = "Pause Motion"; syncMeshes(); updateCameras(); renderList(); renderEditor(); setRanges(); syncEditUi(); log("scene reset"); }
  function setRanges() { ["voiceLow", "voiceHigh", "hrtfLow", "hrtfHigh"].forEach((id) => { $(id).value = state[id]; }); }
  function addObstacle(copy) { const index = state.obstacles.length; const o = { ...(copy || defaults.obstacles[0]), id: String.fromCharCode(65 + index), label: String.fromCharCode(65 + index), x: index * 1.5 - 1.5, z: 4, shape: copy?.shape || "cube" }; state.obstacles.push(o); state.selected = o.id; syncMeshes(); renderList(); renderEditor(); syncEditUi(); }
  function exportScene() { const blob = new Blob([JSON.stringify({ schemaVersion: 2, listener: state.listener, obstacles: state.obstacles, frequencies: { voiceLow: state.voiceLow, voiceHigh: state.voiceHigh, hrtfLow: state.hrtfLow, hrtfHigh: state.hrtfHigh } }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "etri-360-scene.json"; a.click(); URL.revokeObjectURL(a.href); }
  function importScene(data) { try { const x = JSON.parse(data); state.listener = { ...defaults.listener, ...(x.listener || {}) }; state.obstacles = x.obstacles || defaults.obstacles; const f = x.frequencies || {}; Object.assign(state, { voiceLow: f.voiceLow || state.voiceLow, voiceHigh: f.voiceHigh || state.voiceHigh, hrtfLow: f.hrtfLow || state.hrtfLow, hrtfHigh: f.hrtfHigh || state.hrtfHigh }); state.selected = state.obstacles[0]?.id || null; syncMeshes(); updateCameras(); renderList(); renderEditor(); setRanges(); } catch (e) { $("alert").hidden = false; $("alert").textContent = "Could not import that scene."; } }

  $("startAudio").onclick = () => audio.active ? stopAudio() : startAudio(); $("modeBaseline").onclick = () => { state.mode = "baseline"; $("modeBaseline").setAttribute("aria-pressed", "true"); $("modeHrtf").setAttribute("aria-pressed", "false"); }; $("modeHrtf").onclick = () => { state.mode = "hrtf"; $("modeBaseline").setAttribute("aria-pressed", "false"); $("modeHrtf").setAttribute("aria-pressed", "true"); }; $("pauseMotion").onclick = () => { state.paused = !state.paused; $("pauseMotion").textContent = state.paused ? "Resume Motion" : "Pause Motion"; }; $("resetScene").onclick = resetScene; $("addObstacle").onclick = () => addObstacle(); $("duplicateObstacle").onclick = () => { const o = state.obstacles.find((x) => x.id === state.selected); if (o) addObstacle({ ...o, x: o.x + 1 }); }; $("removeObstacle").onclick = () => { if (state.obstacles.length < 2) return; state.obstacles = state.obstacles.filter((o) => o.id !== state.selected); state.selected = state.obstacles[0].id; syncMeshes(); renderList(); renderEditor(); syncEditUi(); }; $("exportScene").onclick = exportScene; $("importScene").onclick = () => $("sceneFile").click(); $("sceneFile").onchange = (e) => { const file = e.target.files[0]; if (file) file.text().then(importScene); }; $("toggleLog").onclick = () => { const el = $("eventLog"), hidden = el.hidden; el.hidden = !hidden; $("toggleLog").textContent = hidden ? "Hide Event Log" : "Show Event Log"; }; ["voiceLow", "voiceHigh", "hrtfLow", "hrtfHigh"].forEach((id) => $(id).addEventListener("change", () => { state[id] = Number($(id).value); })); $("resetVoice").onclick = () => { state.voiceLow = defaults.voiceLow; state.voiceHigh = defaults.voiceHigh; setRanges(); }; $("resetHrtf").onclick = () => { state.hrtfLow = defaults.hrtfLow; state.hrtfHigh = defaults.hrtfHigh; setRanges(); }; bindEditor(); bindRadarEditing();
  window.addEventListener("keydown", (e) => { if (/input|select|textarea/i.test(e.target.tagName)) return; const step = e.shiftKey ? 0.4 : 0.12; if (e.key === "w") moveListener(0, step); if (e.key === "s") moveListener(0, -step); if (e.key === "a") moveListener(-step, 0); if (e.key === "d") moveListener(step, 0); if (e.key === "q") moveListener(0, 0, -0.04); if (e.key === "e") moveListener(0, 0, 0.04); });
  function frame(now) { const t = (now - state.startedAt) / 1000; state.obstacles.forEach((o) => applyMotion(o, t)); syncMeshes(); updateCameras(); drawRadar(); syncAudioPositions(); if (audio.active && state.mode === "baseline" && !audio.baseline) startSweep(); if (state.mode === "hrtf" && audio.baseline) { try { audio.baseline.stop(); } catch {} audio.baseline = null; } updateSweep(); updateTelemetry(); renderer.render(scene, camera); requestAnimationFrame(frame); }
  resize(); window.addEventListener("resize", resize); syncMeshes(); updateCameras(); renderList(); renderEditor(); setRanges(); syncEditUi(); log("3D scene ready"); requestAnimationFrame(frame);
})();
