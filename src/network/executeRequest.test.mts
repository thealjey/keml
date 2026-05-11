import { beforeEach, describe, expect, it, vi } from "vitest";

/* -----------------------
   SAFE MODULE MOCKS
----------------------- */

vi.mock("../runtime/traverseAttributes.mts", () => ({
  traverseAttributes: vi.fn(),
}));

vi.mock("./resolveRequestDescriptor.mts", async importOriginal => {
  const actual = await importOriginal<any>();

  return {
    ...actual,
    resolveRequestDescriptor: vi.fn(),
  };
});

vi.mock("../event/dispatchNavigate.mts", () => ({
  dispatchNavigate: vi.fn(),
}));

vi.mock("../render/data.mts", async importOriginal => {
  const actual = await importOriginal<any>();

  return {
    ...actual,
    pushOneTimeElement: vi.fn(),
    markStateDirty: vi.fn(),
    pushRenderPayload: vi.fn(),

    // IMPORTANT: prevent attrRules runtime crash
    setFocusElement: vi.fn(),
    pushDiscoverableElement: vi.fn(),
  };
});

/* -----------------------
   IMPORTS
----------------------- */

import { dispatchNavigate } from "../event/dispatchNavigate.mts";
import { pushOneTimeElement } from "../render/data.mts";
import { traverseAttributes } from "../runtime/traverseAttributes.mts";
import { bridge } from "./bridge.e.mts";
import { executeRequest } from "./executeRequest.mts";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";

/* -----------------------
   MOCK CASTS
----------------------- */

const mockedTraverseAttributes = traverseAttributes as unknown as ReturnType<
  typeof vi.fn
>;
const mockedResolveRequestDescriptor =
  resolveRequestDescriptor as unknown as ReturnType<typeof vi.fn>;
const mockedDispatchNavigate = dispatchNavigate as unknown as ReturnType<
  typeof vi.fn
>;
const mockedPushOneTimeElement = pushOneTimeElement as unknown as ReturnType<
  typeof vi.fn
>;

/* -----------------------
   TESTS
----------------------- */

describe("executeRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stops when invalid", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => false,
    });

    executeRequest(el);

    expect(mockedResolveRequestDescriptor).not.toHaveBeenCalled();
  });

  it("calls resolveRequestDescriptor when valid", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el);

    expect(mockedResolveRequestDescriptor).toHaveBeenCalledWith(el);
  });

  it("pushes one-time element when 'once' is set", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    el.setAttribute("once", "");

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el);

    expect(mockedPushOneTimeElement).toHaveBeenCalledWith(el);
  });

  it("calls traverseAttributes for SERIALIZE phase", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el);

    expect(mockedTraverseAttributes).toHaveBeenCalled();
  });

  it("handles pushState redirect", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    el.setAttribute("redirect", "pushState");

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el);

    expect(mockedDispatchNavigate).toHaveBeenCalled();
  });

  it("handles assign redirect", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    el.setAttribute("redirect", "assign");

    const assignMock = vi.fn();
    bridge.location.assign = assignMock;

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el);

    expect(assignMock).toHaveBeenCalledWith("/url");
  });

  it("handles replace redirect", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    el.setAttribute("redirect", "replace");

    const replaceMock = vi.fn();
    bridge.location.replace = replaceMock;

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el);

    expect(replaceMock).toHaveBeenCalledWith("/url");
  });

  it("treats missing checkValidity as valid", () => {
    const el = document.createElement("div"); // no checkValidity on Element

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el as any);

    expect(mockedResolveRequestDescriptor).toHaveBeenCalledWith(el);
  });

  it("sets bridge location ownerElement when NODE_ENV is docs", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    const originalEnv = process.env["NODE_ENV"];

    process.env["NODE_ENV"] = "docs";

    const mockOwner = {};

    bridge.location.ownerElement = mockOwner as Element;

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    executeRequest(el);

    expect(bridge.location.ownerElement).toBe(el);

    process.env["NODE_ENV"] = originalEnv;
  });

  it("GET request appends form data to URL before XHR send", () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "GET", false]);

    const send = vi.fn();
    const open = vi.fn();
    const setRequestHeader = vi.fn();

    class MockXHR {
      responseType = "";
      withCredentials = false;
      open = open;
      send = send;
      setRequestHeader = setRequestHeader;
      ownerElement = null;
      onloadend = null;
    }

    bridge.XMLHttpRequest = MockXHR as any;

    executeRequest(el);

    expect(open).toHaveBeenCalledWith("GET", "/url");
    expect(send).toHaveBeenCalled();
  });

  it('sets custom headers for attributes starting with "h-"', () => {
    const el = document.createElement("form");

    Object.defineProperty(el, "checkValidity", {
      value: () => true,
    });

    el.setAttribute("h-test", "value");

    mockedResolveRequestDescriptor.mockReturnValue(["/url", "POST", false]);

    const send = vi.fn();
    const open = vi.fn();
    const setRequestHeader = vi.fn();

    class MockXHR {
      responseType = "";
      withCredentials = false;
      open = open;
      send = send;
      setRequestHeader = setRequestHeader;
      ownerElement = null;
      onloadend = null;
    }

    bridge.XMLHttpRequest = MockXHR as any;

    executeRequest(el);

    expect(setRequestHeader).toHaveBeenCalledWith("test", "value");
  });
});
