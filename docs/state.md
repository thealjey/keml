# State actions

HTML elements can configure any number of attributes in response to state
`actions` by prepending their names with `x-`.

Multiple elements can handle the same action and configure their attributes
differently.

A state can essentially be viewed as a boolean flag that is always set to false
by default.

## Attributes

1. `if:loading` specified on an element that launches a request, contains a
  space separated list of state actions to turn ON immediately before starting
  a request and to turn OFF immediately after a request completes
1. `if:error` specified on an element that launches a request, contains a space
  separated list of state actions to turn OFF immediately before starting a
  request and to turn ON immediately after a request fails
1. `if:invalid` specified on a form or a form field, contains a space separated
  list of state actions to turn ON when the element becomes invalid and to turn
  OFF when the element becomes valid (invalid forms and fields do not trigger
  server requests)
1. `if:value` inputs, selects, text areas and checkboxes can be considered to
  have a value when they are not empty
1. `if:intersects` is turned ON when the element intersects the viewport
1. `if` specified on any element, including the same one that issued a state
  action, and subscribes to a single state action

## Loading State Example

- the first div is initially visible and the second div is initially hidden
- clicking the button:
    - initiates the `loadData` action
    - turns ON the `isLoadingData` state action, thus the first div becomes
    invisible and the second visible
    - sends a "GET" request to "/data"
    - after completion of the request turns OFF the `isLoadingData` state
    action, thus the first div becomes visible and the second invisible again

```html
<button
  on:click="loadData"
  on="loadData"
  get="/data"
  if:loading="isLoadingData"
>
  click me
</button>

<div
  if="isLoadingData"
  x-style="display: none"
>
  not loading
</div>

<div
  if="isLoadingData"
  style="display: none"
  x-style
>
  loading
</div>
```

## Error State Example

- the first div is initially visible and the second div is initially hidden
- clicking the button
    - initiates the `loadWrong` action
    - turns OFF the `isError` state action, which does not change the visibility
      of the divs
    - sends a "GET" request to "/non-existent"
    - after completion of the request turns ON the `isError` state action,
      because the request has failed, thus the first div becomes invisible and
      the second visible

```html
<button
  on:click="loadWrong"
  on="loadWrong"
  get="/non-existent"
  if:error="isError"
>
  click me
</button>

<div
  if="isError"
  x-style="display: none"
>
  no error
</div>

<div
  if="isError"
  style="display: none"
  x-style
>
  error
</div>
```

## Invalid State Example

- the first div will be visible initially as well as when the inputs' value
  becomes a valid email
- the second div will be visible only when the inputs' value becomes an invalid
  email

```html
<input
  if:invalid="invalidEmail"
  type="email"
>

<div
  if="invalidEmail"
  x-style="display: none"
>
  valid
</div>

<div
  if="invalidEmail"
  style="display: none"
  x-style
>
  invalid
</div>
```

## Value State Example

- the first div will be visible when the input value is cleared in some way
- the second div will be visible when the user enters something into the input

```html
<input
  if:value="isNotEmpty"
  type="text"
>

<div
  if="isNotEmpty"
  x-style="display: none"
>
  empty
</div>

<div
  if="isNotEmpty"
  style="display: none"
  x-style
>
  not empty
</div>
```

## Intersects State Example

- the first div will be visible when the user scrolls the page such that the
paragraph is out of view or if the paragraph is removed from the page altogether
- the second div will be visible when the paragraph becomes visible in the
viewport

```html
<p if:intersects="canSee"></p>

<br>
<br>
<br>

<div
  if="canSee"
  x-style="display: none"
>
  out of viewport
</div>

<div
  if="canSee"
  style="display: none"
  x-style
>
  in the viewport
</div>
```
