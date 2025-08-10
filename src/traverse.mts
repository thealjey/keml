import { clean, visitor } from "./element.mts";

/**
 * Traverses a list of DOM nodes and their descendants using a NodeIterator.
 *
 * For each Element in the given node list, a NodeIterator visits that element
 * and all of its descendant elements in document order.
 *
 * Supports two modes controlled by the `added` flag:
 * - When `added` is true, each element’s attributes are inspected and
 *   corresponding visitor methods are called via `added_()`.
 * - When `added` is false, each element is passed to `clean()` for cleanup.
 *
 * Why NodeIterator?
 *  1. Recursion — simple but prone to stack overflows and high call overhead.
 *  2. Manual stack — faster but still extra memory allocations.
 *  3. TreeWalker — fast and memory-efficient, but slightly slower in benchmarks.
 *  4. querySelectorAll("*") — acceptable speed but *very* high memory usage.
 *  5. NodeIterator — **fastest** and equally memory-efficient as TreeWalker.
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

  for (let i = 0, j, el, it, attrLen, attrs, name; i < nodeLen; ++i) {
    el = nodes[i];
    if (el instanceof Element) {
      it = document.createNodeIterator(el, NodeFilter.SHOW_ELEMENT);
      do {
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
      traverse([div], true);
      expect(actionElements.has(div)).toBe(true);
      actionElements.delete(div);
      traverse([div], false);
      expect(actionElements.has(div)).toBe(false);
    });
  });
}
/* v8 ignore stop */
