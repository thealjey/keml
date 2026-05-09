Like [on](on.md), `reset` also accepts a single event action as input.

The only job of this feature is to restore the element's default value.

Custom elements (e.g. Web Components) can also be made resettable; all they
must do is implement the standard
[reset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset)
method.

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/reset-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/reset-client.html"
  </section>
</div>
