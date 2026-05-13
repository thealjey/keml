import {
  navigateElements,
  onElements,
  resetElements,
  scrollElements,
} from "../event/data.e.mts";
import { concealObserver, revealObserver } from "../event/visibilityEvents.mts";
import { intersectsObserver } from "../event/visibilityStateSync.mts";
import { methodAttrs } from "../network/resolveRequestDescriptor.mts";
import { SseManager } from "../network/SseManager.mts";
import {
  ifColonElements,
  ifElements,
  markStateDirty,
  pushDiscoverableElement,
  renderElements,
  setFocusElement,
  setNeedsSse,
} from "../render/data.mts";
import { getEventListener } from "./data.mts";

type Matcher = string | string[] | RegExp;

export type Context = { formData?: FormData };
type Handler = (el: Element, name: string, context?: Context) => any;

export type AttrRule = {
  match?: Matcher;
  gate?: Handler;
  added?: Handler;
  removed?: Handler;
  changed?: Handler;
  serialize?: Handler;
};

const events = new Set<string>();

/**
 * Registry of attribute lifecycle rules that define side-effects for DOM
 * changes.
 *
 * Each rule describes how specific attributes (or attribute patterns) should
 * react during lifecycle events such as addition, removal, or modification.
 *
 * Matching supports:
 * - Exact attribute names
 * - Regular expressions
 * - Arrays of attribute names
 *
 * Optional constraints:
 * - `gate` functions to conditionally apply rules
 */
export const attrRules: AttrRule[] = [
  {
    match: "autofocus",
    added: setFocusElement,
  },
  {
    match: "if",
    added: el => ifElements.add(el),
    removed: el => ifElements.delete(el),
  },
  {
    match: "if",
    added: markStateDirty,
    removed: markStateDirty,
    changed: markStateDirty,
  },
  {
    match: /^if:/,
    added: el => ifColonElements.add(el),
    removed: el => ifColonElements.delete(el),
  },
  {
    match: /^if:/,
    added: markStateDirty,
    removed: markStateDirty,
    changed: markStateDirty,
  },
  {
    match: "if:intersects",
    added: el => intersectsObserver.observe(el),
    removed: el => intersectsObserver.unobserve(el),
  },
  {
    match: "if:intersects",
    gate: ({ isIntersecting }) => isIntersecting == null,
    added(el) {
      const { top, right, bottom, left } = el.getBoundingClientRect();

      el.isIntersecting =
        bottom > 0 && right > 0 && left < innerWidth && top < innerHeight;
    },
  },
  {
    match: "on",
    added: el => onElements.add(el),
    removed: el => onElements.delete(el),
  },
  {
    match: /^on:/,
    gate: (_el, name) => !events.has(name),
    added(_el, name) {
      events.add(name);
      document.addEventListener(name.slice(3), getEventListener(), true);
    },
  },
  {
    match: "on:conceal",
    added: el => concealObserver.observe(el),
    removed: el => concealObserver.unobserve(el),
  },
  {
    match: "on:navigate",
    added: el => navigateElements.add(el),
    removed: el => navigateElements.delete(el),
  },
  {
    match: "on:reveal",
    added: el => revealObserver.observe(el),
    removed: el => revealObserver.unobserve(el),
  },
  {
    match: "on:discover",
    added: pushDiscoverableElement,
  },
  {
    match: "render",
    added: el => renderElements.add(el),
    removed: el => renderElements.delete(el),
  },
  {
    match: "reset",
    added: el => resetElements.add(el),
    removed: el => resetElements.delete(el),
  },
  {
    match: "scroll",
    added: el => scrollElements.add(el),
    removed: el => scrollElements.delete(el),
  },
  {
    match: "sse",
    added: SseManager.instance.addElement,
    removed: SseManager.instance.deleteElement,
  },
  {
    match: "sse",
    added: setNeedsSse,
    removed: setNeedsSse,
    changed: setNeedsSse,
  },
  {
    match: methodAttrs.concat("credentials"),
    gate: el => el.hasAttribute("sse"),
    added: setNeedsSse,
    removed: setNeedsSse,
    changed: setNeedsSse,
  },
  {
    match: "value",
    gate: el =>
      !(el instanceof HTMLInputElement) &&
      !(el instanceof HTMLSelectElement) &&
      !(el instanceof HTMLTextAreaElement) &&
      el.hasAttribute("name"),
    serialize: (el, _name, context) =>
      context?.formData?.set(
        el.getAttribute("name")!,
        el.getAttribute("value")!,
      ),
  },
];
