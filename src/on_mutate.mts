import { attr, visitor } from "./element.mts";
import { queue_state } from "./render.mts";
import { method_map } from "./resolve_url.mts";
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
      if (
        (name === "sse" || method_map.has(name)) &&
        node.hasAttribute("sse")
      ) {
        attr.sse.added_(node, "sse");
      }
    }
  }
  queue_state();
};

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    it,
    expect,
    vi: { spyOn, resetAllMocks },
  } = import.meta.vitest;
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
        {
          attributeName: null,
          target: document.createTextNode("foo"),
          removedNodes: [] as unknown as NodeList,
          addedNodes: [] as unknown as NodeList,
          oldValue: null,
          attributeNamespace: null,
          nextSibling: null,
          previousSibling: null,
          type: "characterData",
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

    it("does nothing if visitor returns falsy", () => {
      const target = document.createElement("div");
      target.setAttribute("data-foo", "bar"); // some attribute with no visitor

      // Pass a mutation record for it
      on_mutate([
        {
          attributeName: "data-foo",
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

      // Nothing happens — no errors, nothing added/removed
      expect(target.hasAttribute("data-foo")).toBe(true); // unchanged
    });

    it("does nothing if attribute already exists (oldValue != null)", () => {
      const target = document.createElement("div");
      target.setAttribute("on", "foo"); // attribute exists
      expect(target.hasAttribute("on")).toBe(true);

      // mutation: attribute present, oldValue != null
      on_mutate([
        {
          attributeName: "on",
          target,
          removedNodes: [] as unknown as NodeList,
          addedNodes: [] as unknown as NodeList,
          oldValue: "foo", // not null → else branch
          attributeNamespace: null,
          nextSibling: null,
          previousSibling: null,
          type: "attributes",
        },
      ]);

      // nothing should have changed
      expect(target.hasAttribute("on")).toBe(true);
    });

    it("does nothing if attribute missing and oldValue is null", () => {
      const target = document.createElement("div");
      // no attribute set
      expect(target.hasAttribute("on")).toBe(false);

      // mutation record simulates attribute missing, oldValue null
      on_mutate([
        {
          attributeName: "on",
          target,
          removedNodes: [] as unknown as NodeList,
          addedNodes: [] as unknown as NodeList,
          oldValue: null, // attribute did not exist before
          attributeNamespace: null,
          nextSibling: null,
          previousSibling: null,
          type: "attributes",
        },
      ]);

      // nothing happens, just cover the else branch
      expect(target.hasAttribute("on")).toBe(false);
    });

    it("triggers sse visitor when sse attribute is present and endpoint attribute changes", () => {
      const target = document.createElement("div");
      target.setAttribute("sse", "/stream");
      target.setAttribute("get", "/foo");

      const added = spyOn(attr.sse, "added_").mockImplementation(() => {});

      on_mutate([
        {
          attributeName: "get",
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

      expect(added).toHaveBeenCalledWith(target, "sse");
      resetAllMocks();
    });
  });
}
/* v8 ignore stop */
