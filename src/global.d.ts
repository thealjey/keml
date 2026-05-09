interface RenderPayload {
  target: {
    ownerElement: Element;
    responseXML: Document | null;
    status: number;
  };
}

interface Node {
  cloneNode(subtree?: boolean): this;
  getAttribute: ((qualifiedName: string) => string | null) | undefined;
}

interface Element {
  isError: boolean;
  isIntersecting: boolean;
  isLoading: boolean;
  timeoutId: ReturnType<typeof setTimeout> | undefined;
  checkValidity: (() => boolean) | undefined;
  reset: (() => void) | undefined;
}

interface XMLHttpRequest {
  ownerElement: Element;
  onloadend(res: RenderPayload): any;
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
