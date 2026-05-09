/**
 * Checks whether a whitespace-separated token list contains a given token.
 *
 * Performs a strict token match against a space-delimited string, avoiding
 * partial substring matches by checking boundaries explicitly.
 *
 * @param haystack - The space-separated token string to search within.
 * @param needle - The token to search for.
 * @returns truthy if the token is present, otherwise falsy.
 */
export const hasToken = (
  haystack: string | null | undefined,
  needle: string | null | undefined,
) =>
  haystack &&
  needle &&
  (haystack == needle ||
    haystack.startsWith(needle + " ") ||
    haystack.endsWith((needle = " " + needle)) ||
    haystack.includes(needle + " "));
