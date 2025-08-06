import { visitor } from "./element.mts";
import { queue_state } from "./render.mts";
import { traverse } from "./traverse.mts";

/**
 * Handles mutation records produced by a `MutationObserver`.
 *
 * This function processes both node additions/removals and attribute changes:
 *
 * - Calls `traverse()` on `addedNodes` and `removedNodes` to handle elements
 *   entering or leaving the DOM tree.
 *
 * - For attribute mutations, it determines whether the attribute was added or
 *   removed and invokes the appropriate method (`added_` or `removed_`) on the
 *   corresponding `Visitor`, if one exists.
 *
 * Attribute changes are only handled if:
 * - The attribute name is defined in the mutation record.
 * - The mutation target is an `Element`.
 * - A matching visitor is found using `visitor(name)`.
 *
 * @param records - A list of mutation records from a `MutationObserver`.
 *
 * @example
 * const observer = new MutationObserver(on_mutate);
 * observer.observe(document.body, {
 *   subtree: true,
 *   childList: true,
 *   attributes: true,
 *   attributeOldValue: true,
 * });
 */
export const on_mutate = (records: MutationRecord[]) => {
  const len = records.length;

  for (let i = 0, record, name, node, vis; i < len; ++i) {
    record = records[i]!;
    name = record.attributeName;
    node = record.target;
    traverse(record.removedNodes, false);
    traverse(record.addedNodes, true);
    if (name && node instanceof Element) {
      vis = visitor(name);
      if (vis) {
        if (node.hasAttribute(name)) {
          if (record.oldValue == null) {
            vis.added_(node, name);
          }
        } else if (record.oldValue != null) {
          vis.removed_(node, name);
        }
      }
    }
  }
  queue_state();
};

/* v8 ignore start */
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const { actionElements } = await import("./store.mts");

  describe("on_mutate", () => {
    it("calls visitor", () => {
      const target = document.createElement("div");
      target.setAttribute("on", "foo");
      expect(actionElements.has(target)).toBe(false);
      on_mutate([
        {
          attributeName: "on",
          target,
          removedNodes: [] as unknown as NodeList,
          addedNodes: [] as unknown as NodeList,
          oldValue: null,
          attributeNamespace: null,
          nextSibling: null,
          previousSibling: null,
          type: "attributes",
        },
      ]);
      expect(actionElements.has(target)).toBe(true);
      target.removeAttribute("on");
      on_mutate([
        {
          attributeName: "on",
          target,
          removedNodes: [] as unknown as NodeList,
          addedNodes: [] as unknown as NodeList,
          oldValue: "foo",
          attributeNamespace: null,
          nextSibling: null,
          previousSibling: null,
          type: "attributes",
        },
      ]);
      expect(actionElements.has(target)).toBe(false);
    });
  });
}
/* v8 ignore stop */
