import { describe, expect, it } from "vitest";

import { matchesName } from "./matchesName.mts";

describe("matchesName", () => {
  it("matches exact strings", () => {
    expect(matchesName.call("foo", "foo")).toBe(true);
    expect(matchesName.call("foo", "bar")).toBe(false);
  });

  it("matches regular expressions", () => {
    expect(matchesName.call("foobar", /^foo/)).toBe(true);
    expect(matchesName.call("foobar", /^bar/)).toBe(false);
  });

  it("matches nested matcher arrays", () => {
    expect(matchesName.call("foobar", ["bar", /^foo/])).toBe(true);

    expect(matchesName.call("foobar", ["bar", /^baz/])).toBe(false);
  });

  it("matches deeply nested matcher arrays", () => {
    expect(matchesName.call("foobar", ["bar", [/^baz/, [/^foo/]]])).toBe(true);

    expect(matchesName.call("foobar", [[/^baz/, ["qux"]]])).toBe(false);
  });

  it("returns false for empty matcher arrays", () => {
    expect(matchesName.call("foobar", [])).toBe(false);
  });
});
