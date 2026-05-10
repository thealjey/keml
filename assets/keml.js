/*!
 * keml 3.4.0 Enhance HTML with custom attributes for clean, server-driven interactivity.
 * Docs: https://thealjey.github.io/keml/
 * Repo: https://github.com/thealjey/keml/
 * MIT (see LICENSE)
 */
"use strict";(()=>{var d=[[1,"event-modifier","event-modifier"],[1,"endpoint-override","endpoint-override"],[1,"expensive","expensive"],[1,"form-submit","form-submit"],[1,"request-headers","request-headers"],[1,"parent-handler","parent-handler"],[1,"once","once"],[1,"result-success","result-success"],[1,"result-failure","result-failure"],[1,"position","position"],[1,"key","key"],[1,"polling","polling"],[3,"if-loading","if-loading"],[1,"if-error","if-error"],[4,"sse","sse"],[1,"https://www.example.com/nefarious","credentials"],[0,"https://www.log-example.com","log"],[0,"https://www.assign-example.com/page-a","location-assign-a"],[0,"https://www.assign-example.com/page-b","location-assign-b"],[0,"https://www.assign-example.com/page-c","location-assign-c"],[0,"https://www.replace-example.com/page-a","location-replace-a"],[0,"https://www.replace-example.com/page-b","location-replace-b"],[0,"https://www.replace-example.com/page-c","location-assign-c"],[0,"https://www.history-example.com/page-a","history-home"],[1,"https://www.history-example.com/page-a","history-a"],[1,"https://www.history-example.com/page-b","history-b"],[1,"https://www.history-example.com/page-c","history-c"]];var p={credentials:`<small class="chip mt3">Ha!</small>

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
`};var R=new Set,k=new Set,A=new Set,N=new Set;var $e=new Event("navigate"),B=()=>{for(let e of R)e.dispatchEvent($e)};var v;{let t=function(h){let a=[],l=0,f=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;a.push("let out = [];");let m;for(;m=f.exec(h);){let g=m[0],x=m.index;if(a.push(`out.push(${JSON.stringify(h.slice(l,x))});`),g.startsWith("{{"))a.push(g.slice(2,-2).trim());else{let S=g.slice(1,-1).trim();a.push(`out.push(String(${S}));`)}l=x+g.length}return a.push(`out.push(${JSON.stringify(h.slice(l))});`),a.push("return out.join('');"),new Function("server",a.join(`
`))};Ye=t;let e=new DOMParser,n=Object.fromEntries(Object.entries(p).map(([h,a])=>[h,t(a)])),r=d.map(([h,a,l])=>[h,new RegExp(a),n[l]]),o=1,s=2,i=4;class c{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;getParam(a){return this.data?this.data.get(a):this.url.searchParams.get(a)}get partial(){return this.render(1)[1]}onloadend(a){}open(a,l){this.method=a,this.url=l}setRequestHeader(a,l){this.headers.set(a,l)}render(a){for(let[l,f,m]of r)if(m&&f.test(this.url.href)&&(l&o)===((a??+this.headers.has("X-Requested-With"))&o))return[l,m(this)];return[0,""]}respond=()=>this.onloadend({target:this});send(a){this.data=a;let[l,f]=this.render(),m=(l&s)===s;this.responseXML=e.parseFromString(f,"text/html"),m?setTimeout(this.respond,2e3):this.respond()}}let u=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]];class w{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(a){this.url=typeof a=="string"?new URL(a):a;for(let[l,f,m]of r)if(m&&f.test(this.url.href)&&(l&i)===i){m(this);break}}addIntervalId(a){this.intervals.push(a)}timeSince(a){let l=Date.now()-a,f,m=-1,g,x,S=new Array(6);for(;++m<6;)f=u[m],x=f[2],g=l/x|0,l-=g*x,S[m]=[(m>3&&g<10?"0":"")+g,f[+(g===1)]];return S}dispatchEvent(a,l){for(let f of this.listeners.get(a)??[])f({type:a,data:l})}addEventListener(a,l){this.listeners.getOrInsert(a,new Set).add(l)}removeEventListener(a,l){let f=this.listeners.get(a);f&&(f.delete(l),f.size||this.listeners.delete(a))}close(){this.listeners.clear();for(let a of this.intervals)clearInterval(a);this.intervals=[]}}let j=h=>{let a={},l=h,f=0;for(;++f<3&&l&&l!==Object.prototype;){for(let m of Object.getOwnPropertyNames(l))if(!(m in a)){try{if(h[m]===l[m])continue}catch{}try{a[m]=h[m]}catch{}}l=Object.getPrototypeOf(l)}return a};class je{constructor(a){this.el=a;let{children:[l,f,m]}=a,g=l.children;this.backBtn=g[0],this.forwardBtn=g[1],g[2].childNodes.length||g[2].appendChild(document.createTextNode("")),this.address=g[2].firstChild,this.viewport=f,this.consoleClear=m?.children[0]?.children[0],this.consoleOut=m?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=a,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let x=this.address.nodeValue?.trim();x&&(this.stack.push([new URL(x),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new c;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:a}})=>this.viewport.replaceChildren(...a?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(a){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",a?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(I.ownerElement=this.el,se())}get url(){return this.stack[this.index]?.[0]}assign(a,l){++this.index,this.replace(a,l)}replace(a,l){this.stack.length=this.index+1,this.stack[this.index]=[a,l],this.render(l)}log(a){if(!this.consoleOut)return;let l=new WeakSet,f=document.createElement("p"),m=JSON.stringify(a,(x,S)=>{if(!(typeof S=="function"||typeof S>"u"))return typeof S=="object"&&S!==null?l.has(S)?void 0:(l.add(S),j(S)):S}),g=document.createTextNode(m);f.setAttribute("title",m),f.classList.add("mv0"),f.append(g),this.consoleOut.append(f),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let H=new Map,re=()=>{Array.from(document.getElementsByClassName("browser"),h=>H.has(h)||H.set(h,new je(h)))};re(),new MutationObserver(re).observe(document.body,{childList:!0,subtree:!0});let I={ownerElement:{},get browser(){return H.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(h){this.browser?.assign(h,!0)},replace(h){this.browser?.replace(h,!0)}},ze={pushState(h,a,l){I.browser?.assign(l,!1)},replaceState(h,a,l){I.browser?.replace(l,!1)}},se;v={XMLHttpRequest:c,EventSource:w,location:I,history:ze,window:{addEventListener(h,a){h==="popstate"&&(se=a)}},console:{ownerElement:{},get browser(){return H.get(this.ownerElement.closest(".browser"))},log(h){this.browser?.log(h)}}}}var Ye;var oe=[],ie=[],ae=[],le=[],ce=[],z,_=!1,C=new Set,M=new Set,O=new Set,q=e=>oe.push(e),de=()=>oe.pop(),pe=e=>ie.push(e),he=()=>ie.pop(),me=e=>ae.push(e),ue=()=>ae.pop(),fe=e=>le.push(e),ge=()=>le.pop(),ve=()=>z=void 0,Ee=()=>z,be=e=>z=e,E=()=>_=!0,ye=()=>_,we=()=>_=!1,Se=e=>ce.push(e),xe=()=>ce.pop();var Je=new Event("reveal"),Ke=new Event("conceal"),Qe=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(Je)},Ze=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(Ke)},G=new IntersectionObserver(Qe),$=new IntersectionObserver(Ze);var et=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;E()},Y=new IntersectionObserver(et);var Le={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},J=Object.keys(Le),tt=/\/+$/,P=e=>{let t=J.find(e.hasAttribute,e),n=e.getAttributeNode("method"),r=t?e.getAttribute(t):"",o=Le[t]??"GET";return n&&(o=n.value.toUpperCase()),r&&(r=r.replace(tt,""),(!r||r.lastIndexOf(".")<=r.lastIndexOf("/"))&&(r+="/")),v.location.ownerElement=e,[new URL(r,v.location.href),o,!!e.hasAttribute("credentials")]};var T=class e extends Set{constructor(n,r,o,s){super();this.url=n;this.withCredentials=r;this.onMessage=o;for(let i of s)this.add(i)}url;withCredentials;onMessage;static parser=new DOMParser;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===v.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,e.parser.parseFromString(r,"text/html"));open(){this.source=new v.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,o=this.difference(n),s=n.difference(this);for(let i of o)super.delete(i),this.removeEventListener(i,this.handleMessage);for(let i of s)super.add(i);!r&&this.size?this.open():r&&!this.size&&this.close();for(let i of s)this.addEventListener(i,this.handleMessage)}};var y=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(q))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,o)=>{let s;for(let i of this.elements){let[c,,u]=P(i);this.getEvent(i)===r&&c.href===n.url.href&&u===n.withCredentials&&this.onPayload({target:{ownerElement:i,responseXML:s?s.cloneNode(!0):s=o,status:200}})}};start=()=>{let n=new Map,r=new Map,o=new Set;for(let s of this.elements){let[i,,c]=P(s),u=this.has(i.href)?n:r,w=u.get(i.href);w||u.set(i.href,w=[new Set,new Set,i]),w[+c].add(this.getEvent(s)),o.add(i.href)}for(let[s,[i,c]]of this)o.has(s)||(i.clear(),c.clear(),this.delete(s));for(let[s,[i,c]]of n){let[u,w]=this.get(s);u.reconcileWith(i),w.reconcileWith(c)}for(let[s,[i,c,u]]of r)this.set(s,[new T(u,!1,this.onMessage,i),new T(u,!0,this.onMessage,c)])};stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var Re=0,ke,Ae=e=>Re=e,Ne=()=>Re,Ce=e=>ke=e,Me=()=>ke;var Oe=new Set,Pe=[{match:"autofocus",added:be},{match:"if",added:e=>M.add(e),removed:e=>M.delete(e)},{match:"if",added:E,removed:E,changed:E},{match:/^if:/,added:e=>C.add(e),removed:e=>C.delete(e)},{match:/^if:/,added:E,removed:E,changed:E},{match:"if:intersects",added:e=>Y.observe(e),removed:e=>Y.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:o}=e.getBoundingClientRect();e.isIntersecting=r>0&&n>0&&o<innerWidth&&t<innerHeight}},{match:"on",added:e=>k.add(e),removed:e=>k.delete(e)},{match:/^on:/,gate:(e,t)=>!Oe.has(t),added(e,t){Oe.add(t),document.addEventListener(t.slice(3),Me(),!0)}},{match:"on:conceal",added:e=>$.observe(e),removed:e=>$.unobserve(e)},{match:"on:navigate",added:e=>R.add(e),removed:e=>R.delete(e)},{match:"on:reveal",added:e=>G.observe(e),removed:e=>G.unobserve(e)},{match:"on:discover",added:Se},{match:"render",added:e=>O.add(e),removed:e=>O.delete(e)},{match:"reset",added:e=>A.add(e),removed:e=>A.delete(e)},{match:"scroll",added:e=>N.add(e),removed:e=>N.delete(e)},{match:"sse",added:y.instance.addElement,removed:y.instance.deleteElement},{match:"sse",phase:1,added:y.instance.start,removed:y.instance.start,changed:y.instance.start},{match:Object.keys(J).concat("credentials"),gate:e=>e.hasAttribute("sse"),phase:1,added:y.instance.start,removed:y.instance.start,changed:y.instance.start},{match:"value",gate:e=>!(e instanceof HTMLInputElement)&&!(e instanceof HTMLSelectElement)&&!(e instanceof HTMLTextAreaElement)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.data?.set(e.getAttribute("name"),e.getAttribute("value"))}];var F=e=>(t,n,r)=>{for(let{match:o,gate:s,phase:i,added:c,removed:u,changed:w,serialize:j}of Pe)(i==null||i===Ne())&&(!o||(typeof o=="string"?n===o:Array.isArray(o)?o.includes(n):o.test(n)))&&(!s||s(t,n,r))&&(e?e===1?u:e===2?w:j:c)?.(t,n,r)},K=[F(0),F(1),F(2),F(3)],L=(e,t,n)=>{for(let r=0,o=e.length,s,i,c,u,w=K[t];r<o;++r)if((s=e[r])instanceof Element){i=document.createNodeIterator(s,NodeFilter.SHOW_ELEMENT);do for({ownerElement:c,name:u}of s.attributes)w(c,u,n);while(s=i.nextNode())}};var W=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var Te=document.createElement("form"),nt=Object.create(null),U=e=>{if(e.timeoutId=clearTimeout(e.timeoutId),e.checkValidity?.()??!0){e.hasAttribute("once")&&pe(e);let t=new FormData(e instanceof HTMLFormElement?e:(Te.replaceChildren(e.cloneNode(!0)),Te));L([e],3,{data:t});let n=e.getAttribute("redirect"),[r,o,s]=P(e);if(v.location.ownerElement=e,n==="pushState"||n==="replaceState")W(r,t),v.history[n](nt,"",r),B();else if(n==="assign"||n==="replace")W(r,t),v.location[n](r);else{o==="GET"&&(t=W(r,t));let i=new v.XMLHttpRequest;i.responseType="document",i.withCredentials=s,i.ownerElement=e,i.onloadend=q,i.open(o,r),i.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:c,value:u}of e.attributes)c.startsWith("h-")&&i.setRequestHeader(c.slice(2),u);e.isError=!1,e.isLoading=!0,E(),i.send(t)}}};var De=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(U,+t.value,e):(t=e.getAttributeNode("debounce"))?(clearTimeout(e.timeoutId),e.timeoutId=setTimeout(U,+t.value,e)):U(e)};var D=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function He(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var rt=[[k,"on",De],[A,"reset",me],[N,"scroll",fe]],Ie=e=>{let{target:t,type:n}=e;if(t instanceof Element){let r=`on:${n}`,o=t,s;for(;o&&!(s=o.getAttributeNode(r));)o=o.parentElement;if(o&&s){let i=s.value;if((s=o.getAttributeNode(`event:${n}`))&&(v.console.ownerElement=o,o.hasAttribute("log")&&v.console.log(e),s.value.split(",").find(He,e)))return;e.preventDefault();for(let[c,u,w]of rt)for(o of c)D(i,o.getAttribute(u))&&w(o)}}};var Q=(e,t,n=0)=>{for(let r=n,o=e.length,s,i=t.nodeName,c=t.getAttribute?.("key");r<o;++r)if(i===(s=e[r]).nodeName&&c==s.getAttribute?.("key"))return[s,r]};function Be({name:e}){return this===e}var Z=e=>e!=null;var st=[["value",e=>e??""],["checked",Z],["selected",Z]],b=(e,t,n)=>{let r,o;typeof t=="string"?o=e.getAttributeNode(r=t):(o=t,r=t.name),o?n==null?e.removeAttributeNode(o):o.value!==n&&(o.value=n):n==null||e.setAttribute(r,n);for(let[s,i]of st)if(r===s&&r in e){let c=i(n);e[r]===c||(e[r]=c)}};var qe=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:o}=n,s=r.slice(2),i=t.find(Be,s);r.startsWith("x-")?i?(b(e,n,i.value),b(e,i,o)):(b(e,n),b(e,"d-"+s,""),b(e,s,o)):r.startsWith("d-")&&(i&&(b(e,"x-"+s,i.value),b(e,i)),b(e,n))}},Fe=e=>{e.hasAttribute("state")||(qe(e),b(e,"state",""))},X=e=>{let t=e.getAttributeNode("state");t&&(b(e,t),qe(e))};var We=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),e instanceof Element){X(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||b(e,r);for(let{name:o,value:s}of t.attributes)b(e,o,s);V.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},V={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=Q(t,e),o,s;r?([o,s]=r,s&&e.before(...t.slice(0,s)),++s):(o=t[0],s=1),n>s&&e.after(...t.slice(s)),We(e,o)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,o=n.length,s=0,i,c;for(;s<r;++s)c=Q(n,i=t[s],s),c?(c[1]===s||e.insertBefore(c[0],n[s]),We(n[s],i)):s<o++?e.insertBefore(i,n[s]):e.appendChild(i);for(;o>r;)e.removeChild(n[--o])}};var ee=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let o=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=o/2|0:r==="end"&&(t[n]=o)}else t[n]=+r};var ot=[],Ue=["auto","instant","smooth"],it=new Event("result"),at=new Event("failure"),lt=new Event("discover"),te=()=>{let e,t,n,r,o,s,i,c,u;for(;e=ue();)e.reset?.();for(;e=he();)b(e,"on");for(;t=de();){({ownerElement:e,status:n,responseXML:r}=t.target),s=e.getAttribute((e.isError=n>399)?"error":"result"),o=[],c=void 0;for(t of O)D(s,t.getAttribute("render"))&&o.push([t,r?Array.from((c?c.cloneNode(!0):c=r.body).childNodes):ot]);for(;t=o.pop();)(V[t[0].getAttribute("position")]??V.replaceChildren)(...t);e.isLoading=!1,E(),e.dispatchEvent(e.isError?at:it)}if(ye()){we(),i=[];for(e of C)(e.checkValidity?.()??!0)||(t=e.getAttributeNode("if:invalid"))&&i.push(t.value),(e.type==="checkbox"?e.checked:e.value)&&(t=e.getAttributeNode("if:value"))&&i.push(t.value),e.isIntersecting&&(t=e.getAttributeNode("if:intersects"))&&i.push(t.value),e.isLoading&&(t=e.getAttributeNode("if:loading"))&&i.push(t.value),e.isError&&(t=e.getAttributeNode("if:error"))&&i.push(t.value);s=i.join(" ");for(e of M)(D(s,e.getAttribute("if"))?Fe:X)(e)}for(;e=ge();)u={behavior:Ue.includes(t=e.getAttribute("behavior"))?t:Ue[0]},ee(e,u,"top"),ee(e,u,"left"),("top"in u||"left"in u)&&e[e.hasAttribute("relative")?"scrollBy":"scroll"](u);for(;e=xe();)e.dispatchEvent(lt);if(e=Ee()){ve();try{t=e.value.length,e.focus(),e.setSelectionRange(t,t)}catch{}}requestAnimationFrame(te)};var ct=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:o,target:s}of e)L(o,1),L(t,0),n&&K[s.hasAttribute(n)?r==null?0:2:r==null?2:1](s,n)},Xe=new MutationObserver(ct);var ne=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}Ce(Ie),L(document.childNodes,0),Ae(1),y.instance.start(),Xe.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",E,!0),document.addEventListener("input",E,!0),document.addEventListener("reset",E,!0),v.window.addEventListener("popstate",B,!0),window.addEventListener("beforeunload",y.instance.stop,!0),requestAnimationFrame(te)};var Ve=Symbol.for("keml");window[Ve]||(window[Ve]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ne,!0):ne());})();
