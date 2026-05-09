import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./executeRequest.mts", () => ({
  executeRequest: vi.fn(),
}));

import { executeRequest } from "./executeRequest.mts";
import { scheduleRequest } from "./scheduleRequest.mts";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("scheduleRequest", () => {
  it("calls executeRequest immediately when no throttle/debounce", () => {
    const el = document.createElement("div");

    scheduleRequest(el);

    expect(executeRequest).toHaveBeenCalledWith(el);
  });

  it("throttle schedules executeRequest only once", () => {
    const el = document.createElement("div");

    vi.useFakeTimers();

    el.setAttribute("throttle", "100");

    scheduleRequest(el);
    scheduleRequest(el); // should not schedule again

    vi.runAllTimers();

    expect(executeRequest).toHaveBeenCalledTimes(1);
    expect(executeRequest).toHaveBeenCalledWith(el);

    vi.useRealTimers();
  });

  it("debounce resets timeout and executes once", () => {
    const el = document.createElement("div");

    vi.useFakeTimers();

    el.setAttribute("debounce", "100");

    scheduleRequest(el);
    scheduleRequest(el); // resets previous timeout

    vi.runAllTimers();

    expect(executeRequest).toHaveBeenCalledTimes(1);
    expect(executeRequest).toHaveBeenCalledWith(el);

    vi.useRealTimers();
  });
});
