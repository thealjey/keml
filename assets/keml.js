/*!
 * keml 3.10.0 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var p=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"reference-chart","reference-chart"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[1,"increment","increment"],[1,"vir-cleanup","vir-cleanup"],[1,"virtualization","virtualization"],[1,"if-loading","if-loading"],[1,"if-error","if-error"],[1,"if-timeout","if-timeout"],[1,"timeout-fallback","timeout-fallback"],[1,"timeout","timeout"],[2,"sse","sse"],[4,"stream","stream"],[1,"request-mode-list","request-mode-list"],[1,"request-mode","request-mode"],[1,"confirm","confirm"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.url-parse-error-example.com","url-parse-error"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"],[0,"https://www.transition-example.com/page-a","transition-home"],[1,"https://www.transition-example.com/page-a","transition-a"],[1,"https://www.transition-example.com/page-b","transition-b"],[1,"https://www.transition-example.com/page-c","transition-c"]];var u={confirm:`{{
  persistent.timesSaved ??= 0;

  const times = ++persistent.timesSaved;

  const suffix = () => {
    const str = times + "";
    let len = str.length;
    const last = str[--len];
    const teen = str[--len] !== '1';

    return last === '1' && teen ?
      "st"
      : (last === '2' || last === '3') && teen
        ? "nd"
        : "th";
  };
}}

Saved for the
<pre class="dib mb0">{times}</pre>{suffix()} time
on <pre class="dib mb0">{new Date().toLocaleString()}</pre>.
`,credentials:`<small class="chip mt3">Ha!</small>

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
`};var K=new Set,Y=new Set,J=new Set,Q=new Set,Z=new Set;var fn=new Event("navigate"),ce=()=>{for(let e of K)e.dispatchEvent(fn)};var y;{let e=new DOMParser,t=c=>{let i=[],l=0,d=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;i.push("let out = [];");let m;for(;m=d.exec(c);){let f=m[0],v=m.index;if(i.push(`out.push(${JSON.stringify(c.slice(l,v))});`),f.startsWith("{{"))i.push(f.slice(2,-2).trim());else{let E=f.slice(1,-1).trim();i.push(`out.push(String(${E}));`)}l=v+f.length}return i.push(`out.push(${JSON.stringify(c.slice(l))});`),i.push("return out.join('');"),new Function("server","persistent",i.join(`
`))},n=c=>{let i=Array.from({length:10},()=>Math.random()*100|0),l=new Array(c),d=m=>{if(m<0)return i[0]+(i[0]-i[1]);if(m>=i.length){let f=i.length;return i[f-1]+(i[f-1]-i[f-2])}return i[m]};for(let m=0;m<c;++m){let f=m/(c-1)*(i.length-1),v=Math.floor(f),E=f-v,x=d(v-1),R=d(v),z=d(v+1),ae=d(v+2),le=.5*(2*R+(-x+z)*E+(2*x-5*R+4*z-ae)*E*E+(-x+3*R-3*z+ae)*E*E*E);l[m]=le}return l},r=(c,i)=>{if(i|=0,i<1)return[];let l=c.length;if(i===1)return[c[l/2|0]];if(i>l)return c;let d=new Array(i);for(let m=0,f;m<i;++m)f=m/(i-1),d[m]=c[Math.round(f*(l-1))];return d},o=(c,i=2)=>parseFloat(c.toFixed(i)),s=([c,i])=>c+'="'+i+'"',a=c=>Object.entries(c).map(s).join(" "),h=(c,i,l,d)=>{let m=i.length;return{path:a({d:i.reduce((f,v,E)=>(f[E]=`${E?"L":"M"} ${o(E/(m-1)*l)} ${o(d-v/100*d)}`,f),new Array(m)).join(" ")}),xTicks:Array.from({length:11},(f,v)=>{let E=o(v/10),x=o(E*l-1),R=a(v?{x:10-d,y:x+(v<10?4:0),transform:"rotate(-90)"}:{x:x+10,y:d-10});return{line:a({x1:x,y1:d,x2:x,y2:d-6}),text:R,label:(E*c.length).toLocaleString()}}),yTicks:Array.from({length:6},(f,v)=>{let E=v/5,x=o(d-E*d+1);return{line:a({x1:0,y1:x,x2:6,y2:x}),text:a({x:10,y:x+(!v||v>4?10:4)}),label:o(E*100)}}),xAxis:a({x1:0,y1:0,x2:0,y2:d}),yAxis:a({x1:0,y1:d,x2:l,y2:d})}},g=Object.fromEntries(Object.entries(u).map(([c,i])=>[c,t(i)])),b={},k=p.map(([c,i,l])=>[c,new RegExp(i),g[l]]),T=["Deep Freezing","Freezing","Cold","Cool","Mild Moderate","Moderate","Warm","Hot","Very Hot","Scorching"],P=1,X=2,N=4,S=n(1e7),I=Array.from({length:3e5},(c,i)=>({num:i+1,temperature:(i=Math.random()*100).toFixed(2),label:T[Math.max(0,(i-1)/10|0)]})),A=I.length,$=10**(String(A).length-1),D=A===$?A:$*10,se=[];for(A>1e5&&se.push(D=1e5);D>19;)se.push(D/=10);let Qe=(c,i,l=0)=>{let d=i-c;if(l>=se.length||d<11)return{size:d,start:c,end:i,level:l};let m=se[l],f=[];for(let v=c;v<i;v+=m)f.push(Qe(v,Math.min(v+m,i),l+1));return{size:d,level:l,children:f}},sn={children:[Qe(0,A)]};class Ze{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;readyState=0;timeout=0;series=S;table=I;sampleSeries=r;generateChart=h;delay=0;timeoutId;getParam(i){return this.data?this.data.get(i):this.url.searchParams.get(i)}get partial(){return this.render(P)[1]}getNode(i){return i.split("-").map(d=>d|0).reduce((d,m)=>d.children[m],sn)}onloadend(i){}abort(){clearTimeout(this.timeoutId)}ontimeout(i){}onerror(){}open(i,l){this.method=i,this.url=l,this.readyState=1}setRequestHeader(i,l){this.headers.set(i,l)}render(i){for(let[l,d,m]of k)if(m&&d.test(this.url.href)&&(l&P)===((i??+this.headers.has("X-Requested-With"))&P))return[l,m(this,b)];return[0,""]}respond=()=>{this.readyState=4,this.onloadend?.({target:this})};timeFail=()=>{this.readyState=4,this.ontimeout?.({target:this})};send(i){this.data=i;let[,l]=this.render();this.responseXML=e.parseFromString(l,"text/html"),this.readyState=3,this.delay?this.timeoutId=this.timeout&&this.timeout<this.delay?setTimeout(this.timeFail,this.timeout):setTimeout(this.respond,this.delay):this.respond()}}let on=new TextEncoder,an=async(c,i={})=>{let l,d=new ReadableStream({start(R){l=R}}),{headers:m,credentials:f,method:v,body:E}=i,x={headers:m?Array.isArray(m)?new Map(m):m instanceof Headers?m:new Map(Object.entries(m)):new Map,withCredentials:f!=="omit",method:v,url:typeof c=="string"?new URL(c):c instanceof Request?new URL(c.url):c,data:E,status:200,getParam(R){return this.data?this.data.get(R):this.url.searchParams.get(R)},write(R){l.enqueue(on.encode(R))},end(){l.close()},get partial(){return this.render(N)[1]},render(R){for(let[z,ae,le]of k)if(le&&ae.test(this.url.href)&&(R??z)&N)return[z,le(this,b)];return[0,""]}};return x.write(x.render()[1]),new Response(d)},ln=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],et=[[],[],[],[],[],[]];class cn{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(i){this.url=typeof i=="string"?new URL(i):i;for(let[l,d,m]of k)if(m&&d.test(this.url.href)&&l&X){m(this,b);break}}addIntervalId(i){this.intervals.push(i)}timeSince(i){let l=Date.now()-i,d,m=-1,f,v,E;for(;++m<6;)d=ln[m],E=et[m],v=d[2],f=l/v|0,l-=f*v,E[0]=(m>3&&f<10?"0":"")+f,E[1]=d[+(f===1)];return et}dispatchEvent(i,l){for(let d of this.listeners.get(i)??[])d({type:i,data:l})}addEventListener(i,l){let d=this.listeners.get(i);d||this.listeners.set(i,d=new Set),d.add(l)}removeEventListener(i,l){let d=this.listeners.get(i);d&&(d.delete(l),d.size||this.listeners.delete(i))}close(){this.listeners.clear();for(let i of this.intervals)clearInterval(i);this.intervals=[]}}let dn=c=>{let i={},l=c,d=0;for(;++d<3&&l&&l!==Object.prototype;){for(let m of Object.getOwnPropertyNames(l))if(!(m in i)){try{if(c[m]===l[m])continue}catch{}try{i[m]=c[m]}catch{}}l=Object.getPrototypeOf(l)}return i};class mn{constructor(i){this.el=i;let{children:[l,d,m]}=i,f=l.children;this.backBtn=f[0],this.forwardBtn=f[1],f[2].childNodes.length||f[2].appendChild(document.createTextNode("")),this.address=f[2].firstChild,this.viewport=d,this.consoleClear=m?.children[0]?.children[0],this.consoleOut=m?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=i,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let v=this.address.nodeValue?.trim();v&&(this.stack.push([new URL(v),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new Ze;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:i}})=>this.viewport.replaceChildren(...i?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(i){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",i?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(ie.ownerElement=this.el,nt())}get url(){return this.stack[this.index]?.[0]}assign(i,l){++this.index,this.replace(i,l)}replace(i,l){this.stack.length=this.index+1,this.stack[this.index]=[i,l],this.render(l)}log(i){if(!this.consoleOut)return;let l=new WeakSet,d=document.createElement("p"),m=JSON.stringify(i,(v,E)=>{if(!(typeof E=="function"||typeof E>"u"))return typeof E=="object"&&E!==null?l.has(E)?void 0:(l.add(E),dn(E)):E}),f=document.createTextNode(m);d.setAttribute("title",m),d.classList.add("mv0"),d.append(f),this.consoleOut.append(d),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let oe=new Map,tt=()=>{Array.from(document.getElementsByClassName("browser"),c=>oe.has(c)||oe.set(c,new mn(c)))};tt(),new MutationObserver(tt).observe(document.body,{childList:!0,subtree:!0});let ie={ownerElement:{},get browser(){return oe.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(c){this.browser?.assign(c,!0)},replace(c){this.browser?.replace(c,!0)}},pn={pushState(c,i,l){ie.browser?.assign(l,!1)},replaceState(c,i,l){ie.browser?.replace(l,!1)}},nt;y={XMLHttpRequest:Ze,EventSource:cn,location:ie,history:pn,window:{addEventListener(c,i){c==="popstate"&&(nt=i)}},console:{ownerElement:{},get browser(){return oe.get(this.ownerElement.closest(".browser"))},log(c){this.browser?.log(c)},error(c){this.browser?.log(c)}},fetch:an}}var ke=[],rt=[],st=[],ot=[],it=[],at=[],Te,de=!1,me=!1,Ne=!1,q=new Set,ee=new Set,te=new Set,_=new Set,B=new Set,F=new Event("failure"),O=()=>Ne=!0,lt=()=>Ne,ct=()=>Ne=!1,Ce=e=>ke.push(e.target),U=(...e)=>ke.push(...e),dt=()=>ke.pop(),mt=e=>rt.push(e),pt=()=>rt.pop(),ut=e=>st.push(e),ht=()=>st.pop(),ft=e=>ot.push(e),gt=()=>ot.pop(),vt=()=>Te=void 0,Et=()=>Te,bt=e=>Te=e,L=()=>de=!0,yt=()=>de,wt=()=>de=!1,C=()=>me=!0,pe=()=>de=me=!0,xt=()=>me,St=()=>me=!1,Rt=e=>it.push(e),Lt=()=>it.pop(),ue=(e,t)=>at.push([e,t]),At=()=>at.pop();var he=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var Me=e=>{for(let t of e.xhr??[])t.onloadend=t.onerror=t.ontimeout=null,t.abort();e.xhr=void 0};var kt=({target:{ownerElement:e}})=>{e.isError=!0,L(),e.dispatchEvent(F)};var fe=e=>{if(e.xhr){for(let{readyState:t}of e.xhr)if(t!==4)return!0}return!1};var Tt=({target:{ownerElement:e}})=>{let t=e.xhr;t&&!fe(e)&&(e.xhr=void 0,U(...t))};var gn=new Event("timeout"),Nt=({target:{ownerElement:e}})=>{e.isError=e.isTimeout=!0,L(),e.dispatchEvent(F),e.dispatchEvent(gn)};var Ct={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},De=Object.keys(Ct),vn=/\/+$/,ne=e=>{y.location.ownerElement=e,y.console.ownerElement=e;let t=De.find(e.hasAttribute,e),n=t?e.getAttribute(t):"",r=y.location.href,o,s;try{o=new URL(n,r)}catch(b){(s=e.hasAttribute("log"))&&y.console.error(b);try{o=new URL("",r)}catch(k){s&&y.console.error(k),o=new URL("about:blank")}}let a=o.pathname.replace(vn,"");o.pathname=!a||a.lastIndexOf(".")<=a.lastIndexOf("/")?a+"/":a;let h=Ct[t]??"GET",g=e.getAttributeNode("method");return g&&(h=g.value.toUpperCase()),[o,h,e.hasAttribute("credentials")]};var En=new Event("conceal"),bn=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(En)},Pe=new IntersectionObserver(bn);var yn=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;L()},Oe=new IntersectionObserver(yn);var wn=e=>{let t,n,r,o=!1;for(let s of e)({target:t,contentRect:{width:n,height:r}}=s),(n||r||t.offsetParent!=null)&&(t.sizeEntry=s,o=!0);o&&C()},ge=new ResizeObserver(wn);var xn=new Event("reveal"),Sn=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(xn)},He=new IntersectionObserver(Sn);var Rn=new DOMParser,ve=e=>Rn.parseFromString(e,"text/html");var re=class extends Set{constructor(n,r,o,s){super();this.url=n;this.withCredentials=r;this.onMessage=o;for(let a of s)this.add(a)}url;withCredentials;onMessage;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===y.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,ve(r));open(){this.source=new y.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,o=this.difference(n),s=n.difference(this);for(let a of o)super.delete(a),this.removeEventListener(a,this.handleMessage);for(let a of s)super.add(a);!r&&this.size?this.open():r&&!this.size&&this.close();for(let a of s)this.addEventListener(a,this.handleMessage)}};var M=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(U))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,o)=>{let s;for(let a of this.elements){let[h,,g]=ne(a);this.getEvent(a)===r&&h.href===n.url.href&&g===n.withCredentials&&this.onPayload({ownerElement:a,responseXML:s?s.cloneNode(!0):s=o,status:200})}};start(){let n=new Map,r=new Map,o=new Set;for(let s of this.elements){let[a,,h]=ne(s),g=this.has(a.href)?n:r,b=g.get(a.href);b||g.set(a.href,b=[new Set,new Set,a]),b[+h].add(this.getEvent(s)),o.add(a.href)}for(let[s,[a,h]]of this)o.has(s)||(a.clear(),h.clear(),this.delete(s));for(let[s,[a,h]]of n){let[g,b]=this.get(s);g.reconcileWith(a),b.reconcileWith(h)}for(let[s,[a,h,g]]of r)this.set(s,[new re(g,!1,this.onMessage,a),new re(g,!0,this.onMessage,h)])}stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var Mt=e=>Object.prototype.toString.call(e)==="[object RegExp]";var Dt,Pt=e=>Dt=e,Ot=()=>Dt;var Ht=new Set,Ln=["INPUT","SELECT","TEXTAREA"];function be(e){return!e||(typeof e=="string"?e===this:Mt(e)?e.test(this):e.some(be,this))}function Ee({attributes:e}){for(let{name:t}of e)if(be.call(t,this.match))return!1;return!0}var It=[{match:["if:intersects","ref:width","ref:height"],gate:({sizeEntry:e})=>!e,added(e){let t=e.getBoundingClientRect(),n=[{blockSize:t.height,inlineSize:t.width}];e.sizeEntry={borderBoxSize:n,contentBoxSize:n,devicePixelContentBoxSize:n,contentRect:t,target:e}}},{gate:(e,t)=>e.hasAttribute(`on:attr:${t}`),addedAttr:ue,removedAttr:ue,changed:ue},{match:[/^ref:/,/^link:/],added:C,removed:C,changed:C},{gate:(e,t)=>e.hasAttribute(`ref:${t}`),added:C,removed:C,changed:C},{match:["ref:width","ref:height"],added:e=>ge.observe(e),destroyed:e=>ge.unobserve(e)},{match:["ref:width","ref:height"],gate:Ee,removed:e=>ge.unobserve(e)},{match:/^ref:/,added:e=>_.add(e),destroyed:e=>_.delete(e)},{match:/^ref:/,gate:Ee,removed:e=>_.delete(e)},{match:/^link:/,added:e=>B.add(e),destroyed:e=>B.delete(e)},{match:/^link:/,gate:Ee,removed:e=>B.delete(e)},{match:"autofocus",added:bt},{match:"clear-timeout",added:e=>Z.add(e),removed:e=>Z.delete(e)},{match:"if",added:e=>ee.add(e),removed:e=>ee.delete(e)},{match:["if",/^if:/],added:L,removed:L,changed:L},{match:/^if:/,added:e=>q.add(e),destroyed:e=>q.delete(e)},{match:/^if:/,gate:Ee,removed:e=>q.delete(e)},{match:"if:intersects",added:e=>Oe.observe(e),removed:e=>Oe.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:o}=e.sizeEntry.contentRect;e.isIntersecting=r>0&&n>0&&o<innerWidth&&t<innerHeight}},{match:"on",added:e=>Y.add(e),removed:e=>Y.delete(e)},{match:/^on:/,gate:(e,t)=>!Ht.has(t),added(e,t){Ht.add(t),document.addEventListener(t.slice(3),Ot(),!0)}},{match:"on:conceal",added:e=>Pe.observe(e),removed:e=>Pe.unobserve(e)},{match:"on:navigate",added:e=>K.add(e),removed:e=>K.delete(e)},{match:"on:reveal",added:e=>He.observe(e),removed:e=>He.unobserve(e)},{match:"on:discover",added:Rt},{match:"render",added:e=>te.add(e),removed:e=>te.delete(e)},{match:"reset",added:e=>J.add(e),removed:e=>J.delete(e)},{match:"scroll",added:e=>Q.add(e),removed:e=>Q.delete(e)},{match:"sse",added:M.instance.addElement,removed:M.instance.deleteElement},{match:"sse",added:O,removed:O,changed:O},{match:De.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:O,removed:O,changed:O},{match:"value",gate:e=>!Ln.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.append(e.getAttribute("name"),e.getAttribute("value"))}];var W=1,Ie=2,ye=4,ze=8,qe=16,_e=32,Be=64,Fe=128,we=(e,t,n,r)=>{for(let o of It)be.call(n,o.match)&&(!o.gate||o.gate(t,n,r))&&(e&W&&o.added?.(t,n,r),e&Ie&&o.addedAttr?.(t,n,r),e&ye&&o.removed?.(t,n,r),e&ze&&o.removedAttr?.(t,n,r),e&qe&&o.changed?.(t,n,r),e&_e&&o.created?.(t,n,r),e&Be&&o.destroyed?.(t,n,r),e&Fe&&o.serialize?.(t,n,r))};var V=e=>e?.nodeType===Node.ELEMENT_NODE;var H=(e,t,n)=>{for(let r=0,o=t.length,s,a,h;r<o;++r)if(V(s=t[r])){a=document.createNodeIterator(s,NodeFilter.SHOW_ELEMENT);do for(h of s.attributes)we(e,s,h.name,n);while(s=a.nextNode())}};var zt=e=>e.tagName==="FORM";var qt=document.createElement("form"),xe=e=>{let t=new FormData(zt(e)?e:(qt.replaceChildren(e.cloneNode(!0)),qt));return H(Fe,[e],{formData:t}),t};var An=/<!--\s*keml\s*-->/i,kn={stream:!0},Tn=new TextDecoder,Se=class{responseType;ownerElement;url;onloadend;onerror;init={headers:{}};responseText="";open(t,n){this.init.method=t,this.url=n}setRequestHeader(t,n){this.init.headers[t]=n}set withCredentials(t){t&&(this.init.credentials="include")}async send(t){t&&(this.init.body=t);let n,r;try{({status:n,body:r}=await y.fetch(this.url,this.init))}catch(o){y.console.ownerElement=this.ownerElement,y.console.error(o),this.onerror({target:{status:0,responseXML:null,ownerElement:this.ownerElement}})}if(r&&n!=null){for await(let o of r){this.responseText+=Tn.decode(o,kn);let s;for(;s=An.exec(this.responseText);)this.respond(this.responseText.slice(0,s.index),n),this.responseText=this.responseText.slice(s.index+s[0].length)}this.respond(this.responseText,n)}}respond(t,n){this.onloadend({target:{status:n,responseXML:ve(t),ownerElement:this.ownerElement}})}};var j=e=>e.timeoutId=clearTimeout(e.timeoutId);var Nn=Object.create(null),Re=e=>{if(j(e),e.checkValidity?.()??!0){e.hasAttribute("once")&&mt(e);let t=e.getAttribute("redirect"),[n,r,o]=ne(e);if(y.location.ownerElement=e,t==="pushState"||t==="replaceState")he(n,xe(e)),y.history[t](Nn,"",n),ce();else if(t==="assign"||t==="replace")he(n,xe(e)),y.location[t](n);else if(n.protocol==="about:"&&n.pathname==="blank/")U({ownerElement:e,status:200,responseXML:null});else{let s;if(e.hasAttribute("stream"))s=new Se,s.onloadend=Ce,Me(e);else{let h=e.getAttribute("request-mode");if(e.xhr&&h==="ignore")return;s=new y.XMLHttpRequest,s.onloadend=h==="queue"?Tt:Ce,s.ontimeout=Nt,s.timeout=Number(e.getAttribute("timeout")),h==="replace"&&Me(e),e.xhr?e.xhr.unshift(s):e.xhr=[s]}let a=xe(e);r==="GET"&&(a=he(n,a)),s.responseType="document",s.withCredentials=o,s.ownerElement=e,s.onerror=kt,s.open(r,n),s.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:h,value:g}of e.attributes)h.startsWith("h-")&&s.setRequestHeader(h.slice(2),g);e.isError=!1,e.isTimeout=!1,e.isLoading=!0,L(),s.send(a)}}};var _t=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(Re,+t.value,e):(t=e.getAttributeNode("debounce"))?(j(e),e.timeoutId=setTimeout(Re,+t.value,e)):Re(e)};var We=Symbol.for("truthy"),Ue=(e,t)=>{let n=[],r=e.length,o=0;for(let s=0,a=0,h=0,g,b,k,T;s<r;++s){if(b=e.charCodeAt(s),g){if(b===g){for(k=0,T=s-1;T>=0&&e.charCodeAt(T)===92;)++k,--T;k%2===0&&(g=0)}continue}switch(b){case 34:case 39:g=b;break;case 123:++a;break;case 125:--a;break;case 91:++h;break;case 93:--h;break;default:b===t&&a===0&&h===0&&!g&&(n.push(e.slice(o,s)),o=s+1);break}}return n.push(e.slice(o,r)),n},Bt=(e="")=>{e=e.trim();let t=e.length-1,n=e.charCodeAt(0),r=e.charCodeAt(t);if(n===39&&r===39)return e.slice(1,t);if(n===34&&r===34)return JSON.parse(e);if(n===123&&r===125)return Ft(e.slice(1,t),We);if(n===91&&r===93){let o=e.slice(1,t);return o?Ue(o,44).map(Bt):[]}try{return JSON.parse(e)}catch{}return e},Ft=(e,t=!0)=>{let n={},r,o;for(let s of Ue(e,44))[r,o]=Ue(s,61),(r=r?.trim())&&(o==null?n[r]=t:n[r]=Bt(o));return n},Ut=(e,t)=>{if(e===We)return!!t;if(e&&typeof e=="object"){if(!t||typeof t!="object")return!1;for(let n in e)if(!Ut(e[n],t[n]))return!1;return!0}return e+""==t+""},Wt=(e,t)=>Ut(Ft(e,We),t);var G=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));var Cn=[[Y,"on",_t],[J,"reset",ut],[Q,"scroll",ft],[Z,"clear-timeout",j]],Vt=e=>{let{target:t,type:n}=e;if(V(t)){let r=`on:${n}`,o=t,s;for(;o&&!(s=o.getAttributeNode(r));)o=o.parentElement;if(o&&s){let a=s.value;if((s=o.getAttributeNode(`event:${n}`))&&(y.console.ownerElement=o,o.hasAttribute("log")&&y.console.log(e),!Wt(s.value,e)))return;e.preventDefault();for(let[h,g,b]of Cn)for(o of h)G(a,o.getAttribute(g))&&b(o)}}};var jt=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var Gt=e=>Object.prototype.toString.call(e)==="[object FileList]";var Ve=(e,t,n=0)=>{for(let r=n,o=e.length,s,a=t.nodeName,h=t.getAttribute?.("key");r<o;++r)if(a===(s=e[r]).nodeName&&h==s.getAttribute?.("key"))return[s,r]};function Xt({name:e}){return this===e}var je=e=>e!=null;var Mn={value:e=>e??"",checked:je,selected:je},w=(e,t,n)=>{let r,o,s;if(typeof t=="string"?o=e.getAttributeNode(r=t):(o=t,r=t.name),o?n==null?e.removeAttributeNode(o):o.value!=n&&(o.value=n):n==null||e.setAttribute(r,n),(s=Mn[r])&&r in e){let a=s(n);e[r]==a||(e[r]=a)}};var $t=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:o}=n,s=r.slice(2),a=t.find(Xt,s);r.startsWith("x-")?a?(w(e,n,a.value),w(e,a,o)):(w(e,n),w(e,"d-"+s,""),w(e,s,o)):r.startsWith("d-")&&(a&&(w(e,"x-"+s,a.value),w(e,a)),w(e,n))}},Kt=e=>{e.hasAttribute("state")||($t(e),w(e,"state",""))},Le=e=>{let t=e.getAttributeNode("state");t&&(w(e,t),$t(e))};var Yt=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),V(e)){Le(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||w(e,r);for(let{name:o,value:s}of t.attributes)w(e,o,s);Ae.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},Ae={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=Ve(t,e),o,s;r?([o,s]=r,s&&e.before(...t.slice(0,s)),++s):(o=t[0],s=1),n>s&&e.after(...t.slice(s)),Yt(e,o)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,o=n.length,s=0,a,h;for(;s<r;++s)h=Ve(n,a=t[s],s),h?(h[1]===s||e.insertBefore(h[0],n[s]),Yt(n[s],a)):s<o++?e.insertBefore(a,n[s]):e.appendChild(a);for(;o>r;)e.removeChild(n[--o])}};var Ge=["borderBoxSize","contentBoxSize","devicePixelContentBoxSize","contentRect"],Jt=(e,t)=>{if(t==="width"||t==="height"){let{sizeEntry:n}=e,r=e.getAttribute("measure"),o,s;return Ge.includes(r)||(r=Ge[0]),r===Ge[3]?{width:o,height:s}=n[r]:{inlineSize:o,blockSize:s}=n[r][0],t==="width"?o:s}return t in e?e[t]:e.getAttribute(t)};var Xe=!1,$e=[],Dn=()=>{let e;for(;e=$e.pop();)e[0](e[1],e[2])},Pn=()=>{Xe=!1},Qt=()=>{!Xe&&$e.length&&(Xe=!0,document.startViewTransition(Dn).finished.finally(Pn))},Zt=(e,t,n)=>!!document.startViewTransition&&t.hasAttribute("transition")&&$e.push([e,t,n]);var Ke=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let o=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=o/2|0:r==="end"&&(t[n]=o)}else t[n]=+r};var On=[],en=["auto","instant","smooth"],Hn=new Event("result"),In=new Event("discover"),tn=new Map,Ye=()=>{let e,t,n,r,o,s,a,h,g,b,k,T,P,X,N,S,I,A,$,D;for(;e=ht();)e.reset?.();for(;e=pt();)w(e,"on");for(;o=dt();)if({ownerElement:t,status:N,responseXML:r}=o,(t.isLoading=fe(t))||(t.xhr=void 0),L(),N!==0){g=t.getAttribute((t.isError=N>399)?"error":"result"),T=[],n=void 0;for(e of te)G(g,e.getAttribute("render"))&&T.push([e,r?Array.from((n?n.cloneNode(!0):n=r.body).childNodes):On]);for(;k=T.pop();)[e,X]=k,P=Ae[e.getAttribute("position")]??Ae.replaceChildren,Zt(P,e,X)||P(e,X);t.dispatchEvent(t.isError?F:Hn)}if(Qt(),yt()){wt(),b=[];for(e of q)!(e.checkValidity?.()??!0)&&(S=e.getAttributeNode("if:invalid"))&&b.push(S.value),(I=jt(e))&&(!Gt(I)||I.length)&&(S=e.getAttributeNode("if:value"))&&b.push(S.value),e.isIntersecting&&(S=e.getAttributeNode("if:intersects"))&&b.push(S.value),e.isLoading&&(S=e.getAttributeNode("if:loading"))&&b.push(S.value),e.isError&&(S=e.getAttributeNode("if:error"))&&b.push(S.value),e.isTimeout&&(S=e.getAttributeNode("if:timeout"))&&b.push(S.value);g=b.join(" ");for(e of ee)G(g,e.getAttribute("if"))?Kt(e):Le(e)}if(xt()){St();for(e of B)for({name:s,value:h}of e.attributes)if(s.startsWith("link:")){s=s.slice(5);for(n of _)for({name:a,value:g}of n.attributes)a.startsWith("ref:")&&G(g,h)&&w(e,s,Jt(n,a.slice(4)))}}for(;e=gt();)A={behavior:en.includes(h=e.getAttribute("behavior"))?h:en[0]},Ke(e,A,"top"),Ke(e,A,"left"),("top"in A||"left"in A)&&(e.hasAttribute("relative")?e.scrollBy(A):e.scroll(A));for(;e=Lt();)e.dispatchEvent(In);for(;$=At();)[e,s]=$,D=tn.get(s),D||tn.set(s,D=new Event("attr:"+s)),e.dispatchEvent(D);if(lt()&&(ct(),M.instance.start()),e=Et()){vt();try{N=e.value.length,e.focus(),e.setSelectionRange(N,N)}catch{}}requestAnimationFrame(Ye)};var zn=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:o,target:s}of e)if(H(ye|Be,o),H(W|_e,t),n){let a=s.hasAttribute(n),h=r!=null,g;a&&!h&&(g=W|Ie),!a&&h&&(g=ye|ze),we(g??qe,s,n)}},nn=new MutationObserver(zn);var Je=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}Pt(Vt),H(W,document.childNodes),nn.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",pe,!0),document.addEventListener("input",pe,!0),document.addEventListener("reset",pe,!0),y.window.addEventListener("popstate",ce,!0),window.addEventListener("beforeunload",M.instance.stop,!0),requestAnimationFrame(Ye)};var rn=Symbol.for("keml");window[rn]||(window[rn]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Je,!0):Je());})();
