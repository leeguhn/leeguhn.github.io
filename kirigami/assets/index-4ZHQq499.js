(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const Gh=1;function Ci(t){if(!Wh(t))return[vt("TOPOLOGY_SCHEMA_UNSUPPORTED","Value does not have the required cell-complex collections.",[])];if(t.schemaVersion!==Gh)return[vt("TOPOLOGY_SCHEMA_UNSUPPORTED",`Topology schema version ${String(t.schemaVersion)} is not supported.`,[])];const e=$h(t);if(e)return[vt("TOPOLOGY_DUPLICATE_ID",`Entity ID ${e.id} is not unique.`,[e])];const n=[],i=new Map(t.vertices.map(c=>[c.id,c])),s=new Map(t.halfEdges.map(c=>[c.id,c])),r=new Map(t.edges.map(c=>[c.id,c])),a=new Map(t.faces.map(c=>[c.id,c])),o=new Map(t.cutPairs.map(c=>[c.id,c]));for(const c of t.vertices)(c.position.length!==2||!c.position.every(l=>Number.isFinite(l)))&&n.push(vt("TOPOLOGY_INVALID_NUMBER","Vertex coordinates must be finite two-dimensional values.",[at("vertex",c.id)]));for(const c of t.halfEdges){ps(n,i,"vertex",c.origin,c),ps(n,s,"halfEdge",c.next,c),ps(n,r,"edge",c.edge,c),ps(n,a,"face",c.face,c),c.twin!==void 0&&ps(n,s,"halfEdge",c.twin,c);const l=r.get(c.edge);l&&!l.halfEdges.includes(c.id)&&n.push(vt("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[at("halfEdge",c.id),at("edge",l.id)]))}for(const c of t.edges)Xh(c,s,n);for(const c of t.faces){il(c,c.boundary,"boundary",s,n);for(const l of c.holes)il(c,l,"hole",s,n)}for(const c of t.cutPairs)Yh(c,r,n);for(const c of t.edges.filter(l=>l.kind==="cutBank")){const l=c.cutBank?o.get(c.cutBank.pair):void 0;(!l||!l.banks.includes(c.id))&&n.push(vt("TOPOLOGY_CUT_PAIR_INVALID","Each cut bank must reference a cut pair that lists that edge.",[at("edge",c.id)]))}return Kh(t,a,n),n}function Wh(t){if(typeof t!="object"||t===null)return!1;const e=t;return Array.isArray(e.vertices)&&e.vertices.every(n=>Ni(n)&&Array.isArray(n.position)&&n.position.length===2)&&Array.isArray(e.halfEdges)&&e.halfEdges.every(n=>Ni(n)&&typeof n.origin=="string"&&typeof n.next=="string"&&typeof n.edge=="string"&&typeof n.face=="string")&&Array.isArray(e.edges)&&e.edges.every(n=>Ni(n)&&Array.isArray(n.halfEdges)&&typeof n.kind=="string")&&Array.isArray(e.faces)&&e.faces.every(n=>Ni(n)&&typeof n.boundary=="string"&&Array.isArray(n.holes))&&Array.isArray(e.cutPairs)&&e.cutPairs.every(n=>Ni(n)&&Array.isArray(n.banks))&&Array.isArray(e.materialComponents)&&e.materialComponents.every(n=>Ni(n)&&Array.isArray(n.faces))}function Ni(t){return typeof t=="object"&&t!==null&&typeof t.id=="string"}function $h(t){const e=new Set,n=[["vertex",t.vertices],["halfEdge",t.halfEdges],["edge",t.edges],["face",t.faces],["cutPair",t.cutPairs],["materialComponent",t.materialComponents]];for(const[i,s]of n)for(const r of s){if(e.has(r.id))return at(i,r.id);e.add(r.id)}}function ps(t,e,n,i,s){e.has(i)||t.push(vt("TOPOLOGY_MISSING_REFERENCE",`Half-edge ${s.id} references missing ${n} ${i}.`,[at("halfEdge",s.id),at(n,i)]))}function Xh(t,e,n){const i=t.kind==="hinge"||t.kind==="joined"||t.kind==="flatSeam",s=i?2:1;t.halfEdges.length!==s&&n.push(vt("TOPOLOGY_EDGE_CARDINALITY",`Edge kind ${t.kind} requires ${s} half-edge(s).`,[at("edge",t.id)]));const r=t.halfEdges.map(a=>e.get(a)).filter(a=>a!==void 0);if(r.some(a=>a.edge!==t.id)&&n.push(vt("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[at("edge",t.id)])),i&&r.length===2){const[a,o]=r;(a.twin!==o.id||o.twin!==a.id)&&n.push(vt("TOPOLOGY_TWIN_MISMATCH","Two-sided edge half-edges must be symmetric twins.",[at("edge",t.id),at("halfEdge",a.id),at("halfEdge",o.id)]));const c=e.get(a.next)?.origin,l=e.get(o.next)?.origin;c!==void 0&&l!==void 0&&(a.origin!==l||o.origin!==c)&&n.push(vt("TOPOLOGY_TWIN_ORIENTATION","Twin half-edges must traverse the shared edge in opposite directions.",[at("edge",t.id),at("halfEdge",a.id),at("halfEdge",o.id)]))}else!i&&r.some(a=>a.twin!==void 0)&&n.push(vt("TOPOLOGY_TWIN_MISMATCH","One-sided boundary and cut-bank half-edges cannot have twins.",[at("edge",t.id)]));qh(t,n)}function qh(t,e){if(t.kind==="hinge"){if(!t.hinge){e.push(vt("TOPOLOGY_HINGE_SPEC_INVALID","A hinge edge requires a hinge specification.",[at("edge",t.id)]));return}const[i,s]=t.hinge.angleRange;(![i,s,t.hinge.restAngle].every(Number.isFinite)||i>s||t.hinge.restAngle<i||t.hinge.restAngle>s)&&e.push(vt("TOPOLOGY_HINGE_INTERVAL_INVALID","Hinge angle bounds must be finite, ordered, and contain the rest angle.",[at("edge",t.id)]))}else t.hinge!==void 0&&e.push(vt("TOPOLOGY_HINGE_SPEC_INVALID","Only hinge edges may carry hinge specifications.",[at("edge",t.id)]));const n=t.cutBank!==void 0;t.kind==="cutBank"!==n&&e.push(vt("TOPOLOGY_CUT_PAIR_INVALID","Cut-bank metadata is required exactly on cut-bank edges.",[at("edge",t.id)]))}function il(t,e,n,i,s){const r=new Set;let a=e;for(;!r.has(a);){r.add(a);const o=i.get(a);if(!o||o.face!==t.id){s.push(sl(t,n));return}a=o.next}(a!==e||r.size<3)&&s.push(sl(t,n))}function sl(t,e){return vt("TOPOLOGY_FACE_LOOP_OPEN",`Face ${e} must form a closed loop of at least three half-edges.`,[at("face",t.id)])}function Yh(t,e,n){const[i,s]=t.banks,r=e.get(i),a=e.get(s);i!==s&&r?.kind==="cutBank"&&a?.kind==="cutBank"&&r.cutBank?.pair===t.id&&a.cutBank?.pair===t.id&&new Set([r.cutBank.bank,a.cutBank.bank]).size===2||n.push(vt("TOPOLOGY_CUT_PAIR_INVALID","A cut pair requires two distinct cut-bank edges labeled a and b.",[at("cutPair",t.id)]))}function Kh(t,e,n){const i=new Map;for(const r of t.materialComponents)for(const a of r.faces)i.set(a,(i.get(a)??0)+1),e.has(a)||n.push(vt("TOPOLOGY_MISSING_REFERENCE",`Material component ${r.id} references missing face ${a}.`,[at("materialComponent",r.id),at("face",a)]));for(const r of t.faces)i.get(r.id)!==1&&n.push(vt("TOPOLOGY_COMPONENT_INVALID","Every face must belong to exactly one material component.",[at("face",r.id)]));const s=new Map;for(const r of t.edges){if(!["hinge","joined","flatSeam"].includes(r.kind)||r.halfEdges.length!==2)continue;const a=r.halfEdges.map(l=>t.halfEdges.find(h=>h.id===l)).filter(l=>l!==void 0);if(a.length!==2||a[0].face===a[1].face)continue;const[o,c]=a.map(l=>l.face);s.get(o)?.add(c)??s.set(o,new Set([c])),s.get(c)?.add(o)??s.set(c,new Set([o]))}for(const r of t.materialComponents){const a=r.faces.filter(l=>e.has(l));if(a.length<2)continue;const o=new Set([a[0]]),c=[a[0]];for(;c.length>0;){const l=c.shift();for(const h of s.get(l)??[])a.includes(h)&&!o.has(h)&&(o.add(h),c.push(h))}o.size!==a.length&&n.push(vt("TOPOLOGY_COMPONENT_INVALID",`Material component ${r.id} contains disconnected faces; cut banks cannot substitute for a sheet connection.`,[at("materialComponent",r.id)]))}}function vt(t,e,n){return{severity:"error",category:"topology",code:t,message:e,locations:n.length>0?n.map(i=>({kind:"entity",entity:i})):[{kind:"nonSpatial",reason:"Topology schema root."}],entities:n}}function at(t,e){return{kind:t,id:e}}const Qe={absoluteLength:1e-9,relativeLength:1e-9,absoluteAngle:1e-9,relativeRank:1e-10};function du(t,e=Qe){if(!Number.isFinite(t)||t<0)throw new RangeError("Scale must be finite non-negative.");return e.absoluteLength+e.relativeLength*t}function uu(t,e){const n=t.vertices.find(r=>r.id===e);if(!n)return{applicability:"notApplicable",reason:`Vertex ${e} does not exist.`};const i=t.edges.map(r=>({edge:r,endpoints:Jh(t,r)})).filter(({endpoints:r})=>r.includes(e));if(i.length===0)return{applicability:"notApplicable",reason:"Vertex has no incident material edges."};if(i.some(({edge:r})=>r.kind!=="hinge"||!r.hinge))return{applicability:"notApplicable",reason:"Classical single-vertex tests do not apply to non-hinge incidence."};const s=i.map(({edge:r,endpoints:a})=>{const o=a[0]===e?a[1]:a[0],c=t.vertices.find(u=>u.id===o);if(!c||!r.hinge)throw new Error("Validated incident edge is missing geometry.");const l=c.position[0]-n.position[0],h=c.position[1]-n.position[1];if(!(Math.hypot(l,h)<=Qe.absoluteLength))return{edgeId:r.id,directionAngle:Math.atan2(h,l),assignment:r.hinge.assignment}}).filter(r=>r!==void 0).sort((r,a)=>r.directionAngle-a.directionAngle);if(s.length!==i.length||s.length<2)return{applicability:"notApplicable",reason:"Crease rays must be nondegenerate."};for(let r=0;r<s.length;r+=1){const a=s[(r+1)%s.length];if((r===s.length-1?a.directionAngle+Math.PI*2-s[r].directionAngle:a.directionAngle-s[r].directionAngle)<=Qe.absoluteAngle)return{applicability:"notApplicable",reason:"Crease rays must have distinct directions."}}return{applicability:"applicable",rays:s,sectorAngles:s.map((r,a)=>{const o=s[(a+1)%s.length];return a===s.length-1?o.directionAngle+Math.PI*2-r.directionAngle:o.directionAngle-r.directionAngle})}}function Zh(t,e){const n=uu(t,e);return n.applicability==="notApplicable"?n:{applicability:"applicable",rays:n.rays,sectorAngles:n.sectorAngles,...pc(n.sectorAngles,n.rays.map(i=>i.assignment))}}function pc(t,e,n=Qe.absoluteAngle){if(t.length!==e.length||t.length<2||t.some(f=>!Number.isFinite(f)||f<=0)){const f={status:"failed",reason:"Sector angles and assignments must be finite matching arrays."};return{kawasaki:f,maekawa:f,locallyFlatFoldable:!1}}const i=t.length%2!==0,s=t.reduce((f,p,_)=>(f[_%2]+=p,f),[0,0]),r=s[0]+s[1],a=Math.max(Math.abs(s[0]-Math.PI),Math.abs(s[1]-Math.PI),Math.abs(r-Math.PI*2)),o={status:!i&&a<=n?"satisfied":"failed",residual:a,...i?{reason:"Kawasaki requires even crease degree."}:{}},c=e.every(f=>f==="mountain"||f==="valley"),l=e.filter(f=>f==="mountain").length,h=e.filter(f=>f==="valley").length,u=Math.abs(Math.abs(l-h)-2),d=c?{status:u===0?"satisfied":"failed",residual:u}:{status:"notApplicable",reason:"Maekawa requires a complete mountain/valley assignment."};return{kawasaki:o,maekawa:d,locallyFlatFoldable:o.status==="satisfied"&&d.status==="satisfied"}}function Jh(t,e){const n=t.halfEdges.find(s=>s.id===e.halfEdges[0]),i=n?t.halfEdges.find(s=>s.id===n.next):void 0;if(!n||!i)throw new Error(`Edge ${e.id} has incomplete half-edge topology.`);return[n.origin,i.origin]}function jh(t,e=16){if(t.length<2||t.length>e||t.some(r=>!Number.isFinite(r)||r<=0))return{applicable:!1,candidateAssignments:[],locallyFlatFoldableAssignments:[],truncated:!1,reason:"Vertex degree is outside the bounded enumeration domain."};const n=2**t.length,i=[],s=[];for(let r=0;r<n;r+=1){const a=t.map((c,l)=>(r>>l&1)===0?"mountain":"valley");i.push(a),pc(t,a).locallyFlatFoldable&&s.push(a)}return{applicable:!0,candidateAssignments:i,locallyFlatFoldableAssignments:s,truncated:!1}}function Qh(t){const e=t.edges.filter(r=>r.kind==="cutBank"),n=new Set(t.cutPairs.flatMap(r=>r.banks)),i=e.map(r=>r.id).filter(r=>!n.has(r)),s=t.cutPairs.filter(r=>r.banks.length!==2||r.banks[0]===r.banks[1]?!0:r.banks.some(a=>{const o=t.edges.find(c=>c.id===a);return o?.kind!=="cutBank"||o.cutBank?.pair!==r.id})).map(r=>r.id);return{certified:i.length===0&&s.length===0,cutPairIds:t.cutPairs.map(r=>r.id),unpairedCutBankIds:i,invalidCutPairIds:s}}function hu(t){const e=t.edges.filter(n=>n.kind==="hinge"&&n.hinge?.assignment==="unassigned").map(n=>n.id);return{complete:e.length===0,unassignedHingeIds:e}}function fu(t){const e=t.vertices.flatMap(a=>{const o=Zh(t,a.id);return o.applicability==="applicable"?[{vertexId:a.id,analysis:o,counting:jh(o.sectorAngles)}]:[]}),n=pu(t),i=hu(t),s=ef(t),r=n.colorable&&i.complete&&s&&e.every(({analysis:a})=>a.locallyFlatFoldable);return{applicability:"local-gates-only",faceTwoColorability:n,mountainValley:i,localVertices:e,materialConnected:s,necessaryGatesSatisfied:r,globalProof:"unsupported"}}function ef(t){if(t.faces.length<=1)return!0;const e=new Map(t.faces.map(s=>[s.id,new Set]));for(const s of t.edges){if(!["hinge","joined","flatSeam"].includes(s.kind)||s.halfEdges.length!==2)continue;const r=s.halfEdges.map(a=>t.halfEdges.find(o=>o.id===a)?.face);r[0]&&r[1]&&r[0]!==r[1]&&(e.get(r[0])?.add(r[1]),e.get(r[1])?.add(r[0]))}const n=new Set,i=[t.faces[0].id];for(;i.length;){const s=i.shift();n.has(s)||(n.add(s),i.push(...e.get(s)??[]))}return n.size===t.faces.length}function pu(t){const e=new Map(t.faces.map(i=>[i.id,new Set]));for(const i of t.edges){if(i.halfEdges.length!==2)continue;const s=i.halfEdges.map(r=>t.halfEdges.find(a=>a.id===r)).filter(r=>r!==void 0);s.length!==2||s[0].face===s[1].face||(e.get(s[0].face)?.add(s[1].face),e.get(s[1].face)?.add(s[0].face))}const n=new Map;for(const i of t.faces){if(n.has(i.id))continue;n.set(i.id,0);const s=[i.id];for(;s.length>0;){const r=s.shift(),a=n.get(r);for(const o of e.get(r)??[]){const c=a===0?1:0,l=n.get(o);if(l!==void 0){if(l!==c)return{colorable:!1,colors:n,conflict:[r,o]};continue}n.set(o,c),s.push(o)}}}return{colorable:!0,colors:n}}function mc(t){const e=tf(t);if(e)return{ok:!1,diagnostics:[e]};const n=t.stepCount*2+2,i=[],s=[],r=[],a=[],o=[],c=[],l=[],h=[],u=[],d=(t.hostWidth-t.width)/2,f=[0,d,d+t.width,t.hostWidth],p=n*t.stepRun,_=t.hostFloorExtent+t.hostWallExtent,m=-t.hostFloorExtent+(_-p)/2;for(let b=0;b<=n;b+=1)for(let P=0;P<f.length;P+=1)i.push({id:`v:${b}:${P}`,position:[f[P],m+b*t.stepRun]});for(let b=0;b<n;b+=1)for(let P=0;P<3;P+=1){const C=P===1?`stair-face:${b}`:`host-face:${b}:${P}`,I=`he:${b}:${P}:bottom`,X=`he:${b}:${P}:right`,H=`he:${b}:${P}:top`,D=`he:${b}:${P}:left`;r.push({id:I,origin:`v:${b}:${P}`,next:X,edge:"pending",face:C},{id:X,origin:`v:${b}:${P+1}`,next:H,edge:"pending",face:C},{id:H,origin:`v:${b+1}:${P+1}`,next:D,edge:"pending",face:C},{id:D,origin:`v:${b+1}:${P}`,next:I,edge:"pending",face:C}),s.push({id:C,boundary:I,holes:[]});const $=P!==1||b===0?"host":b===n-1?"bridge":b%2===1?"step":"bridge";c.push({faceId:C,operationId:t.operationId,role:$})}const g=new Map(r.map(b=>[b.id,b])),A=(b,P)=>{for(const C of b)g.get(C).edge=P.id;b.length===2&&(g.get(b[0]).twin=b[1],g.get(b[1]).twin=b[0]),a.push(P),l.push({edgeId:P.id,operationId:t.operationId})};for(let b=0;b<3;b+=1){A([`he:0:${b}:bottom`],{id:`boundary:bottom:${b}`,halfEdges:[`he:0:${b}:bottom`],kind:"boundary"}),A([`he:${n-1}:${b}:top`],{id:`boundary:top:${b}`,halfEdges:[`he:${n-1}:${b}:top`],kind:"boundary"});for(let P=1;P<n;P+=1){const C=[`he:${P-1}:${b}:top`,`he:${P}:${b}:bottom`];if(b===1){const I=P%2===0?"valley":"mountain";A(C,{id:`hinge:${P-1}`,halfEdges:C,kind:"hinge",hinge:{assignment:I,restAngle:0,angleRange:I==="valley"?[0,Math.PI]:[-Math.PI,0]}})}else P===n/2?A(C,{id:`host-hinge:${b}`,halfEdges:C,kind:"hinge",hinge:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}):A(C,{id:`seam:h:${P}:${b}`,halfEdges:C,kind:"flatSeam"})}}for(let b=0;b<n;b+=1){A([`he:${b}:0:left`],{id:`boundary:left:${b}`,halfEdges:[`he:${b}:0:left`],kind:"boundary"}),A([`he:${b}:2:right`],{id:`boundary:right:${b}`,halfEdges:[`he:${b}:2:right`],kind:"boundary"});for(let P=1;P<=2;P+=1){const C=`he:${b}:${P-1}:right`,I=`he:${b}:${P}:left`;if(b===0||b===n-1){A([C,I],{id:`seam:v:${b}:${P}`,halfEdges:[C,I],kind:"flatSeam"});continue}const H=`cut:${b}:${P}`,D=`${H}:a`,$=`${H}:b`;A([C],{id:D,halfEdges:[C],kind:"cutBank",cutBank:{pair:H,bank:"a"}}),A([I],{id:$,halfEdges:[I],kind:"cutBank",cutBank:{pair:H,bank:"b"}}),o.push({id:H,banks:[D,$]});const B=Math.min(t.stepCount-1,Math.floor((b-1)/2));h.push({cutPairId:H,operationId:t.operationId,stepIndex:B}),b%2===1&&b<n-1&&u.push({voidId:`void:${b}:${P}`,stepIndex:B,cutPairIds:[H]})}}const w={schemaVersion:1,vertices:i,halfEdges:r,edges:a,faces:s,cutPairs:o,materialComponents:[{id:`stair-material:${t.operationId}`,faces:s.map(b=>b.id)}]},v=Ci(w);if(v.length>0)return{ok:!1,diagnostics:v};if(!pu(w).colorable)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_FLAT_COLORING_FAILED",message:"The stair crease graph is not two-colorable and cannot represent a flat origami sheet.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};if(!fu(w).materialConnected)return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:"The generated stair material is disconnected across its crease graph.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};const T=hu(w);if(!T.complete)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_ASSIGNMENT_MISMATCH",message:`Flat stair crease graph has unassigned hinges: ${T.unassignedHingeIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};const M=Qh(w);return M.certified?{ok:!0,complex:w,sourceMap:{operationId:t.operationId,host:{plane:t.hostPlane??"wall",width:t.hostWidth,extent:t.hostPlane==="floor"?t.hostFloorExtent:t.hostWallExtent},faces:c,edges:l,cutPairs:h,voids:u}}:{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_CUT_PAIR_INVALID",message:`Stair cut graph contains unpaired cut banks: ${M.unpairedCutBankIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]}}function tf(t){return typeof t.operationId=="string"&&t.operationId.length>0&&Number.isFinite(t.width)&&t.width>0&&Number.isInteger(t.stepCount)&&t.stepCount>0&&Number.isFinite(t.stepRun)&&t.stepRun>0&&Number.isFinite(t.stepRise)&&t.stepRise>0&&t.stepRun===t.stepRise&&Number.isFinite(t.hostWidth)&&t.hostWidth>=t.width&&Number.isFinite(t.hostFloorExtent)&&t.hostFloorExtent>=t.stepCount*t.stepRun&&Number.isFinite(t.hostWallExtent)&&t.hostWallExtent>=t.stepCount*t.stepRise?void 0:{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:t.stepRun!==t.stepRise?"Certified stairs require equal step run and rise.":"Stair dimensions must be positive and fit within the host sheet bounds.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId||"unknown"}}],entities:[{kind:"spatialOperation",id:t.operationId||"unknown"}]}}function Ft(t,e){return[t[0]+e[0],t[1]+e[1],t[2]+e[2]]}function Ke(t,e){return[t[0]-e[0],t[1]-e[1],t[2]-e[2]]}function St(t,e){return[t[0]*e,t[1]*e,t[2]*e]}function ot(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function ds(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function ct(t){return Math.hypot(t[0],t[1],t[2])}function si(t){const e=ct(t);if(!Number.isFinite(e)||e===0)throw new RangeError("Axis must be finite and nonzero.");return St(t,1/e)}function yi(t,e){return[ot(t[0],e),ot(t[1],e),ot(t[2],e)]}function nf(t,e){const n=a=>[e[0][a],e[1][a],e[2][a]],i=n(0),s=n(1),r=n(2);return[[ot(t[0],i),ot(t[0],s),ot(t[0],r)],[ot(t[1],i),ot(t[1],s),ot(t[1],r)],[ot(t[2],i),ot(t[2],s),ot(t[2],r)]]}function gt(t,e){return Ft(yi(t.rotation,e),t.translation)}function Xt(t,e){return{rotation:nf(t.rotation,e.rotation),translation:Ft(yi(t.rotation,e.translation),t.translation)}}function Ei(t){const e=[[t.rotation[0][0],t.rotation[1][0],t.rotation[2][0]],[t.rotation[0][1],t.rotation[1][1],t.rotation[2][1]],[t.rotation[0][2],t.rotation[1][2],t.rotation[2][2]]];return{rotation:e,translation:St(yi(e,t.translation),-1)}}function Xr(t){return{rotation:[[t.widthAxis[0],t.inPlaneAxis[0],t.normal[0]],[t.widthAxis[1],t.inPlaneAxis[1],t.normal[1]],[t.widthAxis[2],t.inPlaneAxis[2],t.normal[2]]],translation:t.origin}}function gc(t,e){return Xt(Xr(e),Ei(Xr(t)))}function sf(t,e){if(!Number.isFinite(e))throw new RangeError("Rotation angle must be finite.");const[n,i,s]=si(t),r=Math.cos(e),a=Math.sin(e),o=1-r;return[[r+n*n*o,n*i*o-s*a,n*s*o+i*a],[i*n*o+s*a,r+i*i*o,i*s*o-n*a],[s*n*o-i*a,s*i*o+n*a,r+s*s*o]]}function bi(t,e,n){const i=sf(e,n);return{rotation:i,translation:Ke(t,yi(i,t))}}function rf(t){if(![...t.rotation[0],...t.rotation[1],...t.rotation[2],...t.translation].every(Number.isFinite))return Number.POSITIVE_INFINITY;const[n,i,s]=t.rotation;return Math.max(Math.abs(ot(n,n)-1),Math.abs(ot(i,i)-1),Math.abs(ot(s,s)-1),Math.abs(ot(n,i)),Math.abs(ot(n,s)),Math.abs(ot(i,s)),Math.abs(ot(n,ds(i,s))-1))}function Xs(t,e=1e-9){const n=rf(t);return Number.isFinite(n)&&n<=e}function af(t,e,n=1e-9){const i=new Map(e.facePoses.map(o=>[o.faceId,o])),s=new Set;for(const o of t.edges){if(o.halfEdges.length!==2)continue;const c=o.halfEdges.map(l=>t.halfEdges.find(h=>h.id===l));!c[0]||!c[1]||c[0].face===c[1].face||s.add(rl(c[0].face,c[1].face))}const r=t.faces.flatMap(o=>{const c=i.get(o.id);if(!c)return[];const l=of(t,o).map(u=>gt(c.transform,u));if(l.length<3)return[];const h=si(ds(Ke(l[1],l[0]),Ke(l[2],l[0])));return[{face:o,points:l,normal:h}]}),a=[];for(let o=0;o<r.length;o+=1)for(let c=o+1;c<r.length;c+=1){const l=r[o],h=r[c];if(s.has(rl(l.face.id,h.face.id))||Math.abs(Math.abs(ot(l.normal,h.normal))-1)>n||Math.abs(ot(l.normal,Ke(h.points[0],l.points[0])))>n)continue;const u=cf(l.normal),d=l.points.map(p=>al(p,u)),f=h.points.map(p=>al(p,u));lf(d,f,n)&&a.push({firstFaceId:l.face.id,secondFaceId:h.face.id})}return a}function of(t,e){const n=[];let i=e.boundary;const s=new Set;for(;!s.has(i);){s.add(i);const r=t.halfEdges.find(o=>o.id===i);if(!r)break;const a=t.vertices.find(o=>o.id===r.origin);if(!a)break;n.push([a.position[0],a.position[1],0]),i=r.next}return n}function rl(t,e){return[t,e].sort().join("::")}function cf(t){const e=t.map(Math.abs);return e[0]>=e[1]&&e[0]>=e[2]?0:e[1]>=e[2]?1:2}function al(t,e){return e===0?[t[1],t[2]]:e===1?[t[0],t[2]]:[t[0],t[1]]}function lf(t,e,n){const i=ol(t),s=ol(e);if(Math.min(i.maxX,s.maxX)-Math.max(i.minX,s.minX)>n&&Math.min(i.maxY,s.maxY)-Math.max(i.minY,s.minY)>n||t.some(a=>Js(a,e,n))||e.some(a=>Js(a,t,n)))return!0;const r=a=>[a.reduce((o,c)=>o+c[0],0)/a.length,a.reduce((o,c)=>o+c[1],0)/a.length];if(Js(r(t),e,n)||Js(r(e),t,n))return!0;for(let a=0;a<t.length;a+=1){const o=t[a],c=t[(a+1)%t.length];for(let l=0;l<e.length;l+=1){const h=e[l],u=e[(l+1)%e.length];if(df(o,c,h,u,n))return!0}}return!1}function ol(t){return{minX:Math.min(...t.map(e=>e[0])),maxX:Math.max(...t.map(e=>e[0])),minY:Math.min(...t.map(e=>e[1])),maxY:Math.max(...t.map(e=>e[1]))}}function Js(t,e,n){let i=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const a=e[s],o=e[r];if(Math.abs(Rs(rn(o,a),rn(t,a)))<=n&&uf(rn(t,a),rn(t,o))<=n)return!1;a[1]>t[1]!=o[1]>t[1]&&t[0]<(o[0]-a[0])*(t[1]-a[1])/(o[1]-a[1])+a[0]&&(i=!i)}return i}function df(t,e,n,i,s){const r=Rs(rn(e,t),rn(n,t)),a=Rs(rn(e,t),rn(i,t)),o=Rs(rn(i,n),rn(t,n)),c=Rs(rn(i,n),rn(e,n));return(r>s&&a<-s||r<-s&&a>s)&&(o>s&&c<-s||o<-s&&c>s)}function rn(t,e){return[t[0]-e[0],t[1]-e[1]]}function Rs(t,e){return t[0]*e[1]-t[1]*e[0]}function uf(t,e){return t[0]*e[0]+t[1]*e[1]}function tn(){return{rotation:[[1,0,0],[0,1,0],[0,0,1]],translation:[0,0,0]}}function hf(t,e,n=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY){if(e.length<2)return ff("A folding map requires at least two ordered samples.");const s=t.faces.map(l=>l.id);let r=!0,a=!0,o=0,c=0;for(const l of e){const h=new Map(l.facePoses.map(u=>[u.faceId,u.transform]));for(const u of s){const d=h.get(u);(!d||!Xs(d))&&(r=!1)}}for(let l=1;l<e.length;l+=1){const h=new Map(e[l-1].facePoses.map(_=>[_.faceId,_.transform])),u=new Map(e[l].facePoses.map(_=>[_.faceId,_.transform])),d=e[l-1].parameterValues.find(_=>_.parameterId==="deployment")?.value,f=e[l].parameterValues.find(_=>_.parameterId==="deployment")?.value,p=f!==void 0&&d!==void 0?Math.abs(f-d):0;for(const _ of t.faces){const m=h.get(_.id),g=u.get(_.id);if(!m||!g){a=!1;continue}let A=_.boundary;const w=new Set;for(;!w.has(A);){w.add(A);const v=t.halfEdges.find(y=>y.id===A),E=v?t.vertices.find(y=>y.id===v.origin):void 0;if(E){const y=[E.position[0],E.position[1],0];o=Math.max(o,ct(Ke(gt(g,y),gt(m,y)))),p>0&&(c=Math.max(c,o/p))}if(!v)break;A=v.next}}}return a=a&&(!Number.isFinite(n)||o<=n),{applicable:!0,continuous:a,rigid:r,sampleCount:e.length,uniformDisplacementResidual:o,maximumDisplacementRate:c,rateBounded:!Number.isFinite(i)||c<=i}}function ff(t){return{applicable:!1,continuous:!1,rigid:!1,sampleCount:0,uniformDisplacementResidual:Number.POSITIVE_INFINITY,maximumDisplacementRate:Number.POSITIVE_INFINITY,rateBounded:!1,reason:t}}function pf(t,e=Qe.relativeRank){if(!Number.isFinite(e)||e<0)throw new RangeError("Rank tolerance must be finite and non-negative.");if(t.length===0)return{rank:0,threshold:0,acceptedPivots:[],rejectedMaximum:0};const n=t[0].length;if(t.some(l=>l.length!==n||l.some(h=>!Number.isFinite(h))))throw new RangeError("Rank matrix must be finite and rectangular.");const i=t.map(l=>[...l]),r=Math.max(0,...i.flat().map(l=>Math.abs(l)))*Math.max(t.length,n)*e,a=[];let o=0,c=0;for(let l=0;l<n&&c<i.length;l+=1){let h=c,u=Math.abs(i[h][l]);for(let f=c+1;f<i.length;f+=1){const p=Math.abs(i[f][l]);p>u&&(u=p,h=f)}if(u<=r){o=Math.max(o,u);continue}[i[c],i[h]]=[i[h],i[c]];const d=i[c][l];a.push(Math.abs(d));for(let f=l;f<n;f+=1)i[c][f]/=d;for(let f=0;f<i.length;f+=1){if(f===c)continue;const p=i[f][l];for(let _=l;_<n;_+=1)i[f][_]-=p*i[c][_]}c+=1}return{rank:c,threshold:r,acceptedPivots:a,rejectedMaximum:o}}function Or(t,e,n={}){if(!Number.isInteger(e)||e<0)throw new RangeError("Variable count must be a non-negative integer.");const i=pf(t,n.relativeTolerance??Qe.relativeRank),s=n.expectedRank;if(s!==void 0&&(!Number.isInteger(s)||s<0||s>e))throw new RangeError("Expected rank must fit the variable count.");return{...i,variableCount:e,dof:e-i.rank,...s===void 0?{}:{expectedRank:s},singular:s!==void 0&&i.rank<s}}function mf(t,e,n=t.map(()=>0)){return mu(t,e,n),t.reduce((i,s,r)=>{const a=bi([0,0,0],[0,0,1],e[r]),o=bi([0,0,0],[1,0,0],s),c={rotation:tn().rotation,translation:[n[r],0,0]},l=Xt(a,Xt(c,o));return Xt(i,l)},tn())}function cl(t,e,n){const i=mf(t,e,n),s=tn(),r=[];for(let a=0;a<3;a+=1)for(let o=0;o<3;o+=1)r.push(i.rotation[o][a]-s.rotation[o][a]);return r.push(...i.translation),r}function gf(t,e,n,i=1e-6){if(!Number.isFinite(i)||i<=0)throw new RangeError("Finite-difference step must be positive and finite.");mu(t,e,t.map(()=>0));const s=e.map((r,a)=>{const o=[...e],c=[...e];o[a]+=i,c[a]-=i;const l=cl(t,o,n),h=cl(t,c,n);return l.map((u,d)=>(u-h[d])/(2*i))});return Array.from({length:12},(r,a)=>s.map(o=>o[a]))}function mu(t,e,n){if(t.length===0||t.length!==e.length||t.length!==n.length)throw new RangeError("Sector and fold-angle arrays must have equal nonzero length.");if(t.some(i=>!Number.isFinite(i)||i<=0)||e.some(i=>!Number.isFinite(i))||n.some(i=>!Number.isFinite(i)))throw new RangeError("Sector and fold angles must be finite.")}function _f(t,e){const n=t.edges.filter(o=>o.kind==="hinge").map(o=>o.id).sort(),i=new Map(n.map((o,c)=>[o,c])),s=new Map(e?.hingeAngles.map(o=>[o.edgeId,o.angle])??[]),r=t.vertices.flatMap(o=>{const c=uu(t,o.id);return c.applicability==="applicable"?[{vertexId:o.id,extraction:c}]:[]});if(r.length===0||n.length===0)return{applicable:!1,vertexCount:r.length,hingeCount:n.length,jacobian:[],reason:"No all-hinge interior vertex network is available."};const a=[];for(const{extraction:o}of r){const c=o.rays.map(h=>s.get(h.edgeId)??0),l=gf(o.sectorAngles,c);for(const h of l){const u=Array.from({length:n.length},()=>0);o.rays.forEach((d,f)=>{const p=i.get(d.edgeId);p!==void 0&&(u[p]+=h[f])}),a.push(u)}}return{applicable:!0,vertexCount:r.length,hingeCount:n.length,jacobian:a,mobility:Or(a,n.length)}}function xf(t,e,n=Qe.absoluteLength){if(e.length<2)return Mf("A rigid-fold path requires at least two samples.");const i=t.faces.map(p=>p.id);let s=!0,r=!0,a=0,o=!0,c=0,l=!1;for(const p of e){const _=new Set(t.edges.filter(A=>A.kind==="hinge").map(A=>A.id)),m=new Set;for(const A of p.hingeAngles){const w=t.edges.find(T=>T.id===A.edgeId),v=w?.hinge?.angleRange,E=w?.hinge?.assignment,y=E==="mountain"?A.angle<=0:E==="valley"?A.angle>=0:!1;(m.has(A.edgeId)||!_.has(A.edgeId)||!Number.isFinite(A.angle)||!v||A.angle<v[0]||A.angle>v[1]||!y)&&(o=!1),m.add(A.edgeId)}const g=new Map(p.facePoses.map(A=>[A.faceId,A.transform]));for(const A of i){const w=g.get(A);(!w||!Xs(w))&&(s=!1),w&&(c=Math.max(c,Sf(w.rotation)))}for(const A of t.edges.filter(w=>w.kind==="hinge")){if(A.halfEdges.length!==2){r=!1;continue}const w=A.halfEdges.map(T=>t.halfEdges.find(M=>M.id===T)).filter(T=>T!==void 0);if(w.length!==2){r=!1;continue}const v=g.get(w[0].face),E=g.get(w[1].face);if(!v||!E){r=!1;continue}const y=[w[0].origin,vf(t,w[0])];for(const T of y){const M=t.vertices.find(C=>C.id===T);if(!M){r=!1;continue}const b=[M.position[0],M.position[1],0],P=ct(Ke(gt(v,b),gt(E,b)));a=Math.max(a,P)}}}const h=e.map(p=>p.parameterValues.find(_=>_.parameterId==="deployment")?.value),u=h.every((p,_)=>_===0||p!==void 0&&h[_-1]!==void 0&&p>=h[_-1]),d=yf(t),f=_f(t,e[e.length-1]);for(let p=1;p<e.length;p+=1)JSON.stringify(e[p-1].facePoses)!==JSON.stringify(e[p].facePoses)&&(l=!0);return{applicable:!0,rigid:s,hingesCompatible:r&&a<=n,monotone:u,hingeStateValid:o,matrixCompatible:s&&c<=n,nontrivialMotion:l,maximumMatrixResidual:c,hingeGraphAcyclic:d,matrixCertificate:!s||!r||a>n?"invalid":d?"tree-exact":"cycle-closed",networkMobilityApplicable:f.applicable,...f.mobility?{networkDegreesOfFreedom:f.mobility.dof}:{},sampleCount:e.length,maximumHingeResidual:a}}function vf(t,e){return t.halfEdges.find(n=>n.id===e.next)?.origin??""}function Mf(t){return{applicable:!1,rigid:!1,hingesCompatible:!1,monotone:!1,hingeStateValid:!1,matrixCompatible:!1,nontrivialMotion:!1,maximumMatrixResidual:Number.POSITIVE_INFINITY,hingeGraphAcyclic:!1,matrixCertificate:"invalid",networkMobilityApplicable:!1,sampleCount:0,maximumHingeResidual:Number.POSITIVE_INFINITY,reason:t}}function yf(t){const e=new Map;for(const s of t.edges.filter(r=>r.kind==="hinge"&&r.halfEdges.length===2)){const r=s.halfEdges.map(a=>t.halfEdges.find(o=>o.id===a)?.face).filter(a=>a!==void 0);r.length===2&&(e.set(r[0],[...e.get(r[0])??[],r[1]]),e.set(r[1],[...e.get(r[1])??[],r[0]]))}const n=new Set,i=(s,r)=>{if(n.has(s))return!1;n.add(s);for(const a of e.get(s)??[])if(a!==r&&(n.has(a)||!i(a,s)))return!1;return!0};return[...e.keys()].every(s=>n.has(s)||i(s))}function Sf(t){let e=0;for(let n=0;n<3;n+=1)for(let i=0;i<3;i+=1){let s=0;for(let r=0;r<3;r+=1)s+=t[r][n]*t[r][i];e=Math.max(e,Math.abs(s-(n===i?1:0)))}return e}function gu(t,e,n=1e-9,i=Number.POSITIVE_INFINITY){if(e.length<2)return Ef("A configuration-space path requires at least two states.");const s=e.map(p=>p.parameterValues.find(_=>_.parameterId==="deployment")?.value),r=s.every(p=>p!==void 0&&Number.isFinite(p)),a=r&&s.every(p=>p>=-n&&p<=1+n),o=r&&s.every((p,_)=>_===0||p>=s[_-1]-n),c=r&&Math.abs(s[0]-0)<=n&&Math.abs(s[s.length-1]-1)<=n,l=r&&s.every((p,_)=>_===0||Math.abs(p-s[_-1])>n),h=r?Math.max(...s.slice(1).map((p,_)=>p-s[_])):Number.POSITIVE_INFINITY,u=!Number.isFinite(i)||h<=i+n,d=new Set(t.faces.map(p=>p.id)),f=e.every(p=>{const _=new Set(p.facePoses.map(m=>m.faceId));return _.size===d.size&&[...d].every(m=>_.has(m))});return{applicable:!0,ordered:o,coversEndpoints:c,uniqueParameters:l,withinDomain:a,maximumParameterStep:h,stepBounded:u,topologyStable:f,sampleCount:e.length}}function Ef(t){return{applicable:!1,ordered:!1,coversEndpoints:!1,uniqueParameters:!1,withinDomain:!1,maximumParameterStep:Number.POSITIVE_INFINITY,stepBounded:!1,topologyStable:!1,sampleCount:0,reason:t}}function bf(t,e,n=1e-8){const i=t.edges.filter(a=>a.kind==="hinge"||a.kind==="cutBank"||a.kind==="boundary").map(a=>a.id),s=t.edges.filter(a=>a.kind==="joined"||a.kind==="flatSeam").map(a=>a.id),r=new Set;for(const a of t.edges.filter(o=>o.kind==="joined"||o.kind==="flatSeam")){if(a.halfEdges.length!==2){r.add(a.id);continue}const o=a.halfEdges.map(c=>t.halfEdges.find(l=>l.id===c)?.face);if(!o[0]||!o[1]){r.add(a.id);continue}for(const c of e){const l=c.facePoses.find(u=>u.faceId===o[0])?.transform,h=c.facePoses.find(u=>u.faceId===o[1])?.transform;(!l||!h||Af(l,h)>n)&&r.add(a.id)}}return{controlled:r.size===0,declaredSingularEdgeIds:i,invalidSingularEdgeIds:[...r],smoothEdgeIds:s}}function Af(t,e){let n=Math.max(...t.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)n=Math.max(n,Math.abs(t.rotation[i][s]-e.rotation[i][s]));return n}function Tf(t,e,n=1e-8){if(e.length<2)return wf("Isometric recovery requires flat and deployed samples.");const i=new Map(e[0].facePoses.map(h=>[h.faceId,h.transform])),s=new Map(e[e.length-1].facePoses.map(h=>[h.faceId,h.transform]));let r=0,a=!0,o=!0;for(const h of t.faces){const u=_u(t,h.boundary),d=i.get(h.id),f=s.get(h.id);if(!d||!f){a=!1,o=!1;continue}for(const[_,m]of u){const g=t.vertices.find(y=>y.id===_),A=t.vertices.find(y=>y.id===m);if(!g||!A){a=!1;continue}const w=[g.position[0],g.position[1],0],v=[A.position[0],A.position[1],0],E=ct(Ke(v,w));for(const y of e){const T=y.facePoses.find(C=>C.faceId===h.id)?.transform;if(!T){a=!1;continue}const M=gt(T,w),b=gt(T,v),P=ct(Ke(b,M));r=Math.max(r,Math.abs(E-P))}}const p=d.rotation.every((_,m)=>_.every((g,A)=>Math.abs(g-(m===A?1:0))<=n))&&Math.abs(d.translation[0])<=n&&Math.abs(d.translation[1])<=n&&Math.abs(d.translation[2])<=n;o=o&&p}a=a&&r<=n;const c=t.faces.filter(h=>Rf(t,h.boundary)<=n).map(h=>h.id),l=bf(t,e,n);return{applicable:!0,piecewiseIsometric:a&&c.length===0&&l.controlled,recoversFlatPattern:o,maximumEdgeResidual:r,singularFaceIds:c,controlledSingularSet:l.controlled,invalidSingularEdgeIds:l.invalidSingularEdgeIds}}function _u(t,e){const n=[];let i=e;const s=new Set;for(;!s.has(i);){s.add(i);const r=t.halfEdges.find(o=>o.id===i);if(!r)break;const a=t.halfEdges.find(o=>o.id===r.next);if(!a)break;n.push([r.origin,a.origin]),i=r.next}return n}function wf(t){return{applicable:!1,piecewiseIsometric:!1,recoversFlatPattern:!1,maximumEdgeResidual:Number.POSITIVE_INFINITY,singularFaceIds:[],controlledSingularSet:!1,invalidSingularEdgeIds:[],reason:t}}function Rf(t,e){const n=_u(t,e).map(([s])=>t.vertices.find(r=>r.id===s)?.position).filter(s=>s!==void 0);let i=0;for(let s=0;s<n.length;s+=1){const r=n[s],a=n[(s+1)%n.length];i+=r[0]*a[1]-a[0]*r[1]}return Math.abs(i)/2}function Cf(t,e,n,i=1e-6){if(!Number.isFinite(n)||n<=0||!Number.isFinite(i)||i<=0)return ll(n,i,"Lipschitz bound and epsilon must be positive and finite.");const s=new Set(t.faces.map(o=>o.id));for(const o of[0,.5,1]){const c=e(o),l=new Map(c.facePoses.map(h=>[h.faceId,h.transform]));if(l.size!==s.size||[...s].some(h=>!l.has(h))||[...l.values()].some(h=>!Xs(h)))return ll(n,i,"Analytic path witnesses do not preserve the complete rigid face set.")}const r=Math.max(1,Math.ceil(n/i)),a=n/r;return{certified:a<=i,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!0,uniformlyConvergent:!0,lipschitzBound:n,epsilon:i,requiredSubdivisionCount:r,certifiedUniformErrorBound:a}}function ll(t,e,n){return{certified:!1,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!1,uniformlyConvergent:!1,lipschitzBound:t,epsilon:e,requiredSubdivisionCount:0,certifiedUniformErrorBound:Number.POSITIVE_INFINITY,reason:n}}function Pf(t,e,n){const i=Ci(t).length===0,s=fu(t),r=t.faces.reduce((l,h)=>l+h.holes.length,0),a=t.faces.every(l=>l.holes.every(h=>t.halfEdges.some(u=>u.id===h&&u.face===l.id))),o=n.applicable&&n.rigid&&n.hingesCompatible&&n.matrixCompatible,c=i&&s.necessaryGatesSatisfied&&s.materialConnected&&a&&o&&e.certified&&e.continuous&&e.uniformlyConvergent;return{certified:c,proof:c?"analytic-global-map":"unsupported",topologyValid:i,necessaryGatesSatisfied:s.necessaryGatesSatisfied,materialConnected:s.materialConnected,holesTracked:a,holeBoundaryCount:r,hingeContinuous:o,analyticContinuous:e.continuous,...c?{}:{reason:"A global certificate requires valid connected topology, all Chapter 5–6 gates, continuous hinges, tracked holes, and an analytic convergent map."}}}function If(t,e,n,i,s,r=1e-8){const a=gu(t,e),o=[],c=[];for(const d of t.edges.filter(f=>f.kind==="hinge"&&f.halfEdges.length===2)){const f=d.halfEdges.map(_=>t.halfEdges.find(m=>m.id===_)?.face);(e.some(_=>{const m=_.facePoses.find(A=>A.faceId===f[0])?.transform,g=_.facePoses.find(A=>A.faceId===f[1])?.transform;return!m||!g||Lf(m,g)>r})?o:c).push(d.id)}const h=a.applicable&&a.ordered&&a.coversEndpoints&&a.uniqueParameters&&a.withinDomain&&a.stepBounded&&a.topologyStable&&n.certified&&n.continuous&&n.uniformlyConvergent&&i.applicable&&i.rigid&&i.hingesCompatible&&i.matrixCompatible&&s.certified,u=h&&i.nontrivialMotion&&o.length>0;return{certified:h,proof:h?"analytic-configuration-path":"unsupported",selfFoldable:u,activeCreaseIds:o,optionalCreaseIds:c,path:a,...h?{}:{reason:"Configuration certification requires an ordered complete analytic path with rigid/global certificates."}}}function Lf(t,e){let n=Math.max(...t.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)n=Math.max(n,Math.abs(t.rotation[i][s]-e.rotation[i][s]));return n}function _c(t){if(!Number.isInteger(t.sampleCount)||t.sampleCount<2||t.sampleCount>1001)return{ok:!1,diagnostics:[xn("Path sample count must be an integer in [2, 1001].",t.input.operationId)]};const e=[...t.complex.edges].filter(_=>_.kind==="hinge"),n=[],i=8,s=(t.sampleCount-1)*i+1;for(let _=0;_<s;_+=1){const m=_/(s-1),g=dl(t.input,t.complex,t.sourceMap,m);if(!g)return{ok:!1,diagnostics:[xn("Stair hinge chain is missing or disconnected.",t.input.operationId)]};const A={id:`${t.input.operationId}:path:${_}`,facePoses:[...g.entries()].map(([v,E])=>({faceId:v,transform:E}))},w=af(t.complex,A);if(w.length>0)return{ok:!1,diagnostics:[xn(`Stair deployment sample ${_} has non-adjacent face overlap: ${w.map(v=>`${v.firstFaceId}:${v.secondFaceId}`).join(", ")}.`,t.input.operationId,_,m)]};_%i===0&&n.push({parameter:m,transforms:g})}const r=hf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:folding-map:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!r.applicable||!r.rigid||!r.continuous)return{ok:!1,diagnostics:[xn(r.reason??"Stair folding map failed topology, rigidity, or continuity validation.",t.input.operationId)]};const a=xf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:rigid:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!a.applicable||!a.rigid||!a.hingesCompatible||!a.monotone||!a.hingeStateValid||!a.matrixCompatible)return{ok:!1,diagnostics:[xn(a.reason??"Stair path failed rigid-foldability compatibility checks.",t.input.operationId)]};const o=gu(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:configuration:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),1e-9,1/(t.sampleCount-1));if(!o.applicable||!o.ordered||!o.coversEndpoints||!o.uniqueParameters||!o.withinDomain||!o.stepBounded||!o.topologyStable)return{ok:!1,diagnostics:[xn(o.reason??"Stair path failed configuration-space checks.",t.input.operationId)]};const c=Tf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:isometric:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!c.applicable||!c.piecewiseIsometric||!c.recoversFlatPattern)return{ok:!1,diagnostics:[xn(c.reason??"Stair path failed piecewise-isometric recovery checks.",t.input.operationId)]};const l=Math.hypot(t.input.width,t.input.stepCount*t.input.stepRun),h=Math.max(1,e.length*Math.PI/2*l),u=Cf(t.complex,_=>{const m=dl(t.input,t.complex,t.sourceMap,_);if(!m)throw new Error("Validated stair hinge chain became unavailable.");return{schemaVersion:1,id:`${t.input.operationId}:analytic:${_}`,parameterValues:[{parameterId:"deployment",value:_}],facePoses:[...m.entries()].map(([g,A])=>({faceId:g,transform:A})),hingeAngles:[]}},h);if(!u.certified)return{ok:!1,diagnostics:[xn(u.reason??"Stair path failed analytic folding-map certification.",t.input.operationId)]};const d=Pf(t.complex,u,a);if(!d.certified||d.proof!=="analytic-global-map")return{ok:!1,diagnostics:[xn(d.reason??"Stair path failed global folding-map certification.",t.input.operationId)]};const f=n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:configuration-certificate:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),p=If(t.complex,f,u,a,d);return!p.certified||!p.selfFoldable||p.proof!=="analytic-configuration-path"?{ok:!1,diagnostics:[xn(p.reason??"Stair path failed configuration-space certification.",t.input.operationId)]}:{ok:!0,samples:n,evidence:{classification:"certifiedRigidPath",foldingMap:{continuous:r.continuous,rigid:r.rigid,sampleCount:r.sampleCount,maximumDisplacement:r.uniformDisplacementResidual},rigidFoldability:{rigid:a.rigid,hingesCompatible:a.hingesCompatible,monotone:a.monotone,maximumHingeResidual:a.maximumHingeResidual,matrixCompatible:a.matrixCompatible,nontrivialMotion:a.nontrivialMotion,maximumMatrixResidual:a.maximumMatrixResidual},configurationSpace:{ordered:o.ordered,coversEndpoints:o.coversEndpoints,uniqueParameters:o.uniqueParameters,withinDomain:o.withinDomain,maximumParameterStep:o.maximumParameterStep,stepBounded:o.stepBounded,topologyStable:o.topologyStable},isometricRecovery:{piecewiseIsometric:c.piecewiseIsometric,recoversFlatPattern:c.recoversFlatPattern,maximumEdgeResidual:c.maximumEdgeResidual,controlledSingularSet:c.controlledSingularSet,invalidSingularEdgeIds:c.invalidSingularEdgeIds},analyticFoldingMap:{proof:u.proof,continuous:u.continuous,uniformlyConvergent:u.uniformlyConvergent,lipschitzBound:u.lipschitzBound,requiredSubdivisionCount:u.requiredSubdivisionCount,certifiedUniformErrorBound:u.certifiedUniformErrorBound},globalFoldingMap:{proof:d.proof,topologyValid:d.topologyValid,necessaryGatesSatisfied:d.necessaryGatesSatisfied,materialConnected:d.materialConnected,holesTracked:d.holesTracked,hingeContinuous:d.hingeContinuous},configurationCertificate:{proof:p.proof,selfFoldable:p.selfFoldable,activeCreaseIds:p.activeCreaseIds,optionalCreaseIds:p.optionalCreaseIds},verification:{method:"adaptive-sampled",sampleCount:s,maxParameterStep:1/i,collisionCheck:"coplanar-positive-area"}}}}function dl(t,e,n,i){const s=new Map,r=new Map(e.vertices.map(d=>[d.id,d])),a=t.stepCount*2+2,o=a/2,c=r.get(`v:${o}:0`)?.position[1];if(c===void 0)return;const l=-1,h=bi([0,c,0],[t.hostWidth,0,0],l*-i*Math.PI/2);for(const d of n.faces.filter(f=>f.faceId.startsWith("host-face:"))){const f=/^host-face:(\d+):(\d+)$/.exec(d.faceId);if(!f)return;const p=Number(f[1]);s.set(d.faceId,p<o?tn():h)}let u=tn();for(let d=0;d<a;d+=1){if(s.set(`stair-face:${d}`,u),d>=a-1)continue;const f=e.edges.find(y=>y.id===`hinge:${d}`);if(!f||f.halfEdges.length!==2)return;const p=r.get(`v:${d+1}:1`)?.position,_=r.get(`v:${d+1}:2`)?.position;if(!p||!_)return;const m=[p[0],p[1],0],g=[_[0],_[1],0],A=gt(u,m),w=gt(u,g),v=[w[0]-A[0],w[1]-A[1],w[2]-A[2]],E=f.hinge?.assignment==="mountain"?-1:1;u=Xt(bi(A,v,l*E*i*Math.PI/2),u)}if(s.size===e.faces.length)return s}function xn(t,e,n,i){return{severity:"error",category:"path",code:n===void 0?"PATH_POPUP_SAMPLE_COUNT_INVALID":"PATH_COLLISION_DETECTED",message:t,locations:n===void 0?[{kind:"entity",entity:{kind:"spatialOperation",id:e}}]:[{kind:"sample",index:n,parameter:i},{kind:"entity",entity:{kind:"spatialOperation",id:e}}],entities:[{kind:"spatialOperation",id:e}]}}const Df=1,Nf="hinge-flat",Ff="Flat canonical hinge",Uf="boundary",Of="single-hinge",kf="meter-radian",Bf=["Ideal zero-thickness rigid faces"],Vf="docs/single-hinge-specification.md",zf=1e-12,Hf="singleHinge",Gf={assignment:"valley",angle:0},Wf={ok:!0,childPoint:[2,0,0],classification:"certifiedRigidPath"},$f={schemaVersion:Df,id:Nf,title:Ff,fixtureClass:Uf,mechanismFamily:Of,units:kf,assumptions:Bf,provenance:Vf,tolerance:zf,kind:Hf,input:Gf,expected:Wf},Xf=1,qf="hinge-intermediate",Yf="Intermediate canonical hinge",Kf="valid",Zf="single-hinge",Jf="meter-radian",jf=["Ideal zero-thickness rigid faces"],Qf="docs/single-hinge-specification.md",ep=1e-12,tp="singleHinge",np={assignment:"valley",angle:1.0471975511965976},ip={ok:!0,childPoint:[1.5,0,-.8660254037844386],classification:"certifiedRigidPath"},sp={schemaVersion:Xf,id:qf,title:Yf,fixtureClass:Kf,mechanismFamily:Zf,units:Jf,assumptions:jf,provenance:Qf,tolerance:ep,kind:tp,input:np,expected:ip},rp=1,ap="hinge-folded",op="Quarter-turn canonical hinge",cp="valid",lp="single-hinge",dp="meter-radian",up=["Ideal zero-thickness rigid faces"],hp="docs/single-hinge-specification.md",fp=1e-12,pp="singleHinge",mp={assignment:"valley",angle:1.5707963267948966},gp={ok:!0,childPoint:[1,0,-1],classification:"certifiedRigidPath"},_p={schemaVersion:rp,id:ap,title:op,fixtureClass:cp,mechanismFamily:lp,units:dp,assumptions:up,provenance:hp,tolerance:fp,kind:pp,input:mp,expected:gp},xp=1,vp="hinge-assignment-invalid",Mp="Valley hinge rejects a negative angle",yp="invalid",Sp="single-hinge",Ep="meter-radian",bp=["Positive angles are valley folds"],Ap="docs/single-hinge-specification.md",Tp=1e-12,wp="singleHinge",Rp={assignment:"valley",angle:-.5},Cp={ok:!1,diagnosticCodes:["KINEMATICS_ANGLE_OUT_OF_RANGE","KINEMATICS_ASSIGNMENT_MISMATCH"]},Pp={schemaVersion:xp,id:vp,title:Mp,fixtureClass:yp,mechanismFamily:Sp,units:Ep,assumptions:bp,provenance:Ap,tolerance:Tp,kind:wp,input:Rp,expected:Cp},Ip=1,Lp="vertex-valid-3m1v",Dp="Four-crease vertex satisfying Kawasaki and Maekawa",Np="valid",Fp="single-vertex",Up="meter-radian",Op=["Interior crease-only vertex"],kp="docs/mathematical-contract.md#37-local-flat-foldability",Bp=1e-12,Vp="singleVertex",zp={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","mountain","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},Hp={kawasaki:"satisfied",maekawa:"satisfied",locallyFlatFoldable:!0},Gp={schemaVersion:Ip,id:Lp,title:Dp,fixtureClass:Np,mechanismFamily:Fp,units:Up,assumptions:Op,provenance:kp,tolerance:Bp,kind:Vp,input:zp,expected:Hp},Wp=1,$p="vertex-invalid-2m2v",Xp="Four-crease vertex failing Maekawa",qp="invalid",Yp="single-vertex",Kp="meter-radian",Zp=["Interior crease-only vertex"],Jp="docs/mathematical-contract.md#37-local-flat-foldability",jp=1e-12,Qp="singleVertex",em={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","valley","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},tm={kawasaki:"satisfied",maekawa:"failed",locallyFlatFoldable:!1},nm={schemaVersion:Wp,id:$p,title:Xp,fixtureClass:qp,mechanismFamily:Yp,units:Kp,assumptions:Zp,provenance:Jp,tolerance:jp,kind:Qp,input:em,expected:tm},im=1,sm="popup-symmetric",rm="Symmetric axis-aligned two-plane pop-up",am="valid",om="two-plane-pop-up",cm="meter-radian",lm=["Ideal zero-thickness rigid linkage"],dm="docs/mathematical-contract.md#4-two-plane-pop-up-family",um=1e-10,hm="twoPlanePopUp",fm={id:"popup-symmetric",width:2,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},pm={ok:!0,deployedJunction:[0,1,1],axisAligned:!0,classification:"certifiedRigidPath"},mm={schemaVersion:im,id:sm,title:rm,fixtureClass:am,mechanismFamily:om,units:cm,assumptions:lm,provenance:dm,tolerance:um,kind:hm,input:fm,expected:pm},gm=1,_m="popup-unequal",xm="Unequal-link rotated two-plane pop-up",vm="valid",Mm="two-plane-pop-up",ym="meter-radian",Sm=["Unequal links may rotate the child frame"],Em="docs/mathematical-contract.md#4-two-plane-pop-up-family",bm=1e-10,Am="twoPlanePopUp",Tm={id:"popup-unequal",width:2,height:1,depth:2,deployedAngle:1.5707963267948966,sampleCount:7},wm={ok:!0,deployedJunction:[0,.8,1.6],axisAligned:!1,classification:"certifiedRigidPath"},Rm={schemaVersion:gm,id:_m,title:xm,fixtureClass:vm,mechanismFamily:Mm,units:ym,assumptions:Sm,provenance:Em,tolerance:bm,kind:Am,input:Tm,expected:wm},Cm=1,Pm="popup-invalid-width",Im="Two-plane pop-up rejects zero width",Lm="invalid",Dm="two-plane-pop-up",Nm="meter-radian",Fm=["Mechanism dimensions must be positive"],Um="docs/mathematical-contract.md#4-two-plane-pop-up-family",Om=1e-10,km="twoPlanePopUp",Bm={id:"popup-invalid-width",width:0,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},Vm={ok:!1,diagnosticCodes:["MECHANISM_POPUP_INVALID_PARAMETER"]},zm={schemaVersion:Cm,id:Pm,title:Im,fixtureClass:Lm,mechanismFamily:Dm,units:Nm,assumptions:Fm,provenance:Um,tolerance:Om,kind:km,input:Bm,expected:Vm},Hm=1,Gm="spatial-root",Wm="One root plane pair",$m="valid",Xm="nested-parallel-strip",qm="meter-radian",Ym=["Two-level synchronized strip family"],Km="docs/mathematical-contract.md#5-composition-contract",Zm=1e-10,Jm="spatialProgram",jm={schemaVersion:1,id:"spatial-root",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Qm={ok:!0,classification:"certifiedRigidPath"},eg={schemaVersion:Hm,id:Gm,title:Wm,fixtureClass:$m,mechanismFamily:Xm,units:qm,assumptions:Ym,provenance:Km,tolerance:Zm,kind:Jm,input:jm,expected:Qm},tg=1,ng="spatial-nested-shelf",ig="Root plane pair with nested shelf",sg="valid",rg="nested-parallel-strip",ag="meter-radian",og=["Two-level synchronized strip family"],cg="docs/mathematical-contract.md#5-composition-contract",lg=1e-10,dg="spatialProgram",ug={schemaVersion:1,id:"spatial-nested-shelf",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:3,height:1.5,depth:1.5,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"shelf",kind:"shelf",target:{kind:"generatedPair",operationId:"root"},xOffset:.5,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},hg={ok:!0,classification:"certifiedRigidPath"},fg={schemaVersion:tg,id:ng,title:ig,fixtureClass:sg,mechanismFamily:rg,units:ag,assumptions:og,provenance:cg,tolerance:lg,kind:dg,input:ug,expected:hg},pg=1,mg="spatial-siblings",gg="Disjoint sibling plane pairs",_g="valid",xg="nested-parallel-strip",vg="meter-radian",Mg=["Sibling strip interiors are disjoint"],yg="docs/mathematical-contract.md#5-composition-contract",Sg=1e-10,Eg="spatialProgram",bg={schemaVersion:1,id:"spatial-siblings",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"left",kind:"wall",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"right",kind:"platform",target:{kind:"sheet"},xOffset:4,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Ag={ok:!0,classification:"certifiedRigidPath"},Tg={schemaVersion:pg,id:mg,title:gg,fixtureClass:_g,mechanismFamily:xg,units:vg,assumptions:Mg,provenance:yg,tolerance:Sg,kind:Eg,input:bg,expected:Ag},wg=1,Rg="spatial-overlap",Cg="Overlapping siblings are rejected",Pg="invalid",Ig="nested-parallel-strip",Lg="meter-radian",Dg=["Sibling strip interiors must be disjoint"],Ng="docs/mathematical-contract.md#5-composition-contract",Fg=1e-10,Ug="spatialProgram",Og={schemaVersion:1,id:"spatial-overlap",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"a",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"b",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},kg={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OVERLAP"]},Bg={schemaVersion:wg,id:Rg,title:Cg,fixtureClass:Pg,mechanismFamily:Ig,units:Lg,assumptions:Dg,provenance:Ng,tolerance:Fg,kind:Ug,input:Og,expected:kg},Vg=1,zg="spatial-depth-three",Hg="Depth-three hierarchy is rejected",Gg="unsupported",Wg="nested-parallel-strip",$g="meter-radian",Xg=["Only root and child module levels are supported"],qg="docs/mathematical-contract.md#5-composition-contract",Yg=1e-10,Kg="spatialProgram",Zg={schemaVersion:1,id:"spatial-depth-three",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:3,height:2,depth:2,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"child",kind:"planePair",target:{kind:"generatedPair",operationId:"root"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"grandchild",kind:"planePair",target:{kind:"generatedPair",operationId:"child"},xOffset:0,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},Jg={ok:!1,diagnosticCodes:["SPATIAL_TARGET_DEPTH_UNSUPPORTED"]},jg={schemaVersion:Vg,id:zg,title:Hg,fixtureClass:Gg,mechanismFamily:Wg,units:$g,assumptions:Xg,provenance:qg,tolerance:Yg,kind:Kg,input:Zg,expected:Jg},Qg=1,e_="spatial-opening",t_="Opening is explicitly unsupported",n_="unsupported",i_="bounded-spatial-compiler",s_="meter-radian",r_=["Subtractive topology is not certified"],a_="docs/mathematical-contract.md#51-bounded-spatial-compilation",o_=1e-10,c_="spatialProgram",l_={schemaVersion:1,id:"spatial-opening",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"door",kind:"opening",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},d_={ok:!1,diagnosticCodes:["SPATIAL_OPERATION_UNSUPPORTED"]},u_={schemaVersion:Qg,id:e_,title:t_,fixtureClass:n_,mechanismFamily:i_,units:s_,assumptions:r_,provenance:a_,tolerance:o_,kind:c_,input:l_,expected:d_},h_=1,f_="spatial-out-of-bounds",p_="Attachment outside the sheet is rejected",m_="invalid",g_="nested-parallel-strip",__="meter-radian",x_=["Attachments must fit their host material"],v_="docs/mathematical-contract.md#5-composition-contract",M_=1e-10,y_="spatialProgram",S_={schemaVersion:1,id:"spatial-out-of-bounds",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"outside",kind:"planePair",target:{kind:"sheet"},xOffset:5,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},E_={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS"]},b_={schemaVersion:h_,id:f_,title:p_,fixtureClass:m_,mechanismFamily:g_,units:__,assumptions:x_,provenance:v_,tolerance:M_,kind:y_,input:S_,expected:E_};function xc(t){const e=t==="valley"?[0,Math.PI]:[-Math.PI,0];return{schemaVersion:1,vertices:[{id:"v0",position:[0,0]},{id:"v1",position:[1,0]},{id:"v2",position:[2,0]},{id:"v3",position:[2,1]},{id:"v4",position:[1,1]},{id:"v5",position:[0,1]}],halfEdges:[{id:"hl0",origin:"v0",next:"hl1",edge:"e0",face:"left"},{id:"hl1",origin:"v1",next:"hl2",twin:"hr3",edge:"hinge",face:"left"},{id:"hl2",origin:"v4",next:"hl3",edge:"e1",face:"left"},{id:"hl3",origin:"v5",next:"hl0",edge:"e2",face:"left"},{id:"hr0",origin:"v1",next:"hr1",edge:"e3",face:"right"},{id:"hr1",origin:"v2",next:"hr2",edge:"e4",face:"right"},{id:"hr2",origin:"v3",next:"hr3",edge:"e5",face:"right"},{id:"hr3",origin:"v4",next:"hr0",twin:"hl1",edge:"hinge",face:"right"}],edges:[{id:"e0",halfEdges:["hl0"],kind:"boundary"},{id:"e1",halfEdges:["hl2"],kind:"boundary"},{id:"e2",halfEdges:["hl3"],kind:"boundary"},{id:"e3",halfEdges:["hr0"],kind:"boundary"},{id:"e4",halfEdges:["hr1"],kind:"boundary"},{id:"e5",halfEdges:["hr2"],kind:"boundary"},{id:"hinge",halfEdges:["hl1","hr3"],kind:"hinge",hinge:{assignment:t,restAngle:0,angleRange:e}}],faces:[{id:"left",boundary:"hl0",holes:[]},{id:"right",boundary:"hr0",holes:[]}],cutPairs:[],materialComponents:[{id:"sheet",faces:["left","right"]}]}}function xu(t){return vc(t?.id)&&vu(t?.material)&&Ai(t?.panelThickness)&&T_(t?.crease)&&w_(t?.contact)?[]:[Mu("MECHANICS_PROFILE_INVALID","Mechanics profiles require valid SI material, thickness, crease, and contact parameters.",t?.id??"unknown")]}function A_(t){return vc(t?.id)&&ti(t?.kerf)&&ti(t?.lengthTolerance)&&ti(t?.angleTolerance)&&t.angleTolerance<Math.PI&&Ai(t?.minimumFeatureWidth)&&Ai(t?.minimumBridgeWidth)&&ti(t?.nominalCreaseWidth)?[]:[Mu("FABRICATION_PROFILE_INVALID","Fabrication profiles require finite non-negative tolerances and positive feature and bridge widths.",t?.id??"unknown")]}function vu(t){return vc(t?.id)&&Ai(t?.density)&&Ai(t?.youngModulus)&&Number.isFinite(t?.poissonRatio)&&t.poissonRatio>-1&&t.poissonRatio<.5}function T_(t){return t?.model==="concentratedHinge"?ti(t.rotationalStiffness):t?.model==="compliantStrip"&&Ai(t.width)&&Ai(t.thickness)&&vu(t.material)}function w_(t){return["disabled","frictionless","coulomb"].includes(t?.mode)&&ti(t?.clearance)&&ti(t?.collisionMargin)&&ti(t?.frictionCoefficient)&&Number.isFinite(t?.restitution)&&t.restitution>=0&&t.restitution<=1&&(t.mode==="coulomb"||t.frictionCoefficient===0)}function Ai(t){return Number.isFinite(t)&&t>0}function ti(t){return Number.isFinite(t)&&t>=0}function vc(t){return typeof t=="string"&&t.length>0}function Mu(t,e,n){return{severity:"error",category:"mechanics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"physicalProfile",id:n}}],entities:[{kind:"physicalProfile",id:n}]}}function ks(t,e){const n=lo(t,e.halfEdges[0]),i=lo(t,n.next);return[n.origin,i.origin]}function Mc(t,e){const n=[],i=new Set;let s=e.boundary;for(;!i.has(s);){i.add(s);const r=lo(t,s);n.push(r.origin),s=r.next}if(s!==e.boundary)throw new Error(`Face ${e.id} boundary is not a closed loop.`);return n}function lo(t,e){const n=t.halfEdges.find(i=>i.id===e);if(!n)throw new Error(`Missing half-edge ${e}.`);return n}function yu(t,e){const n=new Map(t.vertices.map((s,r)=>[s.id,r])),i=new Map([]);return{file_spec:1.2,file_creator:"Kirigami Spatial Engine",file_classes:["singleModel"],frame_classes:["creasePattern"],file_units:"m",vertices_coords:t.vertices.map(s=>s.position),edges_vertices:t.edges.map(s=>{const[r,a]=ks(t,s),o=n.get(r),c=n.get(a);if(o===void 0||c===void 0)throw new Error(`Edge ${s.id} references a missing vertex.`);return[o,c]}),edges_assignment:t.edges.map(R_),edges_foldAngle:t.edges.map(s=>s.kind==="flatSeam"||s.kind==="joined"?0:s.kind!=="hinge"?null:(i.get(s.id)??s.hinge?.restAngle??0)*180/Math.PI),faces_vertices:t.faces.map(s=>Mc(t,s).map(r=>{const a=n.get(r);if(a===void 0)throw new Error(`Face ${s.id} references a missing vertex.`);return a}))}}function R_(t){switch(t.kind){case"boundary":return"B";case"cutBank":return"C";case"hinge":return C_(t.hinge?.assignment??"unassigned");case"joined":case"flatSeam":return"F"}}function C_(t){return t==="mountain"?"M":t==="valley"?"V":"U"}function P_(t,e){return!Number.isFinite(e?.foldPercent)||e.foldPercent<-1||e.foldPercent>1||!I_(e.axialStiffness)||!ul(e.faceStiffness)||!ul(e.creaseStiffness)||typeof e.calculateFaceStrain!="boolean"?L_(t.definition.id,"OrigamiSimulator controls require foldPercent in [-1, 1], positive axial stiffness, and non-negative face and crease stiffness."):{ok:!0,job:{schemaVersion:1,id:`origami-simulator-job:${t.definition.id}`,subjectId:t.definition.id,backend:"origamiSimulator",capabilities:["foldPreview","approximateStrain"],fold:yu(t.complex),controls:{...e}}}}function I_(t){return Number.isFinite(t)&&t>0}function ul(t){return Number.isFinite(t)&&t>=0}function L_(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"mechanics",code:"SIMULATION_JOB_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function D_(t,e,n,i){const s=xu(e);if(s.length>0)return{ok:!1,diagnostics:s};if(!N_(n))return hl(t.definition.id,"PyKirigami options require finite bounded timestep, damping, stiffness, ERP, substeps, and maximum steps.");const r=t.complex.edges.find(u=>u.kind==="hinge"&&u.hinge?.assignment==="unassigned");if(r)return hl(t.definition.id,`PyKirigami finite-thickness hinge ${r.id} requires a mountain or valley side.`);const a=new Map(t.complex.vertices.map(u=>[u.id,u.position])),o=t.complex.faces.map(u=>Mc(t.complex,u)),c=new Map(t.complex.faces.map((u,d)=>[u.id,d])),l=new Map(t.complex.halfEdges.map(u=>[u.id,u])),h=[];for(const u of t.complex.edges){if(u.halfEdges.length!==2||!["hinge","joined","flatSeam"].includes(u.kind))continue;const d=l.get(u.halfEdges[0]),f=l.get(u.halfEdges[1]),p=c.get(d.face),_=c.get(f.face),m=u.kind==="hinge"?u.hinge.assignment==="mountain"?1:2:3,g=[...ks(t.complex,u)].sort();for(const A of g)h.push({firstTile:p,firstVertex:o[p].indexOf(A),secondTile:_,secondVertex:o[_].indexOf(A),connectionFace:m,sourceEdgeId:u.id,sourceEdgeKind:u.kind})}return{ok:!0,job:{schemaVersion:1,id:`pykirigami-job:${t.definition.id}`,subjectId:t.definition.id,backend:"pykirigami",capabilities:["rigidTileDynamics","finiteThicknessCollision"],tiles:t.complex.faces.map((u,d)=>({id:u.id,vertices:o[d].map(f=>{const[p,_]=a.get(f);return[p,_,0]})})),constraints:h,brickThickness:e.panelThickness,contact:e.contact,options:{...n}}}}function N_(t){return F_(t?.timestep)&&Number.isInteger(t?.substeps)&&t.substeps>=1&&t.substeps<=1e3&&Number.isFinite(t?.errorReductionParameter)&&t.errorReductionParameter>=0&&t.errorReductionParameter<=1&&Number.isFinite(t?.gravity)&&Fi(t?.linearDamping)&&Fi(t?.angularDamping)&&Fi(t?.springStiffness)&&Fi(t?.torqueStiffness)&&Fi(t?.forceDamping)&&Fi(t?.torqueDamping)&&typeof t?.filterConnectedCollisions=="boolean"&&Number.isInteger(t?.maximumSteps)&&t.maximumSteps>=1&&t.maximumSteps<=1e6}function F_(t){return Number.isFinite(t)&&t>0}function Fi(t){return Number.isFinite(t)&&t>=0}function hl(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"mechanics",code:"SIMULATION_JOB_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function U_(t){const e=t.vertices.map(l=>l.position[0]),n=t.vertices.map(l=>l.position[1]),i=Math.min(...e),s=Math.min(...n),r=Math.max(...e)-i,a=Math.max(...n)-s,o=new Map(t.vertices.map(l=>[l.id,l.position])),c=t.edges.map(l=>{const[h,u]=ks(t,l),d=o.get(h),f=o.get(u);if(!d||!f)throw new Error(`Edge ${l.id} is missing vertices.`);return[`  <line data-edge-id="${k_(l.id)}"`,`data-edge-kind="${l.kind}"`,`class="${O_(l)}"`,`x1="${$n(d[0])}" y1="${$n(d[1])}"`,`x2="${$n(f[0])}" y2="${$n(f[1])}" />`].join(" ")});return[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${$n(i)} ${$n(s)} ${$n(r)} ${$n(a)}">`,"  <style>.boundary{stroke:#111}.cut{stroke:#e11}.fold{stroke-dasharray:.04 .025}.mountain{stroke:#d33}.valley{stroke:#36c}.flat{stroke:#777}line{fill:none;stroke-width:.008;vector-effect:non-scaling-stroke}</style>",...c,"</svg>"].join(`
`)}function O_(t){return t.kind==="boundary"?"boundary":t.kind==="cutBank"?"cut":t.kind==="hinge"?`fold ${t.hinge?.assignment??"unassigned"}`:"flat"}function $n(t){return Object.is(t,-0)?"0":String(t)}function k_(t){return t.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function B_(t,e,n){const i=[...xu(e),...A_(n)];if(i.length>0)return{ok:!1,diagnostics:i};const s=new Map(t.complex.vertices.map((r,a)=>[r.id,a]));return{ok:!0,job:{schemaVersion:1,id:`swomps-job:${t.definition.id}`,subjectId:t.definition.id,backend:"swomps",capabilities:["barAndHingeMechanics","panelContact","compliantCrease"],nodes:t.complex.vertices.map((r,a)=>({id:r.id,index:a,position:[r.position[0],r.position[1],0]})),panels:t.complex.faces.map(r=>({id:r.id,nodeIndices:Mc(t.complex,r).map(a=>s.get(a))})),hinges:t.complex.edges.filter(r=>r.kind==="hinge").map(r=>{const[a,o]=ks(t.complex,r);return{id:r.id,nodeIndices:[s.get(a),s.get(o)],assignment:r.hinge.assignment}}),cutBanks:t.complex.edges.filter(r=>r.kind==="cutBank").map(r=>{const[a,o]=ks(t.complex,r);return{id:r.id,cutPairId:r.cutBank.pair,bank:r.cutBank.bank,nodeIndices:[s.get(a),s.get(o)]}}),mechanics:e,fabrication:n}}}function fl(t){if(t.locations.length===0)throw new RangeError("A diagnostic requires at least one location.");if(t.locations.filter(s=>s.kind==="nonSpatial").length>0&&t.locations.length!==1)throw new RangeError("A non-spatial location must be exclusive.");for(const s of t.locations)V_(s);const n=t.locations.map(z_),i=n.flatMap(s=>s.kind==="entity"?[s.entity]:[]);return{severity:t.severity,category:t.category,code:t.code,message:t.message,locations:n,entities:i,...t.suggestion===void 0?{}:{suggestion:t.suggestion}}}function V_(t){if(t.kind==="entity"){if(t.entity.kind.length===0||t.entity.id.length===0)throw new RangeError("A diagnostic entity location requires kind and ID.");return}if(t.kind==="parameter"){if(t.path.length===0||t.path.some(e=>typeof e=="string"&&e.length===0||typeof e=="number"&&(!Number.isInteger(e)||e<0)))throw new RangeError("A diagnostic parameter path must be non-empty.");return}if(t.kind==="sample"){if(!Number.isInteger(t.index)||t.index<0)throw new RangeError("A diagnostic sample index must be non-negative.");if(t.parameter!==void 0&&!Number.isFinite(t.parameter))throw new RangeError("A diagnostic sample parameter must be finite.");return}if(t.reason.trim().length===0)throw new RangeError("A non-spatial diagnostic requires a reason.")}function z_(t){return t.kind==="entity"?{kind:"entity",entity:{...t.entity}}:t.kind==="parameter"?{kind:"parameter",path:[...t.path]}:t.kind==="sample"?{kind:"sample",index:t.index,...t.parameter===void 0?{}:{parameter:t.parameter}}:{kind:"nonSpatial",reason:t.reason}}function Su(t){const e=Ci(t.complex);if(e.length>0)return{ok:!1,diagnostics:e};if(!Xs(t.parentPose,Qe.relativeRank))return Ui("KINEMATICS_PARENT_POSE_INVALID","The parent pose must be a finite proper rigid transform.","face",t.parentFaceId);const n=t.complex.edges.find(p=>p.id===t.hingeEdgeId);if(!n||n.kind!=="hinge"||!n.hinge||n.halfEdges.length!==2||t.complex.faces.length!==2)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The analytic family requires exactly two faces joined by the selected hinge.","edge",t.hingeEdgeId);const i=n.halfEdges.map(p=>t.complex.halfEdges.find(_=>_.id===p)).filter(p=>p!==void 0),s=i.find(p=>p.face===t.parentFaceId);if(!s)return Ui("KINEMATICS_PARENT_NOT_INCIDENT","The selected parent face must be incident to the hinge.","face",t.parentFaceId);const r=i.find(p=>p.id!==s.id);if(!r)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The selected hinge does not have a child side.","edge",n.id);const a=G_(n,t.angle);if(a.length>0)return{ok:!1,diagnostics:a};const o=pl(t.complex,s.origin),c=t.complex.halfEdges.find(p=>p.id===s.next);if(!c)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The parent hinge half-edge has no valid destination.","halfEdge",s.id);const l=pl(t.complex,c.origin),h=Ke(l,o),u=ct(h),d=du(u,Qe);if(u<=d)return Ui("KINEMATICS_DEGENERATE_HINGE","The hinge axis must have nonzero length.","edge",n.id);const f=Xt(t.parentPose,bi(o,h,t.angle));return{ok:!0,childFaceId:r.face,certificate:H_(t,n,r.face),state:{schemaVersion:1,id:t.stateId,parameterValues:[{parameterId:t.hingeEdgeId,value:t.angle}],facePoses:[{faceId:t.parentFaceId,transform:t.parentPose},{faceId:r.face,transform:f}],hingeAngles:[{edgeId:t.hingeEdgeId,angle:t.angle}]}}}function H_(t,e,n){return{id:`single-hinge-certificate:${t.stateId}`,subjectId:t.stateId,classification:"certifiedRigidPath",theoremIds:["single-hinge-axis-angle-path"],assumptions:[{id:"ideal-zero-thickness",statement:"Faces are perfectly rigid and the hinge has zero width and thickness."},{id:"intentional-flat-contact",statement:"Coincident layers at a flat-folded endpoint are permitted."}],constraints:[{id:"canonical-topology",status:"satisfied",method:"exact"},{id:"rigid-face-isometry",status:"satisfied",method:"exact"},{id:"hinge-axis-coincidence",status:"satisfied",method:"exact"},{id:"angle-admissibility",status:"satisfied",method:"exact"},{id:"one-dof-analytic-path",status:"satisfied",method:"exact",details:`Angle path from 0 to ${t.angle} radians about edge ${e.id}; child face ${n}.`}],unsupportedConditions:[],provenance:[{source:"docs/single-hinge-specification.md",locator:"Certificate Scope",claimId:"single-hinge-axis-angle-path"}]}}function G_(t,e){if(!t.hinge)return[];const n=[],[i,s]=t.hinge.angleRange,r=Qe.absoluteAngle;return(!Number.isFinite(e)||e<i-r||e>s+r)&&n.push(uo("KINEMATICS_ANGLE_OUT_OF_RANGE","Requested fold angle lies outside the declared hinge interval.","edge",t.id)),(t.hinge.assignment==="valley"&&e<-r||t.hinge.assignment==="mountain"&&e>r)&&n.push(uo("KINEMATICS_ASSIGNMENT_MISMATCH","Requested fold-angle sign conflicts with the mountain/valley assignment.","edge",t.id)),n}function pl(t,e){const n=t.vertices.find(i=>i.id===e);if(!n)throw new Error(`Validated topology is missing vertex ${e}.`);return[n.position[0],n.position[1],0]}function Ui(t,e,n,i){return{ok:!1,diagnostics:[uo(t,e,n,i)]}}function uo(t,e,n,i){return{severity:"error",category:"kinematics",code:t,message:e,locations:t==="KINEMATICS_ANGLE_OUT_OF_RANGE"||t==="KINEMATICS_ASSIGNMENT_MISMATCH"?[{kind:"entity",entity:{kind:n,id:i}},{kind:"parameter",path:["input","angle"]}]:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}]}}function W_(t){return t.reduce((e,n)=>Xt(e,n),tn())}function $_(t,e=Math.max(Qe.absoluteLength,Qe.absoluteAngle)){const n=W_(t),i=tn();let s=0;for(let o=0;o<3;o+=1)for(let c=0;c<3;c+=1)s=Math.max(s,Math.abs(n.rotation[o][c]-i.rotation[o][c]));const r=Math.max(...n.translation.map(o=>Math.abs(o))),a=Math.max(s,r);return{product:n,rotationResidual:s,translationResidual:r,residual:a,tolerance:e,closed:Number.isFinite(a)&&e>=0&&s<=e&&r<=e}}function Eu(t,e){const[n,i]=[t,e].sort((s,r)=>s.localeCompare(r));return`overlap:${n}:${i}`}function bu(t){return`out-of-bounds:${t}`}function yc(t,e){const n=[0,0,0],i=[1,0,0],s=[0,1,0],r=[0,Math.cos(e),Math.sin(e)];return{id:`${t.id}:global-pair`,ownerNodeId:t.id,origin:n,widthAxis:i,width:t.width,parentAngle:e,angleRange:[t.deployedAngle,Math.PI],boundary:{start:n,end:Ft(n,St(i,t.width))},floor:{frame:qr(n,i,s),extent:t.floorExtent,materialSide:"negativeNormal"},wall:{frame:qr(n,i,r),extent:t.wallExtent,materialSide:"negativeNormal"}}}function Au(t,e,n=t.id){const i=e.points.junction,s=e.frames.childFloor.widthAxis,r=St(e.frames.childFloor.inPlaneAxis,-1),a=St(e.frames.childWall.inPlaneAxis,-1);return{id:`${n}:generated-pair`,ownerNodeId:n,origin:i,widthAxis:s,width:t.width,parentAngle:e.parentAngle,angleRange:[t.deployedAngle,Math.PI],boundary:{start:i,end:Ft(i,St(s,t.width))},floor:{frame:qr(i,s,r),extent:t.linkage==="parallelogram"?t.depth:t.height,materialSide:"negativeNormal"},wall:{frame:qr(i,s,a),extent:t.linkage==="parallelogram"?t.height:t.depth,materialSide:"negativeNormal"}}}function Tu(t,e,n){if(!Number.isFinite(n))throw new RangeError("Port width offset must be finite.");const i={...e.floor.frame,origin:Ft(e.origin,St(e.widthAxis,n))},s=gc(t.frames.parentFloor,i);return X_(t,s)}function X_(t,e){return{...t,points:{origin:gt(e,t.points.origin),floorAnchor:gt(e,t.points.floorAnchor),wallAnchor:gt(e,t.points.wallAnchor),junction:gt(e,t.points.junction)},frames:{parentFloor:js(t.frames.parentFloor,e),parentWall:js(t.frames.parentWall,e),childFloor:js(t.frames.childFloor,e),childWall:js(t.frames.childWall,e)}}}function js(t,e){return{origin:gt(e,t.origin),widthAxis:yi(e.rotation,t.widthAxis),inPlaneAxis:yi(e.rotation,t.inPlaneAxis),normal:yi(e.rotation,t.normal)}}function qr(t,e,n){return{origin:t,widthAxis:e,inPlaneAxis:n,normal:si(ds(e,n))}}function Sc(t){const n=[["width",t.width],["height",t.height],["depth",t.depth]].filter(([,s])=>!Number.isFinite(s)||s<=0),i=[];return n.length>0&&i.push(Yr("MECHANISM_POPUP_INVALID_PARAMETER",`Pop-up dimensions must be finite and positive: ${n.map(([s])=>s).join(", ")}.`,t.id,"Use finite dimensions greater than zero.",n.map(([s])=>["input",s]))),(!Number.isFinite(t.deployedAngle)||t.deployedAngle<=0||t.deployedAngle>=Math.PI)&&i.push(Yr("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","The deployed parent angle must lie strictly between zero and pi radians.",t.id,"Choose a deployed angle in the open interval (0, pi).",[["input","deployedAngle"]])),i}function da(t,e){const n=Sc(t),i=Qe.absoluteAngle;return(!Number.isFinite(e)||e<t.deployedAngle-i||e>Math.PI+i)&&n.push(Yr("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","The parent angle lies outside the mechanism path domain.",t.id,`Choose an angle from ${t.deployedAngle} through ${Math.PI} radians.`,[["parentAngle"]])),n.length>0?{ok:!1,diagnostics:n}:{ok:!0,state:wu(t,e)}}function Ec(t,e){const n=Sc(t);if((!Number.isFinite(e)||!Number.isInteger(e)||e<2)&&n.push(Yr("PATH_POPUP_SAMPLE_COUNT_INVALID","A pop-up path requires an integer sample count of at least two.",t.id,"Use an integer sample count greater than or equal to two.",[["input","sampleCount"]])),n.length>0)return{ok:!1,diagnostics:n};const i=Array.from({length:e},(s,r)=>{const a=r/(e-1),o=Math.PI+a*(t.deployedAngle-Math.PI);return wu(t,o)});return{ok:!0,path:{id:`two-plane-popup-path:${t.id}`,domain:[t.deployedAngle,Math.PI],samples:i,evaluate(s){const r=da(t,s);if(!r.ok)throw new RangeError(r.diagnostics.map(a=>a.message).join(" "));return r.state},certificate:Y_(t)}}}function wu(t,e){const n=[0,0,0],i=[1,0,0],s=[0,1,0],r=[0,Math.cos(e),Math.sin(e)],a=St(s,t.depth),o=St(r,t.height),c=t.linkage==="parallelogram"?Ft(a,o):q_(t,e,a,o),l=si(Ke(c,a)),h=si(Ke(c,o)),u=Math.max(ct(Ke(l,r)),ct(Ke(h,s))),d=Math.abs(e-Math.PI)<=Qe.absoluteAngle;return{id:`${t.id}:angle:${e}`,parentAngle:e,points:{origin:n,floorAnchor:a,wallAnchor:o,junction:c},frames:{parentFloor:Qs(n,i,s),parentWall:Qs(n,i,r),childFloor:Qs(c,i,h),childWall:Qs(c,i,l)},axisAligned:u<=Qe.absoluteAngle,alignmentResidual:u,contact:d?"intentionalFlatCoincidence":"clear"}}function q_(t,e,n,i){const s=Ke(i,n),r=Math.sin(e/2),a=(t.depth-t.height)**2+4*t.depth*t.height*r*r,o=t.depth*(t.depth-t.height+2*t.height*r*r)/a;return St(Ft(n,St(s,o)),2)}function Qs(t,e,n){return{origin:t,widthAxis:e,inPlaneAxis:n,normal:si(ds(e,n))}}function Y_(t){const e=t.linkage==="parallelogram";return{id:`two-plane-popup-certificate:${t.id}`,subjectId:t.id,classification:"certifiedRigidPath",theoremIds:[e?"two-plane-popup-parallelogram-path":"two-plane-popup-reflection-path"],assumptions:[{id:"ideal-zero-thickness",statement:"All four panels are perfectly rigid with zero thickness and ideal hinges."},{id:"constant-width-extrusion",statement:"The planar linkage is extruded at constant positive width."},{id:"intentional-flat-contact",statement:"Coincident layers at the flat endpoint are permitted."}],constraints:[{id:"positive-finite-dimensions",status:"satisfied",method:"exact"},{id:"rigid-link-isometry",status:"satisfied",method:"exact"},{id:"four-bar-loop-closure",status:"satisfied",method:"exact",details:e?"Opposite linkage edges remain parallel and equal throughout the path.":"The moving junction is the reflection of the origin across the anchor line."},{id:e?"continuous-parallelogram-branch":"continuous-reflection-branch",status:"satisfied",method:"exact"},{id:"open-path-collision-freedom",status:"satisfied",method:"exact"}],unsupportedConditions:[],provenance:[{source:"docs/superpowers/specs/2026-07-29-two-plane-pop-up-design.md",locator:"Mathematical Claims",claimId:"two-plane-popup-reflection-path"},{source:"docs/mathematical-contract.md",locator:"4. Two-Plane Pop-Up Family"}]}}function Yr(t,e,n,i,s=[]){return{severity:"error",category:t.startsWith("PATH_")?"path":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"twoPlanePopUp",id:n}},...s.map(r=>({kind:"parameter",path:r}))],entities:[{kind:"twoPlanePopUp",id:n}],suggestion:i}}function bc(t){const e=K_(t);if(e)return[e];if(t.nodes.length===0)return[Jt("ASSEMBLY_SCHEMA_INVALID","An assembly requires at least one pop-up node.","assembly",t.id)];const n=ml(t.nodes);if(n)return[Jt("ASSEMBLY_DUPLICATE_NODE_ID",`Pop-up node ID ${n} is not unique.`,"popUpNode",n)];const i=ml(t.sharedPortConstraints);if(i)return[Jt("ASSEMBLY_SHARED_CONSTRAINT_INVALID",`Shared-port constraint ID ${i} is not unique.`,"sharedPortConstraint",i)];for(const d of t.nodes)if(Sc(ua(d)).length>0)return[Jt("ASSEMBLY_SCHEMA_INVALID",`Node ${d.id} has invalid pop-up parameters.`,"popUpNode",d.id)];const s=new Map(t.nodes.map(d=>[d.id,d]));for(const d of t.nodes)if(d.attachment.kind==="generatedPair"&&!s.has(d.attachment.parentNodeId))return[Jt("ASSEMBLY_PARENT_MISSING",`Node ${d.id} references missing parent ${d.attachment.parentNodeId}.`,"popUpNode",d.id)];const r=Ru(t.nodes,s);if(r.cycleNodeId)return[Jt("ASSEMBLY_HIERARCHY_CYCLE","Pop-up attachment parents must form an acyclic hierarchy.","popUpNode",r.cycleNodeId)];const a=[...r.values.entries()].find(([,d])=>d>2);if(a)return[Jt("ASSEMBLY_DEPTH_UNSUPPORTED","The supported hierarchy is sheet to root to child.","popUpNode",a[0],"Attach this node directly to a root module or split the design.")];const o=Qe.absoluteAngle,c=t.nodes.find(d=>Math.abs(d.parameters.deployedAngle-t.sheet.deployedAngle)>o);if(c)return[Jt("ASSEMBLY_PARAMETER_MISMATCH","Every module must use the assembly sheet deployed angle.","popUpNode",c.id,`Use ${t.sheet.deployedAngle} radians.`)];const l=Cu(t,r.values),h=Z_(t,l,s);if(h)return[h];const u=J_(t.nodes);if(u)return[u];for(const d of t.sharedPortConstraints)if(d.firstNodeId===d.secondNodeId||!s.has(d.firstNodeId)||!s.has(d.secondNodeId)||!Xs(d.expectedTransform,Qe.relativeRank))return[Jt("ASSEMBLY_SHARED_CONSTRAINT_INVALID","A shared-port constraint requires two distinct existing nodes and a proper rigid transform.","sharedPortConstraint",d.id)];return[]}function Kr(t,e){const n=bc(t);if((!Number.isFinite(e)||e<t.sheet.deployedAngle-Qe.absoluteAngle||e>Math.PI+Qe.absoluteAngle)&&n.push(Jt("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","Assembly angle lies outside the synchronized path domain.","assembly",t.id)),n.length>0)return{ok:!1,diagnostics:n};const i=new Map(t.nodes.map(c=>[c.id,c])),s=Ru(t.nodes,i),r=Cu(t,s.values),a=new Map,o=yc(t.sheet,e);for(const c of r){const l=ua(c.node),h=da(l,e);if(!h.ok)return{ok:!1,diagnostics:h.diagnostics};const u=c.node.attachment,d=u.kind==="sheet"?o:a.get(u.parentNodeId).outputPort,f=Tu(h.state,d,u.xOffset),p=gc(h.state.frames.parentFloor,f.frames.parentFloor),_=u.kind==="generatedPair"?u.parentNodeId:void 0,m={nodeId:c.node.id,..._===void 0?{}:{parentNodeId:_},depth:c.depth,globalWidthInterval:c.globalWidthInterval,localToWorld:p,worldState:{...f,id:`${c.node.id}:angle:${e}`},outputPort:Au(l,f,c.node.id)};a.set(c.node.id,m)}return{ok:!0,state:{id:`${t.id}:angle:${e}`,definitionId:t.id,parentAngle:e,nodes:r.map(c=>a.get(c.node.id))}}}function ua(t){return{id:t.id,...t.parameters}}function K_(t){const e=t.sheet;if(typeof t.id!="string"||t.id.length===0||typeof e.id!="string"||e.id.length===0||![e.width,e.wallExtent,e.floorExtent].every(n=>Number.isFinite(n)&&n>0)||!Number.isFinite(e.deployedAngle)||e.deployedAngle<=0||e.deployedAngle>=Math.PI)return Jt("ASSEMBLY_SCHEMA_INVALID","Assembly and sheet IDs must be nonempty; sheet dimensions and deployed angle must be finite and admissible.","assembly",t.id)}function ml(t){const e=new Set;for(const n of t){if(e.has(n.id))return n.id;e.add(n.id)}}function Ru(t,e){const n=new Map,i=new Set;let s;const r=a=>{const o=n.get(a.id);if(o!==void 0)return o;if(i.has(a.id))return s=a.id,Number.POSITIVE_INFINITY;i.add(a.id);const c=a.attachment.kind==="sheet"?1:1+r(e.get(a.attachment.parentNodeId));return i.delete(a.id),n.set(a.id,c),c};for(const a of t){if(s)break;r(a)}return{values:n,...s===void 0?{}:{cycleNodeId:s}}}function Cu(t,e){const n=new Map,i=[...t.nodes].sort((s,r)=>e.get(s.id)-e.get(r.id)||s.id.localeCompare(r.id));for(const s of i){const r=e.get(s.id),a=s.attachment,o=a.kind==="sheet"?a.xOffset:n.get(a.parentNodeId).globalWidthInterval[0]+a.xOffset;n.set(s.id,{node:s,depth:r,globalWidthInterval:[o,o+s.parameters.width]})}return i.map(s=>n.get(s.id))}function Z_(t,e,n){const i=Qe.absoluteLength;for(const s of e){const r=s.node,a=r.attachment,o=a.xOffset,c=a.kind==="sheet"?t.sheet.width:n.get(a.parentNodeId).parameters.width,l=a.kind==="sheet"?t.sheet.wallExtent:n.get(a.parentNodeId).parameters.depth,h=a.kind==="sheet"?t.sheet.floorExtent:n.get(a.parentNodeId).parameters.height;if(!Number.isFinite(o)||o<-i||o+r.parameters.width>c+i||r.parameters.height>l+i||r.parameters.depth>h+i)return Jt("ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS",`Node ${r.id} does not fit its host width or plane extents.`,"outOfBoundsRegion",bu(r.id),`Fit width within ${c}, wall height within ${l}, and floor depth within ${h}.`)}}function J_(t){const e=new Map;for(const i of t){const s=i.attachment.kind==="sheet"?"sheet":`node:${i.attachment.parentNodeId}`,r=e.get(s)??[];r.push(i),e.set(s,r)}const n=Qe.absoluteLength;for(const i of e.values()){const s=[...i].sort((r,a)=>r.attachment.xOffset-a.attachment.xOffset||r.id.localeCompare(a.id));for(let r=1;r<s.length;r+=1){const a=s[r-1],o=s[r];if(o.attachment.xOffset<a.attachment.xOffset+a.parameters.width-n)return Jt("ASSEMBLY_ATTACHMENT_OVERLAP",`Sibling strips ${a.id} and ${o.id} overlap.`,"overlapRegion",Eu(a.id,o.id),"Move or resize sibling strips so their open width intervals are disjoint.")}}}function Jt(t,e,n,i,s){return{severity:"error",category:t==="ASSEMBLY_DEPTH_UNSUPPORTED"?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}],...s===void 0?{}:{suggestion:s}}}function Pu(t){const e=bc(t);if(e.length>0)return{ok:!1,diagnostics:e};const n=Kr(t,Math.PI);if(!n.ok)return n;const i=gl([0,t.sheet.width,...n.state.nodes.flatMap(E=>[...E.globalWidthInterval])]),s=j_(n.state.nodes),r=gl([-t.sheet.wallExtent,0,t.sheet.floorExtent,...s.flatMap(E=>[E.yMinimum,E.yMaximum])]),a=[];for(let E=0;E<r.length-1;E+=1)for(let y=0;y<i.length-1;y+=1){const T=(i[y]+i[y+1])/2,M=(r[E]+r[E+1])/2,b=Q_(t,s,T,M),P=`face:${y}:${E}:${b.id}`;a.push({xIndex:y,yIndex:E,faceId:P,owner:b,halfEdgeIds:[`halfEdge:${y}:${E}:bottom`,`halfEdge:${y}:${E}:right`,`halfEdge:${y}:${E}:top`,`halfEdge:${y}:${E}:left`]})}const o=e0(i,r),c=[],l=[],h=new Map,u=new Map(a.map(E=>[E.faceId,E.owner]));for(const E of a){const[y,T,M,b]=E.halfEdgeIds;c.push({id:E.faceId,boundary:y,holes:[]});const P=[[{id:y,origin:Cs(E.xIndex,E.yIndex),next:T,edge:"",face:E.faceId},_l(E.xIndex,E.yIndex)],[{id:T,origin:Cs(E.xIndex+1,E.yIndex),next:M,edge:"",face:E.faceId},xl(E.xIndex+1,E.yIndex)],[{id:M,origin:Cs(E.xIndex+1,E.yIndex+1),next:b,edge:"",face:E.faceId},_l(E.xIndex,E.yIndex+1)],[{id:b,origin:Cs(E.xIndex,E.yIndex+1),next:y,edge:"",face:E.faceId},xl(E.xIndex,E.yIndex)]];for(const[C,I]of P){l.push(C);const X=h.get(I)??[];X.push({halfEdge:C,faceId:E.faceId,owner:E.owner}),h.set(I,X)}}const d=[],f=[],p=[],_=[],m=[...h.entries()].sort(([E],[y])=>E.localeCompare(y));for(const[E,y]of m){if(y.length===1){const C=`edge:boundary:${E}`;y[0].halfEdge.edge=C,d.push({id:C,halfEdges:[y[0].halfEdge.id],kind:"boundary"}),p.push(ya(C,"boundary",y));continue}if(y.length!==2)return vl(t.id,`Grid segment ${E} has ${y.length} incident cells.`);const T=y[0].owner.id===y[1].owner.id;if(E.startsWith("v:")&&!T){const C=[...y].sort((H,D)=>H.faceId.localeCompare(D.faceId)),I=`cutPair:${E}`,X=[`edge:cut:${E}:a`,`edge:cut:${E}:b`];C.forEach((H,D)=>{const $=D===0?"a":"b",B=X[D];H.halfEdge.edge=B,d.push({id:B,halfEdges:[H.halfEdge.id],kind:"cutBank",cutBank:{pair:I,bank:$}}),p.push(ya(B,"cutBank",[H]))}),f.push({id:I,banks:X}),_.push({cutPairId:I,nodeIds:Iu(y)});continue}const M=T?"flatSeam":"hinge",b=T?"flatSeam":t0(E,r)===0?"centerHinge":"anchorHinge",P=`edge:${M}:${E}`;y[0].halfEdge.edge=P,y[1].halfEdge.edge=P,y[0].halfEdge.twin=y[1].halfEdge.id,y[1].halfEdge.twin=y[0].halfEdge.id,d.push({id:P,halfEdges:[y[0].halfEdge.id,y[1].halfEdge.id],kind:M,...M==="hinge"?{hinge:b==="centerHinge"?{assignment:"valley",restAngle:0,angleRange:[0,Math.PI]}:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}:{}}),p.push(ya(P,b,y))}const g={schemaVersion:1,vertices:o,halfEdges:l,edges:d,faces:c,cutPairs:f,materialComponents:[{id:`materialComponent:${t.sheet.id}`,faces:c.map(E=>E.id)}]},A=Ci(g);if(A.length>0)return vl(t.id,A.map(E=>E.code).join(", "));const w=a.map(E=>({faceId:E.faceId,owner:u.get(E.faceId)})),v=n0(t,w,p,_);return{ok:!0,assembly:{definition:t,complex:g,sourceMap:v,attachmentEdges:i0(t),cycles:s0(t)}}}function j_(t){return t.flatMap(e=>{const n=Fs(e.worldState.points.origin[1]),i=Fs(e.worldState.points.floorAnchor[1]),s=Fs(e.worldState.points.wallAnchor[1]),[r,a]=e.globalWidthInterval;return[{owner:{id:`module:${e.nodeId}:childWall`,kind:"module",role:"childWall",nodeId:e.nodeId},depth:e.depth,xMinimum:r,xMaximum:a,yMinimum:Math.min(n,i),yMaximum:Math.max(n,i)},{owner:{id:`module:${e.nodeId}:childFloor`,kind:"module",role:"childFloor",nodeId:e.nodeId},depth:e.depth,xMinimum:r,xMaximum:a,yMinimum:Math.min(n,s),yMaximum:Math.max(n,s)}]})}function Q_(t,e,n,i){let s=i<0?{id:`sheet:${t.sheet.id}:wall`,kind:"sheet",role:"wall",sheetId:t.sheet.id}:{id:`sheet:${t.sheet.id}:floor`,kind:"sheet",role:"floor",sheetId:t.sheet.id};const r=[...e].sort((a,o)=>a.depth-o.depth||a.owner.id.localeCompare(o.owner.id));for(const a of r)n>a.xMinimum&&n<a.xMaximum&&i>a.yMinimum&&i<a.yMaximum&&(s=a.owner);return s}function gl(t){const e=Qe.absoluteLength,n=t.map(Fs).sort((s,r)=>s-r),i=[];for(const s of n)(i.length===0||Math.abs(s-i[i.length-1])>e)&&i.push(s);return i}function Fs(t){return Math.abs(t)<=Qe.absoluteLength?0:t}function e0(t,e){const n=[];for(let i=0;i<e.length;i+=1)for(let s=0;s<t.length;s+=1)n.push({id:Cs(s,i),position:[t[s],e[i]]});return n}function Cs(t,e){return`vertex:${t}:${e}`}function _l(t,e){return`h:${t}:${e}`}function xl(t,e){return`v:${t}:${e}`}function t0(t,e){const n=t.split(":");return Fs(e[Number(n[2])])}function ya(t,e,n){return{edgeId:t,role:e,ownerIds:[...new Set(n.map(i=>i.owner.id))].sort(),nodeIds:Iu(n)}}function Iu(t){return[...new Set(t.flatMap(e=>e.owner.kind==="module"?[e.owner.nodeId]:[]))].sort()}function n0(t,e,n,i){const s=new Set([`sheet:${t.sheet.id}:wall`,`sheet:${t.sheet.id}:floor`]);return{sheet:{sheetId:t.sheet.id,faceIds:e.filter(r=>s.has(r.owner.id)).map(r=>r.faceId),edgeIds:n.filter(r=>r.ownerIds.some(a=>s.has(a))).map(r=>r.edgeId)},nodes:[...t.nodes].sort((r,a)=>r.id.localeCompare(a.id)).map(r=>({nodeId:r.id,faceIds:e.filter(a=>a.owner.kind==="module"&&a.owner.nodeId===r.id).map(a=>a.faceId),edgeIds:n.filter(a=>a.nodeIds.includes(r.id)).map(a=>a.edgeId)})),faces:e,edges:n,cutPairs:i}}function i0(t){return[...t.nodes].sort((e,n)=>e.id.localeCompare(n.id)).map(e=>({id:`attachment:${e.id}`,parentId:e.attachment.kind==="sheet"?t.sheet.id:e.attachment.parentNodeId,childId:e.id}))}function s0(t){const e=new Map(t.nodes.map(n=>[n.id,n.attachment.kind==="sheet"?t.sheet.id:n.attachment.parentNodeId]));return[...t.sharedPortConstraints].sort((n,i)=>n.id.localeCompare(i.id)).map(n=>({constraintId:n.id,nodePath:r0(n.firstNodeId,n.secondNodeId,t.sheet.id,e)}))}function r0(t,e,n,i){const s=u=>{const d=[u];for(;d[d.length-1]!==n;)d.push(i.get(d[d.length-1]));return d},r=s(t),a=s(e),o=new Set(a),c=r.find(u=>o.has(u)),l=r.slice(0,r.indexOf(c)+1),h=a.slice(0,a.indexOf(c)).reverse();return[...l,...h,t]}function vl(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"ASSEMBLY_COMPILED_TOPOLOGY_INVALID",message:`Compiled pop-up topology is invalid: ${e}`,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function a0(t,e,n=Qe){const i=f0(e).every(Number.isFinite),s=Math.max(t.width,t.height,t.depth),r=du(s,n),a=[i?nr("finite-state",0,0):ms("finite-state","State coordinates and frames must be finite.")];i?a.push(nr("rigid-link-isometry",c0(t,e),r),nr("parent-child-angle",l0(e),n.absoluteAngle),nr("frame-orthonormality",d0(e),n.relativeRank),h0(e)):a.push(ms("rigid-link-isometry","Linkage residual is undefined for a non-finite state."),ms("parent-child-angle","Angle residual is undefined for a non-finite state."),ms("frame-orthonormality","Frame residual is undefined for a non-finite state."),ms("collision-and-contact","Contact classification is undefined for a non-finite state."));const o=a.some(c=>c.status==="failed")?"invalid":"endpointIsometric";return{id:`two-plane-popup-analysis:${e.id}`,subjectId:e.id,classification:o,assumptions:[{id:"ideal-zero-thickness",statement:"Panels are perfectly rigid and have zero thickness."},{id:"constant-width-extrusion",statement:"The checked cross-section is extruded at constant width."}],constraints:a,unsupportedConditions:[],provenance:[{source:"docs/superpowers/specs/2026-07-29-two-plane-pop-up-design.md",locator:"Components",claimId:"two-plane-popup-independent-state-analysis"}]}}function o0(t,e=Qe.absoluteLength){if(Math.abs(t.parentAngle-Math.PI)<=Qe.absoluteAngle)return"intentionalFlatCoincidence";const{origin:n,floorAnchor:i,wallAnchor:s,junction:r}=t.points;return yl(n,i,r,s,e)||yl(i,r,s,n,e)?"unintendedIntersection":"clear"}function c0(t,e){const{origin:n,floorAnchor:i,wallAnchor:s,junction:r}=e.points,a=t.linkage==="parallelogram"?t.height:t.depth,o=t.linkage==="parallelogram"?t.depth:t.height;return Math.max(Math.abs(ct(Ke(i,n))-t.depth),Math.abs(ct(Ke(r,i))-a),Math.abs(ct(Ke(s,n))-t.height),Math.abs(ct(Ke(r,s))-o))}function l0(t){const{origin:e,floorAnchor:n,wallAnchor:i,junction:s}=t.points,r=Ml(Ke(n,e),Ke(i,e)),a=Ml(Ke(n,s),Ke(i,s));return Math.abs(r-a)}function Ml(t,e){const n=si(t),i=si(e);return Math.atan2(ct(ds(n,i)),ot(n,i))}function d0(t){return Math.max(...Object.values(t.frames).map(u0))}function u0(t){const e=ds(t.widthAxis,t.inPlaneAxis);return Math.max(Math.abs(ct(t.widthAxis)-1),Math.abs(ct(t.inPlaneAxis)-1),Math.abs(ct(t.normal)-1),Math.abs(ot(t.widthAxis,t.inPlaneAxis)),Math.abs(ot(t.widthAxis,t.normal)),Math.abs(ot(t.inPlaneAxis,t.normal)),ct(Ke(e,t.normal)))}function h0(t){const e=o0(t);return{id:"collision-and-contact",status:e!=="unintendedIntersection"&&e===t.contact?"satisfied":"failed",method:"exact",details:e==="intentionalFlatCoincidence"?"Coincidence is intentional flat contact at the path endpoint.":e==="clear"?"Nonadjacent cross-section links do not intersect.":"Nonadjacent cross-section links intersect."}}function yl(t,e,n,i,s){const r=Math.max(ct(Ke(e,t)),ct(Ke(n,t)),ct(Ke(i,t)),ct(Ke(n,e)),ct(Ke(i,e)),ct(Ke(i,n)),s),a=s*r,o=er(t,e,n),c=er(t,e,i),l=er(n,i,t),h=er(n,i,e);return(o>a&&c<-a||o<-a&&c>a)&&(l>a&&h<-a||l<-a&&h>a)?!0:Math.abs(o)<=a&&tr(t,e,n,s)||Math.abs(c)<=a&&tr(t,e,i,s)||Math.abs(l)<=a&&tr(n,i,t,s)||Math.abs(h)<=a&&tr(n,i,e,s)}function er(t,e,n){const i=e[1]-t[1],s=e[2]-t[2],r=n[1]-t[1],a=n[2]-t[2];return i*a-s*r}function tr(t,e,n,i){return n[1]>=Math.min(t[1],e[1])-i&&n[1]<=Math.max(t[1],e[1])+i&&n[2]>=Math.min(t[2],e[2])-i&&n[2]<=Math.max(t[2],e[2])+i}function f0(t){return[t.parentAngle,...Object.values(t.points).flatMap(e=>[...e]),...Object.values(t.frames).flatMap(e=>[...e.origin,...e.widthAxis,...e.inPlaneAxis,...e.normal]),t.alignmentResidual]}function nr(t,e,n){return{id:t,status:e<=n?"satisfied":"failed",method:"boundedNumerical",residual:e,tolerance:n}}function ms(t,e){return{id:t,status:"failed",method:"exact",details:e}}function ho(t,e,n=Math.max(Qe.absoluteLength,Qe.absoluteAngle)){const i=t.nodes.find(h=>h.nodeId===e.firstNodeId),s=t.nodes.find(h=>h.nodeId===e.secondNodeId);if(!i||!s)throw new RangeError("Shared-port constraint references a missing node.");const r=Xr(i.outputPort.floor.frame),a=Xr(s.outputPort.floor.frame),o=Xt(Ei(r),a),c=Xt(Ei(e.expectedTransform),o),l=$_([c],n);return{constraintId:e.id,errorTransform:c,residualVector:y0(c),rotationResidual:l.rotationResidual,translationResidual:l.translationResidual,residual:l.residual,tolerance:l.tolerance,closed:l.closed}}function p0(t,e){if(!Number.isFinite(e)||!Number.isInteger(e)||e<2)return{ok:!1,diagnostics:[{severity:"error",category:"path",code:"PATH_POPUP_SAMPLE_COUNT_INVALID",message:"An assembly path requires an integer sample count of at least two.",locations:[{kind:"parameter",path:["sampleCount"]}],entities:[{kind:"assembly",id:t.id}],suggestion:"Use an integer sample count greater than or equal to two."}]};const n=Pu(t);if(!n.ok)return n;const i=[],s=[];let r=!1;for(let f=0;f<e;f+=1){const p=f/(e-1),_=Math.PI+p*(t.sheet.deployedAngle-Math.PI),m=Kr(t,_);if(!m.ok)return m;i.push(m.state),m0(t,m.state).some(A=>A.status==="failed")&&(r=!0),s.push(t.sharedPortConstraints.map(A=>ho(m.state,A)))}const a=g0(t,s,r),c=t.sharedPortConstraints.filter((f,p)=>s.some(_=>!_[p].closed)).map(S0),h=a.some(f=>f.status==="failed")?"invalid":t.sharedPortConstraints.length===0?"certifiedRigidPath":"numericallyVerifiedRigidPath",u=_0(t,h,a),d=(t.sheet.deployedAngle+Math.PI)/2;return{ok:!0,path:{id:`pop-up-assembly-path:${t.id}`,compiledAssembly:n.assembly,samples:i,evidence:u,mobility:M0(t,d),diagnostics:c}}}function m0(t,e){const n=new Map(t.nodes.map(i=>[i.id,i]));return e.nodes.flatMap(i=>{const s=n.get(i.nodeId);return a0(ua(s),i.worldState).constraints.map(a=>({...a,id:`module:${s.id}:${a.id}`}))})}function g0(t,e,n){const i=[{id:"compiled-topology",status:"satisfied",method:"exact"},{id:"synchronized-local-rigid-paths",status:n?"failed":"satisfied",method:"exact"},{id:"rigid-port-attachment",status:"satisfied",method:"exact"},{id:"host-domain-admissibility",status:"satisfied",method:"exact"},{id:"nested-strip-collision-freedom",status:"satisfied",method:"exact"}];return t.sharedPortConstraints.forEach((s,r)=>{const a=Math.max(...e.map(c=>c[r].residual)),o=e[0][r].tolerance;i.push({id:`shared-cycle:${s.id}`,status:a<=o?"satisfied":"failed",method:"sampledNumerical",residual:a,tolerance:o,details:`${e.length} synchronized path samples.`})}),i}function _0(t,e,n){const i={id:`pop-up-assembly-path-evidence:${t.id}`,subjectId:t.id,assumptions:x0(t),constraints:n,unsupportedConditions:[],provenance:v0()};return e==="certifiedRigidPath"?{...i,classification:e,theoremIds:["two-plane-popup-reflection-path","nested-parallel-strip-composition"]}:{...i,classification:e}}function x0(t){const e=[];for(const n of[...t.nodes].sort((i,s)=>i.id.localeCompare(s.id))){const i=Ec(ua(n),2);i.ok&&e.push(...i.path.certificate.assumptions.map(s=>({id:`inherited:${n.id}:${s.id}`,statement:`Node ${n.id}: ${s.statement}`})))}return[...e,{id:"assembly:synchronized-angle",statement:"Every module is driven by one common parent angle."},{id:"assembly:nested-strip-replacement",statement:"A child replaces material inside its declared host strip."},{id:"assembly:disjoint-sibling-interiors",statement:"Sibling strip intervals have disjoint interiors."}]}function v0(){return[{source:"docs/superpowers/specs/2026-07-29-recursive-pop-up-composition-design.md",locator:"Global Path And Collision",claimId:"nested-parallel-strip-composition"},{source:"docs/mathematical-contract.md",locator:"5. Composition Contract"}]}function M0(t,e){const n=Math.sqrt(Number.EPSILON);if(t.sharedPortConstraints.length===0)return{...Or([],1),finiteDifferenceStep:0,derivativeZeroTolerance:n};const i=Math.PI-t.sheet.deployedAngle,s=Math.min(1e-6,i/8),r=Math.min(Math.PI-s,Math.max(t.sheet.deployedAngle+s,e)),a=Kr(t,r+s),o=Kr(t,r-s);if(!a.ok||!o.ok)return{...Or([],1),finiteDifferenceStep:s,derivativeZeroTolerance:n};const c=t.sharedPortConstraints.flatMap(u=>ho(a.state,u).residualVector),l=t.sharedPortConstraints.flatMap(u=>ho(o.state,u).residualVector),h=c.map((u,d)=>{const f=(u-l[d])/(2*s);return[Math.abs(f)<=n?0:f]});return{...Or(h,1),finiteDifferenceStep:s,derivativeZeroTolerance:n}}function y0(t){return[t.rotation[0][0]-1,t.rotation[0][1],t.rotation[0][2],t.translation[0],t.rotation[1][0],t.rotation[1][1]-1,t.rotation[1][2],t.translation[1],t.rotation[2][0],t.rotation[2][1],t.rotation[2][2]-1,t.translation[2]]}function S0(t){return{severity:"error",category:"kinematics",code:"ASSEMBLY_GLOBAL_CLOSURE_FAILED",message:`Shared-port cycle ${t.id} does not close.`,locations:[{kind:"entity",entity:{kind:"sharedPortConstraint",id:t.id}}],entities:[{kind:"sharedPortConstraint",id:t.id}],suggestion:"Correct or remove the conflicting shared-port transform."}}const Lu=1,Du=["opening","planePair","platform","shelf","stair","wall"],Zr=Object.freeze({schemaVersion:Lu,supportedOperations:Object.freeze(["planePair","platform","shelf","stair","wall"]),unsupportedOperations:Object.freeze(["opening"]),unsupportedConstructionFamilies:Object.freeze(["multifold","curvedCrease"]),alignments:Object.freeze(["allowRotated","axisAligned"]),mismatchPolicies:Object.freeze(["preserveDepth","preserveHeight","reject"]),targets:Object.freeze(["generatedPair","sheet"]),maximumModuleDepth:2,maximumOperations:64,maximumPathSampleCount:1001,emitsPartialGeometryOnFailure:!1});function E0(t){if(!b0(t))return[on("SPATIAL_PROGRAM_INVALID","Spatial program, sheet, and path-sampling fields must be finite and admissible.","spatialProgram",typeof t?.id=="string"?t.id:"unknown")];const e=w0(t.operations);if(e)return[on("SPATIAL_DUPLICATE_OPERATION_ID",`Spatial operation ID ${e} is not unique.`,"spatialOperation",e)];const n=new Map(t.operations.map(a=>[a.id,a])),i=[];for(const a of[...t.operations].sort(Uu)){if(!T0(a)){i.push(on("SPATIAL_DIMENSION_INVALID","Spatial dimensions must be finite and positive, and xOffset must be finite.","spatialOperation",a.id));continue}a.kind==="stair"&&(Number.isInteger(a.stepCount)&&a.stepCount>0&&Number.isFinite(a.stepRun)&&a.stepRun>0&&Number.isFinite(a.stepRise)&&a.stepRise>0?a.stepRun!==a.stepRise&&i.push(on("SPATIAL_DIMENSION_CONFLICT","The certified stair mechanism requires equal step run and rise.","spatialOperation",a.id,"Set stepRun equal to stepRise for the first certified stair mechanism.")):i.push(on("SPATIAL_DIMENSION_INVALID","Stair stepCount must be a positive integer and stepRun/stepRise must be finite and positive.","spatialOperation",a.id)),a.alignment!=="axisAligned"&&i.push(on("SPATIAL_ALIGNMENT_UNSUPPORTED","The certified stair mechanism currently supports only axisAligned placement.","spatialOperation",a.id))),a.kind==="opening"&&i.push(on("SPATIAL_OPERATION_UNSUPPORTED","Opening requires subtractive topology and has no certified mechanism family.","spatialOperation",a.id,"Use a supported paired operation or wait for a subtractive mechanism contract.")),a.target.kind==="generatedPair"&&(!a.target.operationId||!n.has(a.target.operationId))&&i.push(on("SPATIAL_TARGET_INVALID",`Operation ${a.id} references a missing generated pair.`,"spatialOperation",a.id)),a.kind==="shelf"&&a.target.kind!=="generatedPair"&&i.push(on("SPATIAL_TARGET_INVALID","A shelf must target an existing generated plane pair.","spatialOperation",a.id))}if(i.length>0)return R0(i);const s=Fu(t.operations,n);if(s.cycleId)return[on("SPATIAL_TARGET_CYCLE","Generated-pair targets must form an acyclic hierarchy.","spatialOperation",s.cycleId)];const r=[...s.depths.entries()].filter(([,a])=>a>Zr.maximumModuleDepth).sort(([a],[o])=>a.localeCompare(o))[0];return r?[on("SPATIAL_TARGET_DEPTH_UNSUPPORTED","The spatial compiler supports only sheet to root to child.","spatialOperation",r[0],"Attach this operation to the sheet or a root operation.")]:[]}function Nu(t){const e=new Map(t.map(n=>[n.id,n]));return Fu(t,e).depths}function b0(t){const e=t?.sheet;return t?.schemaVersion===Lu&&typeof t.id=="string"&&t.id.length>0&&Array.isArray(t.operations)&&t.operations.length>0&&t.operations.length<=Zr.maximumOperations&&t.operations.every(A0)&&Number.isInteger(t.pathSampleCount)&&t.pathSampleCount>=2&&t.pathSampleCount<=Zr.maximumPathSampleCount&&typeof e?.id=="string"&&e.id.length>0&&[e.width,e.wallExtent,e.floorExtent].every(n=>Number.isFinite(n)&&n>0)&&Number.isFinite(e.deployedAngle)&&e.deployedAngle>0&&e.deployedAngle<Math.PI}function A0(t){return t!==null&&typeof t=="object"&&typeof t.id=="string"&&t.id.length>0&&Du.includes(t.kind)&&(t.target?.kind==="sheet"||t.target?.kind==="generatedPair"&&typeof t.target.operationId=="string")&&(t.alignment==="axisAligned"||t.alignment==="allowRotated")&&Zr.mismatchPolicies.includes(t.mismatchPolicy)&&(t.kind!=="stair"||Number.isInteger(t.stepCount)&&typeof t.stepRun=="number"&&typeof t.stepRise=="number")}function T0(t){return Number.isFinite(t.xOffset)&&[t.width,t.height,t.depth].every(e=>Number.isFinite(e)&&e>0)}function w0(t){const e=new Set;for(const n of t){if(e.has(n.id))return n.id;e.add(n.id)}}function Fu(t,e){const n=new Map,i=new Set;let s;const r=a=>{const o=n.get(a.id);if(o!==void 0)return o;if(i.has(a.id))return s=a.id,Number.POSITIVE_INFINITY;i.add(a.id);const c=a.target.kind==="sheet"?1:1+r(e.get(a.target.operationId));return i.delete(a.id),n.set(a.id,c),c};for(const a of[...t].sort(Uu)){if(s)break;r(a)}return{depths:n,...s===void 0?{}:{cycleId:s}}}function Uu(t,e){return t.id.localeCompare(e.id)}function R0(t){return[...t].sort((e,n)=>(e.entities[0]?.id??"").localeCompare(n.entities[0]?.id??"")||e.code.localeCompare(n.code))}function on(t,e,n,i,s){return{severity:"error",category:new Set(["SPATIAL_OPERATION_UNSUPPORTED","SPATIAL_TARGET_DEPTH_UNSUPPORTED","SPATIAL_ALIGNMENT_UNSUPPORTED"]).has(t)?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}],...s===void 0?{}:{suggestion:s}}}function Ou(t){const e=E0(t);if(e.length>0)return Xn(C0(t),e);const n=[],i=[];for(const u of t.operations){const d=P0(u,t.sheet.deployedAngle);d.ok?n.push(d.value):i.push(d.diagnostic)}if(i.length>0)return Xn(t.operations,gs(i));const s=Nu(t.operations);n.sort((u,d)=>s.get(u.operation.id)-s.get(d.operation.id)||u.operation.id.localeCompare(d.operation.id));const r={...t,operations:n.map(({operation:u,resolved:d})=>({...u,xOffset:d.xOffset,width:d.width,height:d.height,depth:d.depth}))},a=I0(r),o=bc(a);if(o.length>0)return Xn(t.operations,gs(o));const c=Pu(a);if(!c.ok)return Xn(t.operations,gs(c.diagnostics));const l=p0(a,r.pathSampleCount);if(!l.ok)return Xn(t.operations,gs(l.diagnostics));if(l.path.evidence.classification==="invalid")return Xn(t.operations,gs(l.path.diagnostics));const h=n.find(({operation:u})=>u.kind==="stair");if(h){const u=h.operation,d=mc({operationId:u.id,width:u.width,stepCount:u.stepCount,stepRun:u.stepRun,stepRise:u.stepRise,hostWidth:t.sheet.width,hostFloorExtent:t.sheet.floorExtent,hostWallExtent:t.sheet.wallExtent});if(!d.ok)return Xn(t.operations,d.diagnostics);const f=_c({input:{operationId:u.id,width:u.width,stepCount:u.stepCount,stepRun:u.stepRun,stepRise:u.stepRise,hostWidth:t.sheet.width,hostFloorExtent:t.sheet.floorExtent,hostWallExtent:t.sheet.wallExtent},complex:d.complex,sourceMap:d.sourceMap,sampleCount:r.pathSampleCount});return f.ok?{ok:!0,mechanism:"stair",normalizedProgram:r,assembly:a,compiledAssembly:c.assembly,path:l.path,decisions:n.map(Sl).sort(bl),traces:El(n,c.assembly),stair:{complex:d.complex,sourceMap:d.sourceMap,path:f}}:Xn(t.operations,f.diagnostics)}return{ok:!0,mechanism:"paired",normalizedProgram:r,assembly:a,compiledAssembly:c.assembly,path:l.path,decisions:n.map(Sl).sort(bl),traces:El(n,c.assembly)}}function C0(t){return Array.isArray(t?.operations)?t.operations.filter(e=>e!==null&&typeof e=="object"&&typeof e.id=="string"&&e.id.length>0&&Du.includes(e.kind)):[]}function P0(t,e){if(t.alignment==="axisAligned"&&Math.abs(e-Math.PI/2)>Qe.absoluteAngle)return{ok:!1,diagnostic:D0("SPATIAL_ALIGNMENT_UNSUPPORTED","Axis-aligned spatial compilation is bounded to the orthogonal deployed base case.",t.id,"Use a pi/2 deployed angle or request allowRotated.")};let n=t.height,i=t.depth,s=!1;return t.alignment==="axisAligned"&&n!==i&&t.mismatchPolicy!=="reject"&&(s=!0,t.mismatchPolicy==="preserveHeight"?i=n:n=i),{ok:!0,value:{operation:t,resolved:{xOffset:t.xOffset,width:t.width,height:n,depth:i,alignment:t.alignment},constrained:s}}}function I0(t){return{id:`spatial-assembly:${t.id}`,sheet:{...t.sheet},nodes:t.operations.map(e=>({id:Jr(e.id),parameters:{width:e.width,height:e.height,depth:e.depth,deployedAngle:t.sheet.deployedAngle,linkage:e.alignment==="axisAligned"?"parallelogram":"reflected"},attachment:e.target.kind==="sheet"?{kind:"sheet",xOffset:e.xOffset}:{kind:"generatedPair",parentNodeId:Jr(e.target.operationId),xOffset:e.xOffset}})),sharedPortConstraints:[]}}function Sl(t){const{operation:e,resolved:n,constrained:i}=t;return{operationId:e.id,operationKind:e.kind,status:i?"constrained":"accepted",message:i?"Dimensions were projected under the declared mismatch policy.":`${e.kind} compiled as a paired two-plane mechanism.`,requested:ku(e),resolved:n,constraintIds:i?["axis-aligned-equal-links",`policy:${e.mismatchPolicy}`]:[e.alignment==="axisAligned"?"axis-aligned-parallelogram":"general-two-plane-linkage"]}}function Xn(t,e){return{ok:!1,diagnostics:e,decisions:[...t].sort((n,i)=>n.id.localeCompare(i.id)).map(n=>{const i=e.filter(r=>L0(r,n.id)),s=i.map(r=>r.code);return{operationId:n.id,operationKind:n.kind,status:"rejected",message:i[0]?.message??"The atomic spatial program was rejected because another operation failed.",requested:ku(n),constraintIds:s.length>0?s:["atomic-program-admissibility"]}})}}function L0(t,e){return t.entities.some(n=>n.id===e||n.id===Jr(e))}function ku(t){return{target:t.target,xOffset:t.xOffset,width:t.width,height:t.height,depth:t.depth,alignment:t.alignment,mismatchPolicy:t.mismatchPolicy}}function El(t,e){const n=new Map(e.sourceMap.nodes.map(i=>[i.nodeId,i]));return t.map(({operation:i})=>{const s=Jr(i.id),r=n.get(s);return{operationId:i.id,operationKind:i.kind,nodeId:s,faceIds:r.faceIds,edgeIds:r.edgeIds}}).sort((i,s)=>i.operationId.localeCompare(s.operationId))}function Jr(t){return`spatial-node:${t}`}function bl(t,e){return t.operationId.localeCompare(e.operationId)}function gs(t){return[...t].sort((e,n)=>(e.entities[0]?.id??"").localeCompare(n.entities[0]?.id??"")||e.code.localeCompare(n.code))}function D0(t,e,n,i){return{severity:"error",category:t==="SPATIAL_ALIGNMENT_UNSUPPORTED"?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}],suggestion:i}}const N0=1;function Bu(t){return W0(t)?{ok:!0,example:t}:{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Validation examples require schema version 1, metadata, finite tolerance, typed input, and expected output.",locations:[{kind:"entity",entity:{kind:"validationExample",id:wl(t)}}],entities:[{kind:"validationExample",id:wl(t)}]}]}}function F0(t){switch(t.kind){case"singleHinge":return U0(t);case"singleVertex":return O0(t);case"twoPlanePopUp":return k0(t);case"spatialProgram":return B0(t)}}function U0(t){const e=xc(t.input.assignment),n=Su({complex:e,hingeEdgeId:"hinge",parentFaceId:"left",parentPose:tn(),angle:t.input.angle,stateId:`validation:${t.id}`}),i=[Rt("solution-status","kernelContract",t.expected.ok,n.ok)],s=n.ok?[]:[...n.diagnostics];if(!n.ok)return i.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],n.diagnostics.map(o=>o.code))),ii(t,i,s,{disposition:"rejected"});const r=n.state.facePoses.find(o=>o.faceId===n.childFaceId),a=gt(r.transform,[2,0,0]);return t.expected.childPoint&&(i.push(jr("canonical-child-trajectory","independentOracle",t.expected.childPoint,a,t.tolerance)),i.push(jr("closed-form-child-trajectory","independentOracle",[1+Math.cos(t.input.angle),0,-Math.sin(t.input.angle)],a,t.tolerance))),i.push(Rt("evidence-classification","kernelContract",t.expected.classification,n.certificate.classification)),ii(t,i,s,{disposition:"accepted",classification:n.certificate.classification})}function O0(t){const e=pc(t.input.sectorAngles,t.input.assignments,t.tolerance),n=G0(t.input.sectorAngles,t.input.assignments,t.tolerance),i=[Rt("oracle-kawasaki","independentOracle",t.expected.kawasaki,n.kawasaki),Rt("oracle-maekawa","independentOracle",t.expected.maekawa,n.maekawa),Rt("kernel-kawasaki","kernelContract",t.expected.kawasaki,e.kawasaki.status),Rt("kernel-maekawa","kernelContract",t.expected.maekawa,e.maekawa.status),Rt("local-flat-foldability","kernelContract",t.expected.locallyFlatFoldable,e.locallyFlatFoldable)],s=[],r=[{kind:"vertex",id:"vertex:center"},...t.input.sectorAngles.map((a,o)=>({kind:"sectorRay",id:`sectorRay:${o}`}))];return e.kawasaki.status!=="satisfied"&&s.push(fl({severity:"error",category:"kinematics",code:"KINEMATICS_KAWASAKI_FAILED",message:"The single vertex does not satisfy Kawasaki's alternating-sector condition.",locations:[...r.map(a=>({kind:"entity",entity:a})),{kind:"parameter",path:["input","sectorAngles"]}]})),e.maekawa.status!=="satisfied"&&s.push(fl({severity:"error",category:"kinematics",code:"KINEMATICS_MAEKAWA_FAILED",message:"The single vertex does not satisfy Maekawa's mountain-valley count.",locations:[...r.map(a=>({kind:"entity",entity:a})),{kind:"parameter",path:["input","assignments"]}]})),ii(t,i,s,{disposition:e.locallyFlatFoldable?"accepted":"rejected"})}function k0(t){const e=z0(t.input),n=da(e,e.deployedAngle),i=[Rt("solution-status","kernelContract",t.expected.ok,n.ok)],s=n.ok?[]:[...n.diagnostics];if(!n.ok)return i.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],n.diagnostics.map(o=>o.code))),ii(t,i,s,{disposition:"rejected"});const r=H0(e);i.push(jr("reflection-oracle","independentOracle",r,n.state.points.junction,t.tolerance)),t.expected.deployedJunction&&i.push(jr("expected-deployed-junction","independentOracle",t.expected.deployedJunction,n.state.points.junction,t.tolerance)),i.push(Al("floor-link-length","independentOracle",e.depth,ct(Ke(n.state.points.junction,n.state.points.floorAnchor)),t.tolerance),Al("wall-link-length","independentOracle",e.height,ct(Ke(n.state.points.junction,n.state.points.wallAnchor)),t.tolerance),Rt("axis-alignment","kernelContract",t.expected.axisAligned,n.state.axisAligned));const a=Ec(e,t.input.sampleCount);return i.push(Rt("path-classification","kernelContract",t.expected.classification,a.ok?a.path.certificate.classification:void 0)),a.ok?ii(t,i,s,{disposition:"accepted",classification:a.path.certificate.classification}):ii(t,i,a.diagnostics,{disposition:"rejected"})}function B0(t){const e=Ou(t.input),n=[Rt("compilation-status","kernelContract",t.expected.ok,e.ok)];if(!e.ok)return n.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],e.diagnostics.map(s=>s.code))),ii(t,n,[...e.diagnostics],{disposition:e.diagnostics.some(s=>s.category==="unsupported")?"unsupported":"rejected"});n.push(Rt("path-classification","kernelContract",t.expected.classification,e.path.evidence.classification),Rt("canonical-topology","artifactIntegrity",[],Ci(e.compiledAssembly.complex).map(s=>s.code)),Rt("complete-source-traces","artifactIntegrity",!0,e.traces.every(s=>s.faceIds.length>0&&s.edgeIds.length>0)));const i=V0(e);return n.push(Rt("simulator-job-readiness","artifactIntegrity",!0,i!==void 0)),ii(t,n,[],{disposition:"accepted",classification:e.path.evidence.classification},i)}function V0(t){const e=t.compiledAssembly,n=P_(e,{foldPercent:1,axialStiffness:20,faceStiffness:.2,creaseStiffness:.7,calculateFaceStrain:!0}),i=B_(e,Rl,q0),s=D_(e,Rl,{timestep:1/240,substeps:20,errorReductionParameter:.1,gravity:0,linearDamping:.05,angularDamping:.05,springStiffness:100,torqueStiffness:100,forceDamping:50,torqueDamping:2,filterConnectedCollisions:!0,maximumSteps:720});if(!(!n.ok||!i.ok||!s.ok))return{fold:yu(e.complex),svg:U_(e.complex),evidence:t.path.evidence,sourceTraces:t.traces,origamiSimulatorJob:n.job,swompsJob:i.job,pyKirigamiJob:s.job}}function z0(t){return{id:t.id,width:t.width,height:t.height,depth:t.depth,deployedAngle:t.deployedAngle}}function H0(t){const e=t.deployedAngle,n=[0,t.depth,0],i=[0,t.height*Math.cos(e),t.height*Math.sin(e)],s=t.depth**2+t.height**2-2*t.depth*t.height*Math.cos(e),r=t.depth*(t.depth-t.height*Math.cos(e))/s;return[0,2*(n[1]+r*(i[1]-n[1])),2*(n[2]+r*(i[2]-n[2]))]}function G0(t,e,n){const i=t.length%2===0,s=t.filter((u,d)=>d%2===0).reduce((u,d)=>u+d,0),r=t.filter((u,d)=>d%2===1).reduce((u,d)=>u+d,0),a=i&&Math.abs(s-Math.PI)<=n&&Math.abs(r-Math.PI)<=n?"satisfied":"failed",o=e.every(u=>u==="mountain"||u==="valley"),c=e.filter(u=>u==="mountain").length,l=e.filter(u=>u==="valley").length,h=o?Math.abs(c-l)===2?"satisfied":"failed":"notApplicable";return{kawasaki:a,maekawa:h}}function ii(t,e,n,i,s){return{exampleId:t.id,title:t.title,kind:t.kind,status:e.every(r=>r.passed)?"passed":"failed",observed:i,checks:e,diagnostics:n,...s===void 0?{}:{artifacts:s}}}function Rt(t,e,n,i){return{id:t,method:e,passed:JSON.stringify(n)===JSON.stringify(i),expected:n,actual:i}}function Al(t,e,n,i,s){const r=Math.abs(i-n);return{id:t,method:e,passed:r<=s,expected:n,actual:i,residual:r,tolerance:s}}function jr(t,e,n,i,s){const r=Math.max(...n.map((a,o)=>Math.abs(a-i[o])));return{id:t,method:e,passed:r<=s,expected:n,actual:i,residual:r,tolerance:s}}function W0(t){return Si(t)?t.schemaVersion===N0&&mi(t.id)&&mi(t.title)&&["valid","boundary","invalid","unsupported"].includes(String(t.fixtureClass))&&["singleHinge","singleVertex","twoPlanePopUp","spatialProgram"].includes(String(t.kind))&&mi(t.mechanismFamily)&&t.units==="meter-radian"&&Array.isArray(t.assumptions)&&t.assumptions.every(mi)&&mi(t.provenance)&&Number.isFinite(t.tolerance)&&Number(t.tolerance)>=0&&Si(t.input)&&Si(t.expected)&&$0(t):!1}function $0(t){const e=t.input,n=t.expected;return!Si(e)||!Si(n)||typeof n.ok=="string"?!1:t.kind==="singleHinge"?["mountain","valley"].includes(String(e.assignment))&&Number.isFinite(e.angle)&&typeof n.ok=="boolean"&&Tl(n.childPoint)&&Sa(n.diagnosticCodes):t.kind==="singleVertex"?X0(e.sectorAngles)&&Array.isArray(e.assignments)&&e.assignments.every(i=>["mountain","valley","unassigned"].includes(String(i)))&&e.sectorAngles.length===e.assignments.length&&Si(e.paper)&&Number.isFinite(e.paper.width)&&Number(e.paper.width)>0&&Number.isFinite(e.paper.height)&&Number(e.paper.height)>0&&Array.isArray(e.paper.center)&&e.paper.center.length===2&&e.paper.center.every(i=>Number.isFinite(i))&&["satisfied","failed"].includes(String(n.kawasaki))&&["satisfied","failed","notApplicable"].includes(String(n.maekawa))&&typeof n.locallyFlatFoldable=="boolean":t.kind==="twoPlanePopUp"?mi(e.id)&&[e.width,e.height,e.depth,e.deployedAngle].every(Number.isFinite)&&Number.isInteger(e.sampleCount)&&typeof n.ok=="boolean"&&Tl(n.deployedJunction)&&Sa(n.diagnosticCodes):t.kind==="spatialProgram"&&typeof n.ok=="boolean"&&Sa(n.diagnosticCodes)}function X0(t){return Array.isArray(t)&&t.every(Number.isFinite)}function Tl(t){return t===void 0||Array.isArray(t)&&t.length===3&&t.every(Number.isFinite)}function Sa(t){return t===void 0||Array.isArray(t)&&t.every(e=>typeof e=="string")}function Si(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)}function mi(t){return typeof t=="string"&&t.length>0}function wl(t){return Si(t)&&mi(t.id)?t.id:"unknown"}const Rl={id:"validation-cardstock",material:{id:"validation-paper",density:700,youngModulus:25e8,poissonRatio:.3},panelThickness:3e-4,crease:{model:"concentratedHinge",rotationalStiffness:.02},contact:{mode:"coulomb",clearance:1e-4,collisionMargin:2e-5,frictionCoefficient:.4,restitution:0}},q0={id:"validation-laser",kerf:15e-5,lengthTolerance:5e-5,angleTolerance:Math.PI/360,minimumFeatureWidth:5e-4,minimumBridgeWidth:.001,nominalCreaseWidth:3e-4},Qt=1e-9;function Y0(t){const e=new Map;for(const n of t){const i=Z0(n),s=e.get(i.key)??{plane:i,faces:[]};s.faces.push(n),e.set(i.key,s)}return[...e.entries()].sort(([n],[i])=>n.localeCompare(i)).flatMap(([,n],i)=>K0(n.plane,n.faces,i)).sort(nx)}function K0(t,e,n){if(e.length<2)return e;const[i,s]=J0(t.normal),r=e.map(l=>j0(l,i,s));if(!Q0(r))return e;const a=Cl(r.flatMap(l=>[l.uMinimum,l.uMaximum])),o=Cl(r.flatMap(l=>[l.vMinimum,l.vMaximum])),c=[];for(let l=0;l<a.length-1;l+=1)for(let h=0;h<o.length-1;h+=1){const u=a[l],d=a[l+1],f=o[h],p=o[h+1];if(d-u<=Qt||p-f<=Qt)continue;const _=(u+d)/2,m=(f+p)/2,g=r.filter(w=>_>w.uMinimum-Qt&&_<w.uMaximum+Qt&&m>w.vMinimum-Qt&&m<w.vMaximum+Qt);if(g.length===0)continue;const A=[...new Set(g.flatMap(({face:w})=>w.sourceOperationId===void 0?[]:[w.sourceOperationId]))];c.push({id:`coalesced-face:${n}:${l}:${h}`,vertices:[ir(t,i,s,u,f),ir(t,i,s,d,f),ir(t,i,s,d,p),ir(t,i,s,u,p)],sourceEntities:ex(g.flatMap(({face:w})=>w.sourceEntities)),...A.length===1?{sourceOperationId:A[0]}:{}})}return c}function Z0(t){const e=fo(t.vertices[1],t.vertices[0]),n=fo(t.vertices[2],t.vertices[0]);let i=po(Vu(e,n));const s=i.findIndex(a=>Math.abs(a)>Qt);s>=0&&i[s]<0&&(i=Qi(i,-1));const r=es(i,t.vertices[0]);return{normal:i,offset:r,key:[...i,r].map(a=>tx(a)).join(":")}}function J0(t){const n=[...[[1,0,0],[0,1,0],[0,0,1]]].sort((s,r)=>Math.abs(es(s,t))-Math.abs(es(r,t)))[0],i=po(fo(n,Qi(t,es(n,t))));return[i,po(Vu(t,i))]}function j0(t,e,n){const i=t.vertices.map(r=>es(r,e)),s=t.vertices.map(r=>es(r,n));return{face:t,uMinimum:Math.min(...i),uMaximum:Math.max(...i),vMinimum:Math.min(...s),vMaximum:Math.max(...s)}}function Q0(t){for(let e=0;e<t.length;e+=1)for(let n=e+1;n<t.length;n+=1){const i=t[e],s=t[n];if(Math.min(i.uMaximum,s.uMaximum)-Math.max(i.uMinimum,s.uMinimum)>Qt&&Math.min(i.vMaximum,s.vMaximum)-Math.max(i.vMinimum,s.vMinimum)>Qt)return!0}return!1}function ir(t,e,n,i,s){return Pl(Pl(Qi(e,i),Qi(n,s)),Qi(t.normal,t.offset))}function Cl(t){const e=[];for(const n of[...t].sort((i,s)=>i-s))(e.length===0||Math.abs(n-e[e.length-1])>Qt)&&e.push(n);return e}function ex(t){return[...new Map([...t].sort((e,n)=>`${e.kind}\0${e.id}`.localeCompare(`${n.kind}\0${n.id}`)).map(e=>[`${e.kind}\0${e.id}`,e])).values()]}function Pl(t,e){return t.map((n,i)=>n+e[i])}function fo(t,e){return t.map((n,i)=>n-e[i])}function Qi(t,e){return t.map(n=>n*e)}function Vu(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function es(t,e){return t.reduce((n,i,s)=>n+i*e[s],0)}function po(t){const e=Math.hypot(...t);if(!Number.isFinite(e)||e<=Qt)throw new RangeError("Paper face requires a finite nonzero normal.");return Qi(t,1/e)}function tx(t){return(Math.round(t/Qt)*Qt).toFixed(9)}function nx(t,e){return t.id.localeCompare(e.id)}function zu(t,e,n){if(!Number.isFinite(n.width)||!Number.isFinite(n.height)||n.width<=0||n.height<=0||n.center.length!==2||!n.center.every(Number.isFinite)||t.length===0||t.length!==e.length)throw new RangeError("Single-vertex paper input is not finite and bounded.");const[i,s]=n.center,r=[i,s,0],a=ix(n),o=2*(n.width+n.height);let c=0;const l=t.map(f=>{const p=sx(c,n);return c+=f,p}),h=[{id:"vertex:center",position:r,role:"vertex",sourceEntities:[{kind:"vertex",id:"vertex:center"}]},...a.map((f,p)=>({id:`paper:corner:${p}`,position:f.position,role:"vertex",sourceEntities:[{kind:"paperBoundary",id:`paper:corner:${p}`}]})),...l.map((f,p)=>({id:`vertex:ray:${p}`,position:f.position,role:"vertex",sourceEntities:[{kind:"sectorRay",id:`sectorRay:${p}`}]}))],u=[...a.map((f,p)=>({id:`paper:boundary:${p}`,start:f.position,end:a[(p+1)%a.length].position,role:"boundary",sourceEntities:[{kind:"paperBoundary",id:`paper:boundary:${p}`}]})),...l.map((f,p)=>({id:`crease:${p}`,start:r,end:f.position,role:ax(e[p]),sourceEntities:[{kind:"sectorRay",id:`sectorRay:${p}`}]}))],d=l.map((f,p)=>{const _=l[(p+1)%l.length],m=Il(f.perimeter,_.perimeter,o),g=a.map(A=>({corner:A,distance:Il(f.perimeter,A.perimeter,o)})).filter(A=>A.distance>1e-12&&A.distance<m-1e-12).sort((A,w)=>A.distance-w.distance).map(A=>A.corner.position);return{id:`paper:sector:${p}`,vertices:[r,f.position,...g,_.position],sourceEntities:[{kind:"singleVertexFace",id:`singleVertexFace:${p}`}]}});return{points:h.sort(Ea),segments:u.sort(Ea),faces:d.sort(Ea)}}function ix(t){const[e,n]=t.center,i=e-t.width/2,s=e+t.width/2,r=n-t.height/2,a=n+t.height/2;return[{position:[i,r,0],perimeter:0},{position:[s,r,0],perimeter:t.width},{position:[s,a,0],perimeter:t.width+t.height},{position:[i,a,0],perimeter:2*t.width+t.height}]}function sx(t,e){const[n,i]=e.center,s=Math.cos(t),r=Math.sin(t),a=e.width/2,o=e.height/2,c=Math.abs(s)<1e-14?Number.POSITIVE_INFINITY:a/Math.abs(s),l=Math.abs(r)<1e-14?Number.POSITIVE_INFINITY:o/Math.abs(r),h=Math.min(c,l),u=n+s*h,d=i+r*h;return{position:[u,d,0],perimeter:rx(u,d,e)}}function rx(t,e,n){const[i,s]=n.center,r=i-n.width/2,a=i+n.width/2,o=s-n.height/2,c=s+n.height/2,l=1e-9;return Math.abs(e-o)<=l?t-r:Math.abs(t-a)<=l?n.width+(e-o):Math.abs(e-c)<=l?n.width+n.height+(a-t):2*n.width+n.height+(c-e)}function Il(t,e,n){const i=(e-t+n)%n;return i<=1e-12?n:i}function ax(t){return t==="mountain"?"hingeMountain":t==="valley"?"hingeValley":"hingeUnassigned"}function Ea(t,e){return t.id.localeCompare(e.id)}function Hu(t,e){if(!Number.isFinite(e.width)||e.width<=0)return{points:[],segments:[],faces:[]};const n=t.frames.parentFloor.widthAxis,i=[["origin",t.points.origin],["floor-anchor",t.points.floorAnchor],["junction",t.points.junction],["wall-anchor",t.points.wallAnchor]],s=[["parent-floor",t.points.origin,t.points.floorAnchor],["child-wall",t.points.floorAnchor,t.points.junction],["child-floor",t.points.junction,t.points.wallAnchor],["parent-wall",t.points.wallAnchor,t.points.origin]],r=(e.diagnosticSpans??[]).map(h=>({...h,minimum:Math.max(0,Math.min(e.width,h.minimum)),maximum:Math.max(0,Math.min(e.width,h.maximum))})).filter(h=>h.maximum>h.minimum),a=[...new Set([0,e.width,...r.flatMap(h=>[h.minimum,h.maximum])])].sort((h,u)=>h-u),o=i.flatMap(([h,u])=>a.map((d,f)=>({id:`panel-point:${h}:${f}`,position:Pn(u,n,d),role:"vertex",sourceEntities:[...e.sourceEntities,{kind:"twoPlanePoint",id:`${t.id}:${h}`}]}))),c=[...i.flatMap(([h,u])=>Ll(a).map(([d,f],p)=>({id:`panel-hinge:${h}:${p}`,start:Pn(u,n,d),end:Pn(u,n,f),role:"hingeUnassigned",sourceEntities:[...e.sourceEntities,{kind:"twoPlaneHinge",id:`${t.id}:${h}`},...Dl(r,d,f)]}))),...[0,e.width].flatMap((h,u)=>s.map(([d,f,p])=>({id:`panel-boundary:${u}:${d}`,start:Pn(f,n,h),end:Pn(p,n,h),role:"boundary",sourceEntities:[...e.sourceEntities,{kind:"twoPlanePanel",id:`${t.id}:${d}`}]})))],l=s.flatMap(([h,u,d])=>Ll(a).map(([f,p],_)=>({id:`panel-face:${h}:${_}`,vertices:[Pn(u,n,f),Pn(d,n,f),Pn(d,n,p),Pn(u,n,p)],sourceEntities:[...e.sourceEntities,{kind:"twoPlanePanel",id:`${t.id}:${h}`},...Dl(r,f,p)]})));return{points:o.sort(ba),segments:c.sort(ba),faces:l.sort(ba)}}function Pn(t,e,n){return Ft(t,St(e,n))}function Ll(t){return t.slice(0,-1).map((e,n)=>[e,t[n+1]])}function Dl(t,e,n){const i=(e+n)/2;return ox(t.filter(s=>i>s.minimum&&i<s.maximum).flatMap(s=>s.sourceEntities))}function ox(t){return[...new Map(t.map(e=>[`${e.kind}\0${e.id}`,e])).values()]}function ba(t,e){return t.id.localeCompare(e.id)}function cx(t,e){const n=lx(t),i=[...n.points],s=[...n.segments],r=[...n.faces],a=yc(t.sheet,t.sheet.deployedAngle),o=Nu(t.operations),c=hx(t.operations),l=new Map,h=[...t.operations].sort((u,d)=>(o.get(u.id)??Number.POSITIVE_INFINITY)-(o.get(d.id)??Number.POSITIVE_INFINITY)||u.id.localeCompare(d.id));for(const u of h){const d=u.target.kind==="sheet"?a:l.get(u.target.operationId)?.outputPort;if(!d)continue;if(u.kind==="opening"){dx(i,s,u,d);continue}const f=da({id:`authoring:${u.id}`,width:u.width,height:u.height,depth:u.depth,deployedAngle:t.sheet.deployedAngle},t.sheet.deployedAngle);if(!f.ok)continue;const p=Tu(f.state,d,u.xOffset),_=c.get(u.id);if(!_)continue;const m=[{kind:"spatialOperation",id:u.id},{kind:"popUpNode",id:`spatial-node:${u.id}`}],g=Hu(p,{width:u.width,sourceEntities:m,diagnosticSpans:ux(t,u,c,e)});fx(i,s,r,u.id,g),l.set(u.id,{operation:u,state:p,globalInterval:_,outputPort:Au({id:u.id,width:u.width,height:u.height,depth:u.depth,deployedAngle:t.sheet.deployedAngle},p,`spatial-node:${u.id}`)})}return{points:i.sort(Fl),segments:s.sort(Fl),faces:Y0(r)}}function lx(t){const e=yc(t.sheet,t.sheet.deployedAngle),n=e.origin,i=e.boundary.end,s=Ft(n,St(e.floor.frame.inPlaneAxis,e.floor.extent)),r=Ft(i,St(e.floor.frame.inPlaneAxis,e.floor.extent)),a=Ft(n,St(e.wall.frame.inPlaneAxis,e.wall.extent)),o=Ft(i,St(e.wall.frame.inPlaneAxis,e.wall.extent)),c=[{kind:"spatialProgram",id:t.id},{kind:"sheet",id:t.sheet.id}],l=[...c,{kind:"sheetSurface",id:`${t.sheet.id}:floor`}],h=[...c,{kind:"sheetSurface",id:`${t.sheet.id}:wall`}];return{points:[pi("sheet:hinge:start",n,c),pi("sheet:hinge:end",i,c),pi("sheet:floor:start",s,l),pi("sheet:floor:end",r,l),pi("sheet:wall:start",a,h),pi("sheet:wall:end",o,h)],segments:[un("sheet:hinge",n,i,"hingeUnassigned",c),un("sheet:floor:left",n,s,"boundary",l),un("sheet:floor:outer",s,r,"boundary",l),un("sheet:floor:right",r,i,"boundary",l),un("sheet:wall:left",n,a,"boundary",h),un("sheet:wall:outer",a,o,"boundary",h),un("sheet:wall:right",o,i,"boundary",h)],faces:[{id:"sheet:floor",vertices:[n,i,r,s],sourceEntities:l},{id:"sheet:wall",vertices:[n,a,o,i],sourceEntities:h}]}}function dx(t,e,n,i){const s=Ft(i.origin,St(i.widthAxis,n.xOffset)),r=Ft(s,St(i.widthAxis,n.width)),a=Ft(s,St(i.wall.frame.inPlaneAxis,n.height)),o=Ft(r,St(i.wall.frame.inPlaneAxis,n.height)),c=[{kind:"spatialOperation",id:n.id}],l=[["lower-start",s],["lower-end",r],["upper-end",o],["upper-start",a]];t.push(...l.map(([h,u])=>pi(`opening:${n.id}:${h}`,u,c))),e.push(un(`opening:${n.id}:bottom`,s,r,"cut",c),un(`opening:${n.id}:right`,r,o,"cut",c),un(`opening:${n.id}:top`,o,a,"cut",c),un(`opening:${n.id}:left`,a,s,"cut",c))}function ux(t,e,n,i){const s=[],r=n.get(e.id);if(!r)return s;const a=i.flatMap(c=>c.locations.flatMap(l=>l.kind==="entity"?[l.entity]:[]));for(const c of t.operations){if(c.id===e.id||Nl(c)!==Nl(e))continue;const l=Eu(`spatial-node:${e.id}`,`spatial-node:${c.id}`),h=a.find(p=>p.kind==="overlapRegion"&&p.id===l),u=n.get(c.id);if(!h||!u)continue;const d=Math.max(r[0],u[0]),f=Math.min(r[1],u[1]);f>d&&s.push({minimum:d-r[0],maximum:f-r[0],sourceEntities:[h]})}const o=a.find(c=>c.kind==="outOfBoundsRegion"&&c.id===bu(`spatial-node:${e.id}`));if(o){const c=e.target.kind==="generatedPair"?e.target.operationId:void 0,l=c===void 0?t.sheet.width:t.operations.find(h=>h.id===c)?.width;l!==void 0&&(e.xOffset<0&&s.push({minimum:0,maximum:Math.min(e.width,-e.xOffset),sourceEntities:[o]}),e.xOffset+e.width>l&&s.push({minimum:Math.max(0,l-e.xOffset),maximum:e.width,sourceEntities:[o]}))}return s}function hx(t){const e=new Map(t.map(s=>[s.id,s])),n=new Map,i=s=>{const r=n.get(s.id);if(r)return r;const a=s.target.kind==="sheet"?s.xOffset:i(e.get(s.target.operationId)).at(0)+s.xOffset,o=[a,a+s.width];return n.set(s.id,o),o};for(const s of t)i(s);return n}function fx(t,e,n,i,s){const r=`operation:${i}:`;t.push(...s.points.map(a=>({...a,id:`${r}${a.id}`}))),e.push(...s.segments.map(a=>({...a,id:`${r}${a.id}`}))),n.push(...s.faces.map(a=>({...a,id:`${r}${a.id}`,sourceOperationId:i})))}function Nl(t){return t.target.kind==="sheet"?"sheet":`operation:${t.target.operationId}`}function pi(t,e,n){return{id:t,position:e,role:"vertex",sourceEntities:n}}function un(t,e,n,i,s){return{id:t,start:e,end:n,role:i,sourceEntities:s}}function Fl(t,e){return t.id.localeCompare(e.id)}function px(t){const e=F0(t),n=mx(t,e).sort((s,r)=>s.parameter-r.parameter),i=e.observed.disposition==="accepted"?void 0:bx(t,e.diagnostics);return{example:t,result:e,frames:n,...i===void 0?{}:{diagnosticPreview:i}}}function mx(t,e){switch(t.kind){case"singleHinge":return gx(t,e);case"singleVertex":return e.observed.disposition==="accepted"?[{parameter:0,frame:zu(t.input.sectorAngles,t.input.assignments,t.input.paper)}]:[];case"twoPlanePopUp":return _x(t,e);case"spatialProgram":return xx(t,e)}}function gx(t,e){if(e.observed.disposition!=="accepted")return[];const n=xc(t.input.assignment),i=Su({complex:n,hingeEdgeId:"hinge",parentFaceId:"left",parentPose:tn(),angle:t.input.angle,stateId:`validation:${t.id}`});return i.ok?[{parameter:t.input.angle,frame:Pi(n,Mx(i.state))}]:[]}function _x(t,e){if(e.observed.disposition!=="accepted")return[];const n=Ec(Ex(t.input),t.input.sampleCount);return n.ok?n.path.samples.map(i=>({parameter:i.parentAngle,frame:Hu(i,{width:t.input.width,sourceEntities:[{kind:"twoPlanePopUp",id:i.id}]})})):[]}function xx(t,e){if(e.observed.disposition!=="accepted")return[];const n=Ou(t.input);if(!n.ok)return[];const i=[...n.path.samples].sort((r,a)=>a.parentAngle-r.parentAngle)[0],s=new Map(n.traces.flatMap(r=>r.faceIds.map(a=>[a,r.operationId])));return n.path.samples.map(r=>({parameter:r.parentAngle,frame:Pi(n.compiledAssembly.complex,vx(n.compiledAssembly,i,r),s)}))}function vx(t,e,n){return new Map(t.sourceMap.faces.map(({faceId:i,owner:s})=>[i,gc(Ul(e,s),Ul(n,s))]))}function Ul(t,e){if(e.kind==="module"){const i=t.nodes.find(s=>s.nodeId===e.nodeId);if(!i)throw new RangeError(`Missing engine state for ${e.nodeId}.`);return e.role==="childFloor"?i.worldState.frames.childFloor:i.worldState.frames.childWall}const n=[...t.nodes].filter(i=>i.depth===1).sort((i,s)=>i.nodeId.localeCompare(s.nodeId))[0];if(!n)throw new RangeError("Compiled sheet has no root engine state.");return e.role==="floor"?n.worldState.frames.parentFloor:n.worldState.frames.parentWall}function Mx(t){return new Map(t.facePoses.map(({faceId:e,transform:n})=>[e,n]))}function Pi(t,e,n=new Map,i){const s=new Map(t.vertices.map(p=>[p.id,p])),r=new Map(t.halfEdges.map(p=>[p.id,p])),a=p=>!0,o=new Map;for(const p of[...t.halfEdges].sort(_s))a(p.face),o.has(p.origin)||o.set(p.origin,p.face);const c=(p,_)=>{const m=s.get(p)?.position,g=e.get(_);if(!m||!g)throw new RangeError(`Missing topology transform for ${p}/${_}.`);return gt(g,[m[0],m[1],0])},l=t.edges.flatMap(p=>{const _=Sx(p);if(_===void 0)return[];const m=[...p.halfEdges].map(A=>r.get(A)).filter(A=>a(A.face)).sort(_s)[0];if(!m)return[];const g=r.get(m.next);return[{edge:p,halfEdge:m,next:g,role:_}]}),h=new Set(l.flatMap(({halfEdge:p,next:_})=>[p.origin,_.origin])),u=t.vertices.filter(p=>h.has(p.id)&&o.has(p.id)).map(p=>({id:p.id,position:c(p.id,o.get(p.id)),role:"vertex",sourceEntities:[{kind:"vertex",id:p.id}]})).sort(_s),d=l.map(({edge:p,halfEdge:_,next:m,role:g})=>({id:p.id,start:c(_.origin,_.face),end:c(m.origin,_.face),role:g,sourceEntities:[{kind:"edge",id:p.id}]})).sort(_s),f=t.faces.filter(p=>a(p.id)).map(p=>{const _=yx(p.boundary,r),m=n.get(p.id),g=[{kind:"face",id:p.id},...m===void 0?[]:[{kind:"spatialOperation",id:m}]];return{id:p.id,vertices:_.map(A=>c(A.origin,p.id)),sourceEntities:g,...m===void 0?{}:{sourceOperationId:m}}}).sort(_s);return{points:u,segments:d,faces:f}}function yx(t,e){const n=[];let i=e.get(t);for(;i&&(n.length===0||i.id!==t);)n.push(i),i=e.get(i.next);return n}function Sx(t){if(t.kind==="boundary")return"boundary";if(t.kind==="cutBank")return"cut";if(t.kind==="hinge")return t.hinge?.assignment==="mountain"?"hingeMountain":t.hinge?.assignment==="valley"?"hingeValley":"hingeUnassigned"}function Ex(t){return{id:t.id,width:t.width,height:t.height,depth:t.depth,deployedAngle:t.deployedAngle}}function bx(t,e){if(t.kind==="singleHinge"){const n=xc(t.input.assignment);return{label:"input topology",frame:Pi(n,new Map(n.faces.map(i=>[i.id,tn()])))}}if(t.kind==="singleVertex")return{label:"input topology",frame:zu(t.input.sectorAngles,t.input.assignments,t.input.paper)};if(t.kind==="twoPlanePopUp"){const n=Ax(t.input);return n===void 0?void 0:{label:"input topology",frame:n}}return{label:"authoring geometry",frame:cx(t.input,e)}}function Ax(t){if(![t.width,t.height,t.depth,t.deployedAngle].every(Number.isFinite))return;const n=[{kind:"twoPlanePopUp",id:t.id}],i=[0,0,0],s=[t.width,0,0],r=[0,t.depth,0],a=[0,Math.cos(t.deployedAngle)*t.height,Math.sin(t.deployedAngle)*t.height];return{points:[{id:"anchor:origin",position:i,role:"anchor",sourceEntities:n},{id:"anchor:width",position:s,role:"anchor",sourceEntities:n},{id:"anchor:floor",position:r,role:"anchor",sourceEntities:n},{id:"anchor:wall",position:a,role:"anchor",sourceEntities:n}],segments:[{id:"input:width",start:i,end:s,role:"link",sourceEntities:n},{id:"input:floor",start:i,end:r,role:"link",sourceEntities:n},{id:"input:wall",start:i,end:a,role:"link",sourceEntities:n}],faces:[]}}function _s(t,e){return t.id.localeCompare(e.id)}const Tx=Object.assign({"../../examples/validation/01-hinge-flat.json":$f,"../../examples/validation/02-hinge-intermediate.json":sp,"../../examples/validation/03-hinge-folded.json":_p,"../../examples/validation/04-hinge-assignment-invalid.json":Pp,"../../examples/validation/05-vertex-valid.json":Gp,"../../examples/validation/06-vertex-maekawa-invalid.json":nm,"../../examples/validation/07-popup-symmetric.json":mm,"../../examples/validation/08-popup-unequal.json":Rm,"../../examples/validation/09-popup-invalid.json":zm,"../../examples/validation/10-spatial-root.json":eg,"../../examples/validation/11-spatial-nested-shelf.json":fg,"../../examples/validation/12-spatial-siblings.json":Tg,"../../examples/validation/13-spatial-overlap.json":Bg,"../../examples/validation/14-spatial-depth.json":jg,"../../examples/validation/15-spatial-opening.json":u_,"../../examples/validation/16-spatial-out-of-bounds.json":b_}),sr=Object.entries(Tx).sort(([t],[e])=>t.localeCompare(e)).map(([t,e])=>{const n=Bu(e);if(!n.ok)throw new TypeError(`${t}: ${n.diagnostics.map(i=>i.message).join(" ")}`);return{filename:t.slice(t.lastIndexOf("/")+1),example:n.example}});function wx(t=new Worker(new URL("/kirigami/assets/engine-worker-BPrAlUaa.js",import.meta.url),{type:"module",name:"kirigami-engine-lab"})){let e=1,n=!1;const i=new Map,s=r=>{for(const a of i.values())a.reject(r);i.clear()};return t.onmessage=({data:r})=>{if(n||r===null||typeof r!="object"||!Number.isInteger(r.requestId))return;const a=i.get(r.requestId);a&&(i.delete(r.requestId),r.ok?a.resolve(r.subject):a.reject(new Error(r.message)))},t.onerror=r=>{s(new Error(r.message||"Engine worker failed."))},{evaluate(r){if(n)return Promise.reject(new Error("Engine Lab client is disposed."));const a=e;return e+=1,new Promise((o,c)=>{i.set(a,{resolve:o,reject:c}),t.postMessage({requestId:a,type:"evaluate",example:r})})},dispose(){n||(n=!0,s(new Error("Engine Lab client was disposed.")),t.onmessage=null,t.onerror=null,t.terminate())}}}function Rx(t){const e=[];return mo(t.input,["input"],e),e.sort((n,i)=>Lx(n.path,i.path))}function Cx(t,e,n){if(e[0]!=="input"||e.length<2||!Number.isFinite(n)||typeof Dx(t,e)!="number")return Nx(t.id);const i=go(t,e,n);return Bu(i)}function mo(t,e,n){if(typeof t=="number"){const i=String(e[e.length-1]);if(i==="schemaVersion"||i==="tolerance")return;n.push({path:e,label:Px(e),value:t,step:i==="sampleCount"||i==="pathSampleCount"?1:i.toLowerCase().includes("angle")?.01:Math.max(Math.abs(t)*.05,.01)});return}if(Array.isArray(t)){t.forEach((i,s)=>mo(i,[...e,s],n));return}if(!(t===null||typeof t!="object"))for(const i of Object.keys(t).sort())i==="schemaVersion"||i==="tolerance"||mo(t[i],[...e,i],n)}function Px(t){const e=t.slice(1).map(n=>typeof n=="number"?String(n+1):Ix(n));return e.slice(Math.max(e.length-3,0)).join(" · ")}function Ix(t){const e=t.replace(/([a-z0-9])([A-Z])/g,"$1 $2");return e[0]?.toUpperCase()+e.slice(1)}function Lx(t,e){const n=Math.max(t.length,e.length);for(let i=0;i<n;i+=1){const s=t[i],r=e[i];if(s===void 0)return-1;if(r===void 0)return 1;if(s!==r)return typeof s=="number"&&typeof r=="number"?s-r:String(s).localeCompare(String(r))}return 0}function Dx(t,e){let n=t;for(const i of e){if(n===null||typeof n!="object")return;n=n[i]}return n}function go(t,e,n){if(e.length===0)return n;const[i,...s]=e;if(Array.isArray(t)){const a=[...t];return a[Number(i)]=go(a[Number(i)],s,n),a}const r=t;return{...r,[i]:go(r[i],s,n)}}function Nx(t){return{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Engine Lab parameter edits require a finite numeric input value.",locations:[{kind:"entity",entity:{kind:"validationExample",id:t}}],entities:[{kind:"validationExample",id:t}]}]}}function Fx(t,e,n,i={}){if(!e){t.innerHTML=n?`<div class="inspector-empty inspector-error">${$t(n)}</div>`:'<div class="inspector-empty">Select an example to inspect engine evidence.</div>';return}const{result:s}=e,r=Rx(e.example),a=s.observed.disposition!=="accepted";t.innerHTML=`
    ${n===void 0?"":`<div class="inspector-error-banner" role="alert">${$t(n)}</div>`}
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
          <dd>${$t(s.observed.classification??"not produced")}</dd>
        </div>
      </dl>
    </section>
    <section class="inspection-section">
      <h2>Diagnostics <span>${s.diagnostics.length}</span></h2>
      ${s.diagnostics.length===0?'<p class="quiet">No engine diagnostics.</p>':`<ul class="diagnostic-list">${s.diagnostics.map(o=>`
                  <li${a?` data-diagnostic-state="${o.category==="unsupported"?"unsupported":"invalid"}"`:""}>
                    <code>${$t(o.code)}</code>
                    <p>${$t(o.message)}</p>
                    <ul class="diagnostic-locations" aria-label="Diagnostic locations">
                      ${o.locations.map(c=>`<li>${$t(Ux(c))}</li>`).join("")}
                    </ul>
                    <small>${$t(o.category)} · ${$t(o.severity)}</small>
                  </li>`).join("")}</ul>`}
    </section>
    <section class="inspection-section">
      <h2>Conformance checks <span>${s.checks.length}</span></h2>
      <div class="check-list">
        ${s.checks.map(o=>`
              <details ${o.passed?"":"open"}>
                <summary>
                  <span class="check-state" data-status="${o.passed?"passed":"failed"}"></span>
                  <code>${$t(o.id)}</code>
                </summary>
                <dl>
                  <div><dt>Method</dt><dd>${$t(o.method)}</dd></div>
                  <div><dt>Expected</dt><dd>${Ol(o.expected)}</dd></div>
                  <div><dt>Actual</dt><dd>${Ol(o.actual)}</dd></div>
                  ${o.residual===void 0?"":`<div><dt>Residual</dt><dd>${Qr(o.residual)}</dd></div>`}
                  ${o.tolerance===void 0?"":`<div><dt>Tolerance</dt><dd>${Qr(o.tolerance)}</dd></div>`}
                </dl>
              </details>`).join("")}
      </div>
    </section>
    <section class="inspection-section parameter-section" aria-label="Parameters">
      <h2>Parameters <span>${r.length}</span></h2>
      <div class="parameter-list">
        ${r.map(o=>`
              <label${kl(o.path,s.diagnostics,a)===void 0?"":` data-diagnostic-state="${kl(o.path,s.diagnostics,a)}"`}>
                <span>${$t(o.label)}</span>
                <input
                  type="number"
                  aria-label="${$t(o.label)}"
                  data-parameter-path="${$t(JSON.stringify(o.path))}"
                  value="${o.value}"
                  step="${o.step}"
                />
              </label>`).join("")}
      </div>
      ${r.length===0?'<p class="quiet">This example has no numeric input leaves.</p>':'<button class="parameter-reset" type="button">Reset parameters</button>'}
    </section>
  `,t.querySelectorAll("[data-parameter-path]").forEach(o=>{let c;o.addEventListener("input",()=>{c!==void 0&&window.clearTimeout(c);const l=JSON.parse(o.dataset.parameterPath??"[]");c=window.setTimeout(()=>{i.onParameterCommit?.(l,Number(o.value))},240)})}),t.querySelector(".parameter-reset")?.addEventListener("click",()=>i.onReset?.())}function Ol(t){return typeof t=="number"?Qr(t):$t(JSON.stringify(t)??String(t))}function Ux(t){return t.kind==="entity"?`${t.entity.kind} · ${t.entity.id}`:t.kind==="parameter"?t.path.map(String).join(" · "):t.kind==="sample"?`sample ${t.index+1}${t.parameter===void 0?"":` · parameter ${Qr(t.parameter)}`}`:`non-spatial · ${t.reason}`}function kl(t,e,n){if(!n)return;const i=e.filter(s=>s.locations.some(r=>r.kind==="parameter"&&Ox(t,r.path)));return i.some(s=>s.category!=="unsupported")?"invalid":i.some(s=>s.category==="unsupported")?"unsupported":void 0}function Ox(t,e){return t.length>=e.length&&e.every((n,i)=>t[i]===n)}function Qr(t){return t===0?"0":Math.abs(t)>=1e3||Math.abs(t)<.001?t.toExponential(4):t.toPrecision(6)}function $t(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function kx(t,e,n,i){const s=Pi(t,i,new Map(e.faces.map(a=>[a.faceId,n.operationId]))),r=s.segments.map(a=>({...a,start:On(a.start),end:On(a.end)}));return{points:ha(r),segments:r,faces:s.faces.map(a=>({...a,vertices:a.vertices.map(On)}))}}function Bx(t,e,n){const i=Pi(t,n,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:On(r.start),end:On(r.end)}));return{points:ha(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(On)}))}}function Vx(t,e,n){const i=Pi(t,n,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:Aa(r.start),end:Aa(r.end)}));return{points:ha(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(Aa)}))}}function zx(t,e){const n=Pi(t.complex,e.transforms,new Map(t.sourceMap.integratedFaces.map(s=>[s.faceId,`${t.input.operationId}:${s.source}`]))),i=n.segments.map(s=>({...s,start:On(s.start),end:On(s.end)}));return{faces:n.faces.map(s=>({...s,vertices:s.vertices.map(On)})),segments:i,points:ha(i)}}function On([t,e,n]){return[t,n,-e]}function Aa([t,e,n]){return[t,-e,n]}function ha(t){const e=new Map;for(const n of t)Bl(e,n.start,n.role,Vl(n.end,n.start)),Bl(e,n.end,n.role,Vl(n.start,n.end));return[...e.entries()].filter(([,n])=>Hx(n.entries)).sort(([n],[i])=>n.localeCompare(i)).map(([n,i])=>({id:`fabrication-corner:${n}`,position:i.position,role:"vertex",sourceEntities:[]}))}function Bl(t,e,n,i){const s=e.map(a=>Math.round(a*1e9)).join(":"),r=t.get(s)??{position:e,entries:[]};r.entries.push({role:n,direction:i}),t.set(s,r)}function Hx(t){const e=t.filter((r,a,o)=>o.findIndex(c=>c.role===r.role&&Gx(c.direction,r.direction))===a);if(e.length!==2)return e.length>0;if(e[0].role!==e[1].role)return!0;const[n,i]=e.map(r=>r.direction),s=[n[1]*i[2]-n[2]*i[1],n[2]*i[0]-n[0]*i[2],n[0]*i[1]-n[1]*i[0]];return Math.hypot(...s)>1e-9}function Gx(t,e){const n=Math.hypot(...t),i=Math.hypot(...e);return n<=1e-12||i<=1e-12?!1:(t[0]*e[0]+t[1]*e[1]+t[2]*e[2])/(n*i)>=1-1e-9}function Vl(t,e){return[t[0]-e[0],t[1]-e[1],t[2]-e[2]]}function Ac(t){const e=qx(t);if(e)return{ok:!1,diagnostics:[e]};const n=t.stepCount*t.stepRun,i=(t.hostWidth-n)/2,s=Array.from({length:t.stepCount+1},(y,T)=>{const M=i+T*t.stepRun,b=T===0,P=T===t.stepCount,C=b||P?-t.width:(T-1)*t.stepRise-t.width,I=P?(t.stepCount-1)*t.stepRise:T*t.stepRise;return{cutPairId:`cut:long:${T}`,axis:"long",lineIndex:T,start:[M,C],end:[M,I]}}),r=Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:inherited:${T}`,role:"inherited",stepIndex:T,start:[s[T].end[0],T*t.stepRise],end:[s[T+1].end[0],T*t.stepRise]})),a=Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:explicit:${T}`,role:"explicit",stepIndex:T,start:[s[T].start[0],T*t.stepRise-t.width],end:[s[T+1].start[0],T*t.stepRise-t.width]})),o=Hl([0,t.hostWidth,...s.map(y=>y.start[0])]),c=Hl([-t.hostFloorExtent,t.hostWallExtent,0,...s.flatMap(y=>[y.start[1],y.end[1]]),...r.flatMap(y=>[y.start[1],y.end[1]]),...a.flatMap(y=>[y.start[1],y.end[1]])]),l=[],h=[],u=[],d=[],f=[],p=[],_=[];for(let y=0;y<c.length;y+=1)for(let T=0;T<o.length;T+=1)l.push({id:xs(T,y),position:[o[T],c[y]]});for(let y=0;y<c.length-1;y+=1)for(let T=0;T<o.length-1;T+=1){const M=`sheet-face:${y}:${T}`,b=["bottom","right","top","left"].map(D=>`he:${y}:${T}:${D}`);u.push({id:b[0],origin:xs(T,y),next:b[1],edge:"pending",face:M},{id:b[1],origin:xs(T+1,y),next:b[2],edge:"pending",face:M},{id:b[2],origin:xs(T+1,y+1),next:b[3],edge:"pending",face:M},{id:b[3],origin:xs(T,y+1),next:b[0],edge:"pending",face:M}),h.push({id:M,boundary:b[0],holes:[]});const P=[(o[T]+o[T+1])/2,(c[y]+c[y+1])/2],C=Xx(P[0],i,t.stepRun,t.stepCount),I=C===void 0?void 0:$x(P,r,a),X=C===void 0?void 0:C*t.stepRise-t.width,H=I!==void 0?"tread":C!==void 0&&P[1]>=-t.width&&P[1]<X?"carrier":P[1]<0?"base":"host";p.push({faceId:M,role:H,...I===void 0?{}:{stepIndex:I}})}const m=new Map(u.map(y=>[y.id,y])),g=(y,T)=>{for(const M of y)m.get(M).edge=T.id;y.length===2&&(m.get(y[0]).twin=y[1],m.get(y[1]).twin=y[0]),d.push(T)};for(let y=0;y<c.length-1;y+=1)for(let T=0;T<o.length;T+=1){const M=T>0?`he:${y}:${T-1}:right`:void 0,b=T<o.length-1?`he:${y}:${T}:left`:void 0,P=[M,b].filter(q=>q!==void 0);if(P.length===1){const q=[P[0]];g(q,{id:`boundary:v:${y}:${T}`,halfEdges:q,kind:"boundary"});continue}const C=[P[0],P[1]],I=o[T],X=c[y],H=c[y+1],D=s.find(q=>xi(q.start[0],I)&&X>=q.start[1]-1e-10&&H<=q.end[1]+1e-10);if(!D||D.lineIndex===0){g(C,{id:`seam:v:${y}:${T}`,halfEdges:C,kind:"flatSeam"});continue}const $=`${D.cutPairId}:segment:${y}`,B=["",""];for(let q=0;q<C.length;q+=1){const te=q===0?"a":"b",re=`${$}:${te}`,ce=[C[q]];g(ce,{id:re,halfEdges:ce,kind:"cutBank",cutBank:{pair:$,bank:te}}),B[q]=re}f.push({id:$,banks:B})}for(let y=0;y<c.length;y+=1)for(let T=0;T<o.length-1;T+=1){const M=y>0?`he:${y-1}:${T}:top`:void 0,b=y<c.length-1?`he:${y}:${T}:bottom`:void 0,P=[M,b].filter(ae=>ae!==void 0);if(P.length===1){const ae=[P[0]];g(ae,{id:`boundary:h:${y}:${T}`,halfEdges:ae,kind:"boundary"});continue}const C=[P[0],P[1]],I=[o[T],c[y]],X=[o[T+1],c[y]],H=r.find(ae=>Gl(ae.start,ae.end,I,X)),D=a.find(ae=>Gl(ae.start,ae.end,I,X)),$=I[0]>=s[0].start[0]-1e-10&&X[0]<=s.at(-1).start[0]+1e-10,B=xi(c[y],-t.width)&&$,q=xi(c[y],0)&&!$&&!H&&!D;if(D?.stepIndex===0){g(C,{id:"seam:terminal:ground",halfEdges:C,kind:"flatSeam"});continue}if(!H&&!D&&!q&&!B){g(C,{id:`seam:h:${y}:${T}`,halfEdges:C,kind:"flatSeam"});continue}const re=(H??D)?.edgeId??(B?`hinge:carrier-base:${T}`:`hinge:parent:${T}`),ce=D?"valley":"mountain";g(C,{id:re,halfEdges:C,kind:"hinge",hinge:{assignment:ce,restAngle:0,angleRange:ce==="valley"?[0,Math.PI/2]:[-Math.PI/2,0]}})}const A=p.filter(y=>y.role==="tread"),w=Array.from({length:t.stepCount},(y,T)=>({stepIndex:T,treadFaceId:A.find(M=>M.stepIndex===T).faceId,hostConnected:!0,carrierConnected:!0}));for(let y=0;y<t.stepCount;y+=1)_.push({edgeId:r[y].edgeId,kind:"retained",stepIndex:y,side:"host"}),y>0&&_.push({edgeId:a[y].edgeId,kind:"retained",stepIndex:y,side:"carrier"});const v={schemaVersion:1,vertices:l,halfEdges:u,edges:d,faces:h,cutPairs:f,materialComponents:[{id:`tread-only-material:${t.operationId}`,faces:h.map(y=>y.id)}]},E=Ci(v);return E.length>0?{ok:!1,diagnostics:E}:{ok:!0,complex:v,sourceMap:{construction:"treadOnly",operationId:t.operationId,enclosingCut:!1,faces:p,cutLines:s.slice(1),shortEnds:_,hinges:[{edgeId:"hinge:parent",role:"parent"},...r,...a.slice(1),...Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:carrier-base:${T+1}`,role:"carrierBase",stepIndex:T}))],supports:w}}}function Tc(t){if(!Number.isInteger(t.sampleCount)||t.sampleCount<2||t.sampleCount>1001)return{ok:!1,diagnostics:[_o(t.input.operationId,"Path sample count must be an integer in [2, 1001].")]};const e=[];for(let n=0;n<t.sampleCount;n+=1){const i=n/(t.sampleCount-1),s=Wx(t.input,t.complex,t.sourceMap,i);if(!s.ok)return{ok:!1,diagnostics:[_o(t.input.operationId,s.reason)]};e.push({parameter:i,transforms:s.transforms})}return{ok:!0,samples:e}}function Wx(t,e,n,i){const s=new Map(n.faces.map(u=>[u.faceId,u])),r=new Map(e.halfEdges.map(u=>[u.id,u])),a=new Map(e.vertices.map(u=>[u.id,u.position])),o=i*Math.PI/2,c=bi([0,0,0],[1,0,0],o),l=bi([0,-t.width,0],[1,0,0],o),h=new Map;for(const u of e.faces){const d=s.get(u.id);if(!d)return{ok:!1,reason:`Tread-only face ${u.id} has no material trace.`};if(d.role==="base")h.set(u.id,tn());else if(d.role==="host")h.set(u.id,c);else if(d.role==="carrier")h.set(u.id,l);else if(d.role==="tread"&&d.stepIndex!==void 0){const f=d.stepIndex*t.stepRise;h.set(u.id,{rotation:tn().rotation,translation:[0,-f*(1-Math.cos(o)),f*Math.sin(o)]})}else return{ok:!1,reason:`Tread-only face ${u.id} has unsupported role ${d.role}.`}}for(const u of e.edges.filter(d=>d.halfEdges.length===2)){const d=r.get(u.halfEdges[0]),f=r.get(u.halfEdges[1]),p=r.get(d.next),_=r.get(f.next),m=(A,w)=>{const v=a.get(w),E=h.get(A.face);return gt(E,[v[0],v[1],0])},g=Math.max(zl(m(d,d.origin),m(f,_.origin)),zl(m(d,p.origin),m(f,f.origin)));if(g>1e-8)return{ok:!1,reason:`Tread-only retained edge ${u.id} detaches by ${g}.`}}return{ok:!0,transforms:h}}function zl(t,e){return Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2])}function $x(t,e,n){return e.find((i,s)=>t[0]>i.start[0]&&t[0]<i.end[0]&&t[1]>n[s].start[1]&&t[1]<i.start[1])?.stepIndex}function Xx(t,e,n,i){if(!(t<=e||t>=e+i*n))return Math.min(i-1,Math.max(0,Math.floor((t-e)/n)))}function Hl(t){return[...new Set(t.map(e=>Number(e.toFixed(12))))].sort((e,n)=>e-n)}function xs(t,e){return`v:${e}:${t}`}function xi(t,e){return Math.abs(t-e)<=1e-10}function Gl(t,e,n,i){return xi(t[0],n[0])&&xi(t[1],n[1])&&xi(e[0],i[0])&&xi(e[1],i[1])}function qx(t){const e=t.stepCount*t.stepRun,n=-t.width,i=t.stepCount*t.stepRise;return t.operationId.length>0&&Number.isFinite(t.width)&&t.width>0&&Number.isInteger(t.stepCount)&&t.stepCount>=2&&t.stepCount<=20&&Number.isFinite(t.stepRun)&&t.stepRun>0&&t.stepRun===t.stepRise&&Number.isFinite(t.hostWidth)&&t.hostWidth>=e&&Number.isFinite(t.hostFloorExtent)&&t.hostFloorExtent>=-n&&Number.isFinite(t.hostWallExtent)&&t.hostWallExtent>=i?void 0:_o(t.operationId||"unknown","Tread-only stair dimensions must be positive, equal-run/equal-rise, bounded, and fit the host sheet.")}function _o(t,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}function Yx(t){const e=Ac(t);if(!e.ok)return e;const n=e.sourceMap.faces.map(a=>({faceId:a.faceId,role:a.role==="tread"?"riser":a.role==="host"?"stationaryHost":a.role==="base"?"movingHalf":"carrier",...a.stepIndex===void 0?{}:{stepIndex:a.stepIndex}})),i=n.filter(a=>a.role==="riser"),s=Gu(e.complex,ea),r=s.edges.filter(a=>a.id.startsWith("hinge:parent:")).map(a=>({edgeId:a.id,role:"parent"}));return{ok:!0,complex:s,sourceMap:{construction:"riserOnly",operationId:t.operationId,sheetOrientation:"landscape",parentCreaseAxis:"vertical",enclosingCut:!1,faces:n,cutLines:e.sourceMap.cutLines.map(a=>({...a,start:rr(a.start),end:rr(a.end)})),shortEnds:e.sourceMap.shortEnds.map(a=>({...a,side:a.side==="host"?"stationaryHost":"carrier"})),hinges:[...r,...e.sourceMap.hinges.filter(a=>a.role!=="parent").map(a=>({...a,...a.start===void 0?{}:{start:rr(a.start)},...a.end===void 0?{}:{end:rr(a.end)}}))],supports:Array.from({length:t.stepCount},(a,o)=>({stepIndex:o,riserFaceId:i.find(c=>c.stepIndex===o).faceId,stationaryHostConnected:!0,carrierConnected:!0}))}}}function Kx(t){const e={...t.sourceMap,construction:"treadOnly",faces:t.sourceMap.faces.map(r=>({faceId:r.faceId,role:r.role==="riser"?"tread":r.role==="stationaryHost"?"host":r.role==="movingHalf"?"base":"carrier",...r.stepIndex===void 0?{}:{stepIndex:r.stepIndex}})),shortEnds:t.sourceMap.shortEnds.map(r=>({...r,side:r.side==="stationaryHost"?"host":"carrier"})),supports:t.sourceMap.supports.map(r=>({stepIndex:r.stepIndex,treadFaceId:r.riserFaceId,hostConnected:!0,carrierConnected:!0}))},n=Gu(t.complex,Ei(ea)),i=Tc({input:t.input,complex:n,sourceMap:e,sampleCount:t.sampleCount});if(!i.ok)return i;const s=t.sourceMap.faces.find(r=>r.role==="stationaryHost");return s?{ok:!0,samples:i.samples.map(r=>{const a=Ei(r.transforms.get(s.faceId));return{parameter:r.parameter,transforms:new Map([...r.transforms].map(([o,c])=>[o,Zx(Xt(a,c))]))}})}:{ok:!1,diagnostics:[jx(t.input.operationId,"Riser-only pattern has no stationary host face.")]}}const ea={rotation:[[0,-1,0],[1,0,0],[0,0,1]],translation:[0,0,0]};function rr([t,e]){return[-e,t]}function Gu(t,e){return{...t,vertices:t.vertices.map(n=>{const[i,s]=n.position,r=Jx(e,[i,s,0]);return{...n,position:[r[0],r[1]]}})}}function Zx(t){return Xt(ea,Xt(t,Ei(ea)))}function Jx(t,e){return[t.rotation[0][0]*e[0]+t.rotation[0][1]*e[1]+t.rotation[0][2]*e[2]+t.translation[0],t.rotation[1][0]*e[0]+t.rotation[1][1]*e[1]+t.rotation[1][2]*e[2]+t.translation[1],t.rotation[2][0]*e[0]+t.rotation[2][1]*e[1]+t.rotation[2][2]*e[2]+t.translation[2]]}function jx(t,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}function Qx(t){const e={operationId:`${t.operationId}:parent`,...t.parent},n={operationId:`${t.operationId}:child`,hostPlane:"wall",...t.child},i=Ac(e);if(!i.ok)return i;const s=mc(n);if(!s.ok)return s;const r=nv(t),a=-t.parent.width;if(!iv(t,r,a))return{ok:!1,diagnostics:[vo(t.operationId,"The child stair must fit one retained carrier strip above the carrier-base hinge and parent base material below it.")]};const o=xo(i.complex),c=new Map(i.sourceMap.faces.map(_=>[_.faceId,_])),l=i.sourceMap.faces.filter(_=>{const m=o.get(_.faceId);return lv(m,r)}).map(_=>_.faceId).sort(),h=l.map(_=>c.get(_));if(!h.some(_=>_.role==="carrier")||!h.some(_=>_.role==="base"))return{ok:!1,diagnostics:[vo(t.operationId,"The child source region must replace both retained carrier material and the common parent base.")]};const u=new Set(l),d=i.complex.faces.map(_=>_.id).filter(_=>!u.has(_)).sort(),f=tv(i,s,r,a,t.operationId),p=Ci(f.complex);return p.length>0?{ok:!1,diagnostics:p}:{ok:!0,input:t,parent:i,child:s,complex:f.complex,childPlacement:uv(r.minimumX,a),sourceMap:{construction:"carrierHostedCompoundStair",operationId:t.operationId,materialComponentCount:1,parent:i.sourceMap,child:s.sourceMap,integratedFaces:f.faces,retainedParentFaceIds:d,replacement:{sourceRegion:r,replacedParentFaceIds:l},sharedEdges:{carrierHost:{kind:"sharedMaterialEdge",y:a},groundBridge:{kind:"sharedMaterialEdge",y:a}}},evidence:{sourceRegionContained:!0,childHostContainedInCarrier:!0,childBaseContainedInParentBase:!0,childReplacesCarrier:!0,groundBridgeRetained:!0}}}function ev(t){const e={operationId:`${t.compilation.input.operationId}:parent`,...t.compilation.input.parent},n={operationId:`${t.compilation.input.operationId}:child`,hostPlane:"wall",...t.compilation.input.child},i=Tc({input:e,complex:t.compilation.parent.complex,sourceMap:t.compilation.parent.sourceMap,sampleCount:t.sampleCount});if(!i.ok)return i;const s=_c({input:n,complex:t.compilation.child.complex,sourceMap:t.compilation.child.sourceMap,sampleCount:t.sampleCount});if(!s.ok)return s;const r=i.samples.map((o,c)=>{const l=s.samples[c],h=new Map([...l.transforms].map(([_,m])=>[_,Xt(t.compilation.childPlacement,m)])),u=dv(t.compilation,o.transforms,h),d=new Map(t.compilation.sourceMap.integratedFaces.map(_=>[_.faceId,_.source==="parent"?o.transforms.get(_.sourceFaceId):Xt(h.get(_.sourceFaceId),Ei(t.compilation.childPlacement))])),p=Wu(t.compilation.complex,d).residual;return{parameter:o.parameter,transforms:d,parentTransforms:o.transforms,childTransforms:h,carrierHostResidual:u.carrier,groundBridgeResidual:u.ground,maximumSharedMaterialResidual:p,grounded:u.ground<1e-8,childUsesCarrierHost:u.carrier<1e-8}}),a=r.find(o=>!o.grounded||!o.childUsesCarrierHost||o.maximumSharedMaterialResidual>=1e-8);return a?{ok:!1,diagnostics:[vo(t.compilation.input.operationId,`Compound stair shared material detached at parameter ${a.parameter}: carrier ${a.carrierHostResidual}, ground ${a.groundBridgeResidual}, retained ${a.maximumSharedMaterialResidual} at ${cv(t.compilation.complex,a.transforms).edgeId}.`)]}:{ok:!0,samples:r}}function tv(t,e,n,i,s){const r=[n.minimumX,i,0],a=xo(t.complex),o=xo(e.complex),c=Wl([...t.complex.vertices.map(v=>v.position[0]),...e.complex.vertices.map(v=>v.position[0]+r[0])]),l=Wl([...t.complex.vertices.map(v=>v.position[1]),...e.complex.vertices.map(v=>v.position[1]+r[1])]),h=[],u=[],d=[],f=[];for(let v=0;v<l.length;v+=1)for(let E=0;E<c.length;E+=1)h.push({id:vs(E,v),position:[c[E],l[v]]});for(let v=0;v<l.length-1;v+=1)for(let E=0;E<c.length-1;E+=1){const y=[(c[E]+c[E+1])/2,(l[v]+l[v+1])/2],T=sv(y,n),M=T?"child":"parent",b=T?[y[0]-r[0],y[1]-r[1]]:y,P=rv(T?o:a,b);if(!P)throw new Error(`Integrated compound cell ${E}:${v} has no ${M} source face.`);const C=`compound-face:${v}:${E}`,I=["bottom","right","top","left"].map(X=>`compound-he:${v}:${E}:${X}`);d.push({id:I[0],origin:vs(E,v),next:I[1],edge:"pending",face:C},{id:I[1],origin:vs(E+1,v),next:I[2],edge:"pending",face:C},{id:I[2],origin:vs(E+1,v+1),next:I[3],edge:"pending",face:C},{id:I[3],origin:vs(E,v+1),next:I[0],edge:"pending",face:C}),u.push({id:C,boundary:I[0],holes:[]}),f.push({faceId:C,source:M,sourceFaceId:P})}const p=[],_=[],m=new Map(d.map(v=>[v.id,v])),g=new Map(f.map(v=>[v.faceId,v])),A=(v,E)=>{for(const y of v)m.get(y).edge=E.id;v.length===2&&(m.get(v[0]).twin=v[1],m.get(v[1]).twin=v[0]),p.push(E)},w=(v,E,y,T)=>{if(v.length===1){const D=[v[0]];A(D,{id:`boundary:${T}`,halfEdges:D,kind:"boundary"});return}const M=[v[0],v[1]],b=g.get(m.get(v[0]).face),P=g.get(m.get(v[1]).face);if(b.source!==P.source){A(M,{id:`seam:embedded:${T}`,halfEdges:M,kind:"flatSeam"});return}const C=b.source==="parent"?t.complex:e.complex,I=b.source==="parent"?E:[E[0]-r[0],E[1]-r[1]],X=b.source==="parent"?y:[y[0]-r[0],y[1]-r[1]],H=av(C,I,X);if(H.kind==="cutBank"){const D=`cut:compound:${T}`,$=`${D}:a`,B=`${D}:b`;A([v[0]],{id:$,halfEdges:[v[0]],kind:"cutBank",cutBank:{pair:D,bank:"a"}}),A([v[1]],{id:B,halfEdges:[v[1]],kind:"cutBank",cutBank:{pair:D,bank:"b"}}),_.push({id:D,banks:[$,B]});return}if(H.kind==="hinge"){A(M,{id:`hinge:compound:${T}`,halfEdges:M,kind:"hinge",hinge:H.hinge});return}A(M,{id:`seam:compound:${T}`,halfEdges:M,kind:"flatSeam"})};for(let v=0;v<l.length-1;v+=1)for(let E=0;E<c.length;E+=1){const y=[E>0?`compound-he:${v}:${E-1}:right`:void 0,E<c.length-1?`compound-he:${v}:${E}:left`:void 0].filter(T=>T!==void 0);w(y,[c[E],l[v]],[c[E],l[v+1]],`v:${v}:${E}`)}for(let v=0;v<l.length;v+=1)for(let E=0;E<c.length-1;E+=1){const y=[v>0?`compound-he:${v-1}:${E}:top`:void 0,v<l.length-1?`compound-he:${v}:${E}:bottom`:void 0].filter(T=>T!==void 0);w(y,[c[E],l[v]],[c[E+1],l[v]],`h:${v}:${E}`)}return{complex:{schemaVersion:1,vertices:h,halfEdges:d,edges:p,faces:u,cutPairs:_,materialComponents:[{id:`compound-material:${s}`,faces:u.map(v=>v.id)}]},faces:f}}function nv(t){const n=(t.parent.hostWidth-t.parent.stepCount*t.parent.stepRun)/2+t.childHostStepIndex*t.parent.stepRun+(t.parent.stepRun-t.child.hostWidth)/2,i=-t.parent.width;return{minimumX:Ps(n),maximumX:Ps(n+t.child.hostWidth),minimumY:Ps(i-t.child.hostFloorExtent),maximumY:Ps(i+t.child.hostWallExtent)}}function Ps(t){return Number(t.toFixed(12))}function iv(t,e,n){if(!Number.isInteger(t.childHostStepIndex)||t.childHostStepIndex<0||t.childHostStepIndex>=t.parent.stepCount||t.child.hostWidth>t.parent.stepRun+1e-10||e.minimumX<0||e.maximumX>t.parent.hostWidth||e.minimumY<-t.parent.hostFloorExtent||e.maximumY>t.parent.hostWallExtent)return!1;const i=(t.parent.hostWidth-t.parent.stepCount*t.parent.stepRun)/2,r=Math.min(t.parent.stepCount-1,Math.max(0,Math.floor((e.minimumX-i)/t.parent.stepRun+1e-8)))*t.parent.stepRise;return e.minimumY<n&&e.maximumY<=r+1e-10}function xo(t){const e=new Map(t.vertices.map(i=>[i.id,i.position])),n=new Map(t.halfEdges.map(i=>[i.id,i]));return new Map(t.faces.map(i=>{const s=[];let r=n.get(i.boundary);const a=r.id;do s.push(e.get(r.origin)),r=n.get(r.next);while(r.id!==a);return[i.id,{minimumX:Math.min(...s.map(o=>o[0])),maximumX:Math.max(...s.map(o=>o[0])),minimumY:Math.min(...s.map(o=>o[1])),maximumY:Math.max(...s.map(o=>o[1]))}]}))}function Wl(t){return[...new Set(t.map(e=>Ps(e)))].sort((e,n)=>e-n)}function vs(t,e){return`compound-v:${e}:${t}`}function sv(t,e){return t[0]>e.minimumX&&t[0]<e.maximumX&&t[1]>e.minimumY&&t[1]<e.maximumY}function rv(t,e){return[...t].find(([,n])=>e[0]>n.minimumX-1e-10&&e[0]<n.maximumX+1e-10&&e[1]>n.minimumY-1e-10&&e[1]<n.maximumY+1e-10)?.[0]}function av(t,e,n){const i=new Map(t.vertices.map(r=>[r.id,r.position])),s=new Map(t.halfEdges.map(r=>[r.id,r]));for(const r of t.edges)for(const a of r.halfEdges){const o=s.get(a),c=i.get(o.origin),l=i.get(s.get(o.next).origin);if(ov(e,n,c,l))return r}return{id:"implicit-flat-seam",halfEdges:["implicit"],kind:"flatSeam"}}function ov(t,e,n,i){const s=(e[0]-t[0])*(n[1]-t[1])-(e[1]-t[1])*(n[0]-t[0]),r=(e[0]-t[0])*(i[1]-t[1])-(e[1]-t[1])*(i[0]-t[0]);return Math.abs(s)>1e-9||Math.abs(r)>1e-9?!1:Math.min(n[0],i[0])<=t[0]+1e-10&&Math.max(n[0],i[0])>=e[0]-1e-10&&Math.min(n[1],i[1])<=t[1]+1e-10&&Math.max(n[1],i[1])>=e[1]-1e-10}function Wu(t,e){const n=new Map(t.vertices.map(a=>[a.id,a.position])),i=new Map(t.halfEdges.map(a=>[a.id,a]));let s=0,r;for(const a of t.edges.filter(o=>o.halfEdges.length===2)){const o=i.get(a.halfEdges[0]),c=i.get(a.halfEdges[1]),l=i.get(o.next),h=i.get(c.next),u=(f,p)=>{const _=n.get(p);return gt(e.get(f.face),[_[0],_[1],0])},d=Math.max(ta(u(o,o.origin),u(c,h.origin)),ta(u(o,l.origin),u(c,c.origin)));d>s&&(s=d,r=a.id)}return{residual:s,...r===void 0?{}:{edgeId:r}}}function cv(t,e){return Wu(t,e)}function lv(t,e){return Math.min(t.maximumX,e.maximumX)-Math.max(t.minimumX,e.minimumX)>1e-10&&Math.min(t.maximumY,e.maximumY)-Math.max(t.minimumY,e.minimumY)>1e-10}function dv(t,e,n){const i=t.parent.sourceMap.faces.find(u=>u.role==="carrier"&&t.sourceMap.replacement.replacedParentFaceIds.includes(u.faceId)),s=t.parent.sourceMap.faces.find(u=>u.role==="base"&&t.sourceMap.replacement.replacedParentFaceIds.includes(u.faceId)),r=t.child.sourceMap.faces.find(u=>u.faceId.startsWith("host-face:")&&u.faceId.includes(":0")),a=t.child.sourceMap.faces.find(u=>u.faceId.startsWith("host-face:0:"));if(!i||!s||!r||!a)return{carrier:Number.POSITIVE_INFINITY,ground:Number.POSITIVE_INFINITY};const o=-t.input.parent.width,c=t.sourceMap.replacement.sourceRegion.minimumX,l=[0,0,0],h=[c,o,0];return{carrier:ta(gt(e.get(i.faceId),h),gt(n.get(r.faceId),l)),ground:ta(gt(e.get(s.faceId),h),gt(n.get(a.faceId),l))}}function uv(t,e){return{...tn(),translation:[t,e,0]}}function ta(t,e){return Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2])}function vo(t,e){return{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}const wc="185",ts={ROTATE:0,DOLLY:1,PAN:2},ji={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},hv=0,$l=1,fv=2,kr=1,pv=2,Is=3,ri=0,qt=1,Sn=2,kn=0,ns=1,Xl=2,ql=3,Yl=4,mv=5,gi=100,gv=101,_v=102,xv=103,vv=104,Mv=200,yv=201,Sv=202,Ev=203,Mo=204,yo=205,bv=206,Av=207,Tv=208,wv=209,Rv=210,Cv=211,Pv=212,Iv=213,Lv=214,So=0,Eo=1,bo=2,rs=3,Ao=4,To=5,wo=6,Ro=7,$u=0,Dv=1,Nv=2,An=0,Xu=1,qu=2,Yu=3,Ku=4,Zu=5,Ju=6,ju=7,Qu=300,Ti=301,as=302,Ta=303,wa=304,fa=306,Co=1e3,Un=1001,Po=1002,It=1003,Fv=1004,ar=1005,Ut=1006,Ra=1007,vi=1008,en=1009,eh=1010,th=1011,Bs=1012,Rc=1013,Rn=1014,En=1015,Vn=1016,Cc=1017,Pc=1018,Vs=1020,nh=35902,ih=35899,sh=1021,rh=1022,fn=1023,zn=1026,Mi=1027,ah=1028,Ic=1029,wi=1030,Lc=1031,Dc=1033,Br=33776,Vr=33777,zr=33778,Hr=33779,Io=35840,Lo=35841,Do=35842,No=35843,Fo=36196,Uo=37492,Oo=37496,ko=37488,Bo=37489,na=37490,Vo=37491,zo=37808,Ho=37809,Go=37810,Wo=37811,$o=37812,Xo=37813,qo=37814,Yo=37815,Ko=37816,Zo=37817,Jo=37818,jo=37819,Qo=37820,ec=37821,tc=36492,nc=36494,ic=36495,sc=36283,rc=36284,ia=36285,ac=36286,Uv=3200,oc=0,Ov=1,ei="",jt="srgb",sa="srgb-linear",ra="linear",je="srgb",Oi=7680,Kl=519,kv=512,Bv=513,Vv=514,Nc=515,zv=516,Hv=517,Fc=518,Gv=519,Zl=35044,Jl="300 es",bn=2e3,zs=2001;function Wv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function aa(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function $v(){const t=aa("canvas");return t.style.display="block",t}const jl={};function Ql(...t){const e="THREE."+t.shift();console.log(e,...t)}function oh(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Le(...t){t=oh(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function qe(...t){t=oh(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function is(...t){const e=t.join(" ");e in jl||(jl[e]=!0,Le(...t))}function Xv(t,e,n){return new Promise(function(i,s){function r(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:s();break;case t.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}const qv={[So]:Eo,[bo]:wo,[Ao]:Ro,[rs]:To,[Eo]:So,[wo]:bo,[Ro]:Ao,[To]:rs};class ci{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ed=1234567;const Us=Math.PI/180,Hs=180/Math.PI;function us(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Dt[t&255]+Dt[t>>8&255]+Dt[t>>16&255]+Dt[t>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[n&63|128]+Dt[n>>8&255]+"-"+Dt[n>>16&255]+Dt[n>>24&255]+Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]).toLowerCase()}function Ge(t,e,n){return Math.max(e,Math.min(n,t))}function Uc(t,e){return(t%e+e)%e}function Yv(t,e,n,i,s){return i+(t-e)*(s-i)/(n-e)}function Kv(t,e,n){return t!==e?(n-t)/(e-t):0}function Os(t,e,n){return(1-n)*t+n*e}function Zv(t,e,n,i){return Os(t,e,1-Math.exp(-n*i))}function Jv(t,e=1){return e-Math.abs(Uc(t,e*2)-e)}function jv(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function Qv(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function eM(t,e){return t+Math.floor(Math.random()*(e-t+1))}function tM(t,e){return t+Math.random()*(e-t)}function nM(t){return t*(.5-Math.random())}function iM(t){t!==void 0&&(ed=t);let e=ed+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function sM(t){return t*Us}function rM(t){return t*Hs}function aM(t){return(t&t-1)===0&&t!==0}function oM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function cM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function lM(t,e,n,i,s){const r=Math.cos,a=Math.sin,o=r(n/2),c=a(n/2),l=r((e+i)/2),h=a((e+i)/2),u=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),p=a((i-e)/2);switch(s){case"XYX":t.set(o*h,c*u,c*d,o*l);break;case"YZY":t.set(c*d,o*h,c*u,o*l);break;case"ZXZ":t.set(c*u,c*d,o*h,o*l);break;case"XZX":t.set(o*h,c*p,c*f,o*l);break;case"YXY":t.set(c*f,o*h,c*p,o*l);break;case"ZYZ":t.set(c*p,c*f,o*h,o*l);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ji(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ot(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ch={DEG2RAD:Us,RAD2DEG:Hs,generateUUID:us,clamp:Ge,euclideanModulo:Uc,mapLinear:Yv,inverseLerp:Kv,lerp:Os,damp:Zv,pingpong:Jv,smoothstep:jv,smootherstep:Qv,randInt:eM,randFloat:tM,randFloatSpread:nM,seededRandom:iM,degToRad:sM,radToDeg:rM,isPowerOfTwo:aM,ceilPowerOfTwo:oM,floorPowerOfTwo:cM,setQuaternionFromProperEuler:lM,normalize:Ot,denormalize:Ji},Gc=class Gc{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Ge(this.x,e.x,n.x),this.y=Ge(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Ge(this.x,e,n),this.y=Ge(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),s=Math.sin(n),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Gc.prototype.isVector2=!0;let Fe=Gc;class ai{constructor(e=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=s}static slerpFlat(e,n,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(u!==_||c!==d||l!==f||h!==p){let m=c*d+l*f+h*p+u*_;m<0&&(d=-d,f=-f,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const A=Math.acos(m),w=Math.sin(A);g=Math.sin(g*A)/w,o=Math.sin(o*A)/w,c=c*g+d*o,l=l*g+f*o,h=h*g+p*o,u=u*g+_*o}else{c=c*g+d*o,l=l*g+f*o,h=h*g+p*o,u=u*g+_*o;const A=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=A,l*=A,h*=A,u*=A}}e[n]=c,e[n+1]=l,e[n+2]=h,e[n+3]=u}static multiplyQuaternionsFlat(e,n,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[n]=o*p+h*u+c*f-l*d,e[n+1]=c*p+h*d+l*u-o*f,e[n+2]=l*p+h*f+o*d-c*u,e[n+3]=h*p-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,s){return this._x=e,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),d=c(i/2),f=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"YZX":this._x=d*h*u+l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u-d*f*p;break;case"XZY":this._x=d*h*u-l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u+d*f*p;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],s=n[4],r=n[8],a=n[1],o=n[5],c=n[9],l=n[2],h=n[6],u=n[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ge(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,n/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,s=e._y,r=e._z,a=e._w,o=n._x,c=n._y,l=n._z,h=n._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,n){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-n;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,n=Math.sin(n*l)/h,this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+a*n,this._onChangeCallback()}else this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+a*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(n),r*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Wc=class Wc{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(td.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(td.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6]*s,this.y=r[1]*n+r[4]*i+r[7]*s,this.z=r[2]*n+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*n+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*n+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*n+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*i),h=2*(o*n-r*s),u=2*(r*i-a*n);return this.x=n+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[4]*i+r[8]*s,this.y=r[1]*n+r[5]*i+r[9]*s,this.z=r[2]*n+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Ge(this.x,e.x,n.x),this.y=Ge(this.y,e.y,n.y),this.z=Ge(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Ge(this.x,e,n),this.y=Ge(this.y,e,n),this.z=Ge(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,s=e.y,r=e.z,a=n.x,o=n.y,c=n.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ca.copy(this).projectOnVector(e),this.sub(Ca)}reflect(e){return this.sub(Ca.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return n*n+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const s=Math.sin(n)*e;return this.x=s*Math.sin(i),this.y=Math.cos(n)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Wc.prototype.isVector3=!0;let U=Wc;const Ca=new U,td=new ai,$c=class $c{constructor(e,n,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,a,o,c,l)}set(e,n,i,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=n,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],p=i[8],_=s[0],m=s[3],g=s[6],A=s[1],w=s[4],v=s[7],E=s[2],y=s[5],T=s[8];return r[0]=a*_+o*A+c*E,r[3]=a*m+o*w+c*y,r[6]=a*g+o*v+c*T,r[1]=l*_+h*A+u*E,r[4]=l*m+h*w+u*y,r[7]=l*g+h*v+u*T,r[2]=d*_+f*A+p*E,r[5]=d*m+f*w+p*y,r[8]=d*g+f*v+p*T,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return n*a*h-n*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,p=n*u+i*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(s*l-h*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(h*n-s*c)*_,e[5]=(s*r-o*n)*_,e[6]=f*_,e[7]=(i*c-l*n)*_,e[8]=(a*n-i*r)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+n,0,0,1),this}scale(e,n){return is("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Pa.makeScale(e,n)),this}rotate(e){return is("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Pa.makeRotation(-e)),this}translate(e,n){return is("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Pa.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};$c.prototype.isMatrix3=!0;let Ue=$c;const Pa=new Ue,nd=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),id=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function dM(){const t={enabled:!0,workingColorSpace:sa,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===je&&(s.r=Bn(s.r),s.g=Bn(s.g),s.b=Bn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===je&&(s.r=ss(s.r),s.g=ss(s.g),s.b=ss(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ei?ra:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return is("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return is("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[sa]:{primaries:e,whitePoint:i,transfer:ra,toXYZ:nd,fromXYZ:id,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:jt},outputColorSpaceConfig:{drawingBufferColorSpace:jt}},[jt]:{primaries:e,whitePoint:i,transfer:je,toXYZ:nd,fromXYZ:id,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:jt}}}),t}const $e=dM();function Bn(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function ss(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let ki;class uM{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ki===void 0&&(ki=aa("canvas")),ki.width=e.width,ki.height=e.height;const s=ki.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=ki}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=aa("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Bn(r[a]/255)*255;return i.putImageData(s,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Bn(n[i]/255)*255):n[i]=Bn(n[i]);return{data:n,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let hM=0;class Oc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hM++}),this.uuid=us(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ia(s[a].image)):r.push(Ia(s[a]))}else r=Ia(s);i.url=r}return n||(e.images[this.uuid]=i),i}}function Ia(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?uM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let fM=0;const La=new U;class Bt extends ci{constructor(e=Bt.DEFAULT_IMAGE,n=Bt.DEFAULT_MAPPING,i=Un,s=Un,r=Ut,a=vi,o=fn,c=en,l=Bt.DEFAULT_ANISOTROPY,h=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fM++}),this.uuid=us(),this.name="",this.source=new Oc(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(La).x}get height(){return this.source.getSize(La).y}get depth(){return this.source.getSize(La).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Le(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Le(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Qu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Co:e.x=e.x-Math.floor(e.x);break;case Un:e.x=e.x<0?0:1;break;case Po:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Co:e.y=e.y-Math.floor(e.y);break;case Un:e.y=e.y<0?0:1;break;case Po:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Qu;Bt.DEFAULT_ANISOTROPY=1;const Xc=class Xc{constructor(e=0,n=0,i=0,s=1){this.x=e,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,s){return this.x=e,this.y=n,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*n+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*n+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*n+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,s,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],p=c[9],_=c[2],m=c[6],g=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const w=(l+1)/2,v=(f+1)/2,E=(g+1)/2,y=(h+d)/4,T=(u+_)/4,M=(p+m)/4;return w>v&&w>E?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=y/i,r=T/i):v>E?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=y/s,r=M/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=T/r,s=M/r),this.set(i,s,r,n),this}let A=Math.sqrt((m-p)*(m-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(A)<.001&&(A=1),this.x=(m-p)/A,this.y=(u-_)/A,this.z=(d-h)/A,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Ge(this.x,e.x,n.x),this.y=Ge(this.y,e.y,n.y),this.z=Ge(this.z,e.z,n.z),this.w=Ge(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Ge(this.x,e,n),this.y=Ge(this.y,e,n),this.z=Ge(this.z,e,n),this.w=Ge(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Xc.prototype.isVector4=!0;let dt=Xc;class pM extends ci{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new dt(0,0,e,n),this.scissorTest=!1,this.viewport=new dt(0,0,e,n),this.textures=[];const s={width:e,height:n,depth:i.depth},r=new Bt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:Ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const s=Object.assign({},e.textures[n].image);this.textures[n].source=new Oc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends pM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class lh extends Bt{constructor(e=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class mM extends Bt{constructor(e=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const la=class la{constructor(e,n,i,s,r,a,o,c,l,h,u,d,f,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,a,o,c,l,h,u,d,f,p,_,m)}set(e,n,i,s,r,a,o,c,l,h,u,d,f,p,_,m){const g=this.elements;return g[0]=e,g[4]=n,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new la().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,s=1/Bi.setFromMatrixColumn(e,0).length(),r=1/Bi.setFromMatrixColumn(e,1).length(),a=1/Bi.setFromMatrixColumn(e,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*r,n[5]=i[5]*r,n[6]=i[6]*r,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,p=o*h,_=o*u;n[0]=c*h,n[4]=-c*u,n[8]=l,n[1]=f+p*l,n[5]=d-_*l,n[9]=-o*c,n[2]=_-d*l,n[6]=p+f*l,n[10]=a*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,p=l*h,_=l*u;n[0]=d+_*o,n[4]=p*o-f,n[8]=a*l,n[1]=a*u,n[5]=a*h,n[9]=-o,n[2]=f*o-p,n[6]=_+d*o,n[10]=a*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,p=l*h,_=l*u;n[0]=d-_*o,n[4]=-a*u,n[8]=p+f*o,n[1]=f+p*o,n[5]=a*h,n[9]=_-d*o,n[2]=-a*l,n[6]=o,n[10]=a*c}else if(e.order==="ZYX"){const d=a*h,f=a*u,p=o*h,_=o*u;n[0]=c*h,n[4]=p*l-f,n[8]=d*l+_,n[1]=c*u,n[5]=_*l+d,n[9]=f*l-p,n[2]=-l,n[6]=o*c,n[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,p=o*c,_=o*l;n[0]=c*h,n[4]=_-d*u,n[8]=p*u+f,n[1]=u,n[5]=a*h,n[9]=-o*h,n[2]=-l*h,n[6]=f*u+p,n[10]=d-_*u}else if(e.order==="XZY"){const d=a*c,f=a*l,p=o*c,_=o*l;n[0]=c*h,n[4]=-u,n[8]=l*h,n[1]=d*u+_,n[5]=a*h,n[9]=f*u-p,n[2]=p*u-f,n[6]=o*h,n[10]=_*u+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gM,e,_M)}lookAt(e,n,i){const s=this.elements;return Kt.subVectors(e,n),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),qn.crossVectors(i,Kt),qn.lengthSq()===0&&(Math.abs(i.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),qn.crossVectors(i,Kt)),qn.normalize(),or.crossVectors(Kt,qn),s[0]=qn.x,s[4]=or.x,s[8]=Kt.x,s[1]=qn.y,s[5]=or.y,s[9]=Kt.y,s[2]=qn.z,s[6]=or.z,s[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],p=i[2],_=i[6],m=i[10],g=i[14],A=i[3],w=i[7],v=i[11],E=i[15],y=s[0],T=s[4],M=s[8],b=s[12],P=s[1],C=s[5],I=s[9],X=s[13],H=s[2],D=s[6],$=s[10],B=s[14],q=s[3],te=s[7],re=s[11],ce=s[15];return r[0]=a*y+o*P+c*H+l*q,r[4]=a*T+o*C+c*D+l*te,r[8]=a*M+o*I+c*$+l*re,r[12]=a*b+o*X+c*B+l*ce,r[1]=h*y+u*P+d*H+f*q,r[5]=h*T+u*C+d*D+f*te,r[9]=h*M+u*I+d*$+f*re,r[13]=h*b+u*X+d*B+f*ce,r[2]=p*y+_*P+m*H+g*q,r[6]=p*T+_*C+m*D+g*te,r[10]=p*M+_*I+m*$+g*re,r[14]=p*b+_*X+m*B+g*ce,r[3]=A*y+w*P+v*H+E*q,r[7]=A*T+w*C+v*D+E*te,r[11]=A*M+w*I+v*$+E*re,r[15]=A*b+w*X+v*B+E*ce,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],_=e[7],m=e[11],g=e[15],A=c*f-l*d,w=o*f-l*u,v=o*d-c*u,E=a*f-l*h,y=a*d-c*h,T=a*u-o*h;return n*(_*A-m*w+g*v)-i*(p*A-m*E+g*y)+s*(p*w-_*E+g*T)-r*(p*v-_*y+m*T)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return n*(a*h-o*l)-i*(r*h-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=n,s[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],_=e[13],m=e[14],g=e[15],A=n*o-i*a,w=n*c-s*a,v=n*l-r*a,E=i*c-s*o,y=i*l-r*o,T=s*l-r*c,M=h*_-u*p,b=h*m-d*p,P=h*g-f*p,C=u*m-d*_,I=u*g-f*_,X=d*g-f*m,H=A*X-w*I+v*C+E*P-y*b+T*M;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/H;return e[0]=(o*X-c*I+l*C)*D,e[1]=(s*I-i*X-r*C)*D,e[2]=(_*T-m*y+g*E)*D,e[3]=(d*y-u*T-f*E)*D,e[4]=(c*P-a*X-l*b)*D,e[5]=(n*X-s*P+r*b)*D,e[6]=(m*v-p*T-g*w)*D,e[7]=(h*T-d*v+f*w)*D,e[8]=(a*I-o*P+l*M)*D,e[9]=(i*P-n*I-r*M)*D,e[10]=(p*y-_*v+g*A)*D,e[11]=(u*v-h*y-f*A)*D,e[12]=(o*b-a*C-c*M)*D,e[13]=(n*C-i*b+s*M)*D,e[14]=(_*w-p*E-m*A)*D,e[15]=(h*E-u*w+d*A)*D,this}scale(e){const n=this.elements,i=e.x,s=e.y,r=e.z;return n[0]*=i,n[4]*=s,n[8]*=r,n[1]*=i,n[5]*=s,n[9]*=r,n[2]*=i,n[6]*=s,n[10]*=r,n[3]*=i,n[7]*=s,n[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),s=Math.sin(n),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,n,s,1,0,0,0,0,1),this}compose(e,n,i){const s=this.elements,r=n._x,a=n._y,o=n._z,c=n._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,p=r*u,_=a*h,m=a*u,g=o*u,A=c*l,w=c*h,v=c*u,E=i.x,y=i.y,T=i.z;return s[0]=(1-(_+g))*E,s[1]=(f+v)*E,s[2]=(p-w)*E,s[3]=0,s[4]=(f-v)*y,s[5]=(1-(d+g))*y,s[6]=(m+A)*y,s[7]=0,s[8]=(p+w)*T,s[9]=(m-A)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,n,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),n.identity(),this;let a=Bi.set(s[0],s[1],s[2]).length();const o=Bi.set(s[4],s[5],s[6]).length(),c=Bi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),cn.copy(this);const l=1/a,h=1/o,u=1/c;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=u,cn.elements[9]*=u,cn.elements[10]*=u,n.setFromRotationMatrix(cn),i.x=a,i.y=o,i.z=c,this}makePerspective(e,n,i,s,r,a,o=bn,c=!1){const l=this.elements,h=2*r/(n-e),u=2*r/(i-s),d=(n+e)/(n-e),f=(i+s)/(i-s);let p,_;if(c)p=r/(a-r),_=a*r/(a-r);else if(o===bn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===zs)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,s,r,a,o=bn,c=!1){const l=this.elements,h=2/(n-e),u=2/(i-s),d=-(n+e)/(n-e),f=-(i+s)/(i-s);let p,_;if(c)p=1/(a-r),_=a/(a-r);else if(o===bn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===zs)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};la.prototype.isMatrix4=!0;let lt=la;const Bi=new U,cn=new lt,gM=new U(0,0,0),_M=new U(1,1,1),qn=new U,or=new U,Kt=new U,sd=new lt,rd=new ai;class oi{constructor(e=0,n=0,i=0,s=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,s=this._order){return this._x=e,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(n){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ge(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return sd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sd,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return rd.setFromEuler(this),this.setFromQuaternion(rd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class dh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let xM=0;const ad=new U,Vi=new ai,In=new lt,cr=new U,Ms=new U,vM=new U,MM=new ai,od=new U(1,0,0),cd=new U(0,1,0),ld=new U(0,0,1),dd={type:"added"},yM={type:"removed"},zi={type:"childadded",child:null},Da={type:"childremoved",child:null};class Ct extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xM++}),this.uuid=us(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new U,n=new oi,i=new ai,s=new U(1,1,1);function r(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new lt},normalMatrix:{value:new Ue}}),this.matrix=new lt,this.matrixWorld=new lt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Vi.setFromAxisAngle(e,n),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,n){return Vi.setFromAxisAngle(e,n),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(od,e)}rotateY(e){return this.rotateOnAxis(cd,e)}rotateZ(e){return this.rotateOnAxis(ld,e)}translateOnAxis(e,n){return ad.copy(e).applyQuaternion(this.quaternion),this.position.add(ad.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(od,e)}translateY(e){return this.translateOnAxis(cd,e)}translateZ(e){return this.translateOnAxis(ld,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?cr.copy(e):cr.set(e,n,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(Ms,cr,this.up):In.lookAt(cr,Ms,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Vi.setFromRotationMatrix(In),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(qe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dd),zi.child=e,this.dispatchEvent(zi),zi.child=null):qe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(yM),Da.child=e,this.dispatchEvent(Da),Da.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dd),zi.child=e,this.dispatchEvent(zi),zi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,e,vM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,MM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=n-r[0]*n-r[4]*i-r[8]*s,r[13]+=i-r[1]*n-r[5]*i-r[9]*s,r[14]+=s-r[2]*n-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(n){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new U(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ls extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const SM={type:"move"};class Na{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ls,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ls,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ls,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const m=n.getJointPose(_,i),g=this._getHandJoint(l,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=n.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=n.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(SM)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Ls;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},lr={h:0,s:0,l:0};function Fa(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class We{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,n),this}setRGB(e,n,i,s=$e.workingColorSpace){return this.r=e,this.g=n,this.b=i,$e.colorSpaceToWorking(this,s),this}setHSL(e,n,i,s=$e.workingColorSpace){if(e=Uc(e,1),n=Ge(n,0,1),i=Ge(i,0,1),n===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+n):i+n-i*n,a=2*i-r;this.r=Fa(a,r,e+1/3),this.g=Fa(a,r,e),this.b=Fa(a,r,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,n=jt){function i(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,n);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,n);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,n);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(r,16),n);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=jt){const i=uh[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=jt){return $e.workingToColorSpace(Nt.copy(this),e),Math.round(Ge(Nt.r*255,0,255))*65536+Math.round(Ge(Nt.g*255,0,255))*256+Math.round(Ge(Nt.b*255,0,255))}getHexString(e=jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=$e.workingColorSpace){$e.workingToColorSpace(Nt.copy(this),n);const i=Nt.r,s=Nt.g,r=Nt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,n=$e.workingColorSpace){return $e.workingToColorSpace(Nt.copy(this),n),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=jt){$e.workingToColorSpace(Nt.copy(this),e);const n=Nt.r,i=Nt.g,s=Nt.b;return e!==jt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,n,i){return this.getHSL(Yn),this.setHSL(Yn.h+e,Yn.s+n,Yn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Yn),e.getHSL(lr);const i=Os(Yn.h,lr.h,n),s=Os(Yn.s,lr.s,n),r=Os(Yn.l,lr.l,n);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*n+r[3]*i+r[6]*s,this.g=r[1]*n+r[4]*i+r[7]*s,this.b=r[2]*n+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new We;We.NAMES=uh;class kc{constructor(e,n=25e-5){this.isFogExp2=!0,this.name="",this.color=new We(e),this.density=n}clone(){return new kc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class EM extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const ln=new U,Ln=new U,Ua=new U,Dn=new U,Hi=new U,Gi=new U,ud=new U,Oa=new U,ka=new U,Ba=new U,Va=new dt,za=new dt,Ha=new dt;class hn{constructor(e=new U,n=new U,i=new U){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,s){s.subVectors(i,n),ln.subVectors(e,n),s.cross(ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,n,i,s,r){ln.subVectors(s,n),Ln.subVectors(i,n),Ua.subVectors(e,n);const a=ln.dot(ln),o=ln.dot(Ln),c=ln.dot(Ua),l=Ln.dot(Ln),h=Ln.dot(Ua),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,p=(a*h-o*c)*d;return r.set(1-f-p,p,f)}static containsPoint(e,n,i,s){return this.getBarycoord(e,n,i,s,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,n,i,s,r,a,o,c){return this.getBarycoord(e,n,i,s,Dn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Dn.x),c.addScaledVector(a,Dn.y),c.addScaledVector(o,Dn.z),c)}static getInterpolatedAttribute(e,n,i,s,r,a){return Va.setScalar(0),za.setScalar(0),Ha.setScalar(0),Va.fromBufferAttribute(e,n),za.fromBufferAttribute(e,i),Ha.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Va,r.x),a.addScaledVector(za,r.y),a.addScaledVector(Ha,r.z),a}static isFrontFacing(e,n,i,s){return ln.subVectors(i,n),Ln.subVectors(e,n),ln.cross(Ln).dot(s)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,s){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,n,i,s){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),ln.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return hn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,s,r){return hn.getInterpolation(e,this.a,this.b,this.c,n,i,s,r)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,s=this.b,r=this.c;let a,o;Hi.subVectors(s,i),Gi.subVectors(r,i),Oa.subVectors(e,i);const c=Hi.dot(Oa),l=Gi.dot(Oa);if(c<=0&&l<=0)return n.copy(i);ka.subVectors(e,s);const h=Hi.dot(ka),u=Gi.dot(ka);if(h>=0&&u<=h)return n.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),n.copy(i).addScaledVector(Hi,a);Ba.subVectors(e,r);const f=Hi.dot(Ba),p=Gi.dot(Ba);if(p>=0&&f<=p)return n.copy(r);const _=f*l-c*p;if(_<=0&&l>=0&&p<=0)return o=l/(l-p),n.copy(i).addScaledVector(Gi,o);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return ud.subVectors(r,s),o=(u-h)/(u-h+(f-p)),n.copy(s).addScaledVector(ud,o);const g=1/(m+_+d);return a=_*g,o=d*g,n.copy(i).addScaledVector(Hi,a).addScaledVector(Gi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class hs{constructor(e=new U(1/0,1/0,1/0),n=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(dn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(dn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=dn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(n===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,dn):dn.fromBufferAttribute(r,a),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),dr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),dr.copy(i.boundingBox)),dr.applyMatrix4(e.matrixWorld),this.union(dr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ys),ur.subVectors(this.max,ys),Wi.subVectors(e.a,ys),$i.subVectors(e.b,ys),Xi.subVectors(e.c,ys),Kn.subVectors($i,Wi),Zn.subVectors(Xi,$i),di.subVectors(Wi,Xi);let n=[0,-Kn.z,Kn.y,0,-Zn.z,Zn.y,0,-di.z,di.y,Kn.z,0,-Kn.x,Zn.z,0,-Zn.x,di.z,0,-di.x,-Kn.y,Kn.x,0,-Zn.y,Zn.x,0,-di.y,di.x,0];return!Ga(n,Wi,$i,Xi,ur)||(n=[1,0,0,0,1,0,0,0,1],!Ga(n,Wi,$i,Xi,ur))?!1:(hr.crossVectors(Kn,Zn),n=[hr.x,hr.y,hr.z],Ga(n,Wi,$i,Xi,ur))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Nn=[new U,new U,new U,new U,new U,new U,new U,new U],dn=new U,dr=new hs,Wi=new U,$i=new U,Xi=new U,Kn=new U,Zn=new U,di=new U,ys=new U,ur=new U,hr=new U,ui=new U;function Ga(t,e,n,i,s){for(let r=0,a=t.length-3;r<=a;r+=3){ui.fromArray(t,r);const o=s.x*Math.abs(ui.x)+s.y*Math.abs(ui.y)+s.z*Math.abs(ui.z),c=e.dot(ui),l=n.dot(ui),h=i.dot(ui);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const yt=new U,fr=new Fe;let bM=0;class wn extends ci{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bM++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Zl,this.updateRanges=[],this.gpuType=En,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=n.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)fr.fromBufferAttribute(this,n),fr.applyMatrix3(e),this.setXY(n,fr.x,fr.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.applyMatrix3(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.applyMatrix4(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.applyNormalMatrix(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.transformDirection(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Ji(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Ot(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ji(n,this.array)),n}setX(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ji(n,this.array)),n}setY(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ji(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ji(n,this.array)),n}setW(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Ot(n,this.array),i=Ot(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,s){return e*=this.itemSize,this.normalized&&(n=Ot(n,this.array),i=Ot(i,this.array),s=Ot(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,n,i,s,r){return e*=this.itemSize,this.normalized&&(n=Ot(n,this.array),i=Ot(i,this.array),s=Ot(s,this.array),r=Ot(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Zl&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class hh extends wn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class fh extends wn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Vt extends wn{constructor(e,n,i){super(new Float32Array(e),n,i)}}const AM=new hs,Ss=new U,Wa=new U;class qs{constructor(e=new U,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):AM.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ss.subVectors(e,this.center);const n=Ss.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Ss,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Wa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ss.copy(e.center).add(Wa)),this.expandByPoint(Ss.copy(e.center).sub(Wa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let TM=0;const sn=new lt,$a=new Ct,qi=new U,Zt=new hs,Es=new hs,wt=new U;class zt extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:TM++}),this.uuid=us(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Wv(e)?fh:hh)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ue().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return sn.makeRotationFromQuaternion(e),this.applyMatrix4(sn),this}rotateX(e){return sn.makeRotationX(e),this.applyMatrix4(sn),this}rotateY(e){return sn.makeRotationY(e),this.applyMatrix4(sn),this}rotateZ(e){return sn.makeRotationZ(e),this.applyMatrix4(sn),this}translate(e,n,i){return sn.makeTranslation(e,n,i),this.applyMatrix4(sn),this}scale(e,n,i){return sn.makeScale(e,n,i),this.applyMatrix4(sn),this}lookAt(e){return $a.lookAt(e),$a.updateMatrix(),this.applyMatrix4($a.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qi).negate(),this.translate(qi.x,qi.y,qi.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Vt(i,3))}else{const i=Math.min(e.length,n.count);for(let s=0;s<i;s++){const r=e[s];n.setXYZ(s,r.x,r.y,r.z||0)}e.length>n.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,s=n.length;i<s;i++){const r=n[i];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&qe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){qe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),n)for(let r=0,a=n.length;r<a;r++){const o=n[r];Es.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(Zt.min,Es.min),Zt.expandByPoint(wt),wt.addVectors(Zt.max,Es.max),Zt.expandByPoint(wt)):(Zt.expandByPoint(Es.min),Zt.expandByPoint(Es.max))}Zt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(wt));if(n)for(let r=0,a=n.length;r<a;r++){const o=n[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)wt.fromBufferAttribute(o,l),c&&(qi.fromBufferAttribute(e,l),wt.add(qi)),s=Math.max(s,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&qe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){qe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,s=n.normal,r=n.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new wn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let M=0;M<i.count;M++)o[M]=new U,c[M]=new U;const l=new U,h=new U,u=new U,d=new Fe,f=new Fe,p=new Fe,_=new U,m=new U;function g(M,b,P){l.fromBufferAttribute(i,M),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,P),d.fromBufferAttribute(r,M),f.fromBufferAttribute(r,b),p.fromBufferAttribute(r,P),h.sub(l),u.sub(l),f.sub(d),p.sub(d);const C=1/(f.x*p.y-p.x*f.y);isFinite(C)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(C),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(C),o[M].add(_),o[b].add(_),o[P].add(_),c[M].add(m),c[b].add(m),c[P].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let M=0,b=A.length;M<b;++M){const P=A[M],C=P.start,I=P.count;for(let X=C,H=C+I;X<H;X+=3)g(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const w=new U,v=new U,E=new U,y=new U;function T(M){E.fromBufferAttribute(s,M),y.copy(E);const b=o[M];w.copy(b),w.sub(E.multiplyScalar(E.dot(b))).normalize(),v.crossVectors(y,b);const C=v.dot(c[M])<0?-1:1;a.setXYZW(M,w.x,w.y,w.z,C)}for(let M=0,b=A.length;M<b;++M){const P=A[M],C=P.start,I=P.count;for(let X=C,H=C+I;X<H;X+=3)T(e.getX(X+0)),T(e.getX(X+1)),T(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new wn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,h=new U,u=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(n,p),r.fromBufferAttribute(n,_),a.fromBufferAttribute(n,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,p),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=n.count;d<f;d+=3)s.fromBufferAttribute(n,d+0),r.fromBufferAttribute(n,d+1),a.fromBufferAttribute(n,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)wt.fromBufferAttribute(e,n),wt.normalize(),e.setXYZ(n,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,p=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let g=0;g<h;g++)d[p++]=l[f++]}return new wn(d,h,u)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new zt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,i);n.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,i);c.push(f)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(n))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(n));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let wM=0;class Ii extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wM++}),this.uuid=us(),this.name="",this.type="Material",this.blending=ns,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mo,this.blendDst=yo,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Kl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Le(`Material: parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Le(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ns&&(i.blending=this.blending),this.side!==ri&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Mo&&(i.blendSrc=this.blendSrc),this.blendDst!==yo&&(i.blendDst=this.blendDst),this.blendEquation!==gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==rs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Kl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(n){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new We().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Fe().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Fe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const s=n.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=n[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Fn=new U,Xa=new U,pr=new U,Jn=new U,qa=new U,mr=new U,Ya=new U;class pa{constructor(e=new U,n=new U(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fn)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Fn.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Fn.copy(this.origin).addScaledVector(this.direction,n),Fn.distanceToSquared(e))}distanceSqToSegment(e,n,i,s){Xa.copy(e).add(n).multiplyScalar(.5),pr.copy(n).sub(e).normalize(),Jn.copy(this.origin).sub(Xa);const r=e.distanceTo(n)*.5,a=-this.direction.dot(pr),o=Jn.dot(this.direction),c=-Jn.dot(pr),l=Jn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,p;if(h>0)if(u=a*c-o,d=a*o-c,p=r*h,u>=0)if(d>=-p)if(d<=p){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-p?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=p?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Xa).addScaledVector(pr,d),f}intersectSphere(e,n){Fn.subVectors(e.center,this.origin);const i=Fn.dot(this.direction),s=Fn.dot(Fn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(e){return this.intersectBox(e,Fn)!==null}intersectTriangle(e,n,i,s,r){qa.subVectors(n,e),mr.subVectors(i,e),Ya.crossVectors(qa,mr);let a=this.direction.dot(Ya),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jn.subVectors(this.origin,e);const c=o*this.direction.dot(mr.crossVectors(Jn,mr));if(c<0)return null;const l=o*this.direction.dot(qa.cross(Jn));if(l<0||c+l>a)return null;const h=-o*Jn.dot(Ya);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ph extends Ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=$u,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const hd=new lt,hi=new pa,gr=new qs,fd=new U,_r=new U,xr=new U,vr=new U,Ka=new U,Mr=new U,pd=new U,yr=new U;class pn extends Ct{constructor(e=new zt,n=new ph){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,n){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Mr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(Ka.fromBufferAttribute(u,e),a?Mr.addScaledVector(Ka,h):Mr.addScaledVector(Ka.sub(n),h))}n.add(Mr)}return n}raycast(e,n){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),gr.copy(i.boundingSphere),gr.applyMatrix4(r),hi.copy(e.ray).recast(e.near),!(gr.containsPoint(hi.origin)===!1&&(hi.intersectSphere(gr,fd)===null||hi.origin.distanceToSquared(fd)>(e.far-e.near)**2))&&(hd.copy(r).invert(),hi.copy(e.ray).applyMatrix4(hd),!(i.boundingBox!==null&&hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,hi)))}_computeIntersections(e,n,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],A=Math.max(m.start,f.start),w=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let v=A,E=w;v<E;v+=3){const y=o.getX(v),T=o.getX(v+1),M=o.getX(v+2);s=Sr(this,g,e,i,l,h,u,y,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const A=o.getX(m),w=o.getX(m+1),v=o.getX(m+2);s=Sr(this,a,e,i,l,h,u,A,w,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],A=Math.max(m.start,f.start),w=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=A,E=w;v<E;v+=3){const y=v,T=v+1,M=v+2;s=Sr(this,g,e,i,l,h,u,y,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const A=m,w=m+1,v=m+2;s=Sr(this,a,e,i,l,h,u,A,w,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}}}function RM(t,e,n,i,s,r,a,o){let c;if(e.side===qt?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===ri,o),c===null)return null;yr.copy(o),yr.applyMatrix4(t.matrixWorld);const l=n.ray.origin.distanceTo(yr);return l<n.near||l>n.far?null:{distance:l,point:yr.clone(),object:t}}function Sr(t,e,n,i,s,r,a,o,c,l){t.getVertexPosition(o,_r),t.getVertexPosition(c,xr),t.getVertexPosition(l,vr);const h=RM(t,e,n,i,_r,xr,vr,pd);if(h){const u=new U;hn.getBarycoord(pd,_r,xr,vr,u),s&&(h.uv=hn.getInterpolatedAttribute(s,o,c,l,u,new Fe)),r&&(h.uv1=hn.getInterpolatedAttribute(r,o,c,l,u,new Fe)),a&&(h.normal=hn.getInterpolatedAttribute(a,o,c,l,u,new U),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new U,materialIndex:0};hn.getNormal(_r,xr,vr,d.normal),h.face=d,h.barycoord=u}return h}class CM extends Bt{constructor(e=null,n=1,i=1,s,r,a,o,c,l=It,h=It,u,d){super(null,a,o,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Za=new U,PM=new U,IM=new Ue;class Qn{constructor(e=new U(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,s){return this.normal.set(e,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const s=Za.subVectors(i,n).cross(PM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const s=e.delta(Za),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:n.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||IM.getNormalMatrix(e),s=this.coplanarPoint(Za).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new qs,LM=new Fe(.5,.5),Er=new U;class Bc{constructor(e=new Qn,n=new Qn,i=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,n,i,s,r,a]}set(e,n,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=bn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],_=r[9],m=r[10],g=r[11],A=r[12],w=r[13],v=r[14],E=r[15];if(s[0].setComponents(l-a,f-h,g-p,E-A).normalize(),s[1].setComponents(l+a,f+h,g+p,E+A).normalize(),s[2].setComponents(l+o,f+u,g+_,E+w).normalize(),s[3].setComponents(l-o,f-u,g-_,E-w).normalize(),i)s[4].setComponents(c,d,m,v).normalize(),s[5].setComponents(l-c,f-d,g-m,E-v).normalize();else if(s[4].setComponents(l-c,f-d,g-m,E-v).normalize(),n===bn)s[5].setComponents(l+c,f+d,g+m,E+v).normalize();else if(n===zs)s[5].setComponents(c,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),fi.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(e){fi.center.set(0,0,0);const n=LM.distanceTo(e.center);return fi.radius=.7071067811865476+n,fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(e){const n=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(n[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const s=n[i];if(Er.x=s.normal.x>0?e.max.x:e.min.x,Er.y=s.normal.y>0?e.max.y:e.min.y,Er.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Er)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ma extends Ii{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new We(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const oa=new U,ca=new U,md=new lt,bs=new pa,br=new qs,Ja=new U,gd=new U;class cc extends Ct{constructor(e=new zt,n=new ma){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let s=1,r=n.count;s<r;s++)oa.fromBufferAttribute(n,s-1),ca.fromBufferAttribute(n,s),i[s]=i[s-1],i[s]+=oa.distanceTo(ca);e.setAttribute("lineDistance",new Vt(i,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),br.copy(i.boundingSphere),br.applyMatrix4(s),br.radius+=r,e.ray.intersectsSphere(br)===!1)return;md.copy(s).invert(),bs.copy(e.ray).applyMatrix4(md);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=l){const g=h.getX(_),A=h.getX(_+1),w=Ar(this,e,bs,c,g,A,_);w&&n.push(w)}if(this.isLineLoop){const _=h.getX(p-1),m=h.getX(f),g=Ar(this,e,bs,c,_,m,p-1);g&&n.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=l){const g=Ar(this,e,bs,c,_,_+1,_);g&&n.push(g)}if(this.isLineLoop){const _=Ar(this,e,bs,c,p-1,f,p-1);_&&n.push(_)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ar(t,e,n,i,s,r,a){const o=t.geometry.attributes.position;if(oa.fromBufferAttribute(o,s),ca.fromBufferAttribute(o,r),n.distanceSqToSegment(oa,ca,Ja,gd)>i)return;Ja.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Ja);if(!(l<e.near||l>e.far))return{distance:l,point:gd.clone().applyMatrix4(t.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:t}}const _d=new U,xd=new U;class DM extends cc{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let s=0,r=n.count;s<r;s+=2)_d.fromBufferAttribute(n,s),xd.fromBufferAttribute(n,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+_d.distanceTo(xd);e.setAttribute("lineDistance",new Vt(i,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class mh extends Ii{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const vd=new lt,lc=new pa,Tr=new qs,wr=new U;class Md extends Ct{constructor(e=new zt,n=new mh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Tr.copy(i.boundingSphere),Tr.applyMatrix4(s),Tr.radius+=r,e.ray.intersectsSphere(Tr)===!1)return;vd.copy(s).invert(),lc.copy(e.ray).applyMatrix4(vd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,u=i.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=d,_=f;p<_;p++){const m=l.getX(p);wr.fromBufferAttribute(u,m),yd(wr,m,c,s,e,n,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,_=f;p<_;p++)wr.fromBufferAttribute(u,p),yd(wr,p,c,s,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function yd(t,e,n,i,s,r,a){const o=lc.distanceSqToPoint(t);if(o<n){const c=new U;lc.closestPointToPoint(t,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class gh extends Bt{constructor(e=[],n=Ti,i,s,r,a,o,c,l,h){super(e,n,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class os extends Bt{constructor(e,n,i=Rn,s,r,a,o=It,c=It,l,h=zn,u=1){if(h!==zn&&h!==Mi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:n,depth:u};super(d,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Oc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class NM extends os{constructor(e,n=Rn,i=Ti,s,r,a=It,o=It,c,l=zn){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,n,i,s,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class _h extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ys extends zt{constructor(e=1,n=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,i,n,e,a,r,0),p("z","y","x",1,-1,i,n,-e,a,r,1),p("x","z","y",1,1,e,i,n,s,a,2),p("x","z","y",1,-1,e,i,-n,s,a,3),p("x","y","z",1,-1,e,n,i,s,r,4),p("x","y","z",-1,-1,e,n,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Vt(l,3)),this.setAttribute("normal",new Vt(h,3)),this.setAttribute("uv",new Vt(u,2));function p(_,m,g,A,w,v,E,y,T,M,b){const P=v/T,C=E/M,I=v/2,X=E/2,H=y/2,D=T+1,$=M+1;let B=0,q=0;const te=new U;for(let re=0;re<$;re++){const ce=re*C-X;for(let ae=0;ae<D;ae++){const ze=ae*P-I;te[_]=ze*A,te[m]=ce*w,te[g]=H,l.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[g]=y>0?1:-1,h.push(te.x,te.y,te.z),u.push(ae/T),u.push(1-re/M),B+=1}}for(let re=0;re<M;re++)for(let ce=0;ce<T;ce++){const ae=d+ce+D*re,ze=d+ce+D*(re+1),Ze=d+(ce+1)+D*(re+1),He=d+(ce+1)+D*re;c.push(ae,ze,He),c.push(ze,Ze,He),q+=6}o.addGroup(f,q,b),f+=q,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ys(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function FM(t,e,n=2){const i=e&&e.length,s=i?e[0]*n:t.length;let r=xh(t,0,s,n,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=VM(t,e,r,n)),t.length>80*n){o=t[0],c=t[1];let h=o,u=c;for(let d=n;d<s;d+=n){const f=t[d],p=t[d+1];f<o&&(o=f),p<c&&(c=p),f>h&&(h=f),p>u&&(u=p)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return Gs(r,a,n,o,c,l,0),a}function xh(t,e,n,i,s){let r;if(s===JM(t,e,n,i)>0)for(let a=e;a<n;a+=i)r=Sd(a/i|0,t[a],t[a+1],r);else for(let a=n-i;a>=e;a-=i)r=Sd(a/i|0,t[a],t[a+1],r);return r&&cs(r,r.next)&&($s(r),r=r.next),r}function Ri(t,e){if(!t)return t;e||(e=t);let n=t,i;do if(i=!1,!n.steiner&&(cs(n,n.next)||ut(n.prev,n,n.next)===0)){if($s(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function Gs(t,e,n,i,s,r,a){if(!t)return;!a&&r&&$M(t,i,s,r);let o=t;for(;t.prev!==t.next;){const c=t.prev,l=t.next;if(r?OM(t,i,s,r):UM(t)){e.push(c.i,t.i,l.i),$s(t),t=l.next,o=l.next;continue}if(t=l,t===o){a?a===1?(t=kM(Ri(t),e),Gs(t,e,n,i,s,r,2)):a===2&&BM(t,e,n,i,s,r):Gs(Ri(t),e,n,i,s,r,1);break}}}function UM(t){const e=t.prev,n=t,i=t.next;if(ut(e,n,i)>=0)return!1;const s=e.x,r=n.x,a=i.x,o=e.y,c=n.y,l=i.y,h=Math.min(s,r,a),u=Math.min(o,c,l),d=Math.max(s,r,a),f=Math.max(o,c,l);let p=i.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Ds(s,o,r,c,a,l,p.x,p.y)&&ut(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function OM(t,e,n,i){const s=t.prev,r=t,a=t.next;if(ut(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,c,l),p=Math.min(h,u,d),_=Math.max(o,c,l),m=Math.max(h,u,d),g=dc(f,p,e,n,i),A=dc(_,m,e,n,i);let w=t.prevZ,v=t.nextZ;for(;w&&w.z>=g&&v&&v.z<=A;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==s&&w!==a&&Ds(o,h,c,u,l,d,w.x,w.y)&&ut(w.prev,w,w.next)>=0||(w=w.prevZ,v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&Ds(o,h,c,u,l,d,v.x,v.y)&&ut(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;w&&w.z>=g;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==s&&w!==a&&Ds(o,h,c,u,l,d,w.x,w.y)&&ut(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;v&&v.z<=A;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&Ds(o,h,c,u,l,d,v.x,v.y)&&ut(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function kM(t,e){let n=t;do{const i=n.prev,s=n.next.next;!cs(i,s)&&Mh(i,n,n.next,s)&&Ws(i,s)&&Ws(s,i)&&(e.push(i.i,n.i,s.i),$s(n),$s(n.next),n=t=s),n=n.next}while(n!==t);return Ri(n)}function BM(t,e,n,i,s,r){let a=t;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&YM(a,o)){let c=yh(a,o);a=Ri(a,a.next),c=Ri(c,c.next),Gs(a,e,n,i,s,r,0),Gs(c,e,n,i,s,r,0);return}o=o.next}a=a.next}while(a!==t)}function VM(t,e,n,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=xh(t,o,c,i,!1);l===l.next&&(l.steiner=!0),s.push(qM(l))}s.sort(zM);for(let r=0;r<s.length;r++)n=HM(s[r],n);return n}function zM(t,e){let n=t.x-e.x;if(n===0&&(n=t.y-e.y,n===0)){const i=(t.next.y-t.y)/(t.next.x-t.x),s=(e.next.y-e.y)/(e.next.x-e.x);n=i-s}return n}function HM(t,e){const n=GM(t,e);if(!n)return e;const i=yh(n,t);return Ri(i,i.next),Ri(n,n.next)}function GM(t,e){let n=e;const i=t.x,s=t.y;let r=-1/0,a;if(cs(t,n))return n;do{if(cs(t,n.next))return n.next;if(s<=n.y&&s>=n.next.y&&n.next.y!==n.y){const u=n.x+(s-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(u<=i&&u>r&&(r=u,a=n.x<n.next.x?n:n.next,u===i))return a}n=n.next}while(n!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;n=a;do{if(i>=n.x&&n.x>=c&&i!==n.x&&vh(s<l?i:r,s,c,l,s<l?r:i,s,n.x,n.y)){const u=Math.abs(s-n.y)/(i-n.x);Ws(n,t)&&(u<h||u===h&&(n.x>a.x||n.x===a.x&&WM(a,n)))&&(a=n,h=u)}n=n.next}while(n!==o);return a}function WM(t,e){return ut(t.prev,t,e.prev)<0&&ut(e.next,t,t.next)<0}function $M(t,e,n,i){let s=t;do s.z===0&&(s.z=dc(s.x,s.y,e,n,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==t);s.prevZ.nextZ=null,s.prevZ=null,XM(s)}function XM(t){let e,n=1;do{let i=t,s;t=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let l=0;l<n&&(o++,a=a.nextZ,!!a);l++);let c=n;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:t=s,s.prevZ=r,r=s;i=a}r.nextZ=null,n*=2}while(e>1);return t}function dc(t,e,n,i,s){return t=(t-n)*s|0,e=(e-i)*s|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function qM(t){let e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function vh(t,e,n,i,s,r,a,o){return(s-a)*(e-o)>=(t-a)*(r-o)&&(t-a)*(i-o)>=(n-a)*(e-o)&&(n-a)*(r-o)>=(s-a)*(i-o)}function Ds(t,e,n,i,s,r,a,o){return!(t===a&&e===o)&&vh(t,e,n,i,s,r,a,o)}function YM(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!KM(t,e)&&(Ws(t,e)&&Ws(e,t)&&ZM(t,e)&&(ut(t.prev,t,e.prev)||ut(t,e.prev,e))||cs(t,e)&&ut(t.prev,t,t.next)>0&&ut(e.prev,e,e.next)>0)}function ut(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function cs(t,e){return t.x===e.x&&t.y===e.y}function Mh(t,e,n,i){const s=Cr(ut(t,e,n)),r=Cr(ut(t,e,i)),a=Cr(ut(n,i,t)),o=Cr(ut(n,i,e));return!!(s!==r&&a!==o||s===0&&Rr(t,n,e)||r===0&&Rr(t,i,e)||a===0&&Rr(n,t,i)||o===0&&Rr(n,e,i))}function Rr(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function Cr(t){return t>0?1:t<0?-1:0}function KM(t,e){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&Mh(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function Ws(t,e){return ut(t.prev,t,t.next)<0?ut(t,e,t.next)>=0&&ut(t,t.prev,e)>=0:ut(t,e,t.prev)<0||ut(t,t.next,e)<0}function ZM(t,e){let n=t,i=!1;const s=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&s<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function yh(t,e){const n=uc(t.i,t.x,t.y),i=uc(e.i,e.x,e.y),s=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=s,s.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function Sd(t,e,n,i){const s=uc(t,e,n);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function $s(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function uc(t,e,n){return{i:t,x:e,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function JM(t,e,n,i){let s=0;for(let r=e,a=n-i;r<n;r+=i)s+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return s}class jM{static triangulate(e,n,i=2){return FM(e,n,i)}}class Vc{static area(e){const n=e.length;let i=0;for(let s=n-1,r=0;r<n;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Vc.area(e)<0}static triangulateShape(e,n){const i=[],s=[],r=[];Ed(e),bd(i,e);let a=e.length;n.forEach(Ed);for(let c=0;c<n.length;c++)s.push(a),a+=n[c].length,bd(i,n[c]);const o=jM.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Ed(t){const e=t.length;e>2&&t[e-1].equals(t[0])&&t.pop()}function bd(t,e){for(let n=0;n<e.length;n++)t.push(e[n].x),t.push(e[n].y)}class ga extends zt{constructor(e=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:s};const r=e/2,a=n/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=e/o,d=n/c,f=[],p=[],_=[],m=[];for(let g=0;g<h;g++){const A=g*d-a;for(let w=0;w<l;w++){const v=w*u-r;p.push(v,-A,0),_.push(0,0,1),m.push(w/o),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let A=0;A<o;A++){const w=A+l*g,v=A+l*(g+1),E=A+1+l*(g+1),y=A+1+l*g;f.push(w,v,y),f.push(v,E,y)}this.setIndex(f),this.setAttribute("position",new Vt(p,3)),this.setAttribute("normal",new Vt(_,3)),this.setAttribute("uv",new Vt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ga(e.width,e.height,e.widthSegments,e.heightSegments)}}function ls(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const s=t[n][i];if(Ad(s))s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=s.clone();else if(Array.isArray(s))if(Ad(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[n][i]=r}else e[n][i]=s.slice();else e[n][i]=s}}return e}function kt(t){const e={};for(let n=0;n<t.length;n++){const i=ls(t[n]);for(const s in i)e[s]=i[s]}return e}function Ad(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function QM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Sh(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const ey={clone:ls,merge:kt};var ty=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ny=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends Ii{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ty,this.fragmentShader=ny,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ls(e.uniforms),this.uniformsGroups=QM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?n.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[s]={type:"m4",value:a.toArray()}:n.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new We().setHex(s.value);break;case"v2":this.uniforms[i].value=new Fe().fromArray(s.value);break;case"v3":this.uniforms[i].value=new U().fromArray(s.value);break;case"v4":this.uniforms[i].value=new dt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Ue().fromArray(s.value);break;case"m4":this.uniforms[i].value=new lt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class iy extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class sy extends Ii{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oc,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ry extends Ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Uv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ay extends Ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Gr extends ma{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Eh extends Ct{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=n}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}const ja=new lt,Td=new U,wd=new U;class oy{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=en,this.map=null,this.mapPass=null,this.matrix=new lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bc,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Td.setFromMatrixPosition(e.matrixWorld),n.position.copy(Td),wd.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(wd),n.updateMatrixWorld(),ja.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ja,n.coordinateSystem,n.reversedDepth),n.coordinateSystem===zs||n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ja)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Pr=new U,Ir=new ai,vn=new U;class bh extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new lt,this.projectionMatrix=new lt,this.projectionMatrixInverse=new lt,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Pr,Ir,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pr,Ir,vn.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(Pr,Ir,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pr,Ir,vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const jn=new U,Rd=new Fe,Cd=new Fe;class an extends bh{constructor(e=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Hs*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hs*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,n){return this.getViewBounds(e,Rd,Cd),n.subVectors(Cd,Rd)}setViewOffset(e,n,i,s,r,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Us*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,n-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class zc extends bh{constructor(e=-1,n=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+n,c=s-n;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class cy extends oy{constructor(){super(new zc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Pd extends Eh{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new cy}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class ly extends Eh{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const Yi=-90,Ki=1;class dy extends Ct{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(Yi,Ki,e,n);s.layers=this.layers,this.add(s);const r=new an(Yi,Ki,e,n);r.layers=this.layers,this.add(r);const a=new an(Yi,Ki,e,n);a.layers=this.layers,this.add(a);const o=new an(Yi,Ki,e,n);o.layers=this.layers,this.add(o);const c=new an(Yi,Ki,e,n);c.layers=this.layers,this.add(c);const l=new an(Yi,Ki,e,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,s,r,a,o,c]=n;for(const l of n)this.remove(l);if(e===bn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===zs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of n)this.add(l),l.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class uy extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Id{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ge(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ge(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const qc=class qc{constructor(e,n,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,s){const r=this.elements;return r[0]=e,r[2]=n,r[1]=i,r[3]=s,this}};qc.prototype.isMatrix2=!0;let Ld=qc;class hy extends DM{constructor(e=10,n=10,i=4473924,s=8947848){i=new We(i),s=new We(s);const r=n/2,a=e/n,o=e/2,c=[],l=[];for(let d=0,f=0,p=-o;d<=n;d++,p+=a){c.push(-o,0,p,o,0,p),c.push(p,0,-o,p,0,o);const _=d===r?i:s;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const h=new zt;h.setAttribute("position",new Vt(c,3)),h.setAttribute("color",new Vt(l,3));const u=new ma({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class fy extends ci{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Le("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Dd(t,e,n,i){const s=py(i);switch(n){case sh:return t*e;case ah:return t*e/s.components*s.byteLength;case Ic:return t*e/s.components*s.byteLength;case wi:return t*e*2/s.components*s.byteLength;case Lc:return t*e*2/s.components*s.byteLength;case rh:return t*e*3/s.components*s.byteLength;case fn:return t*e*4/s.components*s.byteLength;case Dc:return t*e*4/s.components*s.byteLength;case Br:case Vr:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case zr:case Hr:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Lo:case No:return Math.max(t,16)*Math.max(e,8)/4;case Io:case Do:return Math.max(t,8)*Math.max(e,8)/2;case Fo:case Uo:case ko:case Bo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Oo:case na:case Vo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case zo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ho:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Go:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Wo:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case $o:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case qo:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Ko:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Jo:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case jo:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Qo:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case ec:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case tc:case nc:case ic:return Math.ceil(t/4)*Math.ceil(e/4)*16;case sc:case rc:return Math.ceil(t/4)*Math.ceil(e/4)*8;case ia:case ac:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function py(t){switch(t){case en:case eh:return{byteLength:1,components:1};case Bs:case th:case Vn:return{byteLength:2,components:1};case Cc:case Pc:return{byteLength:2,components:4};case Rn:case Rc:case En:return{byteLength:4,components:1};case nh:case ih:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wc}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wc);function Ah(){let t=null,e=!1,n=null,i=null;function s(r,a){n(r,a),i=t.requestAnimationFrame(s)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(s),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){n=r},setContext:function(r){t=r}}}function my(t){const e=new WeakMap;function n(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=t.createBuffer();t.bindBuffer(c,d),t.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=t.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=t.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=t.HALF_FLOAT:f=t.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=t.SHORT;else if(l instanceof Uint32Array)f=t.UNSIGNED_INT;else if(l instanceof Int32Array)f=t.INT;else if(l instanceof Int8Array)f=t.BYTE;else if(l instanceof Uint8Array)f=t.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const h=c.array,u=c.updateRanges;if(t.bindBuffer(l,o),u.length===0)t.bufferSubData(l,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],_=u[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const _=u[f];t.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(t.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,n(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var gy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_y=`#ifdef USE_ALPHAHASH
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
#endif`,xy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,My=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sy=`#ifdef USE_AOMAP
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
#endif`,Ey=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,by=`#ifdef USE_BATCHING
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
#endif`,Ay=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ty=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,wy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ry=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Cy=`#ifdef USE_IRIDESCENCE
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
#endif`,Py=`#ifdef USE_BUMPMAP
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
#endif`,Iy=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ly=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ny=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Uy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Oy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ky=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,By=`#define PI 3.141592653589793
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
} // validated`,Vy=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,zy=`vec3 transformedNormal = objectNormal;
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
#endif`,Hy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$y=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xy="gl_FragColor = linearToOutputTexel( gl_FragColor );",qy=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Yy=`#ifdef USE_ENVMAP
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
#endif`,Ky=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Zy=`#ifdef USE_ENVMAP
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
#endif`,Jy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jy=`#ifdef USE_ENVMAP
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
#endif`,Qy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,eS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,nS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,iS=`#ifdef USE_GRADIENTMAP
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
}`,sS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,aS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,oS=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,cS=`#ifdef USE_ENVMAP
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
#endif`,lS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,uS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,fS=`PhysicalMaterial material;
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
#endif`,pS=`uniform sampler2D dfgLUT;
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
}`,mS=`
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
#endif`,gS=`#if defined( RE_IndirectDiffuse )
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
#endif`,_S=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xS=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,vS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,MS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,SS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ES=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,AS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,TS=`#if defined( USE_POINTS_UV )
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
#endif`,wS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,RS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,CS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,PS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,IS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,LS=`#ifdef USE_MORPHTARGETS
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
#endif`,DS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,NS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,FS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,US=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,OS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,BS=`#ifdef USE_NORMALMAP
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
#endif`,VS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,HS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,GS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,WS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$S=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,XS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,qS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,YS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,KS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ZS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,JS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,QS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,eE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,tE=`float getShadowMask() {
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
}`,nE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,iE=`#ifdef USE_SKINNING
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
#endif`,sE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rE=`#ifdef USE_SKINNING
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
#endif`,aE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,oE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lE=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,dE=`#ifdef USE_TRANSMISSION
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
#endif`,uE=`#ifdef USE_TRANSMISSION
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
#endif`,hE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const gE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_E=`uniform sampler2D t2D;
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
}`,xE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ME=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,SE=`#include <common>
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
}`,EE=`#if DEPTH_PACKING == 3200
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
}`,bE=`#define DISTANCE
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
}`,AE=`#define DISTANCE
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
}`,TE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RE=`uniform float scale;
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
}`,CE=`uniform vec3 diffuse;
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
}`,PE=`#include <common>
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
}`,IE=`uniform vec3 diffuse;
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
}`,LE=`#define LAMBERT
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
}`,DE=`#define LAMBERT
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
}`,NE=`#define MATCAP
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
}`,FE=`#define MATCAP
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
}`,UE=`#define NORMAL
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
}`,OE=`#define NORMAL
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
}`,kE=`#define PHONG
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
}`,BE=`#define PHONG
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
}`,VE=`#define STANDARD
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
}`,zE=`#define STANDARD
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
}`,HE=`#define TOON
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
}`,GE=`#define TOON
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
}`,WE=`uniform float size;
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
}`,$E=`uniform vec3 diffuse;
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
}`,XE=`#include <common>
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
}`,qE=`uniform vec3 color;
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
}`,YE=`uniform float rotation;
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
}`,KE=`uniform vec3 diffuse;
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
}`,Be={alphahash_fragment:gy,alphahash_pars_fragment:_y,alphamap_fragment:xy,alphamap_pars_fragment:vy,alphatest_fragment:My,alphatest_pars_fragment:yy,aomap_fragment:Sy,aomap_pars_fragment:Ey,batching_pars_vertex:by,batching_vertex:Ay,begin_vertex:Ty,beginnormal_vertex:wy,bsdfs:Ry,iridescence_fragment:Cy,bumpmap_pars_fragment:Py,clipping_planes_fragment:Iy,clipping_planes_pars_fragment:Ly,clipping_planes_pars_vertex:Dy,clipping_planes_vertex:Ny,color_fragment:Fy,color_pars_fragment:Uy,color_pars_vertex:Oy,color_vertex:ky,common:By,cube_uv_reflection_fragment:Vy,defaultnormal_vertex:zy,displacementmap_pars_vertex:Hy,displacementmap_vertex:Gy,emissivemap_fragment:Wy,emissivemap_pars_fragment:$y,colorspace_fragment:Xy,colorspace_pars_fragment:qy,envmap_fragment:Yy,envmap_common_pars_fragment:Ky,envmap_pars_fragment:Zy,envmap_pars_vertex:Jy,envmap_physical_pars_fragment:cS,envmap_vertex:jy,fog_vertex:Qy,fog_pars_vertex:eS,fog_fragment:tS,fog_pars_fragment:nS,gradientmap_pars_fragment:iS,lightmap_pars_fragment:sS,lights_lambert_fragment:rS,lights_lambert_pars_fragment:aS,lights_pars_begin:oS,lights_toon_fragment:lS,lights_toon_pars_fragment:dS,lights_phong_fragment:uS,lights_phong_pars_fragment:hS,lights_physical_fragment:fS,lights_physical_pars_fragment:pS,lights_fragment_begin:mS,lights_fragment_maps:gS,lights_fragment_end:_S,lightprobes_pars_fragment:xS,logdepthbuf_fragment:vS,logdepthbuf_pars_fragment:MS,logdepthbuf_pars_vertex:yS,logdepthbuf_vertex:SS,map_fragment:ES,map_pars_fragment:bS,map_particle_fragment:AS,map_particle_pars_fragment:TS,metalnessmap_fragment:wS,metalnessmap_pars_fragment:RS,morphinstance_vertex:CS,morphcolor_vertex:PS,morphnormal_vertex:IS,morphtarget_pars_vertex:LS,morphtarget_vertex:DS,normal_fragment_begin:NS,normal_fragment_maps:FS,normal_pars_fragment:US,normal_pars_vertex:OS,normal_vertex:kS,normalmap_pars_fragment:BS,clearcoat_normal_fragment_begin:VS,clearcoat_normal_fragment_maps:zS,clearcoat_pars_fragment:HS,iridescence_pars_fragment:GS,opaque_fragment:WS,packing:$S,premultiplied_alpha_fragment:XS,project_vertex:qS,dithering_fragment:YS,dithering_pars_fragment:KS,roughnessmap_fragment:ZS,roughnessmap_pars_fragment:JS,shadowmap_pars_fragment:jS,shadowmap_pars_vertex:QS,shadowmap_vertex:eE,shadowmask_pars_fragment:tE,skinbase_vertex:nE,skinning_pars_vertex:iE,skinning_vertex:sE,skinnormal_vertex:rE,specularmap_fragment:aE,specularmap_pars_fragment:oE,tonemapping_fragment:cE,tonemapping_pars_fragment:lE,transmission_fragment:dE,transmission_pars_fragment:uE,uv_pars_fragment:hE,uv_pars_vertex:fE,uv_vertex:pE,worldpos_vertex:mE,background_vert:gE,background_frag:_E,backgroundCube_vert:xE,backgroundCube_frag:vE,cube_vert:ME,cube_frag:yE,depth_vert:SE,depth_frag:EE,distance_vert:bE,distance_frag:AE,equirect_vert:TE,equirect_frag:wE,linedashed_vert:RE,linedashed_frag:CE,meshbasic_vert:PE,meshbasic_frag:IE,meshlambert_vert:LE,meshlambert_frag:DE,meshmatcap_vert:NE,meshmatcap_frag:FE,meshnormal_vert:UE,meshnormal_frag:OE,meshphong_vert:kE,meshphong_frag:BE,meshphysical_vert:VE,meshphysical_frag:zE,meshtoon_vert:HE,meshtoon_frag:GE,points_vert:WE,points_frag:$E,shadow_vert:XE,shadow_frag:qE,sprite_vert:YE,sprite_frag:KE},_e={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},yn={basic:{uniforms:kt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:kt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new We(0)},envMapIntensity:{value:1}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:kt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:kt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:kt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new We(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:kt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:kt([_e.points,_e.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:kt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:kt([_e.common,_e.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:kt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:kt([_e.sprite,_e.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distance:{uniforms:kt([_e.common,_e.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distance_vert,fragmentShader:Be.distance_frag},shadow:{uniforms:kt([_e.lights,_e.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};yn.physical={uniforms:kt([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const Lr={r:0,b:0,g:0},ZE=new lt,Th=new Ue;Th.set(-1,0,0,0,1,0,0,0,1);function JE(t,e,n,i,s,r){const a=new We(0);let o=s===!0?0:1,c,l,h=null,u=0,d=null;function f(A){let w=A.isScene===!0?A.background:null;if(w&&w.isTexture){const v=A.backgroundBlurriness>0;w=e.get(w,v)}return w}function p(A){let w=!1;const v=f(A);v===null?m(a,o):v&&v.isColor&&(m(v,1),w=!0);const E=t.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(t.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function _(A,w){const v=f(w);v&&(v.isCubeTexture||v.mapping===fa)?(l===void 0&&(l=new pn(new Ys(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:ls(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,y,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ZE.makeRotationFromEuler(w.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Th),l.material.toneMapped=$e.getTransfer(v.colorSpace)!==je,(h!==v||u!==v.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=t.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new pn(new ga(2,2),new Cn({name:"BackgroundMaterial",uniforms:ls(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=$e.getTransfer(v.colorSpace)!==je,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=t.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function m(A,w){A.getRGB(Lr,Sh(t)),n.buffers.color.setClear(Lr.r,Lr.g,Lr.b,w,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,w=1){a.set(A),o=w,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,m(a,o)},render:p,addToRenderList:_,dispose:g}}function jE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(C,I,X,H,D){let $=!1;const B=u(C,H,X,I);r!==B&&(r=B,l(r.object)),$=f(C,H,X,D),$&&p(C,H,X,D),D!==null&&e.update(D,t.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,v(C,I,X,H),D!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}function c(){return t.createVertexArray()}function l(C){return t.bindVertexArray(C)}function h(C){return t.deleteVertexArray(C)}function u(C,I,X,H){const D=H.wireframe===!0;let $=i[I.id];$===void 0&&($={},i[I.id]=$);const B=C.isInstancedMesh===!0?C.id:0;let q=$[B];q===void 0&&(q={},$[B]=q);let te=q[X.id];te===void 0&&(te={},q[X.id]=te);let re=te[D];return re===void 0&&(re=d(c()),te[D]=re),re}function d(C){const I=[],X=[],H=[];for(let D=0;D<n;D++)I[D]=0,X[D]=0,H[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:X,attributeDivisors:H,object:C,attributes:{},index:null}}function f(C,I,X,H){const D=r.attributes,$=I.attributes;let B=0;const q=X.getAttributes();for(const te in q)if(q[te].location>=0){const ce=D[te];let ae=$[te];if(ae===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(ae=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(ae=C.instanceColor)),ce===void 0||ce.attribute!==ae||ae&&ce.data!==ae.data)return!0;B++}return r.attributesNum!==B||r.index!==H}function p(C,I,X,H){const D={},$=I.attributes;let B=0;const q=X.getAttributes();for(const te in q)if(q[te].location>=0){let ce=$[te];ce===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(ce=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(ce=C.instanceColor));const ae={};ae.attribute=ce,ce&&ce.data&&(ae.data=ce.data),D[te]=ae,B++}r.attributes=D,r.attributesNum=B,r.index=H}function _(){const C=r.newAttributes;for(let I=0,X=C.length;I<X;I++)C[I]=0}function m(C){g(C,0)}function g(C,I){const X=r.newAttributes,H=r.enabledAttributes,D=r.attributeDivisors;X[C]=1,H[C]===0&&(t.enableVertexAttribArray(C),H[C]=1),D[C]!==I&&(t.vertexAttribDivisor(C,I),D[C]=I)}function A(){const C=r.newAttributes,I=r.enabledAttributes;for(let X=0,H=I.length;X<H;X++)I[X]!==C[X]&&(t.disableVertexAttribArray(X),I[X]=0)}function w(C,I,X,H,D,$,B){B===!0?t.vertexAttribIPointer(C,I,X,D,$):t.vertexAttribPointer(C,I,X,H,D,$)}function v(C,I,X,H){_();const D=H.attributes,$=X.getAttributes(),B=I.defaultAttributeValues;for(const q in $){const te=$[q];if(te.location>=0){let re=D[q];if(re===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(re=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(re=C.instanceColor)),re!==void 0){const ce=re.normalized,ae=re.itemSize,ze=e.get(re);if(ze===void 0)continue;const Ze=ze.buffer,He=ze.type,Z=ze.bytesPerElement,oe=He===t.INT||He===t.UNSIGNED_INT||re.gpuType===Rc;if(re.isInterleavedBufferAttribute){const ie=re.data,Ne=ie.stride,Q=re.offset;if(ie.isInstancedInterleavedBuffer){for(let G=0;G<te.locationSize;G++)g(te.location+G,ie.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let G=0;G<te.locationSize;G++)m(te.location+G);t.bindBuffer(t.ARRAY_BUFFER,Ze);for(let G=0;G<te.locationSize;G++)w(te.location+G,ae/te.locationSize,He,ce,Ne*Z,(Q+ae/te.locationSize*G)*Z,oe)}else{if(re.isInstancedBufferAttribute){for(let ie=0;ie<te.locationSize;ie++)g(te.location+ie,re.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ie=0;ie<te.locationSize;ie++)m(te.location+ie);t.bindBuffer(t.ARRAY_BUFFER,Ze);for(let ie=0;ie<te.locationSize;ie++)w(te.location+ie,ae/te.locationSize,He,ce,ae*Z,ae/te.locationSize*ie*Z,oe)}}else if(B!==void 0){const ce=B[q];if(ce!==void 0)switch(ce.length){case 2:t.vertexAttrib2fv(te.location,ce);break;case 3:t.vertexAttrib3fv(te.location,ce);break;case 4:t.vertexAttrib4fv(te.location,ce);break;default:t.vertexAttrib1fv(te.location,ce)}}}}A()}function E(){b();for(const C in i){const I=i[C];for(const X in I){const H=I[X];for(const D in H){const $=H[D];for(const B in $)h($[B].object),delete $[B];delete H[D]}}delete i[C]}}function y(C){if(i[C.id]===void 0)return;const I=i[C.id];for(const X in I){const H=I[X];for(const D in H){const $=H[D];for(const B in $)h($[B].object),delete $[B];delete H[D]}}delete i[C.id]}function T(C){for(const I in i){const X=i[I];for(const H in X){const D=X[H];if(D[C.id]===void 0)continue;const $=D[C.id];for(const B in $)h($[B].object),delete $[B];delete D[C.id]}}}function M(C){for(const I in i){const X=i[I],H=C.isInstancedMesh===!0?C.id:0,D=X[H];if(D!==void 0){for(const $ in D){const B=D[$];for(const q in B)h(B[q].object),delete B[q];delete D[$]}delete X[H],Object.keys(X).length===0&&delete i[I]}}}function b(){P(),a=!0,r!==s&&(r=s,l(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:P,dispose:E,releaseStatesOfGeometry:y,releaseStatesOfObject:M,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:A}}function QE(t,e,n){let i;function s(c){i=c}function r(c,l){t.drawArrays(i,c,l),n.update(l,i,1)}function a(c,l,h){h!==0&&(t.drawArraysInstanced(i,c,l,h),n.update(l,i,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,h);let d=0;for(let f=0;f<h;f++)d+=l[f];n.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function eb(t,e,n,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");s=t.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==fn&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const M=T===Vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==en&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==En&&!M)}function c(T){if(T==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp";const h=c(l);h!==l&&(Le("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=n.logarithmicDepthBuffer===!0,d=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&d===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),g=t.getParameter(t.MAX_VERTEX_ATTRIBS),A=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),w=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),E=t.getParameter(t.MAX_SAMPLES),y=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:A,maxVaryings:w,maxFragmentUniforms:v,maxSamples:E,samples:y}}function tb(t){const e=this;let n=null,i=0,s=!1,r=!1;const a=new Qn,o=new Ue,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){n=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,g=t.get(u);if(!s||p===null||p.length===0||r&&!m)r?h(null):l();else{const A=r?0:i,w=A*4;let v=g.clippingState||null;c.value=v,v=h(p,d,w,f);for(let E=0;E!==w;++E)v[E]=n[E];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,p){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,p!==!0||m===null){const g=f+_*4,A=d.matrixWorldInverse;o.getNormalMatrix(A),(m===null||m.length<g)&&(m=new Float32Array(g));for(let w=0,v=f;w!==_;++w,v+=4)a.copy(u[w]).applyMatrix4(A,o),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const ni=4,Nd=[.125,.215,.35,.446,.526,.582],_i=20,nb=256,As=new zc,Fd=new We;let Qa=null,eo=0,to=0,no=!1;const ib=new U;class Ud{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,s=100,r={}){const{size:a=256,position:o=ib}=r;Qa=this._renderer.getRenderTarget(),eo=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),no=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Qa,eo,to),this._renderer.xr.enabled=no,e.scissorTest=!1,Zi(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ti||e.mapping===as?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qa=this._renderer.getRenderTarget(),eo=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),no=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:Vn,format:fn,colorSpace:sa,depthBuffer:!1},s=Od(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Od(e,n,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=sb(r)),this._blurMaterial=ab(r,e,n),this._ggxMaterial=rb(r,e,n)}return s}_compileMaterial(e){const n=new pn(new zt,e);this._renderer.compile(n,As)}_sceneToCubeUV(e,n,i,s,r){const c=new an(90,1,n,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Fd),u.toneMapping=An,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new pn(new Ys,new ph({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const A=e.background;A?A.isColor&&(m.color.copy(A),e.background=null,g=!0):(m.color.copy(Fd),g=!0);for(let w=0;w<6;w++){const v=w%3;v===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[w],r.y,r.z)):v===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[w]));const E=this._cubeSize;Zi(s,v*E,w>2?E:0,E,E),u.setRenderTarget(s),g&&u.render(_,c),u.render(e,c)}u.toneMapping=f,u.autoClear=d,e.background=A}_textureToCubeUV(e,n){const i=this._renderer,s=e.mapping===Ti||e.mapping===as;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Zi(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,As)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);n.autoClear=i}_applyGGXFilter(e,n,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),h=n/(this._lodMeshes.length-1),u=Math.sqrt(l*l-h*h),d=0+l*1.25,f=u*d,{_lodMax:p}=this,_=this._sizeLods[i],m=3*_*(i>p-ni?i-p+ni:0),g=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=p-n,Zi(r,m,g,3*_,2*_),s.setRenderTarget(r),s.render(o,As),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-i,Zi(e,m,g,3*_,2*_),s.setRenderTarget(e),s.render(o,As)}_blur(e,n,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,n,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&qe("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=l;const d=l.uniforms,f=this._sizeLods[i]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*_i-1),_=r/p,m=isFinite(r)?1+Math.floor(h*_):_i;m>_i&&Le(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const g=[];let A=0;for(let T=0;T<_i;++T){const M=T/_,b=Math.exp(-M*M/2);g.push(b),T===0?A+=b:T<m&&(A+=2*b)}for(let T=0;T<g.length;T++)g[T]=g[T]/A;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:w}=this;d.dTheta.value=p,d.mipInt.value=w-i;const v=this._sizeLods[s],E=3*v*(s>w-ni?s-w+ni:0),y=4*(this._cubeSize-v);Zi(n,E,y,3*v,2*v),c.setRenderTarget(n),c.render(u,As)}}function sb(t){const e=[],n=[],i=[];let s=t;const r=t-ni+1+Nd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>t-ni?c=Nd[a-t+ni-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,_=3,m=2,g=1,A=new Float32Array(_*p*f),w=new Float32Array(m*p*f),v=new Float32Array(g*p*f);for(let y=0;y<f;y++){const T=y%3*2/3-1,M=y>2?0:-1,b=[T,M,0,T+2/3,M,0,T+2/3,M+1,0,T,M,0,T+2/3,M+1,0,T,M+1,0];A.set(b,_*p*y),w.set(d,m*p*y);const P=[y,y,y,y,y,y];v.set(P,g*p*y)}const E=new zt;E.setAttribute("position",new wn(A,_)),E.setAttribute("uv",new wn(w,m)),E.setAttribute("faceIndex",new wn(v,g)),i.push(new pn(E,null)),s>ni&&s--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function Od(t,e,n){const i=new Tn(t,e,n);return i.texture.mapping=fa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Zi(t,e,n,i,s){t.viewport.set(e,n,i,s),t.scissor.set(e,n,i,s)}function rb(t,e,n){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:nb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:_a(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function ab(t,e,n){const i=new Float32Array(_i),s=new U(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:_a(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function kd(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_a(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Bd(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function _a(){return`

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
	`}class wh extends Tn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new gh(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ys(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:ls(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:qt,blending:kn});r.uniforms.tEquirect.value=n;const a=new pn(s,r),o=n.minFilter;return n.minFilter===vi&&(n.minFilter=Ut),new dy(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,s);e.setRenderTarget(r)}}function ob(t){let e=new WeakMap,n=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Ta||f===wa)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new wh(p.height);return _.fromEquirectangularTexture(t,d),e.set(d,_),d.addEventListener("dispose",l),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===Ta||f===wa,_=f===Ti||f===as;if(p||_){let m=n.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new Ud(t)),m=p?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),m.texture;if(m!==void 0)return m.texture;{const A=d.image;return p&&A&&A.height>0||_&&A&&c(A)?(i===null&&(i=new Ud(t)),m=p?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===Ta?d.mapping=Ti:f===wa&&(d.mapping=as),d}function c(d){let f=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&f++;return f===p}function l(d){const f=d.target;f.removeEventListener("dispose",l);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=n.get(f);p!==void 0&&(n.delete(f),p.dispose())}function u(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function cb(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const s=t.getExtension(i);return e[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const s=n(i);return s===null&&is("WebGLRenderer: "+i+" extension not supported."),s}}}function lb(t,e,n,i){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,n.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)e.update(d[f],t.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,p=u.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const A=f.array;_=f.version;for(let w=0,v=A.length;w<v;w+=3){const E=A[w+0],y=A[w+1],T=A[w+2];d.push(E,y,y,T,T,E)}}else{const A=p.array;_=p.version;for(let w=0,v=A.length/3-1;w<v;w+=3){const E=w+0,y=w+1,T=w+2;d.push(E,y,y,T,T,E)}}const m=new(p.count>=65535?fh:hh)(d,1);m.version=_;const g=r.get(u);g&&e.remove(g),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function db(t,e,n){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,d){t.drawElements(i,d,r,u*a),n.update(d,i,1)}function l(u,d,f){f!==0&&(t.drawElementsInstanced(i,d,r,u*a,f),n.update(d,i,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,u,0,f);let _=0;for(let m=0;m<f;m++)_+=d[m];n.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function ub(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(r/3);break;case t.LINES:n.lines+=o*(r/2);break;case t.LINE_STRIP:n.lines+=o*(r-1);break;case t.LINE_LOOP:n.lines+=o*r;break;case t.POINTS:n.points+=o*r;break;default:qe("WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:s,update:i}}function hb(t,e,n){const i=new WeakMap,s=new dt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let b=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let w=0;f===!0&&(w=1),p===!0&&(w=2),_===!0&&(w=3);let v=o.attributes.position.count*w,E=1;v>e.maxTextureSize&&(E=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const y=new Float32Array(v*E*4*u),T=new lh(y,v,E,u);T.type=En,T.needsUpdate=!0;const M=w*4;for(let P=0;P<u;P++){const C=m[P],I=g[P],X=A[P],H=v*E*4*P;for(let D=0;D<C.count;D++){const $=D*M;f===!0&&(s.fromBufferAttribute(C,D),y[H+$+0]=s.x,y[H+$+1]=s.y,y[H+$+2]=s.z,y[H+$+3]=0),p===!0&&(s.fromBufferAttribute(I,D),y[H+$+4]=s.x,y[H+$+5]=s.y,y[H+$+6]=s.z,y[H+$+7]=0),_===!0&&(s.fromBufferAttribute(X,D),y[H+$+8]=s.x,y[H+$+9]=s.y,y[H+$+10]=s.z,y[H+$+11]=X.itemSize===4?s.w:1)}}d={count:u,texture:T,size:new Fe(v,E)},i.set(o,d),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];const p=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(t,"morphTargetBaseInfluence",p),c.getUniforms().setValue(t,"morphTargetInfluences",l)}c.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:r}}function fb(t,e,n,i,s){let r=new WeakMap;function a(l){const h=s.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),i.releaseStatesOfObject(h),n.remove(h.instanceMatrix),h.instanceColor!==null&&n.remove(h.instanceColor)}return{update:a,dispose:o}}const pb={[Xu]:"LINEAR_TONE_MAPPING",[qu]:"REINHARD_TONE_MAPPING",[Yu]:"CINEON_TONE_MAPPING",[Ku]:"ACES_FILMIC_TONE_MAPPING",[Ju]:"AGX_TONE_MAPPING",[ju]:"NEUTRAL_TONE_MAPPING",[Zu]:"CUSTOM_TONE_MAPPING"};function mb(t,e,n,i,s,r){const a=new Tn(e,n,{type:t,depthBuffer:s,stencilBuffer:r,samples:i?4:0,depthTexture:s?new os(e,n):void 0}),o=new Tn(e,n,{type:Vn,depthBuffer:!1,stencilBuffer:!1}),c=new zt;c.setAttribute("position",new Vt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Vt([0,2,0,0,2,0],2));const l=new iy({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new pn(c,l),u=new zc(-1,1,1,-1,0,1);let d=null,f=null,p=!1,_,m=null,g=[],A=!1;this.setSize=function(w,v){a.setSize(w,v),o.setSize(w,v);for(let E=0;E<g.length;E++){const y=g[E];y.setSize&&y.setSize(w,v)}},this.setEffects=function(w){g=w,A=g.length>0&&g[0].isRenderPass===!0;const v=a.width,E=a.height;for(let y=0;y<g.length;y++){const T=g[y];T.setSize&&T.setSize(v,E)}},this.begin=function(w,v){if(p||w.toneMapping===An&&g.length===0)return!1;if(m=v,v!==null){const E=v.width,y=v.height;(a.width!==E||a.height!==y)&&this.setSize(E,y)}return A===!1&&w.setRenderTarget(a),_=w.toneMapping,w.toneMapping=An,!0},this.hasRenderPass=function(){return A},this.end=function(w,v){w.toneMapping=_,p=!0;let E=a,y=o;for(let T=0;T<g.length;T++){const M=g[T];if(M.enabled!==!1&&(M.render(w,y,E,v),M.needsSwap!==!1)){const b=E;E=y,y=b}}if(d!==w.outputColorSpace||f!==w.toneMapping){d=w.outputColorSpace,f=w.toneMapping,l.defines={},$e.getTransfer(d)===je&&(l.defines.SRGB_TRANSFER="");const T=pb[f];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=E.texture,w.setRenderTarget(m),w.render(h,u),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const Rh=new Bt,hc=new os(1,1),Ch=new lh,Ph=new mM,Ih=new gh,Vd=[],zd=[],Hd=new Float32Array(16),Gd=new Float32Array(9),Wd=new Float32Array(4);function fs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const s=e*n;let r=Vd[s];if(r===void 0&&(r=new Float32Array(s),Vd[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(r,o)}return r}function bt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function At(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function xa(t,e){let n=zd[e];n===void 0&&(n=new Int32Array(e),zd[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function gb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function _b(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2fv(this.addr,e),At(n,e)}}function xb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(bt(n,e))return;t.uniform3fv(this.addr,e),At(n,e)}}function vb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4fv(this.addr,e),At(n,e)}}function Mb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;Wd.set(i),t.uniformMatrix2fv(this.addr,!1,Wd),At(n,i)}}function yb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;Gd.set(i),t.uniformMatrix3fv(this.addr,!1,Gd),At(n,i)}}function Sb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;Hd.set(i),t.uniformMatrix4fv(this.addr,!1,Hd),At(n,i)}}function Eb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function bb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2iv(this.addr,e),At(n,e)}}function Ab(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(bt(n,e))return;t.uniform3iv(this.addr,e),At(n,e)}}function Tb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4iv(this.addr,e),At(n,e)}}function wb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function Rb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2uiv(this.addr,e),At(n,e)}}function Cb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(bt(n,e))return;t.uniform3uiv(this.addr,e),At(n,e)}}function Pb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4uiv(this.addr,e),At(n,e)}}function Ib(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s);let r;this.type===t.SAMPLER_2D_SHADOW?(hc.compareFunction=n.isReversedDepthBuffer()?Fc:Nc,r=hc):r=Rh,n.setTexture2D(e||r,s)}function Lb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(e||Ph,s)}function Db(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(e||Ih,s)}function Nb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(e||Ch,s)}function Fb(t){switch(t){case 5126:return gb;case 35664:return _b;case 35665:return xb;case 35666:return vb;case 35674:return Mb;case 35675:return yb;case 35676:return Sb;case 5124:case 35670:return Eb;case 35667:case 35671:return bb;case 35668:case 35672:return Ab;case 35669:case 35673:return Tb;case 5125:return wb;case 36294:return Rb;case 36295:return Cb;case 36296:return Pb;case 35678:case 36198:case 36298:case 36306:case 35682:return Ib;case 35679:case 36299:case 36307:return Lb;case 35680:case 36300:case 36308:case 36293:return Db;case 36289:case 36303:case 36311:case 36292:return Nb}}function Ub(t,e){t.uniform1fv(this.addr,e)}function Ob(t,e){const n=fs(e,this.size,2);t.uniform2fv(this.addr,n)}function kb(t,e){const n=fs(e,this.size,3);t.uniform3fv(this.addr,n)}function Bb(t,e){const n=fs(e,this.size,4);t.uniform4fv(this.addr,n)}function Vb(t,e){const n=fs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function zb(t,e){const n=fs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Hb(t,e){const n=fs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Gb(t,e){t.uniform1iv(this.addr,e)}function Wb(t,e){t.uniform2iv(this.addr,e)}function $b(t,e){t.uniform3iv(this.addr,e)}function Xb(t,e){t.uniform4iv(this.addr,e)}function qb(t,e){t.uniform1uiv(this.addr,e)}function Yb(t,e){t.uniform2uiv(this.addr,e)}function Kb(t,e){t.uniform3uiv(this.addr,e)}function Zb(t,e){t.uniform4uiv(this.addr,e)}function Jb(t,e,n){const i=this.cache,s=e.length,r=xa(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));let a;this.type===t.SAMPLER_2D_SHADOW?a=hc:a=Rh;for(let o=0;o!==s;++o)n.setTexture2D(e[o]||a,r[o])}function jb(t,e,n){const i=this.cache,s=e.length,r=xa(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTexture3D(e[a]||Ph,r[a])}function Qb(t,e,n){const i=this.cache,s=e.length,r=xa(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTextureCube(e[a]||Ih,r[a])}function eA(t,e,n){const i=this.cache,s=e.length,r=xa(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTexture2DArray(e[a]||Ch,r[a])}function tA(t){switch(t){case 5126:return Ub;case 35664:return Ob;case 35665:return kb;case 35666:return Bb;case 35674:return Vb;case 35675:return zb;case 35676:return Hb;case 5124:case 35670:return Gb;case 35667:case 35671:return Wb;case 35668:case 35672:return $b;case 35669:case 35673:return Xb;case 5125:return qb;case 36294:return Yb;case 36295:return Kb;case 36296:return Zb;case 35678:case 36198:case 36298:case 36306:case 35682:return Jb;case 35679:case 36299:case 36307:return jb;case 35680:case 36300:case 36308:case 36293:return Qb;case 36289:case 36303:case 36311:case 36292:return eA}}class nA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Fb(n.type)}}class iA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=tA(n.type)}}class sA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,n[o.id],i)}}}const io=/(\w+)(\])?(\[|\.)?/g;function $d(t,e){t.seq.push(e),t.map[e.id]=e}function rA(t,e,n){const i=t.name,s=i.length;for(io.lastIndex=0;;){const r=io.exec(i),a=io.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){$d(n,l===void 0?new nA(o,t,e):new iA(o,t,e));break}else{let u=n.map[o];u===void 0&&(u=new sA(o),$d(n,u)),n=u}}}class Wr{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(n,a),c=e.getUniformLocation(n,o.name);rA(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,n,i,s){const r=this.map[n];r!==void 0&&r.setValue(e,i,s)}setOptional(e,n,i){const s=n[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,n,i,s){for(let r=0,a=n.length;r!==a;++r){const o=n[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,n){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in n&&i.push(a)}return i}}function Xd(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const aA=37297;let oA=0;function cA(t,e){const n=t.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,n.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const qd=new Ue;function lA(t){$e._getMatrix(qd,$e.workingColorSpace,t);const e=`mat3( ${qd.elements.map(n=>n.toFixed(4))} )`;switch($e.getTransfer(t)){case ra:return[e,"LinearTransferOETF"];case je:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Yd(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=(t.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+cA(t.getShaderSource(e),o)}else return r}function dA(t,e){const n=lA(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const uA={[Xu]:"Linear",[qu]:"Reinhard",[Yu]:"Cineon",[Ku]:"ACESFilmic",[Ju]:"AgX",[ju]:"Neutral",[Zu]:"Custom"};function hA(t,e){const n=uA[e];return n===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Dr=new U;function fA(){$e.getLuminanceCoefficients(Dr);const t=Dr.x.toFixed(4),e=Dr.y.toFixed(4),n=Dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function pA(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ns).join(`
`)}function mA(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function gA(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=t.getActiveAttrib(e,s),a=r.name;let o=1;r.type===t.FLOAT_MAT2&&(o=2),r.type===t.FLOAT_MAT3&&(o=3),r.type===t.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function Ns(t){return t!==""}function Kd(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Zd(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const _A=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(t){return t.replace(_A,vA)}const xA=new Map;function vA(t,e){let n=Be[e];if(n===void 0){const i=xA.get(e);if(i!==void 0)n=Be[i],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return fc(n)}const MA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jd(t){return t.replace(MA,yA)}function yA(t,e,n,i){let s="";for(let r=parseInt(e);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function jd(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const SA={[kr]:"SHADOWMAP_TYPE_PCF",[Is]:"SHADOWMAP_TYPE_VSM"};function EA(t){return SA[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const bA={[Ti]:"ENVMAP_TYPE_CUBE",[as]:"ENVMAP_TYPE_CUBE",[fa]:"ENVMAP_TYPE_CUBE_UV"};function AA(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":bA[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const TA={[as]:"ENVMAP_MODE_REFRACTION"};function wA(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":TA[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const RA={[$u]:"ENVMAP_BLENDING_MULTIPLY",[Dv]:"ENVMAP_BLENDING_MIX",[Nv]:"ENVMAP_BLENDING_ADD"};function CA(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":RA[t.combine]||"ENVMAP_BLENDING_NONE"}function PA(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function IA(t,e,n,i){const s=t.getContext(),r=n.defines;let a=n.vertexShader,o=n.fragmentShader;const c=EA(n),l=AA(n),h=wA(n),u=CA(n),d=PA(n),f=pA(n),p=mA(r),_=s.createProgram();let m,g,A=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p].filter(Ns).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p].filter(Ns).join(`
`),g.length>0&&(g+=`
`)):(m=[jd(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ns).join(`
`),g=[jd(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+h:"",n.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==An?"#define TONE_MAPPING":"",n.toneMapping!==An?Be.tonemapping_pars_fragment:"",n.toneMapping!==An?hA("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,dA("linearToOutputTexel",n.outputColorSpace),fA(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Ns).join(`
`)),a=fc(a),a=Kd(a,n),a=Zd(a,n),o=fc(o),o=Kd(o,n),o=Zd(o,n),a=Jd(a),o=Jd(o),n.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",n.glslVersion===Jl?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Jl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const w=A+m+a,v=A+g+o,E=Xd(s,s.VERTEX_SHADER,w),y=Xd(s,s.FRAGMENT_SHADER,v);s.attachShader(_,E),s.attachShader(_,y),n.index0AttributeName!==void 0?s.bindAttribLocation(_,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(C){if(t.debug.checkShaderErrors){const I=s.getProgramInfoLog(_)||"",X=s.getShaderInfoLog(E)||"",H=s.getShaderInfoLog(y)||"",D=I.trim(),$=X.trim(),B=H.trim();let q=!0,te=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(q=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(s,_,E,y);else{const re=Yd(s,E,"vertex"),ce=Yd(s,y,"fragment");qe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+D+`
`+re+`
`+ce)}else D!==""?Le("WebGLProgram: Program Info Log:",D):($===""||B==="")&&(te=!1);te&&(C.diagnostics={runnable:q,programLog:D,vertexShader:{log:$,prefix:m},fragmentShader:{log:B,prefix:g}})}s.deleteShader(E),s.deleteShader(y),M=new Wr(s,_),b=gA(s,_)}let M;this.getUniforms=function(){return M===void 0&&T(this),M};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let P=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(_,aA)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=oA++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=y,this}let LA=0;class DA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const s=this._getShaderCacheForMaterial(e);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new NA(e),n.set(e,i)),i}}class NA{constructor(e){this.id=LA++,this.code=e,this.usedTimes=0}}function FA(t){return t===wi||t===na||t===ia}function UA(t,e,n,i,s,r){const a=new dh,o=new DA,c=new Set,l=[],h=new Map,u=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(M){return c.add(M),M===0?"uv":`uv${M}`}function _(M,b,P,C,I,X){const H=C.fog,D=I.geometry,$=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?C.environment:null,B=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap,q=e.get(M.envMap||$,B),te=q&&q.mapping===fa?q.image.height:null,re=f[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&Le("WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const ce=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,ae=ce!==void 0?ce.length:0;let ze=0;D.morphAttributes.position!==void 0&&(ze=1),D.morphAttributes.normal!==void 0&&(ze=2),D.morphAttributes.color!==void 0&&(ze=3);let Ze,He,Z,oe;if(re){const be=yn[re];Ze=be.vertexShader,He=be.fragmentShader}else{Ze=M.vertexShader,He=M.fragmentShader;const be=o.getVertexShaderStage(M),pt=o.getFragmentShaderStage(M);o.update(M,be,pt),Z=be.id,oe=pt.id}const ie=t.getRenderTarget(),Ne=t.state.buffers.depth.getReversed(),Q=I.isInstancedMesh===!0,G=I.isBatchedMesh===!0,he=!!M.map,ne=!!M.matcap,de=!!q,ye=!!M.aoMap,we=!!M.lightMap,Ye=!!M.bumpMap&&M.wireframe===!1,ht=!!M.normalMap,Tt=!!M.displacementMap,Pt=!!M.emissiveMap,ft=!!M.metalnessMap,Mt=!!M.roughnessMap,N=M.anisotropy>0,Ht=M.clearcoat>0,Je=M.dispersion>0,R=M.iridescence>0,x=M.sheen>0,O=M.transmission>0,z=N&&!!M.anisotropyMap,Y=Ht&&!!M.clearcoatMap,se=Ht&&!!M.clearcoatNormalMap,ue=Ht&&!!M.clearcoatRoughnessMap,K=R&&!!M.iridescenceMap,j=R&&!!M.iridescenceThicknessMap,fe=x&&!!M.sheenColorMap,Re=x&&!!M.sheenRoughnessMap,ge=!!M.specularMap,pe=!!M.specularColorMap,Ie=!!M.specularIntensityMap,De=O&&!!M.transmissionMap,Oe=O&&!!M.thicknessMap,L=!!M.gradientMap,le=!!M.alphaMap,J=M.alphaTest>0,me=!!M.alphaHash,Me=!!M.extensions;let ee=An;M.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ee=t.toneMapping);const Te={shaderID:re,shaderType:M.type,shaderName:M.name,vertexShader:Ze,fragmentShader:He,defines:M.defines,customVertexShaderID:Z,customFragmentShaderID:oe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:G,batchingColor:G&&I._colorsTexture!==null,instancing:Q,instancingColor:Q&&I.instanceColor!==null,instancingMorph:Q&&I.morphTexture!==null,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!M.alphaToCoverage,map:he,matcap:ne,envMap:de,envMapMode:de&&q.mapping,envMapCubeUVHeight:te,aoMap:ye,lightMap:we,bumpMap:Ye,normalMap:ht,displacementMap:Tt,emissiveMap:Pt,normalMapObjectSpace:ht&&M.normalMapType===Ov,normalMapTangentSpace:ht&&M.normalMapType===oc,packedNormalMap:ht&&M.normalMapType===oc&&FA(M.normalMap.format),metalnessMap:ft,roughnessMap:Mt,anisotropy:N,anisotropyMap:z,clearcoat:Ht,clearcoatMap:Y,clearcoatNormalMap:se,clearcoatRoughnessMap:ue,dispersion:Je,iridescence:R,iridescenceMap:K,iridescenceThicknessMap:j,sheen:x,sheenColorMap:fe,sheenRoughnessMap:Re,specularMap:ge,specularColorMap:pe,specularIntensityMap:Ie,transmission:O,transmissionMap:De,thicknessMap:Oe,gradientMap:L,opaque:M.transparent===!1&&M.blending===ns&&M.alphaToCoverage===!1,alphaMap:le,alphaTest:J,alphaHash:me,combine:M.combine,mapUv:he&&p(M.map.channel),aoMapUv:ye&&p(M.aoMap.channel),lightMapUv:we&&p(M.lightMap.channel),bumpMapUv:Ye&&p(M.bumpMap.channel),normalMapUv:ht&&p(M.normalMap.channel),displacementMapUv:Tt&&p(M.displacementMap.channel),emissiveMapUv:Pt&&p(M.emissiveMap.channel),metalnessMapUv:ft&&p(M.metalnessMap.channel),roughnessMapUv:Mt&&p(M.roughnessMap.channel),anisotropyMapUv:z&&p(M.anisotropyMap.channel),clearcoatMapUv:Y&&p(M.clearcoatMap.channel),clearcoatNormalMapUv:se&&p(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&p(M.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&p(M.iridescenceMap.channel),iridescenceThicknessMapUv:j&&p(M.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&p(M.sheenColorMap.channel),sheenRoughnessMapUv:Re&&p(M.sheenRoughnessMap.channel),specularMapUv:ge&&p(M.specularMap.channel),specularColorMapUv:pe&&p(M.specularColorMap.channel),specularIntensityMapUv:Ie&&p(M.specularIntensityMap.channel),transmissionMapUv:De&&p(M.transmissionMap.channel),thicknessMapUv:Oe&&p(M.thicknessMap.channel),alphaMapUv:le&&p(M.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(ht||N),vertexNormals:!!D.attributes.normal,vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(he||le),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.wireframe===!1&&(M.flatShading===!0||D.attributes.normal===void 0&&ht===!1&&(M.isMeshLambertMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isMeshPhysicalMaterial)),sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ne,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:ze,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:ee,decodeVideoTexture:he&&M.map.isVideoTexture===!0&&$e.getTransfer(M.map.colorSpace)===je,decodeVideoTextureEmissive:Pt&&M.emissiveMap.isVideoTexture===!0&&$e.getTransfer(M.emissiveMap.colorSpace)===je,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Sn,flipSided:M.side===qt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Me&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&M.extensions.multiDraw===!0||G)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Te.vertexUv1s=c.has(1),Te.vertexUv2s=c.has(2),Te.vertexUv3s=c.has(3),c.clear(),Te}function m(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(g(b,M),A(b,M),b.push(t.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function g(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function A(M,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),b.packedNormalMap&&a.enable(22),b.vertexNormals&&a.enable(23),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),b.numLightProbeGrids>0&&a.enable(22),b.hasPositionAttribute&&a.enable(23),M.push(a.mask)}function w(M){const b=f[M.type];let P;if(b){const C=yn[b];P=ey.clone(C.uniforms)}else P=M.uniforms;return P}function v(M,b){let P=h.get(b);return P!==void 0?++P.usedTimes:(P=new IA(t,b,M,s),l.push(P),h.set(b,P)),P}function E(M){if(--M.usedTimes===0){const b=l.indexOf(M);l[b]=l[l.length-1],l.pop(),h.delete(M.cacheKey),M.destroy()}}function y(M){o.remove(M)}function T(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:w,acquireProgram:v,releaseProgram:E,releaseShaderCache:y,programs:l,dispose:T}}function OA(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function s(a,o,c){t.get(a)[o]=c}function r(){t=new WeakMap}return{has:e,get:n,remove:i,update:s,dispose:r}}function kA(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function Qd(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function eu(){const t=[];let e=0;const n=[],i=[],s=[];function r(){e=0,n.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,_,m,g){let A=t[e];return A===void 0?(A={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:g},t[e]=A):(A.id=d.id,A.object=d,A.geometry=f,A.material=p,A.materialVariant=a(d),A.groupOrder=_,A.renderOrder=d.renderOrder,A.z=m,A.group=g),e++,A}function c(d,f,p,_,m,g){const A=o(d,f,p,_,m,g);p.transmission>0?i.push(A):p.transparent===!0?s.push(A):n.push(A)}function l(d,f,p,_,m,g){const A=o(d,f,p,_,m,g);p.transmission>0?i.unshift(A):p.transparent===!0?s.unshift(A):n.unshift(A)}function h(d,f,p){n.length>1&&n.sort(d||kA),i.length>1&&i.sort(f||Qd),s.length>1&&s.sort(f||Qd),p&&(n.reverse(),i.reverse(),s.reverse())}function u(){for(let d=e,f=t.length;d<f;d++){const p=t[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:u,sort:h}}function BA(){let t=new WeakMap;function e(i,s){const r=t.get(i);let a;return r===void 0?(a=new eu,t.set(i,[a])):s>=r.length?(a=new eu,r.push(a)):a=r[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function VA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new U,color:new We};break;case"SpotLight":n={position:new U,direction:new U,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new U,color:new We,distance:0,decay:0};break;case"HemisphereLight":n={direction:new U,skyColor:new We,groundColor:new We};break;case"RectAreaLight":n={color:new We,position:new U,halfWidth:new U,halfHeight:new U};break}return t[e.id]=n,n}}}function zA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let HA=0;function GA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function WA(t){const e=new VA,n=zA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new U);const s=new U,r=new lt,a=new lt;function o(l){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,A=0,w=0,v=0,E=0,y=0,T=0;l.sort(GA);for(let b=0,P=l.length;b<P;b++){const C=l[b],I=C.color,X=C.intensity,H=C.distance;let D=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===wi?D=C.shadow.map.texture:D=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=I.r*X,u+=I.g*X,d+=I.b*X;else if(C.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(C.sh.coefficients[$],X);T++}else if(C.isDirectionalLight){const $=e.get(C);if($.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const B=C.shadow,q=n.get(C);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,i.directionalShadow[f]=q,i.directionalShadowMap[f]=D,i.directionalShadowMatrix[f]=C.shadow.matrix,A++}i.directional[f]=$,f++}else if(C.isSpotLight){const $=e.get(C);$.position.setFromMatrixPosition(C.matrixWorld),$.color.copy(I).multiplyScalar(X),$.distance=H,$.coneCos=Math.cos(C.angle),$.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),$.decay=C.decay,i.spot[_]=$;const B=C.shadow;if(C.map&&(i.spotLightMap[E]=C.map,E++,B.updateMatrices(C),C.castShadow&&y++),i.spotLightMatrix[_]=B.matrix,C.castShadow){const q=n.get(C);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,i.spotShadow[_]=q,i.spotShadowMap[_]=D,v++}_++}else if(C.isRectAreaLight){const $=e.get(C);$.color.copy(I).multiplyScalar(X),$.halfWidth.set(C.width*.5,0,0),$.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=$,m++}else if(C.isPointLight){const $=e.get(C);if($.color.copy(C.color).multiplyScalar(C.intensity),$.distance=C.distance,$.decay=C.decay,C.castShadow){const B=C.shadow,q=n.get(C);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,q.shadowCameraNear=B.camera.near,q.shadowCameraFar=B.camera.far,i.pointShadow[p]=q,i.pointShadowMap[p]=D,i.pointShadowMatrix[p]=C.shadow.matrix,w++}i.point[p]=$,p++}else if(C.isHemisphereLight){const $=e.get(C);$.skyColor.copy(C.color).multiplyScalar(X),$.groundColor.copy(C.groundColor).multiplyScalar(X),i.hemi[g]=$,g++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_e.LTC_FLOAT_1,i.rectAreaLTC2=_e.LTC_FLOAT_2):(i.rectAreaLTC1=_e.LTC_HALF_1,i.rectAreaLTC2=_e.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const M=i.hash;(M.directionalLength!==f||M.pointLength!==p||M.spotLength!==_||M.rectAreaLength!==m||M.hemiLength!==g||M.numDirectionalShadows!==A||M.numPointShadows!==w||M.numSpotShadows!==v||M.numSpotMaps!==E||M.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=v+E-y,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=T,M.directionalLength=f,M.pointLength=p,M.spotLength=_,M.rectAreaLength=m,M.hemiLength=g,M.numDirectionalShadows=A,M.numPointShadows=w,M.numSpotShadows=v,M.numSpotMaps=E,M.numLightProbes=T,i.version=HA++)}function c(l,h){let u=0,d=0,f=0,p=0,_=0;const m=h.matrixWorldInverse;for(let g=0,A=l.length;g<A;g++){const w=l[g];if(w.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(w.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const v=i.rectArea[p];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(w.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(w.width*.5,0,0),v.halfHeight.set(0,w.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),p++}else if(w.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(w.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function tu(t){const e=new WA(t),n=[],i=[],s=[];function r(d){u.camera=d,n.length=0,i.length=0,s.length=0}function a(d){n.push(d)}function o(d){i.push(d)}function c(d){s.push(d)}function l(){e.setup(n)}function h(d){e.setupView(n,d)}const u={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function $A(t){let e=new WeakMap;function n(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new tu(t),e.set(s,[o])):r>=a.length?(o=new tu(t),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:n,dispose:i}}const XA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qA=`uniform sampler2D shadow_pass;
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
}`,YA=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],KA=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],nu=new lt,Ts=new U,so=new U;function ZA(t,e,n){let i=new Bc;const s=new Fe,r=new Fe,a=new dt,o=new ry,c=new ay,l={},h=n.maxTextureSize,u={[ri]:qt,[qt]:ri,[Sn]:Sn},d=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:XA,fragmentShader:qA}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new zt;p.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new pn(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kr;let g=this.type;this.render=function(y,T,M){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;this.type===pv&&(Le("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=kr);const b=t.getRenderTarget(),P=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),I=t.state;I.setBlending(kn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const X=g!==this.type;X&&T.traverse(function(H){H.material&&(Array.isArray(H.material)?H.material.forEach(D=>D.needsUpdate=!0):H.material.needsUpdate=!0)});for(let H=0,D=y.length;H<D;H++){const $=y[H],B=$.shadow;if(B===void 0){Le("WebGLShadowMap:",$,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const q=B.getFrameExtents();s.multiply(q),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,B.mapSize.y=r.y));const te=t.state.buffers.depth.getReversed();if(B.camera._reversedDepth=te,B.map===null||X===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Is){if($.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Tn(s.x,s.y,{format:wi,type:Vn,minFilter:Ut,magFilter:Ut,generateMipmaps:!1}),B.map.texture.name=$.name+".shadowMap",B.map.depthTexture=new os(s.x,s.y,En),B.map.depthTexture.name=$.name+".shadowMapDepth",B.map.depthTexture.format=zn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=It,B.map.depthTexture.magFilter=It}else $.isPointLight?(B.map=new wh(s.x),B.map.depthTexture=new NM(s.x,Rn)):(B.map=new Tn(s.x,s.y),B.map.depthTexture=new os(s.x,s.y,Rn)),B.map.depthTexture.name=$.name+".shadowMap",B.map.depthTexture.format=zn,this.type===kr?(B.map.depthTexture.compareFunction=te?Fc:Nc,B.map.depthTexture.minFilter=Ut,B.map.depthTexture.magFilter=Ut):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=It,B.map.depthTexture.magFilter=It);B.camera.updateProjectionMatrix()}const re=B.map.isWebGLCubeRenderTarget?6:1;for(let ce=0;ce<re;ce++){if(B.map.isWebGLCubeRenderTarget)t.setRenderTarget(B.map,ce),t.clear();else{ce===0&&(t.setRenderTarget(B.map),t.clear());const ae=B.getViewport(ce);a.set(r.x*ae.x,r.y*ae.y,r.x*ae.z,r.y*ae.w),I.viewport(a)}if($.isPointLight){const ae=B.camera,ze=B.matrix,Ze=$.distance||ae.far;Ze!==ae.far&&(ae.far=Ze,ae.updateProjectionMatrix()),Ts.setFromMatrixPosition($.matrixWorld),ae.position.copy(Ts),so.copy(ae.position),so.add(YA[ce]),ae.up.copy(KA[ce]),ae.lookAt(so),ae.updateMatrixWorld(),ze.makeTranslation(-Ts.x,-Ts.y,-Ts.z),nu.multiplyMatrices(ae.projectionMatrix,ae.matrixWorldInverse),B._frustum.setFromProjectionMatrix(nu,ae.coordinateSystem,ae.reversedDepth)}else B.updateMatrices($);i=B.getFrustum(),v(T,M,B.camera,$,this.type)}B.isPointLightShadow!==!0&&this.type===Is&&A(B,M),B.needsUpdate=!1}g=this.type,m.needsUpdate=!1,t.setRenderTarget(b,P,C)};function A(y,T){const M=e.update(_);d.defines.VSM_SAMPLES!==y.blurSamples&&(d.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new Tn(s.x,s.y,{format:wi,type:Vn})),d.uniforms.shadow_pass.value=y.map.depthTexture,d.uniforms.resolution.value=y.mapSize,d.uniforms.radius.value=y.radius,t.setRenderTarget(y.mapPass),t.clear(),t.renderBufferDirect(T,null,M,d,_,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,t.setRenderTarget(y.map),t.clear(),t.renderBufferDirect(T,null,M,f,_,null)}function w(y,T,M,b){let P=null;const C=M.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(C!==void 0)P=C;else if(P=M.isPointLight===!0?c:o,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const I=P.uuid,X=T.uuid;let H=l[I];H===void 0&&(H={},l[I]=H);let D=H[X];D===void 0&&(D=P.clone(),H[X]=D,T.addEventListener("dispose",E)),P=D}if(P.visible=T.visible,P.wireframe=T.wireframe,b===Is?P.side=T.shadowSide!==null?T.shadowSide:T.side:P.side=T.shadowSide!==null?T.shadowSide:u[T.side],P.alphaMap=T.alphaMap,P.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,P.map=T.map,P.clipShadows=T.clipShadows,P.clippingPlanes=T.clippingPlanes,P.clipIntersection=T.clipIntersection,P.displacementMap=T.displacementMap,P.displacementScale=T.displacementScale,P.displacementBias=T.displacementBias,P.wireframeLinewidth=T.wireframeLinewidth,P.linewidth=T.linewidth,M.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const I=t.properties.get(P);I.light=M}return P}function v(y,T,M,b,P){if(y.visible===!1)return;if(y.layers.test(T.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&P===Is)&&(!y.frustumCulled||i.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,y.matrixWorld);const X=e.update(y),H=y.material;if(Array.isArray(H)){const D=X.groups;for(let $=0,B=D.length;$<B;$++){const q=D[$],te=H[q.materialIndex];if(te&&te.visible){const re=w(y,te,b,P);y.onBeforeShadow(t,y,T,M,X,re,q),t.renderBufferDirect(M,null,X,re,y,q),y.onAfterShadow(t,y,T,M,X,re,q)}}}else if(H.visible){const D=w(y,H,b,P);y.onBeforeShadow(t,y,T,M,X,D,null),t.renderBufferDirect(M,null,X,D,y,null),y.onAfterShadow(t,y,T,M,X,D,null)}}const I=y.children;for(let X=0,H=I.length;X<H;X++)v(I[X],T,M,b,P)}function E(y){y.target.removeEventListener("dispose",E);for(const M in l){const b=l[M],P=y.target.uuid;P in b&&(b[P].dispose(),delete b[P])}}}function JA(t,e){function n(){let L=!1;const le=new dt;let J=null;const me=new dt(0,0,0,0);return{setMask:function(Me){J!==Me&&!L&&(t.colorMask(Me,Me,Me,Me),J=Me)},setLocked:function(Me){L=Me},setClear:function(Me,ee,Te,be,pt){pt===!0&&(Me*=be,ee*=be,Te*=be),le.set(Me,ee,Te,be),me.equals(le)===!1&&(t.clearColor(Me,ee,Te,be),me.copy(le))},reset:function(){L=!1,J=null,me.set(-1,0,0,0)}}}function i(){let L=!1,le=!1,J=null,me=null,Me=null;return{setReversed:function(ee){if(le!==ee){const Te=e.get("EXT_clip_control");ee?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),le=ee;const be=Me;Me=null,this.setClear(be)}},getReversed:function(){return le},setTest:function(ee){ee?ie(t.DEPTH_TEST):Ne(t.DEPTH_TEST)},setMask:function(ee){J!==ee&&!L&&(t.depthMask(ee),J=ee)},setFunc:function(ee){if(le&&(ee=qv[ee]),me!==ee){switch(ee){case So:t.depthFunc(t.NEVER);break;case Eo:t.depthFunc(t.ALWAYS);break;case bo:t.depthFunc(t.LESS);break;case rs:t.depthFunc(t.LEQUAL);break;case Ao:t.depthFunc(t.EQUAL);break;case To:t.depthFunc(t.GEQUAL);break;case wo:t.depthFunc(t.GREATER);break;case Ro:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}me=ee}},setLocked:function(ee){L=ee},setClear:function(ee){Me!==ee&&(Me=ee,le&&(ee=1-ee),t.clearDepth(ee))},reset:function(){L=!1,J=null,me=null,Me=null,le=!1}}}function s(){let L=!1,le=null,J=null,me=null,Me=null,ee=null,Te=null,be=null,pt=null;return{setTest:function(st){L||(st?ie(t.STENCIL_TEST):Ne(t.STENCIL_TEST))},setMask:function(st){le!==st&&!L&&(t.stencilMask(st),le=st)},setFunc:function(st,mn,gn){(J!==st||me!==mn||Me!==gn)&&(t.stencilFunc(st,mn,gn),J=st,me=mn,Me=gn)},setOp:function(st,mn,gn){(ee!==st||Te!==mn||be!==gn)&&(t.stencilOp(st,mn,gn),ee=st,Te=mn,be=gn)},setLocked:function(st){L=st},setClear:function(st){pt!==st&&(t.clearStencil(st),pt=st)},reset:function(){L=!1,le=null,J=null,me=null,Me=null,ee=null,Te=null,be=null,pt=null}}}const r=new n,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,A=null,w=null,v=null,E=null,y=null,T=null,M=new We(0,0,0),b=0,P=!1,C=null,I=null,X=null,H=null,D=null;const $=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,q=0;const te=t.getParameter(t.VERSION);te.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(te)[1]),B=q>=1):te.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),B=q>=2);let re=null,ce={};const ae=t.getParameter(t.SCISSOR_BOX),ze=t.getParameter(t.VIEWPORT),Ze=new dt().fromArray(ae),He=new dt().fromArray(ze);function Z(L,le,J,me){const Me=new Uint8Array(4),ee=t.createTexture();t.bindTexture(L,ee),t.texParameteri(L,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(L,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Te=0;Te<J;Te++)L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY?t.texImage3D(le,0,t.RGBA,1,1,me,0,t.RGBA,t.UNSIGNED_BYTE,Me):t.texImage2D(le+Te,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Me);return ee}const oe={};oe[t.TEXTURE_2D]=Z(t.TEXTURE_2D,t.TEXTURE_2D,1),oe[t.TEXTURE_CUBE_MAP]=Z(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[t.TEXTURE_2D_ARRAY]=Z(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),oe[t.TEXTURE_3D]=Z(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(t.DEPTH_TEST),a.setFunc(rs),Ye(!1),ht($l),ie(t.CULL_FACE),ye(kn);function ie(L){h[L]!==!0&&(t.enable(L),h[L]=!0)}function Ne(L){h[L]!==!1&&(t.disable(L),h[L]=!1)}function Q(L,le){return d[L]!==le?(t.bindFramebuffer(L,le),d[L]=le,L===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=le),L===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=le),!0):!1}function G(L,le){let J=p,me=!1;if(L){J=f.get(le),J===void 0&&(J=[],f.set(le,J));const Me=L.textures;if(J.length!==Me.length||J[0]!==t.COLOR_ATTACHMENT0){for(let ee=0,Te=Me.length;ee<Te;ee++)J[ee]=t.COLOR_ATTACHMENT0+ee;J.length=Me.length,me=!0}}else J[0]!==t.BACK&&(J[0]=t.BACK,me=!0);me&&t.drawBuffers(J)}function he(L){return _!==L?(t.useProgram(L),_=L,!0):!1}const ne={[gi]:t.FUNC_ADD,[gv]:t.FUNC_SUBTRACT,[_v]:t.FUNC_REVERSE_SUBTRACT};ne[xv]=t.MIN,ne[vv]=t.MAX;const de={[Mv]:t.ZERO,[yv]:t.ONE,[Sv]:t.SRC_COLOR,[Mo]:t.SRC_ALPHA,[Rv]:t.SRC_ALPHA_SATURATE,[Tv]:t.DST_COLOR,[bv]:t.DST_ALPHA,[Ev]:t.ONE_MINUS_SRC_COLOR,[yo]:t.ONE_MINUS_SRC_ALPHA,[wv]:t.ONE_MINUS_DST_COLOR,[Av]:t.ONE_MINUS_DST_ALPHA,[Cv]:t.CONSTANT_COLOR,[Pv]:t.ONE_MINUS_CONSTANT_COLOR,[Iv]:t.CONSTANT_ALPHA,[Lv]:t.ONE_MINUS_CONSTANT_ALPHA};function ye(L,le,J,me,Me,ee,Te,be,pt,st){if(L===kn){m===!0&&(Ne(t.BLEND),m=!1);return}if(m===!1&&(ie(t.BLEND),m=!0),L!==mv){if(L!==g||st!==P){if((A!==gi||E!==gi)&&(t.blendEquation(t.FUNC_ADD),A=gi,E=gi),st)switch(L){case ns:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Xl:t.blendFunc(t.ONE,t.ONE);break;case ql:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Yl:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:qe("WebGLState: Invalid blending: ",L);break}else switch(L){case ns:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Xl:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case ql:qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Yl:qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:qe("WebGLState: Invalid blending: ",L);break}w=null,v=null,y=null,T=null,M.set(0,0,0),b=0,g=L,P=st}return}Me=Me||le,ee=ee||J,Te=Te||me,(le!==A||Me!==E)&&(t.blendEquationSeparate(ne[le],ne[Me]),A=le,E=Me),(J!==w||me!==v||ee!==y||Te!==T)&&(t.blendFuncSeparate(de[J],de[me],de[ee],de[Te]),w=J,v=me,y=ee,T=Te),(be.equals(M)===!1||pt!==b)&&(t.blendColor(be.r,be.g,be.b,pt),M.copy(be),b=pt),g=L,P=!1}function we(L,le){L.side===Sn?Ne(t.CULL_FACE):ie(t.CULL_FACE);let J=L.side===qt;le&&(J=!J),Ye(J),L.blending===ns&&L.transparent===!1?ye(kn):ye(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const me=L.stencilWrite;o.setTest(me),me&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Pt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):Ne(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(L){C!==L&&(L?t.frontFace(t.CW):t.frontFace(t.CCW),C=L)}function ht(L){L!==hv?(ie(t.CULL_FACE),L!==I&&(L===$l?t.cullFace(t.BACK):L===fv?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ne(t.CULL_FACE),I=L}function Tt(L){L!==X&&(B&&t.lineWidth(L),X=L)}function Pt(L,le,J){L?(ie(t.POLYGON_OFFSET_FILL),(H!==le||D!==J)&&(H=le,D=J,a.getReversed()&&(le=-le),t.polygonOffset(le,J))):Ne(t.POLYGON_OFFSET_FILL)}function ft(L){L?ie(t.SCISSOR_TEST):Ne(t.SCISSOR_TEST)}function Mt(L){L===void 0&&(L=t.TEXTURE0+$-1),re!==L&&(t.activeTexture(L),re=L)}function N(L,le,J){J===void 0&&(re===null?J=t.TEXTURE0+$-1:J=re);let me=ce[J];me===void 0&&(me={type:void 0,texture:void 0},ce[J]=me),(me.type!==L||me.texture!==le)&&(re!==J&&(t.activeTexture(J),re=J),t.bindTexture(L,le||oe[L]),me.type=L,me.texture=le)}function Ht(){const L=ce[re];L!==void 0&&L.type!==void 0&&(t.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Je(){try{t.compressedTexImage2D(...arguments)}catch(L){qe("WebGLState:",L)}}function R(){try{t.compressedTexImage3D(...arguments)}catch(L){qe("WebGLState:",L)}}function x(){try{t.texSubImage2D(...arguments)}catch(L){qe("WebGLState:",L)}}function O(){try{t.texSubImage3D(...arguments)}catch(L){qe("WebGLState:",L)}}function z(){try{t.compressedTexSubImage2D(...arguments)}catch(L){qe("WebGLState:",L)}}function Y(){try{t.compressedTexSubImage3D(...arguments)}catch(L){qe("WebGLState:",L)}}function se(){try{t.texStorage2D(...arguments)}catch(L){qe("WebGLState:",L)}}function ue(){try{t.texStorage3D(...arguments)}catch(L){qe("WebGLState:",L)}}function K(){try{t.texImage2D(...arguments)}catch(L){qe("WebGLState:",L)}}function j(){try{t.texImage3D(...arguments)}catch(L){qe("WebGLState:",L)}}function fe(L){return u[L]!==void 0?u[L]:t.getParameter(L)}function Re(L,le){u[L]!==le&&(t.pixelStorei(L,le),u[L]=le)}function ge(L){Ze.equals(L)===!1&&(t.scissor(L.x,L.y,L.z,L.w),Ze.copy(L))}function pe(L){He.equals(L)===!1&&(t.viewport(L.x,L.y,L.z,L.w),He.copy(L))}function Ie(L,le){let J=l.get(le);J===void 0&&(J=new WeakMap,l.set(le,J));let me=J.get(L);me===void 0&&(me=t.getUniformBlockIndex(le,L.name),J.set(L,me))}function De(L,le){const me=l.get(le).get(L);c.get(le)!==me&&(t.uniformBlockBinding(le,me,L.__bindingPointIndex),c.set(le,me))}function Oe(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),h={},u={},re=null,ce={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,A=null,w=null,v=null,E=null,y=null,T=null,M=new We(0,0,0),b=0,P=!1,C=null,I=null,X=null,H=null,D=null,Ze.set(0,0,t.canvas.width,t.canvas.height),He.set(0,0,t.canvas.width,t.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:Ne,bindFramebuffer:Q,drawBuffers:G,useProgram:he,setBlending:ye,setMaterial:we,setFlipSided:Ye,setCullFace:ht,setLineWidth:Tt,setPolygonOffset:Pt,setScissorTest:ft,activeTexture:Mt,bindTexture:N,unbindTexture:Ht,compressedTexImage2D:Je,compressedTexImage3D:R,texImage2D:K,texImage3D:j,pixelStorei:Re,getParameter:fe,updateUBOMapping:Ie,uniformBlockBinding:De,texStorage2D:se,texStorage3D:ue,texSubImage2D:x,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:Y,scissor:ge,viewport:pe,reset:Oe}}function jA(t,e,n,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Fe,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,x){return p?new OffscreenCanvas(R,x):aa("canvas")}function m(R,x,O){let z=1;const Y=Je(R);if((Y.width>O||Y.height>O)&&(z=O/Math.max(Y.width,Y.height)),z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const se=Math.floor(z*Y.width),ue=Math.floor(z*Y.height);d===void 0&&(d=_(se,ue));const K=x?_(se,ue):d;return K.width=se,K.height=ue,K.getContext("2d").drawImage(R,0,0,se,ue),Le("WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+se+"x"+ue+")."),K}else return"data"in R&&Le("WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),R;return R}function g(R){return R.generateMipmaps}function A(R){t.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?t.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function v(R,x,O,z,Y,se=!1){if(R!==null){if(t[R]!==void 0)return t[R];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ue;z&&(ue=e.get("EXT_texture_norm16"),ue||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=x;if(x===t.RED&&(O===t.FLOAT&&(K=t.R32F),O===t.HALF_FLOAT&&(K=t.R16F),O===t.UNSIGNED_BYTE&&(K=t.R8),O===t.UNSIGNED_SHORT&&ue&&(K=ue.R16_EXT),O===t.SHORT&&ue&&(K=ue.R16_SNORM_EXT)),x===t.RED_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.R8UI),O===t.UNSIGNED_SHORT&&(K=t.R16UI),O===t.UNSIGNED_INT&&(K=t.R32UI),O===t.BYTE&&(K=t.R8I),O===t.SHORT&&(K=t.R16I),O===t.INT&&(K=t.R32I)),x===t.RG&&(O===t.FLOAT&&(K=t.RG32F),O===t.HALF_FLOAT&&(K=t.RG16F),O===t.UNSIGNED_BYTE&&(K=t.RG8),O===t.UNSIGNED_SHORT&&ue&&(K=ue.RG16_EXT),O===t.SHORT&&ue&&(K=ue.RG16_SNORM_EXT)),x===t.RG_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.RG8UI),O===t.UNSIGNED_SHORT&&(K=t.RG16UI),O===t.UNSIGNED_INT&&(K=t.RG32UI),O===t.BYTE&&(K=t.RG8I),O===t.SHORT&&(K=t.RG16I),O===t.INT&&(K=t.RG32I)),x===t.RGB_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.RGB8UI),O===t.UNSIGNED_SHORT&&(K=t.RGB16UI),O===t.UNSIGNED_INT&&(K=t.RGB32UI),O===t.BYTE&&(K=t.RGB8I),O===t.SHORT&&(K=t.RGB16I),O===t.INT&&(K=t.RGB32I)),x===t.RGBA_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.RGBA8UI),O===t.UNSIGNED_SHORT&&(K=t.RGBA16UI),O===t.UNSIGNED_INT&&(K=t.RGBA32UI),O===t.BYTE&&(K=t.RGBA8I),O===t.SHORT&&(K=t.RGBA16I),O===t.INT&&(K=t.RGBA32I)),x===t.RGB&&(O===t.UNSIGNED_SHORT&&ue&&(K=ue.RGB16_EXT),O===t.SHORT&&ue&&(K=ue.RGB16_SNORM_EXT),O===t.UNSIGNED_INT_5_9_9_9_REV&&(K=t.RGB9_E5),O===t.UNSIGNED_INT_10F_11F_11F_REV&&(K=t.R11F_G11F_B10F)),x===t.RGBA){const j=se?ra:$e.getTransfer(Y);O===t.FLOAT&&(K=t.RGBA32F),O===t.HALF_FLOAT&&(K=t.RGBA16F),O===t.UNSIGNED_BYTE&&(K=j===je?t.SRGB8_ALPHA8:t.RGBA8),O===t.UNSIGNED_SHORT&&ue&&(K=ue.RGBA16_EXT),O===t.SHORT&&ue&&(K=ue.RGBA16_SNORM_EXT),O===t.UNSIGNED_SHORT_4_4_4_4&&(K=t.RGBA4),O===t.UNSIGNED_SHORT_5_5_5_1&&(K=t.RGB5_A1)}return(K===t.R16F||K===t.R32F||K===t.RG16F||K===t.RG32F||K===t.RGBA16F||K===t.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function E(R,x){let O;return R?x===null||x===Rn||x===Vs?O=t.DEPTH24_STENCIL8:x===En?O=t.DEPTH32F_STENCIL8:x===Bs&&(O=t.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Rn||x===Vs?O=t.DEPTH_COMPONENT24:x===En?O=t.DEPTH_COMPONENT32F:x===Bs&&(O=t.DEPTH_COMPONENT16),O}function y(R,x){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==It&&R.minFilter!==Ut?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function T(R){const x=R.target;x.removeEventListener("dispose",T),b(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&u.delete(x)}function M(R){const x=R.target;x.removeEventListener("dispose",M),C(x)}function b(R){const x=i.get(R);if(x.__webglInit===void 0)return;const O=R.source,z=f.get(O);if(z){const Y=z[x.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&P(R),Object.keys(z).length===0&&f.delete(O)}i.remove(R)}function P(R){const x=i.get(R);t.deleteTexture(x.__webglTexture);const O=R.source,z=f.get(O);delete z[x.__cacheKey],a.memory.textures--}function C(R){const x=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(x.__webglFramebuffer[z]))for(let Y=0;Y<x.__webglFramebuffer[z].length;Y++)t.deleteFramebuffer(x.__webglFramebuffer[z][Y]);else t.deleteFramebuffer(x.__webglFramebuffer[z]);x.__webglDepthbuffer&&t.deleteRenderbuffer(x.__webglDepthbuffer[z])}else{if(Array.isArray(x.__webglFramebuffer))for(let z=0;z<x.__webglFramebuffer.length;z++)t.deleteFramebuffer(x.__webglFramebuffer[z]);else t.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&t.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&t.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let z=0;z<x.__webglColorRenderbuffer.length;z++)x.__webglColorRenderbuffer[z]&&t.deleteRenderbuffer(x.__webglColorRenderbuffer[z]);x.__webglDepthRenderbuffer&&t.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const O=R.textures;for(let z=0,Y=O.length;z<Y;z++){const se=i.get(O[z]);se.__webglTexture&&(t.deleteTexture(se.__webglTexture),a.memory.textures--),i.remove(O[z])}i.remove(R)}let I=0;function X(){I=0}function H(){return I}function D(R){I=R}function $(){const R=I;return R>=s.maxTextures&&Le("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function B(R){const x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function q(R,x){const O=i.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const z=R.image;if(z===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{Ne(O,R,x);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,O.__webglTexture,t.TEXTURE0+x)}function te(R,x){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ne(O,R,x);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,O.__webglTexture,t.TEXTURE0+x)}function re(R,x){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ne(O,R,x);return}n.bindTexture(t.TEXTURE_3D,O.__webglTexture,t.TEXTURE0+x)}function ce(R,x){const O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){Q(O,R,x);return}n.bindTexture(t.TEXTURE_CUBE_MAP,O.__webglTexture,t.TEXTURE0+x)}const ae={[Co]:t.REPEAT,[Un]:t.CLAMP_TO_EDGE,[Po]:t.MIRRORED_REPEAT},ze={[It]:t.NEAREST,[Fv]:t.NEAREST_MIPMAP_NEAREST,[ar]:t.NEAREST_MIPMAP_LINEAR,[Ut]:t.LINEAR,[Ra]:t.LINEAR_MIPMAP_NEAREST,[vi]:t.LINEAR_MIPMAP_LINEAR},Ze={[kv]:t.NEVER,[Gv]:t.ALWAYS,[Bv]:t.LESS,[Nc]:t.LEQUAL,[Vv]:t.EQUAL,[Fc]:t.GEQUAL,[zv]:t.GREATER,[Hv]:t.NOTEQUAL};function He(R,x){if(x.type===En&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Ut||x.magFilter===Ra||x.magFilter===ar||x.magFilter===vi||x.minFilter===Ut||x.minFilter===Ra||x.minFilter===ar||x.minFilter===vi)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,ae[x.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,ae[x.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,ae[x.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,ze[x.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,ze[x.minFilter]),x.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,Ze[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===It||x.minFilter!==ar&&x.minFilter!==vi||x.type===En&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Z(R,x){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",T));const z=x.source;let Y=f.get(z);Y===void 0&&(Y={},f.set(z,Y));const se=B(x);if(se!==R.__cacheKey){Y[se]===void 0&&(Y[se]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Y[se].usedTimes++;const ue=Y[R.__cacheKey];ue!==void 0&&(Y[R.__cacheKey].usedTimes--,ue.usedTimes===0&&P(x)),R.__cacheKey=se,R.__webglTexture=Y[se].texture}return O}function oe(R,x,O){return Math.floor(Math.floor(R/O)/x)}function ie(R,x,O,z){const se=R.updateRanges;if(se.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,x.width,x.height,O,z,x.data);else{se.sort((Re,ge)=>Re.start-ge.start);let ue=0;for(let Re=1;Re<se.length;Re++){const ge=se[ue],pe=se[Re],Ie=ge.start+ge.count,De=oe(pe.start,x.width,4),Oe=oe(ge.start,x.width,4);pe.start<=Ie+1&&De===Oe&&oe(pe.start+pe.count-1,x.width,4)===De?ge.count=Math.max(ge.count,pe.start+pe.count-ge.start):(++ue,se[ue]=pe)}se.length=ue+1;const K=n.getParameter(t.UNPACK_ROW_LENGTH),j=n.getParameter(t.UNPACK_SKIP_PIXELS),fe=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,x.width);for(let Re=0,ge=se.length;Re<ge;Re++){const pe=se[Re],Ie=Math.floor(pe.start/4),De=Math.ceil(pe.count/4),Oe=Ie%x.width,L=Math.floor(Ie/x.width),le=De,J=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Oe),n.pixelStorei(t.UNPACK_SKIP_ROWS,L),n.texSubImage2D(t.TEXTURE_2D,0,Oe,L,le,J,O,z,x.data)}R.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,K),n.pixelStorei(t.UNPACK_SKIP_PIXELS,j),n.pixelStorei(t.UNPACK_SKIP_ROWS,fe)}}function Ne(R,x,O){let z=t.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(z=t.TEXTURE_2D_ARRAY),x.isData3DTexture&&(z=t.TEXTURE_3D);const Y=Z(R,x),se=x.source;n.bindTexture(z,R.__webglTexture,t.TEXTURE0+O);const ue=i.get(se);if(se.version!==ue.__version||Y===!0){if(n.activeTexture(t.TEXTURE0+O),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const J=$e.getPrimaries($e.workingColorSpace),me=x.colorSpace===ei?null:$e.getPrimaries(x.colorSpace),Me=x.colorSpace===ei||J===me?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me)}n.pixelStorei(t.UNPACK_ALIGNMENT,x.unpackAlignment);let j=m(x.image,!1,s.maxTextureSize);j=Ht(x,j);const fe=r.convert(x.format,x.colorSpace),Re=r.convert(x.type);let ge=v(x.internalFormat,fe,Re,x.normalized,x.colorSpace,x.isVideoTexture);He(z,x);let pe;const Ie=x.mipmaps,De=x.isVideoTexture!==!0,Oe=ue.__version===void 0||Y===!0,L=se.dataReady,le=y(x,j);if(x.isDepthTexture)ge=E(x.format===Mi,x.type),Oe&&(De?n.texStorage2D(t.TEXTURE_2D,1,ge,j.width,j.height):n.texImage2D(t.TEXTURE_2D,0,ge,j.width,j.height,0,fe,Re,null));else if(x.isDataTexture)if(Ie.length>0){De&&Oe&&n.texStorage2D(t.TEXTURE_2D,le,ge,Ie[0].width,Ie[0].height);for(let J=0,me=Ie.length;J<me;J++)pe=Ie[J],De?L&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,pe.width,pe.height,fe,Re,pe.data):n.texImage2D(t.TEXTURE_2D,J,ge,pe.width,pe.height,0,fe,Re,pe.data);x.generateMipmaps=!1}else De?(Oe&&n.texStorage2D(t.TEXTURE_2D,le,ge,j.width,j.height),L&&ie(x,j,fe,Re)):n.texImage2D(t.TEXTURE_2D,0,ge,j.width,j.height,0,fe,Re,j.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){De&&Oe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,le,ge,Ie[0].width,Ie[0].height,j.depth);for(let J=0,me=Ie.length;J<me;J++)if(pe=Ie[J],x.format!==fn)if(fe!==null)if(De){if(L)if(x.layerUpdates.size>0){const Me=Dd(pe.width,pe.height,x.format,x.type);for(const ee of x.layerUpdates){const Te=pe.data.subarray(ee*Me/pe.data.BYTES_PER_ELEMENT,(ee+1)*Me/pe.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,ee,pe.width,pe.height,1,fe,Te)}x.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,pe.width,pe.height,j.depth,fe,pe.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,J,ge,pe.width,pe.height,j.depth,0,pe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?L&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,pe.width,pe.height,j.depth,fe,Re,pe.data):n.texImage3D(t.TEXTURE_2D_ARRAY,J,ge,pe.width,pe.height,j.depth,0,fe,Re,pe.data)}else{De&&Oe&&n.texStorage2D(t.TEXTURE_2D,le,ge,Ie[0].width,Ie[0].height);for(let J=0,me=Ie.length;J<me;J++)pe=Ie[J],x.format!==fn?fe!==null?De?L&&n.compressedTexSubImage2D(t.TEXTURE_2D,J,0,0,pe.width,pe.height,fe,pe.data):n.compressedTexImage2D(t.TEXTURE_2D,J,ge,pe.width,pe.height,0,pe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?L&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,pe.width,pe.height,fe,Re,pe.data):n.texImage2D(t.TEXTURE_2D,J,ge,pe.width,pe.height,0,fe,Re,pe.data)}else if(x.isDataArrayTexture)if(De){if(Oe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,le,ge,j.width,j.height,j.depth),L)if(x.layerUpdates.size>0){const J=Dd(j.width,j.height,x.format,x.type);for(const me of x.layerUpdates){const Me=j.data.subarray(me*J/j.data.BYTES_PER_ELEMENT,(me+1)*J/j.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,me,j.width,j.height,1,fe,Re,Me)}x.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,fe,Re,j.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,ge,j.width,j.height,j.depth,0,fe,Re,j.data);else if(x.isData3DTexture)De?(Oe&&n.texStorage3D(t.TEXTURE_3D,le,ge,j.width,j.height,j.depth),L&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,fe,Re,j.data)):n.texImage3D(t.TEXTURE_3D,0,ge,j.width,j.height,j.depth,0,fe,Re,j.data);else if(x.isFramebufferTexture){if(Oe)if(De)n.texStorage2D(t.TEXTURE_2D,le,ge,j.width,j.height);else{let J=j.width,me=j.height;for(let Me=0;Me<le;Me++)n.texImage2D(t.TEXTURE_2D,Me,ge,J,me,0,fe,Re,null),J>>=1,me>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in t){const J=t.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),j.parentNode!==J){J.appendChild(j),u.add(x),J.onpaint=me=>{const Me=me.changedElements;for(const ee of u)Me.includes(ee.image)&&(ee.needsUpdate=!0)},J.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,j);else{const Me=t.RGBA,ee=t.RGBA,Te=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,Me,ee,Te,j)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Ie.length>0){if(De&&Oe){const J=Je(Ie[0]);n.texStorage2D(t.TEXTURE_2D,le,ge,J.width,J.height)}for(let J=0,me=Ie.length;J<me;J++)pe=Ie[J],De?L&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,fe,Re,pe):n.texImage2D(t.TEXTURE_2D,J,ge,fe,Re,pe);x.generateMipmaps=!1}else if(De){if(Oe){const J=Je(j);n.texStorage2D(t.TEXTURE_2D,le,ge,J.width,J.height)}L&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,fe,Re,j)}else n.texImage2D(t.TEXTURE_2D,0,ge,fe,Re,j);g(x)&&A(z),ue.__version=se.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function Q(R,x,O){if(x.image.length!==6)return;const z=Z(R,x),Y=x.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+O);const se=i.get(Y);if(Y.version!==se.__version||z===!0){n.activeTexture(t.TEXTURE0+O);const ue=$e.getPrimaries($e.workingColorSpace),K=x.colorSpace===ei?null:$e.getPrimaries(x.colorSpace),j=x.colorSpace===ei||ue===K?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const fe=x.isCompressedTexture||x.image[0].isCompressedTexture,Re=x.image[0]&&x.image[0].isDataTexture,ge=[];for(let ee=0;ee<6;ee++)!fe&&!Re?ge[ee]=m(x.image[ee],!0,s.maxCubemapSize):ge[ee]=Re?x.image[ee].image:x.image[ee],ge[ee]=Ht(x,ge[ee]);const pe=ge[0],Ie=r.convert(x.format,x.colorSpace),De=r.convert(x.type),Oe=v(x.internalFormat,Ie,De,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,le=se.__version===void 0||z===!0,J=Y.dataReady;let me=y(x,pe);He(t.TEXTURE_CUBE_MAP,x);let Me;if(fe){L&&le&&n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Oe,pe.width,pe.height);for(let ee=0;ee<6;ee++){Me=ge[ee].mipmaps;for(let Te=0;Te<Me.length;Te++){const be=Me[Te];x.format!==fn?Ie!==null?L?J&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,0,0,be.width,be.height,Ie,be.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,Oe,be.width,be.height,0,be.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,0,0,be.width,be.height,Ie,De,be.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,Oe,be.width,be.height,0,Ie,De,be.data)}}}else{if(Me=x.mipmaps,L&&le){Me.length>0&&me++;const ee=Je(ge[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Oe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(Re){L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ge[ee].width,ge[ee].height,Ie,De,ge[ee].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Oe,ge[ee].width,ge[ee].height,0,Ie,De,ge[ee].data);for(let Te=0;Te<Me.length;Te++){const pt=Me[Te].image[ee].image;L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,0,0,pt.width,pt.height,Ie,De,pt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,Oe,pt.width,pt.height,0,Ie,De,pt.data)}}else{L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ie,De,ge[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Oe,Ie,De,ge[ee]);for(let Te=0;Te<Me.length;Te++){const be=Me[Te];L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,0,0,Ie,De,be.image[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,Oe,Ie,De,be.image[ee])}}}g(x)&&A(t.TEXTURE_CUBE_MAP),se.__version=Y.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function G(R,x,O,z,Y,se){const ue=r.convert(O.format,O.colorSpace),K=r.convert(O.type),j=v(O.internalFormat,ue,K,O.normalized,O.colorSpace),fe=i.get(x),Re=i.get(O);if(Re.__renderTarget=x,!fe.__hasExternalTextures){const ge=Math.max(1,x.width>>se),pe=Math.max(1,x.height>>se);Y===t.TEXTURE_3D||Y===t.TEXTURE_2D_ARRAY?n.texImage3D(Y,se,j,ge,pe,x.depth,0,ue,K,null):n.texImage2D(Y,se,j,ge,pe,0,ue,K,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),Mt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,z,Y,Re.__webglTexture,0,ft(x)):(Y===t.TEXTURE_2D||Y>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,z,Y,Re.__webglTexture,se),n.bindFramebuffer(t.FRAMEBUFFER,null)}function he(R,x,O){if(t.bindRenderbuffer(t.RENDERBUFFER,R),x.depthBuffer){const z=x.depthTexture,Y=z&&z.isDepthTexture?z.type:null,se=E(x.stencilBuffer,Y),ue=x.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Mt(x)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ft(x),se,x.width,x.height):O?t.renderbufferStorageMultisample(t.RENDERBUFFER,ft(x),se,x.width,x.height):t.renderbufferStorage(t.RENDERBUFFER,se,x.width,x.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ue,t.RENDERBUFFER,R)}else{const z=x.textures;for(let Y=0;Y<z.length;Y++){const se=z[Y],ue=r.convert(se.format,se.colorSpace),K=r.convert(se.type),j=v(se.internalFormat,ue,K,se.normalized,se.colorSpace);Mt(x)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ft(x),j,x.width,x.height):O?t.renderbufferStorageMultisample(t.RENDERBUFFER,ft(x),j,x.width,x.height):t.renderbufferStorage(t.RENDERBUFFER,j,x.width,x.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ne(R,x,O){const z=x.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Y=i.get(x.depthTexture);if(Y.__renderTarget=x,(!Y.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z){if(Y.__webglInit===void 0&&(Y.__webglInit=!0,x.depthTexture.addEventListener("dispose",T)),Y.__webglTexture===void 0){Y.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture),He(t.TEXTURE_CUBE_MAP,x.depthTexture);const fe=r.convert(x.depthTexture.format),Re=r.convert(x.depthTexture.type);let ge;x.depthTexture.format===zn?ge=t.DEPTH_COMPONENT24:x.depthTexture.format===Mi&&(ge=t.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ge,x.width,x.height,0,fe,Re,null)}}else q(x.depthTexture,0);const se=Y.__webglTexture,ue=ft(x),K=z?t.TEXTURE_CUBE_MAP_POSITIVE_X+O:t.TEXTURE_2D,j=x.depthTexture.format===Mi?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(x.depthTexture.format===zn)Mt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,j,K,se,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,j,K,se,0);else if(x.depthTexture.format===Mi)Mt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,j,K,se,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,j,K,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function de(R){const x=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){const z=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),z){const Y=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,z.removeEventListener("dispose",Y)};z.addEventListener("dispose",Y),x.__depthDisposeCallback=Y}x.__boundDepthTexture=z}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)ne(x.__webglFramebuffer[z],R,z);else{const z=R.texture.mipmaps;z&&z.length>0?ne(x.__webglFramebuffer[0],R,0):ne(x.__webglFramebuffer,R,0)}else if(O){x.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer[z]),x.__webglDepthbuffer[z]===void 0)x.__webglDepthbuffer[z]=t.createRenderbuffer(),he(x.__webglDepthbuffer[z],R,!1);else{const Y=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer[z];t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,Y,t.RENDERBUFFER,se)}}else{const z=R.texture.mipmaps;if(z&&z.length>0?n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=t.createRenderbuffer(),he(x.__webglDepthbuffer,R,!1);else{const Y=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,Y,t.RENDERBUFFER,se)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function ye(R,x,O){const z=i.get(R);x!==void 0&&G(z.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),O!==void 0&&de(R)}function we(R){const x=R.texture,O=i.get(R),z=i.get(x);R.addEventListener("dispose",M);const Y=R.textures,se=R.isWebGLCubeRenderTarget===!0,ue=Y.length>1;if(ue||(z.__webglTexture===void 0&&(z.__webglTexture=t.createTexture()),z.__version=x.version,a.memory.textures++),se){O.__webglFramebuffer=[];for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[K]=[];for(let j=0;j<x.mipmaps.length;j++)O.__webglFramebuffer[K][j]=t.createFramebuffer()}else O.__webglFramebuffer[K]=t.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let K=0;K<x.mipmaps.length;K++)O.__webglFramebuffer[K]=t.createFramebuffer()}else O.__webglFramebuffer=t.createFramebuffer();if(ue)for(let K=0,j=Y.length;K<j;K++){const fe=i.get(Y[K]);fe.__webglTexture===void 0&&(fe.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&Mt(R)===!1){O.__webglMultisampledFramebuffer=t.createFramebuffer(),O.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let K=0;K<Y.length;K++){const j=Y[K];O.__webglColorRenderbuffer[K]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,O.__webglColorRenderbuffer[K]);const fe=r.convert(j.format,j.colorSpace),Re=r.convert(j.type),ge=v(j.internalFormat,fe,Re,j.normalized,j.colorSpace,R.isXRRenderTarget===!0),pe=ft(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,pe,ge,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+K,t.RENDERBUFFER,O.__webglColorRenderbuffer[K])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=t.createRenderbuffer(),he(O.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(se){n.bindTexture(t.TEXTURE_CUBE_MAP,z.__webglTexture),He(t.TEXTURE_CUBE_MAP,x);for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)G(O.__webglFramebuffer[K][j],R,x,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+K,j);else G(O.__webglFramebuffer[K],R,x,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);g(x)&&A(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ue){for(let K=0,j=Y.length;K<j;K++){const fe=Y[K],Re=i.get(fe);let ge=t.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ge=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ge,Re.__webglTexture),He(ge,fe),G(O.__webglFramebuffer,R,fe,t.COLOR_ATTACHMENT0+K,ge,0),g(fe)&&A(ge)}n.unbindTexture()}else{let K=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(K=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(K,z.__webglTexture),He(K,x),x.mipmaps&&x.mipmaps.length>0)for(let j=0;j<x.mipmaps.length;j++)G(O.__webglFramebuffer[j],R,x,t.COLOR_ATTACHMENT0,K,j);else G(O.__webglFramebuffer,R,x,t.COLOR_ATTACHMENT0,K,0);g(x)&&A(K),n.unbindTexture()}R.depthBuffer&&de(R)}function Ye(R){const x=R.textures;for(let O=0,z=x.length;O<z;O++){const Y=x[O];if(g(Y)){const se=w(R),ue=i.get(Y).__webglTexture;n.bindTexture(se,ue),A(se),n.unbindTexture()}}}const ht=[],Tt=[];function Pt(R){if(R.samples>0){if(Mt(R)===!1){const x=R.textures,O=R.width,z=R.height;let Y=t.COLOR_BUFFER_BIT;const se=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=i.get(R),K=x.length>1;if(K)for(let fe=0;fe<x.length;fe++)n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const j=R.texture.mipmaps;j&&j.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let fe=0;fe<x.length;fe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Y|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Y|=t.STENCIL_BUFFER_BIT)),K){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ue.__webglColorRenderbuffer[fe]);const Re=i.get(x[fe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Re,0)}t.blitFramebuffer(0,0,O,z,0,0,O,z,Y,t.NEAREST),c===!0&&(ht.length=0,Tt.length=0,ht.push(t.COLOR_ATTACHMENT0+fe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ht.push(se),Tt.push(se),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Tt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,ht))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),K)for(let fe=0;fe<x.length;fe++){n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,ue.__webglColorRenderbuffer[fe]);const Re=i.get(x[fe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,Re,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const x=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[x])}}}function ft(R){return Math.min(s.maxSamples,R.samples)}function Mt(R){const x=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function N(R){const x=a.render.frame;h.get(R)!==x&&(h.set(R,x),R.update())}function Ht(R,x){const O=R.colorSpace,z=R.format,Y=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==sa&&O!==ei&&($e.getTransfer(O)===je?(z!==fn||Y!==en)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):qe("WebGLTextures: Unsupported texture color space:",O)),x}function Je(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=$,this.resetTextureUnits=X,this.getTextureUnits=H,this.setTextureUnits=D,this.setTexture2D=q,this.setTexture2DArray=te,this.setTexture3D=re,this.setTextureCube=ce,this.rebindTextures=ye,this.setupRenderTarget=we,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=Pt,this.setupDepthRenderbuffer=de,this.setupFrameBufferTexture=G,this.useMultisampledRTT=Mt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function QA(t,e){function n(i,s=ei){let r;const a=$e.getTransfer(s);if(i===en)return t.UNSIGNED_BYTE;if(i===Cc)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Pc)return t.UNSIGNED_SHORT_5_5_5_1;if(i===nh)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===ih)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===eh)return t.BYTE;if(i===th)return t.SHORT;if(i===Bs)return t.UNSIGNED_SHORT;if(i===Rc)return t.INT;if(i===Rn)return t.UNSIGNED_INT;if(i===En)return t.FLOAT;if(i===Vn)return t.HALF_FLOAT;if(i===sh)return t.ALPHA;if(i===rh)return t.RGB;if(i===fn)return t.RGBA;if(i===zn)return t.DEPTH_COMPONENT;if(i===Mi)return t.DEPTH_STENCIL;if(i===ah)return t.RED;if(i===Ic)return t.RED_INTEGER;if(i===wi)return t.RG;if(i===Lc)return t.RG_INTEGER;if(i===Dc)return t.RGBA_INTEGER;if(i===Br||i===Vr||i===zr||i===Hr)if(a===je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Br)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Br)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===zr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Hr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Io||i===Lo||i===Do||i===No)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Io)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Lo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Do)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===No)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Fo||i===Uo||i===Oo||i===ko||i===Bo||i===na||i===Vo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Fo||i===Uo)return a===je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Oo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ko)return r.COMPRESSED_R11_EAC;if(i===Bo)return r.COMPRESSED_SIGNED_R11_EAC;if(i===na)return r.COMPRESSED_RG11_EAC;if(i===Vo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===zo||i===Ho||i===Go||i===Wo||i===$o||i===Xo||i===qo||i===Yo||i===Ko||i===Zo||i===Jo||i===jo||i===Qo||i===ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===zo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ho)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Go)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Wo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$o)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Xo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===qo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Yo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ko)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Jo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===jo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Qo)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ec)return a===je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===tc||i===nc||i===ic)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===tc)return a===je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ic)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sc||i===rc||i===ia||i===ac)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ac)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Vs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const eT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,tT=`
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

}`;class nT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new _h(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Cn({vertexShader:eT,fragmentShader:tT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new pn(new ga(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class iT extends ci{constructor(e,n){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",m=new nT,g={},A=n.getContextAttributes();let w=null,v=null;const E=[],y=[],T=new Fe;let M=null;const b=new an;b.viewport=new dt;const P=new an;P.viewport=new dt;const C=[b,P],I=new uy;let X=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let oe=E[Z];return oe===void 0&&(oe=new Na,E[Z]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(Z){let oe=E[Z];return oe===void 0&&(oe=new Na,E[Z]=oe),oe.getGripSpace()},this.getHand=function(Z){let oe=E[Z];return oe===void 0&&(oe=new Na,E[Z]=oe),oe.getHandSpace()};function D(Z){const oe=y.indexOf(Z.inputSource);if(oe===-1)return;const ie=E[oe];ie!==void 0&&(ie.update(Z.inputSource,Z.frame,l||a),ie.dispatchEvent({type:Z.type,data:Z.inputSource}))}function $(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",B);for(let Z=0;Z<E.length;Z++){const oe=y[Z];oe!==null&&(y[Z]=null,E[Z].disconnect(oe))}X=null,H=null,m.reset();for(const Z in g)delete g[Z];e.setRenderTarget(w),f=null,d=null,u=null,s=null,v=null,He.stop(),i.isPresenting=!1,e.setPixelRatio(M),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,n)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",$),s.addEventListener("inputsourceschange",B),A.xrCompatible!==!0&&await n.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(T),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,Ne=null,Q=null;A.depth&&(Q=A.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ie=A.stencil?Mi:zn,Ne=A.stencil?Vs:Rn);const G={colorFormat:n.RGBA8,depthFormat:Q,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(G),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Tn(d.textureWidth,d.textureHeight,{format:fn,type:en,depthTexture:new os(d.textureWidth,d.textureHeight,Ne,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ie={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,n,ie),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Tn(f.framebufferWidth,f.framebufferHeight,{format:fn,type:en,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),He.setContext(s),He.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(Z){for(let oe=0;oe<Z.removed.length;oe++){const ie=Z.removed[oe],Ne=y.indexOf(ie);Ne>=0&&(y[Ne]=null,E[Ne].disconnect(ie))}for(let oe=0;oe<Z.added.length;oe++){const ie=Z.added[oe];let Ne=y.indexOf(ie);if(Ne===-1){for(let G=0;G<E.length;G++)if(G>=y.length){y.push(ie),Ne=G;break}else if(y[G]===null){y[G]=ie,Ne=G;break}if(Ne===-1)break}const Q=E[Ne];Q&&Q.connect(ie)}}const q=new U,te=new U;function re(Z,oe,ie){q.setFromMatrixPosition(oe.matrixWorld),te.setFromMatrixPosition(ie.matrixWorld);const Ne=q.distanceTo(te),Q=oe.projectionMatrix.elements,G=ie.projectionMatrix.elements,he=Q[14]/(Q[10]-1),ne=Q[14]/(Q[10]+1),de=(Q[9]+1)/Q[5],ye=(Q[9]-1)/Q[5],we=(Q[8]-1)/Q[0],Ye=(G[8]+1)/G[0],ht=he*we,Tt=he*Ye,Pt=Ne/(-we+Ye),ft=Pt*-we;if(oe.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ft),Z.translateZ(Pt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Q[10]===-1)Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const Mt=he+Pt,N=ne+Pt,Ht=ht-ft,Je=Tt+(Ne-ft),R=de*ne/N*Mt,x=ye*ne/N*Mt;Z.projectionMatrix.makePerspective(Ht,Je,R,x,Mt,N),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ce(Z,oe){oe===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(oe.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let oe=Z.near,ie=Z.far;m.texture!==null&&(m.depthNear>0&&(oe=m.depthNear),m.depthFar>0&&(ie=m.depthFar)),I.near=P.near=b.near=oe,I.far=P.far=b.far=ie,(X!==I.near||H!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),X=I.near,H=I.far),I.layers.mask=Z.layers.mask|6,b.layers.mask=I.layers.mask&-5,P.layers.mask=I.layers.mask&-3;const Ne=Z.parent,Q=I.cameras;ce(I,Ne);for(let G=0;G<Q.length;G++)ce(Q[G],Ne);Q.length===2?re(I,b,P):I.projectionMatrix.copy(b.projectionMatrix),ae(Z,I,Ne)};function ae(Z,oe,ie){ie===null?Z.matrix.copy(oe.matrixWorld):(Z.matrix.copy(ie.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(oe.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Hs*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(Z){return g[Z]};let ze=null;function Ze(Z,oe){if(h=oe.getViewerPose(l||a),p=oe,h!==null){const ie=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Ne=!1;ie.length!==I.cameras.length&&(I.cameras.length=0,Ne=!0);for(let ne=0;ne<ie.length;ne++){const de=ie[ne];let ye=null;if(f!==null)ye=f.getViewport(de);else{const Ye=u.getViewSubImage(d,de);ye=Ye.viewport,ne===0&&(e.setRenderTargetTextures(v,Ye.colorTexture,Ye.depthStencilTexture),e.setRenderTarget(v))}let we=C[ne];we===void 0&&(we=new an,we.layers.enable(ne),we.viewport=new dt,C[ne]=we),we.matrix.fromArray(de.transform.matrix),we.matrix.decompose(we.position,we.quaternion,we.scale),we.projectionMatrix.fromArray(de.projectionMatrix),we.projectionMatrixInverse.copy(we.projectionMatrix).invert(),we.viewport.set(ye.x,ye.y,ye.width,ye.height),ne===0&&(I.matrix.copy(we.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ne===!0&&I.cameras.push(we)}const Q=s.enabledFeatures;if(Q&&Q.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const ne=u.getDepthInformation(ie[0]);ne&&ne.isValid&&ne.texture&&m.init(ne,s.renderState)}if(Q&&Q.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let ne=0;ne<ie.length;ne++){const de=ie[ne].camera;if(de){let ye=g[de];ye||(ye=new _h,g[de]=ye);const we=u.getCameraImage(de);ye.sourceTexture=we}}}}for(let ie=0;ie<E.length;ie++){const Ne=y[ie],Q=E[ie];Ne!==null&&Q!==void 0&&Q.update(Ne,oe,l||a)}ze&&ze(Z,oe),oe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:oe}),p=null}const He=new Ah;He.setAnimationLoop(Ze),this.setAnimationLoop=function(Z){ze=Z},this.dispose=function(){}}}const sT=new lt,Lh=new Ue;Lh.set(-1,0,0,0,1,0,0,0,1);function rT(t,e){function n(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,Sh(t)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,A,w,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,v)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?c(m,g,A,w):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,n(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,n(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===qt&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,n(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===qt&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,n(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,n(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,n(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const A=e.get(g),w=A.envMap,v=A.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(sT.makeRotationFromEuler(v)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Lh),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,n(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,n(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,n(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,A,w){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*A,m.scale.value=w*.5,g.map&&(m.map.value=g.map,n(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,n(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,n(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,n(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,A){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,n(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,n(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,n(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,n(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,n(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===qt&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,n(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,n(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,n(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,n(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,n(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,n(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,n(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const A=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function aT(t,e,n,i){let s={},r={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,E){const y=E.program;i.uniformBlockBinding(v,y)}function l(v,E){let y=s[v.id];y===void 0&&(m(v),y=h(v),s[v.id]=y,v.addEventListener("dispose",A));const T=E.program;i.updateUBOMapping(v,T);const M=e.render.frame;r[v.id]!==M&&(d(v),r[v.id]=M)}function h(v){const E=u();v.__bindingPointIndex=E;const y=t.createBuffer(),T=v.__size,M=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,T,M),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,E,y),y}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const E=s[v.id],y=v.uniforms,T=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,E);for(let M=0,b=y.length;M<b;M++){const P=y[M];if(Array.isArray(P))for(let C=0,I=P.length;C<I;C++)f(P[C],M,C,T);else f(P,M,0,T)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function f(v,E,y,T){if(_(v,E,y,T)===!0){const M=v.__offset,b=v.value;if(Array.isArray(b)){let P=0;for(let C=0;C<b.length;C++){const I=b[C],X=g(I);p(I,v.__data,P),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(P+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(b,v.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,M,v.__data)}}function p(v,E,y){typeof v=="number"||typeof v=="boolean"?E[0]=v:v.isMatrix3?(E[0]=v.elements[0],E[1]=v.elements[1],E[2]=v.elements[2],E[3]=0,E[4]=v.elements[3],E[5]=v.elements[4],E[6]=v.elements[5],E[7]=0,E[8]=v.elements[6],E[9]=v.elements[7],E[10]=v.elements[8],E[11]=0):ArrayBuffer.isView(v)?E.set(new v.constructor(v.buffer,v.byteOffset,E.length)):v.toArray(E,y)}function _(v,E,y,T){const M=v.value,b=E+"_"+y;if(T[b]===void 0)return typeof M=="number"||typeof M=="boolean"?T[b]=M:ArrayBuffer.isView(M)?T[b]=M.slice():T[b]=M.clone(),!0;{const P=T[b];if(typeof M=="number"||typeof M=="boolean"){if(P!==M)return T[b]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(P.equals(M)===!1)return P.copy(M),!0}}return!1}function m(v){const E=v.uniforms;let y=0;const T=16;for(let b=0,P=E.length;b<P;b++){const C=Array.isArray(E[b])?E[b]:[E[b]];for(let I=0,X=C.length;I<X;I++){const H=C[I],D=Array.isArray(H.value)?H.value:[H.value];for(let $=0,B=D.length;$<B;$++){const q=D[$],te=g(q),re=y%T,ce=re%te.boundary,ae=re+ce;y+=ce,ae!==0&&T-ae<te.storage&&(y+=T-ae),H.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=y,y+=te.storage}}}const M=y%T;return M>0&&(y+=T-M),v.__size=y,v.__cache={},this}function g(v){const E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",v),E}function A(v){const E=v.target;E.removeEventListener("dispose",A);const y=a.indexOf(E.__bindingPointIndex);a.splice(y,1),t.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function w(){for(const v in s)t.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:w}}const oT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Mn=null;function cT(){return Mn===null&&(Mn=new CM(oT,16,16,wi,Vn),Mn.name="DFG_LUT",Mn.minFilter=Ut,Mn.magFilter=Ut,Mn.wrapS=Un,Mn.wrapT=Un,Mn.generateMipmaps=!1,Mn.needsUpdate=!0),Mn}class lT{constructor(e={}){const{canvas:n=$v(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=en}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const _=f,m=new Set([Dc,Lc,Ic]),g=new Set([en,Rn,Bs,Vs,Cc,Pc]),A=new Uint32Array(4),w=new Int32Array(4),v=new U;let E=null,y=null;const T=[],M=[];let b=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=An,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,I=null,X=null,H=null,D=null;this._outputColorSpace=jt;let $=0,B=0,q=null,te=-1,re=null;const ce=new dt,ae=new dt;let ze=null;const Ze=new We(0);let He=0,Z=n.width,oe=n.height,ie=1,Ne=null,Q=null;const G=new dt(0,0,Z,oe),he=new dt(0,0,Z,oe);let ne=!1;const de=new Bc;let ye=!1,we=!1;const Ye=new lt,ht=new U,Tt=new dt,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ft=!1;function Mt(){return q===null?ie:1}let N=i;function Ht(S,F){return n.getContext(S,F)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${wc}`),n.addEventListener("webglcontextlost",pt,!1),n.addEventListener("webglcontextrestored",st,!1),n.addEventListener("webglcontextcreationerror",mn,!1),N===null){const F="webgl2";if(N=Ht(F,S),N===null)throw Ht(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(S){throw qe("WebGLRenderer: "+S.message),S}let Je,R,x,O,z,Y,se,ue,K,j,fe,Re,ge,pe,Ie,De,Oe,L,le,J,me,Me,ee;function Te(){Je=new cb(N),Je.init(),me=new QA(N,Je),R=new eb(N,Je,e,me),x=new JA(N,Je),R.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),X=N.createFramebuffer(),H=N.createFramebuffer(),D=N.createFramebuffer(),O=new ub(N),z=new OA,Y=new jA(N,Je,x,z,R,me,O),se=new ob(P),ue=new my(N),Me=new jE(N,ue),K=new lb(N,ue,O,Me),j=new fb(N,K,ue,Me,O),L=new hb(N,R,Y),Ie=new tb(z),fe=new UA(P,se,Je,R,Me,Ie),Re=new rT(P,z),ge=new BA,pe=new $A(Je),Oe=new JE(P,se,x,j,p,c),De=new ZA(P,j,R),ee=new aT(N,O,R,x),le=new QE(N,Je,O),J=new db(N,Je,O),O.programs=fe.programs,P.capabilities=R,P.extensions=Je,P.properties=z,P.renderLists=ge,P.shadowMap=De,P.state=x,P.info=O}Te(),_!==en&&(b=new mb(_,n.width,n.height,o,s,r));const be=new iT(P,N);this.xr=be,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const S=Je.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Je.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(S){S!==void 0&&(ie=S,this.setSize(Z,oe,!1))},this.getSize=function(S){return S.set(Z,oe)},this.setSize=function(S,F,W=!0){if(be.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=S,oe=F,n.width=Math.floor(S*ie),n.height=Math.floor(F*ie),W===!0&&(n.style.width=S+"px",n.style.height=F+"px"),b!==null&&b.setSize(n.width,n.height),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(Z*ie,oe*ie).floor()},this.setDrawingBufferSize=function(S,F,W){Z=S,oe=F,ie=W,n.width=Math.floor(S*W),n.height=Math.floor(F*W),this.setViewport(0,0,S,F)},this.setEffects=function(S){if(_===en){qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let F=0;F<S.length;F++)if(S[F].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(ce)},this.getViewport=function(S){return S.copy(G)},this.setViewport=function(S,F,W,k){S.isVector4?G.set(S.x,S.y,S.z,S.w):G.set(S,F,W,k),x.viewport(ce.copy(G).multiplyScalar(ie).round())},this.getScissor=function(S){return S.copy(he)},this.setScissor=function(S,F,W,k){S.isVector4?he.set(S.x,S.y,S.z,S.w):he.set(S,F,W,k),x.scissor(ae.copy(he).multiplyScalar(ie).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(S){x.setScissorTest(ne=S)},this.setOpaqueSort=function(S){Ne=S},this.setTransparentSort=function(S){Q=S},this.getClearColor=function(S){return S.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,W=!0){let k=0;if(S){let V=!1;if(q!==null){const ve=q.texture.format;V=m.has(ve)}if(V){const ve=q.texture.type,Ee=g.has(ve),xe=Oe.getClearColor(),Ae=Oe.getClearAlpha(),Ce=xe.r,ke=xe.g,Ve=xe.b;Ee?(A[0]=Ce,A[1]=ke,A[2]=Ve,A[3]=Ae,N.clearBufferuiv(N.COLOR,0,A)):(w[0]=Ce,w[1]=ke,w[2]=Ve,w[3]=Ae,N.clearBufferiv(N.COLOR,0,w))}else k|=N.COLOR_BUFFER_BIT}F&&(k|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&(k|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&N.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),I=S},this.dispose=function(){n.removeEventListener("webglcontextlost",pt,!1),n.removeEventListener("webglcontextrestored",st,!1),n.removeEventListener("webglcontextcreationerror",mn,!1),Oe.dispose(),ge.dispose(),pe.dispose(),z.dispose(),se.dispose(),j.dispose(),Me.dispose(),ee.dispose(),fe.dispose(),be.dispose(),be.removeEventListener("sessionstart",Kc),be.removeEventListener("sessionend",Zc),li.stop()};function pt(S){S.preventDefault(),Ql("WebGLRenderer: Context Lost."),C=!0}function st(){Ql("WebGLRenderer: Context Restored."),C=!1;const S=O.autoReset,F=De.enabled,W=De.autoUpdate,k=De.needsUpdate,V=De.type;Te(),O.autoReset=S,De.enabled=F,De.autoUpdate=W,De.needsUpdate=k,De.type=V}function mn(S){qe("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function gn(S){const F=S.target;F.removeEventListener("dispose",gn),Uh(F)}function Uh(S){Oh(S),z.remove(S)}function Oh(S){const F=z.get(S).programs;F!==void 0&&(F.forEach(function(W){fe.releaseProgram(W)}),S.isShaderMaterial&&fe.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,W,k,V,ve){F===null&&(F=Pt);const Ee=V.isMesh&&V.matrixWorld.determinantAffine()<0,xe=Vh(S,F,W,k,V);x.setMaterial(k,Ee);let Ae=W.index,Ce=1;if(k.wireframe===!0){if(Ae=K.getWireframeAttribute(W),Ae===void 0)return;Ce=2}const ke=W.drawRange,Ve=W.attributes.position;let Pe=ke.start*Ce,et=(ke.start+ke.count)*Ce;ve!==null&&(Pe=Math.max(Pe,ve.start*Ce),et=Math.min(et,(ve.start+ve.count)*Ce)),Ae!==null?(Pe=Math.max(Pe,0),et=Math.min(et,Ae.count)):Ve!=null&&(Pe=Math.max(Pe,0),et=Math.min(et,Ve.count));const _t=et-Pe;if(_t<0||_t===1/0)return;Me.setup(V,k,xe,W,Ae);let mt,nt=le;if(Ae!==null&&(mt=ue.get(Ae),nt=J,nt.setIndex(mt)),V.isMesh)k.wireframe===!0?(x.setLineWidth(k.wireframeLinewidth*Mt()),nt.setMode(N.LINES)):nt.setMode(N.TRIANGLES);else if(V.isLine){let Lt=k.linewidth;Lt===void 0&&(Lt=1),x.setLineWidth(Lt*Mt()),V.isLineSegments?nt.setMode(N.LINES):V.isLineLoop?nt.setMode(N.LINE_LOOP):nt.setMode(N.LINE_STRIP)}else V.isPoints?nt.setMode(N.POINTS):V.isSprite&&nt.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(Je.get("WEBGL_multi_draw"))nt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Lt=V._multiDrawStarts,Se=V._multiDrawCounts,Yt=V._multiDrawCount,Xe=Ae?ue.get(Ae).bytesPerElement:1,nn=z.get(k).currentProgram.getUniforms();for(let _n=0;_n<Yt;_n++)nn.setValue(N,"_gl_DrawID",_n),nt.render(Lt[_n]/Xe,Se[_n])}else if(V.isInstancedMesh)nt.renderInstances(Pe,_t,V.count);else if(W.isInstancedBufferGeometry){const Lt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Se=Math.min(W.instanceCount,Lt);nt.renderInstances(Pe,_t,Se)}else nt.render(Pe,_t)};function Yc(S,F,W){S.transparent===!0&&S.side===Sn&&S.forceSinglePass===!1?(S.side=qt,S.needsUpdate=!0,Zs(S,F,W),S.side=ri,S.needsUpdate=!0,Zs(S,F,W),S.side=Sn):Zs(S,F,W)}this.compile=function(S,F,W=null){W===null&&(W=S),y=pe.get(W),y.init(F),M.push(y),W.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(y.pushLight(V),V.castShadow&&y.pushShadow(V))}),S!==W&&S.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(y.pushLight(V),V.castShadow&&y.pushShadow(V))}),y.setupLights();const k=new Set;return S.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ve=V.material;if(ve)if(Array.isArray(ve))for(let Ee=0;Ee<ve.length;Ee++){const xe=ve[Ee];Yc(xe,W,V),k.add(xe)}else Yc(ve,W,V),k.add(ve)}),y=M.pop(),k},this.compileAsync=function(S,F,W=null){const k=this.compile(S,F,W);return new Promise(V=>{function ve(){if(k.forEach(function(Ee){z.get(Ee).currentProgram.isReady()&&k.delete(Ee)}),k.size===0){V(S);return}setTimeout(ve,10)}Je.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let va=null;function kh(S){va&&va(S)}function Kc(){li.stop()}function Zc(){li.start()}const li=new Ah;li.setAnimationLoop(kh),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(S){va=S,be.setAnimationLoop(S),S===null?li.stop():li.start()},be.addEventListener("sessionstart",Kc),be.addEventListener("sessionend",Zc),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(S,F);const W=be.enabled===!0&&be.isPresenting===!0,k=b!==null&&(q===null||W)&&b.begin(P,q);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),be.enabled===!0&&be.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(be.cameraAutoUpdate===!0&&be.updateCamera(F),F=be.getCamera()),S.isScene===!0&&S.onBeforeRender(P,S,F,q),y=pe.get(S,M.length),y.init(F),y.state.textureUnits=Y.getTextureUnits(),M.push(y),Ye.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),de.setFromProjectionMatrix(Ye,bn,F.reversedDepth),we=this.localClippingEnabled,ye=Ie.init(this.clippingPlanes,we),E=ge.get(S,T.length),E.init(),T.push(E),be.enabled===!0&&be.isPresenting===!0){const Ee=P.xr.getDepthSensingMesh();Ee!==null&&Ma(Ee,F,-1/0,P.sortObjects)}Ma(S,F,0,P.sortObjects),E.finish(),P.sortObjects===!0&&E.sort(Ne,Q,F.reversedDepth),ft=be.enabled===!1||be.isPresenting===!1||be.hasDepthSensing()===!1,ft&&Oe.addToRenderList(E,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ye===!0&&Ie.beginShadows();const V=y.state.shadowsArray;if(De.render(V,S,F),ye===!0&&Ie.endShadows(),(k&&b.hasRenderPass())===!1){const Ee=E.opaque,xe=E.transmissive;if(y.setupLights(),F.isArrayCamera){const Ae=F.cameras;if(xe.length>0)for(let Ce=0,ke=Ae.length;Ce<ke;Ce++){const Ve=Ae[Ce];jc(Ee,xe,S,Ve)}ft&&Oe.render(S);for(let Ce=0,ke=Ae.length;Ce<ke;Ce++){const Ve=Ae[Ce];Jc(E,S,Ve,Ve.viewport)}}else xe.length>0&&jc(Ee,xe,S,F),ft&&Oe.render(S),Jc(E,S,F)}q!==null&&B===0&&(Y.updateMultisampleRenderTarget(q),Y.updateRenderTargetMipmap(q)),k&&b.end(P),S.isScene===!0&&S.onAfterRender(P,S,F),Me.resetDefaultState(),te=-1,re=null,M.pop(),M.length>0?(y=M[M.length-1],Y.setTextureUnits(y.state.textureUnits),ye===!0&&Ie.setGlobalState(P.clippingPlanes,y.state.camera)):y=null,T.pop(),T.length>0?E=T[T.length-1]:E=null,I!==null&&I.renderEnd()};function Ma(S,F,W,k){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)W=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLightProbeGrid)y.pushLightProbeGrid(S);else if(S.isLight)y.pushLight(S),S.castShadow&&y.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||de.intersectsSprite(S)){k&&Tt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Ye);const Ee=j.update(S),xe=S.material;xe.visible&&E.push(S,Ee,xe,W,Tt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||de.intersectsObject(S))){const Ee=j.update(S),xe=S.material;if(k&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Tt.copy(S.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),Tt.copy(Ee.boundingSphere.center)),Tt.applyMatrix4(S.matrixWorld).applyMatrix4(Ye)),Array.isArray(xe)){const Ae=Ee.groups;for(let Ce=0,ke=Ae.length;Ce<ke;Ce++){const Ve=Ae[Ce],Pe=xe[Ve.materialIndex];Pe&&Pe.visible&&E.push(S,Ee,Pe,W,Tt.z,Ve)}}else xe.visible&&E.push(S,Ee,xe,W,Tt.z,null)}}const ve=S.children;for(let Ee=0,xe=ve.length;Ee<xe;Ee++)Ma(ve[Ee],F,W,k)}function Jc(S,F,W,k){const{opaque:V,transmissive:ve,transparent:Ee}=S;y.setupLightsView(W),ye===!0&&Ie.setGlobalState(P.clippingPlanes,W),k&&x.viewport(ce.copy(k)),V.length>0&&Ks(V,F,W),ve.length>0&&Ks(ve,F,W),Ee.length>0&&Ks(Ee,F,W),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function jc(S,F,W,k){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[k.id]===void 0){const Pe=Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[k.id]=new Tn(1,1,{generateMipmaps:!0,type:Pe?Vn:en,minFilter:vi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace})}const ve=y.state.transmissionRenderTarget[k.id],Ee=k.viewport||ce;ve.setSize(Ee.z*P.transmissionResolutionScale,Ee.w*P.transmissionResolutionScale);const xe=P.getRenderTarget(),Ae=P.getActiveCubeFace(),Ce=P.getActiveMipmapLevel();P.setRenderTarget(ve),P.getClearColor(Ze),He=P.getClearAlpha(),He<1&&P.setClearColor(16777215,.5),P.clear(),ft&&Oe.render(W);const ke=P.toneMapping;P.toneMapping=An;const Ve=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),y.setupLightsView(k),ye===!0&&Ie.setGlobalState(P.clippingPlanes,k),Ks(S,W,k),Y.updateMultisampleRenderTarget(ve),Y.updateRenderTargetMipmap(ve),Je.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let et=0,_t=F.length;et<_t;et++){const mt=F[et],{object:nt,geometry:Lt,material:Se,group:Yt}=mt;if(Se.side===Sn&&nt.layers.test(k.layers)){const Xe=Se.side;Se.side=qt,Se.needsUpdate=!0,Qc(nt,W,k,Lt,Se,Yt),Se.side=Xe,Se.needsUpdate=!0,Pe=!0}}Pe===!0&&(Y.updateMultisampleRenderTarget(ve),Y.updateRenderTargetMipmap(ve))}P.setRenderTarget(xe,Ae,Ce),P.setClearColor(Ze,He),Ve!==void 0&&(k.viewport=Ve),P.toneMapping=ke}function Ks(S,F,W){const k=F.isScene===!0?F.overrideMaterial:null;for(let V=0,ve=S.length;V<ve;V++){const Ee=S[V],{object:xe,geometry:Ae,group:Ce}=Ee;let ke=Ee.material;ke.allowOverride===!0&&k!==null&&(ke=k),xe.layers.test(W.layers)&&Qc(xe,F,W,Ae,ke,Ce)}}function Qc(S,F,W,k,V,ve){S.onBeforeRender(P,F,W,k,V,ve),S.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),V.onBeforeRender(P,F,W,k,S,ve),V.transparent===!0&&V.side===Sn&&V.forceSinglePass===!1?(V.side=qt,V.needsUpdate=!0,P.renderBufferDirect(W,F,k,V,S,ve),V.side=ri,V.needsUpdate=!0,P.renderBufferDirect(W,F,k,V,S,ve),V.side=Sn):P.renderBufferDirect(W,F,k,V,S,ve),S.onAfterRender(P,F,W,k,V,ve)}function Zs(S,F,W){F.isScene!==!0&&(F=Pt);const k=z.get(S),V=y.state.lights,ve=y.state.shadowsArray,Ee=V.state.version,xe=fe.getParameters(S,V.state,ve,F,W,y.state.lightProbeGridArray),Ae=fe.getProgramCacheKey(xe);let Ce=k.programs;k.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?F.environment:null,k.fog=F.fog;const ke=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;k.envMap=se.get(S.envMap||k.environment,ke),k.envMapRotation=k.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Ce===void 0&&(S.addEventListener("dispose",gn),Ce=new Map,k.programs=Ce);let Ve=Ce.get(Ae);if(Ve!==void 0){if(k.currentProgram===Ve&&k.lightsStateVersion===Ee)return tl(S,xe),Ve}else xe.uniforms=fe.getUniforms(S),I!==null&&S.isNodeMaterial&&I.build(S,W,xe),S.onBeforeCompile(xe,P),Ve=fe.acquireProgram(xe,Ae),Ce.set(Ae,Ve),k.uniforms=xe.uniforms;const Pe=k.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Pe.clippingPlanes=Ie.uniform),tl(S,xe),k.needsLights=Hh(S),k.lightsStateVersion=Ee,k.needsLights&&(Pe.ambientLightColor.value=V.state.ambient,Pe.lightProbe.value=V.state.probe,Pe.directionalLights.value=V.state.directional,Pe.directionalLightShadows.value=V.state.directionalShadow,Pe.spotLights.value=V.state.spot,Pe.spotLightShadows.value=V.state.spotShadow,Pe.rectAreaLights.value=V.state.rectArea,Pe.ltc_1.value=V.state.rectAreaLTC1,Pe.ltc_2.value=V.state.rectAreaLTC2,Pe.pointLights.value=V.state.point,Pe.pointLightShadows.value=V.state.pointShadow,Pe.hemisphereLights.value=V.state.hemi,Pe.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Pe.spotLightMatrix.value=V.state.spotLightMatrix,Pe.spotLightMap.value=V.state.spotLightMap,Pe.pointShadowMatrix.value=V.state.pointShadowMatrix),k.lightProbeGrid=y.state.lightProbeGridArray.length>0,k.currentProgram=Ve,k.uniformsList=null,Ve}function el(S){if(S.uniformsList===null){const F=S.currentProgram.getUniforms();S.uniformsList=Wr.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function tl(S,F){const W=z.get(S);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function Bh(S,F){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;v.setFromMatrixPosition(F.matrixWorld);for(let W=0,k=S.length;W<k;W++){const V=S[W];if(V.texture!==null&&V.boundingBox.containsPoint(v))return V}return null}function Vh(S,F,W,k,V){F.isScene!==!0&&(F=Pt),Y.resetTextureUnits();const ve=F.fog,Ee=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?F.environment:null,xe=q===null?P.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:$e.workingColorSpace,Ae=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Ce=se.get(k.envMap||Ee,Ae),ke=k.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ve=!!W.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Pe=!!W.morphAttributes.position,et=!!W.morphAttributes.normal,_t=!!W.morphAttributes.color;let mt=An;k.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(mt=P.toneMapping);const nt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Lt=nt!==void 0?nt.length:0,Se=z.get(k),Yt=y.state.lights;if(ye===!0&&(we===!0||S!==re)){const rt=S===re&&k.id===te;Ie.setState(k,S,rt)}let Xe=!1;k.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Yt.state.version||Se.outputColorSpace!==xe||V.isBatchedMesh&&Se.batching===!1||!V.isBatchedMesh&&Se.batching===!0||V.isBatchedMesh&&Se.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Se.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Se.instancing===!1||!V.isInstancedMesh&&Se.instancing===!0||V.isSkinnedMesh&&Se.skinning===!1||!V.isSkinnedMesh&&Se.skinning===!0||V.isInstancedMesh&&Se.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Se.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Se.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Se.instancingMorph===!1&&V.morphTexture!==null||Se.envMap!==Ce||k.fog===!0&&Se.fog!==ve||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==Ie.numPlanes||Se.numIntersection!==Ie.numIntersection)||Se.vertexAlphas!==ke||Se.vertexTangents!==Ve||Se.morphTargets!==Pe||Se.morphNormals!==et||Se.morphColors!==_t||Se.toneMapping!==mt||Se.morphTargetsCount!==Lt||!!Se.lightProbeGrid!=y.state.lightProbeGridArray.length>0)&&(Xe=!0):(Xe=!0,Se.__version=k.version);let nn=Se.currentProgram;Xe===!0&&(nn=Zs(k,F,V),I&&k.isNodeMaterial&&I.onUpdateProgram(k,nn,Se));let _n=!1,Hn=!1,Li=!1;const it=nn.getUniforms(),xt=Se.uniforms;if(x.useProgram(nn.program)&&(_n=!0,Hn=!0,Li=!0),k.id!==te&&(te=k.id,Hn=!0),Se.needsLights){const rt=Bh(y.state.lightProbeGridArray,V);Se.lightProbeGrid!==rt&&(Se.lightProbeGrid=rt,Hn=!0)}if(_n||re!==S){x.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),it.setValue(N,"projectionMatrix",S.projectionMatrix),it.setValue(N,"viewMatrix",S.matrixWorldInverse);const Wn=it.map.cameraPosition;Wn!==void 0&&Wn.setValue(N,ht.setFromMatrixPosition(S.matrixWorld)),R.logarithmicDepthBuffer&&it.setValue(N,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&it.setValue(N,"isOrthographic",S.isOrthographicCamera===!0),re!==S&&(re=S,Hn=!0,Li=!0)}if(Se.needsLights&&(Yt.state.directionalShadowMap.length>0&&it.setValue(N,"directionalShadowMap",Yt.state.directionalShadowMap,Y),Yt.state.spotShadowMap.length>0&&it.setValue(N,"spotShadowMap",Yt.state.spotShadowMap,Y),Yt.state.pointShadowMap.length>0&&it.setValue(N,"pointShadowMap",Yt.state.pointShadowMap,Y)),V.isSkinnedMesh){it.setOptional(N,V,"bindMatrix"),it.setOptional(N,V,"bindMatrixInverse");const rt=V.skeleton;rt&&(rt.boneTexture===null&&rt.computeBoneTexture(),it.setValue(N,"boneTexture",rt.boneTexture,Y))}V.isBatchedMesh&&(it.setOptional(N,V,"batchingTexture"),it.setValue(N,"batchingTexture",V._matricesTexture,Y),it.setOptional(N,V,"batchingIdTexture"),it.setValue(N,"batchingIdTexture",V._indirectTexture,Y),it.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&it.setValue(N,"batchingColorTexture",V._colorsTexture,Y));const Gn=W.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&L.update(V,W,nn),(Hn||Se.receiveShadow!==V.receiveShadow)&&(Se.receiveShadow=V.receiveShadow,it.setValue(N,"receiveShadow",V.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&F.environment!==null&&(xt.envMapIntensity.value=F.environmentIntensity),xt.dfgLUT!==void 0&&(xt.dfgLUT.value=cT()),Hn){if(it.setValue(N,"toneMappingExposure",P.toneMappingExposure),Se.needsLights&&zh(xt,Li),ve&&k.fog===!0&&Re.refreshFogUniforms(xt,ve),Re.refreshMaterialUniforms(xt,k,ie,oe,y.state.transmissionRenderTarget[S.id]),Se.needsLights&&Se.lightProbeGrid){const rt=Se.lightProbeGrid;xt.probesSH.value=rt.texture,xt.probesMin.value.copy(rt.boundingBox.min),xt.probesMax.value.copy(rt.boundingBox.max),xt.probesResolution.value.copy(rt.resolution)}Wr.upload(N,el(Se),xt,Y)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Wr.upload(N,el(Se),xt,Y),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&it.setValue(N,"center",V.center),it.setValue(N,"modelViewMatrix",V.modelViewMatrix),it.setValue(N,"normalMatrix",V.normalMatrix),it.setValue(N,"modelMatrix",V.matrixWorld),k.uniformsGroups!==void 0){const rt=k.uniformsGroups;for(let Wn=0,Di=rt.length;Wn<Di;Wn++){const nl=rt[Wn];ee.update(nl,nn),ee.bind(nl,nn)}}return nn}function zh(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function Hh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(S,F,W){const k=z.get(S);k.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),z.get(S.texture).__webglTexture=F,z.get(S.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:W,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){const W=z.get(S);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(S,F=0,W=0){q=S,$=F,B=W;let k=null,V=!1,ve=!1;if(S){const xe=z.get(S);if(xe.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(N.FRAMEBUFFER,xe.__webglFramebuffer),ce.copy(S.viewport),ae.copy(S.scissor),ze=S.scissorTest,x.viewport(ce),x.scissor(ae),x.setScissorTest(ze),te=-1;return}else if(xe.__webglFramebuffer===void 0)Y.setupRenderTarget(S);else if(xe.__hasExternalTextures)Y.rebindTextures(S,z.get(S.texture).__webglTexture,z.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const ke=S.depthTexture;if(xe.__boundDepthTexture!==ke){if(ke!==null&&z.has(ke)&&(S.width!==ke.image.width||S.height!==ke.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Y.setupDepthRenderbuffer(S)}}const Ae=S.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(ve=!0);const Ce=z.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ce[F])?k=Ce[F][W]:k=Ce[F],V=!0):S.samples>0&&Y.useMultisampledRTT(S)===!1?k=z.get(S).__webglMultisampledFramebuffer:Array.isArray(Ce)?k=Ce[W]:k=Ce,ce.copy(S.viewport),ae.copy(S.scissor),ze=S.scissorTest}else ce.copy(G).multiplyScalar(ie).floor(),ae.copy(he).multiplyScalar(ie).floor(),ze=ne;if(W!==0&&(k=X),x.bindFramebuffer(N.FRAMEBUFFER,k)&&x.drawBuffers(S,k),x.viewport(ce),x.scissor(ae),x.setScissorTest(ze),V){const xe=z.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+F,xe.__webglTexture,W)}else if(ve){const xe=F;for(let Ae=0;Ae<S.textures.length;Ae++){const Ce=z.get(S.textures[Ae]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ae,Ce.__webglTexture,W,xe)}}else if(S!==null&&W!==0){const xe=z.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xe.__webglTexture,W)}te=-1},this.readRenderTargetPixels=function(S,F,W,k,V,ve,Ee,xe=0){if(!(S&&S.isWebGLRenderTarget)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ae=Ae[Ee]),Ae){x.bindFramebuffer(N.FRAMEBUFFER,Ae);try{const Ce=S.textures[xe],ke=Ce.format,Ve=Ce.type;if(S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+xe),!R.textureFormatReadable(ke)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Ve)){qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-k&&W>=0&&W<=S.height-V&&N.readPixels(F,W,k,V,me.convert(ke),me.convert(Ve),ve)}finally{const Ce=q!==null?z.get(q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(S,F,W,k,V,ve,Ee,xe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ae=Ae[Ee]),Ae)if(F>=0&&F<=S.width-k&&W>=0&&W<=S.height-V){x.bindFramebuffer(N.FRAMEBUFFER,Ae);const Ce=S.textures[xe],ke=Ce.format,Ve=Ce.type;if(S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+xe),!R.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Pe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Pe),N.bufferData(N.PIXEL_PACK_BUFFER,ve.byteLength,N.STREAM_READ),N.readPixels(F,W,k,V,me.convert(ke),me.convert(Ve),0);const et=q!==null?z.get(q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,et);const _t=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Xv(N,_t,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Pe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ve),N.deleteBuffer(Pe),N.deleteSync(_t),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,W=0){const k=Math.pow(2,-W),V=Math.floor(S.image.width*k),ve=Math.floor(S.image.height*k),Ee=F!==null?F.x:0,xe=F!==null?F.y:0;Y.setTexture2D(S,0),N.copyTexSubImage2D(N.TEXTURE_2D,W,0,0,Ee,xe,V,ve),x.unbindTexture()},this.copyTextureToTexture=function(S,F,W=null,k=null,V=0,ve=0){let Ee,xe,Ae,Ce,ke,Ve,Pe,et,_t;const mt=S.isCompressedTexture?S.mipmaps[ve]:S.image;if(W!==null)Ee=W.max.x-W.min.x,xe=W.max.y-W.min.y,Ae=W.isBox3?W.max.z-W.min.z:1,Ce=W.min.x,ke=W.min.y,Ve=W.isBox3?W.min.z:0;else{const xt=Math.pow(2,-V);Ee=Math.floor(mt.width*xt),xe=Math.floor(mt.height*xt),S.isDataArrayTexture?Ae=mt.depth:S.isData3DTexture?Ae=Math.floor(mt.depth*xt):Ae=1,Ce=0,ke=0,Ve=0}k!==null?(Pe=k.x,et=k.y,_t=k.z):(Pe=0,et=0,_t=0);const nt=me.convert(F.format),Lt=me.convert(F.type);let Se;F.isData3DTexture?(Y.setTexture3D(F,0),Se=N.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Y.setTexture2DArray(F,0),Se=N.TEXTURE_2D_ARRAY):(Y.setTexture2D(F,0),Se=N.TEXTURE_2D),x.activeTexture(N.TEXTURE0),x.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,F.flipY),x.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),x.pixelStorei(N.UNPACK_ALIGNMENT,F.unpackAlignment);const Yt=x.getParameter(N.UNPACK_ROW_LENGTH),Xe=x.getParameter(N.UNPACK_IMAGE_HEIGHT),nn=x.getParameter(N.UNPACK_SKIP_PIXELS),_n=x.getParameter(N.UNPACK_SKIP_ROWS),Hn=x.getParameter(N.UNPACK_SKIP_IMAGES);x.pixelStorei(N.UNPACK_ROW_LENGTH,mt.width),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,mt.height),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Ce),x.pixelStorei(N.UNPACK_SKIP_ROWS,ke),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Ve);const Li=S.isDataArrayTexture||S.isData3DTexture,it=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){const xt=z.get(S),Gn=z.get(F),rt=z.get(xt.__renderTarget),Wn=z.get(Gn.__renderTarget);x.bindFramebuffer(N.READ_FRAMEBUFFER,rt.__webglFramebuffer),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,Wn.__webglFramebuffer);for(let Di=0;Di<Ae;Di++)Li&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(S).__webglTexture,V,Ve+Di),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(F).__webglTexture,ve,_t+Di)),N.blitFramebuffer(Ce,ke,Ee,xe,Pe,et,Ee,xe,N.DEPTH_BUFFER_BIT,N.NEAREST);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||S.isRenderTargetTexture||z.has(S)){const xt=z.get(S),Gn=z.get(F);x.bindFramebuffer(N.READ_FRAMEBUFFER,H),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,D);for(let rt=0;rt<Ae;rt++)Li?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,xt.__webglTexture,V,Ve+rt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xt.__webglTexture,V),it?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Gn.__webglTexture,ve,_t+rt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Gn.__webglTexture,ve),V!==0?N.blitFramebuffer(Ce,ke,Ee,xe,Pe,et,Ee,xe,N.COLOR_BUFFER_BIT,N.NEAREST):it?N.copyTexSubImage3D(Se,ve,Pe,et,_t+rt,Ce,ke,Ee,xe):N.copyTexSubImage2D(Se,ve,Pe,et,Ce,ke,Ee,xe);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else it?S.isDataTexture||S.isData3DTexture?N.texSubImage3D(Se,ve,Pe,et,_t,Ee,xe,Ae,nt,Lt,mt.data):F.isCompressedArrayTexture?N.compressedTexSubImage3D(Se,ve,Pe,et,_t,Ee,xe,Ae,nt,mt.data):N.texSubImage3D(Se,ve,Pe,et,_t,Ee,xe,Ae,nt,Lt,mt):S.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ve,Pe,et,Ee,xe,nt,Lt,mt.data):S.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ve,Pe,et,mt.width,mt.height,nt,mt.data):N.texSubImage2D(N.TEXTURE_2D,ve,Pe,et,Ee,xe,nt,Lt,mt);x.pixelStorei(N.UNPACK_ROW_LENGTH,Yt),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Xe),x.pixelStorei(N.UNPACK_SKIP_PIXELS,nn),x.pixelStorei(N.UNPACK_SKIP_ROWS,_n),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Hn),ve===0&&F.generateMipmaps&&N.generateMipmap(Se),x.unbindTexture()},this.initRenderTarget=function(S){z.get(S).__webglFramebuffer===void 0&&Y.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Y.setTextureCube(S,0):S.isData3DTexture?Y.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Y.setTexture2DArray(S,0):Y.setTexture2D(S,0),x.unbindTexture()},this.resetState=function(){$=0,B=0,q=null,x.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),n.unpackColorSpace=$e._getUnpackColorSpace()}}const iu={type:"change"},Hc={type:"start"},Dh={type:"end"},Nr=new pa,su=new Qn,dT=Math.cos(70*ch.DEG2RAD),Et=new U,Gt=2*Math.PI,tt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ro=1e-6;class uT extends fy{constructor(e,n=null){super(e,n),this.state=tt.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ts.ROTATE,MIDDLE:ts.DOLLY,RIGHT:ts.PAN},this.touches={ONE:ji.ROTATE,TWO:ji.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new ai,this._lastTargetPosition=new U,this._quat=new ai().setFromUnitVectors(e.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Id,this._sphericalDelta=new Id,this._scale=1,this._panOffset=new U,this._rotateStart=new Fe,this._rotateEnd=new Fe,this._rotateDelta=new Fe,this._panStart=new Fe,this._panEnd=new Fe,this._panDelta=new Fe,this._dollyStart=new Fe,this._dollyEnd=new Fe,this._dollyDelta=new Fe,this._dollyDirection=new U,this._mouse=new Fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=fT.bind(this),this._onPointerDown=hT.bind(this),this._onPointerUp=pT.bind(this),this._onContextMenu=yT.bind(this),this._onMouseWheel=_T.bind(this),this._onKeyDown=xT.bind(this),this._onTouchStart=vT.bind(this),this._onTouchMove=MT.bind(this),this._onMouseDown=mT.bind(this),this._onMouseMove=gT.bind(this),this._interceptControlDown=ST.bind(this),this._interceptControlUp=ET.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(iu),this.update(),this.state=tt.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;Et.copy(n).sub(this.target),Et.applyQuaternion(this._quat),this._spherical.setFromVector3(Et),this.autoRotate&&this.state===tt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Gt:i>Math.PI&&(i-=Gt),s<-Math.PI?s+=Gt:s>Math.PI&&(s-=Gt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Et.setFromSpherical(this._spherical),Et.applyQuaternion(this._quatInverse),n.copy(this.target).add(Et),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Et.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new U(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new U(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Et.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Nr.origin.copy(this.object.position),Nr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Nr.direction))<dT?this.object.lookAt(this.target):(su.setFromNormalAndCoplanarPoint(this.object.up,this.target),Nr.intersectPlane(su,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ro||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ro||this._lastTargetPosition.distanceToSquared(this.target)>ro?(this.dispatchEvent(iu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Gt/60*this.autoRotateSpeed*e:Gt/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Et.setFromMatrixColumn(n,0),Et.multiplyScalar(-e),this._panOffset.add(Et)}_panUp(e,n){this.screenSpacePanning===!0?Et.setFromMatrixColumn(n,1):(Et.setFromMatrixColumn(n,0),Et.crossVectors(this.object.up,Et)),Et.multiplyScalar(e),this._panOffset.add(Et)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Et.copy(s).sub(this.target);let r=Et.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=n-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/n.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/n.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Fe,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function hT(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function fT(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function pT(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Dh),this.state=tt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function mT(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ts.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=tt.DOLLY;break;case ts.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=tt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=tt.ROTATE}break;case ts.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=tt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=tt.PAN}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent(Hc)}function gT(t){switch(this.state){case tt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case tt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case tt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function _T(t){this.enabled===!1||this.enableZoom===!1||this.state!==tt.NONE||(t.preventDefault(),this.dispatchEvent(Hc),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(Dh))}function xT(t){this.enabled!==!1&&this._handleKeyDown(t)}function vT(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case ji.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=tt.TOUCH_ROTATE;break;case ji.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=tt.TOUCH_PAN;break;default:this.state=tt.NONE}break;case 2:switch(this.touches.TWO){case ji.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=tt.TOUCH_DOLLY_PAN;break;case ji.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=tt.TOUCH_DOLLY_ROTATE;break;default:this.state=tt.NONE}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent(Hc)}function MT(t){switch(this._trackPointer(t),this.state){case tt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case tt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case tt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case tt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=tt.NONE}}function yT(t){this.enabled!==!1&&t.preventDefault()}function ST(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function ET(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const bT=Object.freeze({invalid:12986408,unsupported:14067456}),AT={boundary:1842204,cut:0,hingeMountain:2894892,hingeValley:4473924,hingeUnassigned:3158064,flatSeam:6052956,link:2368548,sectorRay:1118481};function TT(t,e){const n=new Ls;n.name="engine-lab-frame";const i=new Map;for(const s of t.faces){CT(s.id,s.vertices);const r=oo(s.sourceEntities??[],e),a=new zt;a.setAttribute("position",new Vt(s.vertices.flat(),3));const o=wT(s.vertices);a.setIndex(o),a.computeVertexNormals();const c=new sy({color:co(r)??14211288,metalness:0,roughness:.82,opacity:.72,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,side:Sn}),l=new pn(a,c);l.renderOrder=0,ao(l,s.id,"face",s.sourceEntities??[],r,i,n),s.sourceOperationId!==void 0&&(l.userData.sourceOperationId=s.sourceOperationId)}for(const s of t.segments){$r(s.id,s.start),$r(s.id,s.end);const r=oo(s.sourceEntities??[],e),a=new zt().setFromPoints([new U(...s.start),new U(...s.end)]),o=RT(s.role,co(r)??AT[s.role]),c=new cc(a,o);c.renderOrder=1,o instanceof Gr&&c.computeLineDistances(),ao(c,s.id,s.role,s.sourceEntities??[],r,i,n)}for(const s of t.points){$r(s.id,s.position);const r=oo(s.sourceEntities??[],e),a=new zt;a.setAttribute("position",new Vt(s.position,3));const o=new mh({color:co(r)??(s.role==="junction"?0:s.role==="anchor"?2236962:3355443),size:.055,sizeAttenuation:!0}),c=new Md(a,o);c.renderOrder=2,ao(c,s.id,s.role,s.sourceEntities??[],r,i,n)}return{group:n,objectByPrimitiveId:i,dispose(){for(const s of i.values())if(s instanceof pn||s instanceof cc||s instanceof Md){s.geometry.dispose();const r=Array.isArray(s.material)?s.material:[s.material];for(const a of r)a.dispose()}n.clear(),i.clear()}}}function wT(t){const e=t.reduce((s,r,a)=>{const o=t[(a+1)%t.length];return[s[0]+(r[1]-o[1])*(r[2]+o[2]),s[1]+(r[2]-o[2])*(r[0]+o[0]),s[2]+(r[0]-o[0])*(r[1]+o[1])]},[0,0,0]),n=Math.abs(e[0])>=Math.abs(e[1])&&Math.abs(e[0])>=Math.abs(e[2])?0:Math.abs(e[1])>=Math.abs(e[2])?1:2,i=t.map(s=>n===0?new Fe(s[1],s[2]):n===1?new Fe(s[0],s[2]):new Fe(s[0],s[1]));return Vc.triangulateShape(i,[]).flat()}function ao(t,e,n,i,s,r,a){if(r.has(e))throw new RangeError(`Duplicate lab primitive ID: ${e}.`);t.name=e,t.userData.primitiveId=e,t.userData.role=n,t.userData.sourceEntities=i.map(o=>({...o})),s!==void 0&&(t.userData.diagnosticState=s),r.set(e,t),a.add(t)}function RT(t,e){return t==="hingeMountain"?new Gr({color:e,dashSize:.08,gapSize:.025}):t==="hingeValley"?new Gr({color:e,dashSize:.025,gapSize:.04}):t==="hingeUnassigned"?new Gr({color:e,dashSize:.04,gapSize:.04}):new ma({color:e})}function oo(t,e){if(e===void 0||e.disposition==="accepted")return;const n=e.diagnostics.flatMap(i=>i.locations.some(r=>r.kind==="entity"&&t.some(a=>ru(a)===ru(r.entity)))?[i.category==="unsupported"?"unsupported":"invalid"]:[]);return n.includes("invalid")?"invalid":n.includes("unsupported")?"unsupported":void 0}function co(t){return t===void 0?void 0:bT[t]}function ru(t){return`${t.kind}\0${t.id}`}function CT(t,e){if(e.length<3)throw new RangeError(`Face ${t} requires at least three vertices.`);for(const n of e)$r(t,n)}function $r(t,e){if(e.length!==3||!e.every(Number.isFinite))throw new RangeError(`Primitive ${t} requires finite 3D coordinates.`)}const au=Object.freeze({gridCenter:13948116,grid:15658734});function PT(t){const e=new lT({antialias:!0,alpha:!1});e.setClearColor(16777215,1),e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.outputColorSpace=jt,t.append(e.domElement);const n=new EM;n.fog=new kc(16777215,.018);const i=new an(42,1,.01,1e3);i.position.set(6,5,7);const s=new uT(i,e.domElement);s.enableDamping=!0,s.dampingFactor=.08,s.screenSpacePanning=!0,n.add(new ly(16777215,1.2));const r=new Pd(16777215,2.5);r.position.set(4,7,5),n.add(r);const a=new Pd(16777215,1.1);a.position.set(-5,2,-4),n.add(a);const o=new hy(24,24,au.gridCenter,au.grid);o.position.y=-.002,n.add(o);let c,l=!1;const h=()=>{const d=Math.max(t.clientWidth,1),f=Math.max(t.clientHeight,1);e.setSize(d,f,!1),i.aspect=d/f,i.updateProjectionMatrix()},u=new ResizeObserver(h);return u.observe(t),h(),e.setAnimationLoop(()=>{s.update(),e.render(n,i)}),{show(d,f){c?.dispose(),c&&n.remove(c.group),c=TT(d,f),n.add(c.group)},focus(){if(!c)return;const d=new hs().setFromObject(c.group);if(d.isEmpty()){s.target.set(0,0,0),i.position.set(6,5,7),s.update();return}const f=d.getCenter(new U),p=d.getSize(new U),m=Math.max(p.length()*.5,.5)/Math.sin(ch.degToRad(i.fov*.5)),g=new U(1.15,.85,1.35).normalize();s.target.copy(f),i.position.copy(f).addScaledVector(g,m*1.15),i.near=Math.max(m/1e3,.001),i.far=Math.max(m*100,100),i.updateProjectionMatrix(),s.update()},resize:h,dispose(){l||(l=!0,u.disconnect(),e.setAnimationLoop(null),s.dispose(),c?.dispose(),e.dispose(),e.domElement.remove())}}}const ou={width:210,height:297},IT={width:297,height:210},Nh=10;function LT(t,e=Nh){const n=t.faces.length>0?t.faces.flatMap(a=>a.vertices):t.segments.flatMap(a=>[a.start,a.end]);if(n.length===0)throw new RangeError("Fabrication frame is empty.");const i=NT(n),s=n.map(a=>[a[i[0]],a[i[1]]]),r={minX:Math.min(...s.map(([a])=>a)),minY:Math.min(...s.map(([,a])=>a)),maxX:Math.max(...s.map(([a])=>a)),maxY:Math.max(...s.map(([,a])=>a))};return{...DT(r,e),bounds:r,axes:i}}function DT(t,e=Nh){if(![t.minX,t.minY,t.maxX,t.maxY,e].every(Number.isFinite))throw new RangeError("Fabrication bounds and margin must be finite.");const i=t.maxX-t.minX,s=t.maxY-t.minY;if(i<=0||s<=0)throw new RangeError("Fabrication bounds must have positive area.");if(e<0||e*2>=ou.width)throw new RangeError("A4 print margin leaves no printable area.");const r=["portrait","landscape"].map(c=>{const l=c==="portrait"?ou:IT,h=Math.min((l.width-e*2)/i,(l.height-e*2)/s);return{orientation:c,pageMm:l,scale:h}}),a=r[1].scale>r[0].scale?r[1]:r[0],o={width:i*a.scale,height:s*a.scale};return{...a,marginMm:e,contentMm:o,offsetMm:{x:(a.pageMm.width-o.width)/2,y:(a.pageMm.height-o.height)/2},bounds:t,axes:[0,1]}}function cu(t,e){return[e.offsetMm.x+(t[e.axes[0]]-e.bounds.minX)*e.scale,e.offsetMm.y+(t[e.axes[1]]-e.bounds.minY)*e.scale]}function NT(t){const n=[0,1,2].map(i=>{const s=t.map(r=>r[i]);return{axis:i,range:Math.max(...s)-Math.min(...s)}}).sort((i,s)=>s.range-i.range||i.axis-s.axis).slice(0,2).map(({axis:i})=>i).sort((i,s)=>i-s);return[n[0],n[1]]}const FT=new Set(["boundary","cut","hingeMountain","hingeValley","hingeUnassigned"]);function UT(t,e={}){const n=LT(t,e.marginMm),i=t.segments.filter(o=>FT.has(o.role)).map(o=>OT(o,n)),{width:s,height:r}=n.pageMm;return{svg:[`<svg xmlns="http://www.w3.org/2000/svg" width="${s}mm" height="${r}mm" viewBox="0 0 ${s} ${r}" role="img" aria-label="A4 flat fabrication template">`,"  <style>line{fill:none;stroke:#000;stroke-width:.25;vector-effect:non-scaling-stroke;stroke-linecap:butt}.boundary,.cut{stroke-dasharray:none}.fold{stroke-width:.2}.mountain{stroke-dasharray:6 2}.valley{stroke-dasharray:2 2}.unassigned{stroke-dasharray:4 2}</style>",...i,"</svg>"].join(`
`),orientation:n.orientation,pageMm:n.pageMm,layout:n}}function OT(t,e){const[n,i]=cu(t.start,e),[s,r]=cu(t.end,e);return`  <line data-edge-id="${BT(t.id)}" data-role="${t.role}" class="${kT(t.role)}" x1="${Fr(n)}" y1="${Fr(i)}" x2="${Fr(s)}" y2="${Fr(r)}" />`}function kT(t){switch(t){case"boundary":return"boundary";case"cut":return"cut";case"hingeMountain":return"fold mountain";case"hingeValley":return"fold valley";case"hingeUnassigned":return"fold unassigned";default:throw new RangeError(`Role ${t} is not printable.`)}}function Fr(t){const e=Math.abs(t)<1e-10?0:t;return Number(e.toFixed(6)).toString()}function BT(t){return t.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}const VT="iframe[data-fabrication-print]";function zT(t,e="Kirigami A4 fabrication template"){const n=t.orientation==="landscape"?"landscape":"portrait",{width:i,height:s}=t.pageMm;return`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${GT(e)}</title>
    <style>
      @page { size: A4 ${n}; margin: 0; }
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
  <body>${t.svg}</body>
</html>`}function HT(t,e,n=document){n.querySelector(VT)?.remove();const i=n.createElement("iframe");return i.dataset.fabricationPrint="",i.title="A4 fabrication print surface",i.setAttribute("aria-hidden","true"),Object.assign(i.style,{position:"fixed",width:"1px",height:"1px",right:"0",bottom:"0",border:"0",opacity:"0",pointerEvents:"none"}),i.srcdoc=zT(t,e),i.addEventListener("load",()=>{const s=i.contentWindow;s&&(s.focus(),s.print())},{once:!0}),n.body.append(i),i}function GT(t){return t.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const lu={points:[],segments:[],faces:[]},Ur={width:1.2,stepCount:7,stepRun:.32,stepRise:.32,hostWidth:4,hostFloorExtent:2.56,hostWallExtent:2.56},WT={height:1,length:2,width:5};function $T(t){t.innerHTML=`
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
          <summary><h2>Committed examples</h2><span>${sr.length}</span></summary>
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
  `;const e=Wt(t,".example-list"),n=Wt(t,".viewport-host"),i=Wt(t,".viewport-state"),s=Wt(t,".viewport-print"),r=Wt(t,".viewport-preview-label"),a=Wt(t,".stair-preview-label"),o=Wt(t,".stair-strategy-list"),c=Wt(t,".module-list"),l=Wt(t,".cutout-list"),h=Wt(t,".inspector-scroll"),u=Wt(t,".timeline-panel input[type='range']"),d=Wt(t,".timeline-panel output"),f=Wt(t,".timeline-markers"),p=Wt(t,".timeline-play"),_=[...t.querySelectorAll(".timeline-step")],m=PT(n),g=wx();let A=0,w,v,E,y,T=0,M,b,P="Kirigami A4 fabrication template";const C=(Q,G)=>{b=Q,P=G??"Kirigami A4 fabrication template",s.disabled=Q===void 0},I=()=>{M!==void 0&&window.clearInterval(M),M=void 0,p.ariaPressed="false",p.textContent="Play"},X=Q=>Q.points.length+Q.segments.length+Q.faces.length>0,H=(Q,G)=>{const he=new Map;if(Q.result.observed.disposition!=="accepted")for(const de of Q.result.diagnostics)for(const ye of de.locations){if(ye.kind!=="sample")continue;const we=de.category==="unsupported"?"unsupported":"invalid";(we==="invalid"||he.get(ye.index)===void 0)&&he.set(ye.index,we)}const ne=Math.max(G-1,...he.keys(),0);f.replaceChildren(...[...he.entries()].map(([de,ye])=>{const we=document.createElement("span");return we.dataset.diagnosticState=ye,we.style.left=`${ne===0?0:de/ne*100}%`,we.title=`${ye} at sample ${de+1}`,we.setAttribute("role","img"),we.setAttribute("aria-label",we.title),we}))},D=(Q,G=!1)=>{const he=v?.frames??w?.frames.map(we=>we.frame)??[],ne=v?.parameters??w?.frames.map(we=>we.parameter)??[];if(he.length===0)return;T=Math.max(0,Math.min(Q,he.length-1));const de=he[T];a.hidden=!v,r.hidden=!0,delete r.dataset.diagnosticState,m.show(de),G&&m.focus(),u.max=String(he.length-1),u.value=String(T);const ye=he.length>1;u.disabled=!ye,p.disabled=!ye;for(const we of _)we.disabled=!ye;w&&!v&&H(w,he.length),d.value=`sample ${T+1}/${he.length} · parameter ${XT(ne[T]??0)}`},$=Q=>{T=0,u.value="0",u.max="0",u.disabled=!0,p.disabled=!0;for(const G of _)G.disabled=!0;d.value=Q?"no renderable samples · previous geometry retained":"no engine samples"},B=Q=>{i.hidden=Q===void 0,i.textContent=Q??""},q=Q=>{Fx(h,w,Q,{onParameterCommit(G,he){if(!y)return;const ne=Cx(y,G,he);if(!ne.ok){q(ne.diagnostics[0]?.message);return}y=ne.example,te(ne.example,{preserveGeometryOnEmpty:!0,focus:!1})},onReset(){E&&(y=E,te(E,{preserveGeometryOnEmpty:!0,focus:!1}))}})},te=async(Q,G)=>{I();const he=++A;B(`Evaluating ${Q.id}…`);try{const ne=await g.evaluate(Q);if(he!==A)return;w=ne,y=ne.example,T=0,q(),ne.frames.some(({frame:ye})=>X(ye))?(C(ne.frames.find(({frame:ye})=>X(ye))?.frame,`${ne.example.title} — A4 fabrication template`),D(0,G.focus)):ne.diagnosticPreview!==void 0&&!G.preserveGeometryOnEmpty?(m.show(ne.diagnosticPreview.frame,{diagnostics:ne.result.diagnostics,disposition:ne.result.observed.disposition}),G.focus&&m.focus(),r.hidden=!1,r.dataset.diagnosticState=ne.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=`${ne.diagnosticPreview.label} · ${ne.result.observed.disposition}`,$(!1),H(ne,0),d.value=`${ne.diagnosticPreview.label} · no certified engine samples`):(G.preserveGeometryOnEmpty||C(),G.preserveGeometryOnEmpty||(m.show(lu),G.focus&&m.focus()),r.hidden=!1,r.dataset.diagnosticState=ne.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=G.preserveGeometryOnEmpty?`${ne.result.observed.disposition} input · previous certified geometry retained`:`${ne.result.observed.disposition} · no spatial preview`,$(G.preserveGeometryOnEmpty),H(ne,0)),B()}catch(ne){if(he!==A)return;const de=ne instanceof Error?ne.message:String(ne);q(de),B(`Engine error · ${de}`)}},re=Q=>{const G=sr[Q];if(G){for(const[he,ne]of[...e.querySelectorAll(".example-row")].entries())ne.ariaPressed=String(he===Q);E=G.example,y=G.example,v=void 0,C(),a.hidden=!0,te(G.example,{preserveGeometryOnEmpty:!1,focus:!0})}},ce=()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const Q={operationId:"certified-one-sheet-stair",hostPlane:"wall",...Ur},G=mc(Q);if(!G.ok){h.textContent=G.diagnostics[0]?.message??"Stair rejected.";return}const he=_c({input:Q,complex:G.complex,sourceMap:G.sourceMap,sampleCount:7});if(!he.ok){h.textContent=he.diagnostics[0]?.message??"Stair path rejected.";return}a.textContent="certified compiler result · One-sheet staircase";const ne=he.samples.map(de=>kx(G.complex,G.sourceMap,Q,de.transforms));v={frames:ne,parameters:he.samples.map(de=>de.parameter)},C(ne[0],"One-sheet staircase — A4 fabrication template"),m.show(ne.at(-1)),m.focus(),h.innerHTML=`
      <section class="inspection-section">
        <h2>One-sheet staircase</h2>
        <p class="quiet">Certified as one connected material component after cuts: stair, bridges, and host remain materially joined.</p>
      </section>
      <section class="inspection-section">
        <h2>Construction</h2>
        <p class="quiet">${Q.stepCount} steps · A4 flat fabrication sheet · ${G.sourceMap.faces.filter(de=>de.role==="step").length} retained step surfaces · ${G.sourceMap.cutPairs.length} paired cuts · ${G.sourceMap.voids.length} opening voids.</p>
        <p class="quiet">Construction status: certified connected sheet.</p>
      </section>
    `,D(ne.length-1)},ae=document.createElement("button");ae.type="button",ae.className="stair-strategy-button",ae.ariaPressed="false",ae.textContent="One-sheet staircase",ae.addEventListener("click",()=>{ae.ariaPressed="true",ce()}),o.append(ae);const ze=document.createElement("button");ze.type="button",ze.className="stair-strategy-button",ze.ariaPressed="false",ze.textContent="Tread-only staircase",ze.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const Q={operationId:"tread-only-stair",...Ur},G=Ac(Q);if(!G.ok){h.textContent=G.diagnostics[0]?.message??"Tread-only pattern rejected.";return}const he=Tc({input:Q,complex:G.complex,sourceMap:G.sourceMap,sampleCount:7});if(!he.ok){h.textContent=he.diagnostics[0]?.message??"Tread-only deployment rejected.";return}const ne=he.samples.map(ye=>ye.parameter),de=he.samples.map(ye=>Bx(G.complex,G.sourceMap,ye.transforms));v={frames:de,parameters:ne},C(de[0],"Tread-only staircase — A4 fabrication template"),m.show(de.at(-1)),m.focus(),a.textContent="compiler construction preview · Tread-only staircase",h.innerHTML=`
      <section class="inspection-section">
        <h2>Tread-only staircase</h2>
        <p class="quiet">${Q.stepCount} steps · A4 flat fabrication sheet. Compiled directly from the approved one-sheet cut/score template: ${G.sourceMap.cutLines.length} authored long cuts, ${G.sourceMap.hinges.filter(ye=>ye.role!=="parent").length} step folds, and no riser faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">Computed from one topology: retained edges remain joined while paired cut banks open into negative space.</p>
      </section>
    `,D(de.length-1)}),o.append(ze);const Ze=document.createElement("button");Ze.type="button",Ze.className="stair-strategy-button",Ze.ariaPressed="false",Ze.textContent="Riser-only staircase",Ze.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const Q={operationId:"riser-only-stair",...Ur},G=Yx(Q);if(!G.ok){h.textContent=G.diagnostics[0]?.message??"Riser-only pattern rejected.";return}const he=Kx({input:Q,complex:G.complex,sourceMap:G.sourceMap,sampleCount:7});if(!he.ok){h.textContent=he.diagnostics[0]?.message??"Riser-only deployment rejected.";return}const ne=he.samples.map(ye=>ye.parameter),de=he.samples.map(ye=>Vx(G.complex,G.sourceMap,ye.transforms));v={frames:de,parameters:ne},C(de[0],"Riser-only staircase — A4 fabrication template"),m.show(de.at(-1)),m.focus(),a.textContent="compiler construction preview · Riser-only staircase",h.innerHTML=`
      <section class="inspection-section">
        <h2>Riser-only staircase</h2>
        <p class="quiet">${Q.stepCount} steps · A4 flat fabrication sheet. Compiled from the same one-sheet cut topology in its flipped deployment: ${G.sourceMap.cutLines.length} authored long cuts, ${G.sourceMap.supports.length} retained riser regions, and no tread faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">The stationary host supports the risers while one connected carrier wall preserves their material ancestry and retained-edge closure.</p>
      </section>
    `,D(de.length-1)}),o.append(Ze);const He=document.createElement("button");He.type="button",He.className="stair-strategy-button",He.ariaPressed="false",He.textContent="Carrier-hosted compound staircase",He.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const Q=Qx({operationId:"carrier-hosted-compound-stair",parent:Ur,child:{width:.16,stepCount:4,stepRun:.144,stepRise:.144,hostWidth:.24,hostFloorExtent:.72,hostWallExtent:.72},childHostStepIndex:6});if(!Q.ok){h.textContent=Q.diagnostics[0]?.message??"Compound stair rejected.";return}const G=ev({compilation:Q,sampleCount:7});if(!G.ok){h.textContent=G.diagnostics[0]?.message??"Compound deployment rejected.";return}const he=G.samples.map(de=>de.parameter),ne=G.samples.map(de=>zx(Q,de));v={frames:ne,parameters:he},C(ne[0],"Carrier-hosted compound staircase — A4 fabrication template"),m.show(ne.at(-1)),m.focus(),a.textContent="compiler construction preview · Carrier-hosted compound staircase",h.innerHTML=`
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
    `,D(ne.length-1)}),o.append(He);const Z=document.createElement("button");Z.type="button",Z.className="stair-strategy-button",Z.ariaPressed="false",Z.textContent="Ground slab";const oe=(Q,G)=>{const he=Q.result.observed.disposition==="accepted",ne=Q.result.diagnostics.map(de=>`<p class="quiet inspector-error">${ws(de.message)}</p>`).join("");h.innerHTML=`
      <section class="inspection-section">
        <h2>Ground slab</h2>
        <p class="quiet">A fixed paper envelope containing a slab module. Height and Length resize only the slab inside the sheet.</p>
        <div class="slab-controls">
          <label class="slab-control"><span>Height <output>${G.height.toFixed(2)}</output></span><input type="range" aria-label="Height" min="0.1" max="3" step="0.05" value="${G.height}"></label>
          <label class="slab-control"><span>Length <output>${G.length.toFixed(2)}</output></span><input type="range" aria-label="Length" min="0.1" max="3" step="0.05" value="${G.length}"></label>
          <label class="slab-control"><span>Width <output>${G.width.toFixed(2)}</output></span><input type="range" aria-label="Width" min="0.5" max="6" step="0.1" value="${G.width}"></label>
        </div>
      </section>
      <section class="inspection-section">
        <h2>Compiler status</h2>
        <p class="quiet" data-slab-status><strong>${he?"accepted":"rejected"}</strong> · height ${G.height.toFixed(2)} · length ${G.length.toFixed(2)} · width ${G.width.toFixed(2)}</p>
        <p class="quiet">Height is the slab’s vertical rise, Length is its floor projection, and Width is its shared span.</p>
        <div data-slab-diagnostics>${ne}</div>
      </section>
    `,h.querySelectorAll("input[type=range]").forEach(de=>{de.addEventListener("input",()=>{const ye=we=>Number(h.querySelector(`input[aria-label="${we}"]`)?.value??0);Ne({height:ye("Height"),length:ye("Length"),width:ye("Width")})})})},ie=(Q,G)=>{const he=Q.result.observed.disposition==="accepted",ne=h.querySelector("[data-slab-status]");ne&&(ne.innerHTML=`<strong>${he?"accepted":"rejected"}</strong> · height ${G.height.toFixed(2)} · length ${G.length.toFixed(2)} · width ${G.width.toFixed(2)}`);for(const[ye,we]of[["Height",G.height],["Length",G.length],["Width",G.width]]){const Ye=h.querySelector(`input[aria-label="${ye}"]`),ht=Ye?.parentElement?.querySelector("output");Ye&&(Ye.value=String(we)),ht&&(ht.value=we.toFixed(2))}const de=h.querySelector("[data-slab-diagnostics]");de&&(de.innerHTML=Q.result.diagnostics.map(ye=>`<p class="quiet inspector-error">${ws(ye.message)}</p>`).join(""))},Ne=(Q,G=!1)=>{I(),A+=1;const he=sr.find(({example:Ye})=>Ye.title==="One root plane pair");if(!he){h.textContent="Certified root plane pair example is unavailable.";return}if(he.example.kind!=="spatialProgram"){h.textContent="Root plane pair example is not a spatial program.";return}const ne={...he.example,id:"ground-slab",title:"Ground slab",assumptions:["Wide shallow plane-pair slab"],input:{...he.example.input,id:"ground-slab",sheet:{...he.example.input.sheet,width:6,wallExtent:3,floorExtent:3},operations:he.example.input.operations.map(Ye=>({...Ye,id:"slab-pair",xOffset:.5,width:Q.width,height:Q.height,depth:Q.length,alignment:"axisAligned"}))}},de=px(ne);w=de,E=he.example,y=ne,r.hidden=!0;const ye=de.frames.map(Ye=>({...Ye.frame,points:[]})),we=de.frames.map(Ye=>Ye.parameter);de.result.observed.disposition==="accepted"&&ye.length>0?(v={frames:ye,parameters:we},C(ye.at(-1),"Ground slab — A4 fabrication template"),a.hidden=!1,a.textContent="compiler construction preview · Ground slab",D(0)):(v=void 0,C(de.diagnosticPreview?.frame,"Ground slab — diagnostic preview"),a.hidden=!0,m.show(de.diagnosticPreview?.frame??lu,{diagnostics:de.result.diagnostics,disposition:de.result.observed.disposition}),G&&m.focus(),$(!1)),h.querySelector(".slab-controls")?ie(de,Q):oe(de,Q),G&&de.result.observed.disposition==="accepted"&&m.focus()};Z.addEventListener("click",()=>Ne(WT,!0)),c.append(Z);for(const Q of["Wall","Roof"]){const G=document.createElement("button");G.type="button",G.className="stair-strategy-button",G.disabled=!0,G.textContent=`${Q} · planned`,c.append(G)}for(const Q of["Window","Door"]){const G=document.createElement("button");G.type="button",G.className="stair-strategy-button",G.disabled=!0,G.textContent=`${Q} · planned`,l.append(G)}s.addEventListener("click",()=>{if(b)try{const Q=UT(b);HT(Q,P)}catch(Q){const G=Q instanceof Error?Q.message:String(Q);B(`Print unavailable · ${G}`)}});for(const[Q,G]of sr.entries()){const he=document.createElement("button");he.type="button",he.className="example-row",he.ariaPressed="false",he.innerHTML=`
      <span class="example-index">${String(Q+1).padStart(2,"0")}</span>
      <span>
        <strong>${ws(G.example.title)}</strong>
        <small>${ws(G.example.kind)} · ${ws(G.example.fixtureClass)}</small>
      </span>
    `,he.addEventListener("click",()=>re(Q)),e.append(he)}return u.addEventListener("input",()=>{a.hidden=!0,I(),D(Number(u.value))}),_.forEach(Q=>{Q.addEventListener("click",()=>{I(),D(T+Number(Q.dataset.direction))})}),p.addEventListener("click",()=>{if(M!==void 0){I();return}const Q=v?.frames.length??w?.frames.length??0;Q<=1||(T>=Q-1&&D(0),p.ariaPressed="true",p.textContent="Pause",M=window.setInterval(()=>{const G=v?.frames.length??w?.frames.length??0;if(G===0||T>=G-1){I();return}D(T+1)},650))}),q(),re(0),()=>{A+=1,I(),g.dispose(),m.dispose(),t.replaceChildren()}}function Wt(t,e){const n=t.querySelector(e);if(!n)throw new Error(`Missing Engine Lab element: ${e}.`);return n}function XT(t){return Math.abs(t)>=1e3||t!==0&&Math.abs(t)<.001?t.toExponential(5):t.toFixed(5).replace(/0+$/,"").replace(/\.$/,"")}function ws(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}const Fh=document.querySelector("#app");if(!Fh)throw new Error("Missing Engine Lab root.");$T(Fh);
