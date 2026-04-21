import { on_load } from "./on_load.mts";

/**
 * Executes a callback immediately if the document is already loaded,
 * otherwise defers execution until DOMContentLoaded.
 *
 * @param cb - Function to execute when the DOM is ready
 */
const main = (cb: () => void) => {
  if (document.readyState.charCodeAt(0) === 108) {
    document.addEventListener("DOMContentLoaded", cb, true);
  } else {
    cb();
  }
};

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    it,
    afterEach,
    expect,
    vi: { fn, spyOn, restoreAllMocks },
  } = import.meta.vitest;

  describe("index", () => {
    afterEach(restoreAllMocks);

    it("loading", () => {
      const cb = fn();
      const addEventListener = spyOn(
        document,
        "addEventListener",
      ).mockImplementation(() => {});
      Object.defineProperty(document, "readyState", {
        value: "loading",
        configurable: true,
      });

      main(cb);
      expect(addEventListener).toHaveBeenCalledWith(
        "DOMContentLoaded",
        cb,
        true,
      );
      expect(cb).not.toHaveBeenCalled();
    });

    it("anything else", () => {
      const cb = fn();
      const addEventListener = spyOn(
        document,
        "addEventListener",
      ).mockImplementation(() => {});
      Object.defineProperty(document, "readyState", {
        value: "something irrelevant lol",
        configurable: true,
      });

      main(cb);
      expect(addEventListener).not.toHaveBeenCalled();
      expect(cb).toHaveBeenCalled();
    });
  });
} else {
  main(on_load);
}
/* v8 ignore stop */
