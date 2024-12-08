interface Element {
  loading_: 0 | 1;
  error_: boolean;
  timeoutId_: number | undefined;
  value: string | undefined;
  reset?: () => void;
  checkValidity?: () => void;
  focus(): void;
  setSelectionRange(a: number, b: number): void;
}
interface XMLHttpRequest {
  owner_: Element;
}

(() => {
  var XHR = XMLHttpRequest;
  var ELT = Element;
  var INP = HTMLInputElement;
  var SEL = HTMLSelectElement;
  var TAR = HTMLTextAreaElement;
  var DOC = document;
  var YES = true;
  var SPACE_PATTERN = /\S+/g;
  var NAVIGATE = "navigate";
  var RESULT = "result";
  var REVEAL = "reveal";
  var CONCEAL = "conceal";
  var STATE = "state";
  var RESET = "reset" as const;
  var VALUE = "value" as const;
  var REPLACE_WITH = "replaceWith" as const;
  var ATTRIBUTE = "Attribute";
  var IF_COLON = "if:";
  var ON = "on";
  var ON_COLON = ON + ":";
  var IF_INTERSECTS = IF_COLON + "intersects";
  var INTERSECT_NAMES = [ON_COLON + REVEAL, ON_COLON + CONCEAL, IF_INTERSECTS];

  var method =
    <A extends string>(a: A) =>
    <B extends any[], C>(b: { [D in A]: (...a: B) => C }, ...c: B) =>
      b[a](...c);
  var getter =
    <A extends string>(a: A) =>
    <B>(b: { [C in A]: B }): B =>
      b[a];
  var isInstance = <A extends new (...a: any) => any>(
    a: A,
    b: any
  ): b is InstanceType<A> => b instanceof a;

  var from = Array.from;
  var addListener = method("addEventListener");
  var add = method("add");
  var push = method("push");
  var setRequestHeader = method("setRequestHeader");
  var del = method("delete");
  var each = method("forEach");
  var hasAttribute = method(("has" + ATTRIBUTE) as "hasAttribute");
  var getAttribute = method(("get" + ATTRIBUTE) as "getAttribute");
  var setAttribute = method(("set" + ATTRIBUTE) as "setAttribute");
  var removeAttribute = method(("remove" + ATTRIBUTE) as "removeAttribute");
  var getAttributeNode = method(
    ("get" + ATTRIBUTE + "Node") as "getAttributeNode"
  );
  var match = method("match");
  var startsWith = method("startsWith");
  var includes = method("includes");
  var substring = method("substring");
  var attributes = getter("attributes");
  var childNodes = getter("childNodes");
  var getName = getter("name");
  var target = getter("target");
  var value = getter(VALUE);
  var size = getter("length");

  var createSet = () => new Set<Element>();
  var stateQueue: 0 | 1 = 1;
  var renderQueue: Array<XMLHttpRequest> = [];
  var frm = DOC.createElement("form");
  var navigateElements = createSet();
  var actionElements = createSet();
  var conditionElements = createSet();

  var validate = (el: Element) => el.checkValidity?.() ?? YES;
  var createFormData = (a?: HTMLFormElement) => new FormData(a);
  var fire = (a: Element, b: string) => a.dispatchEvent(new Event(b));

  var dispatchNavigate = () => {
    for (var el of navigateElements) {
      fire(el, NAVIGATE);
    }
  };

  var observer = new IntersectionObserver(entries => {
    for (var entry of entries) {
      fire(target(entry), entry.isIntersecting ? REVEAL : CONCEAL);
    }
    stateQueue = 1;
  });

  var onAttribute = (el: Element, attrName: string, present: boolean) => {
    var a;
    if (includes([ON, RESET, "render"], attrName)) {
      present ? add(actionElements, el) : del(actionElements, el);
    } else if (attrName == "if") {
      present ? add(conditionElements, el) : del(conditionElements, el);
    } else if (attrName == ON_COLON + NAVIGATE) {
      present ? add(navigateElements, el) : del(navigateElements, el);
    } else if (attrName == "autofocus" && present && (a = value(el))) {
      try {
        el.focus();
        el.setSelectionRange((a = size(a)), a);
      } catch {}
    } else if (((a = from(attributes(el))), startsWith(attrName, IF_COLON))) {
      a.find(attr => startsWith(getName(attr), IF_COLON))
        ? add(actionElements, el)
        : del(actionElements, el);
    } else if (includes(INTERSECT_NAMES, attrName)) {
      observer.unobserve(el);
      a.find(attr => includes(INTERSECT_NAMES, getName(attr))) &&
        observer.observe(el);
    }
  };

  var onNode = (node: Node) => {
    if (isInstance(ELT, node)) {
      for (var attr of attributes(node)) {
        onAttribute(node, getName(attr), YES);
      }
      each(childNodes(node), onNode);
    }
  };

  var unNode = (node: Node) => {
    if (isInstance(ELT, node)) {
      del(actionElements, node);
      del(conditionElements, node);
      del(navigateElements, node);
      observer.unobserve(node);
      each(childNodes(node), unNode);
    }
  };

  var methods = match(
    "src action href get delete put post",
    SPACE_PATTERN
  ) as string[];

  var commitAction = (el: Element) => {
    var a: URL | number | Attr,
      b,
      c,
      d: XMLHttpRequest | string | null | [string, string | File],
      e;
    stopTimer(el);
    if (validate(el)) {
      hasAttribute(el, "once") && removeAttribute(el, ON);
      for (a = 7; a--; ) {
        if (hasAttribute(el, methods[a] as string)) {
          break;
        }
      }
      b = (
        getAttribute(el, "method") ?? (methods[a < 3 ? 3 : a] as string)
      ).toUpperCase();
      a = new URL(
        a == -1 ? "" : (getAttribute(el, methods[a] as string) as string),
        el.baseURI
      );
      a.pathname = (e = a.pathname).replace(
        /\/*$/,
        /\.[^\/]+\/*$/.test(e) ? "" : "/"
      );
      if (
        (c = isInstance(HTMLFormElement, el)
          ? createFormData(el)
          : isInstance(INP, el) || isInstance(SEL, el) || isInstance(TAR, el)
          ? (frm.replaceChildren(el.cloneNode(YES)), createFormData(frm))
          : ((e = createFormData()),
            (c = getAttribute(el, "name")) &&
              (d = getAttribute(el, VALUE)) &&
              e.set(c, d),
            e)) &&
        b != "POST"
      ) {
        c = each(
          c,
          (b, c) => typeof b == "string" && (a as URL).searchParams.append(c, b)
        ) as undefined;
      }
      if (
        (d = getAttribute(el, "redirect")) == "pushState" ||
        d == "replaceState"
      ) {
        history[d]({}, "", a);
        dispatchNavigate();
      } else if (d == "assign" || d == "replace") {
        location[d](a);
      } else {
        d = new XHR();
        d.responseType = "document";
        d.withCredentials = hasAttribute(el, "credentials");
        d.owner_ = el;
        d.onloadend = () => push(renderQueue, d as XMLHttpRequest);
        d.open(b, a);
        setRequestHeader(d, "X-Requested-With", getName(XHR));
        for (a of attributes(el)) {
          startsWith((b = getName(a)), "h-") &&
            setRequestHeader(d, substring(b, 2), value(a));
        }
        el.error_ = false;
        el.loading_ = stateQueue = 1;
        d.send(c);
      }
    }
  };

  var startTimer = (el: Element, delay: string) =>
    (el.timeoutId_ = setTimeout(commitAction, +delay, el));

  var stopTimer = (el: Element) =>
    (el.timeoutId_ = clearTimeout(el.timeoutId_) as undefined);

  var onEvent = (e: Event) => {
    var a, b, c;
    if (isInstance(ELT, (a = target(e)))) {
      if (
        (b = getAttribute(a, "event:" + e.type)) &&
        (b = b.split(/\s*,\s*/))
      ) {
        for (b of b) {
          if (
            (b = b.split(/\s*=\s*/) as
              | [keyof Event]
              | [keyof Event, string]
              | null) &&
            e[b[0]] + "" != (b[1] ?? YES + "")
          ) {
            return;
          }
        }
      }
      if (
        (a = getAttribute(a, ON_COLON + e.type)) &&
        (a = match(a, SPACE_PATTERN))
      ) {
        e.preventDefault();
        for (b of actionElements) {
          if (includes(a, getAttribute(b, ON) || "")) {
            if ((c = getAttribute(b, "throttle"))) {
              b.timeoutId_ || startTimer(b, c);
            } else if ((c = getAttribute(b, "debounce"))) {
              stopTimer(b);
              startTimer(b, c);
            } else {
              commitAction(b);
            }
          }
          includes(a, getAttribute(b, RESET) || "") && b[RESET]?.();
        }
      }
    }
  };

  var replaceWith = (left: ChildNode, right: Node) => {
    var a, b, c, d, e;
    if (left.nodeName == right.nodeName) {
      for (a of ["nodeValue", VALUE, "checked"]) {
        (left as any)[a] == (b = (right as any)[a]) || ((left as any)[a] = b);
      }
      if (left.nodeType == 1) {
        disableState(left as Element);
        for (b = size((a = attributes(left as Element))); b--; ) {
          hasAttribute(right as Element, (c = getName(a[b] as Attr))) ||
            removeAttribute(left as Element, c);
        }
        for (b = size((a = attributes(right as Element))); b--; ) {
          e = value((c = a[b] as Attr));
          if ((c = getAttributeNode(left as Element, (d = getName(c))))) {
            if (value(c) != e) {
              c.value = e;
            }
          } else {
            setAttribute(left as Element, d, e);
          }
        }
        replaceChildren(left as Element, from(childNodes(right)));
      }
    } else {
      left[REPLACE_WITH](right);
    }
  };

  var replaceChildren = (el: Element, nodes: Node[]) => {
    for (
      var len = Math.max(size(childNodes(el)), size(nodes)), i = 0, left, right;
      i < len;
      ++i
    ) {
      left = childNodes(el)[i];
      right = nodes[i] as Node;
      if (left) {
        if (right) {
          replaceWith(left, right);
        } else {
          left.remove();
          --i;
          --len;
        }
      } else {
        el.appendChild(right);
      }
    }
  };

  var applyState = (el: Element) => {
    var attr: Attr;
    var attrName: string;
    var attrValue: string;
    var baseName: string;
    var baseAttr: Attr | null;
    for (attr of from(attributes(el))) {
      attrName = getName(attr);
      attrValue = value(attr);
      baseName = substring(attrName, 2);
      baseAttr = getAttributeNode(el, baseName);
      if (startsWith(attrName, "x-")) {
        if (baseAttr) {
          attr.value = value(baseAttr);
          baseAttr.value = attrValue;
        } else {
          removeAttribute(el, attrName);
          setAttribute(el, "d-" + baseName, "");
          setAttribute(el, baseName, attrValue);
        }
      } else if (startsWith(attrName, "d-")) {
        baseAttr && setAttribute(el, "x-" + baseName, value(baseAttr));
        removeAttribute(el, attrName);
        removeAttribute(el, baseName);
      }
    }
  };

  var disableState = (el: Element) => {
    if (hasAttribute(el, STATE)) {
      removeAttribute(el, STATE);
      applyState(el);
    }
  };

  var render = () => {
    var a, b, c, d, e, f, g;
    while ((a = renderQueue.pop())) {
      if (
        (c = getAttribute(
          (b = a.owner_),
          (b.error_ = a.status > 399) ? "error" : RESULT
        )) &&
        (c = match(c, SPACE_PATTERN))
      ) {
        a = a.responseXML?.body;
        for (d of actionElements) {
          if (includes(c, getAttribute(d, "render") || "")) {
            f = a ? from(childNodes((e = e ? a.cloneNode(YES) : a))) : [];
            if (
              includes(
                match("after append before prepend", SPACE_PATTERN) as string[],
                (g = getAttribute(d, "position") as string)
              )
            ) {
              d[g as "after" | "append" | "before" | "prepend"](...f);
            } else if (g == REPLACE_WITH) {
              g = f.shift();
              if (g) {
                d.after(...f);
                replaceWith(d, g);
              } else {
                d.remove();
              }
            } else {
              replaceChildren(d, f);
            }
          }
        }
      }
      b.loading_ = 0;
      stateQueue = 1;
      b.error_ || fire(b, RESULT);
    }
    if (stateQueue) {
      stateQueue = 0;
      a = [] as string[];
      for (b of actionElements) {
        (c = getAttribute(b, IF_COLON + "invalid")) &&
          (c = match(c, SPACE_PATTERN)) &&
          !validate(b) &&
          push(a, ...c);
        (c = getAttribute(b, IF_COLON + VALUE)) &&
          (c = match(c, SPACE_PATTERN)) &&
          (isInstance(SEL, b) || isInstance(TAR, b)
            ? value(b)
            : isInstance(INP, b)
            ? b.type == "checkbox"
              ? b.checked
              : value(b)
            : 0) &&
          push(a, ...c);
        (c = getAttribute(b, IF_INTERSECTS)) &&
          (c = match(c, SPACE_PATTERN)) &&
          !((d = b.getBoundingClientRect()),
          d.bottom < 0 ||
            d.right < 0 ||
            d.left > innerWidth ||
            d.top > innerHeight) &&
          push(a, ...c);
        b.loading_ &&
          (c = getAttribute(b, IF_COLON + "loading")) &&
          (c = match(c, SPACE_PATTERN)) &&
          push(a, ...c);
        b.error_ &&
          (c = getAttribute(b, IF_COLON + "error")) &&
          (c = match(c, SPACE_PATTERN)) &&
          push(a, ...c);
      }
      for (b of conditionElements) {
        if (includes(a, getAttribute(b, "if") as string)) {
          if (!hasAttribute(b, STATE)) {
            applyState(b);
            setAttribute(b, STATE, "");
          }
        } else {
          disableState(b);
        }
      }
    }
    requestAnimationFrame(render);
  };

  addListener(
    DOC,
    "DOMContentLoaded",
    () => {
      DOC.cookie =
        `tzo=${new Date().getTimezoneOffset()};Path=/;SameSite=lax;Max-Age=` +
        9 ** 8;
      each(childNodes(DOC), onNode);
      new MutationObserver(records => {
        var a, b;
        for (a of records) {
          each(a.removedNodes, unNode);
          each(a.addedNodes, onNode);
          (b = a.attributeName) &&
            onAttribute((a = target(a) as Element), b, hasAttribute(a, b));
        }
        stateQueue = 1;
      }).observe(DOC, { attributes: YES, childList: YES, subtree: YES });
      for (var name in DOC) {
        startsWith(name, ON) &&
          addListener(DOC, substring(name, 2), onEvent, YES);
      }
      for (name of [CONCEAL, NAVIGATE, RESULT, REVEAL]) {
        addListener(DOC, name, onEvent, YES);
      }
      for (name of ["change", "input", RESET]) {
        addListener(DOC, name, () => (stateQueue = 1), YES);
      }
      addListener(window, "popstate", dispatchNavigate, YES);
      render();
    },
    YES
  );
})();
