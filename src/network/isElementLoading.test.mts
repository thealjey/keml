import { describe, expect, it } from "vitest";
import { isElementLoading } from "./isElementLoading.mts";

describe("isElementLoading", () => {
  it("returns false when there are no xhr requests", () => {
    const el = {
      xhr: undefined,
    } as unknown as Element;

    expect(isElementLoading(el)).toBe(false);
  });

  it("returns false when xhr is an empty array", () => {
    const el = {
      xhr: [],
    } as unknown as Element;

    expect(isElementLoading(el)).toBe(false);
  });

  it("returns false when all xhr requests are complete", () => {
    const el = {
      xhr: [{ readyState: 4 }, { readyState: 4 }, { readyState: 4 }],
    } as unknown as Element;

    expect(isElementLoading(el)).toBe(false);
  });

  it("returns true when an xhr request is not complete", () => {
    const el = {
      xhr: [{ readyState: 4 }, { readyState: 2 }, { readyState: 4 }],
    } as unknown as Element;

    expect(isElementLoading(el)).toBe(true);
  });

  it("returns true when the first xhr request is not complete", () => {
    const el = {
      xhr: [{ readyState: 2 }, { readyState: 4 }, { readyState: 4 }],
    } as unknown as Element;

    expect(isElementLoading(el)).toBe(true);
  });

  it("returns true when the last xhr request is not complete", () => {
    const el = {
      xhr: [{ readyState: 4 }, { readyState: 4 }, { readyState: 2 }],
    } as unknown as Element;

    expect(isElementLoading(el)).toBe(true);
  });
});
