import { RING_STEP, MAX_DISTANCE, CYLINDER_HEIGHT, CYLINDER_RADIUS } from './model.mjs';

// Live scene geometry, not image assets. Both views use the same world coordinates.
function surface(canvas) {
  const box = canvas.getBoundingClientRect(), scale = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, box.width), height = Math.max(1, box.height);
  const pixelsWide = Math.round(width * scale), pixelsHigh = Math.round(height * scale);
  if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) { canvas.width = pixelsWide; canvas.height = pixelsHigh; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

export function drawRadar(canvas, state) {
  const { ctx: g, width: w, height: h } = surface(canvas);
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * .45;
  g.strokeStyle = '#000'; g.lineWidth = Math.max(.8, Math.min(w, h) / 450);
  for (let metres = RING_STEP; metres <= MAX_DISTANCE; metres += RING_STEP) {
    g.beginPath(); g.arc(cx, cy, r * metres / MAX_DISTANCE, 0, Math.PI * 2); g.stroke();
  }
  const dot = Math.min(12, Math.max(6, Math.min(w, h) * .045));
  g.lineWidth = Math.max(1.5, dot / 5);
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(state.heading) * dot * 1.9, cy - Math.cos(state.heading) * dot * 1.9); g.stroke();
  g.fillStyle = '#000'; g.beginPath(); g.arc(cx, cy, dot, 0, Math.PI * 2); g.fill();
  for (const object of state.objects) {
    g.fillStyle = object.color; g.beginPath();
    g.arc(cx + object.x / MAX_DISTANCE * r, cy - object.z / MAX_DISTANCE * r, dot * 1.05, 0, Math.PI * 2); g.fill();
  }
}

export function drawPOV(canvas, state) {
  const { ctx: g, width: w, height: h } = surface(canvas);
  const focal = h * .8;
  // Upright, flat-filled cylinders match the supplied diagram. Their world sizes
  // stay equal; position and apparent size follow bearing and radial distance.
  const objects = state.objects.map(object => {
    const range = Math.hypot(object.x, object.z);
    const angle = Math.atan2(object.x, object.z) - state.heading;
    return { object, range, angle };
  }).sort((a, b) => b.range - a.range);
  g.strokeStyle = '#000'; g.lineWidth = Math.max(2, Math.min(6, w * .0043));
  g.lineJoin = 'round';
  for (const { object, range, angle } of objects) {
    if (Math.cos(angle) <= 0) continue;
    const cx = w / 2 + Math.tan(angle) * focal;
    const cy = h * .16 + .6 * focal / range;
    const rx = CYLINDER_RADIUS * focal / range;
    const overallHeight = CYLINDER_HEIGHT * focal / range;
    const ry = Math.min(rx * .38, overallHeight * .22);
    const top = cy - overallHeight / 2 + ry;
    const bottom = cy + overallHeight / 2 - ry;
    if (cx + rx < -10 || cx - rx > w + 10) continue;
    g.fillStyle = object.color;
    g.beginPath(); g.moveTo(cx - rx, top); g.lineTo(cx + rx, top);
    g.lineTo(cx + rx, bottom); g.lineTo(cx - rx, bottom); g.closePath();
    g.fill(); g.stroke();
    g.beginPath(); g.ellipse(cx, bottom, rx, ry, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  }
}
