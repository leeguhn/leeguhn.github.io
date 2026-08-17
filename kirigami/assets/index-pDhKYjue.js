(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const Wh=1;function Ci(t){if(!Xh(t))return[vt("TOPOLOGY_SCHEMA_UNSUPPORTED","Value does not have the required cell-complex collections.",[])];if(t.schemaVersion!==Wh)return[vt("TOPOLOGY_SCHEMA_UNSUPPORTED",`Topology schema version ${String(t.schemaVersion)} is not supported.`,[])];const e=qh(t);if(e)return[vt("TOPOLOGY_DUPLICATE_ID",`Entity ID ${e.id} is not unique.`,[e])];const n=[],i=new Map(t.vertices.map(c=>[c.id,c])),s=new Map(t.halfEdges.map(c=>[c.id,c])),r=new Map(t.edges.map(c=>[c.id,c])),a=new Map(t.faces.map(c=>[c.id,c])),o=new Map(t.cutPairs.map(c=>[c.id,c]));for(const c of t.vertices)(c.position.length!==2||!c.position.every(l=>Number.isFinite(l)))&&n.push(vt("TOPOLOGY_INVALID_NUMBER","Vertex coordinates must be finite two-dimensional values.",[ot("vertex",c.id)]));for(const c of t.halfEdges){ms(n,i,"vertex",c.origin,c),ms(n,s,"halfEdge",c.next,c),ms(n,r,"edge",c.edge,c),ms(n,a,"face",c.face,c),c.twin!==void 0&&ms(n,s,"halfEdge",c.twin,c);const l=r.get(c.edge);l&&!l.halfEdges.includes(c.id)&&n.push(vt("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[ot("halfEdge",c.id),ot("edge",l.id)]))}for(const c of t.edges)Yh(c,s,n);for(const c of t.faces){rl(c,c.boundary,"boundary",s,n);for(const l of c.holes)rl(c,l,"hole",s,n)}for(const c of t.cutPairs)Zh(c,r,n);for(const c of t.edges.filter(l=>l.kind==="cutBank")){const l=c.cutBank?o.get(c.cutBank.pair):void 0;(!l||!l.banks.includes(c.id))&&n.push(vt("TOPOLOGY_CUT_PAIR_INVALID","Each cut bank must reference a cut pair that lists that edge.",[ot("edge",c.id)]))}return Jh(t,a,n),n}function Xh(t){if(typeof t!="object"||t===null)return!1;const e=t;return Array.isArray(e.vertices)&&e.vertices.every(n=>Ni(n)&&Array.isArray(n.position)&&n.position.length===2)&&Array.isArray(e.halfEdges)&&e.halfEdges.every(n=>Ni(n)&&typeof n.origin=="string"&&typeof n.next=="string"&&typeof n.edge=="string"&&typeof n.face=="string")&&Array.isArray(e.edges)&&e.edges.every(n=>Ni(n)&&Array.isArray(n.halfEdges)&&typeof n.kind=="string")&&Array.isArray(e.faces)&&e.faces.every(n=>Ni(n)&&typeof n.boundary=="string"&&Array.isArray(n.holes))&&Array.isArray(e.cutPairs)&&e.cutPairs.every(n=>Ni(n)&&Array.isArray(n.banks))&&Array.isArray(e.materialComponents)&&e.materialComponents.every(n=>Ni(n)&&Array.isArray(n.faces))}function Ni(t){return typeof t=="object"&&t!==null&&typeof t.id=="string"}function qh(t){const e=new Set,n=[["vertex",t.vertices],["halfEdge",t.halfEdges],["edge",t.edges],["face",t.faces],["cutPair",t.cutPairs],["materialComponent",t.materialComponents]];for(const[i,s]of n)for(const r of s){if(e.has(r.id))return ot(i,r.id);e.add(r.id)}}function ms(t,e,n,i,s){e.has(i)||t.push(vt("TOPOLOGY_MISSING_REFERENCE",`Half-edge ${s.id} references missing ${n} ${i}.`,[ot("halfEdge",s.id),ot(n,i)]))}function Yh(t,e,n){const i=t.kind==="hinge"||t.kind==="joined"||t.kind==="flatSeam",s=i?2:1;t.halfEdges.length!==s&&n.push(vt("TOPOLOGY_EDGE_CARDINALITY",`Edge kind ${t.kind} requires ${s} half-edge(s).`,[ot("edge",t.id)]));const r=t.halfEdges.map(a=>e.get(a)).filter(a=>a!==void 0);if(r.some(a=>a.edge!==t.id)&&n.push(vt("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[ot("edge",t.id)])),i&&r.length===2){const[a,o]=r;(a.twin!==o.id||o.twin!==a.id)&&n.push(vt("TOPOLOGY_TWIN_MISMATCH","Two-sided edge half-edges must be symmetric twins.",[ot("edge",t.id),ot("halfEdge",a.id),ot("halfEdge",o.id)]));const c=e.get(a.next)?.origin,l=e.get(o.next)?.origin;c!==void 0&&l!==void 0&&(a.origin!==l||o.origin!==c)&&n.push(vt("TOPOLOGY_TWIN_ORIENTATION","Twin half-edges must traverse the shared edge in opposite directions.",[ot("edge",t.id),ot("halfEdge",a.id),ot("halfEdge",o.id)]))}else!i&&r.some(a=>a.twin!==void 0)&&n.push(vt("TOPOLOGY_TWIN_MISMATCH","One-sided boundary and cut-bank half-edges cannot have twins.",[ot("edge",t.id)]));Kh(t,n)}function Kh(t,e){if(t.kind==="hinge"){if(!t.hinge){e.push(vt("TOPOLOGY_HINGE_SPEC_INVALID","A hinge edge requires a hinge specification.",[ot("edge",t.id)]));return}const[i,s]=t.hinge.angleRange;(![i,s,t.hinge.restAngle].every(Number.isFinite)||i>s||t.hinge.restAngle<i||t.hinge.restAngle>s)&&e.push(vt("TOPOLOGY_HINGE_INTERVAL_INVALID","Hinge angle bounds must be finite, ordered, and contain the rest angle.",[ot("edge",t.id)]))}else t.hinge!==void 0&&e.push(vt("TOPOLOGY_HINGE_SPEC_INVALID","Only hinge edges may carry hinge specifications.",[ot("edge",t.id)]));const n=t.cutBank!==void 0;t.kind==="cutBank"!==n&&e.push(vt("TOPOLOGY_CUT_PAIR_INVALID","Cut-bank metadata is required exactly on cut-bank edges.",[ot("edge",t.id)]))}function rl(t,e,n,i,s){const r=new Set;let a=e;for(;!r.has(a);){r.add(a);const o=i.get(a);if(!o||o.face!==t.id){s.push(al(t,n));return}a=o.next}(a!==e||r.size<3)&&s.push(al(t,n))}function al(t,e){return vt("TOPOLOGY_FACE_LOOP_OPEN",`Face ${e} must form a closed loop of at least three half-edges.`,[ot("face",t.id)])}function Zh(t,e,n){const[i,s]=t.banks,r=e.get(i),a=e.get(s);i!==s&&r?.kind==="cutBank"&&a?.kind==="cutBank"&&r.cutBank?.pair===t.id&&a.cutBank?.pair===t.id&&new Set([r.cutBank.bank,a.cutBank.bank]).size===2||n.push(vt("TOPOLOGY_CUT_PAIR_INVALID","A cut pair requires two distinct cut-bank edges labeled a and b.",[ot("cutPair",t.id)]))}function Jh(t,e,n){const i=new Map;for(const r of t.materialComponents)for(const a of r.faces)i.set(a,(i.get(a)??0)+1),e.has(a)||n.push(vt("TOPOLOGY_MISSING_REFERENCE",`Material component ${r.id} references missing face ${a}.`,[ot("materialComponent",r.id),ot("face",a)]));for(const r of t.faces)i.get(r.id)!==1&&n.push(vt("TOPOLOGY_COMPONENT_INVALID","Every face must belong to exactly one material component.",[ot("face",r.id)]));const s=new Map;for(const r of t.edges){if(!["hinge","joined","flatSeam"].includes(r.kind)||r.halfEdges.length!==2)continue;const a=r.halfEdges.map(l=>t.halfEdges.find(u=>u.id===l)).filter(l=>l!==void 0);if(a.length!==2||a[0].face===a[1].face)continue;const[o,c]=a.map(l=>l.face);s.get(o)?.add(c)??s.set(o,new Set([c])),s.get(c)?.add(o)??s.set(c,new Set([o]))}for(const r of t.materialComponents){const a=r.faces.filter(l=>e.has(l));if(a.length<2)continue;const o=new Set([a[0]]),c=[a[0]];for(;c.length>0;){const l=c.shift();for(const u of s.get(l)??[])a.includes(u)&&!o.has(u)&&(o.add(u),c.push(u))}o.size!==a.length&&n.push(vt("TOPOLOGY_COMPONENT_INVALID",`Material component ${r.id} contains disconnected faces; cut banks cannot substitute for a sheet connection.`,[ot("materialComponent",r.id)]))}}function vt(t,e,n){return{severity:"error",category:"topology",code:t,message:e,locations:n.length>0?n.map(i=>({kind:"entity",entity:i})):[{kind:"nonSpatial",reason:"Topology schema root."}],entities:n}}function ot(t,e){return{kind:t,id:e}}const Ze={absoluteLength:1e-9,relativeLength:1e-9,absoluteAngle:1e-9,relativeRank:1e-10};function ua(t,e=Ze){if(!Number.isFinite(t)||t<0)throw new RangeError("Scale must be finite non-negative.");return e.absoluteLength+e.relativeLength*t}function hu(t,e){const n=t.vertices.find(r=>r.id===e);if(!n)return{applicability:"notApplicable",reason:`Vertex ${e} does not exist.`};const i=t.edges.map(r=>({edge:r,endpoints:Qh(t,r)})).filter(({endpoints:r})=>r.includes(e));if(i.length===0)return{applicability:"notApplicable",reason:"Vertex has no incident material edges."};if(i.some(({edge:r})=>r.kind!=="hinge"||!r.hinge))return{applicability:"notApplicable",reason:"Classical single-vertex tests do not apply to non-hinge incidence."};const s=i.map(({edge:r,endpoints:a})=>{const o=a[0]===e?a[1]:a[0],c=t.vertices.find(h=>h.id===o);if(!c||!r.hinge)throw new Error("Validated incident edge is missing geometry.");const l=c.position[0]-n.position[0],u=c.position[1]-n.position[1];if(!(Math.hypot(l,u)<=Ze.absoluteLength))return{edgeId:r.id,directionAngle:Math.atan2(u,l),assignment:r.hinge.assignment}}).filter(r=>r!==void 0).sort((r,a)=>r.directionAngle-a.directionAngle);if(s.length!==i.length||s.length<2)return{applicability:"notApplicable",reason:"Crease rays must be nondegenerate."};for(let r=0;r<s.length;r+=1){const a=s[(r+1)%s.length];if((r===s.length-1?a.directionAngle+Math.PI*2-s[r].directionAngle:a.directionAngle-s[r].directionAngle)<=Ze.absoluteAngle)return{applicability:"notApplicable",reason:"Crease rays must have distinct directions."}}return{applicability:"applicable",rays:s,sectorAngles:s.map((r,a)=>{const o=s[(a+1)%s.length];return a===s.length-1?o.directionAngle+Math.PI*2-r.directionAngle:o.directionAngle-r.directionAngle})}}function jh(t,e){const n=hu(t,e);return n.applicability==="notApplicable"?n:{applicability:"applicable",rays:n.rays,sectorAngles:n.sectorAngles,...gc(n.sectorAngles,n.rays.map(i=>i.assignment))}}function gc(t,e,n=Ze.absoluteAngle){if(t.length!==e.length||t.length<2||t.some(f=>!Number.isFinite(f)||f<=0)){const f={status:"failed",reason:"Sector angles and assignments must be finite matching arrays."};return{kawasaki:f,maekawa:f,locallyFlatFoldable:!1}}const i=t.length%2!==0,s=t.reduce((f,p,_)=>(f[_%2]+=p,f),[0,0]),r=s[0]+s[1],a=Math.max(Math.abs(s[0]-Math.PI),Math.abs(s[1]-Math.PI),Math.abs(r-Math.PI*2)),o={status:!i&&a<=n?"satisfied":"failed",residual:a,...i?{reason:"Kawasaki requires even crease degree."}:{}},c=e.every(f=>f==="mountain"||f==="valley"),l=e.filter(f=>f==="mountain").length,u=e.filter(f=>f==="valley").length,h=Math.abs(Math.abs(l-u)-2),d=c?{status:h===0?"satisfied":"failed",residual:h}:{status:"notApplicable",reason:"Maekawa requires a complete mountain/valley assignment."};return{kawasaki:o,maekawa:d,locallyFlatFoldable:o.status==="satisfied"&&d.status==="satisfied"}}function Qh(t,e){const n=t.halfEdges.find(s=>s.id===e.halfEdges[0]),i=n?t.halfEdges.find(s=>s.id===n.next):void 0;if(!n||!i)throw new Error(`Edge ${e.id} has incomplete half-edge topology.`);return[n.origin,i.origin]}function ef(t,e=16){if(t.length<2||t.length>e||t.some(r=>!Number.isFinite(r)||r<=0))return{applicable:!1,candidateAssignments:[],locallyFlatFoldableAssignments:[],truncated:!1,reason:"Vertex degree is outside the bounded enumeration domain."};const n=2**t.length,i=[],s=[];for(let r=0;r<n;r+=1){const a=t.map((c,l)=>(r>>l&1)===0?"mountain":"valley");i.push(a),gc(t,a).locallyFlatFoldable&&s.push(a)}return{applicable:!0,candidateAssignments:i,locallyFlatFoldableAssignments:s,truncated:!1}}function tf(t){const e=t.edges.filter(r=>r.kind==="cutBank"),n=new Set(t.cutPairs.flatMap(r=>r.banks)),i=e.map(r=>r.id).filter(r=>!n.has(r)),s=t.cutPairs.filter(r=>r.banks.length!==2||r.banks[0]===r.banks[1]?!0:r.banks.some(a=>{const o=t.edges.find(c=>c.id===a);return o?.kind!=="cutBank"||o.cutBank?.pair!==r.id})).map(r=>r.id);return{certified:i.length===0&&s.length===0,cutPairIds:t.cutPairs.map(r=>r.id),unpairedCutBankIds:i,invalidCutPairIds:s}}function fu(t){const e=t.edges.filter(n=>n.kind==="hinge"&&n.hinge?.assignment==="unassigned").map(n=>n.id);return{complete:e.length===0,unassignedHingeIds:e}}function pu(t){const e=t.vertices.flatMap(a=>{const o=jh(t,a.id);return o.applicability==="applicable"?[{vertexId:a.id,analysis:o,counting:ef(o.sectorAngles)}]:[]}),n=mu(t),i=fu(t),s=nf(t),r=n.colorable&&i.complete&&s&&e.every(({analysis:a})=>a.locallyFlatFoldable);return{applicability:"local-gates-only",faceTwoColorability:n,mountainValley:i,localVertices:e,materialConnected:s,necessaryGatesSatisfied:r,globalProof:"unsupported"}}function nf(t){if(t.faces.length<=1)return!0;const e=new Map(t.faces.map(s=>[s.id,new Set]));for(const s of t.edges){if(!["hinge","joined","flatSeam"].includes(s.kind)||s.halfEdges.length!==2)continue;const r=s.halfEdges.map(a=>t.halfEdges.find(o=>o.id===a)?.face);r[0]&&r[1]&&r[0]!==r[1]&&(e.get(r[0])?.add(r[1]),e.get(r[1])?.add(r[0]))}const n=new Set,i=[t.faces[0].id];for(;i.length;){const s=i.shift();n.has(s)||(n.add(s),i.push(...e.get(s)??[]))}return n.size===t.faces.length}function mu(t){const e=new Map(t.faces.map(i=>[i.id,new Set]));for(const i of t.edges){if(i.halfEdges.length!==2)continue;const s=i.halfEdges.map(r=>t.halfEdges.find(a=>a.id===r)).filter(r=>r!==void 0);s.length!==2||s[0].face===s[1].face||(e.get(s[0].face)?.add(s[1].face),e.get(s[1].face)?.add(s[0].face))}const n=new Map;for(const i of t.faces){if(n.has(i.id))continue;n.set(i.id,0);const s=[i.id];for(;s.length>0;){const r=s.shift(),a=n.get(r);for(const o of e.get(r)??[]){const c=a===0?1:0,l=n.get(o);if(l!==void 0){if(l!==c)return{colorable:!1,colors:n,conflict:[r,o]};continue}n.set(o,c),s.push(o)}}}return{colorable:!0,colors:n}}function _c(t){const e=sf(t);if(e)return{ok:!1,diagnostics:[e]};const n=t.stepCount*2+2,i=[],s=[],r=[],a=[],o=[],c=[],l=[],u=[],h=[],d=(t.hostWidth-t.width)/2,f=[0,d,d+t.width,t.hostWidth],p=n*t.stepRun,_=t.hostFloorExtent+t.hostWallExtent,m=-t.hostFloorExtent+(_-p)/2;for(let b=0;b<=n;b+=1)for(let P=0;P<f.length;P+=1)i.push({id:`v:${b}:${P}`,position:[f[P],m+b*t.stepRun]});for(let b=0;b<n;b+=1)for(let P=0;P<3;P+=1){const C=P===1?`stair-face:${b}`:`host-face:${b}:${P}`,I=`he:${b}:${P}:bottom`,X=`he:${b}:${P}:right`,H=`he:${b}:${P}:top`,D=`he:${b}:${P}:left`;r.push({id:I,origin:`v:${b}:${P}`,next:X,edge:"pending",face:C},{id:X,origin:`v:${b}:${P+1}`,next:H,edge:"pending",face:C},{id:H,origin:`v:${b+1}:${P+1}`,next:D,edge:"pending",face:C},{id:D,origin:`v:${b+1}:${P}`,next:I,edge:"pending",face:C}),s.push({id:C,boundary:I,holes:[]});const W=P!==1||b===0?"host":b===n-1?"bridge":b%2===1?"step":"bridge";c.push({faceId:C,operationId:t.operationId,role:W})}const g=new Map(r.map(b=>[b.id,b])),A=(b,P)=>{for(const C of b)g.get(C).edge=P.id;b.length===2&&(g.get(b[0]).twin=b[1],g.get(b[1]).twin=b[0]),a.push(P),l.push({edgeId:P.id,operationId:t.operationId})};for(let b=0;b<3;b+=1){A([`he:0:${b}:bottom`],{id:`boundary:bottom:${b}`,halfEdges:[`he:0:${b}:bottom`],kind:"boundary"}),A([`he:${n-1}:${b}:top`],{id:`boundary:top:${b}`,halfEdges:[`he:${n-1}:${b}:top`],kind:"boundary"});for(let P=1;P<n;P+=1){const C=[`he:${P-1}:${b}:top`,`he:${P}:${b}:bottom`];if(b===1){const I=P%2===0?"valley":"mountain";A(C,{id:`hinge:${P-1}`,halfEdges:C,kind:"hinge",hinge:{assignment:I,restAngle:0,angleRange:I==="valley"?[0,Math.PI]:[-Math.PI,0]}})}else P===n/2?A(C,{id:`host-hinge:${b}`,halfEdges:C,kind:"hinge",hinge:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}):A(C,{id:`seam:h:${P}:${b}`,halfEdges:C,kind:"flatSeam"})}}for(let b=0;b<n;b+=1){A([`he:${b}:0:left`],{id:`boundary:left:${b}`,halfEdges:[`he:${b}:0:left`],kind:"boundary"}),A([`he:${b}:2:right`],{id:`boundary:right:${b}`,halfEdges:[`he:${b}:2:right`],kind:"boundary"});for(let P=1;P<=2;P+=1){const C=`he:${b}:${P-1}:right`,I=`he:${b}:${P}:left`;if(b===0||b===n-1){A([C,I],{id:`seam:v:${b}:${P}`,halfEdges:[C,I],kind:"flatSeam"});continue}const H=`cut:${b}:${P}`,D=`${H}:a`,W=`${H}:b`;A([C],{id:D,halfEdges:[C],kind:"cutBank",cutBank:{pair:H,bank:"a"}}),A([I],{id:W,halfEdges:[I],kind:"cutBank",cutBank:{pair:H,bank:"b"}}),o.push({id:H,banks:[D,W]});const B=Math.min(t.stepCount-1,Math.floor((b-1)/2));u.push({cutPairId:H,operationId:t.operationId,stepIndex:B}),b%2===1&&b<n-1&&h.push({voidId:`void:${b}:${P}`,stepIndex:B,cutPairIds:[H]})}}const w={schemaVersion:1,vertices:i,halfEdges:r,edges:a,faces:s,cutPairs:o,materialComponents:[{id:`stair-material:${t.operationId}`,faces:s.map(b=>b.id)}]},v=Ci(w);if(v.length>0)return{ok:!1,diagnostics:v};if(!mu(w).colorable)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_FLAT_COLORING_FAILED",message:"The stair crease graph is not two-colorable and cannot represent a flat origami sheet.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};if(!pu(w).materialConnected)return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:"The generated stair material is disconnected across its crease graph.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};const T=fu(w);if(!T.complete)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_ASSIGNMENT_MISMATCH",message:`Flat stair crease graph has unassigned hinges: ${T.unassignedHingeIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};const M=tf(w);return M.certified?{ok:!0,complex:w,sourceMap:{operationId:t.operationId,host:{plane:t.hostPlane??"wall",width:t.hostWidth,extent:t.hostPlane==="floor"?t.hostFloorExtent:t.hostWallExtent},faces:c,edges:l,cutPairs:u,voids:h}}:{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_CUT_PAIR_INVALID",message:`Stair cut graph contains unpaired cut banks: ${M.unpairedCutBankIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]}}function sf(t){return typeof t.operationId=="string"&&t.operationId.length>0&&Number.isFinite(t.width)&&t.width>0&&Number.isInteger(t.stepCount)&&t.stepCount>0&&Number.isFinite(t.stepRun)&&t.stepRun>0&&Number.isFinite(t.stepRise)&&t.stepRise>0&&t.stepRun===t.stepRise&&Number.isFinite(t.hostWidth)&&t.hostWidth>=t.width&&Number.isFinite(t.hostFloorExtent)&&t.hostFloorExtent>=t.stepCount*t.stepRun&&Number.isFinite(t.hostWallExtent)&&t.hostWallExtent>=t.stepCount*t.stepRise?void 0:{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:t.stepRun!==t.stepRise?"Certified stairs require equal step run and rise.":"Stair dimensions must be positive and fit within the host sheet bounds.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId||"unknown"}}],entities:[{kind:"spatialOperation",id:t.operationId||"unknown"}]}}function Ft(t,e){return[t[0]+e[0],t[1]+e[1],t[2]+e[2]]}function Xe(t,e){return[t[0]-e[0],t[1]-e[1],t[2]-e[2]]}function St(t,e){return[t[0]*e,t[1]*e,t[2]*e]}function ct(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function us(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function et(t){return Math.hypot(t[0],t[1],t[2])}function si(t){const e=et(t);if(!Number.isFinite(e)||e===0)throw new RangeError("Axis must be finite and nonzero.");return St(t,1/e)}function yi(t,e){return[ct(t[0],e),ct(t[1],e),ct(t[2],e)]}function rf(t,e){const n=a=>[e[0][a],e[1][a],e[2][a]],i=n(0),s=n(1),r=n(2);return[[ct(t[0],i),ct(t[0],s),ct(t[0],r)],[ct(t[1],i),ct(t[1],s),ct(t[1],r)],[ct(t[2],i),ct(t[2],s),ct(t[2],r)]]}function ht(t,e){return Ft(yi(t.rotation,e),t.translation)}function Xt(t,e){return{rotation:rf(t.rotation,e.rotation),translation:Ft(yi(t.rotation,e.translation),t.translation)}}function Ei(t){const e=[[t.rotation[0][0],t.rotation[1][0],t.rotation[2][0]],[t.rotation[0][1],t.rotation[1][1],t.rotation[2][1]],[t.rotation[0][2],t.rotation[1][2],t.rotation[2][2]]];return{rotation:e,translation:St(yi(e,t.translation),-1)}}function Yr(t){return{rotation:[[t.widthAxis[0],t.inPlaneAxis[0],t.normal[0]],[t.widthAxis[1],t.inPlaneAxis[1],t.normal[1]],[t.widthAxis[2],t.inPlaneAxis[2],t.normal[2]]],translation:t.origin}}function xc(t,e){return Xt(Yr(e),Ei(Yr(t)))}function af(t,e){if(!Number.isFinite(e))throw new RangeError("Rotation angle must be finite.");const[n,i,s]=si(t),r=Math.cos(e),a=Math.sin(e),o=1-r;return[[r+n*n*o,n*i*o-s*a,n*s*o+i*a],[i*n*o+s*a,r+i*i*o,i*s*o-n*a],[s*n*o-i*a,s*i*o+n*a,r+s*s*o]]}function bi(t,e,n){const i=af(e,n);return{rotation:i,translation:Xe(t,yi(i,t))}}function of(t){if(![...t.rotation[0],...t.rotation[1],...t.rotation[2],...t.translation].every(Number.isFinite))return Number.POSITIVE_INFINITY;const[n,i,s]=t.rotation;return Math.max(Math.abs(ct(n,n)-1),Math.abs(ct(i,i)-1),Math.abs(ct(s,s)-1),Math.abs(ct(n,i)),Math.abs(ct(n,s)),Math.abs(ct(i,s)),Math.abs(ct(n,us(i,s))-1))}function Ys(t,e=1e-9){const n=of(t);return Number.isFinite(n)&&n<=e}function cf(t,e,n=1e-9){const i=new Map(e.facePoses.map(o=>[o.faceId,o])),s=new Set;for(const o of t.edges){if(o.halfEdges.length!==2)continue;const c=o.halfEdges.map(l=>t.halfEdges.find(u=>u.id===l));!c[0]||!c[1]||c[0].face===c[1].face||s.add(ol(c[0].face,c[1].face))}const r=t.faces.flatMap(o=>{const c=i.get(o.id);if(!c)return[];const l=lf(t,o).map(h=>ht(c.transform,h));if(l.length<3)return[];const u=si(us(Xe(l[1],l[0]),Xe(l[2],l[0])));return[{face:o,points:l,normal:u}]}),a=[];for(let o=0;o<r.length;o+=1)for(let c=o+1;c<r.length;c+=1){const l=r[o],u=r[c];if(s.has(ol(l.face.id,u.face.id))||Math.abs(Math.abs(ct(l.normal,u.normal))-1)>n||Math.abs(ct(l.normal,Xe(u.points[0],l.points[0])))>n)continue;const h=df(l.normal),d=l.points.map(p=>cl(p,h)),f=u.points.map(p=>cl(p,h));uf(d,f,n)&&a.push({firstFaceId:l.face.id,secondFaceId:u.face.id})}return a}function lf(t,e){const n=[];let i=e.boundary;const s=new Set;for(;!s.has(i);){s.add(i);const r=t.halfEdges.find(o=>o.id===i);if(!r)break;const a=t.vertices.find(o=>o.id===r.origin);if(!a)break;n.push([a.position[0],a.position[1],0]),i=r.next}return n}function ol(t,e){return[t,e].sort().join("::")}function df(t){const e=t.map(Math.abs);return e[0]>=e[1]&&e[0]>=e[2]?0:e[1]>=e[2]?1:2}function cl(t,e){return e===0?[t[1],t[2]]:e===1?[t[0],t[2]]:[t[0],t[1]]}function uf(t,e,n){const i=ll(t),s=ll(e);if(Math.min(i.maxX,s.maxX)-Math.max(i.minX,s.minX)>n&&Math.min(i.maxY,s.maxY)-Math.max(i.minY,s.minY)>n||t.some(a=>Qs(a,e,n))||e.some(a=>Qs(a,t,n)))return!0;const r=a=>[a.reduce((o,c)=>o+c[0],0)/a.length,a.reduce((o,c)=>o+c[1],0)/a.length];if(Qs(r(t),e,n)||Qs(r(e),t,n))return!0;for(let a=0;a<t.length;a+=1){const o=t[a],c=t[(a+1)%t.length];for(let l=0;l<e.length;l+=1){const u=e[l],h=e[(l+1)%e.length];if(hf(o,c,u,h,n))return!0}}return!1}function ll(t){return{minX:Math.min(...t.map(e=>e[0])),maxX:Math.max(...t.map(e=>e[0])),minY:Math.min(...t.map(e=>e[1])),maxY:Math.max(...t.map(e=>e[1]))}}function Qs(t,e,n){let i=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const a=e[s],o=e[r];if(Math.abs(Cs(rn(o,a),rn(t,a)))<=n&&ff(rn(t,a),rn(t,o))<=n)return!1;a[1]>t[1]!=o[1]>t[1]&&t[0]<(o[0]-a[0])*(t[1]-a[1])/(o[1]-a[1])+a[0]&&(i=!i)}return i}function hf(t,e,n,i,s){const r=Cs(rn(e,t),rn(n,t)),a=Cs(rn(e,t),rn(i,t)),o=Cs(rn(i,n),rn(t,n)),c=Cs(rn(i,n),rn(e,n));return(r>s&&a<-s||r<-s&&a>s)&&(o>s&&c<-s||o<-s&&c>s)}function rn(t,e){return[t[0]-e[0],t[1]-e[1]]}function Cs(t,e){return t[0]*e[1]-t[1]*e[0]}function ff(t,e){return t[0]*e[0]+t[1]*e[1]}function tn(){return{rotation:[[1,0,0],[0,1,0],[0,0,1]],translation:[0,0,0]}}function pf(t,e,n=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY){if(e.length<2)return mf("A folding map requires at least two ordered samples.");const s=t.faces.map(l=>l.id);let r=!0,a=!0,o=0,c=0;for(const l of e){const u=new Map(l.facePoses.map(h=>[h.faceId,h.transform]));for(const h of s){const d=u.get(h);(!d||!Ys(d))&&(r=!1)}}for(let l=1;l<e.length;l+=1){const u=new Map(e[l-1].facePoses.map(_=>[_.faceId,_.transform])),h=new Map(e[l].facePoses.map(_=>[_.faceId,_.transform])),d=e[l-1].parameterValues.find(_=>_.parameterId==="deployment")?.value,f=e[l].parameterValues.find(_=>_.parameterId==="deployment")?.value,p=f!==void 0&&d!==void 0?Math.abs(f-d):0;for(const _ of t.faces){const m=u.get(_.id),g=h.get(_.id);if(!m||!g){a=!1;continue}let A=_.boundary;const w=new Set;for(;!w.has(A);){w.add(A);const v=t.halfEdges.find(y=>y.id===A),S=v?t.vertices.find(y=>y.id===v.origin):void 0;if(S){const y=[S.position[0],S.position[1],0];o=Math.max(o,et(Xe(ht(g,y),ht(m,y)))),p>0&&(c=Math.max(c,o/p))}if(!v)break;A=v.next}}}return a=a&&(!Number.isFinite(n)||o<=n),{applicable:!0,continuous:a,rigid:r,sampleCount:e.length,uniformDisplacementResidual:o,maximumDisplacementRate:c,rateBounded:!Number.isFinite(i)||c<=i}}function mf(t){return{applicable:!1,continuous:!1,rigid:!1,sampleCount:0,uniformDisplacementResidual:Number.POSITIVE_INFINITY,maximumDisplacementRate:Number.POSITIVE_INFINITY,rateBounded:!1,reason:t}}function gf(t,e=Ze.relativeRank){if(!Number.isFinite(e)||e<0)throw new RangeError("Rank tolerance must be finite and non-negative.");if(t.length===0)return{rank:0,threshold:0,acceptedPivots:[],rejectedMaximum:0};const n=t[0].length;if(t.some(l=>l.length!==n||l.some(u=>!Number.isFinite(u))))throw new RangeError("Rank matrix must be finite and rectangular.");const i=t.map(l=>[...l]),r=Math.max(0,...i.flat().map(l=>Math.abs(l)))*Math.max(t.length,n)*e,a=[];let o=0,c=0;for(let l=0;l<n&&c<i.length;l+=1){let u=c,h=Math.abs(i[u][l]);for(let f=c+1;f<i.length;f+=1){const p=Math.abs(i[f][l]);p>h&&(h=p,u=f)}if(h<=r){o=Math.max(o,h);continue}[i[c],i[u]]=[i[u],i[c]];const d=i[c][l];a.push(Math.abs(d));for(let f=l;f<n;f+=1)i[c][f]/=d;for(let f=0;f<i.length;f+=1){if(f===c)continue;const p=i[f][l];for(let _=l;_<n;_+=1)i[f][_]-=p*i[c][_]}c+=1}return{rank:c,threshold:r,acceptedPivots:a,rejectedMaximum:o}}function Br(t,e,n={}){if(!Number.isInteger(e)||e<0)throw new RangeError("Variable count must be a non-negative integer.");const i=gf(t,n.relativeTolerance??Ze.relativeRank),s=n.expectedRank;if(s!==void 0&&(!Number.isInteger(s)||s<0||s>e))throw new RangeError("Expected rank must fit the variable count.");return{...i,variableCount:e,dof:e-i.rank,...s===void 0?{}:{expectedRank:s},singular:s!==void 0&&i.rank<s}}function _f(t,e,n=t.map(()=>0)){return gu(t,e,n),t.reduce((i,s,r)=>{const a=bi([0,0,0],[0,0,1],e[r]),o=bi([0,0,0],[1,0,0],s),c={rotation:tn().rotation,translation:[n[r],0,0]},l=Xt(a,Xt(c,o));return Xt(i,l)},tn())}function dl(t,e,n){const i=_f(t,e,n),s=tn(),r=[];for(let a=0;a<3;a+=1)for(let o=0;o<3;o+=1)r.push(i.rotation[o][a]-s.rotation[o][a]);return r.push(...i.translation),r}function xf(t,e,n,i=1e-6){if(!Number.isFinite(i)||i<=0)throw new RangeError("Finite-difference step must be positive and finite.");gu(t,e,t.map(()=>0));const s=e.map((r,a)=>{const o=[...e],c=[...e];o[a]+=i,c[a]-=i;const l=dl(t,o,n),u=dl(t,c,n);return l.map((h,d)=>(h-u[d])/(2*i))});return Array.from({length:12},(r,a)=>s.map(o=>o[a]))}function gu(t,e,n){if(t.length===0||t.length!==e.length||t.length!==n.length)throw new RangeError("Sector and fold-angle arrays must have equal nonzero length.");if(t.some(i=>!Number.isFinite(i)||i<=0)||e.some(i=>!Number.isFinite(i))||n.some(i=>!Number.isFinite(i)))throw new RangeError("Sector and fold angles must be finite.")}function vf(t,e){const n=t.edges.filter(o=>o.kind==="hinge").map(o=>o.id).sort(),i=new Map(n.map((o,c)=>[o,c])),s=new Map(e?.hingeAngles.map(o=>[o.edgeId,o.angle])??[]),r=t.vertices.flatMap(o=>{const c=hu(t,o.id);return c.applicability==="applicable"?[{vertexId:o.id,extraction:c}]:[]});if(r.length===0||n.length===0)return{applicable:!1,vertexCount:r.length,hingeCount:n.length,jacobian:[],reason:"No all-hinge interior vertex network is available."};const a=[];for(const{extraction:o}of r){const c=o.rays.map(u=>s.get(u.edgeId)??0),l=xf(o.sectorAngles,c);for(const u of l){const h=Array.from({length:n.length},()=>0);o.rays.forEach((d,f)=>{const p=i.get(d.edgeId);p!==void 0&&(h[p]+=u[f])}),a.push(h)}}return{applicable:!0,vertexCount:r.length,hingeCount:n.length,jacobian:a,mobility:Br(a,n.length)}}function Mf(t,e,n=Ze.absoluteLength){if(e.length<2)return Sf("A rigid-fold path requires at least two samples.");const i=t.faces.map(p=>p.id);let s=!0,r=!0,a=0,o=!0,c=0,l=!1;for(const p of e){const _=new Set(t.edges.filter(A=>A.kind==="hinge").map(A=>A.id)),m=new Set;for(const A of p.hingeAngles){const w=t.edges.find(T=>T.id===A.edgeId),v=w?.hinge?.angleRange,S=w?.hinge?.assignment,y=S==="mountain"?A.angle<=0:S==="valley"?A.angle>=0:!1;(m.has(A.edgeId)||!_.has(A.edgeId)||!Number.isFinite(A.angle)||!v||A.angle<v[0]||A.angle>v[1]||!y)&&(o=!1),m.add(A.edgeId)}const g=new Map(p.facePoses.map(A=>[A.faceId,A.transform]));for(const A of i){const w=g.get(A);(!w||!Ys(w))&&(s=!1),w&&(c=Math.max(c,bf(w.rotation)))}for(const A of t.edges.filter(w=>w.kind==="hinge")){if(A.halfEdges.length!==2){r=!1;continue}const w=A.halfEdges.map(T=>t.halfEdges.find(M=>M.id===T)).filter(T=>T!==void 0);if(w.length!==2){r=!1;continue}const v=g.get(w[0].face),S=g.get(w[1].face);if(!v||!S){r=!1;continue}const y=[w[0].origin,yf(t,w[0])];for(const T of y){const M=t.vertices.find(C=>C.id===T);if(!M){r=!1;continue}const b=[M.position[0],M.position[1],0],P=et(Xe(ht(v,b),ht(S,b)));a=Math.max(a,P)}}}const u=e.map(p=>p.parameterValues.find(_=>_.parameterId==="deployment")?.value),h=u.every((p,_)=>_===0||p!==void 0&&u[_-1]!==void 0&&p>=u[_-1]),d=Ef(t),f=vf(t,e[e.length-1]);for(let p=1;p<e.length;p+=1)JSON.stringify(e[p-1].facePoses)!==JSON.stringify(e[p].facePoses)&&(l=!0);return{applicable:!0,rigid:s,hingesCompatible:r&&a<=n,monotone:h,hingeStateValid:o,matrixCompatible:s&&c<=n,nontrivialMotion:l,maximumMatrixResidual:c,hingeGraphAcyclic:d,matrixCertificate:!s||!r||a>n?"invalid":d?"tree-exact":"cycle-closed",networkMobilityApplicable:f.applicable,...f.mobility?{networkDegreesOfFreedom:f.mobility.dof}:{},sampleCount:e.length,maximumHingeResidual:a}}function yf(t,e){return t.halfEdges.find(n=>n.id===e.next)?.origin??""}function Sf(t){return{applicable:!1,rigid:!1,hingesCompatible:!1,monotone:!1,hingeStateValid:!1,matrixCompatible:!1,nontrivialMotion:!1,maximumMatrixResidual:Number.POSITIVE_INFINITY,hingeGraphAcyclic:!1,matrixCertificate:"invalid",networkMobilityApplicable:!1,sampleCount:0,maximumHingeResidual:Number.POSITIVE_INFINITY,reason:t}}function Ef(t){const e=new Map;for(const s of t.edges.filter(r=>r.kind==="hinge"&&r.halfEdges.length===2)){const r=s.halfEdges.map(a=>t.halfEdges.find(o=>o.id===a)?.face).filter(a=>a!==void 0);r.length===2&&(e.set(r[0],[...e.get(r[0])??[],r[1]]),e.set(r[1],[...e.get(r[1])??[],r[0]]))}const n=new Set,i=(s,r)=>{if(n.has(s))return!1;n.add(s);for(const a of e.get(s)??[])if(a!==r&&(n.has(a)||!i(a,s)))return!1;return!0};return[...e.keys()].every(s=>n.has(s)||i(s))}function bf(t){let e=0;for(let n=0;n<3;n+=1)for(let i=0;i<3;i+=1){let s=0;for(let r=0;r<3;r+=1)s+=t[r][n]*t[r][i];e=Math.max(e,Math.abs(s-(n===i?1:0)))}return e}function _u(t,e,n=1e-9,i=Number.POSITIVE_INFINITY){if(e.length<2)return Af("A configuration-space path requires at least two states.");const s=e.map(p=>p.parameterValues.find(_=>_.parameterId==="deployment")?.value),r=s.every(p=>p!==void 0&&Number.isFinite(p)),a=r&&s.every(p=>p>=-n&&p<=1+n),o=r&&s.every((p,_)=>_===0||p>=s[_-1]-n),c=r&&Math.abs(s[0]-0)<=n&&Math.abs(s[s.length-1]-1)<=n,l=r&&s.every((p,_)=>_===0||Math.abs(p-s[_-1])>n),u=r?Math.max(...s.slice(1).map((p,_)=>p-s[_])):Number.POSITIVE_INFINITY,h=!Number.isFinite(i)||u<=i+n,d=new Set(t.faces.map(p=>p.id)),f=e.every(p=>{const _=new Set(p.facePoses.map(m=>m.faceId));return _.size===d.size&&[...d].every(m=>_.has(m))});return{applicable:!0,ordered:o,coversEndpoints:c,uniqueParameters:l,withinDomain:a,maximumParameterStep:u,stepBounded:h,topologyStable:f,sampleCount:e.length}}function Af(t){return{applicable:!1,ordered:!1,coversEndpoints:!1,uniqueParameters:!1,withinDomain:!1,maximumParameterStep:Number.POSITIVE_INFINITY,stepBounded:!1,topologyStable:!1,sampleCount:0,reason:t}}function Tf(t,e,n=1e-8){const i=t.edges.filter(a=>a.kind==="hinge"||a.kind==="cutBank"||a.kind==="boundary").map(a=>a.id),s=t.edges.filter(a=>a.kind==="joined"||a.kind==="flatSeam").map(a=>a.id),r=new Set;for(const a of t.edges.filter(o=>o.kind==="joined"||o.kind==="flatSeam")){if(a.halfEdges.length!==2){r.add(a.id);continue}const o=a.halfEdges.map(c=>t.halfEdges.find(l=>l.id===c)?.face);if(!o[0]||!o[1]){r.add(a.id);continue}for(const c of e){const l=c.facePoses.find(h=>h.faceId===o[0])?.transform,u=c.facePoses.find(h=>h.faceId===o[1])?.transform;(!l||!u||wf(l,u)>n)&&r.add(a.id)}}return{controlled:r.size===0,declaredSingularEdgeIds:i,invalidSingularEdgeIds:[...r],smoothEdgeIds:s}}function wf(t,e){let n=Math.max(...t.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)n=Math.max(n,Math.abs(t.rotation[i][s]-e.rotation[i][s]));return n}function Rf(t,e,n=1e-8){if(e.length<2)return Cf("Isometric recovery requires flat and deployed samples.");const i=new Map(e[0].facePoses.map(u=>[u.faceId,u.transform])),s=new Map(e[e.length-1].facePoses.map(u=>[u.faceId,u.transform]));let r=0,a=!0,o=!0;for(const u of t.faces){const h=xu(t,u.boundary),d=i.get(u.id),f=s.get(u.id);if(!d||!f){a=!1,o=!1;continue}for(const[_,m]of h){const g=t.vertices.find(y=>y.id===_),A=t.vertices.find(y=>y.id===m);if(!g||!A){a=!1;continue}const w=[g.position[0],g.position[1],0],v=[A.position[0],A.position[1],0],S=et(Xe(v,w));for(const y of e){const T=y.facePoses.find(C=>C.faceId===u.id)?.transform;if(!T){a=!1;continue}const M=ht(T,w),b=ht(T,v),P=et(Xe(b,M));r=Math.max(r,Math.abs(S-P))}}const p=d.rotation.every((_,m)=>_.every((g,A)=>Math.abs(g-(m===A?1:0))<=n))&&Math.abs(d.translation[0])<=n&&Math.abs(d.translation[1])<=n&&Math.abs(d.translation[2])<=n;o=o&&p}a=a&&r<=n;const c=t.faces.filter(u=>Pf(t,u.boundary)<=n).map(u=>u.id),l=Tf(t,e,n);return{applicable:!0,piecewiseIsometric:a&&c.length===0&&l.controlled,recoversFlatPattern:o,maximumEdgeResidual:r,singularFaceIds:c,controlledSingularSet:l.controlled,invalidSingularEdgeIds:l.invalidSingularEdgeIds}}function xu(t,e){const n=[];let i=e;const s=new Set;for(;!s.has(i);){s.add(i);const r=t.halfEdges.find(o=>o.id===i);if(!r)break;const a=t.halfEdges.find(o=>o.id===r.next);if(!a)break;n.push([r.origin,a.origin]),i=r.next}return n}function Cf(t){return{applicable:!1,piecewiseIsometric:!1,recoversFlatPattern:!1,maximumEdgeResidual:Number.POSITIVE_INFINITY,singularFaceIds:[],controlledSingularSet:!1,invalidSingularEdgeIds:[],reason:t}}function Pf(t,e){const n=xu(t,e).map(([s])=>t.vertices.find(r=>r.id===s)?.position).filter(s=>s!==void 0);let i=0;for(let s=0;s<n.length;s+=1){const r=n[s],a=n[(s+1)%n.length];i+=r[0]*a[1]-a[0]*r[1]}return Math.abs(i)/2}function If(t,e,n,i=1e-6){if(!Number.isFinite(n)||n<=0||!Number.isFinite(i)||i<=0)return ul(n,i,"Lipschitz bound and epsilon must be positive and finite.");const s=new Set(t.faces.map(o=>o.id));for(const o of[0,.5,1]){const c=e(o),l=new Map(c.facePoses.map(u=>[u.faceId,u.transform]));if(l.size!==s.size||[...s].some(u=>!l.has(u))||[...l.values()].some(u=>!Ys(u)))return ul(n,i,"Analytic path witnesses do not preserve the complete rigid face set.")}const r=Math.max(1,Math.ceil(n/i)),a=n/r;return{certified:a<=i,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!0,uniformlyConvergent:!0,lipschitzBound:n,epsilon:i,requiredSubdivisionCount:r,certifiedUniformErrorBound:a}}function ul(t,e,n){return{certified:!1,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!1,uniformlyConvergent:!1,lipschitzBound:t,epsilon:e,requiredSubdivisionCount:0,certifiedUniformErrorBound:Number.POSITIVE_INFINITY,reason:n}}function Lf(t,e,n){const i=Ci(t).length===0,s=pu(t),r=t.faces.reduce((l,u)=>l+u.holes.length,0),a=t.faces.every(l=>l.holes.every(u=>t.halfEdges.some(h=>h.id===u&&h.face===l.id))),o=n.applicable&&n.rigid&&n.hingesCompatible&&n.matrixCompatible,c=i&&s.necessaryGatesSatisfied&&s.materialConnected&&a&&o&&e.certified&&e.continuous&&e.uniformlyConvergent;return{certified:c,proof:c?"analytic-global-map":"unsupported",topologyValid:i,necessaryGatesSatisfied:s.necessaryGatesSatisfied,materialConnected:s.materialConnected,holesTracked:a,holeBoundaryCount:r,hingeContinuous:o,analyticContinuous:e.continuous,...c?{}:{reason:"A global certificate requires valid connected topology, all Chapter 5–6 gates, continuous hinges, tracked holes, and an analytic convergent map."}}}function Df(t,e,n,i,s,r=1e-8){const a=_u(t,e),o=[],c=[];for(const d of t.edges.filter(f=>f.kind==="hinge"&&f.halfEdges.length===2)){const f=d.halfEdges.map(_=>t.halfEdges.find(m=>m.id===_)?.face);(e.some(_=>{const m=_.facePoses.find(A=>A.faceId===f[0])?.transform,g=_.facePoses.find(A=>A.faceId===f[1])?.transform;return!m||!g||Nf(m,g)>r})?o:c).push(d.id)}const u=a.applicable&&a.ordered&&a.coversEndpoints&&a.uniqueParameters&&a.withinDomain&&a.stepBounded&&a.topologyStable&&n.certified&&n.continuous&&n.uniformlyConvergent&&i.applicable&&i.rigid&&i.hingesCompatible&&i.matrixCompatible&&s.certified,h=u&&i.nontrivialMotion&&o.length>0;return{certified:u,proof:u?"analytic-configuration-path":"unsupported",selfFoldable:h,activeCreaseIds:o,optionalCreaseIds:c,path:a,...u?{}:{reason:"Configuration certification requires an ordered complete analytic path with rigid/global certificates."}}}function Nf(t,e){let n=Math.max(...t.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)n=Math.max(n,Math.abs(t.rotation[i][s]-e.rotation[i][s]));return n}function vc(t){if(!Number.isInteger(t.sampleCount)||t.sampleCount<2||t.sampleCount>1001)return{ok:!1,diagnostics:[xn("Path sample count must be an integer in [2, 1001].",t.input.operationId)]};const e=[...t.complex.edges].filter(_=>_.kind==="hinge"),n=[],i=8,s=(t.sampleCount-1)*i+1;for(let _=0;_<s;_+=1){const m=_/(s-1),g=hl(t.input,t.complex,t.sourceMap,m);if(!g)return{ok:!1,diagnostics:[xn("Stair hinge chain is missing or disconnected.",t.input.operationId)]};const A={id:`${t.input.operationId}:path:${_}`,facePoses:[...g.entries()].map(([v,S])=>({faceId:v,transform:S}))},w=cf(t.complex,A);if(w.length>0)return{ok:!1,diagnostics:[xn(`Stair deployment sample ${_} has non-adjacent face overlap: ${w.map(v=>`${v.firstFaceId}:${v.secondFaceId}`).join(", ")}.`,t.input.operationId,_,m)]};_%i===0&&n.push({parameter:m,transforms:g})}const r=pf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:folding-map:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!r.applicable||!r.rigid||!r.continuous)return{ok:!1,diagnostics:[xn(r.reason??"Stair folding map failed topology, rigidity, or continuity validation.",t.input.operationId)]};const a=Mf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:rigid:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!a.applicable||!a.rigid||!a.hingesCompatible||!a.monotone||!a.hingeStateValid||!a.matrixCompatible)return{ok:!1,diagnostics:[xn(a.reason??"Stair path failed rigid-foldability compatibility checks.",t.input.operationId)]};const o=_u(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:configuration:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),1e-9,1/(t.sampleCount-1));if(!o.applicable||!o.ordered||!o.coversEndpoints||!o.uniqueParameters||!o.withinDomain||!o.stepBounded||!o.topologyStable)return{ok:!1,diagnostics:[xn(o.reason??"Stair path failed configuration-space checks.",t.input.operationId)]};const c=Rf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:isometric:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!c.applicable||!c.piecewiseIsometric||!c.recoversFlatPattern)return{ok:!1,diagnostics:[xn(c.reason??"Stair path failed piecewise-isometric recovery checks.",t.input.operationId)]};const l=Math.hypot(t.input.width,t.input.stepCount*t.input.stepRun),u=Math.max(1,e.length*Math.PI/2*l),h=If(t.complex,_=>{const m=hl(t.input,t.complex,t.sourceMap,_);if(!m)throw new Error("Validated stair hinge chain became unavailable.");return{schemaVersion:1,id:`${t.input.operationId}:analytic:${_}`,parameterValues:[{parameterId:"deployment",value:_}],facePoses:[...m.entries()].map(([g,A])=>({faceId:g,transform:A})),hingeAngles:[]}},u);if(!h.certified)return{ok:!1,diagnostics:[xn(h.reason??"Stair path failed analytic folding-map certification.",t.input.operationId)]};const d=Lf(t.complex,h,a);if(!d.certified||d.proof!=="analytic-global-map")return{ok:!1,diagnostics:[xn(d.reason??"Stair path failed global folding-map certification.",t.input.operationId)]};const f=n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:configuration-certificate:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),p=Df(t.complex,f,h,a,d);return!p.certified||!p.selfFoldable||p.proof!=="analytic-configuration-path"?{ok:!1,diagnostics:[xn(p.reason??"Stair path failed configuration-space certification.",t.input.operationId)]}:{ok:!0,samples:n,evidence:{classification:"certifiedRigidPath",foldingMap:{continuous:r.continuous,rigid:r.rigid,sampleCount:r.sampleCount,maximumDisplacement:r.uniformDisplacementResidual},rigidFoldability:{rigid:a.rigid,hingesCompatible:a.hingesCompatible,monotone:a.monotone,maximumHingeResidual:a.maximumHingeResidual,matrixCompatible:a.matrixCompatible,nontrivialMotion:a.nontrivialMotion,maximumMatrixResidual:a.maximumMatrixResidual},configurationSpace:{ordered:o.ordered,coversEndpoints:o.coversEndpoints,uniqueParameters:o.uniqueParameters,withinDomain:o.withinDomain,maximumParameterStep:o.maximumParameterStep,stepBounded:o.stepBounded,topologyStable:o.topologyStable},isometricRecovery:{piecewiseIsometric:c.piecewiseIsometric,recoversFlatPattern:c.recoversFlatPattern,maximumEdgeResidual:c.maximumEdgeResidual,controlledSingularSet:c.controlledSingularSet,invalidSingularEdgeIds:c.invalidSingularEdgeIds},analyticFoldingMap:{proof:h.proof,continuous:h.continuous,uniformlyConvergent:h.uniformlyConvergent,lipschitzBound:h.lipschitzBound,requiredSubdivisionCount:h.requiredSubdivisionCount,certifiedUniformErrorBound:h.certifiedUniformErrorBound},globalFoldingMap:{proof:d.proof,topologyValid:d.topologyValid,necessaryGatesSatisfied:d.necessaryGatesSatisfied,materialConnected:d.materialConnected,holesTracked:d.holesTracked,hingeContinuous:d.hingeContinuous},configurationCertificate:{proof:p.proof,selfFoldable:p.selfFoldable,activeCreaseIds:p.activeCreaseIds,optionalCreaseIds:p.optionalCreaseIds},verification:{method:"adaptive-sampled",sampleCount:s,maxParameterStep:1/i,collisionCheck:"coplanar-positive-area"}}}}function hl(t,e,n,i){const s=new Map,r=new Map(e.vertices.map(d=>[d.id,d])),a=t.stepCount*2+2,o=a/2,c=r.get(`v:${o}:0`)?.position[1];if(c===void 0)return;const l=-1,u=bi([0,c,0],[t.hostWidth,0,0],l*-i*Math.PI/2);for(const d of n.faces.filter(f=>f.faceId.startsWith("host-face:"))){const f=/^host-face:(\d+):(\d+)$/.exec(d.faceId);if(!f)return;const p=Number(f[1]);s.set(d.faceId,p<o?tn():u)}let h=tn();for(let d=0;d<a;d+=1){if(s.set(`stair-face:${d}`,h),d>=a-1)continue;const f=e.edges.find(y=>y.id===`hinge:${d}`);if(!f||f.halfEdges.length!==2)return;const p=r.get(`v:${d+1}:1`)?.position,_=r.get(`v:${d+1}:2`)?.position;if(!p||!_)return;const m=[p[0],p[1],0],g=[_[0],_[1],0],A=ht(h,m),w=ht(h,g),v=[w[0]-A[0],w[1]-A[1],w[2]-A[2]],S=f.hinge?.assignment==="mountain"?-1:1;h=Xt(bi(A,v,l*S*i*Math.PI/2),h)}if(s.size===e.faces.length)return s}function xn(t,e,n,i){return{severity:"error",category:"path",code:n===void 0?"PATH_POPUP_SAMPLE_COUNT_INVALID":"PATH_COLLISION_DETECTED",message:t,locations:n===void 0?[{kind:"entity",entity:{kind:"spatialOperation",id:e}}]:[{kind:"sample",index:n,parameter:i},{kind:"entity",entity:{kind:"spatialOperation",id:e}}],entities:[{kind:"spatialOperation",id:e}]}}const Ff=1,Uf="hinge-flat",Of="Flat canonical hinge",kf="boundary",Bf="single-hinge",Vf="meter-radian",zf=["Ideal zero-thickness rigid faces"],Hf="docs/single-hinge-specification.md",Gf=1e-12,$f="singleHinge",Wf={assignment:"valley",angle:0},Xf={ok:!0,childPoint:[2,0,0],classification:"certifiedRigidPath"},qf={schemaVersion:Ff,id:Uf,title:Of,fixtureClass:kf,mechanismFamily:Bf,units:Vf,assumptions:zf,provenance:Hf,tolerance:Gf,kind:$f,input:Wf,expected:Xf},Yf=1,Kf="hinge-intermediate",Zf="Intermediate canonical hinge",Jf="valid",jf="single-hinge",Qf="meter-radian",ep=["Ideal zero-thickness rigid faces"],tp="docs/single-hinge-specification.md",np=1e-12,ip="singleHinge",sp={assignment:"valley",angle:1.0471975511965976},rp={ok:!0,childPoint:[1.5,0,-.8660254037844386],classification:"certifiedRigidPath"},ap={schemaVersion:Yf,id:Kf,title:Zf,fixtureClass:Jf,mechanismFamily:jf,units:Qf,assumptions:ep,provenance:tp,tolerance:np,kind:ip,input:sp,expected:rp},op=1,cp="hinge-folded",lp="Quarter-turn canonical hinge",dp="valid",up="single-hinge",hp="meter-radian",fp=["Ideal zero-thickness rigid faces"],pp="docs/single-hinge-specification.md",mp=1e-12,gp="singleHinge",_p={assignment:"valley",angle:1.5707963267948966},xp={ok:!0,childPoint:[1,0,-1],classification:"certifiedRigidPath"},vp={schemaVersion:op,id:cp,title:lp,fixtureClass:dp,mechanismFamily:up,units:hp,assumptions:fp,provenance:pp,tolerance:mp,kind:gp,input:_p,expected:xp},Mp=1,yp="hinge-assignment-invalid",Sp="Valley hinge rejects a negative angle",Ep="invalid",bp="single-hinge",Ap="meter-radian",Tp=["Positive angles are valley folds"],wp="docs/single-hinge-specification.md",Rp=1e-12,Cp="singleHinge",Pp={assignment:"valley",angle:-.5},Ip={ok:!1,diagnosticCodes:["KINEMATICS_ANGLE_OUT_OF_RANGE","KINEMATICS_ASSIGNMENT_MISMATCH"]},Lp={schemaVersion:Mp,id:yp,title:Sp,fixtureClass:Ep,mechanismFamily:bp,units:Ap,assumptions:Tp,provenance:wp,tolerance:Rp,kind:Cp,input:Pp,expected:Ip},Dp=1,Np="vertex-valid-3m1v",Fp="Four-crease vertex satisfying Kawasaki and Maekawa",Up="valid",Op="single-vertex",kp="meter-radian",Bp=["Interior crease-only vertex"],Vp="docs/mathematical-contract.md#37-local-flat-foldability",zp=1e-12,Hp="singleVertex",Gp={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","mountain","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},$p={kawasaki:"satisfied",maekawa:"satisfied",locallyFlatFoldable:!0},Wp={schemaVersion:Dp,id:Np,title:Fp,fixtureClass:Up,mechanismFamily:Op,units:kp,assumptions:Bp,provenance:Vp,tolerance:zp,kind:Hp,input:Gp,expected:$p},Xp=1,qp="vertex-invalid-2m2v",Yp="Four-crease vertex failing Maekawa",Kp="invalid",Zp="single-vertex",Jp="meter-radian",jp=["Interior crease-only vertex"],Qp="docs/mathematical-contract.md#37-local-flat-foldability",em=1e-12,tm="singleVertex",nm={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","valley","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},im={kawasaki:"satisfied",maekawa:"failed",locallyFlatFoldable:!1},sm={schemaVersion:Xp,id:qp,title:Yp,fixtureClass:Kp,mechanismFamily:Zp,units:Jp,assumptions:jp,provenance:Qp,tolerance:em,kind:tm,input:nm,expected:im},rm=1,am="popup-symmetric",om="Symmetric axis-aligned two-plane pop-up",cm="valid",lm="two-plane-pop-up",dm="meter-radian",um=["Ideal zero-thickness rigid linkage"],hm="docs/mathematical-contract.md#4-two-plane-pop-up-family",fm=1e-10,pm="twoPlanePopUp",mm={id:"popup-symmetric",width:2,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},gm={ok:!0,deployedJunction:[0,1,1],axisAligned:!0,classification:"certifiedRigidPath"},_m={schemaVersion:rm,id:am,title:om,fixtureClass:cm,mechanismFamily:lm,units:dm,assumptions:um,provenance:hm,tolerance:fm,kind:pm,input:mm,expected:gm},xm=1,vm="popup-unequal",Mm="Unequal-link rotated two-plane pop-up",ym="valid",Sm="two-plane-pop-up",Em="meter-radian",bm=["Unequal links may rotate the child frame"],Am="docs/mathematical-contract.md#4-two-plane-pop-up-family",Tm=1e-10,wm="twoPlanePopUp",Rm={id:"popup-unequal",width:2,height:1,depth:2,deployedAngle:1.5707963267948966,sampleCount:7},Cm={ok:!0,deployedJunction:[0,.8,1.6],axisAligned:!1,classification:"certifiedRigidPath"},Pm={schemaVersion:xm,id:vm,title:Mm,fixtureClass:ym,mechanismFamily:Sm,units:Em,assumptions:bm,provenance:Am,tolerance:Tm,kind:wm,input:Rm,expected:Cm},Im=1,Lm="popup-invalid-width",Dm="Two-plane pop-up rejects zero width",Nm="invalid",Fm="two-plane-pop-up",Um="meter-radian",Om=["Mechanism dimensions must be positive"],km="docs/mathematical-contract.md#4-two-plane-pop-up-family",Bm=1e-10,Vm="twoPlanePopUp",zm={id:"popup-invalid-width",width:0,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},Hm={ok:!1,diagnosticCodes:["MECHANISM_POPUP_INVALID_PARAMETER"]},Gm={schemaVersion:Im,id:Lm,title:Dm,fixtureClass:Nm,mechanismFamily:Fm,units:Um,assumptions:Om,provenance:km,tolerance:Bm,kind:Vm,input:zm,expected:Hm},$m=1,Wm="spatial-root",Xm="One root plane pair",qm="valid",Ym="nested-parallel-strip",Km="meter-radian",Zm=["Two-level synchronized strip family"],Jm="docs/mathematical-contract.md#5-composition-contract",jm=1e-10,Qm="spatialProgram",eg={schemaVersion:1,id:"spatial-root",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},tg={ok:!0,classification:"certifiedRigidPath"},ng={schemaVersion:$m,id:Wm,title:Xm,fixtureClass:qm,mechanismFamily:Ym,units:Km,assumptions:Zm,provenance:Jm,tolerance:jm,kind:Qm,input:eg,expected:tg},ig=1,sg="spatial-nested-shelf",rg="Root plane pair with nested shelf",ag="valid",og="nested-parallel-strip",cg="meter-radian",lg=["Two-level synchronized strip family"],dg="docs/mathematical-contract.md#5-composition-contract",ug=1e-10,hg="spatialProgram",fg={schemaVersion:1,id:"spatial-nested-shelf",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:3,height:1.5,depth:1.5,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"shelf",kind:"shelf",target:{kind:"generatedPair",operationId:"root"},xOffset:.5,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},pg={ok:!0,classification:"certifiedRigidPath"},mg={schemaVersion:ig,id:sg,title:rg,fixtureClass:ag,mechanismFamily:og,units:cg,assumptions:lg,provenance:dg,tolerance:ug,kind:hg,input:fg,expected:pg},gg=1,_g="spatial-siblings",xg="Disjoint sibling plane pairs",vg="valid",Mg="nested-parallel-strip",yg="meter-radian",Sg=["Sibling strip interiors are disjoint"],Eg="docs/mathematical-contract.md#5-composition-contract",bg=1e-10,Ag="spatialProgram",Tg={schemaVersion:1,id:"spatial-siblings",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"left",kind:"wall",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"right",kind:"platform",target:{kind:"sheet"},xOffset:4,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},wg={ok:!0,classification:"certifiedRigidPath"},Rg={schemaVersion:gg,id:_g,title:xg,fixtureClass:vg,mechanismFamily:Mg,units:yg,assumptions:Sg,provenance:Eg,tolerance:bg,kind:Ag,input:Tg,expected:wg},Cg=1,Pg="spatial-overlap",Ig="Overlapping siblings are rejected",Lg="invalid",Dg="nested-parallel-strip",Ng="meter-radian",Fg=["Sibling strip interiors must be disjoint"],Ug="docs/mathematical-contract.md#5-composition-contract",Og=1e-10,kg="spatialProgram",Bg={schemaVersion:1,id:"spatial-overlap",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"a",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"b",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Vg={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OVERLAP"]},zg={schemaVersion:Cg,id:Pg,title:Ig,fixtureClass:Lg,mechanismFamily:Dg,units:Ng,assumptions:Fg,provenance:Ug,tolerance:Og,kind:kg,input:Bg,expected:Vg},Hg=1,Gg="spatial-depth-three",$g="Depth-three hierarchy is rejected",Wg="unsupported",Xg="nested-parallel-strip",qg="meter-radian",Yg=["Only root and child module levels are supported"],Kg="docs/mathematical-contract.md#5-composition-contract",Zg=1e-10,Jg="spatialProgram",jg={schemaVersion:1,id:"spatial-depth-three",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:3,height:2,depth:2,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"child",kind:"planePair",target:{kind:"generatedPair",operationId:"root"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"grandchild",kind:"planePair",target:{kind:"generatedPair",operationId:"child"},xOffset:0,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},Qg={ok:!1,diagnosticCodes:["SPATIAL_TARGET_DEPTH_UNSUPPORTED"]},e_={schemaVersion:Hg,id:Gg,title:$g,fixtureClass:Wg,mechanismFamily:Xg,units:qg,assumptions:Yg,provenance:Kg,tolerance:Zg,kind:Jg,input:jg,expected:Qg},t_=1,n_="spatial-opening",i_="Opening is explicitly unsupported",s_="unsupported",r_="bounded-spatial-compiler",a_="meter-radian",o_=["Subtractive topology is not certified"],c_="docs/mathematical-contract.md#51-bounded-spatial-compilation",l_=1e-10,d_="spatialProgram",u_={schemaVersion:1,id:"spatial-opening",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"door",kind:"opening",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},h_={ok:!1,diagnosticCodes:["SPATIAL_OPERATION_UNSUPPORTED"]},f_={schemaVersion:t_,id:n_,title:i_,fixtureClass:s_,mechanismFamily:r_,units:a_,assumptions:o_,provenance:c_,tolerance:l_,kind:d_,input:u_,expected:h_},p_=1,m_="spatial-out-of-bounds",g_="Attachment outside the sheet is rejected",__="invalid",x_="nested-parallel-strip",v_="meter-radian",M_=["Attachments must fit their host material"],y_="docs/mathematical-contract.md#5-composition-contract",S_=1e-10,E_="spatialProgram",b_={schemaVersion:1,id:"spatial-out-of-bounds",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"outside",kind:"planePair",target:{kind:"sheet"},xOffset:5,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},A_={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS"]},T_={schemaVersion:p_,id:m_,title:g_,fixtureClass:__,mechanismFamily:x_,units:v_,assumptions:M_,provenance:y_,tolerance:S_,kind:E_,input:b_,expected:A_};function Mc(t){const e=t==="valley"?[0,Math.PI]:[-Math.PI,0];return{schemaVersion:1,vertices:[{id:"v0",position:[0,0]},{id:"v1",position:[1,0]},{id:"v2",position:[2,0]},{id:"v3",position:[2,1]},{id:"v4",position:[1,1]},{id:"v5",position:[0,1]}],halfEdges:[{id:"hl0",origin:"v0",next:"hl1",edge:"e0",face:"left"},{id:"hl1",origin:"v1",next:"hl2",twin:"hr3",edge:"hinge",face:"left"},{id:"hl2",origin:"v4",next:"hl3",edge:"e1",face:"left"},{id:"hl3",origin:"v5",next:"hl0",edge:"e2",face:"left"},{id:"hr0",origin:"v1",next:"hr1",edge:"e3",face:"right"},{id:"hr1",origin:"v2",next:"hr2",edge:"e4",face:"right"},{id:"hr2",origin:"v3",next:"hr3",edge:"e5",face:"right"},{id:"hr3",origin:"v4",next:"hr0",twin:"hl1",edge:"hinge",face:"right"}],edges:[{id:"e0",halfEdges:["hl0"],kind:"boundary"},{id:"e1",halfEdges:["hl2"],kind:"boundary"},{id:"e2",halfEdges:["hl3"],kind:"boundary"},{id:"e3",halfEdges:["hr0"],kind:"boundary"},{id:"e4",halfEdges:["hr1"],kind:"boundary"},{id:"e5",halfEdges:["hr2"],kind:"boundary"},{id:"hinge",halfEdges:["hl1","hr3"],kind:"hinge",hinge:{assignment:t,restAngle:0,angleRange:e}}],faces:[{id:"left",boundary:"hl0",holes:[]},{id:"right",boundary:"hr0",holes:[]}],cutPairs:[],materialComponents:[{id:"sheet",faces:["left","right"]}]}}function vu(t){return yc(t?.id)&&Mu(t?.material)&&Ai(t?.panelThickness)&&R_(t?.crease)&&C_(t?.contact)?[]:[yu("MECHANICS_PROFILE_INVALID","Mechanics profiles require valid SI material, thickness, crease, and contact parameters.",t?.id??"unknown")]}function w_(t){return yc(t?.id)&&ti(t?.kerf)&&ti(t?.lengthTolerance)&&ti(t?.angleTolerance)&&t.angleTolerance<Math.PI&&Ai(t?.minimumFeatureWidth)&&Ai(t?.minimumBridgeWidth)&&ti(t?.nominalCreaseWidth)?[]:[yu("FABRICATION_PROFILE_INVALID","Fabrication profiles require finite non-negative tolerances and positive feature and bridge widths.",t?.id??"unknown")]}function Mu(t){return yc(t?.id)&&Ai(t?.density)&&Ai(t?.youngModulus)&&Number.isFinite(t?.poissonRatio)&&t.poissonRatio>-1&&t.poissonRatio<.5}function R_(t){return t?.model==="concentratedHinge"?ti(t.rotationalStiffness):t?.model==="compliantStrip"&&Ai(t.width)&&Ai(t.thickness)&&Mu(t.material)}function C_(t){return["disabled","frictionless","coulomb"].includes(t?.mode)&&ti(t?.clearance)&&ti(t?.collisionMargin)&&ti(t?.frictionCoefficient)&&Number.isFinite(t?.restitution)&&t.restitution>=0&&t.restitution<=1&&(t.mode==="coulomb"||t.frictionCoefficient===0)}function Ai(t){return Number.isFinite(t)&&t>0}function ti(t){return Number.isFinite(t)&&t>=0}function yc(t){return typeof t=="string"&&t.length>0}function yu(t,e,n){return{severity:"error",category:"mechanics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"physicalProfile",id:n}}],entities:[{kind:"physicalProfile",id:n}]}}function Bs(t,e){const n=ho(t,e.halfEdges[0]),i=ho(t,n.next);return[n.origin,i.origin]}function Sc(t,e){const n=[],i=new Set;let s=e.boundary;for(;!i.has(s);){i.add(s);const r=ho(t,s);n.push(r.origin),s=r.next}if(s!==e.boundary)throw new Error(`Face ${e.id} boundary is not a closed loop.`);return n}function ho(t,e){const n=t.halfEdges.find(i=>i.id===e);if(!n)throw new Error(`Missing half-edge ${e}.`);return n}function Su(t,e){const n=new Map(t.vertices.map((s,r)=>[s.id,r])),i=new Map([]);return{file_spec:1.2,file_creator:"Kirigami Spatial Engine",file_classes:["singleModel"],frame_classes:["creasePattern"],file_units:"m",vertices_coords:t.vertices.map(s=>s.position),edges_vertices:t.edges.map(s=>{const[r,a]=Bs(t,s),o=n.get(r),c=n.get(a);if(o===void 0||c===void 0)throw new Error(`Edge ${s.id} references a missing vertex.`);return[o,c]}),edges_assignment:t.edges.map(P_),edges_foldAngle:t.edges.map(s=>s.kind==="flatSeam"||s.kind==="joined"?0:s.kind!=="hinge"?null:(i.get(s.id)??s.hinge?.restAngle??0)*180/Math.PI),faces_vertices:t.faces.map(s=>Sc(t,s).map(r=>{const a=n.get(r);if(a===void 0)throw new Error(`Face ${s.id} references a missing vertex.`);return a}))}}function P_(t){switch(t.kind){case"boundary":return"B";case"cutBank":return"C";case"hinge":return I_(t.hinge?.assignment??"unassigned");case"joined":case"flatSeam":return"F"}}function I_(t){return t==="mountain"?"M":t==="valley"?"V":"U"}function L_(t,e){return!Number.isFinite(e?.foldPercent)||e.foldPercent<-1||e.foldPercent>1||!D_(e.axialStiffness)||!fl(e.faceStiffness)||!fl(e.creaseStiffness)||typeof e.calculateFaceStrain!="boolean"?N_(t.definition.id,"OrigamiSimulator controls require foldPercent in [-1, 1], positive axial stiffness, and non-negative face and crease stiffness."):{ok:!0,job:{schemaVersion:1,id:`origami-simulator-job:${t.definition.id}`,subjectId:t.definition.id,backend:"origamiSimulator",capabilities:["foldPreview","approximateStrain"],fold:Su(t.complex),controls:{...e}}}}function D_(t){return Number.isFinite(t)&&t>0}function fl(t){return Number.isFinite(t)&&t>=0}function N_(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"mechanics",code:"SIMULATION_JOB_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function F_(t,e,n,i){const s=vu(e);if(s.length>0)return{ok:!1,diagnostics:s};if(!U_(n))return pl(t.definition.id,"PyKirigami options require finite bounded timestep, damping, stiffness, ERP, substeps, and maximum steps.");const r=t.complex.edges.find(h=>h.kind==="hinge"&&h.hinge?.assignment==="unassigned");if(r)return pl(t.definition.id,`PyKirigami finite-thickness hinge ${r.id} requires a mountain or valley side.`);const a=new Map(t.complex.vertices.map(h=>[h.id,h.position])),o=t.complex.faces.map(h=>Sc(t.complex,h)),c=new Map(t.complex.faces.map((h,d)=>[h.id,d])),l=new Map(t.complex.halfEdges.map(h=>[h.id,h])),u=[];for(const h of t.complex.edges){if(h.halfEdges.length!==2||!["hinge","joined","flatSeam"].includes(h.kind))continue;const d=l.get(h.halfEdges[0]),f=l.get(h.halfEdges[1]),p=c.get(d.face),_=c.get(f.face),m=h.kind==="hinge"?h.hinge.assignment==="mountain"?1:2:3,g=[...Bs(t.complex,h)].sort();for(const A of g)u.push({firstTile:p,firstVertex:o[p].indexOf(A),secondTile:_,secondVertex:o[_].indexOf(A),connectionFace:m,sourceEdgeId:h.id,sourceEdgeKind:h.kind})}return{ok:!0,job:{schemaVersion:1,id:`pykirigami-job:${t.definition.id}`,subjectId:t.definition.id,backend:"pykirigami",capabilities:["rigidTileDynamics","finiteThicknessCollision"],tiles:t.complex.faces.map((h,d)=>({id:h.id,vertices:o[d].map(f=>{const[p,_]=a.get(f);return[p,_,0]})})),constraints:u,brickThickness:e.panelThickness,contact:e.contact,options:{...n}}}}function U_(t){return O_(t?.timestep)&&Number.isInteger(t?.substeps)&&t.substeps>=1&&t.substeps<=1e3&&Number.isFinite(t?.errorReductionParameter)&&t.errorReductionParameter>=0&&t.errorReductionParameter<=1&&Number.isFinite(t?.gravity)&&Fi(t?.linearDamping)&&Fi(t?.angularDamping)&&Fi(t?.springStiffness)&&Fi(t?.torqueStiffness)&&Fi(t?.forceDamping)&&Fi(t?.torqueDamping)&&typeof t?.filterConnectedCollisions=="boolean"&&Number.isInteger(t?.maximumSteps)&&t.maximumSteps>=1&&t.maximumSteps<=1e6}function O_(t){return Number.isFinite(t)&&t>0}function Fi(t){return Number.isFinite(t)&&t>=0}function pl(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"mechanics",code:"SIMULATION_JOB_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function k_(t){const e=t.vertices.map(l=>l.position[0]),n=t.vertices.map(l=>l.position[1]),i=Math.min(...e),s=Math.min(...n),r=Math.max(...e)-i,a=Math.max(...n)-s,o=new Map(t.vertices.map(l=>[l.id,l.position])),c=t.edges.map(l=>{const[u,h]=Bs(t,l),d=o.get(u),f=o.get(h);if(!d||!f)throw new Error(`Edge ${l.id} is missing vertices.`);return[`  <line data-edge-id="${V_(l.id)}"`,`data-edge-kind="${l.kind}"`,`class="${B_(l)}"`,`x1="${Wn(d[0])}" y1="${Wn(d[1])}"`,`x2="${Wn(f[0])}" y2="${Wn(f[1])}" />`].join(" ")});return[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${Wn(i)} ${Wn(s)} ${Wn(r)} ${Wn(a)}">`,"  <style>.boundary{stroke:#111}.cut{stroke:#e11}.fold{stroke-dasharray:.04 .025}.mountain{stroke:#d33}.valley{stroke:#36c}.flat{stroke:#777}line{fill:none;stroke-width:.008;vector-effect:non-scaling-stroke}</style>",...c,"</svg>"].join(`
`)}function B_(t){return t.kind==="boundary"?"boundary":t.kind==="cutBank"?"cut":t.kind==="hinge"?`fold ${t.hinge?.assignment??"unassigned"}`:"flat"}function Wn(t){return Object.is(t,-0)?"0":String(t)}function V_(t){return t.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function z_(t,e,n){const i=[...vu(e),...w_(n)];if(i.length>0)return{ok:!1,diagnostics:i};const s=new Map(t.complex.vertices.map((r,a)=>[r.id,a]));return{ok:!0,job:{schemaVersion:1,id:`swomps-job:${t.definition.id}`,subjectId:t.definition.id,backend:"swomps",capabilities:["barAndHingeMechanics","panelContact","compliantCrease"],nodes:t.complex.vertices.map((r,a)=>({id:r.id,index:a,position:[r.position[0],r.position[1],0]})),panels:t.complex.faces.map(r=>({id:r.id,nodeIndices:Sc(t.complex,r).map(a=>s.get(a))})),hinges:t.complex.edges.filter(r=>r.kind==="hinge").map(r=>{const[a,o]=Bs(t.complex,r);return{id:r.id,nodeIndices:[s.get(a),s.get(o)],assignment:r.hinge.assignment}}),cutBanks:t.complex.edges.filter(r=>r.kind==="cutBank").map(r=>{const[a,o]=Bs(t.complex,r);return{id:r.id,cutPairId:r.cutBank.pair,bank:r.cutBank.bank,nodeIndices:[s.get(a),s.get(o)]}}),mechanics:e,fabrication:n}}}function Us(t){if(t.locations.length===0)throw new RangeError("A diagnostic requires at least one location.");if(t.locations.filter(s=>s.kind==="nonSpatial").length>0&&t.locations.length!==1)throw new RangeError("A non-spatial location must be exclusive.");for(const s of t.locations)H_(s);const n=t.locations.map(G_),i=n.flatMap(s=>s.kind==="entity"?[s.entity]:[]);return{severity:t.severity,category:t.category,code:t.code,message:t.message,locations:n,entities:i,...t.suggestion===void 0?{}:{suggestion:t.suggestion}}}function H_(t){if(t.kind==="entity"){if(t.entity.kind.length===0||t.entity.id.length===0)throw new RangeError("A diagnostic entity location requires kind and ID.");return}if(t.kind==="parameter"){if(t.path.length===0||t.path.some(e=>typeof e=="string"&&e.length===0||typeof e=="number"&&(!Number.isInteger(e)||e<0)))throw new RangeError("A diagnostic parameter path must be non-empty.");return}if(t.kind==="sample"){if(!Number.isInteger(t.index)||t.index<0)throw new RangeError("A diagnostic sample index must be non-negative.");if(t.parameter!==void 0&&!Number.isFinite(t.parameter))throw new RangeError("A diagnostic sample parameter must be finite.");return}if(t.reason.trim().length===0)throw new RangeError("A non-spatial diagnostic requires a reason.")}function G_(t){return t.kind==="entity"?{kind:"entity",entity:{...t.entity}}:t.kind==="parameter"?{kind:"parameter",path:[...t.path]}:t.kind==="sample"?{kind:"sample",index:t.index,...t.parameter===void 0?{}:{parameter:t.parameter}}:{kind:"nonSpatial",reason:t.reason}}function Eu(t){const e=Ci(t.complex);if(e.length>0)return{ok:!1,diagnostics:e};if(!Ys(t.parentPose,Ze.relativeRank))return Ui("KINEMATICS_PARENT_POSE_INVALID","The parent pose must be a finite proper rigid transform.","face",t.parentFaceId);const n=t.complex.edges.find(p=>p.id===t.hingeEdgeId);if(!n||n.kind!=="hinge"||!n.hinge||n.halfEdges.length!==2||t.complex.faces.length!==2)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The analytic family requires exactly two faces joined by the selected hinge.","edge",t.hingeEdgeId);const i=n.halfEdges.map(p=>t.complex.halfEdges.find(_=>_.id===p)).filter(p=>p!==void 0),s=i.find(p=>p.face===t.parentFaceId);if(!s)return Ui("KINEMATICS_PARENT_NOT_INCIDENT","The selected parent face must be incident to the hinge.","face",t.parentFaceId);const r=i.find(p=>p.id!==s.id);if(!r)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The selected hinge does not have a child side.","edge",n.id);const a=W_(n,t.angle);if(a.length>0)return{ok:!1,diagnostics:a};const o=ml(t.complex,s.origin),c=t.complex.halfEdges.find(p=>p.id===s.next);if(!c)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The parent hinge half-edge has no valid destination.","halfEdge",s.id);const l=ml(t.complex,c.origin),u=Xe(l,o),h=et(u),d=ua(h,Ze);if(h<=d)return Ui("KINEMATICS_DEGENERATE_HINGE","The hinge axis must have nonzero length.","edge",n.id);const f=Xt(t.parentPose,bi(o,u,t.angle));return{ok:!0,childFaceId:r.face,certificate:$_(t,n,r.face),state:{schemaVersion:1,id:t.stateId,parameterValues:[{parameterId:t.hingeEdgeId,value:t.angle}],facePoses:[{faceId:t.parentFaceId,transform:t.parentPose},{faceId:r.face,transform:f}],hingeAngles:[{edgeId:t.hingeEdgeId,angle:t.angle}]}}}function $_(t,e,n){return{id:`single-hinge-certificate:${t.stateId}`,subjectId:t.stateId,classification:"certifiedRigidPath",theoremIds:["single-hinge-axis-angle-path"],assumptions:[{id:"ideal-zero-thickness",statement:"Faces are perfectly rigid and the hinge has zero width and thickness."},{id:"intentional-flat-contact",statement:"Coincident layers at a flat-folded endpoint are permitted."}],constraints:[{id:"canonical-topology",status:"satisfied",method:"exact"},{id:"rigid-face-isometry",status:"satisfied",method:"exact"},{id:"hinge-axis-coincidence",status:"satisfied",method:"exact"},{id:"angle-admissibility",status:"satisfied",method:"exact"},{id:"one-dof-analytic-path",status:"satisfied",method:"exact",details:`Angle path from 0 to ${t.angle} radians about edge ${e.id}; child face ${n}.`}],unsupportedConditions:[],provenance:[{source:"docs/single-hinge-specification.md",locator:"Certificate Scope",claimId:"single-hinge-axis-angle-path"}]}}function W_(t,e){if(!t.hinge)return[];const n=[],[i,s]=t.hinge.angleRange,r=Ze.absoluteAngle;return(!Number.isFinite(e)||e<i-r||e>s+r)&&n.push(fo("KINEMATICS_ANGLE_OUT_OF_RANGE","Requested fold angle lies outside the declared hinge interval.","edge",t.id)),(t.hinge.assignment==="valley"&&e<-r||t.hinge.assignment==="mountain"&&e>r)&&n.push(fo("KINEMATICS_ASSIGNMENT_MISMATCH","Requested fold-angle sign conflicts with the mountain/valley assignment.","edge",t.id)),n}function ml(t,e){const n=t.vertices.find(i=>i.id===e);if(!n)throw new Error(`Validated topology is missing vertex ${e}.`);return[n.position[0],n.position[1],0]}function Ui(t,e,n,i){return{ok:!1,diagnostics:[fo(t,e,n,i)]}}function fo(t,e,n,i){return{severity:"error",category:"kinematics",code:t,message:e,locations:t==="KINEMATICS_ANGLE_OUT_OF_RANGE"||t==="KINEMATICS_ASSIGNMENT_MISMATCH"?[{kind:"entity",entity:{kind:n,id:i}},{kind:"parameter",path:["input","angle"]}]:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}]}}function bu(t,e,n){return new Map(t.sourceMap.faces.map(({faceId:i,owner:s})=>[i,xc(gl(e,s),gl(n,s))]))}function gl(t,e){if(e.kind==="module"){const i=t.nodes.find(s=>s.nodeId===e.nodeId);if(!i)throw new RangeError(`Missing engine state for ${e.nodeId}.`);return e.role==="childFloor"?i.worldState.frames.childFloor:i.worldState.frames.childWall}const n=[...t.nodes].filter(i=>i.depth===1).sort((i,s)=>i.nodeId.localeCompare(s.nodeId))[0];if(!n)throw new RangeError("Compiled sheet has no root engine state.");return e.role==="floor"?n.worldState.frames.parentFloor:n.worldState.frames.parentWall}function X_(t){const e=bu(t.assembly,t.flat,t.state),n=Math.max(t.assembly.definition.sheet.width,t.assembly.definition.sheet.wallExtent,t.assembly.definition.sheet.floorExtent),i=ua(n),s=i*Math.max(n,1),r=t.assembly.complex.edges.filter(p=>(p.kind==="hinge"||p.kind==="joined")&&p.halfEdges.length===2).map(p=>({edge:p,residual:q_(t.assembly.complex,p,e)})),a=Math.max(...r.map(({residual:p})=>p),0),o=t.assembly.definition.sheet.width*(t.assembly.definition.sheet.wallExtent+t.assembly.definition.sheet.floorExtent),c=t.assembly.complex.faces.reduce((p,_)=>p+Y_(t.assembly.complex,_),0),l=Math.abs(c-o),u=t.assembly.complex.materialComponents.length,h=t.state.nodes.filter(p=>t.profileByNodeId.get(p.nodeId)==="axisAligned"&&(!p.worldState.axisAligned||p.worldState.alignmentResidual>Ze.absoluteAngle)),d=Math.max(...t.state.nodes.filter(p=>t.profileByNodeId.get(p.nodeId)==="axisAligned").map(p=>p.worldState.alignmentResidual),0),f=[];for(const{edge:p,residual:_}of r)_<=i||f.push(Us({severity:"error",category:"kinematics",code:"COMPILED_HINGE_COHESION_INVALID",message:`Compiled hinge ${p.id} separates by ${_}.`,locations:[{kind:"entity",entity:{kind:"topologicalEdge",id:p.id}}],suggestion:"Compile source ownership and face motion from the same moving-hinge contract."}));(u!==1||l>s)&&f.push(Us({severity:"error",category:"topology",code:"COMPILED_SOURCE_MATERIAL_INVALID",message:"Compiled module material is disconnected or does not conserve the source-sheet area.",locations:[{kind:"entity",entity:{kind:"sheet",id:t.assembly.definition.sheet.id}}],suggestion:"Partition one connected source sheet without duplicated or missing face area."}));for(const p of h)f.push(Us({severity:"error",category:"kinematics",code:"COMPILED_PROFILE_INVALID",message:`Node ${p.nodeId} does not satisfy its axis-aligned rectangular profile.`,locations:[{kind:"entity",entity:{kind:"popUpNode",id:p.nodeId}}],suggestion:"Use a parallelogram linkage or explicitly request allowRotated."}));return{hingeResidual:a,sourceAreaResidual:l,materialComponentCount:u,profileResidual:d,diagnostics:f}}function q_(t,e,n){const i=new Map(t.halfEdges.map(c=>[c.id,c])),s=new Map(t.vertices.map(c=>[c.id,c.position])),r=e.halfEdges.map(c=>{const l=i.get(c),u=i.get(l.next),h=n.get(l.face);return[_l(s.get(l.origin),h),_l(s.get(u.origin),h)]}),a=Math.max(et(Xe(r[0][0],r[1][0])),et(Xe(r[0][1],r[1][1]))),o=Math.max(et(Xe(r[0][0],r[1][1])),et(Xe(r[0][1],r[1][0])));return Math.min(a,o)}function _l(t,e){return ht(e,[t[0],t[1],0])}function Y_(t,e){const n=new Map(t.halfEdges.map(r=>[r.id,r])),i=new Map(t.vertices.map(r=>[r.id,r.position])),s=r=>{const a=[];let o=r;do{const c=n.get(o);a.push(i.get(c.origin)),o=c.next}while(o!==r);return Math.abs(a.reduce((c,l,u)=>{const h=a[(u+1)%a.length];return c+l[0]*h[1]-h[0]*l[1]},0)/2)};return s(e.boundary)-e.holes.reduce((r,a)=>r+s(a),0)}function K_(t){return t.reduce((e,n)=>Xt(e,n),tn())}function Z_(t,e=Math.max(Ze.absoluteLength,Ze.absoluteAngle)){const n=K_(t),i=tn();let s=0;for(let o=0;o<3;o+=1)for(let c=0;c<3;c+=1)s=Math.max(s,Math.abs(n.rotation[o][c]-i.rotation[o][c]));const r=Math.max(...n.translation.map(o=>Math.abs(o))),a=Math.max(s,r);return{product:n,rotationResidual:s,translationResidual:r,residual:a,tolerance:e,closed:Number.isFinite(a)&&e>=0&&s<=e&&r<=e}}function Au(t,e){const[n,i]=[t,e].sort((s,r)=>s.localeCompare(r));return`overlap:${n}:${i}`}function Tu(t){return`out-of-bounds:${t}`}function Ec(t,e){const n=[0,0,0],i=[1,0,0],s=[0,1,0],r=[0,Math.cos(e),Math.sin(e)];return{id:`${t.id}:global-pair`,ownerNodeId:t.id,origin:n,widthAxis:i,width:t.width,parentAngle:e,angleRange:[t.deployedAngle,Math.PI],boundary:{start:n,end:Ft(n,St(i,t.width))},floor:{frame:Kr(n,i,s),extent:t.floorExtent,materialSide:"negativeNormal"},wall:{frame:Kr(n,i,r),extent:t.wallExtent,materialSide:"negativeNormal"}}}function wu(t,e,n=t.id){const i=e.points.junction,s=e.frames.childFloor.widthAxis,r=St(e.frames.childFloor.inPlaneAxis,-1),a=St(e.frames.childWall.inPlaneAxis,-1);return{id:`${n}:generated-pair`,ownerNodeId:n,origin:i,widthAxis:s,width:t.width,parentAngle:e.parentAngle,angleRange:[t.deployedAngle,Math.PI],boundary:{start:i,end:Ft(i,St(s,t.width))},floor:{frame:Kr(i,s,r),extent:t.linkage==="parallelogram"?t.depth:t.height,materialSide:"negativeNormal"},wall:{frame:Kr(i,s,a),extent:t.linkage==="parallelogram"?t.height:t.depth,materialSide:"negativeNormal"}}}function Ru(t,e,n){if(!Number.isFinite(n))throw new RangeError("Port width offset must be finite.");const i={...e.floor.frame,origin:Ft(e.origin,St(e.widthAxis,n))},s=xc(t.frames.parentFloor,i);return J_(t,s)}function J_(t,e){return{...t,points:{origin:ht(e,t.points.origin),floorAnchor:ht(e,t.points.floorAnchor),wallAnchor:ht(e,t.points.wallAnchor),junction:ht(e,t.points.junction)},frames:{parentFloor:er(t.frames.parentFloor,e),parentWall:er(t.frames.parentWall,e),childFloor:er(t.frames.childFloor,e),childWall:er(t.frames.childWall,e)}}}function er(t,e){return{origin:ht(e,t.origin),widthAxis:yi(e.rotation,t.widthAxis),inPlaneAxis:yi(e.rotation,t.inPlaneAxis),normal:yi(e.rotation,t.normal)}}function Kr(t,e,n){return{origin:t,widthAxis:e,inPlaneAxis:n,normal:si(us(e,n))}}function bc(t){const n=[["width",t.width],["height",t.height],["depth",t.depth]].filter(([,s])=>!Number.isFinite(s)||s<=0),i=[];return n.length>0&&i.push(Zr("MECHANISM_POPUP_INVALID_PARAMETER",`Pop-up dimensions must be finite and positive: ${n.map(([s])=>s).join(", ")}.`,t.id,"Use finite dimensions greater than zero.",n.map(([s])=>["input",s]))),(!Number.isFinite(t.deployedAngle)||t.deployedAngle<=0||t.deployedAngle>=Math.PI)&&i.push(Zr("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","The deployed parent angle must lie strictly between zero and pi radians.",t.id,"Choose a deployed angle in the open interval (0, pi).",[["input","deployedAngle"]])),i}function ha(t,e){const n=bc(t),i=Ze.absoluteAngle;return(!Number.isFinite(e)||e<t.deployedAngle-i||e>Math.PI+i)&&n.push(Zr("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","The parent angle lies outside the mechanism path domain.",t.id,`Choose an angle from ${t.deployedAngle} through ${Math.PI} radians.`,[["parentAngle"]])),n.length>0?{ok:!1,diagnostics:n}:{ok:!0,state:Cu(t,e)}}function Ac(t,e){const n=bc(t);if((!Number.isFinite(e)||!Number.isInteger(e)||e<2)&&n.push(Zr("PATH_POPUP_SAMPLE_COUNT_INVALID","A pop-up path requires an integer sample count of at least two.",t.id,"Use an integer sample count greater than or equal to two.",[["input","sampleCount"]])),n.length>0)return{ok:!1,diagnostics:n};const i=Array.from({length:e},(s,r)=>{const a=r/(e-1),o=Math.PI+a*(t.deployedAngle-Math.PI);return Cu(t,o)});return{ok:!0,path:{id:`two-plane-popup-path:${t.id}`,domain:[t.deployedAngle,Math.PI],samples:i,evaluate(s){const r=ha(t,s);if(!r.ok)throw new RangeError(r.diagnostics.map(a=>a.message).join(" "));return r.state},certificate:Q_(t)}}}function Cu(t,e){const n=[0,0,0],i=[1,0,0],s=[0,1,0],r=[0,Math.cos(e),Math.sin(e)],a=St(s,t.depth),o=St(r,t.height),c=t.linkage==="parallelogram"?Ft(a,o):j_(t,e,a,o),l=si(Xe(c,a)),u=si(Xe(c,o)),h=Math.max(et(Xe(l,r)),et(Xe(u,s))),d=Math.abs(e-Math.PI)<=Ze.absoluteAngle;return{id:`${t.id}:angle:${e}`,linkage:t.linkage??"reflected",parentAngle:e,points:{origin:n,floorAnchor:a,wallAnchor:o,junction:c},frames:{parentFloor:tr(n,i,s),parentWall:tr(n,i,r),childFloor:tr(c,i,u),childWall:tr(c,i,l)},axisAligned:h<=Ze.absoluteAngle,alignmentResidual:h,contact:d?"intentionalFlatCoincidence":"clear"}}function j_(t,e,n,i){const s=Xe(i,n),r=Math.sin(e/2),a=(t.depth-t.height)**2+4*t.depth*t.height*r*r,o=t.depth*(t.depth-t.height+2*t.height*r*r)/a;return St(Ft(n,St(s,o)),2)}function tr(t,e,n){return{origin:t,widthAxis:e,inPlaneAxis:n,normal:si(us(e,n))}}function Q_(t){const e=t.linkage==="parallelogram";return{id:`two-plane-popup-certificate:${t.id}`,subjectId:t.id,classification:"certifiedRigidPath",theoremIds:[e?"two-plane-popup-parallelogram-path":"two-plane-popup-reflection-path"],assumptions:[{id:"ideal-zero-thickness",statement:"All four panels are perfectly rigid with zero thickness and ideal hinges."},{id:"constant-width-extrusion",statement:"The planar linkage is extruded at constant positive width."},{id:"intentional-flat-contact",statement:"Coincident layers at the flat endpoint are permitted."}],constraints:[{id:"positive-finite-dimensions",status:"satisfied",method:"exact"},{id:"rigid-link-isometry",status:"satisfied",method:"exact"},{id:"four-bar-loop-closure",status:"satisfied",method:"exact",details:e?"Opposite linkage edges remain parallel and equal throughout the path.":"The moving junction is the reflection of the origin across the anchor line."},{id:e?"continuous-parallelogram-branch":"continuous-reflection-branch",status:"satisfied",method:"exact"},{id:"open-path-collision-freedom",status:"satisfied",method:"exact"}],unsupportedConditions:[],provenance:[{source:"docs/superpowers/specs/2026-07-29-two-plane-pop-up-design.md",locator:"Mathematical Claims",claimId:"two-plane-popup-reflection-path"},{source:"docs/mathematical-contract.md",locator:"4. Two-Plane Pop-Up Family"}]}}function Zr(t,e,n,i,s=[]){return{severity:"error",category:t.startsWith("PATH_")?"path":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"twoPlanePopUp",id:n}},...s.map(r=>({kind:"parameter",path:r}))],entities:[{kind:"twoPlanePopUp",id:n}],suggestion:i}}function Tc(t){const e=e0(t);if(e)return[e];if(t.nodes.length===0)return[Jt("ASSEMBLY_SCHEMA_INVALID","An assembly requires at least one pop-up node.","assembly",t.id)];const n=xl(t.nodes);if(n)return[Jt("ASSEMBLY_DUPLICATE_NODE_ID",`Pop-up node ID ${n} is not unique.`,"popUpNode",n)];const i=xl(t.sharedPortConstraints);if(i)return[Jt("ASSEMBLY_SHARED_CONSTRAINT_INVALID",`Shared-port constraint ID ${i} is not unique.`,"sharedPortConstraint",i)];for(const d of t.nodes)if(bc(fa(d)).length>0)return[Jt("ASSEMBLY_SCHEMA_INVALID",`Node ${d.id} has invalid pop-up parameters.`,"popUpNode",d.id)];const s=new Map(t.nodes.map(d=>[d.id,d]));for(const d of t.nodes)if(d.attachment.kind==="generatedPair"&&!s.has(d.attachment.parentNodeId))return[Jt("ASSEMBLY_PARENT_MISSING",`Node ${d.id} references missing parent ${d.attachment.parentNodeId}.`,"popUpNode",d.id)];const r=Pu(t.nodes,s);if(r.cycleNodeId)return[Jt("ASSEMBLY_HIERARCHY_CYCLE","Pop-up attachment parents must form an acyclic hierarchy.","popUpNode",r.cycleNodeId)];const a=[...r.values.entries()].find(([,d])=>d>2);if(a)return[Jt("ASSEMBLY_DEPTH_UNSUPPORTED","The supported hierarchy is sheet to root to child.","popUpNode",a[0],"Attach this node directly to a root module or split the design.")];const o=Ze.absoluteAngle,c=t.nodes.find(d=>Math.abs(d.parameters.deployedAngle-t.sheet.deployedAngle)>o);if(c)return[Jt("ASSEMBLY_PARAMETER_MISMATCH","Every module must use the assembly sheet deployed angle.","popUpNode",c.id,`Use ${t.sheet.deployedAngle} radians.`)];const l=Iu(t,r.values),u=t0(t,l,s);if(u)return[u];const h=n0(t.nodes);if(h)return[h];for(const d of t.sharedPortConstraints)if(d.firstNodeId===d.secondNodeId||!s.has(d.firstNodeId)||!s.has(d.secondNodeId)||!Ys(d.expectedTransform,Ze.relativeRank))return[Jt("ASSEMBLY_SHARED_CONSTRAINT_INVALID","A shared-port constraint requires two distinct existing nodes and a proper rigid transform.","sharedPortConstraint",d.id)];return[]}function Jr(t,e){const n=Tc(t);if((!Number.isFinite(e)||e<t.sheet.deployedAngle-Ze.absoluteAngle||e>Math.PI+Ze.absoluteAngle)&&n.push(Jt("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","Assembly angle lies outside the synchronized path domain.","assembly",t.id)),n.length>0)return{ok:!1,diagnostics:n};const i=new Map(t.nodes.map(c=>[c.id,c])),s=Pu(t.nodes,i),r=Iu(t,s.values),a=new Map,o=Ec(t.sheet,e);for(const c of r){const l=fa(c.node),u=ha(l,e);if(!u.ok)return{ok:!1,diagnostics:u.diagnostics};const h=c.node.attachment,d=h.kind==="sheet"?o:a.get(h.parentNodeId).outputPort,f=Ru(u.state,d,h.xOffset),p=xc(u.state.frames.parentFloor,f.frames.parentFloor),_=h.kind==="generatedPair"?h.parentNodeId:void 0,m={nodeId:c.node.id,..._===void 0?{}:{parentNodeId:_},depth:c.depth,globalWidthInterval:c.globalWidthInterval,localToWorld:p,worldState:{...f,id:`${c.node.id}:angle:${e}`},outputPort:wu(l,f,c.node.id)};a.set(c.node.id,m)}return{ok:!0,state:{id:`${t.id}:angle:${e}`,definitionId:t.id,parentAngle:e,nodes:r.map(c=>a.get(c.node.id))}}}function fa(t){return{id:t.id,...t.parameters}}function e0(t){const e=t.sheet;if(typeof t.id!="string"||t.id.length===0||typeof e.id!="string"||e.id.length===0||![e.width,e.wallExtent,e.floorExtent].every(n=>Number.isFinite(n)&&n>0)||!Number.isFinite(e.deployedAngle)||e.deployedAngle<=0||e.deployedAngle>=Math.PI)return Jt("ASSEMBLY_SCHEMA_INVALID","Assembly and sheet IDs must be nonempty; sheet dimensions and deployed angle must be finite and admissible.","assembly",t.id)}function xl(t){const e=new Set;for(const n of t){if(e.has(n.id))return n.id;e.add(n.id)}}function Pu(t,e){const n=new Map,i=new Set;let s;const r=a=>{const o=n.get(a.id);if(o!==void 0)return o;if(i.has(a.id))return s=a.id,Number.POSITIVE_INFINITY;i.add(a.id);const c=a.attachment.kind==="sheet"?1:1+r(e.get(a.attachment.parentNodeId));return i.delete(a.id),n.set(a.id,c),c};for(const a of t){if(s)break;r(a)}return{values:n,...s===void 0?{}:{cycleNodeId:s}}}function Iu(t,e){const n=new Map,i=[...t.nodes].sort((s,r)=>e.get(s.id)-e.get(r.id)||s.id.localeCompare(r.id));for(const s of i){const r=e.get(s.id),a=s.attachment,o=a.kind==="sheet"?a.xOffset:n.get(a.parentNodeId).globalWidthInterval[0]+a.xOffset;n.set(s.id,{node:s,depth:r,globalWidthInterval:[o,o+s.parameters.width]})}return i.map(s=>n.get(s.id))}function t0(t,e,n){const i=Ze.absoluteLength;for(const s of e){const r=s.node,a=r.attachment,o=a.xOffset,c=a.kind==="sheet"?t.sheet.width:n.get(a.parentNodeId).parameters.width,l=a.kind==="sheet"?t.sheet.wallExtent:n.get(a.parentNodeId).parameters.depth,u=a.kind==="sheet"?t.sheet.floorExtent:n.get(a.parentNodeId).parameters.height;if(!Number.isFinite(o)||o<-i||o+r.parameters.width>c+i||r.parameters.height>l+i||r.parameters.depth>u+i)return Jt("ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS",`Node ${r.id} does not fit its host width or plane extents.`,"outOfBoundsRegion",Tu(r.id),`Fit width within ${c}, wall height within ${l}, and floor depth within ${u}.`)}}function n0(t){const e=new Map;for(const i of t){const s=i.attachment.kind==="sheet"?"sheet":`node:${i.attachment.parentNodeId}`,r=e.get(s)??[];r.push(i),e.set(s,r)}const n=Ze.absoluteLength;for(const i of e.values()){const s=[...i].sort((r,a)=>r.attachment.xOffset-a.attachment.xOffset||r.id.localeCompare(a.id));for(let r=1;r<s.length;r+=1){const a=s[r-1],o=s[r];if(o.attachment.xOffset<a.attachment.xOffset+a.parameters.width-n)return Jt("ASSEMBLY_ATTACHMENT_OVERLAP",`Sibling strips ${a.id} and ${o.id} overlap.`,"overlapRegion",Au(a.id,o.id),"Move or resize sibling strips so their open width intervals are disjoint.")}}}function Jt(t,e,n,i,s){return{severity:"error",category:t==="ASSEMBLY_DEPTH_UNSUPPORTED"?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}],...s===void 0?{}:{suggestion:s}}}function Lu(t){const e=Tc(t);if(e.length>0)return{ok:!1,diagnostics:e};const n=Jr(t,Math.PI);if(!n.ok)return n;const i=vl([0,t.sheet.width,...n.state.nodes.flatMap(S=>[...S.globalWidthInterval])]),s=i0(n.state.nodes),r=vl([-t.sheet.wallExtent,0,t.sheet.floorExtent,...s.flatMap(S=>[S.yMinimum,S.yMaximum])]),a=[];for(let S=0;S<r.length-1;S+=1)for(let y=0;y<i.length-1;y+=1){const T=(i[y]+i[y+1])/2,M=(r[S]+r[S+1])/2,b=r0(t,s,T,M),P=`face:${y}:${S}:${b.id}`;a.push({xIndex:y,yIndex:S,faceId:P,owner:b,halfEdgeIds:[`halfEdge:${y}:${S}:bottom`,`halfEdge:${y}:${S}:right`,`halfEdge:${y}:${S}:top`,`halfEdge:${y}:${S}:left`]})}const o=a0(i,r),c=[],l=[],u=new Map,h=new Map(a.map(S=>[S.faceId,S.owner]));for(const S of a){const[y,T,M,b]=S.halfEdgeIds;c.push({id:S.faceId,boundary:y,holes:[]});const P=[[{id:y,origin:Ps(S.xIndex,S.yIndex),next:T,edge:"",face:S.faceId},Ml(S.xIndex,S.yIndex)],[{id:T,origin:Ps(S.xIndex+1,S.yIndex),next:M,edge:"",face:S.faceId},yl(S.xIndex+1,S.yIndex)],[{id:M,origin:Ps(S.xIndex+1,S.yIndex+1),next:b,edge:"",face:S.faceId},Ml(S.xIndex,S.yIndex+1)],[{id:b,origin:Ps(S.xIndex,S.yIndex+1),next:y,edge:"",face:S.faceId},yl(S.xIndex,S.yIndex)]];for(const[C,I]of P){l.push(C);const X=u.get(I)??[];X.push({halfEdge:C,faceId:S.faceId,owner:S.owner}),u.set(I,X)}}const d=[],f=[],p=[],_=[],m=[...u.entries()].sort(([S],[y])=>S.localeCompare(y));for(const[S,y]of m){if(y.length===1){const C=`edge:boundary:${S}`;y[0].halfEdge.edge=C,d.push({id:C,halfEdges:[y[0].halfEdge.id],kind:"boundary"}),p.push(Ea(C,"boundary",y));continue}if(y.length!==2)return Sl(t.id,`Grid segment ${S} has ${y.length} incident cells.`);const T=y[0].owner.id===y[1].owner.id;if(S.startsWith("v:")&&!T){const C=[...y].sort((H,D)=>H.faceId.localeCompare(D.faceId)),I=`cutPair:${S}`,X=[`edge:cut:${S}:a`,`edge:cut:${S}:b`];C.forEach((H,D)=>{const W=D===0?"a":"b",B=X[D];H.halfEdge.edge=B,d.push({id:B,halfEdges:[H.halfEdge.id],kind:"cutBank",cutBank:{pair:I,bank:W}}),p.push(Ea(B,"cutBank",[H]))}),f.push({id:I,banks:X}),_.push({cutPairId:I,nodeIds:Du(y)});continue}const M=T?"flatSeam":"hinge",b=T?"flatSeam":o0(S,r)===0||s0(y)?"centerHinge":"anchorHinge",P=`edge:${M}:${S}`;y[0].halfEdge.edge=P,y[1].halfEdge.edge=P,y[0].halfEdge.twin=y[1].halfEdge.id,y[1].halfEdge.twin=y[0].halfEdge.id,d.push({id:P,halfEdges:[y[0].halfEdge.id,y[1].halfEdge.id],kind:M,...M==="hinge"?{hinge:b==="centerHinge"?{assignment:"valley",restAngle:0,angleRange:[0,Math.PI]}:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}:{}}),p.push(Ea(P,b,y))}const g={schemaVersion:1,vertices:o,halfEdges:l,edges:d,faces:c,cutPairs:f,materialComponents:[{id:`materialComponent:${t.sheet.id}`,faces:c.map(S=>S.id)}]},A=Ci(g);if(A.length>0)return Sl(t.id,A.map(S=>S.code).join(", "));const w=a.map(S=>({faceId:S.faceId,owner:h.get(S.faceId)})),v=c0(t,w,p,_);return{ok:!0,assembly:{definition:t,complex:g,sourceMap:v,attachmentEdges:l0(t),cycles:d0(t)}}}function i0(t){return t.flatMap(e=>{const n=ji(e.worldState.points.origin[1]),i=ji(e.worldState.points.floorAnchor[1]),s=ji(e.worldState.points.wallAnchor[1]),r=ji(e.worldState.points.junction[1]),[a,o]=e.globalWidthInterval;return e.worldState.linkage==="parallelogram"?[{owner:{id:`module:${e.nodeId}:childFloor`,kind:"module",role:"childFloor",nodeId:e.nodeId},depth:e.depth,xMinimum:a,xMaximum:o,yMinimum:Math.min(s,r),yMaximum:Math.max(s,r)},{owner:{id:`module:${e.nodeId}:childWall`,kind:"module",role:"childWall",nodeId:e.nodeId},depth:e.depth,xMinimum:a,xMaximum:o,yMinimum:Math.min(r,i),yMaximum:Math.max(r,i)}]:[{owner:{id:`module:${e.nodeId}:childWall`,kind:"module",role:"childWall",nodeId:e.nodeId},depth:e.depth,xMinimum:a,xMaximum:o,yMinimum:Math.min(n,i),yMaximum:Math.max(n,i)},{owner:{id:`module:${e.nodeId}:childFloor`,kind:"module",role:"childFloor",nodeId:e.nodeId},depth:e.depth,xMinimum:a,xMaximum:o,yMinimum:Math.min(n,s),yMaximum:Math.max(n,s)}]})}function s0(t){if(t.length!==2)return!1;const e=t.map(({owner:n})=>n);return e.every(n=>n.kind==="module")&&e[0].nodeId===e[1].nodeId&&e[0].role!==e[1].role}function r0(t,e,n,i){let s=i<0?{id:`sheet:${t.sheet.id}:wall`,kind:"sheet",role:"wall",sheetId:t.sheet.id}:{id:`sheet:${t.sheet.id}:floor`,kind:"sheet",role:"floor",sheetId:t.sheet.id};const r=[...e].sort((a,o)=>a.depth-o.depth||a.owner.id.localeCompare(o.owner.id));for(const a of r)n>a.xMinimum&&n<a.xMaximum&&i>a.yMinimum&&i<a.yMaximum&&(s=a.owner);return s}function vl(t){const e=Ze.absoluteLength,n=t.map(ji).sort((s,r)=>s-r),i=[];for(const s of n)(i.length===0||Math.abs(s-i[i.length-1])>e)&&i.push(s);return i}function ji(t){return Math.abs(t)<=Ze.absoluteLength?0:t}function a0(t,e){const n=[];for(let i=0;i<e.length;i+=1)for(let s=0;s<t.length;s+=1)n.push({id:Ps(s,i),position:[t[s],e[i]]});return n}function Ps(t,e){return`vertex:${t}:${e}`}function Ml(t,e){return`h:${t}:${e}`}function yl(t,e){return`v:${t}:${e}`}function o0(t,e){const n=t.split(":");return ji(e[Number(n[2])])}function Ea(t,e,n){return{edgeId:t,role:e,ownerIds:[...new Set(n.map(i=>i.owner.id))].sort(),nodeIds:Du(n)}}function Du(t){return[...new Set(t.flatMap(e=>e.owner.kind==="module"?[e.owner.nodeId]:[]))].sort()}function c0(t,e,n,i){const s=new Set([`sheet:${t.sheet.id}:wall`,`sheet:${t.sheet.id}:floor`]);return{sheet:{sheetId:t.sheet.id,faceIds:e.filter(r=>s.has(r.owner.id)).map(r=>r.faceId),edgeIds:n.filter(r=>r.ownerIds.some(a=>s.has(a))).map(r=>r.edgeId)},nodes:[...t.nodes].sort((r,a)=>r.id.localeCompare(a.id)).map(r=>({nodeId:r.id,faceIds:e.filter(a=>a.owner.kind==="module"&&a.owner.nodeId===r.id).map(a=>a.faceId),edgeIds:n.filter(a=>a.nodeIds.includes(r.id)).map(a=>a.edgeId)})),faces:e,edges:n,cutPairs:i}}function l0(t){return[...t.nodes].sort((e,n)=>e.id.localeCompare(n.id)).map(e=>({id:`attachment:${e.id}`,parentId:e.attachment.kind==="sheet"?t.sheet.id:e.attachment.parentNodeId,childId:e.id}))}function d0(t){const e=new Map(t.nodes.map(n=>[n.id,n.attachment.kind==="sheet"?t.sheet.id:n.attachment.parentNodeId]));return[...t.sharedPortConstraints].sort((n,i)=>n.id.localeCompare(i.id)).map(n=>({constraintId:n.id,nodePath:u0(n.firstNodeId,n.secondNodeId,t.sheet.id,e)}))}function u0(t,e,n,i){const s=h=>{const d=[h];for(;d[d.length-1]!==n;)d.push(i.get(d[d.length-1]));return d},r=s(t),a=s(e),o=new Set(a),c=r.find(h=>o.has(h)),l=r.slice(0,r.indexOf(c)+1),u=a.slice(0,a.indexOf(c)).reverse();return[...l,...u,t]}function Sl(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"ASSEMBLY_COMPILED_TOPOLOGY_INVALID",message:`Compiled pop-up topology is invalid: ${e}`,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function h0(t,e,n=Ze){const i=v0(e).every(Number.isFinite),s=Math.max(t.width,t.height,t.depth),r=ua(s,n),a=[i?sr("finite-state",0,0):gs("finite-state","State coordinates and frames must be finite.")];i?a.push(sr("rigid-link-isometry",p0(t,e),r),sr("parent-child-angle",m0(e),n.absoluteAngle),sr("frame-orthonormality",g0(e),n.relativeRank),x0(e)):a.push(gs("rigid-link-isometry","Linkage residual is undefined for a non-finite state."),gs("parent-child-angle","Angle residual is undefined for a non-finite state."),gs("frame-orthonormality","Frame residual is undefined for a non-finite state."),gs("collision-and-contact","Contact classification is undefined for a non-finite state."));const o=a.some(c=>c.status==="failed")?"invalid":"endpointIsometric";return{id:`two-plane-popup-analysis:${e.id}`,subjectId:e.id,classification:o,assumptions:[{id:"ideal-zero-thickness",statement:"Panels are perfectly rigid and have zero thickness."},{id:"constant-width-extrusion",statement:"The checked cross-section is extruded at constant width."}],constraints:a,unsupportedConditions:[],provenance:[{source:"docs/superpowers/specs/2026-07-29-two-plane-pop-up-design.md",locator:"Components",claimId:"two-plane-popup-independent-state-analysis"}]}}function f0(t,e=Ze.absoluteLength){if(Math.abs(t.parentAngle-Math.PI)<=Ze.absoluteAngle)return"intentionalFlatCoincidence";const{origin:n,floorAnchor:i,wallAnchor:s,junction:r}=t.points;return bl(n,i,r,s,e)||bl(i,r,s,n,e)?"unintendedIntersection":"clear"}function p0(t,e){const{origin:n,floorAnchor:i,wallAnchor:s,junction:r}=e.points,a=t.linkage==="parallelogram"?t.height:t.depth,o=t.linkage==="parallelogram"?t.depth:t.height;return Math.max(Math.abs(et(Xe(i,n))-t.depth),Math.abs(et(Xe(r,i))-a),Math.abs(et(Xe(s,n))-t.height),Math.abs(et(Xe(r,s))-o))}function m0(t){const{origin:e,floorAnchor:n,wallAnchor:i,junction:s}=t.points,r=El(Xe(n,e),Xe(i,e)),a=El(Xe(n,s),Xe(i,s));return Math.abs(r-a)}function El(t,e){const n=si(t),i=si(e);return Math.atan2(et(us(n,i)),ct(n,i))}function g0(t){return Math.max(...Object.values(t.frames).map(_0))}function _0(t){const e=us(t.widthAxis,t.inPlaneAxis);return Math.max(Math.abs(et(t.widthAxis)-1),Math.abs(et(t.inPlaneAxis)-1),Math.abs(et(t.normal)-1),Math.abs(ct(t.widthAxis,t.inPlaneAxis)),Math.abs(ct(t.widthAxis,t.normal)),Math.abs(ct(t.inPlaneAxis,t.normal)),et(Xe(e,t.normal)))}function x0(t){const e=f0(t);return{id:"collision-and-contact",status:e!=="unintendedIntersection"&&e===t.contact?"satisfied":"failed",method:"exact",details:e==="intentionalFlatCoincidence"?"Coincidence is intentional flat contact at the path endpoint.":e==="clear"?"Nonadjacent cross-section links do not intersect.":"Nonadjacent cross-section links intersect."}}function bl(t,e,n,i,s){const r=Math.max(et(Xe(e,t)),et(Xe(n,t)),et(Xe(i,t)),et(Xe(n,e)),et(Xe(i,e)),et(Xe(i,n)),s),a=s*r,o=nr(t,e,n),c=nr(t,e,i),l=nr(n,i,t),u=nr(n,i,e);return(o>a&&c<-a||o<-a&&c>a)&&(l>a&&u<-a||l<-a&&u>a)?!0:Math.abs(o)<=a&&ir(t,e,n,s)||Math.abs(c)<=a&&ir(t,e,i,s)||Math.abs(l)<=a&&ir(n,i,t,s)||Math.abs(u)<=a&&ir(n,i,e,s)}function nr(t,e,n){const i=e[1]-t[1],s=e[2]-t[2],r=n[1]-t[1],a=n[2]-t[2];return i*a-s*r}function ir(t,e,n,i){return n[1]>=Math.min(t[1],e[1])-i&&n[1]<=Math.max(t[1],e[1])+i&&n[2]>=Math.min(t[2],e[2])-i&&n[2]<=Math.max(t[2],e[2])+i}function v0(t){return[t.parentAngle,...Object.values(t.points).flatMap(e=>[...e]),...Object.values(t.frames).flatMap(e=>[...e.origin,...e.widthAxis,...e.inPlaneAxis,...e.normal]),t.alignmentResidual]}function sr(t,e,n){return{id:t,status:e<=n?"satisfied":"failed",method:"boundedNumerical",residual:e,tolerance:n}}function gs(t,e){return{id:t,status:"failed",method:"exact",details:e}}function po(t,e,n=Math.max(Ze.absoluteLength,Ze.absoluteAngle)){const i=t.nodes.find(u=>u.nodeId===e.firstNodeId),s=t.nodes.find(u=>u.nodeId===e.secondNodeId);if(!i||!s)throw new RangeError("Shared-port constraint references a missing node.");const r=Yr(i.outputPort.floor.frame),a=Yr(s.outputPort.floor.frame),o=Xt(Ei(r),a),c=Xt(Ei(e.expectedTransform),o),l=Z_([c],n);return{constraintId:e.id,errorTransform:c,residualVector:C0(c),rotationResidual:l.rotationResidual,translationResidual:l.translationResidual,residual:l.residual,tolerance:l.tolerance,closed:l.closed}}function M0(t,e,n=E0(t)){if(!Number.isFinite(e)||!Number.isInteger(e)||e<2)return{ok:!1,diagnostics:[{severity:"error",category:"path",code:"PATH_POPUP_SAMPLE_COUNT_INVALID",message:"An assembly path requires an integer sample count of at least two.",locations:[{kind:"parameter",path:["sampleCount"]}],entities:[{kind:"assembly",id:t.id}],suggestion:"Use an integer sample count greater than or equal to two."}]};const i=Lu(t);if(!i.ok)return i;const s=[],r=[];let a=!1;for(let m=0;m<e;m+=1){const g=m/(e-1),A=Math.PI+g*(t.sheet.deployedAngle-Math.PI),w=Jr(t,A);if(!w.ok)return w;s.push(w.state),y0(t,w.state).some(S=>S.status==="failed")&&(a=!0),r.push(t.sharedPortConstraints.map(S=>po(w.state,S)))}const o=s[0],c=s.map(m=>X_({assembly:i.assembly,flat:o,state:m,profileByNodeId:n})),l=S0(t,r,a,c),u=t.sharedPortConstraints.filter((m,g)=>r.some(A=>!A[g].closed)),h=b0([...u.map(P0),...c.flatMap(m=>m.diagnostics)]),f=l.some(m=>m.status==="failed")?"invalid":t.sharedPortConstraints.length===0?"certifiedRigidPath":"numericallyVerifiedRigidPath",p=A0(t,f,l),_=(t.sheet.deployedAngle+Math.PI)/2;return{ok:!0,path:{id:`pop-up-assembly-path:${t.id}`,compiledAssembly:i.assembly,samples:s,evidence:p,mobility:R0(t,_),diagnostics:h}}}function y0(t,e){const n=new Map(t.nodes.map(i=>[i.id,i]));return e.nodes.flatMap(i=>{const s=n.get(i.nodeId);return h0(fa(s),i.worldState).constraints.map(a=>({...a,id:`module:${s.id}:${a.id}`}))})}function S0(t,e,n,i){const s=Math.max(t.sheet.width,t.sheet.wallExtent,t.sheet.floorExtent),r=ua(s),a=r*Math.max(s,1),o=Math.max(...i.map(f=>f.hingeResidual),0),c=Math.max(...i.map(f=>f.sourceAreaResidual),0),l=Math.max(...i.map(f=>f.profileResidual),0),u=i.some(f=>f.materialComponentCount!==1||f.sourceAreaResidual>a),h=i.some(f=>f.diagnostics.some(p=>p.code==="COMPILED_PROFILE_INVALID")),d=[{id:"compiled-topology",status:"satisfied",method:"exact"},{id:"synchronized-local-rigid-paths",status:n?"failed":"satisfied",method:"exact"},{id:"rigid-port-attachment",status:"satisfied",method:"exact"},{id:"host-domain-admissibility",status:"satisfied",method:"exact"},{id:"nested-strip-collision-freedom",status:"satisfied",method:"exact"},{id:"compiled-hinge-cohesion",status:o<=r?"satisfied":"failed",method:"sampledNumerical",residual:o,tolerance:r,details:`${i.length} synchronized path samples.`},{id:"source-material-conservation",status:u?"failed":"satisfied",method:"sampledNumerical",residual:c,tolerance:a,details:"One connected source sheet with conserved face area."},{id:"declared-geometry-profile",status:h?"failed":"satisfied",method:"sampledNumerical",residual:l,tolerance:Ze.absoluteAngle,details:"Axis alignment is required unless rotation is explicitly declared."}];return t.sharedPortConstraints.forEach((f,p)=>{const _=Math.max(...e.map(g=>g[p].residual)),m=e[0][p].tolerance;d.push({id:`shared-cycle:${f.id}`,status:_<=m?"satisfied":"failed",method:"sampledNumerical",residual:_,tolerance:m,details:`${e.length} synchronized path samples.`})}),d}function E0(t){return new Map(t.nodes.map(e=>[e.id,e.parameters.linkage==="parallelogram"?"axisAligned":"allowRotated"]))}function b0(t){const e=new Map;for(const n of t){const i=`${n.code}:${n.entities.map(s=>`${s.kind}:${s.id}`).join(",")}`;e.has(i)||e.set(i,n)}return[...e.values()]}function A0(t,e,n){const i={id:`pop-up-assembly-path-evidence:${t.id}`,subjectId:t.id,assumptions:T0(t),constraints:n,unsupportedConditions:[],provenance:w0()};return e==="certifiedRigidPath"?{...i,classification:e,theoremIds:["two-plane-popup-reflection-path","nested-parallel-strip-composition"]}:{...i,classification:e}}function T0(t){const e=[];for(const n of[...t.nodes].sort((i,s)=>i.id.localeCompare(s.id))){const i=Ac(fa(n),2);i.ok&&e.push(...i.path.certificate.assumptions.map(s=>({id:`inherited:${n.id}:${s.id}`,statement:`Node ${n.id}: ${s.statement}`})))}return[...e,{id:"assembly:synchronized-angle",statement:"Every module is driven by one common parent angle."},{id:"assembly:nested-strip-replacement",statement:"A child replaces material inside its declared host strip."},{id:"assembly:disjoint-sibling-interiors",statement:"Sibling strip intervals have disjoint interiors."}]}function w0(){return[{source:"docs/superpowers/specs/2026-07-29-recursive-pop-up-composition-design.md",locator:"Global Path And Collision",claimId:"nested-parallel-strip-composition"},{source:"docs/mathematical-contract.md",locator:"5. Composition Contract"}]}function R0(t,e){const n=Math.sqrt(Number.EPSILON);if(t.sharedPortConstraints.length===0)return{...Br([],1),finiteDifferenceStep:0,derivativeZeroTolerance:n};const i=Math.PI-t.sheet.deployedAngle,s=Math.min(1e-6,i/8),r=Math.min(Math.PI-s,Math.max(t.sheet.deployedAngle+s,e)),a=Jr(t,r+s),o=Jr(t,r-s);if(!a.ok||!o.ok)return{...Br([],1),finiteDifferenceStep:s,derivativeZeroTolerance:n};const c=t.sharedPortConstraints.flatMap(h=>po(a.state,h).residualVector),l=t.sharedPortConstraints.flatMap(h=>po(o.state,h).residualVector),u=c.map((h,d)=>{const f=(h-l[d])/(2*s);return[Math.abs(f)<=n?0:f]});return{...Br(u,1),finiteDifferenceStep:s,derivativeZeroTolerance:n}}function C0(t){return[t.rotation[0][0]-1,t.rotation[0][1],t.rotation[0][2],t.translation[0],t.rotation[1][0],t.rotation[1][1]-1,t.rotation[1][2],t.translation[1],t.rotation[2][0],t.rotation[2][1],t.rotation[2][2]-1,t.translation[2]]}function P0(t){return{severity:"error",category:"kinematics",code:"ASSEMBLY_GLOBAL_CLOSURE_FAILED",message:`Shared-port cycle ${t.id} does not close.`,locations:[{kind:"entity",entity:{kind:"sharedPortConstraint",id:t.id}}],entities:[{kind:"sharedPortConstraint",id:t.id}],suggestion:"Correct or remove the conflicting shared-port transform."}}const Nu=1,Fu=["opening","planePair","platform","shelf","stair","wall"],jr=Object.freeze({schemaVersion:Nu,supportedOperations:Object.freeze(["planePair","platform","shelf","stair","wall"]),unsupportedOperations:Object.freeze(["opening"]),unsupportedConstructionFamilies:Object.freeze(["multifold","curvedCrease"]),alignments:Object.freeze(["allowRotated","axisAligned"]),mismatchPolicies:Object.freeze(["preserveDepth","preserveHeight","reject"]),targets:Object.freeze(["generatedPair","sheet"]),maximumModuleDepth:2,maximumOperations:64,maximumPathSampleCount:1001,emitsPartialGeometryOnFailure:!1});function I0(t){if(!L0(t))return[on("SPATIAL_PROGRAM_INVALID","Spatial program, sheet, and path-sampling fields must be finite and admissible.","spatialProgram",typeof t?.id=="string"?t.id:"unknown")];const e=F0(t.operations);if(e)return[on("SPATIAL_DUPLICATE_OPERATION_ID",`Spatial operation ID ${e} is not unique.`,"spatialOperation",e)];const n=new Map(t.operations.map(a=>[a.id,a])),i=[];for(const a of[...t.operations].sort(ku)){if(!N0(a)){i.push(on("SPATIAL_DIMENSION_INVALID","Spatial dimensions must be finite and positive, and xOffset must be finite.","spatialOperation",a.id));continue}a.kind==="stair"&&(Number.isInteger(a.stepCount)&&a.stepCount>0&&Number.isFinite(a.stepRun)&&a.stepRun>0&&Number.isFinite(a.stepRise)&&a.stepRise>0?a.stepRun!==a.stepRise&&i.push(on("SPATIAL_DIMENSION_CONFLICT","The certified stair mechanism requires equal step run and rise.","spatialOperation",a.id,"Set stepRun equal to stepRise for the first certified stair mechanism.")):i.push(on("SPATIAL_DIMENSION_INVALID","Stair stepCount must be a positive integer and stepRun/stepRise must be finite and positive.","spatialOperation",a.id)),a.alignment!=="axisAligned"&&i.push(on("SPATIAL_ALIGNMENT_UNSUPPORTED","The certified stair mechanism currently supports only axisAligned placement.","spatialOperation",a.id))),a.kind==="opening"&&i.push(on("SPATIAL_OPERATION_UNSUPPORTED","Opening requires subtractive topology and has no certified mechanism family.","spatialOperation",a.id,"Use a supported paired operation or wait for a subtractive mechanism contract.")),a.target.kind==="generatedPair"&&(!a.target.operationId||!n.has(a.target.operationId))&&i.push(on("SPATIAL_TARGET_INVALID",`Operation ${a.id} references a missing generated pair.`,"spatialOperation",a.id)),a.kind==="shelf"&&a.target.kind!=="generatedPair"&&i.push(on("SPATIAL_TARGET_INVALID","A shelf must target an existing generated plane pair.","spatialOperation",a.id))}if(i.length>0)return U0(i);const s=Ou(t.operations,n);if(s.cycleId)return[on("SPATIAL_TARGET_CYCLE","Generated-pair targets must form an acyclic hierarchy.","spatialOperation",s.cycleId)];const r=[...s.depths.entries()].filter(([,a])=>a>jr.maximumModuleDepth).sort(([a],[o])=>a.localeCompare(o))[0];return r?[on("SPATIAL_TARGET_DEPTH_UNSUPPORTED","The spatial compiler supports only sheet to root to child.","spatialOperation",r[0],"Attach this operation to the sheet or a root operation.")]:[]}function Uu(t){const e=new Map(t.map(n=>[n.id,n]));return Ou(t,e).depths}function L0(t){const e=t?.sheet;return t?.schemaVersion===Nu&&typeof t.id=="string"&&t.id.length>0&&Array.isArray(t.operations)&&t.operations.length>0&&t.operations.length<=jr.maximumOperations&&t.operations.every(D0)&&Number.isInteger(t.pathSampleCount)&&t.pathSampleCount>=2&&t.pathSampleCount<=jr.maximumPathSampleCount&&typeof e?.id=="string"&&e.id.length>0&&[e.width,e.wallExtent,e.floorExtent].every(n=>Number.isFinite(n)&&n>0)&&Number.isFinite(e.deployedAngle)&&e.deployedAngle>0&&e.deployedAngle<Math.PI}function D0(t){return t!==null&&typeof t=="object"&&typeof t.id=="string"&&t.id.length>0&&Fu.includes(t.kind)&&(t.target?.kind==="sheet"||t.target?.kind==="generatedPair"&&typeof t.target.operationId=="string")&&(t.alignment==="axisAligned"||t.alignment==="allowRotated")&&jr.mismatchPolicies.includes(t.mismatchPolicy)&&(t.kind!=="stair"||Number.isInteger(t.stepCount)&&typeof t.stepRun=="number"&&typeof t.stepRise=="number")}function N0(t){return Number.isFinite(t.xOffset)&&[t.width,t.height,t.depth].every(e=>Number.isFinite(e)&&e>0)}function F0(t){const e=new Set;for(const n of t){if(e.has(n.id))return n.id;e.add(n.id)}}function Ou(t,e){const n=new Map,i=new Set;let s;const r=a=>{const o=n.get(a.id);if(o!==void 0)return o;if(i.has(a.id))return s=a.id,Number.POSITIVE_INFINITY;i.add(a.id);const c=a.target.kind==="sheet"?1:1+r(e.get(a.target.operationId));return i.delete(a.id),n.set(a.id,c),c};for(const a of[...t].sort(ku)){if(s)break;r(a)}return{depths:n,...s===void 0?{}:{cycleId:s}}}function ku(t,e){return t.id.localeCompare(e.id)}function U0(t){return[...t].sort((e,n)=>(e.entities[0]?.id??"").localeCompare(n.entities[0]?.id??"")||e.code.localeCompare(n.code))}function on(t,e,n,i,s){return{severity:"error",category:new Set(["SPATIAL_OPERATION_UNSUPPORTED","SPATIAL_TARGET_DEPTH_UNSUPPORTED","SPATIAL_ALIGNMENT_UNSUPPORTED"]).has(t)?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}],...s===void 0?{}:{suggestion:s}}}function Bu(t){const e=I0(t);if(e.length>0)return Xn(O0(t),e);const n=[],i=[];for(const d of t.operations){const f=k0(d,t.sheet.deployedAngle);f.ok?n.push(f.value):i.push(f.diagnostic)}if(i.length>0)return Xn(t.operations,_s(i));const s=Uu(t.operations);n.sort((d,f)=>s.get(d.operation.id)-s.get(f.operation.id)||d.operation.id.localeCompare(f.operation.id));const r={...t,operations:n.map(({operation:d,resolved:f})=>({...d,xOffset:f.xOffset,width:f.width,height:f.height,depth:f.depth}))},a=B0(r),o=Tc(a);if(o.length>0)return Xn(t.operations,_s(o));const c=Lu(a);if(!c.ok)return Xn(t.operations,_s(c.diagnostics));const l=new Map(n.map(({operation:d})=>[Vs(d.id),d.alignment])),u=M0(a,r.pathSampleCount,l);if(!u.ok)return Xn(t.operations,_s(u.diagnostics));if(u.path.evidence.classification==="invalid")return Xn(t.operations,_s(u.path.diagnostics));const h=n.find(({operation:d})=>d.kind==="stair");if(h){const d=h.operation,f=_c({operationId:d.id,width:d.width,stepCount:d.stepCount,stepRun:d.stepRun,stepRise:d.stepRise,hostWidth:t.sheet.width,hostFloorExtent:t.sheet.floorExtent,hostWallExtent:t.sheet.wallExtent});if(!f.ok)return Xn(t.operations,f.diagnostics);const p=vc({input:{operationId:d.id,width:d.width,stepCount:d.stepCount,stepRun:d.stepRun,stepRise:d.stepRise,hostWidth:t.sheet.width,hostFloorExtent:t.sheet.floorExtent,hostWallExtent:t.sheet.wallExtent},complex:f.complex,sourceMap:f.sourceMap,sampleCount:r.pathSampleCount});return p.ok?{ok:!0,mechanism:"stair",normalizedProgram:r,assembly:a,compiledAssembly:c.assembly,path:u.path,decisions:n.map(Al).sort(wl),traces:Tl(n,c.assembly),stair:{complex:f.complex,sourceMap:f.sourceMap,path:p}}:Xn(t.operations,p.diagnostics)}return{ok:!0,mechanism:"paired",normalizedProgram:r,assembly:a,compiledAssembly:c.assembly,path:u.path,decisions:n.map(Al).sort(wl),traces:Tl(n,c.assembly)}}function O0(t){return Array.isArray(t?.operations)?t.operations.filter(e=>e!==null&&typeof e=="object"&&typeof e.id=="string"&&e.id.length>0&&Fu.includes(e.kind)):[]}function k0(t,e){if(t.alignment==="axisAligned"&&Math.abs(e-Math.PI/2)>Ze.absoluteAngle)return{ok:!1,diagnostic:z0("SPATIAL_ALIGNMENT_UNSUPPORTED","Axis-aligned spatial compilation is bounded to the orthogonal deployed base case.",t.id,"Use a pi/2 deployed angle or request allowRotated.")};let n=t.height,i=t.depth,s=!1;return t.alignment==="axisAligned"&&n!==i&&t.mismatchPolicy!=="reject"&&(s=!0,t.mismatchPolicy==="preserveHeight"?i=n:n=i),{ok:!0,value:{operation:t,resolved:{xOffset:t.xOffset,width:t.width,height:n,depth:i,alignment:t.alignment},constrained:s}}}function B0(t){return{id:`spatial-assembly:${t.id}`,sheet:{...t.sheet},nodes:t.operations.map(e=>({id:Vs(e.id),parameters:{width:e.width,height:e.height,depth:e.depth,deployedAngle:t.sheet.deployedAngle,linkage:e.alignment==="axisAligned"?"parallelogram":"reflected"},attachment:e.target.kind==="sheet"?{kind:"sheet",xOffset:e.xOffset}:{kind:"generatedPair",parentNodeId:Vs(e.target.operationId),xOffset:e.xOffset}})),sharedPortConstraints:[]}}function Al(t){const{operation:e,resolved:n,constrained:i}=t;return{operationId:e.id,operationKind:e.kind,status:i?"constrained":"accepted",message:i?"Dimensions were projected under the declared mismatch policy.":`${e.kind} compiled as a paired two-plane mechanism.`,requested:Vu(e),resolved:n,constraintIds:i?["axis-aligned-equal-links",`policy:${e.mismatchPolicy}`]:[e.alignment==="axisAligned"?"axis-aligned-parallelogram":"general-two-plane-linkage"]}}function Xn(t,e){return{ok:!1,diagnostics:e,decisions:[...t].sort((n,i)=>n.id.localeCompare(i.id)).map(n=>{const i=e.filter(r=>V0(r,n.id)),s=i.map(r=>r.code);return{operationId:n.id,operationKind:n.kind,status:"rejected",message:i[0]?.message??"The atomic spatial program was rejected because another operation failed.",requested:Vu(n),constraintIds:s.length>0?s:["atomic-program-admissibility"]}})}}function V0(t,e){return t.entities.some(n=>n.id===e||n.id===Vs(e))}function Vu(t){return{target:t.target,xOffset:t.xOffset,width:t.width,height:t.height,depth:t.depth,alignment:t.alignment,mismatchPolicy:t.mismatchPolicy}}function Tl(t,e){const n=new Map(e.sourceMap.nodes.map(i=>[i.nodeId,i]));return t.map(({operation:i})=>{const s=Vs(i.id),r=n.get(s);return{operationId:i.id,operationKind:i.kind,nodeId:s,faceIds:r.faceIds,edgeIds:r.edgeIds}}).sort((i,s)=>i.operationId.localeCompare(s.operationId))}function Vs(t){return`spatial-node:${t}`}function wl(t,e){return t.operationId.localeCompare(e.operationId)}function _s(t){return[...t].sort((e,n)=>(e.entities[0]?.id??"").localeCompare(n.entities[0]?.id??"")||e.code.localeCompare(n.code))}function z0(t,e,n,i){return{severity:"error",category:t==="SPATIAL_ALIGNMENT_UNSUPPORTED"?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}],suggestion:i}}const H0=1;function zu(t){return j0(t)?{ok:!0,example:t}:{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Validation examples require schema version 1, metadata, finite tolerance, typed input, and expected output.",locations:[{kind:"entity",entity:{kind:"validationExample",id:Pl(t)}}],entities:[{kind:"validationExample",id:Pl(t)}]}]}}function G0(t){switch(t.kind){case"singleHinge":return $0(t);case"singleVertex":return W0(t);case"twoPlanePopUp":return X0(t);case"spatialProgram":return q0(t)}}function $0(t){const e=Mc(t.input.assignment),n=Eu({complex:e,hingeEdgeId:"hinge",parentFaceId:"left",parentPose:tn(),angle:t.input.angle,stateId:`validation:${t.id}`}),i=[Rt("solution-status","kernelContract",t.expected.ok,n.ok)],s=n.ok?[]:[...n.diagnostics];if(!n.ok)return i.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],n.diagnostics.map(o=>o.code))),ii(t,i,s,{disposition:"rejected"});const r=n.state.facePoses.find(o=>o.faceId===n.childFaceId),a=ht(r.transform,[2,0,0]);return t.expected.childPoint&&(i.push(Qr("canonical-child-trajectory","independentOracle",t.expected.childPoint,a,t.tolerance)),i.push(Qr("closed-form-child-trajectory","independentOracle",[1+Math.cos(t.input.angle),0,-Math.sin(t.input.angle)],a,t.tolerance))),i.push(Rt("evidence-classification","kernelContract",t.expected.classification,n.certificate.classification)),ii(t,i,s,{disposition:"accepted",classification:n.certificate.classification})}function W0(t){const e=gc(t.input.sectorAngles,t.input.assignments,t.tolerance),n=J0(t.input.sectorAngles,t.input.assignments,t.tolerance),i=[Rt("oracle-kawasaki","independentOracle",t.expected.kawasaki,n.kawasaki),Rt("oracle-maekawa","independentOracle",t.expected.maekawa,n.maekawa),Rt("kernel-kawasaki","kernelContract",t.expected.kawasaki,e.kawasaki.status),Rt("kernel-maekawa","kernelContract",t.expected.maekawa,e.maekawa.status),Rt("local-flat-foldability","kernelContract",t.expected.locallyFlatFoldable,e.locallyFlatFoldable)],s=[],r=[{kind:"vertex",id:"vertex:center"},...t.input.sectorAngles.map((a,o)=>({kind:"sectorRay",id:`sectorRay:${o}`}))];return e.kawasaki.status!=="satisfied"&&s.push(Us({severity:"error",category:"kinematics",code:"KINEMATICS_KAWASAKI_FAILED",message:"The single vertex does not satisfy Kawasaki's alternating-sector condition.",locations:[...r.map(a=>({kind:"entity",entity:a})),{kind:"parameter",path:["input","sectorAngles"]}]})),e.maekawa.status!=="satisfied"&&s.push(Us({severity:"error",category:"kinematics",code:"KINEMATICS_MAEKAWA_FAILED",message:"The single vertex does not satisfy Maekawa's mountain-valley count.",locations:[...r.map(a=>({kind:"entity",entity:a})),{kind:"parameter",path:["input","assignments"]}]})),ii(t,i,s,{disposition:e.locallyFlatFoldable?"accepted":"rejected"})}function X0(t){const e=K0(t.input),n=ha(e,e.deployedAngle),i=[Rt("solution-status","kernelContract",t.expected.ok,n.ok)],s=n.ok?[]:[...n.diagnostics];if(!n.ok)return i.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],n.diagnostics.map(o=>o.code))),ii(t,i,s,{disposition:"rejected"});const r=Z0(e);i.push(Qr("reflection-oracle","independentOracle",r,n.state.points.junction,t.tolerance)),t.expected.deployedJunction&&i.push(Qr("expected-deployed-junction","independentOracle",t.expected.deployedJunction,n.state.points.junction,t.tolerance)),i.push(Rl("floor-link-length","independentOracle",e.depth,et(Xe(n.state.points.junction,n.state.points.floorAnchor)),t.tolerance),Rl("wall-link-length","independentOracle",e.height,et(Xe(n.state.points.junction,n.state.points.wallAnchor)),t.tolerance),Rt("axis-alignment","kernelContract",t.expected.axisAligned,n.state.axisAligned));const a=Ac(e,t.input.sampleCount);return i.push(Rt("path-classification","kernelContract",t.expected.classification,a.ok?a.path.certificate.classification:void 0)),a.ok?ii(t,i,s,{disposition:"accepted",classification:a.path.certificate.classification}):ii(t,i,a.diagnostics,{disposition:"rejected"})}function q0(t){const e=Bu(t.input),n=[Rt("compilation-status","kernelContract",t.expected.ok,e.ok)];if(!e.ok)return n.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],e.diagnostics.map(s=>s.code))),ii(t,n,[...e.diagnostics],{disposition:e.diagnostics.some(s=>s.category==="unsupported")?"unsupported":"rejected"});n.push(Rt("path-classification","kernelContract",t.expected.classification,e.path.evidence.classification),Rt("canonical-topology","artifactIntegrity",[],Ci(e.compiledAssembly.complex).map(s=>s.code)),Rt("complete-source-traces","artifactIntegrity",!0,e.traces.every(s=>s.faceIds.length>0&&s.edgeIds.length>0)));const i=Y0(e);return n.push(Rt("simulator-job-readiness","artifactIntegrity",!0,i!==void 0)),ii(t,n,[],{disposition:"accepted",classification:e.path.evidence.classification},i)}function Y0(t){const e=t.compiledAssembly,n=L_(e,{foldPercent:1,axialStiffness:20,faceStiffness:.2,creaseStiffness:.7,calculateFaceStrain:!0}),i=z_(e,Il,tx),s=F_(e,Il,{timestep:1/240,substeps:20,errorReductionParameter:.1,gravity:0,linearDamping:.05,angularDamping:.05,springStiffness:100,torqueStiffness:100,forceDamping:50,torqueDamping:2,filterConnectedCollisions:!0,maximumSteps:720});if(!(!n.ok||!i.ok||!s.ok))return{fold:Su(e.complex),svg:k_(e.complex),evidence:t.path.evidence,sourceTraces:t.traces,origamiSimulatorJob:n.job,swompsJob:i.job,pyKirigamiJob:s.job}}function K0(t){return{id:t.id,width:t.width,height:t.height,depth:t.depth,deployedAngle:t.deployedAngle}}function Z0(t){const e=t.deployedAngle,n=[0,t.depth,0],i=[0,t.height*Math.cos(e),t.height*Math.sin(e)],s=t.depth**2+t.height**2-2*t.depth*t.height*Math.cos(e),r=t.depth*(t.depth-t.height*Math.cos(e))/s;return[0,2*(n[1]+r*(i[1]-n[1])),2*(n[2]+r*(i[2]-n[2]))]}function J0(t,e,n){const i=t.length%2===0,s=t.filter((h,d)=>d%2===0).reduce((h,d)=>h+d,0),r=t.filter((h,d)=>d%2===1).reduce((h,d)=>h+d,0),a=i&&Math.abs(s-Math.PI)<=n&&Math.abs(r-Math.PI)<=n?"satisfied":"failed",o=e.every(h=>h==="mountain"||h==="valley"),c=e.filter(h=>h==="mountain").length,l=e.filter(h=>h==="valley").length,u=o?Math.abs(c-l)===2?"satisfied":"failed":"notApplicable";return{kawasaki:a,maekawa:u}}function ii(t,e,n,i,s){return{exampleId:t.id,title:t.title,kind:t.kind,status:e.every(r=>r.passed)?"passed":"failed",observed:i,checks:e,diagnostics:n,...s===void 0?{}:{artifacts:s}}}function Rt(t,e,n,i){return{id:t,method:e,passed:JSON.stringify(n)===JSON.stringify(i),expected:n,actual:i}}function Rl(t,e,n,i,s){const r=Math.abs(i-n);return{id:t,method:e,passed:r<=s,expected:n,actual:i,residual:r,tolerance:s}}function Qr(t,e,n,i,s){const r=Math.max(...n.map((a,o)=>Math.abs(a-i[o])));return{id:t,method:e,passed:r<=s,expected:n,actual:i,residual:r,tolerance:s}}function j0(t){return Si(t)?t.schemaVersion===H0&&mi(t.id)&&mi(t.title)&&["valid","boundary","invalid","unsupported"].includes(String(t.fixtureClass))&&["singleHinge","singleVertex","twoPlanePopUp","spatialProgram"].includes(String(t.kind))&&mi(t.mechanismFamily)&&t.units==="meter-radian"&&Array.isArray(t.assumptions)&&t.assumptions.every(mi)&&mi(t.provenance)&&Number.isFinite(t.tolerance)&&Number(t.tolerance)>=0&&Si(t.input)&&Si(t.expected)&&Q0(t):!1}function Q0(t){const e=t.input,n=t.expected;return!Si(e)||!Si(n)||typeof n.ok=="string"?!1:t.kind==="singleHinge"?["mountain","valley"].includes(String(e.assignment))&&Number.isFinite(e.angle)&&typeof n.ok=="boolean"&&Cl(n.childPoint)&&ba(n.diagnosticCodes):t.kind==="singleVertex"?ex(e.sectorAngles)&&Array.isArray(e.assignments)&&e.assignments.every(i=>["mountain","valley","unassigned"].includes(String(i)))&&e.sectorAngles.length===e.assignments.length&&Si(e.paper)&&Number.isFinite(e.paper.width)&&Number(e.paper.width)>0&&Number.isFinite(e.paper.height)&&Number(e.paper.height)>0&&Array.isArray(e.paper.center)&&e.paper.center.length===2&&e.paper.center.every(i=>Number.isFinite(i))&&["satisfied","failed"].includes(String(n.kawasaki))&&["satisfied","failed","notApplicable"].includes(String(n.maekawa))&&typeof n.locallyFlatFoldable=="boolean":t.kind==="twoPlanePopUp"?mi(e.id)&&[e.width,e.height,e.depth,e.deployedAngle].every(Number.isFinite)&&Number.isInteger(e.sampleCount)&&typeof n.ok=="boolean"&&Cl(n.deployedJunction)&&ba(n.diagnosticCodes):t.kind==="spatialProgram"&&typeof n.ok=="boolean"&&ba(n.diagnosticCodes)}function ex(t){return Array.isArray(t)&&t.every(Number.isFinite)}function Cl(t){return t===void 0||Array.isArray(t)&&t.length===3&&t.every(Number.isFinite)}function ba(t){return t===void 0||Array.isArray(t)&&t.every(e=>typeof e=="string")}function Si(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)}function mi(t){return typeof t=="string"&&t.length>0}function Pl(t){return Si(t)&&mi(t.id)?t.id:"unknown"}const Il={id:"validation-cardstock",material:{id:"validation-paper",density:700,youngModulus:25e8,poissonRatio:.3},panelThickness:3e-4,crease:{model:"concentratedHinge",rotationalStiffness:.02},contact:{mode:"coulomb",clearance:1e-4,collisionMargin:2e-5,frictionCoefficient:.4,restitution:0}},tx={id:"validation-laser",kerf:15e-5,lengthTolerance:5e-5,angleTolerance:Math.PI/360,minimumFeatureWidth:5e-4,minimumBridgeWidth:.001,nominalCreaseWidth:3e-4},Qt=1e-9;function nx(t){const e=new Map;for(const n of t){const i=sx(n),s=e.get(i.key)??{plane:i,faces:[]};s.faces.push(n),e.set(i.key,s)}return[...e.entries()].sort(([n],[i])=>n.localeCompare(i)).flatMap(([,n],i)=>ix(n.plane,n.faces,i)).sort(dx)}function ix(t,e,n){if(e.length<2)return e;const[i,s]=rx(t.normal),r=e.map(l=>ax(l,i,s));if(!ox(r))return e;const a=Ll(r.flatMap(l=>[l.uMinimum,l.uMaximum])),o=Ll(r.flatMap(l=>[l.vMinimum,l.vMaximum])),c=[];for(let l=0;l<a.length-1;l+=1)for(let u=0;u<o.length-1;u+=1){const h=a[l],d=a[l+1],f=o[u],p=o[u+1];if(d-h<=Qt||p-f<=Qt)continue;const _=(h+d)/2,m=(f+p)/2,g=r.filter(w=>_>w.uMinimum-Qt&&_<w.uMaximum+Qt&&m>w.vMinimum-Qt&&m<w.vMaximum+Qt);if(g.length===0)continue;const A=[...new Set(g.flatMap(({face:w})=>w.sourceOperationId===void 0?[]:[w.sourceOperationId]))];c.push({id:`coalesced-face:${n}:${l}:${u}`,vertices:[rr(t,i,s,h,f),rr(t,i,s,d,f),rr(t,i,s,d,p),rr(t,i,s,h,p)],sourceEntities:cx(g.flatMap(({face:w})=>w.sourceEntities)),...A.length===1?{sourceOperationId:A[0]}:{}})}return c}function sx(t){const e=mo(t.vertices[1],t.vertices[0]),n=mo(t.vertices[2],t.vertices[0]);let i=go(Hu(e,n));const s=i.findIndex(a=>Math.abs(a)>Qt);s>=0&&i[s]<0&&(i=es(i,-1));const r=ts(i,t.vertices[0]);return{normal:i,offset:r,key:[...i,r].map(a=>lx(a)).join(":")}}function rx(t){const n=[...[[1,0,0],[0,1,0],[0,0,1]]].sort((s,r)=>Math.abs(ts(s,t))-Math.abs(ts(r,t)))[0],i=go(mo(n,es(t,ts(n,t))));return[i,go(Hu(t,i))]}function ax(t,e,n){const i=t.vertices.map(r=>ts(r,e)),s=t.vertices.map(r=>ts(r,n));return{face:t,uMinimum:Math.min(...i),uMaximum:Math.max(...i),vMinimum:Math.min(...s),vMaximum:Math.max(...s)}}function ox(t){for(let e=0;e<t.length;e+=1)for(let n=e+1;n<t.length;n+=1){const i=t[e],s=t[n];if(Math.min(i.uMaximum,s.uMaximum)-Math.max(i.uMinimum,s.uMinimum)>Qt&&Math.min(i.vMaximum,s.vMaximum)-Math.max(i.vMinimum,s.vMinimum)>Qt)return!0}return!1}function rr(t,e,n,i,s){return Dl(Dl(es(e,i),es(n,s)),es(t.normal,t.offset))}function Ll(t){const e=[];for(const n of[...t].sort((i,s)=>i-s))(e.length===0||Math.abs(n-e[e.length-1])>Qt)&&e.push(n);return e}function cx(t){return[...new Map([...t].sort((e,n)=>`${e.kind}\0${e.id}`.localeCompare(`${n.kind}\0${n.id}`)).map(e=>[`${e.kind}\0${e.id}`,e])).values()]}function Dl(t,e){return t.map((n,i)=>n+e[i])}function mo(t,e){return t.map((n,i)=>n-e[i])}function es(t,e){return t.map(n=>n*e)}function Hu(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function ts(t,e){return t.reduce((n,i,s)=>n+i*e[s],0)}function go(t){const e=Math.hypot(...t);if(!Number.isFinite(e)||e<=Qt)throw new RangeError("Paper face requires a finite nonzero normal.");return es(t,1/e)}function lx(t){return(Math.round(t/Qt)*Qt).toFixed(9)}function dx(t,e){return t.id.localeCompare(e.id)}function Gu(t,e,n){if(!Number.isFinite(n.width)||!Number.isFinite(n.height)||n.width<=0||n.height<=0||n.center.length!==2||!n.center.every(Number.isFinite)||t.length===0||t.length!==e.length)throw new RangeError("Single-vertex paper input is not finite and bounded.");const[i,s]=n.center,r=[i,s,0],a=ux(n),o=2*(n.width+n.height);let c=0;const l=t.map(f=>{const p=hx(c,n);return c+=f,p}),u=[{id:"vertex:center",position:r,role:"vertex",sourceEntities:[{kind:"vertex",id:"vertex:center"}]},...a.map((f,p)=>({id:`paper:corner:${p}`,position:f.position,role:"vertex",sourceEntities:[{kind:"paperBoundary",id:`paper:corner:${p}`}]})),...l.map((f,p)=>({id:`vertex:ray:${p}`,position:f.position,role:"vertex",sourceEntities:[{kind:"sectorRay",id:`sectorRay:${p}`}]}))],h=[...a.map((f,p)=>({id:`paper:boundary:${p}`,start:f.position,end:a[(p+1)%a.length].position,role:"boundary",sourceEntities:[{kind:"paperBoundary",id:`paper:boundary:${p}`}]})),...l.map((f,p)=>({id:`crease:${p}`,start:r,end:f.position,role:px(e[p]),sourceEntities:[{kind:"sectorRay",id:`sectorRay:${p}`}]}))],d=l.map((f,p)=>{const _=l[(p+1)%l.length],m=Nl(f.perimeter,_.perimeter,o),g=a.map(A=>({corner:A,distance:Nl(f.perimeter,A.perimeter,o)})).filter(A=>A.distance>1e-12&&A.distance<m-1e-12).sort((A,w)=>A.distance-w.distance).map(A=>A.corner.position);return{id:`paper:sector:${p}`,vertices:[r,f.position,...g,_.position],sourceEntities:[{kind:"singleVertexFace",id:`singleVertexFace:${p}`}]}});return{points:u.sort(Aa),segments:h.sort(Aa),faces:d.sort(Aa)}}function ux(t){const[e,n]=t.center,i=e-t.width/2,s=e+t.width/2,r=n-t.height/2,a=n+t.height/2;return[{position:[i,r,0],perimeter:0},{position:[s,r,0],perimeter:t.width},{position:[s,a,0],perimeter:t.width+t.height},{position:[i,a,0],perimeter:2*t.width+t.height}]}function hx(t,e){const[n,i]=e.center,s=Math.cos(t),r=Math.sin(t),a=e.width/2,o=e.height/2,c=Math.abs(s)<1e-14?Number.POSITIVE_INFINITY:a/Math.abs(s),l=Math.abs(r)<1e-14?Number.POSITIVE_INFINITY:o/Math.abs(r),u=Math.min(c,l),h=n+s*u,d=i+r*u;return{position:[h,d,0],perimeter:fx(h,d,e)}}function fx(t,e,n){const[i,s]=n.center,r=i-n.width/2,a=i+n.width/2,o=s-n.height/2,c=s+n.height/2,l=1e-9;return Math.abs(e-o)<=l?t-r:Math.abs(t-a)<=l?n.width+(e-o):Math.abs(e-c)<=l?n.width+n.height+(a-t):2*n.width+n.height+(c-e)}function Nl(t,e,n){const i=(e-t+n)%n;return i<=1e-12?n:i}function px(t){return t==="mountain"?"hingeMountain":t==="valley"?"hingeValley":"hingeUnassigned"}function Aa(t,e){return t.id.localeCompare(e.id)}function $u(t,e){if(!Number.isFinite(e.width)||e.width<=0)return{points:[],segments:[],faces:[]};const n=t.frames.parentFloor.widthAxis,i=[["origin",t.points.origin],["floor-anchor",t.points.floorAnchor],["junction",t.points.junction],["wall-anchor",t.points.wallAnchor]],s=[["parent-floor",t.points.origin,t.points.floorAnchor],["child-wall",t.points.floorAnchor,t.points.junction],["child-floor",t.points.junction,t.points.wallAnchor],["parent-wall",t.points.wallAnchor,t.points.origin]],r=(e.diagnosticSpans??[]).map(u=>({...u,minimum:Math.max(0,Math.min(e.width,u.minimum)),maximum:Math.max(0,Math.min(e.width,u.maximum))})).filter(u=>u.maximum>u.minimum),a=[...new Set([0,e.width,...r.flatMap(u=>[u.minimum,u.maximum])])].sort((u,h)=>u-h),o=i.flatMap(([u,h])=>a.map((d,f)=>({id:`panel-point:${u}:${f}`,position:Pn(h,n,d),role:"vertex",sourceEntities:[...e.sourceEntities,{kind:"twoPlanePoint",id:`${t.id}:${u}`}]}))),c=[...i.flatMap(([u,h])=>Fl(a).map(([d,f],p)=>({id:`panel-hinge:${u}:${p}`,start:Pn(h,n,d),end:Pn(h,n,f),role:"hingeUnassigned",sourceEntities:[...e.sourceEntities,{kind:"twoPlaneHinge",id:`${t.id}:${u}`},...Ul(r,d,f)]}))),...[0,e.width].flatMap((u,h)=>s.map(([d,f,p])=>({id:`panel-boundary:${h}:${d}`,start:Pn(f,n,u),end:Pn(p,n,u),role:"boundary",sourceEntities:[...e.sourceEntities,{kind:"twoPlanePanel",id:`${t.id}:${d}`}]})))],l=s.flatMap(([u,h,d])=>Fl(a).map(([f,p],_)=>({id:`panel-face:${u}:${_}`,vertices:[Pn(h,n,f),Pn(d,n,f),Pn(d,n,p),Pn(h,n,p)],sourceEntities:[...e.sourceEntities,{kind:"twoPlanePanel",id:`${t.id}:${u}`},...Ul(r,f,p)]})));return{points:o.sort(Ta),segments:c.sort(Ta),faces:l.sort(Ta)}}function Pn(t,e,n){return Ft(t,St(e,n))}function Fl(t){return t.slice(0,-1).map((e,n)=>[e,t[n+1]])}function Ul(t,e,n){const i=(e+n)/2;return mx(t.filter(s=>i>s.minimum&&i<s.maximum).flatMap(s=>s.sourceEntities))}function mx(t){return[...new Map(t.map(e=>[`${e.kind}\0${e.id}`,e])).values()]}function Ta(t,e){return t.id.localeCompare(e.id)}function gx(t,e){const n=_x(t),i=[...n.points],s=[...n.segments],r=[...n.faces],a=Ec(t.sheet,t.sheet.deployedAngle),o=Uu(t.operations),c=Mx(t.operations),l=new Map,u=[...t.operations].sort((h,d)=>(o.get(h.id)??Number.POSITIVE_INFINITY)-(o.get(d.id)??Number.POSITIVE_INFINITY)||h.id.localeCompare(d.id));for(const h of u){const d=h.target.kind==="sheet"?a:l.get(h.target.operationId)?.outputPort;if(!d)continue;if(h.kind==="opening"){xx(i,s,h,d);continue}const f=ha({id:`authoring:${h.id}`,width:h.width,height:h.height,depth:h.depth,deployedAngle:t.sheet.deployedAngle},t.sheet.deployedAngle);if(!f.ok)continue;const p=Ru(f.state,d,h.xOffset),_=c.get(h.id);if(!_)continue;const m=[{kind:"spatialOperation",id:h.id},{kind:"popUpNode",id:`spatial-node:${h.id}`}],g=$u(p,{width:h.width,sourceEntities:m,diagnosticSpans:vx(t,h,c,e)});yx(i,s,r,h.id,g),l.set(h.id,{operation:h,state:p,globalInterval:_,outputPort:wu({id:h.id,width:h.width,height:h.height,depth:h.depth,deployedAngle:t.sheet.deployedAngle},p,`spatial-node:${h.id}`)})}return{points:i.sort(kl),segments:s.sort(kl),faces:nx(r)}}function _x(t){const e=Ec(t.sheet,t.sheet.deployedAngle),n=e.origin,i=e.boundary.end,s=Ft(n,St(e.floor.frame.inPlaneAxis,e.floor.extent)),r=Ft(i,St(e.floor.frame.inPlaneAxis,e.floor.extent)),a=Ft(n,St(e.wall.frame.inPlaneAxis,e.wall.extent)),o=Ft(i,St(e.wall.frame.inPlaneAxis,e.wall.extent)),c=[{kind:"spatialProgram",id:t.id},{kind:"sheet",id:t.sheet.id}],l=[...c,{kind:"sheetSurface",id:`${t.sheet.id}:floor`}],u=[...c,{kind:"sheetSurface",id:`${t.sheet.id}:wall`}];return{points:[pi("sheet:hinge:start",n,c),pi("sheet:hinge:end",i,c),pi("sheet:floor:start",s,l),pi("sheet:floor:end",r,l),pi("sheet:wall:start",a,u),pi("sheet:wall:end",o,u)],segments:[un("sheet:hinge",n,i,"hingeUnassigned",c),un("sheet:floor:left",n,s,"boundary",l),un("sheet:floor:outer",s,r,"boundary",l),un("sheet:floor:right",r,i,"boundary",l),un("sheet:wall:left",n,a,"boundary",u),un("sheet:wall:outer",a,o,"boundary",u),un("sheet:wall:right",o,i,"boundary",u)],faces:[{id:"sheet:floor",vertices:[n,i,r,s],sourceEntities:l},{id:"sheet:wall",vertices:[n,a,o,i],sourceEntities:u}]}}function xx(t,e,n,i){const s=Ft(i.origin,St(i.widthAxis,n.xOffset)),r=Ft(s,St(i.widthAxis,n.width)),a=Ft(s,St(i.wall.frame.inPlaneAxis,n.height)),o=Ft(r,St(i.wall.frame.inPlaneAxis,n.height)),c=[{kind:"spatialOperation",id:n.id}],l=[["lower-start",s],["lower-end",r],["upper-end",o],["upper-start",a]];t.push(...l.map(([u,h])=>pi(`opening:${n.id}:${u}`,h,c))),e.push(un(`opening:${n.id}:bottom`,s,r,"cut",c),un(`opening:${n.id}:right`,r,o,"cut",c),un(`opening:${n.id}:top`,o,a,"cut",c),un(`opening:${n.id}:left`,a,s,"cut",c))}function vx(t,e,n,i){const s=[],r=n.get(e.id);if(!r)return s;const a=i.flatMap(c=>c.locations.flatMap(l=>l.kind==="entity"?[l.entity]:[]));for(const c of t.operations){if(c.id===e.id||Ol(c)!==Ol(e))continue;const l=Au(`spatial-node:${e.id}`,`spatial-node:${c.id}`),u=a.find(p=>p.kind==="overlapRegion"&&p.id===l),h=n.get(c.id);if(!u||!h)continue;const d=Math.max(r[0],h[0]),f=Math.min(r[1],h[1]);f>d&&s.push({minimum:d-r[0],maximum:f-r[0],sourceEntities:[u]})}const o=a.find(c=>c.kind==="outOfBoundsRegion"&&c.id===Tu(`spatial-node:${e.id}`));if(o){const c=e.target.kind==="generatedPair"?e.target.operationId:void 0,l=c===void 0?t.sheet.width:t.operations.find(u=>u.id===c)?.width;l!==void 0&&(e.xOffset<0&&s.push({minimum:0,maximum:Math.min(e.width,-e.xOffset),sourceEntities:[o]}),e.xOffset+e.width>l&&s.push({minimum:Math.max(0,l-e.xOffset),maximum:e.width,sourceEntities:[o]}))}return s}function Mx(t){const e=new Map(t.map(s=>[s.id,s])),n=new Map,i=s=>{const r=n.get(s.id);if(r)return r;const a=s.target.kind==="sheet"?s.xOffset:i(e.get(s.target.operationId)).at(0)+s.xOffset,o=[a,a+s.width];return n.set(s.id,o),o};for(const s of t)i(s);return n}function yx(t,e,n,i,s){const r=`operation:${i}:`;t.push(...s.points.map(a=>({...a,id:`${r}${a.id}`}))),e.push(...s.segments.map(a=>({...a,id:`${r}${a.id}`}))),n.push(...s.faces.map(a=>({...a,id:`${r}${a.id}`,sourceOperationId:i})))}function Ol(t){return t.target.kind==="sheet"?"sheet":`operation:${t.target.operationId}`}function pi(t,e,n){return{id:t,position:e,role:"vertex",sourceEntities:n}}function un(t,e,n,i,s){return{id:t,start:e,end:n,role:i,sourceEntities:s}}function kl(t,e){return t.id.localeCompare(e.id)}function Sx(t){const e=G0(t),n=Ex(t,e).sort((s,r)=>s.parameter-r.parameter),i=e.observed.disposition==="accepted"?void 0:Ix(t,e.diagnostics);return{example:t,result:e,frames:n,...i===void 0?{}:{diagnosticPreview:i}}}function Ex(t,e){switch(t.kind){case"singleHinge":return bx(t,e);case"singleVertex":return e.observed.disposition==="accepted"?[{parameter:0,frame:Gu(t.input.sectorAngles,t.input.assignments,t.input.paper)}]:[];case"twoPlanePopUp":return Ax(t,e);case"spatialProgram":return Tx(t,e)}}function bx(t,e){if(e.observed.disposition!=="accepted")return[];const n=Mc(t.input.assignment),i=Eu({complex:n,hingeEdgeId:"hinge",parentFaceId:"left",parentPose:tn(),angle:t.input.angle,stateId:`validation:${t.id}`});return i.ok?[{parameter:t.input.angle,frame:Pi(n,wx(i.state))}]:[]}function Ax(t,e){if(e.observed.disposition!=="accepted")return[];const n=Ac(Px(t.input),t.input.sampleCount);return n.ok?n.path.samples.map(i=>({parameter:i.parentAngle,frame:$u(i,{width:t.input.width,sourceEntities:[{kind:"twoPlanePopUp",id:i.id}]})})):[]}function Tx(t,e){if(e.observed.disposition!=="accepted")return[];const n=Bu(t.input);if(!n.ok)return[];const i=[...n.path.samples].sort((r,a)=>a.parentAngle-r.parentAngle)[0],s=new Map(n.traces.flatMap(r=>r.faceIds.map(a=>[a,r.operationId])));return n.path.samples.map(r=>({parameter:r.parentAngle,frame:Pi(n.compiledAssembly.complex,bu(n.compiledAssembly,i,r),s)}))}function wx(t){return new Map(t.facePoses.map(({faceId:e,transform:n})=>[e,n]))}function Pi(t,e,n=new Map,i){const s=new Map(t.vertices.map(p=>[p.id,p])),r=new Map(t.halfEdges.map(p=>[p.id,p])),a=p=>!0,o=new Map;for(const p of[...t.halfEdges].sort(xs))a(p.face),o.has(p.origin)||o.set(p.origin,p.face);const c=(p,_)=>{const m=s.get(p)?.position,g=e.get(_);if(!m||!g)throw new RangeError(`Missing topology transform for ${p}/${_}.`);return ht(g,[m[0],m[1],0])},l=t.edges.flatMap(p=>{const _=Cx(p);if(_===void 0)return[];const m=[...p.halfEdges].map(A=>r.get(A)).filter(A=>a(A.face)).sort(xs)[0];if(!m)return[];const g=r.get(m.next);return[{edge:p,halfEdge:m,next:g,role:_}]}),u=new Set(l.flatMap(({halfEdge:p,next:_})=>[p.origin,_.origin])),h=t.vertices.filter(p=>u.has(p.id)&&o.has(p.id)).map(p=>({id:p.id,position:c(p.id,o.get(p.id)),role:"vertex",sourceEntities:[{kind:"vertex",id:p.id}]})).sort(xs),d=l.map(({edge:p,halfEdge:_,next:m,role:g})=>({id:p.id,start:c(_.origin,_.face),end:c(m.origin,_.face),role:g,sourceEntities:[{kind:"edge",id:p.id}]})).sort(xs),f=t.faces.filter(p=>a(p.id)).map(p=>{const _=Rx(p.boundary,r),m=n.get(p.id),g=[{kind:"face",id:p.id},...m===void 0?[]:[{kind:"spatialOperation",id:m}]];return{id:p.id,vertices:_.map(A=>c(A.origin,p.id)),sourceEntities:g,...m===void 0?{}:{sourceOperationId:m}}}).sort(xs);return{points:h,segments:d,faces:f}}function Rx(t,e){const n=[];let i=e.get(t);for(;i&&(n.length===0||i.id!==t);)n.push(i),i=e.get(i.next);return n}function Cx(t){if(t.kind==="boundary")return"boundary";if(t.kind==="cutBank")return"cut";if(t.kind==="hinge")return t.hinge?.assignment==="mountain"?"hingeMountain":t.hinge?.assignment==="valley"?"hingeValley":"hingeUnassigned"}function Px(t){return{id:t.id,width:t.width,height:t.height,depth:t.depth,deployedAngle:t.deployedAngle}}function Ix(t,e){if(t.kind==="singleHinge"){const n=Mc(t.input.assignment);return{label:"input topology",frame:Pi(n,new Map(n.faces.map(i=>[i.id,tn()])))}}if(t.kind==="singleVertex")return{label:"input topology",frame:Gu(t.input.sectorAngles,t.input.assignments,t.input.paper)};if(t.kind==="twoPlanePopUp"){const n=Lx(t.input);return n===void 0?void 0:{label:"input topology",frame:n}}return{label:"authoring geometry",frame:gx(t.input,e)}}function Lx(t){if(![t.width,t.height,t.depth,t.deployedAngle].every(Number.isFinite))return;const n=[{kind:"twoPlanePopUp",id:t.id}],i=[0,0,0],s=[t.width,0,0],r=[0,t.depth,0],a=[0,Math.cos(t.deployedAngle)*t.height,Math.sin(t.deployedAngle)*t.height];return{points:[{id:"anchor:origin",position:i,role:"anchor",sourceEntities:n},{id:"anchor:width",position:s,role:"anchor",sourceEntities:n},{id:"anchor:floor",position:r,role:"anchor",sourceEntities:n},{id:"anchor:wall",position:a,role:"anchor",sourceEntities:n}],segments:[{id:"input:width",start:i,end:s,role:"link",sourceEntities:n},{id:"input:floor",start:i,end:r,role:"link",sourceEntities:n},{id:"input:wall",start:i,end:a,role:"link",sourceEntities:n}],faces:[]}}function xs(t,e){return t.id.localeCompare(e.id)}const Dx=Object.assign({"../../examples/validation/01-hinge-flat.json":qf,"../../examples/validation/02-hinge-intermediate.json":ap,"../../examples/validation/03-hinge-folded.json":vp,"../../examples/validation/04-hinge-assignment-invalid.json":Lp,"../../examples/validation/05-vertex-valid.json":Wp,"../../examples/validation/06-vertex-maekawa-invalid.json":sm,"../../examples/validation/07-popup-symmetric.json":_m,"../../examples/validation/08-popup-unequal.json":Pm,"../../examples/validation/09-popup-invalid.json":Gm,"../../examples/validation/10-spatial-root.json":ng,"../../examples/validation/11-spatial-nested-shelf.json":mg,"../../examples/validation/12-spatial-siblings.json":Rg,"../../examples/validation/13-spatial-overlap.json":zg,"../../examples/validation/14-spatial-depth.json":e_,"../../examples/validation/15-spatial-opening.json":f_,"../../examples/validation/16-spatial-out-of-bounds.json":T_}),ar=Object.entries(Dx).sort(([t],[e])=>t.localeCompare(e)).map(([t,e])=>{const n=zu(e);if(!n.ok)throw new TypeError(`${t}: ${n.diagnostics.map(i=>i.message).join(" ")}`);return{filename:t.slice(t.lastIndexOf("/")+1),example:n.example}});function Nx(t=new Worker(new URL("/kirigami/assets/engine-worker-BDyyA5rc.js",import.meta.url),{type:"module",name:"kirigami-engine-lab"})){let e=1,n=!1;const i=new Map,s=r=>{for(const a of i.values())a.reject(r);i.clear()};return t.onmessage=({data:r})=>{if(n||r===null||typeof r!="object"||!Number.isInteger(r.requestId))return;const a=i.get(r.requestId);a&&(i.delete(r.requestId),r.ok?a.resolve(r.subject):a.reject(new Error(r.message)))},t.onerror=r=>{s(new Error(r.message||"Engine worker failed."))},{evaluate(r){if(n)return Promise.reject(new Error("Engine Lab client is disposed."));const a=e;return e+=1,new Promise((o,c)=>{i.set(a,{resolve:o,reject:c}),t.postMessage({requestId:a,type:"evaluate",example:r})})},dispose(){n||(n=!0,s(new Error("Engine Lab client was disposed.")),t.onmessage=null,t.onerror=null,t.terminate())}}}function Fx(t){const e=[];return _o(t.input,["input"],e),e.sort((n,i)=>Bx(n.path,i.path))}function Ux(t,e,n){if(e[0]!=="input"||e.length<2||!Number.isFinite(n)||typeof Vx(t,e)!="number")return zx(t.id);const i=xo(t,e,n);return zu(i)}function _o(t,e,n){if(typeof t=="number"){const i=String(e[e.length-1]);if(i==="schemaVersion"||i==="tolerance")return;n.push({path:e,label:Ox(e),value:t,step:i==="sampleCount"||i==="pathSampleCount"?1:i.toLowerCase().includes("angle")?.01:Math.max(Math.abs(t)*.05,.01)});return}if(Array.isArray(t)){t.forEach((i,s)=>_o(i,[...e,s],n));return}if(!(t===null||typeof t!="object"))for(const i of Object.keys(t).sort())i==="schemaVersion"||i==="tolerance"||_o(t[i],[...e,i],n)}function Ox(t){const e=t.slice(1).map(n=>typeof n=="number"?String(n+1):kx(n));return e.slice(Math.max(e.length-3,0)).join(" · ")}function kx(t){const e=t.replace(/([a-z0-9])([A-Z])/g,"$1 $2");return e[0]?.toUpperCase()+e.slice(1)}function Bx(t,e){const n=Math.max(t.length,e.length);for(let i=0;i<n;i+=1){const s=t[i],r=e[i];if(s===void 0)return-1;if(r===void 0)return 1;if(s!==r)return typeof s=="number"&&typeof r=="number"?s-r:String(s).localeCompare(String(r))}return 0}function Vx(t,e){let n=t;for(const i of e){if(n===null||typeof n!="object")return;n=n[i]}return n}function xo(t,e,n){if(e.length===0)return n;const[i,...s]=e;if(Array.isArray(t)){const a=[...t];return a[Number(i)]=xo(a[Number(i)],s,n),a}const r=t;return{...r,[i]:xo(r[i],s,n)}}function zx(t){return{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Engine Lab parameter edits require a finite numeric input value.",locations:[{kind:"entity",entity:{kind:"validationExample",id:t}}],entities:[{kind:"validationExample",id:t}]}]}}function Hx(t,e,n,i={}){if(!e){t.innerHTML=n?`<div class="inspector-empty inspector-error">${Wt(n)}</div>`:'<div class="inspector-empty">Select an example to inspect engine evidence.</div>';return}const{result:s}=e,r=Fx(e.example),a=s.observed.disposition!=="accepted";t.innerHTML=`
    ${n===void 0?"":`<div class="inspector-error-banner" role="alert">${Wt(n)}</div>`}
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
          <dd>${Wt(s.observed.classification??"not produced")}</dd>
        </div>
      </dl>
    </section>
    <section class="inspection-section">
      <h2>Diagnostics <span>${s.diagnostics.length}</span></h2>
      ${s.diagnostics.length===0?'<p class="quiet">No engine diagnostics.</p>':`<ul class="diagnostic-list">${s.diagnostics.map(o=>`
                  <li${a?` data-diagnostic-state="${o.category==="unsupported"?"unsupported":"invalid"}"`:""}>
                    <code>${Wt(o.code)}</code>
                    <p>${Wt(o.message)}</p>
                    <ul class="diagnostic-locations" aria-label="Diagnostic locations">
                      ${o.locations.map(c=>`<li>${Wt(Gx(c))}</li>`).join("")}
                    </ul>
                    <small>${Wt(o.category)} · ${Wt(o.severity)}</small>
                  </li>`).join("")}</ul>`}
    </section>
    <section class="inspection-section">
      <h2>Conformance checks <span>${s.checks.length}</span></h2>
      <div class="check-list">
        ${s.checks.map(o=>`
              <details ${o.passed?"":"open"}>
                <summary>
                  <span class="check-state" data-status="${o.passed?"passed":"failed"}"></span>
                  <code>${Wt(o.id)}</code>
                </summary>
                <dl>
                  <div><dt>Method</dt><dd>${Wt(o.method)}</dd></div>
                  <div><dt>Expected</dt><dd>${Bl(o.expected)}</dd></div>
                  <div><dt>Actual</dt><dd>${Bl(o.actual)}</dd></div>
                  ${o.residual===void 0?"":`<div><dt>Residual</dt><dd>${ea(o.residual)}</dd></div>`}
                  ${o.tolerance===void 0?"":`<div><dt>Tolerance</dt><dd>${ea(o.tolerance)}</dd></div>`}
                </dl>
              </details>`).join("")}
      </div>
    </section>
    <section class="inspection-section parameter-section" aria-label="Parameters">
      <h2>Parameters <span>${r.length}</span></h2>
      <div class="parameter-list">
        ${r.map(o=>`
              <label${Vl(o.path,s.diagnostics,a)===void 0?"":` data-diagnostic-state="${Vl(o.path,s.diagnostics,a)}"`}>
                <span>${Wt(o.label)}</span>
                <input
                  type="number"
                  aria-label="${Wt(o.label)}"
                  data-parameter-path="${Wt(JSON.stringify(o.path))}"
                  value="${o.value}"
                  step="${o.step}"
                />
              </label>`).join("")}
      </div>
      ${r.length===0?'<p class="quiet">This example has no numeric input leaves.</p>':'<button class="parameter-reset" type="button">Reset parameters</button>'}
    </section>
  `,t.querySelectorAll("[data-parameter-path]").forEach(o=>{let c;o.addEventListener("input",()=>{c!==void 0&&window.clearTimeout(c);const l=JSON.parse(o.dataset.parameterPath??"[]");c=window.setTimeout(()=>{i.onParameterCommit?.(l,Number(o.value))},240)})}),t.querySelector(".parameter-reset")?.addEventListener("click",()=>i.onReset?.())}function Bl(t){return typeof t=="number"?ea(t):Wt(JSON.stringify(t)??String(t))}function Gx(t){return t.kind==="entity"?`${t.entity.kind} · ${t.entity.id}`:t.kind==="parameter"?t.path.map(String).join(" · "):t.kind==="sample"?`sample ${t.index+1}${t.parameter===void 0?"":` · parameter ${ea(t.parameter)}`}`:`non-spatial · ${t.reason}`}function Vl(t,e,n){if(!n)return;const i=e.filter(s=>s.locations.some(r=>r.kind==="parameter"&&$x(t,r.path)));return i.some(s=>s.category!=="unsupported")?"invalid":i.some(s=>s.category==="unsupported")?"unsupported":void 0}function $x(t,e){return t.length>=e.length&&e.every((n,i)=>t[i]===n)}function ea(t){return t===0?"0":Math.abs(t)>=1e3||Math.abs(t)<.001?t.toExponential(4):t.toPrecision(6)}function Wt(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function Wx(t,e,n,i){const s=Pi(t,i,new Map(e.faces.map(a=>[a.faceId,n.operationId]))),r=s.segments.map(a=>({...a,start:On(a.start),end:On(a.end)}));return{points:pa(r),segments:r,faces:s.faces.map(a=>({...a,vertices:a.vertices.map(On)}))}}function Xx(t,e,n){const i=Pi(t,n,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:On(r.start),end:On(r.end)}));return{points:pa(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(On)}))}}function qx(t,e,n){const i=Pi(t,n,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:wa(r.start),end:wa(r.end)}));return{points:pa(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(wa)}))}}function Yx(t,e){const n=Pi(t.complex,e.transforms,new Map(t.sourceMap.integratedFaces.map(s=>[s.faceId,`${t.input.operationId}:${s.source}`]))),i=n.segments.map(s=>({...s,start:On(s.start),end:On(s.end)}));return{faces:n.faces.map(s=>({...s,vertices:s.vertices.map(On)})),segments:i,points:pa(i)}}function On([t,e,n]){return[t,n,-e]}function wa([t,e,n]){return[t,-e,n]}function pa(t){const e=new Map;for(const n of t)zl(e,n.start,n.role,Hl(n.end,n.start)),zl(e,n.end,n.role,Hl(n.start,n.end));return[...e.entries()].filter(([,n])=>Kx(n.entries)).sort(([n],[i])=>n.localeCompare(i)).map(([n,i])=>({id:`fabrication-corner:${n}`,position:i.position,role:"vertex",sourceEntities:[]}))}function zl(t,e,n,i){const s=e.map(a=>Math.round(a*1e9)).join(":"),r=t.get(s)??{position:e,entries:[]};r.entries.push({role:n,direction:i}),t.set(s,r)}function Kx(t){const e=t.filter((r,a,o)=>o.findIndex(c=>c.role===r.role&&Zx(c.direction,r.direction))===a);if(e.length!==2)return e.length>0;if(e[0].role!==e[1].role)return!0;const[n,i]=e.map(r=>r.direction),s=[n[1]*i[2]-n[2]*i[1],n[2]*i[0]-n[0]*i[2],n[0]*i[1]-n[1]*i[0]];return Math.hypot(...s)>1e-9}function Zx(t,e){const n=Math.hypot(...t),i=Math.hypot(...e);return n<=1e-12||i<=1e-12?!1:(t[0]*e[0]+t[1]*e[1]+t[2]*e[2])/(n*i)>=1-1e-9}function Hl(t,e){return[t[0]-e[0],t[1]-e[1],t[2]-e[2]]}function wc(t){const e=ev(t);if(e)return{ok:!1,diagnostics:[e]};const n=t.stepCount*t.stepRun,i=(t.hostWidth-n)/2,s=Array.from({length:t.stepCount+1},(y,T)=>{const M=i+T*t.stepRun,b=T===0,P=T===t.stepCount,C=b||P?-t.width:(T-1)*t.stepRise-t.width,I=P?(t.stepCount-1)*t.stepRise:T*t.stepRise;return{cutPairId:`cut:long:${T}`,axis:"long",lineIndex:T,start:[M,C],end:[M,I]}}),r=Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:inherited:${T}`,role:"inherited",stepIndex:T,start:[s[T].end[0],T*t.stepRise],end:[s[T+1].end[0],T*t.stepRise]})),a=Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:explicit:${T}`,role:"explicit",stepIndex:T,start:[s[T].start[0],T*t.stepRise-t.width],end:[s[T+1].start[0],T*t.stepRise-t.width]})),o=$l([0,t.hostWidth,...s.map(y=>y.start[0])]),c=$l([-t.hostFloorExtent,t.hostWallExtent,0,...s.flatMap(y=>[y.start[1],y.end[1]]),...r.flatMap(y=>[y.start[1],y.end[1]]),...a.flatMap(y=>[y.start[1],y.end[1]])]),l=[],u=[],h=[],d=[],f=[],p=[],_=[];for(let y=0;y<c.length;y+=1)for(let T=0;T<o.length;T+=1)l.push({id:vs(T,y),position:[o[T],c[y]]});for(let y=0;y<c.length-1;y+=1)for(let T=0;T<o.length-1;T+=1){const M=`sheet-face:${y}:${T}`,b=["bottom","right","top","left"].map(D=>`he:${y}:${T}:${D}`);h.push({id:b[0],origin:vs(T,y),next:b[1],edge:"pending",face:M},{id:b[1],origin:vs(T+1,y),next:b[2],edge:"pending",face:M},{id:b[2],origin:vs(T+1,y+1),next:b[3],edge:"pending",face:M},{id:b[3],origin:vs(T,y+1),next:b[0],edge:"pending",face:M}),u.push({id:M,boundary:b[0],holes:[]});const P=[(o[T]+o[T+1])/2,(c[y]+c[y+1])/2],C=Qx(P[0],i,t.stepRun,t.stepCount),I=C===void 0?void 0:jx(P,r,a),X=C===void 0?void 0:C*t.stepRise-t.width,H=I!==void 0?"tread":C!==void 0&&P[1]>=-t.width&&P[1]<X?"carrier":P[1]<0?"base":"host";p.push({faceId:M,role:H,...I===void 0?{}:{stepIndex:I}})}const m=new Map(h.map(y=>[y.id,y])),g=(y,T)=>{for(const M of y)m.get(M).edge=T.id;y.length===2&&(m.get(y[0]).twin=y[1],m.get(y[1]).twin=y[0]),d.push(T)};for(let y=0;y<c.length-1;y+=1)for(let T=0;T<o.length;T+=1){const M=T>0?`he:${y}:${T-1}:right`:void 0,b=T<o.length-1?`he:${y}:${T}:left`:void 0,P=[M,b].filter(q=>q!==void 0);if(P.length===1){const q=[P[0]];g(q,{id:`boundary:v:${y}:${T}`,halfEdges:q,kind:"boundary"});continue}const C=[P[0],P[1]],I=o[T],X=c[y],H=c[y+1],D=s.find(q=>xi(q.start[0],I)&&X>=q.start[1]-1e-10&&H<=q.end[1]+1e-10);if(!D||D.lineIndex===0){g(C,{id:`seam:v:${y}:${T}`,halfEdges:C,kind:"flatSeam"});continue}const W=`${D.cutPairId}:segment:${y}`,B=["",""];for(let q=0;q<C.length;q+=1){const te=q===0?"a":"b",re=`${W}:${te}`,ce=[C[q]];g(ce,{id:re,halfEdges:ce,kind:"cutBank",cutBank:{pair:W,bank:te}}),B[q]=re}f.push({id:W,banks:B})}for(let y=0;y<c.length;y+=1)for(let T=0;T<o.length-1;T+=1){const M=y>0?`he:${y-1}:${T}:top`:void 0,b=y<c.length-1?`he:${y}:${T}:bottom`:void 0,P=[M,b].filter(ae=>ae!==void 0);if(P.length===1){const ae=[P[0]];g(ae,{id:`boundary:h:${y}:${T}`,halfEdges:ae,kind:"boundary"});continue}const C=[P[0],P[1]],I=[o[T],c[y]],X=[o[T+1],c[y]],H=r.find(ae=>Wl(ae.start,ae.end,I,X)),D=a.find(ae=>Wl(ae.start,ae.end,I,X)),W=I[0]>=s[0].start[0]-1e-10&&X[0]<=s.at(-1).start[0]+1e-10,B=xi(c[y],-t.width)&&W,q=xi(c[y],0)&&!W&&!H&&!D;if(D?.stepIndex===0){g(C,{id:"seam:terminal:ground",halfEdges:C,kind:"flatSeam"});continue}if(!H&&!D&&!q&&!B){g(C,{id:`seam:h:${y}:${T}`,halfEdges:C,kind:"flatSeam"});continue}const re=(H??D)?.edgeId??(B?`hinge:carrier-base:${T}`:`hinge:parent:${T}`),ce=D?"valley":"mountain";g(C,{id:re,halfEdges:C,kind:"hinge",hinge:{assignment:ce,restAngle:0,angleRange:ce==="valley"?[0,Math.PI/2]:[-Math.PI/2,0]}})}const A=p.filter(y=>y.role==="tread"),w=Array.from({length:t.stepCount},(y,T)=>({stepIndex:T,treadFaceId:A.find(M=>M.stepIndex===T).faceId,hostConnected:!0,carrierConnected:!0}));for(let y=0;y<t.stepCount;y+=1)_.push({edgeId:r[y].edgeId,kind:"retained",stepIndex:y,side:"host"}),y>0&&_.push({edgeId:a[y].edgeId,kind:"retained",stepIndex:y,side:"carrier"});const v={schemaVersion:1,vertices:l,halfEdges:h,edges:d,faces:u,cutPairs:f,materialComponents:[{id:`tread-only-material:${t.operationId}`,faces:u.map(y=>y.id)}]},S=Ci(v);return S.length>0?{ok:!1,diagnostics:S}:{ok:!0,complex:v,sourceMap:{construction:"treadOnly",operationId:t.operationId,enclosingCut:!1,faces:p,cutLines:s.slice(1),shortEnds:_,hinges:[{edgeId:"hinge:parent",role:"parent"},...r,...a.slice(1),...Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:carrier-base:${T+1}`,role:"carrierBase",stepIndex:T}))],supports:w}}}function Rc(t){if(!Number.isInteger(t.sampleCount)||t.sampleCount<2||t.sampleCount>1001)return{ok:!1,diagnostics:[vo(t.input.operationId,"Path sample count must be an integer in [2, 1001].")]};const e=[];for(let n=0;n<t.sampleCount;n+=1){const i=n/(t.sampleCount-1),s=Jx(t.input,t.complex,t.sourceMap,i);if(!s.ok)return{ok:!1,diagnostics:[vo(t.input.operationId,s.reason)]};e.push({parameter:i,transforms:s.transforms})}return{ok:!0,samples:e}}function Jx(t,e,n,i){const s=new Map(n.faces.map(h=>[h.faceId,h])),r=new Map(e.halfEdges.map(h=>[h.id,h])),a=new Map(e.vertices.map(h=>[h.id,h.position])),o=i*Math.PI/2,c=bi([0,0,0],[1,0,0],o),l=bi([0,-t.width,0],[1,0,0],o),u=new Map;for(const h of e.faces){const d=s.get(h.id);if(!d)return{ok:!1,reason:`Tread-only face ${h.id} has no material trace.`};if(d.role==="base")u.set(h.id,tn());else if(d.role==="host")u.set(h.id,c);else if(d.role==="carrier")u.set(h.id,l);else if(d.role==="tread"&&d.stepIndex!==void 0){const f=d.stepIndex*t.stepRise;u.set(h.id,{rotation:tn().rotation,translation:[0,-f*(1-Math.cos(o)),f*Math.sin(o)]})}else return{ok:!1,reason:`Tread-only face ${h.id} has unsupported role ${d.role}.`}}for(const h of e.edges.filter(d=>d.halfEdges.length===2)){const d=r.get(h.halfEdges[0]),f=r.get(h.halfEdges[1]),p=r.get(d.next),_=r.get(f.next),m=(A,w)=>{const v=a.get(w),S=u.get(A.face);return ht(S,[v[0],v[1],0])},g=Math.max(Gl(m(d,d.origin),m(f,_.origin)),Gl(m(d,p.origin),m(f,f.origin)));if(g>1e-8)return{ok:!1,reason:`Tread-only retained edge ${h.id} detaches by ${g}.`}}return{ok:!0,transforms:u}}function Gl(t,e){return Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2])}function jx(t,e,n){return e.find((i,s)=>t[0]>i.start[0]&&t[0]<i.end[0]&&t[1]>n[s].start[1]&&t[1]<i.start[1])?.stepIndex}function Qx(t,e,n,i){if(!(t<=e||t>=e+i*n))return Math.min(i-1,Math.max(0,Math.floor((t-e)/n)))}function $l(t){return[...new Set(t.map(e=>Number(e.toFixed(12))))].sort((e,n)=>e-n)}function vs(t,e){return`v:${e}:${t}`}function xi(t,e){return Math.abs(t-e)<=1e-10}function Wl(t,e,n,i){return xi(t[0],n[0])&&xi(t[1],n[1])&&xi(e[0],i[0])&&xi(e[1],i[1])}function ev(t){const e=t.stepCount*t.stepRun,n=-t.width,i=t.stepCount*t.stepRise;return t.operationId.length>0&&Number.isFinite(t.width)&&t.width>0&&Number.isInteger(t.stepCount)&&t.stepCount>=2&&t.stepCount<=20&&Number.isFinite(t.stepRun)&&t.stepRun>0&&t.stepRun===t.stepRise&&Number.isFinite(t.hostWidth)&&t.hostWidth>=e&&Number.isFinite(t.hostFloorExtent)&&t.hostFloorExtent>=-n&&Number.isFinite(t.hostWallExtent)&&t.hostWallExtent>=i?void 0:vo(t.operationId||"unknown","Tread-only stair dimensions must be positive, equal-run/equal-rise, bounded, and fit the host sheet.")}function vo(t,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}function tv(t){const e=wc(t);if(!e.ok)return e;const n=e.sourceMap.faces.map(a=>({faceId:a.faceId,role:a.role==="tread"?"riser":a.role==="host"?"stationaryHost":a.role==="base"?"movingHalf":"carrier",...a.stepIndex===void 0?{}:{stepIndex:a.stepIndex}})),i=n.filter(a=>a.role==="riser"),s=Wu(e.complex,ta),r=s.edges.filter(a=>a.id.startsWith("hinge:parent:")).map(a=>({edgeId:a.id,role:"parent"}));return{ok:!0,complex:s,sourceMap:{construction:"riserOnly",operationId:t.operationId,sheetOrientation:"landscape",parentCreaseAxis:"vertical",enclosingCut:!1,faces:n,cutLines:e.sourceMap.cutLines.map(a=>({...a,start:or(a.start),end:or(a.end)})),shortEnds:e.sourceMap.shortEnds.map(a=>({...a,side:a.side==="host"?"stationaryHost":"carrier"})),hinges:[...r,...e.sourceMap.hinges.filter(a=>a.role!=="parent").map(a=>({...a,...a.start===void 0?{}:{start:or(a.start)},...a.end===void 0?{}:{end:or(a.end)}}))],supports:Array.from({length:t.stepCount},(a,o)=>({stepIndex:o,riserFaceId:i.find(c=>c.stepIndex===o).faceId,stationaryHostConnected:!0,carrierConnected:!0}))}}}function nv(t){const e={...t.sourceMap,construction:"treadOnly",faces:t.sourceMap.faces.map(r=>({faceId:r.faceId,role:r.role==="riser"?"tread":r.role==="stationaryHost"?"host":r.role==="movingHalf"?"base":"carrier",...r.stepIndex===void 0?{}:{stepIndex:r.stepIndex}})),shortEnds:t.sourceMap.shortEnds.map(r=>({...r,side:r.side==="stationaryHost"?"host":"carrier"})),supports:t.sourceMap.supports.map(r=>({stepIndex:r.stepIndex,treadFaceId:r.riserFaceId,hostConnected:!0,carrierConnected:!0}))},n=Wu(t.complex,Ei(ta)),i=Rc({input:t.input,complex:n,sourceMap:e,sampleCount:t.sampleCount});if(!i.ok)return i;const s=t.sourceMap.faces.find(r=>r.role==="stationaryHost");return s?{ok:!0,samples:i.samples.map(r=>{const a=Ei(r.transforms.get(s.faceId));return{parameter:r.parameter,transforms:new Map([...r.transforms].map(([o,c])=>[o,iv(Xt(a,c))]))}})}:{ok:!1,diagnostics:[rv(t.input.operationId,"Riser-only pattern has no stationary host face.")]}}const ta={rotation:[[0,-1,0],[1,0,0],[0,0,1]],translation:[0,0,0]};function or([t,e]){return[-e,t]}function Wu(t,e){return{...t,vertices:t.vertices.map(n=>{const[i,s]=n.position,r=sv(e,[i,s,0]);return{...n,position:[r[0],r[1]]}})}}function iv(t){return Xt(ta,Xt(t,Ei(ta)))}function sv(t,e){return[t.rotation[0][0]*e[0]+t.rotation[0][1]*e[1]+t.rotation[0][2]*e[2]+t.translation[0],t.rotation[1][0]*e[0]+t.rotation[1][1]*e[1]+t.rotation[1][2]*e[2]+t.translation[1],t.rotation[2][0]*e[0]+t.rotation[2][1]*e[1]+t.rotation[2][2]*e[2]+t.translation[2]]}function rv(t,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}function av(t){const e={operationId:`${t.operationId}:parent`,...t.parent},n={operationId:`${t.operationId}:child`,hostPlane:"wall",...t.child},i=wc(e);if(!i.ok)return i;const s=_c(n);if(!s.ok)return s;const r=lv(t),a=-t.parent.width;if(!dv(t,r,a))return{ok:!1,diagnostics:[yo(t.operationId,"The child stair must fit one retained carrier strip above the carrier-base hinge and parent base material below it.")]};const o=Mo(i.complex),c=new Map(i.sourceMap.faces.map(_=>[_.faceId,_])),l=i.sourceMap.faces.filter(_=>{const m=o.get(_.faceId);return gv(m,r)}).map(_=>_.faceId).sort(),u=l.map(_=>c.get(_));if(!u.some(_=>_.role==="carrier")||!u.some(_=>_.role==="base"))return{ok:!1,diagnostics:[yo(t.operationId,"The child source region must replace both retained carrier material and the common parent base.")]};const h=new Set(l),d=i.complex.faces.map(_=>_.id).filter(_=>!h.has(_)).sort(),f=cv(i,s,r,a,t.operationId),p=Ci(f.complex);return p.length>0?{ok:!1,diagnostics:p}:{ok:!0,input:t,parent:i,child:s,complex:f.complex,childPlacement:xv(r.minimumX,a),sourceMap:{construction:"carrierHostedCompoundStair",operationId:t.operationId,materialComponentCount:1,parent:i.sourceMap,child:s.sourceMap,integratedFaces:f.faces,retainedParentFaceIds:d,replacement:{sourceRegion:r,replacedParentFaceIds:l},sharedEdges:{carrierHost:{kind:"sharedMaterialEdge",y:a},groundBridge:{kind:"sharedMaterialEdge",y:a}}},evidence:{sourceRegionContained:!0,childHostContainedInCarrier:!0,childBaseContainedInParentBase:!0,childReplacesCarrier:!0,groundBridgeRetained:!0}}}function ov(t){const e={operationId:`${t.compilation.input.operationId}:parent`,...t.compilation.input.parent},n={operationId:`${t.compilation.input.operationId}:child`,hostPlane:"wall",...t.compilation.input.child},i=Rc({input:e,complex:t.compilation.parent.complex,sourceMap:t.compilation.parent.sourceMap,sampleCount:t.sampleCount});if(!i.ok)return i;const s=vc({input:n,complex:t.compilation.child.complex,sourceMap:t.compilation.child.sourceMap,sampleCount:t.sampleCount});if(!s.ok)return s;const r=i.samples.map((o,c)=>{const l=s.samples[c],u=new Map([...l.transforms].map(([_,m])=>[_,Xt(t.compilation.childPlacement,m)])),h=_v(t.compilation,o.transforms,u),d=new Map(t.compilation.sourceMap.integratedFaces.map(_=>[_.faceId,_.source==="parent"?o.transforms.get(_.sourceFaceId):Xt(u.get(_.sourceFaceId),Ei(t.compilation.childPlacement))])),p=Xu(t.compilation.complex,d).residual;return{parameter:o.parameter,transforms:d,parentTransforms:o.transforms,childTransforms:u,carrierHostResidual:h.carrier,groundBridgeResidual:h.ground,maximumSharedMaterialResidual:p,grounded:h.ground<1e-8,childUsesCarrierHost:h.carrier<1e-8}}),a=r.find(o=>!o.grounded||!o.childUsesCarrierHost||o.maximumSharedMaterialResidual>=1e-8);return a?{ok:!1,diagnostics:[yo(t.compilation.input.operationId,`Compound stair shared material detached at parameter ${a.parameter}: carrier ${a.carrierHostResidual}, ground ${a.groundBridgeResidual}, retained ${a.maximumSharedMaterialResidual} at ${mv(t.compilation.complex,a.transforms).edgeId}.`)]}:{ok:!0,samples:r}}function cv(t,e,n,i,s){const r=[n.minimumX,i,0],a=Mo(t.complex),o=Mo(e.complex),c=Xl([...t.complex.vertices.map(v=>v.position[0]),...e.complex.vertices.map(v=>v.position[0]+r[0])]),l=Xl([...t.complex.vertices.map(v=>v.position[1]),...e.complex.vertices.map(v=>v.position[1]+r[1])]),u=[],h=[],d=[],f=[];for(let v=0;v<l.length;v+=1)for(let S=0;S<c.length;S+=1)u.push({id:Ms(S,v),position:[c[S],l[v]]});for(let v=0;v<l.length-1;v+=1)for(let S=0;S<c.length-1;S+=1){const y=[(c[S]+c[S+1])/2,(l[v]+l[v+1])/2],T=uv(y,n),M=T?"child":"parent",b=T?[y[0]-r[0],y[1]-r[1]]:y,P=hv(T?o:a,b);if(!P)throw new Error(`Integrated compound cell ${S}:${v} has no ${M} source face.`);const C=`compound-face:${v}:${S}`,I=["bottom","right","top","left"].map(X=>`compound-he:${v}:${S}:${X}`);d.push({id:I[0],origin:Ms(S,v),next:I[1],edge:"pending",face:C},{id:I[1],origin:Ms(S+1,v),next:I[2],edge:"pending",face:C},{id:I[2],origin:Ms(S+1,v+1),next:I[3],edge:"pending",face:C},{id:I[3],origin:Ms(S,v+1),next:I[0],edge:"pending",face:C}),h.push({id:C,boundary:I[0],holes:[]}),f.push({faceId:C,source:M,sourceFaceId:P})}const p=[],_=[],m=new Map(d.map(v=>[v.id,v])),g=new Map(f.map(v=>[v.faceId,v])),A=(v,S)=>{for(const y of v)m.get(y).edge=S.id;v.length===2&&(m.get(v[0]).twin=v[1],m.get(v[1]).twin=v[0]),p.push(S)},w=(v,S,y,T)=>{if(v.length===1){const D=[v[0]];A(D,{id:`boundary:${T}`,halfEdges:D,kind:"boundary"});return}const M=[v[0],v[1]],b=g.get(m.get(v[0]).face),P=g.get(m.get(v[1]).face);if(b.source!==P.source){A(M,{id:`seam:embedded:${T}`,halfEdges:M,kind:"flatSeam"});return}const C=b.source==="parent"?t.complex:e.complex,I=b.source==="parent"?S:[S[0]-r[0],S[1]-r[1]],X=b.source==="parent"?y:[y[0]-r[0],y[1]-r[1]],H=fv(C,I,X);if(H.kind==="cutBank"){const D=`cut:compound:${T}`,W=`${D}:a`,B=`${D}:b`;A([v[0]],{id:W,halfEdges:[v[0]],kind:"cutBank",cutBank:{pair:D,bank:"a"}}),A([v[1]],{id:B,halfEdges:[v[1]],kind:"cutBank",cutBank:{pair:D,bank:"b"}}),_.push({id:D,banks:[W,B]});return}if(H.kind==="hinge"){A(M,{id:`hinge:compound:${T}`,halfEdges:M,kind:"hinge",hinge:H.hinge});return}A(M,{id:`seam:compound:${T}`,halfEdges:M,kind:"flatSeam"})};for(let v=0;v<l.length-1;v+=1)for(let S=0;S<c.length;S+=1){const y=[S>0?`compound-he:${v}:${S-1}:right`:void 0,S<c.length-1?`compound-he:${v}:${S}:left`:void 0].filter(T=>T!==void 0);w(y,[c[S],l[v]],[c[S],l[v+1]],`v:${v}:${S}`)}for(let v=0;v<l.length;v+=1)for(let S=0;S<c.length-1;S+=1){const y=[v>0?`compound-he:${v-1}:${S}:top`:void 0,v<l.length-1?`compound-he:${v}:${S}:bottom`:void 0].filter(T=>T!==void 0);w(y,[c[S],l[v]],[c[S+1],l[v]],`h:${v}:${S}`)}return{complex:{schemaVersion:1,vertices:u,halfEdges:d,edges:p,faces:h,cutPairs:_,materialComponents:[{id:`compound-material:${s}`,faces:h.map(v=>v.id)}]},faces:f}}function lv(t){const n=(t.parent.hostWidth-t.parent.stepCount*t.parent.stepRun)/2+t.childHostStepIndex*t.parent.stepRun+(t.parent.stepRun-t.child.hostWidth)/2,i=-t.parent.width;return{minimumX:Is(n),maximumX:Is(n+t.child.hostWidth),minimumY:Is(i-t.child.hostFloorExtent),maximumY:Is(i+t.child.hostWallExtent)}}function Is(t){return Number(t.toFixed(12))}function dv(t,e,n){if(!Number.isInteger(t.childHostStepIndex)||t.childHostStepIndex<0||t.childHostStepIndex>=t.parent.stepCount||t.child.hostWidth>t.parent.stepRun+1e-10||e.minimumX<0||e.maximumX>t.parent.hostWidth||e.minimumY<-t.parent.hostFloorExtent||e.maximumY>t.parent.hostWallExtent)return!1;const i=(t.parent.hostWidth-t.parent.stepCount*t.parent.stepRun)/2,r=Math.min(t.parent.stepCount-1,Math.max(0,Math.floor((e.minimumX-i)/t.parent.stepRun+1e-8)))*t.parent.stepRise;return e.minimumY<n&&e.maximumY<=r+1e-10}function Mo(t){const e=new Map(t.vertices.map(i=>[i.id,i.position])),n=new Map(t.halfEdges.map(i=>[i.id,i]));return new Map(t.faces.map(i=>{const s=[];let r=n.get(i.boundary);const a=r.id;do s.push(e.get(r.origin)),r=n.get(r.next);while(r.id!==a);return[i.id,{minimumX:Math.min(...s.map(o=>o[0])),maximumX:Math.max(...s.map(o=>o[0])),minimumY:Math.min(...s.map(o=>o[1])),maximumY:Math.max(...s.map(o=>o[1]))}]}))}function Xl(t){return[...new Set(t.map(e=>Is(e)))].sort((e,n)=>e-n)}function Ms(t,e){return`compound-v:${e}:${t}`}function uv(t,e){return t[0]>e.minimumX&&t[0]<e.maximumX&&t[1]>e.minimumY&&t[1]<e.maximumY}function hv(t,e){return[...t].find(([,n])=>e[0]>n.minimumX-1e-10&&e[0]<n.maximumX+1e-10&&e[1]>n.minimumY-1e-10&&e[1]<n.maximumY+1e-10)?.[0]}function fv(t,e,n){const i=new Map(t.vertices.map(r=>[r.id,r.position])),s=new Map(t.halfEdges.map(r=>[r.id,r]));for(const r of t.edges)for(const a of r.halfEdges){const o=s.get(a),c=i.get(o.origin),l=i.get(s.get(o.next).origin);if(pv(e,n,c,l))return r}return{id:"implicit-flat-seam",halfEdges:["implicit"],kind:"flatSeam"}}function pv(t,e,n,i){const s=(e[0]-t[0])*(n[1]-t[1])-(e[1]-t[1])*(n[0]-t[0]),r=(e[0]-t[0])*(i[1]-t[1])-(e[1]-t[1])*(i[0]-t[0]);return Math.abs(s)>1e-9||Math.abs(r)>1e-9?!1:Math.min(n[0],i[0])<=t[0]+1e-10&&Math.max(n[0],i[0])>=e[0]-1e-10&&Math.min(n[1],i[1])<=t[1]+1e-10&&Math.max(n[1],i[1])>=e[1]-1e-10}function Xu(t,e){const n=new Map(t.vertices.map(a=>[a.id,a.position])),i=new Map(t.halfEdges.map(a=>[a.id,a]));let s=0,r;for(const a of t.edges.filter(o=>o.halfEdges.length===2)){const o=i.get(a.halfEdges[0]),c=i.get(a.halfEdges[1]),l=i.get(o.next),u=i.get(c.next),h=(f,p)=>{const _=n.get(p);return ht(e.get(f.face),[_[0],_[1],0])},d=Math.max(na(h(o,o.origin),h(c,u.origin)),na(h(o,l.origin),h(c,c.origin)));d>s&&(s=d,r=a.id)}return{residual:s,...r===void 0?{}:{edgeId:r}}}function mv(t,e){return Xu(t,e)}function gv(t,e){return Math.min(t.maximumX,e.maximumX)-Math.max(t.minimumX,e.minimumX)>1e-10&&Math.min(t.maximumY,e.maximumY)-Math.max(t.minimumY,e.minimumY)>1e-10}function _v(t,e,n){const i=t.parent.sourceMap.faces.find(h=>h.role==="carrier"&&t.sourceMap.replacement.replacedParentFaceIds.includes(h.faceId)),s=t.parent.sourceMap.faces.find(h=>h.role==="base"&&t.sourceMap.replacement.replacedParentFaceIds.includes(h.faceId)),r=t.child.sourceMap.faces.find(h=>h.faceId.startsWith("host-face:")&&h.faceId.includes(":0")),a=t.child.sourceMap.faces.find(h=>h.faceId.startsWith("host-face:0:"));if(!i||!s||!r||!a)return{carrier:Number.POSITIVE_INFINITY,ground:Number.POSITIVE_INFINITY};const o=-t.input.parent.width,c=t.sourceMap.replacement.sourceRegion.minimumX,l=[0,0,0],u=[c,o,0];return{carrier:na(ht(e.get(i.faceId),u),ht(n.get(r.faceId),l)),ground:na(ht(e.get(s.faceId),u),ht(n.get(a.faceId),l))}}function xv(t,e){return{...tn(),translation:[t,e,0]}}function na(t,e){return Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2])}function yo(t,e){return{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}const Cc="185",ns={ROTATE:0,DOLLY:1,PAN:2},Qi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},vv=0,ql=1,Mv=2,Vr=1,yv=2,Ls=3,ri=0,qt=1,Sn=2,kn=0,is=1,Yl=2,Kl=3,Zl=4,Sv=5,gi=100,Ev=101,bv=102,Av=103,Tv=104,wv=200,Rv=201,Cv=202,Pv=203,So=204,Eo=205,Iv=206,Lv=207,Dv=208,Nv=209,Fv=210,Uv=211,Ov=212,kv=213,Bv=214,bo=0,Ao=1,To=2,as=3,wo=4,Ro=5,Co=6,Po=7,qu=0,Vv=1,zv=2,An=0,Yu=1,Ku=2,Zu=3,Ju=4,ju=5,Qu=6,eh=7,th=300,Ti=301,os=302,Ra=303,Ca=304,ma=306,Io=1e3,Un=1001,Lo=1002,It=1003,Hv=1004,cr=1005,Ut=1006,Pa=1007,vi=1008,en=1009,nh=1010,ih=1011,zs=1012,Pc=1013,Rn=1014,En=1015,Vn=1016,Ic=1017,Lc=1018,Hs=1020,sh=35902,rh=35899,ah=1021,oh=1022,fn=1023,zn=1026,Mi=1027,ch=1028,Dc=1029,wi=1030,Nc=1031,Fc=1033,zr=33776,Hr=33777,Gr=33778,$r=33779,Do=35840,No=35841,Fo=35842,Uo=35843,Oo=36196,ko=37492,Bo=37496,Vo=37488,zo=37489,ia=37490,Ho=37491,Go=37808,$o=37809,Wo=37810,Xo=37811,qo=37812,Yo=37813,Ko=37814,Zo=37815,Jo=37816,jo=37817,Qo=37818,ec=37819,tc=37820,nc=37821,ic=36492,sc=36494,rc=36495,ac=36283,oc=36284,sa=36285,cc=36286,Gv=3200,lc=0,$v=1,ei="",jt="srgb",ra="srgb-linear",aa="linear",Qe="srgb",Oi=7680,Jl=519,Wv=512,Xv=513,qv=514,Uc=515,Yv=516,Kv=517,Oc=518,Zv=519,jl=35044,Ql="300 es",bn=2e3,Gs=2001;function Jv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function oa(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function jv(){const t=oa("canvas");return t.style.display="block",t}const ed={};function td(...t){const e="THREE."+t.shift();console.log(e,...t)}function lh(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Le(...t){t=lh(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function Ye(...t){t=lh(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function ss(...t){const e=t.join(" ");e in ed||(ed[e]=!0,Le(...t))}function Qv(t,e,n){return new Promise(function(i,s){function r(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:s();break;case t.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}const eM={[bo]:Ao,[To]:Co,[wo]:Po,[as]:Ro,[Ao]:bo,[Co]:To,[Po]:wo,[Ro]:as};class ci{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let nd=1234567;const Os=Math.PI/180,$s=180/Math.PI;function hs(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Dt[t&255]+Dt[t>>8&255]+Dt[t>>16&255]+Dt[t>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[n&63|128]+Dt[n>>8&255]+"-"+Dt[n>>16&255]+Dt[n>>24&255]+Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]).toLowerCase()}function Ge(t,e,n){return Math.max(e,Math.min(n,t))}function kc(t,e){return(t%e+e)%e}function tM(t,e,n,i,s){return i+(t-e)*(s-i)/(n-e)}function nM(t,e,n){return t!==e?(n-t)/(e-t):0}function ks(t,e,n){return(1-n)*t+n*e}function iM(t,e,n,i){return ks(t,e,1-Math.exp(-n*i))}function sM(t,e=1){return e-Math.abs(kc(t,e*2)-e)}function rM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function aM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function oM(t,e){return t+Math.floor(Math.random()*(e-t+1))}function cM(t,e){return t+Math.random()*(e-t)}function lM(t){return t*(.5-Math.random())}function dM(t){t!==void 0&&(nd=t);let e=nd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function uM(t){return t*Os}function hM(t){return t*$s}function fM(t){return(t&t-1)===0&&t!==0}function pM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function mM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function gM(t,e,n,i,s){const r=Math.cos,a=Math.sin,o=r(n/2),c=a(n/2),l=r((e+i)/2),u=a((e+i)/2),h=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),p=a((i-e)/2);switch(s){case"XYX":t.set(o*u,c*h,c*d,o*l);break;case"YZY":t.set(c*d,o*u,c*h,o*l);break;case"ZXZ":t.set(c*h,c*d,o*u,o*l);break;case"XZX":t.set(o*u,c*p,c*f,o*l);break;case"YXY":t.set(c*f,o*u,c*p,o*l);break;case"ZYZ":t.set(c*p,c*f,o*u,o*l);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ji(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ot(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const dh={DEG2RAD:Os,RAD2DEG:$s,generateUUID:hs,clamp:Ge,euclideanModulo:kc,mapLinear:tM,inverseLerp:nM,lerp:ks,damp:iM,pingpong:sM,smoothstep:rM,smootherstep:aM,randInt:oM,randFloat:cM,randFloatSpread:lM,seededRandom:dM,degToRad:uM,radToDeg:hM,isPowerOfTwo:fM,ceilPowerOfTwo:pM,floorPowerOfTwo:mM,setQuaternionFromProperEuler:gM,normalize:Ot,denormalize:Ji},Wc=class Wc{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Ge(this.x,e.x,n.x),this.y=Ge(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Ge(this.x,e,n),this.y=Ge(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),s=Math.sin(n),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Wc.prototype.isVector2=!0;let Fe=Wc;class ai{constructor(e=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=s}static slerpFlat(e,n,i,s,r,a,o){let c=i[s+0],l=i[s+1],u=i[s+2],h=i[s+3],d=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(h!==_||c!==d||l!==f||u!==p){let m=c*d+l*f+u*p+h*_;m<0&&(d=-d,f=-f,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const A=Math.acos(m),w=Math.sin(A);g=Math.sin(g*A)/w,o=Math.sin(o*A)/w,c=c*g+d*o,l=l*g+f*o,u=u*g+p*o,h=h*g+_*o}else{c=c*g+d*o,l=l*g+f*o,u=u*g+p*o,h=h*g+_*o;const A=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=A,l*=A,u*=A,h*=A}}e[n]=c,e[n+1]=l,e[n+2]=u,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],u=i[s+3],h=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[n]=o*p+u*h+c*f-l*d,e[n+1]=c*p+u*d+l*h-o*f,e[n+2]=l*p+u*f+o*d-c*h,e[n+3]=u*p-o*h-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,s){return this._x=e,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(s/2),h=o(r/2),d=c(i/2),f=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=d*u*h+l*f*p,this._y=l*f*h-d*u*p,this._z=l*u*p+d*f*h,this._w=l*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+l*f*p,this._y=l*f*h-d*u*p,this._z=l*u*p-d*f*h,this._w=l*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-l*f*p,this._y=l*f*h+d*u*p,this._z=l*u*p+d*f*h,this._w=l*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-l*f*p,this._y=l*f*h+d*u*p,this._z=l*u*p-d*f*h,this._w=l*u*h+d*f*p;break;case"YZX":this._x=d*u*h+l*f*p,this._y=l*f*h+d*u*p,this._z=l*u*p-d*f*h,this._w=l*u*h-d*f*p;break;case"XZY":this._x=d*u*h-l*f*p,this._y=l*f*h-d*u*p,this._z=l*u*p+d*f*h,this._w=l*u*h+d*f*p;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],s=n[4],r=n[8],a=n[1],o=n[5],c=n[9],l=n[2],u=n[6],h=n[10],d=i+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>h){const f=2*Math.sqrt(1+i-o-h);this._w=(u-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>h){const f=2*Math.sqrt(1+o-i-h);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ge(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,n/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,s=e._y,r=e._z,a=e._w,o=n._x,c=n._y,l=n._z,u=n._w;return this._x=i*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-i*l,this._z=r*u+a*l+i*c-s*o,this._w=a*u-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,n){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-n;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,n=Math.sin(n*l)/u,this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+a*n,this._onChangeCallback()}else this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+a*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(n),r*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Xc=class Xc{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(id.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(id.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6]*s,this.y=r[1]*n+r[4]*i+r[7]*s,this.z=r[2]*n+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*n+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*n+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*n+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*i),u=2*(o*n-r*s),h=2*(r*i-a*n);return this.x=n+c*l+a*h-o*u,this.y=i+c*u+o*l-r*h,this.z=s+c*h+r*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[4]*i+r[8]*s,this.y=r[1]*n+r[5]*i+r[9]*s,this.z=r[2]*n+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Ge(this.x,e.x,n.x),this.y=Ge(this.y,e.y,n.y),this.z=Ge(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Ge(this.x,e,n),this.y=Ge(this.y,e,n),this.z=Ge(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,s=e.y,r=e.z,a=n.x,o=n.y,c=n.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ia.copy(this).projectOnVector(e),this.sub(Ia)}reflect(e){return this.sub(Ia.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return n*n+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const s=Math.sin(n)*e;return this.x=s*Math.sin(i),this.y=Math.cos(n)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Xc.prototype.isVector3=!0;let U=Xc;const Ia=new U,id=new ai,qc=class qc{constructor(e,n,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,a,o,c,l)}set(e,n,i,s,r,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=n,u[4]=r,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],h=i[7],d=i[2],f=i[5],p=i[8],_=s[0],m=s[3],g=s[6],A=s[1],w=s[4],v=s[7],S=s[2],y=s[5],T=s[8];return r[0]=a*_+o*A+c*S,r[3]=a*m+o*w+c*y,r[6]=a*g+o*v+c*T,r[1]=l*_+u*A+h*S,r[4]=l*m+u*w+h*y,r[7]=l*g+u*v+h*T,r[2]=d*_+f*A+p*S,r[5]=d*m+f*w+p*y,r[8]=d*g+f*v+p*T,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return n*a*u-n*o*l-i*r*u+i*o*c+s*r*l-s*a*c}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=u*a-o*l,d=o*c-u*r,f=l*r-a*c,p=n*h+i*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=h*_,e[1]=(s*l-u*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(u*n-s*c)*_,e[5]=(s*r-o*n)*_,e[6]=f*_,e[7]=(i*c-l*n)*_,e[8]=(a*n-i*r)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+n,0,0,1),this}scale(e,n){return ss("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(La.makeScale(e,n)),this}rotate(e){return ss("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(La.makeRotation(-e)),this}translate(e,n){return ss("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(La.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};qc.prototype.isMatrix3=!0;let Ue=qc;const La=new Ue,sd=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rd=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _M(){const t={enabled:!0,workingColorSpace:ra,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Qe&&(s.r=Bn(s.r),s.g=Bn(s.g),s.b=Bn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Qe&&(s.r=rs(s.r),s.g=rs(s.g),s.b=rs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ei?aa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ss("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ss("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[ra]:{primaries:e,whitePoint:i,transfer:aa,toXYZ:sd,fromXYZ:rd,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:jt},outputColorSpaceConfig:{drawingBufferColorSpace:jt}},[jt]:{primaries:e,whitePoint:i,transfer:Qe,toXYZ:sd,fromXYZ:rd,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:jt}}}),t}const We=_M();function Bn(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function rs(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let ki;class xM{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ki===void 0&&(ki=oa("canvas")),ki.width=e.width,ki.height=e.height;const s=ki.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=ki}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=oa("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Bn(r[a]/255)*255;return i.putImageData(s,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Bn(n[i]/255)*255):n[i]=Bn(n[i]);return{data:n,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let vM=0;class Bc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vM++}),this.uuid=hs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Da(s[a].image)):r.push(Da(s[a]))}else r=Da(s);i.url=r}return n||(e.images[this.uuid]=i),i}}function Da(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?xM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let MM=0;const Na=new U;class Bt extends ci{constructor(e=Bt.DEFAULT_IMAGE,n=Bt.DEFAULT_MAPPING,i=Un,s=Un,r=Ut,a=vi,o=fn,c=en,l=Bt.DEFAULT_ANISOTROPY,u=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:MM++}),this.uuid=hs(),this.name="",this.source=new Bc(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Na).x}get height(){return this.source.getSize(Na).y}get depth(){return this.source.getSize(Na).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Le(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Le(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==th)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Io:e.x=e.x-Math.floor(e.x);break;case Un:e.x=e.x<0?0:1;break;case Lo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Io:e.y=e.y-Math.floor(e.y);break;case Un:e.y=e.y<0?0:1;break;case Lo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=th;Bt.DEFAULT_ANISOTROPY=1;const Yc=class Yc{constructor(e=0,n=0,i=0,s=1){this.x=e,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,s){return this.x=e,this.y=n,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*n+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*n+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*n+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,s,r;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],p=c[9],_=c[2],m=c[6],g=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const w=(l+1)/2,v=(f+1)/2,S=(g+1)/2,y=(u+d)/4,T=(h+_)/4,M=(p+m)/4;return w>v&&w>S?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=y/i,r=T/i):v>S?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=y/s,r=M/s):S<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),i=T/r,s=M/r),this.set(i,s,r,n),this}let A=Math.sqrt((m-p)*(m-p)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(A)<.001&&(A=1),this.x=(m-p)/A,this.y=(h-_)/A,this.z=(d-u)/A,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Ge(this.x,e.x,n.x),this.y=Ge(this.y,e.y,n.y),this.z=Ge(this.z,e.z,n.z),this.w=Ge(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Ge(this.x,e,n),this.y=Ge(this.y,e,n),this.z=Ge(this.z,e,n),this.w=Ge(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Yc.prototype.isVector4=!0;let dt=Yc;class yM extends ci{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new dt(0,0,e,n),this.scissorTest=!1,this.viewport=new dt(0,0,e,n),this.textures=[];const s={width:e,height:n,depth:i.depth},r=new Bt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:Ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const s=Object.assign({},e.textures[n].image);this.textures[n].source=new Bc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends yM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class uh extends Bt{constructor(e=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class SM extends Bt{constructor(e=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const da=class da{constructor(e,n,i,s,r,a,o,c,l,u,h,d,f,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,a,o,c,l,u,h,d,f,p,_,m)}set(e,n,i,s,r,a,o,c,l,u,h,d,f,p,_,m){const g=this.elements;return g[0]=e,g[4]=n,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=u,g[10]=h,g[14]=d,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new da().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,s=1/Bi.setFromMatrixColumn(e,0).length(),r=1/Bi.setFromMatrixColumn(e,1).length(),a=1/Bi.setFromMatrixColumn(e,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*r,n[5]=i[5]*r,n[6]=i[6]*r,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=a*u,f=a*h,p=o*u,_=o*h;n[0]=c*u,n[4]=-c*h,n[8]=l,n[1]=f+p*l,n[5]=d-_*l,n[9]=-o*c,n[2]=_-d*l,n[6]=p+f*l,n[10]=a*c}else if(e.order==="YXZ"){const d=c*u,f=c*h,p=l*u,_=l*h;n[0]=d+_*o,n[4]=p*o-f,n[8]=a*l,n[1]=a*h,n[5]=a*u,n[9]=-o,n[2]=f*o-p,n[6]=_+d*o,n[10]=a*c}else if(e.order==="ZXY"){const d=c*u,f=c*h,p=l*u,_=l*h;n[0]=d-_*o,n[4]=-a*h,n[8]=p+f*o,n[1]=f+p*o,n[5]=a*u,n[9]=_-d*o,n[2]=-a*l,n[6]=o,n[10]=a*c}else if(e.order==="ZYX"){const d=a*u,f=a*h,p=o*u,_=o*h;n[0]=c*u,n[4]=p*l-f,n[8]=d*l+_,n[1]=c*h,n[5]=_*l+d,n[9]=f*l-p,n[2]=-l,n[6]=o*c,n[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,p=o*c,_=o*l;n[0]=c*u,n[4]=_-d*h,n[8]=p*h+f,n[1]=h,n[5]=a*u,n[9]=-o*u,n[2]=-l*u,n[6]=f*h+p,n[10]=d-_*h}else if(e.order==="XZY"){const d=a*c,f=a*l,p=o*c,_=o*l;n[0]=c*u,n[4]=-h,n[8]=l*u,n[1]=d*h+_,n[5]=a*u,n[9]=f*h-p,n[2]=p*h-f,n[6]=o*u,n[10]=_*h+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(EM,e,bM)}lookAt(e,n,i){const s=this.elements;return Kt.subVectors(e,n),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),qn.crossVectors(i,Kt),qn.lengthSq()===0&&(Math.abs(i.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),qn.crossVectors(i,Kt)),qn.normalize(),lr.crossVectors(Kt,qn),s[0]=qn.x,s[4]=lr.x,s[8]=Kt.x,s[1]=qn.y,s[5]=lr.y,s[9]=Kt.y,s[2]=qn.z,s[6]=lr.z,s[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],h=i[5],d=i[9],f=i[13],p=i[2],_=i[6],m=i[10],g=i[14],A=i[3],w=i[7],v=i[11],S=i[15],y=s[0],T=s[4],M=s[8],b=s[12],P=s[1],C=s[5],I=s[9],X=s[13],H=s[2],D=s[6],W=s[10],B=s[14],q=s[3],te=s[7],re=s[11],ce=s[15];return r[0]=a*y+o*P+c*H+l*q,r[4]=a*T+o*C+c*D+l*te,r[8]=a*M+o*I+c*W+l*re,r[12]=a*b+o*X+c*B+l*ce,r[1]=u*y+h*P+d*H+f*q,r[5]=u*T+h*C+d*D+f*te,r[9]=u*M+h*I+d*W+f*re,r[13]=u*b+h*X+d*B+f*ce,r[2]=p*y+_*P+m*H+g*q,r[6]=p*T+_*C+m*D+g*te,r[10]=p*M+_*I+m*W+g*re,r[14]=p*b+_*X+m*B+g*ce,r[3]=A*y+w*P+v*H+S*q,r[7]=A*T+w*C+v*D+S*te,r[11]=A*M+w*I+v*W+S*re,r[15]=A*b+w*X+v*B+S*ce,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],f=e[14],p=e[3],_=e[7],m=e[11],g=e[15],A=c*f-l*d,w=o*f-l*h,v=o*d-c*h,S=a*f-l*u,y=a*d-c*u,T=a*h-o*u;return n*(_*A-m*w+g*v)-i*(p*A-m*S+g*y)+s*(p*w-_*S+g*T)-r*(p*v-_*y+m*T)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],u=e[10];return n*(a*u-o*l)-i*(r*u-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=n,s[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],f=e[11],p=e[12],_=e[13],m=e[14],g=e[15],A=n*o-i*a,w=n*c-s*a,v=n*l-r*a,S=i*c-s*o,y=i*l-r*o,T=s*l-r*c,M=u*_-h*p,b=u*m-d*p,P=u*g-f*p,C=h*m-d*_,I=h*g-f*_,X=d*g-f*m,H=A*X-w*I+v*C+S*P-y*b+T*M;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/H;return e[0]=(o*X-c*I+l*C)*D,e[1]=(s*I-i*X-r*C)*D,e[2]=(_*T-m*y+g*S)*D,e[3]=(d*y-h*T-f*S)*D,e[4]=(c*P-a*X-l*b)*D,e[5]=(n*X-s*P+r*b)*D,e[6]=(m*v-p*T-g*w)*D,e[7]=(u*T-d*v+f*w)*D,e[8]=(a*I-o*P+l*M)*D,e[9]=(i*P-n*I-r*M)*D,e[10]=(p*y-_*v+g*A)*D,e[11]=(h*v-u*y-f*A)*D,e[12]=(o*b-a*C-c*M)*D,e[13]=(n*C-i*b+s*M)*D,e[14]=(_*w-p*S-m*A)*D,e[15]=(u*S-h*w+d*A)*D,this}scale(e){const n=this.elements,i=e.x,s=e.y,r=e.z;return n[0]*=i,n[4]*=s,n[8]*=r,n[1]*=i,n[5]*=s,n[9]*=r,n[2]*=i,n[6]*=s,n[10]*=r,n[3]*=i,n[7]*=s,n[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),s=Math.sin(n),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,u=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+i,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,n,s,1,0,0,0,0,1),this}compose(e,n,i){const s=this.elements,r=n._x,a=n._y,o=n._z,c=n._w,l=r+r,u=a+a,h=o+o,d=r*l,f=r*u,p=r*h,_=a*u,m=a*h,g=o*h,A=c*l,w=c*u,v=c*h,S=i.x,y=i.y,T=i.z;return s[0]=(1-(_+g))*S,s[1]=(f+v)*S,s[2]=(p-w)*S,s[3]=0,s[4]=(f-v)*y,s[5]=(1-(d+g))*y,s[6]=(m+A)*y,s[7]=0,s[8]=(p+w)*T,s[9]=(m-A)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,n,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),n.identity(),this;let a=Bi.set(s[0],s[1],s[2]).length();const o=Bi.set(s[4],s[5],s[6]).length(),c=Bi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),cn.copy(this);const l=1/a,u=1/o,h=1/c;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=u,cn.elements[5]*=u,cn.elements[6]*=u,cn.elements[8]*=h,cn.elements[9]*=h,cn.elements[10]*=h,n.setFromRotationMatrix(cn),i.x=a,i.y=o,i.z=c,this}makePerspective(e,n,i,s,r,a,o=bn,c=!1){const l=this.elements,u=2*r/(n-e),h=2*r/(i-s),d=(n+e)/(n-e),f=(i+s)/(i-s);let p,_;if(c)p=r/(a-r),_=a*r/(a-r);else if(o===bn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Gs)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,s,r,a,o=bn,c=!1){const l=this.elements,u=2/(n-e),h=2/(i-s),d=-(n+e)/(n-e),f=-(i+s)/(i-s);let p,_;if(c)p=1/(a-r),_=a/(a-r);else if(o===bn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===Gs)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};da.prototype.isMatrix4=!0;let lt=da;const Bi=new U,cn=new lt,EM=new U(0,0,0),bM=new U(1,1,1),qn=new U,lr=new U,Kt=new U,ad=new lt,od=new ai;class oi{constructor(e=0,n=0,i=0,s=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,s=this._order){return this._x=e,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(n){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ge(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ge(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return ad.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ad,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return od.setFromEuler(this),this.setFromQuaternion(od,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class hh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let AM=0;const cd=new U,Vi=new ai,In=new lt,dr=new U,ys=new U,TM=new U,wM=new ai,ld=new U(1,0,0),dd=new U(0,1,0),ud=new U(0,0,1),hd={type:"added"},RM={type:"removed"},zi={type:"childadded",child:null},Fa={type:"childremoved",child:null};class Ct extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:AM++}),this.uuid=hs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new U,n=new oi,i=new ai,s=new U(1,1,1);function r(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new lt},normalMatrix:{value:new Ue}}),this.matrix=new lt,this.matrixWorld=new lt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Vi.setFromAxisAngle(e,n),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,n){return Vi.setFromAxisAngle(e,n),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(ld,e)}rotateY(e){return this.rotateOnAxis(dd,e)}rotateZ(e){return this.rotateOnAxis(ud,e)}translateOnAxis(e,n){return cd.copy(e).applyQuaternion(this.quaternion),this.position.add(cd.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(ld,e)}translateY(e){return this.translateOnAxis(dd,e)}translateZ(e){return this.translateOnAxis(ud,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?dr.copy(e):dr.set(e,n,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(ys,dr,this.up):In.lookAt(dr,ys,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Vi.setFromRotationMatrix(In),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(Ye("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hd),zi.child=e,this.dispatchEvent(zi),zi.child=null):Ye("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(RM),Fa.child=e,this.dispatchEvent(Fa),Fa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hd),zi.child=e,this.dispatchEvent(zi),zi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,e,TM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,wM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=n-r[0]*n-r[4]*i-r[8]*s,r[13]+=i-r[1]*n-r[5]*i-r[9]*s,r[14]+=s-r[2]*n-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(n){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new U(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ds extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const CM={type:"move"};class Ua{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ds,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ds,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ds,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const m=n.getJointPose(_,i),g=this._getHandJoint(l,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=n.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=n.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(CM)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Ds;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const fh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},ur={h:0,s:0,l:0};function Oa(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class $e{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.colorSpaceToWorking(this,n),this}setRGB(e,n,i,s=We.workingColorSpace){return this.r=e,this.g=n,this.b=i,We.colorSpaceToWorking(this,s),this}setHSL(e,n,i,s=We.workingColorSpace){if(e=kc(e,1),n=Ge(n,0,1),i=Ge(i,0,1),n===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+n):i+n-i*n,a=2*i-r;this.r=Oa(a,r,e+1/3),this.g=Oa(a,r,e),this.b=Oa(a,r,e-1/3)}return We.colorSpaceToWorking(this,s),this}setStyle(e,n=jt){function i(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,n);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,n);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,n);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(r,16),n);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=jt){const i=fh[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=rs(e.r),this.g=rs(e.g),this.b=rs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=jt){return We.workingToColorSpace(Nt.copy(this),e),Math.round(Ge(Nt.r*255,0,255))*65536+Math.round(Ge(Nt.g*255,0,255))*256+Math.round(Ge(Nt.b*255,0,255))}getHexString(e=jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=We.workingColorSpace){We.workingToColorSpace(Nt.copy(this),n);const i=Nt.r,s=Nt.g,r=Nt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case i:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-i)/h+2;break;case r:c=(i-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,n=We.workingColorSpace){return We.workingToColorSpace(Nt.copy(this),n),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=jt){We.workingToColorSpace(Nt.copy(this),e);const n=Nt.r,i=Nt.g,s=Nt.b;return e!==jt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,n,i){return this.getHSL(Yn),this.setHSL(Yn.h+e,Yn.s+n,Yn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Yn),e.getHSL(ur);const i=ks(Yn.h,ur.h,n),s=ks(Yn.s,ur.s,n),r=ks(Yn.l,ur.l,n);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*n+r[3]*i+r[6]*s,this.g=r[1]*n+r[4]*i+r[7]*s,this.b=r[2]*n+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new $e;$e.NAMES=fh;class Vc{constructor(e,n=25e-5){this.isFogExp2=!0,this.name="",this.color=new $e(e),this.density=n}clone(){return new Vc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class PM extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const ln=new U,Ln=new U,ka=new U,Dn=new U,Hi=new U,Gi=new U,fd=new U,Ba=new U,Va=new U,za=new U,Ha=new dt,Ga=new dt,$a=new dt;class hn{constructor(e=new U,n=new U,i=new U){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,s){s.subVectors(i,n),ln.subVectors(e,n),s.cross(ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,n,i,s,r){ln.subVectors(s,n),Ln.subVectors(i,n),ka.subVectors(e,n);const a=ln.dot(ln),o=ln.dot(Ln),c=ln.dot(ka),l=Ln.dot(Ln),u=Ln.dot(ka),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(l*c-o*u)*d,p=(a*u-o*c)*d;return r.set(1-f-p,p,f)}static containsPoint(e,n,i,s){return this.getBarycoord(e,n,i,s,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,n,i,s,r,a,o,c){return this.getBarycoord(e,n,i,s,Dn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Dn.x),c.addScaledVector(a,Dn.y),c.addScaledVector(o,Dn.z),c)}static getInterpolatedAttribute(e,n,i,s,r,a){return Ha.setScalar(0),Ga.setScalar(0),$a.setScalar(0),Ha.fromBufferAttribute(e,n),Ga.fromBufferAttribute(e,i),$a.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ha,r.x),a.addScaledVector(Ga,r.y),a.addScaledVector($a,r.z),a}static isFrontFacing(e,n,i,s){return ln.subVectors(i,n),Ln.subVectors(e,n),ln.cross(Ln).dot(s)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,s){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,n,i,s){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),ln.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return hn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,s,r){return hn.getInterpolation(e,this.a,this.b,this.c,n,i,s,r)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,s=this.b,r=this.c;let a,o;Hi.subVectors(s,i),Gi.subVectors(r,i),Ba.subVectors(e,i);const c=Hi.dot(Ba),l=Gi.dot(Ba);if(c<=0&&l<=0)return n.copy(i);Va.subVectors(e,s);const u=Hi.dot(Va),h=Gi.dot(Va);if(u>=0&&h<=u)return n.copy(s);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return a=c/(c-u),n.copy(i).addScaledVector(Hi,a);za.subVectors(e,r);const f=Hi.dot(za),p=Gi.dot(za);if(p>=0&&f<=p)return n.copy(r);const _=f*l-c*p;if(_<=0&&l>=0&&p<=0)return o=l/(l-p),n.copy(i).addScaledVector(Gi,o);const m=u*p-f*h;if(m<=0&&h-u>=0&&f-p>=0)return fd.subVectors(r,s),o=(h-u)/(h-u+(f-p)),n.copy(s).addScaledVector(fd,o);const g=1/(m+_+d);return a=_*g,o=d*g,n.copy(i).addScaledVector(Hi,a).addScaledVector(Gi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class fs{constructor(e=new U(1/0,1/0,1/0),n=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(dn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(dn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=dn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(n===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,dn):dn.fromBufferAttribute(r,a),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),hr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),hr.copy(i.boundingBox)),hr.applyMatrix4(e.matrixWorld),this.union(hr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ss),fr.subVectors(this.max,Ss),$i.subVectors(e.a,Ss),Wi.subVectors(e.b,Ss),Xi.subVectors(e.c,Ss),Kn.subVectors(Wi,$i),Zn.subVectors(Xi,Wi),di.subVectors($i,Xi);let n=[0,-Kn.z,Kn.y,0,-Zn.z,Zn.y,0,-di.z,di.y,Kn.z,0,-Kn.x,Zn.z,0,-Zn.x,di.z,0,-di.x,-Kn.y,Kn.x,0,-Zn.y,Zn.x,0,-di.y,di.x,0];return!Wa(n,$i,Wi,Xi,fr)||(n=[1,0,0,0,1,0,0,0,1],!Wa(n,$i,Wi,Xi,fr))?!1:(pr.crossVectors(Kn,Zn),n=[pr.x,pr.y,pr.z],Wa(n,$i,Wi,Xi,fr))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Nn=[new U,new U,new U,new U,new U,new U,new U,new U],dn=new U,hr=new fs,$i=new U,Wi=new U,Xi=new U,Kn=new U,Zn=new U,di=new U,Ss=new U,fr=new U,pr=new U,ui=new U;function Wa(t,e,n,i,s){for(let r=0,a=t.length-3;r<=a;r+=3){ui.fromArray(t,r);const o=s.x*Math.abs(ui.x)+s.y*Math.abs(ui.y)+s.z*Math.abs(ui.z),c=e.dot(ui),l=n.dot(ui),u=i.dot(ui);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const yt=new U,mr=new Fe;let IM=0;class wn extends ci{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:IM++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=jl,this.updateRanges=[],this.gpuType=En,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=n.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)mr.fromBufferAttribute(this,n),mr.applyMatrix3(e),this.setXY(n,mr.x,mr.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.applyMatrix3(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.applyMatrix4(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.applyNormalMatrix(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)yt.fromBufferAttribute(this,n),yt.transformDirection(e),this.setXYZ(n,yt.x,yt.y,yt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Ji(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Ot(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ji(n,this.array)),n}setX(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ji(n,this.array)),n}setY(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ji(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ji(n,this.array)),n}setW(e,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Ot(n,this.array),i=Ot(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,s){return e*=this.itemSize,this.normalized&&(n=Ot(n,this.array),i=Ot(i,this.array),s=Ot(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,n,i,s,r){return e*=this.itemSize,this.normalized&&(n=Ot(n,this.array),i=Ot(i,this.array),s=Ot(s,this.array),r=Ot(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==jl&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class ph extends wn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class mh extends wn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Vt extends wn{constructor(e,n,i){super(new Float32Array(e),n,i)}}const LM=new fs,Es=new U,Xa=new U;class Ks{constructor(e=new U,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):LM.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Es.subVectors(e,this.center);const n=Es.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Es,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Xa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Es.copy(e.center).add(Xa)),this.expandByPoint(Es.copy(e.center).sub(Xa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let DM=0;const sn=new lt,qa=new Ct,qi=new U,Zt=new fs,bs=new fs,wt=new U;class zt extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:DM++}),this.uuid=hs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Jv(e)?mh:ph)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ue().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return sn.makeRotationFromQuaternion(e),this.applyMatrix4(sn),this}rotateX(e){return sn.makeRotationX(e),this.applyMatrix4(sn),this}rotateY(e){return sn.makeRotationY(e),this.applyMatrix4(sn),this}rotateZ(e){return sn.makeRotationZ(e),this.applyMatrix4(sn),this}translate(e,n,i){return sn.makeTranslation(e,n,i),this.applyMatrix4(sn),this}scale(e,n,i){return sn.makeScale(e,n,i),this.applyMatrix4(sn),this}lookAt(e){return qa.lookAt(e),qa.updateMatrix(),this.applyMatrix4(qa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qi).negate(),this.translate(qi.x,qi.y,qi.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Vt(i,3))}else{const i=Math.min(e.length,n.count);for(let s=0;s<i;s++){const r=e[s];n.setXYZ(s,r.x,r.y,r.z||0)}e.length>n.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,s=n.length;i<s;i++){const r=n[i];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ye('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ks);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ye("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),n)for(let r=0,a=n.length;r<a;r++){const o=n[r];bs.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(Zt.min,bs.min),Zt.expandByPoint(wt),wt.addVectors(Zt.max,bs.max),Zt.expandByPoint(wt)):(Zt.expandByPoint(bs.min),Zt.expandByPoint(bs.max))}Zt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(wt));if(n)for(let r=0,a=n.length;r<a;r++){const o=n[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)wt.fromBufferAttribute(o,l),c&&(qi.fromBufferAttribute(e,l),wt.add(qi)),s=Math.max(s,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ye('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){Ye("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,s=n.normal,r=n.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new wn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let M=0;M<i.count;M++)o[M]=new U,c[M]=new U;const l=new U,u=new U,h=new U,d=new Fe,f=new Fe,p=new Fe,_=new U,m=new U;function g(M,b,P){l.fromBufferAttribute(i,M),u.fromBufferAttribute(i,b),h.fromBufferAttribute(i,P),d.fromBufferAttribute(r,M),f.fromBufferAttribute(r,b),p.fromBufferAttribute(r,P),u.sub(l),h.sub(l),f.sub(d),p.sub(d);const C=1/(f.x*p.y-p.x*f.y);isFinite(C)&&(_.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(C),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(C),o[M].add(_),o[b].add(_),o[P].add(_),c[M].add(m),c[b].add(m),c[P].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let M=0,b=A.length;M<b;++M){const P=A[M],C=P.start,I=P.count;for(let X=C,H=C+I;X<H;X+=3)g(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const w=new U,v=new U,S=new U,y=new U;function T(M){S.fromBufferAttribute(s,M),y.copy(S);const b=o[M];w.copy(b),w.sub(S.multiplyScalar(S.dot(b))).normalize(),v.crossVectors(y,b);const C=v.dot(c[M])<0?-1:1;a.setXYZW(M,w.x,w.y,w.z,C)}for(let M=0,b=A.length;M<b;++M){const P=A[M],C=P.start,I=P.count;for(let X=C,H=C+I;X<H;X+=3)T(e.getX(X+0)),T(e.getX(X+1)),T(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new wn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,u=new U,h=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(n,p),r.fromBufferAttribute(n,_),a.fromBufferAttribute(n,m),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(i,p),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),o.add(u),c.add(u),l.add(u),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=n.count;d<f;d+=3)s.fromBufferAttribute(n,d+0),r.fromBufferAttribute(n,d+1),a.fromBufferAttribute(n,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)wt.fromBufferAttribute(e,n),wt.normalize(),e.setXYZ(n,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,h=o.normalized,d=new l.constructor(c.length*u);let f=0,p=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*u;for(let g=0;g<u;g++)d[p++]=l[f++]}return new wn(d,u,h)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new zt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,i);n.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=e(d,i);c.push(f)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(n))}const r=e.morphAttributes;for(const l in r){const u=[],h=r[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(n));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let NM=0;class Ii extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:NM++}),this.uuid=hs(),this.name="",this.type="Material",this.blending=is,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=So,this.blendDst=Eo,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=as,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Le(`Material: parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Le(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==is&&(i.blending=this.blending),this.side!==ri&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==So&&(i.blendSrc=this.blendSrc),this.blendDst!==Eo&&(i.blendDst=this.blendDst),this.blendEquation!==gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==as&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(n){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new $e().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Fe().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Fe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const s=n.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=n[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Fn=new U,Ya=new U,gr=new U,Jn=new U,Ka=new U,_r=new U,Za=new U;class ga{constructor(e=new U,n=new U(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fn)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Fn.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Fn.copy(this.origin).addScaledVector(this.direction,n),Fn.distanceToSquared(e))}distanceSqToSegment(e,n,i,s){Ya.copy(e).add(n).multiplyScalar(.5),gr.copy(n).sub(e).normalize(),Jn.copy(this.origin).sub(Ya);const r=e.distanceTo(n)*.5,a=-this.direction.dot(gr),o=Jn.dot(this.direction),c=-Jn.dot(gr),l=Jn.lengthSq(),u=Math.abs(1-a*a);let h,d,f,p;if(u>0)if(h=a*c-o,d=a*o-c,p=r*u,h>=0)if(d>=-p)if(d<=p){const _=1/u;h*=_,d*=_,f=h*(h+a*d+2*o)+d*(a*h+d+2*c)+l}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*c)+l;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*c)+l;else d<=-p?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l):d<=p?(h=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Ya).addScaledVector(gr,d),f}intersectSphere(e,n){Fn.subVectors(e.center,this.origin);const i=Fn.dot(this.direction),s=Fn.dot(Fn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,s,r,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(e){return this.intersectBox(e,Fn)!==null}intersectTriangle(e,n,i,s,r){Ka.subVectors(n,e),_r.subVectors(i,e),Za.crossVectors(Ka,_r);let a=this.direction.dot(Za),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jn.subVectors(this.origin,e);const c=o*this.direction.dot(_r.crossVectors(Jn,_r));if(c<0)return null;const l=o*this.direction.dot(Ka.cross(Jn));if(l<0||c+l>a)return null;const u=-o*Jn.dot(Za);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class gh extends Ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=qu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pd=new lt,hi=new ga,xr=new Ks,md=new U,vr=new U,Mr=new U,yr=new U,Ja=new U,Sr=new U,gd=new U,Er=new U;class pn extends Ct{constructor(e=new zt,n=new gh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,n){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Sr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=o[c],h=r[c];u!==0&&(Ja.fromBufferAttribute(h,e),a?Sr.addScaledVector(Ja,u):Sr.addScaledVector(Ja.sub(n),u))}n.add(Sr)}return n}raycast(e,n){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),xr.copy(i.boundingSphere),xr.applyMatrix4(r),hi.copy(e.ray).recast(e.near),!(xr.containsPoint(hi.origin)===!1&&(hi.intersectSphere(xr,md)===null||hi.origin.distanceToSquared(md)>(e.far-e.near)**2))&&(pd.copy(r).invert(),hi.copy(e.ray).applyMatrix4(pd),!(i.boundingBox!==null&&hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,hi)))}_computeIntersections(e,n,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],A=Math.max(m.start,f.start),w=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let v=A,S=w;v<S;v+=3){const y=o.getX(v),T=o.getX(v+1),M=o.getX(v+2);s=br(this,g,e,i,l,u,h,y,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const A=o.getX(m),w=o.getX(m+1),v=o.getX(m+2);s=br(this,a,e,i,l,u,h,A,w,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],A=Math.max(m.start,f.start),w=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=A,S=w;v<S;v+=3){const y=v,T=v+1,M=v+2;s=br(this,g,e,i,l,u,h,y,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const A=m,w=m+1,v=m+2;s=br(this,a,e,i,l,u,h,A,w,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}}}function FM(t,e,n,i,s,r,a,o){let c;if(e.side===qt?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===ri,o),c===null)return null;Er.copy(o),Er.applyMatrix4(t.matrixWorld);const l=n.ray.origin.distanceTo(Er);return l<n.near||l>n.far?null:{distance:l,point:Er.clone(),object:t}}function br(t,e,n,i,s,r,a,o,c,l){t.getVertexPosition(o,vr),t.getVertexPosition(c,Mr),t.getVertexPosition(l,yr);const u=FM(t,e,n,i,vr,Mr,yr,gd);if(u){const h=new U;hn.getBarycoord(gd,vr,Mr,yr,h),s&&(u.uv=hn.getInterpolatedAttribute(s,o,c,l,h,new Fe)),r&&(u.uv1=hn.getInterpolatedAttribute(r,o,c,l,h,new Fe)),a&&(u.normal=hn.getInterpolatedAttribute(a,o,c,l,h,new U),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new U,materialIndex:0};hn.getNormal(vr,Mr,yr,d.normal),u.face=d,u.barycoord=h}return u}class UM extends Bt{constructor(e=null,n=1,i=1,s,r,a,o,c,l=It,u=It,h,d){super(null,a,o,c,l,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ja=new U,OM=new U,kM=new Ue;class Qn{constructor(e=new U(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,s){return this.normal.set(e,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const s=ja.subVectors(i,n).cross(OM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const s=e.delta(ja),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:n.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||kM.getNormalMatrix(e),s=this.coplanarPoint(ja).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new Ks,BM=new Fe(.5,.5),Ar=new U;class zc{constructor(e=new Qn,n=new Qn,i=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,n,i,s,r,a]}set(e,n,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=bn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],_=r[9],m=r[10],g=r[11],A=r[12],w=r[13],v=r[14],S=r[15];if(s[0].setComponents(l-a,f-u,g-p,S-A).normalize(),s[1].setComponents(l+a,f+u,g+p,S+A).normalize(),s[2].setComponents(l+o,f+h,g+_,S+w).normalize(),s[3].setComponents(l-o,f-h,g-_,S-w).normalize(),i)s[4].setComponents(c,d,m,v).normalize(),s[5].setComponents(l-c,f-d,g-m,S-v).normalize();else if(s[4].setComponents(l-c,f-d,g-m,S-v).normalize(),n===bn)s[5].setComponents(l+c,f+d,g+m,S+v).normalize();else if(n===Gs)s[5].setComponents(c,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),fi.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(e){fi.center.set(0,0,0);const n=BM.distanceTo(e.center);return fi.radius=.7071067811865476+n,fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(e){const n=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(n[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const s=n[i];if(Ar.x=s.normal.x>0?e.max.x:e.min.x,Ar.y=s.normal.y>0?e.max.y:e.min.y,Ar.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ar)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class _a extends Ii{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $e(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ca=new U,la=new U,_d=new lt,As=new ga,Tr=new Ks,Qa=new U,xd=new U;class dc extends Ct{constructor(e=new zt,n=new _a){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let s=1,r=n.count;s<r;s++)ca.fromBufferAttribute(n,s-1),la.fromBufferAttribute(n,s),i[s]=i[s-1],i[s]+=ca.distanceTo(la);e.setAttribute("lineDistance",new Vt(i,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Tr.copy(i.boundingSphere),Tr.applyMatrix4(s),Tr.radius+=r,e.ray.intersectsSphere(Tr)===!1)return;_d.copy(s).invert(),As.copy(e.ray).applyMatrix4(_d);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=l){const g=u.getX(_),A=u.getX(_+1),w=wr(this,e,As,c,g,A,_);w&&n.push(w)}if(this.isLineLoop){const _=u.getX(p-1),m=u.getX(f),g=wr(this,e,As,c,_,m,p-1);g&&n.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=l){const g=wr(this,e,As,c,_,_+1,_);g&&n.push(g)}if(this.isLineLoop){const _=wr(this,e,As,c,p-1,f,p-1);_&&n.push(_)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function wr(t,e,n,i,s,r,a){const o=t.geometry.attributes.position;if(ca.fromBufferAttribute(o,s),la.fromBufferAttribute(o,r),n.distanceSqToSegment(ca,la,Qa,xd)>i)return;Qa.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Qa);if(!(l<e.near||l>e.far))return{distance:l,point:xd.clone().applyMatrix4(t.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:t}}const vd=new U,Md=new U;class VM extends dc{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let s=0,r=n.count;s<r;s+=2)vd.fromBufferAttribute(n,s),Md.fromBufferAttribute(n,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+vd.distanceTo(Md);e.setAttribute("lineDistance",new Vt(i,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class _h extends Ii{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new $e(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const yd=new lt,uc=new ga,Rr=new Ks,Cr=new U;class Sd extends Ct{constructor(e=new zt,n=new _h){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Rr.copy(i.boundingSphere),Rr.applyMatrix4(s),Rr.radius+=r,e.ray.intersectsSphere(Rr)===!1)return;yd.copy(s).invert(),uc.copy(e.ray).applyMatrix4(yd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,h=i.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=d,_=f;p<_;p++){const m=l.getX(p);Cr.fromBufferAttribute(h,m),Ed(Cr,m,c,s,e,n,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let p=d,_=f;p<_;p++)Cr.fromBufferAttribute(h,p),Ed(Cr,p,c,s,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ed(t,e,n,i,s,r,a){const o=uc.distanceSqToPoint(t);if(o<n){const c=new U;uc.closestPointToPoint(t,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class xh extends Bt{constructor(e=[],n=Ti,i,s,r,a,o,c,l,u){super(e,n,i,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class cs extends Bt{constructor(e,n,i=Rn,s,r,a,o=It,c=It,l,u=zn,h=1){if(u!==zn&&u!==Mi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:n,depth:h};super(d,s,r,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Bc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class zM extends cs{constructor(e,n=Rn,i=Ti,s,r,a=It,o=It,c,l=zn){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,n,i,s,r,a,o,c,l),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class vh extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Zs extends zt{constructor(e=1,n=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],u=[],h=[];let d=0,f=0;p("z","y","x",-1,-1,i,n,e,a,r,0),p("z","y","x",1,-1,i,n,-e,a,r,1),p("x","z","y",1,1,e,i,n,s,a,2),p("x","z","y",1,-1,e,i,-n,s,a,3),p("x","y","z",1,-1,e,n,i,s,r,4),p("x","y","z",-1,-1,e,n,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Vt(l,3)),this.setAttribute("normal",new Vt(u,3)),this.setAttribute("uv",new Vt(h,2));function p(_,m,g,A,w,v,S,y,T,M,b){const P=v/T,C=S/M,I=v/2,X=S/2,H=y/2,D=T+1,W=M+1;let B=0,q=0;const te=new U;for(let re=0;re<W;re++){const ce=re*C-X;for(let ae=0;ae<D;ae++){const ze=ae*P-I;te[_]=ze*A,te[m]=ce*w,te[g]=H,l.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[g]=y>0?1:-1,u.push(te.x,te.y,te.z),h.push(ae/T),h.push(1-re/M),B+=1}}for(let re=0;re<M;re++)for(let ce=0;ce<T;ce++){const ae=d+ce+D*re,ze=d+ce+D*(re+1),Je=d+(ce+1)+D*(re+1),He=d+(ce+1)+D*re;c.push(ae,ze,He),c.push(ze,Je,He),q+=6}o.addGroup(f,q,b),f+=q,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function HM(t,e,n=2){const i=e&&e.length,s=i?e[0]*n:t.length;let r=Mh(t,0,s,n,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=qM(t,e,r,n)),t.length>80*n){o=t[0],c=t[1];let u=o,h=c;for(let d=n;d<s;d+=n){const f=t[d],p=t[d+1];f<o&&(o=f),p<c&&(c=p),f>u&&(u=f),p>h&&(h=p)}l=Math.max(u-o,h-c),l=l!==0?32767/l:0}return Ws(r,a,n,o,c,l,0),a}function Mh(t,e,n,i,s){let r;if(s===sy(t,e,n,i)>0)for(let a=e;a<n;a+=i)r=bd(a/i|0,t[a],t[a+1],r);else for(let a=n-i;a>=e;a-=i)r=bd(a/i|0,t[a],t[a+1],r);return r&&ls(r,r.next)&&(qs(r),r=r.next),r}function Ri(t,e){if(!t)return t;e||(e=t);let n=t,i;do if(i=!1,!n.steiner&&(ls(n,n.next)||ut(n.prev,n,n.next)===0)){if(qs(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function Ws(t,e,n,i,s,r,a){if(!t)return;!a&&r&&jM(t,i,s,r);let o=t;for(;t.prev!==t.next;){const c=t.prev,l=t.next;if(r?$M(t,i,s,r):GM(t)){e.push(c.i,t.i,l.i),qs(t),t=l.next,o=l.next;continue}if(t=l,t===o){a?a===1?(t=WM(Ri(t),e),Ws(t,e,n,i,s,r,2)):a===2&&XM(t,e,n,i,s,r):Ws(Ri(t),e,n,i,s,r,1);break}}}function GM(t){const e=t.prev,n=t,i=t.next;if(ut(e,n,i)>=0)return!1;const s=e.x,r=n.x,a=i.x,o=e.y,c=n.y,l=i.y,u=Math.min(s,r,a),h=Math.min(o,c,l),d=Math.max(s,r,a),f=Math.max(o,c,l);let p=i.next;for(;p!==e;){if(p.x>=u&&p.x<=d&&p.y>=h&&p.y<=f&&Ns(s,o,r,c,a,l,p.x,p.y)&&ut(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function $M(t,e,n,i){const s=t.prev,r=t,a=t.next;if(ut(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,u=s.y,h=r.y,d=a.y,f=Math.min(o,c,l),p=Math.min(u,h,d),_=Math.max(o,c,l),m=Math.max(u,h,d),g=hc(f,p,e,n,i),A=hc(_,m,e,n,i);let w=t.prevZ,v=t.nextZ;for(;w&&w.z>=g&&v&&v.z<=A;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==s&&w!==a&&Ns(o,u,c,h,l,d,w.x,w.y)&&ut(w.prev,w,w.next)>=0||(w=w.prevZ,v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&Ns(o,u,c,h,l,d,v.x,v.y)&&ut(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;w&&w.z>=g;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==s&&w!==a&&Ns(o,u,c,h,l,d,w.x,w.y)&&ut(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;v&&v.z<=A;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&Ns(o,u,c,h,l,d,v.x,v.y)&&ut(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function WM(t,e){let n=t;do{const i=n.prev,s=n.next.next;!ls(i,s)&&Sh(i,n,n.next,s)&&Xs(i,s)&&Xs(s,i)&&(e.push(i.i,n.i,s.i),qs(n),qs(n.next),n=t=s),n=n.next}while(n!==t);return Ri(n)}function XM(t,e,n,i,s,r){let a=t;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&ty(a,o)){let c=Eh(a,o);a=Ri(a,a.next),c=Ri(c,c.next),Ws(a,e,n,i,s,r,0),Ws(c,e,n,i,s,r,0);return}o=o.next}a=a.next}while(a!==t)}function qM(t,e,n,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=Mh(t,o,c,i,!1);l===l.next&&(l.steiner=!0),s.push(ey(l))}s.sort(YM);for(let r=0;r<s.length;r++)n=KM(s[r],n);return n}function YM(t,e){let n=t.x-e.x;if(n===0&&(n=t.y-e.y,n===0)){const i=(t.next.y-t.y)/(t.next.x-t.x),s=(e.next.y-e.y)/(e.next.x-e.x);n=i-s}return n}function KM(t,e){const n=ZM(t,e);if(!n)return e;const i=Eh(n,t);return Ri(i,i.next),Ri(n,n.next)}function ZM(t,e){let n=e;const i=t.x,s=t.y;let r=-1/0,a;if(ls(t,n))return n;do{if(ls(t,n.next))return n.next;if(s<=n.y&&s>=n.next.y&&n.next.y!==n.y){const h=n.x+(s-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(h<=i&&h>r&&(r=h,a=n.x<n.next.x?n:n.next,h===i))return a}n=n.next}while(n!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let u=1/0;n=a;do{if(i>=n.x&&n.x>=c&&i!==n.x&&yh(s<l?i:r,s,c,l,s<l?r:i,s,n.x,n.y)){const h=Math.abs(s-n.y)/(i-n.x);Xs(n,t)&&(h<u||h===u&&(n.x>a.x||n.x===a.x&&JM(a,n)))&&(a=n,u=h)}n=n.next}while(n!==o);return a}function JM(t,e){return ut(t.prev,t,e.prev)<0&&ut(e.next,t,t.next)<0}function jM(t,e,n,i){let s=t;do s.z===0&&(s.z=hc(s.x,s.y,e,n,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==t);s.prevZ.nextZ=null,s.prevZ=null,QM(s)}function QM(t){let e,n=1;do{let i=t,s;t=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let l=0;l<n&&(o++,a=a.nextZ,!!a);l++);let c=n;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:t=s,s.prevZ=r,r=s;i=a}r.nextZ=null,n*=2}while(e>1);return t}function hc(t,e,n,i,s){return t=(t-n)*s|0,e=(e-i)*s|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function ey(t){let e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function yh(t,e,n,i,s,r,a,o){return(s-a)*(e-o)>=(t-a)*(r-o)&&(t-a)*(i-o)>=(n-a)*(e-o)&&(n-a)*(r-o)>=(s-a)*(i-o)}function Ns(t,e,n,i,s,r,a,o){return!(t===a&&e===o)&&yh(t,e,n,i,s,r,a,o)}function ty(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!ny(t,e)&&(Xs(t,e)&&Xs(e,t)&&iy(t,e)&&(ut(t.prev,t,e.prev)||ut(t,e.prev,e))||ls(t,e)&&ut(t.prev,t,t.next)>0&&ut(e.prev,e,e.next)>0)}function ut(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function ls(t,e){return t.x===e.x&&t.y===e.y}function Sh(t,e,n,i){const s=Ir(ut(t,e,n)),r=Ir(ut(t,e,i)),a=Ir(ut(n,i,t)),o=Ir(ut(n,i,e));return!!(s!==r&&a!==o||s===0&&Pr(t,n,e)||r===0&&Pr(t,i,e)||a===0&&Pr(n,t,i)||o===0&&Pr(n,e,i))}function Pr(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function Ir(t){return t>0?1:t<0?-1:0}function ny(t,e){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&Sh(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function Xs(t,e){return ut(t.prev,t,t.next)<0?ut(t,e,t.next)>=0&&ut(t,t.prev,e)>=0:ut(t,e,t.prev)<0||ut(t,t.next,e)<0}function iy(t,e){let n=t,i=!1;const s=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&s<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function Eh(t,e){const n=fc(t.i,t.x,t.y),i=fc(e.i,e.x,e.y),s=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=s,s.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function bd(t,e,n,i){const s=fc(t,e,n);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function qs(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function fc(t,e,n){return{i:t,x:e,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function sy(t,e,n,i){let s=0;for(let r=e,a=n-i;r<n;r+=i)s+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return s}class ry{static triangulate(e,n,i=2){return HM(e,n,i)}}class Hc{static area(e){const n=e.length;let i=0;for(let s=n-1,r=0;r<n;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Hc.area(e)<0}static triangulateShape(e,n){const i=[],s=[],r=[];Ad(e),Td(i,e);let a=e.length;n.forEach(Ad);for(let c=0;c<n.length;c++)s.push(a),a+=n[c].length,Td(i,n[c]);const o=ry.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Ad(t){const e=t.length;e>2&&t[e-1].equals(t[0])&&t.pop()}function Td(t,e){for(let n=0;n<e.length;n++)t.push(e[n].x),t.push(e[n].y)}class xa extends zt{constructor(e=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:s};const r=e/2,a=n/2,o=Math.floor(i),c=Math.floor(s),l=o+1,u=c+1,h=e/o,d=n/c,f=[],p=[],_=[],m=[];for(let g=0;g<u;g++){const A=g*d-a;for(let w=0;w<l;w++){const v=w*h-r;p.push(v,-A,0),_.push(0,0,1),m.push(w/o),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let A=0;A<o;A++){const w=A+l*g,v=A+l*(g+1),S=A+1+l*(g+1),y=A+1+l*g;f.push(w,v,y),f.push(v,S,y)}this.setIndex(f),this.setAttribute("position",new Vt(p,3)),this.setAttribute("normal",new Vt(_,3)),this.setAttribute("uv",new Vt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xa(e.width,e.height,e.widthSegments,e.heightSegments)}}function ds(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const s=t[n][i];if(wd(s))s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=s.clone();else if(Array.isArray(s))if(wd(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[n][i]=r}else e[n][i]=s.slice();else e[n][i]=s}}return e}function kt(t){const e={};for(let n=0;n<t.length;n++){const i=ds(t[n]);for(const s in i)e[s]=i[s]}return e}function wd(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function ay(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function bh(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:We.workingColorSpace}const oy={clone:ds,merge:kt};var cy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ly=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends Ii{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cy,this.fragmentShader=ly,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ds(e.uniforms),this.uniformsGroups=ay(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?n.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[s]={type:"m4",value:a.toArray()}:n.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new $e().setHex(s.value);break;case"v2":this.uniforms[i].value=new Fe().fromArray(s.value);break;case"v3":this.uniforms[i].value=new U().fromArray(s.value);break;case"v4":this.uniforms[i].value=new dt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Ue().fromArray(s.value);break;case"m4":this.uniforms[i].value=new lt().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class dy extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class uy extends Ii{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new $e(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lc,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class hy extends Ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class fy extends Ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Wr extends _a{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Ah extends Ct{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new $e(e),this.intensity=n}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}const eo=new lt,Rd=new U,Cd=new U;class py{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=en,this.map=null,this.mapPass=null,this.matrix=new lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zc,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Rd.setFromMatrixPosition(e.matrixWorld),n.position.copy(Rd),Cd.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Cd),n.updateMatrixWorld(),eo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(eo,n.coordinateSystem,n.reversedDepth),n.coordinateSystem===Gs||n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(eo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Lr=new U,Dr=new ai,vn=new U;class Th extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new lt,this.projectionMatrix=new lt,this.projectionMatrixInverse=new lt,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Lr,Dr,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lr,Dr,vn.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(Lr,Dr,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lr,Dr,vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const jn=new U,Pd=new Fe,Id=new Fe;class an extends Th{constructor(e=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=$s*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Os*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return $s*2*Math.atan(Math.tan(Os*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,n){return this.getViewBounds(e,Pd,Id),n.subVectors(Id,Pd)}setViewOffset(e,n,i,s,r,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Os*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,n-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class Gc extends Th{constructor(e=-1,n=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+n,c=s-n;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class my extends py{constructor(){super(new Gc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ld extends Ah{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new my}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class gy extends Ah{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const Yi=-90,Ki=1;class _y extends Ct{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(Yi,Ki,e,n);s.layers=this.layers,this.add(s);const r=new an(Yi,Ki,e,n);r.layers=this.layers,this.add(r);const a=new an(Yi,Ki,e,n);a.layers=this.layers,this.add(a);const o=new an(Yi,Ki,e,n);o.layers=this.layers,this.add(o);const c=new an(Yi,Ki,e,n);c.layers=this.layers,this.add(c);const l=new an(Yi,Ki,e,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,s,r,a,o,c]=n;for(const l of n)this.remove(l);if(e===bn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Gs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of n)this.add(l),l.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(h,d,f),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class xy extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Dd{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ge(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ge(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Kc=class Kc{constructor(e,n,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,s){const r=this.elements;return r[0]=e,r[2]=n,r[1]=i,r[3]=s,this}};Kc.prototype.isMatrix2=!0;let Nd=Kc;class vy extends VM{constructor(e=10,n=10,i=4473924,s=8947848){i=new $e(i),s=new $e(s);const r=n/2,a=e/n,o=e/2,c=[],l=[];for(let d=0,f=0,p=-o;d<=n;d++,p+=a){c.push(-o,0,p,o,0,p),c.push(p,0,-o,p,0,o);const _=d===r?i:s;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const u=new zt;u.setAttribute("position",new Vt(c,3)),u.setAttribute("color",new Vt(l,3));const h=new _a({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class My extends ci{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Le("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Fd(t,e,n,i){const s=yy(i);switch(n){case ah:return t*e;case ch:return t*e/s.components*s.byteLength;case Dc:return t*e/s.components*s.byteLength;case wi:return t*e*2/s.components*s.byteLength;case Nc:return t*e*2/s.components*s.byteLength;case oh:return t*e*3/s.components*s.byteLength;case fn:return t*e*4/s.components*s.byteLength;case Fc:return t*e*4/s.components*s.byteLength;case zr:case Hr:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Gr:case $r:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case No:case Uo:return Math.max(t,16)*Math.max(e,8)/4;case Do:case Fo:return Math.max(t,8)*Math.max(e,8)/2;case Oo:case ko:case Vo:case zo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Bo:case ia:case Ho:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Go:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case $o:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Wo:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Xo:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case qo:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Ko:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Zo:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Jo:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case jo:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Qo:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case ec:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case tc:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case nc:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case ic:case sc:case rc:return Math.ceil(t/4)*Math.ceil(e/4)*16;case ac:case oc:return Math.ceil(t/4)*Math.ceil(e/4)*8;case sa:case cc:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function yy(t){switch(t){case en:case nh:return{byteLength:1,components:1};case zs:case ih:case Vn:return{byteLength:2,components:1};case Ic:case Lc:return{byteLength:2,components:4};case Rn:case Pc:case En:return{byteLength:4,components:1};case sh:case rh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cc}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cc);function wh(){let t=null,e=!1,n=null,i=null;function s(r,a){n(r,a),i=t.requestAnimationFrame(s)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(s),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){n=r},setContext:function(r){t=r}}}function Sy(t){const e=new WeakMap;function n(o,c){const l=o.array,u=o.usage,h=l.byteLength,d=t.createBuffer();t.bindBuffer(c,d),t.bufferData(c,l,u),o.onUploadCallback();let f;if(l instanceof Float32Array)f=t.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=t.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=t.HALF_FLOAT:f=t.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=t.SHORT;else if(l instanceof Uint32Array)f=t.UNSIGNED_INT;else if(l instanceof Int32Array)f=t.INT;else if(l instanceof Int8Array)f=t.BYTE;else if(l instanceof Uint8Array)f=t.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,c,l){const u=c.array,h=c.updateRanges;if(t.bindBuffer(l,o),h.length===0)t.bufferSubData(l,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){const p=h[d],_=h[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){const _=h[f];t.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(t.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,n(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Ey=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,by=`#ifdef USE_ALPHAHASH
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
#endif`,Ay=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ty=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ry=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cy=`#ifdef USE_AOMAP
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
#endif`,Py=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Iy=`#ifdef USE_BATCHING
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
#endif`,Ly=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Dy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ny=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Fy=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Uy=`#ifdef USE_IRIDESCENCE
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
#endif`,Oy=`#ifdef USE_BUMPMAP
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
#endif`,ky=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,By=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Vy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Gy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,$y=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Wy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Xy=`#define PI 3.141592653589793
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
} // validated`,qy=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yy=`vec3 transformedNormal = objectNormal;
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
#endif`,Ky=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qy="gl_FragColor = linearToOutputTexel( gl_FragColor );",eS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tS=`#ifdef USE_ENVMAP
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
#endif`,nS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,iS=`#ifdef USE_ENVMAP
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
#endif`,sS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rS=`#ifdef USE_ENVMAP
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
#endif`,aS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,oS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,lS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,dS=`#ifdef USE_GRADIENTMAP
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
}`,uS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pS=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,mS=`#ifdef USE_ENVMAP
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
#endif`,gS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_S=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,MS=`PhysicalMaterial material;
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
#endif`,yS=`uniform sampler2D dfgLUT;
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
}`,SS=`
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
#endif`,ES=`#if defined( RE_IndirectDiffuse )
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
#endif`,bS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,AS=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,TS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,wS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,RS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,CS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,PS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,IS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,LS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,DS=`#if defined( USE_POINTS_UV )
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
#endif`,NS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,FS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,US=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,OS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,BS=`#ifdef USE_MORPHTARGETS
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
#endif`,VS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,HS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,GS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$S=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,WS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,XS=`#ifdef USE_NORMALMAP
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
#endif`,qS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,YS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,KS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ZS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,JS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,jS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,QS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,eE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,iE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,aE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,oE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,cE=`float getShadowMask() {
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
}`,lE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dE=`#ifdef USE_SKINNING
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
#endif`,uE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hE=`#ifdef USE_SKINNING
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
#endif`,fE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gE=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,_E=`#ifdef USE_TRANSMISSION
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
#endif`,xE=`#ifdef USE_TRANSMISSION
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
#endif`,vE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ME=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,SE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const EE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bE=`uniform sampler2D t2D;
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
}`,AE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,TE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,wE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,RE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,CE=`#include <common>
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
}`,PE=`#if DEPTH_PACKING == 3200
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
}`,IE=`#define DISTANCE
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
}`,LE=`#define DISTANCE
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
}`,DE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,NE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,FE=`uniform float scale;
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
}`,UE=`uniform vec3 diffuse;
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
}`,OE=`#include <common>
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
}`,kE=`uniform vec3 diffuse;
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
}`,BE=`#define LAMBERT
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
}`,VE=`#define LAMBERT
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
}`,zE=`#define MATCAP
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
}`,HE=`#define MATCAP
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
}`,GE=`#define NORMAL
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
}`,$E=`#define NORMAL
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
}`,WE=`#define PHONG
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
}`,XE=`#define PHONG
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
}`,qE=`#define STANDARD
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
}`,YE=`#define STANDARD
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
}`,KE=`#define TOON
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
}`,ZE=`#define TOON
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
}`,JE=`uniform float size;
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
}`,jE=`uniform vec3 diffuse;
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
}`,QE=`#include <common>
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
}`,eb=`uniform vec3 color;
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
}`,tb=`uniform float rotation;
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
}`,nb=`uniform vec3 diffuse;
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
}`,Be={alphahash_fragment:Ey,alphahash_pars_fragment:by,alphamap_fragment:Ay,alphamap_pars_fragment:Ty,alphatest_fragment:wy,alphatest_pars_fragment:Ry,aomap_fragment:Cy,aomap_pars_fragment:Py,batching_pars_vertex:Iy,batching_vertex:Ly,begin_vertex:Dy,beginnormal_vertex:Ny,bsdfs:Fy,iridescence_fragment:Uy,bumpmap_pars_fragment:Oy,clipping_planes_fragment:ky,clipping_planes_pars_fragment:By,clipping_planes_pars_vertex:Vy,clipping_planes_vertex:zy,color_fragment:Hy,color_pars_fragment:Gy,color_pars_vertex:$y,color_vertex:Wy,common:Xy,cube_uv_reflection_fragment:qy,defaultnormal_vertex:Yy,displacementmap_pars_vertex:Ky,displacementmap_vertex:Zy,emissivemap_fragment:Jy,emissivemap_pars_fragment:jy,colorspace_fragment:Qy,colorspace_pars_fragment:eS,envmap_fragment:tS,envmap_common_pars_fragment:nS,envmap_pars_fragment:iS,envmap_pars_vertex:sS,envmap_physical_pars_fragment:mS,envmap_vertex:rS,fog_vertex:aS,fog_pars_vertex:oS,fog_fragment:cS,fog_pars_fragment:lS,gradientmap_pars_fragment:dS,lightmap_pars_fragment:uS,lights_lambert_fragment:hS,lights_lambert_pars_fragment:fS,lights_pars_begin:pS,lights_toon_fragment:gS,lights_toon_pars_fragment:_S,lights_phong_fragment:xS,lights_phong_pars_fragment:vS,lights_physical_fragment:MS,lights_physical_pars_fragment:yS,lights_fragment_begin:SS,lights_fragment_maps:ES,lights_fragment_end:bS,lightprobes_pars_fragment:AS,logdepthbuf_fragment:TS,logdepthbuf_pars_fragment:wS,logdepthbuf_pars_vertex:RS,logdepthbuf_vertex:CS,map_fragment:PS,map_pars_fragment:IS,map_particle_fragment:LS,map_particle_pars_fragment:DS,metalnessmap_fragment:NS,metalnessmap_pars_fragment:FS,morphinstance_vertex:US,morphcolor_vertex:OS,morphnormal_vertex:kS,morphtarget_pars_vertex:BS,morphtarget_vertex:VS,normal_fragment_begin:zS,normal_fragment_maps:HS,normal_pars_fragment:GS,normal_pars_vertex:$S,normal_vertex:WS,normalmap_pars_fragment:XS,clearcoat_normal_fragment_begin:qS,clearcoat_normal_fragment_maps:YS,clearcoat_pars_fragment:KS,iridescence_pars_fragment:ZS,opaque_fragment:JS,packing:jS,premultiplied_alpha_fragment:QS,project_vertex:eE,dithering_fragment:tE,dithering_pars_fragment:nE,roughnessmap_fragment:iE,roughnessmap_pars_fragment:sE,shadowmap_pars_fragment:rE,shadowmap_pars_vertex:aE,shadowmap_vertex:oE,shadowmask_pars_fragment:cE,skinbase_vertex:lE,skinning_pars_vertex:dE,skinning_vertex:uE,skinnormal_vertex:hE,specularmap_fragment:fE,specularmap_pars_fragment:pE,tonemapping_fragment:mE,tonemapping_pars_fragment:gE,transmission_fragment:_E,transmission_pars_fragment:xE,uv_pars_fragment:vE,uv_pars_vertex:ME,uv_vertex:yE,worldpos_vertex:SE,background_vert:EE,background_frag:bE,backgroundCube_vert:AE,backgroundCube_frag:TE,cube_vert:wE,cube_frag:RE,depth_vert:CE,depth_frag:PE,distance_vert:IE,distance_frag:LE,equirect_vert:DE,equirect_frag:NE,linedashed_vert:FE,linedashed_frag:UE,meshbasic_vert:OE,meshbasic_frag:kE,meshlambert_vert:BE,meshlambert_frag:VE,meshmatcap_vert:zE,meshmatcap_frag:HE,meshnormal_vert:GE,meshnormal_frag:$E,meshphong_vert:WE,meshphong_frag:XE,meshphysical_vert:qE,meshphysical_frag:YE,meshtoon_vert:KE,meshtoon_frag:ZE,points_vert:JE,points_frag:jE,shadow_vert:QE,shadow_frag:eb,sprite_vert:tb,sprite_frag:nb},_e={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},yn={basic:{uniforms:kt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:kt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new $e(0)},envMapIntensity:{value:1}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:kt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:kt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:kt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new $e(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:kt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:kt([_e.points,_e.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:kt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:kt([_e.common,_e.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:kt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:kt([_e.sprite,_e.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distance:{uniforms:kt([_e.common,_e.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distance_vert,fragmentShader:Be.distance_frag},shadow:{uniforms:kt([_e.lights,_e.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};yn.physical={uniforms:kt([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const Nr={r:0,b:0,g:0},ib=new lt,Rh=new Ue;Rh.set(-1,0,0,0,1,0,0,0,1);function sb(t,e,n,i,s,r){const a=new $e(0);let o=s===!0?0:1,c,l,u=null,h=0,d=null;function f(A){let w=A.isScene===!0?A.background:null;if(w&&w.isTexture){const v=A.backgroundBlurriness>0;w=e.get(w,v)}return w}function p(A){let w=!1;const v=f(A);v===null?m(a,o):v&&v.isColor&&(m(v,1),w=!0);const S=t.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(t.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function _(A,w){const v=f(w);v&&(v.isCubeTexture||v.mapping===ma)?(l===void 0&&(l=new pn(new Zs(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:ds(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(S,y,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ib.makeRotationFromEuler(w.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Rh),l.material.toneMapped=We.getTransfer(v.colorSpace)!==Qe,(u!==v||h!==v.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,u=v,h=v.version,d=t.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new pn(new xa(2,2),new Cn({name:"BackgroundMaterial",uniforms:ds(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=We.getTransfer(v.colorSpace)!==Qe,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||h!==v.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,u=v,h=v.version,d=t.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function m(A,w){A.getRGB(Nr,bh(t)),n.buffers.color.setClear(Nr.r,Nr.g,Nr.b,w,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,w=1){a.set(A),o=w,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,m(a,o)},render:p,addToRenderList:_,dispose:g}}function rb(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(C,I,X,H,D){let W=!1;const B=h(C,H,X,I);r!==B&&(r=B,l(r.object)),W=f(C,H,X,D),W&&p(C,H,X,D),D!==null&&e.update(D,t.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,v(C,I,X,H),D!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}function c(){return t.createVertexArray()}function l(C){return t.bindVertexArray(C)}function u(C){return t.deleteVertexArray(C)}function h(C,I,X,H){const D=H.wireframe===!0;let W=i[I.id];W===void 0&&(W={},i[I.id]=W);const B=C.isInstancedMesh===!0?C.id:0;let q=W[B];q===void 0&&(q={},W[B]=q);let te=q[X.id];te===void 0&&(te={},q[X.id]=te);let re=te[D];return re===void 0&&(re=d(c()),te[D]=re),re}function d(C){const I=[],X=[],H=[];for(let D=0;D<n;D++)I[D]=0,X[D]=0,H[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:X,attributeDivisors:H,object:C,attributes:{},index:null}}function f(C,I,X,H){const D=r.attributes,W=I.attributes;let B=0;const q=X.getAttributes();for(const te in q)if(q[te].location>=0){const ce=D[te];let ae=W[te];if(ae===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(ae=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(ae=C.instanceColor)),ce===void 0||ce.attribute!==ae||ae&&ce.data!==ae.data)return!0;B++}return r.attributesNum!==B||r.index!==H}function p(C,I,X,H){const D={},W=I.attributes;let B=0;const q=X.getAttributes();for(const te in q)if(q[te].location>=0){let ce=W[te];ce===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(ce=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(ce=C.instanceColor));const ae={};ae.attribute=ce,ce&&ce.data&&(ae.data=ce.data),D[te]=ae,B++}r.attributes=D,r.attributesNum=B,r.index=H}function _(){const C=r.newAttributes;for(let I=0,X=C.length;I<X;I++)C[I]=0}function m(C){g(C,0)}function g(C,I){const X=r.newAttributes,H=r.enabledAttributes,D=r.attributeDivisors;X[C]=1,H[C]===0&&(t.enableVertexAttribArray(C),H[C]=1),D[C]!==I&&(t.vertexAttribDivisor(C,I),D[C]=I)}function A(){const C=r.newAttributes,I=r.enabledAttributes;for(let X=0,H=I.length;X<H;X++)I[X]!==C[X]&&(t.disableVertexAttribArray(X),I[X]=0)}function w(C,I,X,H,D,W,B){B===!0?t.vertexAttribIPointer(C,I,X,D,W):t.vertexAttribPointer(C,I,X,H,D,W)}function v(C,I,X,H){_();const D=H.attributes,W=X.getAttributes(),B=I.defaultAttributeValues;for(const q in W){const te=W[q];if(te.location>=0){let re=D[q];if(re===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(re=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(re=C.instanceColor)),re!==void 0){const ce=re.normalized,ae=re.itemSize,ze=e.get(re);if(ze===void 0)continue;const Je=ze.buffer,He=ze.type,Z=ze.bytesPerElement,oe=He===t.INT||He===t.UNSIGNED_INT||re.gpuType===Pc;if(re.isInterleavedBufferAttribute){const ie=re.data,Ne=ie.stride,j=re.offset;if(ie.isInstancedInterleavedBuffer){for(let G=0;G<te.locationSize;G++)g(te.location+G,ie.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let G=0;G<te.locationSize;G++)m(te.location+G);t.bindBuffer(t.ARRAY_BUFFER,Je);for(let G=0;G<te.locationSize;G++)w(te.location+G,ae/te.locationSize,He,ce,Ne*Z,(j+ae/te.locationSize*G)*Z,oe)}else{if(re.isInstancedBufferAttribute){for(let ie=0;ie<te.locationSize;ie++)g(te.location+ie,re.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ie=0;ie<te.locationSize;ie++)m(te.location+ie);t.bindBuffer(t.ARRAY_BUFFER,Je);for(let ie=0;ie<te.locationSize;ie++)w(te.location+ie,ae/te.locationSize,He,ce,ae*Z,ae/te.locationSize*ie*Z,oe)}}else if(B!==void 0){const ce=B[q];if(ce!==void 0)switch(ce.length){case 2:t.vertexAttrib2fv(te.location,ce);break;case 3:t.vertexAttrib3fv(te.location,ce);break;case 4:t.vertexAttrib4fv(te.location,ce);break;default:t.vertexAttrib1fv(te.location,ce)}}}}A()}function S(){b();for(const C in i){const I=i[C];for(const X in I){const H=I[X];for(const D in H){const W=H[D];for(const B in W)u(W[B].object),delete W[B];delete H[D]}}delete i[C]}}function y(C){if(i[C.id]===void 0)return;const I=i[C.id];for(const X in I){const H=I[X];for(const D in H){const W=H[D];for(const B in W)u(W[B].object),delete W[B];delete H[D]}}delete i[C.id]}function T(C){for(const I in i){const X=i[I];for(const H in X){const D=X[H];if(D[C.id]===void 0)continue;const W=D[C.id];for(const B in W)u(W[B].object),delete W[B];delete D[C.id]}}}function M(C){for(const I in i){const X=i[I],H=C.isInstancedMesh===!0?C.id:0,D=X[H];if(D!==void 0){for(const W in D){const B=D[W];for(const q in B)u(B[q].object),delete B[q];delete D[W]}delete X[H],Object.keys(X).length===0&&delete i[I]}}}function b(){P(),a=!0,r!==s&&(r=s,l(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:P,dispose:S,releaseStatesOfGeometry:y,releaseStatesOfObject:M,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:A}}function ab(t,e,n){let i;function s(c){i=c}function r(c,l){t.drawArrays(i,c,l),n.update(l,i,1)}function a(c,l,u){u!==0&&(t.drawArraysInstanced(i,c,l,u),n.update(l,i,u))}function o(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let d=0;for(let f=0;f<u;f++)d+=l[f];n.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function ob(t,e,n,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");s=t.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==fn&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const M=T===Vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==en&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==En&&!M)}function c(T){if(T==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp";const u=c(l);u!==l&&(Le("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=n.logarithmicDepthBuffer===!0,d=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&d===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),g=t.getParameter(t.MAX_VERTEX_ATTRIBS),A=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),w=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),S=t.getParameter(t.MAX_SAMPLES),y=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:A,maxVaryings:w,maxFragmentUniforms:v,maxSamples:S,samples:y}}function cb(t){const e=this;let n=null,i=0,s=!1,r=!1;const a=new Qn,o=new Ue,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||s;return s=d,i=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){n=u(h,d,0)},this.setState=function(h,d,f){const p=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,g=t.get(h);if(!s||p===null||p.length===0||r&&!m)r?u(null):l();else{const A=r?0:i,w=A*4;let v=g.clippingState||null;c.value=v,v=u(p,d,w,f);for(let S=0;S!==w;++S)v[S]=n[S];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,p){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=c.value,p!==!0||m===null){const g=f+_*4,A=d.matrixWorldInverse;o.getNormalMatrix(A),(m===null||m.length<g)&&(m=new Float32Array(g));for(let w=0,v=f;w!==_;++w,v+=4)a.copy(h[w]).applyMatrix4(A,o),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const ni=4,Ud=[.125,.215,.35,.446,.526,.582],_i=20,lb=256,Ts=new Gc,Od=new $e;let to=null,no=0,io=0,so=!1;const db=new U;class kd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,s=100,r={}){const{size:a=256,position:o=db}=r;to=this._renderer.getRenderTarget(),no=this._renderer.getActiveCubeFace(),io=this._renderer.getActiveMipmapLevel(),so=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(to,no,io),this._renderer.xr.enabled=so,e.scissorTest=!1,Zi(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ti||e.mapping===os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),to=this._renderer.getRenderTarget(),no=this._renderer.getActiveCubeFace(),io=this._renderer.getActiveMipmapLevel(),so=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:Vn,format:fn,colorSpace:ra,depthBuffer:!1},s=Bd(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bd(e,n,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=ub(r)),this._blurMaterial=fb(r,e,n),this._ggxMaterial=hb(r,e,n)}return s}_compileMaterial(e){const n=new pn(new zt,e);this._renderer.compile(n,Ts)}_sceneToCubeUV(e,n,i,s,r){const c=new an(90,1,n,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Od),h.toneMapping=An,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new pn(new Zs,new gh({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const A=e.background;A?A.isColor&&(m.color.copy(A),e.background=null,g=!0):(m.color.copy(Od),g=!0);for(let w=0;w<6;w++){const v=w%3;v===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[w],r.y,r.z)):v===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[w]));const S=this._cubeSize;Zi(s,v*S,w>2?S:0,S,S),h.setRenderTarget(s),g&&h.render(_,c),h.render(e,c)}h.toneMapping=f,h.autoClear=d,e.background=A}_textureToCubeUV(e,n){const i=this._renderer,s=e.mapping===Ti||e.mapping===os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=zd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Zi(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,Ts)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);n.autoClear=i}_applyGGXFilter(e,n,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),h=Math.sqrt(l*l-u*u),d=0+l*1.25,f=h*d,{_lodMax:p}=this,_=this._sizeLods[i],m=3*_*(i>p-ni?i-p+ni:0),g=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=p-n,Zi(r,m,g,3*_,2*_),s.setRenderTarget(r),s.render(o,Ts),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-i,Zi(e,m,g,3*_,2*_),s.setRenderTarget(e),s.render(o,Ts)}_blur(e,n,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,n,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ye("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[s];h.material=l;const d=l.uniforms,f=this._sizeLods[i]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*_i-1),_=r/p,m=isFinite(r)?1+Math.floor(u*_):_i;m>_i&&Le(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const g=[];let A=0;for(let T=0;T<_i;++T){const M=T/_,b=Math.exp(-M*M/2);g.push(b),T===0?A+=b:T<m&&(A+=2*b)}for(let T=0;T<g.length;T++)g[T]=g[T]/A;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:w}=this;d.dTheta.value=p,d.mipInt.value=w-i;const v=this._sizeLods[s],S=3*v*(s>w-ni?s-w+ni:0),y=4*(this._cubeSize-v);Zi(n,S,y,3*v,2*v),c.setRenderTarget(n),c.render(h,Ts)}}function ub(t){const e=[],n=[],i=[];let s=t;const r=t-ni+1+Ud.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>t-ni?c=Ud[a-t+ni-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,_=3,m=2,g=1,A=new Float32Array(_*p*f),w=new Float32Array(m*p*f),v=new Float32Array(g*p*f);for(let y=0;y<f;y++){const T=y%3*2/3-1,M=y>2?0:-1,b=[T,M,0,T+2/3,M,0,T+2/3,M+1,0,T,M,0,T+2/3,M+1,0,T,M+1,0];A.set(b,_*p*y),w.set(d,m*p*y);const P=[y,y,y,y,y,y];v.set(P,g*p*y)}const S=new zt;S.setAttribute("position",new wn(A,_)),S.setAttribute("uv",new wn(w,m)),S.setAttribute("faceIndex",new wn(v,g)),i.push(new pn(S,null)),s>ni&&s--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function Bd(t,e,n){const i=new Tn(t,e,n);return i.texture.mapping=ma,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Zi(t,e,n,i,s){t.viewport.set(e,n,i,s),t.scissor.set(e,n,i,s)}function hb(t,e,n){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:lb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:va(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function fb(t,e,n){const i=new Float32Array(_i),s=new U(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:va(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Vd(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:va(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function zd(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:va(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function va(){return`

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
	`}class Ch extends Tn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new xh(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Zs(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:ds(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:qt,blending:kn});r.uniforms.tEquirect.value=n;const a=new pn(s,r),o=n.minFilter;return n.minFilter===vi&&(n.minFilter=Ut),new _y(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,s);e.setRenderTarget(r)}}function pb(t){let e=new WeakMap,n=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Ra||f===Ca)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new Ch(p.height);return _.fromEquirectangularTexture(t,d),e.set(d,_),d.addEventListener("dispose",l),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===Ra||f===Ca,_=f===Ti||f===os;if(p||_){let m=n.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new kd(t)),m=p?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),m.texture;if(m!==void 0)return m.texture;{const A=d.image;return p&&A&&A.height>0||_&&A&&c(A)?(i===null&&(i=new kd(t)),m=p?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),d.addEventListener("dispose",u),m.texture):null}}}return d}function o(d,f){return f===Ra?d.mapping=Ti:f===Ca&&(d.mapping=os),d}function c(d){let f=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&f++;return f===p}function l(d){const f=d.target;f.removeEventListener("dispose",l);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function u(d){const f=d.target;f.removeEventListener("dispose",u);const p=n.get(f);p!==void 0&&(n.delete(f),p.dispose())}function h(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:h}}function mb(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const s=t.getExtension(i);return e[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const s=n(i);return s===null&&ss("WebGLRenderer: "+i+" extension not supported."),s}}}function gb(t,e,n,i){const s={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,n.memory.geometries++),d}function c(h){const d=h.attributes;for(const f in d)e.update(d[f],t.ARRAY_BUFFER)}function l(h){const d=[],f=h.index,p=h.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const A=f.array;_=f.version;for(let w=0,v=A.length;w<v;w+=3){const S=A[w+0],y=A[w+1],T=A[w+2];d.push(S,y,y,T,T,S)}}else{const A=p.array;_=p.version;for(let w=0,v=A.length/3-1;w<v;w+=3){const S=w+0,y=w+1,T=w+2;d.push(S,y,y,T,T,S)}}const m=new(p.count>=65535?mh:ph)(d,1);m.version=_;const g=r.get(h);g&&e.remove(g),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function _b(t,e,n){let i;function s(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function c(h,d){t.drawElements(i,d,r,h*a),n.update(d,i,1)}function l(h,d,f){f!==0&&(t.drawElementsInstanced(i,d,r,h*a,f),n.update(d,i,f))}function u(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,h,0,f);let _=0;for(let m=0;m<f;m++)_+=d[m];n.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function xb(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(r/3);break;case t.LINES:n.lines+=o*(r/2);break;case t.LINE_STRIP:n.lines+=o*(r-1);break;case t.LINE_LOOP:n.lines+=o*r;break;case t.POINTS:n.points+=o*r;break;default:Ye("WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:s,update:i}}function vb(t,e,n){const i=new WeakMap,s=new dt;function r(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let b=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let w=0;f===!0&&(w=1),p===!0&&(w=2),_===!0&&(w=3);let v=o.attributes.position.count*w,S=1;v>e.maxTextureSize&&(S=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const y=new Float32Array(v*S*4*h),T=new uh(y,v,S,h);T.type=En,T.needsUpdate=!0;const M=w*4;for(let P=0;P<h;P++){const C=m[P],I=g[P],X=A[P],H=v*S*4*P;for(let D=0;D<C.count;D++){const W=D*M;f===!0&&(s.fromBufferAttribute(C,D),y[H+W+0]=s.x,y[H+W+1]=s.y,y[H+W+2]=s.z,y[H+W+3]=0),p===!0&&(s.fromBufferAttribute(I,D),y[H+W+4]=s.x,y[H+W+5]=s.y,y[H+W+6]=s.z,y[H+W+7]=0),_===!0&&(s.fromBufferAttribute(X,D),y[H+W+8]=s.x,y[H+W+9]=s.y,y[H+W+10]=s.z,y[H+W+11]=X.itemSize===4?s.w:1)}}d={count:h,texture:T,size:new Fe(v,S)},i.set(o,d),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];const p=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(t,"morphTargetBaseInfluence",p),c.getUniforms().setValue(t,"morphTargetInfluences",l)}c.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:r}}function Mb(t,e,n,i,s){let r=new WeakMap;function a(l){const u=s.render.frame,h=l.geometry,d=e.get(l,h);if(r.get(d)!==u&&(e.update(d),r.set(d,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return d}function o(){r=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:a,dispose:o}}const yb={[Yu]:"LINEAR_TONE_MAPPING",[Ku]:"REINHARD_TONE_MAPPING",[Zu]:"CINEON_TONE_MAPPING",[Ju]:"ACES_FILMIC_TONE_MAPPING",[Qu]:"AGX_TONE_MAPPING",[eh]:"NEUTRAL_TONE_MAPPING",[ju]:"CUSTOM_TONE_MAPPING"};function Sb(t,e,n,i,s,r){const a=new Tn(e,n,{type:t,depthBuffer:s,stencilBuffer:r,samples:i?4:0,depthTexture:s?new cs(e,n):void 0}),o=new Tn(e,n,{type:Vn,depthBuffer:!1,stencilBuffer:!1}),c=new zt;c.setAttribute("position",new Vt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Vt([0,2,0,0,2,0],2));const l=new dy({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new pn(c,l),h=new Gc(-1,1,1,-1,0,1);let d=null,f=null,p=!1,_,m=null,g=[],A=!1;this.setSize=function(w,v){a.setSize(w,v),o.setSize(w,v);for(let S=0;S<g.length;S++){const y=g[S];y.setSize&&y.setSize(w,v)}},this.setEffects=function(w){g=w,A=g.length>0&&g[0].isRenderPass===!0;const v=a.width,S=a.height;for(let y=0;y<g.length;y++){const T=g[y];T.setSize&&T.setSize(v,S)}},this.begin=function(w,v){if(p||w.toneMapping===An&&g.length===0)return!1;if(m=v,v!==null){const S=v.width,y=v.height;(a.width!==S||a.height!==y)&&this.setSize(S,y)}return A===!1&&w.setRenderTarget(a),_=w.toneMapping,w.toneMapping=An,!0},this.hasRenderPass=function(){return A},this.end=function(w,v){w.toneMapping=_,p=!0;let S=a,y=o;for(let T=0;T<g.length;T++){const M=g[T];if(M.enabled!==!1&&(M.render(w,y,S,v),M.needsSwap!==!1)){const b=S;S=y,y=b}}if(d!==w.outputColorSpace||f!==w.toneMapping){d=w.outputColorSpace,f=w.toneMapping,l.defines={},We.getTransfer(d)===Qe&&(l.defines.SRGB_TRANSFER="");const T=yb[f];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,w.setRenderTarget(m),w.render(u,h),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const Ph=new Bt,pc=new cs(1,1),Ih=new uh,Lh=new SM,Dh=new xh,Hd=[],Gd=[],$d=new Float32Array(16),Wd=new Float32Array(9),Xd=new Float32Array(4);function ps(t,e,n){const i=t[0];if(i<=0||i>0)return t;const s=e*n;let r=Hd[s];if(r===void 0&&(r=new Float32Array(s),Hd[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(r,o)}return r}function bt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function At(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Ma(t,e){let n=Gd[e];n===void 0&&(n=new Int32Array(e),Gd[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Eb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function bb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2fv(this.addr,e),At(n,e)}}function Ab(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(bt(n,e))return;t.uniform3fv(this.addr,e),At(n,e)}}function Tb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4fv(this.addr,e),At(n,e)}}function wb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;Xd.set(i),t.uniformMatrix2fv(this.addr,!1,Xd),At(n,i)}}function Rb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;Wd.set(i),t.uniformMatrix3fv(this.addr,!1,Wd),At(n,i)}}function Cb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;$d.set(i),t.uniformMatrix4fv(this.addr,!1,$d),At(n,i)}}function Pb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function Ib(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2iv(this.addr,e),At(n,e)}}function Lb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(bt(n,e))return;t.uniform3iv(this.addr,e),At(n,e)}}function Db(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4iv(this.addr,e),At(n,e)}}function Nb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function Fb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2uiv(this.addr,e),At(n,e)}}function Ub(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(bt(n,e))return;t.uniform3uiv(this.addr,e),At(n,e)}}function Ob(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4uiv(this.addr,e),At(n,e)}}function kb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s);let r;this.type===t.SAMPLER_2D_SHADOW?(pc.compareFunction=n.isReversedDepthBuffer()?Oc:Uc,r=pc):r=Ph,n.setTexture2D(e||r,s)}function Bb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(e||Lh,s)}function Vb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(e||Dh,s)}function zb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(e||Ih,s)}function Hb(t){switch(t){case 5126:return Eb;case 35664:return bb;case 35665:return Ab;case 35666:return Tb;case 35674:return wb;case 35675:return Rb;case 35676:return Cb;case 5124:case 35670:return Pb;case 35667:case 35671:return Ib;case 35668:case 35672:return Lb;case 35669:case 35673:return Db;case 5125:return Nb;case 36294:return Fb;case 36295:return Ub;case 36296:return Ob;case 35678:case 36198:case 36298:case 36306:case 35682:return kb;case 35679:case 36299:case 36307:return Bb;case 35680:case 36300:case 36308:case 36293:return Vb;case 36289:case 36303:case 36311:case 36292:return zb}}function Gb(t,e){t.uniform1fv(this.addr,e)}function $b(t,e){const n=ps(e,this.size,2);t.uniform2fv(this.addr,n)}function Wb(t,e){const n=ps(e,this.size,3);t.uniform3fv(this.addr,n)}function Xb(t,e){const n=ps(e,this.size,4);t.uniform4fv(this.addr,n)}function qb(t,e){const n=ps(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Yb(t,e){const n=ps(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Kb(t,e){const n=ps(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Zb(t,e){t.uniform1iv(this.addr,e)}function Jb(t,e){t.uniform2iv(this.addr,e)}function jb(t,e){t.uniform3iv(this.addr,e)}function Qb(t,e){t.uniform4iv(this.addr,e)}function eA(t,e){t.uniform1uiv(this.addr,e)}function tA(t,e){t.uniform2uiv(this.addr,e)}function nA(t,e){t.uniform3uiv(this.addr,e)}function iA(t,e){t.uniform4uiv(this.addr,e)}function sA(t,e,n){const i=this.cache,s=e.length,r=Ma(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));let a;this.type===t.SAMPLER_2D_SHADOW?a=pc:a=Ph;for(let o=0;o!==s;++o)n.setTexture2D(e[o]||a,r[o])}function rA(t,e,n){const i=this.cache,s=e.length,r=Ma(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTexture3D(e[a]||Lh,r[a])}function aA(t,e,n){const i=this.cache,s=e.length,r=Ma(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTextureCube(e[a]||Dh,r[a])}function oA(t,e,n){const i=this.cache,s=e.length,r=Ma(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTexture2DArray(e[a]||Ih,r[a])}function cA(t){switch(t){case 5126:return Gb;case 35664:return $b;case 35665:return Wb;case 35666:return Xb;case 35674:return qb;case 35675:return Yb;case 35676:return Kb;case 5124:case 35670:return Zb;case 35667:case 35671:return Jb;case 35668:case 35672:return jb;case 35669:case 35673:return Qb;case 5125:return eA;case 36294:return tA;case 36295:return nA;case 36296:return iA;case 35678:case 36198:case 36298:case 36306:case 35682:return sA;case 35679:case 36299:case 36307:return rA;case 35680:case 36300:case 36308:case 36293:return aA;case 36289:case 36303:case 36311:case 36292:return oA}}class lA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Hb(n.type)}}class dA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=cA(n.type)}}class uA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,n[o.id],i)}}}const ro=/(\w+)(\])?(\[|\.)?/g;function qd(t,e){t.seq.push(e),t.map[e.id]=e}function hA(t,e,n){const i=t.name,s=i.length;for(ro.lastIndex=0;;){const r=ro.exec(i),a=ro.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){qd(n,l===void 0?new lA(o,t,e):new dA(o,t,e));break}else{let h=n.map[o];h===void 0&&(h=new uA(o),qd(n,h)),n=h}}}class Xr{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(n,a),c=e.getUniformLocation(n,o.name);hA(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,n,i,s){const r=this.map[n];r!==void 0&&r.setValue(e,i,s)}setOptional(e,n,i){const s=n[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,n,i,s){for(let r=0,a=n.length;r!==a;++r){const o=n[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,n){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in n&&i.push(a)}return i}}function Yd(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const fA=37297;let pA=0;function mA(t,e){const n=t.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,n.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Kd=new Ue;function gA(t){We._getMatrix(Kd,We.workingColorSpace,t);const e=`mat3( ${Kd.elements.map(n=>n.toFixed(4))} )`;switch(We.getTransfer(t)){case aa:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Zd(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=(t.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+mA(t.getShaderSource(e),o)}else return r}function _A(t,e){const n=gA(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const xA={[Yu]:"Linear",[Ku]:"Reinhard",[Zu]:"Cineon",[Ju]:"ACESFilmic",[Qu]:"AgX",[eh]:"Neutral",[ju]:"Custom"};function vA(t,e){const n=xA[e];return n===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Fr=new U;function MA(){We.getLuminanceCoefficients(Fr);const t=Fr.x.toFixed(4),e=Fr.y.toFixed(4),n=Fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yA(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fs).join(`
`)}function SA(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function EA(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=t.getActiveAttrib(e,s),a=r.name;let o=1;r.type===t.FLOAT_MAT2&&(o=2),r.type===t.FLOAT_MAT3&&(o=3),r.type===t.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function Fs(t){return t!==""}function Jd(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function jd(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const bA=/^[ \t]*#include +<([\w\d./]+)>/gm;function mc(t){return t.replace(bA,TA)}const AA=new Map;function TA(t,e){let n=Be[e];if(n===void 0){const i=AA.get(e);if(i!==void 0)n=Be[i],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return mc(n)}const wA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qd(t){return t.replace(wA,RA)}function RA(t,e,n,i){let s="";for(let r=parseInt(e);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function eu(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}const CA={[Vr]:"SHADOWMAP_TYPE_PCF",[Ls]:"SHADOWMAP_TYPE_VSM"};function PA(t){return CA[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const IA={[Ti]:"ENVMAP_TYPE_CUBE",[os]:"ENVMAP_TYPE_CUBE",[ma]:"ENVMAP_TYPE_CUBE_UV"};function LA(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":IA[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const DA={[os]:"ENVMAP_MODE_REFRACTION"};function NA(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":DA[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const FA={[qu]:"ENVMAP_BLENDING_MULTIPLY",[Vv]:"ENVMAP_BLENDING_MIX",[zv]:"ENVMAP_BLENDING_ADD"};function UA(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":FA[t.combine]||"ENVMAP_BLENDING_NONE"}function OA(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function kA(t,e,n,i){const s=t.getContext(),r=n.defines;let a=n.vertexShader,o=n.fragmentShader;const c=PA(n),l=LA(n),u=NA(n),h=UA(n),d=OA(n),f=yA(n),p=SA(r),_=s.createProgram();let m,g,A=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p].filter(Fs).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p].filter(Fs).join(`
`),g.length>0&&(g+=`
`)):(m=[eu(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fs).join(`
`),g=[eu(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==An?"#define TONE_MAPPING":"",n.toneMapping!==An?Be.tonemapping_pars_fragment:"",n.toneMapping!==An?vA("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,_A("linearToOutputTexel",n.outputColorSpace),MA(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Fs).join(`
`)),a=mc(a),a=Jd(a,n),a=jd(a,n),o=mc(o),o=Jd(o,n),o=jd(o,n),a=Qd(a),o=Qd(o),n.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",n.glslVersion===Ql?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Ql?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const w=A+m+a,v=A+g+o,S=Yd(s,s.VERTEX_SHADER,w),y=Yd(s,s.FRAGMENT_SHADER,v);s.attachShader(_,S),s.attachShader(_,y),n.index0AttributeName!==void 0?s.bindAttribLocation(_,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(C){if(t.debug.checkShaderErrors){const I=s.getProgramInfoLog(_)||"",X=s.getShaderInfoLog(S)||"",H=s.getShaderInfoLog(y)||"",D=I.trim(),W=X.trim(),B=H.trim();let q=!0,te=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(q=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(s,_,S,y);else{const re=Zd(s,S,"vertex"),ce=Zd(s,y,"fragment");Ye("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+D+`
`+re+`
`+ce)}else D!==""?Le("WebGLProgram: Program Info Log:",D):(W===""||B==="")&&(te=!1);te&&(C.diagnostics={runnable:q,programLog:D,vertexShader:{log:W,prefix:m},fragmentShader:{log:B,prefix:g}})}s.deleteShader(S),s.deleteShader(y),M=new Xr(s,_),b=EA(s,_)}let M;this.getUniforms=function(){return M===void 0&&T(this),M};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let P=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(_,fA)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=pA++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=y,this}let BA=0;class VA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const s=this._getShaderCacheForMaterial(e);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new zA(e),n.set(e,i)),i}}class zA{constructor(e){this.id=BA++,this.code=e,this.usedTimes=0}}function HA(t){return t===wi||t===ia||t===sa}function GA(t,e,n,i,s,r){const a=new hh,o=new VA,c=new Set,l=[],u=new Map,h=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(M){return c.add(M),M===0?"uv":`uv${M}`}function _(M,b,P,C,I,X){const H=C.fog,D=I.geometry,W=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?C.environment:null,B=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap,q=e.get(M.envMap||W,B),te=q&&q.mapping===ma?q.image.height:null,re=f[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&Le("WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const ce=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,ae=ce!==void 0?ce.length:0;let ze=0;D.morphAttributes.position!==void 0&&(ze=1),D.morphAttributes.normal!==void 0&&(ze=2),D.morphAttributes.color!==void 0&&(ze=3);let Je,He,Z,oe;if(re){const be=yn[re];Je=be.vertexShader,He=be.fragmentShader}else{Je=M.vertexShader,He=M.fragmentShader;const be=o.getVertexShaderStage(M),mt=o.getFragmentShaderStage(M);o.update(M,be,mt),Z=be.id,oe=mt.id}const ie=t.getRenderTarget(),Ne=t.state.buffers.depth.getReversed(),j=I.isInstancedMesh===!0,G=I.isBatchedMesh===!0,he=!!M.map,ne=!!M.matcap,de=!!q,ye=!!M.aoMap,we=!!M.lightMap,Ke=!!M.bumpMap&&M.wireframe===!1,ft=!!M.normalMap,Tt=!!M.displacementMap,Pt=!!M.emissiveMap,pt=!!M.metalnessMap,Mt=!!M.roughnessMap,N=M.anisotropy>0,Ht=M.clearcoat>0,je=M.dispersion>0,R=M.iridescence>0,x=M.sheen>0,O=M.transmission>0,z=N&&!!M.anisotropyMap,Y=Ht&&!!M.clearcoatMap,se=Ht&&!!M.clearcoatNormalMap,ue=Ht&&!!M.clearcoatRoughnessMap,K=R&&!!M.iridescenceMap,Q=R&&!!M.iridescenceThicknessMap,fe=x&&!!M.sheenColorMap,Re=x&&!!M.sheenRoughnessMap,ge=!!M.specularMap,pe=!!M.specularColorMap,Ie=!!M.specularIntensityMap,De=O&&!!M.transmissionMap,Oe=O&&!!M.thicknessMap,L=!!M.gradientMap,le=!!M.alphaMap,J=M.alphaTest>0,me=!!M.alphaHash,Me=!!M.extensions;let ee=An;M.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ee=t.toneMapping);const Te={shaderID:re,shaderType:M.type,shaderName:M.name,vertexShader:Je,fragmentShader:He,defines:M.defines,customVertexShaderID:Z,customFragmentShaderID:oe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:G,batchingColor:G&&I._colorsTexture!==null,instancing:j,instancingColor:j&&I.instanceColor!==null,instancingMorph:j&&I.morphTexture!==null,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:We.workingColorSpace,alphaToCoverage:!!M.alphaToCoverage,map:he,matcap:ne,envMap:de,envMapMode:de&&q.mapping,envMapCubeUVHeight:te,aoMap:ye,lightMap:we,bumpMap:Ke,normalMap:ft,displacementMap:Tt,emissiveMap:Pt,normalMapObjectSpace:ft&&M.normalMapType===$v,normalMapTangentSpace:ft&&M.normalMapType===lc,packedNormalMap:ft&&M.normalMapType===lc&&HA(M.normalMap.format),metalnessMap:pt,roughnessMap:Mt,anisotropy:N,anisotropyMap:z,clearcoat:Ht,clearcoatMap:Y,clearcoatNormalMap:se,clearcoatRoughnessMap:ue,dispersion:je,iridescence:R,iridescenceMap:K,iridescenceThicknessMap:Q,sheen:x,sheenColorMap:fe,sheenRoughnessMap:Re,specularMap:ge,specularColorMap:pe,specularIntensityMap:Ie,transmission:O,transmissionMap:De,thicknessMap:Oe,gradientMap:L,opaque:M.transparent===!1&&M.blending===is&&M.alphaToCoverage===!1,alphaMap:le,alphaTest:J,alphaHash:me,combine:M.combine,mapUv:he&&p(M.map.channel),aoMapUv:ye&&p(M.aoMap.channel),lightMapUv:we&&p(M.lightMap.channel),bumpMapUv:Ke&&p(M.bumpMap.channel),normalMapUv:ft&&p(M.normalMap.channel),displacementMapUv:Tt&&p(M.displacementMap.channel),emissiveMapUv:Pt&&p(M.emissiveMap.channel),metalnessMapUv:pt&&p(M.metalnessMap.channel),roughnessMapUv:Mt&&p(M.roughnessMap.channel),anisotropyMapUv:z&&p(M.anisotropyMap.channel),clearcoatMapUv:Y&&p(M.clearcoatMap.channel),clearcoatNormalMapUv:se&&p(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&p(M.clearcoatRoughnessMap.channel),iridescenceMapUv:K&&p(M.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&p(M.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&p(M.sheenColorMap.channel),sheenRoughnessMapUv:Re&&p(M.sheenRoughnessMap.channel),specularMapUv:ge&&p(M.specularMap.channel),specularColorMapUv:pe&&p(M.specularColorMap.channel),specularIntensityMapUv:Ie&&p(M.specularIntensityMap.channel),transmissionMapUv:De&&p(M.transmissionMap.channel),thicknessMapUv:Oe&&p(M.thicknessMap.channel),alphaMapUv:le&&p(M.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(ft||N),vertexNormals:!!D.attributes.normal,vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(he||le),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.wireframe===!1&&(M.flatShading===!0||D.attributes.normal===void 0&&ft===!1&&(M.isMeshLambertMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isMeshPhysicalMaterial)),sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ne,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:ze,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:ee,decodeVideoTexture:he&&M.map.isVideoTexture===!0&&We.getTransfer(M.map.colorSpace)===Qe,decodeVideoTextureEmissive:Pt&&M.emissiveMap.isVideoTexture===!0&&We.getTransfer(M.emissiveMap.colorSpace)===Qe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Sn,flipSided:M.side===qt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Me&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Me&&M.extensions.multiDraw===!0||G)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Te.vertexUv1s=c.has(1),Te.vertexUv2s=c.has(2),Te.vertexUv3s=c.has(3),c.clear(),Te}function m(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(g(b,M),A(b,M),b.push(t.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function g(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function A(M,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),b.packedNormalMap&&a.enable(22),b.vertexNormals&&a.enable(23),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),b.numLightProbeGrids>0&&a.enable(22),b.hasPositionAttribute&&a.enable(23),M.push(a.mask)}function w(M){const b=f[M.type];let P;if(b){const C=yn[b];P=oy.clone(C.uniforms)}else P=M.uniforms;return P}function v(M,b){let P=u.get(b);return P!==void 0?++P.usedTimes:(P=new kA(t,b,M,s),l.push(P),u.set(b,P)),P}function S(M){if(--M.usedTimes===0){const b=l.indexOf(M);l[b]=l[l.length-1],l.pop(),u.delete(M.cacheKey),M.destroy()}}function y(M){o.remove(M)}function T(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:w,acquireProgram:v,releaseProgram:S,releaseShaderCache:y,programs:l,dispose:T}}function $A(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function s(a,o,c){t.get(a)[o]=c}function r(){t=new WeakMap}return{has:e,get:n,remove:i,update:s,dispose:r}}function WA(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function tu(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function nu(){const t=[];let e=0;const n=[],i=[],s=[];function r(){e=0,n.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,_,m,g){let A=t[e];return A===void 0?(A={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:g},t[e]=A):(A.id=d.id,A.object=d,A.geometry=f,A.material=p,A.materialVariant=a(d),A.groupOrder=_,A.renderOrder=d.renderOrder,A.z=m,A.group=g),e++,A}function c(d,f,p,_,m,g){const A=o(d,f,p,_,m,g);p.transmission>0?i.push(A):p.transparent===!0?s.push(A):n.push(A)}function l(d,f,p,_,m,g){const A=o(d,f,p,_,m,g);p.transmission>0?i.unshift(A):p.transparent===!0?s.unshift(A):n.unshift(A)}function u(d,f,p){n.length>1&&n.sort(d||WA),i.length>1&&i.sort(f||tu),s.length>1&&s.sort(f||tu),p&&(n.reverse(),i.reverse(),s.reverse())}function h(){for(let d=e,f=t.length;d<f;d++){const p=t[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:h,sort:u}}function XA(){let t=new WeakMap;function e(i,s){const r=t.get(i);let a;return r===void 0?(a=new nu,t.set(i,[a])):s>=r.length?(a=new nu,r.push(a)):a=r[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function qA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new U,color:new $e};break;case"SpotLight":n={position:new U,direction:new U,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new U,color:new $e,distance:0,decay:0};break;case"HemisphereLight":n={direction:new U,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":n={color:new $e,position:new U,halfWidth:new U,halfHeight:new U};break}return t[e.id]=n,n}}}function YA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let KA=0;function ZA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function JA(t){const e=new qA,n=YA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new U);const s=new U,r=new lt,a=new lt;function o(l){let u=0,h=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,A=0,w=0,v=0,S=0,y=0,T=0;l.sort(ZA);for(let b=0,P=l.length;b<P;b++){const C=l[b],I=C.color,X=C.intensity,H=C.distance;let D=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===wi?D=C.shadow.map.texture:D=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)u+=I.r*X,h+=I.g*X,d+=I.b*X;else if(C.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(C.sh.coefficients[W],X);T++}else if(C.isDirectionalLight){const W=e.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const B=C.shadow,q=n.get(C);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,i.directionalShadow[f]=q,i.directionalShadowMap[f]=D,i.directionalShadowMatrix[f]=C.shadow.matrix,A++}i.directional[f]=W,f++}else if(C.isSpotLight){const W=e.get(C);W.position.setFromMatrixPosition(C.matrixWorld),W.color.copy(I).multiplyScalar(X),W.distance=H,W.coneCos=Math.cos(C.angle),W.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),W.decay=C.decay,i.spot[_]=W;const B=C.shadow;if(C.map&&(i.spotLightMap[S]=C.map,S++,B.updateMatrices(C),C.castShadow&&y++),i.spotLightMatrix[_]=B.matrix,C.castShadow){const q=n.get(C);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,i.spotShadow[_]=q,i.spotShadowMap[_]=D,v++}_++}else if(C.isRectAreaLight){const W=e.get(C);W.color.copy(I).multiplyScalar(X),W.halfWidth.set(C.width*.5,0,0),W.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=W,m++}else if(C.isPointLight){const W=e.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),W.distance=C.distance,W.decay=C.decay,C.castShadow){const B=C.shadow,q=n.get(C);q.shadowIntensity=B.intensity,q.shadowBias=B.bias,q.shadowNormalBias=B.normalBias,q.shadowRadius=B.radius,q.shadowMapSize=B.mapSize,q.shadowCameraNear=B.camera.near,q.shadowCameraFar=B.camera.far,i.pointShadow[p]=q,i.pointShadowMap[p]=D,i.pointShadowMatrix[p]=C.shadow.matrix,w++}i.point[p]=W,p++}else if(C.isHemisphereLight){const W=e.get(C);W.skyColor.copy(C.color).multiplyScalar(X),W.groundColor.copy(C.groundColor).multiplyScalar(X),i.hemi[g]=W,g++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_e.LTC_FLOAT_1,i.rectAreaLTC2=_e.LTC_FLOAT_2):(i.rectAreaLTC1=_e.LTC_HALF_1,i.rectAreaLTC2=_e.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const M=i.hash;(M.directionalLength!==f||M.pointLength!==p||M.spotLength!==_||M.rectAreaLength!==m||M.hemiLength!==g||M.numDirectionalShadows!==A||M.numPointShadows!==w||M.numSpotShadows!==v||M.numSpotMaps!==S||M.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=v+S-y,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=T,M.directionalLength=f,M.pointLength=p,M.spotLength=_,M.rectAreaLength=m,M.hemiLength=g,M.numDirectionalShadows=A,M.numPointShadows=w,M.numSpotShadows=v,M.numSpotMaps=S,M.numLightProbes=T,i.version=KA++)}function c(l,u){let h=0,d=0,f=0,p=0,_=0;const m=u.matrixWorldInverse;for(let g=0,A=l.length;g<A;g++){const w=l[g];if(w.isDirectionalLight){const v=i.directional[h];v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),h++}else if(w.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const v=i.rectArea[p];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(w.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(w.width*.5,0,0),v.halfHeight.set(0,w.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),p++}else if(w.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(w.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function iu(t){const e=new JA(t),n=[],i=[],s=[];function r(d){h.camera=d,n.length=0,i.length=0,s.length=0}function a(d){n.push(d)}function o(d){i.push(d)}function c(d){s.push(d)}function l(){e.setup(n)}function u(d){e.setupView(n,d)}const h={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function jA(t){let e=new WeakMap;function n(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new iu(t),e.set(s,[o])):r>=a.length?(o=new iu(t),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:n,dispose:i}}const QA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,eT=`uniform sampler2D shadow_pass;
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
}`,tT=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],nT=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],su=new lt,ws=new U,ao=new U;function iT(t,e,n){let i=new zc;const s=new Fe,r=new Fe,a=new dt,o=new hy,c=new fy,l={},u=n.maxTextureSize,h={[ri]:qt,[qt]:ri,[Sn]:Sn},d=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:QA,fragmentShader:eT}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new zt;p.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new pn(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vr;let g=this.type;this.render=function(y,T,M){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;this.type===yv&&(Le("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Vr);const b=t.getRenderTarget(),P=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),I=t.state;I.setBlending(kn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const X=g!==this.type;X&&T.traverse(function(H){H.material&&(Array.isArray(H.material)?H.material.forEach(D=>D.needsUpdate=!0):H.material.needsUpdate=!0)});for(let H=0,D=y.length;H<D;H++){const W=y[H],B=W.shadow;if(B===void 0){Le("WebGLShadowMap:",W,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const q=B.getFrameExtents();s.multiply(q),r.copy(B.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/q.x),s.x=r.x*q.x,B.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/q.y),s.y=r.y*q.y,B.mapSize.y=r.y));const te=t.state.buffers.depth.getReversed();if(B.camera._reversedDepth=te,B.map===null||X===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Ls){if(W.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Tn(s.x,s.y,{format:wi,type:Vn,minFilter:Ut,magFilter:Ut,generateMipmaps:!1}),B.map.texture.name=W.name+".shadowMap",B.map.depthTexture=new cs(s.x,s.y,En),B.map.depthTexture.name=W.name+".shadowMapDepth",B.map.depthTexture.format=zn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=It,B.map.depthTexture.magFilter=It}else W.isPointLight?(B.map=new Ch(s.x),B.map.depthTexture=new zM(s.x,Rn)):(B.map=new Tn(s.x,s.y),B.map.depthTexture=new cs(s.x,s.y,Rn)),B.map.depthTexture.name=W.name+".shadowMap",B.map.depthTexture.format=zn,this.type===Vr?(B.map.depthTexture.compareFunction=te?Oc:Uc,B.map.depthTexture.minFilter=Ut,B.map.depthTexture.magFilter=Ut):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=It,B.map.depthTexture.magFilter=It);B.camera.updateProjectionMatrix()}const re=B.map.isWebGLCubeRenderTarget?6:1;for(let ce=0;ce<re;ce++){if(B.map.isWebGLCubeRenderTarget)t.setRenderTarget(B.map,ce),t.clear();else{ce===0&&(t.setRenderTarget(B.map),t.clear());const ae=B.getViewport(ce);a.set(r.x*ae.x,r.y*ae.y,r.x*ae.z,r.y*ae.w),I.viewport(a)}if(W.isPointLight){const ae=B.camera,ze=B.matrix,Je=W.distance||ae.far;Je!==ae.far&&(ae.far=Je,ae.updateProjectionMatrix()),ws.setFromMatrixPosition(W.matrixWorld),ae.position.copy(ws),ao.copy(ae.position),ao.add(tT[ce]),ae.up.copy(nT[ce]),ae.lookAt(ao),ae.updateMatrixWorld(),ze.makeTranslation(-ws.x,-ws.y,-ws.z),su.multiplyMatrices(ae.projectionMatrix,ae.matrixWorldInverse),B._frustum.setFromProjectionMatrix(su,ae.coordinateSystem,ae.reversedDepth)}else B.updateMatrices(W);i=B.getFrustum(),v(T,M,B.camera,W,this.type)}B.isPointLightShadow!==!0&&this.type===Ls&&A(B,M),B.needsUpdate=!1}g=this.type,m.needsUpdate=!1,t.setRenderTarget(b,P,C)};function A(y,T){const M=e.update(_);d.defines.VSM_SAMPLES!==y.blurSamples&&(d.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new Tn(s.x,s.y,{format:wi,type:Vn})),d.uniforms.shadow_pass.value=y.map.depthTexture,d.uniforms.resolution.value=y.mapSize,d.uniforms.radius.value=y.radius,t.setRenderTarget(y.mapPass),t.clear(),t.renderBufferDirect(T,null,M,d,_,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,t.setRenderTarget(y.map),t.clear(),t.renderBufferDirect(T,null,M,f,_,null)}function w(y,T,M,b){let P=null;const C=M.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(C!==void 0)P=C;else if(P=M.isPointLight===!0?c:o,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const I=P.uuid,X=T.uuid;let H=l[I];H===void 0&&(H={},l[I]=H);let D=H[X];D===void 0&&(D=P.clone(),H[X]=D,T.addEventListener("dispose",S)),P=D}if(P.visible=T.visible,P.wireframe=T.wireframe,b===Ls?P.side=T.shadowSide!==null?T.shadowSide:T.side:P.side=T.shadowSide!==null?T.shadowSide:h[T.side],P.alphaMap=T.alphaMap,P.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,P.map=T.map,P.clipShadows=T.clipShadows,P.clippingPlanes=T.clippingPlanes,P.clipIntersection=T.clipIntersection,P.displacementMap=T.displacementMap,P.displacementScale=T.displacementScale,P.displacementBias=T.displacementBias,P.wireframeLinewidth=T.wireframeLinewidth,P.linewidth=T.linewidth,M.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const I=t.properties.get(P);I.light=M}return P}function v(y,T,M,b,P){if(y.visible===!1)return;if(y.layers.test(T.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&P===Ls)&&(!y.frustumCulled||i.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,y.matrixWorld);const X=e.update(y),H=y.material;if(Array.isArray(H)){const D=X.groups;for(let W=0,B=D.length;W<B;W++){const q=D[W],te=H[q.materialIndex];if(te&&te.visible){const re=w(y,te,b,P);y.onBeforeShadow(t,y,T,M,X,re,q),t.renderBufferDirect(M,null,X,re,y,q),y.onAfterShadow(t,y,T,M,X,re,q)}}}else if(H.visible){const D=w(y,H,b,P);y.onBeforeShadow(t,y,T,M,X,D,null),t.renderBufferDirect(M,null,X,D,y,null),y.onAfterShadow(t,y,T,M,X,D,null)}}const I=y.children;for(let X=0,H=I.length;X<H;X++)v(I[X],T,M,b,P)}function S(y){y.target.removeEventListener("dispose",S);for(const M in l){const b=l[M],P=y.target.uuid;P in b&&(b[P].dispose(),delete b[P])}}}function sT(t,e){function n(){let L=!1;const le=new dt;let J=null;const me=new dt(0,0,0,0);return{setMask:function(Me){J!==Me&&!L&&(t.colorMask(Me,Me,Me,Me),J=Me)},setLocked:function(Me){L=Me},setClear:function(Me,ee,Te,be,mt){mt===!0&&(Me*=be,ee*=be,Te*=be),le.set(Me,ee,Te,be),me.equals(le)===!1&&(t.clearColor(Me,ee,Te,be),me.copy(le))},reset:function(){L=!1,J=null,me.set(-1,0,0,0)}}}function i(){let L=!1,le=!1,J=null,me=null,Me=null;return{setReversed:function(ee){if(le!==ee){const Te=e.get("EXT_clip_control");ee?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),le=ee;const be=Me;Me=null,this.setClear(be)}},getReversed:function(){return le},setTest:function(ee){ee?ie(t.DEPTH_TEST):Ne(t.DEPTH_TEST)},setMask:function(ee){J!==ee&&!L&&(t.depthMask(ee),J=ee)},setFunc:function(ee){if(le&&(ee=eM[ee]),me!==ee){switch(ee){case bo:t.depthFunc(t.NEVER);break;case Ao:t.depthFunc(t.ALWAYS);break;case To:t.depthFunc(t.LESS);break;case as:t.depthFunc(t.LEQUAL);break;case wo:t.depthFunc(t.EQUAL);break;case Ro:t.depthFunc(t.GEQUAL);break;case Co:t.depthFunc(t.GREATER);break;case Po:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}me=ee}},setLocked:function(ee){L=ee},setClear:function(ee){Me!==ee&&(Me=ee,le&&(ee=1-ee),t.clearDepth(ee))},reset:function(){L=!1,J=null,me=null,Me=null,le=!1}}}function s(){let L=!1,le=null,J=null,me=null,Me=null,ee=null,Te=null,be=null,mt=null;return{setTest:function(rt){L||(rt?ie(t.STENCIL_TEST):Ne(t.STENCIL_TEST))},setMask:function(rt){le!==rt&&!L&&(t.stencilMask(rt),le=rt)},setFunc:function(rt,mn,gn){(J!==rt||me!==mn||Me!==gn)&&(t.stencilFunc(rt,mn,gn),J=rt,me=mn,Me=gn)},setOp:function(rt,mn,gn){(ee!==rt||Te!==mn||be!==gn)&&(t.stencilOp(rt,mn,gn),ee=rt,Te=mn,be=gn)},setLocked:function(rt){L=rt},setClear:function(rt){mt!==rt&&(t.clearStencil(rt),mt=rt)},reset:function(){L=!1,le=null,J=null,me=null,Me=null,ee=null,Te=null,be=null,mt=null}}}const r=new n,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let u={},h={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,A=null,w=null,v=null,S=null,y=null,T=null,M=new $e(0,0,0),b=0,P=!1,C=null,I=null,X=null,H=null,D=null;const W=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,q=0;const te=t.getParameter(t.VERSION);te.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(te)[1]),B=q>=1):te.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),B=q>=2);let re=null,ce={};const ae=t.getParameter(t.SCISSOR_BOX),ze=t.getParameter(t.VIEWPORT),Je=new dt().fromArray(ae),He=new dt().fromArray(ze);function Z(L,le,J,me){const Me=new Uint8Array(4),ee=t.createTexture();t.bindTexture(L,ee),t.texParameteri(L,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(L,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Te=0;Te<J;Te++)L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY?t.texImage3D(le,0,t.RGBA,1,1,me,0,t.RGBA,t.UNSIGNED_BYTE,Me):t.texImage2D(le+Te,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Me);return ee}const oe={};oe[t.TEXTURE_2D]=Z(t.TEXTURE_2D,t.TEXTURE_2D,1),oe[t.TEXTURE_CUBE_MAP]=Z(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[t.TEXTURE_2D_ARRAY]=Z(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),oe[t.TEXTURE_3D]=Z(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(t.DEPTH_TEST),a.setFunc(as),Ke(!1),ft(ql),ie(t.CULL_FACE),ye(kn);function ie(L){u[L]!==!0&&(t.enable(L),u[L]=!0)}function Ne(L){u[L]!==!1&&(t.disable(L),u[L]=!1)}function j(L,le){return d[L]!==le?(t.bindFramebuffer(L,le),d[L]=le,L===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=le),L===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=le),!0):!1}function G(L,le){let J=p,me=!1;if(L){J=f.get(le),J===void 0&&(J=[],f.set(le,J));const Me=L.textures;if(J.length!==Me.length||J[0]!==t.COLOR_ATTACHMENT0){for(let ee=0,Te=Me.length;ee<Te;ee++)J[ee]=t.COLOR_ATTACHMENT0+ee;J.length=Me.length,me=!0}}else J[0]!==t.BACK&&(J[0]=t.BACK,me=!0);me&&t.drawBuffers(J)}function he(L){return _!==L?(t.useProgram(L),_=L,!0):!1}const ne={[gi]:t.FUNC_ADD,[Ev]:t.FUNC_SUBTRACT,[bv]:t.FUNC_REVERSE_SUBTRACT};ne[Av]=t.MIN,ne[Tv]=t.MAX;const de={[wv]:t.ZERO,[Rv]:t.ONE,[Cv]:t.SRC_COLOR,[So]:t.SRC_ALPHA,[Fv]:t.SRC_ALPHA_SATURATE,[Dv]:t.DST_COLOR,[Iv]:t.DST_ALPHA,[Pv]:t.ONE_MINUS_SRC_COLOR,[Eo]:t.ONE_MINUS_SRC_ALPHA,[Nv]:t.ONE_MINUS_DST_COLOR,[Lv]:t.ONE_MINUS_DST_ALPHA,[Uv]:t.CONSTANT_COLOR,[Ov]:t.ONE_MINUS_CONSTANT_COLOR,[kv]:t.CONSTANT_ALPHA,[Bv]:t.ONE_MINUS_CONSTANT_ALPHA};function ye(L,le,J,me,Me,ee,Te,be,mt,rt){if(L===kn){m===!0&&(Ne(t.BLEND),m=!1);return}if(m===!1&&(ie(t.BLEND),m=!0),L!==Sv){if(L!==g||rt!==P){if((A!==gi||S!==gi)&&(t.blendEquation(t.FUNC_ADD),A=gi,S=gi),rt)switch(L){case is:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Yl:t.blendFunc(t.ONE,t.ONE);break;case Kl:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Zl:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:Ye("WebGLState: Invalid blending: ",L);break}else switch(L){case is:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Yl:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case Kl:Ye("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Zl:Ye("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ye("WebGLState: Invalid blending: ",L);break}w=null,v=null,y=null,T=null,M.set(0,0,0),b=0,g=L,P=rt}return}Me=Me||le,ee=ee||J,Te=Te||me,(le!==A||Me!==S)&&(t.blendEquationSeparate(ne[le],ne[Me]),A=le,S=Me),(J!==w||me!==v||ee!==y||Te!==T)&&(t.blendFuncSeparate(de[J],de[me],de[ee],de[Te]),w=J,v=me,y=ee,T=Te),(be.equals(M)===!1||mt!==b)&&(t.blendColor(be.r,be.g,be.b,mt),M.copy(be),b=mt),g=L,P=!1}function we(L,le){L.side===Sn?Ne(t.CULL_FACE):ie(t.CULL_FACE);let J=L.side===qt;le&&(J=!J),Ke(J),L.blending===is&&L.transparent===!1?ye(kn):ye(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const me=L.stencilWrite;o.setTest(me),me&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Pt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):Ne(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ke(L){C!==L&&(L?t.frontFace(t.CW):t.frontFace(t.CCW),C=L)}function ft(L){L!==vv?(ie(t.CULL_FACE),L!==I&&(L===ql?t.cullFace(t.BACK):L===Mv?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ne(t.CULL_FACE),I=L}function Tt(L){L!==X&&(B&&t.lineWidth(L),X=L)}function Pt(L,le,J){L?(ie(t.POLYGON_OFFSET_FILL),(H!==le||D!==J)&&(H=le,D=J,a.getReversed()&&(le=-le),t.polygonOffset(le,J))):Ne(t.POLYGON_OFFSET_FILL)}function pt(L){L?ie(t.SCISSOR_TEST):Ne(t.SCISSOR_TEST)}function Mt(L){L===void 0&&(L=t.TEXTURE0+W-1),re!==L&&(t.activeTexture(L),re=L)}function N(L,le,J){J===void 0&&(re===null?J=t.TEXTURE0+W-1:J=re);let me=ce[J];me===void 0&&(me={type:void 0,texture:void 0},ce[J]=me),(me.type!==L||me.texture!==le)&&(re!==J&&(t.activeTexture(J),re=J),t.bindTexture(L,le||oe[L]),me.type=L,me.texture=le)}function Ht(){const L=ce[re];L!==void 0&&L.type!==void 0&&(t.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function je(){try{t.compressedTexImage2D(...arguments)}catch(L){Ye("WebGLState:",L)}}function R(){try{t.compressedTexImage3D(...arguments)}catch(L){Ye("WebGLState:",L)}}function x(){try{t.texSubImage2D(...arguments)}catch(L){Ye("WebGLState:",L)}}function O(){try{t.texSubImage3D(...arguments)}catch(L){Ye("WebGLState:",L)}}function z(){try{t.compressedTexSubImage2D(...arguments)}catch(L){Ye("WebGLState:",L)}}function Y(){try{t.compressedTexSubImage3D(...arguments)}catch(L){Ye("WebGLState:",L)}}function se(){try{t.texStorage2D(...arguments)}catch(L){Ye("WebGLState:",L)}}function ue(){try{t.texStorage3D(...arguments)}catch(L){Ye("WebGLState:",L)}}function K(){try{t.texImage2D(...arguments)}catch(L){Ye("WebGLState:",L)}}function Q(){try{t.texImage3D(...arguments)}catch(L){Ye("WebGLState:",L)}}function fe(L){return h[L]!==void 0?h[L]:t.getParameter(L)}function Re(L,le){h[L]!==le&&(t.pixelStorei(L,le),h[L]=le)}function ge(L){Je.equals(L)===!1&&(t.scissor(L.x,L.y,L.z,L.w),Je.copy(L))}function pe(L){He.equals(L)===!1&&(t.viewport(L.x,L.y,L.z,L.w),He.copy(L))}function Ie(L,le){let J=l.get(le);J===void 0&&(J=new WeakMap,l.set(le,J));let me=J.get(L);me===void 0&&(me=t.getUniformBlockIndex(le,L.name),J.set(L,me))}function De(L,le){const me=l.get(le).get(L);c.get(le)!==me&&(t.uniformBlockBinding(le,me,L.__bindingPointIndex),c.set(le,me))}function Oe(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},h={},re=null,ce={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,A=null,w=null,v=null,S=null,y=null,T=null,M=new $e(0,0,0),b=0,P=!1,C=null,I=null,X=null,H=null,D=null,Je.set(0,0,t.canvas.width,t.canvas.height),He.set(0,0,t.canvas.width,t.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:Ne,bindFramebuffer:j,drawBuffers:G,useProgram:he,setBlending:ye,setMaterial:we,setFlipSided:Ke,setCullFace:ft,setLineWidth:Tt,setPolygonOffset:Pt,setScissorTest:pt,activeTexture:Mt,bindTexture:N,unbindTexture:Ht,compressedTexImage2D:je,compressedTexImage3D:R,texImage2D:K,texImage3D:Q,pixelStorei:Re,getParameter:fe,updateUBOMapping:Ie,uniformBlockBinding:De,texStorage2D:se,texStorage3D:ue,texSubImage2D:x,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:Y,scissor:ge,viewport:pe,reset:Oe}}function rT(t,e,n,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Fe,u=new WeakMap,h=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,x){return p?new OffscreenCanvas(R,x):oa("canvas")}function m(R,x,O){let z=1;const Y=je(R);if((Y.width>O||Y.height>O)&&(z=O/Math.max(Y.width,Y.height)),z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const se=Math.floor(z*Y.width),ue=Math.floor(z*Y.height);d===void 0&&(d=_(se,ue));const K=x?_(se,ue):d;return K.width=se,K.height=ue,K.getContext("2d").drawImage(R,0,0,se,ue),Le("WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+se+"x"+ue+")."),K}else return"data"in R&&Le("WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),R;return R}function g(R){return R.generateMipmaps}function A(R){t.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?t.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function v(R,x,O,z,Y,se=!1){if(R!==null){if(t[R]!==void 0)return t[R];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ue;z&&(ue=e.get("EXT_texture_norm16"),ue||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=x;if(x===t.RED&&(O===t.FLOAT&&(K=t.R32F),O===t.HALF_FLOAT&&(K=t.R16F),O===t.UNSIGNED_BYTE&&(K=t.R8),O===t.UNSIGNED_SHORT&&ue&&(K=ue.R16_EXT),O===t.SHORT&&ue&&(K=ue.R16_SNORM_EXT)),x===t.RED_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.R8UI),O===t.UNSIGNED_SHORT&&(K=t.R16UI),O===t.UNSIGNED_INT&&(K=t.R32UI),O===t.BYTE&&(K=t.R8I),O===t.SHORT&&(K=t.R16I),O===t.INT&&(K=t.R32I)),x===t.RG&&(O===t.FLOAT&&(K=t.RG32F),O===t.HALF_FLOAT&&(K=t.RG16F),O===t.UNSIGNED_BYTE&&(K=t.RG8),O===t.UNSIGNED_SHORT&&ue&&(K=ue.RG16_EXT),O===t.SHORT&&ue&&(K=ue.RG16_SNORM_EXT)),x===t.RG_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.RG8UI),O===t.UNSIGNED_SHORT&&(K=t.RG16UI),O===t.UNSIGNED_INT&&(K=t.RG32UI),O===t.BYTE&&(K=t.RG8I),O===t.SHORT&&(K=t.RG16I),O===t.INT&&(K=t.RG32I)),x===t.RGB_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.RGB8UI),O===t.UNSIGNED_SHORT&&(K=t.RGB16UI),O===t.UNSIGNED_INT&&(K=t.RGB32UI),O===t.BYTE&&(K=t.RGB8I),O===t.SHORT&&(K=t.RGB16I),O===t.INT&&(K=t.RGB32I)),x===t.RGBA_INTEGER&&(O===t.UNSIGNED_BYTE&&(K=t.RGBA8UI),O===t.UNSIGNED_SHORT&&(K=t.RGBA16UI),O===t.UNSIGNED_INT&&(K=t.RGBA32UI),O===t.BYTE&&(K=t.RGBA8I),O===t.SHORT&&(K=t.RGBA16I),O===t.INT&&(K=t.RGBA32I)),x===t.RGB&&(O===t.UNSIGNED_SHORT&&ue&&(K=ue.RGB16_EXT),O===t.SHORT&&ue&&(K=ue.RGB16_SNORM_EXT),O===t.UNSIGNED_INT_5_9_9_9_REV&&(K=t.RGB9_E5),O===t.UNSIGNED_INT_10F_11F_11F_REV&&(K=t.R11F_G11F_B10F)),x===t.RGBA){const Q=se?aa:We.getTransfer(Y);O===t.FLOAT&&(K=t.RGBA32F),O===t.HALF_FLOAT&&(K=t.RGBA16F),O===t.UNSIGNED_BYTE&&(K=Q===Qe?t.SRGB8_ALPHA8:t.RGBA8),O===t.UNSIGNED_SHORT&&ue&&(K=ue.RGBA16_EXT),O===t.SHORT&&ue&&(K=ue.RGBA16_SNORM_EXT),O===t.UNSIGNED_SHORT_4_4_4_4&&(K=t.RGBA4),O===t.UNSIGNED_SHORT_5_5_5_1&&(K=t.RGB5_A1)}return(K===t.R16F||K===t.R32F||K===t.RG16F||K===t.RG32F||K===t.RGBA16F||K===t.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function S(R,x){let O;return R?x===null||x===Rn||x===Hs?O=t.DEPTH24_STENCIL8:x===En?O=t.DEPTH32F_STENCIL8:x===zs&&(O=t.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Rn||x===Hs?O=t.DEPTH_COMPONENT24:x===En?O=t.DEPTH_COMPONENT32F:x===zs&&(O=t.DEPTH_COMPONENT16),O}function y(R,x){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==It&&R.minFilter!==Ut?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function T(R){const x=R.target;x.removeEventListener("dispose",T),b(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&h.delete(x)}function M(R){const x=R.target;x.removeEventListener("dispose",M),C(x)}function b(R){const x=i.get(R);if(x.__webglInit===void 0)return;const O=R.source,z=f.get(O);if(z){const Y=z[x.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&P(R),Object.keys(z).length===0&&f.delete(O)}i.remove(R)}function P(R){const x=i.get(R);t.deleteTexture(x.__webglTexture);const O=R.source,z=f.get(O);delete z[x.__cacheKey],a.memory.textures--}function C(R){const x=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(x.__webglFramebuffer[z]))for(let Y=0;Y<x.__webglFramebuffer[z].length;Y++)t.deleteFramebuffer(x.__webglFramebuffer[z][Y]);else t.deleteFramebuffer(x.__webglFramebuffer[z]);x.__webglDepthbuffer&&t.deleteRenderbuffer(x.__webglDepthbuffer[z])}else{if(Array.isArray(x.__webglFramebuffer))for(let z=0;z<x.__webglFramebuffer.length;z++)t.deleteFramebuffer(x.__webglFramebuffer[z]);else t.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&t.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&t.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let z=0;z<x.__webglColorRenderbuffer.length;z++)x.__webglColorRenderbuffer[z]&&t.deleteRenderbuffer(x.__webglColorRenderbuffer[z]);x.__webglDepthRenderbuffer&&t.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const O=R.textures;for(let z=0,Y=O.length;z<Y;z++){const se=i.get(O[z]);se.__webglTexture&&(t.deleteTexture(se.__webglTexture),a.memory.textures--),i.remove(O[z])}i.remove(R)}let I=0;function X(){I=0}function H(){return I}function D(R){I=R}function W(){const R=I;return R>=s.maxTextures&&Le("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function B(R){const x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function q(R,x){const O=i.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&O.__version!==R.version){const z=R.image;if(z===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{Ne(O,R,x);return}}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,O.__webglTexture,t.TEXTURE0+x)}function te(R,x){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ne(O,R,x);return}else R.isExternalTexture&&(O.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,O.__webglTexture,t.TEXTURE0+x)}function re(R,x){const O=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){Ne(O,R,x);return}n.bindTexture(t.TEXTURE_3D,O.__webglTexture,t.TEXTURE0+x)}function ce(R,x){const O=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&O.__version!==R.version){j(O,R,x);return}n.bindTexture(t.TEXTURE_CUBE_MAP,O.__webglTexture,t.TEXTURE0+x)}const ae={[Io]:t.REPEAT,[Un]:t.CLAMP_TO_EDGE,[Lo]:t.MIRRORED_REPEAT},ze={[It]:t.NEAREST,[Hv]:t.NEAREST_MIPMAP_NEAREST,[cr]:t.NEAREST_MIPMAP_LINEAR,[Ut]:t.LINEAR,[Pa]:t.LINEAR_MIPMAP_NEAREST,[vi]:t.LINEAR_MIPMAP_LINEAR},Je={[Wv]:t.NEVER,[Zv]:t.ALWAYS,[Xv]:t.LESS,[Uc]:t.LEQUAL,[qv]:t.EQUAL,[Oc]:t.GEQUAL,[Yv]:t.GREATER,[Kv]:t.NOTEQUAL};function He(R,x){if(x.type===En&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Ut||x.magFilter===Pa||x.magFilter===cr||x.magFilter===vi||x.minFilter===Ut||x.minFilter===Pa||x.minFilter===cr||x.minFilter===vi)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,ae[x.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,ae[x.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,ae[x.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,ze[x.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,ze[x.minFilter]),x.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,Je[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===It||x.minFilter!==cr&&x.minFilter!==vi||x.type===En&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Z(R,x){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",T));const z=x.source;let Y=f.get(z);Y===void 0&&(Y={},f.set(z,Y));const se=B(x);if(se!==R.__cacheKey){Y[se]===void 0&&(Y[se]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Y[se].usedTimes++;const ue=Y[R.__cacheKey];ue!==void 0&&(Y[R.__cacheKey].usedTimes--,ue.usedTimes===0&&P(x)),R.__cacheKey=se,R.__webglTexture=Y[se].texture}return O}function oe(R,x,O){return Math.floor(Math.floor(R/O)/x)}function ie(R,x,O,z){const se=R.updateRanges;if(se.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,x.width,x.height,O,z,x.data);else{se.sort((Re,ge)=>Re.start-ge.start);let ue=0;for(let Re=1;Re<se.length;Re++){const ge=se[ue],pe=se[Re],Ie=ge.start+ge.count,De=oe(pe.start,x.width,4),Oe=oe(ge.start,x.width,4);pe.start<=Ie+1&&De===Oe&&oe(pe.start+pe.count-1,x.width,4)===De?ge.count=Math.max(ge.count,pe.start+pe.count-ge.start):(++ue,se[ue]=pe)}se.length=ue+1;const K=n.getParameter(t.UNPACK_ROW_LENGTH),Q=n.getParameter(t.UNPACK_SKIP_PIXELS),fe=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,x.width);for(let Re=0,ge=se.length;Re<ge;Re++){const pe=se[Re],Ie=Math.floor(pe.start/4),De=Math.ceil(pe.count/4),Oe=Ie%x.width,L=Math.floor(Ie/x.width),le=De,J=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Oe),n.pixelStorei(t.UNPACK_SKIP_ROWS,L),n.texSubImage2D(t.TEXTURE_2D,0,Oe,L,le,J,O,z,x.data)}R.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,K),n.pixelStorei(t.UNPACK_SKIP_PIXELS,Q),n.pixelStorei(t.UNPACK_SKIP_ROWS,fe)}}function Ne(R,x,O){let z=t.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(z=t.TEXTURE_2D_ARRAY),x.isData3DTexture&&(z=t.TEXTURE_3D);const Y=Z(R,x),se=x.source;n.bindTexture(z,R.__webglTexture,t.TEXTURE0+O);const ue=i.get(se);if(se.version!==ue.__version||Y===!0){if(n.activeTexture(t.TEXTURE0+O),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const J=We.getPrimaries(We.workingColorSpace),me=x.colorSpace===ei?null:We.getPrimaries(x.colorSpace),Me=x.colorSpace===ei||J===me?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Me)}n.pixelStorei(t.UNPACK_ALIGNMENT,x.unpackAlignment);let Q=m(x.image,!1,s.maxTextureSize);Q=Ht(x,Q);const fe=r.convert(x.format,x.colorSpace),Re=r.convert(x.type);let ge=v(x.internalFormat,fe,Re,x.normalized,x.colorSpace,x.isVideoTexture);He(z,x);let pe;const Ie=x.mipmaps,De=x.isVideoTexture!==!0,Oe=ue.__version===void 0||Y===!0,L=se.dataReady,le=y(x,Q);if(x.isDepthTexture)ge=S(x.format===Mi,x.type),Oe&&(De?n.texStorage2D(t.TEXTURE_2D,1,ge,Q.width,Q.height):n.texImage2D(t.TEXTURE_2D,0,ge,Q.width,Q.height,0,fe,Re,null));else if(x.isDataTexture)if(Ie.length>0){De&&Oe&&n.texStorage2D(t.TEXTURE_2D,le,ge,Ie[0].width,Ie[0].height);for(let J=0,me=Ie.length;J<me;J++)pe=Ie[J],De?L&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,pe.width,pe.height,fe,Re,pe.data):n.texImage2D(t.TEXTURE_2D,J,ge,pe.width,pe.height,0,fe,Re,pe.data);x.generateMipmaps=!1}else De?(Oe&&n.texStorage2D(t.TEXTURE_2D,le,ge,Q.width,Q.height),L&&ie(x,Q,fe,Re)):n.texImage2D(t.TEXTURE_2D,0,ge,Q.width,Q.height,0,fe,Re,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){De&&Oe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,le,ge,Ie[0].width,Ie[0].height,Q.depth);for(let J=0,me=Ie.length;J<me;J++)if(pe=Ie[J],x.format!==fn)if(fe!==null)if(De){if(L)if(x.layerUpdates.size>0){const Me=Fd(pe.width,pe.height,x.format,x.type);for(const ee of x.layerUpdates){const Te=pe.data.subarray(ee*Me/pe.data.BYTES_PER_ELEMENT,(ee+1)*Me/pe.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,ee,pe.width,pe.height,1,fe,Te)}x.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,pe.width,pe.height,Q.depth,fe,pe.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,J,ge,pe.width,pe.height,Q.depth,0,pe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?L&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,J,0,0,0,pe.width,pe.height,Q.depth,fe,Re,pe.data):n.texImage3D(t.TEXTURE_2D_ARRAY,J,ge,pe.width,pe.height,Q.depth,0,fe,Re,pe.data)}else{De&&Oe&&n.texStorage2D(t.TEXTURE_2D,le,ge,Ie[0].width,Ie[0].height);for(let J=0,me=Ie.length;J<me;J++)pe=Ie[J],x.format!==fn?fe!==null?De?L&&n.compressedTexSubImage2D(t.TEXTURE_2D,J,0,0,pe.width,pe.height,fe,pe.data):n.compressedTexImage2D(t.TEXTURE_2D,J,ge,pe.width,pe.height,0,pe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?L&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,pe.width,pe.height,fe,Re,pe.data):n.texImage2D(t.TEXTURE_2D,J,ge,pe.width,pe.height,0,fe,Re,pe.data)}else if(x.isDataArrayTexture)if(De){if(Oe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,le,ge,Q.width,Q.height,Q.depth),L)if(x.layerUpdates.size>0){const J=Fd(Q.width,Q.height,x.format,x.type);for(const me of x.layerUpdates){const Me=Q.data.subarray(me*J/Q.data.BYTES_PER_ELEMENT,(me+1)*J/Q.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,me,Q.width,Q.height,1,fe,Re,Me)}x.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,fe,Re,Q.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,ge,Q.width,Q.height,Q.depth,0,fe,Re,Q.data);else if(x.isData3DTexture)De?(Oe&&n.texStorage3D(t.TEXTURE_3D,le,ge,Q.width,Q.height,Q.depth),L&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,fe,Re,Q.data)):n.texImage3D(t.TEXTURE_3D,0,ge,Q.width,Q.height,Q.depth,0,fe,Re,Q.data);else if(x.isFramebufferTexture){if(Oe)if(De)n.texStorage2D(t.TEXTURE_2D,le,ge,Q.width,Q.height);else{let J=Q.width,me=Q.height;for(let Me=0;Me<le;Me++)n.texImage2D(t.TEXTURE_2D,Me,ge,J,me,0,fe,Re,null),J>>=1,me>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in t){const J=t.canvas;if(J.hasAttribute("layoutsubtree")||J.setAttribute("layoutsubtree","true"),Q.parentNode!==J){J.appendChild(Q),h.add(x),J.onpaint=me=>{const Me=me.changedElements;for(const ee of h)Me.includes(ee.image)&&(ee.needsUpdate=!0)},J.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,Q);else{const Me=t.RGBA,ee=t.RGBA,Te=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,Me,ee,Te,Q)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Ie.length>0){if(De&&Oe){const J=je(Ie[0]);n.texStorage2D(t.TEXTURE_2D,le,ge,J.width,J.height)}for(let J=0,me=Ie.length;J<me;J++)pe=Ie[J],De?L&&n.texSubImage2D(t.TEXTURE_2D,J,0,0,fe,Re,pe):n.texImage2D(t.TEXTURE_2D,J,ge,fe,Re,pe);x.generateMipmaps=!1}else if(De){if(Oe){const J=je(Q);n.texStorage2D(t.TEXTURE_2D,le,ge,J.width,J.height)}L&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,fe,Re,Q)}else n.texImage2D(t.TEXTURE_2D,0,ge,fe,Re,Q);g(x)&&A(z),ue.__version=se.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function j(R,x,O){if(x.image.length!==6)return;const z=Z(R,x),Y=x.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+O);const se=i.get(Y);if(Y.version!==se.__version||z===!0){n.activeTexture(t.TEXTURE0+O);const ue=We.getPrimaries(We.workingColorSpace),K=x.colorSpace===ei?null:We.getPrimaries(x.colorSpace),Q=x.colorSpace===ei||ue===K?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const fe=x.isCompressedTexture||x.image[0].isCompressedTexture,Re=x.image[0]&&x.image[0].isDataTexture,ge=[];for(let ee=0;ee<6;ee++)!fe&&!Re?ge[ee]=m(x.image[ee],!0,s.maxCubemapSize):ge[ee]=Re?x.image[ee].image:x.image[ee],ge[ee]=Ht(x,ge[ee]);const pe=ge[0],Ie=r.convert(x.format,x.colorSpace),De=r.convert(x.type),Oe=v(x.internalFormat,Ie,De,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,le=se.__version===void 0||z===!0,J=Y.dataReady;let me=y(x,pe);He(t.TEXTURE_CUBE_MAP,x);let Me;if(fe){L&&le&&n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Oe,pe.width,pe.height);for(let ee=0;ee<6;ee++){Me=ge[ee].mipmaps;for(let Te=0;Te<Me.length;Te++){const be=Me[Te];x.format!==fn?Ie!==null?L?J&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,0,0,be.width,be.height,Ie,be.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,Oe,be.width,be.height,0,be.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,0,0,be.width,be.height,Ie,De,be.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te,Oe,be.width,be.height,0,Ie,De,be.data)}}}else{if(Me=x.mipmaps,L&&le){Me.length>0&&me++;const ee=je(ge[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Oe,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(Re){L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ge[ee].width,ge[ee].height,Ie,De,ge[ee].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Oe,ge[ee].width,ge[ee].height,0,Ie,De,ge[ee].data);for(let Te=0;Te<Me.length;Te++){const mt=Me[Te].image[ee].image;L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,0,0,mt.width,mt.height,Ie,De,mt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,Oe,mt.width,mt.height,0,Ie,De,mt.data)}}else{L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ie,De,ge[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Oe,Ie,De,ge[ee]);for(let Te=0;Te<Me.length;Te++){const be=Me[Te];L?J&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,0,0,Ie,De,be.image[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Te+1,Oe,Ie,De,be.image[ee])}}}g(x)&&A(t.TEXTURE_CUBE_MAP),se.__version=Y.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function G(R,x,O,z,Y,se){const ue=r.convert(O.format,O.colorSpace),K=r.convert(O.type),Q=v(O.internalFormat,ue,K,O.normalized,O.colorSpace),fe=i.get(x),Re=i.get(O);if(Re.__renderTarget=x,!fe.__hasExternalTextures){const ge=Math.max(1,x.width>>se),pe=Math.max(1,x.height>>se);Y===t.TEXTURE_3D||Y===t.TEXTURE_2D_ARRAY?n.texImage3D(Y,se,Q,ge,pe,x.depth,0,ue,K,null):n.texImage2D(Y,se,Q,ge,pe,0,ue,K,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),Mt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,z,Y,Re.__webglTexture,0,pt(x)):(Y===t.TEXTURE_2D||Y>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,z,Y,Re.__webglTexture,se),n.bindFramebuffer(t.FRAMEBUFFER,null)}function he(R,x,O){if(t.bindRenderbuffer(t.RENDERBUFFER,R),x.depthBuffer){const z=x.depthTexture,Y=z&&z.isDepthTexture?z.type:null,se=S(x.stencilBuffer,Y),ue=x.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Mt(x)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,pt(x),se,x.width,x.height):O?t.renderbufferStorageMultisample(t.RENDERBUFFER,pt(x),se,x.width,x.height):t.renderbufferStorage(t.RENDERBUFFER,se,x.width,x.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ue,t.RENDERBUFFER,R)}else{const z=x.textures;for(let Y=0;Y<z.length;Y++){const se=z[Y],ue=r.convert(se.format,se.colorSpace),K=r.convert(se.type),Q=v(se.internalFormat,ue,K,se.normalized,se.colorSpace);Mt(x)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,pt(x),Q,x.width,x.height):O?t.renderbufferStorageMultisample(t.RENDERBUFFER,pt(x),Q,x.width,x.height):t.renderbufferStorage(t.RENDERBUFFER,Q,x.width,x.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ne(R,x,O){const z=x.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Y=i.get(x.depthTexture);if(Y.__renderTarget=x,(!Y.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z){if(Y.__webglInit===void 0&&(Y.__webglInit=!0,x.depthTexture.addEventListener("dispose",T)),Y.__webglTexture===void 0){Y.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,Y.__webglTexture),He(t.TEXTURE_CUBE_MAP,x.depthTexture);const fe=r.convert(x.depthTexture.format),Re=r.convert(x.depthTexture.type);let ge;x.depthTexture.format===zn?ge=t.DEPTH_COMPONENT24:x.depthTexture.format===Mi&&(ge=t.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ge,x.width,x.height,0,fe,Re,null)}}else q(x.depthTexture,0);const se=Y.__webglTexture,ue=pt(x),K=z?t.TEXTURE_CUBE_MAP_POSITIVE_X+O:t.TEXTURE_2D,Q=x.depthTexture.format===Mi?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(x.depthTexture.format===zn)Mt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,K,se,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,Q,K,se,0);else if(x.depthTexture.format===Mi)Mt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,K,se,0,ue):t.framebufferTexture2D(t.FRAMEBUFFER,Q,K,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function de(R){const x=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){const z=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),z){const Y=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,z.removeEventListener("dispose",Y)};z.addEventListener("dispose",Y),x.__depthDisposeCallback=Y}x.__boundDepthTexture=z}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)ne(x.__webglFramebuffer[z],R,z);else{const z=R.texture.mipmaps;z&&z.length>0?ne(x.__webglFramebuffer[0],R,0):ne(x.__webglFramebuffer,R,0)}else if(O){x.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer[z]),x.__webglDepthbuffer[z]===void 0)x.__webglDepthbuffer[z]=t.createRenderbuffer(),he(x.__webglDepthbuffer[z],R,!1);else{const Y=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer[z];t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,Y,t.RENDERBUFFER,se)}}else{const z=R.texture.mipmaps;if(z&&z.length>0?n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=t.createRenderbuffer(),he(x.__webglDepthbuffer,R,!1);else{const Y=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,Y,t.RENDERBUFFER,se)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function ye(R,x,O){const z=i.get(R);x!==void 0&&G(z.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),O!==void 0&&de(R)}function we(R){const x=R.texture,O=i.get(R),z=i.get(x);R.addEventListener("dispose",M);const Y=R.textures,se=R.isWebGLCubeRenderTarget===!0,ue=Y.length>1;if(ue||(z.__webglTexture===void 0&&(z.__webglTexture=t.createTexture()),z.__version=x.version,a.memory.textures++),se){O.__webglFramebuffer=[];for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[K]=[];for(let Q=0;Q<x.mipmaps.length;Q++)O.__webglFramebuffer[K][Q]=t.createFramebuffer()}else O.__webglFramebuffer[K]=t.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let K=0;K<x.mipmaps.length;K++)O.__webglFramebuffer[K]=t.createFramebuffer()}else O.__webglFramebuffer=t.createFramebuffer();if(ue)for(let K=0,Q=Y.length;K<Q;K++){const fe=i.get(Y[K]);fe.__webglTexture===void 0&&(fe.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&Mt(R)===!1){O.__webglMultisampledFramebuffer=t.createFramebuffer(),O.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let K=0;K<Y.length;K++){const Q=Y[K];O.__webglColorRenderbuffer[K]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,O.__webglColorRenderbuffer[K]);const fe=r.convert(Q.format,Q.colorSpace),Re=r.convert(Q.type),ge=v(Q.internalFormat,fe,Re,Q.normalized,Q.colorSpace,R.isXRRenderTarget===!0),pe=pt(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,pe,ge,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+K,t.RENDERBUFFER,O.__webglColorRenderbuffer[K])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=t.createRenderbuffer(),he(O.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(se){n.bindTexture(t.TEXTURE_CUBE_MAP,z.__webglTexture),He(t.TEXTURE_CUBE_MAP,x);for(let K=0;K<6;K++)if(x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)G(O.__webglFramebuffer[K][Q],R,x,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+K,Q);else G(O.__webglFramebuffer[K],R,x,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);g(x)&&A(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ue){for(let K=0,Q=Y.length;K<Q;K++){const fe=Y[K],Re=i.get(fe);let ge=t.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ge=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ge,Re.__webglTexture),He(ge,fe),G(O.__webglFramebuffer,R,fe,t.COLOR_ATTACHMENT0+K,ge,0),g(fe)&&A(ge)}n.unbindTexture()}else{let K=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(K=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(K,z.__webglTexture),He(K,x),x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)G(O.__webglFramebuffer[Q],R,x,t.COLOR_ATTACHMENT0,K,Q);else G(O.__webglFramebuffer,R,x,t.COLOR_ATTACHMENT0,K,0);g(x)&&A(K),n.unbindTexture()}R.depthBuffer&&de(R)}function Ke(R){const x=R.textures;for(let O=0,z=x.length;O<z;O++){const Y=x[O];if(g(Y)){const se=w(R),ue=i.get(Y).__webglTexture;n.bindTexture(se,ue),A(se),n.unbindTexture()}}}const ft=[],Tt=[];function Pt(R){if(R.samples>0){if(Mt(R)===!1){const x=R.textures,O=R.width,z=R.height;let Y=t.COLOR_BUFFER_BIT;const se=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=i.get(R),K=x.length>1;if(K)for(let fe=0;fe<x.length;fe++)n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const Q=R.texture.mipmaps;Q&&Q.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let fe=0;fe<x.length;fe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Y|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Y|=t.STENCIL_BUFFER_BIT)),K){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ue.__webglColorRenderbuffer[fe]);const Re=i.get(x[fe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Re,0)}t.blitFramebuffer(0,0,O,z,0,0,O,z,Y,t.NEAREST),c===!0&&(ft.length=0,Tt.length=0,ft.push(t.COLOR_ATTACHMENT0+fe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ft.push(se),Tt.push(se),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Tt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,ft))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),K)for(let fe=0;fe<x.length;fe++){n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.RENDERBUFFER,ue.__webglColorRenderbuffer[fe]);const Re=i.get(x[fe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ue.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+fe,t.TEXTURE_2D,Re,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const x=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[x])}}}function pt(R){return Math.min(s.maxSamples,R.samples)}function Mt(R){const x=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function N(R){const x=a.render.frame;u.get(R)!==x&&(u.set(R,x),R.update())}function Ht(R,x){const O=R.colorSpace,z=R.format,Y=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||O!==ra&&O!==ei&&(We.getTransfer(O)===Qe?(z!==fn||Y!==en)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ye("WebGLTextures: Unsupported texture color space:",O)),x}function je(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=W,this.resetTextureUnits=X,this.getTextureUnits=H,this.setTextureUnits=D,this.setTexture2D=q,this.setTexture2DArray=te,this.setTexture3D=re,this.setTextureCube=ce,this.rebindTextures=ye,this.setupRenderTarget=we,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=Pt,this.setupDepthRenderbuffer=de,this.setupFrameBufferTexture=G,this.useMultisampledRTT=Mt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function aT(t,e){function n(i,s=ei){let r;const a=We.getTransfer(s);if(i===en)return t.UNSIGNED_BYTE;if(i===Ic)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Lc)return t.UNSIGNED_SHORT_5_5_5_1;if(i===sh)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===rh)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===nh)return t.BYTE;if(i===ih)return t.SHORT;if(i===zs)return t.UNSIGNED_SHORT;if(i===Pc)return t.INT;if(i===Rn)return t.UNSIGNED_INT;if(i===En)return t.FLOAT;if(i===Vn)return t.HALF_FLOAT;if(i===ah)return t.ALPHA;if(i===oh)return t.RGB;if(i===fn)return t.RGBA;if(i===zn)return t.DEPTH_COMPONENT;if(i===Mi)return t.DEPTH_STENCIL;if(i===ch)return t.RED;if(i===Dc)return t.RED_INTEGER;if(i===wi)return t.RG;if(i===Nc)return t.RG_INTEGER;if(i===Fc)return t.RGBA_INTEGER;if(i===zr||i===Hr||i===Gr||i===$r)if(a===Qe)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===$r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Hr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Gr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===$r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Do||i===No||i===Fo||i===Uo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Do)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===No)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Fo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Uo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Oo||i===ko||i===Bo||i===Vo||i===zo||i===ia||i===Ho)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Oo||i===ko)return a===Qe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Bo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Vo)return r.COMPRESSED_R11_EAC;if(i===zo)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ia)return r.COMPRESSED_RG11_EAC;if(i===Ho)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Go||i===$o||i===Wo||i===Xo||i===qo||i===Yo||i===Ko||i===Zo||i===Jo||i===jo||i===Qo||i===ec||i===tc||i===nc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Go)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===$o)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Wo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Xo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===qo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Yo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ko)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Zo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Jo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===jo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Qo)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ec)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===tc)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===nc)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ic||i===sc||i===rc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ic)return a===Qe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===sc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===rc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ac||i===oc||i===sa||i===cc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===ac)return r.COMPRESSED_RED_RGTC1_EXT;if(i===oc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===sa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===cc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Hs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const oT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cT=`
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

}`;class lT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new vh(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Cn({vertexShader:oT,fragmentShader:cT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new pn(new xa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dT extends ci{constructor(e,n){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",m=new lT,g={},A=n.getContextAttributes();let w=null,v=null;const S=[],y=[],T=new Fe;let M=null;const b=new an;b.viewport=new dt;const P=new an;P.viewport=new dt;const C=[b,P],I=new xy;let X=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let oe=S[Z];return oe===void 0&&(oe=new Ua,S[Z]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(Z){let oe=S[Z];return oe===void 0&&(oe=new Ua,S[Z]=oe),oe.getGripSpace()},this.getHand=function(Z){let oe=S[Z];return oe===void 0&&(oe=new Ua,S[Z]=oe),oe.getHandSpace()};function D(Z){const oe=y.indexOf(Z.inputSource);if(oe===-1)return;const ie=S[oe];ie!==void 0&&(ie.update(Z.inputSource,Z.frame,l||a),ie.dispatchEvent({type:Z.type,data:Z.inputSource}))}function W(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",B);for(let Z=0;Z<S.length;Z++){const oe=y[Z];oe!==null&&(y[Z]=null,S[Z].disconnect(oe))}X=null,H=null,m.reset();for(const Z in g)delete g[Z];e.setRenderTarget(w),f=null,d=null,h=null,s=null,v=null,He.stop(),i.isPresenting=!1,e.setPixelRatio(M),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,n)),h},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",W),s.addEventListener("inputsourceschange",B),A.xrCompatible!==!0&&await n.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(T),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,Ne=null,j=null;A.depth&&(j=A.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ie=A.stencil?Mi:zn,Ne=A.stencil?Hs:Rn);const G={colorFormat:n.RGBA8,depthFormat:j,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(G),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Tn(d.textureWidth,d.textureHeight,{format:fn,type:en,depthTexture:new cs(d.textureWidth,d.textureHeight,Ne,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ie={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,n,ie),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Tn(f.framebufferWidth,f.framebufferHeight,{format:fn,type:en,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),He.setContext(s),He.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function B(Z){for(let oe=0;oe<Z.removed.length;oe++){const ie=Z.removed[oe],Ne=y.indexOf(ie);Ne>=0&&(y[Ne]=null,S[Ne].disconnect(ie))}for(let oe=0;oe<Z.added.length;oe++){const ie=Z.added[oe];let Ne=y.indexOf(ie);if(Ne===-1){for(let G=0;G<S.length;G++)if(G>=y.length){y.push(ie),Ne=G;break}else if(y[G]===null){y[G]=ie,Ne=G;break}if(Ne===-1)break}const j=S[Ne];j&&j.connect(ie)}}const q=new U,te=new U;function re(Z,oe,ie){q.setFromMatrixPosition(oe.matrixWorld),te.setFromMatrixPosition(ie.matrixWorld);const Ne=q.distanceTo(te),j=oe.projectionMatrix.elements,G=ie.projectionMatrix.elements,he=j[14]/(j[10]-1),ne=j[14]/(j[10]+1),de=(j[9]+1)/j[5],ye=(j[9]-1)/j[5],we=(j[8]-1)/j[0],Ke=(G[8]+1)/G[0],ft=he*we,Tt=he*Ke,Pt=Ne/(-we+Ke),pt=Pt*-we;if(oe.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(pt),Z.translateZ(Pt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),j[10]===-1)Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const Mt=he+Pt,N=ne+Pt,Ht=ft-pt,je=Tt+(Ne-pt),R=de*ne/N*Mt,x=ye*ne/N*Mt;Z.projectionMatrix.makePerspective(Ht,je,R,x,Mt,N),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ce(Z,oe){oe===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(oe.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let oe=Z.near,ie=Z.far;m.texture!==null&&(m.depthNear>0&&(oe=m.depthNear),m.depthFar>0&&(ie=m.depthFar)),I.near=P.near=b.near=oe,I.far=P.far=b.far=ie,(X!==I.near||H!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),X=I.near,H=I.far),I.layers.mask=Z.layers.mask|6,b.layers.mask=I.layers.mask&-5,P.layers.mask=I.layers.mask&-3;const Ne=Z.parent,j=I.cameras;ce(I,Ne);for(let G=0;G<j.length;G++)ce(j[G],Ne);j.length===2?re(I,b,P):I.projectionMatrix.copy(b.projectionMatrix),ae(Z,I,Ne)};function ae(Z,oe,ie){ie===null?Z.matrix.copy(oe.matrixWorld):(Z.matrix.copy(ie.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(oe.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(oe.projectionMatrix),Z.projectionMatrixInverse.copy(oe.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=$s*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(Z){c=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(Z){return g[Z]};let ze=null;function Je(Z,oe){if(u=oe.getViewerPose(l||a),p=oe,u!==null){const ie=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Ne=!1;ie.length!==I.cameras.length&&(I.cameras.length=0,Ne=!0);for(let ne=0;ne<ie.length;ne++){const de=ie[ne];let ye=null;if(f!==null)ye=f.getViewport(de);else{const Ke=h.getViewSubImage(d,de);ye=Ke.viewport,ne===0&&(e.setRenderTargetTextures(v,Ke.colorTexture,Ke.depthStencilTexture),e.setRenderTarget(v))}let we=C[ne];we===void 0&&(we=new an,we.layers.enable(ne),we.viewport=new dt,C[ne]=we),we.matrix.fromArray(de.transform.matrix),we.matrix.decompose(we.position,we.quaternion,we.scale),we.projectionMatrix.fromArray(de.projectionMatrix),we.projectionMatrixInverse.copy(we.projectionMatrix).invert(),we.viewport.set(ye.x,ye.y,ye.width,ye.height),ne===0&&(I.matrix.copy(we.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ne===!0&&I.cameras.push(we)}const j=s.enabledFeatures;if(j&&j.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=i.getBinding();const ne=h.getDepthInformation(ie[0]);ne&&ne.isValid&&ne.texture&&m.init(ne,s.renderState)}if(j&&j.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let ne=0;ne<ie.length;ne++){const de=ie[ne].camera;if(de){let ye=g[de];ye||(ye=new vh,g[de]=ye);const we=h.getCameraImage(de);ye.sourceTexture=we}}}}for(let ie=0;ie<S.length;ie++){const Ne=y[ie],j=S[ie];Ne!==null&&j!==void 0&&j.update(Ne,oe,l||a)}ze&&ze(Z,oe),oe.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:oe}),p=null}const He=new wh;He.setAnimationLoop(Je),this.setAnimationLoop=function(Z){ze=Z},this.dispose=function(){}}}const uT=new lt,Nh=new Ue;Nh.set(-1,0,0,0,1,0,0,0,1);function hT(t,e){function n(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,bh(t)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,A,w,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),h(m,g)):g.isMeshPhongMaterial?(r(m,g),u(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,v)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?c(m,g,A,w):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,n(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,n(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===qt&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,n(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===qt&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,n(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,n(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,n(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const A=e.get(g),w=A.envMap,v=A.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(uT.makeRotationFromEuler(v)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Nh),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,n(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,n(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,n(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,A,w){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*A,m.scale.value=w*.5,g.map&&(m.map.value=g.map,n(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,n(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function u(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function h(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,n(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,n(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,A){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,n(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,n(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,n(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,n(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,n(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===qt&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,n(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,n(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,n(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,n(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,n(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,n(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,n(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const A=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function fT(t,e,n,i){let s={},r={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,S){const y=S.program;i.uniformBlockBinding(v,y)}function l(v,S){let y=s[v.id];y===void 0&&(m(v),y=u(v),s[v.id]=y,v.addEventListener("dispose",A));const T=S.program;i.updateUBOMapping(v,T);const M=e.render.frame;r[v.id]!==M&&(d(v),r[v.id]=M)}function u(v){const S=h();v.__bindingPointIndex=S;const y=t.createBuffer(),T=v.__size,M=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,T,M),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,y),y}function h(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Ye("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const S=s[v.id],y=v.uniforms,T=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let M=0,b=y.length;M<b;M++){const P=y[M];if(Array.isArray(P))for(let C=0,I=P.length;C<I;C++)f(P[C],M,C,T);else f(P,M,0,T)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function f(v,S,y,T){if(_(v,S,y,T)===!0){const M=v.__offset,b=v.value;if(Array.isArray(b)){let P=0;for(let C=0;C<b.length;C++){const I=b[C],X=g(I);p(I,v.__data,P),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(P+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(b,v.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,M,v.__data)}}function p(v,S,y){typeof v=="number"||typeof v=="boolean"?S[0]=v:v.isMatrix3?(S[0]=v.elements[0],S[1]=v.elements[1],S[2]=v.elements[2],S[3]=0,S[4]=v.elements[3],S[5]=v.elements[4],S[6]=v.elements[5],S[7]=0,S[8]=v.elements[6],S[9]=v.elements[7],S[10]=v.elements[8],S[11]=0):ArrayBuffer.isView(v)?S.set(new v.constructor(v.buffer,v.byteOffset,S.length)):v.toArray(S,y)}function _(v,S,y,T){const M=v.value,b=S+"_"+y;if(T[b]===void 0)return typeof M=="number"||typeof M=="boolean"?T[b]=M:ArrayBuffer.isView(M)?T[b]=M.slice():T[b]=M.clone(),!0;{const P=T[b];if(typeof M=="number"||typeof M=="boolean"){if(P!==M)return T[b]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(P.equals(M)===!1)return P.copy(M),!0}}return!1}function m(v){const S=v.uniforms;let y=0;const T=16;for(let b=0,P=S.length;b<P;b++){const C=Array.isArray(S[b])?S[b]:[S[b]];for(let I=0,X=C.length;I<X;I++){const H=C[I],D=Array.isArray(H.value)?H.value:[H.value];for(let W=0,B=D.length;W<B;W++){const q=D[W],te=g(q),re=y%T,ce=re%te.boundary,ae=re+ce;y+=ce,ae!==0&&T-ae<te.storage&&(y+=T-ae),H.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=y,y+=te.storage}}}const M=y%T;return M>0&&(y+=T-M),v.__size=y,v.__cache={},this}function g(v){const S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",v),S}function A(v){const S=v.target;S.removeEventListener("dispose",A);const y=a.indexOf(S.__bindingPointIndex);a.splice(y,1),t.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function w(){for(const v in s)t.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:w}}const pT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Mn=null;function mT(){return Mn===null&&(Mn=new UM(pT,16,16,wi,Vn),Mn.name="DFG_LUT",Mn.minFilter=Ut,Mn.magFilter=Ut,Mn.wrapS=Un,Mn.wrapT=Un,Mn.generateMipmaps=!1,Mn.needsUpdate=!0),Mn}class gT{constructor(e={}){const{canvas:n=jv(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=en}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const _=f,m=new Set([Fc,Nc,Dc]),g=new Set([en,Rn,zs,Hs,Ic,Lc]),A=new Uint32Array(4),w=new Int32Array(4),v=new U;let S=null,y=null;const T=[],M=[];let b=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=An,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,I=null,X=null,H=null,D=null;this._outputColorSpace=jt;let W=0,B=0,q=null,te=-1,re=null;const ce=new dt,ae=new dt;let ze=null;const Je=new $e(0);let He=0,Z=n.width,oe=n.height,ie=1,Ne=null,j=null;const G=new dt(0,0,Z,oe),he=new dt(0,0,Z,oe);let ne=!1;const de=new zc;let ye=!1,we=!1;const Ke=new lt,ft=new U,Tt=new dt,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pt=!1;function Mt(){return q===null?ie:1}let N=i;function Ht(E,F){return n.getContext(E,F)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Cc}`),n.addEventListener("webglcontextlost",mt,!1),n.addEventListener("webglcontextrestored",rt,!1),n.addEventListener("webglcontextcreationerror",mn,!1),N===null){const F="webgl2";if(N=Ht(F,E),N===null)throw Ht(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(E){throw Ye("WebGLRenderer: "+E.message),E}let je,R,x,O,z,Y,se,ue,K,Q,fe,Re,ge,pe,Ie,De,Oe,L,le,J,me,Me,ee;function Te(){je=new mb(N),je.init(),me=new aT(N,je),R=new ob(N,je,e,me),x=new sT(N,je),R.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),X=N.createFramebuffer(),H=N.createFramebuffer(),D=N.createFramebuffer(),O=new xb(N),z=new $A,Y=new rT(N,je,x,z,R,me,O),se=new pb(P),ue=new Sy(N),Me=new rb(N,ue),K=new gb(N,ue,O,Me),Q=new Mb(N,K,ue,Me,O),L=new vb(N,R,Y),Ie=new cb(z),fe=new GA(P,se,je,R,Me,Ie),Re=new hT(P,z),ge=new XA,pe=new jA(je),Oe=new sb(P,se,x,Q,p,c),De=new iT(P,Q,R),ee=new fT(N,O,R,x),le=new ab(N,je,O),J=new _b(N,je,O),O.programs=fe.programs,P.capabilities=R,P.extensions=je,P.properties=z,P.renderLists=ge,P.shadowMap=De,P.state=x,P.info=O}Te(),_!==en&&(b=new Sb(_,n.width,n.height,o,s,r));const be=new dT(P,N);this.xr=be,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const E=je.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=je.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(E){E!==void 0&&(ie=E,this.setSize(Z,oe,!1))},this.getSize=function(E){return E.set(Z,oe)},this.setSize=function(E,F,$=!0){if(be.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=E,oe=F,n.width=Math.floor(E*ie),n.height=Math.floor(F*ie),$===!0&&(n.style.width=E+"px",n.style.height=F+"px"),b!==null&&b.setSize(n.width,n.height),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(Z*ie,oe*ie).floor()},this.setDrawingBufferSize=function(E,F,$){Z=E,oe=F,ie=$,n.width=Math.floor(E*$),n.height=Math.floor(F*$),this.setViewport(0,0,E,F)},this.setEffects=function(E){if(_===en){Ye("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let F=0;F<E.length;F++)if(E[F].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(ce)},this.getViewport=function(E){return E.copy(G)},this.setViewport=function(E,F,$,k){E.isVector4?G.set(E.x,E.y,E.z,E.w):G.set(E,F,$,k),x.viewport(ce.copy(G).multiplyScalar(ie).round())},this.getScissor=function(E){return E.copy(he)},this.setScissor=function(E,F,$,k){E.isVector4?he.set(E.x,E.y,E.z,E.w):he.set(E,F,$,k),x.scissor(ae.copy(he).multiplyScalar(ie).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(E){x.setScissorTest(ne=E)},this.setOpaqueSort=function(E){Ne=E},this.setTransparentSort=function(E){j=E},this.getClearColor=function(E){return E.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(E=!0,F=!0,$=!0){let k=0;if(E){let V=!1;if(q!==null){const ve=q.texture.format;V=m.has(ve)}if(V){const ve=q.texture.type,Ee=g.has(ve),xe=Oe.getClearColor(),Ae=Oe.getClearAlpha(),Ce=xe.r,ke=xe.g,Ve=xe.b;Ee?(A[0]=Ce,A[1]=ke,A[2]=Ve,A[3]=Ae,N.clearBufferuiv(N.COLOR,0,A)):(w[0]=Ce,w[1]=ke,w[2]=Ve,w[3]=Ae,N.clearBufferiv(N.COLOR,0,w))}else k|=N.COLOR_BUFFER_BIT}F&&(k|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(k|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&N.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),I=E},this.dispose=function(){n.removeEventListener("webglcontextlost",mt,!1),n.removeEventListener("webglcontextrestored",rt,!1),n.removeEventListener("webglcontextcreationerror",mn,!1),Oe.dispose(),ge.dispose(),pe.dispose(),z.dispose(),se.dispose(),Q.dispose(),Me.dispose(),ee.dispose(),fe.dispose(),be.dispose(),be.removeEventListener("sessionstart",Jc),be.removeEventListener("sessionend",jc),li.stop()};function mt(E){E.preventDefault(),td("WebGLRenderer: Context Lost."),C=!0}function rt(){td("WebGLRenderer: Context Restored."),C=!1;const E=O.autoReset,F=De.enabled,$=De.autoUpdate,k=De.needsUpdate,V=De.type;Te(),O.autoReset=E,De.enabled=F,De.autoUpdate=$,De.needsUpdate=k,De.type=V}function mn(E){Ye("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function gn(E){const F=E.target;F.removeEventListener("dispose",gn),kh(F)}function kh(E){Bh(E),z.remove(E)}function Bh(E){const F=z.get(E).programs;F!==void 0&&(F.forEach(function($){fe.releaseProgram($)}),E.isShaderMaterial&&fe.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,$,k,V,ve){F===null&&(F=Pt);const Ee=V.isMesh&&V.matrixWorld.determinantAffine()<0,xe=Hh(E,F,$,k,V);x.setMaterial(k,Ee);let Ae=$.index,Ce=1;if(k.wireframe===!0){if(Ae=K.getWireframeAttribute($),Ae===void 0)return;Ce=2}const ke=$.drawRange,Ve=$.attributes.position;let Pe=ke.start*Ce,tt=(ke.start+ke.count)*Ce;ve!==null&&(Pe=Math.max(Pe,ve.start*Ce),tt=Math.min(tt,(ve.start+ve.count)*Ce)),Ae!==null?(Pe=Math.max(Pe,0),tt=Math.min(tt,Ae.count)):Ve!=null&&(Pe=Math.max(Pe,0),tt=Math.min(tt,Ve.count));const _t=tt-Pe;if(_t<0||_t===1/0)return;Me.setup(V,k,xe,$,Ae);let gt,it=le;if(Ae!==null&&(gt=ue.get(Ae),it=J,it.setIndex(gt)),V.isMesh)k.wireframe===!0?(x.setLineWidth(k.wireframeLinewidth*Mt()),it.setMode(N.LINES)):it.setMode(N.TRIANGLES);else if(V.isLine){let Lt=k.linewidth;Lt===void 0&&(Lt=1),x.setLineWidth(Lt*Mt()),V.isLineSegments?it.setMode(N.LINES):V.isLineLoop?it.setMode(N.LINE_LOOP):it.setMode(N.LINE_STRIP)}else V.isPoints?it.setMode(N.POINTS):V.isSprite&&it.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(je.get("WEBGL_multi_draw"))it.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Lt=V._multiDrawStarts,Se=V._multiDrawCounts,Yt=V._multiDrawCount,qe=Ae?ue.get(Ae).bytesPerElement:1,nn=z.get(k).currentProgram.getUniforms();for(let _n=0;_n<Yt;_n++)nn.setValue(N,"_gl_DrawID",_n),it.render(Lt[_n]/qe,Se[_n])}else if(V.isInstancedMesh)it.renderInstances(Pe,_t,V.count);else if($.isInstancedBufferGeometry){const Lt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Se=Math.min($.instanceCount,Lt);it.renderInstances(Pe,_t,Se)}else it.render(Pe,_t)};function Zc(E,F,$){E.transparent===!0&&E.side===Sn&&E.forceSinglePass===!1?(E.side=qt,E.needsUpdate=!0,js(E,F,$),E.side=ri,E.needsUpdate=!0,js(E,F,$),E.side=Sn):js(E,F,$)}this.compile=function(E,F,$=null){$===null&&($=E),y=pe.get($),y.init(F),M.push(y),$.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(y.pushLight(V),V.castShadow&&y.pushShadow(V))}),E!==$&&E.traverseVisible(function(V){V.isLight&&V.layers.test(F.layers)&&(y.pushLight(V),V.castShadow&&y.pushShadow(V))}),y.setupLights();const k=new Set;return E.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ve=V.material;if(ve)if(Array.isArray(ve))for(let Ee=0;Ee<ve.length;Ee++){const xe=ve[Ee];Zc(xe,$,V),k.add(xe)}else Zc(ve,$,V),k.add(ve)}),y=M.pop(),k},this.compileAsync=function(E,F,$=null){const k=this.compile(E,F,$);return new Promise(V=>{function ve(){if(k.forEach(function(Ee){z.get(Ee).currentProgram.isReady()&&k.delete(Ee)}),k.size===0){V(E);return}setTimeout(ve,10)}je.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let ya=null;function Vh(E){ya&&ya(E)}function Jc(){li.stop()}function jc(){li.start()}const li=new wh;li.setAnimationLoop(Vh),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(E){ya=E,be.setAnimationLoop(E),E===null?li.stop():li.start()},be.addEventListener("sessionstart",Jc),be.addEventListener("sessionend",jc),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){Ye("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(E,F);const $=be.enabled===!0&&be.isPresenting===!0,k=b!==null&&(q===null||$)&&b.begin(P,q);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),be.enabled===!0&&be.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(be.cameraAutoUpdate===!0&&be.updateCamera(F),F=be.getCamera()),E.isScene===!0&&E.onBeforeRender(P,E,F,q),y=pe.get(E,M.length),y.init(F),y.state.textureUnits=Y.getTextureUnits(),M.push(y),Ke.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),de.setFromProjectionMatrix(Ke,bn,F.reversedDepth),we=this.localClippingEnabled,ye=Ie.init(this.clippingPlanes,we),S=ge.get(E,T.length),S.init(),T.push(S),be.enabled===!0&&be.isPresenting===!0){const Ee=P.xr.getDepthSensingMesh();Ee!==null&&Sa(Ee,F,-1/0,P.sortObjects)}Sa(E,F,0,P.sortObjects),S.finish(),P.sortObjects===!0&&S.sort(Ne,j,F.reversedDepth),pt=be.enabled===!1||be.isPresenting===!1||be.hasDepthSensing()===!1,pt&&Oe.addToRenderList(S,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ye===!0&&Ie.beginShadows();const V=y.state.shadowsArray;if(De.render(V,E,F),ye===!0&&Ie.endShadows(),(k&&b.hasRenderPass())===!1){const Ee=S.opaque,xe=S.transmissive;if(y.setupLights(),F.isArrayCamera){const Ae=F.cameras;if(xe.length>0)for(let Ce=0,ke=Ae.length;Ce<ke;Ce++){const Ve=Ae[Ce];el(Ee,xe,E,Ve)}pt&&Oe.render(E);for(let Ce=0,ke=Ae.length;Ce<ke;Ce++){const Ve=Ae[Ce];Qc(S,E,Ve,Ve.viewport)}}else xe.length>0&&el(Ee,xe,E,F),pt&&Oe.render(E),Qc(S,E,F)}q!==null&&B===0&&(Y.updateMultisampleRenderTarget(q),Y.updateRenderTargetMipmap(q)),k&&b.end(P),E.isScene===!0&&E.onAfterRender(P,E,F),Me.resetDefaultState(),te=-1,re=null,M.pop(),M.length>0?(y=M[M.length-1],Y.setTextureUnits(y.state.textureUnits),ye===!0&&Ie.setGlobalState(P.clippingPlanes,y.state.camera)):y=null,T.pop(),T.length>0?S=T[T.length-1]:S=null,I!==null&&I.renderEnd()};function Sa(E,F,$,k){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)$=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLightProbeGrid)y.pushLightProbeGrid(E);else if(E.isLight)y.pushLight(E),E.castShadow&&y.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||de.intersectsSprite(E)){k&&Tt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ke);const Ee=Q.update(E),xe=E.material;xe.visible&&S.push(E,Ee,xe,$,Tt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||de.intersectsObject(E))){const Ee=Q.update(E),xe=E.material;if(k&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Tt.copy(E.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),Tt.copy(Ee.boundingSphere.center)),Tt.applyMatrix4(E.matrixWorld).applyMatrix4(Ke)),Array.isArray(xe)){const Ae=Ee.groups;for(let Ce=0,ke=Ae.length;Ce<ke;Ce++){const Ve=Ae[Ce],Pe=xe[Ve.materialIndex];Pe&&Pe.visible&&S.push(E,Ee,Pe,$,Tt.z,Ve)}}else xe.visible&&S.push(E,Ee,xe,$,Tt.z,null)}}const ve=E.children;for(let Ee=0,xe=ve.length;Ee<xe;Ee++)Sa(ve[Ee],F,$,k)}function Qc(E,F,$,k){const{opaque:V,transmissive:ve,transparent:Ee}=E;y.setupLightsView($),ye===!0&&Ie.setGlobalState(P.clippingPlanes,$),k&&x.viewport(ce.copy(k)),V.length>0&&Js(V,F,$),ve.length>0&&Js(ve,F,$),Ee.length>0&&Js(Ee,F,$),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function el(E,F,$,k){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[k.id]===void 0){const Pe=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[k.id]=new Tn(1,1,{generateMipmaps:!0,type:Pe?Vn:en,minFilter:vi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:We.workingColorSpace})}const ve=y.state.transmissionRenderTarget[k.id],Ee=k.viewport||ce;ve.setSize(Ee.z*P.transmissionResolutionScale,Ee.w*P.transmissionResolutionScale);const xe=P.getRenderTarget(),Ae=P.getActiveCubeFace(),Ce=P.getActiveMipmapLevel();P.setRenderTarget(ve),P.getClearColor(Je),He=P.getClearAlpha(),He<1&&P.setClearColor(16777215,.5),P.clear(),pt&&Oe.render($);const ke=P.toneMapping;P.toneMapping=An;const Ve=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),y.setupLightsView(k),ye===!0&&Ie.setGlobalState(P.clippingPlanes,k),Js(E,$,k),Y.updateMultisampleRenderTarget(ve),Y.updateRenderTargetMipmap(ve),je.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let tt=0,_t=F.length;tt<_t;tt++){const gt=F[tt],{object:it,geometry:Lt,material:Se,group:Yt}=gt;if(Se.side===Sn&&it.layers.test(k.layers)){const qe=Se.side;Se.side=qt,Se.needsUpdate=!0,tl(it,$,k,Lt,Se,Yt),Se.side=qe,Se.needsUpdate=!0,Pe=!0}}Pe===!0&&(Y.updateMultisampleRenderTarget(ve),Y.updateRenderTargetMipmap(ve))}P.setRenderTarget(xe,Ae,Ce),P.setClearColor(Je,He),Ve!==void 0&&(k.viewport=Ve),P.toneMapping=ke}function Js(E,F,$){const k=F.isScene===!0?F.overrideMaterial:null;for(let V=0,ve=E.length;V<ve;V++){const Ee=E[V],{object:xe,geometry:Ae,group:Ce}=Ee;let ke=Ee.material;ke.allowOverride===!0&&k!==null&&(ke=k),xe.layers.test($.layers)&&tl(xe,F,$,Ae,ke,Ce)}}function tl(E,F,$,k,V,ve){E.onBeforeRender(P,F,$,k,V,ve),E.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),V.onBeforeRender(P,F,$,k,E,ve),V.transparent===!0&&V.side===Sn&&V.forceSinglePass===!1?(V.side=qt,V.needsUpdate=!0,P.renderBufferDirect($,F,k,V,E,ve),V.side=ri,V.needsUpdate=!0,P.renderBufferDirect($,F,k,V,E,ve),V.side=Sn):P.renderBufferDirect($,F,k,V,E,ve),E.onAfterRender(P,F,$,k,V,ve)}function js(E,F,$){F.isScene!==!0&&(F=Pt);const k=z.get(E),V=y.state.lights,ve=y.state.shadowsArray,Ee=V.state.version,xe=fe.getParameters(E,V.state,ve,F,$,y.state.lightProbeGridArray),Ae=fe.getProgramCacheKey(xe);let Ce=k.programs;k.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?F.environment:null,k.fog=F.fog;const ke=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;k.envMap=se.get(E.envMap||k.environment,ke),k.envMapRotation=k.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,Ce===void 0&&(E.addEventListener("dispose",gn),Ce=new Map,k.programs=Ce);let Ve=Ce.get(Ae);if(Ve!==void 0){if(k.currentProgram===Ve&&k.lightsStateVersion===Ee)return il(E,xe),Ve}else xe.uniforms=fe.getUniforms(E),I!==null&&E.isNodeMaterial&&I.build(E,$,xe),E.onBeforeCompile(xe,P),Ve=fe.acquireProgram(xe,Ae),Ce.set(Ae,Ve),k.uniforms=xe.uniforms;const Pe=k.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Pe.clippingPlanes=Ie.uniform),il(E,xe),k.needsLights=$h(E),k.lightsStateVersion=Ee,k.needsLights&&(Pe.ambientLightColor.value=V.state.ambient,Pe.lightProbe.value=V.state.probe,Pe.directionalLights.value=V.state.directional,Pe.directionalLightShadows.value=V.state.directionalShadow,Pe.spotLights.value=V.state.spot,Pe.spotLightShadows.value=V.state.spotShadow,Pe.rectAreaLights.value=V.state.rectArea,Pe.ltc_1.value=V.state.rectAreaLTC1,Pe.ltc_2.value=V.state.rectAreaLTC2,Pe.pointLights.value=V.state.point,Pe.pointLightShadows.value=V.state.pointShadow,Pe.hemisphereLights.value=V.state.hemi,Pe.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Pe.spotLightMatrix.value=V.state.spotLightMatrix,Pe.spotLightMap.value=V.state.spotLightMap,Pe.pointShadowMatrix.value=V.state.pointShadowMatrix),k.lightProbeGrid=y.state.lightProbeGridArray.length>0,k.currentProgram=Ve,k.uniformsList=null,Ve}function nl(E){if(E.uniformsList===null){const F=E.currentProgram.getUniforms();E.uniformsList=Xr.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function il(E,F){const $=z.get(E);$.outputColorSpace=F.outputColorSpace,$.batching=F.batching,$.batchingColor=F.batchingColor,$.instancing=F.instancing,$.instancingColor=F.instancingColor,$.instancingMorph=F.instancingMorph,$.skinning=F.skinning,$.morphTargets=F.morphTargets,$.morphNormals=F.morphNormals,$.morphColors=F.morphColors,$.morphTargetsCount=F.morphTargetsCount,$.numClippingPlanes=F.numClippingPlanes,$.numIntersection=F.numClipIntersection,$.vertexAlphas=F.vertexAlphas,$.vertexTangents=F.vertexTangents,$.toneMapping=F.toneMapping}function zh(E,F){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;v.setFromMatrixPosition(F.matrixWorld);for(let $=0,k=E.length;$<k;$++){const V=E[$];if(V.texture!==null&&V.boundingBox.containsPoint(v))return V}return null}function Hh(E,F,$,k,V){F.isScene!==!0&&(F=Pt),Y.resetTextureUnits();const ve=F.fog,Ee=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?F.environment:null,xe=q===null?P.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:We.workingColorSpace,Ae=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Ce=se.get(k.envMap||Ee,Ae),ke=k.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Ve=!!$.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Pe=!!$.morphAttributes.position,tt=!!$.morphAttributes.normal,_t=!!$.morphAttributes.color;let gt=An;k.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(gt=P.toneMapping);const it=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Lt=it!==void 0?it.length:0,Se=z.get(k),Yt=y.state.lights;if(ye===!0&&(we===!0||E!==re)){const at=E===re&&k.id===te;Ie.setState(k,E,at)}let qe=!1;k.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Yt.state.version||Se.outputColorSpace!==xe||V.isBatchedMesh&&Se.batching===!1||!V.isBatchedMesh&&Se.batching===!0||V.isBatchedMesh&&Se.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Se.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Se.instancing===!1||!V.isInstancedMesh&&Se.instancing===!0||V.isSkinnedMesh&&Se.skinning===!1||!V.isSkinnedMesh&&Se.skinning===!0||V.isInstancedMesh&&Se.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Se.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Se.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Se.instancingMorph===!1&&V.morphTexture!==null||Se.envMap!==Ce||k.fog===!0&&Se.fog!==ve||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==Ie.numPlanes||Se.numIntersection!==Ie.numIntersection)||Se.vertexAlphas!==ke||Se.vertexTangents!==Ve||Se.morphTargets!==Pe||Se.morphNormals!==tt||Se.morphColors!==_t||Se.toneMapping!==gt||Se.morphTargetsCount!==Lt||!!Se.lightProbeGrid!=y.state.lightProbeGridArray.length>0)&&(qe=!0):(qe=!0,Se.__version=k.version);let nn=Se.currentProgram;qe===!0&&(nn=js(k,F,V),I&&k.isNodeMaterial&&I.onUpdateProgram(k,nn,Se));let _n=!1,Hn=!1,Li=!1;const st=nn.getUniforms(),xt=Se.uniforms;if(x.useProgram(nn.program)&&(_n=!0,Hn=!0,Li=!0),k.id!==te&&(te=k.id,Hn=!0),Se.needsLights){const at=zh(y.state.lightProbeGridArray,V);Se.lightProbeGrid!==at&&(Se.lightProbeGrid=at,Hn=!0)}if(_n||re!==E){x.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),st.setValue(N,"projectionMatrix",E.projectionMatrix),st.setValue(N,"viewMatrix",E.matrixWorldInverse);const $n=st.map.cameraPosition;$n!==void 0&&$n.setValue(N,ft.setFromMatrixPosition(E.matrixWorld)),R.logarithmicDepthBuffer&&st.setValue(N,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&st.setValue(N,"isOrthographic",E.isOrthographicCamera===!0),re!==E&&(re=E,Hn=!0,Li=!0)}if(Se.needsLights&&(Yt.state.directionalShadowMap.length>0&&st.setValue(N,"directionalShadowMap",Yt.state.directionalShadowMap,Y),Yt.state.spotShadowMap.length>0&&st.setValue(N,"spotShadowMap",Yt.state.spotShadowMap,Y),Yt.state.pointShadowMap.length>0&&st.setValue(N,"pointShadowMap",Yt.state.pointShadowMap,Y)),V.isSkinnedMesh){st.setOptional(N,V,"bindMatrix"),st.setOptional(N,V,"bindMatrixInverse");const at=V.skeleton;at&&(at.boneTexture===null&&at.computeBoneTexture(),st.setValue(N,"boneTexture",at.boneTexture,Y))}V.isBatchedMesh&&(st.setOptional(N,V,"batchingTexture"),st.setValue(N,"batchingTexture",V._matricesTexture,Y),st.setOptional(N,V,"batchingIdTexture"),st.setValue(N,"batchingIdTexture",V._indirectTexture,Y),st.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&st.setValue(N,"batchingColorTexture",V._colorsTexture,Y));const Gn=$.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&L.update(V,$,nn),(Hn||Se.receiveShadow!==V.receiveShadow)&&(Se.receiveShadow=V.receiveShadow,st.setValue(N,"receiveShadow",V.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&F.environment!==null&&(xt.envMapIntensity.value=F.environmentIntensity),xt.dfgLUT!==void 0&&(xt.dfgLUT.value=mT()),Hn){if(st.setValue(N,"toneMappingExposure",P.toneMappingExposure),Se.needsLights&&Gh(xt,Li),ve&&k.fog===!0&&Re.refreshFogUniforms(xt,ve),Re.refreshMaterialUniforms(xt,k,ie,oe,y.state.transmissionRenderTarget[E.id]),Se.needsLights&&Se.lightProbeGrid){const at=Se.lightProbeGrid;xt.probesSH.value=at.texture,xt.probesMin.value.copy(at.boundingBox.min),xt.probesMax.value.copy(at.boundingBox.max),xt.probesResolution.value.copy(at.resolution)}Xr.upload(N,nl(Se),xt,Y)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Xr.upload(N,nl(Se),xt,Y),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&st.setValue(N,"center",V.center),st.setValue(N,"modelViewMatrix",V.modelViewMatrix),st.setValue(N,"normalMatrix",V.normalMatrix),st.setValue(N,"modelMatrix",V.matrixWorld),k.uniformsGroups!==void 0){const at=k.uniformsGroups;for(let $n=0,Di=at.length;$n<Di;$n++){const sl=at[$n];ee.update(sl,nn),ee.bind(sl,nn)}}return nn}function Gh(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function $h(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(E,F,$){const k=z.get(E);k.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),z.get(E.texture).__webglTexture=F,z.get(E.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:$,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,F){const $=z.get(E);$.__webglFramebuffer=F,$.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,$=0){q=E,W=F,B=$;let k=null,V=!1,ve=!1;if(E){const xe=z.get(E);if(xe.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(N.FRAMEBUFFER,xe.__webglFramebuffer),ce.copy(E.viewport),ae.copy(E.scissor),ze=E.scissorTest,x.viewport(ce),x.scissor(ae),x.setScissorTest(ze),te=-1;return}else if(xe.__webglFramebuffer===void 0)Y.setupRenderTarget(E);else if(xe.__hasExternalTextures)Y.rebindTextures(E,z.get(E.texture).__webglTexture,z.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const ke=E.depthTexture;if(xe.__boundDepthTexture!==ke){if(ke!==null&&z.has(ke)&&(E.width!==ke.image.width||E.height!==ke.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Y.setupDepthRenderbuffer(E)}}const Ae=E.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(ve=!0);const Ce=z.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ce[F])?k=Ce[F][$]:k=Ce[F],V=!0):E.samples>0&&Y.useMultisampledRTT(E)===!1?k=z.get(E).__webglMultisampledFramebuffer:Array.isArray(Ce)?k=Ce[$]:k=Ce,ce.copy(E.viewport),ae.copy(E.scissor),ze=E.scissorTest}else ce.copy(G).multiplyScalar(ie).floor(),ae.copy(he).multiplyScalar(ie).floor(),ze=ne;if($!==0&&(k=X),x.bindFramebuffer(N.FRAMEBUFFER,k)&&x.drawBuffers(E,k),x.viewport(ce),x.scissor(ae),x.setScissorTest(ze),V){const xe=z.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+F,xe.__webglTexture,$)}else if(ve){const xe=F;for(let Ae=0;Ae<E.textures.length;Ae++){const Ce=z.get(E.textures[Ae]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ae,Ce.__webglTexture,$,xe)}}else if(E!==null&&$!==0){const xe=z.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xe.__webglTexture,$)}te=-1},this.readRenderTargetPixels=function(E,F,$,k,V,ve,Ee,xe=0){if(!(E&&E.isWebGLRenderTarget)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=z.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ae=Ae[Ee]),Ae){x.bindFramebuffer(N.FRAMEBUFFER,Ae);try{const Ce=E.textures[xe],ke=Ce.format,Ve=Ce.type;if(E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+xe),!R.textureFormatReadable(ke)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Ve)){Ye("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-k&&$>=0&&$<=E.height-V&&N.readPixels(F,$,k,V,me.convert(ke),me.convert(Ve),ve)}finally{const Ce=q!==null?z.get(q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(E,F,$,k,V,ve,Ee,xe=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=z.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ae=Ae[Ee]),Ae)if(F>=0&&F<=E.width-k&&$>=0&&$<=E.height-V){x.bindFramebuffer(N.FRAMEBUFFER,Ae);const Ce=E.textures[xe],ke=Ce.format,Ve=Ce.type;if(E.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+xe),!R.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Pe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Pe),N.bufferData(N.PIXEL_PACK_BUFFER,ve.byteLength,N.STREAM_READ),N.readPixels(F,$,k,V,me.convert(ke),me.convert(Ve),0);const tt=q!==null?z.get(q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,tt);const _t=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Qv(N,_t,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Pe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ve),N.deleteBuffer(Pe),N.deleteSync(_t),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,F=null,$=0){const k=Math.pow(2,-$),V=Math.floor(E.image.width*k),ve=Math.floor(E.image.height*k),Ee=F!==null?F.x:0,xe=F!==null?F.y:0;Y.setTexture2D(E,0),N.copyTexSubImage2D(N.TEXTURE_2D,$,0,0,Ee,xe,V,ve),x.unbindTexture()},this.copyTextureToTexture=function(E,F,$=null,k=null,V=0,ve=0){let Ee,xe,Ae,Ce,ke,Ve,Pe,tt,_t;const gt=E.isCompressedTexture?E.mipmaps[ve]:E.image;if($!==null)Ee=$.max.x-$.min.x,xe=$.max.y-$.min.y,Ae=$.isBox3?$.max.z-$.min.z:1,Ce=$.min.x,ke=$.min.y,Ve=$.isBox3?$.min.z:0;else{const xt=Math.pow(2,-V);Ee=Math.floor(gt.width*xt),xe=Math.floor(gt.height*xt),E.isDataArrayTexture?Ae=gt.depth:E.isData3DTexture?Ae=Math.floor(gt.depth*xt):Ae=1,Ce=0,ke=0,Ve=0}k!==null?(Pe=k.x,tt=k.y,_t=k.z):(Pe=0,tt=0,_t=0);const it=me.convert(F.format),Lt=me.convert(F.type);let Se;F.isData3DTexture?(Y.setTexture3D(F,0),Se=N.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(Y.setTexture2DArray(F,0),Se=N.TEXTURE_2D_ARRAY):(Y.setTexture2D(F,0),Se=N.TEXTURE_2D),x.activeTexture(N.TEXTURE0),x.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,F.flipY),x.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),x.pixelStorei(N.UNPACK_ALIGNMENT,F.unpackAlignment);const Yt=x.getParameter(N.UNPACK_ROW_LENGTH),qe=x.getParameter(N.UNPACK_IMAGE_HEIGHT),nn=x.getParameter(N.UNPACK_SKIP_PIXELS),_n=x.getParameter(N.UNPACK_SKIP_ROWS),Hn=x.getParameter(N.UNPACK_SKIP_IMAGES);x.pixelStorei(N.UNPACK_ROW_LENGTH,gt.width),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,gt.height),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Ce),x.pixelStorei(N.UNPACK_SKIP_ROWS,ke),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Ve);const Li=E.isDataArrayTexture||E.isData3DTexture,st=F.isDataArrayTexture||F.isData3DTexture;if(E.isDepthTexture){const xt=z.get(E),Gn=z.get(F),at=z.get(xt.__renderTarget),$n=z.get(Gn.__renderTarget);x.bindFramebuffer(N.READ_FRAMEBUFFER,at.__webglFramebuffer),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,$n.__webglFramebuffer);for(let Di=0;Di<Ae;Di++)Li&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(E).__webglTexture,V,Ve+Di),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(F).__webglTexture,ve,_t+Di)),N.blitFramebuffer(Ce,ke,Ee,xe,Pe,tt,Ee,xe,N.DEPTH_BUFFER_BIT,N.NEAREST);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||E.isRenderTargetTexture||z.has(E)){const xt=z.get(E),Gn=z.get(F);x.bindFramebuffer(N.READ_FRAMEBUFFER,H),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,D);for(let at=0;at<Ae;at++)Li?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,xt.__webglTexture,V,Ve+at):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,xt.__webglTexture,V),st?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Gn.__webglTexture,ve,_t+at):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Gn.__webglTexture,ve),V!==0?N.blitFramebuffer(Ce,ke,Ee,xe,Pe,tt,Ee,xe,N.COLOR_BUFFER_BIT,N.NEAREST):st?N.copyTexSubImage3D(Se,ve,Pe,tt,_t+at,Ce,ke,Ee,xe):N.copyTexSubImage2D(Se,ve,Pe,tt,Ce,ke,Ee,xe);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else st?E.isDataTexture||E.isData3DTexture?N.texSubImage3D(Se,ve,Pe,tt,_t,Ee,xe,Ae,it,Lt,gt.data):F.isCompressedArrayTexture?N.compressedTexSubImage3D(Se,ve,Pe,tt,_t,Ee,xe,Ae,it,gt.data):N.texSubImage3D(Se,ve,Pe,tt,_t,Ee,xe,Ae,it,Lt,gt):E.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ve,Pe,tt,Ee,xe,it,Lt,gt.data):E.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ve,Pe,tt,gt.width,gt.height,it,gt.data):N.texSubImage2D(N.TEXTURE_2D,ve,Pe,tt,Ee,xe,it,Lt,gt);x.pixelStorei(N.UNPACK_ROW_LENGTH,Yt),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,qe),x.pixelStorei(N.UNPACK_SKIP_PIXELS,nn),x.pixelStorei(N.UNPACK_SKIP_ROWS,_n),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Hn),ve===0&&F.generateMipmaps&&N.generateMipmap(Se),x.unbindTexture()},this.initRenderTarget=function(E){z.get(E).__webglFramebuffer===void 0&&Y.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Y.setTextureCube(E,0):E.isData3DTexture?Y.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Y.setTexture2DArray(E,0):Y.setTexture2D(E,0),x.unbindTexture()},this.resetState=function(){W=0,B=0,q=null,x.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=We._getDrawingBufferColorSpace(e),n.unpackColorSpace=We._getUnpackColorSpace()}}const ru={type:"change"},$c={type:"start"},Fh={type:"end"},Ur=new ga,au=new Qn,_T=Math.cos(70*dh.DEG2RAD),Et=new U,Gt=2*Math.PI,nt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},oo=1e-6;class xT extends My{constructor(e,n=null){super(e,n),this.state=nt.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ns.ROTATE,MIDDLE:ns.DOLLY,RIGHT:ns.PAN},this.touches={ONE:Qi.ROTATE,TWO:Qi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new ai,this._lastTargetPosition=new U,this._quat=new ai().setFromUnitVectors(e.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Dd,this._sphericalDelta=new Dd,this._scale=1,this._panOffset=new U,this._rotateStart=new Fe,this._rotateEnd=new Fe,this._rotateDelta=new Fe,this._panStart=new Fe,this._panEnd=new Fe,this._panDelta=new Fe,this._dollyStart=new Fe,this._dollyEnd=new Fe,this._dollyDelta=new Fe,this._dollyDirection=new U,this._mouse=new Fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=MT.bind(this),this._onPointerDown=vT.bind(this),this._onPointerUp=yT.bind(this),this._onContextMenu=RT.bind(this),this._onMouseWheel=bT.bind(this),this._onKeyDown=AT.bind(this),this._onTouchStart=TT.bind(this),this._onTouchMove=wT.bind(this),this._onMouseDown=ST.bind(this),this._onMouseMove=ET.bind(this),this._interceptControlDown=CT.bind(this),this._interceptControlUp=PT.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ru),this.update(),this.state=nt.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;Et.copy(n).sub(this.target),Et.applyQuaternion(this._quat),this._spherical.setFromVector3(Et),this.autoRotate&&this.state===nt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Gt:i>Math.PI&&(i-=Gt),s<-Math.PI?s+=Gt:s>Math.PI&&(s-=Gt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Et.setFromSpherical(this._spherical),Et.applyQuaternion(this._quatInverse),n.copy(this.target).add(Et),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Et.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new U(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new U(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Et.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ur.origin.copy(this.object.position),Ur.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ur.direction))<_T?this.object.lookAt(this.target):(au.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ur.intersectPlane(au,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>oo||8*(1-this._lastQuaternion.dot(this.object.quaternion))>oo||this._lastTargetPosition.distanceToSquared(this.target)>oo?(this.dispatchEvent(ru),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Gt/60*this.autoRotateSpeed*e:Gt/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Et.setFromMatrixColumn(n,0),Et.multiplyScalar(-e),this._panOffset.add(Et)}_panUp(e,n){this.screenSpacePanning===!0?Et.setFromMatrixColumn(n,1):(Et.setFromMatrixColumn(n,0),Et.crossVectors(this.object.up,Et)),Et.multiplyScalar(e),this._panOffset.add(Et)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Et.copy(s).sub(this.target);let r=Et.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=n-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/n.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/n.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Fe,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function vT(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function MT(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function yT(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Fh),this.state=nt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function ST(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ns.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=nt.DOLLY;break;case ns.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=nt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=nt.ROTATE}break;case ns.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=nt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=nt.PAN}break;default:this.state=nt.NONE}this.state!==nt.NONE&&this.dispatchEvent($c)}function ET(t){switch(this.state){case nt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case nt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case nt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function bT(t){this.enabled===!1||this.enableZoom===!1||this.state!==nt.NONE||(t.preventDefault(),this.dispatchEvent($c),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(Fh))}function AT(t){this.enabled!==!1&&this._handleKeyDown(t)}function TT(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Qi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=nt.TOUCH_ROTATE;break;case Qi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=nt.TOUCH_PAN;break;default:this.state=nt.NONE}break;case 2:switch(this.touches.TWO){case Qi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=nt.TOUCH_DOLLY_PAN;break;case Qi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=nt.TOUCH_DOLLY_ROTATE;break;default:this.state=nt.NONE}break;default:this.state=nt.NONE}this.state!==nt.NONE&&this.dispatchEvent($c)}function wT(t){switch(this._trackPointer(t),this.state){case nt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case nt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case nt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case nt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=nt.NONE}}function RT(t){this.enabled!==!1&&t.preventDefault()}function CT(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function PT(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const IT=Object.freeze({invalid:12986408,unsupported:14067456}),LT={boundary:1842204,cut:0,hingeMountain:2894892,hingeValley:4473924,hingeUnassigned:3158064,flatSeam:6052956,link:2368548,sectorRay:1118481};function DT(t,e){const n=new Ds;n.name="engine-lab-frame";const i=new Map;for(const s of t.faces){UT(s.id,s.vertices);const r=lo(s.sourceEntities??[],e),a=new zt;a.setAttribute("position",new Vt(s.vertices.flat(),3));const o=NT(s.vertices);a.setIndex(o),a.computeVertexNormals();const c=new uy({color:uo(r)??14211288,metalness:0,roughness:.82,opacity:.72,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,side:Sn}),l=new pn(a,c);l.renderOrder=0,co(l,s.id,"face",s.sourceEntities??[],r,i,n),s.sourceOperationId!==void 0&&(l.userData.sourceOperationId=s.sourceOperationId)}for(const s of t.segments){qr(s.id,s.start),qr(s.id,s.end);const r=lo(s.sourceEntities??[],e),a=new zt().setFromPoints([new U(...s.start),new U(...s.end)]),o=FT(s.role,uo(r)??LT[s.role]),c=new dc(a,o);c.renderOrder=1,o instanceof Wr&&c.computeLineDistances(),co(c,s.id,s.role,s.sourceEntities??[],r,i,n)}for(const s of t.points){qr(s.id,s.position);const r=lo(s.sourceEntities??[],e),a=new zt;a.setAttribute("position",new Vt(s.position,3));const o=new _h({color:uo(r)??(s.role==="junction"?0:s.role==="anchor"?2236962:3355443),size:.055,sizeAttenuation:!0}),c=new Sd(a,o);c.renderOrder=2,co(c,s.id,s.role,s.sourceEntities??[],r,i,n)}return{group:n,objectByPrimitiveId:i,dispose(){for(const s of i.values())if(s instanceof pn||s instanceof dc||s instanceof Sd){s.geometry.dispose();const r=Array.isArray(s.material)?s.material:[s.material];for(const a of r)a.dispose()}n.clear(),i.clear()}}}function NT(t){const e=t.reduce((s,r,a)=>{const o=t[(a+1)%t.length];return[s[0]+(r[1]-o[1])*(r[2]+o[2]),s[1]+(r[2]-o[2])*(r[0]+o[0]),s[2]+(r[0]-o[0])*(r[1]+o[1])]},[0,0,0]),n=Math.abs(e[0])>=Math.abs(e[1])&&Math.abs(e[0])>=Math.abs(e[2])?0:Math.abs(e[1])>=Math.abs(e[2])?1:2,i=t.map(s=>n===0?new Fe(s[1],s[2]):n===1?new Fe(s[0],s[2]):new Fe(s[0],s[1]));return Hc.triangulateShape(i,[]).flat()}function co(t,e,n,i,s,r,a){if(r.has(e))throw new RangeError(`Duplicate lab primitive ID: ${e}.`);t.name=e,t.userData.primitiveId=e,t.userData.role=n,t.userData.sourceEntities=i.map(o=>({...o})),s!==void 0&&(t.userData.diagnosticState=s),r.set(e,t),a.add(t)}function FT(t,e){return t==="hingeMountain"?new Wr({color:e,dashSize:.08,gapSize:.025}):t==="hingeValley"?new Wr({color:e,dashSize:.025,gapSize:.04}):t==="hingeUnassigned"?new Wr({color:e,dashSize:.04,gapSize:.04}):new _a({color:e})}function lo(t,e){if(e===void 0||e.disposition==="accepted")return;const n=e.diagnostics.flatMap(i=>i.locations.some(r=>r.kind==="entity"&&t.some(a=>ou(a)===ou(r.entity)))?[i.category==="unsupported"?"unsupported":"invalid"]:[]);return n.includes("invalid")?"invalid":n.includes("unsupported")?"unsupported":void 0}function uo(t){return t===void 0?void 0:IT[t]}function ou(t){return`${t.kind}\0${t.id}`}function UT(t,e){if(e.length<3)throw new RangeError(`Face ${t} requires at least three vertices.`);for(const n of e)qr(t,n)}function qr(t,e){if(e.length!==3||!e.every(Number.isFinite))throw new RangeError(`Primitive ${t} requires finite 3D coordinates.`)}const cu=Object.freeze({gridCenter:13948116,grid:15658734});function OT(t){const e=new gT({antialias:!0,alpha:!1});e.setClearColor(16777215,1),e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.outputColorSpace=jt,t.append(e.domElement);const n=new PM;n.fog=new Vc(16777215,.018);const i=new an(42,1,.01,1e3);i.position.set(6,5,7);const s=new xT(i,e.domElement);s.enableDamping=!0,s.dampingFactor=.08,s.screenSpacePanning=!0,n.add(new gy(16777215,1.2));const r=new Ld(16777215,2.5);r.position.set(4,7,5),n.add(r);const a=new Ld(16777215,1.1);a.position.set(-5,2,-4),n.add(a);const o=new vy(24,24,cu.gridCenter,cu.grid);o.position.y=-.002,n.add(o);let c,l=!1;const u=()=>{const d=Math.max(t.clientWidth,1),f=Math.max(t.clientHeight,1);e.setSize(d,f,!1),i.aspect=d/f,i.updateProjectionMatrix()},h=new ResizeObserver(u);return h.observe(t),u(),e.setAnimationLoop(()=>{s.update(),e.render(n,i)}),{show(d,f){c?.dispose(),c&&n.remove(c.group),c=DT(d,f),n.add(c.group)},focus(){if(!c)return;const d=new fs().setFromObject(c.group);if(d.isEmpty()){s.target.set(0,0,0),i.position.set(6,5,7),s.update();return}const f=d.getCenter(new U),p=d.getSize(new U),m=Math.max(p.length()*.5,.5)/Math.sin(dh.degToRad(i.fov*.5)),g=new U(1.15,.85,1.35).normalize();s.target.copy(f),i.position.copy(f).addScaledVector(g,m*1.15),i.near=Math.max(m/1e3,.001),i.far=Math.max(m*100,100),i.updateProjectionMatrix(),s.update()},resize:u,dispose(){l||(l=!0,h.disconnect(),e.setAnimationLoop(null),s.dispose(),c?.dispose(),e.dispose(),e.domElement.remove())}}}const lu={width:210,height:297},kT={width:297,height:210},Uh=10;function BT(t,e=Uh){const n=t.faces.length>0?t.faces.flatMap(a=>a.vertices):t.segments.flatMap(a=>[a.start,a.end]);if(n.length===0)throw new RangeError("Fabrication frame is empty.");const i=zT(n),s=n.map(a=>[a[i[0]],a[i[1]]]),r={minX:Math.min(...s.map(([a])=>a)),minY:Math.min(...s.map(([,a])=>a)),maxX:Math.max(...s.map(([a])=>a)),maxY:Math.max(...s.map(([,a])=>a))};return{...VT(r,e),bounds:r,axes:i}}function VT(t,e=Uh){if(![t.minX,t.minY,t.maxX,t.maxY,e].every(Number.isFinite))throw new RangeError("Fabrication bounds and margin must be finite.");const i=t.maxX-t.minX,s=t.maxY-t.minY;if(i<=0||s<=0)throw new RangeError("Fabrication bounds must have positive area.");if(e<0||e*2>=lu.width)throw new RangeError("A4 print margin leaves no printable area.");const r=["portrait","landscape"].map(c=>{const l=c==="portrait"?lu:kT,u=Math.min((l.width-e*2)/i,(l.height-e*2)/s);return{orientation:c,pageMm:l,scale:u}}),a=r[1].scale>r[0].scale?r[1]:r[0],o={width:i*a.scale,height:s*a.scale};return{...a,marginMm:e,contentMm:o,offsetMm:{x:(a.pageMm.width-o.width)/2,y:(a.pageMm.height-o.height)/2},bounds:t,axes:[0,1]}}function du(t,e){return[e.offsetMm.x+(t[e.axes[0]]-e.bounds.minX)*e.scale,e.offsetMm.y+(t[e.axes[1]]-e.bounds.minY)*e.scale]}function zT(t){const n=[0,1,2].map(i=>{const s=t.map(r=>r[i]);return{axis:i,range:Math.max(...s)-Math.min(...s)}}).sort((i,s)=>s.range-i.range||i.axis-s.axis).slice(0,2).map(({axis:i})=>i).sort((i,s)=>i-s);return[n[0],n[1]]}const HT=new Set(["boundary","cut","hingeMountain","hingeValley","hingeUnassigned"]);function GT(t,e={}){const n=BT(t,e.marginMm),i=t.segments.filter(o=>HT.has(o.role)).map(o=>$T(o,n)),{width:s,height:r}=n.pageMm;return{svg:[`<svg xmlns="http://www.w3.org/2000/svg" width="${s}mm" height="${r}mm" viewBox="0 0 ${s} ${r}" role="img" aria-label="A4 flat fabrication template">`,"  <style>line{fill:none;stroke:#000;stroke-width:.25;vector-effect:non-scaling-stroke;stroke-linecap:butt}.boundary,.cut{stroke-dasharray:none}.fold{stroke-width:.2}.mountain{stroke-dasharray:6 2}.valley{stroke-dasharray:2 2}.unassigned{stroke-dasharray:4 2}</style>",...i,"</svg>"].join(`
`),orientation:n.orientation,pageMm:n.pageMm,layout:n}}function $T(t,e){const[n,i]=du(t.start,e),[s,r]=du(t.end,e);return`  <line data-edge-id="${XT(t.id)}" data-role="${t.role}" class="${WT(t.role)}" x1="${Or(n)}" y1="${Or(i)}" x2="${Or(s)}" y2="${Or(r)}" />`}function WT(t){switch(t){case"boundary":return"boundary";case"cut":return"cut";case"hingeMountain":return"fold mountain";case"hingeValley":return"fold valley";case"hingeUnassigned":return"fold unassigned";default:throw new RangeError(`Role ${t} is not printable.`)}}function Or(t){const e=Math.abs(t)<1e-10?0:t;return Number(e.toFixed(6)).toString()}function XT(t){return t.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}const qT="iframe[data-fabrication-print]";function YT(t,e="Kirigami A4 fabrication template"){const n=t.orientation==="landscape"?"landscape":"portrait",{width:i,height:s}=t.pageMm;return`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${ZT(e)}</title>
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
</html>`}function KT(t,e,n=document){n.querySelector(qT)?.remove();const i=n.createElement("iframe");return i.dataset.fabricationPrint="",i.title="A4 fabrication print surface",i.setAttribute("aria-hidden","true"),Object.assign(i.style,{position:"fixed",width:"1px",height:"1px",right:"0",bottom:"0",border:"0",opacity:"0",pointerEvents:"none"}),i.srcdoc=YT(t,e),i.addEventListener("load",()=>{const s=i.contentWindow;s&&(s.focus(),s.print())},{once:!0}),n.body.append(i),i}function ZT(t){return t.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const uu={points:[],segments:[],faces:[]},kr={width:1.2,stepCount:7,stepRun:.32,stepRise:.32,hostWidth:4,hostFloorExtent:2.56,hostWallExtent:2.56},JT={height:.2,length:2,width:4.5};function jT(t){t.innerHTML=`
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
          <summary><h2>Committed examples</h2><span>${ar.length}</span></summary>
          <nav class="example-list"></nav>
        </details>
        <details class="sidebar-group stair-study" open>
          <summary><h2>Stairs</h2><span>4</span></summary>
          <p>Compiler construction strategies</p>
          <div class="stair-strategy-list"></div>
          <small>Play the same topology from flat pattern to deployed stair.</small>
        </details>
        <details class="sidebar-group stair-study" open>
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
  `;const e=$t(t,".example-list"),n=$t(t,".viewport-host"),i=$t(t,".viewport-state"),s=$t(t,".viewport-print"),r=$t(t,".viewport-preview-label"),a=$t(t,".stair-preview-label"),o=$t(t,".stair-strategy-list"),c=$t(t,".module-list"),l=$t(t,".cutout-list"),u=$t(t,".inspector-scroll"),h=$t(t,".timeline-panel input[type='range']"),d=$t(t,".timeline-panel output"),f=$t(t,".timeline-markers"),p=$t(t,".timeline-play"),_=[...t.querySelectorAll(".timeline-step")],m=OT(n),g=Nx();let A=0,w,v,S,y,T=0,M,b,P="Kirigami A4 fabrication template";const C=(j,G)=>{b=j,P=G??"Kirigami A4 fabrication template",s.disabled=j===void 0},I=()=>{M!==void 0&&window.clearInterval(M),M=void 0,p.ariaPressed="false",p.textContent="Play"},X=j=>j.points.length+j.segments.length+j.faces.length>0,H=(j,G)=>{const he=new Map;if(j.result.observed.disposition!=="accepted")for(const de of j.result.diagnostics)for(const ye of de.locations){if(ye.kind!=="sample")continue;const we=de.category==="unsupported"?"unsupported":"invalid";(we==="invalid"||he.get(ye.index)===void 0)&&he.set(ye.index,we)}const ne=Math.max(G-1,...he.keys(),0);f.replaceChildren(...[...he.entries()].map(([de,ye])=>{const we=document.createElement("span");return we.dataset.diagnosticState=ye,we.style.left=`${ne===0?0:de/ne*100}%`,we.title=`${ye} at sample ${de+1}`,we.setAttribute("role","img"),we.setAttribute("aria-label",we.title),we}))},D=(j,G=!1)=>{const he=v?.frames??w?.frames.map(we=>we.frame)??[],ne=v?.parameters??w?.frames.map(we=>we.parameter)??[];if(he.length===0)return;T=Math.max(0,Math.min(j,he.length-1));const de=he[T];a.hidden=!v,r.hidden=!0,delete r.dataset.diagnosticState,m.show(de),G&&m.focus(),h.max=String(he.length-1),h.value=String(T);const ye=he.length>1;h.disabled=!ye,p.disabled=!ye;for(const we of _)we.disabled=!ye;w&&!v&&H(w,he.length),d.value=`sample ${T+1}/${he.length} · parameter ${QT(ne[T]??0)}`},W=j=>{T=0,h.value="0",h.max="0",h.disabled=!0,p.disabled=!0;for(const G of _)G.disabled=!0;d.value=j?"no renderable samples · previous geometry retained":"no engine samples"},B=j=>{i.hidden=j===void 0,i.textContent=j??""},q=j=>{Hx(u,w,j,{onParameterCommit(G,he){if(!y)return;const ne=Ux(y,G,he);if(!ne.ok){q(ne.diagnostics[0]?.message);return}y=ne.example,te(ne.example,{preserveGeometryOnEmpty:!0,focus:!1})},onReset(){S&&(y=S,te(S,{preserveGeometryOnEmpty:!0,focus:!1}))}})},te=async(j,G)=>{I();const he=++A;B(`Evaluating ${j.id}…`);try{const ne=await g.evaluate(j);if(he!==A)return;w=ne,y=ne.example,T=0,q(),ne.frames.some(({frame:ye})=>X(ye))?(C(ne.frames.find(({frame:ye})=>X(ye))?.frame,`${ne.example.title} — A4 fabrication template`),D(0,G.focus)):ne.diagnosticPreview!==void 0&&!G.preserveGeometryOnEmpty?(m.show(ne.diagnosticPreview.frame,{diagnostics:ne.result.diagnostics,disposition:ne.result.observed.disposition}),G.focus&&m.focus(),r.hidden=!1,r.dataset.diagnosticState=ne.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=`${ne.diagnosticPreview.label} · ${ne.result.observed.disposition}`,W(!1),H(ne,0),d.value=`${ne.diagnosticPreview.label} · no certified engine samples`):(G.preserveGeometryOnEmpty||C(),G.preserveGeometryOnEmpty||(m.show(uu),G.focus&&m.focus()),r.hidden=!1,r.dataset.diagnosticState=ne.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=G.preserveGeometryOnEmpty?`${ne.result.observed.disposition} input · previous certified geometry retained`:`${ne.result.observed.disposition} · no spatial preview`,W(G.preserveGeometryOnEmpty),H(ne,0)),B()}catch(ne){if(he!==A)return;const de=ne instanceof Error?ne.message:String(ne);q(de),B(`Engine error · ${de}`)}},re=j=>{const G=ar[j];if(G){for(const[he,ne]of[...e.querySelectorAll(".example-row")].entries())ne.ariaPressed=String(he===j);S=G.example,y=G.example,v=void 0,C(),a.hidden=!0,te(G.example,{preserveGeometryOnEmpty:!1,focus:!0})}},ce=()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const j={operationId:"certified-one-sheet-stair",hostPlane:"wall",...kr},G=_c(j);if(!G.ok){u.textContent=G.diagnostics[0]?.message??"Stair rejected.";return}const he=vc({input:j,complex:G.complex,sourceMap:G.sourceMap,sampleCount:7});if(!he.ok){u.textContent=he.diagnostics[0]?.message??"Stair path rejected.";return}a.textContent="certified compiler result · One-sheet staircase";const ne=he.samples.map(de=>Wx(G.complex,G.sourceMap,j,de.transforms));v={frames:ne,parameters:he.samples.map(de=>de.parameter)},C(ne[0],"One-sheet staircase — A4 fabrication template"),m.show(ne.at(-1)),m.focus(),u.innerHTML=`
      <section class="inspection-section">
        <h2>One-sheet staircase</h2>
        <p class="quiet">Certified as one connected material component after cuts: stair, bridges, and host remain materially joined.</p>
      </section>
      <section class="inspection-section">
        <h2>Construction</h2>
        <p class="quiet">${j.stepCount} steps · A4 flat fabrication sheet · ${G.sourceMap.faces.filter(de=>de.role==="step").length} retained step surfaces · ${G.sourceMap.cutPairs.length} paired cuts · ${G.sourceMap.voids.length} opening voids.</p>
        <p class="quiet">Construction status: certified connected sheet.</p>
      </section>
    `,D(ne.length-1)},ae=document.createElement("button");ae.type="button",ae.className="stair-strategy-button",ae.ariaPressed="false",ae.textContent="One-sheet staircase",ae.addEventListener("click",()=>{ae.ariaPressed="true",ce()}),o.append(ae);const ze=document.createElement("button");ze.type="button",ze.className="stair-strategy-button",ze.ariaPressed="false",ze.textContent="Tread-only staircase",ze.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const j={operationId:"tread-only-stair",...kr},G=wc(j);if(!G.ok){u.textContent=G.diagnostics[0]?.message??"Tread-only pattern rejected.";return}const he=Rc({input:j,complex:G.complex,sourceMap:G.sourceMap,sampleCount:7});if(!he.ok){u.textContent=he.diagnostics[0]?.message??"Tread-only deployment rejected.";return}const ne=he.samples.map(ye=>ye.parameter),de=he.samples.map(ye=>Xx(G.complex,G.sourceMap,ye.transforms));v={frames:de,parameters:ne},C(de[0],"Tread-only staircase — A4 fabrication template"),m.show(de.at(-1)),m.focus(),a.textContent="compiler construction preview · Tread-only staircase",u.innerHTML=`
      <section class="inspection-section">
        <h2>Tread-only staircase</h2>
        <p class="quiet">${j.stepCount} steps · A4 flat fabrication sheet. Compiled directly from the approved one-sheet cut/score template: ${G.sourceMap.cutLines.length} authored long cuts, ${G.sourceMap.hinges.filter(ye=>ye.role!=="parent").length} step folds, and no riser faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">Computed from one topology: retained edges remain joined while paired cut banks open into negative space.</p>
      </section>
    `,D(de.length-1)}),o.append(ze);const Je=document.createElement("button");Je.type="button",Je.className="stair-strategy-button",Je.ariaPressed="false",Je.textContent="Riser-only staircase",Je.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const j={operationId:"riser-only-stair",...kr},G=tv(j);if(!G.ok){u.textContent=G.diagnostics[0]?.message??"Riser-only pattern rejected.";return}const he=nv({input:j,complex:G.complex,sourceMap:G.sourceMap,sampleCount:7});if(!he.ok){u.textContent=he.diagnostics[0]?.message??"Riser-only deployment rejected.";return}const ne=he.samples.map(ye=>ye.parameter),de=he.samples.map(ye=>qx(G.complex,G.sourceMap,ye.transforms));v={frames:de,parameters:ne},C(de[0],"Riser-only staircase — A4 fabrication template"),m.show(de.at(-1)),m.focus(),a.textContent="compiler construction preview · Riser-only staircase",u.innerHTML=`
      <section class="inspection-section">
        <h2>Riser-only staircase</h2>
        <p class="quiet">${j.stepCount} steps · A4 flat fabrication sheet. Compiled from the same one-sheet cut topology in its flipped deployment: ${G.sourceMap.cutLines.length} authored long cuts, ${G.sourceMap.supports.length} retained riser regions, and no tread faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">The stationary host supports the risers while one connected carrier wall preserves their material ancestry and retained-edge closure.</p>
      </section>
    `,D(de.length-1)}),o.append(Je);const He=document.createElement("button");He.type="button",He.className="stair-strategy-button",He.ariaPressed="false",He.textContent="Carrier-hosted compound staircase",He.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const j=av({operationId:"carrier-hosted-compound-stair",parent:kr,child:{width:.16,stepCount:4,stepRun:.144,stepRise:.144,hostWidth:.24,hostFloorExtent:.72,hostWallExtent:.72},childHostStepIndex:6});if(!j.ok){u.textContent=j.diagnostics[0]?.message??"Compound stair rejected.";return}const G=ov({compilation:j,sampleCount:7});if(!G.ok){u.textContent=G.diagnostics[0]?.message??"Compound deployment rejected.";return}const he=G.samples.map(de=>de.parameter),ne=G.samples.map(de=>Yx(j,de));v={frames:ne,parameters:he},C(ne[0],"Carrier-hosted compound staircase — A4 fabrication template"),m.show(ne.at(-1)),m.focus(),a.textContent="compiler construction preview · Carrier-hosted compound staircase",u.innerHTML=`
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
    `,D(ne.length-1)}),o.append(He);const Z=document.createElement("button");Z.type="button",Z.className="stair-strategy-button",Z.ariaPressed="false",Z.textContent="Ground slab";const oe=(j,G)=>{const he=j.result.observed.disposition==="accepted",ne=j.result.diagnostics.map(de=>`<p class="quiet inspector-error">${Rs(de.message)}</p>`).join("");u.innerHTML=`
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
    `,u.querySelectorAll("input[type=range]").forEach(de=>{de.addEventListener("input",()=>{const ye=we=>Number(u.querySelector(`input[aria-label="${we}"]`)?.value??0);Ne({height:ye("Height"),length:ye("Length"),width:ye("Width")})})})},ie=(j,G)=>{const he=j.result.observed.disposition==="accepted",ne=u.querySelector("[data-slab-status]");ne&&(ne.innerHTML=`<strong>${he?"accepted":"rejected"}</strong> · height ${G.height.toFixed(2)} · length ${G.length.toFixed(2)} · width ${G.width.toFixed(2)}`);for(const[ye,we]of[["Height",G.height],["Length",G.length],["Width",G.width]]){const Ke=u.querySelector(`input[aria-label="${ye}"]`),ft=Ke?.parentElement?.querySelector("output");Ke&&(Ke.value=String(we)),ft&&(ft.value=we.toFixed(2))}const de=u.querySelector("[data-slab-diagnostics]");de&&(de.innerHTML=j.result.diagnostics.map(ye=>`<p class="quiet inspector-error">${Rs(ye.message)}</p>`).join(""))},Ne=(j,G=!1)=>{I(),A+=1;const he=ar.find(({example:Ke})=>Ke.title==="One root plane pair");if(!he){u.textContent="Certified root plane pair example is unavailable.";return}if(he.example.kind!=="spatialProgram"){u.textContent="Root plane pair example is not a spatial program.";return}const ne={...he.example,id:"ground-slab",title:"Ground slab",assumptions:["Wide shallow plane-pair slab"],input:{...he.example.input,id:"ground-slab",sheet:{...he.example.input.sheet,width:6,wallExtent:3,floorExtent:3},operations:he.example.input.operations.map(Ke=>({...Ke,id:"slab-pair",xOffset:(6-j.width)/2,width:j.width,height:j.length,depth:j.height,alignment:"axisAligned"}))}},de=Sx(ne);w=de,S=he.example,y=ne,r.hidden=!0;const ye=de.frames.map(Ke=>({...Ke.frame,points:[]})),we=de.frames.map(Ke=>Ke.parameter);de.result.observed.disposition==="accepted"&&ye.length>0?(v={frames:ye,parameters:we},C(ye.at(-1),"Ground slab — A4 fabrication template"),a.hidden=!1,a.textContent="compiler construction preview · Ground slab",D(0)):(v=void 0,C(de.diagnosticPreview?.frame,"Ground slab — diagnostic preview"),a.hidden=!0,m.show(de.diagnosticPreview?.frame??uu,{diagnostics:de.result.diagnostics,disposition:de.result.observed.disposition}),G&&m.focus(),W(!1)),u.querySelector(".slab-controls")?ie(de,j):oe(de,j),G&&de.result.observed.disposition==="accepted"&&m.focus()};Z.addEventListener("click",()=>Ne(JT,!0)),c.append(Z);for(const j of["Wall","Roof"]){const G=document.createElement("button");G.type="button",G.className="stair-strategy-button",G.disabled=!0,G.textContent=`${j} · planned`,c.append(G)}for(const j of["Window","Door"]){const G=document.createElement("button");G.type="button",G.className="stair-strategy-button",G.disabled=!0,G.textContent=`${j} · planned`,l.append(G)}s.addEventListener("click",()=>{if(b)try{const j=GT(b);KT(j,P)}catch(j){const G=j instanceof Error?j.message:String(j);B(`Print unavailable · ${G}`)}});for(const[j,G]of ar.entries()){const he=document.createElement("button");he.type="button",he.className="example-row",he.ariaPressed="false",he.innerHTML=`
      <span class="example-index">${String(j+1).padStart(2,"0")}</span>
      <span>
        <strong>${Rs(G.example.title)}</strong>
        <small>${Rs(G.example.kind)} · ${Rs(G.example.fixtureClass)}</small>
      </span>
    `,he.addEventListener("click",()=>re(j)),e.append(he)}return h.addEventListener("input",()=>{a.hidden=!0,I(),D(Number(h.value))}),_.forEach(j=>{j.addEventListener("click",()=>{I(),D(T+Number(j.dataset.direction))})}),p.addEventListener("click",()=>{if(M!==void 0){I();return}const j=v?.frames.length??w?.frames.length??0;j<=1||(T>=j-1&&D(0),p.ariaPressed="true",p.textContent="Pause",M=window.setInterval(()=>{const G=v?.frames.length??w?.frames.length??0;if(G===0||T>=G-1){I();return}D(T+1)},650))}),q(),re(0),()=>{A+=1,I(),g.dispose(),m.dispose(),t.replaceChildren()}}function $t(t,e){const n=t.querySelector(e);if(!n)throw new Error(`Missing Engine Lab element: ${e}.`);return n}function QT(t){return Math.abs(t)>=1e3||t!==0&&Math.abs(t)<.001?t.toExponential(5):t.toFixed(5).replace(/0+$/,"").replace(/\.$/,"")}function Rs(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}const Oh=document.querySelector("#app");if(!Oh)throw new Error("Missing Engine Lab root.");jT(Oh);
