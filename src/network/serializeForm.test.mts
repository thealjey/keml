import { describe, expect, it, vi } from "vitest";
import { SERIALIZE } from "../runtime/executeRules.mts";
import { traverseAttributes } from "../runtime/traverseAttributes.mts";
import { isForm } from "../util/isForm.mts";
import { serializeForm } from "./serializeForm.mts";

vi.mock("../runtime/traverseAttributes.mts", () => ({
  traverseAttributes: vi.fn(),
}));

vi.mock("../util/isForm.mts", () => ({
  isForm: vi.fn(),
}));

describe("serializeForm", () => {
  it("serializes a form element directly", () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <input name="name" value="John">
      <input name="age" value="42">
    `;

    vi.mocked(isForm).mockReturnValue(true);

    const result = serializeForm(form);

    expect(result).toBeInstanceOf(FormData);
    expect(result.get("name")).toBe("John");
    expect(result.get("age")).toBe("42");

    expect(isForm).toHaveBeenCalledWith(form);
    expect(traverseAttributes).toHaveBeenCalledWith(SERIALIZE, [form], {
      formData: result,
    });
  });

  it("clones a non-form element into the internal form before serializing", () => {
    const div = document.createElement("div");
    div.innerHTML = `
      <input name="name" value="Jane">
      <input name="age" value="30">
    `;

    vi.mocked(isForm).mockReturnValue(false);

    const result = serializeForm(div);

    expect(result).toBeInstanceOf(FormData);
    expect(result.get("name")).toBe("Jane");
    expect(result.get("age")).toBe("30");

    expect(isForm).toHaveBeenCalledWith(div);
    expect(traverseAttributes).toHaveBeenCalledWith(SERIALIZE, [div], {
      formData: result,
    });
  });

  it("uses a clone instead of modifying the original element", () => {
    const div = document.createElement("div");
    const input = document.createElement("input");

    input.name = "name";
    input.value = "Original";
    div.appendChild(input);

    vi.mocked(isForm).mockReturnValue(false);

    serializeForm(div);

    expect(div.contains(input)).toBe(true);
    expect(input.value).toBe("Original");
  });
});
