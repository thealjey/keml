# Rendering responses

HTML elements that trigger requests can initiate multiple result actions, all of 
which refer to the same response after receiving a server response.

Multiple elements can initiate the same result action, thus triggering the
rendering of different responses under the same action name.

Multiple elements can subscribe to the same result action and render the same
server response.

KEML applies the minimal set of DOM mutations necessary to synchronize the
document with the server response.

If the server response is identical to what is currently rendered in the
document, no changes are applied.

## Attributes

1. `result`, specified on an element that performs a request, contains a
   space-separated list of render actions to initiate.
1. `error` works exactly like `result`, but applies when the server responds
   with an unsuccessful status code.
1. `render`, specified on any element — including the one that triggered the
   request — contains the render action name to subscribe to.
1. `key` uniquely identifies an element among its DOM siblings (same-level
   nodes). It helps the diffing algorithm recognize elements between renders. It
   is strongly recommended only when sibling tag names or internal structures
   differ; in that case, keys are useful if elements are added, removed, or
   reordered.
1. `position` controls the render strategy applied to the element itself:
    - `replaceChildren` (default) replaces all of the element's children with
      the server response
    - `replaceWith` replaces the element itself with the server response
    - `before` renders the server response directly before the current element
    - `after` renders the server response directly after the current element
    - `prepend` prepends the server response before the first child of the
      current element
    - `append` appends the server response after the last child of the current
      element

## Basic example

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

## Key based optimization example

Imagine that your server endpoint returns this HTML on the first request:

```html
<table>
  <!-- heavy DOM with a lot of rows -->
</table>
```

And on the next request it returns:

```html
<div class="info">
  Notification text
</div>

<table>
  <!-- heavy DOM with a lot of rows -->
</table>
```

The table used to be at position 0 among its siblings, and now it is at 
position 1.

The renderer would have no way of knowing it is the same table and would have
to re-render everything from scratch.

Since the tag names no longer match their previous positions, we cannot take
advantage of any diffing algorithm to help us.

It would still work, but performance would suffer significantly.

Here is what your server should do:

```html
<div
  key="notification"
  class="info"
>
  Notification text
</div>

<table key="table">
  <!-- heavy DOM with a lot of rows -->
</table>
```

Now both elements clearly identify themselves to the renderer, and performance
is excellent once again.

!!! info "Info"
    Keys are not actions.

    They do not need to be globally unique — only unique among sibling DOM
    elements.

That said, keys matter only when the actual structure of sibling elements
changes between renders.

For example, let's imagine that your server returns this html on the first
request:

```html
<li key="1">Book title 1</li>
<li key="2">Book title 2</li>
```

And on the next request it returns:

```html
<li key="2">Book title 2</li>
<li key="1">Book title 1</li>
```

The keys are redundant here because it is slightly more expensive and 
unnecessary to shuffle these list items than simply updating the contents of 
their respective text nodes.

This would then be both simpler and more efficient:

```html
<li>Book title 2</li>
<li>Book title 1</li>
```
