import { describe, expect, it, vi } from "vitest";

vi.mock("./attrExecutor.mts", () => {
  return {
    traverseAttributes: vi.fn(),
    attrDispatchers: [vi.fn(), vi.fn(), vi.fn()],
  };
});

import { attrDispatchers, traverseAttributes } from "./attrExecutor.mts";
import { onMutation } from "./attrMutation.mts";

describe("onMutation", () => {
  it("calls traverseAttributes for added and removed nodes", () => {
    const record = {
      addedNodes: ["a"],
      removedNodes: ["b"],
      attributeName: undefined,
      oldValue: null,
      target: {
        hasAttribute: () => true,
      },
    } as any;

    onMutation([record]);

    expect(traverseAttributes).toHaveBeenCalledWith(["b"], 1);
    expect(traverseAttributes).toHaveBeenCalledWith(["a"], 0);
  });

  it("calls dispatcher index 0 when attribute exists and oldValue is null", () => {
    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: "test",
      oldValue: null,
      target: {
        hasAttribute: () => true,
      },
    } as any;

    onMutation([record]);

    expect(attrDispatchers[0]).toHaveBeenCalledWith(record.target, "test");
  });

  it("calls dispatcher index 2 when attribute is removed and oldValue is null", () => {
    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: "test",
      oldValue: null,
      target: {
        hasAttribute: () => false,
      },
    } as any;

    onMutation([record]);

    expect(attrDispatchers[2]).toHaveBeenCalledWith(record.target, "test");
  });

  it("calls dispatcher index 1 when attribute missing but oldValue exists", () => {
    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: "test",
      oldValue: "old",
      target: {
        hasAttribute: () => false,
      },
    } as any;

    onMutation([record]);

    expect(attrDispatchers[1]).toHaveBeenCalledWith(record.target, "test");
  });

  it("calls dispatcher index 2 when hasAttribute is true and oldValue is not null", () => {
    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: "test",
      oldValue: "old",
      target: {
        hasAttribute: () => true,
      },
    } as any;

    onMutation([record]);

    expect(attrDispatchers[2]).toHaveBeenCalledWith(record.target, "test");
  });
});
