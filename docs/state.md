# State actions

HTML elements can configure any number of attributes in response to state
actions by prefixing their names with `x-`.

Multiple elements can handle the same action while configuring their attributes
differently.

A state can be viewed as a boolean flag that is set to `false` by default.

## Attributes

1. `if:loading`, specified on an element that launches a request, contains a 
   space-separated list of state actions to turn ON immediately before a 
   request starts and turn OFF immediately after it completes.
1. `if:error`, specified on an element that launches a request, contains a 
   space-separated list of state actions to turn OFF immediately before a 
   request starts and turn ON immediately after it fails.
1. `if:invalid`, specified on a form or form field, contains a space-separated
   list of state actions to turn ON when the element becomes invalid and to turn
   OFF when it becomes valid. Invalid forms and fields do not trigger server
   requests.
1. `if:value` — Inputs, selects, text areas, and checkboxes are considered to
   have a value when they are not empty.
1. `if:intersects` turns ON when the element intersects the viewport.
1. `if`, specified on any element — including the one that issued a state
   action — subscribes to a single state action.
1. Any attribute starting with `x-` activates when a state action turns ON —
   replacing any existing attribute of the same name — and is restored to its
   original value when the state action turns OFF.

## Loading State Example

- the first div is initially visible and the second div is initially hidden
- Clicking the button:
    - initiates the `loadData` action
    - turns ON the `isLoadingData` state action, making the first div
      invisible and the second visible
    - sends a "GET" request to "/data"
    - after the request completes, turns OFF the `isLoadingData` state
      action, making the first div visible and the second invisible again

```html
<button
  get="/data"
  if:loading="isLoadingData"
  on="loadData"
  on:click="loadData"
>click me</button>
<div if="isLoadingData" x-style="display: none">not loading</div>
<div if="isLoadingData" style="display: none" x-style>loading</div>
```

## Error State Example

- The first div is initially visible, and the second div is initially hidden.
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
  get="/non-existent"
  if:error="isError"
  on="loadWrong"
  on:click="loadWrong"
>click me</button>
<div if="isError" x-style="display: none">no error</div>
<div if="isError" style="display: none" x-style>error</div>
```

## Invalid State Example

- the first div will be visible initially as well as when the inputs' value
  becomes a valid email
- the second div will be visible only when the inputs' value becomes an invalid
  email

```html
<input if:invalid="invalidEmail" type="email">
<div if="invalidEmail" x-style="display: none">valid</div>
<div if="invalidEmail" style="display: none" x-style>invalid</div>
```

## Value State Example

- the first div will be visible when the input value is cleared in some way
- the second div will be visible when the user enters something into the input

```html
<input if:value="isNotEmpty" type="text">
<div if="isNotEmpty" x-style="display: none">empty</div>
<div if="isNotEmpty" style="display: none" x-style>not empty</div>
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
<div if="canSee" x-style="display: none">out of viewport</div>
<div if="canSee" style="display: none" x-style>in the viewport</div>
```
