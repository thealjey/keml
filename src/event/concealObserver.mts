const concealEvent = new Event("conceal");

/**
 * IntersectionObserver callback that triggers conceal events.
 *
 * Iterates over intersection entries and dispatches a conceal event
 * for each target that is no longer intersecting the viewport.
 *
 * @param entries - Array of IntersectionObserver entries describing visibility
 *                  changes.
 */
export const onConceal = (entries: IntersectionObserverEntry[]) => {
  for (const { isIntersecting, target } of entries) {
    isIntersecting || target.dispatchEvent(concealEvent);
  }
};

export const concealObserver = new IntersectionObserver(onConceal);
