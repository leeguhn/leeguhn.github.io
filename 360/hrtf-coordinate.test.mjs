import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("./", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const threeApp = readFileSync(new URL("three-app.js", root), "utf8");

test("active prototype has a complete local entrypoint", () => {
  assert.match(html, /type="module" src="app\.mjs"/);
  for (const file of ["app.mjs", "render.mjs", "model.mjs", "audio.mjs", "audio/clock-12.wav", "audio/distance-1.wav", "assets/icons/shuffle.svg", "assets/icons/volume-high.svg"]) {
    assert.ok(existsSync(new URL(file, root)), `${file} is missing`);
  }
  assert.match(html, /styles\.css/);
  assert.ok(existsSync(new URL("v1.0/index.html", root)), "preserved v1.0 entrypoint is missing");
});

test("retained sweep sandbox keeps the established frequency defaults", () => {
  assert.match(threeApp, /voiceLow:\s*VOICE_DEFAULT\.low/);
  assert.match(threeApp, /voiceHigh:\s*VOICE_DEFAULT\.high/);
  assert.match(threeApp, /hrtfLow:\s*HRTF_DEFAULT\.low/);
  assert.match(threeApp, /hrtfHigh:\s*HRTF_DEFAULT\.high/);
  assert.match(threeApp, /low:\s*500,\s*high:\s*5000/);
  assert.match(threeApp, /low:\s*260,\s*high:\s*1200/);
});

test("retained sweep sandbox retains the shared 3D coordinate conventions", () => {
  assert.match(threeApp, /function forward\(\)\s*\{ return new T\.Vector3\(Math\.sin\(state\.listener\.heading\), 0, Math\.cos\(state\.listener\.heading\)\); \}/);
  assert.match(threeApp, /panningModel\s*=\s*["']HRTF["']/);
  assert.match(threeApp, /positionZ,\s*-o\.z/);
});

console.log("ETRI 360 prototype contract checks passed");
