import { describe, expect, it } from "vitest";
import { appendFormDataToUrl } from "./appendFormDataToUrl.mts";

describe("appendFormDataToUrl", () => {
  it("appends string values to URL search params", () => {
    const url = new URL("https://example.com");
    const data = new FormData();

    data.append("a", "1");
    data.append("b", "2");

    appendFormDataToUrl(url, data);

    expect(url.searchParams.get("a")).toBe("1");
    expect(url.searchParams.get("b")).toBe("2");
  });

  it("ignores non-string values", () => {
    const url = new URL("https://example.com");
    const data = new FormData();

    data.append("a", "1");
    data.append("b", new Blob(["x"]) as any);

    appendFormDataToUrl(url, data);

    expect(url.searchParams.get("a")).toBe("1");
    expect(url.searchParams.has("b")).toBe(false);
  });

  it("does nothing when data is undefined", () => {
    const url = new URL("https://example.com");

    appendFormDataToUrl(url, undefined);

    expect(url.toString()).toBe("https://example.com/");
  });
});
