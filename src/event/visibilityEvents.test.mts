import { describe, expect, it, vi } from "vitest";
import { onConceal, onReveal } from "./visibilityEvents.mts";

describe("onReveal", () => {
  it("dispatches reveal when isIntersecting is true", () => {
    const target = { dispatchEvent: vi.fn() };

    onReveal([
      { isIntersecting: true, target } as unknown as IntersectionObserverEntry,
    ]);

    expect(target.dispatchEvent).toHaveBeenCalledTimes(1);

    const event = target.dispatchEvent.mock.calls[0]![0];
    expect(event.type).toBe("reveal");
  });

  it("does not dispatch reveal when isIntersecting is false", () => {
    const target = { dispatchEvent: vi.fn() };

    onReveal([
      { isIntersecting: false, target } as unknown as IntersectionObserverEntry,
    ]);

    expect(target.dispatchEvent).not.toHaveBeenCalled();
  });
});

describe("onConceal", () => {
  it("dispatches conceal when isIntersecting is false", () => {
    const target = { dispatchEvent: vi.fn() };

    onConceal([
      { isIntersecting: false, target } as unknown as IntersectionObserverEntry,
    ]);

    expect(target.dispatchEvent).toHaveBeenCalledTimes(1);

    const event = target.dispatchEvent.mock.calls[0]![0];
    expect(event.type).toBe("conceal");
  });

  it("does not dispatch conceal when isIntersecting is true", () => {
    const target = { dispatchEvent: vi.fn() };

    onConceal([
      { isIntersecting: true, target } as unknown as IntersectionObserverEntry,
    ]);

    expect(target.dispatchEvent).not.toHaveBeenCalled();
  });
});
