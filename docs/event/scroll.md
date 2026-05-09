Like [on](on.md), `scroll` also accepts a single event action as input.

This feature scrolls the element.

Custom elements (e.g. Web Components) can also be made scrollable; all they
must do is implement the standard
[scroll](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll) and
[scrollBy](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollBy)
methods.

`scroll` provides a set of optional attributes for customizing its behavior.
These are covered in the sections below.

---

## `behavior`

<!-- prettier-ignore-start -->
!!! warning reduced-motion-warning "Warning"
    Smooth scrolling is disabled because of your system’s motion settings.

    You can enable it here:

    - **Windows**: Settings → Accessibility → Visual effects → Animation effects
    - **macOS**: System Settings → Accessibility → Display → Reduce motion
    - **iOS**: Settings → Accessibility → Motion → Reduce Motion
    - **Android**: Settings → System → Accessibility → Remove animations
    - **Firefox**: `about:config` -> add `ui.prefersReducedMotion` (number) and
      set it to `0` or `1`. This overrides the system setting.
<!-- prettier-ignore-end -->

Specifies whether the scrolling should animate smoothly (`smooth`), happen
instantly in a single jump (`instant`), or let the browser choose
(`auto`, default).

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/scroll-behavior-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/scroll-behavior-client.html"
  </section>
</div>

---

## `relative`

This is a boolean attribute. When present, scrolling uses relative offsets
instead of an absolute position.

<div class="tabs">
  <label><input type="radio" name="tabs-2" checked>HTML</label>
  <label><input type="radio" name="tabs-2">Result</label>
  <section>
```html
--8<-- "snippets/scroll-relative-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/scroll-relative-client.html"
  </section>
</div>

---

### `top`

Specifies how much to scroll vertically.

Can be set to one of the following:

- a numeric pixel value
- `start` to scroll all the way to the top
- `center` to scroll to the middle
- `end` to scroll all the way to the bottom

<div class="tabs">
  <label><input type="radio" name="tabs-3" checked>HTML</label>
  <label><input type="radio" name="tabs-3">Result</label>
  <section>
```html
--8<-- "snippets/scroll-top-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/scroll-top-client.html"
  </section>
</div>

---

### `left`

Specifies how much to scroll horizontally.

Can be set to one of the following:

- a numeric pixel value
- `start` to scroll all the way to the left
- `center` to scroll to the middle
- `end` to scroll all the way to the right

<div class="tabs">
  <label><input type="radio" name="tabs-4" checked>HTML</label>
  <label><input type="radio" name="tabs-4">Result</label>
  <section>
```html
--8<-- "snippets/scroll-left-client.html"
```
  </section>
  <section class="pa3">
--8<-- "snippets/scroll-left-client.html"
  </section>
</div>
