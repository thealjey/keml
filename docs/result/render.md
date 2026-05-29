Just like [on](../event/on.md) is the input channel for event actions, so too is
the `render` attribute the input channel for result actions.

This attribute can appear on any number of elements - if they all take the same
result action, they will all render the same server result.

Rendering is always a granular operation, applying the smallest possible number
of DOM mutations. If the server result already matches the current state of the
DOM, no changes are applied at all.

---

## `position`

This attribute controls how the server result is applied to the element.

It can be set to one of the following values:

- `replaceChildren` (default)
- `replaceWith`
- `before`
- `after`
- `prepend`
- `append`

All of these are logically equivalent to the DOM methods with the same names,
even if mechanically not identical.

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Server</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/position-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/position-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/position-client.html"
  </section>
</div>

---

## `key`

This attribute serves the same function as it does in frameworks such as
ReactJS: it is a hint to the DOM patcher that helps it distinguish between
otherwise similar-looking elements. In KEML, however, it is less restrictive and
is never strictly required.

There is no such thing as a free lunch, though. Everything a computer does has
some cost associated with it — some costs are just more desirable than others.

`key` is also not a silver bullet or a general performance optimization
applicable in every situation.

Rules of thumb:

- Use it only for same-tag siblings that can be reordered, inserted, or removed.
- Do not use it to represent text or attribute differences.
- Treat it as stable identity, not as data.

<div class="tabs">
  <label><input type="radio" name="tabs-2" checked>Server</label>
  <label><input type="radio" name="tabs-2">Result</label>
  <section>
```html
--8<-- "snippets/key-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/key-client.html"
  </section>
</div>

---

## [`transition`](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

The `transition` attribute enables view transitions for the `render` feature.

The actual transition animations are controlled entirely through CSS.

<div class="tabs">
  <label><input type="radio" name="tabs-3" checked>HTML</label>
  <label><input type="radio" name="tabs-3">CSS</label>
  <label><input type="radio" name="tabs-3">Page A</label>
  <label><input type="radio" name="tabs-3">Page B</label>
  <label><input type="radio" name="tabs-3">Page C</label>
  <label><input type="radio" name="tabs-3">Result</label>
  <section>
```html
--8<-- "snippets/transition-home-server.html"
```
  </section>
  <section>
```css
--8<-- "assets/transition.css"
```
  </section>
  <section>
```html
--8<-- "snippets/transition-a-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/transition-b-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/transition-c-server.html"
```
  </section>
  <section class="browser">
    <div>
      <button></button>
      <button></button>
      <div>https://www.transition-example.com/page-a/</div>
    </div>
    <div></div>
  </section>
</div>
