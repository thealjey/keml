/**
 * Writes a scroll target value for a given axis into scroll options.
 *
 * Reads the element’s attribute for the specified axis and resolves it into a
 * numeric scroll position. Supports both numeric values and named positions:
 * - "start" → 0
 * - "center" → midpoint of scrollable range
 * - "end" → maximum scroll offset
 *
 * @param el - The DOM element providing scroll configuration.
 * @param options - Scroll options object to be mutated.
 * @param axis - Scroll axis to apply ("top" or "left").
 */
export const writeScrollAxis = (
  el: Element,
  options: ScrollToOptions,
  axis: "top" | "left",
) => {
  const value = el.getAttribute(axis);

  if (value) {
    if (isNaN(+value)) {
      const pos =
        axis === "top" ?
          el.scrollHeight - el.clientHeight
        : el.scrollWidth - el.clientWidth;

      if (value === "start") {
        options[axis] = 0;
      } else if (value === "center") {
        options[axis] = (pos / 2) | 0;
      } else if (value === "end") {
        options[axis] = pos;
      }
    } else {
      options[axis] = +value;
    }
  }
};
