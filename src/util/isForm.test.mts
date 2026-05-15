import { describe, expect, it } from "vitest";
import { isForm } from "./isForm.mts";

describe("isForm", () => {
  it("returns true for FORM elements", () => {
    const el = {
      tagName: "FORM",
    } as unknown as Element;

    expect(isForm(el)).toBe(true);
  });

  it("returns false for non-FORM elements", () => {
    const el = {
      tagName: "DIV",
    } as unknown as Element;

    expect(isForm(el)).toBe(false);
  });

  it("returns false for INPUT elements", () => {
    const el = {
      tagName: "INPUT",
    } as unknown as Element;

    expect(isForm(el)).toBe(false);
  });

  it("returns false for TEXTAREA elements", () => {
    const el = {
      tagName: "TEXTAREA",
    } as unknown as Element;

    expect(isForm(el)).toBe(false);
  });

  it("returns false for lowercase tag names (non-normalized input)", () => {
    const el = {
      tagName: "form",
    } as unknown as Element;

    expect(isForm(el)).toBe(false);
  });

  it("returns false for missing tagName", () => {
    const el = {};

    expect(isForm(el as unknown as Element)).toBe(false);
  });
});
