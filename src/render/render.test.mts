import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/* ---------------- global control ---------------- */

let rafSpy: any;

beforeAll(() => {
  rafSpy = vi
    .spyOn(globalThis, "requestAnimationFrame")
    .mockImplementation(() => 0);
});

afterAll(() => {
  rafSpy.mockRestore();
});

afterEach(() => {
  (ifElements as any).length = 0;
  (ifColonElements as any).length = 0;
  (renderElements as any).length = 0;
});

/* ---------------- mocks ---------------- */

vi.mock("../util/hasToken.mts", () => ({
  hasToken: vi.fn(() => true),
}));

vi.mock("./data.mts", () => ({
  clearFocusElement: vi.fn(),
  clearStateDirty: vi.fn(),
  getFocusElement: vi.fn(() => null),
  ifColonElements: [],
  ifElements: [],
  isStateDirty: vi.fn(() => false),
  markStateDirty: vi.fn(),
  popOneTimeElement: vi.fn(),
  popRenderPayload: vi.fn(),
  popResettableElement: vi.fn(),
  popScrollableElement: vi.fn(),
  popDiscoverableElement: vi.fn(),
  popAttrEventStack: vi.fn(),
  markStateRefDirty: vi.fn(),
  getNeedsSse: vi.fn(() => false),
  isRefDirty: vi.fn(() => false),
  clearRefDirty: vi.fn(),
  clearNeedsSse: vi.fn(),
  renderElements: [],
  linkElements: new Set(),
  refElements: new Set(),
}));

vi.mock("./patchers.mts", () => ({
  patchers: {
    replaceChildren: vi.fn(),
  },
}));

vi.mock("./state.mts", () => ({
  disableState: vi.fn(),
  enableState: vi.fn(),
}));

vi.mock("./writeAttribute.mts", () => ({
  writeAttribute: vi.fn(),
}));

vi.mock("./writeScrollAxis.mts", () => ({
  writeScrollAxis: vi.fn(),
}));

vi.mock("./readLiveValue.mts", () => ({
  readLiveValue: vi.fn(),
}));

vi.mock("../network/SseManager.mts", () => ({
  SseManager: { instance: { start: vi.fn() } },
}));

/* ---------------- imports ---------------- */

import { SseManager } from "../network/SseManager.mts";
import { hasToken } from "../util/hasToken.mts";
import {
  clearFocusElement,
  clearNeedsSse,
  clearStateDirty,
  getFocusElement,
  getNeedsSse,
  ifColonElements,
  ifElements,
  isRefDirty,
  isStateDirty,
  linkElements,
  markStateDirty,
  popAttrEventStack,
  popDiscoverableElement,
  popOneTimeElement,
  popRenderPayload,
  popResettableElement,
  popScrollableElement,
  refElements,
  renderElements,
} from "./data.mts";
import { patchers } from "./patchers.mts";
import { readLiveValue } from "./readLiveValue.mts";
import { render } from "./render.mts";
import { disableState, enableState } from "./state.mts";
import { writeAttribute } from "./writeAttribute.mts";
import { writeScrollAxis } from "./writeScrollAxis.mts";

/* ---------------- setup ---------------- */

beforeEach(() => {
  vi.clearAllMocks();
});

/* ---------------- tests ---------------- */

describe("render (baseline)", () => {
  it("processes resettable elements", () => {
    const el = document.createElement("form");
    el.reset = vi.fn();

    (popResettableElement as any)
      .mockReturnValueOnce(el)
      .mockReturnValueOnce(undefined);

    render();

    expect(el.reset).toHaveBeenCalled();
  });

  it("processes one-time elements", () => {
    const el = document.createElement("div");

    (popOneTimeElement as any)
      .mockReturnValueOnce(el)
      .mockReturnValueOnce(undefined);

    render();

    expect(writeAttribute).toHaveBeenCalledWith(el, "on");
  });

  it("processes render payload and marks state dirty", () => {
    const el = document.createElement("div");

    const payload = {
      target: {
        ownerElement: el,
        status: 200,
        responseXML: null,
      },
    };

    (popRenderPayload as any)
      .mockReturnValueOnce(payload)
      .mockReturnValueOnce(undefined);

    render();

    expect(markStateDirty).toHaveBeenCalled();
    expect(el.isLoading).toBe(false);
  });

  it("processes scrollable elements", () => {
    const el = document.createElement("div");
    el.scroll = vi.fn();

    (popScrollableElement as any)
      .mockReturnValueOnce(el)
      .mockReturnValueOnce(undefined);

    (writeScrollAxis as any).mockImplementation(
      (_: any, options: any, axis: any) => {
        options[axis] = 1;
      },
    );

    render();

    expect(el.scroll).toHaveBeenCalled();
  });

  it("does not crash when no data present", () => {
    render();

    expect(rafSpy).toHaveBeenCalled();
  });

  it("sets isError and dispatches failure event when status > 399", () => {
    const el = document.createElement("div");
    el.dispatchEvent = vi.fn();

    const payload = {
      target: {
        ownerElement: el,
        status: 500,
        responseXML: null,
      },
    };

    (popRenderPayload as any)
      .mockReturnValueOnce(payload)
      .mockReturnValueOnce(undefined);

    render();

    expect(el.isError).toBe(true);
    expect(el.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "failure" }),
    );
  });

  it("inserts at least one entry into batch and calls patcher", () => {
    const el = document.createElement("div");
    el.setAttribute("result", "token");

    const targetEl = document.createElement("div");
    targetEl.setAttribute("render", "token");
    targetEl.setAttribute("position", "replaceChildren");

    const response = document.implementation.createHTMLDocument("");
    const child = document.createElement("span");
    response.body.appendChild(child);

    (popRenderPayload as any)
      .mockReturnValueOnce({
        target: {
          ownerElement: el,
          status: 200,
          responseXML: response,
        },
      })
      .mockReturnValueOnce(undefined);

    (renderElements as any).push(targetEl);

    render();

    expect(patchers.replaceChildren).toHaveBeenCalled();
  });

  it("handles multiple entries in batch and applies patchers for each", () => {
    const el = document.createElement("div");
    el.setAttribute("result", "token");

    const t1 = document.createElement("div");
    t1.setAttribute("render", "token");
    t1.setAttribute("position", "replaceChildren");

    const t2 = document.createElement("div");
    t2.setAttribute("render", "token");
    t2.setAttribute("position", "replaceChildren");

    const response = document.implementation.createHTMLDocument("");
    response.body.appendChild(document.createElement("a"));

    (popRenderPayload as any)
      .mockReturnValueOnce({
        target: {
          ownerElement: el,
          status: 200,
          responseXML: response,
        },
      })
      .mockReturnValueOnce(undefined);

    (renderElements as any).push(t1, t2);

    render();

    expect(patchers.replaceChildren).toHaveBeenCalledTimes(2);
  });

  it("handles batch entry when responseXML is null", () => {
    const el = document.createElement("div");
    el.setAttribute("result", "token");

    const targetEl = document.createElement("div");
    targetEl.setAttribute("render", "token");

    (renderElements as any).push(targetEl);

    (popRenderPayload as any)
      .mockReturnValueOnce({
        target: {
          ownerElement: el,
          status: 200,
          responseXML: null,
        },
      })
      .mockReturnValueOnce(undefined);

    render();

    expect(patchers.replaceChildren).toHaveBeenCalledWith(
      targetEl,
      expect.any(Array),
    );
  });

  it("does not add to batch when hasToken fails for all renderElements", async () => {
    const el = document.createElement("div");
    el.setAttribute("result", "token");

    const targetEl = document.createElement("div");
    targetEl.setAttribute("render", "token");

    (renderElements as any).push(targetEl);

    const { hasToken } = await import("../util/hasToken.mts");
    (hasToken as any).mockReturnValue(false);

    (popRenderPayload as any)
      .mockReturnValueOnce({
        target: {
          ownerElement: el,
          status: 200,
          responseXML: null,
        },
      })
      .mockReturnValueOnce(undefined);

    render();

    expect(patchers.replaceChildren).not.toHaveBeenCalled();
  });

  it("runs enableState when isStateDirty is true", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const dirtyEl = document.createElement("div");
    dirtyEl.setAttribute("if", "anything");

    (ifElements as any).push(el);
    (ifColonElements as any).push(dirtyEl);

    (isStateDirty as any).mockReturnValue(true);
    (hasToken as any).mockReturnValue(true);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).toHaveBeenCalledWith(el);
  });

  it("pushes if:invalid when checkValidity is false", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const formEl = document.createElement("input");
    formEl.setAttribute("if:invalid", "token");

    formEl.checkValidity = () => false;

    (ifElements as any).push(el);
    (ifColonElements as any).push(formEl);

    (isStateDirty as any).mockReturnValue(true);
    (hasToken as any).mockReturnValue(true);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).toHaveBeenCalledWith(el);
  });

  it("if:value empty file", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("if:value", "token");

    (ifElements as any).push(el);
    (ifColonElements as any).push(input);

    (isStateDirty as any).mockReturnValue(true);
    (hasToken as any).mockReturnValue(true);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).toHaveBeenCalledWith(el);
  });

  it("pushes if:value into actions2d", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const input = document.createElement("input");
    input.setAttribute("if:value", "token");
    input.value = "token";

    (ifElements as any).push(el);
    (ifColonElements as any).push(input);

    (isStateDirty as any).mockReturnValue(true);
    (hasToken as any).mockReturnValue(true);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).toHaveBeenCalledWith(el);
  });

  it("pushes if:intersects into actions2d when element is intersecting", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const intersectEl = document.createElement("div");
    intersectEl.setAttribute("if:intersects", "token");

    (intersectEl as any).isIntersecting = true;

    (ifElements as any).push(el);
    (ifColonElements as any).push(intersectEl);

    (isStateDirty as any).mockReturnValue(true);
    (hasToken as any).mockReturnValue(true);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).toHaveBeenCalledWith(el);
  });

  it("pushes if:loading into actions2d when element is loading", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const loadingEl = document.createElement("div");
    loadingEl.setAttribute("if:loading", "token");

    (loadingEl as any).isLoading = true;

    (ifElements as any).push(el);
    (ifColonElements as any).push(loadingEl);

    (isStateDirty as any).mockReturnValue(true);
    (hasToken as any).mockReturnValue(true);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).toHaveBeenCalledWith(el);
  });

  it("pushes if:error into actions2d when element is in error state", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const errorEl = document.createElement("div");
    errorEl.setAttribute("if:error", "token");

    (errorEl as any).isError = true;

    (ifElements as any).push(el);
    (ifColonElements as any).push(errorEl);

    (isStateDirty as any).mockReturnValue(true);
    (hasToken as any).mockReturnValue(true);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).toHaveBeenCalledWith(el);
  });

  it("calls disableState when hasToken returns false", () => {
    const el = document.createElement("div");
    el.setAttribute("if", "token");

    const otherEl = document.createElement("div");
    otherEl.setAttribute("if:value", "other");

    (ifElements as any).push(el);
    (ifColonElements as any).push(otherEl);

    (isStateDirty as any).mockReturnValue(true);

    // force mismatch
    (hasToken as any).mockReturnValue(false);

    render();

    expect(clearStateDirty).toHaveBeenCalled();
    expect(enableState).not.toHaveBeenCalled();
    expect(disableState).toHaveBeenCalledWith(el);
  });

  it("uses valid behavior value when scrolling", () => {
    const el = document.createElement("div");

    el.setAttribute("behavior", "smooth");
    el.scroll = vi.fn();

    (writeScrollAxis as any).mockImplementation(
      (_: any, options: any, axis: any) => {
        options[axis] = 1;
      },
    );

    (popScrollableElement as any)
      .mockReturnValueOnce(el)
      .mockReturnValueOnce(undefined);

    render();

    expect(el.scroll).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
  });

  it("uses scrollBy when only left is set and element is relative", () => {
    const el = document.createElement("div");

    el.setAttribute("behavior", "auto");
    el.setAttribute("relative", "");

    el.scrollBy = vi.fn();

    (writeScrollAxis as any).mockImplementation(
      (_: any, options: any, axis: any) => {
        if (axis === "left") {
          options.left = 1;
        }
      },
    );

    (popScrollableElement as any)
      .mockReturnValueOnce(el)
      .mockReturnValueOnce(undefined);

    render();

    expect(el.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 1 }),
    );
  });

  it("handles focus element and sets selection range", () => {
    const el = document.createElement("input");

    el.value = "hello";
    el.focus = vi.fn();
    el.setSelectionRange = vi.fn();

    (getFocusElement as any).mockReturnValueOnce(el);

    render();

    expect(clearFocusElement).toHaveBeenCalled();
    expect(el.focus).toHaveBeenCalled();
    expect(el.setSelectionRange).toHaveBeenCalledWith(5, 5);
  });

  it("discoverable", () => {
    const dispatchEvent = vi.fn();
    const el = { dispatchEvent } as any as Element;
    (popDiscoverableElement as any).mockReturnValueOnce(el);
    render();
    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "discover" }),
    );
  });

  it("starts sse", () => {
    (getNeedsSse as any).mockReturnValueOnce(true);
    render();
    expect(clearNeedsSse).toHaveBeenCalledTimes(1);
    expect(SseManager.instance.start).toHaveBeenCalledTimes(1);
  });

  it("writes resolved ref values when dirty", () => {
    vi.mocked(isRefDirty).mockReturnValue(true);
    vi.mocked(hasToken).mockReturnValue(true);
    vi.mocked(readLiveValue).mockReturnValue("123");

    const writeSpy = vi.mocked(writeAttribute);

    const linkEl = document.createElement("div");
    linkEl.setAttribute("link:width", "tokenA");

    const refEl = document.createElement("div");
    refEl.setAttribute("ref:width", "valueA");

    linkElements.clear();
    refElements.clear();

    linkElements.add(linkEl);
    refElements.add(refEl);

    markStateDirty();
    render();

    expect(writeSpy).toHaveBeenCalled();
  });

  it("skips when not dirty", () => {
    vi.mocked(isRefDirty).mockReturnValue(false);

    const writeSpy = vi.mocked(writeAttribute);

    const linkEl = document.createElement("div");
    linkEl.setAttribute("link:width", "tokenA");

    const refEl = document.createElement("div");
    refEl.setAttribute("ref:width", "valueA");

    linkElements.clear();
    refElements.clear();

    linkElements.add(linkEl);
    refElements.add(refEl);

    render();

    expect(writeSpy).not.toHaveBeenCalled();
  });

  it("skips attributes that do not start with link:", () => {
    vi.mocked(isRefDirty).mockReturnValue(true);

    const writeSpy = vi.mocked(writeAttribute);

    const linkEl = document.createElement("div");
    linkEl.setAttribute("data-x", "tokenA"); // does NOT start with link:

    const refEl = document.createElement("div");
    refEl.setAttribute("ref:width", "123");

    linkElements.clear();
    refElements.clear();

    linkElements.add(linkEl);
    refElements.add(refEl);

    render();

    expect(writeSpy).not.toHaveBeenCalled();
  });

  it("dispatches attr event once", () => {
    const el = document.createElement("div");
    const spy = vi.spyOn(el, "dispatchEvent");

    vi.mocked(popAttrEventStack)
      .mockReturnValueOnce([el, "x"])
      .mockReturnValueOnce(undefined);

    render();

    expect(spy).toHaveBeenCalled();

    const event = spy.mock.calls[0]![0] as Event;
    expect(event.type).toBe("attr:x");
  });

  it("reuses cached event for same name", () => {
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");

    const spy1 = vi.spyOn(el1, "dispatchEvent");
    const spy2 = vi.spyOn(el2, "dispatchEvent");

    vi.mocked(popAttrEventStack)
      .mockReturnValueOnce([el1, "x"])
      .mockReturnValueOnce([el2, "x"])
      .mockReturnValueOnce(undefined);

    render();

    const e1 = spy1.mock.calls[0]![0];
    const e2 = spy2.mock.calls[0]![0];

    expect(e1).toBe(e2);
  });

  it("creates different events for different names", () => {
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");

    const spy1 = vi.spyOn(el1, "dispatchEvent");
    const spy2 = vi.spyOn(el2, "dispatchEvent");

    vi.mocked(popAttrEventStack)
      .mockReturnValueOnce([el1, "a"])
      .mockReturnValueOnce([el2, "b"])
      .mockReturnValueOnce(undefined);

    render();

    const e1 = spy1.mock.calls[0]![0] as Event;
    const e2 = spy2.mock.calls[0]![0] as Event;

    expect(e1.type).toBe("attr:a");
    expect(e2.type).toBe("attr:b");
    expect(e1).not.toBe(e2);
  });
});
