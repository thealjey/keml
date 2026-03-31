# Initiating actions

HTML elements can trigger any number of application actions in response to any
number of events.

More than one element can initiate the same action.

An action signals that something has happened, but does nothing by itself.

All event types supported by the `document` object can be used, along with
the following custom ones:

1. `reveal` — triggered when an element becomes visible in the viewport, either
on initial page load or after scrolling
1. `conceal` — triggered when an element leaves the viewport after scrolling
1. `navigate` — triggered by the History API
1. `result` — triggered after a successful request and rendering of a response
(you can rely on new attributes being present and working when this event is
triggered)

All events bubble up to the root of the DOM tree.

## Attributes

- Any attribute that starts with `on:` and contains a space-separated list of
  actions to initiate
- Any attribute that starts with `event:` and contains a comma-separated list of
  name-value pairs separated by `=`  
  The value part is optional, and the key will be checked only for truthiness if
  omitted.  
  Each key and value pair must match the event object; otherwise, the event 
  handling is skipped.  
  Can be used, for example, to associate hotkeys with an element.

## Basic Example

- Moving the mouse cursor into the button initiates the `doSomething` action
- Clicking the button initiates two actions: `loadData` and `updateCounter`
- Nothing happens as a result, since none of the elements subscribe to any of
  these actions

```html
<button on:click="loadData updateCounter" on:mouseenter="doSomething">
  click me
</button>
```

## Hotkey Example

- putting the cursor inside of the input and pressing `Alt+Esc` initiates the
  `hotkeysAreCool` action

```html
<input event:keyup="code=Escape, altKey" on:keyup="hotkeysAreCool">
```

## Bubbling Example

- When you click the image, the button’s `handleClick` action is initiated 
  because it is the first matching `on:<event name>` on a parent element.
- This works with any number of nesting levels (e.g., global hotkeys on the 
  body element)

```html
<button on:click="handleClick">
  <img src="bat-cat.jpg">
</button>
```

--------------------------------------------------------------------------------

!!! warning "Warning"
    Please be mindful that all actions are, by design, global within the page
    they are used on.

    It is your responsibility to generate unique action names to ensure that no
    other parts of the application are affected by the actions you trigger.

Example of a potential pitfall:

```html
<button get="/data.html" on="loadData" on:click="loadData">click me</button>
<button get="/data.html" on="loadData" on:click="loadData">click me</button>
```

In the example above, we can imagine that it is the same button component,
simply rendered twice.

But, they are two distinct elements on the page that trigger and subscribe to
the same action `loadData`.

Thus, when you click either of them, two network requests will be sent to the
server.
