# News

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------

## v3.2

This release changes both everything and nothing at the same time.

It is fully backward compatible, but shares almost no code in common with the
old version.

Nothing in your apps needs to change.  
If they are already working fine - they will continue to do so.

You will be taking advantage of the improved performance, memory efficiency and
correctness/reliability completely for free.

So, what changed?

#### Performance

3.2 does away with trying to be as small as possible at the expense of
everything else.  
It will happily be larger if the payoff is better run-time performance.  
As a result, it has doubled in size to the still incredibly tiny 8kb.

1. no functional code
1. no regular expressions
1. no recursion if it can be avoided
1. minimal allocations
1. low level APIs are used whenever possible
1. no DOM updates outside of the render loop, no matter how trivial
1. dedicated per-attribute intersection observers
1. no subscribing to events not used by the application
1. the [key](render.md#attributes) attribute
1. etc

#### Maintainability

The code is no longer allowed to be an unreadable cryptic mess, whose only
purpose is to be optimally minify-able.

Related functionality is grouped into separate files.

#### Quality

The source code is thoroughly documented and unit tested with 100% coverage.

File imports are automatically verified not to cause any cyclic dependencies.

Since python was never a requirement for the functionality of the project, but
only for the documentation and the examples, having it as an install script was
clearly a mistake that made installing the package through npm potentially
inconvenient.  
That has now been fixed.

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------

## v3.1

### Event Bubbling

Event handling now bubbles up the DOM tree as you would expect.

This is mostly a non-breaking convenience feature.

Previously, it was necessary to make sure that an event is always triggered
on the exact same element that contains the event handling logic.

Like in the following example, using the `inert` attribute to make sure that the
nested image does not "steal" the click events for itself:

```html
<button on:click="handleClick">
  <img
    inert
    src="bat-cat.jpg"
  >
</button>
```

With v3.1, this is no longer the case, because KEML will automatically locate
the first parent element that matches the event.

So, this is now equivalent:

```html
<button on:click="handleClick">
  <img src="bat-cat.jpg">
</button>
```

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------

## v3 is finally out!

It is said that simplicity is hard, and absolute simplicity is hard absolutely.

KEML v3 was that and much more.

And, while a major version of a library could simply be prompted by any breaking
change, what we have here is certainly not that case.

It was probably more like v123, or something like that, behind the scenes with
the sheer number of complete rewrites, head scratching, and a couple of moments
of brilliance.

v3 brings new features, stability, reliability, resilience, performance, memory
efficiency and optimizations that were nigh impossible with v2.

And it does it all while having an even smaller file size.

So, what changed?

#### No Magic

Magic, in programming, can be described as - behaviors determined by nothing
other than naming something a certain way or placing it in a certain place.

And it is almost always a really bad idea.

The so called "special actions" were a major pain in the rear end that came out
of technical limitations and nothing else.

v3 embraces actions to the max, literally everything is controlled by them and
nothing else and there are no special and/or reserved action names at all.

#### Observing the DOM

DOM changes are automatically observed in v3.

Whether an element came from the server on the initial page load, after
subsequent AJAX requests, is created or modified by userland code, by you
changing something through the dev tools DOM Inspector tab, or even by some
browser extension, it makes no difference at all.

That's right, KEML will never be broken by another password manager ever again
:&rpar;

And if you want to use jQuery or React alongside KEML, you totally can. And you
never need to tell it that you've changed something in the document.

#### New Features

v3 comes with a couple of new states, a couple of new ways to perform a redirect
and somewhat of a way to handle hotkeys, but really, nothing Earth-shattering.

The big deal is that the greatly improved codebase allows adding new features
easily and without breaking the existing ones or negatively affecting the
performance.

--------------------------------------------------------------------------------

### Breaking Changes

The only breaking change is the absence of "special" actions.

So, this:

```html
<a
  on:click="pushState"
  href="/something"
></a>
```

Has to turn into this (the same with `replaceState`):

```html
<a
  on:click="someUniqueName"
  on="someUniqueName"
  redirect="pushState"
  href="/something"
></a>
```

The `redirect` attribute cannot contain an endpoint configuration anymore.

And this:

```html
<form on:submit="doSubmit reset"></form>
```

Has to turn into this:

```html
<form
  on:submit="doSubmit resetThisForm"
  reset="resetThisForm"
></form>
```

It looks more verbose, but offers infinitely more flexibility.

--------------------------------------------------------------------------------

That's all, folks!

Happy coding and have an awesome day,  
Eugene K.

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
