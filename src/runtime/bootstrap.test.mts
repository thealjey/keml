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
  setLifecyclePhase: vi.fn(),
  setEventListener: vi.fn(),
}));

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
    const { bootstrap } = await import("./bootstrap.mts");
    const { SseManager } = await import("../network/SseManager.mts");
    const { mutationObserver } = await import("./attrMutation.mts");
    const { markStateDirty } = await import("../render/data.mts");
    const { render } = await import("../render/render.mts");
    const { traverseAttributes } = await import("./traverseAttributes.mts");
    const { setLifecyclePhase } = await import("./data.mts");
    const { dispatchNavigate } = await import("../event/dispatchNavigate.mts");

    bootstrap();

    expect(traverseAttributes).toHaveBeenCalled();
    expect(setLifecyclePhase).toHaveBeenCalledWith(1);

    expect(SseManager.instance.start).toHaveBeenCalled();

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
