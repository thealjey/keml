import { bridge } from "../network/bridge.e.mts";
import { scheduleRequest } from "../network/scheduleRequest.mts";
import {
  pushResettableElement,
  pushScrollableElement,
} from "../render/data.mts";
import { hasToken } from "../util/hasToken.mts";
import { onElements, resetElements, scrollElements } from "./data.e.mts";
import { rejectsEventConstraint } from "./rejectsEventConstraint.mts";

const tokenBehavior = [
  [onElements, "on", scheduleRequest],
  [resetElements, "reset", pushResettableElement],
  [scrollElements, "scroll", pushScrollableElement],
] as const;

/**
 * Global event handler that processes delegated events based on DOM attributes.
 *
 * This listener interprets event metadata from the DOM and executes associated
 * behavior when matching conditions are satisfied. It supports attribute-based
 * event delegation, constraint filtering, and token-driven action execution.
 *
 * @param event - The DOM event being handled.
 *
 * @remarks
 * - Traverses up the DOM tree from the event target to find applicable handlers.
 * - Supports conditional suppression of event handling via constraints.
 * - Executes registered token-based behaviors when matching conditions are met.
 */
export const onEvent: EventListener = event => {
  const { target, type } = event;

  if (target instanceof Element) {
    const attrName = `on:${type}`;
    let el: Element | null = target;
    let attr;

    while (el && !(attr = el.getAttributeNode(attrName))) {
      el = el.parentElement;
    }

    if (el && attr) {
      const actions = attr.value;

      if ((attr = el.getAttributeNode(`event:${type}`))) {
        if (process.env["NODE_ENV"] === "docs") {
          bridge.console.ownerElement = el;
        }
        el.hasAttribute("log") && bridge.console.log(event);

        if (attr.value.split(",").some(rejectsEventConstraint, event)) {
          return;
        }
      }

      event.preventDefault();

      for (const [elements, name, action] of tokenBehavior) {
        for (el of elements) {
          hasToken(actions, el.getAttribute(name)) && action(el);
        }
      }
    }
  }
};
