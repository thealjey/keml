import { describe, expect, it } from "vitest";
import { attrNameEquals } from "./attrNameEquals.mts";

describe("attrNameEquals", () => {
  it("returns true when string matches attr name", () => {
    const attr = { name: "type" } as Attr;

    const result = attrNameEquals.call("type", attr);

    expect(result).toBe(true);
  });

  it("returns false when string does not match attr name", () => {
    const attr = { name: "value" } as Attr;

    const result = attrNameEquals.call("type", attr);

    expect(result).toBe(false);
  });
});
