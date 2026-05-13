import { describe, expect, it } from "vitest";
import { getEventListener, setEventListener } from "./data.mts";

describe("data", () => {
  it("stores and retrieves the event listener", () => {
    const listener = () => {};

    setEventListener(listener);

    expect(getEventListener()).toBe(listener);
  });

  it("overwrites the previous event listener", () => {
    const first = () => {};
    const second = () => {};

    setEventListener(first);
    setEventListener(second);

    expect(getEventListener()).toBe(second);
  });
});
