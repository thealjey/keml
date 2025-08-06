import { navigateElements } from "./store.mts";

const navigateEvent = new Event("navigate");

/**
 * Dispatches a navigation event to all registered navigation elements.
 *
 * This function iterates through the global `navigateElements` collection and
 * dispatches the shared `navigateEvent` to each element. It is used to notify
 * relevant parts of the UI that a navigation action has occurred.
 *
 * If `navigateElements` is empty, the function completes without any effect.
 * If any element has removed event listeners or is no longer in the DOM, the
 * event is still dispatched but may not produce any visible outcome.
 *
 * Performance: Executes in linear time relative to the number of elements in
 * `navigateElements`.
 *
 * @example
 * // Assume navigateElements = [div1, div2]
 * // and navigateEvent = new CustomEvent('navigate')
 * on_navigate();
 * // Both div1 and div2 receive the 'navigate' event
 */
export const on_navigate = () => {
  for (const el of navigateElements) {
    el.dispatchEvent(navigateEvent);
  }
};

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    expect,
    it,
    vi: { fn },
  } = import.meta.vitest;

  describe("on_navigate", () => {
    it("dispatches two navigate events", () => {
      const dispatchEvent = fn();
      const el1 = { dispatchEvent } as unknown as Element;
      const el2 = { dispatchEvent } as unknown as Element;
      navigateElements.add(el1);
      navigateElements.add(el2);
      on_navigate();
      navigateElements.delete(el1);
      navigateElements.delete(el2);
      expect(dispatchEvent).toBeCalledTimes(2);
      expect(dispatchEvent).toBeCalledWith(navigateEvent);
    });
  });
}
/* v8 ignore stop */
