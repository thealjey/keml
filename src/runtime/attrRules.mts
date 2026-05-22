import { concealObserver } from "../event/concealObserver.mts";
import {
  navigateElements,
  onElements,
  resetElements,
  scrollElements,
} from "../event/data.e.mts";
import { intersectsObserver } from "../event/intersectsObserver.mts";
import { resizeObserver } from "../event/resizeObserver.mts";
import { revealObserver } from "../event/revealObserver.mts";
import { methodAttrs } from "../network/resolveRequestDescriptor.mts";
import { SseManager } from "../network/SseManager.mts";
import {
  ifColonElements,
  ifElements,
  linkElements,
  markRefDirty,
  markStateDirty,
  pushAttrEventStack,
  pushDiscoverableElement,
  refElements,
  renderElements,
  setFocusElement,
  setNeedsSse,
} from "../render/data.mts";
import { isRegExp } from "../util/isRegExp.mts";
import { getEventListener } from "./data.mts";

export type Matcher = string | RegExp | Matcher[];
export type Context = { formData?: FormData };
export type Handler = (el: Element, name: string, context?: Context) => any;

export type AttrRule = {
  match?: Matcher;
  gate?: Handler;
  added?: Handler;
  addedAttr?: Handler;
  removed?: Handler;
  removedAttr?: Handler;
  changed?: Handler;
  created?: Handler;
  destroyed?: Handler;
  serialize?: Handler;
};

const events = new Set<string>();
const formField = ["INPUT", "SELECT", "TEXTAREA"];

/**
 * Checks whether an attribute name matches a rule matcher.
 *
 * @param match - Matcher to test against.
 * @returns Whether the matcher matches an attribute name.
 */
export function matchesName(this: string, match: Matcher | undefined) {
  return (
    !match ||
    (typeof match === "string" ? match === this
    : isRegExp(match) ? match.test(this)
    : match.some(matchesName, this))
  );
}

/**
 * Attribute-based gate that evaluates whether an element satisfies the Matcher.
 *
 * @returns `false` if any attribute name on the element satisfies the Matcher.
 */
export function presentAttrGate(this: AttrRule, { attributes }: Element) {
  for (const { name } of attributes) {
    if (matchesName.call(name, this.match)) {
      return false;
    }
  }
  return true;
}

/**
 * Rules that govern all attribute related functionality.
 *
 * Their purpose is to maintain internal references, not to perform any actual
 * work.
 */
export const attrRules: AttrRule[] = [
  {
    match: ["if:intersects", "ref:width", "ref:height"],
    gate: ({ sizeEntry }) => !sizeEntry,
    added(target) {
      const contentRect = target.getBoundingClientRect();
      const borderBoxSize: ResizeObserverSize[] = [
        { blockSize: contentRect.height, inlineSize: contentRect.width },
      ];

      target.sizeEntry = {
        borderBoxSize,
        contentBoxSize: borderBoxSize,
        devicePixelContentBoxSize: borderBoxSize,
        contentRect,
        target,
      };
    },
  },
  {
    gate: (el, name) => el.hasAttribute(`on:attr:${name}`),
    addedAttr: pushAttrEventStack,
    removedAttr: pushAttrEventStack,
    changed: pushAttrEventStack,
  },
  {
    match: [/^ref:/, /^link:/],
    added: markRefDirty,
    removed: markRefDirty,
    changed: markRefDirty,
  },
  {
    gate: (el, name) => el.hasAttribute(`ref:${name}`),
    added: markRefDirty,
    removed: markRefDirty,
    changed: markRefDirty,
  },
  {
    match: ["ref:width", "ref:height"],
    added: el => resizeObserver.observe(el),
    destroyed: el => resizeObserver.unobserve(el),
  },
  {
    match: ["ref:width", "ref:height"],
    gate: presentAttrGate,
    removed: el => resizeObserver.unobserve(el),
  },
  {
    match: /^ref:/,
    added: el => refElements.add(el),
    destroyed: el => refElements.delete(el),
  },
  {
    match: /^ref:/,
    gate: presentAttrGate,
    removed: el => refElements.delete(el),
  },
  {
    match: /^link:/,
    added: el => linkElements.add(el),
    destroyed: el => linkElements.delete(el),
  },
  {
    match: /^link:/,
    gate: presentAttrGate,
    removed: el => linkElements.delete(el),
  },
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
    match: ["if", /^if:/],
    added: markStateDirty,
    removed: markStateDirty,
    changed: markStateDirty,
  },
  {
    match: /^if:/,
    added: el => ifColonElements.add(el),
    destroyed: el => ifColonElements.delete(el),
  },
  {
    match: /^if:/,
    gate: presentAttrGate,
    removed: el => ifColonElements.delete(el),
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
      const { top, right, bottom, left } = el.sizeEntry.contentRect;

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
    gate: el => !formField.includes(el.tagName) && el.hasAttribute("name"),
    serialize: (el, _name, context) =>
      context?.formData?.set(
        el.getAttribute("name")!,
        el.getAttribute("value")!,
      ),
  },
];
