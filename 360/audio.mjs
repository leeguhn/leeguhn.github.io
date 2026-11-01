import { clockLabel, distance } from './model.mjs';
import { snapDistance } from './protocol.mjs';

// Demonstration values only; calibrate before using in a participant study.
const GAP = 0.18, MASTER_GAIN = 0.4, SPEECH_GAIN = 0.75, SPEECH_JOIN_GAP = 0.055;
const clipUrl = name => new URL(`./audio/${name}.wav`, import.meta.url);

export function distanceCue(metres) {
  const index = Math.round(snapDistance(metres) * 2) - 1;
  // Log-spaced demo pitches, not a calibrated perceptual standard.
  const pitches = [1200, 819, 559, 381, 260];
  return { frequency: pitches[index], gain: 0.2, duration: 0.18 };
}
export function cycleOffsets(durations, schedule, gap = GAP) {
  let offset = 0;
  return durations.map(duration => {
    const start = schedule === 'simultaneous' ? 0 : offset;
    offset += duration + gap;
    return start;
  });
}
// World +Z is forward; Web Audio -Z is forward.
export function sourcePosition(object) { return [object.x, 0, -object.z]; }
export function listenerForward(heading) { return [Math.sin(heading), 0, -Math.cos(heading)]; }

function setVector(node, prefix, vector, now) {
  if (node[`${prefix}X`]) {
    ['X', 'Y', 'Z'].forEach((axis, index) => node[`${prefix}${axis}`].setValueAtTime(vector[index], now));
  } else if (prefix === 'position') node.setPosition(...vector);
}

function wait(seconds, signal) {
  if (signal.aborted) return Promise.resolve(false);
  return new Promise(resolve => {
    const finish = result => { clearTimeout(timer); signal.removeEventListener('abort', abort); resolve(result); };
    const abort = () => finish(false);
    const timer = setTimeout(() => finish(true), seconds * 1000);
    signal.addEventListener('abort', abort, { once: true });
  });
}

export class CueAudio {
  constructor({ onActivity = () => {}, onError = () => {} } = {}) {
    this.onActivity = onActivity;
    this.onError = onError;
    this.context = null;
    this.master = null;
    this.state = null;
    this.buffers = new Map();
    this.messages = new Map();
    this.voices = new Set();
    this.activeIds = new Set();
    this.loading = null;
    this.controller = null;
    this.generation = 0;
    this._playing = false;
  }
  get playing() { return this._playing; }
  get cycleDuration() {
    if (!this.state?.objects?.length) return 0;
    const durations = this.state.objects.map(object => this.state.cue === 'verbal'
      ? (this.speechMessage(object)?.duration ?? 2.2) : distanceCue(distance(object)).duration);
    const offsets = cycleOffsets(durations, this.state.schedule);
    return Math.max(...durations.map((duration, index) => offsets[index] + duration));
  }

  async unlock() {
    if (!this.context) {
      const Type = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!Type) throw new Error('This browser does not support Web Audio.');
      this.context = new Type();
      this.master = this.context.createGain();
      this.master.gain.value = MASTER_GAIN;
      this.master.connect(this.context.destination);
      this.update(this.state);
    }
    await this.context.resume();
    await this.loadSpeech();
    return this;
  }

  async loadSpeech() {
    if (this.buffers.size === 17) return;
    if (!this.loading) {
      const names = [...Array.from({ length: 12 }, (_, i) => `clock-${i + 1}`),
        ...Array.from({ length: 5 }, (_, i) => `distance-${i + 1}`)];
      this.loading = Promise.all(names.map(async name => {
        const response = await fetch(clipUrl(name));
        if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
        this.buffers.set(name, await this.context.decodeAudioData(await response.arrayBuffer()));
      })).catch(error => {
        this.loading = null;
        throw new Error(`Speech audio is unavailable. Serve this folder over HTTP. ${error.message}`);
      });
    }
    await this.loading;
  }

  update(state) {
    this.state = state;
    if (!this.context || !state) return;
    const listener = this.context.listener, now = this.context.currentTime;
    setVector(listener, 'position', [0, 0, 0], now);
    const forward = listenerForward(state.heading);
    if (listener.forwardX) {
      setVector(listener, 'forward', forward, now);
      setVector(listener, 'up', [0, 1, 0], now);
    } else listener.setOrientation(...forward, 0, 1, 0);
  }

  speechMessage(object) {
    if (!this.context || this.buffers.size !== 17) return null;
    const hour = Number(clockLabel(object, this.state?.heading ?? 0));
    const range = Math.max(1, Math.min(5, Math.round(distance(object) / 0.5)));
    const key = `${hour}:${range}`;
    if (this.messages.has(key)) return this.messages.get(key);
    const clock = this.buffers.get(`clock-${hour}`), metres = this.buffers.get(`distance-${range}`);
    if (!clock || !metres) return null;
    const gap = Math.round(SPEECH_JOIN_GAP * this.context.sampleRate);
    const result = this.context.createBuffer(1, clock.length + gap + metres.length, this.context.sampleRate);
    result.getChannelData(0).set(clock.getChannelData(0));
    result.getChannelData(0).set(metres.getChannelData(0), clock.length + gap);
    this.messages.set(key, result);
    return result;
  }

  async playCycle(state) {
    if (this._playing) return false;
    this.update(state);
    this._playing = true;
    const generation = ++this.generation, controller = new AbortController();
    this.controller = controller;
    try {
      await this.unlock();
      if (controller.signal.aborted || generation !== this.generation) return false;
      if (state.cue === 'verbal' && this.buffers.size !== 17) return false;
      const objects = state.objects.map(object => ({ ...object }));
      if (state.schedule === 'simultaneous' || objects.length === 1) {
        // Shared Web Audio start time: these really overlap, unlike a speechSynthesis queue.
        const at = this.context.currentTime + 0.025;
        await Promise.all(objects.map(object => this.playObject(object, state.cue, controller.signal, at)));
      } else {
        for (let i = 0; i < objects.length; i++) {
          if (controller.signal.aborted) break;
          // Use the latest head pose at each message's onset.
          await this.playObject(objects[i], state.cue, controller.signal);
          if (i < objects.length - 1 && !controller.signal.aborted) await wait(GAP, controller.signal);
        }
      }
      return !controller.signal.aborted;
    } catch (error) {
      if (!controller.signal.aborted) this.onError(error.message || 'Could not play audio.');
      return false;
    } finally {
      if (generation === this.generation) {
        this._playing = false;
        this.controller = null;
        this.activeIds.clear();
        this.onActivity([]);
      }
    }
  }

  playObject(object, cue, signal, at = this.context.currentTime) {
    if (signal.aborted) return Promise.resolve();
    const context = this.context;
    const source = cue === 'verbal' ? context.createBufferSource() : context.createOscillator();
    let duration, level;
    if (cue === 'verbal') {
      source.buffer = this.speechMessage(object);
      if (!source.buffer) throw new Error('Speech buffers are not ready.');
      duration = source.buffer.duration;
      level = SPEECH_GAIN;
    } else {
      const parameters = distanceCue(distance(object));
      source.frequency.value = parameters.frequency;
      source.setPeriodicWave(context.createPeriodicWave(new Float32Array([0, 0, 0, 0, 0]),
        new Float32Array([0, 1, 0.25, 0.12, 0.06])));
      duration = parameters.duration;
      level = parameters.gain;
    }
    const envelope = context.createGain(), panner = context.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.rolloffFactor = 0;
    panner.coneInnerAngle = panner.coneOuterAngle = 360;
    setVector(panner, 'position', sourcePosition(object), context.currentTime);
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(level, at + 0.01);
    envelope.gain.setValueAtTime(level, at + duration - 0.015);
    envelope.gain.linearRampToValueAtTime(0, at + duration);
    source.connect(envelope); envelope.connect(panner); panner.connect(this.master);
    return new Promise(resolve => {
      let settled = false, activityTimer;
      const markActive = () => {
        if (settled || signal.aborted) return;
        this.activeIds.add(object.id);
        this.onActivity([...this.activeIds]);
      };
      const cleanup = () => {
        if (settled) return;
        settled = true;
        clearTimeout(activityTimer);
        signal.removeEventListener('abort', abort);
        this.voices.delete(voice);
        this.activeIds.delete(object.id);
        this.onActivity([...this.activeIds]);
        source.disconnect(); envelope.disconnect(); panner.disconnect(); resolve();
      };
      const voice = { source, cleanup };
      const abort = () => { try { source.stop(); } catch {} cleanup(); };
      this.voices.add(voice);
      signal.addEventListener('abort', abort, { once: true });
      source.onended = cleanup;
      const delay = Math.max(0, (at - context.currentTime) * 1000);
      if (delay > 1) activityTimer = setTimeout(markActive, delay); else markActive();
      source.start(at);
      source.stop(at + duration);
    });
  }

  stop() {
    this.generation++;
    this.controller?.abort();
    this.controller = null;
    for (const voice of [...this.voices]) {
      try { voice.source.stop(); } catch {}
      voice.cleanup();
    }
    this.voices.clear();
    this.activeIds.clear();
    this._playing = false;
    this.onActivity([]);
  }
}
