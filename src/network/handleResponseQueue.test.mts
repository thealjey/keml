import { describe, expect, it, vi } from "vitest";
import { pushRenderPayload } from "../render/data.mts";
import { handleResponseQueue } from "./handleResponseQueue.mts";
import { isElementLoading } from "./isElementLoading.mts";

vi.mock("../render/data.mts", () => ({
  pushRenderPayload: vi.fn(),
}));

vi.mock("./isElementLoading.mts", () => ({
  isElementLoading: vi.fn(),
}));

describe("handleResponseQueue", () => {
  it("pushes the queued XHR payload and clears xhr when the element is not loading", () => {
    const ownerElement = {
      xhr: ["response", "payload"],
    } as unknown as RenderPayload["ownerElement"];

    vi.mocked(isElementLoading).mockReturnValue(false);

    handleResponseQueue({
      target: { ownerElement } as RenderPayload,
    });

    expect(ownerElement.xhr).toBeUndefined();
    expect(pushRenderPayload).toHaveBeenCalledOnce();
    expect(pushRenderPayload).toHaveBeenCalledWith("response", "payload");
  });

  it("does nothing when the element is loading", () => {
    const xhr = ["response", "payload"];
    const ownerElement = {
      xhr,
    } as unknown as RenderPayload["ownerElement"];

    vi.mocked(isElementLoading).mockReturnValue(true);

    handleResponseQueue({
      target: { ownerElement } as RenderPayload,
    });

    expect(ownerElement.xhr).toBe(xhr);
    expect(pushRenderPayload).not.toHaveBeenCalled();
  });

  it("does nothing when there is no queued xhr", () => {
    const ownerElement = {
      xhr: undefined,
    } as unknown as RenderPayload["ownerElement"];

    handleResponseQueue({
      target: { ownerElement } as RenderPayload,
    });

    expect(isElementLoading).not.toHaveBeenCalled();
    expect(pushRenderPayload).not.toHaveBeenCalled();
  });
});
