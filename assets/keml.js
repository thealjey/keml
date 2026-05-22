/*!
 * keml 3.5.4 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var m=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"reference-chart","reference-chart"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[3,"if-loading","if-loading"],[1,"if-error","if-error"],[4,"sse","sse"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"]];var u={credentials:`<small class="chip mt3">Ha!</small>

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
`};var U=new Set,j=new Set,_=new Set,X=new Set;var It=new Event("navigate"),Q=()=>{for(let e of U)e.dispatchEvent(It)};var y;{let e=new DOMParser,t=d=>{let s=[],l=0,c=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;s.push("let out = [];");let p;for(;p=c.exec(d);){let f=p[0],E=p.index;if(s.push(`out.push(${JSON.stringify(d.slice(l,E))});`),f.startsWith("{{"))s.push(f.slice(2,-2).trim());else{let g=f.slice(1,-1).trim();s.push(`out.push(String(${g}));`)}l=E+f.length}return s.push(`out.push(${JSON.stringify(d.slice(l))});`),s.push("return out.join('');"),new Function("server",s.join(`
`))},n=d=>{let s=Array.from({length:10},()=>Math.random()*81+10|0),l=new Array(d),c=p=>{if(p<0)return s[0]+(s[0]-s[1]);if(p>=s.length){let f=s.length;return s[f-1]+(s[f-1]-s[f-2])}return s[p]};for(let p=0;p<d;++p){let f=p/(d-1)*(s.length-1),E=Math.floor(f),g=f-E,S=c(E-1),V=c(E),he=c(E+1),He=c(E+2),Ot=.5*(2*V+(-S+he)*g+(2*S-5*V+4*he-He)*g*g+(-S+3*V-3*he+He)*g*g*g);l[p]=Ot}return l},r=(d,s)=>{if(s|=0,s<1)return[];let l=d.length;if(s===1)return[d[l/2|0]];if(s>l)return d;let c=new Array(s);for(let p=0,f;p<s;++p)f=p/(s-1),c[p]=d[Math.round(f*(l-1))];return c},o=(d,s=2)=>parseFloat(d.toFixed(s)),i=([d,s])=>d+'="'+s+'"',a=d=>Object.entries(d).map(i).join(" "),h=(d,s,l,c)=>{let p=s.length;return{path:a({d:s.reduce((f,E,g)=>(f[g]=`${g?"L":"M"} ${o(g/(p-1)*l)} ${o(c-E/100*c)}`,f),new Array(p)).join(" ")}),xTicks:Array.from({length:11},(f,E)=>{let g=o(E/10),S=o(g*l-1),V=a(E?{x:10-c,y:S+(E<10?4:0),transform:"rotate(-90)"}:{x:S+10,y:c-10});return{line:a({x1:S,y1:c,x2:S,y2:c-6}),text:V,label:(g*d.length).toLocaleString()}}),yTicks:Array.from({length:6},(f,E)=>{let g=E/5,S=o(c-g*c+1);return{line:a({x1:0,y1:S,x2:6,y2:S}),text:a({x:10,y:S+(!E||E>4?10:4)}),label:o(g*100)}}),xAxis:a({x1:0,y1:0,x2:0,y2:c}),yAxis:a({x1:0,y1:c,x2:l,y2:c})}},v=Object.fromEntries(Object.entries(u).map(([d,s])=>[d,t(s)])),b=m.map(([d,s,l])=>[d,new RegExp(s),v[l]]),C=1,q=2,N=4,x=n(1e7);class M{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;series=x;sampleSeries=r;generateChart=h;getParam(s){return this.data?this.data.get(s):this.url.searchParams.get(s)}get partial(){return this.render(C)[1]}onloadend(s){}open(s,l){this.method=s,this.url=l}setRequestHeader(s,l){this.headers.set(s,l)}render(s){for(let[l,c,p]of b)if(p&&c.test(this.url.href)&&(l&C)===((s??+this.headers.has("X-Requested-With"))&C))return[l,p(this)];return[0,""]}respond=()=>this.onloadend({target:this});send(s){this.data=s;let[l,c]=this.render();this.responseXML=e.parseFromString(c,"text/html"),l&q?setTimeout(this.respond,2e3):this.respond()}}let A=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],W=[[],[],[],[],[],[]];class O{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(s){this.url=typeof s=="string"?new URL(s):s;for(let[l,c,p]of b)if(p&&c.test(this.url.href)&&(l&N)===N){p(this);break}}addIntervalId(s){this.intervals.push(s)}timeSince(s){let l=Date.now()-s,c,p=-1,f,E,g;for(;++p<6;)c=A[p],g=W[p],E=c[2],f=l/E|0,l-=f*E,g[0]=(p>3&&f<10?"0":"")+f,g[1]=c[+(f===1)];return W}dispatchEvent(s,l){for(let c of this.listeners.get(s)??[])c({type:s,data:l})}addEventListener(s,l){this.listeners.getOrInsert(s,new Set).add(l)}removeEventListener(s,l){let c=this.listeners.get(s);c&&(c.delete(l),c.size||this.listeners.delete(s))}close(){this.listeners.clear();for(let s of this.intervals)clearInterval(s);this.intervals=[]}}let Dt=d=>{let s={},l=d,c=0;for(;++c<3&&l&&l!==Object.prototype;){for(let p of Object.getOwnPropertyNames(l))if(!(p in s)){try{if(d[p]===l[p])continue}catch{}try{s[p]=d[p]}catch{}}l=Object.getPrototypeOf(l)}return s};class Tt{constructor(s){this.el=s;let{children:[l,c,p]}=s,f=l.children;this.backBtn=f[0],this.forwardBtn=f[1],f[2].childNodes.length||f[2].appendChild(document.createTextNode("")),this.address=f[2].firstChild,this.viewport=c,this.consoleClear=p?.children[0]?.children[0],this.consoleOut=p?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=s,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let E=this.address.nodeValue?.trim();E&&(this.stack.push([new URL(E),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new M;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:s}})=>this.viewport.replaceChildren(...s?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(s){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",s?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(Z.ownerElement=this.el,Pe())}get url(){return this.stack[this.index]?.[0]}assign(s,l){++this.index,this.replace(s,l)}replace(s,l){this.stack.length=this.index+1,this.stack[this.index]=[s,l],this.render(l)}log(s){if(!this.consoleOut)return;let l=new WeakSet,c=document.createElement("p"),p=JSON.stringify(s,(E,g)=>{if(!(typeof g=="function"||typeof g>"u"))return typeof g=="object"&&g!==null?l.has(g)?void 0:(l.add(g),Dt(g)):g}),f=document.createTextNode(p);c.setAttribute("title",p),c.classList.add("mv0"),c.append(f),this.consoleOut.append(c),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let K=new Map,Oe=()=>{Array.from(document.getElementsByClassName("browser"),d=>K.has(d)||K.set(d,new Tt(d)))};Oe(),new MutationObserver(Oe).observe(document.body,{childList:!0,subtree:!0});let Z={ownerElement:{},get browser(){return K.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(d){this.browser?.assign(d,!0)},replace(d){this.browser?.replace(d,!0)}},Mt={pushState(d,s,l){Z.browser?.assign(l,!1)},replaceState(d,s,l){Z.browser?.replace(l,!1)}},Pe;y={XMLHttpRequest:M,EventSource:O,location:Z,history:Mt,window:{addEventListener(d,s){d==="popstate"&&(Pe=s)}},console:{ownerElement:{},get browser(){return K.get(this.ownerElement.closest(".browser"))},log(d){this.browser?.log(d)}}}}var Ie=[],Be=[],Fe=[],ze=[],qe=[],We=[],fe,ee=!1,te=!1,ge=!1,P=new Set,G=new Set,$=new Set,H=new Set,I=new Set,D=()=>ge=!0,Ve=()=>ge,Ue=()=>ge=!1,ne=e=>Ie.push(e),je=()=>Ie.pop(),_e=e=>Be.push(e),Xe=()=>Be.pop(),Ge=e=>Fe.push(e),$e=()=>Fe.pop(),Ye=e=>ze.push(e),Je=()=>ze.pop(),Ke=()=>fe=void 0,Ze=()=>fe,Qe=e=>fe=e,R=()=>ee=!0,et=()=>ee,tt=()=>ee=!1,L=()=>te=!0,re=()=>ee=te=!0,nt=()=>te,rt=()=>te=!1,st=e=>qe.push(e),ot=()=>qe.pop(),se=(e,t)=>We.push([e,t]),it=()=>We.pop();var Bt=new Event("conceal"),Ft=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(Bt)},ve=new IntersectionObserver(Ft);var zt=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;R()},Ee=new IntersectionObserver(zt);var qt=e=>{let t,n,r,o=!1;for(let i of e)({target:t,contentRect:{width:n,height:r}}=i),(n||r||t.offsetParent!=null)&&(t.sizeEntry=i,o=!0);o&&L()},oe=new ResizeObserver(qt);var Wt=new Event("reveal"),Vt=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(Wt)},be=new IntersectionObserver(Vt);var at={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},ye=Object.keys(at),Ut=/\/+$/,Y=e=>{let t=ye.find(e.hasAttribute,e),n=e.getAttributeNode("method"),r=t?e.getAttribute(t):"",o=at[t]??"GET";return n&&(o=n.value.toUpperCase()),r&&(r=r.replace(Ut,""),(!r||r.lastIndexOf(".")<=r.lastIndexOf("/"))&&(r+="/")),y.location.ownerElement=e,[new URL(r,y.location.href),o,!!e.hasAttribute("credentials")]};var J=class e extends Set{constructor(n,r,o,i){super();this.url=n;this.withCredentials=r;this.onMessage=o;for(let a of i)this.add(a)}url;withCredentials;onMessage;static parser=new DOMParser;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===y.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,e.parser.parseFromString(r,"text/html"));open(){this.source=new y.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,o=this.difference(n),i=n.difference(this);for(let a of o)super.delete(a),this.removeEventListener(a,this.handleMessage);for(let a of i)super.add(a);!r&&this.size?this.open():r&&!this.size&&this.close();for(let a of i)this.addEventListener(a,this.handleMessage)}};var k=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(ne))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,o)=>{let i;for(let a of this.elements){let[h,,v]=Y(a);this.getEvent(a)===r&&h.href===n.url.href&&v===n.withCredentials&&this.onPayload({target:{ownerElement:a,responseXML:i?i.cloneNode(!0):i=o,status:200}})}};start(){let n=new Map,r=new Map,o=new Set;for(let i of this.elements){let[a,,h]=Y(i),v=this.has(a.href)?n:r,b=v.get(a.href);b||v.set(a.href,b=[new Set,new Set,a]),b[+h].add(this.getEvent(i)),o.add(a.href)}for(let[i,[a,h]]of this)o.has(i)||(a.clear(),h.clear(),this.delete(i));for(let[i,[a,h]]of n){let[v,b]=this.get(i);v.reconcileWith(a),b.reconcileWith(h)}for(let[i,[a,h,v]]of r)this.set(i,[new J(v,!1,this.onMessage,a),new J(v,!0,this.onMessage,h)])}stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var lt=e=>Object.prototype.toString.call(e)==="[object RegExp]";var ct,dt=e=>ct=e,pt=()=>ct;var mt=new Set,jt=["INPUT","SELECT","TEXTAREA"];function ae(e){return!e||(typeof e=="string"?e===this:lt(e)?e.test(this):e.some(ae,this))}function ie({attributes:e}){for(let{name:t}of e)if(ae.call(t,this.match))return!1;return!0}var ut=[{match:["if:intersects","ref:width","ref:height"],gate:({sizeEntry:e})=>!e,added(e){let t=e.getBoundingClientRect(),n=[{blockSize:t.height,inlineSize:t.width}];e.sizeEntry={borderBoxSize:n,contentBoxSize:n,devicePixelContentBoxSize:n,contentRect:t,target:e}}},{gate:(e,t)=>e.hasAttribute(`on:attr:${t}`),addedAttr:se,removedAttr:se,changed:se},{match:[/^ref:/,/^link:/],added:L,removed:L,changed:L},{gate:(e,t)=>e.hasAttribute(`ref:${t}`),added:L,removed:L,changed:L},{match:["ref:width","ref:height"],added:e=>oe.observe(e),destroyed:e=>oe.unobserve(e)},{match:["ref:width","ref:height"],gate:ie,removed:e=>oe.unobserve(e)},{match:/^ref:/,added:e=>H.add(e),destroyed:e=>H.delete(e)},{match:/^ref:/,gate:ie,removed:e=>H.delete(e)},{match:/^link:/,added:e=>I.add(e),destroyed:e=>I.delete(e)},{match:/^link:/,gate:ie,removed:e=>I.delete(e)},{match:"autofocus",added:Qe},{match:"if",added:e=>G.add(e),removed:e=>G.delete(e)},{match:["if",/^if:/],added:R,removed:R,changed:R},{match:/^if:/,added:e=>P.add(e),destroyed:e=>P.delete(e)},{match:/^if:/,gate:ie,removed:e=>P.delete(e)},{match:"if:intersects",added:e=>Ee.observe(e),removed:e=>Ee.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:o}=e.sizeEntry.contentRect;e.isIntersecting=r>0&&n>0&&o<innerWidth&&t<innerHeight}},{match:"on",added:e=>j.add(e),removed:e=>j.delete(e)},{match:/^on:/,gate:(e,t)=>!mt.has(t),added(e,t){mt.add(t),document.addEventListener(t.slice(3),pt(),!0)}},{match:"on:conceal",added:e=>ve.observe(e),removed:e=>ve.unobserve(e)},{match:"on:navigate",added:e=>U.add(e),removed:e=>U.delete(e)},{match:"on:reveal",added:e=>be.observe(e),removed:e=>be.unobserve(e)},{match:"on:discover",added:st},{match:"render",added:e=>$.add(e),removed:e=>$.delete(e)},{match:"reset",added:e=>_.add(e),removed:e=>_.delete(e)},{match:"scroll",added:e=>X.add(e),removed:e=>X.delete(e)},{match:"sse",added:k.instance.addElement,removed:k.instance.deleteElement},{match:"sse",added:D,removed:D,changed:D},{match:ye.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:D,removed:D,changed:D},{match:"value",gate:e=>!jt.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.set(e.getAttribute("name"),e.getAttribute("value"))}];var B=1,we=2,le=4,xe=8,Se=16,Re=32,Ae=64,Le=128,ce=(e,t,n,r)=>{for(let o of ut)ae.call(n,o.match)&&(!o.gate||o.gate(t,n,r))&&(e&B&&o.added?.(t,n,r),e&we&&o.addedAttr?.(t,n,r),e&le&&o.removed?.(t,n,r),e&xe&&o.removedAttr?.(t,n,r),e&Se&&o.changed?.(t,n,r),e&Re&&o.created?.(t,n,r),e&Ae&&o.destroyed?.(t,n,r),e&Le&&o.serialize?.(t,n,r))};var F=e=>e?.nodeType===Node.ELEMENT_NODE;var T=(e,t,n)=>{for(let r=0,o=t.length,i,a,h;r<o;++r)if(F(i=t[r])){a=document.createNodeIterator(i,NodeFilter.SHOW_ELEMENT);do for(h of i.attributes)ce(e,i,h.name,n);while(i=a.nextNode())}};var ht=e=>e.tagName==="FORM";var de=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var ft=document.createElement("form"),_t=Object.create(null),pe=e=>{if(e.timeoutId=clearTimeout(e.timeoutId),e.checkValidity?.()??!0){e.hasAttribute("once")&&_e(e);let t=new FormData(ht(e)?e:(ft.replaceChildren(e.cloneNode(!0)),ft));T(Le,[e],{formData:t});let n=e.getAttribute("redirect"),[r,o,i]=Y(e);if(y.location.ownerElement=e,n==="pushState"||n==="replaceState")de(r,t),y.history[n](_t,"",r),Q();else if(n==="assign"||n==="replace")de(r,t),y.location[n](r);else{o==="GET"&&(t=de(r,t));let a=new y.XMLHttpRequest;a.responseType="document",a.withCredentials=i,a.ownerElement=e,a.onloadend=ne,a.open(o,r),a.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:h,value:v}of e.attributes)h.startsWith("h-")&&a.setRequestHeader(h.slice(2),v);e.isError=!1,e.isLoading=!0,R(),a.send(t)}}};var gt=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(pe,+t.value,e):(t=e.getAttributeNode("debounce"))?(clearTimeout(e.timeoutId),e.timeoutId=setTimeout(pe,+t.value,e)):pe(e)};var z=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function vt(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var Xt=[[j,"on",gt],[_,"reset",Ge],[X,"scroll",Ye]],Et=e=>{let{target:t,type:n}=e;if(F(t)){let r=`on:${n}`,o=t,i;for(;o&&!(i=o.getAttributeNode(r));)o=o.parentElement;if(o&&i){let a=i.value;if((i=o.getAttributeNode(`event:${n}`))&&(y.console.ownerElement=o,o.hasAttribute("log")&&y.console.log(e),i.value.split(",").some(vt,e)))return;e.preventDefault();for(let[h,v,b]of Xt)for(o of h)z(a,o.getAttribute(v))&&b(o)}}};var bt=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var yt=e=>Object.prototype.toString.call(e)==="[object FileList]";var ke=(e,t,n=0)=>{for(let r=n,o=e.length,i,a=t.nodeName,h=t.getAttribute?.("key");r<o;++r)if(a===(i=e[r]).nodeName&&h==i.getAttribute?.("key"))return[i,r]};function wt({name:e}){return this===e}var Ne=e=>e!=null;var Gt=[["value",e=>e??""],["checked",Ne],["selected",Ne]],w=(e,t,n)=>{let r,o;typeof t=="string"?o=e.getAttributeNode(r=t):(o=t,r=t.name),o?n==null?e.removeAttributeNode(o):o.value!=n&&(o.value=n):n==null||e.setAttribute(r,n);for(let[i,a]of Gt)if(r===i&&r in e){let h=a(n);e[r]==h||(e[r]=h)}};var xt=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:o}=n,i=r.slice(2),a=t.find(wt,i);r.startsWith("x-")?a?(w(e,n,a.value),w(e,a,o)):(w(e,n),w(e,"d-"+i,""),w(e,i,o)):r.startsWith("d-")&&(a&&(w(e,"x-"+i,a.value),w(e,a)),w(e,n))}},St=e=>{e.hasAttribute("state")||(xt(e),w(e,"state",""))},me=e=>{let t=e.getAttributeNode("state");t&&(w(e,t),xt(e))};var Rt=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),F(e)){me(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||w(e,r);for(let{name:o,value:i}of t.attributes)w(e,o,i);ue.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},ue={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=ke(t,e),o,i;r?([o,i]=r,i&&e.before(...t.slice(0,i)),++i):(o=t[0],i=1),n>i&&e.after(...t.slice(i)),Rt(e,o)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,o=n.length,i=0,a,h;for(;i<r;++i)h=ke(n,a=t[i],i),h?(h[1]===i||e.insertBefore(h[0],n[i]),Rt(n[i],a)):i<o++?e.insertBefore(a,n[i]):e.appendChild(a);for(;o>r;)e.removeChild(n[--o])}};var Ce=["borderBoxSize","contentBoxSize","devicePixelContentBoxSize","contentRect"],At=(e,t)=>{if(t==="width"||t==="height"){let{sizeEntry:n}=e,r=e.getAttribute("measure"),o,i;return Ce.includes(r)||(r=Ce[0]),r===Ce[3]?{width:o,height:i}=n[r]:{inlineSize:o,blockSize:i}=n[r][0],t==="width"?o:i}return t in e?e[t]:e.getAttribute(t)};var De=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let o=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=o/2|0:r==="end"&&(t[n]=o)}else t[n]=+r};var $t=[],Lt=["auto","instant","smooth"],Yt=new Event("result"),Jt=new Event("failure"),Kt=new Event("discover"),kt=new Map,Te=()=>{let e,t,n,r,o,i,a,h,v,b,C,q,N,x,M,A,W,O;for(;e=$e();)e.reset?.();for(;e=Xe();)w(e,"on");for(;o=je();){({ownerElement:t,status:N,responseXML:r}=o.target),v=t.getAttribute((t.isError=N>399)?"error":"result"),q=[],n=void 0;for(e of $)z(v,e.getAttribute("render"))&&q.push([e,r?Array.from((n?n.cloneNode(!0):n=r.body).childNodes):$t]);for(;C=q.pop();)(ue[C[0].getAttribute("position")]??ue.replaceChildren)(...C);t.isLoading=!1,R(),t.dispatchEvent(t.isError?Jt:Yt)}if(et()){tt(),b=[];for(e of P)!(e.checkValidity?.()??!0)&&(x=e.getAttributeNode("if:invalid"))&&b.push(x.value),(M=bt(e))&&(!yt(M)||M.length)&&(x=e.getAttributeNode("if:value"))&&b.push(x.value),e.isIntersecting&&(x=e.getAttributeNode("if:intersects"))&&b.push(x.value),e.isLoading&&(x=e.getAttributeNode("if:loading"))&&b.push(x.value),e.isError&&(x=e.getAttributeNode("if:error"))&&b.push(x.value);v=b.join(" ");for(e of G)z(v,e.getAttribute("if"))?St(e):me(e)}if(nt()){rt();for(e of I)for({name:i,value:h}of e.attributes)if(i.startsWith("link:")){i=i.slice(5);for(n of H)for({name:a,value:v}of n.attributes)a.startsWith("ref:")&&z(v,h)&&w(e,i,At(n,a.slice(4)))}}for(;e=Je();)A={behavior:Lt.includes(h=e.getAttribute("behavior"))?h:Lt[0]},De(e,A,"top"),De(e,A,"left"),("top"in A||"left"in A)&&(e.hasAttribute("relative")?e.scrollBy(A):e.scroll(A));for(;e=ot();)e.dispatchEvent(Kt);for(;W=it();)[e,i]=W,O=kt.get(i),O||kt.set(i,O=new Event("attr:"+i)),e.dispatchEvent(O);if(Ve()&&(Ue(),k.instance.start()),e=Ze()){Ke();try{N=e.value.length,e.focus(),e.setSelectionRange(N,N)}catch{}}requestAnimationFrame(Te)};var Zt=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:o,target:i}of e)if(T(le|Ae,o),T(B|Re,t),n){let a=i.hasAttribute(n),h=r!=null,v;a&&!h&&(v=B|we),!a&&h&&(v=le|xe),ce(v??Se,i,n)}},Nt=new MutationObserver(Zt);var Me=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}dt(Et),T(B,document.childNodes),Nt.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",re,!0),document.addEventListener("input",re,!0),document.addEventListener("reset",re,!0),y.window.addEventListener("popstate",Q,!0),window.addEventListener("beforeunload",k.instance.stop,!0),requestAnimationFrame(Te)};var Ct=Symbol.for("keml");window[Ct]||(window[Ct]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Me,!0):Me());})();
