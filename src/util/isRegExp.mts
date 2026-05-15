/**
 * Determines whether a value is a RegExp.
 *
 * @param value - Unknown runtime value
 * @returns True if the value is a RegExp
 */
export const isRegExp = (value: any): value is RegExp =>
  Object.prototype.toString.call(value) === "[object RegExp]";
