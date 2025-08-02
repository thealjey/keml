import { disable_state } from "./state.mts";

/**
 * Updates an existing DOM node (`left`) to match another (`right`) as closely
 * as possible without replacing the whole node, preserving node references and
 * minimizing reflows.
 *
 * If the nodes differ in type (`nodeName`), the `left` node is replaced by the
 * `right` node in the `parent` container.
 *
 * For element nodes, attributes and children are synchronized:
 * - Attributes present on `left` but missing on `right` are removed.
 * - Attributes on `right` are added or updated on `left`.
 * - Child nodes are recursively replaced to match `right`.
 * - State is disabled on the `left` element before changes.
 *
 * For text and other nodes, nodeValue, value, and checked properties are
 * updated if different.
 *
 * @param parent The parent node containing the `left` node.
 * @param left The node to be updated or replaced.
 * @param right The node to match.
 */
const replace_node = (
  parent: ParentNode,
  left: ChildNode,
  right: ChildNode
) => {
  if (left.nodeName == right.nodeName) {
    if (left.nodeValue != right.nodeValue) {
      left.nodeValue = right.nodeValue;
    }
    if (left.value != right.value) {
      left.value = right.value;
    }
    if (left.checked != right.checked) {
      left.checked = right.checked;
    }
    if (left instanceof Element) {
      disable_state(left);
      let attrs = left.attributes;
      let i = attrs.length;
      let len, attr, name, value;
      while (i--) {
        attr = attrs[i]!;
        if (!(right as Element).hasAttribute(attr.name)) {
          left.removeAttributeNode(attr);
        }
      }
      attrs = (right as Element).attributes;
      i = 0;
      len = attrs.length;
      for (; i < len; ++i) {
        attr = attrs[i]!;
        name = attr.name;
        value = attr.value;
        if ((attr = left.getAttributeNode(name))) {
          if (attr.value != value) {
            attr.value = value;
          }
        } else {
          left.setAttribute(name, value);
        }
      }
      replace_children(left, Array.from(right.childNodes));
    }
  } else {
    parent.replaceChild(right, left);
  }
};

/**
 * Replaces an element (`el`) with zero or more nodes (`nodes`), attempting to
 * minimize DOM operations by reusing a matching node from the replacement list.
 *
 * If any node in `nodes` shares the same `nodeName` and `key` attribute as
 * `el`, that node is reused by calling `replace_node` to update `el` in place.
 * The remaining nodes are inserted before or after `el` as appropriate.
 *
 * If no matching node is found, `el` is replaced by the first node in `nodes`,
 * and the rest are inserted after it.
 *
 * If `nodes` is empty, `el` is removed from its parent.
 *
 * @param el The DOM element to replace.
 * @param nodes An array of nodes to replace `el` with.
 */
export const replace_with = (el: Element, nodes: ChildNode[]) => {
  const parent = el.parentNode!;
  let len = nodes.length;
  if (len) {
    let i = 0;
    let node: ChildNode | undefined;
    for (; i < len; ++i) {
      node = nodes[i]!;
      if (
        node.nodeName == el.nodeName &&
        node.getAttribute?.("key") == el.getAttribute("key")
      ) {
        break;
      }
      node = undefined;
    }
    if (node) {
      if (i) {
        el.before.apply(el, nodes.slice(0, i));
      }
      if (++i < len) {
        el.after.apply(el, nodes.slice(i));
      }
      replace_node(parent, el, node);
    } else {
      if (len > 1) {
        el.after.apply(el, nodes.slice(1));
      }
      replace_node(parent, el, nodes[0]!);
    }
  } else {
    parent.removeChild(el);
  }
};

/**
 * Efficiently updates an element's children to match a new set of nodes.
 *
 * Attempts to minimize DOM operations by reusing existing child nodes that
 * share the same `nodeName` and `key` attribute as the corresponding node
 * in the new set. Matching nodes are updated in place via `replace_node`.
 *
 * New nodes not matching any existing child are inserted, and excess
 * children are removed.
 *
 * @param el The element whose children will be replaced.
 * @param nodes The new set of nodes to set as children.
 */
export const replace_children = (el: Element, nodes: ChildNode[]) => {
  const childNodes = el.childNodes;
  const len = nodes.length;
  let len2 = childNodes.length;
  let i = 0;
  let node, j, childNode;
  for (; i < len; ++i) {
    node = nodes[i]!;
    j = i;
    childNode = undefined;
    for (; j < len2; ++j) {
      childNode = childNodes[j]!;
      if (
        node.nodeName == childNode.nodeName &&
        node.getAttribute?.("key") == childNode.getAttribute?.("key")
      ) {
        break;
      }
      childNode = undefined;
    }
    if (childNode) {
      if (j !== i) {
        el.insertBefore(childNode, childNodes[i]!);
      }
      replace_node(el, childNodes[i]!, node);
    } else if (i < len2++) {
      el.insertBefore(node, childNodes[i]!);
    } else {
      el.appendChild(node);
    }
  }
  while (len2 > len) {
    el.removeChild(childNodes[--len2]!);
  }
};

/* c8 ignore next */
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;
  const container1 = document.createElement("div");
  const container2 = document.createElement("div");

  describe("replace", () => {
    it("replace_with removes on empty list", () => {
      container1.innerHTML = '<div value="foo"></div>';
      const [left] = container1.childNodes as unknown as [Element];
      expect(container1.childNodes.length).toBe(1);
      replace_with(left, []);
      expect(container1.childNodes.length).toBe(0);
    });

    it("replace_with no key", () => {
      container1.innerHTML = '<div value="foo"></div>';
      container2.innerHTML = '<div name="foo"></div>';
      const [left] = container1.childNodes as unknown as [Element];
      const [right] = container2.childNodes as unknown as [Element];
      expect(left).not.toMatchHTML(right);
      replace_with(left, [right]);
      expect(left).toMatchHTML(right);
    });

    it("replace_with not matching key", () => {
      container1.innerHTML = '<div value="foo"></div>';
      container2.innerHTML =
        '<div key="key1" name="foo"></div>' + '<span class="test"></span>';
      const [left] = container1.childNodes as unknown as [Element];
      const [right, span] = container2.childNodes as unknown as [
        Element,
        Element
      ];
      expect(left).not.toMatchHTML(right);
      replace_with(left, [right, span]);
      expect(left).toMatchHTML(right);
      expect(container1.childNodes.length).toBe(2);
      expect(container1.childNodes[1]).toMatchHTML(span);
    });

    it("replace_with matching key", () => {
      container1.innerHTML =
        "<textarea></textarea>" + '<div key="key1" value="foo"></div>';
      container2.innerHTML =
        "<button></button>" +
        '<div key="key1" name="foo"></div>' +
        '<span class="test"></span>';
      const [textarea, orig] = container1.childNodes as unknown as [
        Element,
        Element
      ];
      const [button, repl, span] = container2.childNodes as unknown as [
        Element,
        Element,
        Element
      ];
      expect(orig).not.toMatchHTML(repl);
      replace_with(orig, Array.from(container2.childNodes));
      expect(orig).toMatchHTML(repl);
      expect(container1.childNodes.length).toBe(4);
      expect(container1.childNodes[0]).toMatchHTML(textarea);
      expect(container1.childNodes[1]).toMatchHTML(button);
      expect(container1.childNodes[3]).toMatchHTML(span);
    });

    it("replace_children before", () => {
      container1.innerHTML =
        "<textarea></textarea>" +
        '<div key="key1" value="foo"></div>' +
        "<textarea></textarea>";
      container2.innerHTML =
        "<button></button>" +
        '<span class="test"></span>' +
        '<div key="key1" name="foo"></div>';
      replace_children(container1, Array.from(container2.childNodes));
      container2.innerHTML =
        "<button></button>" +
        '<span class="test"></span>' +
        '<div key="key1" name="foo"></div>';
      expect(container1).toMatchHTML(container2);
    });

    it("replace_children append", () => {
      container1.innerHTML = '<span class="test"></span>';
      container2.innerHTML =
        '<span class="test"></span>' + '<div key="key1" name="foo"></div>';
      replace_children(container1, Array.from(container2.childNodes));
      container2.innerHTML =
        '<span class="test"></span>' + '<div key="key1" name="foo"></div>';
      expect(container1).toMatchHTML(container2);
    });

    it("replace_node different type", () => {
      container1.innerHTML = "<div></div>";
      container2.innerHTML = "<span></span>";
      const [div] = container1.childNodes as unknown as [Element];
      const [span] = container2.childNodes as unknown as [Element];
      expect(container1.childNodes[0]).not.toMatchHTML(span);
      replace_node(container1, div, span);
      expect(container1.childNodes[0]).toMatchHTML(span);
    });

    it("replace_node text", () => {
      container1.innerHTML = "foo";
      container2.innerHTML = "bar";
      const [text1] = container1.childNodes as unknown as [ChildNode];
      const [text2] = container2.childNodes as unknown as [ChildNode];
      expect(container1.childNodes[0]!.nodeValue).toBe("foo");
      replace_node(container1, text1, text2);
      expect(container1.childNodes[0]!.nodeValue).toBe("bar");
    });

    it("replace_node value", () => {
      container1.innerHTML = '<input value="foo">';
      container2.innerHTML = '<input value="bar">';
      const [input1] = container1.childNodes as unknown as [Element];
      const [input2] = container2.childNodes as unknown as [Element];
      expect(container1.childNodes[0]!.value).toBe("foo");
      replace_node(container1, input1, input2);
      expect(container1.childNodes[0]!.value).toBe("bar");
    });

    it("replace_node checked", () => {
      container1.innerHTML = '<input type="checkbox">';
      container2.innerHTML = '<input type="checkbox" checked>';
      const [input1] = container1.childNodes as unknown as [Element];
      const [input2] = container2.childNodes as unknown as [Element];
      expect(container1.childNodes[0]!.checked).toBe(false);
      replace_node(container1, input1, input2);
      expect(container1.childNodes[0]!.checked).toBe(true);
    });
  });
}
