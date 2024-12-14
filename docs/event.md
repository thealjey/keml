# Initiating actions

HTML elements can trigger any number of application actions in response to any
number of events.

Furthermore, more than one element is allowed to initiate the same action.

An action notifies the application of "something" happening, but in itself does
nothing at all.

All event types supported by the document object can be used, plus the
following:

1. `reveal` - triggered when an element becomes visible in the viewport, on
   initial page load or after a scroll
1. `conceal` - triggered when an element leaves the viewport after a scroll
1. `navigate` - triggered by the history api
1. `result` - triggered after a successful request and render of a response (you
   can already rely on new attributes being present and working when this event
   is triggered)

All events bubble to the root of the dom tree.

## Attributes

- any attribute that starts with `on:` and contains a space separated list of
  actions to initiate
- any attribute that starts with `event:` and contains a comma separated list
  of name and value pairs separated by `=`; the value part is optional and will
  default to `true` if omitted; every key and value pair has to match the event
  object, otherwise the event handling is skipped; can be used for associating
  hotkeys with an element, for example

## Basic Example

- moving the mouse cursor into the button initiates the `doSomething` action
- clicking the button initiates two actions: `loadData` and `updateCounter`
- nothing happens as a result, since none of the elements subscribe to any
  of these actions

```html
<button
  on:mouseenter="doSomething"
  on:click="loadData updateCounter"
>
  click me
</button>
```

## Hotkey Example

- putting the cursor inside of the input and pressing `Alt+Esc` initiates the
  `hotkeysAreCool` action

```html
<input
  on:keyup="hotkeysAreCool"
  event:keyup="code=Escape, altKey"
>
```

## Bubbling Example

- when you click on the image the `handleClick` action of a button is initiated,
  because it is the first matching `on:<event name>` of a parent element
- this will work with any number of nesting levels (e.g. global hotkeys on the
  body element)

```html
<button on:click="handleClick">
  <img src="bat-cat.jpg">
</button>
```

Please be mindful that all actions are, by design, global for a page that they
are used on.

It is your responsibility to generate unique action names if you want to be
certain that no other parts of the application will be affected by the actions
that you trigger.

Example of a potential pitfall:

```html
<button
  on:click="loadData"
  on="loadData"
  get="/data.html"
>
  click me
</button>
<button
  on:click="loadData"
  on="loadData"
  get="/data.html"
>
  click me
</button>
```

In the example above we can imagine that it was the same button component,
simply rendered twice.

But, they are two distinct elements on the page that trigger and subscribe to
the same action `loadData`.

Thus, when you click either one of them, 2 (!) network requests will be sent to
the server.
