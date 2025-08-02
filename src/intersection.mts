import { queue_state } from "./render.mts";

const revealEvent = new Event("reveal");
const concealEvent = new Event("conceal");

/**
 * Callback function for `IntersectionObserver` used to detect when elements
 * become visible.
 *
 * For each entry that is currently intersecting (i.e. visible in the viewport),
 * this function dispatches a `revealEvent` on the corresponding target element.
 *
 * This is tied to elements that use the `on:reveal` attribute and are observed
 * via `revealObserver`.
 *
 * @param entries - A list of `IntersectionObserverEntry` objects describing
 *                  visibility changes.
 *
 * @example
 * // When an observed element becomes visible, it will trigger:
 * entry.target.dispatchEvent(revealEvent);
 */
const on_reveal = (entries: IntersectionObserverEntry[]) => {
  const len = entries.length;

  for (let i = 0, entry; i < len; ++i) {
    entry = entries[i]!;
    if (entry.isIntersecting) {
      entry.target.dispatchEvent(revealEvent);
    }
  }
};

/**
 * Callback function for `IntersectionObserver` used to detect when elements
 * become hidden.
 *
 * For each entry that is no longer intersecting (i.e. has exited the viewport),
 * this function dispatches a `concealEvent` on the corresponding target
 * element.
 *
 * This behavior is associated with elements using the `on:conceal` attribute,
 * and is triggered via `concealObserver`.
 *
 * @param entries - A list of `IntersectionObserverEntry` objects describing
 *                  visibility changes.
 *
 * @example
 * // When an observed element leaves the viewport, it will trigger:
 * entry.target.dispatchEvent(concealEvent);
 */
const on_conceal = (entries: IntersectionObserverEntry[]) => {
  const len = entries.length;

  for (let i = 0, entry; i < len; ++i) {
    entry = entries[i]!;
    if (!entry.isIntersecting) {
      entry.target.dispatchEvent(concealEvent);
    }
  }
};

export const revealObserver = new IntersectionObserver(on_reveal);
export const concealObserver = new IntersectionObserver(on_conceal);
export const intersectsObserver = new IntersectionObserver(queue_state);

/* c8 ignore next */
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
      expect(dispatchEvent).toHaveBeenCalledExactlyOnceWith(revealEvent);
    });

    it("conceal", () => {
      const dispatchEvent = fn();

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
      expect(dispatchEvent).toHaveBeenCalledExactlyOnceWith(concealEvent);
    });
  });
}
