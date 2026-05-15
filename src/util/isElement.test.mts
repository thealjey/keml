import { describe, expect, it } from "vitest";
import { isElement } from "./isElement.mts";

describe("isElement", () => {
  it("returns true for object with ELEMENT_NODE nodeType", () => {
    const el = {
      nodeType: 1,
    };

    expect(isElement(el)).toBe(true);
  });

  it("returns false for object with non-element nodeType", () => {
    const textNodeLike = {
      nodeType: 3,
    };

    expect(isElement(textNodeLike)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isElement(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isElement(undefined)).toBe(false);
  });

  it("returns false for primitive values", () => {
    expect(isElement("div")).toBe(false);
    expect(isElement(123)).toBe(false);
    expect(isElement(true)).toBe(false);
  });

  it("returns false for objects without nodeType", () => {
    const obj = {
      type: "checkbox",
    };

    expect(isElement(obj)).toBe(false);
  });

  it("returns false for nodeType that is not ELEMENT_NODE", () => {
    const commentLike = {
      nodeType: 8,
    };

    expect(isElement(commentLike)).toBe(false);
  });
});
