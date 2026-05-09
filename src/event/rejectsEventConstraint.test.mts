import { describe, expect, it } from "vitest";
import { rejectsEventConstraint } from "./rejectsEventConstraint.mts";

describe("rejectsEventConstraint", () => {
  it("rejects when property is missing (flag form)", () => {
    const event = {} as Event;

    const result = rejectsEventConstraint.call(event, "type");

    expect(result).toBe(true);
  });

  it("does not reject when property exists (flag form)", () => {
    const event = { type: "click" } as unknown as Event;

    const result = rejectsEventConstraint.call(event, "type");

    expect(result).toBe(false);
  });

  it("rejects when property does not match value", () => {
    const event = { type: "click" } as unknown as Event;

    const result = rejectsEventConstraint.call(event, "type=submit");

    expect(result).toBe(true);
  });

  it("does not reject when property matches value", () => {
    const event = { type: "click" } as unknown as Event;

    const result = rejectsEventConstraint.call(event, "type=click");

    expect(result).toBe(false);
  });
});
