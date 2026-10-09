import { describe, expect, it, vi } from "vitest";
import { failureEvent, markStateDirty } from "../render/data.mts";
import { handleError } from "./handleError.mts";

vi.mock("../render/data.mts", () => ({
  failureEvent: new Event("failure"),
  markStateDirty: vi.fn(),
}));

describe("handleError", () => {
  it("marks the owner element as errored, marks the state dirty, and dispatches the failure event", () => {
    const ownerElement = new EventTarget() as RenderPayload["ownerElement"];
    const failureListener = vi.fn();

    ownerElement.addEventListener(failureEvent.type, failureListener);

    handleError({
      target: { ownerElement } as RenderPayload,
    });

    expect(ownerElement.isError).toBe(true);
    expect(markStateDirty).toHaveBeenCalledOnce();
    expect(failureListener).toHaveBeenCalledOnce();
  });
});
