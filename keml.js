let evtName,
  initMeth = "a",
  addEventListenerMeth = "b",
  dispatchEventMeth = "c",
  getAttributeNodeMeth = "d",
  removeAttributeNodeMeth = "e",
  setAttributeMeth = "f",
  removeAttributeMeth = "g",
  invalidMatchAttr = "h",
  onAttr = "i",
  ifAttr = "j",
  errorMatchAttr = "k",
  loadingMatchAttr = "l",
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
  split = a => {
    let b = a.match(/\S+/g);
    return b && b[lengthStr] ? b : undef;
  },
  /** @noinline */
  applyState = action => {
    let el, name, nameOff, attr, attrOn, attrOff, isOn;
    for (el of ifElements[action] || []) {
      isOn = state[el[ifAttr]];
      if (el.isOn != isOn) {
        el.isOn = isOn;
        for (attrOn of el[attributesStr]) {
          name = attrOn[nameStr];
          if (name.startsWith("$")) {
            name = name.substring(1);
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
    if (!leftNode.isEqualNode(rightNode)) {
      leftNode[nodeValueStr] == rightNode[nodeValueStr] || (leftNode[nodeValueStr] = rightNode[nodeValueStr]);
      if (leftNode.nodeType == 1) {
        for (leftAttr of leftNode[attributesStr]) {
          if (!rightNode.hasAttribute(leftAttr[nameStr])) {
            attrMap[leftAttr[nameStr]]?.[1](leftNode, "", leftAttr[nameStr]);
            leftNode[removeAttributeNodeMeth](leftAttr);
          }
        }
        for (rightAttr of rightNode[attributesStr]) {
          leftAttr = leftNode[getAttributeNodeMeth](rightAttr[nameStr]);
          attrMap[rightAttr[nameStr]]?.[1](leftNode, "", rightAttr[nameStr]);
          if (leftAttr) leftAttr[valueStr] == rightAttr[valueStr] || (leftAttr[valueStr] = rightAttr[valueStr]);
          else leftNode[setAttributeMeth](rightAttr[nameStr], rightAttr[valueStr]);
          attrMap[rightAttr[nameStr]]?.[0](leftNode, rightAttr[valueStr], rightAttr[nameStr]);
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
    (a, b) => toggleState((a[isInvalidAttr] = !(b ?? a.checkValidity?.() ?? yes)), a[invalidMatchAttr])
  ),
  /** @noinline */
  getUrl = a => a[hrefAttr] && new URL(a[hrefAttr], /\.[^\/]+$/.test(loc.pathname) ? loc.href : loc.href.replace(/\/*$/, "/")),
  /** @noinline */
  execute = (el, match) => raf(() => {
    let action, queue = [], url1 = getUrl(el), url2, onEl, attr, xhr, pwr, formData;
    el[timerAttr] = clearTimer(el[timerAttr]);
    for (action of match) {
      if (url1 && (action == "pushState" || action == "replaceState")) {
        history[action]({}, "", url1);
        onNavigate();
      }
      action == "reset" && el[action]?.();
      for (onEl of onElements[action] || []) if (onEl[methodAttr] && (url2 = getUrl(onEl)) && !(validate(onEl), onEl[isInvalidAttr])) {
        (formData = onEl[serializeMeth]()) &&
          !onEl[isPostAttr] &&
          (/** @type {*} */([...formData.keys()]))[lengthStr] &&
          (url2.search = new URLSearchParams(formData));
        xhr = new XMLHttpRequest();
        pwr = Promise["withResolvers"]();
        xhr.responseType = "document";
        xhr.withCredentials = onEl[credentialsAttr];
        xhr[ownerElementAttr] = onEl;
        xhr[resolveMeth] = pwr.resolve;
        xhr.onloadend = onloadend;
        for (attr of onEl[attributesStr]) attr[nameStr].startsWith("h-") &&
          xhr.setRequestHeader(attr[nameStr].substring(2), attr[valueStr]);
        toggleState(false, onEl[errorMatchAttr]);
        toggleState(yes, onEl[loadingMatchAttr]);
        xhr.open(onEl[methodAttr], url2);
        xhr.send(onEl[isPostAttr] ? formData : null);
        add(pwr.promise, queue);
      }
    }
    Promise.all(queue).then(enqueue);
  }),
  /** @noinline */
  protoStr = "prototype",
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
  loc = location,
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
  initHref = [(a, b) => a[hrefAttr] = b, () => { }],
  /** @noinline */
  initVerb = [(a, b, c) => ((a[hrefAttr] = b), applyMethod(a, c)), () => { }],
  /** @noinline */
  createInitBool = a => [b => b[a] = yes, createInitUnset(a)],
  /** @noinline */
  attrMap = {
    "on": createInitDict(onAttr, onElements),
    "if": createInitDict(ifAttr, ifElements),
    "render": createInitDict(renderAttr, renderElements),
    [onStr + navigateStr]: [a => add(a, nvElements), a => remove(a, nvElements)],
    [onStr + revealStr]: createInitObserver(createObserver(createHandle(yes, revealEvent))),
    [onStr + concealStr]: createInitObserver(createObserver(createHandle(false, concealEvent))),
    "if:invalid": [(a, b) => (b = split(b)) && ((a[invalidMatchAttr] = b), validate(a)), createInitUnset(invalidMatchAttr)],
    "if:error": createInitMatch(errorMatchAttr),
    "if:loading": createInitMatch(loadingMatchAttr),
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
    "position": [(a, b) => a[posAttr] = b, createInitUnset(posAttr)],
    "autofocus": [
      (a, b) => {
        try {
          a.focus();
          b = a[valueStr][lengthStr];
          a.setSelectionRange(b, b);
        } catch { }
      },
      () => { },
    ],
    "checked": [(a, _, b) => (a[b] = yes), (a, _, b) => (a[b] = false)],
  },
  onEvent = event => event[targetStr][handleEventMeth]?.(event),
  onLoad = event => raf(() => (event[targetStr][initMeth]?.(), applyStates())),
  onChange = event => raf(() => validate(event[targetStr])),
  onInvalid = event => raf(() => validate(event[targetStr], false)),
  onNavigate = () => { for (let item of nvElements) item[dispatchEventMeth](nvEvent); };

/** @this {XMLHttpRequest} */
function onloadend() {
  /** @noinline */
  let me = this;
  let owner = me[ownerElementAttr];
  let response = me.responseXML?.body;
  let pos, el, rightNode, children, batch = [];
  me[resolveMeth](() => {
    toggleState(false, owner[loadingMatchAttr]);
    if (me.status > 399) toggleState(yes, owner[errorMatchAttr]);
    else if (response) {
      if (owner[onceAttr]) {
        attrMap.on[1](owner);
        owner[removeAttributeMeth]("on");
      }
      for (pos of owner[resultMatchAttr] || []) for (el of renderElements[pos] || [])
        add([el, (children = (children ? response.cloneNode(yes) : response)[childNodesStr]), el[posAttr] || replaceChildrenStr], batch);
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
      owner[dispatchEventMeth](resultEvent);
    }
  });
}

/** @this {Element} */
doc[initMeth] = ElProto[initMeth] = function (index = 0) {
  /** @noinline */
  let me = this;
  let item;
  for (item of me[attributesStr] || []) attrMap[item[nameStr]]?.[index](me, item[valueStr], item[nameStr]);
  for (item of me[childNodesStr]) item[initMeth]?.(index);
};

EtProto[addEventListenerMeth] = EtProto.addEventListener;
EtProto[dispatchEventMeth] = EtProto.dispatchEvent;
ElProto[getAttributeNodeMeth] = ElProto.getAttributeNode;
ElProto[removeAttributeNodeMeth] = ElProto.removeAttributeNode;
ElProto[setAttributeMeth] = ElProto.setAttribute;
ElProto[removeAttributeMeth] = ElProto.removeAttribute;

ElProto[serializeMeth] = function () {
  return null;
};

/** @this {HTMLInputElement} */
HTMLInputElement[protoStr][serializeMeth] = HTMLSelectElement[protoStr][serializeMeth] = HTMLTextAreaElement[protoStr][serializeMeth] = function () {
  internalForm[replaceChildrenStr](this.cloneNode(yes));
  return new FormData(internalForm);
};

/** @this {HTMLFormElement} */
HTMLFormElement[protoStr][serializeMeth] = function () {
  return new FormData(this);
};

/** @this {Element} */
ElProto[handleEventMeth] = function (event) {
  /** @noinline */
  let me = this;
  let match = me[getAttributeNodeMeth](onStr + event.type);
  if (match && (match = split(match[valueStr]))) {
    me[isDialogAttr] || event.preventDefault();
    if (!me[timerAttr]) {
      if (me[throttleAttr]) {
        me[timerAttr] = startTimer(() => execute(me, match), me[throttleAttr]);
      } else if (me[debounceAttr]) {
        clearTimer(me[timerAttr]);
        me[timerAttr] = startTimer(() => execute(me, match), me[debounceAttr]);
      } else {
        execute(me, match);
      }
    }
  }
};

for (evtName in doc) evtName.startsWith("on") && doc[addEventListenerMeth](evtName.substring(2), onEvent, yes);
for (evtName of [revealStr, concealStr, navigateStr, resultStr]) doc[addEventListenerMeth](evtName, onEvent, yes);
doc[addEventListenerMeth]("DOMContentLoaded", onLoad, yes);
doc[addEventListenerMeth]("reset", onChange, yes);
doc[addEventListenerMeth]("input", onChange, yes);
doc[addEventListenerMeth]("change", onChange, yes);
doc[addEventListenerMeth]("invalid", onInvalid, yes);
window[addEventListenerMeth]("popstate", onNavigate, yes);
