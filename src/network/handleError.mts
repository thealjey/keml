import { failureEvent, markStateDirty } from "../render/data.mts";

/**
 * Handles a network error by marking the associated element as being
 * in an error state, marking the application state as dirty, and
 * dispatching the failure event.
 *
 * @param payload - The render payload associated with the network error.
 */
export const handleError = ({
  target: { ownerElement },
}: {
  target: RenderPayload;
}) => {
  ownerElement.isError = true;
  markStateDirty();
  ownerElement.dispatchEvent(failureEvent);
};
