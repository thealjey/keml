import { sourcesWithCredentials, sourcesWithoutCredentials } from "./store.mts";

/**
 * Global destructor for the current page context.
 *
 * This function is executed when the page is unloaded or reloaded, marking the
 * end of the page's lifecycle. It performs final cleanup of page-level
 * resources and ensures that no page-bound processes or connections remain
 * active.
 *
 * ⚠️ Destructive: once this function runs, the page context is considered
 * terminated, and no further operations should be performed.
 *
 * Usage:
 * ```ts
 * window.addEventListener("beforeunload", on_unload, true);
 * ```
 *
 * Complements `on_load`, which acts as the page's initializer.
 */
export const on_unload = () => {
  let item;
  for (item of sourcesWithCredentials.values()) {
    item.source_.close();
  }
  for (item of sourcesWithoutCredentials.values()) {
    item.source_.close();
  }
};

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    it,
    describe,
    expect,
    vi: { fn },
    afterEach,
  } = import.meta.vitest;

  describe("on_unload (in-source)", () => {
    afterEach(() => {
      sourcesWithCredentials.clear();
      sourcesWithoutCredentials.clear();
    });

    it("closes all sources in both maps", () => {
      const closeA = fn();
      const closeB = fn();
      const closeC = fn();
      const closeD = fn();

      // @ts-ignore
      sourcesWithCredentials.set("a", { source_: { close: closeA } });
      // @ts-ignore
      sourcesWithCredentials.set("b", { source_: { close: closeB } });
      // @ts-ignore
      sourcesWithoutCredentials.set("c", { source_: { close: closeC } });
      // @ts-ignore
      sourcesWithoutCredentials.set("d", { source_: { close: closeD } });

      on_unload();

      expect(closeA).toHaveBeenCalledTimes(1);
      expect(closeB).toHaveBeenCalledTimes(1);
      expect(closeC).toHaveBeenCalledTimes(1);
      expect(closeD).toHaveBeenCalledTimes(1);
    });

    it("handles empty maps without throwing", () => {
      expect(() => on_unload()).not.toThrow();
    });
  });
}
/* v8 ignore stop */
