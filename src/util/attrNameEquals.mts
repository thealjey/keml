/**
 * Predicate function that checks whether an attribute's name matches a given
 * string.
 *
 * Intended for use as a callback where the comparison string is provided as
 * `this`.
 *
 * @param this - The attribute name to compare against.
 * @param attr - The attribute being evaluated.
 * @returns `true` if the attribute name matches `this`, otherwise `false`.
 */
export function attrNameEquals(this: string, { name }: Attr) {
  return this === name;
}
