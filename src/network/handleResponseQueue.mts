import { pushRenderPayload } from "../render/data.mts";
import { isElementLoading } from "./isElementLoading.mts";

/**
 * Handles queued XHR requests after an element finishes loading.
 *
 * If the element has queued requests and is no longer loading, the requests
 * are removed from the element and pushed to the render payload queue.
 *
 * @param payload - The render payload associated with the element.
 */
export const handleResponseQueue = ({
  target: { ownerElement },
}: {
  target: RenderPayload;
}) => {
  const xhr = ownerElement.xhr;
  if (xhr && !isElementLoading(ownerElement)) {
    ownerElement.xhr = undefined;
    pushRenderPayload(...xhr);
  }
};
