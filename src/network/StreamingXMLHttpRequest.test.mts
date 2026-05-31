import { beforeEach, describe, expect, it, vi } from "vitest";
import { StreamingXMLHttpRequest } from "./StreamingXMLHttpRequest.mts";
import { bridge } from "./bridge.e.mts";

vi.mock("./bridge.e.mts", () => {
  return {
    bridge: {
      fetch: vi.fn(),
    },
  };
});

function encodeChunks(strs: string[]) {
  const encoder = new TextEncoder();
  return strs.map(s => encoder.encode(s));
}

describe("StreamingXMLHttpRequest", () => {
  let xhr: StreamingXMLHttpRequest;

  beforeEach(() => {
    xhr = new StreamingXMLHttpRequest();
    xhr.ownerElement = document.createElement("div");
    xhr.onloadend = vi.fn();
    xhr.responseText = "";
  });

  it("sets method and url via open()", () => {
    const url = new URL("https://example.com");

    xhr.open("POST", url);

    expect(xhr.init.method).toBe("POST");
    expect(xhr.url).toBe(url);
  });

  it("sets request headers", () => {
    xhr.setRequestHeader("X-Test", "123");

    expect(xhr.init.headers["X-Test"]).toBe("123");
  });

  it("enables credentials when withCredentials = true", () => {
    xhr.withCredentials = true;

    expect(xhr.init.credentials).toBe("include");
  });

  it("streams chunks and calls respond incrementally on delimiter", async () => {
    const url = new URL("https://example.com");

    const chunks = encodeChunks([
      "hello",
      "<!--keml-->",
      "world",
      "<!-- KEML -->",
      "end",
    ]);

    (bridge.fetch as any).mockResolvedValue({
      status: 200,
      body: chunks,
    });

    xhr.open("GET", url);

    await xhr.send(undefined);

    // should be called twice:
    // 1. "hello"
    // 2. "world"
    // final flush: "end"
    expect(xhr.onloadend).toHaveBeenCalledTimes(3);

    const calls = (xhr.onloadend as any).mock.calls;

    expect(calls[0][0].target.responseXML.body.textContent).toContain("hello");
    expect(calls[1][0].target.responseXML.body.textContent).toContain("world");
    expect(calls[2][0].target.responseXML.body.textContent).toContain("end");
  });

  it("handles case where no delimiter exists (single final respond)", async () => {
    const url = new URL("https://example.com");

    const chunks = encodeChunks(["hello ", "world"]);

    (bridge.fetch as any).mockResolvedValue({
      status: 200,
      body: chunks,
    });

    xhr.open("GET", url);

    await xhr.send(undefined);

    expect(xhr.onloadend).toHaveBeenCalledTimes(1);

    const call = (xhr.onloadend as any).mock.calls[0][0];

    expect(call.target.responseXML.body.textContent).toContain("hello world");
  });

  it("passes status and ownerElement correctly", async () => {
    const url = new URL("https://example.com");

    (bridge.fetch as any).mockResolvedValue({
      status: 418,
      body: encodeChunks(["teapot"]),
    });

    const owner = document.createElement("span");
    xhr.ownerElement = owner;

    xhr.open("GET", url);

    await xhr.send(undefined);

    const call = (xhr.onloadend as any).mock.calls[0][0];

    expect(call.target.status).toBe(418);
    expect(call.target.ownerElement).toBe(owner);
  });

  it("uses FormData as request body when provided", async () => {
    const url = new URL("https://example.com");

    const form = new FormData();
    form.append("key", "value");

    (bridge.fetch as any).mockResolvedValue({
      status: 200,
      body: encodeChunks(["ok"]),
    });

    xhr.open("POST", url);

    await xhr.send(form);

    expect(xhr.init.body).toBe(form);

    expect(bridge.fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: "POST",
        body: form,
      }),
    );

    expect(xhr.onloadend).toHaveBeenCalledTimes(1);

    const call = (xhr.onloadend as any).mock.calls[0][0];
    expect(call.target.responseXML.body.textContent).toContain("ok");
  });

  it("does not call onloadend when body is null", async () => {
    const url = new URL("https://example.com");

    (bridge.fetch as any).mockResolvedValue({
      status: 204,
      body: null,
    });

    xhr.open("GET", url);

    await xhr.send(undefined);

    expect(xhr.onloadend).not.toHaveBeenCalled();
    expect(xhr.responseText).toBe("");
  });
});
