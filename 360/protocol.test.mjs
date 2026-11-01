import test from 'node:test';
import assert from 'node:assert/strict';
import { snapBearing, snapDistance, rayGeometry, bearingFromPointer, rangeFromPointer, createTrial, learningBlock, learningPassed, scoreScene } from './protocol.mjs';
const radians = n => n * Math.PI / 180;

test('direction entry snaps in world space, including wraparound and head turns', () => {
  assert.equal(snapBearing(radians(14)), 0);
  assert.ok(Math.abs(snapBearing(radians(16)) - radians(30)) < 1e-10);
  assert.equal(snapBearing(radians(359)), 0);
  const a = bearingFromPointer({ x: 500, y: 200 }, 1000, 700, radians(31));
  assert.ok(Math.abs(a - radians(30)) < 1e-10);
  assert.equal(bearingFromPointer({ x: 500, y: 699 }, 1000, 700, 0), null);
});
test('range entry snaps to five evenly spaced locations and stays on its locked world ray', () => {
  assert.equal(snapDistance(-1), .5); assert.equal(snapDistance(8), 2.5);
  assert.equal(snapDistance(.74), .5); assert.equal(snapDistance(.76), 1);
  const ray = rayGeometry(radians(60), radians(60), 1000, 700);
  assert.equal(ray.cx, 500); assert.equal(ray.dx, 0);
  assert.equal(rangeFromPointer({x:500,y:ray.cy-ray.length*.61},ray),1.5);
  assert.equal(rayGeometry(radians(180),0,1000,700),null);
  assert.ok(rayGeometry(radians(180),radians(180),1000,700));
});
test('random trials cover all 20 valid combinations and have nonempty clock-grid scenes', () => {
  const keys=new Set();
  for(let i=0;i<20;i++){
    let first=true; const s=createTrial(()=>{if(first){first=false;return(i+.1)/20;}return .4;});
    keys.add([s.cue,s.trigger,s.count,s.count===1?'single':s.schedule].join(':'));
    assert.equal(s.objects.length,s.count);assert.equal(s.heading,0);
    for(const o of s.objects){const a=Math.atan2(o.x,o.z)/radians(30);assert.ok(Math.abs(a-Math.round(a))<1e-8);}
  }
  assert.equal(keys.size,20);
});
test('each learning block balances all five distances', () => {
  const b=learningBlock(()=>.2);assert.equal(b.length,10);
  assert.deepEqual([.5,1,1.5,2,2.5].map(d=>b.filter(x=>x===d).length),[2,2,2,2,2]);
});
test('learning gate requires two passing blocks and evidence of every distance in each', () => {
  const perfect=learningBlock(()=>.4).map(distance=>({distance,correct:true}));
  assert.equal(learningPassed([perfect]),false);
  assert.equal(learningPassed([perfect,perfect]),true);
  const blindSpot=perfect.map(x=>({...x,correct:x.distance!==2.5}));
  assert.equal(learningPassed([perfect,blindSpot]),false);
  const weak=perfect.map((x,i)=>({...x,correct:i>2}));
  assert.equal(learningPassed([perfect,weak]),false);
});
test('scene scoring preserves direction-range pairs with one-to-one matching and missing objects', () => {
  const objects=[{id:'a',x:0,z:1},{id:'b',x:2,z:0}];
  const exact=scoreScene(objects,[{bearing:Math.PI/2,distance:2},{bearing:0,distance:1}]);
  assert.equal(exact.correct,2);assert.equal(exact.missed,0);
  const swapped=scoreScene(objects,[{bearing:0,distance:2},{bearing:Math.PI/2,distance:1}]);
  assert.equal(swapped.correct,0);
  const partial=scoreScene(objects,[{bearing:0,distance:1}]);
  assert.equal(partial.correct,1);assert.equal(partial.missed,1);
  const duplicate=scoreScene(objects,[{bearing:0,distance:1},{bearing:0,distance:1}]);
  assert.equal(duplicate.correct,1);
  assert.equal(scoreScene(objects,[]).missed,2);
});
