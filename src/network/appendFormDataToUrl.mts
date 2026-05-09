/**
 * Appends string-based FormData entries to a URL's query parameters.
 *
 * Iterates over the provided FormData and adds each key-value pair to the URL's
 * search parameters, but only if the value is a string.
 *
 * @param url - The URL instance to mutate by appending query parameters.
 * @param data - Optional FormData containing key-value pairs to append.
 */
export const appendFormDataToUrl = (
  { searchParams }: URL,
  data: FormData | undefined,
): undefined => {
  if (data) {
    for (const [key, value] of data) {
      typeof value === "string" && searchParams.append(key, value);
    }
  }
};
