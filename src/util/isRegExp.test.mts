import { describe, expect, it } from "vitest";
import { isRegExp } from "./isRegExp.mts";

describe("isRegExp", () => {
  it("returns true for a regex literal", () => {
    expect(isRegExp(/abc/)).toBe(true);
  });

  it("returns true for RegExp constructed via constructor", () => {
    const re = new RegExp("abc");
    expect(isRegExp(re)).toBe(true);
  });

  it("returns false for strings", () => {
    expect(isRegExp("abc")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isRegExp(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isRegExp(undefined)).toBe(false);
  });

  it("returns false for plain objects", () => {
    const obj = {
      source: "abc",
      flags: "g",
    };

    expect(isRegExp(obj)).toBe(false);
  });

  it("returns false for objects mimicking regex shape", () => {
    const fake = {
      toString: () => "[object RegExp]",
    };

    expect(isRegExp(fake)).toBe(false);
  });

  it("returns false for functions", () => {
    const fn = () => {};
    expect(isRegExp(fn)).toBe(false);
  });
});
