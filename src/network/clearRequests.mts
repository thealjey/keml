/**
 * Aborts all pending XHR requests associated with an element
 * and clears the element's XHR request list.
 *
 * Any `onloadend`, `onerror`, and `ontimeout` handlers are removed
 * before the requests are aborted.
 *
 * @param el - The element whose associated XHR requests should be cleared.
 */
export const clearRequests = (el: Element) => {
  for (const x of (el.xhr as XMLHttpRequest[] | undefined) ?? []) {
    x.onloadend = x.onerror = x.ontimeout = null;
    x.abort();
  }
  el.xhr = undefined;
};
