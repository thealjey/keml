import { describe, expect, it, vi } from "vitest";
import { failureEvent, markStateDirty } from "../render/data.mts";
import { handleTimeout } from "./handleTimeout.mts";

vi.mock("../render/data.mts", () => ({
  failureEvent: new Event("failure"),
  markStateDirty: vi.fn(),
}));

describe("handleTimeout", () => {
  it("marks the owner element as errored and timed out, marks the state dirty, and dispatches both events", () => {
    const ownerElement = new EventTarget() as RenderPayload["ownerElement"];
    const failureListener = vi.fn();
    const timeoutListener = vi.fn();

    ownerElement.addEventListener(failureEvent.type, failureListener);
    ownerElement.addEventListener("timeout", timeoutListener);

    handleTimeout({
      target: { ownerElement } as RenderPayload,
    });

    expect(ownerElement.isError).toBe(true);
    expect(ownerElement.isTimeout).toBe(true);
    expect(markStateDirty).toHaveBeenCalledOnce();
    expect(failureListener).toHaveBeenCalledOnce();
    expect(timeoutListener).toHaveBeenCalledOnce();
  });
});
