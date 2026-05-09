Just like [on:\*](../event/on-colon.md) is the output channel for event actions,
so too is the `if:*` attribute the output channel for state actions.

All of the following, along with any future additions, are behaviorally
identical and differ only in how their conditions are calculated.

---

## `if:loading`

KEML has no special concept of a loading indicator, because it does not need
one — `loading` is just another state condition.

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/if-loading-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/if-loading-client.html"
  </section>
</div>

---

## `if:error`

The `error` condition becomes `true` when the server returns an unsuccessful
status code.

<div class="tabs">
  <label><input type="radio" name="tabs-2" checked>HTML</label>
  <label><input type="radio" name="tabs-2">Server</label>
  <label><input type="radio" name="tabs-2">Result</label>
  <section>
```html
--8<-- "snippets/if-error-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/if-error-server.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/if-error-client.html"
  </section>
</div>

---

## `if:invalid`

The `invalid` condition becomes `true` when the element's value is invalid.

For custom elements (e.g. Web Components) to participate, they must implement
the standard
[checkValidity](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/checkValidity)
method and notify the system of their value changes by emitting one or more of
the following event types: `change`, `input`, `reset`.

<div class="tabs">
  <label><input type="radio" name="tabs-3" checked>HTML</label>
  <label><input type="radio" name="tabs-3">Result</label>
  <section>
```html
--8<-- "snippets/if-invalid-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/if-invalid-client.html"
  </section>
</div>

---

## `if:value`

The `value` condition becomes `true` when the element's value is truthy.

For custom elements (e.g. Web Components) to participate, they must expose two
properties: `type: string` and `value: string`, OR `type: 'checkbox'` and
`checked: boolean`, and notify the system of their value changes by emitting one
or more of the following event types: `change`, `input`, `reset`.

<div class="tabs">
  <label><input type="radio" name="tabs-4" checked>HTML</label>
  <label><input type="radio" name="tabs-4">Result</label>
  <section>
```html
--8<-- "snippets/if-value-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/if-value-client.html"
  </section>
</div>

---

## `if:intersects`

The `intersects` condition becomes `true` when the element enters the viewport.

<div class="tabs">
  <label><input type="radio" name="tabs-5" checked>HTML</label>
  <label><input type="radio" name="tabs-5">Result</label>
  <section>
```html
--8<-- "snippets/if-intersects-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/if-intersects-client.html"
  </section>
</div>
