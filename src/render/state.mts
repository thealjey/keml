import { attrNameEquals } from "../util/attrNameEquals.mts";
import { writeAttribute } from "./writeAttribute.mts";

/**
 * Applies and synchronizes attribute state variants on a DOM element.
 *
 * This function processes prefixed attributes and ensures consistency between:
 * - `x-*` attributes (active state)
 * - `d-*` attributes (default/fallback state)
 * - base attributes (unprefixed form)
 *
 * It swaps or normalizes attribute values to keep state variants in sync,
 * ensuring only one active representation is effectively applied at a time.
 *
 * @param el - The DOM element whose attributes should be normalized and
 *             synchronized.
 */
const applyState = (el: Element) => {
  const attrs = Array.from(el.attributes);

  for (const attr of attrs) {
    const { name, value } = attr;
    const baseName = name.slice(2);
    const baseAttr = attrs.find(attrNameEquals, baseName);

    if (name.startsWith("x-")) {
      if (baseAttr) {
        writeAttribute(el, attr, baseAttr.value);
        writeAttribute(el, baseAttr, value);
      } else {
        writeAttribute(el, attr);
        writeAttribute(el, "d-" + baseName, "");
        writeAttribute(el, baseName, value);
      }
    } else if (name.startsWith("d-")) {
      if (baseAttr) {
        writeAttribute(el, "x-" + baseName, baseAttr.value);
        writeAttribute(el, baseAttr);
      }
      writeAttribute(el, attr);
    }
  }
};

/**
 * Updates the element to reflect transition into the ON state mode.
 *
 * Applies state-related attribute normalization and marks the element as active
 * by setting the `state` attribute.
 *
 * @param el - The DOM element to update.
 */
export const enableState = (el: Element) => {
  if (!el.hasAttribute("state")) {
    applyState(el);
    writeAttribute(el, "state", "");
  }
};

/**
 * Updates the element to reflect transition into the OFF state mode.
 *
 * Removes the `state` marker attribute and re-applies state-related attribute
 * normalization to restore the inactive configuration.
 *
 * @param el - The DOM element to update.
 */
export const disableState = (el: Element) => {
  const attr = el.getAttributeNode("state");

  if (attr) {
    writeAttribute(el, attr);
    applyState(el);
  }
};
