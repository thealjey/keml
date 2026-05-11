import { attrRules, type Context } from "./attrRules.mts";
import { getLifecyclePhase } from "./data.mts";

export const ADDED = 0b1;
export const REMOVED = 0b10;
export const CHANGED = 0b100;
export const SERIALIZE = 0b1000;

/**
 * Executes rules for a given attribute.
 *
 * @param mask Bitmask selecting the needed rule functionality
 * @param el Target DOM element
 * @param name Attribute name being processed
 * @param context Optional execution context passed to rules
 */
export const executeRules = (
  mask: number,
  el: Element,
  name: string,
  context?: Context,
) => {
  for (const {
    match,
    gate,
    phase,
    added,
    removed,
    changed,
    serialize,
  } of attrRules) {
    if (
      (phase == null || phase === getLifecyclePhase()) &&
      (!match ||
        (typeof match === "string" ? name === match
        : Array.isArray(match) ? match.includes(name)
        : match.test(name))) &&
      (!gate || gate(el, name, context))
    ) {
      mask & ADDED && added?.(el, name, context);
      mask & REMOVED && removed?.(el, name, context);
      mask & CHANGED && changed?.(el, name, context);
      mask & SERIALIZE && serialize?.(el, name, context);
    }
  }
};
