import { beforeEach, describe, expect, it, vi } from "vitest";

/* no external mutable references at all */

vi.mock("../network/scheduleRequest.mts", () => ({
  scheduleRequest: vi.fn(),
}));

vi.mock("../network/bridge.e.mts", () => ({
  bridge: { console: { log: vi.fn() } },
}));

vi.mock("../render/data.mts", () => ({
  pushResettableElement: vi.fn(),
  pushScrollableElement: vi.fn(),
}));

vi.mock("../util/hasToken.mts", () => ({
  hasToken: vi.fn(() => true),
}));

vi.mock("./rejectsEventConstraint.mts", () => ({
  rejectsEventConstraint: vi.fn(() => false),
}));

vi.mock("./data.e.mts", () => {
  const el = document.createElement("button");
  el.setAttribute("on", "token");

  return {
    onElements: new Set([el]),
    resetElements: new Set([el]),
    scrollElements: new Set([el]),
  };
});

import { bridge } from "../network/bridge.e.mts";
import { scheduleRequest } from "../network/scheduleRequest.mts";
import {
  pushResettableElement,
  pushScrollableElement,
} from "../render/data.mts";
import { onEvent } from "./onEvent.mts";
import { rejectsEventConstraint } from "./rejectsEventConstraint.mts";

/* helper */
const makeEvent = () => {
  const target = document.createElement("button");
  target.setAttribute("on:click", "token");

  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
  });

  Object.defineProperty(event, "target", {
    value: target,
  });

  return { event, target };
};

describe("onEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("executes full pipeline", () => {
    const { event } = makeEvent();

    onEvent(event as any);

    expect(event.defaultPrevented).toBe(true);
    expect(scheduleRequest).toHaveBeenCalled();
    expect(pushResettableElement).toHaveBeenCalled();
    expect(pushScrollableElement).toHaveBeenCalled();
  });

  it("does nothing when target is not Element", () => {
    const event = {
      target: {},
      type: "click",
      preventDefault: vi.fn(),
    };

    onEvent(event as any);

    expect(scheduleRequest).not.toHaveBeenCalled();
  });

  it("uses on:click on parent element", () => {
    const parent = document.createElement("div");
    parent.setAttribute("on:click", "token");

    const child = document.createElement("button");
    parent.appendChild(child);

    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, "target", {
      value: child,
    });

    onEvent(event as any);

    expect(event.defaultPrevented).toBe(true);
    expect(scheduleRequest).toHaveBeenCalled();
  });

  it("event:click exists and rejects (early return)", () => {
    const { event, target } = makeEvent();

    target.setAttribute("event:click", "a,b,c");

    (rejectsEventConstraint as any).mockReturnValue(true);

    onEvent(event as any);

    expect(scheduleRequest).not.toHaveBeenCalled();
  });

  it("docs path", () => {
    const originalEnv = process.env["NODE_ENV"];

    process.env["NODE_ENV"] = "docs";

    const { event, target } = makeEvent();

    target.setAttribute("event:click", "a,b,c");

    (rejectsEventConstraint as any).mockReturnValue(true);

    onEvent(event as any);

    expect(bridge.console.ownerElement).toBe(target);

    process.env["NODE_ENV"] = originalEnv;
  });

  it("event:click exists and does NOT reject", () => {
    const { event, target } = makeEvent();

    target.setAttribute("event:click", "a,b,c");

    (rejectsEventConstraint as any).mockReturnValue(false);

    onEvent(event as any);

    expect(event.defaultPrevented).toBe(true);
  });

  it("log + event:click both exist", () => {
    const { event, target } = makeEvent();

    target.setAttribute("event:click", "a,b,c");
    target.setAttribute("log", "true");

    (rejectsEventConstraint as any).mockReturnValue(false);

    onEvent(event as any);

    expect(bridge.console.log).toHaveBeenCalled();
  });

  it("does nothing when on:click does not exist anywhere", () => {
    const target = document.createElement("button");

    // IMPORTANT: no on:click on target or any parent
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, "target", {
      value: target,
    });

    onEvent(event as any);

    expect(event.defaultPrevented).toBe(false);
    expect(scheduleRequest).not.toHaveBeenCalled();
    expect(pushResettableElement).not.toHaveBeenCalled();
    expect(pushScrollableElement).not.toHaveBeenCalled();
  });
});
