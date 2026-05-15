/**
 * Extracts the current value representation of an input-like element.
 *
 * @param el - Input-like element
 * @returns Current value representation of the element
 */
export const resolveValue = (el: Element) =>
  (el as HTMLInputElement).type === "checkbox" ?
    (el as HTMLInputElement).checked
  : (el as HTMLInputElement).type === "file" ? (el as HTMLInputElement).files
  : (el as HTMLInputElement).type === "image" ? (el as HTMLInputElement).src
  : (el as HTMLInputElement).value;
