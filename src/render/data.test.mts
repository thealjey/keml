import { describe, expect, it } from "vitest";
import {
  clearFocusElement,
  clearNeedsSse,
  clearStateDirty,
  getFocusElement,
  getNeedsSse,
  ifColonElements,
  ifElements,
  isStateDirty,
  markStateDirty,
  popDiscoverableElement,
  popOneTimeElement,
  popRenderPayload,
  popResettableElement,
  popScrollableElement,
  pushDiscoverableElement,
  pushOneTimeElement,
  pushRenderPayload,
  pushResettableElement,
  pushScrollableElement,
  renderElements,
  setFocusElement,
  setNeedsSse,
} from "./data.mts";

describe("state module", () => {
  it("discoverable", () => {
    const el = {} as Element;

    pushDiscoverableElement(el);
    expect(popDiscoverableElement()).toBe(el);
  });

  it("stack operations work", () => {
    const payload = {} as any;
    const el = {} as Element;

    pushRenderPayload(payload);
    expect(popRenderPayload()).toBe(payload);

    pushOneTimeElement(el);
    expect(popOneTimeElement()).toBe(el);

    pushResettableElement(el);
    expect(popResettableElement()).toBe(el);

    pushScrollableElement(el);
    expect(popScrollableElement()).toBe(el);
  });

  it("focus element state works", () => {
    const el = {} as Element;

    setFocusElement(el);
    expect(getFocusElement()).toBe(el);

    clearFocusElement();
    expect(getFocusElement()).toBeUndefined();
  });

  it("dirty state works", () => {
    clearStateDirty();
    expect(isStateDirty()).toBe(false);

    markStateDirty();
    expect(isStateDirty()).toBe(true);

    clearStateDirty();
    expect(isStateDirty()).toBe(false);
  });

  it("sse needed works", () => {
    clearNeedsSse();
    expect(getNeedsSse()).toBe(false);

    setNeedsSse();
    expect(getNeedsSse()).toBe(true);

    clearNeedsSse();
    expect(getNeedsSse()).toBe(false);
  });

  it("sets are exposed and usable", () => {
    const el = {} as Element;

    expect(ifColonElements.size).toBe(0);
    expect(ifElements.size).toBe(0);
    expect(renderElements.size).toBe(0);

    ifElements.add(el);

    expect(ifElements.has(el)).toBe(true);
  });
});
