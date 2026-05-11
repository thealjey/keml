import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeRules } from "./executeRules.mts";
import { traverseAttributes } from "./traverseAttributes.mts";

vi.mock("./executeRules.mts", () => ({
  executeRules: vi.fn(),
}));

const mockedExecuteRules = executeRules as unknown as ReturnType<typeof vi.fn>;

describe("traverseAttributes", () => {
  beforeEach(() => {
    mockedExecuteRules.mockReset();
  });

  it("processes all attributes on elements", () => {
    const el = document.createElement("div");
    el.setAttribute("a", "1");
    el.setAttribute("b", "2");

    traverseAttributes(1, [el]);

    expect(mockedExecuteRules).toHaveBeenCalledWith(1, el, "a", undefined);
    expect(mockedExecuteRules).toHaveBeenCalledWith(1, el, "b", undefined);
  });

  it("ignores non-element nodes", () => {
    const text = document.createTextNode("hello");

    traverseAttributes(1, [text]);

    expect(mockedExecuteRules).not.toHaveBeenCalled();
  });

  it("passes context correctly", () => {
    const el = document.createElement("div");
    el.setAttribute("x", "1");

    const ctx = {};

    traverseAttributes(2, [el], ctx);

    expect(mockedExecuteRules).toHaveBeenCalledWith(2, el, "x", ctx);
  });

  it("handles multiple root elements", () => {
    const a = document.createElement("div");
    const b = document.createElement("span");

    a.setAttribute("a", "1");
    b.setAttribute("b", "2");

    traverseAttributes(1, [a, b]);

    expect(mockedExecuteRules).toHaveBeenCalledWith(1, a, "a", undefined);
    expect(mockedExecuteRules).toHaveBeenCalledWith(1, b, "b", undefined);
  });
});
