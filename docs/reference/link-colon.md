Just like [on](../event/on.md) is the input channel for event actions, so too is
the `link:*` attribute the input channel for reference actions.

Reference actions can be used with the following pattern:

`link:<attributeName>="hello"`

This reads like the following:

- assign the `hello` action of type `reference` as the input for the
  `<attributeName>` attribute

`link:<name>` links an attribute named `<name>` to a
[reference](./ref-colon.md).

Both [ref:\*](./ref-colon.md) and `link:*` can specify an attribute name
independently, because they do not always have to match.

---

## Select color

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/reference-color-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/reference-color-client.html"
  </section>
</div>

---

## Resolution-optimized server response

Imagine that you have a database with millions of data points that you would
like to display in a line graph.

That already sounds challenging, doesn't it?

This is one of those use cases where reference actions can really come in handy.
It does not have to be hard at all.

You don't have to pay in complexity, visual fidelity, accuracy, or
performance. 🤯

<div class="tabs">
  <label><input type="radio" name="tabs-2" checked>HTML</label>
  <label><input type="radio" name="tabs-2">Server</label>
  <label><input type="radio" name="tabs-2">Result</label>
  <section>
```html
--8<-- "snippets/reference-chart-client.html"
```
  </section>
  <section>
```js
  // obtain an absurd number of data points
  // this will be an array with ten million numbers!
  // again, like all the other demos, this is 100% true and 100% real
  // no cutting corners here ;)
  server.series = generateSeries(10_000_000);
```
<hr class="mv0">
```html
--8<-- "snippets/reference-chart-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/reference-chart-client.html"
  </section>
</div>
