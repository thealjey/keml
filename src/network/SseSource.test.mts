import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SseSource } from "./SseSource.mts";
import { bridge } from "./bridge.e.mts";

let addSpy: ReturnType<typeof vi.spyOn>;
let removeSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  addSpy = vi.spyOn(bridge.EventSource.prototype, "addEventListener");
  removeSpy = vi.spyOn(bridge.EventSource.prototype, "removeEventListener");
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SseSource", () => {
  it("does not register duplicate listeners for same event", () => {
    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(),
    );

    source.add("msg");
    source.add("msg");

    const callsForMsg = addSpy.mock.calls.filter(
      ([event]: [string]) => event === "msg",
    );

    expect(callsForMsg.length).toBe(1);
  });

  it("registers initial events from constructor", () => {
    new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(["a", "b"]),
    );

    const calls = addSpy.mock.calls.map(([event]: [string]) => event);

    expect(calls).toContain("a");
    expect(calls).toContain("b");
  });

  it("removes event listener on delete", () => {
    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(),
    );

    source.add("msg");
    source.delete("msg");

    const callsForMsg = removeSpy.mock.calls.filter(
      ([event]: [string]) => event === "msg",
    );

    expect(callsForMsg.length).toBe(1);
  });

  it("does nothing when deleting a non-existent event", () => {
    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(),
    );

    source.delete("msg");

    const callsForMsg = removeSpy.mock.calls.filter(
      ([event]: [string]) => event === "msg",
    );

    expect(callsForMsg.length).toBe(0);
  });

  it("removes all listeners on clear", () => {
    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(),
    );

    source.add("a");
    source.add("b");
    source.add("c");

    source.clear();

    const removedEvents = removeSpy.mock.calls.map(
      ([event]: [string]) => event,
    );

    expect(removedEvents).toContain("a");
    expect(removedEvents).toContain("b");
    expect(removedEvents).toContain("c");
  });

  it("forwards parsed message to onMessage", () => {
    const onMessage = vi.fn();

    new SseSource(
      new URL("https://example.com"),
      false,
      onMessage,
      new Set(["msg"]),
    );

    const handler = addSpy.mock.calls.find(
      ([event]: [string]) => event === "msg",
    )?.[1];

    handler?.({
      type: "msg",
      data: "<div>hello</div>",
    } as MessageEvent);

    expect(onMessage).toHaveBeenCalledTimes(1);

    const [, type, doc] = onMessage.mock.calls[0]!;

    expect(type).toBe("msg");
    expect(doc).toBeDefined();
    expect(doc.body).toBeDefined();
    expect(doc.documentElement).toBeDefined();
    expect(doc.body.innerHTML).toContain("hello");
  });

  it("reopens connection when error occurs in CLOSED state", () => {
    const count = (bridge.EventSource as any).callCount;
    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(["msg"]),
    );

    const instance = (source as any).source;

    instance.readyState = (bridge.EventSource as any).CLOSED ?? 2;

    const errorHandler = addSpy.mock.calls.find(
      ([event]: [string]) => event === "error",
    )?.[1];

    errorHandler?.();

    expect(removeSpy.mock.calls.length).toBeGreaterThan(0);
    expect((bridge.EventSource as any).callCount - count).toBe(2);
  });

  it("does not reopen connection when error occurs and state is not CLOSED", () => {
    const initialCtorCount = (bridge.EventSource as any).callCount;

    new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(["hello"]),
    );

    (bridge.EventSource as any).lastInstance.readyState = 0;

    const errorHandler = addSpy.mock.calls.find(
      ([event]: [string]) => event === "error",
    )?.[1];

    errorHandler?.();

    expect((bridge.EventSource as any).callCount).toBe(initialCtorCount + 1);
  });

  it("opens connection when missing events are added to empty source", () => {
    (bridge.EventSource as any).callCount = 0;

    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(),
    );

    const target = new Set(["a", "b"]);

    source.reconcileWith(target);

    expect((bridge.EventSource as any).callCount).toBe(1);
    expect(addSpy.mock.calls.some(([e]: [string]) => e === "a")).toBe(true);
    expect(addSpy.mock.calls.some(([e]: [string]) => e === "b")).toBe(true);
  });

  it("removes obsolete events during reconciliation", () => {
    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(["a", "b", "c"]),
    );

    const target = new Set(["b"]);

    source.reconcileWith(target);

    expect(removeSpy.mock.calls.some(([e]: [string]) => e === "a")).toBe(true);
    expect(removeSpy.mock.calls.some(([e]: [string]) => e === "c")).toBe(true);
  });

  it("does not reopen connection when reconciliation keeps active state", () => {
    const initial = (bridge.EventSource as any).callCount;

    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(["a"]),
    );

    const target = new Set(["a", "b"]);

    source.reconcileWith(target);

    expect((bridge.EventSource as any).callCount).toBe(initial + 1);
  });

  it("closes connection when reconciliation results in empty set", () => {
    const source = new SseSource(
      new URL("https://example.com"),
      false,
      vi.fn(),
      new Set(["a", "b"]),
    );

    const instance = (bridge.EventSource as any).lastInstance;

    const closeSpy = vi.spyOn(instance, "close");

    source.reconcileWith(new Set()); // becomes empty

    expect(closeSpy).toHaveBeenCalledTimes(1);

    // all previous listeners should be removed
    expect(removeSpy.mock.calls.some(([e]: [string]) => e === "a")).toBe(true);
    expect(removeSpy.mock.calls.some(([e]: [string]) => e === "b")).toBe(true);
  });
});
