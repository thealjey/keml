let bridge: {
  XMLHttpRequest: new (
    ...args: ConstructorParameters<typeof XMLHttpRequest>
  ) => Pick<
    InstanceType<typeof XMLHttpRequest>,
    | "onloadend"
    | "open"
    | "ownerElement"
    | "responseType"
    | "send"
    | "setRequestHeader"
    | "withCredentials"
    | "responseXML"
    | "status"
  >;
  EventSource: {
    new (
      ...args: ConstructorParameters<typeof EventSource>
    ): Pick<
      InstanceType<typeof EventSource>,
      "addEventListener" | "close" | "readyState" | "removeEventListener"
    >;
    readonly CLOSED: 2;
  };
  location: Pick<Location, "assign" | "replace" | "href" | "ownerElement">;
  history: Pick<History, "pushState" | "replaceState">;
  window: Pick<Window, "addEventListener">;
  console: Pick<Console, "log" | "ownerElement">;
};

if (process.env["NODE_ENV"] === "test") {
  class XMLHttpRequest {
    responseType: XMLHttpRequestResponseType = "";
    responseXML!: Document;
    withCredentials: boolean = false;
    ownerElement!: Element;
    status!: number;

    onloadend() {}

    open() {}

    setRequestHeader() {}

    send() {}
  }

  class FakeEventSource {
    static readonly CLOSED = 2;
    static callCount = 0;
    static lastInstance: FakeEventSource;
    readyState: number = 0;
    args: ConstructorParameters<typeof EventSource>;

    constructor(...args: ConstructorParameters<typeof EventSource>) {
      this.args = args;
      ++FakeEventSource.callCount;
      FakeEventSource.lastInstance = this;
    }

    addEventListener() {}

    removeEventListener() {}

    close() {}
  }

  bridge = {
    XMLHttpRequest,
    EventSource: FakeEventSource,
    location,
    history,
    window,
    console,
  };
} else if (process.env["NODE_ENV"] === "docs") {
  const parser = new DOMParser();

  function compileTemplate(template: string): (server: any) => string {
    const parts: string[] = [];
    let cursor = 0;

    const regex = /(\{\{[\s\S]*?\}\}|\{[\s\S]*?\})/g;

    parts.push("let out = [];");

    let match: RegExpExecArray | null;

    while ((match = regex.exec(template))) {
      const token = match[0];
      const index = match.index;

      parts.push(`out.push(${JSON.stringify(template.slice(cursor, index))});`);

      if (token.startsWith("{{")) {
        // raw JS block (control flow)
        parts.push(token.slice(2, -2).trim());
      } else {
        // expression evaluated directly in function scope
        const expr = token.slice(1, -1).trim();

        parts.push(`out.push(String(${expr}));`);
      }

      cursor = index + token.length;
    }

    parts.push(`out.push(${JSON.stringify(template.slice(cursor))});`);
    parts.push("return out.join('');");

    return new Function("server", parts.join("\n")) as (server: any) => string;
  }

  const templates = Object.fromEntries(
    Object.entries(process.env["TEMPLATES"]!).map(([key, value]) => [
      key,
      compileTemplate(value as string),
    ]),
  );

  const routes = (
    process.env["ROUTES"] as any as [number, string, string][]
  ).map(
    ([mode, key, value]) => [mode, new RegExp(key), templates[value]] as const,
  );

  const XHR = 0b1;
  const DELAY = 0b10;
  const SSE = 0b100;

  class XMLHttpRequest {
    responseType: XMLHttpRequestResponseType = "";
    responseXML!: Document;
    withCredentials: boolean = false;
    ownerElement!: Element;
    method!: string;
    url!: URL;
    data!: FormData | undefined;
    headers = new Map<string, string>();
    status = 200;

    getParam(key: string) {
      return this.data ? this.data.get(key) : this.url.searchParams.get(key);
    }

    get partial() {
      return this.render(1)[1];
    }

    onloadend(_res: RenderPayload) {}

    open(method: string, url: URL) {
      this.method = method;
      this.url = url;
    }

    setRequestHeader(name: string, value: string) {
      this.headers.set(name, value);
    }

    render(flags?: number) {
      for (const [mode, pattern, handler] of routes) {
        if (
          handler &&
          pattern.test(this.url.href) &&
          (mode & XHR) ===
            ((flags ?? +this.headers.has("X-Requested-With")) & XHR)
        ) {
          return [mode, handler(this)] as const;
        }
      }
      return [0, ""] as const;
    }

    respond = () => this.onloadend({ target: this });

    send(data: FormData | undefined) {
      this.data = data;
      const [mode, html] = this.render();
      const delay = (mode & DELAY) === DELAY;
      this.responseXML = parser.parseFromString(html, "text/html");
      delay ? setTimeout(this.respond, 2000) : this.respond();
    }
  }

  const divideTimestamp =
    (divisor: number, mod: number, label: string, size?: number) =>
    (dividend: number | string) => (
      (dividend = String(
        Math.trunc((dividend as number) / divisor) % mod,
      ).padStart(size!, "0")),
      [dividend, label + (/^0*1$/.test(dividend) ? "" : "s")] as const
    );

  const timestampFormatters = [
    divideTimestamp(1000 * 60 * 60 * 24 * 30 * 12, Infinity, "year"),
    divideTimestamp(1000 * 60 * 60 * 24 * 30, 12, "month"),
    divideTimestamp(1000 * 60 * 60 * 24, 30, "day"),
    divideTimestamp(1000 * 60 * 60, 24, "hour"),
    divideTimestamp(1000 * 60, 60, "minute", 2),
    divideTimestamp(1000, 60, "second", 2),
  ];

  const formatTimestamp = (timestamp: number) =>
    timestampFormatters.map(formatter => formatter(timestamp));

  class EventSource {
    static readonly CLOSED = 2;
    readyState: number = 1;
    url: URL;
    listeners = new Map<
      string,
      Set<(evt: { type: string; data: string }) => any>
    >();
    intervals: number[] = [];

    constructor(url: string | URL) {
      this.url = typeof url === "string" ? new URL(url) : url;

      for (const [mode, pattern, handler] of routes) {
        if (handler && pattern.test(this.url.href) && (mode & SSE) === SSE) {
          handler(this);
          break;
        }
      }
    }

    addIntervalId(id: number) {
      this.intervals.push(id);
    }

    timeSince(timestamp: number) {
      return formatTimestamp(Date.now() - timestamp);
    }

    dispatchEvent(type: string, data: string) {
      for (const listener of this.listeners.get(type) ?? []) {
        listener({ type, data });
      }
    }

    addEventListener(type: string, listener: (...args: any[]) => any) {
      this.listeners.getOrInsert(type, new Set()).add(listener);
    }

    removeEventListener(type: string, listener: (...args: any[]) => any) {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(listener);
        listeners.size || this.listeners.delete(type);
      }
    }

    close() {
      this.listeners.clear();
      for (const id of this.intervals) {
        clearInterval(id);
      }
      this.intervals = [];
    }
  }

  const extractProperties = (obj: Record<any, any>) => {
    const result: Record<any, any> = {};
    let current = obj;
    let i = 0;

    while (++i < 3 && current && current !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(current)) {
        if (key in result) {
          continue;
        }

        try {
          if (obj[key] === current[key]) {
            continue;
          }
        } catch {}
        try {
          result[key] = obj[key];
        } catch {}
      }

      current = Object.getPrototypeOf(current);
    }

    return result;
  };

  class Browser {
    private stack: [URL, boolean][] = [];
    private index = -1;
    private backBtn!: HTMLButtonElement;
    private forwardBtn!: HTMLButtonElement;
    private address!: Text;
    private viewport!: HTMLDivElement;
    private xhr = new XMLHttpRequest();
    private consoleClear?: HTMLButtonElement;
    private consoleOut?: HTMLDivElement;

    private get backPossible() {
      return this.index > 0;
    }

    private get forwardPossible() {
      return this.index < this.stack.length - 1;
    }

    private onloadend = ({ target: { responseXML } }: RenderPayload) =>
      this.viewport.replaceChildren(...(responseXML?.body.childNodes ?? []));

    private back = () => this.render(this.stack[--this.index]![1]);

    private forward = () => this.render(this.stack[++this.index]![1]);

    private clear = () => this.consoleOut?.replaceChildren();

    private render(full: boolean) {
      const url = this.url;
      this.backBtn.disabled = !this.backPossible;
      this.forwardBtn.disabled = !this.forwardPossible;
      this.address.nodeValue = url?.href ?? "about:blank";
      if (!full) {
        fakeLocation.ownerElement = this.el;
        navHandler();
      } else if (url) {
        this.xhr.open("GET", url);
        this.xhr.send(undefined);
      }
    }

    constructor(public el: Element) {
      const {
        children: [first, second, third],
      } = el;
      const nav = first!.children;

      this.backBtn = nav[0] as any;
      this.forwardBtn = nav[1] as any;
      nav[2]!.childNodes.length ||
        nav[2]!.appendChild(document.createTextNode(""));
      this.address = nav[2]!.firstChild as any;
      this.viewport = second as any;
      this.consoleClear = third?.children[0]?.children[0] as any;
      this.consoleOut = third?.children[1] as any;

      this.backBtn.onclick = this.back;
      this.forwardBtn.onclick = this.forward;
      this.xhr.ownerElement = el;
      this.xhr.onloadend = this.onloadend;
      this.consoleClear && (this.consoleClear.onclick = this.clear);

      const href = this.address.nodeValue?.trim();
      if (href) {
        this.stack.push([new URL(href), true]);
        this.index = 0;
      }

      this.render(true);
    }

    get url() {
      return this.stack[this.index]?.[0];
    }

    assign(url: URL, full: boolean) {
      ++this.index;
      this.replace(url, full);
    }

    replace(url: URL, full: boolean) {
      this.stack.length = this.index + 1;
      this.stack[this.index] = [url, full];
      this.render(full);
    }

    log(value: any) {
      if (!this.consoleOut) {
        return;
      }
      const seen = new WeakSet();
      const entry = document.createElement("p");
      const text = JSON.stringify(value, (_key, val) => {
        if (typeof val === "function" || typeof val === "undefined") {
          return undefined;
        }
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) {
            return undefined;
          }
          seen.add(val);
          return extractProperties(val);
        }
        return val;
      });
      const message = document.createTextNode(text);
      entry.setAttribute("title", text);
      entry.classList.add("mv0");
      entry.append(message);
      this.consoleOut.append(entry);
      this.consoleOut.scrollTop = this.consoleOut.scrollHeight;
    }
  }

  const browsers = new Map<Element, Browser>();

  const syncBrowsers = () => {
    Array.from(
      document.getElementsByClassName("browser"),
      el => browsers.has(el) || browsers.set(el, new Browser(el)),
    );
  };

  syncBrowsers();
  new MutationObserver(syncBrowsers).observe(document.body, {
    childList: true,
    subtree: true,
  });

  const fakeLocation = {
    ownerElement: {} as Element,

    get browser() {
      return browsers.get(this.ownerElement.closest(".browser")!);
    },

    get href() {
      return this.browser?.url?.href ?? location.href;
    },

    assign(url: URL) {
      this.browser?.assign(url, true);
    },

    replace(url: URL) {
      this.browser?.replace(url, true);
    },
  };

  const history = {
    pushState(_a: any, _b: any, url: URL) {
      fakeLocation.browser?.assign(url, false);
    },

    replaceState(_a: any, _b: any, url: URL) {
      fakeLocation.browser?.replace(url, false);
    },
  };

  let navHandler: Function;
  const fakeWindow = {
    addEventListener(name: string, callback: (...args: any[]) => any) {
      name === "popstate" && (navHandler = callback);
    },
  };

  const console = {
    ownerElement: {} as Element,

    get browser() {
      return browsers.get(this.ownerElement.closest(".browser")!);
    },

    log(value: any) {
      this.browser?.log(value);
    },
  };

  bridge = {
    XMLHttpRequest,
    EventSource,
    location: fakeLocation,
    history,
    window: fakeWindow,
    console,
  };
} else {
  bridge = { XMLHttpRequest, EventSource, location, history, window, console };
}

export { bridge };
