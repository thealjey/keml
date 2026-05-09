let lifecyclePhase = 0;
let globalEventListener: EventListener;

/**
 * Sets the current lifecycle phase used by attribute rule evaluation.
 *
 * Updates the internal phase value that is used to control when certain
 * attribute rules are allowed to execute.
 *
 * @param phase - The lifecycle phase to set.
 * @returns The phase value that was set.
 */
export const setLifecyclePhase = (phase: number) => (lifecyclePhase = phase);

/**
 * Returns the current lifecycle phase used by attribute rule evaluation.
 *
 * @returns The current lifecycle phase value.
 */
export const getLifecyclePhase = () => lifecyclePhase;

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
