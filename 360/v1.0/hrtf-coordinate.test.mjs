import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
assert.ok(script, "index.html must contain an inline script");

function makeCanvasElement() {
  const context = new Proxy({}, {
    get() {
      return typeof (() => {}) === "function" ? () => {} : undefined;
    }
  });
  return {
    width: 900,
    height: 900,
    hidden: false,
    textContent: "",
    getContext: () => context,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 900, height: 900 }),
    addEventListener: () => {},
    setPointerCapture: () => {},
    setAttribute: () => {}
  };
}

function loadPrototype() {
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeCanvasElement());
      return elements.get(id);
    },
    addEventListener: () => {},
    createElement: () => ({ click: () => {} })
  };

  const context = {
    document,
    window: {},
    addEventListener: () => {},
    performance: { now: () => 0 },
    requestAnimationFrame: () => {},
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: class Blob {}
  };
  context.window = context;
  vm.runInNewContext(script, context, { filename: "index.html" });
  return context;
}

function approx(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${label}: expected ${expected}, got ${actual}`);
}

const prototype = loadPrototype();

prototype.sim.listener.x = 0;
prototype.sim.listener.z = 0;
prototype.sim.listener.heading = 0;

let vector = prototype.hrtfDebugVector({ id: "front", x: 0, z: 4 });
approx(vector.listenerForward.x, 0, "front heading audio forward x");
approx(vector.listenerForward.z, -1, "front heading audio forward z");
approx(vector.sourcePosition.x, 0, "front source audio x");
approx(vector.sourcePosition.z, -4, "front source audio z");

prototype.sim.listener.heading = Math.PI / 2;
vector = prototype.hrtfDebugVector({ id: "right", x: 0, z: -4 });
approx(vector.listenerForward.x, 1, "east heading audio forward x");
approx(vector.listenerForward.z, 0, "east heading audio forward z");
approx(vector.sourcePosition.x, 0, "rotated visual-right source audio x");
approx(vector.sourcePosition.z, 4, "rotated visual-right source audio z");

console.log("HRTF coordinate mapping regression checks passed");

const voiceConfig = prototype.voiceAlgorithmConfig;
assert.equal(voiceConfig.columns, 64, "vOICe mapping uses 64 columns");
assert.equal(voiceConfig.rows, 64, "vOICe mapping uses 64 rows");
assert.equal(voiceConfig.grayLevels, 16, "vOICe mapping uses 16 gray levels");
assert.equal(voiceConfig.sweepDuration, 1.05, "vOICe hificode uses a 1.05-second scan");
assert.equal(voiceConfig.useStartupClick, false, "looping vOICe playback disables the hificode left startup click");

approx(prototype.voiceFrequencyForRow(0), voiceConfig.highFrequencyHz, "top row frequency");
approx(prototype.voiceFrequencyForRow(63), voiceConfig.lowFrequencyHz, "bottom row frequency");
approx(
  prototype.voiceFrequencyForRow(31),
  voiceConfig.highFrequencyHz * Math.pow(voiceConfig.lowFrequencyHz / voiceConfig.highFrequencyHz, 31 / 63),
  "row frequencies are exponential"
);
assert.equal(prototype.voiceFrequencyRange().low, 500, "default vOICe low frequency is configurable");
assert.equal(prototype.voiceFrequencyRange().high, 5000, "default vOICe high frequency is configurable");
assert.equal(prototype.hrtfFrequencyRange().low, 260, "default HRTF low frequency keeps original tone range");
assert.equal(prototype.hrtfFrequencyRange().high, 1200, "default HRTF high frequency keeps original tone range");
prototype.soundSettings.voiceLowFrequencyHz = 300;
prototype.soundSettings.voiceHighFrequencyHz = 3000;
approx(prototype.voiceFrequencyForRow(0), 3000, "custom top row frequency");
approx(prototype.voiceFrequencyForRow(63), 300, "custom bottom row frequency");
assert.equal(prototype.hrtfFrequencyRange().low, 260, "custom vOICe range does not alter HRTF low");
assert.equal(prototype.hrtfFrequencyRange().high, 1200, "custom vOICe range does not alter HRTF high");

prototype.sim.listener.x = 0;
prototype.sim.listener.z = 0;
prototype.sim.listener.heading = 0;
prototype.soundSettings.hrtfLowFrequencyHz = 200;
prototype.soundSettings.hrtfHighFrequencyHz = 1000;
const frontTone = prototype.hrtfFrequencyForMetrics(prototype.computeObstacleMetrics({ id: "front", x: 0, z: 4 }));
const backTone = prototype.hrtfFrequencyForMetrics(prototype.computeObstacleMetrics({ id: "back", x: 0, z: -4 }));
assert.ok(frontTone > backTone, "front/back cue makes front tone brighter than rear tone at the same distance");
assert.equal(prototype.voiceFrequencyRange().low, 300, "custom HRTF range does not alter vOICe low");
assert.equal(prototype.voiceFrequencyRange().high, 3000, "custom HRTF range does not alter vOICe high");
prototype.soundSettings.voiceLowFrequencyHz = voiceConfig.lowFrequencyHz;
prototype.soundSettings.voiceHighFrequencyHz = voiceConfig.highFrequencyHz;
prototype.soundSettings.hrtfLowFrequencyHz = 260;
prototype.soundSettings.hrtfHighFrequencyHz = 1200;

prototype.soundSettings.voiceLowFrequencyHz = 300;
prototype.soundSettings.voiceHighFrequencyHz = 3000;
prototype.soundSettings.hrtfLowFrequencyHz = 200;
prototype.soundSettings.hrtfHighFrequencyHz = 1000;
prototype.resetFrequencyRange("voice");
assert.equal(prototype.voiceFrequencyRange().low, 500, "voice reset restores default low");
assert.equal(prototype.voiceFrequencyRange().high, 5000, "voice reset restores default high");
assert.equal(prototype.hrtfFrequencyRange().low, 200, "voice reset does not alter HRTF low");
assert.equal(prototype.hrtfFrequencyRange().high, 1000, "voice reset does not alter HRTF high");
prototype.resetFrequencyRange("hrtf");
assert.equal(prototype.voiceFrequencyRange().low, 500, "HRTF reset does not alter voice low");
assert.equal(prototype.voiceFrequencyRange().high, 5000, "HRTF reset does not alter voice high");
assert.equal(prototype.hrtfFrequencyRange().low, 260, "HRTF reset restores default low");
assert.equal(prototype.hrtfFrequencyRange().high, 1200, "HRTF reset restores default high");

prototype.sim.listener.x = 2;
prototype.sim.listener.z = -1;
prototype.sim.listener.heading = Math.PI / 2;
prototype.restoreInitialScene();
approx(prototype.sim.listener.x, 0, "reset restores listener x");
approx(prototype.sim.listener.z, 0, "reset restores listener z");
approx(prototype.sim.listener.heading, 0, "reset restores listener heading");
approx(prototype.sim.obstacles[0].x, 0, "reset restores obstacle x");
approx(prototype.sim.obstacles[0].z, 4, "reset restores obstacle z");
const image = prototype.buildVoiceImage();
assert.equal(image.length, 64 * 64, "vOICe image is 64x64");
assert.ok(Math.max(...image) <= 15, "brightness is quantized to 16 levels");
assert.ok(Math.max(...image) > 0, "front obstacle appears in the soundscape image");

console.log("vOICe mapping regression checks passed");

assert.equal(prototype.radarObstacleRadius(0.5), prototype.radarObstacleRadius(6), "radar obstacle radius is world-scale, not distance-scale");
assert.ok(prototype.povObstacleRadius(0.6) > prototype.povObstacleRadius(1.2), "POV obstacle keeps growing inside 1.2m");
assert.ok(prototype.voiceImageRadius(0.6) > prototype.voiceImageRadius(1.2), "vOICe image radius keeps growing inside 1.2m");
assert.ok(prototype.hrtfDistanceGain(0.25) > prototype.hrtfDistanceGain(0.5), "HRTF distance gain keeps increasing inside 0.5m");

console.log("distance scaling regression checks passed");
