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
  const name = methodAttrs.find(el.hasAttribute, el);
  const attr = el.getAttributeNode("method");
  let endpoint = name ? el.getAttribute(name)! : "";
  let method = methods[name as keyof typeof methods] ?? "GET";

  attr && (method = attr.value.toUpperCase());

  if (endpoint) {
    endpoint = endpoint.replace(trailing, "");
    (!endpoint || endpoint.lastIndexOf(".") <= endpoint.lastIndexOf("/")) &&
      (endpoint += "/");
  }

  if (process.env["NODE_ENV"] === "docs") {
    bridge.location.ownerElement = el;
  }

  return [
    new URL(
      endpoint,
      process.env["NODE_ENV"] === "docs" ? bridge.location.href : el.baseURI,
    ),
    method,
    !!el.hasAttribute("credentials"),
  ] as const;
};
