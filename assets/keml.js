/*!
 * keml 3.4.6 Enhance HTML with custom attributes for clean, server-driven interactivity.
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
`};var A=new Set,C=new Set,M=new Set,O=new Set;var ot=new Event("navigate"),U=()=>{for(let e of A)e.dispatchEvent(ot)};var v;{let t=function(m){let a=[],l=0,u=/(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;a.push("let out = [];");let h;for(;h=u.exec(m);){let g=h[0],S=h.index;if(a.push(`out.push(${JSON.stringify(m.slice(l,S))});`),g.startsWith("{{"))a.push(g.slice(2,-2).trim());else{let b=g.slice(1,-1).trim();a.push(`out.push(String(${b}));`)}l=S+g.length}return a.push(`out.push(${JSON.stringify(m.slice(l))});`),a.push("return out.join('');"),new Function("server",a.join(`
`))};it=t;let e=new DOMParser,n=Object.fromEntries(Object.entries(p).map(([m,a])=>[m,t(a)])),r=d.map(([m,a,l])=>[m,new RegExp(a),n[l]]),i=1,s=2,o=4;class c{responseType="";responseXML;withCredentials=!1;ownerElement;method;url;data;headers=new Map;status=200;getParam(a){return this.data?this.data.get(a):this.url.searchParams.get(a)}get partial(){return this.render(1)[1]}onloadend(a){}open(a,l){this.method=a,this.url=l}setRequestHeader(a,l){this.headers.set(a,l)}render(a){for(let[l,u,h]of r)if(h&&u.test(this.url.href)&&(l&i)===((a??+this.headers.has("X-Requested-With"))&i))return[l,h(this)];return[0,""]}respond=()=>this.onloadend({target:this});send(a){this.data=a;let[l,u]=this.render(),h=(l&s)===s;this.responseXML=e.parseFromString(u,"text/html"),h?setTimeout(this.respond,2e3):this.respond()}}let f=[["years","year",31104e6],["months","month",2592e6],["days","day",864e5],["hours","hour",36e5],["minutes","minute",6e4],["seconds","second",1e3]],w=[[],[],[],[],[],[]];class Qe{static CLOSED=2;readyState=1;url;listeners=new Map;intervals=[];constructor(a){this.url=typeof a=="string"?new URL(a):a;for(let[l,u,h]of r)if(h&&u.test(this.url.href)&&(l&o)===o){h(this);break}}addIntervalId(a){this.intervals.push(a)}timeSince(a){let l=Date.now()-a,u,h=-1,g,S,b;for(;++h<6;)u=f[h],b=w[h],S=u[2],g=l/S|0,l-=g*S,b[0]=(h>3&&g<10?"0":"")+g,b[1]=u[+(g===1)];return w}dispatchEvent(a,l){for(let u of this.listeners.get(a)??[])u({type:a,data:l})}addEventListener(a,l){this.listeners.getOrInsert(a,new Set).add(l)}removeEventListener(a,l){let u=this.listeners.get(a);u&&(u.delete(l),u.size||this.listeners.delete(a))}close(){this.listeners.clear();for(let a of this.intervals)clearInterval(a);this.intervals=[]}}let et=m=>{let a={},l=m,u=0;for(;++u<3&&l&&l!==Object.prototype;){for(let h of Object.getOwnPropertyNames(l))if(!(h in a)){try{if(m[h]===l[h])continue}catch{}try{a[h]=m[h]}catch{}}l=Object.getPrototypeOf(l)}return a};class tt{constructor(a){this.el=a;let{children:[l,u,h]}=a,g=l.children;this.backBtn=g[0],this.forwardBtn=g[1],g[2].childNodes.length||g[2].appendChild(document.createTextNode("")),this.address=g[2].firstChild,this.viewport=u,this.consoleClear=h?.children[0]?.children[0],this.consoleOut=h?.children[1],this.backBtn.onclick=this.back,this.forwardBtn.onclick=this.forward,this.xhr.ownerElement=a,this.xhr.onloadend=this.onloadend,this.consoleClear&&(this.consoleClear.onclick=this.clear);let S=this.address.nodeValue?.trim();S&&(this.stack.push([new URL(S),!0]),this.index=0),this.render(!0)}el;stack=[];index=-1;backBtn;forwardBtn;address;viewport;xhr=new c;consoleClear;consoleOut;get backPossible(){return this.index>0}get forwardPossible(){return this.index<this.stack.length-1}onloadend=({target:{responseXML:a}})=>this.viewport.replaceChildren(...a?.body.childNodes??[]);back=()=>this.render(this.stack[--this.index][1]);forward=()=>this.render(this.stack[++this.index][1]);clear=()=>this.consoleOut?.replaceChildren();render(a){let l=this.url;this.backBtn.disabled=!this.backPossible,this.forwardBtn.disabled=!this.forwardPossible,this.address.nodeValue=l?.href??"about:blank",a?l&&(this.xhr.open("GET",l),this.xhr.send(void 0)):(q.ownerElement=this.el,de())}get url(){return this.stack[this.index]?.[0]}assign(a,l){++this.index,this.replace(a,l)}replace(a,l){this.stack.length=this.index+1,this.stack[this.index]=[a,l],this.render(l)}log(a){if(!this.consoleOut)return;let l=new WeakSet,u=document.createElement("p"),h=JSON.stringify(a,(S,b)=>{if(!(typeof b=="function"||typeof b>"u"))return typeof b=="object"&&b!==null?l.has(b)?void 0:(l.add(b),et(b)):b}),g=document.createTextNode(h);u.setAttribute("title",h),u.classList.add("mv0"),u.append(g),this.consoleOut.append(u),this.consoleOut.scrollTop=this.consoleOut.scrollHeight}}let B=new Map,ce=()=>{Array.from(document.getElementsByClassName("browser"),m=>B.has(m)||B.set(m,new tt(m)))};ce(),new MutationObserver(ce).observe(document.body,{childList:!0,subtree:!0});let q={ownerElement:{},get browser(){return B.get(this.ownerElement.closest(".browser"))},get href(){return this.browser?.url?.href??location.href},assign(m){this.browser?.assign(m,!0)},replace(m){this.browser?.replace(m,!0)}},nt={pushState(m,a,l){q.browser?.assign(l,!1)},replaceState(m,a,l){q.browser?.replace(l,!1)}},de;v={XMLHttpRequest:c,EventSource:Qe,location:q,history:nt,window:{addEventListener(m,a){m==="popstate"&&(de=a)}},console:{ownerElement:{},get browser(){return B.get(this.ownerElement.closest(".browser"))},log(m){this.browser?.log(m)}}}}var it;var pe=[],me=[],he=[],ue=[],fe=[],$,Y=!1,J=!1,T=new Set,D=new Set,P=new Set,L=()=>J=!0,ge=()=>J,ve=()=>J=!1,W=e=>pe.push(e),Ee=()=>pe.pop(),be=e=>me.push(e),ye=()=>me.pop(),we=e=>he.push(e),Se=()=>he.pop(),xe=e=>ue.push(e),Le=()=>ue.pop(),Re=()=>$=void 0,Ne=()=>$,ke=e=>$=e,y=()=>Y=!0,Ae=()=>Y,Ce=()=>Y=!1,Me=e=>fe.push(e),Oe=()=>fe.pop();var at=new Event("reveal"),lt=new Event("conceal"),ct=e=>{for(let{isIntersecting:t,target:n}of e)t&&n.dispatchEvent(at)},dt=e=>{for(let{isIntersecting:t,target:n}of e)t||n.dispatchEvent(lt)},K=new IntersectionObserver(ct),Z=new IntersectionObserver(dt);var pt=e=>{for(let{target:t,isIntersecting:n}of e)t.isIntersecting=n;y()},Q=new IntersectionObserver(pt);var Te={get:"GET",post:"POST",put:"PUT",delete:"DELETE",href:"GET",action:"GET",src:"GET"},ee=Object.keys(Te),mt=/\/+$/,H=e=>{let t=ee.find(e.hasAttribute,e),n=e.getAttributeNode("method"),r=t?e.getAttribute(t):"",i=Te[t]??"GET";return n&&(i=n.value.toUpperCase()),r&&(r=r.replace(mt,""),(!r||r.lastIndexOf(".")<=r.lastIndexOf("/"))&&(r+="/")),v.location.ownerElement=e,[new URL(r,v.location.href),i,!!e.hasAttribute("credentials")]};var I=class e extends Set{constructor(n,r,i,s){super();this.url=n;this.withCredentials=r;this.onMessage=i;for(let o of s)this.add(o)}url;withCredentials;onMessage;static parser=new DOMParser;source;addEventListener(n,r){this.source?.addEventListener(n,r)}removeEventListener(n,r){this.source?.removeEventListener(n,r)}handleError=()=>{if(this.source?.readyState===v.EventSource.CLOSED){this.close(),this.open();for(let n of this)this.addEventListener(n,this.handleMessage)}};handleMessage=({type:n,data:r})=>this.onMessage(this,n,e.parser.parseFromString(r,"text/html"));open(){this.source=new v.EventSource(this.url,{withCredentials:this.withCredentials}),this.addEventListener("error",this.handleError)}close(){for(let n of this)this.removeEventListener(n,this.handleMessage);this.removeEventListener("error",this.handleError),this.source?.close(),this.source=void 0}add(n){let r=this.size;return super.add(n),r!==this.size&&(r||this.open(),this.addEventListener(n,this.handleMessage)),this}delete(n){let r=super.delete(n);return r&&(this.removeEventListener(n,this.handleMessage),this.size||this.close()),r}clear(){this.close(),super.clear()}reconcileWith(n){let r=this.size,i=this.difference(n),s=n.difference(this);for(let o of i)super.delete(o),this.removeEventListener(o,this.handleMessage);for(let o of s)super.add(o);!r&&this.size?this.open():r&&!this.size&&this.close();for(let o of s)this.addEventListener(o,this.handleMessage)}};var x=class e extends Map{constructor(n){super();this.onPayload=n}onPayload;elements=new Set;static _instance;static get instance(){return e._instance??(e._instance=new e(W))}addElement=n=>this.elements.add(n);deleteElement=n=>this.elements.delete(n);getEvent(n){return n.getAttribute("sse")||"message"}onMessage=(n,r,i)=>{let s;for(let o of this.elements){let[c,,f]=H(o);this.getEvent(o)===r&&c.href===n.url.href&&f===n.withCredentials&&this.onPayload({target:{ownerElement:o,responseXML:s?s.cloneNode(!0):s=i,status:200}})}};start(){let n=new Map,r=new Map,i=new Set;for(let s of this.elements){let[o,,c]=H(s),f=this.has(o.href)?n:r,w=f.get(o.href);w||f.set(o.href,w=[new Set,new Set,o]),w[+c].add(this.getEvent(s)),i.add(o.href)}for(let[s,[o,c]]of this)i.has(s)||(o.clear(),c.clear(),this.delete(s));for(let[s,[o,c]]of n){let[f,w]=this.get(s);f.reconcileWith(o),w.reconcileWith(c)}for(let[s,[o,c,f]]of r)this.set(s,[new I(f,!1,this.onMessage,o),new I(f,!0,this.onMessage,c)])}stop=()=>{for(let[n,r]of this.values())n.clear(),r.clear();this.clear()}};var De,Pe=e=>De=e,He=()=>De;var Ie=new Set,ht=["INPUT","SELECT","TEXTAREA"],Fe=[{match:"autofocus",added:ke},{match:"if",added:e=>D.add(e),removed:e=>D.delete(e)},{match:["if",/^if:/],added:y,removed:y,changed:y},{match:/^if:/,added:e=>T.add(e),removed:e=>T.delete(e)},{match:"if:intersects",added:e=>Q.observe(e),removed:e=>Q.unobserve(e)},{match:"if:intersects",gate:({isIntersecting:e})=>e==null,added(e){let{top:t,right:n,bottom:r,left:i}=e.getBoundingClientRect();e.isIntersecting=r>0&&n>0&&i<innerWidth&&t<innerHeight}},{match:"on",added:e=>C.add(e),removed:e=>C.delete(e)},{match:/^on:/,gate:(e,t)=>!Ie.has(t),added(e,t){Ie.add(t),document.addEventListener(t.slice(3),He(),!0)}},{match:"on:conceal",added:e=>Z.observe(e),removed:e=>Z.unobserve(e)},{match:"on:navigate",added:e=>A.add(e),removed:e=>A.delete(e)},{match:"on:reveal",added:e=>K.observe(e),removed:e=>K.unobserve(e)},{match:"on:discover",added:Me},{match:"render",added:e=>P.add(e),removed:e=>P.delete(e)},{match:"reset",added:e=>M.add(e),removed:e=>M.delete(e)},{match:"scroll",added:e=>O.add(e),removed:e=>O.delete(e)},{match:"sse",added:x.instance.addElement,removed:x.instance.deleteElement},{match:"sse",added:L,removed:L,changed:L},{match:ee.concat("credentials"),gate:e=>e.hasAttribute("sse"),added:L,removed:L,changed:L},{match:"value",gate:e=>!ht.includes(e.tagName)&&e.hasAttribute("name"),serialize:(e,t,n)=>n?.formData?.set(e.getAttribute("name"),e.getAttribute("value"))}];var Be=e=>Object.prototype.toString.call(e)==="[object RegExp]";function te(e){return typeof e=="string"?e===this:Be(e)?e.test(this):e.some(te,this)}var N=1,V=2,ne=4,re=8,X=(e,t,n,r)=>{for(let{match:i,gate:s,added:o,removed:c,changed:f,serialize:w}of Fe)(!i||te.call(n,i))&&(!s||s(t,n,r))&&(e&N&&o?.(t,n,r),e&V&&c?.(t,n,r),e&ne&&f?.(t,n,r),e&re&&w?.(t,n,r))};var k=e=>e?.nodeType===Node.ELEMENT_NODE;var R=(e,t,n)=>{for(let r=0,i=t.length,s,o,c;r<i;++r)if(k(s=t[r])){o=document.createNodeIterator(s,NodeFilter.SHOW_ELEMENT);do for(c of s.attributes)X(e,s,c.name,n);while(s=o.nextNode())}};var qe=e=>e.tagName==="FORM";var j=({searchParams:e},t)=>{if(t)for(let[n,r]of t)typeof r=="string"&&e.append(n,r)};var Ue=document.createElement("form"),ut=Object.create(null),_=e=>{if(e.timeoutId=clearTimeout(e.timeoutId),e.checkValidity?.()??!0){e.hasAttribute("once")&&be(e);let t=new FormData(qe(e)?e:(Ue.replaceChildren(e.cloneNode(!0)),Ue));R(re,[e],{formData:t});let n=e.getAttribute("redirect"),[r,i,s]=H(e);if(v.location.ownerElement=e,n==="pushState"||n==="replaceState")j(r,t),v.history[n](ut,"",r),U();else if(n==="assign"||n==="replace")j(r,t),v.location[n](r);else{i==="GET"&&(t=j(r,t));let o=new v.XMLHttpRequest;o.responseType="document",o.withCredentials=s,o.ownerElement=e,o.onloadend=W,o.open(i,r),o.setRequestHeader("X-Requested-With","XMLHttpRequest");for(let{name:c,value:f}of e.attributes)c.startsWith("h-")&&o.setRequestHeader(c.slice(2),f);e.isError=!1,e.isLoading=!0,y(),o.send(t)}}};var We=e=>{let t;(t=e.getAttributeNode("throttle"))?e.timeoutId??=setTimeout(_,+t.value,e):(t=e.getAttributeNode("debounce"))?(clearTimeout(e.timeoutId),e.timeoutId=setTimeout(_,+t.value,e)):_(e)};var F=(e,t)=>e&&t&&(e==t||e.startsWith(t+" ")||e.endsWith(t=" "+t)||e.includes(t+" "));function Ve(e){let t=e.indexOf("="),n=(t<0?e:e.slice(0,t)).trim();return n&&(t<0&&!this[n]||t>=0&&this[n]+""!=e.slice(t+1).trim())}var ft=[[C,"on",We],[M,"reset",we],[O,"scroll",xe]],Xe=e=>{let{target:t,type:n}=e;if(k(t)){let r=`on:${n}`,i=t,s;for(;i&&!(s=i.getAttributeNode(r));)i=i.parentElement;if(i&&s){let o=s.value;if((s=i.getAttributeNode(`event:${n}`))&&(v.console.ownerElement=i,i.hasAttribute("log")&&v.console.log(e),s.value.split(",").some(Ve,e)))return;e.preventDefault();for(let[c,f,w]of ft)for(i of c)F(o,i.getAttribute(f))&&w(i)}}};var je=e=>e.type==="checkbox"?e.checked:e.type==="file"?e.files:e.type==="image"?e.src:e.value;var _e=e=>Object.prototype.toString.call(e)==="[object FileList]";var se=(e,t,n=0)=>{for(let r=n,i=e.length,s,o=t.nodeName,c=t.getAttribute?.("key");r<i;++r)if(o===(s=e[r]).nodeName&&c==s.getAttribute?.("key"))return[s,r]};function ze({name:e}){return this===e}var oe=e=>e!=null;var gt=[["value",e=>e??""],["checked",oe],["selected",oe]],E=(e,t,n)=>{let r,i;typeof t=="string"?i=e.getAttributeNode(r=t):(i=t,r=t.name),i?n==null?e.removeAttributeNode(i):i.value!==n&&(i.value=n):n==null||e.setAttribute(r,n);for(let[s,o]of gt)if(r===s&&r in e){let c=o(n);e[r]===c||(e[r]=c)}};var Ge=e=>{let t=Array.from(e.attributes);for(let n of t){let{name:r,value:i}=n,s=r.slice(2),o=t.find(ze,s);r.startsWith("x-")?o?(E(e,n,o.value),E(e,o,i)):(E(e,n),E(e,"d-"+s,""),E(e,s,i)):r.startsWith("d-")&&(o&&(E(e,"x-"+s,o.value),E(e,o)),E(e,n))}},$e=e=>{e.hasAttribute("state")||(Ge(e),E(e,"state",""))},z=e=>{let t=e.getAttributeNode("state");t&&(E(e,t),Ge(e))};var Ye=(e,t)=>{if(e.nodeName===t.nodeName){if(e.nodeValue===t.nodeValue||(e.nodeValue=t.nodeValue),k(e)){z(e);let n=e.attributes.length,r;for(;n--;)r=e.attributes[n],t.hasAttribute(r.name)||E(e,r);for(let{name:i,value:s}of t.attributes)E(e,i,s);G.replaceChildren(e,Array.from(t.childNodes))}}else e.replaceWith(t)},G={after(e,t){e.after(...t)},append(e,t){e.append(...t)},before(e,t){e.before(...t)},prepend(e,t){e.prepend(...t)},replaceWith(e,t){let n=t.length;if(n){let r=se(t,e),i,s;r?([i,s]=r,s&&e.before(...t.slice(0,s)),++s):(i=t[0],s=1),n>s&&e.after(...t.slice(s)),Ye(e,i)}else e.remove()},replaceChildren(e,t){let n=e.childNodes,r=t.length,i=n.length,s=0,o,c;for(;s<r;++s)c=se(n,o=t[s],s),c?(c[1]===s||e.insertBefore(c[0],n[s]),Ye(n[s],o)):s<i++?e.insertBefore(o,n[s]):e.appendChild(o);for(;i>r;)e.removeChild(n[--i])}};var ie=(e,t,n)=>{let r=e.getAttribute(n);if(r)if(isNaN(+r)){let i=n==="top"?e.scrollHeight-e.clientHeight:e.scrollWidth-e.clientWidth;r==="start"?t[n]=0:r==="center"?t[n]=i/2|0:r==="end"&&(t[n]=i)}else t[n]=+r};var vt=[],Je=["auto","instant","smooth"],Et=new Event("result"),bt=new Event("failure"),yt=new Event("discover"),ae=()=>{let e,t,n,r,i,s,o,c,f;for(;e=Se();)e.reset?.();for(;e=ye();)E(e,"on");for(;t=Ee();){({ownerElement:e,status:n,responseXML:r}=t.target),s=e.getAttribute((e.isError=n>399)?"error":"result"),i=[],c=void 0;for(t of P)F(s,t.getAttribute("render"))&&i.push([t,r?Array.from((c?c.cloneNode(!0):c=r.body).childNodes):vt]);for(;t=i.pop();)(G[t[0].getAttribute("position")]??G.replaceChildren)(...t);e.isLoading=!1,y(),e.dispatchEvent(e.isError?bt:Et)}if(Ae()){Ce(),o=[];for(e of T)!(e.checkValidity?.()??!0)&&(t=e.getAttributeNode("if:invalid"))&&o.push(t.value),(t=je(e))&&(!_e(t)||t.length)&&(t=e.getAttributeNode("if:value"))&&o.push(t.value),e.isIntersecting&&(t=e.getAttributeNode("if:intersects"))&&o.push(t.value),e.isLoading&&(t=e.getAttributeNode("if:loading"))&&o.push(t.value),e.isError&&(t=e.getAttributeNode("if:error"))&&o.push(t.value);s=o.join(" ");for(e of D)F(s,e.getAttribute("if"))?$e(e):z(e)}for(;e=Le();)f={behavior:Je.includes(t=e.getAttribute("behavior"))?t:Je[0]},ie(e,f,"top"),ie(e,f,"left"),("top"in f||"left"in f)&&(e.hasAttribute("relative")?e.scrollBy(f):e.scroll(f));for(;e=Oe();)e.dispatchEvent(yt);if(ge()&&(ve(),x.instance.start()),e=Ne()){Re();try{t=e.value.length,e.focus(),e.setSelectionRange(t,t)}catch{}}requestAnimationFrame(ae)};var wt=e=>{for(let{addedNodes:t,attributeName:n,oldValue:r,removedNodes:i,target:s}of e)if(R(V,i),R(N,t),n){let o=s.hasAttribute(n),c;o&&r==null&&(c=N),!o&&r!=null&&(c=V),X(c??ne,s,n)}},Ke=new MutationObserver(wt);var le=()=>{try{document.cookie=`tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=31536000`}catch{}Pe(Xe),R(N,document.childNodes),Ke.observe(document,{attributeOldValue:!0,attributes:!0,childList:!0,subtree:!0}),document.addEventListener("change",y,!0),document.addEventListener("input",y,!0),document.addEventListener("reset",y,!0),v.window.addEventListener("popstate",U,!0),window.addEventListener("beforeunload",x.instance.stop,!0),requestAnimationFrame(ae)};var Ze=Symbol.for("keml");window[Ze]||(window[Ze]=!0,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",le,!0):le());})();
