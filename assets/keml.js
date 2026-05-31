/*!
 * keml 3.7.0 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var m=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"reference-chart","reference-chart"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[3,"if-loading","if-loading"],[1,"if-error","if-error"],[4,"sse","sse"],[8,"stream","stream"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"],[0,"https://www.transition-example.com/page-a","transition-home"],[1,"https://www.transition-example.com/page-a","transition-a"],[1,"https://www.transition-example.com/page-b","transition-b"],[1,"https://www.transition-example.com/page-c","transition-c"]];var h={credentials:`<small class="chip mt3">Ha!</small>

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
`,"if-loading":"",key:`<div
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
  class="w3 h3 bg-{ colors[Math.random() * colors.length | 0] }"
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
`};var j=new Set,X=new Set,G=new Set,$=new Set;var jt=new Event("navigate"),se=()=>{for(let e of j)e.dispatchEvent(jt)};var y;{let e=new DOMParser,t=c=>{let o=[],l=0,p=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;o.push("let out = [];");let d;for(;d=p.exec(c);){let f=d[0],v=d.index;if(o.push(`out.push(${JSON.stringify(c.slice(l,v))});`),f.startsWith("{{"))o.push(f.slice(2,-2).trim());else{let g=f.slice(1,-1).trim();o.push(`out.push(String(${g}));`)}l=v+f.length}return o.push(`out.push(${JSON.stringify(c.slice(l))});`),o.push("return out.join('');"),new Function("server",o.join(`
`))},n=c=>{let o=Array.from({length:10},()=>Math.random()*81+10|0),l=new Array(c),p=d=>{if(d<0)return o[0]+(o[0]-o[1]);if(d>=o.length){let f=o.length;return o[f-1]+(o[f-1]-o[f-2])}return o[d]};for(let d=0;d<c;++d){let f=d/(c-1)*(o.length-1),v=Math.floor(f),g=f-v,x=p(v-1),S=p(v),H=p(v+1),ne=p(v+2),re=.5*(2*S+(-x+H)*g+(2*x-5*S+4*H-ne)*g*g+(-x+3*S-3*H+ne)*g*g*g);l[d]=re}return l},r=(c,o)=>{if(o|=0,o<1)return[];let l=c.length;if(o===1)return[c[l/2|0]];if(o>l)return c;let p=new Array(o);for(let d=0,f;d<o;++d)f=d/(o-1),p[d]=c[Math.round(f*(l-1))];return p},i=(c,o=2)=>parseFloat(c.toFixed(o)),s=([c,o])=>c+'="'+o+'"',a=c=>Object.entries(c).map(s).join(" "),u=(c,o,l,p)=>{let d=o.length;return{path:a({d:o.reduce((f,v,g)=>(f[g]=`${g?"L":"M"} ${i(g/(d-1)*l)} ${i(p-v/100*p)}`,f),new Array(d)).join(" ")}),xTicks:Array.from({length:11},(f,v)=>{let g=i(v/10),x=i(g*l-1),S=a(v?{x:10-p,y:x+(v<10?4:0),transform:"rotate(-90)"}:{x:x+10,y:p-10});return{line:a({x1:x,y1:p,x2:x,y2:p-6}),text:S,label:(g*c.length).toLocaleString()}}),yTicks:Array.from({length:6},(f,v)=>{let g=v/5,x=i(p-g*p+1);return{line:a({x1:0,y1:x,x2:6,y2:x}),text:a({x:10,y:x+(!v||v>4?10:4)}),label:i(g*100)}}),xAxis:a({x1:0,y1:0,x2:0,y2:p}),yAxis:a({x1:0,y1:p,x2:l,y2:p})}},E=Object.fromEntries(Object.entries(h).map(([c,o])=>[c,t(o)])),b=m.map(([c,o,l])=>[c,new RegExp(o),E[l]]),O=1,V=2,W=4,P=8,N=n(1e7);class R{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;series=N;sampleSeries=r;generateChart=u;getParam(o){return this.data?this.data.get(o):this.url.searchParams.get(o)}get partial(){return this.render(O)[1]}onloadend(o){}open(o,l){this.method=o,this.url=l}setRequestHeader(o,l){this.headers.set(o,l)}render(o){for(let[l,p,d]of b)if(d&&p.test(this.url.href)&&(l&O)===((o??+this.headers.has("X-Requested-With"))&O))return[l,d(this)];return[0,""]}respond=()=>this.onloadend({target:this});send(o){this.data=o;let[l,p]=this.render();this.responseXML=e.parseFromString(p,"text/html"),l&V?setTimeout(this.respond,2e3):this.respond()}}let _=new TextEncoder,L=async(c,o={})=>{let l,p=new ReadableStream({start(S){l=S}}),{headers:d,credentials:f,method:v,body:g}=o,x={headers:d?Array.isArray(d)?new Map(d):d instanceof Headers?d:new Map(Object.entries(d)):new Map,withCredentials:f!=="omit",method:v,url:typeof c=="string"?new URL(c):c instanceof Request?new URL(c.url):c,data:g,status:200,getParam(S){return this.data?this.data.get(S):this.url.searchParams.get(S)},write(S){l.enqueue(_.encode(S))},end(){l.close()},get partial(){return this.render(P)[1]},render(S){for(let[H,ne,re]of b)if(re&&ne.test(this.url.href)&&(S??H)&P)return[H,re(this)];return[0,""]}};return x.write(x.render()[1]),new Response(p)},Q=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],C=[[],[],[],[],[],[]];class qt{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(o){this.url=typeof o=="string"?new URL(o):o;for(let[l,p,d]of b)if(d&&p.test(this.url.href)&&l&W){d(this);break}}addIntervalId(o){this.intervals.push(o)}timeSince(o){let l=Date.now()-o,p,d=-1,f,v,g;for(;++d<6;)p=Q[d],g=C[d],v=p[2],f=l/v|0,l-=f*v,g[0]=(d>3&&f<10?"0":"")+f,g[1]=p[+(f===1)];return C}dispatchEvent(o,l){for(let p of this.listeners.get(o)??[])p({type:o,data:l})}addEventListener(o,l){this.listeners.getOrInsert(o,new Set).add(l)}removeEventListener(o,l){let p=this.listeners.get(o);p&&(p.delete(l),p.size||this.listeners.delete(o))}close(){this.listeners.clear();for(let o of this.intervals)clearInterval(o);this.intervals=[]}}let zt=c=>{let o={},l=c,p=0;for(;++p<3&&l&&l!==Object.prototype;){for(let d of Object.getOwnPropertyNames(l))if(!(d in o)){try{if(c[d]===l[d])continue}catch{}try{o[d]=c[d]}catch{}}l=Object.getPrototypeOf(l)}return o};class Ut{constructor(o){this.el=o;let{children:[l,p,d]}=o,f=l.children;this.backBtn=f[0],this.forwardBtn=f[1],f[2].childNodes.length||f[2].appendChild(document.createTextNode("")),this.address=f[2].firstChild,this.viewport=p,this.consoleClear=d?.children[0]?.children[0],this.consoleOut=d?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=o,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let v=this.address.nodeValue?.trim();v&&(this.stack.push([new URL(v),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new R;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:o}})=>this.viewport.replaceChildren(...o?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(o){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",o?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(te.ownerElement=this.el,Ve())}get url(){return this.stack[this.index]?.[0]}assign(o,l){++this.index,this.replace(o,l)}replace(o,l){this.stack.length=this.index+1,this.stack[this.index]=[o,l],this.render(l)}log(o){if(!this.consoleOut)return;let l=new WeakSet,p=document.createElement("p"),d=JSON.stringify(o,(v,g)=>{if(!(typeof g=="function"||typeof g>"u"))return typeof g=="object"&&g!==null?l.has(g)?void 0:(l.add(g),zt(g)):g}),f=document.createTextNode(d);p.setAttribute("title",d),p.classList.add("mv0"),p.append(f),this.consoleOut.append(p),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let ee=new Map,Ue=()=>{Array.from(document.getElementsByClassName("browser"),c=>ee.has(c)||ee.set(c,new Ut(c)))};Ue(),new MutationObserver(Ue).observe(document.body,{childList:!0,subtree:!0});let te={ownerElement:{},get browser(){return ee.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(c){this.browser?.assign(c,!0)},replace(c){this.browser?.replace(c,!0)}},Vt={pushState(c,o,l){te.browser?.assign(l,!1)},replaceState(c,o,l){te.browser?.replace(l,!1)}},Ve;y={XMLHttpRequest:R,EventSource:qt,location:te,history:Vt,window:{addEventListener(c,o){c==="popstate"&&(Ve=o)}},console:{ownerElement:{},get browser(){return ee.get(this.ownerElement.closest(".browser"))},log(c){this.browser?.log(c)}},fetch:L}}var We=[],_e=[],je=[],Xe=[],Ge=[],$e=[],we,oe=!1,ie=!1,xe=!1,I=new Set,K=new Set,Y=new Set,B=new Set,F=new Set,M=()=>xe=!0,Ke=()=>xe,Ye=()=>xe=!1,ae=e=>We.push(e),Je=()=>We.pop(),Ze=e=>_e.push(e),Qe=()=>_e.pop(),et=e=>je.push(e),tt=()=>je.pop(),nt=e=>Xe.push(e),rt=()=>Xe.pop(),st=()=>we=void 0,ot=()=>we,it=e=>we=e,A=()=>oe=!0,at=()=>oe,lt=()=>oe=!1,k=()=>ie=!0,le=()=>oe=ie=!0,ct=()=>ie,dt=()=>ie=!1,pt=e=>Ge.push(e),mt=()=>Ge.pop(),ce=(e,t)=>$e.push([e,t]),ht=()=>$e.pop();var Xt=new Event("conceal"),Gt=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(Xt)},Se=new IntersectionObserver(Gt);var $t=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;A()},Re=new IntersectionObserver($t);var Kt=e=>{let t,n,r,i=!1;for(let s of e)({target:t,contentRect:{width:n,height:r}}=s),(n||r||t.offsetParent!=null)&&(t.sizeEntry=s,i=!0);i&&k()},de=new ResizeObserver(Kt);var Yt=new Event("reveal"),Jt=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(Yt)},Ae=new IntersectionObserver(Jt);var ut={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},Le=Object.keys(ut),Zt=/\/+$/,J=e=>{let t=Le.find(e.hasAttribute,e),n=e.getAttributeNode("method"),r=t?e.getAttribute(t):"",i=ut[t]??"GET";return n&&(i=n.value.toUpperCase()),r&&(r=r.replace(Zt,""),(!r||r.lastIndexOf(".")<=r.lastIndexOf("/"))&&(r+="/")),y.location.ownerElement=e,[new URL(r,y.location.href),i,!!e.hasAttribute("credentials")]};var Qt=new DOMParser,pe=e=>Qt.parseFromString(e,"text/html");var Z=class extends Set{constructor(n,r,i,s){super();this.url=n;this.withCredentials=r;this.onMessage=i;for(let a of s)this.add(a)}url;withCredentials;onMessage;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===y.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,pe(r));open(){this.source=new y.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,i=this.difference(n),s=n.difference(this);for(let a of i)super.delete(a),this.removeEventListener(a,this.handleMessage);for(let a of s)super.add(a);!r&&this.size?this.open():r&&!this.size&&this.close();for(let a of s)this.addEventListener(a,this.handleMessage)}};var T=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(ae))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,i)=>{let s;for(let a of this.elements){let[u,,E]=J(a);this.getEvent(a)===r&&u.href===n.url.href&&E===n.withCredentials&&this.onPayload({target:{ownerElement:a,responseXML:s?s.cloneNode(!0):s=i,status:200}})}};start(){let n=new Map,r=new Map,i=new Set;for(let s of this.elements){let[a,,u]=J(s),E=this.has(a.href)?n:r,b=E.get(a.href);b||E.set(a.href,b=[new Set,new Set,a]),b[+u].add(this.getEvent(s)),i.add(a.href)}for(let[s,[a,u]]of this)i.has(s)||(a.clear(),u.clear(),this.delete(s));for(let[s,[a,u]]of n){let[E,b]=this.get(s);E.reconcileWith(a),b.reconcileWith(u)}for(let[s,[a,u,E]]of r)this.set(s,[new Z(E,!1,this.onMessage,a),new Z(E,!0,this.onMessage,u)])}stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var ft=e=>Object.prototype.toString.call(e)==="[object RegExp]";var gt,vt=e=>gt=e,Et=()=>gt;var bt=new Set,en=["INPUT","SELECT","TEXTAREA"];function he(e){return!e||(typeof e=="string"?e===this:ft(e)?e.test(this):e.some(he,this))}function me({attributes:e}){for(let{name:t}of e)if(he.call(t,this.match))return!1;return!0}var yt=[{match:["if:intersects","ref:width","ref:height"],gate:({sizeEntry:e})=>!e,added(e){let t=e.getBoundingClientRect(),n=[{blockSize:t.height,inlineSize:t.width}];e.sizeEntry={borderBoxSize:n,contentBoxSize:n,devicePixelContentBoxSize:n,contentRect:t,target:e}}},{gate:(e,t)=>e.hasAttribute(`on:attr:${t}`),addedAttr:ce,removedAttr:ce,changed:ce},{match:[/^ref:/,/^link:/],added:k,removed:k,changed:k},{gate:(e,t)=>e.hasAttribute(`ref:${t}`),added:k,removed:k,changed:k},{match:["ref:width","ref:height"],added:e=>de.observe(e),destroyed:e=>de.unobserve(e)},{match:["ref:width","ref:height"],gate:me,removed:e=>de.unobserve(e)},{match:/^ref:/,added:e=>B.add(e),destroyed:e=>B.delete(e)},{match:/^ref:/,gate:me,removed:e=>B.delete(e)},{match:/^link:/,added:e=>F.add(e),destroyed:e=>F.delete(e)},{match:/^link:/,gate:me,removed:e=>F.delete(e)},{match:"autofocus",added:it},{match:"if",added:e=>K.add(e),removed:e=>K.delete(e)},{match:["if",/^if:/],added:A,removed:A,changed:A},{match:/^if:/,added:e=>I.add(e),destroyed:e=>I.delete(e)},{match:/^if:/,gate:me,removed:e=>I.delete(e)},{match:"if:intersects",added:e=>Re.observe(e),removed:e=>Re.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:i}=e.sizeEntry.contentRect;e.isIntersecting=r>0&&n>0&&i<innerWidth&&t<innerHeight}},{match:"on",added:e=>X.add(e),removed:e=>X.delete(e)},{match:/^on:/,gate:(e,t)=>!bt.has(t),added(e,t){bt.add(t),document.addEventListener(t.slice(3),Et(),!0)}},{match:"on:conceal",added:e=>Se.observe(e),removed:e=>Se.unobserve(e)},{match:"on:navigate",added:e=>j.add(e),removed:e=>j.delete(e)},{match:"on:reveal",added:e=>Ae.observe(e),removed:e=>Ae.unobserve(e)},{match:"on:discover",added:pt},{match:"render",added:e=>Y.add(e),removed:e=>Y.delete(e)},{match:"reset",added:e=>G.add(e),removed:e=>G.delete(e)},{match:"scroll",added:e=>$.add(e),removed:e=>$.delete(e)},{match:"sse",added:T.instance.addElement,removed:T.instance.deleteElement},{match:"sse",added:M,removed:M,changed:M},{match:Le.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:M,removed:M,changed:M},{match:"value",gate:e=>!en.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.set(e.getAttribute("name"),e.getAttribute("value"))}];var q=1,ke=2,ue=4,Te=8,Ne=16,Ce=32,Me=64,De=128,fe=(e,t,n,r)=>{for(let i of yt)he.call(n,i.match)&&(!i.gate||i.gate(t,n,r))&&(e&q&&i.added?.(t,n,r),e&ke&&i.addedAttr?.(t,n,r),e&ue&&i.removed?.(t,n,r),e&Te&&i.removedAttr?.(t,n,r),e&Ne&&i.changed?.(t,n,r),e&Ce&&i.created?.(t,n,r),e&Me&&i.destroyed?.(t,n,r),e&De&&i.serialize?.(t,n,r))};var z=e=>e?.nodeType===Node.ELEMENT_NODE;var D=(e,t,n)=>{for(let r=0,i=t.length,s,a,u;r<i;++r)if(z(s=t[r])){a=document.createNodeIterator(s,NodeFilter.SHOW_ELEMENT);do for(u of s.attributes)fe(e,s,u.name,n);while(s=a.nextNode())}};var wt=e=>e.tagName==="FORM";var ge=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var tn=/<!--\s*keml\s*-->/i,nn={stream:!0},rn=new TextDecoder,ve=class{responseType;ownerElement;url;onloadend;init={headers:{}};responseText="";open(t,n){this.init.method=t,this.url=n}setRequestHeader(t,n){this.init.headers[t]=n}set withCredentials(t){t&&(this.init.credentials="include")}async send(t){t&&(this.init.body=t);let{status:n,body:r}=await y.fetch(this.url,this.init);if(r){for await(let i of r){this.responseText+=rn.decode(i,nn);let s;for(;s=tn.exec(this.responseText);)this.respond(this.responseText.slice(0,s.index),n),this.responseText=this.responseText.slice(s.index+s[0].length)}this.respond(this.responseText,n)}}respond(t,n){this.onloadend({target:{status:n,responseXML:pe(t),ownerElement:this.ownerElement}})}};var xt=document.createElement("form"),sn=Object.create(null),Ee=e=>{if(e.timeoutId=clearTimeout(e.timeoutId),e.checkValidity?.()??!0){e.hasAttribute("once")&&Ze(e);let t=new FormData(wt(e)?e:(xt.replaceChildren(e.cloneNode(!0)),xt));D(De,[e],{formData:t});let n=e.getAttribute("redirect"),[r,i,s]=J(e);if(y.location.ownerElement=e,n==="pushState"||n==="replaceState")ge(r,t),y.history[n](sn,"",r),se();else if(n==="assign"||n==="replace")ge(r,t),y.location[n](r);else{i==="GET"&&(t=ge(r,t));let a=new(e.hasAttribute("stream")?ve:y.XMLHttpRequest);a.responseType="document",a.withCredentials=s,a.ownerElement=e,a.onloadend=ae,a.open(i,r),a.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:u,value:E}of e.attributes)u.startsWith("h-")&&a.setRequestHeader(u.slice(2),E);e.isError=!1,e.isLoading=!0,A(),a.send(t)}}};var St=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(Ee,+t.value,e):(t=e.getAttributeNode("debounce"))?(clearTimeout(e.timeoutId),e.timeoutId=setTimeout(Ee,+t.value,e)):Ee(e)};var U=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function Rt(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var on=[[X,"on",St],[G,"reset",et],[$,"scroll",nt]],At=e=>{let{target:t,type:n}=e;if(z(t)){let r=`on:${n}`,i=t,s;for(;i&&!(s=i.getAttributeNode(r));)i=i.parentElement;if(i&&s){let a=s.value;if((s=i.getAttributeNode(`event:${n}`))&&(y.console.ownerElement=i,i.hasAttribute("log")&&y.console.log(e),s.value.split(",").some(Rt,e)))return;e.preventDefault();for(let[u,E,b]of on)for(i of u)U(a,i.getAttribute(E))&&b(i)}}};var Lt=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var kt=e=>Object.prototype.toString.call(e)==="[object FileList]";var Oe=(e,t,n=0)=>{for(let r=n,i=e.length,s,a=t.nodeName,u=t.getAttribute?.("key");r<i;++r)if(a===(s=e[r]).nodeName&&u==s.getAttribute?.("key"))return[s,r]};function Tt({name:e}){return this===e}var Pe=e=>e!=null;var an=[["value",e=>e??""],["checked",Pe],["selected",Pe]],w=(e,t,n)=>{let r,i;typeof t=="string"?i=e.getAttributeNode(r=t):(i=t,r=t.name),i?n==null?e.removeAttributeNode(i):i.value!=n&&(i.value=n):n==null||e.setAttribute(r,n);for(let[s,a]of an)if(r===s&&r in e){let u=a(n);e[r]==u||(e[r]=u)}};var Nt=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:i}=n,s=r.slice(2),a=t.find(Tt,s);r.startsWith("x-")?a?(w(e,n,a.value),w(e,a,i)):(w(e,n),w(e,"d-"+s,""),w(e,s,i)):r.startsWith("d-")&&(a&&(w(e,"x-"+s,a.value),w(e,a)),w(e,n))}},Ct=e=>{e.hasAttribute("state")||(Nt(e),w(e,"state",""))},be=e=>{let t=e.getAttributeNode("state");t&&(w(e,t),Nt(e))};var Mt=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),z(e)){be(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||w(e,r);for(let{name:i,value:s}of t.attributes)w(e,i,s);ye.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},ye={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=Oe(t,e),i,s;r?([i,s]=r,s&&e.before(...t.slice(0,s)),++s):(i=t[0],s=1),n>s&&e.after(...t.slice(s)),Mt(e,i)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,i=n.length,s=0,a,u;for(;s<r;++s)u=Oe(n,a=t[s],s),u?(u[1]===s||e.insertBefore(u[0],n[s]),Mt(n[s],a)):s<i++?e.insertBefore(a,n[s]):e.appendChild(a);for(;i>r;)e.removeChild(n[--i])}};var He=["borderBoxSize","contentBoxSize","devicePixelContentBoxSize","contentRect"],Dt=(e,t)=>{if(t==="width"||t==="height"){let{sizeEntry:n}=e,r=e.getAttribute("measure"),i,s;return He.includes(r)||(r=He[0]),r===He[3]?{width:i,height:s}=n[r]:{inlineSize:i,blockSize:s}=n[r][0],t==="width"?i:s}return t in e?e[t]:e.getAttribute(t)};var Ie=!1,Be=[],ln=()=>{let e;for(;e=Be.pop();)e[0](e[1],e[2])},cn=()=>{Ie=!1},Ot=()=>{!Ie&&Be.length&&(Ie=!0,document.startViewTransition(ln).finished.finally(cn))},Pt=(e,t,n)=>!!document.startViewTransition&&t.hasAttribute("transition")&&Be.push([e,t,n]);var Fe=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let i=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=i/2|0:r==="end"&&(t[n]=i)}else t[n]=+r};var dn=[],Ht=["auto","instant","smooth"],pn=new Event("result"),mn=new Event("failure"),hn=new Event("discover"),It=new Map,qe=()=>{let e,t,n,r,i,s,a,u,E,b,O,V,W,P,N,R,_,L,Q,C;for(;e=tt();)e.reset?.();for(;e=Qe();)w(e,"on");for(;i=Je();){({ownerElement:t,status:N,responseXML:r}=i.target),E=t.getAttribute((t.isError=N>399)?"error":"result"),V=[],n=void 0;for(e of Y)U(E,e.getAttribute("render"))&&V.push([e,r?Array.from((n?n.cloneNode(!0):n=r.body).childNodes):dn]);for(;O=V.pop();)[e,P]=O,W=ye[e.getAttribute("position")]??ye.replaceChildren,Pt(W,e,P)||W(e,P);t.isLoading=!1,A(),t.dispatchEvent(t.isError?mn:pn)}if(Ot(),at()){lt(),b=[];for(e of I)!(e.checkValidity?.()??!0)&&(R=e.getAttributeNode("if:invalid"))&&b.push(R.value),(_=Lt(e))&&(!kt(_)||_.length)&&(R=e.getAttributeNode("if:value"))&&b.push(R.value),e.isIntersecting&&(R=e.getAttributeNode("if:intersects"))&&b.push(R.value),e.isLoading&&(R=e.getAttributeNode("if:loading"))&&b.push(R.value),e.isError&&(R=e.getAttributeNode("if:error"))&&b.push(R.value);E=b.join(" ");for(e of K)U(E,e.getAttribute("if"))?Ct(e):be(e)}if(ct()){dt();for(e of F)for({name:s,value:u}of e.attributes)if(s.startsWith("link:")){s=s.slice(5);for(n of B)for({name:a,value:E}of n.attributes)a.startsWith("ref:")&&U(E,u)&&w(e,s,Dt(n,a.slice(4)))}}for(;e=rt();)L={behavior:Ht.includes(u=e.getAttribute("behavior"))?u:Ht[0]},Fe(e,L,"top"),Fe(e,L,"left"),("top"in L||"left"in L)&&(e.hasAttribute("relative")?e.scrollBy(L):e.scroll(L));for(;e=mt();)e.dispatchEvent(hn);for(;Q=ht();)[e,s]=Q,C=It.get(s),C||It.set(s,C=new Event("attr:"+s)),e.dispatchEvent(C);if(Ke()&&(Ye(),T.instance.start()),e=ot()){st();try{N=e.value.length,e.focus(),e.setSelectionRange(N,N)}catch{}}requestAnimationFrame(qe)};var un=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:i,target:s}of e)if(D(ue|Me,i),D(q|Ce,t),n){let a=s.hasAttribute(n),u=r!=null,E;a&&!u&&(E=q|ke),!a&&u&&(E=ue|Te),fe(E??Ne,s,n)}},Bt=new MutationObserver(un);var ze=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}vt(At),D(q,document.childNodes),Bt.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",le,!0),document.addEventListener("input",le,!0),document.addEventListener("reset",le,!0),y.window.addEventListener("popstate",se,!0),window.addEventListener("beforeunload",T.instance.stop,!0),requestAnimationFrame(qe)};var Ft=Symbol.for("keml");window[Ft]||(window[Ft]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ze,!0):ze());})();
