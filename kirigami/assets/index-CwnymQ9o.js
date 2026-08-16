(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();const Gh=1;function Ci(t){if(!Wh(t))return[_t("TOPOLOGY_SCHEMA_UNSUPPORTED","Value does not have the required cell-complex collections.",[])];if(t.schemaVersion!==Gh)return[_t("TOPOLOGY_SCHEMA_UNSUPPORTED",`Topology schema version ${String(t.schemaVersion)} is not supported.`,[])];const e=$h(t);if(e)return[_t("TOPOLOGY_DUPLICATE_ID",`Entity ID ${e.id} is not unique.`,[e])];const n=[],i=new Map(t.vertices.map(c=>[c.id,c])),s=new Map(t.halfEdges.map(c=>[c.id,c])),r=new Map(t.edges.map(c=>[c.id,c])),a=new Map(t.faces.map(c=>[c.id,c])),o=new Map(t.cutPairs.map(c=>[c.id,c]));for(const c of t.vertices)(c.position.length!==2||!c.position.every(l=>Number.isFinite(l)))&&n.push(_t("TOPOLOGY_INVALID_NUMBER","Vertex coordinates must be finite two-dimensional values.",[rt("vertex",c.id)]));for(const c of t.halfEdges){ps(n,i,"vertex",c.origin,c),ps(n,s,"halfEdge",c.next,c),ps(n,r,"edge",c.edge,c),ps(n,a,"face",c.face,c),c.twin!==void 0&&ps(n,s,"halfEdge",c.twin,c);const l=r.get(c.edge);l&&!l.halfEdges.includes(c.id)&&n.push(_t("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[rt("halfEdge",c.id),rt("edge",l.id)]))}for(const c of t.edges)Xh(c,s,n);for(const c of t.faces){il(c,c.boundary,"boundary",s,n);for(const l of c.holes)il(c,l,"hole",s,n)}for(const c of t.cutPairs)qh(c,r,n);for(const c of t.edges.filter(l=>l.kind==="cutBank")){const l=c.cutBank?o.get(c.cutBank.pair):void 0;(!l||!l.banks.includes(c.id))&&n.push(_t("TOPOLOGY_CUT_PAIR_INVALID","Each cut bank must reference a cut pair that lists that edge.",[rt("edge",c.id)]))}return Kh(t,a,n),n}function Wh(t){if(typeof t!="object"||t===null)return!1;const e=t;return Array.isArray(e.vertices)&&e.vertices.every(n=>Ni(n)&&Array.isArray(n.position)&&n.position.length===2)&&Array.isArray(e.halfEdges)&&e.halfEdges.every(n=>Ni(n)&&typeof n.origin=="string"&&typeof n.next=="string"&&typeof n.edge=="string"&&typeof n.face=="string")&&Array.isArray(e.edges)&&e.edges.every(n=>Ni(n)&&Array.isArray(n.halfEdges)&&typeof n.kind=="string")&&Array.isArray(e.faces)&&e.faces.every(n=>Ni(n)&&typeof n.boundary=="string"&&Array.isArray(n.holes))&&Array.isArray(e.cutPairs)&&e.cutPairs.every(n=>Ni(n)&&Array.isArray(n.banks))&&Array.isArray(e.materialComponents)&&e.materialComponents.every(n=>Ni(n)&&Array.isArray(n.faces))}function Ni(t){return typeof t=="object"&&t!==null&&typeof t.id=="string"}function $h(t){const e=new Set,n=[["vertex",t.vertices],["halfEdge",t.halfEdges],["edge",t.edges],["face",t.faces],["cutPair",t.cutPairs],["materialComponent",t.materialComponents]];for(const[i,s]of n)for(const r of s){if(e.has(r.id))return rt(i,r.id);e.add(r.id)}}function ps(t,e,n,i,s){e.has(i)||t.push(_t("TOPOLOGY_MISSING_REFERENCE",`Half-edge ${s.id} references missing ${n} ${i}.`,[rt("halfEdge",s.id),rt(n,i)]))}function Xh(t,e,n){const i=t.kind==="hinge"||t.kind==="joined"||t.kind==="flatSeam",s=i?2:1;t.halfEdges.length!==s&&n.push(_t("TOPOLOGY_EDGE_CARDINALITY",`Edge kind ${t.kind} requires ${s} half-edge(s).`,[rt("edge",t.id)]));const r=t.halfEdges.map(a=>e.get(a)).filter(a=>a!==void 0);if(r.some(a=>a.edge!==t.id)&&n.push(_t("TOPOLOGY_EDGE_MEMBERSHIP","An edge and its listed half-edges must reference each other.",[rt("edge",t.id)])),i&&r.length===2){const[a,o]=r;(a.twin!==o.id||o.twin!==a.id)&&n.push(_t("TOPOLOGY_TWIN_MISMATCH","Two-sided edge half-edges must be symmetric twins.",[rt("edge",t.id),rt("halfEdge",a.id),rt("halfEdge",o.id)]));const c=e.get(a.next)?.origin,l=e.get(o.next)?.origin;c!==void 0&&l!==void 0&&(a.origin!==l||o.origin!==c)&&n.push(_t("TOPOLOGY_TWIN_ORIENTATION","Twin half-edges must traverse the shared edge in opposite directions.",[rt("edge",t.id),rt("halfEdge",a.id),rt("halfEdge",o.id)]))}else!i&&r.some(a=>a.twin!==void 0)&&n.push(_t("TOPOLOGY_TWIN_MISMATCH","One-sided boundary and cut-bank half-edges cannot have twins.",[rt("edge",t.id)]));Yh(t,n)}function Yh(t,e){if(t.kind==="hinge"){if(!t.hinge){e.push(_t("TOPOLOGY_HINGE_SPEC_INVALID","A hinge edge requires a hinge specification.",[rt("edge",t.id)]));return}const[i,s]=t.hinge.angleRange;(![i,s,t.hinge.restAngle].every(Number.isFinite)||i>s||t.hinge.restAngle<i||t.hinge.restAngle>s)&&e.push(_t("TOPOLOGY_HINGE_INTERVAL_INVALID","Hinge angle bounds must be finite, ordered, and contain the rest angle.",[rt("edge",t.id)]))}else t.hinge!==void 0&&e.push(_t("TOPOLOGY_HINGE_SPEC_INVALID","Only hinge edges may carry hinge specifications.",[rt("edge",t.id)]));const n=t.cutBank!==void 0;t.kind==="cutBank"!==n&&e.push(_t("TOPOLOGY_CUT_PAIR_INVALID","Cut-bank metadata is required exactly on cut-bank edges.",[rt("edge",t.id)]))}function il(t,e,n,i,s){const r=new Set;let a=e;for(;!r.has(a);){r.add(a);const o=i.get(a);if(!o||o.face!==t.id){s.push(sl(t,n));return}a=o.next}(a!==e||r.size<3)&&s.push(sl(t,n))}function sl(t,e){return _t("TOPOLOGY_FACE_LOOP_OPEN",`Face ${e} must form a closed loop of at least three half-edges.`,[rt("face",t.id)])}function qh(t,e,n){const[i,s]=t.banks,r=e.get(i),a=e.get(s);i!==s&&r?.kind==="cutBank"&&a?.kind==="cutBank"&&r.cutBank?.pair===t.id&&a.cutBank?.pair===t.id&&new Set([r.cutBank.bank,a.cutBank.bank]).size===2||n.push(_t("TOPOLOGY_CUT_PAIR_INVALID","A cut pair requires two distinct cut-bank edges labeled a and b.",[rt("cutPair",t.id)]))}function Kh(t,e,n){const i=new Map;for(const r of t.materialComponents)for(const a of r.faces)i.set(a,(i.get(a)??0)+1),e.has(a)||n.push(_t("TOPOLOGY_MISSING_REFERENCE",`Material component ${r.id} references missing face ${a}.`,[rt("materialComponent",r.id),rt("face",a)]));for(const r of t.faces)i.get(r.id)!==1&&n.push(_t("TOPOLOGY_COMPONENT_INVALID","Every face must belong to exactly one material component.",[rt("face",r.id)]));const s=new Map;for(const r of t.edges){if(!["hinge","joined","flatSeam"].includes(r.kind)||r.halfEdges.length!==2)continue;const a=r.halfEdges.map(l=>t.halfEdges.find(h=>h.id===l)).filter(l=>l!==void 0);if(a.length!==2||a[0].face===a[1].face)continue;const[o,c]=a.map(l=>l.face);s.get(o)?.add(c)??s.set(o,new Set([c])),s.get(c)?.add(o)??s.set(c,new Set([o]))}for(const r of t.materialComponents){const a=r.faces.filter(l=>e.has(l));if(a.length<2)continue;const o=new Set([a[0]]),c=[a[0]];for(;c.length>0;){const l=c.shift();for(const h of s.get(l)??[])a.includes(h)&&!o.has(h)&&(o.add(h),c.push(h))}o.size!==a.length&&n.push(_t("TOPOLOGY_COMPONENT_INVALID",`Material component ${r.id} contains disconnected faces; cut banks cannot substitute for a sheet connection.`,[rt("materialComponent",r.id)]))}}function _t(t,e,n){return{severity:"error",category:"topology",code:t,message:e,locations:n.length>0?n.map(i=>({kind:"entity",entity:i})):[{kind:"nonSpatial",reason:"Topology schema root."}],entities:n}}function rt(t,e){return{kind:t,id:e}}const Je={absoluteLength:1e-9,relativeLength:1e-9,absoluteAngle:1e-9,relativeRank:1e-10};function du(t,e=Je){if(!Number.isFinite(t)||t<0)throw new RangeError("Scale must be finite non-negative.");return e.absoluteLength+e.relativeLength*t}function uu(t,e){const n=t.vertices.find(r=>r.id===e);if(!n)return{applicability:"notApplicable",reason:`Vertex ${e} does not exist.`};const i=t.edges.map(r=>({edge:r,endpoints:Jh(t,r)})).filter(({endpoints:r})=>r.includes(e));if(i.length===0)return{applicability:"notApplicable",reason:"Vertex has no incident material edges."};if(i.some(({edge:r})=>r.kind!=="hinge"||!r.hinge))return{applicability:"notApplicable",reason:"Classical single-vertex tests do not apply to non-hinge incidence."};const s=i.map(({edge:r,endpoints:a})=>{const o=a[0]===e?a[1]:a[0],c=t.vertices.find(u=>u.id===o);if(!c||!r.hinge)throw new Error("Validated incident edge is missing geometry.");const l=c.position[0]-n.position[0],h=c.position[1]-n.position[1];if(!(Math.hypot(l,h)<=Je.absoluteLength))return{edgeId:r.id,directionAngle:Math.atan2(h,l),assignment:r.hinge.assignment}}).filter(r=>r!==void 0).sort((r,a)=>r.directionAngle-a.directionAngle);if(s.length!==i.length||s.length<2)return{applicability:"notApplicable",reason:"Crease rays must be nondegenerate."};for(let r=0;r<s.length;r+=1){const a=s[(r+1)%s.length];if((r===s.length-1?a.directionAngle+Math.PI*2-s[r].directionAngle:a.directionAngle-s[r].directionAngle)<=Je.absoluteAngle)return{applicability:"notApplicable",reason:"Crease rays must have distinct directions."}}return{applicability:"applicable",rays:s,sectorAngles:s.map((r,a)=>{const o=s[(a+1)%s.length];return a===s.length-1?o.directionAngle+Math.PI*2-r.directionAngle:o.directionAngle-r.directionAngle})}}function Zh(t,e){const n=uu(t,e);return n.applicability==="notApplicable"?n:{applicability:"applicable",rays:n.rays,sectorAngles:n.sectorAngles,...pc(n.sectorAngles,n.rays.map(i=>i.assignment))}}function pc(t,e,n=Je.absoluteAngle){if(t.length!==e.length||t.length<2||t.some(f=>!Number.isFinite(f)||f<=0)){const f={status:"failed",reason:"Sector angles and assignments must be finite matching arrays."};return{kawasaki:f,maekawa:f,locallyFlatFoldable:!1}}const i=t.length%2!==0,s=t.reduce((f,p,_)=>(f[_%2]+=p,f),[0,0]),r=s[0]+s[1],a=Math.max(Math.abs(s[0]-Math.PI),Math.abs(s[1]-Math.PI),Math.abs(r-Math.PI*2)),o={status:!i&&a<=n?"satisfied":"failed",residual:a,...i?{reason:"Kawasaki requires even crease degree."}:{}},c=e.every(f=>f==="mountain"||f==="valley"),l=e.filter(f=>f==="mountain").length,h=e.filter(f=>f==="valley").length,u=Math.abs(Math.abs(l-h)-2),d=c?{status:u===0?"satisfied":"failed",residual:u}:{status:"notApplicable",reason:"Maekawa requires a complete mountain/valley assignment."};return{kawasaki:o,maekawa:d,locallyFlatFoldable:o.status==="satisfied"&&d.status==="satisfied"}}function Jh(t,e){const n=t.halfEdges.find(s=>s.id===e.halfEdges[0]),i=n?t.halfEdges.find(s=>s.id===n.next):void 0;if(!n||!i)throw new Error(`Edge ${e.id} has incomplete half-edge topology.`);return[n.origin,i.origin]}function jh(t,e=16){if(t.length<2||t.length>e||t.some(r=>!Number.isFinite(r)||r<=0))return{applicable:!1,candidateAssignments:[],locallyFlatFoldableAssignments:[],truncated:!1,reason:"Vertex degree is outside the bounded enumeration domain."};const n=2**t.length,i=[],s=[];for(let r=0;r<n;r+=1){const a=t.map((c,l)=>(r>>l&1)===0?"mountain":"valley");i.push(a),pc(t,a).locallyFlatFoldable&&s.push(a)}return{applicable:!0,candidateAssignments:i,locallyFlatFoldableAssignments:s,truncated:!1}}function Qh(t){const e=t.edges.filter(r=>r.kind==="cutBank"),n=new Set(t.cutPairs.flatMap(r=>r.banks)),i=e.map(r=>r.id).filter(r=>!n.has(r)),s=t.cutPairs.filter(r=>r.banks.length!==2||r.banks[0]===r.banks[1]?!0:r.banks.some(a=>{const o=t.edges.find(c=>c.id===a);return o?.kind!=="cutBank"||o.cutBank?.pair!==r.id})).map(r=>r.id);return{certified:i.length===0&&s.length===0,cutPairIds:t.cutPairs.map(r=>r.id),unpairedCutBankIds:i,invalidCutPairIds:s}}function hu(t){const e=t.edges.filter(n=>n.kind==="hinge"&&n.hinge?.assignment==="unassigned").map(n=>n.id);return{complete:e.length===0,unassignedHingeIds:e}}function fu(t){const e=t.vertices.flatMap(a=>{const o=Zh(t,a.id);return o.applicability==="applicable"?[{vertexId:a.id,analysis:o,counting:jh(o.sectorAngles)}]:[]}),n=pu(t),i=hu(t),s=ef(t),r=n.colorable&&i.complete&&s&&e.every(({analysis:a})=>a.locallyFlatFoldable);return{applicability:"local-gates-only",faceTwoColorability:n,mountainValley:i,localVertices:e,materialConnected:s,necessaryGatesSatisfied:r,globalProof:"unsupported"}}function ef(t){if(t.faces.length<=1)return!0;const e=new Map(t.faces.map(s=>[s.id,new Set]));for(const s of t.edges){if(!["hinge","joined","flatSeam"].includes(s.kind)||s.halfEdges.length!==2)continue;const r=s.halfEdges.map(a=>t.halfEdges.find(o=>o.id===a)?.face);r[0]&&r[1]&&r[0]!==r[1]&&(e.get(r[0])?.add(r[1]),e.get(r[1])?.add(r[0]))}const n=new Set,i=[t.faces[0].id];for(;i.length;){const s=i.shift();n.has(s)||(n.add(s),i.push(...e.get(s)??[]))}return n.size===t.faces.length}function pu(t){const e=new Map(t.faces.map(i=>[i.id,new Set]));for(const i of t.edges){if(i.halfEdges.length!==2)continue;const s=i.halfEdges.map(r=>t.halfEdges.find(a=>a.id===r)).filter(r=>r!==void 0);s.length!==2||s[0].face===s[1].face||(e.get(s[0].face)?.add(s[1].face),e.get(s[1].face)?.add(s[0].face))}const n=new Map;for(const i of t.faces){if(n.has(i.id))continue;n.set(i.id,0);const s=[i.id];for(;s.length>0;){const r=s.shift(),a=n.get(r);for(const o of e.get(r)??[]){const c=a===0?1:0,l=n.get(o);if(l!==void 0){if(l!==c)return{colorable:!1,colors:n,conflict:[r,o]};continue}n.set(o,c),s.push(o)}}}return{colorable:!0,colors:n}}function mc(t){const e=tf(t);if(e)return{ok:!1,diagnostics:[e]};const n=t.stepCount*2+2,i=[],s=[],r=[],a=[],o=[],c=[],l=[],h=[],u=[],d=(t.hostWidth-t.width)/2,f=[0,d,d+t.width,t.hostWidth],p=n*t.stepRun,_=t.hostFloorExtent+t.hostWallExtent,m=-t.hostFloorExtent+(_-p)/2;for(let b=0;b<=n;b+=1)for(let P=0;P<f.length;P+=1)i.push({id:`v:${b}:${P}`,position:[f[P],m+b*t.stepRun]});for(let b=0;b<n;b+=1)for(let P=0;P<3;P+=1){const C=P===1?`stair-face:${b}`:`host-face:${b}:${P}`,I=`he:${b}:${P}:bottom`,X=`he:${b}:${P}:right`,W=`he:${b}:${P}:top`,D=`he:${b}:${P}:left`;r.push({id:I,origin:`v:${b}:${P}`,next:X,edge:"pending",face:C},{id:X,origin:`v:${b}:${P+1}`,next:W,edge:"pending",face:C},{id:W,origin:`v:${b+1}:${P+1}`,next:D,edge:"pending",face:C},{id:D,origin:`v:${b+1}:${P}`,next:I,edge:"pending",face:C}),s.push({id:C,boundary:I,holes:[]});const Y=P!==1||b===0?"host":b===n-1?"bridge":b%2===1?"step":"bridge";c.push({faceId:C,operationId:t.operationId,role:Y})}const g=new Map(r.map(b=>[b.id,b])),A=(b,P)=>{for(const C of b)g.get(C).edge=P.id;b.length===2&&(g.get(b[0]).twin=b[1],g.get(b[1]).twin=b[0]),a.push(P),l.push({edgeId:P.id,operationId:t.operationId})};for(let b=0;b<3;b+=1){A([`he:0:${b}:bottom`],{id:`boundary:bottom:${b}`,halfEdges:[`he:0:${b}:bottom`],kind:"boundary"}),A([`he:${n-1}:${b}:top`],{id:`boundary:top:${b}`,halfEdges:[`he:${n-1}:${b}:top`],kind:"boundary"});for(let P=1;P<n;P+=1){const C=[`he:${P-1}:${b}:top`,`he:${P}:${b}:bottom`];if(b===1){const I=P%2===0?"valley":"mountain";A(C,{id:`hinge:${P-1}`,halfEdges:C,kind:"hinge",hinge:{assignment:I,restAngle:0,angleRange:I==="valley"?[0,Math.PI]:[-Math.PI,0]}})}else P===n/2?A(C,{id:`host-hinge:${b}`,halfEdges:C,kind:"hinge",hinge:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}):A(C,{id:`seam:h:${P}:${b}`,halfEdges:C,kind:"flatSeam"})}}for(let b=0;b<n;b+=1){A([`he:${b}:0:left`],{id:`boundary:left:${b}`,halfEdges:[`he:${b}:0:left`],kind:"boundary"}),A([`he:${b}:2:right`],{id:`boundary:right:${b}`,halfEdges:[`he:${b}:2:right`],kind:"boundary"});for(let P=1;P<=2;P+=1){const C=`he:${b}:${P-1}:right`,I=`he:${b}:${P}:left`;if(b===0||b===n-1){A([C,I],{id:`seam:v:${b}:${P}`,halfEdges:[C,I],kind:"flatSeam"});continue}const W=`cut:${b}:${P}`,D=`${W}:a`,Y=`${W}:b`;A([C],{id:D,halfEdges:[C],kind:"cutBank",cutBank:{pair:W,bank:"a"}}),A([I],{id:Y,halfEdges:[I],kind:"cutBank",cutBank:{pair:W,bank:"b"}}),o.push({id:W,banks:[D,Y]});const V=Math.min(t.stepCount-1,Math.floor((b-1)/2));h.push({cutPairId:W,operationId:t.operationId,stepIndex:V}),b%2===1&&b<n-1&&u.push({voidId:`void:${b}:${P}`,stepIndex:V,cutPairIds:[W]})}}const w={schemaVersion:1,vertices:i,halfEdges:r,edges:a,faces:s,cutPairs:o,materialComponents:[{id:`stair-material:${t.operationId}`,faces:s.map(b=>b.id)}]},v=Ci(w);if(v.length>0)return{ok:!1,diagnostics:v};if(!pu(w).colorable)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_FLAT_COLORING_FAILED",message:"The stair crease graph is not two-colorable and cannot represent a flat origami sheet.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};if(!fu(w).materialConnected)return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:"The generated stair material is disconnected across its crease graph.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};const T=hu(w);if(!T.complete)return{ok:!1,diagnostics:[{severity:"error",category:"kinematics",code:"KINEMATICS_ASSIGNMENT_MISMATCH",message:`Flat stair crease graph has unassigned hinges: ${T.unassignedHingeIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]};const M=Qh(w);return M.certified?{ok:!0,complex:w,sourceMap:{operationId:t.operationId,host:{plane:t.hostPlane??"wall",width:t.hostWidth,extent:t.hostPlane==="floor"?t.hostFloorExtent:t.hostWallExtent},faces:c,edges:l,cutPairs:h,voids:u}}:{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"TOPOLOGY_CUT_PAIR_INVALID",message:`Stair cut graph contains unpaired cut banks: ${M.unpairedCutBankIds.join(", ")}.`,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId}}],entities:[{kind:"spatialOperation",id:t.operationId}]}]}}function tf(t){return typeof t.operationId=="string"&&t.operationId.length>0&&Number.isFinite(t.width)&&t.width>0&&Number.isInteger(t.stepCount)&&t.stepCount>0&&Number.isFinite(t.stepRun)&&t.stepRun>0&&Number.isFinite(t.stepRise)&&t.stepRise>0&&t.stepRun===t.stepRise&&Number.isFinite(t.hostWidth)&&t.hostWidth>=t.width&&Number.isFinite(t.hostFloorExtent)&&t.hostFloorExtent>=t.stepCount*t.stepRun&&Number.isFinite(t.hostWallExtent)&&t.hostWallExtent>=t.stepCount*t.stepRise?void 0:{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:t.stepRun!==t.stepRise?"Certified stairs require equal step run and rise.":"Stair dimensions must be positive and fit within the host sheet bounds.",locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t.operationId||"unknown"}}],entities:[{kind:"spatialOperation",id:t.operationId||"unknown"}]}}function kt(t,e){return[t[0]+e[0],t[1]+e[1],t[2]+e[2]]}function Ye(t,e){return[t[0]-e[0],t[1]-e[1],t[2]-e[2]]}function yt(t,e){return[t[0]*e,t[1]*e,t[2]*e]}function at(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function ds(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function ot(t){return Math.hypot(t[0],t[1],t[2])}function si(t){const e=ot(t);if(!Number.isFinite(e)||e===0)throw new RangeError("Axis must be finite and nonzero.");return yt(t,1/e)}function yi(t,e){return[at(t[0],e),at(t[1],e),at(t[2],e)]}function nf(t,e){const n=a=>[e[0][a],e[1][a],e[2][a]],i=n(0),s=n(1),r=n(2);return[[at(t[0],i),at(t[0],s),at(t[0],r)],[at(t[1],i),at(t[1],s),at(t[1],r)],[at(t[2],i),at(t[2],s),at(t[2],r)]]}function pt(t,e){return kt(yi(t.rotation,e),t.translation)}function Xt(t,e){return{rotation:nf(t.rotation,e.rotation),translation:kt(yi(t.rotation,e.translation),t.translation)}}function Ei(t){const e=[[t.rotation[0][0],t.rotation[1][0],t.rotation[2][0]],[t.rotation[0][1],t.rotation[1][1],t.rotation[2][1]],[t.rotation[0][2],t.rotation[1][2],t.rotation[2][2]]];return{rotation:e,translation:yt(yi(e,t.translation),-1)}}function $r(t){return{rotation:[[t.widthAxis[0],t.inPlaneAxis[0],t.normal[0]],[t.widthAxis[1],t.inPlaneAxis[1],t.normal[1]],[t.widthAxis[2],t.inPlaneAxis[2],t.normal[2]]],translation:t.origin}}function gc(t,e){return Xt($r(e),Ei($r(t)))}function sf(t,e){if(!Number.isFinite(e))throw new RangeError("Rotation angle must be finite.");const[n,i,s]=si(t),r=Math.cos(e),a=Math.sin(e),o=1-r;return[[r+n*n*o,n*i*o-s*a,n*s*o+i*a],[i*n*o+s*a,r+i*i*o,i*s*o-n*a],[s*n*o-i*a,s*i*o+n*a,r+s*s*o]]}function bi(t,e,n){const i=sf(e,n);return{rotation:i,translation:Ye(t,yi(i,t))}}function rf(t){if(![...t.rotation[0],...t.rotation[1],...t.rotation[2],...t.translation].every(Number.isFinite))return Number.POSITIVE_INFINITY;const[n,i,s]=t.rotation;return Math.max(Math.abs(at(n,n)-1),Math.abs(at(i,i)-1),Math.abs(at(s,s)-1),Math.abs(at(n,i)),Math.abs(at(n,s)),Math.abs(at(i,s)),Math.abs(at(n,ds(i,s))-1))}function $s(t,e=1e-9){const n=rf(t);return Number.isFinite(n)&&n<=e}function af(t,e,n=1e-9){const i=new Map(e.facePoses.map(o=>[o.faceId,o])),s=new Set;for(const o of t.edges){if(o.halfEdges.length!==2)continue;const c=o.halfEdges.map(l=>t.halfEdges.find(h=>h.id===l));!c[0]||!c[1]||c[0].face===c[1].face||s.add(rl(c[0].face,c[1].face))}const r=t.faces.flatMap(o=>{const c=i.get(o.id);if(!c)return[];const l=of(t,o).map(u=>pt(c.transform,u));if(l.length<3)return[];const h=si(ds(Ye(l[1],l[0]),Ye(l[2],l[0])));return[{face:o,points:l,normal:h}]}),a=[];for(let o=0;o<r.length;o+=1)for(let c=o+1;c<r.length;c+=1){const l=r[o],h=r[c];if(s.has(rl(l.face.id,h.face.id))||Math.abs(Math.abs(at(l.normal,h.normal))-1)>n||Math.abs(at(l.normal,Ye(h.points[0],l.points[0])))>n)continue;const u=cf(l.normal),d=l.points.map(p=>al(p,u)),f=h.points.map(p=>al(p,u));lf(d,f,n)&&a.push({firstFaceId:l.face.id,secondFaceId:h.face.id})}return a}function of(t,e){const n=[];let i=e.boundary;const s=new Set;for(;!s.has(i);){s.add(i);const r=t.halfEdges.find(o=>o.id===i);if(!r)break;const a=t.vertices.find(o=>o.id===r.origin);if(!a)break;n.push([a.position[0],a.position[1],0]),i=r.next}return n}function rl(t,e){return[t,e].sort().join("::")}function cf(t){const e=t.map(Math.abs);return e[0]>=e[1]&&e[0]>=e[2]?0:e[1]>=e[2]?1:2}function al(t,e){return e===0?[t[1],t[2]]:e===1?[t[0],t[2]]:[t[0],t[1]]}function lf(t,e,n){const i=ol(t),s=ol(e);if(Math.min(i.maxX,s.maxX)-Math.max(i.minX,s.minX)>n&&Math.min(i.maxY,s.maxY)-Math.max(i.minY,s.minY)>n||t.some(a=>Zs(a,e,n))||e.some(a=>Zs(a,t,n)))return!0;const r=a=>[a.reduce((o,c)=>o+c[0],0)/a.length,a.reduce((o,c)=>o+c[1],0)/a.length];if(Zs(r(t),e,n)||Zs(r(e),t,n))return!0;for(let a=0;a<t.length;a+=1){const o=t[a],c=t[(a+1)%t.length];for(let l=0;l<e.length;l+=1){const h=e[l],u=e[(l+1)%e.length];if(df(o,c,h,u,n))return!0}}return!1}function ol(t){return{minX:Math.min(...t.map(e=>e[0])),maxX:Math.max(...t.map(e=>e[0])),minY:Math.min(...t.map(e=>e[1])),maxY:Math.max(...t.map(e=>e[1]))}}function Zs(t,e,n){let i=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const a=e[s],o=e[r];if(Math.abs(ws(rn(o,a),rn(t,a)))<=n&&uf(rn(t,a),rn(t,o))<=n)return!1;a[1]>t[1]!=o[1]>t[1]&&t[0]<(o[0]-a[0])*(t[1]-a[1])/(o[1]-a[1])+a[0]&&(i=!i)}return i}function df(t,e,n,i,s){const r=ws(rn(e,t),rn(n,t)),a=ws(rn(e,t),rn(i,t)),o=ws(rn(i,n),rn(t,n)),c=ws(rn(i,n),rn(e,n));return(r>s&&a<-s||r<-s&&a>s)&&(o>s&&c<-s||o<-s&&c>s)}function rn(t,e){return[t[0]-e[0],t[1]-e[1]]}function ws(t,e){return t[0]*e[1]-t[1]*e[0]}function uf(t,e){return t[0]*e[0]+t[1]*e[1]}function tn(){return{rotation:[[1,0,0],[0,1,0],[0,0,1]],translation:[0,0,0]}}function hf(t,e,n=Number.POSITIVE_INFINITY,i=Number.POSITIVE_INFINITY){if(e.length<2)return ff("A folding map requires at least two ordered samples.");const s=t.faces.map(l=>l.id);let r=!0,a=!0,o=0,c=0;for(const l of e){const h=new Map(l.facePoses.map(u=>[u.faceId,u.transform]));for(const u of s){const d=h.get(u);(!d||!$s(d))&&(r=!1)}}for(let l=1;l<e.length;l+=1){const h=new Map(e[l-1].facePoses.map(_=>[_.faceId,_.transform])),u=new Map(e[l].facePoses.map(_=>[_.faceId,_.transform])),d=e[l-1].parameterValues.find(_=>_.parameterId==="deployment")?.value,f=e[l].parameterValues.find(_=>_.parameterId==="deployment")?.value,p=f!==void 0&&d!==void 0?Math.abs(f-d):0;for(const _ of t.faces){const m=h.get(_.id),g=u.get(_.id);if(!m||!g){a=!1;continue}let A=_.boundary;const w=new Set;for(;!w.has(A);){w.add(A);const v=t.halfEdges.find(y=>y.id===A),E=v?t.vertices.find(y=>y.id===v.origin):void 0;if(E){const y=[E.position[0],E.position[1],0];o=Math.max(o,ot(Ye(pt(g,y),pt(m,y)))),p>0&&(c=Math.max(c,o/p))}if(!v)break;A=v.next}}}return a=a&&(!Number.isFinite(n)||o<=n),{applicable:!0,continuous:a,rigid:r,sampleCount:e.length,uniformDisplacementResidual:o,maximumDisplacementRate:c,rateBounded:!Number.isFinite(i)||c<=i}}function ff(t){return{applicable:!1,continuous:!1,rigid:!1,sampleCount:0,uniformDisplacementResidual:Number.POSITIVE_INFINITY,maximumDisplacementRate:Number.POSITIVE_INFINITY,rateBounded:!1,reason:t}}function pf(t,e=Je.relativeRank){if(!Number.isFinite(e)||e<0)throw new RangeError("Rank tolerance must be finite and non-negative.");if(t.length===0)return{rank:0,threshold:0,acceptedPivots:[],rejectedMaximum:0};const n=t[0].length;if(t.some(l=>l.length!==n||l.some(h=>!Number.isFinite(h))))throw new RangeError("Rank matrix must be finite and rectangular.");const i=t.map(l=>[...l]),r=Math.max(0,...i.flat().map(l=>Math.abs(l)))*Math.max(t.length,n)*e,a=[];let o=0,c=0;for(let l=0;l<n&&c<i.length;l+=1){let h=c,u=Math.abs(i[h][l]);for(let f=c+1;f<i.length;f+=1){const p=Math.abs(i[f][l]);p>u&&(u=p,h=f)}if(u<=r){o=Math.max(o,u);continue}[i[c],i[h]]=[i[h],i[c]];const d=i[c][l];a.push(Math.abs(d));for(let f=l;f<n;f+=1)i[c][f]/=d;for(let f=0;f<i.length;f+=1){if(f===c)continue;const p=i[f][l];for(let _=l;_<n;_+=1)i[f][_]-=p*i[c][_]}c+=1}return{rank:c,threshold:r,acceptedPivots:a,rejectedMaximum:o}}function Ur(t,e,n={}){if(!Number.isInteger(e)||e<0)throw new RangeError("Variable count must be a non-negative integer.");const i=pf(t,n.relativeTolerance??Je.relativeRank),s=n.expectedRank;if(s!==void 0&&(!Number.isInteger(s)||s<0||s>e))throw new RangeError("Expected rank must fit the variable count.");return{...i,variableCount:e,dof:e-i.rank,...s===void 0?{}:{expectedRank:s},singular:s!==void 0&&i.rank<s}}function mf(t,e,n=t.map(()=>0)){return mu(t,e,n),t.reduce((i,s,r)=>{const a=bi([0,0,0],[0,0,1],e[r]),o=bi([0,0,0],[1,0,0],s),c={rotation:tn().rotation,translation:[n[r],0,0]},l=Xt(a,Xt(c,o));return Xt(i,l)},tn())}function cl(t,e,n){const i=mf(t,e,n),s=tn(),r=[];for(let a=0;a<3;a+=1)for(let o=0;o<3;o+=1)r.push(i.rotation[o][a]-s.rotation[o][a]);return r.push(...i.translation),r}function gf(t,e,n,i=1e-6){if(!Number.isFinite(i)||i<=0)throw new RangeError("Finite-difference step must be positive and finite.");mu(t,e,t.map(()=>0));const s=e.map((r,a)=>{const o=[...e],c=[...e];o[a]+=i,c[a]-=i;const l=cl(t,o,n),h=cl(t,c,n);return l.map((u,d)=>(u-h[d])/(2*i))});return Array.from({length:12},(r,a)=>s.map(o=>o[a]))}function mu(t,e,n){if(t.length===0||t.length!==e.length||t.length!==n.length)throw new RangeError("Sector and fold-angle arrays must have equal nonzero length.");if(t.some(i=>!Number.isFinite(i)||i<=0)||e.some(i=>!Number.isFinite(i))||n.some(i=>!Number.isFinite(i)))throw new RangeError("Sector and fold angles must be finite.")}function _f(t,e){const n=t.edges.filter(o=>o.kind==="hinge").map(o=>o.id).sort(),i=new Map(n.map((o,c)=>[o,c])),s=new Map(e?.hingeAngles.map(o=>[o.edgeId,o.angle])??[]),r=t.vertices.flatMap(o=>{const c=uu(t,o.id);return c.applicability==="applicable"?[{vertexId:o.id,extraction:c}]:[]});if(r.length===0||n.length===0)return{applicable:!1,vertexCount:r.length,hingeCount:n.length,jacobian:[],reason:"No all-hinge interior vertex network is available."};const a=[];for(const{extraction:o}of r){const c=o.rays.map(h=>s.get(h.edgeId)??0),l=gf(o.sectorAngles,c);for(const h of l){const u=Array.from({length:n.length},()=>0);o.rays.forEach((d,f)=>{const p=i.get(d.edgeId);p!==void 0&&(u[p]+=h[f])}),a.push(u)}}return{applicable:!0,vertexCount:r.length,hingeCount:n.length,jacobian:a,mobility:Ur(a,n.length)}}function xf(t,e,n=Je.absoluteLength){if(e.length<2)return Mf("A rigid-fold path requires at least two samples.");const i=t.faces.map(p=>p.id);let s=!0,r=!0,a=0,o=!0,c=0,l=!1;for(const p of e){const _=new Set(t.edges.filter(A=>A.kind==="hinge").map(A=>A.id)),m=new Set;for(const A of p.hingeAngles){const w=t.edges.find(T=>T.id===A.edgeId),v=w?.hinge?.angleRange,E=w?.hinge?.assignment,y=E==="mountain"?A.angle<=0:E==="valley"?A.angle>=0:!1;(m.has(A.edgeId)||!_.has(A.edgeId)||!Number.isFinite(A.angle)||!v||A.angle<v[0]||A.angle>v[1]||!y)&&(o=!1),m.add(A.edgeId)}const g=new Map(p.facePoses.map(A=>[A.faceId,A.transform]));for(const A of i){const w=g.get(A);(!w||!$s(w))&&(s=!1),w&&(c=Math.max(c,Sf(w.rotation)))}for(const A of t.edges.filter(w=>w.kind==="hinge")){if(A.halfEdges.length!==2){r=!1;continue}const w=A.halfEdges.map(T=>t.halfEdges.find(M=>M.id===T)).filter(T=>T!==void 0);if(w.length!==2){r=!1;continue}const v=g.get(w[0].face),E=g.get(w[1].face);if(!v||!E){r=!1;continue}const y=[w[0].origin,vf(t,w[0])];for(const T of y){const M=t.vertices.find(C=>C.id===T);if(!M){r=!1;continue}const b=[M.position[0],M.position[1],0],P=ot(Ye(pt(v,b),pt(E,b)));a=Math.max(a,P)}}}const h=e.map(p=>p.parameterValues.find(_=>_.parameterId==="deployment")?.value),u=h.every((p,_)=>_===0||p!==void 0&&h[_-1]!==void 0&&p>=h[_-1]),d=yf(t),f=_f(t,e[e.length-1]);for(let p=1;p<e.length;p+=1)JSON.stringify(e[p-1].facePoses)!==JSON.stringify(e[p].facePoses)&&(l=!0);return{applicable:!0,rigid:s,hingesCompatible:r&&a<=n,monotone:u,hingeStateValid:o,matrixCompatible:s&&c<=n,nontrivialMotion:l,maximumMatrixResidual:c,hingeGraphAcyclic:d,matrixCertificate:!s||!r||a>n?"invalid":d?"tree-exact":"cycle-closed",networkMobilityApplicable:f.applicable,...f.mobility?{networkDegreesOfFreedom:f.mobility.dof}:{},sampleCount:e.length,maximumHingeResidual:a}}function vf(t,e){return t.halfEdges.find(n=>n.id===e.next)?.origin??""}function Mf(t){return{applicable:!1,rigid:!1,hingesCompatible:!1,monotone:!1,hingeStateValid:!1,matrixCompatible:!1,nontrivialMotion:!1,maximumMatrixResidual:Number.POSITIVE_INFINITY,hingeGraphAcyclic:!1,matrixCertificate:"invalid",networkMobilityApplicable:!1,sampleCount:0,maximumHingeResidual:Number.POSITIVE_INFINITY,reason:t}}function yf(t){const e=new Map;for(const s of t.edges.filter(r=>r.kind==="hinge"&&r.halfEdges.length===2)){const r=s.halfEdges.map(a=>t.halfEdges.find(o=>o.id===a)?.face).filter(a=>a!==void 0);r.length===2&&(e.set(r[0],[...e.get(r[0])??[],r[1]]),e.set(r[1],[...e.get(r[1])??[],r[0]]))}const n=new Set,i=(s,r)=>{if(n.has(s))return!1;n.add(s);for(const a of e.get(s)??[])if(a!==r&&(n.has(a)||!i(a,s)))return!1;return!0};return[...e.keys()].every(s=>n.has(s)||i(s))}function Sf(t){let e=0;for(let n=0;n<3;n+=1)for(let i=0;i<3;i+=1){let s=0;for(let r=0;r<3;r+=1)s+=t[r][n]*t[r][i];e=Math.max(e,Math.abs(s-(n===i?1:0)))}return e}function gu(t,e,n=1e-9,i=Number.POSITIVE_INFINITY){if(e.length<2)return Ef("A configuration-space path requires at least two states.");const s=e.map(p=>p.parameterValues.find(_=>_.parameterId==="deployment")?.value),r=s.every(p=>p!==void 0&&Number.isFinite(p)),a=r&&s.every(p=>p>=-n&&p<=1+n),o=r&&s.every((p,_)=>_===0||p>=s[_-1]-n),c=r&&Math.abs(s[0]-0)<=n&&Math.abs(s[s.length-1]-1)<=n,l=r&&s.every((p,_)=>_===0||Math.abs(p-s[_-1])>n),h=r?Math.max(...s.slice(1).map((p,_)=>p-s[_])):Number.POSITIVE_INFINITY,u=!Number.isFinite(i)||h<=i+n,d=new Set(t.faces.map(p=>p.id)),f=e.every(p=>{const _=new Set(p.facePoses.map(m=>m.faceId));return _.size===d.size&&[...d].every(m=>_.has(m))});return{applicable:!0,ordered:o,coversEndpoints:c,uniqueParameters:l,withinDomain:a,maximumParameterStep:h,stepBounded:u,topologyStable:f,sampleCount:e.length}}function Ef(t){return{applicable:!1,ordered:!1,coversEndpoints:!1,uniqueParameters:!1,withinDomain:!1,maximumParameterStep:Number.POSITIVE_INFINITY,stepBounded:!1,topologyStable:!1,sampleCount:0,reason:t}}function bf(t,e,n=1e-8){const i=t.edges.filter(a=>a.kind==="hinge"||a.kind==="cutBank"||a.kind==="boundary").map(a=>a.id),s=t.edges.filter(a=>a.kind==="joined"||a.kind==="flatSeam").map(a=>a.id),r=new Set;for(const a of t.edges.filter(o=>o.kind==="joined"||o.kind==="flatSeam")){if(a.halfEdges.length!==2){r.add(a.id);continue}const o=a.halfEdges.map(c=>t.halfEdges.find(l=>l.id===c)?.face);if(!o[0]||!o[1]){r.add(a.id);continue}for(const c of e){const l=c.facePoses.find(u=>u.faceId===o[0])?.transform,h=c.facePoses.find(u=>u.faceId===o[1])?.transform;(!l||!h||Af(l,h)>n)&&r.add(a.id)}}return{controlled:r.size===0,declaredSingularEdgeIds:i,invalidSingularEdgeIds:[...r],smoothEdgeIds:s}}function Af(t,e){let n=Math.max(...t.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)n=Math.max(n,Math.abs(t.rotation[i][s]-e.rotation[i][s]));return n}function Tf(t,e,n=1e-8){if(e.length<2)return wf("Isometric recovery requires flat and deployed samples.");const i=new Map(e[0].facePoses.map(h=>[h.faceId,h.transform])),s=new Map(e[e.length-1].facePoses.map(h=>[h.faceId,h.transform]));let r=0,a=!0,o=!0;for(const h of t.faces){const u=_u(t,h.boundary),d=i.get(h.id),f=s.get(h.id);if(!d||!f){a=!1,o=!1;continue}for(const[_,m]of u){const g=t.vertices.find(y=>y.id===_),A=t.vertices.find(y=>y.id===m);if(!g||!A){a=!1;continue}const w=[g.position[0],g.position[1],0],v=[A.position[0],A.position[1],0],E=ot(Ye(v,w));for(const y of e){const T=y.facePoses.find(C=>C.faceId===h.id)?.transform;if(!T){a=!1;continue}const M=pt(T,w),b=pt(T,v),P=ot(Ye(b,M));r=Math.max(r,Math.abs(E-P))}}const p=d.rotation.every((_,m)=>_.every((g,A)=>Math.abs(g-(m===A?1:0))<=n))&&Math.abs(d.translation[0])<=n&&Math.abs(d.translation[1])<=n&&Math.abs(d.translation[2])<=n;o=o&&p}a=a&&r<=n;const c=t.faces.filter(h=>Rf(t,h.boundary)<=n).map(h=>h.id),l=bf(t,e,n);return{applicable:!0,piecewiseIsometric:a&&c.length===0&&l.controlled,recoversFlatPattern:o,maximumEdgeResidual:r,singularFaceIds:c,controlledSingularSet:l.controlled,invalidSingularEdgeIds:l.invalidSingularEdgeIds}}function _u(t,e){const n=[];let i=e;const s=new Set;for(;!s.has(i);){s.add(i);const r=t.halfEdges.find(o=>o.id===i);if(!r)break;const a=t.halfEdges.find(o=>o.id===r.next);if(!a)break;n.push([r.origin,a.origin]),i=r.next}return n}function wf(t){return{applicable:!1,piecewiseIsometric:!1,recoversFlatPattern:!1,maximumEdgeResidual:Number.POSITIVE_INFINITY,singularFaceIds:[],controlledSingularSet:!1,invalidSingularEdgeIds:[],reason:t}}function Rf(t,e){const n=_u(t,e).map(([s])=>t.vertices.find(r=>r.id===s)?.position).filter(s=>s!==void 0);let i=0;for(let s=0;s<n.length;s+=1){const r=n[s],a=n[(s+1)%n.length];i+=r[0]*a[1]-a[0]*r[1]}return Math.abs(i)/2}function Cf(t,e,n,i=1e-6){if(!Number.isFinite(n)||n<=0||!Number.isFinite(i)||i<=0)return ll(n,i,"Lipschitz bound and epsilon must be positive and finite.");const s=new Set(t.faces.map(o=>o.id));for(const o of[0,.5,1]){const c=e(o),l=new Map(c.facePoses.map(h=>[h.faceId,h.transform]));if(l.size!==s.size||[...s].some(h=>!l.has(h))||[...l.values()].some(h=>!$s(h)))return ll(n,i,"Analytic path witnesses do not preserve the complete rigid face set.")}const r=Math.max(1,Math.ceil(n/i)),a=n/r;return{certified:a<=i,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!0,uniformlyConvergent:!0,lipschitzBound:n,epsilon:i,requiredSubdivisionCount:r,certifiedUniformErrorBound:a}}function ll(t,e,n){return{certified:!1,proof:"analytic-lipschitz",construction:"affine-trigonometric-rigid-composition",continuous:!1,uniformlyConvergent:!1,lipschitzBound:t,epsilon:e,requiredSubdivisionCount:0,certifiedUniformErrorBound:Number.POSITIVE_INFINITY,reason:n}}function Pf(t,e,n){const i=Ci(t).length===0,s=fu(t),r=t.faces.reduce((l,h)=>l+h.holes.length,0),a=t.faces.every(l=>l.holes.every(h=>t.halfEdges.some(u=>u.id===h&&u.face===l.id))),o=n.applicable&&n.rigid&&n.hingesCompatible&&n.matrixCompatible,c=i&&s.necessaryGatesSatisfied&&s.materialConnected&&a&&o&&e.certified&&e.continuous&&e.uniformlyConvergent;return{certified:c,proof:c?"analytic-global-map":"unsupported",topologyValid:i,necessaryGatesSatisfied:s.necessaryGatesSatisfied,materialConnected:s.materialConnected,holesTracked:a,holeBoundaryCount:r,hingeContinuous:o,analyticContinuous:e.continuous,...c?{}:{reason:"A global certificate requires valid connected topology, all Chapter 5–6 gates, continuous hinges, tracked holes, and an analytic convergent map."}}}function If(t,e,n,i,s,r=1e-8){const a=gu(t,e),o=[],c=[];for(const d of t.edges.filter(f=>f.kind==="hinge"&&f.halfEdges.length===2)){const f=d.halfEdges.map(_=>t.halfEdges.find(m=>m.id===_)?.face);(e.some(_=>{const m=_.facePoses.find(A=>A.faceId===f[0])?.transform,g=_.facePoses.find(A=>A.faceId===f[1])?.transform;return!m||!g||Lf(m,g)>r})?o:c).push(d.id)}const h=a.applicable&&a.ordered&&a.coversEndpoints&&a.uniqueParameters&&a.withinDomain&&a.stepBounded&&a.topologyStable&&n.certified&&n.continuous&&n.uniformlyConvergent&&i.applicable&&i.rigid&&i.hingesCompatible&&i.matrixCompatible&&s.certified,u=h&&i.nontrivialMotion&&o.length>0;return{certified:h,proof:h?"analytic-configuration-path":"unsupported",selfFoldable:u,activeCreaseIds:o,optionalCreaseIds:c,path:a,...h?{}:{reason:"Configuration certification requires an ordered complete analytic path with rigid/global certificates."}}}function Lf(t,e){let n=Math.max(...t.translation.map((i,s)=>Math.abs(i-e.translation[s])));for(let i=0;i<3;i+=1)for(let s=0;s<3;s+=1)n=Math.max(n,Math.abs(t.rotation[i][s]-e.rotation[i][s]));return n}function _c(t){if(!Number.isInteger(t.sampleCount)||t.sampleCount<2||t.sampleCount>1001)return{ok:!1,diagnostics:[xn("Path sample count must be an integer in [2, 1001].",t.input.operationId)]};const e=[...t.complex.edges].filter(_=>_.kind==="hinge"),n=[],i=8,s=(t.sampleCount-1)*i+1;for(let _=0;_<s;_+=1){const m=_/(s-1),g=dl(t.input,t.complex,t.sourceMap,m);if(!g)return{ok:!1,diagnostics:[xn("Stair hinge chain is missing or disconnected.",t.input.operationId)]};const A={id:`${t.input.operationId}:path:${_}`,facePoses:[...g.entries()].map(([v,E])=>({faceId:v,transform:E}))},w=af(t.complex,A);if(w.length>0)return{ok:!1,diagnostics:[xn(`Stair deployment sample ${_} has non-adjacent face overlap: ${w.map(v=>`${v.firstFaceId}:${v.secondFaceId}`).join(", ")}.`,t.input.operationId,_,m)]};_%i===0&&n.push({parameter:m,transforms:g})}const r=hf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:folding-map:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!r.applicable||!r.rigid||!r.continuous)return{ok:!1,diagnostics:[xn(r.reason??"Stair folding map failed topology, rigidity, or continuity validation.",t.input.operationId)]};const a=xf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:rigid:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!a.applicable||!a.rigid||!a.hingesCompatible||!a.monotone||!a.hingeStateValid||!a.matrixCompatible)return{ok:!1,diagnostics:[xn(a.reason??"Stair path failed rigid-foldability compatibility checks.",t.input.operationId)]};const o=gu(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:configuration:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),1e-9,1/(t.sampleCount-1));if(!o.applicable||!o.ordered||!o.coversEndpoints||!o.uniqueParameters||!o.withinDomain||!o.stepBounded||!o.topologyStable)return{ok:!1,diagnostics:[xn(o.reason??"Stair path failed configuration-space checks.",t.input.operationId)]};const c=Tf(t.complex,n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:isometric:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})));if(!c.applicable||!c.piecewiseIsometric||!c.recoversFlatPattern)return{ok:!1,diagnostics:[xn(c.reason??"Stair path failed piecewise-isometric recovery checks.",t.input.operationId)]};const l=Math.hypot(t.input.width,t.input.stepCount*t.input.stepRun),h=Math.max(1,e.length*Math.PI/2*l),u=Cf(t.complex,_=>{const m=dl(t.input,t.complex,t.sourceMap,_);if(!m)throw new Error("Validated stair hinge chain became unavailable.");return{schemaVersion:1,id:`${t.input.operationId}:analytic:${_}`,parameterValues:[{parameterId:"deployment",value:_}],facePoses:[...m.entries()].map(([g,A])=>({faceId:g,transform:A})),hingeAngles:[]}},h);if(!u.certified)return{ok:!1,diagnostics:[xn(u.reason??"Stair path failed analytic folding-map certification.",t.input.operationId)]};const d=Pf(t.complex,u,a);if(!d.certified||d.proof!=="analytic-global-map")return{ok:!1,diagnostics:[xn(d.reason??"Stair path failed global folding-map certification.",t.input.operationId)]};const f=n.map(_=>({schemaVersion:1,id:`${t.input.operationId}:configuration-certificate:${_.parameter}`,parameterValues:[{parameterId:"deployment",value:_.parameter}],facePoses:[..._.transforms.entries()].map(([m,g])=>({faceId:m,transform:g})),hingeAngles:[]})),p=If(t.complex,f,u,a,d);return!p.certified||!p.selfFoldable||p.proof!=="analytic-configuration-path"?{ok:!1,diagnostics:[xn(p.reason??"Stair path failed configuration-space certification.",t.input.operationId)]}:{ok:!0,samples:n,evidence:{classification:"certifiedRigidPath",foldingMap:{continuous:r.continuous,rigid:r.rigid,sampleCount:r.sampleCount,maximumDisplacement:r.uniformDisplacementResidual},rigidFoldability:{rigid:a.rigid,hingesCompatible:a.hingesCompatible,monotone:a.monotone,maximumHingeResidual:a.maximumHingeResidual,matrixCompatible:a.matrixCompatible,nontrivialMotion:a.nontrivialMotion,maximumMatrixResidual:a.maximumMatrixResidual},configurationSpace:{ordered:o.ordered,coversEndpoints:o.coversEndpoints,uniqueParameters:o.uniqueParameters,withinDomain:o.withinDomain,maximumParameterStep:o.maximumParameterStep,stepBounded:o.stepBounded,topologyStable:o.topologyStable},isometricRecovery:{piecewiseIsometric:c.piecewiseIsometric,recoversFlatPattern:c.recoversFlatPattern,maximumEdgeResidual:c.maximumEdgeResidual,controlledSingularSet:c.controlledSingularSet,invalidSingularEdgeIds:c.invalidSingularEdgeIds},analyticFoldingMap:{proof:u.proof,continuous:u.continuous,uniformlyConvergent:u.uniformlyConvergent,lipschitzBound:u.lipschitzBound,requiredSubdivisionCount:u.requiredSubdivisionCount,certifiedUniformErrorBound:u.certifiedUniformErrorBound},globalFoldingMap:{proof:d.proof,topologyValid:d.topologyValid,necessaryGatesSatisfied:d.necessaryGatesSatisfied,materialConnected:d.materialConnected,holesTracked:d.holesTracked,hingeContinuous:d.hingeContinuous},configurationCertificate:{proof:p.proof,selfFoldable:p.selfFoldable,activeCreaseIds:p.activeCreaseIds,optionalCreaseIds:p.optionalCreaseIds},verification:{method:"adaptive-sampled",sampleCount:s,maxParameterStep:1/i,collisionCheck:"coplanar-positive-area"}}}}function dl(t,e,n,i){const s=new Map,r=new Map(e.vertices.map(d=>[d.id,d])),a=t.stepCount*2+2,o=a/2,c=r.get(`v:${o}:0`)?.position[1];if(c===void 0)return;const l=-1,h=bi([0,c,0],[t.hostWidth,0,0],l*-i*Math.PI/2);for(const d of n.faces.filter(f=>f.faceId.startsWith("host-face:"))){const f=/^host-face:(\d+):(\d+)$/.exec(d.faceId);if(!f)return;const p=Number(f[1]);s.set(d.faceId,p<o?tn():h)}let u=tn();for(let d=0;d<a;d+=1){if(s.set(`stair-face:${d}`,u),d>=a-1)continue;const f=e.edges.find(y=>y.id===`hinge:${d}`);if(!f||f.halfEdges.length!==2)return;const p=r.get(`v:${d+1}:1`)?.position,_=r.get(`v:${d+1}:2`)?.position;if(!p||!_)return;const m=[p[0],p[1],0],g=[_[0],_[1],0],A=pt(u,m),w=pt(u,g),v=[w[0]-A[0],w[1]-A[1],w[2]-A[2]],E=f.hinge?.assignment==="mountain"?-1:1;u=Xt(bi(A,v,l*E*i*Math.PI/2),u)}if(s.size===e.faces.length)return s}function xn(t,e,n,i){return{severity:"error",category:"path",code:n===void 0?"PATH_POPUP_SAMPLE_COUNT_INVALID":"PATH_COLLISION_DETECTED",message:t,locations:n===void 0?[{kind:"entity",entity:{kind:"spatialOperation",id:e}}]:[{kind:"sample",index:n,parameter:i},{kind:"entity",entity:{kind:"spatialOperation",id:e}}],entities:[{kind:"spatialOperation",id:e}]}}const Df=1,Nf="hinge-flat",Ff="Flat canonical hinge",Uf="boundary",Of="single-hinge",kf="meter-radian",Bf=["Ideal zero-thickness rigid faces"],Vf="docs/single-hinge-specification.md",zf=1e-12,Hf="singleHinge",Gf={assignment:"valley",angle:0},Wf={ok:!0,childPoint:[2,0,0],classification:"certifiedRigidPath"},$f={schemaVersion:Df,id:Nf,title:Ff,fixtureClass:Uf,mechanismFamily:Of,units:kf,assumptions:Bf,provenance:Vf,tolerance:zf,kind:Hf,input:Gf,expected:Wf},Xf=1,Yf="hinge-intermediate",qf="Intermediate canonical hinge",Kf="valid",Zf="single-hinge",Jf="meter-radian",jf=["Ideal zero-thickness rigid faces"],Qf="docs/single-hinge-specification.md",ep=1e-12,tp="singleHinge",np={assignment:"valley",angle:1.0471975511965976},ip={ok:!0,childPoint:[1.5,0,-.8660254037844386],classification:"certifiedRigidPath"},sp={schemaVersion:Xf,id:Yf,title:qf,fixtureClass:Kf,mechanismFamily:Zf,units:Jf,assumptions:jf,provenance:Qf,tolerance:ep,kind:tp,input:np,expected:ip},rp=1,ap="hinge-folded",op="Quarter-turn canonical hinge",cp="valid",lp="single-hinge",dp="meter-radian",up=["Ideal zero-thickness rigid faces"],hp="docs/single-hinge-specification.md",fp=1e-12,pp="singleHinge",mp={assignment:"valley",angle:1.5707963267948966},gp={ok:!0,childPoint:[1,0,-1],classification:"certifiedRigidPath"},_p={schemaVersion:rp,id:ap,title:op,fixtureClass:cp,mechanismFamily:lp,units:dp,assumptions:up,provenance:hp,tolerance:fp,kind:pp,input:mp,expected:gp},xp=1,vp="hinge-assignment-invalid",Mp="Valley hinge rejects a negative angle",yp="invalid",Sp="single-hinge",Ep="meter-radian",bp=["Positive angles are valley folds"],Ap="docs/single-hinge-specification.md",Tp=1e-12,wp="singleHinge",Rp={assignment:"valley",angle:-.5},Cp={ok:!1,diagnosticCodes:["KINEMATICS_ANGLE_OUT_OF_RANGE","KINEMATICS_ASSIGNMENT_MISMATCH"]},Pp={schemaVersion:xp,id:vp,title:Mp,fixtureClass:yp,mechanismFamily:Sp,units:Ep,assumptions:bp,provenance:Ap,tolerance:Tp,kind:wp,input:Rp,expected:Cp},Ip=1,Lp="vertex-valid-3m1v",Dp="Four-crease vertex satisfying Kawasaki and Maekawa",Np="valid",Fp="single-vertex",Up="meter-radian",Op=["Interior crease-only vertex"],kp="docs/mathematical-contract.md#37-local-flat-foldability",Bp=1e-12,Vp="singleVertex",zp={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","mountain","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},Hp={kawasaki:"satisfied",maekawa:"satisfied",locallyFlatFoldable:!0},Gp={schemaVersion:Ip,id:Lp,title:Dp,fixtureClass:Np,mechanismFamily:Fp,units:Up,assumptions:Op,provenance:kp,tolerance:Bp,kind:Vp,input:zp,expected:Hp},Wp=1,$p="vertex-invalid-2m2v",Xp="Four-crease vertex failing Maekawa",Yp="invalid",qp="single-vertex",Kp="meter-radian",Zp=["Interior crease-only vertex"],Jp="docs/mathematical-contract.md#37-local-flat-foldability",jp=1e-12,Qp="singleVertex",em={sectorAngles:[1.5707963267948966,1.5707963267948966,1.5707963267948966,1.5707963267948966],assignments:["mountain","valley","mountain","valley"],paper:{width:2,height:2,center:[0,0]}},tm={kawasaki:"satisfied",maekawa:"failed",locallyFlatFoldable:!1},nm={schemaVersion:Wp,id:$p,title:Xp,fixtureClass:Yp,mechanismFamily:qp,units:Kp,assumptions:Zp,provenance:Jp,tolerance:jp,kind:Qp,input:em,expected:tm},im=1,sm="popup-symmetric",rm="Symmetric axis-aligned two-plane pop-up",am="valid",om="two-plane-pop-up",cm="meter-radian",lm=["Ideal zero-thickness rigid linkage"],dm="docs/mathematical-contract.md#4-two-plane-pop-up-family",um=1e-10,hm="twoPlanePopUp",fm={id:"popup-symmetric",width:2,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},pm={ok:!0,deployedJunction:[0,1,1],axisAligned:!0,classification:"certifiedRigidPath"},mm={schemaVersion:im,id:sm,title:rm,fixtureClass:am,mechanismFamily:om,units:cm,assumptions:lm,provenance:dm,tolerance:um,kind:hm,input:fm,expected:pm},gm=1,_m="popup-unequal",xm="Unequal-link rotated two-plane pop-up",vm="valid",Mm="two-plane-pop-up",ym="meter-radian",Sm=["Unequal links may rotate the child frame"],Em="docs/mathematical-contract.md#4-two-plane-pop-up-family",bm=1e-10,Am="twoPlanePopUp",Tm={id:"popup-unequal",width:2,height:1,depth:2,deployedAngle:1.5707963267948966,sampleCount:7},wm={ok:!0,deployedJunction:[0,.8,1.6],axisAligned:!1,classification:"certifiedRigidPath"},Rm={schemaVersion:gm,id:_m,title:xm,fixtureClass:vm,mechanismFamily:Mm,units:ym,assumptions:Sm,provenance:Em,tolerance:bm,kind:Am,input:Tm,expected:wm},Cm=1,Pm="popup-invalid-width",Im="Two-plane pop-up rejects zero width",Lm="invalid",Dm="two-plane-pop-up",Nm="meter-radian",Fm=["Mechanism dimensions must be positive"],Um="docs/mathematical-contract.md#4-two-plane-pop-up-family",Om=1e-10,km="twoPlanePopUp",Bm={id:"popup-invalid-width",width:0,height:1,depth:1,deployedAngle:1.5707963267948966,sampleCount:7},Vm={ok:!1,diagnosticCodes:["MECHANISM_POPUP_INVALID_PARAMETER"]},zm={schemaVersion:Cm,id:Pm,title:Im,fixtureClass:Lm,mechanismFamily:Dm,units:Nm,assumptions:Fm,provenance:Um,tolerance:Om,kind:km,input:Bm,expected:Vm},Hm=1,Gm="spatial-root",Wm="One root plane pair",$m="valid",Xm="nested-parallel-strip",Ym="meter-radian",qm=["Two-level synchronized strip family"],Km="docs/mathematical-contract.md#5-composition-contract",Zm=1e-10,Jm="spatialProgram",jm={schemaVersion:1,id:"spatial-root",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Qm={ok:!0,classification:"certifiedRigidPath"},eg={schemaVersion:Hm,id:Gm,title:Wm,fixtureClass:$m,mechanismFamily:Xm,units:Ym,assumptions:qm,provenance:Km,tolerance:Zm,kind:Jm,input:jm,expected:Qm},tg=1,ng="spatial-nested-shelf",ig="Root plane pair with nested shelf",sg="valid",rg="nested-parallel-strip",ag="meter-radian",og=["Two-level synchronized strip family"],cg="docs/mathematical-contract.md#5-composition-contract",lg=1e-10,dg="spatialProgram",ug={schemaVersion:1,id:"spatial-nested-shelf",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:3,height:1.5,depth:1.5,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"shelf",kind:"shelf",target:{kind:"generatedPair",operationId:"root"},xOffset:.5,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},hg={ok:!0,classification:"certifiedRigidPath"},fg={schemaVersion:tg,id:ng,title:ig,fixtureClass:sg,mechanismFamily:rg,units:ag,assumptions:og,provenance:cg,tolerance:lg,kind:dg,input:ug,expected:hg},pg=1,mg="spatial-siblings",gg="Disjoint sibling plane pairs",_g="valid",xg="nested-parallel-strip",vg="meter-radian",Mg=["Sibling strip interiors are disjoint"],yg="docs/mathematical-contract.md#5-composition-contract",Sg=1e-10,Eg="spatialProgram",bg={schemaVersion:1,id:"spatial-siblings",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:7,operations:[{id:"left",kind:"wall",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"right",kind:"platform",target:{kind:"sheet"},xOffset:4,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},Ag={ok:!0,classification:"certifiedRigidPath"},Tg={schemaVersion:pg,id:mg,title:gg,fixtureClass:_g,mechanismFamily:xg,units:vg,assumptions:Mg,provenance:yg,tolerance:Sg,kind:Eg,input:bg,expected:Ag},wg=1,Rg="spatial-overlap",Cg="Overlapping siblings are rejected",Pg="invalid",Ig="nested-parallel-strip",Lg="meter-radian",Dg=["Sibling strip interiors must be disjoint"],Ng="docs/mathematical-contract.md#5-composition-contract",Fg=1e-10,Ug="spatialProgram",Og={schemaVersion:1,id:"spatial-overlap",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"a",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"b",kind:"planePair",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},kg={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OVERLAP"]},Bg={schemaVersion:wg,id:Rg,title:Cg,fixtureClass:Pg,mechanismFamily:Ig,units:Lg,assumptions:Dg,provenance:Ng,tolerance:Fg,kind:Ug,input:Og,expected:kg},Vg=1,zg="spatial-depth-three",Hg="Depth-three hierarchy is rejected",Gg="unsupported",Wg="nested-parallel-strip",$g="meter-radian",Xg=["Only root and child module levels are supported"],Yg="docs/mathematical-contract.md#5-composition-contract",qg=1e-10,Kg="spatialProgram",Zg={schemaVersion:1,id:"spatial-depth-three",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"root",kind:"planePair",target:{kind:"sheet"},xOffset:0,width:3,height:2,depth:2,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"child",kind:"planePair",target:{kind:"generatedPair",operationId:"root"},xOffset:0,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"},{id:"grandchild",kind:"planePair",target:{kind:"generatedPair",operationId:"child"},xOffset:0,width:1,height:.5,depth:.5,alignment:"axisAligned",mismatchPolicy:"reject"}]},Jg={ok:!1,diagnosticCodes:["SPATIAL_TARGET_DEPTH_UNSUPPORTED"]},jg={schemaVersion:Vg,id:zg,title:Hg,fixtureClass:Gg,mechanismFamily:Wg,units:$g,assumptions:Xg,provenance:Yg,tolerance:qg,kind:Kg,input:Zg,expected:Jg},Qg=1,e_="spatial-opening",t_="Opening is explicitly unsupported",n_="unsupported",i_="bounded-spatial-compiler",s_="meter-radian",r_=["Subtractive topology is not certified"],a_="docs/mathematical-contract.md#51-bounded-spatial-compilation",o_=1e-10,c_="spatialProgram",l_={schemaVersion:1,id:"spatial-opening",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"door",kind:"opening",target:{kind:"sheet"},xOffset:1,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},d_={ok:!1,diagnosticCodes:["SPATIAL_OPERATION_UNSUPPORTED"]},u_={schemaVersion:Qg,id:e_,title:t_,fixtureClass:n_,mechanismFamily:i_,units:s_,assumptions:r_,provenance:a_,tolerance:o_,kind:c_,input:l_,expected:d_},h_=1,f_="spatial-out-of-bounds",p_="Attachment outside the sheet is rejected",m_="invalid",g_="nested-parallel-strip",__="meter-radian",x_=["Attachments must fit their host material"],v_="docs/mathematical-contract.md#5-composition-contract",M_=1e-10,y_="spatialProgram",S_={schemaVersion:1,id:"spatial-out-of-bounds",sheet:{id:"sheet",width:6,wallExtent:3,floorExtent:3,deployedAngle:1.5707963267948966},pathSampleCount:5,operations:[{id:"outside",kind:"planePair",target:{kind:"sheet"},xOffset:5,width:2,height:1,depth:1,alignment:"axisAligned",mismatchPolicy:"reject"}]},E_={ok:!1,diagnosticCodes:["ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS"]},b_={schemaVersion:h_,id:f_,title:p_,fixtureClass:m_,mechanismFamily:g_,units:__,assumptions:x_,provenance:v_,tolerance:M_,kind:y_,input:S_,expected:E_};function xc(t){const e=t==="valley"?[0,Math.PI]:[-Math.PI,0];return{schemaVersion:1,vertices:[{id:"v0",position:[0,0]},{id:"v1",position:[1,0]},{id:"v2",position:[2,0]},{id:"v3",position:[2,1]},{id:"v4",position:[1,1]},{id:"v5",position:[0,1]}],halfEdges:[{id:"hl0",origin:"v0",next:"hl1",edge:"e0",face:"left"},{id:"hl1",origin:"v1",next:"hl2",twin:"hr3",edge:"hinge",face:"left"},{id:"hl2",origin:"v4",next:"hl3",edge:"e1",face:"left"},{id:"hl3",origin:"v5",next:"hl0",edge:"e2",face:"left"},{id:"hr0",origin:"v1",next:"hr1",edge:"e3",face:"right"},{id:"hr1",origin:"v2",next:"hr2",edge:"e4",face:"right"},{id:"hr2",origin:"v3",next:"hr3",edge:"e5",face:"right"},{id:"hr3",origin:"v4",next:"hr0",twin:"hl1",edge:"hinge",face:"right"}],edges:[{id:"e0",halfEdges:["hl0"],kind:"boundary"},{id:"e1",halfEdges:["hl2"],kind:"boundary"},{id:"e2",halfEdges:["hl3"],kind:"boundary"},{id:"e3",halfEdges:["hr0"],kind:"boundary"},{id:"e4",halfEdges:["hr1"],kind:"boundary"},{id:"e5",halfEdges:["hr2"],kind:"boundary"},{id:"hinge",halfEdges:["hl1","hr3"],kind:"hinge",hinge:{assignment:t,restAngle:0,angleRange:e}}],faces:[{id:"left",boundary:"hl0",holes:[]},{id:"right",boundary:"hr0",holes:[]}],cutPairs:[],materialComponents:[{id:"sheet",faces:["left","right"]}]}}function xu(t){return vc(t?.id)&&vu(t?.material)&&Ai(t?.panelThickness)&&T_(t?.crease)&&w_(t?.contact)?[]:[Mu("MECHANICS_PROFILE_INVALID","Mechanics profiles require valid SI material, thickness, crease, and contact parameters.",t?.id??"unknown")]}function A_(t){return vc(t?.id)&&ti(t?.kerf)&&ti(t?.lengthTolerance)&&ti(t?.angleTolerance)&&t.angleTolerance<Math.PI&&Ai(t?.minimumFeatureWidth)&&Ai(t?.minimumBridgeWidth)&&ti(t?.nominalCreaseWidth)?[]:[Mu("FABRICATION_PROFILE_INVALID","Fabrication profiles require finite non-negative tolerances and positive feature and bridge widths.",t?.id??"unknown")]}function vu(t){return vc(t?.id)&&Ai(t?.density)&&Ai(t?.youngModulus)&&Number.isFinite(t?.poissonRatio)&&t.poissonRatio>-1&&t.poissonRatio<.5}function T_(t){return t?.model==="concentratedHinge"?ti(t.rotationalStiffness):t?.model==="compliantStrip"&&Ai(t.width)&&Ai(t.thickness)&&vu(t.material)}function w_(t){return["disabled","frictionless","coulomb"].includes(t?.mode)&&ti(t?.clearance)&&ti(t?.collisionMargin)&&ti(t?.frictionCoefficient)&&Number.isFinite(t?.restitution)&&t.restitution>=0&&t.restitution<=1&&(t.mode==="coulomb"||t.frictionCoefficient===0)}function Ai(t){return Number.isFinite(t)&&t>0}function ti(t){return Number.isFinite(t)&&t>=0}function vc(t){return typeof t=="string"&&t.length>0}function Mu(t,e,n){return{severity:"error",category:"mechanics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"physicalProfile",id:n}}],entities:[{kind:"physicalProfile",id:n}]}}function Os(t,e){const n=lo(t,e.halfEdges[0]),i=lo(t,n.next);return[n.origin,i.origin]}function Mc(t,e){const n=[],i=new Set;let s=e.boundary;for(;!i.has(s);){i.add(s);const r=lo(t,s);n.push(r.origin),s=r.next}if(s!==e.boundary)throw new Error(`Face ${e.id} boundary is not a closed loop.`);return n}function lo(t,e){const n=t.halfEdges.find(i=>i.id===e);if(!n)throw new Error(`Missing half-edge ${e}.`);return n}function yu(t,e){const n=new Map(t.vertices.map((s,r)=>[s.id,r])),i=new Map([]);return{file_spec:1.2,file_creator:"Kirigami Spatial Engine",file_classes:["singleModel"],frame_classes:["creasePattern"],file_units:"m",vertices_coords:t.vertices.map(s=>s.position),edges_vertices:t.edges.map(s=>{const[r,a]=Os(t,s),o=n.get(r),c=n.get(a);if(o===void 0||c===void 0)throw new Error(`Edge ${s.id} references a missing vertex.`);return[o,c]}),edges_assignment:t.edges.map(R_),edges_foldAngle:t.edges.map(s=>s.kind==="flatSeam"||s.kind==="joined"?0:s.kind!=="hinge"?null:(i.get(s.id)??s.hinge?.restAngle??0)*180/Math.PI),faces_vertices:t.faces.map(s=>Mc(t,s).map(r=>{const a=n.get(r);if(a===void 0)throw new Error(`Face ${s.id} references a missing vertex.`);return a}))}}function R_(t){switch(t.kind){case"boundary":return"B";case"cutBank":return"C";case"hinge":return C_(t.hinge?.assignment??"unassigned");case"joined":case"flatSeam":return"F"}}function C_(t){return t==="mountain"?"M":t==="valley"?"V":"U"}function P_(t,e){return!Number.isFinite(e?.foldPercent)||e.foldPercent<-1||e.foldPercent>1||!I_(e.axialStiffness)||!ul(e.faceStiffness)||!ul(e.creaseStiffness)||typeof e.calculateFaceStrain!="boolean"?L_(t.definition.id,"OrigamiSimulator controls require foldPercent in [-1, 1], positive axial stiffness, and non-negative face and crease stiffness."):{ok:!0,job:{schemaVersion:1,id:`origami-simulator-job:${t.definition.id}`,subjectId:t.definition.id,backend:"origamiSimulator",capabilities:["foldPreview","approximateStrain"],fold:yu(t.complex),controls:{...e}}}}function I_(t){return Number.isFinite(t)&&t>0}function ul(t){return Number.isFinite(t)&&t>=0}function L_(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"mechanics",code:"SIMULATION_JOB_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function D_(t,e,n,i){const s=xu(e);if(s.length>0)return{ok:!1,diagnostics:s};if(!N_(n))return hl(t.definition.id,"PyKirigami options require finite bounded timestep, damping, stiffness, ERP, substeps, and maximum steps.");const r=t.complex.edges.find(u=>u.kind==="hinge"&&u.hinge?.assignment==="unassigned");if(r)return hl(t.definition.id,`PyKirigami finite-thickness hinge ${r.id} requires a mountain or valley side.`);const a=new Map(t.complex.vertices.map(u=>[u.id,u.position])),o=t.complex.faces.map(u=>Mc(t.complex,u)),c=new Map(t.complex.faces.map((u,d)=>[u.id,d])),l=new Map(t.complex.halfEdges.map(u=>[u.id,u])),h=[];for(const u of t.complex.edges){if(u.halfEdges.length!==2||!["hinge","joined","flatSeam"].includes(u.kind))continue;const d=l.get(u.halfEdges[0]),f=l.get(u.halfEdges[1]),p=c.get(d.face),_=c.get(f.face),m=u.kind==="hinge"?u.hinge.assignment==="mountain"?1:2:3,g=[...Os(t.complex,u)].sort();for(const A of g)h.push({firstTile:p,firstVertex:o[p].indexOf(A),secondTile:_,secondVertex:o[_].indexOf(A),connectionFace:m,sourceEdgeId:u.id,sourceEdgeKind:u.kind})}return{ok:!0,job:{schemaVersion:1,id:`pykirigami-job:${t.definition.id}`,subjectId:t.definition.id,backend:"pykirigami",capabilities:["rigidTileDynamics","finiteThicknessCollision"],tiles:t.complex.faces.map((u,d)=>({id:u.id,vertices:o[d].map(f=>{const[p,_]=a.get(f);return[p,_,0]})})),constraints:h,brickThickness:e.panelThickness,contact:e.contact,options:{...n}}}}function N_(t){return F_(t?.timestep)&&Number.isInteger(t?.substeps)&&t.substeps>=1&&t.substeps<=1e3&&Number.isFinite(t?.errorReductionParameter)&&t.errorReductionParameter>=0&&t.errorReductionParameter<=1&&Number.isFinite(t?.gravity)&&Fi(t?.linearDamping)&&Fi(t?.angularDamping)&&Fi(t?.springStiffness)&&Fi(t?.torqueStiffness)&&Fi(t?.forceDamping)&&Fi(t?.torqueDamping)&&typeof t?.filterConnectedCollisions=="boolean"&&Number.isInteger(t?.maximumSteps)&&t.maximumSteps>=1&&t.maximumSteps<=1e6}function F_(t){return Number.isFinite(t)&&t>0}function Fi(t){return Number.isFinite(t)&&t>=0}function hl(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"mechanics",code:"SIMULATION_JOB_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function U_(t){const e=t.vertices.map(l=>l.position[0]),n=t.vertices.map(l=>l.position[1]),i=Math.min(...e),s=Math.min(...n),r=Math.max(...e)-i,a=Math.max(...n)-s,o=new Map(t.vertices.map(l=>[l.id,l.position])),c=t.edges.map(l=>{const[h,u]=Os(t,l),d=o.get(h),f=o.get(u);if(!d||!f)throw new Error(`Edge ${l.id} is missing vertices.`);return[`  <line data-edge-id="${k_(l.id)}"`,`data-edge-kind="${l.kind}"`,`class="${O_(l)}"`,`x1="${$n(d[0])}" y1="${$n(d[1])}"`,`x2="${$n(f[0])}" y2="${$n(f[1])}" />`].join(" ")});return[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${$n(i)} ${$n(s)} ${$n(r)} ${$n(a)}">`,"  <style>.boundary{stroke:#111}.cut{stroke:#e11}.fold{stroke-dasharray:.04 .025}.mountain{stroke:#d33}.valley{stroke:#36c}.flat{stroke:#777}line{fill:none;stroke-width:.008;vector-effect:non-scaling-stroke}</style>",...c,"</svg>"].join(`
`)}function O_(t){return t.kind==="boundary"?"boundary":t.kind==="cutBank"?"cut":t.kind==="hinge"?`fold ${t.hinge?.assignment??"unassigned"}`:"flat"}function $n(t){return Object.is(t,-0)?"0":String(t)}function k_(t){return t.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}function B_(t,e,n){const i=[...xu(e),...A_(n)];if(i.length>0)return{ok:!1,diagnostics:i};const s=new Map(t.complex.vertices.map((r,a)=>[r.id,a]));return{ok:!0,job:{schemaVersion:1,id:`swomps-job:${t.definition.id}`,subjectId:t.definition.id,backend:"swomps",capabilities:["barAndHingeMechanics","panelContact","compliantCrease"],nodes:t.complex.vertices.map((r,a)=>({id:r.id,index:a,position:[r.position[0],r.position[1],0]})),panels:t.complex.faces.map(r=>({id:r.id,nodeIndices:Mc(t.complex,r).map(a=>s.get(a))})),hinges:t.complex.edges.filter(r=>r.kind==="hinge").map(r=>{const[a,o]=Os(t.complex,r);return{id:r.id,nodeIndices:[s.get(a),s.get(o)],assignment:r.hinge.assignment}}),cutBanks:t.complex.edges.filter(r=>r.kind==="cutBank").map(r=>{const[a,o]=Os(t.complex,r);return{id:r.id,cutPairId:r.cutBank.pair,bank:r.cutBank.bank,nodeIndices:[s.get(a),s.get(o)]}}),mechanics:e,fabrication:n}}}function fl(t){if(t.locations.length===0)throw new RangeError("A diagnostic requires at least one location.");if(t.locations.filter(s=>s.kind==="nonSpatial").length>0&&t.locations.length!==1)throw new RangeError("A non-spatial location must be exclusive.");for(const s of t.locations)V_(s);const n=t.locations.map(z_),i=n.flatMap(s=>s.kind==="entity"?[s.entity]:[]);return{severity:t.severity,category:t.category,code:t.code,message:t.message,locations:n,entities:i,...t.suggestion===void 0?{}:{suggestion:t.suggestion}}}function V_(t){if(t.kind==="entity"){if(t.entity.kind.length===0||t.entity.id.length===0)throw new RangeError("A diagnostic entity location requires kind and ID.");return}if(t.kind==="parameter"){if(t.path.length===0||t.path.some(e=>typeof e=="string"&&e.length===0||typeof e=="number"&&(!Number.isInteger(e)||e<0)))throw new RangeError("A diagnostic parameter path must be non-empty.");return}if(t.kind==="sample"){if(!Number.isInteger(t.index)||t.index<0)throw new RangeError("A diagnostic sample index must be non-negative.");if(t.parameter!==void 0&&!Number.isFinite(t.parameter))throw new RangeError("A diagnostic sample parameter must be finite.");return}if(t.reason.trim().length===0)throw new RangeError("A non-spatial diagnostic requires a reason.")}function z_(t){return t.kind==="entity"?{kind:"entity",entity:{...t.entity}}:t.kind==="parameter"?{kind:"parameter",path:[...t.path]}:t.kind==="sample"?{kind:"sample",index:t.index,...t.parameter===void 0?{}:{parameter:t.parameter}}:{kind:"nonSpatial",reason:t.reason}}function Su(t){const e=Ci(t.complex);if(e.length>0)return{ok:!1,diagnostics:e};if(!$s(t.parentPose,Je.relativeRank))return Ui("KINEMATICS_PARENT_POSE_INVALID","The parent pose must be a finite proper rigid transform.","face",t.parentFaceId);const n=t.complex.edges.find(p=>p.id===t.hingeEdgeId);if(!n||n.kind!=="hinge"||!n.hinge||n.halfEdges.length!==2||t.complex.faces.length!==2)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The analytic family requires exactly two faces joined by the selected hinge.","edge",t.hingeEdgeId);const i=n.halfEdges.map(p=>t.complex.halfEdges.find(_=>_.id===p)).filter(p=>p!==void 0),s=i.find(p=>p.face===t.parentFaceId);if(!s)return Ui("KINEMATICS_PARENT_NOT_INCIDENT","The selected parent face must be incident to the hinge.","face",t.parentFaceId);const r=i.find(p=>p.id!==s.id);if(!r)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The selected hinge does not have a child side.","edge",n.id);const a=G_(n,t.angle);if(a.length>0)return{ok:!1,diagnostics:a};const o=pl(t.complex,s.origin),c=t.complex.halfEdges.find(p=>p.id===s.next);if(!c)return Ui("KINEMATICS_NOT_SINGLE_HINGE","The parent hinge half-edge has no valid destination.","halfEdge",s.id);const l=pl(t.complex,c.origin),h=Ye(l,o),u=ot(h),d=du(u,Je);if(u<=d)return Ui("KINEMATICS_DEGENERATE_HINGE","The hinge axis must have nonzero length.","edge",n.id);const f=Xt(t.parentPose,bi(o,h,t.angle));return{ok:!0,childFaceId:r.face,certificate:H_(t,n,r.face),state:{schemaVersion:1,id:t.stateId,parameterValues:[{parameterId:t.hingeEdgeId,value:t.angle}],facePoses:[{faceId:t.parentFaceId,transform:t.parentPose},{faceId:r.face,transform:f}],hingeAngles:[{edgeId:t.hingeEdgeId,angle:t.angle}]}}}function H_(t,e,n){return{id:`single-hinge-certificate:${t.stateId}`,subjectId:t.stateId,classification:"certifiedRigidPath",theoremIds:["single-hinge-axis-angle-path"],assumptions:[{id:"ideal-zero-thickness",statement:"Faces are perfectly rigid and the hinge has zero width and thickness."},{id:"intentional-flat-contact",statement:"Coincident layers at a flat-folded endpoint are permitted."}],constraints:[{id:"canonical-topology",status:"satisfied",method:"exact"},{id:"rigid-face-isometry",status:"satisfied",method:"exact"},{id:"hinge-axis-coincidence",status:"satisfied",method:"exact"},{id:"angle-admissibility",status:"satisfied",method:"exact"},{id:"one-dof-analytic-path",status:"satisfied",method:"exact",details:`Angle path from 0 to ${t.angle} radians about edge ${e.id}; child face ${n}.`}],unsupportedConditions:[],provenance:[{source:"docs/single-hinge-specification.md",locator:"Certificate Scope",claimId:"single-hinge-axis-angle-path"}]}}function G_(t,e){if(!t.hinge)return[];const n=[],[i,s]=t.hinge.angleRange,r=Je.absoluteAngle;return(!Number.isFinite(e)||e<i-r||e>s+r)&&n.push(uo("KINEMATICS_ANGLE_OUT_OF_RANGE","Requested fold angle lies outside the declared hinge interval.","edge",t.id)),(t.hinge.assignment==="valley"&&e<-r||t.hinge.assignment==="mountain"&&e>r)&&n.push(uo("KINEMATICS_ASSIGNMENT_MISMATCH","Requested fold-angle sign conflicts with the mountain/valley assignment.","edge",t.id)),n}function pl(t,e){const n=t.vertices.find(i=>i.id===e);if(!n)throw new Error(`Validated topology is missing vertex ${e}.`);return[n.position[0],n.position[1],0]}function Ui(t,e,n,i){return{ok:!1,diagnostics:[uo(t,e,n,i)]}}function uo(t,e,n,i){return{severity:"error",category:"kinematics",code:t,message:e,locations:t==="KINEMATICS_ANGLE_OUT_OF_RANGE"||t==="KINEMATICS_ASSIGNMENT_MISMATCH"?[{kind:"entity",entity:{kind:n,id:i}},{kind:"parameter",path:["input","angle"]}]:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}]}}function W_(t){return t.reduce((e,n)=>Xt(e,n),tn())}function $_(t,e=Math.max(Je.absoluteLength,Je.absoluteAngle)){const n=W_(t),i=tn();let s=0;for(let o=0;o<3;o+=1)for(let c=0;c<3;c+=1)s=Math.max(s,Math.abs(n.rotation[o][c]-i.rotation[o][c]));const r=Math.max(...n.translation.map(o=>Math.abs(o))),a=Math.max(s,r);return{product:n,rotationResidual:s,translationResidual:r,residual:a,tolerance:e,closed:Number.isFinite(a)&&e>=0&&s<=e&&r<=e}}function Eu(t,e){const[n,i]=[t,e].sort((s,r)=>s.localeCompare(r));return`overlap:${n}:${i}`}function bu(t){return`out-of-bounds:${t}`}function yc(t,e){const n=[0,0,0],i=[1,0,0],s=[0,1,0],r=[0,Math.cos(e),Math.sin(e)];return{id:`${t.id}:global-pair`,ownerNodeId:t.id,origin:n,widthAxis:i,width:t.width,parentAngle:e,angleRange:[t.deployedAngle,Math.PI],boundary:{start:n,end:kt(n,yt(i,t.width))},floor:{frame:Xr(n,i,s),extent:t.floorExtent,materialSide:"negativeNormal"},wall:{frame:Xr(n,i,r),extent:t.wallExtent,materialSide:"negativeNormal"}}}function Au(t,e,n=t.id){const i=e.points.junction,s=e.frames.childFloor.widthAxis,r=yt(e.frames.childFloor.inPlaneAxis,-1),a=yt(e.frames.childWall.inPlaneAxis,-1);return{id:`${n}:generated-pair`,ownerNodeId:n,origin:i,widthAxis:s,width:t.width,parentAngle:e.parentAngle,angleRange:[t.deployedAngle,Math.PI],boundary:{start:i,end:kt(i,yt(s,t.width))},floor:{frame:Xr(i,s,r),extent:t.height,materialSide:"negativeNormal"},wall:{frame:Xr(i,s,a),extent:t.depth,materialSide:"negativeNormal"}}}function Tu(t,e,n){if(!Number.isFinite(n))throw new RangeError("Port width offset must be finite.");const i={...e.floor.frame,origin:kt(e.origin,yt(e.widthAxis,n))},s=gc(t.frames.parentFloor,i);return X_(t,s)}function X_(t,e){return{...t,points:{origin:pt(e,t.points.origin),floorAnchor:pt(e,t.points.floorAnchor),wallAnchor:pt(e,t.points.wallAnchor),junction:pt(e,t.points.junction)},frames:{parentFloor:Js(t.frames.parentFloor,e),parentWall:Js(t.frames.parentWall,e),childFloor:Js(t.frames.childFloor,e),childWall:Js(t.frames.childWall,e)}}}function Js(t,e){return{origin:pt(e,t.origin),widthAxis:yi(e.rotation,t.widthAxis),inPlaneAxis:yi(e.rotation,t.inPlaneAxis),normal:yi(e.rotation,t.normal)}}function Xr(t,e,n){return{origin:t,widthAxis:e,inPlaneAxis:n,normal:si(ds(e,n))}}function Sc(t){const n=[["width",t.width],["height",t.height],["depth",t.depth]].filter(([,s])=>!Number.isFinite(s)||s<=0),i=[];return n.length>0&&i.push(Yr("MECHANISM_POPUP_INVALID_PARAMETER",`Pop-up dimensions must be finite and positive: ${n.map(([s])=>s).join(", ")}.`,t.id,"Use finite dimensions greater than zero.",n.map(([s])=>["input",s]))),(!Number.isFinite(t.deployedAngle)||t.deployedAngle<=0||t.deployedAngle>=Math.PI)&&i.push(Yr("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","The deployed parent angle must lie strictly between zero and pi radians.",t.id,"Choose a deployed angle in the open interval (0, pi).",[["input","deployedAngle"]])),i}function la(t,e){const n=Sc(t),i=Je.absoluteAngle;return(!Number.isFinite(e)||e<t.deployedAngle-i||e>Math.PI+i)&&n.push(Yr("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","The parent angle lies outside the mechanism path domain.",t.id,`Choose an angle from ${t.deployedAngle} through ${Math.PI} radians.`,[["parentAngle"]])),n.length>0?{ok:!1,diagnostics:n}:{ok:!0,state:wu(t,e)}}function Ec(t,e){const n=Sc(t);if((!Number.isFinite(e)||!Number.isInteger(e)||e<2)&&n.push(Yr("PATH_POPUP_SAMPLE_COUNT_INVALID","A pop-up path requires an integer sample count of at least two.",t.id,"Use an integer sample count greater than or equal to two.",[["input","sampleCount"]])),n.length>0)return{ok:!1,diagnostics:n};const i=Array.from({length:e},(s,r)=>{const a=r/(e-1),o=Math.PI+a*(t.deployedAngle-Math.PI);return wu(t,o)});return{ok:!0,path:{id:`two-plane-popup-path:${t.id}`,domain:[t.deployedAngle,Math.PI],samples:i,evaluate(s){const r=la(t,s);if(!r.ok)throw new RangeError(r.diagnostics.map(a=>a.message).join(" "));return r.state},certificate:Y_(t)}}}function wu(t,e){const n=[0,0,0],i=[1,0,0],s=[0,1,0],r=[0,Math.cos(e),Math.sin(e)],a=yt(s,t.depth),o=yt(r,t.height),c=Ye(o,a),l=Math.sin(e/2),h=(t.depth-t.height)**2+4*t.depth*t.height*l*l,u=t.depth*(t.depth-t.height+2*t.height*l*l)/h,d=yt(kt(a,yt(c,u)),2),f=si(Ye(d,a)),p=si(Ye(d,o)),_=Math.max(ot(Ye(f,r)),ot(Ye(p,s))),m=Math.abs(e-Math.PI)<=Je.absoluteAngle;return{id:`${t.id}:angle:${e}`,parentAngle:e,points:{origin:n,floorAnchor:a,wallAnchor:o,junction:d},frames:{parentFloor:js(n,i,s),parentWall:js(n,i,r),childFloor:js(d,i,p),childWall:js(d,i,f)},axisAligned:_<=Je.absoluteAngle,alignmentResidual:_,contact:m?"intentionalFlatCoincidence":"clear"}}function js(t,e,n){return{origin:t,widthAxis:e,inPlaneAxis:n,normal:si(ds(e,n))}}function Y_(t){return{id:`two-plane-popup-certificate:${t.id}`,subjectId:t.id,classification:"certifiedRigidPath",theoremIds:["two-plane-popup-reflection-path"],assumptions:[{id:"ideal-zero-thickness",statement:"All four panels are perfectly rigid with zero thickness and ideal hinges."},{id:"constant-width-extrusion",statement:"The planar linkage is extruded at constant positive width."},{id:"intentional-flat-contact",statement:"Coincident layers at the flat endpoint are permitted."}],constraints:[{id:"positive-finite-dimensions",status:"satisfied",method:"exact"},{id:"rigid-link-isometry",status:"satisfied",method:"exact"},{id:"four-bar-loop-closure",status:"satisfied",method:"exact",details:"The moving junction is the reflection of the origin across the anchor line."},{id:"continuous-reflection-branch",status:"satisfied",method:"exact"},{id:"open-path-collision-freedom",status:"satisfied",method:"exact"}],unsupportedConditions:[],provenance:[{source:"docs/superpowers/specs/2026-07-29-two-plane-pop-up-design.md",locator:"Mathematical Claims",claimId:"two-plane-popup-reflection-path"},{source:"docs/mathematical-contract.md",locator:"4. Two-Plane Pop-Up Family"}]}}function Yr(t,e,n,i,s=[]){return{severity:"error",category:t.startsWith("PATH_")?"path":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"twoPlanePopUp",id:n}},...s.map(r=>({kind:"parameter",path:r}))],entities:[{kind:"twoPlanePopUp",id:n}],suggestion:i}}function bc(t){const e=q_(t);if(e)return[e];if(t.nodes.length===0)return[Jt("ASSEMBLY_SCHEMA_INVALID","An assembly requires at least one pop-up node.","assembly",t.id)];const n=ml(t.nodes);if(n)return[Jt("ASSEMBLY_DUPLICATE_NODE_ID",`Pop-up node ID ${n} is not unique.`,"popUpNode",n)];const i=ml(t.sharedPortConstraints);if(i)return[Jt("ASSEMBLY_SHARED_CONSTRAINT_INVALID",`Shared-port constraint ID ${i} is not unique.`,"sharedPortConstraint",i)];for(const d of t.nodes)if(Sc(da(d)).length>0)return[Jt("ASSEMBLY_SCHEMA_INVALID",`Node ${d.id} has invalid pop-up parameters.`,"popUpNode",d.id)];const s=new Map(t.nodes.map(d=>[d.id,d]));for(const d of t.nodes)if(d.attachment.kind==="generatedPair"&&!s.has(d.attachment.parentNodeId))return[Jt("ASSEMBLY_PARENT_MISSING",`Node ${d.id} references missing parent ${d.attachment.parentNodeId}.`,"popUpNode",d.id)];const r=Ru(t.nodes,s);if(r.cycleNodeId)return[Jt("ASSEMBLY_HIERARCHY_CYCLE","Pop-up attachment parents must form an acyclic hierarchy.","popUpNode",r.cycleNodeId)];const a=[...r.values.entries()].find(([,d])=>d>2);if(a)return[Jt("ASSEMBLY_DEPTH_UNSUPPORTED","The supported hierarchy is sheet to root to child.","popUpNode",a[0],"Attach this node directly to a root module or split the design.")];const o=Je.absoluteAngle,c=t.nodes.find(d=>Math.abs(d.parameters.deployedAngle-t.sheet.deployedAngle)>o);if(c)return[Jt("ASSEMBLY_PARAMETER_MISMATCH","Every module must use the assembly sheet deployed angle.","popUpNode",c.id,`Use ${t.sheet.deployedAngle} radians.`)];const l=Cu(t,r.values),h=K_(t,l,s);if(h)return[h];const u=Z_(t.nodes);if(u)return[u];for(const d of t.sharedPortConstraints)if(d.firstNodeId===d.secondNodeId||!s.has(d.firstNodeId)||!s.has(d.secondNodeId)||!$s(d.expectedTransform,Je.relativeRank))return[Jt("ASSEMBLY_SHARED_CONSTRAINT_INVALID","A shared-port constraint requires two distinct existing nodes and a proper rigid transform.","sharedPortConstraint",d.id)];return[]}function qr(t,e){const n=bc(t);if((!Number.isFinite(e)||e<t.sheet.deployedAngle-Je.absoluteAngle||e>Math.PI+Je.absoluteAngle)&&n.push(Jt("MECHANISM_POPUP_ANGLE_OUT_OF_RANGE","Assembly angle lies outside the synchronized path domain.","assembly",t.id)),n.length>0)return{ok:!1,diagnostics:n};const i=new Map(t.nodes.map(c=>[c.id,c])),s=Ru(t.nodes,i),r=Cu(t,s.values),a=new Map,o=yc(t.sheet,e);for(const c of r){const l=da(c.node),h=la(l,e);if(!h.ok)return{ok:!1,diagnostics:h.diagnostics};const u=c.node.attachment,d=u.kind==="sheet"?o:a.get(u.parentNodeId).outputPort,f=Tu(h.state,d,u.xOffset),p=gc(h.state.frames.parentFloor,f.frames.parentFloor),_=u.kind==="generatedPair"?u.parentNodeId:void 0,m={nodeId:c.node.id,..._===void 0?{}:{parentNodeId:_},depth:c.depth,globalWidthInterval:c.globalWidthInterval,localToWorld:p,worldState:{...f,id:`${c.node.id}:angle:${e}`},outputPort:Au(l,f,c.node.id)};a.set(c.node.id,m)}return{ok:!0,state:{id:`${t.id}:angle:${e}`,definitionId:t.id,parentAngle:e,nodes:r.map(c=>a.get(c.node.id))}}}function da(t){return{id:t.id,...t.parameters}}function q_(t){const e=t.sheet;if(typeof t.id!="string"||t.id.length===0||typeof e.id!="string"||e.id.length===0||![e.width,e.wallExtent,e.floorExtent].every(n=>Number.isFinite(n)&&n>0)||!Number.isFinite(e.deployedAngle)||e.deployedAngle<=0||e.deployedAngle>=Math.PI)return Jt("ASSEMBLY_SCHEMA_INVALID","Assembly and sheet IDs must be nonempty; sheet dimensions and deployed angle must be finite and admissible.","assembly",t.id)}function ml(t){const e=new Set;for(const n of t){if(e.has(n.id))return n.id;e.add(n.id)}}function Ru(t,e){const n=new Map,i=new Set;let s;const r=a=>{const o=n.get(a.id);if(o!==void 0)return o;if(i.has(a.id))return s=a.id,Number.POSITIVE_INFINITY;i.add(a.id);const c=a.attachment.kind==="sheet"?1:1+r(e.get(a.attachment.parentNodeId));return i.delete(a.id),n.set(a.id,c),c};for(const a of t){if(s)break;r(a)}return{values:n,...s===void 0?{}:{cycleNodeId:s}}}function Cu(t,e){const n=new Map,i=[...t.nodes].sort((s,r)=>e.get(s.id)-e.get(r.id)||s.id.localeCompare(r.id));for(const s of i){const r=e.get(s.id),a=s.attachment,o=a.kind==="sheet"?a.xOffset:n.get(a.parentNodeId).globalWidthInterval[0]+a.xOffset;n.set(s.id,{node:s,depth:r,globalWidthInterval:[o,o+s.parameters.width]})}return i.map(s=>n.get(s.id))}function K_(t,e,n){const i=Je.absoluteLength;for(const s of e){const r=s.node,a=r.attachment,o=a.xOffset,c=a.kind==="sheet"?t.sheet.width:n.get(a.parentNodeId).parameters.width,l=a.kind==="sheet"?t.sheet.wallExtent:n.get(a.parentNodeId).parameters.depth,h=a.kind==="sheet"?t.sheet.floorExtent:n.get(a.parentNodeId).parameters.height;if(!Number.isFinite(o)||o<-i||o+r.parameters.width>c+i||r.parameters.height>l+i||r.parameters.depth>h+i)return Jt("ASSEMBLY_ATTACHMENT_OUT_OF_BOUNDS",`Node ${r.id} does not fit its host width or plane extents.`,"outOfBoundsRegion",bu(r.id),`Fit width within ${c}, wall height within ${l}, and floor depth within ${h}.`)}}function Z_(t){const e=new Map;for(const i of t){const s=i.attachment.kind==="sheet"?"sheet":`node:${i.attachment.parentNodeId}`,r=e.get(s)??[];r.push(i),e.set(s,r)}const n=Je.absoluteLength;for(const i of e.values()){const s=[...i].sort((r,a)=>r.attachment.xOffset-a.attachment.xOffset||r.id.localeCompare(a.id));for(let r=1;r<s.length;r+=1){const a=s[r-1],o=s[r];if(o.attachment.xOffset<a.attachment.xOffset+a.parameters.width-n)return Jt("ASSEMBLY_ATTACHMENT_OVERLAP",`Sibling strips ${a.id} and ${o.id} overlap.`,"overlapRegion",Eu(a.id,o.id),"Move or resize sibling strips so their open width intervals are disjoint.")}}}function Jt(t,e,n,i,s){return{severity:"error",category:t==="ASSEMBLY_DEPTH_UNSUPPORTED"?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}],...s===void 0?{}:{suggestion:s}}}function Pu(t){const e=bc(t);if(e.length>0)return{ok:!1,diagnostics:e};const n=qr(t,Math.PI);if(!n.ok)return n;const i=gl([0,t.sheet.width,...n.state.nodes.flatMap(E=>[...E.globalWidthInterval])]),s=J_(n.state.nodes),r=gl([-t.sheet.wallExtent,0,t.sheet.floorExtent,...s.flatMap(E=>[E.yMinimum,E.yMaximum])]),a=[];for(let E=0;E<r.length-1;E+=1)for(let y=0;y<i.length-1;y+=1){const T=(i[y]+i[y+1])/2,M=(r[E]+r[E+1])/2,b=j_(t,s,T,M),P=`face:${y}:${E}:${b.id}`;a.push({xIndex:y,yIndex:E,faceId:P,owner:b,halfEdgeIds:[`halfEdge:${y}:${E}:bottom`,`halfEdge:${y}:${E}:right`,`halfEdge:${y}:${E}:top`,`halfEdge:${y}:${E}:left`]})}const o=Q_(i,r),c=[],l=[],h=new Map,u=new Map(a.map(E=>[E.faceId,E.owner]));for(const E of a){const[y,T,M,b]=E.halfEdgeIds;c.push({id:E.faceId,boundary:y,holes:[]});const P=[[{id:y,origin:Rs(E.xIndex,E.yIndex),next:T,edge:"",face:E.faceId},_l(E.xIndex,E.yIndex)],[{id:T,origin:Rs(E.xIndex+1,E.yIndex),next:M,edge:"",face:E.faceId},xl(E.xIndex+1,E.yIndex)],[{id:M,origin:Rs(E.xIndex+1,E.yIndex+1),next:b,edge:"",face:E.faceId},_l(E.xIndex,E.yIndex+1)],[{id:b,origin:Rs(E.xIndex,E.yIndex+1),next:y,edge:"",face:E.faceId},xl(E.xIndex,E.yIndex)]];for(const[C,I]of P){l.push(C);const X=h.get(I)??[];X.push({halfEdge:C,faceId:E.faceId,owner:E.owner}),h.set(I,X)}}const d=[],f=[],p=[],_=[],m=[...h.entries()].sort(([E],[y])=>E.localeCompare(y));for(const[E,y]of m){if(y.length===1){const C=`edge:boundary:${E}`;y[0].halfEdge.edge=C,d.push({id:C,halfEdges:[y[0].halfEdge.id],kind:"boundary"}),p.push(Ma(C,"boundary",y));continue}if(y.length!==2)return vl(t.id,`Grid segment ${E} has ${y.length} incident cells.`);const T=y[0].owner.id===y[1].owner.id;if(E.startsWith("v:")&&!T){const C=[...y].sort((W,D)=>W.faceId.localeCompare(D.faceId)),I=`cutPair:${E}`,X=[`edge:cut:${E}:a`,`edge:cut:${E}:b`];C.forEach((W,D)=>{const Y=D===0?"a":"b",V=X[D];W.halfEdge.edge=V,d.push({id:V,halfEdges:[W.halfEdge.id],kind:"cutBank",cutBank:{pair:I,bank:Y}}),p.push(Ma(V,"cutBank",[W]))}),f.push({id:I,banks:X}),_.push({cutPairId:I,nodeIds:Iu(y)});continue}const M=T?"flatSeam":"hinge",b=T?"flatSeam":e0(E,r)===0?"centerHinge":"anchorHinge",P=`edge:${M}:${E}`;y[0].halfEdge.edge=P,y[1].halfEdge.edge=P,y[0].halfEdge.twin=y[1].halfEdge.id,y[1].halfEdge.twin=y[0].halfEdge.id,d.push({id:P,halfEdges:[y[0].halfEdge.id,y[1].halfEdge.id],kind:M,...M==="hinge"?{hinge:b==="centerHinge"?{assignment:"valley",restAngle:0,angleRange:[0,Math.PI]}:{assignment:"mountain",restAngle:0,angleRange:[-Math.PI,0]}}:{}}),p.push(Ma(P,b,y))}const g={schemaVersion:1,vertices:o,halfEdges:l,edges:d,faces:c,cutPairs:f,materialComponents:[{id:`materialComponent:${t.sheet.id}`,faces:c.map(E=>E.id)}]},A=Ci(g);if(A.length>0)return vl(t.id,A.map(E=>E.code).join(", "));const w=a.map(E=>({faceId:E.faceId,owner:u.get(E.faceId)})),v=t0(t,w,p,_);return{ok:!0,assembly:{definition:t,complex:g,sourceMap:v,attachmentEdges:n0(t),cycles:i0(t)}}}function J_(t){return t.flatMap(e=>{const n=Ns(e.worldState.points.origin[1]),i=Ns(e.worldState.points.floorAnchor[1]),s=Ns(e.worldState.points.wallAnchor[1]),[r,a]=e.globalWidthInterval;return[{owner:{id:`module:${e.nodeId}:childWall`,kind:"module",role:"childWall",nodeId:e.nodeId},depth:e.depth,xMinimum:r,xMaximum:a,yMinimum:Math.min(n,i),yMaximum:Math.max(n,i)},{owner:{id:`module:${e.nodeId}:childFloor`,kind:"module",role:"childFloor",nodeId:e.nodeId},depth:e.depth,xMinimum:r,xMaximum:a,yMinimum:Math.min(n,s),yMaximum:Math.max(n,s)}]})}function j_(t,e,n,i){let s=i<0?{id:`sheet:${t.sheet.id}:wall`,kind:"sheet",role:"wall",sheetId:t.sheet.id}:{id:`sheet:${t.sheet.id}:floor`,kind:"sheet",role:"floor",sheetId:t.sheet.id};const r=[...e].sort((a,o)=>a.depth-o.depth||a.owner.id.localeCompare(o.owner.id));for(const a of r)n>a.xMinimum&&n<a.xMaximum&&i>a.yMinimum&&i<a.yMaximum&&(s=a.owner);return s}function gl(t){const e=Je.absoluteLength,n=t.map(Ns).sort((s,r)=>s-r),i=[];for(const s of n)(i.length===0||Math.abs(s-i[i.length-1])>e)&&i.push(s);return i}function Ns(t){return Math.abs(t)<=Je.absoluteLength?0:t}function Q_(t,e){const n=[];for(let i=0;i<e.length;i+=1)for(let s=0;s<t.length;s+=1)n.push({id:Rs(s,i),position:[t[s],e[i]]});return n}function Rs(t,e){return`vertex:${t}:${e}`}function _l(t,e){return`h:${t}:${e}`}function xl(t,e){return`v:${t}:${e}`}function e0(t,e){const n=t.split(":");return Ns(e[Number(n[2])])}function Ma(t,e,n){return{edgeId:t,role:e,ownerIds:[...new Set(n.map(i=>i.owner.id))].sort(),nodeIds:Iu(n)}}function Iu(t){return[...new Set(t.flatMap(e=>e.owner.kind==="module"?[e.owner.nodeId]:[]))].sort()}function t0(t,e,n,i){const s=new Set([`sheet:${t.sheet.id}:wall`,`sheet:${t.sheet.id}:floor`]);return{sheet:{sheetId:t.sheet.id,faceIds:e.filter(r=>s.has(r.owner.id)).map(r=>r.faceId),edgeIds:n.filter(r=>r.ownerIds.some(a=>s.has(a))).map(r=>r.edgeId)},nodes:[...t.nodes].sort((r,a)=>r.id.localeCompare(a.id)).map(r=>({nodeId:r.id,faceIds:e.filter(a=>a.owner.kind==="module"&&a.owner.nodeId===r.id).map(a=>a.faceId),edgeIds:n.filter(a=>a.nodeIds.includes(r.id)).map(a=>a.edgeId)})),faces:e,edges:n,cutPairs:i}}function n0(t){return[...t.nodes].sort((e,n)=>e.id.localeCompare(n.id)).map(e=>({id:`attachment:${e.id}`,parentId:e.attachment.kind==="sheet"?t.sheet.id:e.attachment.parentNodeId,childId:e.id}))}function i0(t){const e=new Map(t.nodes.map(n=>[n.id,n.attachment.kind==="sheet"?t.sheet.id:n.attachment.parentNodeId]));return[...t.sharedPortConstraints].sort((n,i)=>n.id.localeCompare(i.id)).map(n=>({constraintId:n.id,nodePath:s0(n.firstNodeId,n.secondNodeId,t.sheet.id,e)}))}function s0(t,e,n,i){const s=u=>{const d=[u];for(;d[d.length-1]!==n;)d.push(i.get(d[d.length-1]));return d},r=s(t),a=s(e),o=new Set(a),c=r.find(u=>o.has(u)),l=r.slice(0,r.indexOf(c)+1),h=a.slice(0,a.indexOf(c)).reverse();return[...l,...h,t]}function vl(t,e){return{ok:!1,diagnostics:[{severity:"error",category:"topology",code:"ASSEMBLY_COMPILED_TOPOLOGY_INVALID",message:`Compiled pop-up topology is invalid: ${e}`,locations:[{kind:"entity",entity:{kind:"assembly",id:t}}],entities:[{kind:"assembly",id:t}]}]}}function r0(t,e,n=Je){const i=h0(e).every(Number.isFinite),s=Math.max(t.width,t.height,t.depth),r=du(s,n),a=[i?tr("finite-state",0,0):ms("finite-state","State coordinates and frames must be finite.")];i?a.push(tr("rigid-link-isometry",o0(t,e),r),tr("parent-child-angle",c0(e),n.absoluteAngle),tr("frame-orthonormality",l0(e),n.relativeRank),u0(e)):a.push(ms("rigid-link-isometry","Linkage residual is undefined for a non-finite state."),ms("parent-child-angle","Angle residual is undefined for a non-finite state."),ms("frame-orthonormality","Frame residual is undefined for a non-finite state."),ms("collision-and-contact","Contact classification is undefined for a non-finite state."));const o=a.some(c=>c.status==="failed")?"invalid":"endpointIsometric";return{id:`two-plane-popup-analysis:${e.id}`,subjectId:e.id,classification:o,assumptions:[{id:"ideal-zero-thickness",statement:"Panels are perfectly rigid and have zero thickness."},{id:"constant-width-extrusion",statement:"The checked cross-section is extruded at constant width."}],constraints:a,unsupportedConditions:[],provenance:[{source:"docs/superpowers/specs/2026-07-29-two-plane-pop-up-design.md",locator:"Components",claimId:"two-plane-popup-independent-state-analysis"}]}}function a0(t,e=Je.absoluteLength){if(Math.abs(t.parentAngle-Math.PI)<=Je.absoluteAngle)return"intentionalFlatCoincidence";const{origin:n,floorAnchor:i,wallAnchor:s,junction:r}=t.points;return yl(n,i,r,s,e)||yl(i,r,s,n,e)?"unintendedIntersection":"clear"}function o0(t,e){const{origin:n,floorAnchor:i,wallAnchor:s,junction:r}=e.points;return Math.max(Math.abs(ot(Ye(i,n))-t.depth),Math.abs(ot(Ye(r,i))-t.depth),Math.abs(ot(Ye(s,n))-t.height),Math.abs(ot(Ye(r,s))-t.height))}function c0(t){const{origin:e,floorAnchor:n,wallAnchor:i,junction:s}=t.points,r=Ml(Ye(n,e),Ye(i,e)),a=Ml(Ye(n,s),Ye(i,s));return Math.abs(r-a)}function Ml(t,e){const n=si(t),i=si(e);return Math.atan2(ot(ds(n,i)),at(n,i))}function l0(t){return Math.max(...Object.values(t.frames).map(d0))}function d0(t){const e=ds(t.widthAxis,t.inPlaneAxis);return Math.max(Math.abs(ot(t.widthAxis)-1),Math.abs(ot(t.inPlaneAxis)-1),Math.abs(ot(t.normal)-1),Math.abs(at(t.widthAxis,t.inPlaneAxis)),Math.abs(at(t.widthAxis,t.normal)),Math.abs(at(t.inPlaneAxis,t.normal)),ot(Ye(e,t.normal)))}function u0(t){const e=a0(t);return{id:"collision-and-contact",status:e!=="unintendedIntersection"&&e===t.contact?"satisfied":"failed",method:"exact",details:e==="intentionalFlatCoincidence"?"Coincidence is intentional flat contact at the path endpoint.":e==="clear"?"Nonadjacent cross-section links do not intersect.":"Nonadjacent cross-section links intersect."}}function yl(t,e,n,i,s){const r=Math.max(ot(Ye(e,t)),ot(Ye(n,t)),ot(Ye(i,t)),ot(Ye(n,e)),ot(Ye(i,e)),ot(Ye(i,n)),s),a=s*r,o=Qs(t,e,n),c=Qs(t,e,i),l=Qs(n,i,t),h=Qs(n,i,e);return(o>a&&c<-a||o<-a&&c>a)&&(l>a&&h<-a||l<-a&&h>a)?!0:Math.abs(o)<=a&&er(t,e,n,s)||Math.abs(c)<=a&&er(t,e,i,s)||Math.abs(l)<=a&&er(n,i,t,s)||Math.abs(h)<=a&&er(n,i,e,s)}function Qs(t,e,n){const i=e[1]-t[1],s=e[2]-t[2],r=n[1]-t[1],a=n[2]-t[2];return i*a-s*r}function er(t,e,n,i){return n[1]>=Math.min(t[1],e[1])-i&&n[1]<=Math.max(t[1],e[1])+i&&n[2]>=Math.min(t[2],e[2])-i&&n[2]<=Math.max(t[2],e[2])+i}function h0(t){return[t.parentAngle,...Object.values(t.points).flatMap(e=>[...e]),...Object.values(t.frames).flatMap(e=>[...e.origin,...e.widthAxis,...e.inPlaneAxis,...e.normal]),t.alignmentResidual]}function tr(t,e,n){return{id:t,status:e<=n?"satisfied":"failed",method:"boundedNumerical",residual:e,tolerance:n}}function ms(t,e){return{id:t,status:"failed",method:"exact",details:e}}function ho(t,e,n=Math.max(Je.absoluteLength,Je.absoluteAngle)){const i=t.nodes.find(h=>h.nodeId===e.firstNodeId),s=t.nodes.find(h=>h.nodeId===e.secondNodeId);if(!i||!s)throw new RangeError("Shared-port constraint references a missing node.");const r=$r(i.outputPort.floor.frame),a=$r(s.outputPort.floor.frame),o=Xt(Ei(r),a),c=Xt(Ei(e.expectedTransform),o),l=$_([c],n);return{constraintId:e.id,errorTransform:c,residualVector:M0(c),rotationResidual:l.rotationResidual,translationResidual:l.translationResidual,residual:l.residual,tolerance:l.tolerance,closed:l.closed}}function f0(t,e){if(!Number.isFinite(e)||!Number.isInteger(e)||e<2)return{ok:!1,diagnostics:[{severity:"error",category:"path",code:"PATH_POPUP_SAMPLE_COUNT_INVALID",message:"An assembly path requires an integer sample count of at least two.",locations:[{kind:"parameter",path:["sampleCount"]}],entities:[{kind:"assembly",id:t.id}],suggestion:"Use an integer sample count greater than or equal to two."}]};const n=Pu(t);if(!n.ok)return n;const i=[],s=[];let r=!1;for(let f=0;f<e;f+=1){const p=f/(e-1),_=Math.PI+p*(t.sheet.deployedAngle-Math.PI),m=qr(t,_);if(!m.ok)return m;i.push(m.state),p0(t,m.state).some(A=>A.status==="failed")&&(r=!0),s.push(t.sharedPortConstraints.map(A=>ho(m.state,A)))}const a=m0(t,s,r),c=t.sharedPortConstraints.filter((f,p)=>s.some(_=>!_[p].closed)).map(y0),h=a.some(f=>f.status==="failed")?"invalid":t.sharedPortConstraints.length===0?"certifiedRigidPath":"numericallyVerifiedRigidPath",u=g0(t,h,a),d=(t.sheet.deployedAngle+Math.PI)/2;return{ok:!0,path:{id:`pop-up-assembly-path:${t.id}`,compiledAssembly:n.assembly,samples:i,evidence:u,mobility:v0(t,d),diagnostics:c}}}function p0(t,e){const n=new Map(t.nodes.map(i=>[i.id,i]));return e.nodes.flatMap(i=>{const s=n.get(i.nodeId);return r0(da(s),i.worldState).constraints.map(a=>({...a,id:`module:${s.id}:${a.id}`}))})}function m0(t,e,n){const i=[{id:"compiled-topology",status:"satisfied",method:"exact"},{id:"synchronized-local-rigid-paths",status:n?"failed":"satisfied",method:"exact"},{id:"rigid-port-attachment",status:"satisfied",method:"exact"},{id:"host-domain-admissibility",status:"satisfied",method:"exact"},{id:"nested-strip-collision-freedom",status:"satisfied",method:"exact"}];return t.sharedPortConstraints.forEach((s,r)=>{const a=Math.max(...e.map(c=>c[r].residual)),o=e[0][r].tolerance;i.push({id:`shared-cycle:${s.id}`,status:a<=o?"satisfied":"failed",method:"sampledNumerical",residual:a,tolerance:o,details:`${e.length} synchronized path samples.`})}),i}function g0(t,e,n){const i={id:`pop-up-assembly-path-evidence:${t.id}`,subjectId:t.id,assumptions:_0(t),constraints:n,unsupportedConditions:[],provenance:x0()};return e==="certifiedRigidPath"?{...i,classification:e,theoremIds:["two-plane-popup-reflection-path","nested-parallel-strip-composition"]}:{...i,classification:e}}function _0(t){const e=[];for(const n of[...t.nodes].sort((i,s)=>i.id.localeCompare(s.id))){const i=Ec(da(n),2);i.ok&&e.push(...i.path.certificate.assumptions.map(s=>({id:`inherited:${n.id}:${s.id}`,statement:`Node ${n.id}: ${s.statement}`})))}return[...e,{id:"assembly:synchronized-angle",statement:"Every module is driven by one common parent angle."},{id:"assembly:nested-strip-replacement",statement:"A child replaces material inside its declared host strip."},{id:"assembly:disjoint-sibling-interiors",statement:"Sibling strip intervals have disjoint interiors."}]}function x0(){return[{source:"docs/superpowers/specs/2026-07-29-recursive-pop-up-composition-design.md",locator:"Global Path And Collision",claimId:"nested-parallel-strip-composition"},{source:"docs/mathematical-contract.md",locator:"5. Composition Contract"}]}function v0(t,e){const n=Math.sqrt(Number.EPSILON);if(t.sharedPortConstraints.length===0)return{...Ur([],1),finiteDifferenceStep:0,derivativeZeroTolerance:n};const i=Math.PI-t.sheet.deployedAngle,s=Math.min(1e-6,i/8),r=Math.min(Math.PI-s,Math.max(t.sheet.deployedAngle+s,e)),a=qr(t,r+s),o=qr(t,r-s);if(!a.ok||!o.ok)return{...Ur([],1),finiteDifferenceStep:s,derivativeZeroTolerance:n};const c=t.sharedPortConstraints.flatMap(u=>ho(a.state,u).residualVector),l=t.sharedPortConstraints.flatMap(u=>ho(o.state,u).residualVector),h=c.map((u,d)=>{const f=(u-l[d])/(2*s);return[Math.abs(f)<=n?0:f]});return{...Ur(h,1),finiteDifferenceStep:s,derivativeZeroTolerance:n}}function M0(t){return[t.rotation[0][0]-1,t.rotation[0][1],t.rotation[0][2],t.translation[0],t.rotation[1][0],t.rotation[1][1]-1,t.rotation[1][2],t.translation[1],t.rotation[2][0],t.rotation[2][1],t.rotation[2][2]-1,t.translation[2]]}function y0(t){return{severity:"error",category:"kinematics",code:"ASSEMBLY_GLOBAL_CLOSURE_FAILED",message:`Shared-port cycle ${t.id} does not close.`,locations:[{kind:"entity",entity:{kind:"sharedPortConstraint",id:t.id}}],entities:[{kind:"sharedPortConstraint",id:t.id}],suggestion:"Correct or remove the conflicting shared-port transform."}}const Lu=1,Du=["opening","planePair","platform","shelf","stair","wall"],Kr=Object.freeze({schemaVersion:Lu,supportedOperations:Object.freeze(["planePair","platform","shelf","stair","wall"]),unsupportedOperations:Object.freeze(["opening"]),unsupportedConstructionFamilies:Object.freeze(["multifold","curvedCrease"]),alignments:Object.freeze(["allowRotated","axisAligned"]),mismatchPolicies:Object.freeze(["preserveDepth","preserveHeight","reject"]),targets:Object.freeze(["generatedPair","sheet"]),maximumModuleDepth:2,maximumOperations:64,maximumPathSampleCount:1001,emitsPartialGeometryOnFailure:!1});function S0(t){if(!E0(t))return[on("SPATIAL_PROGRAM_INVALID","Spatial program, sheet, and path-sampling fields must be finite and admissible.","spatialProgram",typeof t?.id=="string"?t.id:"unknown")];const e=T0(t.operations);if(e)return[on("SPATIAL_DUPLICATE_OPERATION_ID",`Spatial operation ID ${e} is not unique.`,"spatialOperation",e)];const n=new Map(t.operations.map(a=>[a.id,a])),i=[];for(const a of[...t.operations].sort(Uu)){if(!A0(a)){i.push(on("SPATIAL_DIMENSION_INVALID","Spatial dimensions must be finite and positive, and xOffset must be finite.","spatialOperation",a.id));continue}a.kind==="stair"&&(Number.isInteger(a.stepCount)&&a.stepCount>0&&Number.isFinite(a.stepRun)&&a.stepRun>0&&Number.isFinite(a.stepRise)&&a.stepRise>0?a.stepRun!==a.stepRise&&i.push(on("SPATIAL_DIMENSION_CONFLICT","The certified stair mechanism requires equal step run and rise.","spatialOperation",a.id,"Set stepRun equal to stepRise for the first certified stair mechanism.")):i.push(on("SPATIAL_DIMENSION_INVALID","Stair stepCount must be a positive integer and stepRun/stepRise must be finite and positive.","spatialOperation",a.id)),a.alignment!=="axisAligned"&&i.push(on("SPATIAL_ALIGNMENT_UNSUPPORTED","The certified stair mechanism currently supports only axisAligned placement.","spatialOperation",a.id))),a.kind==="opening"&&i.push(on("SPATIAL_OPERATION_UNSUPPORTED","Opening requires subtractive topology and has no certified mechanism family.","spatialOperation",a.id,"Use a supported paired operation or wait for a subtractive mechanism contract.")),a.target.kind==="generatedPair"&&(!a.target.operationId||!n.has(a.target.operationId))&&i.push(on("SPATIAL_TARGET_INVALID",`Operation ${a.id} references a missing generated pair.`,"spatialOperation",a.id)),a.kind==="shelf"&&a.target.kind!=="generatedPair"&&i.push(on("SPATIAL_TARGET_INVALID","A shelf must target an existing generated plane pair.","spatialOperation",a.id))}if(i.length>0)return w0(i);const s=Fu(t.operations,n);if(s.cycleId)return[on("SPATIAL_TARGET_CYCLE","Generated-pair targets must form an acyclic hierarchy.","spatialOperation",s.cycleId)];const r=[...s.depths.entries()].filter(([,a])=>a>Kr.maximumModuleDepth).sort(([a],[o])=>a.localeCompare(o))[0];return r?[on("SPATIAL_TARGET_DEPTH_UNSUPPORTED","The spatial compiler supports only sheet to root to child.","spatialOperation",r[0],"Attach this operation to the sheet or a root operation.")]:[]}function Nu(t){const e=new Map(t.map(n=>[n.id,n]));return Fu(t,e).depths}function E0(t){const e=t?.sheet;return t?.schemaVersion===Lu&&typeof t.id=="string"&&t.id.length>0&&Array.isArray(t.operations)&&t.operations.length>0&&t.operations.length<=Kr.maximumOperations&&t.operations.every(b0)&&Number.isInteger(t.pathSampleCount)&&t.pathSampleCount>=2&&t.pathSampleCount<=Kr.maximumPathSampleCount&&typeof e?.id=="string"&&e.id.length>0&&[e.width,e.wallExtent,e.floorExtent].every(n=>Number.isFinite(n)&&n>0)&&Number.isFinite(e.deployedAngle)&&e.deployedAngle>0&&e.deployedAngle<Math.PI}function b0(t){return t!==null&&typeof t=="object"&&typeof t.id=="string"&&t.id.length>0&&Du.includes(t.kind)&&(t.target?.kind==="sheet"||t.target?.kind==="generatedPair"&&typeof t.target.operationId=="string")&&(t.alignment==="axisAligned"||t.alignment==="allowRotated")&&Kr.mismatchPolicies.includes(t.mismatchPolicy)&&(t.kind!=="stair"||Number.isInteger(t.stepCount)&&typeof t.stepRun=="number"&&typeof t.stepRise=="number")}function A0(t){return Number.isFinite(t.xOffset)&&[t.width,t.height,t.depth].every(e=>Number.isFinite(e)&&e>0)}function T0(t){const e=new Set;for(const n of t){if(e.has(n.id))return n.id;e.add(n.id)}}function Fu(t,e){const n=new Map,i=new Set;let s;const r=a=>{const o=n.get(a.id);if(o!==void 0)return o;if(i.has(a.id))return s=a.id,Number.POSITIVE_INFINITY;i.add(a.id);const c=a.target.kind==="sheet"?1:1+r(e.get(a.target.operationId));return i.delete(a.id),n.set(a.id,c),c};for(const a of[...t].sort(Uu)){if(s)break;r(a)}return{depths:n,...s===void 0?{}:{cycleId:s}}}function Uu(t,e){return t.id.localeCompare(e.id)}function w0(t){return[...t].sort((e,n)=>(e.entities[0]?.id??"").localeCompare(n.entities[0]?.id??"")||e.code.localeCompare(n.code))}function on(t,e,n,i,s){return{severity:"error",category:new Set(["SPATIAL_OPERATION_UNSUPPORTED","SPATIAL_TARGET_DEPTH_UNSUPPORTED","SPATIAL_ALIGNMENT_UNSUPPORTED"]).has(t)?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:n,id:i}}],entities:[{kind:n,id:i}],...s===void 0?{}:{suggestion:s}}}function Ou(t){const e=S0(t);if(e.length>0)return Xn(R0(t),e);const n=[],i=[];for(const u of t.operations){const d=C0(u,t.sheet.deployedAngle);d.ok?n.push(d.value):i.push(d.diagnostic)}if(i.length>0)return Xn(t.operations,gs(i));const s=Nu(t.operations);n.sort((u,d)=>s.get(u.operation.id)-s.get(d.operation.id)||u.operation.id.localeCompare(d.operation.id));const r={...t,operations:n.map(({operation:u,resolved:d})=>({...u,xOffset:d.xOffset,width:d.width,height:d.height,depth:d.depth}))},a=P0(r),o=bc(a);if(o.length>0)return Xn(t.operations,gs(o));const c=Pu(a);if(!c.ok)return Xn(t.operations,gs(c.diagnostics));const l=f0(a,r.pathSampleCount);if(!l.ok)return Xn(t.operations,gs(l.diagnostics));if(l.path.evidence.classification==="invalid")return Xn(t.operations,gs(l.path.diagnostics));const h=n.find(({operation:u})=>u.kind==="stair");if(h){const u=h.operation,d=mc({operationId:u.id,width:u.width,stepCount:u.stepCount,stepRun:u.stepRun,stepRise:u.stepRise,hostWidth:t.sheet.width,hostFloorExtent:t.sheet.floorExtent,hostWallExtent:t.sheet.wallExtent});if(!d.ok)return Xn(t.operations,d.diagnostics);const f=_c({input:{operationId:u.id,width:u.width,stepCount:u.stepCount,stepRun:u.stepRun,stepRise:u.stepRise,hostWidth:t.sheet.width,hostFloorExtent:t.sheet.floorExtent,hostWallExtent:t.sheet.wallExtent},complex:d.complex,sourceMap:d.sourceMap,sampleCount:r.pathSampleCount});return f.ok?{ok:!0,mechanism:"stair",normalizedProgram:r,assembly:a,compiledAssembly:c.assembly,path:l.path,decisions:n.map(Sl).sort(bl),traces:El(n,c.assembly),stair:{complex:d.complex,sourceMap:d.sourceMap,path:f}}:Xn(t.operations,f.diagnostics)}return{ok:!0,mechanism:"paired",normalizedProgram:r,assembly:a,compiledAssembly:c.assembly,path:l.path,decisions:n.map(Sl).sort(bl),traces:El(n,c.assembly)}}function R0(t){return Array.isArray(t?.operations)?t.operations.filter(e=>e!==null&&typeof e=="object"&&typeof e.id=="string"&&e.id.length>0&&Du.includes(e.kind)):[]}function C0(t,e){if(t.alignment==="axisAligned"&&Math.abs(e-Math.PI/2)>Je.absoluteAngle)return{ok:!1,diagnostic:Al("SPATIAL_ALIGNMENT_UNSUPPORTED","Axis-aligned spatial compilation is bounded to the orthogonal deployed base case.",t.id,"Use a pi/2 deployed angle or request allowRotated.")};let n=t.height,i=t.depth,s=!1;if(t.alignment==="axisAligned"&&n!==i){if(t.mismatchPolicy==="reject")return{ok:!1,diagnostic:Al("SPATIAL_DIMENSION_CONFLICT","Axis-aligned paired geometry requires equal height and depth.",t.id,"Set equal dimensions or select an explicit preserve policy.")};s=!0,t.mismatchPolicy==="preserveHeight"?i=n:n=i}return{ok:!0,value:{operation:t,resolved:{xOffset:t.xOffset,width:t.width,height:n,depth:i,alignment:t.alignment},constrained:s}}}function P0(t){return{id:`spatial-assembly:${t.id}`,sheet:{...t.sheet},nodes:t.operations.map(e=>({id:Zr(e.id),parameters:{width:e.width,height:e.height,depth:e.depth,deployedAngle:t.sheet.deployedAngle},attachment:e.target.kind==="sheet"?{kind:"sheet",xOffset:e.xOffset}:{kind:"generatedPair",parentNodeId:Zr(e.target.operationId),xOffset:e.xOffset}})),sharedPortConstraints:[]}}function Sl(t){const{operation:e,resolved:n,constrained:i}=t;return{operationId:e.id,operationKind:e.kind,status:i?"constrained":"accepted",message:i?"Dimensions were projected under the declared mismatch policy.":`${e.kind} compiled as a paired two-plane mechanism.`,requested:ku(e),resolved:n,constraintIds:i?["axis-aligned-equal-links",`policy:${e.mismatchPolicy}`]:[e.alignment==="axisAligned"?"axis-aligned-equal-links":"general-two-plane-linkage"]}}function Xn(t,e){return{ok:!1,diagnostics:e,decisions:[...t].sort((n,i)=>n.id.localeCompare(i.id)).map(n=>{const i=e.filter(r=>I0(r,n.id)),s=i.map(r=>r.code);return{operationId:n.id,operationKind:n.kind,status:"rejected",message:i[0]?.message??"The atomic spatial program was rejected because another operation failed.",requested:ku(n),constraintIds:s.length>0?s:["atomic-program-admissibility"]}})}}function I0(t,e){return t.entities.some(n=>n.id===e||n.id===Zr(e))}function ku(t){return{target:t.target,xOffset:t.xOffset,width:t.width,height:t.height,depth:t.depth,alignment:t.alignment,mismatchPolicy:t.mismatchPolicy}}function El(t,e){const n=new Map(e.sourceMap.nodes.map(i=>[i.nodeId,i]));return t.map(({operation:i})=>{const s=Zr(i.id),r=n.get(s);return{operationId:i.id,operationKind:i.kind,nodeId:s,faceIds:r.faceIds,edgeIds:r.edgeIds}}).sort((i,s)=>i.operationId.localeCompare(s.operationId))}function Zr(t){return`spatial-node:${t}`}function bl(t,e){return t.operationId.localeCompare(e.operationId)}function gs(t){return[...t].sort((e,n)=>(e.entities[0]?.id??"").localeCompare(n.entities[0]?.id??"")||e.code.localeCompare(n.code))}function Al(t,e,n,i){return{severity:"error",category:t==="SPATIAL_ALIGNMENT_UNSUPPORTED"?"unsupported":"kinematics",code:t,message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:n}}],entities:[{kind:"spatialOperation",id:n}],...i===void 0?{}:{suggestion:i}}}const L0=1;function Bu(t){return H0(t)?{ok:!0,example:t}:{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Validation examples require schema version 1, metadata, finite tolerance, typed input, and expected output.",locations:[{kind:"entity",entity:{kind:"validationExample",id:Rl(t)}}],entities:[{kind:"validationExample",id:Rl(t)}]}]}}function D0(t){switch(t.kind){case"singleHinge":return N0(t);case"singleVertex":return F0(t);case"twoPlanePopUp":return U0(t);case"spatialProgram":return O0(t)}}function N0(t){const e=xc(t.input.assignment),n=Su({complex:e,hingeEdgeId:"hinge",parentFaceId:"left",parentPose:tn(),angle:t.input.angle,stateId:`validation:${t.id}`}),i=[Rt("solution-status","kernelContract",t.expected.ok,n.ok)],s=n.ok?[]:[...n.diagnostics];if(!n.ok)return i.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],n.diagnostics.map(o=>o.code))),ii(t,i,s,{disposition:"rejected"});const r=n.state.facePoses.find(o=>o.faceId===n.childFaceId),a=pt(r.transform,[2,0,0]);return t.expected.childPoint&&(i.push(Jr("canonical-child-trajectory","independentOracle",t.expected.childPoint,a,t.tolerance)),i.push(Jr("closed-form-child-trajectory","independentOracle",[1+Math.cos(t.input.angle),0,-Math.sin(t.input.angle)],a,t.tolerance))),i.push(Rt("evidence-classification","kernelContract",t.expected.classification,n.certificate.classification)),ii(t,i,s,{disposition:"accepted",classification:n.certificate.classification})}function F0(t){const e=pc(t.input.sectorAngles,t.input.assignments,t.tolerance),n=z0(t.input.sectorAngles,t.input.assignments,t.tolerance),i=[Rt("oracle-kawasaki","independentOracle",t.expected.kawasaki,n.kawasaki),Rt("oracle-maekawa","independentOracle",t.expected.maekawa,n.maekawa),Rt("kernel-kawasaki","kernelContract",t.expected.kawasaki,e.kawasaki.status),Rt("kernel-maekawa","kernelContract",t.expected.maekawa,e.maekawa.status),Rt("local-flat-foldability","kernelContract",t.expected.locallyFlatFoldable,e.locallyFlatFoldable)],s=[],r=[{kind:"vertex",id:"vertex:center"},...t.input.sectorAngles.map((a,o)=>({kind:"sectorRay",id:`sectorRay:${o}`}))];return e.kawasaki.status!=="satisfied"&&s.push(fl({severity:"error",category:"kinematics",code:"KINEMATICS_KAWASAKI_FAILED",message:"The single vertex does not satisfy Kawasaki's alternating-sector condition.",locations:[...r.map(a=>({kind:"entity",entity:a})),{kind:"parameter",path:["input","sectorAngles"]}]})),e.maekawa.status!=="satisfied"&&s.push(fl({severity:"error",category:"kinematics",code:"KINEMATICS_MAEKAWA_FAILED",message:"The single vertex does not satisfy Maekawa's mountain-valley count.",locations:[...r.map(a=>({kind:"entity",entity:a})),{kind:"parameter",path:["input","assignments"]}]})),ii(t,i,s,{disposition:e.locallyFlatFoldable?"accepted":"rejected"})}function U0(t){const e=B0(t.input),n=la(e,e.deployedAngle),i=[Rt("solution-status","kernelContract",t.expected.ok,n.ok)],s=n.ok?[]:[...n.diagnostics];if(!n.ok)return i.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],n.diagnostics.map(o=>o.code))),ii(t,i,s,{disposition:"rejected"});const r=V0(e);i.push(Jr("reflection-oracle","independentOracle",r,n.state.points.junction,t.tolerance)),t.expected.deployedJunction&&i.push(Jr("expected-deployed-junction","independentOracle",t.expected.deployedJunction,n.state.points.junction,t.tolerance)),i.push(Tl("floor-link-length","independentOracle",e.depth,ot(Ye(n.state.points.junction,n.state.points.floorAnchor)),t.tolerance),Tl("wall-link-length","independentOracle",e.height,ot(Ye(n.state.points.junction,n.state.points.wallAnchor)),t.tolerance),Rt("axis-alignment","kernelContract",t.expected.axisAligned,n.state.axisAligned));const a=Ec(e,t.input.sampleCount);return i.push(Rt("path-classification","kernelContract",t.expected.classification,a.ok?a.path.certificate.classification:void 0)),a.ok?ii(t,i,s,{disposition:"accepted",classification:a.path.certificate.classification}):ii(t,i,a.diagnostics,{disposition:"rejected"})}function O0(t){const e=Ou(t.input),n=[Rt("compilation-status","kernelContract",t.expected.ok,e.ok)];if(!e.ok)return n.push(Rt("diagnostic-codes","kernelContract",t.expected.diagnosticCodes??[],e.diagnostics.map(s=>s.code))),ii(t,n,[...e.diagnostics],{disposition:e.diagnostics.some(s=>s.category==="unsupported")?"unsupported":"rejected"});n.push(Rt("path-classification","kernelContract",t.expected.classification,e.path.evidence.classification),Rt("canonical-topology","artifactIntegrity",[],Ci(e.compiledAssembly.complex).map(s=>s.code)),Rt("complete-source-traces","artifactIntegrity",!0,e.traces.every(s=>s.faceIds.length>0&&s.edgeIds.length>0)));const i=k0(e);return n.push(Rt("simulator-job-readiness","artifactIntegrity",!0,i!==void 0)),ii(t,n,[],{disposition:"accepted",classification:e.path.evidence.classification},i)}function k0(t){const e=t.compiledAssembly,n=P_(e,{foldPercent:1,axialStiffness:20,faceStiffness:.2,creaseStiffness:.7,calculateFaceStrain:!0}),i=B_(e,Cl,$0),s=D_(e,Cl,{timestep:1/240,substeps:20,errorReductionParameter:.1,gravity:0,linearDamping:.05,angularDamping:.05,springStiffness:100,torqueStiffness:100,forceDamping:50,torqueDamping:2,filterConnectedCollisions:!0,maximumSteps:720});if(!(!n.ok||!i.ok||!s.ok))return{fold:yu(e.complex),svg:U_(e.complex),evidence:t.path.evidence,sourceTraces:t.traces,origamiSimulatorJob:n.job,swompsJob:i.job,pyKirigamiJob:s.job}}function B0(t){return{id:t.id,width:t.width,height:t.height,depth:t.depth,deployedAngle:t.deployedAngle}}function V0(t){const e=t.deployedAngle,n=[0,t.depth,0],i=[0,t.height*Math.cos(e),t.height*Math.sin(e)],s=t.depth**2+t.height**2-2*t.depth*t.height*Math.cos(e),r=t.depth*(t.depth-t.height*Math.cos(e))/s;return[0,2*(n[1]+r*(i[1]-n[1])),2*(n[2]+r*(i[2]-n[2]))]}function z0(t,e,n){const i=t.length%2===0,s=t.filter((u,d)=>d%2===0).reduce((u,d)=>u+d,0),r=t.filter((u,d)=>d%2===1).reduce((u,d)=>u+d,0),a=i&&Math.abs(s-Math.PI)<=n&&Math.abs(r-Math.PI)<=n?"satisfied":"failed",o=e.every(u=>u==="mountain"||u==="valley"),c=e.filter(u=>u==="mountain").length,l=e.filter(u=>u==="valley").length,h=o?Math.abs(c-l)===2?"satisfied":"failed":"notApplicable";return{kawasaki:a,maekawa:h}}function ii(t,e,n,i,s){return{exampleId:t.id,title:t.title,kind:t.kind,status:e.every(r=>r.passed)?"passed":"failed",observed:i,checks:e,diagnostics:n,...s===void 0?{}:{artifacts:s}}}function Rt(t,e,n,i){return{id:t,method:e,passed:JSON.stringify(n)===JSON.stringify(i),expected:n,actual:i}}function Tl(t,e,n,i,s){const r=Math.abs(i-n);return{id:t,method:e,passed:r<=s,expected:n,actual:i,residual:r,tolerance:s}}function Jr(t,e,n,i,s){const r=Math.max(...n.map((a,o)=>Math.abs(a-i[o])));return{id:t,method:e,passed:r<=s,expected:n,actual:i,residual:r,tolerance:s}}function H0(t){return Si(t)?t.schemaVersion===L0&&mi(t.id)&&mi(t.title)&&["valid","boundary","invalid","unsupported"].includes(String(t.fixtureClass))&&["singleHinge","singleVertex","twoPlanePopUp","spatialProgram"].includes(String(t.kind))&&mi(t.mechanismFamily)&&t.units==="meter-radian"&&Array.isArray(t.assumptions)&&t.assumptions.every(mi)&&mi(t.provenance)&&Number.isFinite(t.tolerance)&&Number(t.tolerance)>=0&&Si(t.input)&&Si(t.expected)&&G0(t):!1}function G0(t){const e=t.input,n=t.expected;return!Si(e)||!Si(n)||typeof n.ok=="string"?!1:t.kind==="singleHinge"?["mountain","valley"].includes(String(e.assignment))&&Number.isFinite(e.angle)&&typeof n.ok=="boolean"&&wl(n.childPoint)&&ya(n.diagnosticCodes):t.kind==="singleVertex"?W0(e.sectorAngles)&&Array.isArray(e.assignments)&&e.assignments.every(i=>["mountain","valley","unassigned"].includes(String(i)))&&e.sectorAngles.length===e.assignments.length&&Si(e.paper)&&Number.isFinite(e.paper.width)&&Number(e.paper.width)>0&&Number.isFinite(e.paper.height)&&Number(e.paper.height)>0&&Array.isArray(e.paper.center)&&e.paper.center.length===2&&e.paper.center.every(i=>Number.isFinite(i))&&["satisfied","failed"].includes(String(n.kawasaki))&&["satisfied","failed","notApplicable"].includes(String(n.maekawa))&&typeof n.locallyFlatFoldable=="boolean":t.kind==="twoPlanePopUp"?mi(e.id)&&[e.width,e.height,e.depth,e.deployedAngle].every(Number.isFinite)&&Number.isInteger(e.sampleCount)&&typeof n.ok=="boolean"&&wl(n.deployedJunction)&&ya(n.diagnosticCodes):t.kind==="spatialProgram"&&typeof n.ok=="boolean"&&ya(n.diagnosticCodes)}function W0(t){return Array.isArray(t)&&t.every(Number.isFinite)}function wl(t){return t===void 0||Array.isArray(t)&&t.length===3&&t.every(Number.isFinite)}function ya(t){return t===void 0||Array.isArray(t)&&t.every(e=>typeof e=="string")}function Si(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)}function mi(t){return typeof t=="string"&&t.length>0}function Rl(t){return Si(t)&&mi(t.id)?t.id:"unknown"}const Cl={id:"validation-cardstock",material:{id:"validation-paper",density:700,youngModulus:25e8,poissonRatio:.3},panelThickness:3e-4,crease:{model:"concentratedHinge",rotationalStiffness:.02},contact:{mode:"coulomb",clearance:1e-4,collisionMargin:2e-5,frictionCoefficient:.4,restitution:0}},$0={id:"validation-laser",kerf:15e-5,lengthTolerance:5e-5,angleTolerance:Math.PI/360,minimumFeatureWidth:5e-4,minimumBridgeWidth:.001,nominalCreaseWidth:3e-4},Qt=1e-9;function X0(t){const e=new Map;for(const n of t){const i=q0(n),s=e.get(i.key)??{plane:i,faces:[]};s.faces.push(n),e.set(i.key,s)}return[...e.entries()].sort(([n],[i])=>n.localeCompare(i)).flatMap(([,n],i)=>Y0(n.plane,n.faces,i)).sort(ex)}function Y0(t,e,n){if(e.length<2)return e;const[i,s]=K0(t.normal),r=e.map(l=>Z0(l,i,s));if(!J0(r))return e;const a=Pl(r.flatMap(l=>[l.uMinimum,l.uMaximum])),o=Pl(r.flatMap(l=>[l.vMinimum,l.vMaximum])),c=[];for(let l=0;l<a.length-1;l+=1)for(let h=0;h<o.length-1;h+=1){const u=a[l],d=a[l+1],f=o[h],p=o[h+1];if(d-u<=Qt||p-f<=Qt)continue;const _=(u+d)/2,m=(f+p)/2,g=r.filter(w=>_>w.uMinimum-Qt&&_<w.uMaximum+Qt&&m>w.vMinimum-Qt&&m<w.vMaximum+Qt);if(g.length===0)continue;const A=[...new Set(g.flatMap(({face:w})=>w.sourceOperationId===void 0?[]:[w.sourceOperationId]))];c.push({id:`coalesced-face:${n}:${l}:${h}`,vertices:[nr(t,i,s,u,f),nr(t,i,s,d,f),nr(t,i,s,d,p),nr(t,i,s,u,p)],sourceEntities:j0(g.flatMap(({face:w})=>w.sourceEntities)),...A.length===1?{sourceOperationId:A[0]}:{}})}return c}function q0(t){const e=fo(t.vertices[1],t.vertices[0]),n=fo(t.vertices[2],t.vertices[0]);let i=po(Vu(e,n));const s=i.findIndex(a=>Math.abs(a)>Qt);s>=0&&i[s]<0&&(i=Qi(i,-1));const r=es(i,t.vertices[0]);return{normal:i,offset:r,key:[...i,r].map(a=>Q0(a)).join(":")}}function K0(t){const n=[...[[1,0,0],[0,1,0],[0,0,1]]].sort((s,r)=>Math.abs(es(s,t))-Math.abs(es(r,t)))[0],i=po(fo(n,Qi(t,es(n,t))));return[i,po(Vu(t,i))]}function Z0(t,e,n){const i=t.vertices.map(r=>es(r,e)),s=t.vertices.map(r=>es(r,n));return{face:t,uMinimum:Math.min(...i),uMaximum:Math.max(...i),vMinimum:Math.min(...s),vMaximum:Math.max(...s)}}function J0(t){for(let e=0;e<t.length;e+=1)for(let n=e+1;n<t.length;n+=1){const i=t[e],s=t[n];if(Math.min(i.uMaximum,s.uMaximum)-Math.max(i.uMinimum,s.uMinimum)>Qt&&Math.min(i.vMaximum,s.vMaximum)-Math.max(i.vMinimum,s.vMinimum)>Qt)return!0}return!1}function nr(t,e,n,i,s){return Il(Il(Qi(e,i),Qi(n,s)),Qi(t.normal,t.offset))}function Pl(t){const e=[];for(const n of[...t].sort((i,s)=>i-s))(e.length===0||Math.abs(n-e[e.length-1])>Qt)&&e.push(n);return e}function j0(t){return[...new Map([...t].sort((e,n)=>`${e.kind}\0${e.id}`.localeCompare(`${n.kind}\0${n.id}`)).map(e=>[`${e.kind}\0${e.id}`,e])).values()]}function Il(t,e){return t.map((n,i)=>n+e[i])}function fo(t,e){return t.map((n,i)=>n-e[i])}function Qi(t,e){return t.map(n=>n*e)}function Vu(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}function es(t,e){return t.reduce((n,i,s)=>n+i*e[s],0)}function po(t){const e=Math.hypot(...t);if(!Number.isFinite(e)||e<=Qt)throw new RangeError("Paper face requires a finite nonzero normal.");return Qi(t,1/e)}function Q0(t){return(Math.round(t/Qt)*Qt).toFixed(9)}function ex(t,e){return t.id.localeCompare(e.id)}function zu(t,e,n){if(!Number.isFinite(n.width)||!Number.isFinite(n.height)||n.width<=0||n.height<=0||n.center.length!==2||!n.center.every(Number.isFinite)||t.length===0||t.length!==e.length)throw new RangeError("Single-vertex paper input is not finite and bounded.");const[i,s]=n.center,r=[i,s,0],a=tx(n),o=2*(n.width+n.height);let c=0;const l=t.map(f=>{const p=nx(c,n);return c+=f,p}),h=[{id:"vertex:center",position:r,role:"vertex",sourceEntities:[{kind:"vertex",id:"vertex:center"}]},...a.map((f,p)=>({id:`paper:corner:${p}`,position:f.position,role:"vertex",sourceEntities:[{kind:"paperBoundary",id:`paper:corner:${p}`}]})),...l.map((f,p)=>({id:`vertex:ray:${p}`,position:f.position,role:"vertex",sourceEntities:[{kind:"sectorRay",id:`sectorRay:${p}`}]}))],u=[...a.map((f,p)=>({id:`paper:boundary:${p}`,start:f.position,end:a[(p+1)%a.length].position,role:"boundary",sourceEntities:[{kind:"paperBoundary",id:`paper:boundary:${p}`}]})),...l.map((f,p)=>({id:`crease:${p}`,start:r,end:f.position,role:sx(e[p]),sourceEntities:[{kind:"sectorRay",id:`sectorRay:${p}`}]}))],d=l.map((f,p)=>{const _=l[(p+1)%l.length],m=Ll(f.perimeter,_.perimeter,o),g=a.map(A=>({corner:A,distance:Ll(f.perimeter,A.perimeter,o)})).filter(A=>A.distance>1e-12&&A.distance<m-1e-12).sort((A,w)=>A.distance-w.distance).map(A=>A.corner.position);return{id:`paper:sector:${p}`,vertices:[r,f.position,...g,_.position],sourceEntities:[{kind:"singleVertexFace",id:`singleVertexFace:${p}`}]}});return{points:h.sort(Sa),segments:u.sort(Sa),faces:d.sort(Sa)}}function tx(t){const[e,n]=t.center,i=e-t.width/2,s=e+t.width/2,r=n-t.height/2,a=n+t.height/2;return[{position:[i,r,0],perimeter:0},{position:[s,r,0],perimeter:t.width},{position:[s,a,0],perimeter:t.width+t.height},{position:[i,a,0],perimeter:2*t.width+t.height}]}function nx(t,e){const[n,i]=e.center,s=Math.cos(t),r=Math.sin(t),a=e.width/2,o=e.height/2,c=Math.abs(s)<1e-14?Number.POSITIVE_INFINITY:a/Math.abs(s),l=Math.abs(r)<1e-14?Number.POSITIVE_INFINITY:o/Math.abs(r),h=Math.min(c,l),u=n+s*h,d=i+r*h;return{position:[u,d,0],perimeter:ix(u,d,e)}}function ix(t,e,n){const[i,s]=n.center,r=i-n.width/2,a=i+n.width/2,o=s-n.height/2,c=s+n.height/2,l=1e-9;return Math.abs(e-o)<=l?t-r:Math.abs(t-a)<=l?n.width+(e-o):Math.abs(e-c)<=l?n.width+n.height+(a-t):2*n.width+n.height+(c-e)}function Ll(t,e,n){const i=(e-t+n)%n;return i<=1e-12?n:i}function sx(t){return t==="mountain"?"hingeMountain":t==="valley"?"hingeValley":"hingeUnassigned"}function Sa(t,e){return t.id.localeCompare(e.id)}function Hu(t,e){if(!Number.isFinite(e.width)||e.width<=0)return{points:[],segments:[],faces:[]};const n=t.frames.parentFloor.widthAxis,i=[["origin",t.points.origin],["floor-anchor",t.points.floorAnchor],["junction",t.points.junction],["wall-anchor",t.points.wallAnchor]],s=[["parent-floor",t.points.origin,t.points.floorAnchor],["child-wall",t.points.floorAnchor,t.points.junction],["child-floor",t.points.junction,t.points.wallAnchor],["parent-wall",t.points.wallAnchor,t.points.origin]],r=(e.diagnosticSpans??[]).map(h=>({...h,minimum:Math.max(0,Math.min(e.width,h.minimum)),maximum:Math.max(0,Math.min(e.width,h.maximum))})).filter(h=>h.maximum>h.minimum),a=[...new Set([0,e.width,...r.flatMap(h=>[h.minimum,h.maximum])])].sort((h,u)=>h-u),o=i.flatMap(([h,u])=>a.map((d,f)=>({id:`panel-point:${h}:${f}`,position:Pn(u,n,d),role:"vertex",sourceEntities:[...e.sourceEntities,{kind:"twoPlanePoint",id:`${t.id}:${h}`}]}))),c=[...i.flatMap(([h,u])=>Dl(a).map(([d,f],p)=>({id:`panel-hinge:${h}:${p}`,start:Pn(u,n,d),end:Pn(u,n,f),role:"hingeUnassigned",sourceEntities:[...e.sourceEntities,{kind:"twoPlaneHinge",id:`${t.id}:${h}`},...Nl(r,d,f)]}))),...[0,e.width].flatMap((h,u)=>s.map(([d,f,p])=>({id:`panel-boundary:${u}:${d}`,start:Pn(f,n,h),end:Pn(p,n,h),role:"boundary",sourceEntities:[...e.sourceEntities,{kind:"twoPlanePanel",id:`${t.id}:${d}`}]})))],l=s.flatMap(([h,u,d])=>Dl(a).map(([f,p],_)=>({id:`panel-face:${h}:${_}`,vertices:[Pn(u,n,f),Pn(d,n,f),Pn(d,n,p),Pn(u,n,p)],sourceEntities:[...e.sourceEntities,{kind:"twoPlanePanel",id:`${t.id}:${h}`},...Nl(r,f,p)]})));return{points:o.sort(Ea),segments:c.sort(Ea),faces:l.sort(Ea)}}function Pn(t,e,n){return kt(t,yt(e,n))}function Dl(t){return t.slice(0,-1).map((e,n)=>[e,t[n+1]])}function Nl(t,e,n){const i=(e+n)/2;return rx(t.filter(s=>i>s.minimum&&i<s.maximum).flatMap(s=>s.sourceEntities))}function rx(t){return[...new Map(t.map(e=>[`${e.kind}\0${e.id}`,e])).values()]}function Ea(t,e){return t.id.localeCompare(e.id)}function ax(t,e){const n=ox(t),i=[...n.points],s=[...n.segments],r=[...n.faces],a=yc(t.sheet,t.sheet.deployedAngle),o=Nu(t.operations),c=dx(t.operations),l=new Map,h=[...t.operations].sort((u,d)=>(o.get(u.id)??Number.POSITIVE_INFINITY)-(o.get(d.id)??Number.POSITIVE_INFINITY)||u.id.localeCompare(d.id));for(const u of h){const d=u.target.kind==="sheet"?a:l.get(u.target.operationId)?.outputPort;if(!d)continue;if(u.kind==="opening"){cx(i,s,u,d);continue}const f=la({id:`authoring:${u.id}`,width:u.width,height:u.height,depth:u.depth,deployedAngle:t.sheet.deployedAngle},t.sheet.deployedAngle);if(!f.ok)continue;const p=Tu(f.state,d,u.xOffset),_=c.get(u.id);if(!_)continue;const m=[{kind:"spatialOperation",id:u.id},{kind:"popUpNode",id:`spatial-node:${u.id}`}],g=Hu(p,{width:u.width,sourceEntities:m,diagnosticSpans:lx(t,u,c,e)});ux(i,s,r,u.id,g),l.set(u.id,{operation:u,state:p,globalInterval:_,outputPort:Au({id:u.id,width:u.width,height:u.height,depth:u.depth,deployedAngle:t.sheet.deployedAngle},p,`spatial-node:${u.id}`)})}return{points:i.sort(Ul),segments:s.sort(Ul),faces:X0(r)}}function ox(t){const e=yc(t.sheet,t.sheet.deployedAngle),n=e.origin,i=e.boundary.end,s=kt(n,yt(e.floor.frame.inPlaneAxis,e.floor.extent)),r=kt(i,yt(e.floor.frame.inPlaneAxis,e.floor.extent)),a=kt(n,yt(e.wall.frame.inPlaneAxis,e.wall.extent)),o=kt(i,yt(e.wall.frame.inPlaneAxis,e.wall.extent)),c=[{kind:"spatialProgram",id:t.id},{kind:"sheet",id:t.sheet.id}],l=[...c,{kind:"sheetSurface",id:`${t.sheet.id}:floor`}],h=[...c,{kind:"sheetSurface",id:`${t.sheet.id}:wall`}];return{points:[pi("sheet:hinge:start",n,c),pi("sheet:hinge:end",i,c),pi("sheet:floor:start",s,l),pi("sheet:floor:end",r,l),pi("sheet:wall:start",a,h),pi("sheet:wall:end",o,h)],segments:[un("sheet:hinge",n,i,"hingeUnassigned",c),un("sheet:floor:left",n,s,"boundary",l),un("sheet:floor:outer",s,r,"boundary",l),un("sheet:floor:right",r,i,"boundary",l),un("sheet:wall:left",n,a,"boundary",h),un("sheet:wall:outer",a,o,"boundary",h),un("sheet:wall:right",o,i,"boundary",h)],faces:[{id:"sheet:floor",vertices:[n,i,r,s],sourceEntities:l},{id:"sheet:wall",vertices:[n,a,o,i],sourceEntities:h}]}}function cx(t,e,n,i){const s=kt(i.origin,yt(i.widthAxis,n.xOffset)),r=kt(s,yt(i.widthAxis,n.width)),a=kt(s,yt(i.wall.frame.inPlaneAxis,n.height)),o=kt(r,yt(i.wall.frame.inPlaneAxis,n.height)),c=[{kind:"spatialOperation",id:n.id}],l=[["lower-start",s],["lower-end",r],["upper-end",o],["upper-start",a]];t.push(...l.map(([h,u])=>pi(`opening:${n.id}:${h}`,u,c))),e.push(un(`opening:${n.id}:bottom`,s,r,"cut",c),un(`opening:${n.id}:right`,r,o,"cut",c),un(`opening:${n.id}:top`,o,a,"cut",c),un(`opening:${n.id}:left`,a,s,"cut",c))}function lx(t,e,n,i){const s=[],r=n.get(e.id);if(!r)return s;const a=i.flatMap(c=>c.locations.flatMap(l=>l.kind==="entity"?[l.entity]:[]));for(const c of t.operations){if(c.id===e.id||Fl(c)!==Fl(e))continue;const l=Eu(`spatial-node:${e.id}`,`spatial-node:${c.id}`),h=a.find(p=>p.kind==="overlapRegion"&&p.id===l),u=n.get(c.id);if(!h||!u)continue;const d=Math.max(r[0],u[0]),f=Math.min(r[1],u[1]);f>d&&s.push({minimum:d-r[0],maximum:f-r[0],sourceEntities:[h]})}const o=a.find(c=>c.kind==="outOfBoundsRegion"&&c.id===bu(`spatial-node:${e.id}`));if(o){const c=e.target.kind==="generatedPair"?e.target.operationId:void 0,l=c===void 0?t.sheet.width:t.operations.find(h=>h.id===c)?.width;l!==void 0&&(e.xOffset<0&&s.push({minimum:0,maximum:Math.min(e.width,-e.xOffset),sourceEntities:[o]}),e.xOffset+e.width>l&&s.push({minimum:Math.max(0,l-e.xOffset),maximum:e.width,sourceEntities:[o]}))}return s}function dx(t){const e=new Map(t.map(s=>[s.id,s])),n=new Map,i=s=>{const r=n.get(s.id);if(r)return r;const a=s.target.kind==="sheet"?s.xOffset:i(e.get(s.target.operationId)).at(0)+s.xOffset,o=[a,a+s.width];return n.set(s.id,o),o};for(const s of t)i(s);return n}function ux(t,e,n,i,s){const r=`operation:${i}:`;t.push(...s.points.map(a=>({...a,id:`${r}${a.id}`}))),e.push(...s.segments.map(a=>({...a,id:`${r}${a.id}`}))),n.push(...s.faces.map(a=>({...a,id:`${r}${a.id}`,sourceOperationId:i})))}function Fl(t){return t.target.kind==="sheet"?"sheet":`operation:${t.target.operationId}`}function pi(t,e,n){return{id:t,position:e,role:"vertex",sourceEntities:n}}function un(t,e,n,i,s){return{id:t,start:e,end:n,role:i,sourceEntities:s}}function Ul(t,e){return t.id.localeCompare(e.id)}function hx(t){const e=D0(t),n=fx(t,e).sort((s,r)=>s.parameter-r.parameter),i=e.observed.disposition==="accepted"?void 0:Sx(t,e.diagnostics);return{example:t,result:e,frames:n,...i===void 0?{}:{diagnosticPreview:i}}}function fx(t,e){switch(t.kind){case"singleHinge":return px(t,e);case"singleVertex":return e.observed.disposition==="accepted"?[{parameter:0,frame:zu(t.input.sectorAngles,t.input.assignments,t.input.paper)}]:[];case"twoPlanePopUp":return mx(t,e);case"spatialProgram":return gx(t,e)}}function px(t,e){if(e.observed.disposition!=="accepted")return[];const n=xc(t.input.assignment),i=Su({complex:n,hingeEdgeId:"hinge",parentFaceId:"left",parentPose:tn(),angle:t.input.angle,stateId:`validation:${t.id}`});return i.ok?[{parameter:t.input.angle,frame:Pi(n,xx(i.state))}]:[]}function mx(t,e){if(e.observed.disposition!=="accepted")return[];const n=Ec(yx(t.input),t.input.sampleCount);return n.ok?n.path.samples.map(i=>({parameter:i.parentAngle,frame:Hu(i,{width:t.input.width,sourceEntities:[{kind:"twoPlanePopUp",id:i.id}]})})):[]}function gx(t,e){if(e.observed.disposition!=="accepted")return[];const n=Ou(t.input);if(!n.ok)return[];const i=[...n.path.samples].sort((r,a)=>a.parentAngle-r.parentAngle)[0],s=new Map(n.traces.flatMap(r=>r.faceIds.map(a=>[a,r.operationId])));return n.path.samples.map(r=>({parameter:r.parentAngle,frame:Pi(n.compiledAssembly.complex,_x(n.compiledAssembly,i,r),s)}))}function _x(t,e,n){return new Map(t.sourceMap.faces.map(({faceId:i,owner:s})=>[i,gc(Ol(e,s),Ol(n,s))]))}function Ol(t,e){if(e.kind==="module"){const i=t.nodes.find(s=>s.nodeId===e.nodeId);if(!i)throw new RangeError(`Missing engine state for ${e.nodeId}.`);return e.role==="childFloor"?i.worldState.frames.childFloor:i.worldState.frames.childWall}const n=[...t.nodes].filter(i=>i.depth===1).sort((i,s)=>i.nodeId.localeCompare(s.nodeId))[0];if(!n)throw new RangeError("Compiled sheet has no root engine state.");return e.role==="floor"?n.worldState.frames.parentFloor:n.worldState.frames.parentWall}function xx(t){return new Map(t.facePoses.map(({faceId:e,transform:n})=>[e,n]))}function Pi(t,e,n=new Map,i){const s=new Map(t.vertices.map(p=>[p.id,p])),r=new Map(t.halfEdges.map(p=>[p.id,p])),a=p=>!0,o=new Map;for(const p of[...t.halfEdges].sort(_s))a(p.face),o.has(p.origin)||o.set(p.origin,p.face);const c=(p,_)=>{const m=s.get(p)?.position,g=e.get(_);if(!m||!g)throw new RangeError(`Missing topology transform for ${p}/${_}.`);return pt(g,[m[0],m[1],0])},l=t.edges.flatMap(p=>{const _=Mx(p);if(_===void 0)return[];const m=[...p.halfEdges].map(A=>r.get(A)).filter(A=>a(A.face)).sort(_s)[0];if(!m)return[];const g=r.get(m.next);return[{edge:p,halfEdge:m,next:g,role:_}]}),h=new Set(l.flatMap(({halfEdge:p,next:_})=>[p.origin,_.origin])),u=t.vertices.filter(p=>h.has(p.id)&&o.has(p.id)).map(p=>({id:p.id,position:c(p.id,o.get(p.id)),role:"vertex",sourceEntities:[{kind:"vertex",id:p.id}]})).sort(_s),d=l.map(({edge:p,halfEdge:_,next:m,role:g})=>({id:p.id,start:c(_.origin,_.face),end:c(m.origin,_.face),role:g,sourceEntities:[{kind:"edge",id:p.id}]})).sort(_s),f=t.faces.filter(p=>a(p.id)).map(p=>{const _=vx(p.boundary,r),m=n.get(p.id),g=[{kind:"face",id:p.id},...m===void 0?[]:[{kind:"spatialOperation",id:m}]];return{id:p.id,vertices:_.map(A=>c(A.origin,p.id)),sourceEntities:g,...m===void 0?{}:{sourceOperationId:m}}}).sort(_s);return{points:u,segments:d,faces:f}}function vx(t,e){const n=[];let i=e.get(t);for(;i&&(n.length===0||i.id!==t);)n.push(i),i=e.get(i.next);return n}function Mx(t){if(t.kind==="boundary")return"boundary";if(t.kind==="cutBank")return"cut";if(t.kind==="hinge")return t.hinge?.assignment==="mountain"?"hingeMountain":t.hinge?.assignment==="valley"?"hingeValley":"hingeUnassigned"}function yx(t){return{id:t.id,width:t.width,height:t.height,depth:t.depth,deployedAngle:t.deployedAngle}}function Sx(t,e){if(t.kind==="singleHinge"){const n=xc(t.input.assignment);return{label:"input topology",frame:Pi(n,new Map(n.faces.map(i=>[i.id,tn()])))}}if(t.kind==="singleVertex")return{label:"input topology",frame:zu(t.input.sectorAngles,t.input.assignments,t.input.paper)};if(t.kind==="twoPlanePopUp"){const n=Ex(t.input);return n===void 0?void 0:{label:"input topology",frame:n}}return{label:"authoring geometry",frame:ax(t.input,e)}}function Ex(t){if(![t.width,t.height,t.depth,t.deployedAngle].every(Number.isFinite))return;const n=[{kind:"twoPlanePopUp",id:t.id}],i=[0,0,0],s=[t.width,0,0],r=[0,t.depth,0],a=[0,Math.cos(t.deployedAngle)*t.height,Math.sin(t.deployedAngle)*t.height];return{points:[{id:"anchor:origin",position:i,role:"anchor",sourceEntities:n},{id:"anchor:width",position:s,role:"anchor",sourceEntities:n},{id:"anchor:floor",position:r,role:"anchor",sourceEntities:n},{id:"anchor:wall",position:a,role:"anchor",sourceEntities:n}],segments:[{id:"input:width",start:i,end:s,role:"link",sourceEntities:n},{id:"input:floor",start:i,end:r,role:"link",sourceEntities:n},{id:"input:wall",start:i,end:a,role:"link",sourceEntities:n}],faces:[]}}function _s(t,e){return t.id.localeCompare(e.id)}const bx=Object.assign({"../../examples/validation/01-hinge-flat.json":$f,"../../examples/validation/02-hinge-intermediate.json":sp,"../../examples/validation/03-hinge-folded.json":_p,"../../examples/validation/04-hinge-assignment-invalid.json":Pp,"../../examples/validation/05-vertex-valid.json":Gp,"../../examples/validation/06-vertex-maekawa-invalid.json":nm,"../../examples/validation/07-popup-symmetric.json":mm,"../../examples/validation/08-popup-unequal.json":Rm,"../../examples/validation/09-popup-invalid.json":zm,"../../examples/validation/10-spatial-root.json":eg,"../../examples/validation/11-spatial-nested-shelf.json":fg,"../../examples/validation/12-spatial-siblings.json":Tg,"../../examples/validation/13-spatial-overlap.json":Bg,"../../examples/validation/14-spatial-depth.json":jg,"../../examples/validation/15-spatial-opening.json":u_,"../../examples/validation/16-spatial-out-of-bounds.json":b_}),ir=Object.entries(bx).sort(([t],[e])=>t.localeCompare(e)).map(([t,e])=>{const n=Bu(e);if(!n.ok)throw new TypeError(`${t}: ${n.diagnostics.map(i=>i.message).join(" ")}`);return{filename:t.slice(t.lastIndexOf("/")+1),example:n.example}});function Ax(t=new Worker(new URL("/kirigami/assets/engine-worker-Dg1M99Gg.js",import.meta.url),{type:"module",name:"kirigami-engine-lab"})){let e=1,n=!1;const i=new Map,s=r=>{for(const a of i.values())a.reject(r);i.clear()};return t.onmessage=({data:r})=>{if(n||r===null||typeof r!="object"||!Number.isInteger(r.requestId))return;const a=i.get(r.requestId);a&&(i.delete(r.requestId),r.ok?a.resolve(r.subject):a.reject(new Error(r.message)))},t.onerror=r=>{s(new Error(r.message||"Engine worker failed."))},{evaluate(r){if(n)return Promise.reject(new Error("Engine Lab client is disposed."));const a=e;return e+=1,new Promise((o,c)=>{i.set(a,{resolve:o,reject:c}),t.postMessage({requestId:a,type:"evaluate",example:r})})},dispose(){n||(n=!0,s(new Error("Engine Lab client was disposed.")),t.onmessage=null,t.onerror=null,t.terminate())}}}function Tx(t){const e=[];return mo(t.input,["input"],e),e.sort((n,i)=>Px(n.path,i.path))}function wx(t,e,n){if(e[0]!=="input"||e.length<2||!Number.isFinite(n)||typeof Ix(t,e)!="number")return Lx(t.id);const i=go(t,e,n);return Bu(i)}function mo(t,e,n){if(typeof t=="number"){const i=String(e[e.length-1]);if(i==="schemaVersion"||i==="tolerance")return;n.push({path:e,label:Rx(e),value:t,step:i==="sampleCount"||i==="pathSampleCount"?1:i.toLowerCase().includes("angle")?.01:Math.max(Math.abs(t)*.05,.01)});return}if(Array.isArray(t)){t.forEach((i,s)=>mo(i,[...e,s],n));return}if(!(t===null||typeof t!="object"))for(const i of Object.keys(t).sort())i==="schemaVersion"||i==="tolerance"||mo(t[i],[...e,i],n)}function Rx(t){const e=t.slice(1).map(n=>typeof n=="number"?String(n+1):Cx(n));return e.slice(Math.max(e.length-3,0)).join(" · ")}function Cx(t){const e=t.replace(/([a-z0-9])([A-Z])/g,"$1 $2");return e[0]?.toUpperCase()+e.slice(1)}function Px(t,e){const n=Math.max(t.length,e.length);for(let i=0;i<n;i+=1){const s=t[i],r=e[i];if(s===void 0)return-1;if(r===void 0)return 1;if(s!==r)return typeof s=="number"&&typeof r=="number"?s-r:String(s).localeCompare(String(r))}return 0}function Ix(t,e){let n=t;for(const i of e){if(n===null||typeof n!="object")return;n=n[i]}return n}function go(t,e,n){if(e.length===0)return n;const[i,...s]=e;if(Array.isArray(t)){const a=[...t];return a[Number(i)]=go(a[Number(i)],s,n),a}const r=t;return{...r,[i]:go(r[i],s,n)}}function Lx(t){return{ok:!1,diagnostics:[{severity:"error",category:"evidence",code:"VALIDATION_EXAMPLE_INVALID",message:"Engine Lab parameter edits require a finite numeric input value.",locations:[{kind:"entity",entity:{kind:"validationExample",id:t}}],entities:[{kind:"validationExample",id:t}]}]}}function Dx(t,e,n,i={}){if(!e){t.innerHTML=n?`<div class="inspector-empty inspector-error">${$t(n)}</div>`:'<div class="inspector-empty">Select an example to inspect engine evidence.</div>';return}const{result:s}=e,r=Tx(e.example),a=s.observed.disposition!=="accepted";t.innerHTML=`
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
                      ${o.locations.map(c=>`<li>${$t(Nx(c))}</li>`).join("")}
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
                  <div><dt>Expected</dt><dd>${kl(o.expected)}</dd></div>
                  <div><dt>Actual</dt><dd>${kl(o.actual)}</dd></div>
                  ${o.residual===void 0?"":`<div><dt>Residual</dt><dd>${jr(o.residual)}</dd></div>`}
                  ${o.tolerance===void 0?"":`<div><dt>Tolerance</dt><dd>${jr(o.tolerance)}</dd></div>`}
                </dl>
              </details>`).join("")}
      </div>
    </section>
    <section class="inspection-section parameter-section" aria-label="Parameters">
      <h2>Parameters <span>${r.length}</span></h2>
      <div class="parameter-list">
        ${r.map(o=>`
              <label${Bl(o.path,s.diagnostics,a)===void 0?"":` data-diagnostic-state="${Bl(o.path,s.diagnostics,a)}"`}>
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
  `,t.querySelectorAll("[data-parameter-path]").forEach(o=>{let c;o.addEventListener("input",()=>{c!==void 0&&window.clearTimeout(c);const l=JSON.parse(o.dataset.parameterPath??"[]");c=window.setTimeout(()=>{i.onParameterCommit?.(l,Number(o.value))},240)})}),t.querySelector(".parameter-reset")?.addEventListener("click",()=>i.onReset?.())}function kl(t){return typeof t=="number"?jr(t):$t(JSON.stringify(t)??String(t))}function Nx(t){return t.kind==="entity"?`${t.entity.kind} · ${t.entity.id}`:t.kind==="parameter"?t.path.map(String).join(" · "):t.kind==="sample"?`sample ${t.index+1}${t.parameter===void 0?"":` · parameter ${jr(t.parameter)}`}`:`non-spatial · ${t.reason}`}function Bl(t,e,n){if(!n)return;const i=e.filter(s=>s.locations.some(r=>r.kind==="parameter"&&Fx(t,r.path)));return i.some(s=>s.category!=="unsupported")?"invalid":i.some(s=>s.category==="unsupported")?"unsupported":void 0}function Fx(t,e){return t.length>=e.length&&e.every((n,i)=>t[i]===n)}function jr(t){return t===0?"0":Math.abs(t)>=1e3||Math.abs(t)<.001?t.toExponential(4):t.toPrecision(6)}function $t(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}function Ux(t,e,n,i){const s=Pi(t,i,new Map(e.faces.map(a=>[a.faceId,n.operationId]))),r=s.segments.map(a=>({...a,start:On(a.start),end:On(a.end)}));return{points:ua(r),segments:r,faces:s.faces.map(a=>({...a,vertices:a.vertices.map(On)}))}}function Ox(t,e,n){const i=Pi(t,n,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:On(r.start),end:On(r.end)}));return{points:ua(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(On)}))}}function kx(t,e,n){const i=Pi(t,n,new Map(e.faces.map(r=>[r.faceId,e.operationId]))),s=i.segments.map(r=>({...r,start:ba(r.start),end:ba(r.end)}));return{points:ua(s),segments:s,faces:i.faces.map(r=>({...r,vertices:r.vertices.map(ba)}))}}function Bx(t,e){const n=Pi(t.complex,e.transforms,new Map(t.sourceMap.integratedFaces.map(s=>[s.faceId,`${t.input.operationId}:${s.source}`]))),i=n.segments.map(s=>({...s,start:On(s.start),end:On(s.end)}));return{faces:n.faces.map(s=>({...s,vertices:s.vertices.map(On)})),segments:i,points:ua(i)}}function On([t,e,n]){return[t,n,-e]}function ba([t,e,n]){return[t,-e,n]}function ua(t){const e=new Map;for(const n of t)Vl(e,n.start,n.role,zl(n.end,n.start)),Vl(e,n.end,n.role,zl(n.start,n.end));return[...e.entries()].filter(([,n])=>Vx(n.entries)).sort(([n],[i])=>n.localeCompare(i)).map(([n,i])=>({id:`fabrication-corner:${n}`,position:i.position,role:"vertex",sourceEntities:[]}))}function Vl(t,e,n,i){const s=e.map(a=>Math.round(a*1e9)).join(":"),r=t.get(s)??{position:e,entries:[]};r.entries.push({role:n,direction:i}),t.set(s,r)}function Vx(t){const e=t.filter((r,a,o)=>o.findIndex(c=>c.role===r.role&&zx(c.direction,r.direction))===a);if(e.length!==2)return e.length>0;if(e[0].role!==e[1].role)return!0;const[n,i]=e.map(r=>r.direction),s=[n[1]*i[2]-n[2]*i[1],n[2]*i[0]-n[0]*i[2],n[0]*i[1]-n[1]*i[0]];return Math.hypot(...s)>1e-9}function zx(t,e){const n=Math.hypot(...t),i=Math.hypot(...e);return n<=1e-12||i<=1e-12?!1:(t[0]*e[0]+t[1]*e[1]+t[2]*e[2])/(n*i)>=1-1e-9}function zl(t,e){return[t[0]-e[0],t[1]-e[1],t[2]-e[2]]}function Ac(t){const e=$x(t);if(e)return{ok:!1,diagnostics:[e]};const n=t.stepCount*t.stepRun,i=(t.hostWidth-n)/2,s=Array.from({length:t.stepCount+1},(y,T)=>{const M=i+T*t.stepRun,b=T===0,P=T===t.stepCount,C=b||P?-t.width:(T-1)*t.stepRise-t.width,I=P?(t.stepCount-1)*t.stepRise:T*t.stepRise;return{cutPairId:`cut:long:${T}`,axis:"long",lineIndex:T,start:[M,C],end:[M,I]}}),r=Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:inherited:${T}`,role:"inherited",stepIndex:T,start:[s[T].end[0],T*t.stepRise],end:[s[T+1].end[0],T*t.stepRise]})),a=Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:explicit:${T}`,role:"explicit",stepIndex:T,start:[s[T].start[0],T*t.stepRise-t.width],end:[s[T+1].start[0],T*t.stepRise-t.width]})),o=Gl([0,t.hostWidth,...s.map(y=>y.start[0])]),c=Gl([-t.hostFloorExtent,t.hostWallExtent,0,...s.flatMap(y=>[y.start[1],y.end[1]]),...r.flatMap(y=>[y.start[1],y.end[1]]),...a.flatMap(y=>[y.start[1],y.end[1]])]),l=[],h=[],u=[],d=[],f=[],p=[],_=[];for(let y=0;y<c.length;y+=1)for(let T=0;T<o.length;T+=1)l.push({id:xs(T,y),position:[o[T],c[y]]});for(let y=0;y<c.length-1;y+=1)for(let T=0;T<o.length-1;T+=1){const M=`sheet-face:${y}:${T}`,b=["bottom","right","top","left"].map(D=>`he:${y}:${T}:${D}`);u.push({id:b[0],origin:xs(T,y),next:b[1],edge:"pending",face:M},{id:b[1],origin:xs(T+1,y),next:b[2],edge:"pending",face:M},{id:b[2],origin:xs(T+1,y+1),next:b[3],edge:"pending",face:M},{id:b[3],origin:xs(T,y+1),next:b[0],edge:"pending",face:M}),h.push({id:M,boundary:b[0],holes:[]});const P=[(o[T]+o[T+1])/2,(c[y]+c[y+1])/2],C=Wx(P[0],i,t.stepRun,t.stepCount),I=C===void 0?void 0:Gx(P,r,a),X=C===void 0?void 0:C*t.stepRise-t.width,W=I!==void 0?"tread":C!==void 0&&P[1]>=-t.width&&P[1]<X?"carrier":P[1]<0?"base":"host";p.push({faceId:M,role:W,...I===void 0?{}:{stepIndex:I}})}const m=new Map(u.map(y=>[y.id,y])),g=(y,T)=>{for(const M of y)m.get(M).edge=T.id;y.length===2&&(m.get(y[0]).twin=y[1],m.get(y[1]).twin=y[0]),d.push(T)};for(let y=0;y<c.length-1;y+=1)for(let T=0;T<o.length;T+=1){const M=T>0?`he:${y}:${T-1}:right`:void 0,b=T<o.length-1?`he:${y}:${T}:left`:void 0,P=[M,b].filter(q=>q!==void 0);if(P.length===1){const q=[P[0]];g(q,{id:`boundary:v:${y}:${T}`,halfEdges:q,kind:"boundary"});continue}const C=[P[0],P[1]],I=o[T],X=c[y],W=c[y+1],D=s.find(q=>xi(q.start[0],I)&&X>=q.start[1]-1e-10&&W<=q.end[1]+1e-10);if(!D||D.lineIndex===0){g(C,{id:`seam:v:${y}:${T}`,halfEdges:C,kind:"flatSeam"});continue}const Y=`${D.cutPairId}:segment:${y}`,V=["",""];for(let q=0;q<C.length;q+=1){const te=q===0?"a":"b",ae=`${Y}:${te}`,ce=[C[q]];g(ce,{id:ae,halfEdges:ce,kind:"cutBank",cutBank:{pair:Y,bank:te}}),V[q]=ae}f.push({id:Y,banks:V})}for(let y=0;y<c.length;y+=1)for(let T=0;T<o.length-1;T+=1){const M=y>0?`he:${y-1}:${T}:top`:void 0,b=y<c.length-1?`he:${y}:${T}:bottom`:void 0,P=[M,b].filter(oe=>oe!==void 0);if(P.length===1){const oe=[P[0]];g(oe,{id:`boundary:h:${y}:${T}`,halfEdges:oe,kind:"boundary"});continue}const C=[P[0],P[1]],I=[o[T],c[y]],X=[o[T+1],c[y]],W=r.find(oe=>Wl(oe.start,oe.end,I,X)),D=a.find(oe=>Wl(oe.start,oe.end,I,X)),Y=I[0]>=s[0].start[0]-1e-10&&X[0]<=s.at(-1).start[0]+1e-10,V=xi(c[y],-t.width)&&Y,q=xi(c[y],0)&&!Y&&!W&&!D;if(D?.stepIndex===0){g(C,{id:"seam:terminal:ground",halfEdges:C,kind:"flatSeam"});continue}if(!W&&!D&&!q&&!V){g(C,{id:`seam:h:${y}:${T}`,halfEdges:C,kind:"flatSeam"});continue}const ae=(W??D)?.edgeId??(V?`hinge:carrier-base:${T}`:`hinge:parent:${T}`),ce=D?"valley":"mountain";g(C,{id:ae,halfEdges:C,kind:"hinge",hinge:{assignment:ce,restAngle:0,angleRange:ce==="valley"?[0,Math.PI/2]:[-Math.PI/2,0]}})}const A=p.filter(y=>y.role==="tread"),w=Array.from({length:t.stepCount},(y,T)=>({stepIndex:T,treadFaceId:A.find(M=>M.stepIndex===T).faceId,hostConnected:!0,carrierConnected:!0}));for(let y=0;y<t.stepCount;y+=1)_.push({edgeId:r[y].edgeId,kind:"retained",stepIndex:y,side:"host"}),y>0&&_.push({edgeId:a[y].edgeId,kind:"retained",stepIndex:y,side:"carrier"});const v={schemaVersion:1,vertices:l,halfEdges:u,edges:d,faces:h,cutPairs:f,materialComponents:[{id:`tread-only-material:${t.operationId}`,faces:h.map(y=>y.id)}]},E=Ci(v);return E.length>0?{ok:!1,diagnostics:E}:{ok:!0,complex:v,sourceMap:{construction:"treadOnly",operationId:t.operationId,enclosingCut:!1,faces:p,cutLines:s.slice(1),shortEnds:_,hinges:[{edgeId:"hinge:parent",role:"parent"},...r,...a.slice(1),...Array.from({length:t.stepCount},(y,T)=>({edgeId:`hinge:carrier-base:${T+1}`,role:"carrierBase",stepIndex:T}))],supports:w}}}function Tc(t){if(!Number.isInteger(t.sampleCount)||t.sampleCount<2||t.sampleCount>1001)return{ok:!1,diagnostics:[_o(t.input.operationId,"Path sample count must be an integer in [2, 1001].")]};const e=[];for(let n=0;n<t.sampleCount;n+=1){const i=n/(t.sampleCount-1),s=Hx(t.input,t.complex,t.sourceMap,i);if(!s.ok)return{ok:!1,diagnostics:[_o(t.input.operationId,s.reason)]};e.push({parameter:i,transforms:s.transforms})}return{ok:!0,samples:e}}function Hx(t,e,n,i){const s=new Map(n.faces.map(u=>[u.faceId,u])),r=new Map(e.halfEdges.map(u=>[u.id,u])),a=new Map(e.vertices.map(u=>[u.id,u.position])),o=i*Math.PI/2,c=bi([0,0,0],[1,0,0],o),l=bi([0,-t.width,0],[1,0,0],o),h=new Map;for(const u of e.faces){const d=s.get(u.id);if(!d)return{ok:!1,reason:`Tread-only face ${u.id} has no material trace.`};if(d.role==="base")h.set(u.id,tn());else if(d.role==="host")h.set(u.id,c);else if(d.role==="carrier")h.set(u.id,l);else if(d.role==="tread"&&d.stepIndex!==void 0){const f=d.stepIndex*t.stepRise;h.set(u.id,{rotation:tn().rotation,translation:[0,-f*(1-Math.cos(o)),f*Math.sin(o)]})}else return{ok:!1,reason:`Tread-only face ${u.id} has unsupported role ${d.role}.`}}for(const u of e.edges.filter(d=>d.halfEdges.length===2)){const d=r.get(u.halfEdges[0]),f=r.get(u.halfEdges[1]),p=r.get(d.next),_=r.get(f.next),m=(A,w)=>{const v=a.get(w),E=h.get(A.face);return pt(E,[v[0],v[1],0])},g=Math.max(Hl(m(d,d.origin),m(f,_.origin)),Hl(m(d,p.origin),m(f,f.origin)));if(g>1e-8)return{ok:!1,reason:`Tread-only retained edge ${u.id} detaches by ${g}.`}}return{ok:!0,transforms:h}}function Hl(t,e){return Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2])}function Gx(t,e,n){return e.find((i,s)=>t[0]>i.start[0]&&t[0]<i.end[0]&&t[1]>n[s].start[1]&&t[1]<i.start[1])?.stepIndex}function Wx(t,e,n,i){if(!(t<=e||t>=e+i*n))return Math.min(i-1,Math.max(0,Math.floor((t-e)/n)))}function Gl(t){return[...new Set(t.map(e=>Number(e.toFixed(12))))].sort((e,n)=>e-n)}function xs(t,e){return`v:${e}:${t}`}function xi(t,e){return Math.abs(t-e)<=1e-10}function Wl(t,e,n,i){return xi(t[0],n[0])&&xi(t[1],n[1])&&xi(e[0],i[0])&&xi(e[1],i[1])}function $x(t){const e=t.stepCount*t.stepRun,n=-t.width,i=t.stepCount*t.stepRise;return t.operationId.length>0&&Number.isFinite(t.width)&&t.width>0&&Number.isInteger(t.stepCount)&&t.stepCount>=2&&t.stepCount<=20&&Number.isFinite(t.stepRun)&&t.stepRun>0&&t.stepRun===t.stepRise&&Number.isFinite(t.hostWidth)&&t.hostWidth>=e&&Number.isFinite(t.hostFloorExtent)&&t.hostFloorExtent>=-n&&Number.isFinite(t.hostWallExtent)&&t.hostWallExtent>=i?void 0:_o(t.operationId||"unknown","Tread-only stair dimensions must be positive, equal-run/equal-rise, bounded, and fit the host sheet.")}function _o(t,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}function Xx(t){const e=Ac(t);if(!e.ok)return e;const n=e.sourceMap.faces.map(a=>({faceId:a.faceId,role:a.role==="tread"?"riser":a.role==="host"?"stationaryHost":a.role==="base"?"movingHalf":"carrier",...a.stepIndex===void 0?{}:{stepIndex:a.stepIndex}})),i=n.filter(a=>a.role==="riser"),s=Gu(e.complex,Qr),r=s.edges.filter(a=>a.id.startsWith("hinge:parent:")).map(a=>({edgeId:a.id,role:"parent"}));return{ok:!0,complex:s,sourceMap:{construction:"riserOnly",operationId:t.operationId,sheetOrientation:"landscape",parentCreaseAxis:"vertical",enclosingCut:!1,faces:n,cutLines:e.sourceMap.cutLines.map(a=>({...a,start:sr(a.start),end:sr(a.end)})),shortEnds:e.sourceMap.shortEnds.map(a=>({...a,side:a.side==="host"?"stationaryHost":"carrier"})),hinges:[...r,...e.sourceMap.hinges.filter(a=>a.role!=="parent").map(a=>({...a,...a.start===void 0?{}:{start:sr(a.start)},...a.end===void 0?{}:{end:sr(a.end)}}))],supports:Array.from({length:t.stepCount},(a,o)=>({stepIndex:o,riserFaceId:i.find(c=>c.stepIndex===o).faceId,stationaryHostConnected:!0,carrierConnected:!0}))}}}function Yx(t){const e={...t.sourceMap,construction:"treadOnly",faces:t.sourceMap.faces.map(r=>({faceId:r.faceId,role:r.role==="riser"?"tread":r.role==="stationaryHost"?"host":r.role==="movingHalf"?"base":"carrier",...r.stepIndex===void 0?{}:{stepIndex:r.stepIndex}})),shortEnds:t.sourceMap.shortEnds.map(r=>({...r,side:r.side==="stationaryHost"?"host":"carrier"})),supports:t.sourceMap.supports.map(r=>({stepIndex:r.stepIndex,treadFaceId:r.riserFaceId,hostConnected:!0,carrierConnected:!0}))},n=Gu(t.complex,Ei(Qr)),i=Tc({input:t.input,complex:n,sourceMap:e,sampleCount:t.sampleCount});if(!i.ok)return i;const s=t.sourceMap.faces.find(r=>r.role==="stationaryHost");return s?{ok:!0,samples:i.samples.map(r=>{const a=Ei(r.transforms.get(s.faceId));return{parameter:r.parameter,transforms:new Map([...r.transforms].map(([o,c])=>[o,qx(Xt(a,c))]))}})}:{ok:!1,diagnostics:[Zx(t.input.operationId,"Riser-only pattern has no stationary host face.")]}}const Qr={rotation:[[0,-1,0],[1,0,0],[0,0,1]],translation:[0,0,0]};function sr([t,e]){return[-e,t]}function Gu(t,e){return{...t,vertices:t.vertices.map(n=>{const[i,s]=n.position,r=Kx(e,[i,s,0]);return{...n,position:[r[0],r[1]]}})}}function qx(t){return Xt(Qr,Xt(t,Ei(Qr)))}function Kx(t,e){return[t.rotation[0][0]*e[0]+t.rotation[0][1]*e[1]+t.rotation[0][2]*e[2]+t.translation[0],t.rotation[1][0]*e[0]+t.rotation[1][1]*e[1]+t.rotation[1][2]*e[2]+t.translation[1],t.rotation[2][0]*e[0]+t.rotation[2][1]*e[1]+t.rotation[2][2]*e[2]+t.translation[2]]}function Zx(t,e){return{severity:"error",category:"topology",code:"SPATIAL_DIMENSION_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}function Jx(t){const e={operationId:`${t.operationId}:parent`,...t.parent},n={operationId:`${t.operationId}:child`,hostPlane:"wall",...t.child},i=Ac(e);if(!i.ok)return i;const s=mc(n);if(!s.ok)return s;const r=ev(t),a=-t.parent.width;if(!tv(t,r,a))return{ok:!1,diagnostics:[vo(t.operationId,"The child stair must fit one retained carrier strip above the carrier-base hinge and parent base material below it.")]};const o=xo(i.complex),c=new Map(i.sourceMap.faces.map(_=>[_.faceId,_])),l=i.sourceMap.faces.filter(_=>{const m=o.get(_.faceId);return ov(m,r)}).map(_=>_.faceId).sort(),h=l.map(_=>c.get(_));if(!h.some(_=>_.role==="carrier")||!h.some(_=>_.role==="base"))return{ok:!1,diagnostics:[vo(t.operationId,"The child source region must replace both retained carrier material and the common parent base.")]};const u=new Set(l),d=i.complex.faces.map(_=>_.id).filter(_=>!u.has(_)).sort(),f=Qx(i,s,r,a,t.operationId),p=Ci(f.complex);return p.length>0?{ok:!1,diagnostics:p}:{ok:!0,input:t,parent:i,child:s,complex:f.complex,childPlacement:lv(r.minimumX,a),sourceMap:{construction:"carrierHostedCompoundStair",operationId:t.operationId,materialComponentCount:1,parent:i.sourceMap,child:s.sourceMap,integratedFaces:f.faces,retainedParentFaceIds:d,replacement:{sourceRegion:r,replacedParentFaceIds:l},sharedEdges:{carrierHost:{kind:"sharedMaterialEdge",y:a},groundBridge:{kind:"sharedMaterialEdge",y:a}}},evidence:{sourceRegionContained:!0,childHostContainedInCarrier:!0,childBaseContainedInParentBase:!0,childReplacesCarrier:!0,groundBridgeRetained:!0}}}function jx(t){const e={operationId:`${t.compilation.input.operationId}:parent`,...t.compilation.input.parent},n={operationId:`${t.compilation.input.operationId}:child`,hostPlane:"wall",...t.compilation.input.child},i=Tc({input:e,complex:t.compilation.parent.complex,sourceMap:t.compilation.parent.sourceMap,sampleCount:t.sampleCount});if(!i.ok)return i;const s=_c({input:n,complex:t.compilation.child.complex,sourceMap:t.compilation.child.sourceMap,sampleCount:t.sampleCount});if(!s.ok)return s;const r=i.samples.map((o,c)=>{const l=s.samples[c],h=new Map([...l.transforms].map(([_,m])=>[_,Xt(t.compilation.childPlacement,m)])),u=cv(t.compilation,o.transforms,h),d=new Map(t.compilation.sourceMap.integratedFaces.map(_=>[_.faceId,_.source==="parent"?o.transforms.get(_.sourceFaceId):Xt(h.get(_.sourceFaceId),Ei(t.compilation.childPlacement))])),p=Wu(t.compilation.complex,d).residual;return{parameter:o.parameter,transforms:d,parentTransforms:o.transforms,childTransforms:h,carrierHostResidual:u.carrier,groundBridgeResidual:u.ground,maximumSharedMaterialResidual:p,grounded:u.ground<1e-8,childUsesCarrierHost:u.carrier<1e-8}}),a=r.find(o=>!o.grounded||!o.childUsesCarrierHost||o.maximumSharedMaterialResidual>=1e-8);return a?{ok:!1,diagnostics:[vo(t.compilation.input.operationId,`Compound stair shared material detached at parameter ${a.parameter}: carrier ${a.carrierHostResidual}, ground ${a.groundBridgeResidual}, retained ${a.maximumSharedMaterialResidual} at ${av(t.compilation.complex,a.transforms).edgeId}.`)]}:{ok:!0,samples:r}}function Qx(t,e,n,i,s){const r=[n.minimumX,i,0],a=xo(t.complex),o=xo(e.complex),c=$l([...t.complex.vertices.map(v=>v.position[0]),...e.complex.vertices.map(v=>v.position[0]+r[0])]),l=$l([...t.complex.vertices.map(v=>v.position[1]),...e.complex.vertices.map(v=>v.position[1]+r[1])]),h=[],u=[],d=[],f=[];for(let v=0;v<l.length;v+=1)for(let E=0;E<c.length;E+=1)h.push({id:vs(E,v),position:[c[E],l[v]]});for(let v=0;v<l.length-1;v+=1)for(let E=0;E<c.length-1;E+=1){const y=[(c[E]+c[E+1])/2,(l[v]+l[v+1])/2],T=nv(y,n),M=T?"child":"parent",b=T?[y[0]-r[0],y[1]-r[1]]:y,P=iv(T?o:a,b);if(!P)throw new Error(`Integrated compound cell ${E}:${v} has no ${M} source face.`);const C=`compound-face:${v}:${E}`,I=["bottom","right","top","left"].map(X=>`compound-he:${v}:${E}:${X}`);d.push({id:I[0],origin:vs(E,v),next:I[1],edge:"pending",face:C},{id:I[1],origin:vs(E+1,v),next:I[2],edge:"pending",face:C},{id:I[2],origin:vs(E+1,v+1),next:I[3],edge:"pending",face:C},{id:I[3],origin:vs(E,v+1),next:I[0],edge:"pending",face:C}),u.push({id:C,boundary:I[0],holes:[]}),f.push({faceId:C,source:M,sourceFaceId:P})}const p=[],_=[],m=new Map(d.map(v=>[v.id,v])),g=new Map(f.map(v=>[v.faceId,v])),A=(v,E)=>{for(const y of v)m.get(y).edge=E.id;v.length===2&&(m.get(v[0]).twin=v[1],m.get(v[1]).twin=v[0]),p.push(E)},w=(v,E,y,T)=>{if(v.length===1){const D=[v[0]];A(D,{id:`boundary:${T}`,halfEdges:D,kind:"boundary"});return}const M=[v[0],v[1]],b=g.get(m.get(v[0]).face),P=g.get(m.get(v[1]).face);if(b.source!==P.source){A(M,{id:`seam:embedded:${T}`,halfEdges:M,kind:"flatSeam"});return}const C=b.source==="parent"?t.complex:e.complex,I=b.source==="parent"?E:[E[0]-r[0],E[1]-r[1]],X=b.source==="parent"?y:[y[0]-r[0],y[1]-r[1]],W=sv(C,I,X);if(W.kind==="cutBank"){const D=`cut:compound:${T}`,Y=`${D}:a`,V=`${D}:b`;A([v[0]],{id:Y,halfEdges:[v[0]],kind:"cutBank",cutBank:{pair:D,bank:"a"}}),A([v[1]],{id:V,halfEdges:[v[1]],kind:"cutBank",cutBank:{pair:D,bank:"b"}}),_.push({id:D,banks:[Y,V]});return}if(W.kind==="hinge"){A(M,{id:`hinge:compound:${T}`,halfEdges:M,kind:"hinge",hinge:W.hinge});return}A(M,{id:`seam:compound:${T}`,halfEdges:M,kind:"flatSeam"})};for(let v=0;v<l.length-1;v+=1)for(let E=0;E<c.length;E+=1){const y=[E>0?`compound-he:${v}:${E-1}:right`:void 0,E<c.length-1?`compound-he:${v}:${E}:left`:void 0].filter(T=>T!==void 0);w(y,[c[E],l[v]],[c[E],l[v+1]],`v:${v}:${E}`)}for(let v=0;v<l.length;v+=1)for(let E=0;E<c.length-1;E+=1){const y=[v>0?`compound-he:${v-1}:${E}:top`:void 0,v<l.length-1?`compound-he:${v}:${E}:bottom`:void 0].filter(T=>T!==void 0);w(y,[c[E],l[v]],[c[E+1],l[v]],`h:${v}:${E}`)}return{complex:{schemaVersion:1,vertices:h,halfEdges:d,edges:p,faces:u,cutPairs:_,materialComponents:[{id:`compound-material:${s}`,faces:u.map(v=>v.id)}]},faces:f}}function ev(t){const n=(t.parent.hostWidth-t.parent.stepCount*t.parent.stepRun)/2+t.childHostStepIndex*t.parent.stepRun+(t.parent.stepRun-t.child.hostWidth)/2,i=-t.parent.width;return{minimumX:Cs(n),maximumX:Cs(n+t.child.hostWidth),minimumY:Cs(i-t.child.hostFloorExtent),maximumY:Cs(i+t.child.hostWallExtent)}}function Cs(t){return Number(t.toFixed(12))}function tv(t,e,n){if(!Number.isInteger(t.childHostStepIndex)||t.childHostStepIndex<0||t.childHostStepIndex>=t.parent.stepCount||t.child.hostWidth>t.parent.stepRun+1e-10||e.minimumX<0||e.maximumX>t.parent.hostWidth||e.minimumY<-t.parent.hostFloorExtent||e.maximumY>t.parent.hostWallExtent)return!1;const i=(t.parent.hostWidth-t.parent.stepCount*t.parent.stepRun)/2,r=Math.min(t.parent.stepCount-1,Math.max(0,Math.floor((e.minimumX-i)/t.parent.stepRun+1e-8)))*t.parent.stepRise;return e.minimumY<n&&e.maximumY<=r+1e-10}function xo(t){const e=new Map(t.vertices.map(i=>[i.id,i.position])),n=new Map(t.halfEdges.map(i=>[i.id,i]));return new Map(t.faces.map(i=>{const s=[];let r=n.get(i.boundary);const a=r.id;do s.push(e.get(r.origin)),r=n.get(r.next);while(r.id!==a);return[i.id,{minimumX:Math.min(...s.map(o=>o[0])),maximumX:Math.max(...s.map(o=>o[0])),minimumY:Math.min(...s.map(o=>o[1])),maximumY:Math.max(...s.map(o=>o[1]))}]}))}function $l(t){return[...new Set(t.map(e=>Cs(e)))].sort((e,n)=>e-n)}function vs(t,e){return`compound-v:${e}:${t}`}function nv(t,e){return t[0]>e.minimumX&&t[0]<e.maximumX&&t[1]>e.minimumY&&t[1]<e.maximumY}function iv(t,e){return[...t].find(([,n])=>e[0]>n.minimumX-1e-10&&e[0]<n.maximumX+1e-10&&e[1]>n.minimumY-1e-10&&e[1]<n.maximumY+1e-10)?.[0]}function sv(t,e,n){const i=new Map(t.vertices.map(r=>[r.id,r.position])),s=new Map(t.halfEdges.map(r=>[r.id,r]));for(const r of t.edges)for(const a of r.halfEdges){const o=s.get(a),c=i.get(o.origin),l=i.get(s.get(o.next).origin);if(rv(e,n,c,l))return r}return{id:"implicit-flat-seam",halfEdges:["implicit"],kind:"flatSeam"}}function rv(t,e,n,i){const s=(e[0]-t[0])*(n[1]-t[1])-(e[1]-t[1])*(n[0]-t[0]),r=(e[0]-t[0])*(i[1]-t[1])-(e[1]-t[1])*(i[0]-t[0]);return Math.abs(s)>1e-9||Math.abs(r)>1e-9?!1:Math.min(n[0],i[0])<=t[0]+1e-10&&Math.max(n[0],i[0])>=e[0]-1e-10&&Math.min(n[1],i[1])<=t[1]+1e-10&&Math.max(n[1],i[1])>=e[1]-1e-10}function Wu(t,e){const n=new Map(t.vertices.map(a=>[a.id,a.position])),i=new Map(t.halfEdges.map(a=>[a.id,a]));let s=0,r;for(const a of t.edges.filter(o=>o.halfEdges.length===2)){const o=i.get(a.halfEdges[0]),c=i.get(a.halfEdges[1]),l=i.get(o.next),h=i.get(c.next),u=(f,p)=>{const _=n.get(p);return pt(e.get(f.face),[_[0],_[1],0])},d=Math.max(ea(u(o,o.origin),u(c,h.origin)),ea(u(o,l.origin),u(c,c.origin)));d>s&&(s=d,r=a.id)}return{residual:s,...r===void 0?{}:{edgeId:r}}}function av(t,e){return Wu(t,e)}function ov(t,e){return Math.min(t.maximumX,e.maximumX)-Math.max(t.minimumX,e.minimumX)>1e-10&&Math.min(t.maximumY,e.maximumY)-Math.max(t.minimumY,e.minimumY)>1e-10}function cv(t,e,n){const i=t.parent.sourceMap.faces.find(u=>u.role==="carrier"&&t.sourceMap.replacement.replacedParentFaceIds.includes(u.faceId)),s=t.parent.sourceMap.faces.find(u=>u.role==="base"&&t.sourceMap.replacement.replacedParentFaceIds.includes(u.faceId)),r=t.child.sourceMap.faces.find(u=>u.faceId.startsWith("host-face:")&&u.faceId.includes(":0")),a=t.child.sourceMap.faces.find(u=>u.faceId.startsWith("host-face:0:"));if(!i||!s||!r||!a)return{carrier:Number.POSITIVE_INFINITY,ground:Number.POSITIVE_INFINITY};const o=-t.input.parent.width,c=t.sourceMap.replacement.sourceRegion.minimumX,l=[0,0,0],h=[c,o,0];return{carrier:ea(pt(e.get(i.faceId),h),pt(n.get(r.faceId),l)),ground:ea(pt(e.get(s.faceId),h),pt(n.get(a.faceId),l))}}function lv(t,e){return{...tn(),translation:[t,e,0]}}function ea(t,e){return Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2])}function vo(t,e){return{severity:"error",category:"topology",code:"TOPOLOGY_COMPONENT_INVALID",message:e,locations:[{kind:"entity",entity:{kind:"spatialOperation",id:t}}],entities:[{kind:"spatialOperation",id:t}]}}const wc="185",ts={ROTATE:0,DOLLY:1,PAN:2},ji={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},dv=0,Xl=1,uv=2,Or=1,hv=2,Ps=3,ri=0,Yt=1,Sn=2,kn=0,ns=1,Yl=2,ql=3,Kl=4,fv=5,gi=100,pv=101,mv=102,gv=103,_v=104,xv=200,vv=201,Mv=202,yv=203,Mo=204,yo=205,Sv=206,Ev=207,bv=208,Av=209,Tv=210,wv=211,Rv=212,Cv=213,Pv=214,So=0,Eo=1,bo=2,rs=3,Ao=4,To=5,wo=6,Ro=7,$u=0,Iv=1,Lv=2,An=0,Xu=1,Yu=2,qu=3,Ku=4,Zu=5,Ju=6,ju=7,Qu=300,Ti=301,as=302,Aa=303,Ta=304,ha=306,Co=1e3,Un=1001,Po=1002,It=1003,Dv=1004,rr=1005,Ft=1006,wa=1007,vi=1008,en=1009,eh=1010,th=1011,ks=1012,Rc=1013,Rn=1014,En=1015,Vn=1016,Cc=1017,Pc=1018,Bs=1020,nh=35902,ih=35899,sh=1021,rh=1022,fn=1023,zn=1026,Mi=1027,ah=1028,Ic=1029,wi=1030,Lc=1031,Dc=1033,kr=33776,Br=33777,Vr=33778,zr=33779,Io=35840,Lo=35841,Do=35842,No=35843,Fo=36196,Uo=37492,Oo=37496,ko=37488,Bo=37489,ta=37490,Vo=37491,zo=37808,Ho=37809,Go=37810,Wo=37811,$o=37812,Xo=37813,Yo=37814,qo=37815,Ko=37816,Zo=37817,Jo=37818,jo=37819,Qo=37820,ec=37821,tc=36492,nc=36494,ic=36495,sc=36283,rc=36284,na=36285,ac=36286,Nv=3200,oc=0,Fv=1,ei="",jt="srgb",ia="srgb-linear",sa="linear",Ze="srgb",Oi=7680,Zl=519,Uv=512,Ov=513,kv=514,Nc=515,Bv=516,Vv=517,Fc=518,zv=519,Jl=35044,jl="300 es",bn=2e3,Vs=2001;function Hv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function ra(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Gv(){const t=ra("canvas");return t.style.display="block",t}const Ql={};function ed(...t){const e="THREE."+t.shift();console.log(e,...t)}function oh(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Pe(...t){t=oh(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function $e(...t){t=oh(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function is(...t){const e=t.join(" ");e in Ql||(Ql[e]=!0,Pe(...t))}function Wv(t,e,n){return new Promise(function(i,s){function r(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:s();break;case t.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}const $v={[So]:Eo,[bo]:wo,[Ao]:Ro,[rs]:To,[Eo]:So,[wo]:bo,[Ro]:Ao,[To]:rs};class ci{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let td=1234567;const Fs=Math.PI/180,zs=180/Math.PI;function us(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Dt[t&255]+Dt[t>>8&255]+Dt[t>>16&255]+Dt[t>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[n&63|128]+Dt[n>>8&255]+"-"+Dt[n>>16&255]+Dt[n>>24&255]+Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]).toLowerCase()}function Ve(t,e,n){return Math.max(e,Math.min(n,t))}function Uc(t,e){return(t%e+e)%e}function Xv(t,e,n,i,s){return i+(t-e)*(s-i)/(n-e)}function Yv(t,e,n){return t!==e?(n-t)/(e-t):0}function Us(t,e,n){return(1-n)*t+n*e}function qv(t,e,n,i){return Us(t,e,1-Math.exp(-n*i))}function Kv(t,e=1){return e-Math.abs(Uc(t,e*2)-e)}function Zv(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function Jv(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function jv(t,e){return t+Math.floor(Math.random()*(e-t+1))}function Qv(t,e){return t+Math.random()*(e-t)}function eM(t){return t*(.5-Math.random())}function tM(t){t!==void 0&&(td=t);let e=td+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function nM(t){return t*Fs}function iM(t){return t*zs}function sM(t){return(t&t-1)===0&&t!==0}function rM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function aM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function oM(t,e,n,i,s){const r=Math.cos,a=Math.sin,o=r(n/2),c=a(n/2),l=r((e+i)/2),h=a((e+i)/2),u=r((e-i)/2),d=a((e-i)/2),f=r((i-e)/2),p=a((i-e)/2);switch(s){case"XYX":t.set(o*h,c*u,c*d,o*l);break;case"YZY":t.set(c*d,o*h,c*u,o*l);break;case"ZXZ":t.set(c*u,c*d,o*h,o*l);break;case"XZX":t.set(o*h,c*p,c*f,o*l);break;case"YXY":t.set(c*f,o*h,c*p,o*l);break;case"ZYZ":t.set(c*p,c*f,o*h,o*l);break;default:Pe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ji(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ut(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ch={DEG2RAD:Fs,RAD2DEG:zs,generateUUID:us,clamp:Ve,euclideanModulo:Uc,mapLinear:Xv,inverseLerp:Yv,lerp:Us,damp:qv,pingpong:Kv,smoothstep:Zv,smootherstep:Jv,randInt:jv,randFloat:Qv,randFloatSpread:eM,seededRandom:tM,degToRad:nM,radToDeg:iM,isPowerOfTwo:sM,ceilPowerOfTwo:rM,floorPowerOfTwo:aM,setQuaternionFromProperEuler:oM,normalize:Ut,denormalize:Ji},Gc=class Gc{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Ve(this.x,e.x,n.x),this.y=Ve(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Ve(this.x,e,n),this.y=Ve(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),s=Math.sin(n),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Gc.prototype.isVector2=!0;let Le=Gc;class ai{constructor(e=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=s}static slerpFlat(e,n,i,s,r,a,o){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],f=r[a+1],p=r[a+2],_=r[a+3];if(u!==_||c!==d||l!==f||h!==p){let m=c*d+l*f+h*p+u*_;m<0&&(d=-d,f=-f,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const A=Math.acos(m),w=Math.sin(A);g=Math.sin(g*A)/w,o=Math.sin(o*A)/w,c=c*g+d*o,l=l*g+f*o,h=h*g+p*o,u=u*g+_*o}else{c=c*g+d*o,l=l*g+f*o,h=h*g+p*o,u=u*g+_*o;const A=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=A,l*=A,h*=A,u*=A}}e[n]=c,e[n+1]=l,e[n+2]=h,e[n+3]=u}static multiplyQuaternionsFlat(e,n,i,s,r,a){const o=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[n]=o*p+h*u+c*f-l*d,e[n+1]=c*p+h*d+l*u-o*f,e[n+2]=l*p+h*f+o*d-c*u,e[n+3]=h*p-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,s){return this._x=e,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),h=o(s/2),u=o(r/2),d=c(i/2),f=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u+d*f*p;break;case"YZX":this._x=d*h*u+l*f*p,this._y=l*f*u+d*h*p,this._z=l*h*p-d*f*u,this._w=l*h*u-d*f*p;break;case"XZY":this._x=d*h*u-l*f*p,this._y=l*f*u-d*h*p,this._z=l*h*p+d*f*u,this._w=l*h*u+d*f*p;break;default:Pe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],s=n[4],r=n[8],a=n[1],o=n[5],c=n[9],l=n[2],h=n[6],u=n[10],d=i+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(i>o&&i>u){const f=2*Math.sqrt(1+i-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-i-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-i-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,n/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,s=e._y,r=e._z,a=e._w,o=n._x,c=n._y,l=n._z,h=n._w;return this._x=i*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-i*l,this._z=r*h+a*l+i*c-s*o,this._w=a*h-i*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,n){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let c=1-n;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,n=Math.sin(n*l)/h,this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+a*n,this._onChangeCallback()}else this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+a*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(n),r*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Wc=class Wc{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(nd.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(nd.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6]*s,this.y=r[1]*n+r[4]*i+r[7]*s,this.z=r[2]*n+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*n+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*n+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*n+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*i),h=2*(o*n-r*s),u=2*(r*i-a*n);return this.x=n+c*l+a*u-o*h,this.y=i+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[4]*i+r[8]*s,this.y=r[1]*n+r[5]*i+r[9]*s,this.z=r[2]*n+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Ve(this.x,e.x,n.x),this.y=Ve(this.y,e.y,n.y),this.z=Ve(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Ve(this.x,e,n),this.y=Ve(this.y,e,n),this.z=Ve(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,s=e.y,r=e.z,a=n.x,o=n.y,c=n.z;return this.x=s*c-r*o,this.y=r*a-i*c,this.z=i*o-s*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ra.copy(this).projectOnVector(e),this.sub(Ra)}reflect(e){return this.sub(Ra.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return n*n+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const s=Math.sin(n)*e;return this.x=s*Math.sin(i),this.y=Math.cos(n)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Wc.prototype.isVector3=!0;let U=Wc;const Ra=new U,nd=new ai,$c=class $c{constructor(e,n,i,s,r,a,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,a,o,c,l)}set(e,n,i,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=n,h[4]=r,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],p=i[8],_=s[0],m=s[3],g=s[6],A=s[1],w=s[4],v=s[7],E=s[2],y=s[5],T=s[8];return r[0]=a*_+o*A+c*E,r[3]=a*m+o*w+c*y,r[6]=a*g+o*v+c*T,r[1]=l*_+h*A+u*E,r[4]=l*m+h*w+u*y,r[7]=l*g+h*v+u*T,r[2]=d*_+f*A+p*E,r[5]=d*m+f*w+p*y,r[8]=d*g+f*v+p*T,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return n*a*h-n*o*l-i*r*h+i*o*c+s*r*l-s*a*c}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,p=n*u+i*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return e[0]=u*_,e[1]=(s*l-h*i)*_,e[2]=(o*i-s*a)*_,e[3]=d*_,e[4]=(h*n-s*c)*_,e[5]=(s*r-o*n)*_,e[6]=f*_,e[7]=(i*c-l*n)*_,e[8]=(a*n-i*r)*_,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+n,0,0,1),this}scale(e,n){return is("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ca.makeScale(e,n)),this}rotate(e){return is("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ca.makeRotation(-e)),this}translate(e,n){return is("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ca.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};$c.prototype.isMatrix3=!0;let De=$c;const Ca=new De,id=new De().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sd=new De().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cM(){const t={enabled:!0,workingColorSpace:ia,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ze&&(s.r=Bn(s.r),s.g=Bn(s.g),s.b=Bn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ze&&(s.r=ss(s.r),s.g=ss(s.g),s.b=ss(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ei?sa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return is("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return is("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[ia]:{primaries:e,whitePoint:i,transfer:sa,toXYZ:id,fromXYZ:sd,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:jt},outputColorSpaceConfig:{drawingBufferColorSpace:jt}},[jt]:{primaries:e,whitePoint:i,transfer:Ze,toXYZ:id,fromXYZ:sd,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:jt}}}),t}const He=cM();function Bn(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function ss(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let ki;class lM{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ki===void 0&&(ki=ra("canvas")),ki.width=e.width,ki.height=e.height;const s=ki.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=ki}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=ra("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Bn(r[a]/255)*255;return i.putImageData(s,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Bn(n[i]/255)*255):n[i]=Bn(n[i]);return{data:n,width:e.width,height:e.height}}else return Pe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let dM=0;class Oc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:dM++}),this.uuid=us(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Pa(s[a].image)):r.push(Pa(s[a]))}else r=Pa(s);i.url=r}return n||(e.images[this.uuid]=i),i}}function Pa(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?lM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Pe("Texture: Unable to serialize Texture."),{})}let uM=0;const Ia=new U;class Bt extends ci{constructor(e=Bt.DEFAULT_IMAGE,n=Bt.DEFAULT_MAPPING,i=Un,s=Un,r=Ft,a=vi,o=fn,c=en,l=Bt.DEFAULT_ANISOTROPY,h=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:uM++}),this.uuid=us(),this.name="",this.source=new Oc(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new De,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ia).x}get height(){return this.source.getSize(Ia).y}get depth(){return this.source.getSize(Ia).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Pe(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Pe(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Qu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Co:e.x=e.x-Math.floor(e.x);break;case Un:e.x=e.x<0?0:1;break;case Po:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Co:e.y=e.y-Math.floor(e.y);break;case Un:e.y=e.y<0?0:1;break;case Po:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Qu;Bt.DEFAULT_ANISOTROPY=1;const Xc=class Xc{constructor(e=0,n=0,i=0,s=1){this.x=e,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,s){return this.x=e,this.y=n,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*n+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*n+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*n+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,s,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],p=c[9],_=c[2],m=c[6],g=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(p+m)<.1&&Math.abs(l+f+g-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const w=(l+1)/2,v=(f+1)/2,E=(g+1)/2,y=(h+d)/4,T=(u+_)/4,M=(p+m)/4;return w>v&&w>E?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=y/i,r=T/i):v>E?v<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),i=y/s,r=M/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=T/r,s=M/r),this.set(i,s,r,n),this}let A=Math.sqrt((m-p)*(m-p)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(A)<.001&&(A=1),this.x=(m-p)/A,this.y=(u-_)/A,this.z=(d-h)/A,this.w=Math.acos((l+f+g-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Ve(this.x,e.x,n.x),this.y=Ve(this.y,e.y,n.y),this.z=Ve(this.z,e.z,n.z),this.w=Ve(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Ve(this.x,e,n),this.y=Ve(this.y,e,n),this.z=Ve(this.z,e,n),this.w=Ve(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Xc.prototype.isVector4=!0;let lt=Xc;class hM extends ci{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ft,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new lt(0,0,e,n),this.scissorTest=!1,this.viewport=new lt(0,0,e,n),this.textures=[];const s={width:e,height:n,depth:i.depth},r=new Bt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:Ft,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const s=Object.assign({},e.textures[n].image);this.textures[n].source=new Oc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends hM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class lh extends Bt{constructor(e=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class fM extends Bt{constructor(e=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ca=class ca{constructor(e,n,i,s,r,a,o,c,l,h,u,d,f,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,a,o,c,l,h,u,d,f,p,_,m)}set(e,n,i,s,r,a,o,c,l,h,u,d,f,p,_,m){const g=this.elements;return g[0]=e,g[4]=n,g[8]=i,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=c,g[2]=l,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ca().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,s=1/Bi.setFromMatrixColumn(e,0).length(),r=1/Bi.setFromMatrixColumn(e,1).length(),a=1/Bi.setFromMatrixColumn(e,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*r,n[5]=i[5]*r,n[6]=i[6]*r,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,p=o*h,_=o*u;n[0]=c*h,n[4]=-c*u,n[8]=l,n[1]=f+p*l,n[5]=d-_*l,n[9]=-o*c,n[2]=_-d*l,n[6]=p+f*l,n[10]=a*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,p=l*h,_=l*u;n[0]=d+_*o,n[4]=p*o-f,n[8]=a*l,n[1]=a*u,n[5]=a*h,n[9]=-o,n[2]=f*o-p,n[6]=_+d*o,n[10]=a*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,p=l*h,_=l*u;n[0]=d-_*o,n[4]=-a*u,n[8]=p+f*o,n[1]=f+p*o,n[5]=a*h,n[9]=_-d*o,n[2]=-a*l,n[6]=o,n[10]=a*c}else if(e.order==="ZYX"){const d=a*h,f=a*u,p=o*h,_=o*u;n[0]=c*h,n[4]=p*l-f,n[8]=d*l+_,n[1]=c*u,n[5]=_*l+d,n[9]=f*l-p,n[2]=-l,n[6]=o*c,n[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,p=o*c,_=o*l;n[0]=c*h,n[4]=_-d*u,n[8]=p*u+f,n[1]=u,n[5]=a*h,n[9]=-o*h,n[2]=-l*h,n[6]=f*u+p,n[10]=d-_*u}else if(e.order==="XZY"){const d=a*c,f=a*l,p=o*c,_=o*l;n[0]=c*h,n[4]=-u,n[8]=l*h,n[1]=d*u+_,n[5]=a*h,n[9]=f*u-p,n[2]=p*u-f,n[6]=o*h,n[10]=_*u+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pM,e,mM)}lookAt(e,n,i){const s=this.elements;return Kt.subVectors(e,n),Kt.lengthSq()===0&&(Kt.z=1),Kt.normalize(),Yn.crossVectors(i,Kt),Yn.lengthSq()===0&&(Math.abs(i.z)===1?Kt.x+=1e-4:Kt.z+=1e-4,Kt.normalize(),Yn.crossVectors(i,Kt)),Yn.normalize(),ar.crossVectors(Kt,Yn),s[0]=Yn.x,s[4]=ar.x,s[8]=Kt.x,s[1]=Yn.y,s[5]=ar.y,s[9]=Kt.y,s[2]=Yn.z,s[6]=ar.z,s[10]=Kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],p=i[2],_=i[6],m=i[10],g=i[14],A=i[3],w=i[7],v=i[11],E=i[15],y=s[0],T=s[4],M=s[8],b=s[12],P=s[1],C=s[5],I=s[9],X=s[13],W=s[2],D=s[6],Y=s[10],V=s[14],q=s[3],te=s[7],ae=s[11],ce=s[15];return r[0]=a*y+o*P+c*W+l*q,r[4]=a*T+o*C+c*D+l*te,r[8]=a*M+o*I+c*Y+l*ae,r[12]=a*b+o*X+c*V+l*ce,r[1]=h*y+u*P+d*W+f*q,r[5]=h*T+u*C+d*D+f*te,r[9]=h*M+u*I+d*Y+f*ae,r[13]=h*b+u*X+d*V+f*ce,r[2]=p*y+_*P+m*W+g*q,r[6]=p*T+_*C+m*D+g*te,r[10]=p*M+_*I+m*Y+g*ae,r[14]=p*b+_*X+m*V+g*ce,r[3]=A*y+w*P+v*W+E*q,r[7]=A*T+w*C+v*D+E*te,r[11]=A*M+w*I+v*Y+E*ae,r[15]=A*b+w*X+v*V+E*ce,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],_=e[7],m=e[11],g=e[15],A=c*f-l*d,w=o*f-l*u,v=o*d-c*u,E=a*f-l*h,y=a*d-c*h,T=a*u-o*h;return n*(_*A-m*w+g*v)-i*(p*A-m*E+g*y)+s*(p*w-_*E+g*T)-r*(p*v-_*y+m*T)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return n*(a*h-o*l)-i*(r*h-o*c)+s*(r*l-a*c)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=n,s[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],_=e[13],m=e[14],g=e[15],A=n*o-i*a,w=n*c-s*a,v=n*l-r*a,E=i*c-s*o,y=i*l-r*o,T=s*l-r*c,M=h*_-u*p,b=h*m-d*p,P=h*g-f*p,C=u*m-d*_,I=u*g-f*_,X=d*g-f*m,W=A*X-w*I+v*C+E*P-y*b+T*M;if(W===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/W;return e[0]=(o*X-c*I+l*C)*D,e[1]=(s*I-i*X-r*C)*D,e[2]=(_*T-m*y+g*E)*D,e[3]=(d*y-u*T-f*E)*D,e[4]=(c*P-a*X-l*b)*D,e[5]=(n*X-s*P+r*b)*D,e[6]=(m*v-p*T-g*w)*D,e[7]=(h*T-d*v+f*w)*D,e[8]=(a*I-o*P+l*M)*D,e[9]=(i*P-n*I-r*M)*D,e[10]=(p*y-_*v+g*A)*D,e[11]=(u*v-h*y-f*A)*D,e[12]=(o*b-a*C-c*M)*D,e[13]=(n*C-i*b+s*M)*D,e[14]=(_*w-p*E-m*A)*D,e[15]=(h*E-u*w+d*A)*D,this}scale(e){const n=this.elements,i=e.x,s=e.y,r=e.z;return n[0]*=i,n[4]*=s,n[8]*=r,n[1]*=i,n[5]*=s,n[9]*=r,n[2]*=i,n[6]*=s,n[10]*=r,n[3]*=i,n[7]*=s,n[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),s=Math.sin(n),r=1-i,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+i,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+i,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,n,s,1,0,0,0,0,1),this}compose(e,n,i){const s=this.elements,r=n._x,a=n._y,o=n._z,c=n._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,p=r*u,_=a*h,m=a*u,g=o*u,A=c*l,w=c*h,v=c*u,E=i.x,y=i.y,T=i.z;return s[0]=(1-(_+g))*E,s[1]=(f+v)*E,s[2]=(p-w)*E,s[3]=0,s[4]=(f-v)*y,s[5]=(1-(d+g))*y,s[6]=(m+A)*y,s[7]=0,s[8]=(p+w)*T,s[9]=(m-A)*T,s[10]=(1-(d+_))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,n,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),n.identity(),this;let a=Bi.set(s[0],s[1],s[2]).length();const o=Bi.set(s[4],s[5],s[6]).length(),c=Bi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),cn.copy(this);const l=1/a,h=1/o,u=1/c;return cn.elements[0]*=l,cn.elements[1]*=l,cn.elements[2]*=l,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=u,cn.elements[9]*=u,cn.elements[10]*=u,n.setFromRotationMatrix(cn),i.x=a,i.y=o,i.z=c,this}makePerspective(e,n,i,s,r,a,o=bn,c=!1){const l=this.elements,h=2*r/(n-e),u=2*r/(i-s),d=(n+e)/(n-e),f=(i+s)/(i-s);let p,_;if(c)p=r/(a-r),_=a*r/(a-r);else if(o===bn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Vs)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,s,r,a,o=bn,c=!1){const l=this.elements,h=2/(n-e),u=2/(i-s),d=-(n+e)/(n-e),f=-(i+s)/(i-s);let p,_;if(c)p=1/(a-r),_=a/(a-r);else if(o===bn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===Vs)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};ca.prototype.isMatrix4=!0;let ct=ca;const Bi=new U,cn=new ct,pM=new U(0,0,0),mM=new U(1,1,1),Yn=new U,ar=new U,Kt=new U,rd=new ct,ad=new ai;class oi{constructor(e=0,n=0,i=0,s=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,s=this._order){return this._x=e,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(n){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ve(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ve(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Pe("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return rd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rd,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return ad.setFromEuler(this),this.setFromQuaternion(ad,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class dh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let gM=0;const od=new U,Vi=new ai,In=new ct,or=new U,Ms=new U,_M=new U,xM=new ai,cd=new U(1,0,0),ld=new U(0,1,0),dd=new U(0,0,1),ud={type:"added"},vM={type:"removed"},zi={type:"childadded",child:null},La={type:"childremoved",child:null};class Ct extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gM++}),this.uuid=us(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new U,n=new oi,i=new ai,s=new U(1,1,1);function r(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ct},normalMatrix:{value:new De}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Vi.setFromAxisAngle(e,n),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,n){return Vi.setFromAxisAngle(e,n),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(cd,e)}rotateY(e){return this.rotateOnAxis(ld,e)}rotateZ(e){return this.rotateOnAxis(dd,e)}translateOnAxis(e,n){return od.copy(e).applyQuaternion(this.quaternion),this.position.add(od.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(cd,e)}translateY(e){return this.translateOnAxis(ld,e)}translateZ(e){return this.translateOnAxis(dd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?or.copy(e):or.set(e,n,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(Ms,or,this.up):In.lookAt(or,Ms,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Vi.setFromRotationMatrix(In),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ud),zi.child=e,this.dispatchEvent(zi),zi.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(vM),La.child=e,this.dispatchEvent(La),La.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ud),zi.child=e,this.dispatchEvent(zi),zi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,e,_M),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,xM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=n-r[0]*n-r[4]*i-r[8]*s,r[13]+=i-r[1]*n-r[5]*i-r[9]*s,r[14]+=s-r[2]*n-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(n){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=s,i;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new U(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Is extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const MM={type:"move"};class Da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Is,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Is,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Is,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const m=n.getJointPose(_,i),g=this._getHandJoint(l,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;l.inputState.pinching&&d>f+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=n.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=n.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(MM)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Is;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},cr={h:0,s:0,l:0};function Na(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class ze{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.colorSpaceToWorking(this,n),this}setRGB(e,n,i,s=He.workingColorSpace){return this.r=e,this.g=n,this.b=i,He.colorSpaceToWorking(this,s),this}setHSL(e,n,i,s=He.workingColorSpace){if(e=Uc(e,1),n=Ve(n,0,1),i=Ve(i,0,1),n===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+n):i+n-i*n,a=2*i-r;this.r=Na(a,r,e+1/3),this.g=Na(a,r,e),this.b=Na(a,r,e-1/3)}return He.colorSpaceToWorking(this,s),this}setStyle(e,n=jt){function i(r){r!==void 0&&parseFloat(r)<1&&Pe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,n);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,n);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,n);break;default:Pe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(r,16),n);Pe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=jt){const i=uh[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Pe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Bn(e.r),this.g=Bn(e.g),this.b=Bn(e.b),this}copyLinearToSRGB(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=jt){return He.workingToColorSpace(Nt.copy(this),e),Math.round(Ve(Nt.r*255,0,255))*65536+Math.round(Ve(Nt.g*255,0,255))*256+Math.round(Ve(Nt.b*255,0,255))}getHexString(e=jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=He.workingColorSpace){He.workingToColorSpace(Nt.copy(this),n);const i=Nt.r,s=Nt.g,r=Nt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,n=He.workingColorSpace){return He.workingToColorSpace(Nt.copy(this),n),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=jt){He.workingToColorSpace(Nt.copy(this),e);const n=Nt.r,i=Nt.g,s=Nt.b;return e!==jt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,n,i){return this.getHSL(qn),this.setHSL(qn.h+e,qn.s+n,qn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(qn),e.getHSL(cr);const i=Us(qn.h,cr.h,n),s=Us(qn.s,cr.s,n),r=Us(qn.l,cr.l,n);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*n+r[3]*i+r[6]*s,this.g=r[1]*n+r[4]*i+r[7]*s,this.b=r[2]*n+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new ze;ze.NAMES=uh;class kc{constructor(e,n=25e-5){this.isFogExp2=!0,this.name="",this.color=new ze(e),this.density=n}clone(){return new kc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class yM extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const ln=new U,Ln=new U,Fa=new U,Dn=new U,Hi=new U,Gi=new U,hd=new U,Ua=new U,Oa=new U,ka=new U,Ba=new lt,Va=new lt,za=new lt;class hn{constructor(e=new U,n=new U,i=new U){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,s){s.subVectors(i,n),ln.subVectors(e,n),s.cross(ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,n,i,s,r){ln.subVectors(s,n),Ln.subVectors(i,n),Fa.subVectors(e,n);const a=ln.dot(ln),o=ln.dot(Ln),c=ln.dot(Fa),l=Ln.dot(Ln),h=Ln.dot(Fa),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,p=(a*h-o*c)*d;return r.set(1-f-p,p,f)}static containsPoint(e,n,i,s){return this.getBarycoord(e,n,i,s,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,n,i,s,r,a,o,c){return this.getBarycoord(e,n,i,s,Dn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Dn.x),c.addScaledVector(a,Dn.y),c.addScaledVector(o,Dn.z),c)}static getInterpolatedAttribute(e,n,i,s,r,a){return Ba.setScalar(0),Va.setScalar(0),za.setScalar(0),Ba.fromBufferAttribute(e,n),Va.fromBufferAttribute(e,i),za.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ba,r.x),a.addScaledVector(Va,r.y),a.addScaledVector(za,r.z),a}static isFrontFacing(e,n,i,s){return ln.subVectors(i,n),Ln.subVectors(e,n),ln.cross(Ln).dot(s)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,s){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,n,i,s){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ln.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),ln.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return hn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,s,r){return hn.getInterpolation(e,this.a,this.b,this.c,n,i,s,r)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,s=this.b,r=this.c;let a,o;Hi.subVectors(s,i),Gi.subVectors(r,i),Ua.subVectors(e,i);const c=Hi.dot(Ua),l=Gi.dot(Ua);if(c<=0&&l<=0)return n.copy(i);Oa.subVectors(e,s);const h=Hi.dot(Oa),u=Gi.dot(Oa);if(h>=0&&u<=h)return n.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),n.copy(i).addScaledVector(Hi,a);ka.subVectors(e,r);const f=Hi.dot(ka),p=Gi.dot(ka);if(p>=0&&f<=p)return n.copy(r);const _=f*l-c*p;if(_<=0&&l>=0&&p<=0)return o=l/(l-p),n.copy(i).addScaledVector(Gi,o);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return hd.subVectors(r,s),o=(u-h)/(u-h+(f-p)),n.copy(s).addScaledVector(hd,o);const g=1/(m+_+d);return a=_*g,o=d*g,n.copy(i).addScaledVector(Hi,a).addScaledVector(Gi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class hs{constructor(e=new U(1/0,1/0,1/0),n=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(dn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(dn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=dn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(n===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,dn):dn.fromBufferAttribute(r,a),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),lr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),lr.copy(i.boundingBox)),lr.applyMatrix4(e.matrixWorld),this.union(lr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ys),dr.subVectors(this.max,ys),Wi.subVectors(e.a,ys),$i.subVectors(e.b,ys),Xi.subVectors(e.c,ys),Kn.subVectors($i,Wi),Zn.subVectors(Xi,$i),di.subVectors(Wi,Xi);let n=[0,-Kn.z,Kn.y,0,-Zn.z,Zn.y,0,-di.z,di.y,Kn.z,0,-Kn.x,Zn.z,0,-Zn.x,di.z,0,-di.x,-Kn.y,Kn.x,0,-Zn.y,Zn.x,0,-di.y,di.x,0];return!Ha(n,Wi,$i,Xi,dr)||(n=[1,0,0,0,1,0,0,0,1],!Ha(n,Wi,$i,Xi,dr))?!1:(ur.crossVectors(Kn,Zn),n=[ur.x,ur.y,ur.z],Ha(n,Wi,$i,Xi,dr))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Nn=[new U,new U,new U,new U,new U,new U,new U,new U],dn=new U,lr=new hs,Wi=new U,$i=new U,Xi=new U,Kn=new U,Zn=new U,di=new U,ys=new U,dr=new U,ur=new U,ui=new U;function Ha(t,e,n,i,s){for(let r=0,a=t.length-3;r<=a;r+=3){ui.fromArray(t,r);const o=s.x*Math.abs(ui.x)+s.y*Math.abs(ui.y)+s.z*Math.abs(ui.z),c=e.dot(ui),l=n.dot(ui),h=i.dot(ui);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Mt=new U,hr=new Le;let SM=0;class wn extends ci{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:SM++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Jl,this.updateRanges=[],this.gpuType=En,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=n.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)hr.fromBufferAttribute(this,n),hr.applyMatrix3(e),this.setXY(n,hr.x,hr.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Mt.fromBufferAttribute(this,n),Mt.applyMatrix3(e),this.setXYZ(n,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Mt.fromBufferAttribute(this,n),Mt.applyMatrix4(e),this.setXYZ(n,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Mt.fromBufferAttribute(this,n),Mt.applyNormalMatrix(e),this.setXYZ(n,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Mt.fromBufferAttribute(this,n),Mt.transformDirection(e),this.setXYZ(n,Mt.x,Mt.y,Mt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Ji(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Ut(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Ji(n,this.array)),n}setX(e,n){return this.normalized&&(n=Ut(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Ji(n,this.array)),n}setY(e,n){return this.normalized&&(n=Ut(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Ji(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Ut(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Ji(n,this.array)),n}setW(e,n){return this.normalized&&(n=Ut(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Ut(n,this.array),i=Ut(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,s){return e*=this.itemSize,this.normalized&&(n=Ut(n,this.array),i=Ut(i,this.array),s=Ut(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,n,i,s,r){return e*=this.itemSize,this.normalized&&(n=Ut(n,this.array),i=Ut(i,this.array),s=Ut(s,this.array),r=Ut(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Jl&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class hh extends wn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class fh extends wn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Vt extends wn{constructor(e,n,i){super(new Float32Array(e),n,i)}}const EM=new hs,Ss=new U,Ga=new U;class Xs{constructor(e=new U,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):EM.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ss.subVectors(e,this.center);const n=Ss.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(Ss,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ss.copy(e.center).add(Ga)),this.expandByPoint(Ss.copy(e.center).sub(Ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let bM=0;const sn=new ct,Wa=new Ct,Yi=new U,Zt=new hs,Es=new hs,wt=new U;class zt extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bM++}),this.uuid=us(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Hv(e)?fh:hh)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new De().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return sn.makeRotationFromQuaternion(e),this.applyMatrix4(sn),this}rotateX(e){return sn.makeRotationX(e),this.applyMatrix4(sn),this}rotateY(e){return sn.makeRotationY(e),this.applyMatrix4(sn),this}rotateZ(e){return sn.makeRotationZ(e),this.applyMatrix4(sn),this}translate(e,n,i){return sn.makeTranslation(e,n,i),this.applyMatrix4(sn),this}scale(e,n,i){return sn.makeScale(e,n,i),this.applyMatrix4(sn),this}lookAt(e){return Wa.lookAt(e),Wa.updateMatrix(),this.applyMatrix4(Wa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yi).negate(),this.translate(Yi.x,Yi.y,Yi.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Vt(i,3))}else{const i=Math.min(e.length,n.count);for(let s=0;s<i;s++){const r=e[s];n.setXYZ(s,r.x,r.y,r.z||0)}e.length>n.count&&Pe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,s=n.length;i<s;i++){const r=n[i];Zt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xs);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const i=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),n)for(let r=0,a=n.length;r<a;r++){const o=n[r];Es.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(Zt.min,Es.min),Zt.expandByPoint(wt),wt.addVectors(Zt.max,Es.max),Zt.expandByPoint(wt)):(Zt.expandByPoint(Es.min),Zt.expandByPoint(Es.max))}Zt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(wt));if(n)for(let r=0,a=n.length;r<a;r++){const o=n[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)wt.fromBufferAttribute(o,l),c&&(Yi.fromBufferAttribute(e,l),wt.add(Yi)),s=Math.max(s,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,s=n.normal,r=n.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new wn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],c=[];for(let M=0;M<i.count;M++)o[M]=new U,c[M]=new U;const l=new U,h=new U,u=new U,d=new Le,f=new Le,p=new Le,_=new U,m=new U;function g(M,b,P){l.fromBufferAttribute(i,M),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,P),d.fromBufferAttribute(r,M),f.fromBufferAttribute(r,b),p.fromBufferAttribute(r,P),h.sub(l),u.sub(l),f.sub(d),p.sub(d);const C=1/(f.x*p.y-p.x*f.y);isFinite(C)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(C),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(C),o[M].add(_),o[b].add(_),o[P].add(_),c[M].add(m),c[b].add(m),c[P].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let M=0,b=A.length;M<b;++M){const P=A[M],C=P.start,I=P.count;for(let X=C,W=C+I;X<W;X+=3)g(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const w=new U,v=new U,E=new U,y=new U;function T(M){E.fromBufferAttribute(s,M),y.copy(E);const b=o[M];w.copy(b),w.sub(E.multiplyScalar(E.dot(b))).normalize(),v.crossVectors(y,b);const C=v.dot(c[M])<0?-1:1;a.setXYZW(M,w.x,w.y,w.z,C)}for(let M=0,b=A.length;M<b;++M){const P=A[M],C=P.start,I=P.count;for(let X=C,W=C+I;X<W;X+=3)T(e.getX(X+0)),T(e.getX(X+1)),T(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new wn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,h=new U,u=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(n,p),r.fromBufferAttribute(n,_),a.fromBufferAttribute(n,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,p),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),o.add(h),c.add(h),l.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=n.count;d<f;d+=3)s.fromBufferAttribute(n,d+0),r.fromBufferAttribute(n,d+1),a.fromBufferAttribute(n,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)wt.fromBufferAttribute(e,n),wt.normalize(),e.setXYZ(n,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,p=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let g=0;g<h;g++)d[p++]=l[f++]}return new wn(d,h,u)}if(this.index===null)return Pe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new zt,i=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,i);n.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,i);c.push(f)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];n.addGroup(l.start,l.count,l.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(n))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(n));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let AM=0;class Ii extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:AM++}),this.uuid=us(),this.name="",this.type="Material",this.blending=ns,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mo,this.blendDst=yo,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Pe(`Material: parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Pe(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ns&&(i.blending=this.blending),this.side!==ri&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Mo&&(i.blendSrc=this.blendSrc),this.blendDst!==yo&&(i.blendDst=this.blendDst),this.blendEquation!==gi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==rs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(n){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ze().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Le().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Le().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const s=n.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=n[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Fn=new U,$a=new U,fr=new U,Jn=new U,Xa=new U,pr=new U,Ya=new U;class fa{constructor(e=new U,n=new U(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fn)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Fn.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Fn.copy(this.origin).addScaledVector(this.direction,n),Fn.distanceToSquared(e))}distanceSqToSegment(e,n,i,s){$a.copy(e).add(n).multiplyScalar(.5),fr.copy(n).sub(e).normalize(),Jn.copy(this.origin).sub($a);const r=e.distanceTo(n)*.5,a=-this.direction.dot(fr),o=Jn.dot(this.direction),c=-Jn.dot(fr),l=Jn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,p;if(h>0)if(u=a*c-o,d=a*o-c,p=r*h,u>=0)if(d>=-p)if(d<=p){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-p?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=p?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy($a).addScaledVector(fr,d),f}intersectSphere(e,n){Fn.subVectors(e.center,this.origin);const i=Fn.dot(this.direction),s=Fn.dot(Fn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(i=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),i>c||o>s)||((o>i||i!==i)&&(i=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(e){return this.intersectBox(e,Fn)!==null}intersectTriangle(e,n,i,s,r){Xa.subVectors(n,e),pr.subVectors(i,e),Ya.crossVectors(Xa,pr);let a=this.direction.dot(Ya),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jn.subVectors(this.origin,e);const c=o*this.direction.dot(pr.crossVectors(Jn,pr));if(c<0)return null;const l=o*this.direction.dot(Xa.cross(Jn));if(l<0||c+l>a)return null;const h=-o*Jn.dot(Ya);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ph extends Ii{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=$u,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fd=new ct,hi=new fa,mr=new Xs,pd=new U,gr=new U,_r=new U,xr=new U,qa=new U,vr=new U,md=new U,Mr=new U;class pn extends Ct{constructor(e=new zt,n=new ph){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,n){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){vr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(qa.fromBufferAttribute(u,e),a?vr.addScaledVector(qa,h):vr.addScaledVector(qa.sub(n),h))}n.add(vr)}return n}raycast(e,n){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),mr.copy(i.boundingSphere),mr.applyMatrix4(r),hi.copy(e.ray).recast(e.near),!(mr.containsPoint(hi.origin)===!1&&(hi.intersectSphere(mr,pd)===null||hi.origin.distanceToSquared(pd)>(e.far-e.near)**2))&&(fd.copy(r).invert(),hi.copy(e.ray).applyMatrix4(fd),!(i.boundingBox!==null&&hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,hi)))}_computeIntersections(e,n,i){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],A=Math.max(m.start,f.start),w=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let v=A,E=w;v<E;v+=3){const y=o.getX(v),T=o.getX(v+1),M=o.getX(v+2);s=yr(this,g,e,i,l,h,u,y,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const A=o.getX(m),w=o.getX(m+1),v=o.getX(m+2);s=yr(this,a,e,i,l,h,u,A,w,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,_=d.length;p<_;p++){const m=d[p],g=a[m.materialIndex],A=Math.max(m.start,f.start),w=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=A,E=w;v<E;v+=3){const y=v,T=v+1,M=v+2;s=yr(this,g,e,i,l,h,u,y,T,M),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,n.push(s))}}else{const p=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=p,g=_;m<g;m+=3){const A=m,w=m+1,v=m+2;s=yr(this,a,e,i,l,h,u,A,w,v),s&&(s.faceIndex=Math.floor(m/3),n.push(s))}}}}function TM(t,e,n,i,s,r,a,o){let c;if(e.side===Yt?c=i.intersectTriangle(a,r,s,!0,o):c=i.intersectTriangle(s,r,a,e.side===ri,o),c===null)return null;Mr.copy(o),Mr.applyMatrix4(t.matrixWorld);const l=n.ray.origin.distanceTo(Mr);return l<n.near||l>n.far?null:{distance:l,point:Mr.clone(),object:t}}function yr(t,e,n,i,s,r,a,o,c,l){t.getVertexPosition(o,gr),t.getVertexPosition(c,_r),t.getVertexPosition(l,xr);const h=TM(t,e,n,i,gr,_r,xr,md);if(h){const u=new U;hn.getBarycoord(md,gr,_r,xr,u),s&&(h.uv=hn.getInterpolatedAttribute(s,o,c,l,u,new Le)),r&&(h.uv1=hn.getInterpolatedAttribute(r,o,c,l,u,new Le)),a&&(h.normal=hn.getInterpolatedAttribute(a,o,c,l,u,new U),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new U,materialIndex:0};hn.getNormal(gr,_r,xr,d.normal),h.face=d,h.barycoord=u}return h}class wM extends Bt{constructor(e=null,n=1,i=1,s,r,a,o,c,l=It,h=It,u,d){super(null,a,o,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ka=new U,RM=new U,CM=new De;class Qn{constructor(e=new U(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,s){return this.normal.set(e,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const s=Ka.subVectors(i,n).cross(RM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const s=e.delta(Ka),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:n.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||CM.getNormalMatrix(e),s=this.coplanarPoint(Ka).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new Xs,PM=new Le(.5,.5),Sr=new U;class Bc{constructor(e=new Qn,n=new Qn,i=new Qn,s=new Qn,r=new Qn,a=new Qn){this.planes=[e,n,i,s,r,a]}set(e,n,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=bn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],_=r[9],m=r[10],g=r[11],A=r[12],w=r[13],v=r[14],E=r[15];if(s[0].setComponents(l-a,f-h,g-p,E-A).normalize(),s[1].setComponents(l+a,f+h,g+p,E+A).normalize(),s[2].setComponents(l+o,f+u,g+_,E+w).normalize(),s[3].setComponents(l-o,f-u,g-_,E-w).normalize(),i)s[4].setComponents(c,d,m,v).normalize(),s[5].setComponents(l-c,f-d,g-m,E-v).normalize();else if(s[4].setComponents(l-c,f-d,g-m,E-v).normalize(),n===bn)s[5].setComponents(l+c,f+d,g+m,E+v).normalize();else if(n===Vs)s[5].setComponents(c,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),fi.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(e){fi.center.set(0,0,0);const n=PM.distanceTo(e.center);return fi.radius=.7071067811865476+n,fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(e){const n=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(n[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const s=n[i];if(Sr.x=s.normal.x>0?e.max.x:e.min.x,Sr.y=s.normal.y>0?e.max.y:e.min.y,Sr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Sr)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class pa extends Ii{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const aa=new U,oa=new U,gd=new ct,bs=new fa,Er=new Xs,Za=new U,_d=new U;class cc extends Ct{constructor(e=new zt,n=new pa){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let s=1,r=n.count;s<r;s++)aa.fromBufferAttribute(n,s-1),oa.fromBufferAttribute(n,s),i[s]=i[s-1],i[s]+=aa.distanceTo(oa);e.setAttribute("lineDistance",new Vt(i,1))}else Pe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Er.copy(i.boundingSphere),Er.applyMatrix4(s),Er.radius+=r,e.ray.intersectsSphere(Er)===!1)return;gd.copy(s).invert(),bs.copy(e.ray).applyMatrix4(gd);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=l){const g=h.getX(_),A=h.getX(_+1),w=br(this,e,bs,c,g,A,_);w&&n.push(w)}if(this.isLineLoop){const _=h.getX(p-1),m=h.getX(f),g=br(this,e,bs,c,_,m,p-1);g&&n.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,m=p-1;_<m;_+=l){const g=br(this,e,bs,c,_,_+1,_);g&&n.push(g)}if(this.isLineLoop){const _=br(this,e,bs,c,p-1,f,p-1);_&&n.push(_)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function br(t,e,n,i,s,r,a){const o=t.geometry.attributes.position;if(aa.fromBufferAttribute(o,s),oa.fromBufferAttribute(o,r),n.distanceSqToSegment(aa,oa,Za,_d)>i)return;Za.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Za);if(!(l<e.near||l>e.far))return{distance:l,point:_d.clone().applyMatrix4(t.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:t}}const xd=new U,vd=new U;class IM extends cc{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let s=0,r=n.count;s<r;s+=2)xd.fromBufferAttribute(n,s),vd.fromBufferAttribute(n,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+xd.distanceTo(vd);e.setAttribute("lineDistance",new Vt(i,1))}else Pe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class mh extends Ii{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Md=new ct,lc=new fa,Ar=new Xs,Tr=new U;class yd extends Ct{constructor(e=new zt,n=new mh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ar.copy(i.boundingSphere),Ar.applyMatrix4(s),Ar.radius+=r,e.ray.intersectsSphere(Ar)===!1)return;Md.copy(s).invert(),lc.copy(e.ray).applyMatrix4(Md);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,u=i.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let p=d,_=f;p<_;p++){const m=l.getX(p);Tr.fromBufferAttribute(u,m),Sd(Tr,m,c,s,e,n,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,_=f;p<_;p++)Tr.fromBufferAttribute(u,p),Sd(Tr,p,c,s,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Sd(t,e,n,i,s,r,a){const o=lc.distanceSqToPoint(t);if(o<n){const c=new U;lc.closestPointToPoint(t,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class gh extends Bt{constructor(e=[],n=Ti,i,s,r,a,o,c,l,h){super(e,n,i,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class os extends Bt{constructor(e,n,i=Rn,s,r,a,o=It,c=It,l,h=zn,u=1){if(h!==zn&&h!==Mi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:n,depth:u};super(d,s,r,a,o,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Oc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class LM extends os{constructor(e,n=Rn,i=Ti,s,r,a=It,o=It,c,l=zn){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,n,i,s,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class _h extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ys extends zt{constructor(e=1,n=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,i,n,e,a,r,0),p("z","y","x",1,-1,i,n,-e,a,r,1),p("x","z","y",1,1,e,i,n,s,a,2),p("x","z","y",1,-1,e,i,-n,s,a,3),p("x","y","z",1,-1,e,n,i,s,r,4),p("x","y","z",-1,-1,e,n,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Vt(l,3)),this.setAttribute("normal",new Vt(h,3)),this.setAttribute("uv",new Vt(u,2));function p(_,m,g,A,w,v,E,y,T,M,b){const P=v/T,C=E/M,I=v/2,X=E/2,W=y/2,D=T+1,Y=M+1;let V=0,q=0;const te=new U;for(let ae=0;ae<Y;ae++){const ce=ae*C-X;for(let oe=0;oe<D;oe++){const ke=oe*P-I;te[_]=ke*A,te[m]=ce*w,te[g]=W,l.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[g]=y>0?1:-1,h.push(te.x,te.y,te.z),u.push(oe/T),u.push(1-ae/M),V+=1}}for(let ae=0;ae<M;ae++)for(let ce=0;ce<T;ce++){const oe=d+ce+D*ae,ke=d+ce+D*(ae+1),qe=d+(ce+1)+D*(ae+1),Be=d+(ce+1)+D*ae;c.push(oe,ke,Be),c.push(ke,qe,Be),q+=6}o.addGroup(f,q,b),f+=q,d+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ys(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function DM(t,e,n=2){const i=e&&e.length,s=i?e[0]*n:t.length;let r=xh(t,0,s,n,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(i&&(r=kM(t,e,r,n)),t.length>80*n){o=t[0],c=t[1];let h=o,u=c;for(let d=n;d<s;d+=n){const f=t[d],p=t[d+1];f<o&&(o=f),p<c&&(c=p),f>h&&(h=f),p>u&&(u=p)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return Hs(r,a,n,o,c,l,0),a}function xh(t,e,n,i,s){let r;if(s===KM(t,e,n,i)>0)for(let a=e;a<n;a+=i)r=Ed(a/i|0,t[a],t[a+1],r);else for(let a=n-i;a>=e;a-=i)r=Ed(a/i|0,t[a],t[a+1],r);return r&&cs(r,r.next)&&(Ws(r),r=r.next),r}function Ri(t,e){if(!t)return t;e||(e=t);let n=t,i;do if(i=!1,!n.steiner&&(cs(n,n.next)||dt(n.prev,n,n.next)===0)){if(Ws(n),n=e=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==e);return e}function Hs(t,e,n,i,s,r,a){if(!t)return;!a&&r&&GM(t,i,s,r);let o=t;for(;t.prev!==t.next;){const c=t.prev,l=t.next;if(r?FM(t,i,s,r):NM(t)){e.push(c.i,t.i,l.i),Ws(t),t=l.next,o=l.next;continue}if(t=l,t===o){a?a===1?(t=UM(Ri(t),e),Hs(t,e,n,i,s,r,2)):a===2&&OM(t,e,n,i,s,r):Hs(Ri(t),e,n,i,s,r,1);break}}}function NM(t){const e=t.prev,n=t,i=t.next;if(dt(e,n,i)>=0)return!1;const s=e.x,r=n.x,a=i.x,o=e.y,c=n.y,l=i.y,h=Math.min(s,r,a),u=Math.min(o,c,l),d=Math.max(s,r,a),f=Math.max(o,c,l);let p=i.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Ls(s,o,r,c,a,l,p.x,p.y)&&dt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function FM(t,e,n,i){const s=t.prev,r=t,a=t.next;if(dt(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,c,l),p=Math.min(h,u,d),_=Math.max(o,c,l),m=Math.max(h,u,d),g=dc(f,p,e,n,i),A=dc(_,m,e,n,i);let w=t.prevZ,v=t.nextZ;for(;w&&w.z>=g&&v&&v.z<=A;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==s&&w!==a&&Ls(o,h,c,u,l,d,w.x,w.y)&&dt(w.prev,w,w.next)>=0||(w=w.prevZ,v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&Ls(o,h,c,u,l,d,v.x,v.y)&&dt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;w&&w.z>=g;){if(w.x>=f&&w.x<=_&&w.y>=p&&w.y<=m&&w!==s&&w!==a&&Ls(o,h,c,u,l,d,w.x,w.y)&&dt(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;v&&v.z<=A;){if(v.x>=f&&v.x<=_&&v.y>=p&&v.y<=m&&v!==s&&v!==a&&Ls(o,h,c,u,l,d,v.x,v.y)&&dt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function UM(t,e){let n=t;do{const i=n.prev,s=n.next.next;!cs(i,s)&&Mh(i,n,n.next,s)&&Gs(i,s)&&Gs(s,i)&&(e.push(i.i,n.i,s.i),Ws(n),Ws(n.next),n=t=s),n=n.next}while(n!==t);return Ri(n)}function OM(t,e,n,i,s,r){let a=t;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&XM(a,o)){let c=yh(a,o);a=Ri(a,a.next),c=Ri(c,c.next),Hs(a,e,n,i,s,r,0),Hs(c,e,n,i,s,r,0);return}o=o.next}a=a.next}while(a!==t)}function kM(t,e,n,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,c=r<a-1?e[r+1]*i:t.length,l=xh(t,o,c,i,!1);l===l.next&&(l.steiner=!0),s.push($M(l))}s.sort(BM);for(let r=0;r<s.length;r++)n=VM(s[r],n);return n}function BM(t,e){let n=t.x-e.x;if(n===0&&(n=t.y-e.y,n===0)){const i=(t.next.y-t.y)/(t.next.x-t.x),s=(e.next.y-e.y)/(e.next.x-e.x);n=i-s}return n}function VM(t,e){const n=zM(t,e);if(!n)return e;const i=yh(n,t);return Ri(i,i.next),Ri(n,n.next)}function zM(t,e){let n=e;const i=t.x,s=t.y;let r=-1/0,a;if(cs(t,n))return n;do{if(cs(t,n.next))return n.next;if(s<=n.y&&s>=n.next.y&&n.next.y!==n.y){const u=n.x+(s-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(u<=i&&u>r&&(r=u,a=n.x<n.next.x?n:n.next,u===i))return a}n=n.next}while(n!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let h=1/0;n=a;do{if(i>=n.x&&n.x>=c&&i!==n.x&&vh(s<l?i:r,s,c,l,s<l?r:i,s,n.x,n.y)){const u=Math.abs(s-n.y)/(i-n.x);Gs(n,t)&&(u<h||u===h&&(n.x>a.x||n.x===a.x&&HM(a,n)))&&(a=n,h=u)}n=n.next}while(n!==o);return a}function HM(t,e){return dt(t.prev,t,e.prev)<0&&dt(e.next,t,t.next)<0}function GM(t,e,n,i){let s=t;do s.z===0&&(s.z=dc(s.x,s.y,e,n,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==t);s.prevZ.nextZ=null,s.prevZ=null,WM(s)}function WM(t){let e,n=1;do{let i=t,s;t=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let l=0;l<n&&(o++,a=a.nextZ,!!a);l++);let c=n;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:t=s,s.prevZ=r,r=s;i=a}r.nextZ=null,n*=2}while(e>1);return t}function dc(t,e,n,i,s){return t=(t-n)*s|0,e=(e-i)*s|0,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t|e<<1}function $M(t){let e=t,n=t;do(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next;while(e!==t);return n}function vh(t,e,n,i,s,r,a,o){return(s-a)*(e-o)>=(t-a)*(r-o)&&(t-a)*(i-o)>=(n-a)*(e-o)&&(n-a)*(r-o)>=(s-a)*(i-o)}function Ls(t,e,n,i,s,r,a,o){return!(t===a&&e===o)&&vh(t,e,n,i,s,r,a,o)}function XM(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!YM(t,e)&&(Gs(t,e)&&Gs(e,t)&&qM(t,e)&&(dt(t.prev,t,e.prev)||dt(t,e.prev,e))||cs(t,e)&&dt(t.prev,t,t.next)>0&&dt(e.prev,e,e.next)>0)}function dt(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function cs(t,e){return t.x===e.x&&t.y===e.y}function Mh(t,e,n,i){const s=Rr(dt(t,e,n)),r=Rr(dt(t,e,i)),a=Rr(dt(n,i,t)),o=Rr(dt(n,i,e));return!!(s!==r&&a!==o||s===0&&wr(t,n,e)||r===0&&wr(t,i,e)||a===0&&wr(n,t,i)||o===0&&wr(n,e,i))}function wr(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function Rr(t){return t>0?1:t<0?-1:0}function YM(t,e){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&Mh(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}function Gs(t,e){return dt(t.prev,t,t.next)<0?dt(t,e,t.next)>=0&&dt(t,t.prev,e)>=0:dt(t,e,t.prev)<0||dt(t,t.next,e)<0}function qM(t,e){let n=t,i=!1;const s=(t.x+e.x)/2,r=(t.y+e.y)/2;do n.y>r!=n.next.y>r&&n.next.y!==n.y&&s<(n.next.x-n.x)*(r-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==t);return i}function yh(t,e){const n=uc(t.i,t.x,t.y),i=uc(e.i,e.x,e.y),s=t.next,r=e.prev;return t.next=e,e.prev=t,n.next=s,s.prev=n,i.next=n,n.prev=i,r.next=i,i.prev=r,i}function Ed(t,e,n,i){const s=uc(t,e,n);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ws(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function uc(t,e,n){return{i:t,x:e,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function KM(t,e,n,i){let s=0;for(let r=e,a=n-i;r<n;r+=i)s+=(t[a]-t[r])*(t[r+1]+t[a+1]),a=r;return s}class ZM{static triangulate(e,n,i=2){return DM(e,n,i)}}class Vc{static area(e){const n=e.length;let i=0;for(let s=n-1,r=0;r<n;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Vc.area(e)<0}static triangulateShape(e,n){const i=[],s=[],r=[];bd(e),Ad(i,e);let a=e.length;n.forEach(bd);for(let c=0;c<n.length;c++)s.push(a),a+=n[c].length,Ad(i,n[c]);const o=ZM.triangulate(i,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function bd(t){const e=t.length;e>2&&t[e-1].equals(t[0])&&t.pop()}function Ad(t,e){for(let n=0;n<e.length;n++)t.push(e[n].x),t.push(e[n].y)}class ma extends zt{constructor(e=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:s};const r=e/2,a=n/2,o=Math.floor(i),c=Math.floor(s),l=o+1,h=c+1,u=e/o,d=n/c,f=[],p=[],_=[],m=[];for(let g=0;g<h;g++){const A=g*d-a;for(let w=0;w<l;w++){const v=w*u-r;p.push(v,-A,0),_.push(0,0,1),m.push(w/o),m.push(1-g/c)}}for(let g=0;g<c;g++)for(let A=0;A<o;A++){const w=A+l*g,v=A+l*(g+1),E=A+1+l*(g+1),y=A+1+l*g;f.push(w,v,y),f.push(v,E,y)}this.setIndex(f),this.setAttribute("position",new Vt(p,3)),this.setAttribute("normal",new Vt(_,3)),this.setAttribute("uv",new Vt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ma(e.width,e.height,e.widthSegments,e.heightSegments)}}function ls(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const s=t[n][i];if(Td(s))s.isRenderTargetTexture?(Pe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=s.clone();else if(Array.isArray(s))if(Td(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[n][i]=r}else e[n][i]=s.slice();else e[n][i]=s}}return e}function Ot(t){const e={};for(let n=0;n<t.length;n++){const i=ls(t[n]);for(const s in i)e[s]=i[s]}return e}function Td(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function JM(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Sh(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:He.workingColorSpace}const jM={clone:ls,merge:Ot};var QM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ey=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends Ii{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=QM,this.fragmentShader=ey,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ls(e.uniforms),this.uniformsGroups=JM(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?n.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[s]={type:"m4",value:a.toArray()}:n.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new ze().setHex(s.value);break;case"v2":this.uniforms[i].value=new Le().fromArray(s.value);break;case"v3":this.uniforms[i].value=new U().fromArray(s.value);break;case"v4":this.uniforms[i].value=new lt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new De().fromArray(s.value);break;case"m4":this.uniforms[i].value=new ct().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class ty extends Cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ny extends Ii{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=oc,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class iy extends Ii{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sy extends Ii{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Hr extends pa{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class Eh extends Ct{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=n}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}const Ja=new ct,wd=new U,Rd=new U;class ry{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.mapType=en,this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bc,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;wd.setFromMatrixPosition(e.matrixWorld),n.position.copy(wd),Rd.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Rd),n.updateMatrixWorld(),Ja.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ja,n.coordinateSystem,n.reversedDepth),n.coordinateSystem===Vs||n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ja)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Cr=new U,Pr=new ai,vn=new U;class bh extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Cr,Pr,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cr,Pr,vn.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(Cr,Pr,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cr,Pr,vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const jn=new U,Cd=new Le,Pd=new Le;class an extends bh{constructor(e=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=zs*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Fs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(Fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,n){return this.getViewBounds(e,Cd,Pd),n.subVectors(Pd,Cd)}setViewOffset(e,n,i,s,r,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Fs*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,n-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class zc extends bh{constructor(e=-1,n=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+n,c=s-n;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class ay extends ry{constructor(){super(new zc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Id extends Eh{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new ay}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class oy extends Eh{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const qi=-90,Ki=1;class cy extends Ct{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(qi,Ki,e,n);s.layers=this.layers,this.add(s);const r=new an(qi,Ki,e,n);r.layers=this.layers,this.add(r);const a=new an(qi,Ki,e,n);a.layers=this.layers,this.add(a);const o=new an(qi,Ki,e,n);o.layers=this.layers,this.add(o);const c=new an(qi,Ki,e,n);c.layers=this.layers,this.add(c);const l=new an(qi,Ki,e,n);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,s,r,a,o,c]=n;for(const l of n)this.remove(l);if(e===bn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Vs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of n)this.add(l),l.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class ly extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Ld{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ve(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ve(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Yc=class Yc{constructor(e,n,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,s){const r=this.elements;return r[0]=e,r[2]=n,r[1]=i,r[3]=s,this}};Yc.prototype.isMatrix2=!0;let Dd=Yc;class dy extends IM{constructor(e=10,n=10,i=4473924,s=8947848){i=new ze(i),s=new ze(s);const r=n/2,a=e/n,o=e/2,c=[],l=[];for(let d=0,f=0,p=-o;d<=n;d++,p+=a){c.push(-o,0,p,o,0,p),c.push(p,0,-o,p,0,o);const _=d===r?i:s;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const h=new zt;h.setAttribute("position",new Vt(c,3)),h.setAttribute("color",new Vt(l,3));const u=new pa({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class uy extends ci{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Pe("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Nd(t,e,n,i){const s=hy(i);switch(n){case sh:return t*e;case ah:return t*e/s.components*s.byteLength;case Ic:return t*e/s.components*s.byteLength;case wi:return t*e*2/s.components*s.byteLength;case Lc:return t*e*2/s.components*s.byteLength;case rh:return t*e*3/s.components*s.byteLength;case fn:return t*e*4/s.components*s.byteLength;case Dc:return t*e*4/s.components*s.byteLength;case kr:case Br:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Vr:case zr:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Lo:case No:return Math.max(t,16)*Math.max(e,8)/4;case Io:case Do:return Math.max(t,8)*Math.max(e,8)/2;case Fo:case Uo:case ko:case Bo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Oo:case ta:case Vo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case zo:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ho:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Go:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Wo:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case $o:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Yo:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case qo:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Ko:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Jo:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case jo:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Qo:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case ec:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case tc:case nc:case ic:return Math.ceil(t/4)*Math.ceil(e/4)*16;case sc:case rc:return Math.ceil(t/4)*Math.ceil(e/4)*8;case na:case ac:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function hy(t){switch(t){case en:case eh:return{byteLength:1,components:1};case ks:case th:case Vn:return{byteLength:2,components:1};case Cc:case Pc:return{byteLength:2,components:4};case Rn:case Rc:case En:return{byteLength:4,components:1};case nh:case ih:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wc}}));typeof window<"u"&&(window.__THREE__?Pe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wc);function Ah(){let t=null,e=!1,n=null,i=null;function s(r,a){n(r,a),i=t.requestAnimationFrame(s)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(s),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){n=r},setContext:function(r){t=r}}}function fy(t){const e=new WeakMap;function n(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=t.createBuffer();t.bindBuffer(c,d),t.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=t.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=t.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=t.HALF_FLOAT:f=t.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=t.SHORT;else if(l instanceof Uint32Array)f=t.UNSIGNED_INT;else if(l instanceof Int32Array)f=t.INT;else if(l instanceof Int8Array)f=t.BYTE;else if(l instanceof Uint8Array)f=t.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,c,l){const h=c.array,u=c.updateRanges;if(t.bindBuffer(l,o),u.length===0)t.bufferSubData(l,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],_=u[f];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const _=u[f];t.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(t.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,n(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var py=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,my=`#ifdef USE_ALPHAHASH
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
#endif`,gy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_y=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,My=`#ifdef USE_AOMAP
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
#endif`,yy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sy=`#ifdef USE_BATCHING
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
#endif`,Ey=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,by=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ay=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ty=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,wy=`#ifdef USE_IRIDESCENCE
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
#endif`,Ry=`#ifdef USE_BUMPMAP
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
#endif`,Cy=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Py=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Iy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ly=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ny=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Fy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Uy=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Oy=`#define PI 3.141592653589793
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
} // validated`,ky=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,By=`vec3 transformedNormal = objectNormal;
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
#endif`,Vy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wy="gl_FragColor = linearToOutputTexel( gl_FragColor );",$y=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Xy=`#ifdef USE_ENVMAP
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
#endif`,Yy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,qy=`#ifdef USE_ENVMAP
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
#endif`,Ky=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Zy=`#ifdef USE_ENVMAP
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
#endif`,Jy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Qy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,eS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tS=`#ifdef USE_GRADIENTMAP
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
}`,nS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,iS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rS=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,aS=`#ifdef USE_ENVMAP
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
#endif`,oS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,dS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,uS=`PhysicalMaterial material;
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
#endif`,hS=`uniform sampler2D dfgLUT;
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
}`,fS=`
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
#endif`,pS=`#if defined( RE_IndirectDiffuse )
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
#endif`,mS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gS=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,_S=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,MS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,yS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,SS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ES=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,bS=`#if defined( USE_POINTS_UV )
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
#endif`,AS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,TS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,RS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,CS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,PS=`#ifdef USE_MORPHTARGETS
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
#endif`,IS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,LS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,DS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,NS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,FS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,US=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,OS=`#ifdef USE_NORMALMAP
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
#endif`,kS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,BS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,VS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,HS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,GS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,WS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$S=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,XS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,YS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,KS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ZS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,JS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,QS=`float getShadowMask() {
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
}`,eE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tE=`#ifdef USE_SKINNING
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
#endif`,nE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,iE=`#ifdef USE_SKINNING
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
#endif`,sE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,aE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,oE=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,cE=`#ifdef USE_TRANSMISSION
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
#endif`,lE=`#ifdef USE_TRANSMISSION
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
#endif`,dE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mE=`uniform sampler2D t2D;
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
}`,gE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_E=`#ifdef ENVMAP_TYPE_CUBE
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
}`,xE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ME=`#include <common>
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
}`,yE=`#if DEPTH_PACKING == 3200
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
}`,SE=`#define DISTANCE
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
}`,EE=`#define DISTANCE
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
}`,bE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,AE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TE=`uniform float scale;
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
}`,wE=`uniform vec3 diffuse;
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
}`,RE=`#include <common>
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
}`,CE=`uniform vec3 diffuse;
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
}`,PE=`#define LAMBERT
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
}`,IE=`#define LAMBERT
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
}`,LE=`#define MATCAP
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
}`,DE=`#define MATCAP
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
}`,NE=`#define NORMAL
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
}`,FE=`#define NORMAL
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
}`,UE=`#define PHONG
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
}`,OE=`#define PHONG
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
}`,kE=`#define STANDARD
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
}`,BE=`#define STANDARD
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
}`,VE=`#define TOON
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
}`,zE=`#define TOON
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
}`,HE=`uniform float size;
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
}`,GE=`uniform vec3 diffuse;
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
}`,WE=`#include <common>
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
}`,$E=`uniform vec3 color;
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
}`,XE=`uniform float rotation;
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
}`,YE=`uniform vec3 diffuse;
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
}`,Ue={alphahash_fragment:py,alphahash_pars_fragment:my,alphamap_fragment:gy,alphamap_pars_fragment:_y,alphatest_fragment:xy,alphatest_pars_fragment:vy,aomap_fragment:My,aomap_pars_fragment:yy,batching_pars_vertex:Sy,batching_vertex:Ey,begin_vertex:by,beginnormal_vertex:Ay,bsdfs:Ty,iridescence_fragment:wy,bumpmap_pars_fragment:Ry,clipping_planes_fragment:Cy,clipping_planes_pars_fragment:Py,clipping_planes_pars_vertex:Iy,clipping_planes_vertex:Ly,color_fragment:Dy,color_pars_fragment:Ny,color_pars_vertex:Fy,color_vertex:Uy,common:Oy,cube_uv_reflection_fragment:ky,defaultnormal_vertex:By,displacementmap_pars_vertex:Vy,displacementmap_vertex:zy,emissivemap_fragment:Hy,emissivemap_pars_fragment:Gy,colorspace_fragment:Wy,colorspace_pars_fragment:$y,envmap_fragment:Xy,envmap_common_pars_fragment:Yy,envmap_pars_fragment:qy,envmap_pars_vertex:Ky,envmap_physical_pars_fragment:aS,envmap_vertex:Zy,fog_vertex:Jy,fog_pars_vertex:jy,fog_fragment:Qy,fog_pars_fragment:eS,gradientmap_pars_fragment:tS,lightmap_pars_fragment:nS,lights_lambert_fragment:iS,lights_lambert_pars_fragment:sS,lights_pars_begin:rS,lights_toon_fragment:oS,lights_toon_pars_fragment:cS,lights_phong_fragment:lS,lights_phong_pars_fragment:dS,lights_physical_fragment:uS,lights_physical_pars_fragment:hS,lights_fragment_begin:fS,lights_fragment_maps:pS,lights_fragment_end:mS,lightprobes_pars_fragment:gS,logdepthbuf_fragment:_S,logdepthbuf_pars_fragment:xS,logdepthbuf_pars_vertex:vS,logdepthbuf_vertex:MS,map_fragment:yS,map_pars_fragment:SS,map_particle_fragment:ES,map_particle_pars_fragment:bS,metalnessmap_fragment:AS,metalnessmap_pars_fragment:TS,morphinstance_vertex:wS,morphcolor_vertex:RS,morphnormal_vertex:CS,morphtarget_pars_vertex:PS,morphtarget_vertex:IS,normal_fragment_begin:LS,normal_fragment_maps:DS,normal_pars_fragment:NS,normal_pars_vertex:FS,normal_vertex:US,normalmap_pars_fragment:OS,clearcoat_normal_fragment_begin:kS,clearcoat_normal_fragment_maps:BS,clearcoat_pars_fragment:VS,iridescence_pars_fragment:zS,opaque_fragment:HS,packing:GS,premultiplied_alpha_fragment:WS,project_vertex:$S,dithering_fragment:XS,dithering_pars_fragment:YS,roughnessmap_fragment:qS,roughnessmap_pars_fragment:KS,shadowmap_pars_fragment:ZS,shadowmap_pars_vertex:JS,shadowmap_vertex:jS,shadowmask_pars_fragment:QS,skinbase_vertex:eE,skinning_pars_vertex:tE,skinning_vertex:nE,skinnormal_vertex:iE,specularmap_fragment:sE,specularmap_pars_fragment:rE,tonemapping_fragment:aE,tonemapping_pars_fragment:oE,transmission_fragment:cE,transmission_pars_fragment:lE,uv_pars_fragment:dE,uv_pars_vertex:uE,uv_vertex:hE,worldpos_vertex:fE,background_vert:pE,background_frag:mE,backgroundCube_vert:gE,backgroundCube_frag:_E,cube_vert:xE,cube_frag:vE,depth_vert:ME,depth_frag:yE,distance_vert:SE,distance_frag:EE,equirect_vert:bE,equirect_frag:AE,linedashed_vert:TE,linedashed_frag:wE,meshbasic_vert:RE,meshbasic_frag:CE,meshlambert_vert:PE,meshlambert_frag:IE,meshmatcap_vert:LE,meshmatcap_frag:DE,meshnormal_vert:NE,meshnormal_frag:FE,meshphong_vert:UE,meshphong_frag:OE,meshphysical_vert:kE,meshphysical_frag:BE,meshtoon_vert:VE,meshtoon_frag:zE,points_vert:HE,points_frag:GE,shadow_vert:WE,shadow_frag:$E,sprite_vert:XE,sprite_frag:YE},me={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new De}},envmap:{envMap:{value:null},envMapRotation:{value:new De},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new De}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new De}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new De},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new De},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new De},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new De}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new De}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new De}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0},uvTransform:{value:new De}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new De},alphaMap:{value:null},alphaMapTransform:{value:new De},alphaTest:{value:0}}},yn={basic:{uniforms:Ot([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:Ot([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new ze(0)},envMapIntensity:{value:1}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:Ot([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:Ot([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:Ot([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:Ot([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:Ot([me.points,me.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:Ot([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:Ot([me.common,me.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:Ot([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:Ot([me.sprite,me.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new De},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new De}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distance:{uniforms:Ot([me.common,me.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distance_vert,fragmentShader:Ue.distance_frag},shadow:{uniforms:Ot([me.lights,me.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};yn.physical={uniforms:Ot([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new De},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new De},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new De},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new De},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new De},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new De},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new De},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new De},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new De},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new De},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new De},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new De}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const Ir={r:0,b:0,g:0},qE=new ct,Th=new De;Th.set(-1,0,0,0,1,0,0,0,1);function KE(t,e,n,i,s,r){const a=new ze(0);let o=s===!0?0:1,c,l,h=null,u=0,d=null;function f(A){let w=A.isScene===!0?A.background:null;if(w&&w.isTexture){const v=A.backgroundBlurriness>0;w=e.get(w,v)}return w}function p(A){let w=!1;const v=f(A);v===null?m(a,o):v&&v.isColor&&(m(v,1),w=!0);const E=t.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(t.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function _(A,w){const v=f(w);v&&(v.isCubeTexture||v.mapping===ha)?(l===void 0&&(l=new pn(new Ys(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:ls(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:Yt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(E,y,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=v,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(qE.makeRotationFromEuler(w.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Th),l.material.toneMapped=He.getTransfer(v.colorSpace)!==Ze,(h!==v||u!==v.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=t.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new pn(new ma(2,2),new Cn({name:"BackgroundMaterial",uniforms:ls(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=He.getTransfer(v.colorSpace)!==Ze,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=t.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function m(A,w){A.getRGB(Ir,Sh(t)),n.buffers.color.setClear(Ir.r,Ir.g,Ir.b,w,r)}function g(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,w=1){a.set(A),o=w,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,m(a,o)},render:p,addToRenderList:_,dispose:g}}function ZE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(C,I,X,W,D){let Y=!1;const V=u(C,W,X,I);r!==V&&(r=V,l(r.object)),Y=f(C,W,X,D),Y&&p(C,W,X,D),D!==null&&e.update(D,t.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,v(C,I,X,W),D!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}function c(){return t.createVertexArray()}function l(C){return t.bindVertexArray(C)}function h(C){return t.deleteVertexArray(C)}function u(C,I,X,W){const D=W.wireframe===!0;let Y=i[I.id];Y===void 0&&(Y={},i[I.id]=Y);const V=C.isInstancedMesh===!0?C.id:0;let q=Y[V];q===void 0&&(q={},Y[V]=q);let te=q[X.id];te===void 0&&(te={},q[X.id]=te);let ae=te[D];return ae===void 0&&(ae=d(c()),te[D]=ae),ae}function d(C){const I=[],X=[],W=[];for(let D=0;D<n;D++)I[D]=0,X[D]=0,W[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:X,attributeDivisors:W,object:C,attributes:{},index:null}}function f(C,I,X,W){const D=r.attributes,Y=I.attributes;let V=0;const q=X.getAttributes();for(const te in q)if(q[te].location>=0){const ce=D[te];let oe=Y[te];if(oe===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(oe=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(oe=C.instanceColor)),ce===void 0||ce.attribute!==oe||oe&&ce.data!==oe.data)return!0;V++}return r.attributesNum!==V||r.index!==W}function p(C,I,X,W){const D={},Y=I.attributes;let V=0;const q=X.getAttributes();for(const te in q)if(q[te].location>=0){let ce=Y[te];ce===void 0&&(te==="instanceMatrix"&&C.instanceMatrix&&(ce=C.instanceMatrix),te==="instanceColor"&&C.instanceColor&&(ce=C.instanceColor));const oe={};oe.attribute=ce,ce&&ce.data&&(oe.data=ce.data),D[te]=oe,V++}r.attributes=D,r.attributesNum=V,r.index=W}function _(){const C=r.newAttributes;for(let I=0,X=C.length;I<X;I++)C[I]=0}function m(C){g(C,0)}function g(C,I){const X=r.newAttributes,W=r.enabledAttributes,D=r.attributeDivisors;X[C]=1,W[C]===0&&(t.enableVertexAttribArray(C),W[C]=1),D[C]!==I&&(t.vertexAttribDivisor(C,I),D[C]=I)}function A(){const C=r.newAttributes,I=r.enabledAttributes;for(let X=0,W=I.length;X<W;X++)I[X]!==C[X]&&(t.disableVertexAttribArray(X),I[X]=0)}function w(C,I,X,W,D,Y,V){V===!0?t.vertexAttribIPointer(C,I,X,D,Y):t.vertexAttribPointer(C,I,X,W,D,Y)}function v(C,I,X,W){_();const D=W.attributes,Y=X.getAttributes(),V=I.defaultAttributeValues;for(const q in Y){const te=Y[q];if(te.location>=0){let ae=D[q];if(ae===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(ae=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(ae=C.instanceColor)),ae!==void 0){const ce=ae.normalized,oe=ae.itemSize,ke=e.get(ae);if(ke===void 0)continue;const qe=ke.buffer,Be=ke.type,J=ke.bytesPerElement,G=Be===t.INT||Be===t.UNSIGNED_INT||ae.gpuType===Rc;if(ae.isInterleavedBufferAttribute){const O=ae.data,ie=O.stride,ne=ae.offset;if(O.isInstancedInterleavedBuffer){for(let re=0;re<te.locationSize;re++)g(te.location+re,O.meshPerAttribute);C.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let re=0;re<te.locationSize;re++)m(te.location+re);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let re=0;re<te.locationSize;re++)w(te.location+re,oe/te.locationSize,Be,ce,ie*J,(ne+oe/te.locationSize*re)*J,G)}else{if(ae.isInstancedBufferAttribute){for(let O=0;O<te.locationSize;O++)g(te.location+O,ae.meshPerAttribute);C.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let O=0;O<te.locationSize;O++)m(te.location+O);t.bindBuffer(t.ARRAY_BUFFER,qe);for(let O=0;O<te.locationSize;O++)w(te.location+O,oe/te.locationSize,Be,ce,oe*J,oe/te.locationSize*O*J,G)}}else if(V!==void 0){const ce=V[q];if(ce!==void 0)switch(ce.length){case 2:t.vertexAttrib2fv(te.location,ce);break;case 3:t.vertexAttrib3fv(te.location,ce);break;case 4:t.vertexAttrib4fv(te.location,ce);break;default:t.vertexAttrib1fv(te.location,ce)}}}}A()}function E(){b();for(const C in i){const I=i[C];for(const X in I){const W=I[X];for(const D in W){const Y=W[D];for(const V in Y)h(Y[V].object),delete Y[V];delete W[D]}}delete i[C]}}function y(C){if(i[C.id]===void 0)return;const I=i[C.id];for(const X in I){const W=I[X];for(const D in W){const Y=W[D];for(const V in Y)h(Y[V].object),delete Y[V];delete W[D]}}delete i[C.id]}function T(C){for(const I in i){const X=i[I];for(const W in X){const D=X[W];if(D[C.id]===void 0)continue;const Y=D[C.id];for(const V in Y)h(Y[V].object),delete Y[V];delete D[C.id]}}}function M(C){for(const I in i){const X=i[I],W=C.isInstancedMesh===!0?C.id:0,D=X[W];if(D!==void 0){for(const Y in D){const V=D[Y];for(const q in V)h(V[q].object),delete V[q];delete D[Y]}delete X[W],Object.keys(X).length===0&&delete i[I]}}}function b(){P(),a=!0,r!==s&&(r=s,l(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:P,dispose:E,releaseStatesOfGeometry:y,releaseStatesOfObject:M,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:m,disableUnusedAttributes:A}}function JE(t,e,n){let i;function s(c){i=c}function r(c,l){t.drawArrays(i,c,l),n.update(l,i,1)}function a(c,l,h){h!==0&&(t.drawArraysInstanced(i,c,l,h),n.update(l,i,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,h);let d=0;for(let f=0;f<h;f++)d+=l[f];n.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function jE(t,e,n,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");s=t.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(T){return!(T!==fn&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const M=T===Vn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==en&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==En&&!M)}function c(T){if(T==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=n.precision!==void 0?n.precision:"highp";const h=c(l);h!==l&&(Pe("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=n.logarithmicDepthBuffer===!0,d=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&d===!1&&Pe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),p=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),g=t.getParameter(t.MAX_VERTEX_ATTRIBS),A=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),w=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),E=t.getParameter(t.MAX_SAMPLES),y=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:A,maxVaryings:w,maxFragmentUniforms:v,maxSamples:E,samples:y}}function QE(t){const e=this;let n=null,i=0,s=!1,r=!1;const a=new Qn,o=new De,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){n=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,g=t.get(u);if(!s||p===null||p.length===0||r&&!m)r?h(null):l();else{const A=r?0:i,w=A*4;let v=g.clippingState||null;c.value=v,v=h(p,d,w,f);for(let E=0;E!==w;++E)v[E]=n[E];g.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,d,f,p){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,p!==!0||m===null){const g=f+_*4,A=d.matrixWorldInverse;o.getNormalMatrix(A),(m===null||m.length<g)&&(m=new Float32Array(g));for(let w=0,v=f;w!==_;++w,v+=4)a.copy(u[w]).applyMatrix4(A,o),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const ni=4,Fd=[.125,.215,.35,.446,.526,.582],_i=20,eb=256,As=new zc,Ud=new ze;let ja=null,Qa=0,eo=0,to=!1;const tb=new U;class Od{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,s=100,r={}){const{size:a=256,position:o=tb}=r;ja=this._renderer.getRenderTarget(),Qa=this._renderer.getActiveCubeFace(),eo=this._renderer.getActiveMipmapLevel(),to=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,o),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ja,Qa,eo),this._renderer.xr.enabled=to,e.scissorTest=!1,Zi(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ti||e.mapping===as?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ja=this._renderer.getRenderTarget(),Qa=this._renderer.getActiveCubeFace(),eo=this._renderer.getActiveMipmapLevel(),to=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Ft,minFilter:Ft,generateMipmaps:!1,type:Vn,format:fn,colorSpace:ia,depthBuffer:!1},s=kd(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kd(e,n,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=nb(r)),this._blurMaterial=sb(r,e,n),this._ggxMaterial=ib(r,e,n)}return s}_compileMaterial(e){const n=new pn(new zt,e);this._renderer.compile(n,As)}_sceneToCubeUV(e,n,i,s,r){const c=new an(90,1,n,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Ud),u.toneMapping=An,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new pn(new Ys,new ph({name:"PMREM.Background",side:Yt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const A=e.background;A?A.isColor&&(m.color.copy(A),e.background=null,g=!0):(m.color.copy(Ud),g=!0);for(let w=0;w<6;w++){const v=w%3;v===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[w],r.y,r.z)):v===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[w]));const E=this._cubeSize;Zi(s,v*E,w>2?E:0,E,E),u.setRenderTarget(s),g&&u.render(_,c),u.render(e,c)}u.toneMapping=f,u.autoClear=d,e.background=A}_textureToCubeUV(e,n){const i=this._renderer,s=e.mapping===Ti||e.mapping===as;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Zi(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,As)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);n.autoClear=i}_applyGGXFilter(e,n,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),h=n/(this._lodMeshes.length-1),u=Math.sqrt(l*l-h*h),d=0+l*1.25,f=u*d,{_lodMax:p}=this,_=this._sizeLods[i],m=3*_*(i>p-ni?i-p+ni:0),g=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=p-n,Zi(r,m,g,3*_,2*_),s.setRenderTarget(r),s.render(o,As),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=p-i,Zi(e,m,g,3*_,2*_),s.setRenderTarget(e),s.render(o,As)}_blur(e,n,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,n,i,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&$e("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=l;const d=l.uniforms,f=this._sizeLods[i]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*_i-1),_=r/p,m=isFinite(r)?1+Math.floor(h*_):_i;m>_i&&Pe(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${_i}`);const g=[];let A=0;for(let T=0;T<_i;++T){const M=T/_,b=Math.exp(-M*M/2);g.push(b),T===0?A+=b:T<m&&(A+=2*b)}for(let T=0;T<g.length;T++)g[T]=g[T]/A;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:w}=this;d.dTheta.value=p,d.mipInt.value=w-i;const v=this._sizeLods[s],E=3*v*(s>w-ni?s-w+ni:0),y=4*(this._cubeSize-v);Zi(n,E,y,3*v,2*v),c.setRenderTarget(n),c.render(u,As)}}function nb(t){const e=[],n=[],i=[];let s=t;const r=t-ni+1+Fd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>t-ni?c=Fd[a-t+ni-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,_=3,m=2,g=1,A=new Float32Array(_*p*f),w=new Float32Array(m*p*f),v=new Float32Array(g*p*f);for(let y=0;y<f;y++){const T=y%3*2/3-1,M=y>2?0:-1,b=[T,M,0,T+2/3,M,0,T+2/3,M+1,0,T,M,0,T+2/3,M+1,0,T,M+1,0];A.set(b,_*p*y),w.set(d,m*p*y);const P=[y,y,y,y,y,y];v.set(P,g*p*y)}const E=new zt;E.setAttribute("position",new wn(A,_)),E.setAttribute("uv",new wn(w,m)),E.setAttribute("faceIndex",new wn(v,g)),i.push(new pn(E,null)),s>ni&&s--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function kd(t,e,n){const i=new Tn(t,e,n);return i.texture.mapping=ha,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Zi(t,e,n,i,s){t.viewport.set(e,n,i,s),t.scissor.set(e,n,i,s)}function ib(t,e,n){return new Cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:eb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ga(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function sb(t,e,n){const i=new Float32Array(_i),s=new U(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ga(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Bd(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ga(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Vd(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function ga(){return`

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
			`},s=new Ys(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:ls(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Yt,blending:kn});r.uniforms.tEquirect.value=n;const a=new pn(s,r),o=n.minFilter;return n.minFilter===vi&&(n.minFilter=Ft),new cy(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,s);e.setRenderTarget(r)}}function rb(t){let e=new WeakMap,n=new WeakMap,i=null;function s(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===Aa||f===Ta)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const _=new wh(p.height);return _.fromEquirectangularTexture(t,d),e.set(d,_),d.addEventListener("dispose",l),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===Aa||f===Ta,_=f===Ti||f===as;if(p||_){let m=n.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new Od(t)),m=p?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),m.texture;if(m!==void 0)return m.texture;{const A=d.image;return p&&A&&A.height>0||_&&A&&c(A)?(i===null&&(i=new Od(t)),m=p?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===Aa?d.mapping=Ti:f===Ta&&(d.mapping=as),d}function c(d){let f=0;const p=6;for(let _=0;_<p;_++)d[_]!==void 0&&f++;return f===p}function l(d){const f=d.target;f.removeEventListener("dispose",l);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=n.get(f);p!==void 0&&(n.delete(f),p.dispose())}function u(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function ab(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const s=t.getExtension(i);return e[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const s=n(i);return s===null&&is("WebGLRenderer: "+i+" extension not supported."),s}}}function ob(t,e,n,i){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,n.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)e.update(d[f],t.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,p=u.attributes.position;let _=0;if(p===void 0)return;if(f!==null){const A=f.array;_=f.version;for(let w=0,v=A.length;w<v;w+=3){const E=A[w+0],y=A[w+1],T=A[w+2];d.push(E,y,y,T,T,E)}}else{const A=p.array;_=p.version;for(let w=0,v=A.length/3-1;w<v;w+=3){const E=w+0,y=w+1,T=w+2;d.push(E,y,y,T,T,E)}}const m=new(p.count>=65535?fh:hh)(d,1);m.version=_;const g=r.get(u);g&&e.remove(g),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function cb(t,e,n){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,d){t.drawElements(i,d,r,u*a),n.update(d,i,1)}function l(u,d,f){f!==0&&(t.drawElementsInstanced(i,d,r,u*a,f),n.update(d,i,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,u,0,f);let _=0;for(let m=0;m<f;m++)_+=d[m];n.update(_,i,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function lb(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(r/3);break;case t.LINES:n.lines+=o*(r/2);break;case t.LINE_STRIP:n.lines+=o*(r-1);break;case t.LINE_LOOP:n.lines+=o*r;break;case t.POINTS:n.points+=o*r;break;default:$e("WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:s,update:i}}function db(t,e,n){const i=new WeakMap,s=new lt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==u){let b=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let w=0;f===!0&&(w=1),p===!0&&(w=2),_===!0&&(w=3);let v=o.attributes.position.count*w,E=1;v>e.maxTextureSize&&(E=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const y=new Float32Array(v*E*4*u),T=new lh(y,v,E,u);T.type=En,T.needsUpdate=!0;const M=w*4;for(let P=0;P<u;P++){const C=m[P],I=g[P],X=A[P],W=v*E*4*P;for(let D=0;D<C.count;D++){const Y=D*M;f===!0&&(s.fromBufferAttribute(C,D),y[W+Y+0]=s.x,y[W+Y+1]=s.y,y[W+Y+2]=s.z,y[W+Y+3]=0),p===!0&&(s.fromBufferAttribute(I,D),y[W+Y+4]=s.x,y[W+Y+5]=s.y,y[W+Y+6]=s.z,y[W+Y+7]=0),_===!0&&(s.fromBufferAttribute(X,D),y[W+Y+8]=s.x,y[W+Y+9]=s.y,y[W+Y+10]=s.z,y[W+Y+11]=X.itemSize===4?s.w:1)}}d={count:u,texture:T,size:new Le(v,E)},i.set(o,d),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];const p=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(t,"morphTargetBaseInfluence",p),c.getUniforms().setValue(t,"morphTargetInfluences",l)}c.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:r}}function ub(t,e,n,i,s){let r=new WeakMap;function a(l){const h=s.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),i.releaseStatesOfObject(h),n.remove(h.instanceMatrix),h.instanceColor!==null&&n.remove(h.instanceColor)}return{update:a,dispose:o}}const hb={[Xu]:"LINEAR_TONE_MAPPING",[Yu]:"REINHARD_TONE_MAPPING",[qu]:"CINEON_TONE_MAPPING",[Ku]:"ACES_FILMIC_TONE_MAPPING",[Ju]:"AGX_TONE_MAPPING",[ju]:"NEUTRAL_TONE_MAPPING",[Zu]:"CUSTOM_TONE_MAPPING"};function fb(t,e,n,i,s,r){const a=new Tn(e,n,{type:t,depthBuffer:s,stencilBuffer:r,samples:i?4:0,depthTexture:s?new os(e,n):void 0}),o=new Tn(e,n,{type:Vn,depthBuffer:!1,stencilBuffer:!1}),c=new zt;c.setAttribute("position",new Vt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Vt([0,2,0,0,2,0],2));const l=new ty({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new pn(c,l),u=new zc(-1,1,1,-1,0,1);let d=null,f=null,p=!1,_,m=null,g=[],A=!1;this.setSize=function(w,v){a.setSize(w,v),o.setSize(w,v);for(let E=0;E<g.length;E++){const y=g[E];y.setSize&&y.setSize(w,v)}},this.setEffects=function(w){g=w,A=g.length>0&&g[0].isRenderPass===!0;const v=a.width,E=a.height;for(let y=0;y<g.length;y++){const T=g[y];T.setSize&&T.setSize(v,E)}},this.begin=function(w,v){if(p||w.toneMapping===An&&g.length===0)return!1;if(m=v,v!==null){const E=v.width,y=v.height;(a.width!==E||a.height!==y)&&this.setSize(E,y)}return A===!1&&w.setRenderTarget(a),_=w.toneMapping,w.toneMapping=An,!0},this.hasRenderPass=function(){return A},this.end=function(w,v){w.toneMapping=_,p=!0;let E=a,y=o;for(let T=0;T<g.length;T++){const M=g[T];if(M.enabled!==!1&&(M.render(w,y,E,v),M.needsSwap!==!1)){const b=E;E=y,y=b}}if(d!==w.outputColorSpace||f!==w.toneMapping){d=w.outputColorSpace,f=w.toneMapping,l.defines={},He.getTransfer(d)===Ze&&(l.defines.SRGB_TRANSFER="");const T=hb[f];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=E.texture,w.setRenderTarget(m),w.render(h,u),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),c.dispose(),l.dispose()}}const Rh=new Bt,hc=new os(1,1),Ch=new lh,Ph=new fM,Ih=new gh,zd=[],Hd=[],Gd=new Float32Array(16),Wd=new Float32Array(9),$d=new Float32Array(4);function fs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const s=e*n;let r=zd[s];if(r===void 0&&(r=new Float32Array(s),zd[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(r,o)}return r}function bt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function At(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function _a(t,e){let n=Hd[e];n===void 0&&(n=new Int32Array(e),Hd[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function pb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function mb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2fv(this.addr,e),At(n,e)}}function gb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(bt(n,e))return;t.uniform3fv(this.addr,e),At(n,e)}}function _b(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4fv(this.addr,e),At(n,e)}}function xb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;$d.set(i),t.uniformMatrix2fv(this.addr,!1,$d),At(n,i)}}function vb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;Wd.set(i),t.uniformMatrix3fv(this.addr,!1,Wd),At(n,i)}}function Mb(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(bt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),At(n,e)}else{if(bt(n,i))return;Gd.set(i),t.uniformMatrix4fv(this.addr,!1,Gd),At(n,i)}}function yb(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function Sb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2iv(this.addr,e),At(n,e)}}function Eb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(bt(n,e))return;t.uniform3iv(this.addr,e),At(n,e)}}function bb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4iv(this.addr,e),At(n,e)}}function Ab(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function Tb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(bt(n,e))return;t.uniform2uiv(this.addr,e),At(n,e)}}function wb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(bt(n,e))return;t.uniform3uiv(this.addr,e),At(n,e)}}function Rb(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(bt(n,e))return;t.uniform4uiv(this.addr,e),At(n,e)}}function Cb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s);let r;this.type===t.SAMPLER_2D_SHADOW?(hc.compareFunction=n.isReversedDepthBuffer()?Fc:Nc,r=hc):r=Rh,n.setTexture2D(e||r,s)}function Pb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(e||Ph,s)}function Ib(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(e||Ih,s)}function Lb(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(e||Ch,s)}function Db(t){switch(t){case 5126:return pb;case 35664:return mb;case 35665:return gb;case 35666:return _b;case 35674:return xb;case 35675:return vb;case 35676:return Mb;case 5124:case 35670:return yb;case 35667:case 35671:return Sb;case 35668:case 35672:return Eb;case 35669:case 35673:return bb;case 5125:return Ab;case 36294:return Tb;case 36295:return wb;case 36296:return Rb;case 35678:case 36198:case 36298:case 36306:case 35682:return Cb;case 35679:case 36299:case 36307:return Pb;case 35680:case 36300:case 36308:case 36293:return Ib;case 36289:case 36303:case 36311:case 36292:return Lb}}function Nb(t,e){t.uniform1fv(this.addr,e)}function Fb(t,e){const n=fs(e,this.size,2);t.uniform2fv(this.addr,n)}function Ub(t,e){const n=fs(e,this.size,3);t.uniform3fv(this.addr,n)}function Ob(t,e){const n=fs(e,this.size,4);t.uniform4fv(this.addr,n)}function kb(t,e){const n=fs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Bb(t,e){const n=fs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Vb(t,e){const n=fs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function zb(t,e){t.uniform1iv(this.addr,e)}function Hb(t,e){t.uniform2iv(this.addr,e)}function Gb(t,e){t.uniform3iv(this.addr,e)}function Wb(t,e){t.uniform4iv(this.addr,e)}function $b(t,e){t.uniform1uiv(this.addr,e)}function Xb(t,e){t.uniform2uiv(this.addr,e)}function Yb(t,e){t.uniform3uiv(this.addr,e)}function qb(t,e){t.uniform4uiv(this.addr,e)}function Kb(t,e,n){const i=this.cache,s=e.length,r=_a(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));let a;this.type===t.SAMPLER_2D_SHADOW?a=hc:a=Rh;for(let o=0;o!==s;++o)n.setTexture2D(e[o]||a,r[o])}function Zb(t,e,n){const i=this.cache,s=e.length,r=_a(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTexture3D(e[a]||Ph,r[a])}function Jb(t,e,n){const i=this.cache,s=e.length,r=_a(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTextureCube(e[a]||Ih,r[a])}function jb(t,e,n){const i=this.cache,s=e.length,r=_a(n,s);bt(i,r)||(t.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)n.setTexture2DArray(e[a]||Ch,r[a])}function Qb(t){switch(t){case 5126:return Nb;case 35664:return Fb;case 35665:return Ub;case 35666:return Ob;case 35674:return kb;case 35675:return Bb;case 35676:return Vb;case 5124:case 35670:return zb;case 35667:case 35671:return Hb;case 35668:case 35672:return Gb;case 35669:case 35673:return Wb;case 5125:return $b;case 36294:return Xb;case 36295:return Yb;case 36296:return qb;case 35678:case 36198:case 36298:case 36306:case 35682:return Kb;case 35679:case 36299:case 36307:return Zb;case 35680:case 36300:case 36308:case 36293:return Jb;case 36289:case 36303:case 36311:case 36292:return jb}}class eA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=Db(n.type)}}class tA{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=Qb(n.type)}}class nA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,n[o.id],i)}}}const no=/(\w+)(\])?(\[|\.)?/g;function Xd(t,e){t.seq.push(e),t.map[e.id]=e}function iA(t,e,n){const i=t.name,s=i.length;for(no.lastIndex=0;;){const r=no.exec(i),a=no.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Xd(n,l===void 0?new eA(o,t,e):new tA(o,t,e));break}else{let u=n.map[o];u===void 0&&(u=new nA(o),Xd(n,u)),n=u}}}class Gr{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(n,a),c=e.getUniformLocation(n,o.name);iA(o,c,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,n,i,s){const r=this.map[n];r!==void 0&&r.setValue(e,i,s)}setOptional(e,n,i){const s=n[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,n,i,s){for(let r=0,a=n.length;r!==a;++r){const o=n[r],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,n){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in n&&i.push(a)}return i}}function Yd(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const sA=37297;let rA=0;function aA(t,e){const n=t.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,n.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const qd=new De;function oA(t){He._getMatrix(qd,He.workingColorSpace,t);const e=`mat3( ${qd.elements.map(n=>n.toFixed(4))} )`;switch(He.getTransfer(t)){case sa:return[e,"LinearTransferOETF"];case Ze:return[e,"sRGBTransferOETF"];default:return Pe("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Kd(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=(t.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+aA(t.getShaderSource(e),o)}else return r}function cA(t,e){const n=oA(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const lA={[Xu]:"Linear",[Yu]:"Reinhard",[qu]:"Cineon",[Ku]:"ACESFilmic",[Ju]:"AgX",[ju]:"Neutral",[Zu]:"Custom"};function dA(t,e){const n=lA[e];return n===void 0?(Pe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Lr=new U;function uA(){He.getLuminanceCoefficients(Lr);const t=Lr.x.toFixed(4),e=Lr.y.toFixed(4),n=Lr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hA(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ds).join(`
`)}function fA(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function pA(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=t.getActiveAttrib(e,s),a=r.name;let o=1;r.type===t.FLOAT_MAT2&&(o=2),r.type===t.FLOAT_MAT3&&(o=3),r.type===t.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function Ds(t){return t!==""}function Zd(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jd(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const mA=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(t){return t.replace(mA,_A)}const gA=new Map;function _A(t,e){let n=Ue[e];if(n===void 0){const i=gA.get(e);if(i!==void 0)n=Ue[i],Pe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return fc(n)}const xA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jd(t){return t.replace(xA,vA)}function vA(t,e,n,i){let s="";for(let r=parseInt(e);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Qd(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}const MA={[Or]:"SHADOWMAP_TYPE_PCF",[Ps]:"SHADOWMAP_TYPE_VSM"};function yA(t){return MA[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const SA={[Ti]:"ENVMAP_TYPE_CUBE",[as]:"ENVMAP_TYPE_CUBE",[ha]:"ENVMAP_TYPE_CUBE_UV"};function EA(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":SA[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const bA={[as]:"ENVMAP_MODE_REFRACTION"};function AA(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":bA[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const TA={[$u]:"ENVMAP_BLENDING_MULTIPLY",[Iv]:"ENVMAP_BLENDING_MIX",[Lv]:"ENVMAP_BLENDING_ADD"};function wA(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":TA[t.combine]||"ENVMAP_BLENDING_NONE"}function RA(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function CA(t,e,n,i){const s=t.getContext(),r=n.defines;let a=n.vertexShader,o=n.fragmentShader;const c=yA(n),l=EA(n),h=AA(n),u=wA(n),d=RA(n),f=hA(n),p=fA(r),_=s.createProgram();let m,g,A=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p].filter(Ds).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p].filter(Ds).join(`
`),g.length>0&&(g+=`
`)):(m=[Qd(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ds).join(`
`),g=[Qd(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,p,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+l:"",n.envMap?"#define "+h:"",n.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==An?"#define TONE_MAPPING":"",n.toneMapping!==An?Ue.tonemapping_pars_fragment:"",n.toneMapping!==An?dA("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,cA("linearToOutputTexel",n.outputColorSpace),uA(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Ds).join(`
`)),a=fc(a),a=Zd(a,n),a=Jd(a,n),o=fc(o),o=Zd(o,n),o=Jd(o,n),a=jd(a),o=jd(o),n.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",n.glslVersion===jl?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===jl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const w=A+m+a,v=A+g+o,E=Yd(s,s.VERTEX_SHADER,w),y=Yd(s,s.FRAGMENT_SHADER,v);s.attachShader(_,E),s.attachShader(_,y),n.index0AttributeName!==void 0?s.bindAttribLocation(_,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(C){if(t.debug.checkShaderErrors){const I=s.getProgramInfoLog(_)||"",X=s.getShaderInfoLog(E)||"",W=s.getShaderInfoLog(y)||"",D=I.trim(),Y=X.trim(),V=W.trim();let q=!0,te=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(q=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(s,_,E,y);else{const ae=Kd(s,E,"vertex"),ce=Kd(s,y,"fragment");$e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+D+`
`+ae+`
`+ce)}else D!==""?Pe("WebGLProgram: Program Info Log:",D):(Y===""||V==="")&&(te=!1);te&&(C.diagnostics={runnable:q,programLog:D,vertexShader:{log:Y,prefix:m},fragmentShader:{log:V,prefix:g}})}s.deleteShader(E),s.deleteShader(y),M=new Gr(s,_),b=pA(s,_)}let M;this.getUniforms=function(){return M===void 0&&T(this),M};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let P=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(_,sA)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=rA++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=y,this}let PA=0;class IA{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const s=this._getShaderCacheForMaterial(e);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new LA(e),n.set(e,i)),i}}class LA{constructor(e){this.id=PA++,this.code=e,this.usedTimes=0}}function DA(t){return t===wi||t===ta||t===na}function NA(t,e,n,i,s,r){const a=new dh,o=new IA,c=new Set,l=[],h=new Map,u=i.logarithmicDepthBuffer;let d=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(M){return c.add(M),M===0?"uv":`uv${M}`}function _(M,b,P,C,I,X){const W=C.fog,D=I.geometry,Y=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?C.environment:null,V=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap,q=e.get(M.envMap||Y,V),te=q&&q.mapping===ha?q.image.height:null,ae=f[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&Pe("WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const ce=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,oe=ce!==void 0?ce.length:0;let ke=0;D.morphAttributes.position!==void 0&&(ke=1),D.morphAttributes.normal!==void 0&&(ke=2),D.morphAttributes.color!==void 0&&(ke=3);let qe,Be,J,G;if(ae){const ye=yn[ae];qe=ye.vertexShader,Be=ye.fragmentShader}else{qe=M.vertexShader,Be=M.fragmentShader;const ye=o.getVertexShaderStage(M),ht=o.getFragmentShaderStage(M);o.update(M,ye,ht),J=ye.id,G=ht.id}const O=t.getRenderTarget(),ie=t.state.buffers.depth.getReversed(),ne=I.isInstancedMesh===!0,re=I.isBatchedMesh===!0,we=!!M.map,Ce=!!M.matcap,et=!!q,Xe=!!M.aoMap,Ge=!!M.lightMap,xt=!!M.bumpMap&&M.wireframe===!1,St=!!M.normalMap,Tt=!!M.displacementMap,Pt=!!M.emissiveMap,ut=!!M.metalnessMap,vt=!!M.roughnessMap,N=M.anisotropy>0,Ht=M.clearcoat>0,Ke=M.dispersion>0,R=M.iridescence>0,x=M.sheen>0,k=M.transmission>0,H=N&&!!M.anisotropyMap,K=Ht&&!!M.clearcoatMap,se=Ht&&!!M.clearcoatNormalMap,de=Ht&&!!M.clearcoatRoughnessMap,Z=R&&!!M.iridescenceMap,Q=R&&!!M.iridescenceThicknessMap,ue=x&&!!M.sheenColorMap,be=x&&!!M.sheenRoughnessMap,pe=!!M.specularMap,he=!!M.specularColorMap,Re=!!M.specularIntensityMap,Ie=k&&!!M.transmissionMap,Ne=k&&!!M.thicknessMap,L=!!M.gradientMap,le=!!M.alphaMap,j=M.alphaTest>0,fe=!!M.alphaHash,xe=!!M.extensions;let ee=An;M.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(ee=t.toneMapping);const Ee={shaderID:ae,shaderType:M.type,shaderName:M.name,vertexShader:qe,fragmentShader:Be,defines:M.defines,customVertexShaderID:J,customFragmentShaderID:G,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:re,batchingColor:re&&I._colorsTexture!==null,instancing:ne,instancingColor:ne&&I.instanceColor!==null,instancingMorph:ne&&I.morphTexture!==null,outputColorSpace:O===null?t.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:He.workingColorSpace,alphaToCoverage:!!M.alphaToCoverage,map:we,matcap:Ce,envMap:et,envMapMode:et&&q.mapping,envMapCubeUVHeight:te,aoMap:Xe,lightMap:Ge,bumpMap:xt,normalMap:St,displacementMap:Tt,emissiveMap:Pt,normalMapObjectSpace:St&&M.normalMapType===Fv,normalMapTangentSpace:St&&M.normalMapType===oc,packedNormalMap:St&&M.normalMapType===oc&&DA(M.normalMap.format),metalnessMap:ut,roughnessMap:vt,anisotropy:N,anisotropyMap:H,clearcoat:Ht,clearcoatMap:K,clearcoatNormalMap:se,clearcoatRoughnessMap:de,dispersion:Ke,iridescence:R,iridescenceMap:Z,iridescenceThicknessMap:Q,sheen:x,sheenColorMap:ue,sheenRoughnessMap:be,specularMap:pe,specularColorMap:he,specularIntensityMap:Re,transmission:k,transmissionMap:Ie,thicknessMap:Ne,gradientMap:L,opaque:M.transparent===!1&&M.blending===ns&&M.alphaToCoverage===!1,alphaMap:le,alphaTest:j,alphaHash:fe,combine:M.combine,mapUv:we&&p(M.map.channel),aoMapUv:Xe&&p(M.aoMap.channel),lightMapUv:Ge&&p(M.lightMap.channel),bumpMapUv:xt&&p(M.bumpMap.channel),normalMapUv:St&&p(M.normalMap.channel),displacementMapUv:Tt&&p(M.displacementMap.channel),emissiveMapUv:Pt&&p(M.emissiveMap.channel),metalnessMapUv:ut&&p(M.metalnessMap.channel),roughnessMapUv:vt&&p(M.roughnessMap.channel),anisotropyMapUv:H&&p(M.anisotropyMap.channel),clearcoatMapUv:K&&p(M.clearcoatMap.channel),clearcoatNormalMapUv:se&&p(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:de&&p(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&p(M.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&p(M.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&p(M.sheenColorMap.channel),sheenRoughnessMapUv:be&&p(M.sheenRoughnessMap.channel),specularMapUv:pe&&p(M.specularMap.channel),specularColorMapUv:he&&p(M.specularColorMap.channel),specularIntensityMapUv:Re&&p(M.specularIntensityMap.channel),transmissionMapUv:Ie&&p(M.transmissionMap.channel),thicknessMapUv:Ne&&p(M.thicknessMap.channel),alphaMapUv:le&&p(M.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(St||N),vertexNormals:!!D.attributes.normal,vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!D.attributes.uv&&(we||le),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.wireframe===!1&&(M.flatShading===!0||D.attributes.normal===void 0&&St===!1&&(M.isMeshLambertMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isMeshPhysicalMaterial)),sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ie,skinning:I.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:oe,morphTextureStride:ke,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:ee,decodeVideoTexture:we&&M.map.isVideoTexture===!0&&He.getTransfer(M.map.colorSpace)===Ze,decodeVideoTextureEmissive:Pt&&M.emissiveMap.isVideoTexture===!0&&He.getTransfer(M.emissiveMap.colorSpace)===Ze,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Sn,flipSided:M.side===Yt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:xe&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(xe&&M.extensions.multiDraw===!0||re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Ee.vertexUv1s=c.has(1),Ee.vertexUv2s=c.has(2),Ee.vertexUv3s=c.has(3),c.clear(),Ee}function m(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(g(b,M),A(b,M),b.push(t.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function g(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function A(M,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),b.packedNormalMap&&a.enable(22),b.vertexNormals&&a.enable(23),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),b.numLightProbeGrids>0&&a.enable(22),b.hasPositionAttribute&&a.enable(23),M.push(a.mask)}function w(M){const b=f[M.type];let P;if(b){const C=yn[b];P=jM.clone(C.uniforms)}else P=M.uniforms;return P}function v(M,b){let P=h.get(b);return P!==void 0?++P.usedTimes:(P=new CA(t,b,M,s),l.push(P),h.set(b,P)),P}function E(M){if(--M.usedTimes===0){const b=l.indexOf(M);l[b]=l[l.length-1],l.pop(),h.delete(M.cacheKey),M.destroy()}}function y(M){o.remove(M)}function T(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:w,acquireProgram:v,releaseProgram:E,releaseShaderCache:y,programs:l,dispose:T}}function FA(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function s(a,o,c){t.get(a)[o]=c}function r(){t=new WeakMap}return{has:e,get:n,remove:i,update:s,dispose:r}}function UA(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function eu(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function tu(){const t=[];let e=0;const n=[],i=[],s=[];function r(){e=0,n.length=0,i.length=0,s.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,_,m,g){let A=t[e];return A===void 0?(A={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:g},t[e]=A):(A.id=d.id,A.object=d,A.geometry=f,A.material=p,A.materialVariant=a(d),A.groupOrder=_,A.renderOrder=d.renderOrder,A.z=m,A.group=g),e++,A}function c(d,f,p,_,m,g){const A=o(d,f,p,_,m,g);p.transmission>0?i.push(A):p.transparent===!0?s.push(A):n.push(A)}function l(d,f,p,_,m,g){const A=o(d,f,p,_,m,g);p.transmission>0?i.unshift(A):p.transparent===!0?s.unshift(A):n.unshift(A)}function h(d,f,p){n.length>1&&n.sort(d||UA),i.length>1&&i.sort(f||eu),s.length>1&&s.sort(f||eu),p&&(n.reverse(),i.reverse(),s.reverse())}function u(){for(let d=e,f=t.length;d<f;d++){const p=t[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:u,sort:h}}function OA(){let t=new WeakMap;function e(i,s){const r=t.get(i);let a;return r===void 0?(a=new tu,t.set(i,[a])):s>=r.length?(a=new tu,r.push(a)):a=r[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function kA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new U,color:new ze};break;case"SpotLight":n={position:new U,direction:new U,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new U,color:new ze,distance:0,decay:0};break;case"HemisphereLight":n={direction:new U,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":n={color:new ze,position:new U,halfWidth:new U,halfHeight:new U};break}return t[e.id]=n,n}}}function BA(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let VA=0;function zA(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function HA(t){const e=new kA,n=BA(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new U);const s=new U,r=new ct,a=new ct;function o(l){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,p=0,_=0,m=0,g=0,A=0,w=0,v=0,E=0,y=0,T=0;l.sort(zA);for(let b=0,P=l.length;b<P;b++){const C=l[b],I=C.color,X=C.intensity,W=C.distance;let D=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===wi?D=C.shadow.map.texture:D=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=I.r*X,u+=I.g*X,d+=I.b*X;else if(C.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(C.sh.coefficients[Y],X);T++}else if(C.isDirectionalLight){const Y=e.get(C);if(Y.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const V=C.shadow,q=n.get(C);q.shadowIntensity=V.intensity,q.shadowBias=V.bias,q.shadowNormalBias=V.normalBias,q.shadowRadius=V.radius,q.shadowMapSize=V.mapSize,i.directionalShadow[f]=q,i.directionalShadowMap[f]=D,i.directionalShadowMatrix[f]=C.shadow.matrix,A++}i.directional[f]=Y,f++}else if(C.isSpotLight){const Y=e.get(C);Y.position.setFromMatrixPosition(C.matrixWorld),Y.color.copy(I).multiplyScalar(X),Y.distance=W,Y.coneCos=Math.cos(C.angle),Y.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),Y.decay=C.decay,i.spot[_]=Y;const V=C.shadow;if(C.map&&(i.spotLightMap[E]=C.map,E++,V.updateMatrices(C),C.castShadow&&y++),i.spotLightMatrix[_]=V.matrix,C.castShadow){const q=n.get(C);q.shadowIntensity=V.intensity,q.shadowBias=V.bias,q.shadowNormalBias=V.normalBias,q.shadowRadius=V.radius,q.shadowMapSize=V.mapSize,i.spotShadow[_]=q,i.spotShadowMap[_]=D,v++}_++}else if(C.isRectAreaLight){const Y=e.get(C);Y.color.copy(I).multiplyScalar(X),Y.halfWidth.set(C.width*.5,0,0),Y.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=Y,m++}else if(C.isPointLight){const Y=e.get(C);if(Y.color.copy(C.color).multiplyScalar(C.intensity),Y.distance=C.distance,Y.decay=C.decay,C.castShadow){const V=C.shadow,q=n.get(C);q.shadowIntensity=V.intensity,q.shadowBias=V.bias,q.shadowNormalBias=V.normalBias,q.shadowRadius=V.radius,q.shadowMapSize=V.mapSize,q.shadowCameraNear=V.camera.near,q.shadowCameraFar=V.camera.far,i.pointShadow[p]=q,i.pointShadowMap[p]=D,i.pointShadowMatrix[p]=C.shadow.matrix,w++}i.point[p]=Y,p++}else if(C.isHemisphereLight){const Y=e.get(C);Y.skyColor.copy(C.color).multiplyScalar(X),Y.groundColor.copy(C.groundColor).multiplyScalar(X),i.hemi[g]=Y,g++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const M=i.hash;(M.directionalLength!==f||M.pointLength!==p||M.spotLength!==_||M.rectAreaLength!==m||M.hemiLength!==g||M.numDirectionalShadows!==A||M.numPointShadows!==w||M.numSpotShadows!==v||M.numSpotMaps!==E||M.numLightProbes!==T)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=p,i.hemi.length=g,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=v+E-y,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=T,M.directionalLength=f,M.pointLength=p,M.spotLength=_,M.rectAreaLength=m,M.hemiLength=g,M.numDirectionalShadows=A,M.numPointShadows=w,M.numSpotShadows=v,M.numSpotMaps=E,M.numLightProbes=T,i.version=VA++)}function c(l,h){let u=0,d=0,f=0,p=0,_=0;const m=h.matrixWorldInverse;for(let g=0,A=l.length;g<A;g++){const w=l[g];if(w.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(w.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const v=i.rectArea[p];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(w.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(w.width*.5,0,0),v.halfHeight.set(0,w.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),p++}else if(w.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(w.matrixWorld),v.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(w.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:i}}function nu(t){const e=new HA(t),n=[],i=[],s=[];function r(d){u.camera=d,n.length=0,i.length=0,s.length=0}function a(d){n.push(d)}function o(d){i.push(d)}function c(d){s.push(d)}function l(){e.setup(n)}function h(d){e.setupView(n,d)}const u={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:c}}function GA(t){let e=new WeakMap;function n(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new nu(t),e.set(s,[o])):r>=a.length?(o=new nu(t),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:n,dispose:i}}const WA=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$A=`uniform sampler2D shadow_pass;
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
}`,XA=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],YA=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],iu=new ct,Ts=new U,io=new U;function qA(t,e,n){let i=new Bc;const s=new Le,r=new Le,a=new lt,o=new iy,c=new sy,l={},h=n.maxTextureSize,u={[ri]:Yt,[Yt]:ri,[Sn]:Sn},d=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:WA,fragmentShader:$A}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new zt;p.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new pn(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Or;let g=this.type;this.render=function(y,T,M){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||y.length===0)return;this.type===hv&&(Pe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Or);const b=t.getRenderTarget(),P=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),I=t.state;I.setBlending(kn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const X=g!==this.type;X&&T.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(D=>D.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,D=y.length;W<D;W++){const Y=y[W],V=Y.shadow;if(V===void 0){Pe("WebGLShadowMap:",Y,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const q=V.getFrameExtents();s.multiply(q),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,V.mapSize.y=r.y));const te=t.state.buffers.depth.getReversed();if(V.camera._reversedDepth=te,V.map===null||X===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Ps){if(Y.isPointLight){Pe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Tn(s.x,s.y,{format:wi,type:Vn,minFilter:Ft,magFilter:Ft,generateMipmaps:!1}),V.map.texture.name=Y.name+".shadowMap",V.map.depthTexture=new os(s.x,s.y,En),V.map.depthTexture.name=Y.name+".shadowMapDepth",V.map.depthTexture.format=zn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=It,V.map.depthTexture.magFilter=It}else Y.isPointLight?(V.map=new wh(s.x),V.map.depthTexture=new LM(s.x,Rn)):(V.map=new Tn(s.x,s.y),V.map.depthTexture=new os(s.x,s.y,Rn)),V.map.depthTexture.name=Y.name+".shadowMap",V.map.depthTexture.format=zn,this.type===Or?(V.map.depthTexture.compareFunction=te?Fc:Nc,V.map.depthTexture.minFilter=Ft,V.map.depthTexture.magFilter=Ft):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=It,V.map.depthTexture.magFilter=It);V.camera.updateProjectionMatrix()}const ae=V.map.isWebGLCubeRenderTarget?6:1;for(let ce=0;ce<ae;ce++){if(V.map.isWebGLCubeRenderTarget)t.setRenderTarget(V.map,ce),t.clear();else{ce===0&&(t.setRenderTarget(V.map),t.clear());const oe=V.getViewport(ce);a.set(r.x*oe.x,r.y*oe.y,r.x*oe.z,r.y*oe.w),I.viewport(a)}if(Y.isPointLight){const oe=V.camera,ke=V.matrix,qe=Y.distance||oe.far;qe!==oe.far&&(oe.far=qe,oe.updateProjectionMatrix()),Ts.setFromMatrixPosition(Y.matrixWorld),oe.position.copy(Ts),io.copy(oe.position),io.add(XA[ce]),oe.up.copy(YA[ce]),oe.lookAt(io),oe.updateMatrixWorld(),ke.makeTranslation(-Ts.x,-Ts.y,-Ts.z),iu.multiplyMatrices(oe.projectionMatrix,oe.matrixWorldInverse),V._frustum.setFromProjectionMatrix(iu,oe.coordinateSystem,oe.reversedDepth)}else V.updateMatrices(Y);i=V.getFrustum(),v(T,M,V.camera,Y,this.type)}V.isPointLightShadow!==!0&&this.type===Ps&&A(V,M),V.needsUpdate=!1}g=this.type,m.needsUpdate=!1,t.setRenderTarget(b,P,C)};function A(y,T){const M=e.update(_);d.defines.VSM_SAMPLES!==y.blurSamples&&(d.defines.VSM_SAMPLES=y.blurSamples,f.defines.VSM_SAMPLES=y.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new Tn(s.x,s.y,{format:wi,type:Vn})),d.uniforms.shadow_pass.value=y.map.depthTexture,d.uniforms.resolution.value=y.mapSize,d.uniforms.radius.value=y.radius,t.setRenderTarget(y.mapPass),t.clear(),t.renderBufferDirect(T,null,M,d,_,null),f.uniforms.shadow_pass.value=y.mapPass.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,t.setRenderTarget(y.map),t.clear(),t.renderBufferDirect(T,null,M,f,_,null)}function w(y,T,M,b){let P=null;const C=M.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(C!==void 0)P=C;else if(P=M.isPointLight===!0?c:o,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const I=P.uuid,X=T.uuid;let W=l[I];W===void 0&&(W={},l[I]=W);let D=W[X];D===void 0&&(D=P.clone(),W[X]=D,T.addEventListener("dispose",E)),P=D}if(P.visible=T.visible,P.wireframe=T.wireframe,b===Ps?P.side=T.shadowSide!==null?T.shadowSide:T.side:P.side=T.shadowSide!==null?T.shadowSide:u[T.side],P.alphaMap=T.alphaMap,P.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,P.map=T.map,P.clipShadows=T.clipShadows,P.clippingPlanes=T.clippingPlanes,P.clipIntersection=T.clipIntersection,P.displacementMap=T.displacementMap,P.displacementScale=T.displacementScale,P.displacementBias=T.displacementBias,P.wireframeLinewidth=T.wireframeLinewidth,P.linewidth=T.linewidth,M.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const I=t.properties.get(P);I.light=M}return P}function v(y,T,M,b,P){if(y.visible===!1)return;if(y.layers.test(T.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&P===Ps)&&(!y.frustumCulled||i.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,y.matrixWorld);const X=e.update(y),W=y.material;if(Array.isArray(W)){const D=X.groups;for(let Y=0,V=D.length;Y<V;Y++){const q=D[Y],te=W[q.materialIndex];if(te&&te.visible){const ae=w(y,te,b,P);y.onBeforeShadow(t,y,T,M,X,ae,q),t.renderBufferDirect(M,null,X,ae,y,q),y.onAfterShadow(t,y,T,M,X,ae,q)}}}else if(W.visible){const D=w(y,W,b,P);y.onBeforeShadow(t,y,T,M,X,D,null),t.renderBufferDirect(M,null,X,D,y,null),y.onAfterShadow(t,y,T,M,X,D,null)}}const I=y.children;for(let X=0,W=I.length;X<W;X++)v(I[X],T,M,b,P)}function E(y){y.target.removeEventListener("dispose",E);for(const M in l){const b=l[M],P=y.target.uuid;P in b&&(b[P].dispose(),delete b[P])}}}function KA(t,e){function n(){let L=!1;const le=new lt;let j=null;const fe=new lt(0,0,0,0);return{setMask:function(xe){j!==xe&&!L&&(t.colorMask(xe,xe,xe,xe),j=xe)},setLocked:function(xe){L=xe},setClear:function(xe,ee,Ee,ye,ht){ht===!0&&(xe*=ye,ee*=ye,Ee*=ye),le.set(xe,ee,Ee,ye),fe.equals(le)===!1&&(t.clearColor(xe,ee,Ee,ye),fe.copy(le))},reset:function(){L=!1,j=null,fe.set(-1,0,0,0)}}}function i(){let L=!1,le=!1,j=null,fe=null,xe=null;return{setReversed:function(ee){if(le!==ee){const Ee=e.get("EXT_clip_control");ee?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),le=ee;const ye=xe;xe=null,this.setClear(ye)}},getReversed:function(){return le},setTest:function(ee){ee?O(t.DEPTH_TEST):ie(t.DEPTH_TEST)},setMask:function(ee){j!==ee&&!L&&(t.depthMask(ee),j=ee)},setFunc:function(ee){if(le&&(ee=$v[ee]),fe!==ee){switch(ee){case So:t.depthFunc(t.NEVER);break;case Eo:t.depthFunc(t.ALWAYS);break;case bo:t.depthFunc(t.LESS);break;case rs:t.depthFunc(t.LEQUAL);break;case Ao:t.depthFunc(t.EQUAL);break;case To:t.depthFunc(t.GEQUAL);break;case wo:t.depthFunc(t.GREATER);break;case Ro:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}fe=ee}},setLocked:function(ee){L=ee},setClear:function(ee){xe!==ee&&(xe=ee,le&&(ee=1-ee),t.clearDepth(ee))},reset:function(){L=!1,j=null,fe=null,xe=null,le=!1}}}function s(){let L=!1,le=null,j=null,fe=null,xe=null,ee=null,Ee=null,ye=null,ht=null;return{setTest:function(it){L||(it?O(t.STENCIL_TEST):ie(t.STENCIL_TEST))},setMask:function(it){le!==it&&!L&&(t.stencilMask(it),le=it)},setFunc:function(it,mn,gn){(j!==it||fe!==mn||xe!==gn)&&(t.stencilFunc(it,mn,gn),j=it,fe=mn,xe=gn)},setOp:function(it,mn,gn){(ee!==it||Ee!==mn||ye!==gn)&&(t.stencilOp(it,mn,gn),ee=it,Ee=mn,ye=gn)},setLocked:function(it){L=it},setClear:function(it){ht!==it&&(t.clearStencil(it),ht=it)},reset:function(){L=!1,le=null,j=null,fe=null,xe=null,ee=null,Ee=null,ye=null,ht=null}}}const r=new n,a=new i,o=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,A=null,w=null,v=null,E=null,y=null,T=null,M=new ze(0,0,0),b=0,P=!1,C=null,I=null,X=null,W=null,D=null;const Y=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,q=0;const te=t.getParameter(t.VERSION);te.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(te)[1]),V=q>=1):te.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),V=q>=2);let ae=null,ce={};const oe=t.getParameter(t.SCISSOR_BOX),ke=t.getParameter(t.VIEWPORT),qe=new lt().fromArray(oe),Be=new lt().fromArray(ke);function J(L,le,j,fe){const xe=new Uint8Array(4),ee=t.createTexture();t.bindTexture(L,ee),t.texParameteri(L,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(L,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ee=0;Ee<j;Ee++)L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY?t.texImage3D(le,0,t.RGBA,1,1,fe,0,t.RGBA,t.UNSIGNED_BYTE,xe):t.texImage2D(le+Ee,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,xe);return ee}const G={};G[t.TEXTURE_2D]=J(t.TEXTURE_2D,t.TEXTURE_2D,1),G[t.TEXTURE_CUBE_MAP]=J(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[t.TEXTURE_2D_ARRAY]=J(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),G[t.TEXTURE_3D]=J(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),O(t.DEPTH_TEST),a.setFunc(rs),xt(!1),St(Xl),O(t.CULL_FACE),Xe(kn);function O(L){h[L]!==!0&&(t.enable(L),h[L]=!0)}function ie(L){h[L]!==!1&&(t.disable(L),h[L]=!1)}function ne(L,le){return d[L]!==le?(t.bindFramebuffer(L,le),d[L]=le,L===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=le),L===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=le),!0):!1}function re(L,le){let j=p,fe=!1;if(L){j=f.get(le),j===void 0&&(j=[],f.set(le,j));const xe=L.textures;if(j.length!==xe.length||j[0]!==t.COLOR_ATTACHMENT0){for(let ee=0,Ee=xe.length;ee<Ee;ee++)j[ee]=t.COLOR_ATTACHMENT0+ee;j.length=xe.length,fe=!0}}else j[0]!==t.BACK&&(j[0]=t.BACK,fe=!0);fe&&t.drawBuffers(j)}function we(L){return _!==L?(t.useProgram(L),_=L,!0):!1}const Ce={[gi]:t.FUNC_ADD,[pv]:t.FUNC_SUBTRACT,[mv]:t.FUNC_REVERSE_SUBTRACT};Ce[gv]=t.MIN,Ce[_v]=t.MAX;const et={[xv]:t.ZERO,[vv]:t.ONE,[Mv]:t.SRC_COLOR,[Mo]:t.SRC_ALPHA,[Tv]:t.SRC_ALPHA_SATURATE,[bv]:t.DST_COLOR,[Sv]:t.DST_ALPHA,[yv]:t.ONE_MINUS_SRC_COLOR,[yo]:t.ONE_MINUS_SRC_ALPHA,[Av]:t.ONE_MINUS_DST_COLOR,[Ev]:t.ONE_MINUS_DST_ALPHA,[wv]:t.CONSTANT_COLOR,[Rv]:t.ONE_MINUS_CONSTANT_COLOR,[Cv]:t.CONSTANT_ALPHA,[Pv]:t.ONE_MINUS_CONSTANT_ALPHA};function Xe(L,le,j,fe,xe,ee,Ee,ye,ht,it){if(L===kn){m===!0&&(ie(t.BLEND),m=!1);return}if(m===!1&&(O(t.BLEND),m=!0),L!==fv){if(L!==g||it!==P){if((A!==gi||E!==gi)&&(t.blendEquation(t.FUNC_ADD),A=gi,E=gi),it)switch(L){case ns:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Yl:t.blendFunc(t.ONE,t.ONE);break;case ql:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Kl:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:$e("WebGLState: Invalid blending: ",L);break}else switch(L){case ns:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Yl:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case ql:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Kl:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",L);break}w=null,v=null,y=null,T=null,M.set(0,0,0),b=0,g=L,P=it}return}xe=xe||le,ee=ee||j,Ee=Ee||fe,(le!==A||xe!==E)&&(t.blendEquationSeparate(Ce[le],Ce[xe]),A=le,E=xe),(j!==w||fe!==v||ee!==y||Ee!==T)&&(t.blendFuncSeparate(et[j],et[fe],et[ee],et[Ee]),w=j,v=fe,y=ee,T=Ee),(ye.equals(M)===!1||ht!==b)&&(t.blendColor(ye.r,ye.g,ye.b,ht),M.copy(ye),b=ht),g=L,P=!1}function Ge(L,le){L.side===Sn?ie(t.CULL_FACE):O(t.CULL_FACE);let j=L.side===Yt;le&&(j=!j),xt(j),L.blending===ns&&L.transparent===!1?Xe(kn):Xe(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const fe=L.stencilWrite;o.setTest(fe),fe&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Pt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?O(t.SAMPLE_ALPHA_TO_COVERAGE):ie(t.SAMPLE_ALPHA_TO_COVERAGE)}function xt(L){C!==L&&(L?t.frontFace(t.CW):t.frontFace(t.CCW),C=L)}function St(L){L!==dv?(O(t.CULL_FACE),L!==I&&(L===Xl?t.cullFace(t.BACK):L===uv?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):ie(t.CULL_FACE),I=L}function Tt(L){L!==X&&(V&&t.lineWidth(L),X=L)}function Pt(L,le,j){L?(O(t.POLYGON_OFFSET_FILL),(W!==le||D!==j)&&(W=le,D=j,a.getReversed()&&(le=-le),t.polygonOffset(le,j))):ie(t.POLYGON_OFFSET_FILL)}function ut(L){L?O(t.SCISSOR_TEST):ie(t.SCISSOR_TEST)}function vt(L){L===void 0&&(L=t.TEXTURE0+Y-1),ae!==L&&(t.activeTexture(L),ae=L)}function N(L,le,j){j===void 0&&(ae===null?j=t.TEXTURE0+Y-1:j=ae);let fe=ce[j];fe===void 0&&(fe={type:void 0,texture:void 0},ce[j]=fe),(fe.type!==L||fe.texture!==le)&&(ae!==j&&(t.activeTexture(j),ae=j),t.bindTexture(L,le||G[L]),fe.type=L,fe.texture=le)}function Ht(){const L=ce[ae];L!==void 0&&L.type!==void 0&&(t.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Ke(){try{t.compressedTexImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function R(){try{t.compressedTexImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function x(){try{t.texSubImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function k(){try{t.texSubImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function H(){try{t.compressedTexSubImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function K(){try{t.compressedTexSubImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function se(){try{t.texStorage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function de(){try{t.texStorage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function Z(){try{t.texImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function Q(){try{t.texImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function ue(L){return u[L]!==void 0?u[L]:t.getParameter(L)}function be(L,le){u[L]!==le&&(t.pixelStorei(L,le),u[L]=le)}function pe(L){qe.equals(L)===!1&&(t.scissor(L.x,L.y,L.z,L.w),qe.copy(L))}function he(L){Be.equals(L)===!1&&(t.viewport(L.x,L.y,L.z,L.w),Be.copy(L))}function Re(L,le){let j=l.get(le);j===void 0&&(j=new WeakMap,l.set(le,j));let fe=j.get(L);fe===void 0&&(fe=t.getUniformBlockIndex(le,L.name),j.set(L,fe))}function Ie(L,le){const fe=l.get(le).get(L);c.get(le)!==fe&&(t.uniformBlockBinding(le,fe,L.__bindingPointIndex),c.set(le,fe))}function Ne(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),h={},u={},ae=null,ce={},d={},f=new WeakMap,p=[],_=null,m=!1,g=null,A=null,w=null,v=null,E=null,y=null,T=null,M=new ze(0,0,0),b=0,P=!1,C=null,I=null,X=null,W=null,D=null,qe.set(0,0,t.canvas.width,t.canvas.height),Be.set(0,0,t.canvas.width,t.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:O,disable:ie,bindFramebuffer:ne,drawBuffers:re,useProgram:we,setBlending:Xe,setMaterial:Ge,setFlipSided:xt,setCullFace:St,setLineWidth:Tt,setPolygonOffset:Pt,setScissorTest:ut,activeTexture:vt,bindTexture:N,unbindTexture:Ht,compressedTexImage2D:Ke,compressedTexImage3D:R,texImage2D:Z,texImage3D:Q,pixelStorei:be,getParameter:ue,updateUBOMapping:Re,uniformBlockBinding:Ie,texStorage2D:se,texStorage3D:de,texSubImage2D:x,texSubImage3D:k,compressedTexSubImage2D:H,compressedTexSubImage3D:K,scissor:pe,viewport:he,reset:Ne}}function ZA(t,e,n,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Le,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(R,x){return p?new OffscreenCanvas(R,x):ra("canvas")}function m(R,x,k){let H=1;const K=Ke(R);if((K.width>k||K.height>k)&&(H=k/Math.max(K.width,K.height)),H<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const se=Math.floor(H*K.width),de=Math.floor(H*K.height);d===void 0&&(d=_(se,de));const Z=x?_(se,de):d;return Z.width=se,Z.height=de,Z.getContext("2d").drawImage(R,0,0,se,de),Pe("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+se+"x"+de+")."),Z}else return"data"in R&&Pe("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),R;return R}function g(R){return R.generateMipmaps}function A(R){t.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?t.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function v(R,x,k,H,K,se=!1){if(R!==null){if(t[R]!==void 0)return t[R];Pe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let de;H&&(de=e.get("EXT_texture_norm16"),de||Pe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=x;if(x===t.RED&&(k===t.FLOAT&&(Z=t.R32F),k===t.HALF_FLOAT&&(Z=t.R16F),k===t.UNSIGNED_BYTE&&(Z=t.R8),k===t.UNSIGNED_SHORT&&de&&(Z=de.R16_EXT),k===t.SHORT&&de&&(Z=de.R16_SNORM_EXT)),x===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.R8UI),k===t.UNSIGNED_SHORT&&(Z=t.R16UI),k===t.UNSIGNED_INT&&(Z=t.R32UI),k===t.BYTE&&(Z=t.R8I),k===t.SHORT&&(Z=t.R16I),k===t.INT&&(Z=t.R32I)),x===t.RG&&(k===t.FLOAT&&(Z=t.RG32F),k===t.HALF_FLOAT&&(Z=t.RG16F),k===t.UNSIGNED_BYTE&&(Z=t.RG8),k===t.UNSIGNED_SHORT&&de&&(Z=de.RG16_EXT),k===t.SHORT&&de&&(Z=de.RG16_SNORM_EXT)),x===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.RG8UI),k===t.UNSIGNED_SHORT&&(Z=t.RG16UI),k===t.UNSIGNED_INT&&(Z=t.RG32UI),k===t.BYTE&&(Z=t.RG8I),k===t.SHORT&&(Z=t.RG16I),k===t.INT&&(Z=t.RG32I)),x===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.RGB8UI),k===t.UNSIGNED_SHORT&&(Z=t.RGB16UI),k===t.UNSIGNED_INT&&(Z=t.RGB32UI),k===t.BYTE&&(Z=t.RGB8I),k===t.SHORT&&(Z=t.RGB16I),k===t.INT&&(Z=t.RGB32I)),x===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.RGBA8UI),k===t.UNSIGNED_SHORT&&(Z=t.RGBA16UI),k===t.UNSIGNED_INT&&(Z=t.RGBA32UI),k===t.BYTE&&(Z=t.RGBA8I),k===t.SHORT&&(Z=t.RGBA16I),k===t.INT&&(Z=t.RGBA32I)),x===t.RGB&&(k===t.UNSIGNED_SHORT&&de&&(Z=de.RGB16_EXT),k===t.SHORT&&de&&(Z=de.RGB16_SNORM_EXT),k===t.UNSIGNED_INT_5_9_9_9_REV&&(Z=t.RGB9_E5),k===t.UNSIGNED_INT_10F_11F_11F_REV&&(Z=t.R11F_G11F_B10F)),x===t.RGBA){const Q=se?sa:He.getTransfer(K);k===t.FLOAT&&(Z=t.RGBA32F),k===t.HALF_FLOAT&&(Z=t.RGBA16F),k===t.UNSIGNED_BYTE&&(Z=Q===Ze?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT&&de&&(Z=de.RGBA16_EXT),k===t.SHORT&&de&&(Z=de.RGBA16_SNORM_EXT),k===t.UNSIGNED_SHORT_4_4_4_4&&(Z=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&(Z=t.RGB5_A1)}return(Z===t.R16F||Z===t.R32F||Z===t.RG16F||Z===t.RG32F||Z===t.RGBA16F||Z===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function E(R,x){let k;return R?x===null||x===Rn||x===Bs?k=t.DEPTH24_STENCIL8:x===En?k=t.DEPTH32F_STENCIL8:x===ks&&(k=t.DEPTH24_STENCIL8,Pe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Rn||x===Bs?k=t.DEPTH_COMPONENT24:x===En?k=t.DEPTH_COMPONENT32F:x===ks&&(k=t.DEPTH_COMPONENT16),k}function y(R,x){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==It&&R.minFilter!==Ft?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function T(R){const x=R.target;x.removeEventListener("dispose",T),b(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&u.delete(x)}function M(R){const x=R.target;x.removeEventListener("dispose",M),C(x)}function b(R){const x=i.get(R);if(x.__webglInit===void 0)return;const k=R.source,H=f.get(k);if(H){const K=H[x.__cacheKey];K.usedTimes--,K.usedTimes===0&&P(R),Object.keys(H).length===0&&f.delete(k)}i.remove(R)}function P(R){const x=i.get(R);t.deleteTexture(x.__webglTexture);const k=R.source,H=f.get(k);delete H[x.__cacheKey],a.memory.textures--}function C(R){const x=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(x.__webglFramebuffer[H]))for(let K=0;K<x.__webglFramebuffer[H].length;K++)t.deleteFramebuffer(x.__webglFramebuffer[H][K]);else t.deleteFramebuffer(x.__webglFramebuffer[H]);x.__webglDepthbuffer&&t.deleteRenderbuffer(x.__webglDepthbuffer[H])}else{if(Array.isArray(x.__webglFramebuffer))for(let H=0;H<x.__webglFramebuffer.length;H++)t.deleteFramebuffer(x.__webglFramebuffer[H]);else t.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&t.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&t.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let H=0;H<x.__webglColorRenderbuffer.length;H++)x.__webglColorRenderbuffer[H]&&t.deleteRenderbuffer(x.__webglColorRenderbuffer[H]);x.__webglDepthRenderbuffer&&t.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const k=R.textures;for(let H=0,K=k.length;H<K;H++){const se=i.get(k[H]);se.__webglTexture&&(t.deleteTexture(se.__webglTexture),a.memory.textures--),i.remove(k[H])}i.remove(R)}let I=0;function X(){I=0}function W(){return I}function D(R){I=R}function Y(){const R=I;return R>=s.maxTextures&&Pe("WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),I+=1,R}function V(R){const x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function q(R,x){const k=i.get(R);if(R.isVideoTexture&&N(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&k.__version!==R.version){const H=R.image;if(H===null)Pe("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Pe("WebGLRenderer: Texture marked for update but image is incomplete");else{ie(k,R,x);return}}else R.isExternalTexture&&(k.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+x)}function te(R,x){const k=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){ie(k,R,x);return}else R.isExternalTexture&&(k.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+x)}function ae(R,x){const k=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){ie(k,R,x);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+x)}function ce(R,x){const k=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&k.__version!==R.version){ne(k,R,x);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+x)}const oe={[Co]:t.REPEAT,[Un]:t.CLAMP_TO_EDGE,[Po]:t.MIRRORED_REPEAT},ke={[It]:t.NEAREST,[Dv]:t.NEAREST_MIPMAP_NEAREST,[rr]:t.NEAREST_MIPMAP_LINEAR,[Ft]:t.LINEAR,[wa]:t.LINEAR_MIPMAP_NEAREST,[vi]:t.LINEAR_MIPMAP_LINEAR},qe={[Uv]:t.NEVER,[zv]:t.ALWAYS,[Ov]:t.LESS,[Nc]:t.LEQUAL,[kv]:t.EQUAL,[Fc]:t.GEQUAL,[Bv]:t.GREATER,[Vv]:t.NOTEQUAL};function Be(R,x){if(x.type===En&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Ft||x.magFilter===wa||x.magFilter===rr||x.magFilter===vi||x.minFilter===Ft||x.minFilter===wa||x.minFilter===rr||x.minFilter===vi)&&Pe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,oe[x.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,oe[x.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,oe[x.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,ke[x.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,ke[x.minFilter]),x.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,qe[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===It||x.minFilter!==rr&&x.minFilter!==vi||x.type===En&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function J(R,x){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",T));const H=x.source;let K=f.get(H);K===void 0&&(K={},f.set(H,K));const se=V(x);if(se!==R.__cacheKey){K[se]===void 0&&(K[se]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,k=!0),K[se].usedTimes++;const de=K[R.__cacheKey];de!==void 0&&(K[R.__cacheKey].usedTimes--,de.usedTimes===0&&P(x)),R.__cacheKey=se,R.__webglTexture=K[se].texture}return k}function G(R,x,k){return Math.floor(Math.floor(R/k)/x)}function O(R,x,k,H){const se=R.updateRanges;if(se.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,x.width,x.height,k,H,x.data);else{se.sort((be,pe)=>be.start-pe.start);let de=0;for(let be=1;be<se.length;be++){const pe=se[de],he=se[be],Re=pe.start+pe.count,Ie=G(he.start,x.width,4),Ne=G(pe.start,x.width,4);he.start<=Re+1&&Ie===Ne&&G(he.start+he.count-1,x.width,4)===Ie?pe.count=Math.max(pe.count,he.start+he.count-pe.start):(++de,se[de]=he)}se.length=de+1;const Z=n.getParameter(t.UNPACK_ROW_LENGTH),Q=n.getParameter(t.UNPACK_SKIP_PIXELS),ue=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,x.width);for(let be=0,pe=se.length;be<pe;be++){const he=se[be],Re=Math.floor(he.start/4),Ie=Math.ceil(he.count/4),Ne=Re%x.width,L=Math.floor(Re/x.width),le=Ie,j=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Ne),n.pixelStorei(t.UNPACK_SKIP_ROWS,L),n.texSubImage2D(t.TEXTURE_2D,0,Ne,L,le,j,k,H,x.data)}R.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,Z),n.pixelStorei(t.UNPACK_SKIP_PIXELS,Q),n.pixelStorei(t.UNPACK_SKIP_ROWS,ue)}}function ie(R,x,k){let H=t.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(H=t.TEXTURE_2D_ARRAY),x.isData3DTexture&&(H=t.TEXTURE_3D);const K=J(R,x),se=x.source;n.bindTexture(H,R.__webglTexture,t.TEXTURE0+k);const de=i.get(se);if(se.version!==de.__version||K===!0){if(n.activeTexture(t.TEXTURE0+k),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const j=He.getPrimaries(He.workingColorSpace),fe=x.colorSpace===ei?null:He.getPrimaries(x.colorSpace),xe=x.colorSpace===ei||j===fe?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe)}n.pixelStorei(t.UNPACK_ALIGNMENT,x.unpackAlignment);let Q=m(x.image,!1,s.maxTextureSize);Q=Ht(x,Q);const ue=r.convert(x.format,x.colorSpace),be=r.convert(x.type);let pe=v(x.internalFormat,ue,be,x.normalized,x.colorSpace,x.isVideoTexture);Be(H,x);let he;const Re=x.mipmaps,Ie=x.isVideoTexture!==!0,Ne=de.__version===void 0||K===!0,L=se.dataReady,le=y(x,Q);if(x.isDepthTexture)pe=E(x.format===Mi,x.type),Ne&&(Ie?n.texStorage2D(t.TEXTURE_2D,1,pe,Q.width,Q.height):n.texImage2D(t.TEXTURE_2D,0,pe,Q.width,Q.height,0,ue,be,null));else if(x.isDataTexture)if(Re.length>0){Ie&&Ne&&n.texStorage2D(t.TEXTURE_2D,le,pe,Re[0].width,Re[0].height);for(let j=0,fe=Re.length;j<fe;j++)he=Re[j],Ie?L&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,he.width,he.height,ue,be,he.data):n.texImage2D(t.TEXTURE_2D,j,pe,he.width,he.height,0,ue,be,he.data);x.generateMipmaps=!1}else Ie?(Ne&&n.texStorage2D(t.TEXTURE_2D,le,pe,Q.width,Q.height),L&&O(x,Q,ue,be)):n.texImage2D(t.TEXTURE_2D,0,pe,Q.width,Q.height,0,ue,be,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ie&&Ne&&n.texStorage3D(t.TEXTURE_2D_ARRAY,le,pe,Re[0].width,Re[0].height,Q.depth);for(let j=0,fe=Re.length;j<fe;j++)if(he=Re[j],x.format!==fn)if(ue!==null)if(Ie){if(L)if(x.layerUpdates.size>0){const xe=Nd(he.width,he.height,x.format,x.type);for(const ee of x.layerUpdates){const Ee=he.data.subarray(ee*xe/he.data.BYTES_PER_ELEMENT,(ee+1)*xe/he.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,ee,he.width,he.height,1,ue,Ee)}x.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,0,he.width,he.height,Q.depth,ue,he.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,j,pe,he.width,he.height,Q.depth,0,he.data,0,0);else Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?L&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,j,0,0,0,he.width,he.height,Q.depth,ue,be,he.data):n.texImage3D(t.TEXTURE_2D_ARRAY,j,pe,he.width,he.height,Q.depth,0,ue,be,he.data)}else{Ie&&Ne&&n.texStorage2D(t.TEXTURE_2D,le,pe,Re[0].width,Re[0].height);for(let j=0,fe=Re.length;j<fe;j++)he=Re[j],x.format!==fn?ue!==null?Ie?L&&n.compressedTexSubImage2D(t.TEXTURE_2D,j,0,0,he.width,he.height,ue,he.data):n.compressedTexImage2D(t.TEXTURE_2D,j,pe,he.width,he.height,0,he.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?L&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,he.width,he.height,ue,be,he.data):n.texImage2D(t.TEXTURE_2D,j,pe,he.width,he.height,0,ue,be,he.data)}else if(x.isDataArrayTexture)if(Ie){if(Ne&&n.texStorage3D(t.TEXTURE_2D_ARRAY,le,pe,Q.width,Q.height,Q.depth),L)if(x.layerUpdates.size>0){const j=Nd(Q.width,Q.height,x.format,x.type);for(const fe of x.layerUpdates){const xe=Q.data.subarray(fe*j/Q.data.BYTES_PER_ELEMENT,(fe+1)*j/Q.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,fe,Q.width,Q.height,1,ue,be,xe)}x.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ue,be,Q.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,pe,Q.width,Q.height,Q.depth,0,ue,be,Q.data);else if(x.isData3DTexture)Ie?(Ne&&n.texStorage3D(t.TEXTURE_3D,le,pe,Q.width,Q.height,Q.depth),L&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ue,be,Q.data)):n.texImage3D(t.TEXTURE_3D,0,pe,Q.width,Q.height,Q.depth,0,ue,be,Q.data);else if(x.isFramebufferTexture){if(Ne)if(Ie)n.texStorage2D(t.TEXTURE_2D,le,pe,Q.width,Q.height);else{let j=Q.width,fe=Q.height;for(let xe=0;xe<le;xe++)n.texImage2D(t.TEXTURE_2D,xe,pe,j,fe,0,ue,be,null),j>>=1,fe>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in t){const j=t.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),Q.parentNode!==j){j.appendChild(Q),u.add(x),j.onpaint=fe=>{const xe=fe.changedElements;for(const ee of u)xe.includes(ee.image)&&(ee.needsUpdate=!0)},j.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,Q);else{const xe=t.RGBA,ee=t.RGBA,Ee=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,xe,ee,Ee,Q)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Re.length>0){if(Ie&&Ne){const j=Ke(Re[0]);n.texStorage2D(t.TEXTURE_2D,le,pe,j.width,j.height)}for(let j=0,fe=Re.length;j<fe;j++)he=Re[j],Ie?L&&n.texSubImage2D(t.TEXTURE_2D,j,0,0,ue,be,he):n.texImage2D(t.TEXTURE_2D,j,pe,ue,be,he);x.generateMipmaps=!1}else if(Ie){if(Ne){const j=Ke(Q);n.texStorage2D(t.TEXTURE_2D,le,pe,j.width,j.height)}L&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ue,be,Q)}else n.texImage2D(t.TEXTURE_2D,0,pe,ue,be,Q);g(x)&&A(H),de.__version=se.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function ne(R,x,k){if(x.image.length!==6)return;const H=J(R,x),K=x.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+k);const se=i.get(K);if(K.version!==se.__version||H===!0){n.activeTexture(t.TEXTURE0+k);const de=He.getPrimaries(He.workingColorSpace),Z=x.colorSpace===ei?null:He.getPrimaries(x.colorSpace),Q=x.colorSpace===ei||de===Z?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const ue=x.isCompressedTexture||x.image[0].isCompressedTexture,be=x.image[0]&&x.image[0].isDataTexture,pe=[];for(let ee=0;ee<6;ee++)!ue&&!be?pe[ee]=m(x.image[ee],!0,s.maxCubemapSize):pe[ee]=be?x.image[ee].image:x.image[ee],pe[ee]=Ht(x,pe[ee]);const he=pe[0],Re=r.convert(x.format,x.colorSpace),Ie=r.convert(x.type),Ne=v(x.internalFormat,Re,Ie,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,le=se.__version===void 0||H===!0,j=K.dataReady;let fe=y(x,he);Be(t.TEXTURE_CUBE_MAP,x);let xe;if(ue){L&&le&&n.texStorage2D(t.TEXTURE_CUBE_MAP,fe,Ne,he.width,he.height);for(let ee=0;ee<6;ee++){xe=pe[ee].mipmaps;for(let Ee=0;Ee<xe.length;Ee++){const ye=xe[Ee];x.format!==fn?Re!==null?L?j&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,0,0,ye.width,ye.height,Re,ye.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,Ne,ye.width,ye.height,0,ye.data):Pe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?j&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,0,0,ye.width,ye.height,Re,Ie,ye.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,Ne,ye.width,ye.height,0,Re,Ie,ye.data)}}}else{if(xe=x.mipmaps,L&&le){xe.length>0&&fe++;const ee=Ke(pe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,fe,Ne,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(be){L?j&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,pe[ee].width,pe[ee].height,Re,Ie,pe[ee].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ne,pe[ee].width,pe[ee].height,0,Re,Ie,pe[ee].data);for(let Ee=0;Ee<xe.length;Ee++){const ht=xe[Ee].image[ee].image;L?j&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,0,0,ht.width,ht.height,Re,Ie,ht.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,Ne,ht.width,ht.height,0,Re,Ie,ht.data)}}else{L?j&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Re,Ie,pe[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ne,Re,Ie,pe[ee]);for(let Ee=0;Ee<xe.length;Ee++){const ye=xe[Ee];L?j&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,0,0,Re,Ie,ye.image[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,Ne,Re,Ie,ye.image[ee])}}}g(x)&&A(t.TEXTURE_CUBE_MAP),se.__version=K.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function re(R,x,k,H,K,se){const de=r.convert(k.format,k.colorSpace),Z=r.convert(k.type),Q=v(k.internalFormat,de,Z,k.normalized,k.colorSpace),ue=i.get(x),be=i.get(k);if(be.__renderTarget=x,!ue.__hasExternalTextures){const pe=Math.max(1,x.width>>se),he=Math.max(1,x.height>>se);K===t.TEXTURE_3D||K===t.TEXTURE_2D_ARRAY?n.texImage3D(K,se,Q,pe,he,x.depth,0,de,Z,null):n.texImage2D(K,se,Q,pe,he,0,de,Z,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),vt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,H,K,be.__webglTexture,0,ut(x)):(K===t.TEXTURE_2D||K>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,H,K,be.__webglTexture,se),n.bindFramebuffer(t.FRAMEBUFFER,null)}function we(R,x,k){if(t.bindRenderbuffer(t.RENDERBUFFER,R),x.depthBuffer){const H=x.depthTexture,K=H&&H.isDepthTexture?H.type:null,se=E(x.stencilBuffer,K),de=x.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;vt(x)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ut(x),se,x.width,x.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,ut(x),se,x.width,x.height):t.renderbufferStorage(t.RENDERBUFFER,se,x.width,x.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,de,t.RENDERBUFFER,R)}else{const H=x.textures;for(let K=0;K<H.length;K++){const se=H[K],de=r.convert(se.format,se.colorSpace),Z=r.convert(se.type),Q=v(se.internalFormat,de,Z,se.normalized,se.colorSpace);vt(x)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ut(x),Q,x.width,x.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,ut(x),Q,x.width,x.height):t.renderbufferStorage(t.RENDERBUFFER,Q,x.width,x.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ce(R,x,k){const H=x.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const K=i.get(x.depthTexture);if(K.__renderTarget=x,(!K.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),H){if(K.__webglInit===void 0&&(K.__webglInit=!0,x.depthTexture.addEventListener("dispose",T)),K.__webglTexture===void 0){K.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,K.__webglTexture),Be(t.TEXTURE_CUBE_MAP,x.depthTexture);const ue=r.convert(x.depthTexture.format),be=r.convert(x.depthTexture.type);let pe;x.depthTexture.format===zn?pe=t.DEPTH_COMPONENT24:x.depthTexture.format===Mi&&(pe=t.DEPTH24_STENCIL8);for(let he=0;he<6;he++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,pe,x.width,x.height,0,ue,be,null)}}else q(x.depthTexture,0);const se=K.__webglTexture,de=ut(x),Z=H?t.TEXTURE_CUBE_MAP_POSITIVE_X+k:t.TEXTURE_2D,Q=x.depthTexture.format===Mi?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(x.depthTexture.format===zn)vt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,Z,se,0,de):t.framebufferTexture2D(t.FRAMEBUFFER,Q,Z,se,0);else if(x.depthTexture.format===Mi)vt(x)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,Z,se,0,de):t.framebufferTexture2D(t.FRAMEBUFFER,Q,Z,se,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(R){const x=i.get(R),k=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){const H=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),H){const K=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,H.removeEventListener("dispose",K)};H.addEventListener("dispose",K),x.__depthDisposeCallback=K}x.__boundDepthTexture=H}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(k)for(let H=0;H<6;H++)Ce(x.__webglFramebuffer[H],R,H);else{const H=R.texture.mipmaps;H&&H.length>0?Ce(x.__webglFramebuffer[0],R,0):Ce(x.__webglFramebuffer,R,0)}else if(k){x.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer[H]),x.__webglDepthbuffer[H]===void 0)x.__webglDepthbuffer[H]=t.createRenderbuffer(),we(x.__webglDepthbuffer[H],R,!1);else{const K=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer[H];t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,K,t.RENDERBUFFER,se)}}else{const H=R.texture.mipmaps;if(H&&H.length>0?n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=t.createRenderbuffer(),we(x.__webglDepthbuffer,R,!1);else{const K=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=x.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,K,t.RENDERBUFFER,se)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Xe(R,x,k){const H=i.get(R);x!==void 0&&re(H.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&et(R)}function Ge(R){const x=R.texture,k=i.get(R),H=i.get(x);R.addEventListener("dispose",M);const K=R.textures,se=R.isWebGLCubeRenderTarget===!0,de=K.length>1;if(de||(H.__webglTexture===void 0&&(H.__webglTexture=t.createTexture()),H.__version=x.version,a.memory.textures++),se){k.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer[Z]=[];for(let Q=0;Q<x.mipmaps.length;Q++)k.__webglFramebuffer[Z][Q]=t.createFramebuffer()}else k.__webglFramebuffer[Z]=t.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){k.__webglFramebuffer=[];for(let Z=0;Z<x.mipmaps.length;Z++)k.__webglFramebuffer[Z]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(de)for(let Z=0,Q=K.length;Z<Q;Z++){const ue=i.get(K[Z]);ue.__webglTexture===void 0&&(ue.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&vt(R)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Z=0;Z<K.length;Z++){const Q=K[Z];k.__webglColorRenderbuffer[Z]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[Z]);const ue=r.convert(Q.format,Q.colorSpace),be=r.convert(Q.type),pe=v(Q.internalFormat,ue,be,Q.normalized,Q.colorSpace,R.isXRRenderTarget===!0),he=ut(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,he,pe,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Z,t.RENDERBUFFER,k.__webglColorRenderbuffer[Z])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),we(k.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(se){n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture),Be(t.TEXTURE_CUBE_MAP,x);for(let Z=0;Z<6;Z++)if(x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)re(k.__webglFramebuffer[Z][Q],R,x,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Q);else re(k.__webglFramebuffer[Z],R,x,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);g(x)&&A(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(de){for(let Z=0,Q=K.length;Z<Q;Z++){const ue=K[Z],be=i.get(ue);let pe=t.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(pe,be.__webglTexture),Be(pe,ue),re(k.__webglFramebuffer,R,ue,t.COLOR_ATTACHMENT0+Z,pe,0),g(ue)&&A(pe)}n.unbindTexture()}else{let Z=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Z=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(Z,H.__webglTexture),Be(Z,x),x.mipmaps&&x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)re(k.__webglFramebuffer[Q],R,x,t.COLOR_ATTACHMENT0,Z,Q);else re(k.__webglFramebuffer,R,x,t.COLOR_ATTACHMENT0,Z,0);g(x)&&A(Z),n.unbindTexture()}R.depthBuffer&&et(R)}function xt(R){const x=R.textures;for(let k=0,H=x.length;k<H;k++){const K=x[k];if(g(K)){const se=w(R),de=i.get(K).__webglTexture;n.bindTexture(se,de),A(se),n.unbindTexture()}}}const St=[],Tt=[];function Pt(R){if(R.samples>0){if(vt(R)===!1){const x=R.textures,k=R.width,H=R.height;let K=t.COLOR_BUFFER_BIT;const se=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,de=i.get(R),Z=x.length>1;if(Z)for(let ue=0;ue<x.length;ue++)n.bindFramebuffer(t.FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,de.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);const Q=R.texture.mipmaps;Q&&Q.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let ue=0;ue<x.length;ue++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(K|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(K|=t.STENCIL_BUFFER_BIT)),Z){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,de.__webglColorRenderbuffer[ue]);const be=i.get(x[ue]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,be,0)}t.blitFramebuffer(0,0,k,H,0,0,k,H,K,t.NEAREST),c===!0&&(St.length=0,Tt.length=0,St.push(t.COLOR_ATTACHMENT0+ue),R.depthBuffer&&R.resolveDepthBuffer===!1&&(St.push(se),Tt.push(se),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Tt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,St))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),Z)for(let ue=0;ue<x.length;ue++){n.bindFramebuffer(t.FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.RENDERBUFFER,de.__webglColorRenderbuffer[ue]);const be=i.get(x[ue]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,de.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.TEXTURE_2D,be,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const x=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[x])}}}function ut(R){return Math.min(s.maxSamples,R.samples)}function vt(R){const x=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function N(R){const x=a.render.frame;h.get(R)!==x&&(h.set(R,x),R.update())}function Ht(R,x){const k=R.colorSpace,H=R.format,K=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||k!==ia&&k!==ei&&(He.getTransfer(k)===Ze?(H!==fn||K!==en)&&Pe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",k)),x}function Ke(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=Y,this.resetTextureUnits=X,this.getTextureUnits=W,this.setTextureUnits=D,this.setTexture2D=q,this.setTexture2DArray=te,this.setTexture3D=ae,this.setTextureCube=ce,this.rebindTextures=Xe,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=xt,this.updateMultisampleRenderTarget=Pt,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=re,this.useMultisampledRTT=vt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function JA(t,e){function n(i,s=ei){let r;const a=He.getTransfer(s);if(i===en)return t.UNSIGNED_BYTE;if(i===Cc)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Pc)return t.UNSIGNED_SHORT_5_5_5_1;if(i===nh)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===ih)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===eh)return t.BYTE;if(i===th)return t.SHORT;if(i===ks)return t.UNSIGNED_SHORT;if(i===Rc)return t.INT;if(i===Rn)return t.UNSIGNED_INT;if(i===En)return t.FLOAT;if(i===Vn)return t.HALF_FLOAT;if(i===sh)return t.ALPHA;if(i===rh)return t.RGB;if(i===fn)return t.RGBA;if(i===zn)return t.DEPTH_COMPONENT;if(i===Mi)return t.DEPTH_STENCIL;if(i===ah)return t.RED;if(i===Ic)return t.RED_INTEGER;if(i===wi)return t.RG;if(i===Lc)return t.RG_INTEGER;if(i===Dc)return t.RGBA_INTEGER;if(i===kr||i===Br||i===Vr||i===zr)if(a===Ze)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===kr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===kr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===zr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Io||i===Lo||i===Do||i===No)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Io)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Lo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Do)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===No)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Fo||i===Uo||i===Oo||i===ko||i===Bo||i===ta||i===Vo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Fo||i===Uo)return a===Ze?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Oo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ko)return r.COMPRESSED_R11_EAC;if(i===Bo)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ta)return r.COMPRESSED_RG11_EAC;if(i===Vo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===zo||i===Ho||i===Go||i===Wo||i===$o||i===Xo||i===Yo||i===qo||i===Ko||i===Zo||i===Jo||i===jo||i===Qo||i===ec)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===zo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ho)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Go)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Wo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$o)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Xo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===qo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ko)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Jo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===jo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Qo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ec)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===tc||i===nc||i===ic)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===tc)return a===Ze?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===nc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ic)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===sc||i===rc||i===na||i===ac)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===sc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===rc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===na)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ac)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Bs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const jA=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,QA=`
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

}`;class eT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new _h(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Cn({vertexShader:jA,fragmentShader:QA,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new pn(new ma(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tT extends ci{constructor(e,n){super();const i=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,p=null;const _=typeof XRWebGLBinding<"u",m=new eT,g={},A=n.getContextAttributes();let w=null,v=null;const E=[],y=[],T=new Le;let M=null;const b=new an;b.viewport=new lt;const P=new an;P.viewport=new lt;const C=[b,P],I=new ly;let X=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let G=E[J];return G===void 0&&(G=new Da,E[J]=G),G.getTargetRaySpace()},this.getControllerGrip=function(J){let G=E[J];return G===void 0&&(G=new Da,E[J]=G),G.getGripSpace()},this.getHand=function(J){let G=E[J];return G===void 0&&(G=new Da,E[J]=G),G.getHandSpace()};function D(J){const G=y.indexOf(J.inputSource);if(G===-1)return;const O=E[G];O!==void 0&&(O.update(J.inputSource,J.frame,l||a),O.dispatchEvent({type:J.type,data:J.inputSource}))}function Y(){s.removeEventListener("select",D),s.removeEventListener("selectstart",D),s.removeEventListener("selectend",D),s.removeEventListener("squeeze",D),s.removeEventListener("squeezestart",D),s.removeEventListener("squeezeend",D),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",V);for(let J=0;J<E.length;J++){const G=y[J];G!==null&&(y[J]=null,E[J].disconnect(G))}X=null,W=null,m.reset();for(const J in g)delete g[J];e.setRenderTarget(w),f=null,d=null,u=null,s=null,v=null,Be.stop(),i.isPresenting=!1,e.setPixelRatio(M),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,i.isPresenting===!0&&Pe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&Pe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,n)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",D),s.addEventListener("selectstart",D),s.addEventListener("selectend",D),s.addEventListener("squeeze",D),s.addEventListener("squeezestart",D),s.addEventListener("squeezeend",D),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",V),A.xrCompatible!==!0&&await n.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(T),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let O=null,ie=null,ne=null;A.depth&&(ne=A.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,O=A.stencil?Mi:zn,ie=A.stencil?Bs:Rn);const re={colorFormat:n.RGBA8,depthFormat:ne,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(re),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Tn(d.textureWidth,d.textureHeight,{format:fn,type:en,depthTexture:new os(d.textureWidth,d.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,O),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const O={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,n,O),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Tn(f.framebufferWidth,f.framebufferHeight,{format:fn,type:en,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Be.setContext(s),Be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function V(J){for(let G=0;G<J.removed.length;G++){const O=J.removed[G],ie=y.indexOf(O);ie>=0&&(y[ie]=null,E[ie].disconnect(O))}for(let G=0;G<J.added.length;G++){const O=J.added[G];let ie=y.indexOf(O);if(ie===-1){for(let re=0;re<E.length;re++)if(re>=y.length){y.push(O),ie=re;break}else if(y[re]===null){y[re]=O,ie=re;break}if(ie===-1)break}const ne=E[ie];ne&&ne.connect(O)}}const q=new U,te=new U;function ae(J,G,O){q.setFromMatrixPosition(G.matrixWorld),te.setFromMatrixPosition(O.matrixWorld);const ie=q.distanceTo(te),ne=G.projectionMatrix.elements,re=O.projectionMatrix.elements,we=ne[14]/(ne[10]-1),Ce=ne[14]/(ne[10]+1),et=(ne[9]+1)/ne[5],Xe=(ne[9]-1)/ne[5],Ge=(ne[8]-1)/ne[0],xt=(re[8]+1)/re[0],St=we*Ge,Tt=we*xt,Pt=ie/(-Ge+xt),ut=Pt*-Ge;if(G.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ut),J.translateZ(Pt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ne[10]===-1)J.projectionMatrix.copy(G.projectionMatrix),J.projectionMatrixInverse.copy(G.projectionMatrixInverse);else{const vt=we+Pt,N=Ce+Pt,Ht=St-ut,Ke=Tt+(ie-ut),R=et*Ce/N*vt,x=Xe*Ce/N*vt;J.projectionMatrix.makePerspective(Ht,Ke,R,x,vt,N),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ce(J,G){G===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(G.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let G=J.near,O=J.far;m.texture!==null&&(m.depthNear>0&&(G=m.depthNear),m.depthFar>0&&(O=m.depthFar)),I.near=P.near=b.near=G,I.far=P.far=b.far=O,(X!==I.near||W!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),X=I.near,W=I.far),I.layers.mask=J.layers.mask|6,b.layers.mask=I.layers.mask&-5,P.layers.mask=I.layers.mask&-3;const ie=J.parent,ne=I.cameras;ce(I,ie);for(let re=0;re<ne.length;re++)ce(ne[re],ie);ne.length===2?ae(I,b,P):I.projectionMatrix.copy(b.projectionMatrix),oe(J,I,ie)};function oe(J,G,O){O===null?J.matrix.copy(G.matrixWorld):(J.matrix.copy(O.matrixWorld),J.matrix.invert(),J.matrix.multiply(G.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(G.projectionMatrix),J.projectionMatrixInverse.copy(G.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=zs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(J){return g[J]};let ke=null;function qe(J,G){if(h=G.getViewerPose(l||a),p=G,h!==null){const O=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let ie=!1;O.length!==I.cameras.length&&(I.cameras.length=0,ie=!0);for(let Ce=0;Ce<O.length;Ce++){const et=O[Ce];let Xe=null;if(f!==null)Xe=f.getViewport(et);else{const xt=u.getViewSubImage(d,et);Xe=xt.viewport,Ce===0&&(e.setRenderTargetTextures(v,xt.colorTexture,xt.depthStencilTexture),e.setRenderTarget(v))}let Ge=C[Ce];Ge===void 0&&(Ge=new an,Ge.layers.enable(Ce),Ge.viewport=new lt,C[Ce]=Ge),Ge.matrix.fromArray(et.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(et.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),Ce===0&&(I.matrix.copy(Ge.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),ie===!0&&I.cameras.push(Ge)}const ne=s.enabledFeatures;if(ne&&ne.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const Ce=u.getDepthInformation(O[0]);Ce&&Ce.isValid&&Ce.texture&&m.init(Ce,s.renderState)}if(ne&&ne.includes("camera-access")&&_){e.state.unbindTexture(),u=i.getBinding();for(let Ce=0;Ce<O.length;Ce++){const et=O[Ce].camera;if(et){let Xe=g[et];Xe||(Xe=new _h,g[et]=Xe);const Ge=u.getCameraImage(et);Xe.sourceTexture=Ge}}}}for(let O=0;O<E.length;O++){const ie=y[O],ne=E[O];ie!==null&&ne!==void 0&&ne.update(ie,G,l||a)}ke&&ke(J,G),G.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:G}),p=null}const Be=new Ah;Be.setAnimationLoop(qe),this.setAnimationLoop=function(J){ke=J},this.dispose=function(){}}}const nT=new ct,Lh=new De;Lh.set(-1,0,0,0,1,0,0,0,1);function iT(t,e){function n(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,Sh(t)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,A,w,v){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,v)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?c(m,g,A,w):g.isSpriteMaterial?l(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,n(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,n(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Yt&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,n(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Yt&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,n(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,n(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,n(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const A=e.get(g),w=A.envMap,v=A.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(nT.makeRotationFromEuler(v)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Lh),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,n(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,n(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,n(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function c(m,g,A,w){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*A,m.scale.value=w*.5,g.map&&(m.map.value=g.map,n(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function l(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,n(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,n(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,n(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,n(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,A){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,n(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,n(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,n(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,n(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,n(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Yt&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,n(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,n(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,n(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,n(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,n(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,n(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,n(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const A=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function sT(t,e,n,i){let s={},r={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,E){const y=E.program;i.uniformBlockBinding(v,y)}function l(v,E){let y=s[v.id];y===void 0&&(m(v),y=h(v),s[v.id]=y,v.addEventListener("dispose",A));const T=E.program;i.updateUBOMapping(v,T);const M=e.render.frame;r[v.id]!==M&&(d(v),r[v.id]=M)}function h(v){const E=u();v.__bindingPointIndex=E;const y=t.createBuffer(),T=v.__size,M=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,T,M),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,E,y),y}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return $e("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const E=s[v.id],y=v.uniforms,T=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,E);for(let M=0,b=y.length;M<b;M++){const P=y[M];if(Array.isArray(P))for(let C=0,I=P.length;C<I;C++)f(P[C],M,C,T);else f(P,M,0,T)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function f(v,E,y,T){if(_(v,E,y,T)===!0){const M=v.__offset,b=v.value;if(Array.isArray(b)){let P=0;for(let C=0;C<b.length;C++){const I=b[C],X=g(I);p(I,v.__data,P),typeof I!="number"&&typeof I!="boolean"&&!I.isMatrix3&&!ArrayBuffer.isView(I)&&(P+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(b,v.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,M,v.__data)}}function p(v,E,y){typeof v=="number"||typeof v=="boolean"?E[0]=v:v.isMatrix3?(E[0]=v.elements[0],E[1]=v.elements[1],E[2]=v.elements[2],E[3]=0,E[4]=v.elements[3],E[5]=v.elements[4],E[6]=v.elements[5],E[7]=0,E[8]=v.elements[6],E[9]=v.elements[7],E[10]=v.elements[8],E[11]=0):ArrayBuffer.isView(v)?E.set(new v.constructor(v.buffer,v.byteOffset,E.length)):v.toArray(E,y)}function _(v,E,y,T){const M=v.value,b=E+"_"+y;if(T[b]===void 0)return typeof M=="number"||typeof M=="boolean"?T[b]=M:ArrayBuffer.isView(M)?T[b]=M.slice():T[b]=M.clone(),!0;{const P=T[b];if(typeof M=="number"||typeof M=="boolean"){if(P!==M)return T[b]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(P.equals(M)===!1)return P.copy(M),!0}}return!1}function m(v){const E=v.uniforms;let y=0;const T=16;for(let b=0,P=E.length;b<P;b++){const C=Array.isArray(E[b])?E[b]:[E[b]];for(let I=0,X=C.length;I<X;I++){const W=C[I],D=Array.isArray(W.value)?W.value:[W.value];for(let Y=0,V=D.length;Y<V;Y++){const q=D[Y],te=g(q),ae=y%T,ce=ae%te.boundary,oe=ae+ce;y+=ce,oe!==0&&T-oe<te.storage&&(y+=T-oe),W.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=y,y+=te.storage}}}const M=y%T;return M>0&&(y+=T-M),v.__size=y,v.__cache={},this}function g(v){const E={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(E.boundary=4,E.storage=4):v.isVector2?(E.boundary=8,E.storage=8):v.isVector3||v.isColor?(E.boundary=16,E.storage=12):v.isVector4?(E.boundary=16,E.storage=16):v.isMatrix3?(E.boundary=48,E.storage=48):v.isMatrix4?(E.boundary=64,E.storage=64):v.isTexture?Pe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(E.boundary=16,E.storage=v.byteLength):Pe("WebGLRenderer: Unsupported uniform value type.",v),E}function A(v){const E=v.target;E.removeEventListener("dispose",A);const y=a.indexOf(E.__bindingPointIndex);a.splice(y,1),t.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function w(){for(const v in s)t.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:w}}const rT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Mn=null;function aT(){return Mn===null&&(Mn=new wM(rT,16,16,wi,Vn),Mn.name="DFG_LUT",Mn.minFilter=Ft,Mn.magFilter=Ft,Mn.wrapS=Un,Mn.wrapT=Un,Mn.generateMipmaps=!1,Mn.needsUpdate=!0),Mn}class oT{constructor(e={}){const{canvas:n=Gv(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=en}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const _=f,m=new Set([Dc,Lc,Ic]),g=new Set([en,Rn,ks,Bs,Cc,Pc]),A=new Uint32Array(4),w=new Int32Array(4),v=new U;let E=null,y=null;const T=[],M=[];let b=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=An,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let C=!1,I=null,X=null,W=null,D=null;this._outputColorSpace=jt;let Y=0,V=0,q=null,te=-1,ae=null;const ce=new lt,oe=new lt;let ke=null;const qe=new ze(0);let Be=0,J=n.width,G=n.height,O=1,ie=null,ne=null;const re=new lt(0,0,J,G),we=new lt(0,0,J,G);let Ce=!1;const et=new Bc;let Xe=!1,Ge=!1;const xt=new ct,St=new U,Tt=new lt,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ut=!1;function vt(){return q===null?O:1}let N=i;function Ht(S,F){return n.getContext(S,F)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${wc}`),n.addEventListener("webglcontextlost",ht,!1),n.addEventListener("webglcontextrestored",it,!1),n.addEventListener("webglcontextcreationerror",mn,!1),N===null){const F="webgl2";if(N=Ht(F,S),N===null)throw Ht(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(S){throw $e("WebGLRenderer: "+S.message),S}let Ke,R,x,k,H,K,se,de,Z,Q,ue,be,pe,he,Re,Ie,Ne,L,le,j,fe,xe,ee;function Ee(){Ke=new ab(N),Ke.init(),fe=new JA(N,Ke),R=new jE(N,Ke,e,fe),x=new KA(N,Ke),R.reversedDepthBuffer&&d&&x.buffers.depth.setReversed(!0),X=N.createFramebuffer(),W=N.createFramebuffer(),D=N.createFramebuffer(),k=new lb(N),H=new FA,K=new ZA(N,Ke,x,H,R,fe,k),se=new rb(P),de=new fy(N),xe=new ZE(N,de),Z=new ob(N,de,k,xe),Q=new ub(N,Z,de,xe,k),L=new db(N,R,K),Re=new QE(H),ue=new NA(P,se,Ke,R,xe,Re),be=new iT(P,H),pe=new OA,he=new GA(Ke),Ne=new KE(P,se,x,Q,p,c),Ie=new qA(P,Q,R),ee=new sT(N,k,R,x),le=new JE(N,Ke,k),j=new cb(N,Ke,k),k.programs=ue.programs,P.capabilities=R,P.extensions=Ke,P.properties=H,P.renderLists=pe,P.shadowMap=Ie,P.state=x,P.info=k}Ee(),_!==en&&(b=new fb(_,n.width,n.height,o,s,r));const ye=new tT(P,N);this.xr=ye,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const S=Ke.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ke.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(S){S!==void 0&&(O=S,this.setSize(J,G,!1))},this.getSize=function(S){return S.set(J,G)},this.setSize=function(S,F,$=!0){if(ye.isPresenting){Pe("WebGLRenderer: Can't change size while VR device is presenting.");return}J=S,G=F,n.width=Math.floor(S*O),n.height=Math.floor(F*O),$===!0&&(n.style.width=S+"px",n.style.height=F+"px"),b!==null&&b.setSize(n.width,n.height),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(J*O,G*O).floor()},this.setDrawingBufferSize=function(S,F,$){J=S,G=F,O=$,n.width=Math.floor(S*$),n.height=Math.floor(F*$),this.setViewport(0,0,S,F)},this.setEffects=function(S){if(_===en){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let F=0;F<S.length;F++)if(S[F].isOutputPass===!0){Pe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(ce)},this.getViewport=function(S){return S.copy(re)},this.setViewport=function(S,F,$,B){S.isVector4?re.set(S.x,S.y,S.z,S.w):re.set(S,F,$,B),x.viewport(ce.copy(re).multiplyScalar(O).round())},this.getScissor=function(S){return S.copy(we)},this.setScissor=function(S,F,$,B){S.isVector4?we.set(S.x,S.y,S.z,S.w):we.set(S,F,$,B),x.scissor(oe.copy(we).multiplyScalar(O).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(S){x.setScissorTest(Ce=S)},this.setOpaqueSort=function(S){ie=S},this.setTransparentSort=function(S){ne=S},this.getClearColor=function(S){return S.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor(...arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,$=!0){let B=0;if(S){let z=!1;if(q!==null){const _e=q.texture.format;z=m.has(_e)}if(z){const _e=q.texture.type,Me=g.has(_e),ge=Ne.getClearColor(),Se=Ne.getClearAlpha(),Ae=ge.r,Fe=ge.g,Oe=ge.b;Me?(A[0]=Ae,A[1]=Fe,A[2]=Oe,A[3]=Se,N.clearBufferuiv(N.COLOR,0,A)):(w[0]=Ae,w[1]=Fe,w[2]=Oe,w[3]=Se,N.clearBufferiv(N.COLOR,0,w))}else B|=N.COLOR_BUFFER_BIT}F&&(B|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(B|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&N.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),I=S},this.dispose=function(){n.removeEventListener("webglcontextlost",ht,!1),n.removeEventListener("webglcontextrestored",it,!1),n.removeEventListener("webglcontextcreationerror",mn,!1),Ne.dispose(),pe.dispose(),he.dispose(),H.dispose(),se.dispose(),Q.dispose(),xe.dispose(),ee.dispose(),ue.dispose(),ye.dispose(),ye.removeEventListener("sessionstart",Kc),ye.removeEventListener("sessionend",Zc),li.stop()};function ht(S){S.preventDefault(),ed("WebGLRenderer: Context Lost."),C=!0}function it(){ed("WebGLRenderer: Context Restored."),C=!1;const S=k.autoReset,F=Ie.enabled,$=Ie.autoUpdate,B=Ie.needsUpdate,z=Ie.type;Ee(),k.autoReset=S,Ie.enabled=F,Ie.autoUpdate=$,Ie.needsUpdate=B,Ie.type=z}function mn(S){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function gn(S){const F=S.target;F.removeEventListener("dispose",gn),Uh(F)}function Uh(S){Oh(S),H.remove(S)}function Oh(S){const F=H.get(S).programs;F!==void 0&&(F.forEach(function($){ue.releaseProgram($)}),S.isShaderMaterial&&ue.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,$,B,z,_e){F===null&&(F=Pt);const Me=z.isMesh&&z.matrixWorld.determinantAffine()<0,ge=Vh(S,F,$,B,z);x.setMaterial(B,Me);let Se=$.index,Ae=1;if(B.wireframe===!0){if(Se=Z.getWireframeAttribute($),Se===void 0)return;Ae=2}const Fe=$.drawRange,Oe=$.attributes.position;let Te=Fe.start*Ae,je=(Fe.start+Fe.count)*Ae;_e!==null&&(Te=Math.max(Te,_e.start*Ae),je=Math.min(je,(_e.start+_e.count)*Ae)),Se!==null?(Te=Math.max(Te,0),je=Math.min(je,Se.count)):Oe!=null&&(Te=Math.max(Te,0),je=Math.min(je,Oe.count));const mt=je-Te;if(mt<0||mt===1/0)return;xe.setup(z,B,ge,$,Se);let ft,tt=le;if(Se!==null&&(ft=de.get(Se),tt=j,tt.setIndex(ft)),z.isMesh)B.wireframe===!0?(x.setLineWidth(B.wireframeLinewidth*vt()),tt.setMode(N.LINES)):tt.setMode(N.TRIANGLES);else if(z.isLine){let Lt=B.linewidth;Lt===void 0&&(Lt=1),x.setLineWidth(Lt*vt()),z.isLineSegments?tt.setMode(N.LINES):z.isLineLoop?tt.setMode(N.LINE_LOOP):tt.setMode(N.LINE_STRIP)}else z.isPoints?tt.setMode(N.POINTS):z.isSprite&&tt.setMode(N.TRIANGLES);if(z.isBatchedMesh)if(Ke.get("WEBGL_multi_draw"))tt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Lt=z._multiDrawStarts,ve=z._multiDrawCounts,qt=z._multiDrawCount,We=Se?de.get(Se).bytesPerElement:1,nn=H.get(B).currentProgram.getUniforms();for(let _n=0;_n<qt;_n++)nn.setValue(N,"_gl_DrawID",_n),tt.render(Lt[_n]/We,ve[_n])}else if(z.isInstancedMesh)tt.renderInstances(Te,mt,z.count);else if($.isInstancedBufferGeometry){const Lt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,ve=Math.min($.instanceCount,Lt);tt.renderInstances(Te,mt,ve)}else tt.render(Te,mt)};function qc(S,F,$){S.transparent===!0&&S.side===Sn&&S.forceSinglePass===!1?(S.side=Yt,S.needsUpdate=!0,Ks(S,F,$),S.side=ri,S.needsUpdate=!0,Ks(S,F,$),S.side=Sn):Ks(S,F,$)}this.compile=function(S,F,$=null){$===null&&($=S),y=he.get($),y.init(F),M.push(y),$.traverseVisible(function(z){z.isLight&&z.layers.test(F.layers)&&(y.pushLight(z),z.castShadow&&y.pushShadow(z))}),S!==$&&S.traverseVisible(function(z){z.isLight&&z.layers.test(F.layers)&&(y.pushLight(z),z.castShadow&&y.pushShadow(z))}),y.setupLights();const B=new Set;return S.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const _e=z.material;if(_e)if(Array.isArray(_e))for(let Me=0;Me<_e.length;Me++){const ge=_e[Me];qc(ge,$,z),B.add(ge)}else qc(_e,$,z),B.add(_e)}),y=M.pop(),B},this.compileAsync=function(S,F,$=null){const B=this.compile(S,F,$);return new Promise(z=>{function _e(){if(B.forEach(function(Me){H.get(Me).currentProgram.isReady()&&B.delete(Me)}),B.size===0){z(S);return}setTimeout(_e,10)}Ke.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let xa=null;function kh(S){xa&&xa(S)}function Kc(){li.stop()}function Zc(){li.start()}const li=new Ah;li.setAnimationLoop(kh),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(S){xa=S,ye.setAnimationLoop(S),S===null?li.stop():li.start()},ye.addEventListener("sessionstart",Kc),ye.addEventListener("sessionend",Zc),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;I!==null&&I.renderStart(S,F);const $=ye.enabled===!0&&ye.isPresenting===!0,B=b!==null&&(q===null||$)&&b.begin(P,q);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ye.enabled===!0&&ye.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(ye.cameraAutoUpdate===!0&&ye.updateCamera(F),F=ye.getCamera()),S.isScene===!0&&S.onBeforeRender(P,S,F,q),y=he.get(S,M.length),y.init(F),y.state.textureUnits=K.getTextureUnits(),M.push(y),xt.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),et.setFromProjectionMatrix(xt,bn,F.reversedDepth),Ge=this.localClippingEnabled,Xe=Re.init(this.clippingPlanes,Ge),E=pe.get(S,T.length),E.init(),T.push(E),ye.enabled===!0&&ye.isPresenting===!0){const Me=P.xr.getDepthSensingMesh();Me!==null&&va(Me,F,-1/0,P.sortObjects)}va(S,F,0,P.sortObjects),E.finish(),P.sortObjects===!0&&E.sort(ie,ne,F.reversedDepth),ut=ye.enabled===!1||ye.isPresenting===!1||ye.hasDepthSensing()===!1,ut&&Ne.addToRenderList(E,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Xe===!0&&Re.beginShadows();const z=y.state.shadowsArray;if(Ie.render(z,S,F),Xe===!0&&Re.endShadows(),(B&&b.hasRenderPass())===!1){const Me=E.opaque,ge=E.transmissive;if(y.setupLights(),F.isArrayCamera){const Se=F.cameras;if(ge.length>0)for(let Ae=0,Fe=Se.length;Ae<Fe;Ae++){const Oe=Se[Ae];jc(Me,ge,S,Oe)}ut&&Ne.render(S);for(let Ae=0,Fe=Se.length;Ae<Fe;Ae++){const Oe=Se[Ae];Jc(E,S,Oe,Oe.viewport)}}else ge.length>0&&jc(Me,ge,S,F),ut&&Ne.render(S),Jc(E,S,F)}q!==null&&V===0&&(K.updateMultisampleRenderTarget(q),K.updateRenderTargetMipmap(q)),B&&b.end(P),S.isScene===!0&&S.onAfterRender(P,S,F),xe.resetDefaultState(),te=-1,ae=null,M.pop(),M.length>0?(y=M[M.length-1],K.setTextureUnits(y.state.textureUnits),Xe===!0&&Re.setGlobalState(P.clippingPlanes,y.state.camera)):y=null,T.pop(),T.length>0?E=T[T.length-1]:E=null,I!==null&&I.renderEnd()};function va(S,F,$,B){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)$=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLightProbeGrid)y.pushLightProbeGrid(S);else if(S.isLight)y.pushLight(S),S.castShadow&&y.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||et.intersectsSprite(S)){B&&Tt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(xt);const Me=Q.update(S),ge=S.material;ge.visible&&E.push(S,Me,ge,$,Tt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||et.intersectsObject(S))){const Me=Q.update(S),ge=S.material;if(B&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Tt.copy(S.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Tt.copy(Me.boundingSphere.center)),Tt.applyMatrix4(S.matrixWorld).applyMatrix4(xt)),Array.isArray(ge)){const Se=Me.groups;for(let Ae=0,Fe=Se.length;Ae<Fe;Ae++){const Oe=Se[Ae],Te=ge[Oe.materialIndex];Te&&Te.visible&&E.push(S,Me,Te,$,Tt.z,Oe)}}else ge.visible&&E.push(S,Me,ge,$,Tt.z,null)}}const _e=S.children;for(let Me=0,ge=_e.length;Me<ge;Me++)va(_e[Me],F,$,B)}function Jc(S,F,$,B){const{opaque:z,transmissive:_e,transparent:Me}=S;y.setupLightsView($),Xe===!0&&Re.setGlobalState(P.clippingPlanes,$),B&&x.viewport(ce.copy(B)),z.length>0&&qs(z,F,$),_e.length>0&&qs(_e,F,$),Me.length>0&&qs(Me,F,$),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function jc(S,F,$,B){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[B.id]===void 0){const Te=Ke.has("EXT_color_buffer_half_float")||Ke.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[B.id]=new Tn(1,1,{generateMipmaps:!0,type:Te?Vn:en,minFilter:vi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:He.workingColorSpace})}const _e=y.state.transmissionRenderTarget[B.id],Me=B.viewport||ce;_e.setSize(Me.z*P.transmissionResolutionScale,Me.w*P.transmissionResolutionScale);const ge=P.getRenderTarget(),Se=P.getActiveCubeFace(),Ae=P.getActiveMipmapLevel();P.setRenderTarget(_e),P.getClearColor(qe),Be=P.getClearAlpha(),Be<1&&P.setClearColor(16777215,.5),P.clear(),ut&&Ne.render($);const Fe=P.toneMapping;P.toneMapping=An;const Oe=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),y.setupLightsView(B),Xe===!0&&Re.setGlobalState(P.clippingPlanes,B),qs(S,$,B),K.updateMultisampleRenderTarget(_e),K.updateRenderTargetMipmap(_e),Ke.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let je=0,mt=F.length;je<mt;je++){const ft=F[je],{object:tt,geometry:Lt,material:ve,group:qt}=ft;if(ve.side===Sn&&tt.layers.test(B.layers)){const We=ve.side;ve.side=Yt,ve.needsUpdate=!0,Qc(tt,$,B,Lt,ve,qt),ve.side=We,ve.needsUpdate=!0,Te=!0}}Te===!0&&(K.updateMultisampleRenderTarget(_e),K.updateRenderTargetMipmap(_e))}P.setRenderTarget(ge,Se,Ae),P.setClearColor(qe,Be),Oe!==void 0&&(B.viewport=Oe),P.toneMapping=Fe}function qs(S,F,$){const B=F.isScene===!0?F.overrideMaterial:null;for(let z=0,_e=S.length;z<_e;z++){const Me=S[z],{object:ge,geometry:Se,group:Ae}=Me;let Fe=Me.material;Fe.allowOverride===!0&&B!==null&&(Fe=B),ge.layers.test($.layers)&&Qc(ge,F,$,Se,Fe,Ae)}}function Qc(S,F,$,B,z,_e){S.onBeforeRender(P,F,$,B,z,_e),S.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),z.onBeforeRender(P,F,$,B,S,_e),z.transparent===!0&&z.side===Sn&&z.forceSinglePass===!1?(z.side=Yt,z.needsUpdate=!0,P.renderBufferDirect($,F,B,z,S,_e),z.side=ri,z.needsUpdate=!0,P.renderBufferDirect($,F,B,z,S,_e),z.side=Sn):P.renderBufferDirect($,F,B,z,S,_e),S.onAfterRender(P,F,$,B,z,_e)}function Ks(S,F,$){F.isScene!==!0&&(F=Pt);const B=H.get(S),z=y.state.lights,_e=y.state.shadowsArray,Me=z.state.version,ge=ue.getParameters(S,z.state,_e,F,$,y.state.lightProbeGridArray),Se=ue.getProgramCacheKey(ge);let Ae=B.programs;B.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?F.environment:null,B.fog=F.fog;const Fe=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;B.envMap=se.get(S.envMap||B.environment,Fe),B.envMapRotation=B.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Ae===void 0&&(S.addEventListener("dispose",gn),Ae=new Map,B.programs=Ae);let Oe=Ae.get(Se);if(Oe!==void 0){if(B.currentProgram===Oe&&B.lightsStateVersion===Me)return tl(S,ge),Oe}else ge.uniforms=ue.getUniforms(S),I!==null&&S.isNodeMaterial&&I.build(S,$,ge),S.onBeforeCompile(ge,P),Oe=ue.acquireProgram(ge,Se),Ae.set(Se,Oe),B.uniforms=ge.uniforms;const Te=B.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Te.clippingPlanes=Re.uniform),tl(S,ge),B.needsLights=Hh(S),B.lightsStateVersion=Me,B.needsLights&&(Te.ambientLightColor.value=z.state.ambient,Te.lightProbe.value=z.state.probe,Te.directionalLights.value=z.state.directional,Te.directionalLightShadows.value=z.state.directionalShadow,Te.spotLights.value=z.state.spot,Te.spotLightShadows.value=z.state.spotShadow,Te.rectAreaLights.value=z.state.rectArea,Te.ltc_1.value=z.state.rectAreaLTC1,Te.ltc_2.value=z.state.rectAreaLTC2,Te.pointLights.value=z.state.point,Te.pointLightShadows.value=z.state.pointShadow,Te.hemisphereLights.value=z.state.hemi,Te.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Te.spotLightMatrix.value=z.state.spotLightMatrix,Te.spotLightMap.value=z.state.spotLightMap,Te.pointShadowMatrix.value=z.state.pointShadowMatrix),B.lightProbeGrid=y.state.lightProbeGridArray.length>0,B.currentProgram=Oe,B.uniformsList=null,Oe}function el(S){if(S.uniformsList===null){const F=S.currentProgram.getUniforms();S.uniformsList=Gr.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function tl(S,F){const $=H.get(S);$.outputColorSpace=F.outputColorSpace,$.batching=F.batching,$.batchingColor=F.batchingColor,$.instancing=F.instancing,$.instancingColor=F.instancingColor,$.instancingMorph=F.instancingMorph,$.skinning=F.skinning,$.morphTargets=F.morphTargets,$.morphNormals=F.morphNormals,$.morphColors=F.morphColors,$.morphTargetsCount=F.morphTargetsCount,$.numClippingPlanes=F.numClippingPlanes,$.numIntersection=F.numClipIntersection,$.vertexAlphas=F.vertexAlphas,$.vertexTangents=F.vertexTangents,$.toneMapping=F.toneMapping}function Bh(S,F){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;v.setFromMatrixPosition(F.matrixWorld);for(let $=0,B=S.length;$<B;$++){const z=S[$];if(z.texture!==null&&z.boundingBox.containsPoint(v))return z}return null}function Vh(S,F,$,B,z){F.isScene!==!0&&(F=Pt),K.resetTextureUnits();const _e=F.fog,Me=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?F.environment:null,ge=q===null?P.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:He.workingColorSpace,Se=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,Ae=se.get(B.envMap||Me,Se),Fe=B.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Oe=!!$.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),Te=!!$.morphAttributes.position,je=!!$.morphAttributes.normal,mt=!!$.morphAttributes.color;let ft=An;B.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(ft=P.toneMapping);const tt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Lt=tt!==void 0?tt.length:0,ve=H.get(B),qt=y.state.lights;if(Xe===!0&&(Ge===!0||S!==ae)){const st=S===ae&&B.id===te;Re.setState(B,S,st)}let We=!1;B.version===ve.__version?(ve.needsLights&&ve.lightsStateVersion!==qt.state.version||ve.outputColorSpace!==ge||z.isBatchedMesh&&ve.batching===!1||!z.isBatchedMesh&&ve.batching===!0||z.isBatchedMesh&&ve.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&ve.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&ve.instancing===!1||!z.isInstancedMesh&&ve.instancing===!0||z.isSkinnedMesh&&ve.skinning===!1||!z.isSkinnedMesh&&ve.skinning===!0||z.isInstancedMesh&&ve.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&ve.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&ve.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&ve.instancingMorph===!1&&z.morphTexture!==null||ve.envMap!==Ae||B.fog===!0&&ve.fog!==_e||ve.numClippingPlanes!==void 0&&(ve.numClippingPlanes!==Re.numPlanes||ve.numIntersection!==Re.numIntersection)||ve.vertexAlphas!==Fe||ve.vertexTangents!==Oe||ve.morphTargets!==Te||ve.morphNormals!==je||ve.morphColors!==mt||ve.toneMapping!==ft||ve.morphTargetsCount!==Lt||!!ve.lightProbeGrid!=y.state.lightProbeGridArray.length>0)&&(We=!0):(We=!0,ve.__version=B.version);let nn=ve.currentProgram;We===!0&&(nn=Ks(B,F,z),I&&B.isNodeMaterial&&I.onUpdateProgram(B,nn,ve));let _n=!1,Hn=!1,Li=!1;const nt=nn.getUniforms(),gt=ve.uniforms;if(x.useProgram(nn.program)&&(_n=!0,Hn=!0,Li=!0),B.id!==te&&(te=B.id,Hn=!0),ve.needsLights){const st=Bh(y.state.lightProbeGridArray,z);ve.lightProbeGrid!==st&&(ve.lightProbeGrid=st,Hn=!0)}if(_n||ae!==S){x.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),nt.setValue(N,"projectionMatrix",S.projectionMatrix),nt.setValue(N,"viewMatrix",S.matrixWorldInverse);const Wn=nt.map.cameraPosition;Wn!==void 0&&Wn.setValue(N,St.setFromMatrixPosition(S.matrixWorld)),R.logarithmicDepthBuffer&&nt.setValue(N,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&nt.setValue(N,"isOrthographic",S.isOrthographicCamera===!0),ae!==S&&(ae=S,Hn=!0,Li=!0)}if(ve.needsLights&&(qt.state.directionalShadowMap.length>0&&nt.setValue(N,"directionalShadowMap",qt.state.directionalShadowMap,K),qt.state.spotShadowMap.length>0&&nt.setValue(N,"spotShadowMap",qt.state.spotShadowMap,K),qt.state.pointShadowMap.length>0&&nt.setValue(N,"pointShadowMap",qt.state.pointShadowMap,K)),z.isSkinnedMesh){nt.setOptional(N,z,"bindMatrix"),nt.setOptional(N,z,"bindMatrixInverse");const st=z.skeleton;st&&(st.boneTexture===null&&st.computeBoneTexture(),nt.setValue(N,"boneTexture",st.boneTexture,K))}z.isBatchedMesh&&(nt.setOptional(N,z,"batchingTexture"),nt.setValue(N,"batchingTexture",z._matricesTexture,K),nt.setOptional(N,z,"batchingIdTexture"),nt.setValue(N,"batchingIdTexture",z._indirectTexture,K),nt.setOptional(N,z,"batchingColorTexture"),z._colorsTexture!==null&&nt.setValue(N,"batchingColorTexture",z._colorsTexture,K));const Gn=$.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&L.update(z,$,nn),(Hn||ve.receiveShadow!==z.receiveShadow)&&(ve.receiveShadow=z.receiveShadow,nt.setValue(N,"receiveShadow",z.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&F.environment!==null&&(gt.envMapIntensity.value=F.environmentIntensity),gt.dfgLUT!==void 0&&(gt.dfgLUT.value=aT()),Hn){if(nt.setValue(N,"toneMappingExposure",P.toneMappingExposure),ve.needsLights&&zh(gt,Li),_e&&B.fog===!0&&be.refreshFogUniforms(gt,_e),be.refreshMaterialUniforms(gt,B,O,G,y.state.transmissionRenderTarget[S.id]),ve.needsLights&&ve.lightProbeGrid){const st=ve.lightProbeGrid;gt.probesSH.value=st.texture,gt.probesMin.value.copy(st.boundingBox.min),gt.probesMax.value.copy(st.boundingBox.max),gt.probesResolution.value.copy(st.resolution)}Gr.upload(N,el(ve),gt,K)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(Gr.upload(N,el(ve),gt,K),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&nt.setValue(N,"center",z.center),nt.setValue(N,"modelViewMatrix",z.modelViewMatrix),nt.setValue(N,"normalMatrix",z.normalMatrix),nt.setValue(N,"modelMatrix",z.matrixWorld),B.uniformsGroups!==void 0){const st=B.uniformsGroups;for(let Wn=0,Di=st.length;Wn<Di;Wn++){const nl=st[Wn];ee.update(nl,nn),ee.bind(nl,nn)}}return nn}function zh(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function Hh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(S,F,$){const B=H.get(S);B.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),H.get(S.texture).__webglTexture=F,H.get(S.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:$,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){const $=H.get(S);$.__webglFramebuffer=F,$.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(S,F=0,$=0){q=S,Y=F,V=$;let B=null,z=!1,_e=!1;if(S){const ge=H.get(S);if(ge.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(N.FRAMEBUFFER,ge.__webglFramebuffer),ce.copy(S.viewport),oe.copy(S.scissor),ke=S.scissorTest,x.viewport(ce),x.scissor(oe),x.setScissorTest(ke),te=-1;return}else if(ge.__webglFramebuffer===void 0)K.setupRenderTarget(S);else if(ge.__hasExternalTextures)K.rebindTextures(S,H.get(S.texture).__webglTexture,H.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Fe=S.depthTexture;if(ge.__boundDepthTexture!==Fe){if(Fe!==null&&H.has(Fe)&&(S.width!==Fe.image.width||S.height!==Fe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(S)}}const Se=S.texture;(Se.isData3DTexture||Se.isDataArrayTexture||Se.isCompressedArrayTexture)&&(_e=!0);const Ae=H.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ae[F])?B=Ae[F][$]:B=Ae[F],z=!0):S.samples>0&&K.useMultisampledRTT(S)===!1?B=H.get(S).__webglMultisampledFramebuffer:Array.isArray(Ae)?B=Ae[$]:B=Ae,ce.copy(S.viewport),oe.copy(S.scissor),ke=S.scissorTest}else ce.copy(re).multiplyScalar(O).floor(),oe.copy(we).multiplyScalar(O).floor(),ke=Ce;if($!==0&&(B=X),x.bindFramebuffer(N.FRAMEBUFFER,B)&&x.drawBuffers(S,B),x.viewport(ce),x.scissor(oe),x.setScissorTest(ke),z){const ge=H.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+F,ge.__webglTexture,$)}else if(_e){const ge=F;for(let Se=0;Se<S.textures.length;Se++){const Ae=H.get(S.textures[Se]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Se,Ae.__webglTexture,$,ge)}}else if(S!==null&&$!==0){const ge=H.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ge.__webglTexture,$)}te=-1},this.readRenderTargetPixels=function(S,F,$,B,z,_e,Me,ge=0){if(!(S&&S.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=H.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Me!==void 0&&(Se=Se[Me]),Se){x.bindFramebuffer(N.FRAMEBUFFER,Se);try{const Ae=S.textures[ge],Fe=Ae.format,Oe=Ae.type;if(S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ge),!R.textureFormatReadable(Fe)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!R.textureTypeReadable(Oe)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-B&&$>=0&&$<=S.height-z&&N.readPixels(F,$,B,z,fe.convert(Fe),fe.convert(Oe),_e)}finally{const Ae=q!==null?H.get(q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(S,F,$,B,z,_e,Me,ge=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=H.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Me!==void 0&&(Se=Se[Me]),Se)if(F>=0&&F<=S.width-B&&$>=0&&$<=S.height-z){x.bindFramebuffer(N.FRAMEBUFFER,Se);const Ae=S.textures[ge],Fe=Ae.format,Oe=Ae.type;if(S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ge),!R.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!R.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Te=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Te),N.bufferData(N.PIXEL_PACK_BUFFER,_e.byteLength,N.STREAM_READ),N.readPixels(F,$,B,z,fe.convert(Fe),fe.convert(Oe),0);const je=q!==null?H.get(q).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,je);const mt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Wv(N,mt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Te),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,_e),N.deleteBuffer(Te),N.deleteSync(mt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,$=0){const B=Math.pow(2,-$),z=Math.floor(S.image.width*B),_e=Math.floor(S.image.height*B),Me=F!==null?F.x:0,ge=F!==null?F.y:0;K.setTexture2D(S,0),N.copyTexSubImage2D(N.TEXTURE_2D,$,0,0,Me,ge,z,_e),x.unbindTexture()},this.copyTextureToTexture=function(S,F,$=null,B=null,z=0,_e=0){let Me,ge,Se,Ae,Fe,Oe,Te,je,mt;const ft=S.isCompressedTexture?S.mipmaps[_e]:S.image;if($!==null)Me=$.max.x-$.min.x,ge=$.max.y-$.min.y,Se=$.isBox3?$.max.z-$.min.z:1,Ae=$.min.x,Fe=$.min.y,Oe=$.isBox3?$.min.z:0;else{const gt=Math.pow(2,-z);Me=Math.floor(ft.width*gt),ge=Math.floor(ft.height*gt),S.isDataArrayTexture?Se=ft.depth:S.isData3DTexture?Se=Math.floor(ft.depth*gt):Se=1,Ae=0,Fe=0,Oe=0}B!==null?(Te=B.x,je=B.y,mt=B.z):(Te=0,je=0,mt=0);const tt=fe.convert(F.format),Lt=fe.convert(F.type);let ve;F.isData3DTexture?(K.setTexture3D(F,0),ve=N.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(K.setTexture2DArray(F,0),ve=N.TEXTURE_2D_ARRAY):(K.setTexture2D(F,0),ve=N.TEXTURE_2D),x.activeTexture(N.TEXTURE0),x.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,F.flipY),x.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),x.pixelStorei(N.UNPACK_ALIGNMENT,F.unpackAlignment);const qt=x.getParameter(N.UNPACK_ROW_LENGTH),We=x.getParameter(N.UNPACK_IMAGE_HEIGHT),nn=x.getParameter(N.UNPACK_SKIP_PIXELS),_n=x.getParameter(N.UNPACK_SKIP_ROWS),Hn=x.getParameter(N.UNPACK_SKIP_IMAGES);x.pixelStorei(N.UNPACK_ROW_LENGTH,ft.width),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ft.height),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Ae),x.pixelStorei(N.UNPACK_SKIP_ROWS,Fe),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Oe);const Li=S.isDataArrayTexture||S.isData3DTexture,nt=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){const gt=H.get(S),Gn=H.get(F),st=H.get(gt.__renderTarget),Wn=H.get(Gn.__renderTarget);x.bindFramebuffer(N.READ_FRAMEBUFFER,st.__webglFramebuffer),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,Wn.__webglFramebuffer);for(let Di=0;Di<Se;Di++)Li&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,H.get(S).__webglTexture,z,Oe+Di),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,H.get(F).__webglTexture,_e,mt+Di)),N.blitFramebuffer(Ae,Fe,Me,ge,Te,je,Me,ge,N.DEPTH_BUFFER_BIT,N.NEAREST);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(z!==0||S.isRenderTargetTexture||H.has(S)){const gt=H.get(S),Gn=H.get(F);x.bindFramebuffer(N.READ_FRAMEBUFFER,W),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,D);for(let st=0;st<Se;st++)Li?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,gt.__webglTexture,z,Oe+st):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,gt.__webglTexture,z),nt?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Gn.__webglTexture,_e,mt+st):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Gn.__webglTexture,_e),z!==0?N.blitFramebuffer(Ae,Fe,Me,ge,Te,je,Me,ge,N.COLOR_BUFFER_BIT,N.NEAREST):nt?N.copyTexSubImage3D(ve,_e,Te,je,mt+st,Ae,Fe,Me,ge):N.copyTexSubImage2D(ve,_e,Te,je,Ae,Fe,Me,ge);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else nt?S.isDataTexture||S.isData3DTexture?N.texSubImage3D(ve,_e,Te,je,mt,Me,ge,Se,tt,Lt,ft.data):F.isCompressedArrayTexture?N.compressedTexSubImage3D(ve,_e,Te,je,mt,Me,ge,Se,tt,ft.data):N.texSubImage3D(ve,_e,Te,je,mt,Me,ge,Se,tt,Lt,ft):S.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,_e,Te,je,Me,ge,tt,Lt,ft.data):S.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,_e,Te,je,ft.width,ft.height,tt,ft.data):N.texSubImage2D(N.TEXTURE_2D,_e,Te,je,Me,ge,tt,Lt,ft);x.pixelStorei(N.UNPACK_ROW_LENGTH,qt),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,We),x.pixelStorei(N.UNPACK_SKIP_PIXELS,nn),x.pixelStorei(N.UNPACK_SKIP_ROWS,_n),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Hn),_e===0&&F.generateMipmaps&&N.generateMipmap(ve),x.unbindTexture()},this.initRenderTarget=function(S){H.get(S).__webglFramebuffer===void 0&&K.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?K.setTextureCube(S,0):S.isData3DTexture?K.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?K.setTexture2DArray(S,0):K.setTexture2D(S,0),x.unbindTexture()},this.resetState=function(){Y=0,V=0,q=null,x.reset(),xe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=He._getDrawingBufferColorSpace(e),n.unpackColorSpace=He._getUnpackColorSpace()}}const su={type:"change"},Hc={type:"start"},Dh={type:"end"},Dr=new fa,ru=new Qn,cT=Math.cos(70*ch.DEG2RAD),Et=new U,Gt=2*Math.PI,Qe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},so=1e-6;class lT extends uy{constructor(e,n=null){super(e,n),this.state=Qe.NONE,this.target=new U,this.cursor=new U,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ts.ROTATE,MIDDLE:ts.DOLLY,RIGHT:ts.PAN},this.touches={ONE:ji.ROTATE,TWO:ji.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new U,this._lastQuaternion=new ai,this._lastTargetPosition=new U,this._quat=new ai().setFromUnitVectors(e.up,new U(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ld,this._sphericalDelta=new Ld,this._scale=1,this._panOffset=new U,this._rotateStart=new Le,this._rotateEnd=new Le,this._rotateDelta=new Le,this._panStart=new Le,this._panEnd=new Le,this._panDelta=new Le,this._dollyStart=new Le,this._dollyEnd=new Le,this._dollyDelta=new Le,this._dollyDirection=new U,this._mouse=new Le,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=uT.bind(this),this._onPointerDown=dT.bind(this),this._onPointerUp=hT.bind(this),this._onContextMenu=vT.bind(this),this._onMouseWheel=mT.bind(this),this._onKeyDown=gT.bind(this),this._onTouchStart=_T.bind(this),this._onTouchMove=xT.bind(this),this._onMouseDown=fT.bind(this),this._onMouseMove=pT.bind(this),this._interceptControlDown=MT.bind(this),this._interceptControlUp=yT.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(su),this.update(),this.state=Qe.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;Et.copy(n).sub(this.target),Et.applyQuaternion(this._quat),this._spherical.setFromVector3(Et),this.autoRotate&&this.state===Qe.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Gt:i>Math.PI&&(i-=Gt),s<-Math.PI?s+=Gt:s>Math.PI&&(s-=Gt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Et.setFromSpherical(this._spherical),Et.applyQuaternion(this._quatInverse),n.copy(this.target).add(Et),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Et.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new U(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new U(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=Et.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Dr.origin.copy(this.object.position),Dr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Dr.direction))<cT?this.object.lookAt(this.target):(ru.setFromNormalAndCoplanarPoint(this.object.up,this.target),Dr.intersectPlane(ru,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>so||8*(1-this._lastQuaternion.dot(this.object.quaternion))>so||this._lastTargetPosition.distanceToSquared(this.target)>so?(this.dispatchEvent(su),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Gt/60*this.autoRotateSpeed*e:Gt/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Et.setFromMatrixColumn(n,0),Et.multiplyScalar(-e),this._panOffset.add(Et)}_panUp(e,n){this.screenSpacePanning===!0?Et.setFromMatrixColumn(n,1):(Et.setFromMatrixColumn(n,0),Et.crossVectors(this.object.up,Et)),Et.multiplyScalar(e),this._panOffset.add(Et)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Et.copy(s).sub(this.target);let r=Et.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=n-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/n.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/n.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Le,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function dT(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function uT(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function hT(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Dh),this.state=Qe.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function fT(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ts.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=Qe.DOLLY;break;case ts.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Qe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Qe.ROTATE}break;case ts.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Qe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Qe.PAN}break;default:this.state=Qe.NONE}this.state!==Qe.NONE&&this.dispatchEvent(Hc)}function pT(t){switch(this.state){case Qe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case Qe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case Qe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function mT(t){this.enabled===!1||this.enableZoom===!1||this.state!==Qe.NONE||(t.preventDefault(),this.dispatchEvent(Hc),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(Dh))}function gT(t){this.enabled!==!1&&this._handleKeyDown(t)}function _T(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case ji.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=Qe.TOUCH_ROTATE;break;case ji.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=Qe.TOUCH_PAN;break;default:this.state=Qe.NONE}break;case 2:switch(this.touches.TWO){case ji.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=Qe.TOUCH_DOLLY_PAN;break;case ji.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=Qe.TOUCH_DOLLY_ROTATE;break;default:this.state=Qe.NONE}break;default:this.state=Qe.NONE}this.state!==Qe.NONE&&this.dispatchEvent(Hc)}function xT(t){switch(this._trackPointer(t),this.state){case Qe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case Qe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case Qe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case Qe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=Qe.NONE}}function vT(t){this.enabled!==!1&&t.preventDefault()}function MT(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function yT(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ST=Object.freeze({invalid:12986408,unsupported:14067456}),ET={boundary:1842204,cut:0,hingeMountain:2894892,hingeValley:4473924,hingeUnassigned:3158064,flatSeam:6052956,link:2368548,sectorRay:1118481};function bT(t,e){const n=new Is;n.name="engine-lab-frame";const i=new Map;for(const s of t.faces){wT(s.id,s.vertices);const r=ao(s.sourceEntities??[],e),a=new zt;a.setAttribute("position",new Vt(s.vertices.flat(),3));const o=AT(s.vertices);a.setIndex(o),a.computeVertexNormals();const c=new ny({color:oo(r)??14211288,metalness:0,roughness:.82,opacity:.72,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,side:Sn}),l=new pn(a,c);l.renderOrder=0,ro(l,s.id,"face",s.sourceEntities??[],r,i,n),s.sourceOperationId!==void 0&&(l.userData.sourceOperationId=s.sourceOperationId)}for(const s of t.segments){Wr(s.id,s.start),Wr(s.id,s.end);const r=ao(s.sourceEntities??[],e),a=new zt().setFromPoints([new U(...s.start),new U(...s.end)]),o=TT(s.role,oo(r)??ET[s.role]),c=new cc(a,o);c.renderOrder=1,o instanceof Hr&&c.computeLineDistances(),ro(c,s.id,s.role,s.sourceEntities??[],r,i,n)}for(const s of t.points){Wr(s.id,s.position);const r=ao(s.sourceEntities??[],e),a=new zt;a.setAttribute("position",new Vt(s.position,3));const o=new mh({color:oo(r)??(s.role==="junction"?0:s.role==="anchor"?2236962:3355443),size:.055,sizeAttenuation:!0}),c=new yd(a,o);c.renderOrder=2,ro(c,s.id,s.role,s.sourceEntities??[],r,i,n)}return{group:n,objectByPrimitiveId:i,dispose(){for(const s of i.values())if(s instanceof pn||s instanceof cc||s instanceof yd){s.geometry.dispose();const r=Array.isArray(s.material)?s.material:[s.material];for(const a of r)a.dispose()}n.clear(),i.clear()}}}function AT(t){const e=t.reduce((s,r,a)=>{const o=t[(a+1)%t.length];return[s[0]+(r[1]-o[1])*(r[2]+o[2]),s[1]+(r[2]-o[2])*(r[0]+o[0]),s[2]+(r[0]-o[0])*(r[1]+o[1])]},[0,0,0]),n=Math.abs(e[0])>=Math.abs(e[1])&&Math.abs(e[0])>=Math.abs(e[2])?0:Math.abs(e[1])>=Math.abs(e[2])?1:2,i=t.map(s=>n===0?new Le(s[1],s[2]):n===1?new Le(s[0],s[2]):new Le(s[0],s[1]));return Vc.triangulateShape(i,[]).flat()}function ro(t,e,n,i,s,r,a){if(r.has(e))throw new RangeError(`Duplicate lab primitive ID: ${e}.`);t.name=e,t.userData.primitiveId=e,t.userData.role=n,t.userData.sourceEntities=i.map(o=>({...o})),s!==void 0&&(t.userData.diagnosticState=s),r.set(e,t),a.add(t)}function TT(t,e){return t==="hingeMountain"?new Hr({color:e,dashSize:.08,gapSize:.025}):t==="hingeValley"?new Hr({color:e,dashSize:.025,gapSize:.04}):t==="hingeUnassigned"?new Hr({color:e,dashSize:.04,gapSize:.04}):new pa({color:e})}function ao(t,e){if(e===void 0||e.disposition==="accepted")return;const n=e.diagnostics.flatMap(i=>i.locations.some(r=>r.kind==="entity"&&t.some(a=>au(a)===au(r.entity)))?[i.category==="unsupported"?"unsupported":"invalid"]:[]);return n.includes("invalid")?"invalid":n.includes("unsupported")?"unsupported":void 0}function oo(t){return t===void 0?void 0:ST[t]}function au(t){return`${t.kind}\0${t.id}`}function wT(t,e){if(e.length<3)throw new RangeError(`Face ${t} requires at least three vertices.`);for(const n of e)Wr(t,n)}function Wr(t,e){if(e.length!==3||!e.every(Number.isFinite))throw new RangeError(`Primitive ${t} requires finite 3D coordinates.`)}const ou=Object.freeze({gridCenter:13948116,grid:15658734});function RT(t){const e=new oT({antialias:!0,alpha:!1});e.setClearColor(16777215,1),e.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.outputColorSpace=jt,t.append(e.domElement);const n=new yM;n.fog=new kc(16777215,.018);const i=new an(42,1,.01,1e3);i.position.set(6,5,7);const s=new lT(i,e.domElement);s.enableDamping=!0,s.dampingFactor=.08,s.screenSpacePanning=!0,n.add(new oy(16777215,1.2));const r=new Id(16777215,2.5);r.position.set(4,7,5),n.add(r);const a=new Id(16777215,1.1);a.position.set(-5,2,-4),n.add(a);const o=new dy(24,24,ou.gridCenter,ou.grid);o.position.y=-.002,n.add(o);let c,l=!1;const h=()=>{const d=Math.max(t.clientWidth,1),f=Math.max(t.clientHeight,1);e.setSize(d,f,!1),i.aspect=d/f,i.updateProjectionMatrix()},u=new ResizeObserver(h);return u.observe(t),h(),e.setAnimationLoop(()=>{s.update(),e.render(n,i)}),{show(d,f){c?.dispose(),c&&n.remove(c.group),c=bT(d,f),n.add(c.group)},focus(){if(!c)return;const d=new hs().setFromObject(c.group);if(d.isEmpty()){s.target.set(0,0,0),i.position.set(6,5,7),s.update();return}const f=d.getCenter(new U),p=d.getSize(new U),m=Math.max(p.length()*.5,.5)/Math.sin(ch.degToRad(i.fov*.5)),g=new U(1.15,.85,1.35).normalize();s.target.copy(f),i.position.copy(f).addScaledVector(g,m*1.15),i.near=Math.max(m/1e3,.001),i.far=Math.max(m*100,100),i.updateProjectionMatrix(),s.update()},resize:h,dispose(){l||(l=!0,u.disconnect(),e.setAnimationLoop(null),s.dispose(),c?.dispose(),e.dispose(),e.domElement.remove())}}}const cu={width:210,height:297},CT={width:297,height:210},Nh=10;function PT(t,e=Nh){const n=t.faces.length>0?t.faces.flatMap(a=>a.vertices):t.segments.flatMap(a=>[a.start,a.end]);if(n.length===0)throw new RangeError("Fabrication frame is empty.");const i=LT(n),s=n.map(a=>[a[i[0]],a[i[1]]]),r={minX:Math.min(...s.map(([a])=>a)),minY:Math.min(...s.map(([,a])=>a)),maxX:Math.max(...s.map(([a])=>a)),maxY:Math.max(...s.map(([,a])=>a))};return{...IT(r,e),bounds:r,axes:i}}function IT(t,e=Nh){if(![t.minX,t.minY,t.maxX,t.maxY,e].every(Number.isFinite))throw new RangeError("Fabrication bounds and margin must be finite.");const i=t.maxX-t.minX,s=t.maxY-t.minY;if(i<=0||s<=0)throw new RangeError("Fabrication bounds must have positive area.");if(e<0||e*2>=cu.width)throw new RangeError("A4 print margin leaves no printable area.");const r=["portrait","landscape"].map(c=>{const l=c==="portrait"?cu:CT,h=Math.min((l.width-e*2)/i,(l.height-e*2)/s);return{orientation:c,pageMm:l,scale:h}}),a=r[1].scale>r[0].scale?r[1]:r[0],o={width:i*a.scale,height:s*a.scale};return{...a,marginMm:e,contentMm:o,offsetMm:{x:(a.pageMm.width-o.width)/2,y:(a.pageMm.height-o.height)/2},bounds:t,axes:[0,1]}}function lu(t,e){return[e.offsetMm.x+(t[e.axes[0]]-e.bounds.minX)*e.scale,e.offsetMm.y+(t[e.axes[1]]-e.bounds.minY)*e.scale]}function LT(t){const n=[0,1,2].map(i=>{const s=t.map(r=>r[i]);return{axis:i,range:Math.max(...s)-Math.min(...s)}}).sort((i,s)=>s.range-i.range||i.axis-s.axis).slice(0,2).map(({axis:i})=>i).sort((i,s)=>i-s);return[n[0],n[1]]}const DT=new Set(["boundary","cut","hingeMountain","hingeValley","hingeUnassigned"]);function NT(t,e={}){const n=PT(t,e.marginMm),i=t.segments.filter(o=>DT.has(o.role)).map(o=>FT(o,n)),{width:s,height:r}=n.pageMm;return{svg:[`<svg xmlns="http://www.w3.org/2000/svg" width="${s}mm" height="${r}mm" viewBox="0 0 ${s} ${r}" role="img" aria-label="A4 flat fabrication template">`,"  <style>line{fill:none;stroke:#000;stroke-width:.25;vector-effect:non-scaling-stroke;stroke-linecap:butt}.boundary,.cut{stroke-dasharray:none}.fold{stroke-width:.2}.mountain{stroke-dasharray:6 2}.valley{stroke-dasharray:2 2}.unassigned{stroke-dasharray:4 2}</style>",...i,"</svg>"].join(`
`),orientation:n.orientation,pageMm:n.pageMm,layout:n}}function FT(t,e){const[n,i]=lu(t.start,e),[s,r]=lu(t.end,e);return`  <line data-edge-id="${OT(t.id)}" data-role="${t.role}" class="${UT(t.role)}" x1="${Nr(n)}" y1="${Nr(i)}" x2="${Nr(s)}" y2="${Nr(r)}" />`}function UT(t){switch(t){case"boundary":return"boundary";case"cut":return"cut";case"hingeMountain":return"fold mountain";case"hingeValley":return"fold valley";case"hingeUnassigned":return"fold unassigned";default:throw new RangeError(`Role ${t} is not printable.`)}}function Nr(t){const e=Math.abs(t)<1e-10?0:t;return Number(e.toFixed(6)).toString()}function OT(t){return t.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}const kT="iframe[data-fabrication-print]";function BT(t,e="Kirigami A4 fabrication template"){const n=t.orientation==="landscape"?"landscape":"portrait",{width:i,height:s}=t.pageMm;return`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${zT(e)}</title>
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
</html>`}function VT(t,e,n=document){n.querySelector(kT)?.remove();const i=n.createElement("iframe");return i.dataset.fabricationPrint="",i.title="A4 fabrication print surface",i.setAttribute("aria-hidden","true"),Object.assign(i.style,{position:"fixed",width:"1px",height:"1px",right:"0",bottom:"0",border:"0",opacity:"0",pointerEvents:"none"}),i.srcdoc=BT(t,e),i.addEventListener("load",()=>{const s=i.contentWindow;s&&(s.focus(),s.print())},{once:!0}),n.body.append(i),i}function zT(t){return t.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}const HT={points:[],segments:[],faces:[]},Fr={width:1.2,stepCount:7,stepRun:.32,stepRise:.32,hostWidth:4,hostFloorExtent:2.56,hostWallExtent:2.56};function GT(t){t.innerHTML=`
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
          <summary><h2>Committed examples</h2><span>${ir.length}</span></summary>
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
  `;const e=Wt(t,".example-list"),n=Wt(t,".viewport-host"),i=Wt(t,".viewport-state"),s=Wt(t,".viewport-print"),r=Wt(t,".viewport-preview-label"),a=Wt(t,".stair-preview-label"),o=Wt(t,".stair-strategy-list"),c=Wt(t,".module-list"),l=Wt(t,".cutout-list"),h=Wt(t,".inspector-scroll"),u=Wt(t,".timeline-panel input[type='range']"),d=Wt(t,".timeline-panel output"),f=Wt(t,".timeline-markers"),p=Wt(t,".timeline-play"),_=[...t.querySelectorAll(".timeline-step")],m=RT(n),g=Ax();let A=0,w,v,E,y,T=0,M,b,P="Kirigami A4 fabrication template";const C=(G,O)=>{b=G,P=O??"Kirigami A4 fabrication template",s.disabled=G===void 0},I=()=>{M!==void 0&&window.clearInterval(M),M=void 0,p.ariaPressed="false",p.textContent="Play"},X=G=>G.points.length+G.segments.length+G.faces.length>0,W=(G,O)=>{const ie=new Map;if(G.result.observed.disposition!=="accepted")for(const re of G.result.diagnostics)for(const we of re.locations){if(we.kind!=="sample")continue;const Ce=re.category==="unsupported"?"unsupported":"invalid";(Ce==="invalid"||ie.get(we.index)===void 0)&&ie.set(we.index,Ce)}const ne=Math.max(O-1,...ie.keys(),0);f.replaceChildren(...[...ie.entries()].map(([re,we])=>{const Ce=document.createElement("span");return Ce.dataset.diagnosticState=we,Ce.style.left=`${ne===0?0:re/ne*100}%`,Ce.title=`${we} at sample ${re+1}`,Ce.setAttribute("role","img"),Ce.setAttribute("aria-label",Ce.title),Ce}))},D=(G,O=!1)=>{const ie=v?.frames??w?.frames.map(Ce=>Ce.frame)??[],ne=v?.parameters??w?.frames.map(Ce=>Ce.parameter)??[];if(ie.length===0)return;T=Math.max(0,Math.min(G,ie.length-1));const re=ie[T];a.hidden=!v,r.hidden=!0,delete r.dataset.diagnosticState,m.show(re),O&&m.focus(),u.max=String(ie.length-1),u.value=String(T);const we=ie.length>1;u.disabled=!we,p.disabled=!we;for(const Ce of _)Ce.disabled=!we;w&&!v&&W(w,ie.length),d.value=`sample ${T+1}/${ie.length} · parameter ${WT(ne[T]??0)}`},Y=G=>{T=0,u.value="0",u.max="0",u.disabled=!0,p.disabled=!0;for(const O of _)O.disabled=!0;d.value=G?"no renderable samples · previous geometry retained":"no engine samples"},V=G=>{i.hidden=G===void 0,i.textContent=G??""},q=G=>{Dx(h,w,G,{onParameterCommit(O,ie){if(!y)return;const ne=wx(y,O,ie);if(!ne.ok){q(ne.diagnostics[0]?.message);return}y=ne.example,te(ne.example,{preserveGeometryOnEmpty:!0,focus:!1})},onReset(){E&&(y=E,te(E,{preserveGeometryOnEmpty:!0,focus:!1}))}})},te=async(G,O)=>{I();const ie=++A;V(`Evaluating ${G.id}…`);try{const ne=await g.evaluate(G);if(ie!==A)return;w=ne,y=ne.example,T=0,q(),ne.frames.some(({frame:we})=>X(we))?(C(ne.frames.find(({frame:we})=>X(we))?.frame,`${ne.example.title} — A4 fabrication template`),D(0,O.focus)):ne.diagnosticPreview!==void 0&&!O.preserveGeometryOnEmpty?(m.show(ne.diagnosticPreview.frame,{diagnostics:ne.result.diagnostics,disposition:ne.result.observed.disposition}),O.focus&&m.focus(),r.hidden=!1,r.dataset.diagnosticState=ne.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=`${ne.diagnosticPreview.label} · ${ne.result.observed.disposition}`,Y(!1),W(ne,0),d.value=`${ne.diagnosticPreview.label} · no certified engine samples`):(O.preserveGeometryOnEmpty||C(),O.preserveGeometryOnEmpty||(m.show(HT),O.focus&&m.focus()),r.hidden=!1,r.dataset.diagnosticState=ne.result.observed.disposition==="rejected"?"invalid":"unsupported",r.textContent=O.preserveGeometryOnEmpty?`${ne.result.observed.disposition} input · previous certified geometry retained`:`${ne.result.observed.disposition} · no spatial preview`,Y(O.preserveGeometryOnEmpty),W(ne,0)),V()}catch(ne){if(ie!==A)return;const re=ne instanceof Error?ne.message:String(ne);q(re),V(`Engine error · ${re}`)}},ae=G=>{const O=ir[G];if(O){for(const[ie,ne]of[...e.querySelectorAll(".example-row")].entries())ne.ariaPressed=String(ie===G);E=O.example,y=O.example,v=void 0,C(),a.hidden=!0,te(O.example,{preserveGeometryOnEmpty:!1,focus:!0})}},ce=()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const G={operationId:"certified-one-sheet-stair",hostPlane:"wall",...Fr},O=mc(G);if(!O.ok){h.textContent=O.diagnostics[0]?.message??"Stair rejected.";return}const ie=_c({input:G,complex:O.complex,sourceMap:O.sourceMap,sampleCount:7});if(!ie.ok){h.textContent=ie.diagnostics[0]?.message??"Stair path rejected.";return}a.textContent="certified compiler result · One-sheet staircase";const ne=ie.samples.map(re=>Ux(O.complex,O.sourceMap,G,re.transforms));v={frames:ne,parameters:ie.samples.map(re=>re.parameter)},C(ne[0],"One-sheet staircase — A4 fabrication template"),m.show(ne.at(-1)),m.focus(),h.innerHTML=`
      <section class="inspection-section">
        <h2>One-sheet staircase</h2>
        <p class="quiet">Certified as one connected material component after cuts: stair, bridges, and host remain materially joined.</p>
      </section>
      <section class="inspection-section">
        <h2>Construction</h2>
        <p class="quiet">${G.stepCount} steps · A4 flat fabrication sheet · ${O.sourceMap.faces.filter(re=>re.role==="step").length} retained step surfaces · ${O.sourceMap.cutPairs.length} paired cuts · ${O.sourceMap.voids.length} opening voids.</p>
        <p class="quiet">Construction status: certified connected sheet.</p>
      </section>
    `,D(ne.length-1)},oe=document.createElement("button");oe.type="button",oe.className="stair-strategy-button",oe.ariaPressed="false",oe.textContent="One-sheet staircase",oe.addEventListener("click",()=>{oe.ariaPressed="true",ce()}),o.append(oe);const ke=document.createElement("button");ke.type="button",ke.className="stair-strategy-button",ke.ariaPressed="false",ke.textContent="Tread-only staircase",ke.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const G={operationId:"tread-only-stair",...Fr},O=Ac(G);if(!O.ok){h.textContent=O.diagnostics[0]?.message??"Tread-only pattern rejected.";return}const ie=Tc({input:G,complex:O.complex,sourceMap:O.sourceMap,sampleCount:7});if(!ie.ok){h.textContent=ie.diagnostics[0]?.message??"Tread-only deployment rejected.";return}const ne=ie.samples.map(we=>we.parameter),re=ie.samples.map(we=>Ox(O.complex,O.sourceMap,we.transforms));v={frames:re,parameters:ne},C(re[0],"Tread-only staircase — A4 fabrication template"),m.show(re.at(-1)),m.focus(),a.textContent="compiler construction preview · Tread-only staircase",h.innerHTML=`
      <section class="inspection-section">
        <h2>Tread-only staircase</h2>
        <p class="quiet">${G.stepCount} steps · A4 flat fabrication sheet. Compiled directly from the approved one-sheet cut/score template: ${O.sourceMap.cutLines.length} authored long cuts, ${O.sourceMap.hinges.filter(we=>we.role!=="parent").length} step folds, and no riser faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">Computed from one topology: retained edges remain joined while paired cut banks open into negative space.</p>
      </section>
    `,D(re.length-1)}),o.append(ke);const qe=document.createElement("button");qe.type="button",qe.className="stair-strategy-button",qe.ariaPressed="false",qe.textContent="Riser-only staircase",qe.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const G={operationId:"riser-only-stair",...Fr},O=Xx(G);if(!O.ok){h.textContent=O.diagnostics[0]?.message??"Riser-only pattern rejected.";return}const ie=Yx({input:G,complex:O.complex,sourceMap:O.sourceMap,sampleCount:7});if(!ie.ok){h.textContent=ie.diagnostics[0]?.message??"Riser-only deployment rejected.";return}const ne=ie.samples.map(we=>we.parameter),re=ie.samples.map(we=>kx(O.complex,O.sourceMap,we.transforms));v={frames:re,parameters:ne},C(re[0],"Riser-only staircase — A4 fabrication template"),m.show(re.at(-1)),m.focus(),a.textContent="compiler construction preview · Riser-only staircase",h.innerHTML=`
      <section class="inspection-section">
        <h2>Riser-only staircase</h2>
        <p class="quiet">${G.stepCount} steps · A4 flat fabrication sheet. Compiled from the same one-sheet cut topology in its flipped deployment: ${O.sourceMap.cutLines.length} authored long cuts, ${O.sourceMap.supports.length} retained riser regions, and no tread faces.</p>
      </section>
      <section class="inspection-section">
        <h2>Deployment</h2>
        <p class="quiet">The stationary host supports the risers while one connected carrier wall preserves their material ancestry and retained-edge closure.</p>
      </section>
    `,D(re.length-1)}),o.append(qe);const Be=document.createElement("button");Be.type="button",Be.className="stair-strategy-button",Be.ariaPressed="false",Be.textContent="Carrier-hosted compound staircase",Be.addEventListener("click",()=>{I(),A+=1,w=void 0,r.hidden=!0,a.hidden=!1;const G=Jx({operationId:"carrier-hosted-compound-stair",parent:Fr,child:{width:.16,stepCount:4,stepRun:.144,stepRise:.144,hostWidth:.24,hostFloorExtent:.72,hostWallExtent:.72},childHostStepIndex:6});if(!G.ok){h.textContent=G.diagnostics[0]?.message??"Compound stair rejected.";return}const O=jx({compilation:G,sampleCount:7});if(!O.ok){h.textContent=O.diagnostics[0]?.message??"Compound deployment rejected.";return}const ie=O.samples.map(re=>re.parameter),ne=O.samples.map(re=>Bx(G,re));v={frames:ne,parameters:ie},C(ne[0],"Carrier-hosted compound staircase — A4 fabrication template"),m.show(ne.at(-1)),m.focus(),a.textContent="compiler construction preview · Carrier-hosted compound staircase",h.innerHTML=`
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
    `,D(ne.length-1)}),o.append(Be);const J=document.createElement("button");J.type="button",J.className="stair-strategy-button",J.ariaPressed="false",J.textContent="Ground slab",J.addEventListener("click",()=>{I(),A+=1;const G=ir.find(({example:we})=>we.title==="One root plane pair");if(!G){h.textContent="Certified root plane pair example is unavailable.";return}if(G.example.kind!=="spatialProgram"){h.textContent="Root plane pair example is not a spatial program.";return}const O={...G.example,id:"ground-slab",title:"Ground slab",assumptions:["Wide shallow plane-pair slab"],input:{...G.example.input,id:"ground-slab",sheet:{...G.example.input.sheet,width:6,wallExtent:3,floorExtent:3},operations:G.example.input.operations.map(we=>({...we,id:"slab-pair",xOffset:.5,width:5,height:1,depth:1,alignment:"axisAligned"}))}},ie=hx(O);w=ie,E=G.example,y=G.example,r.hidden=!0,a.hidden=!1;const ne=ie.frames.map(we=>we.frame),re=ie.frames.map(we=>we.parameter);v={frames:ne,parameters:re},C(ne.at(-1),"Ground slab — A4 fabrication template"),m.show(ne[0]),m.focus(),a.textContent="compiler construction preview · Ground slab",h.innerHTML=`
      <section class="inspection-section">
        <h2>Ground slab</h2>
        <p class="quiet">Wide shallow floor and vertical wall joined by one shared hinge, using the certified axis-aligned root plane-pair family.</p>
      </section>
      <section class="inspection-section">
        <h2>Construction</h2>
        <p class="quiet">Compiled from the same bounded plane-pair mechanism as the “One root plane pair” validation example.</p>
        <p class="quiet">The sheet uses equal floor/wall sheet halves, and the equal-depth axis-aligned linkage preserves a rectangular-prism-like profile.</p>
      </section>
    `,D(0)}),c.append(J);for(const G of["Wall","Roof"]){const O=document.createElement("button");O.type="button",O.className="stair-strategy-button",O.disabled=!0,O.textContent=`${G} · planned`,c.append(O)}for(const G of["Window","Door"]){const O=document.createElement("button");O.type="button",O.className="stair-strategy-button",O.disabled=!0,O.textContent=`${G} · planned`,l.append(O)}s.addEventListener("click",()=>{if(b)try{const G=NT(b);VT(G,P)}catch(G){const O=G instanceof Error?G.message:String(G);V(`Print unavailable · ${O}`)}});for(const[G,O]of ir.entries()){const ie=document.createElement("button");ie.type="button",ie.className="example-row",ie.ariaPressed="false",ie.innerHTML=`
      <span class="example-index">${String(G+1).padStart(2,"0")}</span>
      <span>
        <strong>${co(O.example.title)}</strong>
        <small>${co(O.example.kind)} · ${co(O.example.fixtureClass)}</small>
      </span>
    `,ie.addEventListener("click",()=>ae(G)),e.append(ie)}return u.addEventListener("input",()=>{a.hidden=!0,I(),D(Number(u.value))}),_.forEach(G=>{G.addEventListener("click",()=>{I(),D(T+Number(G.dataset.direction))})}),p.addEventListener("click",()=>{if(M!==void 0){I();return}const G=v?.frames.length??w?.frames.length??0;G<=1||(T>=G-1&&D(0),p.ariaPressed="true",p.textContent="Pause",M=window.setInterval(()=>{const O=v?.frames.length??w?.frames.length??0;if(O===0||T>=O-1){I();return}D(T+1)},650))}),q(),ae(0),()=>{A+=1,I(),g.dispose(),m.dispose(),t.replaceChildren()}}function Wt(t,e){const n=t.querySelector(e);if(!n)throw new Error(`Missing Engine Lab element: ${e}.`);return n}function WT(t){return Math.abs(t)>=1e3||t!==0&&Math.abs(t)<.001?t.toExponential(5):t.toFixed(5).replace(/0+$/,"").replace(/\.$/,"")}function co(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[e])}const Fh=document.querySelector("#app");if(!Fh)throw new Error("Missing Engine Lab root.");GT(Fh);
