import { describe, expect, it } from "vitest";
import { resolveValue } from "./resolveValue.mts";

describe("resolveValue", () => {
  it("returns checked for checkbox inputs", () => {
    const el = {
      type: "checkbox",
      checked: true,
      value: "ignored",
    } as unknown as Element;

    expect(resolveValue(el)).toBe(true);
  });

  it("returns unchecked state for checkbox inputs", () => {
    const el = {
      type: "checkbox",
      checked: false,
      value: "ignored",
    } as unknown as Element;

    expect(resolveValue(el)).toBe(false);
  });

  it("returns files for file inputs", () => {
    const files = {
      length: 2,
      0: new File(["a"], "a.txt"),
      1: new File(["b"], "b.txt"),
      item: (i: number) => (i === 0 ? files[0] : files[1]),
    } as unknown as FileList;

    const el = {
      type: "file",
      files,
      value: "ignored",
    } as unknown as Element;

    expect(resolveValue(el)).toBe(files);
  });

  it("returns src for image inputs", () => {
    const el = {
      type: "image",
      src: "/img.png",
      value: "ignored",
    } as unknown as Element;

    expect(resolveValue(el)).toBe("/img.png");
  });

  it("returns value for default input types", () => {
    const el = {
      type: "text",
      value: "hello",
    } as unknown as Element;

    expect(resolveValue(el)).toBe("hello");
  });

  it("falls back to value when type is unknown", () => {
    const el = {
      type: "custom",
      value: "fallback",
    } as unknown as Element;

    expect(resolveValue(el)).toBe("fallback");
  });

  it("handles missing type as fallback value", () => {
    const el = {
      value: "no-type",
    } as unknown as Element;

    expect(resolveValue(el)).toBe("no-type");
  });
});
