import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../event/data.e.mts", () => ({
  navigateElements: new Set(),
  onElements: new Set(),
  resetElements: new Set(),
  scrollElements: new Set(),
  clearTimeoutElements: new Set(),
}));

const onEvent = () => {};

vi.mock("./data.mts", () => ({ getEventListener: () => onEvent }));

vi.mock("../event/concealObserver.mts", () => ({
  concealObserver: { observe: vi.fn(), unobserve: vi.fn() },
}));

vi.mock("../event/revealObserver.mts", () => ({
  revealObserver: { observe: vi.fn(), unobserve: vi.fn() },
}));

vi.mock("../event/intersectsObserver.mts", () => ({
  intersectsObserver: { observe: vi.fn(), unobserve: vi.fn() },
}));

vi.mock("../event/resizeObserver.mts", () => ({
  resizeObserver: { observe: vi.fn(), unobserve: vi.fn() },
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
  refElements: new Set(),
  linkElements: new Set(),
  markStateDirty: vi.fn(),
  renderElements: new Set(),
  setFocusElement: vi.fn(),
  pushDiscoverableElement: vi.fn(),
  pushAttrEventStack: vi.fn(),
  markRefDirty: vi.fn(),
  setNeedsSse: vi.fn(),
}));

import { concealObserver } from "../event/concealObserver.mts";
import {
  clearTimeoutElements,
  navigateElements,
  onElements,
  resetElements,
  scrollElements,
} from "../event/data.e.mts";
import { intersectsObserver } from "../event/intersectsObserver.mts";
import { resizeObserver } from "../event/resizeObserver.mts";
import { revealObserver } from "../event/revealObserver.mts";
import { SseManager } from "../network/SseManager.mts";
import {
  ifColonElements,
  ifElements,
  linkElements,
  markRefDirty,
  markStateDirty,
  pushAttrEventStack,
  refElements,
  renderElements,
  setFocusElement,
} from "../render/data.mts";
import { attrRules, matchesName, presentAttrGate } from "./attrRules.mts";
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
    const rule = attrRules.find(r => r.match === "if" && r.added)!;

    const el = document.createElement("div");

    rule.added?.(el, "if");
    expect(ifElements.has(el)).toBe(true);

    rule.removed?.(el, "if");
    expect(ifElements.has(el)).toBe(false);
  });

  it("clear-timeout rule adds and removes elements", () => {
    const rule = attrRules.find(r => r.match === "clear-timeout" && r.added)!;

    const el = document.createElement("div");

    rule.added?.(el, "clear-timeout");
    expect(clearTimeoutElements.has(el)).toBe(true);

    rule.removed?.(el, "clear-timeout");
    expect(clearTimeoutElements.has(el)).toBe(false);
  });

  it("if rule triggers markStateDirty", () => {
    const rule = attrRules.find(
      r => Array.isArray(r.match) && r.match.includes("if"),
    )!;
    const el = document.createElement("div");

    rule.changed?.(el, "if");

    expect(markStateDirty).toHaveBeenCalled();
  });

  it("if:intersects attaches and detaches observer", () => {
    const rule = attrRules.find(r => r.match === "if:intersects" && r.added)!;

    const el = document.createElement("div");

    rule.added?.(el, "if:intersects");
    expect(intersectsObserver.observe).toHaveBeenCalledWith(el);

    rule.removed?.(el, "if:intersects");
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

    rule.destroyed!(el, "if:test");

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
    el.sizeEntry = {
      contentRect: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    } as any;

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
      append: vi.fn(),
    };

    const context = { formData } as any;

    rule.serialize?.(el, "value", context);

    expect(formData.append).toHaveBeenCalledWith("foo", "bar");
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

  it("initializes sizeEntry when missing and triggers added rule", () => {
    const el = document.createElement("div");

    el.getBoundingClientRect = vi.fn(() => ({
      width: 10,
      height: 20,
      top: 0,
      right: 10,
      bottom: 20,
      left: 0,
    })) as any;

    delete (el as any).sizeEntry;

    const rule = attrRules.find(
      r => Array.isArray(r.match) && r.match.includes("ref:width"),
    )!;

    rule.added?.(el, "ref:width");

    expect((el as any).sizeEntry).toBeDefined();
    expect((el as any).sizeEntry.contentRect.width).toBe(10);
    expect((el as any).sizeEntry.contentRect.height).toBe(20);
  });

  it("enqueues attr event only when on:attr:<name> exists", () => {
    const el = document.createElement("div");

    el.setAttribute("on:attr:x", "1");

    const rule = attrRules.find(
      r => r.gate && r.addedAttr === pushAttrEventStack,
    )!;

    expect(rule.gate?.(el, "x")).toBe(true);
    expect(rule.gate?.(el, "y")).toBe(false);
  });

  it("observes and unobserves element for ref:width and ref:height", () => {
    const el = document.createElement("div");

    const rule = attrRules.find(
      r =>
        Array.isArray(r.match) && r.match.includes("ref:width") && r.destroyed,
    )!;

    rule.added?.(el, "ref:width");
    rule.destroyed?.(el, "ref:width");

    expect(resizeObserver.observe).toHaveBeenCalledWith(el);
    expect(resizeObserver.unobserve).toHaveBeenCalledWith(el);
  });

  it("does not unobserve when presentAttrGate blocks rule", () => {
    const el = document.createElement("div");
    const rule = attrRules.find(
      r =>
        Array.isArray(r.match) &&
        r.gate === presentAttrGate &&
        r.match.includes("ref:width") &&
        r.removed,
    )!;

    rule.removed?.(el, "");
    expect(resizeObserver.unobserve).toHaveBeenCalled();
  });

  it("ref node rule", () => {
    const el = document.createElement("div");
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("ref:") && r.destroyed,
    )!;
    rule.added?.(el, "");
    expect(refElements.has(el)).toBeTruthy();
    rule.destroyed?.(el, "");
    expect(refElements.has(el)).toBeFalsy();
  });

  it("ref attr rule", () => {
    const el = document.createElement("div");
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("ref:") && r.removed,
    )!;
    refElements.add(el);
    rule.removed?.(el, "");
    expect(refElements.has(el)).toBeFalsy();
  });

  it("link node rule", () => {
    const el = document.createElement("div");
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("link:") && r.destroyed,
    )!;
    rule.added?.(el, "");
    expect(linkElements.has(el)).toBeTruthy();
    rule.destroyed?.(el, "");
    expect(linkElements.has(el)).toBeFalsy();
  });

  it("link attr rule", () => {
    const el = document.createElement("div");
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("link:") && r.removed,
    )!;
    linkElements.add(el);
    rule.removed?.(el, "");
    expect(linkElements.has(el)).toBeFalsy();
  });

  it("if attr rule", () => {
    const el = document.createElement("div");
    const rule = attrRules.find(
      r => r.match instanceof RegExp && r.match.test("if:") && r.removed,
    )!;
    ifColonElements.add(el);
    rule.removed?.(el, "");
    expect(ifColonElements.has(el)).toBeFalsy();
  });

  it("ref gate", () => {
    const el = document.createElement("div");
    const rule = attrRules.find(r => !r.match && r.added === markRefDirty)!;
    el.setAttribute("ref:lol", "");
    expect(rule.gate?.(el, "lol")).toBeTruthy();
  });
});

describe("matchesName", () => {
  it("matches exact strings", () => {
    expect(matchesName.call("foo", "foo")).toBe(true);
    expect(matchesName.call("foo", "bar")).toBe(false);
  });

  it("matches regular expressions", () => {
    expect(matchesName.call("foobar", /^foo/)).toBe(true);
    expect(matchesName.call("foobar", /^bar/)).toBe(false);
  });

  it("matches nested matcher arrays", () => {
    expect(matchesName.call("foobar", ["bar", /^foo/])).toBe(true);

    expect(matchesName.call("foobar", ["bar", /^baz/])).toBe(false);
  });

  it("matches deeply nested matcher arrays", () => {
    expect(matchesName.call("foobar", ["bar", [/^baz/, [/^foo/]]])).toBe(true);

    expect(matchesName.call("foobar", [[/^baz/, ["qux"]]])).toBe(false);
  });

  it("returns false for empty matcher arrays", () => {
    expect(matchesName.call("foobar", [])).toBe(false);
  });
});

describe("presentAttrGate", () => {
  it("returns false when matching attribute exists", () => {
    const el = document.createElement("div");
    el.setAttribute("x", "1");

    const rule = {
      match: "x",
    } as any;

    const result = presentAttrGate.call(rule, el);

    expect(result).toBe(false);
  });

  it("returns true when no matching attribute exists", () => {
    const el = document.createElement("div");
    el.setAttribute("y", "1");

    const rule = {
      match: "x",
    } as any;

    const result = presentAttrGate.call(rule, el);

    expect(result).toBe(true);
  });
});
