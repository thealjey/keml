import { describe, expect, it } from "vitest";
import { parseHTML } from "./parseHTML.mts";

describe("parseHTML", () => {
  it("parses", () => {
    const doc = parseHTML('<div id="foobar"></div>');
    expect(doc.getElementById("foobar")?.tagName).toBe("DIV");
  });
});
