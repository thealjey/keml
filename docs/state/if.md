Just like [on](../event/on.md) is the input channel for event actions, so too is
the `if` attribute the input channel for state actions.

All of the usage examples are already shown on the [if:\*](./if-colon.md) page.
This page only clarifies what those examples demonstrate.

The `if` attribute allows elements to switch between two possible configurations
of their attributes - one configuration for when a state condition is `true` and
another for when it is `false`.

Any attribute with a name starting with `x-` will trade places with its
unprefixed counterpart while the condition is `true`, and will be restored back
when it is `false`. If a counterpart does not exist, its non-existence will
also be restored.

---

Isn't it great when things are simple and all features work the same? 🤯
