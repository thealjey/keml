/**
 * Determines whether a value is a DOM element.
 *
 * @param value - Unknown runtime value
 * @returns True if the value is a DOM element
 */
export const isElement = (value: any): value is Element =>
  (value as Node | null)?.nodeType === Node.ELEMENT_NODE;
