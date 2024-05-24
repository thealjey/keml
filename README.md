# KEML <sub>don't re-invent the wheel😜</sub>

An [HTMX](https://htmx.org/) (thank you for the inspiration) alternative with a different API that is meant to be simpler and more flexible at the same time.

Optimized using [Google Closure Compiler](https://developers.google.com/closure/compiler/) (thank you for an awesome and, sadly, underappreciated tool) to have a hilariously tiny file size (~4k without gz, which is ~11.6x smaller than HTMX), although performance is always prioritized over file size.

Great care is taken to guarantee the absolute maximum performance and minimal memory usage, minimizing the amount of work that not only the library is doing, but also that the browser has to do.

The existing DOM is patched in the most efficient way possible by default instead of being overwritten, without a need for any plugins or configuration.

Does not require for you to learn and use any selector syntax, because there's no need for selectors at all as they are replaced by `actions` instead.

The server responses are considered black-box, there is no magic `title` or `meta` tag behavior, no response splitting or selecting parts of it.

There is no inheritance.

The API is so stupid simple that it may not even require a documentation website.

## Installation

There is no programmatic API, nothing is exported in JS, nothing to install or configure.

You load the library from a CDN and forget that JS even existed at all.
```html
<script src="https://unpkg.com/keml"></script>
```

## Initiating actions

HTML elements can trigger any number of application `actions` (separated by spaces) in response to any number of `events`.

Furthermore, more than one element is allowed to initiate the same action.

An action notifies the application of "something" happening, but in itself does nothing at all.

All event types supported by the `document` object can be used, plus the following:

- `reveal` - triggered when an element becomes visible in the viewport, on initial page load or after a scroll
- `conceal` - triggered when an element leaves the viewport after a scroll
- `navigate` - triggered by the history api
- `render` - triggered after a successful request and render of the response

```html
<button
  on:click="loadData updateCounter" # \s separated list
  on:mouseenter="doSomething"       # additional events
></button>
```

## Sending requests

HTML elements can trigger server requests in response to an action.

More than one element can handle the same action and can trigger different requests.

When a request enters a `loading` or `error` state multiple (separated by spaces) state related `actions` can be triggered.

Relative endpoints are supported, so given a current URI of `https://www.example.com/some/path`:

- `list-todo` or `./list-todo` will both resolve to `https://www.example.com/some/path/list-todo`
- `../list-todo` will resolve to `https://www.example.com/some/list-todo`
- `/list-todo` will resolve to `https://www.example.com/list-todo`

```html
<div
  on="loadData"    # action name
  get="/list-todo" # get post put delete
  credentials      # XMLHttpRequest.withCredentials
  h-HEADER_NAME="HEADER_VALUE" # custom headers

  once             # send the request only once
  debounce="1000"  # milliseconds
  throttle="1000"  # milliseconds

  # after append before prepend replaceChildren(default) replaceWith
  pos="replaceChildren"

  if:loading="loadingData" # \s separated list
  if:error="failedLoad"    # \s separated list
></div>
```

## Cascading requests

Sometimes it may be necessary to trigger a request only when and if another request completes successfully.

The `render` event exists for this exact purpose.

In the following example:

- clicking the button initiates the `loadA` action
- the first div populates its contents with the response of `/a.html` and initiates the `loadB` action
- the second div populates its contents with the response of `/b.html`

```html
<button
  on:click="loadA"
>click me</button>
<div
  on="loadA"
  get="/a.html"
  on:render="loadB" # \s separated list
></div>
<div
  on="loadB"
  get="/b.html"
></div>
```

## Handling state actions

HTML elements can configure any number of attributes in response to state `actions` by prepending their names with `$`.

Again, multiple elements can handle the same action and configure their attributes differently.

```html
<div
  if="failedLoad" # action name
  $class="bg-red" # "class" while the action is active
></div>
```

## Form/Field validity

Invalid fields and forms do not cause server requests, but do enter an `invalid` state and trigger appropriate `actions` if requested.

In the following example:

- the first div will be visible initially as well as when the inputs value becomes a valid email
- the second div will be visible only when the inputs value becomes an invalid email

```html
<input
  type="email"
  if:invalid="invalidEmail" # \s separated list
>
<div
  if="invalidEmail" # action name
  $style="display: none"
>valid</div>
<div
  if="invalidEmail"
  style="display: none"
  $style       # "style" while the action is active
>invalid</div>
```

## Using the history api

HTML elements can use the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) by initiating the special `pushState` and `replaceState` actions.

`on:navigate` is not triggered on initial page load by design, to facilitate full page server rendering.

In the following example:

- clicking on the first link performs a `pushState` to "/" and replaces the contents of the div with the response of "/content"
- clicking on the second link performs a `pushState` to "/news" and replaces the contents of the div with the response of "/news/content"
- clicking on the third link performs a `replaceState` to "/contacts", replaces the contents of the div with the response of "/contacts/content" and initiates the `doSomethingElse` action

```html
<a
  on:click="pushState"
  href="/"
>Home</a>
<a
  on:click="pushState"
  href="/news"
>News</a>
<a
  on:click="replaceState doSomethingElse"
  href="/contacts"
>Contacts</a>
<div
  on:navigate="loadContent"
  on="loadContent"
  get="content"
></div>
```

## That's all

No, truly, there's nothing else 😅

Though, it should be enough to handle 99% of actually useful HTMX use-cases.

If a feature of HTMX is missing, that means one of the following:

- it is made unnecessary by a more flexible API
- it is downright evil and/or going against the spirit of [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) (e.g JSON endpoints, local templates and most forms of local state)
- it wasn't implemented yet
