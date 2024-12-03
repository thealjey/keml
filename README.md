<img src="docs/img/logo192.png" style="float: left; margin-right: 25px">

## What is KEML?

KEML is a lightweight flexible alternative to [HTMX](https://htmx.org/), built
around the concept of actions.

The ideas that HTMX has recently made popular are, frankly, the best that the
web community collectively has ever had.

However, like most great ideas, they are far more important than any actual
specific implementation.

Despite offering a multitude of conveniences over HTMX and much greater
flexibility, KEML still manages to be absolutely tiny in comparison.  
KEML v3 is ~4.7k minified and not gzipped and HTMX v2 is ~49.2k minified and not
gzipped (~10.5x smaller).

## Motivation

Being small and fast and configuration/plugin free is not enough, when you are
trying to compete with a well established and popular library.

#### So, why does KEML need to exist?

KEML was born out of the classic 1-to-1 problem of the traditional jQuery-esque
web application, that the HTMX api does nothing to address.

Consider the following "idiomatic" HTMX code:

```html
<button
  hx-post="/clicked"
  hx-trigger="click"
  hx-target="#result"
  hx-swap="innerHTML"
>
  Click Me!
</button>

<div id="result"></div>
```

Here the button element:

1. can only react to exactly 1 event ("click")
1. can only do 1 thing when that event happens (send a request to "/clicked")
1. cannot delegate the request-sending to some other element/-s
1. can only render the result into 1 (usually) target element
1. has to know where that element is on the page, what its "id" and/or "class"
   attributes are
1. has to decide for the target element the exact "hx-swap", of which there can
   only be 1

Out of these limitations arise:

1. the need for a custom selector syntax built on top of the normal
   css-selector syntax
1. the need for selectors in the first place, which you need to learn and
   understand to use the library effectively
1. the implicit special handling of certain elements, like title and meta,
   present in the server response
1. out of band swaps
1. response selectors
1. "hx-preserve"
1. etc, etc, etc...

All which, are meant to solve real tangible application needs, but in the
process of doing that over-complicate things that do not need to be
complicated.

## How is KEML different?

Consider the following KEML code, that works with the same backend:

```html
<html>

<head>
  <title render="result"></title>
</head>

<body>
  <button
    on:click="handleClick doSomethingElse"
    on:dblclick="handleDoubleClick"
  >
    Click Me!
  </button>

  <button on:click="handleClick">Click Me, maybe?!</button>

  <input
    on="handleClick"
    post="/clicked"
    type="text"
    name="input1"
    result="result"
  >

  <input
    on="handleClick"
    put="/notification"
    type="text"
    name="input2"
  >

  <div
    render="result"
    position="replaceWith"
  ></div>

  <p
    render="result"
    position="append"
  ></p>
</body>

</html>
```

1. both buttons initiate the same "handleClick" action on "click"
1. the first button actually initiates two independent actions on "click", that
   could both do completely different things
1. the first button also reacts to the double click event
1. neither of the buttons needs to know how those actions are being handled, if
   at all
1. the two text inputs both handle the "handleClick" action, but send
   completely different requests
1. the first input gives the server response a render-able name "result"
1. neither of the inputs knows anything about the rendering, whether or not
   anything is even going to be rendered at all, where and how
1. the div, p and title elements render the same server response differently
1. the div will be completely replaced with the response
1. the p will append the response after its last child
1. the title will replace all of its children with the response
1. there is nothing special about the title element at all
1. there's no need for ids, classes or selectors and the location of each
   element in the document is completely unimportant

None of the problems that HTMX tries to solve with the complications listed
above even exist in this paradigm!

## Is KEML feature-complete?

While nothing is ever truly complete, the current feature-set should be able to
cover 99% of actually useful HTMX features.

I'm not going to claim that it is completely bug free and supports every
browser under the sun, because it still has a long way to go until that
becomes a reality.

Thus, all constructive feedback and criticism are very welcome!

If a feature of HTMX is missing, that means one of the following:

- it is made unnecessary by a more flexible API
- it is downright evil and/or going against the spirit of
  [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) (e.g JSON endpoints, local
  templates and most forms of local state)
- it wasn't implemented yet
