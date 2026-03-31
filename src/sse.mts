import { queue_render } from "./render.mts";
import { resolve_url } from "./resolve_url.mts";
import {
  sourcesWithCredentials,
  sourcesWithoutCredentials,
  sseElements,
} from "./store.mts";

const parser = new DOMParser();

/**
 * Retrieves the SSE value for a given element.
 *
 * This function checks the `sse` attribute on a DOM element and returns its
 * trimmed string value. If the attribute is missing or empty, it defaults
 * to `"message"`.
 *
 * @param el - The DOM element to inspect.
 * @returns The SSE event name as a string.
 *
 * @example
 * const el = document.createElement("div");
 * el.setAttribute("sse", "update");
 * get_sse_value(el); // "update"
 *
 * const el2 = document.createElement("div");
 * get_sse_value(el2); // "message"
 */
const get_sse_value = (el: Element) =>
  el.getAttribute("sse")?.trim() || "message";

/**
 * Handles an SSE `message` event for an EventSource instance.
 *
 * This function iterates over the corresponding sources map (with or without
 * credentials) and checks each element in `sseElements`. When a source matches
 * and the element's SSE value equals the event type and its resolved URL
 * matches the source endpoint, a render is queued via `queue_render`.
 *
 * @param this - The EventSource instance emitting the message.
 * @param e - The MessageEvent object containing the data and type.
 *
 * @remarks
 * This function is intended to be bound to an EventSource instance.
 *
 * @example
 * const source = new EventSource("https://example.com/api/");
 * source.addEventListener("message", on_message);
 */
function on_message(this: EventSource, e: MessageEvent) {
  let url, withCredentials;

  for (const el of sseElements) {
    [url, , withCredentials] = resolve_url(el);
    if (
      get_sse_value(el) === e.type &&
      url.href === this.url &&
      withCredentials === this.withCredentials
    ) {
      queue_render({
        target: {
          responseXML: parser.parseFromString(e.data, "text/html"),
          ownerElement_: el,
          status: 200,
        },
      });
    }
  }
}

/**
 * Handles an SSE `error` event for an EventSource instance.
 *
 * If the EventSource is closed, this function attempts to reconnect by
 * creating a new EventSource for the same endpoint, re-attaching all
 * registered event listeners, and replacing the old source in the map.
 *
 * @param this - The EventSource instance that emitted the error.
 *
 * @remarks
 * This function is intended to be bound to an EventSource instance.
 *
 * @example
 * const source = new EventSource("https://example.com/api/");
 * source.addEventListener("error", on_error);
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
 * Cleans up SSE sources by removing obsolete events or closing sources.
 *
 * This function iterates over all sources and checks whether the events
 * currently registered (`current`) match the events in the source (`sources`).
 * If an event no longer exists in the current set, its listener is removed.
 * If a source no longer has any events remaining, the source is closed and
 * removed from the map.
 *
 * @param current - Map of current URL endpoints to their active SSE events.
 * @param sources - Map of URL endpoints to their associated SSE source objects.
 *
 * @example
 * clean(currentWithoutCredentials, sourcesWithoutCredentials);
 */
const clean = (current: Map<string, Events>, sources: Map<string, Item>) => {
  let events, sseValue;

  for (const [url, item] of sources) {
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
 * Initializes SSE connections for all elements in `sseElements`.
 *
 * This function:
 * - Determines the SSE value, URL, and credentials for each element.
 * - Updates internal maps of current events
 *   (`currentWithCredentials` / `currentWithoutCredentials`).
 * - Creates new EventSource objects if needed.
 * - Attaches event listeners (`on_message` and `on_error`) to sources.
 * - Cleans up sources that are no longer active.
 *
 * Multiple elements with the same URL will aggregate their events,
 * ensuring each EventSource listens for all relevant SSE types.
 *
 * @example
 * sseElements.add(document.createElement("div"));
 * sse(); // Sets up SSE connections for all elements
 */
export const sse = () => {
  const currentWithCredentials = new Map<string, Events>();
  const currentWithoutCredentials = new Map<string, Events>();
  let sseValue, url, withCredentials, current, sources, item;

  for (const el of sseElements) {
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
    vi: { fn },
  } = import.meta.vitest;

  describe("sse", () => {
    it("get_sse_value returns trimmed attribute value", () => {
      const el = document.createElement("div");
      el.setAttribute("sse", "custom");
      expect(get_sse_value(el)).toBe("custom");
    });

    it("get_sse_value trims whitespace", () => {
      const el = document.createElement("div");
      el.setAttribute("sse", "  event  ");
      expect(get_sse_value(el)).toBe("event");
    });

    it("get_sse_value falls back when attribute is empty", () => {
      const el = document.createElement("div");
      el.setAttribute("sse", "   ");
      expect(get_sse_value(el)).toBe("message");
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

    it("on_message does nothing if URL or credentials mismatch", () => {
      const queue_render = fn();

      const el = document.createElement("div");
      el.setAttribute("sse", "message");
      el.setAttribute("href", "https://example.com/b/");

      sseElements.clear();
      sseElements.add(el);

      const src = new EventSource("https://example.com/a/", {
        withCredentials: false,
      });

      expect(() =>
        on_message.call(
          src,
          new MessageEvent("message", { data: "<p>ok</p>" }),
        ),
      ).not.toThrow();

      expect(queue_render).not.toHaveBeenCalled();
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
