Event actions can be defined on any element with the following pattern:

`on:<event>="hello KEML"`

This is not an event handler in the traditional sense, because it does not imply
any work being done.

This reads like the following:

- define `hello` and `KEML` as actions of type `event`
- assign them to the output channel of `<event>`

---

Event actions can then be used with the following pattern:

`<feature>="hello"`

This reads like the following:

- assign the `hello` action of type `event` to the input channel of `<feature>`

Again, this does not imply any work by itself - each individual feature will
decide what to do with the input.

<!-- prettier-ignore-start -->
!!! info "Info"
    Both sides are declarations — KEML has no event or signal system.

    It runs in an event-driven browser, but itself is purely declarative:
    nothing is emitted or observed, and neither side is aware of the other.
<!-- prettier-ignore-end -->

---

## Supported events

All event types are supported by KEML, regardless of their origin — KEML makes
no distinction between them:

- native events
- events defined by KEML itself
- custom events emitted by other JavaScript on an element

---

## KEML-defined events

1. `reveal` — element enters the viewport
1. `conceal` — element leaves the viewport
1. `navigate` — History API transition
1. `result` — successful server result
1. `failure` — unsuccessful server result
1. `discover` — the element becomes known to the system (if the `on:discover`
   attribute is removed and then added back, the event will be re-emitted)

---

## `event:` modifier

The output channel of event actions can be conditionally blocked by an `event:`
modifier:

`event:<event>="key = value, otherKey = otherValue, truthyCheck"`

This performs a shallow comparison between an event object and a specification
provided in quotes.

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Server</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/event-modifier-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/event-modifier-server.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/event-modifier-client.html"
  </section>
</div>

---

## Parent handler

KEML does not interfere with normal browser event bubbling. This is not
bubbling, but simple parent lookup.

`on:*` does not have to be set directly on the event emitting element; it can
also be on any of its parents.

<div class="tabs">
  <label><input type="radio" name="tabs-2" checked>HTML</label>
  <label><input type="radio" name="tabs-2">Server</label>
  <label><input type="radio" name="tabs-2">Result</label>
  <section>
```html
--8<-- "snippets/parent-handler-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/parent-handler-server.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/parent-handler-client.html"
  </section>
</div>
