/**
 * Applies state synchronization rules between paired attributes on an element.
 *
 * Handles `x-*` and `d-*` attribute prefixes by swapping, promoting, or
 * removing corresponding base attributes to maintain consistent state
 * representation.
 *
 * @param el - Element whose attributes will be reconciled
 */
const apply_state = (el: Element) => {
  for (
    let i = 0,
      attrs = Array.from(el.attributes),
      len = attrs.length,
      j,
      attr,
      name,
      value,
      baseAttr,
      baseName;
    i < len;
    ++i
  ) {
    for (
      attr = attrs[i]!,
        name = attr.name,
        value = attr.value,
        baseName = name.slice(2),
        j = 0;
      j < len;
      ++j
    ) {
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
 * Initializes and applies attribute synchronization rules for an element.
 *
 * If not already marked, runs attribute reconciliation between paired
 * `x-*`, `d-*`, and base attributes, then marks the element as processed.
 *
 * @param el - Element to initialize
 */
export const enable_state = (el: Element) => {
  if (!el.hasAttribute("state")) {
    apply_state(el);
    el.setAttribute("state", "");
  }
};

/**
 * Removes state initialization from an element and re-applies attribute
 * synchronization rules to restore non-state behavior.
 *
 * @param el - Element to deinitialize
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
        Element,
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
        '<div state="" value="bar" x-value="foo" foo="bar" d-foo="" d-bar=""></div>' +
        '<div state="" value="bar" x-value="foo" foo="bar" d-foo="" d-bar=""></div>' +
        '<div value="foo" x-value="bar" x-foo="bar"></div>';
      const [left, right, state] = container.childNodes as unknown as [
        Element,
        Element,
        Element,
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
