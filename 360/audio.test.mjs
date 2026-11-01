import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceCue, cycleOffsets, sourcePosition, listenerForward, CueAudio } from './audio.mjs';

test('distance coding uses five fixed pitches without a distance-gain code', () => {
  const near = distanceCue(0.5), far = distanceCue(2.5);
  assert.equal(near.frequency, 1200);
  assert.equal(far.frequency, 260);
  assert.equal(near.gain, far.gain);
  assert.equal(distanceCue(0.51).frequency, near.frequency);
  assert.equal(distanceCue(0.74).frequency, near.frequency);
  assert.equal(distanceCue(0.76).frequency, distanceCue(1).frequency);
  const pitches = new Set(Array.from({ length: 201 }, (_, i) => distanceCue(0.5 + i / 100).frequency));
  assert.equal(pitches.size, 5);
  assert.equal(near.duration, far.duration);
  assert.equal(distanceCue(-2).frequency, near.frequency);
  assert.equal(distanceCue(9).frequency, far.frequency);
});

test('sequential timing leaves a gap after the complete previous message', () => {
  const offsets = cycleOffsets([1, 1.2, 0.4], 'sequential', 0.16);
  assert.deepEqual(offsets.map(v => Math.round(v * 100)), [0, 116, 252]);
});

test('simultaneous timing starts every object together', () => {
  assert.deepEqual(cycleOffsets([1, 1.2, 0.4], 'simultaneous'), [0, 0, 0]);
  assert.deepEqual(cycleOffsets([], 'sequential'), []);
});

test('world sources remain fixed while only the audio listener turns', () => {
  const object = { x: 1, z: 2 };
  assert.deepEqual(sourcePosition(object), [1, 0, -2]);
  const forward = listenerForward(Math.PI / 2);
  assert.ok(Math.abs(forward[0] - 1) < 1e-10);
  assert.ok(Math.abs(forward[2]) < 1e-10);
  assert.deepEqual(sourcePosition(object), [1, 0, -2]);
});

test('stopping before initialization is safe and clears audible activity', () => {
  const activities = [];
  const audio = new CueAudio({ onActivity: ids => activities.push(ids) });
  audio.stop();
  assert.equal(audio.playing, false);
  assert.deepEqual(activities.at(-1), []);
});

test('a stopped pending unlock cannot later start an obsolete cycle', async () => {
  let resume;
  const audio = new CueAudio();
  // Deferred browser permission/loading is the external dependency in this race.
  audio.unlock = () => new Promise(resolve => { resume = resolve; });
  const state = { cue: 'nonverbal', schedule: 'simultaneous', heading: 0,
    objects: [{ id: 'one', x: 0, z: 2 }] };
  const first = audio.playCycle(state);
  assert.equal(audio.playing, true);
  assert.equal(await audio.playCycle(state), false);
  audio.stop();
  resume();
  assert.equal(await first, false);
  assert.equal(audio.playing, false);
});

test('cycle duration represents the complete sound window, including serial gaps', () => {
  const audio = new CueAudio();
  const state = { cue: 'nonverbal', schedule: 'sequential', heading: 0,
    objects: [{ x: 0, z: 1 }, { x: 1, z: 0 }, { x: -1, z: 0 }] };
  audio.update(state);
  assert.ok(Math.abs(audio.cycleDuration - 0.9) < 1e-10);
  audio.update({ ...state, schedule: 'simultaneous' });
  assert.equal(audio.cycleDuration, 0.18);
});
