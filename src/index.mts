import { on_load } from "./on_load.mts";

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
        "addEventListener"
      ).mockImplementation(() => {});
      Object.defineProperty(document, "readyState", {
        value: "loading",
        configurable: true,
      });

      main(cb);
      expect(addEventListener).toBeCalledWith("DOMContentLoaded", cb, true);
      expect(cb).not.toBeCalled();
    });

    it("anything else", () => {
      const cb = fn();
      const addEventListener = spyOn(
        document,
        "addEventListener"
      ).mockImplementation(() => {});
      Object.defineProperty(document, "readyState", {
        value: "something irrelevant lol",
        configurable: true,
      });

      main(cb);
      expect(addEventListener).not.toBeCalled();
      expect(cb).toBeCalled();
    });
  });
} else {
  main(on_load);
}
/* v8 ignore stop */
