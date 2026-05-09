/**
 * Type guard that filters out `null` and `undefined` values.
 *
 * Useful for narrowing arrays or values to non-nullable types.
 *
 * @param value - The value to check.
 * @returns `true` if the value is neither `null` nor `undefined`.
 */
export const notNil = (value: any): value is NonNullable<typeof value> =>
  value != null;
