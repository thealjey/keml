import { dispatchNavigate } from "../event/dispatchNavigate.mts";
import {
  markStateDirty,
  pushOneTimeElement,
  pushRenderPayload,
  pushRenderPayloadEvent,
} from "../render/data.mts";
import { appendFormDataToUrl } from "./appendFormDataToUrl.mts";
import { bridge } from "./bridge.e.mts";
import { clearRequests } from "./clearRequests.mts";
import { handleError } from "./handleError.mts";
import { handleResponseQueue } from "./handleResponseQueue.mts";
import { handleTimeout } from "./handleTimeout.mts";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";
import { serializeForm } from "./serializeForm.mts";
import { StreamingXMLHttpRequest } from "./StreamingXMLHttpRequest.mts";
import { unschedule } from "./unschedule.mts";

const emptyObj: {} = Object.create(null);

/**
 * Executes a request action based on a DOM element's configuration.
 *
 * This function interprets an element as a request trigger, gathers any
 * associated data, resolves the request descriptor, and performs navigation,
 * history updates, or an XHR request depending on configuration attributes.
 *
 * The element is also responsible for controlling request lifecycle state,
 * including loading and error flags.
 *
 * @param el - The DOM element that initiated the request.
 */
export const executeRequest = (el: Element) => {
  unschedule(el);

  if (el.checkValidity?.() ?? true) {
    el.hasAttribute("once") && pushOneTimeElement(el);

    const redirect = el.getAttribute("redirect");
    const [url, method, withCredentials] = resolveRequestDescriptor(el);

    if (process.env["NODE_ENV"] === "docs") {
      bridge.location.ownerElement = el;
    }

    if (redirect === "pushState" || redirect === "replaceState") {
      appendFormDataToUrl(url, serializeForm(el));
      bridge.history[redirect](emptyObj, "", url);
      dispatchNavigate();
    } else if (redirect === "assign" || redirect === "replace") {
      appendFormDataToUrl(url, serializeForm(el));
      bridge.location[redirect](url);
    } else if (url.protocol === "about:" && url.pathname === "blank/") {
      pushRenderPayload({ ownerElement: el, status: 200, responseXML: null });
    } else {
      let xhr;
      if (el.hasAttribute("stream")) {
        xhr = new StreamingXMLHttpRequest();
        xhr.onloadend = pushRenderPayloadEvent;
        clearRequests(el);
      } else {
        const mode = el.getAttribute("request-mode") as
          | "parallel" // default, process each response as soon as it is ready
          | "replace" // cancel/discard all existing requests before proceeding
          | "queue" // process responses in the order the requests were sent
          | "ignore" // do nothing if another request is currently active
          | null;

        if (el.xhr && mode === "ignore") {
          return;
        }

        xhr = new bridge.XMLHttpRequest();
        xhr.onloadend =
          mode === "queue" ? handleResponseQueue : pushRenderPayloadEvent;
        xhr.ontimeout = handleTimeout;
        xhr.timeout = Number(el.getAttribute("timeout"));

        mode === "replace" && clearRequests(el);
        if (el.xhr) {
          el.xhr.unshift(xhr);
        } else {
          el.xhr = [xhr];
        }
      }

      let formData: FormData | undefined = serializeForm(el);
      method === "GET" && (formData = appendFormDataToUrl(url, formData));

      xhr.responseType = "document";
      xhr.withCredentials = withCredentials;
      xhr.ownerElement = el;
      xhr.onerror = handleError;
      xhr.open(method, url);

      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      for (const { name, value } of el.attributes) {
        name.startsWith("h-") && xhr.setRequestHeader(name.slice(2), value);
      }

      el.isError = false;
      el.isTimeout = false;
      el.isLoading = true;
      markStateDirty();

      xhr.send(formData);
    }
  }
};
