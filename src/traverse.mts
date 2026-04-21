import { clean, visitor } from "./element.mts";

/**
 * Traverses a set of DOM nodes and applies attribute lifecycle hooks or cleanup
 * logic to all descendant elements.
 *
 * When `added` is true, triggers "added" handlers for element attributes.
 * When false, performs element cleanup.
 *
 * @param nodes - Node collection to traverse
 * @param added - Whether nodes are being added or removed
 */
export const traverse = (nodes: ArrayLike<Node>, added: boolean) => {
  for (
    let i = 0, nodeLen = nodes.length, j, el, it, attrLen, attrs, name;
    i < nodeLen;
    ++i
  ) {
    el = nodes[i];
    if (el instanceof Element) {
      it = document.createNodeIterator(el, NodeFilter.SHOW_ELEMENT);
      do {
        if (added) {
          for (
            j = 0, attrs = el.attributes, attrLen = attrs.length;
            j < attrLen;
            ++j
          ) {
            name = attrs[j]!.name;
            visitor(name)?.added_(el, name);
          }
        } else {
          clean(el);
        }
      } while ((el = it.nextNode() as Element));
    }
  }
};

/* v8 ignore start */
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { actionElements } = await import("./store.mts");

  describe("traverse", () => {
    it("attrs", () => {
      const div = document.createElement("div");
      div.setAttribute("42never-likely-to-exist", "43");
      div.setAttribute("on", "foo");
      traverse([div, document.createTextNode("hello")], true);
      expect(actionElements.has(div)).toBe(true);
      actionElements.delete(div);
      traverse([div], false);
      expect(actionElements.has(div)).toBe(false);
    });
  });
}
/* v8 ignore stop */
