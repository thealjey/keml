import { isRegExp } from "../util/isRegExp.mts";
import type { Matcher } from "./attrRules.mts";

/**
 * Checks whether an attribute name matches a rule matcher.
 *
 * @param match - Matcher to test against.
 * @returns Whether the matcher matches an attribute name.
 */
export function matchesName(this: string, match: Matcher) {
  return (
    typeof match === "string" ? match === this
    : isRegExp(match) ? match.test(this)
    : match.some(matchesName, this)
  );
}
