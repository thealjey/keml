import { describe, expect, it } from "vitest";
import { hasToken } from "./hasToken.mts";

describe("hasToken", () => {
  it("no haystack", () => {
    expect(hasToken(null, "hello")).toBeFalsy();
  });

  it("no needle", () => {
    expect(hasToken("hello", null)).toBeFalsy();
  });

  it("equal", () => {
    expect(hasToken("hello", "hello")).toBeTruthy();
  });

  it("startsWith", () => {
    expect(hasToken("hello world", "hello")).toBeTruthy();
  });

  it("endsWith", () => {
    expect(hasToken("hello world", "world")).toBeTruthy();
  });

  it("includes", () => {
    expect(hasToken("red riding hood", "riding")).toBeTruthy();
  });

  it("does not match substrings inside tokens", () => {
    expect(hasToken("worldwide travel", "world")).toBeFalsy();
  });
});
