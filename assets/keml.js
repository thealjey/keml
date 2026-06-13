/*!
 * keml 3.8.0 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var m=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"reference-chart","reference-chart"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[1,"increment","increment"],[1,"vir-cleanup","vir-cleanup"],[1,"virtualization","virtualization"],[3,"if-loading","if-loading"],[1,"if-error","if-error"],[4,"sse","sse"],[8,"stream","stream"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"],[0,"https://www.transition-example.com/page-a","transition-home"],[1,"https://www.transition-example.com/page-a","transition-a"],[1,"https://www.transition-example.com/page-b","transition-b"],[1,"https://www.transition-example.com/page-c","transition-c"]];var h={credentials:`<small class="chip mt3">Ha!</small>

<p>What?!</p>

<p>You were expecting to see something, weren't you?</p>

<p>But the deed is done.</p>

<dl class="dl">
  <dt>Credentials included:</dt>
  <dd>{ server.withCredentials ? "Yes" : "No" }</dd>
</dl>
`,"endpoint-override":`<small class="chip mv3">Request received</small>

<dl class="dl">
  <dt>Endpoint:</dt>
  <dd>{ server.url.pathname }</dd>
  <dt>Method:</dt>
  <dd>{ server.method }</dd>
</dl>
`,"event-modifier":`<small class="chip mt3">Shortcut triggered</small>

<p>You just used your first hotkey with KEML!</p>

<dl class="dl">
  <dt>Your message:</dt>
  <dd>{ server.getParam("message") }</dd>
</dl>
`,expensive:`<small class="chip mt3">Complete</small>

<p>Imagine that this value was hard to compute!</p>

<dl class="dl">
  <dt>You said:</dt>
  <dd>{ server.getParam("message") }</dd>
  <dt>Answer:</dt>
  <dd>42</dd>
</dl>
`,"form-submit":`<small class="chip mt3">Received</small>

<p>
  Form submissions may not be exciting, but where would the web be without them?
</p>

<dl class="dl">
  <dt>Hello:</dt>
  <dd>{ server.getParam("name") }</dd>
</dl>
`,"history-a":`<p>The A page content.</p>
`,"history-b":`<p>The B page content.</p>
`,"history-c":`<p>The C page content.</p>
`,"history-home":`<a
  href="/page-a"
  class="mr3"
  on:click="redirectPushStateA"
  on="redirectPushStateA"
  redirect="pushState"
>
  Push A
</a>

<a
  href="/page-b"
  class="mr3"
  on:click="redirectPushStateB"
  on="redirectPushStateB"
  redirect="pushState"
>
  Push B
</a>

<a
  href="/page-c"
  class="mr3"
  on:click="redirectPushStateC"
  on="redirectPushStateC"
  redirect="pushState"
>
  Push C
</a>
|
<a
  href="/page-a"
  class="mh3"
  on:click="redirectReplaceStateA"
  on="redirectReplaceStateA"
  redirect="replaceState"
>
  Replace A
</a>

<a
  href="/page-b"
  class="mr3"
  on:click="redirectReplaceStateB"
  on="redirectReplaceStateB"
  redirect="replaceState"
>
  Replace B
</a>

<a
  href="/page-c"
  on:click="redirectReplaceStateC"
  on="redirectReplaceStateC"
  redirect="replaceState"
>
  Replace C
</a>

<div
  on:navigate="showHistoryPage"
  on="showHistoryPage"
  result="historyResult"
  render="historyResult"
>
  { server.partial } <!-- SSR partial render -->
</div>
`,"if-error":`{{ server.status = server.getParam('switch') === 'error' ? 200 : 500 }}

<button
  class="btn mr3"
  on:click="sendIfError"
  on="sendIfError"
  href="/if-error"
  name="switch"
  value="{ server.getParam('switch') === 'error' ? 'success' : 'error' }"
  result="ifErrorResult"
  error="ifErrorResult"
  render="ifErrorResult"
  position="replaceWith"
  if:error="isError"
>
  Get { server.getParam("switch") } code
</button>
`,"if-loading":"",increment:`<input
  class="input mt3"
  type="text"
  readonly
  name="count"
  value="{ +server.getParam('count') + 1 }"
  on="increment"
  debounce="1000"
  src="/increment"
  result="incResult"
  render="incResult"
  position="replaceWith"
  clear-timeout="cancelIncrement"
>
`,key:`<div
  render="keyResult"
  position="replaceWith"
>
  <button
    type="button"
    class="btn mb3"
    on:click="toggleKey"
    on="toggleKey"
    href="/key"
    name="switch"
    value="{ server.getParam('switch') === 'hide' ? 'show' : 'hide' }"
    result="keyResult"
  >
    { server.getParam("switch") } notification
  </button>

  <div>
    {{ if (server.getParam("switch") === "hide") { }}
      <div key="notification" class="admonition info mt0">
        <p class="admonition-title">Info</p>
        <p>Just passing by...</p>
      </div>
    {{ } }}

    <div>
      <dl class="dl">
        <dt>Roses are</dt>
        <dd>red</dd>
        <dt>Violets are</dt>
        <dd>blue</dd>
        <dt>KEML is</dt>
        <dd>awesome</dd>
        <dt>And so are</dt>
        <dd>you</dd>
      </dl>
    </div>
  </div>
</div>
`,"location-assign-a":`<a
  href="/page-b"
  on:click="redirectAssignA"
  on="redirectAssignA"
  redirect="assign"
>
  Go to page B
</a>
`,"location-assign-b":`<a
  href="/page-c"
  on:click="redirectAssignB"
  on="redirectAssignB"
  redirect="assign"
>
  Go to page C
</a>
`,"location-assign-c":`<p>Congrats you have reached the last page \u{1F389}</p>

<p>Now use the browser buttons to go back and forth.</p>
`,"location-replace-a":`<a
  href="/page-b"
  on:click="redirectReplaceA"
  on="redirectReplaceA"
  redirect="assign"
>
  Go to page B
</a>
`,"location-replace-b":`<a
  href="/page-c"
  on:click="redirectReplaceB"
  on="redirectReplaceB"
  redirect="replace"
>
  Replace this page with page C
</a>
`,log:`<h4 class="mt0">Type in the field and watch events appear in the console.</h4>

<input
  type="text"
  class="input"
  on:keyup="logTest"
  event:keyup
  log
>
`,once:`<li class="mt3">Log entry from: { new Date().toLocaleString() }</li>
`,"parent-handler":`<small class="chip mt3">Received</small>

<p class="mb0">Click handled by a parent element.</p>
`,polling:`{{ const colors = ["red", "orange", "gold", "yellow", "purple", "pink", "green",
  "navy", "blue"]; }}

<div
  class="w3 h3 bg-{ colors[Math.random() * (colors.length - 1) | 0] }"
  on:discover="startPolling"
  on="startPolling"
  debounce="5000"
  get="/polling"
  on:result="startPolling"
  result="pollingResult"
  render="pollingResult"
  position="replaceWith"
></div>
`,position:`<img src="../../assets/cat.jpg" alt="cat">

<p class="mb0">Bazinga \u{1F605}</p>
`,"reference-chart":`{{
  // available area for rendering from the client
  const width = +server.getParam("chartWidth");

  // pick at most the number of available pixels worth of data points
  // this is going to look identical in the UI, but is no longer absurd
  const data = server.sampleSeries(server.series, width);

  // prepare svg compatible values
  const chart = server.generateChart(server.series, data, width, 500);
}}

<svg
  class="chart"
  height="500"
  ref:width="referenceChartWidth"
  measure="devicePixelContentBoxSize"
  render="referenceChart"
  position="replaceWith"
  viewBox="0 0 { width } 500"
>
  <path { chart.path } />

  <line { chart.xAxis } />
  <line { chart.yAxis } />

  {{ for (const tick of chart.xTicks) { }}
    <text { tick.text }>{ tick.label }</text>
    <line { tick.line } />
  {{ } }}

  {{ for (const tick of chart.yTicks) { }}
    <text { tick.text }>{ tick.label }</text>
    <line { tick.line } />
  {{ } }}
</svg>
`,"request-headers":`<small class="chip mt3">Received</small>

<p>Just don't tell anyone \u{1F600}</p>

<dl class="dl">
  <dt>Secret identity:</dt>
  <dd>{ server.headers.get("batman") }</dd>
</dl>
`,"result-failure":`{{ server.status = 500 }}

<small class="chip error mt3">Oh, no!</small>

<p class="mb0">An error has occurred \u{1F937}</p>
`,"result-success":`<small class="chip success mt3">Hurray</small>

<p class="mb0">Everything is awesome \u{1F389}</p>
`,sse:`{{
  const segment = ([value, label]) =>
    "<span>" + value + "</span><span>" + label + "</span>";

  const clock = () => server.timeSince(1716062717000).map(segment).join("");

  const tick = () => server.dispatchEvent("inception-clock", clock());

  server.addIntervalId(setInterval(tick, 1000));
}}
`,stream:`{{

  const msg4 = () => setTimeout(() => (
    server.write("<dt>And so are</dt><dd>you</dd>"),
    server.end()
  ), 2000);

  const msg3 = () => setTimeout(() => (
    server.write("<dt>KEML is</dt><dd>awesome</dd><!-- KEML -->"),
    msg4()
  ), 2000);

  setTimeout(() => (
    server.write("<dt>Violets are</dt><dd>blue</dd><!-- KEML -->"),
    msg3()
  ), 2000);

}}

<dt>Roses are</dt><dd>red</dd>
<!-- KEML -->
`,"transition-a":`<div class="h-100 bg-purple"></div>
`,"transition-b":`<div class="h-100 bg-navy"></div>
`,"transition-c":`<div class="h-100 bg-blue"></div>
`,"transition-home":`<p class="mt0">
  This example uses
  <a href="https://animate.style/" target="_blank">Animate.css</a>
  for the transition animations.
</p>

<a
  href="/page-a"
  class="mr3"
  on:click="transitionA"
  on="transitionA"
  redirect="pushState"
>
  Page A
</a>

<a
  href="/page-b"
  class="mr3"
  on:click="transitionB"
  on="transitionB"
  redirect="pushState"
>
  Page B
</a>

<a
  href="/page-c"
  class="mr3"
  on:click="transitionC"
  on="transitionC"
  redirect="pushState"
>
  Page C
</a>

<div
  class="h4 transition-example"
  on:navigate="showTransitionPage"
  on="showTransitionPage"
  result="transitionResult"
  render="transitionResult"
  transition
>
  { server.partial }
</div>
`,"vir-cleanup":`{{ const path = server.getParam("path"); }}

<div
  { 'style="height: ' + server.getNode(path).size * 50 + 'px;"' }
  on:reveal="loadGrid_{ path } cancelClearGrid_{ path }"
  on:conceal="cancelLoadGrid_{ path }"
  on="loadGrid_{ path }"
  debounce="200"
  clear-timeout="cancelLoadGrid_{ path }"
  src="/virtualization?path={ path }"
  result="virtualizationResult_{ path }"
  render="virtualizationResult_{ path }"
  position="replaceWith"
></div>
`,virtualization:`{{ const path = server.getParam("path"); }}
{{ const { children, start, end, level, size } = server.getNode(path); }}

{{ if (level) { }}
  <div
    { 'style="height: ' + size * 50 + 'px;"' }
    on:reveal="cancelClearGrid_{ path }"
    on:conceal="clearGrid_{ path } cancelLoadGrid_{ path }"
    on="clearGrid_{ path }"
    debounce="1000"
    clear-timeout="cancelClearGrid_{ path }"
    src="/vir-cleanup?path={ path }"
    result="virtualizationResult_{ path }"
    render="virtualizationResult_{ path }"
    position="replaceWith"
  >
{{ } }}

{{ if (children) { }}
  {{ let i = 0; }}
  {{ for (const { size } of children) { }}
    {{ const p = path + "-" + i++; }}
    <div
      { 'style="height: ' + size * 50 + 'px;"' }
      on:reveal="loadGrid_{ p } cancelClearGrid_{ p }"
      on:conceal="cancelLoadGrid_{ p }"
      on="loadGrid_{ p }"
      debounce="200"
      clear-timeout="cancelLoadGrid_{ p }"
      src="/virtualization?path={ p }"
      result="virtualizationResult_{ p }"
      render="virtualizationResult_{ p }"
      position="replaceWith"
    ></div>
  {{ } }}
{{ } else { }}
  {{ for (let i = start, l = end; i < l; ++i) { }}
    <div class="grid-row">
      <div>{ server.table[i].num }</div>
      <div>{ server.table[i].label }</div>
      <div>{ server.table[i].temperature }</div>
    </div>
  {{ } }}
{{ } }}

{{ if (level) { }}
  </div>
{{ } }}
`};var j=new Set,X=new Set,$=new Set,K=new Set,Y=new Set;var tn=new Event("navigate"),le=()=>{for(let e of j)e.dispatchEvent(tn)};var y;{let e=new DOMParser,t=d=>{let s=[],l=0,c=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;s.push("let out = [];");let p;for(;p=c.exec(d);){let f=p[0],g=p.index;if(s.push(`out.push(${JSON.stringify(d.slice(l,g))});`),f.startsWith("{{"))s.push(f.slice(2,-2).trim());else{let v=f.slice(1,-1).trim();s.push(`out.push(String(${v}));`)}l=g+f.length}return s.push(`out.push(${JSON.stringify(d.slice(l))});`),s.push("return out.join('');"),new Function("server",s.join(`
`))},n=d=>{let s=Array.from({length:10},()=>Math.random()*100|0),l=new Array(d),c=p=>{if(p<0)return s[0]+(s[0]-s[1]);if(p>=s.length){let f=s.length;return s[f-1]+(s[f-1]-s[f-2])}return s[p]};for(let p=0;p<d;++p){let f=p/(d-1)*(s.length-1),g=Math.floor(f),v=f-g,x=c(g-1),S=c(g),H=c(g+1),ie=c(g+2),ae=.5*(2*S+(-x+H)*v+(2*x-5*S+4*H-ie)*v*v+(-x+3*S-3*H+ie)*v*v*v);l[p]=ae}return l},r=(d,s)=>{if(s|=0,s<1)return[];let l=d.length;if(s===1)return[d[l/2|0]];if(s>l)return d;let c=new Array(s);for(let p=0,f;p<s;++p)f=p/(s-1),c[p]=d[Math.round(f*(l-1))];return c},i=(d,s=2)=>parseFloat(d.toFixed(s)),o=([d,s])=>d+'="'+s+'"',a=d=>Object.entries(d).map(o).join(" "),u=(d,s,l,c)=>{let p=s.length;return{path:a({d:s.reduce((f,g,v)=>(f[v]=`${v?"L":"M"} ${i(v/(p-1)*l)} ${i(c-g/100*c)}`,f),new Array(p)).join(" ")}),xTicks:Array.from({length:11},(f,g)=>{let v=i(g/10),x=i(v*l-1),S=a(g?{x:10-c,y:x+(g<10?4:0),transform:"rotate(-90)"}:{x:x+10,y:c-10});return{line:a({x1:x,y1:c,x2:x,y2:c-6}),text:S,label:(v*d.length).toLocaleString()}}),yTicks:Array.from({length:6},(f,g)=>{let v=g/5,x=i(c-v*c+1);return{line:a({x1:0,y1:x,x2:6,y2:x}),text:a({x:10,y:x+(!g||g>4?10:4)}),label:i(v*100)}}),xAxis:a({x1:0,y1:0,x2:0,y2:c}),yAxis:a({x1:0,y1:c,x2:l,y2:c})}},E=Object.fromEntries(Object.entries(h).map(([d,s])=>[d,t(s)])),b=m.map(([d,s,l])=>[d,new RegExp(s),E[l]]),ne=["Deep Freezing","Freezing","Cold","Cool","Mild Moderate","Moderate","Warm","Hot","Very Hot","Scorching"],M=1,W=2,V=4,N=8,L=n(1e7),P=Array.from({length:3e5},(d,s)=>({num:s+1,temperature:(s=Math.random()*100).toFixed(2),label:ne[Math.max(0,(s-1)/10|0)]})),R=P.length,G=10**(String(R).length-1),C=R===G?R:G*10,re=[];for(R>1e5&&re.push(C=1e5);C>19;)re.push(C/=10);let Ve=(d,s,l=0)=>{let c=s-d;if(l>=re.length||c<11)return{size:c,start:d,end:s,level:l};let p=re[l],f=[];for(let g=d;g<s;g+=p)f.push(Ve(g,Math.min(g+p,s),l+1));return{size:c,level:l,children:f}},Gt={children:[Ve(0,R)]};class Ge{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;series=L;table=P;sampleSeries=r;generateChart=u;getParam(s){return this.data?this.data.get(s):this.url.searchParams.get(s)}get partial(){return this.render(M)[1]}getNode(s){return s.split("-").map(c=>c|0).reduce((c,p)=>c.children[p],Gt)}onloadend(s){}open(s,l){this.method=s,this.url=l}setRequestHeader(s,l){this.headers.set(s,l)}render(s){for(let[l,c,p]of b)if(p&&c.test(this.url.href)&&(l&M)===((s??+this.headers.has("X-Requested-With"))&M))return[l,p(this)];return[0,""]}respond=()=>this.onloadend({target:this});send(s){this.data=s;let[l,c]=this.render();this.responseXML=e.parseFromString(c,"text/html"),l&W?setTimeout(this.respond,2e3):this.respond()}}let jt=new TextEncoder,Xt=async(d,s={})=>{let l,c=new ReadableStream({start(S){l=S}}),{headers:p,credentials:f,method:g,body:v}=s,x={headers:p?Array.isArray(p)?new Map(p):p instanceof Headers?p:new Map(Object.entries(p)):new Map,withCredentials:f!=="omit",method:g,url:typeof d=="string"?new URL(d):d instanceof Request?new URL(d.url):d,data:v,status:200,getParam(S){return this.data?this.data.get(S):this.url.searchParams.get(S)},write(S){l.enqueue(jt.encode(S))},end(){l.close()},get partial(){return this.render(N)[1]},render(S){for(let[H,ie,ae]of b)if(ae&&ie.test(this.url.href)&&(S??H)&N)return[H,ae(this)];return[0,""]}};return x.write(x.render()[1]),new Response(c)},$t=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],je=[[],[],[],[],[],[]];class Kt{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(s){this.url=typeof s=="string"?new URL(s):s;for(let[l,c,p]of b)if(p&&c.test(this.url.href)&&l&V){p(this);break}}addIntervalId(s){this.intervals.push(s)}timeSince(s){let l=Date.now()-s,c,p=-1,f,g,v;for(;++p<6;)c=$t[p],v=je[p],g=c[2],f=l/g|0,l-=f*g,v[0]=(p>3&&f<10?"0":"")+f,v[1]=c[+(f===1)];return je}dispatchEvent(s,l){for(let c of this.listeners.get(s)??[])c({type:s,data:l})}addEventListener(s,l){let c=this.listeners.get(s);c||this.listeners.set(s,c=new Set),c.add(l)}removeEventListener(s,l){let c=this.listeners.get(s);c&&(c.delete(l),c.size||this.listeners.delete(s))}close(){this.listeners.clear();for(let s of this.intervals)clearInterval(s);this.intervals=[]}}let Yt=d=>{let s={},l=d,c=0;for(;++c<3&&l&&l!==Object.prototype;){for(let p of Object.getOwnPropertyNames(l))if(!(p in s)){try{if(d[p]===l[p])continue}catch{}try{s[p]=d[p]}catch{}}l=Object.getPrototypeOf(l)}return s};class Jt{constructor(s){this.el=s;let{children:[l,c,p]}=s,f=l.children;this.backBtn=f[0],this.forwardBtn=f[1],f[2].childNodes.length||f[2].appendChild(document.createTextNode("")),this.address=f[2].firstChild,this.viewport=c,this.consoleClear=p?.children[0]?.children[0],this.consoleOut=p?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=s,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let g=this.address.nodeValue?.trim();g&&(this.stack.push([new URL(g),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new Ge;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:s}})=>this.viewport.replaceChildren(...s?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(s){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",s?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(oe.ownerElement=this.el,$e())}get url(){return this.stack[this.index]?.[0]}assign(s,l){++this.index,this.replace(s,l)}replace(s,l){this.stack.length=this.index+1,this.stack[this.index]=[s,l],this.render(l)}log(s){if(!this.consoleOut)return;let l=new WeakSet,c=document.createElement("p"),p=JSON.stringify(s,(g,v)=>{if(!(typeof v=="function"||typeof v>"u"))return typeof v=="object"&&v!==null?l.has(v)?void 0:(l.add(v),Yt(v)):v}),f=document.createTextNode(p);c.setAttribute("title",p),c.classList.add("mv0"),c.append(f),this.consoleOut.append(c),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let se=new Map,Xe=()=>{Array.from(document.getElementsByClassName("browser"),d=>se.has(d)||se.set(d,new Jt(d)))};Xe(),new MutationObserver(Xe).observe(document.body,{childList:!0,subtree:!0});let oe={ownerElement:{},get browser(){return se.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(d){this.browser?.assign(d,!0)},replace(d){this.browser?.replace(d,!0)}},Zt={pushState(d,s,l){oe.browser?.assign(l,!1)},replaceState(d,s,l){oe.browser?.replace(l,!1)}},$e;y={XMLHttpRequest:Ge,EventSource:Kt,location:oe,history:Zt,window:{addEventListener(d,s){d==="popstate"&&($e=s)}},console:{ownerElement:{},get browser(){return se.get(this.ownerElement.closest(".browser"))},log(d){this.browser?.log(d)}},fetch:Xt}}var Ke=[],Ye=[],Je=[],Ze=[],Qe=[],et=[],Re,ce=!1,de=!1,Le=!1,z=new Set,J=new Set,Z=new Set,I=new Set,_=new Set,D=()=>Le=!0,tt=()=>Le,nt=()=>Le=!1,Q=e=>Ke.push(e),rt=()=>Ke.pop(),st=e=>Ye.push(e),ot=()=>Ye.pop(),it=e=>Je.push(e),at=()=>Je.pop(),lt=e=>Ze.push(e),ct=()=>Ze.pop(),dt=()=>Re=void 0,pt=()=>Re,mt=e=>Re=e,A=()=>ce=!0,ht=()=>ce,ut=()=>ce=!1,k=()=>de=!0,pe=()=>ce=de=!0,ft=()=>de,gt=()=>de=!1,vt=e=>Qe.push(e),Et=()=>Qe.pop(),me=(e,t)=>et.push([e,t]),bt=()=>et.pop();var nn=new Event("conceal"),rn=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(nn)},Ae=new IntersectionObserver(rn);var sn=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;A()},ke=new IntersectionObserver(sn);var on=e=>{let t,n,r,i=!1;for(let o of e)({target:t,contentRect:{width:n,height:r}}=o),(n||r||t.offsetParent!=null)&&(t.sizeEntry=o,i=!0);i&&k()},he=new ResizeObserver(on);var an=new Event("reveal"),ln=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(an)},Te=new IntersectionObserver(ln);var yt={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},Ne=Object.keys(yt),cn=/\/+$/,ee=e=>{y.location.ownerElement=e;let t=Ne.find(e.hasAttribute,e),n=t?e.getAttribute(t):"",r=y.location.href,i;try{i=new URL(n,r)}catch(E){e.hasAttribute("log")&&console.error(E);try{i=new URL("",r)}catch(b){e.hasAttribute("log")&&console.error(b),i=new URL("about:blank")}}let o=i.pathname.replace(cn,"");i.pathname=!o||o.lastIndexOf(".")<=o.lastIndexOf("/")?o+"/":o;let a=yt[t]??"GET",u=e.getAttributeNode("method");return u&&(a=u.value.toUpperCase()),[i,a,e.hasAttribute("credentials")]};var dn=new DOMParser,ue=e=>dn.parseFromString(e,"text/html");var te=class extends Set{constructor(n,r,i,o){super();this.url=n;this.withCredentials=r;this.onMessage=i;for(let a of o)this.add(a)}url;withCredentials;onMessage;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===y.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,ue(r));open(){this.source=new y.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,i=this.difference(n),o=n.difference(this);for(let a of i)super.delete(a),this.removeEventListener(a,this.handleMessage);for(let a of o)super.add(a);!r&&this.size?this.open():r&&!this.size&&this.close();for(let a of o)this.addEventListener(a,this.handleMessage)}};var T=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(Q))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,i)=>{let o;for(let a of this.elements){let[u,,E]=ee(a);this.getEvent(a)===r&&u.href===n.url.href&&E===n.withCredentials&&this.onPayload({target:{ownerElement:a,responseXML:o?o.cloneNode(!0):o=i,status:200}})}};start(){let n=new Map,r=new Map,i=new Set;for(let o of this.elements){let[a,,u]=ee(o),E=this.has(a.href)?n:r,b=E.get(a.href);b||E.set(a.href,b=[new Set,new Set,a]),b[+u].add(this.getEvent(o)),i.add(a.href)}for(let[o,[a,u]]of this)i.has(o)||(a.clear(),u.clear(),this.delete(o));for(let[o,[a,u]]of n){let[E,b]=this.get(o);E.reconcileWith(a),b.reconcileWith(u)}for(let[o,[a,u,E]]of r)this.set(o,[new te(E,!1,this.onMessage,a),new te(E,!0,this.onMessage,u)])}stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var wt=e=>Object.prototype.toString.call(e)==="[object RegExp]";var xt,St=e=>xt=e,Rt=()=>xt;var Lt=new Set,pn=["INPUT","SELECT","TEXTAREA"];function ge(e){return!e||(typeof e=="string"?e===this:wt(e)?e.test(this):e.some(ge,this))}function fe({attributes:e}){for(let{name:t}of e)if(ge.call(t,this.match))return!1;return!0}var At=[{match:["if:intersects","ref:width","ref:height"],gate:({sizeEntry:e})=>!e,added(e){let t=e.getBoundingClientRect(),n=[{blockSize:t.height,inlineSize:t.width}];e.sizeEntry={borderBoxSize:n,contentBoxSize:n,devicePixelContentBoxSize:n,contentRect:t,target:e}}},{gate:(e,t)=>e.hasAttribute(`on:attr:${t}`),addedAttr:me,removedAttr:me,changed:me},{match:[/^ref:/,/^link:/],added:k,removed:k,changed:k},{gate:(e,t)=>e.hasAttribute(`ref:${t}`),added:k,removed:k,changed:k},{match:["ref:width","ref:height"],added:e=>he.observe(e),destroyed:e=>he.unobserve(e)},{match:["ref:width","ref:height"],gate:fe,removed:e=>he.unobserve(e)},{match:/^ref:/,added:e=>I.add(e),destroyed:e=>I.delete(e)},{match:/^ref:/,gate:fe,removed:e=>I.delete(e)},{match:/^link:/,added:e=>_.add(e),destroyed:e=>_.delete(e)},{match:/^link:/,gate:fe,removed:e=>_.delete(e)},{match:"autofocus",added:mt},{match:"clear-timeout",added:e=>Y.add(e),removed:e=>Y.delete(e)},{match:"if",added:e=>J.add(e),removed:e=>J.delete(e)},{match:["if",/^if:/],added:A,removed:A,changed:A},{match:/^if:/,added:e=>z.add(e),destroyed:e=>z.delete(e)},{match:/^if:/,gate:fe,removed:e=>z.delete(e)},{match:"if:intersects",added:e=>ke.observe(e),removed:e=>ke.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:i}=e.sizeEntry.contentRect;e.isIntersecting=r>0&&n>0&&i<innerWidth&&t<innerHeight}},{match:"on",added:e=>X.add(e),removed:e=>X.delete(e)},{match:/^on:/,gate:(e,t)=>!Lt.has(t),added(e,t){Lt.add(t),document.addEventListener(t.slice(3),Rt(),!0)}},{match:"on:conceal",added:e=>Ae.observe(e),removed:e=>Ae.unobserve(e)},{match:"on:navigate",added:e=>j.add(e),removed:e=>j.delete(e)},{match:"on:reveal",added:e=>Te.observe(e),removed:e=>Te.unobserve(e)},{match:"on:discover",added:vt},{match:"render",added:e=>Z.add(e),removed:e=>Z.delete(e)},{match:"reset",added:e=>$.add(e),removed:e=>$.delete(e)},{match:"scroll",added:e=>K.add(e),removed:e=>K.delete(e)},{match:"sse",added:T.instance.addElement,removed:T.instance.deleteElement},{match:"sse",added:D,removed:D,changed:D},{match:Ne.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:D,removed:D,changed:D},{match:"value",gate:e=>!pn.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.append(e.getAttribute("name"),e.getAttribute("value"))}];var B=1,Ce=2,ve=4,Me=8,De=16,Oe=32,Pe=64,He=128,Ee=(e,t,n,r)=>{for(let i of At)ge.call(n,i.match)&&(!i.gate||i.gate(t,n,r))&&(e&B&&i.added?.(t,n,r),e&Ce&&i.addedAttr?.(t,n,r),e&ve&&i.removed?.(t,n,r),e&Me&&i.removedAttr?.(t,n,r),e&De&&i.changed?.(t,n,r),e&Oe&&i.created?.(t,n,r),e&Pe&&i.destroyed?.(t,n,r),e&He&&i.serialize?.(t,n,r))};var F=e=>e?.nodeType===Node.ELEMENT_NODE;var O=(e,t,n)=>{for(let r=0,i=t.length,o,a,u;r<i;++r)if(F(o=t[r])){a=document.createNodeIterator(o,NodeFilter.SHOW_ELEMENT);do for(u of o.attributes)Ee(e,o,u.name,n);while(o=a.nextNode())}};var kt=e=>e.tagName==="FORM";var be=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var mn=/<!--\s*keml\s*-->/i,hn={stream:!0},un=new TextDecoder,ye=class{responseType;ownerElement;url;onloadend;init={headers:{}};responseText="";open(t,n){this.init.method=t,this.url=n}setRequestHeader(t,n){this.init.headers[t]=n}set withCredentials(t){t&&(this.init.credentials="include")}async send(t){t&&(this.init.body=t);let{status:n,body:r}=await y.fetch(this.url,this.init);if(r){for await(let i of r){this.responseText+=un.decode(i,hn);let o;for(;o=mn.exec(this.responseText);)this.respond(this.responseText.slice(0,o.index),n),this.responseText=this.responseText.slice(o.index+o[0].length)}this.respond(this.responseText,n)}}respond(t,n){this.onloadend({target:{status:n,responseXML:ue(t),ownerElement:this.ownerElement}})}};var q=e=>e.timeoutId=clearTimeout(e.timeoutId);var Tt=document.createElement("form"),fn=Object.create(null),we=e=>{if(q(e),e.checkValidity?.()??!0){e.hasAttribute("once")&&st(e);let t=new FormData(kt(e)?e:(Tt.replaceChildren(e.cloneNode(!0)),Tt));O(He,[e],{formData:t});let n=e.getAttribute("redirect"),[r,i,o]=ee(e);if(y.location.ownerElement=e,n==="pushState"||n==="replaceState")be(r,t),y.history[n](fn,"",r),le();else if(n==="assign"||n==="replace")be(r,t),y.location[n](r);else if(r.protocol==="about:"&&r.pathname==="blank/")Q({target:{ownerElement:e,status:200,responseXML:null}});else{i==="GET"&&(t=be(r,t));let a=new(e.hasAttribute("stream")?ye:y.XMLHttpRequest);a.responseType="document",a.withCredentials=o,a.ownerElement=e,a.onloadend=Q,a.open(i,r),a.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:u,value:E}of e.attributes)u.startsWith("h-")&&a.setRequestHeader(u.slice(2),E);e.isError=!1,e.isLoading=!0,A(),a.send(t)}}};var Nt=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(we,+t.value,e):(t=e.getAttributeNode("debounce"))?(q(e),e.timeoutId=setTimeout(we,+t.value,e)):we(e)};var U=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function Ct(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var gn=[[X,"on",Nt],[$,"reset",it],[K,"scroll",lt],[Y,"clear-timeout",q]],Mt=e=>{let{target:t,type:n}=e;if(F(t)){let r=`on:${n}`,i=t,o;for(;i&&!(o=i.getAttributeNode(r));)i=i.parentElement;if(i&&o){let a=o.value;if((o=i.getAttributeNode(`event:${n}`))&&(y.console.ownerElement=i,i.hasAttribute("log")&&y.console.log(e),o.value.split(",").some(Ct,e)))return;e.preventDefault();for(let[u,E,b]of gn)for(i of u)U(a,i.getAttribute(E))&&b(i)}}};var Dt=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var Ot=e=>Object.prototype.toString.call(e)==="[object FileList]";var ze=(e,t,n=0)=>{for(let r=n,i=e.length,o,a=t.nodeName,u=t.getAttribute?.("key");r<i;++r)if(a===(o=e[r]).nodeName&&u==o.getAttribute?.("key"))return[o,r]};function Pt({name:e}){return this===e}var Ie=e=>e!=null;var vn=[["value",e=>e??""],["checked",Ie],["selected",Ie]],w=(e,t,n)=>{let r,i;typeof t=="string"?i=e.getAttributeNode(r=t):(i=t,r=t.name),i?n==null?e.removeAttributeNode(i):i.value!=n&&(i.value=n):n==null||e.setAttribute(r,n);for(let[o,a]of vn)if(r===o&&r in e){let u=a(n);e[r]==u||(e[r]=u)}};var Ht=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:i}=n,o=r.slice(2),a=t.find(Pt,o);r.startsWith("x-")?a?(w(e,n,a.value),w(e,a,i)):(w(e,n),w(e,"d-"+o,""),w(e,o,i)):r.startsWith("d-")&&(a&&(w(e,"x-"+o,a.value),w(e,a)),w(e,n))}},zt=e=>{e.hasAttribute("state")||(Ht(e),w(e,"state",""))},xe=e=>{let t=e.getAttributeNode("state");t&&(w(e,t),Ht(e))};var It=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),F(e)){xe(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||w(e,r);for(let{name:i,value:o}of t.attributes)w(e,i,o);Se.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},Se={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=ze(t,e),i,o;r?([i,o]=r,o&&e.before(...t.slice(0,o)),++o):(i=t[0],o=1),n>o&&e.after(...t.slice(o)),It(e,i)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,i=n.length,o=0,a,u;for(;o<r;++o)u=ze(n,a=t[o],o),u?(u[1]===o||e.insertBefore(u[0],n[o]),It(n[o],a)):o<i++?e.insertBefore(a,n[o]):e.appendChild(a);for(;i>r;)e.removeChild(n[--i])}};var _e=["borderBoxSize","contentBoxSize","devicePixelContentBoxSize","contentRect"],_t=(e,t)=>{if(t==="width"||t==="height"){let{sizeEntry:n}=e,r=e.getAttribute("measure"),i,o;return _e.includes(r)||(r=_e[0]),r===_e[3]?{width:i,height:o}=n[r]:{inlineSize:i,blockSize:o}=n[r][0],t==="width"?i:o}return t in e?e[t]:e.getAttribute(t)};var Be=!1,Fe=[],En=()=>{let e;for(;e=Fe.pop();)e[0](e[1],e[2])},bn=()=>{Be=!1},Bt=()=>{!Be&&Fe.length&&(Be=!0,document.startViewTransition(En).finished.finally(bn))},Ft=(e,t,n)=>!!document.startViewTransition&&t.hasAttribute("transition")&&Fe.push([e,t,n]);var qe=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let i=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=i/2|0:r==="end"&&(t[n]=i)}else t[n]=+r};var yn=[],qt=["auto","instant","smooth"],wn=new Event("result"),xn=new Event("failure"),Sn=new Event("discover"),Ut=new Map,Ue=()=>{let e,t,n,r,i,o,a,u,E,b,ne,M,W,V,N,L,P,R,G,C;for(;e=at();)e.reset?.();for(;e=ot();)w(e,"on");for(;i=rt();){({ownerElement:t,status:N,responseXML:r}=i.target),E=t.getAttribute((t.isError=N>399)?"error":"result"),M=[],n=void 0;for(e of Z)U(E,e.getAttribute("render"))&&M.push([e,r?Array.from((n?n.cloneNode(!0):n=r.body).childNodes):yn]);for(;ne=M.pop();)[e,V]=ne,W=Se[e.getAttribute("position")]??Se.replaceChildren,Ft(W,e,V)||W(e,V);t.isLoading=!1,A(),t.dispatchEvent(t.isError?xn:wn)}if(Bt(),ht()){ut(),b=[];for(e of z)!(e.checkValidity?.()??!0)&&(L=e.getAttributeNode("if:invalid"))&&b.push(L.value),(P=Dt(e))&&(!Ot(P)||P.length)&&(L=e.getAttributeNode("if:value"))&&b.push(L.value),e.isIntersecting&&(L=e.getAttributeNode("if:intersects"))&&b.push(L.value),e.isLoading&&(L=e.getAttributeNode("if:loading"))&&b.push(L.value),e.isError&&(L=e.getAttributeNode("if:error"))&&b.push(L.value);E=b.join(" ");for(e of J)U(E,e.getAttribute("if"))?zt(e):xe(e)}if(ft()){gt();for(e of _)for({name:o,value:u}of e.attributes)if(o.startsWith("link:")){o=o.slice(5);for(n of I)for({name:a,value:E}of n.attributes)a.startsWith("ref:")&&U(E,u)&&w(e,o,_t(n,a.slice(4)))}}for(;e=ct();)R={behavior:qt.includes(u=e.getAttribute("behavior"))?u:qt[0]},qe(e,R,"top"),qe(e,R,"left"),("top"in R||"left"in R)&&(e.hasAttribute("relative")?e.scrollBy(R):e.scroll(R));for(;e=Et();)e.dispatchEvent(Sn);for(;G=bt();)[e,o]=G,C=Ut.get(o),C||Ut.set(o,C=new Event("attr:"+o)),e.dispatchEvent(C);if(tt()&&(nt(),T.instance.start()),e=pt()){dt();try{N=e.value.length,e.focus(),e.setSelectionRange(N,N)}catch{}}requestAnimationFrame(Ue)};var Rn=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:i,target:o}of e)if(O(ve|Pe,i),O(B|Oe,t),n){let a=o.hasAttribute(n),u=r!=null,E;a&&!u&&(E=B|Ce),!a&&u&&(E=ve|Me),Ee(E??De,o,n)}},Wt=new MutationObserver(Rn);var We=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}St(Mt),O(B,document.childNodes),Wt.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",pe,!0),document.addEventListener("input",pe,!0),document.addEventListener("reset",pe,!0),y.window.addEventListener("popstate",le,!0),window.addEventListener("beforeunload",T.instance.stop,!0),requestAnimationFrame(Ue)};var Vt=Symbol.for("keml");window[Vt]||(window[Vt]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",We,!0):We());})();
