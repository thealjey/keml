/**
 * Returns whether a string contains a token as a standalone space-delimited
 * word.
 *
 * Tokens are matched exactly and must be bounded by:
 * - start/end of string, or
 * - space characters
 *
 * @param input - Space-separated token sequence
 * @param token - Token to search for
 * @returns True if the token exists as a whole word
 */
export const has_token = (haystack: string, needle: string | null) => {
  if (needle != null) {
    for (
      let i = -1, j, l = haystack.length, m = needle.length;
      (i = haystack.indexOf(needle, i + 1)) !== -1;
    ) {
      if (
        (!i || haystack.charCodeAt(i - 1) === 32) &&
        ((j = i + m) === l || haystack.charCodeAt(j) === 32)
      ) {
        return true;
      }
    }
  }
  return false;
};

/* v8 ignore start */
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("has_token", () => {
    it("covers all branches minimally", () => {
      expect(has_token("abc", "abc")).toBe(true);
      expect(has_token(" abc ", "abc")).toBe(true);
      expect(has_token("xabc", "abc")).toBe(false);
      expect(has_token("abcx", "abc")).toBe(false);
      expect(has_token("a b c", "abc")).toBe(false);
    });
  });
}
/* v8 ignore stop */
