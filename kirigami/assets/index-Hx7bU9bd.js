(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Wd=1;function xr(n){if(!$d(n))return[ft("TOPOLOGY_SCHEMA_UNSUPPORTED","Value does not have the required cell-complex collections.",[])];if(n.schemaVersion!==Wd)return[ft("TOPOLOGY_SCHEMA_UNSUPPORTED",`Topology schema version ${String(n.schemaVersion)} is not supported.`,[])];const e=Xd(n);if(e)return[ft("TOPOLOGY_DUPLICATE_ID",`Entity ID ${e.id} is not unique.`,[e])];const t=[],i=new Map(n.vertices.map(l=>[l.id,l])),s=new Map(n.halfEdges.map(l=>[l.id,l])),r=new Map(n.edges.map(l=>[l.id,l])),a=new Map(n.faces.map(l=>[l.id,l])),o=new Map(n.cutPairs.map(l=>[l.id,l]));for(const l of n.vertices)(l.position.length!==2||!l.position.every(c=>Number.isFinite(c)))&&t.push(ft("TOPOLOGY_INVALID_NUMBER","Vertex coordinates must be finite two-dimensional values.",[nt("vertex",l.id)]));for(const l of n.halfEdges){Hi(t,i,"vertex",l.origin,l),Hi(t,s,"halfEdge",l.next,l),Hi(t,r,"edge",l.edge,l),Hi(t,a,"face",l.face,l),l.twin!==void 0&&Hi(t,s,"halfEdge",l.twin,l);const c=r.get(l.edge);c&&!c.halfEdges.includes(l.id)&&t.push(ft("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[nt("halfEdge",l.id),nt("edge",c.id)]))}for(const l of n.edges)Yd(l,s,t);for(const l of n.faces){Ko(l,l.boundary,"boundary",s,t);for(const c of l.holes)Ko(l,c,"hole",s,t)}for(const l of n.cutPairs)Zd(l,r,t);for(const l of n.edges.filter(c=>c.kind==="cutBank")){const c=l.cutBank?o.get(l.cutBank.pair):void 0;(!c||!c.banks.includes(l.id))&&t.push(ft("TOPOLOGY_CUT_PAIR_INVALID","Each cut bank must reference a cut pair that lists that edge.",[nt("edge",l.id)]))}return Kd(n,a,t),t}function $d(n){if(typeof n!="object"||n===null)return!1;const e=n;return Array.isArray(e.vertices)&&e.vertices.every(t=>hi(t)&&Array.isArray(t.position)&&t.position.length===2)&&Array.isArray(e.halfEdges)&&e.halfEdges.every(t=>hi(t)&&typeof t.origin=="string"&&typeof t.next=="string"&&typeof t.edge=="string"&&typeof t.face=="string")&&Array.isArray(e.edges)&&e.edges.every(t=>hi(t)&&Array.isArray(t.halfEdges)&&typeof t.kind=="string")&&Array.isArray(e.faces)&&e.faces.every(t=>hi(t)&&typeof t.boundary=="string"&&Array.isArray(t.holes))&&Array.isArray(e.cutPairs)&&e.cutPairs.every(t=>hi(t)&&Array.isArray(t.banks))&&Array.isArray(e.materialComponents)&&e.materialComponents.every(t=>hi(t)&&Array.isArray(t.faces))}function hi(n){return typeof n=="object"&&n!==null&&typeof n.id=="string"}function Xd(n){const e=new Set,t=[["vertex",n.vertices],["halfEdge",n.halfEdges],["edge",n.edges],["face",n.faces],["cutPair",n.cutPairs],["materialComponent",n.materialComponents]];for(const[i,s]of t)for(const r of s){if(e.has(r.id))return nt(i,r.id);e.add(r.id)}}function Hi(n,e,t,i,s){e.has(i)||n.push(ft("TOPOLOGY_MISSING_REFERENCE",`Half-edge ${s.id} references missing ${t} ${i}.`,[nt("halfEdge",s.id),nt(t,i)]))}function Yd(n,e,t){const i=n.kind==="hinge"||n.kind==="joined"||n.kind==="flatSeam",s=i?2:1;n.halfEdges.length!==s&&t.push(ft("TOPOLOGY_EDGE_CARDINALITY",`Edge kind ${n.kind} requires ${s} half-edge(s).`,[nt("edge",n.id)]));const r=n.halfEdges.map(a=>e.get(a)).filter(a=>a!==void 0);if(r.some(a=>a.edge!==n.id)&&t.push(ft("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[nt("edge",n.id)])),i&&r.length===2){const[a,o]=r;(a.twin!==o.id||o.twin!==a.id)&&t.push(ft("TOPOLOGY_TWIN_MISMATCH","Two-sided edge half-edges must be symmetric twins.",[nt("edge",n.id),nt("halfEdge",a.id),nt("halfEdge",o.id)]));const l=e.get(a.next)?.origin,c=e.get(o.next)?.origin;l!==void 0&&c!==void 0&&(a.origin!==c||o.origin!==l)&&t.push(ft("TOPOLOGY_TWIN_ORIENTATION","Twin half-edges must traverse the shared edge in opposite directions.",[nt("edge",n.id),nt("halfEdge",a.id),nt("halfEdge",o.id)]))}else!i&&r.some(a=>a.twin!==void 0)&&t.push(ft("TOPOLOGY_TWIN_MISMATCH","One-sided boundary and cut-bank half-edges cannot have twins.",[nt("edge",n.id)]));qd(n,t)}function qd(n,e){if(n.kind==="hinge"){if(!n.hinge){e.push(ft("TOPOLOGY_HINGE_SPEC_INVALID","A hinge edge requires a hinge specification.",[nt("edge",n.id)]));return}const[i,s]=n.hinge.angleRange;(![i,s,n.hinge.restAngle].every(Number.isFinite)||i>s||n.hinge.restAngle<i||n.hinge.restAngle>s)&&e.push(ft("TOPOLOGY_HINGE_INTERVAL_INVALID","Hinge angle bounds must be finite, ordered, and contain the rest angle.",[nt("edge",n.id)]))}else n.hinge!==void 0&&e.push(ft("TOPOLOGY_HINGE_SPEC_INVALID","Only hinge edges may carry hinge specifications.",[nt("edge",n.id)]));const t=n.cutBank!==void 0;n.kind==="cutBank"!==t&&e.push(ft("TOPOLOGY_CUT_PAIR_INVALID","Cut-bank metadata is required exactly on cut-bank edges.",[nt("edge",n.id)]))}function Ko(n,e,t,i,s){const r=new Set;let a=e;for(;!r.has(a);){r.add(a);const o=i.get(a);if(!o||o.face!==n.id){s.push(Jo(n,t));return}a=o.next}(a!==e||r.size<3)&&s.push(Jo(n,t))}function Jo(n,e){return ft("TOPOLOGY_FACE_LOOP_OPEN",`Face ${e} must form a closed loop of at least three half-edges.`,[nt("face",n.id)])}function Zd(n,e,t){const[i,s]=n.banks,r=e.get(i),a=e.get(s);i!==s&&r?.kind==="cutBank"&&a?.kind==="cutBank"&&r.cutBank?.pair===n.id&&a.cutBank?.pair===n.id&&new Set([r.cutBank.bank,a.cutBank.bank]).size===2||t.push(ft("TOPOLOGY_CUT_PAIR_INVALID","A cut pair requires two distinct cut-bank edges labeled a and b.",[nt("cutPair",n.id)]))}function Kd(n,e,t){const i=new Map;for(const r of n.materialComponents)for(const a of r.faces)i.set(a,(i.get(a)??0)+1),e.has(a)||t.push(ft("TOPOLOGY_MISSING_REFERENCE",`Material component ${r.id} references missing face ${a}.`,[nt("materialComponent",r.id),nt("face",a)]));for(const r of n.faces)i.get(r.id)!==1&&t.push(ft("TOPOLOGY_COMPONENT_INVALID","Every face must belong to exactly one material component.",[nt("face",r.id)]));const s=new Map;for(const r of n.edges){if(!["hinge","joined","flatSeam"].includes(r.kind)||r.halfEdges.length!==2)continue;const a=r.halfEdges.map(c=>n.halfEdges.find(u=>u.id===c)).filter(c=>c!==void 0);if(a.length!==2||a[0].face===a[1].face)continue;const[o,l]=a.map(c=>c.face);s.get(o)?.add(l)??s.set(o,new Set([l])),s.get(l)?.add(o)??s.set(l,new Set([o]))}for(const r of n.materialComponents){const a=r.faces.filter(c=>e.has(c));if(a.length<2)continue;const o=new Set([a[0]]),l=[a[0]];for(;l.length>0;){const c=l.shift();for(const u of s.get(c)??[])a.includes(u)&&!o.has(u)&&(o.add(u),l.push(u))}o.size!==a.length&&t.push(ft("TOPOLOGY_COMPONENT_INVALID",`Material component ${r.id} contains disconnected faces; cut banks cannot substitute for a sheet connection.`,[nt("materialComponent",r.id)]))}}function ft(n,e,t){return{severity:"error",category:"topology",code:n,message:e,locations:t.length>0?t.map(i=>({kind:"entity",entity:i})):[{kind:"nonSpatial",reason:"Topology schema root."}],entities:t}}function nt(n,e){return{kind:n,id:e}}const Li={absoluteLength:1e-9,absoluteAngle:1e-9,relativeRank:1e-10};function Pc(n,e){const t=n.vertices.find(r=>r.id===e);if(!t)return{applicability:"notApplicable",reason:`Vertex ${e} does not exist.`};const i=n.edges.map(r=>({edge:r,endpoints:Qd(n,r)})).filter(({endpoints:r})=>r.includes(e));if(i.length===0)return{applicability:"notApplicable",reason:"Vertex has no incident material edges."};if(i.some(({edge:r})=>r.kind!=="hinge"||!r.hinge))return{applicability:"notApplicable",reason:"Classical single-vertex tests do not apply to non-hinge incidence."};const s=i.map(({edge:r,endpoints:a})=>{const o=a[0]===e?a[1]:a[0],l=n.vertices.find(h=>h.id===o);if(!l||!r.hinge)throw new Error("Validated incident edge is missing geometry.");const c=l.position[0]-t.position[0],u=l.position[1]-t.position[1];if(!(Math.hypot(c,u)<=Li.absoluteLength))return{edgeId:r.id,directionAngle:Math.atan2(u,c),assignment:r.hinge.assignment}}).filter(r=>r!==void 0).sort((r,a)=>r.directionAngle-a.directionAngle);if(s.length!==i.length||s.length<2)return{applicability:"notApplicable",reason:"Crease rays must be nondegenerate."};for(let r=0;r<s.length;r+=1){const a=s[(r+1)%s.length];if((r===s.length-1?a.directionAngle+Math.PI*2-s[r].directionAngle:a.directionAngle-s[r].directionAngle)<=Li.absoluteAngle)return{applicability:"notApplicable",reason:"Crease rays must have distinct directions."}}return{applicability:"applicable",rays:s,sectorAngles:s.map((r,a)=>{const o=s[(a+1)%s.length];return a===s.length-1?o.directionAngle+Math.PI*2-r.directionAngle:o.directionAngle-r.directionAngle})}}function Jd(n,e){const t=Pc(n,e);return t.applicability==="notApplicable"?t:{applicability:"applicable",rays:t.rays,sectorAngles:t.sectorAngles,...Ic(t.sectorAngles,t.rays.map(i=>i.assignment))}}function Ic(n,e,t=Li.absoluteAngle){if(n.length!==e.length||n.length<2||n.some(f=>!Number.isFinite(f)||f<=0)){const f={status:"failed",reason:"Sector angles and assignments must be finite matching arrays."};return{kawasaki:f,maekawa:f,locallyFlatFoldable:!1}}const i=n.length%2!==0,s=n.reduce((f,m,_)=>(f[_%2]+=m,f),[0,0]),r=s[0]+s[1],a=Math.max(Math.abs(s[0]-Math.PI),Math.abs(s[1]-Math.PI),Math.abs(r-Math.PI*2)),o={status:!i&&a<=t?"satisfied":"failed",residual:a,...i?{reason:"Kawasaki requires even crease degree."}:{}},l=e.every(f=>f==="mountain"||f==="valley"),c=e.filter(f=>f==="mountain").length,u=e.filter(f=>f==="valley").length,h=Math.abs(Math.abs(c-u)-2),d=l?{status:h===0?"satisfied":"failed",residual:h}:{status:"notApplicable",reason:"Maekawa requires a complete mountain/valley assignment."};return{kawasaki:o,maekawa:d,locallyFlatFoldable:o.status==="satisfied"&&d.status==="satisfied"}}function Qd(n,e){const t=n.halfEdges.find(s=>s.id===e.halfEdges[0]),i=t?n.halfEdges.find(s=>s.id===t.next):void 0;if(!t||!i)throw new Error(`Edge ${e.id} has incomplete half-edge topology.`);return[t.origin,i.origin]}function jd(n,e=16){if(n.length<2||n.length>e||n.some(r=>!Number.isFinite(r)||r<=0))return{applicable:!1,candidateAssignments:[],locallyFlatFoldableAssignments:[],truncated:!1,reason:"Vertex degree is outside the bounded enumeration domain."};const t=2**n.length,i=[],s=[];for(let r=0;r<t;r+=1){const a=n.map((l,c)=>(r>>c&1)===0?"mountain":"valley");i.push(a),Ic(n,a).locallyFlatFoldable&&s.push(a)}return{applicable:!0,candidateAssignments:i,locallyFlatFoldableAssignments:s,truncated:!1}}function eu(n){const e=n.edges.filter(r=>r.kind==="cutBank"),t=new Set(n.cutPairs.flatMap(r=>r.banks)),i=e.map(r=>r.id).filter(r=>!t.has(r)),s=n.cutPairs.filter(r=>r.banks.length!==2||r.banks[0]===r.banks[1]?!0:r.banks.some(a=>{const o=n.edges.find(l=>l.id===a);return o?.kind!=="cutBank"||o.cutBank?.pair!==r.id})).map(r=>r.id);return{certified:i.length===0&&s.length===0,cutPairIds:n.cutPairs.map(r=>r.id),unpairedCutBankIds:i,invalidCutPairIds:s}}function Dc(n){const e=n.edges.filter(t=>t.kind==="hinge"&&t.hinge?.assignment==="unassigned").map(t=>t.id);return{complete:e.length===0,unassignedHingeIds:e}}function Lc(n){const e=n.vertices.flatMap(a=>{const o=Jd(n,a.id);return o.applicability==="applicable"?[{vertexId:a.id,analysis:o,counting:jd(o.sectorAngles)}]:[]}),t=Nc(n),i=Dc(n),s=tu(n),r=t.colorable&&i.complete&&s&&e.every(({analysis:a})=>a.locallyFlatFoldable);return{applicability:"local-gates-only",faceTwoColorability:t,mountainValley:i,localVertices:e,materialConnected:s,necessaryGatesSatisfied:r,globalProof:"unsupported"}}function tu(n){if(n.faces.length<=1)return!0;const e=new Map(n.faces.map(s=>[s.id,new Set]));for(const s of n.edges){if(!["hinge","joined","flatSeam"].includes(s.kind)||s.halfEdges.length!==2)continue;const r=s.halfEdges.map(a=>n.halfEdges.find(o=>o.id===a)?.face);r[0]&&r[1]&&r[0]!==r[1]&&(e.get(r[0])?.add(r[1]),e.get(r[1])?.add(r[0]))}const t=new Set,i=[n.faces[0].id];for(;i.length;){const s=i.shift();t.has(s)||(t.add(s),i.push(...e.get(s)??[]))}return t.size===n.faces.length}function Nc(n){const e=new Map(n.faces.map(i=>[i.id,new Set]));for(const i of n.edges){if(i.halfEdges.length!==2)continue;const s=i.halfEdges.map(r=>n.halfEdges.find(a=>a.id===r)).filter(r=>r!==void 0);s.length!==2||s[0].face===s[1].face||(e.get(s[0].face)?.add(s[1].face),e.get(s[1].face)?.add(s[0].face))}const t=new Map;for(const i of n.faces){if(t.has(i.id))continue;t.set(i.id,0);const s=[i.id];for(;s.length>0;){const r=s.shift(),a=t.get(r);for(const o of e.get(r)??[]){const l=a===0?1:0,c=t.get(o);if(c!==void 0){if(c!==l)return{colorable:!1,colors:t,conflict:[r,o]};continue}t.set(o,l),s.push(o)}}}return{colorable:!0,colors:t}}function Uc(n){const e=nu(n);if(e)return{ok:!1,diagnostics:[e]};const t=n.stepCount*2+2,i=[],s=[],r=[],a=[],o=[],l=[],c=[],u=[],h=[],d=(n.hostWidth-n.width)/2,f=[0,d,d+n.width,n.hostWidth],m=t*n.stepRun,_=n.hostFloorExtent+n.hostWallExtent,g=-n.hostFloorExtent+(_-m)/2;for(let E=0;E<=t;E+=1)for(let C=0;C<f.length;C+=1)i.push({id:`v:${E}:${C}`,position:[f[C],g+E*n.stepRun]});for(let E=0;E<t;E+=1)for(let C=0;C<3;C+=1){const P=C===1?`stair-face:${E}`:`host-face:${E}:${C}`,I=`he:${E}:${C}:bottom`,X=`he:${E}:${C}:right`,W=`he:${E}:${C}:top`,U=`he:${E}:${C}:left`;r.push({id:I,origin:`v:${E}:${C}`,next:X,edge:"pending",face:P},{id:X,origin:`v:${E}:${C+1}`,next:W,edge:"pending",face:P},{id:W,origin:`v:${E+1}:${C+1}`,next:U,edge:"pending",face:P},{id:U,origin:`v:${E+1}:${C}`,next:I,edge:"pending",face:P}),s.push({id:P,boundary:I,holes:[]});const G=C!==1||E===0?"host":E===t-1?"bridge":E%2===1?"step":"bridge";l.push({faceId:P,operationId:n.operationId,role:G})}const p=new Map(r.map(E=>[E.id,E])),b=(E,C)=>{for(const P of E)p.get(P).edge=C.id;E.length===2&&(p.get(E[0]).twin=E[1],p.get(E[1]).twin=E[0]),a.push(C),c.push({edgeId:C.id,operationId:n.operationId})};for(let E=0;E<3;E+=1){b([`he:0:${E}:bottom`],{id:`boundary:bottom:${E}`,halfEdges:[`he:0:${E}:bottom`],kind:"boundary"}),b([`he:${t-1}:${E}:top`],{id:`boundary:top:${E}`,halfEdges:[`he:${t-1}:${E}:top`],kind:"boundary"});for(let C=1;C<t;C+=1){const P=[`he:${C-1}:${E}:top`,`he:${C}:${E}:bottom`];if(E===1){const I=C%2===0?"valley":"mountain";b(P,{id:`hinge:${C-1}`,halfEdges:P,kind:"hinge",hinge:{assignment:I,restAngle:0,angleRange:I==="valley"?[0,Math.PI]:[-Math.PI,0]}})}else C===t/2?b(P,{id:`host-hinge:${E}`,halfEdges:P,kind:"hinge",hinge:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}):b(P,{id:`seam:h:${C}:${E}`,halfEdges:P,kind:"flatSeam"})}}for(let E=0;E<t;E+=1){b([`he:${E}:0:left`],{id:`boundary:left:${E}`,halfEdges:[`he:${E}:0:left`],kind:"boundary"}),b([`he:${E}:2:right`],{id:`boundary:right:${E}`,halfEdges:[`he:${E}:2:right`],kind:"boundary"});for(let C=1;C<=2;C+=1){const P=`he:${E}:${C-1}:right`,I=`he:${E}:${C}:left`;if(E===0||E===t-1){b([P,I],{id:`seam:v:${E}:${C}`,halfEdges:[P,I],kind:"flatSeam"});continue}const W=`cut:${E}:${C}`,U=`${W}:a`,G=`${W}:b`;b([P],{id:U,halfEdges:[P],kind:"cutBank",cutBank:{pair:W,bank:"a"}}),b([I],{id:G,halfEdges:[I],kind:"cutBank",cutBank:{pair:W,bank:"b"}}),o.push({id:W,banks:[U,G]});const V=Math.min(n.stepCount-1,Math.floor((E-1)/2));u.push({cutPairId:W,operationId:n.operationId,stepIndex:V}),E%2===1&&E<t-1&&h.push({voidId:`void:${E}:${C}`,stepIndex:V,cutPairIds:[W]})}}const w={schemaVersion:1,vertices:i,halfEdges:r,edges:a,faces:s,cutPairs:o,materialComponents:[{id:`stair-material:${n.operationId}`,faces:s.map(E=>E.id)}]},v=xr(w);if(v.length>0)return{ok:!1,diagnostics:v};if(!Nc(w).colorable)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_FLAT_COLORING_FAILED",message:"The stair crease graph is not two-colorable and cannot represent a flat origami sheet.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]};if(!Lc(w).materialConnected)return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:"The generated stair material is disconnected across its crease graph.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]};const T=Dc(w);if(!T.complete)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_ASSIGNMENT_MISMATCH",message:`Flat stair crease graph has unassigned hinges: ${T.unassignedHingeIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]};const M=eu(w);return M.certified?{ok:!0,complex:w,sourceMap:{operationId:n.operationId,host:{plane:n.hostPlane??"wall",width:n.hostWidth,extent:n.hostPlane==="floor"?n.hostFloorExtent:n.hostWallExtent},faces:l,edges:c,cutPairs:u,voids:h}}:{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_CUT_PAIR_INVALID",message:`Stair cut graph contains unpaired cut banks: ${M.unpairedCutBankIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]}}function nu(n){return typeof n.operationId=="string"&&n.operationId.length>0&&Number.isFinite(n.width)&&n.width>0&&Number.isInteger(n.stepCount)&&n.stepCount>0&&Number.isFinite(n.stepRun)&&n.stepRun>0&&Number.isFinite(n.stepRise)&&n.stepRise>0&&n.stepRun===n.stepRise&&Number.isFinite(n.hostWidth)&&n.hostWidth>=n.width&&Number.isFinite(n.hostFloorExtent)&&n.hostFloorExtent>=n.stepCount*n.stepRun&&Number.isFinite(n.hostWallExtent)&&n.hostWallExtent>=n.stepCount*n.stepRise?void 0:{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:n.stepRun!==n.stepRise?"Certified stairs require equal step run and rise.":"Stair dimensions must be positive and fit within the host sheet bounds.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId||"unknown"}}],entities:[{kind:"spatialOperation",id:n.operationId||"unknown"}]}}function Fc(n,e){return[n[0]+e[0],n[1]+e[1],n[2]+e[2]]}function Gn(n,e){return[n[0]-e[0],n[1]-e[1],n[2]-e[2]]}function Oc(n,e){return[n[0]*e,n[1]*e,n[2]*e]}function ht(n,e){return n[0]*e[0]+n[1]*e[1]+n[2]*e[2]}function Bc(n,e){return[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]]}function ls(n){return Math.hypot(n[0],n[1],n[2])}function kc(n){const e=ls(n);if(!Number.isFinite(e)||e===0)throw new RangeError("Axis must be finite and nonzero.");return Oc(n,1/e)}function vr(n,e){return[ht(n[0],e),ht(n[1],e),ht(n[2],e)]}function iu(n,e){const t=a=>[e[0][a],e[1][a],e[2][a]],i=t(0),s=t(1),r=t(2);return[[ht(n[0],i),ht(n[0],s),ht(n[0],r)],[ht(n[1],i),ht(n[1],s),ht(n[1],r)],[ht(n[2],i),ht(n[2],s),ht(n[2],r)]]}function Ct(n,e){return Fc(vr(n.rotation,e),n.translation)}function bn(n,e){return{rotation:iu(n.rotation,e.rotation),translation:Fc(vr(n.rotation,e.translation),n.translation)}}function ar(n){const e=[[n.rotation[0][0],n.rotation[1][0],n.rotation[2][0]],[n.rotation[0][1],n.rotation[1][1],n.rotation[2][1]],[n.rotation[0][2],n.rotation[1][2],n.rotation[2][2]]];return{rotation:e,translation:Oc(vr(e,n.translation),-1)}}function su(n,e){if(!Number.isFinite(e))throw new RangeError("Rotation angle must be finite.");const[t,i,s]=kc(n),r=Math.cos(e),a=Math.sin(e),o=1-r;return[[r+t*t*o,t*i*o-s*a,t*s*o+i*a],[i*t*o+s*a,r+i*i*o,i*s*o-t*a],[s*t*o-i*a,s*i*o+t*a,r+s*s*o]]}function Ni(n,e,t){const i=su(e,t);return{rotation:i,translation:Gn(n,vr(i,n))}}function ru(n){if(![...n.rotation[0],...n.rotation[1],...n.rotation[2],...n.translation].every(Number.isFinite))return Number.POSITIVE_INFINITY;const[t,i,s]=n.rotation;return Math.max(Math.abs(ht(t,t)-1),Math.abs(ht(i,i)-1),Math.abs(ht(s,s)-1),Math.abs(ht(t,i)),Math.abs(ht(t,s)),Math.abs(ht(i,s)),Math.abs(ht(t,Bc(i,s))-1))}function _o(n,e=1e-9){const t=ru(n);return Number.isFinite(t)&&t<=e}function au(n,e,t=1e-9){const i=new Map(e.facePoses.map(o=>[o.faceId,o])),s=new Set;for(const o of n.edges){if(o.halfEdges.length!==2)continue;const l=o.halfEdges.map(c=>n.halfEdges.find(u=>u.id===c));!l[0]||!l[1]||l[0].face===l[1].face||s.add(Qo(l[0].face,l[1].face))}const r=n.faces.flatMap(o=>{const l=i.get(o.id);if(!l)return[];const c=ou(n,o).map(h=>Ct(l.transform,h));if(c.length<3)return[];const u=kc(Bc(Gn(c[1],c[0]),Gn(c[2],c[0])));return[{face:o,points:c,normal:u}]}),a=[];for(let o=0;o<r.length;o+=1)for(let l=o+1;l<r.length;l+=1){const c=r[o],u=r[l];if(s.has(Qo(c.face.id,u.face.id))||Math.abs(Math.abs(ht(c.normal,u.normal))-1)>t||Math.abs(ht(c.normal,Gn(u.points[0],c.points[0])))>t)continue;const h=lu(c.normal),d=c.points.map(m=>jo(m,h)),f=u.points.map(m=>jo(m,h));cu(d,f,t)&&a.push({firstFaceId:c.face.id,secondFaceId:u.face.id})}return a}function ou(n,e){const t=[];let i=e.boundary;const s=new Set;for(;!s.has(i);){s.add(i);const r=n.halfEdges.find(o=>o.id===i);if(!r)break;const a=n.vertices.find(o=>o.id===r.origin);if(!a)break;t.push([a.position[0],a.position[1],0]),i=r.next}return t}function Qo(n,e){return[n,e].sort().join("::")}function lu(n){const e=n.map(Math.abs);return e[0]>=e[1]&&e[0]>=e[2]?0:e[1]>=e[2]?1:2}function jo(n,e){return e===0?[n[1],n[2]]:e===1?[n[0],n[2]]:[n[0],n[1]]}function cu(n,e,t){const i=el(n),s=el(e);if(Math.min(i.maxX,s.maxX)-Math.max(i.minX,s.minX)>t&&Math.min(i.maxY,s.maxY)-Math.max(i.minY,s.minY)>t||n.some(a=>Ms(a,e,t))||e.some(a=>Ms(a,n,t)))return!0;const r=a=>[a.reduce((o,l)=>o+l[0],0)/a.length,a.reduce((o,l)=>o+l[1],0)/a.length];if(Ms(r(n),e,t)||Ms(r(e),n,t))return!0;for(let a=0;a<n.length;a+=1){const o=n[a],l=n[(a+1)%n.length];for(let c=0;c<e.length;c+=1){const u=e[c],h=e[(c+1)%e.length];if(du(o,l,u,h,t))return!0}}return!1}function el(n){return{minX:Math.min(...n.map(e=>e[0])),maxX:Math.max(...n.map(e=>e[0])),minY:Math.min(...n.map(e=>e[1])),maxY:Math.max(...n.map(e=>e[1]))}}function Ms(n,e,t){let i=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const a=e[s],o=e[r];if(Math.abs(es(Yt(o,a),Yt(n,a)))<=t&&uu(Yt(n,a),Yt(n,o))<=t)return!1;a[1]>n[1]!=o[1]>n[1]&&n[0]<(o[0]-a[0])*(n[1]-a[1])/(o[1]-a[1])+a[0]&&(i=!i)}return i}function du(n,e,t,i,s){const r=es(Yt(e,n),Yt(t,n)),a=es(Yt(e,n),Yt(i,n)),o=es(Yt(i,t),Yt(n,t)),l=es(Yt(i,t),Yt(e,t));return(r>s&&a<-s||r<-s&&a>s)&&(o>s&&l<-s||o<-s&&l>s)}function Yt(n,e){return[n[0]-e[0],n[1]-e[1]]}function es(n,e){return n[0]*e[1]-n[1]*e[0]}function uu(n,e){return n[0]*e[0]+n[1]*e[1]}function Hn(){return{rotation:[[1,0,0],[0,1,0],[0,0,1]],translation:[0,0,0]}}function hu(n,e,t=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY){if(e.length<2)return fu("A folding map requires at least two ordered samples.");const s=n.faces.map(c=>c.id);let r=!0,a=!0,o=0,l=0;for(const c of e){const u=new Map(c.facePoses.map(h=>[h.faceId,h.transform]));for(const h of s){const d=u.get(h);(!d||!_o(d))&&(r=!1)}}for(let c=1;c<e.length;c+=1){const u=new Map(e[c-1].facePoses.map(_=>[_.faceId,_.transform])),h=new Map(e[c].facePoses.map(_=>[_.faceId,_.transform])),d=e[c-1].parameterValues.find(_=>_.parameterId==="deployment")?.value,f=e[c].parameterValues.find(_=>_.parameterId==="deployment")?.value,m=f!==void 0&&d!==void 0?Math.abs(f-d):0;for(const _ of n.faces){const g=u.get(_.id),p=h.get(_.id);if(!g||!p){a=!1;continue}let b=_.boundary;const w=new Set;for(;!w.has(b);){w.add(b);const v=n.halfEdges.find(S=>S.id===b),A=v?n.vertices.find(S=>S.id===v.origin):void 0;if(A){const S=[A.position[0],A.position[1],0];o=Math.max(o,ls(Gn(Ct(p,S),Ct(g,S)))),m>0&&(l=Math.max(l,o/m))}if(!v)break;b=v.next}}}return a=a&&(!Number.isFinite(t)||o<=t),{applicable:!0,continuous:a,rigid:r,sampleCount:e.length,uniformDisplacementResidual:o,maximumDisplacementRate:l,rateBounded:!Number.isFinite(i)||l<=i}}function fu(n){return{applicable:!1,continuous:!1,rigid:!1,sampleCount:0,uniformDisplacementResidual:Number.POSITIVE_INFINITY,maximumDisplacementRate:Number.POSITIVE_INFINITY,rateBounded:!1,reason:n}}function pu(n,e=Li.relativeRank){if(!Number.isFinite(e)||e<0)throw new RangeError("Rank tolerance must be finite and non-negative.");if(n.length===0)return{rank:0,threshold:0,acceptedPivots:[],rejectedMaximum:0};const t=n[0].length;if(n.some(c=>c.length!==t||c.some(u=>!Number.isFinite(u))))throw new RangeError("Rank matrix must be finite and rectangular.");const i=n.map(c=>[...c]),r=Math.max(0,...i.flat().map(c=>Math.abs(c)))*Math.max(n.length,t)*e,a=[];let o=0,l=0;for(let c=0;c<t&&l<i.length;c+=1){let u=l,h=Math.abs(i[u][c]);for(let f=l+1;f<i.length;f+=1){const m=Math.abs(i[f][c]);m>h&&(h=m,u=f)}if(h<=r){o=Math.max(o,h);continue}[i[l],i[u]]=[i[u],i[l]];const d=i[l][c];a.push(Math.abs(d));for(let f=c;f<t;f+=1)i[l][f]/=d;for(let f=0;f<i.length;f+=1){if(f===l)continue;const m=i[f][c];for(let _=c;_<t;_+=1)i[f][_]-=m*i[l][_]}l+=1}return{rank:l,threshold:r,acceptedPivots:a,rejectedMaximum:o}}function mu(n,e,t={}){if(!Number.isInteger(e)||e<0)throw new RangeError("Variable count must be a non-negative integer.");const i=pu(n,t.relativeTolerance??Li.relativeRank),s=t.expectedRank;if(s!==void 0&&(!Number.isInteger(s)||s<0||s>e))throw new RangeError("Expected rank must fit the variable count.");return{...i,variableCount:e,dof:e-i.rank,...s===void 0?{}:{expectedRank:s},singular:s!==void 0&&i.rank<s}}function gu(n,e,t=n.map(()=>0)){return Vc(n,e,t),n.reduce((i,s,r)=>{const a=Ni([0,0,0],[0,0,1],e[r]),o=Ni([0,0,0],[1,0,0],s),l={rotation:Hn().rotation,translation:[t[r],0,0]},c=bn(a,bn(l,o));return bn(i,c)},Hn())}function tl(n,e,t){const i=gu(n,e,t),s=Hn(),r=[];for(let a=0;a<3;a+=1)for(let o=0;o<3;o+=1)r.push(i.rotation[o][a]-s.rotation[o][a]);return r.push(...i.translation),r}function _u(n,e,t,i=1e-6){if(!Number.isFinite(i)||i<=0)throw new RangeError("Finite-difference step must be positive and finite.");Vc(n,e,n.map(()=>0));const s=e.map((r,a)=>{const o=[...e],l=[...e];o[a]+=i,l[a]-=i;const c=tl(n,o,t),u=tl(n,l,t);return c.map((h,d)=>(h-u[d])/(2*i))});return Array.from({length:12},(r,a)=>s.map(o=>o[a]))}function Vc(n,e,t){if(n.length===0||n.length!==e.length||n.length!==t.length)throw new RangeError("Sector and fold-angle arrays must have equal nonzero length.");if(n.some(i=>!Number.isFinite(i)||i<=0)||e.some(i=>!Number.isFinite(i))||t.some(i=>!Number.isFinite(i)))throw new RangeError("Sector and fold angles must be finite.")}function xu(n,e){const t=n.edges.filter(o=>o.kind==="hinge").map(o=>o.id).sort(),i=new Map(t.map((o,l)=>[o,l])),s=new Map(e?.hingeAngles.map(o=>[o.edgeId,o.angle])??[]),r=n.vertices.flatMap(o=>{const l=Pc(n,o.id);return l.applicability==="applicable"?[{vertexId:o.id,extraction:l}]:[]});if(r.length===0||t.length===0)return{applicable:!1,vertexCount:r.length,hingeCount:t.length,jacobian:[],reason:"No all-hinge interior vertex network is available."};const a=[];for(const{extraction:o}of r){const l=o.rays.map(u=>s.get(u.edgeId)??0),c=_u(o.sectorAngles,l);for(const u of c){const h=Array.from({length:t.length},()=>0);o.rays.forEach((d,f)=>{const m=i.get(d.edgeId);m!==void 0&&(h[m]+=u[f])}),a.push(h)}}return{applicable:!0,vertexCount:r.length,hingeCount:t.length,jacobian:a,mobility:mu(a,t.length)}}function vu(n,e,t=Li.absoluteLength){if(e.length<2)return Su("A rigid-fold path requires at least two samples.");const i=n.faces.map(m=>m.id);let s=!0,r=!0,a=0,o=!0,l=0,c=!1;for(const m of e){const _=new Set(n.edges.filter(b=>b.kind==="hinge").map(b=>b.id)),g=new Set;for(const b of m.hingeAngles){const w=n.edges.find(T=>T.id===b.edgeId),v=w?.hinge?.angleRange,A=w?.hinge?.assignment,S=A==="mountain"?b.angle<=0:A==="valley"?b.angle>=0:!1;(g.has(b.edgeId)||!_.has(b.edgeId)||!Number.isFinite(b.angle)||!v||b.angle<v[0]||b.angle>v[1]||!S)&&(o=!1),g.add(b.edgeId)}const p=new Map(m.facePoses.map(b=>[b.faceId,b.transform]));for(const b of i){const w=p.get(b);(!w||!_o(w))&&(s=!1),w&&(l=Math.max(l,Eu(w.rotation)))}for(const b of n.edges.filter(w=>w.kind==="hinge")){if(b.halfEdges.length!==2){r=!1;continue}const w=b.halfEdges.map(T=>n.halfEdges.find(M=>M.id===T)).filter(T=>T!==void 0);if(w.length!==2){r=!1;continue}const v=p.get(w[0].face),A=p.get(w[1].face);if(!v||!A){r=!1;continue}const S=[w[0].origin,Mu(n,w[0])];for(const T of S){const M=n.vertices.find(P=>P.id===T);if(!M){r=!1;continue}const E=[M.position[0],M.position[1],0],C=ls(Gn(Ct(v,E),Ct(A,E)));a=Math.max(a,C)}}}const u=e.map(m=>m.parameterValues.find(_=>_.parameterId==="deployment")?.value),h=u.every((m,_)=>_===0||m!==void 0&&u[_-1]!==void 0&&m>=u[_-1]),d=yu(n),f=xu(n,e[e.length-1]);for(let m=1;m<e.length;m+=1)JSON.stringify(e[m-1].facePoses)!==JSON.stringify(e[m].facePoses)&&(c=!0);return{applicable:!0,rigid:s,hingesCompatible:r&&a<=t,monotone:h,hingeStateValid:o,matrixCompatible:s&&l<=t,nontrivialMotion:c,maximumMatrixResidual:l,hingeGraphAcyclic:d,matrixCertificate:!s||!r||a>t?"invalid":d?"tree-exact":"cycle-closed",networkMobilityApplicable:f.applicable,...f.mobility?{networkDegreesOfFreedom:f.mobility.dof}:{},sampleCount:e.length,maximumHingeResidual:a}}function Mu(n,e){return n.halfEdges.find(t=>t.id===e.next)?.origin??""}function Su(n){return{applicable:!1,rigid:!1,hingesCompatible:!1,monotone:!1,hingeStateValid:!1,matrixCompatible:!1,nontrivialMotion:!1,maximumMatrixResidual:Number.POSITIVE_INFINITY,hingeGraphAcyclic:!1,matrixCertificate:"invalid",networkMobilityApplicable:!1,sampleCount:0,maximumHingeResidual:Number.POSITIVE_INFINITY,reason:n}}function yu(n){const e=new Map;for(const s of n.edges.filter(r=>r.kind==="hinge"&&r.halfEdges.length===2)){const r=s.halfEdges.map(a=>n.halfEdges.find(o=>o.id===a)?.face).filter(a=>a!==void 0);r.length===2&&(e.set(r[0],[...e.get(r[0])??[],r[1]]),e.set(r[1],[...e.get(r[1])??[],r[0]]))}const t=new Set,i=(s,r)=>{if(t.has(s))return!1;t.add(s);for(const a of e.get(s)??[])if(a!==r&&(t.has(a)||!i(a,s)))return!1;return!0};return[...e.keys()].every(s=>t.has(s)||i(s))}function Eu(n){let e=0;for(let t=0;t<3;t+=1)for(let i=0;i<3;i+=1){let s=0;for(let r=0;r<3;r+=1)s+=n[r][t]*n[r][i];e=Math.max(e,Math.abs(s-(t===i?1:0)))}return e}function zc(n,e,t=1e-9,i=Number.POSITIVE_INFINITY){if(e.length<2)return bu("A configuration-space path requires at least two states.");const s=e.map(m=>m.parameterValues.find(_=>_.parameterId==="deployment")?.value),r=s.every(m=>m!==void 0&&Number.isFinite(m)),a=r&&s.every(m=>m>=-t&&m<=1+t),o=r&&s.every((m,_)=>_===0||m>=s[_-1]-t),l=r&&Math.abs(s[0]-0)<=t&&Math.abs(s[s.length-1]-1)<=t,c=r&&s.every((m,_)=>_===0||Math.abs(m-s[_-1])>t),u=r?Math.max(...s.slice(1).map((m,_)=>m-s[_])):Number.POSITIVE_INFINITY,h=!Number.isFinite(i)||u<=i+t,d=new Set(n.faces.map(m=>m.id)),f=e.every(m=>{const _=new Set(m.facePoses.map(g=>g.faceId));return _.size===d.size&&[...d].every(g=>_.has(g))});return{applicable:!0,ordered:o,coversEndpoints:l,uniqueParameters:c,withinDomain:a,maximumParameterStep:u,stepBounded:h,topologyStable:f,sampleCount:e.length}}function bu(n){return{applicable:!1,ordered:!1,coversEndpoints:!1,uniqueParameters:!1,withinDomain:!1,maximumParameterStep:Number.POSITIVE_INFINITY,stepBounded:!1,topologyStable:!1,sampleCount:0,reason:n}}function Tu(n,e,t=1e-8){const i=n.edges.filter(a=>a.kind==="hinge"||a.kind==="cutBank"||a.kind==="boundary").map(a=>a.id),s=n.edges.filter(a=>a.kind==="joined"||a.kind==="flatSeam").map(a=>a.id),r=new Set;for(const a of n.edges.filter(o=>o.kind==="joined"||o.kind==="flatSeam")){if(a.halfEdges.length!==2){r.add(a.id);continue}const o=a.halfEdges.map(l=>n.halfEdges.find(c=>c.id===l)?.face);if(!o[0]||!o[1]){r.add(a.id);continue}for(const l of e){const c=l.facePoses.find(h=>h.faceId===o[0])?.transform,u=l.facePoses.find(h=>h.faceId===o[1])?.transform;(!c||!u||Au(c,u)>t)&&r.add(a.id)}}return{controlled:r.size===0,declaredSingularEdgeIds:i,invalidSingularEdgeIds:[...r],smoothEdgeIds:s}}function Au(n,e){let t=Math.max(...n.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)t=Math.max(t,Math.abs(n.rotation[i][s]-e.rotation[i][s]));return t}function wu(n,e,t=1e-8){if(e.length<2)return Ru("Isometric recovery requires flat and deployed samples.");const i=new Map(e[0].facePoses.map(u=>[u.faceId,u.transform])),s=new Map(e[e.length-1].facePoses.map(u=>[u.faceId,u.transform]));let r=0,a=!0,o=!0;for(const u of n.faces){const h=Gc(n,u.boundary),d=i.get(u.id),f=s.get(u.id);if(!d||!f){a=!1,o=!1;continue}for(const[_,g]of h){const p=n.vertices.find(S=>S.id===_),b=n.vertices.find(S=>S.id===g);if(!p||!b){a=!1;continue}const w=[p.position[0],p.position[1],0],v=[b.position[0],b.position[1],0],A=ls(Gn(v,w));for(const S of e){const T=S.facePoses.find(P=>P.faceId===u.id)?.transform;if(!T){a=!1;continue}const M=Ct(T,w),E=Ct(T,v),C=ls(Gn(E,M));r=Math.max(r,Math.abs(A-C))}}const m=d.rotation.every((_,g)=>_.every((p,b)=>Math.abs(p-(g===b?1:0))<=t))&&Math.abs(d.translation[0])<=t&&Math.abs(d.translation[1])<=t&&Math.abs(d.translation[2])<=t;o=o&&m}a=a&&r<=t;const l=n.faces.filter(u=>Cu(n,u.boundary)<=t).map(u=>u.id),c=Tu(n,e,t);return{applicable:!0,piecewiseIsometric:a&&l.length===0&&c.controlled,recoversFlatPattern:o,maximumEdgeResidual:r,singularFaceIds:l,controlledSingularSet:c.controlled,invalidSingularEdgeIds:c.invalidSingularEdgeIds}}function Gc(n,e){const t=[];let i=e;const s=new Set;for(;!s.has(i);){s.add(i);const r=n.halfEdges.find(o=>o.id===i);if(!r)break;const a=n.halfEdges.find(o=>o.id===r.next);if(!a)break;t.push([r.origin,a.origin]),i=r.next}return t}function Ru(n){return{applicable:!1,piecewiseIsometric:!1,recoversFlatPattern:!1,maximumEdgeResidual:Number.POSITIVE_INFINITY,singularFaceIds:[],controlledSingularSet:!1,invalidSingularEdgeIds:[],reason:n}}function Cu(n,e){const t=Gc(n,e).map(([s])=>n.vertices.find(r=>r.id===s)?.position).filter(s=>s!==void 0);let i=0;for(let s=0;s<t.length;s+=1){const r=t[s],a=t[(s+1)%t.length];i+=r[0]*a[1]-a[0]*r[1]}return Math.abs(i)/2}function Pu(n,e,t,i=1e-6){if(!Number.isFinite(t)||t<=0||!Number.isFinite(i)||i<=0)return nl(t,i,"Lipschitz bound and epsilon must be positive and finite.");const s=new Set(n.faces.map(o=>o.id));for(const o of[0,.5,1]){const l=e(o),c=new Map(l.facePoses.map(u=>[u.faceId,u.transform]));if(c.size!==s.size||[...s].some(u=>!c.has(u))||[...c.values()].some(u=>!_o(u)))return nl(t,i,"Analytic path witnesses do not preserve the complete rigid face set.")}const r=Math.max(1,Math.ceil(t/i)),a=t/r;return{certified:a<=i,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!0,uniformlyConvergent:!0,lipschitzBound:t,epsilon:i,requiredSubdivisionCount:r,certifiedUniformErrorBound:a}}function nl(n,e,t){return{certified:!1,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!1,uniformlyConvergent:!1,lipschitzBound:n,epsilon:e,requiredSubdivisionCount:0,certifiedUniformErrorBound:Number.POSITIVE_INFINITY,reason:t}}function Iu(n,e,t){const i=xr(n).length===0,s=Lc(n),r=n.faces.reduce((c,u)=>c+u.holes.length,0),a=n.faces.every(c=>c.holes.every(u=>n.halfEdges.some(h=>h.id===u&&h.face===c.id))),o=t.applicable&&t.rigid&&t.hingesCompatible&&t.matrixCompatible,l=i&&s.necessaryGatesSatisfied&&s.materialConnected&&a&&o&&e.certified&&e.continuous&&e.uniformlyConvergent;return{certified:l,proof:l?"analytic-global-map":"unsupported",topologyValid:i,necessaryGatesSatisfied:s.necessaryGatesSatisfied,materialConnected:s.materialConnected,holesTracked:a,holeBoundaryCount:r,hingeContinuous:o,analyticContinuous:e.continuous,...l?{}:{reason:"A global certificate requires valid connected topology, all Chapter 5–6 gates, continuous hinges, tracked holes, and an analytic convergent map."}}}function Du(n,e,t,i,s,r=1e-8){const a=zc(n,e),o=[],l=[];for(const d of n.edges.filter(f=>f.kind==="hinge"&&f.halfEdges.length===2)){const f=d.halfEdges.map(_=>n.halfEdges.find(g=>g.id===_)?.face);(e.some(_=>{const g=_.facePoses.find(b=>b.faceId===f[0])?.transform,p=_.facePoses.find(b=>b.faceId===f[1])?.transform;return!g||!p||Lu(g,p)>r})?o:l).push(d.id)}const u=a.applicable&&a.ordered&&a.coversEndpoints&&a.uniqueParameters&&a.withinDomain&&a.stepBounded&&a.topologyStable&&t.certified&&t.continuous&&t.uniformlyConvergent&&i.applicable&&i.rigid&&i.hingesCompatible&&i.matrixCompatible&&s.certified,h=u&&i.nontrivialMotion&&o.length>0;return{certified:u,proof:u?"analytic-configuration-path":"unsupported",selfFoldable:h,activeCreaseIds:o,optionalCreaseIds:l,path:a,...u?{}:{reason:"Configuration certification requires an ordered complete analytic path with rigid/global certificates."}}}function Lu(n,e){let t=Math.max(...n.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)t=Math.max(t,Math.abs(n.rotation[i][s]-e.rotation[i][s]));return t}function Hc(n){if(!Number.isInteger(n.sampleCount)||n.sampleCount<2||n.sampleCount>1001)return{ok:!1,diagnostics:[an("Path sample count must be an integer in [2, 1001].",n.input.operationId)]};const e=[...n.complex.edges].filter(_=>_.kind==="hinge"),t=[],i=8,s=(n.sampleCount-1)*i+1;for(let _=0;_<s;_+=1){const g=_/(s-1),p=il(n.input,n.complex,n.sourceMap,g);if(!p)return{ok:!1,diagnostics:[an("Stair hinge chain is missing or disconnected.",n.input.operationId)]};const b={id:`${n.input.operationId}:path:${_}`,facePoses:[...p.entries()].map(([v,A])=>({faceId:v,transform:A}))},w=au(n.complex,b);if(w.length>0)return{ok:!1,diagnostics:[an(`Stair deployment sample ${_} has non-adjacent face overlap: ${w.map(v=>`${v.firstFaceId}:${v.secondFaceId}`).join(", ")}.`,n.input.operationId,_,g)]};_%i===0&&t.push({parameter:g,transforms:p})}const r=hu(n.complex,t.map(_=>({schemaVersion:1,id:`${n.input.operationId}:folding-map:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([g,p])=>({faceId:g,transform:p})),hingeAngles:[]})));if(!r.applicable||!r.rigid||!r.continuous)return{ok:!1,diagnostics:[an(r.reason??"Stair folding map failed topology, rigidity, or continuity validation.",n.input.operationId)]};const a=vu(n.complex,t.map(_=>({schemaVersion:1,id:`${n.input.operationId}:rigid:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([g,p])=>({faceId:g,transform:p})),hingeAngles:[]})));if(!a.applicable||!a.rigid||!a.hingesCompatible||!a.monotone||!a.hingeStateValid||!a.matrixCompatible)return{ok:!1,diagnostics:[an(a.reason??"Stair path failed rigid-foldability compatibility checks.",n.input.operationId)]};const o=zc(n.complex,t.map(_=>({schemaVersion:1,id:`${n.input.operationId}:configuration:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([g,p])=>({faceId:g,transform:p})),hingeAngles:[]})),1e-9,1/(n.sampleCount-1));if(!o.applicable||!o.ordered||!o.coversEndpoints||!o.uniqueParameters||!o.withinDomain||!o.stepBounded||!o.topologyStable)return{ok:!1,diagnostics:[an(o.reason??"Stair path failed configuration-space checks.",n.input.operationId)]};const l=wu(n.complex,t.map(_=>({schemaVersion:1,id:`${n.input.operationId}:isometric:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([g,p])=>({faceId:g,transform:p})),hingeAngles:[]})));if(!l.applicable||!l.piecewiseIsometric||!l.recoversFlatPattern)return{ok:!1,diagnostics:[an(l.reason??"Stair path failed piecewise-isometric recovery checks.",n.input.operationId)]};const c=Math.hypot(n.input.width,n.input.stepCount*n.input.stepRun),u=Math.max(1,e.length*Math.PI/2*c),h=Pu(n.complex,_=>{const g=il(n.input,n.complex,n.sourceMap,_);if(!g)throw new Error("Validated stair hinge chain became unavailable.");return{schemaVersion:1,id:`${n.input.operationId}:analytic:${_}`,parameterValues:[{parameterId:"deployment",value:_}],facePoses:[...g.entries()].map(([p,b])=>({faceId:p,transform:b})),hingeAngles:[]}},u);if(!h.certified)return{ok:!1,diagnostics:[an(h.reason??"Stair path failed analytic folding-map certification.",n.input.operationId)]};const d=Iu(n.complex,h,a);if(!d.certified||d.proof!=="analytic-global-map")return{ok:!1,diagnostics:[an(d.reason??"Stair path failed global folding-map certification.",n.input.operationId)]};const f=t.map(_=>({schemaVersion:1,id:`${n.input.operationId}:configuration-certificate:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([g,p])=>({faceId:g,transform:p})),hingeAngles:[]})),m=Du(n.complex,f,h,a,d);return!m.certified||!m.selfFoldable||m.proof!=="analytic-configuration-path"?{ok:!1,diagnostics:[an(m.reason??"Stair path failed configuration-space certification.",n.input.operationId)]}:{ok:!0,samples:t,evidence:{classification:"certifiedRigidPath",foldingMap:{continuous:r.continuous,rigid:r.rigid,sampleCount:r.sampleCount,maximumDisplacement:r.uniformDisplacementResidual},rigidFoldability:{rigid:a.rigid,hingesCompatible:a.hingesCompatible,monotone:a.monotone,maximumHingeResidual:a.maximumHingeResidual,matrixCompatible:a.matrixCompatible,nontrivialMotion:a.nontrivialMotion,maximumMatrixResidual:a.maximumMatrixResidual},configurationSpace:{ordered:o.ordered,coversEndpoints:o.coversEndpoints,uniqueParameters:o.uniqueParameters,withinDomain:o.withinDomain,maximumParameterStep:o.maximumParameterStep,stepBounded:o.stepBounded,topologyStable:o.topologyStable},isometricRecovery:{piecewiseIsometric:l.piecewiseIsometric,recoversFlatPattern:l.recoversFlatPattern,maximumEdgeResidual:l.maximumEdgeResidual,controlledSingularSet:l.controlledSingularSet,invalidSingularEdgeIds:l.invalidSingularEdgeIds},analyticFoldingMap:{proof:h.proof,continuous:h.continuous,uniformlyConvergent:h.uniformlyConvergent,lipschitzBound:h.lipschitzBound,requiredSubdivisionCount:h.requiredSubdivisionCount,certifiedUniformErrorBound:h.certifiedUniformErrorBound},globalFoldingMap:{proof:d.proof,topologyValid:d.topologyValid,necessaryGatesSatisfied:d.necessaryGatesSatisfied,materialConnected:d.materialConnected,holesTracked:d.holesTracked,hingeContinuous:d.hingeContinuous},configurationCertificate:{proof:m.proof,selfFoldable:m.selfFoldable,activeCreaseIds:m.activeCreaseIds,optionalCreaseIds:m.optionalCreaseIds},verification:{method:"adaptive-sampled",sampleCount:s,maxParameterStep:1/i,collisionCheck:"coplanar-positive-area"}}}}function il(n,e,t,i){const s=new Map,r=new Map(e.vertices.map(d=>[d.id,d])),a=n.stepCount*2+2,o=a/2,l=r.get(`v:${o}:0`)?.position[1];if(l===void 0)return;const c=-1,u=Ni([0,l,0],[n.hostWidth,0,0],c*-i*Math.PI/2);for(const d of t.faces.filter(f=>f.faceId.startsWith("host-face:"))){const f=/^host-face:(\d+):(\d+)$/.exec(d.faceId);if(!f)return;const m=Number(f[1]);s.set(d.faceId,m<o?Hn():u)}let h=Hn();for(let d=0;d<a;d+=1){if(s.set(`stair-face:${d}`,h),d>=a-1)continue;const f=e.edges.find(S=>S.id===`hinge:${d}`);if(!f||f.halfEdges.length!==2)return;const m=r.get(`v:${d+1}:1`)?.position,_=r.get(`v:${d+1}:2`)?.position;if(!m||!_)return;const g=[m[0],m[1],0],p=[_[0],_[1],0],b=Ct(h,g),w=Ct(h,p),v=[w[0]-b[0],w[1]-b[1],w[2]-b[2]],A=f.hinge?.assignment==="mountain"?-1:1;h=bn(Ni(b,v,c*A*i*Math.PI/2),h)}if(s.size===e.faces.length)return s}function an(n,e,t,i){return{severity:"error",category:"path",code:t===void 0?"PATH_POPUP_SAMPLE_COUNT_INVALID":"PATH_COLLISION_DETECTED",message:n,locations:t===void 0?[{kind:"entity",entity:{kind:"spatialOperation",id:e}}]:[{kind:"sample",index:t,parameter:i},{kind:"entity",entity:{kind:"spatialOperation",id:e}}],entities:[{kind:"spatialOperation",id:e}]}}const Nu=1,Uu="hinge-flat",Fu="Flat canonical hinge",Ou="boundary",Bu="single-hinge",ku="meter-radian",Vu=["Ideal zero-thickness rigid faces"],zu="docs/single-hinge-specification.md",Gu=1e-12,Hu="singleHinge",Wu={assignment:"valley",angle:0},$u={ok:!0,childPoint:[2,0,0],classification:"certifiedRigidPath"},Xu={schemaVersion:Nu,id:Uu,title:Fu,fixtureClass:Ou,mechanismFamily:Bu,units:ku,assumptions:Vu,provenance:zu,tolerance:Gu,kind:Hu,input:Wu,expected:$u},Yu=1,qu="hinge-intermediate",Zu="Intermediate canonical hinge",Ku="valid",Ju="single-hinge",Qu="meter-radian",ju=["Ideal zero-thickness rigid faces"],eh="docs/single-hinge-specification.md",th=1e-12,nh="singleHinge",ih={assignment:"valley",angle:1.0471975511965976},sh={ok:!0,childPoint:[1.5,0,-.8660254037844386],classification:"certifiedRigidPath"},rh={schemaVersion:Yu,id:qu,title:Zu,fixtureClass:Ku,mechanismFamily:Ju,units:Qu,assumptions:ju,provenance:eh,tolerance:th,kind:nh,input:ih,expected:sh},ah=1,oh="hinge-folded",lh="Quarter-turn canonical hinge",ch="valid",dh="single-hinge",uh="meter-radian",hh=["Ideal zero-thickness rigid faces"],fh="docs/single-hinge-specification.md",ph=1e-12,mh="singleHinge",gh={assignment:"valley",angle:1.5707963267948966},_h={ok:!0,childPoint:[1,0,-1],classification:"certifiedRigidPath"},xh={schemaVersion:ah,id:oh,title:lh,fixtureClass:ch,mechanismFamily:dh,units:uh,assumptions:hh,provenance:fh,tolerance:ph,kind:mh,input:gh,expected:_h},vh=1,Mh="hinge-assignment-invalid",Sh="Valley hinge rejects a negative angle",yh="invalid",Eh="single-hinge",bh="meter-radian",Th=["Positive angles are valley folds"],Ah="docs/single-hinge-specification.md",wh=1e-12,Rh="singleHinge",Ch={assignment:"valley",angle:-.5},Ph={ok:!1,diagnosticCodes:["KINEMATICS_ANGLE_OUT_OF_RANGE","KINEMATICS_ASSIGNMENT_MISMATCH"]},Ih={schemaVersion:vh,id:Mh,title:Sh,fixtureClass:yh,mechanismFamily:Eh,units:bh,assumptions:Th,provenance:Ah,tolerance:wh,kind:Rh,input:Ch,expected:Ph},Dh=1,Lh="vertex-valid-3m1v",Nh="Four-crease vertex satisfying Kawasaki and Maekawa",Uh="valid",Fh="single-vertex",Oh="meter-radian",Bh=["Interior crease-only vertex"],kh="docs/mathematical-contract.md#37-local-flat-foldability",Vh=1e-12,zh="singleVertex",Gh={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","mountain","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},Hh={kawasaki:"satisfied",maekawa:"satisfied",locallyFlatFoldable:!0},Wh={schemaVersion:Dh,id:Lh,title:Nh,fixtureClass:Uh,mechanismFamily:Fh,units:Oh,assumptions:Bh,provenance:kh,tolerance:Vh,kind:zh,input:Gh,expected:Hh},$h=1,Xh="vertex-invalid-2m2v",Yh="Four-crease vertex failing Maekawa",qh="invalid",Zh="single-vertex",Kh="meter-radian",Jh=["Interior crease-only vertex"],Qh="docs/mathematical-contract.md#37-local-flat-foldability",jh=1e-12,ef="singleVertex",tf={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","valley","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},nf={kawasaki:"satisfied",maekawa:"failed",locallyFlatFoldable:!1},sf={schemaVersion:$h,id:Xh,title:Yh,fixtureClass:qh,mechanismFamily:Zh,units:Kh,assumptions:Jh,provenance:Qh,tolerance:jh,kind:ef,input:tf,expected:nf},rf=1,af="popup-symmetric",of="Symmetric axis-aligned two-plane pop-up",lf="valid",cf="two-plane-pop-up",df="meter-radian",uf=["Ideal zero-thickness rigid linkage"],hf="docs/mathematical-contract.md#4-two-plane-pop-up-family",ff=1e-10,pf="twoPlanePopUp",mf={id:"popup-symmetric",width:2,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},gf={ok:!0,deployedJunction:[0,1,1],axisAligned:!0,classification:"certifiedRigidPath"},_f={schemaVersion:rf,id:af,title:of,fixtureClass:lf,mechanismFamily:cf,units:df,assumptions:uf,provenance:hf,tolerance:ff,kind:pf,input:mf,expected:gf},xf=1,vf="popup-unequal",Mf="Unequal-link rotated two-plane pop-up",Sf="valid",yf="two-plane-pop-up",Ef="meter-radian",bf=["Unequal links may rotate the child frame"],Tf="docs/mathematical-contract.md#4-two-plane-pop-up-family",Af=1e-10,wf="twoPlanePopUp",Rf={id:"popup-unequal",width:2,height:1,depth:2,deployedAngle:1.5707963267948966,sampleCount:7},Cf={ok:!0,deployedJunction:[0,.8,1.6],axisAligned:!1,classification:"certifiedRigidPath"},Pf={schemaVersion:xf,id:vf,title:Mf,fixtureClass:Sf,mechanismFamily:yf,units:Ef,assumptions:bf,provenance:Tf,tolerance:Af,kind:wf,input:Rf,expected:Cf},If=1,Df="popup-invalid-width",Lf="Two-plane pop-up rejects zero width",Nf="invalid",Uf="two-plane-pop-up",Ff="meter-radian",Of=["Mechanism dimensions must be positive"],Bf="docs/mathematical-contract.md#4-two-plane-pop-up-family",kf=1e-10,Vf="twoPlanePopUp",zf={id:"popup-invalid-width",width:0,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},Gf={ok:!1,diagnosticCodes:["MECHANISM_POPUP_INVALID_PARAMETER"]},Hf={schemaVersion:If,id:Df,title:Lf,fixtureClass:Nf,mechanismFamily:Uf,units:Ff,assumptions:Of,provenance:Bf,tolerance:kf,kind:Vf,input:zf,expected:Gf},Wf=1,$f="spatial-root",Xf="One root plane pair",Yf="valid",qf="nested-parallel-strip",Zf="meter-radian",Kf=["Two-level synchronized strip family"],Jf="docs/mathematical-contract.md#5-composition-contract",Qf=1e-10,jf="spatialProgram",ep={schemaVersion:1,id:"spatial-root",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},tp={ok:!0,classification:"certifiedRigidPath"},np={schemaVersion:Wf,id:$f,title:Xf,fixtureClass:Yf,mechanismFamily:qf,units:Zf,assumptions:Kf,provenance:Jf,tolerance:Qf,kind:jf,input:ep,expected:tp},ip=1,sp="spatial-nested-shelf",rp="Root plane pair with nested shelf",ap="valid",op="nested-parallel-strip",lp="meter-radian",cp=["Two-level synchronized strip family"],dp="docs/mathematical-contract.md#5-composition-contract",up=1e-10,hp="spatialProgram",fp={schemaVersion:1,id:"spatial-nested-shelf",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:3,height:1.5,depth:1.5,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"shelf",kind:"shelf",target:{kind:"generatedPair",operationId:"root"},xOffset:.5,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},pp={ok:!0,classification:"certifiedRigidPath"},mp={schemaVersion:ip,id:sp,title:rp,fixtureClass:ap,mechanismFamily:op,units:lp,assumptions:cp,provenance:dp,tolerance:up,kind:hp,input:fp,expected:pp},gp=1,_p="spatial-siblings",xp="Disjoint sibling plane pairs",vp="valid",Mp="nested-parallel-strip",Sp="meter-radian",yp=["Sibling strip interiors are disjoint"],Ep="docs/mathematical-contract.md#5-composition-contract",bp=1e-10,Tp="spatialProgram",Ap={schemaVersion:1,id:"spatial-siblings",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"left",kind:"wall",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"right",kind:"platform",target:{kind:"sheet"},xOffset:4,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},wp={ok:!0,classification:"certifiedRigidPath"},Rp={schemaVersion:gp,id:_p,title:xp,fixtureClass:vp,mechanismFamily:Mp,units:Sp,assumptions:yp,provenance:Ep,tolerance:bp,kind:Tp,input:Ap,expected:wp},Cp=1,Pp="spatial-overlap",Ip="Overlapping siblings are rejected",Dp="invalid",Lp="nested-parallel-strip",Np="meter-radian",Up=["Sibling strip interiors must be disjoint"],Fp="docs/mathematical-contract.md#5-composition-contract",Op=1e-10,Bp="spatialProgram",kp={schemaVersion:1,id:"spatial-overlap",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"a",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"b",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Vp={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OVERLAP"]},zp={schemaVersion:Cp,id:Pp,title:Ip,fixtureClass:Dp,mechanismFamily:Lp,units:Np,assumptions:Up,provenance:Fp,tolerance:Op,kind:Bp,input:kp,expected:Vp},Gp=1,Hp="spatial-depth-three",Wp="Depth-three hierarchy is rejected",$p="unsupported",Xp="nested-parallel-strip",Yp="meter-radian",qp=["Only root and child module levels are supported"],Zp="docs/mathematical-contract.md#5-composition-contract",Kp=1e-10,Jp="spatialProgram",Qp={schemaVersion:1,id:"spatial-depth-three",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:3,height:2,depth:2,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"child",kind:"planePair",target:{kind:"generatedPair",operationId:"root"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"grandchild",kind:"planePair",target:{kind:"generatedPair",operationId:"child"},xOffset:0,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},jp={ok:!1,diagnosticCodes:["SPATIAL_TARGET_DEPTH_UNSUPPORTED"]},em={schemaVersion:Gp,id:Hp,title:Wp,fixtureClass:$p,mechanismFamily:Xp,units:Yp,assumptions:qp,provenance:Zp,tolerance:Kp,kind:Jp,input:Qp,expected:jp},tm=1,nm="spatial-opening",im="Opening is explicitly unsupported",sm="unsupported",rm="bounded-spatial-compiler",am="meter-radian",om=["Subtractive topology is not certified"],lm="docs/mathematical-contract.md#51-bounded-spatial-compilation",cm=1e-10,dm="spatialProgram",um={schemaVersion:1,id:"spatial-opening",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"door",kind:"opening",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},hm={ok:!1,diagnosticCodes:["SPATIAL_OPERATION_UNSUPPORTED"]},fm={schemaVersion:tm,id:nm,title:im,fixtureClass:sm,mechanismFamily:rm,units:am,assumptions:om,provenance:lm,tolerance:cm,kind:dm,input:um,expected:hm},pm=1,mm="spatial-out-of-bounds",gm="Attachment outside the sheet is rejected",_m="invalid",xm="nested-parallel-strip",vm="meter-radian",Mm=["Attachments must fit their host material"],Sm="docs/mathematical-contract.md#5-composition-contract",ym=1e-10,Em="spatialProgram",bm={schemaVersion:1,id:"spatial-out-of-bounds",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"outside",kind:"planePair",target:{kind:"sheet"},xOffset:5,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Tm={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS"]},Am={schemaVersion:pm,id:mm,title:gm,fixtureClass:_m,mechanismFamily:xm,units:vm,assumptions:Mm,provenance:Sm,tolerance:ym,kind:Em,input:bm,expected:Tm},wm=1;function Wc(n){return Rm(n)?{ok:!0,example:n}:{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Validation examples require schema version 1, metadata, finite tolerance, typed input, and expected output.",locations:[{kind:"entity",entity:{kind:"validationExample",id:rl(n)}}],entities:[{kind:"validationExample",id:rl(n)}]}]}}function Rm(n){return ri(n)?n.schemaVersion===wm&&jn(n.id)&&jn(n.title)&&["valid","boundary","invalid","unsupported"].includes(String(n.fixtureClass))&&["singleHinge","singleVertex","twoPlanePopUp","spatialProgram"].includes(String(n.kind))&&jn(n.mechanismFamily)&&n.units==="meter-radian"&&Array.isArray(n.assumptions)&&n.assumptions.every(jn)&&jn(n.provenance)&&Number.isFinite(n.tolerance)&&Number(n.tolerance)>=0&&ri(n.input)&&ri(n.expected)&&Cm(n):!1}function Cm(n){const e=n.input,t=n.expected;return!ri(e)||!ri(t)||typeof t.ok=="string"?!1:n.kind==="singleHinge"?["mountain","valley"].includes(String(e.assignment))&&Number.isFinite(e.angle)&&typeof t.ok=="boolean"&&sl(t.childPoint)&&Pr(t.diagnosticCodes):n.kind==="singleVertex"?Pm(e.sectorAngles)&&Array.isArray(e.assignments)&&e.assignments.every(i=>["mountain","valley","unassigned"].includes(String(i)))&&e.sectorAngles.length===e.assignments.length&&ri(e.paper)&&Number.isFinite(e.paper.width)&&Number(e.paper.width)>0&&Number.isFinite(e.paper.height)&&Number(e.paper.height)>0&&Array.isArray(e.paper.center)&&e.paper.center.length===2&&e.paper.center.every(i=>Number.isFinite(i))&&["satisfied","failed"].includes(String(t.kawasaki))&&["satisfied","failed","notApplicable"].includes(String(t.maekawa))&&typeof t.locallyFlatFoldable=="boolean":n.kind==="twoPlanePopUp"?jn(e.id)&&[e.width,e.height,e.depth,e.deployedAngle].every(Number.isFinite)&&Number.isInteger(e.sampleCount)&&typeof t.ok=="boolean"&&sl(t.deployedJunction)&&Pr(t.diagnosticCodes):n.kind==="spatialProgram"&&typeof t.ok=="boolean"&&Pr(t.diagnosticCodes)}function Pm(n){return Array.isArray(n)&&n.every(Number.isFinite)}function sl(n){return n===void 0||Array.isArray(n)&&n.length===3&&n.every(Number.isFinite)}function Pr(n){return n===void 0||Array.isArray(n)&&n.every(e=>typeof e=="string")}function ri(n){return n!==null&&typeof n=="object"&&!Array.isArray(n)}function jn(n){return typeof n=="string"&&n.length>0}function rl(n){return ri(n)&&jn(n.id)?n.id:"unknown"}function Mr(n,e,t=new Map,i){const s=new Map(n.vertices.map(m=>[m.id,m])),r=new Map(n.halfEdges.map(m=>[m.id,m])),a=m=>!0,o=new Map;for(const m of[...n.halfEdges].sort(Wi))a(m.face),o.has(m.origin)||o.set(m.origin,m.face);const l=(m,_)=>{const g=s.get(m)?.position,p=e.get(_);if(!g||!p)throw new RangeError(`Missing topology transform for ${m}/${_}.`);return Ct(p,[g[0],g[1],0])},c=n.edges.flatMap(m=>{const _=Dm(m);if(_===void 0)return[];const g=[...m.halfEdges].map(b=>r.get(b)).filter(b=>a(b.face)).sort(Wi)[0];if(!g)return[];const p=r.get(g.next);return[{edge:m,halfEdge:g,next:p,role:_}]}),u=new Set(c.flatMap(({halfEdge:m,next:_})=>[m.origin,_.origin])),h=n.vertices.filter(m=>u.has(m.id)&&o.has(m.id)).map(m=>({id:m.id,position:l(m.id,o.get(m.id)),role:"vertex",sourceEntities:[{kind:"vertex",id:m.id}]})).sort(Wi),d=c.map(({edge:m,halfEdge:_,next:g,role:p})=>({id:m.id,start:l(_.origin,_.face),end:l(g.origin,_.face),role:p,sourceEntities:[{kind:"edge",id:m.id}]})).sort(Wi),f=n.faces.filter(m=>a(m.id)).map(m=>{const _=Im(m.boundary,r),g=t.get(m.id),p=[{kind:"face",id:m.id},...g===void 0?[]:[{kind:"spatialOperation",id:g}]];return{id:m.id,vertices:_.map(b=>l(b.origin,m.id)),sourceEntities:p,...g===void 0?{}:{sourceOperationId:g}}}).sort(Wi);return{points:h,segments:d,faces:f}}function Im(n,e){const t=[];let i=e.get(n);for(;i&&(t.length===0||i.id!==n);)t.push(i),i=e.get(i.next);return t}function Dm(n){if(n.kind==="boundary")return"boundary";if(n.kind==="cutBank")return"cut";if(n.kind==="hinge")return n.hinge?.assignment==="mountain"?"hingeMountain":n.hinge?.assignment==="valley"?"hingeValley":"hingeUnassigned"}function Wi(n,e){return n.id.localeCompare(e.id)}const Lm=Object.assign({"../../examples/validation/01-hinge-flat.json":Xu,"../../examples/validation/02-hinge-intermediate.json":rh,"../../examples/validation/03-hinge-folded.json":xh,"../../examples/validation/04-hinge-assignment-invalid.json":Ih,"../../examples/validation/05-vertex-valid.json":Wh,"../../examples/validation/06-vertex-maekawa-invalid.json":sf,"../../examples/validation/07-popup-symmetric.json":_f,"../../examples/validation/08-popup-unequal.json":Pf,"../../examples/validation/09-popup-invalid.json":Hf,"../../examples/validation/10-spatial-root.json":np,"../../examples/validation/11-spatial-nested-shelf.json":mp,"../../examples/validation/12-spatial-siblings.json":Rp,"../../examples/validation/13-spatial-overlap.json":zp,"../../examples/validation/14-spatial-depth.json":em,"../../examples/validation/15-spatial-opening.json":fm,"../../examples/validation/16-spatial-out-of-bounds.json":Am}),Ir=Object.entries(Lm).sort(([n],[e])=>n.localeCompare(e)).map(([n,e])=>{const t=Wc(e);if(!t.ok)throw new TypeError(`${n}: ${t.diagnostics.map(i=>i.message).join(" ")}`);return{filename:n.slice(n.lastIndexOf("/")+1),example:t.example}});function Nm(n=new Worker(new URL("/kirigami/assets/engine-worker-Dg1M99Gg.js",import.meta.url),{type:"module",name:"kirigami-engine-lab"})){let e=1,t=!1;const i=new Map,s=r=>{for(const a of i.values())a.reject(r);i.clear()};return n.onmessage=({data:r})=>{if(t||r===null||typeof r!="object"||!Number.isInteger(r.requestId))return;const a=i.get(r.requestId);a&&(i.delete(r.requestId),r.ok?a.resolve(r.subject):a.reject(new Error(r.message)))},n.onerror=r=>{s(new Error(r.message||"Engine worker failed."))},{evaluate(r){if(t)return Promise.reject(new Error("Engine Lab client is disposed."));const a=e;return e+=1,new Promise((o,l)=>{i.set(a,{resolve:o,reject:l}),n.postMessage({requestId:a,type:"evaluate",example:r})})},dispose(){t||(t=!0,s(new Error("Engine Lab client was disposed.")),n.onmessage=null,n.onerror=null,n.terminate())}}}function Um(n){const e=[];return _a(n.input,["input"],e),e.sort((t,i)=>km(t.path,i.path))}function Fm(n,e,t){if(e[0]!=="input"||e.length<2||!Number.isFinite(t)||typeof Vm(n,e)!="number")return zm(n.id);const i=xa(n,e,t);return Wc(i)}function _a(n,e,t){if(typeof n=="number"){const i=String(e[e.length-1]);if(i==="schemaVersion"||i==="tolerance")return;t.push({path:e,label:Om(e),value:n,step:i==="sampleCount"||i==="pathSampleCount"?1:i.toLowerCase().includes("angle")?.01:Math.max(Math.abs(n)*.05,.01)});return}if(Array.isArray(n)){n.forEach((i,s)=>_a(i,[...e,s],t));return}if(!(n===null||typeof n!="object"))for(const i of Object.keys(n).sort())i==="schemaVersion"||i==="tolerance"||_a(n[i],[...e,i],t)}function Om(n){const e=n.slice(1).map(t=>typeof t=="number"?String(t+1):Bm(t));return e.slice(Math.max(e.length-3,0)).join(" · ")}function Bm(n){const e=n.replace(/([a-z0-9])([A-Z])/g,"$1 $2");return e[0]?.toUpperCase()+e.slice(1)}function km(n,e){const t=Math.max(n.length,e.length);for(let i=0;i<t;i+=1){const s=n[i],r=e[i];if(s===void 0)return-1;if(r===void 0)return 1;if(s!==r)return typeof s=="number"&&typeof r=="number"?s-r:String(s).localeCompare(String(r))}return 0}function Vm(n,e){let t=n;for(const i of e){if(t===null||typeof t!="object")return;t=t[i]}return t}function xa(n,e,t){if(e.length===0)return t;const[i,...s]=e;if(Array.isArray(n)){const a=[...n];return a[Number(i)]=xa(a[Number(i)],s,t),a}const r=n;return{...r,[i]:xa(r[i],s,t)}}function zm(n){return{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Engine Lab parameter edits require a finite numeric input value.",locations:[{kind:"entity",entity:{kind:"validationExample",id:n}}],entities:[{kind:"validationExample",id:n}]}]}}function Gm(n,e,t,i={}){if(!e){n.innerHTML=t?`<div class="inspector-empty inspector-error">${Bt(t)}</div>`:'<div class="inspector-empty">Select an example to inspect engine evidence.</div>';return}const{result:s}=e,r=Um(e.example),a=s.observed.disposition!=="accepted";n.innerHTML=`
    ${t===void 0?"":`<div class="inspector-error-banner" role="alert">${Bt(t)}</div>`}
    <section class="inspection-section">
      <h2>Outcome</h2>
      <dl class="outcome-grid">
        <div>
          <dt>Conformance</dt>
          <dd data-status="${s.status}">${s.status}</dd>
        </div>
        <div>
          <dt>Observed</dt>
          <dd data-disposition="${s.observed.disposition}">${s.observed.disposition}</dd>
        </div>
        <div>
          <dt>Evidence</dt>
          <dd>${Bt(s.observed.classification??"not produced")}</dd>
        </div>
      </dl>
    </section>
    <section class="inspection-section">
      <h2>Diagnostics <span>${s.diagnostics.length}</span></h2>
      ${s.diagnostics.length===0?'<p class="quiet">No engine diagnostics.</p>':`<ul class="diagnostic-list">${s.diagnostics.map(o=>`
                  <li${a?` data-diagnostic-state="${o.category==="unsupported"?"unsupported":"invalid"}"`:""}>
                    <code>${Bt(o.code)}</code>
                    <p>${Bt(o.message)}</p>
                    <ul class="diagnostic-locations" aria-label="Diagnostic locations">
                      ${o.locations.map(l=>`<li>${Bt(Hm(l))}</li>`).join("")}
                    </ul>
                    <small>${Bt(o.category)} · ${Bt(o.severity)}</small>
                  </li>`).join("")}</ul>`}
    </section>
    <section class="inspection-section">
      <h2>Conformance checks <span>${s.checks.length}</span></h2>
      <div class="check-list">
        ${s.checks.map(o=>`
              <details ${o.passed?"":"open"}>
                <summary>
                  <span class="check-state" data-status="${o.passed?"passed":"failed"}"></span>
                  <code>${Bt(o.id)}</code>
                </summary>
                <dl>
                  <div><dt>Method</dt><dd>${Bt(o.method)}</dd></div>
                  <div><dt>Expected</dt><dd>${al(o.expected)}</dd></div>
                  <div><dt>Actual</dt><dd>${al(o.actual)}</dd></div>
                  ${o.residual===void 0?"":`<div><dt>Residual</dt><dd>${or(o.residual)}</dd></div>`}
                  ${o.tolerance===void 0?"":`<div><dt>Tolerance</dt><dd>${or(o.tolerance)}</dd></div>`}
                </dl>
              </details>`).join("")}
      </div>
    </section>
    <section class="inspection-section parameter-section" aria-label="Parameters">
      <h2>Parameters <span>${r.length}</span></h2>
      <div class="parameter-list">
        ${r.map(o=>`
              <label${ol(o.path,s.diagnostics,a)===void 0?"":` data-diagnostic-state="${ol(o.path,s.diagnostics,a)}"`}>
                <span>${Bt(o.label)}</span>
                <input
                  type="number"
                  aria-label="${Bt(o.label)}"
                  data-parameter-path="${Bt(JSON.stringify(o.path))}"
                  value="${o.value}"
                  step="${o.step}"
                />
              </label>`).join("")}
      </div>
      ${r.length===0?'<p class="quiet">This example has no numeric input leaves.</p>':'<button class="parameter-reset" type="button">Reset parameters</button>'}
    </section>
  `,n.querySelectorAll("[data-parameter-path]").forEach(o=>{let l;o.addEventListener("input",()=>{l!==void 0&&window.clearTimeout(l);const c=JSON.parse(o.dataset.parameterPath??"[]");l=window.setTimeout(()=>{i.onParameterCommit?.(c,Number(o.value))},240)})}),n.querySelector(".parameter-reset")?.addEventListener("click",()=>i.onReset?.())}function al(n){return typeof n=="number"?or(n):Bt(JSON.stringify(n)??String(n))}function Hm(n){return n.kind==="entity"?`${n.entity.kind} · ${n.entity.id}`:n.kind==="parameter"?n.path.map(String).join(" · "):n.kind==="sample"?`sample ${n.index+1}${n.parameter===void 0?"":` · parameter ${or(n.parameter)}`}`:`non-spatial · ${n.reason}`}function ol(n,e,t){if(!t)return;const i=e.filter(s=>s.locations.some(r=>r.kind==="parameter"&&Wm(n,r.path)));return i.some(s=>s.category!=="unsupported")?"invalid":i.some(s=>s.category==="unsupported")?"unsupported":void 0}function Wm(n,e){return n.length>=e.length&&e.every((t,i)=>n[i]===t)}function or(n){return n===0?"0":Math.abs(n)>=1e3||Math.abs(n)<.001?n.toExponential(4):n.toPrecision(6)}function Bt(n){return n.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function $m(n,e,t,i){const s=Mr(n,i,new Map(e.faces.map(a=>[a.faceId,t.operationId]))),r=s.segments.map(a=>({...a,start:Tn(a.start),end:Tn(a.end)}));return{points:Sr(r),segments:r,faces:s.faces.map(a=>({...a,vertices:a.vertices.map(Tn)}))}}function Xm(n,e,t){const i=Mr(n,t,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:Tn(r.start),end:Tn(r.end)}));return{points:Sr(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(Tn)}))}}function Ym(n,e,t){const i=Mr(n,t,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:Dr(r.start),end:Dr(r.end)}));return{points:Sr(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(Dr)}))}}function qm(n,e){const t=Mr(n.complex,e.transforms,new Map(n.sourceMap.integratedFaces.map(s=>[s.faceId,`${n.input.operationId}:${s.source}`]))),i=t.segments.map(s=>({...s,start:Tn(s.start),end:Tn(s.end)}));return{faces:t.faces.map(s=>({...s,vertices:s.vertices.map(Tn)})),segments:i,points:Sr(i)}}function Tn([n,e,t]){return[n,t,-e]}function Dr([n,e,t]){return[n,-e,t]}function Sr(n){const e=new Map;for(const t of n)ll(e,t.start,t.role,cl(t.end,t.start)),ll(e,t.end,t.role,cl(t.start,t.end));return[...e.entries()].filter(([,t])=>Zm(t.entries)).sort(([t],[i])=>t.localeCompare(i)).map(([t,i])=>({id:`fabrication-corner:${t}`,position:i.position,role:"vertex",sourceEntities:[]}))}function ll(n,e,t,i){const s=e.map(a=>Math.round(a*1e9)).join(":"),r=n.get(s)??{position:e,entries:[]};r.entries.push({role:t,direction:i}),n.set(s,r)}function Zm(n){const e=n.filter((r,a,o)=>o.findIndex(l=>l.role===r.role&&Km(l.direction,r.direction))===a);if(e.length!==2)return e.length>0;if(e[0].role!==e[1].role)return!0;const[t,i]=e.map(r=>r.direction),s=[t[1]*i[2]-t[2]*i[1],t[2]*i[0]-t[0]*i[2],t[0]*i[1]-t[1]*i[0]];return Math.hypot(...s)>1e-9}function Km(n,e){const t=Math.hypot(...n),i=Math.hypot(...e);return t<=1e-12||i<=1e-12?!1:(n[0]*e[0]+n[1]*e[1]+n[2]*e[2])/(t*i)>=1-1e-9}function cl(n,e){return[n[0]-e[0],n[1]-e[1],n[2]-e[2]]}function xo(n){const e=eg(n);if(e)return{ok:!1,diagnostics:[e]};const t=n.stepCount*n.stepRun,i=(n.hostWidth-t)/2,s=Array.from({length:n.stepCount+1},(S,T)=>{const M=i+T*n.stepRun,E=T===0,C=T===n.stepCount,P=E||C?-n.width:(T-1)*n.stepRise-n.width,I=C?(n.stepCount-1)*n.stepRise:T*n.stepRise;return{cutPairId:`cut:long:${T}`,axis:"long",lineIndex:T,start:[M,P],end:[M,I]}}),r=Array.from({length:n.stepCount},(S,T)=>({edgeId:`hinge:inherited:${T}`,role:"inherited",stepIndex:T,start:[s[T].end[0],T*n.stepRise],end:[s[T+1].end[0],T*n.stepRise]})),a=Array.from({length:n.stepCount},(S,T)=>({edgeId:`hinge:explicit:${T}`,role:"explicit",stepIndex:T,start:[s[T].start[0],T*n.stepRise-n.width],end:[s[T+1].start[0],T*n.stepRise-n.width]})),o=ul([0,n.hostWidth,...s.map(S=>S.start[0])]),l=ul([-n.hostFloorExtent,n.hostWallExtent,0,...s.flatMap(S=>[S.start[1],S.end[1]]),...r.flatMap(S=>[S.start[1],S.end[1]]),...a.flatMap(S=>[S.start[1],S.end[1]])]),c=[],u=[],h=[],d=[],f=[],m=[],_=[];for(let S=0;S<l.length;S+=1)for(let T=0;T<o.length;T+=1)c.push({id:$i(T,S),position:[o[T],l[S]]});for(let S=0;S<l.length-1;S+=1)for(let T=0;T<o.length-1;T+=1){const M=`sheet-face:${S}:${T}`,E=["bottom","right","top","left"].map(U=>`he:${S}:${T}:${U}`);h.push({id:E[0],origin:$i(T,S),next:E[1],edge:"pending",face:M},{id:E[1],origin:$i(T+1,S),next:E[2],edge:"pending",face:M},{id:E[2],origin:$i(T+1,S+1),next:E[3],edge:"pending",face:M},{id:E[3],origin:$i(T,S+1),next:E[0],edge:"pending",face:M}),u.push({id:M,boundary:E[0],holes:[]});const C=[(o[T]+o[T+1])/2,(l[S]+l[S+1])/2],P=jm(C[0],i,n.stepRun,n.stepCount),I=P===void 0?void 0:Qm(C,r,a),X=P===void 0?void 0:P*n.stepRise-n.width,W=I!==void 0?"tread":P!==void 0&&C[1]>=-n.width&&C[1]<X?"carrier":C[1]<0?"base":"host";m.push({faceId:M,role:W,...I===void 0?{}:{stepIndex:I}})}const g=new Map(h.map(S=>[S.id,S])),p=(S,T)=>{for(const M of S)g.get(M).edge=T.id;S.length===2&&(g.get(S[0]).twin=S[1],g.get(S[1]).twin=S[0]),d.push(T)};for(let S=0;S<l.length-1;S+=1)for(let T=0;T<o.length;T+=1){const M=T>0?`he:${S}:${T-1}:right`:void 0,E=T<o.length-1?`he:${S}:${T}:left`:void 0,C=[M,E].filter(Y=>Y!==void 0);if(C.length===1){const Y=[C[0]];p(Y,{id:`boundary:v:${S}:${T}`,halfEdges:Y,kind:"boundary"});continue}const P=[C[0],C[1]],I=o[T],X=l[S],W=l[S+1],U=s.find(Y=>ni(Y.start[0],I)&&X>=Y.start[1]-1e-10&&W<=Y.end[1]+1e-10);if(!U||U.lineIndex===0){p(P,{id:`seam:v:${S}:${T}`,halfEdges:P,kind:"flatSeam"});continue}const G=`${U.cutPairId}:segment:${S}`,V=["",""];for(let Y=0;Y<P.length;Y+=1){const ne=Y===0?"a":"b",K=`${G}:${ne}`,$=[P[Y]];p($,{id:K,halfEdges:$,kind:"cutBank",cutBank:{pair:G,bank:ne}}),V[Y]=K}f.push({id:G,banks:V})}for(let S=0;S<l.length;S+=1)for(let T=0;T<o.length-1;T+=1){const M=S>0?`he:${S-1}:${T}:top`:void 0,E=S<l.length-1?`he:${S}:${T}:bottom`:void 0,C=[M,E].filter(Q=>Q!==void 0);if(C.length===1){const Q=[C[0]];p(Q,{id:`boundary:h:${S}:${T}`,halfEdges:Q,kind:"boundary"});continue}const P=[C[0],C[1]],I=[o[T],l[S]],X=[o[T+1],l[S]],W=r.find(Q=>hl(Q.start,Q.end,I,X)),U=a.find(Q=>hl(Q.start,Q.end,I,X)),G=I[0]>=s[0].start[0]-1e-10&&X[0]<=s.at(-1).start[0]+1e-10,V=ni(l[S],-n.width)&&G,Y=ni(l[S],0)&&!G&&!W&&!U;if(U?.stepIndex===0){p(P,{id:"seam:terminal:ground",halfEdges:P,kind:"flatSeam"});continue}if(!W&&!U&&!Y&&!V){p(P,{id:`seam:h:${S}:${T}`,halfEdges:P,kind:"flatSeam"});continue}const K=(W??U)?.edgeId??(V?`hinge:carrier-base:${T}`:`hinge:parent:${T}`),$=U?"valley":"mountain";p(P,{id:K,halfEdges:P,kind:"hinge",hinge:{assignment:$,restAngle:0,angleRange:$==="valley"?[0,Math.PI/2]:[-Math.PI/2,0]}})}const b=m.filter(S=>S.role==="tread"),w=Array.from({length:n.stepCount},(S,T)=>({stepIndex:T,treadFaceId:b.find(M=>M.stepIndex===T).faceId,hostConnected:!0,carrierConnected:!0}));for(let S=0;S<n.stepCount;S+=1)_.push({edgeId:r[S].edgeId,kind:"retained",stepIndex:S,side:"host"}),S>0&&_.push({edgeId:a[S].edgeId,kind:"retained",stepIndex:S,side:"carrier"});const v={schemaVersion:1,vertices:c,halfEdges:h,edges:d,faces:u,cutPairs:f,materialComponents:[{id:`tread-only-material:${n.operationId}`,faces:u.map(S=>S.id)}]},A=xr(v);return A.length>0?{ok:!1,diagnostics:A}:{ok:!0,complex:v,sourceMap:{construction:"treadOnly",operationId:n.operationId,enclosingCut:!1,faces:m,cutLines:s.slice(1),shortEnds:_,hinges:[{edgeId:"hinge:parent",role:"parent"},...r,...a.slice(1),...Array.from({length:n.stepCount},(S,T)=>({edgeId:`hinge:carrier-base:${T+1}`,role:"carrierBase",stepIndex:T}))],supports:w}}}function vo(n){if(!Number.isInteger(n.sampleCount)||n.sampleCount<2||n.sampleCount>1001)return{ok:!1,diagnostics:[va(n.input.operationId,"Path sample count must be an integer in [2, 1001].")]};const e=[];for(let t=0;t<n.sampleCount;t+=1){const i=t/(n.sampleCount-1),s=Jm(n.input,n.complex,n.sourceMap,i);if(!s.ok)return{ok:!1,diagnostics:[va(n.input.operationId,s.reason)]};e.push({parameter:i,transforms:s.transforms})}return{ok:!0,samples:e}}function Jm(n,e,t,i){const s=new Map(t.faces.map(h=>[h.faceId,h])),r=new Map(e.halfEdges.map(h=>[h.id,h])),a=new Map(e.vertices.map(h=>[h.id,h.position])),o=i*Math.PI/2,l=Ni([0,0,0],[1,0,0],o),c=Ni([0,-n.width,0],[1,0,0],o),u=new Map;for(const h of e.faces){const d=s.get(h.id);if(!d)return{ok:!1,reason:`Tread-only face ${h.id} has no material trace.`};if(d.role==="base")u.set(h.id,Hn());else if(d.role==="host")u.set(h.id,l);else if(d.role==="carrier")u.set(h.id,c);else if(d.role==="tread"&&d.stepIndex!==void 0){const f=d.stepIndex*n.stepRise;u.set(h.id,{rotation:Hn().rotation,translation:[0,-f*(1-Math.cos(o)),f*Math.sin(o)]})}else return{ok:!1,reason:`Tread-only face ${h.id} has unsupported role ${d.role}.`}}for(const h of e.edges.filter(d=>d.halfEdges.length===2)){const d=r.get(h.halfEdges[0]),f=r.get(h.halfEdges[1]),m=r.get(d.next),_=r.get(f.next),g=(b,w)=>{const v=a.get(w),A=u.get(b.face);return Ct(A,[v[0],v[1],0])},p=Math.max(dl(g(d,d.origin),g(f,_.origin)),dl(g(d,m.origin),g(f,f.origin)));if(p>1e-8)return{ok:!1,reason:`Tread-only retained edge ${h.id} detaches by ${p}.`}}return{ok:!0,transforms:u}}function dl(n,e){return Math.hypot(n[0]-e[0],n[1]-e[1],n[2]-e[2])}function Qm(n,e,t){return e.find((i,s)=>n[0]>i.start[0]&&n[0]<i.end[0]&&n[1]>t[s].start[1]&&n[1]<i.start[1])?.stepIndex}function jm(n,e,t,i){if(!(n<=e||n>=e+i*t))return Math.min(i-1,Math.max(0,Math.floor((n-e)/t)))}function ul(n){return[...new Set(n.map(e=>Number(e.toFixed(12))))].sort((e,t)=>e-t)}function $i(n,e){return`v:${e}:${n}`}function ni(n,e){return Math.abs(n-e)<=1e-10}function hl(n,e,t,i){return ni(n[0],t[0])&&ni(n[1],t[1])&&ni(e[0],i[0])&&ni(e[1],i[1])}function eg(n){const e=n.stepCount*n.stepRun,t=-n.width,i=n.stepCount*n.stepRise;return n.operationId.length>0&&Number.isFinite(n.width)&&n.width>0&&Number.isInteger(n.stepCount)&&n.stepCount>=2&&n.stepCount<=20&&Number.isFinite(n.stepRun)&&n.stepRun>0&&n.stepRun===n.stepRise&&Number.isFinite(n.hostWidth)&&n.hostWidth>=e&&Number.isFinite(n.hostFloorExtent)&&n.hostFloorExtent>=-t&&Number.isFinite(n.hostWallExtent)&&n.hostWallExtent>=i?void 0:va(n.operationId||"unknown","Tread-only stair dimensions must be positive, equal-run/equal-rise, bounded, and fit the host sheet.")}function va(n,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}]}}function tg(n){const e=xo(n);if(!e.ok)return e;const t=e.sourceMap.faces.map(a=>({faceId:a.faceId,role:a.role==="tread"?"riser":a.role==="host"?"stationaryHost":a.role==="base"?"movingHalf":"carrier",...a.stepIndex===void 0?{}:{stepIndex:a.stepIndex}})),i=t.filter(a=>a.role==="riser"),s=$c(e.complex,lr),r=s.edges.filter(a=>a.id.startsWith("hinge:parent:")).map(a=>({edgeId:a.id,role:"parent"}));return{ok:!0,complex:s,sourceMap:{construction:"riserOnly",operationId:n.operationId,sheetOrientation:"landscape",parentCreaseAxis:"vertical",enclosingCut:!1,faces:t,cutLines:e.sourceMap.cutLines.map(a=>({...a,start:Ss(a.start),end:Ss(a.end)})),shortEnds:e.sourceMap.shortEnds.map(a=>({...a,side:a.side==="host"?"stationaryHost":"carrier"})),hinges:[...r,...e.sourceMap.hinges.filter(a=>a.role!=="parent").map(a=>({...a,...a.start===void 0?{}:{start:Ss(a.start)},...a.end===void 0?{}:{end:Ss(a.end)}}))],supports:Array.from({length:n.stepCount},(a,o)=>({stepIndex:o,riserFaceId:i.find(l=>l.stepIndex===o).faceId,stationaryHostConnected:!0,carrierConnected:!0}))}}}function ng(n){const e={...n.sourceMap,construction:"treadOnly",faces:n.sourceMap.faces.map(r=>({faceId:r.faceId,role:r.role==="riser"?"tread":r.role==="stationaryHost"?"host":r.role==="movingHalf"?"base":"carrier",...r.stepIndex===void 0?{}:{stepIndex:r.stepIndex}})),shortEnds:n.sourceMap.shortEnds.map(r=>({...r,side:r.side==="stationaryHost"?"host":"carrier"})),supports:n.sourceMap.supports.map(r=>({stepIndex:r.stepIndex,treadFaceId:r.riserFaceId,hostConnected:!0,carrierConnected:!0}))},t=$c(n.complex,ar(lr)),i=vo({input:n.input,complex:t,sourceMap:e,sampleCount:n.sampleCount});if(!i.ok)return i;const s=n.sourceMap.faces.find(r=>r.role==="stationaryHost");return s?{ok:!0,samples:i.samples.map(r=>{const a=ar(r.transforms.get(s.faceId));return{parameter:r.parameter,transforms:new Map([...r.transforms].map(([o,l])=>[o,ig(bn(a,l))]))}})}:{ok:!1,diagnostics:[rg(n.input.operationId,"Riser-only pattern has no stationary host face.")]}}const lr={rotation:[[0,-1,0],[1,0,0],[0,0,1]],translation:[0,0,0]};function Ss([n,e]){return[-e,n]}function $c(n,e){return{...n,vertices:n.vertices.map(t=>{const[i,s]=t.position,r=sg(e,[i,s,0]);return{...t,position:[r[0],r[1]]}})}}function ig(n){return bn(lr,bn(n,ar(lr)))}function sg(n,e){return[n.rotation[0][0]*e[0]+n.rotation[0][1]*e[1]+n.rotation[0][2]*e[2]+n.translation[0],n.rotation[1][0]*e[0]+n.rotation[1][1]*e[1]+n.rotation[1][2]*e[2]+n.translation[1],n.rotation[2][0]*e[0]+n.rotation[2][1]*e[1]+n.rotation[2][2]*e[2]+n.translation[2]]}function rg(n,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}]}}function ag(n){const e={operationId:`${n.operationId}:parent`,...n.parent},t={operationId:`${n.operationId}:child`,hostPlane:"wall",...n.child},i=xo(e);if(!i.ok)return i;const s=Uc(t);if(!s.ok)return s;const r=cg(n),a=-n.parent.width;if(!dg(n,r,a))return{ok:!1,diagnostics:[Sa(n.operationId,"The child stair must fit one retained carrier strip above the carrier-base hinge and parent base material below it.")]};const o=Ma(i.complex),l=new Map(i.sourceMap.faces.map(_=>[_.faceId,_])),c=i.sourceMap.faces.filter(_=>{const g=o.get(_.faceId);return gg(g,r)}).map(_=>_.faceId).sort(),u=c.map(_=>l.get(_));if(!u.some(_=>_.role==="carrier")||!u.some(_=>_.role==="base"))return{ok:!1,diagnostics:[Sa(n.operationId,"The child source region must replace both retained carrier material and the common parent base.")]};const h=new Set(c),d=i.complex.faces.map(_=>_.id).filter(_=>!h.has(_)).sort(),f=lg(i,s,r,a,n.operationId),m=xr(f.complex);return m.length>0?{ok:!1,diagnostics:m}:{ok:!0,input:n,parent:i,child:s,complex:f.complex,childPlacement:xg(r.minimumX,a),sourceMap:{construction:"carrierHostedCompoundStair",operationId:n.operationId,materialComponentCount:1,parent:i.sourceMap,child:s.sourceMap,integratedFaces:f.faces,retainedParentFaceIds:d,replacement:{sourceRegion:r,replacedParentFaceIds:c},sharedEdges:{carrierHost:{kind:"sharedMaterialEdge",y:a},groundBridge:{kind:"sharedMaterialEdge",y:a}}},evidence:{sourceRegionContained:!0,childHostContainedInCarrier:!0,childBaseContainedInParentBase:!0,childReplacesCarrier:!0,groundBridgeRetained:!0}}}function og(n){const e={operationId:`${n.compilation.input.operationId}:parent`,...n.compilation.input.parent},t={operationId:`${n.compilation.input.operationId}:child`,hostPlane:"wall",...n.compilation.input.child},i=vo({input:e,complex:n.compilation.parent.complex,sourceMap:n.compilation.parent.sourceMap,sampleCount:n.sampleCount});if(!i.ok)return i;const s=Hc({input:t,complex:n.compilation.child.complex,sourceMap:n.compilation.child.sourceMap,sampleCount:n.sampleCount});if(!s.ok)return s;const r=i.samples.map((o,l)=>{const c=s.samples[l],u=new Map([...c.transforms].map(([_,g])=>[_,bn(n.compilation.childPlacement,g)])),h=_g(n.compilation,o.transforms,u),d=new Map(n.compilation.sourceMap.integratedFaces.map(_=>[_.faceId,_.source==="parent"?o.transforms.get(_.sourceFaceId):bn(u.get(_.sourceFaceId),ar(n.compilation.childPlacement))])),m=Xc(n.compilation.complex,d).residual;return{parameter:o.parameter,transforms:d,parentTransforms:o.transforms,childTransforms:u,carrierHostResidual:h.carrier,groundBridgeResidual:h.ground,maximumSharedMaterialResidual:m,grounded:h.ground<1e-8,childUsesCarrierHost:h.carrier<1e-8}}),a=r.find(o=>!o.grounded||!o.childUsesCarrierHost||o.maximumSharedMaterialResidual>=1e-8);return a?{ok:!1,diagnostics:[Sa(n.compilation.input.operationId,`Compound stair shared material detached at parameter ${a.parameter}: carrier ${a.carrierHostResidual}, ground ${a.groundBridgeResidual}, retained ${a.maximumSharedMaterialResidual} at ${mg(n.compilation.complex,a.transforms).edgeId}.`)]}:{ok:!0,samples:r}}function lg(n,e,t,i,s){const r=[t.minimumX,i,0],a=Ma(n.complex),o=Ma(e.complex),l=fl([...n.complex.vertices.map(v=>v.position[0]),...e.complex.vertices.map(v=>v.position[0]+r[0])]),c=fl([...n.complex.vertices.map(v=>v.position[1]),...e.complex.vertices.map(v=>v.position[1]+r[1])]),u=[],h=[],d=[],f=[];for(let v=0;v<c.length;v+=1)for(let A=0;A<l.length;A+=1)u.push({id:Xi(A,v),position:[l[A],c[v]]});for(let v=0;v<c.length-1;v+=1)for(let A=0;A<l.length-1;A+=1){const S=[(l[A]+l[A+1])/2,(c[v]+c[v+1])/2],T=ug(S,t),M=T?"child":"parent",E=T?[S[0]-r[0],S[1]-r[1]]:S,C=hg(T?o:a,E);if(!C)throw new Error(`Integrated compound cell ${A}:${v} has no ${M} source face.`);const P=`compound-face:${v}:${A}`,I=["bottom","right","top","left"].map(X=>`compound-he:${v}:${A}:${X}`);d.push({id:I[0],origin:Xi(A,v),next:I[1],edge:"pending",face:P},{id:I[1],origin:Xi(A+1,v),next:I[2],edge:"pending",face:P},{id:I[2],origin:Xi(A+1,v+1),next:I[3],edge:"pending",face:P},{id:I[3],origin:Xi(A,v+1),next:I[0],edge:"pending",face:P}),h.push({id:P,boundary:I[0],holes:[]}),f.push({faceId:P,source:M,sourceFaceId:C})}const m=[],_=[],g=new Map(d.map(v=>[v.id,v])),p=new Map(f.map(v=>[v.faceId,v])),b=(v,A)=>{for(const S of v)g.get(S).edge=A.id;v.length===2&&(g.get(v[0]).twin=v[1],g.get(v[1]).twin=v[0]),m.push(A)},w=(v,A,S,T)=>{if(v.length===1){const U=[v[0]];b(U,{id:`boundary:${T}`,halfEdges:U,kind:"boundary"});return}const M=[v[0],v[1]],E=p.get(g.get(v[0]).face),C=p.get(g.get(v[1]).face);if(E.source!==C.source){b(M,{id:`seam:embedded:${T}`,halfEdges:M,kind:"flatSeam"});return}const P=E.source==="parent"?n.complex:e.complex,I=E.source==="parent"?A:[A[0]-r[0],A[1]-r[1]],X=E.source==="parent"?S:[S[0]-r[0],S[1]-r[1]],W=fg(P,I,X);if(W.kind==="cutBank"){const U=`cut:compound:${T}`,G=`${U}:a`,V=`${U}:b`;b([v[0]],{id:G,halfEdges:[v[0]],kind:"cutBank",cutBank:{pair:U,bank:"a"}}),b([v[1]],{id:V,halfEdges:[v[1]],kind:"cutBank",cutBank:{pair:U,bank:"b"}}),_.push({id:U,banks:[G,V]});return}if(W.kind==="hinge"){b(M,{id:`hinge:compound:${T}`,halfEdges:M,kind:"hinge",hinge:W.hinge});return}b(M,{id:`seam:compound:${T}`,halfEdges:M,kind:"flatSeam"})};for(let v=0;v<c.length-1;v+=1)for(let A=0;A<l.length;A+=1){const S=[A>0?`compound-he:${v}:${A-1}:right`:void 0,A<l.length-1?`compound-he:${v}:${A}:left`:void 0].filter(T=>T!==void 0);w(S,[l[A],c[v]],[l[A],c[v+1]],`v:${v}:${A}`)}for(let v=0;v<c.length;v+=1)for(let A=0;A<l.length-1;A+=1){const S=[v>0?`compound-he:${v-1}:${A}:top`:void 0,v<c.length-1?`compound-he:${v}:${A}:bottom`:void 0].filter(T=>T!==void 0);w(S,[l[A],c[v]],[l[A+1],c[v]],`h:${v}:${A}`)}return{complex:{schemaVersion:1,vertices:u,halfEdges:d,edges:m,faces:h,cutPairs:_,materialComponents:[{id:`compound-material:${s}`,faces:h.map(v=>v.id)}]},faces:f}}function cg(n){const t=(n.parent.hostWidth-n.parent.stepCount*n.parent.stepRun)/2+n.childHostStepIndex*n.parent.stepRun+(n.parent.stepRun-n.child.hostWidth)/2,i=-n.parent.width;return{minimumX:ts(t),maximumX:ts(t+n.child.hostWidth),minimumY:ts(i-n.child.hostFloorExtent),maximumY:ts(i+n.child.hostWallExtent)}}function ts(n){return Number(n.toFixed(12))}function dg(n,e,t){if(!Number.isInteger(n.childHostStepIndex)||n.childHostStepIndex<0||n.childHostStepIndex>=n.parent.stepCount||n.child.hostWidth>n.parent.stepRun+1e-10||e.minimumX<0||e.maximumX>n.parent.hostWidth||e.minimumY<-n.parent.hostFloorExtent||e.maximumY>n.parent.hostWallExtent)return!1;const i=(n.parent.hostWidth-n.parent.stepCount*n.parent.stepRun)/2,r=Math.min(n.parent.stepCount-1,Math.max(0,Math.floor((e.minimumX-i)/n.parent.stepRun+1e-8)))*n.parent.stepRise;return e.minimumY<t&&e.maximumY<=r+1e-10}function Ma(n){const e=new Map(n.vertices.map(i=>[i.id,i.position])),t=new Map(n.halfEdges.map(i=>[i.id,i]));return new Map(n.faces.map(i=>{const s=[];let r=t.get(i.boundary);const a=r.id;do s.push(e.get(r.origin)),r=t.get(r.next);while(r.id!==a);return[i.id,{minimumX:Math.min(...s.map(o=>o[0])),maximumX:Math.max(...s.map(o=>o[0])),minimumY:Math.min(...s.map(o=>o[1])),maximumY:Math.max(...s.map(o=>o[1]))}]}))}function fl(n){return[...new Set(n.map(e=>ts(e)))].sort((e,t)=>e-t)}function Xi(n,e){return`compound-v:${e}:${n}`}function ug(n,e){return n[0]>e.minimumX&&n[0]<e.maximumX&&n[1]>e.minimumY&&n[1]<e.maximumY}function hg(n,e){return[...n].find(([,t])=>e[0]>t.minimumX-1e-10&&e[0]<t.maximumX+1e-10&&e[1]>t.minimumY-1e-10&&e[1]<t.maximumY+1e-10)?.[0]}function fg(n,e,t){const i=new Map(n.vertices.map(r=>[r.id,r.position])),s=new Map(n.halfEdges.map(r=>[r.id,r]));for(const r of n.edges)for(const a of r.halfEdges){const o=s.get(a),l=i.get(o.origin),c=i.get(s.get(o.next).origin);if(pg(e,t,l,c))return r}return{id:"implicit-flat-seam",halfEdges:["implicit"],kind:"flatSeam"}}function pg(n,e,t,i){const s=(e[0]-n[0])*(t[1]-n[1])-(e[1]-n[1])*(t[0]-n[0]),r=(e[0]-n[0])*(i[1]-n[1])-(e[1]-n[1])*(i[0]-n[0]);return Math.abs(s)>1e-9||Math.abs(r)>1e-9?!1:Math.min(t[0],i[0])<=n[0]+1e-10&&Math.max(t[0],i[0])>=e[0]-1e-10&&Math.min(t[1],i[1])<=n[1]+1e-10&&Math.max(t[1],i[1])>=e[1]-1e-10}function Xc(n,e){const t=new Map(n.vertices.map(a=>[a.id,a.position])),i=new Map(n.halfEdges.map(a=>[a.id,a]));let s=0,r;for(const a of n.edges.filter(o=>o.halfEdges.length===2)){const o=i.get(a.halfEdges[0]),l=i.get(a.halfEdges[1]),c=i.get(o.next),u=i.get(l.next),h=(f,m)=>{const _=t.get(m);return Ct(e.get(f.face),[_[0],_[1],0])},d=Math.max(cr(h(o,o.origin),h(l,u.origin)),cr(h(o,c.origin),h(l,l.origin)));d>s&&(s=d,r=a.id)}return{residual:s,...r===void 0?{}:{edgeId:r}}}function mg(n,e){return Xc(n,e)}function gg(n,e){return Math.min(n.maximumX,e.maximumX)-Math.max(n.minimumX,e.minimumX)>1e-10&&Math.min(n.maximumY,e.maximumY)-Math.max(n.minimumY,e.minimumY)>1e-10}function _g(n,e,t){const i=n.parent.sourceMap.faces.find(h=>h.role==="carrier"&&n.sourceMap.replacement.replacedParentFaceIds.includes(h.faceId)),s=n.parent.sourceMap.faces.find(h=>h.role==="base"&&n.sourceMap.replacement.replacedParentFaceIds.includes(h.faceId)),r=n.child.sourceMap.faces.find(h=>h.faceId.startsWith("host-face:")&&h.faceId.includes(":0")),a=n.child.sourceMap.faces.find(h=>h.faceId.startsWith("host-face:0:"));if(!i||!s||!r||!a)return{carrier:Number.POSITIVE_INFINITY,ground:Number.POSITIVE_INFINITY};const o=-n.input.parent.width,l=n.sourceMap.replacement.sourceRegion.minimumX,c=[0,0,0],u=[l,o,0];return{carrier:cr(Ct(e.get(i.faceId),u),Ct(t.get(r.faceId),c)),ground:cr(Ct(e.get(s.faceId),u),Ct(t.get(a.faceId),c))}}function xg(n,e){return{...Hn(),translation:[n,e,0]}}function cr(n,e){return Math.hypot(n[0]-e[0],n[1]-e[1],n[2]-e[2])}function Sa(n,e){return{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}]}}const Mo="185",Ci={ROTATE:0,DOLLY:1,PAN:2},Ri={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},vg=0,pl=1,Mg=2,Qs=1,Sg=2,ns=3,Wn=0,kt=1,dn=2,An=0,Pi=1,ml=2,gl=3,_l=4,yg=5,ei=100,Eg=101,bg=102,Tg=103,Ag=104,wg=200,Rg=201,Cg=202,Pg=203,ya=204,Ea=205,Ig=206,Dg=207,Lg=208,Ng=209,Ug=210,Fg=211,Og=212,Bg=213,kg=214,ba=0,Ta=1,Aa=2,Ui=3,wa=4,Ra=5,Ca=6,Pa=7,Yc=0,Vg=1,zg=2,fn=0,qc=1,Zc=2,Kc=3,Jc=4,Qc=5,jc=6,ed=7,td=300,ai=301,Fi=302,Lr=303,Nr=304,yr=306,Ia=1e3,En=1001,Da=1002,Tt=1003,Gg=1004,ys=1005,Pt=1006,Ur=1007,ii=1008,Wt=1009,nd=1010,id=1011,cs=1012,So=1013,gn=1014,un=1015,Rn=1016,yo=1017,Eo=1018,ds=1020,sd=35902,rd=35899,ad=1021,od=1022,en=1023,Cn=1026,si=1027,ld=1028,bo=1029,oi=1030,To=1031,Ao=1033,js=33776,er=33777,tr=33778,nr=33779,La=35840,Na=35841,Ua=35842,Fa=35843,Oa=36196,Ba=37492,ka=37496,Va=37488,za=37489,dr=37490,Ga=37491,Ha=37808,Wa=37809,$a=37810,Xa=37811,Ya=37812,qa=37813,Za=37814,Ka=37815,Ja=37816,Qa=37817,ja=37818,eo=37819,to=37820,no=37821,io=36492,so=36494,ro=36495,ao=36283,oo=36284,ur=36285,lo=36286,Hg=3200,co=0,Wg=1,Vn="",Ht="srgb",hr="srgb-linear",fr="linear",qe="srgb",fi=7680,xl=519,$g=512,Xg=513,Yg=514,wo=515,qg=516,Zg=517,Ro=518,Kg=519,vl=35044,Ml="300 es",hn=2e3,us=2001;function Jg(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function pr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Qg(){const n=pr("canvas");return n.style.display="block",n}const Sl={};function yl(...n){const e="THREE."+n.shift();console.log(e,...n)}function cd(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Re(...n){n=cd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function $e(...n){n=cd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Ii(...n){const e=n.join(" ");e in Sl||(Sl[e]=!0,Re(...n))}function jg(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const e_={[ba]:Ta,[Aa]:Ca,[wa]:Pa,[Ui]:Ra,[Ta]:ba,[Ca]:Aa,[Pa]:wa,[Ra]:Ui};class Yn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let El=1234567;const as=Math.PI/180,hs=180/Math.PI;function Vi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(wt[n&255]+wt[n>>8&255]+wt[n>>16&255]+wt[n>>24&255]+"-"+wt[e&255]+wt[e>>8&255]+"-"+wt[e>>16&15|64]+wt[e>>24&255]+"-"+wt[t&63|128]+wt[t>>8&255]+"-"+wt[t>>16&255]+wt[t>>24&255]+wt[i&255]+wt[i>>8&255]+wt[i>>16&255]+wt[i>>24&255]).toLowerCase()}function ke(n,e,t){return Math.max(e,Math.min(t,n))}function Co(n,e){return(n%e+e)%e}function t_(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function n_(n,e,t){return n!==e?(t-n)/(e-n):0}function os(n,e,t){return(1-t)*n+t*e}function i_(n,e,t,i){return os(n,e,1-Math.exp(-t*i))}function s_(n,e=1){return e-Math.abs(Co(n,e*2)-e)}function r_(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function a_(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function o_(n,e){return n+Math.floor(Math.random()*(e-n+1))}function l_(n,e){return n+Math.random()*(e-n)}function c_(n){return n*(.5-Math.random())}function d_(n){n!==void 0&&(El=n);let e=El+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function u_(n){return n*as}function h_(n){return n*hs}function f_(n){return(n&n-1)===0&&n!==0}function p_(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function m_(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function g_(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),u=a((e+i)/2),h=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),m=a((i-e)/2);switch(s){case"XYX":n.set(o*u,l*h,l*d,o*c);break;case"YZY":n.set(l*d,o*u,l*h,o*c);break;case"ZXZ":n.set(l*h,l*d,o*u,o*c);break;case"XZX":n.set(o*u,l*m,l*f,o*c);break;case"YXY":n.set(l*f,o*u,l*m,o*c);break;case"ZYZ":n.set(l*m,l*f,o*u,o*c);break;default:Re("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function wi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function It(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const dd={DEG2RAD:as,RAD2DEG:hs,generateUUID:Vi,clamp:ke,euclideanModulo:Co,mapLinear:t_,inverseLerp:n_,lerp:os,damp:i_,pingpong:s_,smoothstep:r_,smootherstep:a_,randInt:o_,randFloat:l_,randFloatSpread:c_,seededRandom:d_,degToRad:u_,radToDeg:h_,isPowerOfTwo:f_,ceilPowerOfTwo:p_,floorPowerOfTwo:m_,setQuaternionFromProperEuler:g_,normalize:It,denormalize:wi},Fo=class Fo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Fo.prototype.isVector2=!0;let Ie=Fo;class $n{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],h=i[s+3],d=r[a+0],f=r[a+1],m=r[a+2],_=r[a+3];if(h!==_||l!==d||c!==f||u!==m){let g=l*d+c*f+u*m+h*_;g<0&&(d=-d,f=-f,m=-m,_=-_,g=-g);let p=1-o;if(g<.9995){const b=Math.acos(g),w=Math.sin(b);p=Math.sin(p*b)/w,o=Math.sin(o*b)/w,l=l*p+d*o,c=c*p+f*o,u=u*p+m*o,h=h*p+_*o}else{l=l*p+d*o,c=c*p+f*o,u=u*p+m*o,h=h*p+_*o;const b=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=b,c*=b,u*=b,h*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],h=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+u*h+l*f-c*d,e[t+1]=l*m+u*d+c*h-o*f,e[t+2]=c*m+u*f+o*d-l*h,e[t+3]=u*m-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),h=o(r/2),d=l(i/2),f=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"YZX":this._x=d*u*h+c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h-d*f*m;break;case"XZY":this._x=d*u*h-c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h+d*f*m;break;default:Re("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>h){const f=2*Math.sqrt(1+i-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-i-h);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ke(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Oo=class Oo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(bl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(bl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),h=2*(r*i-a*t);return this.x=t+l*c+a*h-o*u,this.y=i+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Fr.copy(this).projectOnVector(e),this.sub(Fr)}reflect(e){return this.sub(Fr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ke(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Oo.prototype.isVector3=!0;let F=Oo;const Fr=new F,bl=new $n,Bo=class Bo{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],m=i[8],_=s[0],g=s[3],p=s[6],b=s[1],w=s[4],v=s[7],A=s[2],S=s[5],T=s[8];return r[0]=a*_+o*b+l*A,r[3]=a*g+o*w+l*S,r[6]=a*p+o*v+l*T,r[1]=c*_+u*b+h*A,r[4]=c*g+u*w+h*S,r[7]=c*p+u*v+h*T,r[2]=d*_+f*b+m*A,r[5]=d*g+f*w+m*S,r[8]=d*p+f*v+m*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*r,f=c*r-a*l,m=t*h+i*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return e[0]=h*_,e[1]=(s*c-u*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ii("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Or.makeScale(e,t)),this}rotate(e){return Ii("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Or.makeRotation(-e)),this}translate(e,t){return Ii("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Or.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Bo.prototype.isMatrix3=!0;let Le=Bo;const Or=new Le,Tl=new Le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Al=new Le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function __(){const n={enabled:!0,workingColorSpace:hr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===qe&&(s.r=wn(s.r),s.g=wn(s.g),s.b=wn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===qe&&(s.r=Di(s.r),s.g=Di(s.g),s.b=Di(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Vn?fr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ii("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ii("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[hr]:{primaries:e,whitePoint:i,transfer:fr,toXYZ:Tl,fromXYZ:Al,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ht},outputColorSpaceConfig:{drawingBufferColorSpace:Ht}},[Ht]:{primaries:e,whitePoint:i,transfer:qe,toXYZ:Tl,fromXYZ:Al,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ht}}}),n}const Ge=__();function wn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Di(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let pi;class x_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{pi===void 0&&(pi=pr("canvas")),pi.width=e.width,pi.height=e.height;const s=pi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=pi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=pr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=wn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(wn(t[i]/255)*255):t[i]=wn(t[i]);return{data:t,width:e.width,height:e.height}}else return Re("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let v_=0;class Po{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:v_++}),this.uuid=Vi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Br(s[a].image)):r.push(Br(s[a]))}else r=Br(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Br(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?x_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Re("Texture: Unable to serialize Texture."),{})}let M_=0;const kr=new F;class Lt extends Yn{constructor(e=Lt.DEFAULT_IMAGE,t=Lt.DEFAULT_MAPPING,i=En,s=En,r=Pt,a=ii,o=en,l=Wt,c=Lt.DEFAULT_ANISOTROPY,u=Vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:M_++}),this.uuid=Vi(),this.name="",this.source=new Po(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(kr).x}get height(){return this.source.getSize(kr).y}get depth(){return this.source.getSize(kr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Re(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Re(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==td)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ia:e.x=e.x-Math.floor(e.x);break;case En:e.x=e.x<0?0:1;break;case Da:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ia:e.y=e.y-Math.floor(e.y);break;case En:e.y=e.y<0?0:1;break;case Da:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Lt.DEFAULT_IMAGE=null;Lt.DEFAULT_MAPPING=td;Lt.DEFAULT_ANISOTROPY=1;const ko=class ko{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,v=(f+1)/2,A=(p+1)/2,S=(u+d)/4,T=(h+_)/4,M=(m+g)/4;return w>v&&w>A?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=S/i,r=T/i):v>A?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=S/s,r=M/s):A<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),i=T/r,s=M/r),this.set(i,s,r,t),this}let b=Math.sqrt((g-m)*(g-m)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(b)<.001&&(b=1),this.x=(g-m)/b,this.y=(h-_)/b,this.z=(d-u)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ke(this.x,e.x,t.x),this.y=ke(this.y,e.y,t.y),this.z=ke(this.z,e.z,t.z),this.w=ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ke(this.x,e,t),this.y=ke(this.y,e,t),this.z=ke(this.z,e,t),this.w=ke(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ke(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ko.prototype.isVector4=!0;let st=ko;class S_ extends Yn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new st(0,0,e,t),this.scissorTest=!1,this.viewport=new st(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new Lt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Pt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Po(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends S_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class ud extends Lt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class y_ extends Lt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const _r=class _r{constructor(e,t,i,s,r,a,o,l,c,u,h,d,f,m,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,h,d,f,m,_,g)}set(e,t,i,s,r,a,o,l,c,u,h,d,f,m,_,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _r().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/mi.setFromMatrixColumn(e,0).length(),r=1/mi.setFromMatrixColumn(e,1).length(),a=1/mi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=a*u,f=a*h,m=o*u,_=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+m*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,m=c*u,_=c*h;t[0]=d+_*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-m,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,m=c*u,_=c*h;t[0]=d-_*o,t[4]=-a*h,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*u,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,m=o*u,_=o*h;t[0]=l*u,t[4]=m*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*u,t[4]=_-d*h,t[8]=m*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+m,t[10]=d-_*h}else if(e.order==="XZY"){const d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=a*u,t[9]=f*h-m,t[2]=m*h-f,t[6]=o*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(E_,e,b_)}lookAt(e,t,i){const s=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),Ln.crossVectors(i,zt),Ln.lengthSq()===0&&(Math.abs(i.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),Ln.crossVectors(i,zt)),Ln.normalize(),Es.crossVectors(zt,Ln),s[0]=Ln.x,s[4]=Es.x,s[8]=zt.x,s[1]=Ln.y,s[5]=Es.y,s[9]=zt.y,s[2]=Ln.z,s[6]=Es.z,s[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],m=i[2],_=i[6],g=i[10],p=i[14],b=i[3],w=i[7],v=i[11],A=i[15],S=s[0],T=s[4],M=s[8],E=s[12],C=s[1],P=s[5],I=s[9],X=s[13],W=s[2],U=s[6],G=s[10],V=s[14],Y=s[3],ne=s[7],K=s[11],$=s[15];return r[0]=a*S+o*C+l*W+c*Y,r[4]=a*T+o*P+l*U+c*ne,r[8]=a*M+o*I+l*G+c*K,r[12]=a*E+o*X+l*V+c*$,r[1]=u*S+h*C+d*W+f*Y,r[5]=u*T+h*P+d*U+f*ne,r[9]=u*M+h*I+d*G+f*K,r[13]=u*E+h*X+d*V+f*$,r[2]=m*S+_*C+g*W+p*Y,r[6]=m*T+_*P+g*U+p*ne,r[10]=m*M+_*I+g*G+p*K,r[14]=m*E+_*X+g*V+p*$,r[3]=b*S+w*C+v*W+A*Y,r[7]=b*T+w*P+v*U+A*ne,r[11]=b*M+w*I+v*G+A*K,r[15]=b*E+w*X+v*V+A*$,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],m=e[3],_=e[7],g=e[11],p=e[15],b=l*f-c*d,w=o*f-c*h,v=o*d-l*h,A=a*f-c*u,S=a*d-l*u,T=a*h-o*u;return t*(_*b-g*w+p*v)-i*(m*b-g*A+p*S)+s*(m*w-_*A+p*T)-r*(m*v-_*S+g*T)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-i*(r*u-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],m=e[12],_=e[13],g=e[14],p=e[15],b=t*o-i*a,w=t*l-s*a,v=t*c-r*a,A=i*l-s*o,S=i*c-r*o,T=s*c-r*l,M=u*_-h*m,E=u*g-d*m,C=u*p-f*m,P=h*g-d*_,I=h*p-f*_,X=d*p-f*g,W=b*X-w*I+v*P+A*C-S*E+T*M;if(W===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/W;return e[0]=(o*X-l*I+c*P)*U,e[1]=(s*I-i*X-r*P)*U,e[2]=(_*T-g*S+p*A)*U,e[3]=(d*S-h*T-f*A)*U,e[4]=(l*C-a*X-c*E)*U,e[5]=(t*X-s*C+r*E)*U,e[6]=(g*v-m*T-p*w)*U,e[7]=(u*T-d*v+f*w)*U,e[8]=(a*I-o*C+c*M)*U,e[9]=(i*C-t*I-r*M)*U,e[10]=(m*S-_*v+p*b)*U,e[11]=(h*v-u*S-f*b)*U,e[12]=(o*E-a*P-l*M)*U,e[13]=(t*P-i*E+s*M)*U,e[14]=(_*w-m*A-g*b)*U,e[15]=(u*A-h*w+d*b)*U,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,m=r*h,_=a*u,g=a*h,p=o*h,b=l*c,w=l*u,v=l*h,A=i.x,S=i.y,T=i.z;return s[0]=(1-(_+p))*A,s[1]=(f+v)*A,s[2]=(m-w)*A,s[3]=0,s[4]=(f-v)*S,s[5]=(1-(d+p))*S,s[6]=(g+b)*S,s[7]=0,s[8]=(m+w)*T,s[9]=(g-b)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=mi.set(s[0],s[1],s[2]).length();const o=mi.set(s[4],s[5],s[6]).length(),l=mi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Zt.copy(this);const c=1/a,u=1/o,h=1/l;return Zt.elements[0]*=c,Zt.elements[1]*=c,Zt.elements[2]*=c,Zt.elements[4]*=u,Zt.elements[5]*=u,Zt.elements[6]*=u,Zt.elements[8]*=h,Zt.elements[9]*=h,Zt.elements[10]*=h,t.setFromRotationMatrix(Zt),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=hn,l=!1){const c=this.elements,u=2*r/(t-e),h=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s);let m,_;if(l)m=r/(a-r),_=a*r/(a-r);else if(o===hn)m=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===us)m=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=hn,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s);let m,_;if(l)m=1/(a-r),_=a/(a-r);else if(o===hn)m=-2/(a-r),_=-(a+r)/(a-r);else if(o===us)m=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};_r.prototype.isMatrix4=!0;let it=_r;const mi=new F,Zt=new it,E_=new F(0,0,0),b_=new F(1,1,1),Ln=new F,Es=new F,zt=new F,wl=new it,Rl=new $n;class Xn{constructor(e=0,t=0,i=0,s=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ke(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Re("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return wl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Rl.setFromEuler(this),this.setFromQuaternion(Rl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class hd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let T_=0;const Cl=new F,gi=new $n,xn=new it,bs=new F,Yi=new F,A_=new F,w_=new $n,Pl=new F(1,0,0),Il=new F(0,1,0),Dl=new F(0,0,1),Ll={type:"added"},R_={type:"removed"},_i={type:"childadded",child:null},Vr={type:"childremoved",child:null};class Et extends Yn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:T_++}),this.uuid=Vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new F,t=new Xn,i=new $n,s=new F(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new it},normalMatrix:{value:new Le}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.multiply(gi),this}rotateOnWorldAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.premultiply(gi),this}rotateX(e){return this.rotateOnAxis(Pl,e)}rotateY(e){return this.rotateOnAxis(Il,e)}rotateZ(e){return this.rotateOnAxis(Dl,e)}translateOnAxis(e,t){return Cl.copy(e).applyQuaternion(this.quaternion),this.position.add(Cl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Pl,e)}translateY(e){return this.translateOnAxis(Il,e)}translateZ(e){return this.translateOnAxis(Dl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?bs.copy(e):bs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Yi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(Yi,bs,this.up):xn.lookAt(bs,Yi,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),gi.setFromRotationMatrix(xn),this.quaternion.premultiply(gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ll),_i.child=e,this.dispatchEvent(_i),_i.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(R_),Vr.child=e,this.dispatchEvent(Vr),Vr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ll),_i.child=e,this.dispatchEvent(_i),_i.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,e,A_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,w_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Et.DEFAULT_UP=new F(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class is extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const C_={type:"move"};class zr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new is,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new is,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new is,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(C_)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new is;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const fd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},Ts={h:0,s:0,l:0};function Gr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ve{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ge.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ge.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ge.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ge.workingColorSpace){if(e=Co(e,1),t=ke(t,0,1),i=ke(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Gr(a,r,e+1/3),this.g=Gr(a,r,e),this.b=Gr(a,r,e-1/3)}return Ge.colorSpaceToWorking(this,s),this}setStyle(e,t=Ht){function i(r){r!==void 0&&parseFloat(r)<1&&Re("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Re("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Re("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ht){const i=fd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Re("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wn(e.r),this.g=wn(e.g),this.b=wn(e.b),this}copyLinearToSRGB(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ht){return Ge.workingToColorSpace(Rt.copy(this),e),Math.round(ke(Rt.r*255,0,255))*65536+Math.round(ke(Rt.g*255,0,255))*256+Math.round(ke(Rt.b*255,0,255))}getHexString(e=Ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ge.workingColorSpace){Ge.workingToColorSpace(Rt.copy(this),t);const i=Rt.r,s=Rt.g,r=Rt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-i)/h+2;break;case r:l=(i-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ge.workingColorSpace){return Ge.workingToColorSpace(Rt.copy(this),t),e.r=Rt.r,e.g=Rt.g,e.b=Rt.b,e}getStyle(e=Ht){Ge.workingToColorSpace(Rt.copy(this),e);const t=Rt.r,i=Rt.g,s=Rt.b;return e!==Ht?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Nn),this.setHSL(Nn.h+e,Nn.s+t,Nn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Nn),e.getHSL(Ts);const i=os(Nn.h,Ts.h,t),s=os(Nn.s,Ts.s,t),r=os(Nn.l,Ts.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rt=new Ve;Ve.NAMES=fd;class Io{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ve(e),this.density=t}clone(){return new Io(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class P_ extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Kt=new F,vn=new F,Hr=new F,Mn=new F,xi=new F,vi=new F,Nl=new F,Wr=new F,$r=new F,Xr=new F,Yr=new st,qr=new st,Zr=new st;class jt{constructor(e=new F,t=new F,i=new F){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Kt.subVectors(e,t),s.cross(Kt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Kt.subVectors(s,t),vn.subVectors(i,t),Hr.subVectors(e,t);const a=Kt.dot(Kt),o=Kt.dot(vn),l=Kt.dot(Hr),c=vn.dot(vn),u=vn.dot(Hr),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,m=(a*u-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Mn.x),l.addScaledVector(a,Mn.y),l.addScaledVector(o,Mn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Yr.setScalar(0),qr.setScalar(0),Zr.setScalar(0),Yr.fromBufferAttribute(e,t),qr.fromBufferAttribute(e,i),Zr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Yr,r.x),a.addScaledVector(qr,r.y),a.addScaledVector(Zr,r.z),a}static isFrontFacing(e,t,i,s){return Kt.subVectors(i,t),vn.subVectors(e,t),Kt.cross(vn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kt.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),Kt.cross(vn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return jt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return jt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return jt.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return jt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return jt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;xi.subVectors(s,i),vi.subVectors(r,i),Wr.subVectors(e,i);const l=xi.dot(Wr),c=vi.dot(Wr);if(l<=0&&c<=0)return t.copy(i);$r.subVectors(e,s);const u=xi.dot($r),h=vi.dot($r);if(u>=0&&h<=u)return t.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(xi,a);Xr.subVectors(e,r);const f=xi.dot(Xr),m=vi.dot(Xr);if(m>=0&&f<=m)return t.copy(r);const _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(vi,o);const g=u*m-f*h;if(g<=0&&h-u>=0&&f-m>=0)return Nl.subVectors(r,s),o=(h-u)/(h-u+(f-m)),t.copy(s).addScaledVector(Nl,o);const p=1/(g+_+d);return a=_*p,o=d*p,t.copy(i).addScaledVector(xi,a).addScaledVector(vi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class zi{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Jt):Jt.fromBufferAttribute(r,a),Jt.applyMatrix4(e.matrixWorld),this.expandByPoint(Jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),As.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),As.copy(i.boundingBox)),As.applyMatrix4(e.matrixWorld),this.union(As)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Jt),Jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qi),ws.subVectors(this.max,qi),Mi.subVectors(e.a,qi),Si.subVectors(e.b,qi),yi.subVectors(e.c,qi),Un.subVectors(Si,Mi),Fn.subVectors(yi,Si),Zn.subVectors(Mi,yi);let t=[0,-Un.z,Un.y,0,-Fn.z,Fn.y,0,-Zn.z,Zn.y,Un.z,0,-Un.x,Fn.z,0,-Fn.x,Zn.z,0,-Zn.x,-Un.y,Un.x,0,-Fn.y,Fn.x,0,-Zn.y,Zn.x,0];return!Kr(t,Mi,Si,yi,ws)||(t=[1,0,0,0,1,0,0,0,1],!Kr(t,Mi,Si,yi,ws))?!1:(Rs.crossVectors(Un,Fn),t=[Rs.x,Rs.y,Rs.z],Kr(t,Mi,Si,yi,ws))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Sn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Sn=[new F,new F,new F,new F,new F,new F,new F,new F],Jt=new F,As=new zi,Mi=new F,Si=new F,yi=new F,Un=new F,Fn=new F,Zn=new F,qi=new F,ws=new F,Rs=new F,Kn=new F;function Kr(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Kn.fromArray(n,r);const o=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),l=e.dot(Kn),c=t.dot(Kn),u=i.dot(Kn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const gt=new F,Cs=new Ie;let I_=0;class mn extends Yn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:I_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vl,this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Cs.fromBufferAttribute(this,t),Cs.applyMatrix3(e),this.setXY(t,Cs.x,Cs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=wi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=It(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=wi(t,this.array)),t}setX(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=wi(t,this.array)),t}setY(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=wi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=wi(t,this.array)),t}setW(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array),s=It(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array),s=It(s,this.array),r=It(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vl&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class pd extends mn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class md extends mn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Nt extends mn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const D_=new zi,Zi=new F,Jr=new F;class gs{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):D_.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zi.subVectors(e,this.center);const t=Zi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Zi,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Jr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zi.copy(e.center).add(Jr)),this.expandByPoint(Zi.copy(e.center).sub(Jr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let L_=0;const Xt=new it,Qr=new Et,Ei=new F,Gt=new zi,Ki=new zi,yt=new F;class Ut extends Yn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:L_++}),this.uuid=Vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Jg(e)?md:pd)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Le().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Xt.makeRotationFromQuaternion(e),this.applyMatrix4(Xt),this}rotateX(e){return Xt.makeRotationX(e),this.applyMatrix4(Xt),this}rotateY(e){return Xt.makeRotationY(e),this.applyMatrix4(Xt),this}rotateZ(e){return Xt.makeRotationZ(e),this.applyMatrix4(Xt),this}translate(e,t,i){return Xt.makeTranslation(e,t,i),this.applyMatrix4(Xt),this}scale(e,t,i){return Xt.makeScale(e,t,i),this.applyMatrix4(Xt),this}lookAt(e){return Qr.lookAt(e),Qr.updateMatrix(),this.applyMatrix4(Qr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Nt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Re("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const i=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ki.setFromBufferAttribute(o),this.morphTargetsRelative?(yt.addVectors(Gt.min,Ki.min),Gt.expandByPoint(yt),yt.addVectors(Gt.max,Ki.max),Gt.expandByPoint(yt)):(Gt.expandByPoint(Ki.min),Gt.expandByPoint(Ki.max))}Gt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)yt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(yt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)yt.fromBufferAttribute(o,c),l&&(Ei.fromBufferAttribute(e,c),yt.add(Ei)),s=Math.max(s,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new mn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let M=0;M<i.count;M++)o[M]=new F,l[M]=new F;const c=new F,u=new F,h=new F,d=new Ie,f=new Ie,m=new Ie,_=new F,g=new F;function p(M,E,C){c.fromBufferAttribute(i,M),u.fromBufferAttribute(i,E),h.fromBufferAttribute(i,C),d.fromBufferAttribute(r,M),f.fromBufferAttribute(r,E),m.fromBufferAttribute(r,C),u.sub(c),h.sub(c),f.sub(d),m.sub(d);const P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(_.copy(u).multiplyScalar(m.y).addScaledVector(h,-f.y).multiplyScalar(P),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(P),o[M].add(_),o[E].add(_),o[C].add(_),l[M].add(g),l[E].add(g),l[C].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let M=0,E=b.length;M<E;++M){const C=b[M],P=C.start,I=C.count;for(let X=P,W=P+I;X<W;X+=3)p(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const w=new F,v=new F,A=new F,S=new F;function T(M){A.fromBufferAttribute(s,M),S.copy(A);const E=o[M];w.copy(E),w.sub(A.multiplyScalar(A.dot(E))).normalize(),v.crossVectors(S,E);const P=v.dot(l[M])<0?-1:1;a.setXYZW(M,w.x,w.y,w.z,P)}for(let M=0,E=b.length;M<E;++M){const C=b[M],P=C.start,I=C.count;for(let X=P,W=P+I;X<W;X+=3)T(e.getX(X+0)),T(e.getX(X+1)),T(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new mn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new F,r=new F,a=new F,o=new F,l=new F,c=new F,u=new F,h=new F;if(e)for(let d=0,f=e.count;d<f;d+=3){const m=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,m=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*u;for(let p=0;p<u;p++)d[m++]=c[f++]}return new mn(d,u,h)}if(this.index===null)return Re("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ut,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let N_=0;class ci extends Yn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:N_++}),this.uuid=Vi(),this.name="",this.type="Material",this.blending=Pi,this.side=Wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ya,this.blendDst=Ea,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ve(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Re(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Re(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(i.blending=this.blending),this.side!==Wn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ya&&(i.blendSrc=this.blendSrc),this.blendDst!==Ea&&(i.blendDst=this.blendDst),this.blendEquation!==ei&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ve().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ie().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ie().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const yn=new F,jr=new F,Ps=new F,On=new F,ea=new F,Is=new F,ta=new F;class Er{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yn.copy(this.origin).addScaledVector(this.direction,t),yn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){jr.copy(e).add(t).multiplyScalar(.5),Ps.copy(t).sub(e).normalize(),On.copy(this.origin).sub(jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ps),o=On.dot(this.direction),l=-On.dot(Ps),c=On.lengthSq(),u=Math.abs(1-a*a);let h,d,f,m;if(u>0)if(h=a*l-o,d=a*o-l,m=r*u,h>=0)if(d>=-m)if(d<=m){const _=1/u;h*=_,d*=_,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-m?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=m?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(jr).addScaledVector(Ps,d),f}intersectSphere(e,t){yn.subVectors(e.center,this.origin);const i=yn.dot(this.direction),s=yn.dot(yn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,yn)!==null}intersectTriangle(e,t,i,s,r){ea.subVectors(t,e),Is.subVectors(i,e),ta.crossVectors(ea,Is);let a=this.direction.dot(ta),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;On.subVectors(this.origin,e);const l=o*this.direction.dot(Is.crossVectors(On,Is));if(l<0)return null;const c=o*this.direction.dot(ea.cross(On));if(c<0||l+c>a)return null;const u=-o*On.dot(ta);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class gd extends ci{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=Yc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ul=new it,Jn=new Er,Ds=new gs,Fl=new F,Ls=new F,Ns=new F,Us=new F,na=new F,Fs=new F,Ol=new F,Os=new F;class tn extends Et{constructor(e=new Ut,t=new gd){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Fs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(na.fromBufferAttribute(h,e),a?Fs.addScaledVector(na,u):Fs.addScaledVector(na.sub(t),u))}t.add(Fs)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ds.copy(i.boundingSphere),Ds.applyMatrix4(r),Jn.copy(e.ray).recast(e.near),!(Ds.containsPoint(Jn.origin)===!1&&(Jn.intersectSphere(Ds,Fl)===null||Jn.origin.distanceToSquared(Fl)>(e.far-e.near)**2))&&(Ul.copy(r).invert(),Jn.copy(e.ray).applyMatrix4(Ul),!(i.boundingBox!==null&&Jn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Jn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=a[g.materialIndex],b=Math.max(g.start,f.start),w=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=b,A=w;v<A;v+=3){const S=o.getX(v),T=o.getX(v+1),M=o.getX(v+2);s=Bs(this,p,e,i,c,u,h,S,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const m=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const b=o.getX(g),w=o.getX(g+1),v=o.getX(g+2);s=Bs(this,a,e,i,c,u,h,b,w,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=a[g.materialIndex],b=Math.max(g.start,f.start),w=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=b,A=w;v<A;v+=3){const S=v,T=v+1,M=v+2;s=Bs(this,p,e,i,c,u,h,S,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const b=g,w=g+1,v=g+2;s=Bs(this,a,e,i,c,u,h,b,w,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function U_(n,e,t,i,s,r,a,o){let l;if(e.side===kt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Wn,o),l===null)return null;Os.copy(o),Os.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Os);return c<t.near||c>t.far?null:{distance:c,point:Os.clone(),object:n}}function Bs(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Ls),n.getVertexPosition(l,Ns),n.getVertexPosition(c,Us);const u=U_(n,e,t,i,Ls,Ns,Us,Ol);if(u){const h=new F;jt.getBarycoord(Ol,Ls,Ns,Us,h),s&&(u.uv=jt.getInterpolatedAttribute(s,o,l,c,h,new Ie)),r&&(u.uv1=jt.getInterpolatedAttribute(r,o,l,c,h,new Ie)),a&&(u.normal=jt.getInterpolatedAttribute(a,o,l,c,h,new F),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new F,materialIndex:0};jt.getNormal(Ls,Ns,Us,d.normal),u.face=d,u.barycoord=h}return u}class F_ extends Lt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Tt,u=Tt,h,d){super(null,a,o,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ia=new F,O_=new F,B_=new Le;class kn{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ia.subVectors(i,t).cross(O_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(ia),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||B_.getNormalMatrix(e),s=this.coplanarPoint(ia).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Qn=new gs,k_=new Ie(.5,.5),ks=new F;class Do{constructor(e=new kn,t=new kn,i=new kn,s=new kn,r=new kn,a=new kn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=hn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],m=r[8],_=r[9],g=r[10],p=r[11],b=r[12],w=r[13],v=r[14],A=r[15];if(s[0].setComponents(c-a,f-u,p-m,A-b).normalize(),s[1].setComponents(c+a,f+u,p+m,A+b).normalize(),s[2].setComponents(c+o,f+h,p+_,A+w).normalize(),s[3].setComponents(c-o,f-h,p-_,A-w).normalize(),i)s[4].setComponents(l,d,g,v).normalize(),s[5].setComponents(c-l,f-d,p-g,A-v).normalize();else if(s[4].setComponents(c-l,f-d,p-g,A-v).normalize(),t===hn)s[5].setComponents(c+l,f+d,p+g,A+v).normalize();else if(t===us)s[5].setComponents(l,d,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(e){Qn.center.set(0,0,0);const t=k_.distanceTo(e.center);return Qn.radius=.7071067811865476+t,Qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ks.x=s.normal.x>0?e.max.x:e.min.x,ks.y=s.normal.y>0?e.max.y:e.min.y,ks.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ks)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class br extends ci{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const mr=new F,gr=new F,Bl=new it,Ji=new Er,Vs=new gs,sa=new F,kl=new F;class uo extends Et{constructor(e=new Ut,t=new br){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)mr.fromBufferAttribute(t,s-1),gr.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=mr.distanceTo(gr);e.setAttribute("lineDistance",new Nt(i,1))}else Re("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Vs.copy(i.boundingSphere),Vs.applyMatrix4(s),Vs.radius+=r,e.ray.intersectsSphere(Vs)===!1)return;Bl.copy(s).invert(),Ji.copy(e.ray).applyMatrix4(Bl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=c){const p=u.getX(_),b=u.getX(_+1),w=zs(this,e,Ji,l,p,b,_);w&&t.push(w)}if(this.isLineLoop){const _=u.getX(m-1),g=u.getX(f),p=zs(this,e,Ji,l,_,g,m-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=c){const p=zs(this,e,Ji,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=zs(this,e,Ji,l,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function zs(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(mr.fromBufferAttribute(o,s),gr.fromBufferAttribute(o,r),t.distanceSqToSegment(mr,gr,sa,kl)>i)return;sa.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(sa);if(!(c<e.near||c>e.far))return{distance:c,point:kl.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Vl=new F,zl=new F;class V_ extends uo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)Vl.fromBufferAttribute(t,s),zl.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Vl.distanceTo(zl);e.setAttribute("lineDistance",new Nt(i,1))}else Re("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class _d extends ci{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ve(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Gl=new it,ho=new Er,Gs=new gs,Hs=new F;class Hl extends Et{constructor(e=new Ut,t=new _d){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Gs.copy(i.boundingSphere),Gs.applyMatrix4(s),Gs.radius+=r,e.ray.intersectsSphere(Gs)===!1)return;Gl.copy(s).invert(),ho.copy(e.ray).applyMatrix4(Gl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,_=f;m<_;m++){const g=c.getX(m);Hs.fromBufferAttribute(h,g),Wl(Hs,g,l,s,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let m=d,_=f;m<_;m++)Hs.fromBufferAttribute(h,m),Wl(Hs,m,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Wl(n,e,t,i,s,r,a){const o=ho.distanceSqToPoint(n);if(o<t){const l=new F;ho.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class xd extends Lt{constructor(e=[],t=ai,i,s,r,a,o,l,c,u){super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Oi extends Lt{constructor(e,t,i=gn,s,r,a,o=Tt,l=Tt,c,u=Cn,h=1){if(u!==Cn&&u!==si)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Po(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class z_ extends Oi{constructor(e,t=gn,i=ai,s,r,a=Tt,o=Tt,l,c=Cn){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,s,r,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class vd extends Lt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class _s extends Ut{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,s,a,2),m("x","z","y",1,-1,e,i,-t,s,a,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Nt(c,3)),this.setAttribute("normal",new Nt(u,3)),this.setAttribute("uv",new Nt(h,2));function m(_,g,p,b,w,v,A,S,T,M,E){const C=v/T,P=A/M,I=v/2,X=A/2,W=S/2,U=T+1,G=M+1;let V=0,Y=0;const ne=new F;for(let K=0;K<G;K++){const $=K*P-X;for(let Q=0;Q<U;Q++){const ue=Q*C-I;ne[_]=ue*b,ne[g]=$*w,ne[p]=W,c.push(ne.x,ne.y,ne.z),ne[_]=0,ne[g]=0,ne[p]=S>0?1:-1,u.push(ne.x,ne.y,ne.z),h.push(Q/T),h.push(1-K/M),V+=1}}for(let K=0;K<M;K++)for(let $=0;$<T;$++){const Q=d+$+U*K,ue=d+$+U*(K+1),we=d+($+1)+U*(K+1),Te=d+($+1)+U*K;l.push(Q,ue,Te),l.push(ue,we,Te),Y+=6}o.addGroup(f,Y,E),f+=Y,d+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function G_(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=Md(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=Y_(n,e,r,t)),n.length>80*t){o=n[0],l=n[1];let u=o,h=l;for(let d=t;d<s;d+=t){const f=n[d],m=n[d+1];f<o&&(o=f),m<l&&(l=m),f>u&&(u=f),m>h&&(h=m)}c=Math.max(u-o,h-l),c=c!==0?32767/c:0}return fs(r,a,t,o,l,c,0),a}function Md(n,e,t,i,s){let r;if(s===s0(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=$l(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=$l(a/i|0,n[a],n[a+1],r);return r&&Bi(r,r.next)&&(ms(r),r=r.next),r}function li(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Bi(t,t.next)||rt(t.prev,t,t.next)===0)){if(ms(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function fs(n,e,t,i,s,r,a){if(!n)return;!a&&r&&Q_(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?W_(n,i,s,r):H_(n)){e.push(l.i,n.i,c.i),ms(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=$_(li(n),e),fs(n,e,t,i,s,r,2)):a===2&&X_(n,e,t,i,s,r):fs(li(n),e,t,i,s,r,1);break}}}function H_(n){const e=n.prev,t=n,i=n.next;if(rt(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,u=Math.min(s,r,a),h=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c);let m=i.next;for(;m!==e;){if(m.x>=u&&m.x<=d&&m.y>=h&&m.y<=f&&ss(s,o,r,l,a,c,m.x,m.y)&&rt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function W_(n,e,t,i){const s=n.prev,r=n,a=n.next;if(rt(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,u=s.y,h=r.y,d=a.y,f=Math.min(o,l,c),m=Math.min(u,h,d),_=Math.max(o,l,c),g=Math.max(u,h,d),p=fo(f,m,e,t,i),b=fo(_,g,e,t,i);let w=n.prevZ,v=n.nextZ;for(;w&&w.z>=p&&v&&v.z<=b;){if(w.x>=f&&w.x<=_&&w.y>=m&&w.y<=g&&w!==s&&w!==a&&ss(o,u,l,h,c,d,w.x,w.y)&&rt(w.prev,w,w.next)>=0||(w=w.prevZ,v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&ss(o,u,l,h,c,d,v.x,v.y)&&rt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;w&&w.z>=p;){if(w.x>=f&&w.x<=_&&w.y>=m&&w.y<=g&&w!==s&&w!==a&&ss(o,u,l,h,c,d,w.x,w.y)&&rt(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;v&&v.z<=b;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&ss(o,u,l,h,c,d,v.x,v.y)&&rt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function $_(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Bi(i,s)&&yd(i,t,t.next,s)&&ps(i,s)&&ps(s,i)&&(e.push(i.i,t.i,s.i),ms(t),ms(t.next),t=n=s),t=t.next}while(t!==n);return li(t)}function X_(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&t0(a,o)){let l=Ed(a,o);a=li(a,a.next),l=li(l,l.next),fs(a,e,t,i,s,r,0),fs(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function Y_(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=Md(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(e0(c))}s.sort(q_);for(let r=0;r<s.length;r++)t=Z_(s[r],t);return t}function q_(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Z_(n,e){const t=K_(n,e);if(!t)return e;const i=Ed(t,n);return li(i,i.next),li(t,t.next)}function K_(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(Bi(n,t))return t;do{if(Bi(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const h=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>r&&(r=h,a=t.x<t.next.x?t:t.next,h===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&Sd(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const h=Math.abs(s-t.y)/(i-t.x);ps(t,n)&&(h<u||h===u&&(t.x>a.x||t.x===a.x&&J_(a,t)))&&(a=t,u=h)}t=t.next}while(t!==o);return a}function J_(n,e){return rt(n.prev,n,e.prev)<0&&rt(e.next,n,n.next)<0}function Q_(n,e,t,i){let s=n;do s.z===0&&(s.z=fo(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,j_(s)}function j_(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function fo(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function e0(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Sd(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function ss(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&Sd(n,e,t,i,s,r,a,o)}function t0(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!n0(n,e)&&(ps(n,e)&&ps(e,n)&&i0(n,e)&&(rt(n.prev,n,e.prev)||rt(n,e.prev,e))||Bi(n,e)&&rt(n.prev,n,n.next)>0&&rt(e.prev,e,e.next)>0)}function rt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Bi(n,e){return n.x===e.x&&n.y===e.y}function yd(n,e,t,i){const s=$s(rt(n,e,t)),r=$s(rt(n,e,i)),a=$s(rt(t,i,n)),o=$s(rt(t,i,e));return!!(s!==r&&a!==o||s===0&&Ws(n,t,e)||r===0&&Ws(n,i,e)||a===0&&Ws(t,n,i)||o===0&&Ws(t,e,i))}function Ws(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function $s(n){return n>0?1:n<0?-1:0}function n0(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&yd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function ps(n,e){return rt(n.prev,n,n.next)<0?rt(n,e,n.next)>=0&&rt(n,n.prev,e)>=0:rt(n,e,n.prev)<0||rt(n,n.next,e)<0}function i0(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Ed(n,e){const t=po(n.i,n.x,n.y),i=po(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function $l(n,e,t,i){const s=po(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function ms(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function po(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function s0(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class r0{static triangulate(e,t,i=2){return G_(e,t,i)}}class Lo{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Lo.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Xl(e),Yl(i,e);let a=e.length;t.forEach(Xl);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Yl(i,t[l]);const o=r0.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Xl(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Yl(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Tr extends Ut{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,h=e/o,d=t/l,f=[],m=[],_=[],g=[];for(let p=0;p<u;p++){const b=p*d-a;for(let w=0;w<c;w++){const v=w*h-r;m.push(v,-b,0),_.push(0,0,1),g.push(w/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const w=b+c*p,v=b+c*(p+1),A=b+1+c*(p+1),S=b+1+c*p;f.push(w,v,S),f.push(v,A,S)}this.setIndex(f),this.setAttribute("position",new Nt(m,3)),this.setAttribute("normal",new Nt(_,3)),this.setAttribute("uv",new Nt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Tr(e.width,e.height,e.widthSegments,e.heightSegments)}}function ki(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(ql(s))s.isRenderTargetTexture?(Re("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(ql(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Dt(n){const e={};for(let t=0;t<n.length;t++){const i=ki(n[t]);for(const s in i)e[s]=i[s]}return e}function ql(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function a0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function bd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ge.workingColorSpace}const o0={clone:ki,merge:Dt};var l0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,c0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _n extends ci{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=l0,this.fragmentShader=c0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ki(e.uniforms),this.uniformsGroups=a0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Ve().setHex(s.value);break;case"v2":this.uniforms[i].value=new Ie().fromArray(s.value);break;case"v3":this.uniforms[i].value=new F().fromArray(s.value);break;case"v4":this.uniforms[i].value=new st().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Le().fromArray(s.value);break;case"m4":this.uniforms[i].value=new it().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class d0 extends _n{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class u0 extends ci{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=co,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class h0 extends ci{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class f0 extends ci{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ir extends br{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Td extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ve(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const ra=new it,Zl=new F,Kl=new F;class p0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.mapType=Wt,this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Do,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new st(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Zl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zl),Kl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Kl),t.updateMatrixWorld(),ra.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ra,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===us||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ra)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Xs=new F,Ys=new $n,on=new F;class Ad extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=hn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Xs,Ys,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xs,Ys,on.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Xs,Ys,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xs,Ys,on.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Bn=new F,Jl=new Ie,Ql=new Ie;class qt extends Ad{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=hs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return hs*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z)}getViewSize(e,t){return this.getViewBounds(e,Jl,Ql),t.subVectors(Ql,Jl)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(as*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class No extends Ad{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class m0 extends p0{constructor(){super(new No(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class jl extends Td{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new m0}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class g0 extends Td{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const bi=-90,Ti=1;class _0 extends Et{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new qt(bi,Ti,e,t);s.layers=this.layers,this.add(s);const r=new qt(bi,Ti,e,t);r.layers=this.layers,this.add(r);const a=new qt(bi,Ti,e,t);a.layers=this.layers,this.add(a);const o=new qt(bi,Ti,e,t);o.layers=this.layers,this.add(o);const l=new qt(bi,Ti,e,t);l.layers=this.layers,this.add(l);const c=new qt(bi,Ti,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===hn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===us)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class x0 extends qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class ec{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ke(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ke(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Vo=class Vo{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};Vo.prototype.isMatrix2=!0;let tc=Vo;class v0 extends V_{constructor(e=10,t=10,i=4473924,s=8947848){i=new Ve(i),s=new Ve(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,m=-o;d<=t;d++,m+=a){l.push(-o,0,m,o,0,m),l.push(m,0,-o,m,0,o);const _=d===r?i:s;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}const u=new Ut;u.setAttribute("position",new Nt(l,3)),u.setAttribute("color",new Nt(c,3));const h=new br({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class M0 extends Yn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Re("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function nc(n,e,t,i){const s=S0(i);switch(t){case ad:return n*e;case ld:return n*e/s.components*s.byteLength;case bo:return n*e/s.components*s.byteLength;case oi:return n*e*2/s.components*s.byteLength;case To:return n*e*2/s.components*s.byteLength;case od:return n*e*3/s.components*s.byteLength;case en:return n*e*4/s.components*s.byteLength;case Ao:return n*e*4/s.components*s.byteLength;case js:case er:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case tr:case nr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Na:case Fa:return Math.max(n,16)*Math.max(e,8)/4;case La:case Ua:return Math.max(n,8)*Math.max(e,8)/2;case Oa:case Ba:case Va:case za:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ka:case dr:case Ga:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case $a:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case qa:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Za:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ja:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case eo:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case to:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case no:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case io:case so:case ro:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ao:case oo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ur:case lo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function S0(n){switch(n){case Wt:case nd:return{byteLength:1,components:1};case cs:case id:case Rn:return{byteLength:2,components:1};case yo:case Eo:return{byteLength:2,components:4};case gn:case So:case un:return{byteLength:4,components:1};case sd:case rd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mo}}));typeof window<"u"&&(window.__THREE__?Re("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mo);function wd(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function y0(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,o),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<h.length;f++){const m=h[d],_=h[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,m=h.length;f<m;f++){const _=h[f];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var E0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,b0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,T0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,A0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,w0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,R0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,C0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,P0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,I0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,D0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,L0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,N0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,U0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,F0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,O0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,B0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,k0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,V0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,z0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,G0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,H0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,W0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,$0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,X0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Y0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,q0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Z0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,K0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,J0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Q0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,j0="gl_FragColor = linearToOutputTexel( gl_FragColor );",ex=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,nx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ix=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,sx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ax=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ox=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ux=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,px=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,mx=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,gx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_x=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Mx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Sx=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,yx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ex=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,bx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tx=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Ax=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Px=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ix=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Dx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Lx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ux=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Fx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ox=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Vx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Gx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Hx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$x=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Xx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Yx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,qx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Kx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Jx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Qx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,jx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ev=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,iv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,av=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ov=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,lv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,cv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,uv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,fv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_v=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Mv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Sv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,yv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ev=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Av=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Pv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Iv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Dv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Lv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Nv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Uv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Fv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ov=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Bv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Gv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Wv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,$v=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,qv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Qv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:E0,alphahash_pars_fragment:b0,alphamap_fragment:T0,alphamap_pars_fragment:A0,alphatest_fragment:w0,alphatest_pars_fragment:R0,aomap_fragment:C0,aomap_pars_fragment:P0,batching_pars_vertex:I0,batching_vertex:D0,begin_vertex:L0,beginnormal_vertex:N0,bsdfs:U0,iridescence_fragment:F0,bumpmap_pars_fragment:O0,clipping_planes_fragment:B0,clipping_planes_pars_fragment:k0,clipping_planes_pars_vertex:V0,clipping_planes_vertex:z0,color_fragment:G0,color_pars_fragment:H0,color_pars_vertex:W0,color_vertex:$0,common:X0,cube_uv_reflection_fragment:Y0,defaultnormal_vertex:q0,displacementmap_pars_vertex:Z0,displacementmap_vertex:K0,emissivemap_fragment:J0,emissivemap_pars_fragment:Q0,colorspace_fragment:j0,colorspace_pars_fragment:ex,envmap_fragment:tx,envmap_common_pars_fragment:nx,envmap_pars_fragment:ix,envmap_pars_vertex:sx,envmap_physical_pars_fragment:mx,envmap_vertex:rx,fog_vertex:ax,fog_pars_vertex:ox,fog_fragment:lx,fog_pars_fragment:cx,gradientmap_pars_fragment:dx,lightmap_pars_fragment:ux,lights_lambert_fragment:hx,lights_lambert_pars_fragment:fx,lights_pars_begin:px,lights_toon_fragment:gx,lights_toon_pars_fragment:_x,lights_phong_fragment:xx,lights_phong_pars_fragment:vx,lights_physical_fragment:Mx,lights_physical_pars_fragment:Sx,lights_fragment_begin:yx,lights_fragment_maps:Ex,lights_fragment_end:bx,lightprobes_pars_fragment:Tx,logdepthbuf_fragment:Ax,logdepthbuf_pars_fragment:wx,logdepthbuf_pars_vertex:Rx,logdepthbuf_vertex:Cx,map_fragment:Px,map_pars_fragment:Ix,map_particle_fragment:Dx,map_particle_pars_fragment:Lx,metalnessmap_fragment:Nx,metalnessmap_pars_fragment:Ux,morphinstance_vertex:Fx,morphcolor_vertex:Ox,morphnormal_vertex:Bx,morphtarget_pars_vertex:kx,morphtarget_vertex:Vx,normal_fragment_begin:zx,normal_fragment_maps:Gx,normal_pars_fragment:Hx,normal_pars_vertex:Wx,normal_vertex:$x,normalmap_pars_fragment:Xx,clearcoat_normal_fragment_begin:Yx,clearcoat_normal_fragment_maps:qx,clearcoat_pars_fragment:Zx,iridescence_pars_fragment:Kx,opaque_fragment:Jx,packing:Qx,premultiplied_alpha_fragment:jx,project_vertex:ev,dithering_fragment:tv,dithering_pars_fragment:nv,roughnessmap_fragment:iv,roughnessmap_pars_fragment:sv,shadowmap_pars_fragment:rv,shadowmap_pars_vertex:av,shadowmap_vertex:ov,shadowmask_pars_fragment:lv,skinbase_vertex:cv,skinning_pars_vertex:dv,skinning_vertex:uv,skinnormal_vertex:hv,specularmap_fragment:fv,specularmap_pars_fragment:pv,tonemapping_fragment:mv,tonemapping_pars_fragment:gv,transmission_fragment:_v,transmission_pars_fragment:xv,uv_pars_fragment:vv,uv_pars_vertex:Mv,uv_vertex:Sv,worldpos_vertex:yv,background_vert:Ev,background_frag:bv,backgroundCube_vert:Tv,backgroundCube_frag:Av,cube_vert:wv,cube_frag:Rv,depth_vert:Cv,depth_frag:Pv,distance_vert:Iv,distance_frag:Dv,equirect_vert:Lv,equirect_frag:Nv,linedashed_vert:Uv,linedashed_frag:Fv,meshbasic_vert:Ov,meshbasic_frag:Bv,meshlambert_vert:kv,meshlambert_frag:Vv,meshmatcap_vert:zv,meshmatcap_frag:Gv,meshnormal_vert:Hv,meshnormal_frag:Wv,meshphong_vert:$v,meshphong_frag:Xv,meshphysical_vert:Yv,meshphysical_frag:qv,meshtoon_vert:Zv,meshtoon_frag:Kv,points_vert:Jv,points_frag:Qv,shadow_vert:jv,shadow_frag:eM,sprite_vert:tM,sprite_frag:nM},fe={common:{diffuse:{value:new Ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},envMapRotation:{value:new Le},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new F},probesMax:{value:new F},probesResolution:{value:new F}},points:{diffuse:{value:new Ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new Ve(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},cn={basic:{uniforms:Dt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Dt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)},envMapIntensity:{value:1}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Dt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)},specular:{value:new Ve(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Dt([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Dt([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new Ve(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Dt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Dt([fe.points,fe.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Dt([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Dt([fe.common,fe.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Dt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Dt([fe.sprite,fe.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Le}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distance:{uniforms:Dt([fe.common,fe.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distance_vert,fragmentShader:Oe.distance_frag},shadow:{uniforms:Dt([fe.lights,fe.fog,{color:{value:new Ve(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};cn.physical={uniforms:Dt([cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new Ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new Ve(0)},specularColor:{value:new Ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const qs={r:0,b:0,g:0},iM=new it,Rd=new Le;Rd.set(-1,0,0,0,1,0,0,0,1);function sM(n,e,t,i,s,r){const a=new Ve(0);let o=s===!0?0:1,l,c,u=null,h=0,d=null;function f(b){let w=b.isScene===!0?b.background:null;if(w&&w.isTexture){const v=b.backgroundBlurriness>0;w=e.get(w,v)}return w}function m(b){let w=!1;const v=f(b);v===null?g(a,o):v&&v.isColor&&(g(v,1),w=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(b,w){const v=f(w);v&&(v.isCubeTexture||v.mapping===yr)?(c===void 0&&(c=new tn(new _s(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:ki(cn.backgroundCube.uniforms),vertexShader:cn.backgroundCube.vertexShader,fragmentShader:cn.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(iM.makeRotationFromEuler(w.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Rd),c.material.toneMapped=Ge.getTransfer(v.colorSpace)!==qe,(u!==v||h!==v.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=v,h=v.version,d=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new tn(new Tr(2,2),new _n({name:"BackgroundMaterial",uniforms:ki(cn.background.uniforms),vertexShader:cn.background.vertexShader,fragmentShader:cn.background.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=Ge.getTransfer(v.colorSpace)!==qe,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||h!==v.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,u=v,h=v.version,d=n.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function g(b,w){b.getRGB(qs,bd(n)),t.buffers.color.setClear(qs.r,qs.g,qs.b,w,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,w=1){a.set(b),o=w,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,g(a,o)},render:m,addToRenderList:_,dispose:p}}function rM(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(P,I,X,W,U){let G=!1;const V=h(P,W,X,I);r!==V&&(r=V,c(r.object)),G=f(P,W,X,U),G&&m(P,W,X,U),U!==null&&e.update(U,n.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,v(P,I,X,W),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return n.createVertexArray()}function c(P){return n.bindVertexArray(P)}function u(P){return n.deleteVertexArray(P)}function h(P,I,X,W){const U=W.wireframe===!0;let G=i[I.id];G===void 0&&(G={},i[I.id]=G);const V=P.isInstancedMesh===!0?P.id:0;let Y=G[V];Y===void 0&&(Y={},G[V]=Y);let ne=Y[X.id];ne===void 0&&(ne={},Y[X.id]=ne);let K=ne[U];return K===void 0&&(K=d(l()),ne[U]=K),K}function d(P){const I=[],X=[],W=[];for(let U=0;U<t;U++)I[U]=0,X[U]=0,W[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:X,attributeDivisors:W,object:P,attributes:{},index:null}}function f(P,I,X,W){const U=r.attributes,G=I.attributes;let V=0;const Y=X.getAttributes();for(const ne in Y)if(Y[ne].location>=0){const $=U[ne];let Q=G[ne];if(Q===void 0&&(ne==="instanceMatrix"&&P.instanceMatrix&&(Q=P.instanceMatrix),ne==="instanceColor"&&P.instanceColor&&(Q=P.instanceColor)),$===void 0||$.attribute!==Q||Q&&$.data!==Q.data)return!0;V++}return r.attributesNum!==V||r.index!==W}function m(P,I,X,W){const U={},G=I.attributes;let V=0;const Y=X.getAttributes();for(const ne in Y)if(Y[ne].location>=0){let $=G[ne];$===void 0&&(ne==="instanceMatrix"&&P.instanceMatrix&&($=P.instanceMatrix),ne==="instanceColor"&&P.instanceColor&&($=P.instanceColor));const Q={};Q.attribute=$,$&&$.data&&(Q.data=$.data),U[ne]=Q,V++}r.attributes=U,r.attributesNum=V,r.index=W}function _(){const P=r.newAttributes;for(let I=0,X=P.length;I<X;I++)P[I]=0}function g(P){p(P,0)}function p(P,I){const X=r.newAttributes,W=r.enabledAttributes,U=r.attributeDivisors;X[P]=1,W[P]===0&&(n.enableVertexAttribArray(P),W[P]=1),U[P]!==I&&(n.vertexAttribDivisor(P,I),U[P]=I)}function b(){const P=r.newAttributes,I=r.enabledAttributes;for(let X=0,W=I.length;X<W;X++)I[X]!==P[X]&&(n.disableVertexAttribArray(X),I[X]=0)}function w(P,I,X,W,U,G,V){V===!0?n.vertexAttribIPointer(P,I,X,U,G):n.vertexAttribPointer(P,I,X,W,U,G)}function v(P,I,X,W){_();const U=W.attributes,G=X.getAttributes(),V=I.defaultAttributeValues;for(const Y in G){const ne=G[Y];if(ne.location>=0){let K=U[Y];if(K===void 0&&(Y==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),Y==="instanceColor"&&P.instanceColor&&(K=P.instanceColor)),K!==void 0){const $=K.normalized,Q=K.itemSize,ue=e.get(K);if(ue===void 0)continue;const we=ue.buffer,Te=ue.type,q=ue.bytesPerElement,ae=Te===n.INT||Te===n.UNSIGNED_INT||K.gpuType===So;if(K.isInterleavedBufferAttribute){const ie=K.data,De=ie.stride,Ne=K.offset;if(ie.isInstancedInterleavedBuffer){for(let Ce=0;Ce<ne.locationSize;Ce++)p(ne.location+Ce,ie.meshPerAttribute);P.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Ce=0;Ce<ne.locationSize;Ce++)g(ne.location+Ce);n.bindBuffer(n.ARRAY_BUFFER,we);for(let Ce=0;Ce<ne.locationSize;Ce++)w(ne.location+Ce,Q/ne.locationSize,Te,$,De*q,(Ne+Q/ne.locationSize*Ce)*q,ae)}else{if(K.isInstancedBufferAttribute){for(let ie=0;ie<ne.locationSize;ie++)p(ne.location+ie,K.meshPerAttribute);P.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ie=0;ie<ne.locationSize;ie++)g(ne.location+ie);n.bindBuffer(n.ARRAY_BUFFER,we);for(let ie=0;ie<ne.locationSize;ie++)w(ne.location+ie,Q/ne.locationSize,Te,$,Q*q,Q/ne.locationSize*ie*q,ae)}}else if(V!==void 0){const $=V[Y];if($!==void 0)switch($.length){case 2:n.vertexAttrib2fv(ne.location,$);break;case 3:n.vertexAttrib3fv(ne.location,$);break;case 4:n.vertexAttrib4fv(ne.location,$);break;default:n.vertexAttrib1fv(ne.location,$)}}}}b()}function A(){E();for(const P in i){const I=i[P];for(const X in I){const W=I[X];for(const U in W){const G=W[U];for(const V in G)u(G[V].object),delete G[V];delete W[U]}}delete i[P]}}function S(P){if(i[P.id]===void 0)return;const I=i[P.id];for(const X in I){const W=I[X];for(const U in W){const G=W[U];for(const V in G)u(G[V].object),delete G[V];delete W[U]}}delete i[P.id]}function T(P){for(const I in i){const X=i[I];for(const W in X){const U=X[W];if(U[P.id]===void 0)continue;const G=U[P.id];for(const V in G)u(G[V].object),delete G[V];delete U[P.id]}}}function M(P){for(const I in i){const X=i[I],W=P.isInstancedMesh===!0?P.id:0,U=X[W];if(U!==void 0){for(const G in U){const V=U[G];for(const Y in V)u(V[Y].object),delete V[Y];delete U[G]}delete X[W],Object.keys(X).length===0&&delete i[I]}}}function E(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:A,releaseStatesOfGeometry:S,releaseStatesOfObject:M,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:g,disableUnusedAttributes:b}}function aM(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];t.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function oM(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==en&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const M=T===Rn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Wt&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==un&&!M)}function l(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Re("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Re("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),b=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),S=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:b,maxVaryings:w,maxFragmentUniforms:v,maxSamples:A,samples:S}}function lM(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new kn,o=new Le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||s;return s=d,i=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const m=h.clippingPlanes,_=h.clipIntersection,g=h.clipShadows,p=n.get(h);if(!s||m===null||m.length===0||r&&!g)r?u(null):c();else{const b=r?0:i,w=b*4;let v=p.clippingState||null;l.value=v,v=u(m,d,w,f);for(let A=0;A!==w;++A)v[A]=t[A];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,m){const _=h!==null?h.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=f+_*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(g===null||g.length<p)&&(g=new Float32Array(p));for(let w=0,v=f;w!==_;++w,v+=4)a.copy(h[w]).applyMatrix4(b,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}const zn=4,ic=[.125,.215,.35,.446,.526,.582],ti=20,cM=256,Qi=new No,sc=new Ve;let aa=null,oa=0,la=0,ca=!1;const dM=new F;class rc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=dM}=r;aa=this._renderer.getRenderTarget(),oa=this._renderer.getActiveCubeFace(),la=this._renderer.getActiveMipmapLevel(),ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=oc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(aa,oa,la),this._renderer.xr.enabled=ca,e.scissorTest=!1,Ai(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ai||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),aa=this._renderer.getRenderTarget(),oa=this._renderer.getActiveCubeFace(),la=this._renderer.getActiveMipmapLevel(),ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Pt,minFilter:Pt,generateMipmaps:!1,type:Rn,format:en,colorSpace:hr,depthBuffer:!1},s=ac(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ac(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=uM(r)),this._blurMaterial=fM(r,e,t),this._ggxMaterial=hM(r,e,t)}return s}_compileMaterial(e){const t=new tn(new Ut,e);this._renderer.compile(t,Qi)}_sceneToCubeUV(e,t,i,s,r){const l=new qt(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(sc),h.toneMapping=fn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new tn(new _s,new gd({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,g=_.material;let p=!1;const b=e.background;b?b.isColor&&(g.color.copy(b),e.background=null,p=!0):(g.color.copy(sc),p=!0);for(let w=0;w<6;w++){const v=w%3;v===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[w],r.y,r.z)):v===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[w]));const A=this._cubeSize;Ai(s,v*A,w>2?A:0,A,A),h.setRenderTarget(s),p&&h.render(_,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=b}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===ai||e.mapping===Fi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=lc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=oc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ai(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Qi)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,f=h*d,{_lodMax:m}=this,_=this._sizeLods[i],g=3*_*(i>m-zn?i-m+zn:0),p=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,Ai(r,g,p,3*_,2*_),s.setRenderTarget(r),s.render(o,Qi),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-i,Ai(e,g,p,3*_,2*_),s.setRenderTarget(e),s.render(o,Qi)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&$e("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[s];h.material=c;const d=c.uniforms,f=this._sizeLods[i]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ti-1),_=r/m,g=isFinite(r)?1+Math.floor(u*_):ti;g>ti&&Re(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ti}`);const p=[];let b=0;for(let T=0;T<ti;++T){const M=T/_,E=Math.exp(-M*M/2);p.push(E),T===0?b+=E:T<g&&(b+=2*E)}for(let T=0;T<p.length;T++)p[T]=p[T]/b;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:w}=this;d.dTheta.value=m,d.mipInt.value=w-i;const v=this._sizeLods[s],A=3*v*(s>w-zn?s-w+zn:0),S=4*(this._cubeSize-v);Ai(t,A,S,3*v,2*v),l.setRenderTarget(t),l.render(h,Qi)}}function uM(n){const e=[],t=[],i=[];let s=n;const r=n-zn+1+ic.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-zn?l=ic[a-n+zn-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,m=6,_=3,g=2,p=1,b=new Float32Array(_*m*f),w=new Float32Array(g*m*f),v=new Float32Array(p*m*f);for(let S=0;S<f;S++){const T=S%3*2/3-1,M=S>2?0:-1,E=[T,M,0,T+2/3,M,0,T+2/3,M+1,0,T,M,0,T+2/3,M+1,0,T,M+1,0];b.set(E,_*m*S),w.set(d,g*m*S);const C=[S,S,S,S,S,S];v.set(C,p*m*S)}const A=new Ut;A.setAttribute("position",new mn(b,_)),A.setAttribute("uv",new mn(w,g)),A.setAttribute("faceIndex",new mn(v,p)),i.push(new tn(A,null)),s>zn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function ac(n,e,t){const i=new pn(n,e,t);return i.texture.mapping=yr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ai(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function hM(n,e,t){return new _n({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:cM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ar(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function fM(n,e,t){const i=new Float32Array(ti),s=new F(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ar(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function oc(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ar(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function lc(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ar(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Ar(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Cd extends pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new xd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new _s(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:ki(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:kt,blending:An});r.uniforms.tEquirect.value=t;const a=new tn(s,r),o=t.minFilter;return t.minFilter===ii&&(t.minFilter=Pt),new _0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}function pM(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Lr||f===Nr)if(e.has(d)){const m=e.get(d).texture;return o(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const _=new Cd(m.height);return _.fromEquirectangularTexture(n,d),e.set(d,_),d.addEventListener("dispose",c),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,m=f===Lr||f===Nr,_=f===ai||f===Fi;if(m||_){let g=t.get(d);const p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return i===null&&(i=new rc(n)),g=m?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const b=d.image;return m&&b&&b.height>0||_&&b&&l(b)?(i===null&&(i=new rc(n)),g=m?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",u),g.texture):null}}}return d}function o(d,f){return f===Lr?d.mapping=ai:f===Nr&&(d.mapping=Fi),d}function l(d){let f=0;const m=6;for(let _=0;_<m;_++)d[_]!==void 0&&f++;return f===m}function c(d){const f=d.target;f.removeEventListener("dispose",c);const m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(d){const f=d.target;f.removeEventListener("dispose",u);const m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function mM(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ii("WebGLRenderer: "+i+" extension not supported."),s}}}function gM(n,e,t,i){const s={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,m=h.attributes.position;let _=0;if(m===void 0)return;if(f!==null){const b=f.array;_=f.version;for(let w=0,v=b.length;w<v;w+=3){const A=b[w+0],S=b[w+1],T=b[w+2];d.push(A,S,S,T,T,A)}}else{const b=m.array;_=m.version;for(let w=0,v=b.length/3-1;w<v;w+=3){const A=w+0,S=w+1,T=w+2;d.push(A,S,S,T,T,A)}}const g=new(m.count>=65535?md:pd)(d,1);g.version=_;const p=r.get(h);p&&e.remove(p),r.set(h,g)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function _M(n,e,t){let i;function s(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,d){n.drawElements(i,d,r,h*a),t.update(d,i,1)}function c(h,d,f){f!==0&&(n.drawElementsInstanced(i,d,r,h*a,f),t.update(d,i,f))}function u(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,h,0,f);let _=0;for(let g=0;g<f;g++)_+=d[g];t.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function xM(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:$e("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function vM(n,e,t){const i=new WeakMap,s=new st;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let E=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let w=0;f===!0&&(w=1),m===!0&&(w=2),_===!0&&(w=3);let v=o.attributes.position.count*w,A=1;v>e.maxTextureSize&&(A=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const S=new Float32Array(v*A*4*h),T=new ud(S,v,A,h);T.type=un,T.needsUpdate=!0;const M=w*4;for(let C=0;C<h;C++){const P=g[C],I=p[C],X=b[C],W=v*A*4*C;for(let U=0;U<P.count;U++){const G=U*M;f===!0&&(s.fromBufferAttribute(P,U),S[W+G+0]=s.x,S[W+G+1]=s.y,S[W+G+2]=s.z,S[W+G+3]=0),m===!0&&(s.fromBufferAttribute(I,U),S[W+G+4]=s.x,S[W+G+5]=s.y,S[W+G+6]=s.z,S[W+G+7]=0),_===!0&&(s.fromBufferAttribute(X,U),S[W+G+8]=s.x,S[W+G+9]=s.y,S[W+G+10]=s.z,S[W+G+11]=X.itemSize===4?s.w:1)}}d={count:h,texture:T,size:new Ie(v,A)},i.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function MM(n,e,t,i,s){let r=new WeakMap;function a(c){const u=s.render.frame,h=c.geometry,d=e.get(c,h);if(r.get(d)!==u&&(e.update(d),r.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const SM={[qc]:"LINEAR_TONE_MAPPING",[Zc]:"REINHARD_TONE_MAPPING",[Kc]:"CINEON_TONE_MAPPING",[Jc]:"ACES_FILMIC_TONE_MAPPING",[jc]:"AGX_TONE_MAPPING",[ed]:"NEUTRAL_TONE_MAPPING",[Qc]:"CUSTOM_TONE_MAPPING"};function yM(n,e,t,i,s,r){const a=new pn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,depthTexture:s?new Oi(e,t):void 0}),o=new pn(e,t,{type:Rn,depthBuffer:!1,stencilBuffer:!1}),l=new Ut;l.setAttribute("position",new Nt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Nt([0,2,0,0,2,0],2));const c=new d0({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new tn(l,c),h=new No(-1,1,1,-1,0,1);let d=null,f=null,m=!1,_,g=null,p=[],b=!1;this.setSize=function(w,v){a.setSize(w,v),o.setSize(w,v);for(let A=0;A<p.length;A++){const S=p[A];S.setSize&&S.setSize(w,v)}},this.setEffects=function(w){p=w,b=p.length>0&&p[0].isRenderPass===!0;const v=a.width,A=a.height;for(let S=0;S<p.length;S++){const T=p[S];T.setSize&&T.setSize(v,A)}},this.begin=function(w,v){if(m||w.toneMapping===fn&&p.length===0)return!1;if(g=v,v!==null){const A=v.width,S=v.height;(a.width!==A||a.height!==S)&&this.setSize(A,S)}return b===!1&&w.setRenderTarget(a),_=w.toneMapping,w.toneMapping=fn,!0},this.hasRenderPass=function(){return b},this.end=function(w,v){w.toneMapping=_,m=!0;let A=a,S=o;for(let T=0;T<p.length;T++){const M=p[T];if(M.enabled!==!1&&(M.render(w,S,A,v),M.needsSwap!==!1)){const E=A;A=S,S=E}}if(d!==w.outputColorSpace||f!==w.toneMapping){d=w.outputColorSpace,f=w.toneMapping,c.defines={},Ge.getTransfer(d)===qe&&(c.defines.SRGB_TRANSFER="");const T=SM[f];T&&(c.defines[T]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,w.setRenderTarget(g),w.render(u,h),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Pd=new Lt,mo=new Oi(1,1),Id=new ud,Dd=new y_,Ld=new xd,cc=[],dc=[],uc=new Float32Array(16),hc=new Float32Array(9),fc=new Float32Array(4);function Gi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=cc[s];if(r===void 0&&(r=new Float32Array(s),cc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function vt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Mt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function wr(n,e){let t=dc[e];t===void 0&&(t=new Int32Array(e),dc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function EM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function bM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2fv(this.addr,e),Mt(t,e)}}function TM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vt(t,e))return;n.uniform3fv(this.addr,e),Mt(t,e)}}function AM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4fv(this.addr,e),Mt(t,e)}}function wM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,i))return;fc.set(i),n.uniformMatrix2fv(this.addr,!1,fc),Mt(t,i)}}function RM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,i))return;hc.set(i),n.uniformMatrix3fv(this.addr,!1,hc),Mt(t,i)}}function CM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,i))return;uc.set(i),n.uniformMatrix4fv(this.addr,!1,uc),Mt(t,i)}}function PM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function IM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2iv(this.addr,e),Mt(t,e)}}function DM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3iv(this.addr,e),Mt(t,e)}}function LM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4iv(this.addr,e),Mt(t,e)}}function NM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function UM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2uiv(this.addr,e),Mt(t,e)}}function FM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3uiv(this.addr,e),Mt(t,e)}}function OM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4uiv(this.addr,e),Mt(t,e)}}function BM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(mo.compareFunction=t.isReversedDepthBuffer()?Ro:wo,r=mo):r=Pd,t.setTexture2D(e||r,s)}function kM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Dd,s)}function VM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Ld,s)}function zM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Id,s)}function GM(n){switch(n){case 5126:return EM;case 35664:return bM;case 35665:return TM;case 35666:return AM;case 35674:return wM;case 35675:return RM;case 35676:return CM;case 5124:case 35670:return PM;case 35667:case 35671:return IM;case 35668:case 35672:return DM;case 35669:case 35673:return LM;case 5125:return NM;case 36294:return UM;case 36295:return FM;case 36296:return OM;case 35678:case 36198:case 36298:case 36306:case 35682:return BM;case 35679:case 36299:case 36307:return kM;case 35680:case 36300:case 36308:case 36293:return VM;case 36289:case 36303:case 36311:case 36292:return zM}}function HM(n,e){n.uniform1fv(this.addr,e)}function WM(n,e){const t=Gi(e,this.size,2);n.uniform2fv(this.addr,t)}function $M(n,e){const t=Gi(e,this.size,3);n.uniform3fv(this.addr,t)}function XM(n,e){const t=Gi(e,this.size,4);n.uniform4fv(this.addr,t)}function YM(n,e){const t=Gi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function qM(n,e){const t=Gi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function ZM(n,e){const t=Gi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function KM(n,e){n.uniform1iv(this.addr,e)}function JM(n,e){n.uniform2iv(this.addr,e)}function QM(n,e){n.uniform3iv(this.addr,e)}function jM(n,e){n.uniform4iv(this.addr,e)}function eS(n,e){n.uniform1uiv(this.addr,e)}function tS(n,e){n.uniform2uiv(this.addr,e)}function nS(n,e){n.uniform3uiv(this.addr,e)}function iS(n,e){n.uniform4uiv(this.addr,e)}function sS(n,e,t){const i=this.cache,s=e.length,r=wr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=mo:a=Pd;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function rS(n,e,t){const i=this.cache,s=e.length,r=wr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Dd,r[a])}function aS(n,e,t){const i=this.cache,s=e.length,r=wr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Ld,r[a])}function oS(n,e,t){const i=this.cache,s=e.length,r=wr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Id,r[a])}function lS(n){switch(n){case 5126:return HM;case 35664:return WM;case 35665:return $M;case 35666:return XM;case 35674:return YM;case 35675:return qM;case 35676:return ZM;case 5124:case 35670:return KM;case 35667:case 35671:return JM;case 35668:case 35672:return QM;case 35669:case 35673:return jM;case 5125:return eS;case 36294:return tS;case 36295:return nS;case 36296:return iS;case 35678:case 36198:case 36298:case 36306:case 35682:return sS;case 35679:case 36299:case 36307:return rS;case 35680:case 36300:case 36308:case 36293:return aS;case 36289:case 36303:case 36311:case 36292:return oS}}class cS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=GM(t.type)}}class dS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lS(t.type)}}class uS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const da=/(\w+)(\])?(\[|\.)?/g;function pc(n,e){n.seq.push(e),n.map[e.id]=e}function hS(n,e,t){const i=n.name,s=i.length;for(da.lastIndex=0;;){const r=da.exec(i),a=da.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){pc(t,c===void 0?new cS(o,n,e):new dS(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new uS(o),pc(t,h)),t=h}}}class sr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);hS(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function mc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const fS=37297;let pS=0;function mS(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const gc=new Le;function gS(n){Ge._getMatrix(gc,Ge.workingColorSpace,n);const e=`mat3( ${gc.elements.map(t=>t.toFixed(4))} )`;switch(Ge.getTransfer(n)){case fr:return[e,"LinearTransferOETF"];case qe:return[e,"sRGBTransferOETF"];default:return Re("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function _c(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+mS(n.getShaderSource(e),o)}else return r}function _S(n,e){const t=gS(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const xS={[qc]:"Linear",[Zc]:"Reinhard",[Kc]:"Cineon",[Jc]:"ACESFilmic",[jc]:"AgX",[ed]:"Neutral",[Qc]:"Custom"};function vS(n,e){const t=xS[e];return t===void 0?(Re("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Zs=new F;function MS(){Ge.getLuminanceCoefficients(Zs);const n=Zs.x.toFixed(4),e=Zs.y.toFixed(4),t=Zs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function SS(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rs).join(`
`)}function yS(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ES(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function rs(n){return n!==""}function xc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function vc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const bS=/^[ \t]*#include +<([\w\d./]+)>/gm;function go(n){return n.replace(bS,AS)}const TS=new Map;function AS(n,e){let t=Oe[e];if(t===void 0){const i=TS.get(e);if(i!==void 0)t=Oe[i],Re('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return go(t)}const wS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mc(n){return n.replace(wS,RS)}function RS(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sc(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const CS={[Qs]:"SHADOWMAP_TYPE_PCF",[ns]:"SHADOWMAP_TYPE_VSM"};function PS(n){return CS[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const IS={[ai]:"ENVMAP_TYPE_CUBE",[Fi]:"ENVMAP_TYPE_CUBE",[yr]:"ENVMAP_TYPE_CUBE_UV"};function DS(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":IS[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const LS={[Fi]:"ENVMAP_MODE_REFRACTION"};function NS(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":LS[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const US={[Yc]:"ENVMAP_BLENDING_MULTIPLY",[Vg]:"ENVMAP_BLENDING_MIX",[zg]:"ENVMAP_BLENDING_ADD"};function FS(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":US[n.combine]||"ENVMAP_BLENDING_NONE"}function OS(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function BS(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=PS(t),c=DS(t),u=NS(t),h=FS(t),d=OS(t),f=SS(t),m=yS(r),_=s.createProgram();let g,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(rs).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(rs).join(`
`),p.length>0&&(p+=`
`)):(g=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),p=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==fn?"#define TONE_MAPPING":"",t.toneMapping!==fn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==fn?vS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,_S("linearToOutputTexel",t.outputColorSpace),MS(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(rs).join(`
`)),a=go(a),a=xc(a,t),a=vc(a,t),o=go(o),o=xc(o,t),o=vc(o,t),a=Mc(a),o=Mc(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Ml?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ml?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=b+g+a,v=b+p+o,A=mc(s,s.VERTEX_SHADER,w),S=mc(s,s.FRAGMENT_SHADER,v);s.attachShader(_,A),s.attachShader(_,S),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(P){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(_)||"",X=s.getShaderInfoLog(A)||"",W=s.getShaderInfoLog(S)||"",U=I.trim(),G=X.trim(),V=W.trim();let Y=!0,ne=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,A,S);else{const K=_c(s,A,"vertex"),$=_c(s,S,"fragment");$e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+U+`
`+K+`
`+$)}else U!==""?Re("WebGLProgram: Program Info Log:",U):(G===""||V==="")&&(ne=!1);ne&&(P.diagnostics={runnable:Y,programLog:U,vertexShader:{log:G,prefix:g},fragmentShader:{log:V,prefix:p}})}s.deleteShader(A),s.deleteShader(S),M=new sr(s,_),E=ES(s,_)}let M;this.getUniforms=function(){return M===void 0&&T(this),M};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(_,fS)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pS++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=S,this}let kS=0;class VS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new zS(e),t.set(e,i)),i}}class zS{constructor(e){this.id=kS++,this.code=e,this.usedTimes=0}}function GS(n){return n===oi||n===dr||n===ur}function HS(n,e,t,i,s,r){const a=new hd,o=new VS,l=new Set,c=[],u=new Map,h=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(M){return l.add(M),M===0?"uv":`uv${M}`}function _(M,E,C,P,I,X){const W=P.fog,U=I.geometry,G=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?P.environment:null,V=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap,Y=e.get(M.envMap||G,V),ne=Y&&Y.mapping===yr?Y.image.height:null,K=f[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&Re("WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const $=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Q=$!==void 0?$.length:0;let ue=0;U.morphAttributes.position!==void 0&&(ue=1),U.morphAttributes.normal!==void 0&&(ue=2),U.morphAttributes.color!==void 0&&(ue=3);let we,Te,q,ae;if(K){const ve=cn[K];we=ve.vertexShader,Te=ve.fragmentShader}else{we=M.vertexShader,Te=M.fragmentShader;const ve=o.getVertexShaderStage(M),ot=o.getFragmentShaderStage(M);o.update(M,ve,ot),q=ve.id,ae=ot.id}const ie=n.getRenderTarget(),De=n.state.buffers.depth.getReversed(),Ne=I.isInstancedMesh===!0,Ce=I.isBatchedMesh===!0,ct=!!M.map,ze=!!M.matcap,Je=!!Y,Xe=!!M.aoMap,He=!!M.lightMap,pt=!!M.bumpMap&&M.wireframe===!1,_t=!!M.normalMap,St=!!M.displacementMap,bt=!!M.emissiveMap,at=!!M.metalnessMap,mt=!!M.roughnessMap,L=M.anisotropy>0,Ft=M.clearcoat>0,Ye=M.dispersion>0,R=M.iridescence>0,x=M.sheen>0,O=M.transmission>0,z=L&&!!M.anisotropyMap,Z=Ft&&!!M.clearcoatMap,se=Ft&&!!M.clearcoatNormalMap,oe=Ft&&!!M.clearcoatRoughnessMap,J=R&&!!M.iridescenceMap,ee=R&&!!M.iridescenceThicknessMap,le=x&&!!M.sheenColorMap,ye=x&&!!M.sheenRoughnessMap,he=!!M.specularMap,ce=!!M.specularColorMap,Ae=!!M.specularIntensityMap,Pe=O&&!!M.transmissionMap,Ue=O&&!!M.thicknessMap,D=!!M.gradientMap,re=!!M.alphaMap,j=M.alphaTest>0,de=!!M.alphaHash,ge=!!M.extensions;let te=fn;M.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(te=n.toneMapping);const Se={shaderID:K,shaderType:M.type,shaderName:M.name,vertexShader:we,fragmentShader:Te,defines:M.defines,customVertexShaderID:q,customFragmentShaderID:ae,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Ce,batchingColor:Ce&&I._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&I.instanceColor!==null,instancingMorph:Ne&&I.morphTexture!==null,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Ge.workingColorSpace,alphaToCoverage:!!M.alphaToCoverage,map:ct,matcap:ze,envMap:Je,envMapMode:Je&&Y.mapping,envMapCubeUVHeight:ne,aoMap:Xe,lightMap:He,bumpMap:pt,normalMap:_t,displacementMap:St,emissiveMap:bt,normalMapObjectSpace:_t&&M.normalMapType===Wg,normalMapTangentSpace:_t&&M.normalMapType===co,packedNormalMap:_t&&M.normalMapType===co&&GS(M.normalMap.format),metalnessMap:at,roughnessMap:mt,anisotropy:L,anisotropyMap:z,clearcoat:Ft,clearcoatMap:Z,clearcoatNormalMap:se,clearcoatRoughnessMap:oe,dispersion:Ye,iridescence:R,iridescenceMap:J,iridescenceThicknessMap:ee,sheen:x,sheenColorMap:le,sheenRoughnessMap:ye,specularMap:he,specularColorMap:ce,specularIntensityMap:Ae,transmission:O,transmissionMap:Pe,thicknessMap:Ue,gradientMap:D,opaque:M.transparent===!1&&M.blending===Pi&&M.alphaToCoverage===!1,alphaMap:re,alphaTest:j,alphaHash:de,combine:M.combine,mapUv:ct&&m(M.map.channel),aoMapUv:Xe&&m(M.aoMap.channel),lightMapUv:He&&m(M.lightMap.channel),bumpMapUv:pt&&m(M.bumpMap.channel),normalMapUv:_t&&m(M.normalMap.channel),displacementMapUv:St&&m(M.displacementMap.channel),emissiveMapUv:bt&&m(M.emissiveMap.channel),metalnessMapUv:at&&m(M.metalnessMap.channel),roughnessMapUv:mt&&m(M.roughnessMap.channel),anisotropyMapUv:z&&m(M.anisotropyMap.channel),clearcoatMapUv:Z&&m(M.clearcoatMap.channel),clearcoatNormalMapUv:se&&m(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&m(M.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&m(M.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&m(M.iridescenceThicknessMap.channel),sheenColorMapUv:le&&m(M.sheenColorMap.channel),sheenRoughnessMapUv:ye&&m(M.sheenRoughnessMap.channel),specularMapUv:he&&m(M.specularMap.channel),specularColorMapUv:ce&&m(M.specularColorMap.channel),specularIntensityMapUv:Ae&&m(M.specularIntensityMap.channel),transmissionMapUv:Pe&&m(M.transmissionMap.channel),thicknessMapUv:Ue&&m(M.thicknessMap.channel),alphaMapUv:re&&m(M.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(_t||L),vertexNormals:!!U.attributes.normal,vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!U.attributes.uv&&(ct||re),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.wireframe===!1&&(M.flatShading===!0||U.attributes.normal===void 0&&_t===!1&&(M.isMeshLambertMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isMeshPhysicalMaterial)),sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:De,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:ue,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:te,decodeVideoTexture:ct&&M.map.isVideoTexture===!0&&Ge.getTransfer(M.map.colorSpace)===qe,decodeVideoTextureEmissive:bt&&M.emissiveMap.isVideoTexture===!0&&Ge.getTransfer(M.emissiveMap.colorSpace)===qe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===dn,flipSided:M.side===kt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:ge&&M.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&M.extensions.multiDraw===!0||Ce)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Se.vertexUv1s=l.has(1),Se.vertexUv2s=l.has(2),Se.vertexUv3s=l.has(3),l.clear(),Se}function g(M){const E=[];if(M.shaderID?E.push(M.shaderID):(E.push(M.customVertexShaderID),E.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)E.push(C),E.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(p(E,M),b(E,M),E.push(n.outputColorSpace)),E.push(M.customProgramCacheKey),E.join()}function p(M,E){M.push(E.precision),M.push(E.outputColorSpace),M.push(E.envMapMode),M.push(E.envMapCubeUVHeight),M.push(E.mapUv),M.push(E.alphaMapUv),M.push(E.lightMapUv),M.push(E.aoMapUv),M.push(E.bumpMapUv),M.push(E.normalMapUv),M.push(E.displacementMapUv),M.push(E.emissiveMapUv),M.push(E.metalnessMapUv),M.push(E.roughnessMapUv),M.push(E.anisotropyMapUv),M.push(E.clearcoatMapUv),M.push(E.clearcoatNormalMapUv),M.push(E.clearcoatRoughnessMapUv),M.push(E.iridescenceMapUv),M.push(E.iridescenceThicknessMapUv),M.push(E.sheenColorMapUv),M.push(E.sheenRoughnessMapUv),M.push(E.specularMapUv),M.push(E.specularColorMapUv),M.push(E.specularIntensityMapUv),M.push(E.transmissionMapUv),M.push(E.thicknessMapUv),M.push(E.combine),M.push(E.fogExp2),M.push(E.sizeAttenuation),M.push(E.morphTargetsCount),M.push(E.morphAttributeCount),M.push(E.numDirLights),M.push(E.numPointLights),M.push(E.numSpotLights),M.push(E.numSpotLightMaps),M.push(E.numHemiLights),M.push(E.numRectAreaLights),M.push(E.numDirLightShadows),M.push(E.numPointLightShadows),M.push(E.numSpotLightShadows),M.push(E.numSpotLightShadowsWithMaps),M.push(E.numLightProbes),M.push(E.shadowMapType),M.push(E.toneMapping),M.push(E.numClippingPlanes),M.push(E.numClipIntersection),M.push(E.depthPacking)}function b(M,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),M.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),M.push(a.mask)}function w(M){const E=f[M.type];let C;if(E){const P=cn[E];C=o0.clone(P.uniforms)}else C=M.uniforms;return C}function v(M,E){let C=u.get(E);return C!==void 0?++C.usedTimes:(C=new BS(n,E,M,s),c.push(C),u.set(E,C)),C}function A(M){if(--M.usedTimes===0){const E=c.indexOf(M);c[E]=c[c.length-1],c.pop(),u.delete(M.cacheKey),M.destroy()}}function S(M){o.remove(M)}function T(){o.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:w,acquireProgram:v,releaseProgram:A,releaseShaderCache:S,programs:c,dispose:T}}function WS(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function $S(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function yc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Ec(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,_,g,p){let b=n[e];return b===void 0?(b={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:g,group:p},n[e]=b):(b.id=d.id,b.object=d,b.geometry=f,b.material=m,b.materialVariant=a(d),b.groupOrder=_,b.renderOrder=d.renderOrder,b.z=g,b.group=p),e++,b}function l(d,f,m,_,g,p){const b=o(d,f,m,_,g,p);m.transmission>0?i.push(b):m.transparent===!0?s.push(b):t.push(b)}function c(d,f,m,_,g,p){const b=o(d,f,m,_,g,p);m.transmission>0?i.unshift(b):m.transparent===!0?s.unshift(b):t.unshift(b)}function u(d,f,m){t.length>1&&t.sort(d||$S),i.length>1&&i.sort(f||yc),s.length>1&&s.sort(f||yc),m&&(t.reverse(),i.reverse(),s.reverse())}function h(){for(let d=e,f=n.length;d<f;d++){const m=n[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:h,sort:u}}function XS(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Ec,n.set(i,[a])):s>=r.length?(a=new Ec,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function YS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Ve};break;case"SpotLight":t={position:new F,direction:new F,color:new Ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Ve,groundColor:new Ve};break;case"RectAreaLight":t={color:new Ve,position:new F,halfWidth:new F,halfHeight:new F};break}return n[e.id]=t,t}}}function qS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let ZS=0;function KS(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function JS(n){const e=new YS,t=qS(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new F);const s=new F,r=new it,a=new it;function o(c){let u=0,h=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,b=0,w=0,v=0,A=0,S=0,T=0;c.sort(KS);for(let E=0,C=c.length;E<C;E++){const P=c[E],I=P.color,X=P.intensity,W=P.distance;let U=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===oi?U=P.shadow.map.texture:U=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=I.r*X,h+=I.g*X,d+=I.b*X;else if(P.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(P.sh.coefficients[G],X);T++}else if(P.isDirectionalLight){const G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const V=P.shadow,Y=t.get(P);Y.shadowIntensity=V.intensity,Y.shadowBias=V.bias,Y.shadowNormalBias=V.normalBias,Y.shadowRadius=V.radius,Y.shadowMapSize=V.mapSize,i.directionalShadow[f]=Y,i.directionalShadowMap[f]=U,i.directionalShadowMatrix[f]=P.shadow.matrix,b++}i.directional[f]=G,f++}else if(P.isSpotLight){const G=e.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(I).multiplyScalar(X),G.distance=W,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,i.spot[_]=G;const V=P.shadow;if(P.map&&(i.spotLightMap[A]=P.map,A++,V.updateMatrices(P),P.castShadow&&S++),i.spotLightMatrix[_]=V.matrix,P.castShadow){const Y=t.get(P);Y.shadowIntensity=V.intensity,Y.shadowBias=V.bias,Y.shadowNormalBias=V.normalBias,Y.shadowRadius=V.radius,Y.shadowMapSize=V.mapSize,i.spotShadow[_]=Y,i.spotShadowMap[_]=U,v++}_++}else if(P.isRectAreaLight){const G=e.get(P);G.color.copy(I).multiplyScalar(X),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=G,g++}else if(P.isPointLight){const G=e.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){const V=P.shadow,Y=t.get(P);Y.shadowIntensity=V.intensity,Y.shadowBias=V.bias,Y.shadowNormalBias=V.normalBias,Y.shadowRadius=V.radius,Y.shadowMapSize=V.mapSize,Y.shadowCameraNear=V.camera.near,Y.shadowCameraFar=V.camera.far,i.pointShadow[m]=Y,i.pointShadowMap[m]=U,i.pointShadowMatrix[m]=P.shadow.matrix,w++}i.point[m]=G,m++}else if(P.isHemisphereLight){const G=e.get(P);G.skyColor.copy(P.color).multiplyScalar(X),G.groundColor.copy(P.groundColor).multiplyScalar(X),i.hemi[p]=G,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=fe.LTC_FLOAT_1,i.rectAreaLTC2=fe.LTC_FLOAT_2):(i.rectAreaLTC1=fe.LTC_HALF_1,i.rectAreaLTC2=fe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const M=i.hash;(M.directionalLength!==f||M.pointLength!==m||M.spotLength!==_||M.rectAreaLength!==g||M.hemiLength!==p||M.numDirectionalShadows!==b||M.numPointShadows!==w||M.numSpotShadows!==v||M.numSpotMaps!==A||M.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=v+A-S,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=T,M.directionalLength=f,M.pointLength=m,M.spotLength=_,M.rectAreaLength=g,M.hemiLength=p,M.numDirectionalShadows=b,M.numPointShadows=w,M.numSpotShadows=v,M.numSpotMaps=A,M.numLightProbes=T,i.version=ZS++)}function l(c,u){let h=0,d=0,f=0,m=0,_=0;const g=u.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const w=c[p];if(w.isDirectionalLight){const v=i.directional[h];v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),h++}else if(w.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),f++}else if(w.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(g),a.identity(),r.copy(w.matrixWorld),r.premultiply(g),a.extractRotation(r),v.halfWidth.set(w.width*.5,0,0),v.halfHeight.set(0,w.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),m++}else if(w.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(g),d++}else if(w.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(w.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:i}}function bc(n){const e=new JS(n),t=[],i=[],s=[];function r(d){h.camera=d,t.length=0,i.length=0,s.length=0}function a(d){t.push(d)}function o(d){i.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function u(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function QS(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new bc(n),e.set(s,[o])):r>=a.length?(o=new bc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const jS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ey=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ty=[new F(1,0,0),new F(-1,0,0),new F(0,1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1)],ny=[new F(0,-1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1),new F(0,-1,0),new F(0,-1,0)],Tc=new it,ji=new F,ua=new F;function iy(n,e,t){let i=new Do;const s=new Ie,r=new Ie,a=new st,o=new h0,l=new f0,c={},u=t.maxTextureSize,h={[Wn]:kt,[kt]:Wn,[dn]:dn},d=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:jS,fragmentShader:ey}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Ut;m.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new tn(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qs;let p=this.type;this.render=function(S,T,M){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;this.type===Sg&&(Re("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Qs);const E=n.getRenderTarget(),C=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),I=n.state;I.setBlending(An),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const X=p!==this.type;X&&T.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(U=>U.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,U=S.length;W<U;W++){const G=S[W],V=G.shadow;if(V===void 0){Re("WebGLShadowMap:",G,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const Y=V.getFrameExtents();s.multiply(Y),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Y.x),s.x=r.x*Y.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Y.y),s.y=r.y*Y.y,V.mapSize.y=r.y));const ne=n.state.buffers.depth.getReversed();if(V.camera._reversedDepth=ne,V.map===null||X===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===ns){if(G.isPointLight){Re("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new pn(s.x,s.y,{format:oi,type:Rn,minFilter:Pt,magFilter:Pt,generateMipmaps:!1}),V.map.texture.name=G.name+".shadowMap",V.map.depthTexture=new Oi(s.x,s.y,un),V.map.depthTexture.name=G.name+".shadowMapDepth",V.map.depthTexture.format=Cn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Tt,V.map.depthTexture.magFilter=Tt}else G.isPointLight?(V.map=new Cd(s.x),V.map.depthTexture=new z_(s.x,gn)):(V.map=new pn(s.x,s.y),V.map.depthTexture=new Oi(s.x,s.y,gn)),V.map.depthTexture.name=G.name+".shadowMap",V.map.depthTexture.format=Cn,this.type===Qs?(V.map.depthTexture.compareFunction=ne?Ro:wo,V.map.depthTexture.minFilter=Pt,V.map.depthTexture.magFilter=Pt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Tt,V.map.depthTexture.magFilter=Tt);V.camera.updateProjectionMatrix()}const K=V.map.isWebGLCubeRenderTarget?6:1;for(let $=0;$<K;$++){if(V.map.isWebGLCubeRenderTarget)n.setRenderTarget(V.map,$),n.clear();else{$===0&&(n.setRenderTarget(V.map),n.clear());const Q=V.getViewport($);a.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),I.viewport(a)}if(G.isPointLight){const Q=V.camera,ue=V.matrix,we=G.distance||Q.far;we!==Q.far&&(Q.far=we,Q.updateProjectionMatrix()),ji.setFromMatrixPosition(G.matrixWorld),Q.position.copy(ji),ua.copy(Q.position),ua.add(ty[$]),Q.up.copy(ny[$]),Q.lookAt(ua),Q.updateMatrixWorld(),ue.makeTranslation(-ji.x,-ji.y,-ji.z),Tc.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Tc,Q.coordinateSystem,Q.reversedDepth)}else V.updateMatrices(G);i=V.getFrustum(),v(T,M,V.camera,G,this.type)}V.isPointLightShadow!==!0&&this.type===ns&&b(V,M),V.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(E,C,P)};function b(S,T){const M=e.update(_);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new pn(s.x,s.y,{format:oi,type:Rn})),d.uniforms.shadow_pass.value=S.map.depthTexture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(T,null,M,d,_,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(T,null,M,f,_,null)}function w(S,T,M,E){let C=null;const P=M.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)C=P;else if(C=M.isPointLight===!0?l:o,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const I=C.uuid,X=T.uuid;let W=c[I];W===void 0&&(W={},c[I]=W);let U=W[X];U===void 0&&(U=C.clone(),W[X]=U,T.addEventListener("dispose",A)),C=U}if(C.visible=T.visible,C.wireframe=T.wireframe,E===ns?C.side=T.shadowSide!==null?T.shadowSide:T.side:C.side=T.shadowSide!==null?T.shadowSide:h[T.side],C.alphaMap=T.alphaMap,C.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,C.map=T.map,C.clipShadows=T.clipShadows,C.clippingPlanes=T.clippingPlanes,C.clipIntersection=T.clipIntersection,C.displacementMap=T.displacementMap,C.displacementScale=T.displacementScale,C.displacementBias=T.displacementBias,C.wireframeLinewidth=T.wireframeLinewidth,C.linewidth=T.linewidth,M.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const I=n.properties.get(C);I.light=M}return C}function v(S,T,M,E,C){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&C===ns)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,S.matrixWorld);const X=e.update(S),W=S.material;if(Array.isArray(W)){const U=X.groups;for(let G=0,V=U.length;G<V;G++){const Y=U[G],ne=W[Y.materialIndex];if(ne&&ne.visible){const K=w(S,ne,E,C);S.onBeforeShadow(n,S,T,M,X,K,Y),n.renderBufferDirect(M,null,X,K,S,Y),S.onAfterShadow(n,S,T,M,X,K,Y)}}}else if(W.visible){const U=w(S,W,E,C);S.onBeforeShadow(n,S,T,M,X,U,null),n.renderBufferDirect(M,null,X,U,S,null),S.onAfterShadow(n,S,T,M,X,U,null)}}const I=S.children;for(let X=0,W=I.length;X<W;X++)v(I[X],T,M,E,C)}function A(S){S.target.removeEventListener("dispose",A);for(const M in c){const E=c[M],C=S.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function sy(n,e){function t(){let D=!1;const re=new st;let j=null;const de=new st(0,0,0,0);return{setMask:function(ge){j!==ge&&!D&&(n.colorMask(ge,ge,ge,ge),j=ge)},setLocked:function(ge){D=ge},setClear:function(ge,te,Se,ve,ot){ot===!0&&(ge*=ve,te*=ve,Se*=ve),re.set(ge,te,Se,ve),de.equals(re)===!1&&(n.clearColor(ge,te,Se,ve),de.copy(re))},reset:function(){D=!1,j=null,de.set(-1,0,0,0)}}}function i(){let D=!1,re=!1,j=null,de=null,ge=null;return{setReversed:function(te){if(re!==te){const Se=e.get("EXT_clip_control");te?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),re=te;const ve=ge;ge=null,this.setClear(ve)}},getReversed:function(){return re},setTest:function(te){te?ie(n.DEPTH_TEST):De(n.DEPTH_TEST)},setMask:function(te){j!==te&&!D&&(n.depthMask(te),j=te)},setFunc:function(te){if(re&&(te=e_[te]),de!==te){switch(te){case ba:n.depthFunc(n.NEVER);break;case Ta:n.depthFunc(n.ALWAYS);break;case Aa:n.depthFunc(n.LESS);break;case Ui:n.depthFunc(n.LEQUAL);break;case wa:n.depthFunc(n.EQUAL);break;case Ra:n.depthFunc(n.GEQUAL);break;case Ca:n.depthFunc(n.GREATER);break;case Pa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}de=te}},setLocked:function(te){D=te},setClear:function(te){ge!==te&&(ge=te,re&&(te=1-te),n.clearDepth(te))},reset:function(){D=!1,j=null,de=null,ge=null,re=!1}}}function s(){let D=!1,re=null,j=null,de=null,ge=null,te=null,Se=null,ve=null,ot=null;return{setTest:function(et){D||(et?ie(n.STENCIL_TEST):De(n.STENCIL_TEST))},setMask:function(et){re!==et&&!D&&(n.stencilMask(et),re=et)},setFunc:function(et,nn,sn){(j!==et||de!==nn||ge!==sn)&&(n.stencilFunc(et,nn,sn),j=et,de=nn,ge=sn)},setOp:function(et,nn,sn){(te!==et||Se!==nn||ve!==sn)&&(n.stencilOp(et,nn,sn),te=et,Se=nn,ve=sn)},setLocked:function(et){D=et},setClear:function(et){ot!==et&&(n.clearStencil(et),ot=et)},reset:function(){D=!1,re=null,j=null,de=null,ge=null,te=null,Se=null,ve=null,ot=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d={},f=new WeakMap,m=[],_=null,g=!1,p=null,b=null,w=null,v=null,A=null,S=null,T=null,M=new Ve(0,0,0),E=0,C=!1,P=null,I=null,X=null,W=null,U=null;const G=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,Y=0;const ne=n.getParameter(n.VERSION);ne.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(ne)[1]),V=Y>=1):ne.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),V=Y>=2);let K=null,$={};const Q=n.getParameter(n.SCISSOR_BOX),ue=n.getParameter(n.VIEWPORT),we=new st().fromArray(Q),Te=new st().fromArray(ue);function q(D,re,j,de){const ge=new Uint8Array(4),te=n.createTexture();n.bindTexture(D,te),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Se=0;Se<j;Se++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(re,0,n.RGBA,1,1,de,0,n.RGBA,n.UNSIGNED_BYTE,ge):n.texImage2D(re+Se,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ge);return te}const ae={};ae[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),ae[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ae[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),a.setFunc(Ui),pt(!1),_t(pl),ie(n.CULL_FACE),Xe(An);function ie(D){u[D]!==!0&&(n.enable(D),u[D]=!0)}function De(D){u[D]!==!1&&(n.disable(D),u[D]=!1)}function Ne(D,re){return d[D]!==re?(n.bindFramebuffer(D,re),d[D]=re,D===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=re),D===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=re),!0):!1}function Ce(D,re){let j=m,de=!1;if(D){j=f.get(re),j===void 0&&(j=[],f.set(re,j));const ge=D.textures;if(j.length!==ge.length||j[0]!==n.COLOR_ATTACHMENT0){for(let te=0,Se=ge.length;te<Se;te++)j[te]=n.COLOR_ATTACHMENT0+te;j.length=ge.length,de=!0}}else j[0]!==n.BACK&&(j[0]=n.BACK,de=!0);de&&n.drawBuffers(j)}function ct(D){return _!==D?(n.useProgram(D),_=D,!0):!1}const ze={[ei]:n.FUNC_ADD,[Eg]:n.FUNC_SUBTRACT,[bg]:n.FUNC_REVERSE_SUBTRACT};ze[Tg]=n.MIN,ze[Ag]=n.MAX;const Je={[wg]:n.ZERO,[Rg]:n.ONE,[Cg]:n.SRC_COLOR,[ya]:n.SRC_ALPHA,[Ug]:n.SRC_ALPHA_SATURATE,[Lg]:n.DST_COLOR,[Ig]:n.DST_ALPHA,[Pg]:n.ONE_MINUS_SRC_COLOR,[Ea]:n.ONE_MINUS_SRC_ALPHA,[Ng]:n.ONE_MINUS_DST_COLOR,[Dg]:n.ONE_MINUS_DST_ALPHA,[Fg]:n.CONSTANT_COLOR,[Og]:n.ONE_MINUS_CONSTANT_COLOR,[Bg]:n.CONSTANT_ALPHA,[kg]:n.ONE_MINUS_CONSTANT_ALPHA};function Xe(D,re,j,de,ge,te,Se,ve,ot,et){if(D===An){g===!0&&(De(n.BLEND),g=!1);return}if(g===!1&&(ie(n.BLEND),g=!0),D!==yg){if(D!==p||et!==C){if((b!==ei||A!==ei)&&(n.blendEquation(n.FUNC_ADD),b=ei,A=ei),et)switch(D){case Pi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ml:n.blendFunc(n.ONE,n.ONE);break;case gl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case _l:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:$e("WebGLState: Invalid blending: ",D);break}else switch(D){case Pi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case ml:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case gl:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _l:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",D);break}w=null,v=null,S=null,T=null,M.set(0,0,0),E=0,p=D,C=et}return}ge=ge||re,te=te||j,Se=Se||de,(re!==b||ge!==A)&&(n.blendEquationSeparate(ze[re],ze[ge]),b=re,A=ge),(j!==w||de!==v||te!==S||Se!==T)&&(n.blendFuncSeparate(Je[j],Je[de],Je[te],Je[Se]),w=j,v=de,S=te,T=Se),(ve.equals(M)===!1||ot!==E)&&(n.blendColor(ve.r,ve.g,ve.b,ot),M.copy(ve),E=ot),p=D,C=!1}function He(D,re){D.side===dn?De(n.CULL_FACE):ie(n.CULL_FACE);let j=D.side===kt;re&&(j=!j),pt(j),D.blending===Pi&&D.transparent===!1?Xe(An):Xe(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const de=D.stencilWrite;o.setTest(de),de&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),bt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):De(n.SAMPLE_ALPHA_TO_COVERAGE)}function pt(D){P!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),P=D)}function _t(D){D!==vg?(ie(n.CULL_FACE),D!==I&&(D===pl?n.cullFace(n.BACK):D===Mg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):De(n.CULL_FACE),I=D}function St(D){D!==X&&(V&&n.lineWidth(D),X=D)}function bt(D,re,j){D?(ie(n.POLYGON_OFFSET_FILL),(W!==re||U!==j)&&(W=re,U=j,a.getReversed()&&(re=-re),n.polygonOffset(re,j))):De(n.POLYGON_OFFSET_FILL)}function at(D){D?ie(n.SCISSOR_TEST):De(n.SCISSOR_TEST)}function mt(D){D===void 0&&(D=n.TEXTURE0+G-1),K!==D&&(n.activeTexture(D),K=D)}function L(D,re,j){j===void 0&&(K===null?j=n.TEXTURE0+G-1:j=K);let de=$[j];de===void 0&&(de={type:void 0,texture:void 0},$[j]=de),(de.type!==D||de.texture!==re)&&(K!==j&&(n.activeTexture(j),K=j),n.bindTexture(D,re||ae[D]),de.type=D,de.texture=re)}function Ft(){const D=$[K];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Ye(){try{n.compressedTexImage2D(...arguments)}catch(D){$e("WebGLState:",D)}}function R(){try{n.compressedTexImage3D(...arguments)}catch(D){$e("WebGLState:",D)}}function x(){try{n.texSubImage2D(...arguments)}catch(D){$e("WebGLState:",D)}}function O(){try{n.texSubImage3D(...arguments)}catch(D){$e("WebGLState:",D)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(D){$e("WebGLState:",D)}}function Z(){try{n.compressedTexSubImage3D(...arguments)}catch(D){$e("WebGLState:",D)}}function se(){try{n.texStorage2D(...arguments)}catch(D){$e("WebGLState:",D)}}function oe(){try{n.texStorage3D(...arguments)}catch(D){$e("WebGLState:",D)}}function J(){try{n.texImage2D(...arguments)}catch(D){$e("WebGLState:",D)}}function ee(){try{n.texImage3D(...arguments)}catch(D){$e("WebGLState:",D)}}function le(D){return h[D]!==void 0?h[D]:n.getParameter(D)}function ye(D,re){h[D]!==re&&(n.pixelStorei(D,re),h[D]=re)}function he(D){we.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),we.copy(D))}function ce(D){Te.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),Te.copy(D))}function Ae(D,re){let j=c.get(re);j===void 0&&(j=new WeakMap,c.set(re,j));let de=j.get(D);de===void 0&&(de=n.getUniformBlockIndex(re,D.name),j.set(D,de))}function Pe(D,re){const de=c.get(re).get(D);l.get(re)!==de&&(n.uniformBlockBinding(re,de,D.__bindingPointIndex),l.set(re,de))}function Ue(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},K=null,$={},d={},f=new WeakMap,m=[],_=null,g=!1,p=null,b=null,w=null,v=null,A=null,S=null,T=null,M=new Ve(0,0,0),E=0,C=!1,P=null,I=null,X=null,W=null,U=null,we.set(0,0,n.canvas.width,n.canvas.height),Te.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:De,bindFramebuffer:Ne,drawBuffers:Ce,useProgram:ct,setBlending:Xe,setMaterial:He,setFlipSided:pt,setCullFace:_t,setLineWidth:St,setPolygonOffset:bt,setScissorTest:at,activeTexture:mt,bindTexture:L,unbindTexture:Ft,compressedTexImage2D:Ye,compressedTexImage3D:R,texImage2D:J,texImage3D:ee,pixelStorei:ye,getParameter:le,updateUBOMapping:Ae,uniformBlockBinding:Pe,texStorage2D:se,texStorage3D:oe,texSubImage2D:x,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:Z,scissor:he,viewport:ce,reset:Ue}}function ry(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ie,u=new WeakMap,h=new Set;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,x){return m?new OffscreenCanvas(R,x):pr("canvas")}function g(R,x,O){let z=1;const Z=Ye(R);if((Z.width>O||Z.height>O)&&(z=O/Math.max(Z.width,Z.height)),z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const se=Math.floor(z*Z.width),oe=Math.floor(z*Z.height);d===void 0&&(d=_(se,oe));const J=x?_(se,oe):d;return J.width=se,J.height=oe,J.getContext("2d").drawImage(R,0,0,se,oe),Re("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+se+"x"+oe+")."),J}else return"data"in R&&Re("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}function p(R){return R.generateMipmaps}function b(R){n.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(R,x,O,z,Z,se=!1){if(R!==null){if(n[R]!==void 0)return n[R];Re("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let oe;z&&(oe=e.get("EXT_texture_norm16"),oe||Re("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=x;if(x===n.RED&&(O===n.FLOAT&&(J=n.R32F),O===n.HALF_FLOAT&&(J=n.R16F),O===n.UNSIGNED_BYTE&&(J=n.R8),O===n.UNSIGNED_SHORT&&oe&&(J=oe.R16_EXT),O===n.SHORT&&oe&&(J=oe.R16_SNORM_EXT)),x===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(J=n.R8UI),O===n.UNSIGNED_SHORT&&(J=n.R16UI),O===n.UNSIGNED_INT&&(J=n.R32UI),O===n.BYTE&&(J=n.R8I),O===n.SHORT&&(J=n.R16I),O===n.INT&&(J=n.R32I)),x===n.RG&&(O===n.FLOAT&&(J=n.RG32F),O===n.HALF_FLOAT&&(J=n.RG16F),O===n.UNSIGNED_BYTE&&(J=n.RG8),O===n.UNSIGNED_SHORT&&oe&&(J=oe.RG16_EXT),O===n.SHORT&&oe&&(J=oe.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(J=n.RG8UI),O===n.UNSIGNED_SHORT&&(J=n.RG16UI),O===n.UNSIGNED_INT&&(J=n.RG32UI),O===n.BYTE&&(J=n.RG8I),O===n.SHORT&&(J=n.RG16I),O===n.INT&&(J=n.RG32I)),x===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(J=n.RGB8UI),O===n.UNSIGNED_SHORT&&(J=n.RGB16UI),O===n.UNSIGNED_INT&&(J=n.RGB32UI),O===n.BYTE&&(J=n.RGB8I),O===n.SHORT&&(J=n.RGB16I),O===n.INT&&(J=n.RGB32I)),x===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(J=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(J=n.RGBA16UI),O===n.UNSIGNED_INT&&(J=n.RGBA32UI),O===n.BYTE&&(J=n.RGBA8I),O===n.SHORT&&(J=n.RGBA16I),O===n.INT&&(J=n.RGBA32I)),x===n.RGB&&(O===n.UNSIGNED_SHORT&&oe&&(J=oe.RGB16_EXT),O===n.SHORT&&oe&&(J=oe.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&(J=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&(J=n.R11F_G11F_B10F)),x===n.RGBA){const ee=se?fr:Ge.getTransfer(Z);O===n.FLOAT&&(J=n.RGBA32F),O===n.HALF_FLOAT&&(J=n.RGBA16F),O===n.UNSIGNED_BYTE&&(J=ee===qe?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&oe&&(J=oe.RGBA16_EXT),O===n.SHORT&&oe&&(J=oe.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&(J=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(J=n.RGB5_A1)}return(J===n.R16F||J===n.R32F||J===n.RG16F||J===n.RG32F||J===n.RGBA16F||J===n.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function A(R,x){let O;return R?x===null||x===gn||x===ds?O=n.DEPTH24_STENCIL8:x===un?O=n.DEPTH32F_STENCIL8:x===cs&&(O=n.DEPTH24_STENCIL8,Re("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===gn||x===ds?O=n.DEPTH_COMPONENT24:x===un?O=n.DEPTH_COMPONENT32F:x===cs&&(O=n.DEPTH_COMPONENT16),O}function S(R,x){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Tt&&R.minFilter!==Pt?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function T(R){const x=R.target;x.removeEventListener("dispose",T),E(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&h.delete(x)}function M(R){const x=R.target;x.removeEventListener("dispose",M),P(x)}function E(R){const x=i.get(R);if(x.__webglInit===void 0)return;const O=R.source,z=f.get(O);if(z){const Z=z[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&C(R),Object.keys(z).length===0&&f.delete(O)}i.remove(R)}function C(R){const x=i.get(R);n.deleteTexture(x.__webglTexture);const O=R.source,z=f.get(O);delete z[x.__cacheKey],a.memory.textures--}function P(R){const x=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(x.__webglFramebuffer[z]))for(let Z=0;Z<x.__webglFramebuffer[z].length;Z++)n.deleteFramebuffer(x.__webglFramebuffer[z][Z]);else n.deleteFramebuffer(x.__webglFramebuffer[z]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[z])}else{if(Array.isArray(x.__webglFramebuffer))for(let z=0;z<x.__webglFramebuffer.length;z++)n.deleteFramebuffer(x.__webglFramebuffer[z]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let z=0;z<x.__webglColorRenderbuffer.length;z++)x.__webglColorRenderbuffer[z]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[z]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const O=R.textures;for(let z=0,Z=O.length;z<Z;z++){const se=i.get(O[z]);se.__webglTexture&&(n.deleteTexture(se.__webglTexture),a.memory.textures--),i.remove(O[z])}i.remove(R)}let I=0;function X(){I=0}function W(){return I}function U(R){I=R}function G(){const R=I;return R>=s.maxTextures&&Re("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function V(R){const x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function Y(R,x){const O=i.get(R);if(R.isVideoTexture&&L(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const z=R.image;if(z===null)Re("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Re("WebGLRenderer: Texture marked for update but image is incomplete");else{De(O,R,x);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+x)}function ne(R,x){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){De(O,R,x);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+x)}function K(R,x){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){De(O,R,x);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+x)}function $(R,x){const O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){Ne(O,R,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+x)}const Q={[Ia]:n.REPEAT,[En]:n.CLAMP_TO_EDGE,[Da]:n.MIRRORED_REPEAT},ue={[Tt]:n.NEAREST,[Gg]:n.NEAREST_MIPMAP_NEAREST,[ys]:n.NEAREST_MIPMAP_LINEAR,[Pt]:n.LINEAR,[Ur]:n.LINEAR_MIPMAP_NEAREST,[ii]:n.LINEAR_MIPMAP_LINEAR},we={[$g]:n.NEVER,[Kg]:n.ALWAYS,[Xg]:n.LESS,[wo]:n.LEQUAL,[Yg]:n.EQUAL,[Ro]:n.GEQUAL,[qg]:n.GREATER,[Zg]:n.NOTEQUAL};function Te(R,x){if(x.type===un&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Pt||x.magFilter===Ur||x.magFilter===ys||x.magFilter===ii||x.minFilter===Pt||x.minFilter===Ur||x.minFilter===ys||x.minFilter===ii)&&Re("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,Q[x.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,Q[x.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,Q[x.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ue[x.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ue[x.minFilter]),x.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,we[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Tt||x.minFilter!==ys&&x.minFilter!==ii||x.type===un&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function q(R,x){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",T));const z=x.source;let Z=f.get(z);Z===void 0&&(Z={},f.set(z,Z));const se=V(x);if(se!==R.__cacheKey){Z[se]===void 0&&(Z[se]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Z[se].usedTimes++;const oe=Z[R.__cacheKey];oe!==void 0&&(Z[R.__cacheKey].usedTimes--,oe.usedTimes===0&&C(x)),R.__cacheKey=se,R.__webglTexture=Z[se].texture}return O}function ae(R,x,O){return Math.floor(Math.floor(R/O)/x)}function ie(R,x,O,z){const se=R.updateRanges;if(se.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,O,z,x.data);else{se.sort((ye,he)=>ye.start-he.start);let oe=0;for(let ye=1;ye<se.length;ye++){const he=se[oe],ce=se[ye],Ae=he.start+he.count,Pe=ae(ce.start,x.width,4),Ue=ae(he.start,x.width,4);ce.start<=Ae+1&&Pe===Ue&&ae(ce.start+ce.count-1,x.width,4)===Pe?he.count=Math.max(he.count,ce.start+ce.count-he.start):(++oe,se[oe]=ce)}se.length=oe+1;const J=t.getParameter(n.UNPACK_ROW_LENGTH),ee=t.getParameter(n.UNPACK_SKIP_PIXELS),le=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let ye=0,he=se.length;ye<he;ye++){const ce=se[ye],Ae=Math.floor(ce.start/4),Pe=Math.ceil(ce.count/4),Ue=Ae%x.width,D=Math.floor(Ae/x.width),re=Pe,j=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ue),t.pixelStorei(n.UNPACK_SKIP_ROWS,D),t.texSubImage2D(n.TEXTURE_2D,0,Ue,D,re,j,O,z,x.data)}R.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,J),t.pixelStorei(n.UNPACK_SKIP_PIXELS,ee),t.pixelStorei(n.UNPACK_SKIP_ROWS,le)}}function De(R,x,O){let z=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(z=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(z=n.TEXTURE_3D);const Z=q(R,x),se=x.source;t.bindTexture(z,R.__webglTexture,n.TEXTURE0+O);const oe=i.get(se);if(se.version!==oe.__version||Z===!0){if(t.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const j=Ge.getPrimaries(Ge.workingColorSpace),de=x.colorSpace===Vn?null:Ge.getPrimaries(x.colorSpace),ge=x.colorSpace===Vn||j===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge)}t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let ee=g(x.image,!1,s.maxTextureSize);ee=Ft(x,ee);const le=r.convert(x.format,x.colorSpace),ye=r.convert(x.type);let he=v(x.internalFormat,le,ye,x.normalized,x.colorSpace,x.isVideoTexture);Te(z,x);let ce;const Ae=x.mipmaps,Pe=x.isVideoTexture!==!0,Ue=oe.__version===void 0||Z===!0,D=se.dataReady,re=S(x,ee);if(x.isDepthTexture)he=A(x.format===si,x.type),Ue&&(Pe?t.texStorage2D(n.TEXTURE_2D,1,he,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,he,ee.width,ee.height,0,le,ye,null));else if(x.isDataTexture)if(Ae.length>0){Pe&&Ue&&t.texStorage2D(n.TEXTURE_2D,re,he,Ae[0].width,Ae[0].height);for(let j=0,de=Ae.length;j<de;j++)ce=Ae[j],Pe?D&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,ce.width,ce.height,le,ye,ce.data):t.texImage2D(n.TEXTURE_2D,j,he,ce.width,ce.height,0,le,ye,ce.data);x.generateMipmaps=!1}else Pe?(Ue&&t.texStorage2D(n.TEXTURE_2D,re,he,ee.width,ee.height),D&&ie(x,ee,le,ye)):t.texImage2D(n.TEXTURE_2D,0,he,ee.width,ee.height,0,le,ye,ee.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Pe&&Ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,re,he,Ae[0].width,Ae[0].height,ee.depth);for(let j=0,de=Ae.length;j<de;j++)if(ce=Ae[j],x.format!==en)if(le!==null)if(Pe){if(D)if(x.layerUpdates.size>0){const ge=nc(ce.width,ce.height,x.format,x.type);for(const te of x.layerUpdates){const Se=ce.data.subarray(te*ge/ce.data.BYTES_PER_ELEMENT,(te+1)*ge/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,te,ce.width,ce.height,1,le,Se)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,ce.width,ce.height,ee.depth,le,ce.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,he,ce.width,ce.height,ee.depth,0,ce.data,0,0);else Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pe?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,ce.width,ce.height,ee.depth,le,ye,ce.data):t.texImage3D(n.TEXTURE_2D_ARRAY,j,he,ce.width,ce.height,ee.depth,0,le,ye,ce.data)}else{Pe&&Ue&&t.texStorage2D(n.TEXTURE_2D,re,he,Ae[0].width,Ae[0].height);for(let j=0,de=Ae.length;j<de;j++)ce=Ae[j],x.format!==en?le!==null?Pe?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,ce.width,ce.height,le,ce.data):t.compressedTexImage2D(n.TEXTURE_2D,j,he,ce.width,ce.height,0,ce.data):Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pe?D&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,ce.width,ce.height,le,ye,ce.data):t.texImage2D(n.TEXTURE_2D,j,he,ce.width,ce.height,0,le,ye,ce.data)}else if(x.isDataArrayTexture)if(Pe){if(Ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,re,he,ee.width,ee.height,ee.depth),D)if(x.layerUpdates.size>0){const j=nc(ee.width,ee.height,x.format,x.type);for(const de of x.layerUpdates){const ge=ee.data.subarray(de*j/ee.data.BYTES_PER_ELEMENT,(de+1)*j/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,de,ee.width,ee.height,1,le,ye,ge)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,le,ye,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,he,ee.width,ee.height,ee.depth,0,le,ye,ee.data);else if(x.isData3DTexture)Pe?(Ue&&t.texStorage3D(n.TEXTURE_3D,re,he,ee.width,ee.height,ee.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,le,ye,ee.data)):t.texImage3D(n.TEXTURE_3D,0,he,ee.width,ee.height,ee.depth,0,le,ye,ee.data);else if(x.isFramebufferTexture){if(Ue)if(Pe)t.texStorage2D(n.TEXTURE_2D,re,he,ee.width,ee.height);else{let j=ee.width,de=ee.height;for(let ge=0;ge<re;ge++)t.texImage2D(n.TEXTURE_2D,ge,he,j,de,0,le,ye,null),j>>=1,de>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const j=n.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),ee.parentNode!==j){j.appendChild(ee),h.add(x),j.onpaint=de=>{const ge=de.changedElements;for(const te of h)ge.includes(te.image)&&(te.needsUpdate=!0)},j.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,ee);else{const ge=n.RGBA,te=n.RGBA,Se=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ge,te,Se,ee)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ae.length>0){if(Pe&&Ue){const j=Ye(Ae[0]);t.texStorage2D(n.TEXTURE_2D,re,he,j.width,j.height)}for(let j=0,de=Ae.length;j<de;j++)ce=Ae[j],Pe?D&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,le,ye,ce):t.texImage2D(n.TEXTURE_2D,j,he,le,ye,ce);x.generateMipmaps=!1}else if(Pe){if(Ue){const j=Ye(ee);t.texStorage2D(n.TEXTURE_2D,re,he,j.width,j.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,le,ye,ee)}else t.texImage2D(n.TEXTURE_2D,0,he,le,ye,ee);p(x)&&b(z),oe.__version=se.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Ne(R,x,O){if(x.image.length!==6)return;const z=q(R,x),Z=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+O);const se=i.get(Z);if(Z.version!==se.__version||z===!0){t.activeTexture(n.TEXTURE0+O);const oe=Ge.getPrimaries(Ge.workingColorSpace),J=x.colorSpace===Vn?null:Ge.getPrimaries(x.colorSpace),ee=x.colorSpace===Vn||oe===J?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);const le=x.isCompressedTexture||x.image[0].isCompressedTexture,ye=x.image[0]&&x.image[0].isDataTexture,he=[];for(let te=0;te<6;te++)!le&&!ye?he[te]=g(x.image[te],!0,s.maxCubemapSize):he[te]=ye?x.image[te].image:x.image[te],he[te]=Ft(x,he[te]);const ce=he[0],Ae=r.convert(x.format,x.colorSpace),Pe=r.convert(x.type),Ue=v(x.internalFormat,Ae,Pe,x.normalized,x.colorSpace),D=x.isVideoTexture!==!0,re=se.__version===void 0||z===!0,j=Z.dataReady;let de=S(x,ce);Te(n.TEXTURE_CUBE_MAP,x);let ge;if(le){D&&re&&t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Ue,ce.width,ce.height);for(let te=0;te<6;te++){ge=he[te].mipmaps;for(let Se=0;Se<ge.length;Se++){const ve=ge[Se];x.format!==en?Ae!==null?D?j&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se,0,0,ve.width,ve.height,Ae,ve.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se,Ue,ve.width,ve.height,0,ve.data):Re("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se,0,0,ve.width,ve.height,Ae,Pe,ve.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se,Ue,ve.width,ve.height,0,Ae,Pe,ve.data)}}}else{if(ge=x.mipmaps,D&&re){ge.length>0&&de++;const te=Ye(he[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,de,Ue,te.width,te.height)}for(let te=0;te<6;te++)if(ye){D?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,he[te].width,he[te].height,Ae,Pe,he[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ue,he[te].width,he[te].height,0,Ae,Pe,he[te].data);for(let Se=0;Se<ge.length;Se++){const ot=ge[Se].image[te].image;D?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se+1,0,0,ot.width,ot.height,Ae,Pe,ot.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se+1,Ue,ot.width,ot.height,0,Ae,Pe,ot.data)}}else{D?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ae,Pe,he[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ue,Ae,Pe,he[te]);for(let Se=0;Se<ge.length;Se++){const ve=ge[Se];D?j&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se+1,0,0,Ae,Pe,ve.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,Se+1,Ue,Ae,Pe,ve.image[te])}}}p(x)&&b(n.TEXTURE_CUBE_MAP),se.__version=Z.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Ce(R,x,O,z,Z,se){const oe=r.convert(O.format,O.colorSpace),J=r.convert(O.type),ee=v(O.internalFormat,oe,J,O.normalized,O.colorSpace),le=i.get(x),ye=i.get(O);if(ye.__renderTarget=x,!le.__hasExternalTextures){const he=Math.max(1,x.width>>se),ce=Math.max(1,x.height>>se);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?t.texImage3D(Z,se,ee,he,ce,x.depth,0,oe,J,null):t.texImage2D(Z,se,ee,he,ce,0,oe,J,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),mt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,z,Z,ye.__webglTexture,0,at(x)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,z,Z,ye.__webglTexture,se),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ct(R,x,O){if(n.bindRenderbuffer(n.RENDERBUFFER,R),x.depthBuffer){const z=x.depthTexture,Z=z&&z.isDepthTexture?z.type:null,se=A(x.stencilBuffer,Z),oe=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;mt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,at(x),se,x.width,x.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,at(x),se,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,se,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,oe,n.RENDERBUFFER,R)}else{const z=x.textures;for(let Z=0;Z<z.length;Z++){const se=z[Z],oe=r.convert(se.format,se.colorSpace),J=r.convert(se.type),ee=v(se.internalFormat,oe,J,se.normalized,se.colorSpace);mt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,at(x),ee,x.width,x.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,at(x),ee,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ee,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ze(R,x,O){const z=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Z=i.get(x.depthTexture);if(Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,x.depthTexture.addEventListener("dispose",T)),Z.__webglTexture===void 0){Z.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Te(n.TEXTURE_CUBE_MAP,x.depthTexture);const le=r.convert(x.depthTexture.format),ye=r.convert(x.depthTexture.type);let he;x.depthTexture.format===Cn?he=n.DEPTH_COMPONENT24:x.depthTexture.format===si&&(he=n.DEPTH24_STENCIL8);for(let ce=0;ce<6;ce++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,he,x.width,x.height,0,le,ye,null)}}else Y(x.depthTexture,0);const se=Z.__webglTexture,oe=at(x),J=z?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,ee=x.depthTexture.format===si?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Cn)mt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,J,se,0,oe):n.framebufferTexture2D(n.FRAMEBUFFER,ee,J,se,0);else if(x.depthTexture.format===si)mt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,J,se,0,oe):n.framebufferTexture2D(n.FRAMEBUFFER,ee,J,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Je(R){const x=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){const z=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),z){const Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,z.removeEventListener("dispose",Z)};z.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=z}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)ze(x.__webglFramebuffer[z],R,z);else{const z=R.texture.mipmaps;z&&z.length>0?ze(x.__webglFramebuffer[0],R,0):ze(x.__webglFramebuffer,R,0)}else if(O){x.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[z]),x.__webglDepthbuffer[z]===void 0)x.__webglDepthbuffer[z]=n.createRenderbuffer(),ct(x.__webglDepthbuffer[z],R,!1);else{const Z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer[z];n.bindRenderbuffer(n.RENDERBUFFER,se),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,se)}}else{const z=R.texture.mipmaps;if(z&&z.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),ct(x.__webglDepthbuffer,R,!1);else{const Z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,se),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,se)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Xe(R,x,O){const z=i.get(R);x!==void 0&&Ce(z.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Je(R)}function He(R){const x=R.texture,O=i.get(R),z=i.get(x);R.addEventListener("dispose",M);const Z=R.textures,se=R.isWebGLCubeRenderTarget===!0,oe=Z.length>1;if(oe||(z.__webglTexture===void 0&&(z.__webglTexture=n.createTexture()),z.__version=x.version,a.memory.textures++),se){O.__webglFramebuffer=[];for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[J]=[];for(let ee=0;ee<x.mipmaps.length;ee++)O.__webglFramebuffer[J][ee]=n.createFramebuffer()}else O.__webglFramebuffer[J]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let J=0;J<x.mipmaps.length;J++)O.__webglFramebuffer[J]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(oe)for(let J=0,ee=Z.length;J<ee;J++){const le=i.get(Z[J]);le.__webglTexture===void 0&&(le.__webglTexture=n.createTexture(),a.memory.textures++)}if(R.samples>0&&mt(R)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let J=0;J<Z.length;J++){const ee=Z[J];O.__webglColorRenderbuffer[J]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[J]);const le=r.convert(ee.format,ee.colorSpace),ye=r.convert(ee.type),he=v(ee.internalFormat,le,ye,ee.normalized,ee.colorSpace,R.isXRRenderTarget===!0),ce=at(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,ce,he,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+J,n.RENDERBUFFER,O.__webglColorRenderbuffer[J])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ct(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(se){t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture),Te(n.TEXTURE_CUBE_MAP,x);for(let J=0;J<6;J++)if(x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)Ce(O.__webglFramebuffer[J][ee],R,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ee);else Ce(O.__webglFramebuffer[J],R,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);p(x)&&b(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){for(let J=0,ee=Z.length;J<ee;J++){const le=Z[J],ye=i.get(le);let he=n.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(he=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,ye.__webglTexture),Te(he,le),Ce(O.__webglFramebuffer,R,le,n.COLOR_ATTACHMENT0+J,he,0),p(le)&&b(he)}t.unbindTexture()}else{let J=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(J=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(J,z.__webglTexture),Te(J,x),x.mipmaps&&x.mipmaps.length>0)for(let ee=0;ee<x.mipmaps.length;ee++)Ce(O.__webglFramebuffer[ee],R,x,n.COLOR_ATTACHMENT0,J,ee);else Ce(O.__webglFramebuffer,R,x,n.COLOR_ATTACHMENT0,J,0);p(x)&&b(J),t.unbindTexture()}R.depthBuffer&&Je(R)}function pt(R){const x=R.textures;for(let O=0,z=x.length;O<z;O++){const Z=x[O];if(p(Z)){const se=w(R),oe=i.get(Z).__webglTexture;t.bindTexture(se,oe),b(se),t.unbindTexture()}}}const _t=[],St=[];function bt(R){if(R.samples>0){if(mt(R)===!1){const x=R.textures,O=R.width,z=R.height;let Z=n.COLOR_BUFFER_BIT;const se=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=i.get(R),J=x.length>1;if(J)for(let le=0;le<x.length;le++)t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer);const ee=R.texture.mipmaps;ee&&ee.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let le=0;le<x.length;le++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),J){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,oe.__webglColorRenderbuffer[le]);const ye=i.get(x[le]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ye,0)}n.blitFramebuffer(0,0,O,z,0,0,O,z,Z,n.NEAREST),l===!0&&(_t.length=0,St.length=0,_t.push(n.COLOR_ATTACHMENT0+le),R.depthBuffer&&R.resolveDepthBuffer===!1&&(_t.push(se),St.push(se),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,St)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,_t))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),J)for(let le=0;le<x.length;le++){t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.RENDERBUFFER,oe.__webglColorRenderbuffer[le]);const ye=i.get(x[le]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.TEXTURE_2D,ye,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const x=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function at(R){return Math.min(s.maxSamples,R.samples)}function mt(R){const x=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function L(R){const x=a.render.frame;u.get(R)!==x&&(u.set(R,x),R.update())}function Ft(R,x){const O=R.colorSpace,z=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==hr&&O!==Vn&&(Ge.getTransfer(O)===qe?(z!==en||Z!==Wt)&&Re("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",O)),x}function Ye(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=X,this.getTextureUnits=W,this.setTextureUnits=U,this.setTexture2D=Y,this.setTexture2DArray=ne,this.setTexture3D=K,this.setTextureCube=$,this.rebindTextures=Xe,this.setupRenderTarget=He,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=Je,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=mt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function ay(n,e){function t(i,s=Vn){let r;const a=Ge.getTransfer(s);if(i===Wt)return n.UNSIGNED_BYTE;if(i===yo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Eo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===sd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===rd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===nd)return n.BYTE;if(i===id)return n.SHORT;if(i===cs)return n.UNSIGNED_SHORT;if(i===So)return n.INT;if(i===gn)return n.UNSIGNED_INT;if(i===un)return n.FLOAT;if(i===Rn)return n.HALF_FLOAT;if(i===ad)return n.ALPHA;if(i===od)return n.RGB;if(i===en)return n.RGBA;if(i===Cn)return n.DEPTH_COMPONENT;if(i===si)return n.DEPTH_STENCIL;if(i===ld)return n.RED;if(i===bo)return n.RED_INTEGER;if(i===oi)return n.RG;if(i===To)return n.RG_INTEGER;if(i===Ao)return n.RGBA_INTEGER;if(i===js||i===er||i===tr||i===nr)if(a===qe)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===er)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===nr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===La||i===Na||i===Ua||i===Fa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===La)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Na)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ua)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Fa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Oa||i===Ba||i===ka||i===Va||i===za||i===dr||i===Ga)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Oa||i===Ba)return a===qe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===ka)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Va)return r.COMPRESSED_R11_EAC;if(i===za)return r.COMPRESSED_SIGNED_R11_EAC;if(i===dr)return r.COMPRESSED_RG11_EAC;if(i===Ga)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ha||i===Wa||i===$a||i===Xa||i===Ya||i===qa||i===Za||i===Ka||i===Ja||i===Qa||i===ja||i===eo||i===to||i===no)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ha)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Wa)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===$a)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Xa)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ya)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===qa)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Za)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ka)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ja)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Qa)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ja)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===eo)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===to)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===no)return a===qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===io||i===so||i===ro)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===io)return a===qe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===so)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ro)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ao||i===oo||i===ur||i===lo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===ao)return r.COMPRESSED_RED_RGTC1_EXT;if(i===oo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ur)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===lo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ds?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const oy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ly=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class cy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new vd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new _n({vertexShader:oy,fragmentShader:ly,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new tn(new Tr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dy extends Yn{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,m=null;const _=typeof XRWebGLBinding<"u",g=new cy,p={},b=t.getContextAttributes();let w=null,v=null;const A=[],S=[],T=new Ie;let M=null;const E=new qt;E.viewport=new st;const C=new qt;C.viewport=new st;const P=[E,C],I=new x0;let X=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let ae=A[q];return ae===void 0&&(ae=new zr,A[q]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(q){let ae=A[q];return ae===void 0&&(ae=new zr,A[q]=ae),ae.getGripSpace()},this.getHand=function(q){let ae=A[q];return ae===void 0&&(ae=new zr,A[q]=ae),ae.getHandSpace()};function U(q){const ae=S.indexOf(q.inputSource);if(ae===-1)return;const ie=A[ae];ie!==void 0&&(ie.update(q.inputSource,q.frame,c||a),ie.dispatchEvent({type:q.type,data:q.inputSource}))}function G(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",V);for(let q=0;q<A.length;q++){const ae=S[q];ae!==null&&(S[q]=null,A[q].disconnect(ae))}X=null,W=null,g.reset();for(const q in p)delete p[q];e.setRenderTarget(w),f=null,d=null,h=null,s=null,v=null,Te.stop(),i.isPresenting=!1,e.setPixelRatio(M),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&Re("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&Re("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",G),s.addEventListener("inputsourceschange",V),b.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(T),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,De=null,Ne=null;b.depth&&(Ne=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=b.stencil?si:Cn,De=b.stencil?ds:gn);const Ce={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(Ce),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new pn(d.textureWidth,d.textureHeight,{format:en,type:Wt,depthTexture:new Oi(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ie={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ie),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new pn(f.framebufferWidth,f.framebufferHeight,{format:en,type:Wt,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Te.setContext(s),Te.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V(q){for(let ae=0;ae<q.removed.length;ae++){const ie=q.removed[ae],De=S.indexOf(ie);De>=0&&(S[De]=null,A[De].disconnect(ie))}for(let ae=0;ae<q.added.length;ae++){const ie=q.added[ae];let De=S.indexOf(ie);if(De===-1){for(let Ce=0;Ce<A.length;Ce++)if(Ce>=S.length){S.push(ie),De=Ce;break}else if(S[Ce]===null){S[Ce]=ie,De=Ce;break}if(De===-1)break}const Ne=A[De];Ne&&Ne.connect(ie)}}const Y=new F,ne=new F;function K(q,ae,ie){Y.setFromMatrixPosition(ae.matrixWorld),ne.setFromMatrixPosition(ie.matrixWorld);const De=Y.distanceTo(ne),Ne=ae.projectionMatrix.elements,Ce=ie.projectionMatrix.elements,ct=Ne[14]/(Ne[10]-1),ze=Ne[14]/(Ne[10]+1),Je=(Ne[9]+1)/Ne[5],Xe=(Ne[9]-1)/Ne[5],He=(Ne[8]-1)/Ne[0],pt=(Ce[8]+1)/Ce[0],_t=ct*He,St=ct*pt,bt=De/(-He+pt),at=bt*-He;if(ae.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(at),q.translateZ(bt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ne[10]===-1)q.projectionMatrix.copy(ae.projectionMatrix),q.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const mt=ct+bt,L=ze+bt,Ft=_t-at,Ye=St+(De-at),R=Je*ze/L*mt,x=Xe*ze/L*mt;q.projectionMatrix.makePerspective(Ft,Ye,R,x,mt,L),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function $(q,ae){ae===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(ae.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let ae=q.near,ie=q.far;g.texture!==null&&(g.depthNear>0&&(ae=g.depthNear),g.depthFar>0&&(ie=g.depthFar)),I.near=C.near=E.near=ae,I.far=C.far=E.far=ie,(X!==I.near||W!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),X=I.near,W=I.far),I.layers.mask=q.layers.mask|6,E.layers.mask=I.layers.mask&-5,C.layers.mask=I.layers.mask&-3;const De=q.parent,Ne=I.cameras;$(I,De);for(let Ce=0;Ce<Ne.length;Ce++)$(Ne[Ce],De);Ne.length===2?K(I,E,C):I.projectionMatrix.copy(E.projectionMatrix),Q(q,I,De)};function Q(q,ae,ie){ie===null?q.matrix.copy(ae.matrixWorld):(q.matrix.copy(ie.matrixWorld),q.matrix.invert(),q.matrix.multiply(ae.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(ae.projectionMatrix),q.projectionMatrixInverse.copy(ae.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=hs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function(q){return p[q]};let ue=null;function we(q,ae){if(u=ae.getViewerPose(c||a),m=ae,u!==null){const ie=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let De=!1;ie.length!==I.cameras.length&&(I.cameras.length=0,De=!0);for(let ze=0;ze<ie.length;ze++){const Je=ie[ze];let Xe=null;if(f!==null)Xe=f.getViewport(Je);else{const pt=h.getViewSubImage(d,Je);Xe=pt.viewport,ze===0&&(e.setRenderTargetTextures(v,pt.colorTexture,pt.depthStencilTexture),e.setRenderTarget(v))}let He=P[ze];He===void 0&&(He=new qt,He.layers.enable(ze),He.viewport=new st,P[ze]=He),He.matrix.fromArray(Je.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(Je.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),ze===0&&(I.matrix.copy(He.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),De===!0&&I.cameras.push(He)}const Ne=s.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=i.getBinding();const ze=h.getDepthInformation(ie[0]);ze&&ze.isValid&&ze.texture&&g.init(ze,s.renderState)}if(Ne&&Ne.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let ze=0;ze<ie.length;ze++){const Je=ie[ze].camera;if(Je){let Xe=p[Je];Xe||(Xe=new vd,p[Je]=Xe);const He=h.getCameraImage(Je);Xe.sourceTexture=He}}}}for(let ie=0;ie<A.length;ie++){const De=S[ie],Ne=A[ie];De!==null&&Ne!==void 0&&Ne.update(De,ae,c||a)}ue&&ue(q,ae),ae.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ae}),m=null}const Te=new wd;Te.setAnimationLoop(we),this.setAnimationLoop=function(q){ue=q},this.dispose=function(){}}}const uy=new it,Nd=new Le;Nd.set(-1,0,0,0,1,0,0,0,1);function hy(n,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,bd(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,b,w,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),h(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),_(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,b,w):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===kt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===kt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const b=e.get(p),w=b.envMap,v=b.envMapRotation;w&&(g.envMap.value=w,g.envMapRotation.value.setFromMatrix4(uy.makeRotationFromEuler(v)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Nd),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,b,w){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*b,g.scale.value=w*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,b){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===kt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const b=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function fy(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,A){const S=A.program;i.uniformBlockBinding(v,S)}function c(v,A){let S=s[v.id];S===void 0&&(g(v),S=u(v),s[v.id]=S,v.addEventListener("dispose",b));const T=A.program;i.updateUBOMapping(v,T);const M=e.render.frame;r[v.id]!==M&&(d(v),r[v.id]=M)}function u(v){const A=h();v.__bindingPointIndex=A;const S=n.createBuffer(),T=v.__size,M=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,T,M),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,S),S}function h(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return $e("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const A=s[v.id],S=v.uniforms,T=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let M=0,E=S.length;M<E;M++){const C=S[M];if(Array.isArray(C))for(let P=0,I=C.length;P<I;P++)f(C[P],M,P,T);else f(C,M,0,T)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(v,A,S,T){if(_(v,A,S,T)===!0){const M=v.__offset,E=v.value;if(Array.isArray(E)){let C=0;for(let P=0;P<E.length;P++){const I=E[P],X=p(I);m(I,v.__data,C),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(C+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(E,v.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,M,v.__data)}}function m(v,A,S){typeof v=="number"||typeof v=="boolean"?A[0]=v:v.isMatrix3?(A[0]=v.elements[0],A[1]=v.elements[1],A[2]=v.elements[2],A[3]=0,A[4]=v.elements[3],A[5]=v.elements[4],A[6]=v.elements[5],A[7]=0,A[8]=v.elements[6],A[9]=v.elements[7],A[10]=v.elements[8],A[11]=0):ArrayBuffer.isView(v)?A.set(new v.constructor(v.buffer,v.byteOffset,A.length)):v.toArray(A,S)}function _(v,A,S,T){const M=v.value,E=A+"_"+S;if(T[E]===void 0)return typeof M=="number"||typeof M=="boolean"?T[E]=M:ArrayBuffer.isView(M)?T[E]=M.slice():T[E]=M.clone(),!0;{const C=T[E];if(typeof M=="number"||typeof M=="boolean"){if(C!==M)return T[E]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(C.equals(M)===!1)return C.copy(M),!0}}return!1}function g(v){const A=v.uniforms;let S=0;const T=16;for(let E=0,C=A.length;E<C;E++){const P=Array.isArray(A[E])?A[E]:[A[E]];for(let I=0,X=P.length;I<X;I++){const W=P[I],U=Array.isArray(W.value)?W.value:[W.value];for(let G=0,V=U.length;G<V;G++){const Y=U[G],ne=p(Y),K=S%T,$=K%ne.boundary,Q=K+$;S+=$,Q!==0&&T-Q<ne.storage&&(S+=T-Q),W.__data=new Float32Array(ne.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=S,S+=ne.storage}}}const M=S%T;return M>0&&(S+=T-M),v.__size=S,v.__cache={},this}function p(v){const A={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(A.boundary=4,A.storage=4):v.isVector2?(A.boundary=8,A.storage=8):v.isVector3||v.isColor?(A.boundary=16,A.storage=12):v.isVector4?(A.boundary=16,A.storage=16):v.isMatrix3?(A.boundary=48,A.storage=48):v.isMatrix4?(A.boundary=64,A.storage=64):v.isTexture?Re("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(A.boundary=16,A.storage=v.byteLength):Re("WebGLRenderer: Unsupported uniform value type.",v),A}function b(v){const A=v.target;A.removeEventListener("dispose",b);const S=a.indexOf(A.__bindingPointIndex);a.splice(S,1),n.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function w(){for(const v in s)n.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:w}}const py=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ln=null;function my(){return ln===null&&(ln=new F_(py,16,16,oi,Rn),ln.name="DFG_LUT",ln.minFilter=Pt,ln.magFilter=Pt,ln.wrapS=En,ln.wrapT=En,ln.generateMipmaps=!1,ln.needsUpdate=!0),ln}class gy{constructor(e={}){const{canvas:t=Qg(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Wt}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const _=f,g=new Set([Ao,To,bo]),p=new Set([Wt,gn,cs,ds,yo,Eo]),b=new Uint32Array(4),w=new Int32Array(4),v=new F;let A=null,S=null;const T=[],M=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let P=!1,I=null,X=null,W=null,U=null;this._outputColorSpace=Ht;let G=0,V=0,Y=null,ne=-1,K=null;const $=new st,Q=new st;let ue=null;const we=new Ve(0);let Te=0,q=t.width,ae=t.height,ie=1,De=null,Ne=null;const Ce=new st(0,0,q,ae),ct=new st(0,0,q,ae);let ze=!1;const Je=new Do;let Xe=!1,He=!1;const pt=new it,_t=new F,St=new st,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let at=!1;function mt(){return Y===null?ie:1}let L=i;function Ft(y,N){return t.getContext(y,N)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Mo}`),t.addEventListener("webglcontextlost",ot,!1),t.addEventListener("webglcontextrestored",et,!1),t.addEventListener("webglcontextcreationerror",nn,!1),L===null){const N="webgl2";if(L=Ft(N,y),L===null)throw Ft(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(y){throw $e("WebGLRenderer: "+y.message),y}let Ye,R,x,O,z,Z,se,oe,J,ee,le,ye,he,ce,Ae,Pe,Ue,D,re,j,de,ge,te;function Se(){Ye=new mM(L),Ye.init(),de=new ay(L,Ye),R=new oM(L,Ye,e,de),x=new sy(L,Ye),R.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),X=L.createFramebuffer(),W=L.createFramebuffer(),U=L.createFramebuffer(),O=new xM(L),z=new WS,Z=new ry(L,Ye,x,z,R,de,O),se=new pM(C),oe=new y0(L),ge=new rM(L,oe),J=new gM(L,oe,O,ge),ee=new MM(L,J,oe,ge,O),D=new vM(L,R,Z),Ae=new lM(z),le=new HS(C,se,Ye,R,ge,Ae),ye=new hy(C,z),he=new XS,ce=new QS(Ye),Ue=new sM(C,se,x,ee,m,l),Pe=new iy(C,ee,R),te=new fy(L,O,R,x),re=new aM(L,Ye,O),j=new _M(L,Ye,O),O.programs=le.programs,C.capabilities=R,C.extensions=Ye,C.properties=z,C.renderLists=he,C.shadowMap=Pe,C.state=x,C.info=O}Se(),_!==Wt&&(E=new yM(_,t.width,t.height,o,s,r));const ve=new dy(C,L);this.xr=ve,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const y=Ye.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ye.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(y){y!==void 0&&(ie=y,this.setSize(q,ae,!1))},this.getSize=function(y){return y.set(q,ae)},this.setSize=function(y,N,H=!0){if(ve.isPresenting){Re("WebGLRenderer: Can't change size while VR device is presenting.");return}q=y,ae=N,t.width=Math.floor(y*ie),t.height=Math.floor(N*ie),H===!0&&(t.style.width=y+"px",t.style.height=N+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,y,N)},this.getDrawingBufferSize=function(y){return y.set(q*ie,ae*ie).floor()},this.setDrawingBufferSize=function(y,N,H){q=y,ae=N,ie=H,t.width=Math.floor(y*H),t.height=Math.floor(N*H),this.setViewport(0,0,y,N)},this.setEffects=function(y){if(_===Wt){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let N=0;N<y.length;N++)if(y[N].isOutputPass===!0){Re("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy($)},this.getViewport=function(y){return y.copy(Ce)},this.setViewport=function(y,N,H,B){y.isVector4?Ce.set(y.x,y.y,y.z,y.w):Ce.set(y,N,H,B),x.viewport($.copy(Ce).multiplyScalar(ie).round())},this.getScissor=function(y){return y.copy(ct)},this.setScissor=function(y,N,H,B){y.isVector4?ct.set(y.x,y.y,y.z,y.w):ct.set(y,N,H,B),x.scissor(Q.copy(ct).multiplyScalar(ie).round())},this.getScissorTest=function(){return ze},this.setScissorTest=function(y){x.setScissorTest(ze=y)},this.setOpaqueSort=function(y){De=y},this.setTransparentSort=function(y){Ne=y},this.getClearColor=function(y){return y.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(y=!0,N=!0,H=!0){let B=0;if(y){let k=!1;if(Y!==null){const me=Y.texture.format;k=g.has(me)}if(k){const me=Y.texture.type,xe=p.has(me),pe=Ue.getClearColor(),Me=Ue.getClearAlpha(),Ee=pe.r,Fe=pe.g,Be=pe.b;xe?(b[0]=Ee,b[1]=Fe,b[2]=Be,b[3]=Me,L.clearBufferuiv(L.COLOR,0,b)):(w[0]=Ee,w[1]=Fe,w[2]=Be,w[3]=Me,L.clearBufferiv(L.COLOR,0,w))}else B|=L.COLOR_BUFFER_BIT}N&&(B|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),H&&(B|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&L.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),I=y},this.dispose=function(){t.removeEventListener("webglcontextlost",ot,!1),t.removeEventListener("webglcontextrestored",et,!1),t.removeEventListener("webglcontextcreationerror",nn,!1),Ue.dispose(),he.dispose(),ce.dispose(),z.dispose(),se.dispose(),ee.dispose(),ge.dispose(),te.dispose(),le.dispose(),ve.dispose(),ve.removeEventListener("sessionstart",Go),ve.removeEventListener("sessionend",Ho),qn.stop()};function ot(y){y.preventDefault(),yl("WebGLRenderer: Context Lost."),P=!0}function et(){yl("WebGLRenderer: Context Restored."),P=!1;const y=O.autoReset,N=Pe.enabled,H=Pe.autoUpdate,B=Pe.needsUpdate,k=Pe.type;Se(),O.autoReset=y,Pe.enabled=N,Pe.autoUpdate=H,Pe.needsUpdate=B,Pe.type=k}function nn(y){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function sn(y){const N=y.target;N.removeEventListener("dispose",sn),Od(N)}function Od(y){Bd(y),z.remove(y)}function Bd(y){const N=z.get(y).programs;N!==void 0&&(N.forEach(function(H){le.releaseProgram(H)}),y.isShaderMaterial&&le.releaseShaderCache(y))}this.renderBufferDirect=function(y,N,H,B,k,me){N===null&&(N=bt);const xe=k.isMesh&&k.matrixWorld.determinantAffine()<0,pe=zd(y,N,H,B,k);x.setMaterial(B,xe);let Me=H.index,Ee=1;if(B.wireframe===!0){if(Me=J.getWireframeAttribute(H),Me===void 0)return;Ee=2}const Fe=H.drawRange,Be=H.attributes.position;let be=Fe.start*Ee,Ze=(Fe.start+Fe.count)*Ee;me!==null&&(be=Math.max(be,me.start*Ee),Ze=Math.min(Ze,(me.start+me.count)*Ee)),Me!==null?(be=Math.max(be,0),Ze=Math.min(Ze,Me.count)):Be!=null&&(be=Math.max(be,0),Ze=Math.min(Ze,Be.count));const dt=Ze-be;if(dt<0||dt===1/0)return;ge.setup(k,B,pe,H,Me);let lt,Qe=re;if(Me!==null&&(lt=oe.get(Me),Qe=j,Qe.setIndex(lt)),k.isMesh)B.wireframe===!0?(x.setLineWidth(B.wireframeLinewidth*mt()),Qe.setMode(L.LINES)):Qe.setMode(L.TRIANGLES);else if(k.isLine){let At=B.linewidth;At===void 0&&(At=1),x.setLineWidth(At*mt()),k.isLineSegments?Qe.setMode(L.LINES):k.isLineLoop?Qe.setMode(L.LINE_LOOP):Qe.setMode(L.LINE_STRIP)}else k.isPoints?Qe.setMode(L.POINTS):k.isSprite&&Qe.setMode(L.TRIANGLES);if(k.isBatchedMesh)if(Ye.get("WEBGL_multi_draw"))Qe.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const At=k._multiDrawStarts,_e=k._multiDrawCounts,Vt=k._multiDrawCount,We=Me?oe.get(Me).bytesPerElement:1,$t=z.get(B).currentProgram.getUniforms();for(let rn=0;rn<Vt;rn++)$t.setValue(L,"_gl_DrawID",rn),Qe.render(At[rn]/We,_e[rn])}else if(k.isInstancedMesh)Qe.renderInstances(be,dt,k.count);else if(H.isInstancedBufferGeometry){const At=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,_e=Math.min(H.instanceCount,At);Qe.renderInstances(be,dt,_e)}else Qe.render(be,dt)};function zo(y,N,H){y.transparent===!0&&y.side===dn&&y.forceSinglePass===!1?(y.side=kt,y.needsUpdate=!0,vs(y,N,H),y.side=Wn,y.needsUpdate=!0,vs(y,N,H),y.side=dn):vs(y,N,H)}this.compile=function(y,N,H=null){H===null&&(H=y),S=ce.get(H),S.init(N),M.push(S),H.traverseVisible(function(k){k.isLight&&k.layers.test(N.layers)&&(S.pushLight(k),k.castShadow&&S.pushShadow(k))}),y!==H&&y.traverseVisible(function(k){k.isLight&&k.layers.test(N.layers)&&(S.pushLight(k),k.castShadow&&S.pushShadow(k))}),S.setupLights();const B=new Set;return y.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const me=k.material;if(me)if(Array.isArray(me))for(let xe=0;xe<me.length;xe++){const pe=me[xe];zo(pe,H,k),B.add(pe)}else zo(me,H,k),B.add(me)}),S=M.pop(),B},this.compileAsync=function(y,N,H=null){const B=this.compile(y,N,H);return new Promise(k=>{function me(){if(B.forEach(function(xe){z.get(xe).currentProgram.isReady()&&B.delete(xe)}),B.size===0){k(y);return}setTimeout(me,10)}Ye.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Rr=null;function kd(y){Rr&&Rr(y)}function Go(){qn.stop()}function Ho(){qn.start()}const qn=new wd;qn.setAnimationLoop(kd),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(y){Rr=y,ve.setAnimationLoop(y),y===null?qn.stop():qn.start()},ve.addEventListener("sessionstart",Go),ve.addEventListener("sessionend",Ho),this.render=function(y,N){if(N!==void 0&&N.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;I!==null&&I.renderStart(y,N);const H=ve.enabled===!0&&ve.isPresenting===!0,B=E!==null&&(Y===null||H)&&E.begin(C,Y);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),ve.enabled===!0&&ve.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(ve.cameraAutoUpdate===!0&&ve.updateCamera(N),N=ve.getCamera()),y.isScene===!0&&y.onBeforeRender(C,y,N,Y),S=ce.get(y,M.length),S.init(N),S.state.textureUnits=Z.getTextureUnits(),M.push(S),pt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Je.setFromProjectionMatrix(pt,hn,N.reversedDepth),He=this.localClippingEnabled,Xe=Ae.init(this.clippingPlanes,He),A=he.get(y,T.length),A.init(),T.push(A),ve.enabled===!0&&ve.isPresenting===!0){const xe=C.xr.getDepthSensingMesh();xe!==null&&Cr(xe,N,-1/0,C.sortObjects)}Cr(y,N,0,C.sortObjects),A.finish(),C.sortObjects===!0&&A.sort(De,Ne,N.reversedDepth),at=ve.enabled===!1||ve.isPresenting===!1||ve.hasDepthSensing()===!1,at&&Ue.addToRenderList(A,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Xe===!0&&Ae.beginShadows();const k=S.state.shadowsArray;if(Pe.render(k,y,N),Xe===!0&&Ae.endShadows(),(B&&E.hasRenderPass())===!1){const xe=A.opaque,pe=A.transmissive;if(S.setupLights(),N.isArrayCamera){const Me=N.cameras;if(pe.length>0)for(let Ee=0,Fe=Me.length;Ee<Fe;Ee++){const Be=Me[Ee];$o(xe,pe,y,Be)}at&&Ue.render(y);for(let Ee=0,Fe=Me.length;Ee<Fe;Ee++){const Be=Me[Ee];Wo(A,y,Be,Be.viewport)}}else pe.length>0&&$o(xe,pe,y,N),at&&Ue.render(y),Wo(A,y,N)}Y!==null&&V===0&&(Z.updateMultisampleRenderTarget(Y),Z.updateRenderTargetMipmap(Y)),B&&E.end(C),y.isScene===!0&&y.onAfterRender(C,y,N),ge.resetDefaultState(),ne=-1,K=null,M.pop(),M.length>0?(S=M[M.length-1],Z.setTextureUnits(S.state.textureUnits),Xe===!0&&Ae.setGlobalState(C.clippingPlanes,S.state.camera)):S=null,T.pop(),T.length>0?A=T[T.length-1]:A=null,I!==null&&I.renderEnd()};function Cr(y,N,H,B){if(y.visible===!1)return;if(y.layers.test(N.layers)){if(y.isGroup)H=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(N);else if(y.isLightProbeGrid)S.pushLightProbeGrid(y);else if(y.isLight)S.pushLight(y),y.castShadow&&S.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Je.intersectsSprite(y)){B&&St.setFromMatrixPosition(y.matrixWorld).applyMatrix4(pt);const xe=ee.update(y),pe=y.material;pe.visible&&A.push(y,xe,pe,H,St.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Je.intersectsObject(y))){const xe=ee.update(y),pe=y.material;if(B&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),St.copy(y.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),St.copy(xe.boundingSphere.center)),St.applyMatrix4(y.matrixWorld).applyMatrix4(pt)),Array.isArray(pe)){const Me=xe.groups;for(let Ee=0,Fe=Me.length;Ee<Fe;Ee++){const Be=Me[Ee],be=pe[Be.materialIndex];be&&be.visible&&A.push(y,xe,be,H,St.z,Be)}}else pe.visible&&A.push(y,xe,pe,H,St.z,null)}}const me=y.children;for(let xe=0,pe=me.length;xe<pe;xe++)Cr(me[xe],N,H,B)}function Wo(y,N,H,B){const{opaque:k,transmissive:me,transparent:xe}=y;S.setupLightsView(H),Xe===!0&&Ae.setGlobalState(C.clippingPlanes,H),B&&x.viewport($.copy(B)),k.length>0&&xs(k,N,H),me.length>0&&xs(me,N,H),xe.length>0&&xs(xe,N,H),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function $o(y,N,H,B){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[B.id]===void 0){const be=Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[B.id]=new pn(1,1,{generateMipmaps:!0,type:be?Rn:Wt,minFilter:ii,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ge.workingColorSpace})}const me=S.state.transmissionRenderTarget[B.id],xe=B.viewport||$;me.setSize(xe.z*C.transmissionResolutionScale,xe.w*C.transmissionResolutionScale);const pe=C.getRenderTarget(),Me=C.getActiveCubeFace(),Ee=C.getActiveMipmapLevel();C.setRenderTarget(me),C.getClearColor(we),Te=C.getClearAlpha(),Te<1&&C.setClearColor(16777215,.5),C.clear(),at&&Ue.render(H);const Fe=C.toneMapping;C.toneMapping=fn;const Be=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),S.setupLightsView(B),Xe===!0&&Ae.setGlobalState(C.clippingPlanes,B),xs(y,H,B),Z.updateMultisampleRenderTarget(me),Z.updateRenderTargetMipmap(me),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let Ze=0,dt=N.length;Ze<dt;Ze++){const lt=N[Ze],{object:Qe,geometry:At,material:_e,group:Vt}=lt;if(_e.side===dn&&Qe.layers.test(B.layers)){const We=_e.side;_e.side=kt,_e.needsUpdate=!0,Xo(Qe,H,B,At,_e,Vt),_e.side=We,_e.needsUpdate=!0,be=!0}}be===!0&&(Z.updateMultisampleRenderTarget(me),Z.updateRenderTargetMipmap(me))}C.setRenderTarget(pe,Me,Ee),C.setClearColor(we,Te),Be!==void 0&&(B.viewport=Be),C.toneMapping=Fe}function xs(y,N,H){const B=N.isScene===!0?N.overrideMaterial:null;for(let k=0,me=y.length;k<me;k++){const xe=y[k],{object:pe,geometry:Me,group:Ee}=xe;let Fe=xe.material;Fe.allowOverride===!0&&B!==null&&(Fe=B),pe.layers.test(H.layers)&&Xo(pe,N,H,Me,Fe,Ee)}}function Xo(y,N,H,B,k,me){y.onBeforeRender(C,N,H,B,k,me),y.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),k.onBeforeRender(C,N,H,B,y,me),k.transparent===!0&&k.side===dn&&k.forceSinglePass===!1?(k.side=kt,k.needsUpdate=!0,C.renderBufferDirect(H,N,B,k,y,me),k.side=Wn,k.needsUpdate=!0,C.renderBufferDirect(H,N,B,k,y,me),k.side=dn):C.renderBufferDirect(H,N,B,k,y,me),y.onAfterRender(C,N,H,B,k,me)}function vs(y,N,H){N.isScene!==!0&&(N=bt);const B=z.get(y),k=S.state.lights,me=S.state.shadowsArray,xe=k.state.version,pe=le.getParameters(y,k.state,me,N,H,S.state.lightProbeGridArray),Me=le.getProgramCacheKey(pe);let Ee=B.programs;B.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?N.environment:null,B.fog=N.fog;const Fe=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;B.envMap=se.get(y.envMap||B.environment,Fe),B.envMapRotation=B.environment!==null&&y.envMap===null?N.environmentRotation:y.envMapRotation,Ee===void 0&&(y.addEventListener("dispose",sn),Ee=new Map,B.programs=Ee);let Be=Ee.get(Me);if(Be!==void 0){if(B.currentProgram===Be&&B.lightsStateVersion===xe)return qo(y,pe),Be}else pe.uniforms=le.getUniforms(y),I!==null&&y.isNodeMaterial&&I.build(y,H,pe),y.onBeforeCompile(pe,C),Be=le.acquireProgram(pe,Me),Ee.set(Me,Be),B.uniforms=pe.uniforms;const be=B.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(be.clippingPlanes=Ae.uniform),qo(y,pe),B.needsLights=Hd(y),B.lightsStateVersion=xe,B.needsLights&&(be.ambientLightColor.value=k.state.ambient,be.lightProbe.value=k.state.probe,be.directionalLights.value=k.state.directional,be.directionalLightShadows.value=k.state.directionalShadow,be.spotLights.value=k.state.spot,be.spotLightShadows.value=k.state.spotShadow,be.rectAreaLights.value=k.state.rectArea,be.ltc_1.value=k.state.rectAreaLTC1,be.ltc_2.value=k.state.rectAreaLTC2,be.pointLights.value=k.state.point,be.pointLightShadows.value=k.state.pointShadow,be.hemisphereLights.value=k.state.hemi,be.directionalShadowMatrix.value=k.state.directionalShadowMatrix,be.spotLightMatrix.value=k.state.spotLightMatrix,be.spotLightMap.value=k.state.spotLightMap,be.pointShadowMatrix.value=k.state.pointShadowMatrix),B.lightProbeGrid=S.state.lightProbeGridArray.length>0,B.currentProgram=Be,B.uniformsList=null,Be}function Yo(y){if(y.uniformsList===null){const N=y.currentProgram.getUniforms();y.uniformsList=sr.seqWithValue(N.seq,y.uniforms)}return y.uniformsList}function qo(y,N){const H=z.get(y);H.outputColorSpace=N.outputColorSpace,H.batching=N.batching,H.batchingColor=N.batchingColor,H.instancing=N.instancing,H.instancingColor=N.instancingColor,H.instancingMorph=N.instancingMorph,H.skinning=N.skinning,H.morphTargets=N.morphTargets,H.morphNormals=N.morphNormals,H.morphColors=N.morphColors,H.morphTargetsCount=N.morphTargetsCount,H.numClippingPlanes=N.numClippingPlanes,H.numIntersection=N.numClipIntersection,H.vertexAlphas=N.vertexAlphas,H.vertexTangents=N.vertexTangents,H.toneMapping=N.toneMapping}function Vd(y,N){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;v.setFromMatrixPosition(N.matrixWorld);for(let H=0,B=y.length;H<B;H++){const k=y[H];if(k.texture!==null&&k.boundingBox.containsPoint(v))return k}return null}function zd(y,N,H,B,k){N.isScene!==!0&&(N=bt),Z.resetTextureUnits();const me=N.fog,xe=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?N.environment:null,pe=Y===null?C.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Ge.workingColorSpace,Me=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Ee=se.get(B.envMap||xe,Me),Fe=B.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Be=!!H.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),be=!!H.morphAttributes.position,Ze=!!H.morphAttributes.normal,dt=!!H.morphAttributes.color;let lt=fn;B.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(lt=C.toneMapping);const Qe=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,At=Qe!==void 0?Qe.length:0,_e=z.get(B),Vt=S.state.lights;if(Xe===!0&&(He===!0||y!==K)){const tt=y===K&&B.id===ne;Ae.setState(B,y,tt)}let We=!1;B.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==Vt.state.version||_e.outputColorSpace!==pe||k.isBatchedMesh&&_e.batching===!1||!k.isBatchedMesh&&_e.batching===!0||k.isBatchedMesh&&_e.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&_e.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&_e.instancing===!1||!k.isInstancedMesh&&_e.instancing===!0||k.isSkinnedMesh&&_e.skinning===!1||!k.isSkinnedMesh&&_e.skinning===!0||k.isInstancedMesh&&_e.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&_e.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&_e.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&_e.instancingMorph===!1&&k.morphTexture!==null||_e.envMap!==Ee||B.fog===!0&&_e.fog!==me||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Ae.numPlanes||_e.numIntersection!==Ae.numIntersection)||_e.vertexAlphas!==Fe||_e.vertexTangents!==Be||_e.morphTargets!==be||_e.morphNormals!==Ze||_e.morphColors!==dt||_e.toneMapping!==lt||_e.morphTargetsCount!==At||!!_e.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(We=!0):(We=!0,_e.__version=B.version);let $t=_e.currentProgram;We===!0&&($t=vs(B,N,k),I&&B.isNodeMaterial&&I.onUpdateProgram(B,$t,_e));let rn=!1,Pn=!1,di=!1;const je=$t.getUniforms(),ut=_e.uniforms;if(x.useProgram($t.program)&&(rn=!0,Pn=!0,di=!0),B.id!==ne&&(ne=B.id,Pn=!0),_e.needsLights){const tt=Vd(S.state.lightProbeGridArray,k);_e.lightProbeGrid!==tt&&(_e.lightProbeGrid=tt,Pn=!0)}if(rn||K!==y){x.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),je.setValue(L,"projectionMatrix",y.projectionMatrix),je.setValue(L,"viewMatrix",y.matrixWorldInverse);const Dn=je.map.cameraPosition;Dn!==void 0&&Dn.setValue(L,_t.setFromMatrixPosition(y.matrixWorld)),R.logarithmicDepthBuffer&&je.setValue(L,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&je.setValue(L,"isOrthographic",y.isOrthographicCamera===!0),K!==y&&(K=y,Pn=!0,di=!0)}if(_e.needsLights&&(Vt.state.directionalShadowMap.length>0&&je.setValue(L,"directionalShadowMap",Vt.state.directionalShadowMap,Z),Vt.state.spotShadowMap.length>0&&je.setValue(L,"spotShadowMap",Vt.state.spotShadowMap,Z),Vt.state.pointShadowMap.length>0&&je.setValue(L,"pointShadowMap",Vt.state.pointShadowMap,Z)),k.isSkinnedMesh){je.setOptional(L,k,"bindMatrix"),je.setOptional(L,k,"bindMatrixInverse");const tt=k.skeleton;tt&&(tt.boneTexture===null&&tt.computeBoneTexture(),je.setValue(L,"boneTexture",tt.boneTexture,Z))}k.isBatchedMesh&&(je.setOptional(L,k,"batchingTexture"),je.setValue(L,"batchingTexture",k._matricesTexture,Z),je.setOptional(L,k,"batchingIdTexture"),je.setValue(L,"batchingIdTexture",k._indirectTexture,Z),je.setOptional(L,k,"batchingColorTexture"),k._colorsTexture!==null&&je.setValue(L,"batchingColorTexture",k._colorsTexture,Z));const In=H.morphAttributes;if((In.position!==void 0||In.normal!==void 0||In.color!==void 0)&&D.update(k,H,$t),(Pn||_e.receiveShadow!==k.receiveShadow)&&(_e.receiveShadow=k.receiveShadow,je.setValue(L,"receiveShadow",k.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&N.environment!==null&&(ut.envMapIntensity.value=N.environmentIntensity),ut.dfgLUT!==void 0&&(ut.dfgLUT.value=my()),Pn){if(je.setValue(L,"toneMappingExposure",C.toneMappingExposure),_e.needsLights&&Gd(ut,di),me&&B.fog===!0&&ye.refreshFogUniforms(ut,me),ye.refreshMaterialUniforms(ut,B,ie,ae,S.state.transmissionRenderTarget[y.id]),_e.needsLights&&_e.lightProbeGrid){const tt=_e.lightProbeGrid;ut.probesSH.value=tt.texture,ut.probesMin.value.copy(tt.boundingBox.min),ut.probesMax.value.copy(tt.boundingBox.max),ut.probesResolution.value.copy(tt.resolution)}sr.upload(L,Yo(_e),ut,Z)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(sr.upload(L,Yo(_e),ut,Z),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&je.setValue(L,"center",k.center),je.setValue(L,"modelViewMatrix",k.modelViewMatrix),je.setValue(L,"normalMatrix",k.normalMatrix),je.setValue(L,"modelMatrix",k.matrixWorld),B.uniformsGroups!==void 0){const tt=B.uniformsGroups;for(let Dn=0,ui=tt.length;Dn<ui;Dn++){const Zo=tt[Dn];te.update(Zo,$t),te.bind(Zo,$t)}}return $t}function Gd(y,N){y.ambientLightColor.needsUpdate=N,y.lightProbe.needsUpdate=N,y.directionalLights.needsUpdate=N,y.directionalLightShadows.needsUpdate=N,y.pointLights.needsUpdate=N,y.pointLightShadows.needsUpdate=N,y.spotLights.needsUpdate=N,y.spotLightShadows.needsUpdate=N,y.rectAreaLights.needsUpdate=N,y.hemisphereLights.needsUpdate=N}function Hd(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return Y},this.setRenderTargetTextures=function(y,N,H){const B=z.get(y);B.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),z.get(y.texture).__webglTexture=N,z.get(y.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:H,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,N){const H=z.get(y);H.__webglFramebuffer=N,H.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(y,N=0,H=0){Y=y,G=N,V=H;let B=null,k=!1,me=!1;if(y){const pe=z.get(y);if(pe.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(L.FRAMEBUFFER,pe.__webglFramebuffer),$.copy(y.viewport),Q.copy(y.scissor),ue=y.scissorTest,x.viewport($),x.scissor(Q),x.setScissorTest(ue),ne=-1;return}else if(pe.__webglFramebuffer===void 0)Z.setupRenderTarget(y);else if(pe.__hasExternalTextures)Z.rebindTextures(y,z.get(y.texture).__webglTexture,z.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Fe=y.depthTexture;if(pe.__boundDepthTexture!==Fe){if(Fe!==null&&z.has(Fe)&&(y.width!==Fe.image.width||y.height!==Fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(y)}}const Me=y.texture;(Me.isData3DTexture||Me.isDataArrayTexture||Me.isCompressedArrayTexture)&&(me=!0);const Ee=z.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ee[N])?B=Ee[N][H]:B=Ee[N],k=!0):y.samples>0&&Z.useMultisampledRTT(y)===!1?B=z.get(y).__webglMultisampledFramebuffer:Array.isArray(Ee)?B=Ee[H]:B=Ee,$.copy(y.viewport),Q.copy(y.scissor),ue=y.scissorTest}else $.copy(Ce).multiplyScalar(ie).floor(),Q.copy(ct).multiplyScalar(ie).floor(),ue=ze;if(H!==0&&(B=X),x.bindFramebuffer(L.FRAMEBUFFER,B)&&x.drawBuffers(y,B),x.viewport($),x.scissor(Q),x.setScissorTest(ue),k){const pe=z.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,pe.__webglTexture,H)}else if(me){const pe=N;for(let Me=0;Me<y.textures.length;Me++){const Ee=z.get(y.textures[Me]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Me,Ee.__webglTexture,H,pe)}}else if(y!==null&&H!==0){const pe=z.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,pe.__webglTexture,H)}ne=-1},this.readRenderTargetPixels=function(y,N,H,B,k,me,xe,pe=0){if(!(y&&y.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=z.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&xe!==void 0&&(Me=Me[xe]),Me){x.bindFramebuffer(L.FRAMEBUFFER,Me);try{const Ee=y.textures[pe],Fe=Ee.format,Be=Ee.type;if(y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+pe),!R.textureFormatReadable(Fe)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Be)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=y.width-B&&H>=0&&H<=y.height-k&&L.readPixels(N,H,B,k,de.convert(Fe),de.convert(Be),me)}finally{const Ee=Y!==null?z.get(Y).__webglFramebuffer:null;x.bindFramebuffer(L.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(y,N,H,B,k,me,xe,pe=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=z.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&xe!==void 0&&(Me=Me[xe]),Me)if(N>=0&&N<=y.width-B&&H>=0&&H<=y.height-k){x.bindFramebuffer(L.FRAMEBUFFER,Me);const Ee=y.textures[pe],Fe=Ee.format,Be=Ee.type;if(y.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+pe),!R.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const be=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,be),L.bufferData(L.PIXEL_PACK_BUFFER,me.byteLength,L.STREAM_READ),L.readPixels(N,H,B,k,de.convert(Fe),de.convert(Be),0);const Ze=Y!==null?z.get(Y).__webglFramebuffer:null;x.bindFramebuffer(L.FRAMEBUFFER,Ze);const dt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await jg(L,dt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,be),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,me),L.deleteBuffer(be),L.deleteSync(dt),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,N=null,H=0){const B=Math.pow(2,-H),k=Math.floor(y.image.width*B),me=Math.floor(y.image.height*B),xe=N!==null?N.x:0,pe=N!==null?N.y:0;Z.setTexture2D(y,0),L.copyTexSubImage2D(L.TEXTURE_2D,H,0,0,xe,pe,k,me),x.unbindTexture()},this.copyTextureToTexture=function(y,N,H=null,B=null,k=0,me=0){let xe,pe,Me,Ee,Fe,Be,be,Ze,dt;const lt=y.isCompressedTexture?y.mipmaps[me]:y.image;if(H!==null)xe=H.max.x-H.min.x,pe=H.max.y-H.min.y,Me=H.isBox3?H.max.z-H.min.z:1,Ee=H.min.x,Fe=H.min.y,Be=H.isBox3?H.min.z:0;else{const ut=Math.pow(2,-k);xe=Math.floor(lt.width*ut),pe=Math.floor(lt.height*ut),y.isDataArrayTexture?Me=lt.depth:y.isData3DTexture?Me=Math.floor(lt.depth*ut):Me=1,Ee=0,Fe=0,Be=0}B!==null?(be=B.x,Ze=B.y,dt=B.z):(be=0,Ze=0,dt=0);const Qe=de.convert(N.format),At=de.convert(N.type);let _e;N.isData3DTexture?(Z.setTexture3D(N,0),_e=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Z.setTexture2DArray(N,0),_e=L.TEXTURE_2D_ARRAY):(Z.setTexture2D(N,0),_e=L.TEXTURE_2D),x.activeTexture(L.TEXTURE0),x.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),x.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),x.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const Vt=x.getParameter(L.UNPACK_ROW_LENGTH),We=x.getParameter(L.UNPACK_IMAGE_HEIGHT),$t=x.getParameter(L.UNPACK_SKIP_PIXELS),rn=x.getParameter(L.UNPACK_SKIP_ROWS),Pn=x.getParameter(L.UNPACK_SKIP_IMAGES);x.pixelStorei(L.UNPACK_ROW_LENGTH,lt.width),x.pixelStorei(L.UNPACK_IMAGE_HEIGHT,lt.height),x.pixelStorei(L.UNPACK_SKIP_PIXELS,Ee),x.pixelStorei(L.UNPACK_SKIP_ROWS,Fe),x.pixelStorei(L.UNPACK_SKIP_IMAGES,Be);const di=y.isDataArrayTexture||y.isData3DTexture,je=N.isDataArrayTexture||N.isData3DTexture;if(y.isDepthTexture){const ut=z.get(y),In=z.get(N),tt=z.get(ut.__renderTarget),Dn=z.get(In.__renderTarget);x.bindFramebuffer(L.READ_FRAMEBUFFER,tt.__webglFramebuffer),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,Dn.__webglFramebuffer);for(let ui=0;ui<Me;ui++)di&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(y).__webglTexture,k,Be+ui),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(N).__webglTexture,me,dt+ui)),L.blitFramebuffer(Ee,Fe,xe,pe,be,Ze,xe,pe,L.DEPTH_BUFFER_BIT,L.NEAREST);x.bindFramebuffer(L.READ_FRAMEBUFFER,null),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(k!==0||y.isRenderTargetTexture||z.has(y)){const ut=z.get(y),In=z.get(N);x.bindFramebuffer(L.READ_FRAMEBUFFER,W),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,U);for(let tt=0;tt<Me;tt++)di?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ut.__webglTexture,k,Be+tt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ut.__webglTexture,k),je?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,In.__webglTexture,me,dt+tt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,In.__webglTexture,me),k!==0?L.blitFramebuffer(Ee,Fe,xe,pe,be,Ze,xe,pe,L.COLOR_BUFFER_BIT,L.NEAREST):je?L.copyTexSubImage3D(_e,me,be,Ze,dt+tt,Ee,Fe,xe,pe):L.copyTexSubImage2D(_e,me,be,Ze,Ee,Fe,xe,pe);x.bindFramebuffer(L.READ_FRAMEBUFFER,null),x.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else je?y.isDataTexture||y.isData3DTexture?L.texSubImage3D(_e,me,be,Ze,dt,xe,pe,Me,Qe,At,lt.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(_e,me,be,Ze,dt,xe,pe,Me,Qe,lt.data):L.texSubImage3D(_e,me,be,Ze,dt,xe,pe,Me,Qe,At,lt):y.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,me,be,Ze,xe,pe,Qe,At,lt.data):y.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,me,be,Ze,lt.width,lt.height,Qe,lt.data):L.texSubImage2D(L.TEXTURE_2D,me,be,Ze,xe,pe,Qe,At,lt);x.pixelStorei(L.UNPACK_ROW_LENGTH,Vt),x.pixelStorei(L.UNPACK_IMAGE_HEIGHT,We),x.pixelStorei(L.UNPACK_SKIP_PIXELS,$t),x.pixelStorei(L.UNPACK_SKIP_ROWS,rn),x.pixelStorei(L.UNPACK_SKIP_IMAGES,Pn),me===0&&N.generateMipmaps&&L.generateMipmap(_e),x.unbindTexture()},this.initRenderTarget=function(y){z.get(y).__webglFramebuffer===void 0&&Z.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Z.setTextureCube(y,0):y.isData3DTexture?Z.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Z.setTexture2DArray(y,0):Z.setTexture2D(y,0),x.unbindTexture()},this.resetState=function(){G=0,V=0,Y=null,x.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ge._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ge._getUnpackColorSpace()}}const Ac={type:"change"},Uo={type:"start"},Ud={type:"end"},Ks=new Er,wc=new kn,_y=Math.cos(70*dd.DEG2RAD),xt=new F,Ot=2*Math.PI,Ke={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ha=1e-6;class xy extends M0{constructor(e,t=null){super(e,t),this.state=Ke.NONE,this.target=new F,this.cursor=new F,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ci.ROTATE,MIDDLE:Ci.DOLLY,RIGHT:Ci.PAN},this.touches={ONE:Ri.ROTATE,TWO:Ri.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new F,this._lastQuaternion=new $n,this._lastTargetPosition=new F,this._quat=new $n().setFromUnitVectors(e.up,new F(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ec,this._sphericalDelta=new ec,this._scale=1,this._panOffset=new F,this._rotateStart=new Ie,this._rotateEnd=new Ie,this._rotateDelta=new Ie,this._panStart=new Ie,this._panEnd=new Ie,this._panDelta=new Ie,this._dollyStart=new Ie,this._dollyEnd=new Ie,this._dollyDelta=new Ie,this._dollyDirection=new F,this._mouse=new Ie,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=My.bind(this),this._onPointerDown=vy.bind(this),this._onPointerUp=Sy.bind(this),this._onContextMenu=Ry.bind(this),this._onMouseWheel=by.bind(this),this._onKeyDown=Ty.bind(this),this._onTouchStart=Ay.bind(this),this._onTouchMove=wy.bind(this),this._onMouseDown=yy.bind(this),this._onMouseMove=Ey.bind(this),this._interceptControlDown=Cy.bind(this),this._interceptControlUp=Py.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Ac),this.update(),this.state=Ke.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;xt.copy(t).sub(this.target),xt.applyQuaternion(this._quat),this._spherical.setFromVector3(xt),this.autoRotate&&this.state===Ke.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Ot:i>Math.PI&&(i-=Ot),s<-Math.PI?s+=Ot:s>Math.PI&&(s-=Ot),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(xt.setFromSpherical(this._spherical),xt.applyQuaternion(this._quatInverse),t.copy(this.target).add(xt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=xt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new F(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new F(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=xt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ks.origin.copy(this.object.position),Ks.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ks.direction))<_y?this.object.lookAt(this.target):(wc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ks.intersectPlane(wc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ha||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ha||this._lastTargetPosition.distanceToSquared(this.target)>ha?(this.dispatchEvent(Ac),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Ot/60*this.autoRotateSpeed*e:Ot/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){xt.setFromMatrixColumn(t,0),xt.multiplyScalar(-e),this._panOffset.add(xt)}_panUp(e,t){this.screenSpacePanning===!0?xt.setFromMatrixColumn(t,1):(xt.setFromMatrixColumn(t,0),xt.crossVectors(this.object.up,xt)),xt.multiplyScalar(e),this._panOffset.add(xt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;xt.copy(s).sub(this.target);let r=xt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ot*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ot*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ot*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ot*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ie,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function vy(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function My(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Sy(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ud),this.state=Ke.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function yy(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ci.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Ke.DOLLY;break;case Ci.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Ke.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Ke.ROTATE}break;case Ci.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Ke.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Ke.PAN}break;default:this.state=Ke.NONE}this.state!==Ke.NONE&&this.dispatchEvent(Uo)}function Ey(n){switch(this.state){case Ke.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Ke.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Ke.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function by(n){this.enabled===!1||this.enableZoom===!1||this.state!==Ke.NONE||(n.preventDefault(),this.dispatchEvent(Uo),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Ud))}function Ty(n){this.enabled!==!1&&this._handleKeyDown(n)}function Ay(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ri.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Ke.TOUCH_ROTATE;break;case Ri.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Ke.TOUCH_PAN;break;default:this.state=Ke.NONE}break;case 2:switch(this.touches.TWO){case Ri.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Ke.TOUCH_DOLLY_PAN;break;case Ri.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Ke.TOUCH_DOLLY_ROTATE;break;default:this.state=Ke.NONE}break;default:this.state=Ke.NONE}this.state!==Ke.NONE&&this.dispatchEvent(Uo)}function wy(n){switch(this._trackPointer(n),this.state){case Ke.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Ke.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Ke.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Ke.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Ke.NONE}}function Ry(n){this.enabled!==!1&&n.preventDefault()}function Cy(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Py(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Iy=Object.freeze({invalid:12986408,unsupported:14067456}),Dy={boundary:1842204,cut:0,hingeMountain:2894892,hingeValley:4473924,hingeUnassigned:3158064,flatSeam:6052956,link:2368548,sectorRay:1118481};function Ly(n,e){const t=new is;t.name="engine-lab-frame";const i=new Map;for(const s of n.faces){Fy(s.id,s.vertices);const r=pa(s.sourceEntities??[],e),a=new Ut;a.setAttribute("position",new Nt(s.vertices.flat(),3));const o=Ny(s.vertices);a.setIndex(o),a.computeVertexNormals();const l=new u0({color:ma(r)??14211288,metalness:0,roughness:.82,opacity:.72,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,side:dn}),c=new tn(a,l);c.renderOrder=0,fa(c,s.id,"face",s.sourceEntities??[],r,i,t),s.sourceOperationId!==void 0&&(c.userData.sourceOperationId=s.sourceOperationId)}for(const s of n.segments){rr(s.id,s.start),rr(s.id,s.end);const r=pa(s.sourceEntities??[],e),a=new Ut().setFromPoints([new F(...s.start),new F(...s.end)]),o=Uy(s.role,ma(r)??Dy[s.role]),l=new uo(a,o);l.renderOrder=1,o instanceof ir&&l.computeLineDistances(),fa(l,s.id,s.role,s.sourceEntities??[],r,i,t)}for(const s of n.points){rr(s.id,s.position);const r=pa(s.sourceEntities??[],e),a=new Ut;a.setAttribute("position",new Nt(s.position,3));const o=new _d({color:ma(r)??(s.role==="junction"?0:s.role==="anchor"?2236962:3355443),size:.055,sizeAttenuation:!0}),l=new Hl(a,o);l.renderOrder=2,fa(l,s.id,s.role,s.sourceEntities??[],r,i,t)}return{group:t,objectByPrimitiveId:i,dispose(){for(const s of i.values())if(s instanceof tn||s instanceof uo||s instanceof Hl){s.geometry.dispose();const r=Array.isArray(s.material)?s.material:[s.material];for(const a of r)a.dispose()}t.clear(),i.clear()}}}function Ny(n){const e=n.reduce((s,r,a)=>{const o=n[(a+1)%n.length];return[s[0]+(r[1]-o[1])*(r[2]+o[2]),s[1]+(r[2]-o[2])*(r[0]+o[0]),s[2]+(r[0]-o[0])*(r[1]+o[1])]},[0,0,0]),t=Math.abs(e[0])>=Math.abs(e[1])&&Math.abs(e[0])>=Math.abs(e[2])?0:Math.abs(e[1])>=Math.abs(e[2])?1:2,i=n.map(s=>t===0?new Ie(s[1],s[2]):t===1?new Ie(s[0],s[2]):new Ie(s[0],s[1]));return Lo.triangulateShape(i,[]).flat()}function fa(n,e,t,i,s,r,a){if(r.has(e))throw new RangeError(`Duplicate lab primitive ID: ${e}.`);n.name=e,n.userData.primitiveId=e,n.userData.role=t,n.userData.sourceEntities=i.map(o=>({...o})),s!==void 0&&(n.userData.diagnosticState=s),r.set(e,n),a.add(n)}function Uy(n,e){return n==="hingeMountain"?new ir({color:e,dashSize:.08,gapSize:.025}):n==="hingeValley"?new ir({color:e,dashSize:.025,gapSize:.04}):n==="hingeUnassigned"?new ir({color:e,dashSize:.04,gapSize:.04}):new br({color:e})}function pa(n,e){if(e===void 0||e.disposition==="accepted")return;const t=e.diagnostics.flatMap(i=>i.locations.some(r=>r.kind==="entity"&&n.some(a=>Rc(a)===Rc(r.entity)))?[i.category==="unsupported"?"unsupported":"invalid"]:[]);return t.includes("invalid")?"invalid":t.includes("unsupported")?"unsupported":void 0}function ma(n){return n===void 0?void 0:Iy[n]}function Rc(n){return`${n.kind}\0${n.id}`}function Fy(n,e){if(e.length<3)throw new RangeError(`Face ${n} requires at least three vertices.`);for(const t of e)rr(n,t)}function rr(n,e){if(e.length!==3||!e.every(Number.isFinite))throw new RangeError(`Primitive ${n} requires finite 3D coordinates.`)}const Cc=Object.freeze({gridCenter:13948116,grid:15658734});function Oy(n){const e=new gy({antialias:!0,alpha:!1});e.setClearColor(16777215,1),e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.outputColorSpace=Ht,n.append(e.domElement);const t=new P_;t.fog=new Io(16777215,.018);const i=new qt(42,1,.01,1e3);i.position.set(6,5,7);const s=new xy(i,e.domElement);s.enableDamping=!0,s.dampingFactor=.08,s.screenSpacePanning=!0,t.add(new g0(16777215,1.2));const r=new jl(16777215,2.5);r.position.set(4,7,5),t.add(r);const a=new jl(16777215,1.1);a.position.set(-5,2,-4),t.add(a);const o=new v0(24,24,Cc.gridCenter,Cc.grid);o.position.y=-.002,t.add(o);let l,c=!1;const u=()=>{const d=Math.max(n.clientWidth,1),f=Math.max(n.clientHeight,1);e.setSize(d,f,!1),i.aspect=d/f,i.updateProjectionMatrix()},h=new ResizeObserver(u);return h.observe(n),u(),e.setAnimationLoop(()=>{s.update(),e.render(t,i)}),{show(d,f){l?.dispose(),l&&t.remove(l.group),l=Ly(d,f),t.add(l.group)},focus(){if(!l)return;const d=new zi().setFromObject(l.group);if(d.isEmpty()){s.target.set(0,0,0),i.position.set(6,5,7),s.update();return}const f=d.getCenter(new F),m=d.getSize(new F),g=Math.max(m.length()*.5,.5)/Math.sin(dd.degToRad(i.fov*.5)),p=new F(1.15,.85,1.35).normalize();s.target.copy(f),i.position.copy(f).addScaledVector(p,g*1.15),i.near=Math.max(g/1e3,.001),i.far=Math.max(g*100,100),i.updateProjectionMatrix(),s.update()},resize:u,dispose(){c||(c=!0,h.disconnect(),e.setAnimationLoop(null),s.dispose(),l?.dispose(),e.dispose(),e.domElement.remove())}}}const By={points:[],segments:[],faces:[]},Js={width:1.2,stepCount:7,stepRun:.32,stepRise:.32,hostWidth:4,hostFloorExtent:2.56,hostWallExtent:2.56};function ky(n){n.innerHTML=`
    <main class="lab-shell">
      <header class="lab-header">
        <div>
          <span class="wordmark">KIRIGAMI</span>
          <h1>Engine Lab</h1>
        </div>
        <p>Validation corpus / engine-state viewer</p>
      </header>
      <aside class="catalog-panel" aria-label="Validation examples">
        <div class="panel-heading">
          <h2>Committed examples</h2>
          <span>${Ir.length}</span>
        </div>
        <nav class="example-list"></nav>
        <section class="stair-study" aria-label="Compiler stair patterns">
          <h2>Compiler stair patterns</h2>
          <p>One connected cut-and-score sheet</p>
          <div class="stair-strategy-list"></div>
          <small>Play the same topology from flat pattern to deployed stair.</small>
        </section>
      </aside>
      <section class="viewport-panel" aria-label="Engine viewport">
        <div class="viewport-host"></div>
        <div class="viewport-state" role="status" hidden></div>
        <div class="viewport-preview-label" role="status" hidden></div>
        <div class="stair-preview-label" role="status" hidden></div>
      </section>
      <aside class="inspector-panel" aria-label="Validation inspector">
        <div class="inspector-scroll"></div>
      </aside>
      <section class="timeline-panel" aria-label="Engine path timeline">
        <button class="timeline-play" type="button" aria-pressed="false">Play</button>
        <button class="timeline-step" data-direction="-1" type="button" aria-label="Previous engine sample">−</button>
        <div class="timeline-track">
          <input aria-label="Path sample" type="range" min="0" max="0" step="1" value="0" disabled />
          <div class="timeline-markers" aria-label="Diagnostic sample markers"></div>
        </div>
        <output>no engine samples</output>
        <button class="timeline-step" data-direction="1" type="button" aria-label="Next engine sample">+</button>
      </section>
    </main>
  `;const e=Qt(n,".example-list"),t=Qt(n,".viewport-host"),i=Qt(n,".viewport-state"),s=Qt(n,".viewport-preview-label"),r=Qt(n,".stair-preview-label"),a=Qt(n,".stair-strategy-list"),o=Qt(n,".inspector-scroll"),l=Qt(n,".timeline-panel input[type='range']"),c=Qt(n,".timeline-panel output"),u=Qt(n,".timeline-markers"),h=Qt(n,".timeline-play"),d=[...n.querySelectorAll(".timeline-step")],f=Oy(t),m=Nm();let _=0,g,p,b,w,v=0,A;const S=()=>{A!==void 0&&window.clearInterval(A),A=void 0,h.ariaPressed="false",h.textContent="Play"},T=K=>K.points.length+K.segments.length+K.faces.length>0,M=(K,$)=>{const Q=new Map;if(K.result.observed.disposition!=="accepted")for(const we of K.result.diagnostics)for(const Te of we.locations){if(Te.kind!=="sample")continue;const q=we.category==="unsupported"?"unsupported":"invalid";(q==="invalid"||Q.get(Te.index)===void 0)&&Q.set(Te.index,q)}const ue=Math.max($-1,...Q.keys(),0);u.replaceChildren(...[...Q.entries()].map(([we,Te])=>{const q=document.createElement("span");return q.dataset.diagnosticState=Te,q.style.left=`${ue===0?0:we/ue*100}%`,q.title=`${Te} at sample ${we+1}`,q.setAttribute("role","img"),q.setAttribute("aria-label",q.title),q}))},E=(K,$=!1)=>{const Q=p?.frames??g?.frames.map(q=>q.frame)??[],ue=p?.parameters??g?.frames.map(q=>q.parameter)??[];if(Q.length===0)return;v=Math.max(0,Math.min(K,Q.length-1));const we=Q[v];r.hidden=!p,s.hidden=!0,delete s.dataset.diagnosticState,f.show(we),$&&f.focus(),l.max=String(Q.length-1),l.value=String(v);const Te=Q.length>1;l.disabled=!Te,h.disabled=!Te;for(const q of d)q.disabled=!Te;g&&!p&&M(g,Q.length),c.value=`sample ${v+1}/${Q.length} · parameter ${Vy(ue[v]??0)}`},C=K=>{v=0,l.value="0",l.max="0",l.disabled=!0,h.disabled=!0;for(const $ of d)$.disabled=!0;c.value=K?"no renderable samples · previous geometry retained":"no engine samples"},P=K=>{i.hidden=K===void 0,i.textContent=K??""},I=K=>{Gm(o,g,K,{onParameterCommit($,Q){if(!w)return;const ue=Fm(w,$,Q);if(!ue.ok){I(ue.diagnostics[0]?.message);return}w=ue.example,X(ue.example,{preserveGeometryOnEmpty:!0,focus:!1})},onReset(){b&&(w=b,X(b,{preserveGeometryOnEmpty:!0,focus:!1}))}})},X=async(K,$)=>{S();const Q=++_;P(`Evaluating ${K.id}…`);try{const ue=await m.evaluate(K);if(Q!==_)return;g=ue,w=ue.example,v=0,I(),ue.frames.some(({frame:Te})=>T(Te))?E(0,$.focus):ue.diagnosticPreview!==void 0&&!$.preserveGeometryOnEmpty?(f.show(ue.diagnosticPreview.frame,{diagnostics:ue.result.diagnostics,disposition:ue.result.observed.disposition}),$.focus&&f.focus(),s.hidden=!1,s.dataset.diagnosticState=ue.result.observed.disposition==="rejected"?"invalid":"unsupported",s.textContent=`${ue.diagnosticPreview.label} · ${ue.result.observed.disposition}`,C(!1),M(ue,0),c.value=`${ue.diagnosticPreview.label} · no certified engine samples`):($.preserveGeometryOnEmpty||(f.show(By),$.focus&&f.focus()),s.hidden=!1,s.dataset.diagnosticState=ue.result.observed.disposition==="rejected"?"invalid":"unsupported",s.textContent=$.preserveGeometryOnEmpty?`${ue.result.observed.disposition} input · previous certified geometry retained`:`${ue.result.observed.disposition} · no spatial preview`,C($.preserveGeometryOnEmpty),M(ue,0)),P()}catch(ue){if(Q!==_)return;const we=ue instanceof Error?ue.message:String(ue);I(we),P(`Engine error · ${we}`)}},W=K=>{const $=Ir[K];if($){for(const[Q,ue]of[...e.querySelectorAll(".example-row")].entries())ue.ariaPressed=String(Q===K);b=$.example,w=$.example,p=void 0,r.hidden=!0,X($.example,{preserveGeometryOnEmpty:!1,focus:!0})}},U=()=>{S(),_+=1,g=void 0,s.hidden=!0,r.hidden=!1;const K={operationId:"certified-one-sheet-stair",hostPlane:"wall",...Js},$=Uc(K);if(!$.ok){o.textContent=$.diagnostics[0]?.message??"Stair rejected.";return}const Q=Hc({input:K,complex:$.complex,sourceMap:$.sourceMap,sampleCount:7});if(!Q.ok){o.textContent=Q.diagnostics[0]?.message??"Stair path rejected.";return}r.textContent="certified compiler result · One-sheet staircase";const ue=Q.samples.map(we=>$m($.complex,$.sourceMap,K,we.transforms));p={frames:ue,parameters:Q.samples.map(we=>we.parameter)},f.show(ue.at(-1)),f.focus(),o.innerHTML=`
      <section class="inspection-section">
        <h2>One-sheet staircase</h2>
        <p class="quiet">Certified as one connected material component after cuts: stair, bridges, and host remain materially joined.</p>
      </section>
      <section class="inspection-section">
        <h2>Construction</h2>
        <p class="quiet">${K.stepCount} steps · 4 × 5.12 source sheet · ${$.sourceMap.faces.filter(we=>we.role==="step").length} retained step surfaces · ${$.sourceMap.cutPairs.length} paired cuts · ${$.sourceMap.voids.length} opening voids.</p>
        <p class="quiet">Construction status: certified connected sheet.</p>
      </section>
    `,E(ue.length-1)},G=document.createElement("button");G.type="button",G.className="stair-strategy-button",G.ariaPressed="false",G.textContent="One-sheet staircase",G.addEventListener("click",()=>{G.ariaPressed="true",U()}),a.append(G);const V=document.createElement("button");V.type="button",V.className="stair-strategy-button",V.ariaPressed="false",V.textContent="Tread-only staircase",V.addEventListener("click",()=>{S(),_+=1,g=void 0,s.hidden=!0,r.hidden=!1;const K={operationId:"tread-only-stair",...Js},$=xo(K);if(!$.ok){o.textContent=$.diagnostics[0]?.message??"Tread-only pattern rejected.";return}const Q=vo({input:K,complex:$.complex,sourceMap:$.sourceMap,sampleCount:7});if(!Q.ok){o.textContent=Q.diagnostics[0]?.message??"Tread-only deployment rejected.";return}const ue=Q.samples.map(Te=>Te.parameter),we=Q.samples.map(Te=>Xm($.complex,$.sourceMap,Te.transforms));p={frames:we,parameters:ue},f.show(we.at(-1)),f.focus(),r.textContent="compiler construction preview · Tread-only staircase",o.innerHTML=`
      <section class="inspection-section">
        <h2>Tread-only staircase</h2>
        <p class="quiet">${K.stepCount} steps · 4 × 5.12 source sheet. Compiled directly from the approved one-sheet cut/score template: ${$.sourceMap.cutLines.length} authored long cuts, ${$.sourceMap.hinges.filter(Te=>Te.role!=="parent").length} step folds, and no riser faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">Computed from one topology: retained edges remain joined while paired cut banks open into negative space.</p>
      </section>
    `,E(we.length-1)}),a.append(V);const Y=document.createElement("button");Y.type="button",Y.className="stair-strategy-button",Y.ariaPressed="false",Y.textContent="Riser-only staircase",Y.addEventListener("click",()=>{S(),_+=1,g=void 0,s.hidden=!0,r.hidden=!1;const K={operationId:"riser-only-stair",...Js},$=tg(K);if(!$.ok){o.textContent=$.diagnostics[0]?.message??"Riser-only pattern rejected.";return}const Q=ng({input:K,complex:$.complex,sourceMap:$.sourceMap,sampleCount:7});if(!Q.ok){o.textContent=Q.diagnostics[0]?.message??"Riser-only deployment rejected.";return}const ue=Q.samples.map(Te=>Te.parameter),we=Q.samples.map(Te=>Ym($.complex,$.sourceMap,Te.transforms));p={frames:we,parameters:ue},f.show(we.at(-1)),f.focus(),r.textContent="compiler construction preview · Riser-only staircase",o.innerHTML=`
      <section class="inspection-section">
        <h2>Riser-only staircase</h2>
        <p class="quiet">${K.stepCount} steps · 4 × 5.12 source sheet. Compiled from the same one-sheet cut topology in its flipped deployment: ${$.sourceMap.cutLines.length} authored long cuts, ${$.sourceMap.supports.length} retained riser regions, and no tread faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">The stationary host supports the risers while one connected carrier wall preserves their material ancestry and retained-edge closure.</p>
      </section>
    `,E(we.length-1)}),a.append(Y);const ne=document.createElement("button");ne.type="button",ne.className="stair-strategy-button",ne.ariaPressed="false",ne.textContent="Carrier-hosted compound staircase",ne.addEventListener("click",()=>{S(),_+=1,g=void 0,s.hidden=!0,r.hidden=!1;const K=ag({operationId:"carrier-hosted-compound-stair",parent:Js,child:{width:.16,stepCount:4,stepRun:.144,stepRise:.144,hostWidth:.24,hostFloorExtent:.72,hostWallExtent:.72},childHostStepIndex:6});if(!K.ok){o.textContent=K.diagnostics[0]?.message??"Compound stair rejected.";return}const $=og({compilation:K,sampleCount:7});if(!$.ok){o.textContent=$.diagnostics[0]?.message??"Compound deployment rejected.";return}const Q=$.samples.map(we=>we.parameter),ue=$.samples.map(we=>qm(K,we));p={frames:ue,parameters:Q},f.show(ue.at(-1)),f.focus(),r.textContent="compiler construction preview · Carrier-hosted compound staircase",o.innerHTML=`
      <section class="inspection-section">
        <h2>Carrier-hosted compound staircase</h2>
        <p class="quiet">A seven-step tread-only parent and four-step full stair compile from one 4 × 5.12 source sheet.</p>
      </section>
      <section class="inspection-section">
        <h2>Material ancestry</h2>
        <p class="quiet">The child pattern is subdivided directly into the parent carrier and common lower sheet. Its perimeter remains stitched to surrounding parent material; no separate child sheet or rectangular extraction boundary exists.</p>
      </section>
      <section class="inspection-section">
        <h2>Status</h2>
        <p class="quiet">Integrated topology: one material component, outer-sheet boundaries only, full source-area conservation, and sampled retained-edge closure.</p>
      </section>
    `,E(ue.length-1)}),a.append(ne);for(const[K,$]of Ir.entries()){const Q=document.createElement("button");Q.type="button",Q.className="example-row",Q.ariaPressed="false",Q.innerHTML=`
      <span class="example-index">${String(K+1).padStart(2,"0")}</span>
      <span>
        <strong>${ga($.example.title)}</strong>
        <small>${ga($.example.kind)} · ${ga($.example.fixtureClass)}</small>
      </span>
    `,Q.addEventListener("click",()=>W(K)),e.append(Q)}return l.addEventListener("input",()=>{r.hidden=!0,S(),E(Number(l.value))}),d.forEach(K=>{K.addEventListener("click",()=>{S(),E(v+Number(K.dataset.direction))})}),h.addEventListener("click",()=>{if(A!==void 0){S();return}const K=p?.frames.length??g?.frames.length??0;K<=1||(v>=K-1&&E(0),h.ariaPressed="true",h.textContent="Pause",A=window.setInterval(()=>{const $=p?.frames.length??g?.frames.length??0;if($===0||v>=$-1){S();return}E(v+1)},650))}),I(),W(0),()=>{_+=1,S(),m.dispose(),f.dispose(),n.replaceChildren()}}function Qt(n,e){const t=n.querySelector(e);if(!t)throw new Error(`Missing Engine Lab element: ${e}.`);return t}function Vy(n){return Math.abs(n)>=1e3||n!==0&&Math.abs(n)<.001?n.toExponential(5):n.toFixed(5).replace(/0+$/,"").replace(/\.$/,"")}function ga(n){return n.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}const Fd=document.querySelector("#app");if(!Fd)throw new Error("Missing Engine Lab root.");ky(Fd);
