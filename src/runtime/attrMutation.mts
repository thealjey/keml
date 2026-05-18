import {
  ADDED,
  ADDED_ATTR,
  CHANGED,
  CREATED,
  DESTROYED,
  executeRules,
  REMOVED,
  REMOVED_ATTR,
} from "./executeRules.mts";
import { traverseAttributes } from "./traverseAttributes.mts";

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
    traverseAttributes(REMOVED | DESTROYED, removedNodes);
    traverseAttributes(ADDED | CREATED, addedNodes);

    if (attributeName) {
      const has = (target as Element).hasAttribute(attributeName);
      const had = oldValue != null;

      let mask;
      has && !had && (mask = ADDED | ADDED_ATTR);
      !has && had && (mask = REMOVED | REMOVED_ATTR);

      executeRules(mask ?? CHANGED, target as Element, attributeName);
    }
  }
};

export const mutationObserver = new MutationObserver(onMutation);
