import { attrRules, matchesName, type Context } from "./attrRules.mts";

export const ADDED = 0b1;
export const ADDED_ATTR = 0b10;
export const REMOVED = 0b100;
export const REMOVED_ATTR = 0b1000;
export const CHANGED = 0b10000;
export const CREATED = 0b100000;
export const DESTROYED = 0b1000000;
export const SERIALIZE = 0b10000000;

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
  for (const rule of attrRules) {
    if (
      matchesName.call(name, rule.match) &&
      (!rule.gate || rule.gate(el, name, context))
    ) {
      mask & ADDED && rule.added?.(el, name, context);
      mask & ADDED_ATTR && rule.addedAttr?.(el, name, context);
      mask & REMOVED && rule.removed?.(el, name, context);
      mask & REMOVED_ATTR && rule.removedAttr?.(el, name, context);
      mask & CHANGED && rule.changed?.(el, name, context);
      mask & CREATED && rule.created?.(el, name, context);
      mask & DESTROYED && rule.destroyed?.(el, name, context);
      mask & SERIALIZE && rule.serialize?.(el, name, context);
    }
  }
};
