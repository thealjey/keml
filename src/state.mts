/**
 * Toggles an element's state by activating or deactivating `x-*` attributes.
 *
 * This function interprets prefixed attributes as follows:
 *
 * - `x-*`: Indicates a pending attribute to be activated. When toggled,
 *   the `x-*` attribute is converted into its unprefixed form, and its original
 *   value (if any)
 *   is saved internally using a `d-*` attribute. This signals that the state is
 *   now enabled.
 *
 * - `d-*`: Signals that a state was previously enabled and should now be
 *   reverted.
 *   When toggled, the corresponding unprefixed attribute is removed, and any
 *   original value stored in the matching `x-*` attribute is restored.
 *
 * The toggling logic ensures that the element can flip cleanly between enabled
 * and disabled states without external bookkeeping.
 *
 * This mechanism is reversible, consistent, and stateless in terms of
 * interpretation: it does not track whether the state is "on" or "off" — only
 * that it should flip.
 *
 * @param el - The DOM element to apply state toggling on.
 *
 * @example
 * // Initial state:
 * <input x-value="foo">
 *
 * apply_state(el);
 * // Becomes:
 * <input value="foo" d-value="">
 *
 * apply_state(el);
 * // Becomes:
 * <input x-value="foo">
 */
const apply_state = (el: Element) => {
  const attrs = Array.from(el.attributes);
  const len = attrs.length;

  for (let i = 0, j, attr, name, value, baseAttr, baseName; i < len; ++i) {
    attr = attrs[i]!;
    name = attr.name;
    value = attr.value;
    baseName = name.slice(2);
    for (j = 0; j < len; ++j) {
      baseAttr = attrs[j]!;
      if (baseAttr.name === baseName) {
        break;
      }
      baseAttr = undefined;
    }
    if (name.startsWith("x-")) {
      if (baseAttr) {
        attr.value = baseAttr.value;
        baseAttr.value = value;
      } else {
        el.removeAttributeNode(attr);
        el.setAttribute("d-" + baseName, "");
        el.setAttribute(baseName, value);
      }
    } else if (name.startsWith("d-")) {
      if (baseAttr) {
        el.setAttribute("x-" + baseName, baseAttr.value);
        el.removeAttributeNode(baseAttr);
      }
      el.removeAttributeNode(attr);
    }
  }
};

/**
 * Enables state on the given element if it is not already enabled.
 *
 * This function checks whether the element has a `state` attribute. If not,
 * it applies the attribute state toggling mechanism via `apply_state()` and
 * then sets the `state` attribute to signal that the element is now in its
 * active (enabled) state.
 *
 * The `state` attribute acts as a flag indicating that the state has already
 * been toggled. This prevents repeated re-application of the `x-*`/`d-*`
 * transformation.
 *
 * @param el - The element to toggle state on if not already enabled.
 *
 * @example
 * // If the element lacks the `state` attribute:
 * enable_state(el);
 * // → apply_state(el) is called
 * // → element now has `state=""` and toggled attributes
 *
 * // If already enabled, does nothing:
 * enable_state(el); // No effect
 */
export const enable_state = (el: Element) => {
  if (!el.hasAttribute("state")) {
    apply_state(el);
    el.setAttribute("state", "");
  }
};

/**
 * Disables state on the given element if it is currently enabled.
 *
 * This function checks whether the element has a `state` attribute. If so,
 * it removes that attribute and applies the attribute state toggling
 * mechanism via `apply_state()` to revert the element back to its original
 * state.
 *
 * Removing the `state` attribute signals that the element is no longer in the
 * active (enabled) state.
 *
 * @param el - The element to toggle state off if currently enabled.
 *
 * @example
 * // If the element has the `state` attribute:
 * disable_state(el);
 * // → `state` attribute removed
 * // → apply_state(el) is called to revert attribute toggling
 *
 * // If the element does not have the `state` attribute, does nothing:
 * disable_state(el); // No effect
 */
export const disable_state = (el: Element) => {
  const attr = el.getAttributeNode("state");
  if (attr) {
    el.removeAttributeNode(attr);
    apply_state(el);
  }
};

/* v8 ignore start */
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;
  const container = document.createElement("div");

  describe("state", () => {
    it("enable_state", () => {
      container.innerHTML =
        '<div value="foo" x-value="bar" x-foo="bar"></div>' +
        '<div value="foo" x-value="bar" x-foo="bar"></div>' +
        '<div state="" value="bar" x-value="foo" foo="bar" d-foo=""></div>';
      const [left, right, state] = container.childNodes as unknown as [
        Element,
        Element,
        Element
      ];
      expect(left).toMatchHTML(right);
      enable_state(left);
      expect(left).not.toMatchHTML(right);
      expect(left).toMatchHTML(state);
      enable_state(left);
      expect(left).toMatchHTML(state);
    });

    it("disable_state", () => {
      container.innerHTML =
        '<div state="" value="bar" x-value="foo" foo="bar" d-foo=""></div>' +
        '<div state="" value="bar" x-value="foo" foo="bar" d-foo=""></div>' +
        '<div value="foo" x-value="bar" x-foo="bar"></div>';
      const [left, right, state] = container.childNodes as unknown as [
        Element,
        Element,
        Element
      ];
      expect(left).toMatchHTML(right);
      disable_state(left);
      expect(left).not.toMatchHTML(right);
      expect(left).toMatchHTML(state);
      disable_state(left);
      expect(left).toMatchHTML(state);
    });
  });
}
/* v8 ignore stop */
