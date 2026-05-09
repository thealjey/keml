import { notNil } from "../util/notNil.mts";

const attrBehavior = [
  ["value", (value: string | null | undefined) => value ?? ""],
  ["checked", notNil],
  ["selected", notNil],
] as const;

/**
 * Writes, updates, or removes a DOM attribute while keeping property bindings
 * in sync.
 *
 * This function ensures that attribute changes are reflected on the element
 * and, when applicable, also updates corresponding DOM properties via
 * registered behavior resolvers.
 *
 * Behavior:
 * - Creates the attribute if it does not exist
 * - Removes the attribute if the value is not provided
 * - Updates the attribute value only when it differs
 * - Applies additional property-side synchronization when configured
 *
 * @param el - The target DOM element.
 * @param what - Attribute name or existing Attr node to operate on.
 * @param value - Optional new value for the attribute.
 */
export const writeAttribute = (
  el: Element,
  what: string | Attr,
  value?: string | null | undefined,
) => {
  let name, attr;
  if (typeof what === "string") {
    attr = el.getAttributeNode((name = what));
  } else {
    attr = what;
    name = what.name;
  }

  if (!attr) {
    value == null || el.setAttribute(name, value);
  } else if (value == null) {
    el.removeAttributeNode(attr);
  } else if (attr.value !== value) {
    attr.value = value;
  }

  for (const [attrName, resolve] of attrBehavior) {
    if (name === attrName && name in el) {
      const newValue = resolve(value);

      (el as any)[name] === newValue || ((el as any)[name] = newValue);
    }
  }
};
