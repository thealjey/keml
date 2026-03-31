# Logging

Sometimes the information that is available statically, by just reading the
HTML, may not be enough and you may need to peek into the runtime value of some
important variable.

With a well-designed API, such situations should be rare. But, unfortunately,
the real world is messy and they cannot be fully avoided.

This is where the dedicated `log` attribute comes in.

It will do nothing at all most of the time and is generally harmless to add,
even to every single element. However, it is still a debugging flag and, from a
purely aesthetic point of view, should not be left enabled in production.

All that it will ever do is log to the JavaScript console some information that
the element deems important at a particular moment in time.

!!! info "Info"
    Currently, this attribute only logs event objects in the presence of an
    `event:<event name>` attribute, right before performing the matching for
    it. But, the `log` attribute itself is meant to be general purpose and its
    functionality may be extended in the future.

## Example

When this input receives a keydown event, KEML logs the browser event object
before checking if the key is `Enter`.

```html
<input event:keydown="key=Enter" log on:keydown="someAction">
```

What if you don't know what fields the event object has or what values they can
take?

In that case, simply leave the `event:keydown` attribute empty, trigger the
event, and observe the event object printed to the console — `on:keydown` must
still have a value, otherwise KEML will skip matching it.

```html
<input event:keydown log on:keydown="someAction">
```
