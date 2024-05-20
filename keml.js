// @ts-check

/** @this {Element} */
function applyState() {
  /** @noinline */
  let me = this;
  let active = state[me[ifAttr]];
  if (me[activeAttr] != active) {
    me[activeAttr] = active;
    for (let { name, value } of getAttrs(me)) {
      if (name.startsWith("$")) {
        let base = name.substring(1);
        let nameOff = "_" + base;
        let attrOff = getAttributeNode(me, nameOff);
        if (active) {
          if (!attrOff) {
            let attrBase = getAttributeNode(me, base);
            me.setAttribute(nameOff, attrBase ? attrBase.value : dropStr);
            me.setAttribute(base, value);
          }
        } else if (attrOff) {
          attrOff.value === dropStr ? me.removeAttribute(base) : me.setAttribute(base, attrOff.value);
          me.removeAttributeNode(attrOff);
        }
      }
    }
  }
}

/**
 * @this {Element}
 * @param {boolean=} skip
 * @param {boolean=} value
 */
function validate(skip, value) {
  /** @type {boolean} */
  let invalid = value == null ? !this[checkValidityStr]() : value;
  for (let action of this[invalidMatchAttr]) {
    state[action] = invalid;
    if (!skip) for (let el of ifElements[action] || emptyArr) el[applyStateMeth]();
  }
}

/** @this {Element} */
function pushState() {
  history[pushStateStr](emptyObj, "", resolveUrl(this[hrefAttr]));
  onNavigate();
}

/** @this {Element} */
function replaceState() {
  history[replaceStateStr](emptyObj, "", resolveUrl(this[hrefAttr]));
  onNavigate();
}

/**
 * @this {Element}
 * @param {boolean} value
 */
function markError(value) {
  for (let action of this[errorMatchAttr]) {
    state[action] = value;
    for (let el of ifElements[action] || emptyArr) el[applyStateMeth]();
  }
}

/**
 * @this {Element}
 * @param {boolean} value
 */
function markLoading(value) {
  for (let action of this[loadingMatchAttr]) {
    state[action] = value;
    for (let el of ifElements[action] || emptyArr) el[applyStateMeth]();
  }
}

/** @this {XMLHttpRequest} */
function onloadend() {
  /** @noinline */
  let me = this;
  /** @type {Element} */
  let owner = me[ownerElementAttr];
  let pos = owner[posAttr] || replaceChildrenStr;
  let { status, responseXML } = me;
  me[resolveMeth](() => {
    owner[markLoadingMeth]?.(false);
    if (status > 399) owner[markErrorMeth]?.(true);
    else if (responseXML) {
      if (owner[onceAttr]) {
        deInitOn(owner);
        owner.removeAttribute("on");
      }
      let children = getChildNodes(responseXML.body);
      if (pos === replaceChildrenStr) replaceChildren(owner, children);
      else if (pos === replaceWithStr) {
        children = Array.from(children);
        let rightNode = children.shift();
        if (rightNode) {
          children.length && owner.after(...children.map(initTree));
          processNode(owner, rightNode);
        } else {
          cleanNode(owner);
          owner.remove();
        }
      } else if (nativeRender.includes(pos)) owner[pos](...Array.from(children).map(initTree));
      for (let key in ifElements) for (let el of ifElements[key] || emptyArr) el[applyStateMeth]();
      pub(owner, renderEvent);
    }
  });
}

/** @this {Element} */
function request() {
  /** @noinline */
  let me = this;
  let body = null;
  let url = resolveUrl(me[hrefAttr]);
  let name, files, value;
  if (me instanceof HTMLFormElement) {
    let formData = createFormData(me);
    if (me[isPostAttr]) body = formData;
    else updateSearch(url, formData);
  } else if (name = me["name"]) {
    if (files = me["files"]) {
      if (files.length) {
        let formData = createFormData();
        for (let file of files) formData.append(name, file);
        if (me[isPostAttr]) body = formData;
        else updateSearch(url, formData);
      }
    } else if (value = me["value"]) {
      let formData = createFormData();
      formData.set(name, value);
      if (me[isPostAttr]) body = formData;
      else updateSearch(url, formData);
    }
  }
  let xhr = new XMLHttpRequest();
  let { promise, resolve } = Promise["withResolvers"]();
  xhr.responseType = "document";
  xhr.withCredentials = me[withCredentialsAttr];
  xhr[ownerElementAttr] = me;
  xhr[resolveMeth] = resolve;
  xhr.onloadend = onloadend;
  for ({ name, value } of getAttrs(me)) name.startsWith("h-") &&
    xhr.setRequestHeader(name.substring(2), value);
  me[markErrorMeth]?.(false);
  me[markLoadingMeth]?.(true);
  xhr.open(me[verbAttr], url);
  xhr.send(body);
  return promise;
}

/** @param {Node} node */
let cleanNode = node => {
  if (node instanceof Element) {
    node[onAttr] && deInitOn(node);
    node[ifAttr] && deInitIf(node);
    navigateElements.indexOf(node) === -1 || deInitNavigate(node);
    node[observerAttr] && deInitObserver(node);
    getChildNodes(node).forEach(cleanNode);
  }
};

/**
 * @param {ChildNode} left
 * @param {Array<ChildNode>} rightList
 */
let replaceChildren = (left, rightList) => {
  let leftList = getChildNodes(left);
  let len = Math.max(leftList.length, rightList.length);
  let i = 0;
  let j = 0;
  while (i < len) {
    let leftNode = /** @type {ChildNode} */(leftList[i]);
    let rightNode = /** @type {ChildNode} */(rightList[j]);
    if (leftNode) {
      if (rightNode) {
        ++i;
        j += processNode(leftNode, rightNode);
      } else {
        cleanNode(leftNode);
        leftNode.remove();
        --len;
      }
    } else {
      left.appendChild(initTree(rightNode));
      ++i;
    }
  }
};

/**
 * @param {ChildNode} leftNode
 * @param {ChildNode} rightNode
 */
let processNode = (leftNode, rightNode) => {
  if (leftNode.nodeName !== rightNode.nodeName) {
    cleanNode(leftNode);
    leftNode[replaceWithStr](initTree(rightNode));
    return 0;
  }
  if (!leftNode.isEqualNode(rightNode)) {
    leftNode.nodeValue == rightNode.nodeValue || (leftNode.nodeValue = rightNode.nodeValue);
    if (leftNode.nodeType === 1) {
      let leftEl = /** @type {Element} */(leftNode);
      let rightEl = /** @type {Element} */(rightNode);
      for (let leftAttr of getAttrs(leftEl)) {
        if (!rightEl.hasAttribute(leftAttr.name)) {
          attrMap[leftAttr.name]?.[1](leftEl, "");
          leftEl.removeAttributeNode(leftAttr);
        }
      }
      for (let rightAttr of getAttrs(rightEl)) {
        let leftAttr = getAttributeNode(leftEl, rightAttr.name);
        attrMap[rightAttr.name]?.[1](leftEl, "");
        if (leftAttr) leftAttr.value == rightAttr.value || (leftAttr.value = rightAttr.value);
        else leftEl.setAttributeNode(rightAttr);
        attrMap[rightAttr.name]?.[0](leftEl, rightAttr.value);
      }
    }
  }
  replaceChildren(leftNode, getChildNodes(rightNode));
  return 1;
};

/**
 * @param {string} name
 * @noinline
 */
let createEvent = name => new Event(name);

/**
 * @param {HTMLFormElement=} el
 * @noinline
 */
let createFormData = el => new FormData(el);

/**
 * @param {URL} url
 * @param {!FormData} formData
 * @noinline
 */
let updateSearch = (url, formData) => {
  // @ts-ignore
  url.search = new URLSearchParams(formData).toString();
};

let ifAttr = "a";
let applyStateMeth = "b";
let invalidMatchAttr = "c";
let validateMeth = "d";
let isDialogAttr = "e";
let throttleAttr = "f";
let debounceAttr = "g";
let timerAttr = "h";
let hrefAttr = "i";
let verbAttr = "j";
let requestMeth = "k";
let errorMatchAttr = "l";
let loadingMatchAttr = "m";
let markErrorMeth = "n";
let markLoadingMeth = "o";
let isPostAttr = "p";
let withCredentialsAttr = "q";
let ownerElementAttr = "r";
let onceAttr = "s";
let posAttr = "t";
let onAttr = "u";
let observerAttr = "v";
let activeAttr = "w";
let resolveMeth = "x";
/** @noinline */
let dropStr = "__DROP__";
/** @noinline */
let navigateStr = "navigate";
/** @noinline */
let revealStr = "reveal";
/** @noinline */
let concealStr = "conceal";
/** @noinline */
let renderStr = "render";
/** @noinline */
let checkValidityStr = "checkValidity";
/** @noinline */
let pushStateStr = "pushState";
/** @noinline */
let replaceStateStr = "replaceState";
/** @noinline */
let replaceChildrenStr = "replaceChildren";
/** @noinline */
let replaceWithStr = "replaceWith";
/** @noinline */
let emptyArr = [];
/** @noinline */
let emptyObj = {};
/** @noinline */
let historyMethod = [pushStateStr, replaceStateStr];
/** @noinline */
let nativeRender = ["after", "append", "before", "prepend"];
/** @noinline */
let nonSpacePattern = /\S+/g;
/** @noinline */
let trailingSlashPattern = /\/*$/;
/** @noinline */
let extensionPattern = /\.[^\/]+$/;
/** @noinline */
let doc = document;
/** @noinline */
let raf = requestAnimationFrame;
let navigateEvent = createEvent(navigateStr);
let revealEvent = createEvent(revealStr);
let concealEvent = createEvent(concealStr);
let renderEvent = createEvent(renderStr);

/** @type {!Object<string, Array<!Element>>} */
let onElements = {};

/** @type {!Object<string, Array<!Element>>} */
let ifElements = {};

/** @type {Array<!Element>} */
let navigateElements = [];

/** @type {Object<string, boolean>} */
let state = {};

/**
 * @param {Element} el
 * @param {string} name
 * @noinline
 */
let getAttributeNode = (el, name) => el.getAttributeNode(name);

/**
 * @param {string} base
 * @noinline
 */
let resolveUrl = base => {
  let { pathname, href } = location;
  return new URL(base, extensionPattern.test(pathname) ? href : href.replace(trailingSlashPattern, "/"));
};

/** @param {string} value */
let split = value => {
  let match = value.match(nonSpacePattern);
  return match && match.length ? match : undefined;
};

/**
 * @param {Element} el
 * @noinline
 */
let getAttrs = el => el.attributes;

/**
 * @param {Node} node
 * @returns {!Array<!ChildNode>}
 * @noinline
 */
let getChildNodes = node => /** @type {!Array<!ChildNode>} */(/** @type {*} */(node.childNodes));

/**
 * @param {EventTarget} target
 * @param {!Event} event
 * @noinline
 */
let pub = (target, event) => target.dispatchEvent(event);

/** @param {function(IntersectionObserverEntry): void} handle */
let createObserver = handle => new IntersectionObserver(entries => entries.forEach(handle));

/**
 * @param {boolean} intersect
 * @param {!Event} event
 * @returns {function(IntersectionObserverEntry) : void}
 */
let createHandle = (intersect, event) => entry => entry.isIntersecting === intersect && pub(entry.target, event);

/** @param {Element} el */
let dispatchNavigate = el => pub(el, navigateEvent);

/**
 * @param {IntersectionObserver} observer
 * @returns {function(Element): void}
 */
let createInitIntersect = observer => el => {
  el[observerAttr] = observer;
  observer.observe(el);
};

/**
 * @param {!Element} el
 * @noinline
 */
let deInitObserver = el => {
  el[observerAttr].unobserve(el);
  delete el[observerAttr];
};

let revealObserver = createObserver(createHandle(true, revealEvent));
let concealObserver = createObserver(createHandle(false, concealEvent));

/**
 * @param {!Element} el
 * @param {string} value
 */
let initOn = (el, value) => {
  el[onAttr] = value;
  onElements[value] ? onElements[value].push(el) : onElements[value] = [el];
};

/**
 * @param {!Element} el
 * @noinline
 */
let deInitOn = el => {
  onElements[el[onAttr]].splice(onElements[el[onAttr]].indexOf(el), 1);
  delete el[onAttr];
};

/**
 * @param {!Element} el
 * @param {string} value
 */
let initIf = (el, value) => {
  el[ifAttr] = value;
  el[applyStateMeth] = applyState;
  ifElements[value] ? ifElements[value].push(el) : ifElements[value] = [el];
};

/**
 * @param {!Element} el
 * @noinline
 */
let deInitIf = el => {
  ifElements[el[ifAttr]].splice(ifElements[el[ifAttr]].indexOf(el), 1);
  delete el[ifAttr];
  delete el[activeAttr];
  delete el[applyStateMeth];
};

/** @param {!Element} el */
let initNavigate = el => navigateElements.push(el);

/**
 * @param {!Element} el
 * @noinline
 */
let deInitNavigate = el => navigateElements.splice(navigateElements.indexOf(el), 1);

/**
 * @param {!Element} el
 * @param {string} value
 */
let initInvalid = (el, value) => {
  if (typeof el[checkValidityStr] === "function") {
    let match = split(value);
    if (match) {
      el[invalidMatchAttr] = match;
      el[validateMeth] = validate;
      el[validateMeth](true);
    }
  }
};

/** @param {!Element} el */
let deInitInvalid = el => {
  delete el[invalidMatchAttr];
  delete el[validateMeth];
};

/**
 * @param {!Element} el
 * @param {string} value
 */
let initError = (el, value) => {
  let match = split(value);
  if (match) {
    el[errorMatchAttr] = match;
    el[markErrorMeth] = markError;
  }
};

/** @param {!Element} el */
let deInitError = el => {
  delete el[errorMatchAttr];
  delete el[markErrorMeth];
};

/**
 * @param {!Element} el
 * @param {string} value
 */
let initLoading = (el, value) => {
  let match = split(value);
  if (match) {
    el[loadingMatchAttr] = match;
    el[markLoadingMeth] = markLoading;
  }
};

/** @param {!Element} el */
let deInitLoading = el => {
  delete el[loadingMatchAttr];
  delete el[markLoadingMeth];
};

/**
 * @param {!Element} el
 * @param {string} value
 */
let initMethod = (el, value) => value === "dialog" && (el[isDialogAttr] = true);

/**
 * @param {string} key
 * @returns {function(Element): void}
 */
let createDeInitKey = key => el => {
  delete el[key];
};

/**
 * @param {string} key
 * @returns {function(Element, string): number}
 */
let createInitDelay = key => (el, value) => el[key] = Number(value);

/**
 * @param {string} verb
 * @returns {function(Element, string): void}
 */
let createInitVerb = verb => (el, value) => {
  el[hrefAttr] = value;
  el[verbAttr] = verb;
  verb === "POST" && (el[isPostAttr] = true);
  el[requestMeth] = request;
};

/** @param {!Element} el */
let deInitVerb = el => {
  delete el[verbAttr];
  delete el[isPostAttr];
  delete el[requestMeth];
};

/**
 * @param {!Element} el
 * @param {string} value
 */
let initHref = (el, value) => {
  el[hrefAttr] = value;
  el[pushStateStr] = pushState;
  el[replaceStateStr] = replaceState;
};

/** @param {!Element} el */
let deInitHref = el => {
  delete el[pushStateStr];
  delete el[replaceStateStr];
};

/**
 * @param {!Element} el
 * @param {string} value
 */
let initPos = (el, value) => el[posAttr] = value;

/**
 * @param {string} key
 * @returns {function(Element): boolean}
 */
let createInitHasAttr = key => el => el[key] = true;

let attrMap = {
  "on": [initOn, deInitOn],
  "if": [initIf, deInitIf],
  ["on:" + navigateStr]: [initNavigate, deInitNavigate],
  ["on:" + revealStr]: [createInitIntersect(revealObserver), deInitObserver],
  ["on:" + concealStr]: [createInitIntersect(concealObserver), deInitObserver],
  "if:invalid": [initInvalid, deInitInvalid],
  "if:error": [initError, deInitError],
  "if:loading": [initLoading, deInitLoading],
  "method": [initMethod, createDeInitKey(isDialogAttr)],
  "throttle": [createInitDelay(throttleAttr), createDeInitKey(throttleAttr)],
  "debounce": [createInitDelay(debounceAttr), createDeInitKey(debounceAttr)],
  "href": [initHref, deInitHref],
  "action": [initHref, deInitHref],
  "get": [createInitVerb("GET"), deInitVerb],
  "post": [createInitVerb("POST"), deInitVerb],
  "put": [createInitVerb("PUT"), deInitVerb],
  "delete": [createInitVerb("DELETE"), deInitVerb],
  "credentials": [createInitHasAttr(withCredentialsAttr), createDeInitKey(withCredentialsAttr)],
  "once": [createInitHasAttr(onceAttr), createDeInitKey(onceAttr)],
  "pos": [initPos, createDeInitKey(posAttr)],
};

/** @param {Node} root */
let initTree = root => {
  if (root instanceof Element) for (let attr of getAttrs(root)) attrMap[attr.name]?.[0](root, attr.value);
  getChildNodes(root).forEach(initTree);
  return root;
};

/**
 * @param {Element} el
 * @noinline
 */
let clearTimer = el => el[timerAttr] = clearTimeout(el[timerAttr]);

/**
 * @param {Element} el
 * @param {!Array<string>} match
 * @param {number} delay
 * @noinline
 */
let startTimer = (el, match, delay) => el[timerAttr] = setTimeout(execute.bind(null, el, match), delay);

/** @param {!Array<function(): void>} queue */
let enqueue = queue => queue.length && raf(() => {
  for (let fn of queue) fn();
});

/**
 * @param {Element} el
 * @param {!Array<string>} match
 */
let execute = (el, match) => raf(() => {
  clearTimer(el);
  let queue = [];
  for (let action of match) {
    if (historyMethod.includes(action)) el[action]?.();
    for (let onEl of onElements[action] || emptyArr) onEl[requestMeth] && queue.push(onEl[requestMeth]());
  }
  Promise.all(queue).then(enqueue);
});

/** @param {Event} event */
let onEvent = event => {
  let el = event.target;
  if (el instanceof Element) {
    let attr = getAttributeNode(el, "on:" + event.type);
    if (attr) {
      let match = split(attr.value);
      if (match) {
        el[isDialogAttr] || event.preventDefault();
        if (!el[timerAttr]) {
          if (el[throttleAttr]) {
            startTimer(el, match, el[throttleAttr]);
          } else if (el[debounceAttr]) {
            clearTimer(el);
            startTimer(el, match, el[debounceAttr]);
          } else {
            execute(el, match);
          }
        }
      }
    }
  }
};

/** @param {Event} event */
let onLoad = event => raf(() => {
  initTree(/** @type {Node} */(event.target));
  for (let key in ifElements) for (let el of ifElements[key] || emptyArr) el[applyStateMeth]();
});

/** @param {Event} event */
let onChange = event => raf(() => (/** @type {Element} */(event.target))[validateMeth]?.());

/** @param {Event} event */
let onInvalid = event => raf(() => (/** @type {Element} */(event.target))[validateMeth]?.(false, true));

/** @noinline */
let onNavigate = () => navigateElements.forEach(dispatchNavigate);

/**
 * @param {EventTarget} target
 * @param {string} name
 * @param {function(Event): void} handler
 * @noinline
 */
let sub = (target, name, handler) => target.addEventListener(name, handler, true);

[navigateStr, revealStr, concealStr, renderStr].forEach(name => sub(doc, name, onEvent));
for (let key in doc) key.startsWith("on") && sub(doc, key.substring(2), onEvent);
sub(doc, "DOMContentLoaded", onLoad);
["input", "change"].forEach(name => sub(doc, name, onChange));
sub(doc, "invalid", onInvalid);
sub(window, "popstate", onNavigate);
