import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../event/dispatchNavigate.mts", () => ({
  dispatchNavigate: vi.fn(),
}));

vi.mock("../network/SseManager.mts", () => ({
  SseManager: {
    instance: {
      start: vi.fn(),
      stop: vi.fn(),
    },
  },
}));

vi.mock("../render/data.mts", () => ({
  markStateDirty: vi.fn(),
  pushResettableElement: vi.fn(),
  pushScrollableElement: vi.fn(),
  setFocusElement: vi.fn(),
  pushDiscoverableElement: vi.fn(),
  setNeedsSse: vi.fn(),
}));

vi.mock("../render/render.mts", () => ({
  render: vi.fn(),
}));

vi.mock("./traverseAttributes.mts", () => ({
  traverseAttributes: vi.fn(),
}));

vi.mock("./attrMutation.mts", () => ({
  mutationObserver: {
    observe: vi.fn(),
  },
}));

vi.mock("./data.mts", () => ({
  setEventListener: vi.fn(),
}));

import { dispatchNavigate } from "../event/dispatchNavigate.mts";
import { markStateDirty } from "../render/data.mts";
import { render } from "../render/render.mts";
import { mutationObserver } from "./attrMutation.mts";
import { bootstrap } from "./bootstrap.mts";
import { traverseAttributes } from "./traverseAttributes.mts";

describe("bootstrap", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    (global as any).requestAnimationFrame = vi.fn(cb => {
      cb(0);
      return 1;
    });
  });

  it("bootstraps application and wires core systems", async () => {
    bootstrap();

    expect(traverseAttributes).toHaveBeenCalled();

    expect(mutationObserver.observe).toHaveBeenCalledWith(
      document,
      expect.objectContaining({
        attributes: true,
        childList: true,
        subtree: true,
      }),
    );

    expect(document.addEventListener).toBeDefined();
    expect(window.addEventListener).toBeDefined();

    expect(markStateDirty).toBeDefined();
    expect(dispatchNavigate).toBeDefined();

    expect(render).toHaveBeenCalled();
  });
});
