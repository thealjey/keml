import { commit } from "./commit.mts";
import { has_token } from "./has_token.mts";
import {
  actionElements,
  resetElements,
  resetQueue,
  scrollElements,
  scrollQueue,
} from "./store.mts";

/**
 * Global event handler that resolves and dispatches declarative element actions
 * based on event delegation, attribute-defined triggers, and action filters.
 *
 * Supports:
 * - delegated "on:*" attribute handlers
 * - optional event filtering via "event:*" constraints
 * - conditional action execution based on token-matched "on" attributes
 * - throttled and debounced commit scheduling
 * - reset and scroll queue scheduling
 *
 * @param event - DOM event triggered by user interaction
 */
export const on_event: EventListener = event => {
  const target = event.target;

  if (target instanceof Element) {
    let name: string | undefined = event.type;
    let el: Element | null = target;
    let attr;
    const attrName = `on:${name}`;

    while (el && !(attr = el.getAttributeNode(attrName))) {
      el = el.parentElement;
    }

    if (el && attr) {
      const actions = attr.value.trim();

      if (actions) {
        if ((attr = el.getAttributeNode(`event:${name}`))) {
          if (el.hasAttribute("log")) {
            console.log(event);
          }
          for (
            let i = 0,
              pair,
              pos,
              pairs = attr.value.split(","),
              len = pairs.length;
            i < len;
            ++i
          ) {
            pair = pairs[i]!;
            pos = pair.indexOf("=");
            if (pos === -1) {
              name = pair.trim();
              if (name && !event[name as keyof Event]) {
                return;
              }
            } else {
              name = pair.slice(0, pos).trim();
              if (
                name &&
                event[name as keyof Event] + "" !== pair.slice(pos + 1).trim()
              ) {
                return;
              }
            }
          }
        }

        event.preventDefault();

        for (el of actionElements) {
          if (has_token(actions, el.getAttribute("on"))) {
            if ((attr = el.getAttributeNode("throttle"))) {
              el.timeoutId_ ??= setTimeout(commit, +attr.value, el);
            } else if ((attr = el.getAttributeNode("debounce"))) {
              clearTimeout(el.timeoutId_);
              el.timeoutId_ = setTimeout(commit, +attr.value, el);
            } else {
              commit(el);
            }
          }
        }

        for (el of resetElements) {
          if (has_token(actions, el.getAttribute("reset"))) {
            resetQueue.push(el);
          }
        }

        for (el of scrollElements) {
          if (has_token(actions, el.getAttribute("scroll"))) {
            scrollQueue.push(el);
          }
        }
      }
    }
  }
};

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    it,
    vi: { fn, spyOn, restoreAllMocks },
    expect,
  } = import.meta.vitest;

  describe("on_event", () => {
    it("require alt", () => {
      const preventDefault = fn();
      const target = document.createElement("div");
      const div = document.createElement("div");
      div.setAttribute("on:click", "handleClick");
      div.setAttribute("event:click", "charCode = 1, altKey");
      div.append(target);
      on_event({
        target,
        type: "click",
        preventDefault,
        altKey: false,
        charCode: 1,
      } as unknown as Event);
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it("stop on charCode mismatch", () => {
      spyOn(console, "log").mockImplementation(() => {});
      const preventDefault = fn();
      const target = document.createElement("div");
      const div = document.createElement("div");
      const event = {
        target,
        type: "click",
        preventDefault,
        altKey: false,
        charCode: 1,
      } as unknown as Event;
      div.setAttribute("on:click", "handleClick");
      div.setAttribute("event:click", "charCode = 2, altKey");
      div.setAttribute("log", "");
      div.append(target);
      on_event(event);
      expect(preventDefault).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(event);
      restoreAllMocks();
    });

    it("other", () => {
      spyOn(XMLHttpRequest.prototype, "setRequestHeader").mockImplementation(
        () => {},
      );
      spyOn(XMLHttpRequest.prototype, "open").mockImplementation(() => {});
      spyOn(XMLHttpRequest.prototype, "send").mockImplementation(() => {});
      const preventDefault = fn();
      const push = spyOn(resetQueue, "push").mockImplementation(() => 0);
      const target = document.createElement("div");
      const i1 = document.createElement("input");
      const i2 = document.createElement("input");
      const i3 = document.createElement("input");
      const i4 = document.createElement("input");
      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      i1.setAttribute("required", "");
      i2.setAttribute("required", "");
      i3.setAttribute("required", "");
      i1.setAttribute("on", "handleClick");
      i2.setAttribute("on", "handleClick");
      i3.setAttribute("on", "handleClick");
      i1.setAttribute("throttle", "1000");
      i2.setAttribute("debounce", "2000");
      div1.setAttribute("reset", "resetAction");
      div1.setAttribute("scroll", "scrollAction");
      target.setAttribute("on:click", "handleClick resetAction scrollAction");
      target.setAttribute("event:click", "charCode = 1, altKey");
      actionElements.add(i1);
      actionElements.add(i2);
      actionElements.add(i3);
      actionElements.add(i4);
      resetElements.add(div1);
      resetElements.add(div2);
      scrollElements.add(div1);
      scrollElements.add(div2);
      on_event({
        target,
        type: "click",
        preventDefault,
        altKey: true,
        charCode: 1,
      } as unknown as Event);
      actionElements.delete(i1);
      actionElements.delete(i2);
      actionElements.delete(i3);
      actionElements.delete(i4);
      resetElements.delete(div1);
      resetElements.delete(div2);
      scrollElements.delete(div1);
      scrollElements.delete(div2);
      expect(preventDefault).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith(div1);
      restoreAllMocks();
    });

    it("does nothing when target is not an Element (null)", () => {
      const preventDefault = fn();

      on_event({
        target: null,
        type: "click",
        preventDefault,
      } as unknown as Event);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it("does nothing if no on:<event.type> attribute is found", () => {
      const preventDefault = fn();

      const target = document.createElement("div");
      const parent = document.createElement("div");
      parent.appendChild(target);

      // Neither target nor parent has on:click
      on_event({
        target,
        type: "click",
        preventDefault,
      } as unknown as Event);

      // nothing should happen
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it("does nothing when no tokens", () => {
      const preventDefault = fn();

      const target = document.createElement("div");
      target.setAttribute("on:click", ""); // empty → actions.length === 0

      on_event({
        target,
        type: "click",
        preventDefault,
      } as unknown as Event);

      // nothing should happen
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it("skips event property checks if event:<event.type> attribute is missing", () => {
      spyOn(XMLHttpRequest.prototype, "setRequestHeader").mockImplementation(
        () => {},
      );
      spyOn(XMLHttpRequest.prototype, "open").mockImplementation(() => {});
      spyOn(XMLHttpRequest.prototype, "send").mockImplementation(() => {});
      const preventDefault = fn();

      const target = document.createElement("div");
      target.setAttribute("on:click", "handleClick"); // present
      // no event:click attribute → triggers else branch

      // add a dummy action element to avoid errors in the actionElements loop
      const actionEl = document.createElement("div");
      actionEl.setAttribute("on", "handleClick");
      actionElements.add(actionEl);

      on_event({
        target,
        type: "click",
        preventDefault,
      } as unknown as Event);

      expect(preventDefault).toHaveBeenCalled();

      actionElements.delete(actionEl);
      restoreAllMocks();
    });
  });
}
/* v8 ignore stop */
