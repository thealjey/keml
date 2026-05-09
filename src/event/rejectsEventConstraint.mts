/**
 * Evaluates whether a DOM event satisfies a given constraint expression.
 *
 * The constraint may be either:
 * - A boolean-style property check (e.g. `"altKey"`)
 * - A key-value comparison (e.g. `"type=click"`)
 *
 * In both cases, the function returns `true` if the event does NOT satisfy the
 * constraint.
 *
 * @param this - The DOM event being evaluated.
 * @param constraint - A constraint string describing an event property condition.
 * @returns `true` if the event violates the constraint, otherwise `false`.
 */
export function rejectsEventConstraint(this: Event, constraint: string) {
  const pos = constraint.indexOf("=");
  const name = (
    pos < 0 ? constraint : constraint.slice(0, pos)).trim() as keyof Event;

  return (
    name &&
    ((pos < 0 && !this[name]) ||
      (pos >= 0 && this[name] + "" != constraint.slice(pos + 1).trim()))
  );
}
