import { describe, expect, it, vi } from "vitest";

vi.mock("./data.e.mts", () => {
  const el1 = { dispatchEvent: vi.fn() };
  const el2 = { dispatchEvent: vi.fn() };

  return { navigateElements: [el1, el2] };
});

import { navigateElements } from "./data.e.mts";
import { dispatchNavigate } from "./dispatchNavigate.mts";

describe("dispatchNavigate", () => {
  it("dispatches navigate event on all elements", () => {
    dispatchNavigate();

    const [el1, el2] = Array.from(navigateElements) as any as [
      { dispatchEvent: ReturnType<typeof vi.fn> },
      { dispatchEvent: ReturnType<typeof vi.fn> },
    ];

    expect(el1.dispatchEvent).toHaveBeenCalledTimes(1);
    expect(el2.dispatchEvent).toHaveBeenCalledTimes(1);

    const event1 = el1.dispatchEvent.mock.calls[0]![0];
    const event2 = el2.dispatchEvent.mock.calls[0]![0];

    expect(event1.type).toBe("navigate");
    expect(event2.type).toBe("navigate");

    expect(event1).toBe(event2);
  });
});
