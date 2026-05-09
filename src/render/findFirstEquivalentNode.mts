/**
 * Finds the first node in a collection that is equivalent to a reference node.
 *
 * A node is considered equivalent if it matches both:
 * - `nodeName`
 * - optional `key` attribute (if present on either node)
 *
 * The search begins at the provided start index.
 *
 * @param nodes - A list-like collection of DOM child nodes to search within.
 * @param node - The reference node used for comparison.
 * @param start - Optional starting index for the search (default: 0).
 * @returns A tuple containing the matching node and its index, or `undefined`
 *          if no match is found.
 */
export const findFirstEquivalentNode = (
  nodes: ArrayLike<ChildNode>,
  node: ChildNode,
  start: number = 0,
) => {
  for (
    let i = start,
      len = nodes.length,
      item,
      nodeName = node.nodeName,
      key = node.getAttribute?.("key");
    i < len;
    ++i
  ) {
    if (
      nodeName === (item = nodes[i]!).nodeName &&
      key == item.getAttribute?.("key")
    ) {
      return [item, i] as const;
    }
  }
};
