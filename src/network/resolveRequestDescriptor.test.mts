import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./bridge.e.mts", () => ({
  bridge: { location: { href: "foo" }, console: { error: vi.fn() } },
}));

import { bridge } from "./bridge.e.mts";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";

describe("resolveRequestDescriptor", () => {
  const originalEnv = process.env["NODE_ENV"];

  afterEach(() => {
    process.env["NODE_ENV"] = originalEnv;
    vi.clearAllMocks();
  });

  it("resolves URL, method from attribute map, and credentials flag", () => {
    const el = document.createElement("div");

    el.setAttribute("get", "/api/test");
    el.setAttribute("credentials", "");

    const [url, method, credentials] = resolveRequestDescriptor(el);

    expect(url.pathname).toContain("/api/test");
    expect(method).toBe("GET");
    expect(credentials).toBe(true);
  });

  it("uses explicit method attribute over inferred method", () => {
    const el = document.createElement("div");

    el.setAttribute("post", "/api/test");
    el.setAttribute("method", "put");

    const [, method] = resolveRequestDescriptor(el);

    expect(method).toBe("PUT");
  });

  it("normalizes trailing slash in pathname", () => {
    const el = document.createElement("div");

    el.setAttribute("get", "/api/test/");

    const [url] = resolveRequestDescriptor(el);

    expect(url.pathname).toBe("/api/test/");
  });

  it("adds trailing slash for extension-less path", () => {
    const el = document.createElement("div");

    el.setAttribute("get", "/api/test/path");

    const [url] = resolveRequestDescriptor(el);

    expect(url.pathname.endsWith("/")).toBe(true);
  });

  it("removes slash for file path", () => {
    const el = document.createElement("div");

    el.setAttribute("get", "/api/test/file.txt/");

    const [url] = resolveRequestDescriptor(el);

    expect(url.pathname.endsWith("/")).toBe(false);
  });

  it("falls back to empty endpoint when no method attribute exists", () => {
    const el = document.createElement("div");

    const [url, method] = resolveRequestDescriptor(el);

    expect(method).toBe("GET");
    expect(url.href).toBeDefined();
  });

  it("handles missing baseURI safely", () => {
    const el = document.createElement("div");

    Object.defineProperty(el, "baseURI", {
      value: undefined,
    });

    el.setAttribute("get", "/api/test");
    el.setAttribute("log", "");

    expect(() => resolveRequestDescriptor(el)).not.toThrow();
    expect(bridge.console.error).toHaveBeenCalled();
  });

  it("sets ownerElement on location", () => {
    process.env["NODE_ENV"] = "docs";
    const el = document.createElement("div");
    resolveRequestDescriptor(el);
    expect(bridge.location.ownerElement).toBe(el);
  });
});
