var f=Object.defineProperty;var C=(t,e,r)=>e in t?f(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var o=(t,e,r)=>(C(t,typeof e!="symbol"?e+"":e,r),r);import{bF as k,b as v,r as d,bS as w,j as s,C as P,E as S,g9 as u}from"./index-4f80e427.js";import{u as T,a as g}from"./unknownify-a0be8e4f.js";import{L as I,C as M,a as A,b as L,P as N,c as R,T as q,p as E,e as _,f as D}from"./chartjs-adapter-date-fns.esm-d8123bdf.js";import{B as j}from"./RoleCell-d65e5cf2.js";import"./index-557e8601.js";import"./index-022a553b.js";class B{constructor(e){o(this,"current",0);o(this,"all");this.all=e}next(){const e=this.all[this.current];return this.current=(this.current+1)%this.all.length,e}}const m=["circle","rect","rectRounded","rectRot","triangle"],F=(t,e)=>t.map(r=>({x:r[0],y:e(r[1])})),H=(t,e)=>({locale:e.locale,responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},color:t.palette.text.secondary,plugins:{tooltip:{backgroundColor:t.palette.background.paper,bodyColor:t.palette.text.primary,titleColor:t.palette.action.active,borderColor:t.palette.primary.main,borderWidth:1,padding:10,boxPadding:5,usePointStyle:!0,callbacks:{title:r=>u(1e3*r[0].parsed.x,e.locale)},itemSort:(r,i)=>i.parsed.y-r.parsed.y},legend:{position:"bottom",align:"start",labels:{boxWidth:10,boxHeight:10,usePointStyle:!0,padding:24}},title:{text:"Top 10 requests per second in the last 6 hours",position:"top",align:"start",display:!0,font:{size:16,weight:"400"},color:t.palette.text.primary,padding:{bottom:32}}},scales:{y:{type:"linear",title:{display:!0,text:"Requests per second",color:t.palette.text.secondary},suggestedMin:0,ticks:{precision:0,color:t.palette.text.secondary},grid:{color:t.palette.divider,borderColor:t.palette.divider}},x:{type:"time",time:{unit:"minute"},grid:{display:!0,color:t.palette.divider,borderColor:t.palette.divider},ticks:{callback:(r,i,a)=>u(a[i].value*1e3,e.locale)}}}});class W{constructor(e){o(this,"items");o(this,"picked",new Map);this.items=new B(e)}pick(e){return this.picked.has(e)||this.picked.set(e,this.items.next()),this.picked.get(e)}}const $=(t,e)=>{var r;if((r=e==null?void 0:e.data)!=null&&r.result){const i=new W([t.palette.success,t.palette.error,t.palette.primary,t.palette.warning]);return e.data.result.map((a,y)=>{var c,p;const n=g((c=a.metric)==null?void 0:c.endpoint),b=g((p=a.metric)==null?void 0:p.appName),l=i.pick(n),h=a.values||[];return{label:`${n}: ${b}`,borderColor:l.main,backgroundColor:l.main,data:F(h,x=>parseFloat(x)),elements:{point:{radius:4,pointStyle:m[y%m.length]},line:{borderDash:[8,4]}}}})}return[]},V=()=>{const{locationSettings:t}=k(),{metrics:e}=T(),r=v(),i=d.useMemo(()=>H(r,t),[r,t]);w("Network - Traffic");const a=d.useMemo(()=>({datasets:$(r,e)}),[r,e,t]);return s(P,{condition:a.datasets.length===0,show:s(S,{severity:"warning",children:"No data available."}),elseShow:s(j,{sx:{display:"grid",gap:4},children:s("div",{style:{height:400},children:s(I,{data:a,options:i,"aria-label":"An instance metrics line chart with two lines: requests per second for admin API and requests per second for client API"})})})})};M.register(A,L,N,R,q,E,_,D);export{V as NetworkTraffic,V as default};
