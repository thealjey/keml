import { resolve_url } from "./resolve_url.mts";
import { get_sse_value, type Resolved, SseSource } from "./sse_source.mts";
import { sseElements } from "./store.mts";

const manager = new Map<string, readonly [SseSource, SseSource]>();

/**
 * Clears both SSE sources in a paired tuple.
 *
 * This effectively unsubscribes all event types and closes any active
 * connections managed by each `SseSource`.
 *
 * @param pair - A tuple containing two SSE sources.
 */
const clear_pair = ([left, right]: readonly [SseSource, SseSource]) => {
  left.clear();
  right.clear();
};

/**
 * Initializes and synchronizes all SSE sources based on current DOM state.
 *
 * This function:
 * - Scans all `sseElements` in the document
 * - Groups them by resolved URL (`href`)
 * - Removes SSE sources that are no longer present in the DOM
 * - Creates new `SseSource` pairs (credentialed / non-credentialed) for new URLs
 * - Refreshes existing sources with updated subscriptions
 *
 * Internally, each URL is managed as a pair of `SseSource` instances:
 * one with credentials enabled and one without.
 */
export const sse_start = () => {
  let tuple, href, el, i, l, url, withCredentials, value, pair, left, right;

  const missing: Resolved[] = [];
  const hrefs: string[] = [];
  const update: Resolved[] = [];

  for (el of sseElements) {
    tuple = resolve_url(el);
    href = tuple[0].href;
    (manager.has(href) ? update : missing).push([tuple, get_sse_value(el)]);
    hrefs.push(href);
  }

  for ([href, pair] of manager) {
    if (!hrefs.includes(href)) {
      clear_pair(pair);
      manager.delete(href);
    }
  }

  for (i = 0, l = missing.length; i < l; ++i) {
    [[url, , withCredentials], value] = missing[i]!;
    pair = [new SseSource(url, false), new SseSource(url, true)] as const;
    manager.set(url.href, pair);
    pair[+withCredentials as 0 | 1].add(value);
  }

  for (i = 0, l = update.length; i < l; ++i) {
    [url] = update[i]![0];
    [left, right] = manager.get(url.href)!;
    left.refresh_(update);
    right.refresh_(update);
  }
};

/**
 * Stops all active SSE connections and clears the SSE manager state.
 *
 * This function:
 * - Iterates over all managed SSE source pairs
 * - Clears each pair (closing connections and removing subscriptions)
 * - Empties the global manager
 *
 * After calling this, no SSE connections remain active.
 */
export const sse_stop = () => {
  manager.forEach(clear_pair);
  manager.clear();
};

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    it,
    expect,
    beforeEach,
    vi: { stubGlobal },
  } = import.meta.vitest;

  let instances: any[] = [];

  class MockEventSource {
    static CLOSED = 2;
    readyState = 1;
    listeners: Record<string, Function[]> = {};

    constructor() {
      instances.push(this);
    }

    addEventListener(type: string, fn: Function) {
      (this.listeners[type] ||= []).push(fn);
    }

    removeEventListener(type: string, fn: Function) {
      this.listeners[type] = (this.listeners[type] || []).filter(f => f !== fn);
    }

    close() {
      this.readyState = MockEventSource.CLOSED;
    }

    emit(type: string, event: any) {
      for (const fn of this.listeners[type] || []) {
        fn(event);
      }
    }
  }

  stubGlobal("EventSource", MockEventSource);

  const makeEl = (attrs: Record<string, string> = {}) => {
    const el = document.createElement("div");
    for (const k in attrs) {
      el.setAttribute(k, attrs[k]!);
    }
    return el;
  };

  const setElements = (els: Element[]) => {
    sseElements.clear();
    for (const el of els) {
      sseElements.add(el);
    }
  };

  beforeEach(() => {
    instances = [];
    sseElements.clear();
    manager.clear();
  });

  describe("sse_start + see_stop", () => {
    it("creates missing sources", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      setElements([el]);

      sse_start();

      expect(manager.size).toBe(1);
      expect(instances.length).toBeGreaterThanOrEqual(1);
    });

    it("reuses existing manager entry on update", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      setElements([el]);

      sse_start();
      sse_start();

      expect(manager.size).toBe(1);
    });

    it("removes missing href entries", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      setElements([el]);

      sse_start();

      setElements([]);

      sse_start();

      expect(manager.size).toBe(0);
    });

    it("splits by credentials flag", () => {
      const el = makeEl({ sse: "evt", src: "/a", credentials: "true" });

      setElements([el]);

      sse_start();

      expect(manager.size).toBe(1);
    });

    it("refresh path does not change manager size", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      setElements([el]);

      sse_start();

      const before = manager.size;

      sse_start();

      expect(manager.size).toBe(before);
    });

    it("see_stop clears manager and sources", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      setElements([el]);

      sse_start();

      sse_stop();

      expect(manager.size).toBe(0);
    });
  });
}
/* v8 ignore stop */
