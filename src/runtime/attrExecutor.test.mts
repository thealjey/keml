import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./attrRules.mts", () => ({
  attrRules: [],
}));

vi.mock("./data.mts", () => ({
  getLifecyclePhase: vi.fn(() => 1),
}));

import { attrDispatchers, traverseAttributes } from "./attrExecutor.mts";
import { attrRules } from "./attrRules.mts";
import { getLifecyclePhase } from "./data.mts";

/* ---------------- helpers ---------------- */

const makeEl = (name = "div") => {
  const el = document.createElement(name);
  return el;
};

beforeEach(() => {
  (attrRules as any).length = 0;
  vi.clearAllMocks();
});

describe("dispatchAttrRules", () => {
  it("executes added when match is string and phase matches", () => {
    const added = vi.fn();

    (attrRules as any).push({
      match: "x",
      added,
      phase: 1,
    });

    const el = makeEl();
    attrDispatchers[0](el, "x");

    expect(added).toHaveBeenCalledWith(el, "x", undefined);
  });

  it("executes removed when lifecycleAction === 1", () => {
    const removed = vi.fn();

    (attrRules as any).push({
      match: "x",
      removed,
      phase: 1,
    });

    const el = makeEl();
    attrDispatchers[1](el, "x");

    expect(removed).toHaveBeenCalledWith(el, "x", undefined);
  });

  it("executes changed when lifecycleAction === 2", () => {
    const changed = vi.fn();

    (attrRules as any).push({
      match: "x",
      changed,
      phase: 1,
    });

    const el = makeEl();
    attrDispatchers[2](el, "x");

    expect(changed).toHaveBeenCalledWith(el, "x", undefined);
  });

  it("supports array match", () => {
    const added = vi.fn();

    (attrRules as any).push({
      match: ["a", "b"],
      added,
      phase: 1,
    });

    const el = makeEl();
    attrDispatchers[0](el, "b");

    expect(added).toHaveBeenCalled();
  });

  it("supports regex match", () => {
    const added = vi.fn();

    (attrRules as any).push({
      match: /^x/,
      added,
      phase: 1,
    });

    const el = makeEl();
    attrDispatchers[0](el, "x123");

    expect(added).toHaveBeenCalled();
  });

  it("respects gate condition", () => {
    const added = vi.fn();

    (attrRules as any).push({
      match: "x",
      gate: () => false,
      added,
      phase: 1,
    });

    const el = makeEl();
    attrDispatchers[0](el, "x");

    expect(added).not.toHaveBeenCalled();
  });

  it("respects lifecycle phase filter", () => {
    const added = vi.fn();

    (getLifecyclePhase as any).mockReturnValue(99);

    (attrRules as any).push({
      match: "x",
      added,
      phase: 1,
    });

    const el = makeEl();
    attrDispatchers[0](el, "x");

    expect(added).not.toHaveBeenCalled();
  });

  it("skips non-element nodes", () => {
    const text = document.createTextNode("hello");

    const handler = vi.fn();

    (attrDispatchers as any)[0] = handler as any;

    traverseAttributes([text] as any, 0);

    expect(handler).not.toHaveBeenCalled();
  });

  it("dispatches attributes for element nodes", () => {
    const el = document.createElement("div");

    const attr = document.createAttribute("x-test");
    attr.value = "v";
    el.setAttributeNode(attr);

    const handler = vi.fn();
    (attrDispatchers as any)[0] = handler as any;

    traverseAttributes([el] as any, 0);

    expect(handler).toHaveBeenCalledWith(el, "x-test", undefined);
  });

  it("traverses nested elements via NodeIterator", () => {
    const parent = document.createElement("div");
    const child = document.createElement("span");

    parent.appendChild(child);

    const attr = document.createAttribute("x-a");
    attr.value = "v";
    child.setAttributeNode(attr);

    const handler = vi.fn();
    (attrDispatchers as any)[0] = handler as any;

    traverseAttributes([parent] as any, 0);

    expect(handler).toHaveBeenCalledWith(child, "x-a", undefined);
  });

  it("uses dispatcher for lifecycleAction 1", () => {
    const el = document.createElement("div");

    const attr = document.createAttribute("x-test");
    attr.value = "v";
    el.setAttributeNode(attr);

    const handler = vi.fn();
    (attrDispatchers as any)[1] = handler;

    traverseAttributes([el] as any, 1);

    expect(handler).toHaveBeenCalledWith(el, "x-test", undefined);
  });
});
