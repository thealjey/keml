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
 * Resolves an element's target URL, HTTP method, and credential policy.
 *
 * This function inspects semantic attributes on a DOM element to determine the
 * intended endpoint and request configuration. The endpoint is derived from the
 * first matching attribute in the following order:
 *
 * - `get`
 * - `post`
 * - `put`
 * - `delete`
 * - `href`
 * - `action`
 * - `src`
 *
 * If a `method` attribute is present, it overrides the method implied by these
 * attributes.
 *
 * The resulting endpoint is normalized to enforce consistent trailing slash
 * behavior:
 *
 * - Directory paths are ensured to end with exactly one trailing slash.
 * - Paths that contain a file extension (e.g. `.txt`) will have trailing
 *   slashes removed.
 * - Multiple trailing slashes are collapsed.
 *
 * The endpoint is resolved relative to the element's `baseURI`.
 *
 * The function also checks for the presence of the `credentials` attribute,
 * which indicates whether network requests should include credentials such
 * as cookies or authentication headers.
 *
 * Performance: Runs in linear time relative to the endpoint string length.
 *
 * @param el - The element whose attributes should be inspected.
 *
 * @returns A tuple containing:
 * - `URL` — The resolved and normalized endpoint.
 * - `string` — The HTTP method.
 * - `boolean` — Whether credentials should be included.
 *
 * @example
 * const el = document.createElement("div");
 * el.setAttribute("post", "/api/user");
 *
 * const [url, method, credentials] = resolve_url(el);
 *
 * console.log(url.pathname); // "/api/user/"
 * console.log(method);       // "POST"
 * console.log(credentials);  // false
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
    } else if (end === 0) {
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
