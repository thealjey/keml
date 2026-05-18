const validMeasure = [
  "borderBoxSize",
  "contentBoxSize",
  "devicePixelContentBoxSize",
  "contentRect",
] as const;

/**
 * Reads a live value for an element attribute or geometry-related property.
 *
 * For width/height, resolves values from the element's latest size entry using
 * the configured measurement mode.
 */
export const readLiveValue = (el: Element, name: string) => {
  if (name === "width" || name === "height") {
    const { sizeEntry } = el;
    let measure = el.getAttribute("measure") as (typeof validMeasure)[number];
    let width: number;
    let height: number;

    validMeasure.includes(measure) || (measure = validMeasure[0]);
    if (measure === validMeasure[3]) {
      ({ width, height } = sizeEntry[measure]);
    } else {
      ({ inlineSize: width, blockSize: height } = sizeEntry[measure][0]!);
    }

    return name === "width" ? width : height;
  }

  return name in el ? (el as any)[name] : el.getAttribute(name);
};
