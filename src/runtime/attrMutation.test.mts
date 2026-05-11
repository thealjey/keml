import { beforeEach, describe, expect, it, vi } from "vitest";
import { onMutation } from "./attrMutation.mts";
import { ADDED, CHANGED, executeRules, REMOVED } from "./executeRules.mts";
import { traverseAttributes } from "./traverseAttributes.mts";

vi.mock("./executeRules.mts", () => ({
  executeRules: vi.fn(),
  ADDED: 1,
  REMOVED: 2,
  CHANGED: 4,
}));

vi.mock("./traverseAttributes.mts", () => ({
  traverseAttributes: vi.fn(),
}));

const mockedExecuteRules = executeRules as unknown as ReturnType<typeof vi.fn>;
const mockedTraverseAttributes = traverseAttributes as unknown as ReturnType<
  typeof vi.fn
>;

describe("onMutation", () => {
  beforeEach(() => {
    mockedExecuteRules.mockReset();
    mockedTraverseAttributes.mockReset();
  });

  it("forwards added and removed nodes to traverseAttributes", () => {
    const added = document.createElement("div");
    const removed = document.createElement("span");

    const record = {
      addedNodes: [added],
      removedNodes: [removed],
      attributeName: null,
      oldValue: null,
      target: added,
    } as unknown as MutationRecord;

    onMutation([record]);

    expect(mockedTraverseAttributes).toHaveBeenCalledWith(REMOVED, [removed]);
    expect(mockedTraverseAttributes).toHaveBeenCalledWith(ADDED, [added]);
  });

  it("calls ADDED when attribute is newly added", () => {
    const el = document.createElement("div");
    el.setAttribute("x", "1");

    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: "x",
      oldValue: null,
      target: el,
    } as unknown as MutationRecord;

    onMutation([record]);

    expect(mockedExecuteRules).toHaveBeenCalledWith(ADDED, el, "x");
  });

  it("calls REMOVED when attribute is removed", () => {
    const el = document.createElement("div");

    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: "x",
      oldValue: "1",
      target: el,
    } as unknown as MutationRecord;

    onMutation([record]);

    expect(mockedExecuteRules).toHaveBeenCalledWith(REMOVED, el, "x");
  });

  it("calls CHANGED when neither ADDED nor REMOVED conditions match", () => {
    const el = document.createElement("div");

    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: "x",
      oldValue: null,
      target: el,
    } as unknown as MutationRecord;

    // force CHANGED path by ensuring element state doesn't match add/remove branches
    el.removeAttribute("x");

    onMutation([record]);

    expect(mockedExecuteRules).toHaveBeenCalledWith(CHANGED, el, "x");
  });

  it("does nothing when attributeName is missing", () => {
    const el = document.createElement("div");

    const record = {
      addedNodes: [],
      removedNodes: [],
      attributeName: null,
      oldValue: null,
      target: el,
    } as unknown as MutationRecord;

    onMutation([record]);

    expect(mockedExecuteRules).not.toHaveBeenCalled();
  });
});
