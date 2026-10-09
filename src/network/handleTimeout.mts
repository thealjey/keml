import { failureEvent, markStateDirty } from "../render/data.mts";

const timeoutEvent = new Event("timeout");

/**
 * Handles a network request timeout by marking the associated element as
 * being in an error and timeout state, marking the application state as dirty,
 * and dispatching the corresponding failure and timeout events.
 *
 * @param payload - The render payload associated with the timed-out request.
 */
export const handleTimeout = ({
  target: { ownerElement },
}: {
  target: RenderPayload;
}) => {
  ownerElement.isError = ownerElement.isTimeout = true;
  markStateDirty();
  ownerElement.dispatchEvent(failureEvent);
  ownerElement.dispatchEvent(timeoutEvent);
};
