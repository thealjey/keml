import { executeRequest } from "./executeRequest.mts";

/**
 * Schedules or immediately executes a request triggered by a DOM element.
 *
 * Supports optional throttling and debouncing behavior based on element
 * attributes.
 * If neither is present, the request is executed immediately.
 *
 * @param el - The DOM element that triggered the request scheduling.
 */
export const scheduleRequest = (el: Element) => {
  let attr;

  if ((attr = el.getAttributeNode("throttle"))) {
    el.timeoutId ??= setTimeout(executeRequest, +attr.value, el);
  } else if ((attr = el.getAttributeNode("debounce"))) {
    clearTimeout(el.timeoutId);
    el.timeoutId = setTimeout(executeRequest, +attr.value, el);
  } else {
    executeRequest(el);
  }
};
