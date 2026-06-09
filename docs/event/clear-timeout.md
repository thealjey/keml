Like [on](on.md), `clear-timeout` also accepts a single event action as input.

This feature cancels a delayed request that was previously scheduled by either
[`debounce` or `throttle`](./on.md#debounce-and-throttle).

If an element instance has a `timeoutId` property, it will be passed to the
global `clearTimeout` function and then set to `undefined`.

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Server</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/increment-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/increment-server.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/increment-client.html"
  </section>
</div>
