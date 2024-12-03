# Handling actions

HTML elements can trigger server requests and redirects in response to an
action.

More than one element can handle the same action and can trigger different
requests.

Relative endpoints are supported, so given a current URL of
"https:/[]()/www[]().example.[]()com/some/path":

- "list-todo" or "./list-todo" will both resolve to
  "https:/[]()/www[]().example.[]()com/some/path/list-todo/"
- "../list-todo" will resolve to
  "https:/[]()/www[]().example.[]()com/some/list-todo/"
- "/list-todo" will resolve to
  "https:/[]()/www[]().example.[]()com/list-todo/"
- "/file.html" will resolve to
  "https:/[]()/www[]().example.[]()com/file.html" (a trailing slash is always
  present for paths not ending with a file extension, and is never present for
  ones that are)

Forms and form fields values are automatically serialized and sent to the
server.

What's more is that ANY element that sends a request can also be made
serializable by giving it the "name" and the "value" attributes.

A request is only allowed if an element is considered valid (i.e. it either does
not have a `checkValidity` method or it returns true).

KEML makes the server aware of the AJAX nature of its requests by automatically
including a special "X-Requested-With" header in each request.

KEML makes the server aware of the browsers timezone for the server-side
date formatting by setting a "tzo" cookie to the value produced by the
[getTimezoneOffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
function.

## Attributes

1. `on` subscribes the element to a single action, initiated by any element,
  including the current one
1. `reset` also subscribes the element to a single action, initiated by any
element, including the current one, but is used specifically for resetting the
current element (like a form or a form field, but really any element that has a
`reset` method with the following signature: `() => void`); resets are immediate
and are not affected by `debounce` and `throttle`
1. `redirect` if specified on an element with an `on` attribute makes it issue
redirects instead of requests; redirect URIs are resolved exactly the same way
as the request URIs; can have one of four possible values:
    * `pushState` will call the same method of the history api
    * `replaceState` will call the same method of the history api
    * `assign` the same as `pushState`, but will cause a full page reload
    * `replace` the same as `replaceState`, but will cause a full page reload
1. `href`, `action`, `src`, `get`, `post`, `put` or `delete` are used to specify
  an endpoint to call (the default endpoint is "")
1. `method`, `get`, `post`, `put` or `delete` are used to specify the HTTP
  method to use in the request (the default method is "GET")
1. `name` and `value` can be used on any element, not just on form fields
1. `debounce` specifies a number of milliseconds by which to debounce a
request/redirect
1. `throttle` specifies a number of milliseconds by which to throttle a
request/redirect
1. any attribute that starts with `h-` and contains a custom request header value
1. `credentials` with any value or none at all, sets the
  [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
  value to `true`
1. `once` with any value or none at all, automatically removes the `on`
attribute before starting a request/redirect

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

- this is exactly like the example above, but, because of the `redirect`
attribute, instead of sending a network request we perform a redirect using the
history api; in this case specifying an http method does nothing as it is
meaningless in a redirect

```html
<button on:click="doSomething">click me</button>

<div
  on="doSomething"
  redirect="pushState"
  get="/data"
></div>
```

## Reset Example

- clicking the button resets the input and the form

```html
<button on:click="resetField resetForm">click me</button>

<input reset="resetField">
<form reset="resetForm"></form>
```
