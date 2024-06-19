let evtName,
  initMeth = "a",
  addEventListenerMeth = "b",
  dispatchEventMeth = "c",
  getAttributeNodeMeth = "d",
  removeAttributeNodeMeth = "e",
  setAttributeMeth = "f",
  removeAttributeMeth = "g",
  nameAttr = "h",
  onAttr = "i",
  ifAttr = "j",
  redirectAttr = "k",
  errorMatchAttr = "l",
  isDialogAttr = "m",
  throttleAttr = "n",
  debounceAttr = "o",
  credentialsAttr = "p",
  posAttr = "q",
  methodAttr = "r",
  hrefAttr = "s",
  handleEventMeth = "t",
  timerAttr = "u",
  serializeMeth = "v",
  isPostAttr = "w",
  ownerElementAttr = "x",
  resolveMeth = "y",
  onceAttr = "z",
  resultMatchAttr = "A",
  renderAttr = "B",
  isInvalidAttr = "C",
  /** @noinline */
  undef,
  /** @noinline */
  yes = true,
  /** @noinline */
  createObserver = a => new IntersectionObserver(b => b.forEach(a)),
  /** @noinline */
  createHandle = (a, b) => c => c.isIntersecting == a && c[targetStr][dispatchEventMeth](b),
  /** @noinline */
  createEvent = a => new Event(a),
  /** @noinline */
  trimStart = a => a.substring(2),
  /** @noinline */
  startsWith = (a, b) => a.startsWith(b),
  /** @noinline */
  noop = () => { },
  /** @noinline */
  formData = (
    /**
     * @param {Element=} a
     * @noinline
     */
    a => new FormData(a)
  ),
  /** @noinline */
  split = a => {
    let b = a.match(/\S+/g);
    return b && b[lengthStr] ? b : undef;
  },
  /** @noinline */
  applyState = action => {
    let el, name, nameOff, attr, attrOn, attrOff, isOn;
    for (el of ifElements[action] || []) {
      isOn = state[el[ifAttr]];
      if (!el.isOn != !isOn) {
        el.isOn = isOn;
        for (attrOn of toArray(el[attributesStr])) {
          name = attrOn[nameStr];
          if (startsWith(name, "x-")) {
            name = trimStart(name);
            nameOff = "_" + name;
            attrOff = el[getAttributeNodeMeth](nameOff);
            if (isOn) {
              if (!attrOff) {
                attr = el[getAttributeNodeMeth](name);
                el[setAttributeMeth](nameOff, attr ? attr[valueStr] : dropStr);
                el[setAttributeMeth](name, attrOn[valueStr]);
              }
            } else if (attrOff) {
              attrOff[valueStr] == dropStr ? el[removeAttributeMeth](name) : el[setAttributeMeth](name, attrOff[valueStr]);
              el[removeAttributeNodeMeth](attrOff);
            }
          }
        }
      }
    }
  },
  /** @noinline */
  applyStates = () => {
    for (let action in ifElements) applyState(action);
  },
  /** @noinline */
  add = (a, b = []) => (b.includes(a) || b.push(a), b),
  /** @noinline */
  remove = (a, b = []) => ((a = b.indexOf(a)), a < 0 || b.splice(a, 1), b),
  /** @noinline */
  enqueue = a => a[lengthStr] && raf(() => {
    for (let b of a) b();
  }),
  /** @noinline */
  initTrees = a => {
    for (let b of a) b[initMeth]?.();
  },
  /** @noinline */
  processNode = (leftNode, rightNode) => {
    let leftAttr, rightAttr;
    if (leftNode.nodeName != rightNode.nodeName) {
      leftNode[initMeth]?.(1);
      leftNode[replaceWithStr](rightNode);
      rightNode[initMeth]?.();
      return 0;
    }
    leftNode[nodeValueStr] == rightNode[nodeValueStr] || (leftNode[nodeValueStr] = rightNode[nodeValueStr]);
    if (leftNode.nodeType == 1) {
      for (leftAttr of toArray(leftNode[attributesStr])) {
        if (!rightNode.hasAttribute(leftAttr[nameStr])) {
          initAttr(leftNode, leftAttr, 1);
          leftNode[removeAttributeNodeMeth](leftAttr);
          leftNode.isOn = undef;
        }
      }
      for (rightAttr of rightNode[attributesStr]) {
        leftAttr = leftNode[getAttributeNodeMeth](rightAttr[nameStr]);
        if (leftAttr) {
          if (leftAttr[valueStr] != rightAttr[valueStr] || rightAttr[nameStr] in leftNode) {
            initAttr(leftNode, rightAttr, 1);
            leftAttr[valueStr] = rightAttr[valueStr];
            initAttr(leftNode, rightAttr, 0);
            leftNode.isOn = undef;
          }
        } else {
          leftNode[setAttributeMeth](rightAttr[nameStr], rightAttr[valueStr]);
          initAttr(leftNode, rightAttr, 0);
          leftNode.isOn = undef;
        }
      }
    }
    replaceChildren(leftNode, rightNode[childNodesStr]);
    return 1;
  },
  /** @noinline */
  replaceChildren = (left, rightList) => {
    let leftList = left[childNodesStr];
    let len = Math.max(leftList[lengthStr], rightList[lengthStr]);
    let i = 0;
    let j = 0;
    let leftNode, rightNode;
    while (i < len) {
      leftNode = leftList[i];
      rightNode = rightList[j];
      if (leftNode) {
        if (rightNode) {
          ++i;
          j += processNode(leftNode, rightNode);
        } else {
          leftNode[initMeth]?.(1);
          leftNode.remove();
          --len;
        }
      } else {
        left.appendChild(rightNode);
        rightNode[initMeth]?.();
        ++i;
      }
    }
  },
  /** @noinline */
  toggleState = (value, actions = []) => {
    for (let action of actions) {
      state[action] = value;
      applyState(action);
    }
  },
  /** @noinline */
  validate = (
    /**
     * @param {Element} a
     * @param {boolean=} b
     * @noinline
     */
    (a, b) => {
      toggleState((a[isInvalidAttr] = !(b ?? a.checkValidity?.() ?? yes)), a[ifInvalidMatch]);
      a.form && toggleState((a.form[isInvalidAttr] = !(b ?? a.form.checkValidity?.() ?? yes)), a.form[ifInvalidMatch]);
    }
  ),
  /** @noinline */
  getUrl = (
    /**
     * @param {Element} a
     * @param {string=} b
     * @noinline
     */
    (a, b) => {
      let c = new URL(location.href);
      /\.[^\/]+$/.test(c[pathnameStr]) || (c[pathnameStr] = c[pathnameStr].replace(/\/*$/, "/"));
      return new URL(b ?? a[hrefAttr] ?? "", c);
    }
  ),
  /** @noinline */
  execute = (el, match) => raf(() => {
    let action, queue = [], url1 = getUrl(el, el[redirectAttr]), url2, onEl, attr, xhr, pwr, formData;
    el[timerAttr] = clearTimer(el[timerAttr]);
    for (action of match) {
      if (action == "pushState" || action == "replaceState") {
        history[action]({}, "", url1);
        onNavigate();
      } else if (action == "follow") {
        location.href = url1;
      } else if (action == "reset") {
        el[action]?.();
      }
      for (onEl of onElements[action] || []) if (!(validate(onEl), onEl[isInvalidAttr])) {
        url2 = getUrl(onEl);
        (formData = onEl[serializeMeth]()) &&
          !onEl[isPostAttr] &&
          (/** @type {*} */([...formData.keys()]))[lengthStr] &&
          (url2.search = new URLSearchParams(formData));
        xhr = new XHRequest();
        pwr = Promise["withResolvers"]();
        xhr.responseType = "document";
        xhr.withCredentials = onEl[credentialsAttr];
        xhr[ownerElementAttr] = onEl;
        xhr[resolveMeth] = pwr.resolve;
        xhr.onloadend = onloadend;
        xhr.open(onEl[methodAttr] ?? "GET", url2);
        xhr.setRequestHeader("X-Requested-With", XHRequest[nameStr]);
        for (attr of onEl[attributesStr]) startsWith(attr[nameStr], "h-") &&
          xhr.setRequestHeader(trimStart(attr[nameStr]), attr[valueStr]);
        toggleState(false, onEl[ifErrorMatch]);
        toggleState(yes, onEl[ifLoadingMatch]);
        xhr.send(onEl[isPostAttr] ? formData : null);
        add(pwr.promise, queue);
      }
    }
    Promise.all(queue).then(enqueue);
  }),
  /** @noinline */
  protoStr = "prototype",
  /** @noinline */
  pathnameStr = "pathname",
  /** @noinline */
  targetStr = "target",
  /** @noinline */
  attributesStr = "attributes",
  /** @noinline */
  nameStr = "name",
  /** @noinline */
  valueStr = "value",
  /** @noinline */
  lengthStr = "length",
  /** @noinline */
  childNodesStr = "childNodes",
  /** @noinline */
  onStr = "on:",
  /** @noinline */
  dropStr = "__DROP__",
  /** @noinline */
  revealStr = "reveal",
  /** @noinline */
  concealStr = "conceal",
  /** @noinline */
  navigateStr = "navigate",
  /** @noinline */
  resultStr = "result",
  /** @noinline */
  nodeValueStr = "nodeValue",
  /** @noinline */
  replaceChildrenStr = "replaceChildren",
  /** @noinline */
  replaceWithStr = "replaceWith",
  /** @noinline */
  ifLoadingMatch = "if:loading",
  /** @noinline */
  ifErrorMatch = "if:error",
  /** @noinline */
  ifInvalidMatch = "if:invalid",
  /** @noinline */
  doc = document,
  /** @noinline */
  internalForm = doc.createElement("form"),
  /** @noinline */
  startTimer = setTimeout,
  /** @noinline */
  clearTimer = clearTimeout,
  /** @noinline */
  raf = requestAnimationFrame,
  /** @noinline */
  EtProto = EventTarget[protoStr],
  /** @noinline */
  ElProto = Element[protoStr],
  /** @noinline */
  XHRequest = XMLHttpRequest,
  /** @noinline */
  toArray = Array.from,
  /** @noinline */
  state = {},
  /** @noinline */
  onElements = {},
  /** @noinline */
  ifElements = {},
  /** @noinline */
  renderElements = {},
  /** @noinline */
  nvElements = [],
  /** @noinline */
  fiElements = [],
  /** @noinline */
  nvEvent = createEvent(navigateStr),
  /** @noinline */
  revealEvent = createEvent(revealStr),
  /** @noinline */
  concealEvent = createEvent(concealStr),
  /** @noinline */
  resultEvent = createEvent(resultStr),
  /** @noinline */
  createInitUnset = a => b => b[a] = undef,
  /** @noinline */
  createInitDict = (a, b) => [(c, d) => (b[c[a] = d] = add(c, b[d])), c => ((b[c[a]] = remove(c, b[c[a]])), (c[a] = undef))],
  /** @noinline */
  createInitObserver = a => [b => a.observe(b), b => a.unobserve(b)],
  /** @noinline */
  createInitMatch = a => [(b, c) => (c = split(c)) && (b[a] = c), createInitUnset(a)],
  /** @noinline */
  createInitDelay = a => [(b, c) => b[a] = Number(c), createInitUnset(a)],
  /** @noinline */
  applyMethod = (a, b) => ((b = b.toUpperCase()), (a[methodAttr] = b), (a[isPostAttr] = b == "POST")),
  /** @noinline */
  initHref = [(a, b) => a[hrefAttr] = b, noop],
  /** @noinline */
  initVerb = [(a, b, c) => ((a[hrefAttr] = b), applyMethod(a, c)), noop],
  /** @noinline */
  createInitBool = a => [b => b[a] = yes, createInitUnset(a)],
  /** @noinline */
  createInitSetAttr = a => [(b, c) => b[a] = c, createInitUnset(a)],
  /** @noinline */
  attrMap = {
    "on": createInitDict(onAttr, onElements),
    "if": createInitDict(ifAttr, ifElements),
    "render": createInitDict(renderAttr, renderElements),
    [onStr + navigateStr]: [a => add(a, nvElements), a => remove(a, nvElements)],
    [onStr + revealStr]: createInitObserver(createObserver(createHandle(yes, revealEvent))),
    [onStr + concealStr]: createInitObserver(createObserver(createHandle(false, concealEvent))),
    "method": [(a, b) => b == "dialog" ? (a[isDialogAttr] = yes) : applyMethod(a, b), createInitUnset(isDialogAttr)],
    "throttle": createInitDelay(throttleAttr),
    "debounce": createInitDelay(debounceAttr),
    "href": initHref,
    "action": initHref,
    "src": initHref,
    "get": initVerb,
    "post": initVerb,
    "put": initVerb,
    "delete": initVerb,
    "credentials": createInitBool(credentialsAttr),
    "once": createInitBool(onceAttr),
    "result": createInitMatch(resultMatchAttr),
    "error": createInitMatch(errorMatchAttr),
    "position": createInitSetAttr(posAttr),
    "redirect": createInitSetAttr(redirectAttr),
    "value": [(a, b, c) => ((a[c] = b), validate(a)), noop],
    "name": createInitSetAttr(nameAttr),
    "autofocus": [
      (a, b) => {
        try {
          a.focus();
          b = a[valueStr][lengthStr];
          a.setSelectionRange(b, b);
        } catch { }
      },
      noop,
    ],
    "checked": [(a, _, b) => (a[b] = yes), (a, _, b) => (a[b] = false)],
  },
  getIfActions = a => Object.entries(a).flatMap(([b, c]) => startsWith(b, "if:") && c).filter(d => d),
  ifState = [
    (a, b, c) => (a[c] = split(b)) && add(a, fiElements),
    (a, _, c) => {
      let action, el, actions = a[c] || [], found;
      a[c] = undef;
      getIfActions(a).length || remove(a, fiElements);
      for (action of actions) {
        found = false;
        for (el of fiElements) if (getIfActions(el).includes(action)) {
          found = yes;
          break;
        }
        found || (state[action] = undef);
      }
    }
  ],
  initAttr = (a, b, c = 0) => {
    let name = b[nameStr], mp = startsWith(name, "if:") ? ifState : attrMap[name];
    mp?.[c](a, b[valueStr], name);
  },
  onEvent = event => event[targetStr][handleEventMeth]?.(event),
  onLoad = event => raf(() => (event[targetStr][initMeth]?.(), applyStates())),
  onChange = event => raf(() => validate(event[targetStr])),
  onInvalid = event => raf(() => validate(event[targetStr], false)),
  onNavigate = () => { for (let item of nvElements) item[dispatchEventMeth](nvEvent); };

/** @this {XMLHttpRequest} */
function onloadend() {
  let { [ownerElementAttr]: owner, [resolveMeth]: resolve, status, responseXML } = this;
  let pos, el, rightNode, children, batch = [], renderMatch = resultMatchAttr;
  resolve(() => {
    toggleState(false, owner[ifLoadingMatch]);
    if (status > 399) {
      renderMatch = errorMatchAttr;
      toggleState(yes, owner[ifErrorMatch]);
    }
    if (responseXML = responseXML?.body) {
      if (owner[onceAttr]) {
        attrMap.on[1](owner);
        owner[removeAttributeMeth]("on");
      }
      for (pos of owner[renderMatch] || []) for (el of renderElements[pos] || [])
        add([el, (children = (children ? responseXML.cloneNode(yes) : responseXML)[childNodesStr]), el[posAttr] || replaceChildrenStr], batch);
      for ([el, children, pos] of batch) {
        if (pos == replaceChildrenStr) replaceChildren(el, children);
        else if (pos == replaceWithStr) {
          children = /** @type {*} */([...children]);
          rightNode = children.shift();
          if (rightNode) {
            initTrees(children);
            children[lengthStr] && el.after(...(/** @type {!Array<*>} */(children)));
            processNode(el, rightNode);
          } else {
            el[initMeth]?.(1);
            el.remove();
          }
        } else if (["after", "append", "before", "prepend"].includes(pos)) {
          initTrees(children);
          el[pos](...children);
        }
      }
      applyStates();
      renderMatch == resultMatchAttr && owner[dispatchEventMeth](resultEvent);
    }
  });
}

/** @this {Element} */
doc[initMeth] = ElProto[initMeth] = function (index) {
  /** @noinline */
  let me = this;
  let item;
  for (item of me[attributesStr] || []) initAttr(me, item, index);
  for (item of me[childNodesStr]) item[initMeth]?.(index);
};

EtProto[addEventListenerMeth] = EtProto.addEventListener;
EtProto[dispatchEventMeth] = EtProto.dispatchEvent;
ElProto[getAttributeNodeMeth] = ElProto.getAttributeNode;
ElProto[removeAttributeNodeMeth] = ElProto.removeAttributeNode;
ElProto[setAttributeMeth] = ElProto.setAttribute;
ElProto[removeAttributeMeth] = ElProto.removeAttribute;

/** @this {Element} */
ElProto[serializeMeth] = function () {
  let name = this[nameAttr], value = this[valueStr], fd = null;
  if (name && value) {
    fd = formData();
    fd.set(name, value);
  }
  return fd;
};

/** @this {HTMLInputElement} */
HTMLInputElement[protoStr][serializeMeth] = HTMLSelectElement[protoStr][serializeMeth] = HTMLTextAreaElement[protoStr][serializeMeth] = function () {
  internalForm[replaceChildrenStr](this.cloneNode(yes));
  return formData(internalForm);
};

/** @this {HTMLFormElement} */
HTMLFormElement[protoStr][serializeMeth] = function () {
  return formData(this);
};

/** @this {Element} */
ElProto[handleEventMeth] = function (event) {
  /** @noinline */
  let me = this;
  let match = me[getAttributeNodeMeth](onStr + event.type);
  if (match && (match = split(match[valueStr]))) {
    me[isDialogAttr] || event.preventDefault();
    if (me[throttleAttr]) {
      me[timerAttr] = me[timerAttr] || startTimer(() => execute(me, match), me[throttleAttr]);
    } else if (me[debounceAttr]) {
      clearTimer(me[timerAttr]);
      me[timerAttr] = startTimer(() => execute(me, match), me[debounceAttr]);
    } else {
      execute(me, match);
    }
  }
};

doc.cookie = `tzo=${new Date().getTimezoneOffset()};Path=/;Max-Age=` + 9 ** 8;
for (evtName in doc) startsWith(evtName, "on") && doc[addEventListenerMeth](trimStart(evtName), onEvent, yes);
for (evtName of [revealStr, concealStr, navigateStr, resultStr]) doc[addEventListenerMeth](evtName, onEvent, yes);
for (evtName of ["reset", "input", "change"]) doc[addEventListenerMeth](evtName, onChange, yes);
doc[addEventListenerMeth]("DOMContentLoaded", onLoad, yes);
doc[addEventListenerMeth]("invalid", onInvalid, yes);
window[addEventListenerMeth]("popstate", onNavigate, yes);
