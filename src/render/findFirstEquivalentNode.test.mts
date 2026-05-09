import { describe, expect, it } from "vitest";
import { findFirstEquivalentNode } from "./findFirstEquivalentNode.mts";

describe("findFirstEquivalentNode", () => {
  it("finds first equivalent node by name and key", () => {
    const node = {
      nodeName: "div",
      getAttribute: (name: string) => (name === "key" ? "a" : null),
    } as any;

    const nodes = [
      {
        nodeName: "span",
        getAttribute: () => null,
      },
      {
        nodeName: "div",
        getAttribute: (name: string) => (name === "key" ? "a" : null),
      },
      {
        nodeName: "div",
        getAttribute: (name: string) => (name === "key" ? "b" : null),
      },
    ] as any;

    const result = findFirstEquivalentNode(nodes, node);

    expect(result).toBeDefined();
    expect(result![0]).toBe(nodes[1]);
    expect(result![1]).toBe(1);
  });

  it("returns undefined when no match exists", () => {
    const node = {
      nodeName: "div",
      getAttribute: () => "x",
    } as any;

    const nodes = [
      {
        nodeName: "span",
        getAttribute: () => "x",
      },
    ] as any;

    const result = findFirstEquivalentNode(nodes, node);

    expect(result).toBeUndefined();
  });

  it("matches by nodeName even without key attribute", () => {
    const node = {
      nodeName: "div",
    } as any;

    const nodes = [
      {
        nodeName: "div",
        getAttribute: () => null,
      },
    ] as any;

    const result = findFirstEquivalentNode(nodes, node);

    expect(result![0]).toBe(nodes[0]);
    expect(result![1]).toBe(0);
  });

  it("respects start index", () => {
    const node = {
      nodeName: "div",
    } as any;

    const nodes = [
      { nodeName: "div", getAttribute: () => null },
      { nodeName: "div", getAttribute: () => null },
    ] as any;

    const result = findFirstEquivalentNode(nodes, node, 1);

    expect(result![1]).toBe(1);
  });
});
