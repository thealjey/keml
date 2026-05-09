import { navigateElements } from "./data.e.mts";

const navigateEvent = new Event("navigate");

/**
 * Dispatches a navigation event to all registered listeners.
 *
 * Triggers a navigation-related event across all currently registered targets.
 * This is used to notify all subscribers that a navigation action should be
 * handled.
 */
export const dispatchNavigate = () => {
  for (const el of navigateElements) {
    el.dispatchEvent(navigateEvent);
  }
};
