import { describe, expect, it } from "vitest";
import { writeScrollAxis } from "./writeScrollAxis.mts";

describe("writeScrollAxis", () => {
  it("writes numeric value directly", () => {
    const el = {
      getAttribute: (name: string) => (name === "top" ? "42" : null),
    } as any;

    const options: any = {};

    writeScrollAxis(el, options, "top");

    expect(options.top).toBe(42);
  });

  it("sets start to 0", () => {
    const el = {
      getAttribute: () => "start",
      scrollHeight: 100,
      clientHeight: 20,
    } as any;

    const options: any = {};

    writeScrollAxis(el, options, "top");

    expect(options.top).toBe(0);
  });

  it("sets end to max scroll position", () => {
    const el = {
      getAttribute: () => "end",
      scrollHeight: 100,
      clientHeight: 20,
    } as any;

    const options: any = {};

    writeScrollAxis(el, options, "top");

    expect(options.top).toBe(80);
  });

  it("sets center to midpoint (floored)", () => {
    const el = {
      getAttribute: () => "center",
      scrollHeight: 100,
      clientHeight: 20,
    } as any;

    const options: any = {};

    writeScrollAxis(el, options, "top");

    expect(options.top).toBe(40);
  });

  it("does nothing when attribute is missing", () => {
    const el = {
      getAttribute: () => null,
    } as any;

    const options: any = {};

    writeScrollAxis(el, options, "top");

    expect(options.top).toBeUndefined();
  });

  it("handles left axis correctly", () => {
    const el = {
      getAttribute: () => "end",
      scrollWidth: 200,
      clientWidth: 50,
    } as any;

    const options: any = {};

    writeScrollAxis(el, options, "left");

    expect(options.left).toBe(150);
  });

  it("ignores unknown string keywords", () => {
    const el = {
      getAttribute: () => "foo",
      scrollHeight: 100,
      clientHeight: 20,
    } as any;

    const options: any = { top: 10 };

    writeScrollAxis(el, options, "top");

    expect(options.top).toBe(10);
  });
});
