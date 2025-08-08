import {
  concealObserver,
  intersectsObserver,
  revealObserver,
} from "./intersection.mts";
import { on_event } from "./on_event.mts";
import { queue_focus } from "./render.mts";
import {
  actionElements,
  conditionElements,
  navigateElements,
  renderElements,
  resetElements,
  stateElements,
} from "./store.mts";

/**
 * Interface for visiting DOM elements' attributes during traversal.
 * The design deliberately avoids passing attribute values.
 */
interface Visitor {
  /**
   * Called each time a new attribute is discovered on an element, either when a
   * new element is encountered or an attribute is added to an existing element.
   *
   * @param el - The DOM element on which the attribute was added.
   * @param name - The name of the attribute that was added.
   */
  added_(el: Element, name: string): void;

  /**
   * Called each time an attribute is removed from an element.
   *
   * @param el - The DOM element from which the attribute was removed.
   * @param name - The name of the attribute that was removed.
   */
  removed_(el: Element, name: string): void;
}

interface AttrMap {
  on_colon_: Visitor;
  if_colon_: Visitor;
  [K: string]: Visitor;
}

const events: string[] = [];

/**
 * Attribute visitor map implementation.
 *
 * Controls element registration, observation, and event listening for various
 * attributes:
 * - `on_colon_`: Manages elements with `on:*` attributes, attaching observers
 *   or adding elements to `navigateElements`. Also dynamically registers event
 *   listeners on the document.
 * - `if_colon_`: Manages elements with `if:*` attributes, adding/removing them
 *   from `stateElements` and observing intersections for `"if:intersects"`.
 * - `on`, `if`, `reset`, `render`: Manage sets of elements linked to those
 *   attributes.
 * - `autofocus`: defers focus to the element until the next render cycle by
 *   calling `queue_focus`. The element will be focused after all DOM mutations
 *   and state updates are applied, ensuring proper timing and cursor placement.
 */
const attr: AttrMap = {
  on_colon_: {
    added_(el, name) {
      if (name === "on:navigate") {
        navigateElements.add(el);
      } else if (name === "on:reveal") {
        revealObserver.observe(el);
      } else if (name === "on:conceal") {
        concealObserver.observe(el);
      }
      if (!events.includes(name)) {
        events.push(name);
        document.addEventListener(name.slice(3), on_event, true);
      }
    },

    removed_(el, name) {
      if (name === "on:navigate") {
        navigateElements.delete(el);
      } else if (name === "on:reveal") {
        revealObserver.unobserve(el);
      } else if (name === "on:conceal") {
        concealObserver.unobserve(el);
      }
    },
  },

  if_colon_: {
    added_(el, name) {
      stateElements.add(el);
      if (name === "if:intersects") {
        intersectsObserver.observe(el);
      }
    },

    removed_(el, name) {
      stateElements.delete(el);
      if (name === "if:intersects") {
        intersectsObserver.unobserve(el);
      }
    },
  },

  on: {
    added_(el) {
      actionElements.add(el);
    },

    removed_(el) {
      actionElements.delete(el);
    },
  },

  if: {
    added_(el) {
      conditionElements.add(el);
    },

    removed_(el) {
      conditionElements.delete(el);
    },
  },

  reset: {
    added_(el) {
      resetElements.add(el);
    },

    removed_(el) {
      resetElements.delete(el);
    },
  },

  render: {
    added_(el) {
      renderElements.add(el);
    },

    removed_(el) {
      renderElements.delete(el);
    },
  },

  autofocus: {
    added_: queue_focus,

    removed_() {},
  },
};

/**
 * Removes an element from all internal tracking structures and observers.
 *
 * This is called when an element is removed from the document, ensuring that:
 * - The element is no longer considered for actions, conditions, rendering, or
 *   state.
 * - It is removed from all relevant sets like `actionElements`,
 *   `stateElements`, etc.
 * - It is unobserved from all active `IntersectionObserver` instances.
 *
 * This prevents stale references and ensures no further processing or
 * observation occurs for detached DOM nodes.
 *
 * @param el - The element to clean up.
 *
 * @remarks
 * - No attribute visitors are triggered after an element is removed from the
 *   document, so this function must explicitly perform the cleanup.
 * - Safe to call multiple times on the same element; redundant removals are
 *   harmless.
 */
export const clean = (el: Element) => {
  actionElements.delete(el);
  conditionElements.delete(el);
  navigateElements.delete(el);
  renderElements.delete(el);
  resetElements.delete(el);
  stateElements.delete(el);
  concealObserver.unobserve(el);
  intersectsObserver.unobserve(el);
  revealObserver.unobserve(el);
};

/**
 * Returns a `Visitor` object corresponding to the given attribute name.
 *
 * The function selects a visitor based on the prefix of the attribute name:
 * - If the name starts with `"on:"`, returns the `on_colon_` visitor.
 * - If the name starts with `"if:"`, returns the `if_colon_` visitor.
 * - Otherwise, returns the visitor associated directly with the attribute name.
 *
 * @param name - The name of the attribute for which to get the visitor.
 * @returns The corresponding `Visitor` object if found; otherwise, `undefined`.
 */
export const visitor = (name: string) =>
  name.startsWith("on:")
    ? attr.on_colon_
    : name.startsWith("if:")
    ? attr.if_colon_
    : attr[name];

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    it,
    expect,
    afterEach,
    vi: { spyOn, restoreAllMocks },
  } = import.meta.vitest;

  describe("element", () => {
    afterEach(restoreAllMocks);

    it("clean", () => {
      const unobserve1 = spyOn(concealObserver, "unobserve").mockImplementation(
        () => {}
      );
      const unobserve2 = spyOn(
        intersectsObserver,
        "unobserve"
      ).mockImplementation(() => {});
      const unobserve3 = spyOn(revealObserver, "unobserve").mockImplementation(
        () => {}
      );
      const el = document.createElement("div");
      actionElements.add(el);
      conditionElements.add(el);
      navigateElements.add(el);
      renderElements.add(el);
      resetElements.add(el);
      stateElements.add(el);
      clean(el);
      expect(actionElements.has(el)).toBe(false);
      expect(conditionElements.has(el)).toBe(false);
      expect(navigateElements.has(el)).toBe(false);
      expect(renderElements.has(el)).toBe(false);
      expect(resetElements.has(el)).toBe(false);
      expect(stateElements.has(el)).toBe(false);
      expect(unobserve1).toBeCalledWith(el);
      expect(unobserve2).toBeCalledWith(el);
      expect(unobserve3).toBeCalledWith(el);
    });

    it("visitor", () => {
      const observeConceal = spyOn(
        concealObserver,
        "observe"
      ).mockImplementation(() => {});
      const observeIntersects = spyOn(
        intersectsObserver,
        "observe"
      ).mockImplementation(() => {});
      const observeReveal = spyOn(revealObserver, "observe").mockImplementation(
        () => {}
      );
      const unobserveConceal = spyOn(
        concealObserver,
        "unobserve"
      ).mockImplementation(() => {});
      const unobserveIntersects = spyOn(
        intersectsObserver,
        "unobserve"
      ).mockImplementation(() => {});
      const unobserveReveal = spyOn(
        revealObserver,
        "unobserve"
      ).mockImplementation(() => {});
      const addEventListener = spyOn(
        document,
        "addEventListener"
      ).mockImplementation(() => {});
      const focus = spyOn(
        HTMLInputElement.prototype,
        "focus"
      ).mockImplementation(() => {});
      const setSelectionRange = spyOn(
        HTMLInputElement.prototype,
        "setSelectionRange"
      ).mockImplementation(() => {});
      const el = document.createElement("input");
      el.value = "foo";

      let vis = visitor("on: navigate");
      expect(navigateElements.has(el)).toBe(false);
      expect(events.includes("on:navigate")).toBe(false);
      vis?.added_(el, "on:navigate");
      expect(navigateElements.has(el)).toBe(true);
      expect(events.pop()).toBe("on:navigate");
      expect(addEventListener).toBeCalledWith("navigate", on_event, true);
      vis?.removed_(el, "on:navigate");
      expect(navigateElements.has(el)).toBe(false);

      vis = visitor("on:reveal");
      expect(observeReveal).not.toBeCalled();
      vis?.added_(el, "on:reveal");
      expect(observeReveal).toBeCalledWith(el);
      expect(events.pop()).toBe("on:reveal");
      expect(unobserveReveal).not.toBeCalled();
      vis?.removed_(el, "on:reveal");
      expect(unobserveReveal).toBeCalledWith(el);

      vis = visitor("on:conceal");
      expect(observeConceal).not.toBeCalled();
      vis?.added_(el, "on:conceal");
      expect(observeConceal).toBeCalledWith(el);
      expect(events.pop()).toBe("on:conceal");
      expect(unobserveConceal).not.toBeCalled();
      vis?.removed_(el, "on:conceal");
      expect(unobserveConceal).toBeCalledWith(el);

      vis = visitor("if:intersects");
      expect(stateElements.has(el)).toBe(false);
      expect(observeIntersects).not.toBeCalled();
      vis?.added_(el, "if:intersects");
      expect(stateElements.has(el)).toBe(true);
      expect(observeIntersects).toBeCalledWith(el);
      expect(unobserveIntersects).not.toBeCalled();
      vis?.removed_(el, "if:intersects");
      expect(stateElements.has(el)).toBe(false);
      expect(unobserveIntersects).toBeCalledWith(el);

      vis = visitor("on");
      expect(actionElements.has(el)).toBe(false);
      vis?.added_(el, "on");
      expect(actionElements.has(el)).toBe(true);
      vis?.removed_(el, "on");
      expect(actionElements.has(el)).toBe(false);

      vis = visitor("if");
      expect(conditionElements.has(el)).toBe(false);
      vis?.added_(el, "if");
      expect(conditionElements.has(el)).toBe(true);
      vis?.removed_(el, "if");
      expect(conditionElements.has(el)).toBe(false);

      vis = visitor("reset");
      expect(resetElements.has(el)).toBe(false);
      vis?.added_(el, "reset");
      expect(resetElements.has(el)).toBe(true);
      vis?.removed_(el, "reset");
      expect(resetElements.has(el)).toBe(false);

      vis = visitor("render");
      expect(renderElements.has(el)).toBe(false);
      vis?.added_(el, "render");
      expect(renderElements.has(el)).toBe(true);
      vis?.removed_(el, "render");
      expect(renderElements.has(el)).toBe(false);

      vis = visitor("autofocus");
      expect(focus).not.toBeCalled();
      expect(setSelectionRange).not.toBeCalled();
      vis?.removed_(el, "autofocus");
      expect(focus).not.toBeCalled();
      expect(setSelectionRange).not.toBeCalled();
    });
  });
}
/* v8 ignore stop */
