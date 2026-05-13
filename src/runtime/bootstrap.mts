import { dispatchNavigate } from "../event/dispatchNavigate.mts";
import { onEvent } from "../event/onEvent.mts";
import { bridge } from "../network/bridge.e.mts";
import { SseManager } from "../network/SseManager.mts";
import { markStateDirty } from "../render/data.mts";
import { render } from "../render/render.mts";
import { mutationObserver } from "./attrMutation.mts";
import { setEventListener } from "./data.mts";
import { ADDED } from "./executeRules.mts";
import { traverseAttributes } from "./traverseAttributes.mts";

/**
 * Initializes the runtime system and starts all DOM-driven behaviors.
 *
 * Performs initial setup of attribute traversal, mutation observation, and
 * global event listeners required for reactive behavior.
 *
 * Also schedules the main render loop.
 */
export const bootstrap = () => {
  try {
    document.cookie = `tzo=${new Date().getTimezoneOffset()};Path=\/;SameSite=lax;Max-Age=31536000`;
  } catch {}

  setEventListener(onEvent);
  traverseAttributes(ADDED, document.childNodes);

  mutationObserver.observe(document, {
    attributeOldValue: true,
    attributes: true,
    childList: true,
    subtree: true,
  });

  document.addEventListener("change", markStateDirty, true);
  document.addEventListener("input", markStateDirty, true);
  document.addEventListener("reset", markStateDirty, true);
  bridge.window.addEventListener("popstate", dispatchNavigate, true);
  window.addEventListener("beforeunload", SseManager.instance.stop, true);

  requestAnimationFrame(render);
};
