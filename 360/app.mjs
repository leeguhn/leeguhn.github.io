import { createState, cycle, shuffle, rotate, bearing, distance } from './model.mjs';
import { drawPOV, drawRadar, drawResponseOverlay } from './render.mjs';
import { CueAudio } from './audio.mjs';
import { DISTANCES, createTrial, learningBlock, learningPassed, scoreScene, rayGeometry, bearingFromPointer, rangeFromPointer } from './protocol.mjs';

const $=id=>document.getElementById(id);
const controls=Object.fromEntries(['cue','trigger','count','schedule'].map(k=>[k,$(k)]));
const status=$('status'),sound=$('sound'),visibility=$('visibility'),held=new Set();
let state=createState(), mode='sandbox', phase='sandbox', sandbox=null, lowVisibility=false;
let armed=false, repeatTimer=null, phaseTimer=null, playbackEpoch=0, enabling=null;
let responses=[], pendingBearing=null, pointer=null, cycleCompleted=false, trialNumber=0, trialStart=0;
let training=null, resultAction=null, command='', commandTime=0;
const records=[];
const audio=new CueAudio({
 onActivity(ids){sound.classList.toggle('playing',ids.length>0);sound.dataset.playing=String(ids.length>0);},
 onError(message){reportError(message);}
});
const isResponse=()=>mode==='test'&&(phase==='trial'||phase==='check');
const hiddenTargets=()=>lowVisibility||(mode==='test'&&['trial','check','result'].includes(phase));
function record(type,data={}){records.push({type,time:new Date().toISOString(),...data});}
function announce(text){status.textContent=text;}
function reportError(message){armed=false;stopPlayback();status.classList.add('error');announce(message);syncControls();}
function stopPlayback(){playbackEpoch++;clearTimeout(repeatTimer);repeatTimer=null;audio.stop();sound.classList.remove('playing');sound.dataset.playing='false';}
function clearPhaseTimer(){clearTimeout(phaseTimer);phaseTimer=null;}
function resetResponses(){responses=[];pendingBearing=null;pointer=null;cycleCompleted=false;}

function describe(){
 const angle=(state.heading*180/Math.PI+360)%360;
 $('pov').setAttribute('aria-label',hiddenTargets()?`Targets hidden. Heading ${Math.round(angle)} degrees.`:`First-person view, heading ${Math.round(angle)} degrees, ${state.count} objects`);
 $('radar').setAttribute('aria-label',hiddenTargets()?'Targets hidden. Radar unavailable.':`Radar, each ring 0.5 metres, heading ${Math.round(angle)} degrees. ${state.objects.map(o=>`${o.id}: ${distance(o).toFixed(1)} metres, ${Math.round(bearing(o,state.heading)*180/Math.PI)} degrees from front`).join('; ')}`);
 Object.assign(document.body.dataset,{mode,phase,cue:state.cue,trigger:state.trigger,count:String(state.count),schedule:state.count===1?'single':state.schedule,heading:state.heading.toFixed(5),mainView:state.mainView,responses:String(responses.length),responseStage:pendingBearing===null?'direction':'distance',trial:String(trialNumber)});
}
function draftResponse(){
 if(!isResponse()||!pointer)return null;
 const canvas=$('responses'),box=canvas.getBoundingClientRect();
 const a=pendingBearing===null?bearingFromPointer(pointer,box.width,box.height,state.heading):pendingBearing;
 if(a===null)return null;
 const ray=rayGeometry(a,state.heading,box.width,box.height);
 if(!ray)return null;
 return {bearing:a,distance:pendingBearing===null?null:rangeFromPointer(pointer,ray)};
}
function render(){
 const visible=!hiddenTargets();
 drawPOV($('pov'),visible?state:{...state,objects:[]});
 drawRadar($('radar'),state,{responses:mode==='test'?responses:[],showTargets:visible,review:phase==='feedback'});
 if(isResponse())drawResponseOverlay($('responses'),state,responses,draftResponse());
 describe();
}
function syncControls(){
 const locked=mode==='test';
 for(const [k,b]of Object.entries(controls)){
  b.textContent=k==='count'?`${state.count} object${state.count===1?'':'s'}`:state[k];
  b.disabled=locked||(k==='schedule'&&state.count===1);
  b.setAttribute('aria-label',`${k}: ${b.textContent}${b.disabled?'. Locked.':'. Click to change.'}`);
 }
 $('shuffle').disabled=locked;visibility.disabled=locked;
 visibility.setAttribute('aria-pressed',String(hiddenTargets()));
 visibility.setAttribute('aria-label',hiddenTargets()?'Disable low visibility':'Enable low visibility');
 $('viewport').dataset.lowVisibility=String(hiddenTargets());
 const povMain=state.mainView==='pov';
 for(const v of ['pov','radar']){
  const primary=(v==='pov')===povMain;
  $(`${v}View`).className=`scene-view ${primary?'primary':'inset'}`;
  const swap=$(`${v}View`).querySelector('button');swap.hidden=primary||locked;swap.disabled=locked;
 }
 $('radarView').hidden=locked&&phase!=='feedback'&&phase!=='explore';
 $('povView').hidden=locked&&phase==='feedback';
 $('responses').hidden=!isResponse();$('trialHud').hidden=!locked;
 $('learningPanel').hidden=!locked||!['explore','result'].includes(phase);
 $('trialActions').hidden=!isResponse();$('finish').disabled=phase==='check';
 $('finish').hidden=phase==='check';$('undo').disabled=!responses.length&&pendingBearing===null;
 $('playHint').textContent=locked?(state.trigger==='requested'?'Space requests / replays sound':'Automatic playback'):'Space plays / pauses';
 $('swapHint').hidden=locked;$('rangeHint').textContent=locked?'Five distance points, 0.5 m apart':'Each ring = 0.5 m';
 $('modeHint').textContent=locked?'Click direction, then distance · Backspace undoes':'Type TEST / STOP to switch modes';
 sound.classList.toggle('ready',armed);
 const label=locked?(phase==='feedback'?'Reviewing answers':phase==='result'?'Learning result':phase==='explore'?'Replay reference cue':audio.playing?'Playing object cues':'Replay object cues'):!armed?'Enable sound':state.trigger==='automatic'?'Pause automatic sound':'Request object cues';
 sound.setAttribute('aria-label',label);sound.title=`${label} (Space)`;
 sound.disabled=locked&&['feedback','result'].includes(phase);
 if(locked){
  $('trialTitle').textContent=phase==='trial'?`Trial ${trialNumber} · ${responses.length}/${state.count} marked`:phase==='check'?`Learning check · ${state.cue} · ${Math.floor(training.checkIndex/10)+1}/2 · ${training.checkIndex%10+1}/10`:phase==='feedback'?`Trial ${trialNumber} · answers`:phase==='result'?'Learning check complete':`Learn ${state.cue} distances`;
  $('trialHint').textContent=isResponse()?(pendingBearing===null?'Click a direction on the 30° grid.':'Direction fixed. Click one of five distances.')+(state.trigger==='requested'?' Press Space to request sound.':''):phase==='feedback'?'Colours: objects · Black lines and dots: your answers · Next trial in 3 seconds':phase==='explore'?'Use the distance buttons to learn the five cues.':'';
 }
 render();
}
async function play({repeat=false}={}){
 if(!armed||audio.playing)return;
 const epoch=playbackEpoch;
 record('playback',{phase,cue:state.cue,trigger:state.trigger,trial:trialNumber});
 const completed=await audio.playCycle(state);
 if(epoch!==playbackEpoch||!armed)return;
 if(completed){cycleCompleted=true;if(isResponse()&&responses.length>=state.count){finishResponse();return;}}
 syncControls();
 if(repeat&&state.trigger==='automatic')repeatTimer=setTimeout(()=>void play({repeat:true}),900);
}
async function activateAndPlay(repeat=false){
 if(audio.playing)return;
 const epoch=playbackEpoch;status.classList.remove('error');announce('Loading audio');
 const task=enabling??audio.unlock();enabling=task;
 try{await task;if(enabling===task)enabling=null;if(epoch!==playbackEpoch||document.hidden)return;armed=true;audio.update(state);syncControls();await play({repeat});}
 catch(error){if(epoch===playbackEpoch)reportError(`Sound could not start: ${error.message}`);}
 finally{if(enabling===task)enabling=null;syncControls();}
}
function configurationChanged(){stopPlayback();audio.update(state);syncControls();if(armed&&state.trigger==='automatic')void activateAndPlay(true);}
async function soundAction(){
 if(mode==='test'){
  if(!['trial','check','explore'].includes(phase))return;
  if(armed&&!audio.playing)void activateAndPlay(phase==='trial'&&state.trigger==='automatic');
  else if(!armed)void activateAndPlay(phase==='trial'&&state.trigger==='automatic');
  return;
 }
 if(armed&&state.trigger==='automatic'){armed=false;stopPlayback();syncControls();return;}
 void activateAndPlay(state.trigger==='automatic');
}
function singleObject(range,cue){
 const o={id:'object-1',color:'#0089ff',x:0,z:range};
 state={...createState({count:1}),cue,trigger:'requested',schedule:'sequential',heading:0,objects:[o],layout:[o],mainView:'pov'};
}
function enterTest(){
 if(mode==='test')return;
 sandbox={state,lowVisibility};stopPlayback();clearPhaseTimer();held.clear();armed=false;
 mode='test';trialNumber=0;training={cueIndex:0,checks:[],checkIndex:0,order:[],attempt:1,passed:{},started:performance.now()};
 record('session-start',{version:2});return true;
}
function startTest(){if(mode==='test')return;enterTest();startTrial();}
function startLearning(){if(mode==='test')return;enterTest();beginExplore();}
function stopTest(){
 if(mode!=='test')return;
 record('session-stop',{trial:trialNumber,phase,responses,learning:training?.passed});
 stopPlayback();clearPhaseTimer();held.clear();armed=false;enabling=null;
 mode='sandbox';phase='sandbox';state=sandbox.state;lowVisibility=sandbox.lowVisibility;training=null;resetResponses();
 audio.update(state);announce('Sandbox restored.');syncControls();
}
function beginExplore(){
 stopPlayback();clearPhaseTimer();resetResponses();phase='explore';lowVisibility=false;
 const cue=training.cueIndex===0?'verbal':'nonverbal';singleObject(.5,cue);
 $('learningTitle').textContent=`Learn ${cue} distances`;
 $('learningText').textContent='Five distances: 0.5 to 2.5 metres. Click each value and compare its cue with the target shown in the radar. Then check your learning without feedback. The check uses two blocks of ten trials.';
 $('referenceDistances').hidden=false;$('learningNext').textContent='Check learning';$('learningNext').disabled=false;
 for(const b of $('referenceDistances').children)b.setAttribute('aria-pressed',String(Number(b.dataset.distance)===.5));
 resultAction=startCheck;syncControls();void activateAndPlay(false);
 phaseTimer=setTimeout(startCheck,300000);
}
function selectReference(range){
 if(phase!=='explore')return;
 stopPlayback();singleObject(range,state.cue);
 for(const b of $('referenceDistances').children)b.setAttribute('aria-pressed',String(Number(b.dataset.distance)===range));
 syncControls();void activateAndPlay(false);
}
function startCheck(){
 if(mode!=='test'||phase!=='explore')return;
 clearPhaseTimer();training.checks=[[],[]];training.order=[...learningBlock(),...learningBlock()];training.checkIndex=0;nextCheck();
}
function nextCheck(){
 stopPlayback();resetResponses();phase='check';lowVisibility=true;
 singleObject(training.order[training.checkIndex],training.cueIndex===0?'verbal':'nonverbal');
 record('check-start',{cue:state.cue,attempt:training.attempt,index:training.checkIndex});
 trialStart=performance.now();syncControls();void activateAndPlay(false);
}
function learningResult(){
 stopPlayback();phase='result';lowVisibility=true;
 const passed=learningPassed(training.checks),cue=state.cue;
 const totals=training.checks.map(b=>b.filter(x=>x.correct).length);
 training.passed[cue]=passed;
 record('learning-result',{cue,passed,attempt:training.attempt,blocks:training.checks,durationMs:performance.now()-training.started});
 $('learningTitle').textContent=passed?'Learning check passed':'More practice needed';
 $('learningText').textContent=`${totals[0]}/10 and ${totals[1]}/10 correct. Passing needs at least 8/10 in both blocks and a correct answer at every distance in each block. This is a provisional rehearsal criterion. ${passed?'Continue to the next stage.':training.attempt<2?'Practise again, or skip into the rehearsal without a passing result.':'The capped second attempt is complete. You can continue into the rehearsal without a passing result.'}`;
 $('referenceDistances').hidden=true;$('learningNext').disabled=false;
 $('learningNext').textContent=passed?(training.cueIndex===0?'Learn nonverbal cues':'Start trials'):training.attempt<2?'Practise again':'Continue without passing';
 resultAction=passed?advanceLearning:training.attempt<2?()=>{training.attempt++;beginExplore();}:advanceLearning;
 syncControls();
}
function advanceLearning(){
 if(training.cueIndex===0){training.cueIndex=1;training.attempt=1;training.started=performance.now();beginExplore();}
 else startTrial();
}
function startTrial(){
 if(mode!=='test')return;
 stopPlayback();clearPhaseTimer();resetResponses();held.clear();phase='trial';lowVisibility=true;
 state=createTrial();trialNumber++;trialStart=performance.now();armed=true;
 record('trial-start',{trial:trialNumber,condition:{cue:state.cue,trigger:state.trigger,count:state.count,schedule:state.schedule},objects:state.objects,learning:training?.passed});
 audio.update(state);syncControls();
 // Preserve requested access: it does not silently become automatic at trial onset.
 if(state.trigger==='automatic')void activateAndPlay(true);
 else announce('Press Space or the speaker to request the scene.');
}
function finishResponse(){
 if(!isResponse()||(phase==='check'&&!cycleCompleted))return;
 if(phase==='check'){
  const target=training.order[training.checkIndex],correct=responses[0]?.distance===target;
  const block=Math.floor(training.checkIndex/10);
  training.checks[block].push({distance:target,response:responses[0]?.distance,correct});
  record('check-response',{cue:state.cue,index:training.checkIndex,target,response:responses[0],correct});
  training.checkIndex++;stopPlayback();phase='check-transition';syncControls();
  phaseTimer=setTimeout(()=>{if(mode!=='test')return;if(training.checkIndex===20)learningResult();else nextCheck();},180);
  return;
 }
 const score=scoreScene(state.objects,responses);
 record('trial-complete',{trial:trialNumber,responses,score,durationMs:performance.now()-trialStart});
 stopPlayback();phase='feedback';pendingBearing=null;pointer=null;lowVisibility=false;state={...state,heading:0,mainView:'radar'};
 announce(`${score.correct} of ${state.count} exact grid positions. Next trial in three seconds.`);syncControls();
 phaseTimer=setTimeout(startTrial,3000);
}
function movePointer(event){
 if(!isResponse())return;
 const box=$('responses').getBoundingClientRect();pointer={x:event.clientX-box.left,y:event.clientY-box.top};render();
}
function placeResponse(event){
 if(!isResponse()||responses.length>=state.count)return;
 movePointer(event);const draft=draftResponse();if(!draft)return;
 if(pendingBearing===null){pendingBearing=draft.bearing;syncControls();return;}
 const answer={bearing:pendingBearing,distance:draft.distance,atMs:performance.now()-trialStart};
 responses=[...responses,answer];pendingBearing=null;pointer=null;
 record('response',{trial:trialNumber,phase,...answer});syncControls();
 if(responses.length===state.count)finishResponse();
}
function undo(){
 if(!isResponse())return;
 if(pendingBearing!==null)pendingBearing=null;else responses=responses.slice(0,-1);
 pointer=null;syncControls();
}
for(const [key,button]of Object.entries(controls))button.addEventListener('click',()=>{if(mode!=='sandbox')return;state=cycle(state,key);configurationChanged();});
$('shuffle').addEventListener('click',()=>{if(mode!=='sandbox')return;held.clear();state=shuffle(state);configurationChanged();});
sound.addEventListener('click',()=>void soundAction());
visibility.addEventListener('click',()=>{if(mode!=='sandbox')return;lowVisibility=!lowVisibility;syncControls();});
for(const view of ['pov','radar'])$(`${view}View`).querySelector('button').addEventListener('click',()=>{if(mode!=='sandbox')return;state={...state,mainView:view};syncControls();});
$('learningNext').addEventListener('click',()=>resultAction?.());
$('skipLearning').addEventListener('click',()=>{record('learning-skipped',{cue:state.cue,phase});startTrial();});
$('finish').addEventListener('click',finishResponse);$('undo').addEventListener('click',undo);
$('responses').addEventListener('pointermove',movePointer);$('responses').addEventListener('pointerdown',event=>{if(event.button===0){event.preventDefault();placeResponse(event);}});
$('responses').addEventListener('pointerleave',()=>{pointer=null;render();});
for(const range of DISTANCES){const b=document.createElement('button');b.type='button';b.textContent=`${range.toFixed(1)} m`;b.dataset.distance=String(range);b.addEventListener('click',()=>selectReference(range));$('referenceDistances').append(b);}
window.addEventListener('keydown',event=>{
 if(event.target.matches('input,textarea,select,[contenteditable="true"]')||event.ctrlKey||event.metaKey||event.altKey)return;
 const key=event.key.toLowerCase();
 if(!event.repeat&&/^[a-z]$/.test(key)){
  const now=performance.now();command=now-commandTime>1800?key:(command+key).slice(-5);commandTime=now;
  if(command.endsWith('test')){command='';startTest();return;}if(command.endsWith('stop')){command='';stopTest();return;}if(command==='learn'){command='';startLearning();return;}
 }
 if(['q','e','arrowleft','arrowright'].includes(key)&&!['feedback','result','check-transition'].includes(phase)){
  event.preventDefault();if(!held.has(key)){state=rotate(state,(['q','arrowleft'].includes(key)?-1:1)*Math.PI/36);audio.update(state);render();}held.add(key);
 }
 if(event.code==='Space'&&!event.repeat&&((mode==='test'&&!event.target.closest('#learningPanel'))||!event.target.closest('button:not(#sound)'))){event.preventDefault();void soundAction();}
 if(key==='r'&&!event.repeat&&mode==='sandbox'){state={...state,mainView:state.mainView==='pov'?'radar':'pov'};syncControls();}
 if(key==='backspace'&&isResponse()){event.preventDefault();undo();}
 if(key==='escape'&&pendingBearing!==null){pendingBearing=null;pointer=null;syncControls();}
});
window.addEventListener('keyup',event=>held.delete(event.key.toLowerCase()));
window.addEventListener('blur',()=>held.clear());
document.addEventListener('visibilitychange',()=>{if(document.hidden){held.clear();stopPlayback();clearPhaseTimer();armed=false;if(mode==='test'){stopTest();announce('Test stopped because the page was hidden.');}else syncControls();}});
window.addEventListener('pagehide',()=>{armed=false;stopPlayback();clearPhaseTimer();});
new ResizeObserver(render).observe($('viewport'));
let previous=performance.now();
function frame(now){
 const dt=Math.min(.05,(now-previous)/1000);previous=now;
 const left=held.has('q')||held.has('arrowleft'),right=held.has('e')||held.has('arrowright');
 if(left!==right){state=rotate(state,(right?1:-1)*dt*1.1);audio.update(state);render();}
 requestAnimationFrame(frame);
}
audio.update(state);syncControls();requestAnimationFrame(frame);
