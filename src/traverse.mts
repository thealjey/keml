import { clean, visitor } from "./element.mts";

const CHUNK_SIZE = import.meta.vitest ? 1 : 30000;

/**
 * Traverses a tree of DOM nodes using a depth-first, stack-based approach.
 *
 * This function avoids recursion to prevent call stack overflows when
 * processing large DOM trees. It operates in two modes:
 *
 * - When `added` is `true`, each element's attributes are passed to their
 *   corresponding attribute `Visitor` via `added_()`.
 * - When `added` is `false`, each element is passed to `clean()` for removal
 *   from internal tracking and observers.
 *
 * Child nodes are processed in chunks when their count exceeds `CHUNK_SIZE`,
 * to avoid exceeding the maximum argument limit of `Array.prototype.push` in
 * some JavaScript environments.
 *
 * @param nodes - A collection of DOM nodes to traverse.
 * @param added - If `true`, processes attributes via `Visitor`; if `false`,
 *                cleans up elements.
 *
 * @example
 * // Process a list of newly added nodes
 * traverse(mutation.addedNodes, true);
 *
 * // Clean up a list of removed nodes
 * traverse(mutation.removedNodes, false);
 */
export const traverse = (nodes: ArrayLike<Node>, added: boolean) => {
  const stack = Array.from(nodes);
  let node, children, len, i, attrs, name;

  while ((node = stack.pop())) {
    if (node instanceof Element) {
      if (added) {
        attrs = node.attributes;
        i = 0;
        len = attrs.length;
        for (; i < len; ++i) {
          name = attrs[i]!.name;
          visitor(name)?.added_(node, name);
        }
      } else {
        clean(node);
      }
      children = node.childNodes;
      len = children.length;
      if (len <= CHUNK_SIZE) {
        stack.push.apply(stack, children as any);
      } else {
        i = 0;
        while (i < len) {
          stack.push.apply(
            stack,
            Array.prototype.slice.call(children, i, (i += CHUNK_SIZE))
          );
        }
      }
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

    it("giant direct children collection", () => {
      const div = document.createElement("div");
      for (let i = 0, len = CHUNK_SIZE + 1; i < len; ++i) {
        div.appendChild(document.createTextNode(i + ""));
      }
      traverse([div], false);
    });
  });
}
