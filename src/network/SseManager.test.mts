import { beforeEach, describe, expect, it, vi } from "vitest";

/* ---------------- mocks ---------------- */

vi.mock("../render/data.mts", () => ({
  pushRenderPayload: vi.fn(),
}));

vi.mock("./resolveRequestDescriptor.mts", () => ({
  resolveRequestDescriptor: vi.fn(),
}));

vi.mock("./SseSource.mts", () => {
  return {
    SseSource: class {
      url: URL;
      withCredentials: boolean;
      onMessage: any;
      events: Set<string>;

      reconcileWith = vi.fn();
      clear = vi.fn();

      constructor(
        url: URL,
        withCredentials: boolean,
        onMessage: any,
        events: Set<string>,
      ) {
        this.url = url;
        this.withCredentials = withCredentials;
        this.onMessage = onMessage;
        this.events = events;
      }
    },
  };
});

/* ---------------- imports ---------------- */

import { SseManager } from "./SseManager.mts";
import { SseSource } from "./SseSource.mts";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";

/* ---------------- setup ---------------- */

beforeEach(() => {
  vi.clearAllMocks();
  (SseManager as any)._instance = undefined;
});

/* ---------------- tests ---------------- */

describe("SseManager", () => {
  it("adds and removes elements", () => {
    const mgr = new SseManager(vi.fn());

    const el = document.createElement("div");

    mgr.addElement(el);
    expect((mgr as any).elements.has(el)).toBe(true);

    mgr.deleteElement(el);
    expect((mgr as any).elements.has(el)).toBe(false);
  });

  it("getEvent returns attribute or default", () => {
    const mgr = new SseManager(vi.fn());

    const el = document.createElement("div");
    expect(mgr.getEvent(el)).toBe("message");

    el.setAttribute("sse", "custom");
    expect(mgr.getEvent(el)).toBe("custom");
  });

  it("onMessage dispatches payload when matching element found", () => {
    const onPayload = vi.fn();
    const mgr = new SseManager(onPayload);

    const el = document.createElement("div");
    mgr.addElement(el);

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "GET",
      false,
    ]);

    const source = {
      url: new URL("http://example.com"),
      withCredentials: false,
    } as any;

    const doc = document.implementation.createHTMLDocument("");

    mgr.onMessage(source, "message", doc);

    expect(onPayload).toHaveBeenCalled();
  });

  it("onMessage skips non-matching source", () => {
    const onPayload = vi.fn();
    const mgr = new SseManager(onPayload);

    const el = document.createElement("div");
    mgr.addElement(el);

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "GET",
      false,
    ]);

    const source = {
      url: new URL("http://different.com"),
      withCredentials: false,
    } as any;

    mgr.onMessage(
      source,
      "message",
      document.implementation.createHTMLDocument(""),
    );

    expect(onPayload).not.toHaveBeenCalled();
  });

  it("singleton instance returns same object", () => {
    const a = SseManager.instance;
    const b = SseManager.instance;

    expect(a).toBe(b);
  });

  it("stop clears all sources", () => {
    const mgr = new SseManager(vi.fn());

    const el = document.createElement("div");
    mgr.addElement(el);

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "GET",
      false,
    ]);

    mgr.start();
    mgr.stop();

    expect(mgr.size).toBe(0);
  });

  it("onMessage handles multiple matching elements", () => {
    const onPayload = vi.fn();
    const mgr = new SseManager(onPayload);

    const el1 = document.createElement("div");
    const el2 = document.createElement("div");

    mgr.addElement(el1);
    mgr.addElement(el2);

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "GET",
      false,
    ]);

    const source = {
      url: new URL("http://example.com"),
      withCredentials: false,
    } as any;

    const doc = document.implementation.createHTMLDocument("");

    mgr.onMessage(source, "message", doc);

    expect(onPayload).toHaveBeenCalledTimes(2);
  });

  it("start preserves entry when href exists in both map and elements", () => {
    const onPayload = vi.fn();
    const mgr = new SseManager(onPayload);

    const el = document.createElement("div");
    mgr.addElement(el);

    const url = new URL("http://example.com");

    (resolveRequestDescriptor as any).mockReturnValue([url, "GET", false]);

    const left = new SseSource(url, false, vi.fn(), new Set());
    const right = new SseSource(url, true, vi.fn(), new Set());

    mgr.set(url.href, [left, right] as any);

    mgr.start();

    expect(mgr.has(url.href)).toBe(true);
  });

  it("start deletes entries when href is not present in elements (all.has === false)", () => {
    const onPayload = vi.fn();
    const mgr = new SseManager(onPayload);

    const el = document.createElement("div");
    mgr.addElement(el);

    const url = new URL("http://example.com");

    (resolveRequestDescriptor as any).mockReturnValue([url, "GET", false]);

    const left = new SseSource(url, false, vi.fn(), new Set());
    const right = new SseSource(url, true, vi.fn(), new Set());

    mgr.set(url.href, [left, right] as any);

    mgr.deleteElement(el);

    mgr.start();

    expect(mgr.has(url.href)).toBe(false);
    expect(left.clear).toHaveBeenCalled();
    expect(right.clear).toHaveBeenCalled();
  });
});
