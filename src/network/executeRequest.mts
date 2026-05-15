import { dispatchNavigate } from "../event/dispatchNavigate.mts";
import {
  markStateDirty,
  pushOneTimeElement,
  pushRenderPayload,
} from "../render/data.mts";
import { SERIALIZE } from "../runtime/executeRules.mts";
import { traverseAttributes } from "../runtime/traverseAttributes.mts";
import { isForm } from "../util/isForm.mts";
import { appendFormDataToUrl } from "./appendFormDataToUrl.mts";
import { bridge } from "./bridge.e.mts";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";

const internalForm = document.createElement("form");
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
  el.timeoutId = clearTimeout(el.timeoutId) as undefined;

  if (el.checkValidity?.() ?? true) {
    el.hasAttribute("once") && pushOneTimeElement(el);

    let formData: FormData | undefined = new FormData(
      isForm(el) ? el : (
        (internalForm.replaceChildren(el.cloneNode(true)), internalForm)
      ),
    );
    traverseAttributes(SERIALIZE, [el], { formData });

    const redirect = el.getAttribute("redirect");
    const [url, method, withCredentials] = resolveRequestDescriptor(el);

    if (process.env["NODE_ENV"] === "docs") {
      bridge.location.ownerElement = el;
    }

    if (redirect === "pushState" || redirect === "replaceState") {
      appendFormDataToUrl(url, formData);
      bridge.history[redirect](emptyObj, "", url);
      dispatchNavigate();
    } else if (redirect === "assign" || redirect === "replace") {
      appendFormDataToUrl(url, formData);
      bridge.location[redirect](url);
    } else {
      if (method === "GET") {
        formData = appendFormDataToUrl(url, formData);
      }

      const xhr = new bridge.XMLHttpRequest();
      xhr.responseType = "document";
      xhr.withCredentials = withCredentials;
      xhr.ownerElement = el;
      xhr.onloadend = pushRenderPayload;
      xhr.open(method, url);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

      for (const { name, value } of el.attributes) {
        name.startsWith("h-") && xhr.setRequestHeader(name.slice(2), value);
      }

      el.isError = false;
      el.isLoading = true;
      markStateDirty();

      xhr.send(formData);
    }
  }
};
