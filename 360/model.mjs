/** World convention: +Z is radar-up / initial forward, +X is right.
 * Headings are radians, increasing clockwise. Object positions are world-fixed.
 * These dimensions and cue settings are demo parameters, not frozen study values.
 */
export const COLORS = Object.freeze(['#0089ff', '#e698f0', '#ffbc55']);
export const RING_STEP = 0.5;
export const MAX_DISTANCE = 2.5;
export const CYLINDER_HEIGHT = 0.8;
export const CYLINDER_RADIUS = 0.26;

const TAU = Math.PI * 2;
const OPTIONS = Object.freeze({
  cue: ['verbal', 'nonverbal'],
  trigger: ['automatic', 'requested'],
  count: [1, 2, 3],
  schedule: ['sequential', 'simultaneous'],
});

function wrapped(angle) {
  if (angle >= -Math.PI && angle < Math.PI) return angle;
  return ((angle + Math.PI) % TAU + TAU) % TAU - Math.PI;
}

function objectAt(index, angle, radius) {
  return { id: `object-${index + 1}`, color: COLORS[index], x: Math.sin(angle) * radius, z: Math.cos(angle) * radius };
}

function preset(count) {
  const positions = {
    // The one-object reference is closer; all presets keep the same world size.
    1: [[0, 1.5]],
    2: [[-30, 2], [30, 2]],
    3: [[-40, 2.5], [0, 1.5], [40, 2.5]],
  };
  return positions[count].map(([degrees, radius], index) => objectAt(index, degrees * Math.PI / 180, radius));
}

export function createState({ count = 2 } = {}) {
  if (!OPTIONS.count.includes(count)) throw new RangeError('Object count must be 1, 2 or 3.');
  return { cue: 'verbal', trigger: 'automatic', count, schedule: 'sequential', heading: 0, objects: preset(count), mainView: 'pov' };
}

/** Property changes leave the scene fixed, except when the object count changes. */
export function cycle(state, key, random = Math.random) {
  const options = OPTIONS[key];
  if (!options) throw new RangeError(`Unknown study property: ${key}`);
  if (key === 'schedule' && state.count === 1) return state;
  const next = options[(options.indexOf(state[key]) + 1) % options.length];
  return { ...state, [key]: next, ...(key === 'count' ? { objects: preset(next) } : {}) };
}

function fraction(random) {
  const n = random();
  return Number.isFinite(n) ? Math.max(0, Math.min(1 - Number.EPSILON, n)) : 0;
}

const choose = (options, random) => options[Math.floor(fraction(random) * options.length)];

function randomObjects(count, random) {
  const objects = [];
  const minimumSeparation = CYLINDER_RADIUS * 2 + 0.08;
  const clear = candidate => objects.every(other => Math.hypot(candidate.x - other.x, candidate.z - other.z) >= minimumSeparation);
  for (let index = 0; index < count; index++) {
    let candidate;
    for (let attempt = 0; attempt < 48; attempt++) {
      const radius = (Math.floor(fraction(random) * (MAX_DISTANCE / RING_STEP)) + 1) * RING_STEP;
      const next = objectAt(index, fraction(random) * TAU, radius);
      if (clear(next)) { candidate = next; break; }
    }
    // A bounded deterministic fallback also makes adversarial/constant RNGs safe.
    if (!candidate) {
      for (let segment = 0; segment < 24; segment++) {
        const next = objectAt(index, segment * TAU / 24, MAX_DISTANCE);
        if (clear(next)) { candidate = next; break; }
      }
    }
    if (!candidate) throw new Error('Unable to place the requested nonoverlapping objects.');
    objects.push(candidate);
  }
  return objects;
}

/** Shuffle all study settings and the scene; reset head direction, retain view mode. */
export function shuffle(state, random = Math.random) {
  const cue = choose(OPTIONS.cue, random);
  const trigger = choose(OPTIONS.trigger, random);
  const count = choose(OPTIONS.count, random);
  const schedule = choose(OPTIONS.schedule, random);
  return { ...state, cue, trigger, count, schedule, heading: 0, objects: randomObjects(count, random) };
}

export function rotate(state, delta) {
  return { ...state, heading: wrapped(state.heading + delta) };
}

export function bearing(object, heading = 0) {
  return wrapped(Math.atan2(object.x, object.z) - heading);
}

export function distance(object) {
  return Math.hypot(object.x, object.z);
}

/** Nearest clock hour as an integer; speech updates this at each message onset. */
export function clockLabel(object, heading = 0) {
  const hour = ((Math.round(bearing(object, heading) / (Math.PI / 6)) % 12) + 12) % 12;
  return hour === 0 ? 12 : hour;
}
