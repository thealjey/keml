import { attrRules, type Context } from "./attrRules.mts";
import { getLifecyclePhase } from "./data.mts";

/**
 * Creates a dispatcher that applies attribute lifecycle rules for a given
 * action phase.
 *
 * Generates a function that evaluates registered attribute rules and invokes
 * the appropriate lifecycle callback (`added`, `removed`, or `changed`) based
 * on:
 * - Attribute name matching rules
 * - Optional gate conditions
 * - Optional lifecycle phase constraints
 * - The provided lifecycle action
 *
 * @param lifecycleAction - Encoded lifecycle state:
 *  - `0` → attribute added
 *  - `1` → attribute removed
 *  - `2` → attribute changed
 * @returns A function that dispatches rules for a given element and attribute
 *          name.
 */
const dispatchAttrRules =
  (lifecycleAction: 0 | 1 | 2 | 3) =>
  (el: Element, name: string, context?: Context) => {
    for (const {
      match,
      gate,
      phase,
      added,
      removed,
      changed,
      serialize,
    } of attrRules) {
      if (
        (phase == null || phase === getLifecyclePhase()) &&
        (!match ||
          (typeof match === "string" ? name === match
          : Array.isArray(match) ? match.includes(name)
          : match.test(name))) &&
        (!gate || gate(el, name, context))
      ) {
        (lifecycleAction ?
          lifecycleAction === 1 ? removed
          : lifecycleAction === 2 ? changed
          : serialize
        : added)?.(el, name, context);
      }
    }
  };

export const attrDispatchers = [
  dispatchAttrRules(0),
  dispatchAttrRules(1),
  dispatchAttrRules(2),
  dispatchAttrRules(3),
] as const;

/**
 * Traverses a list of nodes and applies lifecycle dispatching to each node's
 * attributes.
 *
 * Walks through each element node and all descendant elements, invoking the
 * appropriate lifecycle handler for every attribute encountered on each node.
 *
 * @param nodes - A collection of DOM nodes to traverse.
 * @param lifecycleAction - The lifecycle phase applied to each node:
 *  - `0` → node addition phase
 *  - `1` → node removal phase
 */
export const traverseAttributes = (
  nodes: ArrayLike<Node>,
  lifecycleAction: 0 | 1 | 3,
  context?: Context,
) => {
  for (
    let i = 0,
      l = nodes.length,
      node,
      it,
      ownerElement,
      name,
      handler = attrDispatchers[lifecycleAction];
    i < l;
    ++i
  ) {
    if ((node = nodes[i]!) instanceof Element) {
      it = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);

      do {
        for ({ ownerElement, name } of (node as Element).attributes) {
          handler(ownerElement!, name, context);
        }
      } while ((node = it.nextNode() as Element | null));
    }
  }
};
