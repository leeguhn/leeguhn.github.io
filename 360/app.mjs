import { createState, cycle, shuffle, rotate, bearing, distance } from './model.mjs';
import { drawPOV, drawRadar } from './render.mjs';
import { CueAudio } from './audio.mjs';

let state = createState(), armed = false, repeatTimer = null, playbackEpoch = 0, enabling = null;
const $ = id => document.getElementById(id);
const controls = Object.fromEntries(['cue','trigger','count','schedule'].map(key => [key, $(key)]));
const status = $('status'), sound = $('sound'), visibility = $('visibility'), held = new Set();
const audio = new CueAudio({
  onActivity(ids) {
    sound.classList.toggle('playing', ids.length > 0); sound.dataset.playing = String(ids.length > 0);
    const label = !armed ? 'Enable sound' : state.trigger === 'automatic' ? 'Pause automatic sound' : ids.length ? 'Playing object cues' : 'Request object cues';
    sound.setAttribute('aria-label', label); sound.title = `${label} (Space)`;
  },
  onError(message) { reportError(message); },
});

function reportError(message) {
  armed = false; stopPlayback();
  status.textContent = message; status.classList.add('error');
  sound.classList.remove('ready'); sound.setAttribute('aria-label', 'Enable sound'); sound.title = message;
}

function stopPlayback() {
  playbackEpoch++;
  clearTimeout(repeatTimer); repeatTimer = null;
  audio.stop(); sound.classList.remove('playing'); sound.dataset.playing = 'false';
}
function describe() {
  const angle = (state.heading * 180 / Math.PI + 360) % 360;
  $('pov').setAttribute('aria-label', `First-person view, heading ${Math.round(angle)} degrees, ${state.count} object${state.count === 1 ? '' : 's'}`);
  $('radar').setAttribute('aria-label', `Radar, each ring 0.5 metres, heading ${Math.round(angle)} degrees. ${state.objects.map(o => `${o.id}: ${distance(o).toFixed(1)} metres, ${Math.round(bearing(o, state.heading) * 180 / Math.PI)} degrees from front`).join('; ')}`);
  document.body.dataset.cue = state.cue; document.body.dataset.trigger = state.trigger;
  document.body.dataset.count = state.count; document.body.dataset.schedule = state.count === 1 ? 'single' : state.schedule;
  document.body.dataset.heading = state.heading.toFixed(5); document.body.dataset.mainView = state.mainView;
}
function render() {
  drawPOV($('pov'), state); drawRadar($('radar'), state); describe();
}
function syncControls() {
  controls.cue.textContent = state.cue;
  controls.trigger.textContent = state.trigger === 'requested' ? 'requested' : 'automatic';
  controls.count.textContent = `${state.count} object${state.count === 1 ? '' : 's'}`;
  controls.schedule.textContent = state.schedule;
  controls.schedule.disabled = state.count === 1;
  controls.schedule.title = state.count === 1 ? 'Scheduling applies only to two or three objects' : 'Change multi-object playback';
  for (const [key, button] of Object.entries(controls)) button.setAttribute('aria-label', `${key === 'count' ? 'Objects' : key}: ${button.textContent}.${button.disabled ? ' Not applicable for one object.' : ' Click to change.'}`);
  sound.classList.toggle('ready', armed);
  const label = !armed ? 'Enable sound' : state.trigger === 'automatic' ? 'Pause automatic sound' : audio.playing ? 'Playing object cues' : 'Request object cues';
  sound.setAttribute('aria-label', label); sound.title = `${label} (Space)`;
  const povMain = state.mainView === 'pov';
  $('povView').className = `scene-view ${povMain ? 'primary' : 'inset'}`;
  $('radarView').className = `scene-view ${povMain ? 'inset' : 'primary'}`;
  $('povView').querySelector('button').hidden = povMain;
  $('radarView').querySelector('button').hidden = !povMain;
  render();
}
async function play({ repeat = false } = {}) {
  if (!armed || audio.playing) return;
  const epoch = playbackEpoch;
  await audio.playCycle(state);
  if (epoch !== playbackEpoch || !armed) return;
  syncControls();
  if (repeat && state.trigger === 'automatic') repeatTimer = setTimeout(() => play({ repeat: true }), 900);
}
function configurationChanged() {
  stopPlayback(); audio.update(state); syncControls();
  if (armed && state.trigger === 'automatic') void play({ repeat: true });
}
async function soundAction() {
  if (armed && state.trigger === 'automatic') { armed = false; stopPlayback(); syncControls(); return; }
  if (audio.playing || enabling) return;
  const epoch = playbackEpoch;
  status.classList.remove('error'); status.textContent = 'Loading audio';
  sound.setAttribute('aria-label', 'Loading audio');
  enabling = audio.unlock();
  try {
    await enabling;
    if (epoch !== playbackEpoch || document.hidden) return;
    armed = true; audio.update(state); syncControls();
    status.textContent = state.trigger === 'automatic' ? 'Automatic playback enabled' : 'Object cues requested';
    await play({ repeat: state.trigger === 'automatic' });
  } catch (error) {
    if (epoch === playbackEpoch) reportError(`Sound could not start: ${error.message}`);
  } finally { enabling = null; syncControls(); }
}

for (const [key, button] of Object.entries(controls)) button.addEventListener('click', () => { state = cycle(state, key); configurationChanged(); });
$('shuffle').addEventListener('click', () => { held.clear(); state = shuffle(state); configurationChanged(); });
sound.addEventListener('click', () => void soundAction());
visibility.addEventListener('click', () => {
  const enabled = visibility.getAttribute('aria-pressed') !== 'true';
  visibility.setAttribute('aria-pressed', String(enabled));
  $('viewport').dataset.lowVisibility = String(enabled);
  const label = enabled ? 'Disable low visibility' : 'Enable low visibility';
  visibility.setAttribute('aria-label', label);
  visibility.title = label;
});
for (const view of ['pov','radar']) $(`${view}View`).querySelector('button').addEventListener('click', () => { state = { ...state, mainView: view }; syncControls(); });

window.addEventListener('keydown', event => {
  if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
  if (event.target === visibility && event.code === 'Space') return;
  const key = event.key.toLowerCase();
  if (key === 'q' || key === 'e' || key === 'arrowleft' || key === 'arrowright') {
    event.preventDefault();
    if (!held.has(key)) { state = rotate(state, (key === 'q' || key === 'arrowleft' ? -1 : 1) * Math.PI / 36); audio.update(state); render(); }
    held.add(key);
  }
  if (event.code === 'Space' && !event.repeat) { event.preventDefault(); void soundAction(); }
  if (key === 'r' && !event.repeat) { state = { ...state, mainView: state.mainView === 'pov' ? 'radar' : 'pov' }; syncControls(); }
});
window.addEventListener('keyup', event => held.delete(event.key.toLowerCase()));
window.addEventListener('blur', () => held.clear());
document.addEventListener('visibilitychange', () => { if (document.hidden) { held.clear(); armed = false; stopPlayback(); syncControls(); } });
window.addEventListener('pagehide', () => { armed = false; stopPlayback(); });
new ResizeObserver(render).observe(document.querySelector('.viewport'));
let previous = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - previous) / 1000); previous = now;
  const left = held.has('q') || held.has('arrowleft'), right = held.has('e') || held.has('arrowright');
  if (left !== right) { state = rotate(state, (right ? 1 : -1) * dt * 1.1); audio.update(state); render(); }
  requestAnimationFrame(frame);
}
audio.update(state); syncControls(); requestAnimationFrame(frame);
