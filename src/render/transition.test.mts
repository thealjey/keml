import { beforeEach, describe, expect, it, vi } from "vitest";
import { addTransition, startTransition, transitions } from "./transition.mts";

let startViewTransitionMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  transitions.length = 0;

  startViewTransitionMock = vi.fn((cb: () => void) => {
    cb();
    return {
      finished: Promise.resolve(),
    };
  });

  Object.defineProperty(document, "startViewTransition", {
    value: startViewTransitionMock,
    configurable: true,
  });
});

describe("transition.mts", () => {
  it("does not queue when element lacks transition attribute", () => {
    const el = document.createElement("div");
    const patcher = vi.fn();

    addTransition(patcher, el, []);

    expect(transitions.length).toBe(0);
  });

  it("queues when element has transition attribute", () => {
    const el = document.createElement("div");
    el.setAttribute("transition", "");

    const patcher = vi.fn();

    addTransition(patcher, el, []);

    expect(transitions.length).toBe(1);
  });

  it("does not start transition when queue is empty", () => {
    const el = document.createElement("div");
    const patcher = vi.fn();

    addTransition(patcher, el, []);

    startTransition();

    expect(startViewTransitionMock).not.toHaveBeenCalled();
  });

  it("starts transition and executes queued patchers", () => {
    const el = document.createElement("div");
    el.setAttribute("transition", "");

    const patcher = vi.fn();

    addTransition(patcher, el, []);

    startTransition();

    expect(startViewTransitionMock).toHaveBeenCalledTimes(1);
    expect(patcher).toHaveBeenCalledTimes(1);
    expect(patcher).toHaveBeenCalledWith(el, []);
  });

  it("clears queue after transition", () => {
    const el = document.createElement("div");
    el.setAttribute("transition", "");

    const patcher = vi.fn();

    addTransition(patcher, el, []);

    startTransition();

    expect(transitions.length).toBe(0);
  });

  it("skips when startViewTransition is missing", () => {
    delete (document as any).startViewTransition;

    const el = document.createElement("div");
    el.setAttribute("transition", "");

    const patcher = vi.fn();

    addTransition(patcher, el, []);

    startTransition();

    expect(transitions.length).toBe(0);
    expect(startViewTransitionMock).not.toHaveBeenCalled();
  });
});
