/*!
 * keml 3.8.0 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var h=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"reference-chart","reference-chart"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[1,"increment","increment"],[1,"vir-cleanup","vir-cleanup"],[1,"virtualization","virtualization"],[3,"if-loading","if-loading"],[1,"if-error","if-error"],[4,"sse","sse"],[8,"stream","stream"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"],[0,"https://www.transition-example.com/page-a","transition-home"],[1,"https://www.transition-example.com/page-a","transition-a"],[1,"https://www.transition-example.com/page-b","transition-b"],[1,"https://www.transition-example.com/page-c","transition-c"]];var m={credentials:`<small class="chip mt3">Ha!</small>

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
`,"vir-cleanup":`{{
  const path = server.getParam("path");
  const height = server.getParam("height");
}}

<div
  { 'style="height: ' + height + 'px;"' }
  on:reveal="loadGrid_{ path } cancelClearGrid_{ path }"
  on:conceal="cancelLoadGrid_{ path }"
  on="loadGrid_{ path }"
  debounce="200"
  clear-timeout="cancelLoadGrid_{ path }"
  src="/virtualization?path={ path }&height={ height }"
  result="virtualizationResult_{ path }"
  render="virtualizationResult_{ path }"
  position="replaceWith"
></div>
`,virtualization:`{{

  const size = server.table.length;
  const path = server.getParam("path");
  const height = server.getParam("height");
  const chunk = 10 ** (String(size).length - 1);
  const limits = [];
  const steps = path.split("-").map(value => value | 0);
  let c = size === chunk ? size : chunk * 10;

  size > 100_000 && limits.push([(c = 100_000), Math.ceil(size / c)]);
  while (c > 1) limits.push([(c /= 10), 10]);

  const [offset, limit] = steps.reduce(
    (acc, value, i) => (
      (acc[1] = limits[i][0]),
      (acc[0] += value * acc[1]),
      acc
    ),
    [0, 0],
  );

}}

{{ if (steps.length > 1) { }}
  <div
    { 'style="height: ' + height + 'px;"' }
    on:reveal="cancelClearGrid_{ path }"
    on:conceal="clearGrid_{ path } cancelLoadGrid_{ path }"
    on="clearGrid_{ path }"
    debounce="1000"
    clear-timeout="cancelClearGrid_{ path }"
    src="/vir-cleanup?path={ path }&height={ height }"
    result="virtualizationResult_{ path }"
    render="virtualizationResult_{ path }"
    position="replaceWith"
  >
{{ } }}

{{ if (limit > 1) { }}
  {{
    for (
      let i = 0, l = limits[steps.length - 1], o = offset, s, p, h;
      i < l[1] && o < size;
      ++i
    ) {
  }}
    {{ p = path + "-" + i; }}
    {{ o = offset + i * l[0]; }}
    {{ s = size - o - l[0]; }}
    {{ h = (s < 0 ? l[0] + s : l[0]) * 50; }}
    <div
      { 'style="height: ' + h + 'px;"' }
      on:reveal="loadGrid_{ p } cancelClearGrid_{ p }"
      on:conceal="cancelLoadGrid_{ p }"
      on="loadGrid_{ p }"
      debounce="200"
      clear-timeout="cancelLoadGrid_{ p }"
      src="/virtualization?path={ p }&height={ h }"
      result="virtualizationResult_{ p }"
      render="virtualizationResult_{ p }"
      position="replaceWith"
    ></div>
  {{ } }}
{{ } else { }}
  {{
    for (
      let i = offset, l = Math.min(offset + limit * 10, size);
      i < l;
      ++i
    ) {
  }}
    <div class="grid-row">
      <div>{ server.table[i].label }</div>
      <div>{ server.table[i].temperature }</div>
    </div>
  {{ } }}
{{ } }}

{{ if (steps.length > 1) { }}
  </div>
{{ } }}
`};var G=new Set,j=new Set,X=new Set,$=new Set,K=new Set;var Kt=new Event("navigate"),ae=()=>{for(let e of G)e.dispatchEvent(Kt)};var y;{let e=new DOMParser,t=c=>{let o=[],l=0,d=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;o.push("let out = [];");let p;for(;p=d.exec(c);){let f=p[0],E=p.index;if(o.push(`out.push(${JSON.stringify(c.slice(l,E))});`),f.startsWith("{{"))o.push(f.slice(2,-2).trim());else{let g=f.slice(1,-1).trim();o.push(`out.push(String(${g}));`)}l=E+f.length}return o.push(`out.push(${JSON.stringify(c.slice(l))});`),o.push("return out.join('');"),new Function("server",o.join(`
`))},n=c=>{let o=Array.from({length:10},()=>Math.random()*100|0),l=new Array(c),d=p=>{if(p<0)return o[0]+(o[0]-o[1]);if(p>=o.length){let f=o.length;return o[f-1]+(o[f-1]-o[f-2])}return o[p]};for(let p=0;p<c;++p){let f=p/(c-1)*(o.length-1),E=Math.floor(f),g=f-E,x=d(E-1),S=d(E),O=d(E+1),oe=d(E+2),ie=.5*(2*S+(-x+O)*g+(2*x-5*S+4*O-oe)*g*g+(-x+3*S-3*O+oe)*g*g*g);l[p]=ie}return l},r=(c,o)=>{if(o|=0,o<1)return[];let l=c.length;if(o===1)return[c[l/2|0]];if(o>l)return c;let d=new Array(o);for(let p=0,f;p<o;++p)f=p/(o-1),d[p]=c[Math.round(f*(l-1))];return d},i=(c,o=2)=>parseFloat(c.toFixed(o)),s=([c,o])=>c+'="'+o+'"',a=c=>Object.entries(c).map(s).join(" "),u=(c,o,l,d)=>{let p=o.length;return{path:a({d:o.reduce((f,E,g)=>(f[g]=`${g?"L":"M"} ${i(g/(p-1)*l)} ${i(d-E/100*d)}`,f),new Array(p)).join(" ")}),xTicks:Array.from({length:11},(f,E)=>{let g=i(E/10),x=i(g*l-1),S=a(E?{x:10-d,y:x+(E<10?4:0),transform:"rotate(-90)"}:{x:x+10,y:d-10});return{line:a({x1:x,y1:d,x2:x,y2:d-6}),text:S,label:(g*c.length).toLocaleString()}}),yTicks:Array.from({length:6},(f,E)=>{let g=E/5,x=i(d-g*d+1);return{line:a({x1:0,y1:x,x2:6,y2:x}),text:a({x:10,y:x+(!E||E>4?10:4)}),label:i(g*100)}}),xAxis:a({x1:0,y1:0,x2:0,y2:d}),yAxis:a({x1:0,y1:d,x2:l,y2:d})}},v=Object.fromEntries(Object.entries(m).map(([c,o])=>[c,t(o)])),b=h.map(([c,o,l])=>[c,new RegExp(o),v[l]]),te=["Deep Freezing","Freezing","Cold","Cool","Mild Moderate","Moderate","Warm","Hot","Very Hot","Scorching"],C=1,U=2,W=4,N=8,R=n(1e7),V=Array.from({length:35e4},(c,o)=>({temperature:(o=Math.random()*100).toFixed(2),label:te[Math.max(0,(o-1)/10|0)]}));class L{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;series=R;table=V;sampleSeries=r;generateChart=u;getParam(o){return this.data?this.data.get(o):this.url.searchParams.get(o)}get partial(){return this.render(C)[1]}onloadend(o){}open(o,l){this.method=o,this.url=l}setRequestHeader(o,l){this.headers.set(o,l)}render(o){for(let[l,d,p]of b)if(p&&d.test(this.url.href)&&(l&C)===((o??+this.headers.has("X-Requested-With"))&C))return[l,p(this)];return[0,""]}respond=()=>this.onloadend({target:this});send(o){this.data=o;let[l,d]=this.render();this.responseXML=e.parseFromString(d,"text/html"),l&U?setTimeout(this.respond,2e3):this.respond()}}let ne=new TextEncoder,P=async(c,o={})=>{let l,d=new ReadableStream({start(S){l=S}}),{headers:p,credentials:f,method:E,body:g}=o,x={headers:p?Array.isArray(p)?new Map(p):p instanceof Headers?p:new Map(Object.entries(p)):new Map,withCredentials:f!=="omit",method:E,url:typeof c=="string"?new URL(c):c instanceof Request?new URL(c.url):c,data:g,status:200,getParam(S){return this.data?this.data.get(S):this.url.searchParams.get(S)},write(S){l.enqueue(ne.encode(S))},end(){l.close()},get partial(){return this.render(N)[1]},render(S){for(let[O,oe,ie]of b)if(ie&&oe.test(this.url.href)&&(S??O)&N)return[O,ie(this)];return[0,""]}};return x.write(x.render()[1]),new Response(d)},Ut=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],We=[[],[],[],[],[],[]];class Wt{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(o){this.url=typeof o=="string"?new URL(o):o;for(let[l,d,p]of b)if(p&&d.test(this.url.href)&&l&W){p(this);break}}addIntervalId(o){this.intervals.push(o)}timeSince(o){let l=Date.now()-o,d,p=-1,f,E,g;for(;++p<6;)d=Ut[p],g=We[p],E=d[2],f=l/E|0,l-=f*E,g[0]=(p>3&&f<10?"0":"")+f,g[1]=d[+(f===1)];return We}dispatchEvent(o,l){for(let d of this.listeners.get(o)??[])d({type:o,data:l})}addEventListener(o,l){let d=this.listeners.get(o);d||this.listeners.set(o,d=new Set),d.add(l)}removeEventListener(o,l){let d=this.listeners.get(o);d&&(d.delete(l),d.size||this.listeners.delete(o))}close(){this.listeners.clear();for(let o of this.intervals)clearInterval(o);this.intervals=[]}}let Vt=c=>{let o={},l=c,d=0;for(;++d<3&&l&&l!==Object.prototype;){for(let p of Object.getOwnPropertyNames(l))if(!(p in o)){try{if(c[p]===l[p])continue}catch{}try{o[p]=c[p]}catch{}}l=Object.getPrototypeOf(l)}return o};class Gt{constructor(o){this.el=o;let{children:[l,d,p]}=o,f=l.children;this.backBtn=f[0],this.forwardBtn=f[1],f[2].childNodes.length||f[2].appendChild(document.createTextNode("")),this.address=f[2].firstChild,this.viewport=d,this.consoleClear=p?.children[0]?.children[0],this.consoleOut=p?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=o,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let E=this.address.nodeValue?.trim();E&&(this.stack.push([new URL(E),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new L;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:o}})=>this.viewport.replaceChildren(...o?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(o){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",o?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(se.ownerElement=this.el,Ge())}get url(){return this.stack[this.index]?.[0]}assign(o,l){++this.index,this.replace(o,l)}replace(o,l){this.stack.length=this.index+1,this.stack[this.index]=[o,l],this.render(l)}log(o){if(!this.consoleOut)return;let l=new WeakSet,d=document.createElement("p"),p=JSON.stringify(o,(E,g)=>{if(!(typeof g=="function"||typeof g>"u"))return typeof g=="object"&&g!==null?l.has(g)?void 0:(l.add(g),Vt(g)):g}),f=document.createTextNode(p);d.setAttribute("title",p),d.classList.add("mv0"),d.append(f),this.consoleOut.append(d),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let re=new Map,Ve=()=>{Array.from(document.getElementsByClassName("browser"),c=>re.has(c)||re.set(c,new Gt(c)))};Ve(),new MutationObserver(Ve).observe(document.body,{childList:!0,subtree:!0});let se={ownerElement:{},get browser(){return re.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(c){this.browser?.assign(c,!0)},replace(c){this.browser?.replace(c,!0)}},jt={pushState(c,o,l){se.browser?.assign(l,!1)},replaceState(c,o,l){se.browser?.replace(l,!1)}},Ge;y={XMLHttpRequest:L,EventSource:Wt,location:se,history:jt,window:{addEventListener(c,o){c==="popstate"&&(Ge=o)}},console:{ownerElement:{},get browser(){return re.get(this.ownerElement.closest(".browser"))},log(c){this.browser?.log(c)}},fetch:P}}var je=[],Xe=[],$e=[],Ke=[],Ye=[],Je=[],Se,le=!1,ce=!1,Re=!1,H=new Set,Y=new Set,J=new Set,z=new Set,I=new Set,M=()=>Re=!0,Ze=()=>Re,Qe=()=>Re=!1,Z=e=>je.push(e),et=()=>je.pop(),tt=e=>Xe.push(e),nt=()=>Xe.pop(),rt=e=>$e.push(e),st=()=>$e.pop(),ot=e=>Ke.push(e),it=()=>Ke.pop(),at=()=>Se=void 0,lt=()=>Se,ct=e=>Se=e,A=()=>le=!0,dt=()=>le,pt=()=>le=!1,k=()=>ce=!0,de=()=>le=ce=!0,ht=()=>ce,mt=()=>ce=!1,ut=e=>Ye.push(e),ft=()=>Ye.pop(),pe=(e,t)=>Je.push([e,t]),gt=()=>Je.pop();var Yt=new Event("conceal"),Jt=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(Yt)},Le=new IntersectionObserver(Jt);var Zt=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;A()},Ae=new IntersectionObserver(Zt);var Qt=e=>{let t,n,r,i=!1;for(let s of e)({target:t,contentRect:{width:n,height:r}}=s),(n||r||t.offsetParent!=null)&&(t.sizeEntry=s,i=!0);i&&k()},he=new ResizeObserver(Qt);var en=new Event("reveal"),tn=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(en)},ke=new IntersectionObserver(tn);var vt={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},Te=Object.keys(vt),nn=/\/+$/,Q=e=>{y.location.ownerElement=e;let t=Te.find(e.hasAttribute,e),n=t?e.getAttribute(t):"",r=y.location.href,i;try{i=new URL(n,r)}catch(v){e.hasAttribute("log")&&console.error(v);try{i=new URL("",r)}catch(b){e.hasAttribute("log")&&console.error(b),i=new URL("about:blank")}}let s=i.pathname.replace(nn,"");i.pathname=!s||s.lastIndexOf(".")<=s.lastIndexOf("/")?s+"/":s;let a=vt[t]??"GET",u=e.getAttributeNode("method");return u&&(a=u.value.toUpperCase()),[i,a,e.hasAttribute("credentials")]};var rn=new DOMParser,me=e=>rn.parseFromString(e,"text/html");var ee=class extends Set{constructor(n,r,i,s){super();this.url=n;this.withCredentials=r;this.onMessage=i;for(let a of s)this.add(a)}url;withCredentials;onMessage;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===y.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,me(r));open(){this.source=new y.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,i=this.difference(n),s=n.difference(this);for(let a of i)super.delete(a),this.removeEventListener(a,this.handleMessage);for(let a of s)super.add(a);!r&&this.size?this.open():r&&!this.size&&this.close();for(let a of s)this.addEventListener(a,this.handleMessage)}};var T=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(Z))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,i)=>{let s;for(let a of this.elements){let[u,,v]=Q(a);this.getEvent(a)===r&&u.href===n.url.href&&v===n.withCredentials&&this.onPayload({target:{ownerElement:a,responseXML:s?s.cloneNode(!0):s=i,status:200}})}};start(){let n=new Map,r=new Map,i=new Set;for(let s of this.elements){let[a,,u]=Q(s),v=this.has(a.href)?n:r,b=v.get(a.href);b||v.set(a.href,b=[new Set,new Set,a]),b[+u].add(this.getEvent(s)),i.add(a.href)}for(let[s,[a,u]]of this)i.has(s)||(a.clear(),u.clear(),this.delete(s));for(let[s,[a,u]]of n){let[v,b]=this.get(s);v.reconcileWith(a),b.reconcileWith(u)}for(let[s,[a,u,v]]of r)this.set(s,[new ee(v,!1,this.onMessage,a),new ee(v,!0,this.onMessage,u)])}stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var Et=e=>Object.prototype.toString.call(e)==="[object RegExp]";var bt,yt=e=>bt=e,wt=()=>bt;var xt=new Set,sn=["INPUT","SELECT","TEXTAREA"];function fe(e){return!e||(typeof e=="string"?e===this:Et(e)?e.test(this):e.some(fe,this))}function ue({attributes:e}){for(let{name:t}of e)if(fe.call(t,this.match))return!1;return!0}var St=[{match:["if:intersects","ref:width","ref:height"],gate:({sizeEntry:e})=>!e,added(e){let t=e.getBoundingClientRect(),n=[{blockSize:t.height,inlineSize:t.width}];e.sizeEntry={borderBoxSize:n,contentBoxSize:n,devicePixelContentBoxSize:n,contentRect:t,target:e}}},{gate:(e,t)=>e.hasAttribute(`on:attr:${t}`),addedAttr:pe,removedAttr:pe,changed:pe},{match:[/^ref:/,/^link:/],added:k,removed:k,changed:k},{gate:(e,t)=>e.hasAttribute(`ref:${t}`),added:k,removed:k,changed:k},{match:["ref:width","ref:height"],added:e=>he.observe(e),destroyed:e=>he.unobserve(e)},{match:["ref:width","ref:height"],gate:ue,removed:e=>he.unobserve(e)},{match:/^ref:/,added:e=>z.add(e),destroyed:e=>z.delete(e)},{match:/^ref:/,gate:ue,removed:e=>z.delete(e)},{match:/^link:/,added:e=>I.add(e),destroyed:e=>I.delete(e)},{match:/^link:/,gate:ue,removed:e=>I.delete(e)},{match:"autofocus",added:ct},{match:"clear-timeout",added:e=>K.add(e),removed:e=>K.delete(e)},{match:"if",added:e=>Y.add(e),removed:e=>Y.delete(e)},{match:["if",/^if:/],added:A,removed:A,changed:A},{match:/^if:/,added:e=>H.add(e),destroyed:e=>H.delete(e)},{match:/^if:/,gate:ue,removed:e=>H.delete(e)},{match:"if:intersects",added:e=>Ae.observe(e),removed:e=>Ae.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:i}=e.sizeEntry.contentRect;e.isIntersecting=r>0&&n>0&&i<innerWidth&&t<innerHeight}},{match:"on",added:e=>j.add(e),removed:e=>j.delete(e)},{match:/^on:/,gate:(e,t)=>!xt.has(t),added(e,t){xt.add(t),document.addEventListener(t.slice(3),wt(),!0)}},{match:"on:conceal",added:e=>Le.observe(e),removed:e=>Le.unobserve(e)},{match:"on:navigate",added:e=>G.add(e),removed:e=>G.delete(e)},{match:"on:reveal",added:e=>ke.observe(e),removed:e=>ke.unobserve(e)},{match:"on:discover",added:ut},{match:"render",added:e=>J.add(e),removed:e=>J.delete(e)},{match:"reset",added:e=>X.add(e),removed:e=>X.delete(e)},{match:"scroll",added:e=>$.add(e),removed:e=>$.delete(e)},{match:"sse",added:T.instance.addElement,removed:T.instance.deleteElement},{match:"sse",added:M,removed:M,changed:M},{match:Te.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:M,removed:M,changed:M},{match:"value",gate:e=>!sn.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.append(e.getAttribute("name"),e.getAttribute("value"))}];var _=1,Ne=2,ge=4,Ce=8,Me=16,De=32,Pe=64,Oe=128,ve=(e,t,n,r)=>{for(let i of St)fe.call(n,i.match)&&(!i.gate||i.gate(t,n,r))&&(e&_&&i.added?.(t,n,r),e&Ne&&i.addedAttr?.(t,n,r),e&ge&&i.removed?.(t,n,r),e&Ce&&i.removedAttr?.(t,n,r),e&Me&&i.changed?.(t,n,r),e&De&&i.created?.(t,n,r),e&Pe&&i.destroyed?.(t,n,r),e&Oe&&i.serialize?.(t,n,r))};var B=e=>e?.nodeType===Node.ELEMENT_NODE;var D=(e,t,n)=>{for(let r=0,i=t.length,s,a,u;r<i;++r)if(B(s=t[r])){a=document.createNodeIterator(s,NodeFilter.SHOW_ELEMENT);do for(u of s.attributes)ve(e,s,u.name,n);while(s=a.nextNode())}};var Rt=e=>e.tagName==="FORM";var Ee=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var on=/<!--\s*keml\s*-->/i,an={stream:!0},ln=new TextDecoder,be=class{responseType;ownerElement;url;onloadend;init={headers:{}};responseText="";open(t,n){this.init.method=t,this.url=n}setRequestHeader(t,n){this.init.headers[t]=n}set withCredentials(t){t&&(this.init.credentials="include")}async send(t){t&&(this.init.body=t);let{status:n,body:r}=await y.fetch(this.url,this.init);if(r){for await(let i of r){this.responseText+=ln.decode(i,an);let s;for(;s=on.exec(this.responseText);)this.respond(this.responseText.slice(0,s.index),n),this.responseText=this.responseText.slice(s.index+s[0].length)}this.respond(this.responseText,n)}}respond(t,n){this.onloadend({target:{status:n,responseXML:me(t),ownerElement:this.ownerElement}})}};var F=e=>e.timeoutId=clearTimeout(e.timeoutId);var Lt=document.createElement("form"),cn=Object.create(null),ye=e=>{if(F(e),e.checkValidity?.()??!0){e.hasAttribute("once")&&tt(e);let t=new FormData(Rt(e)?e:(Lt.replaceChildren(e.cloneNode(!0)),Lt));D(Oe,[e],{formData:t});let n=e.getAttribute("redirect"),[r,i,s]=Q(e);if(y.location.ownerElement=e,n==="pushState"||n==="replaceState")Ee(r,t),y.history[n](cn,"",r),ae();else if(n==="assign"||n==="replace")Ee(r,t),y.location[n](r);else if(r.protocol==="about:"&&r.pathname==="blank/")Z({target:{ownerElement:e,status:200,responseXML:null}});else{i==="GET"&&(t=Ee(r,t));let a=new(e.hasAttribute("stream")?be:y.XMLHttpRequest);a.responseType="document",a.withCredentials=s,a.ownerElement=e,a.onloadend=Z,a.open(i,r),a.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:u,value:v}of e.attributes)u.startsWith("h-")&&a.setRequestHeader(u.slice(2),v);e.isError=!1,e.isLoading=!0,A(),a.send(t)}}};var At=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(ye,+t.value,e):(t=e.getAttributeNode("debounce"))?(F(e),e.timeoutId=setTimeout(ye,+t.value,e)):ye(e)};var q=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function kt(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var dn=[[j,"on",At],[X,"reset",rt],[$,"scroll",ot],[K,"clear-timeout",F]],Tt=e=>{let{target:t,type:n}=e;if(B(t)){let r=`on:${n}`,i=t,s;for(;i&&!(s=i.getAttributeNode(r));)i=i.parentElement;if(i&&s){let a=s.value;if((s=i.getAttributeNode(`event:${n}`))&&(y.console.ownerElement=i,i.hasAttribute("log")&&y.console.log(e),s.value.split(",").some(kt,e)))return;e.preventDefault();for(let[u,v,b]of dn)for(i of u)q(a,i.getAttribute(v))&&b(i)}}};var Nt=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var Ct=e=>Object.prototype.toString.call(e)==="[object FileList]";var He=(e,t,n=0)=>{for(let r=n,i=e.length,s,a=t.nodeName,u=t.getAttribute?.("key");r<i;++r)if(a===(s=e[r]).nodeName&&u==s.getAttribute?.("key"))return[s,r]};function Mt({name:e}){return this===e}var ze=e=>e!=null;var pn=[["value",e=>e??""],["checked",ze],["selected",ze]],w=(e,t,n)=>{let r,i;typeof t=="string"?i=e.getAttributeNode(r=t):(i=t,r=t.name),i?n==null?e.removeAttributeNode(i):i.value!=n&&(i.value=n):n==null||e.setAttribute(r,n);for(let[s,a]of pn)if(r===s&&r in e){let u=a(n);e[r]==u||(e[r]=u)}};var Dt=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:i}=n,s=r.slice(2),a=t.find(Mt,s);r.startsWith("x-")?a?(w(e,n,a.value),w(e,a,i)):(w(e,n),w(e,"d-"+s,""),w(e,s,i)):r.startsWith("d-")&&(a&&(w(e,"x-"+s,a.value),w(e,a)),w(e,n))}},Pt=e=>{e.hasAttribute("state")||(Dt(e),w(e,"state",""))},we=e=>{let t=e.getAttributeNode("state");t&&(w(e,t),Dt(e))};var Ot=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),B(e)){we(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||w(e,r);for(let{name:i,value:s}of t.attributes)w(e,i,s);xe.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},xe={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=He(t,e),i,s;r?([i,s]=r,s&&e.before(...t.slice(0,s)),++s):(i=t[0],s=1),n>s&&e.after(...t.slice(s)),Ot(e,i)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,i=n.length,s=0,a,u;for(;s<r;++s)u=He(n,a=t[s],s),u?(u[1]===s||e.insertBefore(u[0],n[s]),Ot(n[s],a)):s<i++?e.insertBefore(a,n[s]):e.appendChild(a);for(;i>r;)e.removeChild(n[--i])}};var Ie=["borderBoxSize","contentBoxSize","devicePixelContentBoxSize","contentRect"],Ht=(e,t)=>{if(t==="width"||t==="height"){let{sizeEntry:n}=e,r=e.getAttribute("measure"),i,s;return Ie.includes(r)||(r=Ie[0]),r===Ie[3]?{width:i,height:s}=n[r]:{inlineSize:i,blockSize:s}=n[r][0],t==="width"?i:s}return t in e?e[t]:e.getAttribute(t)};var _e=!1,Be=[],hn=()=>{let e;for(;e=Be.pop();)e[0](e[1],e[2])},mn=()=>{_e=!1},zt=()=>{!_e&&Be.length&&(_e=!0,document.startViewTransition(hn).finished.finally(mn))},It=(e,t,n)=>!!document.startViewTransition&&t.hasAttribute("transition")&&Be.push([e,t,n]);var Fe=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let i=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=i/2|0:r==="end"&&(t[n]=i)}else t[n]=+r};var un=[],_t=["auto","instant","smooth"],fn=new Event("result"),gn=new Event("failure"),vn=new Event("discover"),Bt=new Map,qe=()=>{let e,t,n,r,i,s,a,u,v,b,te,C,U,W,N,R,V,L,ne,P;for(;e=st();)e.reset?.();for(;e=nt();)w(e,"on");for(;i=et();){({ownerElement:t,status:N,responseXML:r}=i.target),v=t.getAttribute((t.isError=N>399)?"error":"result"),C=[],n=void 0;for(e of J)q(v,e.getAttribute("render"))&&C.push([e,r?Array.from((n?n.cloneNode(!0):n=r.body).childNodes):un]);for(;te=C.pop();)[e,W]=te,U=xe[e.getAttribute("position")]??xe.replaceChildren,It(U,e,W)||U(e,W);t.isLoading=!1,A(),t.dispatchEvent(t.isError?gn:fn)}if(zt(),dt()){pt(),b=[];for(e of H)!(e.checkValidity?.()??!0)&&(R=e.getAttributeNode("if:invalid"))&&b.push(R.value),(V=Nt(e))&&(!Ct(V)||V.length)&&(R=e.getAttributeNode("if:value"))&&b.push(R.value),e.isIntersecting&&(R=e.getAttributeNode("if:intersects"))&&b.push(R.value),e.isLoading&&(R=e.getAttributeNode("if:loading"))&&b.push(R.value),e.isError&&(R=e.getAttributeNode("if:error"))&&b.push(R.value);v=b.join(" ");for(e of Y)q(v,e.getAttribute("if"))?Pt(e):we(e)}if(ht()){mt();for(e of I)for({name:s,value:u}of e.attributes)if(s.startsWith("link:")){s=s.slice(5);for(n of z)for({name:a,value:v}of n.attributes)a.startsWith("ref:")&&q(v,u)&&w(e,s,Ht(n,a.slice(4)))}}for(;e=it();)L={behavior:_t.includes(u=e.getAttribute("behavior"))?u:_t[0]},Fe(e,L,"top"),Fe(e,L,"left"),("top"in L||"left"in L)&&(e.hasAttribute("relative")?e.scrollBy(L):e.scroll(L));for(;e=ft();)e.dispatchEvent(vn);for(;ne=gt();)[e,s]=ne,P=Bt.get(s),P||Bt.set(s,P=new Event("attr:"+s)),e.dispatchEvent(P);if(Ze()&&(Qe(),T.instance.start()),e=lt()){at();try{N=e.value.length,e.focus(),e.setSelectionRange(N,N)}catch{}}requestAnimationFrame(qe)};var En=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:i,target:s}of e)if(D(ge|Pe,i),D(_|De,t),n){let a=s.hasAttribute(n),u=r!=null,v;a&&!u&&(v=_|Ne),!a&&u&&(v=ge|Ce),ve(v??Me,s,n)}},Ft=new MutationObserver(En);var Ue=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}yt(Tt),D(_,document.childNodes),Ft.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",de,!0),document.addEventListener("input",de,!0),document.addEventListener("reset",de,!0),y.window.addEventListener("popstate",ae,!0),window.addEventListener("beforeunload",T.instance.stop,!0),requestAnimationFrame(qe)};var qt=Symbol.for("keml");window[qt]||(window[qt]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ue,!0):Ue());})();
