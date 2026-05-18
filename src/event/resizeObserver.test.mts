import { beforeEach, describe, expect, it, vi } from "vitest";
import { onResize } from "./resizeObserver.mts";

vi.mock("../render/data.mts", () => {
  return {
    markRefDirty: vi.fn(),
  };
});

import { markRefDirty } from "../render/data.mts";

function makeEntry({
  width = 0,
  height = 0,
  offsetParent = null,
}: {
  width?: number;
  height?: number;
  offsetParent?: any;
}): ResizeObserverEntry {
  const target: any = {
    offsetParent,
    sizeEntry: null,
  };

  return {
    target,
    contentRect: { width, height } as DOMRectReadOnly,
  } as ResizeObserverEntry;
}

describe("onResize", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates sizeEntry when element has size", () => {
    const entry = makeEntry({ width: 100, height: 50 });

    onResize([entry]);

    expect(entry.target.sizeEntry).toBe(entry);
    expect(markRefDirty).toHaveBeenCalled();
  });

  it("updates sizeEntry when element is layout-active even if size is 0", () => {
    const entry = makeEntry({
      width: 0,
      height: 0,
      offsetParent: {},
    });

    onResize([entry]);

    expect(entry.target.sizeEntry).toBe(entry);
    expect(markRefDirty).toHaveBeenCalled();
  });

  it("ignores entries with zero size and no layout participation", () => {
    const entry = makeEntry({ width: 0, height: 0, offsetParent: null });

    onResize([entry]);

    expect(entry.target.sizeEntry).toBe(null);
    expect(markRefDirty).not.toHaveBeenCalled();
  });

  it("marks dirty only once even with multiple valid entries", () => {
    const a = makeEntry({ width: 100, height: 0 });
    const b = makeEntry({ width: 0, height: 0, offsetParent: {} });

    onResize([a, b]);

    expect(markRefDirty).toHaveBeenCalledTimes(1);
    expect(a.target.sizeEntry).toBe(a);
    expect(b.target.sizeEntry).toBe(b);
  });
});
