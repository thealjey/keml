import { hasToken } from "../util/hasToken.mts";
import {
  clearFocusElement,
  clearStateDirty,
  getFocusElement,
  ifColonElements,
  ifElements,
  isStateDirty,
  markStateDirty,
  popDiscoverableElement,
  popOneTimeElement,
  popRenderPayload,
  popResettableElement,
  popScrollableElement,
  renderElements,
} from "./data.mts";
import { patchers } from "./patchers.mts";
import { disableState, enableState } from "./state.mts";
import { writeAttribute } from "./writeAttribute.mts";
import { writeScrollAxis } from "./writeScrollAxis.mts";

const emptyChildNodes: readonly ChildNode[] = [];
const validBehaviors = ["auto", "instant", "smooth"] as const;
const resultEvent = new Event("result");
const failureEvent = new Event("failure");
const discoverEvent = new Event("discover");

/**
 * Core rendering loop that processes queued UI updates, payloads, and DOM
 * effects.
 *
 * This function continuously flushes multiple internal render queues:
 * - Resettable elements (calls reset hooks)
 * - One-time attribute markers
 * - Render payloads (XHR/SSE results mapped to DOM updates)
 * - Conditional rendering state updates
 * - Scroll actions
 * - Focus management
 *
 * It performs DOM patching, attribute-driven rendering, and state
 * reconciliation, then schedules itself for the next animation frame.
 *
 * @remarks
 * This is a perpetual loop driven by `requestAnimationFrame`.
 * It is responsible for keeping the UI state in sync with internal queues
 * and side-effect systems.
 */
export const render = () => {
  let el,
    temp,
    status,
    responseXML,
    batch,
    actions,
    actions2d,
    root,
    options: ScrollToOptions;

  while ((el = popResettableElement())) {
    el.reset?.();
  }

  while ((el = popOneTimeElement())) {
    writeAttribute(el, "on");
  }

  while ((temp = popRenderPayload())) {
    ({ ownerElement: el, status, responseXML } = temp.target);
    actions = el.getAttribute((el.isError = status > 399) ? "error" : "result");

    batch = [];
    root = undefined;
    for (temp of renderElements) {
      if (hasToken(actions, temp.getAttribute("render"))) {
        batch.push([
          temp,
          responseXML ?
            Array.from(
              (root ? root.cloneNode(true) : (root = responseXML.body))
                .childNodes,
            )
          : emptyChildNodes,
        ] as const);
      }
    }

    while ((temp = batch.pop())) {
      (
        patchers[temp[0].getAttribute("position") as keyof typeof patchers] ??
        patchers.replaceChildren
      )(...temp);
    }

    el.isLoading = false;
    markStateDirty();

    el.dispatchEvent(el.isError ? failureEvent : resultEvent);
  }

  if (isStateDirty()) {
    clearStateDirty();

    actions2d = [];
    for (el of ifColonElements) {
      (el.checkValidity?.() ?? true) ||
        ((temp = el.getAttributeNode("if:invalid")) &&
          actions2d.push(temp.value));

      // we don't care about the type
      // as long as the element conforms to the shape
      ((el as HTMLInputElement).type === "checkbox" ?
        (el as HTMLInputElement).checked
      : (el as HTMLInputElement).value) &&
        (temp = el.getAttributeNode("if:value")) &&
        actions2d.push(temp.value);

      el.isIntersecting &&
        (temp = el.getAttributeNode("if:intersects")) &&
        actions2d.push(temp.value);

      el.isLoading &&
        (temp = el.getAttributeNode("if:loading")) &&
        actions2d.push(temp.value);

      el.isError &&
        (temp = el.getAttributeNode("if:error")) &&
        actions2d.push(temp.value);
    }
    actions = actions2d.join(" ");

    for (el of ifElements) {
      (hasToken(actions, el.getAttribute("if")) ? enableState : disableState)(
        el,
      );
    }
  }

  while ((el = popScrollableElement())) {
    options = {
      behavior:
        (
          validBehaviors.includes(
            (temp = el.getAttribute(
              "behavior",
            ) as (typeof validBehaviors)[number]),
          )
        ) ?
          temp
        : validBehaviors[0],
    };
    writeScrollAxis(el, options, "top");
    writeScrollAxis(el, options, "left");

    ("top" in options || "left" in options) &&
      el[el.hasAttribute("relative") ? "scrollBy" : "scroll"](options);
  }

  while ((el = popDiscoverableElement())) {
    el.dispatchEvent(discoverEvent);
  }

  if ((el = getFocusElement())) {
    clearFocusElement();

    try {
      // pretend the element supports this
      // silent failures are ok and expected
      temp = (el as HTMLInputElement).value.length;
      (el as HTMLInputElement).focus();
      (el as HTMLInputElement).setSelectionRange(temp, temp);
    } catch {}
  }

  requestAnimationFrame(render);
};
