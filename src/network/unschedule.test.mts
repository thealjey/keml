import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { unschedule } from "./unschedule.mts";

describe("unschedule", () => {
  const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

  beforeEach(() => {
    clearTimeoutSpy.mockClear();
  });

  afterEach(() => {
    clearTimeoutSpy.mockClear();
  });

  it("clears existing timeout and resets timeoutId to undefined", () => {
    const el = {
      timeoutId: 123 as unknown as ReturnType<typeof setTimeout>,
    } as Element & { timeoutId?: ReturnType<typeof setTimeout> };

    unschedule(el);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).toHaveBeenCalledWith(123);
    expect(el.timeoutId).toBeUndefined();
  });

  it("still calls clearTimeout even when timeoutId is undefined", () => {
    const el = {
      timeoutId: undefined,
    } as Element & { timeoutId?: ReturnType<typeof setTimeout> };

    unschedule(el);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).toHaveBeenCalledWith(undefined);
    expect(el.timeoutId).toBeUndefined();
  });
});
