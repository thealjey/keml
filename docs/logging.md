Sometimes, the information available statically, just by reading the HTML, may
not be enough, and you may need to peek at the runtime value of an important
variable.

With a well-designed API, such situations should be rare. But the real world is
messy, and they cannot be avoided entirely.

This is where the dedicated `log` attribute comes in.

Most of the time, it does nothing and is generally harmless to add, even to
every single element. However, it is still a debugging flag and, from a purely
aesthetic point of view, should not be left enabled in production.

All it ever does is log information to the JavaScript console that the element
deems important at a particular moment in time.

<!-- prettier-ignore-start -->
!!! info "Info"
    Currently, this attribute only logs event objects in the presence of an
    [event:](./event/on-colon.md#event-modifier) modifier, right before
    performing the matching for it. However, the `log` attribute itself is meant
    to be general-purpose, and its functionality may be extended in the future.
<!-- prettier-ignore-end -->

---

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/log-server.html"
```
  </section>
  <section class="browser">
    <div>
      <button></button>
      <button></button>
      <div>https://www.log-example.com/</div>
    </div>
    <div></div>
    <div>
      <div>
        <button></button>
      </div>
      <div></div>
    </div>
  </section>
</div>
