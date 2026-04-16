import { queue_state } from "./render.mts";

/**
 * Creates an IntersectionObserver entry handler that dispatches a custom event
 * when elements match a specific intersection state.
 *
 * The returned function is intended to be used as an IntersectionObserver
 * callback.
 * It filters entries by `isIntersecting` and dispatches either a "reveal" or
 * "conceal" event on matching targets.
 *
 * @param isIntersecting
 * Controls which intersection state to react to:
 * - `true` → dispatch "reveal" events when elements become visible
 * - `false` → dispatch "conceal" events when elements leave visibility
 *
 * @returns
 * A function compatible with `IntersectionObserver`.
 */
const dispatch = (isIntersecting: boolean, event?: Event) => (
  (event = new Event(isIntersecting ? "reveal" : "conceal")),
  (entries: IntersectionObserverEntry[]) => {
    for (let i = 0, len = entries.length, entry; i < len; ++i) {
      entry = entries[i]!;
      if (entry.isIntersecting === isIntersecting) {
        entry.target.dispatchEvent(event);
      }
    }
  }
);

export const revealObserver = new IntersectionObserver(dispatch(true));
export const concealObserver = new IntersectionObserver(dispatch(false));
export const intersectsObserver = new IntersectionObserver(queue_state);

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    expect,
    it,
    vi: { fn },
  } = import.meta.vitest;

  describe("intersection", () => {
    it("reveal", () => {
      const dispatchEvent = fn();
      const on_reveal = dispatch(true);

      on_reveal([
        {
          isIntersecting: false,
          target: { dispatchEvent } as unknown as Element,
        } as IntersectionObserverEntry,
        {
          isIntersecting: true,
          target: { dispatchEvent } as unknown as Element,
        } as IntersectionObserverEntry,
      ]);
      expect(dispatchEvent).toHaveBeenCalledTimes(1);
      expect(dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: "reveal" }),
      );
    });

    it("conceal", () => {
      const dispatchEvent = fn();
      const on_conceal = dispatch(false);

      on_conceal([
        {
          isIntersecting: false,
          target: { dispatchEvent } as unknown as Element,
        } as IntersectionObserverEntry,
        {
          isIntersecting: true,
          target: { dispatchEvent } as unknown as Element,
        } as IntersectionObserverEntry,
      ]);
      expect(dispatchEvent).toHaveBeenCalledTimes(1);
      expect(dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: "conceal" }),
      );
    });
  });
}
/* v8 ignore stop */
