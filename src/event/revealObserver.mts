const revealEvent = new Event("reveal");

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

export const revealObserver = new IntersectionObserver(onReveal);
