Just like [on:\*](../event/on-colon.md) is the output channel for event actions,
so too is the `ref:*` attribute the output channel for reference actions.

Reference actions can be defined on any element with the following pattern:

`ref:<attributeName>="hello KEML"`

This reads like the following:

- define `hello` and `KEML` as actions of type `reference`
- make them point to the live value of the `<attributeName>` attribute on the
  current element

`ref:<name>` creates a reference to the attribute named `<name>`. Once a
reference exists, you can [link](./link-colon.md) to it.

---

Whenever you are using `ref:width` or `ref:height`, you can optionally specify
an additional `measure` attribute (see the
[graph example](./link-colon.md#resolution-optimized-server-response)) with one
of the following values:

- [borderBoxSize](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/borderBoxSize) (default)
- [contentBoxSize](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize)
- [devicePixelContentBoxSize](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/devicePixelContentBoxSize)
- [contentRect](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentRect)

---

## Bound by value

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/reference-value-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/reference-value-client.html"
  </section>
</div>
