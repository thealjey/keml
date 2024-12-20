# Rendering responses

HTML elements that trigger requests can initiate multiple result actions after
receiving a server response.

Multiple elements can initiate the same result action, thus triggering the
render of a different response under the same action name.

Multiple elements can subscribe to the same result action and render the same
server response.

KEML applies the minimum set of DOM mutations necessary to synchronize the
document with the server response.

If the server response can be determined to be the same as what is currently
rendered in the document, no changes are applied at all.

## Attributes

1. `result` specified on an element that performs a request and contains a
   space separated list of render actions to initiate
1. `error` works exactly like `result` but for situations when the server
   responds with an unsuccessful status code
1. `render` specified on any element, including the same one that triggered the
   request and contains the render action name to subscribe to
1. `position` controls the render strategy to apply to itself:
    - `replaceChildren` (default) replaces all of the elements' children with
      the server response
    - `replaceWith` replaces the element itself with the server response
    - `before` renders the server response directly before the current element
    - `after` renders the server response directly after the current element
    - `prepend` prepends the server response before the first child of the
      current element
    - `append` appends the server response after the last child of the current
      element

## Example

- clicking the button initiates the `getUserCount` action
- the button itself subscribes to that action using the `on` attribute
- the button sends a "GET" request to "/user-count"
- upon successfully receiving the response the button initiates the `userCount`
  result action
- the div subscribes to the `userCount` action and renders the server response
  into itself
- the span subscribes to the `userCount` action and replaces itself with the
  server response

```html
<button
  on:click="getUserCount"
  on="getUserCount"
  get="/user-count"
  result="userCount"
>
  click me
</button>

<div render="userCount"></div>

<span
  render="userCount"
  position="replaceWith"
></span>
```
