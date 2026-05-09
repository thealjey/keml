import { bridge } from "./bridge.e.mts";

type SseEventListener = EventListener | ((event: MessageEvent) => void);

/**
 * A wrapper around Server-Sent Events (SSE) that manages event subscriptions,
 * connection lifecycle, and message dispatching.
 *
 * Extends a Set of event names and automatically opens/closes an underlying
 * EventSource connection based on subscription state.
 *
 * Incoming messages are parsed as HTML documents and forwarded to a provided
 * message handler with the associated event type.
 *
 * @remarks
 * The class automatically:
 * - Opens an SSE connection when the first event is added
 * - Closes the connection when the last event is removed
 * - Reconnects on error when the connection is closed
 * - Keeps subscriptions in sync when reconciled with another set
 */
export class SseSource extends Set<string> {
  static parser = new DOMParser();
  private source: InstanceType<(typeof bridge)["EventSource"]> | undefined;

  constructor(
    public readonly url: URL,
    public readonly withCredentials: boolean,
    private readonly onMessage: (
      source: SseSource,
      type: string,
      data: Document,
    ) => void,
    events: Set<string>,
  ) {
    super();

    for (const event of events) {
      this.add(event);
    }
  }

  /**
   * Adds an event listener to the underlying EventSource connection if active.
   *
   * @param event - The SSE event name.
   * @param listener - Callback invoked when the event is received.
   */
  private addEventListener(event: string, listener: SseEventListener) {
    this.source?.addEventListener(event, listener);
  }

  /**
   * Removes an event listener from the underlying EventSource connection if
   * active.
   *
   * @param event - The SSE event name.
   * @param listener - Previously registered callback to remove.
   */
  private removeEventListener(event: string, listener: SseEventListener) {
    this.source?.removeEventListener(event, listener);
  }

  /**
   * Handles SSE connection errors and attempts reconnection if needed.
   */
  private handleError = () => {
    if (this.source?.readyState === bridge.EventSource.CLOSED) {
      this.close();
      this.open();
      for (const event of this) {
        this.addEventListener(event, this.handleMessage);
      }
    }
  };

  /**
   * Handles incoming SSE messages and forwards them to the message handler.
   *
   * @param message - The received SSE message event.
   */
  private handleMessage = ({ type, data }: MessageEvent) =>
    this.onMessage(
      this,
      type,
      SseSource.parser.parseFromString(data, "text/html"),
    );

  /**
   * Opens an SSE connection and attaches core listeners.
   */
  private open() {
    this.source = new bridge.EventSource(this.url, {
      withCredentials: this.withCredentials,
    });
    this.addEventListener("error", this.handleError);
  }

  /**
   * Closes the SSE connection and removes all registered event listeners.
   */
  private close() {
    for (const event of this) {
      this.removeEventListener(event, this.handleMessage);
    }
    this.removeEventListener("error", this.handleError);
    this.source?.close();
    this.source = undefined;
  }

  /**
   * Adds a new SSE event subscription.
   *
   * Automatically opens the connection if this is the first subscription.
   *
   * @param event - Event name to subscribe to.
   * @returns The current instance for chaining.
   */
  override add(event: string) {
    const size = this.size;

    super.add(event);
    if (size !== this.size) {
      size || this.open();
      this.addEventListener(event, this.handleMessage);
    }

    return this;
  }

  /**
   * Removes an SSE event subscription.
   *
   * Automatically closes the connection if no subscriptions remain.
   *
   * @param event - Event name to unsubscribe from.
   * @returns `true` if the event was removed, otherwise `false`.
   */
  override delete(event: string) {
    const result = super.delete(event);

    if (result) {
      this.removeEventListener(event, this.handleMessage);
      this.size || this.close();
    }

    return result;
  }

  /**
   * Clears all SSE event subscriptions and closes the connection.
   */
  override clear() {
    this.close();
    super.clear();
  }

  /**
   * Reconciles the current subscription set with another set of events.
   *
   * Adds missing subscriptions, removes obsolete ones, and ensures the SSE
   * connection state is updated efficiently without unnecessary restarts.
   *
   * @param other - Target set of event names to reconcile with.
   */
  reconcileWith(other: Set<string>) {
    const size = this.size;
    const obsolete = this.difference(other);
    const missing = other.difference(this);

    // does not delegate to this.add and this.delete
    // to prevent the potential unnecessary closing and reopening
    for (const event of obsolete) {
      super.delete(event);
      this.removeEventListener(event, this.handleMessage);
    }
    for (const event of missing) {
      super.add(event);
    }

    if (!size && this.size) {
      this.open();
    } else if (size && !this.size) {
      this.close();
    }

    for (const event of missing) {
      this.addEventListener(event, this.handleMessage);
    }
  }
}
