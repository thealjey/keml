import { describe, expect, it } from "vitest";
import { notNil } from "./notNil.mts";

describe("notNil", () => {
  it("null", () => {
    expect(notNil(null)).toBeFalsy();
  });

  it("undefined", () => {
    expect(notNil(undefined)).toBeFalsy();
  });

  it("anything else", () => {
    expect(notNil(42)).toBeTruthy();
  });
});
