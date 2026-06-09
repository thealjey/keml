This feature is responsible for initiating requests to the server.

It supports the following request types:

- XHR requests, including form submissions
- full page transitions
- History API navigation

Its only responsibility is configuring and sending the request. What happens
after the request is outside the scope of this feature.

---

All XHR requests include an `X-Requested-With` header set to `XMLHttpRequest`,
allowing the server to distinguish XHR requests from full page navigation when
needed.

KEML sets a permanent cookie named `tzo`, containing the
[browser timezone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
after the first load of any page that includes the KEML runtime, all subsequent
requests will include this cookie.

KEML relies heavily on and benefits from the existing web stack, without
overriding its semantics or behavior, including the standard browser page
caching mechanisms.

Thus, if your server is smart about sending the correct caching response headers
at the correct time - that can help speed up KEML even more.

That's right, your application's performance optimizations also live on the
server 🤯.

---

The `on` attribute is the only required attribute for an element to become
capable of initiating requests to the server.

Even though most examples here show `on` being used on the same element as
`on:*`, that is only for brevity and simplicity's sake. It can appear on any
number of elements at once.

`on` provides a set of optional attributes for customizing its behavior.
These are covered in the sections below.

---

## Endpoint+Method Configuration

The default endpoint is an empty string (`""`).

The default HTTP method is `GET`.

Given the current URL:

```txt
https://www.example.com/some/path
```

| Configuration                | Result                                       |
| ---------------------------- | -------------------------------------------- |
| _(empty)_                    | https://www.example.com/some/path/           |
| `list-todo` or `./list-todo` | https://www.example.com/some/path/list-todo/ |
| `../list-todo`               | https://www.example.com/some/list-todo/      |
| `/list-todo`                 | https://www.example.com/list-todo/           |
| `/file.html`                 | https://www.example.com/file.html            |

Automatic normalization:

- paths ending in a file extension → exactly zero trailing slashes
- paths without a file extension → exactly one trailing slash

---

### `get`, `href`, `action` and `src`

These attributes override the default endpoint.

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Server</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/endpoint-get-override-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/endpoint-override-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/endpoint-get-override-client.html"
  </section>
</div>

---

### `post`, `put` and `delete`

These attributes override both the default endpoint and the default HTTP method.

The method they set is the same as the attribute name.

<div class="tabs">
  <label><input type="radio" name="tabs-2" checked>HTML</label>
  <label><input type="radio" name="tabs-2">Server</label>
  <label><input type="radio" name="tabs-2">Result</label>
  <section>
```html
--8<-- "snippets/endpoint-post-override-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/endpoint-override-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/endpoint-post-override-client.html"
  </section>
</div>

---

### `about:blank`

You can "send a request" to the `about:blank` endpoint when no work is needed
and an empty response should be produced.

This does not trigger any network request.

<div class="tabs">
  <label><input type="radio" name="tabs-3" checked>HTML</label>
  <label><input type="radio" name="tabs-3">Result</label>
  <section>
```html
--8<-- "snippets/about-blank-client.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/about-blank-client.html"
  </section>
</div>

---

### `method`

This attribute overrides just the default HTTP method. The provided value will
be converted into all uppercase.

There are no restrictions on the value — it can be anything as long as your
server understands the verb.

It has higher precedence than the attributes shown above.

<div class="tabs">
  <label><input type="radio" name="tabs-4" checked>HTML</label>
  <label><input type="radio" name="tabs-4">Server</label>
  <label><input type="radio" name="tabs-4">Result</label>
  <section>
```html
--8<-- "snippets/method-override-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/endpoint-override-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/method-override-client.html"
  </section>
</div>

---

## [debounce](https://developer.mozilla.org/en-US/docs/Glossary/Debounce) and [throttle](https://developer.mozilla.org/en-US/docs/Glossary/Throttle)

These attributes can be used to rate limit the `on` feature.

<div class="tabs">
  <label><input type="radio" name="tabs-5" checked>HTML</label>
  <label><input type="radio" name="tabs-5">Server</label>
  <label><input type="radio" name="tabs-5">Result</label>
  <section>
```html
--8<-- "snippets/expensive-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/expensive-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/expensive-client.html"
  </section>
</div>

---

## Request Data

Forms submit their fields the same way they always did in HTML, including native
field validation rules.

Custom elements (e.g. Web Components) can also be made validatable; all they
must do is implement the standard
[checkValidity](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/checkValidity)
method.

What's more, any element inside the one sending the request, including the
element itself, can contribute values to the request data by specifying a `name`
and a `value` attribute. For non-form fields, both attributes must be provided.

<div class="tabs">
  <label><input type="radio" name="tabs-6" checked>HTML</label>
  <label><input type="radio" name="tabs-6">Server</label>
  <label><input type="radio" name="tabs-6">Result</label>
  <section>
```html
--8<-- "snippets/form-submit-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/form-submit-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/form-submit-client.html"
  </section>
</div>

---

Form fields can even submit themselves without a form at all.

This example works exactly the same.

<div class="tabs">
  <label><input type="radio" name="tabs-7" checked>HTML</label>
  <label><input type="radio" name="tabs-7">Server</label>
  <label><input type="radio" name="tabs-7">Result</label>
  <section>
```html
--8<-- "snippets/field-submit-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/form-submit-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/field-submit-client.html"
  </section>
</div>

---

It does not even have to be a form field.

<div class="tabs">
  <label><input type="radio" name="tabs-8" checked>HTML</label>
  <label><input type="radio" name="tabs-8">Server</label>
  <label><input type="radio" name="tabs-8">Result</label>
  <section>
```html
--8<-- "snippets/div-submit-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/form-submit-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/div-submit-client.html"
  </section>
</div>

---

### Request Headers

Request headers can be set using:

`h-<header name>="header value"`

<div class="tabs">
  <label><input type="radio" name="tabs-9" checked>HTML</label>
  <label><input type="radio" name="tabs-9">Server</label>
  <label><input type="radio" name="tabs-9">Result</label>
  <section>
```html
--8<-- "snippets/request-headers-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/request-headers-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/request-headers-client.html"
  </section>
</div>

---

### [credentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)

RTFM <small>(just kidding)</small>

This is simply the standard mechanism for including credentials (e.g. cookies)
when making requests to another domain, where they would normally not be
included for security reasons.

Make sure you know what you're doing if you're using this.

This is a boolean attribute, so its value is ignored and only the presence
determines whether or not the credentials are enabled.

<div class="tabs">
  <label><input type="radio" name="tabs-10" checked>HTML</label>
  <label><input type="radio" name="tabs-10">Server</label>
  <label><input type="radio" name="tabs-10">Result</label>
  <section>
```html
--8<-- "snippets/credentials-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/credentials-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/credentials-client.html"
  </section>
</div>

---

## `stream`

This attribute allows the server to stream multiple responses after a single
request. Responses do not need to arrive at the same time, and their number does
not have to be finite.

Think of this as a middle ground between a normal XHR request and an
[SSE](../sse.md) connection.

It behaves like an XHR request in most respects, but can remain persistent like
[SSE](../sse.md). It is also simpler on the backend, since you can send as much
data as you like, as often as you like, and it will continue streaming until you
finalize the response.

Use [SSE](../sse.md) when you want to send results to all subscribed clients,
and use streaming when you want to send the same kind of results in response to
a single request from a specific client.

This is made possible by a special delimiting HTML comment convention:
`<!-- KEML -->`. Each distinct portion of HTML you send must be separated by
this delimiter. You must ensure that the text between two delimiting comments is
a valid, complete, and parsable HTML fragment. The comment is case- and
whitespace-insensitive.

<div class="tabs">
  <label><input type="radio" name="tabs-11" checked>HTML</label>
  <label><input type="radio" name="tabs-11">Server</label>
  <label><input type="radio" name="tabs-11">Result</label>
  <section>
```html
--8<-- "snippets/stream-client.html"
```
  </section>
  <section>
    <p class="mh3">
      Since the last message is not delimited by a
      <code>&lt;!-- KEML --&gt;</code> comment, it will not be received until
      <code>server.end()</code> is called.
    </p>
    <p class="mh3">
      Because there is a <code>server.end()</code> call, this stream is finite.
    </p>
    <p class="mh3">
      After receiving a single request, this endpoint will return four separate
      responses: the first immediately, and the next three spaced two seconds
      apart.
    </p>
    <p class="mh3">
      In this example server, the timing is a bit contrived for simplicity.
      In the real world, these streamed fragments may be delayed by database
      latency, a microservice response, a chatbot generating messages, or any
      other timing-dependent behavior.
    </p>
```html
--8<-- "snippets/stream-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/stream-client.html"
  </section>
</div>

---

## `redirect`

This attribute switches the operational mode of `on` from sending requests to
performing redirects.

The endpoint resolution logic remains the same. Headers and HTTP method are
ignored. Form data (excluding file uploads) is applied to the query string.

---

### `assign`

This option performs a full page navigation.

<div class="tabs">
  <label><input type="radio" name="tabs-12" checked>Page A</label>
  <label><input type="radio" name="tabs-12">Page B</label>
  <label><input type="radio" name="tabs-12">Page C</label>
  <label><input type="radio" name="tabs-12">Result</label>
  <section>
```html
--8<-- "snippets/location-assign-a-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/location-assign-b-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/location-assign-c-server.html"
```
  </section>
  <section class="browser">
    <div>
      <button></button>
      <button></button>
      <div>https://www.assign-example.com/page-a/</div>
    </div>
    <div></div>
  </section>
</div>

---

### `replace`

This option performs a full page navigation, but replaces the current history
entry instead of adding a new one.

<div class="tabs">
  <label><input type="radio" name="tabs-13" checked>Page A</label>
  <label><input type="radio" name="tabs-13">Page B</label>
  <label><input type="radio" name="tabs-13">Page C</label>
  <label><input type="radio" name="tabs-13">Result</label>
  <section>
```html
--8<-- "snippets/location-replace-a-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/location-replace-b-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/location-assign-c-server.html"
```
  </section>
  <section class="browser">
    <div>
      <button></button>
      <button></button>
      <div>https://www.replace-example.com/page-a/</div>
    </div>
    <div></div>
  </section>
</div>

---

### `pushState` and `replaceState`

These options work exactly the same, but use the History API and do not cause a
full page navigation.

Oh, and did I forget to mention that you get SSR for free? It is not some
separate thing you have to implement, and it does not impose restrictions on
your server infrastructure 🤯.

<div class="tabs">
  <label><input type="radio" name="tabs-14" checked>HTML</label>
  <label><input type="radio" name="tabs-14">Page A</label>
  <label><input type="radio" name="tabs-14">Page B</label>
  <label><input type="radio" name="tabs-14">Page C</label>
  <label><input type="radio" name="tabs-14">Result</label>
  <section>
```html
--8<-- "snippets/history-home-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/history-a-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/history-b-server.html"
```
  </section>
  <section>
```html
--8<-- "snippets/history-c-server.html"
```
  </section>
  <section class="browser">
    <div>
      <button></button>
      <button></button>
      <div>https://www.history-example.com/page-a/</div>
    </div>
    <div></div>
  </section>
</div>

---

## `once`

This is a self-destruct instruction for the `on` attribute. It is removed after
the first invocation.

<div class="tabs">
  <label><input type="radio" name="tabs-15" checked>HTML</label>
  <label><input type="radio" name="tabs-15">Server</label>
  <label><input type="radio" name="tabs-15">Result</label>
  <section>
```html
--8<-- "snippets/once-client.html"
```
  </section>
  <section>
```html
--8<-- "snippets/once-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/once-client.html"
  </section>
</div>

---

## Polling

<!-- prettier-ignore-start -->
!!! info "Info"
    Example only provided for completeness. You are discouraged from doing this.
    Use [SSE](../sse.md) if possible.
<!-- prettier-ignore-end -->

KEML does not implement polling as a dedicated feature, but it can still be
assembled from the basic building blocks shown above.

<div class="tabs">
  <label><input type="radio" name="tabs-16" checked>Server</label>
  <label><input type="radio" name="tabs-16">Result</label>
  <section>
```html
--8<-- "snippets/polling-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/polling-client.html"
  </section>
</div>

---

## Virtualization

KEML does not implement virtualization as a dedicated feature, but it can still
be assembled from the basic building blocks shown above.

<div class="tabs">
  <label><input type="radio" name="tabs-17" checked>HTML</label>
  <label><input type="radio" name="tabs-17">Server</label>
  <label><input type="radio" name="tabs-17">Result</label>
  <section>
```html
--8<-- "snippets/virtualization-client.html"
```
  </section>
  <section>
```js
const tempLabels = [
  "Deep Freezing",
  "Freezing",
  "Cold",
  "Cool",
  "Mild Moderate",
  "Moderate",
  "Warm",
  "Hot",
  "Very Hot",
  "Scorching",
];
// Create a dataset with 350,000 rows
server.table = Array.from({ length: 350_000 }, (_, i) => ({
  temperature: (i = Math.random() * 100).toFixed(2),
  label: tempLabels[Math.max(0, ((i - 1) / 10) | 0)],
}));
```
```html
--8<-- "snippets/virtualization-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/virtualization-client.html"
  </section>
</div>
