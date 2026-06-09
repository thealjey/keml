import { bridge } from "./bridge.e.mts";

const methods = {
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
  href: "GET",
  action: "GET",
  src: "GET",
};

export const methodAttrs = Object.keys(methods);
const trailing = /\/+$/;

/**
 * Resolves the request URL, HTTP method, and credentials flag from a DOM
 * element.
 *
 * Extracts endpoint and method information from element attributes, applies
 * normalization rules to the endpoint path, and constructs a fully qualified
 * URL.
 *
 * @param el - The DOM element containing request configuration attributes.
 * @returns A tuple containing:
 *  - The resolved URL object
 *  - The HTTP method (uppercase)
 *  - A boolean indicating whether credentials should be included
 */
export const resolveRequestDescriptor = (el: Element) => {
  if (process.env["NODE_ENV"] === "docs") {
    bridge.location.ownerElement = el;
  }

  const name = methodAttrs.find(el.hasAttribute, el);
  const endpoint = name ? el.getAttribute(name)! : "";
  const base =
    process.env["NODE_ENV"] === "docs" ? bridge.location.href : el.baseURI;

  let url: URL;
  try {
    url = new URL(endpoint, base);
  } catch (error) {
    el.hasAttribute("log") && console.error(error);
    try {
      url = new URL("", base);
    } catch (error) {
      el.hasAttribute("log") && console.error(error);
      url = new URL("about:blank");
    }
  }

  const pathname = url.pathname.replace(trailing, "");
  url.pathname =
    !pathname || pathname.lastIndexOf(".") <= pathname.lastIndexOf("/") ?
      pathname + "/"
    : pathname;

  let method = methods[name as keyof typeof methods] ?? "GET";
  const attr = el.getAttributeNode("method");
  attr && (method = attr.value.toUpperCase());

  return [url, method, el.hasAttribute("credentials")] as const;
};
