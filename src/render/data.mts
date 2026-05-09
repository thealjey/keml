const renderPayloadStack: RenderPayload[] = [];
const oneTimeElementStack: Element[] = [];
const resettableElementStack: Element[] = [];
const scrollableElementStack: Element[] = [];
const discoverableElementStack: Element[] = [];
let currentFocusElement: Element | undefined;
let stateDirty = false;

export const ifColonElements = new Set<Element>();
export const ifElements = new Set<Element>();
export const renderElements = new Set<Element>();

/**
 * Pushes a render payload onto the render queue.
 *
 * This function enqueues a payload for later processing by the rendering system.
 *
 * @param payload - The render payload to be added to the queue.
 * @returns The new length of the render payload stack.
 */
export const pushRenderPayload = (payload: RenderPayload) =>
  renderPayloadStack.push(payload);

/**
 * Removes and returns the most recent render payload from the render queue.
 *
 * @returns The last render payload in the stack, or `undefined` if the stack is
 *          empty.
 */
export const popRenderPayload = () => renderPayloadStack.pop();

/**
 * Adds an element to the one-time execution stack.
 *
 * The element is stored for single-use processing and managed by the internal
 * one-time execution mechanism.
 *
 * @param el - The DOM element to be stored for one-time handling.
 * @returns The new length of the one-time element stack.
 */
export const pushOneTimeElement = (el: Element) => oneTimeElementStack.push(el);

/**
 * Removes and returns the most recently added one-time element.
 *
 * @returns The last element in the one-time stack, or `undefined` if empty.
 */
export const popOneTimeElement = () => oneTimeElementStack.pop();

/**
 * Adds an element to the resettable element stack.
 *
 * The element is stored for later reset-related processing.
 *
 * @param el - The DOM element to be added to the resettable stack.
 * @returns The new length of the resettable element stack.
 */
export const pushResettableElement = (el: Element) =>
  resettableElementStack.push(el);

/**
 * Removes and returns the most recently added resettable element.
 *
 * @returns The last element in the resettable stack, or `undefined` if the
 *          stack is empty.
 */
export const popResettableElement = () => resettableElementStack.pop();

/**
 * Adds an element to the scrollable element stack.
 *
 * The element is stored for later scroll-related processing.
 *
 * @param el - The DOM element to be added to the scrollable stack.
 * @returns The new length of the scrollable element stack.
 */
export const pushScrollableElement = (el: Element) =>
  scrollableElementStack.push(el);

/**
 * Removes and returns the most recently added scrollable element.
 *
 * @returns The last element in the scrollable stack, or `undefined` if the
 *          stack is empty.
 */
export const popScrollableElement = () => scrollableElementStack.pop();

/**
 * Clears the currently stored focus element.
 *
 * Resets the internal focus reference to `undefined`.
 *
 * @returns `undefined`
 */
export const clearFocusElement = () => (currentFocusElement = undefined);

/**
 * Retrieves the currently focused element.
 *
 * @returns The element currently stored as the focus target, or `undefined` if
 *          none is set.
 */
export const getFocusElement = () => currentFocusElement;

/**
 * Sets the currently focused element reference.
 *
 * Updates the internal focus state to point to the provided element.
 *
 * @param el - The element to mark as the current focus target.
 * @returns The element that was set as the current focus target.
 */
export const setFocusElement = (el: Element) => (currentFocusElement = el);

/**
 * Marks the internal state as dirty.
 *
 * Sets a flag indicating that state-dependent processing should be re-evaluated.
 *
 * @returns `true` after marking the state as dirty.
 */
export const markStateDirty = () => (stateDirty = true);

/**
 * Indicates whether the internal state is currently marked as dirty.
 *
 * @returns `true` if the state is dirty and requires re-evaluation, otherwise
 *          `false`.
 */
export const isStateDirty = () => stateDirty;

/**
 * Clears the internal dirty-state flag.
 *
 * Resets the state tracking indicator to `false`, marking the system as clean.
 *
 * @returns `false` after clearing the dirty state.
 */
export const clearStateDirty = () => (stateDirty = false);

/**
 * Pushes an element onto the stack of discoverable elements.
 *
 * @param el - The DOM element to add to the discoverable stack.
 * @returns The new length of the stack after the element is added.
 */
export const pushDiscoverableElement = (el: Element) =>
  discoverableElementStack.push(el);

/**
 * Removes and returns the most recently added discoverable element.
 *
 * This follows LIFO (last-in, first-out) behavior from the internal
 * `discoverableElementStack`.
 *
 * @returns The removed element, or `undefined` if the stack is empty.
 */
export const popDiscoverableElement = () => discoverableElementStack.pop();
