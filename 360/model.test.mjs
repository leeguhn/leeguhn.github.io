import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COLORS, RING_STEP, MAX_DISTANCE, CYLINDER_HEIGHT, CYLINDER_RADIUS,
  createState, cycle, shuffle, rotate, bearing, distance, clockLabel,
} from './model.mjs';

const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-10, message ?? `${actual} ≈ ${expected}`);
const polar = (degrees, radius = 2) => ({ x: radius * Math.sin(degrees * Math.PI / 180), z: radius * Math.cos(degrees * Math.PI / 180) });

test('initial counts reveal one fixed three-object layout', () => {
  assert.deepEqual(COLORS, ['#0089ff', '#e698f0', '#ffbc55']);
  assert.equal(RING_STEP, .5);
  assert.equal(MAX_DISTANCE, 2.5);
  assert.equal(CYLINDER_HEIGHT, .8);
  assert.equal(CYLINDER_RADIUS, .26);
  const expected = [[-30, 2], [30, 2], [0, 1.5]];
  for (const count of [1, 2, 3]) {
    const state = createState({ count });
    assert.equal(state.cue, 'verbal');
    assert.equal(state.trigger, 'automatic');
    assert.equal(state.schedule, 'sequential');
    assert.equal(state.mainView, 'pov');
    assert.equal(state.layout.length, 3);
    assert.equal(state.heading, 0);
    assert.equal(state.count, count);
    assert.equal(state.objects.length, count);
    state.objects.forEach((object, i) => {
      const p = polar(...expected[i]);
      close(object.x, p.x); close(object.z, p.z);
      assert.equal(object.color, COLORS[i]);
      assert.strictEqual(object, state.layout[i]);
    });
    assert.equal(new Set(state.objects.map(object => object.id)).size, count);
  }
});

test('count cycling before the first shuffle never moves an existing object', () => {
  let state = createState();
  const layout = state.layout;
  for (const count of [3, 1, 2, 3, 1, 2]) {
    state = cycle(state, 'count');
    assert.equal(state.count, count);
    assert.strictEqual(state.layout, layout);
    state.objects.forEach((object, index) => assert.strictEqual(object, layout[index]));
  }
});

test('Q/E-style head rotation changes relative bearings without moving the world or listener', () => {
  const initial = createState({ count: 3 });
  const target = initial.objects[2];
  const right = rotate(initial, Math.PI / 2);
  assert.strictEqual(right.objects, initial.objects);
  close(bearing(target, initial.heading), 0);
  close(bearing(target, right.heading), -Math.PI / 2);
  close(distance(target), 1.5);
  close(rotate(right, -Math.PI / 2).heading, 0);
  close(rotate(initial, 5 * Math.PI).heading, -Math.PI);
  assert.equal(initial.heading, 0);
});

test('clock words follow current head direction including rear and wraparound positions', () => {
  assert.equal(clockLabel(polar(0), 0), 12);
  assert.equal(clockLabel(polar(90), 0), 3);
  assert.equal(clockLabel(polar(-90), 0), 9);
  assert.equal(clockLabel(polar(180), 0), 6);
  assert.equal(clockLabel(polar(90), Math.PI / 2), 12);
  assert.equal(clockLabel(polar(-30), 0), 11);
  assert.equal(clockLabel(polar(14), 0), 12);
  assert.equal(clockLabel(polar(16), 0), 1);
});

test('changing cue, trigger or schedule preserves scene positions and head pose', () => {
  const initial = rotate(createState(), .4);
  for (const key of ['cue', 'trigger', 'schedule']) {
    const next = cycle(initial, key);
    assert.notEqual(next[key], initial[key]);
    assert.strictEqual(next.objects, initial.objects);
    assert.equal(next.heading, initial.heading);
    assert.equal(next.count, initial.count);
    assert.equal(cycle(next, key)[key], initial[key]);
  }
});

test('one object disables scheduling while preserving the previous multi-object preference', () => {
  let state = cycle(createState(), 'schedule');
  assert.equal(state.schedule, 'simultaneous');
  state = cycle(cycle(state, 'count'), 'count');
  assert.equal(state.count, 1);
  assert.strictEqual(cycle(state, 'schedule'), state);
  assert.equal(state.schedule, 'simultaneous');
  state = cycle(state, 'count');
  assert.equal(state.count, 2);
  assert.equal(state.schedule, 'simultaneous');
});

test('property cycling reaches exactly the 20 distinct study configurations', () => {
  const configurations = new Set();
  for (const count of [1, 2, 3]) {
    for (let cue = 0; cue < 2; cue++) for (let trigger = 0; trigger < 2; trigger++) for (let timing = 0; timing < 2; timing++) {
      let state = createState({ count });
      if (cue) state = cycle(state, 'cue');
      if (trigger) state = cycle(state, 'trigger');
      if (timing) state = cycle(state, 'schedule');
      configurations.add(`${state.cue}/${state.trigger}/${count}/${count === 1 ? 'single' : state.schedule}`);
    }
  }
  assert.equal(configurations.size, 20);
  assert.equal([...configurations].filter(s => s.includes('/1/')).length, 4);
  assert.equal([...configurations].filter(s => s.includes('/2/')).length, 8);
  assert.equal([...configurations].filter(s => s.includes('/3/')).length, 8);
});

test('shuffling uses unique global clock bearings, nondefault positions and half-metre rings', () => {
  let seed = 42;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  const initial = { ...rotate(createState(), 1.2), mainView: 'radar' };
  const encountered = new Set();
  const quadrants = new Set();
  for (let run = 0; run < 1000; run++) {
    const state = shuffle(initial, random);
    assert.equal(state.heading, 0);
    assert.equal(state.mainView, 'radar');
    assert.equal(state.layout.length, 3);
    assert.equal(state.objects.length, state.count);
    state.objects.forEach((object, index) => assert.strictEqual(object, state.layout[index]));
    assert.ok(state.count >= 1 && state.count <= 3);
    encountered.add(`${state.cue}/${state.trigger}/${state.count}/${state.count === 1 ? 'single' : state.schedule}`);
    const bearings = new Set();
    const defaults = [1, 2, 3].map(count => createState({ count }).objects);
    state.layout.forEach((object, i) => {
      const r = distance(object);
      assert.ok(r >= RING_STEP - 1e-10 && r <= MAX_DISTANCE + 1e-10);
      close(r / RING_STEP, Math.round(r / RING_STEP));
      const slot = bearing(object, 0) / (Math.PI / 6);
      close(slot, Math.round(slot));
      bearings.add(Math.round(slot));
      for (const layout of defaults) if (layout[i]) assert.ok(Math.hypot(object.x - layout[i].x, object.z - layout[i].z) > 1e-10);
      assert.equal(object.color, COLORS[i]);
      quadrants.add(`${object.x >= 0}/${object.z >= 0}`);
      for (const other of state.layout.slice(i + 1)) assert.ok(Math.hypot(object.x - other.x, object.z - other.z) >= CYLINDER_RADIUS * 2);
    });
    assert.equal(bearings.size, 3);
  }
  assert.equal(encountered.size, 20);
  assert.equal(quadrants.size, 4);
  assert.equal(initial.heading, 1.2);
});

test('count changes show and hide one fixed shuffled layout without moving objects', () => {
  let state = shuffle(createState({ count: 3 }), () => .999999);
  const layout = state.layout;
  for (const expectedCount of [1, 2, 3, 1, 2]) {
    state = cycle(state, 'count');
    assert.equal(state.count, expectedCount);
    assert.strictEqual(state.layout, layout);
    const defaults = createState({ count: expectedCount }).objects;
    const bearings = new Set();
    state.objects.forEach((object, index) => {
      assert.strictEqual(object, layout[index]);
      assert.ok(Math.hypot(object.x - defaults[index].x, object.z - defaults[index].z) > 1e-10);
      const slot = bearing(object, 0) / (Math.PI / 6);
      close(slot, Math.round(slot));
      bearings.add(Math.round(slot));
    });
    assert.equal(bearings.size, expectedCount);
  }
  for (const key of ['cue', 'trigger', 'schedule']) {
    const next = cycle(state, key);
    assert.strictEqual(next.layout, layout);
    assert.strictEqual(next.objects, state.objects);
  }
});

test('a constant random source cannot cause infinite placement retries or overlapping cylinders', () => {
  for (const value of [0, .5, .999999, 1]) {
    const state = shuffle(createState(), () => value);
    assert.ok(state.objects.length >= 1 && state.objects.length <= 3);
    for (let i = 0; i < state.layout.length; i++) for (let j = i + 1; j < state.layout.length; j++) {
      assert.ok(Math.hypot(state.layout[i].x - state.layout[j].x, state.layout[i].z - state.layout[j].z) >= CYLINDER_RADIUS * 2);
    }
  }
});

test('invalid counts and property names are rejected instead of creating an empty scene', () => {
  assert.throws(() => createState({ count: 0 }), RangeError);
  assert.throws(() => cycle(createState(), 'unknown'), RangeError);
});
