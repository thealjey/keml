export const method_map = new Map([
  ["get", "GET"],
  ["post", "POST"],
  ["put", "PUT"],
  ["delete", "DELETE"],
  ["href", "GET"],
  ["action", "GET"],
  ["src", "GET"],
]);

/**
 * Resolves the request URL, HTTP method, and credential mode from an element.
 *
 * URL is derived from attribute-defined endpoints and normalized relative to
 * the base URI.
 *
 * @param element - Source element defining request metadata
 * @returns A tuple containing:
 * - resolved URL
 * - HTTP method
 * - whether credentials are enabled
 */
export const resolve_url = (el: Element) => {
  let attr, end, code, ext, i, len, name, meth;
  let endpoint = "";
  let method = "GET";

  for ([name, meth] of method_map) {
    if ((attr = el.getAttributeNode(name))) {
      endpoint = attr.value;
      method = meth;
      break;
    }
  }

  if ((attr = el.getAttributeNode("method"))) {
    method = attr.value.toUpperCase();
  }

  len = i = endpoint.length;
  while (i-- && endpoint.charCodeAt(i) === 47) {}

  if (i !== -1) {
    end = i - len + 1;
    while (i--) {
      code = endpoint.charCodeAt(i);
      if (code === 47) {
        break;
      }
      if (code === 46) {
        ext = true;
        break;
      }
    }
    if (ext) {
      if (end < 0) {
        endpoint = endpoint.slice(0, end);
      }
    } else if (!end) {
      endpoint = endpoint + "/";
    } else if (end < -1) {
      endpoint = endpoint.slice(0, end + 1);
    }
  } else if (len > 1) {
    endpoint = "/";
  }

  return [
    new URL(endpoint, el.baseURI),
    method,
    el.hasAttribute("credentials"),
  ] as const;
};

/* v8 ignore start */
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("resolve_url", () => {
    it("resolves get endpoint", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "/foo");

      const [url, method, credentials] = resolve_url(el);

      expect(url.pathname).toBe("/foo/");
      expect(method).toBe("GET");
      expect(credentials).toBe(false);
    });

    it("resolves post endpoint", () => {
      const el = document.createElement("div");
      el.setAttribute("post", "/foo");

      const [, method] = resolve_url(el);

      expect(method).toBe("POST");
    });

    it("method attribute overrides inferred method", () => {
      const el = document.createElement("div");
      el.setAttribute("post", "/foo");
      el.setAttribute("method", "patch");

      const [, method] = resolve_url(el);

      expect(method).toBe("PATCH");
    });

    it("removes trailing slash for file extensions", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "/foo.txt/");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/foo.txt");
    });

    it("normalizes multiple trailing slashes", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "/foo//");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/foo/");
    });

    it("returns credentials flag", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "/foo");
      el.setAttribute("credentials", "");

      const [, , credentials] = resolve_url(el);

      expect(credentials).toBe(true);
    });

    it("returns root when endpoint becomes empty", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "//");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/");
    });

    it("resolves put endpoint", () => {
      const el = document.createElement("div");
      el.setAttribute("put", "/foo");

      const [, method] = resolve_url(el);

      expect(method).toBe("PUT");
    });

    it("resolves delete endpoint", () => {
      const el = document.createElement("div");
      el.setAttribute("delete", "/foo");

      const [, method] = resolve_url(el);

      expect(method).toBe("DELETE");
    });

    it("resolves href endpoint", () => {
      const el = document.createElement("a");
      el.setAttribute("href", "/foo");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/foo/");
    });

    it("resolves action endpoint", () => {
      const el = document.createElement("form");
      el.setAttribute("action", "/foo");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/foo/");
    });

    it("resolves src endpoint", () => {
      const el = document.createElement("img");
      el.setAttribute("src", "/foo");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/foo/");
    });

    it("adds trailing slash when endpoint has no extension", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "/bar");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/bar/");
    });

    it("keeps endpoint unchanged for extension without trailing slash", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "/foo.txt");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/foo.txt");
    });

    it("handles endpoint with slash and without extension", () => {
      const el = document.createElement("div");
      el.setAttribute("get", "/foo/");

      const [url] = resolve_url(el);

      expect(url.pathname).toBe("/foo/");
    });
  });
}
/* v8 ignore stop */
