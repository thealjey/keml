import { beforeEach, describe, expect, it, vi } from "vitest";

/* ---------------- mocks ---------------- */

vi.mock("./findFirstEquivalentNode.mts", () => ({
  findFirstEquivalentNode: vi.fn(),
}));

vi.mock("./state.mts", () => ({
  disableState: vi.fn(),
}));

vi.mock("./writeAttribute.mts", () => ({
  writeAttribute: vi.fn(),
}));

/* ---------------- imports ---------------- */

import { findFirstEquivalentNode } from "./findFirstEquivalentNode.mts";
import { patchers } from "./patchers.mts";
import { disableState } from "./state.mts";
import { writeAttribute } from "./writeAttribute.mts";

/* ---------------- setup ---------------- */

beforeEach(() => {
  vi.clearAllMocks();
});

/* ---------------- tests ---------------- */

describe("patchers (baseline)", () => {
  it("replaceWith removes node when no nodes provided", () => {
    const node = document.createElement("div");
    node.remove = vi.fn();

    patchers.replaceWith(node, []);

    expect(node.remove).toHaveBeenCalled();
  });

  it("replaceWith inserts when nodes exist and no equivalent match", () => {
    const left = document.createElement("div");
    const right = document.createElement("div");

    (findFirstEquivalentNode as any).mockReturnValue(null);

    left.after = vi.fn();
    left.before = vi.fn();

    patchers.replaceWith(left, [right]);

    expect(findFirstEquivalentNode).toHaveBeenCalled();
  });

  it("replaceWith uses equivalent node path", () => {
    const left = document.createElement("div");
    const right = document.createElement("div");

    (findFirstEquivalentNode as any).mockReturnValue([right, 0]);

    left.before = vi.fn();
    left.after = vi.fn();

    patchers.replaceWith(left, [right]);

    expect(findFirstEquivalentNode).toHaveBeenCalled();
  });

  it("replaceNode same nodeName triggers attribute diff path", () => {
    const left = document.createElement("div");
    const right = document.createElement("div");

    left.setAttribute("a", "1");
    right.setAttribute("a", "2");

    patchers.replaceWith(left, [right]);

    expect(disableState).toHaveBeenCalled();
    expect(writeAttribute).toHaveBeenCalled();
  });

  it("replaceWith uses DOM replaceWhen nodeNames differ", () => {
    const left = document.createElement("div");
    const right = document.createElement("span");

    left.replaceWith = vi.fn();

    (findFirstEquivalentNode as any).mockReturnValue(null);

    patchers.replaceWith(left, [right]);

    expect(left.replaceWith).toHaveBeenCalledWith(right);
  });

  it("replaceChildren removes extra children", () => {
    const parent = document.createElement("div");

    const a = document.createElement("a");
    const b = document.createElement("b");
    const c = document.createElement("c");

    parent.appendChild(a);
    parent.appendChild(b);
    parent.appendChild(c);

    parent.removeChild = vi.fn((node: any) => node);

    patchers.replaceChildren(parent, [a]);

    expect(parent.removeChild).toHaveBeenCalled();
  });

  it("replaceNode updates nodeValue when different", () => {
    const left = document.createTextNode("a");
    const right = document.createTextNode("b");

    patchers.replaceWith(left, [right]);

    expect(left.nodeValue).toBe("b");
  });

  it("replaceNode copies attributes from right to left", () => {
    const left = document.createElement("div");
    const right = document.createElement("div");

    left.setAttribute("a", "1");
    right.setAttribute("b", "2");

    patchers.replaceWith(left, [right]);

    expect(writeAttribute).toHaveBeenCalledWith(left, "b", "2");
  });

  it("patchers.after calls DOM after with nodes", () => {
    const el = document.createElement("div");

    el.after = vi.fn();

    const n1 = document.createElement("span");
    const n2 = document.createElement("b");

    patchers.after(el, [n1, n2]);

    expect(el.after).toHaveBeenCalledWith(n1, n2);
  });

  it("patchers.append calls DOM append with nodes", () => {
    const el = document.createElement("div");

    el.append = vi.fn();

    const n1 = document.createElement("span");
    const n2 = document.createElement("b");

    patchers.append(el, [n1, n2]);

    expect(el.append).toHaveBeenCalledWith(n1, n2);
  });

  it("patchers.before calls DOM before with nodes", () => {
    const el = document.createElement("div");

    el.before = vi.fn();

    const n1 = document.createElement("span");
    const n2 = document.createElement("b");

    patchers.before(el, [n1, n2]);

    expect(el.before).toHaveBeenCalledWith(n1, n2);
  });

  it("patchers.prepend calls DOM prepend with nodes", () => {
    const el = document.createElement("div");

    el.prepend = vi.fn();

    const n1 = document.createElement("span");
    const n2 = document.createElement("b");

    patchers.prepend(el, [n1, n2]);

    expect(el.prepend).toHaveBeenCalledWith(n1, n2);
  });

  it("replaceWith inserts nodes before when findFirstEquivalentNode returns index > 0", () => {
    const left = document.createElement("div");

    const n1 = document.createElement("a");
    const n2 = document.createElement("b");
    const n3 = document.createElement("c");

    (findFirstEquivalentNode as any).mockReturnValue([n3, 2]);

    left.before = vi.fn();
    left.after = vi.fn();
    left.replaceWith = vi.fn();

    patchers.replaceWith(left, [n1, n2, n3]);

    expect(left.before).toHaveBeenCalled();
  });

  it("replaceWith inserts nodes after when remaining nodes exist", () => {
    const left = document.createElement("div");

    const n1 = document.createElement("a");
    const n2 = document.createElement("b");
    const n3 = document.createElement("c");
    const n4 = document.createElement("d");

    (findFirstEquivalentNode as any).mockReturnValue([n1, 1]);

    left.before = vi.fn();
    left.after = vi.fn();
    left.replaceWith = vi.fn();

    patchers.replaceWith(left, [n1, n2, n3, n4]);

    expect(left.after).toHaveBeenCalled();
  });

  it("replaceChildren uses equivalent node when pair is truthy", () => {
    const parent = document.createElement("div");

    const existing = document.createElement("a");
    parent.appendChild(existing);

    const incoming = document.createElement("a");

    (findFirstEquivalentNode as any).mockReturnValue([existing, 0]);

    parent.insertBefore = vi.fn();

    patchers.replaceChildren(parent, [incoming]);

    expect(findFirstEquivalentNode).toHaveBeenCalled();
  });

  it("replaceChildren reorders when pair index differs (pair[1] !== i)", () => {
    const parent = document.createElement("div");

    const a = document.createElement("a");
    const b = document.createElement("b");

    parent.appendChild(a);
    parent.appendChild(b);

    const incoming = document.createElement("b");

    (findFirstEquivalentNode as any).mockReturnValue([b, 1]);

    parent.insertBefore = vi.fn();
    parent.removeChild = vi.fn(); // <- prevents Happy DOM crash

    patchers.replaceChildren(parent, [incoming]);

    expect(parent.insertBefore).toHaveBeenCalledWith(b, parent.childNodes[0]);
  });

  it("replaceChildren appends when no existing children", () => {
    const parent = document.createElement("div");

    const n1 = document.createElement("b");
    const n2 = document.createElement("c");

    (findFirstEquivalentNode as any).mockReturnValue(null);

    parent.appendChild = vi.fn();
    parent.insertBefore = vi.fn();
    parent.removeChild = vi.fn();

    patchers.replaceChildren(parent, [n1, n2]);

    expect(parent.appendChild).toHaveBeenCalledWith(n1);
    expect(parent.appendChild).toHaveBeenCalledWith(n2);
  });
});
