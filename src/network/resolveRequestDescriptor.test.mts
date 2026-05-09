import { describe, expect, it } from "vitest";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";

describe("resolveRequestDescriptor", () => {
  it("resolves GET request from method attribute", () => {
    const el = {
      baseURI: "https://example.com",
      hasAttribute: (name: string) => name === "href",
      getAttribute: () => "/api/test",
      getAttributeNode: () => null,
    } as any;

    const [url, method, credentials] = resolveRequestDescriptor(el);

    expect(url.toString()).toBe("https://example.com/api/test/");
    expect(method).toBe("GET");
    expect(credentials).toBe(false);
  });

  it("uses method attribute when present", () => {
    const el = {
      baseURI: "https://example.com",
      hasAttribute: (name: string) => name === "href",
      getAttribute: () => "/api/test",
      getAttributeNode: () => ({ value: "post" }),
    } as any;

    const [, method] = resolveRequestDescriptor(el);

    expect(method).toBe("POST");
  });

  it("uses mapped method attribute name (post)", () => {
    const el = {
      baseURI: "https://example.com",
      hasAttribute: (name: string) => name === "post",
      getAttribute: () => "/api/test",
      getAttributeNode: () => null,
    } as any;

    const [, method] = resolveRequestDescriptor(el);

    expect(method).toBe("POST");
  });

  it("sets credentials flag when attribute exists", () => {
    const el = {
      baseURI: "https://example.com",
      hasAttribute: (name: string) => name === "credentials",
      getAttribute: () => "/api/test",
      getAttributeNode: () => null,
    } as any;

    const [, , credentials] = resolveRequestDescriptor(el);

    expect(credentials).toBe(true);
  });

  it("normalizes trailing slashes and ensures single slash", () => {
    const el = {
      baseURI: "https://example.com",
      hasAttribute: (name: string) => name === "href",
      getAttribute: () => "/api/test///",
      getAttributeNode: () => null,
    } as any;

    const [url] = resolveRequestDescriptor(el);

    expect(url.pathname).toBe("/api/test/");
  });

  it("docs path", () => {
    const originalEnv = process.env["NODE_ENV"];

    const el = {
      baseURI: "https://foo.com",
      hasAttribute: (name: string) => name === "href",
      getAttribute: () => "/api/test",
      getAttributeNode: () => null,
    } as any;

    process.env["NODE_ENV"] = "docs";

    const [url] = resolveRequestDescriptor(el);

    expect(url.toString()).toBe("http://localhost:3000/api/test/");

    process.env["NODE_ENV"] = originalEnv;
  });
});
