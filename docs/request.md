# Sending requests

HTML elements can trigger server requests in response to an action.

More than one element can handle the same action and can trigger different
requests.

Relative endpoints are supported, so given a current URI of
"https:/[]()/www[]().example.[]()com/some/path":

- "list-todo" or "./list-todo" will both resolve to
  "https:/[]()/www[]().example.[]()com/some/path/list-todo"
- "../list-todo" will resolve to
  "https:/[]()/www[]().example.[]()com/some/list-todo"
- "/list-todo" will resolve to
  "https:/[]()/www[]().example.[]()com/list-todo"

Forms and form fields values are automatically serialized and sent to the
server.

What's more is that ANY element that sends a request can also be made
serializable by giving it the "name" and the "value" attributes.

## Attributes

1. `on` subscribes the element to a single action, initiated by any element,
  including the current one
1. `href`, `action`, `src`, `get`, `post`, `put` or `delete` are used to specify
  an endpoint to call
1. `method`, `get`, `post`, `put` or `delete` are used to specify the HTTP
  method to use in the request
1. `name` and `value` can be used on any element, not just on form fields
1. `debounce` specifies a number of milliseconds by which to debounce a request
1. `throttle` specifies a number of milliseconds by which to throttle a request
- any attribute that starts with `h-` and contains a custom request header value
1. `credentials` with any value or none at all, sets the
  [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
  value to `true`
1. `once` with any value or none at all, automatically removes the `on`
  attribute after a successful request

## Example

- clicking the button initiates the `doSomething` action
- the div subscribes to that action and sends a "GET" request to "/data"
- the checkbox subscribes to that action and sends a "POST" request to
  "/toggle" with a multipart encoded body containing its value
- nothing else happens since neither of the elements specifies what to do with
  their respective server responses

```html
<button on:click="doSomething">click me</button>

<div    on="doSomething"
        get="/data"
></div>

<input  on="doSomething"
        post="/toggle"
        type="checkbox"
        name="agree"
>
```
