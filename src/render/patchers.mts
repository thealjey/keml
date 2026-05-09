import { findFirstEquivalentNode } from "./findFirstEquivalentNode.mts";
import { disableState } from "./state.mts";
import { writeAttribute } from "./writeAttribute.mts";

/**
 * Reconciles and updates a DOM node to match a reference node.
 *
 * If both nodes share the same `nodeName`, the function performs a fine-grained
 * update:
 * - Synchronizes node values
 * - Updates attributes (removing and setting as needed)
 * - Patches child nodes
 *
 * If the nodes differ in type, the original node is fully replaced.
 *
 * @param left - The existing DOM node to be updated or replaced.
 * @param right - The reference DOM node representing the desired state.
 */
const replaceNode = (left: ChildNode, right: ChildNode) => {
  if (left.nodeName === right.nodeName) {
    left.nodeValue === right.nodeValue || (left.nodeValue = right.nodeValue);

    if (left instanceof Element) {
      disableState(left);

      let i = left.attributes.length;
      let attr;
      while (i--) {
        attr = left.attributes[i]!;
        (right as Element).hasAttribute(attr.name) ||
          writeAttribute(left, attr);
      }

      for (const { name, value } of (right as Element).attributes) {
        writeAttribute(left, name, value);
      }

      patchers.replaceChildren(left, Array.from(right.childNodes));
    }
  } else {
    left.replaceWith(right);
  }
};

/**
 * A collection of DOM patching utilities for efficiently reconciling
 * and updating node trees.
 *
 * These methods perform targeted DOM mutations to minimize unnecessary
 * node replacements while keeping structure in sync with a reference tree.
 */
export const patchers = {
  /**
   * Inserts nodes after a reference child node.
   *
   * @param el - Reference child node.
   * @param nodes - Nodes to insert.
   */
  after(el: ChildNode, nodes: readonly ChildNode[]) {
    el.after(...nodes);
  },

  /**
   * Appends nodes to a parent element.
   *
   * @param el - Parent element.
   * @param nodes - Nodes to append.
   */
  append(el: Element, nodes: readonly ChildNode[]) {
    el.append(...nodes);
  },

  /**
   * Inserts nodes before a reference child node.
   *
   * @param el - Reference child node.
   * @param nodes - Nodes to insert.
   */
  before(el: ChildNode, nodes: readonly ChildNode[]) {
    el.before(...nodes);
  },

  /**
   * Prepends nodes to a parent element.
   *
   * @param el - Parent element.
   * @param nodes - Nodes to prepend.
   */
  prepend(el: Element, nodes: readonly ChildNode[]) {
    el.prepend(...nodes);
  },

  /**
   * Replaces a node with a sequence of nodes, attempting to reuse
   * existing equivalents when possible.
   *
   * @param el - Node to be replaced.
   * @param nodes - Replacement nodes.
   */
  replaceWith(el: ChildNode, nodes: readonly ChildNode[]) {
    const len = nodes.length;

    if (len) {
      const pair = findFirstEquivalentNode(nodes, el);

      let node, i;
      if (pair) {
        [node, i] = pair;
        i && el.before(...nodes.slice(0, i));
        ++i;
      } else {
        node = nodes[0]!;
        i = 1;
      }

      len > i && el.after(...nodes.slice(i));
      replaceNode(el, node);
    } else {
      el.remove();
    }
  },

  /**
   * Replaces all child nodes of an element with a new set of nodes,
   * attempting to preserve and reconcile matching nodes where possible.
   *
   * @param el - Parent element whose children will be reconciled.
   * @param nodes - Desired child nodes.
   */
  replaceChildren(el: Element, nodes: readonly ChildNode[]) {
    const childNodes = el.childNodes;
    const len = nodes.length;
    let len2 = childNodes.length;
    let i = 0;
    let node, pair;

    for (; i < len; ++i) {
      pair = findFirstEquivalentNode(childNodes, (node = nodes[i]!), i);

      if (pair) {
        pair[1] === i || el.insertBefore(pair[0], childNodes[i]!);
        replaceNode(childNodes[i]!, node);
      } else if (i < len2++) {
        el.insertBefore(node, childNodes[i]!);
      } else {
        el.appendChild(node);
      }
    }

    while (len2 > len) {
      el.removeChild(childNodes[--len2]!);
    }
  },
};
