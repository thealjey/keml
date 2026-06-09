/**
 * Clears a previously scheduled timeout stored on the element and resets its
 * timeoutId.
 *
 * @param el - The element whose scheduled timeout should be cleared.
 */
export const unschedule = (el: Element) =>
  (el.timeoutId = clearTimeout(el.timeoutId) as undefined);
