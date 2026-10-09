import { SERIALIZE } from "../runtime/executeRules.mts";
import { traverseAttributes } from "../runtime/traverseAttributes.mts";
import { isForm } from "../util/isForm.mts";

const internalForm = document.createElement("form");

/**
 * Serializes an element's form data into a `FormData` object.
 *
 * If the element is a form, it is serialized directly. Otherwise, a clone
 * of the element is placed in an internal form before constructing the
 * `FormData`. Serialization rules are then applied to the original element.
 *
 * @param el - The element whose data should be serialized.
 * @returns The serialized form data.
 */
export const serializeForm = (el: Element) => {
  const formData = new FormData(
    isForm(el) ? el : (
      (internalForm.replaceChildren(el.cloneNode(true)), internalForm)
    ),
  );

  traverseAttributes(SERIALIZE, [el], { formData });

  return formData;
};
