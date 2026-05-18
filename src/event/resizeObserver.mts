import { markRefDirty } from "../render/data.mts";

/**
 * Processes ResizeObserver entries and updates the stored size snapshot for
 * elements that are considered layout-active or have non-zero measurable size.
 *
 * A change is propagated only when at least one entry satisfies the update
 * condition, in which case the reference system is marked dirty.
 */
export const onResize = (entries: ResizeObserverEntry[]) => {
  let target, width, height;
  let changed = false;

  for (const entry of entries) {
    ({
      target,
      contentRect: { width, height },
    } = entry);
    if (width || height || (target as HTMLElement).offsetParent != null) {
      target.sizeEntry = entry;
      changed = true;
    }
  }

  changed && markRefDirty();
};

export const resizeObserver = new ResizeObserver(onResize);
