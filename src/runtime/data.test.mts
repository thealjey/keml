import { describe, expect, it } from "vitest";
import {
  getEventListener,
  getLifecyclePhase,
  setEventListener,
  setLifecyclePhase,
} from "./data.mts";

describe("lifecyclePhase", () => {
  it("returns initial lifecycle phase as 0", () => {
    expect(getLifecyclePhase()).toBe(0);
  });

  it("sets lifecycle phase", () => {
    setLifecyclePhase(5);

    expect(getLifecyclePhase()).toBe(5);
  });

  it("overwrites lifecycle phase", () => {
    setLifecyclePhase(1);
    setLifecyclePhase(2);

    expect(getLifecyclePhase()).toBe(2);
  });

  it("allows resetting back to 0", () => {
    setLifecyclePhase(10);
    setLifecyclePhase(0);

    expect(getLifecyclePhase()).toBe(0);
  });

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
