import { navigateElements } from "./store.mts";

const navigateEvent = new Event("navigate");

/**
 * Dispatches a navigation event to all registered navigation elements.
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
      expect(dispatchEvent).toHaveBeenCalledTimes(2);
      expect(dispatchEvent).toHaveBeenCalledWith(navigateEvent);
    });
  });
}
/* v8 ignore stop */
