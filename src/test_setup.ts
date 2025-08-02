import { expect } from "vitest";

/**
 * Converts a DOM attribute to a string in `name="value"` format.
 *
 * @param attr - A DOM attribute object.
 * @returns A string representing the attribute.
 */
const attrToStr = ({ name, value }: Attr) => `${name}="${value}"`;

/**
 * Converts a child DOM node to its string representation.
 * Text nodes return their value, elements are recursively normalized.
 *
 * @param indent - Current indentation used for formatting.
 * @returns A function that takes a Node and returns its string representation.
 */
const nodeToStr = (indent: string) => (child: Node) =>
  child instanceof Element ? normalize(child, indent) : child.nodeValue ?? "";

/**
 * Returns a standardized error message for the custom HTML matcher.
 *
 * @returns A string error message.
 */
const message = () => "Normalized outerHTML of two elements does not match.";

/**
 * Converts a DOM element to a normalized HTML string.
 * Useful for consistent comparison of structure, attributes, and children.
 *
 * Attributes are sorted and indentation is applied to make diffs more readable.
 *
 * @param el - The DOM element to normalize.
 * @param indent - Optional indentation level for formatting.
 * @returns A normalized HTML string representation of the element.
 */
function normalize(
  { tagName, attributes, childNodes }: Element,
  indent = ""
): string {
  const tag = tagName.toLowerCase();
  const attrs = attributes.length
    ? ` ${Array.from(attributes).map(attrToStr).sort().join(" ")}`
    : "";
  const children = childNodes.length
    ? `\n${indent}  ${Array.from(childNodes)
        .map(nodeToStr(indent + "  "))
        .join(`\n${indent}  `)}\n${indent}`
    : "";

  return `<${tag}${attrs}>${children}</${tag}>`;
}

expect.extend({
  /**
   * Checks whether two DOM elements match in structure and content
   * after normalization.
   *
   * @param left - The actual DOM element.
   * @param right - The expected DOM element.
   * @returns An object indicating whether the comparison passed,
   *          and an error message if not.
   */
  toMatchHTML(left: Element, right: Element) {
    const actual = normalize(left);
    const expected = normalize(right);

    return { pass: actual === expected, message, actual, expected };
  },
});
