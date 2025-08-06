/**
 * Parses a space-delimited string into an array of non-empty action tokens.
 *
 * This function scans the input string character by character and extracts
 * contiguous sequences of non-space characters as discrete tokens. It is
 * designed to be more performant and predictable than `String.prototype.split`,
 * as it avoids producing empty strings due to consecutive spaces.
 *
 * Leading, trailing, and repeated spaces are ignored. Only actual word-like
 * segments are included in the result.
 *
 * Performance: Linear in time relative to the length of the input string.
 * Avoids allocation of intermediate empty entries that `split(" ")` might
 * produce.
 *
 * @param input - A string containing space-separated action names.
 *
 * @returns An array of non-empty action tokens extracted from the input.
 *
 * @example
 * parse_actions("save edit  delete ");
 * // → ["save", "edit", "delete"]
 *
 * @example
 * parse_actions("   ");
 * // → []
 *
 * @example
 * parse_actions("toggle");
 * // → ["toggle"]
 */
export const parse_actions = (input: string) => {
  const result: string[] = [];
  const len = input.length;
  let i = 0;
  let start = -1;

  for (; i < len; ++i) {
    if (input.charCodeAt(i) === 32) {
      if (start !== -1) {
        result.push(input.slice(start, i));
        start = -1;
      }
    } else if (start === -1) {
      start = i;
    }
  }

  if (start !== -1) {
    result.push(input.slice(start, i));
  }

  return result;
};

/* v8 ignore start */
if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("parse_actions", () => {
    it("duh", () => {
      expect(parse_actions("   foo   bar baz    ")).toEqual([
        "foo",
        "bar",
        "baz",
      ]);
    });
  });
}
/* v8 ignore stop */
