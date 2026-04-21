import { on_navigate } from "./on_navigate.mts";
import { queue_render, queue_state } from "./render.mts";
import { resolve_url } from "./resolve_url.mts";
import { onceQueue } from "./store.mts";

const internalForm = document.createElement("form");
const emptyObj: {} = Object.create(null);

/**
 * Appends string-based form data entries to a URL's query parameters.
 *
 * Only entries with string values are included. Non-string values are ignored.
 *
 * The provided URL is mutated in-place.
 *
 * @param formData - Key-value form data to apply to the URL
 * @param url - Target URL whose search parameters will be updated
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
 * Commits an element by resolving its request data and executing either
 * a navigation strategy or an XHR submission.
 *
 * May mutate browser state (history/location), element state flags,
 * and enqueue side-effect queues depending on attributes.
 *
 * @param element - DOM element to commit
 */
export const commit = (el: Element) => {
  clearTimeout(el.timeoutId_);
  el.timeoutId_ = undefined;
  if (!el.checkValidity || el.checkValidity()) {
    if (el.hasAttribute("once")) {
      onceQueue.push(el);
    }

    let attr, name, data;
    const [url, method, withCredentials] = resolve_url(el);

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
    if (redirect === "pushState" || redirect === "replaceState") {
      apply_data_to_url(data, url);
      history[redirect](emptyObj, "", url);
      on_navigate();
    } else if (redirect === "assign" || redirect === "replace") {
      apply_data_to_url(data, url);
      location[redirect](url);
    } else {
      const xhr = new XMLHttpRequest();

      if (method === "GET") {
        apply_data_to_url(data, url);
        data = undefined;
      }
      xhr.responseType = "document";
      xhr.withCredentials = withCredentials;
      xhr.ownerElement_ = el;
      xhr.onloadend = queue_render as any; // because, shut up typescript
      xhr.open(method, url);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

      for (let i = 0, attrs = el.attributes, len = attrs.length; i < len; ++i) {
        attr = attrs[i]!;
        name = attr.name;
        if (name.startsWith("h-")) {
          xhr.setRequestHeader(name.slice(2), attr.value);
        }
      }
      el.isError_ = false;
      el.isLoading_ = true;
      queue_state();
      xhr.send(data);
    }
  }
};

/* v8 ignore start */
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

    it("apply_data_to_url", () => {
      const formData = new FormData();
      formData.append("search", "test");
      formData.append("page", "1");
      formData.append("file", new File([], "example.txt")); // Ignored

      const url = new URL("https://example.com");
      apply_data_to_url(formData, url);

      expect(url.toString()).toBe("https://example.com/?search=test&page=1");
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

    it("submit get", () => {
      const setRequestHeader = spyOn(
        XMLHttpRequest.prototype,
        "setRequestHeader",
      ).mockImplementation(() => {});
      const open = spyOn(XMLHttpRequest.prototype, "open").mockImplementation(
        () => {},
      );
      const send = spyOn(XMLHttpRequest.prototype, "send").mockImplementation(
        () => {},
      );
      const input = document.createElement("input");
      input.setAttribute("name", "foo");
      input.setAttribute("once", "");
      input.setAttribute("get", "/foobar");
      input.setAttribute("h-test", "header");
      input.value = "bar1";
      commit(input);
      expect(onceQueue[onceQueue.length - 1]).toBe(input);
      expect(setRequestHeader).toHaveBeenCalledWith("test", "header");
      const [, url] = open.mock.calls[0] as unknown as [string, URL];
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("?foo=bar1");
      expect(send).toHaveBeenCalledWith(undefined);
    });

    it("submit post", () => {
      const setRequestHeader = spyOn(
        XMLHttpRequest.prototype,
        "setRequestHeader",
      ).mockImplementation(() => {});
      const open = spyOn(XMLHttpRequest.prototype, "open").mockImplementation(
        () => {},
      );
      const send = spyOn(XMLHttpRequest.prototype, "send").mockImplementation(
        () => {},
      );
      const input = document.createElement("input");
      input.setAttribute("name", "foo");
      input.setAttribute("once", "");
      input.setAttribute("get", "/foobar");
      input.setAttribute("h-test", "header");
      input.setAttribute("method", "post");
      input.value = "bar1";
      commit(input);
      expect(onceQueue[onceQueue.length - 1]).toBe(input);
      expect(setRequestHeader).toHaveBeenCalledWith("test", "header");
      const [method, url] = open.mock.calls[0] as unknown as [string, URL];
      expect(method).toBe("POST");
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("");
      expect(send).toHaveBeenCalledWith(expect.any(FormData));
    });

    it("post", () => {
      const pushState = spyOn(history, "pushState").mockImplementation(
        () => {},
      );
      const select = document.createElement("select");
      const option = document.createElement("option");
      option.setAttribute("value", "bar2");
      option.setAttribute("selected", "");
      select.setAttribute("name", "foo");
      select.setAttribute("post", "/foobar.txt/");
      select.setAttribute("redirect", "pushState");
      select.append(option);
      commit(select);
      const url = pushState.mock.calls[0]![2] as URL;
      expect(url.pathname).toBe("/foobar.txt");
      expect(url.search).toBe("?foo=bar2");
    });

    it("put", () => {
      const replaceState = spyOn(history, "replaceState").mockImplementation(
        () => {},
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

    it("multiple trailing slashes", () => {
      const replaceState = spyOn(history, "replaceState").mockImplementation(
        () => {},
      );
      const textarea = document.createElement("textarea");
      textarea.setAttribute("name", "foo");
      textarea.setAttribute("put", "/foobar//");
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
      img.setAttribute("src", "/foobar");
      img.setAttribute("redirect", "replace");
      commit(img);
      const url = replace.mock.calls[0]![0] as URL;
      expect(url.pathname).toBe("/foobar/");
      expect(url.search).toBe("");
    });

    it("default", () => {
      const replace = spyOn(location, "replace").mockImplementation(() => {});
      const img = document.createElement("a");
      img.setAttribute("value", "bar8");
      img.setAttribute("redirect", "replace");
      commit(img);
      const url = replace.mock.calls[0]![0] as URL;
      expect(url.pathname).toBe("/");
      expect(url.search).toBe("");
    });

    it("does nothing when data is undefined", () => {
      const url = new URL("https://example.com/");
      apply_data_to_url(undefined, url);
      expect(url.search).toBe("");
    });

    it("ignores non-string FormData entries", () => {
      const url = new URL("https://example.com/");
      const data = new FormData();
      data.set(
        "file",
        new Blob(["content"], { type: "text/plain" }),
        "test.txt",
      );
      apply_data_to_url(data, url);
      expect(url.search).toBe("");
    });

    it("does nothing when checkValidity returns false", () => {
      const open = spyOn(XMLHttpRequest.prototype, "open").mockImplementation(
        () => {},
      );
      const send = spyOn(XMLHttpRequest.prototype, "send").mockImplementation(
        () => {},
      );

      const input = document.createElement("input");
      input.setAttribute("get", "/foobar");

      input.checkValidity = () => false;

      commit(input);

      expect(open).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
    });
  });
}
/* v8 ignore stop */
