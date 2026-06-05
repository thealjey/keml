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
  fetch: (
    ...args: Parameters<typeof fetch>
  ) => Promise<Pick<Response, "status" | "body">>;
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
    fetch,
  };
} else if (process.env["NODE_ENV"] === "docs") {
  const parser = new DOMParser();

  const compileTemplate = (template: string): ((server: any) => string) => {
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
        parts.push(token.slice(2, -2).trim());
      } else {
        const expr = token.slice(1, -1).trim();

        parts.push(`out.push(String(${expr}));`);
      }

      cursor = index + token.length;
    }

    parts.push(`out.push(${JSON.stringify(template.slice(cursor))});`);
    parts.push("return out.join('');");

    return new Function("server", parts.join("\n")) as (server: any) => string;
  };

  const generateSeries = (n: number): number[] => {
    const p = Array.from(
      { length: 10 },
      () => (Math.random() * (90 - 10 + 1) + 10) | 0,
    );
    const result = new Array<number>(n);

    const get = (i: number) => {
      if (i < 0) {
        return p[0]! + (p[0]! - p[1]!);
      }
      if (i >= p.length) {
        const n = p.length;
        return p[n - 1]! + (p[n - 1]! - p[n - 2]!);
      }
      return p[i]!;
    };

    for (let i = 0; i < n; ++i) {
      const t = (i / (n - 1)) * (p.length - 1);
      const i0 = Math.floor(t);
      const t0 = t - i0;

      const p0 = get(i0 - 1);
      const p1 = get(i0);
      const p2 = get(i0 + 1);
      const p3 = get(i0 + 2);

      const v =
        0.5 *
        (2 * p1 +
          (-p0 + p2) * t0 +
          (2 * p0 - 5 * p1 + 4 * p2 - p3) * t0 * t0 +
          (-p0 + 3 * p1 - 3 * p2 + p3) * t0 * t0 * t0);

      result[i] = v;
    }

    return result;
  };

  const sampleSeries = (series: number[], width: number): number[] => {
    width |= 0;
    if (width < 1) {
      return [];
    }

    const n = series.length;

    if (width === 1) {
      return [series[(n / 2) | 0]!];
    }

    if (width > n) {
      return series;
    }

    const result = new Array(width);

    for (let x = 0, t; x < width; ++x) {
      t = x / (width - 1);
      result[x] = series[Math.round(t * (n - 1))];
    }

    return result;
  };

  const toFixed = (input: number, fractionDigits = 2) =>
    parseFloat(input.toFixed(fractionDigits));

  const joinAttrs = ([key, val]: [string, string]) =>
    key + "=" + '"' + val + '"';
  const printAttrs = (obj: object) =>
    Object.entries(obj).map(joinAttrs).join(" ");

  const generateChart = (
    series: number[],
    data: number[],
    width: number,
    height: number,
  ) => {
    const n = data.length;

    return {
      path: printAttrs({
        d: data
          .reduce(
            (acc, val, i) => (
              (acc[i] =
                `${i ? "L" : "M"} ${toFixed((i / (n - 1)) * width)} ${toFixed(height - (val / 100) * height)}`),
              acc
            ),
            new Array<string>(n),
          )
          .join(" "),
      }),
      xTicks: Array.from({ length: 11 }, (_, i) => {
        const index = toFixed(i / 10);
        const y = toFixed(index * width - 1);

        const text = printAttrs(
          i ?
            {
              x: 10 - height,
              y: y + (i < 10 ? 4 : 0),
              transform: "rotate(-90)",
            }
          : { x: y + 10, y: height - 10 },
        );

        return {
          line: printAttrs({
            x1: y,
            y1: height,
            x2: y,
            y2: height - 6,
          }),
          text,
          label: (index * series.length).toLocaleString(),
        };
      }),
      yTicks: Array.from({ length: 6 }, (_, i) => {
        const value = i / 5;
        const y = toFixed(height - value * height + 1);

        return {
          line: printAttrs({ x1: 0, y1: y, x2: 6, y2: y }),
          text: printAttrs({ x: 10, y: y + (!i || i > 4 ? 10 : 4) }),
          label: toFixed(value * 100),
        };
      }),
      xAxis: printAttrs({ x1: 0, y1: 0, x2: 0, y2: height }),
      yAxis: printAttrs({ x1: 0, y1: height, x2: width, y2: height }),
    };
  };

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
  const STREAM = 0b1000;
  const ser = generateSeries(10_000_000);

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
    series = ser;
    sampleSeries = sampleSeries;
    generateChart = generateChart;

    getParam(key: string) {
      return this.data ? this.data.get(key) : this.url.searchParams.get(key);
    }

    get partial() {
      return this.render(XHR)[1];
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
      this.responseXML = parser.parseFromString(html, "text/html");
      mode & DELAY ? setTimeout(this.respond, 2000) : this.respond();
    }
  }

  const encoder = new TextEncoder();

  const fetch = async (
    input: string | URL | Request,
    init: RequestInit = {},
  ) => {
    let controller: ReadableStreamDefaultController<Uint8Array>;
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        controller = c;
      },
    });
    const { headers, credentials, method, body } = init;
    const server = {
      headers:
        headers ?
          Array.isArray(headers) ? new Map(headers)
          : headers instanceof Headers ? headers
          : new Map(Object.entries(headers))
        : new Map<string, string>(),
      withCredentials: credentials !== "omit",
      method,
      url:
        typeof input === "string" ? new URL(input)
        : input instanceof Request ? new URL(input.url)
        : input,
      data: body as FormData,
      status: 200,

      getParam(key: string) {
        return this.data ? this.data.get(key) : this.url.searchParams.get(key);
      },

      write(message: string) {
        controller.enqueue(encoder.encode(message));
      },

      end() {
        controller.close();
      },

      get partial() {
        return this.render(STREAM)[1];
      },

      render(flags?: number) {
        for (const [mode, pattern, handler] of routes) {
          if (
            handler &&
            pattern.test(this.url.href) &&
            (flags ?? mode) & STREAM
          ) {
            return [mode, handler(this)] as const;
          }
        }
        return [0, ""] as const;
      },
    };

    server.write(server.render()[1]);

    return new Response(stream);
  };

  const timeSteps = [
    ["years", "year", 31104000000],
    ["months", "month", 2592000000],
    ["days", "day", 86400000],
    ["hours", "hour", 3600000],
    ["minutes", "minute", 60000],
    ["seconds", "second", 1000],
  ] as const;
  const timeResult: [string, string][] = [[], [], [], [], [], []] as any;

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
        if (handler && pattern.test(this.url.href) && mode & SSE) {
          handler(this);
          break;
        }
      }
    }

    addIntervalId(id: number) {
      this.intervals.push(id);
    }

    timeSince(timestamp: number) {
      let offset = Date.now() - timestamp,
        step,
        i = -1,
        value,
        multi,
        result;

      while (++i < 6) {
        step = timeSteps[i]!;
        result = timeResult[i]!;
        multi = step[2];
        value = (offset / multi) | 0;
        offset -= value * multi;
        result[0] = (i > 3 && value < 10 ? "0" : "") + value;
        result[1] = step[+(value === 1) as 0 | 1];
      }

      return timeResult;
    }

    dispatchEvent(type: string, data: string) {
      for (const listener of this.listeners.get(type) ?? []) {
        listener({ type, data });
      }
    }

    addEventListener(type: string, listener: (...args: any[]) => any) {
      let bag = this.listeners.get(type);
      bag || this.listeners.set(type, (bag = new Set()));
      bag.add(listener);
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
    fetch,
  };
} else {
  bridge = {
    XMLHttpRequest,
    EventSource,
    location,
    history,
    window,
    console,
    fetch,
  };
}

export { bridge };
