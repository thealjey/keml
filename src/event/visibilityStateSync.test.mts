import { describe, expect, it, vi } from "vitest";

vi.mock("../render/data.mts", () => ({
  markStateDirty: vi.fn(),
}));

import { markStateDirty } from "../render/data.mts";
import { onIntersects } from "./visibilityStateSync.mts";

describe("onIntersects", () => {
  it("sets isIntersecting on targets and marks state dirty", () => {
    const el1 = document.createElement("div") as any;
    const el2 = document.createElement("div") as any;

    const entries = [
      { target: el1, isIntersecting: true },
      { target: el2, isIntersecting: false },
    ] as IntersectionObserverEntry[];

    onIntersects(entries);

    expect(el1.isIntersecting).toBe(true);
    expect(el2.isIntersecting).toBe(false);

    expect(markStateDirty).toHaveBeenCalled();
  });

  it("calls markStateDirty even with empty entries", () => {
    onIntersects([] as IntersectionObserverEntry[]);

    expect(markStateDirty).toHaveBeenCalled();
  });
});
