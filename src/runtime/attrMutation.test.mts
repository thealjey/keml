import { beforeEach, describe, expect, it, vi } from "vitest";
import { onMutation } from "./attrMutation.mts";
import { ADDED, CHANGED, executeRules, REMOVED } from "./executeRules.mts";
import { traverseAttributes } from "./traverseAttributes.mts";

vi.mock("./executeRules.mts", () => ({
  executeRules: vi.fn(),
  ADDED: 1,
  REMOVED: 2,
  CHANGED: 4,
  DESTROYED: 8,
  CREATED: 16,
  REMOVED_ATTR: 32,
  ADDED_ATTR: 64,
  SERIALIZE: 128,
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

    const {
      mock: {
        calls: [first, second],
      },
    } = mockedTraverseAttributes;
    expect(first![0] & REMOVED).toBeTruthy();
    expect(first![1][0]).toBe(removed);
    expect(second![0] & ADDED).toBeTruthy();
    expect(second![1][0]).toBe(added);
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

    const {
      mock: {
        calls: [first],
      },
    } = mockedExecuteRules;
    expect(first![0] & ADDED).toBeTruthy();
    expect(first![1]).toBe(el);
    expect(first![2]).toBe("x");
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

    const {
      mock: {
        calls: [first],
      },
    } = mockedExecuteRules;
    expect(first![0] & REMOVED).toBeTruthy();
    expect(first![1]).toBe(el);
    expect(first![2]).toBe("x");
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
