let transitioning = false;

/**
 * Queue of pending DOM patch operations that will be executed
 * inside a single View Transition batch.
 */
export const transitions: [
  (node: Element, nodes: ChildNode[]) => void,
  Element,
  ChildNode[],
][] = [];

/**
 * Executes all queued transition batches within a single View Transition.
 *
 * All queued patchers are applied synchronously during the transition callback.
 * This drains the queue completely.
 */
const transition = () => {
  let batch:
    | [(node: Element, nodes: ChildNode[]) => void, Element, ChildNode[]]
    | undefined;
  while ((batch = transitions.pop())) {
    batch[0](batch[1], batch[2]);
  }
};

/**
 * Resets the transition lock after a View Transition finishes.
 */
const concludeTransition = () => {
  transitioning = false;
};

/**
 * Starts a View Transition if one is not already running and there are queued
 * updates.
 *
 * Only triggers when:
 * - View Transitions are supported by the browser
 * - The queue is non-empty
 * - No transition is currently active
 */
export const startTransition = () => {
  if (!transitioning && transitions.length) {
    transitioning = true;
    document
      .startViewTransition(transition)
      .finished.finally(concludeTransition);
  }
};

/**
 * Enqueues a DOM patch operation for execution during the next View Transition.
 *
 * The operation is only queued if:
 * - View Transitions are supported
 * - The element has the `transition` attribute
 */
export const addTransition = (
  patcher: (node: Element, nodes: ChildNode[]) => void,
  el: Element,
  nodes: ChildNode[],
) =>
  !!document.startViewTransition &&
  el.hasAttribute("transition") &&
  transitions.push([patcher, el, nodes]);
