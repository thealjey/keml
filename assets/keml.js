/*!
 * keml 3.6.0 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var m=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"reference-chart","reference-chart"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[3,"if-loading","if-loading"],[1,"if-error","if-error"],[4,"sse","sse"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"],[0,"https://www.transition-example.com/page-a","transition-home"],[1,"https://www.transition-example.com/page-a","transition-a"],[1,"https://www.transition-example.com/page-b","transition-b"],[1,"https://www.transition-example.com/page-c","transition-c"]];var h={credentials:`<small class="chip mt3">Ha!</small>

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
`};var _=new Set,j=new Set,X=new Set,G=new Set;var qt=new Event("navigate"),te=()=>{for(let e of _)e.dispatchEvent(qt)};var y;{let e=new DOMParser,t=d=>{let s=[],l=0,c=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;s.push("let out = [];");let p;for(;p=c.exec(d);){let f=p[0],E=p.index;if(s.push(`out.push(${JSON.stringify(d.slice(l,E))});`),f.startsWith("{{"))s.push(f.slice(2,-2).trim());else{let g=f.slice(1,-1).trim();s.push(`out.push(String(${g}));`)}l=E+f.length}return s.push(`out.push(${JSON.stringify(d.slice(l))});`),s.push("return out.join('');"),new Function("server",s.join(`
`))},n=d=>{let s=Array.from({length:10},()=>Math.random()*81+10|0),l=new Array(d),c=p=>{if(p<0)return s[0]+(s[0]-s[1]);if(p>=s.length){let f=s.length;return s[f-1]+(s[f-1]-s[f-2])}return s[p]};for(let p=0;p<d;++p){let f=p/(d-1)*(s.length-1),E=Math.floor(f),g=f-E,S=c(E-1),U=c(E),ge=c(E+1),ze=c(E+2),Bt=.5*(2*U+(-S+ge)*g+(2*S-5*U+4*ge-ze)*g*g+(-S+3*U-3*ge+ze)*g*g*g);l[p]=Bt}return l},r=(d,s)=>{if(s|=0,s<1)return[];let l=d.length;if(s===1)return[d[l/2|0]];if(s>l)return d;let c=new Array(s);for(let p=0,f;p<s;++p)f=p/(s-1),c[p]=d[Math.round(f*(l-1))];return c},o=(d,s=2)=>parseFloat(d.toFixed(s)),i=([d,s])=>d+'="'+s+'"',a=d=>Object.entries(d).map(i).join(" "),u=(d,s,l,c)=>{let p=s.length;return{path:a({d:s.reduce((f,E,g)=>(f[g]=`${g?"L":"M"} ${o(g/(p-1)*l)} ${o(c-E/100*c)}`,f),new Array(p)).join(" ")}),xTicks:Array.from({length:11},(f,E)=>{let g=o(E/10),S=o(g*l-1),U=a(E?{x:10-c,y:S+(E<10?4:0),transform:"rotate(-90)"}:{x:S+10,y:c-10});return{line:a({x1:S,y1:c,x2:S,y2:c-6}),text:U,label:(g*d.length).toLocaleString()}}),yTicks:Array.from({length:6},(f,E)=>{let g=E/5,S=o(c-g*c+1);return{line:a({x1:0,y1:S,x2:6,y2:S}),text:a({x:10,y:S+(!E||E>4?10:4)}),label:o(g*100)}}),xAxis:a({x1:0,y1:0,x2:0,y2:c}),yAxis:a({x1:0,y1:c,x2:l,y2:c})}},v=Object.fromEntries(Object.entries(h).map(([d,s])=>[d,t(s)])),b=m.map(([d,s,l])=>[d,new RegExp(s),v[l]]),D=1,W=2,M=4,V=n(1e7);class N{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;series=V;sampleSeries=r;generateChart=u;getParam(s){return this.data?this.data.get(s):this.url.searchParams.get(s)}get partial(){return this.render(D)[1]}onloadend(s){}open(s,l){this.method=s,this.url=l}setRequestHeader(s,l){this.headers.set(s,l)}render(s){for(let[l,c,p]of b)if(p&&c.test(this.url.href)&&(l&D)===((s??+this.headers.has("X-Requested-With"))&D))return[l,p(this)];return[0,""]}respond=()=>this.onloadend({target:this});send(s){this.data=s;let[l,c]=this.render();this.responseXML=e.parseFromString(c,"text/html"),l&W?setTimeout(this.respond,2e3):this.respond()}}let x=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],O=[[],[],[],[],[],[]];class A{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(s){this.url=typeof s=="string"?new URL(s):s;for(let[l,c,p]of b)if(p&&c.test(this.url.href)&&(l&M)===M){p(this);break}}addIntervalId(s){this.intervals.push(s)}timeSince(s){let l=Date.now()-s,c,p=-1,f,E,g;for(;++p<6;)c=x[p],g=O[p],E=c[2],f=l/E|0,l-=f*E,g[0]=(p>3&&f<10?"0":"")+f,g[1]=c[+(f===1)];return O}dispatchEvent(s,l){for(let c of this.listeners.get(s)??[])c({type:s,data:l})}addEventListener(s,l){this.listeners.getOrInsert(s,new Set).add(l)}removeEventListener(s,l){let c=this.listeners.get(s);c&&(c.delete(l),c.size||this.listeners.delete(s))}close(){this.listeners.clear();for(let s of this.intervals)clearInterval(s);this.intervals=[]}}let Z=d=>{let s={},l=d,c=0;for(;++c<3&&l&&l!==Object.prototype;){for(let p of Object.getOwnPropertyNames(l))if(!(p in s)){try{if(d[p]===l[p])continue}catch{}try{s[p]=d[p]}catch{}}l=Object.getPrototypeOf(l)}return s};class P{constructor(s){this.el=s;let{children:[l,c,p]}=s,f=l.children;this.backBtn=f[0],this.forwardBtn=f[1],f[2].childNodes.length||f[2].appendChild(document.createTextNode("")),this.address=f[2].firstChild,this.viewport=c,this.consoleClear=p?.children[0]?.children[0],this.consoleOut=p?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=s,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let E=this.address.nodeValue?.trim();E&&(this.stack.push([new URL(E),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new N;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:s}})=>this.viewport.replaceChildren(...s?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(s){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",s?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(ee.ownerElement=this.el,Fe())}get url(){return this.stack[this.index]?.[0]}assign(s,l){++this.index,this.replace(s,l)}replace(s,l){this.stack.length=this.index+1,this.stack[this.index]=[s,l],this.render(l)}log(s){if(!this.consoleOut)return;let l=new WeakSet,c=document.createElement("p"),p=JSON.stringify(s,(E,g)=>{if(!(typeof g=="function"||typeof g>"u"))return typeof g=="object"&&g!==null?l.has(g)?void 0:(l.add(g),Z(g)):g}),f=document.createTextNode(p);c.setAttribute("title",p),c.classList.add("mv0"),c.append(f),this.consoleOut.append(c),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let Q=new Map,Be=()=>{Array.from(document.getElementsByClassName("browser"),d=>Q.has(d)||Q.set(d,new P(d)))};Be(),new MutationObserver(Be).observe(document.body,{childList:!0,subtree:!0});let ee={ownerElement:{},get browser(){return Q.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(d){this.browser?.assign(d,!0)},replace(d){this.browser?.replace(d,!0)}},It={pushState(d,s,l){ee.browser?.assign(l,!1)},replaceState(d,s,l){ee.browser?.replace(l,!1)}},Fe;y={XMLHttpRequest:N,EventSource:A,location:ee,history:It,window:{addEventListener(d,s){d==="popstate"&&(Fe=s)}},console:{ownerElement:{},get browser(){return Q.get(this.ownerElement.closest(".browser"))},log(d){this.browser?.log(d)}}}}var qe=[],We=[],Ve=[],Ue=[],_e=[],je=[],ve,ne=!1,re=!1,Ee=!1,H=new Set,$=new Set,Y=new Set,I=new Set,B=new Set,C=()=>Ee=!0,Xe=()=>Ee,Ge=()=>Ee=!1,se=e=>qe.push(e),$e=()=>qe.pop(),Ye=e=>We.push(e),Je=()=>We.pop(),Ke=e=>Ve.push(e),Ze=()=>Ve.pop(),Qe=e=>Ue.push(e),et=()=>Ue.pop(),tt=()=>ve=void 0,nt=()=>ve,rt=e=>ve=e,R=()=>ne=!0,st=()=>ne,ot=()=>ne=!1,L=()=>re=!0,oe=()=>ne=re=!0,it=()=>re,at=()=>re=!1,lt=e=>_e.push(e),ct=()=>_e.pop(),ie=(e,t)=>je.push([e,t]),dt=()=>je.pop();var Wt=new Event("conceal"),Vt=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(Wt)},be=new IntersectionObserver(Vt);var Ut=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;R()},ye=new IntersectionObserver(Ut);var _t=e=>{let t,n,r,o=!1;for(let i of e)({target:t,contentRect:{width:n,height:r}}=i),(n||r||t.offsetParent!=null)&&(t.sizeEntry=i,o=!0);o&&L()},ae=new ResizeObserver(_t);var jt=new Event("reveal"),Xt=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(jt)},we=new IntersectionObserver(Xt);var pt={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},xe=Object.keys(pt),Gt=/\/+$/,J=e=>{let t=xe.find(e.hasAttribute,e),n=e.getAttributeNode("method"),r=t?e.getAttribute(t):"",o=pt[t]??"GET";return n&&(o=n.value.toUpperCase()),r&&(r=r.replace(Gt,""),(!r||r.lastIndexOf(".")<=r.lastIndexOf("/"))&&(r+="/")),y.location.ownerElement=e,[new URL(r,y.location.href),o,!!e.hasAttribute("credentials")]};var K=class e extends Set{constructor(n,r,o,i){super();this.url=n;this.withCredentials=r;this.onMessage=o;for(let a of i)this.add(a)}url;withCredentials;onMessage;static parser=new DOMParser;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===y.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,e.parser.parseFromString(r,"text/html"));open(){this.source=new y.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,o=this.difference(n),i=n.difference(this);for(let a of o)super.delete(a),this.removeEventListener(a,this.handleMessage);for(let a of i)super.add(a);!r&&this.size?this.open():r&&!this.size&&this.close();for(let a of i)this.addEventListener(a,this.handleMessage)}};var k=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(se))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,o)=>{let i;for(let a of this.elements){let[u,,v]=J(a);this.getEvent(a)===r&&u.href===n.url.href&&v===n.withCredentials&&this.onPayload({target:{ownerElement:a,responseXML:i?i.cloneNode(!0):i=o,status:200}})}};start(){let n=new Map,r=new Map,o=new Set;for(let i of this.elements){let[a,,u]=J(i),v=this.has(a.href)?n:r,b=v.get(a.href);b||v.set(a.href,b=[new Set,new Set,a]),b[+u].add(this.getEvent(i)),o.add(a.href)}for(let[i,[a,u]]of this)o.has(i)||(a.clear(),u.clear(),this.delete(i));for(let[i,[a,u]]of n){let[v,b]=this.get(i);v.reconcileWith(a),b.reconcileWith(u)}for(let[i,[a,u,v]]of r)this.set(i,[new K(v,!1,this.onMessage,a),new K(v,!0,this.onMessage,u)])}stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var mt=e=>Object.prototype.toString.call(e)==="[object RegExp]";var ht,ut=e=>ht=e,ft=()=>ht;var gt=new Set,$t=["INPUT","SELECT","TEXTAREA"];function ce(e){return!e||(typeof e=="string"?e===this:mt(e)?e.test(this):e.some(ce,this))}function le({attributes:e}){for(let{name:t}of e)if(ce.call(t,this.match))return!1;return!0}var vt=[{match:["if:intersects","ref:width","ref:height"],gate:({sizeEntry:e})=>!e,added(e){let t=e.getBoundingClientRect(),n=[{blockSize:t.height,inlineSize:t.width}];e.sizeEntry={borderBoxSize:n,contentBoxSize:n,devicePixelContentBoxSize:n,contentRect:t,target:e}}},{gate:(e,t)=>e.hasAttribute(`on:attr:${t}`),addedAttr:ie,removedAttr:ie,changed:ie},{match:[/^ref:/,/^link:/],added:L,removed:L,changed:L},{gate:(e,t)=>e.hasAttribute(`ref:${t}`),added:L,removed:L,changed:L},{match:["ref:width","ref:height"],added:e=>ae.observe(e),destroyed:e=>ae.unobserve(e)},{match:["ref:width","ref:height"],gate:le,removed:e=>ae.unobserve(e)},{match:/^ref:/,added:e=>I.add(e),destroyed:e=>I.delete(e)},{match:/^ref:/,gate:le,removed:e=>I.delete(e)},{match:/^link:/,added:e=>B.add(e),destroyed:e=>B.delete(e)},{match:/^link:/,gate:le,removed:e=>B.delete(e)},{match:"autofocus",added:rt},{match:"if",added:e=>$.add(e),removed:e=>$.delete(e)},{match:["if",/^if:/],added:R,removed:R,changed:R},{match:/^if:/,added:e=>H.add(e),destroyed:e=>H.delete(e)},{match:/^if:/,gate:le,removed:e=>H.delete(e)},{match:"if:intersects",added:e=>ye.observe(e),removed:e=>ye.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:o}=e.sizeEntry.contentRect;e.isIntersecting=r>0&&n>0&&o<innerWidth&&t<innerHeight}},{match:"on",added:e=>j.add(e),removed:e=>j.delete(e)},{match:/^on:/,gate:(e,t)=>!gt.has(t),added(e,t){gt.add(t),document.addEventListener(t.slice(3),ft(),!0)}},{match:"on:conceal",added:e=>be.observe(e),removed:e=>be.unobserve(e)},{match:"on:navigate",added:e=>_.add(e),removed:e=>_.delete(e)},{match:"on:reveal",added:e=>we.observe(e),removed:e=>we.unobserve(e)},{match:"on:discover",added:lt},{match:"render",added:e=>Y.add(e),removed:e=>Y.delete(e)},{match:"reset",added:e=>X.add(e),removed:e=>X.delete(e)},{match:"scroll",added:e=>G.add(e),removed:e=>G.delete(e)},{match:"sse",added:k.instance.addElement,removed:k.instance.deleteElement},{match:"sse",added:C,removed:C,changed:C},{match:xe.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:C,removed:C,changed:C},{match:"value",gate:e=>!$t.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.set(e.getAttribute("name"),e.getAttribute("value"))}];var F=1,Se=2,de=4,Re=8,Ae=16,Le=32,ke=64,Ne=128,pe=(e,t,n,r)=>{for(let o of vt)ce.call(n,o.match)&&(!o.gate||o.gate(t,n,r))&&(e&F&&o.added?.(t,n,r),e&Se&&o.addedAttr?.(t,n,r),e&de&&o.removed?.(t,n,r),e&Re&&o.removedAttr?.(t,n,r),e&Ae&&o.changed?.(t,n,r),e&Le&&o.created?.(t,n,r),e&ke&&o.destroyed?.(t,n,r),e&Ne&&o.serialize?.(t,n,r))};var z=e=>e?.nodeType===Node.ELEMENT_NODE;var T=(e,t,n)=>{for(let r=0,o=t.length,i,a,u;r<o;++r)if(z(i=t[r])){a=document.createNodeIterator(i,NodeFilter.SHOW_ELEMENT);do for(u of i.attributes)pe(e,i,u.name,n);while(i=a.nextNode())}};var Et=e=>e.tagName==="FORM";var me=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var bt=document.createElement("form"),Yt=Object.create(null),he=e=>{if(e.timeoutId=clearTimeout(e.timeoutId),e.checkValidity?.()??!0){e.hasAttribute("once")&&Ye(e);let t=new FormData(Et(e)?e:(bt.replaceChildren(e.cloneNode(!0)),bt));T(Ne,[e],{formData:t});let n=e.getAttribute("redirect"),[r,o,i]=J(e);if(y.location.ownerElement=e,n==="pushState"||n==="replaceState")me(r,t),y.history[n](Yt,"",r),te();else if(n==="assign"||n==="replace")me(r,t),y.location[n](r);else{o==="GET"&&(t=me(r,t));let a=new y.XMLHttpRequest;a.responseType="document",a.withCredentials=i,a.ownerElement=e,a.onloadend=se,a.open(o,r),a.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:u,value:v}of e.attributes)u.startsWith("h-")&&a.setRequestHeader(u.slice(2),v);e.isError=!1,e.isLoading=!0,R(),a.send(t)}}};var yt=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(he,+t.value,e):(t=e.getAttributeNode("debounce"))?(clearTimeout(e.timeoutId),e.timeoutId=setTimeout(he,+t.value,e)):he(e)};var q=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function wt(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var Jt=[[j,"on",yt],[X,"reset",Ke],[G,"scroll",Qe]],xt=e=>{let{target:t,type:n}=e;if(z(t)){let r=`on:${n}`,o=t,i;for(;o&&!(i=o.getAttributeNode(r));)o=o.parentElement;if(o&&i){let a=i.value;if((i=o.getAttributeNode(`event:${n}`))&&(y.console.ownerElement=o,o.hasAttribute("log")&&y.console.log(e),i.value.split(",").some(wt,e)))return;e.preventDefault();for(let[u,v,b]of Jt)for(o of u)q(a,o.getAttribute(v))&&b(o)}}};var St=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var Rt=e=>Object.prototype.toString.call(e)==="[object FileList]";var Ce=(e,t,n=0)=>{for(let r=n,o=e.length,i,a=t.nodeName,u=t.getAttribute?.("key");r<o;++r)if(a===(i=e[r]).nodeName&&u==i.getAttribute?.("key"))return[i,r]};function At({name:e}){return this===e}var Te=e=>e!=null;var Kt=[["value",e=>e??""],["checked",Te],["selected",Te]],w=(e,t,n)=>{let r,o;typeof t=="string"?o=e.getAttributeNode(r=t):(o=t,r=t.name),o?n==null?e.removeAttributeNode(o):o.value!=n&&(o.value=n):n==null||e.setAttribute(r,n);for(let[i,a]of Kt)if(r===i&&r in e){let u=a(n);e[r]==u||(e[r]=u)}};var Lt=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:o}=n,i=r.slice(2),a=t.find(At,i);r.startsWith("x-")?a?(w(e,n,a.value),w(e,a,o)):(w(e,n),w(e,"d-"+i,""),w(e,i,o)):r.startsWith("d-")&&(a&&(w(e,"x-"+i,a.value),w(e,a)),w(e,n))}},kt=e=>{e.hasAttribute("state")||(Lt(e),w(e,"state",""))},ue=e=>{let t=e.getAttributeNode("state");t&&(w(e,t),Lt(e))};var Nt=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),z(e)){ue(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||w(e,r);for(let{name:o,value:i}of t.attributes)w(e,o,i);fe.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},fe={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=Ce(t,e),o,i;r?([o,i]=r,i&&e.before(...t.slice(0,i)),++i):(o=t[0],i=1),n>i&&e.after(...t.slice(i)),Nt(e,o)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,o=n.length,i=0,a,u;for(;i<r;++i)u=Ce(n,a=t[i],i),u?(u[1]===i||e.insertBefore(u[0],n[i]),Nt(n[i],a)):i<o++?e.insertBefore(a,n[i]):e.appendChild(a);for(;o>r;)e.removeChild(n[--o])}};var De=["borderBoxSize","contentBoxSize","devicePixelContentBoxSize","contentRect"],Ct=(e,t)=>{if(t==="width"||t==="height"){let{sizeEntry:n}=e,r=e.getAttribute("measure"),o,i;return De.includes(r)||(r=De[0]),r===De[3]?{width:o,height:i}=n[r]:{inlineSize:o,blockSize:i}=n[r][0],t==="width"?o:i}return t in e?e[t]:e.getAttribute(t)};var Me=!1,Oe=[],Zt=()=>{let e;for(;e=Oe.pop();)e[0](e[1],e[2])},Qt=()=>{Me=!1},Tt=()=>{!Me&&Oe.length&&(Me=!0,document.startViewTransition(Zt).finished.finally(Qt))},Dt=(e,t,n)=>!!document.startViewTransition&&t.hasAttribute("transition")&&Oe.push([e,t,n]);var Pe=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let o=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=o/2|0:r==="end"&&(t[n]=o)}else t[n]=+r};var en=[],Mt=["auto","instant","smooth"],tn=new Event("result"),nn=new Event("failure"),rn=new Event("discover"),Ot=new Map,He=()=>{let e,t,n,r,o,i,a,u,v,b,D,W,M,V,N,x,O,A,Z,P;for(;e=Ze();)e.reset?.();for(;e=Je();)w(e,"on");for(;o=$e();){({ownerElement:t,status:N,responseXML:r}=o.target),v=t.getAttribute((t.isError=N>399)?"error":"result"),W=[],n=void 0;for(e of Y)q(v,e.getAttribute("render"))&&W.push([e,r?Array.from((n?n.cloneNode(!0):n=r.body).childNodes):en]);for(;D=W.pop();)[e,V]=D,M=fe[e.getAttribute("position")]??fe.replaceChildren,Dt(M,e,V)||M(e,V);t.isLoading=!1,R(),t.dispatchEvent(t.isError?nn:tn)}if(Tt(),st()){ot(),b=[];for(e of H)!(e.checkValidity?.()??!0)&&(x=e.getAttributeNode("if:invalid"))&&b.push(x.value),(O=St(e))&&(!Rt(O)||O.length)&&(x=e.getAttributeNode("if:value"))&&b.push(x.value),e.isIntersecting&&(x=e.getAttributeNode("if:intersects"))&&b.push(x.value),e.isLoading&&(x=e.getAttributeNode("if:loading"))&&b.push(x.value),e.isError&&(x=e.getAttributeNode("if:error"))&&b.push(x.value);v=b.join(" ");for(e of $)q(v,e.getAttribute("if"))?kt(e):ue(e)}if(it()){at();for(e of B)for({name:i,value:u}of e.attributes)if(i.startsWith("link:")){i=i.slice(5);for(n of I)for({name:a,value:v}of n.attributes)a.startsWith("ref:")&&q(v,u)&&w(e,i,Ct(n,a.slice(4)))}}for(;e=et();)A={behavior:Mt.includes(u=e.getAttribute("behavior"))?u:Mt[0]},Pe(e,A,"top"),Pe(e,A,"left"),("top"in A||"left"in A)&&(e.hasAttribute("relative")?e.scrollBy(A):e.scroll(A));for(;e=ct();)e.dispatchEvent(rn);for(;Z=dt();)[e,i]=Z,P=Ot.get(i),P||Ot.set(i,P=new Event("attr:"+i)),e.dispatchEvent(P);if(Xe()&&(Ge(),k.instance.start()),e=nt()){tt();try{N=e.value.length,e.focus(),e.setSelectionRange(N,N)}catch{}}requestAnimationFrame(He)};var sn=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:o,target:i}of e)if(T(de|ke,o),T(F|Le,t),n){let a=i.hasAttribute(n),u=r!=null,v;a&&!u&&(v=F|Se),!a&&u&&(v=de|Re),pe(v??Ae,i,n)}},Pt=new MutationObserver(sn);var Ie=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}ut(xt),T(F,document.childNodes),Pt.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",oe,!0),document.addEventListener("input",oe,!0),document.addEventListener("reset",oe,!0),y.window.addEventListener("popstate",te,!0),window.addEventListener("beforeunload",k.instance.stop,!0),requestAnimationFrame(He)};var Ht=Symbol.for("keml");window[Ht]||(window[Ht]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ie,!0):Ie());})();
