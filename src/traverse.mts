import { clean, visitor } from "./element.mts";

/**
 * Traverses a list of DOM nodes and their descendants using a TreeWalker.
 *
 * This function iterates through each node in the given list. For nodes that
 * are Elements, it creates a TreeWalker that visits the element and all its
 * descendant elements in document order.
 *
 * It supports two modes controlled by the `added` flag:
 *
 * - When `added` is true, each element’s attributes are inspected, and
 *   corresponding visitor methods are called via `added_()`.
 * - When `added` is false, each element is passed to `clean()` for cleanup.
 *
 * Using a TreeWalker improves efficiency and readability over manual
 * stack-based traversal, especially for deep DOM subtrees.
 *
 * @param nodes - A list or collection of DOM nodes to traverse.
 * @param added - Boolean flag indicating the mode: if true, attributes are
 *                processed with visitor callbacks; if false, elements are
 *                cleaned.
 *
 * @example
 * // Process newly added nodes
 * traverse(mutation.addedNodes, true);
 *
 * // Clean up removed nodes
 * traverse(mutation.removedNodes, false);
 */
export const traverse = (nodes: ArrayLike<Node>, added: boolean) => {
  const nodeLen = nodes.length;

  for (let i = 0, j, walker, name, node, el, attrLen, attrs; i < nodeLen; ++i) {
    node = nodes[i];
    if (node instanceof Element) {
      walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
      do {
        el = walker.currentNode as Element;
        if (added) {
          j = 0;
          attrs = el.attributes;
          attrLen = attrs.length;
          for (; j < attrLen; ++j) {
            name = attrs[j]!.name;
            visitor(name)?.added_(el, name);
          }
        } else {
          clean(el);
        }
      } while (walker.nextNode());
    }
  }
};

/* c8 ignore next */
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { actionElements } = await import("./store.mts");

  describe("traverse", () => {
    it("attrs", () => {
      const div = document.createElement("div");
      div.setAttribute("42never-likely-to-exist", "43");
      div.setAttribute("on", "foo");
      traverse([div], true);
      expect(actionElements.has(div)).toBe(true);
      actionElements.delete(div);
      traverse([div], false);
      expect(actionElements.has(div)).toBe(false);
    });
  });
}
