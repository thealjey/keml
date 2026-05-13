import { pushRenderPayload } from "../render/data.mts";
import { resolveRequestDescriptor } from "./resolveRequestDescriptor.mts";
import { SseSource } from "./SseSource.mts";

/**
 * Manages multiple SSE sources and dispatches incoming payloads to DOM elements.
 *
 * This class acts as a central registry that:
 * - Tracks DOM elements interested in SSE events
 * - Maintains SSE connections grouped by URL and credentials mode
 * - Routes incoming messages to the appropriate element payload handlers
 * - Reconciles connection state when elements change
 *
 * @remarks
 * Internally maintains a singleton instance for global SSE coordination.
 */
export class SseManager extends Map<string, readonly [SseSource, SseSource]> {
  private readonly elements = new Set<Element>();
  private static _instance: SseManager;

  /**
   * Creates a new SSE manager instance.
   *
   * @param onPayload - Callback invoked when an SSE message is mapped to a DOM
   *                    element payload.
   */
  constructor(private readonly onPayload: (payload: RenderPayload) => number) {
    super();
  }

  /**
   * Global singleton instance of the SSE manager.
   *
   * Lazily initialized using a default payload handler.
   */
  static get instance() {
    return (
      SseManager._instance ??
      (SseManager._instance = new SseManager(pushRenderPayload))
    );
  }

  /**
   * Registers a DOM element as an SSE subscriber.
   *
   * @param el - Element to register.
   */
  addElement = (el: Element) => this.elements.add(el);

  /**
   * Unregisters a DOM element from SSE subscriptions.
   *
   * @param el - Element to remove.
   */
  deleteElement = (el: Element) => this.elements.delete(el);

  /**
   * Extracts the SSE event name associated with an element.
   *
   * @param el - Element containing SSE configuration.
   * @returns Event name, defaulting to `"message"` if not specified.
   */
  getEvent(el: Element) {
    return el.getAttribute("sse") || "message";
  }

  /**
   * Handles incoming SSE messages and dispatches payloads to matching elements.
   *
   * Matches messages based on:
   * - Event type
   * - Source URL
   * - Credentials mode
   *
   * @param source - SSE source emitting the message.
   * @param type - Event type of the message.
   * @param data - Parsed message document.
   */
  onMessage = (source: SseSource, type: string, data: Document) => {
    let doc;

    for (const el of this.elements) {
      const [url, , withCredentials] = resolveRequestDescriptor(el);

      if (
        this.getEvent(el) === type &&
        url.href === source.url.href &&
        withCredentials === source.withCredentials
      ) {
        this.onPayload({
          target: {
            ownerElement: el,
            responseXML: doc ? doc.cloneNode(true) : (doc = data),
            status: 200,
          },
        });
      }
    }
  };

  /**
   * Starts SSE management by reconciling active and required connections.
   *
   * Computes which connections need to be created, updated, or removed
   * based on the currently registered elements.
   */
  start() {
    const outdated = new Map<string, [Set<string>, Set<string>, URL]>();
    const missing = new Map<string, [Set<string>, Set<string>, URL]>();
    const all = new Set<string>();

    for (const el of this.elements) {
      const [url, , withCredentials] = resolveRequestDescriptor(el);
      const collection = this.has(url.href) ? outdated : missing;
      let entry = collection.get(url.href);

      entry || collection.set(url.href, (entry = [new Set(), new Set(), url]));
      entry[+withCredentials as 0 | 1].add(this.getEvent(el));

      all.add(url.href);
    }

    for (const [href, [left, right]] of this) {
      if (!all.has(href)) {
        left.clear();
        right.clear();
        this.delete(href);
      }
    }

    for (const [href, [otherLeft, otherRight]] of outdated) {
      const [left, right] = this.get(href)!;

      left.reconcileWith(otherLeft);
      right.reconcileWith(otherRight);
    }

    for (const [href, [otherLeft, otherRight, url]] of missing) {
      this.set(href, [
        new SseSource(url, false, this.onMessage, otherLeft),
        new SseSource(url, true, this.onMessage, otherRight),
      ]);
    }
  }

  /**
   * Stops all SSE activity and clears all connections and subscriptions.
   */
  stop = () => {
    for (const [left, right] of this.values()) {
      left.clear();
      right.clear();
    }
    this.clear();
  };
}
