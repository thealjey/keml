## v3.4

Added:

- `failure` and `discover` [event types](./event/on-colon.md#keml-defined-events)

Changed:

- unified internal attribute resolution
- `name` + `value` attribute pairs now work at any nesting level
- documentation rewrite

---

## v3.3

Added:

- [SSE](./sse.md)
- [scroll](./event/scroll.md)
- [log](./logging.md)

---

## VS Code Extension

KEML now has an
[official VS Code extension](https://marketplace.visualstudio.com/items?itemName=eugene-kuzmenko.keml-vscode).

---

## v3.2

Fixed:

- removed auto-install for python dependencies

---

## v3.1

Added:

- [parent handler](./event/on-colon.md#parent-handler)

---

## v3

Added:

- automatic tracking for all DOM changes
- [event:](./event/on-colon.md#event-modifier) modifier

Breaking:

- removed special actions
