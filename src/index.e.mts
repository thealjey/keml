import { bootstrap } from "./runtime/bootstrap.mts";

const marker = Symbol.for("keml");

/**
 * One-time bootstrap guard for the runtime initialization.
 *
 * Ensures the bootstrap process runs only once per page by setting a global
 * flag on `window[Symbol.for("keml")]`.
 *
 * If the document is still loading, initialization is deferred until
 * `DOMContentLoaded`; otherwise it runs immediately.
 */
if (!window[marker]) {
  window[marker] = true;

  document.readyState === "loading" ?
    document.addEventListener("DOMContentLoaded", bootstrap, true)
  : bootstrap();
}
