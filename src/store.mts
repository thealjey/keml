export const actionElements = new Set<Element>();
export const stateElements = new Set<Element>();
export const resetElements = new Set<Element>();
export const navigateElements = new Set<Element>();
export const renderElements = new Set<Element>();
export const conditionElements = new Set<Element>();
export const sseElements = new Set<Element>();
export const scrollElements = new Set<Element>();
export const resetQueue: Element[] = [];
export const onceQueue: Element[] = [];
export const scrollQueue: Element[] = [];

/* v8 ignore start */
if (import.meta.vitest) {
  const { describe, it } = import.meta.vitest;

  describe("store", () => {
    it("noop", () => {
      // nothing to check here
    });
  });
}
/* v8 ignore stop */
