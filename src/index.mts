import { on_load } from "./on_load.mts";

document.addEventListener("DOMContentLoaded", on_load, true);

/* c8 ignore next */
if (import.meta.vitest) {
  const { describe, it } = import.meta.vitest;

  describe("index", () => {
    it("shut up with the no test suite error already", () => {
      // not much to do here at all ;)
    });
  });
}
