import { parseHTML } from "../util/parseHTML.mts";
import { bridge } from "./bridge.e.mts";

const DELIM = /<!--\s*keml\s*-->/i;
const decodeOptions: TextDecodeOptions = { stream: true };
const decoder = new TextDecoder();

/**
 * XMLHttpRequest-compatible interface with extended response lifetime semantics.
 *
 * Contract:
 * - Fully compatible with XMLHttpRequest request setup and usage patterns.
 * - Request construction, headers, credentials, and sending behave identically.
 *
 * Key difference:
 * - Unlike XMLHttpRequest, which produces exactly one response per request,
 *   this interface supports multiple response deliveries over time.
 * - A request may produce zero, one, or many incremental response events.
 * - The response stream may optionally terminate, but is not required to.
 *
 * All other behavior is identical to XMLHttpRequest semantics.
 */
export class StreamingXMLHttpRequest {
  /**
   * Expected response type (fixed to "document" for compatibility).
   */
  responseType!: "document";

  /**
   * Element associated with this request context (used in callbacks).
   */
  ownerElement!: Element;

  /**
   * Target request URL.
   */
  url!: URL;

  /**
   * Finalization callback invoked after each logical response chunk.
   */
  onloadend!: (res: RenderPayload) => any;

  /**
   * Internal RequestInit used for bridge.fetch.
   */
  init: RequestInit & { headers: Record<string, string> } = { headers: {} };

  /**
   * Accumulated decoded response text (including incomplete streaming chunks).
   */
  responseText = "";

  /**
   * Initializes the request.
   *
   * @param method HTTP method (e.g. "GET", "POST")
   * @param url Target request URL
   */
  open(method: string, url: URL) {
    this.init.method = method;
    this.url = url;
  }

  /**
   * Sets a request header.
   *
   * @param name Header name
   * @param value Header value
   */
  setRequestHeader(name: string, value: string) {
    this.init.headers[name] = value;
  }

  /**
   * Controls credential inclusion.
   *
   * If set to true, requests are sent with credentials included.
   *
   * @param value Whether to include credentials
   */
  set withCredentials(value: boolean) {
    value && (this.init.credentials = "include");
  }

  /**
   * Sends the request and processes a streaming response.
   *
   * The response body is read as a stream, decoded incrementally, and split
   * into logical responses using the `<!-- keml -->` delimiter.
   *
   * Each completed segment triggers `onloadend`.
   *
   * @param data Optional form data payload
   */
  async send(data: FormData | undefined) {
    data && (this.init.body = data);

    const { status, body } = await bridge.fetch(this.url, this.init);

    if (body) {
      for await (const chunk of body) {
        this.responseText += decoder.decode(chunk, decodeOptions);

        let match: RegExpExecArray | null;
        while ((match = DELIM.exec(this.responseText))) {
          this.respond(this.responseText.slice(0, match.index), status);
          this.responseText = this.responseText.slice(
            match.index + match[0].length,
          );
        }
      }

      this.respond(this.responseText, status);
    }
  }

  /**
   * Emits a parsed response segment to the consumer.
   *
   * @param html Raw HTML string for this response segment
   * @param status HTTP status code from the original request
   */
  respond(html: string, status: number) {
    this.onloadend({
      target: {
        status,
        responseXML: parseHTML(html),
        ownerElement: this.ownerElement,
      },
    });
  }
}
