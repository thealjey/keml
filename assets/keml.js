/*!
 * keml 3.9.0 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var m=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"reference-chart","reference-chart"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[1,"increment","increment"],[1,"vir-cleanup","vir-cleanup"],[1,"virtualization","virtualization"],[1,"if-loading","if-loading"],[1,"if-error","if-error"],[1,"if-timeout","if-timeout"],[1,"timeout-fallback","timeout-fallback"],[1,"timeout","timeout"],[2,"sse","sse"],[4,"stream","stream"],[1,"request-mode-list","request-mode-list"],[1,"request-mode","request-mode"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.url-parse-error-example.com","url-parse-error"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"],[0,"https://www.transition-example.com/page-a","transition-home"],[1,"https://www.transition-example.com/page-a","transition-a"],[1,"https://www.transition-example.com/page-b","transition-b"],[1,"https://www.transition-example.com/page-c","transition-c"]];var u={credentials:`<small class="chip mt3">Ha!</small>

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
`,"if-loading":`{{ server.delay = 2000 }}
`,"if-timeout":`{{ server.delay = 5000 }}
`,increment:`<input
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
`,"request-mode-list":`<dl class="dl" position="append" render="delayedResponse"></dl>
`,"request-mode":`{{ persistent.reqNum ??= 0; }}
{{ const delay = server.delay = Math.random() * 10000 + 1000 | 0; }}

<dt>Request #{ ++persistent.reqNum }</dt><dd>Took { delay }ms</dd>
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
`,"timeout-fallback":`But, couldn't wait for it to load and settled for this instead.
`,timeout:`{{ server.delay = 5000 }}

We wanted this.
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
`,"url-parse-error":`<button
  class="btn"
  on:click="makeInvalidRequest"
  on="makeInvalidRequest"
  action="http://["
  log
>
  Click Me
</button>
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
`};var K=new Set,Y=new Set,J=new Set,Q=new Set,Z=new Set;var cn=new Event("navigate"),de=()=>{for(let e of K)e.dispatchEvent(cn)};var b;{let e=new DOMParser,t=d=>{let o=[],a=0,c=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;o.push("let out = [];");let p;for(;p=c.exec(d);){let f=p[0],g=p.index;if(o.push(`out.push(${JSON.stringify(d.slice(a,g))});`),f.startsWith("{{"))o.push(f.slice(2,-2).trim());else{let v=f.slice(1,-1).trim();o.push(`out.push(String(${v}));`)}a=g+f.length}return o.push(`out.push(${JSON.stringify(d.slice(a))});`),o.push("return out.join('');"),new Function("server","persistent",o.join(`
`))},n=d=>{let o=Array.from({length:10},()=>Math.random()*100|0),a=new Array(d),c=p=>{if(p<0)return o[0]+(o[0]-o[1]);if(p>=o.length){let f=o.length;return o[f-1]+(o[f-1]-o[f-2])}return o[p]};for(let p=0;p<d;++p){let f=p/(d-1)*(o.length-1),g=Math.floor(f),v=f-g,x=c(g-1),S=c(g),z=c(g+1),ae=c(g+2),le=.5*(2*S+(-x+z)*v+(2*x-5*S+4*z-ae)*v*v+(-x+3*S-3*z+ae)*v*v*v);a[p]=le}return a},s=(d,o)=>{if(o|=0,o<1)return[];let a=d.length;if(o===1)return[d[a/2|0]];if(o>a)return d;let c=new Array(o);for(let p=0,f;p<o;++p)f=p/(o-1),c[p]=d[Math.round(f*(a-1))];return c},i=(d,o=2)=>parseFloat(d.toFixed(o)),r=([d,o])=>d+'="'+o+'"',l=d=>Object.entries(d).map(r).join(" "),h=(d,o,a,c)=>{let p=o.length;return{path:l({d:o.reduce((f,g,v)=>(f[v]=`${v?"L":"M"} ${i(v/(p-1)*a)} ${i(c-g/100*c)}`,f),new Array(p)).join(" ")}),xTicks:Array.from({length:11},(f,g)=>{let v=i(g/10),x=i(v*a-1),S=l(g?{x:10-c,y:x+(g<10?4:0),transform:"rotate(-90)"}:{x:x+10,y:c-10});return{line:l({x1:x,y1:c,x2:x,y2:c-6}),text:S,label:(v*d.length).toLocaleString()}}),yTicks:Array.from({length:6},(f,g)=>{let v=g/5,x=i(c-v*c+1);return{line:l({x1:0,y1:x,x2:6,y2:x}),text:l({x:10,y:x+(!g||g>4?10:4)}),label:i(v*100)}}),xAxis:l({x1:0,y1:0,x2:0,y2:c}),yAxis:l({x1:0,y1:c,x2:a,y2:c})}},E=Object.fromEntries(Object.entries(u).map(([d,o])=>[d,t(o)])),y={},C=m.map(([d,o,a])=>[d,new RegExp(o),E[a]]),j=["Deep Freezing","Freezing","Cold","Cool","Mild Moderate","Moderate","Warm","Hot","Very Hot","Scorching"],D=1,X=2,k=4,R=n(1e7),H=Array.from({length:3e5},(d,o)=>({num:o+1,temperature:(o=Math.random()*100).toFixed(2),label:j[Math.max(0,(o-1)/10|0)]})),A=H.length,$=10**(String(A).length-1),M=A===$?A:$*10,se=[];for(A>1e5&&se.push(M=1e5);M>19;)se.push(M/=10);let Ye=(d,o,a=0)=>{let c=o-d;if(a>=se.length||c<11)return{size:c,start:d,end:o,level:a};let p=se[a],f=[];for(let g=d;g<o;g+=p)f.push(Ye(g,Math.min(g+p,o),a+1));return{size:c,level:a,children:f}},Zt={children:[Ye(0,A)]};class Je{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;readyState=0;timeout=0;series=R;table=H;sampleSeries=s;generateChart=h;delay=0;timeoutId;getParam(o){return this.data?this.data.get(o):this.url.searchParams.get(o)}get partial(){return this.render(D)[1]}getNode(o){return o.split("-").map(c=>c|0).reduce((c,p)=>c.children[p],Zt)}onloadend(o){}abort(){clearTimeout(this.timeoutId)}ontimeout(o){}onerror(){}open(o,a){this.method=o,this.url=a,this.readyState=1}setRequestHeader(o,a){this.headers.set(o,a)}render(o){for(let[a,c,p]of C)if(p&&c.test(this.url.href)&&(a&D)===((o??+this.headers.has("X-Requested-With"))&D))return[a,p(this,y)];return[0,""]}respond=()=>{this.readyState=4,this.onloadend?.({target:this})};timeFail=()=>{this.readyState=4,this.ontimeout?.({target:this})};send(o){this.data=o;let[,a]=this.render();this.responseXML=e.parseFromString(a,"text/html"),this.readyState=3,this.delay?this.timeoutId=this.timeout<this.delay?setTimeout(this.timeFail,this.timeout):setTimeout(this.respond,this.delay):this.respond()}}let en=new TextEncoder,tn=async(d,o={})=>{let a,c=new ReadableStream({start(S){a=S}}),{headers:p,credentials:f,method:g,body:v}=o,x={headers:p?Array.isArray(p)?new Map(p):p instanceof Headers?p:new Map(Object.entries(p)):new Map,withCredentials:f!=="omit",method:g,url:typeof d=="string"?new URL(d):d instanceof Request?new URL(d.url):d,data:v,status:200,getParam(S){return this.data?this.data.get(S):this.url.searchParams.get(S)},write(S){a.enqueue(en.encode(S))},end(){a.close()},get partial(){return this.render(k)[1]},render(S){for(let[z,ae,le]of C)if(le&&ae.test(this.url.href)&&(S??z)&k)return[z,le(this,y)];return[0,""]}};return x.write(x.render()[1]),new Response(c)},nn=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],Qe=[[],[],[],[],[],[]];class rn{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(o){this.url=typeof o=="string"?new URL(o):o;for(let[a,c,p]of C)if(p&&c.test(this.url.href)&&a&X){p(this,y);break}}addIntervalId(o){this.intervals.push(o)}timeSince(o){let a=Date.now()-o,c,p=-1,f,g,v;for(;++p<6;)c=nn[p],v=Qe[p],g=c[2],f=a/g|0,a-=f*g,v[0]=(p>3&&f<10?"0":"")+f,v[1]=c[+(f===1)];return Qe}dispatchEvent(o,a){for(let c of this.listeners.get(o)??[])c({type:o,data:a})}addEventListener(o,a){let c=this.listeners.get(o);c||this.listeners.set(o,c=new Set),c.add(a)}removeEventListener(o,a){let c=this.listeners.get(o);c&&(c.delete(a),c.size||this.listeners.delete(o))}close(){this.listeners.clear();for(let o of this.intervals)clearInterval(o);this.intervals=[]}}let sn=d=>{let o={},a=d,c=0;for(;++c<3&&a&&a!==Object.prototype;){for(let p of Object.getOwnPropertyNames(a))if(!(p in o)){try{if(d[p]===a[p])continue}catch{}try{o[p]=d[p]}catch{}}a=Object.getPrototypeOf(a)}return o};class on{constructor(o){this.el=o;let{children:[a,c,p]}=o,f=a.children;this.backBtn=f[0],this.forwardBtn=f[1],f[2].childNodes.length||f[2].appendChild(document.createTextNode("")),this.address=f[2].firstChild,this.viewport=c,this.consoleClear=p?.children[0]?.children[0],this.consoleOut=p?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=o,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let g=this.address.nodeValue?.trim();g&&(this.stack.push([new URL(g),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new Je;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:o}})=>this.viewport.replaceChildren(...o?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(o){let a=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=a?.href??"about:blank",o?a&&(this.xhr.open("GET",a),this.xhr.send(void 0)):(ie.ownerElement=this.el,et())}get url(){return this.stack[this.index]?.[0]}assign(o,a){++this.index,this.replace(o,a)}replace(o,a){this.stack.length=this.index+1,this.stack[this.index]=[o,a],this.render(a)}log(o){if(!this.consoleOut)return;let a=new WeakSet,c=document.createElement("p"),p=JSON.stringify(o,(g,v)=>{if(!(typeof v=="function"||typeof v>"u"))return typeof v=="object"&&v!==null?a.has(v)?void 0:(a.add(v),sn(v)):v}),f=document.createTextNode(p);c.setAttribute("title",p),c.classList.add("mv0"),c.append(f),this.consoleOut.append(c),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let oe=new Map,Ze=()=>{Array.from(document.getElementsByClassName("browser"),d=>oe.has(d)||oe.set(d,new on(d)))};Ze(),new MutationObserver(Ze).observe(document.body,{childList:!0,subtree:!0});let ie={ownerElement:{},get browser(){return oe.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(d){this.browser?.assign(d,!0)},replace(d){this.browser?.replace(d,!0)}},an={pushState(d,o,a){ie.browser?.assign(a,!1)},replaceState(d,o,a){ie.browser?.replace(a,!1)}},et;b={XMLHttpRequest:Je,EventSource:rn,location:ie,history:an,window:{addEventListener(d,o){d==="popstate"&&(et=o)}},console:{ownerElement:{},get browser(){return oe.get(this.ownerElement.closest(".browser"))},log(d){this.browser?.log(d)},error(d){this.browser?.log(d)}},fetch:tn}}var ke=[],tt=[],nt=[],rt=[],st=[],ot=[],Te,ce=!1,pe=!1,Ne=!1,I=new Set,ee=new Set,te=new Set,q=new Set,F=new Set,_=new Event("failure"),P=()=>Ne=!0,it=()=>Ne,at=()=>Ne=!1,Ce=e=>ke.push(e.target),B=(...e)=>ke.push(...e),lt=()=>ke.pop(),dt=e=>tt.push(e),ct=()=>tt.pop(),pt=e=>nt.push(e),mt=()=>nt.pop(),ut=e=>rt.push(e),ht=()=>rt.pop(),ft=()=>Te=void 0,gt=()=>Te,vt=e=>Te=e,L=()=>ce=!0,Et=()=>ce,bt=()=>ce=!1,T=()=>pe=!0,me=()=>ce=pe=!0,yt=()=>pe,wt=()=>pe=!1,xt=e=>st.push(e),Rt=()=>st.pop(),ue=(e,t)=>ot.push([e,t]),St=()=>ot.pop();var he=({searchParams:e},t)=>{if(t)for(let[n,s]of t)typeof s=="string"&&e.append(n,s)};var Me=e=>{for(let t of e.xhr??[])t.onloadend=t.onerror=t.ontimeout=null,t.abort();e.xhr=void 0};var Lt=({target:{ownerElement:e}})=>{e.isError=!0,L(),e.dispatchEvent(_)};var fe=e=>{if(e.xhr){for(let{readyState:t}of e.xhr)if(t!==4)return!0}return!1};var At=({target:{ownerElement:e}})=>{let t=e.xhr;t&&!fe(e)&&(e.xhr=void 0,B(...t))};var pn=new Event("timeout"),kt=({target:{ownerElement:e}})=>{e.isError=e.isTimeout=!0,L(),e.dispatchEvent(_),e.dispatchEvent(pn)};var Tt={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},De=Object.keys(Tt),mn=/\/+$/,ne=e=>{b.location.ownerElement=e,b.console.ownerElement=e;let t=De.find(e.hasAttribute,e),n=t?e.getAttribute(t):"",s=b.location.href,i,r;try{i=new URL(n,s)}catch(y){(r=e.hasAttribute("log"))&&b.console.error(y);try{i=new URL("",s)}catch(C){r&&b.console.error(C),i=new URL("about:blank")}}let l=i.pathname.replace(mn,"");i.pathname=!l||l.lastIndexOf(".")<=l.lastIndexOf("/")?l+"/":l;let h=Tt[t]??"GET",E=e.getAttributeNode("method");return E&&(h=E.value.toUpperCase()),[i,h,e.hasAttribute("credentials")]};var un=new Event("conceal"),hn=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(un)},Pe=new IntersectionObserver(hn);var fn=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;L()},Oe=new IntersectionObserver(fn);var gn=e=>{let t,n,s,i=!1;for(let r of e)({target:t,contentRect:{width:n,height:s}}=r),(n||s||t.offsetParent!=null)&&(t.sizeEntry=r,i=!0);i&&T()},ge=new ResizeObserver(gn);var vn=new Event("reveal"),En=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(vn)},He=new IntersectionObserver(En);var bn=new DOMParser,ve=e=>bn.parseFromString(e,"text/html");var re=class extends Set{constructor(n,s,i,r){super();this.url=n;this.withCredentials=s;this.onMessage=i;for(let l of r)this.add(l)}url;withCredentials;onMessage;source;addEventListener(n,s){this.source?.addEventListener(n,s)}removeEventListener(n,s){this.source?.removeEventListener(n,s)}handleError=()=>{if(this.source?.readyState===b.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:s})=>this.onMessage(this,n,ve(s));open(){this.source=new b.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let s=this.size;return super.add(n),s!==this.size&&(s||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let s=super.delete(n);return s&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),s}clear(){this.close(),super.clear()}reconcileWith(n){let s=this.size,i=this.difference(n),r=n.difference(this);for(let l of i)super.delete(l),this.removeEventListener(l,this.handleMessage);for(let l of r)super.add(l);!s&&this.size?this.open():s&&!this.size&&this.close();for(let l of r)this.addEventListener(l,this.handleMessage)}};var N=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(B))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,s,i)=>{let r;for(let l of this.elements){let[h,,E]=ne(l);this.getEvent(l)===s&&h.href===n.url.href&&E===n.withCredentials&&this.onPayload({ownerElement:l,responseXML:r?r.cloneNode(!0):r=i,status:200})}};start(){let n=new Map,s=new Map,i=new Set;for(let r of this.elements){let[l,,h]=ne(r),E=this.has(l.href)?n:s,y=E.get(l.href);y||E.set(l.href,y=[new Set,new Set,l]),y[+h].add(this.getEvent(r)),i.add(l.href)}for(let[r,[l,h]]of this)i.has(r)||(l.clear(),h.clear(),this.delete(r));for(let[r,[l,h]]of n){let[E,y]=this.get(r);E.reconcileWith(l),y.reconcileWith(h)}for(let[r,[l,h,E]]of s)this.set(r,[new re(E,!1,this.onMessage,l),new re(E,!0,this.onMessage,h)])}stop=()=>{for(let[n,s]of this.values())n.clear(),s.clear();this.clear()}};var Nt=e=>Object.prototype.toString.call(e)==="[object RegExp]";var Ct,Mt=e=>Ct=e,Dt=()=>Ct;var Pt=new Set,yn=["INPUT","SELECT","TEXTAREA"];function be(e){return!e||(typeof e=="string"?e===this:Nt(e)?e.test(this):e.some(be,this))}function Ee({attributes:e}){for(let{name:t}of e)if(be.call(t,this.match))return!1;return!0}var Ot=[{match:["if:intersects","ref:width","ref:height"],gate:({sizeEntry:e})=>!e,added(e){let t=e.getBoundingClientRect(),n=[{blockSize:t.height,inlineSize:t.width}];e.sizeEntry={borderBoxSize:n,contentBoxSize:n,devicePixelContentBoxSize:n,contentRect:t,target:e}}},{gate:(e,t)=>e.hasAttribute(`on:attr:${t}`),addedAttr:ue,removedAttr:ue,changed:ue},{match:[/^ref:/,/^link:/],added:T,removed:T,changed:T},{gate:(e,t)=>e.hasAttribute(`ref:${t}`),added:T,removed:T,changed:T},{match:["ref:width","ref:height"],added:e=>ge.observe(e),destroyed:e=>ge.unobserve(e)},{match:["ref:width","ref:height"],gate:Ee,removed:e=>ge.unobserve(e)},{match:/^ref:/,added:e=>q.add(e),destroyed:e=>q.delete(e)},{match:/^ref:/,gate:Ee,removed:e=>q.delete(e)},{match:/^link:/,added:e=>F.add(e),destroyed:e=>F.delete(e)},{match:/^link:/,gate:Ee,removed:e=>F.delete(e)},{match:"autofocus",added:vt},{match:"clear-timeout",added:e=>Z.add(e),removed:e=>Z.delete(e)},{match:"if",added:e=>ee.add(e),removed:e=>ee.delete(e)},{match:["if",/^if:/],added:L,removed:L,changed:L},{match:/^if:/,added:e=>I.add(e),destroyed:e=>I.delete(e)},{match:/^if:/,gate:Ee,removed:e=>I.delete(e)},{match:"if:intersects",added:e=>Oe.observe(e),removed:e=>Oe.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:s,left:i}=e.sizeEntry.contentRect;e.isIntersecting=s>0&&n>0&&i<innerWidth&&t<innerHeight}},{match:"on",added:e=>Y.add(e),removed:e=>Y.delete(e)},{match:/^on:/,gate:(e,t)=>!Pt.has(t),added(e,t){Pt.add(t),document.addEventListener(t.slice(3),Dt(),!0)}},{match:"on:conceal",added:e=>Pe.observe(e),removed:e=>Pe.unobserve(e)},{match:"on:navigate",added:e=>K.add(e),removed:e=>K.delete(e)},{match:"on:reveal",added:e=>He.observe(e),removed:e=>He.unobserve(e)},{match:"on:discover",added:xt},{match:"render",added:e=>te.add(e),removed:e=>te.delete(e)},{match:"reset",added:e=>J.add(e),removed:e=>J.delete(e)},{match:"scroll",added:e=>Q.add(e),removed:e=>Q.delete(e)},{match:"sse",added:N.instance.addElement,removed:N.instance.deleteElement},{match:"sse",added:P,removed:P,changed:P},{match:De.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:P,removed:P,changed:P},{match:"value",gate:e=>!yn.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.append(e.getAttribute("name"),e.getAttribute("value"))}];var U=1,ze=2,ye=4,Ie=8,qe=16,Fe=32,_e=64,Be=128,we=(e,t,n,s)=>{for(let i of Ot)be.call(n,i.match)&&(!i.gate||i.gate(t,n,s))&&(e&U&&i.added?.(t,n,s),e&ze&&i.addedAttr?.(t,n,s),e&ye&&i.removed?.(t,n,s),e&Ie&&i.removedAttr?.(t,n,s),e&qe&&i.changed?.(t,n,s),e&Fe&&i.created?.(t,n,s),e&_e&&i.destroyed?.(t,n,s),e&Be&&i.serialize?.(t,n,s))};var W=e=>e?.nodeType===Node.ELEMENT_NODE;var O=(e,t,n)=>{for(let s=0,i=t.length,r,l,h;s<i;++s)if(W(r=t[s])){l=document.createNodeIterator(r,NodeFilter.SHOW_ELEMENT);do for(h of r.attributes)we(e,r,h.name,n);while(r=l.nextNode())}};var Ht=e=>e.tagName==="FORM";var zt=document.createElement("form"),xe=e=>{let t=new FormData(Ht(e)?e:(zt.replaceChildren(e.cloneNode(!0)),zt));return O(Be,[e],{formData:t}),t};var wn=/<!--\s*keml\s*-->/i,xn={stream:!0},Rn=new TextDecoder,Re=class{responseType;ownerElement;url;onloadend;onerror;init={headers:{}};responseText="";open(t,n){this.init.method=t,this.url=n}setRequestHeader(t,n){this.init.headers[t]=n}set withCredentials(t){t&&(this.init.credentials="include")}async send(t){t&&(this.init.body=t);let n,s;try{({status:n,body:s}=await b.fetch(this.url,this.init))}catch(i){b.console.ownerElement=this.ownerElement,b.console.error(i),this.onerror({target:{status:0,responseXML:null,ownerElement:this.ownerElement}})}if(s&&n!=null){for await(let i of s){this.responseText+=Rn.decode(i,xn);let r;for(;r=wn.exec(this.responseText);)this.respond(this.responseText.slice(0,r.index),n),this.responseText=this.responseText.slice(r.index+r[0].length)}this.respond(this.responseText,n)}}respond(t,n){this.onloadend({target:{status:n,responseXML:ve(t),ownerElement:this.ownerElement}})}};var V=e=>e.timeoutId=clearTimeout(e.timeoutId);var Sn=Object.create(null),Se=e=>{if(V(e),e.checkValidity?.()??!0){e.hasAttribute("once")&&dt(e);let t=e.getAttribute("redirect"),[n,s,i]=ne(e);if(b.location.ownerElement=e,t==="pushState"||t==="replaceState")he(n,xe(e)),b.history[t](Sn,"",n),de();else if(t==="assign"||t==="replace")he(n,xe(e)),b.location[t](n);else if(n.protocol==="about:"&&n.pathname==="blank/")B({ownerElement:e,status:200,responseXML:null});else{let r;if(e.hasAttribute("stream"))r=new Re,r.onloadend=Ce,Me(e);else{let h=e.getAttribute("request-mode");if(e.xhr&&h==="ignore")return;r=new b.XMLHttpRequest,r.onloadend=h==="queue"?At:Ce,r.ontimeout=kt,r.timeout=Number(e.getAttribute("timeout")),h==="replace"&&Me(e),e.xhr?e.xhr.unshift(r):e.xhr=[r]}let l=xe(e);s==="GET"&&(l=he(n,l)),r.responseType="document",r.withCredentials=i,r.ownerElement=e,r.onerror=Lt,r.open(s,n),r.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:h,value:E}of e.attributes)h.startsWith("h-")&&r.setRequestHeader(h.slice(2),E);e.isError=!1,e.isTimeout=!1,e.isLoading=!0,L(),r.send(l)}}};var It=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(Se,+t.value,e):(t=e.getAttributeNode("debounce"))?(V(e),e.timeoutId=setTimeout(Se,+t.value,e)):Se(e)};var G=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function qt(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var Ln=[[Y,"on",It],[J,"reset",pt],[Q,"scroll",ut],[Z,"clear-timeout",V]],Ft=e=>{let{target:t,type:n}=e;if(W(t)){let s=`on:${n}`,i=t,r;for(;i&&!(r=i.getAttributeNode(s));)i=i.parentElement;if(i&&r){let l=r.value;if((r=i.getAttributeNode(`event:${n}`))&&(b.console.ownerElement=i,i.hasAttribute("log")&&b.console.log(e),r.value.split(",").some(qt,e)))return;e.preventDefault();for(let[h,E,y]of Ln)for(i of h)G(l,i.getAttribute(E))&&y(i)}}};var _t=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var Bt=e=>Object.prototype.toString.call(e)==="[object FileList]";var Ue=(e,t,n=0)=>{for(let s=n,i=e.length,r,l=t.nodeName,h=t.getAttribute?.("key");s<i;++s)if(l===(r=e[s]).nodeName&&h==r.getAttribute?.("key"))return[r,s]};function Ut({name:e}){return this===e}var We=e=>e!=null;var An=[["value",e=>e??""],["checked",We],["selected",We]],w=(e,t,n)=>{let s,i;typeof t=="string"?i=e.getAttributeNode(s=t):(i=t,s=t.name),i?n==null?e.removeAttributeNode(i):i.value!=n&&(i.value=n):n==null||e.setAttribute(s,n);for(let[r,l]of An)if(s===r&&s in e){let h=l(n);e[s]==h||(e[s]=h)}};var Wt=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:s,value:i}=n,r=s.slice(2),l=t.find(Ut,r);s.startsWith("x-")?l?(w(e,n,l.value),w(e,l,i)):(w(e,n),w(e,"d-"+r,""),w(e,r,i)):s.startsWith("d-")&&(l&&(w(e,"x-"+r,l.value),w(e,l)),w(e,n))}},Vt=e=>{e.hasAttribute("state")||(Wt(e),w(e,"state",""))},Le=e=>{let t=e.getAttributeNode("state");t&&(w(e,t),Wt(e))};var Gt=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),W(e)){Le(e);let n=e.attributes.length,s;for(;n--;)s=e.attributes[n],t.hasAttribute(s.name)||w(e,s);for(let{name:i,value:r}of t.attributes)w(e,i,r);Ae.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},Ae={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let s=Ue(t,e),i,r;s?([i,r]=s,r&&e.before(...t.slice(0,r)),++r):(i=t[0],r=1),n>r&&e.after(...t.slice(r)),Gt(e,i)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,s=t.length,i=n.length,r=0,l,h;for(;r<s;++r)h=Ue(n,l=t[r],r),h?(h[1]===r||e.insertBefore(h[0],n[r]),Gt(n[r],l)):r<i++?e.insertBefore(l,n[r]):e.appendChild(l);for(;i>s;)e.removeChild(n[--i])}};var Ve=["borderBoxSize","contentBoxSize","devicePixelContentBoxSize","contentRect"],jt=(e,t)=>{if(t==="width"||t==="height"){let{sizeEntry:n}=e,s=e.getAttribute("measure"),i,r;return Ve.includes(s)||(s=Ve[0]),s===Ve[3]?{width:i,height:r}=n[s]:{inlineSize:i,blockSize:r}=n[s][0],t==="width"?i:r}return t in e?e[t]:e.getAttribute(t)};var Ge=!1,je=[],kn=()=>{let e;for(;e=je.pop();)e[0](e[1],e[2])},Tn=()=>{Ge=!1},Xt=()=>{!Ge&&je.length&&(Ge=!0,document.startViewTransition(kn).finished.finally(Tn))},$t=(e,t,n)=>!!document.startViewTransition&&t.hasAttribute("transition")&&je.push([e,t,n]);var Xe=(e,t,n)=>{let s=e.getAttribute(n);if(s)if(isNaN(+s)){let i=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;s==="start"?t[n]=0:s==="center"?t[n]=i/2|0:s==="end"&&(t[n]=i)}else t[n]=+s};var Nn=[],Kt=["auto","instant","smooth"],Cn=new Event("result"),Mn=new Event("discover"),Yt=new Map,$e=()=>{let e,t,n,s,i,r,l,h,E,y,C,j,D,X,k,R,H,A,$,M;for(;e=mt();)e.reset?.();for(;e=ct();)w(e,"on");for(;i=lt();)if({ownerElement:t,status:k,responseXML:s}=i,(t.isLoading=fe(t))||(t.xhr=void 0),L(),k!==0){E=t.getAttribute((t.isError=k>399)?"error":"result"),j=[],n=void 0;for(e of te)G(E,e.getAttribute("render"))&&j.push([e,s?Array.from((n?n.cloneNode(!0):n=s.body).childNodes):Nn]);for(;C=j.pop();)[e,X]=C,D=Ae[e.getAttribute("position")]??Ae.replaceChildren,$t(D,e,X)||D(e,X);t.dispatchEvent(t.isError?_:Cn)}if(Xt(),Et()){bt(),y=[];for(e of I)!(e.checkValidity?.()??!0)&&(R=e.getAttributeNode("if:invalid"))&&y.push(R.value),(H=_t(e))&&(!Bt(H)||H.length)&&(R=e.getAttributeNode("if:value"))&&y.push(R.value),e.isIntersecting&&(R=e.getAttributeNode("if:intersects"))&&y.push(R.value),e.isLoading&&(R=e.getAttributeNode("if:loading"))&&y.push(R.value),e.isError&&(R=e.getAttributeNode("if:error"))&&y.push(R.value),e.isTimeout&&(R=e.getAttributeNode("if:timeout"))&&y.push(R.value);E=y.join(" ");for(e of ee)G(E,e.getAttribute("if"))?Vt(e):Le(e)}if(yt()){wt();for(e of F)for({name:r,value:h}of e.attributes)if(r.startsWith("link:")){r=r.slice(5);for(n of q)for({name:l,value:E}of n.attributes)l.startsWith("ref:")&&G(E,h)&&w(e,r,jt(n,l.slice(4)))}}for(;e=ht();)A={behavior:Kt.includes(h=e.getAttribute("behavior"))?h:Kt[0]},Xe(e,A,"top"),Xe(e,A,"left"),("top"in A||"left"in A)&&(e.hasAttribute("relative")?e.scrollBy(A):e.scroll(A));for(;e=Rt();)e.dispatchEvent(Mn);for(;$=St();)[e,r]=$,M=Yt.get(r),M||Yt.set(r,M=new Event("attr:"+r)),e.dispatchEvent(M);if(it()&&(at(),N.instance.start()),e=gt()){ft();try{k=e.value.length,e.focus(),e.setSelectionRange(k,k)}catch{}}requestAnimationFrame($e)};var Dn=e=>{for(let{addedNodes:t,attributeName:n,oldValue:s,removedNodes:i,target:r}of e)if(O(ye|_e,i),O(U|Fe,t),n){let l=r.hasAttribute(n),h=s!=null,E;l&&!h&&(E=U|ze),!l&&h&&(E=ye|Ie),we(E??qe,r,n)}},Jt=new MutationObserver(Dn);var Ke=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}Mt(Ft),O(U,document.childNodes),Jt.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",me,!0),document.addEventListener("input",me,!0),document.addEventListener("reset",me,!0),b.window.addEventListener("popstate",de,!0),window.addEventListener("beforeunload",N.instance.stop,!0),requestAnimationFrame($e)};var Qt=Symbol.for("keml");window[Qt]||(window[Qt]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ke,!0):Ke());})();
