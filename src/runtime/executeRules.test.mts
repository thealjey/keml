import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ADDED,
  ADDED_ATTR,
  CHANGED,
  CREATED,
  DESTROYED,
  executeRules,
  REMOVED,
  REMOVED_ATTR,
  SERIALIZE,
} from "./executeRules.mts";

vi.mock("./attrRules.mts", () => ({
  attrRules: [],
  matchesName: vi.fn(),
}));

import { attrRules, matchesName } from "./attrRules.mts";

describe("executeRules - bitmask coverage", () => {
  beforeEach(() => {
    attrRules.length = 0;
    vi.clearAllMocks();
  });

  const el = document.createElement("div");

  it("ADDED", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      added: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(ADDED, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("ADDED_ATTR", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      addedAttr: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(ADDED_ATTR, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("REMOVED", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      removed: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(REMOVED, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("REMOVED_ATTR", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      removedAttr: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(REMOVED_ATTR, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("CHANGED", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      changed: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(CHANGED, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("CREATED", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      created: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(CREATED, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("DESTROYED", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      destroyed: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(DESTROYED, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("SERIALIZE", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      serialize: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(SERIALIZE, el, "x");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("combined bitmask executes multiple handlers", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      added: fn,
      removed: fn,
      serialize: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(ADDED | REMOVED | SERIALIZE, el, "x");

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("skips rule when gate returns false", () => {
    const fn = vi.fn();

    attrRules.push({
      match: "x",
      gate: () => false,
      added: fn,
      removed: fn,
      changed: fn,
      created: fn,
      destroyed: fn,
      addedAttr: fn,
      removedAttr: fn,
      serialize: fn,
    });

    vi.mocked(matchesName).mockReturnValue(true);

    executeRules(
      ADDED |
        REMOVED |
        CHANGED |
        CREATED |
        DESTROYED |
        ADDED_ATTR |
        REMOVED_ATTR |
        SERIALIZE,
      document.createElement("div"),
      "x",
    );

    expect(fn).not.toHaveBeenCalled();
  });
});
