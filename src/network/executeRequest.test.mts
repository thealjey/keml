import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../event/dispatchNavigate.mts", () => ({
  dispatchNavigate: vi.fn(),
}));

vi.mock("../render/data.mts", () => ({
  markStateDirty: vi.fn(),
  pushOneTimeElement: vi.fn(),
  pushRenderPayload: vi.fn(),
  pushResettableElement: vi.fn(),
  pushScrollableElement: vi.fn(),
  pushDiscoverableElement: vi.fn(),
  setFocusElement: vi.fn(),
}));

vi.mock("./appendFormDataToUrl.mts", () => ({
  appendFormDataToUrl: vi.fn(),
}));

vi.mock("./resolveRequestDescriptor.mts", () => ({
  resolveRequestDescriptor: vi.fn(() => [
    new URL("http://example.com"),
    "POST",
    false,
  ]),
  methodAttrs: ["foo"],
}));

import { dispatchNavigate } from "../event/dispatchNavigate.mts";
import { markStateDirty, pushOneTimeElement } from "../render/data.mts";
import { bridge } from "./bridge.e.mts";
import { executeRequest } from "./executeRequest.mts";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";

/* helper */

describe("executeRequest", () => {
  beforeAll(() => {
    vi.spyOn(bridge.XMLHttpRequest.prototype, "open");
    vi.spyOn(bridge.XMLHttpRequest.prototype, "setRequestHeader");
    vi.spyOn(bridge.XMLHttpRequest.prototype, "send");
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("HTMLFormElement -> xhr path (default branch)", () => {
    const el = document.createElement("form");

    executeRequest(el);

    expect(markStateDirty).toHaveBeenCalled();
  });

  it("once attribute pushes oneTimeElement", () => {
    const el = document.createElement("form");
    el.setAttribute("once", "");

    executeRequest(el);

    expect(pushOneTimeElement).toHaveBeenCalledWith(el);
  });

  it("name+value attribute fallback branch", () => {
    const el = document.createElement("div");
    el.setAttribute("name", "foo");
    el.setAttribute("value", "bar");

    executeRequest(el);

    expect(markStateDirty).toHaveBeenCalled();
  });

  it("redirect pushState triggers dispatchNavigate", () => {
    const el = document.createElement("form");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "POST",
      false,
    ]);

    el.setAttribute("redirect", "pushState");

    vi.spyOn(bridge.history, "pushState").mockImplementation(() => {});

    executeRequest(el);

    expect(dispatchNavigate).toHaveBeenCalled();
  });

  it("redirect assign triggers location.assign", () => {
    const el = document.createElement("form");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "POST",
      false,
    ]);

    el.setAttribute("redirect", "assign");

    const assignSpy = vi
      .spyOn(bridge.location, "assign")
      .mockImplementation(() => {});

    executeRequest(el);

    expect(assignSpy).toHaveBeenCalled();
  });

  it("GET method clears data path", () => {
    const el = document.createElement("form");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "GET",
      false,
    ]);

    executeRequest(el);

    expect(markStateDirty).toHaveBeenCalled();
  });

  it("XHR branch executes send path", () => {
    const el = document.createElement("form");

    executeRequest(el);

    expect(bridge.XMLHttpRequest.prototype.send).toHaveBeenCalled();
  });

  it("non-valid checkValidity blocks execution", () => {
    const el = document.createElement("form");
    (el as any).checkValidity = () => false;

    executeRequest(el);

    expect(markStateDirty).not.toHaveBeenCalled();
  });

  it("uses internalForm clone branch for input/select/textarea", () => {
    const el = document.createElement("input");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "POST",
      false,
    ]);

    executeRequest(el);

    expect(markStateDirty).toHaveBeenCalled();
    expect(bridge.XMLHttpRequest.prototype.send).toHaveBeenCalled();
  });

  it("skips form-data creation when no name and not form field", () => {
    const el = document.createElement("div");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "POST",
      false,
    ]);

    executeRequest(el);

    expect(bridge.XMLHttpRequest.prototype.send).toHaveBeenCalled();
  });

  it("name present but no value does not set FormData", () => {
    const el = document.createElement("div");
    el.setAttribute("name", "foo");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "POST",
      false,
    ]);

    executeRequest(el);

    expect(bridge.XMLHttpRequest.prototype.send).toHaveBeenCalled();
  });

  it("sends headers for attributes starting with h-", () => {
    const el = document.createElement("form");
    el.setAttribute("h-auth", "token");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "POST",
      false,
    ]);

    executeRequest(el);

    expect(
      bridge.XMLHttpRequest.prototype.setRequestHeader,
    ).toHaveBeenCalledWith("auth", "token");
  });

  it("docs path", () => {
    const originalEnv = process.env["NODE_ENV"];

    process.env["NODE_ENV"] = "docs";

    const el = document.createElement("form");
    el.setAttribute("h-auth", "token");

    (resolveRequestDescriptor as any).mockReturnValue([
      new URL("http://example.com"),
      "POST",
      false,
    ]);

    executeRequest(el);

    expect(
      bridge.XMLHttpRequest.prototype.setRequestHeader,
    ).toHaveBeenCalledWith("auth", "token");

    process.env["NODE_ENV"] = originalEnv;
  });
});
