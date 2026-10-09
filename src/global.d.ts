interface RenderPayload {
  ownerElement: Element;
  responseXML: Document | null;
  status: number;
  readyState?: number;
}

interface Node {
  cloneNode(subtree?: boolean): this;
  getAttribute: ((qualifiedName: string) => string | null) | undefined;
}

interface Element {
  isError: boolean;
  isTimeout: boolean;
  isIntersecting: boolean;
  isLoading: boolean;
  timeoutId: ReturnType<typeof setTimeout> | undefined;
  checkValidity: (() => boolean) | undefined;
  reset: (() => void) | undefined;
  sizeEntry: ResizeObserverEntry;
  xhr?: RenderPayload[] | undefined;
}

interface XMLHttpRequest {
  ownerElement: Element;
  onloadend: ((res: { target: RenderPayload }) => any) | null;
  onerror: ((res: { target: RenderPayload }) => any) | null;
  ontimeout: ((res: { target: RenderPayload }) => any) | null;
}

interface Window {
  [key: symbol]: boolean;
}

interface Location {
  ownerElement: Element;
}

interface Console {
  ownerElement: Element;
}
