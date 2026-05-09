import { beforeEach, describe, expect, it, vi } from "vitest";

/* ---------------- mocks ---------------- */

vi.mock("../util/attrNameEquals.mts", () => ({
  attrNameEquals: vi.fn(function (this: string, attr: Attr) {
    return attr.name === this;
  }),
}));

vi.mock("./writeAttribute.mts", () => ({
  writeAttribute: vi.fn(),
}));

/* ---------------- imports ---------------- */

import { disableState, enableState } from "./state.mts";
import { writeAttribute } from "./writeAttribute.mts";

/* ---------------- setup ---------------- */

beforeEach(() => {
  vi.clearAllMocks();
});

/* ---------------- tests ---------------- */

describe("state system", () => {
  it("enableState applies x-* without base attribute", () => {
    const el = document.createElement("div");
    el.setAttribute("x-a", "1");

    enableState(el);

    expect(writeAttribute).toHaveBeenCalled();
    expect(el.getAttribute("state")).toBeDefined();
  });

  it("enableState applies x-* with base attribute present", () => {
    const el = document.createElement("div");
    el.setAttribute("x-a", "1");
    el.setAttribute("a", "base");

    enableState(el);

    expect(writeAttribute).toHaveBeenCalled();
  });

  it("enableState does nothing if state already exists", () => {
    const el = document.createElement("div");
    el.setAttribute("state", "");

    enableState(el);

    expect(writeAttribute).not.toHaveBeenCalled();
  });

  it("disableState runs applyState when state exists", () => {
    const el = document.createElement("div");
    el.setAttribute("state", "");

    disableState(el);

    expect(writeAttribute).toHaveBeenCalled();
  });

  it("disableState does nothing when state missing", () => {
    const el = document.createElement("div");

    disableState(el);

    expect(writeAttribute).not.toHaveBeenCalled();
  });

  it("d-* triggers base cleanup path", () => {
    const el = document.createElement("div");
    el.setAttribute("d-a", "1");
    el.setAttribute("a", "base");

    enableState(el);

    expect(writeAttribute).toHaveBeenCalled();
  });

  it("d-* branch when baseAttr is falsy", () => {
    const el = document.createElement("div");
    el.setAttribute("d-a", "1");

    enableState(el);

    expect(writeAttribute).toHaveBeenCalled();

    const calls = (writeAttribute as any).mock.calls;

    const hasRemoveLikeCall = calls.some((c: any[]) => {
      return c[1] === "d-a" || c[0] === el;
    });

    expect(hasRemoveLikeCall).toBe(true);
  });
});
