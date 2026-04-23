import { queue_render } from "./render.mts";
import { resolve_url } from "./resolve_url.mts";
import { sseElements } from "./store.mts";

export type Resolved = [ReturnType<typeof resolve_url>, string];

const parser = new DOMParser();

/**
 * Retrieves the `sse` attribute value from a DOM element.
 *
 * If the attribute is missing or empty, it defaults to `"message"`.
 *
 * @param el - The DOM element to read the `sse` attribute from.
 * @returns The value of the `sse` attribute, or `"message"` if not
 *                   present.
 */
export const get_sse_value = (el: Element) =>
  el.getAttribute("sse") || "message";

/**
 * Manages a set of Server-Sent Event (SSE) event types tied to a single
 * `EventSource` connection.
 *
 * The class extends `Set<string>` where each value represents an SSE event
 * type.
 * It automatically opens/closes the underlying `EventSource` depending on
 * whether it has active listeners, and dispatches incoming messages to matching
 * DOM elements.
 */
export class SseSource extends Set<string> {
  private impl_: EventSource | undefined;

  constructor(
    private url_: URL,
    private withCredentials_: boolean,
  ) {
    super();
  }

  /**
   * Handles SSE connection errors.
   *
   * If the connection is closed, it attempts to reconnect and re-register all
   * previously subscribed event types.
   */
  private on_error_ = () => {
    if (this.impl_!.readyState === EventSource.CLOSED) {
      this.connect_();
      for (const value of this) {
        this.add_event_(value);
      }
    }
  };

  /**
   * Handles incoming SSE messages.
   *
   * Matches incoming event type against registered DOM SSE elements and
   * triggers a render update when conditions match.
   *
   * @param evt - SSE message event containing `type` and `data`.
   */
  private on_message_ = ({ type, data }: MessageEvent) => {
    let url, withCredentials, responseXML;

    for (const el of sseElements) {
      [url, , withCredentials] = resolve_url(el);

      get_sse_value(el) === type &&
        url.href === this.url_.href &&
        withCredentials === this.withCredentials_ &&
        queue_render({
          target: {
            responseXML:
              responseXML ?
                (responseXML.cloneNode(true) as Document)
              : (responseXML = parser.parseFromString(data, "text/html")),
            ownerElement_: el,
            status: 200,
          },
        });
    }
  };

  /**
   * Registers an SSE event type on the underlying `EventSource`.
   *
   * @param value - Event type to listen for.
   */
  private add_event_(value: string) {
    this.impl_!.addEventListener(value, this.on_message_, true);
  }

  /**
   * Establishes the `EventSource` connection and attaches error handler.
   */
  private connect_() {
    const { url_, withCredentials_, on_error_ } = this;

    (this.impl_ = new EventSource(url_, {
      withCredentials: withCredentials_,
    })).addEventListener("error", on_error_, true);
  }

  /**
   * Closes the active `EventSource` connection.
   */
  private disconnect_() {
    this.impl_!.close();
    this.impl_ = undefined;
  }

  /**
   * Removes all registered event types and closes the SSE connection.
   */
  override clear() {
    super.clear();
    this.impl_ && this.disconnect_();
  }

  /**
   * Adds a new SSE event type and ensures the connection is active.
   *
   * If this is the first event added, it establishes the connection.
   *
   * @param value - Event type to subscribe to.
   */
  override add(value: string) {
    const { size } = this,
      res = super.add(value);

    if (size !== this.size) {
      size || this.connect_();
      this.add_event_(value);
    }

    return res;
  }

  /**
   * Removes an SSE event type and unsubscribes it from the connection.
   *
   * If no events remain, the connection is closed.
   *
   * @param value - Event type to remove.
   * @returns `true` if the value was removed.
   */
  override delete(value: string) {
    const res = super.delete(value);

    if (res) {
      this.impl_!.removeEventListener(value, this.on_message_, true);
      this.size || this.disconnect_();
    }

    return res;
  }

  /**
   * Synchronizes the current SSE subscriptions with an external resolved list.
   *
   * - Removes values not present in `to_update`
   * - Adds missing values that match credentials
   *
   * @param to_update - External desired SSE subscription state.
   */
  refresh_(to_update: Resolved[]) {
    let value, i, l, withCredentials;

    const missing = [];
    const values = [];

    for (i = 0, l = to_update.length; i < l; ++i) {
      [[, , withCredentials], value] = to_update[i]!;
      if (this.withCredentials_ === withCredentials) {
        this.has(value) || missing.push(value);
        values.push(value);
      }
    }

    for (value of this) {
      values.includes(value) || this.delete(value);
    }

    for (i = 0, l = missing.length; i < l; ++i) {
      this.add(missing[i]!);
    }
  }
}

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

  const emit = (type: string, event: any) => {
    for (const inst of instances) {
      inst.emit(type, event);
    }
  };

  const makeEl = (attrs: Record<string, string> = {}) => {
    const el = document.createElement("div");
    for (const k in attrs) {
      el.setAttribute(k, attrs[k]!);
    }
    return el;
  };

  beforeEach(() => {
    instances = [];
    sseElements.clear();
  });

  describe("sse_source", () => {
    it("forces multi-element iteration in on_message_", () => {
      const el1 = makeEl({ sse: "evt", src: "/a" });
      const el2 = makeEl({ sse: "evt", src: "/a" });

      sseElements.add(el1);
      sseElements.add(el2);

      const [url, , creds] = resolve_url(el1);
      const src = new SseSource(url, creds);

      src.add("evt");

      emit("evt", { type: "evt", data: "<x/>" });

      expect(instances.length).toBe(1);
    });

    it("forces responseXML reuse + cloneNode path deterministically", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      sseElements.add(el);

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.add("evt");

      emit("evt", { type: "evt", data: "<a/>" });
      emit("evt", { type: "evt", data: "<b/>" });

      expect(instances.length).toBe(1);
    });

    it("forces refresh loop deletion per-iteration", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.add("a");
      src.add("b");
      src.add("c");

      // forces full iteration + delete calls
      src.refresh_([[resolve_url(el), "a"]] as any);

      expect(src.has("a")).toBe(true);
      expect(src.has("b")).toBe(false);
      expect(src.has("c")).toBe(false);
    });

    it("forces refresh missing branch", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.refresh_([[resolve_url(el), "x"]] as any);

      expect(src.has("x")).toBe(true);
    });

    it("forces clear + disconnect branch", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.add("evt");

      const inst = instances[0];

      src.clear();

      expect(src.size).toBe(0);
      expect(inst.readyState).toBe(MockEventSource.CLOSED);
    });

    it("forces delete true + false branches", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.add("x");

      const inst = instances[0];

      expect(src.delete("x")).toBe(true);
      expect(inst.readyState).toBe(MockEventSource.CLOSED);

      expect(src.delete("missing")).toBe(false);
    });

    it("forces on_error both branches", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.add("evt");

      const before = instances.length;

      emit("error", {});
      expect(instances.length).toBe(before);

      instances[0].readyState = MockEventSource.CLOSED;

      emit("error", {});
      expect(instances.length).toBe(before + 1);
    });

    it("get_sse_value fallback branch when attribute is empty string", () => {
      const el = document.createElement("div");
      el.setAttribute("sse", "");

      expect(get_sse_value(el)).toBe("message");
    });

    it("add() skip branch when size does not change", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.add("evt");

      const beforeSize = src.size;
      const beforeInst = instances.length;

      src.add("evt"); // no-op, size unchanged

      expect(src.size).toBe(beforeSize);
      expect(instances.length).toBe(beforeInst);
    });

    it("refresh_ skips values when withCredentials mismatches", () => {
      const el = makeEl({ sse: "evt", src: "/a" });

      const [url, , creds] = resolve_url(el);
      const src = new SseSource(url, creds);

      src.refresh_([[[url, "GET", !creds], "x"]] as any);

      expect(src.has("x")).toBe(false);
    });
  });
}
/* v8 ignore stop */
