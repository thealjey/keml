const revealEvent = new Event("reveal");
const concealEvent = new Event("conceal");

/**
 * IntersectionObserver callback that triggers reveal events.
 *
 * Iterates over intersection entries and dispatches a reveal event
 * for each target that becomes visible within the viewport.
 *
 * @param entries - Array of IntersectionObserver entries describing visibility
 *                  changes.
 */
export const onReveal = (entries: IntersectionObserverEntry[]) => {
  for (const { isIntersecting, target } of entries) {
    isIntersecting && target.dispatchEvent(revealEvent);
  }
};

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

export const revealObserver = new IntersectionObserver(onReveal);
export const concealObserver = new IntersectionObserver(onConceal);
