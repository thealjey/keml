import { on_mutate } from "./on_mutate.mts";
import { on_navigate } from "./on_navigate.mts";
import { queue_state, render } from "./render.mts";
import { sse_stop } from "./sse.mts";
import { traverse } from "./traverse.mts";

/**
 * Global constructor for the current page context.
 *
 * Sets up reactive behavior, event handling, and state tracking needed for the
 * application to function while the page is active.
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
  window.addEventListener("beforeunload", sse_stop, true);
  requestAnimationFrame(render);
};

/* v8 ignore start */
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
/* v8 ignore stop */
