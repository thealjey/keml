# Handling actions

HTML elements can trigger server requests or redirects in response to an action.

Multiple elements can handle the same action and trigger different requests.

Relative endpoints are supported. Given a current URL of
"https:/[]()/www[]().example.[]()com/some/path":

- "list-todo" or "./list-todo" → "https:/[]()/www[]().example.[]()com/some/path/list-todo/"
- "../list-todo" → "https:/[]()/www[]().example.[]()com/some/list-todo/"
- "/list-todo" → "https:/[]()/www[]().example.[]()com/list-todo/"
- "/file.html" → "https:/[]()/www[]().example.[]()com/file.html"

A trailing slash is always present for paths that do not end with a file 
extension and never present for those that do.

Form and form-field values are automatically serialized and sent to the server.

Any element that sends a request can also be made serializable by giving it the 
"name" and "value" attributes.

A request is allowed only if an element is considered valid — that is, if it 
either lacks a `checkValidity` method or if the method returns `true`.

KEML informs the server of the AJAX nature of its requests by automatically
including a special "X-Requested-With" header in each request.

KEML informs the server of the browser’s timezone — used for server-side date
formatting — by setting a "tzo" cookie to the value returned by the
[getTimezoneOffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
function.

## Attributes

1. `on` subscribes the element to a single action initiated by any element,
   including the current one.
1. `reset` subscribes the element to a single action initiated by any element,
   including the current one, but is used specifically for resetting the 
   current element (such as a form, form field, or any element that has a 
   `reset` method with the signature `() => void`). Resets are immediate and 
   are not affected by `debounce` or `throttle`.
1. `redirect`, when specified on an element with an `on` attribute, makes it
   issue redirects instead of requests. Redirect URIs are resolved in the same
   way as request URIs. The `redirect` attribute can have one of four possible
   values:
    * `pushState` — will call the same method of the History API
    * `replaceState` — will call the same method of the History API
    * `assign` — will call the same method of the `location` object
    * `replace` — will call the same method of the `location` object
1. `href`, `action`, `src`, `get`, `post`, `put`, or `delete` specify the
   endpoint to call (the default endpoint is an empty string).
1. `method`, `get`, `post`, `put`, or `delete` specify the HTTP method to use in
   the request (the default method is "GET").
1. `name` and `value` can be used on any element, not just on form fields
1. `debounce` specifies a number of milliseconds by which to debounce a
request/redirect
1. `throttle` specifies a number of milliseconds by which to throttle a
request/redirect
1. any attribute that starts with `h-` and contains a custom request header value
1. `credentials` with any value or none at all, sets the
  [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
  value to `true`
1. `once`, with any value or none at all, automatically removes the `on`
   attribute before starting a request or redirect.

## Request Example

- clicking the button initiates the `doSomething` action
- the div subscribes to that action and sends a "GET" request to "/data"
- the checkbox subscribes to that action and sends a "POST" request to
  "/toggle" with a multipart encoded body containing its value
- nothing else happens since neither of the elements specifies what to do with
  their respective server responses

```html
<button on:click="doSomething">click me</button>

<div
  on="doSomething"
  get="/data"
></div>

<input
  on="doSomething"
  post="/toggle"
  type="checkbox"
  name="agree"
>
```

## Redirect Example

- This example is identical to the one above, but because of the `redirect`
  attribute, instead of sending a network request, it performs a redirect using
  the History API. In this case, specifying an HTTP method has no effect, as it
  is meaningless in a redirect.

```html
<button on:click="doSomething">click me</button>

<div
  on="doSomething"
  redirect="pushState"
  get="/data"
></div>
```

## Reset Example

- clicking the button resets the form

```html
<button on:click="resetForm">click me</button>

<form reset="resetForm"></form>
```
