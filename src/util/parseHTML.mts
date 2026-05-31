const parser = new DOMParser();

/**
 * Parses an HTML string into an HTMLDocument.
 *
 * @param html - The HTML markup to parse.
 * @returns A document containing the parsed HTML.
 */
export const parseHTML = (html: string) =>
  parser.parseFromString(html, "text/html");
