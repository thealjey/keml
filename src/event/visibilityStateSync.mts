import { markStateDirty } from "../render/data.mts";

/**
 * IntersectionObserver callback that synchronizes intersection state.
 *
 * Updates each observed target with its current intersection status
 * and marks the application state as needing re-evaluation.
 *
 * @param entries - Array of IntersectionObserver entries describing visibility
 *                  changes.
 */
export const onIntersects = (entries: IntersectionObserverEntry[]) => {
  for (const { target, isIntersecting } of entries) {
    target.isIntersecting = isIntersecting;
  }
  markStateDirty();
};

export const intersectsObserver = new IntersectionObserver(onIntersects);
