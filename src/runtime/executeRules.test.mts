import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ADDED,
  CHANGED,
  executeRules,
  REMOVED,
  SERIALIZE,
} from "./executeRules.mts";

// ---- mocks ----
vi.mock("./data.mts", () => ({
  getLifecyclePhase: vi.fn(),
}));

vi.mock("./attrRules.mts", () => ({
  attrRules: [],
}));

import { attrRules } from "./attrRules.mts";
import { getLifecyclePhase } from "./data.mts";

// helper to reset mocked rules
const setRules = (rules: any[]) => {
  (attrRules as unknown as any[]).length = 0;
  (attrRules as unknown as any[]).push(...rules);
};

describe("executeRules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setRules([]);
    (getLifecyclePhase as any).mockReturnValue("phase-1");
  });

  it("calls added handler when ADDED bit is set", () => {
    const added = vi.fn();

    setRules([
      {
        match: "foo",
        added,
      },
    ]);

    const el = document.createElement("div");

    executeRules(ADDED, el, "foo");

    expect(added).toHaveBeenCalledTimes(1);
    expect(added).toHaveBeenCalledWith(el, "foo", undefined);
  });

  it("does not call handler if attribute does not match string rule", () => {
    const added = vi.fn();

    setRules([
      {
        match: "foo",
        added,
      },
    ]);

    executeRules(ADDED, document.createElement("div"), "bar");

    expect(added).not.toHaveBeenCalled();
  });

  it("supports array match rules", () => {
    const changed = vi.fn();

    setRules([
      {
        match: ["foo", "bar"],
        changed,
      },
    ]);

    const el = document.createElement("div");

    executeRules(CHANGED, el, "bar");

    expect(changed).toHaveBeenCalledTimes(1);
  });

  it("supports regex match rules", () => {
    const removed = vi.fn();

    setRules([
      {
        match: /^data-/,
        removed,
      },
    ]);

    const el = document.createElement("div");

    executeRules(REMOVED, el, "data-id");

    expect(removed).toHaveBeenCalledTimes(1);
  });

  it("respects gate function", () => {
    const added = vi.fn();
    const gate = vi.fn(() => false);

    setRules([
      {
        match: "foo",
        gate,
        added,
      },
    ]);

    executeRules(ADDED, document.createElement("div"), "foo");

    expect(gate).toHaveBeenCalled();
    expect(added).not.toHaveBeenCalled();
  });

  it("respects lifecycle phase filter", () => {
    const added = vi.fn();

    setRules([
      {
        match: "foo",
        phase: "other-phase",
        added,
      },
    ]);

    executeRules(ADDED, document.createElement("div"), "foo");

    expect(added).not.toHaveBeenCalled();
  });

  it("calls multiple handlers based on mask", () => {
    const added = vi.fn();
    const changed = vi.fn();

    setRules([
      {
        match: "foo",
        added,
        changed,
      },
    ]);

    executeRules(ADDED | CHANGED, document.createElement("div"), "foo");

    expect(added).toHaveBeenCalledTimes(1);
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it("calls serialize handler only when SERIALIZE bit is set", () => {
    const serialize = vi.fn();

    setRules([
      {
        match: "foo",
        serialize,
      },
    ]);

    executeRules(SERIALIZE, document.createElement("div"), "foo");

    expect(serialize).toHaveBeenCalledTimes(1);
  });

  it("passes context through to handlers", () => {
    const added = vi.fn();
    const context = {};

    setRules([
      {
        match: "foo",
        added,
      },
    ]);

    executeRules(ADDED, document.createElement("div"), "foo", context);

    expect(added).toHaveBeenCalledWith(expect.any(Element), "foo", context);
  });
});
