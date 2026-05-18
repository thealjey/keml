import { describe, expect, it, vi } from "vitest";
import { readLiveValue } from "./readLiveValue.mts";

type SizeEntryBox = {
  inlineSize: number;
  blockSize: number;
};

type MockContentRect = {
  width: number;
  height: number;
};

type MockSizeEntry = {
  borderBoxSize: SizeEntryBox[];
  contentBoxSize: SizeEntryBox[];
  devicePixelContentBoxSize: SizeEntryBox[];
  contentRect: MockContentRect;
};

type MockEl = Element & {
  sizeEntry: MockSizeEntry;
  measure?: string;
  someProp?: string;
};

const createEl = (overrides?: Partial<MockEl>): MockEl => {
  const el = {
    getAttribute: vi.fn((name: string) => {
      if (name === "measure") {
        return "borderBoxSize";
      }
      return null;
    }),
    sizeEntry: {
      borderBoxSize: [{ inlineSize: 100, blockSize: 50 }],
      contentBoxSize: [{ inlineSize: 200, blockSize: 120 }],
      devicePixelContentBoxSize: [{ inlineSize: 300, blockSize: 180 }],
      contentRect: { width: 999, height: 888 },
    },
    ...overrides,
  } as unknown as MockEl;

  return el;
};

describe("readLiveValue", () => {
  it("reads width from borderBoxSize by default", () => {
    const el = createEl();

    const result = readLiveValue(el as any, "width");

    expect(result).toBe(100);
  });

  it("reads height from borderBoxSize by default", () => {
    const el = createEl();

    const result = readLiveValue(el as any, "height");

    expect(result).toBe(50);
  });

  it("uses contentRect when measure is contentRect", () => {
    const el = createEl({
      getAttribute: vi.fn((name: string) => {
        if (name === "measure") {
          return "contentRect";
        }
        return null;
      }),
    });

    expect(readLiveValue(el as any, "width")).toBe(999);
    expect(readLiveValue(el as any, "height")).toBe(888);
  });

  it("falls back to borderBoxSize when measure is invalid", () => {
    const el = createEl({
      getAttribute: vi.fn((name: string) => {
        if (name === "measure") {
          return "invalidValue";
        }
        return null;
      }),
    });

    expect(readLiveValue(el as any, "width")).toBe(100);
  });

  it("uses contentBoxSize when specified", () => {
    const el = createEl({
      getAttribute: vi.fn((name: string) => {
        if (name === "measure") {
          return "contentBoxSize";
        }
        return null;
      }),
    });

    expect(readLiveValue(el as any, "width")).toBe(200);
  });

  it("falls back to property if name exists on element", () => {
    const el = createEl({
      someProp: "hello",
    });

    const result = readLiveValue(el as any, "someProp");

    expect(result).toBe("hello");
  });

  it("falls back to attribute if property does not exist", () => {
    const el = createEl({
      getAttribute: vi.fn((name: string) => {
        if (name === "data-x") {
          return "attr-value";
        }
        return null;
      }),
    });

    const result = readLiveValue(el as any, "data-x");

    expect(result).toBe("attr-value");
  });
});
