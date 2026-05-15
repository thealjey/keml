/**
 * Determines whether an element is a form element.
 *
 * @param value - DOM element
 * @returns True if the element is a form
 */
export const isForm = (value: Element): value is HTMLFormElement =>
  value.tagName === "FORM";
