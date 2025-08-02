import { commit } from "./commit.mts";
import { parse_actions } from "./parse_actions.mts";
import { actionElements, resetElements, resetQueue } from "./store.mts";

/**
 * Generic event listener that processes declarative event actions on elements.
 *
 * This listener:
 * - Starts from the event target and walks up ancestors to find an attribute
 *   named `on:<event.type>`. For example, for a "click" event, looks for
 *   `on:click`.
 * - Parses the attribute value into an array of action tokens via
 *   `parse_actions`.
 * - Optionally filters the event using an `event:<event.type>` attribute
 *   containing comma-separated key=value pairs, allowing conditional event
 *   handling based on event properties.
 * - Calls `preventDefault()` on the event if actions are triggered.
 * - Iterates through `actionElements` collection, committing those whose `"on"`
 *   attribute matches any parsed action, with optional throttling or debouncing
 *   via attributes.
 * - Iterates through `resetElements` collection, pushing matching elements
 *   to `resetQueue` if their `"reset"` attribute matches any action.
 *
 * @param event - The DOM event to handle.
 *
 * @remarks
 * - Uses element properties like `timeoutId_` for throttling and debouncing.
 * - Stops event processing if any event property check fails.
 * - Designed for declarative event-action binding via element attributes.
 *
 * @example
 * // HTML:
 * // <button
 * //   on:click="save edit"
 * //   event:click="button=0"
 * //   throttle="300"
 * //   on="save"
 * // >
 * //   Save
 * // </button>
 * //
 * // When a click event occurs on the button or its descendants:
 * // - Looks for on:click on the target or ancestors
 * // - Parses "save edit" actions
 * // - Checks if event.button === "0" (string comparison)
 * // - Calls event.preventDefault()
 * // - Finds actionElements with on="save" and commits them with a throttle
 * //   delay of 300ms
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
      const actions = parse_actions(attr.value);

      if (actions.length) {
        if ((attr = el.getAttributeNode(`event:${name}`))) {
          const pairs = attr.value.split(",");
          const len = pairs.length;

          for (let i = 0, pair; i < len; ++i) {
            pair = pairs[i]!.split("=");
            name = pair[0]?.trim();
            if (
              name &&
              event[name as keyof Event] + "" !== (pair[1]?.trim() ?? "true")
            ) {
              return;
            }
          }
        }

        event.preventDefault();

        for (el of actionElements) {
          if (actions.includes(el.getAttribute("on")!)) {
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
          if (actions.includes(el.getAttribute("reset")!)) {
            resetQueue.push(el);
          }
        }
      }
    }
  }
};

/* c8 ignore next */
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
      expect(preventDefault).not.toBeCalled();
    });

    it("other", () => {
      const preventDefault = fn();
      const push = spyOn(resetQueue, "push").mockImplementation(() => 0);
      const target = document.createElement("div");
      const i1 = document.createElement("input");
      const i2 = document.createElement("input");
      const i3 = document.createElement("input");
      const div = document.createElement("div");
      i1.setAttribute("required", "");
      i2.setAttribute("required", "");
      i3.setAttribute("required", "");
      i1.setAttribute("on", "handleClick");
      i2.setAttribute("on", "handleClick");
      i3.setAttribute("on", "handleClick");
      i1.setAttribute("throttle", "1000");
      i2.setAttribute("debounce", "2000");
      div.setAttribute("reset", "resetAction");
      target.setAttribute("on:click", "handleClick resetAction");
      target.setAttribute("event:click", "charCode = 1, altKey");
      actionElements.add(i1);
      actionElements.add(i2);
      actionElements.add(i3);
      resetElements.add(div);
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
      resetElements.delete(div);
      expect(preventDefault).toBeCalled();
      expect(push).toHaveBeenCalledWith(div);
      restoreAllMocks();
    });
  });
}
