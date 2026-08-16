(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Zd=1;function Sr(n){if(!Kd(n))return[ft("TOPOLOGY_SCHEMA_UNSUPPORTED","Value does not have the required cell-complex collections.",[])];if(n.schemaVersion!==Zd)return[ft("TOPOLOGY_SCHEMA_UNSUPPORTED",`Topology schema version ${String(n.schemaVersion)} is not supported.`,[])];const e=Jd(n);if(e)return[ft("TOPOLOGY_DUPLICATE_ID",`Entity ID ${e.id} is not unique.`,[e])];const t=[],i=new Map(n.vertices.map(l=>[l.id,l])),s=new Map(n.halfEdges.map(l=>[l.id,l])),r=new Map(n.edges.map(l=>[l.id,l])),a=new Map(n.faces.map(l=>[l.id,l])),o=new Map(n.cutPairs.map(l=>[l.id,l]));for(const l of n.vertices)(l.position.length!==2||!l.position.every(c=>Number.isFinite(c)))&&t.push(ft("TOPOLOGY_INVALID_NUMBER","Vertex coordinates must be finite two-dimensional values.",[it("vertex",l.id)]));for(const l of n.halfEdges){Hi(t,i,"vertex",l.origin,l),Hi(t,s,"halfEdge",l.next,l),Hi(t,r,"edge",l.edge,l),Hi(t,a,"face",l.face,l),l.twin!==void 0&&Hi(t,s,"halfEdge",l.twin,l);const c=r.get(l.edge);c&&!c.halfEdges.includes(l.id)&&t.push(ft("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[it("halfEdge",l.id),it("edge",c.id)]))}for(const l of n.edges)Qd(l,s,t);for(const l of n.faces){Jo(l,l.boundary,"boundary",s,t);for(const c of l.holes)Jo(l,c,"hole",s,t)}for(const l of n.cutPairs)eu(l,r,t);for(const l of n.edges.filter(c=>c.kind==="cutBank")){const c=l.cutBank?o.get(l.cutBank.pair):void 0;(!c||!c.banks.includes(l.id))&&t.push(ft("TOPOLOGY_CUT_PAIR_INVALID","Each cut bank must reference a cut pair that lists that edge.",[it("edge",l.id)]))}return tu(n,a,t),t}function Kd(n){if(typeof n!="object"||n===null)return!1;const e=n;return Array.isArray(e.vertices)&&e.vertices.every(t=>hi(t)&&Array.isArray(t.position)&&t.position.length===2)&&Array.isArray(e.halfEdges)&&e.halfEdges.every(t=>hi(t)&&typeof t.origin=="string"&&typeof t.next=="string"&&typeof t.edge=="string"&&typeof t.face=="string")&&Array.isArray(e.edges)&&e.edges.every(t=>hi(t)&&Array.isArray(t.halfEdges)&&typeof t.kind=="string")&&Array.isArray(e.faces)&&e.faces.every(t=>hi(t)&&typeof t.boundary=="string"&&Array.isArray(t.holes))&&Array.isArray(e.cutPairs)&&e.cutPairs.every(t=>hi(t)&&Array.isArray(t.banks))&&Array.isArray(e.materialComponents)&&e.materialComponents.every(t=>hi(t)&&Array.isArray(t.faces))}function hi(n){return typeof n=="object"&&n!==null&&typeof n.id=="string"}function Jd(n){const e=new Set,t=[["vertex",n.vertices],["halfEdge",n.halfEdges],["edge",n.edges],["face",n.faces],["cutPair",n.cutPairs],["materialComponent",n.materialComponents]];for(const[i,s]of t)for(const r of s){if(e.has(r.id))return it(i,r.id);e.add(r.id)}}function Hi(n,e,t,i,s){e.has(i)||n.push(ft("TOPOLOGY_MISSING_REFERENCE",`Half-edge ${s.id} references missing ${t} ${i}.`,[it("halfEdge",s.id),it(t,i)]))}function Qd(n,e,t){const i=n.kind==="hinge"||n.kind==="joined"||n.kind==="flatSeam",s=i?2:1;n.halfEdges.length!==s&&t.push(ft("TOPOLOGY_EDGE_CARDINALITY",`Edge kind ${n.kind} requires ${s} half-edge(s).`,[it("edge",n.id)]));const r=n.halfEdges.map(a=>e.get(a)).filter(a=>a!==void 0);if(r.some(a=>a.edge!==n.id)&&t.push(ft("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[it("edge",n.id)])),i&&r.length===2){const[a,o]=r;(a.twin!==o.id||o.twin!==a.id)&&t.push(ft("TOPOLOGY_TWIN_MISMATCH","Two-sided edge half-edges must be symmetric twins.",[it("edge",n.id),it("halfEdge",a.id),it("halfEdge",o.id)]));const l=e.get(a.next)?.origin,c=e.get(o.next)?.origin;l!==void 0&&c!==void 0&&(a.origin!==c||o.origin!==l)&&t.push(ft("TOPOLOGY_TWIN_ORIENTATION","Twin half-edges must traverse the shared edge in opposite directions.",[it("edge",n.id),it("halfEdge",a.id),it("halfEdge",o.id)]))}else!i&&r.some(a=>a.twin!==void 0)&&t.push(ft("TOPOLOGY_TWIN_MISMATCH","One-sided boundary and cut-bank half-edges cannot have twins.",[it("edge",n.id)]));jd(n,t)}function jd(n,e){if(n.kind==="hinge"){if(!n.hinge){e.push(ft("TOPOLOGY_HINGE_SPEC_INVALID","A hinge edge requires a hinge specification.",[it("edge",n.id)]));return}const[i,s]=n.hinge.angleRange;(![i,s,n.hinge.restAngle].every(Number.isFinite)||i>s||n.hinge.restAngle<i||n.hinge.restAngle>s)&&e.push(ft("TOPOLOGY_HINGE_INTERVAL_INVALID","Hinge angle bounds must be finite, ordered, and contain the rest angle.",[it("edge",n.id)]))}else n.hinge!==void 0&&e.push(ft("TOPOLOGY_HINGE_SPEC_INVALID","Only hinge edges may carry hinge specifications.",[it("edge",n.id)]));const t=n.cutBank!==void 0;n.kind==="cutBank"!==t&&e.push(ft("TOPOLOGY_CUT_PAIR_INVALID","Cut-bank metadata is required exactly on cut-bank edges.",[it("edge",n.id)]))}function Jo(n,e,t,i,s){const r=new Set;let a=e;for(;!r.has(a);){r.add(a);const o=i.get(a);if(!o||o.face!==n.id){s.push(Qo(n,t));return}a=o.next}(a!==e||r.size<3)&&s.push(Qo(n,t))}function Qo(n,e){return ft("TOPOLOGY_FACE_LOOP_OPEN",`Face ${e} must form a closed loop of at least three half-edges.`,[it("face",n.id)])}function eu(n,e,t){const[i,s]=n.banks,r=e.get(i),a=e.get(s);i!==s&&r?.kind==="cutBank"&&a?.kind==="cutBank"&&r.cutBank?.pair===n.id&&a.cutBank?.pair===n.id&&new Set([r.cutBank.bank,a.cutBank.bank]).size===2||t.push(ft("TOPOLOGY_CUT_PAIR_INVALID","A cut pair requires two distinct cut-bank edges labeled a and b.",[it("cutPair",n.id)]))}function tu(n,e,t){const i=new Map;for(const r of n.materialComponents)for(const a of r.faces)i.set(a,(i.get(a)??0)+1),e.has(a)||t.push(ft("TOPOLOGY_MISSING_REFERENCE",`Material component ${r.id} references missing face ${a}.`,[it("materialComponent",r.id),it("face",a)]));for(const r of n.faces)i.get(r.id)!==1&&t.push(ft("TOPOLOGY_COMPONENT_INVALID","Every face must belong to exactly one material component.",[it("face",r.id)]));const s=new Map;for(const r of n.edges){if(!["hinge","joined","flatSeam"].includes(r.kind)||r.halfEdges.length!==2)continue;const a=r.halfEdges.map(c=>n.halfEdges.find(u=>u.id===c)).filter(c=>c!==void 0);if(a.length!==2||a[0].face===a[1].face)continue;const[o,l]=a.map(c=>c.face);s.get(o)?.add(l)??s.set(o,new Set([l])),s.get(l)?.add(o)??s.set(l,new Set([o]))}for(const r of n.materialComponents){const a=r.faces.filter(c=>e.has(c));if(a.length<2)continue;const o=new Set([a[0]]),l=[a[0]];for(;l.length>0;){const c=l.shift();for(const u of s.get(c)??[])a.includes(u)&&!o.has(u)&&(o.add(u),l.push(u))}o.size!==a.length&&t.push(ft("TOPOLOGY_COMPONENT_INVALID",`Material component ${r.id} contains disconnected faces; cut banks cannot substitute for a sheet connection.`,[it("materialComponent",r.id)]))}}function ft(n,e,t){return{severity:"error",category:"topology",code:n,message:e,locations:t.length>0?t.map(i=>({kind:"entity",entity:i})):[{kind:"nonSpatial",reason:"Topology schema root."}],entities:t}}function it(n,e){return{kind:n,id:e}}const Di={absoluteLength:1e-9,absoluteAngle:1e-9,relativeRank:1e-10};function Dc(n,e){const t=n.vertices.find(r=>r.id===e);if(!t)return{applicability:"notApplicable",reason:`Vertex ${e} does not exist.`};const i=n.edges.map(r=>({edge:r,endpoints:iu(n,r)})).filter(({endpoints:r})=>r.includes(e));if(i.length===0)return{applicability:"notApplicable",reason:"Vertex has no incident material edges."};if(i.some(({edge:r})=>r.kind!=="hinge"||!r.hinge))return{applicability:"notApplicable",reason:"Classical single-vertex tests do not apply to non-hinge incidence."};const s=i.map(({edge:r,endpoints:a})=>{const o=a[0]===e?a[1]:a[0],l=n.vertices.find(h=>h.id===o);if(!l||!r.hinge)throw new Error("Validated incident edge is missing geometry.");const c=l.position[0]-t.position[0],u=l.position[1]-t.position[1];if(!(Math.hypot(c,u)<=Di.absoluteLength))return{edgeId:r.id,directionAngle:Math.atan2(u,c),assignment:r.hinge.assignment}}).filter(r=>r!==void 0).sort((r,a)=>r.directionAngle-a.directionAngle);if(s.length!==i.length||s.length<2)return{applicability:"notApplicable",reason:"Crease rays must be nondegenerate."};for(let r=0;r<s.length;r+=1){const a=s[(r+1)%s.length];if((r===s.length-1?a.directionAngle+Math.PI*2-s[r].directionAngle:a.directionAngle-s[r].directionAngle)<=Di.absoluteAngle)return{applicability:"notApplicable",reason:"Crease rays must have distinct directions."}}return{applicability:"applicable",rays:s,sectorAngles:s.map((r,a)=>{const o=s[(a+1)%s.length];return a===s.length-1?o.directionAngle+Math.PI*2-r.directionAngle:o.directionAngle-r.directionAngle})}}function nu(n,e){const t=Dc(n,e);return t.applicability==="notApplicable"?t:{applicability:"applicable",rays:t.rays,sectorAngles:t.sectorAngles,...Nc(t.sectorAngles,t.rays.map(i=>i.assignment))}}function Nc(n,e,t=Di.absoluteAngle){if(n.length!==e.length||n.length<2||n.some(f=>!Number.isFinite(f)||f<=0)){const f={status:"failed",reason:"Sector angles and assignments must be finite matching arrays."};return{kawasaki:f,maekawa:f,locallyFlatFoldable:!1}}const i=n.length%2!==0,s=n.reduce((f,p,v)=>(f[v%2]+=p,f),[0,0]),r=s[0]+s[1],a=Math.max(Math.abs(s[0]-Math.PI),Math.abs(s[1]-Math.PI),Math.abs(r-Math.PI*2)),o={status:!i&&a<=t?"satisfied":"failed",residual:a,...i?{reason:"Kawasaki requires even crease degree."}:{}},l=e.every(f=>f==="mountain"||f==="valley"),c=e.filter(f=>f==="mountain").length,u=e.filter(f=>f==="valley").length,h=Math.abs(Math.abs(c-u)-2),d=l?{status:h===0?"satisfied":"failed",residual:h}:{status:"notApplicable",reason:"Maekawa requires a complete mountain/valley assignment."};return{kawasaki:o,maekawa:d,locallyFlatFoldable:o.status==="satisfied"&&d.status==="satisfied"}}function iu(n,e){const t=n.halfEdges.find(s=>s.id===e.halfEdges[0]),i=t?n.halfEdges.find(s=>s.id===t.next):void 0;if(!t||!i)throw new Error(`Edge ${e.id} has incomplete half-edge topology.`);return[t.origin,i.origin]}function su(n,e=16){if(n.length<2||n.length>e||n.some(r=>!Number.isFinite(r)||r<=0))return{applicable:!1,candidateAssignments:[],locallyFlatFoldableAssignments:[],truncated:!1,reason:"Vertex degree is outside the bounded enumeration domain."};const t=2**n.length,i=[],s=[];for(let r=0;r<t;r+=1){const a=n.map((l,c)=>(r>>c&1)===0?"mountain":"valley");i.push(a),Nc(n,a).locallyFlatFoldable&&s.push(a)}return{applicable:!0,candidateAssignments:i,locallyFlatFoldableAssignments:s,truncated:!1}}function ru(n){const e=n.edges.filter(r=>r.kind==="cutBank"),t=new Set(n.cutPairs.flatMap(r=>r.banks)),i=e.map(r=>r.id).filter(r=>!t.has(r)),s=n.cutPairs.filter(r=>r.banks.length!==2||r.banks[0]===r.banks[1]?!0:r.banks.some(a=>{const o=n.edges.find(l=>l.id===a);return o?.kind!=="cutBank"||o.cutBank?.pair!==r.id})).map(r=>r.id);return{certified:i.length===0&&s.length===0,cutPairIds:n.cutPairs.map(r=>r.id),unpairedCutBankIds:i,invalidCutPairIds:s}}function Uc(n){const e=n.edges.filter(t=>t.kind==="hinge"&&t.hinge?.assignment==="unassigned").map(t=>t.id);return{complete:e.length===0,unassignedHingeIds:e}}function Fc(n){const e=n.vertices.flatMap(a=>{const o=nu(n,a.id);return o.applicability==="applicable"?[{vertexId:a.id,analysis:o,counting:su(o.sectorAngles)}]:[]}),t=Oc(n),i=Uc(n),s=au(n),r=t.colorable&&i.complete&&s&&e.every(({analysis:a})=>a.locallyFlatFoldable);return{applicability:"local-gates-only",faceTwoColorability:t,mountainValley:i,localVertices:e,materialConnected:s,necessaryGatesSatisfied:r,globalProof:"unsupported"}}function au(n){if(n.faces.length<=1)return!0;const e=new Map(n.faces.map(s=>[s.id,new Set]));for(const s of n.edges){if(!["hinge","joined","flatSeam"].includes(s.kind)||s.halfEdges.length!==2)continue;const r=s.halfEdges.map(a=>n.halfEdges.find(o=>o.id===a)?.face);r[0]&&r[1]&&r[0]!==r[1]&&(e.get(r[0])?.add(r[1]),e.get(r[1])?.add(r[0]))}const t=new Set,i=[n.faces[0].id];for(;i.length;){const s=i.shift();t.has(s)||(t.add(s),i.push(...e.get(s)??[]))}return t.size===n.faces.length}function Oc(n){const e=new Map(n.faces.map(i=>[i.id,new Set]));for(const i of n.edges){if(i.halfEdges.length!==2)continue;const s=i.halfEdges.map(r=>n.halfEdges.find(a=>a.id===r)).filter(r=>r!==void 0);s.length!==2||s[0].face===s[1].face||(e.get(s[0].face)?.add(s[1].face),e.get(s[1].face)?.add(s[0].face))}const t=new Map;for(const i of n.faces){if(t.has(i.id))continue;t.set(i.id,0);const s=[i.id];for(;s.length>0;){const r=s.shift(),a=t.get(r);for(const o of e.get(r)??[]){const l=a===0?1:0,c=t.get(o);if(c!==void 0){if(c!==l)return{colorable:!1,colors:t,conflict:[r,o]};continue}t.set(o,l),s.push(o)}}}return{colorable:!0,colors:t}}function Bc(n){const e=ou(n);if(e)return{ok:!1,diagnostics:[e]};const t=n.stepCount*2+2,i=[],s=[],r=[],a=[],o=[],l=[],c=[],u=[],h=[],d=(n.hostWidth-n.width)/2,f=[0,d,d+n.width,n.hostWidth],p=t*n.stepRun,v=n.hostFloorExtent+n.hostWallExtent,m=-n.hostFloorExtent+(v-p)/2;for(let S=0;S<=t;S+=1)for(let C=0;C<f.length;C+=1)i.push({id:`v:${S}:${C}`,position:[f[C],m+S*n.stepRun]});for(let S=0;S<t;S+=1)for(let C=0;C<3;C+=1){const R=C===1?`stair-face:${S}`:`host-face:${S}:${C}`,I=`he:${S}:${C}:bottom`,H=`he:${S}:${C}:right`,W=`he:${S}:${C}:top`,N=`he:${S}:${C}:left`;r.push({id:I,origin:`v:${S}:${C}`,next:H,edge:"pending",face:R},{id:H,origin:`v:${S}:${C+1}`,next:W,edge:"pending",face:R},{id:W,origin:`v:${S+1}:${C+1}`,next:N,edge:"pending",face:R},{id:N,origin:`v:${S+1}:${C}`,next:I,edge:"pending",face:R}),s.push({id:R,boundary:I,holes:[]});const Y=C!==1||S===0?"host":S===t-1?"bridge":S%2===1?"step":"bridge";l.push({faceId:R,operationId:n.operationId,role:Y})}const g=new Map(r.map(S=>[S.id,S])),E=(S,C)=>{for(const R of S)g.get(R).edge=C.id;S.length===2&&(g.get(S[0]).twin=S[1],g.get(S[1]).twin=S[0]),a.push(C),c.push({edgeId:C.id,operationId:n.operationId})};for(let S=0;S<3;S+=1){E([`he:0:${S}:bottom`],{id:`boundary:bottom:${S}`,halfEdges:[`he:0:${S}:bottom`],kind:"boundary"}),E([`he:${t-1}:${S}:top`],{id:`boundary:top:${S}`,halfEdges:[`he:${t-1}:${S}:top`],kind:"boundary"});for(let C=1;C<t;C+=1){const R=[`he:${C-1}:${S}:top`,`he:${C}:${S}:bottom`];if(S===1){const I=C%2===0?"valley":"mountain";E(R,{id:`hinge:${C-1}`,halfEdges:R,kind:"hinge",hinge:{assignment:I,restAngle:0,angleRange:I==="valley"?[0,Math.PI]:[-Math.PI,0]}})}else C===t/2?E(R,{id:`host-hinge:${S}`,halfEdges:R,kind:"hinge",hinge:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}):E(R,{id:`seam:h:${C}:${S}`,halfEdges:R,kind:"flatSeam"})}}for(let S=0;S<t;S+=1){E([`he:${S}:0:left`],{id:`boundary:left:${S}`,halfEdges:[`he:${S}:0:left`],kind:"boundary"}),E([`he:${S}:2:right`],{id:`boundary:right:${S}`,halfEdges:[`he:${S}:2:right`],kind:"boundary"});for(let C=1;C<=2;C+=1){const R=`he:${S}:${C-1}:right`,I=`he:${S}:${C}:left`;if(S===0||S===t-1){E([R,I],{id:`seam:v:${S}:${C}`,halfEdges:[R,I],kind:"flatSeam"});continue}const W=`cut:${S}:${C}`,N=`${W}:a`,Y=`${W}:b`;E([R],{id:N,halfEdges:[R],kind:"cutBank",cutBank:{pair:W,bank:"a"}}),E([I],{id:Y,halfEdges:[I],kind:"cutBank",cutBank:{pair:W,bank:"b"}}),o.push({id:W,banks:[N,Y]});const k=Math.min(n.stepCount-1,Math.floor((S-1)/2));u.push({cutPairId:W,operationId:n.operationId,stepIndex:k}),S%2===1&&S<t-1&&h.push({voidId:`void:${S}:${C}`,stepIndex:k,cutPairIds:[W]})}}const b={schemaVersion:1,vertices:i,halfEdges:r,edges:a,faces:s,cutPairs:o,materialComponents:[{id:`stair-material:${n.operationId}`,faces:s.map(S=>S.id)}]},M=Sr(b);if(M.length>0)return{ok:!1,diagnostics:M};if(!Oc(b).colorable)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_FLAT_COLORING_FAILED",message:"The stair crease graph is not two-colorable and cannot represent a flat origami sheet.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]};if(!Fc(b).materialConnected)return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:"The generated stair material is disconnected across its crease graph.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]};const P=Uc(b);if(!P.complete)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_ASSIGNMENT_MISMATCH",message:`Flat stair crease graph has unassigned hinges: ${P.unassignedHingeIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]};const _=ru(b);return _.certified?{ok:!0,complex:b,sourceMap:{operationId:n.operationId,host:{plane:n.hostPlane??"wall",width:n.hostWidth,extent:n.hostPlane==="floor"?n.hostFloorExtent:n.hostWallExtent},faces:l,edges:c,cutPairs:u,voids:h}}:{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_CUT_PAIR_INVALID",message:`Stair cut graph contains unpaired cut banks: ${_.unpairedCutBankIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId}}],entities:[{kind:"spatialOperation",id:n.operationId}]}]}}function ou(n){return typeof n.operationId=="string"&&n.operationId.length>0&&Number.isFinite(n.width)&&n.width>0&&Number.isInteger(n.stepCount)&&n.stepCount>0&&Number.isFinite(n.stepRun)&&n.stepRun>0&&Number.isFinite(n.stepRise)&&n.stepRise>0&&n.stepRun===n.stepRise&&Number.isFinite(n.hostWidth)&&n.hostWidth>=n.width&&Number.isFinite(n.hostFloorExtent)&&n.hostFloorExtent>=n.stepCount*n.stepRun&&Number.isFinite(n.hostWallExtent)&&n.hostWallExtent>=n.stepCount*n.stepRise?void 0:{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:n.stepRun!==n.stepRise?"Certified stairs require equal step run and rise.":"Stair dimensions must be positive and fit within the host sheet bounds.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n.operationId||"unknown"}}],entities:[{kind:"spatialOperation",id:n.operationId||"unknown"}]}}function kc(n,e){return[n[0]+e[0],n[1]+e[1],n[2]+e[2]]}function Gn(n,e){return[n[0]-e[0],n[1]-e[1],n[2]-e[2]]}function Vc(n,e){return[n[0]*e,n[1]*e,n[2]*e]}function ht(n,e){return n[0]*e[0]+n[1]*e[1]+n[2]*e[2]}function zc(n,e){return[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]]}function ls(n){return Math.hypot(n[0],n[1],n[2])}function Gc(n){const e=ls(n);if(!Number.isFinite(e)||e===0)throw new RangeError("Axis must be finite and nonzero.");return Vc(n,1/e)}function yr(n,e){return[ht(n[0],e),ht(n[1],e),ht(n[2],e)]}function lu(n,e){const t=a=>[e[0][a],e[1][a],e[2][a]],i=t(0),s=t(1),r=t(2);return[[ht(n[0],i),ht(n[0],s),ht(n[0],r)],[ht(n[1],i),ht(n[1],s),ht(n[1],r)],[ht(n[2],i),ht(n[2],s),ht(n[2],r)]]}function Ct(n,e){return kc(yr(n.rotation,e),n.translation)}function Tn(n,e){return{rotation:lu(n.rotation,e.rotation),translation:kc(yr(n.rotation,e.translation),n.translation)}}function cr(n){const e=[[n.rotation[0][0],n.rotation[1][0],n.rotation[2][0]],[n.rotation[0][1],n.rotation[1][1],n.rotation[2][1]],[n.rotation[0][2],n.rotation[1][2],n.rotation[2][2]]];return{rotation:e,translation:Vc(yr(e,n.translation),-1)}}function cu(n,e){if(!Number.isFinite(e))throw new RangeError("Rotation angle must be finite.");const[t,i,s]=Gc(n),r=Math.cos(e),a=Math.sin(e),o=1-r;return[[r+t*t*o,t*i*o-s*a,t*s*o+i*a],[i*t*o+s*a,r+i*i*o,i*s*o-t*a],[s*t*o-i*a,s*i*o+t*a,r+s*s*o]]}function Ni(n,e,t){const i=cu(e,t);return{rotation:i,translation:Gn(n,yr(i,n))}}function du(n){if(![...n.rotation[0],...n.rotation[1],...n.rotation[2],...n.translation].every(Number.isFinite))return Number.POSITIVE_INFINITY;const[t,i,s]=n.rotation;return Math.max(Math.abs(ht(t,t)-1),Math.abs(ht(i,i)-1),Math.abs(ht(s,s)-1),Math.abs(ht(t,i)),Math.abs(ht(t,s)),Math.abs(ht(i,s)),Math.abs(ht(t,zc(i,s))-1))}function vo(n,e=1e-9){const t=du(n);return Number.isFinite(t)&&t<=e}function uu(n,e,t=1e-9){const i=new Map(e.facePoses.map(o=>[o.faceId,o])),s=new Set;for(const o of n.edges){if(o.halfEdges.length!==2)continue;const l=o.halfEdges.map(c=>n.halfEdges.find(u=>u.id===c));!l[0]||!l[1]||l[0].face===l[1].face||s.add(jo(l[0].face,l[1].face))}const r=n.faces.flatMap(o=>{const l=i.get(o.id);if(!l)return[];const c=hu(n,o).map(h=>Ct(l.transform,h));if(c.length<3)return[];const u=Gc(zc(Gn(c[1],c[0]),Gn(c[2],c[0])));return[{face:o,points:c,normal:u}]}),a=[];for(let o=0;o<r.length;o+=1)for(let l=o+1;l<r.length;l+=1){const c=r[o],u=r[l];if(s.has(jo(c.face.id,u.face.id))||Math.abs(Math.abs(ht(c.normal,u.normal))-1)>t||Math.abs(ht(c.normal,Gn(u.points[0],c.points[0])))>t)continue;const h=fu(c.normal),d=c.points.map(p=>el(p,h)),f=u.points.map(p=>el(p,h));pu(d,f,t)&&a.push({firstFaceId:c.face.id,secondFaceId:u.face.id})}return a}function hu(n,e){const t=[];let i=e.boundary;const s=new Set;for(;!s.has(i);){s.add(i);const r=n.halfEdges.find(o=>o.id===i);if(!r)break;const a=n.vertices.find(o=>o.id===r.origin);if(!a)break;t.push([a.position[0],a.position[1],0]),i=r.next}return t}function jo(n,e){return[n,e].sort().join("::")}function fu(n){const e=n.map(Math.abs);return e[0]>=e[1]&&e[0]>=e[2]?0:e[1]>=e[2]?1:2}function el(n,e){return e===0?[n[1],n[2]]:e===1?[n[0],n[2]]:[n[0],n[1]]}function pu(n,e,t){const i=tl(n),s=tl(e);if(Math.min(i.maxX,s.maxX)-Math.max(i.minX,s.minX)>t&&Math.min(i.maxY,s.maxY)-Math.max(i.minY,s.minY)>t||n.some(a=>ys(a,e,t))||e.some(a=>ys(a,n,t)))return!0;const r=a=>[a.reduce((o,l)=>o+l[0],0)/a.length,a.reduce((o,l)=>o+l[1],0)/a.length];if(ys(r(n),e,t)||ys(r(e),n,t))return!0;for(let a=0;a<n.length;a+=1){const o=n[a],l=n[(a+1)%n.length];for(let c=0;c<e.length;c+=1){const u=e[c],h=e[(c+1)%e.length];if(mu(o,l,u,h,t))return!0}}return!1}function tl(n){return{minX:Math.min(...n.map(e=>e[0])),maxX:Math.max(...n.map(e=>e[0])),minY:Math.min(...n.map(e=>e[1])),maxY:Math.max(...n.map(e=>e[1]))}}function ys(n,e,t){let i=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const a=e[s],o=e[r];if(Math.abs(es(qt(o,a),qt(n,a)))<=t&&gu(qt(n,a),qt(n,o))<=t)return!1;a[1]>n[1]!=o[1]>n[1]&&n[0]<(o[0]-a[0])*(n[1]-a[1])/(o[1]-a[1])+a[0]&&(i=!i)}return i}function mu(n,e,t,i,s){const r=es(qt(e,n),qt(t,n)),a=es(qt(e,n),qt(i,n)),o=es(qt(i,t),qt(n,t)),l=es(qt(i,t),qt(e,t));return(r>s&&a<-s||r<-s&&a>s)&&(o>s&&l<-s||o<-s&&l>s)}function qt(n,e){return[n[0]-e[0],n[1]-e[1]]}function es(n,e){return n[0]*e[1]-n[1]*e[0]}function gu(n,e){return n[0]*e[0]+n[1]*e[1]}function Hn(){return{rotation:[[1,0,0],[0,1,0],[0,0,1]],translation:[0,0,0]}}function _u(n,e,t=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY){if(e.length<2)return xu("A folding map requires at least two ordered samples.");const s=n.faces.map(c=>c.id);let r=!0,a=!0,o=0,l=0;for(const c of e){const u=new Map(c.facePoses.map(h=>[h.faceId,h.transform]));for(const h of s){const d=u.get(h);(!d||!vo(d))&&(r=!1)}}for(let c=1;c<e.length;c+=1){const u=new Map(e[c-1].facePoses.map(v=>[v.faceId,v.transform])),h=new Map(e[c].facePoses.map(v=>[v.faceId,v.transform])),d=e[c-1].parameterValues.find(v=>v.parameterId==="deployment")?.value,f=e[c].parameterValues.find(v=>v.parameterId==="deployment")?.value,p=f!==void 0&&d!==void 0?Math.abs(f-d):0;for(const v of n.faces){const m=u.get(v.id),g=h.get(v.id);if(!m||!g){a=!1;continue}let E=v.boundary;const b=new Set;for(;!b.has(E);){b.add(E);const M=n.halfEdges.find(T=>T.id===E),A=M?n.vertices.find(T=>T.id===M.origin):void 0;if(A){const T=[A.position[0],A.position[1],0];o=Math.max(o,ls(Gn(Ct(g,T),Ct(m,T)))),p>0&&(l=Math.max(l,o/p))}if(!M)break;E=M.next}}}return a=a&&(!Number.isFinite(t)||o<=t),{applicable:!0,continuous:a,rigid:r,sampleCount:e.length,uniformDisplacementResidual:o,maximumDisplacementRate:l,rateBounded:!Number.isFinite(i)||l<=i}}function xu(n){return{applicable:!1,continuous:!1,rigid:!1,sampleCount:0,uniformDisplacementResidual:Number.POSITIVE_INFINITY,maximumDisplacementRate:Number.POSITIVE_INFINITY,rateBounded:!1,reason:n}}function vu(n,e=Di.relativeRank){if(!Number.isFinite(e)||e<0)throw new RangeError("Rank tolerance must be finite and non-negative.");if(n.length===0)return{rank:0,threshold:0,acceptedPivots:[],rejectedMaximum:0};const t=n[0].length;if(n.some(c=>c.length!==t||c.some(u=>!Number.isFinite(u))))throw new RangeError("Rank matrix must be finite and rectangular.");const i=n.map(c=>[...c]),r=Math.max(0,...i.flat().map(c=>Math.abs(c)))*Math.max(n.length,t)*e,a=[];let o=0,l=0;for(let c=0;c<t&&l<i.length;c+=1){let u=l,h=Math.abs(i[u][c]);for(let f=l+1;f<i.length;f+=1){const p=Math.abs(i[f][c]);p>h&&(h=p,u=f)}if(h<=r){o=Math.max(o,h);continue}[i[l],i[u]]=[i[u],i[l]];const d=i[l][c];a.push(Math.abs(d));for(let f=c;f<t;f+=1)i[l][f]/=d;for(let f=0;f<i.length;f+=1){if(f===l)continue;const p=i[f][c];for(let v=c;v<t;v+=1)i[f][v]-=p*i[l][v]}l+=1}return{rank:l,threshold:r,acceptedPivots:a,rejectedMaximum:o}}function Mu(n,e,t={}){if(!Number.isInteger(e)||e<0)throw new RangeError("Variable count must be a non-negative integer.");const i=vu(n,t.relativeTolerance??Di.relativeRank),s=t.expectedRank;if(s!==void 0&&(!Number.isInteger(s)||s<0||s>e))throw new RangeError("Expected rank must fit the variable count.");return{...i,variableCount:e,dof:e-i.rank,...s===void 0?{}:{expectedRank:s},singular:s!==void 0&&i.rank<s}}function Su(n,e,t=n.map(()=>0)){return Hc(n,e,t),n.reduce((i,s,r)=>{const a=Ni([0,0,0],[0,0,1],e[r]),o=Ni([0,0,0],[1,0,0],s),l={rotation:Hn().rotation,translation:[t[r],0,0]},c=Tn(a,Tn(l,o));return Tn(i,c)},Hn())}function nl(n,e,t){const i=Su(n,e,t),s=Hn(),r=[];for(let a=0;a<3;a+=1)for(let o=0;o<3;o+=1)r.push(i.rotation[o][a]-s.rotation[o][a]);return r.push(...i.translation),r}function yu(n,e,t,i=1e-6){if(!Number.isFinite(i)||i<=0)throw new RangeError("Finite-difference step must be positive and finite.");Hc(n,e,n.map(()=>0));const s=e.map((r,a)=>{const o=[...e],l=[...e];o[a]+=i,l[a]-=i;const c=nl(n,o,t),u=nl(n,l,t);return c.map((h,d)=>(h-u[d])/(2*i))});return Array.from({length:12},(r,a)=>s.map(o=>o[a]))}function Hc(n,e,t){if(n.length===0||n.length!==e.length||n.length!==t.length)throw new RangeError("Sector and fold-angle arrays must have equal nonzero length.");if(n.some(i=>!Number.isFinite(i)||i<=0)||e.some(i=>!Number.isFinite(i))||t.some(i=>!Number.isFinite(i)))throw new RangeError("Sector and fold angles must be finite.")}function Eu(n,e){const t=n.edges.filter(o=>o.kind==="hinge").map(o=>o.id).sort(),i=new Map(t.map((o,l)=>[o,l])),s=new Map(e?.hingeAngles.map(o=>[o.edgeId,o.angle])??[]),r=n.vertices.flatMap(o=>{const l=Dc(n,o.id);return l.applicability==="applicable"?[{vertexId:o.id,extraction:l}]:[]});if(r.length===0||t.length===0)return{applicable:!1,vertexCount:r.length,hingeCount:t.length,jacobian:[],reason:"No all-hinge interior vertex network is available."};const a=[];for(const{extraction:o}of r){const l=o.rays.map(u=>s.get(u.edgeId)??0),c=yu(o.sectorAngles,l);for(const u of c){const h=Array.from({length:t.length},()=>0);o.rays.forEach((d,f)=>{const p=i.get(d.edgeId);p!==void 0&&(h[p]+=u[f])}),a.push(h)}}return{applicable:!0,vertexCount:r.length,hingeCount:t.length,jacobian:a,mobility:Mu(a,t.length)}}function bu(n,e,t=Di.absoluteLength){if(e.length<2)return Au("A rigid-fold path requires at least two samples.");const i=n.faces.map(p=>p.id);let s=!0,r=!0,a=0,o=!0,l=0,c=!1;for(const p of e){const v=new Set(n.edges.filter(E=>E.kind==="hinge").map(E=>E.id)),m=new Set;for(const E of p.hingeAngles){const b=n.edges.find(P=>P.id===E.edgeId),M=b?.hinge?.angleRange,A=b?.hinge?.assignment,T=A==="mountain"?E.angle<=0:A==="valley"?E.angle>=0:!1;(m.has(E.edgeId)||!v.has(E.edgeId)||!Number.isFinite(E.angle)||!M||E.angle<M[0]||E.angle>M[1]||!T)&&(o=!1),m.add(E.edgeId)}const g=new Map(p.facePoses.map(E=>[E.faceId,E.transform]));for(const E of i){const b=g.get(E);(!b||!vo(b))&&(s=!1),b&&(l=Math.max(l,Ru(b.rotation)))}for(const E of n.edges.filter(b=>b.kind==="hinge")){if(E.halfEdges.length!==2){r=!1;continue}const b=E.halfEdges.map(P=>n.halfEdges.find(_=>_.id===P)).filter(P=>P!==void 0);if(b.length!==2){r=!1;continue}const M=g.get(b[0].face),A=g.get(b[1].face);if(!M||!A){r=!1;continue}const T=[b[0].origin,Tu(n,b[0])];for(const P of T){const _=n.vertices.find(R=>R.id===P);if(!_){r=!1;continue}const S=[_.position[0],_.position[1],0],C=ls(Gn(Ct(M,S),Ct(A,S)));a=Math.max(a,C)}}}const u=e.map(p=>p.parameterValues.find(v=>v.parameterId==="deployment")?.value),h=u.every((p,v)=>v===0||p!==void 0&&u[v-1]!==void 0&&p>=u[v-1]),d=wu(n),f=Eu(n,e[e.length-1]);for(let p=1;p<e.length;p+=1)JSON.stringify(e[p-1].facePoses)!==JSON.stringify(e[p].facePoses)&&(c=!0);return{applicable:!0,rigid:s,hingesCompatible:r&&a<=t,monotone:h,hingeStateValid:o,matrixCompatible:s&&l<=t,nontrivialMotion:c,maximumMatrixResidual:l,hingeGraphAcyclic:d,matrixCertificate:!s||!r||a>t?"invalid":d?"tree-exact":"cycle-closed",networkMobilityApplicable:f.applicable,...f.mobility?{networkDegreesOfFreedom:f.mobility.dof}:{},sampleCount:e.length,maximumHingeResidual:a}}function Tu(n,e){return n.halfEdges.find(t=>t.id===e.next)?.origin??""}function Au(n){return{applicable:!1,rigid:!1,hingesCompatible:!1,monotone:!1,hingeStateValid:!1,matrixCompatible:!1,nontrivialMotion:!1,maximumMatrixResidual:Number.POSITIVE_INFINITY,hingeGraphAcyclic:!1,matrixCertificate:"invalid",networkMobilityApplicable:!1,sampleCount:0,maximumHingeResidual:Number.POSITIVE_INFINITY,reason:n}}function wu(n){const e=new Map;for(const s of n.edges.filter(r=>r.kind==="hinge"&&r.halfEdges.length===2)){const r=s.halfEdges.map(a=>n.halfEdges.find(o=>o.id===a)?.face).filter(a=>a!==void 0);r.length===2&&(e.set(r[0],[...e.get(r[0])??[],r[1]]),e.set(r[1],[...e.get(r[1])??[],r[0]]))}const t=new Set,i=(s,r)=>{if(t.has(s))return!1;t.add(s);for(const a of e.get(s)??[])if(a!==r&&(t.has(a)||!i(a,s)))return!1;return!0};return[...e.keys()].every(s=>t.has(s)||i(s))}function Ru(n){let e=0;for(let t=0;t<3;t+=1)for(let i=0;i<3;i+=1){let s=0;for(let r=0;r<3;r+=1)s+=n[r][t]*n[r][i];e=Math.max(e,Math.abs(s-(t===i?1:0)))}return e}function Wc(n,e,t=1e-9,i=Number.POSITIVE_INFINITY){if(e.length<2)return Cu("A configuration-space path requires at least two states.");const s=e.map(p=>p.parameterValues.find(v=>v.parameterId==="deployment")?.value),r=s.every(p=>p!==void 0&&Number.isFinite(p)),a=r&&s.every(p=>p>=-t&&p<=1+t),o=r&&s.every((p,v)=>v===0||p>=s[v-1]-t),l=r&&Math.abs(s[0]-0)<=t&&Math.abs(s[s.length-1]-1)<=t,c=r&&s.every((p,v)=>v===0||Math.abs(p-s[v-1])>t),u=r?Math.max(...s.slice(1).map((p,v)=>p-s[v])):Number.POSITIVE_INFINITY,h=!Number.isFinite(i)||u<=i+t,d=new Set(n.faces.map(p=>p.id)),f=e.every(p=>{const v=new Set(p.facePoses.map(m=>m.faceId));return v.size===d.size&&[...d].every(m=>v.has(m))});return{applicable:!0,ordered:o,coversEndpoints:l,uniqueParameters:c,withinDomain:a,maximumParameterStep:u,stepBounded:h,topologyStable:f,sampleCount:e.length}}function Cu(n){return{applicable:!1,ordered:!1,coversEndpoints:!1,uniqueParameters:!1,withinDomain:!1,maximumParameterStep:Number.POSITIVE_INFINITY,stepBounded:!1,topologyStable:!1,sampleCount:0,reason:n}}function Pu(n,e,t=1e-8){const i=n.edges.filter(a=>a.kind==="hinge"||a.kind==="cutBank"||a.kind==="boundary").map(a=>a.id),s=n.edges.filter(a=>a.kind==="joined"||a.kind==="flatSeam").map(a=>a.id),r=new Set;for(const a of n.edges.filter(o=>o.kind==="joined"||o.kind==="flatSeam")){if(a.halfEdges.length!==2){r.add(a.id);continue}const o=a.halfEdges.map(l=>n.halfEdges.find(c=>c.id===l)?.face);if(!o[0]||!o[1]){r.add(a.id);continue}for(const l of e){const c=l.facePoses.find(h=>h.faceId===o[0])?.transform,u=l.facePoses.find(h=>h.faceId===o[1])?.transform;(!c||!u||Iu(c,u)>t)&&r.add(a.id)}}return{controlled:r.size===0,declaredSingularEdgeIds:i,invalidSingularEdgeIds:[...r],smoothEdgeIds:s}}function Iu(n,e){let t=Math.max(...n.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)t=Math.max(t,Math.abs(n.rotation[i][s]-e.rotation[i][s]));return t}function Lu(n,e,t=1e-8){if(e.length<2)return Du("Isometric recovery requires flat and deployed samples.");const i=new Map(e[0].facePoses.map(u=>[u.faceId,u.transform])),s=new Map(e[e.length-1].facePoses.map(u=>[u.faceId,u.transform]));let r=0,a=!0,o=!0;for(const u of n.faces){const h=$c(n,u.boundary),d=i.get(u.id),f=s.get(u.id);if(!d||!f){a=!1,o=!1;continue}for(const[v,m]of h){const g=n.vertices.find(T=>T.id===v),E=n.vertices.find(T=>T.id===m);if(!g||!E){a=!1;continue}const b=[g.position[0],g.position[1],0],M=[E.position[0],E.position[1],0],A=ls(Gn(M,b));for(const T of e){const P=T.facePoses.find(R=>R.faceId===u.id)?.transform;if(!P){a=!1;continue}const _=Ct(P,b),S=Ct(P,M),C=ls(Gn(S,_));r=Math.max(r,Math.abs(A-C))}}const p=d.rotation.every((v,m)=>v.every((g,E)=>Math.abs(g-(m===E?1:0))<=t))&&Math.abs(d.translation[0])<=t&&Math.abs(d.translation[1])<=t&&Math.abs(d.translation[2])<=t;o=o&&p}a=a&&r<=t;const l=n.faces.filter(u=>Nu(n,u.boundary)<=t).map(u=>u.id),c=Pu(n,e,t);return{applicable:!0,piecewiseIsometric:a&&l.length===0&&c.controlled,recoversFlatPattern:o,maximumEdgeResidual:r,singularFaceIds:l,controlledSingularSet:c.controlled,invalidSingularEdgeIds:c.invalidSingularEdgeIds}}function $c(n,e){const t=[];let i=e;const s=new Set;for(;!s.has(i);){s.add(i);const r=n.halfEdges.find(o=>o.id===i);if(!r)break;const a=n.halfEdges.find(o=>o.id===r.next);if(!a)break;t.push([r.origin,a.origin]),i=r.next}return t}function Du(n){return{applicable:!1,piecewiseIsometric:!1,recoversFlatPattern:!1,maximumEdgeResidual:Number.POSITIVE_INFINITY,singularFaceIds:[],controlledSingularSet:!1,invalidSingularEdgeIds:[],reason:n}}function Nu(n,e){const t=$c(n,e).map(([s])=>n.vertices.find(r=>r.id===s)?.position).filter(s=>s!==void 0);let i=0;for(let s=0;s<t.length;s+=1){const r=t[s],a=t[(s+1)%t.length];i+=r[0]*a[1]-a[0]*r[1]}return Math.abs(i)/2}function Uu(n,e,t,i=1e-6){if(!Number.isFinite(t)||t<=0||!Number.isFinite(i)||i<=0)return il(t,i,"Lipschitz bound and epsilon must be positive and finite.");const s=new Set(n.faces.map(o=>o.id));for(const o of[0,.5,1]){const l=e(o),c=new Map(l.facePoses.map(u=>[u.faceId,u.transform]));if(c.size!==s.size||[...s].some(u=>!c.has(u))||[...c.values()].some(u=>!vo(u)))return il(t,i,"Analytic path witnesses do not preserve the complete rigid face set.")}const r=Math.max(1,Math.ceil(t/i)),a=t/r;return{certified:a<=i,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!0,uniformlyConvergent:!0,lipschitzBound:t,epsilon:i,requiredSubdivisionCount:r,certifiedUniformErrorBound:a}}function il(n,e,t){return{certified:!1,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!1,uniformlyConvergent:!1,lipschitzBound:n,epsilon:e,requiredSubdivisionCount:0,certifiedUniformErrorBound:Number.POSITIVE_INFINITY,reason:t}}function Fu(n,e,t){const i=Sr(n).length===0,s=Fc(n),r=n.faces.reduce((c,u)=>c+u.holes.length,0),a=n.faces.every(c=>c.holes.every(u=>n.halfEdges.some(h=>h.id===u&&h.face===c.id))),o=t.applicable&&t.rigid&&t.hingesCompatible&&t.matrixCompatible,l=i&&s.necessaryGatesSatisfied&&s.materialConnected&&a&&o&&e.certified&&e.continuous&&e.uniformlyConvergent;return{certified:l,proof:l?"analytic-global-map":"unsupported",topologyValid:i,necessaryGatesSatisfied:s.necessaryGatesSatisfied,materialConnected:s.materialConnected,holesTracked:a,holeBoundaryCount:r,hingeContinuous:o,analyticContinuous:e.continuous,...l?{}:{reason:"A global certificate requires valid connected topology, all Chapter 5–6 gates, continuous hinges, tracked holes, and an analytic convergent map."}}}function Ou(n,e,t,i,s,r=1e-8){const a=Wc(n,e),o=[],l=[];for(const d of n.edges.filter(f=>f.kind==="hinge"&&f.halfEdges.length===2)){const f=d.halfEdges.map(v=>n.halfEdges.find(m=>m.id===v)?.face);(e.some(v=>{const m=v.facePoses.find(E=>E.faceId===f[0])?.transform,g=v.facePoses.find(E=>E.faceId===f[1])?.transform;return!m||!g||Bu(m,g)>r})?o:l).push(d.id)}const u=a.applicable&&a.ordered&&a.coversEndpoints&&a.uniqueParameters&&a.withinDomain&&a.stepBounded&&a.topologyStable&&t.certified&&t.continuous&&t.uniformlyConvergent&&i.applicable&&i.rigid&&i.hingesCompatible&&i.matrixCompatible&&s.certified,h=u&&i.nontrivialMotion&&o.length>0;return{certified:u,proof:u?"analytic-configuration-path":"unsupported",selfFoldable:h,activeCreaseIds:o,optionalCreaseIds:l,path:a,...u?{}:{reason:"Configuration certification requires an ordered complete analytic path with rigid/global certificates."}}}function Bu(n,e){let t=Math.max(...n.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)t=Math.max(t,Math.abs(n.rotation[i][s]-e.rotation[i][s]));return t}function Xc(n){if(!Number.isInteger(n.sampleCount)||n.sampleCount<2||n.sampleCount>1001)return{ok:!1,diagnostics:[on("Path sample count must be an integer in [2, 1001].",n.input.operationId)]};const e=[...n.complex.edges].filter(v=>v.kind==="hinge"),t=[],i=8,s=(n.sampleCount-1)*i+1;for(let v=0;v<s;v+=1){const m=v/(s-1),g=sl(n.input,n.complex,n.sourceMap,m);if(!g)return{ok:!1,diagnostics:[on("Stair hinge chain is missing or disconnected.",n.input.operationId)]};const E={id:`${n.input.operationId}:path:${v}`,facePoses:[...g.entries()].map(([M,A])=>({faceId:M,transform:A}))},b=uu(n.complex,E);if(b.length>0)return{ok:!1,diagnostics:[on(`Stair deployment sample ${v} has non-adjacent face overlap: ${b.map(M=>`${M.firstFaceId}:${M.secondFaceId}`).join(", ")}.`,n.input.operationId,v,m)]};v%i===0&&t.push({parameter:m,transforms:g})}const r=_u(n.complex,t.map(v=>({schemaVersion:1,id:`${n.input.operationId}:folding-map:${v.parameter}`,parameterValues:[{parameterId:"deployment",value:v.parameter}],facePoses:[...v.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!r.applicable||!r.rigid||!r.continuous)return{ok:!1,diagnostics:[on(r.reason??"Stair folding map failed topology, rigidity, or continuity validation.",n.input.operationId)]};const a=bu(n.complex,t.map(v=>({schemaVersion:1,id:`${n.input.operationId}:rigid:${v.parameter}`,parameterValues:[{parameterId:"deployment",value:v.parameter}],facePoses:[...v.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!a.applicable||!a.rigid||!a.hingesCompatible||!a.monotone||!a.hingeStateValid||!a.matrixCompatible)return{ok:!1,diagnostics:[on(a.reason??"Stair path failed rigid-foldability compatibility checks.",n.input.operationId)]};const o=Wc(n.complex,t.map(v=>({schemaVersion:1,id:`${n.input.operationId}:configuration:${v.parameter}`,parameterValues:[{parameterId:"deployment",value:v.parameter}],facePoses:[...v.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),1e-9,1/(n.sampleCount-1));if(!o.applicable||!o.ordered||!o.coversEndpoints||!o.uniqueParameters||!o.withinDomain||!o.stepBounded||!o.topologyStable)return{ok:!1,diagnostics:[on(o.reason??"Stair path failed configuration-space checks.",n.input.operationId)]};const l=Lu(n.complex,t.map(v=>({schemaVersion:1,id:`${n.input.operationId}:isometric:${v.parameter}`,parameterValues:[{parameterId:"deployment",value:v.parameter}],facePoses:[...v.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!l.applicable||!l.piecewiseIsometric||!l.recoversFlatPattern)return{ok:!1,diagnostics:[on(l.reason??"Stair path failed piecewise-isometric recovery checks.",n.input.operationId)]};const c=Math.hypot(n.input.width,n.input.stepCount*n.input.stepRun),u=Math.max(1,e.length*Math.PI/2*c),h=Uu(n.complex,v=>{const m=sl(n.input,n.complex,n.sourceMap,v);if(!m)throw new Error("Validated stair hinge chain became unavailable.");return{schemaVersion:1,id:`${n.input.operationId}:analytic:${v}`,parameterValues:[{parameterId:"deployment",value:v}],facePoses:[...m.entries()].map(([g,E])=>({faceId:g,transform:E})),hingeAngles:[]}},u);if(!h.certified)return{ok:!1,diagnostics:[on(h.reason??"Stair path failed analytic folding-map certification.",n.input.operationId)]};const d=Fu(n.complex,h,a);if(!d.certified||d.proof!=="analytic-global-map")return{ok:!1,diagnostics:[on(d.reason??"Stair path failed global folding-map certification.",n.input.operationId)]};const f=t.map(v=>({schemaVersion:1,id:`${n.input.operationId}:configuration-certificate:${v.parameter}`,parameterValues:[{parameterId:"deployment",value:v.parameter}],facePoses:[...v.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),p=Ou(n.complex,f,h,a,d);return!p.certified||!p.selfFoldable||p.proof!=="analytic-configuration-path"?{ok:!1,diagnostics:[on(p.reason??"Stair path failed configuration-space certification.",n.input.operationId)]}:{ok:!0,samples:t,evidence:{classification:"certifiedRigidPath",foldingMap:{continuous:r.continuous,rigid:r.rigid,sampleCount:r.sampleCount,maximumDisplacement:r.uniformDisplacementResidual},rigidFoldability:{rigid:a.rigid,hingesCompatible:a.hingesCompatible,monotone:a.monotone,maximumHingeResidual:a.maximumHingeResidual,matrixCompatible:a.matrixCompatible,nontrivialMotion:a.nontrivialMotion,maximumMatrixResidual:a.maximumMatrixResidual},configurationSpace:{ordered:o.ordered,coversEndpoints:o.coversEndpoints,uniqueParameters:o.uniqueParameters,withinDomain:o.withinDomain,maximumParameterStep:o.maximumParameterStep,stepBounded:o.stepBounded,topologyStable:o.topologyStable},isometricRecovery:{piecewiseIsometric:l.piecewiseIsometric,recoversFlatPattern:l.recoversFlatPattern,maximumEdgeResidual:l.maximumEdgeResidual,controlledSingularSet:l.controlledSingularSet,invalidSingularEdgeIds:l.invalidSingularEdgeIds},analyticFoldingMap:{proof:h.proof,continuous:h.continuous,uniformlyConvergent:h.uniformlyConvergent,lipschitzBound:h.lipschitzBound,requiredSubdivisionCount:h.requiredSubdivisionCount,certifiedUniformErrorBound:h.certifiedUniformErrorBound},globalFoldingMap:{proof:d.proof,topologyValid:d.topologyValid,necessaryGatesSatisfied:d.necessaryGatesSatisfied,materialConnected:d.materialConnected,holesTracked:d.holesTracked,hingeContinuous:d.hingeContinuous},configurationCertificate:{proof:p.proof,selfFoldable:p.selfFoldable,activeCreaseIds:p.activeCreaseIds,optionalCreaseIds:p.optionalCreaseIds},verification:{method:"adaptive-sampled",sampleCount:s,maxParameterStep:1/i,collisionCheck:"coplanar-positive-area"}}}}function sl(n,e,t,i){const s=new Map,r=new Map(e.vertices.map(d=>[d.id,d])),a=n.stepCount*2+2,o=a/2,l=r.get(`v:${o}:0`)?.position[1];if(l===void 0)return;const c=-1,u=Ni([0,l,0],[n.hostWidth,0,0],c*-i*Math.PI/2);for(const d of t.faces.filter(f=>f.faceId.startsWith("host-face:"))){const f=/^host-face:(\d+):(\d+)$/.exec(d.faceId);if(!f)return;const p=Number(f[1]);s.set(d.faceId,p<o?Hn():u)}let h=Hn();for(let d=0;d<a;d+=1){if(s.set(`stair-face:${d}`,h),d>=a-1)continue;const f=e.edges.find(T=>T.id===`hinge:${d}`);if(!f||f.halfEdges.length!==2)return;const p=r.get(`v:${d+1}:1`)?.position,v=r.get(`v:${d+1}:2`)?.position;if(!p||!v)return;const m=[p[0],p[1],0],g=[v[0],v[1],0],E=Ct(h,m),b=Ct(h,g),M=[b[0]-E[0],b[1]-E[1],b[2]-E[2]],A=f.hinge?.assignment==="mountain"?-1:1;h=Tn(Ni(E,M,c*A*i*Math.PI/2),h)}if(s.size===e.faces.length)return s}function on(n,e,t,i){return{severity:"error",category:"path",code:t===void 0?"PATH_POPUP_SAMPLE_COUNT_INVALID":"PATH_COLLISION_DETECTED",message:n,locations:t===void 0?[{kind:"entity",entity:{kind:"spatialOperation",id:e}}]:[{kind:"sample",index:t,parameter:i},{kind:"entity",entity:{kind:"spatialOperation",id:e}}],entities:[{kind:"spatialOperation",id:e}]}}const ku=1,Vu="hinge-flat",zu="Flat canonical hinge",Gu="boundary",Hu="single-hinge",Wu="meter-radian",$u=["Ideal zero-thickness rigid faces"],Xu="docs/single-hinge-specification.md",Yu=1e-12,qu="singleHinge",Zu={assignment:"valley",angle:0},Ku={ok:!0,childPoint:[2,0,0],classification:"certifiedRigidPath"},Ju={schemaVersion:ku,id:Vu,title:zu,fixtureClass:Gu,mechanismFamily:Hu,units:Wu,assumptions:$u,provenance:Xu,tolerance:Yu,kind:qu,input:Zu,expected:Ku},Qu=1,ju="hinge-intermediate",eh="Intermediate canonical hinge",th="valid",nh="single-hinge",ih="meter-radian",sh=["Ideal zero-thickness rigid faces"],rh="docs/single-hinge-specification.md",ah=1e-12,oh="singleHinge",lh={assignment:"valley",angle:1.0471975511965976},ch={ok:!0,childPoint:[1.5,0,-.8660254037844386],classification:"certifiedRigidPath"},dh={schemaVersion:Qu,id:ju,title:eh,fixtureClass:th,mechanismFamily:nh,units:ih,assumptions:sh,provenance:rh,tolerance:ah,kind:oh,input:lh,expected:ch},uh=1,hh="hinge-folded",fh="Quarter-turn canonical hinge",ph="valid",mh="single-hinge",gh="meter-radian",_h=["Ideal zero-thickness rigid faces"],xh="docs/single-hinge-specification.md",vh=1e-12,Mh="singleHinge",Sh={assignment:"valley",angle:1.5707963267948966},yh={ok:!0,childPoint:[1,0,-1],classification:"certifiedRigidPath"},Eh={schemaVersion:uh,id:hh,title:fh,fixtureClass:ph,mechanismFamily:mh,units:gh,assumptions:_h,provenance:xh,tolerance:vh,kind:Mh,input:Sh,expected:yh},bh=1,Th="hinge-assignment-invalid",Ah="Valley hinge rejects a negative angle",wh="invalid",Rh="single-hinge",Ch="meter-radian",Ph=["Positive angles are valley folds"],Ih="docs/single-hinge-specification.md",Lh=1e-12,Dh="singleHinge",Nh={assignment:"valley",angle:-.5},Uh={ok:!1,diagnosticCodes:["KINEMATICS_ANGLE_OUT_OF_RANGE","KINEMATICS_ASSIGNMENT_MISMATCH"]},Fh={schemaVersion:bh,id:Th,title:Ah,fixtureClass:wh,mechanismFamily:Rh,units:Ch,assumptions:Ph,provenance:Ih,tolerance:Lh,kind:Dh,input:Nh,expected:Uh},Oh=1,Bh="vertex-valid-3m1v",kh="Four-crease vertex satisfying Kawasaki and Maekawa",Vh="valid",zh="single-vertex",Gh="meter-radian",Hh=["Interior crease-only vertex"],Wh="docs/mathematical-contract.md#37-local-flat-foldability",$h=1e-12,Xh="singleVertex",Yh={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","mountain","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},qh={kawasaki:"satisfied",maekawa:"satisfied",locallyFlatFoldable:!0},Zh={schemaVersion:Oh,id:Bh,title:kh,fixtureClass:Vh,mechanismFamily:zh,units:Gh,assumptions:Hh,provenance:Wh,tolerance:$h,kind:Xh,input:Yh,expected:qh},Kh=1,Jh="vertex-invalid-2m2v",Qh="Four-crease vertex failing Maekawa",jh="invalid",ef="single-vertex",tf="meter-radian",nf=["Interior crease-only vertex"],sf="docs/mathematical-contract.md#37-local-flat-foldability",rf=1e-12,af="singleVertex",of={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","valley","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},lf={kawasaki:"satisfied",maekawa:"failed",locallyFlatFoldable:!1},cf={schemaVersion:Kh,id:Jh,title:Qh,fixtureClass:jh,mechanismFamily:ef,units:tf,assumptions:nf,provenance:sf,tolerance:rf,kind:af,input:of,expected:lf},df=1,uf="popup-symmetric",hf="Symmetric axis-aligned two-plane pop-up",ff="valid",pf="two-plane-pop-up",mf="meter-radian",gf=["Ideal zero-thickness rigid linkage"],_f="docs/mathematical-contract.md#4-two-plane-pop-up-family",xf=1e-10,vf="twoPlanePopUp",Mf={id:"popup-symmetric",width:2,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},Sf={ok:!0,deployedJunction:[0,1,1],axisAligned:!0,classification:"certifiedRigidPath"},yf={schemaVersion:df,id:uf,title:hf,fixtureClass:ff,mechanismFamily:pf,units:mf,assumptions:gf,provenance:_f,tolerance:xf,kind:vf,input:Mf,expected:Sf},Ef=1,bf="popup-unequal",Tf="Unequal-link rotated two-plane pop-up",Af="valid",wf="two-plane-pop-up",Rf="meter-radian",Cf=["Unequal links may rotate the child frame"],Pf="docs/mathematical-contract.md#4-two-plane-pop-up-family",If=1e-10,Lf="twoPlanePopUp",Df={id:"popup-unequal",width:2,height:1,depth:2,deployedAngle:1.5707963267948966,sampleCount:7},Nf={ok:!0,deployedJunction:[0,.8,1.6],axisAligned:!1,classification:"certifiedRigidPath"},Uf={schemaVersion:Ef,id:bf,title:Tf,fixtureClass:Af,mechanismFamily:wf,units:Rf,assumptions:Cf,provenance:Pf,tolerance:If,kind:Lf,input:Df,expected:Nf},Ff=1,Of="popup-invalid-width",Bf="Two-plane pop-up rejects zero width",kf="invalid",Vf="two-plane-pop-up",zf="meter-radian",Gf=["Mechanism dimensions must be positive"],Hf="docs/mathematical-contract.md#4-two-plane-pop-up-family",Wf=1e-10,$f="twoPlanePopUp",Xf={id:"popup-invalid-width",width:0,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},Yf={ok:!1,diagnosticCodes:["MECHANISM_POPUP_INVALID_PARAMETER"]},qf={schemaVersion:Ff,id:Of,title:Bf,fixtureClass:kf,mechanismFamily:Vf,units:zf,assumptions:Gf,provenance:Hf,tolerance:Wf,kind:$f,input:Xf,expected:Yf},Zf=1,Kf="spatial-root",Jf="One root plane pair",Qf="valid",jf="nested-parallel-strip",ep="meter-radian",tp=["Two-level synchronized strip family"],np="docs/mathematical-contract.md#5-composition-contract",ip=1e-10,sp="spatialProgram",rp={schemaVersion:1,id:"spatial-root",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},ap={ok:!0,classification:"certifiedRigidPath"},op={schemaVersion:Zf,id:Kf,title:Jf,fixtureClass:Qf,mechanismFamily:jf,units:ep,assumptions:tp,provenance:np,tolerance:ip,kind:sp,input:rp,expected:ap},lp=1,cp="spatial-nested-shelf",dp="Root plane pair with nested shelf",up="valid",hp="nested-parallel-strip",fp="meter-radian",pp=["Two-level synchronized strip family"],mp="docs/mathematical-contract.md#5-composition-contract",gp=1e-10,_p="spatialProgram",xp={schemaVersion:1,id:"spatial-nested-shelf",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:3,height:1.5,depth:1.5,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"shelf",kind:"shelf",target:{kind:"generatedPair",operationId:"root"},xOffset:.5,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},vp={ok:!0,classification:"certifiedRigidPath"},Mp={schemaVersion:lp,id:cp,title:dp,fixtureClass:up,mechanismFamily:hp,units:fp,assumptions:pp,provenance:mp,tolerance:gp,kind:_p,input:xp,expected:vp},Sp=1,yp="spatial-siblings",Ep="Disjoint sibling plane pairs",bp="valid",Tp="nested-parallel-strip",Ap="meter-radian",wp=["Sibling strip interiors are disjoint"],Rp="docs/mathematical-contract.md#5-composition-contract",Cp=1e-10,Pp="spatialProgram",Ip={schemaVersion:1,id:"spatial-siblings",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"left",kind:"wall",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"right",kind:"platform",target:{kind:"sheet"},xOffset:4,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Lp={ok:!0,classification:"certifiedRigidPath"},Dp={schemaVersion:Sp,id:yp,title:Ep,fixtureClass:bp,mechanismFamily:Tp,units:Ap,assumptions:wp,provenance:Rp,tolerance:Cp,kind:Pp,input:Ip,expected:Lp},Np=1,Up="spatial-overlap",Fp="Overlapping siblings are rejected",Op="invalid",Bp="nested-parallel-strip",kp="meter-radian",Vp=["Sibling strip interiors must be disjoint"],zp="docs/mathematical-contract.md#5-composition-contract",Gp=1e-10,Hp="spatialProgram",Wp={schemaVersion:1,id:"spatial-overlap",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"a",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"b",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},$p={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OVERLAP"]},Xp={schemaVersion:Np,id:Up,title:Fp,fixtureClass:Op,mechanismFamily:Bp,units:kp,assumptions:Vp,provenance:zp,tolerance:Gp,kind:Hp,input:Wp,expected:$p},Yp=1,qp="spatial-depth-three",Zp="Depth-three hierarchy is rejected",Kp="unsupported",Jp="nested-parallel-strip",Qp="meter-radian",jp=["Only root and child module levels are supported"],em="docs/mathematical-contract.md#5-composition-contract",tm=1e-10,nm="spatialProgram",im={schemaVersion:1,id:"spatial-depth-three",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:3,height:2,depth:2,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"child",kind:"planePair",target:{kind:"generatedPair",operationId:"root"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"grandchild",kind:"planePair",target:{kind:"generatedPair",operationId:"child"},xOffset:0,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},sm={ok:!1,diagnosticCodes:["SPATIAL_TARGET_DEPTH_UNSUPPORTED"]},rm={schemaVersion:Yp,id:qp,title:Zp,fixtureClass:Kp,mechanismFamily:Jp,units:Qp,assumptions:jp,provenance:em,tolerance:tm,kind:nm,input:im,expected:sm},am=1,om="spatial-opening",lm="Opening is explicitly unsupported",cm="unsupported",dm="bounded-spatial-compiler",um="meter-radian",hm=["Subtractive topology is not certified"],fm="docs/mathematical-contract.md#51-bounded-spatial-compilation",pm=1e-10,mm="spatialProgram",gm={schemaVersion:1,id:"spatial-opening",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"door",kind:"opening",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},_m={ok:!1,diagnosticCodes:["SPATIAL_OPERATION_UNSUPPORTED"]},xm={schemaVersion:am,id:om,title:lm,fixtureClass:cm,mechanismFamily:dm,units:um,assumptions:hm,provenance:fm,tolerance:pm,kind:mm,input:gm,expected:_m},vm=1,Mm="spatial-out-of-bounds",Sm="Attachment outside the sheet is rejected",ym="invalid",Em="nested-parallel-strip",bm="meter-radian",Tm=["Attachments must fit their host material"],Am="docs/mathematical-contract.md#5-composition-contract",wm=1e-10,Rm="spatialProgram",Cm={schemaVersion:1,id:"spatial-out-of-bounds",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"outside",kind:"planePair",target:{kind:"sheet"},xOffset:5,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Pm={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS"]},Im={schemaVersion:vm,id:Mm,title:Sm,fixtureClass:ym,mechanismFamily:Em,units:bm,assumptions:Tm,provenance:Am,tolerance:wm,kind:Rm,input:Cm,expected:Pm},Lm=1;function Yc(n){return Dm(n)?{ok:!0,example:n}:{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Validation examples require schema version 1, metadata, finite tolerance, typed input, and expected output.",locations:[{kind:"entity",entity:{kind:"validationExample",id:al(n)}}],entities:[{kind:"validationExample",id:al(n)}]}]}}function Dm(n){return ri(n)?n.schemaVersion===Lm&&jn(n.id)&&jn(n.title)&&["valid","boundary","invalid","unsupported"].includes(String(n.fixtureClass))&&["singleHinge","singleVertex","twoPlanePopUp","spatialProgram"].includes(String(n.kind))&&jn(n.mechanismFamily)&&n.units==="meter-radian"&&Array.isArray(n.assumptions)&&n.assumptions.every(jn)&&jn(n.provenance)&&Number.isFinite(n.tolerance)&&Number(n.tolerance)>=0&&ri(n.input)&&ri(n.expected)&&Nm(n):!1}function Nm(n){const e=n.input,t=n.expected;return!ri(e)||!ri(t)||typeof t.ok=="string"?!1:n.kind==="singleHinge"?["mountain","valley"].includes(String(e.assignment))&&Number.isFinite(e.angle)&&typeof t.ok=="boolean"&&rl(t.childPoint)&&Lr(t.diagnosticCodes):n.kind==="singleVertex"?Um(e.sectorAngles)&&Array.isArray(e.assignments)&&e.assignments.every(i=>["mountain","valley","unassigned"].includes(String(i)))&&e.sectorAngles.length===e.assignments.length&&ri(e.paper)&&Number.isFinite(e.paper.width)&&Number(e.paper.width)>0&&Number.isFinite(e.paper.height)&&Number(e.paper.height)>0&&Array.isArray(e.paper.center)&&e.paper.center.length===2&&e.paper.center.every(i=>Number.isFinite(i))&&["satisfied","failed"].includes(String(t.kawasaki))&&["satisfied","failed","notApplicable"].includes(String(t.maekawa))&&typeof t.locallyFlatFoldable=="boolean":n.kind==="twoPlanePopUp"?jn(e.id)&&[e.width,e.height,e.depth,e.deployedAngle].every(Number.isFinite)&&Number.isInteger(e.sampleCount)&&typeof t.ok=="boolean"&&rl(t.deployedJunction)&&Lr(t.diagnosticCodes):n.kind==="spatialProgram"&&typeof t.ok=="boolean"&&Lr(t.diagnosticCodes)}function Um(n){return Array.isArray(n)&&n.every(Number.isFinite)}function rl(n){return n===void 0||Array.isArray(n)&&n.length===3&&n.every(Number.isFinite)}function Lr(n){return n===void 0||Array.isArray(n)&&n.every(e=>typeof e=="string")}function ri(n){return n!==null&&typeof n=="object"&&!Array.isArray(n)}function jn(n){return typeof n=="string"&&n.length>0}function al(n){return ri(n)&&jn(n.id)?n.id:"unknown"}function gs(n,e,t=new Map,i){const s=new Map(n.vertices.map(p=>[p.id,p])),r=new Map(n.halfEdges.map(p=>[p.id,p])),a=p=>!0,o=new Map;for(const p of[...n.halfEdges].sort(Wi))a(p.face),o.has(p.origin)||o.set(p.origin,p.face);const l=(p,v)=>{const m=s.get(p)?.position,g=e.get(v);if(!m||!g)throw new RangeError(`Missing topology transform for ${p}/${v}.`);return Ct(g,[m[0],m[1],0])},c=n.edges.flatMap(p=>{const v=Om(p);if(v===void 0)return[];const m=[...p.halfEdges].map(E=>r.get(E)).filter(E=>a(E.face)).sort(Wi)[0];if(!m)return[];const g=r.get(m.next);return[{edge:p,halfEdge:m,next:g,role:v}]}),u=new Set(c.flatMap(({halfEdge:p,next:v})=>[p.origin,v.origin])),h=n.vertices.filter(p=>u.has(p.id)&&o.has(p.id)).map(p=>({id:p.id,position:l(p.id,o.get(p.id)),role:"vertex",sourceEntities:[{kind:"vertex",id:p.id}]})).sort(Wi),d=c.map(({edge:p,halfEdge:v,next:m,role:g})=>({id:p.id,start:l(v.origin,v.face),end:l(m.origin,v.face),role:g,sourceEntities:[{kind:"edge",id:p.id}]})).sort(Wi),f=n.faces.filter(p=>a(p.id)).map(p=>{const v=Fm(p.boundary,r),m=t.get(p.id),g=[{kind:"face",id:p.id},...m===void 0?[]:[{kind:"spatialOperation",id:m}]];return{id:p.id,vertices:v.map(E=>l(E.origin,p.id)),sourceEntities:g,...m===void 0?{}:{sourceOperationId:m}}}).sort(Wi);return{points:h,segments:d,faces:f}}function Fm(n,e){const t=[];let i=e.get(n);for(;i&&(t.length===0||i.id!==n);)t.push(i),i=e.get(i.next);return t}function Om(n){if(n.kind==="boundary")return"boundary";if(n.kind==="cutBank")return"cut";if(n.kind==="hinge")return n.hinge?.assignment==="mountain"?"hingeMountain":n.hinge?.assignment==="valley"?"hingeValley":"hingeUnassigned"}function Wi(n,e){return n.id.localeCompare(e.id)}const Bm=Object.assign({"../../examples/validation/01-hinge-flat.json":Ju,"../../examples/validation/02-hinge-intermediate.json":dh,"../../examples/validation/03-hinge-folded.json":Eh,"../../examples/validation/04-hinge-assignment-invalid.json":Fh,"../../examples/validation/05-vertex-valid.json":Zh,"../../examples/validation/06-vertex-maekawa-invalid.json":cf,"../../examples/validation/07-popup-symmetric.json":yf,"../../examples/validation/08-popup-unequal.json":Uf,"../../examples/validation/09-popup-invalid.json":qf,"../../examples/validation/10-spatial-root.json":op,"../../examples/validation/11-spatial-nested-shelf.json":Mp,"../../examples/validation/12-spatial-siblings.json":Dp,"../../examples/validation/13-spatial-overlap.json":Xp,"../../examples/validation/14-spatial-depth.json":rm,"../../examples/validation/15-spatial-opening.json":xm,"../../examples/validation/16-spatial-out-of-bounds.json":Im}),Dr=Object.entries(Bm).sort(([n],[e])=>n.localeCompare(e)).map(([n,e])=>{const t=Yc(e);if(!t.ok)throw new TypeError(`${n}: ${t.diagnostics.map(i=>i.message).join(" ")}`);return{filename:n.slice(n.lastIndexOf("/")+1),example:t.example}});function km(n=new Worker(new URL("/kirigami/assets/engine-worker-Dg1M99Gg.js",import.meta.url),{type:"module",name:"kirigami-engine-lab"})){let e=1,t=!1;const i=new Map,s=r=>{for(const a of i.values())a.reject(r);i.clear()};return n.onmessage=({data:r})=>{if(t||r===null||typeof r!="object"||!Number.isInteger(r.requestId))return;const a=i.get(r.requestId);a&&(i.delete(r.requestId),r.ok?a.resolve(r.subject):a.reject(new Error(r.message)))},n.onerror=r=>{s(new Error(r.message||"Engine worker failed."))},{evaluate(r){if(t)return Promise.reject(new Error("Engine Lab client is disposed."));const a=e;return e+=1,new Promise((o,l)=>{i.set(a,{resolve:o,reject:l}),n.postMessage({requestId:a,type:"evaluate",example:r})})},dispose(){t||(t=!0,s(new Error("Engine Lab client was disposed.")),n.onmessage=null,n.onerror=null,n.terminate())}}}function Vm(n){const e=[];return va(n.input,["input"],e),e.sort((t,i)=>Wm(t.path,i.path))}function zm(n,e,t){if(e[0]!=="input"||e.length<2||!Number.isFinite(t)||typeof $m(n,e)!="number")return Xm(n.id);const i=Ma(n,e,t);return Yc(i)}function va(n,e,t){if(typeof n=="number"){const i=String(e[e.length-1]);if(i==="schemaVersion"||i==="tolerance")return;t.push({path:e,label:Gm(e),value:n,step:i==="sampleCount"||i==="pathSampleCount"?1:i.toLowerCase().includes("angle")?.01:Math.max(Math.abs(n)*.05,.01)});return}if(Array.isArray(n)){n.forEach((i,s)=>va(i,[...e,s],t));return}if(!(n===null||typeof n!="object"))for(const i of Object.keys(n).sort())i==="schemaVersion"||i==="tolerance"||va(n[i],[...e,i],t)}function Gm(n){const e=n.slice(1).map(t=>typeof t=="number"?String(t+1):Hm(t));return e.slice(Math.max(e.length-3,0)).join(" · ")}function Hm(n){const e=n.replace(/([a-z0-9])([A-Z])/g,"$1 $2");return e[0]?.toUpperCase()+e.slice(1)}function Wm(n,e){const t=Math.max(n.length,e.length);for(let i=0;i<t;i+=1){const s=n[i],r=e[i];if(s===void 0)return-1;if(r===void 0)return 1;if(s!==r)return typeof s=="number"&&typeof r=="number"?s-r:String(s).localeCompare(String(r))}return 0}function $m(n,e){let t=n;for(const i of e){if(t===null||typeof t!="object")return;t=t[i]}return t}function Ma(n,e,t){if(e.length===0)return t;const[i,...s]=e;if(Array.isArray(n)){const a=[...n];return a[Number(i)]=Ma(a[Number(i)],s,t),a}const r=n;return{...r,[i]:Ma(r[i],s,t)}}function Xm(n){return{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Engine Lab parameter edits require a finite numeric input value.",locations:[{kind:"entity",entity:{kind:"validationExample",id:n}}],entities:[{kind:"validationExample",id:n}]}]}}function Ym(n,e,t,i={}){if(!e){n.innerHTML=t?`<div class="inspector-empty inspector-error">${kt(t)}</div>`:'<div class="inspector-empty">Select an example to inspect engine evidence.</div>';return}const{result:s}=e,r=Vm(e.example),a=s.observed.disposition!=="accepted";n.innerHTML=`
    ${t===void 0?"":`<div class="inspector-error-banner" role="alert">${kt(t)}</div>`}
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
          <dd>${kt(s.observed.classification??"not produced")}</dd>
        </div>
      </dl>
    </section>
    <section class="inspection-section">
      <h2>Diagnostics <span>${s.diagnostics.length}</span></h2>
      ${s.diagnostics.length===0?'<p class="quiet">No engine diagnostics.</p>':`<ul class="diagnostic-list">${s.diagnostics.map(o=>`
                  <li${a?` data-diagnostic-state="${o.category==="unsupported"?"unsupported":"invalid"}"`:""}>
                    <code>${kt(o.code)}</code>
                    <p>${kt(o.message)}</p>
                    <ul class="diagnostic-locations" aria-label="Diagnostic locations">
                      ${o.locations.map(l=>`<li>${kt(qm(l))}</li>`).join("")}
                    </ul>
                    <small>${kt(o.category)} · ${kt(o.severity)}</small>
                  </li>`).join("")}</ul>`}
    </section>
    <section class="inspection-section">
      <h2>Conformance checks <span>${s.checks.length}</span></h2>
      <div class="check-list">
        ${s.checks.map(o=>`
              <details ${o.passed?"":"open"}>
                <summary>
                  <span class="check-state" data-status="${o.passed?"passed":"failed"}"></span>
                  <code>${kt(o.id)}</code>
                </summary>
                <dl>
                  <div><dt>Method</dt><dd>${kt(o.method)}</dd></div>
                  <div><dt>Expected</dt><dd>${ol(o.expected)}</dd></div>
                  <div><dt>Actual</dt><dd>${ol(o.actual)}</dd></div>
                  ${o.residual===void 0?"":`<div><dt>Residual</dt><dd>${dr(o.residual)}</dd></div>`}
                  ${o.tolerance===void 0?"":`<div><dt>Tolerance</dt><dd>${dr(o.tolerance)}</dd></div>`}
                </dl>
              </details>`).join("")}
      </div>
    </section>
    <section class="inspection-section parameter-section" aria-label="Parameters">
      <h2>Parameters <span>${r.length}</span></h2>
      <div class="parameter-list">
        ${r.map(o=>`
              <label${ll(o.path,s.diagnostics,a)===void 0?"":` data-diagnostic-state="${ll(o.path,s.diagnostics,a)}"`}>
                <span>${kt(o.label)}</span>
                <input
                  type="number"
                  aria-label="${kt(o.label)}"
                  data-parameter-path="${kt(JSON.stringify(o.path))}"
                  value="${o.value}"
                  step="${o.step}"
                />
              </label>`).join("")}
      </div>
      ${r.length===0?'<p class="quiet">This example has no numeric input leaves.</p>':'<button class="parameter-reset" type="button">Reset parameters</button>'}
    </section>
  `,n.querySelectorAll("[data-parameter-path]").forEach(o=>{let l;o.addEventListener("input",()=>{l!==void 0&&window.clearTimeout(l);const c=JSON.parse(o.dataset.parameterPath??"[]");l=window.setTimeout(()=>{i.onParameterCommit?.(c,Number(o.value))},240)})}),n.querySelector(".parameter-reset")?.addEventListener("click",()=>i.onReset?.())}function ol(n){return typeof n=="number"?dr(n):kt(JSON.stringify(n)??String(n))}function qm(n){return n.kind==="entity"?`${n.entity.kind} · ${n.entity.id}`:n.kind==="parameter"?n.path.map(String).join(" · "):n.kind==="sample"?`sample ${n.index+1}${n.parameter===void 0?"":` · parameter ${dr(n.parameter)}`}`:`non-spatial · ${n.reason}`}function ll(n,e,t){if(!t)return;const i=e.filter(s=>s.locations.some(r=>r.kind==="parameter"&&Zm(n,r.path)));return i.some(s=>s.category!=="unsupported")?"invalid":i.some(s=>s.category==="unsupported")?"unsupported":void 0}function Zm(n,e){return n.length>=e.length&&e.every((t,i)=>n[i]===t)}function dr(n){return n===0?"0":Math.abs(n)>=1e3||Math.abs(n)<.001?n.toExponential(4):n.toPrecision(6)}function kt(n){return n.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function Km(n,e,t,i){const s=gs(n,i,new Map(e.faces.map(a=>[a.faceId,t.operationId]))),r=s.segments.map(a=>({...a,start:Kt(a.start),end:Kt(a.end)}));return{points:_s(r),segments:r,faces:s.faces.map(a=>({...a,vertices:a.vertices.map(Kt)}))}}function Jm(n,e,t){const i=gs(n,t,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:Kt(r.start),end:Kt(r.end)}));return{points:_s(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(Kt)}))}}function Qm(n,e,t){const i=gs(n,t,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:Nr(r.start),end:Nr(r.end)}));return{points:_s(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(Nr)}))}}function jm(n,e,t){const i=gs(n,t,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:Kt(r.start),end:Kt(r.end)}));return{points:_s(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(Kt)}))}}function eg(n,e){const t=gs(n.complex,e.transforms,new Map(n.sourceMap.integratedFaces.map(s=>[s.faceId,`${n.input.operationId}:${s.source}`]))),i=t.segments.map(s=>({...s,start:Kt(s.start),end:Kt(s.end)}));return{faces:t.faces.map(s=>({...s,vertices:s.vertices.map(Kt)})),segments:i,points:_s(i)}}function Kt([n,e,t]){return[n,t,-e]}function Nr([n,e,t]){return[n,-e,t]}function _s(n){const e=new Map;for(const t of n)cl(e,t.start,t.role,dl(t.end,t.start)),cl(e,t.end,t.role,dl(t.start,t.end));return[...e.entries()].filter(([,t])=>tg(t.entries)).sort(([t],[i])=>t.localeCompare(i)).map(([t,i])=>({id:`fabrication-corner:${t}`,position:i.position,role:"vertex",sourceEntities:[]}))}function cl(n,e,t,i){const s=e.map(a=>Math.round(a*1e9)).join(":"),r=n.get(s)??{position:e,entries:[]};r.entries.push({role:t,direction:i}),n.set(s,r)}function tg(n){const e=n.filter((r,a,o)=>o.findIndex(l=>l.role===r.role&&ng(l.direction,r.direction))===a);if(e.length!==2)return e.length>0;if(e[0].role!==e[1].role)return!0;const[t,i]=e.map(r=>r.direction),s=[t[1]*i[2]-t[2]*i[1],t[2]*i[0]-t[0]*i[2],t[0]*i[1]-t[1]*i[0]];return Math.hypot(...s)>1e-9}function ng(n,e){const t=Math.hypot(...n),i=Math.hypot(...e);return t<=1e-12||i<=1e-12?!1:(n[0]*e[0]+n[1]*e[1]+n[2]*e[2])/(t*i)>=1-1e-9}function dl(n,e){return[n[0]-e[0],n[1]-e[1],n[2]-e[2]]}function Mo(n){return qc(n,2)}function qc(n,e,t=!0){const i=ag(n,e,t);if(i)return{ok:!1,diagnostics:[i]};const s=n.stepCount*n.stepRun,r=(n.hostWidth-s)/2,a=Array.from({length:n.stepCount+1},(_,S)=>{const C=r+S*n.stepRun,R=S===0,I=S===n.stepCount,H=R||I?-n.width:(S-1)*n.stepRise-n.width,W=I?(n.stepCount-1)*n.stepRise:S*n.stepRise;return{cutPairId:`cut:long:${S}`,axis:"long",lineIndex:S,start:[C,H],end:[C,W]}}),o=Array.from({length:n.stepCount},(_,S)=>({edgeId:`hinge:inherited:${S}`,role:"inherited",stepIndex:S,start:[a[S].end[0],S*n.stepRise],end:[a[S+1].end[0],S*n.stepRise]})),l=Array.from({length:n.stepCount},(_,S)=>({edgeId:`hinge:explicit:${S}`,role:"explicit",stepIndex:S,start:[a[S].start[0],S*n.stepRise-n.width],end:[a[S+1].start[0],S*n.stepRise-n.width]})),c=hl([0,n.hostWidth,...a.map(_=>_.start[0])]),u=hl([-n.hostFloorExtent,n.hostWallExtent,0,...a.flatMap(_=>[_.start[1],_.end[1]]),...o.flatMap(_=>[_.start[1],_.end[1]]),...l.flatMap(_=>[_.start[1],_.end[1]])]),h=[],d=[],f=[],p=[],v=[],m=[],g=[];for(let _=0;_<u.length;_+=1)for(let S=0;S<c.length;S+=1)h.push({id:$i(S,_),position:[c[S],u[_]]});for(let _=0;_<u.length-1;_+=1)for(let S=0;S<c.length-1;S+=1){const C=`sheet-face:${_}:${S}`,R=["bottom","right","top","left"].map(k=>`he:${_}:${S}:${k}`);f.push({id:R[0],origin:$i(S,_),next:R[1],edge:"pending",face:C},{id:R[1],origin:$i(S+1,_),next:R[2],edge:"pending",face:C},{id:R[2],origin:$i(S+1,_+1),next:R[3],edge:"pending",face:C},{id:R[3],origin:$i(S,_+1),next:R[0],edge:"pending",face:C}),d.push({id:C,boundary:R[0],holes:[]});const I=[(c[S]+c[S+1])/2,(u[_]+u[_+1])/2],H=rg(I[0],r,n.stepRun,n.stepCount),W=H===void 0?void 0:sg(I,o,l),N=H===void 0?void 0:H*n.stepRise-n.width,Y=W!==void 0?"tread":H!==void 0&&I[1]>=-n.width&&I[1]<N?"carrier":I[1]<0?"base":"host";m.push({faceId:C,role:Y,...W===void 0?{}:{stepIndex:W}})}const E=new Map(f.map(_=>[_.id,_])),b=(_,S)=>{for(const C of _)E.get(C).edge=S.id;_.length===2&&(E.get(_[0]).twin=_[1],E.get(_[1]).twin=_[0]),p.push(S)};for(let _=0;_<u.length-1;_+=1)for(let S=0;S<c.length;S+=1){const C=S>0?`he:${_}:${S-1}:right`:void 0,R=S<c.length-1?`he:${_}:${S}:left`:void 0,I=[C,R].filter(ie=>ie!==void 0);if(I.length===1){const ie=[I[0]];b(ie,{id:`boundary:v:${_}:${S}`,halfEdges:ie,kind:"boundary"});continue}const H=[I[0],I[1]],W=c[S],N=u[_],Y=u[_+1],k=a.find(ie=>ni(ie.start[0],W)&&N>=ie.start[1]-1e-10&&Y<=ie.end[1]+1e-10);if(!k||k.lineIndex===0){b(H,{id:`seam:v:${_}:${S}`,halfEdges:H,kind:"flatSeam"});continue}const J=`${k.cutPairId}:segment:${_}`,te=["",""];for(let ie=0;ie<H.length;ie+=1){const ce=ie===0?"a":"b",fe=`${J}:${ce}`,De=[H[ie]];b(De,{id:fe,halfEdges:De,kind:"cutBank",cutBank:{pair:J,bank:ce}}),te[ie]=fe}v.push({id:J,banks:te})}for(let _=0;_<u.length;_+=1)for(let S=0;S<c.length-1;S+=1){const C=_>0?`he:${_-1}:${S}:top`:void 0,R=_<u.length-1?`he:${_}:${S}:bottom`:void 0,I=[C,R].filter(Oe=>Oe!==void 0);if(I.length===1){const Oe=[I[0]];b(Oe,{id:`boundary:h:${_}:${S}`,halfEdges:Oe,kind:"boundary"});continue}const H=[I[0],I[1]],W=[c[S],u[_]],N=[c[S+1],u[_]],Y=o.find(Oe=>fl(Oe.start,Oe.end,W,N)),k=l.find(Oe=>fl(Oe.start,Oe.end,W,N)),J=W[0]>=a[0].start[0]-1e-10&&N[0]<=a.at(-1).start[0]+1e-10,te=ni(u[_],-n.width)&&J,ie=ni(u[_],0)&&!J&&!Y&&!k;if(k?.stepIndex===0){b(H,{id:"seam:terminal:ground",halfEdges:H,kind:"flatSeam"});continue}if(!Y&&!k&&!ie&&!te){b(H,{id:`seam:h:${_}:${S}`,halfEdges:H,kind:"flatSeam"});continue}const fe=(Y??k)?.edgeId??(te?`hinge:carrier-base:${S}`:`hinge:parent:${S}`),De=k?"valley":"mountain";b(H,{id:fe,halfEdges:H,kind:"hinge",hinge:{assignment:De,restAngle:0,angleRange:De==="valley"?[0,Math.PI/2]:[-Math.PI/2,0]}})}const M=m.filter(_=>_.role==="tread"),A=Array.from({length:n.stepCount},(_,S)=>({stepIndex:S,treadFaceId:M.find(C=>C.stepIndex===S).faceId,hostConnected:!0,carrierConnected:!0}));for(let _=0;_<n.stepCount;_+=1)g.push({edgeId:o[_].edgeId,kind:"retained",stepIndex:_,side:"host"}),_>0&&g.push({edgeId:l[_].edgeId,kind:"retained",stepIndex:_,side:"carrier"});const T={schemaVersion:1,vertices:h,halfEdges:f,edges:p,faces:d,cutPairs:v,materialComponents:[{id:`tread-only-material:${n.operationId}`,faces:d.map(_=>_.id)}]},P=Sr(T);return P.length>0?{ok:!1,diagnostics:P}:{ok:!0,complex:T,sourceMap:{construction:"treadOnly",operationId:n.operationId,enclosingCut:!1,faces:m,cutLines:a.slice(1),shortEnds:g,hinges:[{edgeId:"hinge:parent",role:"parent"},...o,...l.slice(1),...Array.from({length:n.stepCount},(_,S)=>({edgeId:`hinge:carrier-base:${S+1}`,role:"carrierBase",stepIndex:S}))],supports:A}}}function Er(n){if(!Number.isInteger(n.sampleCount)||n.sampleCount<2||n.sampleCount>1001)return{ok:!1,diagnostics:[Sa(n.input.operationId,"Path sample count must be an integer in [2, 1001].")]};const e=[];for(let t=0;t<n.sampleCount;t+=1){const i=t/(n.sampleCount-1),s=ig(n.input,n.complex,n.sourceMap,i);if(!s.ok)return{ok:!1,diagnostics:[Sa(n.input.operationId,s.reason)]};e.push({parameter:i,transforms:s.transforms})}return{ok:!0,samples:e}}function ig(n,e,t,i){const s=new Map(t.faces.map(h=>[h.faceId,h])),r=new Map(e.halfEdges.map(h=>[h.id,h])),a=new Map(e.vertices.map(h=>[h.id,h.position])),o=i*Math.PI/2,l=Ni([0,0,0],[1,0,0],o),c=Ni([0,-n.width,0],[1,0,0],o),u=new Map;for(const h of e.faces){const d=s.get(h.id);if(!d)return{ok:!1,reason:`Tread-only face ${h.id} has no material trace.`};if(d.role==="base")u.set(h.id,Hn());else if(d.role==="host")u.set(h.id,l);else if(d.role==="carrier")u.set(h.id,c);else if(d.role==="tread"&&d.stepIndex!==void 0){const f=d.stepIndex*n.stepRise;u.set(h.id,{rotation:Hn().rotation,translation:[0,-f*(1-Math.cos(o)),f*Math.sin(o)]})}else return{ok:!1,reason:`Tread-only face ${h.id} has unsupported role ${d.role}.`}}for(const h of e.edges.filter(d=>d.halfEdges.length===2)){const d=r.get(h.halfEdges[0]),f=r.get(h.halfEdges[1]),p=r.get(d.next),v=r.get(f.next),m=(E,b)=>{const M=a.get(b),A=u.get(E.face);return Ct(A,[M[0],M[1],0])},g=Math.max(ul(m(d,d.origin),m(f,v.origin)),ul(m(d,p.origin),m(f,f.origin)));if(g>1e-8)return{ok:!1,reason:`Tread-only retained edge ${h.id} detaches by ${g}.`}}return{ok:!0,transforms:u}}function ul(n,e){return Math.hypot(n[0]-e[0],n[1]-e[1],n[2]-e[2])}function sg(n,e,t){return e.find((i,s)=>n[0]>i.start[0]&&n[0]<i.end[0]&&n[1]>t[s].start[1]&&n[1]<i.start[1])?.stepIndex}function rg(n,e,t,i){if(!(n<=e||n>=e+i*t))return Math.min(i-1,Math.max(0,Math.floor((n-e)/t)))}function hl(n){return[...new Set(n.map(e=>Number(e.toFixed(12))))].sort((e,t)=>e-t)}function $i(n,e){return`v:${e}:${n}`}function ni(n,e){return Math.abs(n-e)<=1e-10}function fl(n,e,t,i){return ni(n[0],t[0])&&ni(n[1],t[1])&&ni(e[0],i[0])&&ni(e[1],i[1])}function ag(n,e,t){const i=n.stepCount*n.stepRun,s=-n.width,r=n.stepCount*n.stepRise;return n.operationId.length>0&&Number.isFinite(n.width)&&n.width>0&&Number.isInteger(n.stepCount)&&n.stepCount>=e&&n.stepCount<=20&&Number.isFinite(n.stepRun)&&n.stepRun>0&&Number.isFinite(n.stepRise)&&n.stepRise>0&&(!t||n.stepRun===n.stepRise)&&Number.isFinite(n.hostWidth)&&n.hostWidth>=i&&Number.isFinite(n.hostFloorExtent)&&n.hostFloorExtent>=-s&&Number.isFinite(n.hostWallExtent)&&n.hostWallExtent>=r?void 0:Sa(n.operationId||"unknown","Tread-only stair dimensions must be positive, equal-run/equal-rise, bounded, and fit the host sheet.")}function Sa(n,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}]}}function og(n){const e=Mo(n);if(!e.ok)return e;const t=e.sourceMap.faces.map(a=>({faceId:a.faceId,role:a.role==="tread"?"riser":a.role==="host"?"stationaryHost":a.role==="base"?"movingHalf":"carrier",...a.stepIndex===void 0?{}:{stepIndex:a.stepIndex}})),i=t.filter(a=>a.role==="riser"),s=Zc(e.complex,ur),r=s.edges.filter(a=>a.id.startsWith("hinge:parent:")).map(a=>({edgeId:a.id,role:"parent"}));return{ok:!0,complex:s,sourceMap:{construction:"riserOnly",operationId:n.operationId,sheetOrientation:"landscape",parentCreaseAxis:"vertical",enclosingCut:!1,faces:t,cutLines:e.sourceMap.cutLines.map(a=>({...a,start:Es(a.start),end:Es(a.end)})),shortEnds:e.sourceMap.shortEnds.map(a=>({...a,side:a.side==="host"?"stationaryHost":"carrier"})),hinges:[...r,...e.sourceMap.hinges.filter(a=>a.role!=="parent").map(a=>({...a,...a.start===void 0?{}:{start:Es(a.start)},...a.end===void 0?{}:{end:Es(a.end)}}))],supports:Array.from({length:n.stepCount},(a,o)=>({stepIndex:o,riserFaceId:i.find(l=>l.stepIndex===o).faceId,stationaryHostConnected:!0,carrierConnected:!0}))}}}function lg(n){const e={...n.sourceMap,construction:"treadOnly",faces:n.sourceMap.faces.map(r=>({faceId:r.faceId,role:r.role==="riser"?"tread":r.role==="stationaryHost"?"host":r.role==="movingHalf"?"base":"carrier",...r.stepIndex===void 0?{}:{stepIndex:r.stepIndex}})),shortEnds:n.sourceMap.shortEnds.map(r=>({...r,side:r.side==="stationaryHost"?"host":"carrier"})),supports:n.sourceMap.supports.map(r=>({stepIndex:r.stepIndex,treadFaceId:r.riserFaceId,hostConnected:!0,carrierConnected:!0}))},t=Zc(n.complex,cr(ur)),i=Er({input:n.input,complex:t,sourceMap:e,sampleCount:n.sampleCount});if(!i.ok)return i;const s=n.sourceMap.faces.find(r=>r.role==="stationaryHost");return s?{ok:!0,samples:i.samples.map(r=>{const a=cr(r.transforms.get(s.faceId));return{parameter:r.parameter,transforms:new Map([...r.transforms].map(([o,l])=>[o,cg(Tn(a,l))]))}})}:{ok:!1,diagnostics:[ug(n.input.operationId,"Riser-only pattern has no stationary host face.")]}}const ur={rotation:[[0,-1,0],[1,0,0],[0,0,1]],translation:[0,0,0]};function Es([n,e]){return[-e,n]}function Zc(n,e){return{...n,vertices:n.vertices.map(t=>{const[i,s]=t.position,r=dg(e,[i,s,0]);return{...t,position:[r[0],r[1]]}})}}function cg(n){return Tn(ur,Tn(n,cr(ur)))}function dg(n,e){return[n.rotation[0][0]*e[0]+n.rotation[0][1]*e[1]+n.rotation[0][2]*e[2]+n.translation[0],n.rotation[1][0]*e[0]+n.rotation[1][1]*e[1]+n.rotation[1][2]*e[2]+n.translation[1],n.rotation[2][0]*e[0]+n.rotation[2][1]*e[1]+n.rotation[2][2]*e[2]+n.translation[2]]}function ug(n,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}]}}function hg(n){const e={operationId:n.operationId,width:n.width,stepCount:1,stepRun:n.depth,stepRise:n.thickness,hostWidth:n.hostWidth,hostFloorExtent:n.hostFloorExtent,hostWallExtent:n.hostWallExtent},t=qc(e,1,!1);if(!t.ok)return t;const i=t.sourceMap.faces.map(r=>({faceId:r.faceId,role:r.role==="tread"?"slab":r.role==="riser"?"carrier":r.role})),s=i.find(r=>r.role==="slab");return s?{ok:!0,complex:t.complex,sourceMap:{construction:"slab",operationId:n.operationId,levelCount:1,enclosingCut:!1,faces:i,cutLines:t.sourceMap.cutLines,shortEnds:t.sourceMap.shortEnds.map(r=>({edgeId:r.edgeId,kind:r.kind,stepIndex:0,side:r.side})),hinges:t.sourceMap.hinges,supports:[{slabFaceId:s.faceId,slabConnected:!0}]}}:{ok:!1,diagnostics:[pg(n.operationId,"Slab compilation produced no retained slab face.")]}}function fg(n){const e={operationId:n.input.operationId,width:n.input.width,stepCount:1,stepRun:n.input.depth,stepRise:n.input.thickness,hostWidth:n.input.hostWidth,hostFloorExtent:n.input.hostFloorExtent,hostWallExtent:n.input.hostWallExtent},t={construction:"treadOnly",operationId:n.sourceMap.operationId,enclosingCut:!1,faces:n.sourceMap.faces.map(i=>({faceId:i.faceId,role:i.role==="slab"?"tread":i.role,...i.role==="slab"?{stepIndex:0}:{}})),cutLines:n.sourceMap.cutLines,shortEnds:n.sourceMap.shortEnds,hinges:n.sourceMap.hinges,supports:n.sourceMap.supports.map(i=>({stepIndex:0,treadFaceId:i.slabFaceId,hostConnected:!0,carrierConnected:!0}))};return Er({input:e,complex:n.complex,sourceMap:t,sampleCount:n.sampleCount})}function pg(n,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}]}}function mg(n){const e={operationId:`${n.operationId}:parent`,...n.parent},t={operationId:`${n.operationId}:child`,hostPlane:"wall",...n.child},i=Mo(e);if(!i.ok)return i;const s=Bc(t);if(!s.ok)return s;const r=xg(n),a=-n.parent.width;if(!vg(n,r,a))return{ok:!1,diagnostics:[Ea(n.operationId,"The child stair must fit one retained carrier strip above the carrier-base hinge and parent base material below it.")]};const o=ya(i.complex),l=new Map(i.sourceMap.faces.map(v=>[v.faceId,v])),c=i.sourceMap.faces.filter(v=>{const m=o.get(v.faceId);return Tg(m,r)}).map(v=>v.faceId).sort(),u=c.map(v=>l.get(v));if(!u.some(v=>v.role==="carrier")||!u.some(v=>v.role==="base"))return{ok:!1,diagnostics:[Ea(n.operationId,"The child source region must replace both retained carrier material and the common parent base.")]};const h=new Set(c),d=i.complex.faces.map(v=>v.id).filter(v=>!h.has(v)).sort(),f=_g(i,s,r,a,n.operationId),p=Sr(f.complex);return p.length>0?{ok:!1,diagnostics:p}:{ok:!0,input:n,parent:i,child:s,complex:f.complex,childPlacement:wg(r.minimumX,a),sourceMap:{construction:"carrierHostedCompoundStair",operationId:n.operationId,materialComponentCount:1,parent:i.sourceMap,child:s.sourceMap,integratedFaces:f.faces,retainedParentFaceIds:d,replacement:{sourceRegion:r,replacedParentFaceIds:c},sharedEdges:{carrierHost:{kind:"sharedMaterialEdge",y:a},groundBridge:{kind:"sharedMaterialEdge",y:a}}},evidence:{sourceRegionContained:!0,childHostContainedInCarrier:!0,childBaseContainedInParentBase:!0,childReplacesCarrier:!0,groundBridgeRetained:!0}}}function gg(n){const e={operationId:`${n.compilation.input.operationId}:parent`,...n.compilation.input.parent},t={operationId:`${n.compilation.input.operationId}:child`,hostPlane:"wall",...n.compilation.input.child},i=Er({input:e,complex:n.compilation.parent.complex,sourceMap:n.compilation.parent.sourceMap,sampleCount:n.sampleCount});if(!i.ok)return i;const s=Xc({input:t,complex:n.compilation.child.complex,sourceMap:n.compilation.child.sourceMap,sampleCount:n.sampleCount});if(!s.ok)return s;const r=i.samples.map((o,l)=>{const c=s.samples[l],u=new Map([...c.transforms].map(([v,m])=>[v,Tn(n.compilation.childPlacement,m)])),h=Ag(n.compilation,o.transforms,u),d=new Map(n.compilation.sourceMap.integratedFaces.map(v=>[v.faceId,v.source==="parent"?o.transforms.get(v.sourceFaceId):Tn(u.get(v.sourceFaceId),cr(n.compilation.childPlacement))])),p=Kc(n.compilation.complex,d).residual;return{parameter:o.parameter,transforms:d,parentTransforms:o.transforms,childTransforms:u,carrierHostResidual:h.carrier,groundBridgeResidual:h.ground,maximumSharedMaterialResidual:p,grounded:h.ground<1e-8,childUsesCarrierHost:h.carrier<1e-8}}),a=r.find(o=>!o.grounded||!o.childUsesCarrierHost||o.maximumSharedMaterialResidual>=1e-8);return a?{ok:!1,diagnostics:[Ea(n.compilation.input.operationId,`Compound stair shared material detached at parameter ${a.parameter}: carrier ${a.carrierHostResidual}, ground ${a.groundBridgeResidual}, retained ${a.maximumSharedMaterialResidual} at ${bg(n.compilation.complex,a.transforms).edgeId}.`)]}:{ok:!0,samples:r}}function _g(n,e,t,i,s){const r=[t.minimumX,i,0],a=ya(n.complex),o=ya(e.complex),l=pl([...n.complex.vertices.map(M=>M.position[0]),...e.complex.vertices.map(M=>M.position[0]+r[0])]),c=pl([...n.complex.vertices.map(M=>M.position[1]),...e.complex.vertices.map(M=>M.position[1]+r[1])]),u=[],h=[],d=[],f=[];for(let M=0;M<c.length;M+=1)for(let A=0;A<l.length;A+=1)u.push({id:Xi(A,M),position:[l[A],c[M]]});for(let M=0;M<c.length-1;M+=1)for(let A=0;A<l.length-1;A+=1){const T=[(l[A]+l[A+1])/2,(c[M]+c[M+1])/2],P=Mg(T,t),_=P?"child":"parent",S=P?[T[0]-r[0],T[1]-r[1]]:T,C=Sg(P?o:a,S);if(!C)throw new Error(`Integrated compound cell ${A}:${M} has no ${_} source face.`);const R=`compound-face:${M}:${A}`,I=["bottom","right","top","left"].map(H=>`compound-he:${M}:${A}:${H}`);d.push({id:I[0],origin:Xi(A,M),next:I[1],edge:"pending",face:R},{id:I[1],origin:Xi(A+1,M),next:I[2],edge:"pending",face:R},{id:I[2],origin:Xi(A+1,M+1),next:I[3],edge:"pending",face:R},{id:I[3],origin:Xi(A,M+1),next:I[0],edge:"pending",face:R}),h.push({id:R,boundary:I[0],holes:[]}),f.push({faceId:R,source:_,sourceFaceId:C})}const p=[],v=[],m=new Map(d.map(M=>[M.id,M])),g=new Map(f.map(M=>[M.faceId,M])),E=(M,A)=>{for(const T of M)m.get(T).edge=A.id;M.length===2&&(m.get(M[0]).twin=M[1],m.get(M[1]).twin=M[0]),p.push(A)},b=(M,A,T,P)=>{if(M.length===1){const N=[M[0]];E(N,{id:`boundary:${P}`,halfEdges:N,kind:"boundary"});return}const _=[M[0],M[1]],S=g.get(m.get(M[0]).face),C=g.get(m.get(M[1]).face);if(S.source!==C.source){E(_,{id:`seam:embedded:${P}`,halfEdges:_,kind:"flatSeam"});return}const R=S.source==="parent"?n.complex:e.complex,I=S.source==="parent"?A:[A[0]-r[0],A[1]-r[1]],H=S.source==="parent"?T:[T[0]-r[0],T[1]-r[1]],W=yg(R,I,H);if(W.kind==="cutBank"){const N=`cut:compound:${P}`,Y=`${N}:a`,k=`${N}:b`;E([M[0]],{id:Y,halfEdges:[M[0]],kind:"cutBank",cutBank:{pair:N,bank:"a"}}),E([M[1]],{id:k,halfEdges:[M[1]],kind:"cutBank",cutBank:{pair:N,bank:"b"}}),v.push({id:N,banks:[Y,k]});return}if(W.kind==="hinge"){E(_,{id:`hinge:compound:${P}`,halfEdges:_,kind:"hinge",hinge:W.hinge});return}E(_,{id:`seam:compound:${P}`,halfEdges:_,kind:"flatSeam"})};for(let M=0;M<c.length-1;M+=1)for(let A=0;A<l.length;A+=1){const T=[A>0?`compound-he:${M}:${A-1}:right`:void 0,A<l.length-1?`compound-he:${M}:${A}:left`:void 0].filter(P=>P!==void 0);b(T,[l[A],c[M]],[l[A],c[M+1]],`v:${M}:${A}`)}for(let M=0;M<c.length;M+=1)for(let A=0;A<l.length-1;A+=1){const T=[M>0?`compound-he:${M-1}:${A}:top`:void 0,M<c.length-1?`compound-he:${M}:${A}:bottom`:void 0].filter(P=>P!==void 0);b(T,[l[A],c[M]],[l[A+1],c[M]],`h:${M}:${A}`)}return{complex:{schemaVersion:1,vertices:u,halfEdges:d,edges:p,faces:h,cutPairs:v,materialComponents:[{id:`compound-material:${s}`,faces:h.map(M=>M.id)}]},faces:f}}function xg(n){const t=(n.parent.hostWidth-n.parent.stepCount*n.parent.stepRun)/2+n.childHostStepIndex*n.parent.stepRun+(n.parent.stepRun-n.child.hostWidth)/2,i=-n.parent.width;return{minimumX:ts(t),maximumX:ts(t+n.child.hostWidth),minimumY:ts(i-n.child.hostFloorExtent),maximumY:ts(i+n.child.hostWallExtent)}}function ts(n){return Number(n.toFixed(12))}function vg(n,e,t){if(!Number.isInteger(n.childHostStepIndex)||n.childHostStepIndex<0||n.childHostStepIndex>=n.parent.stepCount||n.child.hostWidth>n.parent.stepRun+1e-10||e.minimumX<0||e.maximumX>n.parent.hostWidth||e.minimumY<-n.parent.hostFloorExtent||e.maximumY>n.parent.hostWallExtent)return!1;const i=(n.parent.hostWidth-n.parent.stepCount*n.parent.stepRun)/2,r=Math.min(n.parent.stepCount-1,Math.max(0,Math.floor((e.minimumX-i)/n.parent.stepRun+1e-8)))*n.parent.stepRise;return e.minimumY<t&&e.maximumY<=r+1e-10}function ya(n){const e=new Map(n.vertices.map(i=>[i.id,i.position])),t=new Map(n.halfEdges.map(i=>[i.id,i]));return new Map(n.faces.map(i=>{const s=[];let r=t.get(i.boundary);const a=r.id;do s.push(e.get(r.origin)),r=t.get(r.next);while(r.id!==a);return[i.id,{minimumX:Math.min(...s.map(o=>o[0])),maximumX:Math.max(...s.map(o=>o[0])),minimumY:Math.min(...s.map(o=>o[1])),maximumY:Math.max(...s.map(o=>o[1]))}]}))}function pl(n){return[...new Set(n.map(e=>ts(e)))].sort((e,t)=>e-t)}function Xi(n,e){return`compound-v:${e}:${n}`}function Mg(n,e){return n[0]>e.minimumX&&n[0]<e.maximumX&&n[1]>e.minimumY&&n[1]<e.maximumY}function Sg(n,e){return[...n].find(([,t])=>e[0]>t.minimumX-1e-10&&e[0]<t.maximumX+1e-10&&e[1]>t.minimumY-1e-10&&e[1]<t.maximumY+1e-10)?.[0]}function yg(n,e,t){const i=new Map(n.vertices.map(r=>[r.id,r.position])),s=new Map(n.halfEdges.map(r=>[r.id,r]));for(const r of n.edges)for(const a of r.halfEdges){const o=s.get(a),l=i.get(o.origin),c=i.get(s.get(o.next).origin);if(Eg(e,t,l,c))return r}return{id:"implicit-flat-seam",halfEdges:["implicit"],kind:"flatSeam"}}function Eg(n,e,t,i){const s=(e[0]-n[0])*(t[1]-n[1])-(e[1]-n[1])*(t[0]-n[0]),r=(e[0]-n[0])*(i[1]-n[1])-(e[1]-n[1])*(i[0]-n[0]);return Math.abs(s)>1e-9||Math.abs(r)>1e-9?!1:Math.min(t[0],i[0])<=n[0]+1e-10&&Math.max(t[0],i[0])>=e[0]-1e-10&&Math.min(t[1],i[1])<=n[1]+1e-10&&Math.max(t[1],i[1])>=e[1]-1e-10}function Kc(n,e){const t=new Map(n.vertices.map(a=>[a.id,a.position])),i=new Map(n.halfEdges.map(a=>[a.id,a]));let s=0,r;for(const a of n.edges.filter(o=>o.halfEdges.length===2)){const o=i.get(a.halfEdges[0]),l=i.get(a.halfEdges[1]),c=i.get(o.next),u=i.get(l.next),h=(f,p)=>{const v=t.get(p);return Ct(e.get(f.face),[v[0],v[1],0])},d=Math.max(hr(h(o,o.origin),h(l,u.origin)),hr(h(o,c.origin),h(l,l.origin)));d>s&&(s=d,r=a.id)}return{residual:s,...r===void 0?{}:{edgeId:r}}}function bg(n,e){return Kc(n,e)}function Tg(n,e){return Math.min(n.maximumX,e.maximumX)-Math.max(n.minimumX,e.minimumX)>1e-10&&Math.min(n.maximumY,e.maximumY)-Math.max(n.minimumY,e.minimumY)>1e-10}function Ag(n,e,t){const i=n.parent.sourceMap.faces.find(h=>h.role==="carrier"&&n.sourceMap.replacement.replacedParentFaceIds.includes(h.faceId)),s=n.parent.sourceMap.faces.find(h=>h.role==="base"&&n.sourceMap.replacement.replacedParentFaceIds.includes(h.faceId)),r=n.child.sourceMap.faces.find(h=>h.faceId.startsWith("host-face:")&&h.faceId.includes(":0")),a=n.child.sourceMap.faces.find(h=>h.faceId.startsWith("host-face:0:"));if(!i||!s||!r||!a)return{carrier:Number.POSITIVE_INFINITY,ground:Number.POSITIVE_INFINITY};const o=-n.input.parent.width,l=n.sourceMap.replacement.sourceRegion.minimumX,c=[0,0,0],u=[l,o,0];return{carrier:hr(Ct(e.get(i.faceId),u),Ct(t.get(r.faceId),c)),ground:hr(Ct(e.get(s.faceId),u),Ct(t.get(a.faceId),c))}}function wg(n,e){return{...Hn(),translation:[n,e,0]}}function hr(n,e){return Math.hypot(n[0]-e[0],n[1]-e[1],n[2]-e[2])}function Ea(n,e){return{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}]}}const So="185",Ci={ROTATE:0,DOLLY:1,PAN:2},Ri={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rg=0,ml=1,Cg=2,tr=1,Pg=2,ns=3,Wn=0,Vt=1,un=2,An=0,Pi=1,gl=2,_l=3,xl=4,Ig=5,ei=100,Lg=101,Dg=102,Ng=103,Ug=104,Fg=200,Og=201,Bg=202,kg=203,ba=204,Ta=205,Vg=206,zg=207,Gg=208,Hg=209,Wg=210,$g=211,Xg=212,Yg=213,qg=214,Aa=0,wa=1,Ra=2,Ui=3,Ca=4,Pa=5,Ia=6,La=7,Jc=0,Zg=1,Kg=2,pn=0,Qc=1,jc=2,ed=3,td=4,nd=5,id=6,sd=7,rd=300,ai=301,Fi=302,Ur=303,Fr=304,br=306,Da=1e3,bn=1001,Na=1002,Tt=1003,Jg=1004,bs=1005,Pt=1006,Or=1007,ii=1008,$t=1009,ad=1010,od=1011,cs=1012,yo=1013,_n=1014,hn=1015,Rn=1016,Eo=1017,bo=1018,ds=1020,ld=35902,cd=35899,dd=1021,ud=1022,tn=1023,Cn=1026,si=1027,hd=1028,To=1029,oi=1030,Ao=1031,wo=1033,nr=33776,ir=33777,sr=33778,rr=33779,Ua=35840,Fa=35841,Oa=35842,Ba=35843,ka=36196,Va=37492,za=37496,Ga=37488,Ha=37489,fr=37490,Wa=37491,$a=37808,Xa=37809,Ya=37810,qa=37811,Za=37812,Ka=37813,Ja=37814,Qa=37815,ja=37816,eo=37817,to=37818,no=37819,io=37820,so=37821,ro=36492,ao=36494,oo=36495,lo=36283,co=36284,pr=36285,uo=36286,Qg=3200,ho=0,jg=1,Vn="",Wt="srgb",mr="srgb-linear",gr="linear",Ze="srgb",fi=7680,vl=519,e_=512,t_=513,n_=514,Ro=515,i_=516,s_=517,Co=518,r_=519,Ml=35044,Sl="300 es",fn=2e3,us=2001;function a_(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function _r(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function o_(){const n=_r("canvas");return n.style.display="block",n}const yl={};function El(...n){const e="THREE."+n.shift();console.log(e,...n)}function fd(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ce(...n){n=fd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Xe(...n){n=fd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Ii(...n){const e=n.join(" ");e in yl||(yl[e]=!0,Ce(...n))}function l_(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const c_={[Aa]:wa,[Ra]:Ia,[Ca]:La,[Ui]:Pa,[wa]:Aa,[Ia]:Ra,[La]:Ca,[Pa]:Ui};class Yn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let bl=1234567;const as=Math.PI/180,hs=180/Math.PI;function Vi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(wt[n&255]+wt[n>>8&255]+wt[n>>16&255]+wt[n>>24&255]+"-"+wt[e&255]+wt[e>>8&255]+"-"+wt[e>>16&15|64]+wt[e>>24&255]+"-"+wt[t&63|128]+wt[t>>8&255]+"-"+wt[t>>16&255]+wt[t>>24&255]+wt[i&255]+wt[i>>8&255]+wt[i>>16&255]+wt[i>>24&255]).toLowerCase()}function ze(n,e,t){return Math.max(e,Math.min(t,n))}function Po(n,e){return(n%e+e)%e}function d_(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function u_(n,e,t){return n!==e?(t-n)/(e-n):0}function os(n,e,t){return(1-t)*n+t*e}function h_(n,e,t,i){return os(n,e,1-Math.exp(-t*i))}function f_(n,e=1){return e-Math.abs(Po(n,e*2)-e)}function p_(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function m_(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function g_(n,e){return n+Math.floor(Math.random()*(e-n+1))}function __(n,e){return n+Math.random()*(e-n)}function x_(n){return n*(.5-Math.random())}function v_(n){n!==void 0&&(bl=n);let e=bl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function M_(n){return n*as}function S_(n){return n*hs}function y_(n){return(n&n-1)===0&&n!==0}function E_(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function b_(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function T_(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),u=a((e+i)/2),h=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),p=a((i-e)/2);switch(s){case"XYX":n.set(o*u,l*h,l*d,o*c);break;case"YZY":n.set(l*d,o*u,l*h,o*c);break;case"ZXZ":n.set(l*h,l*d,o*u,o*c);break;case"XZX":n.set(o*u,l*p,l*f,o*c);break;case"YXY":n.set(l*f,o*u,l*p,o*c);break;case"ZYZ":n.set(l*p,l*f,o*u,o*c);break;default:Ce("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function wi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function It(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const pd={DEG2RAD:as,RAD2DEG:hs,generateUUID:Vi,clamp:ze,euclideanModulo:Po,mapLinear:d_,inverseLerp:u_,lerp:os,damp:h_,pingpong:f_,smoothstep:p_,smootherstep:m_,randInt:g_,randFloat:__,randFloatSpread:x_,seededRandom:v_,degToRad:M_,radToDeg:S_,isPowerOfTwo:y_,ceilPowerOfTwo:E_,floorPowerOfTwo:b_,setQuaternionFromProperEuler:T_,normalize:It,denormalize:wi},Oo=class Oo{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Oo.prototype.isVector2=!0;let Le=Oo;class $n{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],h=i[s+3],d=r[a+0],f=r[a+1],p=r[a+2],v=r[a+3];if(h!==v||l!==d||c!==f||u!==p){let m=l*d+c*f+u*p+h*v;m<0&&(d=-d,f=-f,p=-p,v=-v,m=-m);let g=1-o;if(m<.9995){const E=Math.acos(m),b=Math.sin(E);g=Math.sin(g*E)/b,o=Math.sin(o*E)/b,l=l*g+d*o,c=c*g+f*o,u=u*g+p*o,h=h*g+v*o}else{l=l*g+d*o,c=c*g+f*o,u=u*g+p*o,h=h*g+v*o;const E=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=E,c*=E,u*=E,h*=E}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],h=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+u*h+l*f-c*d,e[t+1]=l*p+u*d+c*h-o*f,e[t+2]=c*p+u*f+o*d-l*h,e[t+3]=u*p-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),h=o(r/2),d=l(i/2),f=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>h){const f=2*Math.sqrt(1+i-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-i-h);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Bo=class Bo{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Tl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Tl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),h=2*(r*i-a*t);return this.x=t+l*c+a*h-o*u,this.y=i+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Br.copy(this).projectOnVector(e),this.sub(Br)}reflect(e){return this.sub(Br.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Bo.prototype.isVector3=!0;let O=Bo;const Br=new O,Tl=new $n,ko=class ko{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],p=i[8],v=s[0],m=s[3],g=s[6],E=s[1],b=s[4],M=s[7],A=s[2],T=s[5],P=s[8];return r[0]=a*v+o*E+l*A,r[3]=a*m+o*b+l*T,r[6]=a*g+o*M+l*P,r[1]=c*v+u*E+h*A,r[4]=c*m+u*b+h*T,r[7]=c*g+u*M+h*P,r[2]=d*v+f*E+p*A,r[5]=d*m+f*b+p*T,r[8]=d*g+f*M+p*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*r,f=c*r-a*l,p=t*h+i*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return e[0]=h*v,e[1]=(s*c-u*i)*v,e[2]=(o*i-s*a)*v,e[3]=d*v,e[4]=(u*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=f*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ii("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(kr.makeScale(e,t)),this}rotate(e){return Ii("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(kr.makeRotation(-e)),this}translate(e,t){return Ii("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(kr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ko.prototype.isMatrix3=!0;let Ne=ko;const kr=new Ne,Al=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wl=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function A_(){const n={enabled:!0,workingColorSpace:mr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ze&&(s.r=wn(s.r),s.g=wn(s.g),s.b=wn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ze&&(s.r=Li(s.r),s.g=Li(s.g),s.b=Li(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Vn?gr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ii("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ii("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[mr]:{primaries:e,whitePoint:i,transfer:gr,toXYZ:Al,fromXYZ:wl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Wt},outputColorSpaceConfig:{drawingBufferColorSpace:Wt}},[Wt]:{primaries:e,whitePoint:i,transfer:Ze,toXYZ:Al,fromXYZ:wl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Wt}}}),n}const He=A_();function wn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Li(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let pi;class w_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{pi===void 0&&(pi=_r("canvas")),pi.width=e.width,pi.height=e.height;const s=pi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=pi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=_r("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=wn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(wn(t[i]/255)*255):t[i]=wn(t[i]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let R_=0;class Io{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:R_++}),this.uuid=Vi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Vr(s[a].image)):r.push(Vr(s[a]))}else r=Vr(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Vr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?w_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let C_=0;const zr=new O;class Dt extends Yn{constructor(e=Dt.DEFAULT_IMAGE,t=Dt.DEFAULT_MAPPING,i=bn,s=bn,r=Pt,a=ii,o=tn,l=$t,c=Dt.DEFAULT_ANISOTROPY,u=Vn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:C_++}),this.uuid=Vi(),this.name="",this.source=new Io(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(zr).x}get height(){return this.source.getSize(zr).y}get depth(){return this.source.getSize(zr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==rd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Da:e.x=e.x-Math.floor(e.x);break;case bn:e.x=e.x<0?0:1;break;case Na:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Da:e.y=e.y-Math.floor(e.y);break;case bn:e.y=e.y<0?0:1;break;case Na:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Dt.DEFAULT_IMAGE=null;Dt.DEFAULT_MAPPING=rd;Dt.DEFAULT_ANISOTROPY=1;const Vo=class Vo{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],v=l[2],m=l[6],g=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,M=(f+1)/2,A=(g+1)/2,T=(u+d)/4,P=(h+v)/4,_=(p+m)/4;return b>M&&b>A?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=T/i,r=P/i):M>A?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=T/s,r=_/s):A<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),i=P/r,s=_/r),this.set(i,s,r,t),this}let E=Math.sqrt((m-p)*(m-p)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(E)<.001&&(E=1),this.x=(m-p)/E,this.y=(h-v)/E,this.z=(d-u)/E,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Vo.prototype.isVector4=!0;let rt=Vo;class P_ extends Yn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new Dt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Pt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Io(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mn extends P_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class md extends Dt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class I_ extends Dt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Mr=class Mr{constructor(e,t,i,s,r,a,o,l,c,u,h,d,f,p,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,h,d,f,p,v,m)}set(e,t,i,s,r,a,o,l,c,u,h,d,f,p,v,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=u,g[10]=h,g[14]=d,g[3]=f,g[7]=p,g[11]=v,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Mr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/mi.setFromMatrixColumn(e,0).length(),r=1/mi.setFromMatrixColumn(e,1).length(),a=1/mi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=a*u,f=a*h,p=o*u,v=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+p*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,p=c*u,v=c*h;t[0]=d+v*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-p,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,p=c*u,v=c*h;t[0]=d-v*o,t[4]=-a*h,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*u,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,p=o*u,v=o*h;t[0]=l*u,t[4]=p*c-f,t[8]=d*c+v,t[1]=l*h,t[5]=v*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,p=o*l,v=o*c;t[0]=l*u,t[4]=v-d*h,t[8]=p*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+p,t[10]=d-v*h}else if(e.order==="XZY"){const d=a*l,f=a*c,p=o*l,v=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+v,t[5]=a*u,t[9]=f*h-p,t[2]=p*h-f,t[6]=o*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(L_,e,D_)}lookAt(e,t,i){const s=this.elements;return Gt.subVectors(e,t),Gt.lengthSq()===0&&(Gt.z=1),Gt.normalize(),Dn.crossVectors(i,Gt),Dn.lengthSq()===0&&(Math.abs(i.z)===1?Gt.x+=1e-4:Gt.z+=1e-4,Gt.normalize(),Dn.crossVectors(i,Gt)),Dn.normalize(),Ts.crossVectors(Gt,Dn),s[0]=Dn.x,s[4]=Ts.x,s[8]=Gt.x,s[1]=Dn.y,s[5]=Ts.y,s[9]=Gt.y,s[2]=Dn.z,s[6]=Ts.z,s[10]=Gt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],p=i[2],v=i[6],m=i[10],g=i[14],E=i[3],b=i[7],M=i[11],A=i[15],T=s[0],P=s[4],_=s[8],S=s[12],C=s[1],R=s[5],I=s[9],H=s[13],W=s[2],N=s[6],Y=s[10],k=s[14],J=s[3],te=s[7],ie=s[11],ce=s[15];return r[0]=a*T+o*C+l*W+c*J,r[4]=a*P+o*R+l*N+c*te,r[8]=a*_+o*I+l*Y+c*ie,r[12]=a*S+o*H+l*k+c*ce,r[1]=u*T+h*C+d*W+f*J,r[5]=u*P+h*R+d*N+f*te,r[9]=u*_+h*I+d*Y+f*ie,r[13]=u*S+h*H+d*k+f*ce,r[2]=p*T+v*C+m*W+g*J,r[6]=p*P+v*R+m*N+g*te,r[10]=p*_+v*I+m*Y+g*ie,r[14]=p*S+v*H+m*k+g*ce,r[3]=E*T+b*C+M*W+A*J,r[7]=E*P+b*R+M*N+A*te,r[11]=E*_+b*I+M*Y+A*ie,r[15]=E*S+b*H+M*k+A*ce,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],p=e[3],v=e[7],m=e[11],g=e[15],E=l*f-c*d,b=o*f-c*h,M=o*d-l*h,A=a*f-c*u,T=a*d-l*u,P=a*h-o*u;return t*(v*E-m*b+g*M)-i*(p*E-m*A+g*T)+s*(p*b-v*A+g*P)-r*(p*M-v*T+m*P)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-i*(r*u-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],p=e[12],v=e[13],m=e[14],g=e[15],E=t*o-i*a,b=t*l-s*a,M=t*c-r*a,A=i*l-s*o,T=i*c-r*o,P=s*c-r*l,_=u*v-h*p,S=u*m-d*p,C=u*g-f*p,R=h*m-d*v,I=h*g-f*v,H=d*g-f*m,W=E*H-b*I+M*R+A*C-T*S+P*_;if(W===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/W;return e[0]=(o*H-l*I+c*R)*N,e[1]=(s*I-i*H-r*R)*N,e[2]=(v*P-m*T+g*A)*N,e[3]=(d*T-h*P-f*A)*N,e[4]=(l*C-a*H-c*S)*N,e[5]=(t*H-s*C+r*S)*N,e[6]=(m*M-p*P-g*b)*N,e[7]=(u*P-d*M+f*b)*N,e[8]=(a*I-o*C+c*_)*N,e[9]=(i*C-t*I-r*_)*N,e[10]=(p*T-v*M+g*E)*N,e[11]=(h*M-u*T-f*E)*N,e[12]=(o*S-a*R-l*_)*N,e[13]=(t*R-i*S+s*_)*N,e[14]=(v*b-p*A-m*E)*N,e[15]=(u*A-h*b+d*E)*N,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,p=r*h,v=a*u,m=a*h,g=o*h,E=l*c,b=l*u,M=l*h,A=i.x,T=i.y,P=i.z;return s[0]=(1-(v+g))*A,s[1]=(f+M)*A,s[2]=(p-b)*A,s[3]=0,s[4]=(f-M)*T,s[5]=(1-(d+g))*T,s[6]=(m+E)*T,s[7]=0,s[8]=(p+b)*P,s[9]=(m-E)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=mi.set(s[0],s[1],s[2]).length();const o=mi.set(s[4],s[5],s[6]).length(),l=mi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Jt.copy(this);const c=1/a,u=1/o,h=1/l;return Jt.elements[0]*=c,Jt.elements[1]*=c,Jt.elements[2]*=c,Jt.elements[4]*=u,Jt.elements[5]*=u,Jt.elements[6]*=u,Jt.elements[8]*=h,Jt.elements[9]*=h,Jt.elements[10]*=h,t.setFromRotationMatrix(Jt),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=fn,l=!1){const c=this.elements,u=2*r/(t-e),h=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s);let p,v;if(l)p=r/(a-r),v=a*r/(a-r);else if(o===fn)p=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===us)p=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=fn,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s);let p,v;if(l)p=1/(a-r),v=a/(a-r);else if(o===fn)p=-2/(a-r),v=-(a+r)/(a-r);else if(o===us)p=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Mr.prototype.isMatrix4=!0;let st=Mr;const mi=new O,Jt=new st,L_=new O(0,0,0),D_=new O(1,1,1),Dn=new O,Ts=new O,Gt=new O,Rl=new st,Cl=new $n;class Xn{constructor(e=0,t=0,i=0,s=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Rl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Rl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Cl.setFromEuler(this),this.setFromQuaternion(Cl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class gd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let N_=0;const Pl=new O,gi=new $n,vn=new st,As=new O,Yi=new O,U_=new O,F_=new $n,Il=new O(1,0,0),Ll=new O(0,1,0),Dl=new O(0,0,1),Nl={type:"added"},O_={type:"removed"},_i={type:"childadded",child:null},Gr={type:"childremoved",child:null};class Et extends Yn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:N_++}),this.uuid=Vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new O,t=new Xn,i=new $n,s=new O(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new st},normalMatrix:{value:new Ne}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.multiply(gi),this}rotateOnWorldAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.premultiply(gi),this}rotateX(e){return this.rotateOnAxis(Il,e)}rotateY(e){return this.rotateOnAxis(Ll,e)}rotateZ(e){return this.rotateOnAxis(Dl,e)}translateOnAxis(e,t){return Pl.copy(e).applyQuaternion(this.quaternion),this.position.add(Pl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Il,e)}translateY(e){return this.translateOnAxis(Ll,e)}translateZ(e){return this.translateOnAxis(Dl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?As.copy(e):As.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Yi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vn.lookAt(Yi,As,this.up):vn.lookAt(As,Yi,this.up),this.quaternion.setFromRotationMatrix(vn),s&&(vn.extractRotation(s.matrixWorld),gi.setFromRotationMatrix(vn),this.quaternion.premultiply(gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Xe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Nl),_i.child=e,this.dispatchEvent(_i),_i.child=null):Xe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(O_),Gr.child=e,this.dispatchEvent(Gr),Gr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vn.multiply(e.parent.matrixWorld)),e.applyMatrix4(vn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Nl),_i.child=e,this.dispatchEvent(_i),_i.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,e,U_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,F_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Et.DEFAULT_UP=new O(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class is extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const B_={type:"move"};class Hr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new is,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new is,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new is,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),g=this._getHandJoint(c,v);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(B_)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new is;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const _d={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},ws={h:0,s:0,l:0};function Wr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ge{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Wt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=He.workingColorSpace){return this.r=e,this.g=t,this.b=i,He.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=He.workingColorSpace){if(e=Po(e,1),t=ze(t,0,1),i=ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Wr(a,r,e+1/3),this.g=Wr(a,r,e),this.b=Wr(a,r,e-1/3)}return He.colorSpaceToWorking(this,s),this}setStyle(e,t=Wt){function i(r){r!==void 0&&parseFloat(r)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Wt){const i=_d[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wn(e.r),this.g=wn(e.g),this.b=wn(e.b),this}copyLinearToSRGB(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wt){return He.workingToColorSpace(Rt.copy(this),e),Math.round(ze(Rt.r*255,0,255))*65536+Math.round(ze(Rt.g*255,0,255))*256+Math.round(ze(Rt.b*255,0,255))}getHexString(e=Wt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=He.workingColorSpace){He.workingToColorSpace(Rt.copy(this),t);const i=Rt.r,s=Rt.g,r=Rt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-i)/h+2;break;case r:l=(i-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=He.workingColorSpace){return He.workingToColorSpace(Rt.copy(this),t),e.r=Rt.r,e.g=Rt.g,e.b=Rt.b,e}getStyle(e=Wt){He.workingToColorSpace(Rt.copy(this),e);const t=Rt.r,i=Rt.g,s=Rt.b;return e!==Wt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Nn),this.setHSL(Nn.h+e,Nn.s+t,Nn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Nn),e.getHSL(ws);const i=os(Nn.h,ws.h,t),s=os(Nn.s,ws.s,t),r=os(Nn.l,ws.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rt=new Ge;Ge.NAMES=_d;class Lo{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ge(e),this.density=t}clone(){return new Lo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class k_ extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Qt=new O,Mn=new O,$r=new O,Sn=new O,xi=new O,vi=new O,Ul=new O,Xr=new O,Yr=new O,qr=new O,Zr=new rt,Kr=new rt,Jr=new rt;class en{constructor(e=new O,t=new O,i=new O){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Qt.subVectors(e,t),s.cross(Qt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Qt.subVectors(s,t),Mn.subVectors(i,t),$r.subVectors(e,t);const a=Qt.dot(Qt),o=Qt.dot(Mn),l=Qt.dot($r),c=Mn.dot(Mn),u=Mn.dot($r),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,p=(a*u-o*l)*d;return r.set(1-f-p,p,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Sn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Sn.x),l.addScaledVector(a,Sn.y),l.addScaledVector(o,Sn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Zr.setScalar(0),Kr.setScalar(0),Jr.setScalar(0),Zr.fromBufferAttribute(e,t),Kr.fromBufferAttribute(e,i),Jr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Zr,r.x),a.addScaledVector(Kr,r.y),a.addScaledVector(Jr,r.z),a}static isFrontFacing(e,t,i,s){return Qt.subVectors(i,t),Mn.subVectors(e,t),Qt.cross(Mn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Qt.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),Qt.cross(Mn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return en.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return en.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return en.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return en.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return en.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;xi.subVectors(s,i),vi.subVectors(r,i),Xr.subVectors(e,i);const l=xi.dot(Xr),c=vi.dot(Xr);if(l<=0&&c<=0)return t.copy(i);Yr.subVectors(e,s);const u=xi.dot(Yr),h=vi.dot(Yr);if(u>=0&&h<=u)return t.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(xi,a);qr.subVectors(e,r);const f=xi.dot(qr),p=vi.dot(qr);if(p>=0&&f<=p)return t.copy(r);const v=f*c-l*p;if(v<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(vi,o);const m=u*p-f*h;if(m<=0&&h-u>=0&&f-p>=0)return Ul.subVectors(r,s),o=(h-u)/(h-u+(f-p)),t.copy(s).addScaledVector(Ul,o);const g=1/(m+v+d);return a=v*g,o=d*g,t.copy(i).addScaledVector(xi,a).addScaledVector(vi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class zi{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,jt):jt.fromBufferAttribute(r,a),jt.applyMatrix4(e.matrixWorld),this.expandByPoint(jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Rs.copy(i.boundingBox)),Rs.applyMatrix4(e.matrixWorld),this.union(Rs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,jt),jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qi),Cs.subVectors(this.max,qi),Mi.subVectors(e.a,qi),Si.subVectors(e.b,qi),yi.subVectors(e.c,qi),Un.subVectors(Si,Mi),Fn.subVectors(yi,Si),Zn.subVectors(Mi,yi);let t=[0,-Un.z,Un.y,0,-Fn.z,Fn.y,0,-Zn.z,Zn.y,Un.z,0,-Un.x,Fn.z,0,-Fn.x,Zn.z,0,-Zn.x,-Un.y,Un.x,0,-Fn.y,Fn.x,0,-Zn.y,Zn.x,0];return!Qr(t,Mi,Si,yi,Cs)||(t=[1,0,0,0,1,0,0,0,1],!Qr(t,Mi,Si,yi,Cs))?!1:(Ps.crossVectors(Un,Fn),t=[Ps.x,Ps.y,Ps.z],Qr(t,Mi,Si,yi,Cs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const yn=[new O,new O,new O,new O,new O,new O,new O,new O],jt=new O,Rs=new zi,Mi=new O,Si=new O,yi=new O,Un=new O,Fn=new O,Zn=new O,qi=new O,Cs=new O,Ps=new O,Kn=new O;function Qr(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Kn.fromArray(n,r);const o=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),l=e.dot(Kn),c=t.dot(Kn),u=i.dot(Kn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const gt=new O,Is=new Le;let V_=0;class gn extends Yn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:V_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ml,this.updateRanges=[],this.gpuType=hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Is.fromBufferAttribute(this,t),Is.applyMatrix3(e),this.setXY(t,Is.x,Is.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=wi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=It(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=wi(t,this.array)),t}setX(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=wi(t,this.array)),t}setY(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=wi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=wi(t,this.array)),t}setW(e,t){return this.normalized&&(t=It(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array),s=It(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=It(t,this.array),i=It(i,this.array),s=It(s,this.array),r=It(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ml&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class xd extends gn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class vd extends gn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Nt extends gn{constructor(e,t,i){super(new Float32Array(e),t,i)}}const z_=new zi,Zi=new O,jr=new O;class xs{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):z_.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zi.subVectors(e,this.center);const t=Zi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Zi,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(jr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zi.copy(e.center).add(jr)),this.expandByPoint(Zi.copy(e.center).sub(jr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let G_=0;const Yt=new st,ea=new Et,Ei=new O,Ht=new zi,Ki=new zi,yt=new O;class Ut extends Yn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:G_++}),this.uuid=Vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(a_(e)?vd:xd)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ne().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,i){return Yt.makeTranslation(e,t,i),this.applyMatrix4(Yt),this}scale(e,t,i){return Yt.makeScale(e,t,i),this.applyMatrix4(Yt),this}lookAt(e){return ea.lookAt(e),ea.updateMatrix(),this.applyMatrix4(ea.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Nt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Ht.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Ht.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Ht.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Ht.min),this.boundingBox.expandByPoint(Ht.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Xe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const i=this.boundingSphere.center;if(Ht.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ki.setFromBufferAttribute(o),this.morphTargetsRelative?(yt.addVectors(Ht.min,Ki.min),Ht.expandByPoint(yt),yt.addVectors(Ht.max,Ki.max),Ht.expandByPoint(yt)):(Ht.expandByPoint(Ki.min),Ht.expandByPoint(Ki.max))}Ht.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)yt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(yt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)yt.fromBufferAttribute(o,c),l&&(Ei.fromBufferAttribute(e,c),yt.add(Ei)),s=Math.max(s,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Xe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Xe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new gn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<i.count;_++)o[_]=new O,l[_]=new O;const c=new O,u=new O,h=new O,d=new Le,f=new Le,p=new Le,v=new O,m=new O;function g(_,S,C){c.fromBufferAttribute(i,_),u.fromBufferAttribute(i,S),h.fromBufferAttribute(i,C),d.fromBufferAttribute(r,_),f.fromBufferAttribute(r,S),p.fromBufferAttribute(r,C),u.sub(c),h.sub(c),f.sub(d),p.sub(d);const R=1/(f.x*p.y-p.x*f.y);isFinite(R)&&(v.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(R),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(R),o[_].add(v),o[S].add(v),o[C].add(v),l[_].add(m),l[S].add(m),l[C].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let _=0,S=E.length;_<S;++_){const C=E[_],R=C.start,I=C.count;for(let H=R,W=R+I;H<W;H+=3)g(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const b=new O,M=new O,A=new O,T=new O;function P(_){A.fromBufferAttribute(s,_),T.copy(A);const S=o[_];b.copy(S),b.sub(A.multiplyScalar(A.dot(S))).normalize(),M.crossVectors(T,S);const R=M.dot(l[_])<0?-1:1;a.setXYZW(_,b.x,b.y,b.z,R)}for(let _=0,S=E.length;_<S;++_){const C=E[_],R=C.start,I=C.count;for(let H=R,W=R+I;H<W;H+=3)P(e.getX(H+0)),P(e.getX(H+1)),P(e.getX(H+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new gn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new O,r=new O,a=new O,o=new O,l=new O,c=new O,u=new O,h=new O;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,p=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*u;for(let g=0;g<u;g++)d[p++]=c[f++]}return new gn(d,u,h)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ut,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let H_=0;class ci extends Yn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:H_++}),this.uuid=Vi(),this.name="",this.type="Material",this.blending=Pi,this.side=Wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ba,this.blendDst=Ta,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(i.blending=this.blending),this.side!==Wn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ba&&(i.blendSrc=this.blendSrc),this.blendDst!==Ta&&(i.blendDst=this.blendDst),this.blendEquation!==ei&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ge().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Le().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Le().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const En=new O,ta=new O,Ls=new O,On=new O,na=new O,Ds=new O,ia=new O;class Tr{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,En)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=En.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(En.copy(this.origin).addScaledVector(this.direction,t),En.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ta.copy(e).add(t).multiplyScalar(.5),Ls.copy(t).sub(e).normalize(),On.copy(this.origin).sub(ta);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ls),o=On.dot(this.direction),l=-On.dot(Ls),c=On.lengthSq(),u=Math.abs(1-a*a);let h,d,f,p;if(u>0)if(h=a*l-o,d=a*o-l,p=r*u,h>=0)if(d>=-p)if(d<=p){const v=1/u;h*=v,d*=v,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(ta).addScaledVector(Ls,d),f}intersectSphere(e,t){En.subVectors(e.center,this.origin);const i=En.dot(this.direction),s=En.dot(En)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,En)!==null}intersectTriangle(e,t,i,s,r){na.subVectors(t,e),Ds.subVectors(i,e),ia.crossVectors(na,Ds);let a=this.direction.dot(ia),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;On.subVectors(this.origin,e);const l=o*this.direction.dot(Ds.crossVectors(On,Ds));if(l<0)return null;const c=o*this.direction.dot(na.cross(On));if(c<0||l+c>a)return null;const u=-o*On.dot(ia);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Md extends ci{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=Jc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Fl=new st,Jn=new Tr,Ns=new xs,Ol=new O,Us=new O,Fs=new O,Os=new O,sa=new O,Bs=new O,Bl=new O,ks=new O;class nn extends Et{constructor(e=new Ut,t=new Md){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Bs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(sa.fromBufferAttribute(h,e),a?Bs.addScaledVector(sa,u):Bs.addScaledVector(sa.sub(t),u))}t.add(Bs)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ns.copy(i.boundingSphere),Ns.applyMatrix4(r),Jn.copy(e.ray).recast(e.near),!(Ns.containsPoint(Jn.origin)===!1&&(Jn.intersectSphere(Ns,Ol)===null||Jn.origin.distanceToSquared(Ol)>(e.far-e.near)**2))&&(Fl.copy(r).invert(),Jn.copy(e.ray).applyMatrix4(Fl),!(i.boundingBox!==null&&Jn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Jn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=a[m.materialIndex],E=Math.max(m.start,f.start),b=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=E,A=b;M<A;M+=3){const T=o.getX(M),P=o.getX(M+1),_=o.getX(M+2);s=Vs(this,g,e,i,c,u,h,T,P,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const E=o.getX(m),b=o.getX(m+1),M=o.getX(m+2);s=Vs(this,a,e,i,c,u,h,E,b,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,v=d.length;p<v;p++){const m=d[p],g=a[m.materialIndex],E=Math.max(m.start,f.start),b=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let M=E,A=b;M<A;M+=3){const T=M,P=M+1,_=M+2;s=Vs(this,g,e,i,c,u,h,T,P,_),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const p=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=p,g=v;m<g;m+=3){const E=m,b=m+1,M=m+2;s=Vs(this,a,e,i,c,u,h,E,b,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function W_(n,e,t,i,s,r,a,o){let l;if(e.side===Vt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Wn,o),l===null)return null;ks.copy(o),ks.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ks);return c<t.near||c>t.far?null:{distance:c,point:ks.clone(),object:n}}function Vs(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Us),n.getVertexPosition(l,Fs),n.getVertexPosition(c,Os);const u=W_(n,e,t,i,Us,Fs,Os,Bl);if(u){const h=new O;en.getBarycoord(Bl,Us,Fs,Os,h),s&&(u.uv=en.getInterpolatedAttribute(s,o,l,c,h,new Le)),r&&(u.uv1=en.getInterpolatedAttribute(r,o,l,c,h,new Le)),a&&(u.normal=en.getInterpolatedAttribute(a,o,l,c,h,new O),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new O,materialIndex:0};en.getNormal(Us,Fs,Os,d.normal),u.face=d,u.barycoord=h}return u}class $_ extends Dt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Tt,u=Tt,h,d){super(null,a,o,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ra=new O,X_=new O,Y_=new Ne;class kn{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ra.subVectors(i,t).cross(X_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(ra),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Y_.getNormalMatrix(e),s=this.coplanarPoint(ra).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Qn=new xs,q_=new Le(.5,.5),zs=new O;class Do{constructor(e=new kn,t=new kn,i=new kn,s=new kn,r=new kn,a=new kn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=fn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],v=r[9],m=r[10],g=r[11],E=r[12],b=r[13],M=r[14],A=r[15];if(s[0].setComponents(c-a,f-u,g-p,A-E).normalize(),s[1].setComponents(c+a,f+u,g+p,A+E).normalize(),s[2].setComponents(c+o,f+h,g+v,A+b).normalize(),s[3].setComponents(c-o,f-h,g-v,A-b).normalize(),i)s[4].setComponents(l,d,m,M).normalize(),s[5].setComponents(c-l,f-d,g-m,A-M).normalize();else if(s[4].setComponents(c-l,f-d,g-m,A-M).normalize(),t===fn)s[5].setComponents(c+l,f+d,g+m,A+M).normalize();else if(t===us)s[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(e){Qn.center.set(0,0,0);const t=q_.distanceTo(e.center);return Qn.radius=.7071067811865476+t,Qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(zs.x=s.normal.x>0?e.max.x:e.min.x,zs.y=s.normal.y>0?e.max.y:e.min.y,zs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(zs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ar extends ci{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const xr=new O,vr=new O,kl=new st,Ji=new Tr,Gs=new xs,aa=new O,Vl=new O;class fo extends Et{constructor(e=new Ut,t=new Ar){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)xr.fromBufferAttribute(t,s-1),vr.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=xr.distanceTo(vr);e.setAttribute("lineDistance",new Nt(i,1))}else Ce("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Gs.copy(i.boundingSphere),Gs.applyMatrix4(s),Gs.radius+=r,e.ray.intersectsSphere(Gs)===!1)return;kl.copy(s).invert(),Ji.copy(e.ray).applyMatrix4(kl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let v=f,m=p-1;v<m;v+=c){const g=u.getX(v),E=u.getX(v+1),b=Hs(this,e,Ji,l,g,E,v);b&&t.push(b)}if(this.isLineLoop){const v=u.getX(p-1),m=u.getX(f),g=Hs(this,e,Ji,l,v,m,p-1);g&&t.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let v=f,m=p-1;v<m;v+=c){const g=Hs(this,e,Ji,l,v,v+1,v);g&&t.push(g)}if(this.isLineLoop){const v=Hs(this,e,Ji,l,p-1,f,p-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Hs(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(xr.fromBufferAttribute(o,s),vr.fromBufferAttribute(o,r),t.distanceSqToSegment(xr,vr,aa,Vl)>i)return;aa.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(aa);if(!(c<e.near||c>e.far))return{distance:c,point:Vl.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const zl=new O,Gl=new O;class Z_ extends fo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)zl.fromBufferAttribute(t,s),Gl.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+zl.distanceTo(Gl);e.setAttribute("lineDistance",new Nt(i,1))}else Ce("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Sd extends ci{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Hl=new st,po=new Tr,Ws=new xs,$s=new O;class Wl extends Et{constructor(e=new Ut,t=new Sd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ws.copy(i.boundingSphere),Ws.applyMatrix4(s),Ws.radius+=r,e.ray.intersectsSphere(Ws)===!1)return;Hl.copy(s).invert(),po.copy(e.ray).applyMatrix4(Hl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=d,v=f;p<v;p++){const m=c.getX(p);$s.fromBufferAttribute(h,m),$l($s,m,l,s,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let p=d,v=f;p<v;p++)$s.fromBufferAttribute(h,p),$l($s,p,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function $l(n,e,t,i,s,r,a){const o=po.distanceSqToPoint(n);if(o<t){const l=new O;po.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class yd extends Dt{constructor(e=[],t=ai,i,s,r,a,o,l,c,u){super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Oi extends Dt{constructor(e,t,i=_n,s,r,a,o=Tt,l=Tt,c,u=Cn,h=1){if(u!==Cn&&u!==si)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Io(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class K_ extends Oi{constructor(e,t=_n,i=ai,s,r,a=Tt,o=Tt,l,c=Cn){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,s,r,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Ed extends Dt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class vs extends Ut{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,i,t,e,a,r,0),p("z","y","x",1,-1,i,t,-e,a,r,1),p("x","z","y",1,1,e,i,t,s,a,2),p("x","z","y",1,-1,e,i,-t,s,a,3),p("x","y","z",1,-1,e,t,i,s,r,4),p("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Nt(c,3)),this.setAttribute("normal",new Nt(u,3)),this.setAttribute("uv",new Nt(h,2));function p(v,m,g,E,b,M,A,T,P,_,S){const C=M/P,R=A/_,I=M/2,H=A/2,W=T/2,N=P+1,Y=_+1;let k=0,J=0;const te=new O;for(let ie=0;ie<Y;ie++){const ce=ie*R-H;for(let fe=0;fe<N;fe++){const De=fe*C-I;te[v]=De*E,te[m]=ce*b,te[g]=W,c.push(te.x,te.y,te.z),te[v]=0,te[m]=0,te[g]=T>0?1:-1,u.push(te.x,te.y,te.z),h.push(fe/P),h.push(1-ie/_),k+=1}}for(let ie=0;ie<_;ie++)for(let ce=0;ce<P;ce++){const fe=d+ce+N*ie,De=d+ce+N*(ie+1),Oe=d+(ce+1)+N*(ie+1),Ve=d+(ce+1)+N*ie;l.push(fe,De,Ve),l.push(De,Oe,Ve),J+=6}o.addGroup(f,J,S),f+=J,d+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function J_(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=bd(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=n0(n,e,r,t)),n.length>80*t){o=n[0],l=n[1];let u=o,h=l;for(let d=t;d<s;d+=t){const f=n[d],p=n[d+1];f<o&&(o=f),p<l&&(l=p),f>u&&(u=f),p>h&&(h=p)}c=Math.max(u-o,h-l),c=c!==0?32767/c:0}return fs(r,a,t,o,l,c,0),a}function bd(n,e,t,i,s){let r;if(s===f0(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=Xl(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=Xl(a/i|0,n[a],n[a+1],r);return r&&Bi(r,r.next)&&(ms(r),r=r.next),r}function li(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Bi(t,t.next)||at(t.prev,t,t.next)===0)){if(ms(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function fs(n,e,t,i,s,r,a){if(!n)return;!a&&r&&o0(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?j_(n,i,s,r):Q_(n)){e.push(l.i,n.i,c.i),ms(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=e0(li(n),e),fs(n,e,t,i,s,r,2)):a===2&&t0(n,e,t,i,s,r):fs(li(n),e,t,i,s,r,1);break}}}function Q_(n){const e=n.prev,t=n,i=n.next;if(at(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,u=Math.min(s,r,a),h=Math.min(o,l,c),d=Math.max(s,r,a),f=Math.max(o,l,c);let p=i.next;for(;p!==e;){if(p.x>=u&&p.x<=d&&p.y>=h&&p.y<=f&&ss(s,o,r,l,a,c,p.x,p.y)&&at(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function j_(n,e,t,i){const s=n.prev,r=n,a=n.next;if(at(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,u=s.y,h=r.y,d=a.y,f=Math.min(o,l,c),p=Math.min(u,h,d),v=Math.max(o,l,c),m=Math.max(u,h,d),g=mo(f,p,e,t,i),E=mo(v,m,e,t,i);let b=n.prevZ,M=n.nextZ;for(;b&&b.z>=g&&M&&M.z<=E;){if(b.x>=f&&b.x<=v&&b.y>=p&&b.y<=m&&b!==s&&b!==a&&ss(o,u,l,h,c,d,b.x,b.y)&&at(b.prev,b,b.next)>=0||(b=b.prevZ,M.x>=f&&M.x<=v&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&ss(o,u,l,h,c,d,M.x,M.y)&&at(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;b&&b.z>=g;){if(b.x>=f&&b.x<=v&&b.y>=p&&b.y<=m&&b!==s&&b!==a&&ss(o,u,l,h,c,d,b.x,b.y)&&at(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;M&&M.z<=E;){if(M.x>=f&&M.x<=v&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&ss(o,u,l,h,c,d,M.x,M.y)&&at(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function e0(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Bi(i,s)&&Ad(i,t,t.next,s)&&ps(i,s)&&ps(s,i)&&(e.push(i.i,t.i,s.i),ms(t),ms(t.next),t=n=s),t=t.next}while(t!==n);return li(t)}function t0(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&d0(a,o)){let l=wd(a,o);a=li(a,a.next),l=li(l,l.next),fs(a,e,t,i,s,r,0),fs(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function n0(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=bd(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(c0(c))}s.sort(i0);for(let r=0;r<s.length;r++)t=s0(s[r],t);return t}function i0(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function s0(n,e){const t=r0(n,e);if(!t)return e;const i=wd(t,n);return li(i,i.next),li(t,t.next)}function r0(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(Bi(n,t))return t;do{if(Bi(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const h=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>r&&(r=h,a=t.x<t.next.x?t:t.next,h===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&Td(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const h=Math.abs(s-t.y)/(i-t.x);ps(t,n)&&(h<u||h===u&&(t.x>a.x||t.x===a.x&&a0(a,t)))&&(a=t,u=h)}t=t.next}while(t!==o);return a}function a0(n,e){return at(n.prev,n,e.prev)<0&&at(e.next,n,n.next)<0}function o0(n,e,t,i){let s=n;do s.z===0&&(s.z=mo(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,l0(s)}function l0(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function mo(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function c0(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Td(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function ss(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&Td(n,e,t,i,s,r,a,o)}function d0(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!u0(n,e)&&(ps(n,e)&&ps(e,n)&&h0(n,e)&&(at(n.prev,n,e.prev)||at(n,e.prev,e))||Bi(n,e)&&at(n.prev,n,n.next)>0&&at(e.prev,e,e.next)>0)}function at(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Bi(n,e){return n.x===e.x&&n.y===e.y}function Ad(n,e,t,i){const s=Ys(at(n,e,t)),r=Ys(at(n,e,i)),a=Ys(at(t,i,n)),o=Ys(at(t,i,e));return!!(s!==r&&a!==o||s===0&&Xs(n,t,e)||r===0&&Xs(n,i,e)||a===0&&Xs(t,n,i)||o===0&&Xs(t,e,i))}function Xs(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Ys(n){return n>0?1:n<0?-1:0}function u0(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Ad(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function ps(n,e){return at(n.prev,n,n.next)<0?at(n,e,n.next)>=0&&at(n,n.prev,e)>=0:at(n,e,n.prev)<0||at(n,n.next,e)<0}function h0(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function wd(n,e){const t=go(n.i,n.x,n.y),i=go(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function Xl(n,e,t,i){const s=go(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function ms(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function go(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function f0(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class p0{static triangulate(e,t,i=2){return J_(e,t,i)}}class No{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return No.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Yl(e),ql(i,e);let a=e.length;t.forEach(Yl);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,ql(i,t[l]);const o=p0.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Yl(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function ql(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class wr extends Ut{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,h=e/o,d=t/l,f=[],p=[],v=[],m=[];for(let g=0;g<u;g++){const E=g*d-a;for(let b=0;b<c;b++){const M=b*h-r;p.push(M,-E,0),v.push(0,0,1),m.push(b/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let E=0;E<o;E++){const b=E+c*g,M=E+c*(g+1),A=E+1+c*(g+1),T=E+1+c*g;f.push(b,M,T),f.push(M,A,T)}this.setIndex(f),this.setAttribute("position",new Nt(p,3)),this.setAttribute("normal",new Nt(v,3)),this.setAttribute("uv",new Nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wr(e.width,e.height,e.widthSegments,e.heightSegments)}}function ki(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Zl(s))s.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Zl(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Lt(n){const e={};for(let t=0;t<n.length;t++){const i=ki(n[t]);for(const s in i)e[s]=i[s]}return e}function Zl(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function m0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Rd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:He.workingColorSpace}const g0={clone:ki,merge:Lt};var _0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,x0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xn extends ci{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_0,this.fragmentShader=x0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ki(e.uniforms),this.uniformsGroups=m0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Ge().setHex(s.value);break;case"v2":this.uniforms[i].value=new Le().fromArray(s.value);break;case"v3":this.uniforms[i].value=new O().fromArray(s.value);break;case"v4":this.uniforms[i].value=new rt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Ne().fromArray(s.value);break;case"m4":this.uniforms[i].value=new st().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class v0 extends xn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class M0 extends ci{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ho,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class S0 extends ci{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class y0 extends ci{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ar extends Ar{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Cd extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const oa=new st,Kl=new O,Jl=new O;class E0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.mapType=$t,this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Do,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Kl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Kl),Jl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Jl),t.updateMatrixWorld(),oa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(oa,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===us||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(oa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const qs=new O,Zs=new $n,ln=new O;class Pd extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(qs,Zs,ln),ln.x===1&&ln.y===1&&ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(qs,Zs,ln.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(qs,Zs,ln),ln.x===1&&ln.y===1&&ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(qs,Zs,ln.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Bn=new O,Ql=new Le,jl=new Le;class Zt extends Pd{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=hs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return hs*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bn.x,Bn.y).multiplyScalar(-e/Bn.z)}getViewSize(e,t){return this.getViewBounds(e,Ql,jl),t.subVectors(jl,Ql)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(as*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Uo extends Pd{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class b0 extends E0{constructor(){super(new Uo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ec extends Cd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new b0}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class T0 extends Cd{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const bi=-90,Ti=1;class A0 extends Et{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Zt(bi,Ti,e,t);s.layers=this.layers,this.add(s);const r=new Zt(bi,Ti,e,t);r.layers=this.layers,this.add(r);const a=new Zt(bi,Ti,e,t);a.layers=this.layers,this.add(a);const o=new Zt(bi,Ti,e,t);o.layers=this.layers,this.add(o);const l=new Zt(bi,Ti,e,t);l.layers=this.layers,this.add(l);const c=new Zt(bi,Ti,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===fn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===us)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class w0 extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class tc{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const zo=class zo{constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};zo.prototype.isMatrix2=!0;let nc=zo;class R0 extends Z_{constructor(e=10,t=10,i=4473924,s=8947848){i=new Ge(i),s=new Ge(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let d=0,f=0,p=-o;d<=t;d++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);const v=d===r?i:s;v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3,v.toArray(c,f),f+=3}const u=new Ut;u.setAttribute("position",new Nt(l,3)),u.setAttribute("color",new Nt(c,3));const h=new Ar({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class C0 extends Yn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ce("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function ic(n,e,t,i){const s=P0(i);switch(t){case dd:return n*e;case hd:return n*e/s.components*s.byteLength;case To:return n*e/s.components*s.byteLength;case oi:return n*e*2/s.components*s.byteLength;case Ao:return n*e*2/s.components*s.byteLength;case ud:return n*e*3/s.components*s.byteLength;case tn:return n*e*4/s.components*s.byteLength;case wo:return n*e*4/s.components*s.byteLength;case nr:case ir:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case sr:case rr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fa:case Ba:return Math.max(n,16)*Math.max(e,8)/4;case Ua:case Oa:return Math.max(n,8)*Math.max(e,8)/2;case ka:case Va:case Ga:case Ha:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case za:case fr:case Wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case $a:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case qa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Za:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ja:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case eo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case to:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case no:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case io:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case so:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ro:case ao:case oo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case lo:case co:return Math.ceil(n/4)*Math.ceil(e/4)*8;case pr:case uo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function P0(n){switch(n){case $t:case ad:return{byteLength:1,components:1};case cs:case od:case Rn:return{byteLength:2,components:1};case Eo:case bo:return{byteLength:2,components:4};case _n:case yo:case hn:return{byteLength:4,components:1};case ld:case cd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:So}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=So);function Id(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function I0(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,o),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],v=h[f];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const v=h[f];n.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var L0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,D0=`#ifdef USE_ALPHAHASH
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
#endif`,N0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,U0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,F0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,O0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,B0=`#ifdef USE_AOMAP
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
#endif`,k0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,V0=`#ifdef USE_BATCHING
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
#endif`,z0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,G0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,H0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,W0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,$0=`#ifdef USE_IRIDESCENCE
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
#endif`,X0=`#ifdef USE_BUMPMAP
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
#endif`,Y0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,q0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Z0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,K0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,J0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Q0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,j0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ex=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,tx=`#define PI 3.141592653589793
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
} // validated`,nx=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ix=`vec3 transformedNormal = objectNormal;
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
#endif`,sx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,rx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ax=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ox=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lx="gl_FragColor = linearToOutputTexel( gl_FragColor );",cx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,dx=`#ifdef USE_ENVMAP
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
#endif`,ux=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hx=`#ifdef USE_ENVMAP
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
#endif`,fx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,px=`#ifdef USE_ENVMAP
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
#endif`,mx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_x=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vx=`#ifdef USE_GRADIENTMAP
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
}`,Mx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Sx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,yx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ex=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,bx=`#ifdef USE_ENVMAP
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
#endif`,Tx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ax=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Rx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cx=`PhysicalMaterial material;
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
#endif`,Px=`uniform sampler2D dfgLUT;
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
}`,Ix=`
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
#endif`,Lx=`#if defined( RE_IndirectDiffuse )
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
#endif`,Dx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Nx=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Ux=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ox=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Gx=`#if defined( USE_POINTS_UV )
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
#endif`,Hx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,$x=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Yx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qx=`#ifdef USE_MORPHTARGETS
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
#endif`,Zx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Jx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Qx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ev=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,tv=`#ifdef USE_NORMALMAP
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
#endif`,nv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,iv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,sv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,av=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ov=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,lv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,cv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,uv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,pv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,gv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,_v=`float getShadowMask() {
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
}`,xv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,vv=`#ifdef USE_SKINNING
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
#endif`,Mv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sv=`#ifdef USE_SKINNING
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
#endif`,yv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ev=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,bv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Av=`#ifdef USE_TRANSMISSION
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
#endif`,wv=`#ifdef USE_TRANSMISSION
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
#endif`,Rv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Iv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Lv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Dv=`uniform sampler2D t2D;
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
}`,Nv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Uv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Fv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ov=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bv=`#include <common>
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
}`,kv=`#if DEPTH_PACKING == 3200
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
}`,Vv=`#define DISTANCE
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
}`,zv=`#define DISTANCE
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
}`,Gv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Hv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wv=`uniform float scale;
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
}`,$v=`uniform vec3 diffuse;
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
}`,Xv=`#include <common>
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
}`,Yv=`uniform vec3 diffuse;
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
}`,qv=`#define LAMBERT
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
}`,Zv=`#define LAMBERT
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
}`,Kv=`#define MATCAP
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
}`,Jv=`#define MATCAP
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
}`,Qv=`#define NORMAL
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
}`,jv=`#define NORMAL
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
}`,eM=`#define PHONG
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
}`,tM=`#define PHONG
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
}`,nM=`#define STANDARD
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
}`,iM=`#define STANDARD
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
}`,sM=`#define TOON
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
}`,rM=`#define TOON
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
}`,aM=`uniform float size;
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
}`,oM=`uniform vec3 diffuse;
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
}`,lM=`#include <common>
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
}`,cM=`uniform vec3 color;
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
}`,dM=`uniform float rotation;
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
}`,uM=`uniform vec3 diffuse;
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
}`,Be={alphahash_fragment:L0,alphahash_pars_fragment:D0,alphamap_fragment:N0,alphamap_pars_fragment:U0,alphatest_fragment:F0,alphatest_pars_fragment:O0,aomap_fragment:B0,aomap_pars_fragment:k0,batching_pars_vertex:V0,batching_vertex:z0,begin_vertex:G0,beginnormal_vertex:H0,bsdfs:W0,iridescence_fragment:$0,bumpmap_pars_fragment:X0,clipping_planes_fragment:Y0,clipping_planes_pars_fragment:q0,clipping_planes_pars_vertex:Z0,clipping_planes_vertex:K0,color_fragment:J0,color_pars_fragment:Q0,color_pars_vertex:j0,color_vertex:ex,common:tx,cube_uv_reflection_fragment:nx,defaultnormal_vertex:ix,displacementmap_pars_vertex:sx,displacementmap_vertex:rx,emissivemap_fragment:ax,emissivemap_pars_fragment:ox,colorspace_fragment:lx,colorspace_pars_fragment:cx,envmap_fragment:dx,envmap_common_pars_fragment:ux,envmap_pars_fragment:hx,envmap_pars_vertex:fx,envmap_physical_pars_fragment:bx,envmap_vertex:px,fog_vertex:mx,fog_pars_vertex:gx,fog_fragment:_x,fog_pars_fragment:xx,gradientmap_pars_fragment:vx,lightmap_pars_fragment:Mx,lights_lambert_fragment:Sx,lights_lambert_pars_fragment:yx,lights_pars_begin:Ex,lights_toon_fragment:Tx,lights_toon_pars_fragment:Ax,lights_phong_fragment:wx,lights_phong_pars_fragment:Rx,lights_physical_fragment:Cx,lights_physical_pars_fragment:Px,lights_fragment_begin:Ix,lights_fragment_maps:Lx,lights_fragment_end:Dx,lightprobes_pars_fragment:Nx,logdepthbuf_fragment:Ux,logdepthbuf_pars_fragment:Fx,logdepthbuf_pars_vertex:Ox,logdepthbuf_vertex:Bx,map_fragment:kx,map_pars_fragment:Vx,map_particle_fragment:zx,map_particle_pars_fragment:Gx,metalnessmap_fragment:Hx,metalnessmap_pars_fragment:Wx,morphinstance_vertex:$x,morphcolor_vertex:Xx,morphnormal_vertex:Yx,morphtarget_pars_vertex:qx,morphtarget_vertex:Zx,normal_fragment_begin:Kx,normal_fragment_maps:Jx,normal_pars_fragment:Qx,normal_pars_vertex:jx,normal_vertex:ev,normalmap_pars_fragment:tv,clearcoat_normal_fragment_begin:nv,clearcoat_normal_fragment_maps:iv,clearcoat_pars_fragment:sv,iridescence_pars_fragment:rv,opaque_fragment:av,packing:ov,premultiplied_alpha_fragment:lv,project_vertex:cv,dithering_fragment:dv,dithering_pars_fragment:uv,roughnessmap_fragment:hv,roughnessmap_pars_fragment:fv,shadowmap_pars_fragment:pv,shadowmap_pars_vertex:mv,shadowmap_vertex:gv,shadowmask_pars_fragment:_v,skinbase_vertex:xv,skinning_pars_vertex:vv,skinning_vertex:Mv,skinnormal_vertex:Sv,specularmap_fragment:yv,specularmap_pars_fragment:Ev,tonemapping_fragment:bv,tonemapping_pars_fragment:Tv,transmission_fragment:Av,transmission_pars_fragment:wv,uv_pars_fragment:Rv,uv_pars_vertex:Cv,uv_vertex:Pv,worldpos_vertex:Iv,background_vert:Lv,background_frag:Dv,backgroundCube_vert:Nv,backgroundCube_frag:Uv,cube_vert:Fv,cube_frag:Ov,depth_vert:Bv,depth_frag:kv,distance_vert:Vv,distance_frag:zv,equirect_vert:Gv,equirect_frag:Hv,linedashed_vert:Wv,linedashed_frag:$v,meshbasic_vert:Xv,meshbasic_frag:Yv,meshlambert_vert:qv,meshlambert_frag:Zv,meshmatcap_vert:Kv,meshmatcap_frag:Jv,meshnormal_vert:Qv,meshnormal_frag:jv,meshphong_vert:eM,meshphong_frag:tM,meshphysical_vert:nM,meshphysical_frag:iM,meshtoon_vert:sM,meshtoon_frag:rM,points_vert:aM,points_frag:oM,shadow_vert:lM,shadow_frag:cM,sprite_vert:dM,sprite_frag:uM},me={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new O},probesMax:{value:new O},probesResolution:{value:new O}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},dn={basic:{uniforms:Lt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:Lt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ge(0)},envMapIntensity:{value:1}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:Lt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:Lt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:Lt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:Lt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:Lt([me.points,me.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:Lt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:Lt([me.common,me.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:Lt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:Lt([me.sprite,me.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distance:{uniforms:Lt([me.common,me.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distance_vert,fragmentShader:Be.distance_frag},shadow:{uniforms:Lt([me.lights,me.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};dn.physical={uniforms:Lt([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const Ks={r:0,b:0,g:0},hM=new st,Ld=new Ne;Ld.set(-1,0,0,0,1,0,0,0,1);function fM(n,e,t,i,s,r){const a=new Ge(0);let o=s===!0?0:1,l,c,u=null,h=0,d=null;function f(E){let b=E.isScene===!0?E.background:null;if(b&&b.isTexture){const M=E.backgroundBlurriness>0;b=e.get(b,M)}return b}function p(E){let b=!1;const M=f(E);M===null?m(a,o):M&&M.isColor&&(m(M,1),b=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(E,b){const M=f(b);M&&(M.isCubeTexture||M.mapping===br)?(c===void 0&&(c=new nn(new vs(1,1,1),new xn({name:"BackgroundCubeMaterial",uniforms:ki(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,T,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(hM.makeRotationFromEuler(b.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ld),c.material.toneMapped=He.getTransfer(M.colorSpace)!==Ze,(u!==M||h!==M.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=M,h=M.version,d=n.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new nn(new wr(2,2),new xn({name:"BackgroundMaterial",uniforms:ki(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=He.getTransfer(M.colorSpace)!==Ze,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||h!==M.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,h=M.version,d=n.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function m(E,b){E.getRGB(Ks,Rd(n)),t.buffers.color.setClear(Ks.r,Ks.g,Ks.b,b,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,b=1){a.set(E),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(E){o=E,m(a,o)},render:p,addToRenderList:v,dispose:g}}function pM(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(R,I,H,W,N){let Y=!1;const k=h(R,W,H,I);r!==k&&(r=k,c(r.object)),Y=f(R,W,H,N),Y&&p(R,W,H,N),N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,M(R,I,H,W),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function u(R){return n.deleteVertexArray(R)}function h(R,I,H,W){const N=W.wireframe===!0;let Y=i[I.id];Y===void 0&&(Y={},i[I.id]=Y);const k=R.isInstancedMesh===!0?R.id:0;let J=Y[k];J===void 0&&(J={},Y[k]=J);let te=J[H.id];te===void 0&&(te={},J[H.id]=te);let ie=te[N];return ie===void 0&&(ie=d(l()),te[N]=ie),ie}function d(R){const I=[],H=[],W=[];for(let N=0;N<t;N++)I[N]=0,H[N]=0,W[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:H,attributeDivisors:W,object:R,attributes:{},index:null}}function f(R,I,H,W){const N=r.attributes,Y=I.attributes;let k=0;const J=H.getAttributes();for(const te in J)if(J[te].location>=0){const ce=N[te];let fe=Y[te];if(fe===void 0&&(te==="instanceMatrix"&&R.instanceMatrix&&(fe=R.instanceMatrix),te==="instanceColor"&&R.instanceColor&&(fe=R.instanceColor)),ce===void 0||ce.attribute!==fe||fe&&ce.data!==fe.data)return!0;k++}return r.attributesNum!==k||r.index!==W}function p(R,I,H,W){const N={},Y=I.attributes;let k=0;const J=H.getAttributes();for(const te in J)if(J[te].location>=0){let ce=Y[te];ce===void 0&&(te==="instanceMatrix"&&R.instanceMatrix&&(ce=R.instanceMatrix),te==="instanceColor"&&R.instanceColor&&(ce=R.instanceColor));const fe={};fe.attribute=ce,ce&&ce.data&&(fe.data=ce.data),N[te]=fe,k++}r.attributes=N,r.attributesNum=k,r.index=W}function v(){const R=r.newAttributes;for(let I=0,H=R.length;I<H;I++)R[I]=0}function m(R){g(R,0)}function g(R,I){const H=r.newAttributes,W=r.enabledAttributes,N=r.attributeDivisors;H[R]=1,W[R]===0&&(n.enableVertexAttribArray(R),W[R]=1),N[R]!==I&&(n.vertexAttribDivisor(R,I),N[R]=I)}function E(){const R=r.newAttributes,I=r.enabledAttributes;for(let H=0,W=I.length;H<W;H++)I[H]!==R[H]&&(n.disableVertexAttribArray(H),I[H]=0)}function b(R,I,H,W,N,Y,k){k===!0?n.vertexAttribIPointer(R,I,H,N,Y):n.vertexAttribPointer(R,I,H,W,N,Y)}function M(R,I,H,W){v();const N=W.attributes,Y=H.getAttributes(),k=I.defaultAttributeValues;for(const J in Y){const te=Y[J];if(te.location>=0){let ie=N[J];if(ie===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(ie=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(ie=R.instanceColor)),ie!==void 0){const ce=ie.normalized,fe=ie.itemSize,De=e.get(ie);if(De===void 0)continue;const Oe=De.buffer,Ve=De.type,K=De.bytesPerElement,$=Ve===n.INT||Ve===n.UNSIGNED_INT||ie.gpuType===yo;if(ie.isInterleavedBufferAttribute){const F=ie.data,ne=F.stride,se=ie.offset;if(F.isInstancedInterleavedBuffer){for(let re=0;re<te.locationSize;re++)g(te.location+re,F.meshPerAttribute);R.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let re=0;re<te.locationSize;re++)m(te.location+re);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let re=0;re<te.locationSize;re++)b(te.location+re,fe/te.locationSize,Ve,ce,ne*K,(se+fe/te.locationSize*re)*K,$)}else{if(ie.isInstancedBufferAttribute){for(let F=0;F<te.locationSize;F++)g(te.location+F,ie.meshPerAttribute);R.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let F=0;F<te.locationSize;F++)m(te.location+F);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let F=0;F<te.locationSize;F++)b(te.location+F,fe/te.locationSize,Ve,ce,fe*K,fe/te.locationSize*F*K,$)}}else if(k!==void 0){const ce=k[J];if(ce!==void 0)switch(ce.length){case 2:n.vertexAttrib2fv(te.location,ce);break;case 3:n.vertexAttrib3fv(te.location,ce);break;case 4:n.vertexAttrib4fv(te.location,ce);break;default:n.vertexAttrib1fv(te.location,ce)}}}}E()}function A(){S();for(const R in i){const I=i[R];for(const H in I){const W=I[H];for(const N in W){const Y=W[N];for(const k in Y)u(Y[k].object),delete Y[k];delete W[N]}}delete i[R]}}function T(R){if(i[R.id]===void 0)return;const I=i[R.id];for(const H in I){const W=I[H];for(const N in W){const Y=W[N];for(const k in Y)u(Y[k].object),delete Y[k];delete W[N]}}delete i[R.id]}function P(R){for(const I in i){const H=i[I];for(const W in H){const N=H[W];if(N[R.id]===void 0)continue;const Y=N[R.id];for(const k in Y)u(Y[k].object),delete Y[k];delete N[R.id]}}}function _(R){for(const I in i){const H=i[I],W=R.isInstancedMesh===!0?R.id:0,N=H[W];if(N!==void 0){for(const Y in N){const k=N[Y];for(const J in k)u(k[J].object),delete k[J];delete N[Y]}delete H[W],Object.keys(H).length===0&&delete i[I]}}}function S(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:S,resetDefaultState:C,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:m,disableUnusedAttributes:E}}function mM(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];t.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function gM(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==tn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const _=P===Rn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==$t&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==hn&&!_)}function l(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Ce("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:E,maxVaryings:b,maxFragmentUniforms:M,maxSamples:A,samples:T}}function _M(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new kn,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||s;return s=d,i=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,g=n.get(h);if(!s||p===null||p.length===0||r&&!m)r?u(null):c();else{const E=r?0:i,b=E*4;let M=g.clippingState||null;l.value=M,M=u(p,d,b,f);for(let A=0;A!==b;++A)M[A]=t[A];g.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,p){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,p!==!0||m===null){const g=f+v*4,E=d.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<g)&&(m=new Float32Array(g));for(let b=0,M=f;b!==v;++b,M+=4)a.copy(h[b]).applyMatrix4(E,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}const zn=4,sc=[.125,.215,.35,.446,.526,.582],ti=20,xM=256,Qi=new Uo,rc=new Ge;let la=null,ca=0,da=0,ua=!1;const vM=new O;class ac{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=vM}=r;la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),da=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(la,ca,da),this._renderer.xr.enabled=ua,e.scissorTest=!1,Ai(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ai||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),la=this._renderer.getRenderTarget(),ca=this._renderer.getActiveCubeFace(),da=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Pt,minFilter:Pt,generateMipmaps:!1,type:Rn,format:tn,colorSpace:mr,depthBuffer:!1},s=oc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=oc(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=MM(r)),this._blurMaterial=yM(r,e,t),this._ggxMaterial=SM(r,e,t)}return s}_compileMaterial(e){const t=new nn(new Ut,e);this._renderer.compile(t,Qi)}_sceneToCubeUV(e,t,i,s,r){const l=new Zt(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(rc),h.toneMapping=pn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new nn(new vs,new Md({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let g=!1;const E=e.background;E?E.isColor&&(m.color.copy(E),e.background=null,g=!0):(m.color.copy(rc),g=!0);for(let b=0;b<6;b++){const M=b%3;M===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[b],r.y,r.z)):M===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[b]));const A=this._cubeSize;Ai(s,M*A,b>2?A:0,A,A),h.setRenderTarget(s),g&&h.render(v,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=E}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===ai||e.mapping===Fi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=cc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Ai(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Qi)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,f=h*d,{_lodMax:p}=this,v=this._sizeLods[i],m=3*v*(i>p-zn?i-p+zn:0),g=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,Ai(r,m,g,3*v,2*v),s.setRenderTarget(r),s.render(o,Qi),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-i,Ai(e,m,g,3*v,2*v),s.setRenderTarget(e),s.render(o,Qi)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Xe("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[s];h.material=c;const d=c.uniforms,f=this._sizeLods[i]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ti-1),v=r/p,m=isFinite(r)?1+Math.floor(u*v):ti;m>ti&&Ce(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ti}`);const g=[];let E=0;for(let P=0;P<ti;++P){const _=P/v,S=Math.exp(-_*_/2);g.push(S),P===0?E+=S:P<m&&(E+=2*S)}for(let P=0;P<g.length;P++)g[P]=g[P]/E;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:b}=this;d.dTheta.value=p,d.mipInt.value=b-i;const M=this._sizeLods[s],A=3*M*(s>b-zn?s-b+zn:0),T=4*(this._cubeSize-M);Ai(t,A,T,3*M,2*M),l.setRenderTarget(t),l.render(h,Qi)}}function MM(n){const e=[],t=[],i=[];let s=n;const r=n-zn+1+sc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-zn?l=sc[a-n+zn-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,v=3,m=2,g=1,E=new Float32Array(v*p*f),b=new Float32Array(m*p*f),M=new Float32Array(g*p*f);for(let T=0;T<f;T++){const P=T%3*2/3-1,_=T>2?0:-1,S=[P,_,0,P+2/3,_,0,P+2/3,_+1,0,P,_,0,P+2/3,_+1,0,P,_+1,0];E.set(S,v*p*T),b.set(d,m*p*T);const C=[T,T,T,T,T,T];M.set(C,g*p*T)}const A=new Ut;A.setAttribute("position",new gn(E,v)),A.setAttribute("uv",new gn(b,m)),A.setAttribute("faceIndex",new gn(M,g)),i.push(new nn(A,null)),s>zn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function oc(n,e,t){const i=new mn(n,e,t);return i.texture.mapping=br,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ai(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function SM(n,e,t){return new xn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:xM,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Rr(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function yM(n,e,t){const i=new Float32Array(ti),s=new O(0,1,0);return new xn({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Rr(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function lc(){return new xn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Rr(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function cc(){return new xn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Rr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Rr(){return`

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
	`}class Dd extends mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new yd(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new vs(5,5,5),r=new xn({name:"CubemapFromEquirect",uniforms:ki(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Vt,blending:An});r.uniforms.tEquirect.value=t;const a=new nn(s,r),o=t.minFilter;return t.minFilter===ii&&(t.minFilter=Pt),new A0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}function EM(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Ur||f===Fr)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const v=new Dd(p.height);return v.fromEquirectangularTexture(n,d),e.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===Ur||f===Fr,v=f===ai||f===Fi;if(p||v){let m=t.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new ac(n)),m=p?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const E=d.image;return p&&E&&E.height>0||v&&E&&l(E)?(i===null&&(i=new ac(n)),m=p?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function o(d,f){return f===Ur?d.mapping=ai:f===Fr&&(d.mapping=Fi),d}function l(d){let f=0;const p=6;for(let v=0;v<p;v++)d[v]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(d){const f=d.target;f.removeEventListener("dispose",u);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function bM(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ii("WebGLRenderer: "+i+" extension not supported."),s}}}function TM(n,e,t,i){const s={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,p=h.attributes.position;let v=0;if(p===void 0)return;if(f!==null){const E=f.array;v=f.version;for(let b=0,M=E.length;b<M;b+=3){const A=E[b+0],T=E[b+1],P=E[b+2];d.push(A,T,T,P,P,A)}}else{const E=p.array;v=p.version;for(let b=0,M=E.length/3-1;b<M;b+=3){const A=b+0,T=b+1,P=b+2;d.push(A,T,T,P,P,A)}}const m=new(p.count>=65535?vd:xd)(d,1);m.version=v;const g=r.get(h);g&&e.remove(g),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function AM(n,e,t){let i;function s(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,d){n.drawElements(i,d,r,h*a),t.update(d,i,1)}function c(h,d,f){f!==0&&(n.drawElementsInstanced(i,d,r,h*a,f),t.update(d,i,f))}function u(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,h,0,f);let v=0;for(let m=0;m<f;m++)v+=d[m];t.update(v,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function wM(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Xe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function RM(n,e,t){const i=new WeakMap,s=new rt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let S=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let b=0;f===!0&&(b=1),p===!0&&(b=2),v===!0&&(b=3);let M=o.attributes.position.count*b,A=1;M>e.maxTextureSize&&(A=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const T=new Float32Array(M*A*4*h),P=new md(T,M,A,h);P.type=hn,P.needsUpdate=!0;const _=b*4;for(let C=0;C<h;C++){const R=m[C],I=g[C],H=E[C],W=M*A*4*C;for(let N=0;N<R.count;N++){const Y=N*_;f===!0&&(s.fromBufferAttribute(R,N),T[W+Y+0]=s.x,T[W+Y+1]=s.y,T[W+Y+2]=s.z,T[W+Y+3]=0),p===!0&&(s.fromBufferAttribute(I,N),T[W+Y+4]=s.x,T[W+Y+5]=s.y,T[W+Y+6]=s.z,T[W+Y+7]=0),v===!0&&(s.fromBufferAttribute(H,N),T[W+Y+8]=s.x,T[W+Y+9]=s.y,T[W+Y+10]=s.z,T[W+Y+11]=H.itemSize===4?s.w:1)}}d={count:h,texture:P,size:new Le(M,A)},i.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function CM(n,e,t,i,s){let r=new WeakMap;function a(c){const u=s.render.frame,h=c.geometry,d=e.get(c,h);if(r.get(d)!==u&&(e.update(d),r.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const PM={[Qc]:"LINEAR_TONE_MAPPING",[jc]:"REINHARD_TONE_MAPPING",[ed]:"CINEON_TONE_MAPPING",[td]:"ACES_FILMIC_TONE_MAPPING",[id]:"AGX_TONE_MAPPING",[sd]:"NEUTRAL_TONE_MAPPING",[nd]:"CUSTOM_TONE_MAPPING"};function IM(n,e,t,i,s,r){const a=new mn(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,depthTexture:s?new Oi(e,t):void 0}),o=new mn(e,t,{type:Rn,depthBuffer:!1,stencilBuffer:!1}),l=new Ut;l.setAttribute("position",new Nt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Nt([0,2,0,0,2,0],2));const c=new v0({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new nn(l,c),h=new Uo(-1,1,1,-1,0,1);let d=null,f=null,p=!1,v,m=null,g=[],E=!1;this.setSize=function(b,M){a.setSize(b,M),o.setSize(b,M);for(let A=0;A<g.length;A++){const T=g[A];T.setSize&&T.setSize(b,M)}},this.setEffects=function(b){g=b,E=g.length>0&&g[0].isRenderPass===!0;const M=a.width,A=a.height;for(let T=0;T<g.length;T++){const P=g[T];P.setSize&&P.setSize(M,A)}},this.begin=function(b,M){if(p||b.toneMapping===pn&&g.length===0)return!1;if(m=M,M!==null){const A=M.width,T=M.height;(a.width!==A||a.height!==T)&&this.setSize(A,T)}return E===!1&&b.setRenderTarget(a),v=b.toneMapping,b.toneMapping=pn,!0},this.hasRenderPass=function(){return E},this.end=function(b,M){b.toneMapping=v,p=!0;let A=a,T=o;for(let P=0;P<g.length;P++){const _=g[P];if(_.enabled!==!1&&(_.render(b,T,A,M),_.needsSwap!==!1)){const S=A;A=T,T=S}}if(d!==b.outputColorSpace||f!==b.toneMapping){d=b.outputColorSpace,f=b.toneMapping,c.defines={},He.getTransfer(d)===Ze&&(c.defines.SRGB_TRANSFER="");const P=PM[f];P&&(c.defines[P]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,b.setRenderTarget(m),b.render(u,h),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Nd=new Dt,_o=new Oi(1,1),Ud=new md,Fd=new I_,Od=new yd,dc=[],uc=[],hc=new Float32Array(16),fc=new Float32Array(9),pc=new Float32Array(4);function Gi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=dc[s];if(r===void 0&&(r=new Float32Array(s),dc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function vt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Mt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Cr(n,e){let t=uc[e];t===void 0&&(t=new Int32Array(e),uc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function LM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function DM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2fv(this.addr,e),Mt(t,e)}}function NM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vt(t,e))return;n.uniform3fv(this.addr,e),Mt(t,e)}}function UM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4fv(this.addr,e),Mt(t,e)}}function FM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,i))return;pc.set(i),n.uniformMatrix2fv(this.addr,!1,pc),Mt(t,i)}}function OM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,i))return;fc.set(i),n.uniformMatrix3fv(this.addr,!1,fc),Mt(t,i)}}function BM(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,i))return;hc.set(i),n.uniformMatrix4fv(this.addr,!1,hc),Mt(t,i)}}function kM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function VM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2iv(this.addr,e),Mt(t,e)}}function zM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3iv(this.addr,e),Mt(t,e)}}function GM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4iv(this.addr,e),Mt(t,e)}}function HM(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function WM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2uiv(this.addr,e),Mt(t,e)}}function $M(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3uiv(this.addr,e),Mt(t,e)}}function XM(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4uiv(this.addr,e),Mt(t,e)}}function YM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(_o.compareFunction=t.isReversedDepthBuffer()?Co:Ro,r=_o):r=Nd,t.setTexture2D(e||r,s)}function qM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Fd,s)}function ZM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Od,s)}function KM(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Ud,s)}function JM(n){switch(n){case 5126:return LM;case 35664:return DM;case 35665:return NM;case 35666:return UM;case 35674:return FM;case 35675:return OM;case 35676:return BM;case 5124:case 35670:return kM;case 35667:case 35671:return VM;case 35668:case 35672:return zM;case 35669:case 35673:return GM;case 5125:return HM;case 36294:return WM;case 36295:return $M;case 36296:return XM;case 35678:case 36198:case 36298:case 36306:case 35682:return YM;case 35679:case 36299:case 36307:return qM;case 35680:case 36300:case 36308:case 36293:return ZM;case 36289:case 36303:case 36311:case 36292:return KM}}function QM(n,e){n.uniform1fv(this.addr,e)}function jM(n,e){const t=Gi(e,this.size,2);n.uniform2fv(this.addr,t)}function eS(n,e){const t=Gi(e,this.size,3);n.uniform3fv(this.addr,t)}function tS(n,e){const t=Gi(e,this.size,4);n.uniform4fv(this.addr,t)}function nS(n,e){const t=Gi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function iS(n,e){const t=Gi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function sS(n,e){const t=Gi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function rS(n,e){n.uniform1iv(this.addr,e)}function aS(n,e){n.uniform2iv(this.addr,e)}function oS(n,e){n.uniform3iv(this.addr,e)}function lS(n,e){n.uniform4iv(this.addr,e)}function cS(n,e){n.uniform1uiv(this.addr,e)}function dS(n,e){n.uniform2uiv(this.addr,e)}function uS(n,e){n.uniform3uiv(this.addr,e)}function hS(n,e){n.uniform4uiv(this.addr,e)}function fS(n,e,t){const i=this.cache,s=e.length,r=Cr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=_o:a=Nd;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function pS(n,e,t){const i=this.cache,s=e.length,r=Cr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Fd,r[a])}function mS(n,e,t){const i=this.cache,s=e.length,r=Cr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Od,r[a])}function gS(n,e,t){const i=this.cache,s=e.length,r=Cr(t,s);vt(i,r)||(n.uniform1iv(this.addr,r),Mt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Ud,r[a])}function _S(n){switch(n){case 5126:return QM;case 35664:return jM;case 35665:return eS;case 35666:return tS;case 35674:return nS;case 35675:return iS;case 35676:return sS;case 5124:case 35670:return rS;case 35667:case 35671:return aS;case 35668:case 35672:return oS;case 35669:case 35673:return lS;case 5125:return cS;case 36294:return dS;case 36295:return uS;case 36296:return hS;case 35678:case 36198:case 36298:case 36306:case 35682:return fS;case 35679:case 36299:case 36307:return pS;case 35680:case 36300:case 36308:case 36293:return mS;case 36289:case 36303:case 36311:case 36292:return gS}}class xS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=JM(t.type)}}class vS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=_S(t.type)}}class MS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const ha=/(\w+)(\])?(\[|\.)?/g;function mc(n,e){n.seq.push(e),n.map[e.id]=e}function SS(n,e,t){const i=n.name,s=i.length;for(ha.lastIndex=0;;){const r=ha.exec(i),a=ha.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){mc(t,c===void 0?new xS(o,n,e):new vS(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new MS(o),mc(t,h)),t=h}}}class or{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);SS(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function gc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const yS=37297;let ES=0;function bS(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const _c=new Ne;function TS(n){He._getMatrix(_c,He.workingColorSpace,n);const e=`mat3( ${_c.elements.map(t=>t.toFixed(4))} )`;switch(He.getTransfer(n)){case gr:return[e,"LinearTransferOETF"];case Ze:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function xc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+bS(n.getShaderSource(e),o)}else return r}function AS(n,e){const t=TS(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const wS={[Qc]:"Linear",[jc]:"Reinhard",[ed]:"Cineon",[td]:"ACESFilmic",[id]:"AgX",[sd]:"Neutral",[nd]:"Custom"};function RS(n,e){const t=wS[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Js=new O;function CS(){He.getLuminanceCoefficients(Js);const n=Js.x.toFixed(4),e=Js.y.toFixed(4),t=Js.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function PS(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rs).join(`
`)}function IS(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function LS(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function rs(n){return n!==""}function vc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Mc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const DS=/^[ \t]*#include +<([\w\d./]+)>/gm;function xo(n){return n.replace(DS,US)}const NS=new Map;function US(n,e){let t=Be[e];if(t===void 0){const i=NS.get(e);if(i!==void 0)t=Be[i],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return xo(t)}const FS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sc(n){return n.replace(FS,OS)}function OS(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function yc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const BS={[tr]:"SHADOWMAP_TYPE_PCF",[ns]:"SHADOWMAP_TYPE_VSM"};function kS(n){return BS[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const VS={[ai]:"ENVMAP_TYPE_CUBE",[Fi]:"ENVMAP_TYPE_CUBE",[br]:"ENVMAP_TYPE_CUBE_UV"};function zS(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":VS[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const GS={[Fi]:"ENVMAP_MODE_REFRACTION"};function HS(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":GS[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const WS={[Jc]:"ENVMAP_BLENDING_MULTIPLY",[Zg]:"ENVMAP_BLENDING_MIX",[Kg]:"ENVMAP_BLENDING_ADD"};function $S(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":WS[n.combine]||"ENVMAP_BLENDING_NONE"}function XS(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function YS(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=kS(t),c=zS(t),u=HS(t),h=$S(t),d=XS(t),f=PS(t),p=IS(r),v=s.createProgram();let m,g,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(rs).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(rs).join(`
`),g.length>0&&(g+=`
`)):(m=[yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),g=[yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==pn?"#define TONE_MAPPING":"",t.toneMapping!==pn?Be.tonemapping_pars_fragment:"",t.toneMapping!==pn?RS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,AS("linearToOutputTexel",t.outputColorSpace),CS(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(rs).join(`
`)),a=xo(a),a=vc(a,t),a=Mc(a,t),o=xo(o),o=vc(o,t),o=Mc(o,t),a=Sc(a),o=Sc(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===Sl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Sl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const b=E+m+a,M=E+g+o,A=gc(s,s.VERTEX_SHADER,b),T=gc(s,s.FRAGMENT_SHADER,M);s.attachShader(v,A),s.attachShader(v,T),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(R){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(v)||"",H=s.getShaderInfoLog(A)||"",W=s.getShaderInfoLog(T)||"",N=I.trim(),Y=H.trim(),k=W.trim();let J=!0,te=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(J=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,A,T);else{const ie=xc(s,A,"vertex"),ce=xc(s,T,"fragment");Xe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+N+`
`+ie+`
`+ce)}else N!==""?Ce("WebGLProgram: Program Info Log:",N):(Y===""||k==="")&&(te=!1);te&&(R.diagnostics={runnable:J,programLog:N,vertexShader:{log:Y,prefix:m},fragmentShader:{log:k,prefix:g}})}s.deleteShader(A),s.deleteShader(T),_=new or(s,v),S=LS(s,v)}let _;this.getUniforms=function(){return _===void 0&&P(this),_};let S;this.getAttributes=function(){return S===void 0&&P(this),S};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(v,yS)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ES++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=T,this}let qS=0;class ZS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new KS(e),t.set(e,i)),i}}class KS{constructor(e){this.id=qS++,this.code=e,this.usedTimes=0}}function JS(n){return n===oi||n===fr||n===pr}function QS(n,e,t,i,s,r){const a=new gd,o=new ZS,l=new Set,c=[],u=new Map,h=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(_){return l.add(_),_===0?"uv":`uv${_}`}function v(_,S,C,R,I,H){const W=R.fog,N=I.geometry,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?R.environment:null,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,J=e.get(_.envMap||Y,k),te=J&&J.mapping===br?J.image.height:null,ie=f[_.type];_.precision!==null&&(d=i.getMaxPrecision(_.precision),d!==_.precision&&Ce("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));const ce=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,fe=ce!==void 0?ce.length:0;let De=0;N.morphAttributes.position!==void 0&&(De=1),N.morphAttributes.normal!==void 0&&(De=2),N.morphAttributes.color!==void 0&&(De=3);let Oe,Ve,K,$;if(ie){const Se=dn[ie];Oe=Se.vertexShader,Ve=Se.fragmentShader}else{Oe=_.vertexShader,Ve=_.fragmentShader;const Se=o.getVertexShaderStage(_),lt=o.getFragmentShaderStage(_);o.update(_,Se,lt),K=Se.id,$=lt.id}const F=n.getRenderTarget(),ne=n.state.buffers.depth.getReversed(),se=I.isInstancedMesh===!0,re=I.isBatchedMesh===!0,Pe=!!_.map,Re=!!_.matcap,Qe=!!J,Ye=!!_.aoMap,We=!!_.lightMap,pt=!!_.bumpMap&&_.wireframe===!1,_t=!!_.normalMap,St=!!_.displacementMap,bt=!!_.emissiveMap,ot=!!_.metalnessMap,mt=!!_.roughnessMap,D=_.anisotropy>0,Ft=_.clearcoat>0,qe=_.dispersion>0,w=_.iridescence>0,x=_.sheen>0,B=_.transmission>0,G=D&&!!_.anisotropyMap,q=Ft&&!!_.clearcoatMap,ae=Ft&&!!_.clearcoatNormalMap,le=Ft&&!!_.clearcoatRoughnessMap,Z=w&&!!_.iridescenceMap,j=w&&!!_.iridescenceThicknessMap,de=x&&!!_.sheenColorMap,be=x&&!!_.sheenRoughnessMap,pe=!!_.specularMap,ue=!!_.specularColorMap,we=!!_.specularIntensityMap,Ie=B&&!!_.transmissionMap,Ue=B&&!!_.thicknessMap,L=!!_.gradientMap,oe=!!_.alphaMap,Q=_.alphaTest>0,he=!!_.alphaHash,xe=!!_.extensions;let ee=pn;_.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(ee=n.toneMapping);const Ee={shaderID:ie,shaderType:_.type,shaderName:_.name,vertexShader:Oe,fragmentShader:Ve,defines:_.defines,customVertexShaderID:K,customFragmentShaderID:$,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:re,batchingColor:re&&I._colorsTexture!==null,instancing:se,instancingColor:se&&I.instanceColor!==null,instancingMorph:se&&I.morphTexture!==null,outputColorSpace:F===null?n.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:He.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Pe,matcap:Re,envMap:Qe,envMapMode:Qe&&J.mapping,envMapCubeUVHeight:te,aoMap:Ye,lightMap:We,bumpMap:pt,normalMap:_t,displacementMap:St,emissiveMap:bt,normalMapObjectSpace:_t&&_.normalMapType===jg,normalMapTangentSpace:_t&&_.normalMapType===ho,packedNormalMap:_t&&_.normalMapType===ho&&JS(_.normalMap.format),metalnessMap:ot,roughnessMap:mt,anisotropy:D,anisotropyMap:G,clearcoat:Ft,clearcoatMap:q,clearcoatNormalMap:ae,clearcoatRoughnessMap:le,dispersion:qe,iridescence:w,iridescenceMap:Z,iridescenceThicknessMap:j,sheen:x,sheenColorMap:de,sheenRoughnessMap:be,specularMap:pe,specularColorMap:ue,specularIntensityMap:we,transmission:B,transmissionMap:Ie,thicknessMap:Ue,gradientMap:L,opaque:_.transparent===!1&&_.blending===Pi&&_.alphaToCoverage===!1,alphaMap:oe,alphaTest:Q,alphaHash:he,combine:_.combine,mapUv:Pe&&p(_.map.channel),aoMapUv:Ye&&p(_.aoMap.channel),lightMapUv:We&&p(_.lightMap.channel),bumpMapUv:pt&&p(_.bumpMap.channel),normalMapUv:_t&&p(_.normalMap.channel),displacementMapUv:St&&p(_.displacementMap.channel),emissiveMapUv:bt&&p(_.emissiveMap.channel),metalnessMapUv:ot&&p(_.metalnessMap.channel),roughnessMapUv:mt&&p(_.roughnessMap.channel),anisotropyMapUv:G&&p(_.anisotropyMap.channel),clearcoatMapUv:q&&p(_.clearcoatMap.channel),clearcoatNormalMapUv:ae&&p(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:le&&p(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&p(_.iridescenceMap.channel),iridescenceThicknessMapUv:j&&p(_.iridescenceThicknessMap.channel),sheenColorMapUv:de&&p(_.sheenColorMap.channel),sheenRoughnessMapUv:be&&p(_.sheenRoughnessMap.channel),specularMapUv:pe&&p(_.specularMap.channel),specularColorMapUv:ue&&p(_.specularColorMap.channel),specularIntensityMapUv:we&&p(_.specularIntensityMap.channel),transmissionMapUv:Ie&&p(_.transmissionMap.channel),thicknessMapUv:Ue&&p(_.thicknessMap.channel),alphaMapUv:oe&&p(_.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(_t||D),vertexNormals:!!N.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!N.attributes.uv&&(Pe||oe),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||N.attributes.normal===void 0&&_t===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:ne,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:fe,morphTextureStride:De,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:ee,decodeVideoTexture:Pe&&_.map.isVideoTexture===!0&&He.getTransfer(_.map.colorSpace)===Ze,decodeVideoTextureEmissive:bt&&_.emissiveMap.isVideoTexture===!0&&He.getTransfer(_.emissiveMap.colorSpace)===Ze,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===un,flipSided:_.side===Vt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:xe&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&_.extensions.multiDraw===!0||re)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ee.vertexUv1s=l.has(1),Ee.vertexUv2s=l.has(2),Ee.vertexUv3s=l.has(3),l.clear(),Ee}function m(_){const S=[];if(_.shaderID?S.push(_.shaderID):(S.push(_.customVertexShaderID),S.push(_.customFragmentShaderID)),_.defines!==void 0)for(const C in _.defines)S.push(C),S.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(g(S,_),E(S,_),S.push(n.outputColorSpace)),S.push(_.customProgramCacheKey),S.join()}function g(_,S){_.push(S.precision),_.push(S.outputColorSpace),_.push(S.envMapMode),_.push(S.envMapCubeUVHeight),_.push(S.mapUv),_.push(S.alphaMapUv),_.push(S.lightMapUv),_.push(S.aoMapUv),_.push(S.bumpMapUv),_.push(S.normalMapUv),_.push(S.displacementMapUv),_.push(S.emissiveMapUv),_.push(S.metalnessMapUv),_.push(S.roughnessMapUv),_.push(S.anisotropyMapUv),_.push(S.clearcoatMapUv),_.push(S.clearcoatNormalMapUv),_.push(S.clearcoatRoughnessMapUv),_.push(S.iridescenceMapUv),_.push(S.iridescenceThicknessMapUv),_.push(S.sheenColorMapUv),_.push(S.sheenRoughnessMapUv),_.push(S.specularMapUv),_.push(S.specularColorMapUv),_.push(S.specularIntensityMapUv),_.push(S.transmissionMapUv),_.push(S.thicknessMapUv),_.push(S.combine),_.push(S.fogExp2),_.push(S.sizeAttenuation),_.push(S.morphTargetsCount),_.push(S.morphAttributeCount),_.push(S.numDirLights),_.push(S.numPointLights),_.push(S.numSpotLights),_.push(S.numSpotLightMaps),_.push(S.numHemiLights),_.push(S.numRectAreaLights),_.push(S.numDirLightShadows),_.push(S.numPointLightShadows),_.push(S.numSpotLightShadows),_.push(S.numSpotLightShadowsWithMaps),_.push(S.numLightProbes),_.push(S.shadowMapType),_.push(S.toneMapping),_.push(S.numClippingPlanes),_.push(S.numClipIntersection),_.push(S.depthPacking)}function E(_,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function b(_){const S=f[_.type];let C;if(S){const R=dn[S];C=g0.clone(R.uniforms)}else C=_.uniforms;return C}function M(_,S){let C=u.get(S);return C!==void 0?++C.usedTimes:(C=new YS(n,S,_,s),c.push(C),u.set(S,C)),C}function A(_){if(--_.usedTimes===0){const S=c.indexOf(_);c[S]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function P(){o.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:b,acquireProgram:M,releaseProgram:A,releaseShaderCache:T,programs:c,dispose:P}}function jS(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function ey(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Ec(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function bc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,v,m,g){let E=n[e];return E===void 0?(E={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:v,renderOrder:d.renderOrder,z:m,group:g},n[e]=E):(E.id=d.id,E.object=d,E.geometry=f,E.material=p,E.materialVariant=a(d),E.groupOrder=v,E.renderOrder=d.renderOrder,E.z=m,E.group=g),e++,E}function l(d,f,p,v,m,g){const E=o(d,f,p,v,m,g);p.transmission>0?i.push(E):p.transparent===!0?s.push(E):t.push(E)}function c(d,f,p,v,m,g){const E=o(d,f,p,v,m,g);p.transmission>0?i.unshift(E):p.transparent===!0?s.unshift(E):t.unshift(E)}function u(d,f,p){t.length>1&&t.sort(d||ey),i.length>1&&i.sort(f||Ec),s.length>1&&s.sort(f||Ec),p&&(t.reverse(),i.reverse(),s.reverse())}function h(){for(let d=e,f=n.length;d<f;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:h,sort:u}}function ty(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new bc,n.set(i,[a])):s>=r.length?(a=new bc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function ny(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new Ge};break;case"SpotLight":t={position:new O,direction:new O,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new O,halfWidth:new O,halfHeight:new O};break}return n[e.id]=t,t}}}function iy(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let sy=0;function ry(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function ay(n){const e=new ny,t=iy(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);const s=new O,r=new st,a=new st;function o(c){let u=0,h=0,d=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let f=0,p=0,v=0,m=0,g=0,E=0,b=0,M=0,A=0,T=0,P=0;c.sort(ry);for(let S=0,C=c.length;S<C;S++){const R=c[S],I=R.color,H=R.intensity,W=R.distance;let N=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===oi?N=R.shadow.map.texture:N=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)u+=I.r*H,h+=I.g*H,d+=I.b*H;else if(R.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(R.sh.coefficients[Y],H);P++}else if(R.isDirectionalLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const k=R.shadow,J=t.get(R);J.shadowIntensity=k.intensity,J.shadowBias=k.bias,J.shadowNormalBias=k.normalBias,J.shadowRadius=k.radius,J.shadowMapSize=k.mapSize,i.directionalShadow[f]=J,i.directionalShadowMap[f]=N,i.directionalShadowMatrix[f]=R.shadow.matrix,E++}i.directional[f]=Y,f++}else if(R.isSpotLight){const Y=e.get(R);Y.position.setFromMatrixPosition(R.matrixWorld),Y.color.copy(I).multiplyScalar(H),Y.distance=W,Y.coneCos=Math.cos(R.angle),Y.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Y.decay=R.decay,i.spot[v]=Y;const k=R.shadow;if(R.map&&(i.spotLightMap[A]=R.map,A++,k.updateMatrices(R),R.castShadow&&T++),i.spotLightMatrix[v]=k.matrix,R.castShadow){const J=t.get(R);J.shadowIntensity=k.intensity,J.shadowBias=k.bias,J.shadowNormalBias=k.normalBias,J.shadowRadius=k.radius,J.shadowMapSize=k.mapSize,i.spotShadow[v]=J,i.spotShadowMap[v]=N,M++}v++}else if(R.isRectAreaLight){const Y=e.get(R);Y.color.copy(I).multiplyScalar(H),Y.halfWidth.set(R.width*.5,0,0),Y.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=Y,m++}else if(R.isPointLight){const Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),Y.distance=R.distance,Y.decay=R.decay,R.castShadow){const k=R.shadow,J=t.get(R);J.shadowIntensity=k.intensity,J.shadowBias=k.bias,J.shadowNormalBias=k.normalBias,J.shadowRadius=k.radius,J.shadowMapSize=k.mapSize,J.shadowCameraNear=k.camera.near,J.shadowCameraFar=k.camera.far,i.pointShadow[p]=J,i.pointShadowMap[p]=N,i.pointShadowMatrix[p]=R.shadow.matrix,b++}i.point[p]=Y,p++}else if(R.isHemisphereLight){const Y=e.get(R);Y.skyColor.copy(R.color).multiplyScalar(H),Y.groundColor.copy(R.groundColor).multiplyScalar(H),i.hemi[g]=Y,g++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const _=i.hash;(_.directionalLength!==f||_.pointLength!==p||_.spotLength!==v||_.rectAreaLength!==m||_.hemiLength!==g||_.numDirectionalShadows!==E||_.numPointShadows!==b||_.numSpotShadows!==M||_.numSpotMaps!==A||_.numLightProbes!==P)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=M+A-T,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=P,_.directionalLength=f,_.pointLength=p,_.spotLength=v,_.rectAreaLength=m,_.hemiLength=g,_.numDirectionalShadows=E,_.numPointShadows=b,_.numSpotShadows=M,_.numSpotMaps=A,_.numLightProbes=P,i.version=sy++)}function l(c,u){let h=0,d=0,f=0,p=0,v=0;const m=u.matrixWorldInverse;for(let g=0,E=c.length;g<E;g++){const b=c[g];if(b.isDirectionalLight){const M=i.directional[h];M.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),h++}else if(b.isSpotLight){const M=i.spot[f];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const M=i.rectArea[p];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),M.halfWidth.set(b.width*.5,0,0),M.halfHeight.set(0,b.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),p++}else if(b.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const M=i.hemi[v];M.direction.setFromMatrixPosition(b.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:i}}function Tc(n){const e=new ay(n),t=[],i=[],s=[];function r(d){h.camera=d,t.length=0,i.length=0,s.length=0}function a(d){t.push(d)}function o(d){i.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function u(d){e.setupView(t,d)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function oy(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Tc(n),e.set(s,[o])):r>=a.length?(o=new Tc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const ly=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cy=`uniform sampler2D shadow_pass;
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
}`,dy=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],uy=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)],Ac=new st,ji=new O,fa=new O;function hy(n,e,t){let i=new Do;const s=new Le,r=new Le,a=new rt,o=new S0,l=new y0,c={},u=t.maxTextureSize,h={[Wn]:Vt,[Vt]:Wn,[un]:un},d=new xn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:ly,fragmentShader:cy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ut;p.setAttribute("position",new gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new nn(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tr;let g=this.type;this.render=function(T,P,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Pg&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=tr);const S=n.getRenderTarget(),C=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),I=n.state;I.setBlending(An),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const H=g!==this.type;H&&P.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(N=>N.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,N=T.length;W<N;W++){const Y=T[W],k=Y.shadow;if(k===void 0){Ce("WebGLShadowMap:",Y,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const J=k.getFrameExtents();s.multiply(J),r.copy(k.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/J.x),s.x=r.x*J.x,k.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/J.y),s.y=r.y*J.y,k.mapSize.y=r.y));const te=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=te,k.map===null||H===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===ns){if(Y.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new mn(s.x,s.y,{format:oi,type:Rn,minFilter:Pt,magFilter:Pt,generateMipmaps:!1}),k.map.texture.name=Y.name+".shadowMap",k.map.depthTexture=new Oi(s.x,s.y,hn),k.map.depthTexture.name=Y.name+".shadowMapDepth",k.map.depthTexture.format=Cn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Tt,k.map.depthTexture.magFilter=Tt}else Y.isPointLight?(k.map=new Dd(s.x),k.map.depthTexture=new K_(s.x,_n)):(k.map=new mn(s.x,s.y),k.map.depthTexture=new Oi(s.x,s.y,_n)),k.map.depthTexture.name=Y.name+".shadowMap",k.map.depthTexture.format=Cn,this.type===tr?(k.map.depthTexture.compareFunction=te?Co:Ro,k.map.depthTexture.minFilter=Pt,k.map.depthTexture.magFilter=Pt):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Tt,k.map.depthTexture.magFilter=Tt);k.camera.updateProjectionMatrix()}const ie=k.map.isWebGLCubeRenderTarget?6:1;for(let ce=0;ce<ie;ce++){if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,ce),n.clear();else{ce===0&&(n.setRenderTarget(k.map),n.clear());const fe=k.getViewport(ce);a.set(r.x*fe.x,r.y*fe.y,r.x*fe.z,r.y*fe.w),I.viewport(a)}if(Y.isPointLight){const fe=k.camera,De=k.matrix,Oe=Y.distance||fe.far;Oe!==fe.far&&(fe.far=Oe,fe.updateProjectionMatrix()),ji.setFromMatrixPosition(Y.matrixWorld),fe.position.copy(ji),fa.copy(fe.position),fa.add(dy[ce]),fe.up.copy(uy[ce]),fe.lookAt(fa),fe.updateMatrixWorld(),De.makeTranslation(-ji.x,-ji.y,-ji.z),Ac.multiplyMatrices(fe.projectionMatrix,fe.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Ac,fe.coordinateSystem,fe.reversedDepth)}else k.updateMatrices(Y);i=k.getFrustum(),M(P,_,k.camera,Y,this.type)}k.isPointLightShadow!==!0&&this.type===ns&&E(k,_),k.needsUpdate=!1}g=this.type,m.needsUpdate=!1,n.setRenderTarget(S,C,R)};function E(T,P){const _=e.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new mn(s.x,s.y,{format:oi,type:Rn})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(P,null,_,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(P,null,_,f,v,null)}function b(T,P,_,S){let C=null;const R=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)C=R;else if(C=_.isPointLight===!0?l:o,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const I=C.uuid,H=P.uuid;let W=c[I];W===void 0&&(W={},c[I]=W);let N=W[H];N===void 0&&(N=C.clone(),W[H]=N,P.addEventListener("dispose",A)),C=N}if(C.visible=P.visible,C.wireframe=P.wireframe,S===ns?C.side=P.shadowSide!==null?P.shadowSide:P.side:C.side=P.shadowSide!==null?P.shadowSide:h[P.side],C.alphaMap=P.alphaMap,C.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,C.map=P.map,C.clipShadows=P.clipShadows,C.clippingPlanes=P.clippingPlanes,C.clipIntersection=P.clipIntersection,C.displacementMap=P.displacementMap,C.displacementScale=P.displacementScale,C.displacementBias=P.displacementBias,C.wireframeLinewidth=P.wireframeLinewidth,C.linewidth=P.linewidth,_.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const I=n.properties.get(C);I.light=_}return C}function M(T,P,_,S,C){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&C===ns)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);const H=e.update(T),W=T.material;if(Array.isArray(W)){const N=H.groups;for(let Y=0,k=N.length;Y<k;Y++){const J=N[Y],te=W[J.materialIndex];if(te&&te.visible){const ie=b(T,te,S,C);T.onBeforeShadow(n,T,P,_,H,ie,J),n.renderBufferDirect(_,null,H,ie,T,J),T.onAfterShadow(n,T,P,_,H,ie,J)}}}else if(W.visible){const N=b(T,W,S,C);T.onBeforeShadow(n,T,P,_,H,N,null),n.renderBufferDirect(_,null,H,N,T,null),T.onAfterShadow(n,T,P,_,H,N,null)}}const I=T.children;for(let H=0,W=I.length;H<W;H++)M(I[H],P,_,S,C)}function A(T){T.target.removeEventListener("dispose",A);for(const _ in c){const S=c[_],C=T.target.uuid;C in S&&(S[C].dispose(),delete S[C])}}}function fy(n,e){function t(){let L=!1;const oe=new rt;let Q=null;const he=new rt(0,0,0,0);return{setMask:function(xe){Q!==xe&&!L&&(n.colorMask(xe,xe,xe,xe),Q=xe)},setLocked:function(xe){L=xe},setClear:function(xe,ee,Ee,Se,lt){lt===!0&&(xe*=Se,ee*=Se,Ee*=Se),oe.set(xe,ee,Ee,Se),he.equals(oe)===!1&&(n.clearColor(xe,ee,Ee,Se),he.copy(oe))},reset:function(){L=!1,Q=null,he.set(-1,0,0,0)}}}function i(){let L=!1,oe=!1,Q=null,he=null,xe=null;return{setReversed:function(ee){if(oe!==ee){const Ee=e.get("EXT_clip_control");ee?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),oe=ee;const Se=xe;xe=null,this.setClear(Se)}},getReversed:function(){return oe},setTest:function(ee){ee?F(n.DEPTH_TEST):ne(n.DEPTH_TEST)},setMask:function(ee){Q!==ee&&!L&&(n.depthMask(ee),Q=ee)},setFunc:function(ee){if(oe&&(ee=c_[ee]),he!==ee){switch(ee){case Aa:n.depthFunc(n.NEVER);break;case wa:n.depthFunc(n.ALWAYS);break;case Ra:n.depthFunc(n.LESS);break;case Ui:n.depthFunc(n.LEQUAL);break;case Ca:n.depthFunc(n.EQUAL);break;case Pa:n.depthFunc(n.GEQUAL);break;case Ia:n.depthFunc(n.GREATER);break;case La:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}he=ee}},setLocked:function(ee){L=ee},setClear:function(ee){xe!==ee&&(xe=ee,oe&&(ee=1-ee),n.clearDepth(ee))},reset:function(){L=!1,Q=null,he=null,xe=null,oe=!1}}}function s(){let L=!1,oe=null,Q=null,he=null,xe=null,ee=null,Ee=null,Se=null,lt=null;return{setTest:function(tt){L||(tt?F(n.STENCIL_TEST):ne(n.STENCIL_TEST))},setMask:function(tt){oe!==tt&&!L&&(n.stencilMask(tt),oe=tt)},setFunc:function(tt,sn,rn){(Q!==tt||he!==sn||xe!==rn)&&(n.stencilFunc(tt,sn,rn),Q=tt,he=sn,xe=rn)},setOp:function(tt,sn,rn){(ee!==tt||Ee!==sn||Se!==rn)&&(n.stencilOp(tt,sn,rn),ee=tt,Ee=sn,Se=rn)},setLocked:function(tt){L=tt},setClear:function(tt){lt!==tt&&(n.clearStencil(tt),lt=tt)},reset:function(){L=!1,oe=null,Q=null,he=null,xe=null,ee=null,Ee=null,Se=null,lt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,E=null,b=null,M=null,A=null,T=null,P=null,_=new Ge(0,0,0),S=0,C=!1,R=null,I=null,H=null,W=null,N=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,J=0;const te=n.getParameter(n.VERSION);te.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(te)[1]),k=J>=1):te.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),k=J>=2);let ie=null,ce={};const fe=n.getParameter(n.SCISSOR_BOX),De=n.getParameter(n.VIEWPORT),Oe=new rt().fromArray(fe),Ve=new rt().fromArray(De);function K(L,oe,Q,he){const xe=new Uint8Array(4),ee=n.createTexture();n.bindTexture(L,ee),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ee=0;Ee<Q;Ee++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(oe,0,n.RGBA,1,1,he,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(oe+Ee,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return ee}const $={};$[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),F(n.DEPTH_TEST),a.setFunc(Ui),pt(!1),_t(ml),F(n.CULL_FACE),Ye(An);function F(L){u[L]!==!0&&(n.enable(L),u[L]=!0)}function ne(L){u[L]!==!1&&(n.disable(L),u[L]=!1)}function se(L,oe){return d[L]!==oe?(n.bindFramebuffer(L,oe),d[L]=oe,L===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=oe),L===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=oe),!0):!1}function re(L,oe){let Q=p,he=!1;if(L){Q=f.get(oe),Q===void 0&&(Q=[],f.set(oe,Q));const xe=L.textures;if(Q.length!==xe.length||Q[0]!==n.COLOR_ATTACHMENT0){for(let ee=0,Ee=xe.length;ee<Ee;ee++)Q[ee]=n.COLOR_ATTACHMENT0+ee;Q.length=xe.length,he=!0}}else Q[0]!==n.BACK&&(Q[0]=n.BACK,he=!0);he&&n.drawBuffers(Q)}function Pe(L){return v!==L?(n.useProgram(L),v=L,!0):!1}const Re={[ei]:n.FUNC_ADD,[Lg]:n.FUNC_SUBTRACT,[Dg]:n.FUNC_REVERSE_SUBTRACT};Re[Ng]=n.MIN,Re[Ug]=n.MAX;const Qe={[Fg]:n.ZERO,[Og]:n.ONE,[Bg]:n.SRC_COLOR,[ba]:n.SRC_ALPHA,[Wg]:n.SRC_ALPHA_SATURATE,[Gg]:n.DST_COLOR,[Vg]:n.DST_ALPHA,[kg]:n.ONE_MINUS_SRC_COLOR,[Ta]:n.ONE_MINUS_SRC_ALPHA,[Hg]:n.ONE_MINUS_DST_COLOR,[zg]:n.ONE_MINUS_DST_ALPHA,[$g]:n.CONSTANT_COLOR,[Xg]:n.ONE_MINUS_CONSTANT_COLOR,[Yg]:n.CONSTANT_ALPHA,[qg]:n.ONE_MINUS_CONSTANT_ALPHA};function Ye(L,oe,Q,he,xe,ee,Ee,Se,lt,tt){if(L===An){m===!0&&(ne(n.BLEND),m=!1);return}if(m===!1&&(F(n.BLEND),m=!0),L!==Ig){if(L!==g||tt!==C){if((E!==ei||A!==ei)&&(n.blendEquation(n.FUNC_ADD),E=ei,A=ei),tt)switch(L){case Pi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case gl:n.blendFunc(n.ONE,n.ONE);break;case _l:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case xl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Xe("WebGLState: Invalid blending: ",L);break}else switch(L){case Pi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case gl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case _l:Xe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xl:Xe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Xe("WebGLState: Invalid blending: ",L);break}b=null,M=null,T=null,P=null,_.set(0,0,0),S=0,g=L,C=tt}return}xe=xe||oe,ee=ee||Q,Ee=Ee||he,(oe!==E||xe!==A)&&(n.blendEquationSeparate(Re[oe],Re[xe]),E=oe,A=xe),(Q!==b||he!==M||ee!==T||Ee!==P)&&(n.blendFuncSeparate(Qe[Q],Qe[he],Qe[ee],Qe[Ee]),b=Q,M=he,T=ee,P=Ee),(Se.equals(_)===!1||lt!==S)&&(n.blendColor(Se.r,Se.g,Se.b,lt),_.copy(Se),S=lt),g=L,C=!1}function We(L,oe){L.side===un?ne(n.CULL_FACE):F(n.CULL_FACE);let Q=L.side===Vt;oe&&(Q=!Q),pt(Q),L.blending===Pi&&L.transparent===!1?Ye(An):Ye(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const he=L.stencilWrite;o.setTest(he),he&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),bt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?F(n.SAMPLE_ALPHA_TO_COVERAGE):ne(n.SAMPLE_ALPHA_TO_COVERAGE)}function pt(L){R!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),R=L)}function _t(L){L!==Rg?(F(n.CULL_FACE),L!==I&&(L===ml?n.cullFace(n.BACK):L===Cg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ne(n.CULL_FACE),I=L}function St(L){L!==H&&(k&&n.lineWidth(L),H=L)}function bt(L,oe,Q){L?(F(n.POLYGON_OFFSET_FILL),(W!==oe||N!==Q)&&(W=oe,N=Q,a.getReversed()&&(oe=-oe),n.polygonOffset(oe,Q))):ne(n.POLYGON_OFFSET_FILL)}function ot(L){L?F(n.SCISSOR_TEST):ne(n.SCISSOR_TEST)}function mt(L){L===void 0&&(L=n.TEXTURE0+Y-1),ie!==L&&(n.activeTexture(L),ie=L)}function D(L,oe,Q){Q===void 0&&(ie===null?Q=n.TEXTURE0+Y-1:Q=ie);let he=ce[Q];he===void 0&&(he={type:void 0,texture:void 0},ce[Q]=he),(he.type!==L||he.texture!==oe)&&(ie!==Q&&(n.activeTexture(Q),ie=Q),n.bindTexture(L,oe||$[L]),he.type=L,he.texture=oe)}function Ft(){const L=ce[ie];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function qe(){try{n.compressedTexImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function w(){try{n.compressedTexImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function x(){try{n.texSubImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function B(){try{n.texSubImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function G(){try{n.compressedTexSubImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function q(){try{n.compressedTexSubImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function ae(){try{n.texStorage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function le(){try{n.texStorage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function Z(){try{n.texImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function j(){try{n.texImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function de(L){return h[L]!==void 0?h[L]:n.getParameter(L)}function be(L,oe){h[L]!==oe&&(n.pixelStorei(L,oe),h[L]=oe)}function pe(L){Oe.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Oe.copy(L))}function ue(L){Ve.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Ve.copy(L))}function we(L,oe){let Q=c.get(oe);Q===void 0&&(Q=new WeakMap,c.set(oe,Q));let he=Q.get(L);he===void 0&&(he=n.getUniformBlockIndex(oe,L.name),Q.set(L,he))}function Ie(L,oe){const he=c.get(oe).get(L);l.get(oe)!==he&&(n.uniformBlockBinding(oe,he,L.__bindingPointIndex),l.set(oe,he))}function Ue(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},ie=null,ce={},d={},f=new WeakMap,p=[],v=null,m=!1,g=null,E=null,b=null,M=null,A=null,T=null,P=null,_=new Ge(0,0,0),S=0,C=!1,R=null,I=null,H=null,W=null,N=null,Oe.set(0,0,n.canvas.width,n.canvas.height),Ve.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:F,disable:ne,bindFramebuffer:se,drawBuffers:re,useProgram:Pe,setBlending:Ye,setMaterial:We,setFlipSided:pt,setCullFace:_t,setLineWidth:St,setPolygonOffset:bt,setScissorTest:ot,activeTexture:mt,bindTexture:D,unbindTexture:Ft,compressedTexImage2D:qe,compressedTexImage3D:w,texImage2D:Z,texImage3D:j,pixelStorei:be,getParameter:de,updateUBOMapping:we,uniformBlockBinding:Ie,texStorage2D:ae,texStorage3D:le,texSubImage2D:x,texSubImage3D:B,compressedTexSubImage2D:G,compressedTexSubImage3D:q,scissor:pe,viewport:ue,reset:Ue}}function py(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Le,u=new WeakMap,h=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,x){return p?new OffscreenCanvas(w,x):_r("canvas")}function m(w,x,B){let G=1;const q=qe(w);if((q.width>B||q.height>B)&&(G=B/Math.max(q.width,q.height)),G<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ae=Math.floor(G*q.width),le=Math.floor(G*q.height);d===void 0&&(d=v(ae,le));const Z=x?v(ae,le):d;return Z.width=ae,Z.height=le,Z.getContext("2d").drawImage(w,0,0,ae,le),Ce("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+ae+"x"+le+")."),Z}else return"data"in w&&Ce("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),w;return w}function g(w){return w.generateMipmaps}function E(w){n.generateMipmap(w)}function b(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(w,x,B,G,q,ae=!1){if(w!==null){if(n[w]!==void 0)return n[w];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let le;G&&(le=e.get("EXT_texture_norm16"),le||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=x;if(x===n.RED&&(B===n.FLOAT&&(Z=n.R32F),B===n.HALF_FLOAT&&(Z=n.R16F),B===n.UNSIGNED_BYTE&&(Z=n.R8),B===n.UNSIGNED_SHORT&&le&&(Z=le.R16_EXT),B===n.SHORT&&le&&(Z=le.R16_SNORM_EXT)),x===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.R8UI),B===n.UNSIGNED_SHORT&&(Z=n.R16UI),B===n.UNSIGNED_INT&&(Z=n.R32UI),B===n.BYTE&&(Z=n.R8I),B===n.SHORT&&(Z=n.R16I),B===n.INT&&(Z=n.R32I)),x===n.RG&&(B===n.FLOAT&&(Z=n.RG32F),B===n.HALF_FLOAT&&(Z=n.RG16F),B===n.UNSIGNED_BYTE&&(Z=n.RG8),B===n.UNSIGNED_SHORT&&le&&(Z=le.RG16_EXT),B===n.SHORT&&le&&(Z=le.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.RG8UI),B===n.UNSIGNED_SHORT&&(Z=n.RG16UI),B===n.UNSIGNED_INT&&(Z=n.RG32UI),B===n.BYTE&&(Z=n.RG8I),B===n.SHORT&&(Z=n.RG16I),B===n.INT&&(Z=n.RG32I)),x===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.RGB8UI),B===n.UNSIGNED_SHORT&&(Z=n.RGB16UI),B===n.UNSIGNED_INT&&(Z=n.RGB32UI),B===n.BYTE&&(Z=n.RGB8I),B===n.SHORT&&(Z=n.RGB16I),B===n.INT&&(Z=n.RGB32I)),x===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(Z=n.RGBA16UI),B===n.UNSIGNED_INT&&(Z=n.RGBA32UI),B===n.BYTE&&(Z=n.RGBA8I),B===n.SHORT&&(Z=n.RGBA16I),B===n.INT&&(Z=n.RGBA32I)),x===n.RGB&&(B===n.UNSIGNED_SHORT&&le&&(Z=le.RGB16_EXT),B===n.SHORT&&le&&(Z=le.RGB16_SNORM_EXT),B===n.UNSIGNED_INT_5_9_9_9_REV&&(Z=n.RGB9_E5),B===n.UNSIGNED_INT_10F_11F_11F_REV&&(Z=n.R11F_G11F_B10F)),x===n.RGBA){const j=ae?gr:He.getTransfer(q);B===n.FLOAT&&(Z=n.RGBA32F),B===n.HALF_FLOAT&&(Z=n.RGBA16F),B===n.UNSIGNED_BYTE&&(Z=j===Ze?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT&&le&&(Z=le.RGBA16_EXT),B===n.SHORT&&le&&(Z=le.RGBA16_SNORM_EXT),B===n.UNSIGNED_SHORT_4_4_4_4&&(Z=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(Z=n.RGB5_A1)}return(Z===n.R16F||Z===n.R32F||Z===n.RG16F||Z===n.RG32F||Z===n.RGBA16F||Z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function A(w,x){let B;return w?x===null||x===_n||x===ds?B=n.DEPTH24_STENCIL8:x===hn?B=n.DEPTH32F_STENCIL8:x===cs&&(B=n.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===_n||x===ds?B=n.DEPTH_COMPONENT24:x===hn?B=n.DEPTH_COMPONENT32F:x===cs&&(B=n.DEPTH_COMPONENT16),B}function T(w,x){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==Tt&&w.minFilter!==Pt?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function P(w){const x=w.target;x.removeEventListener("dispose",P),S(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&h.delete(x)}function _(w){const x=w.target;x.removeEventListener("dispose",_),R(x)}function S(w){const x=i.get(w);if(x.__webglInit===void 0)return;const B=w.source,G=f.get(B);if(G){const q=G[x.__cacheKey];q.usedTimes--,q.usedTimes===0&&C(w),Object.keys(G).length===0&&f.delete(B)}i.remove(w)}function C(w){const x=i.get(w);n.deleteTexture(x.__webglTexture);const B=w.source,G=f.get(B);delete G[x.__cacheKey],a.memory.textures--}function R(w){const x=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(x.__webglFramebuffer[G]))for(let q=0;q<x.__webglFramebuffer[G].length;q++)n.deleteFramebuffer(x.__webglFramebuffer[G][q]);else n.deleteFramebuffer(x.__webglFramebuffer[G]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[G])}else{if(Array.isArray(x.__webglFramebuffer))for(let G=0;G<x.__webglFramebuffer.length;G++)n.deleteFramebuffer(x.__webglFramebuffer[G]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let G=0;G<x.__webglColorRenderbuffer.length;G++)x.__webglColorRenderbuffer[G]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[G]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const B=w.textures;for(let G=0,q=B.length;G<q;G++){const ae=i.get(B[G]);ae.__webglTexture&&(n.deleteTexture(ae.__webglTexture),a.memory.textures--),i.remove(B[G])}i.remove(w)}let I=0;function H(){I=0}function W(){return I}function N(w){I=w}function Y(){const w=I;return w>=s.maxTextures&&Ce("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),I+=1,w}function k(w){const x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function J(w,x){const B=i.get(w);if(w.isVideoTexture&&D(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&B.__version!==w.version){const G=w.image;if(G===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{ne(B,w,x);return}}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+x)}function te(w,x){const B=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){ne(B,w,x);return}else w.isExternalTexture&&(B.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+x)}function ie(w,x){const B=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&B.__version!==w.version){ne(B,w,x);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+x)}function ce(w,x){const B=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&B.__version!==w.version){se(B,w,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+x)}const fe={[Da]:n.REPEAT,[bn]:n.CLAMP_TO_EDGE,[Na]:n.MIRRORED_REPEAT},De={[Tt]:n.NEAREST,[Jg]:n.NEAREST_MIPMAP_NEAREST,[bs]:n.NEAREST_MIPMAP_LINEAR,[Pt]:n.LINEAR,[Or]:n.LINEAR_MIPMAP_NEAREST,[ii]:n.LINEAR_MIPMAP_LINEAR},Oe={[e_]:n.NEVER,[r_]:n.ALWAYS,[t_]:n.LESS,[Ro]:n.LEQUAL,[n_]:n.EQUAL,[Co]:n.GEQUAL,[i_]:n.GREATER,[s_]:n.NOTEQUAL};function Ve(w,x){if(x.type===hn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Pt||x.magFilter===Or||x.magFilter===bs||x.magFilter===ii||x.minFilter===Pt||x.minFilter===Or||x.minFilter===bs||x.minFilter===ii)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,fe[x.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,fe[x.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,fe[x.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,De[x.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,De[x.minFilter]),x.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,Oe[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Tt||x.minFilter!==bs&&x.minFilter!==ii||x.type===hn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function K(w,x){let B=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",P));const G=x.source;let q=f.get(G);q===void 0&&(q={},f.set(G,q));const ae=k(x);if(ae!==w.__cacheKey){q[ae]===void 0&&(q[ae]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,B=!0),q[ae].usedTimes++;const le=q[w.__cacheKey];le!==void 0&&(q[w.__cacheKey].usedTimes--,le.usedTimes===0&&C(x)),w.__cacheKey=ae,w.__webglTexture=q[ae].texture}return B}function $(w,x,B){return Math.floor(Math.floor(w/B)/x)}function F(w,x,B,G){const ae=w.updateRanges;if(ae.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,B,G,x.data);else{ae.sort((be,pe)=>be.start-pe.start);let le=0;for(let be=1;be<ae.length;be++){const pe=ae[le],ue=ae[be],we=pe.start+pe.count,Ie=$(ue.start,x.width,4),Ue=$(pe.start,x.width,4);ue.start<=we+1&&Ie===Ue&&$(ue.start+ue.count-1,x.width,4)===Ie?pe.count=Math.max(pe.count,ue.start+ue.count-pe.start):(++le,ae[le]=ue)}ae.length=le+1;const Z=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),de=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let be=0,pe=ae.length;be<pe;be++){const ue=ae[be],we=Math.floor(ue.start/4),Ie=Math.ceil(ue.count/4),Ue=we%x.width,L=Math.floor(we/x.width),oe=Ie,Q=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ue),t.pixelStorei(n.UNPACK_SKIP_ROWS,L),t.texSubImage2D(n.TEXTURE_2D,0,Ue,L,oe,Q,B,G,x.data)}w.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Z),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,de)}}function ne(w,x,B){let G=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(G=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(G=n.TEXTURE_3D);const q=K(w,x),ae=x.source;t.bindTexture(G,w.__webglTexture,n.TEXTURE0+B);const le=i.get(ae);if(ae.version!==le.__version||q===!0){if(t.activeTexture(n.TEXTURE0+B),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const Q=He.getPrimaries(He.workingColorSpace),he=x.colorSpace===Vn?null:He.getPrimaries(x.colorSpace),xe=x.colorSpace===Vn||Q===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let j=m(x.image,!1,s.maxTextureSize);j=Ft(x,j);const de=r.convert(x.format,x.colorSpace),be=r.convert(x.type);let pe=M(x.internalFormat,de,be,x.normalized,x.colorSpace,x.isVideoTexture);Ve(G,x);let ue;const we=x.mipmaps,Ie=x.isVideoTexture!==!0,Ue=le.__version===void 0||q===!0,L=ae.dataReady,oe=T(x,j);if(x.isDepthTexture)pe=A(x.format===si,x.type),Ue&&(Ie?t.texStorage2D(n.TEXTURE_2D,1,pe,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,pe,j.width,j.height,0,de,be,null));else if(x.isDataTexture)if(we.length>0){Ie&&Ue&&t.texStorage2D(n.TEXTURE_2D,oe,pe,we[0].width,we[0].height);for(let Q=0,he=we.length;Q<he;Q++)ue=we[Q],Ie?L&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,ue.width,ue.height,de,be,ue.data):t.texImage2D(n.TEXTURE_2D,Q,pe,ue.width,ue.height,0,de,be,ue.data);x.generateMipmaps=!1}else Ie?(Ue&&t.texStorage2D(n.TEXTURE_2D,oe,pe,j.width,j.height),L&&F(x,j,de,be)):t.texImage2D(n.TEXTURE_2D,0,pe,j.width,j.height,0,de,be,j.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ie&&Ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,pe,we[0].width,we[0].height,j.depth);for(let Q=0,he=we.length;Q<he;Q++)if(ue=we[Q],x.format!==tn)if(de!==null)if(Ie){if(L)if(x.layerUpdates.size>0){const xe=ic(ue.width,ue.height,x.format,x.type);for(const ee of x.layerUpdates){const Ee=ue.data.subarray(ee*xe/ue.data.BYTES_PER_ELEMENT,(ee+1)*xe/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,ee,ue.width,ue.height,1,de,Ee)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ue.width,ue.height,j.depth,de,ue.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,pe,ue.width,ue.height,j.depth,0,ue.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?L&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,ue.width,ue.height,j.depth,de,be,ue.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,pe,ue.width,ue.height,j.depth,0,de,be,ue.data)}else{Ie&&Ue&&t.texStorage2D(n.TEXTURE_2D,oe,pe,we[0].width,we[0].height);for(let Q=0,he=we.length;Q<he;Q++)ue=we[Q],x.format!==tn?de!==null?Ie?L&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,ue.width,ue.height,de,ue.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,pe,ue.width,ue.height,0,ue.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?L&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,ue.width,ue.height,de,be,ue.data):t.texImage2D(n.TEXTURE_2D,Q,pe,ue.width,ue.height,0,de,be,ue.data)}else if(x.isDataArrayTexture)if(Ie){if(Ue&&t.texStorage3D(n.TEXTURE_2D_ARRAY,oe,pe,j.width,j.height,j.depth),L)if(x.layerUpdates.size>0){const Q=ic(j.width,j.height,x.format,x.type);for(const he of x.layerUpdates){const xe=j.data.subarray(he*Q/j.data.BYTES_PER_ELEMENT,(he+1)*Q/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,he,j.width,j.height,1,de,be,xe)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,de,be,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,pe,j.width,j.height,j.depth,0,de,be,j.data);else if(x.isData3DTexture)Ie?(Ue&&t.texStorage3D(n.TEXTURE_3D,oe,pe,j.width,j.height,j.depth),L&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,de,be,j.data)):t.texImage3D(n.TEXTURE_3D,0,pe,j.width,j.height,j.depth,0,de,be,j.data);else if(x.isFramebufferTexture){if(Ue)if(Ie)t.texStorage2D(n.TEXTURE_2D,oe,pe,j.width,j.height);else{let Q=j.width,he=j.height;for(let xe=0;xe<oe;xe++)t.texImage2D(n.TEXTURE_2D,xe,pe,Q,he,0,de,be,null),Q>>=1,he>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const Q=n.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),j.parentNode!==Q){Q.appendChild(j),h.add(x),Q.onpaint=he=>{const xe=he.changedElements;for(const ee of h)xe.includes(ee.image)&&(ee.needsUpdate=!0)},Q.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,j);else{const xe=n.RGBA,ee=n.RGBA,Ee=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,xe,ee,Ee,j)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(we.length>0){if(Ie&&Ue){const Q=qe(we[0]);t.texStorage2D(n.TEXTURE_2D,oe,pe,Q.width,Q.height)}for(let Q=0,he=we.length;Q<he;Q++)ue=we[Q],Ie?L&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,de,be,ue):t.texImage2D(n.TEXTURE_2D,Q,pe,de,be,ue);x.generateMipmaps=!1}else if(Ie){if(Ue){const Q=qe(j);t.texStorage2D(n.TEXTURE_2D,oe,pe,Q.width,Q.height)}L&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,de,be,j)}else t.texImage2D(n.TEXTURE_2D,0,pe,de,be,j);g(x)&&E(G),le.__version=ae.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function se(w,x,B){if(x.image.length!==6)return;const G=K(w,x),q=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+B);const ae=i.get(q);if(q.version!==ae.__version||G===!0){t.activeTexture(n.TEXTURE0+B);const le=He.getPrimaries(He.workingColorSpace),Z=x.colorSpace===Vn?null:He.getPrimaries(x.colorSpace),j=x.colorSpace===Vn||le===Z?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const de=x.isCompressedTexture||x.image[0].isCompressedTexture,be=x.image[0]&&x.image[0].isDataTexture,pe=[];for(let ee=0;ee<6;ee++)!de&&!be?pe[ee]=m(x.image[ee],!0,s.maxCubemapSize):pe[ee]=be?x.image[ee].image:x.image[ee],pe[ee]=Ft(x,pe[ee]);const ue=pe[0],we=r.convert(x.format,x.colorSpace),Ie=r.convert(x.type),Ue=M(x.internalFormat,we,Ie,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,oe=ae.__version===void 0||G===!0,Q=q.dataReady;let he=T(x,ue);Ve(n.TEXTURE_CUBE_MAP,x);let xe;if(de){L&&oe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,he,Ue,ue.width,ue.height);for(let ee=0;ee<6;ee++){xe=pe[ee].mipmaps;for(let Ee=0;Ee<xe.length;Ee++){const Se=xe[Ee];x.format!==tn?we!==null?L?Q&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,0,0,Se.width,Se.height,we,Se.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,Ue,Se.width,Se.height,0,Se.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,0,0,Se.width,Se.height,we,Ie,Se.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,Ue,Se.width,Se.height,0,we,Ie,Se.data)}}}else{if(xe=x.mipmaps,L&&oe){xe.length>0&&he++;const ee=qe(pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,he,Ue,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(be){L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,pe[ee].width,pe[ee].height,we,Ie,pe[ee].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ue,pe[ee].width,pe[ee].height,0,we,Ie,pe[ee].data);for(let Ee=0;Ee<xe.length;Ee++){const lt=xe[Ee].image[ee].image;L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,0,0,lt.width,lt.height,we,Ie,lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,Ue,lt.width,lt.height,0,we,Ie,lt.data)}}else{L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,we,Ie,pe[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ue,we,Ie,pe[ee]);for(let Ee=0;Ee<xe.length;Ee++){const Se=xe[Ee];L?Q&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,0,0,we,Ie,Se.image[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,Ue,we,Ie,Se.image[ee])}}}g(x)&&E(n.TEXTURE_CUBE_MAP),ae.__version=q.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function re(w,x,B,G,q,ae){const le=r.convert(B.format,B.colorSpace),Z=r.convert(B.type),j=M(B.internalFormat,le,Z,B.normalized,B.colorSpace),de=i.get(x),be=i.get(B);if(be.__renderTarget=x,!de.__hasExternalTextures){const pe=Math.max(1,x.width>>ae),ue=Math.max(1,x.height>>ae);q===n.TEXTURE_3D||q===n.TEXTURE_2D_ARRAY?t.texImage3D(q,ae,j,pe,ue,x.depth,0,le,Z,null):t.texImage2D(q,ae,j,pe,ue,0,le,Z,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),mt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,G,q,be.__webglTexture,0,ot(x)):(q===n.TEXTURE_2D||q>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,G,q,be.__webglTexture,ae),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pe(w,x,B){if(n.bindRenderbuffer(n.RENDERBUFFER,w),x.depthBuffer){const G=x.depthTexture,q=G&&G.isDepthTexture?G.type:null,ae=A(x.stencilBuffer,q),le=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;mt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ot(x),ae,x.width,x.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,ot(x),ae,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ae,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,le,n.RENDERBUFFER,w)}else{const G=x.textures;for(let q=0;q<G.length;q++){const ae=G[q],le=r.convert(ae.format,ae.colorSpace),Z=r.convert(ae.type),j=M(ae.internalFormat,le,Z,ae.normalized,ae.colorSpace);mt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ot(x),j,x.width,x.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,ot(x),j,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,j,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Re(w,x,B){const G=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=i.get(x.depthTexture);if(q.__renderTarget=x,(!q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),G){if(q.__webglInit===void 0&&(q.__webglInit=!0,x.depthTexture.addEventListener("dispose",P)),q.__webglTexture===void 0){q.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Ve(n.TEXTURE_CUBE_MAP,x.depthTexture);const de=r.convert(x.depthTexture.format),be=r.convert(x.depthTexture.type);let pe;x.depthTexture.format===Cn?pe=n.DEPTH_COMPONENT24:x.depthTexture.format===si&&(pe=n.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,pe,x.width,x.height,0,de,be,null)}}else J(x.depthTexture,0);const ae=q.__webglTexture,le=ot(x),Z=G?n.TEXTURE_CUBE_MAP_POSITIVE_X+B:n.TEXTURE_2D,j=x.depthTexture.format===si?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Cn)mt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,Z,ae,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,j,Z,ae,0);else if(x.depthTexture.format===si)mt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,Z,ae,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,j,Z,ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Qe(w){const x=i.get(w),B=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){const G=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),G){const q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,G.removeEventListener("dispose",q)};G.addEventListener("dispose",q),x.__depthDisposeCallback=q}x.__boundDepthTexture=G}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(B)for(let G=0;G<6;G++)Re(x.__webglFramebuffer[G],w,G);else{const G=w.texture.mipmaps;G&&G.length>0?Re(x.__webglFramebuffer[0],w,0):Re(x.__webglFramebuffer,w,0)}else if(B){x.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[G]),x.__webglDepthbuffer[G]===void 0)x.__webglDepthbuffer[G]=n.createRenderbuffer(),Pe(x.__webglDepthbuffer[G],w,!1);else{const q=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=x.__webglDepthbuffer[G];n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,ae)}}else{const G=w.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),Pe(x.__webglDepthbuffer,w,!1);else{const q=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ae),n.framebufferRenderbuffer(n.FRAMEBUFFER,q,n.RENDERBUFFER,ae)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ye(w,x,B){const G=i.get(w);x!==void 0&&re(G.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&Qe(w)}function We(w){const x=w.texture,B=i.get(w),G=i.get(x);w.addEventListener("dispose",_);const q=w.textures,ae=w.isWebGLCubeRenderTarget===!0,le=q.length>1;if(le||(G.__webglTexture===void 0&&(G.__webglTexture=n.createTexture()),G.__version=x.version,a.memory.textures++),ae){B.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer[Z]=[];for(let j=0;j<x.mipmaps.length;j++)B.__webglFramebuffer[Z][j]=n.createFramebuffer()}else B.__webglFramebuffer[Z]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer=[];for(let Z=0;Z<x.mipmaps.length;Z++)B.__webglFramebuffer[Z]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(le)for(let Z=0,j=q.length;Z<j;Z++){const de=i.get(q[Z]);de.__webglTexture===void 0&&(de.__webglTexture=n.createTexture(),a.memory.textures++)}if(w.samples>0&&mt(w)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let Z=0;Z<q.length;Z++){const j=q[Z];B.__webglColorRenderbuffer[Z]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[Z]);const de=r.convert(j.format,j.colorSpace),be=r.convert(j.type),pe=M(j.internalFormat,de,be,j.normalized,j.colorSpace,w.isXRRenderTarget===!0),ue=ot(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,ue,pe,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Z,n.RENDERBUFFER,B.__webglColorRenderbuffer[Z])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),Pe(B.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ae){t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture),Ve(n.TEXTURE_CUBE_MAP,x);for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)re(B.__webglFramebuffer[Z][j],w,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,j);else re(B.__webglFramebuffer[Z],w,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);g(x)&&E(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){for(let Z=0,j=q.length;Z<j;Z++){const de=q[Z],be=i.get(de);let pe=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(pe=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,be.__webglTexture),Ve(pe,de),re(B.__webglFramebuffer,w,de,n.COLOR_ATTACHMENT0+Z,pe,0),g(de)&&E(pe)}t.unbindTexture()}else{let Z=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Z=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Z,G.__webglTexture),Ve(Z,x),x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)re(B.__webglFramebuffer[j],w,x,n.COLOR_ATTACHMENT0,Z,j);else re(B.__webglFramebuffer,w,x,n.COLOR_ATTACHMENT0,Z,0);g(x)&&E(Z),t.unbindTexture()}w.depthBuffer&&Qe(w)}function pt(w){const x=w.textures;for(let B=0,G=x.length;B<G;B++){const q=x[B];if(g(q)){const ae=b(w),le=i.get(q).__webglTexture;t.bindTexture(ae,le),E(ae),t.unbindTexture()}}}const _t=[],St=[];function bt(w){if(w.samples>0){if(mt(w)===!1){const x=w.textures,B=w.width,G=w.height;let q=n.COLOR_BUFFER_BIT;const ae=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=i.get(w),Z=x.length>1;if(Z)for(let de=0;de<x.length;de++)t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer);const j=w.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let de=0;de<x.length;de++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(q|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(q|=n.STENCIL_BUFFER_BIT)),Z){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,le.__webglColorRenderbuffer[de]);const be=i.get(x[de]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,be,0)}n.blitFramebuffer(0,0,B,G,0,0,B,G,q,n.NEAREST),l===!0&&(_t.length=0,St.length=0,_t.push(n.COLOR_ATTACHMENT0+de),w.depthBuffer&&w.resolveDepthBuffer===!1&&(_t.push(ae),St.push(ae),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,St)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,_t))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Z)for(let de=0;de<x.length;de++){t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,le.__webglColorRenderbuffer[de]);const be=i.get(x[de]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,be,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const x=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function ot(w){return Math.min(s.maxSamples,w.samples)}function mt(w){const x=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function D(w){const x=a.render.frame;u.get(w)!==x&&(u.set(w,x),w.update())}function Ft(w,x){const B=w.colorSpace,G=w.format,q=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||B!==mr&&B!==Vn&&(He.getTransfer(B)===Ze?(G!==tn||q!==$t)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Xe("WebGLTextures: Unsupported texture color space:",B)),x}function qe(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=H,this.getTextureUnits=W,this.setTextureUnits=N,this.setTexture2D=J,this.setTexture2DArray=te,this.setTexture3D=ie,this.setTextureCube=ce,this.rebindTextures=Ye,this.setupRenderTarget=We,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=Qe,this.setupFrameBufferTexture=re,this.useMultisampledRTT=mt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function my(n,e){function t(i,s=Vn){let r;const a=He.getTransfer(s);if(i===$t)return n.UNSIGNED_BYTE;if(i===Eo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===bo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ld)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===cd)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===ad)return n.BYTE;if(i===od)return n.SHORT;if(i===cs)return n.UNSIGNED_SHORT;if(i===yo)return n.INT;if(i===_n)return n.UNSIGNED_INT;if(i===hn)return n.FLOAT;if(i===Rn)return n.HALF_FLOAT;if(i===dd)return n.ALPHA;if(i===ud)return n.RGB;if(i===tn)return n.RGBA;if(i===Cn)return n.DEPTH_COMPONENT;if(i===si)return n.DEPTH_STENCIL;if(i===hd)return n.RED;if(i===To)return n.RED_INTEGER;if(i===oi)return n.RG;if(i===Ao)return n.RG_INTEGER;if(i===wo)return n.RGBA_INTEGER;if(i===nr||i===ir||i===sr||i===rr)if(a===Ze)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===nr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===nr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ir)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===sr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===rr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ua||i===Fa||i===Oa||i===Ba)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ua)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Fa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Oa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ba)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ka||i===Va||i===za||i===Ga||i===Ha||i===fr||i===Wa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ka||i===Va)return a===Ze?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===za)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ga)return r.COMPRESSED_R11_EAC;if(i===Ha)return r.COMPRESSED_SIGNED_R11_EAC;if(i===fr)return r.COMPRESSED_RG11_EAC;if(i===Wa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===$a||i===Xa||i===Ya||i===qa||i===Za||i===Ka||i===Ja||i===Qa||i===ja||i===eo||i===to||i===no||i===io||i===so)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===$a)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Xa)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ya)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===qa)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Za)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ka)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ja)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Qa)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ja)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===eo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===to)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===no)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===io)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===so)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ro||i===ao||i===oo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ro)return a===Ze?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===lo||i===co||i===pr||i===uo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===pr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===uo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ds?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const gy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_y=`
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

}`;class xy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Ed(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new xn({vertexShader:gy,fragmentShader:_y,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new nn(new wr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class vy extends Yn{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null;const v=typeof XRWebGLBinding<"u",m=new xy,g={},E=t.getContextAttributes();let b=null,M=null;const A=[],T=[],P=new Le;let _=null;const S=new Zt;S.viewport=new rt;const C=new Zt;C.viewport=new rt;const R=[S,C],I=new w0;let H=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let $=A[K];return $===void 0&&($=new Hr,A[K]=$),$.getTargetRaySpace()},this.getControllerGrip=function(K){let $=A[K];return $===void 0&&($=new Hr,A[K]=$),$.getGripSpace()},this.getHand=function(K){let $=A[K];return $===void 0&&($=new Hr,A[K]=$),$.getHandSpace()};function N(K){const $=T.indexOf(K.inputSource);if($===-1)return;const F=A[$];F!==void 0&&(F.update(K.inputSource,K.frame,c||a),F.dispatchEvent({type:K.type,data:K.inputSource}))}function Y(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",k);for(let K=0;K<A.length;K++){const $=T[K];$!==null&&(T[K]=null,A[K].disconnect($))}H=null,W=null,m.reset();for(const K in g)delete g[K];e.setRenderTarget(b),f=null,d=null,h=null,s=null,M=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",k),E.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(P),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let F=null,ne=null,se=null;E.depth&&(se=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,F=E.stencil?si:Cn,ne=E.stencil?ds:_n);const re={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(re),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new mn(d.textureWidth,d.textureHeight,{format:tn,type:$t,depthTexture:new Oi(d.textureWidth,d.textureHeight,ne,void 0,void 0,void 0,void 0,void 0,void 0,F),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const F={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,F),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new mn(f.framebufferWidth,f.framebufferHeight,{format:tn,type:$t,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ve.setContext(s),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function k(K){for(let $=0;$<K.removed.length;$++){const F=K.removed[$],ne=T.indexOf(F);ne>=0&&(T[ne]=null,A[ne].disconnect(F))}for(let $=0;$<K.added.length;$++){const F=K.added[$];let ne=T.indexOf(F);if(ne===-1){for(let re=0;re<A.length;re++)if(re>=T.length){T.push(F),ne=re;break}else if(T[re]===null){T[re]=F,ne=re;break}if(ne===-1)break}const se=A[ne];se&&se.connect(F)}}const J=new O,te=new O;function ie(K,$,F){J.setFromMatrixPosition($.matrixWorld),te.setFromMatrixPosition(F.matrixWorld);const ne=J.distanceTo(te),se=$.projectionMatrix.elements,re=F.projectionMatrix.elements,Pe=se[14]/(se[10]-1),Re=se[14]/(se[10]+1),Qe=(se[9]+1)/se[5],Ye=(se[9]-1)/se[5],We=(se[8]-1)/se[0],pt=(re[8]+1)/re[0],_t=Pe*We,St=Pe*pt,bt=ne/(-We+pt),ot=bt*-We;if($.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(ot),K.translateZ(bt),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),se[10]===-1)K.projectionMatrix.copy($.projectionMatrix),K.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const mt=Pe+bt,D=Re+bt,Ft=_t-ot,qe=St+(ne-ot),w=Qe*Re/D*mt,x=Ye*Re/D*mt;K.projectionMatrix.makePerspective(Ft,qe,w,x,mt,D),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function ce(K,$){$===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices($.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let $=K.near,F=K.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(F=m.depthFar)),I.near=C.near=S.near=$,I.far=C.far=S.far=F,(H!==I.near||W!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),H=I.near,W=I.far),I.layers.mask=K.layers.mask|6,S.layers.mask=I.layers.mask&-5,C.layers.mask=I.layers.mask&-3;const ne=K.parent,se=I.cameras;ce(I,ne);for(let re=0;re<se.length;re++)ce(se[re],ne);se.length===2?ie(I,S,C):I.projectionMatrix.copy(S.projectionMatrix),fe(K,I,ne)};function fe(K,$,F){F===null?K.matrix.copy($.matrixWorld):(K.matrix.copy(F.matrixWorld),K.matrix.invert(),K.matrix.multiply($.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy($.projectionMatrix),K.projectionMatrixInverse.copy($.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=hs*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(K){return g[K]};let De=null;function Oe(K,$){if(u=$.getViewerPose(c||a),p=$,u!==null){const F=u.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let ne=!1;F.length!==I.cameras.length&&(I.cameras.length=0,ne=!0);for(let Re=0;Re<F.length;Re++){const Qe=F[Re];let Ye=null;if(f!==null)Ye=f.getViewport(Qe);else{const pt=h.getViewSubImage(d,Qe);Ye=pt.viewport,Re===0&&(e.setRenderTargetTextures(M,pt.colorTexture,pt.depthStencilTexture),e.setRenderTarget(M))}let We=R[Re];We===void 0&&(We=new Zt,We.layers.enable(Re),We.viewport=new rt,R[Re]=We),We.matrix.fromArray(Qe.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(Qe.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(Ye.x,Ye.y,Ye.width,Ye.height),Re===0&&(I.matrix.copy(We.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),ne===!0&&I.cameras.push(We)}const se=s.enabledFeatures;if(se&&se.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const Re=h.getDepthInformation(F[0]);Re&&Re.isValid&&Re.texture&&m.init(Re,s.renderState)}if(se&&se.includes("camera-access")&&v){e.state.unbindTexture(),h=i.getBinding();for(let Re=0;Re<F.length;Re++){const Qe=F[Re].camera;if(Qe){let Ye=g[Qe];Ye||(Ye=new Ed,g[Qe]=Ye);const We=h.getCameraImage(Qe);Ye.sourceTexture=We}}}}for(let F=0;F<A.length;F++){const ne=T[F],se=A[F];ne!==null&&se!==void 0&&se.update(ne,$,c||a)}De&&De(K,$),$.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:$}),p=null}const Ve=new Id;Ve.setAnimationLoop(Oe),this.setAnimationLoop=function(K){De=K},this.dispose=function(){}}}const My=new st,Bd=new Ne;Bd.set(-1,0,0,0,1,0,0,0,1);function Sy(n,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,Rd(n)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,E,b,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),h(m,g)):g.isMeshPhongMaterial?(r(m,g),u(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,M)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),v(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,E,b):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Vt&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Vt&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const E=e.get(g),b=E.envMap,M=E.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(My.makeRotationFromEuler(M)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Bd),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,E,b){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*E,m.scale.value=b*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function h(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,E){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Vt&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function v(m,g){const E=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function yy(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,A){const T=A.program;i.uniformBlockBinding(M,T)}function c(M,A){let T=s[M.id];T===void 0&&(m(M),T=u(M),s[M.id]=T,M.addEventListener("dispose",E));const P=A.program;i.updateUBOMapping(M,P);const _=e.render.frame;r[M.id]!==_&&(d(M),r[M.id]=_)}function u(M){const A=h();M.__bindingPointIndex=A;const T=n.createBuffer(),P=M.__size,_=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,P,_),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,T),T}function h(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Xe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const A=s[M.id],T=M.uniforms,P=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let _=0,S=T.length;_<S;_++){const C=T[_];if(Array.isArray(C))for(let R=0,I=C.length;R<I;R++)f(C[R],_,R,P);else f(C,_,0,P)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,A,T,P){if(v(M,A,T,P)===!0){const _=M.__offset,S=M.value;if(Array.isArray(S)){let C=0;for(let R=0;R<S.length;R++){const I=S[R],H=g(I);p(I,M.__data,C),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(C+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(S,M.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,_,M.__data)}}function p(M,A,T){typeof M=="number"||typeof M=="boolean"?A[0]=M:M.isMatrix3?(A[0]=M.elements[0],A[1]=M.elements[1],A[2]=M.elements[2],A[3]=0,A[4]=M.elements[3],A[5]=M.elements[4],A[6]=M.elements[5],A[7]=0,A[8]=M.elements[6],A[9]=M.elements[7],A[10]=M.elements[8],A[11]=0):ArrayBuffer.isView(M)?A.set(new M.constructor(M.buffer,M.byteOffset,A.length)):M.toArray(A,T)}function v(M,A,T,P){const _=M.value,S=A+"_"+T;if(P[S]===void 0)return typeof _=="number"||typeof _=="boolean"?P[S]=_:ArrayBuffer.isView(_)?P[S]=_.slice():P[S]=_.clone(),!0;{const C=P[S];if(typeof _=="number"||typeof _=="boolean"){if(C!==_)return P[S]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(C.equals(_)===!1)return C.copy(_),!0}}return!1}function m(M){const A=M.uniforms;let T=0;const P=16;for(let S=0,C=A.length;S<C;S++){const R=Array.isArray(A[S])?A[S]:[A[S]];for(let I=0,H=R.length;I<H;I++){const W=R[I],N=Array.isArray(W.value)?W.value:[W.value];for(let Y=0,k=N.length;Y<k;Y++){const J=N[Y],te=g(J),ie=T%P,ce=ie%te.boundary,fe=ie+ce;T+=ce,fe!==0&&P-fe<te.storage&&(T+=P-fe),W.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=T,T+=te.storage}}}const _=T%P;return _>0&&(T+=P-_),M.__size=T,M.__cache={},this}function g(M){const A={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(A.boundary=4,A.storage=4):M.isVector2?(A.boundary=8,A.storage=8):M.isVector3||M.isColor?(A.boundary=16,A.storage=12):M.isVector4?(A.boundary=16,A.storage=16):M.isMatrix3?(A.boundary=48,A.storage=48):M.isMatrix4?(A.boundary=64,A.storage=64):M.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(A.boundary=16,A.storage=M.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",M),A}function E(M){const A=M.target;A.removeEventListener("dispose",E);const T=a.indexOf(A.__bindingPointIndex);a.splice(T,1),n.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function b(){for(const M in s)n.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:l,update:c,dispose:b}}const Ey=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let cn=null;function by(){return cn===null&&(cn=new $_(Ey,16,16,oi,Rn),cn.name="DFG_LUT",cn.minFilter=Pt,cn.magFilter=Pt,cn.wrapS=bn,cn.wrapT=bn,cn.generateMipmaps=!1,cn.needsUpdate=!0),cn}class Ty{constructor(e={}){const{canvas:t=o_(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=$t}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const v=f,m=new Set([wo,Ao,To]),g=new Set([$t,_n,cs,ds,Eo,bo]),E=new Uint32Array(4),b=new Int32Array(4),M=new O;let A=null,T=null;const P=[],_=[];let S=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=pn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let R=!1,I=null,H=null,W=null,N=null;this._outputColorSpace=Wt;let Y=0,k=0,J=null,te=-1,ie=null;const ce=new rt,fe=new rt;let De=null;const Oe=new Ge(0);let Ve=0,K=t.width,$=t.height,F=1,ne=null,se=null;const re=new rt(0,0,K,$),Pe=new rt(0,0,K,$);let Re=!1;const Qe=new Do;let Ye=!1,We=!1;const pt=new st,_t=new O,St=new rt,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ot=!1;function mt(){return J===null?F:1}let D=i;function Ft(y,U){return t.getContext(y,U)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${So}`),t.addEventListener("webglcontextlost",lt,!1),t.addEventListener("webglcontextrestored",tt,!1),t.addEventListener("webglcontextcreationerror",sn,!1),D===null){const U="webgl2";if(D=Ft(U,y),D===null)throw Ft(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(y){throw Xe("WebGLRenderer: "+y.message),y}let qe,w,x,B,G,q,ae,le,Z,j,de,be,pe,ue,we,Ie,Ue,L,oe,Q,he,xe,ee;function Ee(){qe=new bM(D),qe.init(),he=new my(D,qe),w=new gM(D,qe,e,he),x=new fy(D,qe),w.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),H=D.createFramebuffer(),W=D.createFramebuffer(),N=D.createFramebuffer(),B=new wM(D),G=new jS,q=new py(D,qe,x,G,w,he,B),ae=new EM(C),le=new I0(D),xe=new pM(D,le),Z=new TM(D,le,B,xe),j=new CM(D,Z,le,xe,B),L=new RM(D,w,q),we=new _M(G),de=new QS(C,ae,qe,w,xe,we),be=new Sy(C,G),pe=new ty,ue=new oy(qe),Ue=new fM(C,ae,x,j,p,l),Ie=new hy(C,j,w),ee=new yy(D,B,w,x),oe=new mM(D,qe,B),Q=new AM(D,qe,B),B.programs=de.programs,C.capabilities=w,C.extensions=qe,C.properties=G,C.renderLists=pe,C.shadowMap=Ie,C.state=x,C.info=B}Ee(),v!==$t&&(S=new IM(v,t.width,t.height,o,s,r));const Se=new vy(C,D);this.xr=Se,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const y=qe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=qe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(y){y!==void 0&&(F=y,this.setSize(K,$,!1))},this.getSize=function(y){return y.set(K,$)},this.setSize=function(y,U,X=!0){if(Se.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}K=y,$=U,t.width=Math.floor(y*F),t.height=Math.floor(U*F),X===!0&&(t.style.width=y+"px",t.style.height=U+"px"),S!==null&&S.setSize(t.width,t.height),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set(K*F,$*F).floor()},this.setDrawingBufferSize=function(y,U,X){K=y,$=U,F=X,t.width=Math.floor(y*X),t.height=Math.floor(U*X),this.setViewport(0,0,y,U)},this.setEffects=function(y){if(v===$t){Xe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let U=0;U<y.length;U++)if(y[U].isOutputPass===!0){Ce("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}S.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(ce)},this.getViewport=function(y){return y.copy(re)},this.setViewport=function(y,U,X,V){y.isVector4?re.set(y.x,y.y,y.z,y.w):re.set(y,U,X,V),x.viewport(ce.copy(re).multiplyScalar(F).round())},this.getScissor=function(y){return y.copy(Pe)},this.setScissor=function(y,U,X,V){y.isVector4?Pe.set(y.x,y.y,y.z,y.w):Pe.set(y,U,X,V),x.scissor(fe.copy(Pe).multiplyScalar(F).round())},this.getScissorTest=function(){return Re},this.setScissorTest=function(y){x.setScissorTest(Re=y)},this.setOpaqueSort=function(y){ne=y},this.setTransparentSort=function(y){se=y},this.getClearColor=function(y){return y.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(y=!0,U=!0,X=!0){let V=0;if(y){let z=!1;if(J!==null){const _e=J.texture.format;z=m.has(_e)}if(z){const _e=J.texture.type,Me=g.has(_e),ge=Ue.getClearColor(),ye=Ue.getClearAlpha(),Te=ge.r,Fe=ge.g,ke=ge.b;Me?(E[0]=Te,E[1]=Fe,E[2]=ke,E[3]=ye,D.clearBufferuiv(D.COLOR,0,E)):(b[0]=Te,b[1]=Fe,b[2]=ke,b[3]=ye,D.clearBufferiv(D.COLOR,0,b))}else V|=D.COLOR_BUFFER_BIT}U&&(V|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(V|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&D.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),I=y},this.dispose=function(){t.removeEventListener("webglcontextlost",lt,!1),t.removeEventListener("webglcontextrestored",tt,!1),t.removeEventListener("webglcontextcreationerror",sn,!1),Ue.dispose(),pe.dispose(),ue.dispose(),G.dispose(),ae.dispose(),j.dispose(),xe.dispose(),ee.dispose(),de.dispose(),Se.dispose(),Se.removeEventListener("sessionstart",Ho),Se.removeEventListener("sessionend",Wo),qn.stop()};function lt(y){y.preventDefault(),El("WebGLRenderer: Context Lost."),R=!0}function tt(){El("WebGLRenderer: Context Restored."),R=!1;const y=B.autoReset,U=Ie.enabled,X=Ie.autoUpdate,V=Ie.needsUpdate,z=Ie.type;Ee(),B.autoReset=y,Ie.enabled=U,Ie.autoUpdate=X,Ie.needsUpdate=V,Ie.type=z}function sn(y){Xe("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function rn(y){const U=y.target;U.removeEventListener("dispose",rn),Gd(U)}function Gd(y){Hd(y),G.remove(y)}function Hd(y){const U=G.get(y).programs;U!==void 0&&(U.forEach(function(X){de.releaseProgram(X)}),y.isShaderMaterial&&de.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,X,V,z,_e){U===null&&(U=bt);const Me=z.isMesh&&z.matrixWorld.determinantAffine()<0,ge=Xd(y,U,X,V,z);x.setMaterial(V,Me);let ye=X.index,Te=1;if(V.wireframe===!0){if(ye=Z.getWireframeAttribute(X),ye===void 0)return;Te=2}const Fe=X.drawRange,ke=X.attributes.position;let Ae=Fe.start*Te,Ke=(Fe.start+Fe.count)*Te;_e!==null&&(Ae=Math.max(Ae,_e.start*Te),Ke=Math.min(Ke,(_e.start+_e.count)*Te)),ye!==null?(Ae=Math.max(Ae,0),Ke=Math.min(Ke,ye.count)):ke!=null&&(Ae=Math.max(Ae,0),Ke=Math.min(Ke,ke.count));const dt=Ke-Ae;if(dt<0||dt===1/0)return;xe.setup(z,V,ge,X,ye);let ct,je=oe;if(ye!==null&&(ct=le.get(ye),je=Q,je.setIndex(ct)),z.isMesh)V.wireframe===!0?(x.setLineWidth(V.wireframeLinewidth*mt()),je.setMode(D.LINES)):je.setMode(D.TRIANGLES);else if(z.isLine){let At=V.linewidth;At===void 0&&(At=1),x.setLineWidth(At*mt()),z.isLineSegments?je.setMode(D.LINES):z.isLineLoop?je.setMode(D.LINE_LOOP):je.setMode(D.LINE_STRIP)}else z.isPoints?je.setMode(D.POINTS):z.isSprite&&je.setMode(D.TRIANGLES);if(z.isBatchedMesh)if(qe.get("WEBGL_multi_draw"))je.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const At=z._multiDrawStarts,ve=z._multiDrawCounts,zt=z._multiDrawCount,$e=ye?le.get(ye).bytesPerElement:1,Xt=G.get(V).currentProgram.getUniforms();for(let an=0;an<zt;an++)Xt.setValue(D,"_gl_DrawID",an),je.render(At[an]/$e,ve[an])}else if(z.isInstancedMesh)je.renderInstances(Ae,dt,z.count);else if(X.isInstancedBufferGeometry){const At=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,ve=Math.min(X.instanceCount,At);je.renderInstances(Ae,dt,ve)}else je.render(Ae,dt)};function Go(y,U,X){y.transparent===!0&&y.side===un&&y.forceSinglePass===!1?(y.side=Vt,y.needsUpdate=!0,Ss(y,U,X),y.side=Wn,y.needsUpdate=!0,Ss(y,U,X),y.side=un):Ss(y,U,X)}this.compile=function(y,U,X=null){X===null&&(X=y),T=ue.get(X),T.init(U),_.push(T),X.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(T.pushLight(z),z.castShadow&&T.pushShadow(z))}),y!==X&&y.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(T.pushLight(z),z.castShadow&&T.pushShadow(z))}),T.setupLights();const V=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const _e=z.material;if(_e)if(Array.isArray(_e))for(let Me=0;Me<_e.length;Me++){const ge=_e[Me];Go(ge,X,z),V.add(ge)}else Go(_e,X,z),V.add(_e)}),T=_.pop(),V},this.compileAsync=function(y,U,X=null){const V=this.compile(y,U,X);return new Promise(z=>{function _e(){if(V.forEach(function(Me){G.get(Me).currentProgram.isReady()&&V.delete(Me)}),V.size===0){z(y);return}setTimeout(_e,10)}qe.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Pr=null;function Wd(y){Pr&&Pr(y)}function Ho(){qn.stop()}function Wo(){qn.start()}const qn=new Id;qn.setAnimationLoop(Wd),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(y){Pr=y,Se.setAnimationLoop(y),y===null?qn.stop():qn.start()},Se.addEventListener("sessionstart",Ho),Se.addEventListener("sessionend",Wo),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){Xe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;I!==null&&I.renderStart(y,U);const X=Se.enabled===!0&&Se.isPresenting===!0,V=S!==null&&(J===null||X)&&S.begin(C,J);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Se.enabled===!0&&Se.isPresenting===!0&&(S===null||S.isCompositing()===!1)&&(Se.cameraAutoUpdate===!0&&Se.updateCamera(U),U=Se.getCamera()),y.isScene===!0&&y.onBeforeRender(C,y,U,J),T=ue.get(y,_.length),T.init(U),T.state.textureUnits=q.getTextureUnits(),_.push(T),pt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Qe.setFromProjectionMatrix(pt,fn,U.reversedDepth),We=this.localClippingEnabled,Ye=we.init(this.clippingPlanes,We),A=pe.get(y,P.length),A.init(),P.push(A),Se.enabled===!0&&Se.isPresenting===!0){const Me=C.xr.getDepthSensingMesh();Me!==null&&Ir(Me,U,-1/0,C.sortObjects)}Ir(y,U,0,C.sortObjects),A.finish(),C.sortObjects===!0&&A.sort(ne,se,U.reversedDepth),ot=Se.enabled===!1||Se.isPresenting===!1||Se.hasDepthSensing()===!1,ot&&Ue.addToRenderList(A,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ye===!0&&we.beginShadows();const z=T.state.shadowsArray;if(Ie.render(z,y,U),Ye===!0&&we.endShadows(),(V&&S.hasRenderPass())===!1){const Me=A.opaque,ge=A.transmissive;if(T.setupLights(),U.isArrayCamera){const ye=U.cameras;if(ge.length>0)for(let Te=0,Fe=ye.length;Te<Fe;Te++){const ke=ye[Te];Xo(Me,ge,y,ke)}ot&&Ue.render(y);for(let Te=0,Fe=ye.length;Te<Fe;Te++){const ke=ye[Te];$o(A,y,ke,ke.viewport)}}else ge.length>0&&Xo(Me,ge,y,U),ot&&Ue.render(y),$o(A,y,U)}J!==null&&k===0&&(q.updateMultisampleRenderTarget(J),q.updateRenderTargetMipmap(J)),V&&S.end(C),y.isScene===!0&&y.onAfterRender(C,y,U),xe.resetDefaultState(),te=-1,ie=null,_.pop(),_.length>0?(T=_[_.length-1],q.setTextureUnits(T.state.textureUnits),Ye===!0&&we.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,P.pop(),P.length>0?A=P[P.length-1]:A=null,I!==null&&I.renderEnd()};function Ir(y,U,X,V){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)X=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLightProbeGrid)T.pushLightProbeGrid(y);else if(y.isLight)T.pushLight(y),y.castShadow&&T.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Qe.intersectsSprite(y)){V&&St.setFromMatrixPosition(y.matrixWorld).applyMatrix4(pt);const Me=j.update(y),ge=y.material;ge.visible&&A.push(y,Me,ge,X,St.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Qe.intersectsObject(y))){const Me=j.update(y),ge=y.material;if(V&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),St.copy(y.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),St.copy(Me.boundingSphere.center)),St.applyMatrix4(y.matrixWorld).applyMatrix4(pt)),Array.isArray(ge)){const ye=Me.groups;for(let Te=0,Fe=ye.length;Te<Fe;Te++){const ke=ye[Te],Ae=ge[ke.materialIndex];Ae&&Ae.visible&&A.push(y,Me,Ae,X,St.z,ke)}}else ge.visible&&A.push(y,Me,ge,X,St.z,null)}}const _e=y.children;for(let Me=0,ge=_e.length;Me<ge;Me++)Ir(_e[Me],U,X,V)}function $o(y,U,X,V){const{opaque:z,transmissive:_e,transparent:Me}=y;T.setupLightsView(X),Ye===!0&&we.setGlobalState(C.clippingPlanes,X),V&&x.viewport(ce.copy(V)),z.length>0&&Ms(z,U,X),_e.length>0&&Ms(_e,U,X),Me.length>0&&Ms(Me,U,X),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Xo(y,U,X,V){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[V.id]===void 0){const Ae=qe.has("EXT_color_buffer_half_float")||qe.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[V.id]=new mn(1,1,{generateMipmaps:!0,type:Ae?Rn:$t,minFilter:ii,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:He.workingColorSpace})}const _e=T.state.transmissionRenderTarget[V.id],Me=V.viewport||ce;_e.setSize(Me.z*C.transmissionResolutionScale,Me.w*C.transmissionResolutionScale);const ge=C.getRenderTarget(),ye=C.getActiveCubeFace(),Te=C.getActiveMipmapLevel();C.setRenderTarget(_e),C.getClearColor(Oe),Ve=C.getClearAlpha(),Ve<1&&C.setClearColor(16777215,.5),C.clear(),ot&&Ue.render(X);const Fe=C.toneMapping;C.toneMapping=pn;const ke=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),T.setupLightsView(V),Ye===!0&&we.setGlobalState(C.clippingPlanes,V),Ms(y,X,V),q.updateMultisampleRenderTarget(_e),q.updateRenderTargetMipmap(_e),qe.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let Ke=0,dt=U.length;Ke<dt;Ke++){const ct=U[Ke],{object:je,geometry:At,material:ve,group:zt}=ct;if(ve.side===un&&je.layers.test(V.layers)){const $e=ve.side;ve.side=Vt,ve.needsUpdate=!0,Yo(je,X,V,At,ve,zt),ve.side=$e,ve.needsUpdate=!0,Ae=!0}}Ae===!0&&(q.updateMultisampleRenderTarget(_e),q.updateRenderTargetMipmap(_e))}C.setRenderTarget(ge,ye,Te),C.setClearColor(Oe,Ve),ke!==void 0&&(V.viewport=ke),C.toneMapping=Fe}function Ms(y,U,X){const V=U.isScene===!0?U.overrideMaterial:null;for(let z=0,_e=y.length;z<_e;z++){const Me=y[z],{object:ge,geometry:ye,group:Te}=Me;let Fe=Me.material;Fe.allowOverride===!0&&V!==null&&(Fe=V),ge.layers.test(X.layers)&&Yo(ge,U,X,ye,Fe,Te)}}function Yo(y,U,X,V,z,_e){y.onBeforeRender(C,U,X,V,z,_e),y.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(C,U,X,V,y,_e),z.transparent===!0&&z.side===un&&z.forceSinglePass===!1?(z.side=Vt,z.needsUpdate=!0,C.renderBufferDirect(X,U,V,z,y,_e),z.side=Wn,z.needsUpdate=!0,C.renderBufferDirect(X,U,V,z,y,_e),z.side=un):C.renderBufferDirect(X,U,V,z,y,_e),y.onAfterRender(C,U,X,V,z,_e)}function Ss(y,U,X){U.isScene!==!0&&(U=bt);const V=G.get(y),z=T.state.lights,_e=T.state.shadowsArray,Me=z.state.version,ge=de.getParameters(y,z.state,_e,U,X,T.state.lightProbeGridArray),ye=de.getProgramCacheKey(ge);let Te=V.programs;V.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?U.environment:null,V.fog=U.fog;const Fe=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;V.envMap=ae.get(y.envMap||V.environment,Fe),V.envMapRotation=V.environment!==null&&y.envMap===null?U.environmentRotation:y.envMapRotation,Te===void 0&&(y.addEventListener("dispose",rn),Te=new Map,V.programs=Te);let ke=Te.get(ye);if(ke!==void 0){if(V.currentProgram===ke&&V.lightsStateVersion===Me)return Zo(y,ge),ke}else ge.uniforms=de.getUniforms(y),I!==null&&y.isNodeMaterial&&I.build(y,X,ge),y.onBeforeCompile(ge,C),ke=de.acquireProgram(ge,ye),Te.set(ye,ke),V.uniforms=ge.uniforms;const Ae=V.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ae.clippingPlanes=we.uniform),Zo(y,ge),V.needsLights=qd(y),V.lightsStateVersion=Me,V.needsLights&&(Ae.ambientLightColor.value=z.state.ambient,Ae.lightProbe.value=z.state.probe,Ae.directionalLights.value=z.state.directional,Ae.directionalLightShadows.value=z.state.directionalShadow,Ae.spotLights.value=z.state.spot,Ae.spotLightShadows.value=z.state.spotShadow,Ae.rectAreaLights.value=z.state.rectArea,Ae.ltc_1.value=z.state.rectAreaLTC1,Ae.ltc_2.value=z.state.rectAreaLTC2,Ae.pointLights.value=z.state.point,Ae.pointLightShadows.value=z.state.pointShadow,Ae.hemisphereLights.value=z.state.hemi,Ae.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ae.spotLightMatrix.value=z.state.spotLightMatrix,Ae.spotLightMap.value=z.state.spotLightMap,Ae.pointShadowMatrix.value=z.state.pointShadowMatrix),V.lightProbeGrid=T.state.lightProbeGridArray.length>0,V.currentProgram=ke,V.uniformsList=null,ke}function qo(y){if(y.uniformsList===null){const U=y.currentProgram.getUniforms();y.uniformsList=or.seqWithValue(U.seq,y.uniforms)}return y.uniformsList}function Zo(y,U){const X=G.get(y);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function $d(y,U){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;M.setFromMatrixPosition(U.matrixWorld);for(let X=0,V=y.length;X<V;X++){const z=y[X];if(z.texture!==null&&z.boundingBox.containsPoint(M))return z}return null}function Xd(y,U,X,V,z){U.isScene!==!0&&(U=bt),q.resetTextureUnits();const _e=U.fog,Me=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?U.environment:null,ge=J===null?C.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:He.workingColorSpace,ye=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Te=ae.get(V.envMap||Me,ye),Fe=V.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ke=!!X.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ae=!!X.morphAttributes.position,Ke=!!X.morphAttributes.normal,dt=!!X.morphAttributes.color;let ct=pn;V.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(ct=C.toneMapping);const je=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,At=je!==void 0?je.length:0,ve=G.get(V),zt=T.state.lights;if(Ye===!0&&(We===!0||y!==ie)){const nt=y===ie&&V.id===te;we.setState(V,y,nt)}let $e=!1;V.version===ve.__version?(ve.needsLights&&ve.lightsStateVersion!==zt.state.version||ve.outputColorSpace!==ge||z.isBatchedMesh&&ve.batching===!1||!z.isBatchedMesh&&ve.batching===!0||z.isBatchedMesh&&ve.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&ve.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&ve.instancing===!1||!z.isInstancedMesh&&ve.instancing===!0||z.isSkinnedMesh&&ve.skinning===!1||!z.isSkinnedMesh&&ve.skinning===!0||z.isInstancedMesh&&ve.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&ve.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&ve.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&ve.instancingMorph===!1&&z.morphTexture!==null||ve.envMap!==Te||V.fog===!0&&ve.fog!==_e||ve.numClippingPlanes!==void 0&&(ve.numClippingPlanes!==we.numPlanes||ve.numIntersection!==we.numIntersection)||ve.vertexAlphas!==Fe||ve.vertexTangents!==ke||ve.morphTargets!==Ae||ve.morphNormals!==Ke||ve.morphColors!==dt||ve.toneMapping!==ct||ve.morphTargetsCount!==At||!!ve.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&($e=!0):($e=!0,ve.__version=V.version);let Xt=ve.currentProgram;$e===!0&&(Xt=Ss(V,U,z),I&&V.isNodeMaterial&&I.onUpdateProgram(V,Xt,ve));let an=!1,Pn=!1,di=!1;const et=Xt.getUniforms(),ut=ve.uniforms;if(x.useProgram(Xt.program)&&(an=!0,Pn=!0,di=!0),V.id!==te&&(te=V.id,Pn=!0),ve.needsLights){const nt=$d(T.state.lightProbeGridArray,z);ve.lightProbeGrid!==nt&&(ve.lightProbeGrid=nt,Pn=!0)}if(an||ie!==y){x.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),et.setValue(D,"projectionMatrix",y.projectionMatrix),et.setValue(D,"viewMatrix",y.matrixWorldInverse);const Ln=et.map.cameraPosition;Ln!==void 0&&Ln.setValue(D,_t.setFromMatrixPosition(y.matrixWorld)),w.logarithmicDepthBuffer&&et.setValue(D,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&et.setValue(D,"isOrthographic",y.isOrthographicCamera===!0),ie!==y&&(ie=y,Pn=!0,di=!0)}if(ve.needsLights&&(zt.state.directionalShadowMap.length>0&&et.setValue(D,"directionalShadowMap",zt.state.directionalShadowMap,q),zt.state.spotShadowMap.length>0&&et.setValue(D,"spotShadowMap",zt.state.spotShadowMap,q),zt.state.pointShadowMap.length>0&&et.setValue(D,"pointShadowMap",zt.state.pointShadowMap,q)),z.isSkinnedMesh){et.setOptional(D,z,"bindMatrix"),et.setOptional(D,z,"bindMatrixInverse");const nt=z.skeleton;nt&&(nt.boneTexture===null&&nt.computeBoneTexture(),et.setValue(D,"boneTexture",nt.boneTexture,q))}z.isBatchedMesh&&(et.setOptional(D,z,"batchingTexture"),et.setValue(D,"batchingTexture",z._matricesTexture,q),et.setOptional(D,z,"batchingIdTexture"),et.setValue(D,"batchingIdTexture",z._indirectTexture,q),et.setOptional(D,z,"batchingColorTexture"),z._colorsTexture!==null&&et.setValue(D,"batchingColorTexture",z._colorsTexture,q));const In=X.morphAttributes;if((In.position!==void 0||In.normal!==void 0||In.color!==void 0)&&L.update(z,X,Xt),(Pn||ve.receiveShadow!==z.receiveShadow)&&(ve.receiveShadow=z.receiveShadow,et.setValue(D,"receiveShadow",z.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&U.environment!==null&&(ut.envMapIntensity.value=U.environmentIntensity),ut.dfgLUT!==void 0&&(ut.dfgLUT.value=by()),Pn){if(et.setValue(D,"toneMappingExposure",C.toneMappingExposure),ve.needsLights&&Yd(ut,di),_e&&V.fog===!0&&be.refreshFogUniforms(ut,_e),be.refreshMaterialUniforms(ut,V,F,$,T.state.transmissionRenderTarget[y.id]),ve.needsLights&&ve.lightProbeGrid){const nt=ve.lightProbeGrid;ut.probesSH.value=nt.texture,ut.probesMin.value.copy(nt.boundingBox.min),ut.probesMax.value.copy(nt.boundingBox.max),ut.probesResolution.value.copy(nt.resolution)}or.upload(D,qo(ve),ut,q)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(or.upload(D,qo(ve),ut,q),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&et.setValue(D,"center",z.center),et.setValue(D,"modelViewMatrix",z.modelViewMatrix),et.setValue(D,"normalMatrix",z.normalMatrix),et.setValue(D,"modelMatrix",z.matrixWorld),V.uniformsGroups!==void 0){const nt=V.uniformsGroups;for(let Ln=0,ui=nt.length;Ln<ui;Ln++){const Ko=nt[Ln];ee.update(Ko,Xt),ee.bind(Ko,Xt)}}return Xt}function Yd(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function qd(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(y,U,X){const V=G.get(y);V.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),G.get(y.texture).__webglTexture=U,G.get(y.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:X,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,U){const X=G.get(y);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(y,U=0,X=0){J=y,Y=U,k=X;let V=null,z=!1,_e=!1;if(y){const ge=G.get(y);if(ge.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(D.FRAMEBUFFER,ge.__webglFramebuffer),ce.copy(y.viewport),fe.copy(y.scissor),De=y.scissorTest,x.viewport(ce),x.scissor(fe),x.setScissorTest(De),te=-1;return}else if(ge.__webglFramebuffer===void 0)q.setupRenderTarget(y);else if(ge.__hasExternalTextures)q.rebindTextures(y,G.get(y.texture).__webglTexture,G.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Fe=y.depthTexture;if(ge.__boundDepthTexture!==Fe){if(Fe!==null&&G.has(Fe)&&(y.width!==Fe.image.width||y.height!==Fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(y)}}const ye=y.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(_e=!0);const Te=G.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Te[U])?V=Te[U][X]:V=Te[U],z=!0):y.samples>0&&q.useMultisampledRTT(y)===!1?V=G.get(y).__webglMultisampledFramebuffer:Array.isArray(Te)?V=Te[X]:V=Te,ce.copy(y.viewport),fe.copy(y.scissor),De=y.scissorTest}else ce.copy(re).multiplyScalar(F).floor(),fe.copy(Pe).multiplyScalar(F).floor(),De=Re;if(X!==0&&(V=H),x.bindFramebuffer(D.FRAMEBUFFER,V)&&x.drawBuffers(y,V),x.viewport(ce),x.scissor(fe),x.setScissorTest(De),z){const ge=G.get(y.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,ge.__webglTexture,X)}else if(_e){const ge=U;for(let ye=0;ye<y.textures.length;ye++){const Te=G.get(y.textures[ye]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+ye,Te.__webglTexture,X,ge)}}else if(y!==null&&X!==0){const ge=G.get(y.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ge.__webglTexture,X)}te=-1},this.readRenderTargetPixels=function(y,U,X,V,z,_e,Me,ge=0){if(!(y&&y.isWebGLRenderTarget)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=G.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me]),ye){x.bindFramebuffer(D.FRAMEBUFFER,ye);try{const Te=y.textures[ge],Fe=Te.format,ke=Te.type;if(y.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ge),!w.textureFormatReadable(Fe)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!w.textureTypeReadable(ke)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-V&&X>=0&&X<=y.height-z&&D.readPixels(U,X,V,z,he.convert(Fe),he.convert(ke),_e)}finally{const Te=J!==null?G.get(J).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(y,U,X,V,z,_e,Me,ge=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=G.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me]),ye)if(U>=0&&U<=y.width-V&&X>=0&&X<=y.height-z){x.bindFramebuffer(D.FRAMEBUFFER,ye);const Te=y.textures[ge],Fe=Te.format,ke=Te.type;if(y.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+ge),!w.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!w.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ae=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ae),D.bufferData(D.PIXEL_PACK_BUFFER,_e.byteLength,D.STREAM_READ),D.readPixels(U,X,V,z,he.convert(Fe),he.convert(ke),0);const Ke=J!==null?G.get(J).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,Ke);const dt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await l_(D,dt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ae),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,_e),D.deleteBuffer(Ae),D.deleteSync(dt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,U=null,X=0){const V=Math.pow(2,-X),z=Math.floor(y.image.width*V),_e=Math.floor(y.image.height*V),Me=U!==null?U.x:0,ge=U!==null?U.y:0;q.setTexture2D(y,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,Me,ge,z,_e),x.unbindTexture()},this.copyTextureToTexture=function(y,U,X=null,V=null,z=0,_e=0){let Me,ge,ye,Te,Fe,ke,Ae,Ke,dt;const ct=y.isCompressedTexture?y.mipmaps[_e]:y.image;if(X!==null)Me=X.max.x-X.min.x,ge=X.max.y-X.min.y,ye=X.isBox3?X.max.z-X.min.z:1,Te=X.min.x,Fe=X.min.y,ke=X.isBox3?X.min.z:0;else{const ut=Math.pow(2,-z);Me=Math.floor(ct.width*ut),ge=Math.floor(ct.height*ut),y.isDataArrayTexture?ye=ct.depth:y.isData3DTexture?ye=Math.floor(ct.depth*ut):ye=1,Te=0,Fe=0,ke=0}V!==null?(Ae=V.x,Ke=V.y,dt=V.z):(Ae=0,Ke=0,dt=0);const je=he.convert(U.format),At=he.convert(U.type);let ve;U.isData3DTexture?(q.setTexture3D(U,0),ve=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(q.setTexture2DArray(U,0),ve=D.TEXTURE_2D_ARRAY):(q.setTexture2D(U,0),ve=D.TEXTURE_2D),x.activeTexture(D.TEXTURE0),x.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),x.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),x.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const zt=x.getParameter(D.UNPACK_ROW_LENGTH),$e=x.getParameter(D.UNPACK_IMAGE_HEIGHT),Xt=x.getParameter(D.UNPACK_SKIP_PIXELS),an=x.getParameter(D.UNPACK_SKIP_ROWS),Pn=x.getParameter(D.UNPACK_SKIP_IMAGES);x.pixelStorei(D.UNPACK_ROW_LENGTH,ct.width),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ct.height),x.pixelStorei(D.UNPACK_SKIP_PIXELS,Te),x.pixelStorei(D.UNPACK_SKIP_ROWS,Fe),x.pixelStorei(D.UNPACK_SKIP_IMAGES,ke);const di=y.isDataArrayTexture||y.isData3DTexture,et=U.isDataArrayTexture||U.isData3DTexture;if(y.isDepthTexture){const ut=G.get(y),In=G.get(U),nt=G.get(ut.__renderTarget),Ln=G.get(In.__renderTarget);x.bindFramebuffer(D.READ_FRAMEBUFFER,nt.__webglFramebuffer),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ln.__webglFramebuffer);for(let ui=0;ui<ye;ui++)di&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,G.get(y).__webglTexture,z,ke+ui),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,G.get(U).__webglTexture,_e,dt+ui)),D.blitFramebuffer(Te,Fe,Me,ge,Ae,Ke,Me,ge,D.DEPTH_BUFFER_BIT,D.NEAREST);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(z!==0||y.isRenderTargetTexture||G.has(y)){const ut=G.get(y),In=G.get(U);x.bindFramebuffer(D.READ_FRAMEBUFFER,W),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,N);for(let nt=0;nt<ye;nt++)di?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ut.__webglTexture,z,ke+nt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,ut.__webglTexture,z),et?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,In.__webglTexture,_e,dt+nt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,In.__webglTexture,_e),z!==0?D.blitFramebuffer(Te,Fe,Me,ge,Ae,Ke,Me,ge,D.COLOR_BUFFER_BIT,D.NEAREST):et?D.copyTexSubImage3D(ve,_e,Ae,Ke,dt+nt,Te,Fe,Me,ge):D.copyTexSubImage2D(ve,_e,Ae,Ke,Te,Fe,Me,ge);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else et?y.isDataTexture||y.isData3DTexture?D.texSubImage3D(ve,_e,Ae,Ke,dt,Me,ge,ye,je,At,ct.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(ve,_e,Ae,Ke,dt,Me,ge,ye,je,ct.data):D.texSubImage3D(ve,_e,Ae,Ke,dt,Me,ge,ye,je,At,ct):y.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,_e,Ae,Ke,Me,ge,je,At,ct.data):y.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,_e,Ae,Ke,ct.width,ct.height,je,ct.data):D.texSubImage2D(D.TEXTURE_2D,_e,Ae,Ke,Me,ge,je,At,ct);x.pixelStorei(D.UNPACK_ROW_LENGTH,zt),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,$e),x.pixelStorei(D.UNPACK_SKIP_PIXELS,Xt),x.pixelStorei(D.UNPACK_SKIP_ROWS,an),x.pixelStorei(D.UNPACK_SKIP_IMAGES,Pn),_e===0&&U.generateMipmaps&&D.generateMipmap(ve),x.unbindTexture()},this.initRenderTarget=function(y){G.get(y).__webglFramebuffer===void 0&&q.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?q.setTextureCube(y,0):y.isData3DTexture?q.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?q.setTexture2DArray(y,0):q.setTexture2D(y,0),x.unbindTexture()},this.resetState=function(){Y=0,k=0,J=null,x.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=He._getDrawingBufferColorSpace(e),t.unpackColorSpace=He._getUnpackColorSpace()}}const wc={type:"change"},Fo={type:"start"},kd={type:"end"},Qs=new Tr,Rc=new kn,Ay=Math.cos(70*pd.DEG2RAD),xt=new O,Ot=2*Math.PI,Je={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},pa=1e-6;class wy extends C0{constructor(e,t=null){super(e,t),this.state=Je.NONE,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ci.ROTATE,MIDDLE:Ci.DOLLY,RIGHT:Ci.PAN},this.touches={ONE:Ri.ROTATE,TWO:Ri.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new $n,this._lastTargetPosition=new O,this._quat=new $n().setFromUnitVectors(e.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new tc,this._sphericalDelta=new tc,this._scale=1,this._panOffset=new O,this._rotateStart=new Le,this._rotateEnd=new Le,this._rotateDelta=new Le,this._panStart=new Le,this._panEnd=new Le,this._panDelta=new Le,this._dollyStart=new Le,this._dollyEnd=new Le,this._dollyDelta=new Le,this._dollyDirection=new O,this._mouse=new Le,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Cy.bind(this),this._onPointerDown=Ry.bind(this),this._onPointerUp=Py.bind(this),this._onContextMenu=Oy.bind(this),this._onMouseWheel=Dy.bind(this),this._onKeyDown=Ny.bind(this),this._onTouchStart=Uy.bind(this),this._onTouchMove=Fy.bind(this),this._onMouseDown=Iy.bind(this),this._onMouseMove=Ly.bind(this),this._interceptControlDown=By.bind(this),this._interceptControlUp=ky.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(wc),this.update(),this.state=Je.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;xt.copy(t).sub(this.target),xt.applyQuaternion(this._quat),this._spherical.setFromVector3(xt),this.autoRotate&&this.state===Je.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Ot:i>Math.PI&&(i-=Ot),s<-Math.PI?s+=Ot:s>Math.PI&&(s-=Ot),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(xt.setFromSpherical(this._spherical),xt.applyQuaternion(this._quatInverse),t.copy(this.target).add(xt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=xt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new O(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new O(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=xt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Qs.origin.copy(this.object.position),Qs.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Qs.direction))<Ay?this.object.lookAt(this.target):(Rc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Qs.intersectPlane(Rc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>pa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>pa||this._lastTargetPosition.distanceToSquared(this.target)>pa?(this.dispatchEvent(wc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Ot/60*this.autoRotateSpeed*e:Ot/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){xt.setFromMatrixColumn(t,0),xt.multiplyScalar(-e),this._panOffset.add(xt)}_panUp(e,t){this.screenSpacePanning===!0?xt.setFromMatrixColumn(t,1):(xt.setFromMatrixColumn(t,0),xt.crossVectors(this.object.up,xt)),xt.multiplyScalar(e),this._panOffset.add(xt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;xt.copy(s).sub(this.target);let r=xt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ot*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ot*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Ot*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ot*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ot*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Le,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Ry(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Cy(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Py(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(kd),this.state=Je.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Iy(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ci.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Je.DOLLY;break;case Ci.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Je.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Je.ROTATE}break;case Ci.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Je.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Je.PAN}break;default:this.state=Je.NONE}this.state!==Je.NONE&&this.dispatchEvent(Fo)}function Ly(n){switch(this.state){case Je.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Je.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Je.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Dy(n){this.enabled===!1||this.enableZoom===!1||this.state!==Je.NONE||(n.preventDefault(),this.dispatchEvent(Fo),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(kd))}function Ny(n){this.enabled!==!1&&this._handleKeyDown(n)}function Uy(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ri.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Je.TOUCH_ROTATE;break;case Ri.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Je.TOUCH_PAN;break;default:this.state=Je.NONE}break;case 2:switch(this.touches.TWO){case Ri.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Je.TOUCH_DOLLY_PAN;break;case Ri.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Je.TOUCH_DOLLY_ROTATE;break;default:this.state=Je.NONE}break;default:this.state=Je.NONE}this.state!==Je.NONE&&this.dispatchEvent(Fo)}function Fy(n){switch(this._trackPointer(n),this.state){case Je.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Je.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Je.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Je.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Je.NONE}}function Oy(n){this.enabled!==!1&&n.preventDefault()}function By(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function ky(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Vy=Object.freeze({invalid:12986408,unsupported:14067456}),zy={boundary:1842204,cut:0,hingeMountain:2894892,hingeValley:4473924,hingeUnassigned:3158064,flatSeam:6052956,link:2368548,sectorRay:1118481};function Gy(n,e){const t=new is;t.name="engine-lab-frame";const i=new Map;for(const s of n.faces){$y(s.id,s.vertices);const r=ga(s.sourceEntities??[],e),a=new Ut;a.setAttribute("position",new Nt(s.vertices.flat(),3));const o=Hy(s.vertices);a.setIndex(o),a.computeVertexNormals();const l=new M0({color:_a(r)??14211288,metalness:0,roughness:.82,opacity:.72,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,side:un}),c=new nn(a,l);c.renderOrder=0,ma(c,s.id,"face",s.sourceEntities??[],r,i,t),s.sourceOperationId!==void 0&&(c.userData.sourceOperationId=s.sourceOperationId)}for(const s of n.segments){lr(s.id,s.start),lr(s.id,s.end);const r=ga(s.sourceEntities??[],e),a=new Ut().setFromPoints([new O(...s.start),new O(...s.end)]),o=Wy(s.role,_a(r)??zy[s.role]),l=new fo(a,o);l.renderOrder=1,o instanceof ar&&l.computeLineDistances(),ma(l,s.id,s.role,s.sourceEntities??[],r,i,t)}for(const s of n.points){lr(s.id,s.position);const r=ga(s.sourceEntities??[],e),a=new Ut;a.setAttribute("position",new Nt(s.position,3));const o=new Sd({color:_a(r)??(s.role==="junction"?0:s.role==="anchor"?2236962:3355443),size:.055,sizeAttenuation:!0}),l=new Wl(a,o);l.renderOrder=2,ma(l,s.id,s.role,s.sourceEntities??[],r,i,t)}return{group:t,objectByPrimitiveId:i,dispose(){for(const s of i.values())if(s instanceof nn||s instanceof fo||s instanceof Wl){s.geometry.dispose();const r=Array.isArray(s.material)?s.material:[s.material];for(const a of r)a.dispose()}t.clear(),i.clear()}}}function Hy(n){const e=n.reduce((s,r,a)=>{const o=n[(a+1)%n.length];return[s[0]+(r[1]-o[1])*(r[2]+o[2]),s[1]+(r[2]-o[2])*(r[0]+o[0]),s[2]+(r[0]-o[0])*(r[1]+o[1])]},[0,0,0]),t=Math.abs(e[0])>=Math.abs(e[1])&&Math.abs(e[0])>=Math.abs(e[2])?0:Math.abs(e[1])>=Math.abs(e[2])?1:2,i=n.map(s=>t===0?new Le(s[1],s[2]):t===1?new Le(s[0],s[2]):new Le(s[0],s[1]));return No.triangulateShape(i,[]).flat()}function ma(n,e,t,i,s,r,a){if(r.has(e))throw new RangeError(`Duplicate lab primitive ID: ${e}.`);n.name=e,n.userData.primitiveId=e,n.userData.role=t,n.userData.sourceEntities=i.map(o=>({...o})),s!==void 0&&(n.userData.diagnosticState=s),r.set(e,n),a.add(n)}function Wy(n,e){return n==="hingeMountain"?new ar({color:e,dashSize:.08,gapSize:.025}):n==="hingeValley"?new ar({color:e,dashSize:.025,gapSize:.04}):n==="hingeUnassigned"?new ar({color:e,dashSize:.04,gapSize:.04}):new Ar({color:e})}function ga(n,e){if(e===void 0||e.disposition==="accepted")return;const t=e.diagnostics.flatMap(i=>i.locations.some(r=>r.kind==="entity"&&n.some(a=>Cc(a)===Cc(r.entity)))?[i.category==="unsupported"?"unsupported":"invalid"]:[]);return t.includes("invalid")?"invalid":t.includes("unsupported")?"unsupported":void 0}function _a(n){return n===void 0?void 0:Vy[n]}function Cc(n){return`${n.kind}\0${n.id}`}function $y(n,e){if(e.length<3)throw new RangeError(`Face ${n} requires at least three vertices.`);for(const t of e)lr(n,t)}function lr(n,e){if(e.length!==3||!e.every(Number.isFinite))throw new RangeError(`Primitive ${n} requires finite 3D coordinates.`)}const Pc=Object.freeze({gridCenter:13948116,grid:15658734});function Xy(n){const e=new Ty({antialias:!0,alpha:!1});e.setClearColor(16777215,1),e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.outputColorSpace=Wt,n.append(e.domElement);const t=new k_;t.fog=new Lo(16777215,.018);const i=new Zt(42,1,.01,1e3);i.position.set(6,5,7);const s=new wy(i,e.domElement);s.enableDamping=!0,s.dampingFactor=.08,s.screenSpacePanning=!0,t.add(new T0(16777215,1.2));const r=new ec(16777215,2.5);r.position.set(4,7,5),t.add(r);const a=new ec(16777215,1.1);a.position.set(-5,2,-4),t.add(a);const o=new R0(24,24,Pc.gridCenter,Pc.grid);o.position.y=-.002,t.add(o);let l,c=!1;const u=()=>{const d=Math.max(n.clientWidth,1),f=Math.max(n.clientHeight,1);e.setSize(d,f,!1),i.aspect=d/f,i.updateProjectionMatrix()},h=new ResizeObserver(u);return h.observe(n),u(),e.setAnimationLoop(()=>{s.update(),e.render(t,i)}),{show(d,f){l?.dispose(),l&&t.remove(l.group),l=Gy(d,f),t.add(l.group)},focus(){if(!l)return;const d=new zi().setFromObject(l.group);if(d.isEmpty()){s.target.set(0,0,0),i.position.set(6,5,7),s.update();return}const f=d.getCenter(new O),p=d.getSize(new O),m=Math.max(p.length()*.5,.5)/Math.sin(pd.degToRad(i.fov*.5)),g=new O(1.15,.85,1.35).normalize();s.target.copy(f),i.position.copy(f).addScaledVector(g,m*1.15),i.near=Math.max(m/1e3,.001),i.far=Math.max(m*100,100),i.updateProjectionMatrix(),s.update()},resize:u,dispose(){c||(c=!0,h.disconnect(),e.setAnimationLoop(null),s.dispose(),l?.dispose(),e.dispose(),e.domElement.remove())}}}const Ic={width:210,height:297},Yy={width:297,height:210},Vd=10;function qy(n,e=Vd){const t=n.faces.length>0?n.faces.flatMap(a=>a.vertices):n.segments.flatMap(a=>[a.start,a.end]);if(t.length===0)throw new RangeError("Fabrication frame is empty.");const i=Ky(t),s=t.map(a=>[a[i[0]],a[i[1]]]),r={minX:Math.min(...s.map(([a])=>a)),minY:Math.min(...s.map(([,a])=>a)),maxX:Math.max(...s.map(([a])=>a)),maxY:Math.max(...s.map(([,a])=>a))};return{...Zy(r,e),bounds:r,axes:i}}function Zy(n,e=Vd){if(![n.minX,n.minY,n.maxX,n.maxY,e].every(Number.isFinite))throw new RangeError("Fabrication bounds and margin must be finite.");const i=n.maxX-n.minX,s=n.maxY-n.minY;if(i<=0||s<=0)throw new RangeError("Fabrication bounds must have positive area.");if(e<0||e*2>=Ic.width)throw new RangeError("A4 print margin leaves no printable area.");const r=["portrait","landscape"].map(l=>{const c=l==="portrait"?Ic:Yy,u=Math.min((c.width-e*2)/i,(c.height-e*2)/s);return{orientation:l,pageMm:c,scale:u}}),a=r[1].scale>r[0].scale?r[1]:r[0],o={width:i*a.scale,height:s*a.scale};return{...a,marginMm:e,contentMm:o,offsetMm:{x:(a.pageMm.width-o.width)/2,y:(a.pageMm.height-o.height)/2},bounds:n,axes:[0,1]}}function Lc(n,e){return[e.offsetMm.x+(n[e.axes[0]]-e.bounds.minX)*e.scale,e.offsetMm.y+(n[e.axes[1]]-e.bounds.minY)*e.scale]}function Ky(n){const t=[0,1,2].map(i=>{const s=n.map(r=>r[i]);return{axis:i,range:Math.max(...s)-Math.min(...s)}}).sort((i,s)=>s.range-i.range||i.axis-s.axis).slice(0,2).map(({axis:i})=>i).sort((i,s)=>i-s);return[t[0],t[1]]}const Jy=new Set(["boundary","cut","hingeMountain","hingeValley","hingeUnassigned"]);function Qy(n,e={}){const t=qy(n,e.marginMm),i=n.segments.filter(o=>Jy.has(o.role)).map(o=>jy(o,t)),{width:s,height:r}=t.pageMm;return{svg:[`<svg xmlns="http://www.w3.org/2000/svg" width="${s}mm" height="${r}mm" viewBox="0 0 ${s} ${r}" role="img" aria-label="A4 flat fabrication template">`,"  <style>line{fill:none;stroke:#000;stroke-width:.25;vector-effect:non-scaling-stroke;stroke-linecap:butt}.boundary,.cut{stroke-dasharray:none}.fold{stroke-width:.2}.mountain{stroke-dasharray:6 2}.valley{stroke-dasharray:2 2}.unassigned{stroke-dasharray:4 2}</style>",...i,"</svg>"].join(`
`),orientation:t.orientation,pageMm:t.pageMm,layout:t}}function jy(n,e){const[t,i]=Lc(n.start,e),[s,r]=Lc(n.end,e);return`  <line data-edge-id="${tE(n.id)}" data-role="${n.role}" class="${eE(n.role)}" x1="${js(t)}" y1="${js(i)}" x2="${js(s)}" y2="${js(r)}" />`}function eE(n){switch(n){case"boundary":return"boundary";case"cut":return"cut";case"hingeMountain":return"fold mountain";case"hingeValley":return"fold valley";case"hingeUnassigned":return"fold unassigned";default:throw new RangeError(`Role ${n} is not printable.`)}}function js(n){const e=Math.abs(n)<1e-10?0:n;return Number(e.toFixed(6)).toString()}function tE(n){return n.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}const nE="iframe[data-fabrication-print]";function iE(n,e="Kirigami A4 fabrication template"){const t=n.orientation==="landscape"?"landscape":"portrait",{width:i,height:s}=n.pageMm;return`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${rE(e)}</title>
    <style>
      @page { size: A4 ${t}; margin: 0; }
      html, body {
        width: ${i}mm;
        height: ${s}mm;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: #fff;
      }
      svg { display: block; width: ${i}mm; height: ${s}mm; }
    </style>
  </head>
  <body>${n.svg}</body>
</html>`}function sE(n,e,t=document){t.querySelector(nE)?.remove();const i=t.createElement("iframe");return i.dataset.fabricationPrint="",i.title="A4 fabrication print surface",i.setAttribute("aria-hidden","true"),Object.assign(i.style,{position:"fixed",width:"1px",height:"1px",right:"0",bottom:"0",border:"0",opacity:"0",pointerEvents:"none"}),i.srcdoc=iE(n,e),i.addEventListener("load",()=>{const s=i.contentWindow;s&&(s.focus(),s.print())},{once:!0}),t.body.append(i),i}function rE(n){return n.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const aE={points:[],segments:[],faces:[]},er={width:1.2,stepCount:7,stepRun:.32,stepRise:.32,hostWidth:4,hostFloorExtent:2.56,hostWallExtent:2.56};function oE(n){n.innerHTML=`
    <main class="lab-shell">
      <header class="lab-header">
        <div>
          <span class="wordmark">KIRIGAMI</span>
          <h1>Engine Lab</h1>
        </div>
        <p>Validation corpus / engine-state viewer</p>
      </header>
      <aside class="catalog-panel" aria-label="Architectural module catalog">
        <details class="sidebar-group committed-examples">
          <summary><h2>Committed examples</h2><span>${Dr.length}</span></summary>
          <nav class="example-list"></nav>
        </details>
        <details class="sidebar-group stair-study" open>
          <summary><h2>Stairs</h2><span>4</span></summary>
          <p>Compiler construction strategies</p>
          <div class="stair-strategy-list"></div>
          <small>Play the same topology from flat pattern to deployed stair.</small>
        </details>
        <details class="sidebar-group stair-study">
          <summary><h2>Continuous surfaces</h2><span>3</span></summary>
          <p>Surface-bearing architectural units</p>
          <div class="stair-strategy-list module-list"></div>
        </details>
        <details class="sidebar-group stair-study">
          <summary><h2>Cutouts</h2><span>2</span></summary>
          <p>Openings in continuous material</p>
          <div class="stair-strategy-list cutout-list"></div>
        </details>
      </aside>
      <section class="viewport-panel" aria-label="Engine viewport">
        <div class="viewport-host"></div>
        <button class="viewport-print" type="button" aria-label="Print flat A4 template" title="Print the flat fabrication template on auto-oriented A4" disabled>Print</button>
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
  `;const e=Bt(n,".example-list"),t=Bt(n,".viewport-host"),i=Bt(n,".viewport-state"),s=Bt(n,".viewport-print"),r=Bt(n,".viewport-preview-label"),a=Bt(n,".stair-preview-label"),o=Bt(n,".stair-strategy-list"),l=Bt(n,".module-list"),c=Bt(n,".cutout-list"),u=Bt(n,".inspector-scroll"),h=Bt(n,".timeline-panel input[type='range']"),d=Bt(n,".timeline-panel output"),f=Bt(n,".timeline-markers"),p=Bt(n,".timeline-play"),v=[...n.querySelectorAll(".timeline-step")],m=Xy(t),g=km();let E=0,b,M,A,T,P=0,_,S,C="Kirigami A4 fabrication template";const R=($,F)=>{S=$,C=F??"Kirigami A4 fabrication template",s.disabled=$===void 0},I=()=>{_!==void 0&&window.clearInterval(_),_=void 0,p.ariaPressed="false",p.textContent="Play"},H=$=>$.points.length+$.segments.length+$.faces.length>0,W=($,F)=>{const ne=new Map;if($.result.observed.disposition!=="accepted")for(const re of $.result.diagnostics)for(const Pe of re.locations){if(Pe.kind!=="sample")continue;const Re=re.category==="unsupported"?"unsupported":"invalid";(Re==="invalid"||ne.get(Pe.index)===void 0)&&ne.set(Pe.index,Re)}const se=Math.max(F-1,...ne.keys(),0);f.replaceChildren(...[...ne.entries()].map(([re,Pe])=>{const Re=document.createElement("span");return Re.dataset.diagnosticState=Pe,Re.style.left=`${se===0?0:re/se*100}%`,Re.title=`${Pe} at sample ${re+1}`,Re.setAttribute("role","img"),Re.setAttribute("aria-label",Re.title),Re}))},N=($,F=!1)=>{const ne=M?.frames??b?.frames.map(Re=>Re.frame)??[],se=M?.parameters??b?.frames.map(Re=>Re.parameter)??[];if(ne.length===0)return;P=Math.max(0,Math.min($,ne.length-1));const re=ne[P];a.hidden=!M,r.hidden=!0,delete r.dataset.diagnosticState,m.show(re),F&&m.focus(),h.max=String(ne.length-1),h.value=String(P);const Pe=ne.length>1;h.disabled=!Pe,p.disabled=!Pe;for(const Re of v)Re.disabled=!Pe;b&&!M&&W(b,ne.length),d.value=`sample ${P+1}/${ne.length} · parameter ${lE(se[P]??0)}`},Y=$=>{P=0,h.value="0",h.max="0",h.disabled=!0,p.disabled=!0;for(const F of v)F.disabled=!0;d.value=$?"no renderable samples · previous geometry retained":"no engine samples"},k=$=>{i.hidden=$===void 0,i.textContent=$??""},J=$=>{Ym(u,b,$,{onParameterCommit(F,ne){if(!T)return;const se=zm(T,F,ne);if(!se.ok){J(se.diagnostics[0]?.message);return}T=se.example,te(se.example,{preserveGeometryOnEmpty:!0,focus:!1})},onReset(){A&&(T=A,te(A,{preserveGeometryOnEmpty:!0,focus:!1}))}})},te=async($,F)=>{I();const ne=++E;k(`Evaluating ${$.id}…`);try{const se=await g.evaluate($);if(ne!==E)return;b=se,T=se.example,P=0,J(),se.frames.some(({frame:Pe})=>H(Pe))?(R(se.frames.find(({frame:Pe})=>H(Pe))?.frame,`${se.example.title} — A4 fabrication template`),N(0,F.focus)):se.diagnosticPreview!==void 0&&!F.preserveGeometryOnEmpty?(m.show(se.diagnosticPreview.frame,{diagnostics:se.result.diagnostics,disposition:se.result.observed.disposition}),F.focus&&m.focus(),r.hidden=!1,r.dataset.diagnosticState=se.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=`${se.diagnosticPreview.label} · ${se.result.observed.disposition}`,Y(!1),W(se,0),d.value=`${se.diagnosticPreview.label} · no certified engine samples`):(F.preserveGeometryOnEmpty||R(),F.preserveGeometryOnEmpty||(m.show(aE),F.focus&&m.focus()),r.hidden=!1,r.dataset.diagnosticState=se.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=F.preserveGeometryOnEmpty?`${se.result.observed.disposition} input · previous certified geometry retained`:`${se.result.observed.disposition} · no spatial preview`,Y(F.preserveGeometryOnEmpty),W(se,0)),k()}catch(se){if(ne!==E)return;const re=se instanceof Error?se.message:String(se);J(re),k(`Engine error · ${re}`)}},ie=$=>{const F=Dr[$];if(F){for(const[ne,se]of[...e.querySelectorAll(".example-row")].entries())se.ariaPressed=String(ne===$);A=F.example,T=F.example,M=void 0,R(),a.hidden=!0,te(F.example,{preserveGeometryOnEmpty:!1,focus:!0})}},ce=()=>{I(),E+=1,b=void 0,r.hidden=!0,a.hidden=!1;const $={operationId:"certified-one-sheet-stair",hostPlane:"wall",...er},F=Bc($);if(!F.ok){u.textContent=F.diagnostics[0]?.message??"Stair rejected.";return}const ne=Xc({input:$,complex:F.complex,sourceMap:F.sourceMap,sampleCount:7});if(!ne.ok){u.textContent=ne.diagnostics[0]?.message??"Stair path rejected.";return}a.textContent="certified compiler result · One-sheet staircase";const se=ne.samples.map(re=>Km(F.complex,F.sourceMap,$,re.transforms));M={frames:se,parameters:ne.samples.map(re=>re.parameter)},R(se[0],"One-sheet staircase — A4 fabrication template"),m.show(se.at(-1)),m.focus(),u.innerHTML=`
      <section class="inspection-section">
        <h2>One-sheet staircase</h2>
        <p class="quiet">Certified as one connected material component after cuts: stair, bridges, and host remain materially joined.</p>
      </section>
      <section class="inspection-section">
        <h2>Construction</h2>
        <p class="quiet">${$.stepCount} steps · A4 flat fabrication sheet · ${F.sourceMap.faces.filter(re=>re.role==="step").length} retained step surfaces · ${F.sourceMap.cutPairs.length} paired cuts · ${F.sourceMap.voids.length} opening voids.</p>
        <p class="quiet">Construction status: certified connected sheet.</p>
      </section>
    `,N(se.length-1)},fe=document.createElement("button");fe.type="button",fe.className="stair-strategy-button",fe.ariaPressed="false",fe.textContent="One-sheet staircase",fe.addEventListener("click",()=>{fe.ariaPressed="true",ce()}),o.append(fe);const De=document.createElement("button");De.type="button",De.className="stair-strategy-button",De.ariaPressed="false",De.textContent="Tread-only staircase",De.addEventListener("click",()=>{I(),E+=1,b=void 0,r.hidden=!0,a.hidden=!1;const $={operationId:"tread-only-stair",...er},F=Mo($);if(!F.ok){u.textContent=F.diagnostics[0]?.message??"Tread-only pattern rejected.";return}const ne=Er({input:$,complex:F.complex,sourceMap:F.sourceMap,sampleCount:7});if(!ne.ok){u.textContent=ne.diagnostics[0]?.message??"Tread-only deployment rejected.";return}const se=ne.samples.map(Pe=>Pe.parameter),re=ne.samples.map(Pe=>Jm(F.complex,F.sourceMap,Pe.transforms));M={frames:re,parameters:se},R(re[0],"Tread-only staircase — A4 fabrication template"),m.show(re.at(-1)),m.focus(),a.textContent="compiler construction preview · Tread-only staircase",u.innerHTML=`
      <section class="inspection-section">
        <h2>Tread-only staircase</h2>
        <p class="quiet">${$.stepCount} steps · A4 flat fabrication sheet. Compiled directly from the approved one-sheet cut/score template: ${F.sourceMap.cutLines.length} authored long cuts, ${F.sourceMap.hinges.filter(Pe=>Pe.role!=="parent").length} step folds, and no riser faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">Computed from one topology: retained edges remain joined while paired cut banks open into negative space.</p>
      </section>
    `,N(re.length-1)}),o.append(De);const Oe=document.createElement("button");Oe.type="button",Oe.className="stair-strategy-button",Oe.ariaPressed="false",Oe.textContent="Riser-only staircase",Oe.addEventListener("click",()=>{I(),E+=1,b=void 0,r.hidden=!0,a.hidden=!1;const $={operationId:"riser-only-stair",...er},F=og($);if(!F.ok){u.textContent=F.diagnostics[0]?.message??"Riser-only pattern rejected.";return}const ne=lg({input:$,complex:F.complex,sourceMap:F.sourceMap,sampleCount:7});if(!ne.ok){u.textContent=ne.diagnostics[0]?.message??"Riser-only deployment rejected.";return}const se=ne.samples.map(Pe=>Pe.parameter),re=ne.samples.map(Pe=>Qm(F.complex,F.sourceMap,Pe.transforms));M={frames:re,parameters:se},R(re[0],"Riser-only staircase — A4 fabrication template"),m.show(re.at(-1)),m.focus(),a.textContent="compiler construction preview · Riser-only staircase",u.innerHTML=`
      <section class="inspection-section">
        <h2>Riser-only staircase</h2>
        <p class="quiet">${$.stepCount} steps · A4 flat fabrication sheet. Compiled from the same one-sheet cut topology in its flipped deployment: ${F.sourceMap.cutLines.length} authored long cuts, ${F.sourceMap.supports.length} retained riser regions, and no tread faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">The stationary host supports the risers while one connected carrier wall preserves their material ancestry and retained-edge closure.</p>
      </section>
    `,N(re.length-1)}),o.append(Oe);const Ve=document.createElement("button");Ve.type="button",Ve.className="stair-strategy-button",Ve.ariaPressed="false",Ve.textContent="Carrier-hosted compound staircase",Ve.addEventListener("click",()=>{I(),E+=1,b=void 0,r.hidden=!0,a.hidden=!1;const $=mg({operationId:"carrier-hosted-compound-stair",parent:er,child:{width:.16,stepCount:4,stepRun:.144,stepRise:.144,hostWidth:.24,hostFloorExtent:.72,hostWallExtent:.72},childHostStepIndex:6});if(!$.ok){u.textContent=$.diagnostics[0]?.message??"Compound stair rejected.";return}const F=gg({compilation:$,sampleCount:7});if(!F.ok){u.textContent=F.diagnostics[0]?.message??"Compound deployment rejected.";return}const ne=F.samples.map(re=>re.parameter),se=F.samples.map(re=>eg($,re));M={frames:se,parameters:ne},R(se[0],"Carrier-hosted compound staircase — A4 fabrication template"),m.show(se.at(-1)),m.focus(),a.textContent="compiler construction preview · Carrier-hosted compound staircase",u.innerHTML=`
      <section class="inspection-section">
        <h2>Carrier-hosted compound staircase</h2>
        <p class="quiet">A seven-step tread-only parent and four-step full stair compile from one A4 flat fabrication sheet.</p>
      </section>
      <section class="inspection-section">
        <h2>Material ancestry</h2>
        <p class="quiet">The child pattern is subdivided directly into the parent carrier and common lower sheet. Its perimeter remains stitched to surrounding parent material; no separate child sheet or rectangular extraction boundary exists.</p>
      </section>
      <section class="inspection-section">
        <h2>Status</h2>
        <p class="quiet">Integrated topology: one material component, outer-sheet boundaries only, full source-area conservation, and sampled retained-edge closure.</p>
      </section>
    `,N(se.length-1)}),o.append(Ve);const K=document.createElement("button");K.type="button",K.className="stair-strategy-button",K.ariaPressed="false",K.textContent="Ground slab",K.addEventListener("click",()=>{I(),E+=1,b=void 0,r.hidden=!0,a.hidden=!1;const $={operationId:"ground-slab",width:1.6,depth:2.4,thickness:.2,hostWidth:4,hostFloorExtent:2.4,hostWallExtent:.8},F=hg($);if(!F.ok){u.textContent=F.diagnostics[0]?.message??"Slab pattern rejected.";return}const ne=fg({input:$,complex:F.complex,sourceMap:F.sourceMap,sampleCount:7});if(!ne.ok){u.textContent=ne.diagnostics[0]?.message??"Slab deployment rejected.";return}const se=ne.samples.map(Pe=>Pe.parameter),re=ne.samples.map(Pe=>jm(F.complex,F.sourceMap,Pe.transforms));M={frames:re,parameters:se},R(re[0],"Ground slab — A4 fabrication template"),m.show(re.at(-1)),m.focus(),a.textContent="compiler construction preview · Ground slab",u.innerHTML=`
      <section class="inspection-section">
        <h2>Ground slab</h2>
        <p class="quiet">${$.depth} × ${$.width} slab footprint · one retained horizontal slab surface · no riser faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Construction</h2>
        <p class="quiet">One-level tread-only construction with ${F.sourceMap.cutLines.length} authored long cut and ${F.sourceMap.supports.length} retained slab support region.</p>
        <p class="quiet">Retained material remains connected while paired cut banks open into negative space.</p>
      </section>
    `,N(re.length-1)}),l.append(K);for(const $ of["Wall","Roof"]){const F=document.createElement("button");F.type="button",F.className="stair-strategy-button",F.disabled=!0,F.textContent=`${$} · planned`,l.append(F)}for(const $ of["Window","Door"]){const F=document.createElement("button");F.type="button",F.className="stair-strategy-button",F.disabled=!0,F.textContent=`${$} · planned`,c.append(F)}s.addEventListener("click",()=>{if(S)try{const $=Qy(S);sE($,C)}catch($){const F=$ instanceof Error?$.message:String($);k(`Print unavailable · ${F}`)}});for(const[$,F]of Dr.entries()){const ne=document.createElement("button");ne.type="button",ne.className="example-row",ne.ariaPressed="false",ne.innerHTML=`
      <span class="example-index">${String($+1).padStart(2,"0")}</span>
      <span>
        <strong>${xa(F.example.title)}</strong>
        <small>${xa(F.example.kind)} · ${xa(F.example.fixtureClass)}</small>
      </span>
    `,ne.addEventListener("click",()=>ie($)),e.append(ne)}return h.addEventListener("input",()=>{a.hidden=!0,I(),N(Number(h.value))}),v.forEach($=>{$.addEventListener("click",()=>{I(),N(P+Number($.dataset.direction))})}),p.addEventListener("click",()=>{if(_!==void 0){I();return}const $=M?.frames.length??b?.frames.length??0;$<=1||(P>=$-1&&N(0),p.ariaPressed="true",p.textContent="Pause",_=window.setInterval(()=>{const F=M?.frames.length??b?.frames.length??0;if(F===0||P>=F-1){I();return}N(P+1)},650))}),J(),ie(0),()=>{E+=1,I(),g.dispose(),m.dispose(),n.replaceChildren()}}function Bt(n,e){const t=n.querySelector(e);if(!t)throw new Error(`Missing Engine Lab element: ${e}.`);return t}function lE(n){return Math.abs(n)>=1e3||n!==0&&Math.abs(n)<.001?n.toExponential(5):n.toFixed(5).replace(/0+$/,"").replace(/\.$/,"")}function xa(n){return n.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}const zd=document.querySelector("#app");if(!zd)throw new Error("Missing Engine Lab root.");oE(zd);
