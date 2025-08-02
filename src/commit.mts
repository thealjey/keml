import { on_navigate } from "./on_navigate.mts";
import { queue_render, queue_state } from "./render.mts";
import { onceQueue } from "./store.mts";

const internalForm = document.createElement("form");
const emptyObj: {} = Object.create(null);

/**
 * Applies string-based entries from a FormData object to the query parameters
 * of a given URL.
 *
 * Iterates through all key-value pairs in the FormData object and appends only
 * those where the value is a string to the URL's search parameters. This is
 * useful for converting form input into query parameters for GET requests or
 * API calls.
 *
 * If the provided FormData is undefined or contains no string entries, the URL
 * remains unchanged.
 *
 * Non-string values (e.g. File, Blob) are ignored entirely to avoid unexpected
 * behavior or serialization issues.
 *
 * This function mutates the original URL object by modifying its `searchParams`
 * directly.
 * For immutability, consider cloning the URL before passing it in.
 *
 * Performance: This function runs in linear time relative to the number of
 * entries in the FormData.
 *
 * @param data - The FormData object containing entries to apply to the URL. Can
 *               be undefined.
 * @param url - The URL object to which string entries from the FormData will be
 *              appended as search parameters.
 *
 * @example
 * const formData = new FormData();
 * formData.append('search', 'test');
 * formData.append('page', '1');
 * formData.append('file', new File([], 'example.txt')); // Ignored
 *
 * const url = new URL('https://example.com');
 * apply_data_to_url(formData, url);
 *
 * console.log(url.toString());
 * // Output: "https://example.com/?search=test&page=1"
 */
const apply_data_to_url = (data: FormData | undefined, url: URL) => {
  if (data) {
    for (const entry of data) {
      if (typeof entry[1] === "string") {
        url.searchParams.append(entry[0], entry[1]);
      }
    }
  }
};

/**
 * Commits an element's intent by extracting its data and performing a
 * navigation or network request.
 *
 * This function interprets semantic attributes on a given DOM element (e.g.,
 * `get`, `post`, `redirect`, etc.) to determine the target endpoint, HTTP
 * method, form data, and redirection behavior. Based on these, it performs one
 * of the following:
 * - Pushes a navigation state (`pushState`, `replaceState`)
 * - Redirects the browser (`assign`, `replace`)
 * - Sends an XMLHttpRequest with optional headers and credentials
 *
 * The function:
 * - Validates the element via `.checkValidity()` if available
 * - Cancels any active timeout associated with the element (`el.timeoutId_`)
 * - Resolves the appropriate request endpoint and method from attributes
 * - Serializes form-like data from the element if applicable
 * - Handles pathname normalization by trimming file-like segments
 * - Dispatches render logic via a `queue_render` callback and flags application
 *   state with `queue_state`
 * - Tracks "once" interactions by pushing qualifying elements into a
 *   `onceQueue`
 *
 * Attributes supported:
 * - `get`, `post`, `put`, `delete`, `href`, `action`, `src` (for endpoint)
 * - `method` (explicit HTTP method override)
 * - `name` and `value` (for data payload on non-form elements)
 * - `credentials` (sets `withCredentials` on XHR)
 * - `redirect`: One of `"pushState"`, `"replaceState"`, `"assign"`, `"replace"`
 * - `h-*`: Custom headers passed with the request
 * - `once`: Marks element for one-time interaction tracking
 *
 * Side effects:
 * - Mutates `onceQueue`, `internalForm`, `renderQueue`, and `stateQueue`
 * - May mutate `location`, `history`, or initiate network requests
 * - Updates custom internal flags: `isError_`, `isLoading_`, `timeoutId_`, and
 *   `ownerElement_`
 *
 * Performance: While each part is optimized, operations like `FormData`
 * serialization and XHR send can be expensive on large forms or in rapid
 * succession. Debouncing or batching may be necessary in high-interaction
 * contexts.
 *
 * @param el - The DOM element representing the user's intent (e.g., a form,
 *             button, or input element).
 */
export const commit = (el: Element) => {
  clearTimeout(el.timeoutId_);
  el.timeoutId_ = undefined;
  if (!el.checkValidity || el.checkValidity()) {
    if (el.hasAttribute("once")) {
      onceQueue.push(el);
    }

    let attr, i, name;
    let endpoint = "";
    let method = "GET";
    if ((attr = el.getAttributeNode("get"))) {
      endpoint = attr.value;
    } else if ((attr = el.getAttributeNode("post"))) {
      endpoint = attr.value;
      method = "POST";
    } else if ((attr = el.getAttributeNode("put"))) {
      endpoint = attr.value;
      method = "PUT";
    } else if ((attr = el.getAttributeNode("delete"))) {
      endpoint = attr.value;
      method = "DELETE";
    } else if ((attr = el.getAttributeNode("href"))) {
      endpoint = attr.value;
    } else if ((attr = el.getAttributeNode("action"))) {
      endpoint = attr.value;
    } else if ((attr = el.getAttributeNode("src"))) {
      endpoint = attr.value;
    }
    if ((attr = el.getAttributeNode("method"))) {
      method = attr.value.toUpperCase();
    }

    const url = new URL(endpoint, el.baseURI);
    const pathname = url.pathname;
    const arr = Array.from(pathname);
    i = arr.length;
    for (let found = false, char; i--; ) {
      char = pathname[i];
      if (char === "/") {
        if (found) {
          arr.push("/");
          break;
        } else {
          arr.pop();
        }
      } else if (char === ".") {
        if (found) {
          break;
        } else {
          arr.pop();
        }
      } else {
        found = true;
      }
    }
    url.pathname = arr.join("");

    let data;
    if (el instanceof HTMLFormElement) {
      data = new FormData(el);
    } else if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLTextAreaElement
    ) {
      internalForm.replaceChildren(el.cloneNode(true));
      data = new FormData(internalForm);
    } else if ((attr = el.getAttributeNode("name"))) {
      name = attr.value;
      if ((attr = el.getAttributeNode("value"))) {
        data = new FormData();
        data.set(name, attr.value);
      }
    }

    const redirect = el.getAttribute("redirect");
    if (redirect === "pushState") {
      apply_data_to_url(data, url);
      history.pushState(emptyObj, "", url);
      on_navigate();
    } else if (redirect === "replaceState") {
      apply_data_to_url(data, url);
      history.replaceState(emptyObj, "", url);
      on_navigate();
    } else if (redirect === "assign") {
      apply_data_to_url(data, url);
      location.assign(url);
    } else if (redirect === "replace") {
      apply_data_to_url(data, url);
      location.replace(url);
    } else {
      const xhr = new XMLHttpRequest();
      const attrs = el.attributes;
      const len = attrs.length;

      if (method !== "POST") {
        apply_data_to_url(data, url);
        data = undefined;
      }
      xhr.responseType = "document";
      xhr.withCredentials = el.hasAttribute("credentials");
      xhr.ownerElement_ = el;
      xhr.onloadend = queue_render;
      xhr.open(method, url);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      i = 0;
      for (; i < len; ++i) {
        attr = attrs[i]!;
        name = attr.name;
        if (name.startsWith("h-")) {
          xhr.setRequestHeader(name.substring(2), attr.value);
        }
      }
      el.isError_ = false;
      el.isLoading_ = true;
      queue_state();
      xhr.send(data);
    }
  }
};

/* c8 ignore next */
if (import.meta.vitest) {
  const {
    describe,
    it,
    expect,
    vi: { spyOn, restoreAllMocks },
    afterEach,
  } = import.meta.vitest;

  describe("commit", () => {
    afterEach(restoreAllMocks);

    it("custom", () => {
      const setRequestHeader = spyOn(
        XMLHttpRequest.prototype,
        "setRequestHeader"
      ).mockImplementation(() => {});
      const open = spyOn(XMLHttpRequest.prototype, "open").mockImplementation(
        () => {}
      );
      const send = spyOn(XMLHttpRequest.prototype, "send").mockImplementation(
        () => {}
      );
      const input = document.createElement("input");
      input.setAttribute("name", "foo");
      input.setAttribute("once", "");
      input.setAttribute("get", "/foobar");
      input.setAttribute("h-test", "header");
      input.setAttribute("method", "lol");
      input.value = "bar1";
      commit(input);
      expect(onceQueue[onceQueue.length - 1]).toBe(input);
      expect(setRequestHeader).toBeCalledWith("test", "header");
      const [method, url] = open.mock.calls[0] as unknown as [string, URL];
      expect(method).toBe("LOL");
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("?foo=bar1");
      expect(send).toBeCalledWith(undefined);
    });

    it("post", () => {
      const pushState = spyOn(history, "pushState").mockImplementation(
        () => {}
      );
      const select = document.createElement("select");
      const option = document.createElement("option");
      option.setAttribute("value", "bar2");
      option.setAttribute("selected", "");
      select.setAttribute("name", "foo");
      select.setAttribute("post", "/foobar.txt./");
      select.setAttribute("redirect", "pushState");
      select.append(option);
      commit(select);
      const url = pushState.mock.calls[0]![2] as URL;
      expect(url.pathname).toBe("/foobar.txt");
      expect(url.search).toBe("?foo=bar2");
    });

    it("put", () => {
      const replaceState = spyOn(history, "replaceState").mockImplementation(
        () => {}
      );
      const textarea = document.createElement("textarea");
      textarea.setAttribute("name", "foo");
      textarea.setAttribute("put", "/foobar/");
      textarea.setAttribute("redirect", "replaceState");
      textarea.textContent = "bar3";
      commit(textarea);
      const url = replaceState.mock.calls[0]![2] as URL;
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("?foo=bar3");
    });

    it("delete", () => {
      const assign = spyOn(location, "assign").mockImplementation(() => {});
      const div = document.createElement("div");
      div.setAttribute("name", "foo");
      div.setAttribute("value", "bar4");
      div.setAttribute("delete", "/foobar.txt");
      div.setAttribute("redirect", "assign");
      commit(div);
      const url = assign.mock.calls[0]![0] as URL;
      expect(url.pathname).toBe("/foobar.txt");
      expect(url.search).toBe("?foo=bar4");
    });

    it("action", () => {
      const replace = spyOn(location, "replace").mockImplementation(() => {});
      const form = document.createElement("form");
      const input = document.createElement("input");
      input.setAttribute("name", "foo");
      input.value = "bar5";
      form.append(input);
      form.setAttribute("action", "/foobar");
      form.setAttribute("redirect", "replace");
      commit(form);
      const url = replace.mock.calls[0]![0] as URL;
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("?foo=bar5");
    });

    it("href", () => {
      const replace = spyOn(location, "replace").mockImplementation(() => {});
      const a = document.createElement("a");
      a.setAttribute("name", "foo");
      a.setAttribute("value", "bar6");
      a.setAttribute("href", "/foobar");
      a.setAttribute("redirect", "replace");
      commit(a);
      const url = replace.mock.calls[0]![0] as URL;
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("?foo=bar6");
    });

    it("src", () => {
      const replace = spyOn(location, "replace").mockImplementation(() => {});
      const img = document.createElement("img");
      img.setAttribute("name", "foo");
      img.setAttribute("value", "bar7");
      img.setAttribute("src", "/foobar");
      img.setAttribute("redirect", "replace");
      commit(img);
      const url = replace.mock.calls[0]![0] as URL;
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("?foo=bar7");
    });
  });
}
