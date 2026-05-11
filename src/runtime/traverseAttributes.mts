import { type Context } from "./attrRules.mts";
import { executeRules } from "./executeRules.mts";

/**
 * Executes rules for a list of nodes.
 *
 * @param mask Bitmask selecting the needed rule functionality
 * @param nodes A list of nodes
 * @param context Optional execution context passed to rules
 */
export const traverseAttributes = (
  mask: number,
  nodes: ArrayLike<Node>,
  context?: Context,
) => {
  for (let i = 0, l = nodes.length, node, it, attr; i < l; ++i) {
    if ((node = nodes[i]!) instanceof Element) {
      it = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);

      do {
        for (attr of node.attributes) {
          executeRules(mask, node, attr.name, context);
        }
      } while ((node = it.nextNode() as Element | null));
    }
  }
};
