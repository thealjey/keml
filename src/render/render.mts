import { SseManager } from "../network/SseManager.mts";
import { resolveValue } from "../runtime/resolveValue.mts";
import { hasToken } from "../util/hasToken.mts";
import { isFileList } from "../util/isFileList.mts";
import {
  clearFocusElement,
  clearNeedsSse,
  clearRefDirty,
  clearStateDirty,
  getFocusElement,
  getNeedsSse,
  ifColonElements,
  ifElements,
  isRefDirty,
  isStateDirty,
  linkElements,
  markStateDirty,
  popAttrEventStack,
  popDiscoverableElement,
  popOneTimeElement,
  popRenderPayload,
  popResettableElement,
  popScrollableElement,
  refElements,
  renderElements,
} from "./data.mts";
import { patchers } from "./patchers.mts";
import { readLiveValue } from "./readLiveValue.mts";
import { disableState, enableState } from "./state.mts";
import { addTransition, startTransition } from "./transition.mts";
import { writeAttribute } from "./writeAttribute.mts";
import { writeScrollAxis } from "./writeScrollAxis.mts";

const emptyChildNodes: ChildNode[] = [];
const validBehaviors = ["auto", "instant", "smooth"];
const resultEvent = new Event("result");
const failureEvent = new Event("failure");
const discoverEvent = new Event("discover");
const attrEvent = new Map<string, Event>();

/**
 * Core rendering loop that processes queued UI updates, payloads, and DOM
 * effects.
 *
 * @remarks
 * This is a perpetual loop driven by `requestAnimationFrame`.
 * It is responsible for keeping the UI state in sync with internal queues
 * and side-effect systems.
 */
export const render = () => {
  let el: Element | undefined;
  let ownerElement: Element | undefined;
  let otherElement: Element | undefined;
  let responseXML: Document | null;
  let payload: RenderPayload | undefined;
  let name: string;
  let otherName: string;
  let value: string | null;
  let actions: string | null;
  let actions2d: string[];
  let patchParams: [Element, ChildNode[]] | undefined;
  let patchBatch: [Element, ChildNode[]][];
  let patcher: (node: Element, nodes: ChildNode[]) => void;
  let nodes: ChildNode[];
  let status: number;
  let attr: Attr | null;
  let inputValue: string | boolean | FileList | null;
  let options: ScrollToOptions;
  let attrEventEntry: [Element, string] | undefined;
  let event: Event | undefined;

  while ((el = popResettableElement())) {
    el.reset?.();
  }

  while ((el = popOneTimeElement())) {
    writeAttribute(el, "on");
  }

  while ((payload = popRenderPayload())) {
    ({ ownerElement, status, responseXML } = payload.target);
    actions = ownerElement.getAttribute(
      (ownerElement.isError = status > 399) ? "error" : "result",
    );

    patchBatch = [];
    otherElement = undefined;
    for (el of renderElements) {
      hasToken(actions, el.getAttribute("render")) &&
        patchBatch.push([
          el,
          responseXML ?
            Array.from(
              (otherElement ?
                otherElement.cloneNode(true)
              : (otherElement = responseXML.body)
              ).childNodes,
            )
          : emptyChildNodes,
        ]);
    }

    while ((patchParams = patchBatch.pop())) {
      [el, nodes] = patchParams;
      patcher =
        patchers[el.getAttribute("position") as keyof typeof patchers] ??
        patchers.replaceChildren;
      addTransition(patcher, el, nodes) || patcher(el, nodes);
    }

    ownerElement.isLoading = false;
    markStateDirty();

    ownerElement.dispatchEvent(
      ownerElement.isError ? failureEvent : resultEvent,
    );
  }

  startTransition();

  if (isStateDirty()) {
    clearStateDirty();

    actions2d = [];
    for (el of ifColonElements) {
      !(el.checkValidity?.() ?? true) &&
        (attr = el.getAttributeNode("if:invalid")) &&
        actions2d.push(attr.value);

      (inputValue = resolveValue(el)) &&
        (!isFileList(inputValue) || inputValue.length) &&
        (attr = el.getAttributeNode("if:value")) &&
        actions2d.push(attr.value);

      el.isIntersecting &&
        (attr = el.getAttributeNode("if:intersects")) &&
        actions2d.push(attr.value);

      el.isLoading &&
        (attr = el.getAttributeNode("if:loading")) &&
        actions2d.push(attr.value);

      el.isError &&
        (attr = el.getAttributeNode("if:error")) &&
        actions2d.push(attr.value);
    }
    actions = actions2d.join(" ");

    for (el of ifElements) {
      hasToken(actions, el.getAttribute("if")) ?
        enableState(el)
      : disableState(el);
    }
  }

  if (isRefDirty()) {
    clearRefDirty();

    for (el of linkElements) {
      for ({ name, value } of el.attributes) {
        if (name.startsWith("link:")) {
          name = name.slice(5);
          for (otherElement of refElements) {
            for ({
              name: otherName,
              value: actions,
            } of otherElement.attributes) {
              otherName.startsWith("ref:") &&
                hasToken(actions, value) &&
                writeAttribute(
                  el,
                  name,
                  readLiveValue(otherElement, otherName.slice(4)),
                );
            }
          }
        }
      }
    }
  }

  while ((el = popScrollableElement())) {
    options = {
      behavior: ((
        validBehaviors.includes((value = el.getAttribute("behavior"))!)
      ) ?
        value
      : validBehaviors[0]) as ScrollBehavior,
    };
    writeScrollAxis(el, options, "top");
    writeScrollAxis(el, options, "left");

    ("top" in options || "left" in options) &&
      (el.hasAttribute("relative") ? el.scrollBy(options) : el.scroll(options));
  }

  while ((el = popDiscoverableElement())) {
    el.dispatchEvent(discoverEvent);
  }

  while ((attrEventEntry = popAttrEventStack())) {
    [el, name] = attrEventEntry;
    event = attrEvent.get(name);
    event || attrEvent.set(name, (event = new Event("attr:" + name)));
    el.dispatchEvent(event);
  }

  if (getNeedsSse()) {
    clearNeedsSse();
    SseManager.instance.start();
  }

  if ((el = getFocusElement())) {
    clearFocusElement();

    try {
      // pretend the element supports this
      // silent failures are ok and expected
      status = (el as HTMLInputElement).value.length;
      (el as HTMLInputElement).focus();
      (el as HTMLInputElement).setSelectionRange(status, status);
    } catch {}
  }

  requestAnimationFrame(render);
};
