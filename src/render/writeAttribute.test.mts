import { describe, expect, it, vi } from "vitest";
import { writeAttribute } from "./writeAttribute.mts";

describe("writeAttribute", () => {
  it("sets attribute when missing and value is provided", () => {
    const el = {
      getAttributeNode: () => null,
      setAttribute: vi.fn(),
      value: "",
    } as any;

    writeAttribute(el, "value", "hello");

    expect(el.setAttribute).toHaveBeenCalledWith("value", "hello");
  });

  it("removes attribute when value is omitted", () => {
    const attr = { name: "value", value: "old" };

    const el = {
      getAttributeNode: () => attr,
      removeAttributeNode: vi.fn(),
      setAttribute: vi.fn(),
      value: "",
    } as any;

    writeAttribute(el, "value");

    expect(el.removeAttributeNode).toHaveBeenCalledWith(attr);
  });

  it("updates attribute value when different", () => {
    const attr = { name: "value", value: "old" };

    const el = {
      getAttributeNode: () => attr,
      removeAttributeNode: vi.fn(),
      setAttribute: vi.fn(),
      value: "",
    } as any;

    writeAttribute(el, "value", "new");

    expect(attr.value).toBe("new");
  });

  it("does not update attribute when value is the same", () => {
    const attr = { name: "value", value: "same" };

    const el = {
      getAttributeNode: () => attr,
      removeAttributeNode: vi.fn(),
      setAttribute: vi.fn(),
      value: "",
    } as any;

    writeAttribute(el, "value", "same");

    expect(attr.value).toBe("same");
  });

  it("uses Attr object branch instead of lookup", () => {
    const attr = { name: "value", value: "old" } as Attr;

    const el = {
      setAttribute: vi.fn(),
      removeAttributeNode: vi.fn(),
      value: "",
    } as any;

    writeAttribute(el, attr, "new");

    expect(attr.value).toBe("new");
  });

  it("updates element property for value mapping", () => {
    const el: any = {
      value: "",
      getAttributeNode: () => null,
      setAttribute: vi.fn(),
    };

    writeAttribute(el, "value", "abc");

    expect(el.value).toBe("abc");
  });

  it("sets checked property when value is provided", () => {
    const el: any = {
      checked: false,
      getAttributeNode: () => null,
      setAttribute: vi.fn(),
    };

    writeAttribute(el, "checked", "x");

    expect(el.checked).toBe(true);
  });

  it("sets checked property to false when value is omitted", () => {
    const el: any = {
      checked: true,
      getAttributeNode: () => null,
      setAttribute: vi.fn(),
    };

    writeAttribute(el, "checked");

    expect(el.checked).toBe(false);
  });

  it("does not overwrite identical property value", () => {
    const el: any = {
      checked: true,
      getAttributeNode: () => null,
      setAttribute: vi.fn(),
    };

    writeAttribute(el, "checked", "x");

    expect(el.checked).toBe(true);
  });
});
