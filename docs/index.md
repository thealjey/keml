# KEML

**KEML — Actions over abstractions.**  
*Enhance HTML with expressive, declarative attributes that connect your frontend
directly to your server logic.*

![min+gzip](https://img.shields.io/badge/min%2Bgzip-3.3kb-brightgreen)
![Latest Release](https://img.shields.io/npm/v/keml)
![License](https://img.shields.io/github/license/thealjey/keml)
![Open Issues](https://img.shields.io/github/issues/thealjey/keml)
![Open PRs](https://img.shields.io/github/issues-pr/thealjey/keml)
[![Docs](https://img.shields.io/badge/docs-online-blue)](https://thealjey.github.io/keml/)

KEML is a modern HTML extension that adds powerful, declarative attributes to
standard markup. With KEML, you define behaviors like form submission,
navigation, state transitions, and conditional rendering directly in your HTML
— all handled by the server. There's no client-side JavaScript to write, manage,
or debug. Just clean, maintainable, server-driven apps.

KEML builds on the core idea that HTML can drive your application's behavior.
Inspired by the elegance of HTMX (https://htmx.org), KEML takes that vision
further — removing limitations, embracing composability, and keeping everything
within your markup.

No selectors. No JavaScript. No surprises.  
Just expressive, maintainable, declarative HTML.

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

#### How is KEML different?

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
