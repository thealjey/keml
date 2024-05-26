# KEML <sub>embrace the html ❤️</sub>

An [HTMX](https://htmx.org/) (thank you for the inspiration) alternative with a different API that is meant to be simpler and more flexible at the same time.

Optimized using [Google Closure Compiler](https://developers.google.com/closure/compiler/) (thank you for an awesome and, sadly, underappreciated tool) to have a hilariously tiny file size (~4.4k without gz, which is ~11x smaller than HTMX), although performance is always prioritized over file size.

Great care is taken to guarantee the absolute maximum performance and minimal memory usage, minimizing the amount of work that not only the library is doing, but also that the browser has to do.

The existing DOM is patched in the most efficient way possible by default instead of being overwritten, without a need for any plugins or configuration.

Does not require for you to learn and use any selector syntax, because there's no need for selectors at all as they are replaced by "actions" instead.

The server responses are considered black-box, there is no magic title or meta tag behavior, no response splitting or selecting parts of it.

There is no inheritance.

The API is so stupid simple that it may not even require a documentation website.

## Installation

There is no programmatic API, nothing is exported in JS, nothing to install or configure.

You load the library from a CDN and forget that JS even existed at all.
```html
<script src="https://unpkg.com/keml"></script>
```

## Initiating actions

HTML elements can trigger any number of application actions in response to any number of events.

Furthermore, more than one element is allowed to initiate the same action.

An action notifies the application of "something" happening, but in itself does nothing at all.

All event types supported by the document object can be used, plus the following:

- `reveal` - triggered when an element becomes visible in the viewport, on initial page load or after a scroll
- `conceal` - triggered when an element leaves the viewport after a scroll
- `navigate` - triggered by the history api
- `result` - triggered after a successful request

#### Relevant attributes:

- any attribute that starts with `on:` and contains a space separated list of actions to initiate

#### In the following example:

- moving the mouse cursor into the button initiates the `doSomething` action
- clicking the button initiates two actions: `loadData` and `updateCounter`
- nothing happens as a result, since none of the elements subscribe to either of these actions

```html
<button
  on:mouseenter="doSomething"
  on:click="loadData updateCounter"
>click me</button>
```

## Sending requests

HTML elements can trigger server requests in response to an action.

More than one element can handle the same action and can trigger different requests.

Relative endpoints are supported, so given a current URI of "https:/[]()/www[]().example.[]()com/some/path":

- "list-todo" or "./list-todo" will both resolve to "https:/[]()/www[]().example.[]()com/some/path/list-todo"
- "../list-todo" will resolve to "https:/[]()/www[]().example.[]()com/some/list-todo"
- "/list-todo" will resolve to "https:/[]()/www[]().example.[]()com/list-todo"

#### Relevant attributes:

- `on` subscribes the element to a single action, initiated by any element, including the current one
- `href`, `action`, `src`, `get`, `post`, `put` or `delete` are used to specify an endpoint to call
- `method`, `get`, `post`, `put` or `delete` are used to specify the HTTP method to use in the request
- `debounce` specifies a number of milliseconds by which to debounce a request
- `throttle` specifies a number of milliseconds by which to throttle a request
- any attribute that starts with `h-` and contains a custom request header value
- `credentials` with any value or none at all, sets the [XMLHttpRequest.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials) value to `true`
- `once` with any value or none at all, automatically removes the `on` attribute after a successful request

#### In the following example:

- clicking the button initiates the `doSomething` action
- the div subscribes to that action and sends a "GET" request to "/data"
- the checkbox subscribes to that action and sends a "POST" request to "/toggle" with a multipart encoded body containing its value
- nothing else happens since neither of the elements specifies what to do with their respective server responses

```html
<button
  on:click="doSomething"
>click me</button>
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

## Rendering responses

HTML elements that trigger requests can initiate multiple result actions after a successful server response.

Multiple elements can initiate the same result action, thus triggering the render of a different response under the same action name.

Multiple elements can subscribe to the same result action and render the same server response.

Computes the minimum set of DOM mutations necessary to synchronize the document with the server response.

If the server response can be determined to be the same as what is currently rendered in the document, no changes are applied at all.

#### Relevant attributes:

- `result` specified on an element that performs a request and contains a space separated list of result actions to initiate
- `render` specified on any element, including the same one that triggered the request and contains the render action name to subscribe to
- `position` controls the render strategy to apply to itself:
  - `replaceChildren` (default) replaces all of the elements' children with the server response
  - `replaceWith` replaces the element itself with the server response
  - `before` renders the server response directly before the current element
  - `after` renders the server response directly after the current element
  - `prepend` prepends the server response before the first child of the current element
  - `append` appends the server response after the last child of the current element

#### In the following example:

- clicking the button initiates the `getUserCount` action
- the button itself subscribes to that action using the `on` attribute
- the button sends a "GET" request to "/user-count"
- upon successfully receiving the response the button initiates the `userCount` result action
- the div subscribes to the `userCount` action and renders the server response into itself
- the span subscribes to the `userCount` action and replaces itself with the server response

```html
<button
  on:click="getUserCount"
  on="getUserCount"
  get="/user-count"
  result="userCount"
>click me</button>
<div
  render="userCount"
></div>
<span
  render="userCount"
  position="replaceWith"
></span>
```

## Cascading requests

Sometimes it may be necessary to send a request only when and if another request completes successfully.

The `result` event exists for this exact purpose.

Keep in mind that if the request results in this element no longer existing or no longer having the `on:result` attribute the event will not be triggered.

#### Relevant attributes:

- `on:result` is just an event, same as any other; triggered after a successful completion of a server request, on the same element that launched it

#### In the following example:

- clicking the button initiates the `loadA` action, sends a "GET" request to "/a.html" and initiates the `loadB` action after a successful response
- the div subscribes to `loadB` and sends a "GET" request to "/b.html"
- since neither element specifies a `result` attribute, the server responses are discarded

```html
<button
  on:click="loadA"
  on="loadA"
  get="/a.html"
  on:result="loadB"
>click me</button>
<div
  on="loadB"
  get="/b.html"
></div>
```

## State actions

HTML elements can configure any number of attributes in response to state `actions` by prepending their names with a `$`.

Multiple elements can handle the same action and configure their attributes differently.

#### Relevant attributes:

- `if:loading` specified on an element that launches a request, contains a space separated list of state actions to turn ON immediately before starting a request and to turn OFF immediately after a request completes
- `if:error` specified on an element that launches a request, contains a space separated list of state actions to turn OFF immediately before starting a request and to turn ON immediately after a request fails
- `if:invalid` specified on a form or a form field, contains a space separated list of state actions to turn ON when the element becomes invalid and to turn OFF when the element becomes valid (invalid forms and fields do not trigger server requests)
- `if` specified on any element, including the same one that launched the request, and subscribes to a single state action

#### In the following example:

- the first div is initially visible and the second div is initially hidden
- clicking the button
  - initiates the `loadData` action
  - turns ON the `isLoadingData` state action, thus the first div becomes invisible and the second visible
  - sends a "GET" request to "/data"
  - after completion of the request turns OFF the `isLoadingData` state action, thus the first div becomes visible and the second invisible again

```html
<button
  on:click="loadData"
  on="loadData"
  get="/data"
  if:loading="isLoadingData"
>click me</button>
<div
  if="isLoadingData"
  $style="display: none"
>not loading</div>
<div
  if="isLoadingData"
  style="display: none"
  $style
>loading</div>
```

#### In the following example:

- the first div is initially visible and the second div is initially hidden
- clicking the button
  - initiates the `loadWrong` action
  - turns OFF the `isError` state action, which does not change the visibility of the divs
  - sends a "GET" request to "/non-existent"
  - after completion of the request turns ON the `isError` state action, because the request has failed, thus the first div becomes invisible and the second visible

```html
<button
  on:click="loadWrong"
  on="loadWrong"
  get="/non-existent"
  if:error="isError"
>click me</button>
<div
  if="isError"
  $style="display: none"
>no error</div>
<div
  if="isError"
  style="display: none"
  $style
>error</div>
```

#### In the following example:

- the first div will be visible initially as well as when the inputs' value becomes a valid email
- the second div will be visible only when the inputs' value becomes an invalid email

```html
<input
  if:invalid="invalidEmail"
  type="email"
>
<div
  if="invalidEmail"
  $style="display: none"
>valid</div>
<div
  if="invalidEmail"
  style="display: none"
  $style
>invalid</div>
```

## Resetting a form

The `reset` special action will automatically reset a form.

#### In the following example:

- the form will be automatically reset after a submit (please do note that actions are initiated sequentially from left to right; so if the action list was in the reverse order i.e "reset handleSubmit", the form would be reset before submit, making it invalid because the input is required, triggering no actual server request)

```html
<form
  on:submit="handLeSubmit reset"
  on="handLeSubmit"
  method="post"
  action="/server-path"
>
  <input name="name" required>
  <button>Submit</button>
</form>
```

## Using the history api

HTML elements can use the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) by initiating the special `pushState` and `replaceState` actions.

#### Relevant attributes:

- `on:navigate` is just an event, same as any other, triggered on any element that specifies this attribute when the browser navigates using the history API, but not on the initial page load to facilitate full page server rendering (SSR)

#### In the following example:

- clicking on the first link performs a `pushState` to "/" and replaces the contents of the div with the response of "/content"
- clicking on the second link performs a `pushState` to "/news" and replaces the contents of the div with the response of "/news/content"
- clicking on the third link performs a `replaceState` to "/contacts", replaces the contents of the div with the response of "/contacts/content"

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
  on:click="replaceState"
  href="/contacts"
>Contacts</a>
<div
  on:navigate="loadContent"
  on="loadContent"
  get="content"
  result="pageContent"
  render="pageContent"
></div>
```

## That's all

No, truly, there's nothing else 😅

Though, it should be enough to handle 99% of actually useful HTMX use-cases.

If a feature of HTMX is missing, that means one of the following:

- it is made unnecessary by a more flexible API
- it is downright evil and/or going against the spirit of [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) (e.g JSON endpoints, local templates and most forms of local state)
- it wasn't implemented yet
