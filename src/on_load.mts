import { on_mutate } from "./on_mutate.mts";
import { on_navigate } from "./on_navigate.mts";
import { queue_state, render } from "./render.mts";
import { traverse } from "./traverse.mts";

/**
 * Initialization function executed once when the page loads.
 *
 * Responsibilities:
 * - Sets a cookie with the user's timezone offset (used for server-side logic).
 * - Traverses the entire initial DOM to apply any attribute-based logic.
 * - Creates a MutationObserver to monitor and respond to DOM changes
 *   dynamically.
 * - Attaches event listeners to queue state updates on form-related events
 *   (`change`, `input`, `reset`).
 * - Attaches a listener for `popstate` events to handle browser navigation.
 * - Starts the main render loop using `requestAnimationFrame`.
 *
 * This function is designed to be called only once per page load.
 * Subsequent DOM changes are handled reactively via MutationObserver and event
 * listeners.
 */
export const on_load = () => {
  try {
    document.cookie = `tzo=${new Date().getTimezoneOffset()};Path=\/;SameSite=lax;Max-Age=31536000`;
  } catch {}
  traverse(document.childNodes, true);
  new MutationObserver(on_mutate).observe(document, {
    attributeOldValue: true,
    attributes: true,
    childList: true,
    subtree: true,
  });
  document.addEventListener("change", queue_state, true);
  document.addEventListener("input", queue_state, true);
  document.addEventListener("reset", queue_state, true);
  window.addEventListener("popstate", on_navigate, true);
  requestAnimationFrame(render);
};

/* c8 ignore next */
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("on_load", () => {
    it("set the timezone offset cookie", () => {
      Object.defineProperty(document, "cookie", {
        set() {
          throw new Error("Simulated cookie exception");
        },
        configurable: true,
      });
      expect(on_load).not.toThrow();
      Object.defineProperty(document, "cookie", {
        value: "",
        writable: true,
        configurable: true,
      });
      on_load();
      expect(document.cookie).toMatch(/tzo=-?\d+/);
    });
  });
}
