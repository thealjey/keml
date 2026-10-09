import { describe, expect, it, vi } from "vitest";
import { clearRequests } from "./clearRequests.mts";

describe("clearRequests", () => {
  it("clears event handlers, aborts every request, and clears xhr", () => {
    const xhr1 = {
      onloadend: vi.fn(),
      onerror: vi.fn(),
      ontimeout: vi.fn(),
      abort: vi.fn(),
    } as unknown as XMLHttpRequest;

    const xhr2 = {
      onloadend: vi.fn(),
      onerror: vi.fn(),
      ontimeout: vi.fn(),
      abort: vi.fn(),
    } as unknown as XMLHttpRequest;

    const el = {
      xhr: [xhr1, xhr2],
    } as unknown as Element;

    clearRequests(el);

    expect(xhr1.onloadend).toBeNull();
    expect(xhr1.onerror).toBeNull();
    expect(xhr1.ontimeout).toBeNull();
    expect(xhr1.abort).toHaveBeenCalledOnce();

    expect(xhr2.onloadend).toBeNull();
    expect(xhr2.onerror).toBeNull();
    expect(xhr2.ontimeout).toBeNull();
    expect(xhr2.abort).toHaveBeenCalledOnce();

    expect(el.xhr).toBeUndefined();
  });

  it("does nothing to requests when xhr is undefined and clears xhr", () => {
    const el = {
      xhr: undefined,
    } as unknown as Element;

    clearRequests(el);

    expect(el.xhr).toBeUndefined();
  });

  it("handles an empty xhr array", () => {
    const el = {
      xhr: [],
    } as unknown as Element;

    clearRequests(el);

    expect(el.xhr).toBeUndefined();
  });
});
