/**
 * Determines whether an element has any associated XHR requests that are
 * still in progress.
 *
 * @param el - The element whose associated XHR requests should be checked.
 * @returns `true` if at least one request has not completed; otherwise `false`.
 */
export const isElementLoading = (el: Element) => {
  if (el.xhr) {
    for (const { readyState } of el.xhr) {
      if (readyState !== 4) {
        return true;
      }
    }
  }
  return false;
};
