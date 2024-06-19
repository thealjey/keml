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
1. `result` - triggered after a successful request

## Attributes

- any attribute that starts with `on:` and contains a space separated list of
  actions to initiate

## Example

- moving the mouse cursor into the button initiates the `doSomething` action
- clicking the button initiates two actions: `loadData` and `updateCounter`
- nothing happens as a result, since none of the elements subscribe to either
  of these actions

```html
<button on:mouseenter="doSomething"
        on:click="loadData updateCounter"
>
  click me
</button>
```
