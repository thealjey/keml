import { queue_render } from "./render.mts";
import { resolve_url } from "./resolve_url.mts";
import {
  sourcesWithCredentials,
  sourcesWithoutCredentials,
  sseElements,
} from "./store.mts";

const parser = new DOMParser();

/**
 * Returns the SSE event type defined on an element, defaulting to "message".
 *
 * @param el - Source element
 * @returns SSE event type
 */
const get_sse_value = (el: Element) => el.getAttribute("sse") || "message";

/**
 * Handles incoming SSE messages and routes them to matching elements,
 * queuing a render task with the parsed payload when a match is found.
 *
 * @param this - EventSource instance emitting the message
 * @param e - SSE message event
 */
function on_message(this: EventSource, e: MessageEvent) {
  let url, withCredentials, responseXML, el;

  for (el of sseElements) {
    [url, , withCredentials] = resolve_url(el);
    if (
      get_sse_value(el) === e.type &&
      url.href === this.url &&
      withCredentials === this.withCredentials
    ) {
      queue_render({
        target: {
          responseXML:
            responseXML ?
              (responseXML.cloneNode(true) as Document)
            : (responseXML = parser.parseFromString(e.data, "text/html")),
          ownerElement_: el,
          status: 200,
        },
      });
    }
  }
}

/**
 * Handles SSE connection errors by recreating the EventSource when closed
 * and restoring previously registered event listeners.
 *
 * @param this - EventSource instance that triggered the error
 */
function on_error(this: EventSource) {
  const sources =
    this.withCredentials ? sourcesWithCredentials : sourcesWithoutCredentials;
  const item = sources.get(this.url);

  if (item && this.readyState === EventSource.CLOSED) {
    const source = new EventSource(this.url, {
      withCredentials: this.withCredentials,
    });

    for (const event of item.events_) {
      source.addEventListener(event, on_message);
    }

    source.addEventListener("error", on_error);
    item.source_ = source;
  }
}

/**
 * Synchronizes active SSE sources with the current event registry,
 * removing stale event listeners and closing unused sources.
 *
 * @param current - Active event mapping by URL
 * @param sources - SSE source registry
 */
const clean = (current: Map<string, Events>, sources: Map<string, Item>) => {
  let events, sseValue, url, item;

  for ([url, item] of sources) {
    if (!(events = current.get(url))) {
      item.source_.close();
      sources.delete(url);
    } else {
      for (sseValue of item.events_) {
        if (!events.has(sseValue)) {
          item.source_.removeEventListener(sseValue, on_message);
          item.events_.delete(sseValue);
        }
      }
      if (!item.events_.size) {
        item.source_.close();
        sources.delete(url);
      }
    }
  }
};

/**
 * Synchronizes SSE element registrations with active EventSource connections.
 *
 * Ensures that:
 * - Required SSE event types are registered per URL
 * - EventSource instances are created or updated as needed
 * - Stale event listeners and unused sources are cleaned up
 * - Separate tracking is maintained for credentialed and non-credentialed
 *   sources
 */
export const sse = () => {
  const currentWithCredentials = new Map<string, Events>();
  const currentWithoutCredentials = new Map<string, Events>();
  let sseValue, url, withCredentials, current, sources, item, el;

  for (el of sseElements) {
    sseValue = get_sse_value(el);
    [url, , withCredentials] = resolve_url(el);

    if (withCredentials) {
      current = currentWithCredentials;
      sources = sourcesWithCredentials;
    } else {
      current = currentWithoutCredentials;
      sources = sourcesWithoutCredentials;
    }

    if (!(item = current.get(url.href))) {
      current.set(url.href, new Set([sseValue]));
    } else if (!item.has(sseValue)) {
      item.add(sseValue);
    }

    if (!(item = sources.get(url.href))) {
      sources.set(
        url.href,
        (item = {
          source_: new EventSource(url, { withCredentials }),
          events_: new Set([sseValue]),
        }),
      );
      item.source_.addEventListener(sseValue, on_message);
      item.source_.addEventListener("error", on_error);
    } else if (!item.events_.has(sseValue)) {
      item.events_.add(sseValue);
      item.source_.addEventListener(sseValue, on_message);
    }
  }

  clean(currentWithCredentials, sourcesWithCredentials);
  clean(currentWithoutCredentials, sourcesWithoutCredentials);
};

/* v8 ignore start */
if (import.meta.vitest) {
  const {
    describe,
    it,
    expect,
    vi: { spyOn },
  } = import.meta.vitest;

  describe("sse", () => {
    it("get_sse_value returns trimmed attribute value", () => {
      const el = document.createElement("div");
      el.setAttribute("sse", "custom");
      expect(get_sse_value(el)).toBe("custom");
    });

    it("get_sse_value falls back when attribute is missing", () => {
      const el = document.createElement("div");
      expect(get_sse_value(el)).toBe("message");
    });

    it("on_message queues render for matching element", () => {
      // Mock element matching the EventSource
      const el = document.createElement("div");
      el.setAttribute("sse", "message");
      el.setAttribute("href", "https://example.com/a/");

      sseElements.clear();
      sseElements.add(el);

      // EventSource instance
      const src = new EventSource("https://example.com/a/", {
        withCredentials: false,
      });

      // Call the new on_message
      expect(() =>
        on_message.call(
          src,
          new MessageEvent("message", { data: "<p>ok</p>" }),
        ),
      ).not.toThrow();
    });

    it("on_message skips mismatches and clones responseXML only for subsequent matches", () => {
      const cloneSpy = spyOn(Node.prototype, "cloneNode");

      const mismatchEl = document.createElement("div");
      mismatchEl.setAttribute("sse", "message");
      mismatchEl.setAttribute("href", "https://example.com/b/");

      const matchEl1 = document.createElement("div");
      matchEl1.setAttribute("sse", "message");
      matchEl1.setAttribute("href", "https://example.com/a/");

      const matchEl2 = document.createElement("div");
      matchEl2.setAttribute("sse", "message");
      matchEl2.setAttribute("href", "https://example.com/a/");

      sseElements.clear();
      sseElements.add(mismatchEl);
      sseElements.add(matchEl1);
      sseElements.add(matchEl2);

      const src = new EventSource("https://example.com/a/", {
        withCredentials: false,
      });

      const before = cloneSpy.mock.calls.length;
      on_message.call(src, new MessageEvent("message", { data: "<p>ok</p>" }));
      const after = cloneSpy.mock.calls.length;

      expect(after - before).toBeGreaterThan(0);

      cloneSpy.mockRestore();
    });

    it("on_error reconnects when readyState is CLOSED and item exists", () => {
      const url = "https://example.com/a/";
      const src = new EventSource(url, { withCredentials: false });
      // @ts-ignore
      src.readyState = EventSource.CLOSED;

      const item = { source_: src, events_: new Set(["message"]) };
      sourcesWithoutCredentials.set(url, item);

      expect(() => on_error.call(src)).not.toThrow();

      // item.source_ should now be a new EventSource instance
      expect(item.source_).not.toBe(src);

      sourcesWithoutCredentials.clear();
    });

    it("on_error does nothing if readyState is not CLOSED", () => {
      const url = "https://example.com/a/";
      const src = new EventSource(url, { withCredentials: false });
      // @ts-ignore
      src.readyState = EventSource.OPEN;

      const item = { source_: src, events_: new Set(["message"]) };
      sourcesWithoutCredentials.set(url, item);

      expect(() => on_error.call(src)).not.toThrow();

      // source should remain the same
      expect(item.source_).toBe(src);

      sourcesWithoutCredentials.clear();
    });

    it("on_error does nothing if item does not exist in sources map", () => {
      const src = new EventSource("https://example.com/nonexistent/", {
        withCredentials: false,
      });
      // @ts-ignore
      src.readyState = EventSource.CLOSED;

      expect(() => on_error.call(src)).not.toThrow();
    });

    it("on_error reconnects for sourcesWithCredentials when readyState is CLOSED", () => {
      const url = "https://example.com/secure/";
      const src = new EventSource(url, { withCredentials: true });
      // @ts-ignore
      src.readyState = EventSource.CLOSED;

      const item = { source_: src, events_: new Set(["message"]) };
      sourcesWithCredentials.set(url, item);

      expect(() => on_error.call(src)).not.toThrow();

      // item.source_ should now be a new EventSource instance
      expect(item.source_).not.toBe(src);

      sourcesWithCredentials.clear();
    });

    it("clean removes sources when current.get(url) is undefined", () => {
      const current = new Map<string, Set<string>>();
      const source = { close: () => {}, removeEventListener: () => {} };
      const sources = new Map<string, Item>();

      sources.set("https://example.com/a/", {
        source_: source as any,
        events_: new Set(["message"]),
      });

      expect(() => clean(current, sources)).not.toThrow();

      expect(sources.size).toBe(0);
    });

    it("clean removes missing events from item.events_", () => {
      const current = new Map<string, Set<string>>();
      current.set("https://example.com/b/", new Set(["message"]));

      const closed = { closed: false };
      const source = {
        close: () => {
          closed.closed = true;
        },
        removeEventListener: () => {},
      };

      const events = new Set(["message", "update"]);
      const sources = new Map<string, Item>();
      sources.set("https://example.com/b/", {
        source_: source as any,
        events_: events,
      });

      expect(() => clean(current, sources)).not.toThrow();

      expect(events.has("update")).toBe(false); // removed
      expect(events.has("message")).toBe(true); // kept
      expect(closed.closed).toBe(false); // still not closed
      expect(sources.size).toBe(1);
    });

    it("clean closes source and deletes from sources if all events removed", () => {
      const current = new Map<string, Set<string>>();
      current.set("https://example.com/c/", new Set());

      let closed = false;
      const source = {
        close: () => {
          closed = true;
        },
        removeEventListener: () => {},
      };

      const events = new Set(["message"]);
      const sources = new Map<string, Item>();
      sources.set("https://example.com/c/", {
        source_: source as any,
        events_: events,
      });

      expect(() => clean(current, sources)).not.toThrow();

      expect(closed).toBe(true);
      expect(sources.size).toBe(0);
    });

    it("sse covers all if and else branches including existing sseValue", () => {
      // Elements for non-credential URL
      const el1 = document.createElement("div");
      el1.setAttribute("sse", "message");
      el1.setAttribute("href", "https://example.com/a/");

      const el2 = document.createElement("div");
      el2.setAttribute("sse", "update");
      el2.setAttribute("href", "https://example.com/a/");

      const el5 = document.createElement("div");
      el5.setAttribute("sse", "message"); // duplicate sseValue to hit else
      el5.setAttribute("href", "https://example.com/a/");

      // Elements for credential URL
      const el3 = document.createElement("div");
      el3.setAttribute("sse", "event");
      el3.setAttribute("href", "https://example.com/b/");
      el3.setAttribute("credentials", "");

      const el4 = document.createElement("div");
      el4.setAttribute("sse", "refresh");
      el4.setAttribute("href", "https://example.com/b/");
      el4.setAttribute("credentials", "");

      const el6 = document.createElement("div");
      el6.setAttribute("sse", "event"); // duplicate sseValue to hit else
      el6.setAttribute("href", "https://example.com/b/");
      el6.setAttribute("credentials", "");

      sseElements.clear();
      sseElements.add(el1);
      sseElements.add(el2);
      sseElements.add(el5);
      sseElements.add(el3);
      sseElements.add(el4);
      sseElements.add(el6);

      expect(() => sse()).not.toThrow();

      // sources maps are populated
      expect(sourcesWithoutCredentials.size).toBe(1);
      expect(sourcesWithCredentials.size).toBe(1);
    });
  });
}
/* v8 ignore stop */
