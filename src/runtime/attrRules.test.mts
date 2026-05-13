import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../event/data.e.mts", () => ({
  navigateElements: new Set(),
  onElements: new Set(),
  resetElements: new Set(),
  scrollElements: new Set(),
}));

const onEvent = () => {};

vi.mock("./data.mts", () => ({ getEventListener: () => onEvent }));

vi.mock("../event/visibilityEvents.mts", () => ({
  concealObserver: { observe: vi.fn(), unobserve: vi.fn() },
  revealObserver: { observe: vi.fn(), unobserve: vi.fn() },
}));

vi.mock("../event/visibilityStateSync.mts", () => ({
  intersectsObserver: { observe: vi.fn(), unobserve: vi.fn() },
}));

vi.mock("../network/resolveRequestDescriptor.mts", () => ({
  methodAttrs: [],
}));

vi.mock("../network/SseManager.mts", () => ({
  SseManager: {
    instance: {
      addElement: vi.fn(),
      deleteElement: vi.fn(),
      start: vi.fn(),
    },
  },
}));

vi.mock("../render/data.mts", () => ({
  ifColonElements: new Set(),
  ifElements: new Set(),
  markStateDirty: vi.fn(),
  renderElements: new Set(),
  setFocusElement: vi.fn(),
  pushDiscoverableElement: vi.fn(),
  setNeedsSse: vi.fn(),
}));

import {
  navigateElements,
  onElements,
  resetElements,
  scrollElements,
} from "../event/data.e.mts";
import { concealObserver, revealObserver } from "../event/visibilityEvents.mts";
import { intersectsObserver } from "../event/visibilityStateSync.mts";
import { SseManager } from "../network/SseManager.mts";
import {
  ifColonElements,
  ifElements,
  markStateDirty,
  renderElements,
  setFocusElement,
} from "../render/data.mts";
import { attrRules } from "./attrRules.mts";
import { getEventListener } from "./data.mts";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("attrRules", () => {
  it("autofocus rule calls setFocusElement", () => {
    const rule = attrRules.find(r => r.match === "autofocus")!;
    const el = document.createElement("div");

    rule.added?.(el, "autofocus");

    expect(setFocusElement).toHaveBeenCalledWith(el, "autofocus");
  });

  it("if rule adds and removes elements", () => {
    const add = attrRules.find(r => r.match === "if" && r.added)!;
    const remove = attrRules.find(r => r.match === "if" && r.removed)!;

    const el = document.createElement("div");

    add.added?.(el, "if");
    expect(ifElements.has(el)).toBe(true);

    remove.removed?.(el, "if");
    expect(ifElements.has(el)).toBe(false);
  });

  it("if rule triggers markStateDirty", () => {
    const rule = attrRules.find(r => r.match === "if" && r.changed)!;
    const el = document.createElement("div");

    rule.changed?.(el, "if");

    expect(markStateDirty).toHaveBeenCalled();
  });

  it("if:intersects attaches and detaches observer", () => {
    const add = attrRules.find(r => r.match === "if:intersects" && r.added)!;
    const remove = attrRules.find(
      r => r.match === "if:intersects" && r.removed,
    )!;

    const el = document.createElement("div");

    add.added?.(el, "if:intersects");
    expect(intersectsObserver.observe).toHaveBeenCalledWith(el);

    remove.removed?.(el, "if:intersects");
    expect(intersectsObserver.unobserve).toHaveBeenCalledWith(el);
  });

  it("sse rule registers element", () => {
    const rule = attrRules.find(r => r.match === "sse")!;
    const el = document.createElement("div");

    rule.added?.(el, "sse");

    expect(SseManager.instance.addElement).toHaveBeenCalledWith(el, "sse");
  });

  it("gated credentials sse", () => {
    const rule = attrRules.find(
      r => Array.isArray(r.match) && r.match.includes("credentials"),
    )!;
    const el = document.createElement("div");

    expect(rule.gate!(el, "credentials")).toBe(false);
    el.setAttribute("sse", "");
    expect(rule.gate!(el, "credentials")).toBe(true);
  });

  it("adds element for /^if:/ rule", () => {
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("if:x"),
    )!;
    const el = document.createElement("div");

    rule.added!(el, "if:test");

    expect(ifColonElements.has(el)).toBe(true);
  });

  it("removes element for /^if:/ rule", () => {
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("if:x"),
    )!;
    const el = document.createElement("div");

    // ensure it exists first
    rule.added!(el, "if:test");
    expect(ifColonElements.has(el)).toBe(true);

    rule.removed!(el, "if:test");

    expect(ifColonElements.has(el)).toBe(false);
  });

  it("skips added when isIntersecting is already set", () => {
    const rule = attrRules.find(r => r.match === "if:intersects" && r.gate)!;

    const el = document.createElement("div");

    (el as any).isIntersecting = true;

    const result = rule.gate?.(el, "if:intersects");

    expect(result).toBe(false);
  });

  it("computes isIntersecting when gate allows execution", () => {
    const rule = attrRules.find(
      r =>
        r.match === "if:intersects" &&
        typeof r.gate === "function" &&
        typeof r.added === "function",
    )!;

    const el = document.createElement("div");

    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    } as DOMRect);

    Object.defineProperty(globalThis, "innerWidth", { value: 100 });
    Object.defineProperty(globalThis, "innerHeight", { value: 100 });

    rule.added!(el, "if:intersects");

    expect((el as any).isIntersecting).toBe(true);
  });

  it("adds element to onElements", () => {
    const rule = attrRules.find(r => r.match === "on" && r.added)!;

    const el = document.createElement("div");

    rule.added!(el, "on");

    expect(onElements.has(el)).toBe(true);
  });

  it("removes element from onElements", () => {
    const rule = attrRules.find(r => r.match === "on" && r.removed)!;

    const el = document.createElement("div");

    rule.added!(el, "on");
    expect(onElements.has(el)).toBe(true);

    rule.removed!(el, "on");

    expect(onElements.has(el)).toBe(false);
  });

  it("allows execution when event not registered yet", () => {
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("on:x"),
    )!;

    const el = document.createElement("div");

    const result = rule.gate?.(el, "on:test");

    expect(result).toBe(true);
  });

  it("blocks execution when event already registered", () => {
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("on:x"),
    )!;

    const el = document.createElement("div");

    // simulate first registration
    rule.added!(el, "on:test");

    const result = rule.gate?.(el, "on:test");

    expect(result).toBe(false);
  });

  it("registers event and adds document listener", () => {
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("on:x"),
    )!;

    const el = document.createElement("div");

    const addEventSpy = vi.spyOn(document, "addEventListener");

    rule.added!(el, "on:click");

    expect(addEventSpy).toHaveBeenCalledWith("click", getEventListener(), true);
  });

  it("observes element on on:conceal added", () => {
    const rule = attrRules.find(r => r.match === "on:conceal")!;

    const el = document.createElement("div");

    rule.added!(el, "on:conceal");

    expect(concealObserver.observe).toHaveBeenCalledWith(el);
  });

  it("un-observes element on on:conceal removed", () => {
    const rule = attrRules.find(r => r.match === "on:conceal")!;

    const el = document.createElement("div");

    rule.removed!(el, "on:conceal");

    expect(concealObserver.unobserve).toHaveBeenCalledWith(el);
  });

  it("adds element to navigateElements on on:navigate added", () => {
    const rule = attrRules.find(r => r.match === "on:navigate")!;

    const el = document.createElement("div");

    rule.added!(el, "on:navigate");

    expect(navigateElements.has(el)).toBe(true);
  });

  it("removes element from navigateElements on on:navigate removed", () => {
    const rule = attrRules.find(r => r.match === "on:navigate")!;

    const el = document.createElement("div");

    rule.added!(el, "on:navigate");
    expect(navigateElements.has(el)).toBe(true);

    rule.removed!(el, "on:navigate");

    expect(navigateElements.has(el)).toBe(false);
  });

  it("observes element on on:reveal added", () => {
    const rule = attrRules.find(r => r.match === "on:reveal")!;

    const el = document.createElement("div");

    rule.added!(el, "on:reveal");

    expect(revealObserver.observe).toHaveBeenCalledWith(el);
  });

  it("un-observes element on on:reveal removed", () => {
    const rule = attrRules.find(r => r.match === "on:reveal")!;

    const el = document.createElement("div");

    rule.removed!(el, "on:reveal");

    expect(revealObserver.unobserve).toHaveBeenCalledWith(el);
  });

  it("adds element to renderElements on render added", () => {
    const rule = attrRules.find(r => r.match === "render")!;

    const el = document.createElement("div");

    rule.added!(el, "render");

    expect(renderElements.has(el)).toBe(true);
  });

  it("removes element from renderElements on render removed", () => {
    const rule = attrRules.find(r => r.match === "render")!;

    const el = document.createElement("div");

    rule.added!(el, "render");
    expect(renderElements.has(el)).toBe(true);

    rule.removed!(el, "render");

    expect(renderElements.has(el)).toBe(false);
  });

  it("adds element to resetElements on reset added", () => {
    const rule = attrRules.find(r => r.match === "reset")!;

    const el = document.createElement("div");

    rule.added!(el, "reset");

    expect(resetElements.has(el)).toBe(true);
  });

  it("removes element from resetElements on reset removed", () => {
    const rule = attrRules.find(r => r.match === "reset")!;

    const el = document.createElement("div");

    rule.added!(el, "reset");
    expect(resetElements.has(el)).toBe(true);

    rule.removed!(el, "reset");

    expect(resetElements.has(el)).toBe(false);
  });

  it("adds element to scrollElements on scroll added", () => {
    const rule = attrRules.find(r => r.match === "scroll")!;

    const el = document.createElement("div");

    rule.added!(el, "scroll");

    expect(scrollElements.has(el)).toBe(true);
  });

  it("removes element from scrollElements on scroll removed", () => {
    const rule = attrRules.find(r => r.match === "scroll")!;

    const el = document.createElement("div");

    rule.added!(el, "scroll");
    expect(scrollElements.has(el)).toBe(true);

    rule.removed!(el, "scroll");

    expect(scrollElements.has(el)).toBe(false);
  });

  it("allows execution when element has sse attribute", () => {
    const rule = attrRules.find(
      r => r.match && typeof r.match === "object" && r.gate,
    )!;

    const el = document.createElement("div");
    el.setAttribute("sse", "");

    const result = rule.gate!(el, "credentials");

    expect(result).toBe(true);
  });

  it("value rule gate blocks input/select/textarea elements", () => {
    const rule = attrRules.find(r => r.match === "value")!;

    const input = document.createElement("input");
    input.setAttribute("name", "x");
    input.setAttribute("value", "1");

    const select = document.createElement("select");
    select.setAttribute("name", "x");
    select.setAttribute("value", "1");

    const textarea = document.createElement("textarea");
    textarea.setAttribute("name", "x");
    textarea.setAttribute("value", "1");

    // @ts-ignore
    expect(rule.gate?.(input)).toBe(false);
    // @ts-ignore
    expect(rule.gate?.(select)).toBe(false);
    // @ts-ignore
    expect(rule.gate?.(textarea)).toBe(false);
  });

  it("value rule gate blocks elements without name attribute", () => {
    const rule = attrRules.find(r => r.match === "value")!;

    const el = document.createElement("div");
    el.setAttribute("value", "1");

    // @ts-ignore
    expect(rule.gate?.(el)).toBe(false);
  });

  it("value rule serializes name/value into FormData", () => {
    const rule = attrRules.find(r => r.match === "value")!;

    const el = document.createElement("div");
    el.setAttribute("name", "foo");
    el.setAttribute("value", "bar");

    const formData = {
      set: vi.fn(),
    };

    const context = { formData } as any;

    rule.serialize?.(el, "value", context);

    expect(formData.set).toHaveBeenCalledWith("foo", "bar");
  });

  it("value rule serialize is safe when context or data is missing", () => {
    const rule = attrRules.find(r => r.match === "value")!;

    const el = document.createElement("div");
    el.setAttribute("name", "foo");
    el.setAttribute("value", "bar");

    expect(() => {
      rule.serialize?.(el, "value", undefined);
    }).not.toThrow();
  });
});
