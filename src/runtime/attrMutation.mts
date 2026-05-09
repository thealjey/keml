import { attrDispatchers, traverseAttributes } from "./attrExecutor.mts";

/**
 * Handles DOM mutation records and dispatches corresponding lifecycle updates.
 *
 * Processes added and removed nodes by traversing their attribute trees and
 * applying the appropriate lifecycle dispatchers. Also handles attribute
 * changes on mutated elements by selecting the correct lifecycle action
 * based on previous and current attribute state.
 *
 * @param records - Array of MutationObserver records describing DOM changes.
 */
export const onMutation = (records: MutationRecord[]) => {
  for (const {
    addedNodes,
    attributeName,
    oldValue,
    removedNodes,
    target,
  } of records) {
    traverseAttributes(removedNodes, 1);
    traverseAttributes(addedNodes, 0);

    if (attributeName) {
      attrDispatchers[
        (target as Element).hasAttribute(attributeName) ?
          oldValue == null ?
            0
          : 2
        : oldValue == null ? 2
        : 1
      ](target as Element, attributeName);
    }
  }
};

export const mutationObserver = new MutationObserver(onMutation);
