import "vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    /**
     * Asserts that the actual DOM element matches the expected one
     * by comparing their normalized HTML output.
     *
     * Normalization includes sorted attributes and indentation for consistent
     * diffs.
     *
     * @param expected - The expected DOM element to match against.
     * @throws {TypeError} If the actual value is not a DOM Element.
     */
    toMatchHTML(expected: Element): T extends Element ? void : never;
  }
}

declare global {
  interface Element {
    isError_: boolean;
    isLoading_: boolean;
    timeoutId_: ReturnType<typeof setTimeout> | undefined;
    checkValidity: typeof HTMLFormElement.prototype.checkValidity | undefined;
    reset: typeof HTMLFormElement.prototype.reset | undefined;
  }

  interface Node {
    checked: typeof HTMLInputElement.prototype.checked | undefined;
    value: typeof HTMLInputElement.prototype.value | undefined;
    getAttribute: typeof Element.prototype.getAttribute | undefined;
  }

  interface XMLHttpRequest {
    ownerElement_: Element;
  }
}
