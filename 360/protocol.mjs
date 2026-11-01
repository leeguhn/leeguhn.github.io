import { createState, shuffle } from './model.mjs';
export const DISTANCES = Object.freeze([.5, 1, 1.5, 2, 2.5]);
export const ANGLE_STEP = Math.PI / 6;
const TAU = Math.PI * 2;
export const wrap = a => ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;
const fraction = random => Math.max(0, Math.min(1 - Number.EPSILON, Number(random()) || 0));
export function snapBearing(angle) {
  const a = Math.round(angle / ANGLE_STEP) * ANGLE_STEP;
  return ((a % TAU) + TAU) % TAU;
}
export function snapDistance(metres) { return DISTANCES[Math.max(0, Math.min(4, Math.round(metres * 2) - 1))]; }
// Input rays are world anchored. Their screen projection follows head rotation.
export function rayGeometry(bearing, heading, width, height) {
  const relative = wrap(bearing - heading);
  if (Math.cos(relative) <= .02) return null;
  return { cx: width / 2, cy: height * .92, length: Math.min(width * .44, height * .68), dx: Math.sin(relative), dy: -Math.cos(relative), bearing };
}
export function bearingFromPointer(point, width, height, heading) {
  const cx = width / 2, cy = height * .92;
  if (!point || point.y >= cy || Math.hypot(point.x-cx,point.y-cy)<12) return null;
  const angle = snapBearing(heading + Math.atan2(point.x-cx, cy-point.y));
  return rayGeometry(angle,heading,width,height) ? angle : null;
}
export function rangeFromPointer(point, ray) {
  if (!ray || !point) return null;
  const along = (point.x-ray.cx)*ray.dx + (point.y-ray.cy)*ray.dy;
  return snapDistance(along / ray.length * 2.5);
}
const CONDITIONS = [];
for(const cue of ['verbal','nonverbal']) for(const trigger of ['automatic','requested'])
  for(const count of [1,2,3]) for(const schedule of count===1?['sequential']:['sequential','simultaneous']) CONDITIONS.push({cue,trigger,count,schedule});
export function createTrial(random = Math.random) {
  const condition=CONDITIONS[Math.floor(fraction(random)*CONDITIONS.length)];
  const scene=shuffle(createState(),random);
  return {...scene,...condition,heading:0,mainView:'pov',objects:scene.layout.slice(0,condition.count)};
}
export function learningBlock(random = Math.random) {
  const block=[...DISTANCES,...DISTANCES];
  for(let i=block.length-1;i>0;i--){const j=Math.floor(fraction(random)*(i+1));[block[i],block[j]]=[block[j],block[i]];}
  return block;
}
export function learningPassed(blocks) {
  return blocks.length===2 && blocks.every(block=>block.length===10 && block.filter(x=>x.correct).length>=8 && DISTANCES.every(d=>block.some(x=>x.distance===d&&x.correct)));
}
// Match whole bearing/range pairs once, so a binding swap cannot score as correct.
export function scoreScene(objects, responses) {
  const n=Math.min(objects.length,responses.length);let best=null;
  const cart=r=>({x:Math.sin(r.bearing)*r.distance,z:Math.cos(r.bearing)*r.distance});
  function search(index,used,pairs,cost){
    if(pairs.length===n){if(!best||cost<best.cost)best={pairs:[...pairs],cost};return;}
    if(index>=responses.length)return;
    if(responses.length-index>n-pairs.length)search(index+1,used,pairs,cost);
    const p=cart(responses[index]);
    objects.forEach((o,j)=>{if(used.has(j))return;used.add(j);pairs.push([index,j]); search(index+1,used,pairs,cost+Math.hypot(p.x-o.x,p.z-o.z));pairs.pop();used.delete(j);});
  }
  search(0,new Set(),[],0);
  const matches=(best?.pairs??[]).map(([responseIndex,objectIndex])=>{
    const r=responses[responseIndex],o=objects[objectIndex];
    const directionError=Math.abs(wrap(r.bearing-Math.atan2(o.x,o.z)))*180/Math.PI;
    const distanceError=Math.abs(r.distance-Math.hypot(o.x,o.z));
    return {responseIndex,objectIndex,directionError,distanceError,correct:directionError<.1&&distanceError<.01};
  });
  return {matches,correct:matches.filter(x=>x.correct).length,missed:objects.length-n,extra:responses.length-n};
}
