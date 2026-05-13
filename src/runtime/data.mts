let globalEventListener: EventListener;

/**
 * Sets the global event listener used by the system.
 *
 * @param eventListener - The event listener to be stored as the global handler.
 * @returns The same event listener that was passed in.
 */
export const setEventListener = (eventListener: EventListener) =>
  (globalEventListener = eventListener);

/**
 * Retrieves the currently registered global event listener.
 *
 * @returns The currently set global event listener, or `undefined` if none has
 *          been set.
 */
export const getEventListener = () => globalEventListener;
