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

---

## `event:` modifier

You can print the event object to the console to see exactly what it contains,
taking the guesswork out of writing an `event:` modifier.

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

---

## Unparsable URL

A request is sent to the wrong endpoint? Not sent at all? Perhaps the endpoint
you specified could not be parsed!

<div class="tabs">
  <label><input type="radio" name="tabs-2" checked>HTML</label>
  <label><input type="radio" name="tabs-2">Result</label>
  <section>
```html
--8<-- "snippets/url-parse-error-server.html"
```
  </section>
  <section class="browser">
    <div>
      <button></button>
      <button></button>
      <div>https://www.url-parse-error-example.com/</div>
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
