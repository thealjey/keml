import { parse_actions } from "./parse_actions.mts";
import { replace_children, replace_with } from "./replace.mts";
import { disable_state, enable_state } from "./state.mts";
import {
  conditionElements,
  onceQueue,
  renderElements,
  resetQueue,
  stateElements,
} from "./store.mts";

const emptyArr: [] = [];
const resultEvent = new Event("result");
const renderQueue: XMLHttpRequest[] = [];
let stateQueue = true;

/**
 * Queues an XMLHttpRequest for rendering based on a progress event.
 *
 * This function extracts the target of the provided `ProgressEvent`, casts it
 * to an XMLHttpRequest, and appends it to `renderQueue`. It is intended to be
 * used as a handler for progress-related events such as `load`, `loadend`, or
 * `progress`, particularly in contexts where you want to defer rendering until
 * multiple requests have completed.
 *
 * If the event's target is not an XMLHttpRequest or is `null`, the cast may
 * result in incorrect behavior. It assumes the event target is always a valid
 * XMLHttpRequest.
 *
 * This function mutates the `renderQueue` array by pushing new entries to it.
 *
 * Performance: Operates in constant time.
 *
 * @param event - The progress-related event whose target should be queued for
 *                rendering.
 *
 * @example
 * const xhr = new XMLHttpRequest();
 * xhr.addEventListener('loadend', queue_render);
 * xhr.open('GET', '/data');
 * xhr.send();
 *
 * // Later in the render loop:
 * for (const req of renderQueue) {
 *   renderResponse(req.responseText);
 * }
 */
export const queue_render = (event: ProgressEvent) =>
  renderQueue.push(event.target as XMLHttpRequest);

/**
 * Flags that a state update has been requested by setting `stateQueue` to
 * `true`.
 *
 * This function acts as a signal to defer or schedule a state-related
 * operation.
 *
 * It does not perform any state change itself but simply marks the system as
 * needing one.
 * Any logic that checks `stateQueue` should respond accordingly in its
 * processing loop.
 *
 * If `stateQueue` is already `true`, calling this function again has no
 * additional effect.
 *
 * Performance: Runs in constant time with negligible cost.
 *
 * @example
 * // Somewhere in the app loop
 * if (needsUpdate) {
 *   queue_state();
 * }
 *
 * // In a later processing stage
 * if (stateQueue) {
 *   updateAppState();
 *   stateQueue = false;
 * }
 */
export const queue_state = () => {
  stateQueue = true;
};

/**
 * The main render loop executed approximately 60 times per second using
 * `requestAnimationFrame`.
 *
 * This function:
 * - Processes queued elements that require reset or one-time attribute cleanup.
 * - Handles completed XMLHttpRequest responses by parsing results or errors,
 *   then updating matched render elements with new DOM nodes or state.
 * - Manages conditional state toggling on elements based on validity, value,
 *   intersection, loading, and error states.
 *
 * Performance considerations:
 * - Uses batching and cloning of DOM nodes efficiently to minimize reflows.
 * - Minimizes unnecessary DOM mutations by selectively updating only affected
 *   elements.
 * - Runs on the animation frame cycle to avoid blocking UI updates.
 *
 * Usage example:
 * ```ts
 * // The render loop is started once and runs continuously.
 * requestAnimationFrame(render);
 * ```
 */
export const render = () => {
  let el,
    renderEl,
    xhr,
    attr,
    actions: string[] | undefined,
    responseXML,
    nodes,
    childNodes,
    i,
    len,
    clone,
    position,
    rect,
    batch;
  while ((el = resetQueue.pop())) {
    el.reset?.();
  }
  while ((el = onceQueue.pop())) {
    el.removeAttribute("on");
  }
  while ((xhr = renderQueue.pop())) {
    responseXML = xhr.responseXML;
    el = xhr.ownerElement_;
    actions = undefined;
    if ((el.isError_ = xhr.status > 399)) {
      if ((attr = el.getAttributeNode("error"))) {
        actions = parse_actions(attr.value);
      }
    } else if ((attr = el.getAttributeNode("result"))) {
      actions = parse_actions(attr.value);
    }
    if (actions) {
      clone = false;
      childNodes = responseXML
        ? Array.from(responseXML.body.childNodes)
        : emptyArr;
      batch = [];
      for (renderEl of renderElements) {
        if (actions.includes(renderEl.getAttribute("render")!)) {
          if (clone) {
            nodes = [];
            i = 0;
            len = childNodes.length;
            for (; i < len; ++i) {
              nodes.push(childNodes[i]!.cloneNode(true) as ChildNode);
            }
          } else {
            nodes = childNodes;
          }
          batch.push(renderEl, nodes);
          clone = true;
        }
      }
      while ((nodes = batch.pop() as ChildNode[] | undefined)) {
        renderEl = batch.pop() as Element;
        if ((attr = renderEl.getAttributeNode("position"))) {
          position = attr.value;
          if (position === "after") {
            renderEl.after.apply(renderEl, nodes);
          } else if (position === "append") {
            renderEl.append.apply(renderEl, nodes);
          } else if (position === "before") {
            renderEl.before.apply(renderEl, nodes);
          } else if (position === "prepend") {
            renderEl.prepend.apply(renderEl, nodes);
          } else if (position === "replaceWith") {
            replace_with(renderEl, nodes);
          } else {
            replace_children(renderEl, nodes);
          }
        } else {
          replace_children(renderEl, nodes);
        }
      }
    }
    el.isLoading_ = false;
    stateQueue = true;
    if (!el.isError_) {
      el.dispatchEvent(resultEvent);
    }
  }
  if (stateQueue) {
    stateQueue = false;
    actions = [];
    for (el of stateElements) {
      if (
        el.checkValidity &&
        (attr = el.getAttributeNode("if:invalid")) &&
        !el.checkValidity()
      ) {
        actions.push.apply(actions, parse_actions(attr.value));
      }
      if (
        (el instanceof HTMLInputElement
          ? el.type === "checkbox"
            ? el.checked
            : el.value
          : (el instanceof HTMLSelectElement ||
              el instanceof HTMLTextAreaElement) &&
            el.value) &&
        (attr = el.getAttributeNode("if:value"))
      ) {
        actions.push.apply(actions, parse_actions(attr.value));
      }
      if ((attr = el.getAttributeNode("if:intersects"))) {
        rect = el.getBoundingClientRect();
        if (
          rect.bottom > -1 &&
          rect.right > -1 &&
          rect.left <= innerWidth &&
          rect.top <= innerHeight
        ) {
          actions.push.apply(actions, parse_actions(attr.value));
        }
      }
      if (el.isLoading_ && (attr = el.getAttributeNode("if:loading"))) {
        actions.push.apply(actions, parse_actions(attr.value));
      }
      if (el.isError_ && (attr = el.getAttributeNode("if:error"))) {
        actions.push.apply(actions, parse_actions(attr.value));
      }
    }
    for (el of conditionElements) {
      if (actions.includes(el.getAttribute("if")!)) {
        enable_state(el);
      } else {
        disable_state(el);
      }
    }
  }
  requestAnimationFrame(render);
};

/* c8 ignore next */
if (import.meta.vitest) {
  const {
    describe,
    expect,
    it,
    vi: { fn, spyOn, restoreAllMocks },
  } = import.meta.vitest;

  describe("render", () => {
    it("queue_render", () => {
      const target = "fake xhr";
      queue_render({ target } as unknown as ProgressEvent);
      expect(renderQueue[renderQueue.length - 1]).toBe(target);
      renderQueue.pop();
    });

    it("queue_state", () => {
      const old = stateQueue;
      stateQueue = false;
      queue_state();
      expect(stateQueue).toBe(true);
      stateQueue = old;
    });

    it("render reset", () => {
      const reset = fn();
      const el1 = { reset } as unknown as Element;
      const el2 = {} as Element;
      resetQueue.push(el1, el2);
      render();
      expect(reset).toHaveBeenCalledOnce();
      expect(resetQueue.length).toBe(0);
    });

    it("render once", () => {
      const removeAttribute = fn();
      const el1 = { removeAttribute } as unknown as Element;
      const el2 = { removeAttribute } as unknown as Element;
      onceQueue.push(el1, el2);
      render();
      expect(removeAttribute).toBeCalledTimes(2);
      expect(removeAttribute).toBeCalledWith("on");
      expect(onceQueue.length).toBe(0);
    });

    it("render render", () => {
      const container = document.createElement("div");
      const container2 = document.createElement("div");
      container.innerHTML = "<span></span>" + "<button></button>";
      const el1 = document.createElement("div");
      const el2 = document.createElement("div");
      const rl1 = document.createElement("div");
      const rl2 = document.createElement("div");
      const rl3 = document.createElement("div");
      const rl4 = document.createElement("div");
      const rl5 = document.createElement("div");
      const rl6 = document.createElement("div");
      const rl7 = document.createElement("div");
      container2.append(rl1, rl2, rl3, rl4, rl5, rl6, rl7);
      const responseXML = { body: container };
      const dispatchEvent = spyOn(
        Element.prototype,
        "dispatchEvent"
      ).mockImplementation(() => true);
      const xhr1 = {
        status: 400,
        ownerElement_: el1,
      } as unknown as XMLHttpRequest;
      const xhr2 = {
        responseXML,
        status: 200,
        ownerElement_: el2,
      } as unknown as XMLHttpRequest;
      renderQueue.push(xhr1, xhr2);
      el1.isLoading_ = true;
      el2.isLoading_ = true;
      el1.isError_ = false;
      el2.isError_ = false;
      el1.setAttribute("error", "error-action");
      el2.setAttribute("result", "error-action result-action");
      rl1.setAttribute("render", "error-action");
      rl2.setAttribute("render", "result-action");
      rl3.setAttribute("render", "result-action");
      rl4.setAttribute("render", "result-action");
      rl5.setAttribute("render", "result-action");
      rl6.setAttribute("render", "result-action");
      rl7.setAttribute("render", "result-action");
      rl1.setAttribute("position", "replaceChildren");
      rl3.setAttribute("position", "replaceWith");
      rl4.setAttribute("position", "prepend");
      rl5.setAttribute("position", "before");
      rl6.setAttribute("position", "append");
      rl7.setAttribute("position", "after");
      renderElements.add(rl1);
      renderElements.add(rl2);
      renderElements.add(rl3);
      renderElements.add(rl4);
      renderElements.add(rl5);
      renderElements.add(rl6);
      renderElements.add(rl7);
      render();
      renderElements.delete(rl1);
      renderElements.delete(rl2);
      renderElements.delete(rl3);
      renderElements.delete(rl4);
      renderElements.delete(rl5);
      renderElements.delete(rl6);
      renderElements.delete(rl7);
      expect(el1.isLoading_).toBe(false);
      expect(el2.isLoading_).toBe(false);
      expect(el1.isError_).toBe(true);
      expect(el2.isError_).toBe(false);
      expect(dispatchEvent).toHaveBeenCalledExactlyOnceWith(resultEvent);
      container.innerHTML =
        '<div position="replaceChildren" render="error-action"></div>' +
        '<div render="result-action">' +
        "<span></span>" +
        "<button></button>" +
        "</div>" +
        "<span></span>" +
        "<button></button>" +
        '<div position="prepend" render="result-action">' +
        "<span></span>" +
        "<button></button>" +
        "</div>" +
        "<span></span>" +
        "<button></button>" +
        '<div position="before" render="result-action"></div>' +
        '<div position="append" render="result-action">' +
        "<span></span>" +
        "<button></button>" +
        "</div>" +
        '<div position="after" render="result-action"></div>' +
        "<span></span>" +
        "<button></button>";
      expect(container2).toMatchHTML(container);
      restoreAllMocks();
    });

    it("render state", () => {
      const se1 = document.createElement("input");
      const se2 = document.createElement("input");
      const se3 = document.createElement("select");
      const se4 = document.createElement("textarea");
      const ce1 = document.createElement("div");
      const ce2 = document.createElement("div");
      se1.setAttribute("if:invalid", "invalid");
      se2.setAttribute("type", "checkbox");
      se1.setAttribute("required", "");
      se4.setAttribute("if:value", "value");
      se4.textContent = "value";
      se1.setAttribute("if:intersects", "intersects");
      se2.setAttribute("if:loading", "loading");
      se3.setAttribute("if:error", "error");
      ce1.setAttribute("if", "value");
      ce2.setAttribute("if", "something");
      ce2.setAttribute("state", "");
      stateQueue = true;
      se2.isLoading_ = true;
      se3.isError_ = true;
      stateElements.add(se1);
      stateElements.add(se2);
      stateElements.add(se3);
      stateElements.add(se4);
      conditionElements.add(ce1);
      conditionElements.add(ce2);
      render();
      expect(ce1.hasAttribute("state")).toBe(true);
      expect(ce2.hasAttribute("state")).toBe(false);
      stateElements.delete(se1);
      stateElements.delete(se2);
      stateElements.delete(se3);
      stateElements.delete(se4);
      conditionElements.delete(ce1);
      conditionElements.delete(ce2);
    });
  });
}
